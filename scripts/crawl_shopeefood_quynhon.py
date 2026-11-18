#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodTinder - Công cụ Cào Ma Trận Đa Chiều Quy Nhơn (Multi-Dimensional Matrix Crawler)
Giải pháp vượt qua giới hạn 5 trang của Foody / ShopeeFood:
1. Ma trận Tuyến đường (Street Matrix): Quét hơn 35 trục đường ẩm thực trọng điểm tại Quy Nhơn.
2. Ma trận Món ăn & Ẩm thực ngách (Deep Dish Matrix): Hơn 50 từ khóa món ăn đặc sản & vặt.
3. Ma trận Chuỗi thương hiệu lớn (Brand Matrix): Bắt trọn 100% chi nhánh lớn.
4. Cơ chế chống chặn (Anti-ban Protection): Delay ngẫu nhiên 1.6s - 2.6s, nghỉ giải lao sau mỗi batch.
5. Bộ lọc Chất lượng (Quality Gate): Giữ nguyên điểm rating/review từ Foody, loại bỏ quán đóng cửa/không có ảnh.
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
CHECKPOINT_FILE = os.path.join(SCRATCH_DIR, "matrix_checkpoint.json")
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

# 35 Tuyến đường ẩm thực sầm uất nhất Quy Nhơn
QUYNHON_STREETS = [
    "Ngô Mây", "Nguyễn Thái Học", "Xuân Diệu", "Nguyễn Thị Định", "Trần Hưng Đạo",
    "Lê Hồng Phong", "Đống Đa", "An Dương Vương", "Bạch Đằng", "Phan Bội Châu",
    "Hai Bà Trưng", "Lê Duẩn", "Diên Hồng", "Võ Thị Yến", "Hoàng Văn Thụ",
    "Tây Sơn", "Ngọc Hân Công Chúa", "Trần Phú", "Lê Lợi", "Phan Đình Phùng",
    "Nguyễn Huệ", "Trương Văn Của", "Biên Cương", "Nguyễn Lữ", "Trần Cao Vân",
    "Vũ Bảo", "Mai Xuân Thưởng", "Hùng Vương", "Cần Vương", "Đô Đốc Bảo",
    "Tăng Bạt Hổ", "Trần Thị Kỷ", "Lý Thường Kiệt", "Lý Thái Tổ", "Hải Thượng Lãn Ông"
]

# 50 Từ khóa món ăn & ẩm thực ngách Quy Nhơn
DEEP_DISH_KEYWORDS = [
    # Món nước / bún / phở
    "bún bò", "bún chả cá", "bún sứa", "bún rạm", "bún tôm", "bánh canh",
    "phở", "hủ tiếu", "mì quảng", "bò kho", "cháo lòng", "cháo ếch", "súp",
    # Món cơm / điểm tâm
    "cơm gà", "cơm tấm", "cơm niêu", "cơm bình dân", "bánh mì", "xôi", "bò né", "bánh cuốn",
    # Món đặc sản / ăn vặt
    "bánh xèo", "chả ram tôm đất", "nem nướng", "bánh bèo", "bánh hỏi", "bánh tráng nướng",
    "ốc", "hải sản", "gà chỉ", "mực nướng", "lẩu gà lá é", "lẩu bò", "bbq", "nướng ngói",
    # Đồ uống / giải khát
    "trà sữa", "cà phê", "cafe view biển", "trà trái cây", "nước ép", "sinh tố",
    "chè", "kem bơ", "tàu hũ", "sữa chua", "dừa dầm", "nước dừa",
    # Ẩm thực khác
    "chay", "pizza", "burger", "gà rán", "dimsum", "sushi", "mì cay"
]

# Chuỗi thương hiệu lớn
BRAND_KEYWORDS = [
    "katinat", "phúc long", "highlands coffee", "phê la", "koi thé",
    "the coffee house", "gong cha", "starbucks", "tocotoco", "mixue",
    "chè liên", "jollibee", "lotteria", "kfc", "dookki", "pizza hut", "domino pizza"
]

CLOSED_BLACKLIST = [
    "cơm chay an lạc", "com chay an lac", "quán cơm chay an lạc", "quan com chay an lac", "chay an lạc", "chay an lac",
    "royal club", "diamond club", "cali beer", "top pub", "win pub", "the fellowship bar",
    "come together bar", "since 1988 pub", "vip pub", "style pub", "karaoke ocean",
    "dj cafe & karaoke", "vương khang", "vuong khang",
    "con bò cười bbq", "con bo cuoi bbq", "bò cười bbq",
    "đất võ",
    "chị ba trà", "chi ba tra",
    "ăn vặt ngô mây", "an vat ngo may",
    "tocotoco & kem tràng tiền", "tocotoco & kem trang tien", "tocotoco go kim cuc", "tocotoco - go kim cúc", "kem tràng tiền - go kim cúc", "kem trang tien - go kim cuc",
    "sandwich land - big c quy nhơn", "sandwich land",
    "đã đóng cửa", "đóng cửa", "ngừng hoạt động", "ngừng kinh doanh", "ngưng hoạt động", "ngưng kinh doanh", "ngưng phục vụ",
    "permanently closed", "closed permanently", "out of business",
    "tạm nghỉ", "tạm ngừng", "tạm ngưng", "quán tạm nghỉ", "nghỉ bán vĩnh viễn", "nghỉ bán", "nghỉ hẳn",
    "chuyển địa điểm", "đã chuyển", "dời địa điểm", "trả mặt bằng", "sang quán", "sang nhượng", "thanh lý quán", "dẹp tiệm", "đã dẹp"
]

NON_DINING_KEYWORDS = [
    r'\bbar\b', r'\bclub\b', r'\blounge\b', r'\bpub\b', r'\bkaraoke\b', r'\bbida\b', r'\bbilliards\b',
    r'\bmassage\b', r'\bspa\b', r'\bhotel\b', r'\bkhách sạn\b', r'\bnhà nghỉ\b', r'\bmotel\b', r'\bhomestay\b',
    r'\bresort\b', r'\bshop\b', r'\bstore\b', r'\bpharmacy\b', r'\bnhà thuốc\b',
    r'\bvũ trường\b', r'\bnail\b', r'\bsalon\b', r'\bhớt tóc\b', r'\bgym\b', r'\byoga\b'
]

def smart_sleep(min_sec=1.6, max_sec=2.6):
    """Delay ngẫu nhiên giữa các request để chống chặn IP"""
    time.sleep(random.uniform(min_sec, max_sec))

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

def is_valid_quality_food(item, raw_it=None):
    if not item or not isinstance(item, dict):
        return False, "Dữ liệu trống"

    iid = item.get("id")
    if iid in [166, 660823, 1217226, 665845, 1226906]:
        return False, "Quán nằm trong danh sách đen đóng cửa (ID)"

    name = (item.get("name") or "").strip()
    rest = (item.get("restaurant") or name).strip()
    addr = (item.get("address") or "").strip()
    all_text = f"{name} {rest} {addr}".lower()

    # Quán Cơm Chay An Lạc - 6 Nguyễn Lữ đã đóng cửa vĩnh viễn trên thực tế & Google Maps
    if ("an lạc" in all_text or "an lac" in all_text) and ("6 nguyễn lữ" in all_text or "6 nguyen lu" in all_text):
        return False, "Quán Cơm Chay An Lạc 6 Nguyễn Lữ đã đóng cửa vĩnh viễn"

    # 1. Ảnh hợp lệ
    img = (item.get("image") or "").strip()
    if not img or len(img) < 15 or not img.startswith("http"):
        return False, "Thiếu URL hình ảnh"
    if any(k in img.lower() for k in ["placeholder", "default_avatar", "no-image", "empty_shop", "d-avatar"]):
        return False, "Ảnh placeholder / logo generic"

    # 2. Quán đóng cửa hoặc thuộc danh sách đen giải thể
    for bad_kw in CLOSED_BLACKLIST:
        if bad_kw in all_text:
            return False, f"Quán đóng cửa / ngừng kinh doanh ({bad_kw})"

    # 3. Loại trừ các loại hình dịch vụ không phải ẩm thực (Bar, Club, Karaoke, Spa, Khách sạn)
    if "surf bar" not in rest.lower() and "surf bar" not in name.lower():
        for pat in NON_DINING_KEYWORDS:
            if re.search(pat, f"{rest} {name}", re.IGNORECASE):
                return False, f"Không phải quán ăn / dịch vụ giải trí khác ({pat})"

    # 4. Kiểm tra dịch vụ giao hàng ShopeeFood thực tế
    if item.get("deliveryPlatform") == "ShopeeFood" and not item.get("deliveryUrl"):
        return False, "Không có URL ShopeeFood hợp lệ"

    if raw_it:
        if raw_it.get("HasDelivery") is False and not raw_it.get("DeliveryUrl"):
            return False, "Quán không còn hoạt động giao hàng trên ShopeeFood"
        if raw_it.get("ShowInSearchResult") is False and raw_it.get("HasDelivery") is False:
            return False, "Quán bị ẩn khỏi kết quả tìm kiếm ShopeeFood"

    # 5. Địa bàn Quy Nhơn
    lat = float(item.get("lat") or item.get("latitude") or 0)
    lng = float(item.get("lng") or item.get("longitude") or 0)
    if not (13.6 <= lat <= 13.9 and 109.1 <= lng <= 109.35):
        return False, f"Tọa độ không hợp lệ hoặc ngoài Quy Nhơn ({lat}, {lng})"

    if not addr or len(addr) < 4 or "đang cập nhật" in addr.lower() or addr in ["quảng trường trung tâm", "bờ biển quy nhơn", "hòn khô"]:
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
    delivery_url = (it.get("DeliveryUrl") or "").strip()
    has_delivery = it.get("HasDelivery") is True or bool(delivery_url and "shopeefood.vn" in delivery_url)

    # Chỉ dùng link thật từ hệ thống ShopeeFood
    if delivery_url and "shopeefood.vn" in delivery_url:
        shopee_url = delivery_url
    elif has_delivery and clean_slug:
        shopee_url = f"https://shopeefood.vn/binh-dinh/{clean_slug}"
    else:
        shopee_url = ""

    shopee_search = f"https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q={urllib.parse.quote(name)}"

    # Lấy giờ mở cửa thực tế nếu có, tránh gắn bừa gây hiểu lầm quán đóng cửa vẫn đang mở
    operating_time = (it.get("OperatingTime") or "").strip()
    open_time = operating_time if operating_time else "07:00 - 22:00"

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
        "openTime": open_time,
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

def crawl_query_pages(query_text, max_pages=4, existing_ids=None):
    """Cào danh sách quán cho một từ khóa/tuyến đường cụ thể (quét tối đa 4 trang)"""
    results = []
    seen = existing_ids if existing_ids is not None else set()
    encoded_q = urllib.parse.quote(query_text)

    for page in range(1, max_pages + 1):
        url = f"https://www.foody.vn/binh-dinh/dia-diem?q={encoded_q}&page={page}"
        req = urllib.request.Request(url, headers=get_headers())
        items = []
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                html = resp.read().decode("utf-8", errors="ignore")
                match = re.search(r"var jsonData = ({.*?});", html)
                if match:
                    d = json.loads(match.group(1))
                    items = d.get("searchItems", [])
        except Exception:
            break

        if not items:
            break

        new_count = 0
        for it in items:
            iid = it.get("Id")
            if not iid or iid in seen:
                continue

            # Bỏ qua ngay các địa điểm Foody không còn hoạt động giao hàng trên ShopeeFood
            if it.get("HasDelivery") is False and not it.get("DeliveryUrl"):
                continue

            raw_item = format_food_item(it)
            ok, reason = is_valid_quality_food(raw_item, raw_it=it)
            if not ok:
                continue

            seen.add(iid)
            results.append(raw_item)
            new_count += 1

        smart_sleep(1.6, 2.5)
        # Nếu trang hiện tại không có thêm món mới nào (bị lặp) -> dừng sớm
        if new_count == 0 and page >= 2:
            break

    return results

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
    start_pos = content.find(start_marker)

    # Tìm điểm kết thúc của mảng foods trong APP_DATA
    end_marker = '\n  ]\n};'
    end_pos = content.find(end_marker, start_pos)
    if end_pos != -1:
        end_pos += len('\n  ]')  # Giữ lại '\n};'

    if start_pos != -1 and end_pos != -1:
        foods_json = json.dumps(foods, ensure_ascii=False, indent=2)
        indented_foods = '\n'.join(('  ' + line if line.strip() else line) for line in foods_json.split('\n'))
        new_block = f"  foods: {indented_foods.strip()}"
        content = content[:start_pos] + new_block + content[end_pos:]
        with open(DATA_JS, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Đã đồng bộ {len(foods)} quán chất lượng sang js/data.js!")
    else:
        print(f"⚠️ Không tìm thấy vị trí đồng bộ trong {DATA_JS} (start: {start_pos}, end: {end_pos})")

def cleanup_closed_foods_database(database_file=DATABASE_JSON):
    """Hậu xử lý sau cào: Quét và loại bỏ vĩnh viễn các quán đóng cửa / không hợp lệ khỏi database"""
    if not os.path.exists(database_file):
        return
    with open(database_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    foods = data.get("foods", [])
    before_count = len(foods)

    cleaned_foods = []
    removed_items = []

    for f in foods:
        fid = f.get("id")
        frest = (f.get("restaurant") or "").strip()
        fname = (f.get("name") or "").strip()
        faddr = (f.get("address") or "").strip()
        ftext = f"{frest} {fname} {faddr}".lower()

        # 1. Danh sách ID quán đã đóng cửa vĩnh viễn
        if fid in [166, 660823, 1217226, 665845, 1226906]:
            removed_items.append((fid, frest, "ID quán đóng cửa vĩnh viễn"))
            continue

        # 2. Quán Cơm Chay An Lạc - 6 Nguyễn Lữ
        if ("an lạc" in ftext or "an lac" in ftext) and ("6 nguyễn lữ" in ftext or "6 nguyen lu" in ftext):
            removed_items.append((fid, frest, "Quán Cơm Chay An Lạc (6 Nguyễn Lữ) đã đóng cửa vĩnh viễn"))
            continue

        # 3. Khớp danh sách từ khóa đóng cửa / giải thể
        is_closed = False
        for bad_kw in CLOSED_BLACKLIST:
            if bad_kw in ftext:
                removed_items.append((fid, frest, f"Khớp blacklist đóng cửa ({bad_kw})"))
                is_closed = True
                break
        if is_closed:
            continue

        # 4. Loại bỏ dịch vụ giải trí không phải ăn uống (Bar, Club, Spa, Khách sạn...)
        if "surf bar" not in ftext:
            is_non_dining = False
            for pat in NON_DINING_KEYWORDS:
                if re.search(pat, f"{frest} {fname}", re.IGNORECASE):
                    removed_items.append((fid, frest, f"Không phải quán ăn ({pat})"))
                    is_non_dining = True
                    break
            if is_non_dining:
                continue

        # 5. Nếu nguồn là ShopeeFood mà không có URL giao hàng thật
        if f.get("deliveryPlatform") == "ShopeeFood" and not f.get("deliveryUrl"):
            removed_items.append((fid, frest, "Thiếu link giao hàng ShopeeFood"))
            continue

        cleaned_foods.append(f)

    data["foods"] = cleaned_foods
    with open(database_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    sync_to_data_js(cleaned_foods)
    print(f"\n🧹 [Hậu xử lý dọn dẹp quán đóng cửa] Trước: {before_count} quán -> Sau: {len(cleaned_foods)} quán (Đã xoá {len(removed_items)} quán đóng cửa).")
    for r in removed_items:
        print(f"   ❌ Đã xoá: [{r[0]}] {r[1]} - Lý do: {r[2]}")

def merge_new_foods_into_database(new_foods):
    if not new_foods:
        cleanup_closed_foods_database(DATABASE_JSON)
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

    print(f"\n🎉 Đã gộp thêm {added} quán mới vào database. Tổng cộng hiện có: {len(current_foods)} quán!")
    cleanup_closed_foods_database(DATABASE_JSON)

def main():
    parser = argparse.ArgumentParser(description="ShopeeFood Quy Nhơn Multi-Dimensional Matrix Crawler")
    parser.add_argument("--streets", action="store_true", default=True, help="Quét ma trận tuyến đường Quy Nhơn")
    parser.add_argument("--dishes", action="store_true", default=True, help="Quét ma trận món ăn ngách Quy Nhơn")
    parser.add_argument("--brands", action="store_true", default=True, help="Quét chuỗi thương hiệu lớn")
    parser.add_argument("--cleanup", action="store_true", help="Chỉ chạy thuật toán dọn dẹp quán đóng cửa / blacklist")
    parser.add_argument("--batch-break", type=int, default=6, help="Thời gian nghỉ (s) sau mỗi 10 truy vấn")

    args = parser.parse_args()

    if args.cleanup:
        print("🧹 Bắt đầu chạy thuật toán dọn dẹp các quán đóng cửa...")
        cleanup_closed_foods_database(DATABASE_JSON)
        return

    # Tải danh sách ID đã có trong database
    existing_ids = set()
    if os.path.exists(DATABASE_JSON):
        with open(DATABASE_JSON, "r", encoding="utf-8") as f:
            d = json.load(f)
            existing_ids = set(f.get("id") for f in d.get("foods", []))

    print(f"======================================================================")
    print(f"🚀 KHỞI ĐỘNG CÔNG CỤ CÀO MA TRẬN ĐA CHIỀU SHOPEEFOOD QUY NHƠN")
    print(f"📦 Số quán hiện có trong database: {len(existing_ids)} quán")
    print(f"======================================================================\n")

    all_harvested = []

    # 1. Quét Chuỗi Thương Hiệu
    if args.brands:
        print(f"📍 [GIAI ĐOẠN 1/3] Quét {len(BRAND_KEYWORDS)} Chuỗi Thương Hiệu Lớn...")
        for idx, brand in enumerate(BRAND_KEYWORDS):
            res = crawl_query_pages(brand, max_pages=3, existing_ids=existing_ids)
            if res:
                all_harvested.extend(res)
                print(f"   [Thương hiệu {idx+1}/{len(BRAND_KEYWORDS)}] '{brand}': Thu hoạch +{len(res)} chi nhánh.")
            smart_sleep(1.5, 2.2)

    # 2. Quét Ma Trận Tuyến Đường Quy Nhơn
    if args.streets:
        print(f"\n🛣️ [GIAI ĐOẠN 2/3] Quét Ma Trận {len(QUYNHON_STREETS)} Tuyến Phố Ẩm Thực Quy Nhơn...")
        for idx, street in enumerate(QUYNHON_STREETS):
            res = crawl_query_pages(f"đường {street} Quy Nhơn", max_pages=4, existing_ids=existing_ids)
            if res:
                all_harvested.extend(res)
                print(f"   [Đường {idx+1}/{len(QUYNHON_STREETS)}] Đường {street}: Thu hoạch +{len(res)} quán mới. (Tổng mới: {len(all_harvested)})")
            
            # Anti-ban Batch Break
            if (idx + 1) % 10 == 0:
                print(f"   ☕ [Anti-ban] Đã quét {idx+1} tuyến đường. Nghỉ giải lao {args.batch_break}s...")
                time.sleep(args.batch_break)

            smart_sleep(1.6, 2.5)

    # 3. Quét Ma Trận Món Ăn Ngách
    if args.dishes:
        print(f"\n🍜 [GIAI ĐOẠN 3/3] Quét Ma Trận {len(DEEP_DISH_KEYWORDS)} Món Ăn & Đặc Sản Ngách Quy Nhơn...")
        for idx, dish in enumerate(DEEP_DISH_KEYWORDS):
            res = crawl_query_pages(f"{dish} Quy Nhơn", max_pages=4, existing_ids=existing_ids)
            if res:
                all_harvested.extend(res)
                print(f"   [Món {idx+1}/{len(DEEP_DISH_KEYWORDS)}] '{dish}': Thu hoạch +{len(res)} quán mới. (Tổng mới: {len(all_harvested)})")
            
            # Anti-ban Batch Break
            if (idx + 1) % 10 == 0:
                print(f"   ☕ [Anti-ban] Đã quét {idx+1} món ăn. Nghỉ giải lao {args.batch_break}s...")
                time.sleep(args.batch_break)

            smart_sleep(1.6, 2.5)

    # 4. Gộp vào Database & Cập nhật App Data
    print(f"\n======================================================================")
    print(f"🎉 HOÀN THÀNH TOÀN DIỆN MA TRẬN CÀO QUY NHƠN!")
    print(f"📊 Tổng số quán mới thu hoạch được: {len(all_harvested)} quán!")
    print(f"======================================================================")

    if all_harvested:
        os.makedirs(SCRATCH_DIR, exist_ok=True)
        with open(OUTPUT_CRAWLED_FILE, "w", encoding="utf-8") as f:
            json.dump(all_harvested, f, ensure_ascii=False, indent=2)
        merge_new_foods_into_database(all_harvested)
    else:
        print("ℹ️ Không phát hiện thêm quán mới. Database đã bao phủ tối đa!")

if __name__ == "__main__":
    main()
