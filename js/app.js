// Main Application Controller (FoodTinder / FoodFinder)

class FoodApp {
  constructor() {
    this.currentTab = 'home';
    this.likedFoods = [];
    this.willReturnFoods = [];
    this.currentMood = APP_DATA.currentMoodId;
    this.isPhoneFrame = true;
  }

  init() {
    // Load liked from localStorage if available
    try {
      const saved = localStorage.getItem('foodtinder_liked');
      if (saved) {
        this.likedFoods = JSON.parse(saved);
      }
    } catch (e) {}

    // Load will_return from localStorage
    try {
      const savedReturn = localStorage.getItem('foodtinder_will_return');
      if (savedReturn) {
        this.willReturnFoods = JSON.parse(savedReturn);
      }
    } catch (e) {}

    // Initialize components
    this.renderHeader();
    this.renderMoodSelector();
    this.renderBentoAndFeed();
    this.renderFoodGrid();
    this.updateBentoStats();
    this.renderMiniMap();
    this.renderNearbyGrid();
    this.renderFoodGrid();
    this.updateBentoStats();

    // Init Swipe Manager
    if (!window.swipeManager && typeof TinderSwipeManager !== 'undefined') {
      window.swipeManager = new TinderSwipeManager('swipe-deck-container');
    }
    if (window.swipeManager) {
      const moodFoods = this.getFoodsForCurrentMood();
      window.swipeManager.loadCards(moodFoods.length > 0 ? moodFoods : (APP_DATA.foods || []));
    }

    // Init Reels
    if (window.reelsManager) {
      window.reelsManager.init();
    }

    // Init Chat
    if (window.chatManager) {
      window.chatManager.init();
    }

    // Init Personalized Taste Engine & Location Recommendations
    if (window.tasteManager) {
      window.tasteManager.syncFromLikedFoods(this.likedFoods);
      window.tasteManager.renderLocationRecommendations();
    }

    // Bind event listeners
    this.bindEvents();

    // Update icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  getFoodsForCurrentMood() {
    return APP_DATA.foods.filter(f => f.moodIds.includes(this.currentMood));
  }

  renderHeader() {
    const city = APP_DATA.currentCity;
    const weather = city.weather;

    // Sidebar greeting
    const greetingEl = document.getElementById('header-greeting');
    if (greetingEl) {
      greetingEl.innerHTML = `
        <div class="flex items-center gap-1.5 font-extrabold text-stone-900 text-sm leading-tight">
          <span>Chào Bạn!</span>
          <span class="inline-block animate-wave text-lg">👋</span>
        </div>
        <p class="text-xs text-stone-500 font-medium mt-0.5">${city.name} đang ${weather.condition.toLowerCase()} ${weather.temp} ${weather.icon}</p>
      `;
    }

    // Sidebar location
    const locationEl = document.getElementById('header-location');
    if (locationEl) {
      locationEl.innerHTML = `
        <div class="bg-[#FFF2EA] hover:bg-[#FFE6D9] border border-[#FFD8C2] rounded-xl px-3 py-2 cursor-pointer transition" onclick="window.app.openCityModal()">
          <span class="text-[10px] text-stone-400 block font-medium">Bạn đang ở:</span>
          <span class="text-xs font-bold text-stone-800 flex items-center gap-1 mt-0.5">
            <span class="truncate">${city.address}</span>
            <span class="text-rose-500">📍</span>
          </span>
        </div>
      `;
    }

    // Topbar weather chip
    const topbarIcon = document.getElementById('topbar-weather-icon');
    const topbarText = document.getElementById('topbar-weather-text');
    if (topbarIcon) topbarIcon.textContent = weather.icon;
    if (topbarText) topbarText.textContent = `${city.name} ${weather.temp}`;

    // Welcome banner subtitle
    const wSub = document.getElementById('welcome-subtitle');
    if (wSub) wSub.textContent = `${city.name} đang ${weather.condition.toLowerCase()} ${weather.temp} ${weather.icon} — ăn gì cho ấm?`;

    // Bento weather
    const bIcon = document.getElementById('bento-weather-icon');
    const bTemp = document.getElementById('bento-weather-temp');
    const bCity = document.getElementById('bento-weather-city');
    const bCond = document.getElementById('bento-weather-cond');
    if (bIcon) bIcon.textContent = weather.icon;
    if (bTemp) bTemp.textContent = weather.temp;
    if (bCity) bCity.textContent = city.name;
    if (bCond) bCond.textContent = weather.condition;
  }

  renderMoodSelector() {
    const container = document.getElementById('mood-selector-container');
    if (!container) return;

    if (this.isMoodsExpanded === undefined) {
      this.isMoodsExpanded = false;
    }

    const INITIAL_COUNT = 6;
    const moodsToShow = this.isMoodsExpanded 
      ? APP_DATA.moods 
      : APP_DATA.moods.slice(0, INITIAL_COUNT);
    const hasMore = APP_DATA.moods.length > INITIAL_COUNT;

    container.innerHTML = `
      <div class="flex items-center justify-between mb-2.5 px-0.5">
        <div class="flex items-center gap-1.5">
          <span class="text-xs">✨</span>
          <span class="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider">Tâm trạng hôm nay</span>
        </div>
        <button onclick="window.app.switchTab('chat')" class="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full transition shadow-xs" title="Chat với AI gợi ý món">
          <span>Hỏi AI</span> <span>🤖</span>
        </button>
      </div>

      <!-- 3-column Grid for moods: clean, responsive, no horizontal scroll bugs -->
      <div class="grid grid-cols-3 gap-2">
        ${moodsToShow.map(m => {
          const isSelected = m.id === this.currentMood;
          return `
            <button onclick="window.app.setMood('${m.id}')" 
              class="mood-btn flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-200 ${
                isSelected 
                  ? 'bg-white border-[#FF6584] shadow-md shadow-rose-200/60 ring-2 ring-[#FF6584]/25 scale-[1.02]' 
                  : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300 hover:shadow-xs'
              }"
              title="${m.label} - ${m.desc}">
              <span class="text-xl mb-0.5 filter drop-shadow-xs transition-transform duration-200 ${isSelected ? 'scale-110' : ''}">
                ${m.emoji}
              </span>
              <span class="text-[10px] font-bold leading-tight text-center truncate w-full px-0.5 ${isSelected ? 'text-[#FF4757]' : 'text-stone-700'}">
                ${m.label}
              </span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Toggle More/Less Button -->
      ${hasMore ? `
        <button onclick="window.app.toggleMoodsExpand()" 
          class="w-full mt-2.5 py-1.5 px-3 bg-stone-100/80 hover:bg-rose-50 hover:text-rose-600 text-stone-600 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all border border-stone-200/60">
          <span>${this.isMoodsExpanded ? 'Thu gọn ▴' : `Xem thêm (+${APP_DATA.moods.length - INITIAL_COUNT} tâm trạng khác) ▾`}</span>
        </button>
      ` : ''}
    `;
  }

  toggleMoodsExpand() {
    window.soundFX && window.soundFX.playPop();
    this.isMoodsExpanded = !this.isMoodsExpanded;
    this.renderMoodSelector();
  }

  renderMiniMap() {
    const container = document.getElementById('mini-map-card');
    if (!container) return;

    const city = APP_DATA.currentCity;
    const sortedFoods = [...APP_DATA.foods].sort((a, b) => a.distance - b.distance);
    const pin1 = sortedFoods[0] || APP_DATA.foods[0];
    const pin2 = sortedFoods[1] || APP_DATA.foods[1];

    container.innerHTML = `
      <div class="relative w-full h-36 rounded-2xl overflow-hidden border border-sky-200/80 shadow-xs bg-slate-100 group">
        <!-- Real Leaflet Mini Map Container -->
        <div id="mini-leaflet-map" class="absolute inset-0 z-0"></div>

        <!-- Subtle Top & Bottom Vignette Overlays for contrast -->
        <div class="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/25 via-black/10 to-transparent pointer-events-none z-10"></div>
        <div class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/35 via-black/15 to-transparent pointer-events-none z-10"></div>

        <!-- Top Floating Header -->
        <div class="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-auto">
          <div class="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-sky-100 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[9.5px] font-extrabold text-stone-700 whitespace-nowrap">Gần bạn: ${sortedFoods.length} quán</span>
          </div>
          <button onclick="window.app.switchTab('map')" class="bg-white/95 backdrop-blur-md hover:bg-rose-500 hover:text-white text-blue-600 border border-sky-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 transition-all hover:scale-105 active:scale-95 whitespace-nowrap group/btn" title="Mở bản đồ lớn">
            <svg class="w-3 h-3 text-blue-600 group-hover/btn:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              <line x1="9" y1="3" x2="9" y2="18"></line>
              <line x1="15" y1="6" x2="15" y2="21"></line>
            </svg>
            <span class="whitespace-nowrap">Bản đồ lớn ↗</span>
          </button>
        </div>

        <!-- Bottom Quick Chips -->
        <div class="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between gap-1.5 pointer-events-auto">
          <div onclick="window.app.openMapWithFood(${pin1.id})" 
            class="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-rose-300 px-2 py-0.5 rounded-full shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition truncate max-w-[48%]"
            title="${pin1.name} (${pin1.distanceText})">
            <span class="text-rose-500 font-bold text-[10px]">📍</span>
            <div class="text-[9px] font-bold text-stone-800 leading-tight truncate">
              <div class="truncate">#${pin1.name.split(' ')[0]} ${pin1.name.split(' ')[1] || ''}</div>
              <div class="text-stone-400 font-normal text-[8px]">${pin1.distanceText.replace('Cách bạn ', '')}</div>
            </div>
          </div>

          <div onclick="window.app.openMapWithFood(${pin2.id})" 
            class="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-amber-300 px-2 py-0.5 rounded-full shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition truncate max-w-[48%]"
            title="${pin2.name} (${pin2.distanceText})">
            <span class="text-amber-500 font-bold text-[10px]">📍</span>
            <div class="text-[9px] font-bold text-stone-800 leading-tight truncate">
              <div class="truncate">#${pin2.name.split(' ')[0]} ${pin2.name.split(' ')[1] || ''}</div>
              <div class="text-stone-400 font-normal text-[8px]">${pin2.distanceText.replace('Cách bạn ', '')}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize the real Leaflet mini map
    this.initMiniLeafletMap();
  }

  initMiniLeafletMap() {
    const el = document.getElementById('mini-leaflet-map');
    if (!el || typeof L === 'undefined') return;

    if (this.miniMapInstance) {
      try {
        this.miniMapInstance.remove();
      } catch (e) {}
      this.miniMapInstance = null;
    }

    const city = APP_DATA.currentCity;

    try {
      this.miniMapInstance = L.map('mini-leaflet-map', {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: false,
        doubleClickZoom: false
      }).setView([city.lat, city.lng], 14);

      // CartoDB Voyager tiles (crisp, elegant, fast)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(this.miniMapInstance);

      // User location pulsing marker
      const userIcon = L.divIcon({
        className: 'user-mini-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 bg-blue-500/35 rounded-full animate-ping absolute"></div>
            <div class="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([city.lat, city.lng], { icon: userIcon }).addTo(this.miniMapInstance);

      // Top 5 nearby food markers
      const sortedFoods = [...APP_DATA.foods].sort((a, b) => a.distance - b.distance).slice(0, 5);
      sortedFoods.forEach((food, idx) => {
        const isPrimary = idx === 0;
        const foodIcon = L.divIcon({
          className: 'food-mini-marker',
          html: `
            <div class="cursor-pointer hover:scale-125 transition-transform" onclick="window.app.openMapWithFood(${food.id})" title="${food.name} - ${food.distanceText}">
              <div class="w-5 h-5 ${isPrimary ? 'bg-rose-500 ring-2 ring-rose-200' : 'bg-amber-500'} rounded-full border border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
                🍽️
              </div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        L.marker([food.lat, food.lng], { icon: foodIcon }).addTo(this.miniMapInstance);
      });

      // Recalculate dimensions after DOM renders
      setTimeout(() => {
        if (this.miniMapInstance) {
          this.miniMapInstance.invalidateSize();
        }
      }, 250);

    } catch (e) {
      console.warn("Mini Leaflet map error:", e);
    }
  }

  renderBentoAndFeed() {
    const featuredFood = this.getFoodsForCurrentMood()[0] || APP_DATA.foods[0];
    const container = document.getElementById('featured-card-container');
    if (!container) return;

    const featuredStatus = window.getRestaurantStatus ? window.getRestaurantStatus(featuredFood.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };

    // Featured Food Card matching Image 2 ("Lẩu Thái Chua Cay - Quán cô Vy")
    container.innerHTML = `
      <div class="relative w-full rounded-[26px] bg-white border border-[#EFE5DB] shadow-md overflow-hidden transition-all hover:shadow-lg ${featuredStatus.isOpen ? '' : 'is-closed'}">
        <!-- Side Tag Ribbon (Vertical text or Left badges matching Image 2) -->
        <div class="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          <span class="bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
            #Xả_stress
          </span>
          <span class="bg-[#FFF4ED] text-[#E65100] font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-[#FFE0B2] shadow-sm">
            #Ấm_áp
          </span>
        </div>

        <!-- Open / Close Status Badge top-right -->
        <div class="absolute top-3 right-3 z-20">
          ${featuredStatus.isOpen ? `
            <span class="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-emerald-400/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
              <span>Đang mở cửa</span>
            </span>
          ` : `
            <span class="bg-stone-900/90 backdrop-blur-xs text-stone-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-stone-600">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Đã đóng cửa</span>
            </span>
          `}
        </div>

        <!-- Food Image -->
        <div class="relative w-full h-52 bg-stone-100 overflow-hidden cursor-pointer" onclick="window.app.showFoodDetail(${featuredFood.id})">
          <img src="${featuredFood.image}" alt="${featuredFood.name}"
            data-name="${featuredFood.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(featuredFood.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${featuredFood.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${featuredFood.name.replace(/'/g, "\\'")}', '${(featuredFood.restaurant || '').replace(/'/g, "\\'")}', '${featuredFood.category || ''}')"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${featuredStatus.isOpen ? '' : 'is-closed-img'}" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <!-- Image overlay info -->
          <div class="absolute bottom-3 left-4 right-4 text-white">
            <h3 class="font-extrabold text-lg text-white leading-tight drop-shadow-md">${featuredFood.name}</h3>
            <p class="text-xs text-stone-200 mt-0.5 font-medium drop-shadow-sm flex items-center gap-1.5 flex-wrap">
              <span>${featuredFood.restaurant} <span class="text-amber-300">(${featuredFood.distanceText})</span></span>
              <span>•</span>
              <span class="${featuredStatus.isOpen ? 'text-emerald-300' : 'text-stone-300'} font-semibold">🕒 ${featuredFood.openTime} (${featuredStatus.detailText})</span>
            </p>
          </div>
        </div>

        <!-- Action Row & Context Badge matching Image 2 -->
        <div class="p-3.5 bg-white">
          <!-- Emotion Context Badge -->
          <div class="bg-[#FFF8F2] border border-[#FFEAD8] rounded-xl p-2.5 flex items-start gap-2 mb-3">
            <span class="text-base leading-none">✨</span>
            <p class="text-xs text-[#8D4D24] font-medium leading-relaxed">
              ${featuredFood.recommendReason}
            </p>
          </div>

          <!-- Action Buttons: "❤️ Yêu thích", "🛵 Đặt ShopeeFood", "✕ Bỏ qua", "Trợ lý 💬" -->
          <div class="flex items-center gap-1.5">
            <button onclick="window.app.addLikedFood(APP_DATA.foods.find(f => f.id === ${featuredFood.id}))" 
              class="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer">
              <span>❤️</span> <span>Thích</span>
            </button>

            <button onclick="window.app.openShopeeFoodDelivery(${featuredFood.id})" 
              class="py-2.5 px-3 bg-gradient-to-r from-orange-500 to-[#EE4D2D] hover:from-orange-600 hover:to-[#D73211] text-white rounded-xl font-extrabold text-xs shadow-md shadow-orange-300 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer">
              ${window.getShopeeIcon ? window.getShopeeIcon(16, 'rounded-xs shrink-0') : ''}
              <span>ShopeeFood</span>
            </button>

            <button onclick="window.app.skipFeaturedFood()" 
              class="py-2.5 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-semibold text-xs transition active:scale-95 flex items-center justify-center gap-1">
              <span>✕</span>
            </button>

            <button onclick="window.app.switchTab('chat')" 
              class="py-2.5 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-semibold text-xs transition active:scale-95 flex items-center justify-center gap-1">
              <span>💬</span>
            </button>
          </div>
        </div>

        <!-- Pagination Dots -->
        <div class="flex justify-center gap-1.5 pb-2.5">
          <span class="w-4 h-1.5 bg-[#FF6584] rounded-full"></span>
          <span class="w-1.5 h-1.5 bg-stone-200 rounded-full"></span>
          <span class="w-1.5 h-1.5 bg-stone-200 rounded-full"></span>
        </div>
      </div>
    `;

    // Bento Grid Section matching Image 1 View 5
    const bentoContainer = document.getElementById('bento-grid-container');
    if (bentoContainer) {
      const moodObj = APP_DATA.moods.find(m => m.id === this.currentMood) || APP_DATA.moods[1];
      const weather = APP_DATA.currentCity.weather;

      bentoContainer.innerHTML = `
        <div class="flex items-center justify-between mb-2 px-1">
          <h4 class="font-extrabold text-stone-900 text-sm tracking-tight">Trang Chủ Bento</h4>
          <span class="text-xs text-stone-400 font-medium">Cá nhân hóa theo ngày</span>
        </div>

        <div class="grid grid-cols-2 gap-2.5 mb-3">
          <!-- Widget 1: Weather (Light blue) -->
          <div onclick="window.app.openCityModal()" class="bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-2xl p-3 shadow-sm cursor-pointer hover:opacity-95 transition flex flex-col justify-between h-24">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-semibold text-sky-100 uppercase tracking-wider">${APP_DATA.currentCity.name}</span>
                <div class="text-xl font-extrabold">${weather.temp}</div>
              </div>
              <span class="text-3xl">${weather.icon}</span>
            </div>
            <p class="text-[11px] text-sky-100 font-medium truncate">${weather.condition}</p>
          </div>

          <!-- Widget 2: Mood (Peach / Rose) -->
          <div onclick="window.app.switchTab('chat')" class="bg-gradient-to-br from-[#FFE3E3] to-[#FFD5CC] border border-[#FFCCD2] text-stone-800 rounded-2xl p-3 shadow-sm cursor-pointer hover:opacity-95 transition flex flex-col justify-between h-24">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Tâm trạng</span>
                <div class="text-sm font-extrabold text-stone-900 mt-0.5">${moodObj.label}</div>
              </div>
              <span class="text-2xl">${moodObj.emoji}</span>
            </div>
            <p class="text-[10px] text-rose-700 font-semibold truncate">Gợi ý món ăn vỗ về ✨</p>
          </div>
        </div>

        <!-- Bento Grid "Gợi ý cho bạn" matching Image 1 View 5 -->
        <div>
          <div class="flex items-center justify-between mb-2 px-1">
            <h5 class="font-bold text-xs text-stone-800">Gợi ý cho bạn</h5>
            <span class="text-[11px] text-stone-400">Dựa trên cảm xúc</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            ${APP_DATA.foods.slice(2, 4).map(f => {
              const fStatus = window.getRestaurantStatus ? window.getRestaurantStatus(f.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
              return `
              <div onclick="window.app.showFoodDetail(${f.id})" class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer ${fStatus.isOpen ? '' : 'is-closed'}">
                <div class="relative w-full h-24 bg-stone-100">
                  <img src="${f.image}" alt="${f.name}"
                    data-name="${f.name.replace(/"/g, '&quot;')}"
                    data-restaurant="${(f.restaurant || '').replace(/"/g, '&quot;')}"
                    data-category="${f.category || ''}"
                    onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${f.name.replace(/'/g, "\\'")}', '${(f.restaurant || '').replace(/'/g, "\\'")}', '${f.category || ''}')"
                    class="w-full h-full object-cover ${fStatus.isOpen ? '' : 'is-closed-img'}" />
                  <span class="absolute top-1.5 left-1.5 ${fStatus.isOpen ? 'bg-emerald-600/90 text-white' : 'bg-stone-900/90 text-stone-200'} text-[8.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-xs">
                    <span class="w-1.5 h-1.5 rounded-full ${fStatus.isOpen ? 'bg-emerald-200' : 'bg-rose-500 animate-pulse'}"></span>
                    ${fStatus.statusText}
                  </span>
                  <span class="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    📍 ${f.distanceText.replace('Cách bạn ', '')}
                  </span>
                </div>
                <div class="p-2.5">
                  <span class="bg-[#FFF4ED] text-[#E65100] text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                    ${f.tags[0]}
                  </span>
                  <h6 class="font-bold text-xs text-stone-800 truncate">${f.name}</h6>
                  <p class="text-[10px] text-stone-400 truncate mt-0.5">${f.restaurant}</p>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();

    // Also render nearby grid and full food grid for web layout
    this.renderNearbyGrid();
    this.renderFoodGrid();
    this.updateBentoStats();
  }

  updateBentoStats() {
    const moodObj = APP_DATA.moods.find(m => m.id === this.currentMood) || APP_DATA.moods[1];
    const emojiEl  = document.getElementById('bento-mood-emoji');
    const labelEl  = document.getElementById('bento-mood-label');
    const likedEl  = document.getElementById('bento-liked-count');
    const statEl   = document.getElementById('stat-liked');
    if (emojiEl)  emojiEl.textContent  = moodObj.emoji;
    if (labelEl)  labelEl.textContent  = moodObj.label;
    if (likedEl)  likedEl.textContent  = this.likedFoods.length;
    if (statEl)   statEl.textContent   = this.likedFoods.length;
  }

  renderNearbyGrid() {
    const container = document.getElementById('nearby-grid');
    if (!container) return;
    const sorted = [...APP_DATA.foods].sort((a, b) => a.distance - b.distance).slice(0, 4);
    container.innerHTML = sorted.map(food => {
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
    const isLiked = this.likedFoods.some(f => f.id === food.id);
    const isWillReturn = this.isFoodWillReturn(food.id);
    const willReturnCount = this.getWillReturnCount(food.id);
      return `
      <div onclick="window.app.showFoodDetail(${food.id})" class="food-card ${status.isOpen ? '' : 'is-closed'} cursor-pointer">
        <div class="relative h-24 overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}"
            data-name="${food.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="w-full h-full object-cover ${status.isOpen ? '' : 'is-closed-img'}" />
          <!-- Status Badge -->
          <span class="absolute top-1.5 left-1.5 ${status.isOpen ? 'bg-emerald-600/90 text-white border-emerald-400/40' : 'bg-stone-900/90 text-stone-200 border-stone-600'} border text-[8.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-xs">
            <span class="w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-200' : 'bg-rose-500 animate-pulse'}"></span>
            ${status.statusText}
          </span>
          <span class="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
            📍 ${food.distanceText.replace('Cách bạn ', '')}
          </span>
        </div>
        <div class="p-2.5">
          <h6 class="font-bold text-xs text-stone-800 truncate">${food.name}</h6>
          <p class="text-[10px] text-stone-500 truncate mt-0.5">${food.restaurant}</p>
          <div class="flex items-center justify-between text-[10px] mt-1">
            <span class="font-bold text-rose-500">${food.priceRange.split(' - ')[0]}</span>
            <span class="${status.isOpen ? 'text-emerald-600 font-semibold' : 'text-stone-400'} text-[9px]">${status.detailText}</span>
          </div>
          <div class="mt-1.5 flex gap-1">
            <button onclick="event.stopPropagation();window.app.openShopeeFoodDelivery(${food.id})"
              class="w-full py-1 bg-gradient-to-r from-orange-500 to-[#EE4D2D] hover:from-orange-600 hover:to-[#D73211] text-white text-[9.5px] font-bold rounded-md flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer">
              ${window.getShopeeIcon ? window.getShopeeIcon(13, 'rounded-xs shrink-0') : ''}
              <span>ShopeeFood</span>
            </button>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  renderFoodGrid() {
    const container = document.getElementById('food-grid');
    if (!container) return;
    const foods = this.getFoodsForCurrentMood().length > 0
      ? this.getFoodsForCurrentMood()
      : APP_DATA.foods;

    const countBadge = document.getElementById('food-grid-count-badge');
    if (countBadge) {
      countBadge.textContent = `${foods.length} quán Quy Nhơn`;
    }

    container.innerHTML = foods.map(food => {
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
      const isLiked = this.likedFoods.some(f => f.id === food.id);
      const isWillReturn = this.isFoodWillReturn(food.id);
      const willReturnCount = this.getWillReturnCount(food.id);

      return `
      <div onclick="window.app.showFoodDetail(${food.id})" class="food-card ${status.isOpen ? '' : 'is-closed'} cursor-pointer">
        <div class="relative h-32 overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}"
            data-name="${food.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${status.isOpen ? '' : 'is-closed-img'}" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none"></div>

          <!-- Open/Close Status Badge -->
          <div class="absolute top-2 left-2 z-10 flex items-center">
            ${status.isOpen ? `
              <span class="bg-emerald-600/90 backdrop-blur-xs text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-emerald-400/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
                <span>Đang mở</span>
              </span>
            ` : `
              <span class="bg-stone-900/90 backdrop-blur-xs text-stone-200 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-stone-600">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Đã đóng</span>
              </span>
            `}
          </div>

          <span class="absolute top-2 right-2 bg-black/50 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">⭐ ${window.formatRating ? window.formatRating(food.rating) : food.rating}</span>
        </div>
        <div class="p-3">
          <h6 class="font-bold text-xs text-stone-900 truncate mb-0.5">${food.name}</h6>
          <div class="flex items-center justify-between gap-1 mt-0.5">
            <p class="text-[10px] text-stone-500 truncate flex-1" title="${food.address || ''}">${food.restaurant} • ${food.district || 'Quy Nhơn'}</p>
            <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
              class="inline-flex items-center justify-center w-6 h-6 text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-md transition cursor-pointer shrink-0"
              title="Xem vị trí quán trên bản đồ">
              <svg class="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="18"></line>
                <line x1="15" y1="6" x2="15" y2="21"></line>
              </svg>
            </button>
          </div>

          <!-- Operating Hours & Status Note -->
          <div class="flex items-center gap-1 text-[10px] mt-1.5 ${status.isOpen ? 'text-emerald-700 font-semibold' : 'text-stone-500'}">
            <span>🕒 ${food.openTime}</span>
            <span class="${status.isOpen ? 'text-stone-400 font-normal' : 'text-rose-500 font-bold'}">(${status.detailText})</span>
          </div>

          <div class="flex items-center justify-between mt-1.5">
            <span class="text-[10px] font-bold text-rose-500">${food.priceRange.split(' - ')[0]}</span>
            <span class="text-[10px] text-stone-400 cursor-pointer hover:text-amber-600" onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})" title="Xem trên bản đồ">${food.distanceText.replace('Cách bạn ', '')}</span>
          </div>

          <!-- Dòng riêng: Chức năng sẽ quay lại [😋 142 khách sẽ quay lại] -->
          <div class="mt-2">
            <button onclick="event.stopPropagation();window.app.toggleWillReturn(${food.id})"
              data-will-return-btn="${food.id}"
              class="w-full py-1 px-2 ${isWillReturn ? 'bg-amber-500 text-white shadow-xs' : 'bg-gradient-to-r from-amber-50 to-orange-50/80 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-200/90'} rounded-lg flex items-center justify-center gap-1 text-[10.5px] font-bold transition active:scale-95 cursor-pointer"
              title="${isWillReturn ? 'Bạn đã chọn sẽ quay lại quán này! Bấm để bỏ chọn' : 'Đánh dấu bạn sẽ là khách quen quay lại quán này (' + willReturnCount + ' người đã chọn)'}">
              <span class="text-[16px] leading-none shrink-0 inline-block">😋</span>
              <span class="truncate whitespace-nowrap"><span data-will-return-count="${food.id}">${willReturnCount}</span> khách sẽ quay lại</span>
            </button>
          </div>

          <!-- Bottom Action Buttons: 1. Thích, 2. Bản đồ, 3. Đặt ShopeeFood -->
          <div class="mt-2 flex items-center gap-1.5">
            <!-- 1. Yêu thích (Chỉ icon) -->
            <button onclick="event.stopPropagation();window.app.toggleLikedFood(${food.id})"
              data-like-btn="${food.id}"
              class="w-8 h-7.5 ${isLiked ? 'bg-rose-500 text-white shadow-xs' : 'bg-rose-50 hover:bg-rose-100 text-rose-600'} rounded-lg flex items-center justify-center shrink-0 text-[10.5px] font-bold transition active:scale-95 cursor-pointer border border-rose-100"
              title="${isLiked ? 'Đã yêu thích (Bấm để bỏ)' : 'Yêu thích món này'}">
              <svg class="w-3.5 h-3.5 ${isLiked ? 'fill-white text-white' : 'text-rose-500'}" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>

            <!-- 2. Bản đồ (Chỉ icon) -->
            <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
              class="w-8 h-7.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 rounded-lg text-[10.5px] font-bold flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
              title="Xem vị trí trên bản đồ">
              <svg class="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="18"></line>
                <line x1="15" y1="6" x2="15" y2="21"></line>
              </svg>
            </button>

            <!-- 3. Đặt ShopeeFood (Nút chính bên phải) -->
            <button onclick="event.stopPropagation();window.app.openShopeeFoodDelivery(${food.id})"
              class="flex-1 h-7.5 bg-gradient-to-r from-orange-500 to-[#EE4D2D] hover:from-orange-600 hover:to-[#D73211] text-white rounded-lg text-[10.5px] font-extrabold shadow-sm shadow-orange-300/80 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Đặt món qua ShopeeFood">
              ${window.getShopeeIcon ? window.getShopeeIcon(14, 'rounded-xs shrink-0') : ''}
              <span>ShopeeFood</span>
            </button>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  setMood(moodId) {
    window.soundFX && window.soundFX.playPop();
    this.currentMood = moodId;
    APP_DATA.currentMoodId = moodId;

    // Keep expanded if selected mood is in the extended list
    const moodIndex = APP_DATA.moods.findIndex(m => m.id === moodId);
    if (moodIndex >= 6) {
      this.isMoodsExpanded = true;
    }

    this.renderMoodSelector();
    this.renderBentoAndFeed();
    this.renderFoodGrid();
    this.updateBentoStats();

    // Reload Swipe deck with items matching this mood
    if (window.swipeManager) {
      window.swipeManager.loadCards(this.getFoodsForCurrentMood());
    }

    // Refresh location & taste recommendations with new mood weighting
    if (window.tasteManager) {
      window.tasteManager.renderLocationRecommendations();
    }

    this.showToast(`Đã chọn tâm trạng: ${APP_DATA.moods.find(m => m.id === moodId)?.label}`);
  }

  skipFeaturedFood() {
    window.soundFX && window.soundFX.playSwipeLeft();
    // Rotate to next food
    const foods = this.getFoodsForCurrentMood();
    if (foods.length > 1) {
      const currentFirst = foods.shift();
      foods.push(currentFirst);
      this.renderBentoAndFeed();
    }
  }

  switchTab(tabName) {
    window.soundFX && window.soundFX.playPop();
    this.currentTab = tabName;

    // Handle view-specific initializations
    if (tabName === 'home') {
      setTimeout(() => {
        if (this.miniMapInstance) {
          this.miniMapInstance.invalidateSize();
        }
      }, 150);
    }
    if (tabName === 'liked') {
      this.renderLikedView();
    }
    if (tabName === 'map') {
      setTimeout(() => {
        if (window.mapManager) {
          window.mapManager.initMap();
          window.mapManager.renderBottomSheet();
          if (window.mapManager.map) {
            window.mapManager.map.invalidateSize();
          }
        }
      }, 100);
    } else if (tabName === 'swipe') {
      if (!window.swipeManager && typeof TinderSwipeManager !== 'undefined') {
        window.swipeManager = new TinderSwipeManager('swipe-deck-container');
      }
      if (window.swipeManager) {
        if (!window.swipeManager.deck || window.swipeManager.deck.length === 0) {
          const foods = this.getFoodsForCurrentMood();
          window.swipeManager.loadCards(foods.length > 0 ? foods : (APP_DATA.foods || []));
        } else {
          window.swipeManager.render();
        }
      }
    } else if (tabName === 'reels') {
      if (window.reelsManager) {
        const firstVideo = document.querySelector('#reels-feed-container video');
        if (firstVideo) firstVideo.play().catch(() => {});
      }
    } else if (tabName === 'liked') {
      this.renderLikedView();
    } else if (tabName === 'chat') {
      if (window.chatManager) {
        window.chatManager.renderFriendsSidebar();
        window.chatManager.renderActiveChatWindow();
      }
    }
  }

  addLikedFood(food) {
    if (!food) return;
    if (!this.likedFoods.some(f => f.id === food.id)) {
      this.likedFoods.unshift(food);
      try {
        localStorage.setItem('foodtinder_liked', JSON.stringify(this.likedFoods));
      } catch (e) {}
      this.showToast(`Đã thêm "${food.name}" vào Yêu Thích! ❤️`);
      this.updateLikedBadge();
      this.updateBentoStats();
      this.updateSwipeLikedPanel(food);

      // Update AI Taste Learning Engine & refresh recommendations
      if (window.tasteManager) {
        window.tasteManager.recordLike(food);
        window.tasteManager.renderLocationRecommendations();
      }
    }
  }

  removeLikedFood(foodId) {
    this.likedFoods = this.likedFoods.filter(f => f.id !== foodId);
    try {
      localStorage.setItem('foodtinder_liked', JSON.stringify(this.likedFoods));
    } catch (e) {}
    this.updateLikedBadge();
    if (this.currentTab === 'liked') {
      this.renderLikedView();
    }
  }

  toggleLikedFood(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return;
    const isLiked = this.likedFoods.some(f => f.id === foodId);
    if (isLiked) {
      this.removeLikedFood(foodId);
      this.showToast(`Đã bỏ thích "${food.name}".`);
    } else {
      this.addLikedFood(food);
    }
    const nowLiked = this.likedFoods.some(f => f.id === foodId);
    document.querySelectorAll(`[data-like-btn="${foodId}"]`).forEach(btn => {
      if (nowLiked) {
        btn.classList.add('bg-rose-500', 'text-white');
        btn.classList.remove('bg-rose-50', 'text-rose-600', 'hover:bg-rose-100');
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', 'currentColor');
          svg.classList.add('fill-white', 'text-white');
          svg.classList.remove('text-rose-500');
        }
      } else {
        btn.classList.remove('bg-rose-500', 'text-white');
        btn.classList.add('bg-rose-50', 'text-rose-600', 'hover:bg-rose-100');
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', 'none');
          svg.classList.remove('fill-white', 'text-white');
          svg.classList.add('text-rose-500');
        }
      }
    });
  }

  // Chức năng: Sẽ quay lại quán (Revisit / Return to restaurant)
  isFoodWillReturn(foodId) {
    if (!this.willReturnFoods) this.willReturnFoods = [];
    return this.willReturnFoods.includes(foodId);
  }

  getWillReturnCount(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return 96;
    if (food.baseWillReturnCount === undefined) {
      const baseRate = 0.76 + ((food.id * 17) % 18) * 0.01;
      const base = Math.max(28, Math.floor((food.reviewCount || food.likesCount || 120) * baseRate));
      food.baseWillReturnCount = base;
    }
    const userVote = this.isFoodWillReturn(foodId) ? 1 : 0;
    return food.baseWillReturnCount + userVote;
  }

  toggleWillReturn(foodId) {
    if (!this.willReturnFoods) this.willReturnFoods = [];
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    const dishName = food ? food.name : 'món này';
    const restaurantName = food ? food.restaurant : 'quán';
    const isNowVoted = !this.willReturnFoods.includes(foodId);

    if (isNowVoted) {
      this.willReturnFoods.push(foodId);
      window.soundFX && window.soundFX.playPop();
    } else {
      this.willReturnFoods = this.willReturnFoods.filter(id => id !== foodId);
    }

    try {
      localStorage.setItem('foodtinder_will_return', JSON.stringify(this.willReturnFoods));
    } catch (e) {}

    const count = this.getWillReturnCount(foodId);
    if (isNowVoted) {
      this.showToast(`😋 Bạn đã đánh dấu: Sẽ là khách quen quay lại quán ${restaurantName}! (${count} người)`);
    } else {
      this.showToast(`Đã bỏ chọn khách quen quay lại quán ${restaurantName}.`);
    }

    document.querySelectorAll(`[data-will-return-count="${foodId}"]`).forEach(el => {
      el.textContent = count;
    });
    document.querySelectorAll(`[data-will-return-btn="${foodId}"]`).forEach(btn => {
      if (isNowVoted) {
        btn.classList.add('bg-amber-500', 'text-white', 'shadow-xs');
        btn.classList.remove('bg-gradient-to-r', 'from-amber-50', 'to-orange-50/80', 'text-amber-900', 'border-amber-200/90');
      } else {
        btn.classList.remove('bg-amber-500', 'text-white', 'shadow-xs');
        btn.classList.add('bg-gradient-to-r', 'from-amber-50', 'to-orange-50/80', 'text-amber-900', 'border-amber-200/90');
      }
      btn.title = isNowVoted ? `Bạn đã chọn sẽ quay lại quán này! (${count} người)` : `Đánh dấu bạn sẽ là khách quen quay lại quán này (${count} người đã chọn)`;
    });
  }

  updateLikedBadge() {
    const badge = document.getElementById('liked-badge');
    if (badge) {
      if (this.likedFoods.length > 0) {
        badge.textContent = this.likedFoods.length;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
    // Update bento stats panel
    this.updateBentoStats();
    // Update swipe sidebar panel
    this.updateSwipeLikedPanel();
  }

  updateSwipeLikedPanel(newFood) {
    const panel = document.getElementById('swipe-liked-panel');
    if (!panel) return;
    if (this.likedFoods.length === 0) {
      panel.innerHTML = '<p class="text-xs text-stone-400 italic">Chưa có món nào...</p>';
      return;
    }
    panel.innerHTML = this.likedFoods.map(f => `
      <div class="flex items-center gap-2 p-2 rounded-xl hover:bg-stone-50 transition cursor-pointer" onclick="window.app.showFoodDetail(${f.id})">
        <img src="${f.image}" alt="${f.name}"
          data-name="${f.name.replace(/"/g, '&quot;')}"
          data-restaurant="${(f.restaurant || '').replace(/"/g, '&quot;')}"
          data-category="${f.category || ''}"
          onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${f.name.replace(/'/g, "\\'")}', '${(f.restaurant || '').replace(/'/g, "\\'")}', '${f.category || ''}')"
          class="w-10 h-10 rounded-xl object-cover shrink-0" />
        <div class="min-w-0">
          <p class="font-bold text-xs text-stone-800 truncate">${f.name}</p>
          <p class="text-[10px] text-stone-400 truncate">${f.distanceText}</p>
        </div>
      </div>
    `).join('');
  }

  renderLikedView() {
    const container = document.getElementById('liked-list-container');
    if (!container) return;

    if (this.likedFoods.length === 0) {
      container.innerHTML = `
        <div class="h-80 flex flex-col items-center justify-center text-center p-6">
          <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-3xl mb-3">
            💔
          </div>
          <h4 class="font-bold text-stone-800 text-sm">Chưa có món nào được thích</h4>
          <p class="text-xs text-stone-400 mt-1 max-w-xs">
            Hãy quẹt phải các món bạn yêu thích ở mục "Quẹt Món" hoặc nhấn tim khi lướt Reels nhé!
          </p>
          <button onclick="window.app.switchTab('swipe')" class="mt-4 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs rounded-full shadow-md">
            🃏 Bắt đầu quẹt món
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="p-4 space-y-3">
        ${this.likedFoods.map(food => {
          const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
    const isLiked = this.likedFoods.some(f => f.id === food.id);
    const isWillReturn = this.isFoodWillReturn(food.id);
    const willReturnCount = this.getWillReturnCount(food.id);
          return `
          <div class="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs flex items-center gap-3 hover:shadow-md transition ${status.isOpen ? '' : 'is-closed'}">
            <div class="relative w-20 h-20 shrink-0">
              <img src="${food.image}" alt="${food.name}"
                data-name="${food.name.replace(/"/g, '&quot;')}"
                data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
                data-category="${food.category || ''}"
                onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
                class="w-full h-full rounded-xl object-cover cursor-pointer ${status.isOpen ? '' : 'is-closed-img'}" onclick="window.app.showFoodDetail(${food.id})" />
              <span class="absolute bottom-1 left-1 ${status.isOpen ? 'bg-emerald-600/90 text-white' : 'bg-stone-900/90 text-stone-200'} text-[7.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <span class="w-1 h-1 rounded-full ${status.isOpen ? 'bg-emerald-200' : 'bg-rose-500'}"></span>
                ${status.statusText}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <h5 class="font-bold text-xs text-stone-900 truncate">${food.name}</h5>
              <p class="text-[11px] text-stone-500 truncate mt-0.5">${food.restaurant}</p>
              <p class="text-[10px] mt-1 ${status.isOpen ? 'text-emerald-700 font-semibold' : 'text-stone-400'}">
                🕒 ${food.openTime} <span class="${status.isOpen ? 'text-stone-400' : 'text-rose-500 font-bold'}">(${status.detailText})</span>
              </p>
              <div class="flex items-center gap-2 mt-1 text-[10px] text-stone-400">
                <span class="text-rose-500 font-bold">${food.priceRange.split(' - ')[0]}</span>
                <span>•</span>
                <span>${food.distanceText}</span>
              </div>
            </div>
            <div class="flex flex-col gap-1.5 shrink-0">
              <button onclick="window.app.openMapWithFood(${food.id})" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/70 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition" title="Chỉ đường trên bản đồ">
                <svg class="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                  <line x1="9" y1="3" x2="9" y2="18"></line>
                  <line x1="15" y1="6" x2="15" y2="21"></line>
                </svg>
                <span>Bản đồ</span>
              </button>
              <button onclick="window.app.removeLikedFood(${food.id})" class="p-2 bg-stone-100 text-stone-400 hover:text-rose-500 rounded-lg text-xs transition" title="Xóa">
                ✕
              </button>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
  }

  showFoodDetail(foodId) {
    window.soundFX && window.soundFX.playPop();
    const food = APP_DATA.foods.find(f => f.id === foodId);
    if (!food) return;

    const modal = document.getElementById('food-detail-modal');
    const content = document.getElementById('food-detail-content');
    if (!modal || !content) return;

    const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
    const isLiked = this.likedFoods.some(f => f.id === food.id);
    const isWillReturn = this.isFoodWillReturn(food.id);
    const willReturnCount = this.getWillReturnCount(food.id);

    content.innerHTML = `
      <div class="relative w-full h-64 bg-stone-900">
        <img src="${food.image}" alt="${food.name}"
          data-name="${food.name.replace(/"/g, '&quot;')}"
          data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
          data-category="${food.category || ''}"
          onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
          class="w-full h-full object-cover ${status.isOpen ? '' : 'is-closed-img'}" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        <button onclick="window.app.closeFoodDetail()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition">
          ✕
        </button>
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <div class="flex items-center gap-1.5 mb-1 flex-wrap">
            ${food.tags.map(t => `<span class="bg-rose-500/90 text-[10px] font-bold px-2.5 py-0.5 rounded-full">${t}</span>`).join('')}
            ${status.isOpen ? `
              <span class="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-200"></span> Đang mở cửa
              </span>
            ` : `
              <span class="bg-stone-900/90 text-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-stone-700">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Đã đóng cửa
              </span>
            `}
          </div>
          <h2 class="font-extrabold text-xl leading-tight text-white">${food.name}</h2>
          <p class="text-xs text-stone-300 mt-1">${food.restaurant} • ⭐ ${window.formatRating ? window.formatRating(food.rating) : food.rating} (${food.reviewCount} đánh giá)</p>
        </div>
      </div>

      <div class="p-5 space-y-4">
        <!-- Open/Closed Notice Banner -->
        ${status.isOpen ? `
          <div class="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 flex items-start gap-2.5">
            <span class="text-xl">🟢</span>
            <div>
              <div class="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <span>Đang mở cửa đón khách</span>
                <span class="text-emerald-600 font-semibold">• ${status.detailText}</span>
              </div>
              <p class="text-xs text-emerald-700 mt-0.5">Quán đang mở cửa phục vụ từ <strong class="text-emerald-900">${food.openTime}</strong>. Bạn có thể ghé thưởng thức hoặc bấm "Chỉ đường" để đến quán ngay!</p>
            </div>
          </div>
        ` : `
          <div class="bg-stone-100 border border-stone-300/80 rounded-2xl p-3.5 flex items-start gap-2.5">
            <span class="text-xl">🌙</span>
            <div>
              <div class="text-[11px] font-bold text-rose-600 uppercase tracking-wide flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Quán hiện đang đóng cửa</span>
                <span class="text-stone-500 font-semibold">• ${status.detailText}</span>
              </div>
              <p class="text-xs text-stone-600 mt-0.5">Giờ hoạt động: <strong class="text-stone-800">${food.openTime}</strong>. Quý khách vẫn có thể xem trước món ăn, giá tiền, địa chỉ và lưu vào Yêu Thích để chuẩn bị ghé quán!</p>
            </div>
          </div>
        `}

        <div class="bg-[#FFF8F2] border border-[#FFEAD8] rounded-2xl p-3.5 flex items-start gap-2.5">
          <span class="text-xl">💡</span>
          <div>
            <span class="text-[11px] font-bold text-[#8D4D24] uppercase">Lý do chọn món này</span>
            <p class="text-xs text-[#8D4D24] mt-0.5 leading-relaxed">${food.recommendReason}</p>
          </div>
        </div>

        <div>
          <h4 class="font-bold text-xs text-stone-800 uppercase tracking-wider mb-1.5">Giới thiệu món ăn</h4>
          <p class="text-xs text-stone-600 leading-relaxed">${food.desc}</p>
        </div>

        <div class="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-stone-400">Trạng thái:</span>
            <span class="font-bold ${status.isOpen ? 'text-emerald-600' : 'text-rose-500'} flex items-center gap-1">
              <span class="w-2 h-2 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
              ${status.statusText} (${status.detailText})
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-400">Giờ mở cửa:</span>
            <span class="font-semibold text-stone-700">${food.openTime}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-400">Giá tham khảo:</span>
            <span class="font-bold text-rose-600">${food.priceRange}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-400">Địa chỉ:</span>
            <span class="font-semibold text-stone-700 truncate max-w-[200px]">${food.address}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-400">Hotline quán:</span>
            <span class="font-semibold text-blue-600">${food.phone}</span>
          </div>
        </div>

        <!-- ShopeeFood Delivery Section -->
        <div class="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/70 border border-orange-200/90 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-[#EE4D2D] text-white flex items-center justify-center shadow-xs overflow-hidden">
                ${window.getShopeeIcon ? window.getShopeeIcon(32, 'w-full h-full object-cover') : '🛍️'}
              </span>
              <div>
                <h5 class="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                  <span>ShopeeFood Giao Tận Nơi</span>
                  <span class="bg-red-500 text-white text-[8.5px] font-black px-1.5 py-0.2 rounded-full uppercase">Freeship</span>
                </h5>
                <p class="text-[10px] text-stone-500">Phục vụ giao hàng nhanh tại TP. Quy Nhơn</p>
              </div>
            </div>
            <span class="text-[10px] font-extrabold text-[#EE4D2D] bg-white border border-orange-200 px-2 py-0.5 rounded-full shadow-xs">
              ⏱️ ${food.deliveryTime || '15 - 25 phút'}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 my-2.5 text-[11px]">
            <div class="bg-white/90 p-2 rounded-xl border border-orange-100">
              <span class="text-stone-400 block text-[9.5px]">Phí giao hàng:</span>
              <strong class="text-stone-800 text-[11px]">${food.deliveryFee || 'Freeship đơn từ 50k'}</strong>
            </div>
            <div class="bg-white/90 p-2 rounded-xl border border-orange-100">
              <span class="text-stone-400 block text-[9.5px]">Voucher ưu đãi:</span>
              <strong class="text-[#EE4D2D] text-[11px] font-bold">${food.deliveryPromoCode || 'SHOPEE25K'}</strong>
            </div>
          </div>

          <button onclick="window.app.openShopeeFoodDelivery(${food.id})" class="w-full py-3 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-xl font-black text-xs shadow-md shadow-orange-300 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer">
            ${window.getShopeeIcon ? window.getShopeeIcon(18, 'rounded-xs shrink-0') : ''}
            <span>ĐẶT GIAO HÀNG TRÊN SHOPEEFOOD</span>
            <span class="text-xs">↗</span>
          </button>
        </div>

        <div class="flex gap-2 pt-2">
          <button onclick="window.app.toggleLikedFood(${food.id})" class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-1.5 cursor-pointer">
            <span>❤️ Yêu Thích</span>
          </button>
          <button onclick="window.app.toggleWillReturn(${food.id})" data-will-return-btn="${food.id}" class="px-3 py-3 ${isWillReturn ? 'bg-amber-500 text-white shadow-xs' : 'bg-gradient-to-r from-amber-50 to-orange-50/80 text-amber-900 border border-amber-200/90'} rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer" title="Đánh dấu bạn sẽ là khách quen quay lại quán">
            <span class="text-lg leading-none shrink-0 inline-block">😋</span>
            <span><span data-will-return-count="${food.id}">${willReturnCount}</span> khách quen</span>
          </button>
          <button onclick="window.app.openShopeeFoodDelivery(${food.id})" class="px-3.5 py-3 bg-gradient-to-r from-orange-500 to-[#EE4D2D] text-white rounded-xl font-extrabold text-xs shadow-md shadow-orange-200 flex items-center justify-center gap-1.5 cursor-pointer">
            ${window.getShopeeIcon ? window.getShopeeIcon(15, 'rounded-xs shrink-0') : ''}
            <span>ShopeeFood</span>
          </button>
          <button onclick="window.app.openMapWithFood(${food.id})" class="px-3.5 py-3 bg-stone-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1">
            <span>📍</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-sheet').classList.remove('translate-y-full');
    }, 10);
  }

  openShopeeFoodDelivery(foodId) {
    const food = APP_DATA.foods.find(f => f.id === foodId);
    if (!food) return;

    window.soundFX && window.soundFX.playPop();

    const modal = document.getElementById('delivery-modal');
    const content = document.getElementById('delivery-modal-content');
    if (!modal || !content) {
      // Direct open fallback
      this.redirectToShopeeFood(food.deliveryUrl || food.deliverySearchUrl, food.name, food.restaurant);
      return;
    }

    const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
    const isLiked = this.likedFoods.some(f => f.id === food.id);
    const isWillReturn = this.isFoodWillReturn(food.id);
    const willReturnCount = this.getWillReturnCount(food.id);
    const promoCode = food.deliveryPromoCode || "SHOPEE25K";
    const deliveryUrl = food.deliveryUrl || `https://shopeefood.vn/binh-dinh/${food.restaurant ? encodeURIComponent(food.restaurant) : 'quan-an'}`;
    const searchUrl = food.deliverySearchUrl || `https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=${encodeURIComponent(food.restaurant || food.name)}`;

    content.innerHTML = `
      <div class="relative bg-white max-h-[85vh] flex flex-col">
        <!-- Orange Brand Header Banner -->
        <div class="bg-gradient-to-r from-[#EE4D2D] to-[#FF6B4A] text-white p-4 shrink-0 relative overflow-hidden">
          <div class="absolute -right-4 -bottom-6 text-7xl opacity-15 pointer-events-none">🛵</div>
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs overflow-hidden">
                ${window.getShopeeIcon ? window.getShopeeIcon(36, 'w-full h-full object-cover rounded-xl') : '🛍️'}
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-black text-sm sm:text-base tracking-wide uppercase">ShopeeFood Delivery</span>
                  <span class="bg-white text-[#EE4D2D] text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">QUY NHƠN</span>
                </div>
                <p class="text-[11px] text-white/90">Đặt món giao tận nơi · Nhanh chóng 15-25 phút</p>
              </div>
            </div>
            <button onclick="window.app.closeDeliveryModal()" class="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition text-sm">
              ✕
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="p-4 overflow-y-auto space-y-3.5 scrollbar-none flex-1">
          <!-- Restaurant Card Preview -->
          <div class="flex gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
            <div class="w-20 h-20 rounded-xl overflow-hidden bg-stone-200 shrink-0 relative">
              <img src="${food.image}" alt="${food.name}"
                data-name="${food.name.replace(/"/g, '&quot;')}"
                data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
                data-category="${food.category || ''}"
                onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
                class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h4 class="font-black text-xs sm:text-sm text-stone-900 truncate">${food.name}</h4>
                <p class="text-[11px] font-bold text-orange-600 truncate mt-0.5">🏪 ${food.restaurant}</p>
                <p class="text-[10px] text-stone-400 truncate mt-0.5">📍 ${food.address} (${food.distanceText})</p>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs font-black text-rose-600">${food.priceRange.split(' - ')[0]}</span>
                <span class="text-[9.5px] font-bold ${status.isOpen ? 'text-emerald-600' : 'text-stone-400'}">
                  ${status.isOpen ? '🟢 Đang nhận đơn giao' : '🌙 Quán đã đóng'}
                </span>
              </div>
            </div>
          </div>

          <!-- Fast Delivery Info Stats -->
          <div class="grid grid-cols-3 gap-2">
            <div class="p-2.5 bg-orange-50/80 rounded-xl border border-orange-100 text-center">
              <span class="text-stone-400 block text-[9.5px]">⏱️ Thời gian</span>
              <strong class="text-stone-800 text-[11px] block mt-0.5 font-bold">${food.deliveryTime || '15 - 25p'}</strong>
            </div>
            <div class="p-2.5 bg-orange-50/80 rounded-xl border border-orange-100 text-center">
              <span class="text-stone-400 block text-[9.5px]">🛵 Phí giao hàng</span>
              <strong class="text-stone-800 text-[11px] block mt-0.5 font-bold">Freeship 50k</strong>
            </div>
            <div class="p-2.5 bg-orange-50/80 rounded-xl border border-orange-100 text-center">
              <span class="text-stone-400 block text-[9.5px]">⭐ Đánh giá</span>
              <strong class="text-stone-800 text-[11px] block mt-0.5 font-bold">4.8 (1k+ bán)</strong>
            </div>
          </div>

          <!-- Promo Voucher Banner -->
          <div class="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/90 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🎟️</span>
              <div>
                <div class="text-[11px] font-extrabold text-orange-900">${food.deliveryPromo || 'Mã SHOPEE25K giảm 25.000đ'}</div>
                <p class="text-[9.5px] text-orange-600">Áp dụng ngay khi thanh toán qua ShopeeFood</p>
              </div>
            </div>
            <button onclick="window.app.copyVoucher('${promoCode}')" class="px-2.5 py-1.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white rounded-lg text-[10px] font-black shadow-xs transition shrink-0 active:scale-95">
              Sao chép mã
            </button>
          </div>

          <!-- Popular Menu Items to add -->
          <div>
            <h5 class="font-bold text-xs text-stone-800 uppercase tracking-wide mb-2 flex items-center justify-between">
              <span>Thực đơn gợi ý tại quán</span>
              <span class="text-[10px] text-stone-400 font-normal">Đặt kèm freeship</span>
            </h5>
            <div class="space-y-1.5">
              ${(food.menu || [
                { name: food.name, price: food.priceRange.split(' - ')[0], highlight: true },
                { name: "Phần đặc biệt quán " + food.restaurant, price: food.priceRange.split(' - ')[-1] || "65.000đ" },
                { name: "Trà đá / Nước ép tươi", price: "15.000đ" }
              ]).map(m => `
                <div class="flex items-center justify-between p-2 rounded-xl bg-stone-50 hover:bg-stone-100 transition text-xs">
                  <div class="flex items-center gap-2 truncate">
                    <span class="text-orange-500 font-bold">•</span>
                    <span class="font-semibold text-stone-800 truncate">${m.name}</span>
                  </div>
                  <span class="font-bold text-stone-900 shrink-0 ml-2">${m.price}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Sticky Bottom Action Footer -->
        <div class="p-4 bg-white border-t border-stone-100 flex flex-col gap-2 shrink-0">
          <button onclick="window.app.redirectToShopeeFood('${deliveryUrl}', '${food.name.replace(/'/g, "\\'")}', '${food.restaurant.replace(/'/g, "\\'")}')" 
            class="w-full py-3.5 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-300 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer">
            ${window.getShopeeIcon ? window.getShopeeIcon(22, 'rounded-xs shrink-0') : ''}
            <span>MỞ QUÁN TRÊN SHOPEEFOOD ĐẶT HÀNG</span>
            <span>↗</span>
          </button>

          <div class="flex items-center justify-between text-[11px] px-1 text-stone-500">
            <a href="${searchUrl}" target="_blank" class="hover:text-orange-600 hover:underline flex items-center gap-1 font-medium">
              <span>🔍 Tìm quán "${food.restaurant}" trên ShopeeFood</span>
            </a>
            <a href="tel:${food.hotline || '02563800000'}" class="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1">
              <span>📞 Hotline: ${food.hotline || '0256 3800137'}</span>
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-sheet').classList.remove('translate-y-full');
    }, 10);
  }

  closeDeliveryModal() {
    const modal = document.getElementById('delivery-modal');
    if (!modal) return;
    modal.querySelector('.modal-sheet').classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  redirectToShopeeFood(url, dishName, restaurant) {
    this.showToast(`🛵 Đang mở ShopeeFood đặt món: ${dishName}!`);
    window.open(url, '_blank');
  }

  copyVoucher(code) {
    try {
      navigator.clipboard.writeText(code);
      this.showToast(`✅ Đã sao chép mã voucher: ${code}`);
    } catch (e) {
      this.showToast(`Mã ưu đãi: ${code}`);
    }
  }

  closeFoodDetail() {
    const modal = document.getElementById('food-detail-modal');
    if (!modal) return;
    modal.querySelector('.modal-sheet').classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  openMapWithFood(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return;

    window.soundFX && window.soundFX.playPop();

    // Prepare Google Maps directions URL
    let destinationParam = '';
    if (food.lat && food.lng) {
      destinationParam = `${food.lat},${food.lng}`;
    } else {
      const restName = food.restaurant || food.name;
      const addr = food.address || '';
      const city = food.cityName || APP_DATA.currentCity?.name || 'Quy Nhơn';
      destinationParam = encodeURIComponent(`${restName}, ${addr}, ${city}`);
    }
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationParam}`;

    const modal = document.getElementById('google-maps-modal');
    if (!modal) {
      if (confirm(`Bạn có muốn mở Google Maps để dẫn đường đến quán "${food.restaurant || food.name}" không?`)) {
        window.open(gmapsUrl, '_blank');
      }
      return;
    }

    const restEl = document.getElementById('gmaps-modal-restaurant');
    const addrEl = document.getElementById('gmaps-modal-address');
    const distEl = document.getElementById('gmaps-modal-distance');
    const confirmBtn = document.getElementById('gmaps-modal-confirm-btn');

    if (restEl) restEl.textContent = food.restaurant || food.name;
    if (addrEl) addrEl.textContent = food.address ? `${food.address}, ${food.cityName || 'Quy Nhơn'}` : (food.cityName || 'TP. Quy Nhơn');
    if (distEl) distEl.textContent = food.distanceText ? food.distanceText : (food.distance ? `Cách bạn ${food.distance}km` : 'Gần bạn');

    if (confirmBtn) {
      confirmBtn.onclick = () => {
        this.closeGoogleMapsModal();
        window.open(gmapsUrl, '_blank');
      };
    }

    modal.classList.remove('hidden');
  }

  closeGoogleMapsModal() {
    const modal = document.getElementById('google-maps-modal');
    if (modal) modal.classList.add('hidden');
  }

  showMatchModal(food, isSuperLike = false) {
    window.soundFX && window.soundFX.playMatch();

    // Trigger confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const modal = document.getElementById('match-modal');
    const imgEl = document.getElementById('match-food-img');
    const nameEl = document.getElementById('match-food-name');
    const restaurantEl = document.getElementById('match-food-restaurant');
    const btnMap = document.getElementById('match-btn-map');

    if (!modal) return;

    if (imgEl) imgEl.src = food.image;
    if (nameEl) nameEl.textContent = food.name;
    if (restaurantEl) restaurantEl.textContent = `${food.restaurant} (${food.distanceText})`;

    if (btnMap) {
      btnMap.onclick = () => {
        modal.classList.add('hidden');
        window.app.openMapWithFood(food.id);
      };
    }

    modal.classList.remove('hidden');
  }

  closeMatchModal() {
    const modal = document.getElementById('match-modal');
    if (modal) modal.classList.add('hidden');
  }

  openCityModal() {
    window.soundFX && window.soundFX.playPop();
    const modal = document.getElementById('city-modal');
    const searchInput = document.getElementById('city-search-input');
    if (searchInput) searchInput.value = '';
    this.filterCities('', 'all');
    if (modal) modal.classList.remove('hidden');
  }

  filterCities(keyword = '', activeRegion = null) {
    const list = document.getElementById('city-list');
    if (!list) return;

    // Update active region tab chip styles
    if (activeRegion !== null) {
      document.querySelectorAll('#city-region-chips .city-tab-chip').forEach(btn => {
        const r = btn.getAttribute('data-region');
        if (r === activeRegion) {
          btn.className = 'city-tab-chip px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-900 text-white shrink-0 transition shadow-xs';
        } else {
          btn.className = 'city-tab-chip px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 shrink-0 transition';
        }
      });
    }

    const removeVN = (str) => {
      if (!str) return '';
      return str.toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
        .replace(/\u02C6|\u0306|\u031B/g, '')
        .trim();
    };

    const kw = (keyword || '').trim().toLowerCase();
    const cleanKw = removeVN(kw);
    const cleanKwNoSpace = cleanKw.replace(/\s+/g, '');

    const allLocations = [
      ...APP_DATA.weatherOptions,
      ...(APP_DATA.districtOptions || [])
    ];

    let filtered = [];
    if (!kw) {
      if (activeRegion && activeRegion !== 'all') {
        filtered = allLocations.filter(opt => opt.region === activeRegion);
      } else {
        // Show the 63 provinces by default for a clean initial view
        filtered = APP_DATA.weatherOptions;
      }
    } else {
      filtered = allLocations.filter(opt => {
        const rawFields = [
          opt.city,
          opt.shortName,
          opt.parentProvince,
          opt.oldName,
          opt.address,
          opt.province,
          opt.region,
          opt.signature
        ].filter(Boolean).join(' ').toLowerCase();

        const cleanFields = removeVN(rawFields);
        const cleanFieldsNoSpace = cleanFields.replace(/\s+/g, '');

        return rawFields.includes(kw) || 
               cleanFields.includes(cleanKw) || 
               cleanFieldsNoSpace.includes(cleanKwNoSpace);
      });
    }

    if (filtered.length === 0) {
      const safeKw = keyword.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      list.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center py-8 text-center text-stone-400 text-xs">
          <p class="text-3xl mb-2">🔍</p>
          <span class="font-bold text-stone-700 mb-1">Không tìm thấy địa điểm có sẵn cho "${keyword}"</span>
          <span class="text-stone-400 text-[11px] max-w-xs mb-3">Bạn có muốn FoodTinder gợi ý các quán đặc sản theo Gu tại khu vực này?</span>
          <button onclick="window.app.selectDynamicDistrict('${safeKw}')" 
            class="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition flex items-center gap-1.5">
            <span>✨ Khám phá quán ăn tại "${keyword}"</span>
          </button>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(opt => {
      const isSelected = APP_DATA.currentCity.name === opt.city || APP_DATA.currentCity.cityId === opt.cityId;
      const safeCity = opt.city.replace(/'/g, "\\'");
      const safeAddress = (opt.address || '').replace(/'/g, "\\'");
      const safeSig = (opt.signature || opt.address || '').replace(/"/g, '&quot;');
      const safeCond = (opt.condition || '').replace(/"/g, '&quot;');

      return `
        <div onclick="window.app.selectCityAndWeather('${safeCity}', '${safeAddress}', '${opt.temp}', '${opt.condition}', '${opt.icon}', ${opt.lat}, ${opt.lng}, '${opt.cityId || ''}')" 
          class="py-2 px-3 rounded-xl border transition flex items-center justify-between gap-2.5 group cursor-pointer w-full overflow-hidden shrink-0 ${
            isSelected 
              ? 'border-rose-400 bg-rose-50/70 ring-2 ring-rose-200 shadow-2xs' 
              : 'border-stone-200/90 hover:border-rose-300 hover:bg-stone-50/80 active:scale-[0.99]'
          }">
          <!-- Left: Icon + City text (constrained with min-w-0 flex-1 so truncate works flawlessly) -->
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <span class="text-2xl shrink-0 group-hover:scale-110 transition-transform">${opt.icon}</span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-nowrap min-w-0">
                <h5 class="font-extrabold text-xs text-stone-900 group-hover:text-rose-600 transition truncate">${opt.city}</h5>
                <span class="text-[8.5px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                  isSelected 
                    ? 'bg-rose-500 text-white' 
                    : opt.isDistrict 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-stone-100 text-stone-600'
                }">${opt.isDistrict ? (opt.parentProvince ? opt.parentProvince : 'Quận/Huyện') : (opt.region || opt.province || '')}</span>
              </div>
              <p class="text-[10.5px] text-stone-500 truncate mt-0.5" title="${safeSig}">${opt.signature || opt.address}</p>
            </div>
          </div>

          <!-- Right: Weather status (fixed shrink-0 with explicit width and truncation) -->
          <div class="text-right shrink-0 pl-1 min-w-[65px] max-w-[85px]">
            <span class="text-xs font-black text-stone-800 whitespace-nowrap block">${opt.temp}</span>
            <p class="text-[9.5px] text-stone-400 truncate mt-0.5" title="${safeCond}">${opt.condition}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  selectDynamicDistrict(districtKeyword) {
    const cleanKw = districtKeyword.trim();
    const dynamicId = `district_${Date.now()}`;
    const dynamicCity = `Quận/Huyện ${cleanKw}`;
    const parentProvince = APP_DATA.currentCity.parentProvince || APP_DATA.currentCity.name || "Việt Nam";

    const dynamicOpt = {
      cityId: dynamicId,
      city: `${cleanKw} (${parentProvince})`,
      shortName: cleanKw,
      parentProvince: parentProvince,
      region: "Tây Nguyên",
      address: `Khu vực ${cleanKw}, ${parentProvince}`,
      temp: "24°C",
      condition: "Mát mẻ dễ chịu",
      icon: "📍",
      lat: (APP_DATA.currentCity.lat || 12.9) + 0.05,
      lng: (APP_DATA.currentCity.lng || 108.2) + 0.05,
      isDistrict: true,
      signature: `Đặc sản quán ngon chuẩn gu tại ${cleanKw}`,
      specialties: [
        {
          name: `Đặc Sản Nóng Hổi Chuẩn Vị ${cleanKw}`,
          rest: `Quán Ngon Gia Truyền - Trung Tâm ${cleanKw}`,
          cat: "comfort",
          tags: [`#${cleanKw.replace(/\s+/g, '_')}`, "#Đặc_sản", "#Đậm_đà", "#Nóng_hổi"],
          price: "45.000đ - 85.000đ",
          img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
          reason: `Món ngon đặc sản nổi bật tại ${cleanKw}, phù hợp chuẩn gu ấm áp đậm đà của bạn.`
        },
        {
          name: `Nướng Than Hoa & Lẩu Đậm Vị ${cleanKw}`,
          rest: `Ẩm Thực Phố Mới - Đường Chính ${cleanKw}`,
          cat: "bbq",
          tags: [`#Nướng_${cleanKw.replace(/\s+/g, '_')}`, "#Xì_xèo", "#Đậm_đà"],
          price: "150.000đ - 280.000đ",
          img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
          reason: `Hương vị nướng thơm lừng kết hợp gia vị địa phương đặc sắc tại ${cleanKw}.`
        }
      ]
    };

    if (!APP_DATA.districtOptions) APP_DATA.districtOptions = [];
    APP_DATA.districtOptions.unshift(dynamicOpt);

    this.selectCityAndWeather(
      dynamicOpt.city,
      dynamicOpt.address,
      dynamicOpt.temp,
      dynamicOpt.condition,
      dynamicOpt.icon,
      dynamicOpt.lat,
      dynamicOpt.lng,
      dynamicOpt.cityId
    );
  }

  selectCityAndWeather(city, address, temp, condition, icon, lat, lng, cityId) {
    const matchedOpt = (APP_DATA.districtOptions || []).find(w => w.cityId === cityId || w.city === city) ||
                       APP_DATA.weatherOptions.find(w => w.cityId === cityId || w.city === city);
    const resolvedCityId = cityId || matchedOpt?.cityId || 'quynhon';

    APP_DATA.currentCity = {
      name: city,
      cityId: resolvedCityId,
      isDistrict: matchedOpt?.isDistrict || false,
      parentProvince: matchedOpt?.parentProvince || '',
      address: address,
      lat: lat,
      lng: lng,
      weather: { temp, condition, icon }
    };

    // If selected location has signature specialties, register them into APP_DATA.foods
    if (matchedOpt && Array.isArray(matchedOpt.specialties) && matchedOpt.specialties.length > 0) {
      matchedOpt.specialties.forEach((spec, sIdx) => {
        const foodId = 6000 + Math.abs(Math.round(lat * 100)) + sIdx;
        const exists = APP_DATA.foods.some(f => f.id === foodId || (f.name === spec.name && f.cityId === resolvedCityId));
        if (!exists) {
          APP_DATA.foods.push({
            id: foodId,
            cityId: resolvedCityId,
            cityName: city,
            name: spec.name,
            restaurant: spec.rest || `Đặc Sản ${matchedOpt.shortName || city}`,
            address: address,
            distance: 0.6 + sIdx * 0.3,
            distanceText: `Cách bạn ${600 + sIdx * 300}m`,
            weatherNote: `${condition} ${temp}`,
            priceRange: spec.price || "45.000đ - 85.000đ",
            rating: Number(window.formatRating ? window.formatRating(4.8 + (sIdx % 2) * 0.1) : (4.8 + (sIdx % 2) * 0.1).toFixed(1)),
            reviewCount: 1620 + sIdx * 250,
            lat: lat + (sIdx * 0.002),
            lng: lng + (sIdx * 0.002),
            category: spec.cat || "streetfood",
            moodIds: ["comfort", "chill", "craving", "energetic", "sad"],
            tags: spec.tags || ["#Đặc_sản", "#Nóng_hổi", "#Đậm_đà"],
            sideRibbon: ["#đặc_sản_địa_phương", "#chuẩn_vị"],
            recommendReason: spec.reason || `Món ăn đặc sản nức tiếng tại ${city}.`,
            image: spec.img || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
            gallery: [spec.img || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"],
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-chopsticks-eating-noodles-43003-large.mp4",
            likesCount: 3100 + sIdx * 380,
            commentsCount: 280 + sIdx * 45,
            openTime: "07:00 - 22:30",
            phone: "0912 345 678",
            desc: spec.reason || `Đặc sản trứ danh của ${city}, được thực khách gần xa đánh giá cao.`
          });
        }
      });
    }

    this.renderHeader();
    this.renderBentoAndFeed();
    this.renderMiniMap();
    this.renderNearbyGrid();
    this.renderFoodGrid();
    this.updateBentoStats();

    // Re-render Location & Taste recommendations
    if (window.tasteManager) {
      window.tasteManager.resetRadius();
      window.tasteManager.renderLocationRecommendations();
    }

    if (window.mapManager && window.mapManager.map) {
      window.mapManager.map.setView([lat, lng], 14);
      window.mapManager.renderUserLocation();
      window.mapManager.renderBottomSheet();
    }

    const modal = document.getElementById('city-modal');
    if (modal) modal.classList.add('hidden');

    this.showToast(`Đã chuyển vị trí: ${city} (${temp} ${icon})! 📍`);
  }

  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.querySelector('#toast-msg').textContent = message;
    toast.style.opacity = '1';
    toast.style.translate = '0 0';
    toast.style.pointerEvents = 'auto';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.translate = '0 -8px';
      toast.style.pointerEvents = 'none';
    }, 2400);
  }

  toggleDeviceFrame() {
    this.isPhoneFrame = !this.isPhoneFrame;
    const phoneFrame = document.getElementById('phone-frame-wrapper');
    const toggleBtn = document.getElementById('btn-toggle-frame');

    if (this.isPhoneFrame) {
      phoneFrame.classList.remove('w-full', 'max-w-none', 'h-screen', 'rounded-none', 'border-0', 'p-0');
      phoneFrame.classList.add('w-[390px]', 'h-[844px]', 'rounded-[50px]', 'border-[10px]', 'border-stone-800', 'shadow-2xl');
      if (toggleBtn) toggleBtn.innerHTML = '📱 Chế độ Khung Điện Thoại';
    } else {
      phoneFrame.classList.add('w-full', 'max-w-none', 'h-screen', 'rounded-none', 'border-0', 'p-0');
      phoneFrame.classList.remove('w-[390px]', 'h-[844px]', 'rounded-[50px]', 'border-[10px]', 'border-stone-800', 'shadow-2xl');
      if (toggleBtn) toggleBtn.innerHTML = '🖥️ Chế độ Toàn Màn Hình';
    }

    if (window.mapManager && window.mapManager.map) {
      setTimeout(() => window.mapManager.map.invalidateSize(), 300);
    }
  }

  bindEvents() {
    // Chat input submit
    const chatInput = document.getElementById('chat-input-field');
    const chatBtn = document.getElementById('chat-send-btn');
    if (chatInput && chatBtn) {
      const submitChat = () => {
        const val = chatInput.value;
        if (val.trim()) {
          chatInput.value = '';
          window.chatManager.handleUserSubmit(val);
        }
      };
      chatBtn.onclick = submitChat;
      chatInput.onkeydown = (e) => {
        if (e.key === 'Enter') submitChat();
      };
    }
  }
}

window.app = new FoodApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
