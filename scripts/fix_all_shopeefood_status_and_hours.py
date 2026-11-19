#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodTinder - Fix Operating Hours and Disable Non-Shopee Venues
1. Aligns openTime with real ShopeeFood delivery hours:
   - Phá lấu: 16:00 - 22:00
   - Quán ốc, chân gà nướng, lẩu nướng đêm: 16:00 - 23:00
   - Bánh tráng nướng, ăn vặt chiều (Bé Bòn Bon): 15:00 - 22:30
   - Trà sữa, nước ép, sinh tố chiều: 14:00 - 22:30
   - Cơm trưa / văn phòng: 10:00 - 14:30, 16:30 - 21:00
2. Disables ShopeeFood delivery on dine-in only, local points of interest, resorts, bars, gà chỉ, and unverified stalls.
"""

import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOOD_DATA_PATH = os.path.join(BASE_DIR, "food-data.json")
DATA_JS_PATH = os.path.join(BASE_DIR, "js", "data.js")

def adjust_open_time(f):
    name = (f.get('name', '') + ' ' + f.get('restaurant', '')).lower()
    cat = (f.get('category', '')).lower()
    full_text = f"{name} {cat}"
    ot = f.get('openTime', '')
    
    # 1. Phá lấu: ShopeeFood always opens after 16:00
    if 'phá lấu' in full_text:
        return "16:00 - 22:00", "Phá lấu ca chiều tối"
        
    # 2. Quán ốc, chân gà nướng/sốt Thái, tả pí lù, trứng vịt lộn, lẩu nướng đêm
    if any(k in full_text for k in ['quán ốc', 'ốc 94', 'ốc cô xí', 'ốc hảo', 'ốc hoa', 'ốc bích', 'chân gà', 'tả pí lù', 'trứng vịt lộn', 'lẩu nướng đêm', 'xiên que nướng']):
        if any(h in ot for h in ['07:30', '06:00', '07:00', '05:00', '08:00']):
            return "16:00 - 23:00", "Quán ốc/chân gà ca tối"
            
    # 3. Bánh tráng nướng, tiệm ăn vặt chiều (Bé Bòn Bon style)
    if any(k in full_text for k in ['bánh tráng nướng', 'bánh tráng trứng nướng', 'bò né & bò sốt me 23 trần thị kỷ', 'tiệm bé bòn']):
        if any(h in ot for h in ['07:30', '06:00', '07:00', '08:00']):
            return "15:00 - 22:30", "Bánh tráng nướng ca chiều 15h"
            
    # 4. Trà sữa, chè, sinh tố, nước ép chiều
    if any(k in full_text for k in ['trà sữa & ăn vặt', 'ăn vặt & trà sữa', 'sinh tố', 'nước ép, trái cây', 'kem bơ']):
        if any(h in ot for h in ['07:30', '06:00', '07:00']):
            return "14:00 - 22:30", "Trà sữa/sinh tố ca chiều 14h"
            
    # 5. Cơm tấm, cơm gà, cơm bình dân, cơm niêu: Nghỉ giữa trưa
    if any(k in full_text for k in ['cơm bình dân', 'cơm tấm', 'cơm niêu', 'cơm văn phòng']):
        if ot in ['07:30 - 22:00', '06:00 - 22:00', '08:00 - 22:00']:
            return "10:00 - 14:30, 16:30 - 21:00", "Cơm trưa & tối chia ca"

    # 6. Bánh hỏi cháo lòng, bún rạm, bún tôm (thường bán sáng, chiều tối mở lại)
    if any(k in full_text for k in ['bánh hỏi cháo lòng', 'cháo lòng', 'bún rạm', 'bún tôm đầm trà ổ']):
        if ot in ['07:30 - 22:00', '06:00 - 22:00', '08:00 - 22:00']:
            return "06:00 - 11:30, 16:30 - 21:00", "Bún rạm/cháo lòng sáng & chiều"

    return ot, None

def is_non_shopee_venue(f):
    name = (f.get('name', '') + ' ' + f.get('restaurant', '')).lower()
    addr = f.get('address', '').lower()
    cat = (f.get('category', '')).lower()
    full_text = f"{name} {addr} {cat}"
    
    # 1. Bar, pub, club, lounge, karaoke, bia hơi, quán nhậu, bida, massage
    if re.search(r'\b(quán nhậu|quan nhau|bia hơi|bia tươi|craft beer|beer club|bar &|pub &|\bbar\b|\bpub\b|\bclub\b|\blounge\b|\bkaraoke\b|\bbida\b|\bbilliards\b|\bmassage\b|\bspa\b)\b', full_text):
        if any(k in name for k in ['surf bar', 'karaoke', 'bar', 'pub', 'nhậu', 'beer', 'bida', 'billiards', 'massage']):
            return True, 'Bar/Pub/Nhậu/Giải trí tại chỗ'
        
    # 2. Gà chỉ (quán ăn sườn đồi / sân vườn tại chỗ)
    if 'gà chỉ' in name or 'ga chi' in name or 'sườn đồi' in name:
        return True, 'Gà chỉ ăn tại chỗ'
        
    # 3. Hải sản bè, ven biển, resort, tiệc cưới
    if re.search(r'\b(resort|tiệc cưới|hội nghị|tiệc hội|cù lao xanh|hòn khô|kỳ co|eo gió|bờ kè|hải sản ven biển|hải sản tươi sống)\b', full_text):
        if any(k in name for k in ['nhà hàng hải sản', 'hải sản tươi sống', 'hải sản ven biển', 'bờ biển', 'bờ kè', 'tiệc cưới', 'resort', 'surf bar', 'cù lao xanh', 'hòn khô']):
            return True, 'Hải sản ven biển / Resort'
            
    # 4. Quán vỉa hè 0 review không tên tuổi / xe đẩy
    rev = f.get('reviewCount', 0)
    rating = f.get('rating', 0)
    if rev == 0 and rating == 0:
        if re.search(r'\b(cháo lòng|bánh hỏi cháo lòng|nước mía|bánh ram|xe đẩy|vỉa hè|bánh mì vỉa hè|phở vỉa hè|bánh canh vỉa hè)\b', full_text):
            return True, 'Vỉa hè 0 review không giao hàng'

    return False, 'Hợp lệ'

def main():
    with open(FOOD_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    is_dict = isinstance(data, dict)
    foods = data.get("foods", []) if is_dict else data

    hours_updated = 0
    shopee_disabled = 0

    for f in foods:
        # 1. Update hours
        new_ot, h_reason = adjust_open_time(f)
        if new_ot != f.get("openTime"):
            f["openTime"] = new_ot
            hours_updated += 1
            # print(f"  [Hours] {f.get('id')} - {f.get('restaurant')}: {new_ot} ({h_reason})")

        # 2. Check Shopee delivery
        if f.get("hasShopeeDelivery") is not False:
            bad, reason = is_non_shopee_venue(f)
            if bad:
                f["hasShopeeDelivery"] = False
                f["deliveryPlatform"] = ""
                f["deliveryUrl"] = ""
                f["deliverySearchUrl"] = ""
                f["deliveryTime"] = ""
                f["deliveryFee"] = ""
                f["deliveryFeeVal"] = 0
                f["deliveryPromo"] = ""
                f["deliveryRating"] = ""
                shopee_disabled += 1
                # print(f"  [Disabled Shopee] {f.get('id')} - {f.get('restaurant')}: {reason}")

    print(f"\n📊 SUMMARY:")
    print(f"  - Operating hours updated: {hours_updated} venues")
    print(f"  - Non-delivery venues disabled: {shopee_disabled} venues")

    # Save to food-data.json
    with open(FOOD_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✅ Successfully updated food-data.json")

    # Update js/data.js
    if os.path.exists(DATA_JS_PATH):
        with open(DATA_JS_PATH, "r", encoding="utf-8") as f:
            js_content = f.read()

        start_marker = "  foods: ["
        end_marker = "\n  ]\n};"
        start_idx = js_content.find(start_marker)
        end_idx = js_content.find(end_marker, start_idx)

        if start_idx != -1 and end_idx != -1:
            foods_json_str = json.dumps(foods, ensure_ascii=False, indent=6)
            trimmed_json = foods_json_str.strip()
            if trimmed_json.startswith("[") and trimmed_json.endswith("]"):
                trimmed_json = trimmed_json[1:-1].strip()
            new_section = f"  foods: [\n      {trimmed_json}\n  ]\n}};"
            new_content = js_content[:start_idx] + new_section + js_content[end_idx + len(end_marker):]
            with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
                f.write(new_content)
            print("✅ Successfully synchronized js/data.js")

if __name__ == "__main__":
    main()
