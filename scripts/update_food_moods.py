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

def extract_prices(food):
    pr = food.get("priceRange") or ""
    nums = [int(n) for n in re.findall(r"\d+", pr.replace(".", ""))]
    p_min = nums[0] if nums else 35000
    p_max = nums[1] if len(nums) > 1 else p_min
    return p_min, p_max

def classify_moods(food, price_min, price_max):
    name = (food.get("name") or "").lower()
    cat = (food.get("category") or "").lower()
    rest = (food.get("restaurant") or "").lower()
    desc = (food.get("desc") or "").lower()
    tags = [str(t).lower() for t in food.get("tags") or []]
    all_text = " ".join([name, cat, rest, desc] + tags)
    
    open_time = food.get("openTime") or ""
    close_hour = parse_close_hour(open_time)
    
    moods = set()
    
    # 1. tired (Mệt mỏi: cháo, súp, bún thanh, bánh canh, thanh đạm, đồ chay, nước ép, sinh tố)
    if any(k in all_text for k in ["cháo", "súp", "bánh canh", "bún riêu", "bún cá", "bún sứa", "phở", "chay", "thanh đạm", "hấp", "nước dừa", "sinh tố", "nước ép", "yến"]):
        moods.add("tired")
        
    # 2. healthy (Eat Clean: chay, salad, rau, nước ép, thanh mát, cá hấp, sứa)
    if any(k in all_text for k in ["chay", "salad", "rau", "nước ép", "sinh tố", "sữa chua", "thanh đạm", "eat clean", "sứa", "bún cá"]) and not any(k in all_text for k in ["nướng", "chiên", "béo", "lẩu cay"]):
        moods.add("healthy")
        
    # 3. craving (Thèm ăn ngon: bánh xèo giòn, nem nướng, hải sản đậm vị, gà nướng lu, giòn rụm)
    if any(k in all_text for k in ["bánh xèo", "nem nướng", "hải sản", "gà chỉ", "nướng lu", "giòn rụm", "đậm đà", "bò sốt", "chả ram", "ốc", "bánh tráng nướng"]):
        moods.add("craving")
        
    # 4. energetic (Sôi động: lẩu, nướng bbq, quán nhậu, tụ tập bạn bè, bia mồi)
    if any(k in all_text for k in ["lẩu", "nướng", "bbq", "quán nhậu", "gà chỉ", "hải sản nướng", "xì xèo", "tụ tập", "bia"]):
        moods.add("energetic")
        
    # 5. chill (Thư giãn: cà phê, trà sữa, chè, kem, tiệm bánh, ăn vặt nhẹ nhàng)
    if any(k in all_text for k in ["cà phê", "cafe", "coffee", "trà sữa", "trà hoa", "trà đào", "chè", "kem", "bánh ngọt", "tiệm trà"]):
        moods.add("chill")
        
    # 6. comfort (Cần vỗ về: món nước nóng hổi thơm ngon, bánh canh, bún bò, chè ấm, cháo thơm)
    if any(k in all_text for k in ["bánh canh", "bún bò", "cháo", "chè", "súp", "hủ tiếu", "phở", "ấm áp"]):
        moods.add("comfort")
        
    # 7. budget (Viêm túi: Quy định giá min của quán ăn phải <= 50k)
    if price_min <= 50000:
        if price_max <= 55000 or any(k in all_text for k in ["bánh mì", "bánh bèo", "bánh tráng", "sinh viên", "bình dân", "xôi", "bún riêu", "phá lấu", "ăn vặt", "trà sữa", "chè"]):
            if not any(k in all_text for k in ["tôm hùm", "cua huỳnh đế", "cá mú", "buffet lẩu", "đại tiệc", "vườn ẩm thực"]):
                moods.add("budget")
        
    # 8. celebrate (Tự thưởng: hải sản tươi sống cao cấp, tiệc lẩu nướng hoành tráng, tôm hùm, cua huỳnh đế, bò bít tết)
    if price_max >= 150000 or any(k in all_text for k in ["tôm hùm", "cua huỳnh đế", "cá mú", "bò bít tết", "hải sản tươi sống", "buffet", "tiệc", "đại tiệc"]):
        moods.add("celebrate")
        
    # 9. date (Hẹn hò: view biển lãng mạn, cà phê acoustic, steak, lẩu nướng sạch đẹp, sushi)
    if any(k in all_text for k in ["view biển", "lãng mạn", "rooftop", "steak", "pizza", "nướng không khói", "sushi", "bờ biển", "acoustic", "sang trọng"]) or (cat == "cafe" and any(k in all_text for k in ["view", "chill", "sống ảo", "đẹp"])):
        moods.add("date")
        
    # 10. spicy (Thèm cay: cay, sa tế, tomyum, sốt thái, mì cay, lẩu thái, ớt hiểm)
    if any(k in all_text for k in ["cay", "sa tế", "tomyum", "sốt thái", "ớt", "mì cay", "chua cay", "sốt cay", "xé lưỡi"]):
        moods.add("spicy")
        
    # 11. late_night (Ăn đêm: quán mở khuya sau 22:30 hoặc tới 0h - 2h sáng)
    if close_hour >= 23 or any(k in all_text for k in ["ăn đêm", "khuya", "cháo đêm", "ốc đêm"]):
        moods.add("late_night")
        
    # 12. sweet (Thèm ngọt: chè, kem, bánh ngọt, trà sữa, flan, sinh tố ngọt, bingsu) - USER REQUEST
    if any(k in all_text for k in ["chè", "kem", "bánh ngọt", "trà sữa", "flan", "sinh tố", "boba", "đường đen", "ngọt"]):
        moods.add("sweet")
        
    # 13. zen (Thanh tịnh: CHỈ hiển thị và gán cho các quán chay / món chay thuần chay)
    is_veg = cat == "vegetarian" or any(k in all_text for k in ["chay", "vegan", "an lạc", "thiện duyên", "tâm thiện", "pháp luân", "minh an"])
    if is_veg and not any(k in all_text for k in ["bò", "gà", "hải sản", "heo", "thịt", "tôm", "mực", "cá "]):
        moods.add("zen")
        food["category"] = "vegetarian"
        
    # 14. seafood (Hải sản: đặc sản biển tôm cua ghẹ mực ốc cá mú Quy Nhơn)
    if any(k in all_text for k in ["hải sản", "tôm hùm", "tôm", "cua", "ghẹ", "mực", "ốc", "cá mú", "sứa", "nghêu", "sò"]):
        moods.add("seafood")
        
    # 15. hangout (Lai rai: mồi bén, mực nướng sa tế, nem nướng, chân gà, bia nhậu)
    if any(k in all_text for k in ["nướng", "quán nhậu", "mực lá", "chân gà", "bia", "nem nướng", "xì xèo", "ốc"]):
        moods.add("hangout")
        
    # 16. refreshing (Giải nhiệt: trà trái cây, nước ép, dừa xiêm, kem chè mát lạnh)
    if any(k in all_text for k in ["trà ", "nước ép", "sinh tố", "dừa", "kem", "chè", "sứa", "thanh mát", "giải nhiệt"]):
        moods.add("refreshing")
        
    # 17. quick (Nhanh gọn: bánh mì, xôi, bánh bao, bánh bèo, đồ ăn liền tiện lợi)
    if any(k in all_text for k in ["bánh mì", "xôi", "bánh bao", "bánh bèo", "nhanh gọn", "tiện lợi"]):
        moods.add("quick")
        
    # Fallback
    if not moods:
        moods.add("craving")
        
    return sorted(list(moods))

def main():
    with open("food-data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    foods = data["foods"]
    for food in foods:
        p_min, p_max = extract_prices(food)
        food["priceMin"] = p_min
        food["priceMax"] = p_max
        food["moodIds"] = classify_moods(food, p_min, p_max)
        
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
        
    print(f"Successfully refined 17 moodIds and set priceMin/priceMax for {len(foods)} foods in food-data.json and js/data.js!")
    
    mood_counts = {}
    for f in foods:
        for m in f["moodIds"]:
            mood_counts[m] = mood_counts.get(m, 0) + 1
            
    print("Refined distribution:")
    for m, c in sorted(mood_counts.items(), key=lambda x: -x[1]):
        print(f"  {m}: {c}")

if __name__ == "__main__":
    main()
