// Interactive Map & Bottom Sheet (Bản Đồ & Thẻ Nổi)

class FoodMapManager {
  constructor() {
    this.map = null;
    this.markers = [];
    this.userMarker = null;
    this.routeLine = null;
    this.activeFoodId = null;
    this.currentCategory = 'all';
    this.isSheetExpanded = false;
  }

  initMap(containerId = 'map-container') {
    const el = document.getElementById(containerId);
    if (!el || this.map) return;

    const city = APP_DATA.currentCity;

    try {
      this.map = L.map(containerId, {
        zoomControl: false,
        attributionControl: false
      }).setView([city.lat, city.lng], 15);

      // Light, elegant OpenStreetMap tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.map);

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(this.map);

      this.renderUserLocation();
      this.renderMarkers();
    } catch (e) {
      console.warn("Leaflet map initialization notice:", e);
    }
  }

  renderUserLocation() {
    if (!this.map) return;
    const city = APP_DATA.currentCity;

    const userIcon = L.divIcon({
      className: 'user-pulse-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 bg-blue-500/30 rounded-full animate-ping absolute"></div>
          <div class="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[9px] text-white font-bold">
            📍
          </div>
          <span class="absolute -bottom-5 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
            Bạn
          </span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (this.userMarker) {
      this.userMarker.setLatLng([city.lat, city.lng]);
    } else {
      this.userMarker = L.marker([city.lat, city.lng], { icon: userIcon }).addTo(this.map);
    }
  }

  renderMarkers(foods = APP_DATA.foods) {
    if (!this.map) return;

    // Clear existing restaurant markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    const filtered = this.currentCategory === 'all' 
      ? foods 
      : foods.filter(f => f.category === this.currentCategory);

    filtered.forEach(food => {
      const isSelected = this.activeFoodId === food.id;

      const foodIcon = L.divIcon({
        className: 'custom-food-marker',
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="w-10 h-10 rounded-full border-2 ${isSelected ? 'border-rose-500 shadow-rose-300 ring-4 ring-rose-300' : 'border-[#FF7A59] shadow-md'} overflow-hidden bg-white shadow-md">
              <img src="${food.image}" alt="${food.name}"
                data-name="${food.name.replace(/"/g, '&quot;')}"
                data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
                data-category="${food.category || ''}"
                onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
                class="w-full h-full object-cover" />
            </div>
            <span class="mt-1 bg-white/95 backdrop-blur-sm border border-stone-200 text-stone-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm whitespace-nowrap flex items-center gap-1">
              <span>⭐ ${window.formatRating ? window.formatRating(food.rating) : food.rating}</span> • <span>${food.distanceText.replace('Cách bạn ', '')}</span>
            </span>
          </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 50]
      });

      const marker = L.marker([food.lat, food.lng], { icon: foodIcon }).addTo(this.map);
      
      marker.on('click', () => {
        this.selectFood(food.id);
      });

      this.markers.push(marker);
    });
  }

  selectFood(foodId, zoomTo = true) {
    this.activeFoodId = foodId;
    const food = APP_DATA.foods.find(f => f.id === foodId);
    if (!food) return;

    window.soundFX && window.soundFX.playPop();

    // Re-render markers to highlight
    this.renderMarkers();

    if (zoomTo && this.map) {
      this.map.flyTo([food.lat, food.lng], 16, { duration: 0.8 });
    }

    // Draw route simulation
    this.drawRouteTo(food);

    // Scroll bottom sheet horizontal card into view
    const cardEl = document.getElementById(`sheet-food-${food.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      cardEl.classList.add('ring-2', 'ring-rose-500');
      setTimeout(() => cardEl.classList.remove('ring-2', 'ring-rose-500'), 2000);
    }
  }

  drawRouteTo(food) {
    if (!this.map) return;
    const city = APP_DATA.currentCity;

    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
    }

    // Midpoint slight curve for realistic street route aesthetic
    const midLat = (city.lat + food.lat) / 2 + 0.0012;
    const midLng = (city.lng + food.lng) / 2 - 0.0008;

    const latlngs = [
      [city.lat, city.lng],
      [midLat, midLng],
      [food.lat, food.lng]
    ];

    this.routeLine = L.polyline(latlngs, {
      color: '#FF4757',
      weight: 4,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(this.map);
  }

  renderBottomSheet() {
    const sheetContent = document.getElementById('map-bottom-sheet-content');
    if (!sheetContent) return;

    const weather = APP_DATA.currentCity.weather;

    sheetContent.innerHTML = `
      <!-- Drag Handle -->
      <div class="flex justify-center pt-2 pb-1 cursor-grab" onclick="window.mapManager.toggleSheetExpand()">
        <div class="w-10 h-1 bg-stone-300 rounded-full"></div>
      </div>

      <!-- Weather Context Header matching user's Image 1 View 2 -->
      <div class="px-4 pt-1 pb-2 flex items-center justify-between">
        <div>
          <h4 class="font-bold text-stone-800 text-sm flex items-center gap-1.5">
            <span>Trời ${APP_DATA.currentCity.name} đang ${weather.condition.toLowerCase()} ${weather.icon},</span>
          </h4>
          <p class="text-xs text-rose-500 font-semibold mt-0.5">ăn gì cho ấm bụng?</p>
        </div>
        <button onclick="window.mapManager.resetView()" class="text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 px-2.5 py-1 rounded-full font-medium transition flex items-center gap-1">
          <i data-lucide="locate" class="w-3.5 h-3.5"></i> Vị trí của bạn
        </button>
      </div>

      <!-- Categories Filter Chips -->
      <div class="flex items-center gap-1.5 px-4 overflow-x-auto pb-2 scrollbar-none text-xs">
        ${[
          { id: 'all', label: 'Tất cả' },
          { id: 'hotpot', label: '🍲 Lẩu ấm áp' },
          { id: 'bbq', label: '🥩 Nướng xì xèo' },
          { id: 'noodles', label: '🍜 Bún/Bánh canh' },
          { id: 'cafe', label: '🧋 Trà sữa / Cafe' },
          { id: 'streetfood', label: '🦐 Bánh xèo / Ăn vặt' }
        ].map(cat => `
          <button onclick="window.mapManager.filterCategory('${cat.id}')" 
            class="px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${this.currentCategory === cat.id ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
            ${cat.label}
          </button>
        `).join('')}
      </div>

      <!-- Horizontal Cards Carousel matching Image 1 View 2 -->
      <div id="map-cards-scroll" class="flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-none snap-x snap-mandatory">
        ${APP_DATA.foods.map(food => {
          const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
          return `
          <div id="sheet-food-${food.id}" onclick="window.mapManager.selectFood(${food.id})" 
            class="snap-center shrink-0 w-44 bg-white border border-stone-200 rounded-2xl p-2.5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${status.isOpen ? '' : 'is-closed'}">
            <div class="relative w-full h-24 rounded-xl overflow-hidden bg-stone-100 mb-2">
              <img src="${food.image}" alt="${food.name}"
                data-name="${food.name.replace(/"/g, '&quot;')}"
                data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
                data-category="${food.category || ''}"
                onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
                class="w-full h-full object-cover ${status.isOpen ? '' : 'is-closed-img'}" />
              <!-- Status Chip -->
              <span class="absolute top-1.5 left-1.5 ${status.isOpen ? 'bg-emerald-600/90 text-white' : 'bg-stone-900/90 text-stone-200'} text-[8.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-xs">
                <span class="w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-200' : 'bg-rose-500 animate-pulse'}"></span>
                ${status.statusText}
              </span>
              <span class="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                ${food.distanceText.replace('Cách bạn ', '')}
              </span>
            </div>
            <div>
              <div class="flex items-center text-amber-500 text-[11px] font-bold">
                ★★★★★ <span class="text-stone-400 text-[10px] ml-1">(${window.formatRating ? window.formatRating(food.rating) : food.rating})</span>
              </div>
              <h5 class="font-bold text-xs text-stone-800 truncate mt-0.5">${food.name}</h5>
              <p class="text-[11px] text-stone-400 truncate">${food.restaurant}</p>
              <!-- Operating hours -->
              <p class="text-[10px] mt-1 ${status.isOpen ? 'text-emerald-700 font-semibold' : 'text-stone-500'}">
                🕒 ${food.openTime} <span class="${status.isOpen ? 'text-stone-400' : 'text-rose-500 font-bold'}">(${status.detailText})</span>
              </p>
            </div>
            <div class="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
              <span class="text-[11px] font-bold text-rose-600 truncate">${food.priceRange.split(' - ')[0]}</span>
              <div class="flex items-center gap-1 shrink-0">
                <button onclick="event.stopPropagation(); window.app && window.app.openShopeeFoodDelivery(${food.id})" 
                  class="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-[#EE4D2D] text-white hover:opacity-90 rounded-md text-[9.5px] font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                  title="Đặt giao tận nơi trên ShopeeFood">
                  ${window.getShopeeBagSvg ? window.getShopeeBagSvg(10, 'shrink-0') : ''}
                  <span>Đặt món</span>
                </button>
                <button onclick="event.stopPropagation(); window.mapManager.drawRouteTo(APP_DATA.foods.find(f => f.id === ${food.id}))" 
                  class="px-2 py-0.5 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-md text-[9.5px] font-semibold">
                  Chỉ đường
                </button>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  filterCategory(catId) {
    this.currentCategory = catId;
    this.renderBottomSheet();
    this.renderMarkers();
  }

  toggleSheetExpand() {
    this.isSheetExpanded = !this.isSheetExpanded;
    const sheet = document.getElementById('map-bottom-sheet');
    if (!sheet) return;
    if (this.isSheetExpanded) {
      sheet.style.maxHeight = '80%';
    } else {
      sheet.style.maxHeight = '270px';
    }
  }

  resetView() {
    if (!this.map) return;
    const city = APP_DATA.currentCity;
    this.map.flyTo([city.lat, city.lng], 15);
  }
}

window.mapManager = new FoodMapManager();
