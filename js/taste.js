// ═══════════════════════════════════════════════════════════════════
// TASTE ENGINE & PERSONALIZED LOCATION RECOMMENDATION MANAGER
// Thuật toán gợi ý quán ăn theo tỉnh/thành phố dựa trên gu cá nhân
// ═══════════════════════════════════════════════════════════════════

class TasteManager {
  constructor() {
    this.storageKey = 'foodtinder_user_taste_v1';
    this.profile = this.loadProfile();
  }

  loadProfile() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Starter profile with balanced initial foodie tastes
    return {
      likedCategories: { "hotpot": 4, "bbq": 3, "noodles": 2, "streetfood": 2, "seafood": 1 },
      likedTags: { "#Xả_stress": 3, "#Đậm_đà": 3, "#Cay_nồng": 3, "#Ấm_áp": 2, "#Xì_xèo": 2 },
      customPreferences: ["Cay nồng", "Lẩu & Nướng", "Đậm đà"],
      totalInteractions: 8
    };
  }

  saveProfile() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    } catch (e) {}
  }

  // Sync profile from whatever liked foods exist in localStorage
  syncFromLikedFoods(likedFoods = []) {
    if (!Array.isArray(likedFoods) || likedFoods.length === 0) return;

    likedFoods.forEach(food => {
      if (!food) return;
      const cat = food.category || 'streetfood';
      this.profile.likedCategories[cat] = (this.profile.likedCategories[cat] || 0) + 1;
      if (Array.isArray(food.tags)) {
        food.tags.forEach(t => {
          this.profile.likedTags[t] = (this.profile.likedTags[t] || 0) + 1;
        });
      }
    });
    this.profile.totalInteractions = (this.profile.totalInteractions || 0) + likedFoods.length;
    this.saveProfile();
  }

  // Record a new like action
  recordLike(food) {
    if (!food) return;
    this.profile.totalInteractions = (this.profile.totalInteractions || 0) + 1;

    const cat = food.category || 'streetfood';
    this.profile.likedCategories[cat] = (this.profile.likedCategories[cat] || 0) + 1;

    if (Array.isArray(food.tags)) {
      food.tags.forEach(t => {
        this.profile.likedTags[t] = (this.profile.likedTags[t] || 0) + 1;
      });
    }

    this.saveProfile();
  }

  // Calculate Match Percentage (65% to 99%)
  calculateMatchScore(food, currentMoodId = '') {
    if (!food) return 70;
    let score = 65;

    // 1. Category match
    const cat = food.category;
    const catWeight = this.profile.likedCategories[cat] || 0;
    if (catWeight > 0) {
      score += Math.min(18, catWeight * 5);
    }

    // 2. Tags match
    if (Array.isArray(food.tags)) {
      let tagPoints = 0;
      food.tags.forEach(t => {
        if (this.profile.likedTags[t]) {
          tagPoints += Math.min(6, this.profile.likedTags[t] * 2);
        }
      });
      score += Math.min(15, tagPoints);
    }

    // 3. Custom preference match
    if (Array.isArray(this.profile.customPreferences)) {
      this.profile.customPreferences.forEach(pref => {
        if (pref.includes("Cay") && (food.tags?.some(t => t.toLowerCase().includes("cay")) || food.name.toLowerCase().includes("cay"))) score += 4;
        if (pref.includes("Lẩu") && (food.category === 'hotpot' || food.name.toLowerCase().includes("lẩu"))) score += 4;
        if (pref.includes("Nướng") && (food.category === 'bbq' || food.tags?.some(t => t.includes("Xì_xèo") || t.includes("nướng")))) score += 4;
        if (pref.includes("Healthy") && (food.category === 'healthy' || food.tags?.some(t => t.toLowerCase().includes("clean")))) score += 5;
        if (pref.includes("Sợi") && (food.category === 'noodles' || food.name.toLowerCase().includes("phở") || food.name.toLowerCase().includes("bún"))) score += 4;
        if (pref.includes("Đậm đà") && food.tags?.some(t => t.includes("Đậm"))) score += 3;
        if (pref.includes("Hải sản") && (food.category === 'seafood' || food.tags?.some(t => t.includes("sản") || t.includes("sứa") || t.includes("cua")))) score += 4;
      });
    }

    // 4. Current mood match bonus
    if (currentMoodId && Array.isArray(food.moodIds) && food.moodIds.includes(currentMoodId)) {
      score += 5;
    }

    // 5. Rating boost
    if (food.rating >= 4.8) score += 3;

    return Math.min(99, Math.max(68, Math.round(score)));
  }

  // Generate customized reason for why this food was recommended
  generateMatchReason(food) {
    if (!food) return "Gợi ý được yêu thích nhất";

    const matchedTags = (food.tags || []).filter(t => (this.profile.likedTags[t] || 0) > 0);
    if (matchedTags.length >= 2) {
      return `Hợp gu vì bạn thường chọn ${matchedTags.slice(0, 2).join(' & ')}`;
    }
    if (matchedTags.length === 1) {
      return `Phù hợp với sở thích ${matchedTags[0]} của bạn`;
    }

    const catMap = {
      hotpot: "Rất hợp vì bạn là tín đồ mê các món lẩu nóng hổi",
      bbq: "Khuyên dùng vì bạn cực kỳ thích đồ nướng xì xèo",
      noodles: "Chuẩn gu với sở thích các món nước & sợi đậm đà",
      streetfood: "Gợi ý chuẩn gu ăn vặt đường phố bạn yêu thích",
      seafood: "Hợp khẩu vị hải sản tươi sống trứ danh",
      healthy: "Lựa chọn hoàn hảo cho lối sống Eat Clean & Healthy",
      cafe: "Thích hợp cho gu thư giãn & không gian chill"
    };

    return catMap[food.category] || "Được AI chấm điểm cao nhất theo khẩu vị của bạn";
  }

  // Get percentage breakdown for UI modal
  getTasteBreakdown() {
    const cats = this.profile.likedCategories || {};
    const total = Object.values(cats).reduce((sum, v) => sum + v, 0) || 1;

    const list = [
      { id: "hotpot", label: "Lẩu & Nóng hổi", emoji: "🍲", count: cats.hotpot || 0 },
      { id: "bbq", label: "Nướng & Xì xèo", emoji: "🥩", count: cats.bbq || 0 },
      { id: "noodles", label: "Bún phở & Món sợi", emoji: "🍜", count: cats.noodles || 0 },
      { id: "streetfood", label: "Ăn vặt đường phố", emoji: "🍢", count: cats.streetfood || 0 },
      { id: "seafood", label: "Hải sản tươi sống", emoji: "🦀", count: cats.seafood || 0 },
      { id: "healthy", label: "Eat Clean & Salad", emoji: "🥗", count: cats.healthy || 0 },
      { id: "cafe", label: "Cà phê & Đồ ngọt", emoji: "☕", count: cats.cafe || 0 }
    ];

    return list.map(item => ({
      ...item,
      percentage: Math.max(8, Math.round((item.count / total) * 100))
    })).sort((a, b) => b.percentage - a.percentage);
  }

  // Toggle custom preference
  togglePreference(pref) {
    if (!this.profile.customPreferences) {
      this.profile.customPreferences = [];
    }
    const idx = this.profile.customPreferences.indexOf(pref);
    if (idx >= 0) {
      this.profile.customPreferences.splice(idx, 1);
    } else {
      this.profile.customPreferences.push(pref);
    }
    this.saveProfile();
  }

  // ══════════════════════════════════════════════════════
  // RENDER RECOMMENDATION SECTION IN HOME TAB
  // ══════════════════════════════════════════════════════
  renderLocationRecommendations() {
    const container = document.getElementById('location-taste-recommendations');
    const titleCityEl = document.getElementById('taste-city-name');
    const summaryTextEl = document.getElementById('taste-summary-text');
    const pillsContainer = document.getElementById('quick-city-pills');
    if (!container) return;

    const currentCity = APP_DATA.currentCity;
    const currentMoodId = APP_DATA.currentMoodId;

    if (titleCityEl) {
      titleCityEl.textContent = currentCity.name;
    }

    // Render Quick City Pills
    if (pillsContainer) {
      const topCities = [
        { id: "daklak_buonho", name: "TX. Buôn Hồ (Đắk Lắk)", icon: "☕" },
        { id: "quynhon", name: "Bình Định (Nghĩa Bình cũ)", icon: "🌊" },
        { id: "gialai", name: "Gia Lai (Bình Định cũ)", icon: "🌲" },
        { id: "hanoi", name: "Hà Nội (Hà Tây cũ)", icon: "🏛️" },
        { id: "hcm", name: "TP. Hồ Chí Minh (Sài Gòn cũ)", icon: "🏙️" },
        { id: "danang", name: "Đà Nẵng (Quảng Nam - ĐN)", icon: "🌉" },
        { id: "dalat", name: "Đà Lạt (Lâm Đồng)", icon: "🌲" },
        { id: "nhatrang", name: "Khánh Hòa (Nha Trang)", icon: "🏖️" },
        { id: "hue", name: "Huế (Bình Trị Thiên cũ)", icon: "🏰" },
        { id: "cantho", name: "Cần Thơ (Hậu Giang cũ)", icon: "🌾" },
        { id: "haiphong", name: "Hải Phòng (Kiến An cũ)", icon: "🦀" },
        { id: "vungtau", name: "Vũng Tàu", icon: "🌊" },
        { id: "sapa", name: "Sa Pa (Lào Cai)", icon: "🏔️" },
        { id: "phuquoc", name: "Phú Quốc (Kiên Giang)", icon: "🏝️" },
        { id: "camau", name: "Cà Mau (Minh Hải cũ)", icon: "🦀" }
      ];

      pillsContainer.innerHTML = topCities.map(c => {
        const isActive = (currentCity.cityId === c.id) || (currentCity.name && currentCity.name.includes(c.id));
        return `
          <button onclick="window.tasteManager.quickSwitchCity('${c.id}')"
            class="px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              isActive
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm scale-105'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }">
            <span>${c.icon}</span>
            <span>${c.name}</span>
          </button>
        `;
      }).join('') + `
        <button onclick="window.app.openCityModal()" 
          class="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all shrink-0 border border-rose-200 flex items-center gap-1 shadow-2xs">
          <span>+ Tất cả Tỉnh/Huyện ▾</span>
        </button>
      `;
    }

    // Filter foods belonging to this city or district
    let cityFoods = APP_DATA.foods.filter(f => {
      if (currentCity.cityId && f.cityId) {
        return f.cityId === currentCity.cityId;
      }
      return (f.cityName && currentCity.name && (f.cityName.includes(currentCity.name) || currentCity.name.includes(f.cityName))) ||
             (f.address && currentCity.name && f.address.includes(currentCity.name));
    });

    // If city has no pre-listed foods in APP_DATA.foods, dynamically build from district or province signature specialties!
    if (cityFoods.length === 0) {
      const districtOpt = (APP_DATA.districtOptions || []).find(d => 
        d.cityId === currentCity.cityId || 
        d.city === currentCity.name || 
        (d.shortName && currentCity.name && currentCity.name.includes(d.shortName))
      );
      const cityOpt = districtOpt || APP_DATA.weatherOptions.find(w => 
        w.cityId === currentCity.cityId || 
        w.city === currentCity.name ||
        (w.shortName && currentCity.name && currentCity.name.includes(w.shortName))
      );
      if (cityOpt && Array.isArray(cityOpt.specialties) && cityOpt.specialties.length > 0) {
        cityFoods = cityOpt.specialties.map((spec, sIdx) => {
          const foodItem = {
            id: 6000 + Math.abs(Math.round(cityOpt.lat * 100)) + sIdx,
            cityId: cityOpt.cityId,
            cityName: cityOpt.city,
            name: spec.name,
            restaurant: spec.rest || `Đặc Sản ${cityOpt.shortName || cityOpt.city}`,
            address: cityOpt.address,
            distance: 0.6 + sIdx * 0.3,
            distanceText: `Cách bạn ${(600 + sIdx * 300)}m`,
            weatherNote: `${cityOpt.condition} ${cityOpt.temp}`,
            priceRange: spec.price || "45.000đ - 85.000đ",
            rating: Number(window.formatRating ? window.formatRating(4.8 + (sIdx % 2) * 0.1) : (4.8 + (sIdx % 2) * 0.1).toFixed(1)),
            reviewCount: 1520 + sIdx * 340,
            lat: cityOpt.lat + (sIdx * 0.003),
            lng: cityOpt.lng + (sIdx * 0.003),
            category: spec.cat || "streetfood",
            moodIds: ["comfort", "chill", "craving", "energetic", "sad"],
            tags: spec.tags || ["#Đặc_sản", "#Nóng_hổi", "#Đậm_đà"],
            sideRibbon: ["#đặc_sản_địa_phương", "#chuẩn_vị"],
            recommendReason: spec.reason || `Món ăn đặc sản nức lòng du khách tại ${cityOpt.city}. Chế biến gia truyền chuẩn vị quê hương.`,
            image: spec.img || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
            gallery: [spec.img || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"],
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-chopsticks-eating-noodles-43003-large.mp4",
            likesCount: 2900 + sIdx * 410,
            commentsCount: 230 + sIdx * 35,
            openTime: "07:00 - 22:00",
            phone: "0912 345 678",
            desc: spec.reason || `Đặc sản trứ danh của ${cityOpt.city}, được thực khách gần xa đánh giá cao.`
          };
          if (!APP_DATA.foods.some(f => f.id === foodItem.id)) {
            APP_DATA.foods.push(foodItem);
          }
          return foodItem;
        });
      } else {
        cityFoods = APP_DATA.foods.slice(0, 6);
      }
    }

    // Score & Rank each food
    const rankedFoods = cityFoods.map(food => {
      const matchScore = this.calculateMatchScore(food, currentMoodId);
      const matchReason = this.generateMatchReason(food);
      return {
        ...food,
        matchScore,
        matchReason
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    if (summaryTextEl) {
      summaryTextEl.textContent = `Tìm thấy ${rankedFoods.length} quán ngon tại ${currentCity.name} — Sắp xếp ưu tiên theo độ chuẩn Gu của bạn (từ ${rankedFoods[0]?.matchScore || 98}% đến ${rankedFoods[rankedFoods.length - 1]?.matchScore || 70}%).`;
    }

    // Render cards
    container.innerHTML = rankedFoods.map((food, idx) => {
      const isTopMatch = idx === 0;
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
      const isLiked = (window.app && window.app.likedFoods) ? window.app.likedFoods.some(f => f.id === food.id) : false;
      const isWillReturn = (window.app && window.app.isFoodWillReturn) ? window.app.isFoodWillReturn(food.id) : false;
      const willReturnCount = (window.app && window.app.getWillReturnCount) ? window.app.getWillReturnCount(food.id) : 98;

      return `
        <div class="taste-card ${status.isOpen ? '' : 'is-closed'} bg-white rounded-2xl border ${isTopMatch ? 'border-rose-300 ring-2 ring-rose-100 shadow-md' : 'border-stone-200 shadow-xs'} overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group">
          <div>
            <!-- Image & Match Badge -->
            <div class="relative h-36 overflow-hidden bg-stone-100 cursor-pointer" onclick="window.app.showFoodDetail(${food.id})">
              <img src="${food.image}" alt="${food.name}"
                data-name="${food.name.replace(/"/g, '&quot;')}"
                data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
                data-category="${food.category || ''}"
                onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${status.isOpen ? '' : 'is-closed-img'}" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              
              <!-- Match Score Badge -->
              <div class="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10">
                <span>🎯 Hợp Gu</span>
                <span>${food.matchScore}%</span>
              </div>

              <!-- Rating Badge -->
              <span class="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                ⭐ ${window.formatRating ? window.formatRating(food.rating) : food.rating}
              </span>

              <!-- Tags & Quick ShopeeFood Order Pill on Image Bottom -->
              <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1">
                <div class="flex items-center gap-1 flex-wrap">
                  ${(food.tags || []).slice(0, 1).map(t => `<span class="bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-md">${t}</span>`).join('')}
                </div>
                <!-- ShopeeFood Delivery Pill on Photo -->
                <button onclick="event.stopPropagation();window.app.openShopeeFoodDelivery(${food.id})"
                  class="inline-flex items-center gap-1 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer ml-auto"
                  title="Đặt giao tận nơi trên ShopeeFood">
                  ${window.getShopeeIcon ? window.getShopeeIcon(12, 'rounded-xs shrink-0') : ''}
                  <span>ShopeeFood</span>
                </button>
              </div>
            </div>

            <!-- Content info -->
            <div class="p-3.5 space-y-2">
              <div>
                <div class="flex items-center justify-between gap-1 mb-0.5">
                  <span class="inline-flex items-center gap-1 text-[9.5px] px-1.5 py-0.5 rounded-md font-extrabold ${food.source === 'ShopeeFood' ? 'bg-orange-50 text-[#EE4D2D] border border-orange-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
                    ${food.source === 'ShopeeFood' ? (window.getShopeeIcon ? window.getShopeeIcon(12, 'shrink-0') : '🛍️') : '🛵'}
                    <span>${food.source || 'ShopeeFood'}</span>
                  </span>
                  <span class="text-[9.5px] text-stone-400 truncate">${food.district || 'TP. Quy Nhơn'}</span>
                </div>
                <h5 class="font-extrabold text-xs text-stone-900 group-hover:text-rose-600 transition truncate cursor-pointer" onclick="window.app.showFoodDetail(${food.id})">
                  ${food.name}
                </h5>
                <div class="flex items-center justify-between gap-1 mt-0.5">
                  <p class="text-[11px] text-stone-500 truncate flex-1" title="${food.restaurant}">${food.restaurant}</p>
                  <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
                    class="inline-flex items-center justify-center w-6 h-6 text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-md transition cursor-pointer shrink-0"
                    title="Xem quán trên bản đồ">
                    <svg class="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                      <line x1="9" y1="3" x2="9" y2="18"></line>
                      <line x1="15" y1="6" x2="15" y2="21"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Operating Hours & Status -->
              <div class="flex items-center gap-1 text-[10.5px] ${status.isOpen ? 'text-emerald-700 font-semibold' : 'text-stone-500'}">
                <span>🕒 ${food.openTime}</span>
                <span class="${status.isOpen ? 'text-stone-400 font-normal' : 'text-rose-500 font-bold'}">(${status.detailText})</span>
              </div>

              <!-- Why this matches your taste -->
              <div class="p-2 bg-rose-50/70 border border-rose-100 rounded-xl text-[10px] text-rose-800 font-medium leading-snug flex items-start gap-1.5">
                <span class="text-rose-500 shrink-0">💡</span>
                <span class="line-clamp-2">${food.matchReason}</span>
              </div>

              <div class="flex items-center justify-between text-[11px] pt-1">
                <span class="font-bold text-rose-600">${food.priceRange.split(' - ')[0]}</span>
                <span class="text-stone-400 flex items-center gap-0.5 cursor-pointer hover:text-amber-600" onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})" title="Xem vị trí quán trên bản đồ">
                  <svg class="w-3 h-3 inline text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  ${food.distanceText.replace('Cách bạn ', '')}
                </span>
              </div>
            </div>
          </div>

          <!-- Dòng riêng: Chức năng sẽ quay lại [😋 142 khách sẽ quay lại] -->
          <div class="px-3.5 pb-2">
            <button onclick="event.stopPropagation();window.app.toggleWillReturn(${food.id})"
              data-will-return-btn="${food.id}"
              class="w-full py-1.5 px-2.5 ${isWillReturn ? 'bg-amber-500 text-white shadow-xs' : 'bg-gradient-to-r from-amber-50 to-orange-50/80 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-200/90'} rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition active:scale-95 cursor-pointer"
              title="${isWillReturn ? 'Bạn đã chọn sẽ quay lại quán này! Bấm để bỏ chọn' : 'Đánh dấu bạn sẽ là khách quen quay lại quán này (' + willReturnCount + ' người đã chọn)'}">
              <span class="text-[17px] leading-none shrink-0 inline-block">😋</span>
              <span class="text-[11px] font-extrabold whitespace-nowrap"><span data-will-return-count="${food.id}">${willReturnCount}</span> khách sẽ quay lại</span>
            </button>
          </div>

          <!-- Bottom Actions: 1. Thích (icon), 2. Bản đồ (icon), 3. Đặt ShopeeFood (icon+text) -->
          <div class="p-3.5 pt-0 flex items-center gap-1.5">
            <!-- 1. Yêu thích (Chỉ icon) -->
            <button onclick="event.stopPropagation();window.app.toggleLikedFood(${food.id})"
              data-like-btn="${food.id}"
              class="w-9 h-8 ${isLiked ? 'bg-rose-500 text-white shadow-xs' : 'bg-rose-50 hover:bg-rose-100 text-rose-600'} rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer border border-rose-100 active:scale-95"
              title="${isLiked ? 'Đã yêu thích (Bấm để bỏ)' : 'Yêu thích món này'}">
              <svg class="w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-rose-500'}" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>

            <!-- 2. Bản đồ (Chỉ icon) -->
            <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
              class="w-9 h-8 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
              title="Xem trên bản đồ">
              <svg class="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="18"></line>
                <line x1="15" y1="6" x2="15" y2="21"></line>
              </svg>
            </button>

            <!-- 3. Đặt ShopeeFood (Nút chính bên phải) -->
            <button onclick="event.stopPropagation();window.app.openShopeeFoodDelivery(${food.id})"
              class="flex-1 h-8 bg-gradient-to-r from-orange-500 to-[#EE4D2D] hover:from-orange-600 hover:to-[#D73211] text-white rounded-xl text-[11px] font-extrabold shadow-sm shadow-orange-300/80 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Đặt món qua ShopeeFood">
              ${window.getShopeeIcon ? window.getShopeeIcon(15, 'rounded-xs shrink-0') : ''}
              <span>ShopeeFood</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Quick switch from the pills row
  quickSwitchCity(cityId) {
    const target = (APP_DATA.districtOptions || []).find(w => w.cityId === cityId || (w.city && w.city.toLowerCase().includes(cityId))) ||
                   APP_DATA.weatherOptions.find(w => w.cityId === cityId || (w.city && w.city.toLowerCase().includes(cityId)));
    if (target) {
      window.app.selectCityAndWeather(
        target.city,
        target.address,
        target.temp,
        target.condition,
        target.icon,
        target.lat,
        target.lng,
        target.cityId
      );
    }
  }

  // ══════════════════════════════════════════════════════
  // TASTE PROFILE MODAL (HỒ SƠ GU ẨM THỰC)
  // ══════════════════════════════════════════════════════
  openTasteProfileModal() {
    window.soundFX && window.soundFX.playPop();
    const modal = document.getElementById('taste-modal');
    if (!modal) return;

    this.renderTasteModalContent();
    modal.classList.remove('hidden');
  }

  closeTasteProfileModal() {
    const modal = document.getElementById('taste-modal');
    if (modal) modal.classList.add('hidden');
  }

  renderTasteModalContent() {
    const container = document.getElementById('taste-modal-content');
    if (!container) return;

    const breakdown = this.getTasteBreakdown();
    const availablePreferences = [
      "🌶️ Thích ăn cay nồng",
      "🥩 Nghiện thịt & nướng xì xèo",
      "🍲 Thích lẩu nóng hổi",
      "🥗 Eat Clean & Ít dầu mỡ",
      "🍜 Thích bún / phở / mì nước",
      "🦀 Thích hải sản tươi sống",
      "🍰 Mê đồ ngọt & trà sữa",
      "💸 Ưu tiên ngon bổ rẻ sinh viên"
    ];

    container.innerHTML = `
      <div class="space-y-5">
        <!-- Overview Banner -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md flex items-center justify-between">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-rose-100">AI Taste Learning Engine</span>
            <h4 class="font-extrabold text-base leading-tight mt-0.5">Hồ Sơ Khẩu Vị Của Bạn</h4>
            <p class="text-xs text-rose-100 mt-1">Học hỏi từ ${this.profile.totalInteractions || 8} lượt quẹt thẻ, thích món và tâm trạng.</p>
          </div>
          <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
            😋
          </div>
        </div>

        <!-- Breakdown percentages -->
        <div>
          <h5 class="font-extrabold text-xs text-stone-900 mb-2.5 flex items-center gap-1.5">
            <span>📊 Phân tích gu ăn uống chi tiết:</span>
          </h5>
          <div class="space-y-2.5">
            ${breakdown.slice(0, 5).map(item => `
              <div>
                <div class="flex items-center justify-between text-xs font-bold mb-1">
                  <span class="flex items-center gap-1.5 text-stone-700">
                    <span>${item.emoji}</span>
                    <span>${item.label}</span>
                  </span>
                  <span class="text-rose-600 font-extrabold">${item.percentage}%</span>
                </div>
                <div class="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-gradient-to-r from-rose-500 to-amber-400 h-full rounded-full transition-all duration-500" style="width: ${item.percentage}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Custom preferences checkboxes -->
        <div class="pt-3 border-t border-stone-100">
          <h5 class="font-extrabold text-xs text-stone-900 mb-1.5">
            ✨ Tùy chỉnh nhanh khẩu vị của bạn:
          </h5>
          <p class="text-[11px] text-stone-500 mb-3">Bấm chọn các sở thích dưới đây để thuật toán tự động sắp xếp lại quán ngon theo ý bạn:</p>
          <div class="grid grid-cols-2 gap-2">
            ${availablePreferences.map(pref => {
              const cleanName = pref.replace(/^[^\s]+\s/, '');
              const isChecked = (this.profile.customPreferences || []).some(p => p.includes(cleanName) || cleanName.includes(p));
              return `
                <button onclick="window.tasteManager.toggleAndRefreshPref('${cleanName}')"
                  class="p-2 rounded-xl border text-[11px] font-bold text-left transition-all flex items-center gap-2 ${
                    isChecked 
                      ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs' 
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                  }">
                  <span>${isChecked ? '✅' : '⚪'}</span>
                  <span class="truncate">${pref}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Apply Button -->
        <div class="pt-2">
          <button onclick="window.tasteManager.closeTasteProfileModal()" 
            class="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 hover:opacity-95 transition">
            Áp Dụng Khẩu Vị Này ✨
          </button>
        </div>
      </div>
    `;
  }

  toggleAndRefreshPref(cleanName) {
    window.soundFX && window.soundFX.playPop();
    this.togglePreference(cleanName);
    this.renderTasteModalContent();
    this.renderLocationRecommendations();
    window.app.showToast(`Đã cập nhật gu: ${cleanName}`);
  }
}

// Global instance
window.tasteManager = new TasteManager();
