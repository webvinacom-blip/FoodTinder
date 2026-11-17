
// ==========================================
// THUẬT TOÁN ĐỀ XUẤT THÔNG MINH FOODTINDER
// 1. MA TRẬN THUỘC TÍNH (ATTRIBUTE MATRIX)
// ==========================================
const MOOD_ATTRIBUTE_MATRIX = {
  // Căng thẳng / Xả stress: đồ cay endorphin, đồ giòn xả stress
  stress: {
    spicy: 2.0,
    crunchy: 1.8,
    salty: 1.2,
    heavy: 1.0,
    hot_soup: 0.8,
    sour: 0.8,
    drinks: 0.5,
    sweet: 0.2,
    light: 0.2
  },
  // Buồn rầu / Cần vỗ về: đồ ngọt ngào, nước nóng ấm dịu dàng
  comfort: {
    sweet: 1.8,
    hot_soup: 2.0,
    light: 1.3,
    drinks: 1.0,
    heavy: 0.6,
    salty: 0.5,
    crunchy: 0.4,
    sour: 0.3,
    spicy: 0.2
  },
  // Chill / Thư giãn / Nhẹ nhàng: đồ chay thanh đạm, cà phê, trà
  chill: {
    drinks: 2.0,
    light: 1.8,
    sweet: 1.3,
    crunchy: 0.8,
    hot_soup: 0.6,
    salty: 0.4,
    sour: 0.5,
    heavy: 0.2,
    spicy: 0.1
  },
  // Thèm ngọt: chè, kem, trà sữa, bánh ngọt (loại bỏ món mặn)
  sweet: {
    sweet: 2.5,
    drinks: 1.8,
    light: 0.8,
    crunchy: 0.4,
    hot_soup: 0.0,
    salty: -1.5,
    heavy: -1.0,
    spicy: -2.0,
    sour: 0.3
  },
  // Thanh tịnh: thuần chay, an lạc
  zen: {
    light: 2.5,
    hot_soup: 1.2,
    drinks: 1.0,
    sweet: 0.6,
    crunchy: 0.5,
    sour: 0.4,
    salty: 0.3,
    heavy: -0.5,
    spicy: -1.0
  },
  // Thèm ăn ngon: đậm đà, giòn rụm, đặc sản no nê
  craving: {
    crunchy: 2.0,
    heavy: 1.8,
    salty: 1.6,
    spicy: 1.2,
    hot_soup: 1.0,
    sour: 0.8,
    drinks: 0.4,
    sweet: 0.3,
    light: 0.2
  },
  // Sôi động: nướng xì xèo, lẩu, tụ tập bạn bè
  energetic: {
    heavy: 2.0,
    salty: 1.8,
    crunchy: 1.5,
    spicy: 1.4,
    hot_soup: 1.2,
    drinks: 0.8,
    sour: 0.7,
    light: 0.2,
    sweet: 0.2
  },
  // Hải sản: hải sản tươi mặn mà, ốc, sốt me muối ớt
  seafood: {
    salty: 2.2,
    hot_soup: 1.5,
    sour: 1.4,
    heavy: 1.4,
    spicy: 1.3,
    crunchy: 1.0,
    drinks: 0.4,
    light: 0.4,
    sweet: -0.5
  },
  // Lai rai: mồi bén, ốc, nướng, bia
  hangout: {
    salty: 2.2,
    crunchy: 1.8,
    spicy: 1.6,
    heavy: 1.3,
    sour: 1.2,
    hot_soup: 0.8,
    drinks: 0.8,
    sweet: 0.1,
    light: 0.3
  },
  // Giải nhiệt: kem, chè đá, nước ép, sinh tố thanh mát
  refreshing: {
    drinks: 2.2,
    sweet: 1.8,
    light: 1.7,
    sour: 1.2,
    crunchy: 0.5,
    hot_soup: -1.0,
    heavy: -1.5,
    spicy: -1.5,
    salty: -0.5
  },
  // Mệt mỏi: cháo ấm, súp bổ dưỡng, bún cá thanh ngọt
  tired: {
    hot_soup: 2.2,
    light: 2.0,
    drinks: 1.0,
    sweet: 0.6,
    salty: 0.5,
    sour: 0.4,
    crunchy: 0.3,
    heavy: -0.5,
    spicy: -1.0
  },
  // Eat Clean: thanh lọc, rau xanh, salad, nước ép
  healthy: {
    light: 2.5,
    drinks: 1.4,
    sour: 1.0,
    hot_soup: 0.8,
    sweet: 0.3,
    salty: 0.2,
    crunchy: 0.2,
    heavy: -1.2,
    spicy: -1.0
  },
  // Viêm túi: bình dân, no bụng
  budget: {
    crunchy: 1.5,
    hot_soup: 1.5,
    light: 1.3,
    heavy: 1.2,
    salty: 1.0,
    sweet: 0.8,
    drinks: 0.8,
    sour: 0.6,
    spicy: 0.6
  },
  // Tự thưởng: sang chảnh, hải sản tươi, steak, lẩu tiệc
  celebrate: {
    heavy: 2.2,
    salty: 2.0,
    hot_soup: 1.5,
    spicy: 1.2,
    crunchy: 1.2,
    drinks: 1.0,
    sweet: 0.8,
    sour: 0.8,
    light: 0.2
  },
  // Hẹn hò: view biển, cafe acoustic, món tinh tế
  date: {
    drinks: 2.0,
    sweet: 1.7,
    light: 1.5,
    crunchy: 1.0,
    heavy: 0.9,
    hot_soup: 0.8,
    sour: 0.7,
    salty: 0.6,
    spicy: 0.4
  },
  // Thèm cay: món cay toát mồ hôi, mì cay sa tế
  spicy: {
    spicy: 2.5,
    hot_soup: 1.6,
    crunchy: 1.4,
    salty: 1.3,
    sour: 1.0,
    heavy: 1.0,
    drinks: 0.5,
    sweet: 0.1,
    light: 0.2
  },
  // Nhanh gọn: bánh mì giòn, bánh bèo, xôi
  quick: {
    crunchy: 2.0,
    light: 1.6,
    heavy: 1.3,
    salty: 1.2,
    drinks: 0.9,
    hot_soup: 0.8,
    sweet: 0.6,
    sour: 0.5,
    spicy: 0.5
  },
  // Ăn đêm: cháo đêm, ốc, đồ ấm khuya
  late_night: {
    hot_soup: 2.0,
    crunchy: 1.8,
    salty: 1.7,
    spicy: 1.3,
    heavy: 1.2,
    drinks: 0.6,
    sour: 0.6,
    light: 0.4,
    sweet: 0.3
  }
};

// 4. DỮ LIỆU ĐÁM ĐÔNG ĐỊA PHƯƠNG (CROWDSOURCING WISDOM)
// Mô hình hóa xu hướng thực tế của cư dân Quy Nhơn
const PRESEEDED_CROWD_WISDOM = {
  8: { craving: 42, stress: 35, hangout: 18 }, // Bánh xèo tôm nhảy Anh Vũ: thích nhai giòn rụm xả stress
  12: { comfort: 55, tired: 38, rainy: 40 }, // Bún cá sứa: khi cần vỗ về hoặc trời mưa
  15: { sweet: 60, comfort: 45, refreshing: 30 }, // Chè Nhớ: khi buồn rầu hoặc thèm ngọt
  22: { stress: 48, spicy: 52, craving: 25 }, // Mì cay sa tế: xả stress cực mạnh
  35: { hangout: 50, energetic: 45, craving: 30 }, // Ốc biển: khi vui vẻ, tụ tập bạn bè
  40: { zen: 70, healthy: 50, chill: 30 }, // Quán chay Thiện Duyên: thanh tịnh an lạc
  55: { chill: 58, date: 45, refreshing: 35 }, // Surf Bar: thư giãn ngắm biển
  68: { sweet: 55, chill: 40, refreshing: 38 } // Trà sữa nướng: nạp năng lượng hạnh phúc
};

if (typeof window !== 'undefined') {
  window.MOOD_ATTRIBUTE_MATRIX = MOOD_ATTRIBUTE_MATRIX;
  window.PRESEEDED_CROWD_WISDOM = PRESEEDED_CROWD_WISDOM;
}


// Database & State for FoodTinder / FoodFinder

// Rating rounding helper: rounds fractional ratings to 1 decimal place (e.g. 4.8999 -> 4.9, 4.12 -> 4.2)
function formatRating(val) {
  if (val === null || val === undefined || isNaN(val)) return "5.0";
  const num = Number(val);
  const clean = Math.round(num * 10000) / 10000;
  const rounded = Math.ceil(Math.round(clean * 1000) / 100) / 10;
  return rounded.toFixed(1);
}
if (typeof window !== 'undefined') {
  window.formatRating = formatRating;
}

// Price range formatter: displays min ~ max range instead of a fixed price
function formatPriceRange(val) {
  if (!val) return "35.000đ ~ 65.000đ";
  const s = String(val).trim();
  if (s.includes(' - ')) {
    return s.replace(/\s*-\s*/g, ' ~ ');
  }
  return s;
}

// Helper lấy giá min của quán (chuẩn hóa số nguyên, vd: 25000, 35000, 50000)
function getFoodMinPrice(food) {
  if (!food) return 50000;
  if (typeof food.priceMin === 'number' && !isNaN(food.priceMin) && food.priceMin > 0) {
    return food.priceMin;
  }
  const pStr = String(food.priceRange || '');
  const match = pStr.replace(/\./g, '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 50000;
}

// Helper lấy giá max của quán
function getFoodMaxPrice(food) {
  if (!food) return 50000;
  if (typeof food.priceMax === 'number' && !isNaN(food.priceMax) && food.priceMax > 0) {
    return food.priceMax;
  }
  const pStr = String(food.priceRange || '');
  const matches = pStr.replace(/\./g, '').match(/(\d+)/g);
  if (!matches || matches.length === 0) return 50000;
  return matches.length > 1 ? parseInt(matches[1], 10) : parseInt(matches[0], 10);
}

// Helper kiểm tra quán ăn chay / món chay (Dành riêng cho tâm trạng Thanh tịnh)
function isVegetarianFood(food) {
  if (!food) return false;
  if (food.category === 'vegetarian' || food.isVegetarian) return true;
  const allText = `${food.name || ''} ${food.restaurant || ''} ${food.category || ''} ${food.desc || ''} ${(food.tags || []).join(' ')}`.toLowerCase();
  return allText.includes('chay') || allText.includes('vegan') || allText.includes('an lạc') || allText.includes('thiện duyên') || allText.includes('pháp luân') || allText.includes('tâm thiện') || allText.includes('minh an');
}

if (typeof window !== 'undefined') {
  window.formatPriceRange = formatPriceRange;
  window.getFoodMinPrice = getFoodMinPrice;
  window.getFoodMaxPrice = getFoodMaxPrice;
  window.isVegetarianFood = isVegetarianFood;
}

// Official ShopeeFood Circular Badge Icon (Đồng bộ chuẩn xác với logo pop-up đặt hàng: vòng tròn trắng, túi cam, thìa & nĩa)
function getShopeeIcon(size = 20, className = '') {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;">
    <circle cx="50" cy="50" r="48.5" fill="#FFFFFF"/>
    <path d="M26 15H74L87 30V77C87 82.5 82.5 86 77 86H23C17.5 86 13 82.5 13 77V30L26 15Z" fill="#EE4D2D"/>
    <rect x="36" y="19" width="28" height="7.5" rx="3.75" fill="#FFFFFF"/>
    <path d="M29 36V47C29 50.2 31.2 52.8 34.2 53.2V77C34.2 78.2 35.2 79.2 36.5 79.2C37.8 79.2 38.8 78.2 38.8 77V53.2C41.8 52.8 44 50.2 44 47V36H41.5V46.5C41.5 47.5 40.7 48.3 39.7 48.3C38.7 48.3 37.9 47.5 37.9 46.5V36H35.1V46.5C35.1 47.5 34.3 48.3 33.3 48.3C32.3 48.3 31.5 47.5 31.5 46.5V36H29Z" fill="#FFFFFF"/>
    <path d="M63.5 35C58.2 35 54.5 39.8 54.5 45.5C54.5 50.8 57.8 53.5 61.2 53.8V77C61.2 78.2 62.2 79.2 63.5 79.2C64.8 79.2 65.8 78.2 65.8 77V53.8C69.2 53.5 72.5 50.8 72.5 45.5C72.5 39.8 68.8 35 63.5 35Z" fill="#FFFFFF"/>
  </svg>`;
}

// Full ShopeeFood Brand Logo (Từ ảnh chính thức shopeefoodvn.png)
function getShopeeLogo(height = 24, className = '') {
  return `<img src="images/shopeefoodvn.png" height="${height}" class="${className}" style="display:inline-block;vertical-align:middle;object-fit:contain;height:${height}px;width:auto;flex-shrink:0;" alt="ShopeeFood" />`;
}

// Vector ShopeeFood takeaway bag with fork and spoon (standalone bag without orange background)
function getShopeeBagSvg(size = 18, className = '', bagColor = '#FFFFFF', cutleryColor = '#EE4D2D') {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;">
    <path d="M37 31.5V25C37 18 42.8 12.5 50 12.5C57.2 12.5 63 18 63 25V31.5" stroke="${bagColor}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M25 32C25.6 31 26.8 30.5 28.5 30.5H71.5C73.2 30.5 74.4 31 75 32L81.5 78C82 82 78.8 85.5 74.8 85.5H25.2C21.2 85.5 18 82 18.5 78L25 32Z" fill="${bagColor}"/>
    <path d="M34 43.5V51.5C34 54 35.8 56 38 56.3V74C38 75.1 38.9 76 40 76C41.1 76 42 75.1 42 74V56.3C44.2 56 46 54 46 51.5V43.5H44V51C44 51.8 43.3 52.5 42.5 52.5C41.7 52.5 41 51.8 41 51V43.5H39V51C39 51.8 38.3 52.5 37.5 52.5C36.7 52.5 36 51.8 36 51V43.5H34Z" fill="${cutleryColor}"/>
    <path d="M60 42C55.6 42 53 46 53 51C53 55 55.6 57 58 57.3V74C58 75.1 58.9 76 60 76C61.1 76 62 75.1 62 74V57.3C64.4 57 67 55 67 51C67 46 64.4 42 60 42Z" fill="${cutleryColor}"/>
  </svg>`;
}

if (typeof window !== 'undefined') {
  window.getShopeeIcon = getShopeeIcon;
  window.getShopeeLogo = getShopeeLogo;
  window.getShopeeBagSvg = getShopeeBagSvg;
}

// Restaurant Open/Close status checker
function getRestaurantStatus(openTimeString, now = new Date()) {
  if (!openTimeString || typeof openTimeString !== 'string') {
    return {
      isOpen: true,
      openTime: "08:00 - 22:00",
      openStr: "08:00",
      closeStr: "22:00",
      statusText: "Đang mở cửa",
      detailText: "Đóng lúc 22:00",
      fullText: "Đang mở cửa • Đóng lúc 22:00"
    };
  }

  // Parse "HH:mm - HH:mm"
  const parts = openTimeString.split('-').map(s => s.trim());
  if (parts.length < 2) {
    return {
      isOpen: true,
      openTime: openTimeString,
      openStr: "",
      closeStr: "",
      statusText: "Đang mở cửa",
      detailText: openTimeString,
      fullText: `Đang mở cửa • ${openTimeString}`
    };
  }

  const parseMinutes = (timeStr) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  };

  const openMinutes = parseMinutes(parts[0]);
  const closeMinutes = parseMinutes(parts[1]);

  if (openMinutes === null || closeMinutes === null) {
    return {
      isOpen: true,
      openTime: openTimeString,
      openStr: parts[0],
      closeStr: parts[1],
      statusText: "Đang mở cửa",
      detailText: openTimeString,
      fullText: `Đang mở cửa • ${openTimeString}`
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let isOpen = false;

  if (closeMinutes > openMinutes) {
    // Normal same-day operating hours, e.g. 07:00 to 22:00
    isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // Overnight operating hours, e.g. 18:00 to 02:00
    isOpen = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  const openStr = parts[0];
  const closeStr = parts[1];

  const statusText = isOpen ? "Đang mở cửa" : "Đã đóng cửa";
  const detailText = isOpen ? `Đóng lúc ${closeStr}` : `Mở lúc ${openStr}`;

  return {
    isOpen,
    openTime: openTimeString,
    openStr,
    closeStr,
    statusText,
    detailText,
    fullText: `${statusText} • ${detailText}`
  };
}

if (typeof window !== 'undefined') {
  window.getRestaurantStatus = getRestaurantStatus;
}

// Dynamic Food Image Generator based on dish & restaurant name
function generateFoodImageSvg(dishName, restaurantName, category) {
  dishName = (dishName || "Món Ngon Đặc Sản").trim();
  restaurantName = (restaurantName || "FoodTinder Quán").trim();
  const lower = (dishName + " " + restaurantName + " " + (category || "")).toLowerCase();

  let emoji = "🍽️";
  let badgeText = "ĐẶC SẢN NỔI BẬT";
  let gradStart = "#E11D48";
  let gradMid = "#F97316";
  let gradEnd = "#B91C1C";
  let accentColor = "#FEF08A";

  if (lower.includes("trà sữa") || lower.includes("boba") || lower.includes("mây mây") || lower.includes("đường đen") || lower.includes("chè") || lower.includes("kem") || lower.includes("matcha")) {
    emoji = "🧋";
    badgeText = "TIỆM TRÀ & ĐỒ UỐNG";
    gradStart = "#9A3412";
    gradMid = "#EA580C";
    gradEnd = "#451A03";
    accentColor = "#FED7AA";
  } else if (lower.includes("lẩu") || lower.includes("hotpot") || lower.includes("nhúng me") || lower.includes("tom yum")) {
    emoji = "🍲";
    badgeText = "LẨU NÓNG HỔI";
    gradStart = "#DC2626";
    gradMid = "#EA580C";
    gradEnd = "#7F1D1D";
    accentColor = "#FECACA";
  } else if (lower.includes("nướng") || lower.includes("bò") || lower.includes("bbq") || lower.includes("gà nướng") || lower.includes("nem") || lower.includes("than hoa")) {
    emoji = "🥩";
    badgeText = "NƯỚNG THAN HOA";
    gradStart = "#C2410C";
    gradMid = "#D97706";
    gradEnd = "#78350F";
    accentColor = "#FDE68A";
  } else if (lower.includes("bún") || lower.includes("phở") || lower.includes("mì") || lower.includes("hủ tiếu") || lower.includes("bánh canh") || lower.includes("chìa")) {
    emoji = "🍜";
    badgeText = "MÓN NƯỚC ĐẬM ĐÀ";
    gradStart = "#D97706";
    gradMid = "#CA8A04";
    gradEnd = "#713F12";
    accentColor = "#FEF08A";
  } else if (lower.includes("hải sản") || lower.includes("tôm") || lower.includes("cua") || lower.includes("mực") || lower.includes("cá") || lower.includes("sứa") || lower.includes("ốc")) {
    emoji = "🦞";
    badgeText = "HẢI SẢN TƯƠI SỐNG";
    gradStart = "#0D9488";
    gradMid = "#0284C7";
    gradEnd = "#115E59";
    accentColor = "#99F6E4";
  } else if (lower.includes("cà phê") || lower.includes("cafe") || lower.includes("coffee") || lower.includes("bazan")) {
    emoji = "☕";
    badgeText = "CÀ PHÊ PHỐ NÚI";
    gradStart = "#451A03";
    gradMid = "#78350F";
    gradEnd = "#261307";
    accentColor = "#FDE68A";
  } else if (lower.includes("bánh xèo") || lower.includes("bánh cuốn") || lower.includes("bánh khọt") || lower.includes("bánh mì")) {
    emoji = "🥞";
    badgeText = "BÁNH & ĂN VẶT";
    gradStart = "#EAB308";
    gradMid = "#D97706";
    gradEnd = "#854D0E";
    accentColor = "#FEF9C3";
  } else if (lower.includes("gà") || lower.includes("vịt") || lower.includes("chim")) {
    emoji = "🍗";
    badgeText = "MÓN GÀ ĐỒI ĐẶC SẢN";
    gradStart = "#B45309";
    gradMid = "#F59E0B";
    gradEnd = "#78350F";
    accentColor = "#FEF3C7";
  } else if (lower.includes("cơm") || lower.includes("tấm") || lower.includes("niêu") || lower.includes("lam")) {
    emoji = "🍚";
    badgeText = "CƠM NGON TRÒN VỊ";
    gradStart = "#CA8A04";
    gradMid = "#EAB308";
    gradEnd = "#713F12";
    accentColor = "#FEF08A";
  }

  const escapeXml = (unsafe) => String(unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  const safeDish = escapeXml(dishName);
  const safeRest = escapeXml(restaurantName);
  const safeBadge = escapeXml(badgeText);

  let line1 = safeDish;
  let line2 = "";
  if (safeDish.length > 22) {
    const words = safeDish.split(" ");
    let l1 = [];
    let l2 = [];
    words.forEach(w => {
      if ((l1.join(" ") + " " + w).length <= 22 && l2.length === 0) {
        l1.push(w);
      } else {
        l2.push(w);
      }
    });
    line1 = l1.join(" ");
    line2 = l2.join(" ");
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradStart}"/>
        <stop offset="55%" stop-color="${gradMid}"/>
        <stop offset="100%" stop-color="${gradEnd}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="38%" r="48%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.65"/>
      </filter>
    </defs>
    <rect width="800" height="600" fill="url(#bgGrad)"/>
    <rect width="800" height="600" fill="url(#glow)"/>
    
    <circle cx="100" cy="120" r="140" fill="#ffffff" opacity="0.05"/>
    <circle cx="720" cy="480" r="180" fill="#ffffff" opacity="0.05"/>
    <circle cx="400" cy="230" r="125" fill="#ffffff" opacity="0.08"/>

    <g transform="translate(40, 45)">
      <rect x="0" y="0" width="200" height="34" rx="17" fill="#000000" fill-opacity="0.4" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.5"/>
      <circle cx="18" cy="17" r="5" fill="#22C55E"/>
      <text x="32" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#ffffff" letter-spacing="0.5">FOODTINDER CHỌN</text>
    </g>

    <g transform="translate(540, 45)">
      <rect x="0" y="0" width="220" height="34" rx="17" fill="#000000" fill-opacity="0.4" stroke="${accentColor}" stroke-opacity="0.6" stroke-width="1.5"/>
      <text x="110" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="${accentColor}" text-anchor="middle" letter-spacing="0.8">${safeBadge}</text>
    </g>

    <g filter="url(#shadow)">
      <circle cx="400" cy="225" r="80" fill="#000000" fill-opacity="0.3" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>
      <text x="400" y="258" font-size="90" text-anchor="middle">${emoji}</text>
    </g>

    <g filter="url(#shadow)">
      <text x="400" y="${line2 ? 365 : 380}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${line2 ? 32 : 36}" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${line1}</text>
      ${line2 ? `<text x="400" y="410" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${line2}</text>` : ""}
    </g>

    <g transform="translate(400, ${line2 ? 465 : 440})" filter="url(#shadow)">
      <rect x="-240" y="-22" width="480" height="44" rx="22" fill="#000000" fill-opacity="0.55" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.5"/>
      <text x="0" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="${accentColor}" text-anchor="middle">
        📍 ${safeRest}
      </text>
    </g>

    <g transform="translate(400, 545)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#ffffff" fill-opacity="0.85" text-anchor="middle" letter-spacing="0.5">
        ✦ Hương vị đặc trưng • Chế biến chuẩn vị • Được thực khách yêu thích ✦
      </text>
    </g>
  </svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.trim());
}

// Curated High-Definition Food Photography Fallback Catalog (Appetizing & Restaurant Quality)
const FOOD_PHOTO_FALLBACKS = {
  boba: [
    "images/tra_sua_nuong_may_may.jpg",
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80"
  ],
  bbq: [
    "images/bun_cha_hanoi.jpg",
    "images/com_tam_ba_ghien.jpg",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80"
  ],
  hotpot: [
    "images/lau_thai_chua_cay.jpg",
    "images/lau_rieu_cua_bap_bo.jpg",
    "images/lau_ga_la_e_da_lat.jpg",
    "images/lau_bo_ba_toa.jpg",
    "images/lau_bo_nhung_giam.jpg",
    "images/lau_ca_tam_sapa.jpg",
    "images/lau_mam_can_tho.jpg"
  ],
  noodles: [
    "images/bun_bo_hue.jpg",
    "images/mi_quang_da_nang.jpg",
    "images/bun_sua_quy_nhon.jpg",
    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
  ],
  seafood: [
    "images/oc_huong_trung_muoi.jpg",
    "images/bun_sua_quy_nhon.jpg",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
  ],
  streetfood: [
    "images/banh_xeo_tom_nhay.jpg",
    "images/banh_khot_vung_tau.jpg",
    "images/banh_mi_chao.jpg",
    "images/banh_trang_cuon_thit_heo.jpg",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
  ],
  cafe: [
    "images/ca_phe_trung_hanoi.jpg",
    "images/tra_sua_nuong_may_may.jpg",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
  ],
  rice: [
    "images/com_tam_ba_ghien.jpg",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
  ],
  healthy: [
    "images/banh_trang_cuon_thit_heo.jpg",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
  ]
};

function getFoodPhotoImage(dishName, restaurantName, category) {
  dishName = (dishName || "").trim();
  restaurantName = (restaurantName || "").trim();
  const lower = (dishName + " " + restaurantName + " " + (category || "")).toLowerCase();

  // Authentic commercial photography matches by dish identity:
  if (lower.includes("bánh xèo")) return "images/banh_xeo_tom_nhay.jpg";
  if (lower.includes("bánh khọt") || lower.includes("bánh tôm")) return "images/banh_khot_vung_tau.jpg";
  if (lower.includes("bánh mì chảo") || lower.includes("bò né")) return "images/banh_mi_chao.jpg";
  if (lower.includes("bún sứa")) return "images/bun_sua_quy_nhon.jpg";
  if (lower.includes("bún bò") || lower.includes("mụ rơi")) return "images/bun_bo_hue.jpg";
  if (lower.includes("bún chả") || lower.includes("hương liên") || lower.includes("đắc kim")) return "images/bun_cha_hanoi.jpg";
  if (lower.includes("mì quảng") || lower.includes("bếp trang")) return "images/mi_quang_da_nang.jpg";
  if (lower.includes("cà phê trứng") || lower.includes("cafe giảng") || lower.includes("giảng")) return "images/ca_phe_trung_hanoi.jpg";
  if (lower.includes("cơm tấm") || lower.includes("ba ghiền") || lower.includes("sườn bì chả")) return "images/com_tam_ba_ghien.jpg";
  if (lower.includes("ốc hương") || lower.includes("ốc đào") || (lower.includes("hải sản") && lower.includes("thanh sương"))) return "images/oc_huong_trung_muoi.jpg";
  if (lower.includes("hai đầu da") || lower.includes("cuốn thịt heo") || lower.includes("đặc sản trần") || lower.includes("cuốn tây sơn") || lower.includes("bò lụi")) return "images/banh_trang_cuon_thit_heo.jpg";
  if (lower.includes("riêu cua")) return "images/lau_rieu_cua_bap_bo.jpg";
  if (lower.includes("gà lá é") || lower.includes("tao ngộ")) return "images/lau_ga_la_e_da_lat.jpg";
  if (lower.includes("lẩu thái") || lower.includes("tomyum") || lower.includes("cô vy") || lower.includes("chua cay") || lower.includes("cá đuối") || lower.includes("lẩu thả")) return "images/lau_thai_chua_cay.jpg";
  if (lower.includes("lẩu bò") || lower.includes("ba toa") || lower.includes("quán gỗ")) return "images/lau_bo_ba_toa.jpg";
  if (lower.includes("nhúng giấm") || lower.includes("nhúng me") || lower.includes("cô thảo")) return "images/lau_bo_nhung_giam.jpg";
  if (lower.includes("cá tầm") || lower.includes("thắng cố")) return "images/lau_ca_tam_sapa.jpg";
  if (lower.includes("lẩu mắm") || lower.includes("dạ lý")) return "images/lau_mam_can_tho.jpg";
  if (lower.includes("trà sữa") || lower.includes("mây mây") || lower.includes("đường đen")) return "images/tra_sua_nuong_may_may.jpg";

  let pool = FOOD_PHOTO_FALLBACKS.streetfood;
  if (lower.includes("trà sữa") || lower.includes("boba") || lower.includes("mây mây") || lower.includes("đường đen") || lower.includes("chè") || lower.includes("kem")) {
    pool = FOOD_PHOTO_FALLBACKS.boba;
  } else if (lower.includes("lẩu") || lower.includes("hotpot") || lower.includes("nhúng me") || lower.includes("tom yum")) {
    pool = FOOD_PHOTO_FALLBACKS.hotpot;
  } else if (lower.includes("nướng") || lower.includes("bò") || lower.includes("bbq") || lower.includes("gà nướng") || lower.includes("nem")) {
    pool = FOOD_PHOTO_FALLBACKS.bbq;
  } else if (lower.includes("bún") || lower.includes("phở") || lower.includes("mì") || lower.includes("hủ tiếu") || lower.includes("bánh canh") || lower.includes("chìa")) {
    pool = FOOD_PHOTO_FALLBACKS.noodles;
  } else if (lower.includes("hải sản") || lower.includes("tôm") || lower.includes("cua") || lower.includes("mực") || lower.includes("cá") || lower.includes("sứa") || lower.includes("ốc")) {
    pool = FOOD_PHOTO_FALLBACKS.seafood;
  } else if (lower.includes("cà phê") || lower.includes("cafe") || lower.includes("coffee") || lower.includes("bazan")) {
    pool = FOOD_PHOTO_FALLBACKS.cafe;
  } else if (lower.includes("cơm") || lower.includes("tấm") || lower.includes("niêu") || lower.includes("lam")) {
    pool = FOOD_PHOTO_FALLBACKS.rice;
  } else if (lower.includes("healthy") || lower.includes("salad") || lower.includes("chay") || lower.includes("clean")) {
    pool = FOOD_PHOTO_FALLBACKS.healthy;
  }

  const idx = Math.abs(dishName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % pool.length;
  return pool[idx] || pool[0];
}

function handleFoodImageError(imgEl, dishName, restaurantName, category) {
  if (!imgEl) return;
  const retryCount = parseInt(imgEl.dataset.retryCount || "0", 10);

  const name = dishName || imgEl.getAttribute("data-name") || imgEl.alt || "Món Ngon Đặc Sản";
  const rest = restaurantName || imgEl.getAttribute("data-restaurant") || "";
  const cat = category || imgEl.getAttribute("data-category") || "";

  if (retryCount === 0) {
    // Stage 1: Replace broken image with high-definition, mouth-watering food photography!
    imgEl.dataset.retryCount = "1";
    imgEl.src = getFoodPhotoImage(name, rest, cat);
  } else if (retryCount === 1) {
    // Stage 2: Try authentic photo fallback
    imgEl.dataset.retryCount = "2";
    imgEl.src = getFoodPhotoImage(name, rest, cat);
  } else {
    // Stage 3: Vector graphic banner as ultimate fallback
    imgEl.dataset.fallbackApplied = "true";
    imgEl.onerror = null;
    imgEl.src = generateFoodImageSvg(name, rest, cat);
  }
}

if (typeof window !== 'undefined') {
  window.FOOD_PHOTO_FALLBACKS = FOOD_PHOTO_FALLBACKS;
  window.getFoodPhotoImage = getFoodPhotoImage;
  window.generateFoodImageSvg = generateFoodImageSvg;
  window.handleFoodImageError = handleFoodImageError;

  // Global capture listener for any broken images across the entire app
  window.addEventListener("error", function(event) {
    const target = event.target;
    if (target && target.tagName === "IMG" && target.dataset.fallbackApplied !== "true") {
      const retryCount = parseInt(target.dataset.retryCount || "0", 10);
      const card = target.closest("[data-food-id]") || target.closest(".group") || target.closest(".food-card") || target.parentElement;
      let name = target.getAttribute("data-name") || target.alt || "";
      let restaurant = target.getAttribute("data-restaurant") || "";
      let category = target.getAttribute("data-category") || "";

      if (card) {
        if (!name) {
          const heading = card.querySelector("h2, h3, h4, h5, h6");
          if (heading) name = heading.textContent.trim();
        }
        if (!restaurant) {
          const p = card.querySelector("p");
          if (p) restaurant = p.textContent.trim();
        }
      }

      if (retryCount === 0) {
        target.dataset.retryCount = "1";
        target.src = getFoodPhotoImage(name || "Món Ngon Đặc Sản", restaurant, category);
      } else if (retryCount === 1) {
        target.dataset.retryCount = "2";
        target.src = getFoodPhotoImage(name || "Món Ngon Đặc Sản", restaurant, category);
      } else {
        target.dataset.fallbackApplied = "true";
        target.onerror = null;
        target.src = generateFoodImageSvg(name || "Món Ngon Đặc Sản", restaurant, category);
      }
    }
  }, true);
}


const PERMANENTLY_CLOSED_BLACKLIST = [
  "vương khang",
  "vuong khang",
  "con bò cười bbq",
  "con bo cuoi bbq",
  "bò cười bbq",
  "đất võ",
  "chị ba trà",
  "chi ba tra",
  "ăn vặt ngô mây",
  "an vat ngo may"
];

const PERMANENTLY_CLOSED_KEYWORDS = [
  "đóng cửa vĩnh viễn",
  "bị đóng vĩnh viễn",
  "ngừng hoạt động",
  "permanently closed",
  "closed permanently",
  "nghỉ bán vĩnh viễn",
  "đã đóng cửa vĩnh viễn",
  "ngừng kinh doanh vĩnh viễn",
  "không còn hoạt động",
  "dẹp tiệm"
];

function isPermanentlyClosedRestaurant(food) {
  if (!food) return false;
  if (food.isPermanentlyClosed || food.isClosedPermanently) return true;
  if (food.operatingStatus === "permanently_closed" || food.operatingStatus === "closed_permanently") return true;

  const rest = String(food.restaurant || "").toLowerCase();
  const name = String(food.name || "").toLowerCase();
  const desc = String(food.description || "").toLowerCase();
  const openTime = String(food.openTime || "").toLowerCase();
  const address = String(food.address || "").toLowerCase();
  const combined = `${rest} ${name} ${desc} ${openTime} ${address}`;

  for (const b of PERMANENTLY_CLOSED_BLACKLIST) {
    if (rest.includes(b) || name.includes(b)) return true;
  }
  for (const kw of PERMANENTLY_CLOSED_KEYWORDS) {
    if (combined.includes(kw)) return true;
  }
  return false;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.0;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistanceText(km) {
  if (typeof km !== "number" || isNaN(km)) return "Gần bạn";
  if (km < 1) {
    const meters = Math.round(km * 1000 / 50) * 50;
    return `Cách bạn ${Math.max(100, meters)}m`;
  }
  if (km < 10) {
    return `Cách bạn ${km.toFixed(1)}km`;
  }
  return `Cách bạn ${Math.round(km)}km`;
}

function isFakeDummyFood(food) {
  if (!food) return false;
  const addr = (food.address || "").toLowerCase();
  const rest = (food.restaurant || "").toLowerCase();
  const name = (food.name || "").toLowerCase();
  if (addr.includes("đường chính") && food.cityId !== "quynhon") return true;
  if (rest.startsWith("quán đặc sản") && (addr.includes("đường chính") || food.distance === 0.6)) return true;
  if (name.includes("nóng hổi") && rest.startsWith("quán đặc sản")) return true;
  // Loại bỏ các quán không thuộc TP. Quy Nhơn (huyện lân cận)
  if (food.cityId === "quynhon" && (addr.includes("tuy phước") || addr.includes("an nhơn") || addr.includes("phù cát"))) return true;
  // Loại bỏ các quán có địa chỉ chung chung không có số nhà cụ thể
  if (addr.includes("trục đường chính") || addr.includes("bờ biển quy nhơn") || addr.includes("quảng trường trung tâm") || addr.includes("khu bông hồng") || addr === "đường xuân diệu") return true;
  if (!/\d+/.test(addr)) return true;
  return false;
}

// ══════════════════════════════════════════════════════════════════════
// KIỂM SOÁT CHẤT LƯỢNG DỮ LIỆU TOÀN DIỆN (QUALITY GATE FILTER)
// Xóa luôn các quán không phù hợp, không lưu trong database tránh phình to
// ══════════════════════════════════════════════════════════════════════
function isValidQualityFood(food) {
  if (!food) return false;

  // 1. Quán không có ảnh hoặc ảnh quá xấu / logo placeholder
  const img = String(food.image || "").trim();
  if (!img || img.length < 15 || !img.startsWith("http")) return false;
  if (img.includes("placeholder") || img.includes("default_avatar") || img.includes("no-image") || img.includes("empty_shop")) return false;

  // 2. Quán "ảo" hoặc rating quá thấp: rating >= 4.0 HOẶC có >= 20 lượt đánh giá
  const rating = Number(food.rating) || 0;
  const reviewCount = Number(food.reviewCount || food.totalReviews) || 0;
  if (rating < 4.0 && reviewCount < 20) return false;

  // 3. Quán đóng cửa / ngừng app
  if (typeof isPermanentlyClosedRestaurant === "function" && isPermanentlyClosedRestaurant(food)) return false;

  // 4. Quán không tìm thấy địa chỉ thật trên Google Maps / quán ảo
  if (typeof isFakeDummyFood === "function" && isFakeDummyFood(food)) return false;

  // 5. Tọa độ thực tế địa bàn thành phố hợp lệ
  const lat = Number(food.lat || food.latitude);
  const lng = Number(food.lng || food.longitude);
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return false;
  if (food.cityId === "quynhon" || !food.cityId) {
    if (lat < 13.6 || lat > 13.9 || lng < 109.1 || lng > 109.35) return false;
  }

  return true;
}

if (typeof window !== "undefined") {
  window.PERMANENTLY_CLOSED_BLACKLIST = PERMANENTLY_CLOSED_BLACKLIST;
  window.PERMANENTLY_CLOSED_KEYWORDS = PERMANENTLY_CLOSED_KEYWORDS;
  window.isPermanentlyClosedRestaurant = isPermanentlyClosedRestaurant;
  window.calculateDistanceKm = calculateDistanceKm;
  window.formatDistanceText = formatDistanceText;
  window.isFakeDummyFood = isFakeDummyFood;
  window.isValidQualityFood = isValidQualityFood;
}

const APP_DATA = {
  calculateDistanceKm: calculateDistanceKm,
  formatDistanceText: formatDistanceText,
  isFakeDummyFood: isFakeDummyFood,
  homeLocation: {
    cityId: "quynhon",
    name: "Quy Nhơn",
    province: "Bình Định",
    lat: 13.7735,
    lng: 109.2365,
    latitude: 13.7735,
    longitude: 109.2365
  },
  homeCityId: "quynhon",
  formatRating: formatRating,
  generateFoodImageSvg: generateFoodImageSvg,
  handleFoodImageError: handleFoodImageError,
  currentCity: {
    cityId: "quynhon",
    name: "Quy Nhơn",
    province: "Bình Định",
    address: "Đang xác định vị trí...",
    lat: 13.7735,
    lng: 109.2365,
    weather: {
      temp: "24°C",
      condition: "Mưa râm ran",
      icon: "🌧️",
      description: "Trời Quy Nhơn đang mưa rào mát lạnh"
    }
  },
  
    weatherOptions: [
  {
    "cityId": "hanoi",
    "city": "Hà Nội (Hà Tây cũ)",
    "shortName": "Hà Nội",
    "oldName": "Hà Tây cũ",
    "province": "Hà Nội",
    "region": "Miền Bắc",
    "address": "Hoàn Kiếm, Phố Cổ",
    "temp": "19°C",
    "condition": "Se se lạnh",
    "icon": "🧣",
    "lat": 21.0285,
    "lng": 105.8542,
    "signature": "Phở Bát Đàn, bún chả Hàng Mành, lẩu riêu cua bắp bò",
    "specialties": [
      {
        "name": "Phở Bò Tái Lăn Bát Đàn Gia Truyền",
        "cat": "noodles",
        "tags": [
          "#Phở_Hà_Nội",
          "#Ấm_áp",
          "#Phố_cổ"
        ],
        "price": "60.000đ - 85.000đ",
        "img": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
        "rest": "Phở Bát Đàn - 49 Bát Đàn, Hoàn Kiếm",
        "lat": 21.0337,
        "lng": 105.8475,
        "latitude": 21.0337,
        "longitude": 105.8475
      },
      {
        "name": "Bún Chả Nướng Than Hoa Cố Đô",
        "cat": "bbq",
        "tags": [
          "#Bún_chả_Hà_Nội",
          "#Đậm_đà",
          "#Xì_xèo"
        ],
        "price": "50.000đ - 70.000đ",
        "img": "images/bun_cha_hanoi.jpg",
        "rest": "Bún Chả Đắc Kim - 1 Hàng Mành, Hoàn Kiếm",
        "lat": 21.0326,
        "lng": 105.8488,
        "latitude": 21.0326,
        "longitude": 105.8488
      },
      {
        "name": "Lẩu Riêu Cua Bắp Bò Sườn Sụn",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_riêu_cua",
          "#Xả_stress",
          "#Ấm_áp"
        ],
        "price": "250.000đ - 450.000đ",
        "img": "images/lau_rieu_cua_bap_bo.jpg",
        "rest": "Lẩu Ngon Phố Cổ - 66 Phó Đức Chính, Ba Đình",
        "lat": 21.045,
        "lng": 105.843,
        "latitude": 21.045,
        "longitude": 105.843
      }
    ]
  },
  {
    "cityId": "haiphong",
    "city": "Hải Phòng (Kiến An cũ)",
    "shortName": "Hải Phòng",
    "oldName": "Kiến An cũ",
    "province": "Hải Phòng",
    "region": "Miền Bắc",
    "address": "Cầu Đất, Ngô Quyền",
    "temp": "21°C",
    "condition": "Gió cảng biển",
    "icon": "🦀",
    "lat": 20.8449,
    "lng": 106.6881,
    "signature": "Bánh đa cua bể Bà Cụ, bánh mì que cay, lẩu cua đồng",
    "specialties": [
      {
        "name": "Bánh Đa Cua Nồi Đất Bể Bà Cụ",
        "cat": "noodles",
        "tags": [
          "#Bánh_đa_cua",
          "#Cua_bể_tươi",
          "#Đậm_đà"
        ],
        "price": "50.000đ - 80.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Bà Cụ - 179 Cầu Đất, Ngô Quyền",
        "lat": 20.8524,
        "lng": 106.6872,
        "latitude": 20.8524,
        "longitude": 106.6872
      },
      {
        "name": "Bánh Mì Cay & Chè Thái Cột Đèn",
        "cat": "streetfood",
        "tags": [
          "#Bánh_mì_que",
          "#Pate_béo_ngậy",
          "#Siêu_cay"
        ],
        "price": "15.000đ - 35.000đ",
        "img": "https://images.unsplash.com/photo-1621800043295-a73fe2f76e2c?auto=format&fit=crop&w=800&q=80",
        "rest": "Bánh Mì Cay Chính Hiệu - Chợ Cột Đèn, Lê Chân",
        "lat": 20.8441,
        "lng": 106.6805,
        "latitude": 20.8441,
        "longitude": 106.6805
      }
    ]
  },
  {
    "cityId": "quangninh",
    "city": "Quảng Ninh (Hồng Quảng & Hải Ninh cũ)",
    "shortName": "Quảng Ninh",
    "oldName": "Hồng Quảng & Hải Ninh cũ",
    "province": "Quảng Ninh",
    "region": "Miền Bắc",
    "address": "Bãi Cháy, Hạ Long",
    "temp": "22°C",
    "condition": "Gió vịnh mát dịu",
    "icon": "⛵",
    "lat": 20.9505,
    "lng": 107.0734,
    "signature": "Chả mực giã tay Thoan, sam biển 7 món, bún bề bề",
    "specialties": [
      {
        "name": "Chả Mực Giã Tay Thoan & Sam Biển 7 Món",
        "cat": "seafood",
        "tags": [
          "#Chả_mực_giã_tay",
          "#Vịnh_Hạ_Long",
          "#Giòn_sần_sật"
        ],
        "price": "80.000đ - 250.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Chả Mực Thoan - Kiot 36 Chợ Hạ Long 1",
        "lat": 20.9532,
        "lng": 107.0805,
        "latitude": 20.9532,
        "longitude": 107.0805
      },
      {
        "name": "Bún Bề Bề Tôm Càng Bãi Cháy",
        "cat": "noodles",
        "tags": [
          "#Bún_bề_bề",
          "#Hải_sản_vịnh",
          "#Đậm_đà"
        ],
        "price": "50.000đ - 85.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Bún Bề Bề Làng Chài - 12 Hoàng Quốc Việt, Bãi Cháy",
        "lat": 20.9635,
        "lng": 107.0315,
        "latitude": 20.9635,
        "longitude": 107.0315
      }
    ]
  },
  {
    "cityId": "bacninh",
    "city": "Bắc Ninh (Hà Bắc cũ)",
    "shortName": "Bắc Ninh",
    "oldName": "Hà Bắc cũ",
    "province": "Bắc Ninh",
    "region": "Miền Bắc",
    "address": "Trần Hưng Đạo, TP. Bắc Ninh",
    "temp": "20°C",
    "condition": "Mát mẻ quan họ",
    "icon": "🏮",
    "lat": 21.1861,
    "lng": 106.0763,
    "signature": "Bánh phu thê Đình Bảng, nem Bùi Ninh Xá, chim trời Kinh Bắc",
    "specialties": [
      {
        "name": "Bánh Phu Thê Đình Bảng & Nem Bùi Ninh Xá",
        "cat": "streetfood",
        "tags": [
          "#Bánh_phu_thê",
          "#Kinh_Bắc",
          "#Đậm_vị_truyền_thống"
        ],
        "price": "40.000đ - 80.000đ",
        "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "rest": "Đặc Sản Bà Liêm - Đình Bảng, Từ Sơn",
        "lat": 21.1305,
        "lng": 105.962,
        "latitude": 21.1305,
        "longitude": 105.962
      },
      {
        "name": "Lẩu Chim Câu Kê Gà Nấm Tươi",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_chim_câu",
          "#Ấm_áp",
          "#Bổ_dưỡng"
        ],
        "price": "300.000đ - 480.000đ",
        "img": "images/lau_ga_la_e_da_lat.jpg",
        "rest": "Ẩm Thực Kinh Bắc - 88 Nguyễn Gia Thiều, TP. Bắc Ninh",
        "lat": 21.1845,
        "lng": 106.074,
        "latitude": 21.1845,
        "longitude": 106.074
      }
    ]
  },
  {
    "cityId": "bacgiang",
    "city": "Bắc Giang (Hà Bắc cũ)",
    "shortName": "Bắc Giang",
    "oldName": "Hà Bắc cũ",
    "province": "Bắc Giang",
    "region": "Miền Bắc",
    "address": "Lê Lợi, TP. Bắc Giang",
    "temp": "21°C",
    "condition": "Nắng nhẹ",
    "icon": "🌳",
    "lat": 21.2731,
    "lng": 106.1946,
    "signature": "Gà đồi Yên Thế nướng mật ong, bánh đa Kế, xôi vải thiều Lục Ngạn",
    "specialties": [
      {
        "name": "Gà Đồi Yên Thế Nướng Mật Ong Rừng",
        "cat": "bbq",
        "tags": [
          "#Gà_đồi_Yên_Thế",
          "#Thịt_săn_chắc",
          "#Xì_xèo"
        ],
        "price": "220.000đ - 350.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "rest": "Nhà Hàng Gà Đồi - TT. Cầu Gồ, Yên Thế",
        "lat": 21.503,
        "lng": 106.148,
        "latitude": 21.503,
        "longitude": 106.148
      }
    ]
  },
  {
    "cityId": "haiduong",
    "city": "Hải Dương (Hải Hưng cũ)",
    "shortName": "Hải Dương",
    "oldName": "Hải Hưng cũ",
    "province": "Hải Dương",
    "region": "Miền Bắc",
    "address": "Bạch Đằng, TP. Hải Dương",
    "temp": "20°C",
    "condition": "Êm dịu",
    "icon": "🍵",
    "lat": 20.9373,
    "lng": 106.3146,
    "signature": "Bánh đậu xanh Rồng Vàng, chả rươi Tứ Kỳ, bún cá rô đồng",
    "specialties": [
      {
        "name": "Chả Rươi Tứ Kỳ Chiên Vàng Thơm Vỏ Quýt",
        "cat": "streetfood",
        "tags": [
          "#Chả_rươi_Tứ_Kỳ",
          "#Đặc_sản_mùa_rươi",
          "#Béo_ngậy"
        ],
        "price": "120.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Rươi Tứ Kỳ Tiến Vua - An Thanh, Tứ Kỳ",
        "lat": 20.812,
        "lng": 106.415,
        "latitude": 20.812,
        "longitude": 106.415
      },
      {
        "name": "Bún Cá Rô Đồng Nước Dùng Ngọt Thanh",
        "cat": "noodles",
        "tags": [
          "#Bún_cá_rô_đồng",
          "#Nước_dùng_ngọt",
          "#Ấm_áp"
        ],
        "price": "40.000đ - 60.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Bún Cá Rô Hoàng Hiệp - 114 Trần Hưng Đạo, Hải Dương",
        "lat": 20.938,
        "lng": 106.319,
        "latitude": 20.938,
        "longitude": 106.319
      }
    ]
  },
  {
    "cityId": "hungyen",
    "city": "Hưng Yên (Hải Hưng cũ)",
    "shortName": "Hưng Yên",
    "oldName": "Hải Hưng cũ",
    "province": "Hưng Yên",
    "region": "Miền Bắc",
    "address": "Phố Hiến, TP. Hưng Yên",
    "temp": "21°C",
    "condition": "Nắng êm",
    "icon": "🏮",
    "lat": 20.6464,
    "lng": 106.0511,
    "signature": "Bún thang lươn Phố Hiến, chè hạt sen long nhãn tiến vua, gà Đông Tảo",
    "specialties": [
      {
        "name": "Bún Thang Lươn Phố Hiến Đậm Đà",
        "cat": "noodles",
        "tags": [
          "#Bún_thang_lươn",
          "#Phố_Hiến",
          "#Đậm_đà"
        ],
        "price": "45.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Xưa Phố Hiến - Đường Bãi Sậy, TP. Hưng Yên",
        "lat": 20.651,
        "lng": 106.053,
        "latitude": 20.651,
        "longitude": 106.053
      }
    ]
  },
  {
    "cityId": "hanam",
    "city": "Hà Nam (Nam Hà / Hà Nam Ninh cũ)",
    "shortName": "Hà Nam",
    "oldName": "Nam Hà / Hà Nam Ninh cũ",
    "province": "Hà Nam",
    "region": "Miền Bắc",
    "address": "Lý Thường Kiệt, Phủ Lý",
    "temp": "20°C",
    "condition": "Gió nhẹ",
    "icon": "🍲",
    "lat": 20.5835,
    "lng": 105.9229,
    "signature": "Cá kho làng Vũ Đại, bánh cuốn chả Phủ Lý nướng than hoa",
    "specialties": [
      {
        "name": "Cá Kho Niêu Đất Cổ Truyền Làng Vũ Đại",
        "cat": "comfort",
        "tags": [
          "#Cá_kho_Vũ_Đại",
          "#Niêu_đất_16h",
          "#Đậm_đà"
        ],
        "price": "500.000đ - 900.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Cơ Sở Cá Kho Bá Kiến - Hòa Hậu, Lý Nhân",
        "lat": 20.528,
        "lng": 106.085,
        "latitude": 20.528,
        "longitude": 106.085
      },
      {
        "name": "Bánh Cuốn Chả Nướng Than Hoa Phủ Lý",
        "cat": "streetfood",
        "tags": [
          "#Bánh_cuốn_Phủ_Lý",
          "#Chả_nướng_than",
          "#Nóng_hổi"
        ],
        "price": "35.000đ - 55.000đ",
        "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "rest": "Bánh Cuốn Chả Đinh - 188 Biên Hòa, Phủ Lý",
        "lat": 20.536,
        "lng": 105.914,
        "latitude": 20.536,
        "longitude": 105.914
      }
    ]
  },
  {
    "cityId": "namdinh",
    "city": "Nam Định (Nam Hà / Hà Nam Ninh cũ)",
    "shortName": "Nam Định",
    "oldName": "Nam Hà / Hà Nam Ninh cũ",
    "province": "Nam Định",
    "region": "Miền Bắc",
    "address": "Hàng Tiện, TP. Nam Định",
    "temp": "21°C",
    "condition": "Mát dịu",
    "icon": "🍜",
    "lat": 20.4344,
    "lng": 106.1673,
    "signature": "Phở bò Nam Định Cụ Tặng, bánh xíu páo, nem nắm Giao Thủy",
    "specialties": [
      {
        "name": "Phở Bò Gia Truyền Nam Định Cụ Tặng",
        "cat": "noodles",
        "tags": [
          "#Phở_bò_Nam_Định",
          "#Nước_dùng_trong_ngọt",
          "#Ấm_áp"
        ],
        "price": "50.000đ - 75.000đ",
        "img": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
        "rest": "Phở Cụ Tặng - 23 Hàng Tiện, TP. Nam Định",
        "lat": 20.4285,
        "lng": 106.173,
        "latitude": 20.4285,
        "longitude": 106.173
      },
      {
        "name": "Nem Nắm Giao Thủy & Bánh Xíu Páo Nóng",
        "cat": "streetfood",
        "tags": [
          "#Nem_nắm_Giao_Thủy",
          "#Xíu_páo_giòn",
          "#Thơm_lừng"
        ],
        "price": "25.000đ - 60.000đ",
        "img": "https://images.unsplash.com/photo-1621800043295-a73fe2f76e2c?auto=format&fit=crop&w=800&q=80",
        "rest": "Đặc Sản Bà Bẩy - 75 Lê Hồng Phong, Nam Định",
        "lat": 20.432,
        "lng": 106.178,
        "latitude": 20.432,
        "longitude": 106.178
      }
    ]
  },
  {
    "cityId": "ninhbinh",
    "city": "Ninh Bình (Hà Nam Ninh cũ)",
    "shortName": "Ninh Bình",
    "oldName": "Hà Nam Ninh cũ",
    "province": "Ninh Bình",
    "region": "Miền Bắc",
    "address": "Tam Cốc, Hoa Lư",
    "temp": "20°C",
    "condition": "Trời trong xanh",
    "icon": "🚣",
    "lat": 20.2506,
    "lng": 105.9745,
    "signature": "Dê núi nướng tảng, cơm cháy sốt dê Tam Cốc, gỏi cá nhệch",
    "specialties": [
      {
        "name": "Dê Núi Nướng Tảng & Cơm Cháy Sốt Dê Tam Cốc",
        "cat": "bbq",
        "tags": [
          "#Dê_núi_nướng",
          "#Cơm_cháy_giòn",
          "#Đậm_đà"
        ],
        "price": "150.000đ - 320.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Dê Núi Chính Thư - Tam Cốc, Hoa Lư",
        "lat": 20.219,
        "lng": 105.942,
        "latitude": 20.219,
        "longitude": 105.942
      }
    ]
  },
  {
    "cityId": "thaibinh",
    "city": "Thái Bình",
    "shortName": "Thái Bình",
    "oldName": "Thái Bình",
    "province": "Thái Bình",
    "region": "Miền Bắc",
    "address": "Lê Lợi, TP. Thái Bình",
    "temp": "21°C",
    "condition": "Gió đồng nội",
    "icon": "🌾",
    "lat": 20.4463,
    "lng": 106.3366,
    "signature": "Canh cá Quỳnh Côi, bánh cáy làng Nguyễn, nem chạo Vị Thủy",
    "specialties": [
      {
        "name": "Canh Cá Rô Đồng Quỳnh Côi Bánh Đa Sợi Mảnh",
        "cat": "noodles",
        "tags": [
          "#Canh_cá_Quỳnh_Côi",
          "#Cá_rô_đồng",
          "#Nóng_hổi"
        ],
        "price": "40.000đ - 60.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Canh Cá Quỳnh Côi Chính Gốc - TT. Quỳnh Côi, Quỳnh Phụ",
        "lat": 20.648,
        "lng": 106.321,
        "latitude": 20.648,
        "longitude": 106.321
      }
    ]
  },
  {
    "cityId": "vinhphuc",
    "city": "Vĩnh Phúc (Vĩnh Phú cũ)",
    "shortName": "Vĩnh Phúc",
    "oldName": "Vĩnh Phú cũ",
    "province": "Vĩnh Phúc",
    "region": "Miền Bắc",
    "address": "Tam Đảo, Vĩnh Phúc",
    "temp": "17°C",
    "condition": "Sương mù se lạnh",
    "icon": "🌲",
    "lat": 21.3609,
    "lng": 105.5474,
    "signature": "Ngọn su su xào tỏi Tam Đảo, thịt lợn đồi xiên nướng than, cá thính Lập Thạch",
    "specialties": [
      {
        "name": "Thịt Lợn Đồi Nướng Than & Ngọn Su Su Tam Đảo",
        "cat": "bbq",
        "tags": [
          "#Su_su_Tam_Đảo",
          "#Thịt_nướng_xiên",
          "#Ấm_áp"
        ],
        "price": "80.000đ - 180.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Nướng Phố Mây - TT. Tam Đảo",
        "lat": 21.4589,
        "lng": 105.6481,
        "latitude": 21.4589,
        "longitude": 105.6481
      }
    ]
  },
  {
    "cityId": "phutho",
    "city": "Phú Thọ (Vĩnh Phú cũ)",
    "shortName": "Phú Thọ",
    "oldName": "Vĩnh Phú cũ",
    "province": "Phú Thọ",
    "region": "Miền Bắc",
    "address": "Việt Trì, Phú Thọ",
    "temp": "21°C",
    "condition": "Mát mẻ",
    "icon": "🏛️",
    "lat": 21.3227,
    "lng": 105.228,
    "signature": "Thịt chua Thanh Sơn cuốn lá sung, cá anh vũ Đền Hùng, cọ ỏm",
    "specialties": [
      {
        "name": "Thịt Chua Thanh Sơn Cuốn Lá Sung & Thính Rang",
        "cat": "streetfood",
        "tags": [
          "#Thịt_chua_Thanh_Sơn",
          "#Vị_chua_bùi",
          "#Lai_rai"
        ],
        "price": "55.000đ - 95.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Thịt Chua Điệp Đào - TT. Thanh Sơn",
        "lat": 21.205,
        "lng": 105.185,
        "latitude": 21.205,
        "longitude": 105.185
      }
    ]
  },
  {
    "cityId": "thainguyen",
    "city": "Thái Nguyên (Bắc Thái cũ)",
    "shortName": "Thái Nguyên",
    "oldName": "Bắc Thái cũ",
    "province": "Thái Nguyên",
    "region": "Miền Bắc",
    "address": "Lương Ngọc Quyến, TP. Thái Nguyên",
    "temp": "20°C",
    "condition": "Trời mát",
    "icon": "🍵",
    "lat": 21.5942,
    "lng": 105.8482,
    "signature": "Trà xanh Tân Cương móc câu, bánh chưng Bờ Đậu, nem chua Đại Từ",
    "specialties": [
      {
        "name": "Bánh Chưng Bờ Đậu Nếp Nương & Nem Chua Đại Từ",
        "cat": "streetfood",
        "tags": [
          "#Bánh_chưng_Bờ_Đậu",
          "#Nếp_nương",
          "#Đậm_đà"
        ],
        "price": "40.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "rest": "Làng Bánh Chưng Bờ Đậu - Cổ Lũng, Phú Lương",
        "lat": 21.678,
        "lng": 105.792,
        "latitude": 21.678,
        "longitude": 105.792
      }
    ]
  },
  {
    "cityId": "backan",
    "city": "Bắc Kạn (Bắc Thái cũ)",
    "shortName": "Bắc Kạn",
    "oldName": "Bắc Thái cũ",
    "province": "Bắc Kạn",
    "region": "Miền Bắc",
    "address": "Hồ Ba Bể, Bắc Kạn",
    "temp": "19°C",
    "condition": "Mát rượi hồ trên núi",
    "icon": "🏞️",
    "lat": 22.147,
    "lng": 105.8348,
    "signature": "Cá mương nướng kẹp tre Hồ Ba Bể, tôm chua Ba Bể, miến dong Na Rì",
    "specialties": [
      {
        "name": "Cá Mương Nướng Than Hoa Kẹp Tre Hồ Ba Bể",
        "cat": "bbq",
        "tags": [
          "#Cá_nướng_Ba_Bể",
          "#Thơm_lừng",
          "#Ngọt_thịt"
        ],
        "price": "60.000đ - 120.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Bản Pác Ngòi Homestay - Nam Mẫu, Ba Bể",
        "lat": 22.408,
        "lng": 105.632,
        "latitude": 22.408,
        "longitude": 105.632
      }
    ]
  },
  {
    "cityId": "langson",
    "city": "Lạng Sơn (Cao Lạng cũ)",
    "shortName": "Lạng Sơn",
    "oldName": "Cao Lạng cũ",
    "province": "Lạng Sơn",
    "region": "Miền Bắc",
    "address": "Tam Thanh, TP. Lạng Sơn",
    "temp": "17°C",
    "condition": "Gió biên ải se lạnh",
    "icon": "🏔️",
    "lat": 21.8537,
    "lng": 106.7615,
    "signature": "Vịt quay lá móc mật Thất Khê, khâu nhục Xứ Lạng, bánh cuốn trứng lòng đào",
    "specialties": [
      {
        "name": "Vịt Quay Da Giòn Lá Móc Mật Thất Khê",
        "cat": "bbq",
        "tags": [
          "#Vịt_quay_Xứ_Lạng",
          "#Lá_móc_mật",
          "#Béo_ngậy"
        ],
        "price": "180.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "rest": "Vịt Quay Mật Mật - 15 Bắc Sơn, TP. Lạng Sơn",
        "lat": 21.849,
        "lng": 106.758,
        "latitude": 21.849,
        "longitude": 106.758
      }
    ]
  },
  {
    "cityId": "caobang",
    "city": "Cao Bằng (Cao Lạng cũ)",
    "shortName": "Cao Bằng",
    "oldName": "Cao Lạng cũ",
    "province": "Cao Bằng",
    "region": "Miền Bắc",
    "address": "Bản Giốc, Trùng Khánh",
    "temp": "16°C",
    "condition": "Sương phủ núi non",
    "icon": "💧",
    "lat": 22.6666,
    "lng": 106.257,
    "signature": "Phở chua Cao Bằng, vịt quay 7 vị Trùng Khánh, hạt dẻ Trùng Khánh",
    "specialties": [
      {
        "name": "Phở Chua Cao Bằng & Vịt Quay 7 Vị",
        "cat": "noodles",
        "tags": [
          "#Phở_chua",
          "#Vịt_quay_7_vị",
          "#Đậm_đà"
        ],
        "price": "45.000đ - 75.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Phở Chua Quyên - Đường Hiến Giang, TP. Cao Bằng",
        "lat": 22.668,
        "lng": 106.262,
        "latitude": 22.668,
        "longitude": 106.262
      }
    ]
  },
  {
    "cityId": "hagiang",
    "city": "Hà Giang (Hà Tuyên cũ)",
    "shortName": "Hà Giang",
    "oldName": "Hà Tuyên cũ",
    "province": "Hà Giang",
    "region": "Miền Bắc",
    "address": "Phố Cổ Đồng Văn",
    "temp": "14°C",
    "condition": "Rét lạnh cao nguyên đá",
    "icon": "⛰️",
    "lat": 22.8233,
    "lng": 104.9839,
    "signature": "Thắng cố Đồng Văn, cháo ấu tẩu ấm bụng, bánh tam giác mạch",
    "specialties": [
      {
        "name": "Nồi Thắng Cố Ngựa & Cháo Ấu Tẩu Phố Cổ Đồng Văn",
        "cat": "hotpot",
        "tags": [
          "#Thắng_cố",
          "#Ấu_tẩu",
          "#Ấm_áp_vùng_cao"
        ],
        "price": "60.000đ - 180.000đ",
        "img": "images/lau_bo_ba_toa.jpg",
        "rest": "Thắng Cố A Dũng - Chợ Cũ Đồng Văn, Hà Giang",
        "lat": 23.2785,
        "lng": 105.362,
        "latitude": 23.2785,
        "longitude": 105.362
      }
    ]
  },
  {
    "cityId": "tuyenquang",
    "city": "Tuyên Quang (Hà Tuyên cũ)",
    "shortName": "Tuyên Quang",
    "oldName": "Hà Tuyên cũ",
    "province": "Tuyên Quang",
    "region": "Miền Bắc",
    "address": "Bình Thuận, TP. Tuyên Quang",
    "temp": "19°C",
    "condition": "Mát mẻ",
    "icon": "🏞️",
    "lat": 21.8234,
    "lng": 105.214,
    "signature": "Gỏi cá bỗng sông Lô, thịt lợn đen Na Hang nướng mắc khén",
    "specialties": [
      {
        "name": "Gỏi Cá Bỗng Sông Lô & Cá Nướng Na Hang",
        "cat": "seafood",
        "tags": [
          "#Cá_bỗng_sông_Lô",
          "#Xương_băm_giòn",
          "#Thanh_mát"
        ],
        "price": "150.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Nhà Hàng Sông Lô - Đường Chiến Thắng Sông Lô",
        "lat": 21.819,
        "lng": 105.215,
        "latitude": 21.819,
        "longitude": 105.215
      }
    ]
  },
  {
    "cityId": "sapa",
    "city": "Lào Cai (Sa Pa / Hoàng Liên Sơn cũ)",
    "shortName": "Lào Cai (Sa Pa)",
    "oldName": "Hoàng Liên Sơn cũ",
    "province": "Lào Cai",
    "region": "Miền Bắc",
    "address": "Xuân Viên, TT. Sa Pa",
    "temp": "13°C",
    "condition": "Rét buốt sương mù",
    "icon": "🏔️",
    "lat": 22.3364,
    "lng": 103.8438,
    "signature": "Lẩu cá tầm Tây Bắc, lẩu cá hồi măng chua, lợn cắp nách quay",
    "specialties": [
      {
        "name": "Nồi Lẩu Cá Tầm & Thắng Cố Nóng Hổi Sa Pa",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_cá_tầm",
          "#Trời_rét_Sa_Pa",
          "#Ấm_áp"
        ],
        "price": "350.000đ - 580.000đ",
        "img": "images/lau_ca_tam_sapa.jpg",
        "rest": "Lẩu Cá Tầm Hotpot Sa Pa - 71 Xuân Viên, TT. Sa Pa",
        "lat": 22.3355,
        "lng": 103.8425,
        "latitude": 22.3355,
        "longitude": 103.8425
      }
    ]
  },
  {
    "cityId": "yenbai",
    "city": "Yên Bái (Hoàng Liên Sơn cũ)",
    "shortName": "Yên Bái",
    "oldName": "Hoàng Liên Sơn cũ",
    "province": "Yên Bái",
    "region": "Miền Bắc",
    "address": "Mù Cang Chải, Nghĩa Lộ",
    "temp": "18°C",
    "condition": "Gió thung lũng",
    "icon": "🌾",
    "lat": 21.7168,
    "lng": 104.8976,
    "signature": "Xôi nếp nương Tú Lệ chấm muối vừng, thịt trâu sấy gác bếp",
    "specialties": [
      {
        "name": "Xôi Nếp Nương Tú Lệ & Thịt Trâu Gác Bếp",
        "cat": "comfort",
        "tags": [
          "#Xôi_nếp_Tú_Lệ",
          "#Trâu_gác_bếp",
          "#Mắc_khén"
        ],
        "price": "60.000đ - 150.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Bản Phố Mường Lò - TT. Nghĩa Lộ",
        "lat": 21.595,
        "lng": 104.512,
        "latitude": 21.595,
        "longitude": 104.512
      }
    ]
  },
  {
    "cityId": "dienbien",
    "city": "Điện Biên (Lai Châu cũ)",
    "shortName": "Điện Biên",
    "oldName": "Lai Châu cũ",
    "province": "Điện Biên",
    "region": "Miền Bắc",
    "address": "Mường Thanh, TP. Điện Biên Phủ",
    "temp": "20°C",
    "condition": "Nắng thung lũng",
    "icon": "🎖️",
    "lat": 21.386,
    "lng": 103.023,
    "signature": "Pa pỉnh tộp (cá suối nướng úp), xôi nếp nương Điện Biên, gà đen Tủa Chùa",
    "specialties": [
      {
        "name": "Pa Pỉnh Tộp (Cá Nướng Gập Hạt Mắc Khén Tây Bắc)",
        "cat": "bbq",
        "tags": [
          "#Pa_pỉnh_tộp",
          "#Cá_nướng_Tây_Bắc",
          "#Cay_thơm"
        ],
        "price": "120.000đ - 190.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Bản Mển Dân Tộc Thái - Thanh Nưa, Điện Biên",
        "lat": 21.412,
        "lng": 103.018,
        "latitude": 21.412,
        "longitude": 103.018
      }
    ]
  },
  {
    "cityId": "laichau",
    "city": "Lai Châu",
    "shortName": "Lai Châu",
    "oldName": "Lai Châu",
    "province": "Lai Châu",
    "region": "Miền Bắc",
    "address": "Trần Phú, TP. Lai Châu",
    "temp": "17°C",
    "condition": "Sương mù",
    "icon": "🌲",
    "lat": 22.3963,
    "lng": 103.4682,
    "signature": "Lợn cắp nách nướng nguyên con, nộm rau dớn rừng, cá bống vùi tro",
    "specialties": [
      {
        "name": "Lợn Cắp Nách Nướng Mắc Mật Da Giòn Rụm",
        "cat": "bbq",
        "tags": [
          "#Lợn_cắp_nách",
          "#Mắc_mật",
          "#Xì_xèo"
        ],
        "price": "180.000đ - 300.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Lẩu Nướng Bản Sin Suối Hồ - Phong Thổ",
        "lat": 22.528,
        "lng": 103.542,
        "latitude": 22.528,
        "longitude": 103.542
      }
    ]
  },
  {
    "cityId": "sonla",
    "city": "Sơn La (Mộc Châu)",
    "shortName": "Sơn La (Mộc Châu)",
    "oldName": "Sơn La",
    "province": "Sơn La",
    "region": "Miền Bắc",
    "address": "Thảo Nguyên Mộc Châu",
    "temp": "15°C",
    "condition": "Se lạnh cao nguyên mận",
    "icon": "🍓",
    "lat": 21.3283,
    "lng": 103.9148,
    "signature": "Bê chao Mộc Châu thơm mềm, cá suối chiên giòn, sữa chua nếp cẩm",
    "specialties": [
      {
        "name": "Bê Chao Mộc Châu Nóng Hổi Gừng Tỏi",
        "cat": "bbq",
        "tags": [
          "#Bê_chao_Mộc_Châu",
          "#Thịt_mềm_ngọt",
          "#Ấm_áp"
        ],
        "price": "120.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Nhà Hàng 64 Mộc Châu - Tiểu Khu Chiềng Đi",
        "lat": 20.865,
        "lng": 104.721,
        "latitude": 20.865,
        "longitude": 104.721
      }
    ]
  },
  {
    "cityId": "hoabinh",
    "city": "Hòa Bình (Hà Sơn Bình cũ)",
    "shortName": "Hòa Bình",
    "oldName": "Hà Sơn Bình cũ",
    "province": "Hòa Bình",
    "region": "Miền Bắc",
    "address": "Bản Lác, Mai Châu",
    "temp": "20°C",
    "condition": "Gió thung lũng êm đềm",
    "icon": "🏡",
    "lat": 20.8171,
    "lng": 105.3376,
    "signature": "Cơm lam Mai Châu, thịt lợn mán thui rơm cuốn lá móc mật, cá sông Đà",
    "specialties": [
      {
        "name": "Cơm Lam Mai Châu & Lợn Mán Thui Rơm Nướng Than",
        "cat": "bbq",
        "tags": [
          "#Cơm_lam_Mai_Châu",
          "#Lợn_mán_nướng",
          "#Đậm_đà"
        ],
        "price": "90.000đ - 180.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "rest": "Nhà Sàn Bản Lác Số 2 - Mai Châu, Hòa Bình",
        "lat": 20.658,
        "lng": 105.078,
        "latitude": 20.658,
        "longitude": 105.078
      }
    ]
  },
  {
    "cityId": "thanhhoa",
    "city": "Thanh Hóa",
    "shortName": "Thanh Hóa",
    "oldName": "Thanh Hóa",
    "province": "Thanh Hóa",
    "region": "Miền Trung",
    "address": "Hạc Thành, TP. Thanh Hóa",
    "temp": "22°C",
    "condition": "Nắng ấm",
    "icon": "☀️",
    "lat": 19.8067,
    "lng": 105.7852,
    "signature": "Nem chua Thanh Hóa cay nồng, chả tôm nướng than hoa, bánh khoái tép",
    "specialties": [
      {
        "name": "Chả Tôm Nướng Than Hoa & Nem Chua Thanh Hóa",
        "cat": "streetfood",
        "tags": [
          "#Chả_tôm_nướng",
          "#Nem_chua_cay",
          "#Nóng_hổi"
        ],
        "price": "35.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "rest": "Chả Tôm Bà Thật - 09 Lê Thị Hoa, TP. Thanh Hóa",
        "lat": 19.8115,
        "lng": 105.7795,
        "latitude": 19.8115,
        "longitude": 105.7795
      }
    ]
  },
  {
    "cityId": "nghean",
    "city": "Nghệ An (Nghệ Tĩnh cũ)",
    "shortName": "Nghệ An",
    "oldName": "Nghệ Tĩnh cũ",
    "province": "Nghệ An",
    "region": "Miền Trung",
    "address": "Quang Trung, TP. Vinh",
    "temp": "23°C",
    "condition": "Nắng nhẹ",
    "icon": "🍲",
    "lat": 18.6734,
    "lng": 105.6813,
    "signature": "Cháo lươn xứ Nghệ cay xé lưỡi, súp lươn ăn kèm bánh mướt nóng",
    "specialties": [
      {
        "name": "Súp Lươn Đồng Xứ Nghệ & Bánh Mướt Nóng",
        "cat": "noodles",
        "tags": [
          "#Súp_lươn_xứ_Nghệ",
          "#Siêu_cay",
          "#Nóng_hổi"
        ],
        "price": "40.000đ - 65.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Lươn Cay Bà Liễu - 87 Mai Hắc Đế, TP. Vinh",
        "lat": 18.6885,
        "lng": 105.674,
        "latitude": 18.6885,
        "longitude": 105.674
      }
    ]
  },
  {
    "cityId": "hatinh",
    "city": "Hà Tĩnh (Nghệ Tĩnh cũ)",
    "shortName": "Hà Tĩnh",
    "oldName": "Nghệ Tĩnh cũ",
    "province": "Hà Tĩnh",
    "region": "Miền Trung",
    "address": "Hà Huy Tập, TP. Hà Tĩnh",
    "temp": "23°C",
    "condition": "Gió mát",
    "icon": "🌊",
    "lat": 18.3435,
    "lng": 105.9058,
    "signature": "Mực nhảy Vũng Áng hấp gừng, kẹo cu đơ Cầu Phủ giòn bùi, bánh bèo Hà Tĩnh",
    "specialties": [
      {
        "name": "Mực Nhảy Vũng Áng Hấp Bia Gừng Tươi Rói",
        "cat": "seafood",
        "tags": [
          "#Mực_nhảy_Vũng_Áng",
          "#Tươi_sống",
          "#Giòn_ngọt"
        ],
        "price": "250.000đ - 420.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Bè Nổi Mực Nhảy Loan Phương - Vũng Áng, Kỳ Anh",
        "lat": 18.065,
        "lng": 106.378,
        "latitude": 18.065,
        "longitude": 106.378
      }
    ]
  },
  {
    "cityId": "quangbinh",
    "city": "Quảng Bình (Bình Trị Thiên cũ)",
    "shortName": "Quảng Bình",
    "oldName": "Bình Trị Thiên cũ",
    "province": "Quảng Bình",
    "region": "Miền Trung",
    "address": "Đồng Hới, Quảng Bình",
    "temp": "24°C",
    "condition": "Gió biển Nhật Lệ",
    "icon": "🏖️",
    "lat": 17.469,
    "lng": 106.6225,
    "signature": "Cháo canh cá lóc bột gạo Đồng Hới, lẩu cá khoai nóng hổi, đẻn biển",
    "specialties": [
      {
        "name": "Cháo Canh Cá Lóc Đồng Hới Đậm Đà Sợi Dẻo",
        "cat": "noodles",
        "tags": [
          "#Cháo_canh_Quảng_Bình",
          "#Cá_lóc_đồng",
          "#Nóng_hổi"
        ],
        "price": "35.000đ - 55.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Cháo Canh Gia Bảo - 08 Lý Thường Kiệt, Đồng Hới",
        "lat": 17.472,
        "lng": 106.619,
        "latitude": 17.472,
        "longitude": 106.619
      }
    ]
  },
  {
    "cityId": "quangtri",
    "city": "Quảng Trị (Bình Trị Thiên cũ)",
    "shortName": "Quảng Trị",
    "oldName": "Bình Trị Thiên cũ",
    "province": "Quảng Trị",
    "region": "Miền Trung",
    "address": "Đông Hà, Quảng Trị",
    "temp": "24°C",
    "condition": "Nắng ấm",
    "icon": "☀️",
    "lat": 16.8163,
    "lng": 107.1004,
    "signature": "Bánh khoái Đông Hà giòn rụm, thịt trâu nướng lá trơng cay the",
    "specialties": [
      {
        "name": "Thịt Trâu Nướng Lá Trơng Thơm Nồng Cay The",
        "cat": "bbq",
        "tags": [
          "#Thịt_trâu_lá_trơng",
          "#Cay_nồng",
          "#Xì_xèo"
        ],
        "price": "120.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Trâu Lá Trơng Sáu Hùng - 42 Hùng Vương, Đông Hà",
        "lat": 16.815,
        "lng": 107.099,
        "latitude": 16.815,
        "longitude": 107.099
      }
    ]
  },
  {
    "cityId": "hue",
    "city": "Thừa Thiên Huế (Bình Trị Thiên cũ)",
    "shortName": "Huế",
    "oldName": "Bình Trị Thiên cũ",
    "province": "Thừa Thiên Huế",
    "region": "Miền Trung",
    "address": "Lê Lợi, Cố Đô Huế",
    "temp": "22°C",
    "condition": "Mưa phùn Cố Đô",
    "icon": "🏰",
    "lat": 16.4637,
    "lng": 107.5909,
    "signature": "Bún bò Huế chân giò chả cua, bánh bèo nậm lọc tiến vua, cơm hến",
    "specialties": [
      {
        "name": "Bún Bò Huế Chân Giò & Chả Cua Mụ Rơi",
        "cat": "noodles",
        "tags": [
          "#Bún_bò_Huế",
          "#Chả_cua",
          "#Cay_nồng"
        ],
        "price": "45.000đ - 65.000đ",
        "img": "images/bun_bo_hue.jpg",
        "rest": "Bún Bò Mụ Rơi - 40 Nguyễn Chí Diểu, TP. Huế",
        "lat": 16.4715,
        "lng": 107.5815,
        "latitude": 16.4715,
        "longitude": 107.5815
      }
    ]
  },
  {
    "cityId": "danang",
    "city": "Đà Nẵng (Quảng Nam - Đà Nẵng cũ)",
    "shortName": "Đà Nẵng",
    "oldName": "Quảng Nam - Đà Nẵng cũ",
    "province": "Đà Nẵng",
    "region": "Miền Trung",
    "address": "Bạch Đằng, Hải Châu",
    "temp": "25°C",
    "condition": "Mát dịu ven sông",
    "icon": "🌉",
    "lat": 16.0678,
    "lng": 108.2208,
    "signature": "Mì Quảng ếch Bếp Trang, bánh tráng cuốn thịt heo hai đầu da",
    "specialties": [
      {
        "name": "Mì Quảng Ếch & Tôm Thịt Bếp Trang",
        "cat": "noodles",
        "tags": [
          "#Mì_Quảng",
          "#Tôm_thịt_đậm_đà",
          "#Chuẩn_vị_Đà_Thành"
        ],
        "price": "45.000đ - 68.000đ",
        "img": "images/mi_quang_da_nang.jpg",
        "rest": "Mì Quảng Bếp Trang - 24 Pasteur, Hải Châu",
        "lat": 16.069,
        "lng": 108.2195,
        "latitude": 16.069,
        "longitude": 108.2195
      },
      {
        "name": "Bánh Tráng Cuốn Thịt Heo Hai Đầu Da",
        "cat": "streetfood",
        "tags": [
          "#Bánh_tráng_cuốn",
          "#Mắm_nêm_cay",
          "#Thanh_mát"
        ],
        "price": "80.000đ - 120.000đ",
        "img": "images/banh_trang_cuon_thit_heo.jpg",
        "rest": "Quán Trần Đà Nẵng - 04 Lê Duẩn, Hải Châu",
        "lat": 16.072,
        "lng": 108.223,
        "latitude": 16.072,
        "longitude": 108.223
      }
    ]
  },
  {
    "cityId": "quangnam",
    "city": "Quảng Nam (Quảng Nam - Đà Nẵng cũ)",
    "shortName": "Quảng Nam",
    "oldName": "Quảng Nam - Đà Nẵng cũ",
    "province": "Quảng Nam",
    "region": "Miền Trung",
    "address": "Phố Cổ Hội An",
    "temp": "25°C",
    "condition": "Nắng vàng phố cổ",
    "icon": "🏮",
    "lat": 15.565,
    "lng": 108.482,
    "signature": "Cao lầu Hội An nước giếng Bá Lễ, bê thui Cầu Mống chấm mắm nêm",
    "specialties": [
      {
        "name": "Cao Lầu Hội An Thịt Xíu Giòn Giòn & Bê Thui",
        "cat": "noodles",
        "tags": [
          "#Cao_lầu_Hội_An",
          "#Bá_Lễ",
          "#Đậm_đà"
        ],
        "price": "40.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Cao Lầu Thanh - 26 Thái Phiên, Phố Cổ Hội An",
        "lat": 15.881693,
        "lng": 108.328508,
        "latitude": 15.881693,
        "longitude": 108.328508
      }
    ]
  },
  {
    "cityId": "quangngai",
    "city": "Quảng Ngãi (Nghĩa Bình cũ)",
    "shortName": "Quảng Ngãi",
    "oldName": "Nghĩa Bình cũ",
    "province": "Quảng Ngãi",
    "region": "Miền Trung",
    "address": "Quang Trung, TP. Quảng Ngãi",
    "temp": "26°C",
    "condition": "Nắng ấm miền biển",
    "icon": "🌊",
    "lat": 15.1205,
    "lng": 108.7923,
    "signature": "Don sông Trà thơm ngọt cay nồng ớt xiêm, ram bắp giòn rụm",
    "specialties": [
      {
        "name": "Tô Don Sông Trà Bẻ Bánh Tráng & Ram Bắp Giòn",
        "cat": "streetfood",
        "tags": [
          "#Don_sông_Trà",
          "#Ớt_xiêm_cay",
          "#Ấm_áp"
        ],
        "price": "25.000đ - 45.000đ",
        "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "rest": "Don Bà Hai - Vạn Tượng, Sơn Tịnh, Quảng Ngãi",
        "lat": 15.132,
        "lng": 108.802,
        "latitude": 15.132,
        "longitude": 108.802
      }
    ]
  },
  {
    "cityId": "quynhon",
    "city": "Bình Định (Nghĩa Bình cũ)",
    "shortName": "Bình Định (Quy Nhơn)",
    "oldName": "Nghĩa Bình cũ",
    "province": "Bình Định",
    "region": "Miền Trung",
    "address": "Nguyễn Huệ, Quy Nhơn",
    "temp": "24°C",
    "condition": "Mưa râm ran mát lạnh",
    "icon": "🌧️",
    "lat": 13.7735,
    "lng": 109.2365,
    "signature": "Bánh xèo tôm nhảy, bún sứa chả cá, lẩu thái chua cay",
    "specialties": [
      {
        "name": "Lẩu Thái Chua Cay Khổng Lồ Cô Vy",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_Thái",
          "#Ấm_áp",
          "#Xả_stress"
        ],
        "price": "189.000đ - 350.000đ",
        "img": "images/lau_thai_chua_cay.jpg",
        "rest": "Lẩu Cô Vy",
        "address": "124 Nguyễn Huệ, P. Trần Phú, TP. Quy Nhơn",
        "lat": 13.7745,
        "lng": 109.2312,
        "latitude": 13.7745,
        "longitude": 109.2312
      },
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Gia Vỹ",
        "cat": "streetfood",
        "tags": [
          "#Bánh_xèo_tôm_nhảy",
          "#Vỏ_giòn_tan",
          "#Nóng_hổi"
        ],
        "price": "35.000đ - 60.000đ",
        "img": "images/banh_xeo_tom_nhay.jpg",
        "rest": "Bánh Xèo Gia Vỹ 2",
        "address": "14 Diên Hồng, TP. Quy Nhơn",
        "lat": 13.773073,
        "lng": 109.224855,
        "latitude": 13.773073,
        "longitude": 109.224855
      }
    ]
  },
  {
    "cityId": "phuyen",
    "city": "Phú Yên (Phú Khánh cũ)",
    "shortName": "Phú Yên",
    "oldName": "Phú Khánh cũ",
    "province": "Phú Yên",
    "region": "Miền Trung",
    "address": "Hùng Vương, Tuy Hòa",
    "temp": "26°C",
    "condition": "Nắng gió xứ hoa vàng cỏ xanh",
    "icon": "🏖️",
    "lat": 13.0882,
    "lng": 109.3073,
    "signature": "Mắt cá ngừ đại dương tiềm thuốc bắc, bánh canh hẹ Sông Cầu",
    "specialties": [
      {
        "name": "Mắt Cá Ngừ Đại Dương Tiềm Thuốc Bắc Bà Tám",
        "cat": "seafood",
        "tags": [
          "#Mắt_cá_ngừ",
          "#Thuốc_bắc_bổ_dưỡng",
          "#Nóng_sôi"
        ],
        "price": "45.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Bà Tám - 289 Lê Duẩn, TP. Tuy Hòa",
        "lat": 13.0935,
        "lng": 109.314,
        "latitude": 13.0935,
        "longitude": 109.314
      }
    ]
  },
  {
    "cityId": "nhatrang",
    "city": "Khánh Hòa (Nha Trang / Phú Khánh cũ)",
    "shortName": "Khánh Hòa (Nha Trang)",
    "oldName": "Phú Khánh cũ",
    "province": "Khánh Hòa",
    "region": "Miền Trung",
    "address": "Trần Phú, Nha Trang",
    "temp": "27°C",
    "condition": "Nắng gió biển lộng",
    "icon": "🏖️",
    "lat": 12.2388,
    "lng": 109.1967,
    "signature": "Hải sản tươi sống bờ kè, nem nướng Ninh Hòa Đặng Văn Quyên",
    "specialties": [
      {
        "name": "Hải Sản Tươi Sống Bờ Kè & Nem Nướng Ninh Hòa",
        "cat": "seafood",
        "tags": [
          "#Hải_sản_bờ_kè",
          "#Nem_nướng_Ninh_Hòa",
          "#Tươi_sống"
        ],
        "price": "120.000đ - 350.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Hải Sản Thanh Sương - 9A Trần Phú, Nha Trang",
        "lat": 12.215,
        "lng": 109.201,
        "latitude": 12.215,
        "longitude": 109.201
      }
    ]
  },
  {
    "cityId": "ninhthuan",
    "city": "Ninh Thuận (Thuận Hải cũ)",
    "shortName": "Ninh Thuận",
    "oldName": "Thuận Hải cũ",
    "province": "Ninh Thuận",
    "region": "Miền Trung",
    "address": "Phan Rang - Tháp Chàm",
    "temp": "29°C",
    "condition": "Nắng rực rỡ gió lộng",
    "icon": "🍇",
    "lat": 11.5644,
    "lng": 108.9882,
    "signature": "Thịt cừu nướng đồi cát, bánh căn bánh xèo Phan Rang, nho đỏ Ninh Thuận",
    "specialties": [
      {
        "name": "Thịt Cừu Nướng Mắc Khén & Bánh Căn Phan Rang",
        "cat": "bbq",
        "tags": [
          "#Cừu_nướng",
          "#Bánh_căn_Phan_Rang",
          "#Cay_nồng"
        ],
        "price": "70.000đ - 180.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Cừu Nướng Ô Vương - 123 Thống Nhất, Phan Rang",
        "lat": 11.569,
        "lng": 108.985,
        "latitude": 11.569,
        "longitude": 108.985
      }
    ]
  },
  {
    "cityId": "binhthuan",
    "city": "Bình Thuận (Phan Thiết / Thuận Hải cũ)",
    "shortName": "Bình Thuận (Phan Thiết)",
    "oldName": "Thuận Hải cũ",
    "province": "Bình Thuận",
    "region": "Miền Trung",
    "address": "Nguyễn Đình Chiểu, Mũi Né",
    "temp": "28°C",
    "condition": "Nắng ấm đồi cát",
    "icon": "🏖️",
    "lat": 10.9275,
    "lng": 108.102,
    "signature": "Lẩu thả Mũi Né trứ danh, bánh quai vạc Phan Thiết, răng mực nướng",
    "specialties": [
      {
        "name": "Lẩu Thả Mũi Né Đại Dương Cá Mai & Bánh Quai Vạc",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_thả_Mũi_Né",
          "#Cá_mai_tươi",
          "#Đậm_đà"
        ],
        "price": "180.000đ - 350.000đ",
        "img": "images/lau_thai_chua_cay.jpg",
        "rest": "Nhà Hàng Cây Bàng - 02 Nguyễn Đình Chiểu, Mũi Né",
        "lat": 10.941,
        "lng": 108.182,
        "latitude": 10.941,
        "longitude": 108.182
      }
    ]
  },
  {
    "cityId": "gialai",
    "city": "Gia Lai (Bình Định cũ)",
    "shortName": "Gia Lai",
    "oldName": "Bình Định cũ / Gia Lai - Kon Tum cũ",
    "province": "Gia Lai",
    "region": "Tây Nguyên",
    "address": "Nguyễn Du, TP. Pleiku",
    "temp": "22°C",
    "condition": "Mát mẻ phố núi sương mù",
    "icon": "🌲",
    "lat": 13.9833,
    "lng": 108,
    "signature": "Phở hai tô (phở khô Gia Lai), bò một nắng muối kiến vàng, gà nướng cơm lam",
    "specialties": [
      {
        "name": "Phở Khô Hai Tô Gia Lai (Tô Khô Tô Nước) Phở Nữ",
        "cat": "noodles",
        "tags": [
          "#Phở_hai_tô",
          "#Tương_nâu_đậm_đà",
          "#Phố_núi"
        ],
        "price": "40.000đ - 65.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Phở Khô Nữ Pleiku - 50 Nguyễn Du, TP. Pleiku",
        "lat": 13.9806,
        "lng": 107.9958,
        "latitude": 13.9806,
        "longitude": 107.9958
      },
      {
        "name": "Bò Một Nắng Nướng Than Chấm Muối Kiến Vàng Krông Pa",
        "cat": "bbq",
        "tags": [
          "#Bò_một_nắng",
          "#Muối_kiến_vàng",
          "#Chua_cay_bùng_nổ"
        ],
        "price": "150.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Bò Một Nắng Krông Pa - 18 Lê Lợi, TP. Pleiku",
        "lat": 13.982,
        "lng": 108.003,
        "latitude": 13.982,
        "longitude": 108.003
      },
      {
        "name": "Gà Nướng Cơm Lam Bazan Chấm Muối Lá É",
        "cat": "bbq",
        "tags": [
          "#Gà_nướng_cơm_lam",
          "#Than_hoa_xì_xèo",
          "#Ấm_áp"
        ],
        "price": "200.000đ - 320.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Gà Nướng Bazan - 45 Phù Đổng, TP. Pleiku",
        "lat": 13.978,
        "lng": 108.012,
        "latitude": 13.978,
        "longitude": 108.012
      }
    ]
  },
  {
    "cityId": "kontum",
    "city": "Kon Tum (Gia Lai - Kon Tum cũ)",
    "shortName": "Kon Tum",
    "oldName": "Gia Lai - Kon Tum cũ",
    "province": "Kon Tum",
    "region": "Tây Nguyên",
    "address": "Phan Chu Trinh, TP. Kon Tum",
    "temp": "21°C",
    "condition": "Mát rượi cao nguyên",
    "icon": "🍃",
    "lat": 14.3497,
    "lng": 108.0005,
    "signature": "Gỏi lá Kon Tum 40 vị thuốc rừng, cá niên nướng trút, cơm lam gà nướng",
    "specialties": [
      {
        "name": "Mâm Gỏi Lá Kon Tum 40 Loại Lá Rừng Tây Nguyên",
        "cat": "streetfood",
        "tags": [
          "#Gỏi_lá_Kon_Tum",
          "#Lá_rừng_thanh_mát",
          "#Nước_chấm_hèm"
        ],
        "price": "100.000đ - 180.000đ",
        "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        "rest": "Gỏi Lá Út Cưng - 45 Trần Cao Vân, TP. Kon Tum",
        "lat": 14.351,
        "lng": 108.002,
        "latitude": 14.351,
        "longitude": 108.002
      }
    ]
  },
  {
    "cityId": "daklak",
    "city": "Đắk Lắk (Buôn Ma Thuột)",
    "shortName": "Đắk Lắk",
    "oldName": "Đắk Lắk",
    "province": "Đắk Lắk",
    "region": "Tây Nguyên",
    "address": "Lê Thánh Tông, Buôn Ma Thuột",
    "temp": "23°C",
    "condition": "Nắng gió đất đỏ",
    "icon": "☕",
    "lat": 12.6662,
    "lng": 108.0383,
    "signature": "Bún đỏ Buôn Ma Thuột nóng hổi, cà phê chồn Ban Mê, bò nhúng me",
    "specialties": [
      {
        "name": "Tô Bún Đỏ Buôn Ma Thuột Nóng Hổi Trứng Cút",
        "cat": "noodles",
        "tags": [
          "#Bún_đỏ_Ban_Mê",
          "#Nước_dùng_huyết",
          "#Ấm_áp"
        ],
        "price": "35.000đ - 50.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Bún Đỏ Thu - Góc Lê Hồng Phong & Phan Đình Giót",
        "lat": 12.678,
        "lng": 108.041,
        "latitude": 12.678,
        "longitude": 108.041
      },
      {
        "name": "Bò Nhúng Me Cà Te Quán Xì Xèo Bánh Mì",
        "cat": "bbq",
        "tags": [
          "#Bò_nhúng_me",
          "#Sốt_me_chua_ngọt",
          "#Xì_xèo"
        ],
        "price": "120.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Cà Te Quán - 140 Lê Thánh Tông, Buôn Ma Thuột",
        "lat": 12.682,
        "lng": 108.046,
        "latitude": 12.682,
        "longitude": 108.046
      }
    ]
  },
  {
    "cityId": "daknong",
    "city": "Đắk Nông (Đắk Lắk cũ)",
    "shortName": "Đắk Nông",
    "oldName": "Đắk Lắk cũ",
    "province": "Đắk Nông",
    "region": "Tây Nguyên",
    "address": "Gia Nghĩa, Đắk Nông",
    "temp": "22°C",
    "condition": "Gió đại ngàn mát lạnh",
    "icon": "🌲",
    "lat": 12.0039,
    "lng": 107.6908,
    "signature": "Cá lăng sông Sêrêpôk nướng than, canh thụt đọt mây người M'Nông",
    "specialties": [
      {
        "name": "Cá Lăng Sông Sêrêpôk Nướng Than Cuốn Bánh Tráng",
        "cat": "bbq",
        "tags": [
          "#Cá_lăng_Sêrêpôk",
          "#Nướng_than_thơm",
          "#Béo_ngọt"
        ],
        "price": "180.000đ - 320.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Nhà Hàng Hoàng Anh - TT. Gia Nghĩa",
        "lat": 12.005,
        "lng": 107.692,
        "latitude": 12.005,
        "longitude": 107.692
      }
    ]
  },
  {
    "cityId": "dalat",
    "city": "Lâm Đồng (Đà Lạt / Tuyên Đức cũ)",
    "shortName": "Lâm Đồng (Đà Lạt)",
    "oldName": "Tuyên Đức cũ",
    "province": "Lâm Đồng",
    "region": "Tây Nguyên",
    "address": "Khu Hoà Bình, Đà Lạt",
    "temp": "16°C",
    "condition": "Sương mù se lạnh",
    "icon": "🌲",
    "lat": 11.9404,
    "lng": 108.4583,
    "signature": "Lẩu gà lá é Tao Ngộ, lẩu bò Ba Toa quán gỗ, bánh căn Lệ",
    "specialties": [
      {
        "name": "Lẩu Gà Lá É Tao Ngộ Ấm Áp Đà Lạt",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_gà_lá_é",
          "#Ấm_áp_Đà_Lạt",
          "#Cay_thơm"
        ],
        "price": "200.000đ - 350.000đ",
        "img": "images/lau_ga_la_e_da_lat.jpg",
        "rest": "Lẩu Gà Lá É Tao Ngộ - 05 Ba Tháng Tư, Đà Lạt",
        "lat": 11.932,
        "lng": 108.448,
        "latitude": 11.932,
        "longitude": 108.448
      },
      {
        "name": "Lẩu Bò Ba Toa Quán Gỗ Đậm Vị Truyền Thống",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_bò_Ba_Toa",
          "#Xả_stress",
          "#Đậm_đà"
        ],
        "price": "220.000đ - 380.000đ",
        "img": "images/lau_bo_ba_toa.jpg",
        "rest": "Lẩu Bò Quán Gỗ - 1/29 Hoàng Diệu, Đà Lạt",
        "lat": 11.943,
        "lng": 108.435,
        "latitude": 11.943,
        "longitude": 108.435
      }
    ]
  },
  {
    "cityId": "hcm",
    "city": "TP. Hồ Chí Minh (Sài Gòn - Gia Định cũ)",
    "shortName": "TP. Hồ Chí Minh",
    "oldName": "Sài Gòn - Gia Định cũ",
    "province": "TP. Hồ Chí Minh",
    "region": "Đông Nam Bộ",
    "address": "Quận 1, Bến Nghé",
    "temp": "31°C",
    "condition": "Nắng rực rỡ",
    "icon": "☀️",
    "lat": 10.7769,
    "lng": 106.7009,
    "signature": "Cơm tấm Ba Ghiền sườn cọng khổng lồ, ốc Sài Gòn, hủ tiếu Nam Vang",
    "specialties": [
      {
        "name": "Cơm Tấm Sườn Bì Chả Đặc Biệt Ba Ghiền",
        "cat": "comfort",
        "tags": [
          "#Cơm_tấm_Sài_Gòn",
          "#Sườn_nướng_mật_ong",
          "#Đậm_đà"
        ],
        "price": "75.000đ - 110.000đ",
        "img": "images/com_tam_ba_ghien.jpg",
        "rest": "Cơm Tấm Ba Ghiền - 84 Đặng Văn Ngữ, Phú Nhuận",
        "lat": 10.793,
        "lng": 106.669,
        "latitude": 10.793,
        "longitude": 106.669
      },
      {
        "name": "Ốc Hương Sốt Trứng Muối & Hải Sản Đêm",
        "cat": "seafood",
        "tags": [
          "#Ốc_Sài_Gòn",
          "#Trứng_muối_béo_ngậy",
          "#Lai_rai"
        ],
        "price": "60.000đ - 140.000đ",
        "img": "images/oc_huong_trung_muoi.jpg",
        "rest": "Ốc Đào - 212B Nguyễn Trãi, Quận 1",
        "lat": 10.7625,
        "lng": 106.6865,
        "latitude": 10.7625,
        "longitude": 106.6865
      }
    ]
  },
  {
    "cityId": "vungtau",
    "city": "Bà Rịa - Vũng Tàu (Vũng Tàu - Côn Đảo cũ)",
    "shortName": "Vũng Tàu",
    "oldName": "Đặc khu Vũng Tàu - Côn Đảo cũ",
    "province": "Bà Rịa - Vũng Tàu",
    "region": "Đông Nam Bộ",
    "address": "Bãi Trước, Vũng Tàu",
    "temp": "29°C",
    "condition": "Gió biển lộng",
    "icon": "🌊",
    "lat": 10.346,
    "lng": 107.0843,
    "signature": "Bánh khọt Cô Ba Vũng Tàu, lẩu cá đuối Trương Công Định, gỏi cá mai",
    "specialties": [
      {
        "name": "Bánh Khọt Cô Ba Vũng Tàu Giòn Rụm Tôm Tươi",
        "cat": "streetfood",
        "tags": [
          "#Bánh_khọt_Cô_Ba",
          "#Tôm_biển_tươi",
          "#Giòn_rùm_rụm"
        ],
        "price": "65.000đ - 110.000đ",
        "img": "images/banh_khot_vung_tau.jpg",
        "rest": "Bánh Khọt Cô Ba - 01 Hoàng Hoa Thám, Vũng Tàu",
        "lat": 10.3395,
        "lng": 107.082,
        "latitude": 10.3395,
        "longitude": 107.082
      },
      {
        "name": "Lẩu Cá Đuối Nấu Măng Chua Cay 7 Lượm",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_cá_đuối",
          "#Măng_chua_cay",
          "#Nóng_hổi"
        ],
        "price": "180.000đ - 320.000đ",
        "img": "images/lau_thai_chua_cay.jpg",
        "rest": "Lẩu Cá Đuối 7 Lượm - 37 Nguyễn Trường Tộ, Vũng Tàu",
        "lat": 10.344,
        "lng": 107.079,
        "latitude": 10.344,
        "longitude": 107.079
      }
    ]
  },
  {
    "cityId": "binhduong",
    "city": "Bình Dương (Sông Bé cũ)",
    "shortName": "Bình Dương",
    "oldName": "Sông Bé cũ",
    "province": "Bình Dương",
    "region": "Đông Nam Bộ",
    "address": "Thủ Dầu Một, Bình Dương",
    "temp": "31°C",
    "condition": "Nắng ấm",
    "icon": "🏙️",
    "lat": 10.9805,
    "lng": 106.6519,
    "signature": "Bánh bèo bì Mỹ Liên Chợ Búng, gỏi gà măng cụt Lái Thiêu",
    "specialties": [
      {
        "name": "Bánh Bèo Bì Mỹ Liên Chợ Búng 100 Năm",
        "cat": "streetfood",
        "tags": [
          "#Bánh_bèo_bì",
          "#Chợ_Búng",
          "#Nước_mắm_chua_ngọt"
        ],
        "price": "40.000đ - 65.000đ",
        "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "rest": "Bánh Bèo Mỹ Liên - 01 ĐT745, An Thạnh, Thuận An",
        "lat": 10.952,
        "lng": 106.685,
        "latitude": 10.952,
        "longitude": 106.685
      }
    ]
  },
  {
    "cityId": "binhphuoc",
    "city": "Bình Phước (Sông Bé cũ)",
    "shortName": "Bình Phước",
    "oldName": "Sông Bé cũ",
    "province": "Bình Phước",
    "region": "Đông Nam Bộ",
    "address": "Đồng Xoài, Bình Phước",
    "temp": "30°C",
    "condition": "Trời nắng nhẹ",
    "icon": "🥜",
    "lat": 11.7512,
    "lng": 106.908,
    "signature": "Hạt điều rang muối đất đỏ, heo thả rông nướng tro, đọt mây nướng",
    "specialties": [
      {
        "name": "Heo Thả Rông Nướng Tro & Gỏi Đọt Mây",
        "cat": "bbq",
        "tags": [
          "#Heo_thả_rông",
          "#Đất_đỏ_Bazan",
          "#Thơm_nức"
        ],
        "price": "120.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Nướng Rừng Bazan - TT. Đồng Xoài",
        "lat": 11.532,
        "lng": 106.885,
        "latitude": 11.532,
        "longitude": 106.885
      }
    ]
  },
  {
    "cityId": "dongnai",
    "city": "Đồng Nai (Biên Hòa cũ)",
    "shortName": "Đồng Nai",
    "oldName": "Biên Hòa cũ",
    "province": "Đồng Nai",
    "region": "Đông Nam Bộ",
    "address": "Phan Trung, Biên Hòa",
    "temp": "31°C",
    "condition": "Nắng rực rỡ",
    "icon": "🍊",
    "lat": 10.9575,
    "lng": 106.8427,
    "signature": "Gỏi cá Biên Hòa ven sông Đồng Nai, gỏi bưởi Tân Triều, lẩu tôm 5 Ri",
    "specialties": [
      {
        "name": "Gỏi Cá Biên Hòa Sông Đồng Nai & Lẩu Tôm Càng 5 Ri",
        "cat": "seafood",
        "tags": [
          "#Gỏi_cá_Biên_Hòa",
          "#Lẩu_tôm_5_Ri",
          "#Đậm_đà"
        ],
        "price": "150.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Lẩu Tôm 5 Ri - 20/1 CMT8, P. Hòa Bình, Biên Hòa",
        "lat": 10.951,
        "lng": 106.822,
        "latitude": 10.951,
        "longitude": 106.822
      }
    ]
  },
  {
    "cityId": "tayninh",
    "city": "Tây Ninh",
    "shortName": "Tây Ninh",
    "oldName": "Tây Ninh",
    "province": "Tây Ninh",
    "region": "Đông Nam Bộ",
    "address": "Trảng Bàng, Tây Ninh",
    "temp": "32°C",
    "condition": "Nắng hanh",
    "icon": "⛰️",
    "lat": 11.3101,
    "lng": 106.0983,
    "signature": "Bánh canh Trảng Bàng Hoàng Ty, bò tơ Tây Ninh nướng Năm Sánh, muối tôm",
    "specialties": [
      {
        "name": "Bánh Canh Trảng Bàng & Bò Tơ Tây Ninh Nướng Than",
        "cat": "bbq",
        "tags": [
          "#Bò_tơ_Tây_Ninh",
          "#Bánh_canh_Trảng_Bàng",
          "#Xì_xèo"
        ],
        "price": "80.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Bò Tơ Năm Sánh - QL22B, Hiệp Tân, Hòa Thành",
        "lat": 11.272,
        "lng": 106.125,
        "latitude": 11.272,
        "longitude": 106.125
      }
    ]
  },
  {
    "cityId": "cantho",
    "city": "Cần Thơ (Hậu Giang cũ)",
    "shortName": "Cần Thơ",
    "oldName": "Hậu Giang cũ",
    "province": "Cần Thơ",
    "region": "Miền Tây",
    "address": "Bến Ninh Kiều, Cần Thơ",
    "temp": "30°C",
    "condition": "Mát rượi gió sông Hậu",
    "icon": "🌾",
    "lat": 10.0452,
    "lng": 105.7469,
    "signature": "Lẩu mắm Dạ Lý sông Hậu, bánh cống Cô Út giòn béo, nem nướng Cái Răng",
    "specialties": [
      {
        "name": "Lẩu Mắm Dạ Lý Đậm Vị Miền Tây Sông Nước",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_mắm_Cần_Thơ",
          "#Cá_linh_bông_điên_điển",
          "#Đậm_đà"
        ],
        "price": "250.000đ - 420.000đ",
        "img": "images/lau_mam_can_tho.jpg",
        "rest": "Lẩu Mắm Dạ Lý - 89 Đường 3/2, Ninh Kiều, Cần Thơ",
        "lat": 10.026,
        "lng": 105.765,
        "latitude": 10.026,
        "longitude": 105.765
      }
    ]
  },
  {
    "cityId": "angiang",
    "city": "An Giang (Châu Đốc cũ)",
    "shortName": "An Giang",
    "oldName": "Châu Đốc / Long Xuyên cũ",
    "province": "An Giang",
    "region": "Miền Tây",
    "address": "Châu Đốc, An Giang",
    "temp": "30°C",
    "condition": "Nắng ấm phù sa",
    "icon": "🐟",
    "lat": 10.3759,
    "lng": 105.4185,
    "signature": "Bún cá Châu Đốc Cô Lệ, bò 7 món Núi Sam, lẩu mắm cá linh",
    "specialties": [
      {
        "name": "Tô Bún Cá Châu Đốc Nghệ Vàng & Chả Lụa",
        "cat": "noodles",
        "tags": [
          "#Bún_cá_Châu_Đốc",
          "#Bông_điên_điển",
          "#Ngọt_nước"
        ],
        "price": "35.000đ - 55.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Bún Cá Cô Lệ - Chợ Đêm Châu Đốc, An Giang",
        "lat": 10.708,
        "lng": 105.122,
        "latitude": 10.708,
        "longitude": 105.122
      }
    ]
  },
  {
    "cityId": "dongthap",
    "city": "Đồng Tháp (Sa Đéc & Kiến Phong cũ)",
    "shortName": "Đồng Tháp",
    "oldName": "Sa Đéc & Kiến Phong cũ",
    "province": "Đồng Tháp",
    "region": "Miền Tây",
    "address": "Sa Đéc, Đồng Tháp",
    "temp": "29°C",
    "condition": "Mát rượi hương sen",
    "icon": "🪷",
    "lat": 10.4594,
    "lng": 105.6328,
    "signature": "Hủ tiếu Sa Đéc bột gạo trứ danh, cá lóc nướng trui cuốn lá sen non",
    "specialties": [
      {
        "name": "Tô Hủ Tiếu Sa Đéc Khô Sốt Gia Truyền & Cá Lóc Nướng Trui",
        "cat": "noodles",
        "tags": [
          "#Hủ_tiếu_Sa_Đéc",
          "#Nước_sốt_đậm_đà",
          "#Lá_sen_non"
        ],
        "price": "40.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Hủ Tiếu Bà Sẩm - 188 Trần Hưng Đạo, Sa Đéc",
        "lat": 10.298,
        "lng": 105.759,
        "latitude": 10.298,
        "longitude": 105.759
      }
    ]
  },
  {
    "cityId": "tiengiang",
    "city": "Tiền Giang (Mỹ Tho / Định Tường cũ)",
    "shortName": "Tiền Giang",
    "oldName": "Mỹ Tho / Định Tường cũ",
    "province": "Tiền Giang",
    "region": "Miền Tây",
    "address": "Ấp Bắc, Mỹ Tho",
    "temp": "30°C",
    "condition": "Gió mát sông Tiền",
    "icon": "🍜",
    "lat": 10.36,
    "lng": 106.3639,
    "signature": "Hủ tiếu Mỹ Tho xí quách tôm mực, ốc gạo Tân Phong, bánh vá Gò Công",
    "specialties": [
      {
        "name": "Hủ Tiếu Mỹ Tho Bát Bát Xí Quách Tôm Càng Tươi",
        "cat": "noodles",
        "tags": [
          "#Hủ_tiếu_Mỹ_Tho",
          "#Xí_quách_ngọt_tủy",
          "#Đậm_đà"
        ],
        "price": "45.000đ - 75.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Hủ Tiếu Quần Ký - 43 Trưng Trắc, TP. Mỹ Tho",
        "lat": 10.354,
        "lng": 106.365,
        "latitude": 10.354,
        "longitude": 106.365
      }
    ]
  },
  {
    "cityId": "bentre",
    "city": "Bến Tre (Kiến Hòa cũ)",
    "shortName": "Bến Tre",
    "oldName": "Kiến Hòa cũ",
    "province": "Bến Tre",
    "region": "Miền Tây",
    "address": "Đồng Khởi, Bến Tre",
    "temp": "29°C",
    "condition": "Gió rặng dừa xanh",
    "icon": "🥥",
    "lat": 10.2415,
    "lng": 106.3759,
    "signature": "Cơm dừa Bến Tre tép rang nước cốt dừa, gỏi củ hũ dừa tôm thịt, chuối đập",
    "specialties": [
      {
        "name": "Cơm Trái Dừa Tép Bạc Rang & Gỏi Củ Hũ Dừa",
        "cat": "comfort",
        "tags": [
          "#Cơm_dừa_Bến_Tre",
          "#Củ_hũ_dừa",
          "#Béo_ngậy"
        ],
        "price": "80.000đ - 180.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Nhà Hàng Nổi Bến Tre - Công Viên Hùng Vương",
        "lat": 10.237,
        "lng": 106.378,
        "latitude": 10.237,
        "longitude": 106.378
      }
    ]
  },
  {
    "cityId": "vinhlong",
    "city": "Vĩnh Long (Cửu Long cũ)",
    "shortName": "Vĩnh Long",
    "oldName": "Cửu Long cũ",
    "province": "Vĩnh Long",
    "region": "Miền Tây",
    "address": "Trưng Nữ Vương, Vĩnh Long",
    "temp": "30°C",
    "condition": "Nắng ấm miệt vườn",
    "icon": "🍊",
    "lat": 10.2537,
    "lng": 105.9722,
    "signature": "Cá tai tượng chiên xù xối mỡ cuốn bánh tráng, khoai lang mắm sống",
    "specialties": [
      {
        "name": "Cá Tai Tượng Chiên Xù Giòn Rụm Xối Mỡ Hành",
        "cat": "seafood",
        "tags": [
          "#Cá_tai_tượng",
          "#Giòn_rụm",
          "#Cuốn_bánh_tráng"
        ],
        "price": "160.000đ - 260.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Khu Du Lịch Cù Lao An Bình - Long Hồ, Vĩnh Long",
        "lat": 10.265,
        "lng": 105.982,
        "latitude": 10.265,
        "longitude": 105.982
      }
    ]
  },
  {
    "cityId": "travinh",
    "city": "Trà Vinh (Cửu Long cũ)",
    "shortName": "Trà Vinh",
    "oldName": "Cửu Long cũ",
    "province": "Trà Vinh",
    "region": "Miền Tây",
    "address": "Điện Biên Phủ, Trà Vinh",
    "temp": "30°C",
    "condition": "Nắng dịu",
    "icon": "🏮",
    "lat": 9.9348,
    "lng": 106.3455,
    "signature": "Bún nước lèo Trà Vinh đậm vị mắm bò hóc, bánh canh Bến Có",
    "specialties": [
      {
        "name": "Tô Bún Nước Lèo Trà Vinh Mắm Bò Hóc & Heo Quay",
        "cat": "noodles",
        "tags": [
          "#Bún_nước_lèo",
          "#Mắm_bò_hóc",
          "#Đậm_đà"
        ],
        "price": "35.000đ - 55.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Bún Nước Lèo Cây Đa - Đồng Khởi, TP. Trà Vinh",
        "lat": 9.938,
        "lng": 106.342,
        "latitude": 9.938,
        "longitude": 106.342
      }
    ]
  },
  {
    "cityId": "haugiang",
    "city": "Hậu Giang (Cần Thơ cũ)",
    "shortName": "Hậu Giang",
    "oldName": "Cần Thơ cũ",
    "province": "Hậu Giang",
    "region": "Miền Tây",
    "address": "Vị Thanh, Hậu Giang",
    "temp": "30°C",
    "condition": "Mát mẻ sông rạch",
    "icon": "🍍",
    "lat": 9.7844,
    "lng": 105.4701,
    "signature": "Khóm Cầu Đúc chua ngọt, cá thát lát rút xương chiên giòn thì là",
    "specialties": [
      {
        "name": "Cá Thát Lát Rút Xương Chiên Giòn Cầu Đúc",
        "cat": "seafood",
        "tags": [
          "#Cá_thát_lát",
          "#Thịt_dai_giòn",
          "#Đậm_vị"
        ],
        "price": "120.000đ - 190.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Nhà Hàng Huy Hoàng - 29 Trần Hưng Đạo, Vị Thanh",
        "lat": 9.782,
        "lng": 105.468,
        "latitude": 9.782,
        "longitude": 105.468
      }
    ]
  },
  {
    "cityId": "soctrang",
    "city": "Sóc Trăng (Hậu Giang cũ)",
    "shortName": "Sóc Trăng",
    "oldName": "Hậu Giang cũ",
    "province": "Sóc Trăng",
    "region": "Miền Tây",
    "address": "Lê Hồng Phong, TP. Sóc Trăng",
    "temp": "30°C",
    "condition": "Nắng chan hòa",
    "icon": "🥮",
    "lat": 9.6033,
    "lng": 105.98,
    "signature": "Bún nước lèo Cây Nhãn cá lóc đồng, bánh pía trứng muối sầu riêng",
    "specialties": [
      {
        "name": "Bún Nước Lèo Sóc Trăng Cá Lóc & Bánh Cống Giòn",
        "cat": "noodles",
        "tags": [
          "#Bún_nước_lèo_Sóc_Trăng",
          "#Cá_lóc_đồng",
          "#Ngọt_thanh"
        ],
        "price": "35.000đ - 55.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Bún Nước Lèo Cây Nhãn - Võ Đình Sâm, TP. Sóc Trăng",
        "lat": 9.599,
        "lng": 105.975,
        "latitude": 9.599,
        "longitude": 105.975
      }
    ]
  },
  {
    "cityId": "baclieu",
    "city": "Bạc Liêu (Minh Hải cũ)",
    "shortName": "Bạc Liêu",
    "oldName": "Minh Hải cũ",
    "province": "Bạc Liêu",
    "region": "Miền Tây",
    "address": "Trần Phú, TP. Bạc Liêu",
    "temp": "30°C",
    "condition": "Gió biển mặn mòi",
    "icon": "🎸",
    "lat": 9.2941,
    "lng": 105.7278,
    "signature": "Lẩu mắm Công Tử Bạc Liêu, bánh tằm Ngan Dừa bì xíu mại, bún nước lèo",
    "specialties": [
      {
        "name": "Bánh Tằm Ngan Dừa Bì Sợi & Xíu Mại Béo Ngậy",
        "cat": "streetfood",
        "tags": [
          "#Bánh_tằm_Ngan_Dừa",
          "#Nước_cốt_dừa",
          "#Xíu_mại"
        ],
        "price": "30.000đ - 50.000đ",
        "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "rest": "Bánh Tằm Cô Nhãn - Lê Duẩn, TP. Bạc Liêu",
        "lat": 9.289,
        "lng": 105.725,
        "latitude": 9.289,
        "longitude": 105.725
      }
    ]
  },
  {
    "cityId": "camau",
    "city": "Cà Mau (Minh Hải cũ)",
    "shortName": "Cà Mau",
    "oldName": "Minh Hải cũ",
    "province": "Cà Mau",
    "region": "Miền Tây",
    "address": "Đất Mũi, Cà Mau",
    "temp": "30°C",
    "condition": "Gió mũi Cà Mau lồng lộng",
    "icon": "🦀",
    "lat": 9.1769,
    "lng": 105.1524,
    "signature": "Cua biển Cà Mau hấp gừng bia, ba khía Rạch Gốc muối cay, tôm nướng muối ớt",
    "specialties": [
      {
        "name": "Cua Biển Cà Mau Hấp Bia Thịt Chắc Ngọt Chấm Muối Tiêu",
        "cat": "seafood",
        "tags": [
          "#Cua_Cà_Mau",
          "#Thịt_chắc_ngọt",
          "#Gạch_son"
        ],
        "price": "280.000đ - 450.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "rest": "Quán Cua Thứ Thiệt - 57 Ngô Gia Tự, TP. Cà Mau",
        "lat": 9.182,
        "lng": 105.158,
        "latitude": 9.182,
        "longitude": 105.158
      },
      {
        "name": "Ba Khía Rạch Gốc Muối Tỏi Ớt Cay Nồng",
        "cat": "streetfood",
        "tags": [
          "#Ba_khía_Rạch_Gốc",
          "#Cay_nồng",
          "#Đậm_đà"
        ],
        "price": "60.000đ - 110.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "rest": "Đặc Sản Rạch Gốc - Đất Mũi, Ngọc Hiển",
        "lat": 8.618,
        "lng": 104.912,
        "latitude": 8.618,
        "longitude": 104.912
      }
    ]
  },
  {
    "cityId": "phuquoc",
    "city": "Kiên Giang (Rạch Giá & Phú Quốc)",
    "shortName": "Kiên Giang (Phú Quốc)",
    "oldName": "Kiên Giang",
    "province": "Kiên Giang",
    "region": "Miền Tây",
    "address": "Dương Đông, Phú Quốc",
    "temp": "29°C",
    "condition": "Nắng biển đảo ấm áp",
    "icon": "🏝️",
    "lat": 10.2205,
    "lng": 103.958,
    "signature": "Bún quậy Kiến Xây, gỏi cá trích đảo ngọc, ghẹ Hàm Ninh hấp",
    "specialties": [
      {
        "name": "Bún Quậy Kiến Xây & Gỏi Cá Trích Đảo Ngọc",
        "cat": "noodles",
        "tags": [
          "#Bún_quậy",
          "#Chả_tôm_mực_tươi",
          "#Đảo_Ngọc"
        ],
        "price": "55.000đ - 90.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "rest": "Bún Quậy Kiến Xây - 28 Bạch Đằng, Phú Quốc",
        "lat": 10.218,
        "lng": 103.959,
        "latitude": 10.218,
        "longitude": 103.959
      }
    ]
  },
  {
    "cityId": "longan",
    "city": "Long An (Tân An)",
    "shortName": "Long An",
    "oldName": "Long An",
    "province": "Long An",
    "region": "Miền Tây",
    "address": "Hùng Vương, TP. Tân An",
    "temp": "31°C",
    "condition": "Nắng dịu",
    "icon": "🌾",
    "lat": 10.5367,
    "lng": 106.4114,
    "signature": "Lẩu mắm Cần Giuộc, bánh tét Ba Khánh Bến Lức, dưa hấu Long Trì",
    "specialties": [
      {
        "name": "Bánh Tét Ba Khánh Nhân Thịt Trứng Muối & Lẩu Mắm",
        "cat": "comfort",
        "tags": [
          "#Bánh_tét_Bến_Lức",
          "#Lẩu_mắm_Cần_Giuộc",
          "#Đậm_đà"
        ],
        "price": "60.000đ - 160.000đ",
        "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
        "rest": "Bánh Tét Bến Lức - QL1A, Bến Lức, Long An",
        "lat": 10.635,
        "lng": 106.489,
        "latitude": 10.635,
        "longitude": 106.489
      }
    ]
  }
],

  districtOptions: [
  {
    "cityId": "daklak_buonho",
    "city": "Thị xã Buôn Hồ (Đắk Lắk)",
    "shortName": "Buôn Hồ",
    "parentProvince": "Đắk Lắk",
    "region": "Tây Nguyên",
    "address": "TX. Buôn Hồ, Đắk Lắk",
    "temp": "23°C",
    "condition": "Mát dịu đất đỏ",
    "icon": "☕",
    "lat": 12.9167,
    "lng": 108.2667,
    "isDistrict": true,
    "signature": "Bún chìa Buôn Hồ, bò một nắng than hoa, gà nướng cơm lam, cà phê đất đỏ",
    "specialties": [
      {
        "name": "Bún Chìa Buôn Hồ (Bún Giò Heo Nước Dùng Xương Hầm)",
        "rest": "Quán Bún Chìa Cô Ba Buôn Hồ - 124 Hùng Vương, TX. Buôn Hồ",
        "cat": "noodles",
        "tags": [
          "#Bún_chìa",
          "#TX_Buôn_Hồ",
          "#Đậm_đà",
          "#Nóng_hổi"
        ],
        "price": "45.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Bát bún chìa giò heo to bự nghi ngút khói, nước dùng hầm xương ngọt thanh đậm đà thơm ngậy mùi sả ớt đặc sản Buôn Hồ.",
        "lat": 12.928,
        "lng": 108.272,
        "latitude": 12.928,
        "longitude": 108.272
      },
      {
        "name": "Bò Một Nắng & Gà Nướng Cơm Lam Bazan Buôn Hồ",
        "rest": "Quán Bazan Buôn Hồ - 45 Trần Hưng Đạo, TX. Buôn Hồ",
        "cat": "bbq",
        "tags": [
          "#Bò_nướng_than",
          "#Gà_nướng_cơm_lam",
          "#Đất_đỏ_Bazan",
          "#Xì_xèo"
        ],
        "price": "180.000đ - 320.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Thịt bò nướng than hoa chấm muối kiến vàng Krông Pa chua cay xé lưỡi, kèm ống cơm lam nướng giòn rụm bên sườn đồi Buôn Hồ.",
        "lat": 12.924,
        "lng": 108.268,
        "latitude": 12.924,
        "longitude": 108.268
      },
      {
        "name": "Lẩu Bò Nhúng Me & Lẩu Bò Đất Đỏ Buôn Hồ",
        "rest": "Lẩu Bò Cây Me - 89 Nguyễn Tất Thành, TX. Buôn Hồ",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_bò_nhúng_me",
          "#TX_Buôn_Hồ",
          "#Xả_stress",
          "#Ấm_áp"
        ],
        "price": "180.000đ - 350.000đ",
        "img": "images/lau_bo_ba_toa.jpg",
        "reason": "Nồi lẩu chua chua cay cay thơm nức mùi sốt me tươi, thịt bò tơ mềm ngọt nhúng cùng rau ngải cứu và nấm rừng giải tỏa mọi căng thẳng.",
        "lat": 12.931,
        "lng": 108.275,
        "latitude": 12.931,
        "longitude": 108.275
      },
      {
        "name": "Cà Phê Mộc Bazan & Bánh Nướng Buôn Hồ",
        "rest": "The Highland Buôn Hồ - 12 Quang Trung, TX. Buôn Hồ",
        "cat": "cafe",
        "tags": [
          "#Cà_phê_Buôn_Hồ",
          "#Chill_phố_núi",
          "#Đồ_ngọt"
        ],
        "price": "25.000đ - 50.000đ",
        "img": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
        "reason": "Hạt cà phê Robusta Buôn Hồ nguyên chất thơm ngạt ngào, nhâm nhi cùng bánh sừng bò nướng nóng hổi ngắm phố núi mộng mơ.",
        "lat": 12.926,
        "lng": 108.27,
        "latitude": 12.926,
        "longitude": 108.27
      }
    ]
  },
  {
    "cityId": "daklak_bmt",
    "city": "TP. Buôn Ma Thuột (Đắk Lắk)",
    "shortName": "Buôn Ma Thuột",
    "parentProvince": "Đắk Lắk",
    "region": "Tây Nguyên",
    "address": "Lê Thánh Tông, TP. Buôn Ma Thuột",
    "temp": "23°C",
    "condition": "Nắng gió đất đỏ",
    "icon": "☕",
    "lat": 12.6662,
    "lng": 108.0383,
    "isDistrict": true,
    "signature": "Bún đỏ Ban Mê, bò nhúng me Cà Te, lẩu cá lăng sông Sêrêpôk",
    "specialties": [
      {
        "name": "Tô Bún Đỏ Buôn Ma Thuột Nóng Hổi Trứng Cút",
        "rest": "Bún Đỏ Thu - Góc Lê Hồng Phong, TP. Buôn Ma Thuột",
        "cat": "noodles",
        "tags": [
          "#Bún_đỏ_Ban_Mê",
          "#Nước_dùng_huyết",
          "#Ấm_áp"
        ],
        "price": "35.000đ - 50.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Tô bún đỏ rực màu hạt điều, trứng cút bùi béo và gạch cua đậm đà nức mũi.",
        "lat": 12.678,
        "lng": 108.041,
        "latitude": 12.678,
        "longitude": 108.041
      },
      {
        "name": "Bò Nhúng Me Cà Te Quán Xì Xèo Bánh Mì",
        "rest": "Cà Te Quán - 140 Lê Thánh Tông, Buôn Ma Thuột",
        "cat": "bbq",
        "tags": [
          "#Bò_nhúng_me",
          "#Sốt_me_chua_ngọt",
          "#Xì_xèo"
        ],
        "price": "120.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Thịt bò tươi mềm xèo trên chảo me sôi sùng sục, bánh mì chấm sốt me bơ ngậy ngất ngây.",
        "lat": 12.682,
        "lng": 108.046,
        "latitude": 12.682,
        "longitude": 108.046
      }
    ]
  },
  {
    "cityId": "daklak_cumgar",
    "city": "Huyện Cư M'gar (Đắk Lắk)",
    "shortName": "Cư M'gar",
    "parentProvince": "Đắk Lắk",
    "region": "Tây Nguyên",
    "address": "Quảng Phú, Huyện Cư M'gar",
    "temp": "23°C",
    "condition": "Mát rượi rẫy cà phê",
    "icon": "☕",
    "lat": 13.0167,
    "lng": 108.0833,
    "isDistrict": true,
    "signature": "Cà phê Robusta thơm nồng, cơm lam gà đồi nướng than, cá suối",
    "specialties": [
      {
        "name": "Gà Đồi Nướng Than Cư M'gar & Cơm Lam Ống Nứa",
        "rest": "Gà Nướng Đồi Cư M'gar - TT. Quảng Phú, Cư M'gar",
        "cat": "bbq",
        "tags": [
          "#Gà_đồi_Cư_Mgar",
          "#Cơm_lam",
          "#Nướng_than"
        ],
        "price": "180.000đ - 300.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "reason": "Gà thả vườn thịt chắc thơm nướng vàng giòn, chấm chén muối ớt xanh cay xé lưỡi.",
        "lat": 12.825,
        "lng": 108.082,
        "latitude": 12.825,
        "longitude": 108.082
      }
    ]
  },
  {
    "cityId": "daklak_lak",
    "city": "Huyện Lắk (Đắk Lắk)",
    "shortName": "Huyện Lắk",
    "parentProvince": "Đắk Lắk",
    "region": "Tây Nguyên",
    "address": "Liên Sơn, Huyện Lắk",
    "temp": "22°C",
    "condition": "Gió hồ trên núi",
    "icon": "🚣",
    "lat": 12.4167,
    "lng": 108.1833,
    "isDistrict": true,
    "signature": "Chả cá thát lát hồ Lắk chiên giòn, lẩu cá bống hồ Lắk, cơm lam",
    "specialties": [
      {
        "name": "Chả Cá Thát Lát Hồ Lắk Chiên Phồng Giòn Dai",
        "rest": "Nhà Hàng Hồ Lắk - TT. Liên Sơn, Huyện Lắk",
        "cat": "seafood",
        "tags": [
          "#Cá_thát_lát_hồ_Lắk",
          "#Dai_giòn",
          "#Đậm_đà"
        ],
        "price": "100.000đ - 180.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Cá thát lát tự nhiên từ lòng hồ Lắk quết tay dai giòn sần sật chiên vàng thơm ngậy.",
        "lat": 12.415,
        "lng": 108.185,
        "latitude": 12.415,
        "longitude": 108.185
      }
    ]
  },
  {
    "cityId": "lamdong_dalat",
    "city": "TP. Đà Lạt (Lâm Đồng)",
    "shortName": "Đà Lạt",
    "parentProvince": "Lâm Đồng",
    "region": "Tây Nguyên",
    "address": "Khu Hòa Bình, TP. Đà Lạt",
    "temp": "16°C",
    "condition": "Sương mù se lạnh",
    "icon": "🌲",
    "lat": 11.9404,
    "lng": 108.4583,
    "isDistrict": true,
    "signature": "Lẩu gà lá é Tao Ngộ, lẩu bò Ba Toa, bánh căn Lệ",
    "specialties": [
      {
        "name": "Lẩu Gà Lá É Tao Ngộ Ấm Áp Đà Lạt",
        "rest": "Lẩu Gà Lá É Tao Ngộ - 05 Ba Tháng Tư, Đà Lạt",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_gà_lá_é",
          "#Ấm_áp_Đà_Lạt",
          "#Cay_thơm"
        ],
        "price": "200.000đ - 350.000đ",
        "img": "images/lau_ga_la_e_da_lat.jpg",
        "reason": "Hợp gu vì bạn thích lẩu nóng hổi xua tan tiết trời se lạnh sương mù Đà Lạt.",
        "lat": 11.932,
        "lng": 108.448,
        "latitude": 11.932,
        "longitude": 108.448
      }
    ]
  },
  {
    "cityId": "lamdong_baoloc",
    "city": "TP. Bảo Lộc (Lâm Đồng)",
    "shortName": "Bảo Lộc",
    "parentProvince": "Lâm Đồng",
    "region": "Tây Nguyên",
    "address": "Trần Phú, TP. Bảo Lộc",
    "temp": "19°C",
    "condition": "Mát mẻ hương trà",
    "icon": "🍵",
    "lat": 11.5478,
    "lng": 107.808,
    "isDistrict": true,
    "signature": "Trà B'lao ướp hoa sói hoa lài, phở khô Bảo Lộc, bò nướng đá",
    "specialties": [
      {
        "name": "Phở Khô Trộn Sốt Tương Đậm Đà & Trà B'lao Bảo Lộc",
        "rest": "Phở Khô Hào Phát - 42 Hà Giang, TP. Bảo Lộc",
        "cat": "noodles",
        "tags": [
          "#Phở_khô_Bảo_Lộc",
          "#Trà_Blao",
          "#Đậm_đà"
        ],
        "price": "40.000đ - 65.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Sợi phở khô dai giòn trộn tương thơm lừng cùng chén nước súp xương bò thanh ngọt.",
        "lat": 11.542,
        "lng": 107.808,
        "latitude": 11.542,
        "longitude": 107.808
      }
    ]
  },
  {
    "cityId": "lamdong_lacduong",
    "city": "Huyện Lạc Dương (Langbiang, Lâm Đồng)",
    "shortName": "Lạc Dương (Langbiang)",
    "parentProvince": "Lâm Đồng",
    "region": "Tây Nguyên",
    "address": "Chân núi Langbiang, Lạc Dương",
    "temp": "15°C",
    "condition": "Gió núi se lạnh",
    "icon": "⛰️",
    "lat": 12.0333,
    "lng": 108.4333,
    "isDistrict": true,
    "signature": "Thịt heo rừng nướng xiên Langbiang, rau rừng xào tỏi, rượu cần K'Ho",
    "specialties": [
      {
        "name": "Thịt Heo Rừng Nướng Ống Tre Chân Núi Langbiang",
        "rest": "Nhà Hàng Thung Lũng Trăm Năm - Lạc Dương, Lâm Đồng",
        "cat": "bbq",
        "tags": [
          "#Heo_rừng_Langbiang",
          "#Nướng_ống_tre",
          "#Ấm_áp"
        ],
        "price": "150.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Thịt rừng tẩm ướp hạt mắc mật nướng lửa hồng rực rỡ ngắm đỉnh núi mù sương.",
        "lat": 12.045,
        "lng": 108.428,
        "latitude": 12.045,
        "longitude": 108.428
      }
    ]
  },
  {
    "cityId": "gialai_pleiku",
    "city": "TP. Pleiku (Gia Lai)",
    "shortName": "Pleiku",
    "parentProvince": "Gia Lai",
    "region": "Tây Nguyên",
    "address": "Nguyễn Du, TP. Pleiku",
    "temp": "22°C",
    "condition": "Mát mẻ phố núi",
    "icon": "🌲",
    "lat": 13.9833,
    "lng": 108,
    "isDistrict": true,
    "signature": "Phở khô hai tô Phở Nữ, bún cua thối Chợ Nhỏ, bò một nắng Krông Pa",
    "specialties": [
      {
        "name": "Phở Khô Hai Tô Gia Lai (Tô Khô Tô Nước) Phở Nữ",
        "rest": "Phở Khô Nữ Pleiku - 50 Nguyễn Du, TP. Pleiku",
        "cat": "noodles",
        "tags": [
          "#Phở_hai_tô",
          "#Tương_nâu",
          "#Phố_núi"
        ],
        "price": "40.000đ - 65.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Đặc sản nức tiếng với 1 tô khô trộn tương nâu gia truyền và 1 tô nước hầm xương bò nóng hổi.",
        "lat": 13.9806,
        "lng": 107.9958,
        "latitude": 13.9806,
        "longitude": 107.9958
      }
    ]
  },
  {
    "cityId": "gialai_ankhe",
    "city": "Thị xã An Khê (Gia Lai)",
    "shortName": "An Khê",
    "parentProvince": "Gia Lai",
    "region": "Tây Nguyên",
    "address": "Quang Trung, TX. An Khê",
    "temp": "23°C",
    "condition": "Nắng nhẹ",
    "icon": "🌾",
    "lat": 13.9744,
    "lng": 108.6478,
    "isDistrict": true,
    "signature": "Bánh tráng cuốn thịt heo luộc An Khê, lẩu cá lăng sông Ba, gà đồi",
    "specialties": [
      {
        "name": "Bánh Tráng Cuốn Thịt Heo & Lẩu Cá Sông Ba An Khê",
        "rest": "Quán Ăn Sông Ba - Đỗ Trạc, TX. An Khê",
        "cat": "hotpot",
        "tags": [
          "#Bánh_tráng_An_Khê",
          "#Lẩu_cá_sông_Ba",
          "#Đậm_đà"
        ],
        "price": "120.000đ - 250.000đ",
        "img": "images/lau_ca_tam_sapa.jpg",
        "reason": "Đặc sản vùng đất Tây Sơn Thượng Đạo với nước chấm mắm nêm đậm vị dân dã.",
        "lat": 13.972,
        "lng": 108.648,
        "latitude": 13.972,
        "longitude": 108.648
      }
    ]
  },
  {
    "cityId": "gialai_krongpa",
    "city": "Huyện Krông Pa (Gia Lai)",
    "shortName": "Krông Pa",
    "parentProvince": "Gia Lai",
    "region": "Tây Nguyên",
    "address": "Phú Túc, Huyện Krông Pa",
    "temp": "25°C",
    "condition": "Nắng chảo lửa ấm áp",
    "icon": "🥩",
    "lat": 13.25,
    "lng": 108.6667,
    "isDistrict": true,
    "signature": "Bò một nắng nướng than chấm muối kiến vàng rừng le nguyên chất",
    "specialties": [
      {
        "name": "Bò Một Nắng Krông Pa Nướng Than Muối Kiến Vàng Rừng",
        "rest": "Bò Một Nắng Chính Hiệu - TT. Phú Túc, Krông Pa",
        "cat": "bbq",
        "tags": [
          "#Bò_một_nắng",
          "#Muối_kiến_vàng",
          "#Chua_cay_xé_lưỡi"
        ],
        "price": "160.000đ - 300.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Bò cỏ sấy một nắng giữ trọn thớ thịt ngọt mềm, chấm muối kiến vàng béo chua cay nồng.",
        "lat": 13.185,
        "lng": 108.721,
        "latitude": 13.185,
        "longitude": 108.721
      }
    ]
  },
  {
    "cityId": "binhdinh_quynhon",
    "city": "TP. Quy Nhơn (Bình Định)",
    "shortName": "Quy Nhơn",
    "parentProvince": "Bình Định",
    "region": "Miền Trung",
    "address": "Nguyễn Huệ, TP. Quy Nhơn",
    "temp": "24°C",
    "condition": "Mưa râm ran mát lạnh",
    "icon": "🌧️",
    "lat": 13.7735,
    "lng": 109.2365,
    "isDistrict": true,
    "signature": "Bánh xèo tôm nhảy Gia Vỹ, bún sứa chả cá, lẩu thái tomyum Cô Vy",
    "specialties": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Gia Vỹ",
        "rest": "Bánh Xèo Gia Vỹ 2",
        "address": "14 Diên Hồng, P. Lê Hồng Phong, TP. Quy Nhơn",
        "cat": "streetfood",
        "tags": [
          "#Bánh_xèo_tôm_nhảy",
          "#Vỏ_giòn_tan",
          "#Nóng_hổi"
        ],
        "price": "35.000đ - 60.000đ",
        "img": "images/banh_xeo_tom_nhay.jpg",
        "reason": "Tôm đất còn nhảy tanh tách đúc trên chảo gang giòn rụm cuốn bánh tráng rau mầm.",
        "lat": 13.773073,
        "lng": 109.224855,
        "latitude": 13.773073,
        "longitude": 109.224855
      }
    ]
  },
  {
    "cityId": "binhdinh_tayson",
    "city": "Huyện Tây Sơn (Bình Định)",
    "shortName": "Tây Sơn",
    "parentProvince": "Bình Định",
    "region": "Miền Trung",
    "address": "Phú Phong, Tây Sơn, Bình Định",
    "temp": "24°C",
    "condition": "Nắng ấm đất võ",
    "icon": "🗡️",
    "lat": 13.9272,
    "lng": 108.922,
    "isDistrict": true,
    "signature": "Bánh cuốn Tây Sơn khổng lồ, bò lụi than hồng, chim mía nướng",
    "specialties": [
      {
        "name": "Bánh Cuốn Tây Sơn Cuốn 10 Loại Nhân & Bò Lụi Lửa Hồng",
        "rest": "Bánh Cuốn Tây Sơn Quê Hương - Khối 1, TT. Phú Phong",
        "cat": "streetfood",
        "tags": [
          "#Bánh_cuốn_Tây_Sơn",
          "#Bò_lụi_nướng",
          "#Đậm_đà"
        ],
        "price": "35.000đ - 65.000đ",
        "img": "images/banh_trang_cuon_thit_heo.jpg",
        "reason": "Cuốn bánh to bự bọc chả ram giòn rụm, thịt lụi nướng than và trứng vịt chấm nước mắm đậu phộng béo bùi.",
        "lat": 13.885,
        "lng": 108.972,
        "latitude": 13.885,
        "longitude": 108.972
      }
    ]
  },
  {
    "cityId": "binhdinh_annhon",
    "city": "Thị xã An Nhơn (Bình Định)",
    "shortName": "An Nhơn",
    "parentProvince": "Bình Định",
    "region": "Miền Trung",
    "address": "Đập Đá, TX. An Nhơn",
    "temp": "24°C",
    "condition": "Nắng êm",
    "icon": "🍶",
    "lat": 13.8752,
    "lng": 109.112,
    "isDistrict": true,
    "signature": "Nem Chợ Huyện nướng than, rượu Bàu Đá Đập Đá, bún chả cá",
    "specialties": [
      {
        "name": "Nem Chợ Huyện Nướng Than Chấm Nước Mắm Tỏi Ớt",
        "rest": "Nem Chợ Huyện Bốn Tạo - Phước Lộc, Tuy Phước",
        "cat": "streetfood",
        "tags": [
          "#Nem_Chợ_Huyện",
          "#Nem_nướng_than",
          "#Cay_nồng"
        ],
        "price": "35.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Chiếc nem chua nướng xèo xèo trên than đỏ au thơm nức mùi tiêu sọ chấm nước mắm nhĩ ớt xiêm.",
        "lat": 13.858,
        "lng": 109.182,
        "latitude": 13.858,
        "longitude": 109.182
      }
    ]
  },
  {
    "cityId": "khanhhoa_nhatrang",
    "city": "TP. Nha Trang (Khánh Hòa)",
    "shortName": "Nha Trang",
    "parentProvince": "Khánh Hòa",
    "region": "Miền Trung",
    "address": "Trần Phú, TP. Nha Trang",
    "temp": "27°C",
    "condition": "Nắng gió biển",
    "icon": "🏖️",
    "lat": 12.2388,
    "lng": 109.1967,
    "isDistrict": true,
    "signature": "Hải sản tươi sống bờ kè, nem nướng Đặng Văn Quyên, bún sứa chả cá",
    "specialties": [
      {
        "name": "Hải Sản Tươi Sống Bờ Kè & Nem Nướng Ninh Hòa",
        "rest": "Hải Sản Thanh Sương - 9A Trần Phú, TP. Nha Trang",
        "cat": "seafood",
        "tags": [
          "#Hải_sản_bờ_kè",
          "#Nem_nướng_Nha_Trang",
          "#Tươi_sống"
        ],
        "price": "120.000đ - 350.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Hải sản tươi rói bắt tại bể hấp sả gừng ngọt lịm chấm muối ớt xanh Nha Trang.",
        "lat": 12.215,
        "lng": 109.201,
        "latitude": 12.215,
        "longitude": 109.201
      }
    ]
  },
  {
    "cityId": "khanhhoa_camranh",
    "city": "TP. Cam Ranh (Khánh Hòa)",
    "shortName": "Cam Ranh",
    "parentProvince": "Khánh Hòa",
    "region": "Miền Trung",
    "address": "Nguyễn Tất Thành, TP. Cam Ranh",
    "temp": "27°C",
    "condition": "Gió vịnh Cam Ranh",
    "icon": "🦞",
    "lat": 11.9214,
    "lng": 109.1591,
    "isDistrict": true,
    "signature": "Tôm hùm Bình Ba hấp bia, bánh căn hải sản Cam Ranh, sò huyết Thủy Triều",
    "specialties": [
      {
        "name": "Tôm Hùm Đảo Bình Ba & Bánh Căn Trứng Mực Cam Ranh",
        "rest": "Quán Hải Sản Cầu Mới - Bãi Dài, Cam Lâm, Cam Ranh",
        "cat": "seafood",
        "tags": [
          "#Tôm_hùm_Bình_Ba",
          "#Bánh_căn_Cam_Ranh",
          "#Tươi_sống"
        ],
        "price": "150.000đ - 450.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Tôm hùm thịt chắc nịch gạch son béo ngậy ăn kèm bánh căn nóng hổi giòn rụm bên bờ vịnh.",
        "lat": 12.082,
        "lng": 109.168,
        "latitude": 12.082,
        "longitude": 109.168
      }
    ]
  },
  {
    "cityId": "khanhhoa_ninhhoa",
    "city": "Thị xã Ninh Hòa (Khánh Hòa)",
    "shortName": "Ninh Hòa",
    "parentProvince": "Khánh Hòa",
    "region": "Miền Trung",
    "address": "Trần Quý Cáp, TX. Ninh Hòa",
    "temp": "27°C",
    "condition": "Nắng ấm",
    "icon": "🍢",
    "lat": 12.4939,
    "lng": 109.1278,
    "isDistrict": true,
    "signature": "Nem nướng Ninh Hòa chính gốc chấm nước sốt tương thịt nạc băm, nem chua",
    "specialties": [
      {
        "name": "Nem Nướng Ninh Hòa Chính Gốc Nước Sốt Tương Nếp",
        "rest": "Nem Nướng Đặng Văn Quyên Chính Gốc - Lê Lợi, Ninh Hòa",
        "cat": "bbq",
        "tags": [
          "#Nem_nướng_Ninh_Hòa",
          "#Nước_sốt_tương_thịt",
          "#Cuốn_bánh_tráng"
        ],
        "price": "45.000đ - 85.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Cây nem nướng thơm lừng quết dẻo dai cuốn kèm bánh tráng giòn, xoài xanh và nước chấm tương nếp gia truyền.",
        "lat": 12.495,
        "lng": 109.128,
        "latitude": 12.495,
        "longitude": 109.128
      }
    ]
  },
  {
    "cityId": "quangnam_hoian",
    "city": "TP. Hội An (Quảng Nam)",
    "shortName": "Hội An",
    "parentProvince": "Quảng Nam",
    "region": "Miền Trung",
    "address": "Phố Cổ Hội An, Quảng Nam",
    "temp": "25°C",
    "condition": "Nắng vàng phố cổ",
    "icon": "🏮",
    "lat": 15.8801,
    "lng": 108.338,
    "isDistrict": true,
    "signature": "Cao lầu Hội An, cơm gà bà Buội, bánh mì Phượng, chè bắp",
    "specialties": [
      {
        "name": "Cao Lầu Hội An Nước Giếng Bá Lễ & Cơm Gà Bà Buội",
        "rest": "Cao Lầu Thanh - 26 Thái Phiên, Phố Cổ Hội An",
        "cat": "noodles",
        "tags": [
          "#Cao_lầu_Hội_An",
          "#Bá_Lễ",
          "#Đậm_đà"
        ],
        "price": "40.000đ - 70.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Sợi mì cao lầu màu vàng óng ngâm tro củi cù lao, xá xíu thơm lừng giòn rụm tóp mỡ.",
        "lat": 15.881693,
        "lng": 108.328508,
        "latitude": 15.881693,
        "longitude": 108.328508
      }
    ]
  },
  {
    "cityId": "quangnam_dienban",
    "city": "Thị xã Điện Bàn (Quảng Nam)",
    "shortName": "Điện Bàn (Cầu Mống)",
    "parentProvince": "Quảng Nam",
    "region": "Miền Trung",
    "address": "Cầu Mống, TX. Điện Bàn",
    "temp": "25°C",
    "condition": "Nắng nhẹ",
    "icon": "🥩",
    "lat": 15.892,
    "lng": 108.248,
    "isDistrict": true,
    "signature": "Bê thui Cầu Mống chính gốc hai tầng da, mì Quảng Phú Chiêm",
    "specialties": [
      {
        "name": "Bê Thui Cầu Mống Mười Hiển Chấm Mắm Nêm Cá Cơm",
        "rest": "Bê Thui Mười Hiển - QL1A, Điện Phương, Điện Bàn",
        "cat": "bbq",
        "tags": [
          "#Bê_thui_Cầu_Mống",
          "#Mắm_nêm_cá_cơm",
          "#Hai_tầng_da"
        ],
        "price": "100.000đ - 180.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Thịt bê thui chín tái hồng hào mềm ngọt, lớp da vàng giòn sần sật cuốn rau sống chấm mắm nêm đậm đà.",
        "lat": 15.892,
        "lng": 108.245,
        "latitude": 15.892,
        "longitude": 108.245
      }
    ]
  },
  {
    "cityId": "laocai_sapa",
    "city": "Thị xã Sa Pa (Lào Cai)",
    "shortName": "Sa Pa",
    "parentProvince": "Lào Cai",
    "region": "Miền Bắc",
    "address": "Xuân Viên, TX. Sa Pa",
    "temp": "13°C",
    "condition": "Rét lạnh sương mù",
    "icon": "🏔️",
    "lat": 22.3364,
    "lng": 103.8438,
    "isDistrict": true,
    "signature": "Lẩu cá tầm Tây Bắc, lẩu cá hồi măng chua, lợn cắp nách quay",
    "specialties": [
      {
        "name": "Nồi Lẩu Cá Tầm & Thắng Cố Nóng Hổi Sa Pa",
        "rest": "Lẩu Cá Tầm Hotpot Sa Pa - 71 Xuân Viên, TX. Sa Pa",
        "cat": "hotpot",
        "tags": [
          "#Lẩu_cá_tầm",
          "#Trời_rét_Sa_Pa",
          "#Ấm_áp"
        ],
        "price": "350.000đ - 580.000đ",
        "img": "images/lau_ca_tam_sapa.jpg",
        "reason": "Giữa tiết trời Sa Pa rét buốt, ngồi quây quần bên nồi lẩu cá tầm măng cay nóng hổi là chân ái.",
        "lat": 22.3355,
        "lng": 103.8425,
        "latitude": 22.3355,
        "longitude": 103.8425
      }
    ]
  },
  {
    "cityId": "sonla_mocchau",
    "city": "Huyện Mộc Châu (Sơn La)",
    "shortName": "Mộc Châu",
    "parentProvince": "Sơn La",
    "region": "Miền Bắc",
    "address": "Thảo Nguyên Mộc Châu, Sơn La",
    "temp": "15°C",
    "condition": "Se lạnh thảo nguyên",
    "icon": "🍓",
    "lat": 20.8409,
    "lng": 104.6644,
    "isDistrict": true,
    "signature": "Bê chao Mộc Châu thơm mềm, cá suối chiên giòn, sữa chua nếp cẩm",
    "specialties": [
      {
        "name": "Bê Chao Mộc Châu Nóng Hổi & Cá Suối Nướng Gừng",
        "rest": "Nhà Hàng 64 Mộc Châu - Tiểu Khu Chiềng Đi",
        "cat": "bbq",
        "tags": [
          "#Bê_chao_Mộc_Châu",
          "#Thịt_mềm_ngọt",
          "#Ấm_áp"
        ],
        "price": "120.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Từng miếng thịt bê tơ chao qua dầu sôi nóng hổi chấm nước tương gừng Cố Đô béo ngọt khó cưỡng.",
        "lat": 20.865,
        "lng": 104.721,
        "latitude": 20.865,
        "longitude": 104.721
      }
    ]
  },
  {
    "cityId": "vungtau_condao",
    "city": "Huyện Côn Đảo (Bà Rịa - Vũng Tàu)",
    "shortName": "Côn Đảo",
    "parentProvince": "Bà Rịa - Vũng Tàu",
    "region": "Đông Nam Bộ",
    "address": "Đường Tôn Đức Thắng, Côn Đảo",
    "temp": "28°C",
    "condition": "Gió biển đảo lộng lẫy",
    "icon": "🏝️",
    "lat": 8.6833,
    "lng": 106.6,
    "isDistrict": true,
    "signature": "Ốc vú nàng nướng mỡ hành, cua mặt trăng Côn Đảo, cháo hàu nóng",
    "specialties": [
      {
        "name": "Ốc Vú Nàng Nướng Mỡ Hành & Cua Mặt Trăng Hấp Bia",
        "rest": "Quán Ăn Hải Sản Tri Kỷ - Nguyễn Đức Thuận, Côn Đảo",
        "cat": "seafood",
        "tags": [
          "#Ốc_vú_nàng",
          "#Cua_mặt_trăng",
          "#Côn_Đảo"
        ],
        "price": "150.000đ - 350.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Hải sản tươi sống đánh bắt trong ngày tại ngư trường Côn Đảo ngọt lịm chấm muối tiêu chanh.",
        "lat": 8.685,
        "lng": 106.608,
        "latitude": 8.685,
        "longitude": 106.608
      }
    ]
  },
  {
    "cityId": "vungtau_xuyenmoc",
    "city": "Huyện Xuyên Mộc (Hồ Tràm, Vũng Tàu)",
    "shortName": "Hồ Tràm (Xuyên Mộc)",
    "parentProvince": "Bà Rịa - Vũng Tàu",
    "region": "Đông Nam Bộ",
    "address": "Bãi biển Hồ Tràm, Xuyên Mộc",
    "temp": "29°C",
    "condition": "Nắng gió biển Hồ Tràm",
    "icon": "🏖️",
    "lat": 10.4833,
    "lng": 107.45,
    "isDistrict": true,
    "signature": "Hải sản tươi chợ Lưới Hồ Tràm nướng muối ớt, lẩu cá bớp măng chua",
    "specialties": [
      {
        "name": "Mực Trứng Nướng Muối Ớt Chợ Lưới Hồ Tràm",
        "rest": "Chợ Hải Sản Bờ Biển Hồ Tràm - Phước Thuận, Xuyên Mộc",
        "cat": "seafood",
        "tags": [
          "#Hải_sản_Hồ_Tràm",
          "#Mực_trứng_nướng",
          "#Tươi_sống"
        ],
        "price": "120.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Mực tươi rói vớt từ thuyền thúng nướng than ngay trên bãi cát chấm muối ớt xanh thơm lừng.",
        "lat": 10.468,
        "lng": 107.458,
        "latitude": 10.468,
        "longitude": 107.458
      }
    ]
  },
  {
    "cityId": "kiengiang_phuquoc",
    "city": "TP. Phú Quốc (Kiên Giang)",
    "shortName": "Phú Quốc",
    "parentProvince": "Kiên Giang",
    "region": "Miền Tây",
    "address": "Dương Đông, TP. Phú Quốc",
    "temp": "29°C",
    "condition": "Nắng ấm đảo ngọc",
    "icon": "🏝️",
    "lat": 10.2205,
    "lng": 103.958,
    "isDistrict": true,
    "signature": "Bún quậy Kiến Xây, gỏi cá trích đảo ngọc, ghẹ Hàm Ninh hấp bia",
    "specialties": [
      {
        "name": "Bún Quậy Kiến Xây & Gỏi Cá Trích Đảo Ngọc",
        "rest": "Bún Quậy Kiến Xây - 28 Bạch Đằng, Phú Quốc",
        "cat": "noodles",
        "tags": [
          "#Bún_quậy",
          "#Chả_tôm_mực_tươi",
          "#Đảo_Ngọc"
        ],
        "price": "55.000đ - 90.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Trải nghiệm tự tay pha nước chấm theo gu, sợi bún tươi quết cùng chả mực giòn ngọt.",
        "lat": 10.218,
        "lng": 103.959,
        "latitude": 10.218,
        "longitude": 103.959
      }
    ]
  },
  {
    "cityId": "kiengiang_hatien",
    "city": "TP. Hà Tiên (Kiên Giang)",
    "shortName": "Hà Tiên",
    "parentProvince": "Kiên Giang",
    "region": "Miền Tây",
    "address": "Bạch Đằng, TP. Hà Tiên",
    "temp": "29°C",
    "condition": "Gió biển biên giới",
    "icon": "🌴",
    "lat": 10.3833,
    "lng": 104.4833,
    "isDistrict": true,
    "signature": "Bún kèn Hà Tiên nước cốt dừa, hủ tiếu hấp tôm khô, bánh thốt nốt",
    "specialties": [
      {
        "name": "Bún Kèn Hà Tiên Nước Cốt Dừa Cá Nhồng & Bánh Thốt Nốt",
        "rest": "Bún Kèn Năng - Mạc Công Du, P. Đông Hồ, Hà Tiên",
        "cat": "noodles",
        "tags": [
          "#Bún_kèn_Hà_Tiên",
          "#Cốt_dừa_béo_ngậy",
          "#Cá_nhồng"
        ],
        "price": "30.000đ - 45.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Vị béo ngậy của nước cốt dừa quyện cùng thịt cá nhồng giã nhuyễn thơm lừng nghệ vàng và sả ớt.",
        "lat": 10.382,
        "lng": 104.485,
        "latitude": 10.382,
        "longitude": 104.485
      }
    ]
  },
  {
    "cityId": "angiang_chaudoc",
    "city": "TP. Châu Đốc (An Giang)",
    "shortName": "Châu Đốc",
    "parentProvince": "An Giang",
    "region": "Miền Tây",
    "address": "Bạch Đằng, TP. Châu Đốc",
    "temp": "30°C",
    "condition": "Nắng ấm phù sa",
    "icon": "🐟",
    "lat": 10.7,
    "lng": 105.1167,
    "isDistrict": true,
    "signature": "Bún cá Châu Đốc Cô Lệ, bò 7 món Núi Sam, lẩu mắm cá linh chợ Châu Đốc",
    "specialties": [
      {
        "name": "Bún Cá Châu Đốc Nghệ Vàng & Chả Lụa Bông Điên Điển",
        "rest": "Bún Cá Cô Lệ - Chợ Đêm Châu Đốc, An Giang",
        "cat": "noodles",
        "tags": [
          "#Bún_cá_Châu_Đốc",
          "#Bông_điên_điển",
          "#Ngọt_nước"
        ],
        "price": "35.000đ - 55.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Cá lóc đồng xào nghệ vàng ươm, nước lèo thanh ngọt từ ngải bún và xương cá đậm chất Tây Nam Bộ.",
        "lat": 10.708,
        "lng": 105.122,
        "latitude": 10.708,
        "longitude": 105.122
      }
    ]
  },
  {
    "cityId": "angiang_triton",
    "city": "Huyện Tri Tôn (Ô Thum, An Giang)",
    "shortName": "Tri Tôn (Ô Thum)",
    "parentProvince": "An Giang",
    "region": "Miền Tây",
    "address": "Hồ Ô Thum, Tri Tôn, An Giang",
    "temp": "31°C",
    "condition": "Nắng gió Thất Sơn",
    "icon": "🍗",
    "lat": 10.422,
    "lng": 104.985,
    "isDistrict": true,
    "signature": "Gà đốt Ô Thum lá chúc thơm lừng, đu đủ đâm cay xé lưỡi, ếch nướng",
    "specialties": [
      {
        "name": "Gà Đốt Ô Thum Lá Chúc Da Giòn Rụm & Đu Đủ Đâm",
        "rest": "Gà Đốt Siu Sóc - Ven Hồ Ô Thum, Ô Lâm, Tri Tôn",
        "cat": "bbq",
        "tags": [
          "#Gà_đốt_Ô_Thum",
          "#Lá_chúc_thơm",
          "#Da_giòn"
        ],
        "price": "180.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "reason": "Gà đồi ướp sả ớt lá chúc đốt lửa than đượm nồng, da vàng ruộm giòn tan thơm nức mùi chúc Thất Sơn.",
        "lat": 10.382,
        "lng": 104.985,
        "latitude": 10.382,
        "longitude": 104.985
      }
    ]
  },
  {
    "cityId": "dongthap_sadec",
    "city": "TP. Sa Đéc (Đồng Tháp)",
    "shortName": "Sa Đéc",
    "parentProvince": "Đồng Tháp",
    "region": "Miền Tây",
    "address": "Trần Hưng Đạo, TP. Sa Đéc",
    "temp": "29°C",
    "condition": "Mát rượi hương hoa",
    "icon": "🪷",
    "lat": 10.2944,
    "lng": 105.7583,
    "isDistrict": true,
    "signature": "Hủ tiếu Sa Đéc bột gạo làng bột, cá lóc nướng cuốn lá sen non",
    "specialties": [
      {
        "name": "Hủ Tiếu Khô Sa Đéc Nước Sốt Gia Truyền Bà Sẩm",
        "rest": "Hủ Tiếu Bà Sẩm - 188 Trần Hưng Đạo, Sa Đéc",
        "cat": "noodles",
        "tags": [
          "#Hủ_tiếu_Sa_Đéc",
          "#Sốt_gia_truyền",
          "#Đậm_đà"
        ],
        "price": "35.000đ - 60.000đ",
        "img": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "reason": "Sợi hủ tiếu Sa Đéc bột gạo dai mềm không chua, rưới nước sốt sánh nâu đậm vị ngọt bùi.",
        "lat": 10.298,
        "lng": 105.759,
        "latitude": 10.298,
        "longitude": 105.759
      }
    ]
  },
  {
    "cityId": "dongthap_laivung",
    "city": "Huyện Lai Vung (Đồng Tháp)",
    "shortName": "Lai Vung",
    "parentProvince": "Đồng Tháp",
    "region": "Miền Tây",
    "address": "Tân Thành, Lai Vung, Đồng Tháp",
    "temp": "29°C",
    "condition": "Nắng ấm vườn quýt",
    "icon": "🍊",
    "lat": 10.2167,
    "lng": 105.65,
    "isDistrict": true,
    "signature": "Nem Lai Vung chua ngọt giòn sần sật, quýt hồng Lai Vung",
    "specialties": [
      {
        "name": "Nem Lai Vung Giáo Thơ Chua Ngọt Giòn Bì Sợi",
        "rest": "Cơ Sở Nem Giáo Thơ - QL54, Tân Thành, Lai Vung",
        "cat": "streetfood",
        "tags": [
          "#Nem_Lai_Vung",
          "#Chua_ngọt_giòn",
          "#Đặc_sản_miệt_vườn"
        ],
        "price": "35.000đ - 65.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Thịt heo nạc quết nhuyễn trộn bì heo giòn sần sật, ủ lá chùm ruột lên men chua thanh ngọt dịu.",
        "lat": 10.218,
        "lng": 105.652,
        "latitude": 10.218,
        "longitude": 105.652
      }
    ]
  },
  {
    "cityId": "camau_namcan",
    "city": "Huyện Năm Căn (Cà Mau)",
    "shortName": "Năm Căn",
    "parentProvince": "Cà Mau",
    "region": "Miền Tây",
    "address": "TT. Năm Căn, Huyện Năm Căn",
    "temp": "30°C",
    "condition": "Gió sông Cửa Lớn",
    "icon": "🦀",
    "lat": 8.75,
    "lng": 105.0167,
    "isDistrict": true,
    "signature": "Cua gạch Năm Căn rang me, ba khía muối tỏi ớt, tôm đất nướng",
    "specialties": [
      {
        "name": "Cua Gạch Năm Căn Hấp Bia Gạch Son Thịt Chắc",
        "rest": "Quán Cua Biển Năm Căn - Nguyễn Tất Thành, TT. Năm Căn",
        "cat": "seafood",
        "tags": [
          "#Cua_gạch_Năm_Căn",
          "#Gạch_son_béo",
          "#Thịt_chắc"
        ],
        "price": "250.000đ - 450.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Cua biển Năm Căn đệ nhất xứ Nam Kỳ, thịt ngọt đậm đà gạch son béo ngậy khó quên.",
        "lat": 8.752,
        "lng": 105.021,
        "latitude": 8.752,
        "longitude": 105.021
      }
    ]
  },
  {
    "cityId": "camau_datmui",
    "city": "Huyện Ngọc Hiển (Đất Mũi, Cà Mau)",
    "shortName": "Đất Mũi (Cà Mau)",
    "parentProvince": "Cà Mau",
    "region": "Miền Tây",
    "address": "Mũi Cà Mau, Xã Đất Mũi, Ngọc Hiển",
    "temp": "30°C",
    "condition": "Gió mũi biển lộng lẫy",
    "icon": "🧭",
    "lat": 8.6044,
    "lng": 104.7203,
    "isDistrict": true,
    "signature": "Cá thòi lòi nướng muối ớt rừng đước, vọp nướng mỡ hành, tôm khô Đất Mũi",
    "specialties": [
      {
        "name": "Cá Thòi Lòi Leo Cây Nướng Muối Ớt Rừng Đước",
        "rest": "Quán Ẩm Thực Đất Mũi - KDL Mũi Cà Mau, Ngọc Hiển",
        "cat": "seafood",
        "tags": [
          "#Cá_thòi_lòi",
          "#Nướng_muối_ớt",
          "#Đặc_sản_rừng_ngập_mặn"
        ],
        "price": "120.000đ - 220.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Cá thòi lòi đặc sản vùng bãi bồi rừng đước thịt thơm dai ngọt như thịt gà nướng than muối ớt cay xè.",
        "lat": 8.608,
        "lng": 104.718,
        "latitude": 8.608,
        "longitude": 104.718
      }
    ]
  },
  {
    "cityId": "quangninh_halong",
    "city": "TP. Hạ Long (Quảng Ninh)",
    "shortName": "Hạ Long",
    "parentProvince": "Quảng Ninh",
    "region": "Miền Bắc",
    "address": "Bãi Cháy, TP. Hạ Long",
    "temp": "22°C",
    "condition": "Gió vịnh mát dịu",
    "icon": "⛵",
    "lat": 20.9505,
    "lng": 107.0734,
    "isDistrict": true,
    "signature": "Chả mực giã tay Thoan, bún bề bề tôm càng, sam biển 7 món",
    "specialties": [
      {
        "name": "Chả Mực Giã Tay Thoan & Bún Bề Bề Bãi Cháy",
        "rest": "Chả Mực Thoan - Kiot 36 Chợ Hạ Long 1",
        "cat": "seafood",
        "tags": [
          "#Chả_mực_giã_tay",
          "#Vịnh_Hạ_Long",
          "#Giòn_sần_sật"
        ],
        "price": "80.000đ - 250.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Mực mai tươi sống giã tay giòn sần sật chiên vàng thơm ngậy ăn kèm bánh cuốn hoặc xôi trắng.",
        "lat": 20.9532,
        "lng": 107.0805,
        "latitude": 20.9532,
        "longitude": 107.0805
      }
    ]
  },
  {
    "cityId": "quangninh_vandon",
    "city": "Huyện Vân Đồn (Quảng Ninh)",
    "shortName": "Vân Đồn",
    "parentProvince": "Quảng Ninh",
    "region": "Miền Bắc",
    "address": "Cảng Cái Rồng, Vân Đồn",
    "temp": "22°C",
    "condition": "Gió biển đảo",
    "icon": "🦪",
    "lat": 21.05,
    "lng": 107.4167,
    "isDistrict": true,
    "signature": "Tu hài nướng mỡ hành, hàu sữa nướng phô mai, sá sùng Quan Lạn xào tỏi",
    "specialties": [
      {
        "name": "Tu Hài Nướng Mỡ Hành & Hàu Sữa Đảo Vân Đồn",
        "rest": "Hải Sản Gió Biển - Cảng Cái Rồng, Vân Đồn",
        "cat": "seafood",
        "tags": [
          "#Tu_hài_Vân_Đồn",
          "#Hàu_sữa_béo",
          "#Nướng_mỡ_hành"
        ],
        "price": "120.000đ - 260.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Tu hài và hàu sữa nuôi tự nhiên tại vịnh Bái Tử Long ngọt béo ngậy nướng than hoa thơm nức mũi.",
        "lat": 21.042,
        "lng": 107.418,
        "latitude": 21.042,
        "longitude": 107.418
      }
    ]
  },
  {
    "cityId": "hanoi_hoankiem",
    "city": "Quận Hoàn Kiếm (Hà Nội)",
    "shortName": "Hoàn Kiếm (Phố Cổ)",
    "parentProvince": "Hà Nội",
    "region": "Miền Bắc",
    "address": "Phố Cổ, Hoàn Kiếm, Hà Nội",
    "temp": "19°C",
    "condition": "Se lạnh phố cổ",
    "icon": "🏛️",
    "lat": 21.0336,
    "lng": 105.85,
    "isDistrict": true,
    "signature": "Phở Bát Đàn, bún chả Đắc Kim Hàng Mành, chả cá Lã Vọng",
    "specialties": [
      {
        "name": "Phở Bò Tái Lăn Bát Đàn Gia Truyền Phố Cổ",
        "rest": "Phở Gia Truyền Bát Đàn - 49 Bát Đàn, Hoàn Kiếm",
        "cat": "noodles",
        "tags": [
          "#Phở_Hà_Nội",
          "#Ấm_áp",
          "#Phố_cổ"
        ],
        "price": "60.000đ - 85.000đ",
        "img": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
        "reason": "Nước dùng phở bò ngọt thanh từ xương hầm thơm ngậy mùi gừng quế ấm lòng giữa phố cổ.",
        "lat": 21.0337,
        "lng": 105.8475,
        "latitude": 21.0337,
        "longitude": 105.8475
      }
    ]
  },
  {
    "cityId": "hanoi_tayho",
    "city": "Quận Tây Hồ (Hà Nội)",
    "shortName": "Tây Hồ (Hồ Tây)",
    "parentProvince": "Hà Nội",
    "region": "Miền Bắc",
    "address": "Thanh Niên, Tây Hồ, Hà Nội",
    "temp": "19°C",
    "condition": "Gió Hồ Tây se mát",
    "icon": "🍤",
    "lat": 21.0667,
    "lng": 105.8167,
    "isDistrict": true,
    "signature": "Bánh tôm Hồ Tây giòn rụm, ốc hấp lá gừng, bún ốc nguội Tây Hồ",
    "specialties": [
      {
        "name": "Bánh Tôm Hồ Tây Giòn Tan & Ốc Luộc Lá Bưởi",
        "rest": "Bánh Tôm Hồ Tây - 01 Thanh Niên, Tây Hồ",
        "cat": "streetfood",
        "tags": [
          "#Bánh_tôm_Hồ_Tây",
          "#Tôm_đồng_ngọt",
          "#Vỏ_giòn_tan"
        ],
        "price": "45.000đ - 90.000đ",
        "img": "images/banh_khot_vung_tau.jpg",
        "reason": "Tôm nước ngọt nguyên con chiên trên bột khoai giòn rụm chấm nước mắm đu đủ chua ngọt.",
        "lat": 21.0485,
        "lng": 105.836,
        "latitude": 21.0485,
        "longitude": 105.836
      }
    ]
  },
  {
    "cityId": "hanoi_sontay",
    "city": "Thị xã Sơn Tây (Đường Lâm, Hà Nội)",
    "shortName": "Sơn Tây (Đường Lâm)",
    "parentProvince": "Hà Nội",
    "region": "Miền Bắc",
    "address": "Làng cổ Đường Lâm, Sơn Tây",
    "temp": "19°C",
    "condition": "Mát mẻ làng quê",
    "icon": "🏮",
    "lat": 21.1333,
    "lng": 105.5,
    "isDistrict": true,
    "signature": "Gà Mía Đường Lâm luộc giòn da, thịt quay đòn nướng than hoa, bánh tẻ",
    "specialties": [
      {
        "name": "Gà Mía Đường Lâm Da Giòn Vàng Ruộm & Thịt Quay Đòn",
        "rest": "Quán Ăn Cổ Đường Lâm - Xã Đường Lâm, TX. Sơn Tây",
        "cat": "bbq",
        "tags": [
          "#Gà_Mía_Đường_Lâm",
          "#Thịt_quay_đòn",
          "#Làng_cổ"
        ],
        "price": "150.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "reason": "Gà Mía tiến vua da giòn sần sật thịt ngọt đậm đà, thịt ba chỉ quay đòn than củi thơm lừng lá ổi.",
        "lat": 21.145,
        "lng": 105.472,
        "latitude": 21.145,
        "longitude": 105.472
      }
    ]
  },
  {
    "cityId": "hcm_quan1",
    "city": "Quận 1 (TP. Hồ Chí Minh)",
    "shortName": "Quận 1 (Sài Gòn)",
    "parentProvince": "TP. Hồ Chí Minh",
    "region": "Đông Nam Bộ",
    "address": "Bến Nghé, Quận 1, TP.HCM",
    "temp": "31°C",
    "condition": "Nắng rực rỡ",
    "icon": "🏙️",
    "lat": 10.7769,
    "lng": 106.7009,
    "isDistrict": true,
    "signature": "Cơm tấm sườn cọng nướng, ốc Nguyễn Trãi, hủ tiếu mì người Hoa",
    "specialties": [
      {
        "name": "Cơm Tấm Sườn Cọng Nướng Mật Ong Than Hoa",
        "rest": "Cơm Tấm Nguyễn Văn Cừ - 167 Nguyễn Văn Cừ, Quận 1",
        "cat": "comfort",
        "tags": [
          "#Cơm_tấm_Sài_Gòn",
          "#Sườn_cọng_khổng_lồ",
          "#Đậm_đà"
        ],
        "price": "85.000đ - 140.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Sườn cây nướng than hoa ướp mật ong vàng óng, bì dẻo chả trứng hấp béo ngậy.",
        "lat": 10.758,
        "lng": 106.682,
        "latitude": 10.758,
        "longitude": 106.682
      }
    ]
  },
  {
    "cityId": "hcm_cuchi",
    "city": "Huyện Củ Chi (TP. Hồ Chí Minh)",
    "shortName": "Củ Chi",
    "parentProvince": "TP. Hồ Chí Minh",
    "region": "Đông Nam Bộ",
    "address": "Thị trấn Củ Chi, TP.HCM",
    "temp": "31°C",
    "condition": "Nắng êm đồng ruộng",
    "icon": "🥩",
    "lat": 11.0067,
    "lng": 106.5133,
    "isDistrict": true,
    "signature": "Bò tơ Củ Chi hấp cuốn bánh tráng rau rừng, khoai mì luộc nước cốt dừa",
    "specialties": [
      {
        "name": "Bò Tơ Củ Chi Hấp Gừng Cuốn Rau Rừng Sông Quê",
        "rest": "Bò Tơ Xuân Đào - Kp2, QL22, TT. Củ Chi",
        "cat": "bbq",
        "tags": [
          "#Bò_tơ_Củ_Chi",
          "#Rau_rừng_sông_quê",
          "#Mắm_nêm_cay"
        ],
        "price": "120.000đ - 240.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Thịt bò tơ non mềm ngọt hấp gừng thơm nức, cuốn bánh tráng Trảng Bàng và rổ rau rừng chấm mắm nêm.",
        "lat": 10.978,
        "lng": 106.495,
        "latitude": 10.978,
        "longitude": 106.495
      }
    ]
  },
  {
    "cityId": "thanhhoa_samson",
    "city": "TP. Sầm Sơn (Thanh Hóa)",
    "shortName": "Sầm Sơn",
    "parentProvince": "Thanh Hóa",
    "region": "Miền Trung",
    "address": "Hồ Xuân Hương, TP. Sầm Sơn",
    "temp": "23°C",
    "condition": "Nắng gió biển Sầm Sơn",
    "icon": "🏖️",
    "lat": 19.7425,
    "lng": 105.9039,
    "isDistrict": true,
    "signature": "Mực trứng chiên mắm Sầm Sơn, nem chua nướng than, cua biển hấp bia",
    "specialties": [
      {
        "name": "Mực Trứng Chiên Nước Mắm & Nem Chua Nướng Sầm Sơn",
        "rest": "Hải Sản Tuấn Năm - Bãi B, Đường Hồ Xuân Hương, Sầm Sơn",
        "cat": "seafood",
        "tags": [
          "#Mực_trứng_Sầm_Sơn",
          "#Nem_chua_nướng",
          "#Đậm_đà"
        ],
        "price": "120.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Mực trứng tươi béo ngậy chiên mắm thơm lừng, ăn kèm chiếc nem chua nướng than hoa nóng hổi.",
        "lat": 19.728,
        "lng": 105.908,
        "latitude": 19.728,
        "longitude": 105.908
      }
    ]
  },
  {
    "cityId": "nghean_cualo",
    "city": "Thị xã Cửa Lò (Nghệ An)",
    "shortName": "Cửa Lò",
    "parentProvince": "Nghệ An",
    "region": "Miền Trung",
    "address": "Bình Minh, TX. Cửa Lò",
    "temp": "23°C",
    "condition": "Gió biển Cửa Lò",
    "icon": "🌊",
    "lat": 18.8,
    "lng": 105.7167,
    "isDistrict": true,
    "signature": "Mực nhảy nướng than hoa Cửa Lò, ghẹ hấp sả gừng, mắm ruốc Cửa Lò",
    "specialties": [
      {
        "name": "Mực Nhảy Cửa Lò Nướng Than Hồng Tươi Rói Giòn Ngọt",
        "rest": "Hải Sản Thúy Hiếu - Bãi Biển Cửa Lò, Nghệ An",
        "cat": "seafood",
        "tags": [
          "#Mực_nhảy_Cửa_Lò",
          "#Tươi_sống",
          "#Giòn_ngọt"
        ],
        "price": "180.000đ - 350.000đ",
        "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "reason": "Mực câu trong đêm tươi rói nướng than hoa chấm muối tiêu chanh hoặc tương ớt cay nồng.",
        "lat": 18.812,
        "lng": 105.728,
        "latitude": 18.812,
        "longitude": 105.728
      }
    ]
  },
  {
    "cityId": "quangbinh_phongnha",
    "city": "Phong Nha (Huyện Bố Trạch, Quảng Bình)",
    "shortName": "Phong Nha",
    "parentProvince": "Quảng Bình",
    "region": "Miền Trung",
    "address": "Sơn Trạch, Bố Trạch, Quảng Bình",
    "temp": "24°C",
    "condition": "Mát rượi thung lũng sông Son",
    "icon": "🏞️",
    "lat": 17.5833,
    "lng": 106.2833,
    "isDistrict": true,
    "signature": "Gà nướng muối cheo Phong Nha, cá chình sông Son nướng, chắt chắt xào",
    "specialties": [
      {
        "name": "Gà Nướng Muối Cheo Phong Nha & Cá Chình Sông Son",
        "rest": "Nhà Hàng Hang Tối Phong Nha - Sơn Trạch, Bố Trạch",
        "cat": "bbq",
        "tags": [
          "#Gà_nướng_Phong_Nha",
          "#Muối_cheo_lá_rừng",
          "#Ấm_áp"
        ],
        "price": "160.000đ - 320.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "reason": "Gà đồi nướng than hoa chấm muối cheo lá rừng cay nồng xộc lên mũi độc nhất vô nhị.",
        "lat": 17.585,
        "lng": 106.262,
        "latitude": 17.585,
        "longitude": 106.262
      }
    ]
  },
  {
    "cityId": "daklak_buondon",
    "city": "Huyện Buôn Đôn (Đắk Lắk)",
    "shortName": "Buôn Đôn",
    "parentProvince": "Đắk Lắk",
    "region": "Tây Nguyên",
    "address": "Xã Krông Na, Buôn Đôn, Đắk Lắk",
    "temp": "24°C",
    "condition": "Nắng đại ngàn sông Sêrêpôk",
    "icon": "🐘",
    "lat": 12.8986,
    "lng": 107.7944,
    "isDistrict": true,
    "signature": "Gà nướng Buôn Đôn chấm muối ớt rừng, lẩu cá lăng sông Sêrêpôk, rượu cần",
    "specialties": [
      {
        "name": "Gà Nướng Buôn Đôn Chấm Muối É Rừng & Cơm Lam",
        "rest": "Quán Nhà Sàn Cầu Treo Buôn Đôn - Krông Na, Buôn Đôn",
        "cat": "bbq",
        "tags": [
          "#Gà_nướng_Buôn_Đôn",
          "#Đại_ngàn",
          "#Đậm_đà"
        ],
        "price": "190.000đ - 300.000đ",
        "img": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
        "reason": "Gà thả đồi Buôn Đôn nướng than củi giòn bì thơm phức chấm muối lá é giã ớt rừng cay thơm bùng nổ.",
        "lat": 12.895,
        "lng": 107.785,
        "latitude": 12.895,
        "longitude": 107.785
      },
      {
        "name": "Lẩu Cá Lăng Sông Sêrêpôk Nấu Măng Rừng Cay Cay",
        "rest": "Quán Ven Sông Sêrêpôk - Xã Krông Na, Huyện Buôn Đôn",
        "cat": "hotpot",
        "tags": [
          "#Cá_lăng_Sêrêpôk",
          "#Măng_rừng",
          "#Ấm_bụng"
        ],
        "price": "220.000đ - 380.000đ",
        "img": "images/lau_ca_tam_sapa.jpg",
        "reason": "Cá lăng da trơn thịt ngọt béo nhúng nồi nước lẩu măng chua cay xé lưỡi đặc trưng xứ Bản Đôn.",
        "lat": 12.902,
        "lng": 107.778,
        "latitude": 12.902,
        "longitude": 107.778
      }
    ]
  },
  {
    "cityId": "daklak_eakar",
    "city": "Huyện Ea Kar (Đắk Lắk)",
    "shortName": "Ea Kar",
    "parentProvince": "Đắk Lắk",
    "region": "Tây Nguyên",
    "address": "TT. Ea Kar, Huyện Ea Kar, Đắk Lắk",
    "temp": "23°C",
    "condition": "Mát mẻ hồ Ea Kar",
    "icon": "🥩",
    "lat": 12.7833,
    "lng": 108.55,
    "isDistrict": true,
    "signature": "Bò tơ Ea Kar nướng tảng, cháo lòng bánh hỏi Ea Kar",
    "specialties": [
      {
        "name": "Bò Tơ Ea Kar Nướng Tảng Chấm Muối Kiến Than Hoa",
        "rest": "Bò Tơ 79 Ea Kar - 56 Nguyễn Tất Thành, TT. Ea Kar",
        "cat": "bbq",
        "tags": [
          "#Bò_tơ_EaKar",
          "#Nướng_tảng",
          "#Béo_ngậy"
        ],
        "price": "150.000đ - 280.000đ",
        "img": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "reason": "Thịt bò tơ tươi rói thái tảng nướng xì xèo trên than hồng, thớ thịt ngọt mềm tan trong miệng.",
        "lat": 12.785,
        "lng": 108.552,
        "latitude": 12.785,
        "longitude": 108.552
      }
    ]
  }
],

  moods: [
    {
      id: "stress",
      emoji: "🤯",
      label: "Xả stress",
      color: "#E17055",
      glow: "rgba(225, 112, 85, 0.4)",
      desc: "Cần đồ cay xé lưỡi kích thích endorphin hoặc đồ giòn rụm nhai xả stress cực đã",
      tags: ["#Xả_stress", "#Đồ_cay", "#Giòn_rụm", "#Cay_xé_lưỡi", "#Nhai_đã_miệng"]
    },
    {
      id: "craving",
      emoji: "😋",
      label: "Thèm ăn ngon",
      color: "#FF9F43",
      glow: "rgba(255, 159, 67, 0.4)",
      desc: "Muốn ăn đồ đậm đà, giòn rụm hoặc lẩu nướng ngập tràn",
      tags: ["#Đậm_đà", "#Giòn_rụm", "#Thèm_thịt", "#Đặc_sản"]
    },
    {
      id: "sweet",
      emoji: "🍰",
      label: "Thèm ngọt",
      color: "#FD79A8",
      glow: "rgba(253, 121, 168, 0.45)",
      desc: "Chè thập cẩm, kem gelato, bánh ngọt, trà sữa ngọt ngào nạp năng lượng hạnh phúc",
      tags: ["#Thèm_ngọt", "#Chè_ngon", "#Kem_gelato", "#Bánh_ngọt", "#Trà_sữa"]
    },
    {
      id: "zen",
      emoji: "🪷",
      label: "Thanh tịnh",
      color: "#00B894",
      glow: "rgba(0, 184, 148, 0.4)",
      desc: "Cơm chay thanh lọc, lẩu nấm dưỡng sinh, không gian an yên thanh tịnh",
      tags: ["#Ăn_chay", "#Thanh_tịnh", "#Lẩu_nấm", "#Tĩnh_tâm", "#An_lạc"]
    },
    {
      id: "comfort",
      emoji: "🥺",
      label: "Cần vỗ về",
      color: "#FFB088",
      glow: "rgba(255, 176, 136, 0.4)",
      desc: "Cần món ấm áp, ngọt dịu để nạp lại tinh thần",
      tags: ["#Ấm_áp", "#Ngọt_ngào", "#Thanh_đạm", "#Vỗ_về"]
    },
    {
      id: "energetic",
      emoji: "🔥",
      label: "Sôi động",
      color: "#FF4757",
      glow: "rgba(255, 71, 87, 0.45)",
      desc: "Lên kèo tụ tập nướng lẩu cùng bạn bè quẩy hết mình",
      tags: ["#Hội_bạn", "#Xì_xèo", "#Bia_mồi", "#Sôi_động"]
    },
    {
      id: "chill",
      emoji: "☕",
      label: "Thư giãn",
      color: "#6C5CE7",
      glow: "rgba(108, 92, 231, 0.4)",
      desc: "Cà phê, trà bánh, chill nhẹ nhàng nạp năng lượng bình yên",
      tags: ["#Chill", "#Cà_phê", "#Bánh_ngọt", "#Yên_tĩnh"]
    },
    {
      id: "seafood",
      emoji: "🦞",
      label: "Hải sản",
      color: "#0984E3",
      glow: "rgba(9, 132, 227, 0.45)",
      desc: "Đặc sản biển Quy Nhơn tôm, cua, mực, ốc tươi rói ngọt lịm",
      tags: ["#Hải_sản", "#Tôm_cua", "#Mực_lá", "#Ốc_biển", "#Đặc_sản_biển"]
    },
    {
      id: "hangout",
      emoji: "🍻",
      label: "Lai rai",
      color: "#E17055",
      glow: "rgba(225, 112, 85, 0.45)",
      desc: "Bia lạnh mồi bén, nem nướng mực nướng xì xèo hàn huyên cùng bạn bè",
      tags: ["#Lai_rai", "#Mồi_bén", "#Bia_lạnh", "#Chiến_hữu", "#Hàn_huyên"]
    },
    {
      id: "refreshing",
      emoji: "🧊",
      label: "Giải nhiệt",
      color: "#00CEC9",
      glow: "rgba(0, 206, 201, 0.4)",
      desc: "Trà trái cây nhiệt đới, dừa tươi, sinh tố mát lạnh đập tan oi bức",
      tags: ["#Giải_nhiệt", "#Mát_lạnh", "#Trà_trái_cây", "#Nước_ép", "#Sinh_tố"]
    },
    {
      id: "tired",
      emoji: "😴",
      label: "Mệt mỏi",
      color: "#747D8C",
      glow: "rgba(116, 125, 140, 0.35)",
      desc: "Cần cháo ấm, súp bổ dưỡng hoặc món nước thanh nhẹ hồi sức",
      tags: ["#Dễ_tiêu", "#Thanh_lọc", "#Cháo_súp", "#Nhẹ_bụng"]
    },
    {
      id: "healthy",
      emoji: "🥗",
      label: "Eat Clean",
      color: "#2ED573",
      glow: "rgba(46, 213, 115, 0.4)",
      desc: "Món ăn thanh sạch, ít calo, giàu chất xơ giữ dáng đẹp da",
      tags: ["#Eat_clean", "#Healthy", "#Salad", "#Thanh_mát"]
    },
    {
      id: "budget",
      emoji: "💸",
      label: "Viêm túi",
      color: "#1E90FF",
      glow: "rgba(30, 144, 255, 0.4)",
      desc: "Tìm quán ngon bổ rẻ chuẩn tiêu chí sinh viên (giá từ <= 50k)",
      tags: ["#Ngon_bổ_rẻ", "#Sinh_viên", "#Bình_dân", "#Tiết_kiệm", "#Dưới_50k"]
    },
    {
      id: "celebrate",
      emoji: "🎉",
      label: "Tự thưởng",
      color: "#FFA502",
      glow: "rgba(255, 165, 2, 0.4)",
      desc: "Vừa đạt thành tựu, thưởng ngay bữa tiệc hoành tráng sang chảnh",
      tags: ["#Tự_thưởng", "#Hải_sản", "#Sang_chảnh", "#Ăn_ngập_mặt"]
    },
    {
      id: "date",
      emoji: "🍷",
      label: "Hẹn hò",
      color: "#E84393",
      glow: "rgba(232, 67, 147, 0.4)",
      desc: "Không gian lãng mạn, đồ ăn tinh tế cho buổi hẹn hoàn hảo",
      tags: ["#Hẹn_hò", "#Lãng_mạn", "#View_đẹp", "#Tinh_tế"]
    },
    {
      id: "spicy",
      emoji: "🌶️",
      label: "Thèm cay",
      color: "#D63031",
      glow: "rgba(214, 48, 49, 0.4)",
      desc: "Thèm vị cay xé lưỡi, toát mồ hôi đã đời sảng khoái",
      tags: ["#Siêu_cay", "#Mì_cay", "#Ớt_hiểm", "#Bùng_nổ"]
    },
    {
      id: "quick",
      emoji: "⚡",
      label: "Nhanh gọn",
      color: "#FDCB6E",
      glow: "rgba(253, 203, 110, 0.45)",
      desc: "Bận rộn nạp năng lượng nhanh: bánh mì kẹp, xôi, bánh bao tiện lợi",
      tags: ["#Nhanh_gọn", "#Bánh_mì", "#Xôi", "#Tiện_lợi"]
    },
    {
      id: "late_night",
      emoji: "🌙",
      label: "Ăn đêm",
      color: "#57606F",
      glow: "rgba(87, 96, 111, 0.4)",
      desc: "Cú đêm đói bụng, tìm quán mở khuya lót dạ ấm bụng",
      tags: ["#Ăn_đêm", "#Cú_đêm", "#Mở_khuya", "#Ấm_bụng"]
    }
  ],

  currentMoodId: "craving", // Default "Thèm ăn ngon"

  // 300 Quán Ăn Nổi Bật Tại Quy Nhơn từ ShopeeFood & GrabFood (Đầy đủ ShopeeFood Delivery)
  foods: [
    {
      "id": 8,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Anh Vũ",
      "address": "14 Diên Hồng, P. Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "distance": 1,
      "distanceText": "Cách bạn 1000m",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 3.5,
      "reviewCount": 36,
      "likesCount": 148,
      "commentsCount": 7,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7713763,
      "longitude": 109.2203514,
      "lat": 13.7713763,
      "lng": 109.2203514,
      "moodIds": [
        "craving",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi94fqpkmvv6f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi94fqpkmvv6f@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Anh Vũ tọa lạc tại 14 Diên Hồng, P. Lê Hồng Phong, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Anh Vũ được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 905 105 213",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-anh-vu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20Anh%20V%C5%A9",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.4 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "BÁNH XÈO TÔM NHẢY ANH VŨ",
      "placeId": "ChIJ41a4GwttbzERMutJ6xsCaqM",
      "gmapsAddr": "82 Diên Hồng Quy Nhơn Nam Gia Lai 550000 Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 12,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Chả Cá & Bún Sứa Quy Nhơn Nước Dùng Gia Truyền",
      "restaurant": "Bún Chả Cá Phượng Tèo",
      "address": "209 - 211 Nguyễn Huệ, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 1.8,
      "distanceText": "Cách bạn 1.8km",
      "priceRange": "35.000đ - 55.000đ",
      "rating": 4,
      "reviewCount": 20,
      "likesCount": 120,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7678306,
      "longitude": 109.22820569999999,
      "lat": 13.7678306,
      "lng": 109.22820569999999,
      "moodIds": [
        "budget",
        "healthy",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstqj9icc3ic7e@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstqj9icc3ic7e@resize_ss640x400"
      ],
      "description": "Quán Bún Chả Cá Phượng Tèo tọa lạc tại 209 - 211 Nguyễn Huệ, P. Trần Phú, phục vụ món Bún Chả Cá & Bún Sứa Quy Nhơn Nước Dùng Gia Truyền hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Chả Cá & Bún Sứa Quy Nhơn Nước Dùng Gia Truyền tại Bún Chả Cá Phượng Tèo được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 989 157 336",
      "menu": [
        {
          "name": "Bún Chả Cá Quy Nhơn",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Sứa Chả Cá Thập Cẩm",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Chả Cá Cuốn Rau Thêm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-phuong-teo",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20Ph%C6%B0%E1%BB%A3ng%20T%C3%A8o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.3 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán bún chả cá Phượng Tèo",
      "placeId": "ChIJp1nzIYxsbzERVtjYyDM8hQs",
      "gmapsAddr": "211 Nguyễn Huệ Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 55000,
      "attributes": [
        "hot_soup",
        "sour"
      ]
    },
    {
      "id": 18,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Lẩu Ếch Măng Cay Nồng Hổi & Ếch Chiên Bơ Tỏi",
      "restaurant": "Cháo Ếch Singapore",
      "address": "65 Hai Bà Trưng",
      "district": "Tp. Qui Nhơn",
      "distance": 1.7,
      "distanceText": "Cách bạn 1.7km",
      "priceRange": "95.000đ - 220.000đ",
      "rating": 4.8,
      "reviewCount": 118,
      "likesCount": 444,
      "commentsCount": 23,
      "openTime": "06:00 - 21:30",
      "category": "hotpot",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7719768,
      "longitude": 109.23225459999999,
      "lat": 13.7719768,
      "lng": 109.23225459999999,
      "moodIds": [
        "celebrate",
        "comfort",
        "energetic",
        "spicy",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Comfort",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwghndz3qvob10@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwghndz3qvob10@resize_ss640x400"
      ],
      "description": "Quán Cháo Ếch Singapore tọa lạc tại 65 Hai Bà Trưng, phục vụ món Lẩu Ếch Măng Cay Nồng Hổi & Ếch Chiên Bơ Tỏi hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Ếch Măng Cay Nồng Hổi & Ếch Chiên Bơ Tỏi tại Cháo Ếch Singapore được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3802466",
      "menu": [
        {
          "name": "Thố Cháo Ếch Singapore",
          "price": "45.000đ",
          "highlight": true
        },
        {
          "name": "Nồi Lẩu Ếch Măng Cay Khổng Lồ",
          "price": "220.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Ếch Xào Sa Tế Thêm",
          "price": "65.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/chao-ech-singapore-hai-ba-trung",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ch%C3%A1o%20%E1%BA%BEch%20Singapore%20-%20Hai%20B%C3%A0%20Tr%C6%B0ng",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Cháo Ếch Singapore -***",
      "placeId": "ChIJVVWh9IhsbzERobHVknP39Y8",
      "gmapsAddr": "65 Hai Bà Trưng Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 95000,
      "priceMax": 220000,
      "attributes": [
        "crunchy",
        "heavy",
        "hot_soup",
        "spicy"
      ]
    },
    {
      "id": 22,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Tôm Nhảy - Phước Sơn",
      "address": "122 Đống Đa, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "distance": 0.5,
      "distanceText": "Cách bạn 500m",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4.9,
      "reviewCount": 1,
      "likesCount": 13,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.784204599999999,
      "longitude": 109.22367729999999,
      "lat": 13.784204599999999,
      "lng": 109.22367729999999,
      "moodIds": [
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvckud9v3k439@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvckud9v3k439@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Tôm Nhảy - Phước Sơn tọa lạc tại 122 Đống Đa, P. Thị Nại, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Tôm Nhảy - Phước Sơn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 858 626 819",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-tom-nhay-phuoc-son",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20T%C3%B4m%20Nh%E1%BA%A3y%20-%20Ph%C6%B0%E1%BB%9Bc%20S%C6%A1n",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "5.0 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh Xèo Tôm Nhảy Phước Sơn",
      "placeId": "ChIJRQZlxsptbzERMxUtN71rusI",
      "gmapsAddr": "122 Đống Đa Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 21,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Đặc Sản Riverside Restaurant",
      "restaurant": "Riverside Restaurant",
      "address": "1 Võ Nguyên Giáp",
      "district": "Tp. Qui Nhơn",
      "distance": 0.5,
      "distanceText": "Cách bạn 500m",
      "priceRange": "35.000đ - 85.000đ",
      "rating": 3.8,
      "reviewCount": 63,
      "likesCount": 194,
      "commentsCount": 12,
      "openTime": "06:00 - 21:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.786455799999999,
      "longitude": 109.2204124,
      "lat": 13.786455799999999,
      "lng": 109.2204124,
      "moodIds": [
        "craving"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8jaqa6t32xaf@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8jaqa6t32xaf@resize_ss640x400"
      ],
      "description": "Quán Riverside Restaurant tọa lạc tại 1 Võ Nguyên Giáp, phục vụ món Đặc Sản Riverside Restaurant hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Đặc Sản Riverside Restaurant tại Riverside Restaurant cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 256 2211 333",
      "menu": [
        {
          "name": "Đặc Sản Riverside Restaurant",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Riverside Restaurant",
          "price": "85.000đ",
          "highlight": false
        },
        {
          "name": "Phần món ăn kèm đặc sản tại quán",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/riverside-restaurant",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Riverside%20Restaurant",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.9 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Nhà hàng Riverside Quy Nhơn",
      "placeId": "ChIJq1AzZWJrbzER1jwIR_jl7zM",
      "gmapsAddr": "1 Võ Nguyên Giáp Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 85000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 28,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Cây Me",
      "address": "546 Nguyễn Thái Học, P. Quang Trung",
      "district": "Tp. Qui Nhơn",
      "distance": 2.7,
      "distanceText": "Cách bạn 2.7km",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4,
      "reviewCount": 2,
      "likesCount": 46,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7591235,
      "longitude": 109.2107266,
      "lat": 13.7591235,
      "lng": 109.2107266,
      "moodIds": [
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaqufxpq9y3d2@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaqufxpq9y3d2@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Cây Me tọa lạc tại 546 Nguyễn Thái Học, P. Quang Trung, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Cây Me được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3803836",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.4 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh Xèo Cây Me",
      "placeId": "ChIJ2ddz8cFsbzERz-_5ypEXm2g",
      "gmapsAddr": "546a Nguyễn Thái Học Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 24,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Mực",
      "address": "70 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "distance": 2.6,
      "distanceText": "Cách bạn 2.6km",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4.2,
      "reviewCount": 2,
      "likesCount": 26,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7715144,
      "longitude": 109.246663,
      "lat": 13.7715144,
      "lng": 109.246663,
      "moodIds": [
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9sgs23v17da0@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9sgs23v17da0@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Mực tọa lạc tại 70 Xuân Diệu, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Mực được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3803288",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-muc-xuan-dieu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20M%E1%BB%B1c%20-%20Xu%C3%A2n%20Di%E1%BB%87u",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh Xèo Mực 70 Xuân Diệu",
      "placeId": "ChIJz0zDRGVsbzER3_UJsYPeJ4c",
      "gmapsAddr": "70 Xuân Diệu Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 36,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Nướng Trân Châu Đường Đen",
      "restaurant": "Marina Coffee",
      "address": "5 Trần Quý Cáp",
      "district": "Tp. Qui Nhơn",
      "distance": 1.7,
      "distanceText": "Cách bạn 1.7km",
      "priceRange": "25.000đ - 55.000đ",
      "rating": 3.7,
      "reviewCount": 21,
      "likesCount": 143,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.768042099999999,
      "longitude": 109.22287569999999,
      "lat": 13.768042099999999,
      "lng": 109.22287569999999,
      "moodIds": [
        "budget",
        "chill",
        "date",
        "energetic",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbhpiwo5o7v1f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbhpiwo5o7v1f@resize_ss640x400"
      ],
      "description": "Quán Marina Coffee tọa lạc tại 5 Trần Quý Cáp, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại Marina Coffee cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 941 655 834",
      "menu": [
        {
          "name": "Trà Sữa Nướng Trân Châu Đường Đen",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Marina Coffee",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Kim chi chua cay & Rau cuốn thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/marina-coffee",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Marina%20Coffee",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.9 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Marina The Coffee",
      "placeId": "ChIJMfQF-fFtbzERWofOIIeZy8s",
      "gmapsAddr": "138 Đô Đốc Bảo Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 55000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 7,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn",
      "restaurant": "Bánh Hỏi Cháo Lòng Hồng Thanh",
      "address": "22 Phan Bội Châu, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 4.1,
      "reviewCount": 36,
      "likesCount": 143,
      "commentsCount": 7,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7736711,
      "longitude": 109.2359077,
      "lat": 13.7736711,
      "lng": 109.2359077,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu19s93tzno9f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu19s93tzno9f@resize_ss640x400"
      ],
      "description": "Quán Bánh Hỏi Cháo Lòng Hồng Thanh tọa lạc tại 22 Phan Bội Châu, P. Lê Lợi, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn tại Bánh Hỏi Cháo Lòng Hồng Thanh được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 909 677 965",
      "menu": [
        {
          "name": "Bánh Hỏi Heo Quay / Lòng Heo",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Bánh Hỏi Cháo Lòng Đặc Biệt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Tô Cháo Huyết Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-hong-thanh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20H%E1%BB%93ng%20Thanh",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.4 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh hỏi cháo lòng Hồng Thanh",
      "placeId": "ChIJB7sBV31sbzERYG6mz8mXdqo",
      "gmapsAddr": "22 Phan Bội Châu Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 13,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
      "restaurant": "Hai Lộc Quán - Hải Sản Bình Dân",
      "address": "42 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "distance": 3.3,
      "distanceText": "Cách bạn 3.3km",
      "priceRange": "60.000đ - 280.000đ",
      "rating": 4.6,
      "reviewCount": 4,
      "likesCount": 77,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7712012,
      "longitude": 109.2474539,
      "lat": 13.7712012,
      "lng": 109.2474539,
      "moodIds": [
        "celebrate",
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb83a011exlb3@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb83a011exlb3@resize_ss640x400"
      ],
      "description": "Quán Hai Lộc Quán - Hải Sản Bình Dân tọa lạc tại 42 Xuân Diệu, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hai Lộc Quán - Hải Sản Bình Dân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 798 124 567",
      "menu": [
        {
          "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
          "price": "60.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Hai Lộc Quán - Hải Sản Bình Dân",
          "price": "280.000đ",
          "highlight": false
        },
        {
          "name": "Bánh mì đặc ruột chấm sốt bơ tỏi",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-loc-quan-hai-san-binh-dan",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Hai%20L%E1%BB%99c%20Qu%C3%A1n%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20B%C3%ACnh%20D%C3%A2n",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "5.0 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Hải Sản Quy Nhơn - 48 Xuân Diệu - Lộc Biển",
      "placeId": "ChIJT28YNZptbzER4936qWPltEM",
      "gmapsAddr": "48 Xuân Diệu Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 60000,
      "priceMax": 280000,
      "attributes": [
        "salty",
        "sour"
      ]
    },
    {
      "id": 40,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Nem Nướng Chợ Huyện Cuốn Bánh Tráng Rau Sống",
      "restaurant": "Nem Chả Lợi - Nem Nướng Quy Nhơn",
      "address": "113 Tăng Bạt Hổ",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "30.000đ - 60.000đ",
      "rating": 4.2,
      "reviewCount": 25,
      "likesCount": 75,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7731292,
      "longitude": 109.2304384,
      "lat": 13.7731292,
      "lng": 109.2304384,
      "moodIds": [
        "budget",
        "craving",
        "energetic",
        "hangout"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bbq",
        "#ShopeeFood",
        "#Xì_xèo"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lu7nt2pmrs4173@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lu7nt2pmrs4173@resize_ss640x400"
      ],
      "description": "Quán Nem Chả Lợi - Nem Nướng Quy Nhơn tọa lạc tại 113 Tăng Bạt Hổ, phục vụ món Nem Nướng Chợ Huyện Cuốn Bánh Tráng Rau Sống hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Nem Nướng Chợ Huyện Cuốn Bánh Tráng Rau Sống tại Nem Chả Lợi - Nem Nướng Quy Nhơn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 934 875 237",
      "menu": [
        {
          "name": "Phần Nem Nướng Cuốn Rau Sống",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Phần Nem Nướng Chả Ram Đặc Biệt",
          "price": "60.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng & Rau Rừng Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/nem-cha-loi-nem-nuong-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Nem%20Ch%E1%BA%A3%20L%E1%BB%A3i%20-%20Nem%20N%C6%B0%E1%BB%9Bng%20Quy%20Nh%C6%A1n",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.7 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Nem chả Lợi",
      "placeId": "ChIJP6D6pYhsbzERwB1f8w80exI",
      "gmapsAddr": "113 Tăng Bạt Hổ Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 60000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 42,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Chè Nhớ Quy Nhơn Thập Cẩm Béo Ngậy",
      "restaurant": "Sinh Tố Kim Đình - Bánh Bèo Nóng & Chè Đậu Xanh",
      "address": "20 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.6,
      "distanceText": "Cách bạn 2.6km",
      "priceRange": "25.000đ - 55.000đ",
      "rating": 4.3,
      "reviewCount": 20,
      "likesCount": 70,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7710428,
      "longitude": 109.2357036,
      "lat": 13.7710428,
      "lng": 109.2357036,
      "moodIds": [
        "budget",
        "chill",
        "comfort",
        "quick",
        "refreshing",
        "sweet",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhmy5a4vahl09@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhmy5a4vahl09@resize_ss640x400"
      ],
      "description": "Quán Sinh Tố Kim Đình - Bánh Bèo Nóng & Chè Đậu Xanh tọa lạc tại 20 Nguyễn Huệ, phục vụ món Chè Nhớ Quy Nhơn Thập Cẩm Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Chè Nhớ Quy Nhơn Thập Cẩm Béo Ngậy tại Sinh Tố Kim Đình - Bánh Bèo Nóng & Chè Đậu Xanh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 256 3892 755",
      "menu": [
        {
          "name": "Chè Nhớ Quy Nhơn Thập Cẩm Béo Ngậy",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Sinh Tố Kim Đình - Bánh Bèo Nóng & Chè Đậu Xanh",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Phần món ăn kèm đặc sản tại quán",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/sinh-to-kim-dinh-banh-beo-nong-che-dau-xanh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Sinh%20T%E1%BB%91%20Kim%20%C4%90%C3%ACnh%20-%20B%C3%A1nh%20B%C3%A8o%20N%C3%B3ng%20%26%20Ch%C3%A8%20%C4%90%E1%BA%ADu%20Xanh",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Sinh Tố Bánh Bèo Kim Đình",
      "placeId": "ChIJFZv9gmJsbzERssE9baOGw_o",
      "gmapsAddr": "18A Nguyễn Huệ Quy Nhơn Gia Lai 590000 Việt Nam",
      "priceMin": 25000,
      "priceMax": 55000,
      "attributes": [
        "drinks",
        "light",
        "sweet"
      ]
    },
    {
      "id": 46,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me",
      "restaurant": "Ốc Hảo Hảo",
      "address": "18 Ngọc Hân Công Chúa",
      "district": "Tp. Qui Nhơn",
      "distance": 1.9,
      "distanceText": "Cách bạn 1.9km",
      "priceRange": "35.000đ - 120.000đ",
      "rating": 3.4,
      "reviewCount": 26,
      "likesCount": 108,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.767568299999999,
      "longitude": 109.22869,
      "lat": 13.767568299999999,
      "lng": 109.22869,
      "moodIds": [
        "craving",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf0hgaj0kbf50@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf0hgaj0kbf50@resize_ss640x400"
      ],
      "description": "Quán Ốc Hảo Hảo tọa lạc tại 18 Ngọc Hân Công Chúa, phục vụ món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me tại Ốc Hảo Hảo được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 337 495 673",
      "menu": [
        {
          "name": "Đĩa Ốc Móng Tay Xào Rau Muống",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Ốc Hương Sốt Trứng Muối Béo Ngậy",
          "price": "120.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Chấm Sốt Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-hao-hao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20H%E1%BA%A3o%20H%E1%BA%A3o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ốc Hảo Hảo đường ngọc hân công chúa",
      "placeId": "ChIJsbkilo5sbzER_dR6940Vzzg",
      "gmapsAddr": "18 Ngọc Hân Công Chúa Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 120000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 44,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Chảo Ngọc Liên",
      "address": "63/13 Thanh Niên",
      "district": "Tp. Qui Nhơn",
      "distance": 2.7,
      "distanceText": "Cách bạn 2.7km",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4.7,
      "reviewCount": 1,
      "likesCount": 23,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7603495,
      "longitude": 109.2094401,
      "lat": 13.7603495,
      "lng": 109.2094401,
      "moodIds": [
        "craving",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbsuridcwpb0@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbsuridcwpb0@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Chảo Ngọc Liên tọa lạc tại 63/13 Thanh Niên, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Chảo Ngọc Liên được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 935 590 333",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-chao-ngoc-lien-6313-thanh-nien",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20Ch%E1%BA%A3o%20Ng%E1%BB%8Dc%20Li%C3%AAn%20-%2063/13%20Thanh%20Ni%C3%AAn",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.3 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh Xèo Ngọc Liên",
      "placeId": "ChIJ1_oArkVtbzERsxHEDBerDNs",
      "gmapsAddr": "63/13 Thanh Niên Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 49,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cà Phê Muối View Biển Ngắm Sóng",
      "restaurant": "Green Cafe",
      "address": "43 Lê Thánh Tôn",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 55.000đ",
      "rating": 3.9,
      "reviewCount": 25,
      "likesCount": 120,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7729188,
      "longitude": 109.2347624,
      "lat": 13.7729188,
      "lng": 109.2347624,
      "moodIds": [
        "budget",
        "chill",
        "date",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgo74y81om1d7@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgo74y81om1d7@resize_ss640x400"
      ],
      "description": "Quán Green Cafe tọa lạc tại 43 Lê Thánh Tôn, phục vụ món Cà Phê Muối View Biển Ngắm Sóng hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cà Phê Muối View Biển Ngắm Sóng tại Green Cafe cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 256 6250 179",
      "menu": [
        {
          "name": "Cà Phê Muối View Biển Ngắm Sóng",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Green Cafe",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Phần món ăn kèm đặc sản tại quán",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/green-cafe",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Green%20Cafe",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Cafe Green",
      "placeId": "ChIJO8M5F4hsbzER9G5D4Tq5bRM",
      "gmapsAddr": "43 Lê Thánh Tôn Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 55000,
      "attributes": [
        "drinks"
      ]
    },
    {
      "id": 31,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Nướng Trân Châu Đường Đen",
      "restaurant": "Trà Sữa Bobapop",
      "address": "145 Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "25.000đ - 55.000đ",
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 181,
      "commentsCount": 8,
      "openTime": "07:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7752999,
      "longitude": 109.2321461,
      "lat": 13.7752999,
      "lng": 109.2321461,
      "moodIds": [
        "budget",
        "chill",
        "energetic",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6wvrzvyzf38@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6wvrzvyzf38@resize_ss640x400"
      ],
      "description": "Quán Trà Sữa Bobapop tọa lạc tại 145 Lê Lợi, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại Trà Sữa Bobapop cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "0256 3804247",
      "menu": [
        {
          "name": "Trà Sữa Nướng Trân Châu Đường Đen",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Trà Sữa Bobapop - Lê Lợi",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Kim chi chua cay & Rau cuốn thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tra-sua-bobapop-le-loi",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Tr%C3%A0%20S%E1%BB%AFa%20Bobapop%20-%20L%C3%AA%20L%E1%BB%A3i",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bobapop",
      "placeId": "ChIJo26NToZsbzER7zay0OZ1sKM",
      "gmapsAddr": "145 Lê Lợi Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 55000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 47,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Nướng Trân Châu Đường Đen",
      "restaurant": "View Coffee",
      "address": "417 - 419 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 55.000đ",
      "rating": 4,
      "reviewCount": 21,
      "likesCount": 98,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7638644,
      "longitude": 109.2231468,
      "lat": 13.7638644,
      "lng": 109.2231468,
      "moodIds": [
        "budget",
        "chill",
        "date",
        "energetic",
        "late_night",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwddmopz46or05@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwddmopz46or05@resize_ss640x400"
      ],
      "description": "Quán View Coffee tọa lạc tại 417 - 419 Nguyễn Huệ, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại View Coffee cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 942 022 707",
      "menu": [
        {
          "name": "Trà Sữa Nướng Trân Châu Đường Đen",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt View Coffee",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Kim chi chua cay & Rau cuốn thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/view-coffee",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=View%20Coffee",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.7 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Funny Coffee_ View Quảng Trường Quy Nhơn",
      "placeId": "ChIJcVRZoYltbzERqW7zUtofaMg",
      "gmapsAddr": "417 Nguyễn Huệ Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 55000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 50,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
      "restaurant": "Nhà Hàng Lộc Biển - Hải Sản Quy Nhơn",
      "address": "48 Xuân Diệu, P. Hải Cảng",
      "district": "Tp. Qui Nhơn",
      "distance": 3.2,
      "distanceText": "Cách bạn 3.2km",
      "priceRange": "60.000đ - 280.000đ",
      "rating": 4.6,
      "reviewCount": 0,
      "likesCount": 50,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7712012,
      "longitude": 109.2474539,
      "lat": 13.7712012,
      "lng": 109.2474539,
      "moodIds": [
        "celebrate",
        "craving",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhmg3ook9l0f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhmg3ook9l0f@resize_ss640x400"
      ],
      "description": "Quán Nhà Hàng Lộc Biển - Hải Sản Quy Nhơn tọa lạc tại 48 Xuân Diệu, P. Hải Cảng, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Nhà Hàng Lộc Biển - Hải Sản Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 798 124 567",
      "menu": [
        {
          "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
          "price": "60.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Nhà Hàng Lộc Biển - Hải Sản Quy Nhơn - 48 Xuân Diệu",
          "price": "280.000đ",
          "highlight": false
        },
        {
          "name": "Bánh mì đặc ruột chấm sốt bơ tỏi",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/nha-hang-loc-bien-hai-san-quy-nhon-48-xuan-dieu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Nh%C3%A0%20H%C3%A0ng%20L%E1%BB%99c%20Bi%E1%BB%83n%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20Quy%20Nh%C6%A1n%20-%2048%20Xu%C3%A2n%20Di%E1%BB%87u",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Hải Sản Quy Nhơn - 48 Xuân Diệu - Lộc Biển",
      "placeId": "ChIJT28YNZptbzER4936qWPltEM",
      "gmapsAddr": "48 Xuân Diệu Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 60000,
      "priceMax": 280000,
      "attributes": [
        "salty",
        "sour"
      ]
    },
    {
      "id": 55,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
      "restaurant": "QUÁN ANN FOODS - HẢI SẢN GIÁ GỐC",
      "address": "22 Đặng Thành Tích, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.7,
      "distanceText": "Cách bạn 2.7km",
      "priceRange": "60.000đ - 280.000đ",
      "rating": 4.8,
      "reviewCount": 0,
      "likesCount": 75,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.758078399999999,
      "longitude": 109.21584329999999,
      "lat": 13.758078399999999,
      "lng": 109.21584329999999,
      "moodIds": [
        "celebrate",
        "craving",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mdy84m0fcydged@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-820l4-mdy84m0fcydged@resize_ss640x400"
      ],
      "description": "Quán QUÁN ANN FOODS - HẢI SẢN GIÁ GỐC tọa lạc tại 22 Đặng Thành Tích, P. Nguyễn Văn Cừ, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại QUÁN ANN FOODS - HẢI SẢN GIÁ GỐC cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 588 655 777",
      "menu": [
        {
          "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
          "price": "60.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt QUÁN ANN FOODS - HẢI SẢN GIÁ GỐC - 22 ĐẶNG THÀNH TÍCH",
          "price": "280.000đ",
          "highlight": false
        },
        {
          "name": "Bánh mì đặc ruột chấm sốt bơ tỏi",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-ann-foods-hai-san-gia-goc-22-dang-thanh-tich",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=QU%C3%81N%20ANN%20FOODS%20-%20H%E1%BA%A2I%20S%E1%BA%A2N%20GI%C3%81%20G%E1%BB%90C%20-%2022%20%C4%90%E1%BA%B6NG%20TH%C3%80NH%20T%C3%8DCH",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ann Foods - quán hải sản giá rẻ",
      "placeId": "ChIJd1MJewBtbzERrr0oWAB2aHY",
      "gmapsAddr": "22 Đặng Thành Tích Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 60000,
      "priceMax": 280000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 57,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Lẩu Dê Tươi Thuốc Bắc & Dê Nướng Bản Gang",
      "restaurant": "Lẩu Bò AKING - Lẩu Bò, Lẩu Hải Sản & Lẩu Dê",
      "address": "155 Bùi Xuân Phái, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.2,
      "distanceText": "Cách bạn 1.2km",
      "priceRange": "150.000đ - 300.000đ",
      "rating": 4.3,
      "reviewCount": 0,
      "likesCount": 85,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "hotpot",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7783997,
      "longitude": 109.23090529999999,
      "lat": 13.7783997,
      "lng": 109.23090529999999,
      "moodIds": [
        "celebrate",
        "craving",
        "energetic",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Lẩu_nóng",
        "#Tụ_tập",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhvebd5u3d9a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhvebd5u3d9a@resize_ss640x400"
      ],
      "description": "Quán Lẩu Bò AKING - Lẩu Bò, Lẩu Hải Sản & Lẩu Dê tọa lạc tại 155 Bùi Xuân Phái, P. Trần Hưng Đạo, phục vụ món Lẩu Dê Tươi Thuốc Bắc & Dê Nướng Bản Gang hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Dê Tươi Thuốc Bắc & Dê Nướng Bản Gang tại Lẩu Bò AKING - Lẩu Bò, Lẩu Hải Sản & Lẩu Dê được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 983 139 876",
      "menu": [
        {
          "name": "Nồi Lẩu Dê Tươi Thuốc Bắc",
          "price": "150.000đ",
          "highlight": true
        },
        {
          "name": "Đĩa Dê Nướng Mọi Bản Gang",
          "price": "300.000đ",
          "highlight": false
        },
        {
          "name": "Mì Trứng & Rau Cải Thêm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-bo-aking-lau-bo-lau-hai-san-lau-de",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20B%C3%B2%20AKING%20-%20L%E1%BA%A9u%20B%C3%B2%2C%20L%E1%BA%A9u%20H%E1%BA%A3i%20S%E1%BA%A3n%20%26%20L%E1%BA%A9u%20D%C3%AA",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán nhậu Aking 2 (Quán Gốc)",
      "placeId": "ChIJ960ycm0VbzER8nlNEgQLqAE",
      "gmapsAddr": "153-155 Bùi Xuân Phái Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 150000,
      "priceMax": 300000,
      "attributes": [
        "heavy",
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 68,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Thái Hoà - Trần Đăng Phong",
      "address": "8 Trần Đăng Phong, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.7,
      "distanceText": "Cách bạn 2.7km",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4.8,
      "reviewCount": 0,
      "likesCount": 40,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.758032199999999,
      "longitude": 109.21548469999999,
      "lat": 13.758032199999999,
      "lng": 109.21548469999999,
      "moodIds": [
        "craving",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcwuy8txuh55@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcwuy8txuh55@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Thái Hoà - Trần Đăng Phong tọa lạc tại 8 Trần Đăng Phong, P. Nguyễn Văn Cừ, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Thái Hoà - Trần Đăng Phong được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 938 824 997",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-thai-hoa-tran-dang-phong",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20Th%C3%A1i%20Ho%C3%A0%20-%20Tr%E1%BA%A7n%20%C4%90%C4%83ng%20Phong",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh xèo Thái Hoà",
      "placeId": "ChIJdcNpfT1tbzERa02lHncqJjE",
      "gmapsAddr": "08 Đ. Trần Đăng Phong Quy Nhơn Nam Gia Lai 55107 Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 63,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Giòn A Tốt - Bánh Xèo Hoài Nhơn",
      "address": "957 Trần Hưng Đạo, P. Đống Đa",
      "district": "Tp. Qui Nhơn",
      "distance": 0.4,
      "distanceText": "Cách bạn 400m",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4,
      "reviewCount": 0,
      "likesCount": 15,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7835913,
      "longitude": 109.21634569999999,
      "lat": 13.7835913,
      "lng": 109.21634569999999,
      "moodIds": [
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mojmz7iyw5xrc0@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mojmz7iyw5xrc0@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Giòn A Tốt - Bánh Xèo Hoài Nhơn tọa lạc tại 957 Trần Hưng Đạo, P. Đống Đa, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Giòn A Tốt - Bánh Xèo Hoài Nhơn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3808631",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-gion-a-tot-banh-xeo-hoai-nhon-957-tran-hung-dao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20Gi%C3%B2n%20A%20T%E1%BB%91t%20-%20B%C3%A1nh%20X%C3%A8o%20Ho%C3%A0i%20Nh%C6%A1n%20-%20957%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh xèo giòn a tốt",
      "placeId": "ChIJK8ATcwBtbzERR9Ggzjm2X4A",
      "gmapsAddr": "957 Trần Hưng Đạo Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 71,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Tôm Nhảy Anh Tú",
      "address": "105 Đống Đa, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "distance": 0.5,
      "distanceText": "Cách bạn 450m",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4.9,
      "reviewCount": 0,
      "likesCount": 55,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7838943,
      "longitude": 109.2236004,
      "lat": 13.7838943,
      "lng": 109.2236004,
      "moodIds": [
        "craving",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m48neznv4dzjdc@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m48neznv4dzjdc@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Tôm Nhảy Anh Tú tọa lạc tại 105 Đống Đa, P. Thị Nại, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Tôm Nhảy Anh Tú được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 935 676 568",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-tom-nhay-anh-tu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20T%C3%B4m%20Nh%E1%BA%A3y%20Anh%20T%C3%BA",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh xèo tôm nhảy Anh Tú",
      "placeId": "ChIJRyGiui1tbzERxIi4I77lhjQ",
      "gmapsAddr": "105 Đống Đa Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 70,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Cô Sửu",
      "address": "152 Đào Tấn, P. Nhơn Bình",
      "district": "Tp. Qui Nhơn",
      "distance": 3.4,
      "distanceText": "Cách bạn 3.4km",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 50,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7933653,
      "longitude": 109.1908799,
      "lat": 13.7933653,
      "lng": 109.1908799,
      "moodIds": [
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtbuhx00htl51e@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtbuhx00htl51e@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Cô Sửu tọa lạc tại 152 Đào Tấn, P. Nhơn Bình, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Cô Sửu được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 367 575 839",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-co-suu-152-dao-tan",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20C%C3%B4%20S%E1%BB%ADu%20-%20152%20%C4%90%C3%A0o%20T%E1%BA%A5n",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh Xèo Cô Sửu",
      "placeId": "ChIJ96g1LwBrbzER1P7Yaot0Kog",
      "gmapsAddr": "152 Đào Tấn Quy Nhơn Đông Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 79,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo - Duy Tân",
      "address": "2 Duy Tân",
      "district": "Tp. Qui Nhơn",
      "distance": 1.4,
      "distanceText": "Cách bạn 1.4km",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 95,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.77642,
      "longitude": 109.2321671,
      "lat": 13.77642,
      "lng": 109.2321671,
      "moodIds": [
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbuo9r782qh28@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbuo9r782qh28@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo - Duy Tân tọa lạc tại 2 Duy Tân, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo - Duy Tân được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3810823",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-duy-tan",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20-%20Duy%20T%C3%A2n",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh xèo 02 Duy Tân",
      "placeId": "ChIJJ9r4Eb5tbzER6ENA_lZTjWQ",
      "gmapsAddr": "02 Duy Tân Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 52,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Mực Lá Nướng Sa Tế Muối Ớt Xanh",
      "restaurant": "Mực Khổng Lồ Quy Nhơn - Hải Sản Tươi Sống",
      "address": "166 Xuân Diệu, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "60.000đ - 280.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 60,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.768651799999999,
      "longitude": 109.23149199999999,
      "lat": 13.768651799999999,
      "lng": 109.23149199999999,
      "moodIds": [
        "celebrate",
        "craving",
        "energetic",
        "hangout",
        "seafood",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtbxdcxee4g41d@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtbxdcxee4g41d@resize_ss640x400"
      ],
      "description": "Quán Mực Khổng Lồ Quy Nhơn - Hải Sản Tươi Sống tọa lạc tại 166 Xuân Diệu, P. Trần Phú, phục vụ món Mực Lá Nướng Sa Tế Muối Ớt Xanh hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Mực Lá Nướng Sa Tế Muối Ớt Xanh tại Mực Khổng Lồ Quy Nhơn - Hải Sản Tươi Sống cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 389 484 752",
      "menu": [
        {
          "name": "Mực Lá Nướng Sa Tế Muối Ớt Xanh",
          "price": "60.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Mực Khổng Lồ Quy Nhơn - Hải Sản Tươi Sống",
          "price": "280.000đ",
          "highlight": false
        },
        {
          "name": "Kim chi chua cay & Rau cuốn thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/muc-khong-lo-quy-nhon-hai-san-tuoi-song",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%E1%BB%B1c%20Kh%E1%BB%95ng%20L%E1%BB%93%20Quy%20Nh%C6%A1n%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20T%C6%B0%C6%A1i%20S%E1%BB%91ng",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Mực Khổng Lồ Quy Nhơn",
      "placeId": "ChIJ2VPHSQBtbzEROomUePehZPU",
      "gmapsAddr": "166 Xuân Diệu Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 60000,
      "priceMax": 280000,
      "attributes": [
        "salty",
        "spicy"
      ]
    },
    {
      "id": 81,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
      "restaurant": "Tâm Food - Vườn Ẩm Thực, Đặc Sản & Hải Sản",
      "address": "32 Hải Thượng Lãn Ông, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 1.9,
      "distanceText": "Cách bạn 1.9km",
      "priceRange": "60.000đ - 280.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 5,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7654974,
      "longitude": 109.2262509,
      "lat": 13.7654974,
      "lng": 109.2262509,
      "moodIds": [
        "celebrate",
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcanar0ybo68@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcanar0ybo68@resize_ss640x400"
      ],
      "description": "Quán Tâm Food - Vườn Ẩm Thực, Đặc Sản & Hải Sản tọa lạc tại 32 Hải Thượng Lãn Ông, P. Trần Phú, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Tâm Food - Vườn Ẩm Thực, Đặc Sản & Hải Sản cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "0256 3811097",
      "menu": [
        {
          "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
          "price": "60.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Tâm Food - Vườn Ẩm Thực, Đặc Sản & Hải Sản",
          "price": "280.000đ",
          "highlight": false
        },
        {
          "name": "Bánh mì đặc ruột chấm sốt bơ tỏi",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tam-food-vuon-am-thuc-dac-san-hai-san",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=T%C3%A2m%20Food%20-%20V%C6%B0%E1%BB%9Dn%20%E1%BA%A8m%20Th%E1%BB%B1c%2C%20%C4%90%E1%BA%B7c%20S%E1%BA%A3n%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Tâm Food - Chuyên Đặc Sản Khô Và Tươi Bình Định",
      "placeId": "ChIJPX6EtsZtbzERmWjg69g4sQc",
      "gmapsAddr": "32 Hải Thượng Lãn Ông Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 60000,
      "priceMax": 280000,
      "attributes": [
        "salty",
        "sour"
      ]
    },
    {
      "id": 77,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn",
      "restaurant": "Bánh Xèo Chảo",
      "address": "164 Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4.8,
      "reviewCount": 0,
      "likesCount": 85,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7762289,
      "longitude": 109.2324988,
      "lat": 13.7762289,
      "lng": 109.2324988,
      "moodIds": [
        "craving",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwc2p3m37umz30@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwc2p3m37umz30@resize_ss640x400"
      ],
      "description": "Quán Bánh Xèo Chảo tọa lạc tại 164 Lê Lợi, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm Đậm Vị Quy Nhơn tại Bánh Xèo Chảo được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3810549",
      "menu": [
        {
          "name": "Bánh Xèo Tôm Nhảy (Phần 2 Cái)",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bánh Xèo Bò & Mực Thập Cẩm",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Gói & Rau Mầm Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-chao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20Ch%E1%BA%A3o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh Xèo Chảo Cô Hoa",
      "placeId": "ChIJLcmboCNtbzERB6PEZyWV6Uo",
      "gmapsAddr": "164 Lê Lợi Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 96,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Canh Hẹ Cá Dầm & Bún Riêu Cá Nóng Hổi",
      "restaurant": "Bánh Canh Hẹ & Bún Mắt Cá",
      "address": "169A Lê Lợi, P. Hải Cảng",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "25.000đ - 45.000đ",
      "rating": 4.6,
      "reviewCount": 15,
      "likesCount": 125,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7762511,
      "longitude": 109.23233379999999,
      "lat": 13.7762511,
      "lng": 109.23233379999999,
      "moodIds": [
        "budget",
        "comfort",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu48eu2hrq1f5@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu48eu2hrq1f5@resize_ss640x400"
      ],
      "description": "Quán Bánh Canh Hẹ & Bún Mắt Cá tọa lạc tại 169A Lê Lợi, P. Hải Cảng, phục vụ món Bánh Canh Hẹ Cá Dầm & Bún Riêu Cá Nóng Hổi hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Canh Hẹ Cá Dầm & Bún Riêu Cá Nóng Hổi tại Bánh Canh Hẹ & Bún Mắt Cá được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 935 332 462",
      "menu": [
        {
          "name": "Bánh Canh Hẹ Cá Dầm",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Bún Riêu Cá Thập Cẩm",
          "price": "35.000đ",
          "highlight": false
        },
        {
          "name": "Tô Đặc Biệt Đầy Đủ Chả Cá",
          "price": "45.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-canh-he-bun-mat-ca-169a-le-loi",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20Canh%20H%E1%BA%B9%20%26%20B%C3%BAn%20M%E1%BA%AFt%20C%C3%A1%20-%20169A%20L%C3%AA%20L%E1%BB%A3i",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.7 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán ăn Bún cá & Bánh canh hẹ VÂN QUY NHƠN",
      "placeId": "ChIJNd1ZSD9tbzERE2fDm35ezSE",
      "gmapsAddr": "169A Lê Lợi Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 95,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Kem Sinh Nhật, Bánh Su Kem & Bánh Ngọt Pháp",
      "restaurant": "Tiệm Bánh Tinh Hoa",
      "address": "105 Trần Cao Vân, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "distance": 1.6,
      "distanceText": "Cách bạn 1.6km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 4.1,
      "reviewCount": 15,
      "likesCount": 120,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7721982,
      "longitude": 109.2300764,
      "lat": 13.7721982,
      "lng": 109.2300764,
      "moodIds": [
        "chill",
        "late_night",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoevm12lllb3@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoevm12lllb3@resize_ss640x400"
      ],
      "description": "Tiệm Bánh Tinh Hoa 105 Trần Cao Vân chuyên các loại bánh kem tươi sinh nhật, bánh su kem béo ngậy, bông lan trứng muối và bánh ngọt Pháp thơm lừng mỗi ngày.",
      "recommendReason": "Bánh ngọt và bánh kem tại Tiệm Bánh Tinh Hoa thơm bơ, cốt bánh mềm mịn, vị ngọt thanh không gắt!",
      "hotline": "+84 793 692 525",
      "menu": [
        {
          "name": "Hộp Bánh Su Kem Vanilla (6 cái)",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Bánh Bông Lan Trứng Muối Sốt Phô Mai",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Kem Mini Trái Cây Tươi",
          "price": "65.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tiem-banh-tinh-hoa",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ti%E1%BB%87m%20B%C3%A1nh%20Tinh%20Hoa",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.7 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Tiệm bánh Tinh Hoa",
      "placeId": "ChIJPWRtsYhsbzERppiihdAZ1xM",
      "gmapsAddr": "105 Trần Cao Vân Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 91,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Kem Ý Gelato Tự Chọn Trái Cây Tươi",
      "restaurant": "Kem Pop - Kem Gelato & Yogurt",
      "address": "316 Phan Bội Châu",
      "district": "Tp. Qui Nhơn",
      "distance": 0.9,
      "distanceText": "Cách bạn 900m",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 4,
      "reviewCount": 29,
      "likesCount": 142,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7775419,
      "longitude": 109.2266367,
      "lat": 13.7775419,
      "lng": 109.2266367,
      "moodIds": [
        "budget",
        "chill",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaidvdf1hp569@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaidvdf1hp569@resize_ss640x400"
      ],
      "description": "Quán Kem Pop - Kem Gelato & Yogurt tọa lạc tại 316 Phan Bội Châu, phục vụ món Kem Ý Gelato Tự Chọn Trái Cây Tươi hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Kem Ý Gelato Tự Chọn Trái Cây Tươi tại Kem Pop - Kem Gelato & Yogurt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 333 140 073",
      "menu": [
        {
          "name": "Kem Ý Gelato Tự Chọn Trái Cây Tươi",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Kem Pop - Kem Gelato & Yogurt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Phần món ăn kèm đặc sản tại quán",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/kem-pop-kem-gelato-yogurt",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Kem%20Pop%20-%20Kem%20Gelato%20%26%20Yogurt",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.4 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "POP Tea & Coffee",
      "placeId": "ChIJUQzZ94RsbzERiO9UZHpZ2eQ",
      "gmapsAddr": "316 Phan Bội Châu Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 97,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Đặc Sản Like Kafe",
      "restaurant": "Like Kafe",
      "address": "15 Trường Chinh",
      "district": "Tp. Qui Nhơn",
      "distance": 1.3,
      "distanceText": "Cách bạn 1.3km",
      "priceRange": "35.000đ - 85.000đ",
      "rating": 4.5,
      "reviewCount": 20,
      "likesCount": 145,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.771768699999999,
      "longitude": 109.22459359999999,
      "lat": 13.771768699999999,
      "lng": 109.22459359999999,
      "moodIds": [
        "craving"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdb8hekelsr5b@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdb8hekelsr5b@resize_ss640x400"
      ],
      "description": "Quán Like Kafe tọa lạc tại 15 Trường Chinh, phục vụ món Đặc Sản Like Kafe hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Đặc Sản Like Kafe tại Like Kafe cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "0256 3813289",
      "menu": [
        {
          "name": "Đặc Sản Like Kafe",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Like Kafe",
          "price": "85.000đ",
          "highlight": false
        },
        {
          "name": "Phần món ăn kèm đặc sản tại quán",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/like-kafe",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Like%20Kafe",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.5 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Like Cafe",
      "placeId": "ChIJm7lBVpBsbzERRPPcN6AbgFA",
      "gmapsAddr": "15 Trường Chinh Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 85000,
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 99,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Nướng Trân Châu Đường Đen",
      "restaurant": "Búp Station - Coffee & Milktea",
      "address": "37B Ngô Mây, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.1,
      "distanceText": "Cách bạn 2.1km",
      "priceRange": "25.000đ - 55.000đ",
      "rating": 4,
      "reviewCount": 18,
      "likesCount": 149,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7633952,
      "longitude": 109.2165517,
      "lat": 13.7633952,
      "lng": 109.2165517,
      "moodIds": [
        "budget",
        "chill",
        "date",
        "energetic",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaygvh4c63f95@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaygvh4c63f95@resize_ss640x400"
      ],
      "description": "Quán Búp Station - Coffee & Milktea tọa lạc tại 37B Ngô Mây, P. Nguyễn Văn Cừ, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại Búp Station - Coffee & Milktea cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 256 3747 968",
      "menu": [
        {
          "name": "Trà Sữa Nướng Trân Châu Đường Đen",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Búp Station - Coffee & Milktea",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Kim chi chua cay & Rau cuốn thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bup-station-coffee-milktea",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAp%20Station%20-%20Coffee%20%26%20Milktea",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.5 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bup Station",
      "placeId": "ChIJMYh0S-tsbzERIw8Uc92doMo",
      "gmapsAddr": "37b Ngô Mây Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 55000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 100,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Tấm Sườn Bì Chả Trứng Ốp La",
      "restaurant": "Cơm Tấm 173",
      "address": "173 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "distance": 1.8,
      "distanceText": "Cách bạn 1.8km",
      "priceRange": "30.000đ - 55.000đ",
      "rating": 4.1,
      "reviewCount": 12,
      "likesCount": 36,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "rice",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7683287,
      "longitude": 109.2291456,
      "lat": 13.7683287,
      "lng": 109.2291456,
      "moodIds": [
        "budget"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Rice",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstzjoafus3o3d@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstzjoafus3o3d@resize_ss640x400"
      ],
      "description": "Quán Cơm Tấm 173 tọa lạc tại 173 Nguyễn Huệ, phục vụ món Cơm Tấm Sườn Bì Chả Trứng Ốp La hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cơm Tấm Sườn Bì Chả Trứng Ốp La tại Cơm Tấm 173 được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 904 732 427",
      "menu": [
        {
          "name": "Dĩa Cơm Tấm Sườn Nướng",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Cơm Tấm Sườn Bì Chả Trứng",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Canh Khổ Qua Nhồi Thịt",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-tam-173",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20T%E1%BA%A5m%20173",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.7 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Cơm Tấm 173",
      "placeId": "ChIJ-fQmqY5sbzERXqijEb9vauI",
      "gmapsAddr": "173 Nguyễn Huệ Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 55000,
      "attributes": [
        "heavy"
      ]
    },
    {
      "id": 105,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn",
      "restaurant": "Bò Né Phạm Gia",
      "address": "10 Trường Chinh",
      "district": "Tp. Qui Nhơn",
      "distance": 1.2,
      "distanceText": "Cách bạn 1.2km",
      "priceRange": "35.000đ - 65.000đ",
      "rating": 4.2,
      "reviewCount": 19,
      "likesCount": 82,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "bbq",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7719019,
      "longitude": 109.2241014,
      "lat": 13.7719019,
      "lng": 109.2241014,
      "moodIds": [
        "budget",
        "energetic",
        "quick"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bbq",
        "#ShopeeFood",
        "#Xì_xèo"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaktywxsmhnce@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaktywxsmhnce@resize_ss640x400"
      ],
      "description": "Quán Bò Né Phạm Gia tọa lạc tại 10 Trường Chinh, phục vụ món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn tại Bò Né Phạm Gia được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3814385",
      "menu": [
        {
          "name": "Phần Bò Né Trứng Ốp La",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Bò Né Thập Cẩm Pate Bò Xíu Mại",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Nóng Giòn Thêm",
          "price": "5.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bo-ne-pham-gia-truong-chinh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%B2%20N%C3%A9%20Ph%E1%BA%A1m%20Gia%20-%20Tr%C6%B0%E1%BB%9Dng%20Chinh",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.4 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bò Né Phạm Gia",
      "placeId": "ChIJqbuXLVJtbzERYfFSHpKneNI",
      "gmapsAddr": "10 Trường Chinh Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "heavy"
      ]
    },
    {
      "id": 107,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
      "restaurant": "BBQ Garden",
      "address": "290 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "80.000đ - 220.000đ",
      "rating": 5,
      "reviewCount": 5,
      "likesCount": 50,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "bbq",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.766555799999999,
      "longitude": 109.2281386,
      "lat": 13.766555799999999,
      "lng": 109.2281386,
      "moodIds": [
        "celebrate",
        "craving",
        "energetic",
        "hangout",
        "late_night"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bbq",
        "#ShopeeFood",
        "#Xì_xèo"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9syof8u0ntfa@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9syof8u0ntfa@resize_ss640x400"
      ],
      "description": "Quán BBQ Garden tọa lạc tại 290 Xuân Diệu, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại BBQ Garden cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "0256 3814659",
      "menu": [
        {
          "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
          "price": "80.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt BBQ Garden",
          "price": "220.000đ",
          "highlight": false
        },
        {
          "name": "Kim chi chua cay & Rau cuốn thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bbq-garden",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=BBQ%20Garden",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "5.0 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bbq Garden",
      "placeId": "ChIJbf0CaoxsbzERSLo8uF0wzLY",
      "gmapsAddr": "290 Xuân Diệu Quy Nhơn Gia Lai 840256 Việt Nam",
      "priceMin": 80000,
      "priceMax": 220000,
      "attributes": [
        "heavy",
        "salty"
      ]
    },
    {
      "id": 84,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Nướng Trân Châu Đường Đen",
      "restaurant": "Chu’s Coffee & Fruit",
      "address": "184 Cần Vương",
      "district": "Tp. Qui Nhơn",
      "distance": 3.3,
      "distanceText": "Cách bạn 3.3km",
      "priceRange": "25.000đ - 55.000đ",
      "rating": 4.4,
      "reviewCount": 13,
      "likesCount": 59,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.753511399999999,
      "longitude": 109.2103805,
      "lat": 13.753511399999999,
      "lng": 109.2103805,
      "moodIds": [
        "budget",
        "chill",
        "date",
        "energetic",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8f0ywl31zv95@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8f0ywl31zv95@resize_ss640x400"
      ],
      "description": "Quán Chu’s Coffee & Fruit tọa lạc tại 184 Cần Vương, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại Chu’s Coffee & Fruit cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 896 215 591",
      "menu": [
        {
          "name": "Trà Sữa Nướng Trân Châu Đường Đen",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Chu’s Coffee & Fruit",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Kim chi chua cay & Rau cuốn thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/chus-coffee-fruit",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Chu%E2%80%99s%20Coffee%20%26%20Fruit",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.9 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "CHU’S Coffee&Fruit",
      "placeId": "ChIJ19l7wqptbzER17cIn8qB-3A",
      "gmapsAddr": "184 Cần Vương Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 55000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 112,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Pizza Hải Sản Phô Mai Đút Lò",
      "restaurant": "Monza Pizza Quy Nhơn",
      "address": "44 Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 2.2,
      "distanceText": "Cách bạn 2.2km",
      "priceRange": "95.000đ - 195.000đ",
      "rating": 4.2,
      "reviewCount": 5,
      "likesCount": 75,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7624076,
      "longitude": 109.2186445,
      "lat": 13.7624076,
      "lng": 109.2186445,
      "moodIds": [
        "celebrate",
        "craving",
        "date",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8klnpawbtnbe@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8klnpawbtnbe@resize_ss640x400"
      ],
      "description": "Quán Monza Pizza Quy Nhơn tọa lạc tại 44 Ngô Mây, phục vụ món Pizza Hải Sản Phô Mai Đút Lò hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Pizza Hải Sản Phô Mai Đút Lò tại Monza Pizza Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 938 954 170",
      "menu": [
        {
          "name": "Pizza Hải Sản Phô Mai Đút Lò",
          "price": "95.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Monza Pizza Quy Nhơn",
          "price": "195.000đ",
          "highlight": false
        },
        {
          "name": "Bánh mì đặc ruột chấm sốt bơ tỏi",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/monza-pizza-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Monza%20Pizza%20Quy%20Nh%C6%A1n",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.9 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "MONZA PIZZA QUY NHƠN",
      "placeId": "ChIJwezOWPVtbzERAqesWPD5R_I",
      "gmapsAddr": "44 Ngô Mây Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 95000,
      "priceMax": 195000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 89,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái",
      "restaurant": "Face Quán - Các Món Ăn Vặt",
      "address": "29 Nguyễn Nhạc, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 2.1,
      "distanceText": "Cách bạn 2.1km",
      "priceRange": "15.000đ - 45.000đ",
      "rating": 4.7,
      "reviewCount": 14,
      "likesCount": 87,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7635642,
      "longitude": 109.2185136,
      "lat": 13.7635642,
      "lng": 109.2185136,
      "moodIds": [
        "budget",
        "craving",
        "energetic",
        "hangout",
        "late_night",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Ăn_vặt",
        "#Đặc_sản_địa_phương",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdg0i048xy310@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdg0i048xy310@resize_ss640x400"
      ],
      "description": "Quán Face Quán - Các Món Ăn Vặt tọa lạc tại 29 Nguyễn Nhạc, P. Ngô Mây, phục vụ món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái tại Face Quán - Các Món Ăn Vặt được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 382 729 001",
      "menu": [
        {
          "name": "Bánh Tráng Nướng Trứng Cút",
          "price": "15.000đ",
          "highlight": true
        },
        {
          "name": "Chân Gà Sốt Thái Chua Cay",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Trà Đào Cam Sả Mát Lạnh",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/face-quan-cac-mon-an-vat",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Face%20Qu%C3%A1n%20-%20C%C3%A1c%20M%C3%B3n%20%C4%82n%20V%E1%BA%B7t",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.8 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Face Quán",
      "placeId": "ChIJGV07TJNsbzERCBTK8WVkgDI",
      "gmapsAddr": "29 Nguyễn Nhạc Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 15000,
      "priceMax": 45000,
      "attributes": [
        "crunchy",
        "sour",
        "spicy"
      ]
    },
    {
      "id": 115,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh",
      "restaurant": "Cơm Chay Tâm Thiện",
      "address": "114 Tăng Bạt Hổ, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 4.3,
      "reviewCount": 6,
      "likesCount": 93,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.773330699999999,
      "longitude": 109.22982999999999,
      "lat": 13.773330699999999,
      "lng": 109.22982999999999,
      "moodIds": [
        "energetic",
        "healthy",
        "tired",
        "zen"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Rice",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdt19h742qj7a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdt19h742qj7a@resize_ss640x400"
      ],
      "description": "Quán Cơm Chay Tâm Thiện tọa lạc tại 114 Tăng Bạt Hổ, P. Trần Hưng Đạo, phục vụ món Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh tại Cơm Chay Tâm Thiện được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 256 3821 100",
      "menu": [
        {
          "name": "Cơm Chay Tự Chọn",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Lẩu Nấm Dưỡng Sinh Chay",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Chả Giò Chay Giòn Rụm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-chay-tam-thien",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20Chay%20T%C3%A2m%20Thi%E1%BB%87n",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.7 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Nhà Hàng Cơm Chay Tâm Thiện",
      "placeId": "ChIJdf9ZU49sbzERndkZ6zxuzBs",
      "gmapsAddr": "114 Tăng Bạt Hổ Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "heavy",
        "hot_soup",
        "light"
      ]
    },
    {
      "id": 113,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái",
      "restaurant": "Puppy Tea - Trà Sữa & Ăn Vặt",
      "address": "3 Trần Thị Kỷ",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "15.000đ - 45.000đ",
      "rating": 4.8,
      "reviewCount": 15,
      "likesCount": 110,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7685075,
      "longitude": 109.2198301,
      "lat": 13.7685075,
      "lng": 109.2198301,
      "moodIds": [
        "budget",
        "chill",
        "craving",
        "energetic",
        "late_night",
        "refreshing",
        "spicy",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8svuxmu2fv83@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8svuxmu2fv83@resize_ss640x400"
      ],
      "description": "Quán Puppy Tea - Trà Sữa & Ăn Vặt tọa lạc tại 3 Trần Thị Kỷ, phục vụ món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái tại Puppy Tea - Trà Sữa & Ăn Vặt được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3815481",
      "menu": [
        {
          "name": "Bánh Tráng Nướng Trứng Cút",
          "price": "15.000đ",
          "highlight": true
        },
        {
          "name": "Chân Gà Sốt Thái Chua Cay",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Trà Đào Cam Sả Mát Lạnh",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/puppy-tea-tra-sua-an-vat",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Puppy%20Tea%20-%20Tr%C3%A0%20S%E1%BB%AFa%20%26%20%C4%82n%20V%E1%BA%B7t",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.3 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Puppy cafe",
      "placeId": "ChIJl_4X35NsbzERYoX4PVDV-wI",
      "gmapsAddr": "3 Trần Thị Kỷ Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 15000,
      "priceMax": 45000,
      "attributes": [
        "crunchy",
        "drinks",
        "sour",
        "spicy"
      ]
    },
    {
      "id": 98,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Bò Huế Đậm Đà Chân Giò Bắp Bò",
      "restaurant": "Bún Bò Hẻm",
      "address": "158 Diên Hồng",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "35.000đ - 55.000đ",
      "rating": 4.1,
      "reviewCount": 16,
      "likesCount": 138,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7687349,
      "longitude": 109.220462,
      "lat": 13.7687349,
      "lng": 109.220462,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "late_night"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbvw3eikesb32@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbvw3eikesb32@resize_ss640x400"
      ],
      "description": "Quán Bún Bò Hẻm tọa lạc tại 158 Diên Hồng, phục vụ món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò tại Bún Bò Hẻm được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 774 148 925",
      "menu": [
        {
          "name": "Bún Bò Nạm Giò",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Bò Huế Đặc Biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Chả Cua Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-bo-hem",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20B%C3%B2%20H%E1%BA%BBm",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Bò Hẻm",
      "placeId": "ChIJJ8yexj5tbzER9YI-VeNS2Cs",
      "gmapsAddr": "158 Diên Hồng Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 55000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 116,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn",
      "restaurant": "Bánh Hỏi - Cháo Lòng - Cháo Lươn Anh Thư",
      "address": "144 Nguyễn Huệ, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 4.4,
      "reviewCount": 4,
      "likesCount": 92,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.764409599999999,
      "longitude": 109.223362,
      "lat": 13.764409599999999,
      "lng": 109.223362,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "late_night",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbn98ngu57f1f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbn98ngu57f1f@resize_ss640x400"
      ],
      "description": "Quán Bánh Hỏi - Cháo Lòng - Cháo Lươn Anh Thư tọa lạc tại 144 Nguyễn Huệ, P. Trần Phú, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn tại Bánh Hỏi - Cháo Lòng - Cháo Lươn Anh Thư được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 935 084 868",
      "menu": [
        {
          "name": "Bánh Hỏi Heo Quay / Lòng Heo",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Bánh Hỏi Cháo Lòng Đặc Biệt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Tô Cháo Huyết Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-chao-luon-anh-thu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20-%20Ch%C3%A1o%20L%C3%B2ng%20-%20Ch%C3%A1o%20L%C6%B0%C6%A1n%20Anh%20Th%C6%B0",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.8 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh Hỏi Cháo Lòng Anh Thư – Đặc Sản Quy Nhơn",
      "placeId": "ChIJ5T5RrDptbzERfo46Y8Q5hgs",
      "gmapsAddr": "144B Nguyễn Huệ Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 119,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Mẹt Bún Đậu Mắm Tôm Thập Cẩm Dồi Sụn Chả Cốm",
      "restaurant": "Ẩm Thực Đậu - Bún Đậu Mắm Tôm",
      "address": "24 Nguyễn Lữ, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "35.000đ - 75.000đ",
      "rating": 4.2,
      "reviewCount": 6,
      "likesCount": 113,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7638006,
      "longitude": 109.21788699999999,
      "lat": 13.7638006,
      "lng": 109.21788699999999,
      "moodIds": [
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Ăn_vặt",
        "#Đặc_sản_địa_phương",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu7wliqqf2cee@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu7wliqqf2cee@resize_ss640x400"
      ],
      "description": "Quán Ẩm Thực Đậu - Bún Đậu Mắm Tôm tọa lạc tại 24 Nguyễn Lữ, P. Ngô Mây, phục vụ món Mẹt Bún Đậu Mắm Tôm Thập Cẩm Dồi Sụn Chả Cốm hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Mẹt Bún Đậu Mắm Tôm Thập Cẩm Dồi Sụn Chả Cốm tại Ẩm Thực Đậu - Bún Đậu Mắm Tôm được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 333 370 011",
      "menu": [
        {
          "name": "Mẹt Bún Đậu Đầy Đủ",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Bún Đậu Đặc Biệt 2 Người",
          "price": "75.000đ",
          "highlight": false
        },
        {
          "name": "Nem Chua Rán & Chả Cốm Thêm",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/am-thuc-dau-bun-dau-mam-tom-24-nguyen-lu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BA%A8m%20Th%E1%BB%B1c%20%C4%90%E1%BA%ADu%20-%20B%C3%BAn%20%C4%90%E1%BA%ADu%20M%E1%BA%AFm%20T%C3%B4m%20-%2024%20Nguy%E1%BB%85n%20L%E1%BB%AF",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.5 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ẩm thực Đậu - Bún đậu mắm tôm Quy Nhơn",
      "placeId": "ChIJc3-GUQJtbzERUnucXeF0XP4",
      "gmapsAddr": "24 Nguyễn Lữ Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 75000,
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 124,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Phá Lấu Bò Nước Cốt Dừa Ăn Kèm Bánh Mì",
      "restaurant": "Phá Lấu Ông Hiệu - Nguyễn Công Trứ",
      "address": "16 Nguyễn Công Trứ, P. Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "distance": 1.1,
      "distanceText": "Cách bạn 1.1km",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 4.3,
      "reviewCount": 1,
      "likesCount": 23,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7742556,
      "longitude": 109.2260417,
      "lat": 13.7742556,
      "lng": 109.2260417,
      "moodIds": [
        "budget",
        "quick",
        "refreshing"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Ăn_vặt",
        "#Phá_lấu",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcl78n10p00c@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcl78n10p00c@resize_ss640x400"
      ],
      "description": "Quán Phá Lấu Ông Hiệu - Nguyễn Công Trứ tọa lạc tại 16 Nguyễn Công Trứ, P. Lê Hồng Phong, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Phá Lấu Ông Hiệu - Nguyễn Công Trứ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 971 455 557",
      "menu": [
        {
          "name": "Chén Phá Lấu Bò Thập Cẩm",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Phá Lấu Bò Đặc Biệt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Nóng Giòn Thêm",
          "price": "5.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/pha-lau-ong-hieu-nguyen-cong-tru",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ph%C3%A1%20L%E1%BA%A5u%20%C3%94ng%20Hi%E1%BB%87u%20-%20Nguy%E1%BB%85n%20C%C3%B4ng%20Tr%E1%BB%A9",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "5.0 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Phá Lấu Ông Hiệu",
      "placeId": "ChIJZeIiW4ZsbzERsTHTHHEb898",
      "gmapsAddr": "16 Nguyễn Công Trứ Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "crunchy",
        "heavy",
        "hot_soup",
        "salty",
        "spicy"
      ]
    },
    {
      "id": 125,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn",
      "restaurant": "Bò Né 3 Ngon - Bò Quanh Lửa Hồng - Nguyễn Tư",
      "address": "32 Nguyễn Tư",
      "district": "Tp. Qui Nhơn",
      "distance": 1.7,
      "distanceText": "Cách bạn 1.7km",
      "priceRange": "35.000đ - 65.000đ",
      "rating": 4.3,
      "reviewCount": 4,
      "likesCount": 37,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "bbq",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.766353899999999,
      "longitude": 109.2204922,
      "lat": 13.766353899999999,
      "lng": 109.2204922,
      "moodIds": [
        "budget",
        "energetic",
        "late_night",
        "quick"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bbq",
        "#ShopeeFood",
        "#Xì_xèo"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgzk31e1xi319@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgzk31e1xi319@resize_ss640x400"
      ],
      "description": "Quán Bò Né 3 Ngon - Bò Quanh Lửa Hồng - Nguyễn Tư tọa lạc tại 32 Nguyễn Tư, phục vụ món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn tại Bò Né 3 Ngon - Bò Quanh Lửa Hồng - Nguyễn Tư được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 766 656 661",
      "menu": [
        {
          "name": "Phần Bò Né Trứng Ốp La",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Bò Né Thập Cẩm Pate Bò Xíu Mại",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Nóng Giòn Thêm",
          "price": "5.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bo-ne-3-ngon-bo-quanh-lua-hong-nguyen-tu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%B2%20N%C3%A9%203%20Ngon%20-%20B%C3%B2%20Quanh%20L%E1%BB%ADa%20H%E1%BB%93ng%20-%20Nguy%E1%BB%85n%20T%C6%B0",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.5 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "BÒ NÉ 3 NGON - 32 Nguyễn Tư, Quy Nhơn",
      "placeId": "ChIJrbWRq5NsbzERTbZjl7thbyg",
      "gmapsAddr": "32 Nguyễn Tư Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "heavy"
      ]
    },
    {
      "id": 103,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cà Phê Muối View Biển Ngắm Sóng",
      "restaurant": "TP66 Cafe",
      "address": "66 Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 1.1,
      "distanceText": "Cách bạn 1.1km",
      "priceRange": "25.000đ - 55.000đ",
      "rating": 4.1,
      "reviewCount": 16,
      "likesCount": 63,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7742008,
      "longitude": 109.2257618,
      "lat": 13.7742008,
      "lng": 109.2257618,
      "moodIds": [
        "budget",
        "chill",
        "date",
        "sweet"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#View_biển"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvi0pkfbvf45@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvi0pkfbvf45@resize_ss640x400"
      ],
      "description": "Quán TP66 Cafe tọa lạc tại 66 Trần Phú, phục vụ món Cà Phê Muối View Biển Ngắm Sóng hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cà Phê Muối View Biển Ngắm Sóng tại TP66 Cafe cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 935 477 899",
      "menu": [
        {
          "name": "Cà Phê Muối View Biển Ngắm Sóng",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt TP66 Cafe",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Phần món ăn kèm đặc sản tại quán",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tp66-cafe",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=TP66%20Cafe",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.5 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Cafe TP66",
      "placeId": "ChIJ25AjZIVsbzERe1mKVhJ_oKQ",
      "gmapsAddr": "66 Trần Phú Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 55000,
      "attributes": [
        "drinks"
      ]
    },
    {
      "id": 122,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo",
      "restaurant": "Bánh Bèo - Bánh Lọc",
      "address": "79 Vũ Bảo, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 1.9,
      "distanceText": "Cách bạn 1.9km",
      "priceRange": "20.000đ - 50.000đ",
      "rating": 4.8,
      "reviewCount": 2,
      "likesCount": 16,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.766086699999999,
      "longitude": 109.21889979999999,
      "lat": 13.766086699999999,
      "lng": 109.21889979999999,
      "moodIds": [
        "budget",
        "late_night",
        "quick",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Streetfood",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh9pxaqz10b94@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh9pxaqz10b94@resize_ss640x400"
      ],
      "description": "Quán Bánh Bèo - Bánh Lọc tọa lạc tại 79 Vũ Bảo, P. Ngô Mây, phục vụ món Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo tại Bánh Bèo - Bánh Lọc cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "0256 3816714",
      "menu": [
        {
          "name": "Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo",
          "price": "20.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Bánh Bèo - Bánh Lọc",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Phần món ăn kèm đặc sản tại quán",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-beo-banh-loc",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20B%C3%A8o%20-%20B%C3%A1nh%20L%E1%BB%8Dc",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.8 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh bèo bánh tai vạt bánh gói",
      "placeId": "ChIJndbZNS1tbzERHr2-kl49AKk",
      "gmapsAddr": "79 Vũ Bảo Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 20000,
      "priceMax": 50000,
      "attributes": [
        "light",
        "salty"
      ]
    },
    {
      "id": 126,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
      "restaurant": "Cơm Gà Tuyết Nhung",
      "address": "320A Nguyễn Thái Học",
      "district": "Tp. Qui Nhơn",
      "distance": 1.7,
      "distanceText": "Cách bạn 1.7km",
      "priceRange": "35.000đ - 65.000đ",
      "rating": 4.1,
      "reviewCount": 5,
      "likesCount": 45,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "rice",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7671117,
      "longitude": 109.21602399999999,
      "lat": 13.7671117,
      "lng": 109.21602399999999,
      "moodIds": [
        "craving"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Rice",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu14oy61byc4a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu14oy61byc4a@resize_ss640x400"
      ],
      "description": "Quán Cơm Gà Tuyết Nhung tọa lạc tại 320A Nguyễn Thái Học, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Gà Tuyết Nhung được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 932 625 053",
      "menu": [
        {
          "name": "Đĩa Cơm Gà Xối Mỡ Giòn",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Phần Cơm Đùi Gà Rán Đặc Biệt",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Canh Rong Biển Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-ga-tuyet-nhung-nguyen-thai-hoc",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20G%C3%A0%20Tuy%E1%BA%BFt%20Nhung%20-%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.4 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Tiệm Cơm Gà Tuyết Nhung",
      "placeId": "ChIJ3X7mQpRsbzERM_QNiCB_eLU",
      "gmapsAddr": "320C Nguyễn Thái Học Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "heavy"
      ]
    },
    {
      "id": 127,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt",
      "restaurant": "Bún Chả Cá Cô Hạnh",
      "address": "126 Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 2.2,
      "distanceText": "Cách bạn 2.2km",
      "priceRange": "30.000đ - 45.000đ",
      "rating": 4.3,
      "reviewCount": 2,
      "likesCount": 41,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.775025,
      "longitude": 109.23412069999999,
      "lat": 13.775025,
      "lng": 109.23412069999999,
      "moodIds": [
        "budget",
        "healthy",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8jct2pbi6z7a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8jct2pbi6z7a@resize_ss640x400"
      ],
      "description": "Quán Bún Chả Cá Cô Hạnh tọa lạc tại 126 Trần Hưng Đạo, phục vụ món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt tại Bún Chả Cá Cô Hạnh được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 987 347 431",
      "menu": [
        {
          "name": "Bún Chả Cá Nóng Hổi",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Sứa Cá Dầm Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Chả Cá Chiên Nóng",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-co-hanh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20C%C3%B4%20H%E1%BA%A1nh",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.7 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Chả Cá Cô Hạnh",
      "placeId": "ChIJu90DvodsbzERmVhC3N4uHrI",
      "gmapsAddr": "126 Trần Hưng Đạo Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "sour"
      ]
    },
    {
      "id": 135,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
      "restaurant": "Kichi Kichi Lẩu Băng Chuyền",
      "address": "27 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.7,
      "distanceText": "Cách bạn 2.7km",
      "priceRange": "150.000đ - 350.000đ",
      "rating": 4.9,
      "reviewCount": 2,
      "likesCount": 81,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "hotpot",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.758173699999999,
      "longitude": 109.2144534,
      "lat": 13.758173699999999,
      "lng": 109.2144534,
      "moodIds": [
        "celebrate",
        "craving",
        "energetic",
        "seafood",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9hmfityuah01@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9hmfityuah01@resize_ss640x400"
      ],
      "description": "Quán Kichi Kichi Lẩu Băng Chuyền tọa lạc tại 27 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Kichi Kichi Lẩu Băng Chuyền cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 256 7300 603",
      "menu": [
        {
          "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
          "price": "150.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Kichi Kichi Lẩu Băng Chuyền - Nguyễn Thị Định",
          "price": "350.000đ",
          "highlight": false
        },
        {
          "name": "Bánh mì đặc ruột chấm sốt bơ tỏi",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/kichi-kichi-lau-bang-chuyen-nguyen-thi-dinh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Kichi%20Kichi%20L%E1%BA%A9u%20B%C4%83ng%20Chuy%E1%BB%81n%20-%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20%C4%90%E1%BB%8Bnh",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Kichi-Kichi An Dương Vương Bình Định",
      "placeId": "ChIJF7uQ3QNtbzERnyntPYfn_4E",
      "gmapsAddr": "Lô 27 Nguyễn Thị Định Quy Nhơn Nam Gia Lai 55000 Việt Nam",
      "priceMin": 150000,
      "priceMax": 350000,
      "attributes": [
        "heavy",
        "hot_soup",
        "salty",
        "spicy"
      ]
    },
    {
      "id": 155,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh",
      "restaurant": "Cơm Chay Hiển Nam",
      "address": "30A Trần Thị Kỷ",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 4.4,
      "reviewCount": 1,
      "likesCount": 78,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7683863,
      "longitude": 109.2201355,
      "lat": 13.7683863,
      "lng": 109.2201355,
      "moodIds": [
        "energetic",
        "healthy",
        "late_night",
        "tired",
        "zen"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Rice",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe6fb5abcntc2@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe6fb5abcntc2@resize_ss640x400"
      ],
      "description": "Quán Cơm Chay Hiển Nam tọa lạc tại 30A Trần Thị Kỷ, phục vụ món Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh tại Cơm Chay Hiển Nam được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 256 2211 148",
      "menu": [
        {
          "name": "Cơm Chay Tự Chọn",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Lẩu Nấm Dưỡng Sinh Chay",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Chả Giò Chay Giòn Rụm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-chay-hien-nam",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20Chay%20Hi%E1%BB%83n%20Nam",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Cơm Chay Hiển Nam",
      "placeId": "ChIJJc_T0JNsbzERGyZDAKcNX50",
      "gmapsAddr": "3 Trần Thị Kỷ Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "heavy",
        "hot_soup",
        "light"
      ]
    },
    {
      "id": 159,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
      "restaurant": "Sam BBQ",
      "address": "88 Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "distance": 1.7,
      "distanceText": "Cách bạn 1.7km",
      "priceRange": "80.000đ - 220.000đ",
      "rating": 4.3,
      "reviewCount": 2,
      "likesCount": 101,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "bbq",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.773514299999999,
      "longitude": 109.23204109999999,
      "lat": 13.773514299999999,
      "lng": 109.23204109999999,
      "moodIds": [
        "celebrate",
        "craving",
        "energetic",
        "hangout"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bbq",
        "#ShopeeFood",
        "#Xì_xèo"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9s9qqf9w4b91@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9s9qqf9w4b91@resize_ss640x400"
      ],
      "description": "Quán Sam BBQ tọa lạc tại 88 Lê Lợi, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Sam BBQ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "0256 3821783",
      "menu": [
        {
          "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
          "price": "80.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Sam BBQ",
          "price": "220.000đ",
          "highlight": false
        },
        {
          "name": "Kim chi chua cay & Rau cuốn thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/sam-bbq",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Sam%20BBQ",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.3 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Sam Bbq",
      "placeId": "ChIJG2ofKIZsbzERk04R-bL1oTs",
      "gmapsAddr": "88 Lê Lợi Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 80000,
      "priceMax": 220000,
      "attributes": [
        "heavy",
        "salty"
      ]
    },
    {
      "id": 145,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me",
      "restaurant": "Ốc Biển Mai",
      "address": "21 Trần Cao Vân",
      "district": "Tp. Qui Nhơn",
      "distance": 1.8,
      "distanceText": "Cách bạn 1.8km",
      "priceRange": "35.000đ - 120.000đ",
      "rating": 5,
      "reviewCount": 1,
      "likesCount": 28,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.770140699999999,
      "longitude": 109.23073939999999,
      "lat": 13.770140699999999,
      "lng": 109.23073939999999,
      "moodIds": [
        "craving",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkkjjdzs9l8b@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkkjjdzs9l8b@resize_ss640x400"
      ],
      "description": "Quán Ốc Biển Mai tọa lạc tại 21 Trần Cao Vân, phục vụ món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me tại Ốc Biển Mai được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 346 247 898",
      "menu": [
        {
          "name": "Đĩa Ốc Móng Tay Xào Rau Muống",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Ốc Hương Sốt Trứng Muối Béo Ngậy",
          "price": "120.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Chấm Sốt Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-bien-mai",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Bi%E1%BB%83n%20Mai",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.7 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Ốc Biển Mai",
      "placeId": "ChIJwVz-PYlsbzER7JsL47XGlB0",
      "gmapsAddr": "21 Trần Cao Vân Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 120000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 180,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Trộn Bibimbap, Mì Tương Đen & Kimbap",
      "restaurant": "Hannam Korean Food",
      "address": "138 Ngô Mây, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "35.000đ - 85.000đ",
      "rating": 4.7,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.764118,
      "longitude": 109.2157728,
      "lat": 13.764118,
      "lng": 109.2157728,
      "moodIds": [
        "craving"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Đồ_Hàn",
        "#Món_ngon",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mhn6zrqirif6a5@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-820l4-mhn6zrqirif6a5@resize_ss640x400"
      ],
      "description": "Quán Hannam Korean Food tọa lạc tại 138 Ngô Mây, P. Nguyễn Văn Cừ, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hannam Korean Food cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 886 595 845",
      "menu": [
        {
          "name": "Thố Cơm Trộn Hàn Quốc",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Gà Sốt Cay Phô Mai",
          "price": "85.000đ",
          "highlight": false
        },
        {
          "name": "Canh Rong Biển Thịt Bò",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/hannam-korean-food-138-ngo-may",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Hannam%20Korean%20Food%20-%20138%20Ng%C3%B4%20M%C3%A2y",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Hannam Korean Food 한남식당",
      "placeId": "ChIJHcQYYZZtbzEReMcFkveKAhA",
      "gmapsAddr": "138 Ngô Mây Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 85000,
      "attributes": [
        "salty",
        "sour"
      ]
    },
    {
      "id": 181,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me",
      "restaurant": "Ốc Thoa",
      "address": "2 Bà Triệu, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "35.000đ - 120.000đ",
      "rating": 4.8,
      "reviewCount": 0,
      "likesCount": 5,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.771531999999999,
      "longitude": 109.22792199999999,
      "lat": 13.771531999999999,
      "lng": 109.22792199999999,
      "moodIds": [
        "craving",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mqbhto7hpdzh82@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mqbhto7hpdzh82@resize_ss640x400"
      ],
      "description": "Quán Ốc Thoa tọa lạc tại 2 Bà Triệu, P. Trần Phú, phục vụ món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me tại Ốc Thoa được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 974 430 420",
      "menu": [
        {
          "name": "Đĩa Ốc Móng Tay Xào Rau Muống",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Ốc Hương Sốt Trứng Muối Béo Ngậy",
          "price": "120.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Chấm Sốt Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-thoa-02-ba-trieu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Thoa%20-%2002%20B%C3%A0%20Tri%E1%BB%87u",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ốc Thoa Quy Nhơn",
      "placeId": "ChIJVwsnoGVtbzERihySIRdfr9A",
      "gmapsAddr": "02 Bà Triệu Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 120000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 179,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Mì Cay 7 Cấp Độ, Gà Sốt Cay & Tokbokki Phô Mai",
      "restaurant": "Mì Cay Sasin Quy Nhơn",
      "address": "244 - 246 Lê Hồng Phong, P.Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.2,
      "distanceText": "Cách bạn 1.2km",
      "priceRange": "35.000đ - 75.000đ",
      "rating": 4.3,
      "reviewCount": 0,
      "likesCount": 95,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.774525299999999,
      "longitude": 109.2274205,
      "lat": 13.774525299999999,
      "lng": 109.2274205,
      "moodIds": [
        "late_night",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Ăn_vặt",
        "#Đặc_sản_địa_phương",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lz4c6pptt26l46@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lz4c6pptt26l46@resize_ss640x400"
      ],
      "description": "Quán Mì Cay Sasin Quy Nhơn tọa lạc tại 244 - 246 Lê Hồng Phong, P.Trần Hưng Đạo, phục vụ món Mì Cay 7 Cấp Độ, Gà Sốt Cay & Tokbokki Phô Mai hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Mì Cay 7 Cấp Độ, Gà Sốt Cay & Tokbokki Phô Mai tại Mì Cay Sasin Quy Nhơn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 961 565 850",
      "menu": [
        {
          "name": "Tô Mì Cay Hải Sản Cấp Độ 2",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Gà Rán Sốt Cay & Tokbokki",
          "price": "75.000đ",
          "highlight": false
        },
        {
          "name": "Trà Sữa Thái Xanh",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/mi-cay-sasin-quy-nhon-le-hong-phong",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%C3%AC%20Cay%20Sasin%20Quy%20Nh%C6%A1n%20-%20L%C3%AA%20H%E1%BB%93ng%20Phong",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Sasin - Mì cay Hàn Quốc",
      "placeId": "ChIJZ7fAFPNtbzERSvIOwBjJcAk",
      "gmapsAddr": "244 - 246 Lê Hồng Phong Quy Nhơn Gia Lai 02563 Việt Nam",
      "priceMin": 35000,
      "priceMax": 75000,
      "attributes": [
        "hot_soup",
        "spicy"
      ]
    },
    {
      "id": 166,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh",
      "restaurant": "Cơm Chay An Lạc",
      "address": "6 Nguyễn Lữ",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 4.1,
      "reviewCount": 1,
      "likesCount": 33,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.763275499999999,
      "longitude": 109.2176198,
      "lat": 13.763275499999999,
      "lng": 109.2176198,
      "moodIds": [
        "energetic",
        "healthy",
        "tired",
        "zen"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Rice",
        "#ShopeeFood",
        "#Đặc_sản_Quy_Nhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6o9orz8wpe7@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6o9orz8wpe7@resize_ss640x400"
      ],
      "description": "Quán Cơm Chay An Lạc tọa lạc tại 6 Nguyễn Lữ, phục vụ món Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cơm Chay Tự Chọn & Lẩu Nấm Dưỡng Sinh tại Cơm Chay An Lạc được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 365 622 781",
      "menu": [
        {
          "name": "Cơm Chay Tự Chọn",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Lẩu Nấm Dưỡng Sinh Chay",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Chả Giò Chay Giòn Rụm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-chay-an-lac",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20Chay%20An%20L%E1%BA%A1c",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.4 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Cơm Chay An Lạc",
      "placeId": "ChIJE5MAVetsbzERTwaZTqiAKdc",
      "gmapsAddr": "6 Nguyễn Lữ Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "heavy",
        "hot_soup",
        "light"
      ]
    },
    {
      "id": 184,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me",
      "restaurant": "Ốc Bụp",
      "address": "36 Lê Văn Thủ, P. Nhơn Bình",
      "district": "Tp. Qui Nhơn",
      "distance": 3.4,
      "distanceText": "Cách bạn 3.4km",
      "priceRange": "35.000đ - 120.000đ",
      "rating": 4.5,
      "reviewCount": 0,
      "likesCount": 20,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.795891999999998,
      "longitude": 109.19174029999999,
      "lat": 13.795891999999998,
      "lng": 109.19174029999999,
      "moodIds": [
        "craving",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-mamayuamwwd3c0@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ras8-mamayuamwwd3c0@resize_ss640x400"
      ],
      "description": "Quán Ốc Bụp tọa lạc tại 36 Lê Văn Thủ, P. Nhơn Bình, phục vụ món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me tại Ốc Bụp được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3825208",
      "menu": [
        {
          "name": "Đĩa Ốc Móng Tay Xào Rau Muống",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Ốc Hương Sốt Trứng Muối Béo Ngậy",
          "price": "120.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Chấm Sốt Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-bup-36-le-van-thu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20B%E1%BB%A5p%20-%2036%20L%C3%AA%20V%C4%83n%20Th%E1%BB%A7",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ốc BỤP",
      "placeId": "ChIJ74bSEwBrbzER1OnEafKZuQ0",
      "gmapsAddr": "36 Lê Văn Thủ Quy Nhơn Đông Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 120000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 185,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me",
      "restaurant": "Quán Ốc Nón",
      "address": "35 Lý Thái Tổ, P. Quang Trung",
      "district": "Tp. Qui Nhơn",
      "distance": 2.8,
      "distanceText": "Cách bạn 2.8km",
      "priceRange": "35.000đ - 120.000đ",
      "rating": 4,
      "reviewCount": 0,
      "likesCount": 25,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7590451,
      "longitude": 109.2091495,
      "lat": 13.7590451,
      "lng": 109.2091495,
      "moodIds": [
        "craving",
        "hangout",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mvb41o4m2n7r0f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mvb41o4m2n7r0f@resize_ss640x400"
      ],
      "description": "Quán Quán Ốc Nón tọa lạc tại 35 Lý Thái Tổ, P. Quang Trung, phục vụ món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me tại Quán Ốc Nón được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 338 938 695",
      "menu": [
        {
          "name": "Đĩa Ốc Móng Tay Xào Rau Muống",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Ốc Hương Sốt Trứng Muối Béo Ngậy",
          "price": "120.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Chấm Sốt Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-oc-non-35-ly-thai-to",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20%E1%BB%90c%20N%C3%B3n%20-%2035%20L%C3%BD%20Th%C3%A1i%20T%E1%BB%95",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Ốc Nón",
      "placeId": "ChIJn9msmHhtbzERJ7OrFMUMDeo",
      "gmapsAddr": "35 Lý Thái Tổ Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 120000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 191,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me",
      "restaurant": "Quán Ốc Chang Chang",
      "address": "73 Trần Bình Trọng, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "35.000đ - 120.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 55,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7736095,
      "longitude": 109.2365938,
      "lat": 13.7736095,
      "lng": 109.2365938,
      "moodIds": [
        "craving",
        "hangout",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mso72fwkeq6h0a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mso72fwkeq6h0a@resize_ss640x400"
      ],
      "description": "Quán Quán Ốc Chang Chang tọa lạc tại 73 Trần Bình Trọng, P. Lê Lợi, phục vụ món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me tại Quán Ốc Chang Chang được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 349 560 233",
      "menu": [
        {
          "name": "Đĩa Ốc Móng Tay Xào Rau Muống",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Ốc Hương Sốt Trứng Muối Béo Ngậy",
          "price": "120.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Chấm Sốt Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-oc-chang-chang-73-tran-binh-trong",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20%E1%BB%90c%20Chang%20Chang%20-%2073%20Tr%E1%BA%A7n%20B%C3%ACnh%20Tr%E1%BB%8Dng",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Ốc Chang Chang",
      "placeId": "ChIJsS2HUgBtbzERf5Wk1H7YlsY",
      "gmapsAddr": "73 Trần Bình Trọng Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 120000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 186,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me",
      "restaurant": "Ốc Mẹt Quy Nhơn",
      "address": "316 Xuân Diệu, P.Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "35.000đ - 120.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 30,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.766077699999999,
      "longitude": 109.2275806,
      "lat": 13.766077699999999,
      "lng": 109.2275806,
      "moodIds": [
        "craving",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvccrqx5hhgd8@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvccrqx5hhgd8@resize_ss640x400"
      ],
      "description": "Quán Ốc Mẹt Quy Nhơn tọa lạc tại 316 Xuân Diệu, P.Trần Phú, phục vụ món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me tại Ốc Mẹt Quy Nhơn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 931 979 277",
      "menu": [
        {
          "name": "Đĩa Ốc Móng Tay Xào Rau Muống",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Ốc Hương Sốt Trứng Muối Béo Ngậy",
          "price": "120.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Chấm Sốt Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-met-quy-nhon-xuan-dieu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20M%E1%BA%B9t%20Quy%20Nh%C6%A1n%20-%20Xu%C3%A2n%20Di%E1%BB%87u",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ốc Mẹt 35k 316 Xuân Diệu - Quy Nhơn",
      "placeId": "ChIJqTYwzMJtbzER_G2zpWfuVtE",
      "gmapsAddr": "316 Xuân Diệu Quy Nhơn Gia Lai 55100 Việt Nam",
      "priceMin": 35000,
      "priceMax": 120000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 187,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me",
      "restaurant": "Ốc Biển Hai Lan",
      "address": "165 Lê Thanh Nghị, P. Đống Đa",
      "district": "Tp. Qui Nhơn",
      "distance": 0.9,
      "distanceText": "Cách bạn 900m",
      "priceRange": "35.000đ - 120.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 35,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.789140199999999,
      "longitude": 109.2162077,
      "lat": 13.789140199999999,
      "lng": 109.2162077,
      "moodIds": [
        "craving",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m35x77cgv1laa3@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m35x77cgv1laa3@resize_ss640x400"
      ],
      "description": "Quán Ốc Biển Hai Lan tọa lạc tại 165 Lê Thanh Nghị, P. Đống Đa, phục vụ món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối & Ốc Móng Tay Xào Me tại Ốc Biển Hai Lan được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 355 095 015",
      "menu": [
        {
          "name": "Đĩa Ốc Móng Tay Xào Rau Muống",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Ốc Hương Sốt Trứng Muối Béo Ngậy",
          "price": "120.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Mì Chấm Sốt Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-bien-hai-lan-le-thanh-nghi",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Bi%E1%BB%83n%20Hai%20Lan%20-%20L%C3%AA%20Thanh%20Ngh%E1%BB%8B",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ốc Hai Lan",
      "placeId": "ChIJzyRLDABrbzERB-PiBEz2110",
      "gmapsAddr": "165 Lê Thanh Nghị Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 120000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 193,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị",
      "restaurant": "Bún Riêu Ốc Cá",
      "address": "147D Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.9,
      "distanceText": "Cách bạn 1.9km",
      "priceRange": "25.000đ - 45.000đ",
      "rating": 4,
      "reviewCount": 0,
      "likesCount": 65,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.774501599999999,
      "longitude": 109.2360647,
      "lat": 13.774501599999999,
      "lng": 109.2360647,
      "moodIds": [
        "budget",
        "craving",
        "hangout",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcdpk5o7fda6@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcdpk5o7fda6@resize_ss640x400"
      ],
      "description": "Quán Bún Riêu Ốc Cá tọa lạc tại 147D Trần Hưng Đạo, phục vụ món Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị tại Bún Riêu Ốc Cá được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 944 068 179",
      "menu": [
        {
          "name": "Tô Bún Riêu Chả Cá",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Bún Riêu Ốc Chả Cua Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Rau Muống Chẻ & Đậu Mơ Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-rieu-oc-ca-tran-hung-dao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ri%C3%AAu%20%E1%BB%90c%20C%C3%A1%20-%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Riêu Ốc Cá 147D Trần Hưng Đạo",
      "placeId": "ChIJYQIwx69tbzERlPFhaHH4wOc",
      "gmapsAddr": "147d Trần Hưng Đạo Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 197,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái",
      "restaurant": "Bếp Nhà Sam - Ốc, Cafe & Ăn Vặt",
      "address": "26 Ngô Văn Sở",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "15.000đ - 45.000đ",
      "rating": 4.4,
      "reviewCount": 0,
      "likesCount": 85,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7418143,
      "longitude": 109.2086542,
      "lat": 13.7418143,
      "lng": 109.2086542,
      "moodIds": [
        "budget",
        "chill",
        "craving",
        "energetic",
        "hangout",
        "late_night",
        "seafood",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Ăn_vặt",
        "#Đặc_sản_địa_phương",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m48emqs1ir4f08@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m48emqs1ir4f08@resize_ss640x400"
      ],
      "description": "Quán Bếp Nhà Sam - Ốc, Cafe & Ăn Vặt tọa lạc tại 26 Ngô Văn Sở, phục vụ món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái tại Bếp Nhà Sam - Ốc, Cafe & Ăn Vặt được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 905 609 008",
      "menu": [
        {
          "name": "Bánh Tráng Nướng Trứng Cút",
          "price": "15.000đ",
          "highlight": true
        },
        {
          "name": "Chân Gà Sốt Thái Chua Cay",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Trà Đào Cam Sả Mát Lạnh",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bep-nha-sam-oc-cafe-an-vat",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%E1%BA%BFp%20Nh%C3%A0%20Sam%20-%20%E1%BB%90c%2C%20Cafe%20%26%20%C4%82n%20V%E1%BA%B7t",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bếp Nhà Xứ Nẫu",
      "placeId": "ChIJZUukB3ttbzERe-89Zs4hI9w",
      "gmapsAddr": "68 Nam Cao khu vực 3 Quy Nhơn Nam Gia Lai, Việt Nam",
      "priceMin": 15000,
      "priceMax": 45000,
      "attributes": [
        "crunchy",
        "drinks",
        "salty",
        "sour",
        "spicy"
      ]
    },
    {
      "id": 203,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
      "restaurant": "Quán Ghẹ 23 - Võ Đình Tú",
      "address": "23 Võ Đình Tú, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 850m",
      "priceRange": "60.000đ - 280.000đ",
      "rating": 4.4,
      "reviewCount": 0,
      "likesCount": 15,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.780097,
      "longitude": 109.2272429,
      "lat": 13.780097,
      "lng": 109.2272429,
      "moodIds": [
        "celebrate",
        "craving",
        "hangout",
        "late_night",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcixoidosk7c@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcixoidosk7c@resize_ss640x400"
      ],
      "description": "Quán Quán Ghẹ 23 - Võ Đình Tú tọa lạc tại 23 Võ Đình Tú, P. Thị Nại, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Quán Ghẹ 23 - Võ Đình Tú cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 333 734 657",
      "menu": [
        {
          "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
          "price": "60.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Quán Ghẹ 23 - Võ Đình Tú",
          "price": "280.000đ",
          "highlight": false
        },
        {
          "name": "Bánh mì đặc ruột chấm sốt bơ tỏi",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-ghe-23-vo-dinh-tu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20Gh%E1%BA%B9%2023%20-%20V%C3%B5%20%C4%90%C3%ACnh%20T%C3%BA",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Ghẹ 23",
      "placeId": "ChIJt37YhINsbzERxpTikM65Tjc",
      "gmapsAddr": "23 Võ Đình Tú Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 60000,
      "priceMax": 280000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 215,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt",
      "restaurant": "Bún Cá Cô Hạnh",
      "address": "126 Trần Hưng Đạo, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "distance": 1.7,
      "distanceText": "Cách bạn 1.7km",
      "priceRange": "30.000đ - 45.000đ",
      "rating": 4.3,
      "reviewCount": 0,
      "likesCount": 75,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.775025,
      "longitude": 109.23412069999999,
      "lat": 13.775025,
      "lng": 109.23412069999999,
      "moodIds": [
        "budget",
        "healthy",
        "late_night",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcua3mquv881@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcua3mquv881@resize_ss640x400"
      ],
      "description": "Quán Bún Cá Cô Hạnh tọa lạc tại 126 Trần Hưng Đạo, P. Lê Lợi, phục vụ món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt tại Bún Cá Cô Hạnh được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 987 347 431",
      "menu": [
        {
          "name": "Bún Chả Cá Nóng Hổi",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Sứa Cá Dầm Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Chả Cá Chiên Nóng",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-ca-co-hanh-tran-hung-dao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20C%C3%A1%20C%C3%B4%20H%E1%BA%A1nh%20-%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Chả Cá Cô Hạnh",
      "placeId": "ChIJu90DvodsbzERmVhC3N4uHrI",
      "gmapsAddr": "126 Trần Hưng Đạo Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "sour"
      ]
    },
    {
      "id": 208,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Bò Huế Đậm Đà Chân Giò Bắp Bò",
      "restaurant": "Châu Loan - Bún Bò Huế & Bún Chả Cá",
      "address": "147 Trần Cao Vân, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.4,
      "distanceText": "Cách bạn 1.4km",
      "priceRange": "35.000đ - 55.000đ",
      "rating": 4,
      "reviewCount": 0,
      "likesCount": 40,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7744272,
      "longitude": 109.2301756,
      "lat": 13.7744272,
      "lng": 109.2301756,
      "moodIds": [
        "budget",
        "comfort",
        "craving"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc78dqweqh1e@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc78dqweqh1e@resize_ss640x400"
      ],
      "description": "Quán Châu Loan - Bún Bò Huế & Bún Chả Cá tọa lạc tại 147 Trần Cao Vân, P. Trần Hưng Đạo, phục vụ món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò tại Châu Loan - Bún Bò Huế & Bún Chả Cá được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3828496",
      "menu": [
        {
          "name": "Bún Bò Nạm Giò",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Bò Huế Đặc Biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Chả Cua Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/chau-loan-bun-bo-hue-bun-cha-ca",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ch%C3%A2u%20Loan%20-%20B%C3%BAn%20B%C3%B2%20Hu%E1%BA%BF%20%26%20B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Bò Châu Loan",
      "placeId": "ChIJ29SOjp1tbzERoaNYuZcmJZA",
      "gmapsAddr": "147 Trần Cao Vân Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 55000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 222,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
      "restaurant": "Tiệm Ăn Bà Hảo",
      "address": "97 Huỳnh Văn Thống, P. Nhơn Bình",
      "district": "Tp. Qui Nhơn",
      "distance": 3.4,
      "distanceText": "Cách bạn 3.4km",
      "priceRange": "35.000đ - 55.000đ",
      "rating": 4.6,
      "reviewCount": 0,
      "likesCount": 10,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7955574,
      "longitude": 109.1959985,
      "lat": 13.7955574,
      "lng": 109.1959985,
      "moodIds": [
        "budget",
        "healthy",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtnhhhbem8skc0@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtnhhhbem8skc0@resize_ss640x400"
      ],
      "description": "Quán Tiệm Ăn Bà Hảo tọa lạc tại 97 Huỳnh Văn Thống, P. Nhơn Bình, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Tiệm Ăn Bà Hảo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 705 988 779",
      "menu": [
        {
          "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Tiệm Ăn Bà Hảo - 97 Huỳnh Văn Thống",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Chả cá Quy Nhơn chiên vàng ăn kèm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tiem-an-ba-hao-97-huynh-van-thong",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ti%E1%BB%87m%20%C4%82n%20B%C3%A0%20H%E1%BA%A3o%20-%2097%20Hu%E1%BB%B3nh%20V%C4%83n%20Th%E1%BB%91ng",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Tiệm ăn bà hảo",
      "placeId": "ChIJnVOJKgBrbzER-r41hs0AI4Y",
      "gmapsAddr": "97 huỳnh văn thống phường quy nhơn đông Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 55000,
      "attributes": [
        "hot_soup",
        "sour"
      ]
    },
    {
      "id": 213,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị",
      "restaurant": "ÚT HẠNH - Bún Riêu, Chả Cá & Thập Cẩm",
      "address": "54 Nguyễn Tất Thành",
      "district": "Tp. Qui Nhơn",
      "distance": 0.6,
      "distanceText": "Cách bạn 600m",
      "priceRange": "25.000đ - 45.000đ",
      "rating": 4.1,
      "reviewCount": 0,
      "likesCount": 65,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.777427,
      "longitude": 109.22233059999999,
      "lat": 13.777427,
      "lng": 109.22233059999999,
      "moodIds": [
        "budget",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg4tnvzw83k868@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg4tnvzw83k868@resize_ss640x400"
      ],
      "description": "Quán ÚT HẠNH - Bún Riêu, Chả Cá & Thập Cẩm tọa lạc tại 54 Nguyễn Tất Thành, phục vụ món Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị tại ÚT HẠNH - Bún Riêu, Chả Cá & Thập Cẩm được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 905 134 779",
      "menu": [
        {
          "name": "Tô Bún Riêu Chả Cá",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Bún Riêu Ốc Chả Cua Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Rau Muống Chẻ & Đậu Mơ Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ut-hanh-bun-rieu-cha-ca-thap-cam-54-nguyen-tat-thanh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C3%9AT%20H%E1%BA%A0NH%20-%20B%C3%BAn%20Ri%C3%AAu%2C%20Ch%E1%BA%A3%20C%C3%A1%20%26%20Th%E1%BA%ADp%20C%E1%BA%A9m%20-%2054%20Nguy%E1%BB%85n%20T%E1%BA%A5t%20Th%C3%A0nh",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Ăn Út Hạnh",
      "placeId": "ChIJeQg-IptsbzERuZc-i9EnDKA",
      "gmapsAddr": "52 Nguyễn Tất Thành Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 220,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt",
      "restaurant": "Bún Quậy Xứ Nẫu",
      "address": "144 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.7,
      "distanceText": "Cách bạn 2.7km",
      "priceRange": "30.000đ - 45.000đ",
      "rating": 4.4,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.758445799999999,
      "longitude": 109.2145984,
      "lat": 13.758445799999999,
      "lng": 109.2145984,
      "moodIds": [
        "budget",
        "healthy",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcstuz6ys96e@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcstuz6ys96e@resize_ss640x400"
      ],
      "description": "Quán Bún Quậy Xứ Nẫu tọa lạc tại 144 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt tại Bún Quậy Xứ Nẫu được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 985 187 787",
      "menu": [
        {
          "name": "Bún Chả Cá Nóng Hổi",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Sứa Cá Dầm Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Chả Cá Chiên Nóng",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-quay-xu-nau-nguyen-thi-dinh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Qu%E1%BA%ADy%20X%E1%BB%A9%20N%E1%BA%ABu%20-%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20%C4%90%E1%BB%8Bnh",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": false,
      "gmapsName": "Bún Quậy Xứ Nẫu",
      "priceMin": 30000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "sour"
      ]
    },
    {
      "id": 219,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Canh Tôm Đất Nước Dùng Ngọt Thanh",
      "restaurant": "Quán Cô Hồng - Bánh Canh Tôm, Bún Riêu & Bún Chả Cá",
      "address": "295 Lê Thanh Nghị, P. Đống Đa",
      "district": "Tp. Qui Nhơn",
      "distance": 1.3,
      "distanceText": "Cách bạn 1.3km",
      "priceRange": "25.000đ - 45.000đ",
      "rating": 4.6,
      "reviewCount": 0,
      "likesCount": 95,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.791307999999999,
      "longitude": 109.21248,
      "lat": 13.791307999999999,
      "lng": 109.21248,
      "moodIds": [
        "budget",
        "comfort",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m2tgxe1za7006a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m2tgxe1za7006a@resize_ss640x400"
      ],
      "description": "Quán Quán Cô Hồng - Bánh Canh Tôm, Bún Riêu & Bún Chả Cá tọa lạc tại 295 Lê Thanh Nghị, P. Đống Đa, phục vụ món Bánh Canh Tôm Đất Nước Dùng Ngọt Thanh hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Canh Tôm Đất Nước Dùng Ngọt Thanh tại Quán Cô Hồng - Bánh Canh Tôm, Bún Riêu & Bún Chả Cá được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 934 794 704",
      "menu": [
        {
          "name": "Bánh Canh Tôm Đất",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Bánh Canh Thập Cẩm Tôm Chả",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Trứng Cút Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-co-hong-banh-canh-tom-bun-rieu-bun-cha-ca",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20C%C3%B4%20H%E1%BB%93ng%20-%20B%C3%A1nh%20Canh%20T%C3%B4m%2C%20B%C3%BAn%20Ri%C3%AAu%20%26%20B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Bún Cô Hồng",
      "placeId": "ChIJWSZeEQBrbzERwuQQhKPSJbM",
      "gmapsAddr": "295 Lê Thanh Nghị Phường Quy Nhơn Gia Lai, Việt Nam",
      "priceMin": 25000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 225,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt",
      "restaurant": "Bún Cá Hồ Thị",
      "address": "279 Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.4,
      "distanceText": "Cách bạn 1.4km",
      "priceRange": "30.000đ - 45.000đ",
      "rating": 4,
      "reviewCount": 0,
      "likesCount": 25,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7757001,
      "longitude": 109.23114299999999,
      "lat": 13.7757001,
      "lng": 109.23114299999999,
      "moodIds": [
        "budget",
        "healthy",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsuaczmo3oux3a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsuaczmo3oux3a@resize_ss640x400"
      ],
      "description": "Quán Bún Cá Hồ Thị tọa lạc tại 279 Trần Hưng Đạo, phục vụ món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt tại Bún Cá Hồ Thị được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 905 946 121",
      "menu": [
        {
          "name": "Bún Chả Cá Nóng Hổi",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Sứa Cá Dầm Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Chả Cá Chiên Nóng",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-ca-ho-thi",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20C%C3%A1%20H%E1%BB%93%20Th%E1%BB%8B",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Cá Hồ Thị",
      "placeId": "ChIJd0nJOQ9tbzERGwYogCkzYzY",
      "gmapsAddr": "279 Trần Hưng Đạo Quy Nhơn Gia Lai 820000 Việt Nam",
      "priceMin": 30000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "sour"
      ]
    },
    {
      "id": 228,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt",
      "restaurant": "Bún Cá Toàn Hà",
      "address": "41 - 42 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.8,
      "distanceText": "Cách bạn 2.8km",
      "priceRange": "30.000đ - 45.000đ",
      "rating": 4.6,
      "reviewCount": 0,
      "likesCount": 40,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7571637,
      "longitude": 109.21407599999999,
      "lat": 13.7571637,
      "lng": 109.21407599999999,
      "moodIds": [
        "budget",
        "healthy",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-mdgz6uv295m937@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7ras8-mdgz6uv295m937@resize_ss640x400"
      ],
      "description": "Quán Bún Cá Toàn Hà tọa lạc tại 41 - 42 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt tại Bún Cá Toàn Hà được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 866 423 677",
      "menu": [
        {
          "name": "Bún Chả Cá Nóng Hổi",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Sứa Cá Dầm Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Chả Cá Chiên Nóng",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-ca-toan-ha-nguyen-thi-dinh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20C%C3%A1%20To%C3%A0n%20H%C3%A0%20-%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20%C4%90%E1%BB%8Bnh",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Cá Quy Nhơn Toàn Hà",
      "placeId": "ChIJNR7_HQBtbzERhnUaPGr-HP0",
      "gmapsAddr": "42 Nguyễn Thị Định Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "sour"
      ]
    },
    {
      "id": 230,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt",
      "restaurant": "Bún Văn Hùng",
      "address": "146 Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.6,
      "distanceText": "Cách bạn 1.6km",
      "priceRange": "30.000đ - 45.000đ",
      "rating": 4.2,
      "reviewCount": 0,
      "likesCount": 50,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7753941,
      "longitude": 109.2324981,
      "lat": 13.7753941,
      "lng": 109.2324981,
      "moodIds": [
        "budget",
        "healthy",
        "late_night",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbxo52nl3t7f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbxo52nl3t7f@resize_ss640x400"
      ],
      "description": "Quán Bún Văn Hùng tọa lạc tại 146 Trần Hưng Đạo, phục vụ món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Sứa & Bún Chả Cá Nước Dùng Thanh Ngọt tại Bún Văn Hùng được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 868 150 876",
      "menu": [
        {
          "name": "Bún Chả Cá Nóng Hổi",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Sứa Cá Dầm Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Chả Cá Chiên Nóng",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-van-hung-tran-hung-dao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20V%C4%83n%20H%C3%B9ng%20-%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Văn Hùng",
      "placeId": "ChIJbZ2Kn8ltbzERGmmMCig0mbM",
      "gmapsAddr": "146 Trần Hưng Đạo Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "sour"
      ]
    },
    {
      "id": 232,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Bò Huế Đậm Đà Chân Giò Bắp Bò",
      "restaurant": "QUÁN BÚN CÔ TÂM - Bún Bò",
      "address": "20 Trường Chinh, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "distance": 1.2,
      "distanceText": "Cách bạn 1.2km",
      "priceRange": "35.000đ - 55.000đ",
      "rating": 4.5,
      "reviewCount": 0,
      "likesCount": 60,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7719852,
      "longitude": 109.22380299999999,
      "lat": 13.7719852,
      "lng": 109.22380299999999,
      "moodIds": [
        "budget",
        "comfort",
        "craving"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhlbhg4dcpd3@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhlbhg4dcpd3@resize_ss640x400"
      ],
      "description": "Quán QUÁN BÚN CÔ TÂM - Bún Bò tọa lạc tại 20 Trường Chinh, P. Lý Thường Kiệt, phục vụ món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò tại QUÁN BÚN CÔ TÂM - Bún Bò được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3831784",
      "menu": [
        {
          "name": "Bún Bò Nạm Giò",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Bò Huế Đặc Biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Chả Cua Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-bun-co-tam-bun-bo-truong-chinh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=QU%C3%81N%20B%C3%9AN%20C%C3%94%20T%C3%82M%20-%20B%C3%BAn%20B%C3%B2%20-%20Tr%C6%B0%E1%BB%9Dng%20Chinh",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Cô Tâm",
      "placeId": "ChIJvUgNMQBtbzERU92eK2cheVw",
      "gmapsAddr": "20 Trường Chinh Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 55000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 231,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Canh Hẹ Cá Dầm & Bún Riêu Cá Nóng Hổi",
      "restaurant": "Bánh Canh Hẹ, Bún Riêu Cá & Mì Quảng",
      "address": "83 Vũ Bảo, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 1.8,
      "distanceText": "Cách bạn 1.8km",
      "priceRange": "25.000đ - 45.000đ",
      "rating": 4.8,
      "reviewCount": 0,
      "likesCount": 55,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.765854399999998,
      "longitude": 109.219044,
      "lat": 13.765854399999998,
      "lng": 109.219044,
      "moodIds": [
        "budget",
        "comfort",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mexvvdwe77k6aa@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-820l4-mexvvdwe77k6aa@resize_ss640x400"
      ],
      "description": "Quán Bánh Canh Hẹ, Bún Riêu Cá & Mì Quảng tọa lạc tại 83 Vũ Bảo, P. Ngô Mây, phục vụ món Bánh Canh Hẹ Cá Dầm & Bún Riêu Cá Nóng Hổi hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Canh Hẹ Cá Dầm & Bún Riêu Cá Nóng Hổi tại Bánh Canh Hẹ, Bún Riêu Cá & Mì Quảng được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 901 244 499",
      "menu": [
        {
          "name": "Bánh Canh Hẹ Cá Dầm",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Bún Riêu Cá Thập Cẩm",
          "price": "35.000đ",
          "highlight": false
        },
        {
          "name": "Tô Đặc Biệt Đầy Đủ Chả Cá",
          "price": "45.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-canh-he-bun-rieu-ca-mi-quang-83-vu-bao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20Canh%20H%E1%BA%B9%2C%20B%C3%BAn%20Ri%C3%AAu%20C%C3%A1%20%26%20M%C3%AC%20Qu%E1%BA%A3ng%20-%2083%20V%C5%A9%20B%E1%BA%A3o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh canh hẹ cá dầm - 83 vũ bảo",
      "placeId": "ChIJ49JtFwBtbzERTCtI4rTdHVs",
      "gmapsAddr": "83 Vũ Bảo Quy Nhơn Nam Gia Lai 820000 Việt Nam",
      "priceMin": 25000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 233,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị",
      "restaurant": "RUTO - Bún Riêu, Trà Sữa, Trứng Nướng",
      "address": "143 Ngô Mây, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 45.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 65,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7653313,
      "longitude": 109.2133255,
      "lat": 13.7653313,
      "lng": 109.2133255,
      "moodIds": [
        "budget",
        "chill",
        "energetic",
        "hangout",
        "late_night",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m6ly62k7jw3c6a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m6ly62k7jw3c6a@resize_ss640x400"
      ],
      "description": "Quán RUTO - Bún Riêu, Trà Sữa, Trứng Nướng tọa lạc tại 143 Ngô Mây, P. Nguyễn Văn Cừ, phục vụ món Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Riêu Cua Chả Cá Nóng Hổi Đậm Vị tại RUTO - Bún Riêu, Trà Sữa, Trứng Nướng được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3831921",
      "menu": [
        {
          "name": "Tô Bún Riêu Chả Cá",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Bún Riêu Ốc Chả Cua Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Rau Muống Chẻ & Đậu Mơ Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ruto-bun-rieu-tra-sua-trung-nuong",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=RUTO%20-%20B%C3%BAn%20Ri%C3%AAu%2C%20Tr%C3%A0%20S%E1%BB%AFa%2C%20Tr%E1%BB%A9ng%20N%C6%B0%E1%BB%9Bng",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ruto Milk Tea & Food",
      "placeId": "ChIJXbE7FZVsbzERQZbQ_88bMhc",
      "gmapsAddr": "143 Ngô Mây Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 45000,
      "attributes": [
        "drinks",
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 239,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Bò Huế Đậm Đà Chân Giò Bắp Bò",
      "restaurant": "Bún Bò Huế 6 Lùn",
      "address": "16 Phan Đình Phùng, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 0.9,
      "distanceText": "Cách bạn 950m",
      "priceRange": "35.000đ - 55.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 95,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.777633,
      "longitude": 109.2272388,
      "lat": 13.777633,
      "lng": 109.2272388,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "late_night"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mv14eytv0f7r33@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mv14eytv0f7r33@resize_ss640x400"
      ],
      "description": "Quán Bún Bò Huế 6 Lùn tọa lạc tại 16 Phan Đình Phùng, P. Trần Hưng Đạo, phục vụ món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò tại Bún Bò Huế 6 Lùn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3832743",
      "menu": [
        {
          "name": "Bún Bò Nạm Giò",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Bò Huế Đặc Biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Chả Cua Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-bo-hue-6-lun",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20B%C3%B2%20Hu%E1%BA%BF%206%20L%C3%B9n",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Bò 6 Lùn",
      "placeId": "ChIJj6uNDzZtbzERbyvFYgKa2Zw",
      "gmapsAddr": "16 Phan Đình Phùng Quy Nhơn Gia Lai 55127 Việt Nam",
      "priceMin": 35000,
      "priceMax": 55000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 244,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Mì Quảng Tôm Thịt Trứng Đậm Vị Miền Trung",
      "restaurant": "Mì Quảng 32 - Mì Quảng, Lagu Bánh Mì & Bánh Cuốn",
      "address": "32 Trường Chinh, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 1.2,
      "distanceText": "Cách bạn 1.2km",
      "priceRange": "30.000đ - 45.000đ",
      "rating": 4.2,
      "reviewCount": 0,
      "likesCount": 20,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7719094,
      "longitude": 109.22347429999999,
      "lat": 13.7719094,
      "lng": 109.22347429999999,
      "moodIds": [
        "budget",
        "quick",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m6uurzj2ht4147@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m6uurzj2ht4147@resize_ss640x400"
      ],
      "description": "Quán Mì Quảng 32 - Mì Quảng, Lagu Bánh Mì & Bánh Cuốn tọa lạc tại 32 Trường Chinh, P. Trần Phú, phục vụ món Mì Quảng Tôm Thịt Trứng Đậm Vị Miền Trung hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Mì Quảng Tôm Thịt Trứng Đậm Vị Miền Trung tại Mì Quảng 32 - Mì Quảng, Lagu Bánh Mì & Bánh Cuốn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 906 414 368",
      "menu": [
        {
          "name": "Tô Mì Quảng Tôm Thịt",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Mì Quảng Gà Ta Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Đa Nướng Mè",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/mi-quang-32-mi-quang-lagu-banh-mi-banh-cuon-32-truong-chinh",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%C3%AC%20Qu%E1%BA%A3ng%2032%20-%20M%C3%AC%20Qu%E1%BA%A3ng%2C%20Lagu%20B%C3%A1nh%20M%C3%AC%20%26%20B%C3%A1nh%20Cu%E1%BB%91n%20-%2032%20Tr%C6%B0%E1%BB%9Dng%20Chinh",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Mì Quảng 32",
      "placeId": "ChIJJScqKZBsbzERY06h5YgeerM",
      "gmapsAddr": "32 Trường Chinh Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 45000,
      "attributes": [
        "crunchy",
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 238,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
      "restaurant": "Cơm Gà 89",
      "address": "89 Vũ Bảo, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 1.8,
      "distanceText": "Cách bạn 1.8km",
      "priceRange": "35.000đ - 65.000đ",
      "rating": 4.6,
      "reviewCount": 0,
      "likesCount": 90,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "rice",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7656519,
      "longitude": 109.21886529999999,
      "lat": 13.7656519,
      "lng": 109.21886529999999,
      "moodIds": [
        "craving"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mr1mt3jaxurka9@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mr1mt3jaxurka9@resize_ss640x400"
      ],
      "description": "Quán Cơm Gà 89 tọa lạc tại 89 Vũ Bảo, P. Ngô Mây, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Gà 89 được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3832606",
      "menu": [
        {
          "name": "Đĩa Cơm Gà Xối Mỡ Giòn",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Phần Cơm Đùi Gà Rán Đặc Biệt",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Canh Rong Biển Thêm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-ga-89-vu-bao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20G%C3%A0%2089%20-%20V%C5%A9%20B%E1%BA%A3o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Cơm gà 89",
      "placeId": "ChIJdTcgdABtbzERE2Z87ZlsbLc",
      "gmapsAddr": "89 Vũ Bảo Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "heavy"
      ]
    },
    {
      "id": 247,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Bò Huế Đậm Đà Chân Giò Bắp Bò",
      "restaurant": "Bún Bò Huế A Hoài",
      "address": "260 Đào Tấn, P. Nhơn Bình",
      "district": "Tp. Qui Nhơn",
      "distance": 3.7,
      "distanceText": "Cách bạn 3.7km",
      "priceRange": "35.000đ - 55.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 35,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.796154,
      "longitude": 109.1886265,
      "lat": 13.796154,
      "lng": 109.1886265,
      "moodIds": [
        "budget",
        "comfort",
        "craving"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mu1yapsb8jk433@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mu1yapsb8jk433@resize_ss640x400"
      ],
      "description": "Quán Bún Bò Huế A Hoài tọa lạc tại 260 Đào Tấn, P. Nhơn Bình, phục vụ món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Bò Huế Đậm Đà Chân Giò Bắp Bò tại Bún Bò Huế A Hoài được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 787 766 355",
      "menu": [
        {
          "name": "Bún Bò Nạm Giò",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Tô Bún Bò Huế Đặc Biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Chả Cua Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-bo-hue-a-hoai-260-dao-tan",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20B%C3%B2%20Hu%E1%BA%BF%20A%20Ho%C3%A0i%20-%20260%20%C4%90%C3%A0o%20T%E1%BA%A5n",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "A Hoài – Bún Bò Huế",
      "placeId": "ChIJY7eb5e5rbzERZxmCPtRXpug",
      "gmapsAddr": "260 Đào Tấn Quy Nhơn Đông Gia Lai 551000 Việt Nam",
      "priceMin": 35000,
      "priceMax": 55000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 240,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Rạm Phù Mỹ & Bún Tôm Châu Trúc Đậm Đà",
      "restaurant": "Bún Tôm - Bún Rạm Đầm Trúc",
      "address": "3 Mai Xuân Thưởng, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.1,
      "distanceText": "Cách bạn 1.1km",
      "priceRange": "30.000đ - 45.000đ",
      "rating": 4.7,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7775933,
      "longitude": 109.2285405,
      "lat": 13.7775933,
      "lng": 109.2285405,
      "moodIds": [
        "budget",
        "craving",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbyp6kg6ft99@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbyp6kg6ft99@resize_ss640x400"
      ],
      "description": "Quán Bún Tôm - Bún Rạm Đầm Trúc tọa lạc tại 3 Mai Xuân Thưởng, P. Trần Hưng Đạo, phục vụ món Bún Rạm Phù Mỹ & Bún Tôm Châu Trúc Đậm Đà hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Rạm Phù Mỹ & Bún Tôm Châu Trúc Đậm Đà tại Bún Tôm - Bún Rạm Đầm Trúc được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 899 343 534",
      "menu": [
        {
          "name": "Tô Bún Rạm Đậm Đà",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Bún Tôm Rạm Thập Cẩm Đặc Biệt",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Bánh Tráng Nướng Kèm",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-tom-bun-ram-dam-truc-03-mai-xuan-thuong",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20T%C3%B4m%20-%20B%C3%BAn%20R%E1%BA%A1m%20%C4%90%E1%BA%A7m%20Tr%C3%BAc%20-%2003%20Mai%20Xu%C3%A2n%20Th%C6%B0%E1%BB%9Fng",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bún Tôm - Rạm Đầm Trúc ( Cơ sở 2 )",
      "placeId": "ChIJg5O8tPxtbzERQS91J9A31vA",
      "gmapsAddr": "03 Mai Xuân Thưởng Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 45000,
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 254,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn",
      "restaurant": "Bánh Hỏi Cháo Lòng Thuỳ Châu",
      "address": "167 Cần Vương, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 3.1,
      "distanceText": "Cách bạn 3.1km",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 4.4,
      "reviewCount": 0,
      "likesCount": 70,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.755101999999999,
      "longitude": 109.2115901,
      "lat": 13.755101999999999,
      "lng": 109.2115901,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "late_night",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbs2ezurb8f4@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbs2ezurb8f4@resize_ss640x400"
      ],
      "description": "Quán Bánh Hỏi Cháo Lòng Thuỳ Châu tọa lạc tại 167 Cần Vương, P. Nguyễn Văn Cừ, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn tại Bánh Hỏi Cháo Lòng Thuỳ Châu được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 982 287 715",
      "menu": [
        {
          "name": "Bánh Hỏi Heo Quay / Lòng Heo",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Bánh Hỏi Cháo Lòng Đặc Biệt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Tô Cháo Huyết Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-thuy-chau-can-vuong",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20Thu%E1%BB%B3%20Ch%C3%A2u%20-%20C%E1%BA%A7n%20V%C6%B0%C6%A1ng",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh hỏi cháo lòng Thuỳ Châu",
      "placeId": "ChIJ8VCN9RNtbzEREBQauiBRVwQ",
      "gmapsAddr": "167 Cần Vương Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 260,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn",
      "restaurant": "Bánh Hỏi Cháo Lòng - Đô Đốc Bảo",
      "address": "52 Đô Đốc Bảo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.9,
      "distanceText": "Cách bạn 1.9km",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 4,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.765485499999999,
      "longitude": 109.22288719999999,
      "lat": 13.765485499999999,
      "lng": 109.22288719999999,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "hangout",
        "late_night",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bún_ngon",
        "#Đặc_sản_Quy_Nhơn",
        "#ShopeeFood"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwd3gy3us89l74@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwd3gy3us89l74@resize_ss640x400"
      ],
      "description": "Quán Bánh Hỏi Cháo Lòng - Đô Đốc Bảo tọa lạc tại 52 Đô Đốc Bảo, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn tại Bánh Hỏi Cháo Lòng - Đô Đốc Bảo được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 983 001 333",
      "menu": [
        {
          "name": "Bánh Hỏi Heo Quay / Lòng Heo",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Bánh Hỏi Cháo Lòng Đặc Biệt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Tô Cháo Huyết Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-do-doc-bao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20%C4%90%C3%B4%20%C4%90%E1%BB%91c%20B%E1%BA%A3o",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Bánh hỏi cháo lòng 52 Đô Đốc Bảo",
      "placeId": "ChIJWYeDs5xtbzERKV4NVHFe76w",
      "gmapsAddr": "52 Đô Đốc Bảo Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 257,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn",
      "restaurant": "Bánh Hỏi Cháo Lòng Trần Hưng Đạo",
      "address": "858 Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 0.2,
      "distanceText": "Cách bạn 200m",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 4.3,
      "reviewCount": 0,
      "likesCount": 85,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7852491,
      "longitude": 109.21176159999999,
      "lat": 13.7852491,
      "lng": 109.21176159999999,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "late_night",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf04d7wc2575f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf04d7wc2575f@resize_ss640x400"
      ],
      "description": "Quán Bánh Hỏi Cháo Lòng Trần Hưng Đạo tọa lạc tại 858 Trần Hưng Đạo, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn tại Bánh Hỏi Cháo Lòng Trần Hưng Đạo được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 384 190 232",
      "menu": [
        {
          "name": "Bánh Hỏi Heo Quay / Lòng Heo",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Bánh Hỏi Cháo Lòng Đặc Biệt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Tô Cháo Huyết Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-tran-hung-dao",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Bánh Hỏi Cháo Lòng 858",
      "placeId": "ChIJaWfdedZtbzERxx1btCZGChY",
      "gmapsAddr": "858 Trần Hưng Đạo Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 261,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn",
      "restaurant": "Hoàng Kim Quán - Bánh Hỏi Cháo Lòng",
      "address": "74 Tôn Đức Thắng",
      "district": "Tp. Qui Nhơn",
      "distance": 1,
      "distanceText": "Cách bạn 1.0km",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 4.4,
      "reviewCount": 0,
      "likesCount": 5,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.774114899999999,
      "longitude": 109.2242361,
      "lat": 13.774114899999999,
      "lng": 109.2242361,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa7ckixg4bdef@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa7ckixg4bdef@resize_ss640x400"
      ],
      "description": "Quán Hoàng Kim Quán - Bánh Hỏi Cháo Lòng tọa lạc tại 74 Tôn Đức Thắng, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn tại Hoàng Kim Quán - Bánh Hỏi Cháo Lòng được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3835757",
      "menu": [
        {
          "name": "Bánh Hỏi Heo Quay / Lòng Heo",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Bánh Hỏi Cháo Lòng Đặc Biệt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Tô Cháo Huyết Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/hoang-kim-quan-banh-hoi-chao-long",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ho%C3%A0ng%20Kim%20Qu%C3%A1n%20-%20B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Phở Thố Đá Hoàng Kim",
      "placeId": "ChIJZzqcji1tbzERtyo5uNRoxPI",
      "gmapsAddr": "74 Tôn Đức Thắng Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 268,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Lẩu Nấm Chay Dưỡng Sinh & Bún Chay Thiện Duyên",
      "restaurant": "Lẩu Chay Thiện Duyên - Lẩu Chay",
      "address": "8 Võ Mười, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 4.8,
      "reviewCount": 0,
      "likesCount": 40,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7682658,
      "longitude": 109.21724979999999,
      "lat": 13.7682658,
      "lng": 109.21724979999999,
      "moodIds": [
        "energetic",
        "healthy",
        "tired",
        "zen"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-ly23ctxptyvt05@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-ly23ctxptyvt05@resize_ss640x400"
      ],
      "description": "Quán Lẩu Chay Thiện Duyên - Lẩu Chay tọa lạc tại 8 Võ Mười, P. Ngô Mây, phục vụ món Lẩu Nấm Chay Dưỡng Sinh & Bún Chay Thiện Duyên hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Nấm Chay Dưỡng Sinh & Bún Chay Thiện Duyên tại Lẩu Chay Thiện Duyên - Lẩu Chay được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 372 076 247",
      "menu": [
        {
          "name": "Cơm Chay Tự Chọn",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Lẩu Nấm Dưỡng Sinh Chay",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Chả Giò Chay Giòn Rụm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-chay-thien-duyen-lau-chay",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20Chay%20Thi%E1%BB%87n%20Duy%C3%AAn%20-%20L%E1%BA%A9u%20Chay",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Lẩu Chay Thiện Duyên 6",
      "placeId": "ChIJayFeHQBtbzERxrsbn63wz1E",
      "gmapsAddr": "08 Võ Mười Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "heavy",
        "hot_soup",
        "light"
      ]
    },
    {
      "id": 265,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn",
      "restaurant": "Quán Nẫu - Bánh Hỏi & Cháo Lòng",
      "address": "70 Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "distance": 1.7,
      "distanceText": "Cách bạn 1.7km",
      "priceRange": "25.000đ - 50.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 25,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7702564,
      "longitude": 109.22910189999999,
      "lat": 13.7702564,
      "lng": 109.22910189999999,
      "moodIds": [
        "budget",
        "comfort",
        "craving",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#Nóng_hổi"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhxfagibbvdea@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhxfagibbvdea@resize_ss640x400"
      ],
      "description": "Quán Quán Nẫu - Bánh Hỏi & Cháo Lòng tọa lạc tại 70 Lê Hồng Phong, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà Quy Nhơn tại Quán Nẫu - Bánh Hỏi & Cháo Lòng được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "0256 3836305",
      "menu": [
        {
          "name": "Bánh Hỏi Heo Quay / Lòng Heo",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Bánh Hỏi Cháo Lòng Đặc Biệt",
          "price": "50.000đ",
          "highlight": false
        },
        {
          "name": "Tô Cháo Huyết Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-nau-banh-hoi-chao-long",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20N%E1%BA%ABu%20-%20B%C3%A1nh%20H%E1%BB%8Fi%20%26%20Ch%C3%A1o%20L%C3%B2ng",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Nẫu",
      "placeId": "ChIJMUDF0Y5sbzERjqKjFhD9N0k",
      "gmapsAddr": "Q6CH+4J5 Lê Hồng Phong Quy Nhơn Gia Lai, Việt Nam",
      "priceMin": 25000,
      "priceMax": 50000,
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 269,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Lẩu Gà Lá É Cay Nồng Ớt Xiêm Xanh",
      "restaurant": "Lẩu Gà Lá É Tao Ngộ Quán",
      "address": "86 Bình Hà, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "distance": 1.2,
      "distanceText": "Cách bạn 1.2km",
      "priceRange": "120.000đ - 250.000đ",
      "rating": 4.4,
      "reviewCount": 0,
      "likesCount": 45,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "hotpot",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7816952,
      "longitude": 109.2306967,
      "lat": 13.7816952,
      "lng": 109.2306967,
      "moodIds": [
        "celebrate",
        "energetic",
        "late_night",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mhhmyenqesxxc5@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-820l4-mhhmyenqesxxc5@resize_ss640x400"
      ],
      "description": "Quán Lẩu Gà Lá É Tao Ngộ Quán tọa lạc tại 86 Bình Hà, P. Thị Nại, phục vụ món Lẩu Gà Lá É Cay Nồng Ớt Xiêm Xanh hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Gà Lá É Cay Nồng Ớt Xiêm Xanh tại Lẩu Gà Lá É Tao Ngộ Quán được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 935 848 867",
      "menu": [
        {
          "name": "Nồi Lẩu Gà Lá É Nhỏ (2 người)",
          "price": "120.000đ",
          "highlight": true
        },
        {
          "name": "Nồi Lẩu Gà Lá É Lớn (4 người)",
          "price": "250.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Lá É & Bún Thêm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-ga-la-e-tao-ngo-quan-86-binh-ha",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20G%C3%A0%20L%C3%A1%20%C3%89%20Tao%20Ng%E1%BB%99%20Qu%C3%A1n%20-%2086%20B%C3%ACnh%20H%C3%A0",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Lẩu gà lá é-Tao ngộ quán",
      "placeId": "ChIJE_gcyNVtbzER2A0qWSOK5Dg",
      "gmapsAddr": "86 Bình Hà Quy Nhơn Gia Lai 591300 Việt Nam",
      "priceMin": 120000,
      "priceMax": 250000,
      "attributes": [
        "heavy",
        "hot_soup",
        "spicy"
      ]
    },
    {
      "id": 281,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Chay Thanh Đạm & Đậu Hũ Sốt Nấm Pháp Luân",
      "restaurant": "Ẩm Thực Chay Pháp Luân",
      "address": "10 Hàm Nghi, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 4.8,
      "reviewCount": 0,
      "likesCount": 5,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.764219599999999,
      "longitude": 109.2164241,
      "lat": 13.764219599999999,
      "lng": 109.2164241,
      "moodIds": [
        "healthy",
        "late_night",
        "tired",
        "zen"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mdwsy9bp8nwk16@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-820l4-mdwsy9bp8nwk16@resize_ss640x400"
      ],
      "description": "Quán Ẩm Thực Chay Pháp Luân tọa lạc tại 10 Hàm Nghi, P. Ngô Mây, phục vụ món Cơm Chay Thanh Đạm & Đậu Hũ Sốt Nấm Pháp Luân hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cơm Chay Thanh Đạm & Đậu Hũ Sốt Nấm Pháp Luân tại Ẩm Thực Chay Pháp Luân được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 978 256 677",
      "menu": [
        {
          "name": "Cơm Chay Tự Chọn",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Lẩu Nấm Dưỡng Sinh Chay",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Chả Giò Chay Giòn Rụm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/am-thuc-chay-phap-luan-ham-nghi",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BA%A8m%20Th%E1%BB%B1c%20Chay%20Ph%C3%A1p%20Lu%C3%A2n%20-%20H%C3%A0m%20Nghi",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "ẨM THỰC CHAY PHÁP LUÂN",
      "placeId": "ChIJ7RJyBTVtbzERM5CS5yxwNEE",
      "gmapsAddr": "10 Hàm Nghi p Quy Nhơn Nam Gia Lai 55000, Việt Nam",
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "light"
      ]
    },
    {
      "id": 274,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Lẩu Bò Ba Toa Quán Gỗ & Bò Nướng Ngói",
      "restaurant": "Lẩu Bò Hiền Hoà",
      "address": "275 Bạch Đằng, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.3,
      "distanceText": "Cách bạn 1.3km",
      "priceRange": "150.000đ - 300.000đ",
      "rating": 4.4,
      "reviewCount": 0,
      "likesCount": 70,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "hotpot",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7778259,
      "longitude": 109.23069009999999,
      "lat": 13.7778259,
      "lng": 109.23069009999999,
      "moodIds": [
        "celebrate",
        "energetic",
        "hangout"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-muuof1mupn9g44@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-81ztc-muuof1mupn9g44@resize_ss640x400"
      ],
      "description": "Quán Lẩu Bò Hiền Hoà tọa lạc tại 275 Bạch Đằng, P. Trần Hưng Đạo, phục vụ món Lẩu Bò Ba Toa Quán Gỗ & Bò Nướng Ngói hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Bò Ba Toa Quán Gỗ & Bò Nướng Ngói tại Lẩu Bò Hiền Hoà được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 903 180 092",
      "menu": [
        {
          "name": "Nồi Lẩu Bò Ba Toa Nhỏ",
          "price": "150.000đ",
          "highlight": true
        },
        {
          "name": "Nồi Lẩu Bò Thập Cẩm Đặc Biệt",
          "price": "300.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Nạm Bò & Mì Gói Thêm",
          "price": "30.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-bo-hien-hoa-275-bach-dang",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20B%C3%B2%20Hi%E1%BB%81n%20Ho%C3%A0%20-%20275%20B%E1%BA%A1ch%20%C4%90%E1%BA%B1ng",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Lẩu Hiền Hòa",
      "placeId": "ChIJtxkh2fhtbzERU-oA7e33uKQ",
      "gmapsAddr": "275 Bạch Đằng Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 150000,
      "priceMax": 300000,
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 279,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Salad Trái Cây Tươi & Nước Ép Dinh Dưỡng",
      "restaurant": "GreenMart",
      "address": "69 Trần Cao Vân",
      "district": "Tp. Qui Nhơn",
      "distance": 1.7,
      "distanceText": "Cách bạn 1.7km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 95,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "healthy",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.771273599999999,
      "longitude": 109.2304601,
      "lat": 13.771273599999999,
      "lng": 109.2304601,
      "moodIds": [
        "healthy",
        "refreshing",
        "sweet",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-miaypef2wd1k69@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-820l4-miaypef2wd1k69@resize_ss640x400"
      ],
      "description": "Quán GreenMart tọa lạc tại 69 Trần Cao Vân, phục vụ món Salad Trái Cây Tươi & Nước Ép Dinh Dưỡng hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Salad Trái Cây Tươi & Nước Ép Dinh Dưỡng tại GreenMart được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 704 913 319",
      "menu": [
        {
          "name": "Hộp Trái Cây Cắt Sẵn",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Salad Ức Gà Sốt Mè Rang",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Nước Ép Cam Tươi",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/greenmart-69-tran-cao-van",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=GreenMart%20-%2069%20Tr%E1%BA%A7n%20Cao%20V%C3%A2n",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Siêu thị GreenMart - Tã sữa và hàng gia dụng",
      "placeId": "ChIJezkOVgBtbzERab5vjNCdJGE",
      "gmapsAddr": "69 Trần Cao Vân Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks",
        "light"
      ]
    },
    {
      "id": 283,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Lẩu Dê Tươi Thuốc Bắc & Dê Nướng Bản Gang",
      "restaurant": "DÊ KHÔNG TÊN",
      "address": "52 Bình Hà, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "distance": 1.4,
      "distanceText": "Cách bạn 1.4km",
      "priceRange": "150.000đ - 300.000đ",
      "rating": 4.6,
      "reviewCount": 0,
      "likesCount": 15,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "hotpot",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.781346099999999,
      "longitude": 109.2325023,
      "lat": 13.781346099999999,
      "lng": 109.2325023,
      "moodIds": [
        "celebrate",
        "craving",
        "energetic",
        "hangout",
        "seafood"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-mauv0ibr170h90@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ras8-mauv0ibr170h90@resize_ss640x400"
      ],
      "description": "Quán DÊ KHÔNG TÊN tọa lạc tại 52 Bình Hà, P. Thị Nại, phục vụ món Lẩu Dê Tươi Thuốc Bắc & Dê Nướng Bản Gang hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Dê Tươi Thuốc Bắc & Dê Nướng Bản Gang tại DÊ KHÔNG TÊN được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 344 953 939",
      "menu": [
        {
          "name": "Nồi Lẩu Dê Tươi Thuốc Bắc",
          "price": "150.000đ",
          "highlight": true
        },
        {
          "name": "Đĩa Dê Nướng Mọi Bản Gang",
          "price": "300.000đ",
          "highlight": false
        },
        {
          "name": "Mì Trứng & Rau Cải Thêm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/de-khong-ten-52-binh-ha",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=D%C3%8A%20KH%C3%94NG%20T%C3%8AN%20-%2052%20B%C3%ACnh%20H%C3%A0",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Dê Không Tên",
      "placeId": "ChIJa7HlUdJtbzERbqzyhKSyJjw",
      "gmapsAddr": "52 Bình Hà Quy Nhơn Gia Lai 590000 Việt Nam",
      "priceMin": 150000,
      "priceMax": 300000,
      "attributes": [
        "heavy",
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 282,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Tráng Cuốn Thịt Luộc Rau Rừng & Nem Lụi Nẫu Cuốn",
      "restaurant": "Nẫu Cuốn",
      "address": "84 - 86 - 88 Đống Đa, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "distance": 0.5,
      "distanceText": "Cách bạn 450m",
      "priceRange": "30.000đ - 65.000đ",
      "rating": 4.7,
      "reviewCount": 0,
      "likesCount": 10,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.784405,
      "longitude": 109.22291799999999,
      "lat": 13.784405,
      "lng": 109.22291799999999,
      "moodIds": [
        "budget",
        "healthy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mhvo07rqgqh46c@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-820l4-mhvo07rqgqh46c@resize_ss640x400"
      ],
      "description": "Quán Nẫu Cuốn tọa lạc tại 84 - 86 - 88 Đống Đa, P. Thị Nại, phục vụ món Bánh Tráng Cuốn Thịt Luộc Rau Rừng & Nem Lụi Nẫu Cuốn hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Tráng Cuốn Thịt Luộc Rau Rừng & Nem Lụi Nẫu Cuốn tại Nẫu Cuốn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 906 400 545",
      "menu": [
        {
          "name": "Mẹt Cuốn Thịt Luộc Bánh Tráng",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Phần Cuốn Nem Lụi Đặc Biệt",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Rau Rừng Thêm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/nau-cuon-84-86-88-dong-da",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=N%E1%BA%ABu%20Cu%E1%BB%91n%20-%2084%2086%2088%20%C4%90%E1%BB%91ng%20%C4%90a",
      "deliveryTime": "15 - 20 phút",
      "deliveryFee": "Freeship đơn từ 50k",
      "deliveryFeeVal": 0,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Nẫu Cuốn - Quán Ăn Ngon Quy Nhơn",
      "placeId": "ChIJX7c-GwBtbzERpJnjOpV1YqE",
      "gmapsAddr": "84-86 Đống Đa Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 30000,
      "priceMax": 65000,
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 285,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Món Chay Thanh Đạm & Lẩu Nấm Minh An Vegan",
      "restaurant": "ẨM THỰC CHAY MINH AN VEGAN",
      "address": "28 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.2,
      "distanceText": "Cách bạn 2.2km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 4.5,
      "reviewCount": 0,
      "likesCount": 25,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7623456,
      "longitude": 109.2167798,
      "lat": 13.7623456,
      "lng": 109.2167798,
      "moodIds": [
        "energetic",
        "healthy",
        "tired",
        "zen"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-maw8kska09g7ab@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7ras8-maw8kska09g7ab@resize_ss640x400"
      ],
      "description": "Quán ẨM THỰC CHAY MINH AN VEGAN tọa lạc tại 28 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Món Chay Thanh Đạm & Lẩu Nấm Minh An Vegan hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Món Chay Thanh Đạm & Lẩu Nấm Minh An Vegan tại ẨM THỰC CHAY MINH AN VEGAN được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 938 532 239",
      "menu": [
        {
          "name": "Cơm Chay Tự Chọn",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Lẩu Nấm Dưỡng Sinh Chay",
          "price": "65.000đ",
          "highlight": false
        },
        {
          "name": "Chả Giò Chay Giòn Rụm",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/am-thuc-chay-minh-an-vegan",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BA%A8M%20TH%E1%BB%B0C%20CHAY%20MINH%20AN%20VEGAN",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ẩm Thực Chay Minh An",
      "placeId": "ChIJt3GqhF9tbzERfUCF_CsQ5Ls",
      "gmapsAddr": "28 Nguyễn Thị Định Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "heavy",
        "hot_soup",
        "light"
      ]
    },
    {
      "id": 289,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Mì Cay 7 Cấp Độ, Gà Sốt Cay & Tokbokki Phô Mai",
      "restaurant": "Pepa’s Kitchen",
      "address": "245 Nguyễn Thị Minh Khai, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.1,
      "distanceText": "Cách bạn 2.1km",
      "priceRange": "35.000đ - 75.000đ",
      "rating": 4,
      "reviewCount": 0,
      "likesCount": 45,
      "commentsCount": 5,
      "openTime": "07:00 - 22:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7634162,
      "longitude": 109.2148295,
      "lat": 13.7634162,
      "lng": 109.2148295,
      "moodIds": [
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mdzvxbn7p81ya2@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-820l4-mdzvxbn7p81ya2@resize_ss640x400"
      ],
      "description": "Quán Pepa’s Kitchen tọa lạc tại 245 Nguyễn Thị Minh Khai, P. Nguyễn Văn Cừ, phục vụ món Mì Cay 7 Cấp Độ, Gà Sốt Cay & Tokbokki Phô Mai hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Mì Cay 7 Cấp Độ, Gà Sốt Cay & Tokbokki Phô Mai tại Pepa’s Kitchen được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 978 380 013",
      "menu": [
        {
          "name": "Tô Mì Cay Hải Sản Cấp Độ 2",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Mẹt Gà Rán Sốt Cay & Tokbokki",
          "price": "75.000đ",
          "highlight": false
        },
        {
          "name": "Trà Sữa Thái Xanh",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/pepas-kitchen-245-nguyen-thi-minh-khai",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Pepa%E2%80%99s%20Kitchen%20-%20245%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
      "deliveryPromoCode": "SHOPEE25K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Quán Ăn Vặt Hàn Quốc PePa's Kitchen",
      "placeId": "ChIJmW1k2epsbzERoJXKQZOTXPw",
      "gmapsAddr": "245 Nguyễn Thị Minh Khai Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 35000,
      "priceMax": 75000,
      "attributes": [
        "hot_soup",
        "spicy"
      ]
    },
    {
      "id": 288,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn",
      "restaurant": "Gánh Cua Mợ Út - Bánh Canh Cua, Lẩu Cua & Cơm Cua",
      "address": "55 Biên Cương, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 1.8,
      "distanceText": "Cách bạn 1.8km",
      "priceRange": "60.000đ - 280.000đ",
      "rating": 4.2,
      "reviewCount": 0,
      "likesCount": 40,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7658995,
      "longitude": 109.2178642,
      "lat": 13.7658995,
      "lng": 109.2178642,
      "moodIds": [
        "celebrate",
        "refreshing",
        "seafood",
        "tired"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#Hải_sản_tươi_sống"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m8yfeql1nlv21c@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m8yfeql1nlv21c@resize_ss640x400"
      ],
      "description": "Quán Gánh Cua Mợ Út - Bánh Canh Cua, Lẩu Cua & Cơm Cua tọa lạc tại 55 Biên Cương, P. Ngô Mây, phục vụ món Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn tại Gánh Cua Mợ Út - Bánh Canh Cua, Lẩu Cua & Cơm Cua cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
      "hotline": "+84 932 553 939",
      "menu": [
        {
          "name": "Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn",
          "price": "60.000đ",
          "highlight": true
        },
        {
          "name": "Phần đặc biệt Gánh Cua Mợ Út - Bánh Canh Cua, Lẩu Cua & Cơm Cua - 55 Biên Cương, Quy Nhơn",
          "price": "280.000đ",
          "highlight": false
        },
        {
          "name": "Phần món ăn kèm đặc sản tại quán",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ganh-cua-mo-ut-banh-canh-cua-lau-cua-com-cua-55-bien-cuong-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ga%CC%81nh%20Cua%20M%C6%A1%CC%A3%20U%CC%81t%20-%20Ba%CC%81nh%20Canh%20Cua%2C%20L%C3%A2%CC%89u%20Cua%20%26%20C%C6%A1m%20Cua%20-%2055%20Bi%C3%AAn%20C%C6%B0%C6%A1ng%2C%20Quy%20Nh%C6%A1n",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Gánh Cua Mợ Út",
      "placeId": "ChIJMUzHBlhtbzERuol8sZrrusc",
      "gmapsAddr": "55 Biên Cương Quy Nhơn Nam Gia Lai 55000 Việt Nam",
      "priceMin": 60000,
      "priceMax": 280000,
      "attributes": [
        "drinks",
        "salty"
      ]
    },
    {
      "id": 287,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Lẩu Ếch Măng Cay Nồng Hổi & Ếch Chiên Bơ Tỏi",
      "restaurant": "Ếch Xanh Quy Nhơn",
      "address": "3 Trương Văn Của, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 3.1,
      "distanceText": "Cách bạn 3.1km",
      "priceRange": "95.000đ - 220.000đ",
      "rating": 5,
      "reviewCount": 0,
      "likesCount": 35,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "hotpot",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7546076,
      "longitude": 109.21375689999999,
      "lat": 13.7546076,
      "lng": 109.21375689999999,
      "moodIds": [
        "celebrate",
        "energetic",
        "late_night",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Hotpot",
        "#ShopeeFood",
        "#Ấm_áp"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m514iilmtmxj3f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m514iilmtmxj3f@resize_ss640x400"
      ],
      "description": "Quán Ếch Xanh Quy Nhơn tọa lạc tại 3 Trương Văn Của, P. Nguyễn Văn Cừ, phục vụ món Lẩu Ếch Măng Cay Nồng Hổi & Ếch Chiên Bơ Tỏi hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Lẩu Ếch Măng Cay Nồng Hổi & Ếch Chiên Bơ Tỏi tại Ếch Xanh Quy Nhơn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 256 3705 999",
      "menu": [
        {
          "name": "Thố Cháo Ếch Singapore",
          "price": "45.000đ",
          "highlight": true
        },
        {
          "name": "Nồi Lẩu Ếch Măng Cay Khổng Lồ",
          "price": "220.000đ",
          "highlight": false
        },
        {
          "name": "Đĩa Ếch Xào Sa Tế Thêm",
          "price": "65.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ech-xanh-quy-nhon-lo-03-truong-van-cua",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BA%BEch%20Xanh%20Quy%20Nh%C6%A1n%20-%20L%C3%B4%2003%20Tr%C6%B0%C6%A1ng%20V%C4%83n%20C%E1%BB%A7a",
      "deliveryTime": "30 - 45 phút",
      "deliveryFee": "22.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 22000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ếch Xanh Quy Nhơn",
      "placeId": "ChIJm0EoXwBtbzERzd4e5cN732s",
      "gmapsAddr": "03 Trương Văn Của Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 95000,
      "priceMax": 220000,
      "attributes": [
        "crunchy",
        "heavy",
        "hot_soup",
        "spicy"
      ]
    },
    {
      "id": 293,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái",
      "restaurant": "Tiệm Bé Bòn - Bánh Tráng Nướng - Trần Thị Kỷ",
      "address": "23 Trần Thị Kỷ, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "15.000đ - 45.000đ",
      "rating": 4.6,
      "reviewCount": 0,
      "likesCount": 65,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.768888299999999,
      "longitude": 109.2191385,
      "lat": 13.768888299999999,
      "lng": 109.2191385,
      "moodIds": [
        "budget",
        "craving",
        "energetic",
        "hangout",
        "late_night",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bbq",
        "#ShopeeFood",
        "#Xì_xèo"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mn7hu6tn4dfn36@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mn7hu6tn4dfn36@resize_ss640x400"
      ],
      "description": "Quán Tiệm Bé Bòn - Bánh Tráng Nướng - Trần Thị Kỷ tọa lạc tại 23 Trần Thị Kỷ, P. Ngô Mây, phục vụ món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái tại Tiệm Bé Bòn - Bánh Tráng Nướng - Trần Thị Kỷ được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 987 625 603",
      "menu": [
        {
          "name": "Bánh Tráng Nướng Trứng Cút",
          "price": "15.000đ",
          "highlight": true
        },
        {
          "name": "Chân Gà Sốt Thái Chua Cay",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Trà Đào Cam Sả Mát Lạnh",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tiem-be-bon-banh-trang-nuong-tran-thi-ky",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ti%E1%BB%87m%20B%C3%A9%20B%C3%B2n%20-%20B%C3%A1nh%20Tr%C3%A1ng%20N%C6%B0%E1%BB%9Bng%20-%20Tr%E1%BA%A7n%20Th%E1%BB%8B%20K%E1%BB%B7",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Tiệm Bé Bòn - Bánh Tráng nướng",
      "placeId": "ChIJQ6OpWoVtbzERgVzUjUDzdh0",
      "gmapsAddr": "23 Trần Thị Kỷ Quy Nhơn Nam Gia Lai 600000 Việt Nam",
      "priceMin": 15000,
      "priceMax": 45000,
      "attributes": [
        "crunchy",
        "sour",
        "spicy"
      ]
    },
    {
      "id": 296,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bún Thịt Nướng & Nem Nướng Chợ Huyện Cuốn Bánh Tráng",
      "restaurant": "Bún Thịt Nướng & Nem Chả Hoà - Quy Nhơn",
      "address": "66A Trần Cao Vân, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "25.000đ - 45.000đ",
      "rating": 4.6,
      "reviewCount": 0,
      "likesCount": 80,
      "commentsCount": 5,
      "openTime": "08:00 - 23:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.772720099999999,
      "longitude": 109.2301665,
      "lat": 13.772720099999999,
      "lng": 109.2301665,
      "moodIds": [
        "budget",
        "craving",
        "energetic",
        "hangout",
        "late_night"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bbq",
        "#ShopeeFood",
        "#Xì_xèo"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m7kvpwm5264j31@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m7kvpwm5264j31@resize_ss640x400"
      ],
      "description": "Quán Bún Thịt Nướng & Nem Chả Hoà - Quy Nhơn tọa lạc tại 66A Trần Cao Vân, P. Lê Lợi, phục vụ món Bún Thịt Nướng & Nem Nướng Chợ Huyện Cuốn Bánh Tráng hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bún Thịt Nướng & Nem Nướng Chợ Huyện Cuốn Bánh Tráng tại Bún Thịt Nướng & Nem Chả Hoà - Quy Nhơn được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 949 840 979",
      "menu": [
        {
          "name": "Tô Bún Thịt Nướng Chả Ram",
          "price": "25.000đ",
          "highlight": true
        },
        {
          "name": "Phần Nem Nướng Cuốn Bánh Tráng",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Chả Ram Tôm Đất Kèm",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-thit-nuong-nem-cha-hoa-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Th%E1%BB%8Bt%20N%C6%B0%E1%BB%9Bng%20%26%20Nem%20Ch%E1%BA%A3%20Ho%C3%A0%20-%20Quy%20Nh%C6%A1n",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
      "deliveryPromoCode": "SHOPEE30K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "BÁNH XÈO QUY NHƠN • BÚN THỊT NƯỚNG HOÀ",
      "placeId": "ChIJ-ZD8kqdtbzERL9PuHAWCSYc",
      "gmapsAddr": "66 Trần Cao Vân Quy Nhơn Gia Lai Việt Nam",
      "priceMin": 25000,
      "priceMax": 45000,
      "attributes": [
        "crunchy",
        "heavy",
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 294,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái",
      "restaurant": "Ăn Vặt Sáu Lượng - Bánh Tráng Nướng, Trứng Nướng & Chân Gà Sốt Thái",
      "address": "24 Nguyễn Lữ, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 2,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "15.000đ - 45.000đ",
      "rating": 4,
      "reviewCount": 0,
      "likesCount": 70,
      "commentsCount": 5,
      "openTime": "06:00 - 21:30",
      "category": "streetfood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.763789,
      "longitude": 109.21790899999999,
      "lat": 13.763789,
      "lng": 109.21790899999999,
      "moodIds": [
        "budget",
        "craving",
        "energetic",
        "hangout",
        "spicy"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Bbq",
        "#ShopeeFood",
        "#Xì_xèo"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m6nf70vcrxr505@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m6nf70vcrxr505@resize_ss640x400"
      ],
      "description": "Quán Ăn Vặt Sáu Lượng - Bánh Tráng Nướng, Trứng Nướng & Chân Gà Sốt Thái tọa lạc tại 24 Nguyễn Lữ, P. Ngô Mây, phục vụ món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái hương vị thơm ngon đặc trưng. Hình ảnh thực tế từ nền tảng ShopeeFood.",
      "recommendReason": "Món Bánh Tráng Nướng Trứng Cút Bò Khô & Chân Gà Sốt Thái tại Ăn Vặt Sáu Lượng - Bánh Tráng Nướng, Trứng Nướng & Chân Gà Sốt Thái được đông đảo thực khách đánh giá cao, giá cả cực kỳ hợp lý!",
      "hotline": "+84 969 067 825",
      "menu": [
        {
          "name": "Bánh Tráng Nướng Trứng Cút",
          "price": "15.000đ",
          "highlight": true
        },
        {
          "name": "Chân Gà Sốt Thái Chua Cay",
          "price": "45.000đ",
          "highlight": false
        },
        {
          "name": "Trà Đào Cam Sả Mát Lạnh",
          "price": "20.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/an-vat-sau-luong-banh-trang-nuong-trung-nuong-chan-ga-sot-thai",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%82n%20V%E1%BA%B7t%20S%C3%A1u%20L%C6%B0%E1%BB%A3ng%20-%20B%C3%A1nh%20Tr%C3%A1ng%20N%C6%B0%E1%BB%9Bng%2C%20Tr%E1%BB%A9ng%20N%C6%B0%E1%BB%9Bng%20%26%20Ch%C3%A2n%20G%C3%A0%20S%E1%BB%91t%20Th%C3%A1i",
      "deliveryTime": "20 - 30 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.6 ⭐ (1.000+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ăn Vặt Sáu Lượng CN Quy Nhơn",
      "placeId": "ChIJTxoKSwBtbzERkLMnz3rps4M",
      "gmapsAddr": "24 Nguyễn Lữ Quy Nhơn Nam Gia Lai Việt Nam",
      "priceMin": 15000,
      "priceMax": 45000,
      "attributes": [
        "crunchy",
        "sour",
        "spicy"
      ]
    },
    {
      "id": 297,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Kem Ý Gelato Tự Chọn Trái Cây & Kem Xôi Dừa",
      "restaurant": "Jolly - Kem Ý Tự Chọn - Lê Lợi",
      "address": "65 Lê Lợi, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "25.000đ - 50.000đ",
      "priceMin": 25000,
      "priceMax": 50000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "07:00 - 23:00",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.772682,
      "longitude": 109.231717,
      "lat": 13.772682,
      "lng": 109.231717,
      "moodIds": [
        "budget",
        "chill",
        "late_night",
        "quick",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ozz76m7krcd@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ozz76m7krcd@resize_ss640x400"
      ],
      "description": "Quán Jolly - Kem Ý Tự Chọn - Lê Lợi tọa lạc tại 65 Lê Lợi, P. Trần Hưng Đạo, phục vụ món Kem Ý Gelato Tự Chọn Trái Cây & Kem Xôi Dừa ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Kem Ý Gelato Tự Chọn Trái Cây & Kem Xôi Dừa tại Jolly - Kem Ý Tự Chọn - Lê Lợi được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Kem Ý Gelato Ly Tự Chọn (3 vị)",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Kem Xôi Dừa Thốt Nốt Nóng Dẻo",
          "price": "30.000đ",
          "highlight": false
        },
        {
          "name": "Lẩu Kem Trái Cây Nhiệt Đới",
          "price": "50.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/jolly-kem-t-ch-n-l-l-i",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Jolly%20-%20Kem%20Ý%20Tự%20Chọn%20-%20Lê%20Lợi",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Jolly - Kem Ý Tự Chọn - Lê Lợi",
      "placeId": "ChIJ_food_297",
      "gmapsAddr": "65 Lê Lợi, P. Trần Hưng Đạo, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 298,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Nướng Đài Loan Trân Châu Hoàng Kim",
      "restaurant": "Trà Sữa Nướng Đài Loan - Xinxian",
      "address": "171 Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "22.000đ - 45.000đ",
      "priceMin": 22000,
      "priceMax": 45000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "08:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7659307,
      "longitude": 109.2126993,
      "lat": 13.7659307,
      "lng": 109.2126993,
      "moodIds": [
        "budget",
        "chill",
        "energetic",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc5hwmbqh0ae@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc5hwmbqh0ae@resize_ss640x400"
      ],
      "description": "Quán Trà Sữa Nướng Đài Loan - Xinxian tọa lạc tại 171 Ngô Mây, phục vụ món Trà Sữa Nướng Đài Loan Trân Châu Hoàng Kim ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Trà Sữa Nướng Đài Loan Trân Châu Hoàng Kim tại Trà Sữa Nướng Đài Loan - Xinxian được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Trà Sữa Nướng Trân Châu Hoàng Kim",
          "price": "28.000đ",
          "highlight": true
        },
        {
          "name": "Trà Ô Long Sữa Lài Kem Cheese",
          "price": "32.000đ",
          "highlight": false
        },
        {
          "name": "Sữa Tươi Trân Châu Đường Đen",
          "price": "30.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tr-s-a-n-ng-i-loan-xinxian",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Trà%20Sữa%20Nướng%20Đài%20Loan%20-%20Xinxian",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Trà Sữa Nướng Đài Loan - Xinxian",
      "placeId": "ChIJ_food_298",
      "gmapsAddr": "171 Ngô Mây, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 299,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Kem Bơ Sáp Dừa Béo Ngậy & Sinh Tố Bơ Đà Lạt",
      "restaurant": "Kem Bơ ALoo - 395 Nguyễn Huệ",
      "address": "395 Nguyễn Huệ, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "25.000đ - 45.000đ",
      "priceMin": 25000,
      "priceMax": 45000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "08:00 - 23:00",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7647004,
      "longitude": 109.2238761,
      "lat": 13.7647004,
      "lng": 109.2238761,
      "moodIds": [
        "budget",
        "chill",
        "late_night",
        "refreshing",
        "sweet",
        "tired"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m3ygh2rt1juk1b@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m3ygh2rt1juk1b@resize_ss640x400"
      ],
      "description": "Quán Kem Bơ ALoo - 395 Nguyễn Huệ tọa lạc tại 395 Nguyễn Huệ, P. Trần Phú, phục vụ món Kem Bơ Sáp Dừa Béo Ngậy & Sinh Tố Bơ Đà Lạt ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Kem Bơ Sáp Dừa Béo Ngậy & Sinh Tố Bơ Đà Lạt tại Kem Bơ ALoo - 395 Nguyễn Huệ được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Kem Bơ Sáp Dừa Đặc Biệt",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Kem Bơ Sầu Riêng Nguyên Chất",
          "price": "40.000đ",
          "highlight": false
        },
        {
          "name": "Sinh Tố Bơ Dừa Béo Mịn",
          "price": "35.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/kem-b-aloo-395-nguy-n-hu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Kem%20Bơ%20ALoo%20-%20395%20Nguyễn%20Huệ",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Kem Bơ ALoo - 395 Nguyễn Huệ",
      "placeId": "ChIJ_food_299",
      "gmapsAddr": "395 Nguyễn Huệ, P. Trần Phú, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 300,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Kem Bơ Sầu Riêng Nguyên Chất & Hoa Quả Dầm",
      "restaurant": "Kem Bơ Sầu Riêng Mỹ Tài - Sinh Tố Giải Khát, Trái Cây & Cafe",
      "address": "395A Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "25.000đ - 55.000đ",
      "priceMin": 25000,
      "priceMax": 55000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "07:30 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7646732,
      "longitude": 109.2238159,
      "lat": 13.7646732,
      "lng": 109.2238159,
      "moodIds": [
        "budget",
        "chill",
        "healthy",
        "refreshing",
        "sweet",
        "tired"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mmyf9c372ebs7f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mmyf9c372ebs7f@resize_ss640x400"
      ],
      "description": "Quán Kem Bơ Sầu Riêng Mỹ Tài - Sinh Tố Giải Khát, Trái Cây & Cafe tọa lạc tại 395A Nguyễn Huệ, phục vụ món Kem Bơ Sầu Riêng Nguyên Chất & Hoa Quả Dầm ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Kem Bơ Sầu Riêng Nguyên Chất & Hoa Quả Dầm tại Kem Bơ Sầu Riêng Mỹ Tài - Sinh Tố Giải Khát, Trái Cây & Cafe được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Kem Bơ Sầu Riêng Mỹ Tài",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Chè Thái Sầu Riêng Béo Ngậy",
          "price": "35.000đ",
          "highlight": false
        },
        {
          "name": "Hoa Quả Dầm Sữa Chua Dẻo",
          "price": "30.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/kem-b-s-u-ri-ng-m-t-i-sinh-t-gi-i-kh-t-tr-i-c-y-cafe",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Kem%20Bơ%20Sầu%20Riêng%20Mỹ%20Tài%20-%20Sinh%20Tố%20Giải%20Khát,%20Trái%20Cây%20&%20Cafe",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Kem Bơ Sầu Riêng Mỹ Tài - Sinh Tố Giải Khát, Trái Cây & Cafe",
      "placeId": "ChIJ_food_300",
      "gmapsAddr": "395A Nguyễn Huệ, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 301,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Kem Trứng Nướng & Trà Đào Cam Sả",
      "restaurant": "Tiệm Trà Nhà Bo - Trà Sữa, Trà Trái Cây & Nước Ép Online",
      "address": "350 Đường Hoàng Văn Thụ, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "20.000đ - 45.000đ",
      "priceMin": 20000,
      "priceMax": 45000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "08:00 - 22:00",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.771051,
      "longitude": 109.214982,
      "lat": 13.771051,
      "lng": 109.214982,
      "moodIds": [
        "budget",
        "chill",
        "energetic",
        "refreshing",
        "sweet",
        "tired"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc059o86u17d@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc059o86u17d@resize_ss640x400"
      ],
      "description": "Quán Tiệm Trà Nhà Bo - Trà Sữa, Trà Trái Cây & Nước Ép Online tọa lạc tại 350 Đường Hoàng Văn Thụ, P. Ngô Mây, phục vụ món Trà Sữa Kem Trứng Nướng & Trà Đào Cam Sả ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Trà Sữa Kem Trứng Nướng & Trà Đào Cam Sả tại Tiệm Trà Nhà Bo - Trà Sữa, Trà Trái Cây & Nước Ép Online được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Trà Sữa Kem Trứng Khò Nướng",
          "price": "28.000đ",
          "highlight": true
        },
        {
          "name": "Trà Đào Cam Sả Mát Lạnh",
          "price": "25.000đ",
          "highlight": false
        },
        {
          "name": "Trà Mãng Cầu Đậm Vị",
          "price": "28.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ti-m-tr-nh-bo-tr-s-a-tr-tr-i-c-y-n-c-p-online",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Tiệm%20Trà%20Nhà%20Bo%20-%20Trà%20Sữa,%20Trà%20Trái%20Cây%20&%20Nước%20Ép%20Online",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Tiệm Trà Nhà Bo - Trà Sữa, Trà Trái Cây & Nước Ép Online",
      "placeId": "ChIJ_food_301",
      "gmapsAddr": "350 Đường Hoàng Văn Thụ, P. Ngô Mây, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 302,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Trân Châu Sợi & Trà Ô Long Kem Cheese",
      "restaurant": "Trà Sữa Pozaa Tea - Ngô Mây",
      "address": "44 Ngô Mây, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "25.000đ - 50.000đ",
      "priceMin": 25000,
      "priceMax": 50000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "08:00 - 23:00",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.762367,
      "longitude": 109.218589,
      "lat": 13.762367,
      "lng": 109.218589,
      "moodIds": [
        "budget",
        "chill",
        "late_night",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbq04btojizba@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbq04btojizba@resize_ss640x400"
      ],
      "description": "Quán Trà Sữa Pozaa Tea - Ngô Mây tọa lạc tại 44 Ngô Mây, P. Lý Thường Kiệt, phục vụ món Trà Sữa Trân Châu Sợi & Trà Ô Long Kem Cheese ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Trà Sữa Trân Châu Sợi & Trà Ô Long Kem Cheese tại Trà Sữa Pozaa Tea - Ngô Mây được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Trà Sữa Pozaa Trân Châu Sợi",
          "price": "32.000đ",
          "highlight": true
        },
        {
          "name": "Trà Thiết Quan Âm Kem Sữa Macchiato",
          "price": "35.000đ",
          "highlight": false
        },
        {
          "name": "Trà Bưởi Hồng Mật Ong",
          "price": "30.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tr-s-a-pozaa-tea-ng-m-y",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Trà%20Sữa%20Pozaa%20Tea%20-%20Ngô%20Mây",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Trà Sữa Pozaa Tea - Ngô Mây",
      "placeId": "ChIJ_food_302",
      "gmapsAddr": "44 Ngô Mây, P. Lý Thường Kiệt, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 303,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Matcha Đậu Đỏ & Trà Hoa Quả Nhiệt Đới",
      "restaurant": "Trà Sữa Vie Tea - 43 Nguyễn Lữ",
      "address": "43 Nguyễn Lữ , P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "20.000đ - 45.000đ",
      "priceMin": 20000,
      "priceMax": 45000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "07:30 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7641483,
      "longitude": 109.2179509,
      "lat": 13.7641483,
      "lng": 109.2179509,
      "moodIds": [
        "budget",
        "chill",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lt7vk86b82boc5@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lt7vk86b82boc5@resize_ss640x400"
      ],
      "description": "Quán Trà Sữa Vie Tea - 43 Nguyễn Lữ tọa lạc tại 43 Nguyễn Lữ , P. Ngô Mây, phục vụ món Trà Sữa Matcha Đậu Đỏ & Trà Hoa Quả Nhiệt Đới ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Trà Sữa Matcha Đậu Đỏ & Trà Hoa Quả Nhiệt Đới tại Trà Sữa Vie Tea - 43 Nguyễn Lữ được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Trà Sữa Matcha Đậu Đỏ Uji",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Trà Dâu Tằm Phô Mai Tươi",
          "price": "28.000đ",
          "highlight": false
        },
        {
          "name": "Trà Sữa Nướng Kem Brulee",
          "price": "32.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tr-s-a-vie-tea-43-nguy-n-l",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Trà%20Sữa%20Vie%20Tea%20-%2043%20Nguyễn%20Lữ",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Trà Sữa Vie Tea - 43 Nguyễn Lữ",
      "placeId": "ChIJ_food_303",
      "gmapsAddr": "43 Nguyễn Lữ , P. Ngô Mây, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 304,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Khổng Lồ Full Topping & Trà Trái Cây",
      "restaurant": "Trà Sữa Nọng - Vũ Bảo",
      "address": "92 Vũ Bảo, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "22.000đ - 45.000đ",
      "priceMin": 22000,
      "priceMax": 45000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "08:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7659423,
      "longitude": 109.2189113,
      "lat": 13.7659423,
      "lng": 109.2189113,
      "moodIds": [
        "budget",
        "chill",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc6tx824rd05@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc6tx824rd05@resize_ss640x400"
      ],
      "description": "Quán Trà Sữa Nọng - Vũ Bảo tọa lạc tại 92 Vũ Bảo, P. Ngô Mây, phục vụ món Trà Sữa Khổng Lồ Full Topping & Trà Trái Cây ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Trà Sữa Khổng Lồ Full Topping & Trà Trái Cây tại Trà Sữa Nọng - Vũ Bảo được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Ly Trà Sữa Khổng Lồ 1 Lít Full Topping",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Trà Vải Hoa Hồng Thanh Mát",
          "price": "28.000đ",
          "highlight": false
        },
        {
          "name": "Sữa Tươi Sương Sáo Đường Đen",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tr-s-a-n-ng-v-b-o",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Trà%20Sữa%20Nọng%20-%20Vũ%20Bảo",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Trà Sữa Nọng - Vũ Bảo",
      "placeId": "ChIJ_food_304",
      "gmapsAddr": "92 Vũ Bảo, P. Ngô Mây, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 305,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trà Sữa Truyền Thống Thạch Phô Mai & Bánh Flan",
      "restaurant": "Thanh Trà - Trà Sữa - 401B Nguyễn Huệ",
      "address": "401B Nguyễn Huệ, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "20.000đ - 45.000đ",
      "priceMin": 20000,
      "priceMax": 45000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "08:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7644549,
      "longitude": 109.2237039,
      "lat": 13.7644549,
      "lng": 109.2237039,
      "moodIds": [
        "budget",
        "chill",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mr0k70fxw5c6f3@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mr0k70fxw5c6f3@resize_ss640x400"
      ],
      "description": "Quán Thanh Trà - Trà Sữa - 401B Nguyễn Huệ tọa lạc tại 401B Nguyễn Huệ, P. Trần Phú, phục vụ món Trà Sữa Truyền Thống Thạch Phô Mai & Bánh Flan ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Trà Sữa Truyền Thống Thạch Phô Mai & Bánh Flan tại Thanh Trà - Trà Sữa - 401B Nguyễn Huệ được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Trà Sữa Thạch Phô Mai Viên Khổng Lồ",
          "price": "30.000đ",
          "highlight": true
        },
        {
          "name": "Bánh Flan Caramel Cốt Dừa",
          "price": "18.000đ",
          "highlight": false
        },
        {
          "name": "Trà Ổi Hồng Muối Ớt",
          "price": "25.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/thanh-tr-tr-s-a-401b-nguy-n-hu",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Thanh%20Trà%20-%20Trà%20Sữa%20-%20401B%20Nguyễn%20Huệ",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Thanh Trà - Trà Sữa - 401B Nguyễn Huệ",
      "placeId": "ChIJ_food_305",
      "gmapsAddr": "401B Nguyễn Huệ, P. Trần Phú, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 306,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Kem Flan Caramel Béo Mịn & Sữa Chua Dẻo Trái Cây",
      "restaurant": "Ốc Um & Kem Flan",
      "address": "322 Nguyễn Thái Học, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 0.8,
      "distanceText": "Cách bạn 800m",
      "priceRange": "15.000đ - 45.000đ",
      "priceMin": 15000,
      "priceMax": 45000,
      "rating": 4.6,
      "reviewCount": 42,
      "likesCount": 168,
      "commentsCount": 12,
      "openTime": "14:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.767022,
      "longitude": 109.216104,
      "lat": 13.767022,
      "lng": 109.216104,
      "moodIds": [
        "budget",
        "chill",
        "craving",
        "refreshing",
        "sweet"
      ],
      "weather": [
        "sunny",
        "hot"
      ],
      "weatherNote": "Quy Nhơn mát lạnh",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#Đồ_ngọt",
        "#Trà_sữa"
      ],
      "sideRibbon": [
        "#hot",
        "#món_ngọt"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoz15pbm5722@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoz15pbm5722@resize_ss640x400"
      ],
      "description": "Quán Ốc Um & Kem Flan tọa lạc tại 322 Nguyễn Thái Học, P. Ngô Mây, phục vụ món Kem Flan Caramel Béo Mịn & Sữa Chua Dẻo Trái Cây ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
      "recommendReason": "Món Kem Flan Caramel Béo Mịn & Sữa Chua Dẻo Trái Cây tại Ốc Um & Kem Flan được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
      "hotline": "+84 905 123 456",
      "menu": [
        {
          "name": "Đĩa 2 Bánh Flan Caramel Cà Phê Cốt Dừa",
          "price": "20.000đ",
          "highlight": true
        },
        {
          "name": "Sữa Chua Dẻo Xắt Miếng Hoa Quả",
          "price": "25.000đ",
          "highlight": false
        },
        {
          "name": "Rau Câu Dừa Xiêm Mát Lạnh",
          "price": "15.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/c-um-kem-flan",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ốc%20Um%20&%20Kem%20Flan",
      "deliveryTime": "15 - 25 phút",
      "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
      "deliveryFeeVal": 16000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryPromoCode": "SHOPEE20K",
      "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
      "gmapsVerified": true,
      "gmapsName": "Ốc Um & Kem Flan",
      "placeId": "ChIJ_food_306",
      "gmapsAddr": "322 Nguyễn Thái Học, P. Ngô Mây, Quy Nhơn, Bình Định",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 667038,
      "name": "Santorino Cafe",
      "restaurant": "Santorino Cafe",
      "address": "81 Trần Phú",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.7,
      "reviewCount": 48,
      "lat": 13.774424,
      "lng": 109.225557,
      "latitude": 13.774424,
      "longitude": 109.225557,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbg65a1las9dc@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 122653,
      "name": "Surf Bar 2 Cafe",
      "restaurant": "Surf Bar 2 Cafe",
      "address": "Đường Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 47,
      "lat": 13.770476,
      "lng": 109.235216,
      "latitude": 13.770476,
      "longitude": 109.235216,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdfzmn453vd5d@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 153017,
      "name": "Jolly - Kem Ý Tự Chọn - Lê Lợi",
      "restaurant": "Jolly - Kem Ý Tự Chọn - Lê Lợi",
      "address": "65 Lê Lợi, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.1,
      "reviewCount": 40,
      "lat": 13.772682,
      "lng": 109.231717,
      "latitude": 13.772682,
      "longitude": 109.231717,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ozz76m7krcd@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 704123,
      "name": "Trà Sữa Bobapop - Lê Lợi",
      "restaurant": "Trà Sữa Bobapop - Lê Lợi",
      "address": "145 Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 42,
      "lat": 13.775306,
      "lng": 109.232149,
      "latitude": 13.775306,
      "longitude": 109.232149,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6wvrzvyzf38@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 749163,
      "name": "YQ Cafe",
      "restaurant": "YQ Cafe",
      "address": "18 Trần Văn Ơn, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.3,
      "reviewCount": 34,
      "lat": 13.755627,
      "lng": 109.216066,
      "latitude": 13.755627,
      "longitude": 109.216066,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwer4q50cwd54b@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 169927,
      "name": "Kem Pop - Kem Gelato & Yogurt",
      "restaurant": "Kem Pop - Kem Gelato & Yogurt",
      "address": "316 Phan Bội Châu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 29,
      "lat": 13.777452,
      "lng": 109.226657,
      "latitude": 13.777452,
      "longitude": 109.226657,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaidvdf1hp569@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 312333,
      "name": "Chất Cafe - Since 2016",
      "restaurant": "Chất Cafe - Since 2016",
      "address": "5 Nguyễn Lương Bằng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.9,
      "reviewCount": 27,
      "lat": 13.773502,
      "lng": 109.223148,
      "latitude": 13.773502,
      "longitude": 109.223148,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwavd2kq3gt734@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 211983,
      "name": "Green Cafe",
      "restaurant": "Green Cafe",
      "address": "43 Lê Thánh Tôn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 25,
      "lat": 13.772574,
      "lng": 109.235104,
      "latitude": 13.772574,
      "longitude": 109.235104,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgo74y81om1d7@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 186852,
      "name": "View Coffee",
      "restaurant": "View Coffee",
      "address": "417 - 419 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.0,
      "reviewCount": 21,
      "lat": 13.764015,
      "lng": 109.223174,
      "latitude": 13.764015,
      "longitude": 109.223174,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwddmopz46or05@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 183039,
      "name": "Marina Coffee",
      "restaurant": "Marina Coffee",
      "address": "5 Trần Quý Cáp",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.5,
      "reviewCount": 21,
      "lat": 13.7741875,
      "lng": 109.2331553,
      "latitude": 13.7741875,
      "longitude": 109.2331553,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbhpiwo5o7v1f@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 633361,
      "name": "Mộc Trà Cafe",
      "restaurant": "Mộc Trà Cafe",
      "address": "Ngã 3 Lê Lợi - Bà Huyện Thanh Quan",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.1,
      "reviewCount": 20,
      "lat": 13.7794881563439,
      "lng": 109.235065318644,
      "latitude": 13.7794881563439,
      "longitude": 109.235065318644,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwefwq1lx23f41@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 170734,
      "name": "Búp Station - Coffee & Milktea",
      "restaurant": "Búp Station - Coffee & Milktea",
      "address": "37B Ngô Mây, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 18,
      "lat": 13.763348,
      "lng": 109.216545,
      "latitude": 13.763348,
      "longitude": 109.216545,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaygvh4c63f95@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 95051,
      "name": "Like Kafe",
      "restaurant": "Like Kafe",
      "address": "15 Trường Chinh",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.1,
      "reviewCount": 20,
      "lat": 13.77175,
      "lng": 109.224597,
      "latitude": 13.77175,
      "longitude": 109.224597,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdb8hekelsr5b@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 667918,
      "name": "Bobo Station - Trần Cao Vân",
      "restaurant": "Bobo Station - Trần Cao Vân",
      "address": "68 Trần Cao Vân",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 17,
      "lat": 13.774534,
      "lng": 109.230299,
      "latitude": 13.774534,
      "longitude": 109.230299,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9snbo6zpp58e@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 282074,
      "name": "TP66 Cafe",
      "restaurant": "TP66 Cafe",
      "address": "66 Trần Phú",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 16,
      "lat": 13.773982,
      "lng": 109.225753,
      "latitude": 13.773982,
      "longitude": 109.225753,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvi0pkfbvf45@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 679645,
      "name": "The Palace Tea",
      "restaurant": "The Palace Tea",
      "address": "132 Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 20,
      "lat": 13.775098,
      "lng": 109.232514,
      "latitude": 13.775098,
      "longitude": 109.232514,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwc2ke0re9cre3@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 44494,
      "name": "Sinh Tố Kim Đình - Bánh Bèo Nóng & Chè Đậu Xanh",
      "restaurant": "Sinh Tố Kim Đình - Bánh Bèo Nóng & Chè Đậu Xanh",
      "address": "20 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 20,
      "lat": 13.772256,
      "lng": 109.241397,
      "latitude": 13.772256,
      "longitude": 109.241397,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhmy5a4vahl09@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "light",
        "sweet"
      ]
    },
    {
      "id": 731732,
      "name": "Heekcaa Quy Nhơn",
      "restaurant": "Heekcaa Quy Nhơn",
      "address": "66 Trần Phú, TP Quy Nhơn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 17,
      "lat": 13.774215,
      "lng": 109.225739,
      "latitude": 13.774215,
      "longitude": 109.225739,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwarhj5zac4984@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 784000,
      "name": "Chu’s Coffee & Fruit",
      "restaurant": "Chu’s Coffee & Fruit",
      "address": "184 Cần Vương",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.7,
      "reviewCount": 13,
      "lat": 13.753454,
      "lng": 109.210377,
      "latitude": 13.753454,
      "longitude": 109.210377,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8f0ywl31zv95@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 226704,
      "name": "Puppy Tea - Trà Sữa & Ăn Vặt",
      "restaurant": "Puppy Tea - Trà Sữa & Ăn Vặt",
      "address": "3 Trần Thị Kỷ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 15,
      "lat": 13.7684032332517,
      "lng": 109.220188781619,
      "latitude": 13.7684032332517,
      "longitude": 109.220188781619,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8svuxmu2fv83@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 634777,
      "name": "Silent - Kitchen & Coffee",
      "restaurant": "Silent - Kitchen & Coffee",
      "address": "106 Mai Xuân Thưởng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.1,
      "reviewCount": 15,
      "lat": 13.7749544111183,
      "lng": 109.2240749672055,
      "latitude": 13.7749544111183,
      "longitude": 109.2240749672055,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwg43jyll6u12f@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 187378,
      "name": "Country Coffee & Tea",
      "restaurant": "Country Coffee & Tea",
      "address": "49 Ỷ Lan",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 13,
      "lat": 13.7813308708547,
      "lng": 109.226874,
      "latitude": 13.7813308708547,
      "longitude": 109.226874,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwg97gpaxn8bf6@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 290891,
      "name": "Pham's House Coffee & Tea",
      "restaurant": "Pham's House Coffee & Tea",
      "address": "8 Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 14,
      "lat": 13.761484,
      "lng": 109.22008,
      "latitude": 13.761484,
      "longitude": 109.22008,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh9uc4gmnrvb5@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 225307,
      "name": "Inn Cafe",
      "restaurant": "Inn Cafe",
      "address": "22 Nguyễn Bỉnh Khiêm",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 14,
      "lat": 13.771347,
      "lng": 109.223835,
      "latitude": 13.771347,
      "longitude": 109.223835,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw91k4yxfrh74e@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 628142,
      "name": "KENSI - Coffee & Tea",
      "restaurant": "KENSI - Coffee & Tea",
      "address": "56 Đô Đốc Bảo",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 14,
      "lat": 13.7668147452343,
      "lng": 109.2228267341852,
      "latitude": 13.7668147452343,
      "longitude": 109.2228267341852,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbt7xkkje1nf1@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 934194,
      "name": "Festina Lente Restaurant & Coffee",
      "restaurant": "Festina Lente Restaurant & Coffee",
      "address": "Đối Diện 226 Nguyễn Thị Định",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 15,
      "lat": 13.754997,
      "lng": 109.212584,
      "latitude": 13.754997,
      "longitude": 109.212584,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhpimaj84bd24@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 241338,
      "name": "Bảo Vân Ice Cream & Tea - Ngô Văn Sở",
      "restaurant": "Bảo Vân Ice Cream & Tea - Ngô Văn Sở",
      "address": "16 Ngô Văn Sở",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 11,
      "lat": 13.7654441039126,
      "lng": 109.2253909260034,
      "latitude": 13.7654441039126,
      "longitude": 109.2253909260034,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbfbp7tmfvddf@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 210511,
      "name": "Kem Misu",
      "restaurant": "Kem Misu",
      "address": "22C Phan Bội Châu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.5,
      "reviewCount": 12,
      "lat": 13.77464,
      "lng": 109.231828,
      "latitude": 13.77464,
      "longitude": 109.231828,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw99woc2luxnaa@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 146405,
      "name": "Espresso Coffee - Hai Bà Trưng",
      "restaurant": "Espresso Coffee - Hai Bà Trưng",
      "address": "172A Hai Bà Trưng, P. Lợi Khê",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.2,
      "reviewCount": 12,
      "lat": 13.771509,
      "lng": 109.22933,
      "latitude": 13.771509,
      "longitude": 109.22933,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8woo0hjeu1a8@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 688044,
      "name": "Trà Sữa Holika",
      "restaurant": "Trà Sữa Holika",
      "address": "5 Nguyễn Lương Bằng, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.3,
      "reviewCount": 11,
      "lat": 13.773497,
      "lng": 109.223625,
      "latitude": 13.773497,
      "longitude": 109.223625,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbxcv70evh57e@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 229359,
      "name": "Mitu Cafe Take Away",
      "restaurant": "Mitu Cafe Take Away",
      "address": "156 Hai Bà Trưng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 14,
      "lat": 13.7718,
      "lng": 109.22929,
      "latitude": 13.7718,
      "longitude": 109.22929,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe3aczmg5i33f@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 679974,
      "name": "Ming Tea - Trà Sữa Đài Loan",
      "restaurant": "Ming Tea - Trà Sữa Đài Loan",
      "address": "230 Tăng Bạt Hổ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 14,
      "lat": 13.772689,
      "lng": 109.226334,
      "latitude": 13.772689,
      "longitude": 109.226334,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvxycyx3o985@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 630466,
      "name": "Uni Cafe",
      "restaurant": "Uni Cafe",
      "address": "202 Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 14,
      "lat": 13.773406,
      "lng": 109.227737,
      "latitude": 13.773406,
      "longitude": 109.227737,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwexo749abizce@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 210135,
      "name": "Kem Thuỷ Vân - Phan Bội Châu",
      "restaurant": "Kem Thuỷ Vân - Phan Bội Châu",
      "address": "22A Phan Bội Châu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 11,
      "lat": 13.773747,
      "lng": 109.235584,
      "latitude": 13.773747,
      "longitude": 109.235584,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb2lllb5pzv7f@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 225418,
      "name": "1990 Cafe",
      "restaurant": "1990 Cafe",
      "address": "7 Đường 31 Tháng 3",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.5,
      "reviewCount": 11,
      "lat": 13.77613,
      "lng": 109.234172,
      "latitude": 13.77613,
      "longitude": 109.234172,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9s9bhutxp7f7@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 242874,
      "name": "Garden Cafe - Trái Cây Tô",
      "restaurant": "Garden Cafe - Trái Cây Tô",
      "address": "14 Nguyễn Trân, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 10,
      "lat": 13.770139,
      "lng": 109.224092,
      "latitude": 13.770139,
      "longitude": 109.224092,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvccuwp61l28@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 715055,
      "name": "Daisutee Milktea - Nguyễn Thị Định",
      "restaurant": "Daisutee Milktea - Nguyễn Thị Định",
      "address": "54A Nguyễn Thị Định",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.2,
      "reviewCount": 11,
      "lat": 13.761724,
      "lng": 109.216374,
      "latitude": 13.761724,
      "longitude": 109.216374,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdke66pvpax64@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 711078,
      "name": "Trà Tiên Hưởng - An Phú Thịnh Plaza",
      "restaurant": "Trà Tiên Hưởng - An Phú Thịnh Plaza",
      "address": "Tầng Trệt, An Phú Thịnh Plaza, 52A Tăng Bạt Hổ, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.1,
      "reviewCount": 13,
      "lat": 13.773209,
      "lng": 109.233332,
      "latitude": 13.773209,
      "longitude": 109.233332,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwga3ctisy57d7@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 763841,
      "name": "Trà Sữa Pozaa Tea - Ngô Mây",
      "restaurant": "Trà Sữa Pozaa Tea - Ngô Mây",
      "address": "44 Ngô Mây, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.6,
      "reviewCount": 12,
      "lat": 13.762367,
      "lng": 109.218589,
      "latitude": 13.762367,
      "longitude": 109.218589,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbq04btojizba@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 663638,
      "name": "Chất Cafe - Hoàng Diệu",
      "restaurant": "Chất Cafe - Hoàng Diệu",
      "address": "53 Hoàng Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 10,
      "lat": 13.769306,
      "lng": 109.223505,
      "latitude": 13.769306,
      "longitude": 109.223505,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbg5srfwp2390@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 225911,
      "name": "Kem Baskin Robbins",
      "restaurant": "Kem Baskin Robbins",
      "address": "7 Lê Duẩn, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 7,
      "lat": 13.767473,
      "lng": 109.221108,
      "latitude": 13.767473,
      "longitude": 109.221108,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw99yrjairq1c4@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 713639,
      "name": "Tầm Cafe",
      "restaurant": "Tầm Cafe",
      "address": "92 Biên Cương",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 12,
      "lat": 13.766875,
      "lng": 109.218734,
      "latitude": 13.766875,
      "longitude": 109.218734,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbj17km0y5599@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 757867,
      "name": "Trà Sữa Ocha House",
      "restaurant": "Trà Sữa Ocha House",
      "address": "401 Nguyễn Thái Học, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 10,
      "lat": 13.762825,
      "lng": 109.21342,
      "latitude": 13.762825,
      "longitude": 109.21342,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf0gqrubjkr13@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 290298,
      "name": "Passion - Coffee & Tea",
      "restaurant": "Passion - Coffee & Tea",
      "address": "19 Trần Nguyên Đán, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 10,
      "lat": 13.7715077,
      "lng": 109.2250908999999,
      "latitude": 13.7715077,
      "longitude": 109.2250908999999,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi62rhfg5i1eb@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 688065,
      "name": "Ngõ Coffee & Milktea",
      "restaurant": "Ngõ Coffee & Milktea",
      "address": "100/1 Hàm Nghi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.4,
      "reviewCount": 9,
      "lat": 13.768275,
      "lng": 109.218679,
      "latitude": 13.768275,
      "longitude": 109.218679,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwevldv2ktzt93@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 688616,
      "name": "Trà Sữa Goky",
      "restaurant": "Trà Sữa Goky",
      "address": "Tầng 08, An Phú Thịnh Plaza, 52A Tăng Bạt Hổ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.4,
      "reviewCount": 12,
      "lat": 13.773154,
      "lng": 109.232942,
      "latitude": 13.773154,
      "longitude": 109.232942,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9mvq23pxp7ff@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 869708,
      "name": "Chan Tea - Lê Lợi",
      "restaurant": "Chan Tea - Lê Lợi",
      "address": "121 Lê Lợi, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 9,
      "lat": 13.7744102776282,
      "lng": 109.2321266233921,
      "latitude": 13.7744102776282,
      "longitude": 109.2321266233921,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw94wmpln1sra5@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 133681,
      "name": "Trà Sữa Cool - Đô Đốc Bảo",
      "restaurant": "Trà Sữa Cool - Đô Đốc Bảo",
      "address": "44 Đô Đốc Bảo",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 9,
      "lat": 13.7653376,
      "lng": 109.2227637999999,
      "latitude": 13.7653376,
      "longitude": 109.2227637999999,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgha2320a8r16@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "salty"
      ]
    },
    {
      "id": 706582,
      "name": "Ding Tea - Trà Sữa Đài Loan",
      "restaurant": "Ding Tea - Trà Sữa Đài Loan",
      "address": "Trần Quý Cáp, An Phú Thịnh Plaza",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.9,
      "reviewCount": 9,
      "lat": 13.773216,
      "lng": 109.23324,
      "latitude": 13.773216,
      "longitude": 109.23324,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkuzyr504934@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 642975,
      "name": "Xóm Núi - Điểm Tâm & Coffee",
      "restaurant": "Xóm Núi - Điểm Tâm & Coffee",
      "address": "Xóm 5, Thôn Kì Sơn",
      "district": "Huyện Tuy Phước",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.0,
      "reviewCount": 7,
      "lat": 13.854279,
      "lng": 109.188306,
      "latitude": 13.854279,
      "longitude": 109.188306,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfzdzy859zvbe@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 234247,
      "name": "Haru - Japanese Dessert & Drinks",
      "restaurant": "Haru - Japanese Dessert & Drinks",
      "address": "226 Phan Bội Châu, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.1,
      "reviewCount": 8,
      "lat": 13.775921,
      "lng": 109.229349,
      "latitude": 13.775921,
      "longitude": 109.229349,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwcdo1pkr6qh8b@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 233858,
      "name": "Kem Ngọc Trâm",
      "restaurant": "Kem Ngọc Trâm",
      "address": "249 Tăng Bạt Hổ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.2,
      "reviewCount": 7,
      "lat": 13.772915,
      "lng": 109.226842,
      "latitude": 13.772915,
      "longitude": 109.226842,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe0touq3rvfa3@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 628975,
      "name": "Sunday Coffee",
      "restaurant": "Sunday Coffee",
      "address": "153 - 155 Hoa Lư",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.1,
      "reviewCount": 7,
      "lat": 13.78788,
      "lng": 109.215033,
      "latitude": 13.78788,
      "longitude": 109.215033,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfzdqd2g82h83@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 279727,
      "name": "Nhơn Cafe",
      "restaurant": "Nhơn Cafe",
      "address": "376 Hùng Vương",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.5,
      "reviewCount": 6,
      "lat": 13.789865,
      "lng": 109.193983,
      "latitude": 13.789865,
      "longitude": 109.193983,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaiopcaahnf64@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 236299,
      "name": "FA Cafe",
      "restaurant": "FA Cafe",
      "address": "30 Lê Duẩn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 6,
      "lat": 13.774497,
      "lng": 109.221233,
      "latitude": 13.774497,
      "longitude": 109.221233,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi8ymfbykexfd@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 686823,
      "name": "Thuỷ Mộc Cafe - Tây Sơn",
      "restaurant": "Thuỷ Mộc Cafe - Tây Sơn",
      "address": "209 Tây Sơn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.9,
      "reviewCount": 6,
      "lat": 13.760184,
      "lng": 109.204407,
      "latitude": 13.760184,
      "longitude": 109.204407,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6u4vao1cp1f@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 146816,
      "name": "Running Tea - Nguyễn Thị Định",
      "restaurant": "Running Tea - Nguyễn Thị Định",
      "address": "54A Nguyễn Thị Định",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.1,
      "reviewCount": 7,
      "lat": 13.757791,
      "lng": 109.2140707999999,
      "latitude": 13.757791,
      "longitude": 109.2140707999999,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9l5pxc6c49aa@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 283722,
      "name": "Milano Coffee - Ngô Mây",
      "restaurant": "Milano Coffee - Ngô Mây",
      "address": "36 Ngô Mây, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.0,
      "reviewCount": 7,
      "lat": 13.762289,
      "lng": 109.219043,
      "latitude": 13.762289,
      "longitude": 109.219043,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa2m5gxcwyhbe@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 663184,
      "name": "Mộc Cafe - Trần Anh Tông",
      "restaurant": "Mộc Cafe - Trần Anh Tông",
      "address": "96 Trần Anh Tông",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.1,
      "reviewCount": 6,
      "lat": 13.7527184767805,
      "lng": 109.2127654328942,
      "latitude": 13.7527184767805,
      "longitude": 109.2127654328942,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw7n694zsmahc2@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 628453,
      "name": "Den Coffee",
      "restaurant": "Den Coffee",
      "address": "884 Trần Hưng Đạo, P. Đống Đa",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 6,
      "lat": 13.7857,
      "lng": 109.210813,
      "latitude": 13.7857,
      "longitude": 109.210813,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdgptfygsm1b5@resize_ss640x400",
      "category": "boba",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 138063,
      "name": "Mộc Viên Restaurant - Món Việt",
      "restaurant": "Mộc Viên Restaurant - Món Việt",
      "address": "2 Lê Thanh Nghị",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.9,
      "reviewCount": 93,
      "lat": 13.7870653314854,
      "lng": 109.2202430598328,
      "latitude": 13.7870653314854,
      "longitude": 109.2202430598328,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweqawpp83q310@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 643816,
      "name": "S.Blue Restaurant & Bar",
      "restaurant": "S.Blue Restaurant & Bar",
      "address": "Quảng Trường Trung Tâm",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.6,
      "reviewCount": 88,
      "lat": 13.762282,
      "lng": 109.221771,
      "latitude": 13.762282,
      "longitude": 109.221771,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9m0kl2uyu390@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 209490,
      "name": "Nam Sushi - Ẩm Thực Nhật Bản",
      "restaurant": "Nam Sushi - Ẩm Thực Nhật Bản",
      "address": "334A Diên Hồng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 39,
      "lat": 13.767189,
      "lng": 109.220039,
      "latitude": 13.767189,
      "longitude": 109.220039,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh4ezu9g2qh24@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 176485,
      "name": "Nhà Hàng Bảo Nam - Eo Gió",
      "restaurant": "Nhà Hàng Bảo Nam - Eo Gió",
      "address": "Lý Hưng, Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.9,
      "reviewCount": 39,
      "lat": 13.885577,
      "lng": 109.287778,
      "latitude": 13.885577,
      "longitude": 109.287778,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgrfn0ylot5f0@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 35958,
      "name": "Gà Rán KFC - Quy Nhơn",
      "restaurant": "Gà Rán KFC - Quy Nhơn",
      "address": "7 Lê Duẩn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 25,
      "lat": 13.773079,
      "lng": 109.221887,
      "latitude": 13.773079,
      "longitude": 109.221887,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe15pzntxp540@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy",
        "hot_soup"
      ]
    },
    {
      "id": 252402,
      "name": "Riverside Restaurant",
      "restaurant": "Riverside Restaurant",
      "address": "1 Võ Nguyên Giáp",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.8,
      "reviewCount": 63,
      "lat": 13.7864479988112,
      "lng": 109.2201270908117,
      "latitude": 13.7864479988112,
      "longitude": 109.2201270908117,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8jaqa6t32xaf@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 16892,
      "name": "Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị",
      "restaurant": "Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị",
      "address": "489 An Dương Vương, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 22,
      "lat": 13.75671,
      "lng": 109.218632,
      "latitude": 13.75671,
      "longitude": 109.218632,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhhagbhvzkp72@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 719477,
      "name": "Sisters Tavern & Pizzeria",
      "restaurant": "Sisters Tavern & Pizzeria",
      "address": "81 Hai Bà Trưng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 38,
      "lat": 13.772134,
      "lng": 109.230897,
      "latitude": 13.772134,
      "longitude": 109.230897,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwg47a1nesih5e@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 282844,
      "name": "Salsa The Beach Club - FLC Quy Nhon",
      "restaurant": "Salsa The Beach Club - FLC Quy Nhon",
      "address": "Khu 4 Nhơn Lý, Xã Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.4,
      "reviewCount": 13,
      "lat": 13.882979,
      "lng": 109.281369,
      "latitude": 13.882979,
      "longitude": 109.281369,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbx1x6h089l52@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 927728,
      "name": "Bò Né Phạm Gia - Trường Chinh",
      "restaurant": "Bò Né Phạm Gia - Trường Chinh",
      "address": "10 Trường Chinh",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.4,
      "reviewCount": 19,
      "lat": 13.771927,
      "lng": 109.223972,
      "latitude": 13.771927,
      "longitude": 109.223972,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaktywxsmhnce@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 16889,
      "name": "Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến",
      "restaurant": "Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến",
      "address": "5 An Dương Vương, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 13,
      "lat": 13.7547,
      "lng": 109.217105,
      "latitude": 13.7547,
      "longitude": 109.217105,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh1os8fgfkrd3@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 44083,
      "name": "C.ine - Seafood Restaurant",
      "restaurant": "C.ine - Seafood Restaurant",
      "address": "92 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.2,
      "reviewCount": 14,
      "lat": 13.7688231,
      "lng": 109.2319883,
      "latitude": 13.7688231,
      "longitude": 109.2319883,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgoi3sg8vkrde@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 156947,
      "name": "Tàu Hoa Hoa - Seafood Restaurant",
      "restaurant": "Tàu Hoa Hoa - Seafood Restaurant",
      "address": "3/8 Phan Chu Trinh",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 18,
      "lat": 13.777911,
      "lng": 109.240818,
      "latitude": 13.777911,
      "longitude": 109.240818,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwcddelngt7d32@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 166551,
      "name": "H-P Pizza",
      "restaurant": "H-P Pizza",
      "address": "139B Phan Bội Châu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 14,
      "lat": 13.775025,
      "lng": 109.230796,
      "latitude": 13.775025,
      "longitude": 109.230796,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdabi35v00pf6@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 672262,
      "name": "Biển Đông - Hải Sản Tươi Sống",
      "restaurant": "Biển Đông - Hải Sản Tươi Sống",
      "address": "Hải Minh, Khu Vực 9, P. Hải Cảng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.8,
      "reviewCount": 13,
      "lat": 13.780942,
      "lng": 109.235535,
      "latitude": 13.780942,
      "longitude": 109.235535,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoy5oteva1e9@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 273444,
      "name": "Bình Hà Restaurant - Đặc Sản Biển",
      "restaurant": "Bình Hà Restaurant - Đặc Sản Biển",
      "address": "Lô 16 Bắc, Bình Hà",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 14,
      "lat": 13.781361,
      "lng": 109.232178,
      "latitude": 13.781361,
      "longitude": 109.232178,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbx1fex1jh725@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 210706,
      "name": "Cơm Niêu Hội An",
      "restaurant": "Cơm Niêu Hội An",
      "address": "Nguyễn Tất Thành (Nối Dài)",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 5.8,
      "reviewCount": 18,
      "lat": 13.778347,
      "lng": 109.222004,
      "latitude": 13.778347,
      "longitude": 109.222004,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8znp5uvs9ldb@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 946652,
      "name": "Leng Keng 2 - Vua Ghẹ Nhơn Lí",
      "restaurant": "Leng Keng 2 - Vua Ghẹ Nhơn Lí",
      "address": "Eo Gió Nhơn Lí",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 12,
      "lat": 13.883844,
      "lng": 109.291729,
      "latitude": 13.883844,
      "longitude": 109.291729,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdexg43ob8b49@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 624784,
      "name": "Nhơn Hải Beach Hotel & Restaurant",
      "restaurant": "Nhơn Hải Beach Hotel & Restaurant",
      "address": "Hòn Khô",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 16,
      "lat": 13.771899,
      "lng": 109.290904,
      "latitude": 13.771899,
      "longitude": 109.290904,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw7muymynqvv9d@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 1014062,
      "name": "Anya Hotel Quy Nhơn",
      "restaurant": "Anya Hotel Quy Nhơn",
      "address": "3 Nguyễn Trung Tín",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.3,
      "reviewCount": 11,
      "lat": 13.754635,
      "lng": 109.215253,
      "latitude": 13.754635,
      "longitude": 109.215253,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwehfh8jct7f1f@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 92512,
      "name": "Lotteria - Kim Cúc Plaza",
      "restaurant": "Lotteria - Kim Cúc Plaza",
      "address": "Tầng 1 Kim Cúc Plaza, Khu ĐôThị Vũng Chua , P. Ghềnh Ráng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 12,
      "lat": 13.7640731289099,
      "lng": 109.2228689789772,
      "latitude": 13.7640731289099,
      "longitude": 109.2228689789772,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9d5h0lokihb2@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 244128,
      "name": "Nhà Hàng Hải Sản Liên Thành",
      "restaurant": "Nhà Hàng Hải Sản Liên Thành",
      "address": "104 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 12,
      "lat": 13.771717,
      "lng": 109.241306,
      "latitude": 13.771717,
      "longitude": 109.241306,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwak9yfkrbh55f@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 313703,
      "name": "Cây Cau - Hải Sản Tươi Sống",
      "restaurant": "Cây Cau - Hải Sản Tươi Sống",
      "address": "KDL Eo Gió, Xã Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 10,
      "lat": 13.883813,
      "lng": 109.290506,
      "latitude": 13.883813,
      "longitude": 109.290506,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8oylkwk0yj01@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 44084,
      "name": "Nhà Hàng 114 - Lẩu & Hải Sản - Xuân Diệu",
      "restaurant": "Nhà Hàng 114 - Lẩu & Hải Sản - Xuân Diệu",
      "address": "114 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.1,
      "reviewCount": 12,
      "lat": 13.771602,
      "lng": 109.24014,
      "latitude": 13.771602,
      "longitude": 109.24014,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw7m9h42maqj03@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 1026522,
      "name": "Gạch Restaurant - Ẩm Thực Việt",
      "restaurant": "Gạch Restaurant - Ẩm Thực Việt",
      "address": "52 Trần Phú",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.8,
      "reviewCount": 9,
      "lat": 13.773604531513,
      "lng": 109.2259983776932,
      "latitude": 13.773604531513,
      "longitude": 109.2259983776932,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa172z3t97d43@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 265967,
      "name": "Lee Nieu - Nhà Hàng Cơm Niêu",
      "restaurant": "Lee Nieu - Nhà Hàng Cơm Niêu",
      "address": "63 Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 7,
      "lat": 13.77015,
      "lng": 109.229132,
      "latitude": 13.77015,
      "longitude": 109.229132,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf04yross7vdc@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 233533,
      "name": "Hải Sản Hoàng Mi",
      "restaurant": "Hải Sản Hoàng Mi",
      "address": "Thôn Lý Hưng, Xã Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 5.7,
      "reviewCount": 10,
      "lat": 13.8831176398908,
      "lng": 109.2899268865585,
      "latitude": 13.8831176398908,
      "longitude": 109.2899268865585,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwav4h1h29jv8d@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 632910,
      "name": "Quy Nhơn Palace - Wedding & Covention",
      "restaurant": "Quy Nhơn Palace - Wedding & Covention",
      "address": "10 Đô Đốc Bảo",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.1,
      "reviewCount": 4,
      "lat": 13.766356,
      "lng": 109.2228096,
      "latitude": 13.766356,
      "longitude": 109.2228096,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw97wa9k8hjt07@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 17565,
      "name": "Nem Chả Năm Thu",
      "restaurant": "Nem Chả Năm Thu",
      "address": "73B Trần Phú, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.6,
      "reviewCount": 9,
      "lat": 13.7745867,
      "lng": 109.22573,
      "latitude": 13.7745867,
      "longitude": 109.22573,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwev1qm3h2op4e@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 138065,
      "name": "Hoàng Hậu Restaurant - KDL Ghềnh Ráng",
      "restaurant": "Hoàng Hậu Restaurant - KDL Ghềnh Ráng",
      "address": "KDL Ghềnh Ráng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 7,
      "lat": 13.74286,
      "lng": 109.215186,
      "latitude": 13.74286,
      "longitude": 109.215186,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweuvr7ioycb06@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy",
        "hot_soup"
      ]
    },
    {
      "id": 44970,
      "name": "Hải Nam - Nhà Hàng Hải Sản",
      "restaurant": "Hải Nam - Nhà Hàng Hải Sản",
      "address": "2 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 4.8,
      "reviewCount": 12,
      "lat": 13.761441,
      "lng": 109.222803,
      "latitude": 13.761441,
      "longitude": 109.222803,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfbpuocjly336@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 683993,
      "name": "LUX Beer Garden",
      "restaurant": "LUX Beer Garden",
      "address": "64 Bình Hà, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.4,
      "reviewCount": 6,
      "lat": 13.781201,
      "lng": 109.23232,
      "latitude": 13.781201,
      "longitude": 109.23232,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhl2g3zc1jva3@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 217974,
      "name": "Vườn Phố Quán - Hải Sản Tươi Sống",
      "restaurant": "Vườn Phố Quán - Hải Sản Tươi Sống",
      "address": "82 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.3,
      "reviewCount": 6,
      "lat": 13.771857,
      "lng": 109.245116,
      "latitude": 13.771857,
      "longitude": 109.245116,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfv8gi03h7fa1@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 229815,
      "name": "Phố Biển Restaurant - Beer & Nướng",
      "restaurant": "Phố Biển Restaurant - Beer & Nướng",
      "address": "54 An Dương Vương",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.8,
      "reviewCount": 6,
      "lat": 13.752269,
      "lng": 109.215658,
      "latitude": 13.752269,
      "longitude": 109.215658,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9je77amw2j1a@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 653664,
      "name": "Hàn Quốc Restaurant",
      "restaurant": "Hàn Quốc Restaurant",
      "address": "49 Hoàng Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 7,
      "lat": 13.769283,
      "lng": 109.22351,
      "latitude": 13.769283,
      "longitude": 109.22351,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwet6gbq76cb49@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 625289,
      "name": "Athena - Restaurant & Cafe",
      "restaurant": "Athena - Restaurant & Cafe",
      "address": "43 Nguyễn Trung Trực",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.6,
      "reviewCount": 5,
      "lat": 13.759011,
      "lng": 109.214386,
      "latitude": 13.759011,
      "longitude": 109.214386,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh2izc8j3yx72@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "hot_soup"
      ]
    },
    {
      "id": 935478,
      "name": "Nhà Hàng Hải Sản Hương Biển - FLC Quy Nhơn",
      "restaurant": "Nhà Hàng Hải Sản Hương Biển - FLC Quy Nhơn",
      "address": "FLC Quy Nhơn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.5,
      "reviewCount": 5,
      "lat": 13.885554,
      "lng": 109.280809,
      "latitude": 13.885554,
      "longitude": 109.280809,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgagcakpo0r00@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 210969,
      "name": "Hai Đẹp 2 - Đặc Sản Biển Tươi Sống",
      "restaurant": "Hai Đẹp 2 - Đặc Sản Biển Tươi Sống",
      "address": "Lê Đức Thọ, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 4.2,
      "reviewCount": 9,
      "lat": 13.7786825543755,
      "lng": 109.2329255864024,
      "latitude": 13.7786825543755,
      "longitude": 109.2329255864024,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf93a84l2ahf1@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 134657,
      "name": "Cơm Chay Tâm Thiện",
      "restaurant": "Cơm Chay Tâm Thiện",
      "address": "114 Tăng Bạt Hổ, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.1,
      "reviewCount": 6,
      "lat": 13.7732484,
      "lng": 109.2299044,
      "latitude": 13.7732484,
      "longitude": 109.2299044,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdt19h742qj7a@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "light"
      ]
    },
    {
      "id": 944309,
      "name": "Charm Spa & Restaurant",
      "restaurant": "Charm Spa & Restaurant",
      "address": "1 - 02 Trịnh Công Sơn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.4,
      "reviewCount": 4,
      "lat": 13.748953,
      "lng": 109.214259,
      "latitude": 13.748953,
      "longitude": 109.214259,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw96qnf1m8kb94@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 16614,
      "name": "Trầu Cau - Nhà Hàng Tiệc Cưới",
      "restaurant": "Trầu Cau - Nhà Hàng Tiệc Cưới",
      "address": "58 Mai Xuân Thưởng, P. Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 4,
      "lat": 13.7757777,
      "lng": 109.226475,
      "latitude": 13.7757777,
      "longitude": 109.226475,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9g6ja9y2fvfd@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 875236,
      "name": "Sushi Haru - Quy Nhơn",
      "restaurant": "Sushi Haru - Quy Nhơn",
      "address": "150 Ỷ Lan",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.3,
      "reviewCount": 4,
      "lat": 13.782131,
      "lng": 109.227693,
      "latitude": 13.782131,
      "longitude": 109.227693,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb8xfj8hq6xbf@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 767023,
      "name": "Bếp Nhà - Ẩm Thực 3 Miền",
      "restaurant": "Bếp Nhà - Ẩm Thực 3 Miền",
      "address": "68 Nam Cao, Khu Vực 3",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.5,
      "reviewCount": 4,
      "lat": 13.741807,
      "lng": 109.208651,
      "latitude": 13.741807,
      "longitude": 109.208651,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa78yt79p7d6d@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 713341,
      "name": "Square Restaurant - Hải Sản Tươi Sống",
      "restaurant": "Square Restaurant - Hải Sản Tươi Sống",
      "address": "12 Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 4,
      "lat": 13.761544,
      "lng": 109.220095,
      "latitude": 13.761544,
      "longitude": 109.220095,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbpvwhhynrv98@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 112532,
      "name": "Hải Sản Hương Việt",
      "restaurant": "Hải Sản Hương Việt",
      "address": "122 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.7,
      "reviewCount": 3,
      "lat": 13.769312,
      "lng": 109.234051,
      "latitude": 13.769312,
      "longitude": 109.234051,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaqdxqv6dw921@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 792299,
      "name": "Xì Phố Kitchen - Ẩm Thực Châu Á",
      "restaurant": "Xì Phố Kitchen - Ẩm Thực Châu Á",
      "address": "Lô 5, Lê Lợi Nối Dài, P. Hải Cảng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.2,
      "reviewCount": 4,
      "lat": 13.779446,
      "lng": 109.234485,
      "latitude": 13.779446,
      "longitude": 109.234485,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi9u6c1m7rv79@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 685303,
      "name": "Cơm Gà Tuyết Nhung - Nguyễn Thái Học",
      "restaurant": "Cơm Gà Tuyết Nhung - Nguyễn Thái Học",
      "address": "320A Nguyễn Thái Học",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 5.9,
      "reviewCount": 5,
      "lat": 13.767073,
      "lng": 109.216204,
      "latitude": 13.767073,
      "longitude": 109.216204,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu14oy61byc4a@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 940951,
      "name": "Mộc Việt Restaurant",
      "restaurant": "Mộc Việt Restaurant",
      "address": "30 Chương Dương",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 4,
      "lat": 13.752819,
      "lng": 109.214011,
      "latitude": 13.752819,
      "longitude": 109.214011,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdb83jeqh2191@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 879210,
      "name": "Vua Nướng - Lý Thái Tổ",
      "restaurant": "Vua Nướng - Lý Thái Tổ",
      "address": "Lô 10 Lý Thái Tổ Nối Dài",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 5.3,
      "reviewCount": 6,
      "lat": 13.755631,
      "lng": 109.213608,
      "latitude": 13.755631,
      "longitude": 109.213608,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw98rdiecsm31e@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 1048903,
      "name": "Bò Tăng Gô",
      "restaurant": "Bò Tăng Gô",
      "address": "187 Lê Lợi, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.1,
      "reviewCount": 3,
      "lat": 13.777482,
      "lng": 109.232631,
      "latitude": 13.777482,
      "longitude": 109.232631,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8l1wtkaod73c@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 647716,
      "name": "Cây Dừa Kitchen - Hải Sản Tươi Sống",
      "restaurant": "Cây Dừa Kitchen - Hải Sản Tươi Sống",
      "address": "124 Phan Chu Trinh",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 4.8,
      "reviewCount": 5,
      "lat": 13.771795,
      "lng": 109.237407,
      "latitude": 13.771795,
      "longitude": 109.237407,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9mqyyo3izdb0@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 650047,
      "name": "San Fernando Restaurant - Hải Sản Tươi Sống",
      "restaurant": "San Fernando Restaurant - Hải Sản Tươi Sống",
      "address": "Thôn Lý Hưng, Xã Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 3,
      "lat": 13.885805,
      "lng": 109.286471,
      "latitude": 13.885805,
      "longitude": 109.286471,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwce1uyh3e1l62@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 269516,
      "name": "Nhà Hàng Nhà Sàn",
      "restaurant": "Nhà Hàng Nhà Sàn",
      "address": "Đường Số 1, Lô 5 - 6 Bắc sông Hà Thanh",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.1,
      "reviewCount": 3,
      "lat": 13.78747,
      "lng": 109.217847,
      "latitude": 13.78747,
      "longitude": 109.217847,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9lqlzhmlehcb@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 768648,
      "name": "Song Anh - Trung Tâm Tổ Chức Hội Nghị & Tiệc Cưới",
      "restaurant": "Song Anh - Trung Tâm Tổ Chức Hội Nghị & Tiệc Cưới",
      "address": "115 - 119 Tây Sơn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.0,
      "reviewCount": 2,
      "lat": 13.752309,
      "lng": 109.210141,
      "latitude": 13.752309,
      "longitude": 109.210141,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwckl9ofd6u1db@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 664900,
      "name": "Phụng Nga - Seafood Restaurant",
      "restaurant": "Phụng Nga - Seafood Restaurant",
      "address": "108 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 2,
      "lat": 13.771635,
      "lng": 109.240251,
      "latitude": 13.771635,
      "longitude": 109.240251,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8enlcbskpl18@resize_ss640x400",
      "category": "noodles",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 272138,
      "name": "Gà Chỉ Sáu Cao",
      "restaurant": "Gà Chỉ Sáu Cao",
      "address": "Phạm Thị Đào, Khu Vực 3",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.6,
      "reviewCount": 272,
      "lat": 13.743667,
      "lng": 109.209027,
      "latitude": 13.743667,
      "longitude": 109.209027,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbfec2kqjtlfc@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "heavy"
      ]
    },
    {
      "id": 229781,
      "name": "Cháo Ếch Singapore - Hai Bà Trưng",
      "restaurant": "Cháo Ếch Singapore - Hai Bà Trưng",
      "address": "65 Hai Bà Trưng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.8,
      "reviewCount": 118,
      "lat": 13.77204,
      "lng": 109.23189,
      "latitude": 13.77204,
      "longitude": 109.23189,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwghndz3qvob10@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 162958,
      "name": "Hướng Dương Quán - Hải Sản Tươi Sống",
      "restaurant": "Hướng Dương Quán - Hải Sản Tươi Sống",
      "address": "Trục Đường Chính Khu Du Lịch Eo Gió, Xã Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.1,
      "reviewCount": 58,
      "lat": 13.884931,
      "lng": 109.291551,
      "latitude": 13.884931,
      "longitude": 109.291551,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe0ftvnv2l790@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 690448,
      "name": "Bánh Hỏi Cháo Lòng Hồng Thanh",
      "restaurant": "Bánh Hỏi Cháo Lòng Hồng Thanh",
      "address": "22 Phan Bội Châu, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 36,
      "lat": 13.7738932,
      "lng": 109.2358765,
      "latitude": 13.7738932,
      "longitude": 109.2358765,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu19s93tzno9f@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 287448,
      "name": "Hoàng Thao - Nhà Hàng Hải Sản",
      "restaurant": "Hoàng Thao - Nhà Hàng Hải Sản",
      "address": "Eo Gió, Xã Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.3,
      "reviewCount": 28,
      "lat": 13.8851164085068,
      "lng": 109.2914950148193,
      "latitude": 13.8851164085068,
      "longitude": 109.2914950148193,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwck08pt35y3be@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 43996,
      "name": "Quán Thuỳ - Bún Rạm & Bún Chả Cá - Tăng Bạt Hổ",
      "restaurant": "Quán Thuỳ - Bún Rạm & Bún Chả Cá - Tăng Bạt Hổ",
      "address": "261 Tăng Bạt Hổ, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 34,
      "lat": 13.7722456,
      "lng": 109.2253797,
      "latitude": 13.7722456,
      "longitude": 109.2253797,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstrle4joe5502@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 30399,
      "name": "Bánh Xèo Anh Vũ",
      "restaurant": "Bánh Xèo Anh Vũ",
      "address": "14 Diên Hồng, P. Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 5.7,
      "reviewCount": 36,
      "lat": 13.773073,
      "lng": 109.220795,
      "latitude": 13.773073,
      "longitude": 109.220795,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi94fqpkmvv6f@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 780567,
      "name": "Ốc Hảo Hảo",
      "restaurant": "Ốc Hảo Hảo",
      "address": "18 Ngọc Hân Công Chúa",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.3,
      "reviewCount": 26,
      "lat": 13.7675365,
      "lng": 109.2287291999999,
      "latitude": 13.7675365,
      "longitude": 109.2287291999999,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf0hgaj0kbf50@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 234315,
      "name": "Mỹ Hạnh - Bún Tôm Rạm",
      "restaurant": "Mỹ Hạnh - Bún Tôm Rạm",
      "address": "32 Ngô Đức Đệ, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.4,
      "reviewCount": 25,
      "lat": 13.7569079,
      "lng": 109.2117565999999,
      "latitude": 13.7569079,
      "longitude": 109.2117565999999,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9jenxo168r3b@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 44096,
      "name": "Hải Sỹ - Hải Sản Tươi Sống",
      "restaurant": "Hải Sỹ - Hải Sản Tươi Sống",
      "address": "35B Nguyễn Huệ, P. Hải Cảng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.9,
      "reviewCount": 24,
      "lat": 13.77205,
      "lng": 109.239333,
      "latitude": 13.77205,
      "longitude": 109.239333,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhxl7bsx8m37c@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 310871,
      "name": "Cơm Nhà 1989",
      "restaurant": "Cơm Nhà 1989",
      "address": "43 Mai Xuân Thưởng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.5,
      "reviewCount": 22,
      "lat": 13.775643,
      "lng": 109.225928,
      "latitude": 13.775643,
      "longitude": 109.225928,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfemoj5yokb29@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 253605,
      "name": "Ông Hùng - Bánh Xèo Tôm Nhảy",
      "restaurant": "Ông Hùng - Bánh Xèo Tôm Nhảy",
      "address": "24 Diên Hồng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 21,
      "lat": 13.7681019,
      "lng": 109.2205423,
      "latitude": 13.7681019,
      "longitude": 109.2205423,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8xyvcxe863de@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 131616,
      "name": "Quán Vườn Sáu Cao - Khu Bông Hồng",
      "restaurant": "Quán Vườn Sáu Cao - Khu Bông Hồng",
      "address": "Khu Bông Hồng, Ghềnh Ráng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 20,
      "lat": 13.7437583110094,
      "lng": 109.2089560255408,
      "latitude": 13.7437583110094,
      "longitude": 109.2089560255408,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9l01mb5ivv69@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 668515,
      "name": "Cơm Mậu",
      "restaurant": "Cơm Mậu",
      "address": "177 - 179 Phan Bội Châu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.5,
      "reviewCount": 21,
      "lat": 13.775904,
      "lng": 109.229119,
      "latitude": 13.775904,
      "longitude": 109.229119,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9jtmm7qj8931@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 84354,
      "name": "Nem Chả Lợi - Nem Nướng Quy Nhơn",
      "restaurant": "Nem Chả Lợi - Nem Nướng Quy Nhơn",
      "address": "113 Tăng Bạt Hổ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 25,
      "lat": 13.773186,
      "lng": 109.230414,
      "latitude": 13.773186,
      "longitude": 109.230414,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lu7nt2pmrs4173@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 253664,
      "name": "Mì Cay Naga Quy Nhơn",
      "restaurant": "Mì Cay Naga Quy Nhơn",
      "address": "51 Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.6,
      "reviewCount": 23,
      "lat": 13.771024,
      "lng": 109.22892,
      "latitude": 13.771024,
      "longitude": 109.22892,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwesx7w4ob899d@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "spicy"
      ]
    },
    {
      "id": 17469,
      "name": "Bún Chả Cá Phượng Tèo",
      "restaurant": "Bún Chả Cá Phượng Tèo",
      "address": "209 - 211 Nguyễn Huệ, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.1,
      "reviewCount": 20,
      "lat": 13.7679855,
      "lng": 109.2281973,
      "latitude": 13.7679855,
      "longitude": 109.2281973,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstqj9icc3ic7e@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 44504,
      "name": "Cô Năm - Bánh Hỏi Lòng Heo",
      "restaurant": "Cô Năm - Bánh Hỏi Lòng Heo",
      "address": "41 Nguyễn Chánh",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 19,
      "lat": 13.7830887,
      "lng": 109.223902,
      "latitude": 13.7830887,
      "longitude": 109.223902,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8t4vebxz2x8e@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 727343,
      "name": "Bún Bò Hẻm",
      "restaurant": "Bún Bò Hẻm",
      "address": "158 Diên Hồng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.0,
      "reviewCount": 16,
      "lat": 13.76864,
      "lng": 109.220489,
      "latitude": 13.76864,
      "longitude": 109.220489,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbvw3eikesb32@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 663199,
      "name": "Phá Lấu Ông Hiệu",
      "restaurant": "Phá Lấu Ông Hiệu",
      "address": "172 Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.3,
      "reviewCount": 16,
      "lat": 13.775779,
      "lng": 109.231684,
      "latitude": 13.775779,
      "longitude": 109.231684,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi9d8jvzy6x34@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 763622,
      "name": "Món Quê - Bánh Xèo Tôm Nhảy",
      "restaurant": "Món Quê - Bánh Xèo Tôm Nhảy",
      "address": "Eo Gió, Xã Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.8,
      "reviewCount": 14,
      "lat": 13.883335,
      "lng": 109.291479,
      "latitude": 13.883335,
      "longitude": 109.291479,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa3dl9lu5zt08@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy",
        "salty"
      ]
    },
    {
      "id": 44497,
      "name": "Bánh Mì Lagu - Nguyễn Huệ",
      "restaurant": "Bánh Mì Lagu - Nguyễn Huệ",
      "address": "Hẻm 171 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.0,
      "reviewCount": 17,
      "lat": 13.7683110764927,
      "lng": 109.2292375490069,
      "latitude": 13.7683110764927,
      "longitude": 109.2292375490069,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi3iighaggp23@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 210507,
      "name": "Quán Oshi - Lẩu & Nướng",
      "restaurant": "Quán Oshi - Lẩu & Nướng",
      "address": "105D Hai Bà Trưng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 13,
      "lat": 13.77178,
      "lng": 109.229285,
      "latitude": 13.77178,
      "longitude": 109.229285,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw91icz51oexea@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 760911,
      "name": "Bánh Canh Hẹ & Bún Mắt Cá - 169A Lê Lợi",
      "restaurant": "Bánh Canh Hẹ & Bún Mắt Cá - 169A Lê Lợi",
      "address": "169A Lê Lợi, P. Hải Cảng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.4,
      "reviewCount": 15,
      "lat": 13.776293,
      "lng": 109.232385,
      "latitude": 13.776293,
      "longitude": 109.232385,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu48eu2hrq1f5@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 646519,
      "name": "Cơm Tấm 173",
      "restaurant": "Cơm Tấm 173",
      "address": "173 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 12,
      "lat": 13.768477,
      "lng": 109.229078,
      "latitude": 13.768477,
      "longitude": 109.229078,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstzjoafus3o3d@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "heavy"
      ]
    },
    {
      "id": 684623,
      "name": "Nyna Nyna - Nướng & Lẩu",
      "restaurant": "Nyna Nyna - Nướng & Lẩu",
      "address": "2/5 Phạm Ngọc Thạch",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 12,
      "lat": 13.768337,
      "lng": 109.224601,
      "latitude": 13.768337,
      "longitude": 109.224601,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6u21qsn2z1e@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 44112,
      "name": "Hải Sản Cây Dừa",
      "restaurant": "Hải Sản Cây Dừa",
      "address": "33A Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.1,
      "reviewCount": 13,
      "lat": 13.7726346,
      "lng": 109.242097,
      "latitude": 13.7726346,
      "longitude": 109.242097,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9cd5lhfvff34@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 254843,
      "name": "Bánh Bèo Bà Xê",
      "restaurant": "Bánh Bèo Bà Xê",
      "address": "Trần Nguyên Đán",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 13,
      "lat": 13.770276,
      "lng": 109.225317,
      "latitude": 13.770276,
      "longitude": 109.225317,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbupbwdelspc4@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "light"
      ]
    },
    {
      "id": 232550,
      "name": "Bún Đậu Mắm Tôm Bình Dân",
      "restaurant": "Bún Đậu Mắm Tôm Bình Dân",
      "address": "200 Diên Hồng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.8,
      "reviewCount": 14,
      "lat": 13.767757,
      "lng": 109.220476,
      "latitude": 13.767757,
      "longitude": 109.220476,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwd1x7frc9nd52@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 154287,
      "name": "Bánh Canh Cua O Huệ",
      "restaurant": "Bánh Canh Cua O Huệ",
      "address": "30 Trường Chinh",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 11,
      "lat": 13.7717365,
      "lng": 109.2233925,
      "latitude": 13.7717365,
      "longitude": 109.2233925,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgwsuk5xyopc0@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 236289,
      "name": "Hải Sản 7 Thơm",
      "restaurant": "Hải Sản 7 Thơm",
      "address": "Lô 5 Hồ Biểu Chánh, P. Đống Đa",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.0,
      "reviewCount": 11,
      "lat": 13.790114,
      "lng": 109.216149,
      "latitude": 13.790114,
      "longitude": 109.216149,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh21vcg2wux0c@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 280616,
      "name": "Huệ Loan - Quán Đặc Sản Biển",
      "restaurant": "Huệ Loan - Quán Đặc Sản Biển",
      "address": "Thị Nại, Xã Phước Sơn",
      "district": "Huyện Tuy Phước",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 12,
      "lat": 13.8603432,
      "lng": 109.2252116,
      "latitude": 13.8603432,
      "longitude": 109.2252116,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9lrd5a5jvfcb@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 130325,
      "name": "Quán Nướng Happy - Nguyễn Lữ",
      "restaurant": "Quán Nướng Happy - Nguyễn Lữ",
      "address": "219 Nguyễn Lữ, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.2,
      "reviewCount": 10,
      "lat": 13.7656027,
      "lng": 109.219049,
      "latitude": 13.7656027,
      "longitude": 109.219049,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsttpg310a6x45@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 188088,
      "name": "Hải Sản Mộng Mơ",
      "restaurant": "Hải Sản Mộng Mơ",
      "address": "Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 4.1,
      "reviewCount": 21,
      "lat": 13.7690907,
      "lng": 109.2330210999999,
      "latitude": 13.7690907,
      "longitude": 109.2330210999999,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgzg9vmuk0p62@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 257748,
      "name": "Cháo & Gỏi Bò Bà Lan",
      "restaurant": "Cháo & Gỏi Bò Bà Lan",
      "address": "28 Trần Bình Trọng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 10,
      "lat": 13.773486,
      "lng": 109.236504,
      "latitude": 13.773486,
      "longitude": 109.236504,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwcjxv40eeor93@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 17528,
      "name": "Xôi Thơm",
      "restaurant": "Xôi Thơm",
      "address": "155/8 Nguyễn Thái Học",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.3,
      "reviewCount": 11,
      "lat": 13.771517,
      "lng": 109.218908,
      "latitude": 13.771517,
      "longitude": 109.218908,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwak10xenm57de@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 116093,
      "name": "Phở Anh Vũ",
      "restaurant": "Phở Anh Vũ",
      "address": "25A Nguyễn Thái Học",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 11,
      "lat": 13.7737307,
      "lng": 109.220404,
      "latitude": 13.7737307,
      "longitude": 109.220404,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhizdr3y31580@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 138068,
      "name": "Cô Mười - Bún Khô & Nem Chả",
      "restaurant": "Cô Mười - Bún Khô & Nem Chả",
      "address": "157 Nguyễn Huệ, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 9,
      "lat": 13.7685445901359,
      "lng": 109.2296450727997,
      "latitude": 13.7685445901359,
      "longitude": 109.2296450727997,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf2c3a4ci5559@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 46540,
      "name": "Hải Sản Chín Mẫn",
      "restaurant": "Hải Sản Chín Mẫn",
      "address": "6 Xuân Diệu, P. Hải Cảng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.0,
      "reviewCount": 9,
      "lat": 13.771968,
      "lng": 109.243835,
      "latitude": 13.771968,
      "longitude": 109.243835,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbmkfxl81jt81@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 719336,
      "name": "Lẩu Băng Chuyền Satisfy",
      "restaurant": "Lẩu Băng Chuyền Satisfy",
      "address": "Lô D3 Lý Thái Tổ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 11,
      "lat": 13.756384,
      "lng": 109.212859,
      "latitude": 13.756384,
      "longitude": 109.212859,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb89uft1gbf04@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 660663,
      "name": "Tư Ù - Bánh Canh & Bánh Cuốn",
      "restaurant": "Tư Ù - Bánh Canh & Bánh Cuốn",
      "address": "16 Ngọc Hân Công Chúa",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 8,
      "lat": 13.767544,
      "lng": 109.228824,
      "latitude": 13.767544,
      "longitude": 109.228824,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwer0wptdp7f89@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 885039,
      "name": "Bếp Hana - Hàu Né - Bò Né - Cháo Hàu & Bít Tết",
      "restaurant": "Bếp Hana - Hàu Né - Bò Né - Cháo Hàu & Bít Tết",
      "address": "59A Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.7,
      "reviewCount": 7,
      "lat": 13.77605,
      "lng": 109.224654,
      "latitude": 13.77605,
      "longitude": 109.224654,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbjms4jmti3f3@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 77392,
      "name": "Bánh Hỏi Lòng Heo Hồng Linh",
      "restaurant": "Bánh Hỏi Lòng Heo Hồng Linh",
      "address": "246 Lạc Long Quân, P. Trần Quang Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 8,
      "lat": 13.7892691278638,
      "lng": 109.1478100419044,
      "latitude": 13.7892691278638,
      "longitude": 109.1478100419044,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhhzzc2whjt88@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 44500,
      "name": "Quán Mẫn - Bánh Hỏi Lòng Heo",
      "restaurant": "Quán Mẫn - Bánh Hỏi Lòng Heo",
      "address": "76A Trần Phú",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 8,
      "lat": 13.774353,
      "lng": 109.225929,
      "latitude": 13.774353,
      "longitude": 109.225929,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8efsridwbd59@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 133004,
      "name": "Bún Cá Thuận Hồng - Nguyễn Huệ",
      "restaurant": "Bún Cá Thuận Hồng - Nguyễn Huệ",
      "address": "415 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.1,
      "reviewCount": 7,
      "lat": 13.7640835,
      "lng": 109.2231506,
      "latitude": 13.7640835,
      "longitude": 109.2231506,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8s64bqupjtfe@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 33975,
      "name": "Bánh Xèo Bà Năm",
      "restaurant": "Bánh Xèo Bà Năm",
      "address": "Đầu cầu Mỹ Cang, Xã Phước Sơn",
      "district": "Huyện Tuy Phước",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 7,
      "lat": 13.868803,
      "lng": 109.217737,
      "latitude": 13.868803,
      "longitude": 109.217737,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfz6w92aimx9f@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 45280,
      "name": "Nghĩa Ghẹ - Đặc Sản Biển",
      "restaurant": "Nghĩa Ghẹ - Đặc Sản Biển",
      "address": "19 Võ Đình Tú, P. Thị Nại",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.7,
      "reviewCount": 7,
      "lat": 13.7803523,
      "lng": 109.227868,
      "latitude": 13.7803523,
      "longitude": 109.227868,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgedh2rvil5f0@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 227595,
      "name": "Oscar Quán - Lẩu & Buffet Nướng - Nguyễn Du",
      "restaurant": "Oscar Quán - Lẩu & Buffet Nướng - Nguyễn Du",
      "address": "83 Nguyễn Du",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.1,
      "reviewCount": 7,
      "lat": 13.7725219,
      "lng": 109.233874,
      "latitude": 13.7725219,
      "longitude": 109.233874,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhuz9ykzl5nbf@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "heavy",
        "hot_soup"
      ]
    },
    {
      "id": 231340,
      "name": "Mì Cay Korea",
      "restaurant": "Mì Cay Korea",
      "address": "58 Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.3,
      "reviewCount": 8,
      "lat": 13.770065,
      "lng": 109.229248,
      "latitude": 13.770065,
      "longitude": 109.229248,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbm2kg2yrq1f1@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "spicy"
      ]
    },
    {
      "id": 682940,
      "name": "Bánh Hỏi Lòng Heo",
      "restaurant": "Bánh Hỏi Lòng Heo",
      "address": "145 Diên Hồng",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 5.3,
      "reviewCount": 11,
      "lat": 13.765457,
      "lng": 109.220047,
      "latitude": 13.765457,
      "longitude": 109.220047,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbmw96ox0pn9f@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 978649,
      "name": "Natafood - Cơm Văn Phòng",
      "restaurant": "Natafood - Cơm Văn Phòng",
      "address": "393A Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.1,
      "reviewCount": 7,
      "lat": 13.764807,
      "lng": 109.224066,
      "latitude": 13.764807,
      "longitude": 109.224066,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwczktvoh7895d@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 239041,
      "name": "Tuấn Tú - Hải Sản Bình Dân",
      "restaurant": "Tuấn Tú - Hải Sản Bình Dân",
      "address": "160 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 7,
      "lat": 13.768756,
      "lng": 109.231523,
      "latitude": 13.768756,
      "longitude": 109.231523,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbp5vjsz6c9fe@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 931484,
      "name": "Ẩm Thực Đậu - Bún Đậu Mắm Tôm - 24 Nguyễn Lữ",
      "restaurant": "Ẩm Thực Đậu - Bún Đậu Mắm Tôm - 24 Nguyễn Lữ",
      "address": "24 Nguyễn Lữ, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.1,
      "reviewCount": 6,
      "lat": 13.7639012,
      "lng": 109.2179268,
      "latitude": 13.7639012,
      "longitude": 109.2179268,
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu7wliqqf2cee@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup",
        "salty"
      ]
    },
    {
      "id": 189131,
      "name": "Quán Nướng 35K",
      "restaurant": "Quán Nướng 35K",
      "address": "88 Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 6,
      "lat": 13.772215,
      "lng": 109.231721,
      "latitude": 13.772215,
      "longitude": 109.231721,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaovjwi8s0r67@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 707969,
      "name": "Đặc Sản Vịt - Vịt Nướng Chao & Cháo Vịt",
      "restaurant": "Đặc Sản Vịt - Vịt Nướng Chao & Cháo Vịt",
      "address": "36 Nguyễn Thị Minh Khai",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.5,
      "reviewCount": 7,
      "lat": 13.769704,
      "lng": 109.218861,
      "latitude": 13.769704,
      "longitude": 109.218861,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf9r2ifh3a3b7@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 685556,
      "name": "Quán Gà Ò Ó O",
      "restaurant": "Quán Gà Ò Ó O",
      "address": "26 Phạm Hồng Thái",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.4,
      "reviewCount": 6,
      "lat": 13.780865,
      "lng": 109.22501,
      "latitude": 13.780865,
      "longitude": 109.22501,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdlurzwsh5nc3@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "crunchy"
      ]
    },
    {
      "id": 17564,
      "name": "Phở Hải Phòng",
      "restaurant": "Phở Hải Phòng",
      "address": "53 - 55 Trần Phú, P. Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 7,
      "lat": 13.7737562,
      "lng": 109.226103,
      "latitude": 13.7737562,
      "longitude": 109.226103,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwesimuf0ogpe2@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 241143,
      "name": "Bánh Canh Bột Lọc",
      "restaurant": "Bánh Canh Bột Lọc",
      "address": "Ngã 4 Hai Bà Trưng - 31 Tháng 3, P. Lê Lợi",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.9,
      "reviewCount": 6,
      "lat": 13.772091,
      "lng": 109.233771,
      "latitude": 13.772091,
      "longitude": 109.233771,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbuo1bxjvfdd6@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "hot_soup"
      ]
    },
    {
      "id": 131951,
      "name": "Surf Bar - Quy Nhơn Beach",
      "restaurant": "Surf Bar - Quy Nhơn Beach",
      "address": "Bờ Biển Quy Nhơn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.1,
      "reviewCount": 66,
      "lat": 13.7679391926649,
      "lng": 109.2321896553039,
      "latitude": 13.7679391926649,
      "longitude": 109.2321896553039,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwda5e55rg0pcf@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 766178,
      "name": "Come Together Bar",
      "restaurant": "Come Together Bar",
      "address": "65 Chương Dương, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 9.0,
      "reviewCount": 8,
      "lat": 13.752869,
      "lng": 109.213361,
      "latitude": 13.752869,
      "longitude": 109.213361,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgaavh8t0bdf3@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 227892,
      "name": "Top Pub",
      "restaurant": "Top Pub",
      "address": "14 An Dương Vương",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 5,
      "lat": 13.755919,
      "lng": 109.217559,
      "latitude": 13.755919,
      "longitude": 109.217559,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhhgx7d1syja4@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 109336,
      "name": "Panorama Bar - Rooftop Bar",
      "restaurant": "Panorama Bar - Rooftop Bar",
      "address": "489 An Dương Vương, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 4,
      "lat": 13.7575244,
      "lng": 109.218762,
      "latitude": 13.7575244,
      "longitude": 109.218762,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb6vn1txmmz5f@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 706813,
      "name": "Nến - Coffee & Bar",
      "restaurant": "Nến - Coffee & Bar",
      "address": "128 Đô Đốc Bảo",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 3,
      "lat": 13.767557,
      "lng": 109.222822,
      "latitude": 13.767557,
      "longitude": 109.222822,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ez0nqii1nb1@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "salty"
      ]
    },
    {
      "id": 226220,
      "name": "Royal Club",
      "restaurant": "Royal Club",
      "address": "1 Hàn Mặc Tử",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 6.6,
      "reviewCount": 4,
      "lat": 13.746855,
      "lng": 109.213958,
      "latitude": 13.746855,
      "longitude": 109.213958,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9wjz0hisij49@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 693380,
      "name": "Win Pub - Beer & Cocktail",
      "restaurant": "Win Pub - Beer & Cocktail",
      "address": "68 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.6,
      "reviewCount": 3,
      "lat": 13.771354,
      "lng": 109.246674,
      "latitude": 13.771354,
      "longitude": 109.246674,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgekaxltjvd8a@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 719962,
      "name": "The Quy Nhon Sports Bar",
      "restaurant": "The Quy Nhon Sports Bar",
      "address": "92 An Dương Vương",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.8,
      "reviewCount": 2,
      "lat": 13.7476254,
      "lng": 109.213952,
      "latitude": 13.7476254,
      "longitude": 109.213952,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwep1nadkpg943@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 757865,
      "name": "The Fellowship Bar",
      "restaurant": "The Fellowship Bar",
      "address": "12 Phạm Hùng, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.8,
      "reviewCount": 2,
      "lat": 13.769276,
      "lng": 109.222923,
      "latitude": 13.769276,
      "longitude": 109.222923,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwevnw3cgk4bf5@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 852727,
      "name": "Rio The Pub",
      "restaurant": "Rio The Pub",
      "address": "Ngã Tư Võ Thị Yến - Trần Văn Ơn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.9,
      "reviewCount": 2,
      "lat": 13.755918,
      "lng": 109.214978,
      "latitude": 13.755918,
      "longitude": 109.214978,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaj4w2jm5srb0@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 673304,
      "name": "Since 1988 Pub",
      "restaurant": "Since 1988 Pub",
      "address": "162 Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.8,
      "reviewCount": 1,
      "lat": 13.769314,
      "lng": 109.233296,
      "latitude": 13.769314,
      "longitude": 109.233296,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8t9nyrkg6358@resize_ss640x400",
      "category": "seafood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 92845,
      "name": "Làng Nướng Phương Nghi - Tây Sơn",
      "restaurant": "Làng Nướng Phương Nghi - Tây Sơn",
      "address": "115-117-119 Tây Sơn",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.5,
      "reviewCount": 2,
      "lat": 13.7627267,
      "lng": 109.201385,
      "latitude": 13.7627267,
      "longitude": 109.201385,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwc2ynhzzcnvb5@resize_ss640x400",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "attributes": [
        "light"
      ]
    },
    {
      "id": 90683,
      "name": "DJ Cafe & Karaoke Ocean",
      "restaurant": "DJ Cafe & Karaoke Ocean",
      "address": "Lô 12 - Lô 16 Trung Tâm Thương Mại CoopMart Quy Nhơn, Nguyễn Tất Thành",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 8.0,
      "reviewCount": 1,
      "lat": 13.7668568,
      "lng": 109.2225297,
      "latitude": 13.7668568,
      "longitude": 109.2225297,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgpr69hzpp792@resize_ss640x400",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "light"
      ]
    },
    {
      "id": 49960,
      "name": "Nice's Cafe & Karaoke - Nguyễn Huệ",
      "restaurant": "Nice's Cafe & Karaoke - Nguyễn Huệ",
      "address": "423-425 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 4.4,
      "reviewCount": 1,
      "lat": 13.763312,
      "lng": 109.222984,
      "latitude": 13.763312,
      "longitude": 109.222984,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe70llgiifv99@resize_ss640x400",
      "category": "vegetarian",
      "source": "ShopeeFood",
      "attributes": [
        "drinks",
        "light"
      ]
    },
    {
      "id": 212038,
      "name": "Ốc Cô Xí",
      "restaurant": "Ốc Cô Xí",
      "address": "40 Đào Duy Từ",
      "district": "Tp. Qui Nhơn",
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "rating": 7.7,
      "reviewCount": 44,
      "lat": 13.777714,
      "lng": 109.23033,
      "latitude": 13.777714,
      "longitude": 109.23033,
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbf61ifu6e1e7@resize_ss640x400",
      "category": "streetfood",
      "source": "ShopeeFood",
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 1177055,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Phúc Long Nguyễn Thiếp",
      "restaurant": "Phúc Long Nguyễn Thiếp",
      "address": "1A Nguyễn Thiếp, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 2.1,
      "distanceText": "Cách bạn 2.1km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7633477,
      "longitude": 109.223458,
      "lat": 13.7633477,
      "lng": 109.223458,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mv4fe1gjlg5l80@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mv4fe1gjlg5l80@resize_ss640x400"
      ],
      "description": "Quán Phúc Long Nguyễn Thiếp tọa lạc tại 1A Nguyễn Thiếp, P. Trần Phú, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Phúc Long Nguyễn Thiếp",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/phuc-long-nguyen-thiep",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ph%C3%BAc%20Long%20Nguy%E1%BB%85n%20Thi%E1%BA%BFp",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 1292337,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Highlands Coffee - Trà, Cà Phê & Bánh - Z Beach Quy Nhơn",
      "restaurant": "Highlands Coffee - Trà, Cà Phê & Bánh - Z Beach Quy Nhơn",
      "address": "234 Xuân Diệu, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 2.0,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7688889,
      "longitude": 109.2328333,
      "lat": 13.7688889,
      "lng": 109.2328333,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mvl1th0osyywc6@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mvl1th0osyywc6@resize_ss640x400"
      ],
      "description": "Quán Highlands Coffee - Trà, Cà Phê & Bánh - Z Beach Quy Nhơn tọa lạc tại 234 Xuân Diệu, P. Trần Phú, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Highlands Coffee",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/highlands-coffee-tra-ca-phe-banh-z-beach-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Highlands%20Coffee%20-%20Tr%C3%A0%2C%20C%C3%A0%20Ph%C3%AA%20%26%20B%C3%A1nh%20-%20Z%20Beach%20Quy%20Nh%C6%A1n",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks"
      ]
    },
    {
      "id": 1185688,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cà phê - Latte - Trà Quỳnh Aka - Lê Lai",
      "restaurant": "Cà phê - Latte - Trà Quỳnh Aka - Lê Lai",
      "address": "1 Lê Lai, P.Lý Thường Kiệt",
      "district": "Tp. Qui Nhơn",
      "distance": 2.2,
      "distanceText": "Cách bạn 2.2km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.762459,
      "longitude": 109.2195718,
      "lat": 13.762459,
      "lng": 109.2195718,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lun2avq6ig42f8@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lun2avq6ig42f8@resize_ss640x400"
      ],
      "description": "Quán Cà phê - Latte - Trà Quỳnh Aka - Lê Lai tọa lạc tại 1 Lê Lai, P.Lý Thường Kiệt, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Cà phê",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ca-phe-latte-tra-quynh-aka-le-lai",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C3%A0%20ph%C3%AA%20-%20Latte%20-%20Tr%C3%A0%20Qu%E1%BB%B3nh%20Aka%20-%20L%C3%AA%20Lai",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks"
      ]
    },
    {
      "id": 1000070651,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Tan Coffee - Cà Phê - Lạc Long Quân",
      "restaurant": "Tan Coffee - Cà Phê - Lạc Long Quân",
      "address": "229 Lạc Long Quân, P. Trần Quang Diệu",
      "district": "Tp. Qui Nhơn",
      "distance": 7.7,
      "distanceText": "Cách bạn 7.7km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7848178,
      "longitude": 109.1483585,
      "lat": 13.7848178,
      "lng": 109.1483585,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhpgv9il5l86@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhpgv9il5l86@resize_ss640x400"
      ],
      "description": "Quán Tan Coffee - Cà Phê - Lạc Long Quân tọa lạc tại 229 Lạc Long Quân, P. Trần Quang Diệu, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Tan Coffee",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tan-coffee-ca-phe-lac-long-quan",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Tan%20Coffee%20-%20C%C3%A0%20Ph%C3%AA%20-%20L%E1%BA%A1c%20Long%20Qu%C3%A2n",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks"
      ]
    },
    {
      "id": 1217226,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "TOCOTOCO & Kem Tràng Tiền - Go Kim Cúc",
      "restaurant": "TOCOTOCO & Kem Tràng Tiền - Go Kim Cúc",
      "address": "Tầng 2 TTTM Go Kim Cúc, Đường 1D, P. Ghềnh Ráng",
      "district": "Tp. Qui Nhơn",
      "distance": 3.3,
      "distanceText": "Cách bạn 3.3km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7545899,
      "longitude": 109.2079109,
      "lat": 13.7545899,
      "lng": 109.2079109,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lxhmgruzfkrf6e@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lxhmgruzfkrf6e@resize_ss640x400"
      ],
      "description": "Quán TOCOTOCO & Kem Tràng Tiền - Go Kim Cúc tọa lạc tại Tầng 2 TTTM Go Kim Cúc, Đường 1D, P. Ghềnh Ráng, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng TOCOTOCO & Kem Tràng Tiền",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/tocotoco-kem-trang-tien-go-kim-cuc",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=TOCOTOCO%20%26%20Kem%20Tr%C3%A0ng%20Ti%E1%BB%81n%20-%20Go%20Kim%20C%C3%BAc",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 1250322,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Chè Liên Đà Nẵng",
      "restaurant": "Chè Liên Đà Nẵng",
      "address": "100 Nguyễn Tất Thành, P. Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "distance": 0.4,
      "distanceText": "Cách bạn 0.4km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7786467,
      "longitude": 109.2220073,
      "lat": 13.7786467,
      "lng": 109.2220073,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m9qw9lm3sr5a44@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m9qw9lm3sr5a44@resize_ss640x400"
      ],
      "description": "Quán Chè Liên Đà Nẵng tọa lạc tại 100 Nguyễn Tất Thành, P. Lê Hồng Phong, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Chè Liên Đà Nẵng",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/che-lien-da-nang",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ch%C3%A8%20Li%C3%AAn%20%C4%90%C3%A0%20N%E1%BA%B5ng",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 1178627,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Gà Rán Và Mì Ý - Jollibee - EC Quy Nhơn 2",
      "restaurant": "Gà Rán Và Mì Ý - Jollibee - EC Quy Nhơn 2",
      "address": "496 Trần Hưng Đạo, P. Trần Hưng Đạo",
      "district": "Tp. Qui Nhơn",
      "distance": 0.4,
      "distanceText": "Cách bạn 0.4km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "noodles",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7805034,
      "longitude": 109.2233078,
      "lat": 13.7805034,
      "lng": 109.2233078,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Noodles",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-msfeavi6y2o0e5@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-msfeavi6y2o0e5@resize_ss640x400"
      ],
      "description": "Quán Gà Rán Và Mì Ý - Jollibee - EC Quy Nhơn 2 tọa lạc tại 496 Trần Hưng Đạo, P. Trần Hưng Đạo, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Gà Rán Và Mì Ý",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ga-ran-va-mi-y-jollibee-ec-quy-nhon-2",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=G%C3%A0%20R%C3%A1n%20V%C3%A0%20M%C3%AC%20%C3%9D%20-%20Jollibee%20-%20EC%20Quy%20Nh%C6%A1n%202",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "hot_soup"
      ]
    },
    {
      "id": 1180382,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Gà Rán & Burger Lotteria - Quy Nhơn Go",
      "restaurant": "Gà Rán & Burger Lotteria - Quy Nhơn Go",
      "address": "Tầng 1 Khu Đô Thị Xanh Vũng Chua, P.Ghềnh Ráng",
      "district": "Tp. Qui Nhơn",
      "distance": 3.4,
      "distanceText": "Cách bạn 3.4km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7541248,
      "longitude": 109.2078559,
      "lat": 13.7541248,
      "lng": 109.2078559,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mszdqref7n622b@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mszdqref7n622b@resize_ss640x400"
      ],
      "description": "Quán Gà Rán & Burger Lotteria - Quy Nhơn Go tọa lạc tại Tầng 1 Khu Đô Thị Xanh Vũng Chua, P.Ghềnh Ráng, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Gà Rán & Burger Lotteria",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ga-ran-burger-lotteria-quy-nhon-go",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=G%C3%A0%20R%C3%A1n%20%26%20Burger%20Lotteria%20-%20Quy%20Nh%C6%A1n%20Go",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "crunchy",
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 1177355,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Pizza Hut - Go Quy Nhơn",
      "restaurant": "Pizza Hut - Go Quy Nhơn",
      "address": "Vị trí 1S9, khu Đô thị Xanh Vũng Chua, P. Ghềnh Ràng",
      "district": "Tp. Qui Nhơn",
      "distance": 3.3,
      "distanceText": "Cách bạn 3.3km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7547395,
      "longitude": 109.2079485,
      "lat": 13.7547395,
      "lng": 109.2079485,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mudfh7f3m9dwce@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mudfh7f3m9dwce@resize_ss640x400"
      ],
      "description": "Quán Pizza Hut - Go Quy Nhơn tọa lạc tại Vị trí 1S9, khu Đô thị Xanh Vũng Chua, P. Ghềnh Ràng, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Pizza Hut",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/pizza-hut-go-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Pizza%20Hut%20-%20Go%20Quy%20Nh%C6%A1n",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 982322,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Beer Pub - Võ Thị Yến",
      "restaurant": "Beer Pub - Võ Thị Yến",
      "address": "27 Võ Thị Yến",
      "district": "Tp. Qui Nhơn",
      "distance": 2.8,
      "distanceText": "Cách bạn 2.8km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7567711,
      "longitude": 109.2154163,
      "lat": 13.7567711,
      "lng": 109.2154163,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa3xzcplas927@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa3xzcplas927@resize_ss640x400"
      ],
      "description": "Quán Beer Pub - Võ Thị Yến tọa lạc tại 27 Võ Thị Yến, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Beer Pub",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/beer-pub-vo-thi-yen",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Beer%20Pub%20-%20V%C3%B5%20Th%E1%BB%8B%20Y%E1%BA%BFn",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 881257,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Vip Pub",
      "restaurant": "Vip Pub",
      "address": "421 Nguyễn Huệ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.0,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.763916,
      "longitude": 109.223055,
      "lat": 13.763916,
      "lng": 109.223055,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdue638zdg9cc@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdue638zdg9cc@resize_ss640x400"
      ],
      "description": "Quán Vip Pub tọa lạc tại 421 Nguyễn Huệ, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Vip Pub",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/vip-pub",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Vip%20Pub",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 288617,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Diamond Club",
      "restaurant": "Diamond Club",
      "address": "54 An Dương Vương, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 3.9,
      "distanceText": "Cách bạn 3.9km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7469779999999,
      "longitude": 109.2177481,
      "lat": 13.7469779999999,
      "lng": 109.2177481,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9pkama70t73e@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9pkama70t73e@resize_ss640x400"
      ],
      "description": "Quán Diamond Club tọa lạc tại 54 An Dương Vương, P. Nguyễn Văn Cừ, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Diamond Club",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/diamond-club",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Diamond%20Club",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 240126,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Trio Dj Coffee",
      "restaurant": "Trio Dj Coffee",
      "address": "668 Hùng Vương",
      "district": "Tp. Qui Nhơn",
      "distance": 4.3,
      "distanceText": "Cách bạn 4.3km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.795412,
      "longitude": 109.182034,
      "lat": 13.795412,
      "lng": 109.182034,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwafad4hbv1573@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwafad4hbv1573@resize_ss640x400"
      ],
      "description": "Quán Trio Dj Coffee tọa lạc tại 668 Hùng Vương, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Trio Dj Coffee",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/trio-dj-coffee",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Trio%20Dj%20Coffee",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks"
      ]
    },
    {
      "id": 871762,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "The Sine Pub",
      "restaurant": "The Sine Pub",
      "address": "148 Đô Đốc Bảo",
      "district": "Tp. Qui Nhơn",
      "distance": 1.5,
      "distanceText": "Cách bạn 1.5km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.768645,
      "longitude": 109.222862,
      "lat": 13.768645,
      "lng": 109.222862,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwep7bkkmq57af@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwep7bkkmq57af@resize_ss640x400"
      ],
      "description": "Quán The Sine Pub tọa lạc tại 148 Đô Đốc Bảo, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng The Sine Pub",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/the-sine-pub",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=The%20Sine%20Pub",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 692913,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Bar Chợ Đêm Quy Nhơn",
      "restaurant": "Bar Chợ Đêm Quy Nhơn",
      "address": "Lê Duẩn, Khu Ẩm Thực Chợ Đêm",
      "district": "Tp. Qui Nhơn",
      "distance": 2.1,
      "distanceText": "Cách bạn 2.1km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.763138,
      "longitude": 109.22079,
      "lat": 13.763138,
      "lng": 109.22079,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ewxhmh5uje2@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ewxhmh5uje2@resize_ss640x400"
      ],
      "description": "Quán Bar Chợ Đêm Quy Nhơn tọa lạc tại Lê Duẩn, Khu Ẩm Thực Chợ Đêm, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Bar Chợ Đêm Quy Nhơn",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/bar-cho-dem-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Bar%20Ch%E1%BB%A3%20%C4%90%C3%AAm%20Quy%20Nh%C6%A1n",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 219559,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "STYLE Pub & Bar",
      "restaurant": "STYLE Pub & Bar",
      "address": "10 Đô Đốc Bảo",
      "district": "Tp. Qui Nhơn",
      "distance": 2.0,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7641799415028,
      "longitude": 109.2228408157825,
      "lat": 13.7641799415028,
      "lng": 109.2228408157825,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe39b1nw9g96a@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe39b1nw9g96a@resize_ss640x400"
      ],
      "description": "Quán STYLE Pub & Bar tọa lạc tại 10 Đô Đốc Bảo, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng STYLE Pub & Bar",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/style-pub-bar",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=STYLE%20Pub%20%26%20Bar",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 280570,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Ocean Pool Bar",
      "restaurant": "Ocean Pool Bar",
      "address": "Khu 4, Xã Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "distance": 13.5,
      "distanceText": "Cách bạn 13.5km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.884793,
      "longitude": 109.28621,
      "lat": 13.884793,
      "lng": 109.28621,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfbnobneeah35@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfbnobneeah35@resize_ss640x400"
      ],
      "description": "Quán Ocean Pool Bar tọa lạc tại Khu 4, Xã Nhơn Lý, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Ocean Pool Bar",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/ocean-pool-bar",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ocean%20Pool%20Bar",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 300857,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Zero - Bar Guitar",
      "restaurant": "Zero - Bar Guitar",
      "address": "122 Nguyễn Thị Định",
      "district": "Tp. Qui Nhơn",
      "distance": 2.8,
      "distanceText": "Cách bạn 2.8km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.757722,
      "longitude": 109.214031,
      "lat": 13.757722,
      "lng": 109.214031,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdtqhmu4wd5a5@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdtqhmu4wd5a5@resize_ss640x400"
      ],
      "description": "Quán Zero - Bar Guitar tọa lạc tại 122 Nguyễn Thị Định, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Zero",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/zero-bar-guitar",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Zero%20-%20Bar%20Guitar",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 244125,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Diamond Pub",
      "restaurant": "Diamond Pub",
      "address": "Xuân Diệu",
      "district": "Tp. Qui Nhơn",
      "distance": 2.0,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.768275,
      "longitude": 109.231922,
      "lat": 13.768275,
      "lng": 109.231922,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwacqnff01cr14@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwacqnff01cr14@resize_ss640x400"
      ],
      "description": "Quán Diamond Pub tọa lạc tại Xuân Diệu, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Diamond Pub",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/diamond-pub",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Diamond%20Pub",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 233235,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cali Beer Club",
      "restaurant": "Cali Beer Club",
      "address": "Lô 61 - 64 Lê Đức Thọ",
      "district": "Tp. Qui Nhơn",
      "distance": 1.3,
      "distanceText": "Cách bạn 1.3km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.778896,
      "longitude": 109.231386,
      "lat": 13.778896,
      "lng": 109.231386,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb2obebwx5l33@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb2obebwx5l33@resize_ss640x400"
      ],
      "description": "Quán Cali Beer Club tọa lạc tại Lô 61 - 64 Lê Đức Thọ, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Cali Beer Club",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/cali-beer-club",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Cali%20Beer%20Club",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 219578,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Khói Pub",
      "restaurant": "Khói Pub",
      "address": "2 Nguyễn Công Trứ",
      "district": "Tp. Qui Nhơn",
      "distance": 1.2,
      "distanceText": "Cách bạn 1.2km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.774613,
      "longitude": 109.227195,
      "lat": 13.774613,
      "lng": 109.227195,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwg9b1z7r7ize0@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwg9b1z7r7ize0@resize_ss640x400"
      ],
      "description": "Quán Khói Pub tọa lạc tại 2 Nguyễn Công Trứ, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Khói Pub",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/khoi-pub",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Kh%C3%B3i%20Pub",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 1027899,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "69 Pub",
      "restaurant": "69 Pub",
      "address": "Võ Thị Yến, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 2.9,
      "distanceText": "Cách bạn 2.9km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.755916,
      "longitude": 109.214967,
      "lat": 13.755916,
      "lng": 109.214967,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi813u9m1gb15@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi813u9m1gb15@resize_ss640x400"
      ],
      "description": "Quán 69 Pub tọa lạc tại Võ Thị Yến, P. Nguyễn Văn Cừ, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng 69 Pub",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/69-pub",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=69%20Pub",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 1193122,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Cơm Cháy Sài Gòn - Lý Thường Kiệt",
      "restaurant": "Cơm Cháy Sài Gòn - Lý Thường Kiệt",
      "address": "39 Lý Thường Kiệt, P. Lê Hồng Phong",
      "district": "Tp. Qui Nhơn",
      "distance": 0.9,
      "distanceText": "Cách bạn 0.9km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "rice",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.776234,
      "longitude": 109.225357,
      "lat": 13.776234,
      "lng": 109.225357,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Rice",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mn1kgcy8pxxk9f@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mn1kgcy8pxxk9f@resize_ss640x400"
      ],
      "description": "Quán Cơm Cháy Sài Gòn - Lý Thường Kiệt tọa lạc tại 39 Lý Thường Kiệt, P. Lê Hồng Phong, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Cơm Cháy Sài Gòn",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-chay-sai-gon-ly-thuong-kiet",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20Ch%C3%A1y%20S%C3%A0i%20G%C3%B2n%20-%20L%C3%BD%20Th%C6%B0%E1%BB%9Dng%20Ki%E1%BB%87t",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "heavy"
      ]
    },
    {
      "id": 1067562,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "The Social - Nguyễn Thị Minh Khai",
      "restaurant": "The Social - Nguyễn Thị Minh Khai",
      "address": "360 Nguyễn Thị Minh Khai",
      "district": "Tp. Qui Nhơn",
      "distance": 2.6,
      "distanceText": "Cách bạn 2.6km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.759784,
      "longitude": 109.212593,
      "lat": 13.759784,
      "lng": 109.212593,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwehlewekhcp36@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwehlewekhcp36@resize_ss640x400"
      ],
      "description": "Quán The Social - Nguyễn Thị Minh Khai tọa lạc tại 360 Nguyễn Thị Minh Khai, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng The Social",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/the-social-nguyen-thi-minh-khai",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=The%20Social%20-%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 280574,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Prime View Sky Bar",
      "restaurant": "Prime View Sky Bar",
      "address": "Khu Vực 4, Nhơn Lý",
      "district": "Tp. Qui Nhơn",
      "distance": 13.5,
      "distanceText": "Cách bạn 13.5km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.884793,
      "longitude": 109.28621,
      "lat": 13.884793,
      "lng": 109.28621,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvhxandsyh98@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvhxandsyh98@resize_ss640x400"
      ],
      "description": "Quán Prime View Sky Bar tọa lạc tại Khu Vực 4, Nhơn Lý, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Prime View Sky Bar",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/prime-view-sky-bar",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Prime%20View%20Sky%20Bar",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 1000069978,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "5 Elements Restaurant - Pizza & Mexican Food - 14 Hàm Nghi",
      "restaurant": "5 Elements Restaurant - Pizza & Mexican Food - 14 Hàm Nghi",
      "address": "14 Hàm Nghi, P. Ngô Mây",
      "district": "Tp. Qui Nhơn",
      "distance": 2.0,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7642741,
      "longitude": 109.2162847,
      "lat": 13.7642741,
      "lng": 109.2162847,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhnzsn7ydg51@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhnzsn7ydg51@resize_ss640x400"
      ],
      "description": "Quán 5 Elements Restaurant - Pizza & Mexican Food - 14 Hàm Nghi tọa lạc tại 14 Hàm Nghi, P. Ngô Mây, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng 5 Elements Restaurant",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/5-elements-restaurant-pizza-mexican-food-14-ham-nghi",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=5%20Elements%20Restaurant%20-%20Pizza%20%26%20Mexican%20Food%20-%2014%20H%C3%A0m%20Nghi",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 280569,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Wine & Cigar Bar",
      "restaurant": "Wine & Cigar Bar",
      "address": "Khu 4, Nhơn Lý - Bãi Biển Cát Tiến",
      "district": "Tp. Qui Nhơn",
      "distance": 13.3,
      "distanceText": "Cách bạn 13.3km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "seafood",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.889523,
      "longitude": 109.272657,
      "lat": 13.889523,
      "lng": 109.272657,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Seafood",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf9bu222leh48@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf9bu222leh48@resize_ss640x400"
      ],
      "description": "Quán Wine & Cigar Bar tọa lạc tại Khu 4, Nhơn Lý - Bãi Biển Cát Tiến, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Wine & Cigar Bar",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/wine-cigar-bar",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Wine%20%26%20Cigar%20Bar",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "salty"
      ]
    },
    {
      "id": 1236019,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "KATINAT - Nguyễn Lạc (Quy Nhơn)",
      "restaurant": "KATINAT - Nguyễn Lạc (Quy Nhơn)",
      "address": "19 - 19A Đường Nguyễn Lạc, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 2.1,
      "distanceText": "Cách bạn 2.1km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "boba",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7634026,
      "longitude": 109.2236022,
      "lat": 13.7634026,
      "lng": 109.2236022,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Boba",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mv8u89omy2o988@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mv8u89omy2o988@resize_ss640x400"
      ],
      "description": "Quán KATINAT - Nguyễn Lạc (Quy Nhơn) tọa lạc tại 19 - 19A Đường Nguyễn Lạc, P. Trần Phú, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng KATINAT",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/katinat-nguyen-lac-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=KATINAT%20-%20Nguy%E1%BB%85n%20L%E1%BA%A1c%20%28Quy%20Nh%C6%A1n%29",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks",
        "sweet"
      ]
    },
    {
      "id": 1181166,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Highlands Coffee - Trà, Cà Phê & Bánh - Nguyễn Trung Tín Quy Nhơn",
      "restaurant": "Highlands Coffee - Trà, Cà Phê & Bánh - Nguyễn Trung Tín Quy Nhơn",
      "address": "Góc Nguyễn Trung Tín & Nguyễn Thị Định, P. Nguyễn Văn Cừ",
      "district": "Tp. Qui Nhơn",
      "distance": 3.0,
      "distanceText": "Cách bạn 3.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.756138,
      "longitude": 109.2134124,
      "lat": 13.756138,
      "lng": 109.2134124,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mvl1th0osyywc6@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mvl1th0osyywc6@resize_ss640x400"
      ],
      "description": "Quán Highlands Coffee - Trà, Cà Phê & Bánh - Nguyễn Trung Tín Quy Nhơn tọa lạc tại Góc Nguyễn Trung Tín & Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Highlands Coffee",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/highlands-coffee-tra-ca-phe-banh-nguyen-trung-tin-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Highlands%20Coffee%20-%20Tr%C3%A0%2C%20C%C3%A0%20Ph%C3%AA%20%26%20B%C3%A1nh%20-%20Nguy%E1%BB%85n%20Trung%20T%C3%ADn%20Quy%20Nh%C6%A1n",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks"
      ]
    },
    {
      "id": 1247633,
      "cityId": "quynhon",
      "cityName": "Quy Nhơn",
      "name": "Starbucks Coffee - Xuân Diệu Quy Nhơn",
      "restaurant": "Starbucks Coffee - Xuân Diệu Quy Nhơn",
      "address": "160 Xuân Diệu, P. Trần Phú",
      "district": "Tp. Qui Nhơn",
      "distance": 2.0,
      "distanceText": "Cách bạn 2.0km",
      "priceRange": "25.000đ - 65.000đ",
      "rating": 0.0,
      "reviewCount": 0,
      "likesCount": 0,
      "commentsCount": 0,
      "openTime": "07:00 - 22:30",
      "category": "cafe",
      "source": "ShopeeFood",
      "sourceIcon": "🛍️",
      "latitude": 13.7687672,
      "longitude": 109.2316167,
      "lat": 13.7687672,
      "lng": 109.2316167,
      "moodIds": [
        "comfort",
        "chill",
        "energetic"
      ],
      "weather": [
        "sunny",
        "rainy",
        "hot"
      ],
      "weatherNote": "Quy Nhơn 24°C 🌧️",
      "tags": [
        "#Cafe",
        "#ShopeeFood",
        "#QuyNhơn"
      ],
      "sideRibbon": [
        "#hot",
        "#chuẩn_vị"
      ],
      "image": "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m8vbseyzhcavb8@resize_ss640x400",
      "gallery": [
        "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m8vbseyzhcavb8@resize_ss640x400"
      ],
      "description": "Quán Starbucks Coffee - Xuân Diệu Quy Nhơn tọa lạc tại 160 Xuân Diệu, P. Trần Phú, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
      "recommendReason": "Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
      "menu": [
        {
          "name": "Món đặc trưng Starbucks Coffee",
          "price": "35.000đ",
          "highlight": true
        },
        {
          "name": "Món thêm / Nâng cấp đặc biệt",
          "price": "55.000đ",
          "highlight": false
        },
        {
          "name": "Trà đá / Nước giải khát",
          "price": "10.000đ",
          "highlight": false
        }
      ],
      "deliveryPlatform": "ShopeeFood",
      "deliveryUrl": "https://shopeefood.vn/binh-dinh/starbucks-coffee-xuan-dieu-quy-nhon",
      "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Starbucks%20Coffee%20-%20Xu%C3%A2n%20Di%E1%BB%87u%20Quy%20Nh%C6%A1n",
      "deliveryTime": "25 - 40 phút",
      "deliveryFee": "18.000đ (Áp mã Freeship)",
      "deliveryFeeVal": 18000,
      "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
      "deliveryRating": "Quán mới mở ⭐",
      "gmapsVerified": false,
      "priceMin": 25000,
      "priceMax": 65000,
      "attributes": [
        "drinks"
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.APP_DATA = APP_DATA;
}
