// ══════════════════════════════════════════════════════════════════════
// FOODTINDER - KỆ GỢI Ý ĐỒ ĂN VẶT SHOPEE THEO CẢM XÚC (3 CỘT AFFILIATE)
// Mô hình: Gợi ý theo ngữ cảnh tâm trạng -> Tín hiệu chốt đơn Shopee Mall / Yêu thích+
// Thuật toán: 30% Hoa hồng cao nhất (sortType: 5) + 70% Bán chạy nhất (sortType: 2)
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
    image: 'https://images.unsplash.com/photo-1543157148-f819d16ae75b?auto=format&fit=crop&w=500&q=80',
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
// Gắn sẵn các chỉ số Affiliate: commissionRate (cho sortType: 5) & soldCountRaw (cho sortType: 2)
const GROCERY_ITEMS = [
  // 🥜 BÁNH MỨT & HẠT NGON (MỚI THAY THẾ CHO GIẢI NHIỆT / TRÀ CHIỀU)
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
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
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
    this.wishlist = []; // Danh sách món đã lưu: [{ id, name, price, image, shopeeUrl, badge, badgeType, rating, soldCount }]
    this.loadWishlist();
  }

  init() {
    this.loadWishlist();
    this.renderNeedsSelector();
    this.renderMiddleView();
    this.renderRightSidebar();
    this.fetchFromFirestore();
  }

  // ── KIỂM TRA NHÃN THEO MÙA (TỪ GIỮA THÁNG 12 ĐẾN HẾT THÁNG 1 ÂM LỊCH) ──
  isTetSeason() {
    // Cho phép force kiểm tra qua URL (?season=tet) hoặc cờ toàn cục window.FORCE_TET_SEASON
    if (typeof window !== 'undefined') {
      if (window.FORCE_TET_SEASON === true) return true;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('season') === 'tet') return true;
      } catch (e) {}
    }

    try {
      const now = new Date();
      // Chuẩn hóa tính lịch âm Việt Nam/Á Đông qua Intl API
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
      // Từ giữa tháng 12 (ngày 15 tháng Chạp) đến hết tháng 1 âm lịch (tháng Giêng)
      if (lunarMonth === 12 && lunarDay >= 15) return true;
      if (lunarMonth === 1) return true;
    } catch (err) {
      // Fallback lịch dương tương đương nếu trình duyệt không hỗ trợ u-ca-chinese
      const now = new Date();
      const m = now.getMonth() + 1; // 1 - 12
      const d = now.getDate();
      if ((m === 1 && d >= 10) || m === 2 || (m === 3 && d <= 5)) {
        return true;
      }
    }
    return false;
  }

  // ── THUẬT TOÁN ƯU TIÊN AFFILIATE: 30% HOA HỒNG CAO NHẤT (sortType: 5) + 70% BÁN CHẠY NHẤT (sortType: 2) ──
  rankAffiliateItems(items) {
    if (!items || items.length <= 1) return items;

    // Nhân bản mảng để không làm đột biến dữ liệu gốc
    const pool = [...items];

    // 1. Tính toán số lượng 30% sản phẩm đầu tiên (tối thiểu 1 sản phẩm)
    const topCount = Math.max(1, Math.round(pool.length * 0.3));

    // 2. Sắp xếp toàn bộ theo Hoa hồng cao nhất (sortType: 5)
    pool.sort((a, b) => (b.commissionRate || 0) - (a.commissionRate || 0));

    // Lấy 30% sản phẩm hoa hồng cao nhất
    const highCommissionItems = pool.slice(0, topCount).map(item => ({
      ...item,
      sortType: 5,
      affiliateTag: '⚡ Hoa hồng cao'
    }));

    // 3. 70% còn lại sắp xếp theo Bán chạy nhất (sortType: 2, soldCountRaw giảm dần)
    const remainingItems = pool.slice(topCount);
    remainingItems.sort((a, b) => (b.soldCountRaw || 0) - (a.soldCountRaw || 0));
    const bestSellerItems = remainingItems.map(item => ({
      ...item,
      sortType: 2,
      affiliateTag: '🔥 Bán chạy'
    }));

    // Kết hợp theo thứ tự ưu tiên chuẩn
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

  // ── 1. CỘT TRÁI: NHU CẦU ĂN VẶT & HỎI AI 🤖 (KÈM NHÃN THEO MÙA 🧧 SẮM TẾT) ──
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
        <button onclick="window.groceryManager.askAI()" class="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full transition shadow-xs" title="Hỏi AI gợi ý đồ ăn vặt Shopee chuẩn gu">
          <span>Hỏi AI</span> <span>🤖</span>
        </button>
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

    // 1. Lọc combos theo need và sub-tag
    let filteredCombos = (window.GROCERY_COMBOS || GROCERY_COMBOS);
    if (this.currentNeedFilter !== 'all') {
      filteredCombos = filteredCombos.filter(c => c.category === this.currentNeedFilter);
    }
    if (this.currentSubTag !== 'all') {
      filteredCombos = filteredCombos.filter(c => c.subTag === this.currentSubTag);
    }

    // 2. Lọc items theo need và sub-tag
    let baseItems = (window.GROCERY_ITEMS || GROCERY_ITEMS);
    if (this.currentNeedFilter !== 'all') {
      baseItems = baseItems.filter(i => i.category === this.currentNeedFilter);
    }
    if (this.currentSubTag !== 'all') {
      baseItems = baseItems.filter(i => i.subTag === this.currentSubTag);
    }

    // 3. Áp dụng thuật toán ưu tiên Affiliate: 30% sortType: 5 (Hoa hồng cao) + 70% sortType: 2 (Bán chạy nhất)
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

          <!-- Banner Voucher Shopee Thông Minh (Không lo mã hết hạn) -->
          <div class="mt-4 flex items-center gap-2.5 flex-wrap">
            <a href="https://shopee.vn/m/ma-giam-gia" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center gap-2 bg-white text-[#EE4D2D] hover:bg-orange-50 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition active:scale-98 cursor-pointer">
              <span class="text-base">🎟️</span>
              <span>Lấy mã Freeship & Voucher Shopee hôm nay tại đây</span>
              <span class="text-xs">↗</span>
            </a>
            <span class="text-[10.5px] text-white/80 font-medium">
              💡 Bấm lấy mã trước để tự động áp dụng khi thanh toán trên Shopee
            </span>
          </div>
        </div>
      </div>

      <!-- ════════ THANH LỌC NHANH (SUB-TAGS) Ở ĐẦU CỘT GIỮA (REQUIREMENT 2) ════════ -->
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

          <!-- Horizontal Combo Cards Slider (3 Cột thoáng) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${filteredCombos.map(combo => {
              const isSaved = this.isWishlisted(combo.id);
              return `
                <div class="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <!-- Top Image & Badges -->
                  <div class="relative h-40 w-full overflow-hidden bg-stone-100">
                    <img src="${combo.image}" alt="${combo.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    
                    <!-- Shopee Badge: Mall / Yêu thích+ -->
                    <span class="absolute top-2.5 left-2.5 ${combo.badgeType === 'mall' ? 'bg-[#EE4D2D]' : 'bg-[#F53D2D]'} text-white text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      ${combo.badge}
                    </span>

                    <!-- Discount Pill -->
                    <span class="absolute top-2.5 right-11 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                      ${combo.discount}
                    </span>

                    <!-- Wishlist Heart Button -->
                    <button onclick="window.groceryManager.toggleWishlist(${JSON.stringify(combo).replace(/"/g, '&quot;')})"
                      class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 flex items-center justify-center absolute top-2 right-2 shadow-xs transition active:scale-90 cursor-pointer"
                      title="${isSaved ? 'Bỏ lưu' : 'Lưu để mua sau'}">
                      <span class="${isSaved ? 'text-rose-500 text-sm' : 'text-stone-400 text-xs'}">${isSaved ? '❤️' : '🤍'}</span>
                    </button>

                    <!-- Sold Count Banner on image bottom -->
                    <div class="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <span class="text-amber-400">⭐ ${combo.rating}</span>
                      <span>•</span>
                      <span>${combo.soldCount}</span>
                    </div>
                  </div>

                  <!-- Body Info -->
                  <div class="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 class="font-black text-xs sm:text-sm text-stone-900 group-hover:text-[#EE4D2D] transition leading-snug">
                        ${combo.name}
                      </h4>
                      <p class="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        ${combo.desc}
                      </p>
                    </div>

                    <div class="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div>
                        <div class="flex items-baseline gap-1.5">
                          <span class="font-black text-sm sm:text-base text-rose-600">${combo.price}</span>
                          <span class="text-[10px] text-stone-400 line-through">${combo.originalPrice}</span>
                        </div>
                      </div>
                      <a href="${combo.shopeeUrl}" target="_blank" rel="noopener noreferrer"
                        class="px-3.5 py-2 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer">
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

        <!-- Empty State nếu không có món nào khớp subTag -->
        ${rankedItems.length === 0 ? `
          <div class="py-12 bg-white rounded-2xl border border-dashed border-stone-300 text-center space-y-2 p-6">
            <span class="text-4xl">🥜</span>
            <h4 class="font-extrabold text-sm text-stone-800">Không tìm thấy món ăn vặt phù hợp</h4>
            <p class="text-xs text-stone-500 max-w-sm mx-auto">Hãy thử chọn lại "Tất cả" trên thanh lọc nhanh để xem toàn bộ món ngon nhé!</p>
            <button onclick="window.groceryManager.setSubTag('all')" class="mt-2 px-4 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-bold transition">
              Xem tất cả
            </button>
          </div>
        ` : `
          <!-- Grid 3 Cột Thoáng với thuật toán 30% Hoa hồng cao (sort:5) + 70% Bán chạy (sort:2) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
            ${rankedItems.map(item => {
              const isSaved = this.isWishlisted(item.id);
              return `
                <div class="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all p-3 flex flex-col justify-between group">
                  <!-- Image Container with Shopee Signals -->
                  <div class="relative w-full h-44 rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    
                    <!-- Shopee Mall / Yêu thích+ Badge (Top-left) -->
                    <span class="absolute top-2 left-2 ${item.badgeType === 'mall' ? 'bg-[#EE4D2D]' : 'bg-[#F53D2D]'} text-white text-[9.5px] font-black px-2 py-0.5 rounded shadow-xs tracking-tight">
                      ${item.badge}
                    </span>

                    <!-- Wishlist Heart Icon (Top-right) -->
                    <button onclick="window.groceryManager.toggleWishlist(${JSON.stringify(item).replace(/"/g, '&quot;')})"
                      class="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 flex items-center justify-center absolute top-2 right-2 shadow-xs transition active:scale-90 cursor-pointer"
                      title="${isSaved ? 'Bỏ lưu' : 'Lưu để mua sau'}">
                      <span class="${isSaved ? 'text-rose-500 text-sm' : 'text-stone-400 text-xs'}">${isSaved ? '❤️' : '🤍'}</span>
                    </button>

                    <!-- Sold Count + Rating Badge (Bottom-left) -->
                    <div class="absolute bottom-2 left-2 bg-black/65 text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <span class="text-amber-400">⭐ ${item.rating}</span>
                      <span>•</span>
                      <span>${item.soldCount}</span>
                    </div>

                    <!-- Discount Badge (Top-right cạnh tim) -->
                    ${item.discount ? `
                      <span class="absolute top-2.5 right-10 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                        ${item.discount}
                      </span>
                    ` : ''}
                  </div>

                  <!-- Product Info & CTA -->
                  <div class="flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h5 class="font-extrabold text-xs sm:text-[13px] text-stone-900 leading-snug line-clamp-2 group-hover:text-[#EE4D2D] transition">
                        ${item.name}
                      </h5>
                    </div>

                    <div class="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div>
                        <div class="flex items-baseline gap-1.5">
                          <span class="font-black text-sm sm:text-base text-rose-600">${item.price}</span>
                          ${item.originalPrice ? `<span class="text-[10px] text-stone-400 line-through">${item.originalPrice}</span>` : ''}
                        </div>
                      </div>
                      <a href="${item.shopeeUrl}" target="_blank" rel="noopener noreferrer"
                        class="px-3 py-1.5 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer">
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

    container.innerHTML = `
      <!-- ════════ KHỐI 1: ĐÃ LƯU ĐỂ MUA SAU (WISHLIST) ════════ -->
      <div class="flex-1 flex flex-col min-h-0 border-b border-stone-200">
        <!-- Wishlist Header -->
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

        <!-- Wishlist Items List (Scrollable) -->
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

      <!-- ════════ KHỐI 2: TOP SHOP ĂN VẶT UY TÍN TRÊN SHOPEE (TỶ LỆ CHỐT ĐƠN CAO) ════════ -->
      <div class="shrink-0 p-3.5 bg-gradient-to-b from-stone-50/50 to-orange-50/40 space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="text-sm">⭐</span>
            <h4 class="font-black text-xs text-stone-900">Top Shop Ăn Vặt Shopee</h4>
          </div>
          <span class="text-[9.5px] text-stone-400 font-semibold">Ghé shop mua gom Freeship</span>
        </div>

        <div class="space-y-2">
          ${SHOPEE_TOP_SHOPS.map(shop => `
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
        topShops: SHOPEE_TOP_SHOPS,
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
    if (hasChanges) {
      this.renderMiddleView();
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
