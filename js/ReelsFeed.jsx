import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ReelsFeed Component - Cuộn video review đồ ăn định dạng dọc (Shorts)
 * 
 * Tính năng QA & Tối ưu hoá nâng cao:
 * 1. Single Click Play / Pause:
 *    - Chạm nhẹ vào màn hình để Tạm dừng (Pause) hoặc Tiếp tục phát (Play).
 *    - Nhấp đúp (Double click) để Thả tim ❤️ bay hiệu ứng.
 * 2. Phân loại Video Review Thông Minh:
 *    - Video review riêng quán -> Hiển thị tên quán, khoảng cách, giờ mở cửa, nút chỉ đường Google Maps.
 *    - Video review chung (Food Tour) -> Tuyệt đối không gắn tên quán sai lệch, chỉ hiện tiêu đề video và tag ẩm thực.
 * 3. Độc quyền âm thanh 1 video duy nhất (Tránh chồng chéo tiếng).
 * 4. Autoplay Muted & Chạm bật tiếng.
 */

const CURATED_REELS_DATA = [
  {
    id: 101,
    isGeneralReview: false,
    video_id: '1dT4PMS3HPk',
    restaurant: 'Bún Chả Cá Ngọc Liên',
    address: '379 Nguyễn Huệ, TP. Quy Nhơn',
    name: 'Bún Chả Cá & Bún Sứa Quy Nhơn',
    desc: 'Quán bún cá gia truyền đông nghẹt khách tại Quy Nhơn, chả cá dai ngọt tự nhiên, nước dùng thanh ngọt vị cá thu biển.',
    priceRange: '35.000đ - 55.000đ',
    openTime: '06:00 - 22:00',
    distanceText: 'Cách bạn 1.2km',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    tags: ['#BúnChảCá', '#BúnCáNgọcLiên', '#ĐặcSảnQuyNhơn'],
    gmapsQuery: 'Bún Chả Cá Ngọc Liên 379 Nguyễn Huệ Quy Nhơn',
    likesCount: 2450
  },
  {
    id: 102,
    isGeneralReview: false,
    video_id: 'wsXvJFY9Pno',
    restaurant: 'Phố Ẩm Thực Đêm Ngô Văn Sở',
    address: 'Đường Ngô Văn Sở, P. Trần Phú, TP. Quy Nhơn',
    name: 'Phố Ốc Đêm & Thiên Đường Ăn Vặt',
    desc: 'Thiên đường ẩm thực đêm nổi tiếng nhất Quy Nhơn: đủ loại ốc đĩa, bánh xèo tôm nhảy, nem nướng, mực rim me chỉ từ 20k.',
    priceRange: '20.000đ - 60.000đ',
    openTime: '15:00 - 23:30',
    distanceText: 'Cách bạn 800m',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    tags: ['#PhốẨmThực', '#NgôVănSở', '#ỐcĐêmQuyNhơn'],
    gmapsQuery: 'Phố Ẩm Thực Ngô Văn Sở Quy Nhơn',
    likesCount: 3120
  },
  {
    id: 103,
    isGeneralReview: false,
    video_id: 'TQ0uDdrAqAU',
    restaurant: 'Nem Chả Lợi - Nem Nướng Quy Nhơn',
    address: '113 Tăng Bạt Hổ, TP. Quy Nhơn',
    name: 'Nem Nướng Chợ Huyện Cuốn Bánh Tráng',
    desc: 'Quán nem nướng, chả ram tôm đất, bò nướng mắm nhĩ gia truyền ngon và chill nức tiếng tại Quy Nhơn.',
    priceRange: '35.000đ - 85.000đ',
    openTime: '15:00 - 22:30',
    distanceText: 'Cách bạn 1.5km',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tags: ['#NemChảLợi', '#NemNướng', '#ĐặcSảnBìnhĐịnh'],
    gmapsQuery: 'Nem Chả Lợi 113 Tăng Bạt Hổ Quy Nhơn',
    likesCount: 1890
  },
  {
    id: 201,
    isGeneralReview: true,
    video_id: '8sGx-HxIRPY',
    author: 'Rồng Ăn Ngon',
    title: 'Tới Quy Nhơn Nhớ Ăn Mấy Món Siêu Rẻ - Ngon Này Nha!',
    desc: 'Cẩm nang tổng hợp các món ăn vặt & đặc sản ngon bổ rẻ tại Quy Nhơn: bánh bèo chén, nem nướng, bánh tráng nướng trứng.',
    tags: ['#FoodTourQuyNhơn', '#MónNgonSiêuRẻ', '#ĂnSậpQuyNhơn'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    likesCount: 4200
  },
  {
    id: 202,
    isGeneralReview: true,
    video_id: 'EEZLoTViFA4',
    author: 'Phạm Dũng Review',
    title: 'Khám Phá Toàn Bộ Ẩm Thực Quy Nhơn Ngon Giá Rẻ',
    desc: 'Hành trình trải nghiệm ẩm thực xứ Nẫu: Xôi Lăng Ông, Bún Cá biển Quy Nhơn, Phố ốc đêm cực kỳ đậm đà và hấp dẫn.',
    tags: ['#KhámPháQuyNhơn', '#FoodTour', '#ẨmThựcMiềnTrung'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    likesCount: 3850
  },
  {
    id: 203,
    isGeneralReview: true,
    video_id: 'gWrDmRmEfJk',
    author: 'Du Lịch Việt Nam',
    title: 'Review Các Địa Điểm Ăn Uống Nổi Tiếng Tại Quy Nhơn',
    desc: 'Bản đồ ẩm thực chọn lọc Quy Nhơn: Bánh hỏi lòng heo nóng hổi, bánh xèo tôm nhảy giòn rụm và các món hải sản tươi ngon.',
    tags: ['#ReviewQuyNhơn', '#BảnĐồẨmThực', '#ĂnGìQuyNhơn'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    likesCount: 2980
  },
  {
    id: 204,
    isGeneralReview: true,
    video_id: '1LpN57SLs4Q',
    author: 'Giang Mây Travel',
    title: 'Foodtour 24 Giờ Ăn Sập Ẩm Thực Phố Biển Quy Nhơn',
    desc: 'Cùng food blogger khám phá từ bữa sáng bánh hỏi cháo lòng đến bữa tối ốc vỉa hè và chè tráng miệng phố biển.',
    tags: ['#Foodtour24h', '#QuyNhơnFood', '#MónNgonXứNẫu'],
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    likesCount: 2150
  },
  {
    id: 205,
    isGeneralReview: true,
    video_id: '4r-7zAAEUp8',
    author: 'Võ Ngọc Tài Review',
    title: 'Quy Nhơn Ăn Gì? Cẩm Nang Ăn Uống Cho Khách Du Lịch',
    desc: 'Hướng dẫn chi tiết ăn uống khi du lịch Quy Nhơn: những món đặc sản địa phương trứ danh nhất định phải thử một lần.',
    tags: ['#QuyNhơnĂnGì', '#CẩmNangẨmThực', '#ĐặcSảnBìnhĐịnh'],
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    likesCount: 1940
  },
  {
    id: 206,
    isGeneralReview: true,
    video_id: 'OcJqkmePrQc',
    author: 'Gia Đình Vivu',
    title: 'Quy Nhơn Có Gì Ngon? 5 Quán Ăn Địa Phương Nổi Tiếng',
    desc: 'Tổng hợp 5 trải nghiệm ẩm thực độc đáo của người dân bản địa Quy Nhơn, chuẩn vị và giá cả cực kỳ hợp lý.',
    tags: ['#Top5MónNgon', '#ẨmThựcBảnĐịa', '#QuyNhơnMónNgon'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    likesCount: 2600
  },
  {
    id: 207,
    isGeneralReview: true,
    video_id: 'eqGLEGlFCIY',
    author: 'Food Reviewer Xứ Nẫu',
    title: 'Food Tour Check-in Ẩm Thực Phố Biển Quy Nhơn',
    desc: 'Khám phá hải sản tươi sống bên bờ biển Quy Nhơn, lẩu sứa nước lèo và các món ăn vặt hấp dẫn.',
    tags: ['#HảiSảnQuyNhơn', '#LẩuSứa', '#ĂnUốngQuyNhơn'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    likesCount: 1820
  }
];

export default function ReelsFeed({ items = CURATED_REELS_DATA }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [likedMap, setLikedMap] = useState({});

  const containerRef = useRef(null);
  const clickTimerRef = useRef(null);

  // 1. Tự động skip khi video lỗi (Dead Link QA)
  const handlePlayerError = useCallback((index) => {
    if (index < items.length - 1 && containerRef.current) {
      const itemHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: (index + 1) * itemHeight,
        behavior: 'smooth'
      });
    }
  }, [items.length]);

  // 2. Bắt lỗi onError từ YouTube iframe qua postMessage
  useEffect(() => {
    const handleMessage = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.event === 'onError') {
          handlePlayerError(currentIndex);
        }
      } catch (err) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentIndex, handlePlayerError]);

  // 3. Cuộn trang -> reset pause state & cập nhật index
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const itemHeight = container.clientHeight;
    if (itemHeight <= 0) return;

    const newIndex = Math.round(container.scrollTop / itemHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
      setIsPaused(false);
      setCurrentIndex(newIndex);
    }
  };

  // 4. Chạm màn hình để Tạm dừng / Tiếp tục phát (Play / Pause)
  const handleContainerClick = (e, index) => {
    if (e.target.closest('button') || e.target.closest('a')) return;

    if (clickTimerRef.current) {
      // Double click -> Thả tim!
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      const itemId = items[index].id;
      setLikedMap(prev => ({ ...prev, [itemId]: true }));
    } else {
      // Single click -> Toggle Play/Pause!
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        togglePlayPause(index);
      }, 220);
    }
  };

  const togglePlayPause = (index) => {
    const iframe = document.getElementById(`yt-iframe-${index}`);
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);

    if (iframe && iframe.contentWindow) {
      const cmd = nextPaused ? 'pauseVideo' : 'playVideo';
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
    }
  };

  // 5. Bật / Tắt âm thanh
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    const activeIframe = document.getElementById(`yt-iframe-${currentIndex}`);
    if (activeIframe && activeIframe.contentWindow) {
      const cmd = nextMuted ? 'mute' : 'unMute';
      activeIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, idx) => {
          const isCurrent = idx === currentIndex;
          const isLiked = !!likedMap[item.id];
          const isGeneral = !!item.isGeneralReview;

          return (
            <div
              key={item.id || idx}
              onClick={(e) => handleContainerClick(e, idx)}
              className="relative w-full h-full snap-start snap-always shrink-0 overflow-hidden bg-black flex items-center justify-center cursor-pointer"
            >
              <div className="relative w-full max-w-[480px] h-full overflow-hidden bg-stone-950 flex items-center justify-center shadow-2xl">
                
                {/* Video Player & Poster */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                  {isCurrent && (
                    <iframe
                      id={`yt-iframe-${idx}`}
                      src={`https://www.youtube.com/embed/${item.video_id}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${item.video_id}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`}
                      className="absolute inset-0 w-full h-full object-cover border-0 z-0 pointer-events-none"
                      style={{ width: '100%', height: '100%', transform: 'scale(1.04)', transformOrigin: 'center center' }}
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title={item.title || item.restaurant}
                    />
                  )}

                  {/* Play / Pause Indicator Icon in Center */}
                  {isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
                      <div className="w-18 h-18 p-4 rounded-full bg-black/65 backdrop-blur-lg flex items-center justify-center text-white shadow-2xl border border-white/25 animate-pulse">
                        <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
                          <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
                        </svg>
                      </div>
                    </div>
                  )}

                  <img
                    src={item.image}
                    alt={item.title || item.name}
                    className="absolute inset-0 w-full h-full object-cover filter brightness-90 -z-10"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none z-10" />
                </div>

                {/* Top Badges & Sound Button */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    {isGeneral ? (
                      <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                        🍜 Food Tour Quy Nhơn
                      </span>
                    ) : (
                      <span className="bg-emerald-600/90 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                        📍 Quán Đặc Sản
                      </span>
                    )}
                    <span className="bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      ▶ Shorts
                    </span>
                  </div>

                  <button
                    onClick={toggleMute}
                    className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition flex items-center gap-1.5 text-xs font-bold shadow-lg"
                  >
                    <span>{isMuted ? '🔇 Chạm bật tiếng' : '🔊 Đang bật tiếng'}</span>
                  </button>
                </div>

                {/* Action Bar Right: CHỈ ĐỂ LẠI 2 ICON CHIA SẺ & KHÁM PHÁ */}
                <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-4 z-30 pointer-events-auto">
                  {/* Chia sẻ */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (window.reelsManager && typeof window.reelsManager.openShareModal === 'function') {
                          window.reelsManager.openShareModal(item.id);
                        } else if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Đã sao chép liên kết video!');
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-xl border border-white/20"
                      title="Chia sẻ video với bạn bè & nhóm"
                    >
                      <span className="text-xl">↗️</span>
                    </button>
                    <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">Chia sẻ</span>
                  </div>

                  {/* Khám phá */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (window.reelsManager && typeof window.reelsManager.exploreHashtags === 'function') {
                          window.reelsManager.exploreHashtags(item.id);
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-2xl border border-amber-200/50"
                      title="Quẹt các món ngon phù hợp với video này"
                    >
                      <span className="text-xl">🍲</span>
                    </button>
                    <span className="text-amber-300 text-[11px] font-extrabold mt-1 drop-shadow-md">Khám phá</span>
                  </div>
                </div>

                {/* Bottom Information */}
                <div className="absolute left-4 bottom-6 right-20 text-white z-30 pointer-events-auto">
                  {isGeneral ? (
                    /* Review chung: Không hiện tên quán riêng lẻ */
                    <>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-extrabold text-base text-white drop-shadow-md">
                          @{item.author || 'FoodTour Quy Nhơn'}
                        </h4>
                        <span className="bg-amber-400 text-stone-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          Review Ẩm Thực
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-white leading-snug drop-shadow-md mb-1 line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-white/80 font-medium line-clamp-2 mb-2 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(item.tags || []).map(t => (
                          <span key={t} className="text-[11px] font-bold text-amber-300 drop-shadow">
                            {t}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Review riêng quán: Hiện đầy đủ tên quán, món ăn, giá tiền */
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-extrabold text-base text-white drop-shadow-md">
                          @{item.restaurant}
                        </h4>
                        <span className="bg-rose-500/90 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.distanceText || 'Quy Nhơn'}
                        </span>
                      </div>
                      <p className="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm line-clamp-2 mb-1.5">
                        {item.name} • {item.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-[11px] font-bold text-amber-300">
                          💰 {item.priceRange}
                        </span>
                        <span className="text-[11px] font-bold text-amber-200">
                          • 🕒 {item.openTime}
                        </span>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
