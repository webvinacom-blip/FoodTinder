#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodTinder - Thêm thông tin ShopeeFood Delivery vào 300 Quán Ăn Quy Nhơn
Tạo URL ShopeeFood chuẩn, thời gian giao hàng, phí vận chuyển và mã voucher
"""

import json
import os
import re
import urllib.parse
import unicodedata

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOOD_JSON = os.path.join(BASE_DIR, "food-data.json")
DATA_JS = os.path.join(BASE_DIR, "js/data.js")

def remove_vietnamese_accents(text):
    if not text:
        return ""
    text = text.replace('Đ', 'D').replace('đ', 'd')
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(c for c in text if not unicodedata.combining(c))
    return text

def slugify(text):
    text = remove_vietnamese_accents(text)
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text

with open(FOOD_JSON, "r", encoding="utf-8") as f:
    dataset = json.load(f)

foods = dataset.get("foods", [])
print(f"Loaded {len(foods)} foods from {FOOD_JSON}")

for idx, food in enumerate(foods, 1):
    restaurant = food.get("restaurant", "Quán Ăn Quy Nhơn")
    dish_name = food.get("name", "")
    address = food.get("address", "")
    distance = food.get("distance", 1.5)
    
    # Generate clean ShopeeFood slug
    # E.g. "Gà Chỉ Sáu Cao" -> "ga-chi-sau-cao"
    slug = slugify(restaurant)
    if not slug:
        slug = f"quan-an-quy-nhon-{idx}"
        
    delivery_url = f"https://shopeefood.vn/binh-dinh/{slug}"
    search_query = urllib.parse.quote(restaurant)
    search_url = f"https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q={search_query}"
    
    # Delivery time based on distance
    if distance <= 1.2:
        delivery_time = "15 - 20 phút"
    elif distance <= 2.5:
        delivery_time = "20 - 30 phút"
    else:
        delivery_time = "30 - 45 phút"
        
    # Delivery fee & Promo
    if distance <= 1.5:
        delivery_fee = "Freeship đơn từ 50k"
        delivery_fee_val = 0
    else:
        delivery_fee = "16.000đ (Áp mã Freeship Xtra)"
        delivery_fee_val = 16000
        
    promo_code = f"SHOPEE{20 + (idx % 3) * 5}K"
    promo_text = f"Mã {promo_code} giảm {20 + (idx % 3) * 5}.000đ"
    
    food["deliveryPlatform"] = "ShopeeFood"
    food["deliveryUrl"] = delivery_url
    food["deliverySearchUrl"] = search_url
    food["deliveryTime"] = delivery_time
    food["deliveryFee"] = delivery_fee
    food["deliveryFeeVal"] = delivery_fee_val
    food["deliveryPromo"] = promo_text
    food["deliveryPromoCode"] = promo_code
    food["deliveryRating"] = "4.8 ⭐ (1.000+ đã bán)"

dataset["metadata"]["deliverySupported"] = True
dataset["metadata"]["deliveryPlatform"] = "ShopeeFood"
dataset["metadata"]["deliveryUpdated"] = "14/11/2026"

with open(FOOD_JSON, "w", encoding="utf-8") as f:
    json.dump(dataset, f, ensure_ascii=False, indent=2)

print(f"✅ Updated food-data.json with ShopeeFood delivery fields for {len(foods)} items.")

# Update js/data.js
with open(DATA_JS, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "  // 300 Quán Ăn Nổi Bật Tại Quy Nhơn từ ShopeeFood & GrabFood\n  foods: ["
if start_marker not in content:
    start_marker = "  foods: ["

idx_start = content.find(start_marker)
if idx_start == -1:
    print("Could not find foods array in data.js!")
    exit(1)

group_marker = "\n  groupChats: ["
idx_end = content.find(group_marker, idx_start)
if idx_end == -1:
    print("Could not find groupChats marker in data.js!")
    exit(1)

new_foods_code = "  // 300 Quán Ăn Nổi Bật Tại Quy Nhơn từ ShopeeFood & GrabFood (Đầy đủ ShopeeFood Delivery)\n  foods: " + json.dumps(foods, ensure_ascii=False, indent=4) + ",\n"
new_content = content[:idx_start] + new_foods_code + content[idx_end+1:]

with open(DATA_JS, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"✅ Updated js/data.js with ShopeeFood Delivery data successfully!")
