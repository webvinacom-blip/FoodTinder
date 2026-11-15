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
        if self.path in ('/api/crawl-foods', '/api/crawl', '/api/sync-foods'):
            try:
                sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
                from scripts.crawl_quynhon_foods import generate_300_quynhon_foods, save_food_data_json
                foods = generate_300_quynhon_foods()
                save_food_data_json(foods)
                response = {
                    "status": "success",
                    "count": len(foods),
                    "source": "ShopeeFood & GrabFood Quy Nhơn",
                    "file": "food-data.json",
                    "updatedAt": datetime.now().strftime("%H:%M:%S %d/%m/%Y"),
                    "message": "Đã cào & cập nhật thành công 300 quán ăn Quy Nhơn vào file tĩnh food-data.json!"
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
