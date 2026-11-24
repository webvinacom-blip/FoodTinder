// ══════════════════════════════════════════════════════════════════════
// FOODTINDER - KỆ GỢI Ý ĐỒ ĂN VẶT SHOPEE THEO CẢM XÚC (3 CỘT AFFILIATE)
// Mô hình: Gợi ý theo ngữ cảnh tâm trạng -> Tín hiệu chốt đơn Shopee Mall / Yêu thích+
// Thuật toán: 30% Hoa hồng cao nhất (sortType: 5) + 70% Bán chạy nhất (sortType: 2)
// Admin Link Importer: Nạp link Shopee hàng loạt, tự bóc tên, tự phân nhóm & lưu Firestore
// ══════════════════════════════════════════════════════════════════════

// ── 1. CÁC NHÓM CẢM XÚC ĂN VẶT (CỘT TRÁI) ──
const GROCERY_NEEDS = [
  { id: 'all', label: 'Tất cả ăn vặt', emoji: '✨', desc: 'Toàn bộ set hot trend & món ngon' },
  { id: 'sweets_nuts', label: 'Bánh mứt & Hạt ngon', emoji: '🥜', desc: 'Hạt dinh dưỡng, mứt tết, trái cây sấy, bánh & trà', isSeasonalTet: true },
  { id: 'movie', label: 'Cày phim / Ăn vặt', emoji: '🍿', desc: 'Bắp rang bơ, snack khoai tây, rong biển' },
  { id: 'hunger', label: 'Cứu đói 5 phút', emoji: '🍜', desc: 'Mì ly, xúc xích tiệt trùng, bánh mì tươi' },
  { id: 'drinking', label: 'Nhậu tại gia', emoji: '🍻', desc: 'Khô gà lá chanh, mực rim me, đậu phộng' },
  { id: 'specialty', label: 'Đặc sản làm quà', emoji: '🎁', desc: 'Nem chua Chợ Huyện, bánh ít lá gai, tré' }
];

// ── 2. THANH LỌC NHANH (SUB-TAGS) Ở ĐẦU CỘT GIỮA ──
const GROCERY_SUB_TAGS = [
  { id: 'all', label: 'Tất cả', emoji: '✨' },
  { id: 'nuts', label: 'Hạt dinh dưỡng', emoji: '🥜' },
  { id: 'dried_fruits', label: 'Trái cây sấy & Mứt', emoji: '🍓' },
  { id: 'bakery_tea', label: 'Bánh & Trà', emoji: '🍪' },
  { id: 'gift_box', label: 'Hộp quà', emoji: '🎁' }
];

// ── 3. TOP SHOP ĂN VẶT & ĐẶC SẢN UY TÍN TRÊN SHOPEE (CỘT PHẢI) ──
const SHOPEE_TOP_SHOPS = [
  {
    id: 'shop_bebu',
    name: 'Tiệm Ăn Vặt Bé Bự',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80',
    rating: '4.9 ⭐',
    followers: '320k+ người theo dõi',
    highlight: 'Bánh tráng phơi sương, khô gà bơ tỏi, bim bim khổng lồ',
    url: 'https://shopee.vn/search?keyword=tiem+an+vat+be+bu'
  },
  {
    id: 'shop_thaonguyen',
    name: 'Đặc Sản Xứ Nẫu Thảo Nguyên',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    avatar: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=120&q=80',
    rating: '4.9 ⭐',
    followers: '68k+ người theo dõi',
    highlight: 'Nem chua Chợ Huyện, tré rơm Quy Nhơn, mực rim me',
    url: 'https://shopee.vn/search?keyword=dac+san+quy+nhon+thao+nguyen'
  },
  {
    id: 'shop_curua',
    name: 'Bách Hoá Ăn Vặt Cụ Rùa',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    avatar: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=120&q=80',
    rating: '4.8 ⭐',
    followers: '145k+ người theo dõi',
    highlight: 'Đồ ăn vặt nội địa, que cay, bánh ngọt sốt phô mai',
    url: 'https://shopee.vn/search?keyword=bach+hoa+an+vat+cu+rua'
  },
  {
    id: 'shop_snackhouse',
    name: 'Snack House Official Store',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    avatar: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=120&q=80',
    rating: '5.0 ⭐',
    followers: '510k+ người theo dõi',
    highlight: 'Hạt điều rang muối, khoai tây sấy giòn, khô bò miếng',
    url: 'https://shopee.vn/search?keyword=snack+house+official'
  }
];

// ── 4. SET ĂN VẶT SHOPEE HOT TREND THEO CẢM XÚC (KHU VỰC 1 CỘT GIỮA) ──
const GROCERY_COMBOS = [
  {
    id: 'set_sweets_nuts',
    name: 'Set Hộp Quà Bánh Mứt & Hạt Dinh Dưỡng Thượng Hạng',
    category: 'sweets_nuts',
    subTag: 'gift_box',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '5.0',
    soldCount: '28,9k đã bán',
    price: '189.000đ',
    originalPrice: '250.000đ',
    discount: '-24%',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80',
    desc: 'Hạt điều rang củi Bình Phước vỏ lụa 500g + Hạnh nhân rang bơ Mỹ + Mứt dừa non Bến Tre + Trà lài thượng hạng',
    shopeeUrl: 'https://shopee.vn/search?keyword=hop+qua+hat+dinh+duong+tet'
  },
  {
    id: 'set_movie',
    name: 'Set Cày Phim Thâu Đêm 4 Món Hot Trend',
    category: 'movie',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: '18,4k đã bán',
    price: '89.000đ',
    originalPrice: '125.000đ',
    discount: '-28%',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80',
    desc: 'Bắp rang bơ caramel Mỹ + Snack khoai tây Lay’s + Rong biển Tao Kae Noi + Kẹo dẻo chua ngọt',
    shopeeUrl: 'https://shopee.vn/search?keyword=combo+an+vat+cay+phim'
  },
  {
    id: 'set_hunger',
    name: 'Set Cứu Đói Nhanh 5 Phút Đêm Khuya',
    category: 'hunger',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: '24,1k đã bán',
    price: '49.000đ',
    originalPrice: '68.000đ',
    discount: '-27%',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80',
    desc: 'Mì Ly Omachi Bò Hầm xốt đậm vị + 2 Cây xúc xích CP tiệt trùng + Bánh mì tươi Kinh Đô bơ sữa',
    shopeeUrl: 'https://shopee.vn/search?keyword=combo+mi+ly+xuc+xich'
  },
  {
    id: 'set_drinking',
    name: 'Set Nhậu Lai Rai Cạ Cứng Chuẩn Vị',
    category: 'drinking',
    subTag: 'nuts',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '5.0',
    soldCount: '35,7k đã bán',
    price: '139.000đ',
    originalPrice: '185.000đ',
    discount: '-24%',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    desc: 'Khô gà lá chanh cay giòn hũ lớn 300g + Mực cán rim me Quy Nhơn 200g + Đậu phộng da cá tỏi ớt',
    shopeeUrl: 'https://shopee.vn/search?keyword=combo+kho+ga+muc+rim+me'
  },
  {
    id: 'set_specialty',
    name: 'Set Đặc Sản Xứ Nẫu Làm Quà Biếu',
    category: 'specialty',
    subTag: 'gift_box',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '4.9',
    soldCount: '9,6k đã bán',
    price: '179.000đ',
    originalPrice: '220.000đ',
    discount: '-18%',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80',
    desc: '10 Chiếc Nem chua Chợ Huyện lá ổi đóng hộp + 1 Cây Tré rơm Quy Nhơn loại 1 + 1 Hộp Bánh ít lá gai',
    shopeeUrl: 'https://shopee.vn/search?keyword=dac+san+quy+nhon+nem+tre'
  }
];

// ── 5. KỆ HÀNG ĂN VẶT & MÓN NGON SHOPEE (KHU VỰC 2 CỘT GIỮA) ──
const GROCERY_ITEMS = [
  // 🥜 BÁNH MỨT & HẠT NGON
  {
    id: 'snack_hatdieu',
    name: 'Hạt điều rang củi Bình Phước vỏ lụa loại A cồ cùi giòn béo hũ 500g',
    category: 'sweets_nuts',
    subTag: 'nuts',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '5.0',
    soldCount: 'Đã bán 94,6k',
    soldCountRaw: 94600,
    commissionRate: 16.5,
    price: '115.000đ',
    originalPrice: '145.000đ',
    discount: '-21%',
    image: 'https://images.unsplash.com/photo-1536591375315-1b83681e3be1?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=hat+dieu+rang+cui+binh+phuoc'
  },
  {
    id: 'snack_macca',
    name: 'Hạt macca Đắk Lắk sấy nứt vỏ tự nhiên hũ 500g tặng kèm đồ khui tiện lợi',
    category: 'sweets_nuts',
    subTag: 'nuts',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 78,2k',
    soldCountRaw: 78200,
    commissionRate: 18.0,
    price: '129.000đ',
    originalPrice: '165.000đ',
    discount: '-22%',
    image: 'https://images.unsplash.com/photo-1543157148-f819d16ae75b?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=hat+macca+dak+lak'
  },
  {
    id: 'snack_hanhnhan',
    name: 'Hạt hạnh nhân Mỹ sấy rang bơ nguyên vỏ giòn tan thơm lừng hũ 500g',
    category: 'sweets_nuts',
    subTag: 'nuts',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 62,4k',
    soldCountRaw: 62400,
    commissionRate: 15.5,
    price: '109.000đ',
    originalPrice: '138.000đ',
    discount: '-21%',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=hanh+nhan+rang+bo'
  },
  {
    id: 'snack_mutdua',
    name: 'Mứt dừa non Bến Tre sợi mềm dẻo vị lá dứa sữa thơm béo ngọt thanh 350g',
    category: 'sweets_nuts',
    subTag: 'dried_fruits',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '4.9',
    soldCount: 'Đã bán 45,8k',
    soldCountRaw: 45800,
    commissionRate: 14.0,
    price: '68.000đ',
    originalPrice: '85.000đ',
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=mut+dua+non+ben+tre'
  },
  {
    id: 'snack_xoaisay',
    name: 'Xoài sấy dẻo muối ớt chua cay hảo hạng loại 1 dẻo quánh hũ 500g',
    category: 'sweets_nuts',
    subTag: 'dried_fruits',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 110,5k',
    soldCountRaw: 110500,
    commissionRate: 13.5,
    price: '85.000đ',
    originalPrice: '110.000đ',
    discount: '-23%',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=xoai+say+deo+muoi+ot'
  },
  {
    id: 'snack_danisa',
    name: 'Bánh quy bơ Danisa hộp thiếc Hoàng Gia Đan Mạch 454g biếu tặng sang trọng',
    category: 'sweets_nuts',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '5.0',
    soldCount: 'Đã bán 89,3k',
    soldCountRaw: 89300,
    commissionRate: 10.0,
    price: '135.000đ',
    originalPrice: '160.000đ',
    discount: '-16%',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=banh+quy+danisa'
  },
  {
    id: 'snack_traolong',
    name: 'Trà Ô Long thuần hương Lâm Đồng túi hút chân không 250g hậu ngọt sâu',
    category: 'sweets_nuts',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 34,7k',
    soldCountRaw: 34700,
    commissionRate: 17.0,
    price: '95.000đ',
    originalPrice: '125.000đ',
    discount: '-24%',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=tra+o+long+lam+dong'
  },
  {
    id: 'snack_hopquatet',
    name: 'Hộp Quà Tết An Khang 6 Món hạt dinh dưỡng & bánh mứt kèm túi xách cao cấp',
    category: 'sweets_nuts',
    subTag: 'gift_box',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '5.0',
    soldCount: 'Đã bán 26,4k',
    soldCountRaw: 26400,
    commissionRate: 20.0,
    price: '289.000đ',
    originalPrice: '380.000đ',
    discount: '-24%',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=hop+qua+tet+an+khang'
  },

  // 🍿 CÀY PHIM / ĂN VẶT
  {
    id: 'snack_popcorn',
    name: 'Bắp rang bơ phô mai caramel khổng lồ Uncle Jax 150g',
    category: 'movie',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '5.0',
    soldCount: 'Đã bán 48,2k',
    soldCountRaw: 48200,
    commissionRate: 12.0,
    price: '39.000đ',
    originalPrice: '52.000đ',
    discount: '-25%',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=bap+rang+bo+pho+mai+uncle+jax'
  },
  {
    id: 'snack_lays',
    name: 'Snack khoai tây Lay’s Stax lon 160g vị Tự Nhiên thơm giòn',
    category: 'movie',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 120,5k',
    soldCountRaw: 120500,
    commissionRate: 8.5,
    price: '32.000đ',
    originalPrice: '40.000đ',
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=snack+lays+stax'
  },
  {
    id: 'snack_taokaenoi',
    name: 'Rong biển sấy giòn Tao Kae Noi vị cay Big Sheet lốc 12 gói',
    category: 'movie',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 86,4k',
    soldCountRaw: 86400,
    commissionRate: 11.0,
    price: '45.000đ',
    originalPrice: '58.000đ',
    discount: '-22%',
    image: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=rong+bien+tao+kae+noi'
  },
  {
    id: 'snack_trolli',
    name: 'Kẹo dẻo Hamburger Trolli Mini Burger Đức nhập khẩu',
    category: 'movie',
    subTag: 'bakery_tea',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '4.8',
    soldCount: 'Đã bán 19,4k',
    soldCountRaw: 19400,
    commissionRate: 9.0,
    price: '24.000đ',
    originalPrice: '29.000đ',
    discount: '-17%',
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=keo+deo+trolli+burger'
  },

  // 🍜 CỨU ĐÓI 5 PHÚT
  {
    id: 'snack_omachi',
    name: 'Mì Ly Omachi Bò Hầm Xốt Cà Chua 68g thịt thật đậm đà',
    category: 'hunger',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 85,2k',
    soldCountRaw: 85200,
    commissionRate: 7.5,
    price: '16.000đ',
    originalPrice: '20.000đ',
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=mi+ly+omachi+bo+ham'
  },
  {
    id: 'snack_sausage',
    name: 'Xúc xích tiệt trùng Vissan / CP gói 5 cây thịt heo tươi ngon',
    category: 'hunger',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 64,1k',
    soldCountRaw: 64100,
    commissionRate: 8.0,
    price: '24.000đ',
    originalPrice: '29.000đ',
    discount: '-17%',
    image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=xuc+xich+tiet+trung'
  },
  {
    id: 'snack_bread',
    name: 'Bánh mì hoa cúc Harrys Brioche Pháp 515g xé sợi thơm bơ',
    category: 'hunger',
    subTag: 'bakery_tea',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 42,9k',
    soldCountRaw: 42900,
    commissionRate: 11.5,
    price: '85.000đ',
    originalPrice: '105.000đ',
    discount: '-19%',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=banh+mi+hoa+cuc+harrys'
  },

  // 🍻 NHẬU TẠI GIA
  {
    id: 'snack_khoga',
    name: 'Khô gà lá chanh cay giòn loại đặc biệt hũ pet 500g',
    category: 'drinking',
    subTag: 'dried_fruits',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 142k',
    soldCountRaw: 142000,
    commissionRate: 14.5,
    price: '75.000đ',
    originalPrice: '99.000đ',
    discount: '-24%',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=kho+ga+la+chanh+500g'
  },
  {
    id: 'snack_mucrim',
    name: 'Mực rim me chua cay sa tế Quy Nhơn chuẩn vị xứ Nẫu hũ 250g',
    category: 'drinking',
    subTag: 'dried_fruits',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '5.0',
    soldCount: 'Đã bán 31,5k',
    soldCountRaw: 31500,
    commissionRate: 15.0,
    price: '79.000đ',
    originalPrice: '98.000đ',
    discount: '-19%',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=muc+rim+me+quy+nhon'
  },
  {
    id: 'snack_dauphong',
    name: 'Đậu phộng da cá vị tỏi ớt Tân Tân hũ 200g giòn rụm bùi béo',
    category: 'drinking',
    subTag: 'nuts',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 58,4k',
    soldCountRaw: 58400,
    commissionRate: 12.0,
    price: '28.000đ',
    originalPrice: '35.000đ',
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1536594098072-05354aae3c9a?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=dau+phong+da+ca+tan+tan'
  },
  {
    id: 'snack_khobo',
    name: 'Khô bò miếng sốt bơ tỏi mềm ngọt cay tê hũ 300g',
    category: 'drinking',
    subTag: 'dried_fruits',
    badge: 'Shopee Mall',
    badgeType: 'mall',
    rating: '4.9',
    soldCount: 'Đã bán 78,9k',
    soldCountRaw: 78900,
    commissionRate: 15.5,
    price: '115.000đ',
    originalPrice: '149.000đ',
    discount: '-23%',
    image: 'https://images.unsplash.com/photo-1608270114092-93e1ea6652c7?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=kho+bo+mieng+so+bo+toi'
  },

  // 🎁 ĐẶC SẢN LÀM QUÀ
  {
    id: 'snack_nemchua',
    name: 'Nem chua Chợ Huyện lá ổi Bình Định hộp 10 chiếc chuẩn vị',
    category: 'specialty',
    subTag: 'gift_box',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '4.9',
    soldCount: 'Đã bán 28,4k',
    soldCountRaw: 28400,
    commissionRate: 13.0,
    price: '65.000đ',
    originalPrice: '78.000đ',
    discount: '-17%',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=nem+chua+cho+huyen+binh+dinh'
  },
  {
    id: 'snack_tre',
    name: 'Tré rơm rơm Quy Nhơn loại 1 cây bọc rơm gia truyền',
    category: 'specialty',
    subTag: 'gift_box',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '5.0',
    soldCount: 'Đã bán 19,2k',
    soldCountRaw: 19200,
    commissionRate: 13.5,
    price: '55.000đ',
    originalPrice: '65.000đ',
    discount: '-15%',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=tre+rom+quy+nhon'
  },
  {
    id: 'snack_banhit',
    name: 'Bánh ít lá gai nhân dừa bánh dẻo xứ Nẫu hộp 10 cái',
    category: 'specialty',
    subTag: 'bakery_tea',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '4.9',
    soldCount: 'Đã bán 22,8k',
    soldCountRaw: 22800,
    commissionRate: 12.5,
    price: '75.000đ',
    originalPrice: '90.000đ',
    discount: '-17%',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=banh+it+la+gai+binh+dinh'
  },
  {
    id: 'snack_banhtrangdua',
    name: 'Bánh tráng nước dừa Tam Quan nướng than xấp 10 bánh',
    category: 'specialty',
    subTag: 'bakery_tea',
    badge: 'Yêu thích+',
    badgeType: 'favorite',
    rating: '4.9',
    soldCount: 'Đã bán 14,7k',
    soldCountRaw: 14700,
    commissionRate: 11.0,
    price: '68.000đ',
    originalPrice: '85.000đ',
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    shopeeUrl: 'https://shopee.vn/search?keyword=banh+trang+nuoc+dua+tam+quan'
  }
];

class GroceryManager {
  constructor() {
    this.currentNeedFilter = 'all';
    this.currentSubTag = 'all';
    this.wishlist = []; // Danh sách món đã lưu
    this.importerTab = 'products'; // 'products' hoặc 'shops'
    this.previewProducts = [];
    this.previewShops = [];
    this.loadWishlist();
    this.loadCustomLocalData();
  }

  init() {
    this.loadWishlist();
    this.renderNeedsSelector();
    this.renderMiddleView();
    this.renderRightSidebar();
    this.fetchFromFirestore();
  }

  // ── LOCAL STORAGE FALLBACK & CLEANUP ──
  filterCleanItems(items) {
    if (!Array.isArray(items)) return [];
    return items.filter(item => {
      const url = item.shopeeUrl || '';
      if (url.includes('.222.333') || url.includes('.777.888') || url.includes('.999.111') || url.includes('.333.444') || url.includes('.123456.')) {
        return false;
      }
      return true;
    });
  }

  loadCustomLocalData() {
    try {
      const savedItems = localStorage.getItem('foodtinder_custom_grocery_items_v1');
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = this.filterCleanItems(parsed);
          window.GROCERY_ITEMS = cleaned;
          localStorage.setItem('foodtinder_custom_grocery_items_v1', JSON.stringify(cleaned));
        }
      }
      const savedShops = localStorage.getItem('foodtinder_custom_grocery_shops_v1');
      if (savedShops) {
        const parsedShops = JSON.parse(savedShops);
        if (Array.isArray(parsedShops) && parsedShops.length > 0) {
          window.SHOPEE_TOP_SHOPS = parsedShops;
        }
      }
    } catch (e) {}
  }

  saveCustomLocalData() {
    try {
      localStorage.setItem('foodtinder_custom_grocery_items_v1', JSON.stringify(window.GROCERY_ITEMS || GROCERY_ITEMS));
      localStorage.setItem('foodtinder_custom_grocery_shops_v1', JSON.stringify(window.SHOPEE_TOP_SHOPS || SHOPEE_TOP_SHOPS));
    } catch (e) {}
  }

  // ── KIỂM TRA NHÃN THEO MÙA (TỪ GIỮA THÁNG 12 ĐẾN HẾT THÁNG 1 ÂM LỊCH) ──
  isTetSeason() {
    if (typeof window !== 'undefined') {
      if (window.FORCE_TET_SEASON === true) return true;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('season') === 'tet') return true;
      } catch (e) {}
    }

    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('vi-VN-u-ca-chinese', {
        day: 'numeric',
        month: 'numeric'
      });
      const parts = formatter.formatToParts(now);
      let lunarMonth = 0;
      let lunarDay = 0;
      for (const p of parts) {
        if (p.type === 'month') lunarMonth = parseInt(p.value, 10);
        if (p.type === 'day') lunarDay = parseInt(p.value, 10);
      }
      if (lunarMonth === 12 && lunarDay >= 15) return true;
      if (lunarMonth === 1) return true;
    } catch (err) {
      const now = new Date();
      const m = now.getMonth() + 1;
      const d = now.getDate();
      if ((m === 1 && d >= 10) || m === 2 || (m === 3 && d <= 5)) {
        return true;
      }
    }
    return false;
  }

  // ── THUẬT TOÁN ƯU TIÊN AFFILIATE: 30% HOA HỒNG CAO (sortType: 5) + 70% BÁN CHẠY (sortType: 2) ──
  rankAffiliateItems(items) {
    if (!items || items.length <= 1) return items;

    const pool = [...items];
    const topCount = Math.max(1, Math.round(pool.length * 0.3));

    pool.sort((a, b) => (b.commissionRate || 0) - (a.commissionRate || 0));

    const highCommissionItems = pool.slice(0, topCount).map(item => ({
      ...item,
      sortType: 5,
      affiliateTag: '⚡ Hoa hồng cao'
    }));

    const remainingItems = pool.slice(topCount);
    remainingItems.sort((a, b) => (b.soldCountRaw || 0) - (a.soldCountRaw || 0));
    const bestSellerItems = remainingItems.map(item => ({
      ...item,
      sortType: 2,
      affiliateTag: '🔥 Bán chạy'
    }));

    return [...highCommissionItems, ...bestSellerItems];
  }

  // ── QUẢN LÝ DANH SÁCH LƯU MUA SAU (WISHLIST) ──
  loadWishlist() {
    try {
      const saved = localStorage.getItem('foodtinder_shopee_wishlist_v1');
      if (saved) {
        this.wishlist = JSON.parse(saved);
      }
    } catch (e) {
      this.wishlist = [];
    }
    this.updateWishlistBadge();
  }

  saveWishlist() {
    try {
      localStorage.setItem('foodtinder_shopee_wishlist_v1', JSON.stringify(this.wishlist));
    } catch (e) {}
    this.updateWishlistBadge();
    this.renderRightSidebar();
  }

  isWishlisted(id) {
    return this.wishlist.some(item => item.id === id);
  }

  toggleWishlist(item) {
    window.soundFX && window.soundFX.playPop();
    const idx = this.wishlist.findIndex(w => w.id === item.id);
    if (idx !== -1) {
      this.wishlist.splice(idx, 1);
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast(`Đã bỏ lưu "${item.name}"`);
      }
    } else {
      this.wishlist.unshift({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        shopeeUrl: item.shopeeUrl,
        badge: item.badge,
        badgeType: item.badgeType,
        rating: item.rating,
        soldCount: item.soldCount
      });
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast(`❤️ Đã lưu món vào danh sách mua sau!`);
      }
    }
    this.saveWishlist();
    this.renderMiddleView();
  }

  removeFromWishlist(id) {
    window.soundFX && window.soundFX.playPop();
    this.wishlist = this.wishlist.filter(w => w.id !== id);
    this.saveWishlist();
    this.renderMiddleView();
  }

  clearWishlist() {
    if (this.wishlist.length === 0) return;
    window.soundFX && window.soundFX.playPop();
    this.wishlist = [];
    this.saveWishlist();
    this.renderMiddleView();
  }

  updateWishlistBadge() {
    const badge = document.getElementById('grocery-cart-badge');
    if (badge) {
      if (this.wishlist.length > 0) {
        badge.textContent = `❤️ ${this.wishlist.length}`;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  setNeed(needId) {
    window.soundFX && window.soundFX.playPop();
    this.currentNeedFilter = needId;
    this.renderNeedsSelector();
    this.renderMiddleView();
  }

  setSubTag(subTagId) {
    window.soundFX && window.soundFX.playPop();
    this.currentSubTag = subTagId;
    this.renderMiddleView();
  }

  // ══════════════════════════════════════════════════════════════════════
  // ── ADMIN LINK IMPORTER (NẠP LINK SHOPEE HÀNG LOẠT & TỰ ĐỘNG PHÂN NHÓM) ──
  // ══════════════════════════════════════════════════════════════════════

  openImporterModal(tab = 'products') {
    window.soundFX && window.soundFX.playPop();
    this.importerTab = tab;
    const modal = document.getElementById('grocery-importer-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
    this.renderImporterModalContent();
  }

  closeImporterModal() {
    window.soundFX && window.soundFX.playPop();
    const modal = document.getElementById('grocery-importer-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  setImporterTab(tab) {
    window.soundFX && window.soundFX.playPop();
    this.importerTab = tab;
    this.renderImporterModalContent();
  }

  fillSampleLinks() {
    window.soundFX && window.soundFX.playPop();
    const textarea = document.getElementById('importer-links-input');
    if (!textarea) return;

    if (this.importerTab === 'products') {
      textarea.value = [
        'https://shopee.vn/Bap-rang-bo-khong-lo-Uncle-Jax-My-150g-i.48922114.7891234567',
        'https://shopee.vn/Hat-dieu-rang-muoi-A-Co-Binh-Phuoc-hop-500g-i.67891234.1234567890',
        'https://shopee.vn/Set-qua-Tet-hat-dinh-duong-thuong-hang-An-Khang-i.89123456.2345678901',
        'https://shopee.vn/Kho-ga-la-chanh-loai-1-thom-ngon-hu-500g-i.12349876.3456789012',
        'https://shopee.vn/Thung-30-ly-Mi-Omachi-Xot-Bo-Ham-68g-i.56781234.4567890123'
      ].join('\n');
    } else {
      textarea.value = [
        'https://shopee.vn/tiemanvatbebu',
        'https://shopee.vn/dac_san_xu_nau_thao_nguyen',
        'https://shopee.vn/snackhouse_official'
      ].join('\n');
    }
  }

  clearImporterInput() {
    window.soundFX && window.soundFX.playPop();
    const textarea = document.getElementById('importer-links-input');
    if (textarea) textarea.value = '';
    if (this.importerTab === 'products') {
      this.previewProducts = [];
    } else {
      this.previewShops = [];
    }
    this.renderImporterModalContent();
  }

  // Tự động trích xuất tên từ slug Shopee URL
  cleanSlugToName(url) {
    try {
      let slug = '';
      const matchProduct = url.match(/shopee\.vn\/([^?#]+?)-i\.\d+\.\d+/);
      if (matchProduct && matchProduct[1]) {
        slug = matchProduct[1];
      } else {
        const matchGeneral = url.match(/shopee\.vn\/([^?#]+)/);
        if (matchGeneral && matchGeneral[1]) {
          slug = matchGeneral[1];
        }
      }

      slug = slug.replace(/^\/+|\/+$/g, '');
      if (slug.startsWith('product/')) {
        const parts = slug.split('/');
        return `Sản phẩm Shopee #${parts[parts.length - 1] || 'Mới'}`;
      }

      if (slug) {
        slug = decodeURIComponent(slug);
        const words = slug.split(/[-_+.]+/).filter(Boolean);
        if (words.length > 0) {
          return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
      }
    } catch (e) {}
    return 'Sản phẩm Shopee';
  }

  // Tự động phân loại danh mục (Category) và Sub-tag từ tiêu đề
  classifyItem(title) {
    const t = (title || '').toLowerCase();
    let category = 'sweets_nuts';
    let subTag = 'bakery_tea';

    // 1. Phân loại Category
    if (/hat|dieu|macca|hanh nhan|mut|say|danisa|tra|tet|banh mut|sua|o long/i.test(t)) {
      category = 'sweets_nuts';
    } else if (/bap rang|popcorn|snack|lays|khoai tay|rong bien|keo|burger|trolli/i.test(t)) {
      category = 'movie';
    } else if (/mi|omachi|xuc xich|banh mi|trung|chao|pho|cuu doi/i.test(t)) {
      category = 'hunger';
    } else if (/kho ga|muc rim|dau phong|kho bo|nhau|lai rai|da ca|sa te/i.test(t)) {
      category = 'drinking';
    } else if (/nem|tre|banh it|banh trang dua|dac san|quy nhon|binh dinh|xu nau/i.test(t)) {
      category = 'specialty';
    }

    // 2. Phân loại SubTag
    if (/hat|dieu|macca|hanh nhan|dau phong|oc cho|de/i.test(t)) {
      subTag = 'nuts';
    } else if (/mut|say|xoai|kho ga|muc|kho bo|trai cay/i.test(t)) {
      subTag = 'dried_fruits';
    } else if (/hop qua|set|combo|bieu|tet|nem|tre/i.test(t)) {
      subTag = 'gift_box';
    } else {
      subTag = 'bakery_tea';
    }

    return { category, subTag };
  }

  // Gợi ý ảnh đẹp tương ứng theo category/subtag
  suggestImageForClass(category, subTag) {
    if (subTag === 'nuts') return 'https://images.unsplash.com/photo-1536591375315-1b83681e3be1?auto=format&fit=crop&w=500&q=80';
    if (subTag === 'dried_fruits') return 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=500&q=80';
    if (subTag === 'gift_box') return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80';
    if (category === 'movie') return 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80';
    if (category === 'hunger') return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80';
    if (category === 'drinking') return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80';
    if (category === 'specialty') return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80';
    return 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80';
  }

  // Parse links từ textarea
  parseInputLinks() {
    window.soundFX && window.soundFX.playPop();
    const textarea = document.getElementById('importer-links-input');
    if (!textarea || !textarea.value.trim()) {
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast('Vui lòng dán ít nhất 1 link Shopee để phân tích!');
      }
      return;
    }

    const rawText = textarea.value.trim();
    // Tách theo dòng hoặc khoảng trắng
    const lines = rawText.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);

    if (this.importerTab === 'products') {
      const parsed = [];
      lines.forEach((line, idx) => {
        // Tìm URL
        let url = line;
        const matchUrl = line.match(/(https?:\/\/[^\s]+)/);
        if (matchUrl) url = matchUrl[1];
        else if (line.includes('shopee.vn')) url = `https://${line.replace(/^https?:\/\//, '')}`;

        const name = this.cleanSlugToName(url);
        const { category, subTag } = this.classifyItem(name);
        const image = this.suggestImageForClass(category, subTag);

        parsed.push({
          id: `preview_prod_${Date.now()}_${idx}`,
          name: name,
          shopeeUrl: url,
          category: category,
          subTag: subTag,
          badge: 'Shopee Mall',
          badgeType: 'mall',
          price: '65.000đ',
          originalPrice: '85.000đ',
          discount: '-20%',
          image: image,
          rating: '5.0',
          soldCount: 'Đã bán 12,5k',
          soldCountRaw: 12500,
          commissionRate: 15.0
        });
      });

      this.previewProducts = parsed;
    } else {
      // Tab Shops
      const parsedShops = [];
      lines.forEach((line, idx) => {
        let url = line;
        const matchUrl = line.match(/(https?:\/\/[^\s]+)/);
        if (matchUrl) url = matchUrl[1];
        else if (line.includes('shopee.vn')) url = `https://${line.replace(/^https?:\/\//, '')}`;

        let shopSlug = '';
        const matchSlug = url.match(/shopee\.vn\/(?:shop\/)?([^?#]+)/);
        if (matchSlug && matchSlug[1]) shopSlug = matchSlug[1].replace(/^\/+|\/+$/g, '');

        let shopName = 'Shop Ăn Vặt Uy Tín';
        if (shopSlug) {
          const words = decodeURIComponent(shopSlug).split(/[-_+.]+/).filter(Boolean);
          if (words.length > 0) {
            shopName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
        }

        parsedShops.push({
          id: `preview_shop_${Date.now()}_${idx}`,
          name: shopName,
          badge: 'Shopee Mall',
          badgeType: 'mall',
          avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80',
          rating: '4.9 ⭐',
          followers: '150k+ người theo dõi',
          highlight: 'Đồ ăn vặt nội địa, bánh mứt Tết & đặc sản uy tín',
          url: url
        });
      });

      this.previewShops = parsedShops;
    }

    this.renderImporterModalContent();
    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(`⚡ Đã phân tích và tự phân nhóm xong!`);
    }
  }

  // Quản lý các dòng trong bảng preview
  updatePreviewProduct(idx, field, value) {
    if (this.previewProducts[idx]) {
      this.previewProducts[idx][field] = value;
      if (field === 'badge') {
        this.previewProducts[idx].badgeType = value === 'Shopee Mall' ? 'mall' : 'favorite';
      }
      this.renderImporterModalFooter();
    }
  }

  removePreviewProduct(idx) {
    window.soundFX && window.soundFX.playPop();
    this.previewProducts.splice(idx, 1);
    this.renderImporterModalContent();
  }

  addBlankPreviewProduct() {
    window.soundFX && window.soundFX.playPop();
    this.previewProducts.push({
      id: `preview_prod_${Date.now()}_${this.previewProducts.length}`,
      name: 'Món ăn vặt mới',
      shopeeUrl: 'https://shopee.vn',
      category: 'sweets_nuts',
      subTag: 'nuts',
      badge: 'Shopee Mall',
      badgeType: 'mall',
      price: '50.000đ',
      originalPrice: '65.000đ',
      discount: '-20%',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
      rating: '5.0',
      soldCount: 'Đã bán 10k+',
      soldCountRaw: 10000,
      commissionRate: 15.0
    });
    this.renderImporterModalContent();
  }

  updatePreviewShop(idx, field, value) {
    if (this.previewShops[idx]) {
      this.previewShops[idx][field] = value;
      if (field === 'badge') {
        this.previewShops[idx].badgeType = value === 'Shopee Mall' ? 'mall' : 'favorite';
      }
      this.renderImporterModalFooter();
    }
  }

  removePreviewShop(idx) {
    window.soundFX && window.soundFX.playPop();
    this.previewShops.splice(idx, 1);
    this.renderImporterModalContent();
  }

  addBlankPreviewShop() {
    window.soundFX && window.soundFX.playPop();
    this.previewShops.push({
      id: `preview_shop_${Date.now()}_${this.previewShops.length}`,
      name: 'Tiệm Ăn Vặt Mới',
      badge: 'Shopee Mall',
      badgeType: 'mall',
      avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80',
      rating: '4.9 ⭐',
      followers: '50k+ người theo dõi',
      highlight: 'Chuyên đặc sản và đồ ăn vặt đóng gói chất lượng cao',
      url: 'https://shopee.vn'
    });
    this.renderImporterModalContent();
  }

  // ── LƯU TẤT CẢ LÊN FIREBASE CLOUD FIRESTORE (foodtinder_quynhon/grocery_curated) ──
  async saveAllToFirebase() {
    window.soundFX && window.soundFX.playPop();

    const saveBtn = document.getElementById('importer-save-btn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<span>⏳ Đang lưu Firebase...</span>`;
    }

    try {
      if (this.importerTab === 'products') {
        if (!this.previewProducts || this.previewProducts.length === 0) return;

        const newItems = this.previewProducts.map((p, i) => ({
          id: `snack_custom_${Date.now()}_${i}`,
          name: p.name.trim() || 'Sản phẩm Shopee',
          category: p.category || 'sweets_nuts',
          subTag: p.subTag || 'nuts',
          badge: p.badge || 'Shopee Mall',
          badgeType: p.badge === 'Shopee Mall' ? 'mall' : 'favorite',
          rating: p.rating || '5.0',
          soldCount: p.soldCount || 'Đã bán 10k+',
          soldCountRaw: p.soldCountRaw || 10000,
          commissionRate: parseFloat(p.commissionRate) || 15.0,
          price: p.price || '65.000đ',
          originalPrice: p.originalPrice || '85.000đ',
          discount: p.discount || '-20%',
          image: p.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
          shopeeUrl: p.shopeeUrl || 'https://shopee.vn'
        }));

        // Chèn vào đầu danh sách
        window.GROCERY_ITEMS = [...newItems, ...(window.GROCERY_ITEMS || GROCERY_ITEMS)];
        this.previewProducts = [];
      } else {
        if (!this.previewShops || this.previewShops.length === 0) return;

        const newShops = this.previewShops.map((s, i) => ({
          id: `shop_custom_${Date.now()}_${i}`,
          name: s.name.trim() || 'Shop Ăn Vặt Shopee',
          badge: s.badge || 'Shopee Mall',
          badgeType: s.badge === 'Shopee Mall' ? 'mall' : 'favorite',
          avatar: s.avatar || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80',
          rating: s.rating || '4.9 ⭐',
          followers: s.followers || '100k+ người theo dõi',
          highlight: s.highlight || 'Đồ ăn vặt ngon & đặc sản uy tín',
          url: s.url || 'https://shopee.vn'
        }));

        window.SHOPEE_TOP_SHOPS = [...newShops, ...(window.SHOPEE_TOP_SHOPS || SHOPEE_TOP_SHOPS)];
        this.previewShops = [];
      }

      // Lưu LocalStorage dự phòng
      this.saveCustomLocalData();

      // Đồng bộ trực tiếp lên Cloud Firestore
      await this.syncToFirestore();

      // Render lại giao diện ngay tức thì
      this.renderMiddleView();
      this.renderRightSidebar();

      this.closeImporterModal();

      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast(`🎉 Đã lưu thành công lên Firebase & cập nhật giao diện!`);
      }
    } catch (err) {
      console.error('Lỗi khi lưu lên Firebase:', err);
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast(`Đã lưu cục bộ: ${err.message}`);
      }
      this.renderMiddleView();
      this.renderRightSidebar();
      this.closeImporterModal();
    }
  }

  // Render Footer của Modal
  renderImporterModalFooter() {
    const footerContainer = document.getElementById('importer-footer-container');
    if (!footerContainer) return;

    const count = this.importerTab === 'products' ? this.previewProducts.length : this.previewShops.length;
    const label = this.importerTab === 'products' ? 'sản phẩm' : 'shop ăn vặt';

    footerContainer.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
          count > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500'
        }">
          <span>${count > 0 ? '✅' : '⚪'}</span>
          <span>Đã sẵn sàng: <strong>${count} ${label}</strong></span>
        </span>
        <span class="text-[11px] text-stone-400 hidden sm:inline">• Lưu trực tiếp vào Cloud Firestore</span>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="window.groceryManager.closeImporterModal()"
          class="px-3.5 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-xs transition cursor-pointer">
          Đóng
        </button>
        <button id="importer-save-btn" onclick="window.groceryManager.saveAllToFirebase()"
          ${count === 0 ? 'disabled' : ''}
          class="px-5 py-2 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-orange-300 transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
          <span>💾 Lưu tất cả lên Firebase</span>
        </button>
      </div>
    `;
  }

  // Render toàn bộ giao diện Modal Admin Link Importer
  renderImporterModalContent() {
    const container = document.getElementById('grocery-importer-modal-content');
    if (!container) return;

    const isProducts = this.importerTab === 'products';
    const previewList = isProducts ? this.previewProducts : this.previewShops;

    container.innerHTML = `
      <!-- ════════ PHẦN ĐẦU (HEADER & TABS) ════════ -->
      <div class="bg-gradient-to-r from-[#EE4D2D] via-orange-500 to-rose-600 text-white p-4 sm:p-5 relative shrink-0">
        <button onclick="window.groceryManager.closeImporterModal()"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition text-sm cursor-pointer"
          title="Đóng popup">
          ✕
        </button>

        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
            📥
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-base sm:text-lg text-white leading-tight">Nạp Link Shopee (Admin Importer)</h3>
              <span class="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">Admin Tool</span>
            </div>
            <p class="text-xs text-orange-100 mt-0.5">Tự động tách tên từ URL, phân nhóm và bảng xem trước cho phép chỉnh sửa trước khi lưu Firestore</p>
          </div>
        </div>

        <!-- 2 Tab Chuyển Đổi: Nạp Sản Phẩm & Nạp Shop -->
        <div class="flex items-center gap-2 mt-4 pt-3 border-t border-white/20">
          <button onclick="window.groceryManager.setImporterTab('products')"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              isProducts
                ? 'bg-white text-[#EE4D2D] shadow-md ring-2 ring-white/60'
                : 'bg-black/15 text-white/90 hover:bg-black/25'
            }">
            <span>📦</span>
            <span>Nạp Sản Phẩm (Hàng loạt)</span>
            ${this.previewProducts.length > 0 ? `<span class="px-1.5 py-0.2 rounded-full bg-[#EE4D2D] text-white text-[9.5px]">${this.previewProducts.length}</span>` : ''}
          </button>

          <button onclick="window.groceryManager.setImporterTab('shops')"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              !isProducts
                ? 'bg-white text-[#EE4D2D] shadow-md ring-2 ring-white/60'
                : 'bg-black/15 text-white/90 hover:bg-black/25'
            }">
            <span>🏪</span>
            <span>Nạp Shop Ăn Vặt</span>
            ${this.previewShops.length > 0 ? `<span class="px-1.5 py-0.2 rounded-full bg-[#EE4D2D] text-white text-[9.5px]">${this.previewShops.length}</span>` : ''}
          </button>
        </div>
      </div>

      <!-- ════════ KHU VỰC NHẬP LIỆU (INPUT AREA) ════════ -->
      <div class="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 shrink-0 space-y-2.5">
        <div class="flex items-center justify-between">
          <label class="text-xs font-black text-stone-800 flex items-center gap-1.5">
            <span>🔗</span>
            <span>${isProducts ? 'Dán danh sách Link Sản Phẩm Shopee:' : 'Dán danh sách Link Shop Shopee:'}</span>
            <span class="text-[10.5px] text-stone-400 font-normal">(Mỗi dòng 1 link hoặc phân tách bằng khoảng trắng)</span>
          </label>
          <div class="flex items-center gap-2">
            <button onclick="window.groceryManager.fillSampleLinks()" class="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-0.5 rounded-lg transition cursor-pointer">
              📋 Thử link mẫu
            </button>
            <button onclick="window.groceryManager.clearImporterInput()" class="text-[11px] font-bold text-stone-400 hover:text-stone-700 transition cursor-pointer">
              🧹 Xoá
            </button>
          </div>
        </div>

        <textarea id="importer-links-input" rows="3"
          class="w-full rounded-2xl border border-stone-300 p-3 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent outline-none bg-white shadow-2xs resize-none"
          placeholder="${
            isProducts
              ? 'Dán một hoặc nhiều link sản phẩm Shopee tại đây...\nVí dụ:\nhttps://shopee.vn/Bap-rang-bo-khong-lo-Uncle-Jax-My-150g-i.48922114.7891234567\nhttps://shopee.vn/Hat-dieu-rang-muoi-A-Co-Binh-Phuoc-hop-500g-i.67891234.1234567890'
              : 'Dán một hoặc nhiều link Shop Shopee tại đây...\nVí dụ:\nhttps://shopee.vn/tiemanvatbebu\nhttps://shopee.vn/dac_san_xu_nau_thao_nguyen'
          }"></textarea>

        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] text-stone-500">
            💡 Tự động bóc tách slug tiêu đề tiếng Việt, tự chọn category theo từ khóa và tạo link preview.
          </span>
          <button onclick="window.groceryManager.parseInputLinks()"
            class="px-5 py-2.5 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-orange-300 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer shrink-0">
            <span>⚡</span>
            <span>Phân tích & Tự phân nhóm</span>
          </button>
        </div>
      </div>

      <!-- ════════ BẢNG XEM TRƯỚC & CHỈNH SỬA (PREVIEW TABLE) ════════ -->
      <div class="p-4 sm:p-5 overflow-y-auto flex-1 min-h-[220px] max-h-[44vh] space-y-3 bg-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-stone-800 uppercase tracking-wider">
              Bảng Xem Trước & Chỉnh Sửa (${previewList.length} mục)
            </span>
            <span class="text-[10px] text-stone-400">• Chỉnh sửa trực tiếp từng trường bên dưới</span>
          </div>
          <button onclick="${isProducts ? 'window.groceryManager.addBlankPreviewProduct()' : 'window.groceryManager.addBlankPreviewShop()'}"
            class="text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1">
            <span>+ Thêm dòng</span>
          </button>
        </div>

        ${previewList.length === 0 ? `
          <div class="py-12 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 space-y-2">
            <span class="text-4xl opacity-40">${isProducts ? '📦' : '🏪'}</span>
            <p class="text-xs font-bold text-stone-700">Chưa có liên kết nào được phân tích</p>
            <p class="text-[11px] max-w-sm">
              Hãy dán các link Shopee vào ô nhập bên trên rồi bấm nút <strong class="text-[#EE4D2D]">"Phân tích & Tự phân nhóm"</strong> hoặc bấm <strong class="text-amber-700">"Thử link mẫu"</strong> để xem thử nhé!
            </p>
          </div>
        ` : `
          <!-- Danh Sách Bảng Preview -->
          <div class="space-y-3">
            ${isProducts ? previewList.map((item, idx) => `
              <div class="p-3 bg-stone-50/80 hover:bg-orange-50/30 rounded-2xl border border-stone-200/90 transition space-y-2.5">
                <div class="flex items-start justify-between gap-3">
                  <!-- Ảnh đại diện -->
                  <div class="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-200 relative group">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                  </div>

                  <!-- Tên & Link Shopee -->
                  <div class="flex-1 min-w-0 space-y-1.5">
                    <div>
                      <label class="text-[10px] font-bold text-stone-400 uppercase">Tên hiển thị sản phẩm:</label>
                      <input type="text" value="${item.name}"
                        oninput="window.groceryManager.updatePreviewProduct(${idx}, 'name', this.value)"
                        class="w-full text-xs font-bold text-stone-900 border border-stone-300 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-[#EE4D2D] outline-none" />
                    </div>
                    <div class="flex items-center gap-2">
                      <input type="text" value="${item.image}"
                        oninput="window.groceryManager.updatePreviewProduct(${idx}, 'image', this.value)"
                        placeholder="Link ảnh URL..."
                        class="flex-1 text-[10.5px] text-stone-500 border border-stone-200 rounded-lg px-2 py-0.5 bg-white font-mono truncate" />
                      <a href="${item.shopeeUrl}" target="_blank" rel="noopener noreferrer"
                        class="text-[10.5px] text-[#EE4D2D] hover:underline font-bold shrink-0 flex items-center gap-0.5">
                        <span>Mở Link Shopee ↗</span>
                      </a>
                    </div>
                  </div>

                  <!-- Nút Xoá Dòng -->
                  <button onclick="window.groceryManager.removePreviewProduct(${idx})"
                    class="w-7 h-7 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 flex items-center justify-center transition text-xs cursor-pointer shrink-0"
                    title="Xoá dòng này">
                    ✕
                  </button>
                </div>

                <!-- Các Cột Chọn Dropdown & Giá -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-200/60 text-xs">
                  <div>
                    <label class="text-[9.5px] font-bold text-stone-400 uppercase block mb-0.5">Giá tham khảo:</label>
                    <input type="text" value="${item.price}"
                      oninput="window.groceryManager.updatePreviewProduct(${idx}, 'price', this.value)"
                      class="w-full text-xs font-extrabold text-rose-600 border border-stone-200 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-[#EE4D2D] outline-none" />
                  </div>

                  <div>
                    <label class="text-[9.5px] font-bold text-stone-400 uppercase block mb-0.5">Nhóm Cảm Xúc:</label>
                    <select onchange="window.groceryManager.updatePreviewProduct(${idx}, 'category', this.value)"
                      class="w-full text-xs font-bold text-stone-800 border border-stone-200 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-[#EE4D2D] outline-none">
                      ${GROCERY_NEEDS.filter(n => n.id !== 'all').map(n => `
                        <option value="${n.id}" ${n.id === item.category ? 'selected' : ''}>${n.emoji} ${n.label}</option>
                      `).join('')}
                    </select>
                  </div>

                  <div>
                    <label class="text-[9.5px] font-bold text-stone-400 uppercase block mb-0.5">Lọc Nhanh (Sub-Tag):</label>
                    <select onchange="window.groceryManager.updatePreviewProduct(${idx}, 'subTag', this.value)"
                      class="w-full text-xs font-bold text-stone-800 border border-stone-200 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-[#EE4D2D] outline-none">
                      ${GROCERY_SUB_TAGS.filter(t => t.id !== 'all').map(t => `
                        <option value="${t.id}" ${t.id === item.subTag ? 'selected' : ''}>${t.emoji} ${t.label}</option>
                      `).join('')}
                    </select>
                  </div>

                  <div>
                    <label class="text-[9.5px] font-bold text-stone-400 uppercase block mb-0.5">Huy Hiệu Shopee:</label>
                    <select onchange="window.groceryManager.updatePreviewProduct(${idx}, 'badge', this.value)"
                      class="w-full text-xs font-bold text-stone-800 border border-stone-200 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-[#EE4D2D] outline-none">
                      <option value="Shopee Mall" ${item.badge === 'Shopee Mall' ? 'selected' : ''}>Shopee Mall</option>
                      <option value="Yêu thích+" ${item.badge === 'Yêu thích+' ? 'selected' : ''}>Yêu thích+</option>
                    </select>
                  </div>
                </div>
              </div>
            `).join('') : previewList.map((shop, idx) => `
              <div class="p-3 bg-stone-50/80 hover:bg-orange-50/30 rounded-2xl border border-stone-200/90 transition space-y-2.5">
                <div class="flex items-start justify-between gap-3">
                  <!-- Avatar -->
                  <div class="w-12 h-12 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
                    <img src="${shop.avatar}" alt="${shop.name}" class="w-full h-full object-cover" />
                  </div>

                  <!-- Tên & Thông tin Shop -->
                  <div class="flex-1 min-w-0 space-y-1.5">
                    <div>
                      <label class="text-[10px] font-bold text-stone-400 uppercase">Tên Shop:</label>
                      <input type="text" value="${shop.name}"
                        oninput="window.groceryManager.updatePreviewShop(${idx}, 'name', this.value)"
                        class="w-full text-xs font-bold text-stone-900 border border-stone-300 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-[#EE4D2D] outline-none" />
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-stone-400 uppercase">Link Shop URL:</label>
                      <input type="text" value="${shop.url}"
                        oninput="window.groceryManager.updatePreviewShop(${idx}, 'url', this.value)"
                        class="w-full text-[11px] font-mono text-stone-600 border border-stone-200 rounded-lg px-2 py-0.5 bg-white truncate" />
                    </div>
                  </div>

                  <button onclick="window.groceryManager.removePreviewShop(${idx})"
                    class="w-7 h-7 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 flex items-center justify-center transition text-xs cursor-pointer shrink-0"
                    title="Xoá shop này">
                    ✕
                  </button>
                </div>

                <!-- Thống kê & Nổi bật -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-stone-200/60 text-xs">
                  <div>
                    <label class="text-[9.5px] font-bold text-stone-400 uppercase block mb-0.5">Huy hiệu:</label>
                    <select onchange="window.groceryManager.updatePreviewShop(${idx}, 'badge', this.value)"
                      class="w-full text-xs font-bold text-stone-800 border border-stone-200 rounded-lg px-2 py-1 bg-white">
                      <option value="Shopee Mall" ${shop.badge === 'Shopee Mall' ? 'selected' : ''}>Shopee Mall</option>
                      <option value="Yêu thích+" ${shop.badge === 'Yêu thích+' ? 'selected' : ''}>Yêu thích+</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[9.5px] font-bold text-stone-400 uppercase block mb-0.5">Đánh giá & Người theo dõi:</label>
                    <input type="text" value="${shop.followers}"
                      oninput="window.groceryManager.updatePreviewShop(${idx}, 'followers', this.value)"
                      class="w-full text-xs text-stone-700 border border-stone-200 rounded-lg px-2 py-1 bg-white" />
                  </div>
                  <div>
                    <label class="text-[9.5px] font-bold text-stone-400 uppercase block mb-0.5">Đặc trưng nổi bật:</label>
                    <input type="text" value="${shop.highlight}"
                      oninput="window.groceryManager.updatePreviewShop(${idx}, 'highlight', this.value)"
                      class="w-full text-xs text-stone-700 border border-stone-200 rounded-lg px-2 py-1 bg-white" />
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- ════════ THANH HÀNH ĐỘNG DƯỚI CÙNG (FOOTER) ════════ -->
      <div id="importer-footer-container" class="p-3.5 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
        <!-- Rendered by renderImporterModalFooter() -->
      </div>
    `;

    this.renderImporterModalFooter();
  }

  // ── 1. CỘT TRÁI: NHU CẦU ĂN VẶT & HỎI AI 🤖 (KÈM NÚT NẠP LINK SHOPEE) ──
  renderNeedsSelector() {
    const container = document.getElementById('mood-selector-container');
    if (!container) return;

    const isTet = this.isTetSeason();

    container.innerHTML = `
      <div class="flex items-center justify-between mb-2.5 px-0.5">
        <div class="flex items-center gap-1.5">
          <span class="text-xs">🍿</span>
          <span class="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider">Cảm xúc ăn vặt</span>
        </div>
        <div class="flex items-center gap-1">
          <button onclick="window.groceryManager.openImporterModal('products')"
            class="text-[10px] font-extrabold text-[#EE4D2D] hover:text-orange-700 flex items-center gap-1 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 px-2 py-0.5 rounded-full transition shadow-xs cursor-pointer"
            title="Nạp Link Shopee (Admin Importer)">
            <span>📥 Nạp Link</span>
          </button>
          <button onclick="window.groceryManager.askAI()"
            class="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full transition shadow-xs cursor-pointer"
            title="Hỏi AI gợi ý đồ ăn vặt Shopee chuẩn gu">
            <span>Hỏi AI</span> <span>🤖</span>
          </button>
        </div>
      </div>

      <!-- Need Selector List -->
      <div class="space-y-1.5">
        ${GROCERY_NEEDS.map(n => {
          const isSelected = n.id === this.currentNeedFilter;
          const showTetBadge = n.isSeasonalTet && isTet;

          return `
            <button onclick="window.groceryManager.setNeed('${n.id}')"
              class="w-full text-left flex items-center gap-2.5 p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'bg-amber-50 border-amber-300 shadow-xs ring-1 ring-amber-400/40' 
                  : 'bg-white border-stone-200/80 hover:bg-stone-50'
              }">
              <span class="text-lg shrink-0">${n.emoji}</span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-xs font-bold ${isSelected ? 'text-amber-950 font-black' : 'text-stone-800'} truncate">${n.label}</span>
                  ${showTetBadge ? `
                    <span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[8.5px] font-black uppercase tracking-tight shadow-xs animate-pulse">
                      🧧 Sắm Tết
                    </span>
                  ` : ''}
                </div>
                <div class="text-[10px] text-stone-400 truncate mt-0.5">${n.desc}</div>
              </div>
              ${isSelected ? `<span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  // ── 2. CỘT GIỮA: KỆ GỢI Ý ĐỒ ĂN VẶT SHOPEE (SUB-TAGS & 30% SORT:5 + 70% SORT:2) ──
  renderMiddleView() {
    const container = document.getElementById('grocery-content-container');
    if (!container) return;

    let filteredCombos = (window.GROCERY_COMBOS || GROCERY_COMBOS);
    if (this.currentNeedFilter !== 'all') {
      filteredCombos = filteredCombos.filter(c => c.category === this.currentNeedFilter);
    }
    if (this.currentSubTag !== 'all') {
      filteredCombos = filteredCombos.filter(c => c.subTag === this.currentSubTag);
    }

    let baseItems = (window.GROCERY_ITEMS || GROCERY_ITEMS);
    if (this.currentNeedFilter !== 'all') {
      baseItems = baseItems.filter(i => i.category === this.currentNeedFilter);
    }
    if (this.currentSubTag !== 'all') {
      baseItems = baseItems.filter(i => i.subTag === this.currentSubTag);
    }

    const rankedItems = this.rankAffiliateItems(baseItems);

    const activeNeedObj = GROCERY_NEEDS.find(n => n.id === this.currentNeedFilter) || GROCERY_NEEDS[0];
    const activeSubTagObj = GROCERY_SUB_TAGS.find(t => t.id === this.currentSubTag) || GROCERY_SUB_TAGS[0];

    container.innerHTML = `
      <!-- Welcome Snack Banner (Shopee Vouchers thông minh, không lo hết hạn) -->
      <div class="rounded-3xl bg-gradient-to-r from-orange-500 via-[#EE4D2D] to-rose-600 p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute -right-6 -bottom-8 text-8xl opacity-15 pointer-events-none select-none">🍿</div>
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10.5px] font-black uppercase tracking-wider mb-2.5 backdrop-blur-xs">
            <span>✨ Shopee Food & Snack Picks</span>
            <span>•</span>
            <span>Gợi Ý Theo Cảm Xúc</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black leading-tight">Thiên Đường Đồ Ăn Vặt & Bánh Mứt Shopee</h2>
          <p class="text-xs sm:text-sm text-white/95 mt-1 leading-relaxed">
            Chọn món ăn vặt theo tâm trạng hôm nay từ các <strong>Shop Yêu Thích+</strong> & <strong>Shopee Mall</strong> uy tín nhất với hàng chục ngàn lượt mua.
          </p>

          <!-- Banner Voucher Shopee Thông Minh & Nút Nạp Link -->
          <div class="mt-4 flex items-center gap-2.5 flex-wrap">
            <a href="https://shopee.vn/m/ma-giam-gia" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center gap-2 bg-white text-[#EE4D2D] hover:bg-orange-50 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition active:scale-98 cursor-pointer">
              <span class="text-base">🎟️</span>
              <span>Lấy mã Freeship & Voucher Shopee hôm nay tại đây</span>
              <span class="text-xs">↗</span>
            </a>
            <button onclick="window.groceryManager.openImporterModal('products')"
              class="inline-flex items-center gap-1.5 bg-black/25 hover:bg-black/40 text-white px-3 py-2 rounded-2xl font-bold text-xs backdrop-blur-xs transition active:scale-95 cursor-pointer border border-white/20">
              <span>📥</span>
              <span>Nạp link sản phẩm</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ════════ THANH LỌC NHANH (SUB-TAGS) Ở ĐẦU CỘT GIỮA ════════ -->
      <div class="bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div class="flex items-center gap-2">
          <span class="text-sm">⚡</span>
          <span class="text-xs font-black text-stone-800 uppercase tracking-wider">Lọc nhanh:</span>
          <span class="text-[10px] text-stone-400 hidden sm:inline">• Bấm để lọc sâu không cần gõ tìm kiếm</span>
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          ${GROCERY_SUB_TAGS.map(tag => {
            const isSelected = this.currentSubTag === tag.id;
            return `
              <button onclick="window.groceryManager.setSubTag('${tag.id}')"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-2xs ${
                  isSelected
                    ? 'bg-[#EE4D2D] text-white shadow-orange-300 ring-2 ring-[#EE4D2D]/30'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }">
                <span>${tag.emoji}</span>
                <span>${tag.label}</span>
              </button>
            `;
          }).join('')}

          <button onclick="window.groceryManager.openImporterModal('products')"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-orange-50 hover:bg-orange-100 text-[#EE4D2D] border border-orange-200 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-2xs"
            title="Nạp Link Sản Phẩm / Shop hàng loạt">
            <span>📥 Nạp Link</span>
          </button>
        </div>
      </div>

      <!-- ════════ KHU VỰC 1: SET ĂN VẶT SHOPEE HOT TREND (LƯỚI 3 CỘT) ════════ -->
      ${filteredCombos.length > 0 ? `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
                <span>🎯 Set Ăn Vặt Hot Trend Shopee</span>
                <span class="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full uppercase">Tiết kiệm 25%</span>
              </h3>
              <p class="text-xs text-stone-500 mt-0.5">Tuyển tập combo món ăn vặt bán chạy nhất, mở link Shopee chốt đơn ngay</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${filteredCombos.map(combo => {
              const isSaved = this.isWishlisted(combo.id);
              return `
                <div class="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div class="relative h-40 w-full overflow-hidden bg-stone-100">
                    <img src="${combo.image}" alt="${combo.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    
                    <span class="absolute top-2.5 left-2.5 ${combo.badgeType === 'mall' ? 'bg-[#EE4D2D]' : 'bg-[#F53D2D]'} text-white text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      ${combo.badge}
                    </span>

                    <span class="absolute top-2.5 right-11 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                      ${combo.discount}
                    </span>

                    <button onclick="window.groceryManager.toggleWishlist(${JSON.stringify(combo).replace(/"/g, '&quot;')})"
                      class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 flex items-center justify-center absolute top-2 right-2 shadow-xs transition active:scale-90 cursor-pointer"
                      title="${isSaved ? 'Bỏ lưu' : 'Lưu để mua sau'}">
                      <span class="${isSaved ? 'text-rose-500 text-sm' : 'text-stone-400 text-xs'}">${isSaved ? '❤️' : '🤍'}</span>
                    </button>

                    <div class="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <span class="text-amber-400">⭐ ${combo.rating}</span>
                      <span>•</span>
                      <span>${combo.soldCount}</span>
                    </div>
                  </div>

                  <div class="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 class="font-black text-xs sm:text-sm text-stone-900 group-hover:text-[#EE4D2D] transition leading-snug">
                        ${combo.name}
                      </h4>
                      <p class="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        ${combo.desc}
                      </p>
                    </div>

                    <div class="pt-2.5 border-t border-stone-100 flex flex-col gap-2">
                      <div class="flex items-baseline justify-between">
                        <div class="flex items-baseline gap-1.5">
                          <span class="font-black text-sm sm:text-base text-rose-600">${combo.price}</span>
                          <span class="text-[10px] text-stone-400 line-through">${combo.originalPrice}</span>
                        </div>
                        <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">Tiết kiệm ${combo.discount || '20%'}</span>
                      </div>
                      <a href="${combo.shopeeUrl}" target="_blank" rel="noopener noreferrer"
                        class="w-full py-2 px-3 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer">
                        <span>Mua trên Shopee</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- ════════ KHU VỰC 2: KỆ ĂN VẶT & MÓN NGON SHOPEE (3 CỘT THOÁNG) ════════ -->
      <div class="space-y-3 pt-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <span>🧺 Kệ Ăn Vặt & Bánh Mứt Shopee</span>
              <span class="text-xs text-stone-400 font-semibold">(${rankedItems.length} món gợi ý)</span>
            </h3>
            <p class="text-xs text-stone-500 mt-0.5">
              Đang lọc: <strong class="text-amber-700">${activeNeedObj.label}</strong>
              ${this.currentSubTag !== 'all' ? ` • Nhóm: <strong class="text-[#EE4D2D]">${activeSubTagObj.label}</strong>` : ''}
            </p>
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            ${GROCERY_NEEDS.map(n => `
              <button onclick="window.groceryManager.setNeed('${n.id}')"
                class="px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition cursor-pointer ${
                  n.id === this.currentNeedFilter 
                    ? 'bg-stone-900 text-white shadow-xs' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }">
                ${n.emoji} ${n.label}
              </button>
            `).join('')}
          </div>
        </div>

        ${rankedItems.length === 0 ? `
          <div class="py-12 bg-white rounded-2xl border border-dashed border-stone-300 text-center space-y-2 p-6">
            <span class="text-4xl">🥜</span>
            <h4 class="font-extrabold text-sm text-stone-800">Không tìm thấy món ăn vặt phù hợp</h4>
            <p class="text-xs text-stone-500 max-w-sm mx-auto">Hãy thử chọn lại "Tất cả" trên thanh lọc nhanh hoặc bấm "Nạp link" để thêm món mới nhé!</p>
            <div class="pt-2 flex items-center justify-center gap-2">
              <button onclick="window.groceryManager.setSubTag('all')" class="px-4 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-bold transition cursor-pointer">
                Xem tất cả
              </button>
              <button onclick="window.groceryManager.openImporterModal('products')" class="px-4 py-1.5 bg-[#EE4D2D] text-white rounded-xl text-xs font-bold transition cursor-pointer">
                📥 Nạp thêm món
              </button>
            </div>
          </div>
        ` : `
          <div class="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            ${rankedItems.map(item => {
              const isSaved = this.isWishlisted(item.id);
              return `
                <div class="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all p-2.5 sm:p-3 flex flex-col justify-between group">
                  <div class="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    
                    <span class="absolute top-2 left-2 ${item.badgeType === 'mall' ? 'bg-[#EE4D2D]' : 'bg-[#F53D2D]'} text-white text-[9.5px] font-black px-2 py-0.5 rounded shadow-xs tracking-tight">
                      ${item.badge}
                    </span>

                    <button onclick="window.groceryManager.toggleWishlist(${JSON.stringify(item).replace(/"/g, '&quot;')})"
                      class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 flex items-center justify-center absolute top-2 right-2 shadow-xs transition active:scale-90 cursor-pointer"
                      title="${isSaved ? 'Bỏ lưu' : 'Lưu để mua sau'}">
                      <span class="${isSaved ? 'text-rose-500 text-sm' : 'text-stone-400 text-xs'}">${isSaved ? '❤️' : '🤍'}</span>
                    </button>

                    <div class="absolute bottom-2 left-2 bg-black/65 text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <span class="text-amber-400">⭐ ${item.rating}</span>
                      <span>•</span>
                      <span>${item.soldCount}</span>
                    </div>

                    ${item.discount ? `
                      <span class="absolute top-2.5 right-10 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                        ${item.discount}
                      </span>
                    ` : ''}
                  </div>

                  <div class="flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h5 class="font-extrabold text-xs sm:text-[13px] text-stone-900 leading-snug line-clamp-2 group-hover:text-[#EE4D2D] transition">
                        ${item.name}
                      </h5>
                    </div>

                    <div class="pt-2 border-t border-stone-100 flex flex-col gap-2">
                      <div class="flex items-baseline justify-between">
                        <div class="flex items-baseline gap-1.5">
                          <span class="font-black text-sm sm:text-base text-rose-600">${item.price}</span>
                          ${item.originalPrice ? `<span class="text-[10px] text-stone-400 line-through">${item.originalPrice}</span>` : ''}
                        </div>
                        <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">Freeship Xtra</span>
                      </div>
                      <a href="${item.shopeeUrl}" target="_blank" rel="noopener noreferrer"
                        class="w-full py-2 px-3 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer">
                        <span>Mua trên Shopee</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ── 3. CỘT PHẢI: ❤️ ĐÃ LƯU ĐỂ MUA SAU (WISHLIST) & 🏪 TOP SHOP UY TÍN TRÊN SHOPEE ──
  renderRightSidebar() {
    const container = document.getElementById('grocery-cart-sidebar');
    if (!container) return;

    const shopsList = window.SHOPEE_TOP_SHOPS || SHOPEE_TOP_SHOPS;

    container.innerHTML = `
      <!-- ════════ KHỐI 1: ĐÃ LƯU ĐỂ MUA SAU (WISHLIST) ════════ -->
      <div class="flex-1 flex flex-col min-h-0 border-b border-stone-200">
        <div class="p-3.5 border-b border-stone-100 flex items-center justify-between shrink-0 bg-stone-50/70">
          <div class="flex items-center gap-2">
            <span class="text-base text-rose-500">❤️</span>
            <div>
              <h4 class="font-black text-xs text-stone-900">Đã lưu để mua sau</h4>
              <p class="text-[9.5px] text-stone-400 font-medium">Bấm tim trên thẻ món để lưu lại</p>
            </div>
          </div>
          ${this.wishlist.length > 0 ? `
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
                ${this.wishlist.length} món
              </span>
              <button onclick="window.groceryManager.clearWishlist()" class="text-[10px] text-stone-400 hover:text-rose-500 font-bold transition cursor-pointer" title="Xoá tất cả món đã lưu">
                Xoá
              </button>
            </div>
          ` : ''}
        </div>

        <div class="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
          ${this.wishlist.length === 0 ? `
            <div class="py-8 flex flex-col items-center justify-center text-center px-4 space-y-2 text-stone-400">
              <span class="text-3xl opacity-35">🤍</span>
              <p class="text-xs font-bold text-stone-600">Chưa có món nào được lưu</p>
              <p class="text-[10px] leading-relaxed max-w-[200px]">
                Lướt thấy món ăn vặt ngon, bấm biểu tượng trái tim ❤️ trên ảnh để gom lại đây và ghé mua sau nhé!
              </p>
            </div>
          ` : this.wishlist.map(item => `
            <div class="flex items-center gap-2 p-2 bg-stone-50/90 hover:bg-orange-50/50 rounded-xl border border-stone-200/80 transition">
              <div class="w-11 h-11 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <h6 class="font-bold text-[11px] text-stone-900 truncate leading-tight">${item.name}</h6>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-[11px] font-black text-rose-600">${item.price}</span>
                  <a href="${item.shopeeUrl}" target="_blank" rel="noopener noreferrer"
                    class="text-[9.5px] font-extrabold text-[#EE4D2D] hover:underline flex items-center gap-0.5">
                    <span>Mua ↗</span>
                  </a>
                </div>
              </div>
              <button onclick="window.groceryManager.removeFromWishlist('${item.id}')"
                class="w-5 h-5 rounded flex items-center justify-center text-stone-300 hover:text-rose-500 text-xs transition cursor-pointer"
                title="Bỏ lưu">
                ✕
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ════════ KHỐI 2: TOP SHOP ĂN VẶT UY TÍN TRÊN SHOPEE (CÓ NÚT + NẠP SHOP) ════════ -->
      <div class="shrink-0 p-3.5 bg-gradient-to-b from-stone-50/50 to-orange-50/40 space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="text-sm">⭐</span>
            <h4 class="font-black text-xs text-stone-900">Top Shop Ăn Vặt Shopee</h4>
          </div>
          <button onclick="window.groceryManager.openImporterModal('shops')"
            class="text-[9.5px] font-extrabold text-[#EE4D2D] hover:underline flex items-center gap-0.5 cursor-pointer"
            title="Nạp thêm shop mới">
            <span>+ Nạp Shop</span>
          </button>
        </div>

        <div class="space-y-2">
          ${shopsList.map(shop => `
            <div class="p-2.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition space-y-1.5">
              <div class="flex items-center justify-between gap-1.5">
                <div class="flex items-center gap-2 min-w-0">
                  <img src="${shop.avatar}" alt="${shop.name}" class="w-7 h-7 rounded-full object-cover shrink-0 border border-stone-100" />
                  <div class="min-w-0">
                    <div class="flex items-center gap-1">
                      <span class="font-extrabold text-[11px] text-stone-900 truncate">${shop.name}</span>
                      <span class="${shop.badgeType === 'mall' ? 'bg-[#EE4D2D]' : 'bg-[#F53D2D]'} text-white text-[7.5px] font-black px-1 rounded-2xs shrink-0">
                        ${shop.badge}
                      </span>
                    </div>
                    <div class="text-[9.5px] text-stone-400 font-medium">
                      <span>${shop.rating}</span> • <span>${shop.followers}</span>
                    </div>
                  </div>
                </div>
                <a href="${shop.url}" target="_blank" rel="noopener noreferrer"
                  class="px-2 py-1 bg-orange-50 hover:bg-[#EE4D2D] text-[#EE4D2D] hover:text-white rounded-lg text-[9.5px] font-black transition shrink-0">
                  Ghé Shop ↗
                </a>
              </div>
              <p class="text-[9.5px] text-stone-500 line-clamp-1 italic">
                ${shop.highlight}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.updateWishlistBadge();
  }

  // ── HỎI AI GỢI Ý MÓN ĂN VẶT & BÁNH MỨT SHOPEE ──
  askAI() {
    window.soundFX && window.soundFX.playPop();
    if (typeof window.switchTab === 'function') {
      window.switchTab('chat');
    } else if (window.app && typeof window.app.switchTab === 'function') {
      window.app.switchTab('chat');
    }

    if (window.chatManager) {
      window.chatManager.selectChatTarget('ai');
      window.chatManager.handleUserSubmit('Gợi ý cho mình các loại hạt dinh dưỡng, bánh mứt Tết và món ăn vặt Shopee hot trend ngon nhất với AI ơi!');
    }
  }

  // ── KIẾN TRÚC DỮ LIỆU CLOUD FIRESTORE (foodtinder_quynhon/grocery_curated - 1 READ DUY NHẤT) ──
  async fetchFromFirestore() {
    try {
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        const doc = await firebase.firestore().collection('foodtinder_quynhon').doc('grocery_curated').get();
        if (doc && doc.exists) {
          const data = doc.data();
          if (data) {
            this.applyRemoteData(data);
            console.log('🛒 [Shopee Snacks Firestore] Đã nạp thành công grocery_curated (1 Read Firestore)!');
            return true;
          }
        }
      }
    } catch (err) {
      console.warn('🛒 [Shopee Snacks Firestore] Sử dụng dữ liệu curated tích hợp sẵn:', err.message);
    }
    return false;
  }

  async syncToFirestore() {
    try {
      const payload = {
        combos: window.GROCERY_COMBOS || GROCERY_COMBOS,
        items: window.GROCERY_ITEMS || GROCERY_ITEMS,
        topShops: window.SHOPEE_TOP_SHOPS || SHOPEE_TOP_SHOPS,
        updatedAt: new Date().toISOString()
      };
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        await firebase.firestore().collection('foodtinder_quynhon').doc('grocery_curated').set(payload, { merge: true });
        console.log('🛒 [Shopee Snacks Firestore] Đã đồng bộ grocery_curated lên Cloud Firestore!');
        return true;
      }
    } catch (err) {
      console.warn('🛒 [Shopee Snacks Firestore Sync Error]:', err.message);
    }
    return false;
  }

  applyRemoteData(data) {
    let hasChanges = false;
    if (Array.isArray(data.combos) && data.combos.length > 0) {
      window.GROCERY_COMBOS = data.combos;
      hasChanges = true;
    }
    if (Array.isArray(data.items) && data.items.length > 0) {
      window.GROCERY_ITEMS = data.items;
      hasChanges = true;
    }
    if (Array.isArray(data.topShops) && data.topShops.length > 0) {
      window.SHOPEE_TOP_SHOPS = data.topShops;
      hasChanges = true;
    }
    if (hasChanges) {
      this.renderMiddleView();
      this.renderRightSidebar();
    }
  }
}

// Khởi tạo GroceryManager toàn cục
if (typeof window !== 'undefined') {
  window.GROCERY_NEEDS = GROCERY_NEEDS;
  window.GROCERY_SUB_TAGS = GROCERY_SUB_TAGS;
  window.GROCERY_COMBOS = GROCERY_COMBOS;
  window.GROCERY_ITEMS = GROCERY_ITEMS;
  window.SHOPEE_TOP_SHOPS = SHOPEE_TOP_SHOPS;
  window.GroceryManager = GroceryManager;
  window.groceryManager = new GroceryManager();
}
