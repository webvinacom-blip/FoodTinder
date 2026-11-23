// Main Application Controller (FoodTinder / FoodFinder)

// ═══════════════════════════════════════════════════════════════════
// FILTER METADATA & HELPER FUNCTIONS FOR MOOD & FOOD DISCOVERY
// ═══════════════════════════════════════════════════════════════════

const QUICK_HOME_CATEGORIES = [
  { id: 'all', label: 'Tất cả', emoji: '✨' },
  { id: 'noodles', label: 'Bún/Phở/Mì', emoji: '🍜' },
  { id: 'rice', label: 'Cơm', emoji: '🍚' },
  { id: 'hotpot_bbq', label: 'Lẩu & Nướng', emoji: '🍲' },
  { id: 'snack_boba', label: 'Trà sữa & Ăn vặt', emoji: '🧋' },
  { id: 'seafood', label: 'Hải sản', emoji: '🦐' },
  { id: 'vegetarian', label: 'Đồ chay', emoji: '🥗' }
];

const FILTER_CATEGORIES = [
  { id: 'hotpot', label: '🍲 Lẩu', short: '🍲 Lẩu', keywords: ['lẩu', 'hotpot'] },
  { id: 'bbq', label: '🥩 Nướng BBQ', short: '🥩 Nướng', keywords: ['nướng', 'bbq', 'xiên'] },
  { id: 'vegetarian', label: '🥗 Đồ chay', short: '🥗 Đồ chay', keywords: ['chay', 'vegan', 'thuần chay', 'quán chay', 'ẩm thực chay', 'cơm chay', 'lẩu chay', 'bún chay'] },
  { id: 'chicken', label: '🍗 Món Gà', short: '🍗 Món Gà', keywords: ['gà', 'gà chỉ', 'cánh gà'] },
  { id: 'beef', label: '🥩 Món Bò', short: '🥩 Món Bò', keywords: ['bò', 'bít tết', 'bò né'] },
  { id: 'seafood', label: '🦐 Hải sản & Ốc', short: '🦐 Hải sản', keywords: ['hải sản', 'tôm', 'cua', 'ghẹ', 'mực', 'ốc', 'cá', 'hàu'] },
  { id: 'noodles', label: '🍜 Bún / Phở / Mì', short: '🍜 Bún / Phở', keywords: ['bún', 'phở', 'mì', 'bánh canh', 'hủ tiếu', 'miến'] },
  { id: 'rice', label: '🍚 Cơm', short: '🍚 Cơm', keywords: ['cơm', 'xôi', 'niêu'] },
  { id: 'specialty', label: '🥞 Bánh đặc sản', short: '🥞 Bánh đặc sản', keywords: ['bánh hỏi', 'bánh xèo', 'bánh bèo', 'bánh căn', 'bánh cuốn', 'nem'] },
  { id: 'drinks', label: '🧋 Trà sữa & Cafe', short: '🧋 Trà sữa / Cafe', keywords: ['trà', 'cà phê', 'cafe', 'nước ép', 'sinh tố', 'chè', 'kem'] },
  { id: 'snack', label: '🍢 Ăn vặt', short: '🍢 Ăn vặt', keywords: ['bánh tráng', 'ăn vặt', 'chả ram', 'tàu hũ', 'khoai'] }
];

const FILTER_AREAS = [
  { id: 'all', label: 'Toàn TP. Quy Nhơn', keywords: [] },
  { id: 'center', label: 'Trung tâm', keywords: ['ngô mây', 'nguyễn huệ', 'tăng bạt hổ', 'lê lợi', 'trần phú', 'hai bà trưng'] },
  { id: 'beach', label: 'Ven biển', keywords: ['xuân diệu', 'an dương vương', 'view biển', 'bờ biển', 'biển'] },
  { id: 'gachi', label: 'Khu Gà Chỉ', keywords: ['ghềnh ráng', 'phạm thị đào', 'ql1d', 'gà chỉ', 'bông hồng'] },
  { id: 'dongda', label: 'Đống Đa', keywords: ['đống đa', 'trần hưng đạo', 'hải thượng lãn ông', 'bạch đằng'] },
  { id: 'nhonly', label: 'Nhơn Lý / Kỳ Co', keywords: ['nhơn lý', 'eo gió', 'kỳ co', 'flc'] }
];

const FILTER_RADII = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: '≤ 1 km' },
  { value: 3, label: '≤ 3 km' },
  { value: 5, label: '≤ 5 km' },
  { value: 10, label: '≤ 10 km' }
];

const FILTER_PRICES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'cheap', label: '< 40k' },
  { id: 'medium', label: '40k – 100k' },
  { id: 'high', label: '> 100k' }
];

const FILTER_COMPANIONS = [
  {
    id: 'all',
    icon: '✨',
    label: 'Tất cả đối tượng',
    desc: 'Không giới hạn không gian hay ngân sách',
    fullWidth: true
  },
  {
    id: 'solo',
    icon: '🧍',
    label: 'Ăn một mình',
    desc: 'Nhanh gọn, phần 1 người, giá bình dân'
  },
  {
    id: 'date',
    icon: '💑',
    label: 'Hẹn hò / 2 người',
    desc: 'Không gian đẹp, món chill, điểm cao (≥ 4.5★)'
  },
  {
    id: 'friends',
    icon: '👯',
    label: 'Tụ tập nhóm bạn',
    desc: 'Lẩu, nướng, hải sản, ăn vặt chia đĩa'
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧‍👦',
    label: 'Đi cùng gia đình',
    desc: 'Rộng rãi, cơm niêu, món truyền thống'
  }
];

function isFoodVegetarian(food) {
  if (food.category === 'vegetarian') return true;
  const text = `${food.name} ${food.restaurant || ''} ${(food.tags || []).join(' ')}`.toLowerCase();
  return text.includes('chay') || text.includes('vegan') || text.includes('thuần chay');
}

function matchFoodCategory(food, catId) {
  if (catId === 'vegetarian') return isFoodVegetarian(food);
  if (catId === 'hotpot_bbq') {
    return matchFoodCategory(food, 'hotpot') || matchFoodCategory(food, 'bbq') || /lẩu|nướng|bbq|xiên/.test(`${food.name} ${food.restaurant || ''} ${(food.tags || []).join(' ')}`.toLowerCase());
  }
  if (catId === 'snack_boba') {
    return matchFoodCategory(food, 'drinks') || matchFoodCategory(food, 'snack') || /trà sữa|ăn vặt|cà phê|cafe|boba|chè|kem|tàu hũ/.test(`${food.name} ${food.restaurant || ''} ${(food.tags || []).join(' ')}`.toLowerCase());
  }
  const cat = FILTER_CATEGORIES.find(c => c.id === catId);
  if (!cat) return false;
  if (food.category === catId) return true;
  const text = `${food.name} ${food.restaurant || ''} ${(food.tags || []).join(' ')}`.toLowerCase();
  return cat.keywords.some(kw => text.includes(kw));
}

function matchCategories(food, selectedCategories) {
  if (!selectedCategories || selectedCategories.length === 0) return true;
  const hasVegetarian = selectedCategories.includes('vegetarian');
  if (hasVegetarian) {
    // Khi người dùng chọn Đồ chay: BẮT BUỘC món phải là đồ chay! Tuyệt đối không cho quán đồ mặn lọt vào.
    if (!isFoodVegetarian(food)) return false;
    const otherCats = selectedCategories.filter(c => c !== 'vegetarian');
    if (otherCats.length > 0) {
      return otherCats.some(catId => matchFoodCategory(food, catId));
    }
    return true;
  }
  return selectedCategories.some(catId => matchFoodCategory(food, catId));
}

function matchFoodArea(food, areaId) {
  if (areaId === 'all') return true;
  const area = FILTER_AREAS.find(a => a.id === areaId);
  if (!area || !area.keywords.length) return true;
  const text = `${food.address || ''} ${food.restaurant || ''} ${food.district || ''}`.toLowerCase();
  return area.keywords.some(kw => text.includes(kw));
}

function matchFoodPrice(food, tierId) {
  if (tierId === 'all') return true;
  const pStr = food.priceRange || '';
  const match = pStr.replace(/\./g, '').match(/(\d+)/);
  const minPrice = match ? parseInt(match[1], 10) : 50000;
  if (tierId === 'cheap') return minPrice < 40000;
  if (tierId === 'medium') return minPrice >= 40000 && minPrice <= 100000;
  if (tierId === 'high') return minPrice > 100000;
  return true;
}

function matchFoodCompanion(food, compId) {
  if (!compId || compId === 'all') return true;

  const comps = Array.isArray(food.companions) ? food.companions : [];
  const cat = (food.category || '').toLowerCase();
  const name = (food.name || '').toLowerCase();
  const rest = (food.restaurant || '').toLowerCase();
  const tags = (food.tags || []).map(t => String(t).toLowerCase());
  const desc = (food.desc || '').toLowerCase();
  const text = `${name} ${rest} ${tags.join(' ')} ${desc}`;
  const rating = food.rating || 4.0;

  // parse price
  const pStr = food.priceRange || '';
  const match = pStr.replace(/\./g, '').match(/(\d+)/);
  const minPrice = match ? parseInt(match[1], 10) : 50000;

  if (compId === 'solo') {
    // 🧍 Ăn một mình: Ưu tiên quán phục vụ nhanh, phần ăn 1 người, giá bình dân.
    // Loại trừ nồi lẩu lớn, tiệc nướng đắt tiền > 120k
    if (minPrice > 120000) return false;
    if (comps.includes('solo')) return true;
    if (['noodle', 'rice', 'snack', 'drinks', 'vegetarian'].includes(cat)) return true;
    if (/bún|phở|mì|miến|cơm|bánh mì|xôi|ăn vặt|chè|cà phê|cafe|trà sữa/.test(text)) return true;
    return minPrice <= 45000;
  }

  if (compId === 'date') {
    // 💑 Hẹn hò / 2 người: Ưu tiên không gian đẹp, đánh giá cao (≥ 4.5★), món chill.
    if (comps.includes('date_couple')) return true;
    const hasChill = /chill|hẹn hò|lãng mạn|view|ấm cúng|không gian đẹp|cafe|cà phê|trà sữa|bistro|steak|pasta|sushi|kichi/.test(text);
    if (rating >= 4.5 && (hasChill || ['drinks', 'hotpot', 'bbq'].includes(cat))) return true;
    if (rating >= 4.4 && /view biển|chill|lãng mạn|hẹn hò|ấm cúng/.test(text)) return true;
    return false;
  }

  if (compId === 'friends') {
    // 👯 Tụ tập nhóm bạn: Ưu tiên lẩu, nướng, hải sản, ăn vặt chia đĩa.
    if (['hotpot', 'bbq', 'seafood', 'snack', 'drinks'].includes(cat)) return true;
    if (/lẩu|nướng|bbq|xiên|hải sản|ốc|ăn vặt|trà sữa|nhậu|tụ tập|bia|chân gà|nem nướng/.test(text)) return true;
    if (comps.includes('group_family') && minPrice <= 150000) return true;
    return false;
  }

  if (compId === 'family') {
    // 👨‍👩‍👧‍👦 Đi cùng gia đình: Ưu tiên quán rộng rãi, cơm niêu, món truyền thống.
    if (comps.includes('group_family')) return true;
    if (['rice', 'hotpot', 'seafood', 'specialty'].includes(cat)) return true;
    if (/cơm niêu|cơm gia đình|cơm gà|gia đình|gà chỉ|hải sản|bánh xèo|bánh hỏi|rộng rãi|truyền thống|đặc sản/.test(text)) return true;
    return false;
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════════
// LIVE USER LOCATION (GPS) & REAL-TIME WEATHER SERVICE
// ═══════════════════════════════════════════════════════════════════

/**
 * Lấy đúng vị trí GPS thực tế và thời tiết trực tiếp của User
 * 1. Định vị GPS qua navigator.geolocation (với fallback qua IP)
 * 2. Reverse Geocoding lấy tên đường, phường/xã, quận/thành phố tiếng Việt chuẩn xác
 * 3. Lấy thời tiết thời gian thực theo tọa độ từ Open-Meteo API
 */
async function getUserLocationAndWeather(opts = {}) {
  // 1. Reverse Geocoding: Tọa độ -> Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố chi tiết
  const reverseGeocode = async (lat, lng) => {
    // Ưu tiên 1: BigDataCloud Reverse Geocoding (Rất nhanh, miễn phí, hỗ trợ tiếng Việt chi tiết, không bị chặn CORS)
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=vi`);
      if (res.ok) {
        const d = await res.json();
        let road = '';
        if (Array.isArray(d.localityInfo?.informative)) {
          const roadObj = d.localityInfo.informative.find(i => 
            (i.description && (i.description.includes('street') || i.description.includes('road') || i.description.includes('đường') || i.description.includes('phố'))) || 
            (i.name && (i.name.toLowerCase().startsWith('đường') || i.name.toLowerCase().startsWith('phố') || i.name.toLowerCase().startsWith('ngõ') || i.name.toLowerCase().startsWith('hẻm')))
          );
          if (roadObj) road = roadObj.name;
        }

        let ward = d.locality || '';
        let district = '';
        if (Array.isArray(d.localityInfo?.administrative)) {
          const wardObj = d.localityInfo.administrative.find(a => a.order >= 12 || a.adminLevel >= 6 || (a.description && a.description.includes('phường')));
          if (wardObj && (!ward || ward.length < 3)) ward = wardObj.name;
          const distObj = d.localityInfo.administrative.find(a => (a.order === 10 || a.adminLevel === 5 || (a.description && (a.description.includes('quận') || a.description.includes('huyện') || a.description.includes('thị xã')))));
          if (distObj) district = distObj.name;
        }
        if (!district && Array.isArray(d.localityInfo?.informative)) {
          const distObj = d.localityInfo.informative.find(i => i.order >= 11 || (i.description && (i.description.includes('quận') || i.description.includes('huyện'))));
          if (distObj) district = distObj.name;
        }

        let city = d.city || d.principalSubdivision || '';
        if (!city && Array.isArray(d.localityInfo?.administrative)) {
          const cityObj = d.localityInfo.administrative.find(a => a.adminLevel === 4 || a.order === 9);
          if (cityObj) city = cityObj.name;
        }

        // Format ward
        if (ward && !ward.toLowerCase().startsWith('phường') && !ward.toLowerCase().startsWith('p.') && !ward.toLowerCase().startsWith('xã') && !ward.toLowerCase().startsWith('thị trấn')) {
          ward = `P. ${ward}`;
        }

        const parts = [];
        if (road) parts.push(road);
        if (ward && !parts.includes(ward)) parts.push(ward);
        if (district && !parts.some(p => p.toLowerCase().includes(district.toLowerCase()))) parts.push(district);
        if (city && !parts.some(p => p.toLowerCase().includes(city.toLowerCase()))) parts.push(city);

        if (parts.length > 0) {
          return {
            address: parts.join(', '),
            cityName: city || district || 'Việt Nam',
            ward: ward,
            district: district,
            road: road
          };
        }
      }
    } catch (e) {
      console.warn('BigDataCloud reverse geocode error:', e);
    }

    // Ưu tiên 2: OpenStreetMap Nominatim với timeout 3s
    try {
      const controller = new AbortController();
      const toId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi&addressdetails=1&zoom=18`, {
        signal: controller.signal
      });
      clearTimeout(toId);
      if (res.ok) {
        const d = await res.json();
        const a = d.address || {};
        const houseNum = a.house_number || '';
        const road = a.road || a.pedestrian || a.street || a.path || '';
        let ward = a.suburb || a.quarter || a.neighbourhood || a.city_district || a.subdistrict || '';
        let city = a.city || a.town || a.county || a.state || '';
        let streetPart = (houseNum && road) ? `${houseNum} ${road}` : road;
        let parts = [];
        if (streetPart) parts.push(streetPart);
        if (ward) parts.push(ward.startsWith('P.') ? ward : `P. ${ward}`);
        if (city) parts.push(city);
        if (parts.length > 0) {
          return {
            address: parts.join(', '),
            cityName: city || 'Việt Nam',
            ward: ward,
            road: streetPart
          };
        }
      }
    } catch (e) {}

    // Ưu tiên 3: Dò tìm quán ăn gần nhất nếu ở gần database
    if (typeof APP_DATA !== 'undefined' && Array.isArray(APP_DATA.foods) && APP_DATA.foods.length > 0) {
      const calcDistFn = window.calculateDistanceKm || APP_DATA.calculateDistanceKm;
      if (calcDistFn) {
        let closest = null;
        let minDist = 999;
        for (const f of APP_DATA.foods) {
          if (f.lat && f.lng) {
            const dist = calcDistFn(lat, lng, f.lat, f.lng);
            if (dist < minDist) {
              minDist = dist;
              closest = f;
            }
          }
        }
        if (closest && minDist <= 0.8) {
          return {
            address: closest.address || closest.restaurant,
            cityName: closest.cityName || 'Quy Nhơn',
            ward: closest.district || ''
          };
        }
      }
    }

    return {
      address: `Vị trí tọa độ (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      cityName: 'Vị trí hiện tại'
    };
  };

  // 2. Lấy thời tiết thực tế từ Open-Meteo API
  const fetchLiveWeather = async (lat, lng) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`;
      const res = await fetch(url);
      if (res.ok) {
        const d = await res.json();
        const cur = d.current_weather;
        if (cur) {
          const temp = Math.round(cur.temperature);
          const code = cur.weathercode;
          const wmoMap = {
            0: { condition: 'Nắng ráo', icon: '☀️' },
            1: { condition: 'Nắng nhẹ', icon: '🌤️' },
            2: { condition: 'Nhiều mây', icon: '⛅' },
            3: { condition: 'Trời u ám', icon: '☁️' },
            45: { condition: 'Sương mù', icon: '🌫️' },
            48: { condition: 'Sương lạnh đọng hạt', icon: '🌫️' },
            51: { condition: 'Mưa phùn nhẹ', icon: '🌦️' },
            53: { condition: 'Mưa phùn', icon: '🌦️' },
            55: { condition: 'Mưa phùn dày', icon: '🌧️' },
            61: { condition: 'Mưa râm ran', icon: '🌧️' },
            63: { condition: 'Mưa rào vừa', icon: '🌧️' },
            65: { condition: 'Mưa to xối xả', icon: '🌧️' },
            80: { condition: 'Mưa rào thoáng qua', icon: '🌦️' },
            81: { condition: 'Mưa rào nặng hạt', icon: '🌧️' },
            82: { condition: 'Mưa như trút nước', icon: '⛈️' },
            95: { condition: 'Dông sét', icon: '⚡' },
            96: { condition: 'Dông lốc mưa đá', icon: '⛈️' },
            99: { condition: 'Bão dông sấm sét', icon: '⛈️' }
          };
          const info = wmoMap[code] || { condition: 'Trời mát mẻ', icon: '⛅' };
          return {
            temp: `${temp}°C`,
            condition: info.condition,
            icon: info.icon,
            note: `${info.condition} ${temp}°C ${info.icon}`
          };
        }
      }
    } catch (e) {
      console.warn('Open-Meteo weather error:', e);
    }

    return {
      temp: '26°C',
      condition: 'Mát mẻ',
      icon: '⛅',
      note: '26°C ⛅'
    };
  };

  // 3. Fallback qua IP thực tế của user (ipwho.is)
  const fallbackIp = async () => {
    try {
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const d = await res.json();
        if (d && d.success) {
          const lat = d.latitude || 21.0285;
          const lng = d.longitude || 105.8542;
          const city = d.city || d.region || 'Hà Nội';
          const [geo, weather] = await Promise.all([
            reverseGeocode(lat, lng),
            fetchLiveWeather(lat, lng)
          ]);
          return {
            lat,
            lng,
            address: (geo.address && !geo.address.startsWith('Vị trí')) ? geo.address : `${city}, ${d.region || 'Việt Nam'}`,
            cityName: geo.cityName || city,
            weather,
            isIp: true
          };
        }
      }
    } catch (e) {}

    return null;
  };

  // 4. Lấy GPS trực tiếp từ trình duyệt
  const getCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation không được trình duyệt hỗ trợ.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        }),
        (err) => reject(err),
        {
          enableHighAccuracy: true,
          timeout: opts.timeout || 12000,
          maximumAge: 0
        }
      );
    });
  };

  try {
    const coords = await getCoordinates();
    const [geo, weather] = await Promise.all([
      reverseGeocode(coords.lat, coords.lng),
      fetchLiveWeather(coords.lat, coords.lng)
    ]);
    return {
      lat: coords.lat,
      lng: coords.lng,
      address: geo.address,
      cityName: geo.cityName,
      weather,
      isGps: true
    };
  } catch (err) {
    console.log('GPS error/timeout, falling back to IP:', err.message);
    const ipRes = await fallbackIp();
    if (ipRes) return ipRes;

    const defLat = 13.7735, defLng = 109.2365;
    const defWeather = await fetchLiveWeather(defLat, defLng);
    return {
      lat: defLat,
      lng: defLng,
      address: 'Nguyễn Huệ, Quy Nhơn',
      cityName: 'Quy Nhơn',
      weather: defWeather
    };
  }
}

if (typeof window !== 'undefined') {
  window.getUserLocationAndWeather = getUserLocationAndWeather;
}


class FoodApp {
  constructor() {
    this.currentTab = 'home';
    this.likedFoods = [];
    this.willReturnFoods = [];
    this.currentMood = (typeof APP_DATA !== 'undefined' && APP_DATA.currentMoodId) ? APP_DATA.currentMoodId : 'rainy_hotpot';
    this.isPhoneFrame = true;
    this.searchQuery = '';
    this.feedLimit = 24;
    this.feedBatchSize = 24;
    this.moodFilter = {
      moodId: this.currentMood,
      selectedCategories: [],
      maxRadius: 0,
      companion: 'all',
      selectedArea: 'all',
      openOnly: true,
      shopeeOnly: false,
      highRatingOnly: false,
      priceTier: 'all'
    };
  }

  ensureMoodFilter() {
    if (!this.moodFilter) {
      this.moodFilter = {
        moodId: this.currentMood || (typeof APP_DATA !== 'undefined' && APP_DATA.currentMoodId) || 'rainy_hotpot',
        selectedCategories: [],
        maxRadius: 0,
        companion: 'all',
        selectedArea: 'all',
        openOnly: true,
        shopeeOnly: false,
        highRatingOnly: false,
        priceTier: 'all'
      };
    }
    if (!Array.isArray(this.moodFilter.selectedCategories)) {
      this.moodFilter.selectedCategories = [];
    }
    return this.moodFilter;
  }

  // Compatibility aliases
  applyMoodFilter() {
    return this.applyMoodFilters();
  }

  resetMoodFilter() {
    return this.resetMoodFilters();
  }

  toggleFilterCategory(catId) {
    return this.modalToggleCategory(catId);
  }

  handleHomeSearch(val) {
    const text = (val || '').trim();
    const clearBtn = document.getElementById('home-search-clear-btn');
    if (clearBtn) {
      if (text.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    // Nếu người dùng xóa trắng ô nhập khi đang có kết quả tìm kiếm thì tự động trả về gợi ý ban đầu
    if (text.length === 0 && this.searchQuery) {
      this.searchQuery = '';
      this.feedLimit = 24;
      this.renderBentoAndFeed();
    }
  }

  submitHomeSearch() {
    const input = document.getElementById('home-food-search');
    const val = input ? input.value : this.searchQuery;
    const trimmed = (val || '').trim();

    // Ẩn bàn phím ảo trên điện thoại để người dùng thấy rõ kết quả
    if (input) {
      input.blur();
    }

    if (!trimmed) {
      this.clearHomeSearch();
      return;
    }

    this.searchQuery = trimmed;
    this.feedLimit = 24;
    this.renderBentoAndFeed();

    // Cuộn nhẹ tới danh sách kết quả món ăn
    const targetSection = document.getElementById('featured-card-container');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
  }

  clearHomeSearch() {
    this.searchQuery = '';
    this.feedLimit = 24;
    const input = document.getElementById('home-food-search');
    if (input) {
      input.value = '';
    }
    const clearBtn = document.getElementById('home-search-clear-btn');
    if (clearBtn) clearBtn.classList.add('hidden');
    this.renderBentoAndFeed();
  }

  buildFoodCardHtml(food, status, isLiked) {
    if (!status) {
      status = window.getRestaurantStatus ? window.getRestaurantStatus(food) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
    }
    if (typeof isLiked === 'undefined') {
      isLiked = Array.isArray(this.likedFoods) && this.likedFoods.some(f => (f && f.id ? f.id === food.id : f === food.id));
    }
    const distText = (food.distanceText || '').replace('Cách bạn ', '');
    const priceText = window.formatPriceRange ? window.formatPriceRange(food.priceRange) : (food.priceRange || '35.000đ ~ 65.000đ');

    return `
      <div class="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:-translate-y-0.5 ${!status.isOpen ? 'is-closed' : ''}">
        <!-- Card Image & Status Badges -->
        <div class="cursor-pointer" onclick="window.app.showFoodDetail(${food.id})">
          <div class="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
            <img src="${food.image}"
                 alt="${food.name}"
                 loading="lazy"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!status.isOpen ? 'is-closed-img grayscale' : ''}"
                 data-name="${(food.name || '').replace(/"/g, '&quot;')}"
                 data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
                 data-category="${food.category || ''}"
                 onerror="window.handleFoodImageError ? window.handleFoodImageError(this, '${(food.name || '').replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}') : (this.onerror=null, this.src='images/tra_sua_nuong_may_may.jpg')" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 pointer-events-none"></div>

            <!-- Top floating badges -->
            <div class="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <!-- Open / Closed Badge -->
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs flex items-center gap-1 backdrop-blur-md ${status.isOpen ? 'bg-emerald-600/95 text-white' : 'bg-stone-800/90 text-stone-300'}">
                <span class="w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-white animate-pulse' : 'bg-rose-400'}"></span>
                <span>${status.isOpen ? 'Đang mở' : 'Đóng cửa'}</span>
              </span>

              <!-- Rating badge -->
              <span class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-stone-900/80 backdrop-blur-md text-amber-300 flex items-center gap-0.5 shadow-xs">
                <span>★</span>
                <span>${food.rating || 4.5}</span>
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-3 space-y-1.5">
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
              <span>🕒 ${food.openTime || '07:00 - 22:30'}</span>
              <span class="${status.isOpen ? 'text-stone-400 font-normal' : 'text-rose-500 font-bold'}">(${status.detailText || (status.isOpen ? 'Đang mở cửa' : 'Đã đóng cửa')})</span>
            </div>

            <div class="flex items-center justify-between text-[11px] pt-1">
              <span class="font-bold text-rose-600">${priceText}</span>
              <span class="text-stone-400 flex items-center gap-0.5 cursor-pointer hover:text-amber-600" onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})" title="Xem vị trí quán trên bản đồ">
                <svg class="w-3 h-3 inline text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                ${distText}
              </span>
            </div>
          </div>
        </div>

        <!-- Bottom Actions: 1. Thích, 2. Bản đồ, 3. Đặt ShopeeFood -->
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

          <!-- 3. Đặt ShopeeFood (chỉ hiện khi quán có trên ShopeeFood) -->
          ${(window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : (food.hasShopeeDelivery === true)) ? (
            status.isOpen ? `
            <button onclick="event.stopPropagation();window.app.openShopeeFoodDelivery(${food.id})"
              class="flex-1 h-8 bg-gradient-to-r from-orange-500 to-[#EE4D2D] hover:from-orange-600 hover:to-[#D73211] text-white rounded-xl text-[11px] font-extrabold shadow-sm shadow-orange-300/80 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Đặt món qua ShopeeFood">
              ${window.getShopeeIcon ? window.getShopeeIcon(18, 'shrink-0') : ''}
              <span>ShopeeFood</span>
            </button>
            ` : `
            <button disabled
              class="flex-1 h-8 bg-stone-100 border border-stone-200 text-stone-400 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60 pointer-events-none select-none"
              title="Quán hiện đã đóng cửa">
              ${window.getShopeeIcon ? window.getShopeeIcon(18, 'shrink-0 filter grayscale opacity-50') : ''}
              <span>ShopeeFood</span>
            </button>
            `
          ) : `
          <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
            class="flex-1 h-8 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Đến quán thưởng thức trực tiếp">
            <span>Xem đường đi</span>
          </button>
          `}
        </div>
      </div>
    `;
  }



  init() {
    // Tự động khôi phục vị trí & thời tiết đã lưu từ phiên trước nếu còn mới (< 3 giờ)
    try {
      const savedLoc = localStorage.getItem('foodtinder_user_loc_weather');
      if (savedLoc) {
        const parsed = JSON.parse(savedLoc);
        if (parsed && (Date.now() - (parsed.timestamp || 0) < 3 * 3600 * 1000)) {
          this.applyUserLocationAndWeather(parsed, { skipRender: true });
        }
      }
    } catch (e) {}

    // Load liked from localStorage if available (V2 Schema with V1 Fallback)
    this.likedFoods = this.loadLikedFoodsFromStorage();

    // Cross-tab storage synchronization listener
    if (typeof window !== 'undefined' && !this._hasStorageListener) {
      this._hasStorageListener = true;
      window.addEventListener('storage', (e) => {
        if (e.key === 'foodtinder_wishlist_v2' || e.key === 'foodtinder_liked' || e.key === 'foodtinder_swipe_history_v2' || e.key === 'foodtinder_user_stats') {
          this.likedFoods = this.loadLikedFoodsFromStorage();
          if (window.swipeManager && typeof window.swipeManager.loadSwipeHistory === 'function') {
            window.swipeManager.loadSwipeHistory();
          }
          this.syncWishlistAndProfileStats();
          if (this.currentTab === 'liked') {
            this.renderLikedView();
          }
        }
      });
    }

    // Load will_return from localStorage
    try {
      const savedReturn = localStorage.getItem('foodtinder_will_return');
      if (savedReturn) {
        this.willReturnFoods = JSON.parse(savedReturn);
      }
    } catch (e) {}

    // 3. Kiểm soát chất lượng dữ liệu: Xoá toàn bộ quán thiếu ảnh, rating thấp < 4.0, quán đóng cửa và quán ảo khỏi Database
    if (typeof APP_DATA !== 'undefined' && Array.isArray(APP_DATA.foods)) {
      APP_DATA.foods = APP_DATA.foods.filter(f => {
        if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(f)) return false;
        if (typeof isPermanentlyClosedRestaurant === 'function' && isPermanentlyClosedRestaurant(f)) return false;
        if (typeof window.isFakeDummyFood === 'function' && window.isFakeDummyFood(f)) return false;
        return true;
      });

      // Áp dụng thuật toán tính khoảng cách thực tế (Haversine) cho toàn bộ quán ăn trong Database
      const userLoc = APP_DATA.homeLocation || { lat: 13.7735, lng: 109.2365 };
      const calcDistFn = window.calculateDistanceKm || APP_DATA.calculateDistanceKm;
      const formatDistFn = window.formatDistanceText || APP_DATA.formatDistanceText;
      if (calcDistFn && formatDistFn) {
        APP_DATA.foods.forEach(f => {
          if (f.latitude === undefined && f.lat !== undefined) f.latitude = Number(f.lat);
          if (f.longitude === undefined && f.lng !== undefined) f.longitude = Number(f.lng);
          if (f.lat && f.lng) {
            const realDist = calcDistFn(userLoc.lat, userLoc.lng, f.lat, f.lng);
            f.distance = Number(realDist.toFixed(1));
            f.distanceText = formatDistFn(realDist);
          }
        });
      }
    }

    // Initialize components
    this.renderHeader();
    this.renderMoodSelector();
    this.renderBentoAndFeed();
    this.renderFoodGrid();
    this.renderMiniMap();
    this.renderNearbyGrid();
    this.syncWishlistAndProfileStats();

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

    // Tự động yêu cầu và kích hoạt định vị ngay khi mở trang
    this.detectUserLocationAndWeather({ auto: true });

    // Kích hoạt Offline-First Data Loader & Version Control (IndexedDB + 60-byte Version Checker)
    if (window.dataLoader) {
      window.dataLoader.load(
        (initialFoods) => {
          if (initialFoods && initialFoods.length > 0) {
            this.refreshFoods(initialFoods);
          }
          this.checkDeeplinkInvite();
        },
        (updatedFoods) => {
          console.log(`✨ [App] Nhận bản cập nhật dữ liệu mới (${updatedFoods.length} quán)!`);
          this.refreshFoods(updatedFoods);
          this.showToast(`✨ Đã cập nhật ${updatedFoods.length} quán ăn phiên bản mới!`);
          this.checkDeeplinkInvite();
        }
      );
    } else {
      setTimeout(() => this.checkDeeplinkInvite(), 300);
    }

    // Luôn hỏi tâm trạng của user khi vào app để suggest đúng món theo tâm trạng
    setTimeout(() => {
      const onboardingModal = document.getElementById('taste-onboarding-modal');
      const authModal = document.getElementById('auth-modal');
      const isSurveyOpen = onboardingModal && !onboardingModal.classList.contains('hidden');
      const isAuthOpen = authModal && !authModal.classList.contains('hidden');
      const hasAskedThisSession = sessionStorage.getItem('foodtinder_session_mood_asked');

      if (!isSurveyOpen && !isAuthOpen && !hasAskedThisSession) {
        this.openTodayMoodModal();
      }
    }, 1200);
  }

  /**
   * Cập nhật danh sách món ăn từ Offline Cache hoặc CDN Update
   */
  refreshFoods(newFoods) {
    if (!Array.isArray(newFoods) || newFoods.length === 0) return;

    // Luôn lọc bỏ triệt để quán đóng cửa vĩnh viễn, bar/pub/club không ăn uống hoặc quán ảo
    newFoods = newFoods.filter(f => {
      if (typeof window.isPermanentlyClosedRestaurant === 'function' && window.isPermanentlyClosedRestaurant(f)) return false;
      if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(f)) return false;
      if (typeof window.isFakeDummyFood === 'function' && window.isFakeDummyFood(f)) return false;
      return true;
    });

    if (typeof APP_DATA !== 'undefined') {
      APP_DATA.foods = newFoods;
    }
    window.APP_DATA = APP_DATA;

    // Áp dụng thuật toán tính khoảng cách thực tế (Haversine)
    const qnCenter = { lat: 13.7765, lng: 109.2235 };
    const userLoc = APP_DATA.homeLocation || qnCenter;
    const calcDistFn = window.calculateDistanceKm || APP_DATA.calculateDistanceKm;
    const formatDistFn = window.formatDistanceText || APP_DATA.formatDistanceText;
    const distToQuyNhon = calcDistFn ? calcDistFn(userLoc.lat, userLoc.lng, qnCenter.lat, qnCenter.lng) : 0;
    const isFarFromQuyNhon = distToQuyNhon > 45 || (APP_DATA.currentCity && APP_DATA.currentCity.cityId !== 'quynhon');

    if (calcDistFn && formatDistFn) {
      APP_DATA.foods.forEach(f => {
        if (f.latitude === undefined && f.lat !== undefined) f.latitude = Number(f.lat);
        if (f.longitude === undefined && f.lng !== undefined) f.longitude = Number(f.lng);
        if (f.lat && f.lng) {
          // Nếu ở tỉnh khác xa Quy Nhơn, tính khoảng cách quán Quy Nhơn từ trung tâm Quy Nhơn
          // để tránh hiện khoảng cách 409km vô lý trên thẻ giao hàng
          const isQuyNhonFood = (f.cityId === 'quynhon' || !f.cityId || (f.address && f.address.toLowerCase().includes('quy nhơn')));
          const originLat = (isFarFromQuyNhon && isQuyNhonFood) ? qnCenter.lat : userLoc.lat;
          const originLng = (isFarFromQuyNhon && isQuyNhonFood) ? qnCenter.lng : userLoc.lng;
          const realDist = calcDistFn(originLat, originLng, f.lat, f.lng);
          f.distance = Number(realDist.toFixed(1));
          f.distanceText = formatDistFn(realDist);
        }
      });
    }

    // Cập nhật lại UI các component
    this.renderFoodGrid();
    this.renderNearbyGrid();
    this.updateBentoStats();
    if (window.swipeManager) {
      const moodFoods = this.getFoodsForCurrentMood();
      window.swipeManager.loadCards(moodFoods.length > 0 ? moodFoods : (APP_DATA.foods || []));
    }
    if (window.tasteManager) {
      window.tasteManager.renderLocationRecommendations();
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Kích hoạt lấy đúng vị trí GPS và thời tiết của user
   */
  async detectUserLocationAndWeather(options = {}) {
    const isManual = options.manual || false;
    const addrLabel = document.getElementById('user-current-address-label');

    if (addrLabel && (!APP_DATA.currentCity.address || APP_DATA.currentCity.address.includes('Đang xác định'))) {
      addrLabel.innerHTML = `
        <span class="inline-flex items-center gap-1.5 text-stone-500 font-medium">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Đang xác định vị trí của bạn...</span>
        </span>
      `;
    }

    try {
      const result = await window.getUserLocationAndWeather(options);
      if (result) {
        this.applyUserLocationAndWeather(result);
        if (isManual) {
          window.soundFX && window.soundFX.playMatch();
          this.showToast(`📍 Đã định vị: ${result.address} (${result.weather.note})`);
        }
        return result;
      }
    } catch (err) {
      console.warn('detectUserLocationAndWeather error:', err);
      if (isManual) {
        this.showToast('Không thể lấy vị trí GPS. Hãy kiểm tra cài đặt định vị trên trình duyệt!');
      }
    }
    return null;
  }

  /**
   * Áp dụng dữ liệu vị trí và thời tiết vào hệ thống
   */
  applyUserLocationAndWeather(result, opts = {}) {
    if (!result) return;
    const { lat, lng, address, cityName, weather } = result;

    const cleanCity = (cityName || '').toLowerCase();
    const matchedOpt = (APP_DATA.districtOptions || []).find(w => {
      const wName = (w.shortName || w.city || '').toLowerCase();
      return cleanCity.includes(wName) || wName.includes(cleanCity);
    }) || (APP_DATA.weatherOptions || []).find(w => {
      const wName = (w.shortName || w.city || '').toLowerCase();
      return cleanCity.includes(wName) || wName.includes(cleanCity);
    });

    let resolvedCityId = matchedOpt?.cityId || 'quynhon';
    let resolvedCityName = matchedOpt?.shortName || matchedOpt?.city || cityName || 'Quy Nhơn';
    let resolvedProvince = matchedOpt?.province || matchedOpt?.parentProvince || resolvedCityName;

    if (cleanCity.includes('quy nhơn') || cleanCity.includes('binhdinh') || cleanCity.includes('bình định')) {
      resolvedCityId = 'quynhon';
      resolvedCityName = 'Quy Nhơn';
      resolvedProvince = 'Bình Định';
    }

    APP_DATA.currentCity = {
      cityId: resolvedCityId,
      name: resolvedCityName,
      province: resolvedProvince,
      address: address || 'Vị trí hiện tại',
      lat: Number(lat),
      lng: Number(lng),
      weather: weather || {
        temp: '26°C',
        condition: 'Mát mẻ',
        icon: '⛅',
        note: '26°C ⛅'
      }
    };

    APP_DATA.homeLocation = {
      lat: Number(lat),
      lng: Number(lng)
    };

    // If matched location has specialties, ensure they are registered in APP_DATA.foods
    if (matchedOpt && Array.isArray(matchedOpt.specialties) && matchedOpt.specialties.length > 0) {
      matchedOpt.specialties.forEach((spec, sIdx) => {
        let parsedRest = spec.name;
        let parsedAddr = spec.address || matchedOpt?.address || address || '';
        if (spec.rest) {
          if (/[-–—]/.test(spec.rest)) {
            const parts = spec.rest.split(/[-–—]/);
            parsedRest = parts[0].trim();
            const branch = parts.slice(1).join(' - ').trim();
            if (branch && !spec.address) {
              parsedAddr = branch;
              const cleanC = (matchedOpt?.shortName || matchedOpt?.city || resolvedCityName || '').split('(')[0].replace(/cũ/gi, '').trim();
              if (cleanC && !parsedAddr.toLowerCase().includes(cleanC.toLowerCase())) {
                parsedAddr += `, ${cleanC}`;
              }
            }
          } else {
            parsedRest = spec.rest.trim();
          }
        }

        const foodId = 6000 + Math.abs(Math.round(lat * 100)) + sIdx;
        const foodLat = (spec.latitude !== undefined && spec.latitude !== null) ? spec.latitude : (spec.lat || (lat + (sIdx * 0.002)));
        const foodLng = (spec.longitude !== undefined && spec.longitude !== null) ? spec.longitude : (spec.lng || (lng + (sIdx * 0.002)));

        const existingFood = APP_DATA.foods.find(f => f.id === foodId || (f.name === spec.name && f.cityId === matchedOpt.cityId));
        if (existingFood) {
          existingFood.restaurant = parsedRest;
          existingFood.address = parsedAddr;
          existingFood.lat = foodLat;
          existingFood.lng = foodLng;
          existingFood.latitude = foodLat;
          existingFood.longitude = foodLng;
        } else {
          APP_DATA.foods.push({
            id: foodId,
            cityId: matchedOpt.cityId,
            cityName: matchedOpt.shortName || matchedOpt.city,
            name: spec.name,
            restaurant: parsedRest,
            address: parsedAddr,
            distance: 0.5 + sIdx * 0.3,
            distanceText: `Cách bạn ${(500 + sIdx * 300)}m`,
            weatherNote: `${weather.condition} ${weather.temp}`,
            priceRange: spec.price || "45.000đ - 85.000đ",
            rating: 4.8,
            reviewCount: 320,
            lat: foodLat,
            lng: foodLng,
            latitude: foodLat,
            longitude: foodLng,
            category: spec.cat || "streetfood",
            moodIds: ["comfort", "chill", "craving", "energetic", "sad"],
            tags: spec.tags || ["#Đặc_sản", "#Nóng_hổi", "#Đậm_đà"],
            sideRibbon: ["#đặc_sản_địa_phương", "#chuẩn_vị"],
            recommendReason: spec.reason || `Đặc sản trứ danh tại ${matchedOpt.city}.`,
            image: spec.img || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
            gallery: [spec.img || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"],
            likesCount: 520,
            commentsCount: 45,
            openTime: "07:00 - 22:00",
            desc: `Đặc sản địa phương trứ danh tại ${matchedOpt.city}.`
          });
        }
      });
    }

    try {
      localStorage.setItem('foodtinder_user_loc_weather', JSON.stringify({
        lat, lng, address, cityName: resolvedCityName, weather, timestamp: Date.now()
      }));
    } catch (e) {}

    // Cập nhật khoảng cách thực tế (Haversine) cho toàn bộ quán ăn theo GPS người dùng
    const calcDistFn = window.calculateDistanceKm || (window.APP_DATA && window.APP_DATA.calculateDistanceKm);
    const formatDistFn = window.formatDistanceText || (window.APP_DATA && window.APP_DATA.formatDistanceText);
    const qnCenter = { lat: 13.7765, lng: 109.2235 };
    const distToQuyNhon = calcDistFn ? calcDistFn(lat, lng, qnCenter.lat, qnCenter.lng) : 0;
    const isFarFromQuyNhon = distToQuyNhon > 45 || resolvedCityId !== 'quynhon';
    APP_DATA.isDemoLocation = isFarFromQuyNhon;
    APP_DATA.detectedCityName = cityName || resolvedCityName;

    if (calcDistFn && formatDistFn && Array.isArray(APP_DATA.foods)) {
      APP_DATA.foods.forEach(f => {
        const fLat = Number(f.lat !== undefined ? f.lat : f.latitude);
        const fLng = Number(f.lng !== undefined ? f.lng : f.longitude);
        if (!isNaN(fLat) && !isNaN(fLng)) {
          // Nếu ở tỉnh khác xa Quy Nhơn, tính khoảng cách quán Quy Nhơn từ trung tâm Quy Nhơn
          // để tránh hiện khoảng cách 409km vô lý trên thẻ giao hàng
          const isQuyNhonFood = (f.cityId === 'quynhon' || !f.cityId || (f.address && f.address.toLowerCase().includes('quy nhơn')));
          const originLat = (isFarFromQuyNhon && isQuyNhonFood) ? qnCenter.lat : lat;
          const originLng = (isFarFromQuyNhon && isQuyNhonFood) ? qnCenter.lng : lng;
          const d = calcDistFn(originLat, originLng, fLat, fLng);
          f.distance = Number(d.toFixed(1));
          f.distanceText = formatDistFn(d);
        }
      });
    }

    if (!opts.skipRender) {
      this.renderHeader();
      this.renderBentoAndFeed();
      this.renderFoodGrid();
      this.updateBentoStats();
      this.renderMiniMap();
      this.renderNearbyGrid();

      if (window.swipeManager) {
        const moodFoods = this.getFoodsForCurrentMood();
        window.swipeManager.loadCards(moodFoods.length > 0 ? moodFoods : (APP_DATA.foods || []));
      }

      if (window.tasteManager && typeof window.tasteManager.renderLocationRecommendations === 'function') {
        window.tasteManager.renderLocationRecommendations();
      }
    }
  }

  doesFoodMatchMood(food, moodId) {
    if (!food || !moodId) return true;
    const name = (food.name || '').toLowerCase();
    const rest = (food.restaurant || '').toLowerCase();
    const cat = (food.category || '').toLowerCase();
    const desc = (food.desc || '').toLowerCase();
    const tags = Array.isArray(food.tags) ? food.tags.map(t => String(t).toLowerCase()) : [];
    const allText = `${name} ${rest} ${cat} ${desc} ${tags.join(' ')}`;

    switch (moodId) {
      case 'stress': { // Xả stress / Căng thẳng: ưu tiên đồ cay xé lưỡi kích thích endorphin hoặc đồ giòn rụm nhai xả stress
        const isSpicy = /cay|sa tế|tomyum|sốt thái|ớt xiêm|mì cay|xé lưỡi|lẩu thái|măng cay/.test(allText);
        const isCrunchy = /giòn|bánh xèo|chả ram|chiên|rán|bánh tráng|chân gà|nem lụi|nem chua rán/.test(allText);
        return isSpicy || isCrunchy;
      }

      case 'sweet': { // Thèm ngọt: CHỈ hiện các quán bánh, đồ ngọt, chè, kem, trà sữa
        // 1. Chặn tuyệt đối các món mặn: cơm gà, bún bò, bún cá, phở, lẩu, bánh xèo, thịt nướng...
        const isSavoryMeal = /cơm gà|cơm tấm|cơm niêu|cơm sườn|bún bò|bún cá|bún sứa|bún riêu|bún chả|bún đậu|phở|bánh canh|hủ tiếu|mì quảng|bánh xèo|chả ram|lẩu |lẩu hải sản|hải sản tươi sống|mực lá|bò né|gà chỉ|ốc luộc|bò nướng|gà nướng|thịt nướng/.test(name);
        if (isSavoryMeal) return false;

        // 2. Phải là quán đồ ngọt / đồ uống
        const isSweet = ['dessert', 'boba', 'cafe', 'bakery'].includes(cat) ||
          /trà sữa|chè|kem|bánh ngọt|tiệm bánh|bakery|cake|gelato|flan|bingsu|sinh tố|nước ép|trà đào|trà dâu|trà trái cây|sữa chua|boba|đường đen|caramel|pudding|tàu hũ|chè nhớ|bánh su|waffle|crepe|tiramisu|matcha|kem bơ|kem ý|thạch phô mai/.test(allText);
        return Boolean(isSweet);
      }

      case 'zen': { // Thanh tịnh: CHỈ hiển thị các quán chay / món chay thuần chay
        return window.isVegetarianFood ? window.isVegetarianFood(food) : (cat === 'vegetarian' || allText.includes('chay'));
      }

      case 'seafood': { // Hải sản: CHỈ hiện các quán và món hải sản tươi sống đặc sản biển (KHÔNG nhận bánh xèo tôm, mì quảng tôm)
        // 1. Chặn triệt để: Món ăn vặt / điểm tâm sáng / bún phở dù có dùng nguyên liệu tôm, cua hay chả cá
        const isExcluded = /bánh xèo|bánh tráng|mì quảng|bánh canh|bún bò|bún chả cá|bún cá|bún riêu|phở|bánh mì|hủ tiếu|xôi|chè|trà sữa|cà phê|tiệm trà|sinh tố|bánh bèo|chả ram/.test(name) ||
                           /bánh xèo|mì quảng|bánh mì|tiệm trà|trà sữa|cà phê/.test(rest);
        if (isExcluded) return false;

        // 2. Phải là: Quán chuyên hải sản, quán ốc, ghẹ hoặc món hải sản tươi sống
        const isSeafoodDirect = cat === 'seafood' ||
          /hải sản|quán ốc|ốc biển|ốc hương|cua huỳnh đế|ghẹ|nghĩa ghẹ|vua ghẹ|tôm hùm|tôm tích|tôm nướng|mực lá|mực hấp|mực nướng|cá mú|cá tà ma|sò huyết|sò điệp|hàu nướng|nhum biển|nghêu|ngêu|chíp chíp|vẹm|bào ngư|lẩu hải sản|đặc sản biển/.test(allText);

        const isNotSeafood = cat === 'vegetarian' || cat === 'boba' || allText.includes('chay') || allText.includes('trà sữa');
        return isSeafoodDirect && !isNotSeafood;
      }

      case 'spicy': { // Thèm cay: món cay xé lưỡi, mì cay, lẩu thái, sa tế
        return /cay|sa tế|tomyum|sốt thái|ớt xiêm|mì cay|chua cay|sốt cay|xé lưỡi|lẩu thái|măng cay/.test(allText);
      }

      case 'hangout': { // Lai rai: mồi bén, quán nhậu, nem nướng, chân gà, bia, đồ nướng
        const isHangout = /quán nhậu|nướng|bbq|mực lá|chân gà|bia|nem nướng|xì xèo|ốc|mồi|lai rai/.test(allText);
        const isSweetOnly = ['boba'].includes(cat) && !/ăn vặt|ốc|chân gà/.test(allText);
        return isHangout && !isSweetOnly;
      }

      case 'chill': { // Thư giãn: quán cafe, trà sữa, tiệm bánh, ăn vặt nhẹ nhàng
        return ['cafe', 'boba', 'dessert', 'bakery'].includes(cat) ||
          /cà phê|cafe|coffee|trà sữa|trà hoa|trà đào|chè|kem|bánh ngọt|tiệm trà|tiệm bánh|sinh tố/.test(allText);
      }

      case 'healthy': { // Eat Clean: chay, salad, rau củ, nước ép, thanh đạm
        const isHealthy = /chay|salad|rau|nước ép|sinh tố|sữa chua|thanh đạm|eat clean|sứa|bún cá thanh/.test(allText);
        const isGreasy = /nướng mỡ|chiên giòn|thịt mỡ|lẩu cay|gà rán/.test(name);
        return isHealthy && !isGreasy;
      }

      case 'budget': { // Viêm túi: giá min <= 50k
        const minPrice = window.getFoodMinPrice ? window.getFoodMinPrice(food) : (food.priceMin || 35000);
        return minPrice <= 50000;
      }

      case 'late_night': { // Ăn đêm: quán mở khuya sau 22:30 hoặc cháo đêm, ốc đêm
        const openTime = food.openTime || '';
        return /22:30|23:|24:|00:|01:|02:|23h|24h/.test(openTime) || /ăn đêm|khuya|cháo đêm|ốc đêm/.test(allText);
      }

      case 'refreshing': { // Giải nhiệt: trà trái cây, nước ép, sinh tố, dừa, kem, chè mát
        return /trà |nước ép|sinh tố|dừa|kem|chè|sứa|thanh mát|giải nhiệt|đá bào/.test(allText);
      }

      case 'quick': { // Nhanh gọn: bánh mì, xôi, bánh bao, bánh bèo, ăn liền
        return /bánh mì|xôi|bánh bao|bánh bèo|bò né|nhanh gọn|tiện lợi/.test(allText);
      }

      case 'celebrate': { // Tự thưởng: tiệc hải sản tươi sống, buffet, lẩu tiệc, steak
        return (food.priceMax && food.priceMax >= 90000) || /tôm hùm|cua huỳnh đế|cá mú|bò bít tết|hải sản tươi sống|buffet|tiệc|đại tiệc/.test(allText);
      }

      case 'date': { // Hẹn hò: view biển, rooftop, cà phê lãng mạn, steak, sushi
        return /view biển|lãng mạn|rooftop|steak|pizza|sushi|bờ biển|acoustic|sang trọng|chill/.test(allText);
      }

      case 'tired': { // Mệt mỏi: cháo ấm, súp, bún cá nước trong, thanh đạm
        const isLight = /cháo|súp|bánh canh|bún riêu|bún cá|bún sứa|phở|chay|thanh đạm|nước dừa/.test(allText);
        const isHeavy = /nướng than|bbq|chiên giòn|lẩu cay|quán nhậu/.test(name);
        return isLight && !isHeavy;
      }

      case 'comfort': { // Cần vỗ về: món nước nóng hổi, bún bò, cháo, chè ấm, súp
        return /bánh canh|bún bò|cháo|chè|súp|hủ tiếu|phở|ấm áp|béo|nóng hổi/.test(allText);
      }

      case 'craving': // Thèm ăn ngon: món ngon đậm đà đặc sản
      case 'energetic': // Sôi động: món nhậu, nướng, lẩu, hội bạn
      default:
        return Array.isArray(food.moodIds) ? food.moodIds.includes(moodId) : true;
    }
  }

  // ==========================================================
  // THUẬT TOÁN ĐỀ XUẤT THÔNG MINH FOODTINDER (4 TRỤ CỘT & FALLBACK)
  // ==========================================================

  // 1. XÂY DỰNG MA TRẬN THUỘC TÍNH (ATTRIBUTE MATRIX)
  calculateMoodRelevance(food, moodId) {
    if (!food || !moodId) return 0;
    // Kiểm tra tính phù hợp tuyệt đối: Nếu không khớp tiêu chí tâm trạng thì loại bỏ triệt để
    if (!this.doesFoodMatchMood(food, moodId)) {
      return -9999;
    }

    const matrix = window.MOOD_ATTRIBUTE_MATRIX || {};
    const moodWeights = matrix[moodId] || {};
    const foodAttrs = Array.isArray(food.attributes) ? food.attributes : [];

    // Lấy thông tin phiên sử dụng (Session-based Learning)
    const sessionState = this.getSessionLearningState();
    const fatiguedAttrs = sessionState.fatiguedAttrs || [];
    const counterTasteBonus = sessionState.counterTasteBonus || {};

    let moodScore = 100; // Điểm nền tảng khi đã khớp tiêu chuẩn tâm trạng
    let matchedAttrCount = 0;

    // Tính điểm theo ma trận thuộc tính vị giác
    foodAttrs.forEach(attr => {
      let weight = (typeof moodWeights[attr] === 'number') ? moodWeights[attr] : 0;

      // 3. Học từ lịch sử Swipe: nếu tag bị quẹt trái liên tiếp >= 3 lần -> giảm trọng số 65%
      if (fatiguedAttrs.includes(attr)) {
        weight = weight * 0.35;
      }

      moodScore += weight * 35;
      if (weight > 0.5) matchedAttrCount++;

      // Trộn thêm điểm từ thuộc tính đối trọng nếu người dùng đang chán tag cũ
      if (counterTasteBonus[attr]) {
        moodScore += counterTasteBonus[attr];
      }
    });

    // Thưởng cho các món kết hợp đa thuộc tính khớp hoàn hảo
    if (matchedAttrCount >= 2) moodScore += 25;

    // 4. Dữ liệu từ Đám đông (Crowdsourcing Tags)
    const crowdScore = this.getCrowdsourceScore(food.id, moodId);
    moodScore += Math.min(30, crowdScore * 3);

    return Math.round(moodScore);
  }

  // 2. THUẬT TOÁN KẾT HỢP NGỮ CẢNH (CONTEXTUAL FUSION)
  // Công thức: Điểm_Phù_Hợp = (Điểm_Tâm_Trạng x 2) + Điểm_Thời_Tiết + Điểm_Thời_Gian
  calculateContextualFusionScore(food, moodId, weather = null, now = new Date()) {
    if (!food) return 0;
    const moodScore = this.calculateMoodRelevance(food, moodId);
    if (moodScore <= -9000) return -9999;

    const foodAttrs = Array.isArray(food.attributes) ? food.attributes : [];
    const currentHour = now.getHours();

    // Phân tích dữ liệu thời tiết thực tế
    const curWeather = weather || APP_DATA?.currentCity?.weather || { temp: '26°C', condition: 'nhiều mây', icon: '⛅' };
    const tempNum = parseInt(curWeather.temp, 10) || 26;
    const cond = String(curWeather.condition || '').toLowerCase();
    const icon = String(curWeather.icon || '');
    const isRain = cond.includes('mưa') || cond.includes('rain') || icon.includes('🌧️');
    const isCold = tempNum <= 23 || cond.includes('lạnh');
    const isHot = tempNum >= 30 || cond.includes('nóng') || cond.includes('nắng');
    const isScorchingAtNoon = tempNum >= 32 && (currentHour >= 11 && currentHour <= 14);

    // Điểm_Thời_Tiết
    let weatherScore = 0;
    if (isScorchingAtNoon) {
      // Nắng gắt 32°C - 34°C lúc 12h trưa: Món súp/lẩu bị trừ điểm nặng, đẩy chè/kem/đồ mát lên
      if (foodAttrs.includes('hot_soup')) weatherScore -= 60;
      if (foodAttrs.includes('heavy')) weatherScore -= 30;
      if (foodAttrs.includes('spicy')) weatherScore -= 25;
      if (foodAttrs.includes('sweet') || foodAttrs.includes('drinks') || foodAttrs.includes('light')) {
        weatherScore += 45;
      }
    } else if (isHot) {
      if (foodAttrs.includes('hot_soup')) weatherScore -= 45;
      if (foodAttrs.includes('heavy')) weatherScore -= 20;
      if (foodAttrs.includes('spicy')) weatherScore -= 15;
      if (foodAttrs.includes('drinks') || foodAttrs.includes('sweet') || foodAttrs.includes('light')) {
        weatherScore += 35;
      }
    } else if (isRain || isCold) {
      // Trời mưa hoặc se lạnh (<= 24°C) lúc tối: Bún chả cá, bún sứa, lẩu bò được cộng điểm tối đa
      if (foodAttrs.includes('hot_soup')) weatherScore += 45;
      if (foodAttrs.includes('spicy')) weatherScore += 25;
      if (foodAttrs.includes('drinks') && !foodAttrs.includes('hot_soup')) weatherScore -= 15;
    } else {
      // Mát mẻ dễ chịu 24°C - 28°C: cộng điểm cho món ăn vặt giòn rụm hoặc mồi nhậu bờ biển
      if (foodAttrs.includes('crunchy') || foodAttrs.includes('salty')) weatherScore += 15;
    }

    // Điểm_Thời_Gian (Time-of-Day Dynamics - Điều tiết sâu theo khung giờ ăn uống thực tế)
    let timeScore = 0;
    const cat = (food.category || '').toLowerCase();
    const name = (food.name || '').toLowerCase();

    if (currentHour >= 6 && currentHour < 10) {
      // 1. SÁNG (06:00 - 10:00): Điểm tâm sáng & Cà phê
      if (/bún|phở|bánh mì|bánh hỏi|cháo|hủ tiếu|bò kho|bánh cuốn/.test(name) || cat === 'cafe') {
        timeScore += 55;
      }
      // Phạt nặng: Sáng sớm không ai đi ăn lẩu khổng lồ, nhậu hải sản hay nướng BBQ
      if (cat === 'seafood' || cat === 'hotpot' || cat === 'bbq' || /quán nhậu|mồi bén|bia/.test(name)) {
        timeScore -= 80;
      }
    } else if (currentHour >= 11 && currentHour <= 13) {
      // 2. TRƯA (11:00 - 13:30): Cơm trưa, bún phở chắc dạ
      if (cat === 'rice' || /cơm gà|cơm tấm|cơm niêu|cơm bình dân|bún đậu|bún chả/.test(name)) {
        timeScore += 50;
      } else if (foodAttrs.includes('heavy') || foodAttrs.includes('hot_soup')) {
        timeScore += 30;
      }
      // Tráng miệng nhẹ buổi trưa
      if (foodAttrs.includes('drinks') || foodAttrs.includes('sweet')) {
        timeScore += 15;
      }
    } else if (currentHour >= 14 && currentHour <= 17) {
      // 3. XẾ CHIỀU (14:00 - 17:30): Trà sữa, chè, kem, ăn vặt đường phố
      if (['boba', 'cafe'].includes(cat) || /trà sữa|chè|kem|sinh tố|bánh tráng|bánh bèo|bánh xèo|tàu hũ|xiên nướng/.test(name)) {
        timeScore += 55;
      }
      // Phạt các bữa ăn quá nặng bụng lúc 3h chiều
      if (cat === 'hotpot' || /cơm niêu|lẩu khổng lồ/.test(name)) {
        timeScore -= 40;
      }
    } else if (currentHour >= 18 && currentHour <= 21) {
      // 4. BUỔI TỐI (18:00 - 21:30): Giờ vàng Hải sản, Lẩu, Nướng BBQ, Cơm tiệc gia đình & bạn bè
      if (cat === 'seafood' || cat === 'hotpot' || cat === 'bbq' || /hải sản|quán ốc|nướng|lẩu|gà chỉ|cơm niêu/.test(name)) {
        timeScore += 60;
      } else if (foodAttrs.includes('heavy') || foodAttrs.includes('hot_soup') || foodAttrs.includes('salty')) {
        timeScore += 35;
      }
    } else {
      // 5. ĐÊM MUỘN (Sau 22:00): Ốc đêm, cháo đêm, bún đêm, quán mở muộn
      const openTime = food.openTime || '';
      const isLateOpen = /22:30|23:|24:|00:|01:|02:|23h|24h/.test(openTime) || /ăn đêm|khuya|cháo đêm|ốc đêm/.test(name);
      if (isLateOpen || /ốc|cháo|bún bò|mì cay/.test(name)) {
        timeScore += 50;
      }
      // Phạt quán cơm văn phòng hay quán đóng sớm
      if (cat === 'rice') {
        timeScore -= 30;
      }
    }

    // Điểm_Phù_Hợp = (Điểm_Tâm_Trạng x 2) + Điểm_Thời_Tiết + Điểm_Thời_Gian
    const contextualScore = (moodScore * 2) + weatherScore + timeScore;
    return Math.round(contextualScore);
  }

  // 3. HỌC TỪ LỊCH SỬ SWIPE (SESSION-BASED LEARNING)
  getSessionLearningState() {
    try {
      const raw = sessionStorage.getItem('foodtinder_session_learning_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      consecutiveSkips: {},
      fatiguedAttrs: [],
      counterTasteBonus: {}
    };
  }

  saveSessionLearningState(state) {
    try {
      sessionStorage.setItem('foodtinder_session_learning_v1', JSON.stringify(state));
    } catch (e) {}
  }

  recordSwipeSkip(food) {
    if (!food) return;
    const state = this.getSessionLearningState();
    const attrs = Array.isArray(food.attributes) ? food.attributes : [];

    attrs.forEach(attr => {
      state.consecutiveSkips[attr] = (state.consecutiveSkips[attr] || 0) + 1;
      // Nếu quẹt trái (Bỏ qua) liên tiếp 3 thẻ có cùng tag
      if (state.consecutiveSkips[attr] >= 3 && !state.fatiguedAttrs.includes(attr)) {
        state.fatiguedAttrs.push(attr);
        console.log(`🤖 [AI Session Learning] Người dùng quẹt bỏ qua 3 món liên tiếp có tag "${attr}"! Tự động giảm trọng số và kích hoạt vị giác đối trọng.`);

        // Kích hoạt vị giác đối trọng:
        if (attr === 'sweet') {
          // "Gu ngọt hôm nay có vấn đề" -> Giảm sweet, kích hoạt salty, sour, spicy
          state.counterTasteBonus['salty'] = 45;
          state.counterTasteBonus['sour'] = 40;
          state.counterTasteBonus['spicy'] = 30;
        } else if (attr === 'hot_soup') {
          // Chán món nước nóng -> kích hoạt crunchy, light, drinks
          state.counterTasteBonus['crunchy'] = 45;
          state.counterTasteBonus['light'] = 40;
          state.counterTasteBonus['drinks'] = 35;
        } else if (attr === 'spicy') {
          // Chán cay -> kích hoạt sweet, light
          state.counterTasteBonus['sweet'] = 45;
          state.counterTasteBonus['light'] = 40;
        } else if (attr === 'heavy') {
          // Chán no ngấy -> kích hoạt light, drinks, sour
          state.counterTasteBonus['light'] = 45;
          state.counterTasteBonus['drinks'] = 40;
          state.counterTasteBonus['sour'] = 35;
        }
      }
    });

    this.saveSessionLearningState(state);
  }

  recordSwipeLike(food) {
    if (!food) return;
    const state = this.getSessionLearningState();
    const attrs = Array.isArray(food.attributes) ? food.attributes : [];

    attrs.forEach(attr => {
      state.consecutiveSkips[attr] = 0;
      const idx = state.fatiguedAttrs.indexOf(attr);
      if (idx !== -1) {
        state.fatiguedAttrs.splice(idx, 1);
      }
    });

    this.saveSessionLearningState(state);

    // 4. Cộng điểm đám đông (Crowdsourcing)
    const activeMood = this.moodFilter?.moodId || this.currentMood;
    this.recordCrowdsourceVote(food.id, activeMood);
  }

  // 4. DỮ LIỆU TỪ ĐÁM ĐÔNG (CROWDSOURCING TAGS)
  recordCrowdsourceVote(foodId, moodId) {
    if (!foodId || !moodId) return;
    try {
      const KEY = 'foodtinder_crowdsource_mood_v1';
      const store = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (!store[foodId]) store[foodId] = {};
      store[foodId][moodId] = (store[foodId][moodId] || 0) + 1;
      localStorage.setItem(KEY, JSON.stringify(store));

      // Realtime Firebase DB sync ngầm nếu có cấu hình
      if (typeof window !== 'undefined' && window.firebaseDb && typeof window.firebaseDb.ref === 'function') {
        const ref = window.firebaseDb.ref(`crowdsource_mood/${foodId}/${moodId}`);
        ref.transaction(cur => (cur || 0) + 1);
      }
    } catch (e) {
      console.warn('Crowdsource vote error:', e);
    }
  }

  getCrowdsourceScore(foodId, moodId) {
    if (!foodId || !moodId) return 0;
    try {
      const KEY = 'foodtinder_crowdsource_mood_v1';
      const store = JSON.parse(localStorage.getItem(KEY) || '{}');
      const userVotes = store[foodId]?.[moodId] || 0;
      const defaultVotes = (window.PRESEEDED_CROWD_WISDOM && window.PRESEEDED_CROWD_WISDOM[foodId]?.[moodId]) || 0;
      return userVotes + defaultVotes;
    } catch (e) {
      return 0;
    }
  }

  getFoodsForCurrentMood() {
    const curCityId = APP_DATA?.currentCity?.cityId;
    const curCityName = APP_DATA?.currentCity?.name;
    let pool = APP_DATA?.foods || [];
    if (curCityId || curCityName) {
      const cId = (curCityId || '').toLowerCase();
      const cName = (curCityName || '').toLowerCase();
      const cityPool = pool.filter(f => {
        const fCityId = (f.cityId || '').toLowerCase();
        const fCityName = (f.cityName || '').toLowerCase();
        const fAddress = (f.address || '').toLowerCase();

        const isQnCity = cId.includes('quynhon') || cId.includes('binhdinh') || cName.includes('quy nhơn') || cName.includes('bình định');
        const isQnFood = fCityId.includes('quynhon') || fCityId.includes('binhdinh') || fCityName.includes('quy nhơn') || fAddress.includes('quy nhơn') || fAddress.includes('bình định');
        if (isQnCity && isQnFood) return true;

        if (cId && fCityId && cId === fCityId) return true;
        if (fCityName && cName && (fCityName.includes(cName) || cName.includes(fCityName))) return true;
        if (fAddress && cName && fAddress.includes(cName)) return true;
        return false;
      });
      if (cityPool.length > 0) pool = cityPool;
    }
    const moodId = this.currentMood;
    const now = new Date();
    const weather = APP_DATA?.currentCity?.weather;

    // Lọc theo điều kiện tâm trạng thông minh
    let matchedMood = pool.filter(food => this.doesFoodMatchMood(food, moodId));

    // Lọc bỏ quán đóng cửa vĩnh viễn, quán ảo, vi phạm nghiêm ngặt chế độ ăn, hoặc quán chưa mở cửa
    const qualityFoods = matchedMood.filter(food => {
      if (!food) return false;
      if (typeof window.isPermanentlyClosedRestaurant === 'function' && window.isPermanentlyClosedRestaurant(food)) return false;
      if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(food)) return false;
      if (window.tasteManager && typeof window.tasteManager.isFoodAllowedByPreferences === 'function' && !window.tasteManager.isFoodAllowedByPreferences(food)) return false;
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food, now) : { isOpen: true };
      if (!status || !status.isOpen) return false;
      return true;
    });

    if (qualityFoods.length > 0) {
      matchedMood = qualityFoods;
    }

    // Fallback Logic: Khi kết quả trả về < 10 món, tự động nới lỏng để luồng quẹt thẻ luôn mượt mà (vẫn chỉ giữ quán đang mở)
    if (matchedMood.length < 10) {
      const matrix = window.MOOD_ATTRIBUTE_MATRIX || {};
      const weights = matrix[moodId] || {};
      const matchedIds = new Set(matchedMood.map(f => f.id));
      const candidates = pool.filter(f => {
        if (!f || matchedIds.has(f.id)) return false;
        if (typeof window.isPermanentlyClosedRestaurant === 'function' && window.isPermanentlyClosedRestaurant(f)) return false;
        if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(f)) return false;
        const status = window.getRestaurantStatus ? window.getRestaurantStatus(f, now) : { isOpen: true };
        if (!status || !status.isOpen) return false;
        return true;
      });
      candidates.sort((a, b) => {
        const scoreA = (a.attributes || []).reduce((sum, at) => sum + (weights[at] || 0), 0);
        const scoreB = (b.attributes || []).reduce((sum, at) => sum + (weights[at] || 0), 0);
        return scoreB - scoreA;
      });
      matchedMood = matchedMood.concat(candidates.slice(0, 20 - matchedMood.length));
    }

    const scored = matchedMood.map(food => {
      // Áp dụng công thức Contextual Fusion & Điểm Gu Khẩu Vị Cá Nhân
      const fusionScore = this.calculateContextualFusionScore(food, moodId, weather, now);
      const dist = (typeof food.distance === 'number') ? food.distance : 10;
      const proximity = Math.max(0, (10 - dist) * 2);
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food, now) : { isOpen: true };
      const openBonus = status.isOpen ? 120 : 0; // Ưu tiên quán đang mở cửa lên hàng đầu
      const tasteBonus = (window.tasteManager && typeof window.tasteManager.calculateMatchScore === 'function')
        ? (window.tasteManager.calculateMatchScore(food, moodId) * 0.6)
        : 40;
      return { food, score: fusionScore + proximity + (food.rating || 4.5) * 2 + openBonus + tasteBonus };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(item => item.food);
  }

  renderHeader() {
    const city = APP_DATA.currentCity;
    const weather = city.weather;

    // Sidebar greeting
    const greetingEl = document.getElementById('header-greeting');
    if (greetingEl) {
      if (window.authManager && window.authManager.isLoggedIn()) {
        window.authManager.syncUI();
      } else {
        greetingEl.innerHTML = `
          <div class="flex items-center justify-between gap-1.5">
            <div class="flex items-center gap-1.5 font-extrabold text-stone-900 text-sm leading-tight">
              <span>Chào Bạn!</span>
              <span class="inline-block animate-wave text-lg">👋</span>
            </div>
            <button onclick="window.authManager && window.authManager.openLoginModal()" class="text-[10.5px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full transition cursor-pointer shrink-0">
              Đăng nhập
            </button>
          </div>
          <p class="text-xs text-stone-500 font-medium mt-0.5">${city.name} đang ${weather.condition.toLowerCase()} ${weather.temp} ${weather.icon}</p>
        `;
      }
    }
    if (window.authManager) {
      window.authManager.syncUI();
    }

    // Sidebar location (Đưa khối Vị trí lên đầu kèm nút Đổi nhỏ ngay bên cạnh)
    const locationEl = document.getElementById('header-location');
    if (locationEl) {
      const isLocating = !city.address || city.address.includes('Đang xác định');
      locationEl.innerHTML = `
        <div class="bg-[#FFF2EA] hover:bg-[#FFE6D9] border border-[#FFD8C2] rounded-2xl p-2.5 sm:p-3 transition relative" title="${city.address} (Tự động cập nhật theo GPS của bạn)">
          <div class="flex items-center justify-between gap-1.5">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">Bạn đang ở:</span>
              ${isLocating ? `
                <span class="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded-md">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  <span>Định vị...</span>
                </span>
              ` : `
                <span class="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-md">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Vị trí trực tiếp</span>
                </span>
              `}
            </div>
            <button onclick="window.app.openCityModal()" class="text-[10.5px] font-extrabold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg transition shadow-2xs shrink-0 cursor-pointer" title="Đổi tỉnh thành / vị trí">
              Đổi
            </button>
          </div>
          <div class="font-extrabold text-xs text-stone-900 truncate mt-1 leading-tight" id="user-current-address-label" title="${city.address}">
            📍 ${city.address || city.name}
          </div>
          ${(APP_DATA.isDemoLocation || city.cityId !== 'quynhon') ? `
            <div class="mt-2 pt-2 border-t border-[#FFD8C2]/80 flex items-center justify-between text-[10.5px]">
              <span class="text-amber-800 font-bold inline-flex items-center gap-1">
                <span>📍</span>
                <span>Đang hiển thị dữ liệu gợi ý tại Quy Nhơn</span>
              </span>
              <button onclick="window.app.switchLocationToQuyNhon()" class="text-rose-600 hover:text-rose-700 font-extrabold underline cursor-pointer">
                Về Quy Nhơn
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Cập nhật banner thông báo vị trí ngoài Quy Nhơn ở đầu feed
    const demoBanner = document.getElementById('home-demo-banner');
    if (demoBanner) {
      if (APP_DATA.isDemoLocation || city.cityId !== 'quynhon') {
        demoBanner.classList.remove('hidden');
        demoBanner.classList.add('flex');
        const detectedCityEl = document.getElementById('demo-detected-city');
        if (detectedCityEl) detectedCityEl.textContent = city.name || 'ngoài Quy Nhơn';
      } else {
        demoBanner.classList.add('hidden');
        demoBanner.classList.remove('flex');
      }
    }

    // Topbar weather chip (Rút gọn thành: temp, bỏ city.name vì đã có ở cột trái, tránh bẻ dòng)
    const topbarIcon = document.getElementById('topbar-weather-icon');
    const topbarText = document.getElementById('topbar-weather-text');
    if (topbarIcon) topbarIcon.textContent = weather.icon;
    if (topbarText) topbarText.textContent = `${weather.temp}`;

    // Welcome banner subtitle (tự động điều chỉnh linh hoạt theo thời tiết & tâm trạng)
    const wSub = document.getElementById('welcome-subtitle');
    if (wSub) {
      wSub.textContent = this.getWelcomeSubtitle(city, weather, this.currentMood);
    }
  }

  getWelcomeSubtitle(city, weather, moodId) {
    const tempNum = parseInt(weather.temp, 10) || 26;
    const condLower = (weather.condition || '').toLowerCase();
    const isRaining = condLower.includes('mưa') || weather.icon === '🌧️';
    const isCold = tempNum < 21 || condLower.includes('gió') || condLower.includes('rét');
    const isPleasant = tempNum >= 21 && tempNum <= 27; // 21 - 27 độ: mát mẻ, nhiều mây, dễ chịu
    const isHot = tempNum >= 28; // >= 28 độ: nắng, oi bức

    let suggestion = '';

    // Phân loại thông minh kết hợp tâm trạng & thời tiết
    if (moodId === 'comfort' || moodId === 'sad') {
      if (isRaining || isCold) {
        suggestion = 'tâm trạng cần vỗ về, thưởng thức bát phở nóng hay nồi lẩu ấm lòng nhé?';
      } else if (isPleasant) {
        suggestion = 'tâm trạng cần chút nuông chiều, hôm nay ăn món gì thật ngon để vui vẻ lại nào!';
      } else {
        suggestion = 'ngày oi ả thấy hơi chùng lòng, làm ly kem mát lạnh hay cốc trà sữa ngọt ngào nhé!';
      }
    } else if (moodId === 'craving') {
      if (isRaining || isCold) {
        suggestion = 'trời se lạnh thế này, làm nồi lẩu xì xèo hay đĩa nướng thơm lừng thôi nào!';
      } else if (isPleasant) {
        suggestion = 'tiết trời mát mẻ lý tưởng, oanh tạc các món giòn rụm hay hải sản tươi ngon nhé?';
      } else {
        suggestion = 'thèm ăn ngon ngày nắng ráo, thưởng thức ngay các món đậm đà hấp dẫn nào!';
      }
    } else if (moodId === 'chill') {
      if (isRaining) {
        suggestion = 'trời mưa lãng mạn, ngồi góc quán quen nhâm nhi cà phê hay chút bánh ngọt nhé!';
      } else if (isPleasant) {
        suggestion = 'tiết trời mát mẻ dễ chịu, ghé quán cà phê xinh hay làm bát bún thanh nhẹ nhé?';
      } else if (isHot) {
        suggestion = 'trời oi bức, trốn nắng trong quán máy lạnh làm ly trà thanh mát thư giãn nào!';
      } else {
        suggestion = 'trời se lạnh bình yên, nhâm nhi tách trà ấm ngắm phố phường nhé!';
      }
    } else if (moodId === 'sweet') {
      suggestion = 'hôm nay thèm chút ngọt ngào, làm ly trà sữa hay bát chè ngon nạp lại năng lượng nhé!';
    } else if (moodId === 'zen') {
      suggestion = 'tâm hồn muốn tìm chút an yên, thưởng thức bữa cơm chay hay lẩu nấm thanh tịnh nào!';
    } else if (moodId === 'seafood') {
      suggestion = 'đến phố biển là phải ăn hải sản, thưởng thức tôm mực tươi rói hay ốc luộc thơm nức nhé!';
    } else if (moodId === 'hangout') {
      suggestion = 'hôm nay lên kèo lai rai, gọi đĩa nem nướng, mực nướng xì xèo cùng bạn bè thôi!';
    } else if (moodId === 'refreshing') {
      suggestion = 'ngày oi bức cần giải nhiệt cấp tốc, làm ly trà trái cây mát lạnh hay trái dừa ngọt lịm nhé!';
    } else if (moodId === 'quick') {
      suggestion = 'bận rộn cần ăn nhanh gọn, làm ổ bánh mì giòn rụm hay gói xôi nóng chắc dạ nào!';
    } else if (moodId === 'energetic') {
      suggestion = 'tinh thần đang lên cao, kéo hội bạn đi ăn uống tụ tập xôm tụ thôi nào!';
    } else if (moodId === 'tired') {
      suggestion = 'làm việc vất vả rồi, nạp lại năng lượng bằng bát súp bổ dưỡng hay món nước thanh đạm nhé!';
    } else if (moodId === 'healthy') {
      suggestion = 'hôm nay nhẹ nhàng thanh lọc cơ thể với salad tươi giòn hay món ăn thanh sạch nhé!';
    } else if (moodId === 'budget') {
      suggestion = 'hôm nay ăn gì vừa ngon - bổ - rẻ chuẩn tiêu chí sinh viên nhỉ?';
    } else if (moodId === 'celebrate') {
      suggestion = 'ngày vui là phải mở tiệc, chọn ngay quán ngon xịn sò chiêu đãi bạn bè thôi!';
    } else {
      // Mặc định dựa theo thời tiết thực tế
      if (isRaining) {
        suggestion = 'trời mưa rả rích thế này, làm đĩa bánh xèo giòn rụm hay bát bún nóng hổi nhé?';
      } else if (isCold) {
        suggestion = 'trời se se lạnh, ăn gì cho ấm bụng bây giờ nhỉ?';
      } else if (isPleasant) {
        suggestion = 'tiết trời mát mẻ dễ chịu thế này, hôm nay bạn thèm ăn món gì nào?';
      } else if (isHot) {
        suggestion = 'trời nắng oi ả, giải nhiệt bằng bát chè mát lạnh hay món thanh mát nhé!';
      } else {
        suggestion = 'hôm nay bạn muốn thưởng thức món ngon gì nào?';
      }
    }

    return `${city.name} đang ${weather.condition.toLowerCase()} ${weather.temp} ${weather.icon} — ${suggestion}`;
  }

  renderMoodSelector() {
    if (this.currentTab === 'grocery') {
      if (window.groceryManager && typeof window.groceryManager.renderNeedsSelector === 'function') {
        window.groceryManager.renderNeedsSelector();
        return;
      }
    }

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

  // ═══════════════════════════════════════════════════════════════════
  // QUICK CATEGORY CHIPS BAR & CUSTOM FILTER MODAL
  // ═══════════════════════════════════════════════════════════════════

  renderQuickCategoryChips() {
    const container = document.getElementById('quick-category-chips');
    if (!container) return;

    if (!this.moodFilter) {
      this.moodFilter = {
        moodId: this.currentMood,
        selectedCategories: [],
        maxRadius: 0,
        selectedArea: 'all',
        openOnly: true,
        shopeeOnly: false,
        highRatingOnly: false,
        priceTier: 'all'
      };
    }

    const isAll = !this.moodFilter.selectedCategories || this.moodFilter.selectedCategories.length === 0;

    const html = QUICK_HOME_CATEGORIES.map(cat => {
      const isSelected = cat.id === 'all' 
        ? isAll 
        : (this.moodFilter.selectedCategories && this.moodFilter.selectedCategories.includes(cat.id));

      return `
        <button type="button" onclick="window.app.toggleQuickCategory('${cat.id}')"
          class="home-cat-chip px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0 ${
            isSelected 
              ? 'bg-white text-stone-900 shadow-md ring-2 ring-white/50 font-black' 
              : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs font-semibold border border-white/25'
          }">
          <span>${cat.emoji}</span>
          <span>${cat.label}</span>
          ${isSelected && cat.id !== 'all' ? '<span class="text-[10px] font-black opacity-80">✓</span>' : ''}
        </button>
      `;
    }).join('');

    container.innerHTML = html;
  }

  toggleQuickCategory(catId) {
    window.soundFX && window.soundFX.playPop();
    this.feedLimit = 24;
    if (!this.moodFilter) {
      this.moodFilter = { moodId: this.currentMood, selectedCategories: [], maxRadius: 0, selectedArea: 'all', openOnly: true, shopeeOnly: false, highRatingOnly: false, priceTier: 'all' };
    }
    if (catId === 'all') {
      this.moodFilter.selectedCategories = [];
    } else {
      // Bấm chip trên thanh lướt nhanh: chuyển ngay sang loại món đó (chạm lại lần nữa để bỏ chọn)
      if (this.moodFilter.selectedCategories.length === 1 && this.moodFilter.selectedCategories[0] === catId) {
        this.moodFilter.selectedCategories = [];
      } else {
        this.moodFilter.selectedCategories = [catId];
      }
    }
    this.renderQuickCategoryChips();
    this.renderBentoAndFeed();
  }

  getActiveFiltersCount() {
    if (!this.moodFilter) return 0;
    let count = 0;
    if (this.moodFilter.selectedCategories && this.moodFilter.selectedCategories.length > 0) count += this.moodFilter.selectedCategories.length;
    if (this.moodFilter.maxRadius > 0) count++;
    if (this.moodFilter.companion && this.moodFilter.companion !== 'all') count++;
    return count;
  }

  openMoodFilterModal() {
    window.soundFX && window.soundFX.playPop();
    if (window.authManager && typeof window.authManager.trackStat === 'function') {
      window.authManager.trackStat('moodExplored', 1);
    }
    if (!this.moodFilter) {
      this.moodFilter = { moodId: this.currentMood, selectedCategories: [], maxRadius: 0, companion: 'all', selectedArea: 'all', openOnly: true, shopeeOnly: false, highRatingOnly: false, priceTier: 'all' };
    }
    this.tempMoodFilter = {
      moodId: this.moodFilter.moodId || this.currentMood,
      selectedCategories: [...(this.moodFilter.selectedCategories || [])],
      maxRadius: this.moodFilter.maxRadius || 0,
      companion: this.moodFilter.companion || 'all',
      selectedArea: this.moodFilter.selectedArea || 'all',
      openOnly: typeof this.moodFilter.openOnly === 'boolean' ? this.moodFilter.openOnly : true,
      shopeeOnly: Boolean(this.moodFilter.shopeeOnly),
      highRatingOnly: Boolean(this.moodFilter.highRatingOnly),
      priceTier: this.moodFilter.priceTier || 'all'
    };
    this.renderMoodFilterModal();
    const modal = document.getElementById('mood-filter-modal');
    if (modal) modal.classList.remove('hidden');
  }

  closeMoodFilterModal() {
    const modal = document.getElementById('mood-filter-modal');
    if (modal) modal.classList.add('hidden');
  }

  // Mở modal hỏi tâm trạng hôm nay
  openTodayMoodModal(options = {}) {
    const modal = document.getElementById('today-mood-modal');
    if (!modal) return;
    this.renderTodayMoodModal();
    modal.classList.remove('hidden');
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.add('scale-95', 'opacity-0');
      requestAnimationFrame(() => {
        sheet.classList.remove('scale-95', 'opacity-0');
        sheet.classList.add('transition-all', 'duration-200');
      });
    }
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
  }

  // Đóng modal hỏi tâm trạng hôm nay
  closeTodayMoodModal() {
    const modal = document.getElementById('today-mood-modal');
    if (!modal) return;
    sessionStorage.setItem('foodtinder_session_mood_asked', 'true');
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) sheet.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      if (sheet) sheet.classList.remove('scale-95', 'opacity-0');
    }, 200);
  }

  // Render danh sách tâm trạng trực quan trong modal hôm nay
  renderTodayMoodModal() {
    const container = document.getElementById('today-mood-options-container');
    if (!container) return;
    const moods = APP_DATA.moods || [];
    container.innerHTML = moods.map(m => {
      const isSelected = this.currentMood === m.id;
      return `
        <button type="button" onclick="window.app.selectTodayMood('${m.id}')"
          class="p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer select-none active:scale-98 ${
            isSelected 
              ? 'bg-gradient-to-br from-rose-50 to-amber-50 border-rose-400 shadow-sm ring-2 ring-rose-300/60' 
              : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
          }">
          <div class="flex items-center justify-between w-full">
            <span class="text-2xl">${m.emoji}</span>
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isSelected ? 'bg-rose-500 text-white' : 'border border-stone-300 text-transparent'
            }">✓</span>
          </div>
          <div class="mt-2">
            <div class="text-xs font-black ${isSelected ? 'text-rose-900' : 'text-stone-800'}">${m.label}</div>
            <div class="text-[10px] text-stone-400 line-clamp-2 mt-0.5 leading-snug">${m.desc}</div>
          </div>
        </button>
      `;
    }).join('');
  }

  // Chọn tâm trạng hôm nay và kích hoạt gợi ý món chuẩn Gu
  selectTodayMood(moodId) {
    sessionStorage.setItem('foodtinder_session_mood_asked', 'true');
    this.setMood(moodId);
    this.closeTodayMoodModal();
    const moodObj = APP_DATA.moods?.find(m => m.id === moodId);
    const moodName = moodObj ? moodObj.label : 'Mới';
    if (window.soundFX && window.soundFX.playMatch) window.soundFX.playMatch();
    this.showToast(`✨ Tâm trạng hôm nay: ${moodName}! Đã kích hoạt gợi ý chuẩn Gu cho bạn!`);
  }

  renderMoodFilterModal() {
    if (!this.tempMoodFilter) return;

    // 1. Moods grid
    const moodContainer = document.getElementById('modal-mood-options');
    if (moodContainer) {
      moodContainer.innerHTML = APP_DATA.moods.map(m => {
        const isSel = this.tempMoodFilter.moodId === m.id;
        return `
          <button type="button" onclick="window.app.modalSelectMood('${m.id}')"
            class="p-1.5 rounded-xl text-left transition flex items-center gap-1.5 cursor-pointer border ${isSel ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200' : 'bg-white hover:bg-stone-50 border-stone-200'}">
            <span class="text-base shrink-0">${m.emoji}</span>
            <div class="min-w-0 flex-1">
              <div class="text-[11px] font-bold text-stone-800 leading-tight truncate">${m.label}</div>
            </div>
          </button>
        `;
      }).join('');
    }

    // 2. Categories options
    const catContainer = document.getElementById('modal-category-options');
    if (catContainer) {
      catContainer.innerHTML = FILTER_CATEGORIES.map(cat => {
        const isSel = this.tempMoodFilter.selectedCategories.includes(cat.id);
        return `
          <button type="button" onclick="window.app.modalToggleCategory('${cat.id}')"
            class="p-2 rounded-xl text-left transition flex items-center justify-between gap-1.5 cursor-pointer border ${isSel ? 'bg-gradient-to-r from-rose-50 to-amber-50 border-rose-400 ring-2 ring-rose-200 font-extrabold text-rose-800' : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'}">
            <span class="text-xs truncate">${cat.label}</span>
            <span class="text-xs ${isSel ? 'text-rose-600 font-black' : 'text-stone-300'}">${isSel ? '✓' : '+'}</span>
          </button>
        `;
      }).join('');
    }

    // 3. Radius options
    const radiusContainer = document.getElementById('modal-radius-options');
    const radiusLabel = document.getElementById('modal-radius-label');
    if (radiusContainer) {
      radiusContainer.innerHTML = FILTER_RADII.map(r => {
        const isSel = this.tempMoodFilter.maxRadius === r.value;
        return `
          <button type="button" onclick="window.app.modalSelectRadius(${r.value})"
            class="py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-center border ${isSel ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'}">
            ${r.label}
          </button>
        `;
      }).join('');
      if (radiusLabel) {
        const curR = FILTER_RADII.find(r => r.value === this.tempMoodFilter.maxRadius);
        radiusLabel.textContent = curR ? curR.label : 'Tất cả';
      }
    }

    // 4. Đi ăn cùng ai? (Companion options)
    const compContainer = document.getElementById('modal-companion-options');
    if (compContainer) {
      compContainer.innerHTML = FILTER_COMPANIONS.map(c => {
        const isSel = (this.tempMoodFilter.companion || 'all') === c.id;
        const colSpan = c.fullWidth ? 'sm:col-span-2' : '';
        return `
          <button type="button" onclick="window.app.modalSelectCompanion('${c.id}')"
            class="p-2.5 rounded-2xl text-left transition flex items-center justify-between gap-2.5 cursor-pointer border ${colSpan} ${isSel ? 'bg-gradient-to-r from-rose-50 to-amber-50 border-rose-400 ring-2 ring-rose-200 shadow-xs' : 'bg-white hover:bg-stone-50 border-stone-200'}">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-xl shrink-0">${c.icon}</span>
              <div class="min-w-0">
                <div class="text-xs font-black ${isSel ? 'text-rose-700' : 'text-stone-800'} leading-tight">${c.label}</div>
                <div class="text-[10.5px] text-stone-500 leading-tight mt-0.5 line-clamp-1">${c.desc}</div>
              </div>
            </div>
            <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition ${isSel ? 'bg-rose-500 text-white shadow-xs' : 'bg-stone-100 text-stone-300'}">
              ${isSel ? '✓' : ''}
            </span>
          </button>
        `;
      }).join('');
    }

    this.updateModalApplyCount();
  }

  modalSelectCompanion(compId) {
    if (!this.tempMoodFilter) return;
    this.tempMoodFilter.companion = compId;
    this.renderMoodFilterModal();
  }

  modalSelectMood(moodId) {
    this.tempMoodFilter.moodId = moodId;
    this.renderMoodFilterModal();
  }

  modalToggleCategory(catId) {
    const idx = this.tempMoodFilter.selectedCategories.indexOf(catId);
    if (idx >= 0) {
      this.tempMoodFilter.selectedCategories.splice(idx, 1);
    } else {
      this.tempMoodFilter.selectedCategories.push(catId);
    }
    this.renderMoodFilterModal();
  }

  clearCategoryFilter() {
    this.tempMoodFilter.selectedCategories = [];
    this.renderMoodFilterModal();
  }

  modalSelectRadius(r) {
    this.tempMoodFilter.maxRadius = r;
    this.renderMoodFilterModal();
  }

  modalSelectArea(areaId) {
    this.tempMoodFilter.selectedArea = areaId;
    this.renderMoodFilterModal();
  }

  modalSelectPrice(tierId) {
    this.tempMoodFilter.priceTier = tierId;
    this.renderMoodFilterModal();
  }

  syncModalCheckboxes() {
    // Tiêu chí bổ sung đã gỡ khỏi modal, openOnly luôn giữ true mặc định
    if (this.tempMoodFilter) {
      this.tempMoodFilter.openOnly = true;
    }
  }

  countMatchingFoods(filterState) {
    if (!filterState) return 0;
    const now = new Date();
    const activeMoodId = filterState.moodId;

    // Lọc theo thành phố nếu có
    const curCityId = APP_DATA?.currentCity?.cityId;
    const curCityName = APP_DATA?.currentCity?.name;
    let baseFoods = APP_DATA?.foods || [];
    if (curCityId || curCityName) {
      const cityFoods = baseFoods.filter(f => (curCityId && f.cityId === curCityId) || (curCityName && f.cityName && f.cityName.toLowerCase().includes(curCityName.toLowerCase())));
      if (cityFoods.length > 0) {
        baseFoods = cityFoods;
      }
    }

    return baseFoods.filter(food => {
      // Màng lọc chất lượng dữ liệu: loại bỏ quán thiếu ảnh, rating < 4.0, quán đóng cửa / địa chỉ ảo
      if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(food)) {
        return false;
      }

      // Quán chưa mở cửa thì ẩn đi
      if (filterState.openOnly !== false) {
        const st = window.getRestaurantStatus ? window.getRestaurantStatus(food, now) : { isOpen: true };
        if (!st || !st.isOpen) return false;
      }

      // 1. Loại món
      if (filterState.selectedCategories && filterState.selectedCategories.length > 0) {
        if (!matchCategories(food, filterState.selectedCategories)) return false;
      }

      // 2. Bán kính quét
      if (filterState.maxRadius && filterState.maxRadius > 0) {
        if ((food.distance || 0) > filterState.maxRadius) return false;
      }

      // 3. Đi ăn cùng ai? (Companion)
      if (filterState.companion && filterState.companion !== 'all' && !matchFoodCompanion(food, filterState.companion)) {
        return false;
      }

      // 4. ShopeeFood
      if (filterState.shopeeOnly) {
        const hasShopee = window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : (food.hasShopeeDelivery === true);
        if (!hasShopee) return false;
      }

      // 5. Đánh giá cao
      if (filterState.highRatingOnly) {
        if ((food.rating || 0) < 4.5) return false;
      }

      // 6. Khớp tâm trạng nếu có
      if (activeMoodId && !this.doesFoodMatchMood(food, activeMoodId)) {
        return false;
      }

      return true;
    }).length;
  }

  updateModalApplyCount() {
    this.syncModalCheckboxes();
    const count = this.countMatchingFoods(this.tempMoodFilter);

    const btn = document.getElementById('btn-apply-mood-filter');
    const textEl = document.getElementById('btn-apply-mood-filter-text');
    const hintEl = document.getElementById('modal-filter-zero-hint');

    if (count > 0) {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-40', 'cursor-not-allowed', 'pointer-events-none', 'grayscale', 'shadow-none');
        btn.classList.add('cursor-pointer', 'shadow-md', 'shadow-rose-200');
      }
      if (textEl) {
        textEl.textContent = `Xem ${count} quán phù hợp`;
      }
      if (hintEl) {
        hintEl.classList.add('hidden');
      }
    } else {
      if (btn) {
        btn.disabled = true;
        btn.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none', 'grayscale', 'shadow-none');
        btn.classList.remove('cursor-pointer', 'shadow-md', 'shadow-rose-200');
      }
      if (textEl) {
        textEl.textContent = `Xem 0 quán phù hợp`;
      }
      if (hintEl) {
        hintEl.classList.remove('hidden');
        hintEl.textContent = 'Không có quán khớp — thử nới bán kính hoặc bỏ bớt tiêu chí';
      }
    }
  }

  applyMoodFilters() {
    window.soundFX && window.soundFX.playPop();
    this.syncModalCheckboxes();
    this.moodFilter = {
      moodId: this.tempMoodFilter.moodId,
      selectedCategories: [...this.tempMoodFilter.selectedCategories],
      maxRadius: this.tempMoodFilter.maxRadius,
      companion: this.tempMoodFilter.companion || 'all',
      selectedArea: this.tempMoodFilter.selectedArea || 'all',
      openOnly: this.tempMoodFilter.openOnly,
      shopeeOnly: this.tempMoodFilter.shopeeOnly,
      highRatingOnly: this.tempMoodFilter.highRatingOnly,
      priceTier: this.tempMoodFilter.priceTier || 'all'
    };

    // If mood changed in modal, update app currentMood
    if (this.moodFilter.moodId && this.moodFilter.moodId !== this.currentMood) {
      this.currentMood = this.moodFilter.moodId;
      APP_DATA.currentMoodId = this.moodFilter.moodId;
      this.renderMoodSelector();
      if (window.swipeManager) {
        window.swipeManager.loadCards(this.getFoodsForCurrentMood());
      }
    }

    this.feedLimit = 24;
    this.closeMoodFilterModal();
    this.renderQuickCategoryChips();
    this.renderBentoAndFeed();
    this.showToast('Đã áp dụng bộ lọc tùy chỉnh!');

    // Kiểm tra Database: nếu location/khu vực chưa có quán thì cào ShopeeFood và lưu Database
    if (this.moodFilter.selectedArea && this.moodFilter.selectedArea !== 'all') {
      const cityObj = APP_DATA.currentCity || { cityId: 'quynhon', name: 'Quy Nhơn' };
      if (window.crawlerManager && typeof window.crawlerManager.ensureLocationData === 'function') {
        window.crawlerManager.ensureLocationData({
          cityId: cityObj.cityId,
          cityName: cityObj.name,
          areaId: this.moodFilter.selectedArea,
          lat: cityObj.lat,
          lng: cityObj.lng
        });
      }
    }
  }

  resetMoodFilters() {
    window.soundFX && window.soundFX.playPop();
    this.searchQuery = '';
    this.feedLimit = 24;
    const sInput = document.getElementById('home-food-search');
    if (sInput) sInput.value = '';
    const clearBtn = document.getElementById('home-search-clear-btn');
    if (clearBtn) clearBtn.classList.add('hidden');
    this.moodFilter = {
      moodId: this.currentMood,
      selectedCategories: [],
      maxRadius: 0,
      companion: 'all',
      selectedArea: 'all',
      openOnly: true,
      shopeeOnly: false,
      highRatingOnly: false,
      priceTier: 'all'
    };
    if (this.tempMoodFilter) {
      this.tempMoodFilter = {
        moodId: this.currentMood,
        selectedCategories: [],
        maxRadius: 0,
        companion: 'all',
        selectedArea: 'all',
        openOnly: true,
        shopeeOnly: false,
        highRatingOnly: false,
        priceTier: 'all'
      };
      this.renderMoodFilterModal();
    }
    this.renderQuickCategoryChips();
    this.renderBentoAndFeed();
    this.showToast('Đã đặt lại bộ lọc!');
  }

  renderBentoAndFeed() {
    this.ensureMoodFilter();
    this.renderQuickCategoryChips();
    const container = document.getElementById('featured-card-container');
    if (!container) return;

    const hasSearch = Boolean(this.searchQuery && this.searchQuery.trim());
    const q = (this.searchQuery || '').trim().toLowerCase();

    // Cập nhật tiêu đề & nút đóng tìm kiếm khi đang search
    const searchSubTitle = document.getElementById('mood-section-search-subtitle');
    const searchQueryEl = document.getElementById('mood-section-search-query');
    const clearSearchBtn = document.getElementById('btn-clear-search-in-mood');
    if (searchSubTitle && searchQueryEl) {
      if (hasSearch) {
        searchSubTitle.classList.remove('hidden');
        searchQueryEl.textContent = `"${this.searchQuery.trim()}"`;
      } else {
        searchSubTitle.classList.add('hidden');
        searchQueryEl.textContent = '';
      }
    }
    if (clearSearchBtn) {
      if (hasSearch) {
        clearSearchBtn.classList.remove('hidden');
      } else {
        clearSearchBtn.classList.add('hidden');
      }
    }

    // Update active filter badge & indicator in UI
    const activeCount = this.getActiveFiltersCount() + (hasSearch ? 1 : 0);
    const indicatorEl = document.getElementById('active-filter-indicator');
    const countBadgeEl = document.getElementById('active-filter-count');
    const filterBtnCount = document.getElementById('filter-btn-count');
    const resetBtn = document.getElementById('btn-reset-filters');
    const descEl = document.getElementById('mood-filter-status-desc');

    if (indicatorEl && countBadgeEl) {
      if (activeCount > 0) {
        indicatorEl.classList.remove('hidden');
        countBadgeEl.textContent = activeCount;
      } else {
        indicatorEl.classList.add('hidden');
      }
    }
    if (filterBtnCount) {
      if (activeCount > 0) {
        filterBtnCount.textContent = activeCount;
        filterBtnCount.classList.remove('hidden');
      } else {
        filterBtnCount.classList.add('hidden');
      }
    }
    if (resetBtn) {
      if (this.getActiveFiltersCount() > 0) {
        resetBtn.classList.remove('hidden');
      } else {
        resetBtn.classList.add('hidden');
      }
    }

    // Lọc ngầm: Tính toán bữa ăn theo giờ thực tế (meal slot)
    const now = new Date();
    const curHour = now.getHours();
    let currentMealSlot = 'dinner';
    if (curHour >= 6 && curHour < 10) currentMealSlot = 'breakfast';
    else if (curHour >= 10 && curHour < 14) currentMealSlot = 'lunch';
    else if (curHour >= 14 && curHour < 17) currentMealSlot = 'snack';
    else if (curHour >= 17 && curHour < 21) currentMealSlot = 'dinner';
    else currentMealSlot = 'latenight';

    // Lọc ngầm: Điều kiện thời tiết thực tế
    const weather = APP_DATA?.currentCity?.weather || { temp: '25°C', condition: 'Mát mẻ' };
    const cond = String(weather?.condition || '').toLowerCase();
    const tempNum = parseInt(weather?.temp, 10) || 25;
    const iconStr = String(weather?.icon || '');
    const isRain = cond.includes('mưa') || cond.includes('rain') || iconStr.includes('🌧️') || iconStr.includes('🌦️');
    const isCold = tempNum < 22 || cond.includes('lạnh');
    const isHot = tempNum >= 30 || cond.includes('nóng') || cond.includes('nắng');

    // Mood context (Theo tâm trạng được chọn)
    const activeMoodId = this.moodFilter?.moodId || this.currentMood;

    // Lọc trước theo địa điểm/tỉnh thành nếu có
    const curCityId = APP_DATA?.currentCity?.cityId;
    const curCityName = APP_DATA?.currentCity?.name;
    let baseFoods = APP_DATA?.foods || [];
    if (curCityId || curCityName) {
      const cityFoods = baseFoods.filter(f => (curCityId && f.cityId === curCityId) || (curCityName && f.cityName && f.cityName.toLowerCase().includes(curCityName.toLowerCase())));
      if (cityFoods.length > 0) {
        baseFoods = cityFoods;
      }
    }

    // Apply Filters (Lọc theo từ khóa tìm kiếm & bộ lọc)
    let filteredFoods = baseFoods.filter(food => {
      // -1. Màng lọc chất lượng dữ liệu: loại bỏ quán thiếu ảnh, rating < 4.0, quán đóng cửa / địa chỉ ảo
      if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(food)) {
        return false;
      }

      // Quán chưa mở cửa thì ẩn đi, khi nào mở cửa hãy hiện lên
      const st = window.getRestaurantStatus ? window.getRestaurantStatus(food, now) : { isOpen: true };
      if (!st || !st.isOpen) {
        return false;
      }

      // 0. Khớp từ khóa tìm kiếm
      if (hasSearch) {
        const nameMatch = (food.name || '').toLowerCase().includes(q);
        const restMatch = (food.restaurant || '').toLowerCase().includes(q);
        const addrMatch = (food.address || food.district || '').toLowerCase().includes(q);
        const descMatch = (food.desc || '').toLowerCase().includes(q);
        const catMatch  = (food.category || '').toLowerCase().includes(q);
        const tagsMatch = Array.isArray(food.tags) && food.tags.some(t => String(t).toLowerCase().includes(q));
        if (!nameMatch && !restMatch && !addrMatch && !descMatch && !catMatch && !tagsMatch) {
          return false;
        }
      }

      // 1. Loại món (Categories filter)
      const selectedCats = this.moodFilter?.selectedCategories || [];
      if (selectedCats.length > 0) {
        if (!matchCategories(food, selectedCats)) return false;
      }

      // 2. Bán kính quét (Radius)
      if (this.moodFilter?.maxRadius && this.moodFilter.maxRadius > 0) {
        if ((food.distance || 0) > this.moodFilter.maxRadius) return false;
      }

      // 3. Đi ăn cùng ai? (Companion filter)
      if (this.moodFilter?.companion && !matchFoodCompanion(food, this.moodFilter.companion)) {
        return false;
      }

      // 4. Có trên ShopeeFood
      if (this.moodFilter?.shopeeOnly) {
        const hasShopee = window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : (food.hasShopeeDelivery === true);
        if (!hasShopee) return false;
      }

      // 5. Đánh giá cao
      if (this.moodFilter?.highRatingOnly) {
        if ((food.rating || 0) < 4.5) return false;
      }

      // 6. Ràng buộc thông minh theo tâm trạng:
      // Khi người dùng gõ tìm kiếm cụ thể (hasSearch), ưu tiên từ khóa tìm kiếm hơn tâm trạng
      if (!hasSearch && activeMoodId && !this.doesFoodMatchMood(food, activeMoodId)) {
        return false;
      }

      return true;
    });

    // 5. Fallback Logic: Khi kết quả trả về < 5 món, tự động nới lỏng bộ lọc để luồng không bị đứt đoạn (vẫn chỉ giữ quán đang mở cửa)
    let isRelaxedFallback = false;
    let fallbackNotice = "";

    if (!hasSearch && filteredFoods.length < 5) {
      isRelaxedFallback = true;
      const currentMoodObj = APP_DATA.moods?.find(m => m.id === activeMoodId);
      const moodLabel = currentMoodObj ? currentMoodObj.label.toLowerCase() : 'tâm trạng';
      fallbackNotice = `Quanh đây đang hiếm món ${moodLabel}, FoodTinder mở rộng tìm kiếm thêm một chút cho bạn nhé!`;

      // Mở rộng bán kính quét ra toàn bộ địa bàn thành phố (vẫn đảm bảo quán đang mở cửa)
      const relaxedList = baseFoods.filter(food => {
        if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(food)) {
          return false;
        }
        const st = window.getRestaurantStatus ? window.getRestaurantStatus(food, now) : { isOpen: true };
        if (!st || !st.isOpen) {
          return false;
        }
        if (activeMoodId && !this.doesFoodMatchMood(food, activeMoodId)) {
          return false;
        }
        return true;
      });

      if (relaxedList.length > 0) {
        filteredFoods = relaxedList;
      }

      // Nếu vẫn < 5 món (ví dụ chọn các tiêu chí quá đặc thù), mở rộng các món có thuộc tính vị giác tương đồng (vẫn chỉ lấy quán đang mở cửa)
      if (filteredFoods.length < 5) {
        const matrix = window.MOOD_ATTRIBUTE_MATRIX || {};
        const weights = matrix[activeMoodId] || {};
        const existingIds = new Set(filteredFoods.map(f => f.id));
        const extraCandidates = baseFoods.filter(f => {
          if (!f || existingIds.has(f.id)) return false;
          if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(f)) return false;
          const st = window.getRestaurantStatus ? window.getRestaurantStatus(f, now) : { isOpen: true };
          if (!st || !st.isOpen) return false;
          return true;
        });
        extraCandidates.sort((a, b) => {
          const scoreA = (a.attributes || []).reduce((sum, at) => sum + (weights[at] || 0), 0);
          const scoreB = (b.attributes || []).reduce((sum, at) => sum + (weights[at] || 0), 0);
          return scoreB - scoreA;
        });
        filteredFoods = filteredFoods.concat(extraCandidates.slice(0, 8 - filteredFoods.length));
      }
    }

    if (descEl) {
      if (hasSearch) {
        descEl.textContent = `Tìm thấy ${filteredFoods.length} quán ăn & món ngon phù hợp với từ khóa "${this.searchQuery}"`;
      } else {
        const selectedCats = this.moodFilter?.selectedCategories || [];
        if (selectedCats.length > 0) {
          const catNames = selectedCats.map(cId => {
            const c = FILTER_CATEGORIES.find(x => x.id === cId);
            return c ? c.short : cId;
          }).join(', ');
          descEl.textContent = `Đang lọc: ${catNames} (${filteredFoods.length} quán phù hợp)`;
        } else if (this.moodFilter?.companion && this.moodFilter.companion !== 'all') {
          const comp = FILTER_COMPANIONS.find(c => c.id === this.moodFilter.companion);
          descEl.textContent = `Đang lọc: ${comp?.label || ''} (${filteredFoods.length} quán phù hợp)`;
        } else {
          const currentMoodObj = APP_DATA.moods?.find(m => m.id === activeMoodId);
          if (currentMoodObj) {
            if (activeMoodId === 'zen') {
              descEl.textContent = `Gợi ý theo tâm trạng: 🪷 Thanh tịnh (${filteredFoods.length} quán phù hợp) — Tuyển chọn các quán chay thanh tịnh, lẩu nấm & cơm chay an lạc`;
            } else if (activeMoodId === 'stress') {
              descEl.textContent = `Gợi ý theo tâm trạng: 🤯 Xả stress (${filteredFoods.length} quán phù hợp) — Món cay endorphin & đồ giòn rụm nhai xả stress`;
            } else {
              descEl.textContent = `Gợi ý theo tâm trạng: ${currentMoodObj.emoji} ${currentMoodObj.label} (${filteredFoods.length} quán phù hợp) — ${currentMoodObj.desc}`;
            }
          } else {
            descEl.textContent = `Tự động quét ${filteredFoods.length} quán mở cửa theo thời tiết & giờ thực tế`;
          }
        }
      }
    }

    // Sắp xếp điểm số thông minh: Quán mở cửa -> Contextual Fusion (Tâm trạng x 2 + Thời tiết + Giờ) -> Tìm kiếm -> Khoảng cách -> Rating
    const scoredFoods = filteredFoods.map(food => {
      let score = 0;
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food.openTime, now) : { isOpen: true };
      if (status.isOpen) score += 40;

      // Ưu tiên khớp từ khóa tìm kiếm nếu có
      if (hasSearch) {
        if ((food.restaurant || '').toLowerCase().includes(q)) score += 120;
        if ((food.name || '').toLowerCase().includes(q)) score += 100;
        if ((food.category || '').toLowerCase().includes(q)) score += 50;
      }

      // Contextual Fusion Score: (Điểm_Tâm_Trạng x 2) + Điểm_Thời_Tiết + Điểm_Thời_Gian
      const fusionScore = this.calculateContextualFusionScore(food, activeMoodId, weather, now);
      score += fusionScore;

      // Khoảng cách: bổ trợ nhẹ (tối đa 20 điểm), không làm mất đi các món khớp tâm trạng
      const dist = (typeof food.distance === 'number') ? food.distance : 10;
      const proximityBonus = Math.max(0, (10 - dist) * 2);
      score += proximityBonus;

      score += (food.rating || 4.5) * 2;
      return { food, score, status };
    });

    scoredFoods.sort((a, b) => (b.score - a.score) || ((a.food.distance || 0) - (b.food.distance || 0)));
    const totalCount = scoredFoods.length;
    const currentLimit = this.feedLimit || 24;
    const topFoods = scoredFoods.slice(0, currentLimit);
    const hasMore = totalCount > topFoods.length;

    if (topFoods.length === 0) {
      const moreContainer = document.getElementById('feed-load-more-container');
      if (moreContainer) moreContainer.innerHTML = '';
      if (hasSearch) {
        container.innerHTML = `
          <div class="col-span-full py-12 px-4 text-center bg-white rounded-3xl border border-stone-200 shadow-sm">
            <div class="text-4xl mb-2">🔍</div>
            <p class="font-black text-base text-stone-900">Không tìm thấy quán nào khớp với "${this.searchQuery}"</p>
            <p class="text-xs text-stone-500 mt-1 max-w-md mx-auto">Thử tìm bằng tên món khác (vd: bánh xèo, bún cá, nem nướng, trà sữa), tên quán hoặc tên đường.</p>
            <button onclick="window.app.clearHomeSearch()" class="mt-4 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">
              ✕ Xóa tìm kiếm & xem lại gợi ý
            </button>
          </div>
        `;
        return;
      }
      container.innerHTML = `
        <div class="col-span-full py-10 px-4 text-center bg-white rounded-3xl border border-stone-200 shadow-sm">
          <div class="text-3xl mb-2">🔍</div>
          <p class="font-extrabold text-sm text-stone-800">Không tìm thấy món ăn nào phù hợp với bộ lọc hiện tại</p>
          <p class="text-xs text-stone-400 mt-1">Thử nới lỏng bán kính, đổi tiêu chí hoặc xóa bớt danh mục lọc.</p>
          <button onclick="window.app.resetMoodFilters()" class="mt-3 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer">
            ✕ Đặt lại bộ lọc
          </button>
        </div>
      `;
      return;
    }

    const fallbackBannerHtml = isRelaxedFallback ? `
      <div class="col-span-full mb-3 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl flex items-center gap-3 text-amber-950 text-sm shadow-xs animate-pulse-gentle">
        <span class="text-2xl flex-shrink-0">✨</span>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-amber-900 text-xs sm:text-sm">Gợi ý mở rộng thông minh</p>
          <p class="text-xs text-amber-800">${fallbackNotice}</p>
        </div>
      </div>
    ` : '';

    container.innerHTML = fallbackBannerHtml + topFoods.map(({ food, status }) => this.buildFoodCardHtml(food, status)).join('');

    // Render nút Xem thêm / Load more mỗi lần load thêm 24 quán
    const moreContainer = document.getElementById('feed-load-more-container');
    if (moreContainer) {
      if (hasMore) {
        const remaining = totalCount - topFoods.length;
        const nextBatch = Math.min(this.feedBatchSize || 24, remaining);
        moreContainer.innerHTML = `
          <div class="p-3.5 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-rose-50/90 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">🍲</span>
              <div>
                <p class="text-xs font-bold text-stone-800">
                  Đang hiển thị <b>${topFoods.length} / ${totalCount} quán</b> phù hợp
                </p>
                <p class="text-[11px] text-stone-500">Còn lại ${remaining} quán ngon đang mở cửa phù hợp với lựa chọn của bạn.</p>
              </div>
            </div>
            <button type="button" onclick="window.app.loadMoreFoods()"
              class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-md shadow-rose-300/80 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0">
              <span>Xem thêm ${nextBatch} quán nữa</span>
              <span class="text-xs font-black">↓</span>
            </button>
          </div>
        `;
      } else if (totalCount > 24) {
        moreContainer.innerHTML = `
          <div class="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-stone-500 shadow-2xs">
            <span>🎉 Đã hiển thị toàn bộ ${totalCount} quán ăn phù hợp.</span>
          </div>
        `;
      } else {
        moreContainer.innerHTML = '';
      }
    }

    if (window.lucide) window.lucide.createIcons();
    this.updateBentoStats();
  }

  loadMoreFoods() {
    window.soundFX && window.soundFX.playPop();
    this.feedLimit = (this.feedLimit || 24) + (this.feedBatchSize || 24);
    this.renderBentoAndFeed();
  }

  updateBentoStats() {
    const moodObj = APP_DATA.moods.find(m => m.id === this.currentMood) || APP_DATA.moods[1];
    const emojiEl  = document.getElementById('bento-mood-emoji');
    const labelEl  = document.getElementById('bento-mood-label');
    if (emojiEl && moodObj) emojiEl.textContent = moodObj.emoji;
    if (labelEl && moodObj) labelEl.textContent = moodObj.label;
    this.syncWishlistAndProfileStats();
  }

  renderNearbyGrid() {
    const container = document.getElementById('nearby-grid');
    if (!container) return;
    const sorted = [...APP_DATA.foods]
      .filter(f => {
        const st = window.getRestaurantStatus ? window.getRestaurantStatus(f) : { isOpen: true };
        return Boolean(st && st.isOpen);
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
    container.innerHTML = sorted.map(food => {
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
    const isLiked = this.likedFoods.some(f => f.id === food.id);
    const isWillReturn = this.isFoodWillReturn(food.id);
    const willReturnCount = this.getWillReturnCount(food.id);
      return `
      <div onclick="window.app.showFoodDetail(${food.id})" class="food-card ${status.isOpen ? '' : 'is-closed'} cursor-pointer">
        <div class="relative h-24 overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}"
            loading="lazy"
            decoding="async"
            data-name="${food.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="w-full h-full object-cover ${status.isOpen ? '' : 'is-closed-img grayscale'}" />
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
          <h6 class="font-bold text-xs text-stone-800 truncate" title="${food.restaurant}">${food.restaurant}</h6>
          <p class="text-[10px] text-stone-500 truncate mt-0.5" title="${food.address || ''}">📍 ${food.address || food.district || 'TP. Quy Nhơn'}</p>
          <div class="flex items-center justify-between text-[10px] mt-1">
            <span class="font-bold text-rose-500">${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}</span>
            <span class="${status.isOpen ? 'text-emerald-600 font-semibold' : 'text-stone-400'} text-[9px]">${status.detailText}</span>
          </div>
          <div class="mt-1.5 flex gap-1">
            ${(window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : (food.hasShopeeDelivery === true)) ? (
              status.isOpen ? `
              <button onclick="event.stopPropagation();window.app.openShopeeFoodDelivery(${food.id})"
                class="w-full py-1 bg-gradient-to-r from-orange-500 to-[#EE4D2D] hover:from-orange-600 hover:to-[#D73211] text-white text-[9.5px] font-bold rounded-md flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer">
                ${window.getShopeeIcon ? window.getShopeeIcon(15, 'shrink-0') : ''}
                <span>ShopeeFood</span>
              </button>
              ` : `
              <button disabled
                class="w-full py-1 bg-stone-100 border border-stone-200 text-stone-400 text-[9.5px] font-semibold rounded-md flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60 pointer-events-none select-none"
                title="Quán hiện đã đóng cửa">
                ${window.getShopeeIcon ? window.getShopeeIcon(15, 'shrink-0 filter grayscale opacity-50') : ''}
                <span>ShopeeFood</span>
              </button>
              `
            ) : `
            <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
              class="w-full py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[9.5px] font-bold rounded-md flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer">
              <span>Xem đường đi</span>
            </button>
            `}
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
      countBadge.textContent = `${foods.length} quán gần bạn`;
    }

    container.innerHTML = foods.map(food => {
      const status = window.getRestaurantStatus ? window.getRestaurantStatus(food) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
      const isLiked = this.likedFoods.some(f => f.id === food.id);
      const isWillReturn = this.isFoodWillReturn(food.id);
      const willReturnCount = this.getWillReturnCount(food.id);

      return `
      <div onclick="window.app.showFoodDetail(${food.id})" class="food-card ${status.isOpen ? '' : 'is-closed'} cursor-pointer">
        <div class="relative h-32 overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}"
            loading="lazy"
            decoding="async"
            data-name="${food.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${status.isOpen ? '' : 'is-closed-img grayscale'}" />
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
          <h6 class="font-bold text-xs text-stone-900 truncate mb-0.5 cursor-pointer hover:text-rose-600" onclick="window.app.showFoodDetail(${food.id})" title="${food.restaurant}">
            ${food.restaurant}
          </h6>
          <div class="flex items-center justify-between gap-1 mt-0.5">
            <p class="text-[10px] text-stone-500 truncate flex-1" title="${food.address || ''}">
              📍 ${food.address || food.district || 'Quy Nhơn'}
            </p>
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
            <span>🕒 ${food.openTime || (status && status.openTime) || '07:00 - 22:30'}</span>
            <span class="${status.isOpen ? 'text-stone-400 font-normal' : 'text-rose-500 font-bold'}">(${status.detailText || (status.isOpen ? 'Đang mở cửa' : 'Đã đóng cửa')})</span>
          </div>

          <div class="flex items-center justify-between mt-1.5">
            <span class="text-[10px] font-bold text-rose-500">${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}</span>
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

            <!-- 3. Đặt ShopeeFood hoặc Chỉ đường -->
            ${(window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : (food.hasShopeeDelivery === true)) ? (
              status.isOpen ? `
              <button onclick="event.stopPropagation();window.app.openShopeeFoodDelivery(${food.id})"
                class="flex-1 h-7.5 bg-gradient-to-r from-orange-500 to-[#EE4D2D] hover:from-orange-600 hover:to-[#D73211] text-white rounded-lg text-[10.5px] font-extrabold shadow-sm shadow-orange-300/80 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="Đặt món qua ShopeeFood">
                ${window.getShopeeIcon ? window.getShopeeIcon(16, 'shrink-0') : ''}
                <span>ShopeeFood</span>
              </button>
              ` : `
              <button disabled
                class="flex-1 h-7.5 bg-stone-100 border border-stone-200 text-stone-400 rounded-lg text-[10.5px] font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60 pointer-events-none select-none"
                title="Quán hiện đã đóng cửa">
                ${window.getShopeeIcon ? window.getShopeeIcon(16, 'shrink-0 filter grayscale opacity-50') : ''}
                <span>ShopeeFood</span>
              </button>
              `
            ) : `
            <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
              class="flex-1 h-7.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
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

  setMood(moodId) {
    window.soundFX && window.soundFX.playPop();
    this.currentMood = moodId;
    APP_DATA.currentMoodId = moodId;
    this.feedLimit = 24;
    if (this.moodFilter) {
      this.moodFilter.moodId = moodId;
    }

    // Keep expanded if selected mood is in the extended list
    const moodIndex = APP_DATA.moods.findIndex(m => m.id === moodId);
    if (moodIndex >= 6) {
      this.isMoodsExpanded = true;
    }

    this.renderMoodSelector();
    this.renderHeader();
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

  // Áp dụng Gu khẩu vị mới từ khảo sát vào toàn bộ ứng dụng
  applyTastePreferences(prefs) {
    if (window.tasteManager && typeof window.tasteManager.applyTastePreferences === 'function') {
      window.tasteManager.applyTastePreferences(prefs);
    }
    const moodFoods = this.getFoodsForCurrentMood();
    if (window.swipeManager) {
      window.swipeManager.loadCards(moodFoods.length > 0 ? moodFoods : (APP_DATA.foods || []));
    }
    this.renderBentoAndFeed();
    this.renderFoodGrid();
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

    const targetEl = document.getElementById('view-' + tabName);
    if (targetEl && !targetEl.classList.contains('active') && typeof window.switchTab === 'function') {
      window.switchTab(tabName);
      return;
    }

    // Handle view-specific initializations
    if (tabName === 'home') {
      const initialSubTab = this.currentHomeSubTab || 'explore';
      this.switchHomeSubTab(initialSubTab);

      setTimeout(() => {
        if (this.miniMapInstance) {
          this.miniMapInstance.invalidateSize();
        }
      }, 150);
    }
    if (tabName === 'grocery') {
      if (window.groceryManager) {
        window.groceryManager.init();
      }
    }
    if (tabName === 'taste') {
      this.switchHomeSubTab('taste');
      if (window.tasteManager && typeof window.tasteManager.renderLocationRecommendations === 'function') {
        window.tasteManager.renderLocationRecommendations();
      }
    }
    if (tabName === 'liked') {
      this.renderLikedView();
    }
    // Dừng và tắt tiếng toàn bộ Reels khi rời khỏi tab reels
    if (tabName !== 'reels' && window.reelsManager && typeof window.reelsManager.pauseAll === 'function') {
      window.reelsManager.pauseAll();
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
        const curCityId = (APP_DATA?.currentCity?.cityId || 'quynhon').toLowerCase();
        const deckHasCity = window.swipeManager.deck && window.swipeManager.deck.some(f => (f.cityId || 'quynhon').toLowerCase() === curCityId);
        if (!window.swipeManager.deck || window.swipeManager.deck.length === 0 || window.swipeManager.currentIndex >= window.swipeManager.deck.length || !deckHasCity) {
          const foods = this.getFoodsForCurrentMood();
          window.swipeManager.loadCards(foods.length > 0 ? foods : (APP_DATA.foods || []));
        } else {
          window.swipeManager.render();
        }
      }
    } else if (tabName === 'reels') {
      if (window.reelsManager) {
        if (!window.reelsManager.items || window.reelsManager.items.length === 0) {
          window.reelsManager.init();
        } else if (typeof window.reelsManager.onTabVisible === 'function') {
          window.reelsManager.onTabVisible();
        }
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

  switchHomeSubTab(subTab = 'explore') {
    window.soundFX && window.soundFX.playPop();
    this.currentHomeSubTab = subTab;

    const btnTaste = document.getElementById('home-subtab-taste');
    const btnExplore = document.getElementById('home-subtab-explore');
    const secTaste = document.getElementById('home-taste-section');
    const secExplore = document.getElementById('home-explore-section');

    if (subTab === 'taste') {
      if (btnTaste) {
        btnTaste.className = 'flex-1 sm:flex-initial py-1.5 px-3.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs bg-white text-rose-600 whitespace-nowrap';
      }
      if (btnExplore) {
        btnExplore.className = 'flex-1 sm:flex-initial py-1.5 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-stone-600 hover:text-stone-900 whitespace-nowrap';
      }
      if (secTaste) secTaste.classList.remove('hidden');
      if (secExplore) secExplore.classList.add('hidden');

      if (window.tasteManager && typeof window.tasteManager.renderLocationRecommendations === 'function') {
        window.tasteManager.renderLocationRecommendations();
      }
    } else {
      if (btnTaste) {
        btnTaste.className = 'flex-1 sm:flex-initial py-1.5 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-stone-600 hover:text-stone-900 whitespace-nowrap';
      }
      if (btnExplore) {
        btnExplore.className = 'flex-1 sm:flex-initial py-1.5 px-3.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs bg-white text-rose-600 whitespace-nowrap';
      }
      if (secTaste) secTaste.classList.add('hidden');
      if (secExplore) secExplore.classList.remove('hidden');

      if (typeof this.renderBentoAndFeed === 'function') {
        this.renderBentoAndFeed();
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ═══════════════════════════════════════════════════════════════════
  // WISHLIST & PROFILE STATS SYNCHRONIZER (LOCALSTORAGE V2 STANDARD)
  // ═══════════════════════════════════════════════════════════════════
  loadLikedFoodsFromStorage() {
    try {
      // 1. Thử đọc cấu trúc chuẩn v2
      const v2Data = localStorage.getItem('foodtinder_wishlist_v2');
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        if (parsed && Array.isArray(parsed.items)) {
          return parsed.items;
        }
      }
      // 2. Fallback sang v1
      const v1Data = localStorage.getItem('foodtinder_liked');
      if (v1Data) {
        const parsed = JSON.parse(v1Data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('loadLikedFoodsFromStorage error:', e);
    }
    return [];
  }

  saveLikedFoodsToStorage() {
    try {
      const payload = {
        version: 2,
        updatedAt: Date.now(),
        count: Array.isArray(this.likedFoods) ? this.likedFoods.length : 0,
        items: this.likedFoods || []
      };
      localStorage.setItem('foodtinder_wishlist_v2', JSON.stringify(payload));
      // Tương thích ngược với foodtinder_liked (v1)
      localStorage.setItem('foodtinder_liked', JSON.stringify(this.likedFoods || []));
    } catch (e) {
      console.warn('saveLikedFoodsToStorage error:', e);
    }
  }

  syncWishlistAndProfileStats() {
    const count = Array.isArray(this.likedFoods) ? this.likedFoods.length : 0;

    // 1. Header Heart Badge
    const badge = document.getElementById('liked-badge');
    if (badge) {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    // 2. Sidebar Quick Stats (Món đã thích & Lần quẹt hôm nay)
    const statLikedEl = document.getElementById('stat-liked');
    if (statLikedEl) {
      statLikedEl.textContent = count;
    }

    const statSwipesEl = document.getElementById('stat-swipes');
    if (statSwipesEl) {
      let todaySwipes = 0;
      if (window.swipeManager && typeof window.swipeManager.getTodaySwipesCount === 'function') {
        todaySwipes = window.swipeManager.getTodaySwipesCount();
      } else if (window.authManager && typeof window.authManager.getStat === 'function') {
        todaySwipes = window.authManager.getStat('swipes');
      } else {
        todaySwipes = this.swipeCount || 0;
      }
      statSwipesEl.textContent = todaySwipes;
    }

    // 3. Bento / Feed Stats
    const bentoLikedEl = document.getElementById('bento-liked-count');
    if (bentoLikedEl) {
      bentoLikedEl.textContent = count;
    }

    // 4. Modal Profile & Badge
    const profileLikedEl = document.getElementById('profile-modal-liked-count');
    if (profileLikedEl) {
      profileLikedEl.textContent = `${count} món`;
    }

    // 5. Tab Liked Header Count
    const likedItemsCountEl = document.getElementById('liked-items-count');
    if (likedItemsCountEl) {
      likedItemsCountEl.textContent = `${count} món`;
    }

    // 6. Cập nhật sidebar mini panel quẹt
    this.updateSwipeLikedPanel();

    // 7. Đồng bộ danh hiệu
    if (window.authManager) {
      if (typeof window.authManager.syncUI === 'function') {
        window.authManager.syncUI();
      }
      if (typeof window.authManager.updateProfileModalBadge === 'function') {
        window.authManager.updateProfileModalBadge();
      }
    }
  }

  addLikedFood(food) {
    if (!food) return;
    if (!this.likedFoods.some(f => f.id === food.id)) {
      this.likedFoods.unshift(food);
      this.saveLikedFoodsToStorage();
      this.showToast(`Đã thêm "${food.name}" vào Yêu Thích! ❤️`);
      this.syncWishlistAndProfileStats();

      // Update AI Taste Learning Engine & refresh recommendations
      if (window.tasteManager) {
        window.tasteManager.recordLike(food);
        window.tasteManager.renderLocationRecommendations();
      }

      // Ghi nhận điểm đám đông (Crowdsourcing Tags)
      const activeMood = this.moodFilter?.moodId || this.currentMood;
      this.recordCrowdsourceVote(food.id, activeMood);
    }
  }

  removeLikedFood(foodId) {
    this.likedFoods = this.likedFoods.filter(f => f.id !== foodId);
    this.saveLikedFoodsToStorage();
    this.syncWishlistAndProfileStats();
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
      const activeMood = this.moodFilter?.moodId || this.currentMood;
      this.recordCrowdsourceVote(foodId, activeMood);
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
    this.syncWishlistAndProfileStats();
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
          const status = window.getRestaurantStatus ? window.getRestaurantStatus(food) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
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
                class="w-full h-full rounded-xl object-cover cursor-pointer ${status.isOpen ? '' : 'is-closed-img grayscale'}" onclick="window.app.showFoodDetail(${food.id})" />
              <span class="absolute bottom-1 left-1 ${status.isOpen ? 'bg-emerald-600/90 text-white' : 'bg-stone-900/90 text-stone-200'} text-[7.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <span class="w-1 h-1 rounded-full ${status.isOpen ? 'bg-emerald-200' : 'bg-rose-500'}"></span>
                ${status.statusText}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <h5 class="font-bold text-xs text-stone-900 truncate" title="${food.restaurant}">${food.restaurant}</h5>
              <p class="text-[11px] text-stone-500 truncate mt-0.5" title="${food.address || ''}">📍 ${food.address || food.district || 'TP. Quy Nhơn'}</p>
              <p class="text-[10px] mt-1 ${status.isOpen ? 'text-emerald-700 font-semibold' : 'text-stone-400'}">
                🕒 ${food.openTime} <span class="${status.isOpen ? 'text-stone-400' : 'text-rose-500 font-bold'}">(${status.detailText})</span>
              </p>
              <div class="flex items-center gap-2 mt-1 text-[10px] text-stone-400">
                <span class="text-rose-500 font-bold">${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}</span>
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

    if (window.authManager && typeof window.authManager.trackStat === 'function') {
      window.authManager.trackStat('detailsViewed', 1);
    }

    const modal = document.getElementById('food-detail-modal');
    const content = document.getElementById('food-detail-content');
    if (!modal || !content) return;

    const status = window.getRestaurantStatus ? window.getRestaurantStatus(food) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
    const isLiked = this.likedFoods.some(f => f.id === food.id);
    const isWillReturn = this.isFoodWillReturn(food.id);
    const willReturnCount = this.getWillReturnCount(food.id);
    const foodDesc = (food.desc || food.description || '').trim();

    content.innerHTML = `
      <!-- Fixed Image Banner (Header - Cố định ở trên khi cuộn) -->
      <div class="relative w-full h-56 sm:h-64 bg-stone-900 shrink-0">
        <img src="${food.image}" alt="${food.name}"
          data-name="${food.name.replace(/"/g, '&quot;')}"
          data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
          data-category="${food.category || ''}"
          onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
          class="w-full h-full object-cover ${status.isOpen ? '' : 'is-closed-img grayscale'}" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35"></div>
        <button onclick="window.app.closeFoodDetail()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition cursor-pointer z-10 shadow-md" title="Đóng">
          ✕
        </button>
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <div class="flex items-center gap-1.5 mb-1 flex-wrap">
            ${(food.tags || []).map(t => `<span class="bg-rose-500/90 text-[10px] font-bold px-2.5 py-0.5 rounded-full">${t}</span>`).join('')}
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
          <h2 class="font-extrabold text-lg sm:text-xl leading-tight text-white">${food.name}</h2>
          <p class="text-xs text-stone-300 mt-1">${food.restaurant || ''} • ⭐ ${window.formatRating ? window.formatRating(food.rating) : food.rating} (${food.reviewCount || 0} đánh giá)</p>
        </div>
      </div>

      <!-- Quick Action Buttons Bar (Cố định ngay phía dưới hình ảnh để người dùng không phải cuộn) -->
      <div class="px-5 py-3 bg-stone-50/90 border-b border-stone-200/70 flex items-center gap-2.5 shrink-0 z-10">
        <!-- 1. Yêu Thích -->
        <button onclick="window.app.toggleLikedFood(${food.id})" class="flex-1 py-2.5 px-3.5 ${isLiked ? 'bg-gradient-to-r from-rose-600 to-rose-500' : 'bg-gradient-to-r from-rose-500 to-amber-500'} hover:opacity-95 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-98">
          <svg class="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <span>${isLiked ? 'Đã Thích' : 'Yêu Thích'}</span>
        </button>

        <!-- 2. Khách Quen -->
        <button onclick="window.app.toggleWillReturn(${food.id})" data-will-return-btn="${food.id}" class="py-2.5 px-3.5 ${isWillReturn ? 'bg-amber-500 text-white shadow-xs' : 'bg-gradient-to-r from-amber-50 to-orange-50/80 text-amber-900 border border-amber-200/90 hover:bg-amber-100'} rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-98" title="Đánh dấu bạn sẽ là khách quen quay lại quán">
          <span class="text-base leading-none shrink-0 inline-block">😋</span>
          <span><span data-will-return-count="${food.id}">${willReturnCount}</span> khách quen</span>
        </button>

        <!-- 3. Bản Đồ (Đồng bộ icon origami map với bên ngoài) -->
        <button onclick="window.app.openMapWithFood(${food.id})" class="w-10 h-10 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/90 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer active:scale-95 shadow-xs" title="Xem quán và chỉ đường trên bản đồ">
          <svg class="w-4.5 h-4.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
            <line x1="9" y1="3" x2="9" y2="18"></line>
            <line x1="15" y1="6" x2="15" y2="21"></line>
          </svg>
        </button>
      </div>

      <!-- Scrollable Information Body (Chỉ thực hiện cuộn thông tin bên dưới) -->
      <div class="p-5 space-y-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
        <!-- Open/Closed Notice Banner -->
        ${status.isOpen ? `
          <div class="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 flex items-start gap-2.5">
            <span class="text-xl">🟢</span>
            <div>
              <div class="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <span>Đang mở cửa đón khách</span>
                <span class="text-emerald-600 font-semibold">• ${status.detailText}</span>
              </div>
              <p class="text-xs text-emerald-700 mt-0.5">Quán đang mở cửa phục vụ từ <strong class="text-emerald-900">${food.openTime || '07:00 - 22:00'}</strong>. Bạn có thể ghé thưởng thức hoặc bấm "Chỉ đường" để đến quán ngay!</p>
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
              <p class="text-xs text-stone-600 mt-0.5">Giờ hoạt động: <strong class="text-stone-800">${food.openTime || '07:00 - 22:00'}</strong>. Quý khách vẫn có thể xem trước món ăn, giá tiền, địa chỉ và lưu vào Yêu Thích để chuẩn bị ghé quán!</p>
            </div>
          </div>
        `}

        <!-- ShopeeFood Delivery Section hoặc Thưởng thức tại quán -->
        ${(window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : (food.hasShopeeDelivery === true)) ? `
        <div class="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/70 border border-orange-200/90 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs overflow-hidden p-1 border border-orange-200 shrink-0">
                ${window.getShopeeIcon ? window.getShopeeIcon(24, 'object-contain') : '🛍️'}
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

          ${status.isOpen ? `
          <button onclick="window.app.openShopeeFoodDelivery(${food.id})" class="w-full py-3 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-xl font-black text-xs shadow-md shadow-orange-300 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer">
            ${window.getShopeeIcon ? window.getShopeeIcon(22, 'shrink-0') : ''}
            <span>ĐẶT GIAO HÀNG TRÊN SHOPEEFOOD</span>
            <span class="text-xs">↗</span>
          </button>
          ` : `
          <button disabled class="w-full py-3 bg-stone-200 border border-stone-300 text-stone-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-70 select-none">
            ${window.getShopeeIcon ? window.getShopeeIcon(22, 'shrink-0 filter grayscale opacity-50') : ''}
            <span>QUÁN ĐÃ ĐÓNG CỬA • TẠM DỪNG NHẬN ĐƠN</span>
          </button>
          `}
        </div>
        ` : `
        <div class="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/90 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs overflow-hidden p-1 border border-emerald-200 shrink-0 text-base">
                📍
              </span>
              <div>
                <h5 class="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                  <span>Thưởng Thức Trực Tiếp Tại Quán</span>
                  <span class="bg-emerald-600 text-white text-[8.5px] font-black px-1.5 py-0.2 rounded-full uppercase">Tại chỗ</span>
                </h5>
                <p class="text-[10px] text-stone-500">Quán bản địa không phục vụ giao qua ShopeeFood</p>
              </div>
            </div>
            <span class="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-full shadow-xs">
              🍽️ Ăn tại quán / Mang về
            </span>
          </div>

          <p class="text-xs text-stone-600 my-2 leading-relaxed">
            Bạn có thể ghé trực tiếp địa chỉ <strong>${food.address || food.district || 'TP. Quy Nhơn'}</strong> để trải nghiệm không gian và thưởng thức trọn vẹn hương vị nóng hổi nhất!
          </p>

          <div class="mt-3">
            <button onclick="window.app.openMapWithFood(${food.id})" class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-black text-xs shadow-md shadow-emerald-200 flex items-center justify-center transition active:scale-98 cursor-pointer">
              <span>XEM CHỈ ĐƯỜNG TRÊN BẢN ĐỒ</span>
            </button>
          </div>
        </div>
        `}

        ${foodDesc ? `
          <div>
            <h4 class="font-bold text-xs text-stone-800 uppercase tracking-wider mb-1.5">Giới thiệu món ăn</h4>
            <p class="text-xs text-stone-600 leading-relaxed">${foodDesc}</p>
          </div>
        ` : ''}

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
            <span class="font-semibold text-stone-700">${food.openTime || '07:00 - 22:00'}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-400">Giá tham khảo:</span>
            <span class="font-bold text-rose-600">${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : (food.priceRange || '35.000đ ~ 65.000đ')}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-stone-400">Địa chỉ:</span>
            <span class="font-semibold text-stone-700 truncate max-w-[200px]" title="${food.address || ''}">${food.address || 'Đang cập nhật'}</span>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-sheet').classList.remove('translate-y-full');
    }, 10);
  }

  openFoodyReview(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return;

    window.soundFX && window.soundFX.playPop();

    // Link trực tiếp đến trang review của quán trên Foody
    let targetUrl = food.foodyUrl;
    if (!targetUrl) {
      const restName = (food.restaurant || food.name || '').trim();
      targetUrl = `https://www.foody.vn/binh-dinh/dia-diem?q=${encodeURIComponent(restName)}`;
    }
    this.showToast(`⭐ Đang mở trang Review quán "${food.restaurant}" trên Foody...`);
    window.open(targetUrl, '_blank');
  }

  /* ══ RỦ BẠN BÈ ĐI ĂN (IN-APP & DEEPLINK / ZALO / MESSENGER) ══ */
  openInviteFriendsModal(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return;

    window.soundFX && window.soundFX.playPop();

    if (window.authManager && typeof window.authManager.trackStat === 'function') {
      window.authManager.trackStat('sharesSent', 1);
    }

    const modal = document.getElementById('invite-friends-modal');
    if (!modal) return;

    this.currentInviteFoodId = foodId;
    this.renderInviteFriendsContent(foodId, 'my');

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-sheet')?.classList.remove('translate-y-full');
    }, 10);
  }

  closeInviteFriendsModal() {
    const modal = document.getElementById('invite-friends-modal');
    if (!modal) return;
    modal.querySelector('.modal-sheet')?.classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  renderInviteFriendsContent(foodId, activeFilter = 'my') {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    const content = document.getElementById('invite-friends-content');
    if (!food || !content) return;

    const myFriends = APP_DATA.myFriends || [];
    const nearbyFriends = APP_DATA.nearbyFriends || [];
    const groupChats = APP_DATA.groupChats || [];

    content.innerHTML = `
      <div class="relative bg-white flex flex-col h-full overflow-hidden">
        <!-- Top Gradient Header -->
        <div class="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white p-4 shrink-0 relative overflow-hidden">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🍲</span>
              <div>
                <h4 class="font-black text-sm sm:text-base leading-tight">Rủ Bạn Bè Đi Ăn</h4>
                <p class="text-[11px] text-white/90">Lập kèo ăn uống vui vẻ tại Quy Nhơn</p>
              </div>
            </div>
            <button onclick="window.app.closeInviteFriendsModal()" class="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition text-sm cursor-pointer">
              ✕
            </button>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="p-4 overflow-y-auto space-y-4 scrollbar-none flex-1">
          <!-- Food Preview Mini Card: Căn giữa theo chiều dọc items-center -->
          <div class="flex items-center gap-3 p-3 bg-rose-50/50 border border-rose-200/80 rounded-2xl">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 shadow-2xs">
              <img src="${food.image}" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[9.5px] font-extrabold text-rose-600 bg-rose-100/70 px-1.5 py-0.2 rounded-full uppercase">Kèo rủ ăn</span>
              <h5 class="font-extrabold text-xs sm:text-sm text-stone-900 leading-tight truncate mt-0.5">${food.restaurant}</h5>
              <p class="text-[11px] text-stone-500 truncate mt-0.5">📍 ${food.address || 'Quy Nhơn'}</p>
              <div class="flex items-center gap-2 text-[10.5px] text-amber-700 font-bold mt-1">
                <span>${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}</span>
                <span>•</span>
                <span>⭐ ${food.rating || 4.5}</span>
                <span>•</span>
                <span>${food.distanceText || 'Gần bạn'}</span>
              </div>
            </div>
          </div>

          <!-- SECTION 1: Bạn bè chưa dùng app (Zalo / Messenger / Web Share) -->
          <div class="bg-gradient-to-br from-amber-50/80 to-orange-50/60 border border-amber-200/90 rounded-2xl p-3.5 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>📲</span>
                <span>Bạn bè chưa dùng app (Zalo / Messenger)</span>
              </span>
              <span class="text-[9px] bg-amber-200/70 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">Deeplink</span>
            </div>
            <p class="text-[11.5px] text-stone-600 leading-relaxed">
              Gửi link mời qua Zalo/Messenger. Khi bạn bè bấm vào link, web app sẽ mở thẳng vào thẻ quán ăn này để xem chi tiết và cùng bạn <strong>chốt kèo</strong>!
            </p>
            <div class="grid grid-cols-2 gap-2 pt-1">
              <button onclick="window.app.shareInviteViaWebShare(${food.id})" class="py-2.5 px-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95">
                <span>💬</span>
                <span>Gửi qua Zalo</span>
              </button>
              <button onclick="window.app.copyInviteDeeplink(${food.id})" class="py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95">
                <span>📋</span>
                <span>Sao chép Link</span>
              </button>
            </div>
          </div>

          <!-- SECTION 2: Bạn bè đã dùng app -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-black text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>👥</span>
                <span>Bạn bè trong FoodTinder</span>
              </span>
            </div>

            <!-- Sub-tabs -->
            <div class="flex items-center gap-1.5 border-b border-stone-100 pb-1.5 text-xs font-bold">
              <button onclick="window.app.renderInviteFriendsContent(${food.id}, 'my')" 
                class="px-2.5 py-1 rounded-full transition cursor-pointer ${activeFilter === 'my' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
                ❤️ Bạn bè (${myFriends.length})
              </button>
              <button onclick="window.app.renderInviteFriendsContent(${food.id}, 'nearby')" 
                class="px-2.5 py-1 rounded-full transition cursor-pointer ${activeFilter === 'nearby' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
                📍 Quanh bạn (${nearbyFriends.length})
              </button>
              <button onclick="window.app.renderInviteFriendsContent(${food.id}, 'groups')" 
                class="px-2.5 py-1 rounded-full transition cursor-pointer ${activeFilter === 'groups' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
                🍲 Nhóm (${groupChats.length})
              </button>
            </div>

            <!-- Friends List: Hiện trọn vẹn đủ 3 đối tượng, vuốt/cuộn để xem thêm (ẩn hoàn toàn scrollbar) -->
            <div class="space-y-2 h-[206px] max-h-[206px] overflow-y-auto overscroll-contain scrollbar-none no-scrollbar" style="scrollbar-width: none; -ms-overflow-style: none;">
              ${activeFilter === 'my' ? myFriends.map(f => `
                <div class="flex items-center justify-between p-2.5 rounded-xl border border-stone-200/80 bg-white hover:bg-stone-50 transition shrink-0 shadow-2xs">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="relative w-11 h-11 shrink-0">
                      <div class="w-full h-full rounded-full overflow-hidden border border-rose-200 shadow-2xs">
                        <img src="${f.avatar}" class="w-full h-full object-cover" />
                      </div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${f.status === 'Online' ? 'bg-emerald-500' : 'bg-stone-300'} rounded-full ring-2 ring-white shadow-xs z-10" title="${f.status}"></span>
                    </div>
                    <div class="min-w-0">
                      <h6 class="font-bold text-xs text-stone-900 truncate">${f.name}</h6>
                      <p class="text-[10px] text-stone-400 truncate">${f.relation} • ${f.distance || 'Quy Nhơn'}</p>
                    </div>
                  </div>
                  <button onclick="window.app.sendInviteCardToFriend(${f.id}, ${food.id}, false)" 
                    class="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0">
                    Rủ ngay 🍲
                  </button>
                </div>
              `).join('') : ''}

              ${activeFilter === 'nearby' ? nearbyFriends.map(f => `
                <div class="flex items-center justify-between p-2.5 rounded-xl border border-stone-200/80 bg-white hover:bg-stone-50 transition shrink-0 shadow-2xs">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="relative w-11 h-11 shrink-0">
                      <div class="w-full h-full rounded-full overflow-hidden border border-amber-200 shadow-2xs">
                        <img src="${f.avatar}" class="w-full h-full object-cover" />
                      </div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${f.status === 'Online' ? 'bg-emerald-500' : 'bg-stone-300'} rounded-full ring-2 ring-white shadow-xs z-10" title="${f.status}"></span>
                    </div>
                    <div class="min-w-0">
                      <h6 class="font-bold text-xs text-stone-900 truncate">${f.name}, ${f.age}t</h6>
                      <p class="text-[10px] text-stone-400 truncate">Cách bạn ${f.distance} • ${f.craving}</p>
                    </div>
                  </div>
                  <button onclick="window.app.sendInviteCardToFriend(${f.id}, ${food.id}, false)" 
                    class="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0">
                    Rủ ngay 🍲
                  </button>
                </div>
              `).join('') : ''}

              ${activeFilter === 'groups' ? groupChats.map(g => `
                <div class="flex items-center justify-between p-2.5 rounded-xl border border-stone-200/80 bg-white hover:bg-stone-50 transition shrink-0 shadow-2xs">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="relative w-11 h-11 shrink-0">
                      <div class="w-full h-full rounded-2xl overflow-hidden border border-amber-200 shadow-2xs">
                        <img src="${g.avatar}" class="w-full h-full object-cover" />
                      </div>
                      <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[8.5px] font-black px-1.5 py-0.2 rounded-full ring-1 ring-white shadow-xs z-10">${g.membersCount}</span>
                    </div>
                    <div class="min-w-0">
                      <h6 class="font-bold text-xs text-stone-900 truncate">${g.name}</h6>
                      <p class="text-[10px] text-stone-400 truncate">${g.membersCount} thành viên</p>
                    </div>
                  </div>
                  <button onclick="window.app.sendInviteCardToFriend('${g.id}', ${food.id}, true)" 
                    class="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0">
                    Rủ cả nhóm 🍲
                  </button>
                </div>
              `).join('') : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  shareInviteViaWebShare(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return;

    const deeplink = `${window.location.origin}${window.location.pathname}?foodId=${food.id}&invite=1`;
    const shareData = {
      title: `Rủ đi ăn: ${food.restaurant} (Quy Nhơn)`,
      text: `Ê bạn ơi, đi ăn quán "${food.restaurant}" với mình không? Nhìn ngon nhức nách luôn á! Bấm link xem thực đơn & cùng chốt kèo nha:`,
      url: deeplink
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).then(() => {
        this.showToast('🎉 Đã chia sẻ lời mời đi ăn thành công!');
      }).catch(err => {
        if (err.name !== 'AbortError') {
          this.copyInviteDeeplink(foodId);
        }
      });
    } else {
      this.copyInviteDeeplink(foodId);
      setTimeout(() => {
        window.open('https://chat.zalo.me/', '_blank');
      }, 800);
    }
  }

  copyInviteDeeplink(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return;
    const deeplink = `${window.location.origin}${window.location.pathname}?foodId=${food.id}&invite=1`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(deeplink);
      } else {
        const input = document.createElement('textarea');
        input.value = deeplink;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      this.showToast(`📋 Đã sao chép link mời quán "${food.restaurant}"! Gửi qua Zalo/Messenger cho bạn bè ngay nhé! 🎉`);
      window.soundFX && window.soundFX.playMatch();
    } catch (e) {
      this.showToast(`Link mời: ${deeplink}`);
    }
  }

  sendInviteCardToFriend(targetId, foodId, isGroup = false) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return;

    window.soundFX && window.soundFX.playMatch();

    let target = null;
    if (isGroup) {
      target = (APP_DATA.groupChats || []).find(g => g.id === targetId);
    } else {
      target = (APP_DATA.myFriends || []).find(f => f.id === targetId) || 
               (APP_DATA.nearbyFriends || []).find(f => f.id === targetId);
    }

    if (!target) return;

    const inviteMsg = {
      sender: isGroup ? 'Bạn' : 'you',
      cardType: 'invite_card',
      food: {
        id: food.id,
        name: food.name,
        restaurant: food.restaurant,
        image: food.image,
        address: food.address,
        distanceText: food.distanceText,
        priceRange: food.priceRange,
        rating: food.rating
      },
      text: `Ê đi ăn quán "${food.restaurant}" này với mình không? Nhìn ngon nhức nách luôn á! 🤤🍲`,
      time: 'Vừa xong'
    };

    target.messages.push(inviteMsg);
    if (window.chatManager && typeof window.chatManager.saveFriendsData === 'function') {
      window.chatManager.saveFriendsData();
    }

    this.closeInviteFriendsModal();
    this.showToast(`🎉 Đã gửi thẻ rủ đi ăn cho ${target.name}!`);

    // Chuyển sang tab chat và mở bạn bè đó
    if (typeof window.switchTab === 'function') {
      window.switchTab('chat');
    } else if (typeof this.switchTab === 'function') {
      this.switchTab('chat');
    }

    if (window.chatManager) {
      window.chatManager.selectChatTarget(targetId);
    }

    // Auto reply sau 1.5s
    setTimeout(() => {
      window.soundFX && window.soundFX.playPop();
      const replies = [
        `Ui quán này nhìn hấp dẫn xỉu luôn á! Tầm 15 phút nữa mình có mặt nha, chốt kèo luôn! 🛵💨🔥`,
        `Quán ruột của tui luôn nè! Đi liền đi bạn ơi, đang thèm món này dữ dội! 🤤🍲`,
        `Kèo này thơm phức! Để tui chuẩn bị xe chạy qua rước bạn hay gặp ở quán luôn nha? 🥰✨`
      ];
      target.messages.push({
        sender: isGroup ? 'Hoàng Yến' : 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: 'Vừa xong'
      });
      if (window.chatManager) {
        if (window.chatManager.currentChatTarget === targetId) {
          window.chatManager.renderActiveChatWindow();
        }
        window.chatManager.renderFriendsSidebar(false);
        window.chatManager.saveFriendsData();
      }
    }, 1500);
  }

  checkDeeplinkInvite() {
    try {
      const params = new URLSearchParams(window.location.search);
      const foodIdStr = params.get('foodId') || (window.location.hash.startsWith('#food-') ? window.location.hash.replace('#food-', '') : null);
      if (!foodIdStr) return;

      const foodId = parseInt(foodIdStr, 10);
      const food = (APP_DATA.foods || []).find(f => f.id === foodId);
      if (!food) return;

      // Đưa quán lên đầu danh sách swipe deck
      if (window.swipeManager && window.swipeManager.deck) {
        window.swipeManager.deck = [food, ...window.swipeManager.deck.filter(f => f.id !== foodId)];
        window.swipeManager.currentIndex = 0;
        window.swipeManager.renderCards();
      }

      this.switchTab('swipe');
      setTimeout(() => {
        this.showToast(`🎉 Bạn nhận được lời rủ đi ăn tại "${food.restaurant}"! Hãy xem thực đơn & cùng chốt kèo nhé! 🍲`);
        window.soundFX && window.soundFX.playMatch();
      }, 700);
    } catch (e) {
      console.warn('[Deeplink] Error checking invite:', e);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     BẠN BÈ ĐÁNH GIÁ SẼ QUAY LẠI QUÁN (AVATARS & MODAL MORE)
  ═══════════════════════════════════════════════════════════════════ */

  getFriendsWhoWillReturn(foodId) {
    const allFriends = [
      {
        id: 101,
        name: "Hoàng Yến (Yến Ốc)",
        relation: "Bạn thân",
        distance: "Cách bạn 600m",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        status: "Online",
        visitedCount: 4,
        note: "Ốc & hải sản ở đây đỉnh chóp, nước chấm gừng sả siêu thơm!"
      },
      {
        id: 102,
        name: "Minh Quân (Cạ Cứng)",
        relation: "Bạn cạ cứng",
        distance: "Cách bạn 1.1km",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        status: "Online",
        visitedCount: 5,
        note: "Đồ nướng xì xèo đậm vị, không gian bờ kè ngồi nhậu cực đã!"
      },
      {
        id: 103,
        name: "Bảo Ngọc (Trà Sữa)",
        relation: "Đồng nghiệp",
        distance: "Cùng văn phòng",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        status: "Online",
        visitedCount: 3,
        note: "Trà sữa đậm trà, trân châu dẻo bùi và đồ ăn vặt bao ngon!"
      },
      {
        id: 104,
        name: "Tuấn Khang",
        relation: "Bạn thể thao",
        distance: "Cách bạn 2.3km",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        status: "Online",
        visitedCount: 2,
        note: "Nước dùng thanh ngọt, ăn xong chạy bộ bờ biển rất khỏe!"
      },
      {
        id: 105,
        name: "Thu Thảo",
        relation: "Bạn đại học",
        distance: "Cách bạn 1.8km",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        status: "Online",
        visitedCount: 4,
        note: "View quán đẹp chụp hình chill, đồ ăn ra nhanh nóng hổi!"
      },
      {
        id: 201,
        name: "Thanh Hằng",
        relation: "Quanh bạn",
        distance: "Cách bạn 450m",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        status: "Online",
        visitedCount: 3,
        note: "Lẩu và nước sốt chua cay ở đây ngon xuất sắc, hợp tụ tập!"
      },
      {
        id: 202,
        name: "Hải Đăng",
        relation: "Quanh bạn",
        distance: "Cách bạn 800m",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
        status: "Online",
        visitedCount: 2,
        note: "Món ăn hợp khẩu vị, phục vụ chu đáo tận tình!"
      },
      {
        id: 106,
        name: "Phương Linh",
        relation: "Bạn thân",
        distance: "Cách bạn 900m",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
        status: "Online",
        visitedCount: 4,
        note: "Không gian dễ thương, đồ ăn sạch sẽ ngon miệng!"
      }
    ];

    const seed = Number(foodId) || 1;
    // Luôn từ 5 đến 8 bạn bè để hiển thị tối đa 5 bạn bè và more khi > 5
    const count = 5 + (seed % 4);
    const startIdx = seed % allFriends.length;
    const friends = [];
    for (let i = 0; i < count; i++) {
      friends.push(allFriends[(startIdx + i) % allFriends.length]);
    }
    return friends;
  }

  openChatWithFriend(friendId) {
    if (this.closeWillReturnFriendsModal) {
      this.closeWillReturnFriendsModal();
    }
    if (this.closeInviteFriendsModal) {
      this.closeInviteFriendsModal();
    }
    if (typeof switchTab === 'function') {
      switchTab('chat');
    } else if (typeof this.switchTab === 'function') {
      this.switchTab('chat');
    }
    const numId = Number(friendId) || friendId;
    if (window.chatManager) {
      window.chatManager.selectChatTarget(numId);
    }
    this.showToast('💬 Đã mở cuộc trò chuyện với bạn bè!');
  }

  openWillReturnFriendsModal(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    if (!food) return;

    window.soundFX && window.soundFX.playPop();

    const modal = document.getElementById('will-return-friends-modal');
    if (!modal) return;

    this.renderWillReturnFriendsContent(foodId);

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-sheet')?.classList.remove('translate-y-full');
    }, 10);
  }

  closeWillReturnFriendsModal() {
    const modal = document.getElementById('will-return-friends-modal');
    if (!modal) return;
    modal.querySelector('.modal-sheet')?.classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  renderWillReturnFriendsContent(foodId) {
    const food = (APP_DATA.foods || []).find(f => f.id === foodId);
    const content = document.getElementById('will-return-friends-content');
    if (!food || !content) return;

    const friends = this.getFriendsWhoWillReturn(foodId);

    content.innerHTML = `
      <!-- Header -->
      <div class="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between shrink-0 shadow-sm">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shrink-0">
            😋
          </div>
          <div class="min-w-0">
            <h4 class="font-extrabold text-sm leading-tight truncate">Bạn bè sẽ quay lại quán</h4>
            <p class="text-[11px] text-amber-100 truncate mt-0.5">${food.restaurant}</p>
          </div>
        </div>
        <button onclick="window.app.closeWillReturnFriendsModal()" class="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white text-sm cursor-pointer transition active:scale-95 shrink-0">
          ✕
        </button>
      </div>

      <!-- Description / Badge info -->
      <div class="px-4 py-2.5 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
        <span class="text-xs font-bold text-amber-900 flex items-center gap-1.5">
          <span>👥 Có <strong>${friends.length} người bạn</strong> đã chọn sẽ quay lại quán</span>
        </span>
        <span class="text-[10px] text-amber-700 bg-amber-200/60 font-semibold px-2 py-0.5 rounded-full">Vuốt xem thêm 👇</span>
      </div>

      <!-- Friends List: Hiện trọn vẹn đủ 3 người, sau đó vuốt để xem thêm -->
      <div class="h-[216px] max-h-[216px] overflow-y-auto overscroll-contain scrollbar-none no-scrollbar p-3 space-y-2 bg-stone-50/50" style="scrollbar-width: none; -ms-overflow-style: none;">
        ${friends.map(f => `
          <div class="bg-white p-2.5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-amber-300 transition flex items-center justify-between gap-3">
            <!-- Left: Avatar with Online badge (Click to chat) -->
            <div onclick="window.app.openChatWithFriend(${f.id})" 
                 class="relative w-11 h-11 shrink-0 cursor-pointer group"
                 title="Bấm vào avatar để nhắn tin với ${f.name}">
              <img src="${f.avatar}" alt="${f.name}" class="w-full h-full rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 group-hover:ring-2 group-hover:ring-rose-400 transition" />
              <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs z-10"></span>
            </div>

            <!-- Middle: Info & Quote (Click to chat) -->
            <div onclick="window.app.openChatWithFriend(${f.id})" class="min-w-0 flex-1 cursor-pointer">
              <div class="flex items-center gap-1.5">
                <h5 class="font-bold text-xs text-stone-900 truncate">${f.name}</h5>
                <span class="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 font-extrabold px-1.5 py-0.2 rounded-full shrink-0">Đã ghé ${f.visitedCount} lần</span>
              </div>
              <p class="text-[10.5px] text-stone-500 truncate mt-0.5">${f.relation} • ${f.distance}</p>
              <p class="text-[10.5px] text-stone-600 italic truncate mt-0.5 text-stone-500">"${f.note}"</p>
            </div>

            <!-- Right: Action Button -->
            <button onclick="window.app.openChatWithFriend(${f.id})" 
              class="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-[11px] rounded-full shadow-xs active:scale-95 transition cursor-pointer shrink-0 flex items-center gap-1"
              title="Nhắn tin với ${f.name}">
              <span>Nhắn tin</span>
              <span>💬</span>
            </button>
          </div>
        `).join('')}
      </div>

      <!-- Footer Info -->
      <div class="p-3 bg-white border-t border-stone-100 text-center">
        <p class="text-[11px] text-stone-400">💡 Bấm vào ảnh đại diện hoặc nút "Nhắn tin" để lập kèo đi ăn cùng bạn bè</p>
      </div>
    `;
  }

  openShopeeFoodDelivery(foodId) {
    const food = APP_DATA.foods.find(f => f.id === foodId);
    if (!food) return;

    const hasShopee = window.hasShopeeDelivery ? window.hasShopeeDelivery(food) : (food.hasShopeeDelivery === true);
    if (!hasShopee) {
      this.showToast(`📍 Quán ${food.restaurant} phục vụ trực tiếp tại chỗ, không có trên ShopeeFood!`);
      this.openMapWithFood(foodId);
      return;
    }

    window.soundFX && window.soundFX.playPop();

    if (window.authManager && typeof window.authManager.trackStat === 'function') {
      window.authManager.trackStat('shopeeOrders', 1);
    }

    const deliveryUrl = (food.deliveryUrl && food.deliveryUrl.startsWith('http') && !food.deliveryUrl.includes('danh-sach-dia-diem'))
      ? food.deliveryUrl
      : ((food.deliverySearchUrl && !food.deliverySearchUrl.includes('danh-sach-dia-diem'))
          ? food.deliverySearchUrl
          : 'https://shopeefood.vn/binh-dinh');

    const modal = document.getElementById('delivery-modal');
    const content = document.getElementById('delivery-modal-content');
    if (!modal || !content) {
      // Direct open fallback
      this.redirectToShopeeFood(deliveryUrl, food.name, food.restaurant);
      return;
    }

    const status = window.getRestaurantStatus ? window.getRestaurantStatus(food) : { isOpen: true, statusText: "Đang mở cửa", detailText: "08:00 - 22:00" };
    const isLiked = this.likedFoods.some(f => f.id === food.id);
    const isWillReturn = this.isFoodWillReturn(food.id);
    const willReturnCount = this.getWillReturnCount(food.id);
    const promoCode = food.deliveryPromoCode || "SHOPEE25K";

    content.innerHTML = `
      <div class="relative bg-white max-h-[85vh] flex flex-col">
        <!-- Orange Brand Header Banner -->
        <div class="bg-gradient-to-r from-[#EE4D2D] to-[#FF6B4A] text-white p-4 shrink-0 relative overflow-hidden">
          <div class="absolute -right-4 -bottom-6 text-7xl opacity-15 pointer-events-none">🛵</div>
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs overflow-hidden p-1 shrink-0">
                <img src="images/shopeefood-icon.png" class="w-full h-full object-contain" alt="ShopeeFood" />
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
                <h4 class="font-black text-xs sm:text-sm text-stone-900 truncate">🏪 ${food.restaurant}</h4>
                <p class="text-[10px] text-stone-500 truncate mt-0.5">📍 ${food.address} (${food.distanceText})</p>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs font-black text-rose-600">${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : (food.priceRange || '35.000đ ~ 65.000đ')}</span>
                <span class="text-[9.5px] font-bold ${status.isOpen ? 'text-emerald-600' : 'text-rose-500'}">
                  ${status.isOpen ? '🟢 Đang nhận đơn giao' : `🌙 ${status.detailText || 'Quán đã đóng'}`}
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
                <div class="text-[11px] font-extrabold text-orange-900">${food.deliveryPromo || 'Mã SHOPEE30K giảm 30.000đ'}</div>
                <p class="text-[9.5px] text-orange-600">Áp dụng ngay khi thanh toán qua ShopeeFood</p>
              </div>
            </div>
            <button onclick="window.app.copyVoucher('${promoCode}')" class="px-2.5 py-1.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white rounded-lg text-[10px] font-black shadow-xs transition shrink-0 active:scale-95">
              Sao chép mã
            </button>
          </div>
        </div>

        <!-- Sticky Bottom Action Footer -->
        <div class="p-4 bg-white border-t border-stone-100 shrink-0">
          ${status.isOpen ? `
          <button onclick="window.app.redirectToShopeeFood('${deliveryUrl}', '${food.name.replace(/'/g, "\\'")}', '${food.restaurant.replace(/'/g, "\\'")}')" 
            class="w-full py-3.5 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-300 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer">
            ${window.getShopeeIcon ? window.getShopeeIcon(24, 'shrink-0') : ''}
            <span>MỞ QUÁN TRÊN SHOPEEFOOD ĐẶT HÀNG</span>
            <span>↗</span>
          </button>
          ` : `
          <button disabled
            class="w-full py-3.5 bg-stone-100 border border-stone-200 text-stone-400 rounded-2xl font-bold text-sm shadow-none flex items-center justify-center gap-2 cursor-not-allowed opacity-80 select-none filter grayscale"
            title="Quán hiện đang ngoài giờ phục vụ (${status.detailText})">
            ${window.getShopeeIcon ? window.getShopeeIcon(24, 'shrink-0 filter grayscale opacity-40') : ''}
            <span>QUÁN ĐANG TẠM NGHỈ • ${status.detailText ? status.detailText.toUpperCase() : 'NGOÀI GIỜ PHỤC VỤ'}</span>
          </button>
          `}
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
    if (window.authManager && typeof window.authManager.trackStat === 'function') {
      window.authManager.trackStat('shopeeOrders', 1);
    }
    this.showToast(`🛵 Đang mở ShopeeFood đặt món: ${dishName}!`);

    let targetUrl = url;
    // Đảm bảo không mở trang lỗi 404 danh-sach-dia-diem
    if (!targetUrl || targetUrl.includes('danh-sach-dia-diem')) {
      targetUrl = 'https://shopeefood.vn/binh-dinh';
    }
    window.open(targetUrl, '_blank');
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

    if (window.authManager && typeof window.authManager.trackStat === 'function') {
      window.authManager.trackStat('mapDirections', 1);
    }

    // 1. Tên quán gốc và địa chỉ gốc (Giữ nguyên tên quán và địa chỉ chuẩn từ database)
    let restName = (food.restaurant || food.name || '').trim();
    let rawAddress = (food.address || '').trim();

    // Bỏ số 0 vô nghĩa ở đầu số nhà (VD: "05 Phó Đức Chính" -> "5 Phó Đức Chính") để Google Maps nhận diện chính xác
    rawAddress = rawAddress.replace(/^0+([1-9])/, '$1');

    // 2. Xác định Tỉnh / Thành phố chính xác của quán ăn (tránh bị gán nhầm tỉnh hiện tại)
    const cityOpt = (APP_DATA.weatherOptions || []).find(w => w.cityId === food.cityId) ||
                    (APP_DATA.districtOptions || []).find(d => d.cityId === food.cityId) ||
                    (APP_DATA.currentCity && APP_DATA.currentCity.cityId === food.cityId ? APP_DATA.currentCity : null) ||
                    (APP_DATA.weatherOptions || []).find(w => (food.address && food.address.includes(w.shortName)) || (food.restaurant && food.restaurant.includes(w.shortName)));

    const rawCityName = food.cityName || cityOpt?.shortName || cityOpt?.city || (food.cityId === 'quynhon' ? 'Quy Nhơn' : (APP_DATA.currentCity?.name)) || 'Quy Nhơn';
    const cleanCityName = rawCityName.split('(')[0].replace(/cũ/gi, '').trim();

    // Xác định đúng Tỉnh/Thành phố của quán
    let cleanProvince = (cityOpt?.province || '').split('(')[0].trim();
    if (!cleanProvince) {
      const lowerCity = cleanCityName.toLowerCase();
      if (lowerCity.includes('quy nhơn') || food.cityId === 'quynhon') cleanProvince = 'Bình Định';
      else if (lowerCity.includes('hà nội') || food.cityId === 'hanoi') cleanProvince = 'Hà Nội';
      else if (lowerCity.includes('hải phòng') || food.cityId === 'haiphong') cleanProvince = 'Hải Phòng';
      else if (lowerCity.includes('đà nẵng') || food.cityId === 'danang') cleanProvince = 'Đà Nẵng';
      else if (lowerCity.includes('hồ chí minh') || lowerCity.includes('sài gòn') || food.cityId === 'saigon') cleanProvince = 'TP. Hồ Chí Minh';
      else if (lowerCity.includes('nha trang') || food.cityId === 'nhatrang') cleanProvince = 'Khánh Hòa';
      else if (lowerCity.includes('đà lạt') || food.cityId === 'dalat') cleanProvince = 'Lâm Đồng';
      else if (lowerCity.includes('huế') || food.cityId === 'hue') cleanProvince = 'Thừa Thiên Huế';
      else cleanProvince = cleanCityName;
    }

    // 3. Địa chỉ chuẩn xác gồm [Số nhà + Tên đường, Thành phố, Tỉnh]:
    let fullAddress = rawAddress;
    if (fullAddress && cleanCityName && !fullAddress.toLowerCase().includes(cleanCityName.toLowerCase())) {
      fullAddress += `, ${cleanCityName}`;
    }
    if (cleanProvince && fullAddress && !fullAddress.toLowerCase().includes(cleanProvince.toLowerCase()) && cleanProvince.toLowerCase() !== cleanCityName.toLowerCase()) {
      fullAddress += `, ${cleanProvince}`;
    }

    // 4. Lấy tọa độ latitude và longitude của quán:
    const foodLat = (food.latitude !== undefined && food.latitude !== null) ? food.latitude : food.lat;
    const foodLng = (food.longitude !== undefined && food.longitude !== null) ? food.longitude : food.lng;
    const hasValidCoords = foodLat && foodLng && !isNaN(Number(foodLat)) && !isNaN(Number(foodLng));
    const coordStr = hasValidCoords ? `${Number(foodLat).toFixed(6).replace(/\.?0+$/, '')},${Number(foodLng).toFixed(6).replace(/\.?0+$/, '')}` : '';

    const cleanRestName = restName.replace(/["']/g, '').trim();
    const cleanAddr = fullAddress.replace(/["']/g, '').trim();

    // 5. Trích xuất tên đường/số nhà ngắn gọn (bỏ chữ "Lô", "Số", bỏ phần phường/xã để tạo query chuẩn xác nhất):
    const streetPart = (rawAddress.split(',')[0] || '').trim();
    const cleanStreet = streetPart.replace(/^(?:Lô|Số|Khu\s+vực|Đường)\s+/i, '').trim();

    // Tạo query điểm đến chuẩn Google Maps: [Tên quán], [Số nhà/Đường], [Thành phố]
    // Giúp Google Maps nhận diện đích đến là quán ăn chính xác (hiển thị thẻ thông tin quán, hình ảnh, đánh giá)
    // thay vì tự động reverse-geocode thành số nhà ngẫu nhiên
    let destTitleQuery = cleanRestName;
    if (cleanStreet && !cleanRestName.toLowerCase().includes(cleanStreet.toLowerCase())) {
      destTitleQuery += `, ${cleanStreet}`;
    }
    if (cleanCityName && !destTitleQuery.toLowerCase().includes(cleanCityName.toLowerCase())) {
      destTitleQuery += `, ${cleanCityName}`;
    }

    // 6. Xác định điểm xuất phát (Origin) - Vị trí hiện tại của người dùng:
    const userLat = APP_DATA?.homeLocation?.lat || APP_DATA?.currentCity?.lat;
    const userLng = APP_DATA?.homeLocation?.lng || APP_DATA?.currentCity?.lng;
    const hasUserCoords = userLat && userLng && !isNaN(Number(userLat)) && !isNaN(Number(userLng));

    const originStr = hasUserCoords
      ? `${Number(userLat).toFixed(6).replace(/\.?0+$/, '')},${Number(userLng).toFixed(6).replace(/\.?0+$/, '')}`
      : 'Current+Location';

    const userAddrLabel = APP_DATA?.currentCity?.address || 'Vị trí hiện tại của bạn';

    // 7. Xây dựng URL Google Maps chuẩn xác:
    // Kiểm tra tính tương đồng thương hiệu và địa chỉ giữa restaurant và gmapsName:
    // Tránh trường hợp fuzzy search của Google Maps tự động match sai quán khác (vd: Bếp Nhà Sam -> Bếp Nhà Xứ Nẫu).
    let isGmapsMatch = true;
    if (food.gmapsName && food.restaurant) {
      const stopWords = new Set(['quán', 'tiệm', 'bếp', 'nhà', 'ẩm', 'thực', 'cơm', 'bún', 'ốc', 'cafe', 'cà', 'phê', 'trà', 'sữa', 'ăn', 'vặt', 'đặc', 'sản', 'hải', 'sản', 'bánh', 'xèo', 'lẩu', 'nướng', 'quy', 'nhơn', 'bình', 'định', 'food', 'tinder', '-', '&', '+', '/']);
      const getWords = (str) => (str.toLowerCase().match(/[\p{L}\d]+/gu) || []).filter(w => !stopWords.has(w) && isNaN(w));
      const restWords = getWords(food.restaurant);
      const gmapsWords = getWords(food.gmapsName);
      if (restWords.length > 0 && gmapsWords.length > 0) {
        const hasCommon = restWords.some(w => gmapsWords.includes(w));
        if (!hasCommon) {
          isGmapsMatch = false;
        }
      }
    }

    const safeGmapsName = isGmapsMatch ? food.gmapsName : null;
    const safePlaceId = isGmapsMatch ? food.placeId : null;

    const targetDestName = safeGmapsName || cleanRestName;
    const hasPlaceId = safePlaceId && safePlaceId.startsWith('ChIJ') && !safePlaceId.startsWith('ChIJ_food_');

    const primaryDirUrl = hasPlaceId
      ? `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${encodeURIComponent(targetDestName)}&destination_place_id=${safePlaceId}`
      : `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${encodeURIComponent(cleanAddr)}`;

    const primaryDestHint = `Từ ${userAddrLabel} ➔ ${targetDestName}`;
    const statusNoteText = `🎯 Dẫn đường Google Maps từ ${userAddrLabel} đến ${targetDestName} (${cleanAddr}).`;

    // URL Tìm kiếm / Xem thẻ thông tin quán trên Google Maps:
    const gmapsSearchUrl = hasPlaceId
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(targetDestName)}&query_place_id=${safePlaceId}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destTitleQuery)}`;

    // URL Dẫn đường theo tọa độ vệ tinh GPS (phòng trường hợp người dùng muốn đi đúng tọa độ số):
    const gmapsCoordsDirUrl = hasValidCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${coordStr}`
      : primaryDirUrl;

    const modal = document.getElementById('google-maps-modal');
    if (!modal) {
      if (confirm(`Bạn có muốn mở Google Maps để dẫn đường từ vị trí hiện tại đến "${cleanRestName}" không?`)) {
        window.open(primaryDirUrl, '_blank');
      }
      return;
    }

    const restEl = document.getElementById('gmaps-modal-restaurant');
    const addrEl = document.getElementById('gmaps-modal-address');
    const distEl = document.getElementById('gmaps-modal-distance');
    const coordsEl = document.getElementById('gmaps-modal-coords');
    const coordsBox = document.getElementById('gmaps-modal-coords-box');
    const destHintEl = document.getElementById('gmaps-modal-dest-hint');
    const noteEl = document.getElementById('gmaps-modal-note');
    const originLabelEl = document.getElementById('gmaps-modal-origin-label');
    const confirmBtn = document.getElementById('gmaps-modal-confirm-btn');
    const gpsBtn = document.getElementById('gmaps-modal-gps-btn');
    const searchBtn = document.getElementById('gmaps-modal-search-btn');
    const inAppBtn = document.getElementById('gmaps-modal-inapp-btn');

    if (originLabelEl) {
      originLabelEl.textContent = userAddrLabel;
      originLabelEl.title = userAddrLabel;
    }
    if (restEl) restEl.textContent = restName;
    if (addrEl) addrEl.textContent = fullAddress;
    if (distEl) distEl.textContent = food.distanceText ? food.distanceText : (food.distance ? `Cách bạn ${food.distance}km` : 'Gần bạn');
    if (destHintEl) destHintEl.textContent = primaryDestHint;
    if (noteEl) noteEl.textContent = statusNoteText;
    if (coordsEl && coordStr) {
      coordsEl.textContent = coordStr;
      if (coordsBox) coordsBox.style.display = 'flex';
    } else if (coordsBox) {
      coordsBox.style.display = 'none';
    }

    // Nút 1: Chỉ đường chính từ vị trí hiện tại đến quán
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        this.closeGoogleMapsModal();
        this.showToast(`🧭 Đang mở chỉ đường từ vị trí của bạn đến: ${cleanRestName}...`);
        window.open(primaryDirUrl, '_blank');
      };
    }

    // Nút 2: Chỉ đường GPS từ vị trí hiện tại đến tọa độ vệ tinh GPS quán
    if (gpsBtn) {
      gpsBtn.onclick = () => {
        this.closeGoogleMapsModal();
        this.showToast(`🎯 Đang mở chỉ đường GPS từ vị trí của bạn đến: ${coordStr || cleanRestName}...`);
        window.open(gmapsCoordsDirUrl, '_blank');
      };
    }

    // Nút 3: Xem địa điểm, hồ sơ thông tin quán trên Google Maps
    if (searchBtn) {
      searchBtn.onclick = () => {
        this.closeGoogleMapsModal();
        this.showToast(`📍 Đang mở thông tin ${cleanRestName} trên Google Maps...`);
        window.open(gmapsSearchUrl, '_blank');
      };
    }

    // Nút 4: Xem ngay trên Bản đồ App FoodTinder
    if (inAppBtn) {
      inAppBtn.onclick = () => {
        this.closeGoogleMapsModal();
        this.switchTab('map');
        if (window.mapManager) {
          setTimeout(() => {
            window.mapManager.initMap();
            window.mapManager.selectFood(food.id, true);
          }, 300);
        }
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

  switchLocationToQuyNhon() {
    this.selectCityAndWeather('Quy Nhơn', 'Quy Nhơn, P. Quy Nhơn Nam', '27°C', 'Mát mẻ', '⛅', 13.7765, 109.2235, 'quynhon');
    this.showToast('📍 Đã chuyển về vị trí trung tâm TP. Quy Nhơn!');
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
    this.ensureMoodFilter();
    const matchedOpt = (APP_DATA.districtOptions || []).find(w => w.cityId === cityId || w.city === city) ||
                       APP_DATA.weatherOptions.find(w => w.cityId === cityId || w.city === city);
    const resolvedCityId = cityId || matchedOpt?.cityId || 'quynhon';

    APP_DATA.currentCity = {
      name: city,
      cityId: resolvedCityId,
      isDistrict: matchedOpt?.isDistrict || false,
      parentProvince: matchedOpt?.parentProvince || '',
      address: address,
      lat: Number(lat),
      lng: Number(lng),
      weather: { temp, condition, icon }
    };

    APP_DATA.homeLocation = {
      cityId: resolvedCityId,
      name: city,
      address: address,
      lat: Number(lat),
      lng: Number(lng),
      latitude: Number(lat),
      longitude: Number(lng)
    };

    // Lọc bỏ toàn bộ quán ảo khỏi Database
    if (typeof window.isFakeDummyFood === 'function' && Array.isArray(APP_DATA.foods)) {
      APP_DATA.foods = APP_DATA.foods.filter(f => !window.isFakeDummyFood(f));
    }

    // If selected location has signature specialties, register them into APP_DATA.foods
    if (matchedOpt && Array.isArray(matchedOpt.specialties) && matchedOpt.specialties.length > 0) {
      matchedOpt.specialties.forEach((spec, sIdx) => {
        let parsedRest = spec.rest || `Đặc Sản ${matchedOpt?.shortName || city}`;
        let parsedAddr = spec.address || matchedOpt?.address || address;
        if (spec.rest && /[-–—]/.test(spec.rest)) {
          const parts = spec.rest.split(/[-–—]/);
          parsedRest = parts[0].trim();
          const branch = parts.slice(1).join(' - ').trim();
          if (branch && !spec.address) {
            parsedAddr = branch;
            const cleanC = (matchedOpt?.shortName || city || '').split('(')[0].replace(/cũ/gi, '').trim();
            if (cleanC && !parsedAddr.toLowerCase().includes(cleanC.toLowerCase())) {
              parsedAddr += `, ${cleanC}`;
            }
          }
        }

        const foodId = 6000 + Math.abs(Math.round(lat * 100)) + sIdx;
        const foodLat = (spec.latitude !== undefined && spec.latitude !== null) ? spec.latitude : (spec.lat || (lat + (sIdx * 0.002)));
        const foodLng = (spec.longitude !== undefined && spec.longitude !== null) ? spec.longitude : (spec.lng || (lng + (sIdx * 0.002)));

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

        const existingFood = APP_DATA.foods.find(f => f.id === foodId || (f.name === spec.name && f.cityId === resolvedCityId));
        if (existingFood) {
          existingFood.restaurant = parsedRest;
          existingFood.address = parsedAddr;
          existingFood.distance = Number(realDistKm.toFixed(1));
          existingFood.distanceText = distText;
          existingFood.latitude = foodLat;
          existingFood.longitude = foodLng;
          existingFood.lat = foodLat;
          existingFood.lng = foodLng;
        } else {
          APP_DATA.foods.push({
            id: foodId,
            cityId: resolvedCityId,
            cityName: city,
            name: spec.name,
            restaurant: parsedRest,
            address: parsedAddr,
            distance: Number(realDistKm.toFixed(1)),
            distanceText: distText,
            weatherNote: `${condition} ${temp}`,
            priceRange: spec.price || "45.000đ - 85.000đ",
            rating: Number(window.formatRating ? window.formatRating(4.8 + (sIdx % 2) * 0.1) : (4.8 + (sIdx % 2) * 0.1).toFixed(1)),
            reviewCount: 1620 + sIdx * 250,
            latitude: foodLat,
            longitude: foodLng,
            lat: foodLat,
            lng: foodLng,
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

    // Kiểm tra Database: nếu có quán thì nạp ra hiển thị, nếu chưa có thì cào từ ShopeeFood
    if (window.crawlerManager && typeof window.crawlerManager.ensureLocationData === 'function') {
      window.crawlerManager.ensureLocationData({
        cityId: resolvedCityId,
        cityName: city,
        address: address,
        lat: lat,
        lng: lng
      });
    }

    // Re-render Location & Taste recommendations
    if (window.tasteManager) {
      window.tasteManager.resetRadius();
      window.tasteManager.renderLocationRecommendations();
    }

    // Luôn nạp lại bộ thẻ quẹt theo thành phố mới
    if (window.swipeManager) {
      const moodFoods = this.getFoodsForCurrentMood();
      window.swipeManager.loadCards(moodFoods.length > 0 ? moodFoods : (APP_DATA.foods || []));
    }

    if (window.mapManager && window.mapManager.map) {
      window.mapManager.map.setView([lat, lng], 14);
      window.mapManager.renderUserLocation();
      window.mapManager.renderMarkers();
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
