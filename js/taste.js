// ═══════════════════════════════════════════════════════════════════
// TASTE ENGINE & PERSONALIZED LOCATION RECOMMENDATION MANAGER
// Thuật toán gợi ý quán ăn theo tỉnh/thành phố dựa trên gu cá nhân
// ═══════════════════════════════════════════════════════════════════

class TasteManager {
  constructor() {
    this.storageKey = 'foodtinder_user_taste_v1';
    this.profile = this.loadProfile();
    this.visibleLimit = 40; // Mặc định hiển thị 40 quán, mỗi lần nhấn Xem thêm hiện thêm 12 quán
    this.currentRadius = 1;
    this.lastCityId = null;
    this.onlySpecialties = false; // Lọc chỉ hiển thị đặc sản địa phương
  }

  loadMoreTasteFoods() {
    this.visibleLimit = (this.visibleLimit || 40) + 12;
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    this.renderLocationRecommendations();
    if (window.app && window.app.showToast) {
      window.app.showToast(`✨ Đã tải thêm quán chuẩn Gu!`);
    }
  }

  loadMoreRadius() {
    this.loadMoreTasteFoods();
  }

  resetRadius() {
    this.visibleLimit = 40;
  }

  toggleSpecialtyFilter() {
    this.visibleLimit = 40;
    this.onlySpecialties = !this.onlySpecialties;
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    this.renderLocationRecommendations();
    if (window.app && window.app.showToast) {
      if (this.onlySpecialties) {
        window.app.showToast(`🍲 Đã bật lọc: Chỉ hiển thị các quán đặc sản địa phương!`);
      } else {
        window.app.showToast(`✨ Đã tắt lọc: Hiển thị tất cả quán ngon.`);
      }
    }
  }

  isLocationSpecialty(food, currentCity) {
    if (!food) return false;

    // 1. Check direct specialty flag
    if (food.isSpecialty) return true;

    // 2. Check tags for '#Đặc_sản' or 'đặc sản'
    if (Array.isArray(food.tags)) {
      const hasSpecialtyTag = food.tags.some(t => {
        const lower = String(t).toLowerCase();
        return lower.includes('đặc_sản') || lower.includes('đặc sản') || lower.includes('dac_san');
      });
      if (hasSpecialtyTag) return true;
    }

    // 3. Check sideRibbon
    if (Array.isArray(food.sideRibbon)) {
      const hasSpecialtyRibbon = food.sideRibbon.some(r => {
        const lower = String(r).toLowerCase();
        return lower.includes('đặc_sản') || lower.includes('đặc sản');
      });
      if (hasSpecialtyRibbon) return true;
    }

    const cityName = (currentCity?.name || currentCity?.cityName || (window.APP_DATA && window.APP_DATA.currentLocation ? window.APP_DATA.currentLocation.city : '') || '').toLowerCase();
    const cityId = (currentCity?.cityId || '').toLowerCase();
    const foodName = (food.name || '').toLowerCase();
    const restName = (food.restaurant || '').toLowerCase();

    // Check if food contains general specialty keywords
    if (foodName.includes('đặc sản') || restName.includes('đặc sản')) return true;

    // Quy Nhơn / Bình Định local specialties keywords
    if (cityId.includes('quynhon') || cityId.includes('binhdinh') || cityName.includes('quy nhơn') || cityName.includes('bình định')) {
      const qnKeywords = [
        'bánh hỏi', 'cháo lòng', 'bánh xèo', 'bún sứa', 'chả cá', 'cá tà ma',
        'gà chỉ', 'cua huỳnh đế', 'nem chợ huyện', 'nem nướng', 'bò nướng ngói',
        'chả ram', 'bún rạm', 'tré', 'bánh ít', 'bánh cuốn tây sơn', 'chim mía',
        'mực lá', 'rượu bàu đá'
      ];
      if (qnKeywords.some(k => foodName.includes(k) || restName.includes(k))) return true;
    }

    // Check against city's signatures / specialties in districtOptions or weatherOptions
    if (window.APP_DATA) {
      const districtOpt = (window.APP_DATA.districtOptions || []).find(d => 
        d.cityId === currentCity?.cityId || d.city === currentCity?.name || (d.shortName && currentCity?.name && currentCity.name.includes(d.shortName))
      );
      const cityOpt = districtOpt || (window.APP_DATA.weatherOptions || []).find(w => 
        w.cityId === currentCity?.cityId || w.city === currentCity?.name || (w.shortName && currentCity?.name && currentCity.name.includes(w.shortName))
      );

      if (cityOpt) {
        if (cityOpt.signature) {
          const sigParts = cityOpt.signature.split(',').map(s => s.trim().toLowerCase());
          if (sigParts.some(sig => foodName.includes(sig) || (sig.length > 4 && restName.includes(sig)))) {
            return true;
          }
        }
        if (Array.isArray(cityOpt.specialties)) {
          if (cityOpt.specialties.some(s => s.name && (foodName.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(foodName)))) {
            return true;
          }
        }
      }
    }

    return false;
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
    if (!container) return;

    const currentCity = APP_DATA.currentCity;
    const currentMoodId = APP_DATA.currentMoodId;

    // Reset limit về 40 khi chuyển sang tỉnh/thành phố khác
    const cityKey = currentCity.cityId || currentCity.name;
    if (this.lastCityId !== cityKey) {
      this.visibleLimit = 40;
      this.lastCityId = cityKey;
    }
    if (!this.visibleLimit || this.visibleLimit < 40) {
      this.visibleLimit = 40;
    }

    if (titleCityEl) {
      titleCityEl.textContent = currentCity.name;
    }

    // Filter foods belonging to this city or district
    let cityFoods = APP_DATA.foods.filter(f => {
      if (window.isFakeDummyFood && window.isFakeDummyFood(f)) return false;
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
          let parsedRest = spec.rest || `Đặc Sản ${cityOpt.shortName || cityOpt.city}`;
          let parsedAddr = spec.address || cityOpt.address;
          if (spec.rest && /[-–—]/.test(spec.rest)) {
            const parts = spec.rest.split(/[-–—]/);
            parsedRest = parts[0].trim();
            const branch = parts.slice(1).join(' - ').trim();
            if (branch && !spec.address) {
              parsedAddr = branch;
              const cleanC = (cityOpt.shortName || cityOpt.city || '').split('(')[0].replace(/cũ/gi, '').trim();
              if (cleanC && !parsedAddr.toLowerCase().includes(cleanC.toLowerCase())) {
                parsedAddr += `, ${cleanC}`;
              }
            }
          }

          const foodId = 6000 + Math.abs(Math.round(cityOpt.lat * 100)) + sIdx;
          const foodLat = (spec.latitude !== undefined && spec.latitude !== null) ? spec.latitude : (spec.lat || ((cityOpt.latitude || cityOpt.lat) + (sIdx * 0.003)));
          const foodLng = (spec.longitude !== undefined && spec.longitude !== null) ? spec.longitude : (spec.lng || ((cityOpt.longitude || cityOpt.lng) + (sIdx * 0.003)));

          // Tính khoảng cách thực tế từ vị trí người dùng (User Location)
          const userLoc = (window.APP_DATA && window.APP_DATA.homeLocation) ? window.APP_DATA.homeLocation : { lat: 13.7735, lng: 109.2365 };
          const calcHaversine = (la1, lo1, la2, lo2) => {
            if (!la1 || !lo1 || !la2 || !lo2) return 1.0;
            const R = 6371;
            const dLa = (la2 - la1) * Math.PI / 180;
            const dLo = (lo2 - lo1) * Math.PI / 180;
            const a = Math.sin(dLa/2)*Math.sin(dLa/2) + Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)*Math.sin(dLo/2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          };
          const calcDistFn = window.calculateDistanceKm || (window.APP_DATA && window.APP_DATA.calculateDistanceKm) || calcHaversine;
          const formatDistFn = window.formatDistanceText || (window.APP_DATA && window.APP_DATA.formatDistanceText) || (k => (k < 1 ? `Cách bạn ${Math.round(k*1000)}m` : `Cách bạn ${k.toFixed(1)}km`));
          const realDistKm = calcDistFn(userLoc.lat, userLoc.lng, foodLat, foodLng);
          const distText = formatDistFn(realDistKm);

          const existingItem = APP_DATA.foods.find(f => f.id === foodId || (f.name === spec.name && f.cityId === cityOpt.cityId));
          if (existingItem) {
            existingItem.restaurant = parsedRest;
            existingItem.address = parsedAddr;
            existingItem.distance = Number(realDistKm.toFixed(1));
            existingItem.distanceText = distText;
            existingItem.latitude = foodLat;
            existingItem.longitude = foodLng;
            existingItem.lat = foodLat;
            existingItem.lng = foodLng;
            existingItem.cityId = cityOpt.cityId;
            existingItem.cityName = cityOpt.city;
            return existingItem;
          }

          const foodItem = {
            id: foodId,
            cityId: cityOpt.cityId,
            cityName: cityOpt.city,
            name: spec.name,
            restaurant: parsedRest,
            address: parsedAddr,
            distance: Number(realDistKm.toFixed(1)),
            distanceText: distText,
            weatherNote: `${cityOpt.condition} ${cityOpt.temp}`,
            priceRange: spec.price || "45.000đ - 85.000đ",
            rating: Number(window.formatRating ? window.formatRating(4.8 + (sIdx % 2) * 0.1) : (4.8 + (sIdx % 2) * 0.1).toFixed(1)),
            reviewCount: 1520 + sIdx * 340,
            latitude: foodLat,
            longitude: foodLng,
            lat: foodLat,
            lng: foodLng,
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
          APP_DATA.foods.push(foodItem);
          return foodItem;
        });
      } else {
        cityFoods = APP_DATA.foods.slice(0, 6);
      }
    }

    // Filter foods within current radius (mặc định ban đầu 1km, mỗi lần bấm Xem thêm tăng +1km)
    // Cập nhật trạng thái giao diện nút Lọc đặc sản
    const specialtyBtn = document.getElementById('taste-specialty-toggle-btn');
    if (specialtyBtn) {
      if (this.onlySpecialties) {
        specialtyBtn.className = "px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border border-amber-500 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer";
        specialtyBtn.innerHTML = `
          <span>✨ Đang lọc Đặc sản</span>
          <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        `;
      } else {
        specialtyBtn.className = "px-3.5 py-2 bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-700 border border-stone-200 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer";
        specialtyBtn.innerHTML = `
          <span>🍲 Lọc đặc sản</span>
        `;
      }
    }

    // Lọc theo đặc sản địa phương nếu người dùng bật nút Lọc đặc sản
    let displayFoods = cityFoods;
    if (this.onlySpecialties) {
      displayFoods = cityFoods.filter(f => this.isLocationSpecialty(f, currentCity));
    }

    // Kiểm tra xem người dùng đang ở location hiện tại (nơi user đang ở) hay đã đổi sang tỉnh thành khác
    const homeCityId = (window.APP_DATA && window.APP_DATA.homeCityId) ? window.APP_DATA.homeCityId : 'quynhon';
    const isHomeLocation = (
      currentCity.cityId === homeCityId || 
      (currentCity.name && typeof currentCity.name === 'string' && currentCity.name.toLowerCase().includes('quy nhơn')) ||
      (currentCity.cityId && typeof currentCity.cityId === 'string' && currentCity.cityId.toLowerCase().includes('quynhon'))
    );

    // Hiển thị các quán chuẩn Gu (mặc định 40 quán, mỗi lần nhấn Xem thêm hiện thêm 12 quán)
    const rankedFoods = displayFoods.map(food => {
      const matchScore = this.calculateMatchScore(food, currentMoodId);
      const matchReason = this.generateMatchReason(food);
      return {
        ...food,
        matchScore,
        matchReason
      };
    }).sort((a, b) => (b.matchScore - a.matchScore) || ((Number(a.distance) || 0) - (Number(b.distance) || 0)));

    const totalCount = rankedFoods.length;
    const limit = this.visibleLimit || 40;
    const foodsToDisplay = rankedFoods.slice(0, limit);
    const hasMore = limit < totalCount;

    if (summaryTextEl) {
      const filterBadge = this.onlySpecialties 
        ? `<span class="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300 text-xs shadow-2xs shrink-0">🍲 Đang lọc: Đặc sản</span>`
        : '';

      if (totalCount > 0) {
        summaryTextEl.innerHTML = `
          <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            ${filterBadge}
            <span class="text-xs text-stone-600 font-medium whitespace-normal sm:whitespace-nowrap overflow-hidden text-ellipsis">
              Tìm thấy <b>${totalCount}</b> quán ${this.onlySpecialties ? 'đặc sản ' : ''}ngon tại <b>${currentCity.name}</b> (đang hiển thị ${foodsToDisplay.length}/${totalCount}) — Sắp xếp theo độ chuẩn Gu (${rankedFoods[0]?.matchScore || 98}% → ${rankedFoods[totalCount - 1]?.matchScore || 70}%).
            </span>
          </div>
        `;
      } else {
        summaryTextEl.innerHTML = `
          <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            ${filterBadge}
            <span class="text-xs text-stone-500 font-medium whitespace-normal sm:whitespace-nowrap">
              Chưa tìm thấy quán ${this.onlySpecialties ? 'đặc sản ' : ''}nào phù hợp tại ${currentCity.name}.
            </span>
          </div>
        `;
      }
    }

    // Render cards
    if (foodsToDisplay.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-10 px-4 text-center bg-white rounded-2xl border border-dashed border-stone-300">
          <span class="text-3xl">🔍</span>
          <h4 class="font-bold text-stone-800 text-sm mt-2">Chưa tìm thấy quán phù hợp tại ${currentCity.name}</h4>
          <p class="text-xs text-stone-500 mt-1">Thử chuyển sang tỉnh thành khác hoặc mở rộng tiêu chí tìm kiếm.</p>
        </div>
      `;
    } else {
      container.innerHTML = foodsToDisplay.map((food, idx) => {
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
            </div>

            <!-- Content info -->
            <div class="p-3.5 space-y-2">
              <div>
                <h5 class="font-extrabold text-xs text-stone-900 group-hover:text-rose-600 transition truncate cursor-pointer" onclick="window.app.showFoodDetail(${food.id})" title="${food.restaurant}">
                  ${food.restaurant}
                </h5>
                <div class="flex items-center justify-between gap-1 mt-0.5">
                  <p class="text-[11px] text-stone-500 truncate flex-1" title="${food.address || food.district || ''}">
                    📍 ${food.address || food.district || 'TP. Quy Nhơn'}
                  </p>
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

              <div class="flex items-center justify-between text-[11px] pt-1">
                <span class="font-bold text-rose-600">${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}</span>
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
              ${window.getShopeeIcon ? window.getShopeeIcon(18, 'shrink-0') : ''}
              <span>ShopeeFood</span>
            </button>
          </div>
        </div>
      `;
      }).join('');
    }

    // Render button Xem thêm (+12 quán)
    const moreContainer = document.getElementById('taste-load-more-container');
    if (moreContainer) {
      if (hasMore) {
        const remaining = totalCount - foodsToDisplay.length;
        const nextBatch = Math.min(12, remaining);
        moreContainer.innerHTML = `
          <div class="p-3.5 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-rose-50/90 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">🍽️</span>
              <div>
                <p class="text-xs font-bold text-stone-800">
                  Đang hiển thị <b>${foodsToDisplay.length} / ${totalCount} quán</b> chuẩn Gu
                </p>
                <p class="text-[11px] text-stone-500">Còn lại ${remaining} quán ngon phù hợp với khẩu vị bạn đã quẹt thích.</p>
              </div>
            </div>
            <button onclick="window.tasteManager.loadMoreTasteFoods()"
              class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-md shadow-rose-300/80 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0">
              <span>Xem thêm</span>
              <span class="text-xs">↓</span>
            </button>
          </div>
        `;
      } else if (totalCount > 40) {
        moreContainer.innerHTML = `
          <div class="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-stone-500 shadow-2xs">
            <span>🎉 Đã hiển thị toàn bộ ${totalCount} quán ${this.onlySpecialties ? 'đặc sản ' : ''}ngon chuẩn Gu tại ${currentCity.name}.</span>
          </div>
        `;
      } else {
        moreContainer.innerHTML = '';
      }
    }
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
