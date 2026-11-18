import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ReelsFeed Component - Cuộn video review đồ ăn định dạng dọc (Shorts)
 * 
 * Tính năng QA & Tối ưu hoá chuyên sâu:
 * 1. Autoplay Policy (Muted Autoplay):
 *    - Mặc định muted: 1 để vượt qua rào cản autoplay của mobile Safari/Chrome.
 *    - Nút Loa hiển thị rõ ràng trên video để người dùng chủ động chạm bật tiếng (User Gesture).
 * 2. Memory Leak Prevention (Virtualization / Windowing):
 *    - Container sử dụng CSS Scroll Snap native mượt mà.
 *    - Chỉ mount Iframe cho video hiện tại (active) và video kế tiếp (preload).
 *    - Tất cả các slide khác chỉ hiển thị ảnh Poster tĩnh nhẹ nhàng, không mount Iframe
 *      giúp giải phóng GPU/VRAM, không làm crash trình duyệt khi vuốt qua 50+ video.
 * 3. Dead Link Handling (Tự động bỏ qua video lỗi):
 *    - Lắng nghe sự kiện onError của YouTube Iframe API.
 *    - Tự động skip mượt sang video tiếp theo nếu link chết, video bị xóa hoặc tắt tính năng nhúng.
 */
export default function ReelsFeed({ foods = [] }) {
  // Lọc danh sách: ưu tiên các quán có video Shorts
  const reelsList = foods.filter(f => f.video_id || f.videoUrl);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState({});

  const containerRef = useRef(null);

  // 1. Tự động chuyển tiếp khi video lỗi (Dead Link QA)
  const handlePlayerError = useCallback((index, errorCode) => {
    console.warn(`[Reels QA] Video index ${index} bị lỗi (mã: ${errorCode}). Tự động chuyển tiếp...`);
    if (index < reelsList.length - 1) {
      if (containerRef.current) {
        const itemHeight = containerRef.current.clientHeight;
        containerRef.current.scrollTo({
          top: (index + 1) * itemHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [reelsList.length]);

  // 2. Lắng nghe thông điệp postMessage từ YouTube Iframe (bắt sự kiện onError)
  useEffect(() => {
    const handleMessage = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.event === 'onError') {
          handlePlayerError(currentIndex, data.info);
        }
      } catch (err) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentIndex, handlePlayerError]);

  // 3. Xử lý sự kiện cuộn snap để cập nhật video đang xem
  const handleScroll = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const itemHeight = container.clientHeight;
    if (itemHeight <= 0) return;

    const newIndex = Math.round(container.scrollTop / itemHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reelsList.length) {
      setCurrentIndex(newIndex);
    }
  };

  // 4. Bật / Tắt âm thanh (Autoplay Unmute User Gesture)
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // Gửi lệnh postMessage tới iframe đang phát
    const activeIframe = document.getElementById(`yt-iframe-${currentIndex}`);
    if (activeIframe && activeIframe.contentWindow) {
      const cmd = nextMuted ? 'mute' : 'unMute';
      activeIframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: cmd, args: [] }),
        '*'
      );
    }
  };

  if (reelsList.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white p-4">
        <p className="font-medium text-sm">Đang tải video review Quy Nhơn...</p>
      </div>
    );
  }

  // Windowing: chỉ mount Iframe cho video hiện tại và video kế tiếp (size = 2)
  const shouldMountIframe = (idx) => idx === currentIndex || idx === currentIndex + 1;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Container cuộn dọc Reels dạng snap-mandatory */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reelsList.map((food, idx) => {
          const isCurrent = idx === currentIndex;
          const isLiked = !!likedMap[food.id];
          const videoId = food.video_id || (food.videoUrl && food.videoUrl.includes('shorts/') ? food.videoUrl.split('shorts/')[1].split('?')[0] : '');

          return (
            <div
              key={food.id || idx}
              className="relative w-full h-full snap-start snap-always shrink-0 overflow-hidden bg-black flex items-center justify-center"
            >
              {/* Phone Viewport Wrapper: Canh giữa tối đa 480px trên desktop, full màn hình trên mobile */}
              <div className="relative w-full max-w-[480px] h-full overflow-hidden bg-stone-950 flex items-center justify-center shadow-2xl">

                {/* 1. Video Container & Poster Fallback */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                  
                  {/* Iframe Mount Box (Chỉ mount khi nằm trong Virtual Window) */}
                  {shouldMountIframe(idx) && videoId ? (
                    <iframe
                      id={`yt-iframe-${idx}`}
                      src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`}
                      className="absolute inset-0 w-full h-full object-cover border-0 z-0 pointer-events-none"
                      style={{ width: '100%', height: '100%' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={food.restaurant}
                    />
                  ) : null}

                  {/* Ảnh Poster chất lượng cao (hiển thị ngay không lo màn hình đen) */}
                  <img
                    src={food.image}
                    alt={food.name}
                    className="absolute inset-0 w-full h-full object-cover filter brightness-90 -z-10"
                  />

                  {/* Gradient Overlay tạo độ tương phản cho văn bản */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none z-10" />
                </div>

                {/* 2. Top Badges & Nút Loa (QA Case 1: Autoplay & Mute Policy) */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Live Reels
                    </span>
                    {videoId && (
                      <span className="bg-red-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-md">
                        ▶ Shorts
                      </span>
                    )}
                  </div>

                  <button
                    onClick={toggleMute}
                    className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition flex items-center gap-1.5 text-xs font-bold shadow-lg cursor-pointer"
                  >
                    <span>{isMuted ? '🔇 Chạm bật tiếng' : '🔊 Đang bật tiếng'}</span>
                  </button>
                </div>

                {/* 3. Action Bar bên phải: Avatar, Thả tim, Chỉ đường */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3.5 z-30 pointer-events-auto">
                  {/* Avatar quán */}
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-xl bg-white">
                    <img src={food.image} alt={food.restaurant} className="w-full h-full object-cover" />
                  </div>

                  {/* Thả tim */}
                  <button
                    onClick={() => setLikedMap(prev => ({ ...prev, [food.id]: !prev[food.id] }))}
                    className="flex flex-col items-center text-white"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition">
                      {isLiked ? '❤️' : '🤍'}
                    </div>
                    <span className="text-[11px] font-bold mt-1 drop-shadow-md">
                      {(food.likesCount || 1200) + (isLiked ? 1 : 0)}
                    </span>
                  </button>

                  {/* Nút chỉ đường Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((food.restaurant || food.name) + ' Quy Nhơn')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#F5B041] hover:bg-[#F39C12] text-stone-900 font-extrabold text-[11px] px-2.5 py-2 rounded-xl shadow-lg flex flex-col items-center gap-0.5 hover:scale-105 active:scale-95 transition border border-amber-200"
                  >
                    <span>🧭 Đến quán</span>
                  </a>
                </div>

                {/* 4. Thông tin quán bên dưới */}
                <div className="absolute left-4 bottom-6 right-20 text-white z-30 pointer-events-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-base text-white drop-shadow-md">
                      @{food.restaurant}
                    </h3>
                    <span className="bg-rose-500/90 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {food.distanceText || 'Quy Nhơn'}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 font-medium line-clamp-2 mb-1.5 leading-relaxed">
                    {food.name} • {food.description || food.recommendReason}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[11px] font-bold text-amber-300">
                      💰 {food.priceRange}
                    </span>
                    <span className="text-[11px] font-bold text-amber-200">
                      • 🕒 {food.openTime || '07:00 - 22:00'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
