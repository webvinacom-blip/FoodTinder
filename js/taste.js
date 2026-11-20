// ═══════════════════════════════════════════════════════════════════
// TASTE ENGINE & PERSONALIZED LOCATION RECOMMENDATION MANAGER
// Thuật toán gợi ý quán ăn theo tỉnh/thành phố dựa trên gu cá nhân
// ═══════════════════════════════════════════════════════════════════

class TasteManager {
  constructor() {
    this.storageKey = 'foodtinder_user_taste_profile_v2';
    this.profile = this.loadProfile();
    this.userPreferences = this.loadUserPreferences();
    this.visibleLimit = 40; // Mặc định hiển thị 40 quán, mỗi lần nhấn Xem thêm hiện thêm 12 quán
    this.currentRadius = 1;
    this.lastCityId = null;
    this.onlySpecialties = false; // Lọc chỉ hiển thị đặc sản địa phương
    this.sortOrder = 'match_desc'; // 'match_desc' | 'distance_asc' | 'rating_desc'
    this.selectedColdStartCategories = new Set();

    // 1. Kích hoạt suy giảm theo thời gian (Time Decay: giảm 15% điểm cũ mỗi 7 ngày)
    this.applyTimeDecay();
  }

  changeSortOrder(order) {
    this.sortOrder = order;
    this.renderLocationRecommendations();
  }

  // Rút gọn giá: ví dụ '25.000đ ~ 65.000đ' -> '25k – 65k'
  compactPrice(p) {
    if (!p) return '35k – 65k';
    let s = String(p);
    s = s.replace(/(\d+)\.000\s*đ?/g, '$1k');
    s = s.replace(/(\d+)\.000/g, '$1k');
    s = s.replace(/~/g, '–').replace(/-/g, '–');
    s = s.replace(/\s*–\s*/g, ' – ');
    s = s.replace(/đ/g, '').trim();
    return s;
  }

  loadUserPreferences() {
    try {
      const saved = localStorage.getItem('foodtinder_user_taste_prefs');
      if (saved) return JSON.parse(saved);
      if (window.authManager && typeof window.authManager.loadTastePreferences === 'function') {
        return window.authManager.loadTastePreferences();
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  applyTastePreferences(prefs) {
    this.userPreferences = prefs || this.loadUserPreferences();
    this.renderLocationRecommendations();
  }

  // Kiểm tra chính xác món ăn có phải hải sản hay không (không bị nhầm bởi #Đặc_sản)
  isFoodSeafood(food) {
    if (!food) return false;
    if (food.category === 'seafood') return true;
    const name = (food.name || '').toLowerCase();
    const rest = (food.restaurant || '').toLowerCase();
    
    // Kiểm tra tên món hoặc tên quán có chứa hải sản rõ ràng
    const seafoodNames = [
      'hải sản', 'tôm', 'cua biển', 'cua huỳnh đế', 'mực', 'ốc', 'sứa', 'ghẹ',
      'hàu', 'bạch tuộc', 'sò', 'nghêu', 'cá tà ma', 'chả cá', 'cá ngừ', 'cá bớp',
      'cá hồi', 'cá thu', 'cá lóc', 'cá diêu hồng', 'cá bống', 'cá kèo'
    ];
    if (seafoodNames.some(w => name.includes(w) || rest.includes(w))) return true;

    // Kiểm tra tags: đảm bảo không nhầm #Đặc_sản thành hải sản
    if (Array.isArray(food.tags)) {
      for (const rawTag of food.tags) {
        const t = String(rawTag).toLowerCase();
        if (t.includes('đặc_sản') || t.includes('đặc sản')) continue;
        if (t.includes('hải_sản') || t.includes('hải sản') || t.includes('tôm') || t.includes('cua') || 
            t.includes('mực') || t.includes('ốc') || t.includes('sứa') || t.includes('ghẹ') || 
            t.includes('hàu') || t.includes('bạch_tuộc') || t.includes('sò') || t.includes('nghêu') || 
            t.includes('cá_tà_ma') || t.includes('chả_cá')) {
          return true;
        }
      }
    }
    return false;
  }

  isFoodAllowedByPreferences(food, customPrefs = null) {
    if (!food) return false;
    const prefs = customPrefs || this.userPreferences || this.loadUserPreferences();
    if (!prefs) return true;

    const diets = Array.isArray(prefs.diets) ? prefs.diets : (prefs.diet ? [prefs.diet] : ['normal']);

    // 1. Chế độ ăn kiêng hải sản
    if (diets.includes('no_seafood')) {
      if (this.isFoodSeafood(food)) return false;
    }

    // 2. Chế độ ăn chay / bán chay
    if (diets.includes('vegetarian')) {
      const isVeg = food.category === 'vegetarian' || food.category === 'healthy' ||
        (Array.isArray(food.tags) && food.tags.some(t => /chay|nấm|salad|healthy|rau củ/i.test(t))) ||
        /chay|nấm|đậu hũ|rau/i.test(food.name || '');
      const isMeatOrSeafood = this.isFoodSeafood(food) || /thịt|bò|heo|gà|vịt|lòng|sườn|pate|xá xíu|nem chua/i.test(food.name || '');
      if (isMeatOrSeafood && !isVeg) return false;
    }

    // 3. Khẩu vị không ăn cay
    if (Array.isArray(prefs.flavors) && prefs.flavors.includes('no_spicy')) {
      const isSpicy = (Array.isArray(food.tags) && food.tags.some(t => /cay|siêu cay|sa tế/i.test(t))) ||
        /siêu cay|mì cay|lẩu thái cay|sa tế/i.test(food.name || '');
      if (isSpicy) return false;
    }

    // 4. Kiêng thịt heo (no_pork)
    if (diets.includes('no_pork')) {
      const isPork = /heo|lợn|sườn heo|ba chỉ|xá xíu|giò heo|chả lụa|nem chua|thịt kho tàu|lòng heo/i.test(food.name || '') ||
        (Array.isArray(food.tags) && food.tags.some(t => /heo|lợn|ba_chỉ|xá_xíu/i.test(t)));
      if (isPork) return false;
    }

    return true;
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (!parsed.categories) parsed.categories = {};
          if (!parsed.flavors) parsed.flavors = {};
          if (!parsed.consecutive_skips) parsed.consecutive_skips = {};
          if (!parsed.recent_interacted) parsed.recent_interacted = {};
          if (!parsed.last_decay_time) parsed.last_decay_time = Date.now();
          if (typeof parsed.max_distance_km !== 'number') parsed.max_distance_km = 3.5;
          if (!parsed.preferred_price) parsed.preferred_price = 'medium';
          return parsed;
        }
      }

      // Tương thích ngược từ v1 nếu có
      const oldV1 = localStorage.getItem('foodtinder_user_taste_v1');
      if (oldV1) {
        const p1 = JSON.parse(oldV1);
        if (p1 && typeof p1 === 'object') {
          return {
            categories: {
              hai_san: (p1.likedCategories?.seafood || 0) * 3,
              lau: (p1.likedCategories?.hotpot || 0) * 3,
              nuong: (p1.likedCategories?.bbq || 0) * 3,
              com_bun: (p1.likedCategories?.noodles || 0) * 3,
              tra_sua: 6,
              an_vat: (p1.likedCategories?.streetfood || 0) * 3,
              banh_xeo: 0,
              chay: 0
            },
            flavors: {
              cay: 8,
              thanh_dam: 4,
              ngot: 6,
              dam_da: 10,
              chua: 4,
              gion: 6
            },
            preferred_price: 'medium',
            max_distance_km: 3.5,
            last_decay_time: Date.now(),
            consecutive_skips: {},
            recent_interacted: {},
            likedCategories: p1.likedCategories || {},
            likedTags: p1.likedTags || {},
            totalInteractions: p1.totalInteractions || 5
          };
        }
      }
    } catch (e) {}

    // Khởi tạo Hồ Sơ Khẩu Vị ban đầu (Clean Slate)
    return {
      categories: {
        hai_san: 6,
        lau: 6,
        nuong: 6,
        com_bun: 6,
        tra_sua: 4,
        an_vat: 4,
        banh_xeo: 2,
        chay: 0
      },
      flavors: {
        cay: 5,
        thanh_dam: 3,
        ngot: 4,
        dam_da: 6,
        chua: 3,
        gion: 4
      },
      preferred_price: 'medium',
      max_distance_km: 3.5,
      last_decay_time: Date.now(),
      consecutive_skips: {},
      recent_interacted: {},
      likedCategories: {},
      likedTags: {},
      totalInteractions: 0
    };
  }

  saveProfile() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    } catch (e) {}
  }

  // 1. CƠ CHẾ SUY GIẢM THEO THỜI GIAN (TIME DECAY: Giảm 15% mỗi 7 ngày)
  applyTimeDecay() {
    const now = Date.now();
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const timeDiff = now - (this.profile.last_decay_time || now);
    if (timeDiff >= ONE_WEEK_MS) {
      const weeks = Math.floor(timeDiff / ONE_WEEK_MS);
      const decayFactor = Math.pow(0.85, Math.min(weeks, 4));
      if (this.profile.categories) {
        for (const cat in this.profile.categories) {
          this.profile.categories[cat] = Math.round(this.profile.categories[cat] * decayFactor * 10) / 10;
        }
      }
      if (this.profile.flavors) {
        for (const fl in this.profile.flavors) {
          this.profile.flavors[fl] = Math.round(this.profile.flavors[fl] * decayFactor * 10) / 10;
        }
      }
      this.profile.last_decay_time = now;
      this.saveProfile();
    }
  }

  // Trích xuất đặc trưng danh mục và khẩu vị từ quán ăn
  extractFoodProfileFeatures(food) {
    if (!food) return { categories: ['an_vat'], flavors: ['dam_da'], priceTier: 'medium' };

    const name = String(food.name || '').toLowerCase();
    const rest = String(food.restaurant || '').toLowerCase();
    const cat = String(food.category || '').toLowerCase();
    const tags = Array.isArray(food.tags) ? food.tags.map(t => String(t).toLowerCase()) : [];
    const allText = `${name} ${rest} ${cat} ${tags.join(' ')}`;

    // 1. Phân loại danh mục (Categories)
    const categories = [];
    if (this.isFoodSeafood(food) || cat === 'seafood' || /hải sản|ốc|tôm|cua|mực|sứa|ghẹ|hàu|bạch tuộc|sò|nghêu|cá/i.test(allText)) {
      categories.push('hai_san');
    }
    if (cat === 'hotpot' || /lẩu|tomyum/i.test(allText)) {
      categories.push('lau');
    }
    if (cat === 'bbq' || /nướng|bbq|xiên que nướng|bò nướng|chân gà nướng/i.test(allText)) {
      categories.push('nuong');
    }
    if (cat === 'rice' || cat === 'noodles' || /cơm|bún|phở|bánh canh|hủ tiếu|mì quảng|cháo/i.test(allText)) {
      categories.push('com_bun');
    }
    if (cat === 'cafe' || cat === 'drink' || cat === 'boba' || /trà sữa|cà phê|nước ép|sinh tố|chè|kem/i.test(allText)) {
      categories.push('tra_sua');
    }
    if (cat === 'streetfood' || /bánh tráng|ăn vặt|nem|chả ram|bánh bèo|chân gà|tré|xiên que/i.test(allText)) {
      categories.push('an_vat');
    }
    if (/bánh xèo|bánh khọt|bánh căn/i.test(allText)) {
      categories.push('banh_xeo');
    }
    if (cat === 'vegetarian' || cat === 'healthy' || /chay|salad|healthy|eat clean/i.test(allText)) {
      categories.push('chay');
    }

    if (categories.length === 0) {
      categories.push(cat || 'an_vat');
    }

    // 2. Phân loại khẩu vị (Flavors)
    const flavors = [];
    if (/cay|sa tế|ớt|siêu cay/i.test(allText)) flavors.push('cay');
    if (/thanh|luộc|hấp|thanh đạm|ít dầu|healthy|nước lèo thanh/i.test(allText)) flavors.push('thanh_dam');
    if (/ngọt|béo|sữa|chè|kem|bơ/i.test(allText) || categories.includes('tra_sua')) flavors.push('ngot');
    if (/chua|me|gỏi|nộm|chanh|tomyum/i.test(allText)) flavors.push('chua');
    if (/đậm đà|mặn|sốt|kho|chiên mắm/i.test(allText)) flavors.push('dam_da');
    if (/giòn|ram|chiên giòn|da giòn/i.test(allText)) flavors.push('gion');

    if (flavors.length === 0) {
      flavors.push('dam_da');
    }

    // 3. Phân khúc giá
    let priceTier = 'medium';
    const priceMin = food.priceMin || 0;
    const priceMax = food.priceMax || 0;
    const avgPrice = priceMax > 0 ? (priceMin + priceMax) / 2 : (priceMin || 40000);
    if (avgPrice < 35000) priceTier = 'low';
    else if (avgPrice > 90000) priceTier = 'high';

    return { categories, flavors, priceTier };
  }

  // 2. GÁN TRỌNG SỐ CHO TỪNG HÀNH VI CỦA NGƯỜI DÙNG
  recordAction(food, actionType) {
    if (!food) return;
    this.applyTimeDecay();

    const foodId = String(food.id || food.restaurant);
    const { categories, flavors } = this.extractFoodProfileFeatures(food);

    // Xác định trọng số hành vi theo yêu cầu
    let delta = 0;
    if (actionType === 'order' || actionType === 'invite') {
      delta = 10; // Bấm đặt hàng ShopeeFood / Rủ đi ăn: +10 điểm (tín hiệu mạnh nhất)
    } else if (actionType === 'like') {
      delta = 5;  // Quẹt phải (Thích) / Lưu quán: +5 điểm
    } else if (actionType === 'view_reels' || actionType === 'view_menu') {
      delta = 3;  // Xem Reels > 50% thời lượng hoặc xem chi tiết menu: +3 điểm
    } else if (actionType === 'dislike') {
      delta = -3; // Quẹt trái (Bỏ qua): -3 điểm
    }

    // Cập nhật điểm danh mục
    categories.forEach(cat => {
      this.profile.categories[cat] = (this.profile.categories[cat] || 0) + delta;

      if (actionType === 'dislike') {
        this.profile.consecutive_skips[cat] = (this.profile.consecutive_skips[cat] || 0) + 1;
        // Bỏ qua liên tiếp 3 lần cùng một loại món: phạt thêm -8 điểm
        if (this.profile.consecutive_skips[cat] >= 3) {
          this.profile.categories[cat] -= 8;
        }
      } else if (delta > 0) {
        // Reset skip liên tiếp khi user có tương tác tích cực
        this.profile.consecutive_skips[cat] = 0;
      }
    });

    // Cập nhật điểm khẩu vị
    flavors.forEach(fl => {
      this.profile.flavors[fl] = (this.profile.flavors[fl] || 0) + (delta * 0.5);
    });

    // Tự điều chỉnh max_distance_km dựa trên các quán user hay chọn
    if (delta > 0 && typeof food.distance === 'number' && food.distance > 0) {
      const currentMax = this.profile.max_distance_km || 3.5;
      this.profile.max_distance_km = Math.round(Math.min(10, Math.max(2.0, (currentMax * 0.8) + (food.distance * 1.2 * 0.2))) * 10) / 10;
    }

    // Ghi nhận cooldown & tương tác gần nhất
    if (!this.profile.recent_interacted) this.profile.recent_interacted = {};
    this.profile.recent_interacted[foodId] = {
      action: actionType,
      timestamp: Date.now()
    };

    this.profile.totalInteractions = (this.profile.totalInteractions || 0) + 1;
    this.saveProfile();

    // Đồng bộ lên UserActionBatcher (để ghi vào Firestore user_behavior_batches theo batch 3 phút)
    if (window.userActionBatcher && typeof window.userActionBatcher.recordAction === 'function') {
      window.userActionBatcher.recordAction({
        type: `taste_${actionType}`,
        foodId: food.id,
        restaurant: food.restaurant,
        category: food.category,
        categories,
        flavors
      });
    }
  }

  // Phương thức tương thích ngược
  recordLike(food) {
    this.recordAction(food, 'like');
  }

  recordBatchInteractions(actions) {
    if (!Array.isArray(actions) || actions.length === 0) return;
    const allFoods = (window.APP_DATA && window.APP_DATA.foods) || [];

    actions.forEach(act => {
      if (!act) return;
      const food = allFoods.find(f => f.id === act.foodId) || { id: act.foodId, restaurant: act.restaurant, category: act.category };
      if (act.type === 'swipe_liked' || act.type === 'taste_like') {
        this.recordAction(food, 'like');
      } else if (act.type === 'swipe_skipped' || act.type === 'taste_dislike') {
        this.recordAction(food, 'dislike');
      } else if (act.type === 'reel_watched_deep' || act.type === 'taste_view_reels') {
        this.recordAction(food, 'view_reels');
      } else if (act.type === 'shopee_order' || act.type === 'taste_order') {
        this.recordAction(food, 'order');
      }
    });
  }

  syncFromLikedFoods(likedFoods = []) {
    if (!Array.isArray(likedFoods) || likedFoods.length === 0) return;
    likedFoods.forEach(food => {
      if (food) this.recordAction(food, 'like');
    });
  }

  // 3. CƠ CHẾ COOLDOWN (Tạm ẩn quán vừa tương tác)
  getCooldownPenalty(restaurantId) {
    if (!this.profile || !this.profile.recent_interacted) return 0;
    const record = this.profile.recent_interacted[String(restaurantId)];
    if (!record) return 0;

    const now = Date.now();
    const ageDays = (now - record.timestamp) / (24 * 60 * 60 * 1000);

    // Quán vừa quẹt trái: Trừ -50 điểm trong vòng 7 ngày để không hiện lại ngay lập tức
    if (record.action === 'dislike') {
      if (ageDays <= 7) return -50;
      return 0;
    }

    // Quán vừa chốt đi ăn / đặt hàng:
    // Trừ -30 điểm trong vòng 3 ngày (vì ít ai ăn 1 quán 2 ngày liên tiếp),
    // Sau 3 ngày thì được thưởng +5 điểm vì là "quán ruột"
    if (record.action === 'order' || record.action === 'invite') {
      if (ageDays <= 3) return -30;
      return 5;
    }

    return 0;
  }

  // 4. ĐIỂM NGỮ CẢNH (0 - 50 ĐIỂM: Tâm trạng + Thời tiết + Khung giờ)
  getContextScore(restaurant, context = null) {
    let score = 0;
    const now = context && context.now ? context.now : new Date();
    const curHour = now.getHours();

    // 1. Trạng thái mở cửa (0 - 20 điểm)
    const status = window.getRestaurantStatus ? window.getRestaurantStatus(restaurant, now) : { isOpen: true };
    if (status && status.isOpen) {
      score += 20;
    } else {
      score -= 10;
    }

    // 2. Khung giờ & Bữa ăn trong ngày (0 - 15 điểm)
    const mealTimes = Array.isArray(restaurant.mealTimes) ? restaurant.mealTimes : [];
    let currentMeal = '';
    if (curHour >= 5 && curHour < 10) currentMeal = 'breakfast';
    else if (curHour >= 11 && curHour < 14) currentMeal = 'lunch';
    else if (curHour >= 14 && curHour < 17) currentMeal = 'afternoon';
    else if (curHour >= 17 && curHour < 21) currentMeal = 'dinner';
    else if (curHour >= 21 || curHour < 5) currentMeal = 'late_night';

    if (currentMeal && mealTimes.includes(currentMeal)) {
      score += 15;
    } else if (mealTimes.length === 0) {
      score += 8;
    }

    // 3. Tâm trạng & Thời tiết thực tế (0 - 15 điểm)
    const moodId = (context && context.moodId) || (window.app && window.app.currentMood) || 'rainy_hotpot';
    if (Array.isArray(restaurant.moodIds) && restaurant.moodIds.includes(moodId)) {
      score += 15;
    } else {
      score += 6;
    }

    return Math.max(0, Math.min(50, score));
  }

  // 5. CÔNG THỨC CHẤM ĐIỂM TỔNG HỢP (HYBRID SCORING: 50% Ngữ Cảnh - 40% Gu Cá Nhân - 10% Độ Uy Tín)
  calculatePersonalScore(restaurant, context = null) {
    if (!restaurant) return 50;

    // 1. Điểm Ngữ cảnh (0 - 50 điểm)
    const contextScore = this.getContextScore(restaurant, context);

    // 2. Điểm Gu cá nhân (0 - 40 điểm, chuẩn hóa [-20, 40])
    let tasteScore = 0;
    const { categories, flavors } = this.extractFoodProfileFeatures(restaurant);
    categories.forEach(cat => {
      tasteScore += (this.profile.categories[cat] || 0);
    });
    flavors.forEach(flav => {
      tasteScore += (this.profile.flavors[flav] || 0) * 0.5;
    });
    // Chuẩn hóa tasteScore về khoảng [-20, 40] để không lấn át hoàn toàn ngữ cảnh
    tasteScore = Math.max(-20, Math.min(40, tasteScore));

    // 3. Điểm Độ uy tín & Khoảng cách (0 - 10 điểm)
    const maxDist = this.profile.max_distance_km || 3.5;
    const dist = typeof restaurant.distance === 'number' ? restaurant.distance : 2.0;
    const distancePenalty = dist > maxDist ? -15 : 0;
    const popularityScore = Math.min(10, Math.max(0, (restaurant.rating ? restaurant.rating * 2 : 7)));

    // 4. Điểm Phạt chống lặp lại (Cooldown)
    const cooldownPenalty = this.getCooldownPenalty(restaurant.id);

    const total = contextScore + tasteScore + popularityScore + distancePenalty + cooldownPenalty;
    return Math.max(0, Math.round(total));
  }

  // 6. QUY TẮC 80/20: 80% CHUẨN GU & 20% KHÁM PHÁ (Tránh "Bong bóng lọc")
  rankAndMixFoods(foods, context = null) {
    if (!Array.isArray(foods) || foods.length === 0) return [];

    // Chấm điểm cho toàn bộ quán
    const scoredFoods = foods.map(f => ({
      food: f,
      personalScore: this.calculatePersonalScore(f, context)
    }));

    // Sắp xếp giảm dần theo điểm cá nhân hóa
    scoredFoods.sort((a, b) => b.personalScore - a.personalScore);

    const tastePool = scoredFoods.map(s => s.food);
    const interactedIds = new Set(Object.keys(this.profile.recent_interacted || {}));

    // Pool Khám Phá (Exploration): quán mở cửa, rating >= 4.5 hoặc là đặc sản, chưa từng tương tác gần đây
    const explorePool = foods.filter(f => {
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(f) : { isOpen: true };
      const fid = String(f.id);
      return status.isOpen && !interactedIds.has(fid) && (f.rating >= 4.5 || f.isSpecialty);
    });

    const result = [];
    const usedIds = new Set();
    let tasteIdx = 0;
    let exploreIdx = 0;

    while (tasteIdx < tastePool.length || exploreIdx < explorePool.length) {
      // Lấy 4 thẻ Chuẩn Gu cao nhất
      for (let i = 0; i < 4 && tasteIdx < tastePool.length; i++) {
        const item = tastePool[tasteIdx++];
        const fid = String(item.id);
        if (!usedIds.has(fid)) {
          usedIds.add(fid);
          result.push(item);
        }
      }

      // Chèn 1 thẻ Khám Phá (sau mỗi 4 thẻ Chuẩn Gu)
      while (exploreIdx < explorePool.length && usedIds.has(String(explorePool[exploreIdx].id))) {
        exploreIdx++;
      }
      if (exploreIdx < explorePool.length) {
        const expItem = explorePool[exploreIdx++];
        const fid = String(expItem.id);
        usedIds.add(fid);
        result.push({
          ...expItem,
          _isExploration: true
        });
      }
    }

    return result;
  }

  // 7. XỬ LÝ NGƯỜI DÙNG MỚI (COLD START: Popup 5 giây "Chọn 3 món bạn không thể chối từ")
  checkColdStart() {
    const isDone = localStorage.getItem('foodtinder_cold_start_done');
    if (!isDone) {
      setTimeout(() => {
        this.openColdStartModal();
      }, 700);
    }
  }

  openColdStartModal() {
    const modal = document.getElementById('cold-start-modal');
    if (modal) {
      this.selectedColdStartCategories.clear();
      this.updateColdStartCounter();
      modal.classList.remove('hidden');
    }
  }

  closeColdStartModal() {
    const modal = document.getElementById('cold-start-modal');
    if (modal) modal.classList.add('hidden');
  }

  toggleColdStartOption(cat, el) {
    if (!cat) return;
    window.soundFX && window.soundFX.playPop();

    if (this.selectedColdStartCategories.has(cat)) {
      this.selectedColdStartCategories.delete(cat);
      el.classList.remove('border-[#EE4D2D]', 'bg-orange-50/90', 'shadow-xs');
      el.classList.add('border-stone-200', 'bg-stone-50');
    } else {
      if (this.selectedColdStartCategories.size >= 3) {
        if (window.app && window.app.showToast) {
          window.app.showToast('Bạn đã chọn đủ 3 món yêu thích nhất!');
        }
        return;
      }
      this.selectedColdStartCategories.add(cat);
      el.classList.remove('border-stone-200', 'bg-stone-50');
      el.classList.add('border-[#EE4D2D]', 'bg-orange-50/90', 'shadow-xs');
    }

    this.updateColdStartCounter();
  }

  updateColdStartCounter() {
    const countEl = document.getElementById('cold-start-counter');
    if (countEl) {
      const size = this.selectedColdStartCategories.size;
      countEl.innerHTML = `Đã chọn: <b class="text-orange-600">${size}/3</b> món`;
    }
  }

  submitColdStart() {
    window.soundFX && window.soundFX.playSuccess();
    // Gán ngay +10 điểm cho mỗi danh mục đã chọn
    this.selectedColdStartCategories.forEach(cat => {
      this.profile.categories[cat] = (this.profile.categories[cat] || 0) + 10;
    });

    localStorage.setItem('foodtinder_cold_start_done', 'true');
    this.saveProfile();
    this.closeColdStartModal();

    // Làm mới luồng Quẹt món và Tab Chuẩn Gu với gu mới
    if (window.swipeManager && typeof window.swipeManager.loadCards === 'function') {
      window.swipeManager.loadCards();
    }
    this.renderLocationRecommendations();

    if (window.app && window.app.showToast) {
      window.app.showToast('🚀 Đã thiết lập hồ sơ khẩu vị thành công!');
    }
  }

  skipColdStart() {
    window.soundFX && window.soundFX.playPop();
    localStorage.setItem('foodtinder_cold_start_done', 'true');
    this.closeColdStartModal();

    // Chuyển 100% trọng số sang ngữ cảnh + rating cao nhất
    if (window.swipeManager && typeof window.swipeManager.loadCards === 'function') {
      window.swipeManager.loadCards();
    }
    this.renderLocationRecommendations();
  }

  // Calculate Match Percentage (65% to 99%)
  calculateMatchScore(food, currentMoodId = '') {
    if (!food) return 70;
    if (typeof window.classifyFood === 'function') {
      window.classifyFood(food);
    }

    // 1. Kiểm tra ăn kiêng nghiêm ngặt (Dietary Restrictions)
    const prefs = this.userPreferences || this.loadUserPreferences();
    if (prefs) {
      const diets = Array.isArray(prefs.diets) ? prefs.diets : (prefs.diet ? [prefs.diet] : ['normal']);
      if (diets.includes('no_seafood') && this.isFoodSeafood(food)) return 30;
      if (diets.includes('no_pork')) {
        const isPork = /heo|lợn|sườn heo|ba chỉ|xá xíu|giò heo|chả lụa|nem chua|thịt kho tàu|lòng heo/i.test(food.name || '') ||
          (Array.isArray(food.tags) && food.tags.some(t => /heo|lợn|ba_chỉ|xá_xíu/i.test(t)));
        if (isPork) return 30;
      }
      if (diets.includes('vegetarian')) {
        const isVeg = food.category === 'vegetarian' || food.category === 'healthy' ||
          (Array.isArray(food.tags) && food.tags.some(t => /chay|nấm|salad|healthy/i.test(t))) ||
          /chay|nấm|đậu hũ/i.test(food.name || '');
        if (!isVeg) return 25;
      }
    }

    // 2. Sử dụng PersonalScore từ thuật toán Hybrid Scoring
    const pScore = this.calculatePersonalScore(food, { moodId: currentMoodId, now: new Date() });
    // Scale personalScore (0 - 100) về tỉ lệ phần trăm hiển thị trực quan [65% - 99%]
    const pct = Math.min(99, Math.max(65, Math.round(55 + (pScore * 0.44))));
    return pct;
  }

  // Generate customized reason for why this food was recommended
  generateMatchReason(food) {
    if (!food) return "Gợi ý được yêu thích nhất";

    const prefs = this.userPreferences || this.loadUserPreferences();
    if (prefs) {
      const foodName = (food.name || '').toLowerCase();
      const diets = Array.isArray(prefs.diets) ? prefs.diets : (prefs.diet ? [prefs.diet] : []);
      const foodAtmo = Array.isArray(food.atmospheres) ? food.atmospheres : [];
      const foodCuisines = Array.isArray(food.cuisineStyles) ? food.cuisineStyles : [];
      const foodMeals = Array.isArray(food.mealTimes) ? food.mealTimes : [];

      // 1. Chế độ ăn uống
      if (diets.includes('vegetarian') && (food.category === 'vegetarian' || food.category === 'healthy' || /chay|nấm/.test(foodName))) {
        return "Chuẩn theo chế độ ăn chay thanh đạm của bạn";
      }
      if (diets.includes('eatclean') && (food.category === 'healthy' || /clean|salad/.test(foodName))) {
        return "Chuẩn chế độ Eat Clean giữ dáng thanh lành";
      }

      // 2. Không gian & hình thức ưu tiên
      if (prefs.atmospheres?.includes('scenic_view') && foodAtmo.includes('scenic_view')) {
        return "View biển Quy Nhơn cực chill ngắm hoàng hôn";
      }
      if (prefs.atmospheres?.includes('delivery_fast') && foodAtmo.includes('delivery_fast')) {
        return "Giao tận nơi nhanh chóng qua ShopeeFood";
      }
      if (prefs.atmospheres?.includes('air_conditioned') && foodAtmo.includes('air_conditioned')) {
        return "Không gian máy lạnh mát mẻ & yên tĩnh";
      }
      if (prefs.atmospheres?.includes('gather_cheers') && foodAtmo.includes('gather_cheers')) {
        return "Quán nhậu & tụ tập bạn bè xôm tụ rôm rả";
      }

      // 3. Phong cách ẩm thực
      if (prefs.cuisineStyles?.includes('local_specialty') && foodCuisines.includes('local_specialty')) {
        return "Đặc sản bản địa trứ danh chuẩn vị truyền thống";
      }
      if (prefs.cuisineStyles?.includes('asian') && foodCuisines.includes('asian')) {
        return "Chuẩn ẩm thực Á Đông (Hàn - Nhật - Thái) bạn mê";
      }
      if (prefs.cuisineStyles?.includes('western_fastfood') && foodCuisines.includes('western_fastfood')) {
        return "Món Tây & Fast Food tiện lợi ngon miệng";
      }

      // 4. Bữa ăn & Thời điểm
      if (prefs.mealTimes?.includes('late_night') && foodMeals.includes('late_night')) {
        return "Cú đêm mở muộn chuẩn gu ăn khuya sau 22h";
      }
      if (prefs.mealTimes?.includes('breakfast') && foodMeals.includes('breakfast')) {
        return "Điểm tâm sáng ấm bụng đúng sở thích của bạn";
      }
      if (prefs.mealTimes?.includes('afternoon') && foodMeals.includes('afternoon')) {
        return "Bữa xế trà chiều giải nhiệt lai rai cực đã";
      }
      if (prefs.mealTimes?.includes('dinner') && foodMeals.includes('dinner')) {
        return "Bữa tối sum vầy ấm cúng chuẩn vị yêu thích";
      }
      if (prefs.mealTimes?.includes('lunch') && foodMeals.includes('lunch')) {
        return "Cơm trưa no nê chuẩn khẩu vị bạn đã chọn";
      }

      // 5. Nhóm món ăn yêu thích
      if (prefs.categories?.includes('noodles') && (food.category === 'noodles' || /phở|bún|mì|bánh canh/.test(foodName))) {
        return "Chuẩn gu món sợi & bún phở bạn đã chọn";
      }
      if (prefs.categories?.includes('seafood') && (food.category === 'seafood' || /hải sản|ốc/.test(foodName))) {
        return "Hợp gu hải sản & ốc tươi ngon bạn yêu thích";
      }
      if (prefs.categories?.includes('rice_chicken') && (food.category === 'rice' || /cơm|gà/.test(foodName))) {
        return "Chuẩn gu cơm tấm & cơm gà no bụng bạn yêu thích";
      }
      if (prefs.categories?.includes('streetfood') && (food.category === 'streetfood' || /bánh xèo|ăn vặt/.test(foodName))) {
        return "Chuẩn gu ăn vặt & ẩm thực đường phố của bạn";
      }

      // 6. Khẩu vị
      if (prefs.flavors?.includes('spicy') && (/cay/.test(foodName) || food.tags?.some(t => /cay/.test(t)))) {
        return "Đậm vị cay nồng chuẩn khẩu vị yêu thích của bạn";
      }
      if (prefs.flavors?.includes('mild_spicy') && !/siêu cay/.test(foodName)) {
        return "Vị cay vừa phải, hài hòa êm dịu đúng gu của bạn";
      }
      if (prefs.flavors?.includes('less_sweet') && (food.tags?.some(t => /thanh/.test(t)) || food.category === 'healthy')) {
        return "Vị thanh nhẹ ít ngọt đúng sở thích của bạn";
      }
      if (prefs.flavors?.includes('sour_fresh') && (/chua|me|gỏi/.test(foodName) || food.tags?.some(t => /chua/.test(t)))) {
        return "Vị chua ngọt thanh mát kích thích vị giác của bạn";
      }

      // 7. Bạn đồng hành
      if (prefs.companions?.includes('date_couple') && (food.companions || []).includes('date_couple')) {
        return "Không gian hẹn hò 2 người lãng mạn ấm cúng";
      }
      if (prefs.companions?.includes('group_family') && (food.companions || []).includes('group_family')) {
        return "Không gian rộng rãi lý tưởng cho nhóm & gia đình";
      }
    }

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
    const cId = (currentCity.cityId || '').toLowerCase();
    const cName = (currentCity.name || currentCity.city || '').toLowerCase();

    let cityFoods = APP_DATA.foods.filter(f => {
      if (window.isFakeDummyFood && window.isFakeDummyFood(f)) return false;
      const fCityId = (f.cityId || '').toLowerCase();
      const fCityName = (f.cityName || '').toLowerCase();
      const fAddress = (f.address || '').toLowerCase();

      // Nếu cả hai đều là Quy Nhơn / Bình Định
      const isQnCity = cId.includes('quynhon') || cId.includes('binhdinh') || cName.includes('quy nhơn') || cName.includes('bình định');
      const isQnFood = fCityId.includes('quynhon') || fCityId.includes('binhdinh') || fCityName.includes('quy nhơn') || fAddress.includes('quy nhơn') || fAddress.includes('bình định');
      if (isQnCity && isQnFood) return true;

      // Khớp chính xác cityId
      if (cId && fCityId && cId === fCityId) return true;

      // Khớp tên thành phố hoặc địa chỉ
      if (fCityName && cName && (fCityName.includes(cName) || cName.includes(fCityName))) return true;
      if (fAddress && cName && fAddress.includes(cName)) return true;

      return false;
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

    // Lọc bỏ các quán đã đóng cửa hoặc ngừng kinh doanh & quán không phù hợp với khẩu vị/kiêng khem
    const eligibleFoods = displayFoods.filter(f => {
      if (!f) return false;
      if (typeof window.isPermanentlyClosedRestaurant === 'function' && window.isPermanentlyClosedRestaurant(f)) return false;
      if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(f)) return false;
      if (!this.isFoodAllowedByPreferences(f)) return false;
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(f) : { isOpen: true };
      return Boolean(status && status.isOpen);
    });

    // Fallback thông minh: nếu bộ lọc kiêng khem quá ngặt nghèo khiến danh sách rỗng, giữ lại các quán chất lượng đang mở
    if (eligibleFoods.length > 0) {
      displayFoods = eligibleFoods;
    } else {
      displayFoods = displayFoods.filter(f => {
        if (!f) return false;
        if (typeof window.isPermanentlyClosedRestaurant === 'function' && window.isPermanentlyClosedRestaurant(f)) return false;
        if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(f)) return false;
        const status = window.getRestaurantStatus ? window.getRestaurantStatus(f) : { isOpen: true };
        return Boolean(status && status.isOpen);
      });
    }

    // Kiểm tra xem người dùng đang ở location hiện tại (nơi user đang ở) hay đã đổi sang tỉnh thành khác
    const homeCityId = (window.APP_DATA && window.APP_DATA.homeCityId) ? window.APP_DATA.homeCityId : 'quynhon';
    const isHomeLocation = (
      currentCity.cityId === homeCityId || 
      (currentCity.name && typeof currentCity.name === 'string' && currentCity.name.toLowerCase().includes('quy nhơn')) ||
      (currentCity.cityId && typeof currentCity.cityId === 'string' && currentCity.cityId.toLowerCase().includes('quynhon'))
    );

    // Hiển thị các quán chuẩn Gu (kết hợp Hybrid Scoring và quy tắc 80/20 Tránh bong bóng lọc)
    const rankedFoods = this.rankAndMixFoods(displayFoods, { moodId: currentMoodId, now: new Date() }).map(food => {
      const matchScore = this.calculateMatchScore(food, currentMoodId);
      const matchReason = this.generateMatchReason(food);
      return {
        ...food,
        matchScore,
        matchReason
      };
    });

    // 3. Sắp xếp giảm dần theo matchScore để quán 88%, 95% luôn nằm hàng đầu tiên (Fix Requirement 3)
    if (this.sortOrder === 'distance_asc') {
      rankedFoods.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (this.sortOrder === 'rating_desc') {
      rankedFoods.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Mặc định: Hợp Gu nhất (match_desc)
      rankedFoods.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    const totalCount = rankedFoods.length;
    const limit = this.visibleLimit || 40;
    const foodsToDisplay = rankedFoods.slice(0, limit);
    const hasMore = limit < totalCount;

    // Hàng 2: Dòng trạng thái gọn 1 dòng (thay cho cả Banner đỏ và Tiêu đề phụ)
    if (summaryTextEl) {
      const filterBadge = this.onlySpecialties 
        ? `<span class="inline-flex items-center gap-1 font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300 text-xs shadow-2xs shrink-0">🍲 Đang lọc: Đặc sản</span>`
        : '';

      if (totalCount > 0) {
        summaryTextEl.innerHTML = `
          <div class="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-bold text-stone-800">
            ${filterBadge}
            <span>🎯 Tìm thấy <strong class="text-rose-600 font-black">${totalCount}</strong> quán ${this.onlySpecialties ? 'đặc sản ' : ''}chuẩn Gu tại <strong class="text-stone-900">${currentCity.name}</strong> <span class="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[11px] sm:text-xs inline-flex items-center gap-1">🟢 Đang mở cửa</span></span>
          </div>
        `;
      } else {
        summaryTextEl.innerHTML = `
          <div class="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-bold text-stone-500">
            ${filterBadge}
            <span>Chưa tìm thấy quán ${this.onlySpecialties ? 'đặc sản ' : ''}nào phù hợp tại ${currentCity.name}.</span>
          </div>
        `;
      }
    }

    // Render cards (Lưới 3 cột thoáng, ảnh 16:10, gọn thông tin & nút bấm)
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
        const isTopMatch = idx === 0 && (this.sortOrder === 'match_desc' || !this.sortOrder);
        const status = window.getRestaurantStatus ? window.getRestaurantStatus(food) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
        const isLiked = (window.app && window.app.likedFoods) ? window.app.likedFoods.some(f => f.id === food.id) : false;
        const isWillReturn = (window.app && window.app.isFoodWillReturn) ? window.app.isFoodWillReturn(food.id) : false;
        const willReturnCount = (window.app && window.app.getWillReturnCount) ? window.app.getWillReturnCount(food.id) : 98;
        const compactPriceStr = this.compactPrice(food.priceRange);
        const distStr = food.distanceText ? food.distanceText.replace(/Cách bạn /i, '').trim() : `${food.distance || 1.2}km`;

        // Badge Hợp Gu: xanh lá nếu >75%, cam nếu 50-75%
        const matchBadgeColor = food.matchScore > 75 
          ? 'bg-emerald-600 text-white' 
          : (food.matchScore >= 50 ? 'bg-amber-600 text-white' : 'bg-stone-700/85 text-white');

        // Trạng thái mở cửa rút gọn
        const openStatusText = status.isOpen 
          ? (status.closeStr ? `Mở đến ${status.closeStr}` : 'Đang mở cửa') 
          : 'Đã đóng cửa';
        const openStatusColor = status.isOpen ? 'text-emerald-700' : 'text-rose-600';
        const openStatusDot = status.isOpen ? '🟢' : '🔴';

        return `
          <div class="taste-card ${status.isOpen ? '' : 'is-closed'} bg-white rounded-2xl border ${isTopMatch ? 'border-rose-300 ring-2 ring-rose-100 shadow-md' : 'border-stone-200/90 shadow-2xs'} overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <!-- Phần ảnh (Tỷ lệ 16:10) -->
              <div class="relative aspect-[16/10] overflow-hidden bg-stone-100 cursor-pointer" onclick="window.app.showFoodDetail(${food.id})">
                <img src="${food.image}" alt="${food.name}"
                  data-name="${food.name.replace(/"/g, '&quot;')}"
                  data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
                  data-category="${food.category || ''}"
                  onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${status.isOpen ? '' : 'is-closed-img grayscale'}" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                
                <!-- Góc trên trái: Badge Hợp Gu (đổi màu xanh lá nếu >75%, cam nếu 50–75%) -->
                <div class="absolute top-2.5 left-2.5 ${matchBadgeColor} font-black text-[10.5px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10">
                  <span>🎯 Hợp Gu ${food.matchScore}%</span>
                </div>

                <!-- Góc trên phải: ⭐ 4.8 -->
                <span class="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                  ⭐ ${window.formatRating ? window.formatRating(food.rating) : food.rating}
                </span>

                <!-- Góc dưới phải: Đưa badge khoảng cách lên góc ảnh (nền đen mờ) -->
                <span class="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                  <span>${distStr}</span>
                </span>
              </div>

              <!-- Phần thông tin (Tối đa 3 dòng gọn gàng) -->
              <div class="p-3.5 pb-2 space-y-1.5">
                <!-- Dòng 1: Tên quán (1 dòng, cắt ...) -->
                <h5 class="font-black text-sm text-stone-900 group-hover:text-rose-600 transition truncate cursor-pointer leading-tight" onclick="window.app.showFoodDetail(${food.id})" title="${food.restaurant}">
                  ${food.restaurant}
                </h5>

                <!-- Dòng 2: Địa chỉ ngắn (1 dòng) + nút icon bản đồ nhỏ -->
                <div class="flex items-center justify-between gap-1.5 text-[11px] text-stone-500">
                  <span class="truncate flex-1" title="${food.address || food.district || 'TP. Quy Nhơn'}">
                    📍 ${food.address || food.district || 'TP. Quy Nhơn'}
                  </span>
                  <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
                    class="inline-flex items-center justify-center w-5 h-5 text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded transition cursor-pointer shrink-0"
                    title="Xem quán trên bản đồ">
                    <svg class="w-3 h-3 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                      <line x1="9" y1="3" x2="9" y2="18"></line>
                      <line x1="15" y1="6" x2="15" y2="21"></line>
                    </svg>
                  </button>
                </div>

                <!-- Dòng 3 (Gom Giờ & Giá cùng 1 hàng): 🟢 Mở đến 13:30 • 35k – 65k -->
                <div class="flex items-center gap-1.5 text-[11px] font-bold mt-1 text-stone-700">
                  <span class="${openStatusColor} flex items-center gap-1 shrink-0">
                    <span>${openStatusDot}</span>
                    <span>${openStatusText}</span>
                  </span>
                  <span class="text-stone-300">•</span>
                  <span class="text-rose-600 font-extrabold truncate">${compactPriceStr}</span>
                </div>
              </div>
            </div>

            <!-- Phần đáy thẻ (Footer — 1 hàng duy nhất, không vỡ dòng) -->
            <div class="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-stone-100/80">
              <!-- Dòng nhỏ phía trên: 😋 28 khách sẽ quay lại -->
              <button onclick="event.stopPropagation();window.app.toggleWillReturn(${food.id})"
                data-will-return-btn="${food.id}"
                class="w-full py-1 px-2 ${isWillReturn ? 'bg-amber-500 text-white shadow-xs' : 'bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 border border-amber-200/60'} rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition active:scale-95 cursor-pointer">
                <span class="text-sm leading-none shrink-0 inline-block">😋</span>
                <span class="text-[10.5px] font-extrabold whitespace-nowrap"><span data-will-return-count="${food.id}">${willReturnCount}</span> khách sẽ quay lại</span>
              </button>

              <!-- Thanh nút bấm: [ ❤️ ] [ 📍 ] [ 🧡 Đặt ShopeeFood ] (flex-1 whitespace-nowrap) -->
              <div class="flex items-center gap-1.5">
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

                <!-- 3. Đặt ShopeeFood hoặc Xem đường đi (flex-1 whitespace-nowrap) -->
                ${(window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : (food.hasShopeeDelivery === true)) ? (
                  status.isOpen ? `
                  <button onclick="event.stopPropagation();window.app.openShopeeFoodDelivery(${food.id})"
                    class="flex-1 h-8 px-2 whitespace-nowrap bg-gradient-to-r from-orange-500 to-[#EE4D2D] hover:from-orange-600 hover:to-[#D73211] text-white rounded-xl text-[11px] font-black shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                    title="Đặt món qua ShopeeFood">
                    ${window.getShopeeIcon ? window.getShopeeIcon(17, 'shrink-0') : ''}
                    <span>Đặt ShopeeFood</span>
                  </button>
                  ` : `
                  <button disabled
                    class="flex-1 h-8 px-2 whitespace-nowrap bg-stone-100 border border-stone-200 text-stone-400 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60 pointer-events-none select-none"
                    title="Quán hiện đã đóng cửa">
                    ${window.getShopeeIcon ? window.getShopeeIcon(17, 'shrink-0 filter grayscale opacity-50') : ''}
                    <span>ShopeeFood</span>
                  </button>
                  `
                ) : `
                <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
                  class="flex-1 h-8 px-2 whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  title="Đến quán thưởng thức trực tiếp">
                  <span>Xem đường đi</span>
                </button>
                `}
              </div>
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
    // Mở trực tiếp bộ thiết lập Gu ẩm thực cá nhân trực quan
    if (window.authManager && typeof window.authManager.openTasteOnboardingModal === 'function') {
      window.authManager.openTasteOnboardingModal();
      return;
    }
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
