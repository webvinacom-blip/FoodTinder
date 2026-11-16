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

// Official ShopeeFood Brand Icons (Đặc trưng ShopeeFood: hộp đồ ăn takeaway cam, nĩa & muỗng)
function getShopeeIcon(size = 18, className = '') {
  return `<img src="images/shopeefood-icon.png" width="${size}" height="${size}" class="${className}" style="display:inline-block;vertical-align:middle;object-fit:cover;border-radius:4px;flex-shrink:0;" alt="ShopeeFood" onerror="this.onerror=null;this.parentElement.innerHTML='<svg width=\\'${size}\\' height=\\'${size}\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' rx=\\'22\\' fill=\\'#EE4D2D\\'/><path d=\\'M28 24C29 24 29.5 24.3 30 25L17 38C16.3 38.8 16 39.8 16 41V78C16 82.4 19.6 86 24 86H76C80.4 86 84 82.4 84 78V41C84 39.8 83.7 38.8 83 38L70 25C69.5 24.3 70 24 71 24H28Z\\' fill=\\'#FFF\\'/><rect x=\\'36\\' y=\\'29\\' width=\\'28\\' height=\\'6\\' rx=\\'2\\' fill=\\'#EE4D2D\\'/><path d=\\'M35 43V54C35 56.5 37 58.5 39.5 58.5V80H42.5V58.5C45 58.5 47 56.5 47 54V43H44.5V51.5H42.5V43H39.5V51.5H37.5V43H35Z\\' fill=\\'#EE4D2D\\'/><path d=\\'M59 42C54.5 42 52 46.5 52 51.5C52 56 54.5 58.5 57.5 58.5V80H60.5V58.5C63.5 58.5 66 56 66 51.5C66 46.5 63.5 42 59 42Z\\' fill=\\'#EE4D2D\\'/></svg>';" />`;
}

// Vector ShopeeFood takeaway box with fork and spoon
function getShopeeBagSvg(size = 18, className = '', fillColor = '#FFFFFF') {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;">
    <path d="M28 24C29 24 29.5 24.3 30 25L17 38C16.3 38.8 16 39.8 16 41V78C16 82.4 19.6 86 24 86H76C80.4 86 84 82.4 84 78V41C84 39.8 83.7 38.8 83 38L70 25C69.5 24.3 70 24 71 24H28Z" fill="${fillColor}"/>
    <rect x="36" y="29" width="28" height="6" rx="2" fill="#EE4D2D"/>
    <path d="M35 43V54C35 56.5 37 58.5 39.5 58.5V80H42.5V58.5C45 58.5 47 56.5 47 54V43H44.5V51.5H42.5V43H39.5V51.5H37.5V43H35Z" fill="#EE4D2D"/>
    <path d="M59 42C54.5 42 52 46.5 52 51.5C52 56 54.5 58.5 57.5 58.5V80H60.5V58.5C63.5 58.5 66 56 66 51.5C66 46.5 63.5 42 59 42Z" fill="#EE4D2D"/>
  </svg>`;
}

if (typeof window !== 'undefined') {
  window.getShopeeIcon = getShopeeIcon;
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
  return false;
}

if (typeof window !== "undefined") {
  window.PERMANENTLY_CLOSED_BLACKLIST = PERMANENTLY_CLOSED_BLACKLIST;
  window.PERMANENTLY_CLOSED_KEYWORDS = PERMANENTLY_CLOSED_KEYWORDS;
  window.isPermanentlyClosedRestaurant = isPermanentlyClosedRestaurant;
  window.calculateDistanceKm = calculateDistanceKm;
  window.formatDistanceText = formatDistanceText;
  window.isFakeDummyFood = isFakeDummyFood;
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
        "rest": "Lẩu Cô Vy - 124 Nguyễn Huệ, Quy Nhơn",
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
        "rest": "Bánh Xèo Gia Vỹ 2 - 14 Diên Hồng, Quy Nhơn",
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
        "rest": "Bánh Xèo Gia Vỹ 2 - 14 Diên Hồng, TP. Quy Nhơn",
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
      id: "comfort",
      emoji: "🥺",
      label: "Cần vỗ về",
      color: "#FFB088",
      glow: "rgba(255, 176, 136, 0.4)",
      desc: "Cần món ấm áp, ngọt dịu để nạp lại tinh thần",
      tags: ["#Ấm_áp", "#Ngọt_ngào", "#Thanh_đạm", "#Vỗ_về"]
    },
    {
      id: "sad",
      emoji: "💔",
      label: "Hơi buồn rầu",
      color: "#FF6584",
      glow: "rgba(255, 101, 132, 0.45)",
      desc: "Ăn cay nóng hoặc xì xèo để xua tan muộn phiền",
      tags: ["#Xả_stress", "#Ấm_áp", "#Thèm_ấm_áp", "#Cay_nồng"]
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
      desc: "Tìm quán ngon bổ rẻ chuẩn tiêu chí sinh viên cuối tháng",
      tags: ["#Ngon_bổ_rẻ", "#Sinh_viên", "#Bình_dân", "#Tiết_kiệm"]
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
      id: "late_night",
      emoji: "🌙",
      label: "Ăn đêm",
      color: "#57606F",
      glow: "rgba(87, 96, 111, 0.4)",
      desc: "Cú đêm đói bụng, tìm quán mở khuya lót dạ ấm bụng",
      tags: ["#Ăn_đêm", "#Cú_đêm", "#Mở_khuya", "#Ấm_bụng"]
    }
  ],

  currentMoodId: "sad", // Default matching user's Image 2 ("Hơi buồn rầu" selected)

  // 300 Quán Ăn Nổi Bật Tại Quy Nhơn từ ShopeeFood & GrabFood (Đầy đủ ShopeeFood Delivery)
  foods: [
  {
    "id": 1,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Gà Chỉ Quy Nhơn Nướng Muối Ớt & Luộc Lá Chanh",
    "restaurant": "Gà Chỉ Sáu Cao",
    "address": "Phạm Thị Đào, Khu Vực 3",
    "district": "Tp. Qui Nhơn",
    "distance": 4.4,
    "distanceText": "Cách bạn 4.4km",
    "priceRange": "180.000đ - 320.000đ",
    "rating": 4.3,
    "reviewCount": 272,
    "likesCount": 821,
    "commentsCount": 54,
    "openTime": "07:00 - 22:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.743667,
    "longitude": 109.209027,
    "lat": 13.743667,
    "lng": 109.209027,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbfec2kqjtlfc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbfec2kqjtlfc@resize_ss640x400"
    ],
    "description": "Quán Gà Chỉ Sáu Cao tọa lạc tại Phạm Thị Đào, Khu Vực 3, phục vụ món Gà Chỉ Quy Nhơn Nướng Muối Ớt & Luộc Lá Chanh hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Gà Chỉ Quy Nhơn Nướng Muối Ớt & Luộc Lá Chanh tại Gà Chỉ Sáu Cao cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3800137",
    "menu": [
      {
        "name": "Gà Chỉ Quy Nhơn Nướng Muối Ớt & Luộc Lá Chanh",
        "price": "180.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Gà Chỉ Sáu Cao",
        "price": "320.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ga-chi-sau-cao",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=G%C3%A0%20Ch%E1%BB%89%20S%C3%A1u%20Cao",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 2,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Niêu Mộc Viên Cá Kho Tộ & Canh Cua Rau Đay",
    "restaurant": "Mộc Viên Restaurant - Món Việt",
    "address": "2 Lê Thanh Nghị",
    "district": "Tp. Qui Nhơn",
    "distance": 0.6,
    "distanceText": "Cách bạn 550m",
    "priceRange": "85.000đ - 180.000đ",
    "rating": 4.5,
    "reviewCount": 93,
    "likesCount": 289,
    "commentsCount": 18,
    "openTime": "08:00 - 23:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7870653314854,
    "longitude": 109.2202430598328,
    "lat": 13.7870653314854,
    "lng": 109.2202430598328,
    "moodIds": [
      "healthy",
      "comfort",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweqawpp83q310@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweqawpp83q310@resize_ss640x400"
    ],
    "description": "Quán Mộc Viên Restaurant - Món Việt tọa lạc tại 2 Lê Thanh Nghị, phục vụ món Cơm Niêu Mộc Viên Cá Kho Tộ & Canh Cua Rau Đay hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Niêu Mộc Viên Cá Kho Tộ & Canh Cua Rau Đay tại Mộc Viên Restaurant - Món Việt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3800274",
    "menu": [
      {
        "name": "Cơm Niêu Mộc Viên Cá Kho Tộ & Canh Cua Rau Đay",
        "price": "85.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mộc Viên Restaurant - Món Việt",
        "price": "180.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/moc-vien-restaurant-mon-viet",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%E1%BB%99c%20Vi%C3%AAn%20Restaurant%20-%20M%C3%B3n%20Vi%E1%BB%87t",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 3,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hướng Dương Quán - Hải Sản Tươi Sống",
    "address": "Trục Đường Chính Khu Du Lịch Eo Gió, Xã Nhơn Lý",
    "district": "Tp. Qui Nhơn",
    "distance": 13.8,
    "distanceText": "Cách bạn 14km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.4,
    "reviewCount": 58,
    "likesCount": 189,
    "commentsCount": 11,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.884931,
    "longitude": 109.291551,
    "lat": 13.884931,
    "lng": 109.291551,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe0ftvnv2l790@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe0ftvnv2l790@resize_ss640x400"
    ],
    "description": "Quán Hướng Dương Quán - Hải Sản Tươi Sống tọa lạc tại Trục Đường Chính Khu Du Lịch Eo Gió, Xã Nhơn Lý, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hướng Dương Quán - Hải Sản Tươi Sống cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3800411",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hướng Dương Quán - Hải Sản Tươi Sống",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/huong-duong-quan-hai-san-tuoi-song",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%C6%B0%E1%BB%9Bng%20D%C6%B0%C6%A1ng%20Qu%C3%A1n%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20T%C6%B0%C6%A1i%20S%E1%BB%91ng",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 4,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hải Sỹ - Hải Sản Tươi Sống",
    "address": "35B Nguyễn Huệ, P. Hải Cảng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.4,
    "distanceText": "Cách bạn 2.4km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.8,
    "reviewCount": 24,
    "likesCount": 92,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.77205,
    "longitude": 109.239333,
    "lat": 13.77205,
    "lng": 109.239333,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhxl7bsx8m37c@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhxl7bsx8m37c@resize_ss640x400"
    ],
    "description": "Quán Hải Sỹ - Hải Sản Tươi Sống tọa lạc tại 35B Nguyễn Huệ, P. Hải Cảng, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hải Sỹ - Hải Sản Tươi Sống cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3800548",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Sỹ - Hải Sản Tươi Sống",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-sy-hai-san-tuoi-song",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20S%E1%BB%B9%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20T%C6%B0%C6%A1i%20S%E1%BB%91ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 5,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Kem Ý Gelato Tự Chọn Trái Cây Tươi",
    "restaurant": "Jolly - Kem Ý Tự Chọn - Lê Lợi",
    "address": "65 Lê Lợi, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "25.000đ - 50.000đ",
    "rating": 4.5,
    "reviewCount": 40,
    "likesCount": 145,
    "commentsCount": 8,
    "openTime": "08:00 - 23:30",
    "category": "boba",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772682,
    "longitude": 109.231717,
    "lat": 13.772682,
    "lng": 109.231717,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ozz76m7krcd@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ozz76m7krcd@resize_ss640x400"
    ],
    "description": "Quán Jolly - Kem Ý Tự Chọn - Lê Lợi tọa lạc tại 65 Lê Lợi, P. Trần Hưng Đạo, phục vụ món Kem Ý Gelato Tự Chọn Trái Cây Tươi hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Kem Ý Gelato Tự Chọn Trái Cây Tươi tại Jolly - Kem Ý Tự Chọn - Lê Lợi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3800685",
    "menu": [
      {
        "name": "Kem Ý Gelato Tự Chọn Trái Cây Tươi",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Jolly - Kem Ý Tự Chọn - Lê Lợi",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/jolly-kem-y-tu-chon-le-loi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Jolly%20-%20Kem%20%C3%9D%20T%E1%BB%B1%20Ch%E1%BB%8Dn%20-%20L%C3%AA%20L%E1%BB%A3i",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 6,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Gà Chỉ Quy Nhơn Nướng Muối Ớt & Luộc Lá Chanh",
    "restaurant": "Quán Vườn Sáu Cao - Khu Bông Hồng",
    "address": "Khu Bông Hồng, Ghềnh Ráng",
    "district": "Tp. Qui Nhơn",
    "distance": 4.4,
    "distanceText": "Cách bạn 4.4km",
    "priceRange": "180.000đ - 320.000đ",
    "rating": 4.8,
    "reviewCount": 20,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7437583110094,
    "longitude": 109.2089560255408,
    "lat": 13.7437583110094,
    "lng": 109.2089560255408,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9l01mb5ivv69@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9l01mb5ivv69@resize_ss640x400"
    ],
    "description": "Quán Quán Vườn Sáu Cao - Khu Bông Hồng tọa lạc tại Khu Bông Hồng, Ghềnh Ráng, phục vụ món Gà Chỉ Quy Nhơn Nướng Muối Ớt & Luộc Lá Chanh hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Gà Chỉ Quy Nhơn Nướng Muối Ớt & Luộc Lá Chanh tại Quán Vườn Sáu Cao - Khu Bông Hồng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3800822",
    "menu": [
      {
        "name": "Gà Chỉ Quy Nhơn Nướng Muối Ớt & Luộc Lá Chanh",
        "price": "180.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Vườn Sáu Cao - Khu Bông Hồng",
        "price": "320.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-vuon-sau-cao-khu-bong-hong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20V%C6%B0%E1%BB%9Dn%20S%C3%A1u%20Cao%20-%20Khu%20B%C3%B4ng%20H%E1%BB%93ng",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 7,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng Hồng Thanh",
    "address": "22 Phan Bội Châu, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.4,
    "reviewCount": 36,
    "likesCount": 143,
    "commentsCount": 7,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7738932,
    "longitude": 109.2358765,
    "lat": 13.7738932,
    "lng": 109.2358765,
    "moodIds": [
      "comfort",
      "budget",
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
    "description": "Quán Bánh Hỏi Cháo Lòng Hồng Thanh tọa lạc tại 22 Phan Bội Châu, P. Lê Lợi, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng Hồng Thanh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3800959",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng Hồng Thanh",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 8,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Anh Vũ",
    "address": "14 Diên Hồng, P. Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1000m",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.4,
    "reviewCount": 36,
    "likesCount": 148,
    "commentsCount": 7,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773073,
    "longitude": 109.220795,
    "lat": 13.773073,
    "lng": 109.220795,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "description": "Quán Bánh Xèo Anh Vũ tọa lạc tại 14 Diên Hồng, P. Lê Hồng Phong, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Anh Vũ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3801096",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Anh Vũ",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 9,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hoàng Thao - Nhà Hàng Hải Sản",
    "address": "Eo Gió, Xã Nhơn Lý",
    "district": "Tp. Qui Nhơn",
    "distance": 13.8,
    "distanceText": "Cách bạn 14km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.4,
    "reviewCount": 28,
    "likesCount": 129,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.8851164085068,
    "longitude": 109.2914950148193,
    "lat": 13.8851164085068,
    "lng": 109.2914950148193,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwck08pt35y3be@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwck08pt35y3be@resize_ss640x400"
    ],
    "description": "Quán Hoàng Thao - Nhà Hàng Hải Sản tọa lạc tại Eo Gió, Xã Nhơn Lý, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hoàng Thao - Nhà Hàng Hải Sản cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3801233",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hoàng Thao - Nhà Hàng Hải Sản",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hoang-thao-nha-hang-hai-san",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ho%C3%A0ng%20Thao%20-%20Nh%C3%A0%20H%C3%A0ng%20H%E1%BA%A3i%20S%E1%BA%A3n",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 10,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hải Nam - Nhà Hàng Hải Sản",
    "address": "2 Xuân Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 2.3,
    "distanceText": "Cách bạn 2.3km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.8,
    "reviewCount": 12,
    "likesCount": 86,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.761441,
    "longitude": 109.222803,
    "lat": 13.761441,
    "lng": 109.222803,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfbpuocjly336@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfbpuocjly336@resize_ss640x400"
    ],
    "description": "Quán Hải Nam - Nhà Hàng Hải Sản tọa lạc tại 2 Xuân Diệu, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hải Nam - Nhà Hàng Hải Sản cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3801370",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Nam - Nhà Hàng Hải Sản",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-nam-nha-hang-hai-san",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20Nam%20-%20Nh%C3%A0%20H%C3%A0ng%20H%E1%BA%A3i%20S%E1%BA%A3n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 11,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Ông Hùng - Bánh Xèo Tôm Nhảy",
    "address": "24 Diên Hồng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.3,
    "reviewCount": 21,
    "likesCount": 118,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7681019,
    "longitude": 109.2205423,
    "lat": 13.7681019,
    "lng": 109.2205423,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8xyvcxe863de@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8xyvcxe863de@resize_ss640x400"
    ],
    "description": "Quán Ông Hùng - Bánh Xèo Tôm Nhảy tọa lạc tại 24 Diên Hồng, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Ông Hùng - Bánh Xèo Tôm Nhảy cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3801507",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ông Hùng - Bánh Xèo Tôm Nhảy",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ong-hung-banh-xeo-tom-nhay",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C3%94ng%20H%C3%B9ng%20-%20B%C3%A1nh%20X%C3%A8o%20T%C3%B4m%20Nh%E1%BA%A3y",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 12,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá Phượng Tèo",
    "address": "209 - 211 Nguyễn Huệ, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.3,
    "reviewCount": 20,
    "likesCount": 120,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7679855,
    "longitude": 109.2281973,
    "lat": 13.7679855,
    "lng": 109.2281973,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstqj9icc3ic7e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstqj9icc3ic7e@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá Phượng Tèo tọa lạc tại 209 - 211 Nguyễn Huệ, P. Trần Phú, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá Phượng Tèo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3801644",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá Phượng Tèo",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
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
    "rating": 5.0,
    "reviewCount": 4,
    "likesCount": 77,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7710975812394,
    "longitude": 109.2477025464177,
    "lat": 13.7710975812394,
    "lng": 109.2477025464177,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "hotline": "0256 3801781",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "5.0 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 14,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Bèo & Bánh Xèo",
    "address": "52 Hàn Mạc Tử, P. Ghềnh Ráng",
    "district": "Tp. Qui Nhơn",
    "distance": 4.1,
    "distanceText": "Cách bạn 4.1km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.8,
    "reviewCount": 6,
    "likesCount": 88,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.745718,
    "longitude": 109.213348,
    "lat": 13.745718,
    "lng": 109.213348,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhvdhbsnxspd1@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhvdhbsnxspd1@resize_ss640x400"
    ],
    "description": "Quán Bánh Bèo & Bánh Xèo tọa lạc tại 52 Hàn Mạc Tử, P. Ghềnh Ráng, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Bèo & Bánh Xèo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3801918",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Bèo & Bánh Xèo",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-beo-banh-xeo",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20B%C3%A8o%20%26%20B%C3%A1nh%20X%C3%A8o",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 15,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hải Sản Chín Mẫn",
    "address": "6 Xuân Diệu, P. Hải Cảng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.5,
    "reviewCount": 9,
    "likesCount": 102,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771968,
    "longitude": 109.243835,
    "lat": 13.771968,
    "lng": 109.243835,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbmkfxl81jt81@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbmkfxl81jt81@resize_ss640x400"
    ],
    "description": "Quán Hải Sản Chín Mẫn tọa lạc tại 6 Xuân Diệu, P. Hải Cảng, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hải Sản Chín Mẫn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3802055",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Sản Chín Mẫn",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-san-chin-man",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20S%E1%BA%A3n%20Ch%C3%ADn%20M%E1%BA%ABn",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 16,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo - Bánh Khọt",
    "address": "19 Hàn Thuyên, P. Hải Cảng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.9,
    "reviewCount": 3,
    "likesCount": 89,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775704,
    "longitude": 109.233318,
    "lat": 13.775704,
    "lng": 109.233318,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaip3bvtja34f@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaip3bvtja34f@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo - Bánh Khọt tọa lạc tại 19 Hàn Thuyên, P. Hải Cảng, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo - Bánh Khọt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3802192",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo - Bánh Khọt",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-banh-khot",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20-%20B%C3%A1nh%20Kh%E1%BB%8Dt",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 17,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hải Sản 7 Thơm",
    "address": "Lô 5 Hồ Biểu Chánh, P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1000m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.3,
    "reviewCount": 11,
    "likesCount": 118,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.790114,
    "longitude": 109.216149,
    "lat": 13.790114,
    "lng": 109.216149,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh21vcg2wux0c@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh21vcg2wux0c@resize_ss640x400"
    ],
    "description": "Quán Hải Sản 7 Thơm tọa lạc tại Lô 5 Hồ Biểu Chánh, P. Đống Đa, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hải Sản 7 Thơm cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3802329",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Sản 7 Thơm",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-san-7-thom",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20S%E1%BA%A3n%207%20Th%C6%A1m",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 18,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cháo Ếch Singapore Cay Nồng Thố Đất",
    "restaurant": "Cháo Ếch Singapore - Hai Bà Trưng",
    "address": "65 Hai Bà Trưng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "45.000đ - 75.000đ",
    "rating": 4.8,
    "reviewCount": 118,
    "likesCount": 444,
    "commentsCount": 23,
    "openTime": "06:00 - 21:30",
    "category": "comfort",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.77204,
    "longitude": 109.23189,
    "lat": 13.77204,
    "lng": 109.23189,
    "moodIds": [
      "comfort",
      "chill",
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
    "description": "Quán Cháo Ếch Singapore - Hai Bà Trưng tọa lạc tại 65 Hai Bà Trưng, phục vụ món Cháo Ếch Singapore Cay Nồng Thố Đất hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cháo Ếch Singapore Cay Nồng Thố Đất tại Cháo Ếch Singapore - Hai Bà Trưng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3802466",
    "menu": [
      {
        "name": "Cháo Ếch Singapore Cay Nồng Thố Đất",
        "price": "45.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cháo Ếch Singapore - Hai Bà Trưng",
        "price": "75.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 19,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hải Sản Bin Bin - Hải Sản Online",
    "address": "129/09 Nguyễn Huệ, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.7,
    "reviewCount": 4,
    "likesCount": 107,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.768939,
    "longitude": 109.230264,
    "lat": 13.768939,
    "lng": 109.230264,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgl338yvowr27@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgl338yvowr27@resize_ss640x400"
    ],
    "description": "Quán Hải Sản Bin Bin - Hải Sản Online tọa lạc tại 129/09 Nguyễn Huệ, P. Lê Lợi, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hải Sản Bin Bin - Hải Sản Online cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3802603",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Sản Bin Bin - Hải Sản Online",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-san-bin-bin-hai-san-online",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20S%E1%BA%A3n%20Bin%20Bin%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20Online",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 20,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hải Sản Hương Việt",
    "address": "122 Xuân Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.7,
    "reviewCount": 3,
    "likesCount": 9,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.769312,
    "longitude": 109.234051,
    "lat": 13.769312,
    "lng": 109.234051,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaqdxqv6dw921@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaqdxqv6dw921@resize_ss640x400"
    ],
    "description": "Quán Hải Sản Hương Việt tọa lạc tại 122 Xuân Diệu, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hải Sản Hương Việt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3802740",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Sản Hương Việt",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-san-huong-viet",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20S%E1%BA%A3n%20H%C6%B0%C6%A1ng%20Vi%E1%BB%87t",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
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
    "rating": 4.9,
    "reviewCount": 63,
    "likesCount": 194,
    "commentsCount": 12,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7864479988112,
    "longitude": 109.2201270908117,
    "lat": 13.7864479988112,
    "lng": 109.2201270908117,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "hotline": "0256 3802877",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 22,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Tôm Nhảy - Phước Sơn",
    "address": "122 Đống Đa, P. Thị Nại",
    "district": "Tp. Qui Nhơn",
    "distance": 0.5,
    "distanceText": "Cách bạn 500m",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 5.0,
    "reviewCount": 1,
    "likesCount": 13,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7842437,
    "longitude": 109.2236964,
    "lat": 13.7842437,
    "lng": 109.2236964,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "description": "Quán Bánh Xèo Tôm Nhảy - Phước Sơn tọa lạc tại 122 Đống Đa, P. Thị Nại, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Tôm Nhảy - Phước Sơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3803014",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Tôm Nhảy - Phước Sơn",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "5.0 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 23,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Mocktail Hoàng Hôn & Cà Phê Muối View Biển",
    "restaurant": "Surf Bar - Quy Nhơn Beach",
    "address": "Bờ Biển Quy Nhơn",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.7,
    "reviewCount": 66,
    "likesCount": 213,
    "commentsCount": 13,
    "openTime": "08:00 - 23:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7679391926649,
    "longitude": 109.2321896553039,
    "lat": 13.7679391926649,
    "lng": 109.2321896553039,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "date"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwda5e55rg0pcf@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwda5e55rg0pcf@resize_ss640x400"
    ],
    "description": "Quán Surf Bar - Quy Nhơn Beach tọa lạc tại Bờ Biển Quy Nhơn, phục vụ món Mocktail Hoàng Hôn & Cà Phê Muối View Biển hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Mocktail Hoàng Hôn & Cà Phê Muối View Biển tại Surf Bar - Quy Nhơn Beach cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3803151",
    "menu": [
      {
        "name": "Mocktail Hoàng Hôn & Cà Phê Muối View Biển",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Surf Bar - Quy Nhơn Beach",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/surf-bar-quy-nhon-beach",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Surf%20Bar%20-%20Quy%20Nh%C6%A1n%20Beach",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 24,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Mực - Xuân Diệu",
    "address": "70 Xuân Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 2.6,
    "distanceText": "Cách bạn 2.6km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 2,
    "likesCount": 26,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7717726287533,
    "longitude": 109.2417456954717,
    "lat": 13.7717726287533,
    "lng": 109.2417456954717,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9sgs23v17da0@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9sgs23v17da0@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Mực - Xuân Diệu tọa lạc tại 70 Xuân Diệu, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Mực - Xuân Diệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3803288",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Mực - Xuân Diệu",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 25,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Mocktail Hoàng Hôn & Cà Phê Muối View Biển",
    "restaurant": "S.Blue Restaurant & Bar",
    "address": "Quảng Trường Trung Tâm",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.5,
    "reviewCount": 88,
    "likesCount": 289,
    "commentsCount": 17,
    "openTime": "07:00 - 22:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.762282,
    "longitude": 109.221771,
    "lat": 13.762282,
    "lng": 109.221771,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "date"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9m0kl2uyu390@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9m0kl2uyu390@resize_ss640x400"
    ],
    "description": "Quán S.Blue Restaurant & Bar tọa lạc tại Quảng Trường Trung Tâm, phục vụ món Mocktail Hoàng Hôn & Cà Phê Muối View Biển hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Mocktail Hoàng Hôn & Cà Phê Muối View Biển tại S.Blue Restaurant & Bar cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3803425",
    "menu": [
      {
        "name": "Mocktail Hoàng Hôn & Cà Phê Muối View Biển",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt S.Blue Restaurant & Bar",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/sblue-restaurant-bar",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=S.Blue%20Restaurant%20%26%20Bar",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 26,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo - Nguyễn Thái Học",
    "address": "167A Nguyễn Thái Học",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.8,
    "reviewCount": 1,
    "likesCount": 33,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.769963,
    "longitude": 109.218026,
    "lat": 13.769963,
    "lng": 109.218026,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfzgbgtunyzcc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfzgbgtunyzcc@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo - Nguyễn Thái Học tọa lạc tại 167A Nguyễn Thái Học, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo - Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3803562",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo - Nguyễn Thái Học",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20-%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 27,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Bồng Bềnh - Hải Sản Tươi Sống",
    "address": "148 Hùng Vương",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.4,
    "reviewCount": 3,
    "likesCount": 44,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.786783,
    "longitude": 109.203352,
    "lat": 13.786783,
    "lng": 109.203352,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwav59wkv2l577@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwav59wkv2l577@resize_ss640x400"
    ],
    "description": "Quán Bồng Bềnh - Hải Sản Tươi Sống tọa lạc tại 148 Hùng Vương, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Bồng Bềnh - Hải Sản Tươi Sống cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3803699",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bồng Bềnh - Hải Sản Tươi Sống",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bong-benh-hai-san-tuoi-song",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%E1%BB%93ng%20B%E1%BB%81nh%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20T%C6%B0%C6%A1i%20S%E1%BB%91ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 28,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo",
    "address": "546 Nguyễn Thái Học, P. Quang Trung",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.4,
    "reviewCount": 2,
    "likesCount": 46,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7590087,
    "longitude": 109.211063,
    "lat": 13.7590087,
    "lng": 109.211063,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaqufxpq9y3d2@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaqufxpq9y3d2@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo tọa lạc tại 546 Nguyễn Thái Học, P. Quang Trung, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3803836",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 29,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Bình Dân",
    "address": "1 Phan Bội Châu",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 1,
    "likesCount": 48,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773633,
    "longitude": 109.236241,
    "lat": 13.773633,
    "lng": 109.236241,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdhzgx3fs2h3b@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdhzgx3fs2h3b@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Bình Dân tọa lạc tại 1 Phan Bội Châu, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Bình Dân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3803973",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Bình Dân",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-binh-dan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20B%C3%ACnh%20D%C3%A2n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 30,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Sisters Tavern & Pizzeria",
    "restaurant": "Sisters Tavern & Pizzeria",
    "address": "81 Hai Bà Trưng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.7,
    "reviewCount": 38,
    "likesCount": 164,
    "commentsCount": 7,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772134,
    "longitude": 109.230897,
    "lat": 13.772134,
    "lng": 109.230897,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwg47a1nesih5e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwg47a1nesih5e@resize_ss640x400"
    ],
    "description": "Quán Sisters Tavern & Pizzeria tọa lạc tại 81 Hai Bà Trưng, phục vụ món Đặc Sản Sisters Tavern & Pizzeria hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Sisters Tavern & Pizzeria tại Sisters Tavern & Pizzeria cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3804110",
    "menu": [
      {
        "name": "Đặc Sản Sisters Tavern & Pizzeria",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Sisters Tavern & Pizzeria",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/sisters-tavern-pizzeria",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Sisters%20Tavern%20%26%20Pizzeria",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 31,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Trà Sữa Nướng Trân Châu Đường Đen",
    "restaurant": "Trà Sữa Bobapop - Lê Lợi",
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
    "latitude": 13.775306,
    "longitude": 109.232149,
    "lat": 13.775306,
    "lng": 109.232149,
    "moodIds": [
      "budget",
      "chill",
      "date",
      "comfort",
      "craving",
      "budget"
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
    "description": "Quán Trà Sữa Bobapop - Lê Lợi tọa lạc tại 145 Lê Lợi, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại Trà Sữa Bobapop - Lê Lợi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 32,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Quán Thuỳ - Bún Rạm & Bún Chả Cá - Tăng Bạt Hổ",
    "address": "261 Tăng Bạt Hổ, P. Lý Thường Kiệt",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.7,
    "reviewCount": 34,
    "likesCount": 162,
    "commentsCount": 6,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7722456,
    "longitude": 109.2253797,
    "lat": 13.7722456,
    "lng": 109.2253797,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstrle4joe5502@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstrle4joe5502@resize_ss640x400"
    ],
    "description": "Quán Quán Thuỳ - Bún Rạm & Bún Chả Cá - Tăng Bạt Hổ tọa lạc tại 261 Tăng Bạt Hổ, P. Lý Thường Kiệt, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Quán Thuỳ - Bún Rạm & Bún Chả Cá - Tăng Bạt Hổ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3804384",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Thuỳ - Bún Rạm & Bún Chả Cá - Tăng Bạt Hổ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-thuy-bun-ram-bun-cha-ca-tang-bat-ho",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20Thu%E1%BB%B3%20-%20B%C3%BAn%20R%E1%BA%A1m%20%26%20B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20-%20T%C4%83ng%20B%E1%BA%A1t%20H%E1%BB%95",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 33,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo - 338 Nguyễn Thái Học",
    "address": "338 Nguyễn Thái Học",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.5,
    "reviewCount": 1,
    "likesCount": 68,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.766404,
    "longitude": 109.215669,
    "lat": 13.766404,
    "lng": 109.215669,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6z0jjjv1503@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa6z0jjjv1503@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo - 338 Nguyễn Thái Học tọa lạc tại 338 Nguyễn Thái Học, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo - 338 Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3804521",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo - 338 Nguyễn Thái Học",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-338-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20-%20338%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 34,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Giòn 69",
    "address": "69 Trương Vĩnh Ký, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.5,
    "reviewCount": 1,
    "likesCount": 73,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.788341,
    "longitude": 109.201943,
    "lat": 13.788341,
    "lng": 109.201943,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8e9hfp1wwrba@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8e9hfp1wwrba@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Giòn 69 tọa lạc tại 69 Trương Vĩnh Ký, P. Nhơn Bình, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Giòn 69 cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3804658",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Giòn 69",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-gion-69",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20Gi%C3%B2n%2069",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 35,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Mì Cay Naga Quy Nhơn",
    "restaurant": "Mì Cay Naga Quy Nhơn",
    "address": "51 Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.9,
    "reviewCount": 23,
    "likesCount": 144,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771024,
    "longitude": 109.22892,
    "lat": 13.771024,
    "lng": 109.22892,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwesx7w4ob899d@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwesx7w4ob899d@resize_ss640x400"
    ],
    "description": "Quán Mì Cay Naga Quy Nhơn tọa lạc tại 51 Lê Hồng Phong, phục vụ món Đặc Sản Mì Cay Naga Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Mì Cay Naga Quy Nhơn tại Mì Cay Naga Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3804795",
    "menu": [
      {
        "name": "Đặc Sản Mì Cay Naga Quy Nhơn",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mì Cay Naga Quy Nhơn",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/mi-cay-naga-quy-nhon",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%C3%AC%20Cay%20Naga%20Quy%20Nh%C6%A1n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
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
    "rating": 4.9,
    "reviewCount": 21,
    "likesCount": 143,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7741875,
    "longitude": 109.2331553,
    "lat": 13.7741875,
    "lng": 109.2331553,
    "moodIds": [
      "budget",
      "chill",
      "date",
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
    "hotline": "0256 3804932",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 37,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Nhà 1989",
    "address": "43 Mai Xuân Thưởng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1000m",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.8,
    "reviewCount": 22,
    "likesCount": 151,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775643,
    "longitude": 109.225928,
    "lat": 13.775643,
    "lng": 109.225928,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfemoj5yokb29@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfemoj5yokb29@resize_ss640x400"
    ],
    "description": "Quán Cơm Nhà 1989 tọa lạc tại 43 Mai Xuân Thưởng, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Nhà 1989 cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3805069",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Nhà 1989",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-nha-1989",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20Nh%C3%A0%201989",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 38,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Mocktail Hoàng Hôn & Cà Phê Muối View Biển",
    "restaurant": "Surf Bar 2 Cafe",
    "address": "Đường Xuân Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.4,
    "reviewCount": 47,
    "likesCount": 231,
    "commentsCount": 9,
    "openTime": "08:00 - 23:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.770476,
    "longitude": 109.235216,
    "lat": 13.770476,
    "lng": 109.235216,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "date"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdfzmn453vd5d@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdfzmn453vd5d@resize_ss640x400"
    ],
    "description": "Quán Surf Bar 2 Cafe tọa lạc tại Đường Xuân Diệu, phục vụ món Mocktail Hoàng Hôn & Cà Phê Muối View Biển hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Mocktail Hoàng Hôn & Cà Phê Muối View Biển tại Surf Bar 2 Cafe cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3805206",
    "menu": [
      {
        "name": "Mocktail Hoàng Hôn & Cà Phê Muối View Biển",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Surf Bar 2 Cafe",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/surf-bar-2-cafe",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Surf%20Bar%202%20Cafe",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 39,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Bobo Station - Trần Cao Vân",
    "restaurant": "Bobo Station - Trần Cao Vân",
    "address": "68 Trần Cao Vân",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.9,
    "reviewCount": 17,
    "likesCount": 146,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.774534,
    "longitude": 109.230299,
    "lat": 13.774534,
    "lng": 109.230299,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9snbo6zpp58e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9snbo6zpp58e@resize_ss640x400"
    ],
    "description": "Quán Bobo Station - Trần Cao Vân tọa lạc tại 68 Trần Cao Vân, phục vụ món Đặc Sản Bobo Station - Trần Cao Vân hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Bobo Station - Trần Cao Vân tại Bobo Station - Trần Cao Vân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3805343",
    "menu": [
      {
        "name": "Đặc Sản Bobo Station - Trần Cao Vân",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bobo Station - Trần Cao Vân",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bobo-station-tran-cao-van",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Bobo%20Station%20-%20Tr%E1%BA%A7n%20Cao%20V%C3%A2n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 40,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Nem Chả Lợi - Nem Nướng Quy Nhơn",
    "address": "113 Tăng Bạt Hổ",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.7,
    "reviewCount": 25,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773186,
    "longitude": 109.230414,
    "lat": 13.773186,
    "lng": 109.230414,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lu7nt2pmrs4173@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lu7nt2pmrs4173@resize_ss640x400"
    ],
    "description": "Quán Nem Chả Lợi - Nem Nướng Quy Nhơn tọa lạc tại 113 Tăng Bạt Hổ, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Nem Chả Lợi - Nem Nướng Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3805480",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Nem Chả Lợi - Nem Nướng Quy Nhơn",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 41,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Cô Xí",
    "address": "40 Đào Duy Từ",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.4,
    "reviewCount": 44,
    "likesCount": 137,
    "commentsCount": 8,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.777714,
    "longitude": 109.23033,
    "lat": 13.777714,
    "lng": 109.23033,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbf61ifu6e1e7@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbf61ifu6e1e7@resize_ss640x400"
    ],
    "description": "Quán Ốc Cô Xí tọa lạc tại 40 Đào Duy Từ, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Cô Xí cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3805617",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Cô Xí",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-co-xi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20C%C3%B4%20X%C3%AD",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
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
    "rating": 4.8,
    "reviewCount": 20,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "boba",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772256,
    "longitude": 109.241397,
    "lat": 13.772256,
    "lng": 109.241397,
    "moodIds": [
      "budget",
      "chill",
      "date",
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
    "hotline": "0256 3805754",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 43,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Cô Năm - Bánh Hỏi Lòng Heo",
    "address": "41 Nguyễn Chánh",
    "district": "Tp. Qui Nhơn",
    "distance": 0.5,
    "distanceText": "Cách bạn 450m",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.8,
    "reviewCount": 19,
    "likesCount": 72,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7830887,
    "longitude": 109.223902,
    "lat": 13.7830887,
    "lng": 109.223902,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8t4vebxz2x8e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8t4vebxz2x8e@resize_ss640x400"
    ],
    "description": "Quán Cô Năm - Bánh Hỏi Lòng Heo tọa lạc tại 41 Nguyễn Chánh, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Cô Năm - Bánh Hỏi Lòng Heo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3805891",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cô Năm - Bánh Hỏi Lòng Heo",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/co-nam-banh-hoi-long-heo",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C3%B4%20N%C4%83m%20-%20B%C3%A1nh%20H%E1%BB%8Fi%20L%C3%B2ng%20Heo",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 44,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Chảo Ngọc Liên - 63/13 Thanh Niên",
    "address": "63/13 Thanh Niên",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.3,
    "reviewCount": 1,
    "likesCount": 23,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7600796,
    "longitude": 109.2096217,
    "lat": 13.7600796,
    "lng": 109.2096217,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbsuridcwpb0@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbsuridcwpb0@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Chảo Ngọc Liên - 63/13 Thanh Niên tọa lạc tại 63/13 Thanh Niên, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Chảo Ngọc Liên - 63/13 Thanh Niên cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3806028",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Chảo Ngọc Liên - 63/13 Thanh Niên",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 45,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cà Phê Muối View Biển Ngắm Sóng",
    "restaurant": "Santorino Cafe",
    "address": "81 Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.3,
    "reviewCount": 48,
    "likesCount": 169,
    "commentsCount": 9,
    "openTime": "06:00 - 21:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.774424,
    "longitude": 109.225557,
    "lat": 13.774424,
    "lng": 109.225557,
    "moodIds": [
      "budget",
      "chill",
      "date",
      "comfort",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbg65a1las9dc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbg65a1las9dc@resize_ss640x400"
    ],
    "description": "Quán Santorino Cafe tọa lạc tại 81 Trần Phú, phục vụ món Cà Phê Muối View Biển Ngắm Sóng hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cà Phê Muối View Biển Ngắm Sóng tại Santorino Cafe cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3806165",
    "menu": [
      {
        "name": "Cà Phê Muối View Biển Ngắm Sóng",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Santorino Cafe",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/santorino-cafe",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Santorino%20Cafe",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 46,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Hảo Hảo",
    "address": "18 Ngọc Hân Công Chúa",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 26,
    "likesCount": 108,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7675365,
    "longitude": 109.2287291999999,
    "lat": 13.7675365,
    "lng": 109.2287291999999,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán Ốc Hảo Hảo tọa lạc tại 18 Ngọc Hân Công Chúa, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Hảo Hảo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3806302",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Hảo Hảo",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 47,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Trà Sữa Nướng Trân Châu Đường Đen",
    "restaurant": "View Coffee",
    "address": "417 - 419 Nguyễn Huệ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.7,
    "reviewCount": 21,
    "likesCount": 98,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.764015,
    "longitude": 109.223174,
    "lat": 13.764015,
    "lng": 109.223174,
    "moodIds": [
      "budget",
      "chill",
      "date",
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
    "hotline": "0256 3806439",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 48,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Mỹ Hạnh - Bún Tôm Rạm",
    "address": "32 Ngô Đức Đệ, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.9,
    "distanceText": "Cách bạn 2.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 25,
    "likesCount": 115,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7569079,
    "longitude": 109.2117565999999,
    "lat": 13.7569079,
    "lng": 109.2117565999999,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9jenxo168r3b@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9jenxo168r3b@resize_ss640x400"
    ],
    "description": "Quán Mỹ Hạnh - Bún Tôm Rạm tọa lạc tại 32 Ngô Đức Đệ, P. Nguyễn Văn Cừ, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Mỹ Hạnh - Bún Tôm Rạm cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3806576",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mỹ Hạnh - Bún Tôm Rạm",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/my-hanh-bun-tom-ram",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=My%CC%83%20Ha%CC%A3nh%20-%20Bu%CC%81n%20T%C3%B4m%20R%E1%BA%A1m",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 49,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cà Phê Muối View Biển Ngắm Sóng",
    "restaurant": "Green Cafe",
    "address": "43 Lê Thánh Tôn",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 25,
    "likesCount": 120,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772574,
    "longitude": 109.235104,
    "lat": 13.772574,
    "lng": 109.235104,
    "moodIds": [
      "budget",
      "chill",
      "date",
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
    "hotline": "0256 3806713",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 50,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Nhà Hàng Lộc Biển - Hải Sản Quy Nhơn - 48 Xuân Diệu",
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
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán Nhà Hàng Lộc Biển - Hải Sản Quy Nhơn - 48 Xuân Diệu tọa lạc tại 48 Xuân Diệu, P. Hải Cảng, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Nhà Hàng Lộc Biển - Hải Sản Quy Nhơn - 48 Xuân Diệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3806850",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 51,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hải Sản Sốt",
    "address": "318 Xuân Diệu, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7660288,
    "longitude": 109.2274533,
    "lat": 13.7660288,
    "lng": 109.2274533,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbw03mils4f6@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbw03mils4f6@resize_ss640x400"
    ],
    "description": "Quán Hải Sản Sốt tọa lạc tại 318 Xuân Diệu, P. Trần Phú, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hải Sản Sốt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3806987",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Sản Sốt",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-san-sot",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20S%E1%BA%A3n%20S%E1%BB%91t",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 52,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Mực Lá Nướng Sa Tế Muối Ớt Xanh",
    "restaurant": "Mực Khổng Lồ Quy Nhơn - Hải Sản Tươi Sống",
    "address": "166 Xuân Diệu, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7686091,
    "longitude": 109.2314572,
    "lat": 13.7686091,
    "lng": 109.2314572,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "hotline": "0256 3807124",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 53,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Mộc Đức Hải Sản & Đồng Quê - Cơm Gà, Lẩu Bò - 533 Đào Tấn",
    "address": "533 Đào Tấn, P. Nhơn Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 4.7,
    "distanceText": "Cách bạn 4.7km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.80581,
    "longitude": 109.18408,
    "lat": 13.80581,
    "lng": 109.18408,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m0r2hwzoilm585@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m0r2hwzoilm585@resize_ss640x400"
    ],
    "description": "Quán Mộc Đức Hải Sản & Đồng Quê - Cơm Gà, Lẩu Bò - 533 Đào Tấn tọa lạc tại 533 Đào Tấn, P. Nhơn Phú, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Mộc Đức Hải Sản & Đồng Quê - Cơm Gà, Lẩu Bò - 533 Đào Tấn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3807261",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mộc Đức Hải Sản & Đồng Quê - Cơm Gà, Lẩu Bò - 533 Đào Tấn",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/moc-duc-hai-san-dong-que-com-ga-lau-bo-533-dao-tan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%E1%BB%99c%20%C4%90%E1%BB%A9c%20H%E1%BA%A3i%20S%E1%BA%A3n%20%26%20%C4%90%E1%BB%93ng%20Qu%C3%AA%20-%20C%C6%A1m%20G%C3%A0%2C%20L%E1%BA%A9u%20B%C3%B2%20-%20533%20%C4%90%C3%A0o%20T%E1%BA%A5n",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 54,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Quán Chín Mẫn - Hải Sản - Xuân Diệu",
    "address": "86 Xuân Diệu, P. Hải Cảng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.9,
    "distanceText": "Cách bạn 2.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7717558,
    "longitude": 109.2447368,
    "lat": 13.7717558,
    "lng": 109.2447368,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lylu7iw24qshbe@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lylu7iw24qshbe@resize_ss640x400"
    ],
    "description": "Quán Quán Chín Mẫn - Hải Sản - Xuân Diệu tọa lạc tại 86 Xuân Diệu, P. Hải Cảng, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Quán Chín Mẫn - Hải Sản - Xuân Diệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3807398",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Chín Mẫn - Hải Sản - Xuân Diệu",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-chin-man-hai-san-xuan-dieu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20Ch%C3%ADn%20M%E1%BA%ABn%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20-%20Xu%C3%A2n%20Di%E1%BB%87u",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 55,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "QUÁN ANN FOODS - HẢI SẢN GIÁ GỐC - 22 ĐẶNG THÀNH TÍCH",
    "address": "22 Đặng Thành Tích, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7582555,
    "longitude": 109.2158433,
    "lat": 13.7582555,
    "lng": 109.2158433,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán QUÁN ANN FOODS - HẢI SẢN GIÁ GỐC - 22 ĐẶNG THÀNH TÍCH tọa lạc tại 22 Đặng Thành Tích, P. Nguyễn Văn Cừ, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại QUÁN ANN FOODS - HẢI SẢN GIÁ GỐC - 22 ĐẶNG THÀNH TÍCH cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3807535",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 56,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Quán Hải Sản Cô Xí - Đào Duy Từ",
    "address": "22 Đào Duy Từ, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.777389,
    "longitude": 109.230134,
    "lat": 13.777389,
    "lng": 109.230134,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m2jc45uda8xgc8@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m2jc45uda8xgc8@resize_ss640x400"
    ],
    "description": "Quán Quán Hải Sản Cô Xí - Đào Duy Từ tọa lạc tại 22 Đào Duy Từ, P. Trần Hưng Đạo, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Quán Hải Sản Cô Xí - Đào Duy Từ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3807672",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Hải Sản Cô Xí - Đào Duy Từ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-hai-san-co-xi-dao-duy-tu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20H%E1%BA%A3i%20S%E1%BA%A3n%20C%C3%B4%20X%C3%AD%20-%20%C4%90%C3%A0o%20Duy%20T%E1%BB%AB",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 57,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Lẩu Bò AKING - Lẩu Bò, Lẩu Hải Sản & Lẩu Dê",
    "address": "155 Bùi Xuân Phái, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7786365,
    "longitude": 109.2301664,
    "lat": 13.7786365,
    "lng": 109.2301664,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhvebd5u3d9a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhvebd5u3d9a@resize_ss640x400"
    ],
    "description": "Quán Lẩu Bò AKING - Lẩu Bò, Lẩu Hải Sản & Lẩu Dê tọa lạc tại 155 Bùi Xuân Phái, P. Trần Hưng Đạo, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Lẩu Bò AKING - Lẩu Bò, Lẩu Hải Sản & Lẩu Dê cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3807809",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Bò AKING - Lẩu Bò, Lẩu Hải Sản & Lẩu Dê",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 58,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Quán Nào - Hải Sản Tươi Sống - 28 Trần Văn Ơn",
    "address": "28 Trần Văn Ơn, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.9,
    "distanceText": "Cách bạn 2.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7560414,
    "longitude": 109.2150758,
    "lat": 13.7560414,
    "lng": 109.2150758,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvca2nf8pzt60@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvca2nf8pzt60@resize_ss640x400"
    ],
    "description": "Quán Quán Nào - Hải Sản Tươi Sống - 28 Trần Văn Ơn tọa lạc tại 28 Trần Văn Ơn, P. Nguyễn Văn Cừ, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Quán Nào - Hải Sản Tươi Sống - 28 Trần Văn Ơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3807946",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Nào - Hải Sản Tươi Sống - 28 Trần Văn Ơn",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-nao-hai-san-tuoi-song-28-tran-van-on",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20N%C3%A0o%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20T%C6%B0%C6%A1i%20S%E1%BB%91ng%20-%2028%20Tr%E1%BA%A7n%20V%C4%83n%20%C6%A0n",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 59,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Gà Ủ Muối Linh Nguyễn - Muối Chấm Gà & Muối Chấm Hải Sản - 511 Trần Hưng Đạo",
    "address": "511 Trần Hưng Đạo, P. Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 0.8,
    "distanceText": "Cách bạn 800m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7783953,
    "longitude": 109.2262592,
    "lat": 13.7783953,
    "lng": 109.2262592,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mfqgb811byfde1@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mfqgb811byfde1@resize_ss640x400"
    ],
    "description": "Quán Gà Ủ Muối Linh Nguyễn - Muối Chấm Gà & Muối Chấm Hải Sản - 511 Trần Hưng Đạo tọa lạc tại 511 Trần Hưng Đạo, P. Lê Hồng Phong, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Gà Ủ Muối Linh Nguyễn - Muối Chấm Gà & Muối Chấm Hải Sản - 511 Trần Hưng Đạo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3808083",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Gà Ủ Muối Linh Nguyễn - Muối Chấm Gà & Muối Chấm Hải Sản - 511 Trần Hưng Đạo",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ga-u-muoi-linh-nguyen-muoi-cham-ga-muoi-cham-hai-san-511-tran-hung-dao",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=G%C3%A0%20%E1%BB%A6%20Mu%E1%BB%91i%20Linh%20Nguy%E1%BB%85n%20-%20Mu%E1%BB%91i%20Ch%E1%BA%A5m%20G%C3%A0%20%26%20Mu%E1%BB%91i%20Ch%E1%BA%A5m%20H%E1%BA%A3i%20S%E1%BA%A3n%20-%20511%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 60,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Hải Sản Quốc Trang",
    "address": "20 Ngô Gia Tự",
    "district": "Tp. Qui Nhơn",
    "distance": 3.1,
    "distanceText": "Cách bạn 3.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.754487,
    "longitude": 109.214175,
    "lat": 13.754487,
    "lng": 109.214175,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwevrro879ax9f@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwevrro879ax9f@resize_ss640x400"
    ],
    "description": "Quán Hải Sản Quốc Trang tọa lạc tại 20 Ngô Gia Tự, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Hải Sản Quốc Trang cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3808220",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Sản Quốc Trang",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-san-quoc-trang",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20S%E1%BA%A3n%20Qu%E1%BB%91c%20Trang",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 61,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hải Sản Vi Vu",
    "address": "112 Xuân Diệu, P. Hải Cảng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.5,
    "distanceText": "Cách bạn 2.5km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 5,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771592,
    "longitude": 109.24041,
    "lat": 13.771592,
    "lng": 109.24041,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkfmqwpfixd0@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgkfmqwpfixd0@resize_ss640x400"
    ],
    "description": "Quán Hải Sản Vi Vu tọa lạc tại 112 Xuân Diệu, P. Hải Cảng, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hải Sản Vi Vu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3808357",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hải Sản Vi Vu",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hai-san-vi-vu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%E1%BA%A3i%20S%E1%BA%A3n%20Vi%20Vu",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 62,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Quán Ốc, Ăn Vặt & Giải Khát Cô Vy - 127 Mai Hắc Đế",
    "address": "127 Đường Mai Hắc Đế, P. Ghềnh Ráng",
    "district": "Tp. Qui Nhơn",
    "distance": 3.9,
    "distanceText": "Cách bạn 3.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 10,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.74801,
    "longitude": 109.20939,
    "lat": 13.74801,
    "lng": 109.20939,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mjw8ctr1y4g122@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-820l4-mjw8ctr1y4g122@resize_ss640x400"
    ],
    "description": "Quán Quán Ốc, Ăn Vặt & Giải Khát Cô Vy - 127 Mai Hắc Đế tọa lạc tại 127 Đường Mai Hắc Đế, P. Ghềnh Ráng, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Quán Ốc, Ăn Vặt & Giải Khát Cô Vy - 127 Mai Hắc Đế cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3808494",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Ốc, Ăn Vặt & Giải Khát Cô Vy - 127 Mai Hắc Đế",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-oc-an-vat-giai-khat-co-vy-127-mai-hac-de",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20%E1%BB%90c%2C%20%C4%82n%20V%E1%BA%B7t%20%26%20Gi%E1%BA%A3i%20Kh%C3%A1t%20C%C3%B4%20Vy%20-%20127%20Mai%20H%E1%BA%AFc%20%C4%90%E1%BA%BF",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 63,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Giòn A Tốt - Bánh Xèo Hoài Nhơn - 957 Trần Hưng Đạo",
    "address": "957 Trần Hưng Đạo, P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 0.4,
    "distanceText": "Cách bạn 400m",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 15,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.783671,
    "longitude": 109.216324,
    "lat": 13.783671,
    "lng": 109.216324,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "description": "Quán Bánh Xèo Giòn A Tốt - Bánh Xèo Hoài Nhơn - 957 Trần Hưng Đạo tọa lạc tại 957 Trần Hưng Đạo, P. Đống Đa, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Giòn A Tốt - Bánh Xèo Hoài Nhơn - 957 Trần Hưng Đạo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3808631",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Giòn A Tốt - Bánh Xèo Hoài Nhơn - 957 Trần Hưng Đạo",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 64,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "BÁNH XÈO QUY NHƠN - Trần Cao Vân",
    "address": "66 Trần Cao Vân, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 20,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7727929,
    "longitude": 109.2301606,
    "lat": 13.7727929,
    "lng": 109.2301606,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-m05batxrg99p83@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-m05batxrg99p83@resize_ss640x400"
    ],
    "description": "Quán BÁNH XÈO QUY NHƠN - Trần Cao Vân tọa lạc tại 66 Trần Cao Vân, P. Lê Lợi, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại BÁNH XÈO QUY NHƠN - Trần Cao Vân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3808768",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt BÁNH XÈO QUY NHƠN - Trần Cao Vân",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-quy-nhon-tran-cao-van",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%81NH%20X%C3%88O%20QUY%20NH%C6%A0N%20-%20Tr%E1%BA%A7n%20Cao%20V%C3%A2n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 65,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Căn Cá Ngừ, Bánh Xèo & Bún Cá Ngừ - Cô Phượng - 16 Lê Lợi Nối Dài",
    "address": "16 Lê Lợi Nối Dài",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 25,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7709053,
    "longitude": 109.2316893,
    "lat": 13.7709053,
    "lng": 109.2316893,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mgixe6f0lu6h9e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mgixe6f0lu6h9e@resize_ss640x400"
    ],
    "description": "Quán Bánh Căn Cá Ngừ, Bánh Xèo & Bún Cá Ngừ - Cô Phượng - 16 Lê Lợi Nối Dài tọa lạc tại 16 Lê Lợi Nối Dài, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Căn Cá Ngừ, Bánh Xèo & Bún Cá Ngừ - Cô Phượng - 16 Lê Lợi Nối Dài cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3808905",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Căn Cá Ngừ, Bánh Xèo & Bún Cá Ngừ - Cô Phượng - 16 Lê Lợi Nối Dài",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-can-ca-ngu-banh-xeo-bun-ca-ngu-co-phuong-16-le-loi-noi-dai",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20C%C4%83n%20C%C3%A1%20Ng%E1%BB%AB%2C%20B%C3%A1nh%20X%C3%A8o%20%26%20B%C3%BAn%20C%C3%A1%20Ng%E1%BB%AB%20-%20C%C3%B4%20Ph%C6%B0%E1%BB%A3ng%20-%2016%20L%C3%AA%20L%E1%BB%A3i%20N%E1%BB%91i%20D%C3%A0i",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 66,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Khoai Mì Nướng Tam Quan & Bánh Xèo Tôm Bình Định",
    "address": "162 Nguyễn Thái Học, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 30,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7724786,
    "longitude": 109.2183533,
    "lat": 13.7724786,
    "lng": 109.2183533,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxw9ovialf4r83@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxw9ovialf4r83@resize_ss640x400"
    ],
    "description": "Quán Bánh Khoai Mì Nướng Tam Quan & Bánh Xèo Tôm Bình Định tọa lạc tại 162 Nguyễn Thái Học, P. Ngô Mây, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Khoai Mì Nướng Tam Quan & Bánh Xèo Tôm Bình Định cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3809042",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Khoai Mì Nướng Tam Quan & Bánh Xèo Tôm Bình Định",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-khoai-mi-nuong-tam-quan-banh-xeo-tom-binh-dinh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20Khoai%20M%C3%AC%20N%C6%B0%E1%BB%9Bng%20Tam%20Quan%20%26%20B%C3%A1nh%20X%C3%A8o%20T%C3%B4m%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 67,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Cô Trang",
    "address": "28/6 Trần Bình Trọng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 35,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7718,
    "longitude": 109.235802,
    "lat": 13.7718,
    "lng": 109.235802,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvdaps0uwm15f@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvdaps0uwm15f@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Cô Trang tọa lạc tại 28/6 Trần Bình Trọng, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Cô Trang cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3809179",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Cô Trang",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-co-trang",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20C%C3%B4%20Trang",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 68,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Thái Hoà - Trần Đăng Phong",
    "address": "8 Trần Đăng Phong, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 40,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.758069,
    "longitude": 109.215483,
    "lat": 13.758069,
    "lng": 109.215483,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcwuy8txuh55@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcwuy8txuh55@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Thái Hoà - Trần Đăng Phong tọa lạc tại 8 Trần Đăng Phong, P. Nguyễn Văn Cừ, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Thái Hoà - Trần Đăng Phong cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3809316",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Thái Hoà - Trần Đăng Phong",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 69,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Quán Cô Phượng - Bánh Xèo & Nước Giải Khát",
    "address": "31 Phan Bội Châu, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 45,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7736302,
    "longitude": 109.2353054,
    "lat": 13.7736302,
    "lng": 109.2353054,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mv8gsrfp1f5uea@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mv8gsrfp1f5uea@resize_ss640x400"
    ],
    "description": "Quán Quán Cô Phượng - Bánh Xèo & Nước Giải Khát tọa lạc tại 31 Phan Bội Châu, P. Trần Hưng Đạo, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Quán Cô Phượng - Bánh Xèo & Nước Giải Khát cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3809453",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Cô Phượng - Bánh Xèo & Nước Giải Khát",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-co-phuong-banh-xeo-nuoc-giai-khat",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20C%C3%B4%20Ph%C6%B0%E1%BB%A3ng%20-%20B%C3%A1nh%20X%C3%A8o%20%26%20N%C6%B0%E1%BB%9Bc%20Gi%E1%BA%A3i%20Kh%C3%A1t",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 70,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Cô Sửu - 152 Đào Tấn",
    "address": "152 Đào Tấn, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 3.4,
    "distanceText": "Cách bạn 3.4km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 50,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7933611,
    "longitude": 109.19088,
    "lat": 13.7933611,
    "lng": 109.19088,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtbuhx00htl51e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtbuhx00htl51e@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Cô Sửu - 152 Đào Tấn tọa lạc tại 152 Đào Tấn, P. Nhơn Bình, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Cô Sửu - 152 Đào Tấn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3809590",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Cô Sửu - 152 Đào Tấn",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 71,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Tôm Nhảy Anh Tú",
    "address": "105 Đống Đa, P. Thị Nại",
    "district": "Tp. Qui Nhơn",
    "distance": 0.5,
    "distanceText": "Cách bạn 450m",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.783905,
    "longitude": 109.2235996,
    "lat": 13.783905,
    "lng": 109.2235996,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "description": "Quán Bánh Xèo Tôm Nhảy Anh Tú tọa lạc tại 105 Đống Đa, P. Thị Nại, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Tôm Nhảy Anh Tú cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3809727",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Tôm Nhảy Anh Tú",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 72,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Vỏ, Bánh Bèo, Bánh Tai Vạc - 579B Nguyễn Thái Học",
    "address": "579B Nguyễn Thái Học, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.758757,
    "longitude": 109.2108739,
    "lat": 13.758757,
    "lng": 109.2108739,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcigrr4j4423@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcigrr4j4423@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Vỏ, Bánh Bèo, Bánh Tai Vạc - 579B Nguyễn Thái Học tọa lạc tại 579B Nguyễn Thái Học, P. Nguyễn Văn Cừ, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Vỏ, Bánh Bèo, Bánh Tai Vạc - 579B Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3809864",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Vỏ, Bánh Bèo, Bánh Tai Vạc - 579B Nguyễn Thái Học",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-vo-banh-beo-banh-tai-vac-579b-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20V%E1%BB%8F%2C%20B%C3%A1nh%20B%C3%A8o%2C%20B%C3%A1nh%20Tai%20V%E1%BA%A1c%20-%20579B%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 73,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo HƯƠNG QUÊ - 1522 Hùng Vương",
    "address": "1522 Hùng Vương",
    "district": "Tp. Qui Nhơn",
    "distance": 7.2,
    "distanceText": "Cách bạn 7.2km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7938538,
    "longitude": 109.1544342,
    "lat": 13.7938538,
    "lng": 109.1544342,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mqx4gfqryb5t7a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mqx4gfqryb5t7a@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo HƯƠNG QUÊ - 1522 Hùng Vương tọa lạc tại 1522 Hùng Vương, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo HƯƠNG QUÊ - 1522 Hùng Vương cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3810001",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo HƯƠNG QUÊ - 1522 Hùng Vương",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-huong-que-1522-hung-vuong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20H%C6%AF%C6%A0NG%20QU%C3%8A%20-%201522%20H%C3%B9ng%20V%C6%B0%C6%A1ng",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 74,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Vỏ Cô Liễu",
    "address": "1, Huỳnh Tấn Phát",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.790153,
    "longitude": 109.212988,
    "lat": 13.790153,
    "lng": 109.212988,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mt3gq26o4vex02@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mt3gq26o4vex02@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Vỏ Cô Liễu tọa lạc tại 1, Huỳnh Tấn Phát, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Vỏ Cô Liễu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3810138",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Vỏ Cô Liễu",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-vo-co-lieu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20V%E1%BB%8F%20C%C3%B4%20Li%E1%BB%85u",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 75,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo & Bánh Căn",
    "address": "46 Nguyễn Công Trứ",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773733,
    "longitude": 109.225066,
    "lat": 13.773733,
    "lng": 109.225066,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbvu9uogcex07@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbvu9uogcex07@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo & Bánh Căn tọa lạc tại 46 Nguyễn Công Trứ, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo & Bánh Căn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3810275",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo & Bánh Căn",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-banh-can",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20%26%20B%C3%A1nh%20C%C4%83n",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 76,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Sáng",
    "address": "11A Nguyễn Tự Như",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.778622,
    "longitude": 109.236711,
    "lat": 13.778622,
    "lng": 109.236711,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwazddxzay1n21@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwazddxzay1n21@resize_ss640x400"
    ],
    "description": "Quán Bánh Xèo Sáng tọa lạc tại 11A Nguyễn Tự Như, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Sáng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3810412",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Sáng",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-sang",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20S%C3%A1ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 77,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo Chảo",
    "address": "164 Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.776223,
    "longitude": 109.23248,
    "lat": 13.776223,
    "lng": 109.23248,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "description": "Quán Bánh Xèo Chảo tọa lạc tại 164 Lê Lợi, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo Chảo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3810549",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo Chảo",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 78,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Canh, Bánh Bèo & Bánh Xèo - Cô Tuyết",
    "address": "429 Hoàng Văn Thụ, P. Quang Trung",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7722096,
    "longitude": 109.2177683,
    "lat": 13.7722096,
    "lng": 109.2177683,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mlkr07hx6y9w88@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mlkr07hx6y9w88@resize_ss640x400"
    ],
    "description": "Quán Bánh Canh, Bánh Bèo & Bánh Xèo - Cô Tuyết tọa lạc tại 429 Hoàng Văn Thụ, P. Quang Trung, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Canh, Bánh Bèo & Bánh Xèo - Cô Tuyết cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3810686",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Canh, Bánh Bèo & Bánh Xèo - Cô Tuyết",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-canh-banh-beo-banh-xeo-co-tuyet",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20Canh%2C%20B%C3%A1nh%20B%C3%A8o%20%26%20B%C3%A1nh%20X%C3%A8o%20-%20C%C3%B4%20Tuy%E1%BA%BFt",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 79,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Bánh Xèo - Duy Tân",
    "address": "2 Duy Tân",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.776928,
    "longitude": 109.231396,
    "lat": 13.776928,
    "lng": 109.231396,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "description": "Quán Bánh Xèo - Duy Tân tọa lạc tại 2 Duy Tân, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Bánh Xèo - Duy Tân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3810823",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Xèo - Duy Tân",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 80,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Tiệm Ăn 174 - Cơm Tấm, Bánh Xèo & Bánh Khọt",
    "address": "174 Thanh Niên, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.765299,
    "longitude": 109.214284,
    "lat": 13.765299,
    "lng": 109.214284,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-m05pc59slj0v6c@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-m05pc59slj0v6c@resize_ss640x400"
    ],
    "description": "Quán Tiệm Ăn 174 - Cơm Tấm, Bánh Xèo & Bánh Khọt tọa lạc tại 174 Thanh Niên, P. Ngô Mây, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Tiệm Ăn 174 - Cơm Tấm, Bánh Xèo & Bánh Khọt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3810960",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Tiệm Ăn 174 - Cơm Tấm, Bánh Xèo & Bánh Khọt",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/tiem-an-174-com-tam-banh-xeo-banh-khot",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ti%E1%BB%87m%20%C4%82n%20174%20-%20C%C6%A1m%20T%E1%BA%A5m%2C%20B%C3%A1nh%20X%C3%A8o%20%26%20B%C3%A1nh%20Kh%E1%BB%8Dt",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
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
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 5,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.765758,
    "longitude": 109.226471,
    "lat": 13.765758,
    "lng": 109.226471,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 82,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "QUÁN ĐÊM - Các Loại Hải Sản - Xuân Diệu",
    "address": "62 Xuân Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 3.2,
    "distanceText": "Cách bạn 3.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 10,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771432,
    "longitude": 109.2469029,
    "lat": 13.771432,
    "lng": 109.2469029,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgvhl1fwtzt63@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgvhl1fwtzt63@resize_ss640x400"
    ],
    "description": "Quán QUÁN ĐÊM - Các Loại Hải Sản - Xuân Diệu tọa lạc tại 62 Xuân Diệu, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại QUÁN ĐÊM - Các Loại Hải Sản - Xuân Diệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3811234",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt QUÁN ĐÊM - Các Loại Hải Sản - Xuân Diệu",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-dem-cac-loai-hai-san-xuan-dieu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=QU%C3%81N%20%C4%90%C3%8AM%20-%20C%C3%A1c%20Lo%E1%BA%A1i%20H%E1%BA%A3i%20S%E1%BA%A3n%20-%20Xu%C3%A2n%20Di%E1%BB%87u",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 83,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Rio Restaurant - Hải Sản Tươi Sống",
    "address": "2B Trần Độc",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 15,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.765443,
    "longitude": 109.225384,
    "lat": 13.765443,
    "lng": 109.225384,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwba7d5t2taz44@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwba7d5t2taz44@resize_ss640x400"
    ],
    "description": "Quán Rio Restaurant - Hải Sản Tươi Sống tọa lạc tại 2B Trần Độc, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Rio Restaurant - Hải Sản Tươi Sống cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3811371",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Rio Restaurant - Hải Sản Tươi Sống",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/rio-restaurant-hai-san-tuoi-song",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Rio%20Restaurant%20-%20H%E1%BA%A3i%20S%E1%BA%A3n%20T%C6%B0%C6%A1i%20S%E1%BB%91ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
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
    "rating": 4.9,
    "reviewCount": 13,
    "likesCount": 59,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.753454,
    "longitude": 109.210377,
    "lat": 13.753454,
    "lng": 109.210377,
    "moodIds": [
      "budget",
      "chill",
      "date",
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
    "hotline": "0256 3811508",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 85,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Combo Sashimi Cá Hồi & Sushi Thập Cẩm",
    "restaurant": "Nam Sushi - Ẩm Thực Nhật Bản",
    "address": "334A Diên Hồng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "90.000đ - 280.000đ",
    "rating": 4.3,
    "reviewCount": 39,
    "likesCount": 142,
    "commentsCount": 7,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.767189,
    "longitude": 109.220039,
    "lat": 13.767189,
    "lng": 109.220039,
    "moodIds": [
      "chill",
      "celebrate",
      "date",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh4ezu9g2qh24@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh4ezu9g2qh24@resize_ss640x400"
    ],
    "description": "Quán Nam Sushi - Ẩm Thực Nhật Bản tọa lạc tại 334A Diên Hồng, phục vụ món Combo Sashimi Cá Hồi & Sushi Thập Cẩm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Combo Sashimi Cá Hồi & Sushi Thập Cẩm tại Nam Sushi - Ẩm Thực Nhật Bản cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3811645",
    "menu": [
      {
        "name": "Combo Sashimi Cá Hồi & Sushi Thập Cẩm",
        "price": "90.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Nam Sushi - Ẩm Thực Nhật Bản",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/nam-sushi-am-thuc-nhat-ban",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Nam%20Sushi%20-%20%E1%BA%A8m%20Th%E1%BB%B1c%20Nh%E1%BA%ADt%20B%E1%BA%A3n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 86,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị",
    "restaurant": "Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị",
    "address": "489 An Dương Vương, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.6,
    "reviewCount": 22,
    "likesCount": 96,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.75671,
    "longitude": 109.218632,
    "lat": 13.75671,
    "lng": 109.218632,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhhagbhvzkp72@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwhhagbhvzkp72@resize_ss640x400"
    ],
    "description": "Quán Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị tọa lạc tại 489 An Dương Vương, P. Nguyễn Văn Cừ, phục vụ món Đặc Sản Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị tại Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3811782",
    "menu": [
      {
        "name": "Đặc Sản Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Nhà Hàng Hải Âu - Tiệc Cưới & Hội Nghị",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/nha-hang-hai-au-tiec-cuoi-hoi-nghi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Nh%C3%A0%20H%C3%A0ng%20H%E1%BA%A3i%20%C3%82u%20-%20Ti%E1%BB%87c%20C%C6%B0%E1%BB%9Bi%20%26%20H%E1%BB%99i%20Ngh%E1%BB%8B",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 87,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Tàu Hoa Hoa - Seafood Restaurant",
    "restaurant": "Tàu Hoa Hoa - Seafood Restaurant",
    "address": "3/8 Phan Chu Trinh",
    "district": "Tp. Qui Nhơn",
    "distance": 2.3,
    "distanceText": "Cách bạn 2.3km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.7,
    "reviewCount": 18,
    "likesCount": 89,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.777911,
    "longitude": 109.240818,
    "lat": 13.777911,
    "lng": 109.240818,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwcddelngt7d32@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwcddelngt7d32@resize_ss640x400"
    ],
    "description": "Quán Tàu Hoa Hoa - Seafood Restaurant tọa lạc tại 3/8 Phan Chu Trinh, phục vụ món Đặc Sản Tàu Hoa Hoa - Seafood Restaurant hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Tàu Hoa Hoa - Seafood Restaurant tại Tàu Hoa Hoa - Seafood Restaurant cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3811919",
    "menu": [
      {
        "name": "Đặc Sản Tàu Hoa Hoa - Seafood Restaurant",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Tàu Hoa Hoa - Seafood Restaurant",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/tau-hoa-hoa-seafood-restaurant",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=T%C3%A0u%20Hoa%20Hoa%20-%20Seafood%20Restaurant",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 88,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Trà Sữa Nướng Trân Châu Đường Đen",
    "restaurant": "Trà Sữa Pozaa Tea - Ngô Mây",
    "address": "44 Ngô Mây, P. Lý Thường Kiệt",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.9,
    "reviewCount": 12,
    "likesCount": 76,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
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
      "date",
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
      "#Boba",
      "#ShopeeFood",
      "#View_biển"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbq04btojizba@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbq04btojizba@resize_ss640x400"
    ],
    "description": "Quán Trà Sữa Pozaa Tea - Ngô Mây tọa lạc tại 44 Ngô Mây, P. Lý Thường Kiệt, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại Trà Sữa Pozaa Tea - Ngô Mây cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3812056",
    "menu": [
      {
        "name": "Trà Sữa Nướng Trân Châu Đường Đen",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Trà Sữa Pozaa Tea - Ngô Mây",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/tra-sua-pozaa-tea-ngo-may",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Tr%C3%A0%20S%E1%BB%AFa%20Pozaa%20Tea%20-%20Ng%C3%B4%20M%C3%A2y",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 89,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Face Quán - Các Món Ăn Vặt",
    "address": "29 Nguyễn Nhạc, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.8,
    "reviewCount": 14,
    "likesCount": 87,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763085,
    "longitude": 109.2183552,
    "lat": 13.763085,
    "lng": 109.2183552,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdg0i048xy310@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdg0i048xy310@resize_ss640x400"
    ],
    "description": "Quán Face Quán - Các Món Ăn Vặt tọa lạc tại 29 Nguyễn Nhạc, P. Ngô Mây, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Face Quán - Các Món Ăn Vặt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3812193",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Face Quán - Các Món Ăn Vặt",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 90,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản C.ine - Seafood Restaurant",
    "restaurant": "C.ine - Seafood Restaurant",
    "address": "92 Xuân Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.8,
    "reviewCount": 14,
    "likesCount": 92,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7688231,
    "longitude": 109.2319883,
    "lat": 13.7688231,
    "lng": 109.2319883,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgoi3sg8vkrde@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgoi3sg8vkrde@resize_ss640x400"
    ],
    "description": "Quán C.ine - Seafood Restaurant tọa lạc tại 92 Xuân Diệu, phục vụ món Đặc Sản C.ine - Seafood Restaurant hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản C.ine - Seafood Restaurant tại C.ine - Seafood Restaurant cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3812330",
    "menu": [
      {
        "name": "Đặc Sản C.ine - Seafood Restaurant",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt C.ine - Seafood Restaurant",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/cine-seafood-restaurant",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C.ine%20-%20Seafood%20Restaurant",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
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
    "rating": 4.4,
    "reviewCount": 29,
    "likesCount": 142,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "boba",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.777452,
    "longitude": 109.226657,
    "lat": 13.777452,
    "lng": 109.226657,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "hotline": "0256 3812467",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 92,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến",
    "restaurant": "Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến",
    "address": "5 An Dương Vương, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 3.0,
    "distanceText": "Cách bạn 3.0km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.8,
    "reviewCount": 13,
    "likesCount": 99,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7547,
    "longitude": 109.217105,
    "lat": 13.7547,
    "lng": 109.217105,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh1os8fgfkrd3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh1os8fgfkrd3@resize_ss640x400"
    ],
    "description": "Quán Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến tọa lạc tại 5 An Dương Vương, P. Nguyễn Văn Cừ, phục vụ món Đặc Sản Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến tại Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3812604",
    "menu": [
      {
        "name": "Đặc Sản Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Trung Tâm Hội Nghị - Tiệc Cưới Hoàng Yến",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/trung-tam-hoi-nghi-tiec-cuoi-hoang-yen",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Trung%20T%C3%A2m%20H%E1%BB%99i%20Ngh%E1%BB%8B%20-%20Ti%E1%BB%87c%20C%C6%B0%E1%BB%9Bi%20Ho%C3%A0ng%20Y%E1%BA%BFn",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 93,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cà Phê Muối View Biển Ngắm Sóng",
    "restaurant": "YQ Cafe",
    "address": "18 Trần Văn Ơn, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 3.0,
    "distanceText": "Cách bạn 3.0km",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.3,
    "reviewCount": 34,
    "likesCount": 167,
    "commentsCount": 6,
    "openTime": "06:00 - 21:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.755627,
    "longitude": 109.216066,
    "lat": 13.755627,
    "lng": 109.216066,
    "moodIds": [
      "budget",
      "chill",
      "date",
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
      "#Cafe",
      "#ShopeeFood",
      "#View_biển"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwer4q50cwd54b@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwer4q50cwd54b@resize_ss640x400"
    ],
    "description": "Quán YQ Cafe tọa lạc tại 18 Trần Văn Ơn, P. Nguyễn Văn Cừ, phục vụ món Cà Phê Muối View Biển Ngắm Sóng hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cà Phê Muối View Biển Ngắm Sóng tại YQ Cafe cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3812741",
    "menu": [
      {
        "name": "Cà Phê Muối View Biển Ngắm Sóng",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt YQ Cafe",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/yq-cafe",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=YQ%20Cafe",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 94,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cà Phê Muối View Biển Ngắm Sóng",
    "restaurant": "Chất Cafe - Since 2016",
    "address": "5 Nguyễn Lương Bằng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1.0km",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.4,
    "reviewCount": 27,
    "likesCount": 151,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773502,
    "longitude": 109.223148,
    "lat": 13.773502,
    "lng": 109.223148,
    "moodIds": [
      "budget",
      "chill",
      "date",
      "comfort",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwavd2kq3gt734@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwavd2kq3gt734@resize_ss640x400"
    ],
    "description": "Quán Chất Cafe - Since 2016 tọa lạc tại 5 Nguyễn Lương Bằng, phục vụ món Cà Phê Muối View Biển Ngắm Sóng hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cà Phê Muối View Biển Ngắm Sóng tại Chất Cafe - Since 2016 cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3812878",
    "menu": [
      {
        "name": "Cà Phê Muối View Biển Ngắm Sóng",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Chất Cafe - Since 2016",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/chat-cafe-since-2016",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ch%E1%BA%A5t%20Cafe%20-%20Since%202016",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 95,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Tiệm Bánh Tinh Hoa",
    "restaurant": "Tiệm Bánh Tinh Hoa",
    "address": "105 Trần Cao Vân, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.7,
    "reviewCount": 15,
    "likesCount": 120,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7722647,
    "longitude": 109.230476,
    "lat": 13.7722647,
    "lng": 109.230476,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "description": "Quán Tiệm Bánh Tinh Hoa tọa lạc tại 105 Trần Cao Vân, P. Lê Lợi, phục vụ món Đặc Sản Tiệm Bánh Tinh Hoa hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Tiệm Bánh Tinh Hoa tại Tiệm Bánh Tinh Hoa cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3813015",
    "menu": [
      {
        "name": "Đặc Sản Tiệm Bánh Tinh Hoa",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Tiệm Bánh Tinh Hoa",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 96,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bánh Canh Hẹ & Bún Mắt Cá - 169A Lê Lợi",
    "address": "169A Lê Lợi, P. Hải Cảng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.7,
    "reviewCount": 15,
    "likesCount": 125,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.776293,
    "longitude": 109.232385,
    "lat": 13.776293,
    "lng": 109.232385,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu48eu2hrq1f5@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu48eu2hrq1f5@resize_ss640x400"
    ],
    "description": "Quán Bánh Canh Hẹ & Bún Mắt Cá - 169A Lê Lợi tọa lạc tại 169A Lê Lợi, P. Hải Cảng, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bánh Canh Hẹ & Bún Mắt Cá - 169A Lê Lợi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3813152",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Canh Hẹ & Bún Mắt Cá - 169A Lê Lợi",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
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
    "latitude": 13.77175,
    "longitude": 109.224597,
    "lat": 13.77175,
    "lng": 109.224597,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "budget"
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 98,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Bún Bò Hẻm",
    "restaurant": "Bún Bò Hẻm",
    "address": "158 Diên Hồng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.6,
    "reviewCount": 16,
    "likesCount": 138,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.76864,
    "longitude": 109.220489,
    "lat": 13.76864,
    "lng": 109.220489,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "description": "Quán Bún Bò Hẻm tọa lạc tại 158 Diên Hồng, phục vụ món Đặc Sản Bún Bò Hẻm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Bún Bò Hẻm tại Bún Bò Hẻm cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3813426",
    "menu": [
      {
        "name": "Đặc Sản Bún Bò Hẻm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Bò Hẻm",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
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
    "rating": 4.5,
    "reviewCount": 18,
    "likesCount": 149,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763348,
    "longitude": 109.216545,
    "lat": 13.763348,
    "lng": 109.216545,
    "moodIds": [
      "budget",
      "chill",
      "date",
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
    "hotline": "0256 3813563",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
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
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.7,
    "reviewCount": 12,
    "likesCount": 36,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.768477,
    "longitude": 109.229078,
    "lat": 13.768477,
    "lng": 109.229078,
    "moodIds": [
      "comfort",
      "budget",
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
    "description": "Quán Cơm Tấm 173 tọa lạc tại 173 Nguyễn Huệ, phục vụ món Cơm Tấm Sườn Bì Chả Trứng Ốp La hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Tấm Sườn Bì Chả Trứng Ốp La tại Cơm Tấm 173 cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3813700",
    "menu": [
      {
        "name": "Cơm Tấm Sườn Bì Chả Trứng Ốp La",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Tấm 173",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 101,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Heekcaa Quy Nhơn",
    "restaurant": "Heekcaa Quy Nhơn",
    "address": "66 Trần Phú, TP Quy Nhơn",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.5,
    "reviewCount": 17,
    "likesCount": 56,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.774215,
    "longitude": 109.225739,
    "lat": 13.774215,
    "lng": 109.225739,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwarhj5zac4984@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwarhj5zac4984@resize_ss640x400"
    ],
    "description": "Quán Heekcaa Quy Nhơn tọa lạc tại 66 Trần Phú, TP Quy Nhơn, phục vụ món Đặc Sản Heekcaa Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Heekcaa Quy Nhơn tại Heekcaa Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3813837",
    "menu": [
      {
        "name": "Đặc Sản Heekcaa Quy Nhơn",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Heekcaa Quy Nhơn",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/heekcaa-quy-nhon",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Heekcaa%20Quy%20Nh%C6%A1n",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 102,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Combo Gà Rán Giòn Rụm & Khoai Tây Lắc",
    "restaurant": "Gà Rán KFC - Quy Nhơn",
    "address": "7 Lê Duẩn",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1.0km",
    "priceRange": "65.000đ - 120.000đ",
    "rating": 4.3,
    "reviewCount": 25,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773079,
    "longitude": 109.221887,
    "lat": 13.773079,
    "lng": 109.221887,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe15pzntxp540@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe15pzntxp540@resize_ss640x400"
    ],
    "description": "Quán Gà Rán KFC - Quy Nhơn tọa lạc tại 7 Lê Duẩn, phục vụ món Combo Gà Rán Giòn Rụm & Khoai Tây Lắc hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Combo Gà Rán Giòn Rụm & Khoai Tây Lắc tại Gà Rán KFC - Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3813974",
    "menu": [
      {
        "name": "Combo Gà Rán Giòn Rụm & Khoai Tây Lắc",
        "price": "65.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Gà Rán KFC - Quy Nhơn",
        "price": "120.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ga-ran-kfc-quy-nhon",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=G%C3%A0%20R%C3%A1n%20KFC%20-%20Quy%20Nh%C6%A1n",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
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
    "rating": 4.5,
    "reviewCount": 16,
    "likesCount": 63,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773982,
    "longitude": 109.225753,
    "lat": 13.773982,
    "lng": 109.225753,
    "moodIds": [
      "budget",
      "chill",
      "date",
      "comfort",
      "craving",
      "budget"
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
    "hotline": "0256 3814111",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 104,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Phá Lấu Ông Hiệu",
    "restaurant": "Phá Lấu Ông Hiệu",
    "address": "172 Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.5,
    "reviewCount": 16,
    "likesCount": 68,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775779,
    "longitude": 109.231684,
    "lat": 13.775779,
    "lng": 109.231684,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi9d8jvzy6x34@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi9d8jvzy6x34@resize_ss640x400"
    ],
    "description": "Quán Phá Lấu Ông Hiệu tọa lạc tại 172 Trần Hưng Đạo, phục vụ món Đặc Sản Phá Lấu Ông Hiệu hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Phá Lấu Ông Hiệu tại Phá Lấu Ông Hiệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3814248",
    "menu": [
      {
        "name": "Đặc Sản Phá Lấu Ông Hiệu",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Phá Lấu Ông Hiệu",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/pha-lau-ong-hieu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ph%C3%A1%20L%E1%BA%A5u%20%C3%94ng%20Hi%E1%BB%87u",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 105,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn",
    "restaurant": "Bò Né Phạm Gia - Trường Chinh",
    "address": "10 Trường Chinh",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.4,
    "reviewCount": 19,
    "likesCount": 82,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771927,
    "longitude": 109.223972,
    "lat": 13.771927,
    "lng": 109.223972,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaktywxsmhnce@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaktywxsmhnce@resize_ss640x400"
    ],
    "description": "Quán Bò Né Phạm Gia - Trường Chinh tọa lạc tại 10 Trường Chinh, phục vụ món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn tại Bò Né Phạm Gia - Trường Chinh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3814385",
    "menu": [
      {
        "name": "Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bò Né Phạm Gia - Trường Chinh",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 106,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Mậu",
    "address": "177 - 179 Phan Bội Châu",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.3,
    "reviewCount": 21,
    "likesCount": 93,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775904,
    "longitude": 109.229119,
    "lat": 13.775904,
    "lng": 109.229119,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9jtmm7qj8931@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9jtmm7qj8931@resize_ss640x400"
    ],
    "description": "Quán Cơm Mậu tọa lạc tại 177 - 179 Phan Bội Châu, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Mậu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3814522",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Mậu",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-mau",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20M%E1%BA%ADu",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 107,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "BBQ Garden",
    "address": "290 Xuân Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 5.0,
    "reviewCount": 5,
    "likesCount": 50,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.764945,
    "longitude": 109.226608,
    "lat": 13.764945,
    "lng": 109.226608,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "5.0 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 108,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Pizza Hải Sản Phô Mai Đút Lò",
    "restaurant": "H-P Pizza",
    "address": "139B Phan Bội Châu",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "95.000đ - 195.000đ",
    "rating": 4.5,
    "reviewCount": 14,
    "likesCount": 82,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775025,
    "longitude": 109.230796,
    "lat": 13.775025,
    "lng": 109.230796,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdabi35v00pf6@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdabi35v00pf6@resize_ss640x400"
    ],
    "description": "Quán H-P Pizza tọa lạc tại 139B Phan Bội Châu, phục vụ món Pizza Hải Sản Phô Mai Đút Lò hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Pizza Hải Sản Phô Mai Đút Lò tại H-P Pizza cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3814796",
    "menu": [
      {
        "name": "Pizza Hải Sản Phô Mai Đút Lò",
        "price": "95.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt H-P Pizza",
        "price": "195.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/h-p-pizza",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H-P%20Pizza",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 109,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá Phú Thịnh",
    "address": "12 Chương Dương",
    "district": "Tp. Qui Nhơn",
    "distance": 3.3,
    "distanceText": "Cách bạn 3.3km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.9,
    "reviewCount": 6,
    "likesCount": 63,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.752698,
    "longitude": 109.214149,
    "lat": 13.752698,
    "lng": 109.214149,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw96gf12tqs9c9@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw96gf12tqs9c9@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá Phú Thịnh tọa lạc tại 12 Chương Dương, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá Phú Thịnh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3814933",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá Phú Thịnh",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-phu-thinh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20Ph%C3%BA%20Th%E1%BB%8Bnh",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 110,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Trà Sữa Nướng Trân Châu Đường Đen",
    "restaurant": "The Palace Tea",
    "address": "132 Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.3,
    "reviewCount": 20,
    "likesCount": 110,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "cafe",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7751,
    "longitude": 109.2321,
    "lat": 13.7751,
    "lng": 109.2321,
    "moodIds": [
      "budget",
      "chill",
      "date",
      "comfort",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwc2ke0re9cre3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwc2ke0re9cre3@resize_ss640x400"
    ],
    "description": "Quán The Palace Tea tọa lạc tại 132 Lê Lợi, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại The Palace Tea cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3815070",
    "menu": [
      {
        "name": "Trà Sữa Nướng Trân Châu Đường Đen",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt The Palace Tea",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/the-palace-tea",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=The%20Palace%20Tea",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 111,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Hàn Quốc Restaurant",
    "address": "49 Hoàng Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.8,
    "reviewCount": 7,
    "likesCount": 76,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.769283,
    "longitude": 109.22351,
    "lat": 13.769283,
    "lng": 109.22351,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwet6gbq76cb49@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwet6gbq76cb49@resize_ss640x400"
    ],
    "description": "Quán Hàn Quốc Restaurant tọa lạc tại 49 Hoàng Diệu, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Hàn Quốc Restaurant cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3815207",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hàn Quốc Restaurant",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/han-quoc-restaurant",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=H%C3%A0n%20Qu%E1%BB%91c%20Restaurant",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
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
    "rating": 4.9,
    "reviewCount": 5,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7623377245288,
    "longitude": 109.2185637303653,
    "lat": 13.7623377245288,
    "lng": 109.2185637303653,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate"
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
    "hotline": "0256 3815344",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 113,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Trà Sữa Nướng Trân Châu Đường Đen",
    "restaurant": "Puppy Tea - Trà Sữa & Ăn Vặt",
    "address": "3 Trần Thị Kỷ",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.3,
    "reviewCount": 15,
    "likesCount": 110,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "boba",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7684032332517,
    "longitude": 109.220188781619,
    "lat": 13.7684032332517,
    "lng": 109.220188781619,
    "moodIds": [
      "budget",
      "chill",
      "date",
      "comfort",
      "craving",
      "budget"
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
    "description": "Quán Puppy Tea - Trà Sữa & Ăn Vặt tọa lạc tại 3 Trần Thị Kỷ, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại Puppy Tea - Trà Sữa & Ăn Vặt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3815481",
    "menu": [
      {
        "name": "Trà Sữa Nướng Trân Châu Đường Đen",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Puppy Tea - Trà Sữa & Ăn Vặt",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 114,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Trưa Tự Chọn 54",
    "address": "54 Mai Xuân Thưởng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1.0km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.8,
    "reviewCount": 5,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775931,
    "longitude": 109.226616,
    "lat": 13.775931,
    "lng": 109.226616,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8j9f57pl23c2@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8j9f57pl23c2@resize_ss640x400"
    ],
    "description": "Quán Cơm Trưa Tự Chọn 54 tọa lạc tại 54 Mai Xuân Thưởng, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Trưa Tự Chọn 54 cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3815618",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Trưa Tự Chọn 54",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-trua-tu-chon-54",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20Tr%C6%B0a%20T%E1%BB%B1%20Ch%E1%BB%8Dn%2054",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 115,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Chay Tâm Thiện",
    "address": "114 Tăng Bạt Hổ, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.7,
    "reviewCount": 6,
    "likesCount": 93,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7732484,
    "longitude": 109.2299044,
    "lat": 13.7732484,
    "lng": 109.2299044,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdt19h742qj7a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdt19h742qj7a@resize_ss640x400"
    ],
    "description": "Quán Cơm Chay Tâm Thiện tọa lạc tại 114 Tăng Bạt Hổ, P. Trần Hưng Đạo, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Chay Tâm Thiện cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3815755",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Chay Tâm Thiện",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 116,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi - Cháo Lòng - Cháo Lươn Anh Thư",
    "address": "144 Nguyễn Huệ, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.8,
    "reviewCount": 4,
    "likesCount": 92,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.764421,
    "longitude": 109.223418,
    "lat": 13.764421,
    "lng": 109.223418,
    "moodIds": [
      "comfort",
      "budget",
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
    "description": "Quán Bánh Hỏi - Cháo Lòng - Cháo Lươn Anh Thư tọa lạc tại 144 Nguyễn Huệ, P. Trần Phú, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi - Cháo Lòng - Cháo Lươn Anh Thư cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3815892",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi - Cháo Lòng - Cháo Lươn Anh Thư",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 117,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá 05",
    "address": "5 Phó Đức Chính",
    "district": "Tp. Qui Nhơn",
    "distance": 0.8,
    "distanceText": "Cách bạn 800m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.9,
    "reviewCount": 3,
    "likesCount": 94,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775986,
    "longitude": 109.223431,
    "lat": 13.775986,
    "lng": 109.223431,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwazbceowxqxc8@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwazbceowxqxc8@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá 05 tọa lạc tại 5 Phó Đức Chính, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá 05 cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3816029",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá 05",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-05",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%2005",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 118,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo",
    "restaurant": "Bánh Bèo - Diên Hồng",
    "address": "318 Diên Hồng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "20.000đ - 50.000đ",
    "rating": 4.9,
    "reviewCount": 3,
    "likesCount": 99,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763427,
    "longitude": 109.220185,
    "lat": 13.763427,
    "lng": 109.220185,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwcdlt26rxsr64@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwcdlt26rxsr64@resize_ss640x400"
    ],
    "description": "Quán Bánh Bèo - Diên Hồng tọa lạc tại 318 Diên Hồng, phục vụ món Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo tại Bánh Bèo - Diên Hồng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3816166",
    "menu": [
      {
        "name": "Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo",
        "price": "20.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Bèo - Diên Hồng",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-beo-dien-hong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20B%C3%A8o%20-%20Di%C3%AAn%20H%E1%BB%93ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 119,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Ẩm Thực Đậu - Bún Đậu Mắm Tôm - 24 Nguyễn Lữ",
    "address": "24 Nguyễn Lữ, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.5,
    "reviewCount": 6,
    "likesCount": 113,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7639012,
    "longitude": 109.2179268,
    "lat": 13.7639012,
    "lng": 109.2179268,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu7wliqqf2cee@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsu7wliqqf2cee@resize_ss640x400"
    ],
    "description": "Quán Ẩm Thực Đậu - Bún Đậu Mắm Tôm - 24 Nguyễn Lữ tọa lạc tại 24 Nguyễn Lữ, P. Ngô Mây, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Ẩm Thực Đậu - Bún Đậu Mắm Tôm - 24 Nguyễn Lữ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3816303",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ẩm Thực Đậu - Bún Đậu Mắm Tôm - 24 Nguyễn Lữ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 120,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Combo Sashimi Cá Hồi & Sushi Thập Cẩm",
    "restaurant": "NamSushi - Ẩm Thực Nhật Bản",
    "address": "334A Diên Hồng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "90.000đ - 280.000đ",
    "rating": 4.9,
    "reviewCount": 2,
    "likesCount": 6,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.762029,
    "longitude": 109.220463,
    "lat": 13.762029,
    "lng": 109.220463,
    "moodIds": [
      "chill",
      "celebrate",
      "date",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaikjk1ispl53@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaikjk1ispl53@resize_ss640x400"
    ],
    "description": "Quán NamSushi - Ẩm Thực Nhật Bản tọa lạc tại 334A Diên Hồng, phục vụ món Combo Sashimi Cá Hồi & Sushi Thập Cẩm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Combo Sashimi Cá Hồi & Sushi Thập Cẩm tại NamSushi - Ẩm Thực Nhật Bản cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3816440",
    "menu": [
      {
        "name": "Combo Sashimi Cá Hồi & Sushi Thập Cẩm",
        "price": "90.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt NamSushi - Ẩm Thực Nhật Bản",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/namsushi-am-thuc-nhat-ban",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=NamSushi%20-%20%E1%BA%A8m%20Th%E1%BB%B1c%20Nh%E1%BA%ADt%20B%E1%BA%A3n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 121,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Bếp Nhà 1989 - Cơm Ngon",
    "address": "159 Phan Bội Châu",
    "district": "Tp. Qui Nhơn",
    "distance": 1.3,
    "distanceText": "Cách bạn 1.3km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.5,
    "reviewCount": 5,
    "likesCount": 20,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775666,
    "longitude": 109.229531,
    "lat": 13.775666,
    "lng": 109.229531,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw98mux0bxllb3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw98mux0bxllb3@resize_ss640x400"
    ],
    "description": "Quán Bếp Nhà 1989 - Cơm Ngon tọa lạc tại 159 Phan Bội Châu, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Bếp Nhà 1989 - Cơm Ngon cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3816577",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bếp Nhà 1989 - Cơm Ngon",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bep-nha-1989-com-ngon",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%E1%BA%BFp%20Nh%C3%A0%201989%20-%20C%C6%A1m%20Ngon",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
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
    "latitude": 13.765231,
    "longitude": 109.219913,
    "lat": 13.765231,
    "lng": 109.219913,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 123,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Chay & Mì Quảng",
    "address": "82 Nguyễn Huệ",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.8,
    "reviewCount": 2,
    "likesCount": 21,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7688457805744,
    "longitude": 109.2295771837234,
    "lat": 13.7688457805744,
    "lng": 109.2295771837234,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Đặc_sản_Quy_Nhơn"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa64hvtcfdn55@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa64hvtcfdn55@resize_ss640x400"
    ],
    "description": "Quán Cơm Chay & Mì Quảng tọa lạc tại 82 Nguyễn Huệ, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Chay & Mì Quảng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3816851",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Chay & Mì Quảng",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-chay-mi-quang",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20Chay%20%26%20M%C3%AC%20Qu%E1%BA%A3ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 124,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Phá Lấu Ông Hiệu - Nguyễn Công Trứ",
    "address": "16 Nguyễn Công Trứ, P. Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 5.0,
    "reviewCount": 1,
    "likesCount": 23,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7742634,
    "longitude": 109.2260498,
    "lat": 13.7742634,
    "lng": 109.2260498,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcl78n10p00c@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcl78n10p00c@resize_ss640x400"
    ],
    "description": "Quán Phá Lấu Ông Hiệu - Nguyễn Công Trứ tọa lạc tại 16 Nguyễn Công Trứ, P. Lê Hồng Phong, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Phá Lấu Ông Hiệu - Nguyễn Công Trứ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3816988",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Phá Lấu Ông Hiệu - Nguyễn Công Trứ",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "5.0 ⭐ (1.000+ đã bán)"
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
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.5,
    "reviewCount": 4,
    "likesCount": 37,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.766377078743,
    "longitude": 109.2206638678908,
    "lat": 13.766377078743,
    "lng": 109.2206638678908,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgzk31e1xi319@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgzk31e1xi319@resize_ss640x400"
    ],
    "description": "Quán Bò Né 3 Ngon - Bò Quanh Lửa Hồng - Nguyễn Tư tọa lạc tại 32 Nguyễn Tư, phục vụ món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn tại Bò Né 3 Ngon - Bò Quanh Lửa Hồng - Nguyễn Tư cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3817125",
    "menu": [
      {
        "name": "Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bò Né 3 Ngon - Bò Quanh Lửa Hồng - Nguyễn Tư",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 126,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Gà Tuyết Nhung - Nguyễn Thái Học",
    "address": "320A Nguyễn Thái Học",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.4,
    "reviewCount": 5,
    "likesCount": 45,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.767073,
    "longitude": 109.216204,
    "lat": 13.767073,
    "lng": 109.216204,
    "moodIds": [
      "comfort",
      "budget",
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
    "description": "Quán Cơm Gà Tuyết Nhung - Nguyễn Thái Học tọa lạc tại 320A Nguyễn Thái Học, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Gà Tuyết Nhung - Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3817262",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Gà Tuyết Nhung - Nguyễn Thái Học",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 127,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá Cô Hạnh",
    "address": "126 Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.7,
    "reviewCount": 2,
    "likesCount": 41,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.774121,
    "longitude": 109.2381736,
    "lat": 13.774121,
    "lng": 109.2381736,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8jct2pbi6z7a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8jct2pbi6z7a@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá Cô Hạnh tọa lạc tại 126 Trần Hưng Đạo, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá Cô Hạnh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3817399",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá Cô Hạnh",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 128,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Vân - Bún Cá - Riêu & Sứa",
    "address": "336 Diên Hồng, P. Lý Thường Kiệt",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.7,
    "reviewCount": 2,
    "likesCount": 46,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7618014,
    "longitude": 109.2205487999999,
    "lat": 13.7618014,
    "lng": 109.2205487999999,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaw692kxu5556@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaw692kxu5556@resize_ss640x400"
    ],
    "description": "Quán Vân - Bún Cá - Riêu & Sứa tọa lạc tại 336 Diên Hồng, P. Lý Thường Kiệt, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Vân - Bún Cá - Riêu & Sứa cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3817536",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Vân - Bún Cá - Riêu & Sứa",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/van-bun-ca-rieu-sua",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=V%C3%A2n%20-%20B%C3%BAn%20C%C3%A1%20-%20Ri%C3%AAu%20%26%20S%E1%BB%A9a",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 129,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Kem Ý Gelato Tự Chọn Trái Cây Tươi",
    "restaurant": "An Thái Cà Phê Kem - Online",
    "address": "9 Phạm Phú Thứ, P. Hải Cảng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.9,
    "distanceText": "Cách bạn 2.9km",
    "priceRange": "25.000đ - 50.000đ",
    "rating": 4.9,
    "reviewCount": 1,
    "likesCount": 48,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "boba",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772397,
    "longitude": 109.2444717,
    "lat": 13.772397,
    "lng": 109.2444717,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbwzmgj6op98@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbwzmgj6op98@resize_ss640x400"
    ],
    "description": "Quán An Thái Cà Phê Kem - Online tọa lạc tại 9 Phạm Phú Thứ, P. Hải Cảng, phục vụ món Kem Ý Gelato Tự Chọn Trái Cây Tươi hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Kem Ý Gelato Tự Chọn Trái Cây Tươi tại An Thái Cà Phê Kem - Online cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3817673",
    "menu": [
      {
        "name": "Kem Ý Gelato Tự Chọn Trái Cây Tươi",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt An Thái Cà Phê Kem - Online",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/an-thai-ca-phe-kem-online",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=An%20Th%C3%A1i%20C%C3%A0%20Ph%C3%AA%20Kem%20-%20Online",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 130,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn",
    "restaurant": "Ăn Vặt Đà Lạt",
    "address": "59B Lý Thường Kiệt",
    "district": "Tp. Qui Nhơn",
    "distance": 0.9,
    "distanceText": "Cách bạn 900m",
    "priceRange": "20.000đ - 50.000đ",
    "rating": 4.9,
    "reviewCount": 1,
    "likesCount": 53,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.776605,
    "longitude": 109.225662,
    "lat": 13.776605,
    "lng": 109.225662,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbp5j9iye3f00@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbp5j9iye3f00@resize_ss640x400"
    ],
    "description": "Quán Ăn Vặt Đà Lạt tọa lạc tại 59B Lý Thường Kiệt, phục vụ món Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn tại Ăn Vặt Đà Lạt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3817810",
    "menu": [
      {
        "name": "Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn",
        "price": "20.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ăn Vặt Đà Lạt",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/an-vat-da-lat",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%82n%20V%E1%BA%B7t%20%C4%90%C3%A0%20L%E1%BA%A1t",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 131,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Điểm Tâm Sáng",
    "restaurant": "Điểm Tâm Sáng",
    "address": "20 Nguyễn Lữ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.9,
    "reviewCount": 1,
    "likesCount": 58,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763647,
    "longitude": 109.217604,
    "lat": 13.763647,
    "lng": 109.217604,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9sn0uwtdjv0c@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9sn0uwtdjv0c@resize_ss640x400"
    ],
    "description": "Quán Điểm Tâm Sáng tọa lạc tại 20 Nguyễn Lữ, phục vụ món Đặc Sản Điểm Tâm Sáng hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Điểm Tâm Sáng tại Điểm Tâm Sáng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3817947",
    "menu": [
      {
        "name": "Đặc Sản Điểm Tâm Sáng",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Điểm Tâm Sáng",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/diem-tam-sang",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%90i%E1%BB%83m%20T%C3%A2m%20S%C3%A1ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 132,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Bánh Canh Sâm",
    "restaurant": "Bánh Canh Sâm",
    "address": "33 Phan Bội Châu",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.9,
    "reviewCount": 1,
    "likesCount": 63,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773866,
    "longitude": 109.234614,
    "lat": 13.773866,
    "lng": 109.234614,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9c62y1z2sbdc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9c62y1z2sbdc@resize_ss640x400"
    ],
    "description": "Quán Bánh Canh Sâm tọa lạc tại 33 Phan Bội Châu, phục vụ món Đặc Sản Bánh Canh Sâm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Bánh Canh Sâm tại Bánh Canh Sâm cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3818084",
    "menu": [
      {
        "name": "Đặc Sản Bánh Canh Sâm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Canh Sâm",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-canh-sam",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20Canh%20S%C3%A2m",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.9 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 133,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Gỏi - Chả Ram & Nem Nướng - Phan Đình Phùng",
    "address": "47A1 Phan Đình Phùng",
    "district": "Tp. Qui Nhơn",
    "distance": 0.9,
    "distanceText": "Cách bạn 950m",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.4,
    "reviewCount": 4,
    "likesCount": 77,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7792758476064,
    "longitude": 109.2278954386711,
    "lat": 13.7792758476064,
    "lng": 109.2278954386711,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgzzystcl3t4b@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgzzystcl3t4b@resize_ss640x400"
    ],
    "description": "Quán Gỏi - Chả Ram & Nem Nướng - Phan Đình Phùng tọa lạc tại 47A1 Phan Đình Phùng, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Gỏi - Chả Ram & Nem Nướng - Phan Đình Phùng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3818221",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Gỏi - Chả Ram & Nem Nướng - Phan Đình Phùng",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/goi-cha-ram-nem-nuong-phan-dinh-phung",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=G%E1%BB%8Fi%20-%20Ch%E1%BA%A3%20Ram%20%26%20Nem%20N%C6%B0%E1%BB%9Bng%20-%20Phan%20%C4%90%C3%ACnh%20Ph%C3%B9ng",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 134,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá Thanh Ngân",
    "address": "Lô 43 - 44 Nguyễn Thị Định",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.3,
    "reviewCount": 5,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.757784,
    "longitude": 109.214199,
    "lat": 13.757784,
    "lng": 109.214199,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwagn8u28tln22@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwagn8u28tln22@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá Thanh Ngân tọa lạc tại Lô 43 - 44 Nguyễn Thị Định, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá Thanh Ngân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3818358",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá Thanh Ngân",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-thanh-ngan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20Thanh%20Ng%C3%A2n",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 135,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Kichi Kichi Lẩu Băng Chuyền - Nguyễn Thị Định",
    "address": "Lô 27 Nguyễn Thị Định , P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 2,
    "likesCount": 81,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.75825,
    "longitude": 109.214399,
    "lat": 13.75825,
    "lng": 109.214399,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "description": "Quán Kichi Kichi Lẩu Băng Chuyền - Nguyễn Thị Định tọa lạc tại Lô 27 Nguyễn Thị Định , P. Nguyễn Văn Cừ, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Kichi Kichi Lẩu Băng Chuyền - Nguyễn Thị Định cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3818495",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 136,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Chay Thanh Đạm & Lẩu Nấm Dưỡng Sinh",
    "restaurant": "Quán Chay Sáu Thu",
    "address": "79 Hai Bà Trưng, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "30.000đ - 70.000đ",
    "rating": 4.6,
    "reviewCount": 2,
    "likesCount": 86,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "healthy",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7723853,
    "longitude": 109.231501,
    "lat": 13.7723853,
    "lng": 109.231501,
    "moodIds": [
      "healthy",
      "comfort",
      "chill"
    ],
    "weather": [
      "sunny",
      "rainy",
      "hot"
    ],
    "weatherNote": "Quy Nhơn 24°C 🌧️",
    "tags": [
      "#Healthy",
      "#ShopeeFood",
      "#Đặc_sản_Quy_Nhơn"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwde058i0ct50c@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwde058i0ct50c@resize_ss640x400"
    ],
    "description": "Quán Quán Chay Sáu Thu tọa lạc tại 79 Hai Bà Trưng, P. Lê Lợi, phục vụ món Cơm Chay Thanh Đạm & Lẩu Nấm Dưỡng Sinh hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Chay Thanh Đạm & Lẩu Nấm Dưỡng Sinh tại Quán Chay Sáu Thu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3818632",
    "menu": [
      {
        "name": "Cơm Chay Thanh Đạm & Lẩu Nấm Dưỡng Sinh",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Chay Sáu Thu",
        "price": "70.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-chay-sau-thu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20Chay%20S%C3%A1u%20Thu",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 137,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Cơm & Nhậu Tiến Nguyễn - Hàm Nghi",
    "address": "138/1 Hàm Nghi, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.8,
    "reviewCount": 1,
    "likesCount": 88,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7684697,
    "longitude": 109.2187412,
    "lat": 13.7684697,
    "lng": 109.2187412,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m7nho842vvar6a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m7nho842vvar6a@resize_ss640x400"
    ],
    "description": "Quán Cơm & Nhậu Tiến Nguyễn - Hàm Nghi tọa lạc tại 138/1 Hàm Nghi, P. Ngô Mây, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Cơm & Nhậu Tiến Nguyễn - Hàm Nghi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3818769",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm & Nhậu Tiến Nguyễn - Hàm Nghi",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-nhau-tien-nguyen-ham-nghi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20%26%20Nh%E1%BA%ADu%20Ti%E1%BA%BFn%20Nguy%E1%BB%85n%20-%20H%C3%A0m%20Nghi",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 138,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bánh Hỏi - Cháo Lòng & Bún Chả Cá",
    "address": "42C Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.8,
    "reviewCount": 1,
    "likesCount": 93,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771625,
    "longitude": 109.231685,
    "lat": 13.771625,
    "lng": 109.231685,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh2lqv506hnb5@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwh2lqv506hnb5@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi - Cháo Lòng & Bún Chả Cá tọa lạc tại 42C Lê Lợi, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bánh Hỏi - Cháo Lòng & Bún Chả Cá cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3818906",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi - Cháo Lòng & Bún Chả Cá",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-bun-cha-ca",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20-%20Ch%C3%A1o%20L%C3%B2ng%20%26%20B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 139,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Mộc Châu - Bún Riêu & Bánh Hỏi Cháo Lòng",
    "address": "30 Chương Dương",
    "district": "Tp. Qui Nhơn",
    "distance": 3.3,
    "distanceText": "Cách bạn 3.3km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.8,
    "reviewCount": 1,
    "likesCount": 98,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.753029,
    "longitude": 109.213674,
    "lat": 13.753029,
    "lng": 109.213674,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9jqq6akpuj2a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9jqq6akpuj2a@resize_ss640x400"
    ],
    "description": "Quán Mộc Châu - Bún Riêu & Bánh Hỏi Cháo Lòng tọa lạc tại 30 Chương Dương, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Mộc Châu - Bún Riêu & Bánh Hỏi Cháo Lòng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3819043",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mộc Châu - Bún Riêu & Bánh Hỏi Cháo Lòng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/moc-chau-bun-rieu-banh-hoi-chao-long",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%E1%BB%99c%20Ch%C3%A2u%20-%20B%C3%BAn%20Ri%C3%AAu%20%26%20B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 140,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn",
    "restaurant": "Bún Bò Huế - Bò Né A Quỳnh",
    "address": "81/60 Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.8,
    "reviewCount": 1,
    "likesCount": 3,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.762857,
    "longitude": 109.21517,
    "lat": 13.762857,
    "lng": 109.21517,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstxsfqnb5qc90@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lstxsfqnb5qc90@resize_ss640x400"
    ],
    "description": "Quán Bún Bò Huế - Bò Né A Quỳnh tọa lạc tại 81/60 Ngô Mây, phục vụ món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn tại Bún Bò Huế - Bò Né A Quỳnh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3819180",
    "menu": [
      {
        "name": "Bò Né Trứng Ốp La Xíu Mại Bánh Mì Giòn",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Bò Huế - Bò Né A Quỳnh",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-bo-hue-bo-ne-a-quynh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20B%C3%B2%20Hu%E1%BA%BF%20-%20B%C3%B2%20N%C3%A9%20A%20Qu%E1%BB%B3nh",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 141,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Điểm Tâm Sáng - Bún",
    "restaurant": "Điểm Tâm Sáng - Bún",
    "address": "195 Trần Cao Vân",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.8,
    "reviewCount": 1,
    "likesCount": 8,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.776492,
    "longitude": 109.231118,
    "lat": 13.776492,
    "lng": 109.231118,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwap9gkvkau18b@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwap9gkvkau18b@resize_ss640x400"
    ],
    "description": "Quán Điểm Tâm Sáng - Bún tọa lạc tại 195 Trần Cao Vân, phục vụ món Đặc Sản Điểm Tâm Sáng - Bún hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Điểm Tâm Sáng - Bún tại Điểm Tâm Sáng - Bún cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3819317",
    "menu": [
      {
        "name": "Đặc Sản Điểm Tâm Sáng - Bún",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Điểm Tâm Sáng - Bún",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/diem-tam-sang-bun",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%90i%E1%BB%83m%20T%C3%A2m%20S%C3%A1ng%20-%20B%C3%BAn",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.8 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 142,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Quán Ăn Đêm - Bánh Canh & Bánh Khọt",
    "restaurant": "Quán Ăn Đêm - Bánh Canh & Bánh Khọt",
    "address": "3 Ngô Văn Sở",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.3,
    "reviewCount": 4,
    "likesCount": 22,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.764596,
    "longitude": 109.224196,
    "lat": 13.764596,
    "lng": 109.224196,
    "moodIds": [
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdhzb5txw4b9e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdhzb5txw4b9e@resize_ss640x400"
    ],
    "description": "Quán Quán Ăn Đêm - Bánh Canh & Bánh Khọt tọa lạc tại 3 Ngô Văn Sở, phục vụ món Đặc Sản Quán Ăn Đêm - Bánh Canh & Bánh Khọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Quán Ăn Đêm - Bánh Canh & Bánh Khọt tại Quán Ăn Đêm - Bánh Canh & Bánh Khọt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3819454",
    "menu": [
      {
        "name": "Đặc Sản Quán Ăn Đêm - Bánh Canh & Bánh Khọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Ăn Đêm - Bánh Canh & Bánh Khọt",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-an-dem-banh-canh-banh-khot",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20%C4%82n%20%C4%90%C3%AAm%20-%20B%C3%A1nh%20Canh%20%26%20B%C3%A1nh%20Kh%E1%BB%8Dt",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 143,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Combo Sashimi Cá Hồi & Sushi Thập Cẩm",
    "restaurant": "Sushi Haru - Quy Nhơn",
    "address": "150 Ỷ Lan",
    "district": "Tp. Qui Nhơn",
    "distance": 0.9,
    "distanceText": "Cách bạn 850m",
    "priceRange": "90.000đ - 280.000đ",
    "rating": 4.3,
    "reviewCount": 4,
    "likesCount": 27,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.782131,
    "longitude": 109.227693,
    "lat": 13.782131,
    "lng": 109.227693,
    "moodIds": [
      "chill",
      "celebrate",
      "date",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb8xfj8hq6xbf@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwb8xfj8hq6xbf@resize_ss640x400"
    ],
    "description": "Quán Sushi Haru - Quy Nhơn tọa lạc tại 150 Ỷ Lan, phục vụ món Combo Sashimi Cá Hồi & Sushi Thập Cẩm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Combo Sashimi Cá Hồi & Sushi Thập Cẩm tại Sushi Haru - Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3819591",
    "menu": [
      {
        "name": "Combo Sashimi Cá Hồi & Sushi Thập Cẩm",
        "price": "90.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Sushi Haru - Quy Nhơn",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/sushi-haru-quy-nhon",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Sushi%20Haru%20-%20Quy%20Nh%C6%A1n",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 144,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Tấm Sườn Bì Chả Trứng Ốp La",
    "restaurant": "Điểm Tâm Sáng - Cơm Tấm",
    "address": "90B Trần Cao Vân",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.5,
    "reviewCount": 2,
    "likesCount": 26,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.774365,
    "longitude": 109.230209,
    "lat": 13.774365,
    "lng": 109.230209,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwak9yoprftn94@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwak9yoprftn94@resize_ss640x400"
    ],
    "description": "Quán Điểm Tâm Sáng - Cơm Tấm tọa lạc tại 90B Trần Cao Vân, phục vụ món Cơm Tấm Sườn Bì Chả Trứng Ốp La hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Tấm Sườn Bì Chả Trứng Ốp La tại Điểm Tâm Sáng - Cơm Tấm cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3819728",
    "menu": [
      {
        "name": "Cơm Tấm Sườn Bì Chả Trứng Ốp La",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Điểm Tâm Sáng - Cơm Tấm",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/diem-tam-sang-com-tam",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%90i%E1%BB%83m%20T%C3%A2m%20S%C3%A1ng%20-%20C%C6%A1m%20T%E1%BA%A5m",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 145,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Biển Mai",
    "address": "21 Trần Cao Vân",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.7,
    "reviewCount": 1,
    "likesCount": 28,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7701307,
    "longitude": 109.2309377999999,
    "lat": 13.7701307,
    "lng": 109.2309377999999,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán Ốc Biển Mai tọa lạc tại 21 Trần Cao Vân, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Biển Mai cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3819865",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Biển Mai",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 146,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng",
    "address": "862 Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 0.4,
    "distanceText": "Cách bạn 450m",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.7,
    "reviewCount": 1,
    "likesCount": 33,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.780134,
    "longitude": 109.223193,
    "lat": 13.780134,
    "lng": 109.223193,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfbl0xqtvbvd7@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfbl0xqtvbvd7@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng tọa lạc tại 862 Trần Hưng Đạo, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3820002",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 147,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Chay Thanh Đạm & Lẩu Nấm Dưỡng Sinh",
    "restaurant": "Bún Chay & Bánh Cuốn Chay",
    "address": "40 Nguyễn Lữ, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "30.000đ - 70.000đ",
    "rating": 4.7,
    "reviewCount": 1,
    "likesCount": 38,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "healthy",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.764198,
    "longitude": 109.218114,
    "lat": 13.764198,
    "lng": 109.218114,
    "moodIds": [
      "healthy",
      "comfort",
      "chill"
    ],
    "weather": [
      "sunny",
      "rainy",
      "hot"
    ],
    "weatherNote": "Quy Nhơn 24°C 🌧️",
    "tags": [
      "#Healthy",
      "#ShopeeFood",
      "#Đặc_sản_Quy_Nhơn"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi6pkujej15ed@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi6pkujej15ed@resize_ss640x400"
    ],
    "description": "Quán Bún Chay & Bánh Cuốn Chay tọa lạc tại 40 Nguyễn Lữ, P. Ngô Mây, phục vụ món Cơm Chay Thanh Đạm & Lẩu Nấm Dưỡng Sinh hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Chay Thanh Đạm & Lẩu Nấm Dưỡng Sinh tại Bún Chay & Bánh Cuốn Chay cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3820139",
    "menu": [
      {
        "name": "Cơm Chay Thanh Đạm & Lẩu Nấm Dưỡng Sinh",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chay & Bánh Cuốn Chay",
        "price": "70.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-chay-banh-cuon-chay",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Chay%20%26%20B%C3%A1nh%20Cu%E1%BB%91n%20Chay",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 148,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Chay Thanh Tâm",
    "address": "13 Hai Bà Trưng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.7,
    "reviewCount": 1,
    "likesCount": 43,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771909,
    "longitude": 109.23457,
    "lat": 13.771909,
    "lng": 109.23457,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Đặc_sản_Quy_Nhơn"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa5xrdo6j89fa@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa5xrdo6j89fa@resize_ss640x400"
    ],
    "description": "Quán Cơm Chay Thanh Tâm tọa lạc tại 13 Hai Bà Trưng, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Chay Thanh Tâm cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3820276",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Chay Thanh Tâm",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-chay-thanh-tam",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20Chay%20Thanh%20T%C3%A2m",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 149,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn",
    "restaurant": "Ăn Vặt Nyna",
    "address": "18 Nguyễn Tất Thành",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1000m",
    "priceRange": "20.000đ - 50.000đ",
    "rating": 4.7,
    "reviewCount": 1,
    "likesCount": 48,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773437,
    "longitude": 109.222259,
    "lat": 13.773437,
    "lng": 109.222259,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf95fh5hyop3d@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf95fh5hyop3d@resize_ss640x400"
    ],
    "description": "Quán Ăn Vặt Nyna tọa lạc tại 18 Nguyễn Tất Thành, phục vụ món Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn tại Ăn Vặt Nyna cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3820413",
    "menu": [
      {
        "name": "Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn",
        "price": "20.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ăn Vặt Nyna",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/an-vat-nyna",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%82n%20V%E1%BA%B7t%20Nyna",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.7 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 150,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Pizza Hải Sản Phô Mai Đút Lò",
    "restaurant": "Buratino Pizza",
    "address": "98 Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "95.000đ - 195.000đ",
    "rating": 4.3,
    "reviewCount": 3,
    "likesCount": 59,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763218,
    "longitude": 109.217052,
    "lat": 13.763218,
    "lng": 109.217052,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwer1g511azd17@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwer1g511azd17@resize_ss640x400"
    ],
    "description": "Quán Buratino Pizza tọa lạc tại 98 Ngô Mây, phục vụ món Pizza Hải Sản Phô Mai Đút Lò hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Pizza Hải Sản Phô Mai Đút Lò tại Buratino Pizza cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3820550",
    "menu": [
      {
        "name": "Pizza Hải Sản Phô Mai Đút Lò",
        "price": "95.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Buratino Pizza",
        "price": "195.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/buratino-pizza",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Buratino%20Pizza",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 151,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo",
    "restaurant": "Bánh Bèo - Trần Thị Kỷ",
    "address": "31 - 35 Trần Thị Kỷ",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "20.000đ - 50.000đ",
    "rating": 4.4,
    "reviewCount": 2,
    "likesCount": 61,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.768376,
    "longitude": 109.221207,
    "lat": 13.768376,
    "lng": 109.221207,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwajyu2y8dsrc6@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwajyu2y8dsrc6@resize_ss640x400"
    ],
    "description": "Quán Bánh Bèo - Trần Thị Kỷ tọa lạc tại 31 - 35 Trần Thị Kỷ, phục vụ món Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo tại Bánh Bèo - Trần Thị Kỷ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3820687",
    "menu": [
      {
        "name": "Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo",
        "price": "20.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Bèo - Trần Thị Kỷ",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-beo-tran-thi-ky",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20B%C3%A8o%20-%20Tr%E1%BA%A7n%20Th%E1%BB%8B%20K%E1%BB%B7",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 152,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Phố - BBQ - Hot Pot & Beer",
    "address": "147 Nguyễn Tất Thành",
    "district": "Tp. Qui Nhơn",
    "distance": 0.3,
    "distanceText": "Cách bạn 350m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.4,
    "reviewCount": 2,
    "likesCount": 66,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.77945,
    "longitude": 109.221176,
    "lat": 13.77945,
    "lng": 109.221176,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw7jqijojtuj79@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw7jqijojtuj79@resize_ss640x400"
    ],
    "description": "Quán Ốc Phố - BBQ - Hot Pot & Beer tọa lạc tại 147 Nguyễn Tất Thành, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Phố - BBQ - Hot Pot & Beer cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3820824",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Phố - BBQ - Hot Pot & Beer",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-pho-bbq-hot-pot-beer",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Ph%E1%BB%91%20-%20BBQ%20-%20Hot%20Pot%20%26%20Beer",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 153,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Óc Heo & Xí Quách",
    "address": "6 Phạm Ngũ Lão",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 1,
    "likesCount": 68,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772036,
    "longitude": 109.219792,
    "lat": 13.772036,
    "lng": 109.219792,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi3qizn3i6za3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi3qizn3i6za3@resize_ss640x400"
    ],
    "description": "Quán Óc Heo & Xí Quách tọa lạc tại 6 Phạm Ngũ Lão, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Óc Heo & Xí Quách cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3820961",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Óc Heo & Xí Quách",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-heo-xi-quach",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C3%93c%20Heo%20%26%20X%C3%AD%20Qu%C3%A1ch",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 154,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng - Hàn Mặc Tử",
    "address": "32 Hàn Mặc Tử",
    "district": "Tp. Qui Nhơn",
    "distance": 4.0,
    "distanceText": "Cách bạn 4.0km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 1,
    "likesCount": 73,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.746718,
    "longitude": 109.213691,
    "lat": 13.746718,
    "lng": 109.213691,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwapck42dyhn1f@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwapck42dyhn1f@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng - Hàn Mặc Tử tọa lạc tại 32 Hàn Mặc Tử, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng - Hàn Mặc Tử cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3821098",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng - Hàn Mặc Tử",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-han-mac-tu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20H%C3%A0n%20M%E1%BA%B7c%20T%E1%BB%AD",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 155,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Chay Hiển Nam",
    "address": "30A Trần Thị Kỷ",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.6,
    "reviewCount": 1,
    "likesCount": 78,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.768776,
    "longitude": 109.2195,
    "lat": 13.768776,
    "lng": 109.2195,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe6fb5abcntc2@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe6fb5abcntc2@resize_ss640x400"
    ],
    "description": "Quán Cơm Chay Hiển Nam tọa lạc tại 30A Trần Thị Kỷ, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Chay Hiển Nam cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3821235",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Chay Hiển Nam",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 156,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Đặc Sản Quán Đêm - Nhậu Bình Dân",
    "restaurant": "Quán Đêm - Nhậu Bình Dân",
    "address": "139A Phan Bội Châu, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "35.000đ - 85.000đ",
    "rating": 4.6,
    "reviewCount": 1,
    "likesCount": 83,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775161,
    "longitude": 109.230507,
    "lat": 13.775161,
    "lng": 109.230507,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8y5vuxxhwbd9@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw8y5vuxxhwbd9@resize_ss640x400"
    ],
    "description": "Quán Quán Đêm - Nhậu Bình Dân tọa lạc tại 139A Phan Bội Châu, P. Trần Hưng Đạo, phục vụ món Đặc Sản Quán Đêm - Nhậu Bình Dân hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Đặc Sản Quán Đêm - Nhậu Bình Dân tại Quán Đêm - Nhậu Bình Dân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3821372",
    "menu": [
      {
        "name": "Đặc Sản Quán Đêm - Nhậu Bình Dân",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Đêm - Nhậu Bình Dân",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-dem-nhau-binh-dan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20%C4%90%C3%AAm%20-%20Nh%E1%BA%ADu%20B%C3%ACnh%20D%C3%A2n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 157,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng Cô Truyền",
    "address": "343 Nguyễn Thị Minh Khai, P.Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.3,
    "reviewCount": 2,
    "likesCount": 91,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7591586,
    "longitude": 109.2122637,
    "lat": 13.7591586,
    "lng": 109.2122637,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcqjs99fpga5@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcqjs99fpga5@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng Cô Truyền tọa lạc tại 343 Nguyễn Thị Minh Khai, P.Nguyễn Văn Cừ, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng Cô Truyền cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3821509",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng Cô Truyền",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-co-truyen",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20C%C3%B4%20Truy%E1%BB%81n",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 158,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Nem Nướng - Chả Nướng",
    "address": "7 Hải Thượng Lãn Ông, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.3,
    "reviewCount": 2,
    "likesCount": 96,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.766232,
    "longitude": 109.226147,
    "lat": 13.766232,
    "lng": 109.226147,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdtlz5bu4m3fc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwdtlz5bu4m3fc@resize_ss640x400"
    ],
    "description": "Quán Nem Nướng - Chả Nướng tọa lạc tại 7 Hải Thượng Lãn Ông, P. Trần Phú, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Nem Nướng - Chả Nướng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3821646",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Nem Nướng - Chả Nướng",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/nem-nuong-cha-nuong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Nem%20N%C6%B0%E1%BB%9Bng%20-%20Ch%E1%BA%A3%20N%C6%B0%E1%BB%9Bng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
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
    "latitude": 13.772205,
    "longitude": 109.231742,
    "lat": 13.772205,
    "lng": 109.231742,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 160,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Kem Ý Gelato Tự Chọn Trái Cây Tươi",
    "restaurant": "Ốc Um & Kem Flan",
    "address": "322 Nguyễn Thái Học, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "25.000đ - 50.000đ",
    "rating": 4.5,
    "reviewCount": 1,
    "likesCount": 3,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "boba",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.767022,
    "longitude": 109.216104,
    "lat": 13.767022,
    "lng": 109.216104,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoz15pbm5722@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoz15pbm5722@resize_ss640x400"
    ],
    "description": "Quán Ốc Um & Kem Flan tọa lạc tại 322 Nguyễn Thái Học, P. Ngô Mây, phục vụ món Kem Ý Gelato Tự Chọn Trái Cây Tươi hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Kem Ý Gelato Tự Chọn Trái Cây Tươi tại Ốc Um & Kem Flan cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3821920",
    "menu": [
      {
        "name": "Kem Ý Gelato Tự Chọn Trái Cây Tươi",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Um & Kem Flan",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-um-kem-flan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Um%20%26%20Kem%20Flan",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 161,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá - Nguyễn Huệ",
    "address": "325 Nguyễn Huệ, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.5,
    "reviewCount": 1,
    "likesCount": 8,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.766515,
    "longitude": 109.226187,
    "lat": 13.766515,
    "lng": 109.226187,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgktzq466l51a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgktzq466l51a@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá - Nguyễn Huệ tọa lạc tại 325 Nguyễn Huệ, P. Trần Phú, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá - Nguyễn Huệ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3822057",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá - Nguyễn Huệ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-nguyen-hue",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20-%20Nguy%E1%BB%85n%20Hu%E1%BB%87",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 162,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Gà Tre Đồng Quê - Tây Sơn Quán",
    "address": "214 Lê Thanh Nghị (Khu Nội Bộ), P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 1.3,
    "distanceText": "Cách bạn 1.3km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.5,
    "reviewCount": 1,
    "likesCount": 13,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7915237,
    "longitude": 109.2133988,
    "lat": 13.7915237,
    "lng": 109.2133988,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mjl28yer2pdtf9@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mjl28yer2pdtf9@resize_ss640x400"
    ],
    "description": "Quán Gà Tre Đồng Quê - Tây Sơn Quán tọa lạc tại 214 Lê Thanh Nghị (Khu Nội Bộ), P. Đống Đa, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Gà Tre Đồng Quê - Tây Sơn Quán cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3822194",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Gà Tre Đồng Quê - Tây Sơn Quán",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ga-tre-dong-que-tay-son-quan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=G%C3%A0%20Tre%20%C4%90%E1%BB%93ng%20Qu%C3%AA%20-%20T%C3%A2y%20S%C6%A1n%20Qu%C3%A1n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 163,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Tiệm Trà Sữa Nhà Bông - Bánh Tráng Trộn, Chả Cá & Ăn Vặt Các Loại",
    "address": "91, Lê Công Miên",
    "district": "Tp. Qui Nhơn",
    "distance": 4.8,
    "distanceText": "Cách bạn 4.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.5,
    "reviewCount": 1,
    "likesCount": 18,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.739465,
    "longitude": 109.21032,
    "lat": 13.739465,
    "lng": 109.21032,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mt6wbbpjncw7e4@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mt6wbbpjncw7e4@resize_ss640x400"
    ],
    "description": "Quán Tiệm Trà Sữa Nhà Bông - Bánh Tráng Trộn, Chả Cá & Ăn Vặt Các Loại tọa lạc tại 91, Lê Công Miên, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Tiệm Trà Sữa Nhà Bông - Bánh Tráng Trộn, Chả Cá & Ăn Vặt Các Loại cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3822331",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Tiệm Trà Sữa Nhà Bông - Bánh Tráng Trộn, Chả Cá & Ăn Vặt Các Loại",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/tiem-tra-sua-nha-bong-banh-trang-tron-cha-ca-an-vat-cac-loai",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ti%E1%BB%87m%20Tr%C3%A0%20S%E1%BB%AFa%20Nh%C3%A0%20B%C3%B4ng%20-%20B%C3%A1nh%20Tr%C3%A1ng%20Tr%E1%BB%99n%2C%20Ch%E1%BA%A3%20C%C3%A1%20%26%20%C4%82n%20V%E1%BA%B7t%20C%C3%A1c%20Lo%E1%BA%A1i",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 164,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Trà Sữa Nướng Trân Châu Đường Đen",
    "restaurant": "Ăn Vặt & Trà Sữa",
    "address": "24 Trần Quốc Toản",
    "district": "Tp. Qui Nhơn",
    "distance": 0.6,
    "distanceText": "Cách bạn 650m",
    "priceRange": "25.000đ - 55.000đ",
    "rating": 4.5,
    "reviewCount": 1,
    "likesCount": 23,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "boba",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.786367,
    "longitude": 109.215863,
    "lat": 13.786367,
    "lng": 109.215863,
    "moodIds": [
      "budget",
      "chill",
      "date",
      "comfort",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbvtqocsdzvaf@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbvtqocsdzvaf@resize_ss640x400"
    ],
    "description": "Quán Ăn Vặt & Trà Sữa tọa lạc tại 24 Trần Quốc Toản, phục vụ món Trà Sữa Nướng Trân Châu Đường Đen hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Trà Sữa Nướng Trân Châu Đường Đen tại Ăn Vặt & Trà Sữa cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3822468",
    "menu": [
      {
        "name": "Trà Sữa Nướng Trân Châu Đường Đen",
        "price": "25.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ăn Vặt & Trà Sữa",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/an-vat-tra-sua",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%82n%20V%E1%BA%B7t%20%26%20Tr%C3%A0%20S%E1%BB%AFa",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.5 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 165,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Quán Bún Chị Hoa - Nguyễn Huệ",
    "address": "89 Nguyễn Huệ, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.4,
    "reviewCount": 1,
    "likesCount": 28,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7693250675799,
    "longitude": 109.2313460866164,
    "lat": 13.7693250675799,
    "lng": 109.2313460866164,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8o6rttn1589@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwf8o6rttn1589@resize_ss640x400"
    ],
    "description": "Quán Quán Bún Chị Hoa - Nguyễn Huệ tọa lạc tại 89 Nguyễn Huệ, P. Trần Phú, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Quán Bún Chị Hoa - Nguyễn Huệ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3822605",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Bún Chị Hoa - Nguyễn Huệ",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-bun-chi-hoa-nguyen-hue",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20B%C3%BAn%20Ch%E1%BB%8B%20Hoa%20-%20Nguy%E1%BB%85n%20Hu%E1%BB%87",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 166,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
    "restaurant": "Cơm Chay An Lạc",
    "address": "6 Nguyễn Lữ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "40.000đ - 85.000đ",
    "rating": 4.4,
    "reviewCount": 1,
    "likesCount": 33,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "rice",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763719,
    "longitude": 109.217694,
    "lat": 13.763719,
    "lng": 109.217694,
    "moodIds": [
      "comfort",
      "budget",
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
    "description": "Quán Cơm Chay An Lạc tọa lạc tại 6 Nguyễn Lữ, phục vụ món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn tại Cơm Chay An Lạc cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3822742",
    "menu": [
      {
        "name": "Cơm Gà Xối Mỡ Da Giòn Rụm Quy Nhơn",
        "price": "40.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Chay An Lạc",
        "price": "85.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.4 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 167,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng - Hoàng Hoa Thám",
    "address": "90 Hoàng Hoa Thám",
    "district": "Tp. Qui Nhơn",
    "distance": 0.5,
    "distanceText": "Cách bạn 500m",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.3,
    "reviewCount": 1,
    "likesCount": 38,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.781439,
    "longitude": 109.224217,
    "lat": 13.781439,
    "lng": 109.224217,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoosf8ykt7bc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoosf8ykt7bc@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng - Hoàng Hoa Thám tọa lạc tại 90 Hoàng Hoa Thám, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng - Hoàng Hoa Thám cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3822879",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng - Hoàng Hoa Thám",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-hoang-hoa-tham",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20Ho%C3%A0ng%20Hoa%20Th%C3%A1m",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 168,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo",
    "restaurant": "Bánh Bèo & Bánh Lọc Bình Dân",
    "address": "129 Hoàng Quốc Việt",
    "district": "Tp. Qui Nhơn",
    "distance": 0.6,
    "distanceText": "Cách bạn 600m",
    "priceRange": "20.000đ - 50.000đ",
    "rating": 4.3,
    "reviewCount": 1,
    "likesCount": 43,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.781631,
    "longitude": 109.225318,
    "lat": 13.781631,
    "lng": 109.225318,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweopi5pc89n2f@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweopi5pc89n2f@resize_ss640x400"
    ],
    "description": "Quán Bánh Bèo & Bánh Lọc Bình Dân tọa lạc tại 129 Hoàng Quốc Việt, phục vụ món Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo tại Bánh Bèo & Bánh Lọc Bình Dân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3823016",
    "menu": [
      {
        "name": "Bánh Bèo Chén Tôm Chấy Nước Mắm Kẹo",
        "price": "20.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Bèo & Bánh Lọc Bình Dân",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-beo-banh-loc-binh-dan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20B%C3%A8o%20%26%20B%C3%A1nh%20L%E1%BB%8Dc%20B%C3%ACnh%20D%C3%A2n",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 169,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn",
    "restaurant": "Ăn Vặt Siu Siu",
    "address": "2 Trần Quang Diệu, P. Lý Thường Kiệt",
    "district": "Tp. Qui Nhơn",
    "distance": 0.9,
    "distanceText": "Cách bạn 900m",
    "priceRange": "20.000đ - 50.000đ",
    "rating": 4.3,
    "reviewCount": 1,
    "likesCount": 48,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.775509,
    "longitude": 109.224401,
    "lat": 13.775509,
    "lng": 109.224401,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwc2mlfr6guzbe@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwc2mlfr6guzbe@resize_ss640x400"
    ],
    "description": "Quán Ăn Vặt Siu Siu tọa lạc tại 2 Trần Quang Diệu, P. Lý Thường Kiệt, phục vụ món Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn tại Ăn Vặt Siu Siu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3823153",
    "menu": [
      {
        "name": "Chả Ram Tôm Đất & Bánh Mì Lagu Quy Nhơn",
        "price": "20.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ăn Vặt Siu Siu",
        "price": "50.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/an-vat-siu-siu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%82n%20V%E1%BA%B7t%20Siu%20Siu",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.3 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 170,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy & Chả Ram Tôm Đất Gia Vỹ",
    "restaurant": "Bánh Xèo Tôm Nhảy Gia Vỹ - Diên Hồng",
    "address": "14 Diên Hồng, P. Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.8,
    "reviewCount": 1850,
    "likesCount": 1240,
    "commentsCount": 182,
    "openTime": "06:30 - 22:00",
    "category": "specialty",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.773073,
    "longitude": 109.224855,
    "lat": 13.773073,
    "lng": 109.224855,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "energetic"
    ],
    "weather": [
      "sunny",
      "rainy",
      "hot"
    ],
    "weatherNote": "Quy Nhơn 24°C 🌧️",
    "tags": [
      "#Đặc_sản_Quy_Nhơn",
      "#Bánh_xèo_tôm_nhảy",
      "#Gia_Vỹ",
      "#ShopeeFood"
    ],
    "sideRibbon": [
      "#top1_đặc_sản",
      "#chuẩn_vị"
    ],
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "Bánh Xèo Tôm Nhảy Gia Vỹ nức tiếng xứ Nẫu tại 14 Diên Hồng. Bánh xèo tôm nhảy giòn tan, nước chấm chua ngọt ăn kèm rau mầm thanh mát chuẩn vị Quy Nhơn.",
    "recommendReason": "Thương hiệu bánh xèo tôm nhảy số 1 Quy Nhơn, tôm nhảy tươi tanh tách, vỏ bánh vàng giòn rụm!",
    "hotline": "0256 3823290",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Đặc Biệt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Bánh Xèo Bò & Mực Giòn",
        "price": "40.000đ",
        "highlight": false
      },
      {
        "name": "Chả Ram Tôm Đất Bình Định (Dĩa 10 cuốn)",
        "price": "50.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-xeo-tom-nhay-gia-vy-dien-hong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20X%C3%A8o%20T%C3%B4m%20Nh%E1%BA%A3y%20Gia%20V%E1%BB%B9",
    "deliveryTime": "15 - 25 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.8 ⭐ (1.500+ đã bán)"
  },
  {
    "id": 171,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Tê - 248 Xuân Diệu",
    "address": "248 Xuân Diệu, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7673884,
    "longitude": 109.2294808,
    "lat": 13.7673884,
    "lng": 109.2294808,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mecdl8978jk0dd@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-820l4-mecdl8978jk0dd@resize_ss640x400"
    ],
    "description": "Quán Ốc Tê - 248 Xuân Diệu tọa lạc tại 248 Xuân Diệu, P. Trần Phú, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Tê - 248 Xuân Diệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3823427",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Tê - 248 Xuân Diệu",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-te-248-xuan-dieu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20T%C3%AA%20-%20248%20Xu%C3%A2n%20Di%E1%BB%87u",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 172,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Quán Hẻm 97 - Lẩu Nướng & Cơm Gia Đình - 168 Nguyễn Thị Định",
    "address": "168 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7577766,
    "longitude": 109.2138665,
    "lat": 13.7577766,
    "lng": 109.2138665,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-mdpmgavz0pindf@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7ras8-mdpmgavz0pindf@resize_ss640x400"
    ],
    "description": "Quán Quán Hẻm 97 - Lẩu Nướng & Cơm Gia Đình - 168 Nguyễn Thị Định tọa lạc tại 168 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Quán Hẻm 97 - Lẩu Nướng & Cơm Gia Đình - 168 Nguyễn Thị Định cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3823564",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Hẻm 97 - Lẩu Nướng & Cơm Gia Đình - 168 Nguyễn Thị Định",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-hem-97-lau-nuong-com-gia-dinh-168-nguyen-thi-dinh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20H%E1%BA%BBm%2097%20-%20L%E1%BA%A9u%20N%C6%B0%E1%BB%9Bng%20%26%20C%C6%A1m%20Gia%20%C4%90%C3%ACnh%20-%20168%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20%C4%90%E1%BB%8Bnh",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 173,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Quán 3 Vương - 76 Phan Thúc Trực",
    "address": "76 Phan Thúc Trực, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7940125,
    "longitude": 109.2090085,
    "lat": 13.7940125,
    "lng": 109.2090085,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg61i3i1mqdrc5@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg61i3i1mqdrc5@resize_ss640x400"
    ],
    "description": "Quán Quán 3 Vương - 76 Phan Thúc Trực tọa lạc tại 76 Phan Thúc Trực, P. Nhơn Bình, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Quán 3 Vương - 76 Phan Thúc Trực cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3823701",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán 3 Vương - 76 Phan Thúc Trực",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-3-vuong-76-phan-thuc-truc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%203%20V%C6%B0%C6%A1ng%20-%2076%20Phan%20Th%C3%BAc%20Tr%E1%BB%B1c",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 174,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Ẩm Thực Bình Định - 17 Ngô Văn Sở",
    "address": "17 Ngô Văn Sở, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7642727,
    "longitude": 109.2244702,
    "lat": 13.7642727,
    "lng": 109.2244702,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mu264lvvljb725@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mu264lvvljb725@resize_ss640x400"
    ],
    "description": "Quán Ẩm Thực Bình Định - 17 Ngô Văn Sở tọa lạc tại 17 Ngô Văn Sở, P. Trần Phú, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Ẩm Thực Bình Định - 17 Ngô Văn Sở cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3823838",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ẩm Thực Bình Định - 17 Ngô Văn Sở",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/am-thuc-binh-dinh-17-ngo-van-so",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BA%A8m%20Th%E1%BB%B1c%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh%20-%2017%20Ng%C3%B4%20V%C4%83n%20S%E1%BB%9F",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 175,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Linh Linh Ông 9 - Cơm Tấm, Bún & Mì Cay",
    "address": "3, Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.769069,
    "longitude": 109.231401,
    "lat": 13.769069,
    "lng": 109.231401,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mnm7bqxk1ber54@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mnm7bqxk1ber54@resize_ss640x400"
    ],
    "description": "Quán Linh Linh Ông 9 - Cơm Tấm, Bún & Mì Cay tọa lạc tại 3, Lê Lợi, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Linh Linh Ông 9 - Cơm Tấm, Bún & Mì Cay cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3823975",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Linh Linh Ông 9 - Cơm Tấm, Bún & Mì Cay",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/linh-linh-ong-9-com-tam-bun-mi-cay",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Linh%20Linh%20%C3%94ng%209%20-%20C%C6%A1m%20T%E1%BA%A5m%2C%20B%C3%BAn%20%26%20M%C3%AC%20Cay",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 176,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hami Thaifood - 06 Nguyễn Trung Tín",
    "address": "6 Nguyễn Trung Tín, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 3.0,
    "distanceText": "Cách bạn 3.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.755709,
    "longitude": 109.2138451,
    "lat": 13.755709,
    "lng": 109.2138451,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvdiwdtqljt66@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvdiwdtqljt66@resize_ss640x400"
    ],
    "description": "Quán Hami Thaifood - 06 Nguyễn Trung Tín tọa lạc tại 6 Nguyễn Trung Tín, P. Nguyễn Văn Cừ, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hami Thaifood - 06 Nguyễn Trung Tín cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3824112",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hami Thaifood - 06 Nguyễn Trung Tín",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/hami-thaifood-06-nguyen-trung-tin",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Hami%20Thaifood%20-%2006%20Nguy%E1%BB%85n%20Trung%20T%C3%ADn",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 177,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Liêm Kaa Quán - Hoàng Văn Thụ",
    "address": "413 Hoàng Văn Thụ, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7718215,
    "longitude": 109.2174268,
    "lat": 13.7718215,
    "lng": 109.2174268,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m11e746uiobj93@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m11e746uiobj93@resize_ss640x400"
    ],
    "description": "Quán Liêm Kaa Quán - Hoàng Văn Thụ tọa lạc tại 413 Hoàng Văn Thụ, P. Ngô Mây, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Liêm Kaa Quán - Hoàng Văn Thụ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3824249",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Liêm Kaa Quán - Hoàng Văn Thụ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/liem-kaa-quan-hoang-van-thu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Li%C3%AAm%20Kaa%20Qu%C3%A1n%20-%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 178,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "GenZ Quy Nhơn - Ăn Nhậu, Lẩu & Nướng - 37 Nguyễn Huệ",
    "address": "37 Nguyễn Huệ, P. Hải Cảng",
    "district": "Tp. Qui Nhơn",
    "distance": 2.4,
    "distanceText": "Cách bạn 2.4km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772017,
    "longitude": 109.2398803,
    "lat": 13.772017,
    "lng": 109.2398803,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mgai4ocm8ft619@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mgai4ocm8ft619@resize_ss640x400"
    ],
    "description": "Quán GenZ Quy Nhơn - Ăn Nhậu, Lẩu & Nướng - 37 Nguyễn Huệ tọa lạc tại 37 Nguyễn Huệ, P. Hải Cảng, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại GenZ Quy Nhơn - Ăn Nhậu, Lẩu & Nướng - 37 Nguyễn Huệ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3824386",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt GenZ Quy Nhơn - Ăn Nhậu, Lẩu & Nướng - 37 Nguyễn Huệ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/genz-quy-nhon-an-nhau-lau-nuong-37-nguyen-hue",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=GenZ%20Quy%20Nh%C6%A1n%20-%20%C4%82n%20Nh%E1%BA%ADu%2C%20L%E1%BA%A9u%20%26%20N%C6%B0%E1%BB%9Bng%20-%2037%20Nguy%E1%BB%85n%20Hu%E1%BB%87",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 179,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Mì Cay Sasin Quy Nhơn - Lê Hồng Phong",
    "address": "244 - 246 Lê Hồng Phong, P.Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7745331,
    "longitude": 109.2274192,
    "lat": 13.7745331,
    "lng": 109.2274192,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lz4c6pptt26l46@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lz4c6pptt26l46@resize_ss640x400"
    ],
    "description": "Quán Mì Cay Sasin Quy Nhơn - Lê Hồng Phong tọa lạc tại 244 - 246 Lê Hồng Phong, P.Trần Hưng Đạo, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Mì Cay Sasin Quy Nhơn - Lê Hồng Phong cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3824523",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mì Cay Sasin Quy Nhơn - Lê Hồng Phong",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 180,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Hannam Korean Food - 138 Ngô Mây",
    "address": "138 Ngô Mây, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7643519,
    "longitude": 109.215697,
    "lat": 13.7643519,
    "lng": 109.215697,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mhn6zrqirif6a5@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-820l4-mhn6zrqirif6a5@resize_ss640x400"
    ],
    "description": "Quán Hannam Korean Food - 138 Ngô Mây tọa lạc tại 138 Ngô Mây, P. Nguyễn Văn Cừ, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Hannam Korean Food - 138 Ngô Mây cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3824660",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hannam Korean Food - 138 Ngô Mây",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 181,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Thoa - 02 Bà Triệu",
    "address": "2 Bà Triệu, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 5,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7715242,
    "longitude": 109.227921,
    "lat": 13.7715242,
    "lng": 109.227921,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "description": "Quán Ốc Thoa - 02 Bà Triệu tọa lạc tại 2 Bà Triệu, P. Trần Phú, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Thoa - 02 Bà Triệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3824797",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Thoa - 02 Bà Triệu",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 182,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Thuý Kiều - 5D Tăng Bạt Hổ",
    "address": "5D Tăng Bạt Hổ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 10,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7728169,
    "longitude": 109.2370773,
    "lat": 13.7728169,
    "lng": 109.2370773,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m3ncaxupyfgcea@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m3ncaxupyfgcea@resize_ss640x400"
    ],
    "description": "Quán Ốc Thuý Kiều - 5D Tăng Bạt Hổ tọa lạc tại 5D Tăng Bạt Hổ, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Thuý Kiều - 5D Tăng Bạt Hổ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3824934",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Thuý Kiều - 5D Tăng Bạt Hổ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-thuy-kieu-5d-tang-bat-ho",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Thu%C3%BD%20Ki%E1%BB%81u%20-%205D%20T%C4%83ng%20B%E1%BA%A1t%20H%E1%BB%95",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 183,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Quyên - Võ Thị Yến",
    "address": "96 Võ Thị Yến, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 3.1,
    "distanceText": "Cách bạn 3.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 15,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7543266,
    "longitude": 109.2136731,
    "lat": 13.7543266,
    "lng": 109.2136731,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m3k5201sv9cxef@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m3k5201sv9cxef@resize_ss640x400"
    ],
    "description": "Quán Ốc Quyên - Võ Thị Yến tọa lạc tại 96 Võ Thị Yến, P. Nguyễn Văn Cừ, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Quyên - Võ Thị Yến cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3825071",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Quyên - Võ Thị Yến",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-quyen-vo-thi-yen",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Quy%C3%AAn%20-%20V%C3%B5%20Th%E1%BB%8B%20Y%E1%BA%BFn",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 184,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Bụp - 36 Lê Văn Thủ",
    "address": "36 Lê Văn Thủ, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 3.4,
    "distanceText": "Cách bạn 3.4km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 20,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7958881,
    "longitude": 109.1917545,
    "lat": 13.7958881,
    "lng": 109.1917545,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán Ốc Bụp - 36 Lê Văn Thủ tọa lạc tại 36 Lê Văn Thủ, P. Nhơn Bình, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Bụp - 36 Lê Văn Thủ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3825208",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Bụp - 36 Lê Văn Thủ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 185,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Quán Ốc Nón - 35 Lý Thái Tổ",
    "address": "35 Lý Thái Tổ, P. Quang Trung",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 25,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7592693,
    "longitude": 109.2091719,
    "lat": 13.7592693,
    "lng": 109.2091719,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán Quán Ốc Nón - 35 Lý Thái Tổ tọa lạc tại 35 Lý Thái Tổ, P. Quang Trung, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Quán Ốc Nón - 35 Lý Thái Tổ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3825345",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Ốc Nón - 35 Lý Thái Tổ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 186,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Mẹt Quy Nhơn - Xuân Diệu",
    "address": "316 Xuân Diệu, P.Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 30,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7660375,
    "longitude": 109.2275382,
    "lat": 13.7660375,
    "lng": 109.2275382,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán Ốc Mẹt Quy Nhơn - Xuân Diệu tọa lạc tại 316 Xuân Diệu, P.Trần Phú, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Mẹt Quy Nhơn - Xuân Diệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3825482",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Mẹt Quy Nhơn - Xuân Diệu",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 187,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Biển Hai Lan - Lê Thanh Nghị",
    "address": "165 Lê Thanh Nghị, P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 0.9,
    "distanceText": "Cách bạn 900m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 35,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7891529,
    "longitude": 109.2162073,
    "lat": 13.7891529,
    "lng": 109.2162073,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "description": "Quán Ốc Biển Hai Lan - Lê Thanh Nghị tọa lạc tại 165 Lê Thanh Nghị, P. Đống Đa, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Biển Hai Lan - Lê Thanh Nghị cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3825619",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Biển Hai Lan - Lê Thanh Nghị",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 188,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Quán Ốc Cô Út",
    "address": "78 Võ Thị Yến, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 3.1,
    "distanceText": "Cách bạn 3.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 40,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7546859,
    "longitude": 109.2141207,
    "lat": 13.7546859,
    "lng": 109.2141207,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvby38wjr8937@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvby38wjr8937@resize_ss640x400"
    ],
    "description": "Quán Quán Ốc Cô Út tọa lạc tại 78 Võ Thị Yến, P. Nguyễn Văn Cừ, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Quán Ốc Cô Út cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3825756",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Ốc Cô Út",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-oc-co-ut",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qua%CC%81n%20%E1%BB%90c%20C%C3%B4%20U%CC%81t",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 189,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Đợi Tý 2 - Phan Bá Vành",
    "address": "12 Phan Bá Vành, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 45,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7891354,
    "longitude": 109.2028654,
    "lat": 13.7891354,
    "lng": 109.2028654,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mghh6dxn9zpm4d@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-820l4-mghh6dxn9zpm4d@resize_ss640x400"
    ],
    "description": "Quán Ốc Đợi Tý 2 - Phan Bá Vành tọa lạc tại 12 Phan Bá Vành, P. Nhơn Bình, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Đợi Tý 2 - Phan Bá Vành cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3825893",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Đợi Tý 2 - Phan Bá Vành",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-doi-ty-2-phan-ba-vanh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20%C4%90%E1%BB%A3i%20T%C3%BD%202%20-%20Phan%20B%C3%A1%20V%C3%A0nh",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 190,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Đồng Giá - Võ Mười",
    "address": "66 Võ Mười, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 50,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7674909,
    "longitude": 109.2188022,
    "lat": 13.7674909,
    "lng": 109.2188022,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc6elmiqhlf6@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc6elmiqhlf6@resize_ss640x400"
    ],
    "description": "Quán Ốc Đồng Giá - Võ Mười tọa lạc tại 66 Võ Mười, P. Ngô Mây, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Đồng Giá - Võ Mười cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3826030",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Đồng Giá - Võ Mười",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-dong-gia-vo-muoi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20%C4%90%E1%BB%93ng%20Gi%C3%A1%20-%20V%C3%B5%20M%C6%B0%E1%BB%9Di",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 191,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Quán Ốc Chang Chang - 73 Trần Bình Trọng",
    "address": "73 Trần Bình Trọng, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7738282,
    "longitude": 109.236536,
    "lat": 13.7738282,
    "lng": 109.236536,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán Quán Ốc Chang Chang - 73 Trần Bình Trọng tọa lạc tại 73 Trần Bình Trọng, P. Lê Lợi, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Quán Ốc Chang Chang - 73 Trần Bình Trọng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3826167",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Ốc Chang Chang - 73 Trần Bình Trọng",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 192,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Bún Ốc Rêu Cá - 55 Trần Phú",
    "address": "55 Trần Phú, P.Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7743227,
    "longitude": 109.2256317,
    "lat": 13.7743227,
    "lng": 109.2256317,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcjdraup3td0@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcjdraup3td0@resize_ss640x400"
    ],
    "description": "Quán Bún Ốc Rêu Cá - 55 Trần Phú tọa lạc tại 55 Trần Phú, P.Lê Hồng Phong, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Bún Ốc Rêu Cá - 55 Trần Phú cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3826304",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Ốc Rêu Cá - 55 Trần Phú",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-oc-reu-ca-55-tran-phu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20%E1%BB%90c%20R%C3%AAu%20C%C3%A1%20-%2055%20Tr%E1%BA%A7n%20Ph%C3%BA",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 193,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Bún Riêu Ốc Cá - Trần Hưng Đạo",
    "address": "147D Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.77444,
    "longitude": 109.2358,
    "lat": 13.77444,
    "lng": 109.2358,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcdpk5o7fda6@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcdpk5o7fda6@resize_ss640x400"
    ],
    "description": "Quán Bún Riêu Ốc Cá - Trần Hưng Đạo tọa lạc tại 147D Trần Hưng Đạo, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Bún Riêu Ốc Cá - Trần Hưng Đạo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3826441",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Riêu Ốc Cá - Trần Hưng Đạo",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 194,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Quán Ốc Cô Thỏ",
    "address": "93 Đường Chế Lan Viên, P. Ghềnh Ráng",
    "district": "Tp. Qui Nhơn",
    "distance": 4.2,
    "distanceText": "Cách bạn 4.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.745318,
    "longitude": 109.209595,
    "lat": 13.745318,
    "lng": 109.209595,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m91mj7ko2p3bf6@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m91mj7ko2p3bf6@resize_ss640x400"
    ],
    "description": "Quán Quán Ốc Cô Thỏ tọa lạc tại 93 Đường Chế Lan Viên, P. Ghềnh Ráng, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Quán Ốc Cô Thỏ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3826578",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Ốc Cô Thỏ",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-oc-co-tho",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20%E1%BB%90c%20C%C3%B4%20Th%E1%BB%8F",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 195,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Quán Phở & Cơm Gà - ỐC VIỆT CHILL",
    "address": "8 Trần Đăng Phong, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7582719,
    "longitude": 109.2155061,
    "lat": 13.7582719,
    "lng": 109.2155061,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mnpyqywxe9dvd6@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mnpyqywxe9dvd6@resize_ss640x400"
    ],
    "description": "Quán Quán Phở & Cơm Gà - ỐC VIỆT CHILL tọa lạc tại 8 Trần Đăng Phong, P. Nhơn Bình, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Quán Phở & Cơm Gà - ỐC VIỆT CHILL cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3826715",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Phở & Cơm Gà - ỐC VIỆT CHILL",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-pho-com-ga-oc-viet-chill",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20Ph%E1%BB%9F%20%26%20C%C6%A1m%20G%C3%A0%20-%20%E1%BB%90C%20VI%E1%BB%86T%20CHILL",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 196,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Má Heo Nướng, Óc Heo & Món Bình Dân - Bốn Thu Quán - 91 Sư Đoàn 3 Sao Vàng",
    "address": "91 Sư Đoàn 3 Sao Vàng, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7925467,
    "longitude": 109.2067676,
    "lat": 13.7925467,
    "lng": 109.2067676,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mln3a7pptybzf9@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mln3a7pptybzf9@resize_ss640x400"
    ],
    "description": "Quán Má Heo Nướng, Óc Heo & Món Bình Dân - Bốn Thu Quán - 91 Sư Đoàn 3 Sao Vàng tọa lạc tại 91 Sư Đoàn 3 Sao Vàng, P. Nhơn Bình, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Má Heo Nướng, Óc Heo & Món Bình Dân - Bốn Thu Quán - 91 Sư Đoàn 3 Sao Vàng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3826852",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Má Heo Nướng, Óc Heo & Món Bình Dân - Bốn Thu Quán - 91 Sư Đoàn 3 Sao Vàng",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ma-heo-nuong-oc-heo-mon-binh-dan-bon-thu-quan-91-su-doan-3-sao-vang",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%C3%A1%20Heo%20N%C6%B0%E1%BB%9Bng%2C%20%C3%93c%20Heo%20%26%20M%C3%B3n%20B%C3%ACnh%20D%C3%A2n%20-%20B%E1%BB%91n%20Thu%20Qu%C3%A1n%20-%2091%20S%C6%B0%20%C4%90o%C3%A0n%203%20Sao%20V%C3%A0ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 197,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Bếp Nhà Sam - Ốc, Cafe & Ăn Vặt",
    "address": "26, Ngô Văn Sở",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.764268,
    "longitude": 109.224512,
    "lat": 13.764268,
    "lng": 109.224512,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m48emqs1ir4f08@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m48emqs1ir4f08@resize_ss640x400"
    ],
    "description": "Quán Bếp Nhà Sam - Ốc, Cafe & Ăn Vặt tọa lạc tại 26, Ngô Văn Sở, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Bếp Nhà Sam - Ốc, Cafe & Ăn Vặt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3826989",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bếp Nhà Sam - Ốc, Cafe & Ăn Vặt",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 198,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Len & Ốc Um",
    "address": "52 Nguyễn Nhạc, Thị Trấn Tuy Phước",
    "district": "Huyện Tuy Phước",
    "distance": 7.1,
    "distanceText": "Cách bạn 7.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.8253312,
    "longitude": 109.1714501,
    "lat": 13.8253312,
    "lng": 109.1714501,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwffmjqsgxjvd2@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwffmjqsgxjvd2@resize_ss640x400"
    ],
    "description": "Quán Ốc Len & Ốc Um tọa lạc tại 52 Nguyễn Nhạc, Thị Trấn Tuy Phước, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Len & Ốc Um cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3827126",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Len & Ốc Um",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-len-oc-um",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Len%20%26%20%E1%BB%90c%20Um",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 199,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Um",
    "address": "2 Nguyễn Trãi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.769938,
    "longitude": 109.228187,
    "lat": 13.769938,
    "lng": 109.228187,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgs9gfppvq3bc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgs9gfppvq3bc@resize_ss640x400"
    ],
    "description": "Quán Ốc Um tọa lạc tại 2 Nguyễn Trãi, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Um cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3827263",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Um",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-um",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Um",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 200,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Ken",
    "address": "38 Nguyễn Hoàng",
    "district": "Tp. Qui Nhơn",
    "distance": 0.7,
    "distanceText": "Cách bạn 700m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.787716,
    "longitude": 109.217439,
    "lat": 13.787716,
    "lng": 109.217439,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa7hitikp23b1@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwa7hitikp23b1@resize_ss640x400"
    ],
    "description": "Quán Ốc Ken tọa lạc tại 38 Nguyễn Hoàng, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Ken cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3827400",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Ken",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-ken",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20Ken",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 201,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ăn Vặt Luna - Bánh Tráng Trộn, Trà Tắc & Sữa Hạt Dinh Dưỡng",
    "address": "12/14, Võ Văn Dũng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 5,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.76935,
    "longitude": 109.216101,
    "lat": 13.76935,
    "lng": 109.216101,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtnh9yd7gr294a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mtnh9yd7gr294a@resize_ss640x400"
    ],
    "description": "Quán Ăn Vặt Luna - Bánh Tráng Trộn, Trà Tắc & Sữa Hạt Dinh Dưỡng tọa lạc tại 12/14, Võ Văn Dũng, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ăn Vặt Luna - Bánh Tráng Trộn, Trà Tắc & Sữa Hạt Dinh Dưỡng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3827537",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ăn Vặt Luna - Bánh Tráng Trộn, Trà Tắc & Sữa Hạt Dinh Dưỡng",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/an-vat-luna-banh-trang-tron-tra-tac-sua-hat-dinh-duong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%82n%20V%E1%BA%B7t%20Luna%20-%20B%C3%A1nh%20Tr%C3%A1ng%20Tr%E1%BB%99n%2C%20Tr%C3%A0%20T%E1%BA%AFc%20%26%20S%E1%BB%AFa%20H%E1%BA%A1t%20Dinh%20D%C6%B0%E1%BB%A1ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 202,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Bà Mai",
    "address": "18 Hoa Lư",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 10,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.791778,
    "longitude": 109.201485,
    "lat": 13.791778,
    "lng": 109.201485,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9h6e191vixff@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9h6e191vixff@resize_ss640x400"
    ],
    "description": "Quán Ốc Bà Mai tọa lạc tại 18 Hoa Lư, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Bà Mai cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3827674",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Bà Mai",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-ba-mai",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20B%C3%A0%20Mai",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
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
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 15,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.779998,
    "longitude": 109.2271721,
    "lat": 13.779998,
    "lng": 109.2271721,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "hotline": "0256 3827811",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 204,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Ốc Văn",
    "address": "57 Vũ Bảo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 20,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.766263,
    "longitude": 109.218353,
    "lat": 13.766263,
    "lng": 109.218353,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfw6qailae3da@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfw6qailae3da@resize_ss640x400"
    ],
    "description": "Quán Ốc Văn tọa lạc tại 57 Vũ Bảo, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Ốc Văn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3827948",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ốc Văn",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/oc-van",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%E1%BB%90c%20V%C4%83n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 205,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Lẩu Ốc",
    "address": "147 Chương Dương",
    "district": "Tp. Qui Nhơn",
    "distance": 3.3,
    "distanceText": "Cách bạn 3.3km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 25,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7543828,
    "longitude": 109.2096274,
    "lat": 13.7543828,
    "lng": 109.2096274,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgrrb45rwez90@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgrrb45rwez90@resize_ss640x400"
    ],
    "description": "Quán Lẩu Ốc tọa lạc tại 147 Chương Dương, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Lẩu Ốc cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3828085",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Ốc",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-oc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20%E1%BB%90c",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 206,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
    "restaurant": "Quán Cô Ba TB - Đặc Sản Quảng Ngãi",
    "address": "81/4 Trần Thị Kỷ, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "35.000đ - 65.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 30,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "streetfood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.770009,
    "longitude": 109.216911,
    "lat": 13.770009,
    "lng": 109.216911,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "craving",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mognz39n6txoaf@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mognz39n6txoaf@resize_ss640x400"
    ],
    "description": "Quán Quán Cô Ba TB - Đặc Sản Quảng Ngãi tọa lạc tại 81/4 Trần Thị Kỷ, P. Ngô Mây, phục vụ món Bánh Xèo Tôm Nhảy Giòn Rụm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Xèo Tôm Nhảy Giòn Rụm tại Quán Cô Ba TB - Đặc Sản Quảng Ngãi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3828222",
    "menu": [
      {
        "name": "Bánh Xèo Tôm Nhảy Giòn Rụm",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Cô Ba TB - Đặc Sản Quảng Ngãi",
        "price": "65.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-co-ba-tb-dac-san-quang-ngai",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20C%C3%B4%20Ba%20TB%20-%20%C4%90%E1%BA%B7c%20S%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ng%C3%A3i",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 207,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá Anh Thư",
    "address": "11A/7 Ngọc Hân Công Chúa, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 35,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7675792,
    "longitude": 109.2290876,
    "lat": 13.7675792,
    "lng": 109.2290876,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-muuoi64tabyc86@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-muuoi64tabyc86@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá Anh Thư tọa lạc tại 11A/7 Ngọc Hân Công Chúa, P. Trần Phú, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá Anh Thư cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3828359",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá Anh Thư",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-anh-thu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20Anh%20Th%C6%B0",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 208,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Châu Loan - Bún Bò Huế & Bún Chả Cá",
    "address": "147 Trần Cao Vân, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 40,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7744011,
    "longitude": 109.2302636,
    "lat": 13.7744011,
    "lng": 109.2302636,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc78dqweqh1e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc78dqweqh1e@resize_ss640x400"
    ],
    "description": "Quán Châu Loan - Bún Bò Huế & Bún Chả Cá tọa lạc tại 147 Trần Cao Vân, P. Trần Hưng Đạo, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Châu Loan - Bún Bò Huế & Bún Chả Cá cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3828496",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Châu Loan - Bún Bò Huế & Bún Chả Cá",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 209,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá Chợ Gò",
    "address": "152 Nguyễn Huệ, Thị Trấn Tuy Phước",
    "district": "Huyện Tuy Phước",
    "distance": 7.0,
    "distanceText": "Cách bạn 7.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 45,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.8236638832328,
    "longitude": 109.1715231126006,
    "lat": 13.8236638832328,
    "lng": 109.1715231126006,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvxqxhsiqh37@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwfvxqxhsiqh37@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá Chợ Gò tọa lạc tại 152 Nguyễn Huệ, Thị Trấn Tuy Phước, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá Chợ Gò cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3828633",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá Chợ Gò",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-cho-go",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20Ch%E1%BB%A3%20G%C3%B2",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 210,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Quán 55A - Bún Chả Cá, Chả Cuốn",
    "address": "55A Trần Phú, P. Lý Thường Kiệt",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 50,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.774244,
    "longitude": 109.225683,
    "lat": 13.774244,
    "lng": 109.225683,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi3ielqyvo957@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwi3ielqyvo957@resize_ss640x400"
    ],
    "description": "Quán Quán 55A - Bún Chả Cá, Chả Cuốn tọa lạc tại 55A Trần Phú, P. Lý Thường Kiệt, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Quán 55A - Bún Chả Cá, Chả Cuốn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3828770",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán 55A - Bún Chả Cá, Chả Cuốn",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-55a-bun-cha-ca-cha-cuon",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%2055A%20-%20B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%2C%20Ch%E1%BA%A3%20Cu%E1%BB%91n",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 211,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Chả Cá - Nguyễn Thái Học",
    "address": "544 Nguyễn Thái Học",
    "district": "Tp. Qui Nhơn",
    "distance": 3.0,
    "distanceText": "Cách bạn 3.0km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.75673,
    "longitude": 109.209305,
    "lat": 13.75673,
    "lng": 109.209305,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaa0obwfx7fa0@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaa0obwfx7fa0@resize_ss640x400"
    ],
    "description": "Quán Bún Chả Cá - Nguyễn Thái Học tọa lạc tại 544 Nguyễn Thái Học, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Chả Cá - Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3828907",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Chả Cá - Nguyễn Thái Học",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-cha-ca-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ch%E1%BA%A3%20C%C3%A1%20-%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 212,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Cơm Tấm Sườn Bà Bông - 02A Nguyễn Văn Trỗi",
    "address": "2A Nguyễn Văn Trỗi, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7624034,
    "longitude": 109.2190052,
    "lat": 13.7624034,
    "lng": 109.2190052,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mteoj3ehk8aw49@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mteoj3ehk8aw49@resize_ss640x400"
    ],
    "description": "Quán Cơm Tấm Sườn Bà Bông - 02A Nguyễn Văn Trỗi tọa lạc tại 2A Nguyễn Văn Trỗi, P. Ngô Mây, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Cơm Tấm Sườn Bà Bông - 02A Nguyễn Văn Trỗi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3829044",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Tấm Sườn Bà Bông - 02A Nguyễn Văn Trỗi",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-tam-suon-ba-bong-02a-nguyen-van-troi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20T%E1%BA%A5m%20S%C6%B0%E1%BB%9Dn%20B%C3%A0%20B%C3%B4ng%20-%2002A%20Nguy%E1%BB%85n%20V%C4%83n%20Tr%E1%BB%97i",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 213,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "ÚT HẠNH - Bún Riêu, Chả Cá & Thập Cẩm - 54 Nguyễn Tất Thành",
    "address": "54 Nguyễn Tất Thành",
    "district": "Tp. Qui Nhơn",
    "distance": 0.6,
    "distanceText": "Cách bạn 600m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7775138,
    "longitude": 109.2223878,
    "lat": 13.7775138,
    "lng": 109.2223878,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg4tnvzw83k868@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg4tnvzw83k868@resize_ss640x400"
    ],
    "description": "Quán ÚT HẠNH - Bún Riêu, Chả Cá & Thập Cẩm - 54 Nguyễn Tất Thành tọa lạc tại 54 Nguyễn Tất Thành, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại ÚT HẠNH - Bún Riêu, Chả Cá & Thập Cẩm - 54 Nguyễn Tất Thành cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3829181",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt ÚT HẠNH - Bún Riêu, Chả Cá & Thập Cẩm - 54 Nguyễn Tất Thành",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 214,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bếp Xuyên Đêm Quy Nhơn - 201 Ngô Mây",
    "address": "201 Ngô Mây, P. Quang Trung",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7662991,
    "longitude": 109.212032,
    "lat": 13.7662991,
    "lng": 109.212032,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-modskrivmvil22@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-modskrivmvil22@resize_ss640x400"
    ],
    "description": "Quán Bếp Xuyên Đêm Quy Nhơn - 201 Ngô Mây tọa lạc tại 201 Ngô Mây, P. Quang Trung, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bếp Xuyên Đêm Quy Nhơn - 201 Ngô Mây cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3829318",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bếp Xuyên Đêm Quy Nhơn - 201 Ngô Mây",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bep-xuyen-dem-quy-nhon-201-ngo-may",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%E1%BA%BFp%20Xuy%C3%AAn%20%C4%90%C3%AAm%20Quy%20Nh%C6%A1n%20-%20201%20Ng%C3%B4%20M%C3%A2y",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 215,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Cá Cô Hạnh - Trần Hưng Đạo",
    "address": "126 Trần Hưng Đạo, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7750397,
    "longitude": 109.2341209,
    "lat": 13.7750397,
    "lng": 109.2341209,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcua3mquv881@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvcua3mquv881@resize_ss640x400"
    ],
    "description": "Quán Bún Cá Cô Hạnh - Trần Hưng Đạo tọa lạc tại 126 Trần Hưng Đạo, P. Lê Lợi, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Cá Cô Hạnh - Trần Hưng Đạo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3829455",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Cá Cô Hạnh - Trần Hưng Đạo",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 216,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bún Phở Cô Nữ - 43 Bạch Đằng",
    "address": "43 Bạch Đằng, P. Thị Nại",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7752539,
    "longitude": 109.2373277,
    "lat": 13.7752539,
    "lng": 109.2373277,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mq2p4fe7f28f4a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mq2p4fe7f28f4a@resize_ss640x400"
    ],
    "description": "Quán Bún Phở Cô Nữ - 43 Bạch Đằng tọa lạc tại 43 Bạch Đằng, P. Thị Nại, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bún Phở Cô Nữ - 43 Bạch Đằng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3829592",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Phở Cô Nữ - 43 Bạch Đằng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-pho-co-nu-43-bach-dang",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ph%E1%BB%9F%20C%C3%B4%20N%E1%BB%AF%20-%2043%20B%E1%BA%A1ch%20%C4%90%E1%BA%B1ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 217,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Mì Quảng Tân Hoàng Gia",
    "address": "39 Võ Lai, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.764618,
    "longitude": 109.2180462,
    "lat": 13.764618,
    "lng": 109.2180462,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-msap2oukpkhzcb@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-msap2oukpkhzcb@resize_ss640x400"
    ],
    "description": "Quán Mì Quảng Tân Hoàng Gia tọa lạc tại 39 Võ Lai, P. Ngô Mây, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Mì Quảng Tân Hoàng Gia cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3829729",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mì Quảng Tân Hoàng Gia",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/mi-quang-tan-hoang-gia",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%C3%AC%20Qu%E1%BA%A3ng%20T%C3%A2n%20Ho%C3%A0ng%20Gia",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 218,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Ăn Vặt Chị Yến - Bún Thịt Nướng, Hủ Tiếu & Bánh Canh - 43 Nguyễn Nhạc",
    "address": "43 Nguyễn Nhạc",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7639788,
    "longitude": 109.2187292,
    "lat": 13.7639788,
    "lng": 109.2187292,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mluu9t5xpatce1@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mluu9t5xpatce1@resize_ss640x400"
    ],
    "description": "Quán Ăn Vặt Chị Yến - Bún Thịt Nướng, Hủ Tiếu & Bánh Canh - 43 Nguyễn Nhạc tọa lạc tại 43 Nguyễn Nhạc, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Ăn Vặt Chị Yến - Bún Thịt Nướng, Hủ Tiếu & Bánh Canh - 43 Nguyễn Nhạc cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3829866",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ăn Vặt Chị Yến - Bún Thịt Nướng, Hủ Tiếu & Bánh Canh - 43 Nguyễn Nhạc",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/an-vat-chi-yen-bun-thit-nuong-hu-tieu-banh-canh-43-nguyen-nhac",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%82n%20V%E1%BA%B7t%20Ch%E1%BB%8B%20Y%E1%BA%BFn%20-%20B%C3%BAn%20Th%E1%BB%8Bt%20N%C6%B0%E1%BB%9Bng%2C%20H%E1%BB%A7%20Ti%E1%BA%BFu%20%26%20B%C3%A1nh%20Canh%20-%2043%20Nguy%E1%BB%85n%20Nh%E1%BA%A1c",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 219,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Quán Cô Hồng - Bánh Canh Tôm, Bún Riêu & Bún Chả Cá",
    "address": "295 Lê Thanh Nghị, P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 1.3,
    "distanceText": "Cách bạn 1.3km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7914214,
    "longitude": 109.2124637,
    "lat": 13.7914214,
    "lng": 109.2124637,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m2tgxe1za7006a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m2tgxe1za7006a@resize_ss640x400"
    ],
    "description": "Quán Quán Cô Hồng - Bánh Canh Tôm, Bún Riêu & Bún Chả Cá tọa lạc tại 295 Lê Thanh Nghị, P. Đống Đa, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Quán Cô Hồng - Bánh Canh Tôm, Bún Riêu & Bún Chả Cá cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3830003",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Cô Hồng - Bánh Canh Tôm, Bún Riêu & Bún Chả Cá",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 220,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bún Quậy Xứ Nẫu - Nguyễn Thị Định",
    "address": "144 Lô 32 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.758446,
    "longitude": 109.214598,
    "lat": 13.758446,
    "lng": 109.214598,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "description": "Quán Bún Quậy Xứ Nẫu - Nguyễn Thị Định tọa lạc tại 144 Lô 32 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bún Quậy Xứ Nẫu - Nguyễn Thị Định cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3830140",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Quậy Xứ Nẫu - Nguyễn Thị Định",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 221,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn",
    "restaurant": "Bún Riêu Cua Đồng - Riêu Cua Ba Chỉ & Chả Cá - 47 Hàm Nghi",
    "address": "47 Hàm Nghi, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 5,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.767047,
    "longitude": 109.217842,
    "lat": 13.767047,
    "lng": 109.217842,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mqv9gyrgyfppe3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mqv9gyrgyfppe3@resize_ss640x400"
    ],
    "description": "Quán Bún Riêu Cua Đồng - Riêu Cua Ba Chỉ & Chả Cá - 47 Hàm Nghi tọa lạc tại 47 Hàm Nghi, P. Ngô Mây, phục vụ món Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn tại Bún Riêu Cua Đồng - Riêu Cua Ba Chỉ & Chả Cá - 47 Hàm Nghi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3830277",
    "menu": [
      {
        "name": "Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Riêu Cua Đồng - Riêu Cua Ba Chỉ & Chả Cá - 47 Hàm Nghi",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-rieu-cua-dong-rieu-cua-ba-chi-cha-ca-47-ham-nghi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20Ri%C3%AAu%20Cua%20%C4%90%E1%BB%93ng%20-%20Ri%C3%AAu%20Cua%20Ba%20Ch%E1%BB%89%20%26%20Ch%E1%BA%A3%20C%C3%A1%20-%2047%20H%C3%A0m%20Nghi",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 222,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Tiệm Ăn Bà Hảo - 97 Huỳnh Văn Thống",
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
    "latitude": 13.7959807,
    "longitude": 109.191575,
    "lat": 13.7959807,
    "lng": 109.191575,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "description": "Quán Tiệm Ăn Bà Hảo - 97 Huỳnh Văn Thống tọa lạc tại 97 Huỳnh Văn Thống, P. Nhơn Bình, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Tiệm Ăn Bà Hảo - 97 Huỳnh Văn Thống cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3830414",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 223,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Đặc Sản Quy Nhơn - Nhuận Khôi Quán",
    "address": "3 Ngô Văn Sở",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 15,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7639366,
    "longitude": 109.2247526,
    "lat": 13.7639366,
    "lng": 109.2247526,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mpg9u9cfm7swca@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mpg9u9cfm7swca@resize_ss640x400"
    ],
    "description": "Quán Đặc Sản Quy Nhơn - Nhuận Khôi Quán tọa lạc tại 3 Ngô Văn Sở, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Đặc Sản Quy Nhơn - Nhuận Khôi Quán cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3830551",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Đặc Sản Quy Nhơn - Nhuận Khôi Quán",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/dac-san-quy-nhon-nhuan-khoi-quan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%90%E1%BA%B7c%20S%E1%BA%A3n%20Quy%20Nh%C6%A1n%20-%20Nhu%E1%BA%ADn%20Kh%C3%B4i%20Qu%C3%A1n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 224,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bánh Hỏi & Cháo Lòng 77 - 01C Lê Lợi",
    "address": "1C Lê Lợi, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 20,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7688492,
    "longitude": 109.2315969,
    "lat": 13.7688492,
    "lng": 109.2315969,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mthvagdnuj9m6e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mthvagdnuj9m6e@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi & Cháo Lòng 77 - 01C Lê Lợi tọa lạc tại 1C Lê Lợi, P. Lê Lợi, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bánh Hỏi & Cháo Lòng 77 - 01C Lê Lợi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3830688",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi & Cháo Lòng 77 - 01C Lê Lợi",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-77-01c-le-loi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20%26%20Ch%C3%A1o%20L%C3%B2ng%2077%20-%2001C%20L%C3%AA%20L%E1%BB%A3i",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 225,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Cá Hồ Thị",
    "address": "279 Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 25,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7757424,
    "longitude": 109.2311198,
    "lat": 13.7757424,
    "lng": 109.2311198,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsuaczmo3oux3a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsuaczmo3oux3a@resize_ss640x400"
    ],
    "description": "Quán Bún Cá Hồ Thị tọa lạc tại 279 Trần Hưng Đạo, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Cá Hồ Thị cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3830825",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Cá Hồ Thị",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 226,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Quán Ngân - Bún - Trần Hưng Đạo",
    "address": "593 Trần Hưng Đạo, P. Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 0.6,
    "distanceText": "Cách bạn 600m",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 30,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7794161,
    "longitude": 109.2244299,
    "lat": 13.7794161,
    "lng": 109.2244299,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lvjbcww75rvobd@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lvjbcww75rvobd@resize_ss640x400"
    ],
    "description": "Quán Quán Ngân - Bún - Trần Hưng Đạo tọa lạc tại 593 Trần Hưng Đạo, P. Lê Hồng Phong, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Quán Ngân - Bún - Trần Hưng Đạo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3830962",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Ngân - Bún - Trần Hưng Đạo",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-ngan-bun-tran-hung-dao",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20Ng%C3%A2n%20-%20B%C3%BAn%20-%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 227,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Tiệm Ăn 241 - Cơm Tấm & Cơm Món",
    "address": "241 Lê Thanh Nghị, P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 35,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7920734,
    "longitude": 109.2123774,
    "lat": 13.7920734,
    "lng": 109.2123774,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc1tsvn6op7d@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc1tsvn6op7d@resize_ss640x400"
    ],
    "description": "Quán Tiệm Ăn 241 - Cơm Tấm & Cơm Món tọa lạc tại 241 Lê Thanh Nghị, P. Đống Đa, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Tiệm Ăn 241 - Cơm Tấm & Cơm Món cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3831099",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Tiệm Ăn 241 - Cơm Tấm & Cơm Món",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/tiem-an-241-com-tam-com-mon",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ti%E1%BB%87m%20%C4%82n%20241%20-%20C%C6%A1m%20T%E1%BA%A5m%20%26%20C%C6%A1m%20M%C3%B3n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 228,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Cá Toàn Hà - Nguyễn Thị Định",
    "address": "Lô 41, 42 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 40,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.757183,
    "longitude": 109.2140706,
    "lat": 13.757183,
    "lng": 109.2140706,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-mdgz6uv295m937@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-mdgz6uv295m937@resize_ss640x400"
    ],
    "description": "Quán Bún Cá Toàn Hà - Nguyễn Thị Định tọa lạc tại Lô 41, 42 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Cá Toàn Hà - Nguyễn Thị Định cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3831236",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Cá Toàn Hà - Nguyễn Thị Định",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 229,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bún Cá - Riêu & Sứa - Hà Huy Tập",
    "address": "9 Hà Huy Tập, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 45,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7705994,
    "longitude": 109.2265908,
    "lat": 13.7705994,
    "lng": 109.2265908,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc5fldpjno4a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc5fldpjno4a@resize_ss640x400"
    ],
    "description": "Quán Bún Cá - Riêu & Sứa - Hà Huy Tập tọa lạc tại 9 Hà Huy Tập, P. Trần Phú, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bún Cá - Riêu & Sứa - Hà Huy Tập cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3831373",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Cá - Riêu & Sứa - Hà Huy Tập",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-ca-rieu-sua-ha-huy-tap",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20C%C3%A1%20-%20Ri%C3%AAu%20%26%20S%E1%BB%A9a%20-%20H%C3%A0%20Huy%20T%E1%BA%ADp",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 230,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bún Văn Hùng - Trần Hưng Đạo",
    "address": "146 Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 50,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7755504,
    "longitude": 109.2325196,
    "lat": 13.7755504,
    "lng": 109.2325196,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "description": "Quán Bún Văn Hùng - Trần Hưng Đạo tọa lạc tại 146 Trần Hưng Đạo, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bún Văn Hùng - Trần Hưng Đạo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3831510",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Văn Hùng - Trần Hưng Đạo",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 231,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Bánh Canh Hẹ, Bún Riêu Cá & Mì Quảng - 83 Vũ Bảo",
    "address": "83 Vũ Bảo, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7658933,
    "longitude": 109.2190062,
    "lat": 13.7658933,
    "lng": 109.2190062,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mexvvdwe77k6aa@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mexvvdwe77k6aa@resize_ss640x400"
    ],
    "description": "Quán Bánh Canh Hẹ, Bún Riêu Cá & Mì Quảng - 83 Vũ Bảo tọa lạc tại 83 Vũ Bảo, P. Ngô Mây, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Bánh Canh Hẹ, Bún Riêu Cá & Mì Quảng - 83 Vũ Bảo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3831647",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Canh Hẹ, Bún Riêu Cá & Mì Quảng - 83 Vũ Bảo",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 232,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "QUÁN BÚN CÔ TÂM - Bún Bò - Trường Chinh",
    "address": "20 Trường Chinh, P. Lý Thường Kiệt",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7719048,
    "longitude": 109.2238497,
    "lat": 13.7719048,
    "lng": 109.2238497,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "description": "Quán QUÁN BÚN CÔ TÂM - Bún Bò - Trường Chinh tọa lạc tại 20 Trường Chinh, P. Lý Thường Kiệt, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại QUÁN BÚN CÔ TÂM - Bún Bò - Trường Chinh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3831784",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt QUÁN BÚN CÔ TÂM - Bún Bò - Trường Chinh",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 233,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "RUTO - Bún Riêu, Trà Sữa, Trứng Nướng",
    "address": "143 Ngô Mây, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7654399,
    "longitude": 109.2133282,
    "lat": 13.7654399,
    "lng": 109.2133282,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "description": "Quán RUTO - Bún Riêu, Trà Sữa, Trứng Nướng tọa lạc tại 143 Ngô Mây, P. Nguyễn Văn Cừ, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại RUTO - Bún Riêu, Trà Sữa, Trứng Nướng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3831921",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt RUTO - Bún Riêu, Trà Sữa, Trứng Nướng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 234,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Cô Han - Bún Đậu Mắm Tôm, Mì Cay & Trà Sữa",
    "address": "8 Trần Đăng Phong, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7580302,
    "longitude": 109.2154833,
    "lat": 13.7580302,
    "lng": 109.2154833,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mthvggn2ibcxb0@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mthvggn2ibcxb0@resize_ss640x400"
    ],
    "description": "Quán Cô Han - Bún Đậu Mắm Tôm, Mì Cay & Trà Sữa tọa lạc tại 8 Trần Đăng Phong, P. Nguyễn Văn Cừ, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Cô Han - Bún Đậu Mắm Tôm, Mì Cay & Trà Sữa cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3832058",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cô Han - Bún Đậu Mắm Tôm, Mì Cay & Trà Sữa",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/co-han-bun-dau-mam-tom-mi-cay-tra-sua",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C3%B4%20Han%20-%20B%C3%BAn%20%C4%90%E1%BA%ADu%20M%E1%BA%AFm%20T%C3%B4m%2C%20M%C3%AC%20Cay%20%26%20Tr%C3%A0%20S%E1%BB%AFa",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 235,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "KEN Đồ Ăn Heatlhy - Đồ Hấp, Bún , Cơm, Sữa Hạt- 158 Lê Lợi",
    "address": "158 Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7760771,
    "longitude": 109.2324446,
    "lat": 13.7760771,
    "lng": 109.2324446,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-moigqxrlfeh8c3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-moigqxrlfeh8c3@resize_ss640x400"
    ],
    "description": "Quán KEN Đồ Ăn Heatlhy - Đồ Hấp, Bún , Cơm, Sữa Hạt- 158 Lê Lợi tọa lạc tại 158 Lê Lợi, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại KEN Đồ Ăn Heatlhy - Đồ Hấp, Bún , Cơm, Sữa Hạt- 158 Lê Lợi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3832195",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt KEN Đồ Ăn Heatlhy - Đồ Hấp, Bún , Cơm, Sữa Hạt- 158 Lê Lợi",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ken-do-an-heatlhy-do-hap-bun-com-sua-hat-158-le-loi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=KEN%20%C4%90%E1%BB%93%20%C4%82n%20Heatlhy%20-%20%C4%90%E1%BB%93%20H%E1%BA%A5p%2C%20B%C3%BAn%20%2C%20C%C6%A1m%2C%20S%E1%BB%AFa%20H%E1%BA%A1t-%20158%20L%C3%AA%20L%E1%BB%A3i",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 236,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn",
    "restaurant": "QUÁN GÌ CŨNG CÓ - Sứa Mắm Nhĩ, Bún Cua Thối & Nước Ép - Nguyễn Thái Học",
    "address": "548 Nguyễn Thái Học, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7588112,
    "longitude": 109.210644,
    "lat": 13.7588112,
    "lng": 109.210644,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjm9uvoz0t50e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lxjm9uvoz0t50e@resize_ss640x400"
    ],
    "description": "Quán QUÁN GÌ CŨNG CÓ - Sứa Mắm Nhĩ, Bún Cua Thối & Nước Ép - Nguyễn Thái Học tọa lạc tại 548 Nguyễn Thái Học, P. Nguyễn Văn Cừ, phục vụ món Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn tại QUÁN GÌ CŨNG CÓ - Sứa Mắm Nhĩ, Bún Cua Thối & Nước Ép - Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3832332",
    "menu": [
      {
        "name": "Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt QUÁN GÌ CŨNG CÓ - Sứa Mắm Nhĩ, Bún Cua Thối & Nước Ép - Nguyễn Thái Học",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-gi-cung-co-sua-mam-nhi-bun-cua-thoi-nuoc-ep-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=QU%C3%81N%20G%C3%8C%20C%C5%A8NG%20C%C3%93%20-%20S%E1%BB%A9a%20M%E1%BA%AFm%20Nh%C4%A9%2C%20B%C3%BAn%20Cua%20Th%C3%B4%CC%81i%20%26%20N%C6%B0%C6%A1%CC%81c%20E%CC%81p%20-%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 237,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bún Đậu 36 Phố Cổ Hà Nội - Quy Nhơn",
    "address": "70 Ngô Mây, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.762882,
    "longitude": 109.217758,
    "lat": 13.762882,
    "lng": 109.217758,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m6wk1xw76q0odc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m6wk1xw76q0odc@resize_ss640x400"
    ],
    "description": "Quán Bún Đậu 36 Phố Cổ Hà Nội - Quy Nhơn tọa lạc tại 70 Ngô Mây, P. Ngô Mây, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bún Đậu 36 Phố Cổ Hà Nội - Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3832469",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Đậu 36 Phố Cổ Hà Nội - Quy Nhơn",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-dau-36-pho-co-ha-noi-quy-nhon",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20%C4%90%E1%BA%ADu%2036%20Ph%E1%BB%91%20C%E1%BB%95%20H%C3%A0%20N%E1%BB%99i%20-%20Quy%20Nh%C6%A1n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 238,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Cơm Gà 89 - Vũ Bảo",
    "address": "89 Vũ Bảo, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7657625,
    "longitude": 109.2191085,
    "lat": 13.7657625,
    "lng": 109.2191085,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "description": "Quán Cơm Gà 89 - Vũ Bảo tọa lạc tại 89 Vũ Bảo, P. Ngô Mây, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Cơm Gà 89 - Vũ Bảo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3832606",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Gà 89 - Vũ Bảo",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 239,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bún Bò Huế 6 Lùn",
    "address": "16 Phan Đình Phùng, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 0.9,
    "distanceText": "Cách bạn 950m",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.777635,
    "longitude": 109.227226,
    "lat": 13.777635,
    "lng": 109.227226,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "description": "Quán Bún Bò Huế 6 Lùn tọa lạc tại 16 Phan Đình Phùng, P. Trần Hưng Đạo, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bún Bò Huế 6 Lùn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3832743",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Bò Huế 6 Lùn",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 240,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
    "restaurant": "Bún Tôm - Bún Rạm Đầm Trúc - 03 Mai Xuân Thưởng",
    "address": "3 Mai Xuân Thưởng, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7778584,
    "longitude": 109.2285681,
    "lat": 13.7778584,
    "lng": 109.2285681,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbyp6kg6ft99@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbyp6kg6ft99@resize_ss640x400"
    ],
    "description": "Quán Bún Tôm - Bún Rạm Đầm Trúc - 03 Mai Xuân Thưởng tọa lạc tại 3 Mai Xuân Thưởng, P. Trần Hưng Đạo, phục vụ món Hải Sản Tươi Sống Sốt Me Trứng Muối hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Hải Sản Tươi Sống Sốt Me Trứng Muối tại Bún Tôm - Bún Rạm Đầm Trúc - 03 Mai Xuân Thưởng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3832880",
    "menu": [
      {
        "name": "Hải Sản Tươi Sống Sốt Me Trứng Muối",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Tôm - Bún Rạm Đầm Trúc - 03 Mai Xuân Thưởng",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 241,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Cơm Sườn Núp Hẻm - Cơm Tấm, Bún & Bò Kho - 237/8 Hoàng Văn Thụ",
    "address": "237/8 Hoàng Văn Thụ, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 5,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7679398,
    "longitude": 109.2134342,
    "lat": 13.7679398,
    "lng": 109.2134342,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mjvis9wmxurn37@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mjvis9wmxurn37@resize_ss640x400"
    ],
    "description": "Quán Cơm Sườn Núp Hẻm - Cơm Tấm, Bún & Bò Kho - 237/8 Hoàng Văn Thụ tọa lạc tại 237/8 Hoàng Văn Thụ, P. Ngô Mây, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Cơm Sườn Núp Hẻm - Cơm Tấm, Bún & Bò Kho - 237/8 Hoàng Văn Thụ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3833017",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cơm Sườn Núp Hẻm - Cơm Tấm, Bún & Bò Kho - 237/8 Hoàng Văn Thụ",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/com-suon-nup-hem-com-tam-bun-bo-kho-2378-hoang-van-thu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C6%A1m%20S%C6%B0%E1%BB%9Dn%20N%C3%BAp%20H%E1%BA%BBm%20-%20C%C6%A1m%20T%E1%BA%A5m%2C%20B%C3%BAn%20%26%20B%C3%B2%20Kho%20-%20237/8%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 242,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bún Đậu Gia Hân - Chợ Dinh",
    "address": "26 Nguyễn Diêu, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 3.6,
    "distanceText": "Cách bạn 3.6km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 10,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7950475,
    "longitude": 109.1888468,
    "lat": 13.7950475,
    "lng": 109.1888468,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mviaym5bi9kzf3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mviaym5bi9kzf3@resize_ss640x400"
    ],
    "description": "Quán Bún Đậu Gia Hân - Chợ Dinh tọa lạc tại 26 Nguyễn Diêu, P. Nhơn Bình, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bún Đậu Gia Hân - Chợ Dinh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3833154",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Đậu Gia Hân - Chợ Dinh",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-dau-gia-han-cho-dinh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20%C4%90%E1%BA%ADu%20Gia%20H%C3%A2n%20-%20Ch%E1%BB%A3%20Dinh",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 243,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "BÚN BÒ & SÂM MÁT AN VI - 101A Hai Bà Trưng",
    "address": "101A Hai Bà Trưng, P. Thị Nại",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 15,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771767,
    "longitude": 109.2295108,
    "lat": 13.771767,
    "lng": 109.2295108,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mqmwu95drh1p7a@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mqmwu95drh1p7a@resize_ss640x400"
    ],
    "description": "Quán BÚN BÒ & SÂM MÁT AN VI - 101A Hai Bà Trưng tọa lạc tại 101A Hai Bà Trưng, P. Thị Nại, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại BÚN BÒ & SÂM MÁT AN VI - 101A Hai Bà Trưng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3833291",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt BÚN BÒ & SÂM MÁT AN VI - 101A Hai Bà Trưng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-bo-sam-mat-an-vi-101a-hai-ba-trung",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%9AN%20B%C3%92%20%26%20S%C3%82M%20M%C3%81T%20AN%20VI%20-%20101A%20Hai%20B%C3%A0%20Tr%C6%B0ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 244,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Mì Quảng 32 - Mì Quảng, Lagu Bánh Mì & Bánh Cuốn - 32 Trường Chinh",
    "address": "32 Trường Chinh, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 20,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7719173,
    "longitude": 109.2234854,
    "lat": 13.7719173,
    "lng": 109.2234854,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "description": "Quán Mì Quảng 32 - Mì Quảng, Lagu Bánh Mì & Bánh Cuốn - 32 Trường Chinh tọa lạc tại 32 Trường Chinh, P. Trần Phú, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Mì Quảng 32 - Mì Quảng, Lagu Bánh Mì & Bánh Cuốn - 32 Trường Chinh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3833428",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mì Quảng 32 - Mì Quảng, Lagu Bánh Mì & Bánh Cuốn - 32 Trường Chinh",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 245,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "BÚN MĂNG GÀ, MĂNG VỊT & GIÒ HEO - Tô Hiến Thành",
    "address": "76/21 Tô Hiến Thành, P. Quang Trung",
    "district": "Tp. Qui Nhơn",
    "distance": 2.4,
    "distanceText": "Cách bạn 2.4km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 25,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7625492,
    "longitude": 109.2107836,
    "lat": 13.7625492,
    "lng": 109.2107836,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-msw7s55lpptw79@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-msw7s55lpptw79@resize_ss640x400"
    ],
    "description": "Quán BÚN MĂNG GÀ, MĂNG VỊT & GIÒ HEO - Tô Hiến Thành tọa lạc tại 76/21 Tô Hiến Thành, P. Quang Trung, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại BÚN MĂNG GÀ, MĂNG VỊT & GIÒ HEO - Tô Hiến Thành cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3833565",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt BÚN MĂNG GÀ, MĂNG VỊT & GIÒ HEO - Tô Hiến Thành",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-mang-ga-mang-vit-gio-heo-to-hien-thanh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%9AN%20M%C4%82NG%20G%C3%80%2C%20M%C4%82NG%20V%E1%BB%8AT%20%26%20GI%C3%92%20HEO%20-%20T%C3%B4%20Hi%E1%BA%BFn%20Th%C3%A0nh",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 246,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Mì Quảng Phú Chiêm - Lô 46 Nguyễn Thị Định",
    "address": "Lô 46 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 30,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7572448,
    "longitude": 109.2140706,
    "lat": 13.7572448,
    "lng": 109.2140706,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-modx2heovh1da3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-modx2heovh1da3@resize_ss640x400"
    ],
    "description": "Quán Mì Quảng Phú Chiêm - Lô 46 Nguyễn Thị Định tọa lạc tại Lô 46 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Mì Quảng Phú Chiêm - Lô 46 Nguyễn Thị Định cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3833702",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mì Quảng Phú Chiêm - Lô 46 Nguyễn Thị Định",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/mi-quang-phu-chiem-lo-46-nguyen-thi-dinh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%C3%AC%20Qu%E1%BA%A3ng%20Ph%C3%BA%20Chi%C3%AAm%20-%20L%C3%B4%2046%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20%C4%90%E1%BB%8Bnh",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 247,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bún Bò Huế A Hoài - 260 Đào Tấn",
    "address": "260 Đào Tấn, P. Nhơn Bình",
    "district": "Tp. Qui Nhơn",
    "distance": 3.7,
    "distanceText": "Cách bạn 3.7km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 35,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7961161,
    "longitude": 109.1886269,
    "lat": 13.7961161,
    "lng": 109.1886269,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill"
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
    "description": "Quán Bún Bò Huế A Hoài - 260 Đào Tấn tọa lạc tại 260 Đào Tấn, P. Nhơn Bình, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bún Bò Huế A Hoài - 260 Đào Tấn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3833839",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Bò Huế A Hoài - 260 Đào Tấn",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 248,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
    "restaurant": "Bún Bò Huế O Thơm - 61B Nguyễn Thái Học",
    "address": "61B Nguyễn Thái Học, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1.0km",
    "priceRange": "35.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 40,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7728911,
    "longitude": 109.2198903,
    "lat": 13.7728911,
    "lng": 109.2198903,
    "moodIds": [
      "healthy",
      "comfort",
      "budget",
      "chill",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-msfa33ibq6tgbe@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-msfa33ibq6tgbe@resize_ss640x400"
    ],
    "description": "Quán Bún Bò Huế O Thơm - 61B Nguyễn Thái Học tọa lạc tại 61B Nguyễn Thái Học, P. Ngô Mây, phục vụ món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt tại Bún Bò Huế O Thơm - 61B Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3833976",
    "menu": [
      {
        "name": "Bún Sứa & Chả Cá Quy Nhơn Nước Dùng Thanh Ngọt",
        "price": "35.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Bò Huế O Thơm - 61B Nguyễn Thái Học",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-bo-hue-o-thom-61b-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%BAn%20B%C3%B2%20Hu%E1%BA%BF%20O%20Th%C6%A1m%20-%2061B%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 249,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng Bình Minh",
    "address": "426 Hoàng Văn Thụ, P.Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 45,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7713665,
    "longitude": 109.2173407,
    "lat": 13.7713665,
    "lng": 109.2173407,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lz8skve3pky53f@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lz8skve3pky53f@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng Bình Minh tọa lạc tại 426 Hoàng Văn Thụ, P.Ngô Mây, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng Bình Minh cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3834113",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng Bình Minh",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-binh-minh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20B%C3%ACnh%20Minh",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 250,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng - 280 Diên Hồng",
    "address": "280 Diên Hồng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 50,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7645396,
    "longitude": 109.2198934,
    "lat": 13.7645396,
    "lng": 109.2198934,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m4bnfa71lu3k54@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m4bnfa71lu3k54@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng - 280 Diên Hồng tọa lạc tại 280 Diên Hồng, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng - 280 Diên Hồng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3834250",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng - 280 Diên Hồng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-280-dien-hong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20280%20Di%C3%AAn%20H%E1%BB%93ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 251,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Tư Hạnh - Bánh Hỏi Cháo Lòng - 165 Cần Vương",
    "address": "165 Cần Vương, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 3.1,
    "distanceText": "Cách bạn 3.1km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7551311,
    "longitude": 109.2116213,
    "lat": 13.7551311,
    "lng": 109.2116213,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhohod0jpg52@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhohod0jpg52@resize_ss640x400"
    ],
    "description": "Quán Tư Hạnh - Bánh Hỏi Cháo Lòng - 165 Cần Vương tọa lạc tại 165 Cần Vương, P. Nguyễn Văn Cừ, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Tư Hạnh - Bánh Hỏi Cháo Lòng - 165 Cần Vương cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3834387",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Tư Hạnh - Bánh Hỏi Cháo Lòng - 165 Cần Vương",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/tu-hanh-banh-hoi-chao-long-165-can-vuong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=T%C6%B0%20H%E1%BA%A1nh%20-%20B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20165%20C%E1%BA%A7n%20V%C6%B0%C6%A1ng",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 252,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng Cô Tuyết - Chế Lan Viên",
    "address": "96 Chế Lan Viên, P. Ghềnh Ráng",
    "district": "Tp. Qui Nhơn",
    "distance": 4.3,
    "distanceText": "Cách bạn 4.3km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7448536,
    "longitude": 109.2096182,
    "lat": 13.7448536,
    "lng": 109.2096182,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m1nk6hvozt1b1e@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7ras8-m1nk6hvozt1b1e@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng Cô Tuyết - Chế Lan Viên tọa lạc tại 96 Chế Lan Viên, P. Ghềnh Ráng, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng Cô Tuyết - Chế Lan Viên cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3834524",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng Cô Tuyết - Chế Lan Viên",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-co-tuyet-che-lan-vien",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20C%C3%B4%20Tuy%E1%BA%BFt%20-%20Ch%E1%BA%BF%20Lan%20Vi%C3%AAn",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 253,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng Tư Lý - Trần Cao Vân",
    "address": "122 Trần Cao Vân, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7753928,
    "longitude": 109.2308068,
    "lat": 13.7753928,
    "lng": 109.2308068,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvchsmqg8ex67@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvchsmqg8ex67@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng Tư Lý - Trần Cao Vân tọa lạc tại 122 Trần Cao Vân, P. Trần Hưng Đạo, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng Tư Lý - Trần Cao Vân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3834661",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng Tư Lý - Trần Cao Vân",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-tu-ly-tran-cao-van",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20T%C6%B0%20L%C3%BD%20-%20Tr%E1%BA%A7n%20Cao%20V%C3%A2n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 254,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng Thuỳ Châu - Cần Vương",
    "address": "167 Cần Vương, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 3.1,
    "distanceText": "Cách bạn 3.1km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.755102,
    "longitude": 109.2115901,
    "lat": 13.755102,
    "lng": 109.2115901,
    "moodIds": [
      "comfort",
      "budget",
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
    "description": "Quán Bánh Hỏi Cháo Lòng Thuỳ Châu - Cần Vương tọa lạc tại 167 Cần Vương, P. Nguyễn Văn Cừ, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng Thuỳ Châu - Cần Vương cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3834798",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng Thuỳ Châu - Cần Vương",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 255,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Nước Ép Hương - Bánh Hỏi & Cháo Lòng - 359C Nguyễn Thái Học",
    "address": "359C Nguyễn Thái Học, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763675,
    "longitude": 109.214102,
    "lat": 13.763675,
    "lng": 109.214102,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mow7fn9vev4de4@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mow7fn9vev4de4@resize_ss640x400"
    ],
    "description": "Quán Nước Ép Hương - Bánh Hỏi & Cháo Lòng - 359C Nguyễn Thái Học tọa lạc tại 359C Nguyễn Thái Học, P. Nguyễn Văn Cừ, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Nước Ép Hương - Bánh Hỏi & Cháo Lòng - 359C Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3834935",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Nước Ép Hương - Bánh Hỏi & Cháo Lòng - 359C Nguyễn Thái Học",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/nuoc-ep-huong-banh-hoi-chao-long-359c-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=N%C6%B0%E1%BB%9Bc%20%C3%89p%20H%C6%B0%C6%A1ng%20-%20B%C3%A1nh%20H%E1%BB%8Fi%20%26%20Ch%C3%A1o%20L%C3%B2ng%20-%20359C%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 256,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Bánh Hỏi Cháo Lòng - Hoàng Quốc Việt",
    "address": "90 Hoàng Quốc Việt",
    "district": "Tp. Qui Nhơn",
    "distance": 0.8,
    "distanceText": "Cách bạn 800m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.780673,
    "longitude": 109.226956,
    "lat": 13.780673,
    "lng": 109.226956,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaindf0f849bc@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwaindf0f849bc@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng - Hoàng Quốc Việt tọa lạc tại 90 Hoàng Quốc Việt, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Bánh Hỏi Cháo Lòng - Hoàng Quốc Việt cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3835072",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng - Hoàng Quốc Việt",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-hoang-quoc-viet",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20Ho%C3%A0ng%20Qu%E1%BB%91c%20Vi%E1%BB%87t",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 257,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng - Trần Hưng Đạo",
    "address": "858 Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 0.2,
    "distanceText": "Cách bạn 200m",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.781413,
    "longitude": 109.221619,
    "lat": 13.781413,
    "lng": 109.221619,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "description": "Quán Bánh Hỏi Cháo Lòng - Trần Hưng Đạo tọa lạc tại 858 Trần Hưng Đạo, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng - Trần Hưng Đạo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3835209",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng - Trần Hưng Đạo",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 258,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng - Cô Hai",
    "address": "295 Lê Thanh Nghị, P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 1.3,
    "distanceText": "Cách bạn 1.3km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.791312,
    "longitude": 109.212583,
    "lat": 13.791312,
    "lng": 109.212583,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbv2ojf6bo4c@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbv2ojf6bo4c@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng - Cô Hai tọa lạc tại 295 Lê Thanh Nghị, P. Đống Đa, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng - Cô Hai cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3835346",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng - Cô Hai",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-co-hai",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20C%C3%B4%20Hai",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 259,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi Cháo Lòng - Lê Hồng Phong",
    "address": "172 Lê Hồng Phong, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772767,
    "longitude": 109.228216,
    "lat": 13.772767,
    "lng": 109.228216,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe7id92ge6z89@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe7id92ge6z89@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng - Lê Hồng Phong tọa lạc tại 172 Lê Hồng Phong, P. Trần Phú, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi Cháo Lòng - Lê Hồng Phong cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3835483",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng - Lê Hồng Phong",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-le-hong-phong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20Ch%C3%A1o%20L%C3%B2ng%20-%20L%C3%AA%20H%E1%BB%93ng%20Phong",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 260,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
    "restaurant": "Bánh Hỏi Cháo Lòng - Đô Đốc Bảo",
    "address": "52 Đô Đốc Bảo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.765495,
    "longitude": 109.222862,
    "lat": 13.765495,
    "lng": 109.222862,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwd3gy3us89l74@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwd3gy3us89l74@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi Cháo Lòng - Đô Đốc Bảo tọa lạc tại 52 Đô Đốc Bảo, phục vụ món Ốc Hương Xào Trứng Muối Béo Ngậy hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Ốc Hương Xào Trứng Muối Béo Ngậy tại Bánh Hỏi Cháo Lòng - Đô Đốc Bảo cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3835620",
    "menu": [
      {
        "name": "Ốc Hương Xào Trứng Muối Béo Ngậy",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi Cháo Lòng - Đô Đốc Bảo",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 261,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Hoàng Kim Quán - Bánh Hỏi Cháo Lòng",
    "address": "74 Tôn Đức Thắng",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 1.0km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 5,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.77411,
    "longitude": 109.224218,
    "lat": 13.77411,
    "lng": 109.224218,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "description": "Quán Hoàng Kim Quán - Bánh Hỏi Cháo Lòng tọa lạc tại 74 Tôn Đức Thắng, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Hoàng Kim Quán - Bánh Hỏi Cháo Lòng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3835757",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Hoàng Kim Quán - Bánh Hỏi Cháo Lòng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 262,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Cuốn & Bún Thịt Nướng Cô Toàn - 15 Trần Văn Ơn",
    "address": "15 Trần Văn Ơn, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.9,
    "distanceText": "Cách bạn 2.9km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 10,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7558416,
    "longitude": 109.2156392,
    "lat": 13.7558416,
    "lng": 109.2156392,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mfdfzdjy8b2h36@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-820l4-mfdfzdjy8b2h36@resize_ss640x400"
    ],
    "description": "Quán Bánh Cuốn & Bún Thịt Nướng Cô Toàn - 15 Trần Văn Ơn tọa lạc tại 15 Trần Văn Ơn, P. Nguyễn Văn Cừ, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Cuốn & Bún Thịt Nướng Cô Toàn - 15 Trần Văn Ơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3835894",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Cuốn & Bún Thịt Nướng Cô Toàn - 15 Trần Văn Ơn",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-cuon-bun-thit-nuong-co-toan-15-tran-van-on",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20Cu%E1%BB%91n%20%26%20B%C3%BAn%20Th%E1%BB%8Bt%20N%C6%B0%E1%BB%9Bng%20C%C3%B4%20To%C3%A0n%20-%2015%20Tr%E1%BA%A7n%20V%C4%83n%20%C6%A0n",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 263,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Cô Tâm - Bánh Hỏi & Cháo Lòng",
    "address": "18 Hàm Nghi, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 15,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.764629,
    "longitude": 109.216507,
    "lat": 13.764629,
    "lng": 109.216507,
    "moodIds": [
      "comfort",
      "budget",
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
      "#Nóng_hổi"
    ],
    "sideRibbon": [
      "#hot",
      "#chuẩn_vị"
    ],
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgupa4myqxl43@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwgupa4myqxl43@resize_ss640x400"
    ],
    "description": "Quán Cô Tâm - Bánh Hỏi & Cháo Lòng tọa lạc tại 18 Hàm Nghi, P. Ngô Mây, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Cô Tâm - Bánh Hỏi & Cháo Lòng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3836031",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cô Tâm - Bánh Hỏi & Cháo Lòng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/co-tam-banh-hoi-chao-long",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C3%B4%20T%C3%A2m%20-%20B%C3%A1nh%20H%E1%BB%8Fi%20%26%20Ch%C3%A1o%20L%C3%B2ng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 264,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Bánh Hỏi & Cháo Lòng - Trần Cao Vân",
    "address": "171 Trần Cao Vân",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 20,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.774825,
    "longitude": 109.230468,
    "lat": 13.774825,
    "lng": 109.230468,
    "moodIds": [
      "comfort",
      "budget",
      "chill",
      "energetic",
      "budget"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwalu3lue1nff3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwalu3lue1nff3@resize_ss640x400"
    ],
    "description": "Quán Bánh Hỏi & Cháo Lòng - Trần Cao Vân tọa lạc tại 171 Trần Cao Vân, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Bánh Hỏi & Cháo Lòng - Trần Cao Vân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3836168",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Hỏi & Cháo Lòng - Trần Cao Vân",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-hoi-chao-long-tran-cao-van",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20H%E1%BB%8Fi%20%26%20Ch%C3%A1o%20L%C3%B2ng%20-%20Tr%E1%BA%A7n%20Cao%20V%C3%A2n",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 265,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
    "restaurant": "Quán Nẫu - Bánh Hỏi & Cháo Lòng",
    "address": "70 Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "30.000đ - 55.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 25,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "noodles",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.770295,
    "longitude": 109.229114,
    "lat": 13.770295,
    "lng": 109.229114,
    "moodIds": [
      "comfort",
      "budget",
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
    "description": "Quán Quán Nẫu - Bánh Hỏi & Cháo Lòng tọa lạc tại 70 Lê Hồng Phong, phục vụ món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà tại Quán Nẫu - Bánh Hỏi & Cháo Lòng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3836305",
    "menu": [
      {
        "name": "Bánh Hỏi Cháo Lòng Nóng Hổi Đậm Đà",
        "price": "30.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Nẫu - Bánh Hỏi & Cháo Lòng",
        "price": "55.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 266,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Gà Lá É Cay Nồng Ớt Xiêm",
    "restaurant": "Lẩu Gà Lá É - Tây Sơn Quán",
    "address": "214 Lê Thanh Nghị, P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 30,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7913358,
    "longitude": 109.2134174,
    "lat": 13.7913358,
    "lng": 109.2134174,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mjl9ww4izbpgf2@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mjl9ww4izbpgf2@resize_ss640x400"
    ],
    "description": "Quán Lẩu Gà Lá É - Tây Sơn Quán tọa lạc tại 214 Lê Thanh Nghị, P. Đống Đa, phục vụ món Lẩu Gà Lá É Cay Nồng Ớt Xiêm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Gà Lá É Cay Nồng Ớt Xiêm tại Lẩu Gà Lá É - Tây Sơn Quán cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3836442",
    "menu": [
      {
        "name": "Lẩu Gà Lá É Cay Nồng Ớt Xiêm",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Gà Lá É - Tây Sơn Quán",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-ga-la-e-tay-son-quan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20G%C3%A0%20L%C3%A1%20%C3%89%20-%20T%C3%A2y%20S%C6%A1n%20Qu%C3%A1n",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 267,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Bò Ba Toa Quán Gỗ Đậm Vị",
    "restaurant": "Lẩu Thái Tomyum, Lẩu Bò Tứ Xuyên & Nướng - Tây Sơn Quán",
    "address": "214 Lê Thanh Nghị, P. Đống Đa",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 35,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7913883,
    "longitude": 109.2134417,
    "lat": 13.7913883,
    "lng": 109.2134417,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mjl2brnrmayu41@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mjl2brnrmayu41@resize_ss640x400"
    ],
    "description": "Quán Lẩu Thái Tomyum, Lẩu Bò Tứ Xuyên & Nướng - Tây Sơn Quán tọa lạc tại 214 Lê Thanh Nghị, P. Đống Đa, phục vụ món Lẩu Bò Ba Toa Quán Gỗ Đậm Vị hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Bò Ba Toa Quán Gỗ Đậm Vị tại Lẩu Thái Tomyum, Lẩu Bò Tứ Xuyên & Nướng - Tây Sơn Quán cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3836579",
    "menu": [
      {
        "name": "Lẩu Bò Ba Toa Quán Gỗ Đậm Vị",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Thái Tomyum, Lẩu Bò Tứ Xuyên & Nướng - Tây Sơn Quán",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-thai-tomyum-lau-bo-tu-xuyen-nuong-tay-son-quan",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20Th%C3%A1i%20Tomyum%2C%20L%E1%BA%A9u%20B%C3%B2%20T%E1%BB%A9%20Xuy%C3%AAn%20%26%20N%C6%B0%E1%BB%9Bng%20-%20T%C3%A2y%20S%C6%A1n%20Qu%C3%A1n",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 268,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Lẩu Chay Thiện Duyên - Lẩu Chay",
    "address": "8 Võ Mười, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 40,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7684563,
    "longitude": 109.2171985,
    "lat": 13.7684563,
    "lng": 109.2171985,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "description": "Quán Lẩu Chay Thiện Duyên - Lẩu Chay tọa lạc tại 8 Võ Mười, P. Ngô Mây, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Lẩu Chay Thiện Duyên - Lẩu Chay cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3836716",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Chay Thiện Duyên - Lẩu Chay",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 269,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Gà Lá É Cay Nồng Ớt Xiêm",
    "restaurant": "Lẩu Gà Lá É Tao Ngộ Quán - 86 Bình Hà",
    "address": "86 Bình Hà, P. Thị Nại",
    "district": "Tp. Qui Nhơn",
    "distance": 1.2,
    "distanceText": "Cách bạn 1.2km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 45,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7817108,
    "longitude": 109.2306955,
    "lat": 13.7817108,
    "lng": 109.2306955,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "description": "Quán Lẩu Gà Lá É Tao Ngộ Quán - 86 Bình Hà tọa lạc tại 86 Bình Hà, P. Thị Nại, phục vụ món Lẩu Gà Lá É Cay Nồng Ớt Xiêm hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Gà Lá É Cay Nồng Ớt Xiêm tại Lẩu Gà Lá É Tao Ngộ Quán - 86 Bình Hà cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3836853",
    "menu": [
      {
        "name": "Lẩu Gà Lá É Cay Nồng Ớt Xiêm",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Gà Lá É Tao Ngộ Quán - 86 Bình Hà",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 270,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Bò Ba Toa Quán Gỗ Đậm Vị",
    "restaurant": "PHỞ VŨ SÀI GÒN - Phở Bò, Bún Bò Huế & Lẩu Bò - 01 Ngọc Hân Công Chúa",
    "address": "1  Ngọc Hân Công Chúa, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 50,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7679715,
    "longitude": 109.2286657,
    "lat": 13.7679715,
    "lng": 109.2286657,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhive11cxw03@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvhive11cxw03@resize_ss640x400"
    ],
    "description": "Quán PHỞ VŨ SÀI GÒN - Phở Bò, Bún Bò Huế & Lẩu Bò - 01 Ngọc Hân Công Chúa tọa lạc tại 1  Ngọc Hân Công Chúa, P. Trần Phú, phục vụ món Lẩu Bò Ba Toa Quán Gỗ Đậm Vị hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Bò Ba Toa Quán Gỗ Đậm Vị tại PHỞ VŨ SÀI GÒN - Phở Bò, Bún Bò Huế & Lẩu Bò - 01 Ngọc Hân Công Chúa cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3836990",
    "menu": [
      {
        "name": "Lẩu Bò Ba Toa Quán Gỗ Đậm Vị",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt PHỞ VŨ SÀI GÒN - Phở Bò, Bún Bò Huế & Lẩu Bò - 01 Ngọc Hân Công Chúa",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/pho-vu-sai-gon-pho-bo-bun-bo-hue-lau-bo-01-ngoc-han-cong-chua",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=PH%E1%BB%9E%20V%C5%A8%20S%C3%80I%20G%C3%92N%20-%20Ph%E1%BB%9F%20B%C3%B2%2C%20B%C3%BAn%20B%C3%B2%20Hu%E1%BA%BF%20%26%20L%E1%BA%A9u%20B%C3%B2%20-%2001%20Ng%E1%BB%8Dc%20H%C3%A2n%20C%C3%B4ng%20Ch%C3%BAa",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 271,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Mì Cay Và Lẩu Sanu Quy Nhơn - Hùng Vương",
    "address": "1290 Hùng Vương, P. Trần Quang Diệu",
    "district": "Tp. Qui Nhơn",
    "distance": 6.5,
    "distanceText": "Cách bạn 6.5km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.794512,
    "longitude": 109.160672,
    "lat": 13.794512,
    "lng": 109.160672,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc2saj66dg02@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc2saj66dg02@resize_ss640x400"
    ],
    "description": "Quán Mì Cay Và Lẩu Sanu Quy Nhơn - Hùng Vương tọa lạc tại 1290 Hùng Vương, P. Trần Quang Diệu, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Mì Cay Và Lẩu Sanu Quy Nhơn - Hùng Vương cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3837127",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Mì Cay Và Lẩu Sanu Quy Nhơn - Hùng Vương",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/mi-cay-va-lau-sanu-quy-nhon-hung-vuong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%C3%AC%20Cay%20V%C3%A0%20L%E1%BA%A9u%20Sanu%20Quy%20Nh%C6%A1n%20-%20H%C3%B9ng%20V%C6%B0%C6%A1ng",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 272,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Lẩu Ly & Tokbokki - 22C Phan Bội Châu",
    "address": "22C Phan Bội Châu, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7736893,
    "longitude": 109.2358631,
    "lat": 13.7736893,
    "lng": 109.2358631,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m9tzfu7dcapw02@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m9tzfu7dcapw02@resize_ss640x400"
    ],
    "description": "Quán Lẩu Ly & Tokbokki - 22C Phan Bội Châu tọa lạc tại 22C Phan Bội Châu, P. Lê Lợi, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Lẩu Ly & Tokbokki - 22C Phan Bội Châu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3837264",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Ly & Tokbokki - 22C Phan Bội Châu",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-ly-tokbokki-22c-phan-boi-chau",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20Ly%20%26%20Tokbokki%20-%2022C%20Phan%20B%E1%BB%99i%20Ch%C3%A2u",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 273,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Phá Lấu Ông Hoàng - Mỳ Trộn Indomie - Nguyễn Thái Học",
    "address": "169 Nguyễn Thái Học, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.3,
    "distanceText": "Cách bạn 1.3km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7699742,
    "longitude": 109.2180128,
    "lat": 13.7699742,
    "lng": 109.2180128,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m8h9tfnkkdwu1c@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ra0g-m8h9tfnkkdwu1c@resize_ss640x400"
    ],
    "description": "Quán Phá Lấu Ông Hoàng - Mỳ Trộn Indomie - Nguyễn Thái Học tọa lạc tại 169 Nguyễn Thái Học, P. Ngô Mây, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Phá Lấu Ông Hoàng - Mỳ Trộn Indomie - Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3837401",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Phá Lấu Ông Hoàng - Mỳ Trộn Indomie - Nguyễn Thái Học",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/pha-lau-ong-hoang-my-tron-indomie-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ph%C3%A1%20L%E1%BA%A5u%20%C3%94ng%20Ho%C3%A0ng%20-%20M%E1%BB%B3%20Tr%E1%BB%99n%20Indomie%20-%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 274,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Bò Ba Toa Quán Gỗ Đậm Vị",
    "restaurant": "Lẩu Bò Hiền Hoà - 275 Bạch Đằng",
    "address": "275 Bạch Đằng, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.3,
    "distanceText": "Cách bạn 1.3km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7778476,
    "longitude": 109.2306837,
    "lat": 13.7778476,
    "lng": 109.2306837,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "description": "Quán Lẩu Bò Hiền Hoà - 275 Bạch Đằng tọa lạc tại 275 Bạch Đằng, P. Trần Hưng Đạo, phục vụ món Lẩu Bò Ba Toa Quán Gỗ Đậm Vị hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Bò Ba Toa Quán Gỗ Đậm Vị tại Lẩu Bò Hiền Hoà - 275 Bạch Đằng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3837538",
    "menu": [
      {
        "name": "Lẩu Bò Ba Toa Quán Gỗ Đậm Vị",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Bò Hiền Hoà - 275 Bạch Đằng",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 275,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Lẫu Mắm Pà Má",
    "address": "70 Nam Cao, P. Ghềnh Ráng",
    "district": "Tp. Qui Nhơn",
    "distance": 4.6,
    "distanceText": "Cách bạn 4.6km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.741952,
    "longitude": 109.2091803,
    "lat": 13.741952,
    "lng": 109.2091803,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lwe7c749hcd765@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lwe7c749hcd765@resize_ss640x400"
    ],
    "description": "Quán Lẫu Mắm Pà Má tọa lạc tại 70 Nam Cao, P. Ghềnh Ráng, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Lẫu Mắm Pà Má cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3837675",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẫu Mắm Pà Má",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-mam-pa-ma",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%ABu%20M%E1%BA%AFm%20P%C3%A0%20M%C3%A1",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 276,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Phá Lấu Oshi - 43 Nguyễn Nhạc",
    "address": "43 Nguyễn Nhạc, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7639519,
    "longitude": 109.2187817,
    "lat": 13.7639519,
    "lng": 109.2187817,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mr1mmo4uj286b0@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-81ztc-mr1mmo4uj286b0@resize_ss640x400"
    ],
    "description": "Quán Phá Lấu Oshi - 43 Nguyễn Nhạc tọa lạc tại 43 Nguyễn Nhạc, P. Ngô Mây, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Phá Lấu Oshi - 43 Nguyễn Nhạc cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3837812",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Phá Lấu Oshi - 43 Nguyễn Nhạc",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/pha-lau-oshi-43-nguyen-nhac",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Ph%C3%A1%20L%E1%BA%A5u%20Oshi%20-%2043%20Nguy%E1%BB%85n%20Nh%E1%BA%A1c",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 277,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Lẩu Gà 97 - Phó Đức Chính",
    "address": "97 Phó Đức Chính, P. Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 0.6,
    "distanceText": "Cách bạn 550m",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7778387,
    "longitude": 109.2224868,
    "lat": 13.7778387,
    "lng": 109.2224868,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m1wq9z3zvsczd1@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m1wq9z3zvsczd1@resize_ss640x400"
    ],
    "description": "Quán Lẩu Gà 97 - Phó Đức Chính tọa lạc tại 97 Phó Đức Chính, P. Lê Hồng Phong, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Lẩu Gà 97 - Phó Đức Chính cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3837949",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Lẩu Gà 97 - Phó Đức Chính",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/lau-ga-97-pho-duc-chinh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=L%E1%BA%A9u%20G%C3%A0%2097%20-%20Ph%C3%B3%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 278,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
    "restaurant": "Cá Lóc Cô Sáu - Phan Đình Phùng",
    "address": "22A Phan Đình Phùng, P. Trần Hưng Đạo",
    "district": "Tp. Qui Nhơn",
    "distance": 1.0,
    "distanceText": "Cách bạn 950m",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7777904,
    "longitude": 109.227504,
    "lat": 13.7777904,
    "lng": 109.227504,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7ras8-mdfykyo72y3z46@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7ras8-mdfykyo72y3z46@resize_ss640x400"
    ],
    "description": "Quán Cá Lóc Cô Sáu - Phan Đình Phùng tọa lạc tại 22A Phan Đình Phùng, P. Trần Hưng Đạo, phục vụ món Cá Tà Ma Nướng Than Hoa Muối Ớt hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cá Tà Ma Nướng Than Hoa Muối Ớt tại Cá Lóc Cô Sáu - Phan Đình Phùng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3838086",
    "menu": [
      {
        "name": "Cá Tà Ma Nướng Than Hoa Muối Ớt",
        "price": "60.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Cá Lóc Cô Sáu - Phan Đình Phùng",
        "price": "280.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ca-loc-co-sau-phan-dinh-phung",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=C%C3%A1%20L%C3%B3c%20C%C3%B4%20S%C3%A1u%20-%20Phan%20%C4%90%C3%ACnh%20Ph%C3%B9ng",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 279,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "GreenMart - 69 Trần Cao Vân",
    "address": "69, Trần Cao Vân",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.771285,
    "longitude": 109.230522,
    "lat": 13.771285,
    "lng": 109.230522,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "description": "Quán GreenMart - 69 Trần Cao Vân tọa lạc tại 69, Trần Cao Vân, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại GreenMart - 69 Trần Cao Vân cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3838223",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt GreenMart - 69 Trần Cao Vân",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 280,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Đặc Khu Nhậu - Bùi Hữu Nghĩa",
    "address": "Lô 13 - 14 Bùi Hữu Nghĩa, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.8,
    "distanceText": "Cách bạn 2.8km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7572512,
    "longitude": 109.2149139,
    "lat": 13.7572512,
    "lng": 109.2149139,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m9a2rwni1qh0e0@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m9a2rwni1qh0e0@resize_ss640x400"
    ],
    "description": "Quán Đặc Khu Nhậu - Bùi Hữu Nghĩa tọa lạc tại Lô 13 - 14 Bùi Hữu Nghĩa, P. Nguyễn Văn Cừ, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Đặc Khu Nhậu - Bùi Hữu Nghĩa cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3838360",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Đặc Khu Nhậu - Bùi Hữu Nghĩa",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/dac-khu-nhau-bui-huu-nghia",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C4%90%E1%BA%B7c%20Khu%20Nh%E1%BA%ADu%20-%20B%C3%B9i%20H%E1%BB%AFu%20Ngh%C4%A9a",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 281,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Ẩm Thực Chay Pháp Luân - Hàm Nghi",
    "address": "10 Đường Hàm Nghi, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 5,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7642617,
    "longitude": 109.2164048,
    "lat": 13.7642617,
    "lng": 109.2164048,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "description": "Quán Ẩm Thực Chay Pháp Luân - Hàm Nghi tọa lạc tại 10 Đường Hàm Nghi, P. Ngô Mây, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Ẩm Thực Chay Pháp Luân - Hàm Nghi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3838497",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ẩm Thực Chay Pháp Luân - Hàm Nghi",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 282,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Nẫu Cuốn - 84 86 88 Đống Đa",
    "address": "84 - 86 - 88 Đống Đa, P. Thị Nại",
    "district": "Tp. Qui Nhơn",
    "distance": 0.5,
    "distanceText": "Cách bạn 450m",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 10,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7845925,
    "longitude": 109.2229716,
    "lat": 13.7845925,
    "lng": 109.2229716,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "description": "Quán Nẫu Cuốn - 84 86 88 Đống Đa tọa lạc tại 84 - 86 - 88 Đống Đa, P. Thị Nại, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Nẫu Cuốn - 84 86 88 Đống Đa cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3838634",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Nẫu Cuốn - 84 86 88 Đống Đa",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 283,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "DÊ KHÔNG TÊN - 52 Bình Hà",
    "address": "52 Bình Hà, P. Thị Nại",
    "district": "Tp. Qui Nhơn",
    "distance": 1.4,
    "distanceText": "Cách bạn 1.4km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 15,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.781348,
    "longitude": 109.2325038,
    "lat": 13.781348,
    "lng": 109.2325038,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "budget",
      "celebrate",
      "late_night"
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
    "description": "Quán DÊ KHÔNG TÊN - 52 Bình Hà tọa lạc tại 52 Bình Hà, P. Thị Nại, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại DÊ KHÔNG TÊN - 52 Bình Hà cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3838771",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt DÊ KHÔNG TÊN - 52 Bình Hà",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 284,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "XÓM TIÊU QUÁN - 71 Xuân Thuỷ",
    "address": "71 Xuân Thuỷ, P. Quang Trung",
    "district": "Tp. Qui Nhơn",
    "distance": 2.7,
    "distanceText": "Cách bạn 2.7km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 20,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7629459,
    "longitude": 109.2048047,
    "lat": 13.7629459,
    "lng": 109.2048047,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg1ntkb1qfwv55@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg1ntkb1qfwv55@resize_ss640x400"
    ],
    "description": "Quán XÓM TIÊU QUÁN - 71 Xuân Thuỷ tọa lạc tại 71 Xuân Thuỷ, P. Quang Trung, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại XÓM TIÊU QUÁN - 71 Xuân Thuỷ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3838908",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt XÓM TIÊU QUÁN - 71 Xuân Thuỷ",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/xom-tieu-quan-71-xuan-thuy",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=X%C3%93M%20TI%C3%8AU%20QU%C3%81N%20-%2071%20Xu%C3%A2n%20Thu%E1%BB%B7",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 285,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "ẨM THỰC CHAY MINH AN VEGAN",
    "address": "28 Nguyễn Thị Định, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.2,
    "distanceText": "Cách bạn 2.2km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 25,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7623578,
    "longitude": 109.2167193,
    "lat": 13.7623578,
    "lng": 109.2167193,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "description": "Quán ẨM THỰC CHAY MINH AN VEGAN tọa lạc tại 28 Nguyễn Thị Định, P. Nguyễn Văn Cừ, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại ẨM THỰC CHAY MINH AN VEGAN cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3839045",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt ẨM THỰC CHAY MINH AN VEGAN",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 286,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Út Đen - Lẩu Mang Về - Ngô Đức Đệ",
    "address": "8 Ngô Đức Đệ, KV 4",
    "district": "Tp. Qui Nhơn",
    "distance": 3.0,
    "distanceText": "Cách bạn 3.0km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 30,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.756186,
    "longitude": 109.211311,
    "lat": 13.756186,
    "lng": 109.211311,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mu28eh5halfl9f@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mu28eh5halfl9f@resize_ss640x400"
    ],
    "description": "Quán Út Đen - Lẩu Mang Về - Ngô Đức Đệ tọa lạc tại 8 Ngô Đức Đệ, KV 4, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Út Đen - Lẩu Mang Về - Ngô Đức Đệ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3839182",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Út Đen - Lẩu Mang Về - Ngô Đức Đệ",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ut-den-lau-mang-ve-ngo-duc-de",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=%C3%9At%20%C4%90en%20-%20L%E1%BA%A9u%20Mang%20V%E1%BB%81%20-%20Ng%C3%B4%20%C4%90%E1%BB%A9c%20%C4%90%E1%BB%87",
    "deliveryTime": "30 - 45 phút",
    "deliveryFee": "22.000đ (Áp mã Freeship)",
    "deliveryFeeVal": 22000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 287,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Ếch Xanh Quy Nhơn - Lô 03 Trương Văn Của",
    "address": "3 Trương Văn Của, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 3.1,
    "distanceText": "Cách bạn 3.1km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 35,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.754667,
    "longitude": 109.213843,
    "lat": 13.754667,
    "lng": 109.213843,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "description": "Quán Ếch Xanh Quy Nhơn - Lô 03 Trương Văn Của tọa lạc tại 3 Trương Văn Của, P. Nguyễn Văn Cừ, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Ếch Xanh Quy Nhơn - Lô 03 Trương Văn Của cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3839319",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ếch Xanh Quy Nhơn - Lô 03 Trương Văn Của",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 288,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn",
    "restaurant": "Gánh Cua Mợ Út - Bánh Canh Cua, Lẩu Cua & Cơm Cua - 55 Biên Cương, Quy Nhơn",
    "address": "55 Biên Cương, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "60.000đ - 280.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 40,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "seafood",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7658982,
    "longitude": 109.217883,
    "lat": 13.7658982,
    "lng": 109.217883,
    "moodIds": [
      "late_night",
      "chill",
      "spicy",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
      "late_night"
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
    "description": "Quán Gánh Cua Mợ Út - Bánh Canh Cua, Lẩu Cua & Cơm Cua - 55 Biên Cương, Quy Nhơn tọa lạc tại 55 Biên Cương, P. Ngô Mây, phục vụ món Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Cua Huỳnh Đế Hấp Nước Dừa Biển Quy Nhơn tại Gánh Cua Mợ Út - Bánh Canh Cua, Lẩu Cua & Cơm Cua - 55 Biên Cương, Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3839456",
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
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 289,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
    "restaurant": "Pepa’s Kitchen - 245 Nguyễn Thị Minh Khai",
    "address": "245 Nguyễn Thị Minh Khai, P. Nguyễn Văn Cừ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.1,
    "distanceText": "Cách bạn 2.1km",
    "priceRange": "150.000đ - 350.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 45,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "hotpot",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763539,
    "longitude": 109.2148242,
    "lat": 13.763539,
    "lng": 109.2148242,
    "moodIds": [
      "comfort",
      "chill",
      "craving",
      "celebrate",
      "celebrate",
      "late_night"
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
    "description": "Quán Pepa’s Kitchen - 245 Nguyễn Thị Minh Khai tọa lạc tại 245 Nguyễn Thị Minh Khai, P. Nguyễn Văn Cừ, phục vụ món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Lẩu Hải Sản Nấm Chua Cay Khổng Lồ tại Pepa’s Kitchen - 245 Nguyễn Thị Minh Khai cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3839593",
    "menu": [
      {
        "name": "Lẩu Hải Sản Nấm Chua Cay Khổng Lồ",
        "price": "150.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Pepa’s Kitchen - 245 Nguyễn Thị Minh Khai",
        "price": "350.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 290,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Quán Nướng 40 - 19 Phạm Ngũ Lão",
    "address": "19 Phạm Ngũ Lão, P. Lê Hồng Phong",
    "district": "Tp. Qui Nhơn",
    "distance": 1.1,
    "distanceText": "Cách bạn 1.1km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 50,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.772499,
    "longitude": 109.2187684,
    "lat": 13.772499,
    "lng": 109.2187684,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m2twt8qn77rad4@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m2twt8qn77rad4@resize_ss640x400"
    ],
    "description": "Quán Quán Nướng 40 - 19 Phạm Ngũ Lão tọa lạc tại 19 Phạm Ngũ Lão, P. Lê Hồng Phong, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Quán Nướng 40 - 19 Phạm Ngũ Lão cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3839730",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Nướng 40 - 19 Phạm Ngũ Lão",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-nuong-40-19-pham-ngu-lao",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20N%C6%B0%E1%BB%9Bng%2040%20-%2019%20Ph%E1%BA%A1m%20Ng%C5%A9%20L%C3%A3o",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 291,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Quán Nướng Happy - Xuân Diệu",
    "address": "290 Xuân Diệu, P. Trần Phú",
    "district": "Tp. Qui Nhơn",
    "distance": 1.9,
    "distanceText": "Cách bạn 1.9km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 55,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7666926,
    "longitude": 109.2281082,
    "lat": 13.7666926,
    "lng": 109.2281082,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbwodmzlaxf3@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbwodmzlaxf3@resize_ss640x400"
    ],
    "description": "Quán Quán Nướng Happy - Xuân Diệu tọa lạc tại 290 Xuân Diệu, P. Trần Phú, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Quán Nướng Happy - Xuân Diệu cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3839867",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Quán Nướng Happy - Xuân Diệu",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-nuong-happy-xuan-dieu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Qu%C3%A1n%20N%C6%B0%E1%BB%9Bng%20Happy%20-%20Xu%C3%A2n%20Di%E1%BB%87u",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 292,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "QUÁN NƯỚNG 2H - Hẻm 122/2 Hoàng Văn Thụ",
    "address": "122/2, Hoàng Văn Thụ",
    "district": "Tp. Qui Nhơn",
    "distance": 2.3,
    "distanceText": "Cách bạn 2.3km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 60,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7635948,
    "longitude": 109.21001,
    "lat": 13.7635948,
    "lng": 109.21001,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lxv75jcrrye3e6@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lxv75jcrrye3e6@resize_ss640x400"
    ],
    "description": "Quán QUÁN NƯỚNG 2H - Hẻm 122/2 Hoàng Văn Thụ tọa lạc tại 122/2, Hoàng Văn Thụ, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại QUÁN NƯỚNG 2H - Hẻm 122/2 Hoàng Văn Thụ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3840004",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt QUÁN NƯỚNG 2H - Hẻm 122/2 Hoàng Văn Thụ",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/quan-nuong-2h-hem-1222-hoang-van-thu",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=QU%C3%81N%20N%C6%AF%E1%BB%9ANG%202H%20-%20H%E1%BA%BBm%20122/2%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 293,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Tiệm Bé Bòn - Bánh Tráng Nướng - Trần Thị Kỷ",
    "address": "23 Trần Thị Kỷ, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 65,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7689281,
    "longitude": 109.2191302,
    "lat": 13.7689281,
    "lng": 109.2191302,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mn7hu6tn4dfn36@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mn7hu6tn4dfn36@resize_ss640x400"
    ],
    "description": "Quán Tiệm Bé Bòn - Bánh Tráng Nướng - Trần Thị Kỷ tọa lạc tại 23 Trần Thị Kỷ, P. Ngô Mây, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Tiệm Bé Bòn - Bánh Tráng Nướng - Trần Thị Kỷ cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3840141",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Tiệm Bé Bòn - Bánh Tráng Nướng - Trần Thị Kỷ",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 294,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Gà Chỉ Quy Nhơn Nướng Muối Ớt Mật Ong",
    "restaurant": "Ăn Vặt Sáu Lượng - Bánh Tráng Nướng, Trứng Nướng & Chân Gà Sốt Thái",
    "address": "24 Nguyễn Lữ, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 2.0,
    "distanceText": "Cách bạn 2.0km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 70,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.763796,
    "longitude": 109.217918,
    "lat": 13.763796,
    "lng": 109.217918,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m6nf70vcrxr505@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-7ra0g-m6nf70vcrxr505@resize_ss640x400"
    ],
    "description": "Quán Ăn Vặt Sáu Lượng - Bánh Tráng Nướng, Trứng Nướng & Chân Gà Sốt Thái tọa lạc tại 24 Nguyễn Lữ, P. Ngô Mây, phục vụ món Gà Chỉ Quy Nhơn Nướng Muối Ớt Mật Ong hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Gà Chỉ Quy Nhơn Nướng Muối Ớt Mật Ong tại Ăn Vặt Sáu Lượng - Bánh Tráng Nướng, Trứng Nướng & Chân Gà Sốt Thái cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3840278",
    "menu": [
      {
        "name": "Gà Chỉ Quy Nhơn Nướng Muối Ớt Mật Ong",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Ăn Vặt Sáu Lượng - Bánh Tráng Nướng, Trứng Nướng & Chân Gà Sốt Thái",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 295,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Bánh Tráng Nướng, Tráng Trộn & Trà Trái Cây - 65B Hàm Nghi",
    "address": "65B Hàm Nghi, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.6,
    "distanceText": "Cách bạn 1.6km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 75,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7679936,
    "longitude": 109.2183282,
    "lat": 13.7679936,
    "lng": 109.2183282,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg24ivz7t6a45b@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-820l4-mg24ivz7t6a45b@resize_ss640x400"
    ],
    "description": "Quán Bánh Tráng Nướng, Tráng Trộn & Trà Trái Cây - 65B Hàm Nghi tọa lạc tại 65B Hàm Nghi, P. Ngô Mây, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Bánh Tráng Nướng, Tráng Trộn & Trà Trái Cây - 65B Hàm Nghi cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3840415",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bánh Tráng Nướng, Tráng Trộn & Trà Trái Cây - 65B Hàm Nghi",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/banh-trang-nuong-trang-tron-tra-trai-cay-65b-ham-nghi",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%A1nh%20Tr%C3%A1ng%20N%C6%B0%E1%BB%9Bng%2C%20Tr%C3%A1ng%20Tr%E1%BB%99n%20%26%20Tr%C3%A0%20Tr%C3%A1i%20C%C3%A2y%20-%2065B%20H%C3%A0m%20Nghi",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 296,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Bún Thịt Nướng & Nem Chả Hoà - Quy Nhơn",
    "address": "66A Trần Cao Vân, P. Lê Lợi",
    "district": "Tp. Qui Nhơn",
    "distance": 1.5,
    "distanceText": "Cách bạn 1.5km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 80,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7727397,
    "longitude": 109.230168,
    "lat": 13.7727397,
    "lng": 109.230168,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
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
    "description": "Quán Bún Thịt Nướng & Nem Chả Hoà - Quy Nhơn tọa lạc tại 66A Trần Cao Vân, P. Lê Lợi, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Bún Thịt Nướng & Nem Chả Hoà - Quy Nhơn cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3840552",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Bún Thịt Nướng & Nem Chả Hoà - Quy Nhơn",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
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
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 297,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Nem Nướng Nha Trang The House - Nguyễn Thái Học",
    "address": "332/3/2 Nguyễn Thái Học, P. Ngô Mây",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 85,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7666802,
    "longitude": 109.2154528,
    "lat": 13.7666802,
    "lng": 109.2154528,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134259-820l4-mgn6ahx0bnk8f2@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134259-820l4-mgn6ahx0bnk8f2@resize_ss640x400"
    ],
    "description": "Quán Nem Nướng Nha Trang The House - Nguyễn Thái Học tọa lạc tại 332/3/2 Nguyễn Thái Học, P. Ngô Mây, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Nem Nướng Nha Trang The House - Nguyễn Thái Học cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3840689",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Nem Nướng Nha Trang The House - Nguyễn Thái Học",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/nem-nuong-nha-trang-the-house-nguyen-thai-hoc",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=Nem%20N%C6%B0%E1%BB%9Bng%20Nha%20Trang%20The%20House%20-%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 298,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "BÚN THỊT NƯỚNG 7 TĨNH",
    "address": "78 Đô Đốc Bảo, Quy Nhơn",
    "district": "Tp. Qui Nhơn",
    "distance": 1.8,
    "distanceText": "Cách bạn 1.8km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 90,
    "commentsCount": 5,
    "openTime": "07:00 - 22:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7659053,
    "longitude": 109.2228558,
    "lat": 13.7659053,
    "lng": 109.2228558,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lzk2inmbl5lt21@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lzk2inmbl5lt21@resize_ss640x400"
    ],
    "description": "Quán BÚN THỊT NƯỚNG 7 TĨNH tọa lạc tại 78 Đô Đốc Bảo, Quy Nhơn, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại BÚN THỊT NƯỚNG 7 TĨNH cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3840826",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt BÚN THỊT NƯỚNG 7 TĨNH",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/bun-thit-nuong-7-tinh",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=B%C3%9AN%20TH%E1%BB%8AT%20N%C6%AF%E1%BB%9ANG%207%20T%C4%A8NH",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE25K giảm 25.000đ",
    "deliveryPromoCode": "SHOPEE25K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 299,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Vịt Nướng Lu - Lê Hồng Phong",
    "address": "96 Nguyễn Thái Học, Quy Nhơn",
    "district": "Tp. Qui Nhơn",
    "distance": 0.9,
    "distanceText": "Cách bạn 850m",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 95,
    "commentsCount": 5,
    "openTime": "08:00 - 23:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7743688,
    "longitude": 109.2207248,
    "lat": 13.7743688,
    "lng": 109.2207248,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "budget",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbz7th6duh3b@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvbz7th6duh3b@resize_ss640x400"
    ],
    "description": "Quán Vịt Nướng Lu - Lê Hồng Phong tọa lạc tại 96 Nguyễn Thái Học, Quy Nhơn, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Vịt Nướng Lu - Lê Hồng Phong cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3840963",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Vịt Nướng Lu - Lê Hồng Phong",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/vit-nuong-lu-le-hong-phong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=V%E1%BB%8Bt%20N%C6%B0%E1%BB%9Bng%20Lu%20-%20L%C3%AA%20H%E1%BB%93ng%20Phong",
    "deliveryTime": "15 - 20 phút",
    "deliveryFee": "Freeship đơn từ 50k",
    "deliveryFeeVal": 0,
    "deliveryPromo": "Mã SHOPEE30K giảm 30.000đ",
    "deliveryPromoCode": "SHOPEE30K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  },
  {
    "id": 300,
    "cityId": "quynhon",
    "cityName": "Quy Nhơn",
    "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
    "restaurant": "Má Heo Nướng",
    "address": "57 - 59 Đặng Văn Ngữ",
    "district": "Tp. Qui Nhơn",
    "distance": 1.7,
    "distanceText": "Cách bạn 1.7km",
    "priceRange": "80.000đ - 220.000đ",
    "rating": 4.6,
    "reviewCount": 0,
    "likesCount": 0,
    "commentsCount": 5,
    "openTime": "06:00 - 21:30",
    "category": "bbq",
    "source": "ShopeeFood",
    "sourceIcon": "🛍️",
    "latitude": 13.7784301,
    "longitude": 109.2353242,
    "lat": 13.7784301,
    "lng": 109.2353242,
    "moodIds": [
      "late_night",
      "chill",
      "energetic",
      "celebrate",
      "comfort",
      "craving",
      "celebrate",
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
    "image": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc0mdd7744a5@resize_ss640x400",
    "gallery": [
      "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc0mdd7744a5@resize_ss640x400"
    ],
    "description": "Quán Má Heo Nướng tọa lạc tại 57 - 59 Đặng Văn Ngữ, phục vụ món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện hương vị đặc trưng biển Quy Nhơn. Hình ảnh thực tế từ nền tảng ShopeeFood.",
    "recommendReason": "Món Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện tại Má Heo Nướng cực chuẩn vị đặc sản Quy Nhơn, nguyên liệu tươi rói mỗi ngày!",
    "hotline": "0256 3841100",
    "menu": [
      {
        "name": "Bò Nướng Ngói Xì Xèo & Nem Nướng Chợ Huyện",
        "price": "80.000đ",
        "highlight": true
      },
      {
        "name": "Phần đặc biệt Má Heo Nướng",
        "price": "220.000đ",
        "highlight": false
      },
      {
        "name": "Trà đá / Nước suối",
        "price": "10.000đ",
        "highlight": false
      }
    ],
    "deliveryPlatform": "ShopeeFood",
    "deliveryUrl": "https://shopeefood.vn/binh-dinh/ma-heo-nuong",
    "deliverySearchUrl": "https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q=M%C3%A1%20Heo%20N%C6%B0%E1%BB%9Bng",
    "deliveryTime": "20 - 30 phút",
    "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
    "deliveryFeeVal": 16000,
    "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
    "deliveryPromoCode": "SHOPEE20K",
    "deliveryRating": "4.6 ⭐ (1.000+ đã bán)"
  }
]
};

if (typeof window !== 'undefined') {
  window.APP_DATA = APP_DATA;
}
