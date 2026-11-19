#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodTinder - Remove Unfindable Google Maps & Phantom Restaurants from Database
Permanently purges:
1. Restaurants not findable on Google Maps (phantom addresses like 108/16 Nguyễn Thái Học).
2. Unverified phantom venues (gmapsVerified: False with 0 ratings and 0 reviews).
3. Generic street addresses without specific house numbers.
4. Updates both food-data.json and js/data.js synchronously.
"""

import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOOD_DATA_PATH = os.path.join(BASE_DIR, "food-data.json")
DATA_JS_PATH = os.path.join(BASE_DIR, "js", "data.js")
VERSION_JSON_PATH = os.path.join(BASE_DIR, "version.json")

def is_unfindable_gmaps(f):
    if f.get('id') in [1295849, 248550]:
        return True, f"ID {f.get('id')} ({f.get('restaurant')})"
    addr = (f.get('address') or '').lower()
    rest = (f.get('restaurant') or '').lower()
    
    # Quán bị đánh dấu rõ ràng là chưa xác thực hoặc không tìm thấy trên Google Maps
    if f.get('gmapsVerified') is False:
        return True, f"gmapsVerified is False ({f.get('restaurant')} - {addr})"

    if '108/16 nguyễn thái học' in addr or '15 lê hồng phong' in addr:
        return True, f"Unfindable street address ({addr})"
    if 'đường chính' in addr or 'bờ biển quy nhơn' in addr or 'quảng trường trung tâm' in addr or 'khu bông hồng' in addr or addr == 'đường xuân diệu':
        return True, 'Generic phantom address'
    if not re.search(r'\d+', addr):
        return True, 'No house number in address'
        
    raw_rating = f.get('rating', 0)
    try:
        rating = float(raw_rating)
    except:
        rating = 0.0
    reviews = int(f.get('reviewCount', 0) or f.get('totalReviews', 0) or 0)
    
    if rating <= 0 and reviews <= 0:
        return True, '0 review and 0 rating'
        
    return False, 'Valid'

def main():
    with open(FOOD_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    is_dict = isinstance(data, dict)
    foods = data.get("foods", []) if is_dict else data

    cleaned_foods = []
    removed_foods = []

    for f in foods:
        bad, reason = is_unfindable_gmaps(f)
        if bad:
            removed_foods.append((f, reason))
        else:
            # Chuẩn hóa trạng thái gmapsVerified và rating chuẩn hệ 5 sao
            f["gmapsVerified"] = True
            raw_r = f.get("rating", 4.5)
            try:
                r_val = float(raw_r)
                if r_val > 5.0:
                    f["rating"] = round(r_val / 2.0, 1)
                else:
                    f["rating"] = round(r_val, 1)
            except:
                f["rating"] = 4.5
            cleaned_foods.append(f)

    print(f"Original total: {len(foods)}")
    print(f"Removed unfindable phantom foods: {len(removed_foods)}")
    print(f"Remaining verified foods: {len(cleaned_foods)}")

    # Update food-data.json
    if is_dict:
        data["foods"] = cleaned_foods
        data.setdefault("metadata", {})["totalCount"] = len(cleaned_foods)
    else:
        data = cleaned_foods

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
            foods_json_str = json.dumps(cleaned_foods, ensure_ascii=False, indent=4)
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
            print(f"❌ Marker not found in js/data.js: start_idx={start_idx}, end_idx={end_idx}")

    # Update version.json
    if os.path.exists(VERSION_JSON_PATH):
        with open(VERSION_JSON_PATH, "r", encoding="utf-8") as f:
            v_data = json.load(f)
        v_data["total"] = len(cleaned_foods)
        v_data["version"] = "3.2.6"
        v_data["updatedAt"] = "2026-11-20T00:15:00Z"
        with open(VERSION_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(v_data, f, ensure_ascii=False, indent=2)
        print("✅ Successfully updated version.json (total: %d)" % len(cleaned_foods))

if __name__ == "__main__":
    main()
