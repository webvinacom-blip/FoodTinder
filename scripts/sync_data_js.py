import json

with open('food-data.json', 'r', encoding='utf-8') as f:
    food_data = json.load(f)
foods = food_data['foods']

with open('js/data.js', 'r', encoding='utf-8') as f:
    js_text = f.read()

# 1. Add MOOD_ATTRIBUTE_MATRIX and PRESEEDED_CROWD_WISDOM near the top if not present
matrix_code = """
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
"""

if 'MOOD_ATTRIBUTE_MATRIX' not in js_text:
    js_text = matrix_code + "\n\n" + js_text

# 2. Add 'stress' mood into APP_DATA.moods if not present
if '"stress"' not in js_text:
    stress_mood = """    {
      id: "stress",
      emoji: "🤯",
      label: "Xả stress",
      color: "#E17055",
      glow: "rgba(225, 112, 85, 0.4)",
      desc: "Cần đồ cay xé lưỡi kích thích endorphin hoặc đồ giòn rụm nhai xả stress cực đã",
      tags: ["#Xả_stress", "#Đồ_cay", "#Giòn_rụm", "#Cay_xé_lưỡi", "#Nhai_đã_miệng"]
    },"""
    target = 'moods: [\n'
    if target in js_text:
        js_text = js_text.replace(target, target + stress_mood + "\n")

# 3. Replace foods: [ ... ] with updated foods
start_marker = '  foods: ['
end_marker = '\n};\n\nif (typeof window !== \'undefined\') {\n  window.APP_DATA = APP_DATA;\n}'

start_pos = js_text.find(start_marker)
end_pos = js_text.find(end_marker, start_pos)

if start_pos != -1 and end_pos != -1:
    foods_json = json.dumps(foods, ensure_ascii=False, indent=2)
    # indent by 2 spaces for formatting
    indented_foods = '\n'.join(('  ' + line if line.strip() else line) for line in foods_json.split('\n'))
    new_foods_block = f"  foods: {indented_foods.strip()}"
    js_text = js_text[:start_pos] + new_foods_block + js_text[end_pos:]
    print("Successfully replaced foods in js/data.js!")
else:
    print(f"Markers not matched: start={start_pos}, end={end_pos}")

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(js_text)

print("Updated js/data.js complete.")
