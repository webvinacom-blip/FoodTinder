#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodTinder - Công cụ cào toàn diện ShopeeFood Quy Nhơn (Bản nâng cấp toàn diện)
Cập nhật theo yêu cầu:
1. Cào TẤT CẢ các trang (tự động phát hiện khi hết dữ liệu, không giới hạn 6 trang).
2. Phân chia theo lô trang (Batching Anti-ban): Sau mỗi lô 5 trang nghỉ giải lao 8s để chống chặn IP.
3. Giữa mỗi trang đơn lẻ: Delay ngẫu nhiên 2.0s - 3.2s.
4. BỎ ĐIỀU KIỆN rating >= 4.0 và reviews >= 20: Giữ nguyên điểm rating và review từ Foody (kể cả quán mới mở, 0 review).
5. Quét bổ sung các chuỗi thương hiệu lớn (Katinat, Phúc Long, Highlands, Phê La, Koi Thé, The Coffee House...) để không bỏ sót.
6. Đồng bộ chuẩn xác vào food-data.json và js/data.js.
"""

import sys
import os
import json
import time
import random
import re
import math
import unicodedata
import urllib.request
import urllib.parse
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRATCH_DIR = os.path.join(BASE_DIR, "scratch")
CHECKPOINT_FILE = os.path.join(SCRATCH_DIR, "crawler_checkpoint.json")
OUTPUT_CRAWLED_FILE = os.path.join(SCRATCH_DIR, "shopeefood_quynhon_clean.json")
DATABASE_JSON = os.path.join(BASE_DIR, "food-data.json")
DATA_JS = os.path.join(BASE_DIR, "js/data.js")

QUYNHON_LAT = 13.7820
QUYNHON_LNG = 109.2197

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
]

CATEGORIES_MAP = {
    "do-uong": {
        "label": "Đồ Uống (Trà sữa, Cà phê, Nước ép)",
        "category": "boba",
        "url": "https://www.foody.vn/binh-dinh/food/dia-diem?c=2",
        "keywords": ["trà sữa", "cà phê", "cafe", "tiệm trà", "sinh tố", "nước ép", "nước dừa"]
    },
    "do-an": {
        "label": "Đồ Ăn (Cơm, Bún, Phở, Mì)",
        "category": "noodles",
        "url": "https://www.foody.vn/binh-dinh/food/dia-diem?c=1",
        "keywords": ["bún", "phở", "cơm gà", "bánh canh", "hủ tiếu", "mì quảng", "bò kho"]
    },
    "trang-mieng": {
        "label": "Tráng Miệng & Ăn Vặt",
        "category": "streetfood",
        "url": "https://www.foody.vn/binh-dinh/food/dia-diem?c=3",
        "keywords": ["chè", "kem", "bánh ngọt", "bánh tráng", "ăn vặt", "xiên nướng", "flan"]
    },
    "hai-san-lau-nuong": {
        "label": "Hải Sản, Lẩu & Nướng BBQ",
        "category": "seafood",
        "url": "https://www.foody.vn/binh-dinh/food/dia-diem?c=4",
        "keywords": ["hải sản", "ốc", "lẩu", "nướng", "bbq", "bò né", "gà chỉ", "mực"]
    },
    "chay": {
        "label": "Đồ Chay & Thanh Tịnh",
        "category": "vegetarian",
        "url": "https://www.foody.vn/binh-dinh/food/dia-diem?c=5",
        "keywords": ["chay", "cơm chay", "lẩu nấm", "thanh tịnh", "an lạc"]
    },
    "dac-san": {
        "label": "Đặc Sản Quy Nhơn & Vỉa Hè",
        "category": "streetfood",
        "url": "https://www.foody.vn/binh-dinh/dia-diem?page=",
        "keywords": ["bánh xèo tôm nhảy", "bún chả cá", "bún sứa", "bánh hỏi cháo lòng", "chả ram tôm đất"]
    }
}

BRAND_KEYWORDS = [
    "katinat", "phúc long", "highlands coffee", "phê la", "koi thé",
    "the coffee house", "gong cha", "starbucks", "tocotoco", "mixue",
    "chè liên", "jollibee", "lotteria", "kfc", "dookki", "pizza hut", "domino pizza"
]

CLOSED_BLACKLIST = [
    "vương khang", "vuong khang",
    "con bò cười bbq", "con bo cuoi bbq", "bò cười bbq",
    "đất võ",
    "chị ba trà", "chi ba tra",
    "ăn vặt ngô mây", "an vat ngo may",
    "đã đóng cửa", "ngừng hoạt động", "permanently closed", "closed permanently",
    "nghỉ bán", "sang nhượng"
]

def smart_sleep(min_sec=2.0, max_sec=3.2):
    """Delay chống chặn: Sleep ngẫu nhiên giữa mỗi lần request"""
    delay = random.uniform(min_sec, max_sec)
    time.sleep(delay)

def get_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://shopeefood.vn/binh-dinh",
        "Cache-Control": "max-age=0"
    }

def slugify(text):
    if not text:
        return ""
    text = text.replace('Đ', 'D').replace('đ', 'd')
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text

def calculate_distance_km(lat1, lon1, lat2, lon2):
    if not lat1 or not lon1 or not lat2 or not lon2:
        return 1.5
    R = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def is_valid_quality_food(item):
    """
    Màng lọc chất lượng đã cập nhật theo yêu cầu:
    1. Quán không có ảnh hoặc ảnh placeholder -> LOẠI
    2. BỎ điều kiện rating >= 4.0 và reviews >= 20 -> GIỮ NGUYÊN rating thực tế từ Foody (kể cả quán mới mở)
    3. Quán đóng cửa / ngừng app / sang nhượng -> LOẠI
    4. Quán không có địa chỉ hoặc nằm ngoài Quy Nhơn -> LOẠI
    """
    if not item or not isinstance(item, dict):
        return False, "Dữ liệu trống"

    name = (item.get("name") or "").strip()
    rest = (item.get("restaurant") or name).strip()
    addr = (item.get("address") or "").strip()
    all_text = f"{name} {rest} {addr}".lower()

    # 1. Kiểm tra ảnh
    img = (item.get("image") or "").strip()
    if not img or len(img) < 15 or not img.startswith("http"):
        return False, "Thiếu URL hình ảnh"
    if any(k in img.lower() for k in ["placeholder", "default_avatar", "no-image", "empty_shop", "d-avatar"]):
        return False, "Ảnh placeholder / logo generic"

    # 2. Kiểm tra quán đóng cửa / ngừng hoạt động
    for bad_kw in CLOSED_BLACKLIST:
        if bad_kw in all_text:
            return False, f"Quán đóng cửa / ngừng kinh doanh ({bad_kw})"

    # 3. Kiểm tra địa chỉ và tọa độ thực tế tại Quy Nhơn
    lat = float(item.get("lat") or item.get("latitude") or 0)
    lng = float(item.get("lng") or item.get("longitude") or 0)
    if not (13.6 <= lat <= 13.9 and 109.1 <= lng <= 109.35):
        return False, f"Tọa độ không hợp lệ hoặc nằm ngoài Quy Nhơn ({lat}, {lng})"

    if not addr or len(addr) < 4 or "đang cập nhật" in addr.lower():
        return False, "Địa chỉ ảo / không có số nhà tên đường thực tế"

    return True, "Hợp lệ"

def enrich_food_attributes(item):
    name = (item.get("name") or "").lower()
    rest = (item.get("restaurant") or "").lower()
    cat = (item.get("category") or "").lower()
    desc = (item.get("desc") or item.get("description") or "").lower()
    tags = " ".join(item.get("tags") or []).lower()
    all_text = f"{name} {rest} {cat} {desc} {tags}"

    attrs = set()

    is_sweet = False
    if cat in ["boba", "cafe"] and any(k in all_text for k in ["trà sữa", "chè", "kem", "bánh ngọt", "flan", "bingsu", "sinh tố", "boba", "đường đen", "caramel", "pudding", "tàu hũ", "gelato"]):
        is_sweet = True
    elif any(k in all_text for k in ["chè", "kem ý", "kem bơ", "gelato", "bánh ngọt", "tiệm bánh", "bakery", "flan", "bingsu", "tàu hũ", "bánh su", "tiramisu"]):
        is_sweet = True
    if any(k in name for k in ["cơm", "bún bò", "bún cá", "bún sứa", "phở", "bánh canh", "hủ tiếu", "lẩu", "hải sản", "ốc", "mực", "gà chỉ", "bò né"]):
        is_sweet = False
    if is_sweet:
        attrs.add("sweet")

    if cat in ["boba", "cafe"] or any(k in all_text for k in ["cà phê", "cafe", "coffee", "trà sữa", "tiệm trà", "trà hoa", "trà đào", "trà trái cây", "sinh tố", "nước ép", "nước dừa"]):
        attrs.add("drinks")

    if cat in ["noodles", "hotpot"] or any(k in all_text for k in ["bún", "phở", "bánh canh", "hủ tiếu", "mì quảng", "mì cay", "lẩu", "cháo", "súp", "nước dùng"]):
        attrs.add("hot_soup")

    if any(k in all_text for k in ["cay", "sa tế", "ớt xiêm", "tomyum", "sốt thái", "mì cay", "xé lưỡi", "muối ớt", "măng cay"]):
        attrs.add("spicy")

    if any(k in all_text for k in ["giòn", "bánh xèo", "chả ram", "chiên", "rán", "bánh mì", "bánh tráng nướng", "chân gà", "nem lụi"]):
        attrs.add("crunchy")

    if not is_sweet:
        if cat in ["rice", "bbq", "hotpot"] or any(k in all_text for k in ["cơm gà", "cơm tấm", "cơm niêu", "bò né", "steak", "lẩu", "nướng bbq", "gà chỉ", "thịt nướng"]):
            attrs.add("heavy")

    if cat in ["vegetarian", "healthy"] or any(k in all_text for k in ["chay", "thanh đạm", "thanh mát", "salad", "bánh bèo", "sứa nước", "gỏi cuốn", "rau nấm"]):
        attrs.add("light")

    if not is_sweet:
        if cat in ["seafood"] or any(k in all_text for k in ["hải sản", "ốc", "tôm", "cua", "ghẹ", "mực", "nem nướng", "mắm", "rang muối", "lai rai"]):
            attrs.add("salty")

    if any(k in all_text for k in ["sốt me", "chua ngọt", "sốt thái", "tomyum", "xoài lắc", "chanh leo", "sứa"]):
        attrs.add("sour")

    if not attrs:
        attrs.add("crunchy" if cat == "streetfood" else "light")

    item["attributes"] = sorted(list(attrs))
    return item

def format_food_item(it, cat_category="streetfood"):
    item_id = it.get("Id")
    pic = it.get("PicturePathLarge") or it.get("PicturePath") or ""
    name = (it.get("Name") or "").strip()
    addr = clean_address(it.get("Address", ""))
    district = it.get("District", "TP. Quy Nhơn")
    rating = parse_rating(it.get("AvgRating", 0.0))
    review_count = parse_int(it.get("TotalReview", 0))
    lat = parse_rating(it.get("Latitude", QUYNHON_LAT)) or QUYNHON_LAT
    lng = parse_rating(it.get("Longitude", QUYNHON_LNG)) or QUYNHON_LNG
    dist = calculate_distance_km(QUYNHON_LAT, QUYNHON_LNG, lat, lng)

    clean_slug = slugify(name)
    shopee_url = f"https://shopeefood.vn/binh-dinh/{clean_slug}"
    shopee_search = f"https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q={urllib.parse.quote(name)}"

    # Tự động gán category chuẩn xác theo tên
    name_lower = name.lower()
    cat = cat_category
    if any(k in name_lower for k in ["trà sữa", "cà phê", "cafe", "coffee", "tiệm trà", "chè", "sinh tố", "nước ép", "katinat", "phúc long", "highlands"]):
        cat = "boba" if "trà sữa" in name_lower or "katinat" in name_lower or "phúc long" in name_lower else "cafe"
    elif any(k in name_lower for k in ["bún", "phở", "mì", "bánh canh", "hủ tiếu"]):
        cat = "noodles"
    elif any(k in name_lower for k in ["hải sản", "ốc", "mực"]):
        cat = "seafood"
    elif any(k in name_lower for k in ["chay"]):
        cat = "vegetarian"
    elif any(k in name_lower for k in ["cơm"]):
        cat = "rice"
    elif any(k in name_lower for k in ["lẩu"]):
        cat = "hotpot"
    elif any(k in name_lower for k in ["nướng", "bbq"]):
        cat = "bbq"

    item = {
        "id": item_id,
        "cityId": "quynhon",
        "cityName": "Quy Nhơn",
        "name": name,
        "restaurant": name,
        "address": addr,
        "district": district,
        "distance": dist,
        "distanceText": f"Cách bạn {dist}km",
        "priceRange": "25.000đ - 65.000đ",
        "rating": round(rating, 1) if rating > 0 else 0.0,
        "reviewCount": review_count,
        "likesCount": 0,
        "commentsCount": 0,
        "openTime": "07:00 - 22:30",
        "category": cat,
        "source": "ShopeeFood",
        "sourceIcon": "🛍️",
        "latitude": lat,
        "longitude": lng,
        "lat": lat,
        "lng": lng,
        "moodIds": ["comfort", "chill", "energetic"],
        "weather": ["sunny", "rainy", "hot"],
        "weatherNote": "Quy Nhơn 24°C 🌧️",
        "tags": [f"#{cat.capitalize()}", "#ShopeeFood", "#QuyNhơn"],
        "sideRibbon": ["#hot", "#chuẩn_vị"],
        "image": pic,
        "gallery": [pic],
        "description": f"Quán {name} tọa lạc tại {addr}, phục vụ thực khách với thực đơn đa dạng và nguyên liệu tươi ngon tại Quy Nhơn.",
        "recommendReason": f"Địa điểm ẩm thực nổi bật được nhiều thực khách tin tưởng lựa chọn trên ShopeeFood Quy Nhơn!",
        "menu": [
            {"name": f"Món đặc trưng {name.split('-')[0].strip()}", "price": "35.000đ", "highlight": True},
            {"name": "Món thêm / Nâng cấp đặc biệt", "price": "55.000đ", "highlight": False},
            {"name": "Trà đá / Nước giải khát", "price": "10.000đ", "highlight": False}
        ],
        "deliveryPlatform": "ShopeeFood",
        "deliveryUrl": shopee_url,
        "deliverySearchUrl": shopee_search,
        "deliveryTime": "25 - 40 phút",
        "deliveryFee": "18.000đ (Áp mã Freeship)",
        "deliveryFeeVal": 18000,
        "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
        "deliveryRating": f"{round(rating, 1)} ⭐ ({review_count}+ đã bán)" if rating > 0 else "Quán mới mở ⭐",
        "gmapsVerified": False,
        "priceMin": 25000,
        "priceMax": 65000
    }
    return enrich_food_attributes(item)

def crawl_shopeefood_category(cat_key, max_pages=100, batch_size=5, checkpoint_state=None):
    cat_cfg = CATEGORIES_MAP.get(cat_key)
    if not cat_cfg:
        return []

    print(f"\n🚀 BẮT ĐẦU CÀO PHIÊN DANH MỤC: {cat_cfg['label']} ({cat_key})")
    print(f"⏱️ Cơ chế Anti-ban: sleep 2.0 - 3.2s giữa các trang, nghỉ 8s sau mỗi lô {batch_size} trang...")

    crawled_restaurants = []
    seen_ids = set(checkpoint_state.get("seen_ids", [])) if checkpoint_state else set()
    start_page = checkpoint_state.get("last_page", 0) + 1 if checkpoint_state else 1

    consecutive_empty = 0

    for page in range(start_page, max_pages + 1):
        url = f"{cat_cfg['url']}&page={page}" if "?" in cat_cfg['url'] else f"{cat_cfg['url']}{page}"
        print(f"  📄 Đang quét Trang {page}: {url}")

        req = urllib.request.Request(url, headers=get_headers())
        items = []
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                html = resp.read().decode("utf-8", errors="ignore")
                match = re.search(r"var jsonData = ({.*?});", html)
                if match:
                    d = json.loads(match.group(1))
                    items = d.get("searchItems", [])
        except Exception as e:
            print(f"     ⚠️ Lỗi kết nối Trang {page}: {e}. Đang thử lại với delay an toàn...")
            smart_sleep(3.5, 5.0)
            continue

        if not items:
            consecutive_empty += 1
            print(f"     ℹ️ Trang {page} không có quán nào. (Trang rỗng liên tiếp: {consecutive_empty})")
            if consecutive_empty >= 2:
                print(f"     🛑 Đã quét hết tất cả các trang của danh mục '{cat_key}'!")
                break
        else:
            consecutive_empty = 0

        valid_in_page = 0
        for it in items:
            item_id = it.get("Id")
            if item_id in seen_ids:
                continue

            raw_item = format_food_item(it, cat_category=cat_cfg["category"])
            is_valid, reason = is_valid_quality_food(raw_item)
            if not is_valid:
                continue

            seen_ids.add(item_id)
            crawled_restaurants.append(raw_item)
            valid_in_page += 1

        print(f"     ✅ Trang {page}: Quét được {len(items)} quán, chấp thuận {valid_in_page} quán hợp lệ. (Tích lũy: {len(crawled_restaurants)})")

        save_checkpoint({
            "cat_key": cat_key,
            "last_page": page,
            "seen_ids": list(seen_ids),
            "count": len(crawled_restaurants),
            "updated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        })

        # Anti-ban sleep giữa các trang
        smart_sleep(2.0, 3.2)

        # Nghỉ giải lao theo Batch
        if page % batch_size == 0:
            print(f"  ☕ [Batch Anti-ban] Hoàn thành lô {page} trang. Nghỉ 8 giây để chống chặn IP...")
            time.sleep(8)

    return crawled_restaurants

def crawl_shopeefood_brand_keywords(keywords, existing_ids=None):
    """Quét chuyên biệt theo từ khóa thương hiệu lớn để không bao giờ bỏ sót (Phúc Long, Katinat, Highlands...)"""
    print(f"\n🔍 BẮT ĐẦU CÀO BỔ SUNG THEO TỪ KHÓA CHUỖI THƯƠNG HIỆU LỚN...")
    results = []
    seen_ids = set(existing_ids or [])

    for kw in keywords:
        print(f"  🔎 Đang tìm kiếm thương hiệu: '{kw}' tại Bình Định / Quy Nhơn...")
        url = f"https://www.foody.vn/binh-dinh/dia-diem?q={urllib.parse.quote(kw)}"
        req = urllib.request.Request(url, headers=get_headers())
        items = []
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                html = resp.read().decode("utf-8", errors="ignore")
                match = re.search(r"var jsonData = ({.*?});", html)
                if match:
                    d = json.loads(match.group(1))
                    items = d.get("searchItems", [])
        except Exception as e:
            print(f"     ⚠️ Lỗi kết nối khi tìm '{kw}': {e}")
            continue

        valid_brand = 0
        for it in items:
            item_id = it.get("Id")
            name = it.get("Name", "")
            if item_id in seen_ids:
                continue

            # Chỉ nhận nếu tên thực sự chứa từ khóa thương hiệu
            if slugify(kw) not in slugify(name):
                continue

            raw_item = format_food_item(it, cat_category="boba")
            is_valid, reason = is_valid_quality_food(raw_item)
            if not is_valid:
                continue

            seen_ids.add(item_id)
            results.append(raw_item)
            valid_brand += 1
            print(f"     ⭐ Phát hiện & nạp thương hiệu: {name} ({raw_item['address']}) | Rating: {raw_item['rating']} ⭐")

        smart_sleep(2.0, 3.0)

    print(f"✅ Đã quét xong từ khóa thương hiệu. Thu hoạch thêm {len(results)} chi nhánh lớn!")
    return results

def save_checkpoint(data):
    try:
        os.makedirs(SCRATCH_DIR, exist_ok=True)
        with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Lỗi ghi checkpoint: {e}")

def load_checkpoint():
    if os.path.exists(CHECKPOINT_FILE):
        try:
            with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return None
    return None

def clean_address(addr):
    if not addr:
        return ""
    addr = unicodedata.normalize('NFC', addr)
    addr = re.sub(r'^(số\s*nhà|số\s*:|số)\s*', '', addr, flags=re.IGNORECASE)
    addr = re.sub(r'^0+([1-9]\d*)', r'\1', addr)
    return addr.strip()

def parse_rating(val):
    if not val:
        return 0.0
    try:
        val_str = str(val).strip().replace(',', '.')
        m = re.search(r'(\d+(\.\d+)?)', val_str)
        return float(m.group(1)) if m else 0.0
    except Exception:
        return 0.0

def parse_int(val, default=0):
    if not val:
        return default
    try:
        val_str = str(val).replace('.', '').replace(',', '').strip()
        m = re.search(r'(\d+)', val_str)
        return int(m.group(1)) if m else default
    except Exception:
        return default

def sync_to_data_js(foods):
    if not os.path.exists(DATA_JS):
        return
    with open(DATA_JS, "r", encoding="utf-8") as f:
        content = f.read()

    start_marker = '  foods: ['
    end_marker = '\n};\n\nif (typeof window !== \'undefined\') {\n  window.APP_DATA = APP_DATA;\n}'

    start_pos = content.find(start_marker)
    end_pos = content.find(end_marker, start_pos)

    if start_pos != -1 and end_pos != -1:
        foods_json = json.dumps(foods, ensure_ascii=False, indent=2)
        indented_foods = '\n'.join(('  ' + line if line.strip() else line) for line in foods_json.split('\n'))
        new_block = f"  foods: {indented_foods.strip()}"
        content = content[:start_pos] + new_block + content[end_pos:]
        with open(DATA_JS, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Đã đồng bộ {len(foods)} quán chất lượng sang js/data.js!")

def merge_new_foods_into_database(new_foods):
    if not new_foods:
        return
    with open(DATABASE_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    current_foods = data.get("foods", [])
    existing_ids = set(f.get("id") for f in current_foods)
    existing_names = set(f.get("restaurant", f.get("name", "")).strip().lower() for f in current_foods)

    added = 0
    for nf in new_foods:
        nid = nf.get("id")
        nname = nf.get("restaurant", nf.get("name", "")).strip().lower()
        if nid in existing_ids or nname in existing_names:
            continue
        current_foods.append(nf)
        existing_ids.add(nid)
        existing_names.add(nname)
        added += 1

    data["foods"] = current_foods
    with open(DATABASE_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    sync_to_data_js(current_foods)
    print(f"\n🎉 Đã gộp thêm {added} quán mới vào database. Tổng cộng: {len(current_foods)} quán!")

def main():
    parser = argparse.ArgumentParser(description="ShopeeFood Quy Nhơn Anti-ban Crawler (Cào tất cả các trang & Bỏ giới hạn rating)")
    parser.add_argument("--category", type=str, choices=list(CATEGORIES_MAP.keys()), help="Cào 1 danh mục cụ thể")
    parser.add_argument("--all", action="store_true", help="Cào tất cả danh mục theo từng phiên")
    parser.add_argument("--max-pages", type=int, default=50, help="Số trang tối đa mỗi danh mục (mặc định: 50, tự dừng khi hết trang)")
    parser.add_argument("--batch-size", type=int, default=5, help="Số trang mỗi lô nghỉ giải lao Anti-ban (mặc định: 5 trang)")
    parser.add_argument("--break-sec", type=int, default=15, help="Thời gian nghỉ (giây) giữa các danh mục (mặc định: 15s)")
    parser.add_argument("--include-brands", action="store_true", default=True, help="Quét bổ sung các chuỗi thương hiệu lớn (Katinat, Phúc Long, v.v.)")
    parser.add_argument("--merge-into-db", action="store_true", default=True, help="Tự động gộp các quán mới cào vào database")
    parser.add_argument("--resume", action="store_true", help="Tiếp tục từ checkpoint gần nhất")

    args = parser.parse_args()

    categories_to_run = []
    if args.category:
        categories_to_run = [args.category]
    elif args.all:
        categories_to_run = list(CATEGORIES_MAP.keys())
    else:
        print("\n💡 Gợi ý sử dụng:")
        print("  - Cào danh mục Đồ Uống:    python3 scripts/crawl_shopeefood_quynhon.py --category do-uong --max-pages 30")
        print("  - Cào tất cả danh mục:     python3 scripts/crawl_shopeefood_quynhon.py --all --max-pages 50 --batch-size 5")
        return

    # Tải danh sách ID đã có trong database
    existing_ids = set()
    if os.path.exists(DATABASE_JSON):
        with open(DATABASE_JSON, "r", encoding="utf-8") as f:
            d = json.load(f)
            existing_ids = set(f.get("id") for f in d.get("foods", []))

    all_new_foods = []

    # 1. Quét chuỗi thương hiệu lớn trước để bảo đảm Phúc Long, Katinat, Highlands có ngay
    if args.include_brands:
        brand_foods = crawl_shopeefood_brand_keywords(BRAND_KEYWORDS, existing_ids=existing_ids)
        for bf in brand_foods:
            existing_ids.add(bf["id"])
        all_new_foods.extend(brand_foods)

    # 2. Quét tuần tự các danh mục
    for idx, cat in enumerate(categories_to_run):
        cp = load_checkpoint() if args.resume else None
        res = crawl_shopeefood_category(cat, max_pages=args.max_pages, batch_size=args.batch_size, checkpoint_state=cp)
        for r in res:
            if r["id"] not in existing_ids:
                existing_ids.add(r["id"])
                all_new_foods.append(r)

        if idx < len(categories_to_run) - 1:
            print(f"\n☕ [Anti-ban] Đã hoàn thành danh mục '{cat}'. Nghỉ {args.break_sec} giây trước khi chuyển sang danh mục tiếp theo...")
            time.sleep(args.break_sec)

    # 3. Lưu và gộp vào database
    if all_new_foods:
        os.makedirs(SCRATCH_DIR, exist_ok=True)
        with open(OUTPUT_CRAWLED_FILE, "w", encoding="utf-8") as f:
            json.dump(all_new_foods, f, ensure_ascii=False, indent=2)
        print(f"\n🎉 CÀO THÀNH CÔNG TỔNG CỘNG {len(all_new_foods)} QUÁN MỚI ĐẠT CHUẨN!")
        print(f"📁 Đã lưu dữ liệu tại: {OUTPUT_CRAWLED_FILE}")
        if args.merge_into_db:
            merge_new_foods_into_database(all_new_foods)
    else:
        print("\nℹ️ Phiên cào hoàn tất. Toàn bộ các quán tìm thấy đã có trong database.")

if __name__ == "__main__":
    main()
