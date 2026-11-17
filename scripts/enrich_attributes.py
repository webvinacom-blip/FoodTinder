import json
import re

# Load food-data.json
with open('food-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

foods = data['foods']

def get_attributes(f):
    name = (f.get('name') or '').lower()
    rest = (f.get('restaurant') or '').lower()
    cat = (f.get('category') or '').lower()
    desc = (f.get('desc') or f.get('description') or '').lower()
    tags = ' '.join(f.get('tags') or []).lower()
    all_text = f'{name} {rest} {cat} {desc} {tags}'

    attrs = set()

    # 1. sweet (đồ ngọt)
    is_sweet = False
    if cat in ['boba', 'cafe'] and any(k in all_text for k in ['trà sữa', 'chè', 'kem', 'bánh ngọt', 'flan', 'bingsu', 'sinh tố', 'boba', 'đường đen', 'caramel', 'pudding', 'tàu hũ', 'gelato', 'waffle', 'crepe', 'tiramisu', 'trà đào', 'trà dâu', 'sữa chua']):
        is_sweet = True
    elif any(k in all_text for k in ['chè', 'kem ý', 'kem bơ', 'gelato', 'bánh ngọt', 'tiệm bánh', 'bakery', 'flan', 'bingsu', 'tàu hũ', 'bánh su', 'tiramisu']):
        is_sweet = True
    
    # Avoid labeling savory meals sweet
    if any(k in name for k in ['cơm', 'bún bò', 'bún cá', 'bún sứa', 'phở', 'bánh canh', 'hủ tiếu', 'lẩu', 'hải sản', 'ốc', 'mực', 'gà chỉ', 'bò né']):
        is_sweet = False
    if is_sweet:
        attrs.add('sweet')

    # 2. drinks (đồ uống)
    if cat in ['boba', 'cafe'] or any(k in all_text for k in ['cà phê', 'cafe', 'coffee', 'trà sữa', 'tiệm trà', 'trà hoa', 'trà đào', 'trà trái cây', 'sinh tố', 'nước ép', 'nước dừa', 'boba']):
        attrs.add('drinks')

    # 3. hot_soup (đồ nước / nóng hổi)
    if cat in ['noodles', 'hotpot'] or any(k in all_text for k in ['bún', 'phở', 'bánh canh', 'hủ tiếu', 'mì quảng', 'mì cay', 'lẩu', 'cháo', 'súp', 'nước dùng']):
        attrs.add('hot_soup')

    # 4. spicy (đồ cay)
    if any(k in all_text for k in ['cay', 'sa tế', 'ớt xiêm', 'tomyum', 'sốt thái', 'mì cay', 'xé lưỡi', 'muối ớt', 'măng cay']):
        attrs.add('spicy')

    # 5. crunchy (đồ giòn rụm)
    if any(k in all_text for k in ['giòn', 'bánh xèo', 'chả ram', 'chiên', 'rán', 'bánh mì', 'bánh tráng nướng', 'chân gà', 'nem lụi', 'nem chua rán', 'da gà']):
        attrs.add('crunchy')

    # 6. heavy (no nê, nhiều đạm/carb)
    if not is_sweet:
        if cat in ['rice', 'bbq', 'hotpot'] or any(k in all_text for k in ['cơm gà', 'cơm tấm', 'cơm niêu', 'bò né', 'steak', 'lẩu', 'nướng bbq', 'gà chỉ', 'bò tơ', 'thịt nướng', 'buffet', 'đầy đặn', 'no nê', 'bò bít tết']):
            attrs.add('heavy')

    # 7. light (thanh đạm, nhẹ nhàng)
    if cat in ['vegetarian', 'healthy'] or any(k in all_text for k in ['chay', 'thanh đạm', 'thanh mát', 'salad', 'bánh bèo', 'sứa nước', 'gỏi cuốn', 'rau nấm', 'eat clean']):
        attrs.add('light')

    # 8. salty (mặn mà, mồi nhậu, hải sản)
    if not is_sweet:
        if cat in ['seafood'] or any(k in all_text for k in ['hải sản', 'ốc', 'tôm', 'cua', 'ghẹ', 'mực', 'nem nướng', 'mắm', 'rang muối', 'quán nhậu', 'lai rai', 'khô mực', 'mồi bén']):
            attrs.add('salty')

    # 9. sour (chua thanh kích thích)
    if any(k in all_text for k in ['sốt me', 'chua ngọt', 'sốt thái', 'tomyum', 'xoài lắc', 'chanh leo', 'sứa', 'gỏi', 'me rang', 'tai mui chua']):
        attrs.add('sour')

    # Fallback
    if not attrs:
        if cat in ['streetfood']:
            attrs.update(['crunchy', 'salty'])
        else:
            attrs.add('light')

    return sorted(list(attrs))

food_attr_map = {}
for f in foods:
    attrs = get_attributes(f)
    f['attributes'] = attrs
    food_attr_map[f['id']] = attrs

with open('food-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated food-data.json with attributes for {len(foods)} foods.")
