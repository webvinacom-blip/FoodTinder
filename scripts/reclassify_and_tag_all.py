#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FoodTinder - Database Harmonization & Deep Tagging
Rà soát, chuẩn hóa danh mục (category) và gắn tags đặc sản chuyên sâu cho toàn bộ 1.694 quán ăn tại Quy Nhơn.
"""

import json
import re
import os

def clean_brand_tag(s):
    # Loại bỏ các ký tự đặc biệt, giữ chữ tiếng Việt và tạo hashtag đẹp
    s = re.sub(r'[\s\-_\.,\(\)\&/]+', '', s)
    return '#' + s

def detect_category(rest_name, dish_name, current_cat=''):
    rest_clean = rest_name.lower().strip()
    dish_clean = dish_name.lower().strip()
    combined = f'{rest_clean} {dish_clean}'
    
    # 1. Chay / Vegetarian
    if any(k in combined for k in ['quán chay', 'cơm chay', 'ẩm thực chay', 'bún chay', 'lẩu chay', 'thuần chay', 'an lạc', 'thiện duyên', 'tâm thiện', 'minh an', 'pháp duyên', 'bồ đề']):
        if not any(k in combined for k in ['bò né', 'thịt', 'gà rán', 'hải sản', 'làng nướng', 'nướng']):
            return 'vegetarian'
            
    # 2. Lẩu / Hotpot
    if any(k in rest_clean for k in ['lẩu', 'hotpot', 'kichi', 'manwah', 'haidilao', 'sukishi']):
        return 'hotpot'
    if any(k in combined for k in ['lẩu bò', 'lẩu dê', 'lẩu thái', 'lẩu nấm', 'lẩu gà', 'lẩu cá', 'lẩu băng chuyền', 'lẩu 1 người']) and not any(k in rest_clean for k in ['bánh canh', 'phở', 'bún']):
        return 'hotpot'
        
    # 3. Nướng / BBQ / Bò né
    if any(k in rest_clean for k in ['nướng', 'bbq', 'gogi', 'king bbq', 'bò né', 'bít tết', 'beefsteak', 'nem nướng']) and not any(k in rest_clean for k in ['bánh tráng nướng', 'bún thịt nướng']):
        return 'bbq'
    if any(k in dish_clean for k in ['bò né', 'bít tết', 'nướng ngói', 'nướng than', 'nem nướng']):
        if not any(k in combined for k in ['bánh tráng nướng', 'bún thịt nướng']):
            return 'bbq'
            
    # 4. Hải sản & Ốc (Seafood)
    if any(k in rest_clean for k in ['hải sản', 'đặc sản biển', 'quán ốc', 'ốc ', 'nghĩa ghẹ', 'vua ghẹ', 'vựa hải sản', 'hải sản tươi', 'hải sản biển', 'cua huỳnh đế', 'tôm hùm', 'cháo hàu', 'hàu sữa']):
        if not any(k in rest_clean for k in ['bún chả cá', 'bún sứa', 'bánh canh tôm', 'bún rạm']):
            return 'seafood'
    if any(k in rest_clean for k in ['ghẹ', 'cua biển', 'mực lá', 'tôm hùm', 'hàu nướng', 'sò huyết', 'nghêu', 'cá mú', 'bào ngư']):
        if not any(k in rest_clean for k in ['bún', 'bánh canh', 'bánh xèo', 'trà', 'cafe']):
            return 'seafood'
    if any(k in dish_clean for k in ['ghẹ hấp', 'ghẹ sốt', 'cua rang me', 'tôm hùm', 'mực lá nướng', 'hàu nướng', 'sò huyết cấy', 'ốc hương rang muối']):
        if not any(k in rest_clean for k in ['bún', 'phở', 'bánh canh', 'bánh xèo']):
            return 'seafood'
            
    # 5. Cơm / Xôi (Rice)
    if any(k in rest_clean for k in ['cơm ', 'cơm gà', 'cơm tấm', 'cơm niêu', 'cơm thố', 'cơm sườn', 'cơm văn phòng', 'cơm bình dân', 'cơm quê', 'cơm nhà', 'cơm mậu', 'xôi ', 'xôi gà', 'quán cơm']):
        return 'rice'
    if any(k in dish_clean for k in ['cơm gà', 'cơm tấm', 'cơm niêu', 'cơm sườn', 'cơm thố', 'xôi gà']):
        return 'rice'

    # 6. Bún / Phở / Mì / Mỳ / Hủ tiếu / Bánh canh / Miến (Noodles)
    if any(k in rest_clean for k in ['bún ', 'phở ', 'mì ', 'mỳ ', 'hủ tiếu', 'hủ tíu', 'bánh canh', 'miến ', 'quán bún', 'tiệm phở', 'quán phở', 'mì quảng', 'mì cay', 'mỳ cay']):
        return 'noodles'
    if any(k in dish_clean for k in ['bún chả cá', 'bún sứa', 'bún rạm', 'bún tôm', 'bún bò', 'bún riêu', 'bún đậu', 'phở bò', 'phở gà', 'bánh canh', 'hủ tiếu', 'mì quảng', 'mì cay']):
        return 'noodles'

    # 7. Trà sữa & Chè & Kem & Đồ ngọt (Boba)
    if any(k in rest_clean for k in ['trà sữa', 'milk tea', 'boba', 'chè ', 'quán chè', 'tiệm chè', 'kem bơ', 'kem ', 'tàu hũ', 'bingsu', 'sữa chua', 'sữa hạt', 'nước mát', 'mộc trà']):
        return 'boba'
    if any(k in dish_clean for k in ['trà sữa', 'kem bơ', 'tàu hũ', 'bingsu', 'chè thái', 'chè bưởi']):
        return 'boba'

    # 8. Cà phê & Tiệm bánh (Cafe)
    if any(k in rest_clean for k in ['cà phê', 'cafe', 'café', 'coffee', 'kafe', 'tiệm bánh', 'bakery', 'tiệm trà', 'pastry', 'surf bar', 's-blue', 'tea & coffee', 'espresso']):
        return 'cafe'
    if any(k in dish_clean for k in ['cà phê', 'cafe', 'croissant', 'bánh su kem', 'bánh kem']):
        return 'cafe'

    # 9. Đồ ăn vặt / Bánh đặc sản Quy Nhơn / Streetfood
    if any(k in combined for k in ['bánh xèo', 'bánh hỏi', 'cháo lòng', 'bánh bèo', 'bánh nậm', 'bánh lọc', 'bánh căn', 'bánh khọt', 'bánh mì', 'bánh mỳ', 'chả ram', 'nem chả', 'tré', 'chân gà', 'phá lấu', 'bánh tráng', 'ăn vặt', 'xiên que']):
        return 'streetfood'
        
    return current_cat or 'streetfood'

def generate_tags_for_food(food, cat):
    rest = (food.get('restaurant') or '').strip()
    name = (food.get('name') or '').strip()
    addr = (food.get('address') or '').strip().lower()
    combined = f'{rest} {name} {addr}'.lower()
    
    tags = []
    
    # 1. Nhãn định vị danh mục chuẩn
    cat_tag_map = {
        'seafood': ['#HảiSảnQuyNhơn', '#ĐặcSảnBiển'],
        'noodles': ['#BúnPhởQuyNhơn', '#MónNướcNóngHổi'],
        'rice': ['#CơmQuyNhơn', '#CơmNgon'],
        'hotpot': ['#LẩuNóngHổi', '#LẩuQuyNhơn'],
        'bbq': ['#NướngBBQ', '#XìXèo'],
        'vegetarian': ['#ĐồChay', '#ThanhTịnh'],
        'cafe': ['#CàPhêQuyNhơn', '#ChillThưGiãn'],
        'boba': ['#TràSữaQuyNhơn', '#ĐồNgọt'],
        'healthy': ['#EatClean', '#Healthy'],
        'streetfood': ['#ĂnVặtQuyNhơn', '#ĐặcSảnĐườngPhố']
    }
    tags.extend(cat_tag_map.get(cat, ['#MónNgonQuyNhơn']))
    
    # 2. Nhãn món ăn / nguyên liệu cụ thể
    if any(k in combined for k in ['ghẹ', 'nghĩa ghẹ']): tags.append('#GhẹQuyNhơn')
    elif any(k in combined for k in ['ốc ', 'quán ốc', 'ốc biển', 'ốc hương']): tags.append('#ỐcBiển')
    elif any(k in combined for k in ['tôm hùm', 'tôm tít', 'tôm tích']): tags.append('#TômHùm')
    elif any(k in combined for k in ['mực lá', 'mực nhảy', 'mực hấp', 'mực nướng']): tags.append('#MựcTươi')
    elif any(k in combined for k in ['cua huỳnh đế']): tags.append('#CuaHuỳnhĐế')
    elif any(k in combined for k in ['hàu nướng', 'cháo hàu']): tags.append('#HàuNướng')
    elif any(k in combined for k in ['bún chả cá', 'bún cá']): tags.append('#BúnChảCá')
    elif any(k in combined for k in ['bún sứa']): tags.append('#BúnSứaQuyNhơn')
    elif any(k in combined for k in ['bún rạm', 'bún tôm']): tags.append('#BúnRạm')
    elif any(k in combined for k in ['bún bò']): tags.append('#BúnBò')
    elif any(k in combined for k in ['bún đậu']): tags.append('#BúnĐậuMắmTôm')
    elif any(k in combined for k in ['bánh canh']): tags.append('#BánhCanh')
    elif any(k in combined for k in ['phở ']): tags.append('#PhởNgon')
    elif any(k in combined for k in ['mì quảng', 'mỳ quảng']): tags.append('#MìQuảng')
    elif any(k in combined for k in ['mì cay', 'mỳ cay']): tags.append('#MìCay')
    elif any(k in combined for k in ['cơm gà']): tags.append('#CơmGàQuyNhơn')
    elif any(k in combined for k in ['cơm niêu']): tags.append('#CơmNiêu')
    elif any(k in combined for k in ['cơm tấm']): tags.append('#CơmTấm')
    elif any(k in combined for k in ['bánh xèo']): tags.append('#BánhXèoTômNhảy')
    elif any(k in combined for k in ['bánh hỏi', 'cháo lòng']): tags.append('#BánhHỏiCháoLòng')
    elif any(k in combined for k in ['bánh bèo', 'bánh nậm', 'bánh lọc']): tags.append('#BánhBèoQuyNhơn')
    elif any(k in combined for k in ['bánh mì', 'bánh mỳ']): tags.append('#BánhMì')
    elif any(k in combined for k in ['nem nướng', 'chả ram', 'nem chả']): tags.append('#NemChảChợHuyện')
    elif any(k in combined for k in ['bò né', 'bít tết']): tags.append('#BòNé')
    elif any(k in combined for k in ['chân gà', 'phá lấu']): tags.append('#ĂnVặtĐêm')
    elif any(k in combined for k in ['chè ']): tags.append('#ChèQuyNhơn')
    elif any(k in combined for k in ['kem ']): tags.append('#KemBơ')
    elif any(k in combined for k in ['trà sữa']): tags.append('#TràSữa')
    
    # 3. Nhãn vị trí đắc địa tại Quy Nhơn
    if any(k in addr for k in ['xuân diệu', 'an dương vương', 'bờ biển', 'biển']): tags.append('#ViewBiển')
    elif 'ngô mây' in addr: tags.append('#KhuNgôMây')
    elif any(k in addr for k in ['ghềnh ráng', 'ql1d', 'bông hồng']): tags.append('#KhuGàChỉ')
    elif any(k in addr for k in ['nhơn lý', 'eo gió', 'kỳ co']): tags.append('#EoGió_NhơnLý')
    
    # 4. Nhãn tên thương hiệu quán (Brand Tag)
    clean_r = re.sub(r'[\-\–\(\),].*$', '', rest).strip()
    if 2 < len(clean_r) < 25:
        brand_tag = clean_brand_tag(clean_r)
        if len(brand_tag) > 3 and brand_tag not in tags:
            tags.append(brand_tag)
            
    # 5. Luôn bảo chứng nguồn gốc Quy Nhơn
    if '#ĐặcSảnQuyNhơn' not in tags and '#QuyNhơn' not in tags:
        tags.append('#ĐặcSảnQuyNhơn')
        
    return list(dict.fromkeys(tags))[:6]

def update_mood_ids(food, cat):
    moods = set(food.get('moodIds') or [])
    
    # Đồng bộ tâm trạng tương ứng với danh mục chính xác
    if cat == 'seafood':
        moods.add('seafood')
        moods.add('hangout')
    elif cat == 'vegetarian':
        moods.add('zen')
        moods.discard('seafood')
    elif cat == 'boba':
        moods.add('sweet')
        moods.add('chill')
        moods.discard('seafood')
    elif cat == 'cafe':
        moods.add('chill')
        moods.discard('seafood')
    elif cat == 'hotpot':
        moods.add('comfort')
        moods.add('celebrate')
    elif cat == 'bbq':
        moods.add('hangout')
        moods.add('craving')
    elif cat == 'rice':
        moods.add('comfort')
    elif cat == 'noodles':
        moods.add('comfort')
    elif cat == 'streetfood':
        moods.add('craving')
        
    return list(moods)

def main():
    data_file = 'food-data.json'
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    foods = data.get('foods', data)
    print(f'Bắt đầu rà soát toàn bộ {len(foods)} quán ăn...')
    
    changed_cats = 0
    for f in foods:
        rest = f.get('restaurant', '')
        name = f.get('name', '')
        old_cat = f.get('category', 'streetfood')
        
        new_cat = detect_category(rest, name, old_cat)
        if new_cat != old_cat:
            changed_cats += 1
            f['category'] = new_cat
            
        # Cập nhật nhãn tags chuyên sâu
        f['tags'] = generate_tags_for_food(f, f['category'])
        
        # Cập nhật moodIds tương ứng
        f['moodIds'] = update_mood_ids(f, f['category'])
        
    print(f'✅ Đã chuẩn hóa danh mục cho {changed_cats} quán bị gán sai lệch!')
    print(f'✅ Đã gắn thẻ tags đặc sản & thương hiệu cho toàn bộ {len(foods)} quán ăn!')
    
    # Lưu lại food-data.json
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print('✅ Đã lưu dữ liệu chuẩn vào food-data.json!')

if __name__ == '__main__':
    main()
