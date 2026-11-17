#!/usr/bin/env python3
import json

def main():
    with open("food-data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    foods = data["foods"]
    
    with open("scratch/shopeefood_crawled_full.json", "r", encoding="utf-8") as f:
        raw_list = json.load(f)
        
    raw_by_name = {r["name"].strip().lower(): r for r in raw_list}
    
    # Real image mappings crawled directly from ShopeeFood API
    real_images = {
        "trà sữa nướng đài loan - xinxian": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc5hwmbqh0ae@resize_ss640x400",
        "kem bơ aloo - 395 nguyễn huệ": "https://down-vn.img.susercontent.com/vn-11134513-7ras8-m3ygh2rt1juk1b@resize_ss640x400",
        "kem bơ sầu riêng mỹ tài - sinh tố giải khát, trái cây & cafe": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mmyf9c372ebs7f@resize_ss640x400",
        "tiệm trà nhà bo - trà sữa, trà trái cây & nước ép online": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc059o86u17d@resize_ss640x400",
        "trà sữa pozaa tea - ngô mây": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwbq04btojizba@resize_ss640x400",
        "trà sữa vie tea - 43 nguyễn lữ": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lt7vk86b82boc5@resize_ss640x400",
        "trà sữa nọng - vũ bảo": "https://down-vn.img.susercontent.com/vn-11134513-7r98o-lsvc6tx824rd05@resize_ss640x400",
        "thanh trà - trà sữa - 401b nguyễn huệ": "https://down-vn.img.susercontent.com/vn-11134513-81ztc-mr0k70fxw5c6f3@resize_ss640x400",
        "ốc um & kem flan": "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lweoz15pbm5722@resize_ss640x400"
    }
    
    updated = 0
    for f in foods:
        r_name = f["restaurant"].strip().lower()
        if r_name in real_images:
            real_url = real_images[r_name]
            f["image"] = real_url
            f["gallery"] = [real_url]
            updated += 1
            print(f"Fixed {f['restaurant']} -> {real_url}")
            
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
        
    print(f"Successfully fixed real ShopeeFood images for {updated} dessert shops in food-data.json and js/data.js!")

if __name__ == "__main__":
    main()
