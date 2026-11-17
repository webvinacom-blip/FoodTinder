// TikTok-Style Vertical Scroll Feed (Cuộn Dọc Reels)

class ReelsManager {
  constructor(containerId = 'reels-feed-container') {
    this.container = document.getElementById(containerId);
    this.currentIndex = 0;
    this.muted = true;
    this.likedMap = {};
    this.commentsMap = {};
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    APP_DATA.foods.forEach((food, idx) => {
      const isLiked = !!this.likedMap[food.id];
      const likesCount = (food.likesCount || 1200) + (isLiked ? 1 : 0);

      const itemEl = document.createElement('div');
      itemEl.className = 'reel-item relative w-full h-full snap-start snap-always overflow-hidden bg-black flex items-center justify-center select-none';
      itemEl.dataset.foodId = food.id;
      itemEl.dataset.index = idx;

      itemEl.innerHTML = `
        <!-- Video / Animated Media -->
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
          ${food.videoUrl ? `
          <video 
            src="${food.videoUrl}" 
            poster="${food.image}"
            class="reel-video w-full h-full object-cover" 
            loop 
            playsinline 
            ${this.muted ? 'muted' : ''}
            preload="metadata"
          ></video>
          ` : ''}

          <!-- Fallback animated visual overlay if video takes a second -->
          <img src="${food.image}" alt="${food.name}"
            data-name="${food.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="reel-fallback-img absolute inset-0 w-full h-full object-cover -z-10 filter brightness-95" />

          <!-- Dark Gradient Overlays for readability -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none"></div>
        </div>

        <!-- Top Controls: Sound Toggle & Filter -->
        <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div class="flex items-center gap-2">
            <span class="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Live Reels
            </span>
          </div>
          <button onclick="window.reelsManager.toggleAudio(this)" class="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition">
            <i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Right Side Action Bar (Matching Image 1 View 3) -->
        <div class="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20">
          <!-- Restaurant Avatar with Follow '+' button -->
          <div class="relative mb-1">
            <div class="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg bg-white">
              <img src="${food.image}" alt="${food.restaurant}"
                data-name="${food.name.replace(/"/g, '&quot;')}"
                data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
                data-category="${food.category || ''}"
                onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
                class="w-full h-full object-cover" />
            </div>
            <button onclick="window.reelsManager.toggleFollow(this)" class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition">
              +
            </button>
          </div>

          <!-- Like / Thả tim -->
          <div class="flex flex-col items-center">
            <button onclick="window.reelsManager.toggleLike(${food.id}, this)" class="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
              <i data-lucide="heart" class="w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}"></i>
            </button>
            <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md likes-counter">${likesCount}</span>
          </div>

          <!-- Comments / Bình luận -->
          <div class="flex flex-col items-center">
            <button onclick="window.reelsManager.openComments(${food.id})" class="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
              <i data-lucide="message-circle" class="w-6 h-6"></i>
            </button>
            <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md">${food.commentsCount || 98}</span>
          </div>

          <!-- Share / Chia sẻ -->
          <div class="flex flex-col items-center">
            <button onclick="window.reelsManager.shareReel(${food.id})" class="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
              <i data-lucide="share-2" class="w-6 h-6"></i>
            </button>
            <span class="text-white text-[11px] font-semibold mt-1 drop-shadow-md">Chia sẻ</span>
          </div>

          <!-- Yellow Direction Button: "Chỉ đường" -->
          <button onclick="window.app.openMapWithFood(${food.id})" class="bg-[#F5B041] hover:bg-[#F39C12] text-stone-900 font-extrabold text-[11px] px-2.5 py-2 rounded-xl shadow-lg flex flex-col items-center gap-0.5 hover:scale-105 active:scale-95 transition border border-amber-200">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              <line x1="9" y1="3" x2="9" y2="18"></line>
              <line x1="15" y1="6" x2="15" y2="21"></line>
            </svg>
            <span>Chỉ đường</span>
          </button>
        </div>

        <!-- Bottom Overlay: Name, Hashtags, Audio info -->
        <div class="absolute left-4 bottom-6 right-20 text-white z-20 pointer-events-auto">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-extrabold text-base text-white drop-shadow-md">@ ${food.restaurant}</h4>
            <span class="bg-rose-500/80 text-[10px] font-bold px-2 py-0.5 rounded-full">Cách ${food.distanceText.replace('Cách bạn ', '')}</span>
          </div>
          
          <p class="text-xs text-white/90 font-medium leading-relaxed drop-shadow-sm line-clamp-2 mb-2">
            ${food.name} - ${food.desc}
          </p>

          <div class="flex flex-wrap gap-1.5 mb-2.5">
            <span class="text-[11px] font-bold text-amber-300">#Đang_đói</span>
            <span class="text-[11px] font-bold text-amber-200">• Phù hợp trời mưa lạnh</span>
            <span class="text-[11px] font-bold text-white/80">• ${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}</span>
          </div>

          <!-- Rotating sound track title -->
          <div class="flex items-center gap-2 text-white/70 text-[11px]">
            <i data-lucide="music" class="w-3.5 h-3.5 animate-spin" style="animation-duration: 4s;"></i>
            <span class="truncate max-w-[200px]">Âm thanh gốc - Lẩu xì xèo ngày mưa Quy Nhơn</span>
          </div>
        </div>
      `;

      // Double-click or double-tap to like with heart animation
      itemEl.addEventListener('dblclick', (e) => {
        this.spawnHeartAt(e.clientX, e.clientY, itemEl);
        this.toggleLike(food.id, itemEl.querySelector('button i[data-lucide="heart"]').parentElement, true);
      });

      this.container.appendChild(itemEl);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.setupScrollObserver();
  }

  setupScrollObserver() {
    const options = {
      root: this.container,
      threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (!video) return;

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, options);

    this.container.querySelectorAll('.reel-item').forEach(el => observer.observe(el));
  }

  toggleLike(foodId, btnEl, forceLike = false) {
    window.soundFX && window.soundFX.playPop();
    const currentlyLiked = !!this.likedMap[foodId];
    const shouldLike = forceLike ? true : !currentlyLiked;
    this.likedMap[foodId] = shouldLike;

    const food = APP_DATA.foods.find(f => f.id === foodId);
    if (shouldLike && food) {
      window.app.addLikedFood(food);
    }

    // Update UI in reel
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

  toggleAudio(btn) {
    this.muted = !this.muted;
    this.container.querySelectorAll('video').forEach(v => {
      v.muted = this.muted;
    });

    if (btn) {
      btn.innerHTML = `<i data-lucide="${this.muted ? 'volume-x' : 'volume-2'}" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  openComments(foodId) {
    window.soundFX && window.soundFX.playPop();
    const modal = document.getElementById('comments-modal');
    const commentsList = document.getElementById('comments-list');
    if (!modal || !commentsList) return;

    const food = APP_DATA.foods.find(f => f.id === foodId);
    document.getElementById('comments-food-title').textContent = food ? food.restaurant : 'Bình luận';

    // Render comments
    commentsList.innerHTML = APP_DATA.reelComments.map(c => `
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

  addComment(text) {
    if (!text.trim()) return;
    APP_DATA.reelComments.unshift({
      user: "Bạn",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      text: text.trim(),
      time: "Vừa xong"
    });
    this.openComments();
  }

  shareReel(foodId) {
    window.soundFX && window.soundFX.playPop();
    const food = APP_DATA.foods.find(f => f.id === foodId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      window.app.showToast(`Đã sao chép liên kết quán "${food ? food.restaurant : ''}"! 📋`);
    } else {
      window.app.showToast("Đã chia sẻ thành công! 🚀");
    }
  }
}

window.reelsManager = new ReelsManager();
