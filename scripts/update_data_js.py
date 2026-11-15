#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(BASE_DIR, "js/data.js")
FOOD_JSON = os.path.join(BASE_DIR, "food-data.json")

with open(FOOD_JSON, "r", encoding="utf-8") as f:
    food_data = json.load(f)

foods = food_data.get("foods", [])
print(f"Loaded {len(foods)} foods from food-data.json")

with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

# Find foods: [ ... ] in data.js
start_marker = "  // 300 Quán Ăn Nổi Bật Tại Quy Nhơn từ ShopeeFood & GrabFood\n  foods: ["
if start_marker not in content:
    # Alternative marker
    start_marker = "  foods: ["

idx_start = content.find(start_marker)
if idx_start == -1:
    print("Could not find foods array in data.js!")
    exit(1)

# Find matching closing bracket for foods array
# In data.js, next property after foods is "groupChats: ["
group_marker = "\n  groupChats: ["
idx_end = content.find(group_marker, idx_start)
if idx_end == -1:
    print("Could not find groupChats marker in data.js!")
    exit(1)

new_foods_code = "  // 300 Quán Ăn Nổi Bật Tại Quy Nhơn từ ShopeeFood & GrabFood\n  foods: " + json.dumps(foods, ensure_ascii=False, indent=4) + ",\n"

new_content = content[:idx_start] + new_foods_code + content[idx_end+1:]

with open(DATA_JS, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"✅ Successfully updated js/data.js with {len(foods)} real ShopeeFood dishes!")
