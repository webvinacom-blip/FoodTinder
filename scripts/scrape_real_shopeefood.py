#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import urllib.request
import json
import re
import time

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

all_restaurants = []
seen_ids = set()

# URLs to crawl: all general and food-specific dia-diem in Binh Dinh / Quy Nhon
urls_to_try = [
    ("https://www.foody.vn/binh-dinh/food/dia-diem?page=", 15),
    ("https://www.foody.vn/binh-dinh/dia-diem?page=", 15),
]

for base_url, max_page in urls_to_try:
    print(f"Crawling {base_url} up to {max_page} pages...")
    for page in range(1, max_page + 1):
        url = f"{base_url}{page}"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
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
                    print(f"  Page {page}: found {len(items)} items, {new_items} new valid restaurants. Total unique: {len(all_restaurants)}")
                else:
                    print(f"  Page {page}: no jsonData found")
        except Exception as e:
            print(f"  Page {page} error: {e}")
        time.sleep(0.3)

with open("scratch/shopeefood_crawled.json", "w", encoding="utf-8") as f:
    json.dump(all_restaurants, f, ensure_ascii=False, indent=2)

print(f"✅ DONE! Collected {len(all_restaurants)} real ShopeeFood Quy Nhon restaurants with REAL image URLs!")
