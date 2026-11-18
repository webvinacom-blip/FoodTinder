// TikTok-Style Vertical Scroll Feed (Cuộn Dọc Reels)
// Tích hợp YouTube Iframe Player API & Tối ưu hoá QA Toàn diện:
// 1. Autoplay Policy (Muted & User Gesture Unmute)
// 2. Memory Leak Prevention (Virtualization / Windowing 3 Videos)
// 3. Dead Link Handling (Auto-skip on YouTube onError)

class ReelsManager {
  constructor(containerId = 'reels-feed-container') {
    this.container = document.getElementById(containerId);
    this.currentIndex = 0;
    this.muted = true;
    this.likedMap = {};
    this.commentsMap = {};
    this.players = {}; // Lưu trữ instance YT.Player { [index]: player }
    this.ytApiReady = false;
    this.items = [];
    this.isScrolling = false;

    this.ensureYouTubeApi();
  }

  ensureYouTubeApi() {
    if (window.YT && window.YT.Player) {
      this.ytApiReady = true;
      return;
    }
    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0] || document.head;
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      const oldReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof oldReady === 'function') oldReady();
        this.ytApiReady = true;
        this.syncActivePlayers();
      };
    }
  }

  init() {
    if (!this.container) return;

    // Lọc danh sách: ưu tiên các quán có video review thực tế
    const allFoods = (window.APP_DATA && Array.isArray(window.APP_DATA.foods)) ? window.APP_DATA.foods : [];
    const withVideos = allFoods.filter(f => f.video_id || f.videoUrl);
    const withoutVideos = allFoods.filter(f => !f.video_id && !f.videoUrl);

    // Ghép danh sách: ưu tiên video thực tế lên đầu, sau đó đến các món khác
    this.items = [...withVideos, ...withoutVideos];
    if (this.items.length === 0) return;

    this.renderVirtualContainer();
    this.renderWindow();
    this.setupScrollListener();
  }

  renderVirtualContainer() {
    this.container.innerHTML = '';
    this.container.className = 'relative w-full h-full overflow-y-auto snap-y snap-mandatory select-none scrollbar-none';
    this.container.style.scrollBehavior = 'smooth';
    this.container.style.scrollbarWidth = 'none';

    // Tạo canvas/wrapper ảo với tổng chiều cao = totalItems * 100%
    this.virtualCanvas = document.createElement('div');
    this.virtualCanvas.className = 'relative w-full';
    this.virtualCanvas.style.height = `${this.items.length * 100}%`;
    this.container.appendChild(this.virtualCanvas);
  }

  // ══════════════════════════════════════════════════════════════════════
  // QA CASE 2: QUẢN LÝ BỘ NHỚ (WINDOWING / VIRTUALIZATION)
  // Chỉ mount tối đa 3 video trong DOM [currentIndex - 1, currentIndex, currentIndex + 1]
  // Hủy triệt để các video ngoài cửa sổ để chống tràn RAM/GPU (Memory Leak)
  // ══════════════════════════════════════════════════════════════════════
  renderWindow() {
    if (!this.virtualCanvas || this.items.length === 0) return;

    const visibleIndices = [this.currentIndex - 1, this.currentIndex, this.currentIndex + 1].filter(
      i => i >= 0 && i < this.items.length
    );

    // 1. Dọn dẹp các slide và YouTube player nằm ngoài cửa sổ
    const mountedEls = this.virtualCanvas.querySelectorAll('.reel-item');
    mountedEls.forEach(el => {
      const idx = Number(el.dataset.index);
      if (!visibleIndices.includes(idx)) {
        if (this.players[idx]) {
          try {
            if (typeof this.players[idx].destroy === 'function') {
              this.players[idx].destroy();
            }
          } catch (e) {}
          delete this.players[idx];
        }
        el.remove();
      }
    });

    // 2. Mount các slide nằm trong Virtual Window
    visibleIndices.forEach(idx => {
      let slideEl = this.virtualCanvas.querySelector(`.reel-item[data-index="${idx}"]`);
      if (!slideEl) {
        slideEl = this.createSlideElement(idx);
        this.virtualCanvas.appendChild(slideEl);
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.syncActivePlayers();
  }

  createSlideElement(idx) {
    const food = this.items[idx];
    const isLiked = !!this.likedMap[food.id];
    const likesCount = (food.likesCount || 1200) + (isLiked ? 1 : 0);

    const itemEl = document.createElement('div');
    itemEl.className = 'reel-item absolute left-0 right-0 h-full w-full snap-start snap-always overflow-hidden bg-black flex items-center justify-center select-none';
    itemEl.style.top = `${idx * 100}%`;
    itemEl.dataset.foodId = food.id;
    itemEl.dataset.index = idx;

    const hasVideo = !!(food.video_id || food.videoUrl);
    const videoId = food.video_id || (food.videoUrl && food.videoUrl.includes('shorts/') ? food.videoUrl.split('shorts/')[1].split('?')[0] : '');

    itemEl.innerHTML = `
      <!-- 1. Player Container (Hỗ trợ YouTube Shorts API hoặc MP4 Video) -->
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-black pointer-events-none">
        ${videoId ? `
          <div id="yt-player-box-${idx}" class="w-full h-full object-cover">
            <div id="yt-player-${idx}" class="w-full h-full"></div>
          </div>
        ` : (food.videoUrl && !food.videoUrl.includes('youtube') ? `
          <video 
            src="${food.videoUrl}" 
            poster="${food.image}"
            class="reel-video w-full h-full object-cover" 
            loop 
            playsinline 
            ${this.muted ? 'muted' : ''}
            preload="metadata"
            onerror="window.reelsManager && window.reelsManager.handleVideoError(${idx})"
          ></video>
        ` : '')}

        <!-- Fallback Poster Image -->
        <img src="${food.image}" alt="${food.name}"
          data-name="${(food.name || '').replace(/"/g, '&quot;')}"
          data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
          data-category="${food.category || ''}"
          onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${(food.name || '').replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
          class="reel-fallback-img absolute inset-0 w-full h-full object-cover -z-10 filter brightness-95" />

        <!-- Lớp phủ Gradient điện ảnh sắc nét -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none"></div>
      </div>

      <!-- 2. Nút Bật/Tắt Âm Thanh (QA Case 1: Autoplay & Mute Policy) -->
      <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
        <div class="flex items-center gap-2">
          <span class="bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-md">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Live Reels
          </span>
          ${food.video_id ? `
            <span class="bg-red-600/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-white/20">
              ▶ YouTube Shorts
            </span>
          ` : ''}
        </div>
        <button onclick="window.reelsManager.toggleAudio(this)" class="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition flex items-center gap-1.5 text-xs font-bold shadow-md cursor-pointer">
          <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
          <span>${this.muted ? 'Chạm bật tiếng' : 'Đang bật tiếng'}</span>
        </button>
      </div>

      <!-- 3. Action Bar bên phải: Avatar, Tim, Bình luận, Chia sẻ, Chỉ đường -->
      <div class="absolute right-3 bottom-24 flex flex-col items-center gap-3.5 z-30 pointer-events-auto">
        <!-- Restaurant Avatar with '+' -->
        <div class="relative mb-0.5">
          <div class="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-xl bg-white">
            <img src="${food.image}" alt="${food.restaurant}" class="w-full h-full object-cover" />
          </div>
          <button onclick="window.reelsManager.toggleFollow(this)" class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition">
            +
          </button>
        </div>

        <!-- Thả tim -->
        <div class="flex flex-col items-center">
          <button onclick="window.reelsManager.toggleLike(${food.id}, this)" class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
            <i data-lucide="heart" class="w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}"></i>
          </button>
          <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md likes-counter">${likesCount}</span>
        </div>

        <!-- Bình luận -->
        <div class="flex flex-col items-center">
          <button onclick="window.reelsManager.openComments(${food.id})" class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
            <i data-lucide="message-circle" class="w-6 h-6"></i>
          </button>
          <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md">${food.commentsCount || 98}</span>
        </div>

        <!-- Chia sẻ -->
        <div class="flex flex-col items-center">
          <button onclick="window.reelsManager.shareReel(${food.id})" class="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
            <i data-lucide="share-2" class="w-6 h-6"></i>
          </button>
          <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md">Chia sẻ</span>
        </div>

        <!-- Nút Chỉ đường -->
        <button onclick="window.app && window.app.openMapWithFood ? window.app.openMapWithFood(${food.id}) : window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((food.restaurant || food.name) + ' Quy Nhơn')}', '_blank')" class="bg-[#F5B041] hover:bg-[#F39C12] text-stone-900 font-extrabold text-[11px] px-2.5 py-2 rounded-xl shadow-lg flex flex-col items-center gap-0.5 hover:scale-105 active:scale-95 transition border border-amber-200">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
            <line x1="9" y1="3" x2="9" y2="18"></line>
            <line x1="15" y1="6" x2="15" y2="21"></line>
          </svg>
          <span>Chỉ đường</span>
        </button>
      </div>

      <!-- 4. Thông tin quán bên dưới -->
      <div class="absolute left-4 bottom-6 right-20 text-white z-30 pointer-events-auto">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-extrabold text-base text-white drop-shadow-md">@ ${food.restaurant}</h4>
          <span class="bg-rose-500/90 text-[10px] font-bold px-2 py-0.5 rounded-full">${food.distanceText || 'Quy Nhơn'}</span>
        </div>
        
        <p class="text-xs text-white/90 font-medium leading-relaxed drop-shadow-sm line-clamp-2 mb-1.5">
          ${food.name} • ${food.description || food.recommendReason}
        </p>

        <div class="flex flex-wrap gap-1.5 mb-2">
          <span class="text-[11px] font-bold text-amber-300">💰 ${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}</span>
          <span class="text-[11px] font-bold text-amber-200">• 🕒 ${food.openTime || '07:00 - 22:00'}</span>
        </div>

        <div class="flex items-center gap-2 text-white/70 text-[11px]">
          <i data-lucide="music" class="w-3.5 h-3.5 animate-spin" style="animation-duration: 4s;"></i>
          <span class="truncate max-w-[220px]">Âm thanh gốc - Ẩm thực Quy Nhơn Review</span>
        </div>
      </div>
    `;

    // Nhấp đúp thả tim
    itemEl.addEventListener('dblclick', (e) => {
      this.spawnHeartAt(e.clientX, e.clientY, itemEl);
      this.toggleLike(food.id, itemEl.querySelector('button i[data-lucide="heart"]').parentElement, true);
    });

    return itemEl;
  }

  // ══════════════════════════════════════════════════════════════════════
  // ĐỒNG BỘ YOUTUBE IFRAME PLAYER API (controls=0, autoplay=1, mute=1)
  // ══════════════════════════════════════════════════════════════════════
  syncActivePlayers() {
    if (!this.ytApiReady || !window.YT || !window.YT.Player) return;

    const visibleIndices = [this.currentIndex - 1, this.currentIndex, this.currentIndex + 1].filter(
      i => i >= 0 && i < this.items.length
    );

    visibleIndices.forEach(idx => {
      const food = this.items[idx];
      const videoId = food.video_id || (food.videoUrl && food.videoUrl.includes('shorts/') ? food.videoUrl.split('shorts/')[1].split('?')[0] : '');

      if (!videoId) {
        // Native HTML5 Video
        const slideEl = this.virtualCanvas.querySelector(`.reel-item[data-index="${idx}"]`);
        if (slideEl) {
          const video = slideEl.querySelector('video');
          if (video) {
            if (idx === this.currentIndex) {
              video.muted = this.muted;
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          }
        }
        return;
      }

      const domId = `yt-player-${idx}`;
      const el = document.getElementById(domId);

      if (!this.players[idx] && el) {
        try {
          this.players[idx] = new window.YT.Player(domId, {
            videoId: videoId,
            playerVars: {
              autoplay: idx === this.currentIndex ? 1 : 0,
              mute: this.muted ? 1 : 0,
              controls: 0,          // TẮT TOÀN BỘ CONTROL MẶC ĐỊNH
              disablekb: 1,         // Tắt phím tắt
              modestbranding: 1,    // Ẩn logo
              rel: 0,               // Không hiện video liên quan
              fs: 0,                // Tắt nút fullscreen
              playsinline: 1,       // Phát thẳng trên mobile
              loop: 1,              // Lặp vô tận
              playlist: videoId,    // Tham số cần thiết để loop hoạt động
              iv_load_policy: 3     // Tắt chú thích
            },
            events: {
              onReady: (event) => {
                if (idx === this.currentIndex) {
                  if (this.muted) event.target.mute();
                  else event.target.unMute();
                  event.target.playVideo();
                } else {
                  event.target.pauseVideo();
                }
              },
              onError: (event) => {
                this.handleYouTubeError(idx, event.data);
              }
            }
          });
        } catch (err) {
          console.warn('[Reels] Không thể khởi tạo YT.Player:', err);
        }
      } else if (this.players[idx]) {
        try {
          if (idx === this.currentIndex) {
            if (this.muted) this.players[idx].mute();
            else this.players[idx].unMute();
            if (typeof this.players[idx].playVideo === 'function') {
              this.players[idx].playVideo();
            }
          } else {
            if (typeof this.players[idx].pauseVideo === 'function') {
              this.players[idx].pauseVideo();
            }
          }
        } catch (e) {}
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  // QA CASE 3: XỬ LÝ LINK CHẾT (DEAD LINK AUTO-SKIP)
  // Khi video bị xóa, set private hoặc chặn nhúng -> Tự động skip mượt mà
  // ══════════════════════════════════════════════════════════════════════
  handleYouTubeError(idx, errorCode) {
    console.warn(`[QA DeadLink Handler] Video YouTube tại vị trí ${idx} bị lỗi (mã: ${errorCode}). Tự động chuyển video...`);
    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast('Video không khả dụng, đang chuyển sang video kế tiếp... ⏭️');
    }
    this.skipToNext();
  }

  handleVideoError(idx) {
    console.warn(`[QA DeadLink Handler] Video HTML5 tại vị trí ${idx} bị lỗi tải. Tự động chuyển video...`);
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

  setupScrollListener() {
    if (!this.container) return;

    let scrollTimeout = null;
    this.container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const itemHeight = this.container.clientHeight;
        if (itemHeight <= 0) return;
        const newIndex = Math.round(this.container.scrollTop / itemHeight);
        if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.items.length) {
          this.currentIndex = newIndex;
          this.renderWindow();
          if (window.authManager && typeof window.authManager.trackStat === 'function') {
            window.authManager.trackStat('reelsWatched', 1);
          }
        }
      }, 80);
    }, { passive: true });
  }

  onTabVisible() {
    this.syncActivePlayers();
  }

  // ══════════════════════════════════════════════════════════════════════
  // QA CASE 1: CHÍNH SÁCH AUTOPLAY (MUTE / UNMUTE THEO USER GESTURE)
  // ══════════════════════════════════════════════════════════════════════
  toggleAudio(btn) {
    this.muted = !this.muted;

    // Cập nhật YouTube Player hiện tại
    const activeYt = this.players[this.currentIndex];
    if (activeYt) {
      try {
        if (this.muted) activeYt.mute();
        else activeYt.unMute();
      } catch (e) {}
    }

    // Cập nhật native video nếu có
    const activeSlide = this.virtualCanvas.querySelector(`.reel-item[data-index="${this.currentIndex}"]`);
    if (activeSlide) {
      const v = activeSlide.querySelector('video');
      if (v) v.muted = this.muted;
    }

    // Cập nhật nhãn nút loa
    if (btn) {
      btn.innerHTML = `
        <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
        <span>${this.muted ? 'Chạm bật tiếng' : 'Đang bật tiếng'}</span>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  toggleLike(foodId, btnEl, forceLike = false) {
    window.soundFX && window.soundFX.playPop();
    const currentlyLiked = !!this.likedMap[foodId];
    const shouldLike = forceLike ? true : !currentlyLiked;
    this.likedMap[foodId] = shouldLike;

    const food = this.items.find(f => f.id === foodId);
    if (shouldLike && food && window.app && typeof window.app.addLikedFood === 'function') {
      window.app.addLikedFood(food);
    }

    const itemEl = this.container.querySelector(`.reel-item[data-food-id="${foodId}"]`);
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
      if (counterEl && food) {
        counterEl.textContent = (food.likesCount || 1200) + (shouldLike ? 1 : 0);
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

    const food = this.items.find(f => f.id === foodId);
    document.getElementById('comments-food-title').textContent = food ? food.restaurant : 'Bình luận';

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
    const food = this.items.find(f => f.id === foodId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      window.app && window.app.showToast && window.app.showToast(`Đã sao chép liên kết quán "${food ? food.restaurant : ''}"! 📋`);
    } else {
      window.app && window.app.showToast && window.app.showToast("Đã chia sẻ thành công! 🚀");
    }
  }
}

window.reelsManager = new ReelsManager();
