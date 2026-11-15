// Tinder-Style Swipe Engine (Thẻ Vuốt Cảm Xúc)

class TinderSwipeManager {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string'
      ? (document.getElementById(containerId.replace(/^#/, '')) || document.querySelector(containerId))
      : containerId;
    this.options = options;
    this.deck = [];
    this.history = [];
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.isAnimating = false;
    this.activeCard = null;
    this.likeBadge = null;
    this.nopeBadge = null;
  }

  loadCards(foods) {
    this.deck = [...foods];
    this.currentIndex = 0;
    this.isAnimating = false;
    this.isDragging = false;
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
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };

      const cardEl = document.createElement('div');
      cardEl.className = `tinder-card absolute inset-0 rounded-[28px] overflow-hidden shadow-2xl transition-transform duration-300 select-none bg-white border border-[#F0E6DD] ${status.isOpen ? '' : 'is-closed'}`;
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
          <img src="${food.image}" alt="${food.name}"
            data-name="${food.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="w-full h-full object-cover pointer-events-none ${status.isOpen ? '' : 'is-closed-img'}" />
          
          <!-- Top Floating Chip: Cách bạn 1.2km • Trời mưa 24°C -->
          <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none gap-2">
            <div class="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 shadow-sm flex items-center gap-1.5 border border-white/60 truncate">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500 shrink-0"></i>
              <span class="truncate">${food.distanceText || ('Cách bạn ' + (food.distance || '1.0') + 'km')} • ${food.weatherNote || 'Quy Nhơn 24°C 🌧️'}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="${status.isOpen ? 'bg-emerald-600/90 text-white' : 'bg-stone-900/90 text-stone-200 border border-stone-600'} backdrop-blur-md px-2 py-1 rounded-full text-[10.5px] font-bold shadow-sm flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-200' : 'bg-rose-500 animate-pulse'}"></span>
                ${status.statusText}
              </span>
              <div class="bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-white text-[11px] font-medium">
                ⭐ ${window.formatRating ? window.formatRating(food.rating) : food.rating}
              </div>
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
                <div class="flex items-center gap-1.5 mb-1">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${food.source === 'ShopeeFood' ? 'bg-orange-50 text-[#EE4D2D] border border-orange-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
                    ${food.source === 'ShopeeFood' ? (window.getShopeeIcon ? window.getShopeeIcon(12, 'shrink-0') : '🛍️') : '🛵'}
                    <span>${food.source || 'ShopeeFood'}</span>
                  </span>
                  <span class="text-[11px] text-stone-400 font-medium">${food.district || 'TP. Quy Nhơn'}</span>
                  <button onclick="event.stopPropagation(); window.app && window.app.openShopeeFoodDelivery(${food.id})" class="ml-auto bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer" title="Đặt giao tận nơi trên ShopeeFood">
                    ${window.getShopeeIcon ? window.getShopeeIcon(13, 'rounded-xs shrink-0') : ''}
                    <span>ShopeeFood</span>
                  </button>
                </div>
                <h3 class="font-bold text-lg text-stone-900 leading-tight">${food.name}</h3>
                <p class="text-xs text-stone-500 flex items-center gap-1 mt-0.5 flex-wrap">
                  <span class="font-medium text-stone-700">${food.restaurant}</span> • ${food.priceRange}
                  • <span class="${status.isOpen ? 'text-emerald-700 font-semibold' : 'text-stone-500'}">🕒 ${food.openTime} <span class="${status.isOpen ? 'text-stone-400 font-normal' : 'text-rose-500 font-bold'}">(${status.detailText})</span></span>
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
                ${food.recommendReason || 'Món ngon đặc sản Quy Nhơn cực chuẩn vị, rất thích hợp thưởng thức hôm nay ✨'}
              </p>
            </div>
          </div>

          <!-- Address snippet & Quick Action -->
          <div class="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
            <span class="truncate max-w-[130px]"><i data-lucide="navigation" class="w-3 h-3 inline mr-1 text-stone-400"></i>${food.address}</span>
            <div class="flex items-center gap-2">
              <span class="text-orange-600 hover:text-orange-700 font-extrabold cursor-pointer hover:underline flex items-center gap-0.5" onclick="event.stopPropagation(); window.app && window.app.openShopeeFoodDelivery(${food.id})">
                <span>🛵 Đặt món</span>
              </span>
              <span class="text-rose-500 hover:text-rose-600 font-semibold cursor-pointer hover:underline flex items-center gap-1" onclick="event.stopPropagation(); window.app && window.app.openMapWithFood(${food.id})">
                <svg class="w-3 h-3 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                  <line x1="9" y1="3" x2="9" y2="18"></line>
                  <line x1="15" y1="6" x2="15" y2="21"></line>
                </svg>
                <span>Bản đồ</span>
              </span>
            </div>
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
    let activePointerId = null;

    const onPointerMove = (e) => {
      if (!this.isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;
      this.currentX = e.clientX - this.startX;
      this.currentY = e.clientY - this.startY;

      const rotateDeg = (this.currentX * 0.07);
      cardEl.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotateDeg}deg)`;

      // Update stamp badge opacities
      const ratio = Math.min(Math.abs(this.currentX) / 85, 1);
      if (this.currentX > 0) {
        if (this.likeBadge) this.likeBadge.style.opacity = ratio;
        if (this.nopeBadge) this.nopeBadge.style.opacity = 0;
      } else {
        if (this.nopeBadge) this.nopeBadge.style.opacity = ratio;
        if (this.likeBadge) this.likeBadge.style.opacity = 0;
      }
    };

    const onPointerUp = (e) => {
      if (!this.isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;
      this.isDragging = false;
      activePointerId = null;

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      const threshold = 85;
      if (this.currentX > threshold) {
        this.swipeRight(food);
      } else if (this.currentX < -threshold) {
        this.swipeLeft(food);
      } else {
        // Return to center smoothly
        cardEl.style.transition = 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.28s ease';
        cardEl.style.transform = 'translate(0px, 0px) rotate(0deg)';
        if (this.likeBadge) this.likeBadge.style.opacity = 0;
        if (this.nopeBadge) this.nopeBadge.style.opacity = 0;
      }
    };

    cardEl.addEventListener('pointerdown', (e) => {
      if (this.isAnimating) return;
      if (e.target.closest('button') || e.target.closest('a')) return;

      this.isDragging = true;
      activePointerId = e.pointerId;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.currentX = 0;
      this.currentY = 0;
      cardEl.style.transition = 'none';

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });
  }

  swipeRight(food) {
    if (this.isAnimating || !this.activeCard) return;
    this.isAnimating = true;
    window.soundFX && window.soundFX.playSwipeRight();

    const targetFood = food || (this.deck && this.deck[this.currentIndex]);
    this.activeCard.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    this.activeCard.style.transform = 'translate(600px, 60px) rotate(35deg)';
    this.activeCard.style.opacity = '0';
    if (this.likeBadge) this.likeBadge.style.opacity = 1;

    setTimeout(() => {
      if (targetFood) {
        this.history.push({ action: 'like', food: targetFood });
        window.app.addLikedFood(targetFood);
      }
      this.currentIndex++;
      this.isAnimating = false;
      this.render();
    }, 280);
  }

  swipeLeft(food) {
    if (this.isAnimating || !this.activeCard) return;
    this.isAnimating = true;
    window.soundFX && window.soundFX.playSwipeLeft();

    const targetFood = food || (this.deck && this.deck[this.currentIndex]);
    this.activeCard.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    this.activeCard.style.transform = 'translate(-600px, 60px) rotate(-35deg)';
    this.activeCard.style.opacity = '0';
    if (this.nopeBadge) this.nopeBadge.style.opacity = 1;

    setTimeout(() => {
      if (targetFood) {
        this.history.push({ action: 'skip', food: targetFood });
      }
      this.currentIndex++;
      this.isAnimating = false;
      this.render();
    }, 280);
  }

  superLike(food) {
    if (this.isAnimating || !this.activeCard) return;
    this.isAnimating = true;
    window.soundFX && window.soundFX.playMatch();

    const targetFood = food || (this.deck && this.deck[this.currentIndex]);
    this.activeCard.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
    this.activeCard.style.transform = 'translate(0px, -650px) scale(1.05)';
    this.activeCard.style.opacity = '0';

    setTimeout(() => {
      if (targetFood) {
        this.history.push({ action: 'superlike', food: targetFood });
        window.app.addLikedFood(targetFood);
      }
      this.currentIndex++;
      this.isAnimating = false;
      this.render();
      if (targetFood) {
        window.app.showMatchModal(targetFood, true);
      }
    }, 320);
  }

  undo() {
    if (this.isAnimating) return;
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

  orderCurrentFoodDelivery() {
    const currentFood = this.deck[this.currentIndex];
    if (currentFood && window.app) {
      window.app.openShopeeFoodDelivery(currentFood.id);
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

if (typeof window !== 'undefined') {
  window.TinderSwipeManager = TinderSwipeManager;
  const initSwipe = () => {
    if (!window.swipeManager) {
      window.swipeManager = new TinderSwipeManager('swipe-deck-container');
    }
    const foods = (window.APP_DATA && window.APP_DATA.foods && window.APP_DATA.foods.length > 0)
      ? window.APP_DATA.foods
      : (typeof APP_DATA !== 'undefined' && APP_DATA.foods ? APP_DATA.foods : []);
    if (foods.length > 0 && window.swipeManager && (!window.swipeManager.deck || window.swipeManager.deck.length === 0)) {
      window.swipeManager.loadCards(foods);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwipe);
  } else {
    initSwipe();
  }
}
