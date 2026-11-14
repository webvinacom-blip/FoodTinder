// Database & State for FoodTinder / FoodFinder

const APP_DATA = {
  currentCity: {
    name: "Quy Nhơn",
    address: "Nguyễn Huệ, Quy Nhơn",
    lat: 13.7820,
    lng: 109.2197,
    weather: {
      temp: "24°C",
      condition: "Mưa râm ran",
      icon: "🌧️",
      description: "Trời Quy Nhơn đang mưa rào mát lạnh"
    }
  },
  
  weatherOptions: [
    { city: "Quy Nhơn", address: "Nguyễn Huệ, Quy Nhơn", temp: "24°C", condition: "Mưa râm ran", icon: "🌧️", lat: 13.7820, lng: 109.2197 },
    { city: "Quy Nhơn", address: "Xuân Diệu (Ven Biển)", temp: "28°C", condition: "Gió lộng mát mẻ", icon: "🌊", lat: 13.7745, lng: 109.2312 },
    { city: "TP. Hồ Chí Minh", address: "Quận 1, Bến Nghé", temp: "31°C", condition: "Nắng rực rỡ", icon: "☀️", lat: 10.7769, lng: 106.7009 },
    { city: "Hà Nội", address: "Hoàn Kiếm, Phố Cổ", temp: "18°C", condition: "Se se lạnh", icon: "🧣", lat: 21.0285, lng: 105.8542 },
    { city: "Đà Nẵng", address: "Bạch Đằng, Hải Châu", temp: "25°C", condition: "Mát dịu ven sông", icon: "🌉", lat: 16.0678, lng: 108.2208 }
  ],

  moods: [
    {
      id: "comfort",
      emoji: "🥺",
      label: "Cần vỗ về",
      color: "#FFB088",
      glow: "rgba(255, 176, 136, 0.4)",
      desc: "Cần món ấm áp, ngọt dịu để nạp lại tinh thần",
      tags: ["#Ấm_áp", "#Ngọt_ngào", "#Thanh_đạm", "#Vỗ_về"]
    },
    {
      id: "sad",
      emoji: "💔",
      label: "Hơi buồn rầu",
      color: "#FF6584",
      glow: "rgba(255, 101, 132, 0.45)",
      desc: "Ăn cay nóng hoặc xì xèo để xua tan muộn phiền",
      tags: ["#Xả_stress", "#Ấm_áp", "#Thèm_ấm_áp", "#Cay_nồng"]
    },
    {
      id: "craving",
      emoji: "😋",
      label: "Đang thèm thuồng",
      color: "#FF9F43",
      glow: "rgba(255, 159, 67, 0.4)",
      desc: "Muốn ăn đồ đậm đà, giòn rụm hoặc lẩu nướng ngập tràn",
      tags: ["#Đậm_đà", "#Giòn_rụm", "#Thèm_thịt", "#Đặc_sản"]
    },
    {
      id: "tired",
      emoji: "😴",
      label: "Mệt mỏi",
      color: "#747D8C",
      glow: "rgba(116, 125, 140, 0.35)",
      desc: "Cần cháo ấm, súp bổ dưỡng hoặc cafe thơm để hồi phục năng lượng",
      tags: ["#Dễ_tiêu", "#Thanh_lọc", "#Cà_phê", "#Yên_tĩnh"]
    },
    {
      id: "energetic",
      emoji: "🔥",
      label: "Sôi động",
      color: "#FF4757",
      glow: "rgba(255, 71, 87, 0.45)",
      desc: "Lên kèo tụ tập nướng lẩu cùng bạn bè quẩy hết mình",
      tags: ["#Hội_bạn", "#Xì_xèo", "#Bia_mồi", "#Sôi_động"]
    }
  ],

  currentMoodId: "sad", // Default matching user's Image 2 ("Hơi buồn rầu" selected)

  // Curated Dishes & Restaurants with high-fidelity visuals
  foods: [
    {
      id: 1,
      name: "Lẩu Thái Chua Cay Khổng Lồ",
      restaurant: "Quán Lẩu Cô Vy",
      address: "128 Nguyễn Huệ, TP. Quy Nhơn",
      distance: 1.5,
      distanceText: "Cách bạn 1.5km",
      weatherNote: "Trời mưa 24°C",
      priceRange: "150.000đ - 220.000đ",
      rating: 4.8,
      reviewCount: 342,
      lat: 13.7845,
      lng: 109.2225,
      category: "hotpot",
      moodIds: ["sad", "comfort", "energetic"],
      tags: ["#Xả_stress", "#Ấm_áp", "#Thèm_ấm_áp"],
      sideRibbon: ["#xả_stress", "#ấm_áp"],
      recommendReason: "Trời mưa lạnh + đang buồn, ăn lẩu chua cay kích thích vị giác là chuẩn nhất đó!",
      image: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hot-soup-in-a-pot-42861-large.mp4",
      likesCount: 1420,
      commentsCount: 98,
      openTime: "10:30 - 22:30",
      phone: "0905 123 456",
      desc: "Nồi lẩu bốc khói nghi ngút với nước dùng Tomyum chuẩn vị Thái, tôm càng xanh tươi rói từ biển Quy Nhơn, mực giòn, bò Mỹ nhúng tái và nấm tươi mát."
    },
    {
      id: 2,
      name: "Bò Nướng Ngói Gia Bảo Xì Xèo",
      restaurant: "Bò Tơ Nướng Ngói Gia Bảo",
      address: "45 Trần Cao Vân, TP. Quy Nhơn",
      distance: 1.2,
      distanceText: "Cách bạn 1.2km",
      weatherNote: "Trời mưa 24°C",
      priceRange: "120.000đ - 180.000đ",
      rating: 4.9,
      reviewCount: 512,
      lat: 13.7795,
      lng: 109.2260,
      category: "bbq",
      moodIds: ["craving", "energetic", "sad"],
      tags: ["#Xì_xèo", "#Đậm_đà", "#Hội_bạn"],
      sideRibbon: ["#xì_xèo", "#đậm_vị"],
      recommendReason: "Tiếng thịt bò xèo xèo trên ngói nung cùng hương bơ thơm lừng đánh thức mọi giác quan!",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cooking-meat-in-a-skillet-42998-large.mp4",
      likesCount: 2310,
      commentsCount: 145,
      openTime: "15:00 - 23:00",
      phone: "0935 888 999",
      desc: "Bò tươi ướp gia vị đậm đà nướng trực tiếp trên viên ngói đất sét đỏ hồng, chấm cùng nước sốt chao cay đặc chế béo ngậy."
    },
    {
      id: 3,
      name: "Trà Sữa Nướng Đường Đen Mây Mây",
      restaurant: "Tiệm Trà & Bánh Mây Mây",
      address: "88 Lê Lợi, TP. Quy Nhơn",
      distance: 0.8,
      distanceText: "Cách bạn 800m",
      weatherNote: "Trời se lạnh",
      priceRange: "35.000đ - 55.000đ",
      rating: 4.7,
      reviewCount: 280,
      lat: 13.7780,
      lng: 109.2210,
      category: "cafe",
      moodIds: ["comfort", "sad", "tired"],
      tags: ["#Cần_vỗ_về", "#Ngọt_ngào", "#Hạ_hỏa"],
      sideRibbon: ["#ngọt_ngào", "#vỗ_về"],
      recommendReason: "Lớp đường nâu khò giòn tan cùng vị trà thơm béo sẽ xoa dịu trái tim đang mệt mỏi.",
      image: "https://images.unsplash.com/photo-1558857563-b37cf5a9161a?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1558857563-b37cf5a9161a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-milk-tea-into-a-glass-43309-large.mp4",
      likesCount: 950,
      commentsCount: 64,
      openTime: "08:00 - 22:30",
      phone: "0912 345 678",
      desc: "Trà sữa pha thủ công từ cốt trà Ô Long nướng nguyên lá kết hợp trân châu hoàng kim dẻo mềm và kem cheese béo mịn."
    },
    {
      id: 4,
      name: "Bánh Xèo Tôm Nhảy Giòn Rụm",
      restaurant: "Bánh Xèo Tôm Nhảy Gia Vỹ",
      address: "14 Diên Hồng, TP. Quy Nhơn",
      distance: 1.4,
      distanceText: "Cách bạn 1.4km",
      weatherNote: "Trời mưa 24°C",
      priceRange: "35.000đ - 65.000đ",
      rating: 4.9,
      reviewCount: 890,
      lat: 13.7725,
      lng: 109.2245,
      category: "streetfood",
      moodIds: ["craving", "sad", "energetic"],
      tags: ["#Giòn_rụm", "#Đặc_sản_Quy_Nhơn", "#Ấm_nóng"],
      sideRibbon: ["#đặc_sản", "#giòn_tan"],
      recommendReason: "Bánh xèo vừa đúc nóng hổi, tôm biển tươi đỏ au nhảy tanh tách cuộn bánh tráng rau mầm cực đã!",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-frying-food-in-a-pan-43003-large.mp4",
      likesCount: 3120,
      commentsCount: 220,
      openTime: "06:30 - 21:30",
      phone: "0905 456 789",
      desc: "Bánh xèo vàng ươm vỏ mỏng giòn rụm không ngấy mỡ, nhân tôm đất tươi ngọt thịt, ăn kèm rau sống xanh mướt và nước mắm xoài chua cay."
    },
    {
      id: 5,
      name: "Bún Sứa & Bánh Canh Chả Cá Nóng",
      restaurant: "Bún Sứa Bà Lan - Đặc Sản Xứ Nẫu",
      address: "35 Nguyễn Huệ, TP. Quy Nhơn",
      distance: 0.7,
      distanceText: "Cách bạn 700m",
      weatherNote: "Mưa rào 24°C",
      priceRange: "35.000đ - 50.000đ",
      rating: 4.9,
      reviewCount: 420,
      lat: 13.7810,
      lng: 109.2185,
      category: "noodles",
      moodIds: ["comfort", "tired", "craving"],
      tags: ["#Ấm_bụng", "#Thanh_ngọt", "#Sứa_giòn"],
      sideRibbon: ["#ấm_bụng", "#thanh_đạm"],
      recommendReason: "Tô bún sứa nước lèo trong veo nấu từ cá ngừ biển thơm ngọt, từng miếng sứa giòn sần sật ấm lòng ngày mưa.",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-noodles-in-a-hot-soup-42864-large.mp4",
      likesCount: 1670,
      commentsCount: 110,
      openTime: "06:00 - 22:00",
      phone: "0903 555 777",
      desc: "Chả cá thu quết tay dai ngon ngọt vị tự nhiên, sứa trắng giòn ngọt sần sật chan nước lèo cà chua thơm nức."
    },
    {
      id: 6,
      name: "Cà Phê Yên Tĩnh & Bánh Sừng Bò",
      restaurant: "The View Rooftop & Garden Cafe",
      address: "20 Xuân Diệu (Ven biển), TP. Quy Nhơn",
      distance: 1.1,
      distanceText: "Cách bạn 1.1km",
      weatherNote: "Mát mẻ 24°C",
      priceRange: "40.000đ - 65.000đ",
      rating: 4.9,
      reviewCount: 650,
      lat: 13.7760,
      lng: 109.2290,
      category: "cafe",
      moodIds: ["tired", "sad", "comfort"],
      tags: ["#Yên_tĩnh", "#View_biển", "#Góc_chill"],
      sideRibbon: ["#yên_tĩnh", "#chữa_lành"],
      recommendReason: "Không gian tràn ngập cây xanh ngắm biển Quy Nhơn, bật nhạc lofi nhẹ nhàng xua tan căng thẳng.",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-coffee-being-poured-into-a-cup-43180-large.mp4",
      likesCount: 2890,
      commentsCount: 178,
      openTime: "07:00 - 23:00",
      phone: "0988 123 789",
      desc: "Cafe specialty rang xay mộc thơm ngào ngạt, các loại bánh nướng nóng hổi ra lò mỗi sáng, góc đọc sách ngắm sóng biển tuyệt đẹp."
    },
    {
      id: 7,
      name: "Gà Nướng Muối Ớt & Cơm Lam",
      restaurant: "Gà Chỉ Sông Trâm Quy Nhơn",
      address: "Km 8 Đường Quy Nhơn - Sông Cầu",
      distance: 2.8,
      distanceText: "Cách bạn 2.8km",
      weatherNote: "Trời se lạnh",
      priceRange: "180.000đ - 260.000đ",
      rating: 4.8,
      reviewCount: 310,
      lat: 13.7550,
      lng: 109.2150,
      category: "bbq",
      moodIds: ["energetic", "craving"],
      tags: ["#Đang_đói", "#Đậm_vị", "#Gà_thả_vườn"],
      sideRibbon: ["#no_nê", "#đậm_vị"],
      recommendReason: "Đói cồn cào thì phải quất ngay đùi gà ta da giòn rụm chấm muối ớt xanh cay nồng xé lưỡi!",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80"
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-roasting-chicken-over-an-open-fire-43224-large.mp4",
      likesCount: 1750,
      commentsCount: 92,
      openTime: "09:00 - 21:30",
      phone: "0914 999 333",
      desc: "Gà thả đồi thịt săn chắc thơm ngọt tự nhiên, ướp muối ớt hiểm rừng nướng than hồng ăn kèm ống cơm lam dẻo quánh."
    }
  ],

  // Comments for TikTok Reels view
  reelComments: [
    { user: "Minh Trang", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", text: "Trời mưa lạnh đi ăn quán này đúng là chân ái luôn á mọi người! Nước lẩu đỉnh chóp 🔥", time: "15 phút trước" },
    { user: "Hoàng Nam", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", text: "Nước chấm ở đây cuốn xỉu, ăn từ hồi sinh viên đến giờ vẫn nghiện 😋", time: "1 giờ trước" },
    { user: "Thùy Dương", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", text: "Quán này gần nhà mình nè, cô chủ quán siêu dễ thương còn tặng thêm nấm nữa ❤️", time: "3 giờ trước" }
  ],

  // AI Assistant Pre-configured Responses & Knowledge Base
  assistantResponses: {
    greetings: [
      "Hôm nay bạn thế nào? Mình có thể tìm món ăn hoàn hảo dựa theo tâm trạng và thời tiết hiện tại của bạn nè!",
      "Chào bạn! Quy Nhơn hôm nay mát râm ran 🌧️. Bạn muốn một món nóng hổi hay ngọt ngào vỗ về tâm hồn?"
    ],
    byMood: {
      comfort: "Bạn đang cần vỗ về đúng không? 🥰 Khi tâm trạng nhạy cảm, cơ thể thường khao khát một món thanh ngọt hoặc nước súp ấm nóng để sản sinh serotonin. Mình gợi ý bạn thử ngay một ly Trà Sữa Nướng Mây Mây hoặc tô Bún Sứa nóng hổi nhé!",
      sad: "Mình hiểu mà, ai cũng có những ngày hơi chùng xuống một chút 💔. Khoa học chứng minh đồ cay nồng như Lẩu Thái Tomyum sẽ kích thích giải phóng endorphin giúp bạn vui vẻ trở lại. Xem thử quán Lẩu Cô Vy cách bạn 1.5km nha!",
      craving: "Cơn thèm ập đến thì đừng cưỡng lại! 😋 Mùi bò nướng ngói thơm nức xì xèo hoặc bánh xèo tôm nhảy giòn rụm sẽ thỏa mãn vị giác của bạn 100%.",
      tired: "Mệt mỏi sau ngày dài? 😴 Đừng ăn đồ quá nhiều dầu mỡ. Một chén bánh canh cá ngọt thanh hoặc tách capuchino ấm tại The View Rooftop sẽ giúp bạn hồi phục năng lượng.",
      energetic: "Năng lượng bùng cháy! 🔥 Rủ ngay hội bạn thân đi ăn Bò nướng ngói hoặc Lẩu thái quẩy tưng bừng thôi!"
    }
  },

  // Friends & Match Chat
  nearbyFriends: [
    {
      id: 1,
      name: "Linh",
      age: 22,
      distance: "cách 500m 📍",
      craving: "Đang thèm lẩu 😋",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      status: "Online",
      unread: 1,
      time: "2 phút trước",
      messages: [
        { sender: "them", text: "Chào bạn nè! Mình thấy bạn cũng đang thèm lẩu á 👋", time: "11:15" },
        { sender: "them", text: "Quán Lẩu Cô Vy bên Nguyễn Huệ đang giảm 20% đi 2 người, bạn đi cùng hông? 🍲", time: "11:16" }
      ]
    },
    {
      id: 2,
      name: "Nam",
      age: 24,
      distance: "cách 1km 📍",
      craving: "Muốn đi ăn nướng 🥩",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      status: "Online",
      unread: 0,
      time: "15 phút trước",
      messages: [
        { sender: "them", text: "Trời mưa lành lạnh ăn bò nướng ngói là số 1 luôn! Tối nay 7h qua Bò Gia Bảo hông bạn?", time: "11:00" }
      ]
    },
    {
      id: 3,
      name: "Mai",
      age: 21,
      distance: "cách 1.5km 📍",
      craving: "Tìm bạn đi cafe ngắm mưa ☕",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      status: "5 phút trước",
      unread: 0,
      time: "30 phút trước",
      messages: [
        { sender: "them", text: "The View Rooftop đang có góc ngắm biển mưa chill lắm, chiều nay bạn rảnh ghé làm ly capuchino hông? ✨", time: "10:45" }
      ]
    }
  ],

  groupChats: [
    {
      id: "group-1",
      name: "Kèo Lẩu Trời Mưa Quy Nhơn 🍲",
      membersCount: 4,
      avatar: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=200&q=80",
      time: "Vừa xong",
      unread: 2,
      messages: [
        { sender: "Linh", text: "Mọi người ơi, quán Cô Vy đông quá!", time: "11:18" },
        { sender: "Nam", text: "Ai đến trước vào lấy số giữ bàn nha! 🙋‍♂️", time: "11:19" }
      ]
    }
  ],

  // My Personal Friends (Bạn bè của tôi)
  myFriends: [
    {
      id: 101,
      name: "Hoàng Anh",
      nickname: "Anh Béo",
      relation: "Bạn thân cấp 3",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      status: "Online",
      bio: "Đam mê hải sản & ốc luộc Quy Nhơn 🐚",
      phone: "0905 123 789",
      unread: 1,
      time: "5 phút trước",
      messages: [
        { sender: "them", text: "Ê chiều nay rảnh không ông? Qua phố ốc Ngọc Hân Công Chúa làm vài đĩa ốc xào sả ớt hông? 🐚🔥", time: "11:35" }
      ]
    },
    {
      id: 102,
      name: "Bảo Ngọc",
      nickname: "Ngọc Múp",
      relation: "Đồng nghiệp ăn trưa",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      status: "Online",
      bio: "Team mê ăn cay xé lưỡi & trà sữa nướng 🧋",
      phone: "0934 888 222",
      unread: 0,
      time: "20 phút trước",
      messages: [
        { sender: "them", text: "Trưa nay ăn bún sứa hay bánh hỏi lòng heo đây ta? Nhớ gọi thêm đĩa chả ram tôm đất nữa nha!", time: "11:20" }
      ]
    },
    {
      id: 103,
      name: "Tuấn Kiệt",
      nickname: "Kiệt Lẩu",
      relation: "Hội càn quét buffet",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      status: "15 phút trước",
      bio: "Thánh ăn lẩu nướng không bao giờ no 🥩🍲",
      phone: "0918 555 666",
      unread: 0,
      time: "1 giờ trước",
      messages: [
        { sender: "them", text: "Nồi lẩu hôm bữa bên quán Cô Vy đậm đà chuẩn bài ghê á, cuối tuần này set kèo tiếp đi!", time: "10:30" }
      ]
    },
    {
      id: 104,
      name: "Minh Thư",
      nickname: "Thư Mây",
      relation: "Bạn cafe chill",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
      status: "Online",
      bio: "Thích chụp ảnh sống ảo & view ngắm biển ☕🌊",
      phone: "0977 999 111",
      unread: 0,
      time: "2 giờ trước",
      messages: [
        { sender: "them", text: "The View Rooftop đang có menu bánh nướng mới ra lò thơm nức mũi nè, khi nào rảnh ghé làm vài con ảnh ngắm mưa nghen ✨", time: "09:40" }
      ]
    },
    {
      id: 105,
      name: "Quốc Huy",
      nickname: "Huy Xèo",
      relation: "Bạn thể thao",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      status: "Hôm qua",
      bio: "Bánh xèo tôm nhảy giòn tan là chân ái 🦐",
      phone: "0905 333 444",
      unread: 0,
      time: "Hôm qua",
      messages: [
        { sender: "them", text: "Quán bánh xèo Gia Vỹ mở chi nhánh mới to đẹp lắm, tối mai đi đá bóng xong ghé làm chục cái không?", time: "Hôm qua" }
      ]
    }
  ]
};
