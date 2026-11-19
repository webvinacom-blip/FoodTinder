#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodTinder - Audit and Clean Non-ShopeeFood Delivery Venues
Identifies dine-in only, local street stalls, and seaside restaurants that do not participate in ShopeeFood delivery.
Sets hasShopeeDelivery: false and clears synthetic delivery URLs.
"""

import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOOD_DATA_PATH = os.path.join(BASE_DIR, "food-data.json")
DATA_JS_PATH = os.path.join(BASE_DIR, "js", "data.js")

VERIFIED_SHOPEE_BRANDS = [
  'kfc', 'jollibee', 'lotteria', 'pizza hut', 'the pizza company', 'chicken plus',
  'five star', 'gà rán fkt', 'fkt', 'gà rán chicky', 'chicky',
  'bobapop', 'gong cha', 'phúc long', 'phuc long', 'tocotoco', 'ding tea',
  'mixue', 'highlands coffee', 'highlands', 'the coffee house', 'pozaa tea', 'heekcaa',
  'mì cay sasin', 'mi cay sasin', 'mì cay seoul', 'mi cay seoul', 'chè liên'
]

def is_non_shopee_venue(f):
    name = (f.get('name', '') + ' ' + f.get('restaurant', '')).lower()
    addr = f.get('address', '').lower()
    cat = (f.get('category', '')).lower()
    full_text = f"{name} {addr} {cat}"
    
    # 0. Buffet, lẩu băng chuyền, lẩu nướng tại bàn (Kichi, Manwah, Dookki, v.v.)
    if re.search(r'\b(kichi|manwah|dookki|sumo bbq|king bbq|gogi|sukishi|lẩu băng chuyền|lau bang chuyen|buffet|vé buffet|suất buffet)\b', full_text):
        return True, 'Buffet/Lẩu băng chuyền'

    # 1. Bar, pub, club, lounge, karaoke, bia hơi, quán nhậu
    if re.search(r'\b(quán nhậu|quan nhau|bia hơi|bia tươi|craft beer|beer club|bar &|pub &|\bbar\b|\bpub\b|\bclub\b|\blounge\b|\bkaraoke\b|\bbida\b|\bbilliards\b|\bmassage\b|\bspa\b)\b', full_text):
        if any(k in name for k in ['surf bar', 'karaoke', 'bar', 'pub', 'nhậu', 'beer']):
            return True, 'Bar/Pub/Nhậu'
        
    # 2. Gà chỉ (quán ăn sườn đồi / sân vườn tại chỗ)
    if 'gà chỉ' in name or 'ga chi' in name:
        return True, 'Gà chỉ ăn tại chỗ'
        
    # 3. Hải sản bè, ven biển, resort, tiệc cưới
    if re.search(r'\b(resort|tiệc cưới|hội nghị|tiệc hội|cù lao xanh|hòn khô|kỳ co|eo gió|bè nổi|hải sản ven biển|hải sản tươi sống)\b', full_text):
        if any(k in name for k in ['nhà hàng hải sản', 'hải sản tươi sống', 'hải sản ven biển', 'bờ biển', 'bờ kè', 'tiệc cưới', 'resort', 'surf bar', 'cù lao xanh', 'hòn khô']):
            return True, 'Hải sản ven biển / Resort'
            
    # 4. Quán không có thông tin rating & review (chưa từng hoạt động trên ShopeeFood / vỉa hè Foody)
    is_brand = any(b in full_text for b in VERIFIED_SHOPEE_BRANDS)
    raw_rating = f.get('rating', 0)
    try:
        rating = float(raw_rating)
    except:
        rating = 0.0
    reviews = int(f.get('reviewCount', 0) or f.get('totalReviews', 0) or 0)
    
    if not is_brand and not f.get('isShopeeVerified') and rating <= 0 and reviews <= 0:
        return True, 'Không có thông tin đánh giá ShopeeFood'

    return False, 'Hợp lệ'

def main():
    with open(FOOD_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    is_dict = isinstance(data, dict)
    foods = data.get("foods", []) if is_dict else data

    updated_count = 0
    updated_ids = set()

    for f in foods:
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
                updated_count += 1
                updated_ids.add(f.get("id"))
                print(f"Disabled Shopee for ID {f.get('id')}: {f.get('restaurant')} [{reason}]")

    print(f"\n✅ Total disabled venues: {updated_count}")

    # Write back to food-data.json
    with open(FOOD_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✅ Successfully updated food-data.json")

    # Update js/data.js
    if os.path.exists(DATA_JS_PATH):
        with open(DATA_JS_PATH, "r", encoding="utf-8") as f:
            js_content = f.read()

        start_marker = "  foods: ["
        end_marker = "\n};\n\n\n// Đảm bảo tất cả quán ăn đều có giờ đóng/mở"
        start_idx = js_content.find(start_marker)
        end_idx = js_content.find(end_marker, start_idx)

        if start_idx != -1 and end_idx != -1:
            foods_json_str = json.dumps(foods, ensure_ascii=False, indent=4)
            # Indent each line with 2 spaces
            indented_lines = []
            for line in foods_json_str.split("\n"):
                if line.strip():
                    indented_lines.append("  " + line)
                else:
                    indented_lines.append("")
            new_section = "  foods: " + "\n".join(indented_lines).strip()
            new_content = js_content[:start_idx] + new_section + js_content[end_idx:]
            with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
                f.write(new_content)
            print("✅ Successfully updated js/data.js with cleaned dataset")
        else:
            print(f"❌ Could not find markers in js/data.js (start_idx={start_idx}, end_idx={end_idx})")

if __name__ == "__main__":
    main()
