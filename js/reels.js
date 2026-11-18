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

// ══════════════════════════════════════════════════════════════════════
// CHIẾN THUẬT 3: GỘP WRITE BẰNG LOCALSTORAGE (DEBOUNCE / BATCHING 3 PHÚT)
// Không ghi Firebase liên tục. Gom toàn bộ hành động người dùng lưu vào
// LocalStorage, định kỳ 3 phút hoặc khi thoát app mới ghi 1 Document duy nhất!
// ══════════════════════════════════════════════════════════════════════
class UserActionBatcher {
  constructor() {
    this.STORAGE_KEY = 'foodtinder_user_actions_batch';
    this.BATCH_INTERVAL_MS = 3 * 60 * 1000; // 3 phút
    this.queue = [];
    this.timer = null;
    this.isFlushing = false;

    this.loadFromStorage();
    this.startPeriodicTimer();
    this.setupLifecycleListeners();
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        this.queue = JSON.parse(raw);
        if (!Array.isArray(this.queue)) this.queue = [];
      }
    } catch (e) {
      this.queue = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {}
  }

  recordAction(actionData) {
    const action = {
      ...actionData,
      timestamp: Date.now(),
      isoTime: new Date().toISOString()
    };
    this.queue.push(action);
    this.saveToStorage();

    // Giới hạn buffer 100 hành động tránh tràn bộ nhớ
    if (this.queue.length > 100) {
      this.queue = this.queue.slice(-100);
      this.saveToStorage();
    }
  }

  startPeriodicTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.queue.length > 0) {
        console.log(`[Firebase Batcher] Đã 3 phút trôi qua. Tự động đóng gói và đẩy ${this.queue.length} hành động lên Firebase...`);
        this.flush();
      }
    }, this.BATCH_INTERVAL_MS);
  }

  setupLifecycleListeners() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.queue.length > 0) {
        console.log(`[Firebase Batcher] App chuyển nền/thoát. Gộp và đẩy ${this.queue.length} hành động lên Firebase...`);
        this.flush();
      }
    });

    window.addEventListener('beforeunload', () => {
      if (this.queue.length > 0) {
        this.flush(true);
      }
    });
  }

  async flush(isUnloading = false) {
    if (this.isFlushing || this.queue.length === 0) return;
    this.isFlushing = true;

    const actionsToFlush = [...this.queue];
    const payload = {
      userId: (window.authManager && window.authManager.currentUser && window.authManager.currentUser.id) || 'guest_user',
      count: actionsToFlush.length,
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
      actions: actionsToFlush,
      summary: {
        reelsEvents: actionsToFlush.filter(a => a.type && a.type.startsWith('reel_')).length,
        swipeEvents: actionsToFlush.filter(a => a.type && a.type.startsWith('swipe_')).length
      }
    };

    let writeSuccess = false;

    // 1. Thử ghi 1 document duy nhất vào Firestore: collection 'user_behavior_batches'
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      try {
        await firebase.firestore().collection('user_behavior_batches').add(payload);
        writeSuccess = true;
        console.log(`[Firebase Batcher] Thành công! Đã gộp ${actionsToFlush.length} hành động thành 1 lượt Write duy nhất trên Firestore!`);
      } catch (err) {
        console.warn('[Firebase Batcher] Firestore write error:', err);
      }
    }

    // 2. Fallback Realtime Database
    if (!writeSuccess && typeof firebase !== 'undefined' && firebase.database) {
      try {
        await firebase.database().ref('user_behavior_batches').push(payload);
        writeSuccess = true;
        console.log(`[Firebase Batcher] Thành công! Đã đẩy batch ${actionsToFlush.length} hành động lên Realtime Database!`);
      } catch (e) {}
    }

    // 3. Fallback phân tích học Gu AI nội bộ nếu offline
    if (window.tasteManager && typeof window.tasteManager.recordBatchInteractions === 'function') {
      window.tasteManager.recordBatchInteractions(actionsToFlush);
    }

    this.queue = [];
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {}
    this.isFlushing = false;
  }
}
window.userActionBatcher = new UserActionBatcher();

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

    // CHIẾN THUẬT 1: Phân trang ngặt nghèo (.limit(5))
    this.PAGE_SIZE = 5;
    this.lastVisibleDoc = null;
    this.hasMore = true;
    this.isLoadingNextBatch = false;

    // CHIẾN THUẬT 2: Không ghi Write lượt View vào Firestore (Google Analytics miễn phí)
    this.viewedAnalyticsSet = new Set();
    this.currentWatchStartTime = Date.now();

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

  // CHIẾN THUẬT 2: Ghi nhận lượt xem qua Google Analytics for Firebase (Hoàn toàn miễn phí, 0 Write Firestore)
  logReelViewAnalytics(item, idx) {
    if (!item) return;
    const vidKey = item.id || item.video_id;
    if (this.viewedAnalyticsSet.has(vidKey)) return;
    this.viewedAnalyticsSet.add(vidKey);

    console.log(`[Firebase Analytics] Bắn event reel_watched miễn phí (0 Write) cho video: ${item.video_id}`);

    if (typeof firebase !== 'undefined' && typeof firebase.analytics === 'function') {
      try {
        const analytics = firebase.analytics();
        analytics.logEvent('reel_watched', {
          video_id: item.video_id || '',
          restaurant: item.restaurant || '',
          author: item.author || '',
          title: (item.title || item.name || '').substring(0, 100),
          is_general: Boolean(item.isGeneralReview),
          watch_index: idx
        });
      } catch (e) {
        console.warn('[Firebase Analytics] Error logging reel_watched:', e);
      }
    }

    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'reel_watched', {
          video_id: item.video_id || '',
          restaurant: item.restaurant || ''
        });
      } catch (e) {}
    }
  }

  // CHIẾN THUẬT 1: Bắt buộc sử dụng .limit(5), chỉ lấy trước đúng 5 document
  async init() {
    this.container = document.getElementById('reels-feed-container');
    if (!this.container) return;

    this.currentIndex = 0;
    this.items = [];
    this.lastVisibleDoc = null;
    this.hasMore = true;
    this.isLoadingNextBatch = false;
    this.currentWatchStartTime = Date.now();

    await this.loadInitialBatch();
  }

  async loadInitialBatch() {
    this.isLoadingNextBatch = true;
    let initialItems = [];

    // 1. Thử lấy từ Firestore với .limit(5) (Chỉ tốn đúng 5 lượt Read)
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      try {
        const snap = await firebase.firestore().collection('reels_curated').limit(this.PAGE_SIZE).get();
        if (!snap.empty) {
          this.lastVisibleDoc = snap.docs[snap.docs.length - 1];
          initialItems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(`[Reels Pagination] Đã nạp 5 video đầu tiên từ Firestore (.limit(5)). Tốn đúng 5 lượt Read!`);
        }
      } catch (err) {
        console.warn('[Reels Pagination] Firestore initial query error:', err);
      }
    }

    // 2. Fallback sang dataset CURATED_REELS_DATA nếu Firestore chưa khởi tạo
    if (!initialItems || initialItems.length === 0) {
      initialItems = CURATED_REELS_DATA.slice(0, this.PAGE_SIZE);
      if (CURATED_REELS_DATA.length <= this.PAGE_SIZE) {
        this.hasMore = false;
      }
    }

    this.items = initialItems;
    this.render();
    this.isLoadingNextBatch = false;

    // Bắn event Analytics miễn phí cho video đầu tiên
    if (this.items.length > 0) {
      this.logReelViewAnalytics(this.items[0], 0);
    }
  }

  // Khi người dùng lướt đến gần cuối, tự động tải thêm 5 video
  // ĐẶC BIỆT: Khi đến video cuối cùng, tự động random xáo trộn các video khác từ kho để cuộn vô tận!
  async loadNextBatch() {
    if (this.isLoadingNextBatch) return;
    this.isLoadingNextBatch = true;
    console.log(`[Reels Pagination] Lướt đến video thứ ${this.currentIndex + 1}. Bắt đầu nạp thêm 5 video tiếp theo...`);

    let nextItems = [];
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      try {
        let q = firebase.firestore().collection('reels_curated').limit(this.PAGE_SIZE);
        if (this.lastVisibleDoc) {
          q = q.startAfter(this.lastVisibleDoc);
        }
        const snap = await q.get();
        if (!snap.empty) {
          this.lastVisibleDoc = snap.docs[snap.docs.length - 1];
          nextItems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (err) {
        console.warn('[Reels Pagination] Firestore batch error:', err);
      }
    }

    if (!nextItems || nextItems.length === 0) {
      const startIdx = this.items.length;
      if (startIdx < CURATED_REELS_DATA.length) {
        nextItems = CURATED_REELS_DATA.slice(startIdx, startIdx + this.PAGE_SIZE);
      }
    }

    // ── VÒNG LẶP RANDOM VÔ TẬN (KHI ĐẾN VIDEO CUỐI CÙNG) ──
    // Tuyệt đối không đứng yên! Random xáo trộn các video khác trong kho để người dùng lướt mãi mãi
    if (!nextItems || nextItems.length === 0) {
      console.log('[Reels Infinite] Đã tới video cuối cùng. Tiến hành random xáo trộn kho video để tiếp tục cuộn mượt mà...');
      const curVid = this.items[this.currentIndex]?.video_id;
      const candidates = CURATED_REELS_DATA.filter(v => v.video_id !== curVid);
      const shuffled = [...candidates].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, this.PAGE_SIZE);
      const baseCounter = (this.items.length + 1) * 100;
      nextItems = picked.map((item, i) => ({
        ...item,
        id: baseCounter + i + 1,
        isRandomLooped: true
      }));
    }

    if (nextItems && nextItems.length > 0) {
      const startIndex = this.items.length;
      this.items = [...this.items, ...nextItems];

      nextItems.forEach((item, i) => {
        const slideIdx = startIndex + i;
        const slideEl = this.createSlideElement(item, slideIdx);
        this.container.appendChild(slideEl);
        if (this.observer) {
          this.observer.observe(slideEl);
        }
      });

      if (window.lucide) window.lucide.createIcons();
      console.log(`[Reels Infinite] Nạp thêm thành công ${nextItems.length} video. Tổng số hiện tại: ${this.items.length} video.`);
    }

    this.isLoadingNextBatch = false;
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
          <div id="reel-player-mount-${idx}" class="absolute inset-0 w-full h-full z-[1] flex items-center justify-center overflow-hidden pointer-events-none">
            <!-- Iframe sẽ được gắn vào đây khi slide active -->
          </div>

          <!-- Touch / Click catcher layer: Ngăn chặn click lọt vào iframe cross-origin, đảm bảo Play/Pause & Thả tim 100% mượt mà -->
          <div class="reel-touch-surface absolute inset-0 z-20 cursor-pointer" data-slide-index="${idx}"></div>

          <!-- Play / Pause Center Animated Overlay Icon -->
          <div id="reel-play-pause-icon-${idx}" class="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 opacity-0 scale-75 z-25">
            <div class="w-18 h-18 p-4 rounded-full bg-black/65 backdrop-blur-lg flex items-center justify-center text-white shadow-2xl border border-white/25">
              <svg id="reel-icon-svg-${idx}" class="w-9 h-9 fill-current text-white" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
              </svg>
            </div>
          </div>

          <!-- Fallback Poster Image (z-0 hiển thị ngay lập tức, không để màn hình đen, tự fallback sang YouTube thumbnail) -->
          <img src="${item.image || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '')}" 
            onerror="if('${videoId}') this.src='https://i.ytimg.com/vi/${videoId}/hqdefault.jpg'"
            alt="${item.title || item.name}"
            loading="${idx <= 1 ? 'eager' : 'lazy'}"
            decoding="async"
            ${idx === 0 ? 'fetchpriority="high"' : 'fetchpriority="low"'}
            class="reel-poster-img absolute inset-0 w-full h-full object-cover filter brightness-90 z-0" />

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
          
          <button onclick="window.reelsManager.toggleAudio(this)" class="reel-audio-toggle-btn px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition flex items-center gap-1.5 text-xs font-bold shadow-lg cursor-pointer">
            <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
            <span>${this.muted ? 'Chạm bật tiếng' : 'Đang phát tiếng'}</span>
          </button>
        </div>

        <!-- 3. Action Bar bên phải: CHỈ ĐỂ LẠI ICON CHIA SẺ & KHÁM PHÁ -->
        <div class="absolute right-3.5 bottom-24 flex flex-col items-center gap-4 z-30 pointer-events-auto">
          <!-- Chia sẻ với Bạn bè & Nhóm -->
          <div class="flex flex-col items-center">
            <button onclick="window.reelsManager.openShareModal(${item.id})" 
              class="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-xl border border-white/20 cursor-pointer group"
              title="Chia sẻ video với bạn bè & nhóm">
              <i data-lucide="share-2" class="w-5 h-5 text-white group-hover:scale-110 transition-transform"></i>
            </button>
            <span class="text-white text-[11px] font-bold mt-1 drop-shadow-md">Chia sẻ</span>
          </div>

          <!-- Khám phá quẹt món theo hashtag video -->
          <div class="flex flex-col items-center">
            <button onclick="window.reelsManager.exploreHashtags(${item.id})" 
              class="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-2xl border border-amber-200/50 cursor-pointer group"
              title="Quẹt các món ngon phù hợp với video này">
              <span class="text-xl group-hover:scale-125 transition-transform">🍲</span>
            </button>
            <span class="text-amber-300 text-[11px] font-extrabold mt-1 drop-shadow-md">Khám phá</span>
          </div>
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
    const touchSurface = itemEl.querySelector(`.reel-touch-surface[data-slide-index="${idx}"]`);
    let clickTimer = null;

    const handleTapOrClick = (e) => {
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
    };

    if (touchSurface) {
      touchSurface.addEventListener('click', handleTapOrClick);
    }
    itemEl.addEventListener('click', (e) => {
      if (e.target === touchSurface) return; // Đã xử lý bởi touchSurface
      handleTapOrClick(e);
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

    // Hiển thị icon trạng thái Play / Pause ở giữa màn hình với icon SVG sắc nét
    if (pauseIcon) {
      const containerDiv = pauseIcon.querySelector('div');
      if (this.isPaused) {
        if (containerDiv) {
          containerDiv.innerHTML = `
            <svg class="w-9 h-9 fill-current text-white" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
            </svg>
          `;
        }
        pauseIcon.classList.remove('opacity-0', 'scale-75');
        pauseIcon.classList.add('opacity-100', 'scale-100');
      } else {
        if (containerDiv) {
          containerDiv.innerHTML = `
            <svg class="w-9 h-9 fill-current text-white translate-x-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          `;
        }
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
  // CHIẾN THUẬT 1 & 2: THUẬT TOÁN "CỬA SỔ TRƯỢT" (DOM VIRTUALIZATION)
  // & ĐIỀU PHỐI PRELOAD CÓ CHỦ ĐÍCH (PRELOAD="AUTO" / "METADATA" / "NONE")
  // ══════════════════════════════════════════════════════════════════════
  unmountVideo(idx, mountBox) {
    if (!mountBox) return;
    const iframe = mountBox.querySelector('iframe');
    if (iframe) {
      try {
        iframe.src = 'about:blank'; // Đóng băng luồng mạng cross-origin ngay lập tức
      } catch (e) {}
      iframe.remove();
    }
    const video = mountBox.querySelector('video');
    if (video) {
      try {
        video.pause();
        video.removeAttribute('src'); // Giải phóng giải mã video khỏi bộ nhớ RAM
        video.load();
      } catch (e) {}
      video.remove();
    }
    mountBox.innerHTML = '';
  }

  updateVideoMounts() {
    if (!this.container || this.items.length === 0) return;

    const cur = this.currentIndex;
    this.isPaused = false; // Reset trạng thái pause khi kích hoạt video mới

    this.items.forEach((item, idx) => {
      const mountBox = document.getElementById(`reel-player-mount-${idx}`);
      const pauseIcon = document.getElementById(`reel-play-pause-icon-${idx}`);
      if (!mountBox) return;

      if (pauseIcon) {
        pauseIcon.classList.remove('opacity-100', 'scale-100');
        pauseIcon.classList.add('opacity-0', 'scale-75');
      }

      const isCur = idx === cur;
      const isNext = idx === cur + 1;
      const isPrev = idx === cur - 1;
      const isInWindow = isCur || isNext || isPrev;

      // THUẬT TOÁN CỬA SỔ TRƯỢT: Tuyệt đối không giữ quá 3 thẻ video/iframe trong DOM
      // Nếu nằm ngoài [cur - 1, cur, cur + 1] -> Gỡ bỏ hoàn toàn thẻ HTML và giải phóng RAM
      if (!isInWindow) {
        this.unmountVideo(idx, mountBox);
        return;
      }

      const videoId = item.video_id || '';
      const videoUrl = item.videoUrl || '';

      if (isCur) {
        // ── VỊ TRÍ 1: VIDEO ĐANG XEM TRÊN MÀN HÌNH (TỰ ĐỘNG PHÁT NGAY LẬP TỨC) ──
        if (videoId) {
          let iframe = mountBox.querySelector('iframe');
          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = `yt-iframe-${idx}`;
            iframe.dataset.autoplay = '1';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            // Dùng youtube-nocookie.com & bỏ originParam để tương thích 100% mọi môi trường (Safari/Chrome/Localhost/Webview), triệt tiêu lỗi Error 153!
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=${this.muted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`;
            iframe.className = 'w-full h-full border-0 pointer-events-none object-cover';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.transform = 'scale(1.04)';
            iframe.style.transformOrigin = 'center center';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;

            const sendPlay = () => {
              if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
                const muteCmd = this.muted ? 'mute' : 'unMute';
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: muteCmd, args: [] }), '*');
              }
            };
            iframe.onload = () => {
              sendPlay();
              setTimeout(sendPlay, 150);
              setTimeout(sendPlay, 400);
            };

            mountBox.innerHTML = '';
            mountBox.appendChild(iframe);
            setTimeout(sendPlay, 250);
            setTimeout(sendPlay, 600);
          } else if (iframe.contentWindow) {
            const sendPlay = () => {
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
              const muteCmd = this.muted ? 'mute' : 'unMute';
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: muteCmd, args: [] }), '*');
            };
            sendPlay();
            setTimeout(sendPlay, 150);
            setTimeout(sendPlay, 400);
          }
        } else if (videoUrl) {
          let video = mountBox.querySelector('video');
          if (!video) {
            video = document.createElement('video');
            video.src = videoUrl;
            video.preload = 'auto'; // Ưu tiên tải tối đa băng thông
            video.loop = true;
            video.muted = this.muted;
            video.playsInline = true;
            video.className = 'w-full h-full object-cover pointer-events-none';
            mountBox.innerHTML = '';
            mountBox.appendChild(video);
          } else {
            video.preload = 'auto';
            video.muted = this.muted;
          }
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          }
        }
      } else if (isNext) {
        // ── VỊ TRÍ 2: VIDEO DỰ PHÒNG TIẾP THEO (idx = cur + 1) ──
        // Giữ poster hình ảnh sắc nét, KHÔNG tạo iframe autoplay=0 để khi vuốt sang là tự động play ngay!
        if (videoId) {
          mountBox.innerHTML = '';
        } else if (videoUrl) {
          let video = mountBox.querySelector('video');
          if (!video) {
            video = document.createElement('video');
            video.src = videoUrl;
            video.preload = 'metadata'; // Chỉ tải trước khung hình
            video.muted = true;
            video.playsInline = true;
            video.className = 'w-full h-full object-cover pointer-events-none';
            mountBox.innerHTML = '';
            mountBox.appendChild(video);
          } else {
            video.preload = 'metadata';
            video.pause();
            video.muted = true;
          }
        }
      } else if (isPrev) {
        // ── VỊ TRÍ 3: VIDEO VỪA XEM QUA (idx = cur - 1): preload="metadata", tạm dừng để sẵn sàng vuốt ngược ──
        const iframe = mountBox.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
        }
        const video = mountBox.querySelector('video');
        if (video) {
          video.preload = 'metadata';
          video.pause();
          video.muted = true;
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

  // ══════════════════════════════════════════════════════════════════════
  // CHIẾN THUẬT 3: ĐÓNG BĂNG BẰNG INTERSECTION OBSERVER (THRESHOLD: 0.5)
  // Kích hoạt khi lọt vào 50% màn hình, đóng băng và giải phóng khi khuất màn hình
  // ══════════════════════════════════════════════════════════════════════
  setupScrollObserver() {
    if (!this.container) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    const options = {
      root: this.container,
      threshold: 0.5 // Kích hoạt chính xác khi khung video lọt vào 50% màn hình
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const idx = Number(entry.target.dataset.index);
        if (isNaN(idx)) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Video lọt vào 50% màn hình -> Kích hoạt phát video
          if (idx !== this.currentIndex) {
            // Ghi nhận thời gian xem video trước đó vào LocalStorage Batcher (cho AI học gu, 0 Write Firebase)
            const prevItem = this.items[this.currentIndex];
            if (prevItem) {
              const watchSec = Math.max(1, Math.round((Date.now() - this.currentWatchStartTime) / 1000));
              if (window.userActionBatcher) {
                window.userActionBatcher.recordAction({
                  type: watchSec >= 4 ? 'reel_watched_deep' : 'reel_skipped_fast',
                  video_id: prevItem.video_id,
                  restaurant: prevItem.restaurant || '',
                  tags: prevItem.tags || [],
                  durationSeconds: watchSec
                });
              }
            }
            this.currentWatchStartTime = Date.now();

            this.pauseAll(); // Dừng ngay các video cũ
            this.currentIndex = idx;
            this.updateVideoMounts();

            // CHIẾN THUẬT 2: Bắn Google Analytics event miễn phí (0 Write Firestore)
            const curItem = this.items[idx];
            this.logReelViewAnalytics(curItem, idx);

            // CHIẾN THUẬT VÒNG LẶP RANDOM: Khi lướt đến gần cuối batch, luôn tự động nạp tiếp 5 video (không bao giờ dừng)
            if (idx >= this.items.length - 2 && !this.isLoadingNextBatch) {
              this.loadNextBatch();
            }

            if (window.authManager && typeof window.authManager.trackStat === 'function') {
              window.authManager.trackStat('reelsWatched', 1);
            }
          }
        } else if (!entry.isIntersecting) {
          // Khi video bị vuốt qua và khuất khỏi màn hình -> Lập tức đóng băng
          const mountBox = document.getElementById(`reel-player-mount-${idx}`);
          if (mountBox) {
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
            // Nếu khuất khỏi phạm vi 3 cửa sổ trượt -> Xoá src="" giải phóng bộ nhớ RAM
            if (Math.abs(idx - this.currentIndex) > 1) {
              this.unmountVideo(idx, mountBox);
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
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
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

    // Cập nhật tất cả các nút âm thanh trên mọi slide để đồng bộ trạng thái
    const allAudioBtns = this.container ? this.container.querySelectorAll('.reel-audio-toggle-btn') : [];
    allAudioBtns.forEach(b => {
      b.innerHTML = `
        <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
        <span>${this.muted ? 'Chạm bật tiếng' : 'Đang phát tiếng'}</span>
      `;
    });
    if (window.lucide) window.lucide.createIcons();
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

  // ══════════════════════════════════════════════════════════════════════
  // MODAL CHIA SẺ VIDEO VỚI BẠN BÈ VÀ NHÓM ĂN UỐNG
  // ══════════════════════════════════════════════════════════════════════
  openShareModal(foodId) {
    window.soundFX && window.soundFX.playPop();
    const modal = document.getElementById('share-reel-modal');
    const content = document.getElementById('share-reel-modal-content');
    if (!modal || !content) return;

    this.currentSharingReel = this.items.find(f => f.id === foodId) || this.items[this.currentIndex];
    this.shareFilter = 'all'; // 'all' | 'friends' | 'groups'
    this.shareSearchQuery = '';

    this.renderShareModalContent();

    modal.classList.remove('hidden');
    setTimeout(() => {
      const sheet = modal.querySelector('.modal-sheet');
      if (sheet) sheet.classList.remove('translate-y-full');
    }, 10);
  }

  closeShareModal() {
    const modal = document.getElementById('share-reel-modal');
    if (!modal) return;
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) sheet.classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  handleShareFilter(filter) {
    this.shareFilter = filter;
    this.renderShareModalContent();
  }

  handleShareSearch(query) {
    this.shareSearchQuery = (query || '').toLowerCase().trim();
    this.renderShareModalContent();
  }

  renderShareModalContent() {
    const content = document.getElementById('share-reel-modal-content');
    if (!content) return;

    const item = this.currentSharingReel || this.items[this.currentIndex] || {};
    const title = item.title || item.restaurant || 'Video review ẩm thực Quy Nhơn';

    // 1. Lấy danh sách bạn bè và nhóm từ APP_DATA
    const myFriends = (window.APP_DATA && Array.isArray(window.APP_DATA.myFriends)) ? window.APP_DATA.myFriends : [];
    const nearbyFriends = (window.APP_DATA && Array.isArray(window.APP_DATA.nearbyFriends)) ? window.APP_DATA.nearbyFriends : [];
    const groupChats = (window.APP_DATA && Array.isArray(window.APP_DATA.groupChats)) ? window.APP_DATA.groupChats : [];

    // Kết hợp và lọc bạn bè
    const friendsMap = new Map();
    [...myFriends, ...nearbyFriends].forEach(f => {
      if (f && f.id && !friendsMap.has(f.id)) friendsMap.set(f.id, f);
    });
    let friends = Array.from(friendsMap.values());
    let groups = [...groupChats];

    // Lọc theo tìm kiếm
    if (this.shareSearchQuery) {
      const q = this.shareSearchQuery;
      friends = friends.filter(f => (f.name && f.name.toLowerCase().includes(q)) || (f.nickname && f.nickname.toLowerCase().includes(q)));
      groups = groups.filter(g => g.name && g.name.toLowerCase().includes(q));
    }

    content.innerHTML = `
      <!-- Header -->
      <div class="p-4 border-b border-stone-100 flex items-center justify-between shrink-0 bg-stone-50/70">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm shrink-0">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </div>
          <div class="min-w-0">
            <h4 class="font-extrabold text-sm text-stone-900 leading-tight">Chia sẻ với Bạn bè & Nhóm</h4>
            <p class="text-[11px] text-stone-500 truncate max-w-[240px] mt-0.5">${title}</p>
          </div>
        </div>
        <button onclick="window.reelsManager.closeShareModal()" class="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition shrink-0 cursor-pointer">✕</button>
      </div>

      <!-- Search Input -->
      <div class="p-3 border-b border-stone-100 bg-white shrink-0">
        <div class="relative">
          <input type="text" placeholder="Tìm kiếm bạn bè hoặc nhóm..." 
            value="${this.shareSearchQuery || ''}"
            oninput="window.reelsManager.handleShareSearch(this.value)"
            class="w-full bg-stone-100 text-xs px-3.5 py-2 pl-9 rounded-xl border border-stone-200 focus:outline-none focus:bg-white focus:border-rose-400 transition" />
          <svg class="w-4 h-4 text-stone-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        </div>
      </div>

      <!-- Filter Tabs: Tất cả | Bạn bè | Nhóm ăn uống -->
      <div class="px-3 py-2 border-b border-stone-100 flex items-center gap-1.5 shrink-0 bg-stone-50/40 text-xs font-bold">
        <button onclick="window.reelsManager.handleShareFilter('all')" 
          class="px-3 py-1 rounded-full transition ${this.shareFilter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
          Tất cả
        </button>
        <button onclick="window.reelsManager.handleShareFilter('friends')" 
          class="px-3 py-1 rounded-full transition ${this.shareFilter === 'friends' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
          ❤️ Bạn bè (${friends.length})
        </button>
        <button onclick="window.reelsManager.handleShareFilter('groups')" 
          class="px-3 py-1 rounded-full transition ${this.shareFilter === 'groups' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
          👥 Nhóm ăn uống (${groups.length})
        </button>
      </div>

      <!-- Scrollable Friends & Groups List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[50vh] scrollbar-none">
        
        <!-- Nhóm ăn uống (nếu bộ lọc cho phép) -->
        ${(this.shareFilter === 'all' || this.shareFilter === 'groups') && groups.length > 0 ? `
          <div class="text-[11px] font-black uppercase tracking-wider text-stone-400 px-1 pt-1">
            Nhóm ăn uống (${groups.length})
          </div>
          ${groups.map(g => `
            <div class="p-2.5 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-amber-50/40 flex items-center justify-between gap-3 transition shadow-2xs">
              <div class="flex items-center gap-3 min-w-0">
                <div class="relative w-10 h-10 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-amber-200">
                  <img src="${g.avatar || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}" alt="${g.name}" class="w-full h-full object-cover" />
                </div>
                <div class="min-w-0">
                  <h5 class="font-extrabold text-xs text-stone-900 leading-snug truncate">${g.name}</h5>
                  <p class="text-[10px] text-stone-500 font-medium">${g.membersCount || 6} thành viên • ${g.time || 'Đang hoạt động'}</p>
                </div>
              </div>
              <button onclick="window.reelsManager.sendShareToTarget('group', '${g.id}', this)" 
                class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-xs hover:opacity-95 active:scale-95 transition shrink-0 cursor-pointer">
                Gửi
              </button>
            </div>
          `).join('')}
        ` : ''}

        <!-- Bạn bè (nếu bộ lọc cho phép) -->
        ${(this.shareFilter === 'all' || this.shareFilter === 'friends') && friends.length > 0 ? `
          <div class="text-[11px] font-black uppercase tracking-wider text-stone-400 px-1 pt-1.5">
            Bạn bè (${friends.length})
          </div>
          ${friends.map(f => `
            <div class="p-2.5 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-rose-50/40 flex items-center justify-between gap-3 transition shadow-2xs">
              <div class="flex items-center gap-3 min-w-0">
                <div class="relative w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-xs border border-stone-200">
                  <img src="${f.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}" alt="${f.name}" class="w-full h-full object-cover" />
                  <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
                </div>
                <div class="min-w-0">
                  <h5 class="font-extrabold text-xs text-stone-900 leading-snug truncate">${f.name}</h5>
                  <p class="text-[10px] text-stone-500 font-medium truncate">${f.distance || f.status || 'Bạn bè'}</p>
                </div>
              </div>
              <button onclick="window.reelsManager.sendShareToTarget('friend', '${f.id}', this)" 
                class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-xs hover:opacity-95 active:scale-95 transition shrink-0 cursor-pointer">
                Gửi
              </button>
            </div>
          `).join('')}
        ` : ''}

        ${friends.length === 0 && groups.length === 0 ? `
          <div class="p-8 text-center text-stone-400 text-xs">
            Không tìm thấy bạn bè hoặc nhóm nào phù hợp.
          </div>
        ` : ''}

      </div>

      <!-- Footer: Sao chép liên kết -->
      <div class="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2 shrink-0">
        <button onclick="window.reelsManager.copyShareLink()" class="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer">
          <svg class="w-3.5 h-3.5 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          <span>Sao chép liên kết</span>
        </button>
        <button onclick="window.reelsManager.closeShareModal(); if (window.app && window.app.switchTab) window.app.switchTab('chat');" class="py-2 px-3.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer">
          <span>Mở mục Chat</span>
          <span>💬</span>
        </button>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  sendShareToTarget(targetType, targetId, btnEl) {
    window.soundFX && window.soundFX.playPop();
    const item = this.currentSharingReel || this.items[this.currentIndex];
    if (!item) return;

    let targetName = 'bạn bè';
    const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const shareText = `🍜 Mình vừa xem video review "${item.title || item.name}" ở Quy Nhơn nè! Khi nào tụi mình ghé ăn chung nha! 😋✨`;

    if (targetType === 'friend') {
      const friendList = [...(window.APP_DATA?.myFriends || []), ...(window.APP_DATA?.nearbyFriends || [])];
      const friend = friendList.find(f => String(f.id) === String(targetId));
      if (friend) {
        targetName = friend.name;
        if (!friend.messages) friend.messages = [];
        friend.messages.push({
          sender: 'you',
          text: shareText,
          time: currentTime,
          sharedVideo: {
            id: item.id,
            title: item.title || item.name,
            image: item.image,
            video_id: item.video_id,
            tags: item.tags
          }
        });
      }
    } else if (targetType === 'group') {
      const groupList = window.APP_DATA?.groupChats || [];
      const group = groupList.find(g => String(g.id) === String(targetId));
      if (group) {
        targetName = group.name;
        if (!group.messages) group.messages = [];
        group.messages.push({
          sender: 'Bạn',
          text: shareText,
          time: currentTime,
          sharedVideo: {
            id: item.id,
            title: item.title || item.name,
            image: item.image,
            video_id: item.video_id,
            tags: item.tags
          }
        });
      }
    }

    if (btnEl) {
      btnEl.innerHTML = '<span>Đã gửi ✓</span>';
      btnEl.className = 'px-3.5 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-default pointer-events-none';
    }

    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(`Đã chia sẻ video đến "${targetName}" thành công! 🚀`);
    }

    if (window.chatManager && typeof window.chatManager.saveFriendsData === 'function') {
      window.chatManager.saveFriendsData();
    }

    // Ghi nhận hành động chia sẻ vào LocalStorage Batcher
    if (window.userActionBatcher) {
      window.userActionBatcher.recordAction({
        type: 'reel_shared',
        targetType: targetType,
        video_id: item.video_id,
        restaurant: item.restaurant || '',
        tags: item.tags || []
      });
    }
  }

  copyShareLink() {
    window.soundFX && window.soundFX.playPop();
    const item = this.currentSharingReel || this.items[this.currentIndex];
    const url = item?.video_id 
      ? `https://www.youtube.com/shorts/${item.video_id}` 
      : window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast(`Đã sao chép liên kết video vào clipboard! 📋`);
      }
    } else {
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast('Đã chia sẻ liên kết thành công! 🚀');
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // KHÁM PHÁ: CHUYỂN QUA QUẸT MÓN THEO HASHTAG & MÓN ĂN CỦA VIDEO
  // ══════════════════════════════════════════════════════════════════════
  exploreHashtags(foodId) {
    window.soundFX && window.soundFX.playPop();
    const item = this.items.find(f => f.id === foodId) || this.items[this.currentIndex];
    if (!item) return;

    this.pauseAll();

    // Ghi nhận hành động khám phá vào LocalStorage Batcher cho AI học gu
    if (window.userActionBatcher) {
      window.userActionBatcher.recordAction({
        type: 'reel_explore_clicked',
        video_id: item.video_id,
        restaurant: item.restaurant || '',
        tags: item.tags || []
      });
    }

    // 1. Phân tích từ khoá từ hashtag, tên quán, tiêu đề và mô tả
    const rawTags = (item.tags || []).map(t => t.replace(/^#/, '').toLowerCase());
    const keywords = new Set();
    rawTags.forEach(t => {
      keywords.add(t);
      t.split(/[\s_]+/).forEach(w => {
        if (w.length > 2) keywords.add(w);
      });
    });

    if (item.restaurant) {
      keywords.add(item.restaurant.toLowerCase());
      item.restaurant.toLowerCase().split(/\s+/).forEach(w => {
        if (w.length > 2) keywords.add(w);
      });
    }

    const textBlob = `${item.title || ''} ${item.name || ''} ${item.desc || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
    
    const dishPatterns = [
      { key: 'bún cá', match: ['bún chả cá', 'bún cá', 'bún sứa', 'chả cá'] },
      { key: 'ốc', match: ['ốc', 'sò', 'hải sản', 'nghêu', 'hàu', 'phố ốc'] },
      { key: 'nem nướng', match: ['nem nướng', 'nem chả', 'chả ram', 'chợ huyện'] },
      { key: 'bánh xèo', match: ['bánh xèo', 'tôm nhảy'] },
      { key: 'bánh hỏi', match: ['bánh hỏi', 'cháo lòng', 'lòng heo'] },
      { key: 'bánh bèo', match: ['bánh bèo', 'bánh nậm', 'bánh lọc', 'bánh tráng'] },
      { key: 'hải sản', match: ['hải sản', 'cá ngừ', 'mực', 'tôm', 'cua', 'lẩu sứa'] },
      { key: 'nướng', match: ['nướng', 'bbq', 'bò nướng', 'xiên'] },
      { key: 'ăn vặt', match: ['ăn vặt', 'chè', 'trà sữa', 'siêu rẻ'] },
      { key: 'xôi', match: ['xôi', 'cháo'] }
    ];

    const detectedPatterns = [];
    dishPatterns.forEach(p => {
      if (p.match.some(m => textBlob.includes(m))) {
        detectedPatterns.push(p);
      }
    });

    // 2. Lọc danh sách món ăn từ kho dữ liệu APP_DATA.foods
    const allFoods = (window.APP_DATA && Array.isArray(window.APP_DATA.foods)) ? window.APP_DATA.foods : [];
    const scoredFoods = [];

    allFoods.forEach(food => {
      if (!food) return;
      if (typeof window.isPermanentlyClosedRestaurant === 'function' && window.isPermanentlyClosedRestaurant(food)) return;
      if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(food)) return;

      let score = 0;
      const fName = (food.name || '').toLowerCase();
      const fRest = (food.restaurant || '').toLowerCase();
      const fTags = (food.tags || []).join(' ').toLowerCase();
      const fDesc = (food.description || '').toLowerCase();

      // Nếu trùng quán -> Ưu tiên tuyệt đối
      if (item.restaurant && (fRest.includes(item.restaurant.toLowerCase()) || item.restaurant.toLowerCase().includes(fRest))) {
        score += 200;
      }

      // Khớp theo các món đặc trưng phát hiện trong video
      detectedPatterns.forEach(p => {
        p.match.forEach(m => {
          if (fName.includes(m)) score += 60;
          if (fTags.includes(m)) score += 40;
          if (fRest.includes(m)) score += 30;
          if (fDesc.includes(m)) score += 20;
        });
      });

      // Khớp theo keywords từ hashtags
      keywords.forEach(kw => {
        if (fName.includes(kw)) score += 35;
        if (fTags.includes(kw)) score += 25;
        if (fRest.includes(kw)) score += 20;
      });

      if (score > 0) {
        scoredFoods.push({ food, score });
      }
    });

    scoredFoods.sort((a, b) => b.score - a.score);
    let matchedFoods = scoredFoods.map(s => s.food);

    // Nếu quá ít (< 10 món), bổ sung thêm các món đặc sản Quy Nhơn để thẻ quẹt luôn dồi dào
    if (matchedFoods.length < 10) {
      const remaining = allFoods.filter(f => !matchedFoods.some(m => m.id === f.id));
      matchedFoods = [...matchedFoods, ...remaining.slice(0, 20)];
    }

    // 3. Nạp vào Swipe Deck
    if (window.swipeManager && typeof window.swipeManager.loadCards === 'function') {
      window.swipeManager.loadCards(matchedFoods);
    }

    // 4. Chuyển sang Tab Quẹt món
    if (window.app && typeof window.app.switchTab === 'function') {
      window.app.switchTab('swipe');
    } else if (typeof window.switchTab === 'function') {
      window.switchTab('swipe');
    }

    // 5. Hiển thị Toast thông báo chủ đề đang quẹt
    const tagLabel = (item.tags && item.tags[0]) || (item.restaurant ? `@${item.restaurant}` : 'Video');
    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(`🎯 Đang quẹt các món theo chủ đề "${tagLabel}" (${matchedFoods.length} món)!`);
    }
  }
}

window.reelsManager = new ReelsManager();
