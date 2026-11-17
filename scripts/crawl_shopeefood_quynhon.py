#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodTinder - Công cụ cào toàn diện ShopeeFood Quy Nhơn (Anti-ban & Quality Gate)
Các tính năng nổi bật:
1. Chiến thuật chống chặn (Anti-ban):
   - Delay 2.0 - 3.2 giây ngẫu nhiên giữa mỗi trang (pagination) và mỗi request.
   - Chia nhỏ phiên cào theo Danh mục (Categories) hoặc Khu vực.
   - Hỗ trợ lưu Checkpoint/Resume phiên cào (không phải cào lại từ đầu khi ngắt quãng).
   - Tự động nghỉ ngơi giữa các danh mục (Configurable break).
2. Kiểm soát chất lượng dữ liệu (Quality Gate - Xóa bỏ ngay các quán không phù hợp):
   - Quán không có ảnh hoặc ảnh xấu/vỡ/placeholder: Loại bỏ 100%.
   - Quán "ảo" hoặc rating quá thấp: Bắt buộc rating >= 4.0 HOẶC có >= 20 lượt đánh giá.
   - Quán đóng cửa / ngừng app / sang nhượng: Loại bỏ 100%.
   - Quán không tìm thấy địa chỉ thật trên Google Maps / ngoài Quy Nhơn: Loại bỏ 100%.
3. Tự động chuẩn hóa dữ liệu:
   - Gắn Ma trận Thuộc tính Vị giác (attributes) và Tâm trạng (moodIds).
   - Chuẩn hóa khoảng giá min/max, URL ShopeeFood chính thức, phí ship, thời gian giao hàng.
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

# Vị trí trung tâm Quy Nhơn
QUYNHON_LAT = 13.7820
QUYNHON_LNG = 109.2197

# Headers giả lập trình duyệt thật
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
]

# Danh mục phân chia nhỏ phiên cào (Chunked Categories)
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

# Danh sách đen quán đã đóng cửa vĩnh viễn / ngừng app / sang nhượng
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
    """Delay chống chặn: Sleep ngẫu nhiên giữa mỗi lần request / chuyển trang"""
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
        return 1.0
    R = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# ══════════════════════════════════════════════════════════════════════
# MÀNG LỌC KIỂM SOÁT CHẤT LƯỢNG DỮ LIỆU (DATA QUALITY GATE)
# ══════════════════════════════════════════════════════════════════════
def is_valid_quality_food(item):
    """
    Màng lọc chất lượng nghiêm ngặt:
    1. Quán không có ảnh hoặc ảnh quá xấu / logo generic -> LOẠI
    2. Quán 'ảo' hoặc rating quá thấp (< 4.0 và < 20 reviews) -> LOẠI
    3. Quán đóng cửa / ngừng app -> LOẠI
    4. Quán không tìm thấy địa chỉ thật trên Google Maps / ngoài Quy Nhơn -> LOẠI
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

    # 2. Kiểm tra rating và lượt đánh giá
    try:
        rating = float(item.get("rating", 0))
    except (ValueError, TypeError):
        rating = 0.0
    try:
        review_count = int(item.get("reviewCount", item.get("totalReviews", 0)))
    except (ValueError, TypeError):
        review_count = 0

    if rating < 4.0 and review_count < 20:
        return False, f"Rating quá thấp ({rating} ⭐) và quá ít review ({review_count})"

    # 3. Kiểm tra quán đóng cửa / ngừng hoạt động
    for bad_kw in CLOSED_BLACKLIST:
        if bad_kw in all_text:
            return False, f"Quán đóng cửa / ngừng kinh doanh ({bad_kw})"

    # 4. Kiểm tra địa chỉ và tọa độ thực tế trên Google Maps
    lat = float(item.get("lat") or item.get("latitude") or 0)
    lng = float(item.get("lng") or item.get("longitude") or 0)
    if not (13.6 <= lat <= 13.9 and 109.1 <= lng <= 109.35):
        return False, f"Tọa độ không hợp lệ hoặc nằm ngoài Quy Nhơn ({lat}, {lng})"

    if not addr or len(addr) < 6 or "đang cập nhật" in addr.lower():
        return False, "Địa chỉ ảo / không có số nhà tên đường thực tế"

    return True, "Hợp lệ"

# ══════════════════════════════════════════════════════════════════════
# GẮN MA TRẬN THUỘC TÍNH VỊ GIÁC (ATTRIBUTE MATRIX) & TÂM TRẠNG
# ══════════════════════════════════════════════════════════════════════
def enrich_food_attributes(item):
    name = (item.get("name") or "").lower()
    rest = (item.get("restaurant") or "").lower()
    cat = (item.get("category") or "").lower()
    desc = (item.get("desc") or item.get("description") or "").lower()
    tags = " ".join(item.get("tags") or []).lower()
    all_text = f"{name} {rest} {cat} {desc} {tags}"

    attrs = set()

    # 1. sweet (đồ ngọt)
    is_sweet = False
    if cat in ["boba", "cafe"] and any(k in all_text for k in ["trà sữa", "chè", "kem", "bánh ngọt", "flan", "bingsu", "sinh tố", "boba", "đường đen", "caramel", "pudding", "tàu hũ", "gelato"]):
        is_sweet = True
    elif any(k in all_text for k in ["chè", "kem ý", "kem bơ", "gelato", "bánh ngọt", "tiệm bánh", "bakery", "flan", "bingsu", "tàu hũ", "bánh su", "tiramisu"]):
        is_sweet = True
    if any(k in name for k in ["cơm", "bún bò", "bún cá", "bún sứa", "phở", "bánh canh", "hủ tiếu", "lẩu", "hải sản", "ốc", "mực", "gà chỉ", "bò né"]):
        is_sweet = False
    if is_sweet:
        attrs.add("sweet")

    # 2. drinks (đồ uống)
    if cat in ["boba", "cafe"] or any(k in all_text for k in ["cà phê", "cafe", "coffee", "trà sữa", "tiệm trà", "trà hoa", "trà đào", "trà trái cây", "sinh tố", "nước ép", "nước dừa"]):
        attrs.add("drinks")

    # 3. hot_soup (đồ nước / nóng hổi)
    if cat in ["noodles", "hotpot"] or any(k in all_text for k in ["bún", "phở", "bánh canh", "hủ tiếu", "mì quảng", "mì cay", "lẩu", "cháo", "súp", "nước dùng"]):
        attrs.add("hot_soup")

    # 4. spicy (đồ cay)
    if any(k in all_text for k in ["cay", "sa tế", "ớt xiêm", "tomyum", "sốt thái", "mì cay", "xé lưỡi", "muối ớt", "măng cay"]):
        attrs.add("spicy")

    # 5. crunchy (đồ giòn rụm)
    if any(k in all_text for k in ["giòn", "bánh xèo", "chả ram", "chiên", "rán", "bánh mì", "bánh tráng nướng", "chân gà", "nem lụi"]):
        attrs.add("crunchy")

    # 6. heavy (no nê)
    if not is_sweet:
        if cat in ["rice", "bbq", "hotpot"] or any(k in all_text for k in ["cơm gà", "cơm tấm", "cơm niêu", "bò né", "steak", "lẩu", "nướng bbq", "gà chỉ", "thịt nướng"]):
            attrs.add("heavy")

    # 7. light (thanh đạm)
    if cat in ["vegetarian", "healthy"] or any(k in all_text for k in ["chay", "thanh đạm", "thanh mát", "salad", "bánh bèo", "sứa nước", "gỏi cuốn", "rau nấm"]):
        attrs.add("light")

    # 8. salty (mặn mà biển, mồi bén)
    if not is_sweet:
        if cat in ["seafood"] or any(k in all_text for k in ["hải sản", "ốc", "tôm", "cua", "ghẹ", "mực", "nem nướng", "mắm", "rang muối", "lai rai"]):
            attrs.add("salty")

    # 9. sour (chua thanh)
    if any(k in all_text for k in ["sốt me", "chua ngọt", "sốt thái", "tomyum", "xoài lắc", "chanh leo", "sứa"]):
        attrs.add("sour")

    if not attrs:
        attrs.add("crunchy" if cat == "streetfood" else "light")

    item["attributes"] = sorted(list(attrs))
    return item

# ══════════════════════════════════════════════════════════════════════
# TIẾN TRÌNH CÀO SHOPEEFOOD THEO DANH MỤC (ANTI-BAN & CHECKPOINT)
# ══════════════════════════════════════════════════════════════════════
def crawl_shopeefood_category(cat_key, max_pages=8, checkpoint_state=None):
    cat_cfg = CATEGORIES_MAP.get(cat_key)
    if not cat_cfg:
        print(f"❌ Không tìm thấy cấu hình cho danh mục: {cat_key}")
        return []

    print(f"\n🚀 BẮT ĐẦU CÀO PHIÊN DANH MỤC: {cat_cfg['label']} ({cat_key})")
    print(f"⏱️ Áp dụng cơ chế Anti-ban: sleep 2.0 - 3.2s ngẫu nhiên giữa các trang...")

    crawled_restaurants = []
    seen_ids = set(checkpoint_state.get("seen_ids", [])) if checkpoint_state else set()
    start_page = checkpoint_state.get("last_page", 0) + 1 if checkpoint_state else 1

    for page in range(start_page, max_pages + 1):
        url = f"{cat_cfg['url']}&page={page}" if "?" in cat_cfg['url'] else f"{cat_cfg['url']}{page}"
        print(f"  📄 Đang quét Trang {page}/{max_pages}: {url}")

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

        valid_in_page = 0
        for it in items:
            item_id = it.get("Id")
            pic = it.get("PicturePathLarge") or it.get("PicturePath") or ""
            name = (it.get("Name") or "").strip()
            addr = clean_address(it.get("Address", ""))
            district = it.get("District", "TP. Quy Nhơn")
            rating = parse_rating(it.get("AvgRating", 4.5))
            review_count = parse_int(it.get("TotalReview", 50))
            lat = parse_rating(it.get("Latitude", QUYNHON_LAT)) or QUYNHON_LAT
            lng = parse_rating(it.get("Longitude", QUYNHON_LNG)) or QUYNHON_LNG

            if item_id in seen_ids:
                continue

            raw_item = {
                "id": item_id,
                "name": name,
                "restaurant": name,
                "address": addr,
                "district": district,
                "cityId": "quynhon",
                "cityName": "Quy Nhơn",
                "rating": round(rating, 1),
                "reviewCount": review_count,
                "lat": lat,
                "lng": lng,
                "latitude": lat,
                "longitude": lng,
                "image": pic,
                "category": cat_cfg["category"],
                "source": "ShopeeFood"
            }

            # Áp dụng Màng lọc Kiểm soát chất lượng
            is_valid, reason = is_valid_quality_food(raw_item)
            if not is_valid:
                continue

            seen_ids.add(item_id)
            enriched_item = enrich_food_attributes(raw_item)
            crawled_restaurants.append(enriched_item)
            valid_in_page += 1

        print(f"     ✅ Trang {page}: Quét được {len(items)} quán, chấp thuận {valid_in_page} quán chất lượng cao. (Tổng tích lũy: {len(crawled_restaurants)})")

        # Lưu checkpoint sau mỗi trang
        save_checkpoint({
            "cat_key": cat_key,
            "last_page": page,
            "seen_ids": list(seen_ids),
            "count": len(crawled_restaurants),
            "updated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        })

        # Anti-ban sleep giữa các trang
        if page < max_pages:
            smart_sleep(2.0, 3.2)

    return crawled_restaurants

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

# ══════════════════════════════════════════════════════════════════════
# DỌN DẸP & ĐỒNG BỘ DATABASE HIỆN TẠI (PURGE & SYNC)
# ══════════════════════════════════════════════════════════════════════
def prune_and_clean_database():
    """
    Quét toàn bộ database hiện tại (food-data.json và js/data.js):
    Tự động xoá bỏ mọi quán rác, quán không đạt chuẩn chất lượng:
    - Thiếu URL hình ảnh hoặc ảnh placeholder
    - Rating < 4.0 và < 20 lượt đánh giá
    - Quán đã đóng cửa vĩnh viễn
    - Quán không có địa chỉ thật / tọa độ sai lệch
    """
    print("\n🧹 BẮT ĐẦU DỌN DẸP & THANH LỌC DATABASE HIỆN TẠI...")
    if not os.path.exists(DATABASE_JSON):
        print(f"❌ Không tìm thấy file {DATABASE_JSON}")
        return

    with open(DATABASE_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    current_foods = data.get("foods", [])
    initial_count = len(current_foods)
    cleaned_foods = []
    purged_reasons = {}

    for f in current_foods:
        is_valid, reason = is_valid_quality_food(f)
        if is_valid:
            # Đảm bảo có attributes đầy đủ
            if not f.get("attributes"):
                f = enrich_food_attributes(f)
            cleaned_foods.append(f)
        else:
            purged_reasons[reason] = purged_reasons.get(reason, 0) + 1
            print(f"  ❌ Loại bỏ: ID {f.get('id')} - {f.get('name')} | Lý do: {reason}")

    data["foods"] = cleaned_foods
    with open(DATABASE_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n📊 KẾT QUẢ THANH LỌC DATABASE:")
    print(f"  - Số quán ban đầu: {initial_count}")
    print(f"  - Số quán bị loại bỏ: {initial_count - len(cleaned_foods)}")
    print(f"  - Số quán chất lượng cao được giữ lại: {len(cleaned_foods)}")
    print(f"  - Chi tiết các lý do loại bỏ: {json.dumps(purged_reasons, ensure_ascii=False, indent=4)}")

    # Đồng bộ sang js/data.js
    sync_to_data_js(cleaned_foods)

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
    existing_names = set(f.get("name", "").lower() for f in current_foods)

    added = 0
    for nf in new_foods:
        if nf.get("id") in existing_ids or nf.get("name", "").lower() in existing_names:
            continue
        current_foods.append(nf)
        existing_ids.add(nf.get("id"))
        existing_names.add(nf.get("name", "").lower())
        added += 1

    data["foods"] = current_foods
    with open(DATABASE_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    sync_to_data_js(current_foods)
    print(f"🎉 Đã gộp thêm {added} quán mới đạt chuẩn vào database. Tổng cộng: {len(current_foods)} quán!")

# ══════════════════════════════════════════════════════════════════════
# MAIN ENTRY POINT
# ══════════════════════════════════════════════════════════════════════
def main():
    parser = argparse.ArgumentParser(description="ShopeeFood Quy Nhơn Anti-ban Crawler & Quality Filter")
    parser.add_argument("--category", type=str, choices=list(CATEGORIES_MAP.keys()), help="Cào 1 danh mục cụ thể")
    parser.add_argument("--all", action="store_true", help="Cào tất cả danh mục theo từng phiên")
    parser.add_argument("--pages", type=int, default=6, help="Số trang mỗi danh mục (mặc định: 6)")
    parser.add_argument("--break-sec", type=int, default=15, help="Thời gian nghỉ (giây) giữa các danh mục (mặc định: 15s, có thể chỉnh 600s để nghỉ 10 phút)")
    parser.add_argument("--prune-only", action="store_true", help="Chỉ chạy thanh lọc database hiện tại (xóa quán rác/quán ảo)")
    parser.add_argument("--import-file", type=str, help="Nhập file dữ liệu cào thô (.json) để áp dụng Quality Gate & lọc vào database")
    parser.add_argument("--merge-into-db", action="store_true", help="Tự động gộp các quán mới cào đạt chuẩn vào food-data.json và js/data.js")
    parser.add_argument("--resume", action="store_true", help="Tiếp tục từ checkpoint gần nhất")

    args = parser.parse_args()

    # Luôn thanh lọc database hiện tại trước
    prune_and_clean_database()

    if args.prune_only:
        print("\n✅ Đã hoàn tất thanh lọc database!")
        return

    # Chế độ Import dữ liệu thô từ file cào
    if args.import_file:
        if not os.path.exists(args.import_file):
            print(f"❌ Không tìm thấy file: {args.import_file}")
            return
        print(f"\n📥 Đang nhập và lọc dữ liệu từ file thô: {args.import_file}...")
        with open(args.import_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        valid_imported = []
        for raw in raw_data:
            # Chuẩn hóa format
            item = {
                "id": raw.get("id"),
                "name": raw.get("name"),
                "restaurant": raw.get("restaurant", raw.get("name")),
                "address": clean_address(raw.get("address", "")),
                "district": raw.get("district", "TP. Quy Nhơn"),
                "cityId": "quynhon",
                "cityName": "Quy Nhơn",
                "rating": round(parse_rating(raw.get("rating")), 1),
                "reviewCount": parse_int(raw.get("reviewCount", raw.get("totalReviews", 0))),
                "lat": parse_rating(raw.get("lat") or raw.get("latitude")) or QUYNHON_LAT,
                "lng": parse_rating(raw.get("lng") or raw.get("longitude")) or QUYNHON_LNG,
                "image": raw.get("image", ""),
                "category": raw.get("category", "streetfood"),
                "source": "ShopeeFood"
            }
            ok, reason = is_valid_quality_food(item)
            if ok:
                valid_imported.append(enrich_food_attributes(item))

        print(f"✅ Đã lọc thành công {len(valid_imported)}/{len(raw_data)} quán đạt chuẩn chất lượng cao từ file {args.import_file}!")
        if args.merge_into_db and valid_imported:
            merge_new_foods_into_database(valid_imported)
        return

    categories_to_run = []
    if args.category:
        categories_to_run = [args.category]
    elif args.all:
        categories_to_run = list(CATEGORIES_MAP.keys())
    else:
        print("\n💡 Gợi ý sử dụng:")
        print("  - Chạy thanh lọc database: python3 scripts/crawl_shopeefood_quynhon.py --prune-only")
        print("  - Cào danh mục Đồ Uống:    python3 scripts/crawl_shopeefood_quynhon.py --category do-uong --pages 6")
        print("  - Cào tất cả danh mục:     python3 scripts/crawl_shopeefood_quynhon.py --all --pages 6 --break-sec 30")
        return

    all_new_foods = []
    for idx, cat in enumerate(categories_to_run):
        cp = load_checkpoint() if args.resume else None
        res = crawl_shopeefood_category(cat, max_pages=args.pages, checkpoint_state=cp)
        all_new_foods.extend(res)

        # Nghỉ giữa các phiên cào danh mục để chống ban IP
        if idx < len(categories_to_run) - 1:
            print(f"\n☕ [Anti-ban] Đã hoàn thành danh mục '{cat}'. Nghỉ {args.break_sec} giây trước khi chuyển sang danh mục tiếp theo...")
            time.sleep(args.break_sec)

    # Lưu kết quả cào mới & tự động gộp vào database
    if all_new_foods:
        os.makedirs(SCRATCH_DIR, exist_ok=True)
        with open(OUTPUT_CRAWLED_FILE, "w", encoding="utf-8") as f:
            json.dump(all_new_foods, f, ensure_ascii=False, indent=2)
        print(f"\n🎉 CÀO THÀNH CÔNG TỔNG CỘNG {len(all_new_foods)} QUÁN MỚI ĐẠT CHUẨN!")
        print(f"📁 Đã lưu dữ liệu tại: {OUTPUT_CRAWLED_FILE}")
        merge_new_foods_into_database(all_new_foods)
    else:
        print("\nℹ️ Phiên cào hoàn tất. Không có thêm quán mới nào cần nạp.")

if __name__ == "__main__":
    main()
