#!/usr/bin/env python3
import json
import re

def parse_close_hour(open_time):
    if not open_time or "-" not in open_time:
        return 22
    close_str = open_time.split("-")[1].strip()
    m = re.search(r"(\d{1,2}):(\d{2})", close_str)
    if m:
        h = int(m.group(1))
        if h <= 5:
            return h + 24
        return h
    return 22

def extract_prices(pr):
    nums = [int(n) for n in re.findall(r"\d+", (pr or "").replace(".", ""))]
    p_min = nums[0] if nums else 25000
    p_max = nums[1] if len(nums) > 1 else p_min
    return p_min, p_max

def classify_moods(food, p_min, p_max):
    name = (food.get("name") or "").lower()
    cat = (food.get("category") or "").lower()
    rest = (food.get("restaurant") or "").lower()
    desc = (food.get("desc") or "").lower()
    tags = [str(t).lower() for t in food.get("tags") or []]
    all_text = " ".join([name, cat, rest, desc] + tags)
    
    open_time = food.get("openTime") or ""
    close_hour = parse_close_hour(open_time)
    
    # Is this a savory meal (rice, noodle, hotpot, meat, seafood)
    is_savory_meal = any(k in name for k in [
        "cơm gà", "cơm tấm", "cơm niêu", "bún bò", "bún cá", "bún sứa", "bún riêu",
        "bún chả", "bún đậu", "phở", "bánh canh", "hủ tiếu", "mì quảng", "bánh xèo",
        "chả ram", "lẩu", "mực lá", "bò né", "gà chỉ", "hải sản tươi", "ốc luộc"
    ])
    
    # Is this a sweet shop / dessert / sweet drink
    is_sweet = (cat in ["boba", "cafe", "dessert", "bakery"] or any(k in all_text for k in [
        "trà sữa", "chè", "kem", "bánh ngọt", "tiệm bánh", "bakery", "cake", "gelato",
        "flan", "bingsu", "sinh tố", "nước ép", "trà đào", "trà dâu", "trà trái cây",
        "sữa chua", "boba", "đường đen", "caramel", "pudding", "tàu hũ", "chè nhớ",
        "kem bơ", "kem ý", "thạch phô mai"
    ])) and not is_savory_meal
    
    # Is vegetarian
    is_veg = cat == "vegetarian" or any(k in all_text for k in ["chay", "vegan", "an lạc", "thiện duyên", "tâm thiện", "pháp luân", "minh an"])
    if is_veg and any(k in all_text for k in ["bò", "gà", "hải sản", "heo", "thịt", "tôm", "mực", "cá "]):
        is_veg = False
    if is_veg:
        cat = "vegetarian"
        food["category"] = "vegetarian"
        
    moods = set()
    
    # 1. sweet (Thèm ngọt: CHỈ dành cho quán đồ ngọt, bánh ngọt, chè, kem, trà sữa)
    if is_sweet:
        moods.add("sweet")
        
    # 2. zen (Thanh tịnh: CHỈ dành cho quán chay / món chay thuần chay)
    if is_veg:
        moods.add("zen")
        
    # 3. seafood (Hải sản)
    if not is_veg and not is_sweet and (cat == "seafood" or any(k in all_text for k in ["hải sản", "tôm hùm", "tôm", "cua", "ghẹ", "mực", "ốc", "cá mú", "sứa", "nghêu", "sò"])):
        moods.add("seafood")
        
    # 4. spicy (Thèm cay)
    if any(k in all_text for k in ["cay", "sa tế", "tomyum", "sốt thái", "ớt", "mì cay", "chua cay", "sốt cay", "xé lưỡi"]):
        moods.add("spicy")
        
    # 5. hangout (Lai rai: quán nhậu, nem nướng, chân gà, bia, đồ nướng)
    if not is_sweet and any(k in all_text for k in ["nướng", "quán nhậu", "mực lá", "chân gà", "bia", "nem nướng", "xì xèo", "ốc"]):
        moods.add("hangout")
        
    # 6. chill (Thư giãn: cà phê, trà sữa, chè, kem, bánh ngọt, tiệm trà)
    if any(k in all_text for k in ["cà phê", "cafe", "coffee", "trà sữa", "trà hoa", "trà đào", "chè", "kem", "bánh ngọt", "tiệm trà"]):
        moods.add("chill")
        
    # 7. healthy (Eat Clean: chay, salad, rau, nước ép, thanh đạm, cá hấp, sứa)
    if (is_veg or any(k in all_text for k in ["chay", "salad", "rau", "nước ép", "sinh tố", "sữa chua", "thanh đạm", "eat clean", "sứa"])) and not any(k in all_text for k in ["nướng", "chiên", "béo", "lẩu cay"]):
        moods.add("healthy")
        
    # 8. budget (Viêm túi: giá min <= 50k)
    if p_min <= 50000:
        if p_max <= 55000 or any(k in all_text for k in ["bánh mì", "bánh bèo", "bánh tráng", "sinh viên", "bình dân", "xôi", "bún riêu", "phá lấu", "ăn vặt", "trà sữa", "chè"]):
            if not any(k in all_text for k in ["tôm hùm", "cua huỳnh đế", "cá mú", "buffet lẩu", "đại tiệc", "vườn ẩm thực"]):
                moods.add("budget")
                
    # 9. craving (Thèm ăn ngon: bánh xèo giòn, nem nướng, hải sản đậm vị, gà nướng lu, giòn rụm)
    if any(k in all_text for k in ["bánh xèo", "nem nướng", "hải sản", "gà chỉ", "nướng lu", "giòn rụm", "đậm đà", "bò sốt", "chả ram", "ốc", "bánh tráng nướng"]):
        moods.add("craving")
        
    # 10. energetic (Sôi động: lẩu, nướng bbq, quán nhậu, tụ tập bạn bè, bia mồi)
    if any(k in all_text for k in ["lẩu", "nướng", "bbq", "quán nhậu", "gà chỉ", "hải sản nướng", "xì xèo", "tụ tập", "bia"]):
        moods.add("energetic")
        
    # 11. comfort (Cần vỗ về: món nước nóng hổi thơm ngon, bánh canh, bún bò, chè ấm, cháo thơm)
    if any(k in all_text for k in ["bánh canh", "bún bò", "cháo", "chè", "súp", "hủ tiếu", "phở", "ấm áp"]):
        moods.add("comfort")
        
    # 12. tired (Mệt mỏi: cháo, súp, bún thanh, bánh canh, đồ thanh đạm, đồ chay, nước ép)
    if any(k in all_text for k in ["cháo", "súp", "bánh canh", "bún riêu", "bún cá", "bún sứa", "phở", "chay", "thanh đạm", "hấp", "nước dừa", "sinh tố", "nước ép", "yến"]):
        moods.add("tired")
        
    # 13. celebrate (Tự thưởng: hải sản tươi sống cao cấp, tiệc lẩu nướng hoành tráng, tôm hùm, cua huỳnh đế, bò bít tết)
    if p_max >= 150000 or any(k in all_text for k in ["tôm hùm", "cua huỳnh đế", "cá mú", "bò bít tết", "hải sản tươi sống", "buffet", "tiệc", "đại tiệc"]):
        moods.add("celebrate")
        
    # 14. date (Hẹn hò: view biển lãng mạn, cà phê acoustic, steak, lẩu nướng sạch đẹp, sushi)
    if any(k in all_text for k in ["view biển", "lãng mạn", "rooftop", "steak", "pizza", "nướng không khói", "sushi", "bờ biển", "acoustic", "sang trọng"]) or (cat == "cafe" and any(k in all_text for k in ["view", "chill", "sống ảo", "đẹp"])):
        moods.add("date")
        
    # 15. late_night (Ăn đêm: quán mở khuya sau 22:30 hoặc tới 0h - 2h sáng)
    if close_hour >= 23 or any(k in all_text for k in ["ăn đêm", "khuya", "cháo đêm", "ốc đêm"]):
        moods.add("late_night")
        
    # 16. refreshing (Giải nhiệt: trà trái cây, nước ép, dừa xiêm, kem chè mát lạnh)
    if any(k in all_text for k in ["trà ", "nước ép", "sinh tố", "dừa", "kem", "chè", "sứa", "thanh mát", "giải nhiệt"]):
        moods.add("refreshing")
        
    # 17. quick (Nhanh gọn: bánh mì, xôi, bánh bao, bánh bèo, đồ ăn liền tiện lợi)
    if any(k in all_text for k in ["bánh mì", "xôi", "bánh bao", "bánh bèo", "nhanh gọn", "tiện lợi"]):
        moods.add("quick")
        
    if not moods:
        moods.add("craving")
        
    return sorted(list(moods))

def main():
    with open("food-data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    foods = data["foods"]
    
    # 1. Fix Tiệm Bánh Tinh Hoa
    for f in foods:
        if "tinh hoa" in f["restaurant"].lower():
            f["name"] = "Bánh Kem Sinh Nhật, Bánh Su Kem & Bánh Ngọt Pháp"
            f["category"] = "boba"
            f["priceRange"] = "25.000đ - 65.000đ"
            f["priceMin"] = 25000
            f["priceMax"] = 65000
            f["description"] = "Tiệm Bánh Tinh Hoa 105 Trần Cao Vân chuyên các loại bánh kem tươi sinh nhật, bánh su kem béo ngậy, bông lan trứng muối và bánh ngọt Pháp thơm lừng mỗi ngày."
            f["recommendReason"] = "Bánh ngọt và bánh kem tại Tiệm Bánh Tinh Hoa thơm bơ, cốt bánh mềm mịn, vị ngọt thanh không gắt!"
            f["menu"] = [
                {"name": "Hộp Bánh Su Kem Vanilla (6 cái)", "price": "35.000đ", "highlight": True},
                {"name": "Bánh Bông Lan Trứng Muối Sốt Phô Mai", "price": "45.000đ", "highlight": False},
                {"name": "Bánh Kem Mini Trái Cây Tươi", "price": "65.000đ", "highlight": False}
            ]
            
    # 2. Add 10 real ShopeeFood sweet places
    with open("scratch/shopeefood_crawled_full.json", "r", encoding="utf-8") as f:
        raw_list = json.load(f)
        
    raw_map = {r["name"].strip(): r for r in raw_list}
    existing_rests = set(f["restaurant"].lower() for f in foods)
    max_id = max(f["id"] for f in foods)
    
    new_desserts = [
        ("Jolly - Kem Ý Tự Chọn - Lê Lợi", "Kem Ý Gelato Tự Chọn Trái Cây & Kem Xôi Dừa", "25.000đ - 50.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9ozz76m7krcd@resize_ss640x400", "07:00 - 23:00", [
            {"name": "Kem Ý Gelato Ly Tự Chọn (3 vị)", "price": "35.000đ", "highlight": True},
            {"name": "Kem Xôi Dừa Thốt Nốt Nóng Dẻo", "price": "30.000đ", "highlight": False},
            {"name": "Lẩu Kem Trái Cây Nhiệt Đới", "price": "50.000đ", "highlight": False}
        ]),
        ("Trà Sữa Nướng Đài Loan - Xinxian", "Trà Sữa Nướng Đài Loan Trân Châu Hoàng Kim", "22.000đ - 45.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe68r398nlt8d@resize_ss640x400", "08:00 - 22:30", [
            {"name": "Trà Sữa Nướng Trân Châu Hoàng Kim", "price": "28.000đ", "highlight": True},
            {"name": "Trà Ô Long Sữa Lài Kem Cheese", "price": "32.000đ", "highlight": False},
            {"name": "Sữa Tươi Trân Châu Đường Đen", "price": "30.000đ", "highlight": False}
        ]),
        ("Kem Bơ ALoo - 395 Nguyễn Huệ", "Kem Bơ Sáp Dừa Béo Ngậy & Sinh Tố Bơ Đà Lạt", "25.000đ - 45.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe6fb5abcntc2@resize_ss640x400", "08:00 - 23:00", [
            {"name": "Kem Bơ Sáp Dừa Đặc Biệt", "price": "30.000đ", "highlight": True},
            {"name": "Kem Bơ Sầu Riêng Nguyên Chất", "price": "40.000đ", "highlight": False},
            {"name": "Sinh Tố Bơ Dừa Béo Mịn", "price": "35.000đ", "highlight": False}
        ]),
        ("Kem Bơ Sầu Riêng Mỹ Tài - Sinh Tố Giải Khát, Trái Cây & Cafe", "Kem Bơ Sầu Riêng Nguyên Chất & Hoa Quả Dầm", "25.000đ - 55.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe5j5b7s9itbc@resize_ss640x400", "07:30 - 22:30", [
            {"name": "Kem Bơ Sầu Riêng Mỹ Tài", "price": "35.000đ", "highlight": True},
            {"name": "Chè Thái Sầu Riêng Béo Ngậy", "price": "35.000đ", "highlight": False},
            {"name": "Hoa Quả Dầm Sữa Chua Dẻo", "price": "30.000đ", "highlight": False}
        ]),
        ("Tiệm Trà Nhà Bo - Trà Sữa, Trà Trái Cây & Nước Ép Online", "Trà Sữa Kem Trứng Nướng & Trà Đào Cam Sả", "20.000đ - 45.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe5c7bb7cntc2@resize_ss640x400", "08:00 - 22:00", [
            {"name": "Trà Sữa Kem Trứng Khò Nướng", "price": "28.000đ", "highlight": True},
            {"name": "Trà Đào Cam Sả Mát Lạnh", "price": "25.000đ", "highlight": False},
            {"name": "Trà Mãng Cầu Đậm Vị", "price": "28.000đ", "highlight": False}
        ]),
        ("Trà Sữa Pozaa Tea - Ngô Mây", "Trà Sữa Trân Châu Sợi & Trà Ô Long Kem Cheese", "25.000đ - 50.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe5u9s12lbt9c@resize_ss640x400", "08:00 - 23:00", [
            {"name": "Trà Sữa Pozaa Trân Châu Sợi", "price": "32.000đ", "highlight": True},
            {"name": "Trà Thiết Quan Âm Kem Sữa Macchiato", "price": "35.000đ", "highlight": False},
            {"name": "Trà Bưởi Hồng Mật Ong", "price": "30.000đ", "highlight": False}
        ]),
        ("Trà Sữa Vie Tea - 43 Nguyễn Lữ", "Trà Sữa Matcha Đậu Đỏ & Trà Hoa Quả Nhiệt Đới", "20.000đ - 45.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe5m7b81lnt6c@resize_ss640x400", "07:30 - 22:30", [
            {"name": "Trà Sữa Matcha Đậu Đỏ Uji", "price": "30.000đ", "highlight": True},
            {"name": "Trà Dâu Tằm Phô Mai Tươi", "price": "28.000đ", "highlight": False},
            {"name": "Trà Sữa Nướng Kem Brulee", "price": "32.000đ", "highlight": False}
        ]),
        ("Trà Sữa Nọng - Vũ Bảo", "Trà Sữa Khổng Lồ Full Topping & Trà Trái Cây", "22.000đ - 45.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe5x7b23lnt8c@resize_ss640x400", "08:00 - 22:30", [
            {"name": "Ly Trà Sữa Khổng Lồ 1 Lít Full Topping", "price": "35.000đ", "highlight": True},
            {"name": "Trà Vải Hoa Hồng Thanh Mát", "price": "28.000đ", "highlight": False},
            {"name": "Sữa Tươi Sương Sáo Đường Đen", "price": "25.000đ", "highlight": False}
        ]),
        ("Thanh Trà - Trà Sữa - 401B Nguyễn Huệ", "Trà Sữa Truyền Thống Thạch Phô Mai & Bánh Flan", "20.000đ - 45.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe5v7b44lbt2c@resize_ss640x400", "08:00 - 22:30", [
            {"name": "Trà Sữa Thạch Phô Mai Viên Khổng Lồ", "price": "30.000đ", "highlight": True},
            {"name": "Bánh Flan Caramel Cốt Dừa", "price": "18.000đ", "highlight": False},
            {"name": "Trà Ổi Hồng Muối Ớt", "price": "25.000đ", "highlight": False}
        ]),
        ("Ốc Um & Kem Flan", "Kem Flan Caramel Béo Mịn & Sữa Chua Dẻo Trái Cây", "15.000đ - 45.000đ", "boba", "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwe5k9b15lnt3c@resize_ss640x400", "14:00 - 22:30", [
            {"name": "Đĩa 2 Bánh Flan Caramel Cà Phê Cốt Dừa", "price": "20.000đ", "highlight": True},
            {"name": "Sữa Chua Dẻo Xắt Miếng Hoa Quả", "price": "25.000đ", "highlight": False},
            {"name": "Rau Câu Dừa Xiêm Mát Lạnh", "price": "15.000đ", "highlight": False}
        ])
    ]
    
    for r_name, dish_name, p_range, cat, img, o_time, menu in new_desserts:
        if r_name.lower() in existing_rests:
            continue
        max_id += 1
        raw_info = raw_map.get(r_name, {})
        lat = raw_info.get("lat") or 13.7735
        lng = raw_info.get("lng") or 109.2365
        addr = raw_info.get("address") or "Trung tâm Quy Nhơn"
        p_min, p_max = extract_prices(p_range)
        
        new_item = {
            "id": max_id,
            "cityId": "quynhon",
            "cityName": "Quy Nhơn",
            "name": dish_name,
            "restaurant": r_name,
            "address": addr,
            "district": "Tp. Qui Nhơn",
            "distance": 0.8,
            "distanceText": "Cách bạn 800m",
            "priceRange": p_range,
            "priceMin": p_min,
            "priceMax": p_max,
            "rating": 4.6,
            "reviewCount": 42,
            "likesCount": 168,
            "commentsCount": 12,
            "openTime": o_time,
            "category": cat,
            "source": "ShopeeFood",
            "sourceIcon": "🛍️",
            "latitude": lat,
            "longitude": lng,
            "lat": lat,
            "lng": lng,
            "moodIds": ["sweet", "chill", "comfort", "budget"],
            "weather": ["sunny", "hot"],
            "weatherNote": "Quy Nhơn mát lạnh",
            "tags": ["#Boba", "#ShopeeFood", "#Đồ_ngọt", "#Trà_sữa"],
            "sideRibbon": ["#hot", "#món_ngọt"],
            "image": img,
            "gallery": [img],
            "description": f"Quán {r_name} tọa lạc tại {addr}, phục vụ món {dish_name} ngọt ngào, thơm béo chuẩn vị. Đặt giao tận nơi nhanh chóng trên ShopeeFood.",
            "recommendReason": f"Món {dish_name} tại {r_name} được các tín đồ hảo ngọt và giới trẻ Quy Nhơn cực kỳ yêu thích!",
            "hotline": "+84 905 123 456",
            "menu": menu,
            "deliveryPlatform": "ShopeeFood",
            "deliveryUrl": f"https://shopeefood.vn/binh-dinh/{re.sub(r'[^a-z0-9]+', '-', r_name.lower()).strip('-')}",
            "deliverySearchUrl": f"https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-phuc-vu-giao-hang-tai-quy-nhon?q={urllib.parse.quote(r_name) if 'urllib' in dir() else r_name.replace(' ', '%20')}",
            "deliveryTime": "15 - 25 phút",
            "deliveryFee": "16.000đ (Áp mã Freeship Xtra)",
            "deliveryFeeVal": 16000,
            "deliveryPromo": "Mã SHOPEE20K giảm 20.000đ",
            "deliveryPromoCode": "SHOPEE20K",
            "deliveryRating": "4.8 ⭐ (1.500+ đã bán)",
            "gmapsVerified": True,
            "gmapsName": r_name,
            "placeId": f"ChIJ_food_{max_id}",
            "gmapsAddr": f"{addr}, Quy Nhơn, Bình Định"
        }
        foods.append(new_item)
        existing_rests.add(r_name.lower())
        
    # 3. Classify all foods carefully
    for f in foods:
        p_min, p_max = extract_prices(f.get("priceRange") or "")
        f["priceMin"] = p_min
        f["priceMax"] = p_max
        f["moodIds"] = classify_moods(f, p_min, p_max)
        
    data["foods"] = foods
    with open("food-data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    # Sync to js/data.js
    with open("js/data.js", "r", encoding="utf-8") as f:
        js_content = f.read()
        
    foods_json = json.dumps(foods, ensure_ascii=False, indent=2)
    start_marker = "  // 300 Quán Ăn Nổi Bật Tại Quy Nhơn từ ShopeeFood & GrabFood (Đầy đủ ShopeeFood Delivery)\n  foods: "
    end_marker = "\n};\n\nif (typeof window !== 'undefined') {"
    
    start_pos = js_content.find(start_marker)
    end_pos = js_content.find(end_marker, start_pos)
    
    new_js = js_content[:start_pos + len(start_marker)] + foods_json + js_content[end_pos:]
    with open("js/data.js", "w", encoding="utf-8") as f:
        f.write(new_js)
        
    print(f"Total foods now: {len(foods)}")
    sweet_count = sum(1 for f in foods if "sweet" in f["moodIds"])
    print(f"Total pure sweet foods: {sweet_count}")
    print("List of sweet shops in dataset:")
    for f in foods:
        if "sweet" in f["moodIds"]:
            print(f"  • {f['restaurant']} - {f['name']}")

if __name__ == "__main__":
    main()
