// Tinder-Style Swipe Engine (Thẻ Vuốt Cảm Xúc)

class TinderSwipeManager {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.deck = [];
    this.history = [];
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.activeCard = null;
    this.likeBadge = null;
    this.nopeBadge = null;
  }

  loadCards(foods) {
    this.deck = [...foods];
    this.currentIndex = 0;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    if (this.currentIndex >= this.deck.length) {
      this.renderEmptyState();
      return;
    }

    // Render up to 3 cards in the stack
    const visibleCards = this.deck.slice(this.currentIndex, this.currentIndex + 3);

    visibleCards.reverse().forEach((food, reverseIdx) => {
      const actualIdx = visibleCards.length - 1 - reverseIdx;
      const isTop = actualIdx === 0;

      const cardEl = document.createElement('div');
      cardEl.className = `tinder-card absolute inset-0 rounded-[28px] overflow-hidden shadow-2xl transition-transform duration-300 select-none bg-white border border-[#F0E6DD]`;
      cardEl.style.zIndex = 10 - actualIdx;

      // Scale and position cards behind top card
      if (actualIdx === 1) {
        cardEl.style.transform = 'scale(0.95) translateY(14px)';
        cardEl.style.opacity = '0.85';
      } else if (actualIdx === 2) {
        cardEl.style.transform = 'scale(0.90) translateY(28px)';
        cardEl.style.opacity = '0.6';
      }

      cardEl.innerHTML = `
        <!-- Image Container -->
        <div class="relative w-full h-[62%] overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}" class="w-full h-full object-cover pointer-events-none" />
          
          <!-- Top Floating Chip: Cách bạn 1.2km • Trời mưa 24°C -->
          <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
            <div class="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-700 shadow-sm flex items-center gap-1.5 border border-white/60">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500"></i>
              <span>${food.distanceText} • ${food.weatherNote}</span>
            </div>
            <div class="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-medium">
              ⭐ ${food.rating}
            </div>
          </div>

          <!-- Mood / Atmosphere Tag Badge on Photo -->
          <div class="absolute top-16 left-4 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            ${food.tags.map(t => `<span class="bg-[#FFF4ED]/90 backdrop-blur-md text-[#E65100] font-bold text-[11px] px-3 py-1 rounded-full border border-[#FFE0B2] shadow-sm">${t}</span>`).join('')}
          </div>

          <!-- Like / Dislike Stamp Badges -->
          <div class="stamp-like absolute top-12 left-6 z-20 pointer-events-none opacity-0 border-4 border-emerald-500 text-emerald-500 font-extrabold text-2xl tracking-widest px-4 py-1.5 rounded-2xl transform -rotate-12 bg-white/40 backdrop-blur-sm shadow-lg">
            THÍCH ❤️
          </div>
          <div class="stamp-nope absolute top-12 right-6 z-20 pointer-events-none opacity-0 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl tracking-widest px-4 py-1.5 rounded-2xl transform rotate-12 bg-white/40 backdrop-blur-sm shadow-lg">
            BỎ QUA ✕
          </div>

          <!-- Bottom image gradient -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

          <!-- Photo Pagination Dots -->
          <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            <span class="w-5 h-1.5 bg-white rounded-full shadow-sm"></span>
            <span class="w-1.5 h-1.5 bg-white/50 rounded-full shadow-sm"></span>
            <span class="w-1.5 h-1.5 bg-white/50 rounded-full shadow-sm"></span>
          </div>
        </div>

        <!-- Card Body Info -->
        <div class="p-4 flex flex-col justify-between h-[38%] bg-white">
          <div>
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="font-bold text-lg text-stone-900 leading-tight">${food.name}</h3>
                <p class="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <span class="font-medium text-stone-700">${food.restaurant}</span> • ${food.priceRange}
                </p>
              </div>
              <button onclick="window.app.showFoodDetail(${food.id})" class="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition">
                <i data-lucide="info" class="w-5 h-5"></i>
              </button>
            </div>

            <!-- Emotion Reason Box -->
            <div class="mt-2.5 bg-[#FFF8F2] border border-[#FFE8D6] rounded-xl p-2.5 flex items-start gap-2">
              <span class="text-lg leading-none">💡</span>
              <p class="text-xs text-[#8D4D24] leading-relaxed line-clamp-2">
                ${food.recommendReason}
              </p>
            </div>
          </div>

          <!-- Address snippet -->
          <div class="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
            <span class="truncate max-w-[200px]"><i data-lucide="navigation" class="w-3 h-3 inline mr-1 text-stone-400"></i>${food.address}</span>
            <span class="text-rose-500 font-semibold cursor-pointer hover:underline" onclick="window.app.openMapWithFood(${food.id})">Mở bản đồ 🗺️</span>
          </div>
        </div>
      `;

      if (isTop) {
        this.activeCard = cardEl;
        this.likeBadge = cardEl.querySelector('.stamp-like');
        this.nopeBadge = cardEl.querySelector('.stamp-nope');
        this.attachCardGestures(cardEl, food);
      }

      this.container.appendChild(cardEl);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  attachCardGestures(cardEl, food) {
    const handleStart = (clientX, clientY) => {
      this.isDragging = true;
      this.startX = clientX;
      this.startY = clientY;
      this.currentX = 0;
      this.currentY = 0;
      cardEl.style.transition = 'none';
    };

    const handleMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      this.currentX = clientX - this.startX;
      this.currentY = clientY - this.startY;

      const rotateDeg = (this.currentX * 0.08);
      cardEl.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotateDeg}deg)`;

      // Update stamp badge opacities
      const ratio = Math.min(Math.abs(this.currentX) / 100, 1);
      if (this.currentX > 0) {
        if (this.likeBadge) this.likeBadge.style.opacity = ratio;
        if (this.nopeBadge) this.nopeBadge.style.opacity = 0;
      } else {
        if (this.nopeBadge) this.nopeBadge.style.opacity = ratio;
        if (this.likeBadge) this.likeBadge.style.opacity = 0;
      }
    };

    const handleEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      cardEl.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease';

      const threshold = 90;
      if (this.currentX > threshold) {
        this.swipeRight(food);
      } else if (this.currentX < -threshold) {
        this.swipeLeft(food);
      } else {
        // Return to center
        cardEl.style.transform = 'translate(0px, 0px) rotate(0deg)';
        if (this.likeBadge) this.likeBadge.style.opacity = 0;
        if (this.nopeBadge) this.nopeBadge.style.opacity = 0;
      }
    };

    // Pointer events (handles both mouse and touch seamlessly)
    cardEl.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      handleStart(e.clientX, e.clientY);
      cardEl.setPointerCapture(e.pointerId);
    });

    cardEl.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      handleMove(e.clientX, e.clientY);
    });

    cardEl.addEventListener('pointerup', (e) => {
      handleEnd();
      try { cardEl.releasePointerCapture(e.pointerId); } catch(err){}
    });

    cardEl.addEventListener('pointercancel', (e) => {
      handleEnd();
    });
  }

  swipeRight(food) {
    if (!this.activeCard) return;
    window.soundFX && window.soundFX.playSwipeRight();

    this.activeCard.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
    this.activeCard.style.transform = 'translate(600px, 60px) rotate(35deg)';
    this.activeCard.style.opacity = '0';
    if (this.likeBadge) this.likeBadge.style.opacity = 1;

    setTimeout(() => {
      this.history.push({ action: 'like', food });
      window.app.addLikedFood(food);
      this.currentIndex++;
      this.render();

      // Trigger Match Celebration occasionally or on first like!
      if (food.id === 1 || this.history.filter(h => h.action === 'like').length === 1) {
        window.app.showMatchModal(food);
      }
    }, 300);
  }

  swipeLeft(food) {
    if (!this.activeCard) return;
    window.soundFX && window.soundFX.playSwipeLeft();

    this.activeCard.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
    this.activeCard.style.transform = 'translate(-600px, 60px) rotate(-35deg)';
    this.activeCard.style.opacity = '0';
    if (this.nopeBadge) this.nopeBadge.style.opacity = 1;

    setTimeout(() => {
      this.history.push({ action: 'skip', food });
      this.currentIndex++;
      this.render();
    }, 300);
  }

  superLike(food) {
    if (!this.activeCard) return;
    window.soundFX && window.soundFX.playMatch();

    this.activeCard.style.transition = 'transform 0.45s ease-out, opacity 0.45s ease-out';
    this.activeCard.style.transform = 'translate(0px, -650px) scale(1.05)';
    this.activeCard.style.opacity = '0';

    setTimeout(() => {
      this.history.push({ action: 'superlike', food });
      window.app.addLikedFood(food);
      this.currentIndex++;
      this.render();
      window.app.showMatchModal(food, true);
    }, 350);
  }

  undo() {
    if (this.currentIndex > 0) {
      window.soundFX && window.soundFX.playPop();
      this.currentIndex--;
      const last = this.history.pop();
      if (last && (last.action === 'like' || last.action === 'superlike')) {
        window.app.removeLikedFood(last.food.id);
      }
      this.render();
    }
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-white rounded-[28px] border border-[#F0E6DD] shadow-sm">
        <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
          🎉
        </div>
        <h4 class="font-bold text-stone-800 text-lg">Bạn đã khám phá hết món!</h4>
        <p class="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed">
          Đã duyệt toàn bộ món phù hợp với tâm trạng và thời tiết hiện tại. Hãy thử đổi tâm trạng hoặc xem danh sách đã thích nhé!
        </p>
        <div class="flex gap-2 mt-5">
          <button onclick="window.swipeManager.loadCards(APP_DATA.foods)" class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full font-semibold text-xs shadow-md shadow-rose-200 hover:opacity-95 transition">
            🔄 Quẹt lại từ đầu
          </button>
          <button onclick="window.app.switchTab('liked')" class="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-full font-semibold text-xs hover:bg-stone-200 transition">
            ❤️ Xem đã thích
          </button>
        </div>
      </div>
    `;
  }
}
