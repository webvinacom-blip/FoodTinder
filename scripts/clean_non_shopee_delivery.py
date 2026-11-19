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

def is_non_shopee_venue(f):
    name = (f.get('name', '') + ' ' + f.get('restaurant', '')).lower()
    addr = f.get('address', '').lower()
    cat = (f.get('category', '')).lower()
    full_text = f"{name} {addr} {cat}"
    
    # 1. Bar, pub, club, lounge, karaoke, bia hơi, quán nhậu
    if re.search(r'\b(quán nhậu|quan nhau|bia hơi|bia tươi|craft beer|beer club|bar &|pub &|\bbar\b|\bpub\b|\bclub\b|\blounge\b|\bkaraoke\b|\bbida\b|\bbilliards\b|\bmassage\b|\bspa\b)\b', full_text):
        if any(k in name for k in ['surf bar', 'karaoke', 'bar', 'pub', 'nhậu', 'beer']):
            return True, 'Bar/Pub/Nhậu'
        
    # 2. Gà chỉ (quán ăn sườn đồi / sân vườn tại chỗ)
    if 'gà chỉ' in name or 'ga chi' in name:
        return True, 'Gà chỉ ăn tại chỗ'
        
    # 3. Hải sản bè, ven biển, resort, tiệc cưới
    if re.search(r'\b(resort|tiệc cưới|hội nghị|tiệc hội|cù lao xanh|hòn khô|kỳ co|eo gió|bờ kè|hải sản ven biển|hải sản tươi sống)\b', full_text):
        if any(k in name for k in ['nhà hàng hải sản', 'hải sản tươi sống', 'hải sản ven biển', 'bờ biển', 'bờ kè', 'tiệc cưới', 'resort', 'surf bar', 'cù lao xanh', 'hòn khô']):
            return True, 'Hải sản ven biển / Resort'
            
    # 4. Quán vỉa hè 0 review không tên tuổi / xe đẩy (nước mía, bánh ram, cháo lòng vỉa hè)
    rev = f.get('reviewCount', 0)
    rating = f.get('rating', 0)
    if rev == 0 or rating == 0:
        if re.search(r'\b(cháo lòng|bánh hỏi cháo lòng|nước mía|bánh ram|xe đẩy|vỉa hè|bánh mì vỉa hè|phở vỉa hè)\b', full_text):
            return True, 'Vỉa hè 0 review'

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
        end_marker = "\n  ]\n};"
        start_idx = js_content.find(start_marker)
        end_idx = js_content.find(end_marker, start_idx)

        if start_idx != -1 and end_idx != -1:
            foods_json_str = json.dumps(foods, ensure_ascii=False, indent=6)
            # Trim the outer brackets of formatted json
            trimmed_json = foods_json_str.strip()
            if trimmed_json.startswith("[") and trimmed_json.endswith("]"):
                trimmed_json = trimmed_json[1:-1].strip()
            new_section = f"  foods: [\n      {trimmed_json}\n  ]\n}};"
            new_content = js_content[:start_idx] + new_section + js_content[end_idx + len(end_marker):]
            with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
                f.write(new_content)
            print("✅ Successfully updated js/data.js with cleaned dataset")

if __name__ == "__main__":
    main()
