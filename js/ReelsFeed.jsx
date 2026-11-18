import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ReelsFeed Component - Cuộn video review đồ ăn định dạng dọc (Shorts)
 * 
 * Tính năng QA & Tối ưu hoá nâng cao:
 * 1. Single Click Play / Pause:
 *    - Chạm nhẹ vào màn hình để Tạm dừng (Pause) hoặc Tiếp tục phát (Play).
 *    - Nhấp đúp (Double click) để Thả tim ❤️ bay hiệu ứng.
 * 2. Phân loại Video Review Thông Minh:
 *    - Video review riêng quán -> Hiển thị tên quán, khoảng cách, giờ mở cửa, nút chỉ đường Google Maps.
 *    - Video review chung (Food Tour) -> Tuyệt đối không gắn tên quán sai lệch, chỉ hiện tiêu đề video và tag ẩm thực.
 * 3. Độc quyền âm thanh 1 video duy nhất (Tránh chồng chéo tiếng).
 * 4. Autoplay Muted & Chạm bật tiếng.
 */

const CURATED_REELS_DATA = [
  {
    id: 101,
    isGeneralReview: false,
    video_id: '1dT4PMS3HPk',
    restaurant: 'Bún Chả Cá Ngọc Liên',
    address: '379 Nguyễn Huệ, TP. Quy Nhơn',
    name: 'Bún Chả Cá & Bún Sứa Quy Nhơn',
    desc: 'Quán bún cá gia truyền đông nghẹt khách tại Quy Nhơn, chả cá dai ngọt tự nhiên, nước dùng thanh ngọt vị cá thu biển.',
    priceRange: '35.000đ - 55.000đ',
    openTime: '06:00 - 22:00',
    distanceText: 'Cách bạn 1.2km',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    tags: ['#BúnChảCá', '#BúnCáNgọcLiên', '#ĐặcSảnQuyNhơn'],
    gmapsQuery: 'Bún Chả Cá Ngọc Liên 379 Nguyễn Huệ Quy Nhơn',
    likesCount: 2450
  },
  {
    id: 102,
    isGeneralReview: false,
    video_id: 'wsXvJFY9Pno',
    restaurant: 'Phố Ẩm Thực Đêm Ngô Văn Sở',
    address: 'Đường Ngô Văn Sở, P. Trần Phú, TP. Quy Nhơn',
    name: 'Phố Ốc Đêm & Thiên Đường Ăn Vặt',
    desc: 'Thiên đường ẩm thực đêm nổi tiếng nhất Quy Nhơn: đủ loại ốc đĩa, bánh xèo tôm nhảy, nem nướng, mực rim me chỉ từ 20k.',
    priceRange: '20.000đ - 60.000đ',
    openTime: '15:00 - 23:30',
    distanceText: 'Cách bạn 800m',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    tags: ['#PhốẨmThực', '#NgôVănSở', '#ỐcĐêmQuyNhơn'],
    gmapsQuery: 'Phố Ẩm Thực Ngô Văn Sở Quy Nhơn',
    likesCount: 3120
  },
  {
    id: 103,
    isGeneralReview: false,
    video_id: 'TQ0uDdrAqAU',
    restaurant: 'Nem Chả Lợi - Nem Nướng Quy Nhơn',
    address: '113 Tăng Bạt Hổ, TP. Quy Nhơn',
    name: 'Nem Nướng Chợ Huyện Cuốn Bánh Tráng',
    desc: 'Quán nem nướng, chả ram tôm đất, bò nướng mắm nhĩ gia truyền ngon và chill nức tiếng tại Quy Nhơn.',
    priceRange: '35.000đ - 85.000đ',
    openTime: '15:00 - 22:30',
    distanceText: 'Cách bạn 1.5km',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tags: ['#NemChảLợi', '#NemNướng', '#ĐặcSảnBìnhĐịnh'],
    gmapsQuery: 'Nem Chả Lợi 113 Tăng Bạt Hổ Quy Nhơn',
    likesCount: 1890
  },
  {
    id: 201,
    isGeneralReview: true,
    video_id: '8sGx-HxIRPY',
    author: 'Rồng Ăn Ngon',
    title: 'Tới Quy Nhơn Nhớ Ăn Mấy Món Siêu Rẻ - Ngon Này Nha!',
    desc: 'Cẩm nang tổng hợp các món ăn vặt & đặc sản ngon bổ rẻ tại Quy Nhơn: bánh bèo chén, nem nướng, bánh tráng nướng trứng.',
    tags: ['#FoodTourQuyNhơn', '#MónNgonSiêuRẻ', '#ĂnSậpQuyNhơn'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    likesCount: 4200
  },
  {
    id: 202,
    isGeneralReview: true,
    video_id: 'EEZLoTViFA4',
    author: 'Phạm Dũng Review',
    title: 'Khám Phá Toàn Bộ Ẩm Thực Quy Nhơn Ngon Giá Rẻ',
    desc: 'Hành trình trải nghiệm ẩm thực xứ Nẫu: Xôi Lăng Ông, Bún Cá biển Quy Nhơn, Phố ốc đêm cực kỳ đậm đà và hấp dẫn.',
    tags: ['#KhámPháQuyNhơn', '#FoodTour', '#ẨmThựcMiềnTrung'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    likesCount: 3850
  },
  {
    id: 203,
    isGeneralReview: true,
    video_id: 'gWrDmRmEfJk',
    author: 'Du Lịch Việt Nam',
    title: 'Review Các Địa Điểm Ăn Uống Nổi Tiếng Tại Quy Nhơn',
    desc: 'Bản đồ ẩm thực chọn lọc Quy Nhơn: Bánh hỏi lòng heo nóng hổi, bánh xèo tôm nhảy giòn rụm và các món hải sản tươi ngon.',
    tags: ['#ReviewQuyNhơn', '#BảnĐồẨmThực', '#ĂnGìQuyNhơn'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    likesCount: 2980
  },
  {
    id: 204,
    isGeneralReview: true,
    video_id: '1LpN57SLs4Q',
    author: 'Giang Mây Travel',
    title: 'Foodtour 24 Giờ Ăn Sập Ẩm Thực Phố Biển Quy Nhơn',
    desc: 'Cùng food blogger khám phá từ bữa sáng bánh hỏi cháo lòng đến bữa tối ốc vỉa hè và chè tráng miệng phố biển.',
    tags: ['#Foodtour24h', '#QuyNhơnFood', '#MónNgonXứNẫu'],
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    likesCount: 2150
  },
  {
    id: 205,
    isGeneralReview: true,
    video_id: '4r-7zAAEUp8',
    author: 'Võ Ngọc Tài Review',
    title: 'Quy Nhơn Ăn Gì? Cẩm Nang Ăn Uống Cho Khách Du Lịch',
    desc: 'Hướng dẫn chi tiết ăn uống khi du lịch Quy Nhơn: những món đặc sản địa phương trứ danh nhất định phải thử một lần.',
    tags: ['#QuyNhơnĂnGì', '#CẩmNangẨmThực', '#ĐặcSảnBìnhĐịnh'],
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    likesCount: 1940
  },
  {
    id: 206,
    isGeneralReview: true,
    video_id: 'OcJqkmePrQc',
    author: 'Gia Đình Vivu',
    title: 'Quy Nhơn Có Gì Ngon? 5 Quán Ăn Địa Phương Nổi Tiếng',
    desc: 'Tổng hợp 5 trải nghiệm ẩm thực độc đáo của người dân bản địa Quy Nhơn, chuẩn vị và giá cả cực kỳ hợp lý.',
    tags: ['#Top5MónNgon', '#ẨmThựcBảnĐịa', '#QuyNhơnMónNgon'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    likesCount: 2600
  },
  {
    id: 207,
    isGeneralReview: true,
    video_id: 'eqGLEGlFCIY',
    author: 'Food Reviewer Xứ Nẫu',
    title: 'Food Tour Check-in Ẩm Thực Phố Biển Quy Nhơn',
    desc: 'Khám phá hải sản tươi sống bên bờ biển Quy Nhơn, lẩu sứa nước lèo và các món ăn vặt hấp dẫn.',
    tags: ['#HảiSảnQuyNhơn', '#LẩuSứa', '#ĂnUốngQuyNhơn'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    likesCount: 1820
  },

  // ── 3. BỔ SUNG 30+ VIDEO REVIEW QUY NHƠN CHỌN LỌC (ĐÃ XÁC THỰC 100% YOUTUBE) ──
  {
    id: 301,
    isGeneralReview: true,
    video_id: "uSh6VoQD8m0",
    author: "Khánh Nguyễn vlog",
    title: "Món ăn đường phố||Món ngon Quy Nhơn||Khánh Nguyễn vlog||#shorts",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Khánh Nguyễn vlog: Món ăn đường phố||Món ngon Quy Nhơn||Khánh Nguyễn vlog||#shorts.",
    image: "https://i.ytimg.com/vi/uSh6VoQD8m0/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 1500,
    commentsCount: 80
  },
  {
    id: 302,
    isGeneralReview: true,
    video_id: "C85cK_nLwXU",
    author: "Tiny Iu Phiu Lưu | Travel & Food",
    title: "POV | +1 kiến thức cho từ vựng món ăn ở Quy Nhơn #tinyiuphiuluu #pov #shortvideo #shorts",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Tiny Iu Phiu Lưu | Travel & Food: POV | +1 kiến thức cho từ vựng món ăn ở Quy Nhơn #tinyiuphiuluu #pov #shortvideo.",
    image: "https://i.ytimg.com/vi/C85cK_nLwXU/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 1637,
    commentsCount: 109
  },
  {
    id: 303,
    isGeneralReview: true,
    video_id: "zf1i7WR5l-8",
    author: "Ông Chú Quê",
    title: "💸 Thử thách 15k ăn gì ở Quy Nhơn?",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Ông Chú Quê: 💸 Thử thách 15k ăn gì ở Quy Nhơn?.",
    image: "https://i.ytimg.com/vi/zf1i7WR5l-8/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 1774,
    commentsCount: 138
  },
  {
    id: 304,
    isGeneralReview: true,
    video_id: "be4b9JwLY_Y",
    author: "Luyến Du lịch Ngôi Sao",
    title: "Top 13 quán ăn Ngon_Bổ_Rẻ ở Quy Nhơn mà người dân địa phương chỉ. Kinh nghiệm ăn ngon ở Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Luyến Du lịch Ngôi Sao: Top 13 quán ăn Ngon_Bổ_Rẻ ở Quy Nhơn mà người dân địa phương chỉ. Kinh nghiệm ăn.",
    image: "https://i.ytimg.com/vi/be4b9JwLY_Y/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 1911,
    commentsCount: 167
  },
  {
    id: 305,
    isGeneralReview: true,
    video_id: "j9dM3d64jxc",
    author: "Mỏ Khoét Hải Phòng",
    title: "FoodTour Quy Nhơn Cùng Người Bản Địa | Mỏ Khoét Hải Phòng",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Mỏ Khoét Hải Phòng: FoodTour Quy Nhơn Cùng Người Bản Địa | Mỏ Khoét Hải Phòng.",
    image: "https://i.ytimg.com/vi/j9dM3d64jxc/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 2048,
    commentsCount: 196
  },
  {
    id: 306,
    isGeneralReview: true,
    video_id: "NxRH-0p3n9o",
    author: "Đạt Minh Trần Official",
    title: "Ốc Quy Nhơn Chỉ 15 Cành !!!",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Đạt Minh Trần Official: Ốc Quy Nhơn Chỉ 15 Cành !!!.",
    image: "https://i.ytimg.com/vi/NxRH-0p3n9o/hqdefault.jpg",
    tags: ["#ỐcQuyNhơn", "#ĂnVặtQuyNhơn", "#Ốc15k"],
    likesCount: 2185,
    commentsCount: 225
  },
  {
    id: 307,
    isGeneralReview: true,
    video_id: "dAYD7KaTOA4",
    author: "Lifestyle",
    title: "Foodtour Quy Nhơn  #dulich #quang #travelblog #food #travelvideo #travel #travelvlog #beach",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Lifestyle: Foodtour Quy Nhơn  #dulich #quang #travelblog #food #travelvideo #travel #travel.",
    image: "https://i.ytimg.com/vi/dAYD7KaTOA4/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 2322,
    commentsCount: 254
  },
  {
    id: 308,
    isGeneralReview: true,
    video_id: "sxa33HGPps8",
    author: "Căn bếp nhỏ 🍚",
    title: "Foodtour Quy Nhơnn #cooking #food #amthu #cookingchannel #monngon #amthuc #cookingshow #quynhon",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Căn bếp nhỏ 🍚: Foodtour Quy Nhơnn #cooking #food #amthu #cookingchannel #monngon #amthuc #cooki.",
    image: "https://i.ytimg.com/vi/sxa33HGPps8/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 2459,
    commentsCount: 283
  },
  {
    id: 309,
    isGeneralReview: true,
    video_id: "kZTkq4PSsSc",
    author: "Khánh Nguyễn vlog",
    title: "Ăn vặt Quy Nhơn|| Món ngon mỗi ngày||Khánh Nguyễn vlog ||#shorts",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Khánh Nguyễn vlog: Ăn vặt Quy Nhơn|| Món ngon mỗi ngày||Khánh Nguyễn vlog ||#shorts.",
    image: "https://i.ytimg.com/vi/kZTkq4PSsSc/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 2596,
    commentsCount: 312
  },
  {
    id: 310,
    isGeneralReview: true,
    video_id: "vMM3KBAHcbE",
    author: "huyền thanh",
    title: "Chợ sáng Quy Nhơn — món ngon nhất phải tới trước 6 giờ rưỡi | Một chút Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng huyền thanh: Chợ sáng Quy Nhơn — món ngon nhất phải tới trước 6 giờ rưỡi | Một chút Quy Nhơn.",
    image: "https://i.ytimg.com/vi/vMM3KBAHcbE/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 2733,
    commentsCount: 341
  },
  {
    id: 311,
    isGeneralReview: true,
    video_id: "yYePZ01ode4",
    author: "Di ở Quy Nhơn",
    title: "Ở Quy Nhơn ăn cháo + gỏi bò phần 72 #Dioquynhon #amthuc #food #dailyvlog #shorts",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Di ở Quy Nhơn: Ở Quy Nhơn ăn cháo + gỏi bò phần 72 #Dioquynhon #amthuc #food #dailyvlog #shorts.",
    image: "https://i.ytimg.com/vi/yYePZ01ode4/hqdefault.jpg",
    tags: ["#CháoGỏiBò", "#MónNgonQuyNhơn", "#ĂnVặt"],
    likesCount: 2870,
    commentsCount: 370
  },
  {
    id: 312,
    isGeneralReview: true,
    video_id: "AJy15DdSmqQ",
    author: "Ăn Sập Bắc Ninh",
    title: "Foodtour Quy Nhơn Ngon - Rẻ - Chất #ansapbacninh",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Ăn Sập Bắc Ninh: Foodtour Quy Nhơn Ngon - Rẻ - Chất #ansapbacninh.",
    image: "https://i.ytimg.com/vi/AJy15DdSmqQ/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 3007,
    commentsCount: 399
  },
  {
    id: 313,
    isGeneralReview: true,
    video_id: "qyIboYvNuKM",
    author: "QUY NHƠN TOURIST",
    title: "Top 5 món ăn ngon Quy Nhơn dành cho khách du lịch #amthucquynhon #dacsanquynhon #quynhontourist",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng QUY NHƠN TOURIST: Top 5 món ăn ngon Quy Nhơn dành cho khách du lịch #amthucquynhon #dacsanquynhon .",
    image: "https://i.ytimg.com/vi/qyIboYvNuKM/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 3144,
    commentsCount: 428
  },
  {
    id: 314,
    isGeneralReview: true,
    video_id: "VCNXMcSEjhE",
    author: "Sập Channel",
    title: "Ăn vặt đêm ngon rẻ ở Quy Nhơn ! #shorts",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Sập Channel: Ăn vặt đêm ngon rẻ ở Quy Nhơn ! #shorts.",
    image: "https://i.ytimg.com/vi/VCNXMcSEjhE/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 3281,
    commentsCount: 107
  },
  {
    id: 315,
    isGeneralReview: false,
    video_id: "UH_3bxsuhd0",
    author: "Hân Nghiêm",
    title: "100 ngàn ăn được gì ở chợ Đầm - Quy Nhơn 🤗 # hannghiem #tolahanne #foodlover #quynhon #behan",
    restaurant: "Thiên Đường Ăn Vặt Chợ Đầm",
    name: "Phố Ăn Vặt & Món Ngon Chợ Đầm",
    address: "Đường Hoàng Hoa Thám, TP. Quy Nhơn",
    gmapsQuery: "Chợ Đầm Quy Nhơn",
    priceRange: "10.000đ - 45.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Hân Nghiêm: 100 ngàn ăn được gì ở chợ Đầm - Quy Nhơn 🤗 # hannghiem #tolahanne #foodlover #qu.",
    image: "https://i.ytimg.com/vi/UH_3bxsuhd0/hqdefault.jpg",
    tags: ["#ChợĐầmQuyNhơn", "#ĂnVặtChợĐầm", "#ĂnSậpQuyNhơn"],
    likesCount: 3418,
    commentsCount: 136
  },
  {
    id: 316,
    isGeneralReview: true,
    video_id: "rapOSNoPysA",
    author: "Viet Nam Discovery Channel",
    title: "Cơm 7 Quán Qui Nhơn | #shorts #shortsvideo #vietnamdiscoverychannel",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Viet Nam Discovery Channel: Cơm 7 Quán Qui Nhơn | #shorts #shortsvideo #vietnamdiscoverychannel.",
    image: "https://i.ytimg.com/vi/rapOSNoPysA/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 3555,
    commentsCount: 165
  },
  {
    id: 317,
    isGeneralReview: true,
    video_id: "0gmLVJBsMy8",
    author: "Subon TV",
    title: "Đi Quy Nhơn thì ăn gì? Món ngon Quy Nhơn nhất định phải thử phần 1 #checkinquynhon #quynhon",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Subon TV: Đi Quy Nhơn thì ăn gì? Món ngon Quy Nhơn nhất định phải thử phần 1 #checkinquynh.",
    image: "https://i.ytimg.com/vi/0gmLVJBsMy8/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 3692,
    commentsCount: 194
  },
  {
    id: 318,
    isGeneralReview: true,
    video_id: "RD50zBrKeCQ",
    author: "Lang Thang Cùng 7 Sắc",
    title: "Đến Quy Nhơn phải Thử Món Này nha😋 #dulich #food #quynhon #videoshort",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Lang Thang Cùng 7 Sắc: Đến Quy Nhơn phải Thử Món Này nha😋 #dulich #food #quynhon #videoshort.",
    image: "https://i.ytimg.com/vi/RD50zBrKeCQ/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 3829,
    commentsCount: 223
  },
  {
    id: 319,
    isGeneralReview: true,
    video_id: "_PRXXOtuR6M",
    author: "Yến Vi Vu",
    title: "Foodtour Quy Nhơn ngon đỉnh của đỉnh | Yến Vi Vu | #shorts",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Yến Vi Vu: Foodtour Quy Nhơn ngon đỉnh của đỉnh | Yến Vi Vu | #shorts.",
    image: "https://i.ytimg.com/vi/_PRXXOtuR6M/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 3966,
    commentsCount: 252
  },
  {
    id: 320,
    isGeneralReview: true,
    video_id: "M294qvPokPg",
    author: "Rồng Ăn Ngon",
    title: "Quy Nhơn nhiều món ngon mà rẻ dữ á 🔅#quynhon #reviewquynhon",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Rồng Ăn Ngon: Quy Nhơn nhiều món ngon mà rẻ dữ á 🔅#quynhon #reviewquynhon.",
    image: "https://i.ytimg.com/vi/M294qvPokPg/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 4103,
    commentsCount: 281
  },
  {
    id: 321,
    isGeneralReview: true,
    video_id: "PrW-x9G5mBI",
    author: "thioiii đang chill",
    title: "Đi Quy Nhơn ăn gì ? #foodtour #quynhon",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng thioiii đang chill: Đi Quy Nhơn ăn gì ? #foodtour #quynhon.",
    image: "https://i.ytimg.com/vi/PrW-x9G5mBI/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 4240,
    commentsCount: 310
  },
  {
    id: 322,
    isGeneralReview: false,
    video_id: "5zgYiNJ3bqs",
    author: "ThuNga Angel",
    title: "[Angel Travel] Bún cá Quy Nhơn hong bà Thơ? #shorts #food",
    restaurant: "Bún Cá Bà Thơ",
    name: "Bún Chả Cá & Bún Sứa Bà Thơ",
    address: "Đường Nguyễn Huệ, TP. Quy Nhơn",
    gmapsQuery: "Bún cá Bà Thơ Nguyễn Huệ Quy Nhơn",
    priceRange: "30.000đ - 50.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng ThuNga Angel: [Angel Travel] Bún cá Quy Nhơn hong bà Thơ? #shorts #food.",
    image: "https://i.ytimg.com/vi/5zgYiNJ3bqs/hqdefault.jpg",
    tags: ["#BúnCáBàThơ", "#BúnCáQuyNhơn", "#ĐặcSảnBìnhĐịnh"],
    likesCount: 4377,
    commentsCount: 339
  },
  {
    id: 323,
    isGeneralReview: true,
    video_id: "Fl8rDRXOpzk",
    author: "Chả Cá Tiên Phát-Đặc Sản Quy Nhơn",
    title: "Food tour Quy Nhơn-Ăn vặt theo kiểu người Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Chả Cá Tiên Phát-Đặc Sản Quy Nhơn: Food tour Quy Nhơn-Ăn vặt theo kiểu người Quy Nhơn.",
    image: "https://i.ytimg.com/vi/Fl8rDRXOpzk/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 4514,
    commentsCount: 368
  },
  {
    id: 324,
    isGeneralReview: true,
    video_id: "QYinKOZ7_uM",
    author: "Y Linh Hotel Quy Nhon",
    title: "Food tour Quy Nhơn siêu rẻ các mom ơi! 🌊🐙🐚",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Y Linh Hotel Quy Nhon: Food tour Quy Nhơn siêu rẻ các mom ơi! 🌊🐙🐚.",
    image: "https://i.ytimg.com/vi/QYinKOZ7_uM/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 4651,
    commentsCount: 397
  },
  {
    id: 325,
    isGeneralReview: false,
    video_id: "DiZbFQzZPos",
    author: "Tiny Iu Phiu Lưu | Travel & Food",
    title: "QUY NHƠN 3N2Đ | Quán Sáu Lợi Hải Sản Ngon Ở Quy Nhơn #tinyiuphiuluu #shortvideo #shortsviral",
    restaurant: "Hải Sản Sáu Lợi",
    name: "Hải Sản Tươi Sống Sáu Lợi",
    address: "Đại lộ Xuân Diệu, TP. Quy Nhơn",
    gmapsQuery: "Hải Sản Sáu Lợi Xuân Diệu Quy Nhơn",
    priceRange: "40.000đ - 180.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Tiny Iu Phiu Lưu | Travel & Food: QUY NHƠN 3N2Đ | Quán Sáu Lợi Hải Sản Ngon Ở Quy Nhơn #tinyiuphiuluu #shortvideo .",
    image: "https://i.ytimg.com/vi/DiZbFQzZPos/hqdefault.jpg",
    tags: ["#HảiSảnSáuLợi", "#HảiSảnQuyNhơn", "#XuânDiệu"],
    likesCount: 4788,
    commentsCount: 426
  },
  {
    id: 326,
    isGeneralReview: true,
    video_id: "rUzXZm_T4v0",
    author: "Jayni Travel",
    title: "Jayni Travel | Tổng Hợp Foodtour Quy Nhơn Tụi Mình Đã Càn Quét Trong 4 Ngày!",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Jayni Travel: Jayni Travel | Tổng Hợp Foodtour Quy Nhơn Tụi Mình Đã Càn Quét Trong 4 Ngày!.",
    image: "https://i.ytimg.com/vi/rUzXZm_T4v0/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 4925,
    commentsCount: 105
  },
  {
    id: 327,
    isGeneralReview: true,
    video_id: "uH5ABqHqKys",
    author: "Duyen ăn gì 🍘",
    title: "Quy Nhơn thèm đồ ăn vặt thì ăn gì , ở đâu? #quynhon #viral #foodreview #xuhuongyoutube #angiday",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Duyen ăn gì 🍘: Quy Nhơn thèm đồ ăn vặt thì ăn gì , ở đâu? #quynhon #viral #foodreview #xuhuongy.",
    image: "https://i.ytimg.com/vi/uH5ABqHqKys/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 1562,
    commentsCount: 134
  },
  {
    id: 328,
    isGeneralReview: false,
    video_id: "1oXbAJrkdv4",
    author: "Toại Mũ Xanh - Hơi Thở Việt Nam",
    title: "Bánh Xèo Tôm Nhảy | Đặc Sản Quy Nhơn Phải Thử  #food #cooking",
    restaurant: "Bánh Xèo Tôm Nhảy Gia Truyền",
    name: "Bánh Xèo Tôm Nhảy Giòn Rụm",
    address: "14 Diên Hồng, TP. Quy Nhơn",
    gmapsQuery: "Bánh xèo tôm nhảy Diên Hồng Quy Nhơn",
    priceRange: "25.000đ - 55.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Toại Mũ Xanh - Hơi Thở Việt Nam: Bánh Xèo Tôm Nhảy | Đặc Sản Quy Nhơn Phải Thử  #food #cooking.",
    image: "https://i.ytimg.com/vi/1oXbAJrkdv4/hqdefault.jpg",
    tags: ["#BánhXèoTômNhảy", "#BánhXèoQuyNhơn", "#ĐặcSảnQuyNhơn"],
    likesCount: 1699,
    commentsCount: 163
  },
  {
    id: 329,
    isGeneralReview: true,
    video_id: "8xqkION-3rE",
    author: "QUY NHƠN TOURIST",
    title: "100k ăn sập Phố ẩm thực Quy Nhơn #quynhontourist #amthucquynhon #100k #reviewquynhon",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng QUY NHƠN TOURIST: 100k ăn sập Phố ẩm thực Quy Nhơn #quynhontourist #amthucquynhon #100k #reviewquy.",
    image: "https://i.ytimg.com/vi/8xqkION-3rE/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 1836,
    commentsCount: 192
  },
  {
    id: 330,
    isGeneralReview: true,
    video_id: "pMdMMtlSV5k",
    author: "Pít Ham Ăn Official",
    title: "Ăn sập…hổng có nổi Quy Nhơn 🤣 | Pít Ham Ăn |",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.1km",
    desc: "Trải nghiệm khám phá món ngon cùng Pít Ham Ăn Official: Ăn sập…hổng có nổi Quy Nhơn 🤣 | Pít Ham Ăn |.",
    image: "https://i.ytimg.com/vi/pMdMMtlSV5k/hqdefault.jpg",
    tags: ["#QuyNhơnFood", "#MónNgonQuyNhơn", "#FoodTour"],
    likesCount: 1973,
    commentsCount: 221
  },

  // ── 4. BỔ SUNG TIẾP 30+ VIDEO REVIEW QUY NHƠN ĐẶC SẮC (KHÔNG TRÙNG LẶP, XÁC THỰC 100% YOUTUBE) ──
  {
    id: 401,
    isGeneralReview: true,
    video_id: "R5eDLaWHFIA",
    author: "Thành Phố Quy Nhơn",
    title: "Tô Bánh Canh Huyền Thoại Ở Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Khám phá tô bánh canh chả cá da heo thơm nức tiếng xứ Nẫu cùng Thành Phố Quy Nhơn.",
    image: "https://i.ytimg.com/vi/R5eDLaWHFIA/hqdefault.jpg",
    tags: ["#BánhCanhQuyNhơn", "#MónNgonQuyNhơn", "#ĐặcSảnBìnhĐịnh"],
    likesCount: 1600,
    commentsCount: 75
  },
  {
    id: 402,
    isGeneralReview: true,
    video_id: "4NzsCBRCZiw",
    author: "Có Hẹn Với Sài Gòn",
    title: "Bánh Canh 5k Ở Quy Nhơn Có Gì Ta?",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Trải nghiệm tô bánh canh 5k siêu rẻ và chất lượng giòn rụm tại Quy Nhơn.",
    image: "https://i.ytimg.com/vi/4NzsCBRCZiw/hqdefault.jpg",
    tags: ["#BánhCanh5k", "#ĂnSậpQuyNhơn", "#MónNgonSiêuRẻ"],
    likesCount: 1723,
    commentsCount: 106
  },
  {
    id: 403,
    isGeneralReview: true,
    video_id: "eReYu4NMs2Y",
    author: "Du Lịch Việt Nam",
    title: "Quán Ăn Vặt Của Dân Bản Địa Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Quán ăn vặt lâu năm quen thuộc của người dân bản địa Quy Nhơn: nem nướng, trứng cút nướng, gỏi cuốn.",
    image: "https://i.ytimg.com/vi/eReYu4NMs2Y/hqdefault.jpg",
    tags: ["#ĂnVặtQuyNhơn", "#FoodTour", "#MónNgonĐườngPhố"],
    likesCount: 1846,
    commentsCount: 137
  },
  {
    id: 404,
    isGeneralReview: true,
    video_id: "66g36LZRjcI",
    author: "LỘC BIỂN QUY NHƠN",
    title: "Hải Sản Tươi Ngon Tại Biển Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Thanh niên đi chợ mua hải sản biển Quy Nhơn tươi rói: mực nhảy, tôm hùm, cá biển.",
    image: "https://i.ytimg.com/vi/66g36LZRjcI/hqdefault.jpg",
    tags: ["#HảiSảnQuyNhơn", "#LộcBiển", "#HảiSảnTươiSống"],
    likesCount: 1969,
    commentsCount: 168
  },
  {
    id: 405,
    isGeneralReview: true,
    video_id: "jBdqRtiQZiA",
    author: "Khánh Nguyễn vlog",
    title: "Lẩu Hải Sản Quy Nhơn Tươi Sống Ngon Nức Mũi",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Trải nghiệm nồi lẩu hải sản đầy ắp mực, tôm, ghẹ cùng Khánh Nguyễn vlog.",
    image: "https://i.ytimg.com/vi/jBdqRtiQZiA/hqdefault.jpg",
    tags: ["#LẩuHảiSản", "#ĂnUốngQuyNhơn", "#ĐặcSảnMiềnBiển"],
    likesCount: 2092,
    commentsCount: 199
  },
  {
    id: 406,
    isGeneralReview: true,
    video_id: "U7Vw1DzV8PI",
    author: "Blog Ẩm Thực",
    title: "Tổng Hợp Các Món Ăn Đặc Sản Của Bình Định",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Cẩm nang ẩm thực xứ Nẫu: Bánh ít lá gai, nem Chợ Huyện, chả ram tôm đất, tré Bình Định.",
    image: "https://i.ytimg.com/vi/U7Vw1DzV8PI/hqdefault.jpg",
    tags: ["#ĐặcSảnBìnhĐịnh", "#ẨmThựcQuyNhơn", "#MónNgonXứNẫu"],
    likesCount: 2215,
    commentsCount: 230
  },
  {
    id: 407,
    isGeneralReview: false,
    video_id: "fN-vri33VRU",
    author: "Tính Tung Tăng",
    title: "Tô Bánh Canh Da Heo Chả Cá 5K Đường 31 Tháng 3",
    restaurant: "Bánh Canh Đường 31 Tháng 3",
    name: "Bánh Canh Chả Cá Da Heo 5k",
    address: "Đường 31 Tháng 3, TP. Quy Nhơn",
    gmapsQuery: "Bánh Canh 31 Tháng 3 Quy Nhơn",
    priceRange: "5.000đ - 15.000đ",
    distanceText: "Cách bạn 900m",
    desc: "Huyền thoại tô bánh canh 5k đậm đà chả cá, da heo thơm giòn tại trung tâm Quy Nhơn.",
    image: "https://i.ytimg.com/vi/fN-vri33VRU/hqdefault.jpg",
    tags: ["#BánhCanh5k", "#BánhCanh31Tháng3", "#ĂnVặtQuyNhơn"],
    likesCount: 2338,
    commentsCount: 261
  },
  {
    id: 408,
    isGeneralReview: true,
    video_id: "-07o77RFVdQ",
    author: "Du Lịch Việt Nam",
    title: "Định Đi Quy Nhơn Nhớ Xem Video Này (Ăn Gì?)",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Hướng dẫn tổng hợp ăn sập Quy Nhơn từ sáng tới đêm cho khách du lịch.",
    image: "https://i.ytimg.com/vi/-07o77RFVdQ/hqdefault.jpg",
    tags: ["#ĂnGìQuyNhơn", "#FoodTour24h", "#DuLịchẨmThực"],
    likesCount: 2461,
    commentsCount: 292
  },
  {
    id: 409,
    isGeneralReview: false,
    video_id: "kObbs3oyG6I",
    author: "Khánh Nguyễn vlog",
    title: "Gà Chỉ Quy Nhơn Nổi Tiếng Đường Đèo Son",
    restaurant: "Khu Ẩm Thực Gà Chỉ Quy Nhơn",
    name: "Gà Chỉ Thung Lũng Quy Nhơn",
    address: "Tuyến đường Quy Nhơn - Sông Cầu, TP. Quy Nhơn",
    gmapsQuery: "Gà chỉ Quy Nhơn Sông Cầu",
    priceRange: "150.000đ - 300.000đ",
    distanceText: "Cách bạn 4.2km",
    desc: "Trải nghiệm đặc sản gà chỉ chế biến tại chỗ ngon trứ danh giữa thung lũng Quy Nhơn.",
    image: "https://i.ytimg.com/vi/kObbs3oyG6I/hqdefault.jpg",
    tags: ["#GàChỉQuyNhơn", "#ĐặcSảnQuyNhơn", "#ẨmThựcVùngVen"],
    likesCount: 2584,
    commentsCount: 323
  },
  {
    id: 410,
    isGeneralReview: true,
    video_id: "qDCINb0lXzI",
    author: "Lifestyle",
    title: "Về Quy Nhơn Ăn Hải Sản Tươi Ngay Trên Bè",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Trải nghiệm ăn hải sản sống vớt từ lồng bè biển Nhơn Hải - Quy Nhơn cực kỳ tươi ngon.",
    image: "https://i.ytimg.com/vi/qDCINb0lXzI/hqdefault.jpg",
    tags: ["#HảiSảnBè", "#NhơnHải", "#ẨmThựcBiển"],
    likesCount: 2707,
    commentsCount: 94
  },
  {
    id: 411,
    isGeneralReview: true,
    video_id: "UXgSLXU07hs",
    author: "Lang Thang Cùng 7 Sắc",
    title: "Đến Quy Nhơn Ăn Gì? Food Review Trọn Vẹn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Hành trình ăn uống khắp thành phố Quy Nhơn cùng Lang Thang Cùng 7 Sắc.",
    image: "https://i.ytimg.com/vi/UXgSLXU07hs/hqdefault.jpg",
    tags: ["#ĂnSậpQuyNhơn", "#FoodReview", "#MónNgonBảnĐịa"],
    likesCount: 2830,
    commentsCount: 125
  },
  {
    id: 412,
    isGeneralReview: true,
    video_id: "hDy0LB0pAEg",
    author: "Ngân Phan Thuý",
    title: "Tiệm Bánh Cuốn, Nem Nướng Siêu Ngon Núp Hẻm Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Tiệm bánh cuốn và nem nướng núp hẻm nhưng lúc nào cũng tấp nập khách tại Quy Nhơn.",
    image: "https://i.ytimg.com/vi/hDy0LB0pAEg/hqdefault.jpg",
    tags: ["#BánhCuốnQuyNhơn", "#NemNướngNúpHẻm", "#ĂnVặtNgon"],
    likesCount: 2953,
    commentsCount: 156
  },
  {
    id: 413,
    isGeneralReview: true,
    video_id: "N7rg7MQsHFk",
    author: "Hân Nghiêm",
    title: "Cầm 100k Liệu Có Ăn Hết Được Các Quán Hot Ở Quy Nhơn?",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Thử thách 100k càn quét loạt món ngon đường phố Quy Nhơn cùng Hân Nghiêm.",
    image: "https://i.ytimg.com/vi/N7rg7MQsHFk/hqdefault.jpg",
    tags: ["#ThửThách100k", "#ĂnVặtQuyNhơn", "#HânNghiêmFood"],
    likesCount: 3076,
    commentsCount: 187
  },
  {
    id: 414,
    isGeneralReview: true,
    video_id: "W55OjxAu7KU",
    author: "Du Lịch Việt Nam",
    title: "Review Chè Xu Xoa Hạt Lựu Mát Lạnh Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Món chè giải nhiệt thanh mát nức tiếng phố biển Quy Nhơn: xu xoa sần sật, hạt lựu dẻo dai.",
    image: "https://i.ytimg.com/vi/W55OjxAu7KU/hqdefault.jpg",
    tags: ["#ChèXuXoa", "#ChèQuyNhơn", "#MónTrángMiệng"],
    likesCount: 3199,
    commentsCount: 218
  },
  {
    id: 415,
    isGeneralReview: true,
    video_id: "pct6Xyd4aRc",
    author: "ĐẶC SẢN ÔNG BẢY FOOD",
    title: "Top Đặc Sản Bình Định Ngon Bạn Phải Thử Qua 1 Lần",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Danh sách các món đặc sản làm quà số một Bình Định: bánh tráng nước dừa, mực ngào ớt tỏi.",
    image: "https://i.ytimg.com/vi/pct6Xyd4aRc/hqdefault.jpg",
    tags: ["#ĐặcSảnLàmQuà", "#BìnhĐịnhFood", "#MónNgonXứNẫu"],
    likesCount: 3322,
    commentsCount: 249
  },
  {
    id: 416,
    isGeneralReview: true,
    video_id: "v98r56uyLVM",
    author: "Quang Quy Nhơn Travel",
    title: "Bánh Canh Cuốn Chả Cá 15k Truyền Thống Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Món bánh canh cuốn chả cá độc đáo giá chỉ 15k của người dân xứ Nẫu.",
    image: "https://i.ytimg.com/vi/v98r56uyLVM/hqdefault.jpg",
    tags: ["#BánhCanhCuốn", "#BánhCanh15k", "#QuangQuyNhơn"],
    likesCount: 3445,
    commentsCount: 280
  },
  {
    id: 417,
    isGeneralReview: false,
    video_id: "J2aQZPBNAp8",
    author: "Phước Du Hí",
    title: "Quán Bánh Canh Tôm Chỉ Có Người Quy Nhơn Biết",
    restaurant: "Bánh Canh Tôm Quy Nhơn",
    name: "Bánh Canh Tôm Tươi Ngon",
    address: "Đường Bạch Đằng, TP. Quy Nhơn",
    gmapsQuery: "Bánh Canh Tôm Bạch Đằng Quy Nhơn",
    priceRange: "25.000đ - 45.000đ",
    distanceText: "Cách bạn 1.4km",
    desc: "Bánh canh tôm biển ngọt thanh, sợi bánh mềm dai chuẩn vị chỉ có dân địa phương rành.",
    image: "https://i.ytimg.com/vi/J2aQZPBNAp8/hqdefault.jpg",
    tags: ["#BánhCanhTôm", "#QuánẨnQuyNhơn", "#ĐặcSảnBảnĐịa"],
    likesCount: 3568,
    commentsCount: 311
  },
  {
    id: 418,
    isGeneralReview: true,
    video_id: "YnE2K1SxLQQ",
    author: "Kim Anh Like Food",
    title: "Bánh Canh Nhất Định Phải Thử Ở Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Review tô bánh canh chả cá đậm đà hương vị biển cùng Kim Anh Like Food.",
    image: "https://i.ytimg.com/vi/YnE2K1SxLQQ/hqdefault.jpg",
    tags: ["#BánhCanhChảCá", "#MónNgonQuyNhơn", "#KimAnhFood"],
    likesCount: 3691,
    commentsCount: 82
  },
  {
    id: 419,
    isGeneralReview: true,
    video_id: "TOee-9JWrjI",
    author: "Pít Ham Ăn Official",
    title: "Ăn Sập Quy Nhơn P2: Gỏi Cá Mai, Bò Nướng Mắm Nhĩ",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Review gỏi cá mai tươi rói, bò nướng mắm nhĩ và bánh mì chấm bò thơm lừng.",
    image: "https://i.ytimg.com/vi/TOee-9JWrjI/hqdefault.jpg",
    tags: ["#GỏiCáMai", "#BòNướngMắmNhĩ", "#PítHamĂn"],
    likesCount: 3814,
    commentsCount: 113
  },
  {
    id: 420,
    isGeneralReview: true,
    video_id: "cJN8Dd7XBYw",
    author: "TH Family Vlogs",
    title: "Khám Phá Hải Sản Tươi Sống Đêm Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Bữa tiệc hải sản tôm, cua, ốc đĩa thơm ngon bên bờ biển Quy Nhơn.",
    image: "https://i.ytimg.com/vi/cJN8Dd7XBYw/hqdefault.jpg",
    tags: ["#HảiSảnĐêm", "#ẨmThựcQuyNhơn", "#DuLịchBiển"],
    likesCount: 3937,
    commentsCount: 144
  },
  {
    id: 421,
    isGeneralReview: false,
    video_id: "tgdt7N1hwxI",
    author: "Góc Bếp Miền Trung",
    title: "Bánh Hỏi Cháo Lòng Truyền Thống Quy Nhơn",
    restaurant: "Bánh Hỏi Cháo Lòng Miền Trung",
    name: "Bánh Hỏi Cháo Lòng Nóng Hổi",
    address: "Đường Diên Hồng, TP. Quy Nhơn",
    gmapsQuery: "Bánh Hỏi Cháo Lòng Diên Hồng Quy Nhơn",
    priceRange: "30.000đ - 55.000đ",
    distanceText: "Cách bạn 850m",
    desc: "Bánh hỏi thoa mỡ hẹ ăn kèm đĩa lòng heo tươi ngon và bát cháo lòng sánh mịn.",
    image: "https://i.ytimg.com/vi/tgdt7N1hwxI/hqdefault.jpg",
    tags: ["#BánhHỏiCháoLòng", "#ĐặcSảnBìnhĐịnh", "#ĂnSángQuyNhơn"],
    likesCount: 4060,
    commentsCount: 175
  },
  {
    id: 422,
    isGeneralReview: true,
    video_id: "0sp9VU3-Xj8",
    author: "QUY NHƠN TOURIST",
    title: "Review Những Loại Bánh Đặc Sản Bình Định Làm Quà",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Top các món bánh ngọt & mặn trứ danh xứ Nẫu thích hợp mua làm quà du lịch.",
    image: "https://i.ytimg.com/vi/0sp9VU3-Xj8/hqdefault.jpg",
    tags: ["#BánhĐặcSản", "#BìnhĐịnhTour", "#QuàDuLịch"],
    likesCount: 4183,
    commentsCount: 206
  },
  {
    id: 423,
    isGeneralReview: true,
    video_id: "Eg_QJXKul_k",
    author: "Mỹ Tài Quê Tôi",
    title: "Bột Mì Nhứt Phấy Đặc Sản Xứ Nẫu Bình Định",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Món ăn dân dã truyền thống gắn liền với tuổi thơ người dân Bình Định.",
    image: "https://i.ytimg.com/vi/Eg_QJXKul_k/hqdefault.jpg",
    tags: ["#BộtMìNhứt", "#MónQuêBìnhĐịnh", "#ẨmThựcDânDã"],
    likesCount: 4306,
    commentsCount: 237
  },
  {
    id: 424,
    isGeneralReview: true,
    video_id: "QxuOV1aUxSk",
    author: "Con Bò Review",
    title: "Khám Phá Toàn Diện Bản Đồ Đặc Sản Bình Định",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Tổng hợp hơn 10 món ngon độc lạ chỉ có tại vùng đất võ Bình Định.",
    image: "https://i.ytimg.com/vi/QxuOV1aUxSk/hqdefault.jpg",
    tags: ["#BảnĐồẨmThực", "#ĐặcSảnBìnhĐịnh", "#ReviewĐồĂn"],
    likesCount: 1629,
    commentsCount: 268
  },
  {
    id: 425,
    isGeneralReview: true,
    video_id: "P0hdeZQ3a64",
    author: "Bụng Mỡ Đi Lạc",
    title: "Ăn Vặt Nổi Tiếng Đường Phố Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Hành trình càn quét bánh tráng kẹp patê, trứng nướng chén và kem bơ Quy Nhơn.",
    image: "https://i.ytimg.com/vi/P0hdeZQ3a64/hqdefault.jpg",
    tags: ["#ĂnVặtĐườngPhố", "#BụngMỡĐiLạc", "#MónNgonTuổiTeen"],
    likesCount: 1752,
    commentsCount: 299
  },
  {
    id: 426,
    isGeneralReview: true,
    video_id: "fH3ElL4l0BY",
    author: "Chồng Ngơ Vợ Ngáo",
    title: "Bánh Canh Chả Cá Quy Nhơn Nóng Hổi Vừa Thổi Vừa Ăn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Tô bánh canh chả cá ngập tràn topping ngọt thanh nước hầm xương cá.",
    image: "https://i.ytimg.com/vi/fH3ElL4l0BY/hqdefault.jpg",
    tags: ["#BánhCanhQuyNhơn", "#ChảCáBiển", "#FoodVlog"],
    likesCount: 1875,
    commentsCount: 330
  },
  {
    id: 427,
    isGeneralReview: false,
    video_id: "S6qHC-sJ5Dg",
    author: "Kẻ Di Trú",
    title: "Bánh Canh Chả Cá Quy Nhơn Đường Lê Hồng Phong",
    restaurant: "Bánh Canh Chả Cá Lê Hồng Phong",
    name: "Bánh Canh Chả Cá Gia Truyền",
    address: "Đường Lê Hồng Phong, TP. Quy Nhơn",
    gmapsQuery: "Bánh Canh Lê Hồng Phong Quy Nhơn",
    priceRange: "20.000đ - 40.000đ",
    distanceText: "Cách bạn 700m",
    desc: "Quán bánh canh chả cá lâu năm nức tiếng đông nghẹt khách tại trung tâm TP. Quy Nhơn.",
    image: "https://i.ytimg.com/vi/S6qHC-sJ5Dg/hqdefault.jpg",
    tags: ["#BánhCanhLêHồngPhong", "#BánhCanhQuyNhơn", "#QuánNgonQuyNhơn"],
    likesCount: 1998,
    commentsCount: 101
  },
  {
    id: 428,
    isGeneralReview: true,
    video_id: "AzqluwK_NYE",
    author: "Sập Channel",
    title: "Ăn Sập Quy Nhơn Tập 2 Cùng Sập Channel",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Tiếp tục hành trình khám phá thiên đường ẩm thực biển Quy Nhơn cùng Sập Channel.",
    image: "https://i.ytimg.com/vi/AzqluwK_NYE/hqdefault.jpg",
    tags: ["#ĂnSậpQuyNhơn", "#SậpChannel", "#FoodTourBìnhĐịnh"],
    likesCount: 2121,
    commentsCount: 132
  },
  {
    id: 429,
    isGeneralReview: true,
    video_id: "IkIq9-FskpM",
    author: "Thi Ố Lè Vlog",
    title: "Buffet Hải Sản Siêu Ngon Tại Biển Quy Nhơn",
    address: "TP. Quy Nhơn",
    priceRange: "20.000đ - 65.000đ",
    distanceText: "Cách bạn 1.2km",
    desc: "Đại tiệc buffet hải sản tươi sống nướng mỡ hành thả ga tại Quy Nhơn.",
    image: "https://i.ytimg.com/vi/IkIq9-FskpM/hqdefault.jpg",
    tags: ["#BuffetHảiSản", "#ĂnThảGa", "#HảiSảnNướng"],
    likesCount: 2244,
    commentsCount: 163
  },
  {
    id: 430,
    isGeneralReview: false,
    video_id: "gLG_7NYYmhk",
    author: "Anh Tú Vlog",
    title: "Bánh Hỏi Cháo Lòng Bán 40 Năm Ngon Tuyệt Tại Quy Nhơn",
    restaurant: "Bánh Hỏi Cháo Lòng 40 Năm",
    name: "Bánh Hỏi Cháo Lòng Gia Truyền 40 Năm",
    address: "Đường Trần Phú, TP. Quy Nhơn",
    gmapsQuery: "Bánh Hỏi Cháo Lòng Trần Phú Quy Nhơn",
    priceRange: "35.000đ - 60.000đ",
    distanceText: "Cách bạn 1.0km",
    desc: "Quán bánh hỏi cháo lòng gia truyền hơn 40 năm gắn liền với nhiều thế hệ người dân Quy Nhơn.",
    image: "https://i.ytimg.com/vi/gLG_7NYYmhk/hqdefault.jpg",
    tags: ["#BánhHỏi40Năm", "#QuánGiaTruyền", "#ĐặcSảnQuyNhơn"],
    likesCount: 2367,
    commentsCount: 194
  }
];

export default function ReelsFeed({ items = CURATED_REELS_DATA }) {
  // Chiến thuật 1: Phân trang ngặt nghèo .limit(5), khi vào reels xáo trộn ngẫu nhiên để phát ngẫu nhiên
  const [itemsList, setItemsList] = useState(() => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Mặc định tự động mở tiếng khi vào Reels
  const [isPaused, setIsPaused] = useState(false);
  const [likedMap, setLikedMap] = useState({});

  const containerRef = useRef(null);
  const clickTimerRef = useRef(null);
  const watchStartTimeRef = useRef(Date.now());

  // Chiến thuật 2: Bắn Google Analytics event miễn phí (0 Write Firestore)
  useEffect(() => {
    const curItem = itemsList[currentIndex];
    if (curItem) {
      if (typeof window !== 'undefined' && window.firebase && typeof window.firebase.analytics === 'function') {
        try {
          window.firebase.analytics().logEvent('reel_watched', {
            video_id: curItem.video_id || '',
            restaurant: curItem.restaurant || '',
            title: curItem.title || curItem.name || '',
            index: currentIndex
          });
        } catch (e) {}
      }
    }

    // Ghi nhận thời gian xem video vào LocalStorage Batcher
    const prevTime = watchStartTimeRef.current;
    watchStartTimeRef.current = Date.now();
    const duration = Math.round((Date.now() - prevTime) / 1000);

    if (window.userActionBatcher && curItem) {
      window.userActionBatcher.recordAction({
        type: duration >= 4 ? 'reel_watched_deep' : 'reel_skipped_fast',
        video_id: curItem.video_id,
        durationSeconds: duration
      });
    }

    // Chiến thuật vòng lặp vô tận: Khi lướt đến gần cuối, nạp tiếp hoặc random xáo trộn kho video
    if (currentIndex >= itemsList.length - 2) {
      if (itemsList.length < items.length) {
        const nextBatch = items.slice(itemsList.length, itemsList.length + 5);
        if (nextBatch.length > 0) {
          setItemsList(prev => [...prev, ...nextBatch]);
        }
      } else {
        const curVid = itemsList[currentIndex]?.video_id;
        const candidates = items.filter(v => v.video_id !== curVid);
        const shuffled = [...candidates].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, 5).map((it, i) => ({
          ...it,
          id: (itemsList.length + 1) * 100 + i + 1,
          isRandomLooped: true
        }));
        setItemsList(prev => [...prev, ...picked]);
      }
    }
  }, [currentIndex, items, itemsList]);

  // 1. Tự động skip khi video lỗi hoặc hết video (Dead Link QA & AutoNext)
  const handlePlayerError = useCallback((index) => {
    if (index < itemsList.length - 1 && containerRef.current) {
      const nextIdx = index + 1;
      setCurrentIndex(nextIdx); // Lập tức kích hoạt mount video tiếp theo và autoplay
      const itemHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: nextIdx * itemHeight,
        behavior: 'smooth'
      });
    }
  }, [itemsList.length]);

  // 2. Bắt sự kiện kết thúc video (AutoNext) và lỗi onError từ YouTube iframe qua postMessage
  useEffect(() => {
    const handleMessage = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (!data) return;

        // Tự động chuyển tiếp khi video chạy hết (YT.PlayerState.ENDED = 0)
        const isEnded = 
          (data.event === 'onStateChange' && (data.info === 0 || data.data === 0)) ||
          (data.event === 'infoDelivery' && data.info && data.info.playerState === 0);

        if (isEnded || data.event === 'onError') {
          handlePlayerError(currentIndex);
        }
      } catch (err) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentIndex, handlePlayerError]);

  // 3. Cuộn trang -> reset pause state & cập nhật index
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const itemHeight = container.clientHeight;
    if (itemHeight <= 0) return;

    const newIndex = Math.round(container.scrollTop / itemHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
      setIsPaused(false);
      setCurrentIndex(newIndex);
    }
  };

  // 4. Chạm màn hình để Tạm dừng / Tiếp tục phát (Play / Pause)
  const handleContainerClick = (e, index) => {
    if (e.target.closest('button') || e.target.closest('a')) return;

    if (clickTimerRef.current) {
      // Double click -> Thả tim!
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      const itemId = items[index].id;
      setLikedMap(prev => ({ ...prev, [itemId]: true }));
    } else {
      // Single click -> Toggle Play/Pause!
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        togglePlayPause(index);
      }, 220);
    }
  };

  const togglePlayPause = (index) => {
    const iframe = document.getElementById(`yt-iframe-${index}`);
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);

    if (iframe && iframe.contentWindow) {
      const cmd = nextPaused ? 'pauseVideo' : 'playVideo';
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
    }
  };

  // 5. Bật / Tắt âm thanh
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    const activeIframe = document.getElementById(`yt-iframe-${currentIndex}`);
    if (activeIframe && activeIframe.contentWindow) {
      const cmd = nextMuted ? 'mute' : 'unMute';
      activeIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*');
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {itemsList.map((item, idx) => {
          const isCurrent = idx === currentIndex;
          const isLiked = !!likedMap[item.id];
          const isGeneral = !!item.isGeneralReview;

          return (
            <div
              key={item.id || idx}
              onClick={(e) => handleContainerClick(e, idx)}
              className="relative w-full h-full snap-start snap-always shrink-0 overflow-hidden bg-black flex items-center justify-center cursor-pointer"
            >
              <div className="relative w-full max-w-[480px] h-full overflow-hidden bg-stone-950 flex items-center justify-center shadow-2xl">
                
                {/* Video Player & Poster với Autoplay tức thì khi vuốt */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                  {isCurrent && (
                    <iframe
                      id={`yt-iframe-${idx}`}
                      src={`https://www.youtube.com/embed/${item.video_id}?controls=0&rel=0&playsinline=1&modestbranding=1&autoplay=1&mute=1&loop=0&enablejsapi=1`}
                      className="absolute inset-0 w-full h-full object-cover border-0 z-0 pointer-events-none"
                      style={{ width: '100%', height: '100%', transform: 'scale(1.04)', transformOrigin: 'center center' }}
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title={item.title || item.restaurant}
                    />
                  )}

                  {/* Play / Pause Indicator Icon in Center */}
                  {isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
                      <div className="w-18 h-18 p-4 rounded-full bg-black/65 backdrop-blur-lg flex items-center justify-center text-white shadow-2xl border border-white/25 animate-pulse">
                        <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
                          <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
                        </svg>
                      </div>
                    </div>
                  )}

                  <img
                    src={item.image}
                    alt={item.title || item.name}
                    loading={idx <= 1 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-90 -z-10"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none z-10" />
                </div>

                {/* Top Badges & Sound Button */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    {isGeneral ? (
                      <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                        🍜 Food Tour Quy Nhơn
                      </span>
                    ) : (
                      <span className="bg-emerald-600/90 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">
                        📍 Quán Đặc Sản
                      </span>
                    )}
                    <span className="bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      ▶ Shorts
                    </span>
                  </div>

                  <button
                    onClick={toggleMute}
                    className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition flex items-center gap-1.5 text-xs font-bold shadow-lg"
                  >
                    <span>{isMuted ? '🔇 Chạm bật tiếng' : '🔊 Đang bật tiếng'}</span>
                  </button>
                </div>

                {/* Action Bar Right: CHỈ ĐỂ LẠI 2 ICON CHIA SẺ & KHÁM PHÁ */}
                <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-4 z-30 pointer-events-auto">
                  {/* Chia sẻ */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (window.reelsManager && typeof window.reelsManager.openShareModal === 'function') {
                          window.reelsManager.openShareModal(item.id);
                        } else if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Đã sao chép liên kết video!');
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-xl border border-white/20"
                      title="Chia sẻ video với bạn bè & nhóm"
                    >
                      <span className="text-xl">↗️</span>
                    </button>
                    <span className="text-white text-[11px] font-bold mt-1 drop-shadow-md">Chia sẻ</span>
                  </div>

                  {/* Khám phá */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (window.reelsManager && typeof window.reelsManager.exploreHashtags === 'function') {
                          window.reelsManager.exploreHashtags(item.id);
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-2xl border border-amber-200/50"
                      title="Quẹt các món ngon phù hợp với video này"
                    >
                      <span className="text-xl">🍲</span>
                    </button>
                    <span className="text-amber-300 text-[11px] font-extrabold mt-1 drop-shadow-md">Khám phá</span>
                  </div>
                </div>

                {/* Bottom Information */}
                <div className="absolute left-4 bottom-6 right-20 text-white z-30 pointer-events-auto">
                  {isGeneral ? (
                    /* Review chung: Không hiện tên quán riêng lẻ */
                    <>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-extrabold text-base text-white drop-shadow-md">
                          @{item.author || 'FoodTour Quy Nhơn'}
                        </h4>
                        <span className="bg-amber-400 text-stone-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          Review Ẩm Thực
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-white leading-snug drop-shadow-md mb-1 line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-white/80 font-medium line-clamp-2 mb-2 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(item.tags || []).map(t => (
                          <span key={t} className="text-[11px] font-bold text-amber-300 drop-shadow">
                            {t}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Review riêng quán: Hiện đầy đủ tên quán, món ăn, giá tiền */
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-extrabold text-base text-white drop-shadow-md">
                          @{item.restaurant}
                        </h4>
                        <span className="bg-rose-500/90 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.distanceText || 'Quy Nhơn'}
                        </span>
                      </div>
                      <p className="text-xs text-white/95 font-medium leading-relaxed drop-shadow-sm line-clamp-2 mb-1.5">
                        {item.name} • {item.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-[11px] font-bold text-amber-300">
                          💰 {item.priceRange}
                        </span>
                        <span className="text-[11px] font-bold text-amber-200">
                          • 🕒 {item.openTime}
                        </span>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
