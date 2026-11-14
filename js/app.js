// Main Application Controller (FoodTinder / FoodFinder)

class FoodApp {
  constructor() {
    this.currentTab = 'home';
    this.likedFoods = [];
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
    if (window.swipeManager) {
      window.swipeManager.loadCards(this.getFoodsForCurrentMood());
    }

    // Init Reels
    if (window.reelsManager) {
      window.reelsManager.init();
    }

    // Init Chat
    if (window.chatManager) {
      window.chatManager.init();
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

    container.innerHTML = `
      <div class="flex items-center justify-between mb-2 px-1">
        <h4 class="font-extrabold text-stone-900 text-sm tracking-tight">How are you feeling?</h4>
        <span class="text-[11px] font-semibold text-rose-500 cursor-pointer hover:underline" onclick="window.app.switchTab('chat')">Hỏi AI 🤖</span>
      </div>

      <div class="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
        ${APP_DATA.moods.map(m => {
          const isSelected = m.id === this.currentMood;
          return `
            <button onclick="window.app.setMood('${m.id}')" 
              class="mood-btn snap-start shrink-0 flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-300 min-w-[70px] ${
                isSelected 
                  ? 'bg-white border-[#FF6584] shadow-md shadow-rose-200/60 ring-2 ring-[#FF6584]/20 scale-105' 
                  : 'bg-white/70 border-stone-200/80 hover:bg-white hover:border-stone-300'
              }">
              <span class="text-2xl mb-1 filter drop-shadow-sm transition-transform duration-300 ${isSelected ? 'scale-110' : ''}">
                ${m.emoji}
              </span>
              <span class="text-[10px] font-bold whitespace-nowrap ${isSelected ? 'text-[#FF4757]' : 'text-stone-600'}">
                ${m.label}
              </span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  renderMiniMap() {
    const container = document.getElementById('mini-map-card');
    if (!container) return;

    // Mini Map Widget matching Image 2
    container.innerHTML = `
      <div class="relative w-full h-32 rounded-2xl overflow-hidden border border-sky-100 shadow-sm bg-gradient-to-br from-sky-50 to-blue-100 p-3 flex flex-col justify-between">
        <!-- Background Stylized Map Pattern -->
        <div class="absolute inset-0 opacity-40 pointer-events-none" style="background-image: radial-gradient(#60A5FA 1px, transparent 1px); background-size: 14px 14px;"></div>
        
        <!-- Top bar with Mini Pins and "Mở bản đồ lớn" -->
        <div class="relative z-10 flex items-start justify-between">
          <div class="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-sky-200 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span class="text-[10px] font-bold text-stone-700">Gần bạn: 5 quán nóng hổi</span>
          </div>
          <button onclick="window.app.switchTab('map')" class="bg-white/95 backdrop-blur-md hover:bg-white text-blue-600 border border-sky-200 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 transition hover:scale-105">
            <span>Mở bản đồ lớn</span> <span>🗺️</span>
          </button>
        </div>

        <!-- Simulated Map Pins matching Image 2 -->
        <div class="relative z-10 flex items-center justify-around px-2">
          <!-- Pin 1: Lẩu nướng -->
          <div onclick="window.app.openMapWithFood(1)" class="flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-rose-300 px-2 py-1 rounded-full shadow-sm cursor-pointer hover:scale-105 transition">
            <span class="text-rose-500 font-bold text-xs">📍</span>
            <div class="text-[9px] font-bold text-stone-800 leading-tight">
              <div>#Lẩu Nướng</div>
              <div class="text-stone-400 font-normal">Cách 1.2km</div>
            </div>
          </div>

          <!-- User Dot -->
          <div class="flex flex-col items-center">
            <div class="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-md animate-pulse"></div>
            <span class="text-[9px] font-bold text-blue-700 mt-0.5">Bạn</span>
          </div>

          <!-- Pin 2: Trà sữa -->
          <div onclick="window.app.openMapWithFood(3)" class="flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-amber-300 px-2 py-1 rounded-full shadow-sm cursor-pointer hover:scale-105 transition">
            <span class="text-amber-500 font-bold text-xs">📍</span>
            <div class="text-[9px] font-bold text-stone-800 leading-tight">
              <div>#Trà sữa</div>
              <div class="text-stone-400 font-normal">Cách 800m</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderBentoAndFeed() {
    const featuredFood = this.getFoodsForCurrentMood()[0] || APP_DATA.foods[0];
    const container = document.getElementById('featured-card-container');
    if (!container) return;

    // Featured Food Card matching Image 2 ("Lẩu Thái Chua Cay - Quán cô Vy")
    container.innerHTML = `
      <div class="relative w-full rounded-[26px] bg-white border border-[#EFE5DB] shadow-md overflow-hidden transition-all hover:shadow-lg">
        <!-- Side Tag Ribbon (Vertical text or Left badges matching Image 2) -->
        <div class="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          <span class="bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
            #Xả_stress
          </span>
          <span class="bg-[#FFF4ED] text-[#E65100] font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-[#FFE0B2] shadow-sm">
            #Ấm_áp
          </span>
        </div>

        <!-- Food Image -->
        <div class="relative w-full h-52 bg-stone-100 overflow-hidden cursor-pointer" onclick="window.app.showFoodDetail(${featuredFood.id})">
          <img src="${featuredFood.image}" alt="${featuredFood.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <!-- Image overlay info -->
          <div class="absolute bottom-3 left-4 right-4 text-white">
            <h3 class="font-extrabold text-lg text-white leading-tight drop-shadow-md">${featuredFood.name}</h3>
            <p class="text-xs text-stone-200 mt-0.5 font-medium drop-shadow-sm">
              ${featuredFood.restaurant} <span class="text-amber-300">(${featuredFood.distanceText})</span>
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

          <!-- Action Buttons: "❤️ Yêu thích", "✕ Bỏ qua", "Trợ lý 💬" -->
          <div class="flex items-center gap-2">
            <button onclick="window.app.addLikedFood(APP_DATA.foods.find(f => f.id === ${featuredFood.id}))" 
              class="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-1.5 transition active:scale-95">
              <span>❤️</span> <span>Yêu thích</span>
            </button>

            <button onclick="window.app.skipFeaturedFood()" 
              class="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-semibold text-xs transition active:scale-95 flex items-center justify-center gap-1">
              <span>✕</span> <span>Bỏ qua</span>
            </button>

            <button onclick="window.app.switchTab('chat')" 
              class="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-semibold text-xs transition active:scale-95 flex items-center justify-center gap-1">
              <span>Trợ lý</span> <span>💬</span>
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
            ${APP_DATA.foods.slice(2, 4).map(f => `
              <div onclick="window.app.showFoodDetail(${f.id})" class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer">
                <div class="relative w-full h-24 bg-stone-100">
                  <img src="${f.image}" alt="${f.name}" class="w-full h-full object-cover" />
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
            `).join('')}
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
    container.innerHTML = sorted.map(food => `
      <div onclick="window.app.showFoodDetail(${food.id})" class="food-card">
        <div class="relative h-24 overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}" class="w-full h-full object-cover" />
          <span class="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
            📍 ${food.distanceText.replace('Cách bạn ', '')}
          </span>
        </div>
        <div class="p-2.5">
          <h6 class="font-bold text-xs text-stone-800 truncate">${food.name}</h6>
          <p class="text-[10px] text-stone-500 truncate mt-0.5">${food.restaurant}</p>
          <p class="text-[10px] font-bold text-rose-500 mt-1">${food.priceRange.split(' - ')[0]}</p>
        </div>
      </div>
    `).join('');
  }

  renderFoodGrid() {
    const container = document.getElementById('food-grid');
    if (!container) return;
    const foods = this.getFoodsForCurrentMood().length > 0
      ? this.getFoodsForCurrentMood()
      : APP_DATA.foods;
    container.innerHTML = foods.map(food => `
      <div onclick="window.app.showFoodDetail(${food.id})" class="food-card">
        <div class="relative h-32 overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          <div class="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
            ${food.tags.slice(0,1).map(t => '<span class="bg-rose-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">' + t + '</span>').join('')}
          </div>
          <span class="absolute top-2 right-2 bg-black/50 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">⭐ ${food.rating}</span>
        </div>
        <div class="p-3">
          <h6 class="font-bold text-xs text-stone-900 truncate">${food.name}</h6>
          <p class="text-[10px] text-stone-500 truncate mt-0.5">${food.restaurant}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-[10px] font-bold text-rose-500">${food.priceRange.split(' - ')[0]}</span>
            <span class="text-[10px] text-stone-400">${food.distanceText.replace('Cách bạn ', '')}</span>
          </div>
          <div class="mt-2 flex gap-1.5">
            <button onclick="event.stopPropagation();window.app.addLikedFood(APP_DATA.foods.find(f=>f.id===${food.id}))"
              class="flex-1 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold">❤️ Thích</button>
            <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
              class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-[10px] font-bold">🗺️</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  setMood(moodId) {
    window.soundFX && window.soundFX.playPop();
    this.currentMood = moodId;
    APP_DATA.currentMoodId = moodId;

    this.renderMoodSelector();
    this.renderBentoAndFeed();
    this.renderFoodGrid();
    this.updateBentoStats();

    // Reload Swipe deck with items matching this mood
    if (window.swipeManager) {
      window.swipeManager.loadCards(this.getFoodsForCurrentMood());
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
        <img src="${f.image}" class="w-10 h-10 rounded-xl object-cover shrink-0" />
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
        ${this.likedFoods.map(food => `
          <div class="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs flex items-center gap-3 hover:shadow-md transition">
            <img src="${food.image}" alt="${food.name}" class="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer" onclick="window.app.showFoodDetail(${food.id})" />
            <div class="flex-1 min-w-0">
              <h5 class="font-bold text-xs text-stone-900 truncate">${food.name}</h5>
              <p class="text-[11px] text-stone-500 truncate mt-0.5">${food.restaurant}</p>
              <div class="flex items-center gap-2 mt-1.5 text-[10px] text-stone-400">
                <span class="text-rose-500 font-bold">${food.priceRange.split(' - ')[0]}</span>
                <span>•</span>
                <span>${food.distanceText}</span>
              </div>
            </div>
            <div class="flex flex-col gap-1.5 shrink-0">
              <button onclick="window.app.openMapWithFood(${food.id})" class="p-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100 transition" title="Chỉ đường">
                🗺️
              </button>
              <button onclick="window.app.removeLikedFood(${food.id})" class="p-2 bg-stone-100 text-stone-400 hover:text-rose-500 rounded-lg text-xs transition" title="Xóa">
                ✕
              </button>
            </div>
          </div>
        `).join('')}
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

    content.innerHTML = `
      <div class="relative w-full h-64 bg-stone-900">
        <img src="${food.image}" alt="${food.name}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        <button onclick="window.app.closeFoodDetail()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition">
          ✕
        </button>
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <div class="flex items-center gap-1.5 mb-1">
            ${food.tags.map(t => `<span class="bg-rose-500/90 text-[10px] font-bold px-2.5 py-0.5 rounded-full">${t}</span>`).join('')}
          </div>
          <h2 class="font-extrabold text-xl leading-tight text-white">${food.name}</h2>
          <p class="text-xs text-stone-300 mt-1">${food.restaurant} • ⭐ ${food.rating} (${food.reviewCount} đánh giá)</p>
        </div>
      </div>

      <div class="p-5 space-y-4">
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
            <span class="text-stone-400">Giá tham khảo:</span>
            <span class="font-bold text-rose-600">${food.priceRange}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-400">Giờ mở cửa:</span>
            <span class="font-semibold text-stone-700">${food.openTime}</span>
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

        <div class="flex gap-2.5 pt-2">
          <button onclick="window.app.addLikedFood(APP_DATA.foods.find(f => f.id === ${food.id}))" class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-1.5">
            <span>❤️ Lưu vào Yêu Thích</span>
          </button>
          <button onclick="window.app.openMapWithFood(${food.id})" class="px-5 py-3 bg-stone-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
            <span>Chỉ đường 📍</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-sheet').classList.remove('translate-y-full');
    }, 10);
  }

  closeFoodDetail() {
    const modal = document.getElementById('food-detail-modal');
    if (!modal) return;
    modal.querySelector('.modal-sheet').classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  openMapWithFood(foodId) {
    this.closeFoodDetail();
    this.switchTab('map');
    setTimeout(() => {
      if (window.mapManager) {
        window.mapManager.selectFood(foodId);
      }
    }, 300);
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
    const list = document.getElementById('city-list');
    if (!modal || !list) return;

    list.innerHTML = APP_DATA.weatherOptions.map(opt => `
      <div onclick="window.app.selectCityAndWeather('${opt.city}', '${opt.address}', '${opt.temp}', '${opt.condition}', '${opt.icon}', ${opt.lat}, ${opt.lng})" 
        class="p-3 rounded-2xl border border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 cursor-pointer transition flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">${opt.icon}</span>
          <div>
            <h5 class="font-bold text-xs text-stone-900">${opt.city}</h5>
            <p class="text-[11px] text-stone-500">${opt.address}</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-stone-800">${opt.temp}</span>
          <p class="text-[10px] text-stone-400">${opt.condition}</p>
        </div>
      </div>
    `).join('');

    modal.classList.remove('hidden');
  }

  selectCityAndWeather(city, address, temp, condition, icon, lat, lng) {
    APP_DATA.currentCity = {
      name: city,
      address: address,
      lat: lat,
      lng: lng,
      weather: { temp, condition, icon }
    };

    this.renderHeader();
    this.renderBentoAndFeed();
    this.renderMiniMap();
    this.renderNearbyGrid();
    this.renderFoodGrid();
    this.updateBentoStats();

    if (window.mapManager && window.mapManager.map) {
      window.mapManager.map.setView([lat, lng], 15);
      window.mapManager.renderUserLocation();
      window.mapManager.renderBottomSheet();
    }

    const modal = document.getElementById('city-modal');
    if (modal) modal.classList.add('hidden');

    this.showToast(`Đã chuyển đến ${city} (${temp} ${icon})! 📍`);
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
