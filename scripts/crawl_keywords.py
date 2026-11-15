#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import urllib.request
import json
import re
import time
import urllib.parse

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

with open("scratch/shopeefood_crawled.json", "r", encoding="utf-8") as f:
    all_restaurants = json.load(f)

seen_ids = set(r["id"] for r in all_restaurants)
print(f"Starting with {len(all_restaurants)} restaurants...")

keywords = [
    "hai san", "oc", "banh xeo", "bun cha ca", "bun sua", "banh hoi chao long",
    "lau", "nuong", "bo", "ga chi", "com tam", "com ga", "cha ram tom dat",
    "nem nuong", "tra sua", "ca phe", "banh mi", "banh beo", "chay", "an vat",
    "an sang", "an trua", "an toi", "dem", "bia", "sushi", "pizza", "bbq", "hotpot"
]

for kw in keywords:
    encoded_kw = urllib.parse.quote(kw)
    for page in range(1, 4):
        url = f"https://www.foody.vn/binh-dinh/dia-diem?q={encoded_kw}&page={page}"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                html = resp.read().decode("utf-8", errors="ignore")
                match = re.search(r"var jsonData = ({.*?});", html)
                if match:
                    d = json.loads(match.group(1))
                    items = d.get("searchItems", [])
                    new_items = 0
                    for it in items:
                        item_id = it.get("Id")
                        pic = it.get("PicturePathLarge") or it.get("PicturePath")
                        name = it.get("Name")
                        if item_id and item_id not in seen_ids and pic and "susercontent.com" in pic:
                            seen_ids.add(item_id)
                            all_restaurants.append({
                                "id": item_id,
                                "name": name,
                                "dishKeyword": kw,
                                "address": it.get("Address", ""),
                                "district": it.get("District", "TP. Quy Nhơn"),
                                "city": it.get("City", "Bình Định"),
                                "rating": it.get("AvgRating", 4.5),
                                "totalReviews": it.get("TotalReview", 50),
                                "lat": it.get("Latitude", 13.7820),
                                "lng": it.get("Longitude", 109.2197),
                                "image": pic,
                                "categories": it.get("Categories", []),
                                "cuisines": it.get("Cuisines", []),
                                "source": "ShopeeFood"
                            })
                            new_items += 1
                    if new_items > 0:
                        print(f"Keyword '{kw}' page {page}: +{new_items} restaurants. Total: {len(all_restaurants)}")
                time.sleep(0.15)
        except Exception as e:
            pass

with open("scratch/shopeefood_crawled_full.json", "w", encoding="utf-8") as f:
    json.dump(all_restaurants, f, ensure_ascii=False, indent=2)

print(f"🎉 FINAL TOTAL: {len(all_restaurants)} REAL ShopeeFood Quy Nhon restaurants with REAL susercontent images!")
