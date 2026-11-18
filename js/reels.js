// TikTok-Style Vertical Scroll Feed (Cuộn Dọc Reels)
// Tích hợp YouTube Shorts Iframe Player API & Tối ưu hoá QA Toàn diện:
// 1. Single Click Toggle Play / Pause (Chạm màn hình để tạm dừng hoặc phát tiếp)
// 2. Phân loại Video Review:
//    - Video review riêng quán -> Hiển thị tên quán, địa chỉ, khoảng cách, nút chỉ đường Google Maps
//    - Video review chung (Food Tour) -> Ẩn thông tin quán cụ thể, chỉ hiển thị tiêu đề video, tác giả, tag ẩm thực
// 3. Autoplay Policy (Muted Autoplay & Chạm mở loa)
// 4. Single Audio Guarantee (Chỉ duy nhất video đang xem phát tiếng)
// 5. Memory Leak Prevention (Virtualization 2-3 Iframes) & Dead Link Handling

const CURATED_REELS_DATA = [
  // ── 1. CÁC VIDEO REVIEW RIÊNG BIỆT CHO QUÁN CỤ THỂ ──
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
    likesCount: 2450,
    commentsCount: 168
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
    tags: ['#PhốẨmThực', '#NgôVănSở', '#ỐcĐêmQuyNhơn', '#ĂnVặtĐêm'],
    gmapsQuery: 'Phố Ẩm Thực Ngô Văn Sở Quy Nhơn',
    likesCount: 3120,
    commentsCount: 215
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
    tags: ['#NemChảLợi', '#NemNướng', '#ChảRamTômĐất', '#ĐặcSảnBìnhĐịnh'],
    gmapsQuery: 'Nem Chả Lợi 113 Tăng Bạt Hổ Quy Nhơn',
    likesCount: 1890,
    commentsCount: 132
  },

  // ── 2. CÁC VIDEO REVIEW CHUNG (FOOD TOUR / CẨM NANG ẨM THỰC KHÔNG GẮN TÊN QUÁN RIÊNG) ──
  {
    id: 201,
    isGeneralReview: true,
    video_id: '8sGx-HxIRPY',
    author: 'Rồng Ăn Ngon',
    title: 'Tới Quy Nhơn Nhớ Ăn Mấy Món Siêu Rẻ - Ngon Này Nha!',
    desc: 'Cẩm nang tổng hợp các món ăn vặt & đặc sản ngon bổ rẻ tại Quy Nhơn: bánh bèo chén, nem nướng, bánh tráng nướng trứng.',
    tags: ['#FoodTourQuyNhơn', '#MónNgonSiêuRẻ', '#ĂnSậpQuyNhơn', '#ẨmThựcĐườngPhố'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    likesCount: 4200,
    commentsCount: 310
  },
  {
    id: 202,
    isGeneralReview: true,
    video_id: 'EEZLoTViFA4',
    author: 'Phạm Dũng Review',
    title: 'Khám Phá Toàn Bộ Ẩm Thực Quy Nhơn Ngon Giá Rẻ',
    desc: 'Hành trình trải nghiệm ẩm thực xứ Nẫu: Xôi Lăng Ông, Bún Cá biển Quy Nhơn, Phố ốc đêm cực kỳ đậm đà và hấp dẫn.',
    tags: ['#KhámPháQuyNhơn', '#FoodTour', '#ẨmThựcMiềnTrung', '#MónNgonBìnhĐịnh'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    likesCount: 3850,
    commentsCount: 290
  },
  {
    id: 203,
    isGeneralReview: true,
    video_id: 'gWrDmRmEfJk',
    author: 'Du Lịch Việt Nam',
    title: 'Review Các Địa Điểm Ăn Uống Nổi Tiếng Tại Quy Nhơn',
    desc: 'Bản đồ ẩm thực chọn lọc Quy Nhơn: Bánh hỏi lòng heo nóng hổi, bánh xèo tôm nhảy giòn rụm và các món hải sản tươi ngon.',
    tags: ['#ReviewQuyNhơn', '#BảnĐồẨmThực', '#ĂnGìQuyNhơn', '#DuLịchẨmThực'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    likesCount: 2980,
    commentsCount: 180
  },
  {
    id: 204,
    isGeneralReview: true,
    video_id: '1LpN57SLs4Q',
    author: 'Giang Mây Travel',
    title: 'Foodtour 24 Giờ Ăn Sập Ẩm Thực Phố Biển Quy Nhơn',
    desc: 'Cùng food blogger khám phá từ bữa sáng bánh hỏi cháo lòng đến bữa tối ốc vỉa hè và chè tráng miệng phố biển.',
    tags: ['#Foodtour24h', '#QuyNhơnFood', '#MónNgonXứNẫu', '#TravelVlog'],
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    likesCount: 2150,
    commentsCount: 145
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
    likesCount: 1940,
    commentsCount: 118
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
    likesCount: 2600,
    commentsCount: 172
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
    likesCount: 1820,
    commentsCount: 124
  }
];

class ReelsManager {
  constructor(containerId = 'reels-feed-container') {
    this.container = document.getElementById(containerId);
    this.currentIndex = 0;
    this.muted = true;
    this.isPaused = false;
    this.likedMap = {};
    this.commentsMap = {};
    this.items = [];
    this.observer = null;

    this.ensureYouTubeApi();
    this.setupGlobalMessageListener();
  }

  ensureYouTubeApi() {
    if (window.YT && window.YT.Player) return;
    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0] || document.head;
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  setupGlobalMessageListener() {
    window.addEventListener('message', (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.event === 'onError') {
          console.warn('[QA DeadLink Handler] YouTube onError:', data);
          this.handleVideoError(this.currentIndex, data.info);
        }
      } catch (err) {}
    });
  }

  init() {
    this.container = document.getElementById('reels-feed-container');
    if (!this.container) return;

    // Sử dụng bộ dữ liệu Reels đã phân loại chuẩn xác
    this.items = CURATED_REELS_DATA;
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = '';
    this.container.className = 'w-full h-full overflow-y-auto snap-y snap-mandatory select-none scrollbar-none';
    this.container.style.scrollBehavior = 'smooth';
    this.container.style.scrollbarWidth = 'none';

    this.items.forEach((item, idx) => {
      const slideEl = this.createSlideElement(item, idx);
      this.container.appendChild(slideEl);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.setupScrollObserver();

    setTimeout(() => {
      this.updateVideoMounts();
    }, 60);
  }

  createSlideElement(item, idx) {
    const isLiked = !!this.likedMap[item.id];
    const likesCount = (item.likesCount || 1200) + (isLiked ? 1 : 0);

    const itemEl = document.createElement('div');
    itemEl.className = 'reel-item relative w-full h-full snap-start snap-always shrink-0 overflow-hidden bg-black flex items-center justify-center';
    itemEl.dataset.index = idx;

    const videoId = item.video_id || '';
    const isGeneral = !!item.isGeneralReview;

    itemEl.innerHTML = `
      <!-- Phone Viewport Wrapper (Canh giữa tối đa 480px trên desktop, full màn hình trên mobile) -->
      <div class="relative w-full max-w-[480px] h-full overflow-hidden bg-stone-950 flex items-center justify-center shadow-2xl">
        
        <!-- 1. Player Mount Container -->
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
          
          <!-- Iframe mount box (Được Virtualization mount/unmount động) -->
          <div id="reel-player-mount-${idx}" class="absolute inset-0 w-full h-full z-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <!-- Iframe sẽ được gắn vào đây khi slide active -->
          </div>

          <!-- Play / Pause Center Animated Overlay Icon -->
          <div id="reel-play-pause-icon-${idx}" class="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 opacity-0 scale-75 z-20">
            <div class="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white text-3xl shadow-2xl border border-white/20">
              ⏸
            </div>
          </div>

          <!-- Fallback Poster Image (Luôn hiển thị ảnh sắc nét ngay lập tức) -->
          <img src="${item.image}" alt="${item.title || item.name}"
            class="reel-poster-img absolute inset-0 w-full h-full object-cover filter brightness-90 -z-10" />

          <!-- Dark Gradient Overlays (Tạo chiều sâu điện ảnh, làm nổi bật text) -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none z-10"></div>
        </div>

        <!-- 2. Nút Bật/Tắt Âm Thanh & Huy hiệu phân loại video -->
        <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
          <div class="flex items-center gap-2">
            ${isGeneral ? `
              <span class="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <span>🍜</span> Food Tour Quy Nhơn
              </span>
            ` : `
              <span class="bg-emerald-600/90 text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <span>📍</span> Quán Đặc Sản
              </span>
            `}
            <span class="bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              ▶ Shorts
            </span>
          </div>
          
          <button onclick="window.reelsManager.toggleAudio(this)" class="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition flex items-center gap-1.5 text-xs font-bold shadow-lg cursor-pointer">
            <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
            <span>${this.muted ? 'Chạm bật tiếng' : 'Đang phát tiếng'}</span>
          </button>
        </div>

        <!-- 3. Action Bar bên phải: Avatar, Tim, Bình luận, Chia sẻ, Chỉ đường -->
        <div class="absolute right-3 bottom-24 flex flex-col items-center gap-3.5 z-30 pointer-events-auto">
          <!-- Avatar tác giả / quán -->
          <div class="relative mb-0.5">
            <div class="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-xl bg-white flex items-center justify-center">
              ${isGeneral ? `
                <div class="w-full h-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-base">
                  🍜
                </div>
              ` : `
                <img src="${item.image}" alt="${item.restaurant}" class="w-full h-full object-cover" />
              `}
            </div>
            <button onclick="window.reelsManager.toggleFollow(this)" class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition">
              +
            </button>
          </div>

          <!-- Thả tim (Like) -->
          <div class="flex flex-col items-center">
            <button onclick="window.reelsManager.toggleLike(${item.id}, this)" class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
              <i data-lucide="heart" class="w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}"></i>
            </button>
            <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md likes-counter">${likesCount}</span>
          </div>

          <!-- Bình luận -->
          <div class="flex flex-col items-center">
            <button onclick="window.reelsManager.openComments(${item.id})" class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
              <i data-lucide="message-circle" class="w-6 h-6"></i>
            </button>
            <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md">${item.commentsCount || 98}</span>
          </div>

          <!-- Chia sẻ -->
          <div class="flex flex-col items-center">
            <button onclick="window.reelsManager.shareReel(${item.id})" class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
              <i data-lucide="share-2" class="w-6 h-6"></i>
            </button>
            <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md">Chia sẻ</span>
          </div>

          <!-- Nút Hành Động: Nếu review riêng quán -> Chỉ đường Google Maps; Nếu review chung -> Khám phá món ngon -->
          ${isGeneral ? `
            <button onclick="window.app && window.app.switchTab ? window.app.switchTab('taste') : null" class="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-extrabold text-[11px] px-2.5 py-2 rounded-xl shadow-lg flex flex-col items-center gap-0.5 hover:scale-105 active:scale-95 transition border border-white/20">
              <span class="text-sm">🍲</span>
              <span>Khám phá</span>
            </button>
          ` : `
            <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.gmapsQuery || (item.restaurant + ' Quy Nhơn'))}', '_blank')" class="bg-[#F5B041] hover:bg-[#F39C12] text-stone-900 font-extrabold text-[11px] px-2.5 py-2 rounded-xl shadow-lg flex flex-col items-center gap-0.5 hover:scale-105 active:scale-95 transition border border-amber-200">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="18"></line>
                <line x1="15" y1="6" x2="15" y2="21"></line>
              </svg>
              <span>Chỉ đường</span>
            </button>
          `}
        </div>

        <!-- 4. Thông tin hiển thị bên dưới màn hình -->
        <div class="absolute left-4 bottom-6 right-20 text-white z-30 pointer-events-auto">
          ${isGeneral ? `
            <!-- NẾU LÀ VIDEO REVIEW CHUNG: KHÔNG HIỆN TÊN QUÁN RIÊNG, CHỈ HIỆN FOOD TOUR & TÁC GIẢ -->
            <div class="flex items-center gap-2 mb-1.5">
              <h4 class="font-extrabold text-base text-white drop-shadow-md">@${item.author || 'FoodReviewer'}</h4>
              <span class="bg-amber-400 text-stone-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Review Ẩm Thực</span>
            </div>
            
            <p class="text-sm font-extrabold text-white leading-snug drop-shadow-md mb-1 line-clamp-2">
              ${item.title}
            </p>

            <p class="text-xs text-white/80 font-medium leading-relaxed drop-shadow-sm line-clamp-2 mb-2">
              ${item.desc}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-2">
              ${(item.tags || []).map(t => `<span class="text-[11px] font-bold text-amber-300 drop-shadow">${t}</span>`).join(' ')}
            </div>
          ` : `
            <!-- NẾU LÀ VIDEO REVIEW RIÊNG CHO QUÁN: HIỆN ĐẦY ĐỦ TÊN QUÁN, ĐỊA CHỈ, GIÁ TIỀN -->
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-extrabold text-base text-white drop-shadow-md">@${item.restaurant}</h4>
              <span class="bg-rose-500/90 text-[10px] font-bold px-2 py-0.5 rounded-full">${item.distanceText || 'Quy Nhơn'}</span>
            </div>
            
            <p class="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm line-clamp-2 mb-1.5">
              ${item.name} • ${item.desc}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-2">
              <span class="text-[11px] font-bold text-amber-300">💰 ${item.priceRange}</span>
              <span class="text-[11px] font-bold text-amber-200">• 🕒 ${item.openTime}</span>
            </div>
          `}

          <div class="flex items-center gap-2 text-white/70 text-[11px]">
            <i data-lucide="music" class="w-3.5 h-3.5 animate-spin" style="animation-duration: 4s;"></i>
            <span class="truncate max-w-[220px]">Âm thanh gốc - Ẩm thực Quy Nhơn</span>
          </div>
        </div>

      </div>
    `;

    // ── XỬ LÝ CHẠM MÀN HÌNH ĐỂ TẠM DỪNG / PHÁT TIẾP (PLAY / PAUSE) ──
    let clickTimer = null;
    itemEl.addEventListener('click', (e) => {
      // Bỏ qua nếu chạm vào các nút điều khiển bên trên / bên phải
      if (e.target.closest('button') || e.target.closest('a')) return;

      if (clickTimer) {
        // Nhấp đúp (Double click) -> Thả tim bay lơ lửng ❤️
        clearTimeout(clickTimer);
        clickTimer = null;
        this.spawnHeartAt(e.clientX, e.clientY, itemEl);
        this.toggleLike(item.id, itemEl.querySelector('button i[data-lucide="heart"]')?.parentElement, true);
      } else {
        // Nhấp đơn (Single click) -> Tạm dừng / Phát tiếp video (Play / Pause)!
        clickTimer = setTimeout(() => {
          clickTimer = null;
          this.togglePlayPause(idx);
        }, 220);
      }
    });

    return itemEl;
  }

  // ══════════════════════════════════════════════════════════════════════
  // CHỨC NĂNG TẠM DỪNG / PHÁT TIẾP KHI CHẠM MÀN HÌNH (PLAY / PAUSE)
  // ══════════════════════════════════════════════════════════════════════
  togglePlayPause(idx = this.currentIndex) {
    const mountBox = document.getElementById(`reel-player-mount-${idx}`);
    const pauseIcon = document.getElementById(`reel-play-pause-icon-${idx}`);
    if (!mountBox) return;

    this.isPaused = !this.isPaused;

    // Gửi lệnh Play / Pause tới YouTube iframe
    const iframe = mountBox.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      const func = this.isPaused ? 'pauseVideo' : 'playVideo';
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: [] }), '*');
    }

    // Gửi lệnh tới HTML5 video (nếu có)
    const video = mountBox.querySelector('video');
    if (video) {
      if (this.isPaused) video.pause();
      else video.play().catch(() => {});
    }

    // Hiển thị icon trạng thái Play / Pause ở giữa màn hình
    if (pauseIcon) {
      const iconDiv = pauseIcon.querySelector('div');
      if (this.isPaused) {
        if (iconDiv) iconDiv.innerHTML = '⏸';
        pauseIcon.classList.remove('opacity-0', 'scale-75');
        pauseIcon.classList.add('opacity-100', 'scale-100');
      } else {
        if (iconDiv) iconDiv.innerHTML = '▶';
        pauseIcon.classList.remove('opacity-0', 'scale-75');
        pauseIcon.classList.add('opacity-100', 'scale-100');
        setTimeout(() => {
          if (!this.isPaused) {
            pauseIcon.classList.remove('opacity-100', 'scale-100');
            pauseIcon.classList.add('opacity-0', 'scale-75');
          }
        }, 400);
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // QUẢN LÝ BỘ NHỚ & ĐẢM BẢO CHỈ 1 VIDEO DUY NHẤT ĐƯỢC PHÁT TIẾNG
  // ══════════════════════════════════════════════════════════════════════
  updateVideoMounts() {
    if (!this.container || this.items.length === 0) return;

    const cur = this.currentIndex;
    this.isPaused = false; // Reset trạng thái pause khi chuyển sang video mới

    this.items.forEach((item, idx) => {
      const mountBox = document.getElementById(`reel-player-mount-${idx}`);
      const pauseIcon = document.getElementById(`reel-play-pause-icon-${idx}`);
      if (!mountBox) return;

      if (pauseIcon) {
        pauseIcon.classList.remove('opacity-100', 'scale-100');
        pauseIcon.classList.add('opacity-0', 'scale-75');
      }

      const videoId = item.video_id || '';

      if (idx === cur) {
        // VIDEO ĐANG XEM: Duy nhất video này được phép phát hình và tiếng
        if (!mountBox.querySelector('iframe') && !mountBox.querySelector('video')) {
          if (videoId) {
            const iframe = document.createElement('iframe');
            iframe.id = `yt-iframe-${idx}`;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            const originParam = window.location.protocol.startsWith('http') ? `&origin=${encodeURIComponent(window.location.origin)}` : '';
            iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=${this.muted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0${originParam}`;
            iframe.className = 'w-full h-full border-0 pointer-events-none object-cover';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            mountBox.appendChild(iframe);
          }
        } else {
          const iframe = mountBox.querySelector('iframe');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
            const muteCmd = this.muted ? 'mute' : 'unMute';
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: muteCmd, args: [] }), '*');
          }
        }
      } else {
        // TẤT CẢ CÁC VIDEO KHÁC (idx !== cur): DỪNG VÀ TẮT TIẾNG NGAY LẬP TỨC
        const iframe = mountBox.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
        }
        const video = mountBox.querySelector('video');
        if (video) {
          video.pause();
          video.muted = true;
        }

        // Nếu nằm ngoài khoảng lân cận [cur - 1, cur + 1] -> Thu hồi giải phóng RAM
        if (Math.abs(idx - cur) > 1) {
          mountBox.innerHTML = '';
        }
      }
    });
  }

  pauseAll() {
    this.isPaused = true;
    this.items.forEach((item, idx) => {
      const mountBox = document.getElementById(`reel-player-mount-${idx}`);
      if (!mountBox) return;
      const iframe = mountBox.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
        } catch (e) {}
      }
      const video = mountBox.querySelector('video');
      if (video) {
        video.pause();
        video.muted = true;
      }
    });
  }

  setupScrollObserver() {
    if (!this.container) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    const options = {
      root: this.container,
      threshold: 0.6
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.index);
          if (!isNaN(idx) && idx !== this.currentIndex) {
            this.pauseAll(); // Dừng ngay video cũ
            this.currentIndex = idx;
            this.updateVideoMounts();
            if (window.authManager && typeof window.authManager.trackStat === 'function') {
              window.authManager.trackStat('reelsWatched', 1);
            }
          }
        }
      });
    }, options);

    this.container.querySelectorAll('.reel-item').forEach(el => this.observer.observe(el));
  }

  onTabVisible() {
    this.updateVideoMounts();
  }

  toggleAudio(btn) {
    this.muted = !this.muted;

    this.items.forEach((item, idx) => {
      const mountBox = document.getElementById(`reel-player-mount-${idx}`);
      if (!mountBox) return;

      if (idx === this.currentIndex) {
        const iframe = mountBox.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
          const cmd = this.muted ? 'mute' : 'unMute';
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
        }
      } else {
        const iframe = mountBox.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
        }
      }
    });

    if (btn) {
      btn.innerHTML = `
        <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
        <span>${this.muted ? 'Chạm bật tiếng' : 'Đang phát tiếng'}</span>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  handleVideoError(idx, code) {
    console.warn(`[QA DeadLink Handler] Video vị trí ${idx} lỗi (code: ${code}). Tự động lướt tiếp...`);
    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast('Video không khả dụng, đang chuyển sang video tiếp theo... ⏭️');
    }
    this.skipToNext();
  }

  skipToNext() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      this.scrollToIndex(this.currentIndex);
    }
  }

  scrollToIndex(index) {
    if (!this.container) return;
    const itemHeight = this.container.clientHeight;
    this.container.scrollTo({
      top: index * itemHeight,
      behavior: 'smooth'
    });
  }

  toggleLike(foodId, btnEl, forceLike = false) {
    window.soundFX && window.soundFX.playPop();
    const currentlyLiked = !!this.likedMap[foodId];
    const shouldLike = forceLike ? true : !currentlyLiked;
    this.likedMap[foodId] = shouldLike;

    const itemEl = this.container.querySelector(`.reel-item[data-index="${this.currentIndex}"]`);
    if (itemEl) {
      const heartIcon = itemEl.querySelector('i[data-lucide="heart"]');
      const counterEl = itemEl.querySelector('.likes-counter');
      if (heartIcon) {
        if (shouldLike) {
          heartIcon.classList.add('fill-rose-500', 'text-rose-500');
          heartIcon.classList.remove('text-white');
        } else {
          heartIcon.classList.remove('fill-rose-500', 'text-rose-500');
          heartIcon.classList.add('text-white');
        }
      }
      if (counterEl) {
        const item = this.items[this.currentIndex];
        counterEl.textContent = ((item && item.likesCount) || 1200) + (shouldLike ? 1 : 0);
      }
    }
  }

  spawnHeartAt(x, y, parentEl) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'absolute text-5xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping z-50';
    
    const rect = parentEl.getBoundingClientRect();
    heart.style.left = `${x - rect.left}px`;
    heart.style.top = `${y - rect.top}px`;

    parentEl.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }

  toggleFollow(btn) {
    window.soundFX && window.soundFX.playPop();
    if (btn.textContent.trim() === '+') {
      btn.textContent = '✓';
      btn.className = btn.className.replace('bg-rose-500', 'bg-emerald-500');
    } else {
      btn.textContent = '+';
      btn.className = btn.className.replace('bg-emerald-500', 'bg-rose-500');
    }
  }

  openComments(foodId) {
    window.soundFX && window.soundFX.playPop();
    const modal = document.getElementById('comments-modal');
    const commentsList = document.getElementById('comments-list');
    if (!modal || !commentsList) return;

    const item = this.items.find(f => f.id === foodId) || this.items[this.currentIndex];
    document.getElementById('comments-food-title').textContent = (item && (item.title || item.restaurant)) || 'Bình luận';

    const comments = (window.APP_DATA && window.APP_DATA.reelComments) ? window.APP_DATA.reelComments : [];
    commentsList.innerHTML = comments.map(c => `
      <div class="flex items-start gap-2.5 pb-3 border-b border-stone-100 last:border-0">
        <img src="${c.avatar}" alt="${c.user}" class="w-8 h-8 rounded-full object-cover shrink-0" />
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-stone-800">${c.user}</span>
            <span class="text-[10px] text-stone-400">${c.time}</span>
          </div>
          <p class="text-xs text-stone-600 mt-0.5 leading-relaxed">${c.text}</p>
        </div>
      </div>
    `).join('');

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-sheet').classList.remove('translate-y-full');
    }, 10);
  }

  closeComments() {
    const modal = document.getElementById('comments-modal');
    if (!modal) return;
    modal.querySelector('.modal-sheet').classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  shareReel(foodId) {
    window.soundFX && window.soundFX.playPop();
    const item = this.items.find(f => f.id === foodId) || this.items[this.currentIndex];
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      window.app && window.app.showToast && window.app.showToast(`Đã sao chép liên kết video "${(item && (item.title || item.restaurant)) || ''}"! 📋`);
    } else {
      window.app && window.app.showToast && window.app.showToast("Đã chia sẻ thành công! 🚀");
    }
  }
}

window.reelsManager = new ReelsManager();
