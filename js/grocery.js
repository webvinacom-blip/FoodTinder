// ══════════════════════════════════════════════════════════════════════
// FOODTINDER GROCERY & CONVENIENCE MART ENGINE (TAB TẠP HOÁ 3 CỘT)
// ══════════════════════════════════════════════════════════════════════

const GROCERY_NEEDS = [
  { id: 'all', label: 'Tất cả nhu cầu', emoji: '✨', desc: 'Toàn bộ combo & sản phẩm' },
  { id: 'movie', label: 'Cày phim / Ăn vặt', emoji: '🍿', desc: 'Snack khoai tây, bắp rang, nước ngọt' },
  { id: 'hunger', label: 'Cứu đói 5 phút', emoji: '🍜', desc: 'Mì ly, xúc xích tiệt trùng, bánh mì tươi' },
  { id: 'drinking', label: 'Nhậu tại gia', emoji: '🍻', desc: 'Khô gà lá chanh, mực rim, đậu phộng, bia' },
  { id: 'refresh', label: 'Giải khát 27°C', emoji: '🧊', desc: 'Nước ép, trái cây gọt sẵn, kem ốc quế' },
  { id: 'specialty', label: 'Đặc sản Quy Nhơn', emoji: '🎁', desc: 'Nem chả Chợ Huyện, bánh ít, tré mang về' }
];

const GROCERY_STORES = [
  { id: 'winmart_ngomay', name: 'WinMart+ Ngô Mây', address: '68 Ngô Mây, P. Ngô Mây', distance: 'Cách bạn 650m', rating: '4.8 ⭐', type: 'Siêu thị mini' },
  { id: 'bhx_nth', name: 'Bách Hoá Xanh Nguyễn Thái Học', address: '182 Nguyễn Thái Học, P. Ngô Mây', distance: 'Cách bạn 1.1km', rating: '4.7 ⭐', type: 'Bách hoá thực phẩm' },
  { id: 'coop_leduan', name: 'Co.op Food Lê Duẩn', address: '45 Lê Duẩn, P. Lý Thường Kiệt', distance: 'Cách bạn 1.4km', rating: '4.8 ⭐', type: 'Siêu thị mini' },
  { id: 'circlek_xuandieu', name: 'Circle K Xuân Diệu', address: '210 Xuân Diệu, P. Trần Phú', distance: 'Cách bạn 800m', rating: '4.9 ⭐', type: 'Cửa hàng 24/7' },
  { id: 'dacsan_thanhliem', name: 'Đặc Sản Thanh Liêm Quy Nhơn', address: '128 Chương Dương, P. Nguyễn Văn Cừ', distance: 'Cách bạn 1.2km', rating: '4.9 ⭐', type: 'Tiệm đặc sản xứ Nẫu' },
  { id: 'tre_batam', name: 'Tiệm Tré Nem Bà Tám', address: '03 Phan Bội Châu, P. Lê Lợi', distance: 'Cách bạn 1.5km', rating: '4.9 ⭐', type: 'Đặc sản truyền thống' }
];

const GROCERY_COMBOS = [
  {
    id: 'combo_movie',
    name: 'Combo Mưa Rào Cày Phim',
    category: 'movie',
    price: '89.000đ',
    priceNum: 89000,
    originalPrice: '115.000đ',
    discount: '-22%',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80',
    store: 'WinMart+ Ngô Mây',
    distance: 'Cách bạn 650m',
    desc: '1 Bắp rang bơ phô mai lớn + 2 Snack Lay’s Tự Nhiên + 2 Lon Coca-Cola 320ml ướp lạnh',
    items: ['Bắp rang bơ phô mai WinMart', '2x Snack Lay’s Tự Nhiên', '2x Coca-Cola ướp lạnh'],
    badge: '🔥 Bán chạy nhất'
  },
  {
    id: 'combo_hunger',
    name: 'Combo Cứu Đói 5 Phút',
    category: 'hunger',
    price: '45.000đ',
    priceNum: 45000,
    originalPrice: '58.000đ',
    discount: '-22%',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80',
    store: 'Circle K Xuân Diệu',
    distance: 'Cách bạn 800m',
    desc: '1 Mì Ly Omachi Xốt Bò Hầm + 2 Xúc xích CP tiệt trùng + 1 Bánh mì tươi bơ sữa Kinh Đô',
    items: ['Mì Ly Omachi Bò Hầm', '2x Xúc xích CP', 'Bánh mì tươi Kinh Đô'],
    badge: '⚡ Cứu đói đêm'
  },
  {
    id: 'combo_drinking',
    name: 'Combo Nhậu Tại Gia Chém Gió',
    category: 'drinking',
    price: '135.000đ',
    priceNum: 135000,
    originalPrice: '175.000đ',
    discount: '-23%',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    store: 'Bách Hoá Xanh Nguyễn Thái Học',
    distance: 'Cách bạn 1.1km',
    desc: '1 Hũ Khô gà lá chanh cay giòn 200g + 1 Hũ Mực rim me Quy Nhơn 150g + 1 Đậu phộng Tân Tân + 2 Lon Tiger Crystal',
    items: ['Khô gà lá chanh 200g', 'Mực rim me 150g', 'Đậu phộng tỏi ớt', '2x Bia Tiger Crystal'],
    badge: '🍻 Hợp cạ cạ cứng'
  },
  {
    id: 'combo_refresh',
    name: 'Combo Giải Nhiệt 27°C',
    category: 'refresh',
    price: '68.000đ',
    priceNum: 68000,
    originalPrice: '85.000đ',
    discount: '-20%',
    image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=500&q=80',
    store: 'Co.op Food Lê Duẩn',
    distance: 'Cách bạn 1.4km',
    desc: '1 Hộp Trái cây cắt sẵn (Xoài, ổi, mận kèm muối tôm) + 1 Chai Nước ép Ổi Hồng 350ml + 1 Kem Ốc Quế socola',
    items: ['Trái cây gọt sẵn muối tôm', 'Nước ép Ổi Hồng 350ml', 'Kem Ốc Quế socola'],
    badge: '🧊 Thanh mát giải nhiệt'
  },
  {
    id: 'combo_specialty',
    name: 'Combo Đặc Sản Nẫu Làm Quà',
    category: 'specialty',
    price: '175.000đ',
    priceNum: 175000,
    originalPrice: '210.000đ',
    discount: '-17%',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80',
    store: 'Đặc Sản Thanh Liêm Quy Nhơn',
    distance: 'Cách bạn 1.2km',
    desc: '10 Chiếc Nem chua Chợ Huyện đóng hộp + 1 Cây Tré rơm Quy Nhơn loại 1 + 1 Hộp Bánh ít lá gai xứ Nẫu',
    items: ['10x Nem chua Chợ Huyện', 'Tré rơm rơm Quy Nhơn', 'Bánh ít lá gai (5 cái)'],
    badge: '🎁 Quà quê chuẩn vị'
  }
];

const GROCERY_ITEMS = [
  // 🍿 CÀY PHIM / ĂN VẶT
  {
    id: 'item_popcorn',
    name: 'Bắp rang bơ phô mai khổng lồ WinMart',
    category: 'movie',
    price: '25.000đ',
    priceNum: 25000,
    store: 'WinMart+ Ngô Mây',
    distance: '650m',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
    voucher: 'Giảm 10k đơn 50k'
  },
  {
    id: 'item_lays',
    name: 'Snack khoai tây Lay’s vị Tự Nhiên 95g',
    category: 'movie',
    price: '22.000đ',
    priceNum: 22000,
    store: 'WinMart+ Ngô Mây',
    distance: '650m',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
    voucher: 'Mua 2 giảm 5k'
  },
  {
    id: 'item_coke',
    name: 'Coca-Cola Sleek 320ml ướp lạnh',
    category: 'movie',
    price: '11.000đ',
    priceNum: 11000,
    store: 'Circle K Xuân Diệu',
    distance: '800m',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    voucher: 'Freeship 15k'
  },
  {
    id: 'item_taokaenoi',
    name: 'Rong biển sấy giòn Tao Kae Noi vị cay',
    category: 'movie',
    price: '19.000đ',
    priceNum: 19000,
    store: 'Bách Hoá Xanh Nguyễn Thái Học',
    distance: '1.1km',
    image: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=400&q=80',
    voucher: 'Hot deal 15k'
  },

  // 🍜 CỨU ĐÓI 5 PHÚT
  {
    id: 'item_omachi',
    name: 'Mì Ly Omachi Bò Hầm Xốt Cà Chua 68g',
    category: 'hunger',
    price: '16.000đ',
    priceNum: 16000,
    store: 'Circle K Xuân Diệu',
    distance: '800m',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    voucher: 'Nóng hổi 10 phút'
  },
  {
    id: 'item_sausage',
    name: 'Xúc xích tiệt trùng Vissan gói 5 cây',
    category: 'hunger',
    price: '24.000đ',
    priceNum: 24000,
    store: 'WinMart+ Ngô Mây',
    distance: '650m',
    image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&w=400&q=80',
    voucher: 'Kèm mì cực ngon'
  },
  {
    id: 'item_bread',
    name: 'Bánh mì tươi chà bông Kinh Đô',
    category: 'hunger',
    price: '15.000đ',
    priceNum: 15000,
    store: 'Co.op Food Lê Duẩn',
    distance: '1.4km',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    voucher: 'Tiện lợi ăn liền'
  },
  {
    id: 'item_egg',
    name: 'Trứng gà lòng đào luộc sẵn bóc vỏ (2 quả)',
    category: 'hunger',
    price: '16.000đ',
    priceNum: 16000,
    store: 'Circle K Xuân Diệu',
    distance: '800m',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
    voucher: 'Thơm béo dinh dưỡng'
  },

  // 🍻 NHẬU TẠI GIA
  {
    id: 'item_khoga',
    name: 'Khô gà lá chanh cay giòn hũ 200g',
    category: 'drinking',
    price: '48.000đ',
    priceNum: 48000,
    store: 'Bách Hoá Xanh Nguyễn Thái Học',
    distance: '1.1km',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    voucher: 'Cay tê đầu lưỡi'
  },
  {
    id: 'item_mucrim',
    name: 'Mực rim me chua cay Quy Nhơn hũ 150g',
    category: 'drinking',
    price: '65.000đ',
    priceNum: 65000,
    store: 'Đặc Sản Thanh Liêm Quy Nhơn',
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
    voucher: 'Đặc sản nhậu bén'
  },
  {
    id: 'item_dauphong',
    name: 'Đậu phộng da cá tỏi ớt Tân Tân gói 150g',
    category: 'drinking',
    price: '18.000đ',
    priceNum: 18000,
    store: 'WinMart+ Ngô Mây',
    distance: '650m',
    image: 'https://images.unsplash.com/photo-1536594098072-05354aae3c9a?auto=format&fit=crop&w=400&q=80',
    voucher: 'Giòn rụm bùi bùi'
  },
  {
    id: 'item_tiger',
    name: 'Bia Tiger Crystal lon cao 330ml ướp lạnh',
    category: 'drinking',
    price: '18.000đ',
    priceNum: 18000,
    store: 'Circle K Xuân Diệu',
    distance: '800m',
    image: 'https://images.unsplash.com/photo-1608270114092-93e1ea6652c7?auto=format&fit=crop&w=400&q=80',
    voucher: 'Lạnh ngắt sảng khoái'
  },

  // 🧊 GIẢI KHÁT 27°C
  {
    id: 'item_traicay',
    name: 'Hộp trái cây cắt sẵn 3 vị (Ổi, xoài, mận muối ớt)',
    category: 'refresh',
    price: '35.000đ',
    priceNum: 35000,
    store: 'Co.op Food Lê Duẩn',
    distance: '1.4km',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80',
    voucher: 'Tươi giòn trong ngày'
  },
  {
    id: 'item_nuocep',
    name: 'Nước ép Ổi Hồng Vfresh nguyên chất 1L',
    category: 'refresh',
    price: '42.000đ',
    priceNum: 42000,
    store: 'WinMart+ Ngô Mây',
    distance: '650m',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=400&q=80',
    voucher: 'Giàu Vitamin C'
  },
  {
    id: 'item_kem',
    name: 'Kem Ốc Quế Cornetto Dâu Socola Merino',
    category: 'refresh',
    price: '18.000đ',
    priceNum: 18000,
    store: 'Circle K Xuân Diệu',
    distance: '800m',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80',
    voucher: 'Mát lạnh ngọt ngào'
  },
  {
    id: 'item_cocoxim',
    name: 'Nước dừa tươi nguyên chất Cocoxim 330ml',
    category: 'refresh',
    price: '20.000đ',
    priceNum: 20000,
    store: 'Bách Hoá Xanh Nguyễn Thái Học',
    distance: '1.1km',
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=400&q=80',
    voucher: 'Thanh lọc cơ thể'
  },

  // 🎁 ĐẶC SẢN QUY NHƠN
  {
    id: 'item_nemchua',
    name: 'Nem chua Chợ Huyện lá ổi đóng hộp (10 chiếc)',
    category: 'specialty',
    price: '55.000đ',
    priceNum: 55000,
    store: 'Đặc Sản Thanh Liêm Quy Nhơn',
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80',
    voucher: 'Đặc sản chính gốc'
  },
  {
    id: 'item_tre',
    name: 'Tré rơm rơm Quy Nhơn loại 1 cây bọc rơm',
    category: 'specialty',
    price: '45.000đ',
    priceNum: 45000,
    store: 'Tiệm Tré Nem Bà Tám',
    distance: '1.5km',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    voucher: 'Hương vị gia truyền'
  },
  {
    id: 'item_banhit',
    name: 'Bánh ít lá gai nhân dừa bánh dẻo (hộp 5 cái)',
    category: 'specialty',
    price: '40.000đ',
    priceNum: 40000,
    store: 'Đặc Sản Thanh Liêm Quy Nhơn',
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',
    voucher: 'Dẻo thơm ngọt bùi'
  },
  {
    id: 'item_banhtrangdua',
    name: 'Bánh tráng nước dừa Tam Quan (gói 5 bánh)',
    category: 'specialty',
    price: '35.000đ',
    priceNum: 35000,
    store: 'Đặc Sản Thanh Liêm Quy Nhơn',
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    voucher: 'Nướng than thơm lừng'
  }
];

class GroceryManager {
  constructor() {
    this.currentNeedFilter = 'all';
    this.cart = []; // [{ id, name, price, priceNum, store, image, quantity, isCombo }]
    this.appliedVoucher = { code: 'FREESHIPMART', discount: 15000, minOrder: 99000, desc: 'Freeship đơn từ 99k' };
    this.loadCart();
  }

  init() {
    this.loadCart();
    this.renderNeedsSelector();
    this.renderMiddleView();
    this.renderCartSidebar();
    this.fetchFromFirestore();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('foodtinder_grocery_cart_v1');
      if (saved) {
        this.cart = JSON.parse(saved);
      }
    } catch (e) {
      this.cart = [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('foodtinder_grocery_cart_v1', JSON.stringify(this.cart));
    } catch (e) {}
    this.updateCartBadge();
    this.renderCartSidebar();
  }

  setNeed(needId) {
    window.soundFX && window.soundFX.playPop();
    this.currentNeedFilter = needId;
    this.renderNeedsSelector();
    this.renderMiddleView();
  }

  addToCart(item, isCombo = false) {
    window.soundFX && window.soundFX.playPop();
    const existing = this.cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        priceNum: item.priceNum,
        store: item.store || 'ShopeeFood Mart',
        image: item.image,
        quantity: 1,
        isCombo: Boolean(isCombo)
      });
    }
    this.saveCart();

    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(`🛒 Đã thêm "${item.name}" vào giỏ tạp hoá!`);
    }
  }

  updateQuantity(itemId, delta) {
    window.soundFX && window.soundFX.playPop();
    const idx = this.cart.findIndex(c => c.id === itemId);
    if (idx === -1) return;
    this.cart[idx].quantity += delta;
    if (this.cart[idx].quantity <= 0) {
      this.cart.splice(idx, 1);
    }
    this.saveCart();
  }

  removeFromCart(itemId) {
    window.soundFX && window.soundFX.playPop();
    this.cart = this.cart.filter(c => c.id !== itemId);
    this.saveCart();
  }

  clearCart() {
    if (this.cart.length === 0) return;
    window.soundFX && window.soundFX.playPop();
    this.cart = [];
    this.saveCart();
  }

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
  }

  getCartTotalCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateCartBadge() {
    const badge = document.getElementById('grocery-cart-badge');
    const count = this.getCartTotalCount();
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  // ── 1. RENDER NHU CẦU TẠP HOÁ TRÊN CỘT TRÁI (#mood-selector-container) ──
  renderNeedsSelector() {
    const container = document.getElementById('mood-selector-container');
    if (!container) return;

    container.innerHTML = `
      <div class="flex items-center justify-between mb-2.5 px-0.5">
        <div class="flex items-center gap-1.5">
          <span class="text-xs">🛒</span>
          <span class="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider">Nhu cầu tạp hoá</span>
        </div>
        <button onclick="window.groceryManager.askAI()" class="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full transition shadow-xs" title="Hỏi AI gợi ý giỏ hàng tạp hoá">
          <span>Hỏi AI</span> <span>🤖</span>
        </button>
      </div>

      <!-- Need Selector List -->
      <div class="space-y-1.5">
        ${GROCERY_NEEDS.map(n => {
          const isSelected = n.id === this.currentNeedFilter;
          return `
            <button onclick="window.groceryManager.setNeed('${n.id}')"
              class="w-full text-left flex items-center gap-2.5 p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'bg-amber-50 border-amber-300 shadow-xs ring-1 ring-amber-400/40' 
                  : 'bg-white border-stone-200/80 hover:bg-stone-50'
              }">
              <span class="text-lg shrink-0">${n.emoji}</span>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-bold ${isSelected ? 'text-amber-950 font-black' : 'text-stone-800'} truncate">${n.label}</div>
                <div class="text-[10px] text-stone-400 truncate">${n.desc}</div>
              </div>
              ${isSelected ? `<span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>` : ''}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Quick Tips Box -->
      <div class="mt-3 p-2.5 bg-orange-50/80 rounded-xl border border-orange-200/70 text-[10.5px] text-orange-900 leading-relaxed">
        <span class="font-extrabold">💡 Mẹo ghép đơn:</span> Thêm từ <strong>99.000đ</strong> để nhận voucher <strong>Freeship</strong> từ ShopeeFood Mart Quy Nhơn!
      </div>
    `;
  }

  // ── 2. RENDER CỘT GIỮA: COMBO + KỆ MÓN LẺ + VOUCHER MART ──
  renderMiddleView() {
    const container = document.getElementById('grocery-content-container');
    if (!container) return;

    // Filter combos & items
    const filteredCombos = this.currentNeedFilter === 'all'
      ? GROCERY_COMBOS
      : GROCERY_COMBOS.filter(c => c.category === this.currentNeedFilter);

    const filteredItems = this.currentNeedFilter === 'all'
      ? GROCERY_ITEMS
      : GROCERY_ITEMS.filter(i => i.category === this.currentNeedFilter);

    const activeNeedObj = GROCERY_NEEDS.find(n => n.id === this.currentNeedFilter) || GROCERY_NEEDS[0];

    container.innerHTML = `
      <!-- Welcome Grocery Banner -->
      <div class="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute -right-6 -bottom-8 text-8xl opacity-15 pointer-events-none select-none">🛒</div>
        <div class="relative z-10 max-w-xl">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10.5px] font-black uppercase tracking-wider mb-2 backdrop-blur-xs">
            <span>🛵 ShopeeFood Mart Quy Nhơn</span>
            <span>•</span>
            <span>Giao siêu tốc 15–25p</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black leading-tight">Đi Chợ Tạp Hoá & Siêu Thị Tiện Lợi</h2>
          <p class="text-xs sm:text-sm text-white/95 mt-1 leading-relaxed">
            Chọn nhanh Combo theo tâm trạng hoặc nhặt lẻ từ WinMart+, Bách Hoá Xanh & Tiệm đặc sản gần bạn nhất.
          </p>

          <!-- ShopeeFood Mart Voucher Strip -->
          <div class="mt-3.5 flex items-center gap-2 flex-wrap">
            <div class="inline-flex items-center gap-1.5 bg-white/95 text-stone-900 px-3 py-1.5 rounded-xl text-xs font-black shadow-xs">
              <span class="text-rose-500">🎟️</span>
              <span class="font-mono text-rose-600">FREESHIPMART</span>
              <span class="text-[10.5px] font-semibold text-stone-500">• Giảm 15k ship đơn 99k</span>
            </div>
            <div class="inline-flex items-center gap-1.5 bg-white/95 text-stone-900 px-3 py-1.5 rounded-xl text-xs font-black shadow-xs">
              <span class="text-amber-500">⚡</span>
              <span class="font-mono text-amber-700">MART25K</span>
              <span class="text-[10.5px] font-semibold text-stone-500">• Giảm 25k đơn 120k</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ════════ KHU VỰC 1: COMBO THEO TÂM TRẠNG / THỜI TIẾT ════════ -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <span>🎯 Combo Tiện Lợi Chọn 1 Lần</span>
              <span class="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full uppercase">Tiết kiệm 20%</span>
            </h3>
            <p class="text-xs text-stone-500 mt-0.5">Lên sẵn đồ ăn vặt & nước uống theo cảm xúc, bấm chọn trọn gói ngay</p>
          </div>
        </div>

        <!-- Horizontal Combo Cards Slider -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${filteredCombos.map(combo => `
            <div class="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
              <!-- Top Image & Badge -->
              <div class="relative h-36 w-full overflow-hidden bg-stone-100">
                <img src="${combo.image}" alt="${combo.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span class="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  ${combo.badge}
                </span>
                <span class="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                  ${combo.discount}
                </span>
                <span class="absolute bottom-2 left-2 bg-black/60 text-white text-[9.5px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  📍 ${combo.store}
                </span>
              </div>

              <!-- Body Info -->
              <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 class="font-black text-xs sm:text-sm text-stone-900 group-hover:text-amber-600 transition leading-snug">
                    ${combo.name}
                  </h4>
                  <p class="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    ${combo.desc}
                  </p>
                </div>

                <div class="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="font-black text-sm sm:text-base text-rose-600">${combo.price}</span>
                      <span class="text-[10px] text-stone-400 line-through">${combo.originalPrice}</span>
                    </div>
                  </div>
                  <button onclick="window.groceryManager.addToCart(${JSON.stringify(combo).replace(/"/g, '&quot;')}, true)"
                    class="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer">
                    <span>+ Thêm combo</span>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ════════ KHU VỰC 2: LƯỚI MÓN LẺ (GRID 2-3 CỘT) ════════ -->
      <div class="space-y-3 pt-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <span>🧺 Kệ Hàng Siêu Thị & Tiệm Tiện Lợi</span>
              <span class="text-xs text-stone-400 font-semibold">(${filteredItems.length} sản phẩm)</span>
            </h3>
            <p class="text-xs text-stone-500 mt-0.5">Đang lọc theo: <strong class="text-amber-700">${activeNeedObj.label}</strong></p>
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

        <!-- Grid 2-3 Columns -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          ${filteredItems.map(item => `
            <div class="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all p-3 flex flex-col justify-between group">
              <div class="relative w-full h-32 rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span class="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full backdrop-blur-xs">
                  ${item.distance}
                </span>
              </div>

              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <span class="text-[9.5px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded truncate block w-fit mb-1">
                    🏪 ${item.store}
                  </span>
                  <h5 class="font-extrabold text-xs text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition">
                    ${item.name}
                  </h5>
                </div>

                <div class="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
                  <span class="font-black text-xs sm:text-sm text-rose-600">${item.price}</span>
                  <button onclick="window.groceryManager.addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')}, false)"
                    class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-extrabold text-[11px] rounded-xl transition active:scale-95 flex items-center gap-1 cursor-pointer"
                    title="Thêm vào giỏ">
                    <span>+ Thêm</span>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ── 3. RENDER CỘT PHẢI: 🛒 GIỎ TẠP HOÁ / GHÉP ĐƠN ──
  renderCartSidebar() {
    const container = document.getElementById('grocery-cart-sidebar');
    if (!container) return;

    const subtotal = this.getCartSubtotal();
    const count = this.getCartTotalCount();
    const shippingFee = subtotal >= 99000 ? 0 : (subtotal > 0 ? 15000 : 0);
    const voucherDiscount = (subtotal >= this.appliedVoucher.minOrder && subtotal > 0) ? this.appliedVoucher.discount : 0;
    const finalTotal = Math.max(0, subtotal + shippingFee - voucherDiscount);

    container.innerHTML = `
      <!-- Cart Header -->
      <div class="p-4 border-b border-stone-100 flex items-center justify-between shrink-0 bg-stone-50/50">
        <div class="flex items-center gap-2">
          <span class="text-lg">🛒</span>
          <div>
            <h4 class="font-extrabold text-xs text-stone-900">Giỏ tạp hoá / Ghép đơn</h4>
            <p class="text-[10px] text-stone-400 font-medium">ShopeeFood Mart Quy Nhơn</p>
          </div>
        </div>
        ${this.cart.length > 0 ? `
          <button onclick="window.groceryManager.clearCart()" class="text-[10.5px] text-stone-400 hover:text-rose-500 font-bold transition cursor-pointer">
            Xoá hết
          </button>
        ` : ''}
      </div>

      <!-- Cart Items List (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-none">
        ${this.cart.length === 0 ? `
          <div class="py-12 flex flex-col items-center justify-center text-center px-4 space-y-2 text-stone-400">
            <span class="text-4xl opacity-40">🛍️</span>
            <p class="text-xs font-semibold text-stone-600">Giỏ tạp hoá chưa có món nào</p>
            <p class="text-[10.5px] leading-relaxed">Chọn các Combo hoặc nhặt lẻ từ kệ hàng bên trái để ghép đơn freeship nhé!</p>
          </div>
        ` : this.cart.map(item => `
          <div class="flex items-center gap-2.5 p-2 bg-stone-50/80 rounded-xl border border-stone-200/70">
            <div class="w-11 h-11 rounded-lg overflow-hidden bg-stone-200 shrink-0">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <h6 class="font-bold text-[11.5px] text-stone-900 truncate leading-tight">${item.name}</h6>
              <div class="flex items-center justify-between mt-1">
                <span class="text-[11px] font-black text-rose-600">${item.price}</span>
                <span class="text-[9.5px] text-stone-400">${item.store}</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0 bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
              <button onclick="window.groceryManager.updateQuantity('${item.id}', -1)"
                class="w-5 h-5 rounded flex items-center justify-center text-stone-600 hover:bg-stone-100 font-black text-xs transition active:scale-95 cursor-pointer">
                -
              </button>
              <span class="text-xs font-extrabold px-1 text-stone-900">${item.quantity}</span>
              <button onclick="window.groceryManager.updateQuantity('${item.id}', 1)"
                class="w-5 h-5 rounded flex items-center justify-center text-stone-600 hover:bg-stone-100 font-black text-xs transition active:scale-95 cursor-pointer">
                +
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Cart Summary & Actions Footer -->
      ${this.cart.length > 0 ? `
        <div class="p-3.5 border-t border-stone-200 bg-white space-y-2.5 shrink-0 shadow-lg">
          <!-- Price Calculation -->
          <div class="space-y-1 text-xs">
            <div class="flex justify-between text-stone-500">
              <span>Tạm tính (${count} món):</span>
              <span class="font-bold text-stone-800">${subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <div class="flex justify-between text-stone-500">
              <span>Phí giao hàng:</span>
              <span class="font-bold ${shippingFee === 0 ? 'text-emerald-600' : 'text-stone-800'}">
                ${shippingFee === 0 ? 'Freeship 🎉' : '15.000đ'}
              </span>
            </div>
            ${voucherDiscount > 0 ? `
              <div class="flex justify-between text-rose-600 font-bold">
                <span>Voucher ShopeeFood Mart:</span>
                <span>-${voucherDiscount.toLocaleString('vi-VN')}đ</span>
              </div>
            ` : ''}
            <div class="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-100">
              <span>Tổng thanh toán:</span>
              <span class="text-base text-rose-600">${finalTotal.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <!-- 2 Main Action Buttons -->
          <div class="space-y-1.5 pt-1">
            <button onclick="window.groceryManager.checkoutShopeeMart()"
              class="w-full py-2.5 bg-gradient-to-r from-[#EE4D2D] to-orange-500 hover:from-[#D73211] hover:to-orange-600 text-white rounded-xl font-black text-xs shadow-md shadow-orange-300 flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer">
              <span>🛵 Đặt ngay trên ShopeeFood Mart</span>
              <span>↗</span>
            </button>
            <button onclick="window.groceryManager.shareCartToFriends()"
              class="w-full py-2 bg-gradient-to-r from-rose-50 to-amber-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer">
              <span>🤝 Rủ ghép đơn Freeship</span>
            </button>
          </div>
        </div>
      ` : ''}
    `;

    this.updateCartBadge();
  }

  // ── ĐẶT NGAY TRÊN SHOPEEFOOD MART ──
  checkoutShopeeMart() {
    window.soundFX && window.soundFX.playPop();
    const count = this.getCartTotalCount();
    const total = this.getCartSubtotal();
    
    // Tìm cửa hàng đại diện
    const firstStore = this.cart[0]?.store || 'ShopeeFood Mart';
    let martUrl = 'https://shopeefood.vn/binh-dinh/danh-sach-dia-diem-sieu-thi';
    if (firstStore.includes('WinMart')) martUrl = 'https://shopeefood.vn/binh-dinh/winmart-ngo-may';
    else if (firstStore.includes('Bách Hoá Xanh')) martUrl = 'https://shopeefood.vn/binh-dinh/bach-hoa-xanh-nguyen-thai-hoc';
    else if (firstStore.includes('Thanh Liêm')) martUrl = 'https://shopeefood.vn/binh-dinh/dac-san-thanh-liem';

    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(`🛵 Đang mở ShopeeFood Mart (${count} món • ${total.toLocaleString('vi-VN')}đ)...`);
    }

    setTimeout(() => {
      window.open(martUrl, '_blank');
    }, 400);
  }

  // ── RỦ GHÉP ĐƠN FREESHIP SANG TAB TIN NHẮN ──
  shareCartToFriends() {
    window.soundFX && window.soundFX.playMatch();
    const itemsList = this.cart.map(c => `${c.quantity}x ${c.name} (${c.price})`).join(', ');
    const total = this.getCartSubtotal();

    // Tìm người bạn thân đầu tiên (Hoàng Yến - Yến Ốc)
    const myFriends = (window.APP_DATA && window.APP_DATA.myFriends) || [];
    const friend = myFriends[0] || { id: 101, name: 'Hoàng Yến (Yến Ốc)' };

    const groceryCardMsg = {
      sender: 'you',
      cardType: 'invite_card',
      food: {
        id: 999999,
        name: 'Giỏ Ghép Đơn Tạp Hoá & Siêu Thị',
        restaurant: 'ShopeeFood Mart Quy Nhơn',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
        address: 'Giao nhanh 15–20 phút tại Quy Nhơn',
        distanceText: 'Cách bạn 650m',
        priceRange: `${total.toLocaleString('vi-VN')}đ`,
        rating: 4.9
      },
      text: `Ê mình đang gom đơn ShopeeFood Mart gồm: ${itemsList}. Bạn có muốn ghép chung món gì để lấy mã Freeship 15k không nè? 🛒✨`,
      time: 'Vừa xong'
    };

    if (friend.messages) {
      friend.messages.push(groceryCardMsg);
    }
    if (window.chatManager && typeof window.chatManager.saveFriendsData === 'function') {
      window.chatManager.saveFriendsData();
    }

    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(`🤝 Đã gửi danh sách ghép đơn cho ${friend.name}!`);
    }

    // Chuyển sang tab chat và mở bạn bè đó
    if (typeof window.switchTab === 'function') {
      window.switchTab('chat');
    } else if (window.app && typeof window.app.switchTab === 'function') {
      window.app.switchTab('chat');
    }

    if (window.chatManager) {
      window.chatManager.selectChatTarget(friend.id);
    }

    // Auto reply sau 1.5s
    setTimeout(() => {
      window.soundFX && window.soundFX.playPop();
      if (friend.messages) {
        friend.messages.push({
          sender: 'them',
          text: `Ui hay quá đúng lúc tui đang thèm snack với nước ngọt cày phim! Đợi xíu tui gửi món ghép chung lấy Freeship nha! 🍿🧋✨`,
          time: 'Vừa xong'
        });
      }
      if (window.chatManager) {
        window.chatManager.saveFriendsData();
        window.chatManager.renderFriendsSidebar(false);
        if (window.chatManager.currentChatTarget === friend.id) {
          window.chatManager.renderActiveChatWindow();
        }
      }
    }, 1500);
  }

  // ── HỎI AI GỢI Ý GIỎ HÀNG TẠP HOÁ ──
  askAI() {
    window.soundFX && window.soundFX.playPop();
    if (typeof window.switchTab === 'function') {
      window.switchTab('chat');
    } else if (window.app && typeof window.app.switchTab === 'function') {
      window.app.switchTab('chat');
    }

    if (window.chatManager) {
      window.chatManager.selectChatTarget('ai');
      window.chatManager.handleUserSubmit('Gợi ý cho mình 1 giỏ hàng ăn vặt và đồ uống cày phim tiết kiệm nhất tại ShopeeFood Mart Quy Nhơn với AI ơi!');
    }
  }

  // ── 5. KIẾN TRÚC DỮ LIỆU CLOUD FIRESTORE (foodtinder_quynhon/grocery_curated - 1 READ DUY NHẤT) ──
  async fetchFromFirestore() {
    try {
      // 1. Thử qua Firebase SDK (tiết kiệm chi phí: đúng 1 Read duy nhất cho cả document)
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        const doc = await firebase.firestore().collection('foodtinder_quynhon').doc('grocery_curated').get();
        if (doc && doc.exists) {
          const data = doc.data();
          if (data) {
            this.applyRemoteData(data);
            console.log('🛒 [Grocery Firestore] Đã nạp thành công grocery_curated (1 Read Firestore)!');
            return true;
          }
        }
      }

      // 2. Thử qua Cloud Firestore REST API nếu SDK chưa sẵn sàng
      const FIREBASE_CONFIG = window.FIREBASE_CONFIG || {
        projectId: "foodtinder-quynhon",
        apiKey: ""
      };
      if (FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.apiKey) {
        const fsUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/foodtinder_quynhon/grocery_curated?key=${FIREBASE_CONFIG.apiKey}`;
        const res = await fetch(fsUrl);
        if (res.ok) {
          const docData = await res.json();
          if (docData && docData.fields) {
            console.log('🛒 [Grocery Firestore REST] Đã kết nối doc grocery_curated qua REST API');
          }
        }
      }
    } catch (err) {
      console.warn('🛒 [Grocery Firestore] Sử dụng dữ liệu curated nội bộ tích hợp:', err.message);
    }
    return false;
  }

  async syncToFirestore() {
    try {
      const payload = {
        combos: window.GROCERY_COMBOS || GROCERY_COMBOS,
        stores: window.GROCERY_STORES || GROCERY_STORES,
        items: window.GROCERY_ITEMS || GROCERY_ITEMS,
        updatedAt: new Date().toISOString()
      };
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        await firebase.firestore().collection('foodtinder_quynhon').doc('grocery_curated').set(payload, { merge: true });
        console.log('🛒 [Grocery Firestore] Đã đồng bộ document foodtinder_quynhon/grocery_curated lên Cloud Firestore!');
        return true;
      }
    } catch (err) {
      console.warn('🛒 [Grocery Firestore Sync Error]:', err.message);
    }
    return false;
  }

  applyRemoteData(data) {
    let hasChanges = false;
    if (Array.isArray(data.combos) && data.combos.length > 0) {
      window.GROCERY_COMBOS = data.combos;
      hasChanges = true;
    }
    if (Array.isArray(data.stores) && data.stores.length > 0) {
      window.GROCERY_STORES = data.stores;
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
  window.GROCERY_COMBOS = GROCERY_COMBOS;
  window.GROCERY_ITEMS = GROCERY_ITEMS;
  window.GroceryManager = GroceryManager;
  window.groceryManager = new GroceryManager();
}
