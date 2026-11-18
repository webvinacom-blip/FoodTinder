// TikTok-Style Vertical Scroll Feed (Cuộn Dọc Reels)
// Tích hợp YouTube Shorts Iframe Player API & Tối ưu hoá QA Toàn diện:
// 1. Autoplay Policy (Muted & User Gesture Unmute)
// 2. Memory Leak Prevention (Virtualization / Windowing 2-3 Iframes)
// 3. Dead Link Handling (Auto-skip on YouTube onError)

class ReelsManager {
  constructor(containerId = 'reels-feed-container') {
    this.container = document.getElementById(containerId);
    this.currentIndex = 0;
    this.muted = true;
    this.likedMap = {};
    this.commentsMap = {};
    this.items = [];
    this.players = {}; // Lưu YT.Player instance nếu có
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
    // Bắt sự kiện onError từ iframe YouTube qua postMessage
    window.addEventListener('message', (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.event === 'onError') {
          console.warn('[QA DeadLink Handler] YouTube postMessage onError:', data);
          this.handleVideoError(this.currentIndex, data.info);
        }
      } catch (err) {}
    });
  }

  init() {
    this.container = document.getElementById('reels-feed-container');
    if (!this.container) return;

    // Lọc danh sách: ưu tiên các quán có video review Shorts thực tế lên đầu
    const allFoods = (window.APP_DATA && Array.isArray(window.APP_DATA.foods)) ? window.APP_DATA.foods : [];
    const withVideos = allFoods.filter(f => f.video_id || f.videoUrl);
    const withoutVideos = allFoods.filter(f => !f.video_id && !f.videoUrl);

    // Danh sách hiển thị Reels (tối đa 40 quán đặc sản nổi bật có video)
    this.items = [...withVideos, ...withoutVideos.slice(0, 15)];
    if (this.items.length === 0) return;

    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = '';
    this.container.className = 'w-full h-full overflow-y-auto snap-y snap-mandatory select-none scrollbar-none';
    this.container.style.scrollBehavior = 'smooth';
    this.container.style.scrollbarWidth = 'none';

    // Render từng slide Reel (mỗi slide cao đúng 100% viewport)
    this.items.forEach((food, idx) => {
      const slideEl = this.createSlideElement(food, idx);
      this.container.appendChild(slideEl);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.setupScrollObserver();

    // Mount video cho slide đầu tiên
    setTimeout(() => {
      this.updateVideoMounts();
    }, 50);
  }

  createSlideElement(food, idx) {
    const isLiked = !!this.likedMap[food.id];
    const likesCount = (food.likesCount || 1200) + (isLiked ? 1 : 0);

    const itemEl = document.createElement('div');
    itemEl.className = 'reel-item relative w-full h-full snap-start snap-always shrink-0 overflow-hidden bg-black flex items-center justify-center';
    itemEl.dataset.foodId = food.id;
    itemEl.dataset.index = idx;

    const videoId = food.video_id || (food.videoUrl && food.videoUrl.includes('shorts/') ? food.videoUrl.split('shorts/')[1].split('?')[0] : '');

    itemEl.innerHTML = `
      <!-- Phone Viewport Wrapper (Canh giữa chuẩn tỷ lệ 9:16 trên desktop, full màn hình trên mobile) -->
      <div class="relative w-full max-w-[480px] h-full overflow-hidden bg-stone-950 flex items-center justify-center shadow-2xl">
        
        <!-- 1. Player Mount Container -->
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
          
          <!-- Iframe mount box (Được Virtualization mount/unmount động) -->
          <div id="reel-player-mount-${idx}" class="absolute inset-0 w-full h-full z-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <!-- Iframe sẽ được gắn vào đây khi slide active -->
          </div>

          <!-- Fallback Poster Image (Luôn hiển thị poster món ăn sắc nét ngay lập tức) -->
          <img src="${food.image}" alt="${food.name}"
            data-name="${(food.name || '').replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${(food.name || '').replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="reel-poster-img absolute inset-0 w-full h-full object-cover filter brightness-90 -z-10" />

          <!-- Dark Gradient Overlays (Tạo chiều sâu điện ảnh, làm nổi bật text) -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none z-10"></div>
        </div>

        <!-- 2. Nút Bật/Tắt Âm Thanh (QA Case 1: Autoplay & Mute Policy) -->
        <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
          <div class="flex items-center gap-2">
            <span class="bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-md">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Live Reels
            </span>
            ${food.video_id ? `
              <span class="bg-red-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-md">
                ▶ YouTube Shorts
              </span>
            ` : ''}
          </div>
          
          <button onclick="window.reelsManager.toggleAudio(this)" class="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition flex items-center gap-1.5 text-xs font-bold shadow-lg cursor-pointer">
            <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
            <span>${this.muted ? 'Chạm bật tiếng' : 'Đang phát tiếng'}</span>
          </button>
        </div>

        <!-- 3. Action Bar bên phải: Avatar, Tim, Bình luận, Chia sẻ, Chỉ đường -->
        <div class="absolute right-3 bottom-24 flex flex-col items-center gap-3.5 z-30 pointer-events-auto">
          <!-- Avatar quán kèm dấu '+' follow -->
          <div class="relative mb-0.5">
            <div class="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-xl bg-white">
              <img src="${food.image}" alt="${food.restaurant}" class="w-full h-full object-cover" />
            </div>
            <button onclick="window.reelsManager.toggleFollow(this)" class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition">
              +
            </button>
          </div>

          <!-- Thả tim (Like) -->
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

      </div>
    `;

    // Nhấp đúp màn hình để thả tim
    itemEl.addEventListener('dblclick', (e) => {
      this.spawnHeartAt(e.clientX, e.clientY, itemEl);
      this.toggleLike(food.id, itemEl.querySelector('button i[data-lucide="heart"]').parentElement, true);
    });

    return itemEl;
  }

  // ══════════════════════════════════════════════════════════════════════
  // QA CASE 2: QUẢN LÝ BỘ NHỚ & VIRTUALIZATION
  // Chỉ mount tối đa 2 iframe YouTube trong DOM (hiện tại và kế tiếp)
  // Toàn bộ slide khác không chứa iframe để tránh tràn RAM/GPU (Chống Crash)
  // ══════════════════════════════════════════════════════════════════════
  updateVideoMounts() {
    if (!this.container || this.items.length === 0) return;

    const cur = this.currentIndex;
    const shouldMountIndices = [cur, cur + 1].filter(i => i >= 0 && i < this.items.length);

    this.items.forEach((food, idx) => {
      const mountBox = document.getElementById(`reel-player-mount-${idx}`);
      if (!mountBox) return;

      const videoId = food.video_id || (food.videoUrl && food.videoUrl.includes('shorts/') ? food.videoUrl.split('shorts/')[1].split('?')[0] : '');

      if (shouldMountIndices.includes(idx)) {
        // Cần mount iframe nếu chưa có
        if (!mountBox.querySelector('iframe') && !mountBox.querySelector('video')) {
          if (videoId) {
            const iframe = document.createElement('iframe');
            iframe.id = `yt-iframe-${idx}`;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            const originParam = window.location.protocol.startsWith('http') ? `&origin=${encodeURIComponent(window.location.origin)}` : '';
            // controls=0, mute=1 (autoplay policy), playsinline=1, loop=1
            iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=${this.muted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0${originParam}`;
            iframe.className = 'w-full h-full border-0 pointer-events-none object-cover';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            mountBox.appendChild(iframe);
          } else if (food.videoUrl && !food.videoUrl.includes('youtube')) {
            const video = document.createElement('video');
            video.src = food.videoUrl;
            video.poster = food.image;
            video.className = 'w-full h-full object-cover';
            video.loop = true;
            video.playsInline = true;
            video.muted = this.muted;
            video.preload = 'metadata';
            video.onerror = () => this.handleVideoError(idx);
            mountBox.appendChild(video);
            if (idx === cur) video.play().catch(() => {});
          }
        } else {
          // Iframe đã có, gửi lệnh play/pause tương ứng
          const iframe = mountBox.querySelector('iframe');
          if (iframe && iframe.contentWindow) {
            const cmd = idx === cur ? 'playVideo' : 'pauseVideo';
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
            if (idx === cur) {
              const muteCmd = this.muted ? 'mute' : 'unMute';
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: muteCmd, args: [] }), '*');
            }
          }
          const video = mountBox.querySelector('video');
          if (video) {
            if (idx === cur) {
              video.muted = this.muted;
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          }
        }
      } else {
        // Nằm ngoài cửa sổ -> XÓA TRIỆT ĐỂ KHỎI DOM ĐỂ GIẢI PHÓNG BỘ NHỚ
        if (mountBox.innerHTML.trim() !== '') {
          mountBox.innerHTML = '';
        }
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  // SCROLL OBSERVER (Phát hiện slide đang xem khi người dùng cuộn)
  // ══════════════════════════════════════════════════════════════════════
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

  // ══════════════════════════════════════════════════════════════════════
  // QA CASE 1: BẬT / TẮT ÂM THANH (AUTOPLAY POLICY & USER GESTURE)
  // ══════════════════════════════════════════════════════════════════════
  toggleAudio(btn) {
    this.muted = !this.muted;

    const mountBox = document.getElementById(`reel-player-mount-${this.currentIndex}`);
    if (mountBox) {
      // Điều khiển YouTube Iframe
      const iframe = mountBox.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        const cmd = this.muted ? 'mute' : 'unMute';
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
      }
      // Điều khiển HTML5 Video
      const video = mountBox.querySelector('video');
      if (video) {
        video.muted = this.muted;
      }
    }

    // Cập nhật nhãn nút loa
    if (btn) {
      btn.innerHTML = `
        <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
        <span>${this.muted ? 'Chạm bật tiếng' : 'Đang phát tiếng'}</span>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // QA CASE 3: XỬ LÝ LINK CHẾT (DEAD LINK AUTO-SKIP)
  // ══════════════════════════════════════════════════════════════════════
  handleVideoError(idx, code) {
    console.warn(`[QA DeadLink Handler] Video vị trí ${idx} lỗi (code: ${code}). Tự động lướt sang video kế tiếp...`);
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
