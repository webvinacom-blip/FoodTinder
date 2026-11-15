#!/usr/bin/env python3
"""
Lightweight development server for FoodTinder web application.
Includes API endpoint for scraping & updating 300 Quy Nhon restaurants from ShopeeFood & GrabFood.
"""
import http.server
import socketserver
import os
import sys
import json
from datetime import datetime

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_POST(self):
        if self.path.startswith('/api/purge-closed-restaurant'):
            try:
                content_len = int(self.headers.get('Content-Length', 0))
                req_body = self.rfile.read(content_len).decode('utf-8') if content_len > 0 else '{}'
                params = json.loads(req_body) if req_body else {}
                target_name = (params.get('restaurantName') or params.get('name') or '').strip().lower()
                target_id = params.get('foodId') or params.get('id')

                data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'food-data.json')
                purged_count = 0
                remaining = 0
                if os.path.exists(data_path):
                    with open(data_path, 'r', encoding='utf-8') as f:
                        f_data = json.load(f)
                    foods = f_data.get('foods', [])
                    before_len = len(foods)
                    foods = [
                        f for f in foods 
                        if not (
                            (target_name and (target_name in f.get('restaurant', '').lower() or target_name in f.get('name', '').lower())) or
                            (target_id is not None and f.get('id') == target_id)
                        )
                    ]
                    purged_count = before_len - len(foods)
                    remaining = len(foods)
                    f_data['foods'] = foods
                    f_data.setdefault('metadata', {})['totalCount'] = remaining
                    f_data['metadata']['totalRestaurants'] = remaining
                    with open(data_path, 'w', encoding='utf-8') as f:
                        json.dump(f_data, f, ensure_ascii=False, indent=2)

                res = {"status": "success", "purged": purged_count, "remaining": remaining}
                body = json.dumps(res, ensure_ascii=False).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            except Exception as e:
                err_resp = json.dumps({"status": "error", "message": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(err_resp)))
                self.end_headers()
                self.wfile.write(err_resp)
                return

        if self.path in ('/api/crawl-foods', '/api/crawl', '/api/sync-foods'):
            try:
                sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
                from scripts.crawl_quynhon_foods import generate_300_quynhon_foods, save_food_data_json
                foods = generate_300_quynhon_foods()
                save_food_data_json(foods)
                response = {
                    "status": "success",
                    "count": len(foods),
                    "source": "ShopeeFood Quy Nhơn",
                    "file": "food-data.json",
                    "updatedAt": datetime.now().strftime("%H:%M:%S %d/%m/%Y"),
                    "message": "Đã cào & cập nhật thành công 300 quán ăn Quy Nhơn từ ShopeeFood vào file tĩnh food-data.json!"
                }
                body = json.dumps(response, ensure_ascii=False).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            except Exception as e:
                err_resp = json.dumps({"status": "error", "message": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(err_resp)))
                self.end_headers()
                self.wfile.write(err_resp)
                return

        self.send_response(404)
        self.end_headers()

def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    port = PORT
    for attempt in range(5):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"🚀 FoodTinder Web App is running at http://localhost:{port}")
                print(f"👉 Press Ctrl+C to stop the server")
                httpd.serve_forever()
                break
        except OSError as e:
            if "Address already in use" in str(e):
                port += 1
            else:
                raise e

if __name__ == '__main__':
    run()
