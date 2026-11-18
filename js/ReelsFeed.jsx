import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ReelsFeed Component - Cuộn video review đồ ăn định dạng dọc (Shorts)
 * 
 * Tính năng QA & Tối ưu hoá:
 * 1. Autoplay Policy: Mặc định muted: 1 để vượt qua rào cản autoplay của mobile Safari/Chrome.
 *    Hiển thị nút Loa nổi bật để người dùng chạm bật âm thanh.
 * 2. Windowing / Virtualization: Chỉ render tối đa 3 video (trước đó, hiện tại, kế tiếp).
 *    Toàn bộ video khác được hủy khỏi DOM để tránh memory leak và crash trình duyệt khi vuốt qua 50+ video.
 * 3. Dead Link Handling: Bắt sự kiện onError của YouTube Player API để tự động chuyển tiếp
 *    sang video kế tiếp nếu video bị xóa, set private hoặc chặn nhúng.
 */
export default function ReelsFeed({ foods = [] }) {
  // Lọc danh sách các quán có video Shorts
  const reelsList = foods.filter(f => f.video_id || f.videoUrl);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const containerRef = useRef(null);
  const playersRef = useRef({}); // Lưu trữ instance YT.Player { [index]: player }

  // 1. Tải YouTube Iframe Player API nếu chưa có
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        setIsPlayerReady(true);
      };
    } else {
      setIsPlayerReady(true);
    }
  }, []);

  // 2. Xử lý Link Chết (Dead Link Handling)
  const handlePlayerError = useCallback((index, errorCode) => {
    console.warn(`[Reels QA] Phát hiện video lỗi (mã: ${errorCode}) tại index: ${index}. Tự động skip...`);
    // Mã lỗi 100: Video bị xóa/private. Mã 101/150: Video chặn nhúng ngoài YouTube.
    if (index < reelsList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [reelsList.length]);

  // 3. Khởi tạo và đồng bộ YouTube Player theo Virtual Window [currentIndex - 1, currentIndex, currentIndex + 1]
  useEffect(() => {
    if (!isPlayerReady || !window.YT || reelsList.length === 0) return;

    const visibleIndices = [currentIndex - 1, currentIndex, currentIndex + 1].filter(
      i => i >= 0 && i < reelsList.length
    );

    // Hủy các player nằm ngoài Virtual Window để giải phóng bộ nhớ (Chống Memory Leak)
    Object.keys(playersRef.current).forEach(key => {
      const idx = Number(key);
      if (!visibleIndices.includes(idx)) {
        if (playersRef.current[idx] && typeof playersRef.current[idx].destroy === 'function') {
          playersRef.current[idx].destroy();
        }
        delete playersRef.current[idx];
      }
    });

    // Khởi tạo player cho các video trong cửa sổ hiển thị
    visibleIndices.forEach(idx => {
      const food = reelsList[idx];
      const videoId = food.video_id || (food.videoUrl ? food.videoUrl.split('/').pop() : '');
      const domId = `yt-player-${idx}`;

      if (!playersRef.current[idx] && document.getElementById(domId)) {
        playersRef.current[idx] = new window.YT.Player(domId, {
          videoId: videoId,
          playerVars: {
            autoplay: idx === currentIndex ? 1 : 0,
            mute: isMuted ? 1 : 0,
            controls: 0,          // TẮT TOÀN BỘ CONTROL MẶC ĐỊNH CỦA YOUTUBE
            disablekb: 1,         // Vô hiệu hóa phím điều hướng
            modestbranding: 1,    // Ẩn logo YouTube
            rel: 0,               // Không hiện video liên quan
            fs: 0,                // Tắt nút toàn màn hình
            playsinline: 1,       // Phát trực tiếp trên iOS thay vì mở full native
            loop: 1,              // Lặp lại video
            playlist: videoId,    // Cần thiết để loop hoạt động
            iv_load_policy: 3     // Tắt chú thích trên video
          },
          events: {
            onReady: (event) => {
              if (idx === currentIndex) {
                if (isMuted) event.target.mute();
                else event.target.unMute();
                event.target.playVideo();
              } else {
                event.target.pauseVideo();
              }
            },
            onError: (event) => {
              handlePlayerError(idx, event.data);
            }
          }
        });
      } else if (playersRef.current[idx]) {
        // Cập nhật trạng thái play/pause khi currentIndex thay đổi
        if (idx === currentIndex) {
          if (isMuted) playersRef.current[idx].mute();
          else playersRef.current[idx].unMute();
          playersRef.current[idx].playVideo();
        } else {
          playersRef.current[idx].pauseVideo();
        }
      }
    });
  }, [currentIndex, isPlayerReady, isMuted, reelsList, handlePlayerError]);

  // 4. Bật / Tắt âm thanh (Autoplay Unmute User Gesture)
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const activePlayer = playersRef.current[currentIndex];
    if (activePlayer) {
      if (nextMuted) activePlayer.mute();
      else activePlayer.unMute();
    }
  };

  // 5. Thao tác vuốt cuộn (Touch & Wheel Navigation)
  const handleScroll = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(container.scrollTop / itemHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reelsList.length) {
      setCurrentIndex(newIndex);
    }
  };

  if (reelsList.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white p-4">
        <p>Đang tải dữ liệu video review Quy Nhơn...</p>
      </div>
    );
  }

  // Danh sách các index được mount trong DOM (Virtual Window = 3)
  const visibleIndices = [currentIndex - 1, currentIndex, currentIndex + 1].filter(
    i => i >= 0 && i < reelsList.length
  );

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Container cuộn dọc Reels */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Spacer tạo chiều cao ảo toàn phần */}
        <div 
          className="relative w-full"
          style={{ height: `${reelsList.length * 100}%` }}
        >
          {visibleIndices.map(idx => {
            const food = reelsList[idx];
            const isCurrent = idx === currentIndex;
            const isLiked = !!likedMap[food.id];

            return (
              <div
                key={food.id || idx}
                className="absolute left-0 right-0 h-full w-full snap-start snap-always flex items-center justify-center overflow-hidden bg-black"
                style={{ top: `${idx * 100}%` }}
              >
                {/* 1. YouTube Iframe Video Player Container */}
                <div className="relative w-full h-full pointer-events-none flex items-center justify-center">
                  <div id={`yt-player-${idx}`} className="w-full h-full object-cover pointer-events-none" />
                  
                  {/* Poster image fallback */}
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="absolute inset-0 w-full h-full object-cover -z-10 filter brightness-90"
                  />
                  {/* Dark gradient overlay cho chữ sắc nét */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
                </div>

                {/* 2. Nút Loa Bật/Tắt Âm Thanh (Autoplay QA Solution) */}
                <div className="absolute top-4 right-4 z-30 pointer-events-auto">
                  <button
                    onClick={toggleMute}
                    className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:scale-110 active:scale-95 transition"
                    title={isMuted ? "Chạm để bật tiếng" : "Tắt tiếng"}
                  >
                    {isMuted ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                        🔇 Chạm bật tiếng
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                        🔊 Đang phát tiếng
                      </span>
                    )}
                  </button>
                </div>

                {/* 3. Action Bar bên phải: Tim, Bình luận, Chia sẻ, Chỉ đường */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-30 pointer-events-auto">
                  {/* Avatar quán */}
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-xl bg-white">
                    <img src={food.image} alt={food.restaurant} className="w-full h-full object-cover" />
                  </div>

                  {/* Thả tim */}
                  <button 
                    onClick={() => setLikedMap(prev => ({ ...prev, [food.id]: !prev[food.id] }))}
                    className="flex flex-col items-center text-white"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-2xl">
                      {isLiked ? '❤️' : '🤍'}
                    </div>
                    <span className="text-[11px] font-bold mt-1">
                      {(food.likesCount || 1200) + (isLiked ? 1 : 0)}
                    </span>
                  </button>

                  {/* Chỉ đường Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((food.restaurant || food.name) + ' Quy Nhơn')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#F5B041] hover:bg-[#F39C12] text-stone-900 font-extrabold text-[11px] px-2.5 py-2 rounded-xl shadow-lg flex flex-col items-center gap-0.5"
                  >
                    🧭
                    <span>Đến quán</span>
                  </a>
                </div>

                {/* 4. Thông tin quán bên dưới */}
                <div className="absolute left-4 bottom-6 right-20 text-white z-30 pointer-events-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-base text-white drop-shadow-md">
                      @{food.restaurant}
                    </h3>
                    <span className="bg-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {food.distanceText || 'Quy Nhơn'}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 font-medium line-clamp-2 mb-2">
                    {food.name} • {food.description || food.recommendReason}
                  </p>
                  <div className="text-[11px] font-bold text-amber-300">
                    💰 {food.priceRange} • {food.openTime}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
