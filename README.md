# FoodTinder (FoodFinder) 🍲

Ứng dụng web khám phá ẩm thực theo **Cảm xúc & Thời tiết** kết hợp kết nối bạn bè, quẹt món ăn kiểu Tinder, video reels cuộn dọc TikTok và bản đồ ẩm thực tương tác.

![FoodTinder UI](assets/preview.png)

---

## 🌟 Tính Năng Nổi Bật

1. **Khám Phá & Bento Dashboard:**
   - Đề xuất món ăn dựa trên cảm xúc (*Cần vỗ về, Hơi buồn rầu, Đang thèm thuồng, Mệt mỏi, Sôi động*).
   - Tự động thay đổi món phù hợp với thời tiết thực tế (*Mưa râm ran, Nắng gắt, Se lạnh...*).
   - Đổi vị trí linh hoạt: Quy Nhơn, TP.HCM, Hà Nội, Đà Nẵng.

2. **Quẹt Món Kiểu Tinder (Swipe):**
   - Vuốt phải để thích, vuốt trái để bỏ qua với vật lý góc xoay tự nhiên và tem đóng dấu trực quan.
   - Hiệu ứng chúc mừng Match Celebration khi tìm được món ăn trúng gu.

3. **Bản Đồ Ẩm Thực Tương Tác (Leaflet Map):**
   - Chấm radar định vị người dùng và các pin ghim quán ăn lân cận.
   - Thẻ nổi Bottom Sheet kéo thả, lọc theo nhóm món và tính năng vẽ lộ trình chỉ đường trực tiếp.

4. **Video Reels Cuộn Dọc Kiểu TikTok:**
   - Xem video các món ăn bốc khói xì xèo, tự động cuộn hít toàn màn hình.
   - Thả tim, bình luận và nút **"Chỉ đường 🗺️"** dẫn thẳng tới quán.

5. **Tin Nhắn & Bạn Bè (Split Screen 2 Cột):**
   - **Cột bên trái:** Danh sách bạn bè cá nhân, nhóm ăn uống đông vui, người cùng gu ở gần, hàng avatar online và nút **➕ Thêm bạn**.
   - **Cột bên phải:**
     - **FoodTinder AI:** Trợ lý ăn uống thông minh, tư vấn món ăn và gợi ý bạn bè ăn cùng.
     - **Chat trực tiếp với bạn bè:** Nhắn tin hai chiều, chia sẻ quán ăn nhanh và nút **"Rủ đi ăn 🍲"**.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Trên Mac

Ứng dụng chạy bằng công nghệ web tiêu chuẩn và server Python có sẵn trên macOS, **hoàn toàn không cần cài đặt Node.js hay npm phức tạp**.

### 1. Clone repository về máy:
```bash
git clone https://github.com/<your-username>/FoodTinder.git
cd FoodTinder
```

### 2. Khởi chạy ứng dụng:
Chạy lệnh có sẵn trên macOS:
```bash
python3 server.py
```
*Hoặc:*
```bash
python3 -m http.server 8080
```

### 3. Mở trên trình duyệt:
Truy cập:
👉 **http://localhost:8080**

---

## 📂 Cấu Trúc Dự Án

```
FoodTinder/
├── index.html           # Khung ứng dụng chính & toàn bộ giao diện
├── server.py            # Development server gọn nhẹ bằng Python 3
├── README.md            # Tài liệu dự án
├── css/
│   └── style.css        # Hiệu ứng chuyển động, nơ thẻ, glow, split view
└── js/
    ├── data.js          # Dữ liệu quán ăn, thời tiết, bạn bè, nhóm chat
    ├── app.js           # Điều hướng tab, quản lý cảm xúc, bento feed
    ├── swipe.js         # Động cơ vuốt thẻ Tinder bằng cảm ứng & chuột
    ├── map.js           # Tương tác bản đồ Leaflet & thẻ nổi
    ├── reels.js         # Cuộn dọc TikTok reels, thả tim, bình luận
    ├── chat.js          # Hệ thống tin nhắn 2 cột: AI & bạn bè
    └── audio.js         # Hiệu ứng âm thanh Web Audio API (pop, swipe, match)
```

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** HTML5, Modern CSS3, JavaScript ES6+
- **Styling:** Tailwind CSS CDN
- **Icons:** Lucide Icons
- **Bản đồ:** Leaflet.js & OpenStreetMap
- **Hiệu ứng:** Canvas Confetti, Web Audio API Sound Synthesizer
- **Backend/Server:** Python 3 HTTP Server
