#!/usr/bin/env python3
import json

with open("food-data.json") as f:
    foods = json.load(f)["foods"]

def get_food_min_price(food):
    if food.get("priceMin") is not None:
        return food["priceMin"]
    import re
    pr = food.get("priceRange") or ""
    nums = [int(n) for n in re.findall(r"\d+", pr.replace(".", ""))]
    return nums[0] if nums else 50000

def calc_mood_relevance(food, mood_id):
    min_price = get_food_min_price(food)
    name_cat = (f"{food.get('name', '')} {food.get('category', '')} {food.get('restaurant', '')} {food.get('desc', '')} {' '.join(food.get('tags', []))}").lower()
    score = 0
    
    if mood_id == "budget":
        if min_price > 50000:
            return -999
        if "budget" in food.get("moodIds", []):
            score += 160
        if min_price <= 25000:
            score += 100
        elif min_price <= 35000:
            score += 70
        elif min_price <= 50000:
            score += 40
        if any(k in name_cat for k in ["bánh mì", "bánh bèo", "bánh tráng", "sinh viên", "bình dân", "xôi", "ăn vặt"]):
            score += 50
    return score

# Filter for budget
budget_foods = [f for f in foods if get_food_min_price(f) <= 50000]
print(f"Total foods with minPrice <= 50k: {len(budget_foods)} / {len(foods)}")

scored = []
for f in budget_foods:
    rel = calc_mood_relevance(f, "budget")
    dist = f.get("distance", 10)
    proximity = max(0, (10 - dist) * 2)
    rating = f.get("rating", 4.5) * 2
    scored.append((f, rel + proximity + rating))

scored.sort(key=lambda x: -x[1])
print("\nTop 10 món khi chọn tâm trạng 'Viêm túi' (budget):")
any_over_50k = False
for i, (f, s) in enumerate(scored[:10]):
    min_p = get_food_min_price(f)
    if min_p > 50000:
        any_over_50k = True
    print(f" {i+1}. {f['name']} ({f['restaurant']}) | Giá: {f['priceRange']} | Min: {min_p}đ | Score: {s:.1f}")

print("\nAre there any foods with minPrice > 50k in budget results?", any_over_50k)
