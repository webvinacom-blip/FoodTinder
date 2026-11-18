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
    const list = Array.isArray(foods) ? foods : [];
    // Nếu quán đã đóng cửa thì không hiện ở thẻ quẹt nữa
    const openFoods = list.filter(food => {
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true };
      return Boolean(status && status.isOpen);
    });
    this.deck = openFoods;
    this.currentIndex = 0;
    this.isAnimating = false;
    this.isDragging = false;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    // Bỏ qua các quán đã đóng cửa nếu còn tồn tại trong deck
    while (this.currentIndex < this.deck.length) {
      const currentFood = this.deck[this.currentIndex];
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(currentFood.openTime) : { isOpen: true };
      if (status && status.isOpen) break;
      this.currentIndex++;
    }

    if (this.currentIndex >= this.deck.length) {
      this.renderEmptyState();
      return;
    }

    // Render up to 3 cards in the stack (chỉ các quán đang mở cửa)
    const visibleCards = [];
    let lookAheadIdx = this.currentIndex;
    while (lookAheadIdx < this.deck.length && visibleCards.length < 3) {
      const food = this.deck[lookAheadIdx];
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true };
      if (status && status.isOpen) {
        visibleCards.push(food);
      }
      lookAheadIdx++;
    }

    if (visibleCards.length === 0) {
      this.renderEmptyState();
      return;
    }

    visibleCards.reverse().forEach((food, reverseIdx) => {
      const actualIdx = visibleCards.length - 1 - reverseIdx;
      const isTop = actualIdx === 0;
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
      const hasShopee = window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : Boolean(food.deliveryUrl && food.deliveryUrl.includes('shopeefood.vn/'));
      const willReturnCount = (window.app && typeof window.app.getWillReturnCount === 'function')
        ? window.app.getWillReturnCount(food.id)
        : (food.reviewCount ? Math.floor(food.reviewCount * 1.5) : 38);
      const willReturnFriends = (window.app && typeof window.app.getFriendsWhoWillReturn === 'function')
        ? window.app.getFriendsWhoWillReturn(food.id)
        : [];
      const displayReturnFriends = willReturnFriends.slice(0, 5);
      const moreReturnFriendsCount = willReturnFriends.length - 5;
      const isWillReturn = (window.app && typeof window.app.isFoodWillReturn === 'function')
        ? window.app.isFoodWillReturn(food.id)
        : (window.app && typeof window.app.isWillReturn === 'function' ? window.app.isWillReturn(food.id) : false);

      // Thông tin giao hàng & mã giảm giá ShopeeFood
      const promoCode = food.deliveryPromoCode || 'SHOPEE25K';
      const rawPromo = food.deliveryPromo || `Mã ${promoCode} giảm 25.000đ`;
      const promoCleanDesc = rawPromo.replace(/^Mã\s+[A-Z0-9]+\s*/i, '');
      const promoDiscountText = promoCleanDesc ? (promoCleanDesc.charAt(0).toUpperCase() + promoCleanDesc.slice(1)) : 'Giảm 25.000đ';

      // Địa chỉ đầy đủ chuẩn xác (gồm số nhà/đường, thành phố, tỉnh thành)
      let fullAddress = (food.address || '').trim().replace(/^0+([1-9])/, '$1');
      const rawCity = food.cityName || (food.cityId === 'quynhon' ? 'Quy Nhơn' : (window.APP_DATA?.currentCity?.name || 'Quy Nhơn'));
      const cleanCity = rawCity.split('(')[0].replace(/cũ/gi, '').trim();
      let cleanProvince = '';
      const lowerCity = cleanCity.toLowerCase();
      if (lowerCity.includes('quy nhơn') || food.cityId === 'quynhon') cleanProvince = 'Bình Định';
      else if (lowerCity.includes('hà nội') || food.cityId === 'hanoi') cleanProvince = 'Hà Nội';
      else if (lowerCity.includes('đà nẵng') || food.cityId === 'danang') cleanProvince = 'Đà Nẵng';
      else if (lowerCity.includes('hồ chí minh') || lowerCity.includes('sài gòn') || food.cityId === 'saigon') cleanProvince = 'TP. Hồ Chí Minh';
      else if (lowerCity.includes('nha trang') || food.cityId === 'nhatrang') cleanProvince = 'Khánh Hòa';
      else if (lowerCity.includes('đà lạt') || food.cityId === 'dalat') cleanProvince = 'Lâm Đồng';
      else if (lowerCity.includes('huế') || food.cityId === 'hue') cleanProvince = 'Thừa Thiên Huế';
      else cleanProvince = cleanCity;

      if (fullAddress && cleanCity && !fullAddress.toLowerCase().includes(cleanCity.toLowerCase())) {
        fullAddress += `, ${cleanCity}`;
      }
      if (cleanProvince && fullAddress && !fullAddress.toLowerCase().includes(cleanProvince.toLowerCase()) && cleanProvince.toLowerCase() !== cleanCity.toLowerCase()) {
        fullAddress += `, ${cleanProvince}`;
      }
      if (!fullAddress) fullAddress = food.district || 'TP. Quy Nhơn, Bình Định';

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
        <div class="relative w-full h-[54%] overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}"
            data-name="${food.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="w-full h-full object-cover pointer-events-none ${status.isOpen ? '' : 'is-closed-img'}" />
          
          <!-- Top Floating Chip: Cách bạn 1.2km (chỉ hiển thị khoảng cách) -->
          <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none gap-2">
            <div class="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 shadow-sm flex items-center gap-1.5 border border-white/60 truncate">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500 shrink-0"></i>
              <span class="truncate">${food.distanceText || ('Cách bạn ' + (food.distance || '1.0') + 'km')}</span>
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
        <div class="p-3.5 flex flex-col justify-between h-[46%] bg-white">
          <div class="space-y-1.5">
            <!-- Hàng 1: Tiêu đề quán & Nút Foody Review -->
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-extrabold text-base text-stone-900 leading-tight truncate flex-1" title="${food.restaurant}">${food.restaurant}</h3>
              <button onclick="event.stopPropagation(); window.app && window.app.openFoodyReview(${food.id})" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-[#d32323] border border-rose-200 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Xem review quán ăn trên Foody">
                <span class="w-4 h-4 rounded-full bg-[#d32323] text-white text-[10px] font-black flex items-center justify-center leading-none shadow-xs">f</span>
                <span>Foody Review</span>
              </button>
            </div>

            <!-- Hàng 2 (Dòng riêng): Địa chỉ quán đầy đủ có icon Map phía trước -->
            <div class="flex items-center gap-2 text-xs text-stone-600 truncate">
              <div class="w-5 flex items-center justify-center shrink-0">
                <button onclick="event.stopPropagation(); window.app && window.app.openMapWithFood(${food.id})" class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-700 transition active:scale-95 cursor-pointer shadow-2xs" title="Xem vị trí & chỉ đường trên bản đồ">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                    <line x1="9" y1="3" x2="9" y2="18"></line>
                    <line x1="15" y1="6" x2="15" y2="21"></line>
                  </svg>
                </button>
              </div>
              <span class="font-medium text-stone-700 truncate cursor-pointer hover:text-amber-800 flex-1 min-w-0" onclick="event.stopPropagation(); window.app && window.app.openMapWithFood(${food.id})" title="${fullAddress}">${fullAddress}</span>
            </div>

            <!-- Hàng 3 (Dòng riêng - Giờ mở cửa đưa lên trước số tiền như Chuẩn Gu): Thời gian mở cửa -->
            <div class="flex items-center gap-2 text-xs ${status.isOpen ? 'text-emerald-700 font-semibold' : 'text-stone-500'}">
              <div class="w-5 flex items-center justify-center shrink-0 text-sm leading-none">
                🕒
              </div>
              <div class="truncate flex-1 min-w-0">
                <span>${food.openTime}</span>
                <span class="${status.isOpen ? 'text-stone-400 font-normal' : 'text-rose-500 font-bold'}">(${status.detailText})</span>
              </div>
            </div>

            <!-- Hàng 4 (Dòng riêng - Số tiền như Chuẩn Gu): Giá món ăn -->
            <div class="flex items-center gap-2 text-xs font-bold text-rose-600">
              <div class="w-5 flex items-center justify-center shrink-0 text-sm leading-none">
                🏷️
              </div>
              <div class="truncate flex-1 min-w-0">
                ${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}
              </div>
            </div>

            <!-- Hàng 5: [😋 65 người sẽ quay lại] và [Avatar bạn bè] [+X more] LUÔN NẰM KỀ SÁT NHAU TRÊN CÙNG 1 HÀNG DUY NHẤT (KHÔNG CÓ ICON ONLINE) -->
            <div class="flex items-center gap-2 pt-0.5 flex-nowrap overflow-hidden">
              <button onclick="event.stopPropagation(); window.app && window.app.toggleWillReturn(${food.id})" 
                data-will-return-btn="${food.id}"
                class="inline-flex items-center gap-1 text-xs font-bold ${isWillReturn ? 'bg-amber-500 text-white shadow-xs' : 'bg-gradient-to-r from-amber-50 to-orange-50/90 hover:bg-amber-100 text-amber-950 border border-amber-200'} px-2.5 py-1 rounded-full transition active:scale-95 cursor-pointer shadow-2xs shrink-0"
                title="Đánh dấu bạn sẽ là khách quen quay lại quán này">
                <span class="text-sm leading-none">😋</span>
                <span class="whitespace-nowrap"><span data-will-return-count="${food.id}">${willReturnCount}</span> người sẽ quay lại</span>
              </button>

              ${displayReturnFriends.length > 0 ? `
                <div class="flex items-center shrink-0">
                  <div class="flex items-center">
                    ${displayReturnFriends.map(f => `
                      <div onclick="event.stopPropagation(); window.app && window.app.openChatWithFriend(${f.id})" 
                        class="relative cursor-pointer transition hover:scale-110 hover:z-20 active:scale-95 shrink-0 -ml-2 first:ml-0 rounded-full"
                        style="width:24px; height:24px;"
                        title="${f.name} đã chọn sẽ quay lại • Bấm để nhắn tin">
                        <img src="${f.avatar}" alt="${f.name}" class="rounded-full object-cover border-2 border-white shadow-xs shrink-0" style="width:24px; height:24px; min-width:24px; min-height:24px;" />
                      </div>
                    `).join('')}
                  </div>
                  ${moreReturnFriendsCount > 0 ? `
                    <button onclick="event.stopPropagation(); window.app && window.app.openWillReturnFriendsModal(${food.id})" 
                      class="px-1.5 rounded-full bg-amber-100 hover:bg-amber-200 border-2 border-white text-amber-900 text-[10px] font-extrabold flex items-center justify-center -ml-2 shadow-xs cursor-pointer active:scale-95 transition z-10 shrink-0" 
                      style="height:24px;"
                      title="Xem tất cả bạn bè sẽ quay lại quán">
                      +${moreReturnFriendsCount} more
                    </button>
                  ` : ''}
                </div>
              ` : ''}
            </div>

            <!-- Hàng 6: Mã giảm giá ShopeeFood (Đặt tại vùng trống giữa số người quay lại và button Rủ đi ăn) -->
            ${hasShopee ? `
              <div class="pt-0.5">
                <div class="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-50/95 via-amber-50/70 to-rose-50/80 border border-orange-200/90 flex items-center justify-between gap-2 shadow-2xs hover:border-orange-300 transition">
                  <div class="flex items-center gap-2 min-w-0 flex-1 cursor-pointer" 
                    onclick="event.stopPropagation(); window.app && window.app.openShopeeFoodDelivery(${food.id})" 
                    title="Bấm để xem và đặt món giao qua ShopeeFood">
                    <div class="w-6 h-6 rounded-lg bg-white border border-orange-200 flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
                      ${window.getShopeeIcon ? window.getShopeeIcon(18, 'shrink-0') : '🛍️'}
                    </div>
                    <div class="min-w-0 flex-1 leading-tight">
                      <div class="flex items-center gap-1.5 flex-nowrap overflow-hidden">
                        <span class="text-[9.5px] font-black text-white bg-[#EE4D2D] px-1.5 py-0.2 rounded font-mono tracking-wider shrink-0 uppercase shadow-2xs">${promoCode}</span>
                        <span class="text-[11px] font-extrabold text-stone-800 truncate">${promoDiscountText}</span>
                      </div>
                      <p class="text-[9px] text-stone-400 truncate mt-0.5">Voucher ShopeeFood • Chạm để đặt món</p>
                    </div>
                  </div>

                  <button onclick="event.stopPropagation(); window.app && window.app.copyVoucher('${promoCode}')"
                    class="px-2 py-1 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 active:scale-95 text-white text-[10px] font-black rounded-lg shrink-0 shadow-xs transition cursor-pointer flex items-center gap-1 select-none"
                    title="Sao chép mã giảm giá: ${promoCode}">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Lấy mã</span>
                  </button>
                </div>
              </div>
            ` : `
              <div class="pt-0.5">
                <div class="px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-2 shadow-2xs">
                  <div class="flex items-center gap-2 min-w-0 flex-1">
                    <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 text-xs shadow-2xs">
                      🍽️
                    </div>
                    <div class="min-w-0 flex-1 leading-tight">
                      <span class="text-[11px] font-bold text-stone-700 truncate block">Thưởng thức tại quán</span>
                      <p class="text-[9px] text-stone-400 truncate mt-0.5">Quán bản địa không phục vụ giao qua ShopeeFood</p>
                    </div>
                  </div>
                  <button onclick="event.stopPropagation(); window.app && window.app.openMapWithFood(${food.id})"
                    class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold rounded-lg shrink-0 transition active:scale-95 cursor-pointer flex items-center gap-1">
                    <span>Chỉ đường</span>
                  </button>
                </div>
              </div>
            `}
          </div>

          <!-- Bottom Row: Button Rủ đi ăn (sát lại gần hơn với hàng số người quay lại cho cân đối) -->
          <div class="pt-2 flex items-center justify-center">
            <button onclick="event.stopPropagation(); window.app && window.app.openInviteFriendsModal(${food.id})" 
              class="w-full py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm rounded-full shadow-md shadow-rose-200/50 flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer" 
              title="Rủ bạn bè đi ăn quán này">
              <span>Rủ đi ăn</span>
              <span>🍲</span>
            </button>
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
        if (window.app) {
          window.app.addLikedFood(targetFood);
          if (typeof window.app.recordSwipeLike === 'function') {
            window.app.recordSwipeLike(targetFood);
          }
        }
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
        // 3. Học từ lịch sử Swipe (Session-based Learning)
        if (window.app && typeof window.app.recordSwipeSkip === 'function') {
          window.app.recordSwipeSkip(targetFood);
        }
      }
      this.currentIndex++;
      this.isAnimating = false;
      
      // Nếu số thẻ còn lại dưới 3, tự động nạp thêm thẻ đã điều chỉnh trọng số vị giác (chỉ nạp quán đang mở)
      if (this.deck && (this.deck.length - this.currentIndex) < 3 && window.app) {
        const freshDeck = window.app.getFoodsForCurrentMood();
        if (freshDeck && freshDeck.length > 0) {
          const remaining = this.deck.slice(this.currentIndex);
          const remainingIds = new Set(remaining.map(f => f.id));
          const newAdditions = freshDeck
            .filter(f => !remainingIds.has(f.id))
            .filter(f => {
              const status = window.getRestaurantStatus ? window.getRestaurantStatus(f.openTime) : { isOpen: true };
              return Boolean(status && status.isOpen);
            });
          if (newAdditions.length > 0) {
            this.deck = remaining.concat(newAdditions);
            this.currentIndex = 0;
          }
        }
      }

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
        if (window.app) {
          window.app.addLikedFood(targetFood);
          if (typeof window.app.recordSwipeLike === 'function') {
            window.app.recordSwipeLike(targetFood);
          }
        }
      }
      this.currentIndex++;
      this.isAnimating = false;

      // Nếu số thẻ còn lại dưới 3, tự động nạp thêm thẻ đang mở cửa
      if (this.deck && (this.deck.length - this.currentIndex) < 3 && window.app) {
        const freshDeck = window.app.getFoodsForCurrentMood();
        if (freshDeck && freshDeck.length > 0) {
          const remaining = this.deck.slice(this.currentIndex);
          const remainingIds = new Set(remaining.map(f => f.id));
          const newAdditions = freshDeck
            .filter(f => !remainingIds.has(f.id))
            .filter(f => {
              const status = window.getRestaurantStatus ? window.getRestaurantStatus(f.openTime) : { isOpen: true };
              return Boolean(status && status.isOpen);
            });
          if (newAdditions.length > 0) {
            this.deck = remaining.concat(newAdditions);
            this.currentIndex = 0;
          }
        }
      }

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
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast('↩️ Đã quay lại món trước đó');
      }
    } else {
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast('Bạn đang ở món đầu tiên!');
      }
    }
  }

  reloadDeck() {
    if (this.isAnimating) return;
    const foods = (window.app && typeof window.app.getFoodsForCurrentMood === 'function')
      ? window.app.getFoodsForCurrentMood()
      : ((window.APP_DATA && window.APP_DATA.foods && window.APP_DATA.foods.length > 0)
          ? window.APP_DATA.foods
          : (typeof APP_DATA !== 'undefined' && APP_DATA.foods ? APP_DATA.foods : this.deck));
    this.history = [];
    this.currentIndex = 0;
    this.loadCards(foods);
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast('🔄 Đã tải lại danh sách món đang mở cửa!');
    }
  }

  refreshDeck() {
    this.reloadDeck();
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
        <h4 class="font-bold text-stone-800 text-lg">Bạn đã khám phá hết quán đang mở!</h4>
        <p class="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed">
          Đã duyệt toàn bộ quán đang mở cửa phù hợp với bạn. Hãy thử đổi tâm trạng hoặc ghé lại vào khung giờ khác nhé!
        </p>
        <div class="flex gap-2 mt-5">
          <button onclick="window.swipeManager.reloadDeck()" class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full font-semibold text-xs shadow-md shadow-rose-200 hover:opacity-95 transition cursor-pointer">
            🔄 Quẹt lại từ đầu
          </button>
          <button onclick="window.app.switchTab('liked')" class="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-full font-semibold text-xs hover:bg-stone-200 transition cursor-pointer">
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
    const foods = (window.app && typeof window.app.getFoodsForCurrentMood === 'function')
      ? window.app.getFoodsForCurrentMood()
      : ((window.APP_DATA && window.APP_DATA.foods && window.APP_DATA.foods.length > 0)
          ? window.APP_DATA.foods
          : (typeof APP_DATA !== 'undefined' && APP_DATA.foods ? APP_DATA.foods : []));
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
