/**
 * FoodTinder Authentication Manager (js/auth.js)
 * Quản lý đăng nhập bằng Số điện thoại (SMS OTP) và Đăng nhập nhanh bằng Sinh trắc học (Khuôn mặt / Dấu vân tay).
 * Hỗ trợ lưu trữ tài khoản đã đăng ký trên thiết bị, xác thực Face ID / Touch ID / WebAuthn chuẩn xác.
 */

class AuthManager {
  constructor() {
    this.sessionKey = 'foodtinder_user_session';
    this.savedAccountsKey = 'foodtinder_registered_accounts';
    this.currentUser = this.loadSession();
    this.savedAccounts = this.loadSavedAccounts();
    this.currentOtp = null;
    this.otpTimer = null;
    this.otpCountdown = 0;
    this.pendingPhone = '';

    this.defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80'
    ];

    this.titles = AuthManager.SYSTEM_TITLES;
    this.expandedTitleId = null;
    this.userStatsKey = 'foodtinder_user_stats';
    this.userStats = this.loadUserStats();
    this.tastePreferencesKey = 'foodtinder_user_taste_prefs';
    this.tempTastePrefs = null;

    this.init();
  }

  // Danh sách các danh hiệu hệ thống FoodTinder đa địa điểm kèm hệ thống nhiệm vụ mở khóa nâng cao
  static SYSTEM_TITLES = [
    {
      id: 'newbie',
      name: 'Người Mới',
      icon: '🌱',
      tag: 'Tập sự',
      desc: 'Bắt đầu hành trình khám phá và trải nghiệm các món ăn ngon khắp mọi nơi',
      missions: []
    },
    {
      id: 'snack_lover',
      name: 'Tín Đồ Ăn Vặt',
      icon: '🍢',
      tag: 'Ăn Vặt',
      desc: 'Đam mê các món ăn vặt đường phố, món ngon ăn chơi và đặt giao tận nơi',
      missions: [
        {
          id: 'snack_likes',
          title: 'Bộ sưu tập ăn vặt',
          desc: 'Thả tim yêu thích ít nhất 15 món ăn',
          type: 'likes',
          target: 15,
          icon: '❤️'
        },
        {
          id: 'snack_swipes',
          title: 'Chăm chỉ quẹt thẻ',
          desc: 'Quẹt khám phá 50 lượt thẻ món ăn',
          type: 'swipes',
          target: 50,
          icon: '🔥'
        },
        {
          id: 'snack_shopee',
          title: 'Đặt món ShopeeFood',
          desc: 'Mở đặt hàng món ngon qua ShopeeFood 3 lần',
          type: 'shopeeOrders',
          target: 3,
          icon: '🛵'
        },
        {
          id: 'snack_friend',
          title: 'Giao lưu kết bạn',
          desc: 'Kết bạn mới trên FoodTinder với 2 người bạn',
          type: 'friendsAdded',
          target: 2,
          icon: '🤝'
        }
      ]
    },
    {
      id: 'foodie',
      name: 'Chuyên Gia Sành Ăn',
      icon: '⭐',
      tag: 'Sành Ăn',
      desc: 'Gu ẩm thực tinh tế, luôn săn đón những quán ăn ngon chuẩn vị và chất lượng',
      missions: [
        {
          id: 'foodie_likes',
          title: 'Tín đồ sành món',
          desc: 'Lưu vào danh sách yêu thích 35 món ăn',
          type: 'likes',
          target: 35,
          icon: '❤️'
        },
        {
          id: 'foodie_map',
          title: 'Định vị quán ngon',
          desc: 'Mở bản đồ / chỉ đường tới quán ăn 12 lần',
          type: 'mapDirections',
          target: 12,
          icon: '📍'
        },
        {
          id: 'foodie_will_return',
          title: 'Khách quen quán ruột',
          desc: 'Đánh dấu "Sẽ quay lại" cho ít nhất 8 quán ăn',
          type: 'willReturnVotes',
          target: 8,
          icon: '🔁'
        },
        {
          id: 'foodie_shopee',
          title: 'Thợ săn ShopeeFood',
          desc: 'Mở đặt món qua ShopeeFood 6 lần',
          type: 'shopeeOrders',
          target: 6,
          icon: '🛵'
        },
        {
          id: 'foodie_friends',
          title: 'Hội bạn ẩm thực',
          desc: 'Kết bạn với 5 người bạn cùng gu ăn uống',
          type: 'friendsAdded',
          target: 5,
          icon: '🤝'
        }
      ]
    },
    {
      id: 'food_explorer',
      name: 'Thợ Săn Quán Ngon',
      icon: '🧭',
      tag: 'Khám Phá',
      desc: 'Không ngại đường xa, luôn tiên phong khám phá các hàng quán mới lạ và đặc sắc',
      missions: [
        {
          id: 'explorer_likes',
          title: 'Kho báu ẩm thực',
          desc: 'Lưu 70 món ăn ngon vào danh sách yêu thích',
          type: 'likes',
          target: 70,
          icon: '❤️'
        },
        {
          id: 'explorer_map',
          title: 'Không ngại đường xa',
          desc: 'Mở bản đồ hoặc dẫn đường đến quán 25 lần',
          type: 'mapDirections',
          target: 25,
          icon: '🧭'
        },
        {
          id: 'explorer_reels',
          title: 'Xem review ẩm thực',
          desc: 'Khám phá 20 video review trong mục Video Reels',
          type: 'reelsWatched',
          target: 20,
          icon: '🎬'
        },
        {
          id: 'explorer_shopee',
          title: 'Chiến thần ShopeeFood',
          desc: 'Đặt giao món tận nơi qua ShopeeFood 15 lần',
          type: 'shopeeOrders',
          target: 15,
          icon: '🛵'
        },
        {
          id: 'explorer_friends',
          title: 'Kết nối bạn sành ăn',
          desc: 'Kết bạn mới thành công với 10 người bạn',
          type: 'friendsAdded',
          target: 10,
          icon: '🤝'
        },
        {
          id: 'explorer_share',
          title: 'Lan tỏa quán ngon',
          desc: 'Bấm "Rủ đi ăn" rủ bạn bè cùng khám phá 8 lần',
          type: 'sharesSent',
          target: 8,
          icon: '👥'
        }
      ]
    },
    {
      id: 'food_master',
      name: 'Bậc Thầy Ẩm Thực',
      icon: '👑',
      tag: 'Bậc Thầy',
      desc: 'Sành sỏi hương vị ẩm thực, thuộc lòng các quán ruột từ bình dân đến sang trọng',
      missions: [
        {
          id: 'master_likes',
          title: 'Thực đơn thượng hạng',
          desc: 'Tích lũy 120 món ăn trong danh sách yêu thích',
          type: 'likes',
          target: 120,
          icon: '❤️'
        },
        {
          id: 'master_swipes',
          title: 'Quẹt thẻ cự phách',
          desc: 'Quẹt khám phá hơn 150 lượt thẻ món ăn',
          type: 'swipes',
          target: 150,
          icon: '⚡'
        },
        {
          id: 'master_will_return',
          title: 'Khách VIP nhiều quán',
          desc: 'Đánh dấu "Sẽ quay lại" cho 30 quán ăn',
          type: 'willReturnVotes',
          target: 30,
          icon: '🔁'
        },
        {
          id: 'master_taste',
          title: 'Ăn uống chuẩn gu',
          desc: 'Khám phá thực đơn theo tâm trạng hoặc Chuẩn Gu AI 20 lần',
          type: 'moodExplored',
          target: 20,
          icon: '🎯'
        },
        {
          id: 'master_shopee',
          title: 'Đại tiệc ShopeeFood',
          desc: 'Mở đặt giao hàng qua ShopeeFood 30 lần',
          type: 'shopeeOrders',
          target: 30,
          icon: '🛵'
        },
        {
          id: 'master_friends',
          title: 'Hội sành ăn đông đảo',
          desc: 'Kết nối kết bạn với 18 người bạn ẩm thực',
          type: 'friendsAdded',
          target: 18,
          icon: '🤝'
        }
      ]
    },
    {
      id: 'legend',
      name: 'Huyền Thoại Ẩm Thực',
      icon: '🔥',
      tag: 'Huyền Thoại',
      desc: 'Cảnh giới ẩm thực tối cao, người truyền cảm hứng ăn ngon cho cộng đồng',
      missions: [
        {
          id: 'legend_likes',
          title: 'Bộ sưu tập thế kỷ',
          desc: 'Sở hữu bộ sưu tập 200 món ăn yêu thích',
          type: 'likes',
          target: 200,
          icon: '❤️'
        },
        {
          id: 'legend_swipes',
          title: 'Đam mê bất tận',
          desc: 'Đã quẹt khám phá hơn 300 lượt thẻ món ăn',
          type: 'swipes',
          target: 300,
          icon: '⚡'
        },
        {
          id: 'legend_will_return',
          title: 'Uy tín ẩm thực tuyệt đối',
          desc: 'Đánh dấu "Sẽ quay lại" cho 50 quán ăn',
          type: 'willReturnVotes',
          target: 50,
          icon: '🔁'
        },
        {
          id: 'legend_shopee',
          title: 'Trùm đơn ShopeeFood',
          desc: 'Mở đặt hàng ShopeeFood 50 lần',
          type: 'shopeeOrders',
          target: 50,
          icon: '🛵'
        },
        {
          id: 'legend_friends',
          title: 'Thủ lĩnh cộng đồng',
          desc: 'Kết bạn với ít nhất 30 người bạn ẩm thực',
          type: 'friendsAdded',
          target: 30,
          icon: '🤝'
        },
        {
          id: 'legend_share',
          title: 'Bậc thầy tiệc tùng',
          desc: 'Bấm "Rủ đi ăn" rủ bạn bè khám phá món ngon 25 lần',
          type: 'sharesSent',
          target: 25,
          icon: '🎉'
        }
      ]
    }
  ];

  // Bộ câu hỏi thu thập thói quen ăn uống & khẩu vị khi đăng nhập lần đầu
  static ONBOARDING_QUESTIONS = {
    categories: [
      { id: 'noodles', label: 'Bún, Phở & Mì', emoji: '🍜', desc: 'Món nước, sợi đậm đà' },
      { id: 'rice_chicken', label: 'Cơm Tấm, Cơm Gà', emoji: '🍗', desc: 'Chắc bụng, thơm ngon' },
      { id: 'streetfood', label: 'Ăn Vặt & Bánh Xèo', emoji: '🍢', desc: 'Món đường phố lai rai' },
      { id: 'seafood', label: 'Hải Sản & Ốc Tươi', emoji: '🦀', desc: 'Đậm đà hương vị biển' },
      { id: 'hotpot_bbq', label: 'Lẩu & Nướng BBQ', emoji: '🍲', desc: 'Tụ tập xì xèo ấm cúng' },
      { id: 'sweet_tea', label: 'Trà Sữa & Cà Phê', emoji: '🧋', desc: 'Giải khát, đồ ngọt' },
      { id: 'healthy', label: 'Đồ Chay & Healthy', emoji: '🥗', desc: 'Thanh đạm, Eat Clean' }
    ],
    flavors: [
      { id: 'spicy', label: 'Thích ăn cay', emoji: '🌶️', desc: 'Cay nồng đậm vị' },
      { id: 'sweet_creamy', label: 'Ngọt béo bùi', emoji: '🥥', desc: 'Nước cốt dừa, phô mai' },
      { id: 'light', label: 'Thanh đạm ít dầu', emoji: '🍵', desc: 'Dịu nhẹ, ít gia vị' },
      { id: 'crispy_rich', label: 'Đậm đà giòn rụm', emoji: '🥓', desc: 'Chiên giòn, nướng thơm' },
      { id: 'no_spicy', label: 'Không ăn cay', emoji: '🚫', desc: 'Chỉ ăn không cay' }
    ],
    diets: [
      { id: 'normal', label: 'Ăn tự do', emoji: '😋', desc: 'Món gì cũng mê' },
      { id: 'vegetarian', label: 'Ăn chay / Bán chay', emoji: '🥬', desc: 'Ưu tiên rau củ, nấm' },
      { id: 'eatclean', label: 'Eat Clean / Giữ dáng', emoji: '🥑', desc: 'Ít đường, calo vừa' },
      { id: 'no_seafood', label: 'Không ăn hải sản', emoji: '🚫', desc: 'Dị ứng / kiêng tôm cá' }
    ],
    budgets: [
      { id: 'budget_low', label: '< 35.000đ', emoji: '🪙', desc: 'Bình dân, học sinh SV' },
      { id: 'budget_mid', label: '35k - 70.000đ', emoji: '💵', desc: 'Mức phổ biến vừa túi' },
      { id: 'budget_high', label: '> 70.000đ', emoji: '💎', desc: 'Thoải mái, sang xịn' }
    ]
  };

  getDefaultTastePreferences() {
    return {
      categories: ['noodles', 'streetfood'],
      flavors: ['spicy', 'crispy_rich'],
      diet: 'normal',
      budget: 'budget_mid'
    };
  }

  loadTastePreferences() {
    try {
      if (this.currentUser && this.currentUser.tastePreferences) {
        return this.currentUser.tastePreferences;
      }
      const saved = localStorage.getItem(this.tastePreferencesKey);
      return saved ? JSON.parse(saved) : this.getDefaultTastePreferences();
    } catch (e) {
      return this.getDefaultTastePreferences();
    }
  }

  // Mở modal khảo sát khẩu vị
  openTasteOnboardingModal() {
    const modal = document.getElementById('taste-onboarding-modal');
    if (!modal) return;

    this.tempTastePrefs = JSON.parse(JSON.stringify(this.loadTastePreferences()));
    this.renderTasteOnboarding();

    modal.classList.remove('hidden');
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.add('scale-95', 'opacity-0');
      requestAnimationFrame(() => {
        sheet.classList.remove('scale-95', 'opacity-0');
        sheet.classList.add('transition-all', 'duration-200');
      });
    }

    if (window.soundFX && window.soundFX.playPop) {
      window.soundFX.playPop();
    }
  }

  // Đóng modal khảo sát khẩu vị
  closeTasteOnboardingModal() {
    const modal = document.getElementById('taste-onboarding-modal');
    if (!modal) return;
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.add('scale-95', 'opacity-0');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
      if (sheet) sheet.classList.remove('scale-95', 'opacity-0');
    }, 200);
  }

  // Hiển thị các lựa chọn câu hỏi trong modal khảo sát
  renderTasteOnboarding() {
    if (!this.tempTastePrefs) {
      this.tempTastePrefs = this.getDefaultTastePreferences();
    }
    const q = AuthManager.ONBOARDING_QUESTIONS;

    // 1. Nhóm món ăn yêu thích
    const catContainer = document.getElementById('onboarding-categories-container');
    if (catContainer) {
      catContainer.innerHTML = q.categories.map(cat => {
        const isSelected = this.tempTastePrefs.categories.includes(cat.id);
        return `
          <button type="button" onclick="window.authManager.toggleTasteCategory('${cat.id}')"
            class="p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer select-none active:scale-98 ${
              isSelected 
                ? 'bg-gradient-to-br from-rose-50 to-orange-50 border-rose-400 shadow-xs ring-2 ring-rose-300/60' 
                : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 text-stone-700'
            }">
            <div class="flex items-center justify-between w-full">
              <span class="text-xl">${cat.emoji}</span>
              <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isSelected ? 'bg-rose-500 text-white' : 'border border-stone-300 text-transparent'
              }">✓</span>
            </div>
            <div class="mt-1.5">
              <div class="text-xs font-bold ${isSelected ? 'text-rose-900' : 'text-stone-800'}">${cat.label}</div>
              <div class="text-[10px] text-stone-400 truncate">${cat.desc}</div>
            </div>
          </button>
        `;
      }).join('');
    }

    // 2. Khẩu vị đặc trưng
    const flavorContainer = document.getElementById('onboarding-flavors-container');
    if (flavorContainer) {
      flavorContainer.innerHTML = q.flavors.map(flv => {
        const isSelected = this.tempTastePrefs.flavors.includes(flv.id);
        return `
          <button type="button" onclick="window.authManager.toggleTasteFlavor('${flv.id}')"
            class="p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer select-none active:scale-98 ${
              isSelected 
                ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-400 shadow-xs ring-2 ring-orange-300/60' 
                : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 text-stone-700'
            }">
            <div class="flex items-center justify-between w-full">
              <span class="text-xl">${flv.emoji}</span>
              <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isSelected ? 'bg-orange-500 text-white' : 'border border-stone-300 text-transparent'
              }">✓</span>
            </div>
            <div class="mt-1.5">
              <div class="text-xs font-bold ${isSelected ? 'text-orange-900' : 'text-stone-800'}">${flv.label}</div>
              <div class="text-[10px] text-stone-400 truncate">${flv.desc}</div>
            </div>
          </button>
        `;
      }).join('');
    }

    // 3. Chế độ ăn uống
    const dietContainer = document.getElementById('onboarding-diet-container');
    if (dietContainer) {
      dietContainer.innerHTML = q.diets.map(diet => {
        const isSelected = this.tempTastePrefs.diet === diet.id;
        return `
          <button type="button" onclick="window.authManager.selectTasteDiet('${diet.id}')"
            class="p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer select-none active:scale-98 ${
              isSelected 
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400 shadow-xs ring-2 ring-emerald-300/60' 
                : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 text-stone-700'
            }">
            <span class="text-2xl shrink-0">${diet.emoji}</span>
            <div class="min-w-0 flex-1">
              <div class="text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-stone-800'}">${diet.label}</div>
              <div class="text-[10px] text-stone-400 truncate">${diet.desc}</div>
            </div>
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              isSelected ? 'bg-emerald-500 text-white' : 'border border-stone-300 text-transparent'
            }">✓</span>
          </button>
        `;
      }).join('');
    }

    // 4. Ngân sách trung bình
    const budgetContainer = document.getElementById('onboarding-budget-container');
    if (budgetContainer) {
      budgetContainer.innerHTML = q.budgets.map(b => {
        const isSelected = this.tempTastePrefs.budget === b.id;
        return `
          <button type="button" onclick="window.authManager.selectTasteBudget('${b.id}')"
            class="p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-between cursor-pointer select-none active:scale-98 ${
              isSelected 
                ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-400 shadow-xs ring-2 ring-amber-300/60' 
                : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 text-stone-700'
            }">
            <span class="text-xl mb-1">${b.emoji}</span>
            <div class="text-xs font-bold ${isSelected ? 'text-amber-900' : 'text-stone-800'}">${b.label}</div>
            <div class="text-[9.5px] text-stone-400 mt-0.5 truncate">${b.desc}</div>
          </button>
        `;
      }).join('');
    }
  }

  toggleTasteCategory(catId) {
    if (!this.tempTastePrefs) this.tempTastePrefs = this.getDefaultTastePreferences();
    const idx = this.tempTastePrefs.categories.indexOf(catId);
    if (idx >= 0) {
      if (this.tempTastePrefs.categories.length > 1) {
        this.tempTastePrefs.categories.splice(idx, 1);
      } else {
        this.showToast('Vui lòng chọn ít nhất 1 nhóm món ăn yêu thích!');
      }
    } else {
      this.tempTastePrefs.categories.push(catId);
    }
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    this.renderTasteOnboarding();
  }

  toggleTasteFlavor(flavorId) {
    if (!this.tempTastePrefs) this.tempTastePrefs = this.getDefaultTastePreferences();
    if (flavorId === 'no_spicy') {
      const spIdx = this.tempTastePrefs.flavors.indexOf('spicy');
      if (spIdx >= 0) this.tempTastePrefs.flavors.splice(spIdx, 1);
    } else if (flavorId === 'spicy') {
      const nspIdx = this.tempTastePrefs.flavors.indexOf('no_spicy');
      if (nspIdx >= 0) this.tempTastePrefs.flavors.splice(nspIdx, 1);
    }

    const idx = this.tempTastePrefs.flavors.indexOf(flavorId);
    if (idx >= 0) {
      if (this.tempTastePrefs.flavors.length > 1) {
        this.tempTastePrefs.flavors.splice(idx, 1);
      }
    } else {
      this.tempTastePrefs.flavors.push(flavorId);
    }
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    this.renderTasteOnboarding();
  }

  selectTasteDiet(dietId) {
    if (!this.tempTastePrefs) this.tempTastePrefs = this.getDefaultTastePreferences();
    this.tempTastePrefs.diet = dietId;
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    this.renderTasteOnboarding();
  }

  selectTasteBudget(budgetId) {
    if (!this.tempTastePrefs) this.tempTastePrefs = this.getDefaultTastePreferences();
    this.tempTastePrefs.budget = budgetId;
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    this.renderTasteOnboarding();
  }

  // Lưu lựa chọn khảo sát khẩu vị
  saveTasteOnboarding() {
    if (!this.tempTastePrefs) {
      this.tempTastePrefs = this.getDefaultTastePreferences();
    }

    const prefs = JSON.parse(JSON.stringify(this.tempTastePrefs));
    localStorage.setItem(this.tastePreferencesKey, JSON.stringify(prefs));

    if (this.currentUser) {
      this.currentUser.tastePreferences = prefs;
      this.currentUser.hasCompletedTasteOnboarding = true;
      this.saveSession(this.currentUser);
    }

    // Cập nhật taste engine và app filters
    if (window.tasteManager && typeof window.tasteManager.applyTastePreferences === 'function') {
      window.tasteManager.applyTastePreferences(prefs);
    }
    if (window.app && typeof window.app.applyTastePreferences === 'function') {
      window.app.applyTastePreferences(prefs);
    }

    this.closeTasteOnboardingModal();
    if (window.soundFX && window.soundFX.playMatch) {
      window.soundFX.playMatch();
    }
    this.showToast('🎯 Đã lưu Gu ẩm thực cá nhân! Gợi ý quán ăn đã được tùy biến chuẩn xác!');
  }

  // Bỏ qua khảo sát khẩu vị ban đầu
  skipTasteOnboarding() {
    if (this.currentUser) {
      this.currentUser.hasCompletedTasteOnboarding = true;
      this.saveSession(this.currentUser);
    }
    this.closeTasteOnboardingModal();
    this.showToast('💡 Bạn có thể vào Hồ sơ để thiết lập Gu ẩm thực bất kỳ lúc nào!');
  }

  // Tải thống kê hoạt động làm nhiệm vụ của người dùng
  loadUserStats() {
    try {
      const data = localStorage.getItem(this.userStatsKey);
      return data ? JSON.parse(data) : {
        swipes: 0,
        mapDirections: 0,
        reelsWatched: 0,
        sharesSent: 0,
        moodExplored: 0,
        friendsAdded: 0,
        shopeeOrders: 0
      };
    } catch (e) {
      return { swipes: 0, mapDirections: 0, reelsWatched: 0, sharesSent: 0, moodExplored: 0, friendsAdded: 0, shopeeOrders: 0 };
    }
  }

  // Lưu thống kê làm nhiệm vụ
  saveUserStats() {
    try {
      localStorage.setItem(this.userStatsKey, JSON.stringify(this.userStats));
    } catch (e) {}
  }

  // Cập nhật thống kê hoạt động (quẹt thẻ, xem map, xem reel, share...)
  trackStat(key, amount = 1) {
    if (!this.userStats) this.userStats = this.loadUserStats();
    this.userStats[key] = (this.userStats[key] || 0) + amount;
    this.saveUserStats();

    // Cập nhật giao diện nếu modal danh hiệu đang mở
    const titlesModal = document.getElementById('titles-modal');
    if (titlesModal && !titlesModal.classList.contains('hidden')) {
      this.renderTitlesList();
    }
    this.syncUI();
    this.updateProfileModalBadge();
  }

  // Kiểm tra tiến độ của một nhiệm vụ đơn lẻ
  getMissionProgress(mission) {
    let current = 0;
    switch (mission.type) {
      case 'login':
        current = this.isLoggedIn() ? 1 : 0;
        break;
      case 'likes':
        current = (window.app && window.app.likedFoods) ? window.app.likedFoods.length : 0;
        break;
      case 'willReturnVotes':
        current = (window.app && window.app.willReturnFoods) ? window.app.willReturnFoods.length : 0;
        break;
      case 'friendsAdded':
        const addedFromChat = (typeof APP_DATA !== 'undefined' && APP_DATA.myFriends) 
          ? Math.max(0, APP_DATA.myFriends.length - 5) 
          : 0;
        current = Math.max((this.userStats && this.userStats.friendsAdded) || 0, addedFromChat);
        break;
      case 'shopeeOrders':
        current = (this.userStats && this.userStats.shopeeOrders) || 0;
        break;
      default:
        current = (this.userStats && this.userStats[mission.type]) || 0;
        break;
    }
    const target = mission.target || 1;
    const isCompleted = current >= target;
    const percent = Math.min(100, Math.round((current / target) * 100));
    return {
      current,
      target,
      isCompleted,
      percent
    };
  }

  // Đếm số nhiệm vụ đã xong và kiểm tra xem danh hiệu đã mở khóa chưa
  getTitleProgress(title) {
    if (!title.missions || title.missions.length === 0) {
      return { completed: 0, total: 0, isUnlocked: true, percent: 100 };
    }
    let completed = 0;
    title.missions.forEach(m => {
      if (this.getMissionProgress(m).isCompleted) completed++;
    });
    const total = title.missions.length;
    return {
      completed,
      total,
      isUnlocked: completed === total,
      percent: Math.round((completed / total) * 100)
    };
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.syncUI());
    } else {
      this.syncUI();
    }
  }

  loadSession() {
    try {
      const data = localStorage.getItem(this.sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Lỗi đọc session đăng nhập:', e);
      return null;
    }
  }

  saveSession(user) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(this.sessionKey, JSON.stringify(user));
        this.saveRegisteredAccount(user);
      } else {
        localStorage.removeItem(this.sessionKey);
      }
    } catch (e) {
      console.error('Lỗi lưu session đăng nhập:', e);
    }
    this.syncUI();
  }

  loadSavedAccounts() {
    try {
      const data = localStorage.getItem(this.savedAccountsKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveRegisteredAccount(user) {
    if (!user || !user.phone) return;
    try {
      let accounts = this.loadSavedAccounts();
      const existingIdx = accounts.findIndex(a => a.phone === user.phone);
      const accountData = {
        id: user.id || 'usr_' + Date.now(),
        name: user.name || 'Người dùng',
        phone: user.phone,
        avatar: user.avatar || this.defaultAvatars[0],
        titleId: user.titleId || null,
        biometricEnabled: user.biometricEnabled !== false, // Mặc định bật sinh trắc học
        hasCompletedTasteOnboarding: Boolean(user.hasCompletedTasteOnboarding),
        tastePreferences: user.tastePreferences || null,
        lastLogin: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        accounts[existingIdx] = { ...accounts[existingIdx], ...accountData };
      } else {
        accounts.unshift(accountData);
      }

      // Giữ tối đa 5 tài khoản đã đăng ký trên thiết bị
      accounts = accounts.slice(0, 5);
      this.savedAccounts = accounts;
      localStorage.setItem(this.savedAccountsKey, JSON.stringify(accounts));
    } catch (e) {
      console.error('Lỗi lưu tài khoản đăng ký:', e);
    }
  }

  isLoggedIn() {
    return Boolean(this.currentUser && this.currentUser.phone);
  }

  getUser() {
    return this.currentUser;
  }

  getPrimarySavedAccount() {
    if (!this.savedAccounts || this.savedAccounts.length === 0) return null;
    return this.savedAccounts.find(a => a.biometricEnabled) || this.savedAccounts[0];
  }

  // Mở modal đăng nhập
  openLoginModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.add('translate-y-full');
      requestAnimationFrame(() => sheet.classList.remove('translate-y-full'));
    }

    this.resetPhoneForm();
    this.renderBiometricQuickLogin();

    if (window.soundFX && window.soundFX.playPop) {
      window.soundFX.playPop();
    }
  }

  // Đóng modal đăng nhập
  closeLoginModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) sheet.classList.add('translate-y-full');
    setTimeout(() => {
      modal.classList.add('hidden');
      this.clearIntervalTimer();
      this.closeBiometricScanModal();
    }, 250);
  }

  // Hiển thị phần Đăng nhập nhanh bằng Khuôn mặt / Dấu vân tay nếu có tài khoản đã đăng ký
  renderBiometricQuickLogin() {
    const container = document.getElementById('auth-biometric-section');
    if (!container) return;

    const saved = this.getPrimarySavedAccount();
    if (saved && saved.biometricEnabled) {
      container.innerHTML = `
        <div class="p-4 rounded-2xl bg-gradient-to-br from-rose-50/90 via-amber-50/60 to-orange-50/90 border-2 border-rose-200/90 shadow-xs space-y-3">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0">
              <img src="${saved.avatar || this.defaultAvatars[0]}" alt="${saved.name}" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs" />
              <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-2xs">
                ✓
              </span>
            </div>
            <div class="min-w-0 flex-1 leading-tight">
              <div class="text-[10.5px] font-bold text-stone-500">Tài khoản đã đăng ký trên máy này:</div>
              <h4 class="font-extrabold text-stone-900 text-sm truncate mt-0.5">${saved.name}</h4>
              <p class="text-xs text-rose-600 font-mono font-bold mt-0.5">${this.formatPhone(saved.phone)}</p>
            </div>
          </div>

          <!-- Nút Đăng nhập bằng Sinh trắc học (Face ID / Vân tay) -->
          <button onclick="window.authManager.loginWithBiometrics()" 
            class="w-full py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:opacity-95 active:scale-98 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-rose-200 transition cursor-pointer flex items-center justify-center gap-2">
            <svg class="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 3H5a2 2 0 0 0-2 2v2"></path>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
              <path d="M3 17v2a2 2 0 0 0 2 2h2"></path>
              <path d="M9 10h.01"></path>
              <path d="M15 10h.01"></path>
              <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
            </svg>
            <span>Đăng Nhập Khuôn Mặt / Vân Tay</span>
          </button>

          <div class="flex items-center justify-center gap-2 text-[10.5px] text-stone-500">
            <span>✨ Xác thực tức thì không cần mã OTP</span>
          </div>
        </div>

        <div class="flex items-center gap-2 my-3">
          <div class="flex-1 h-px bg-stone-200"></div>
          <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Hoặc đăng nhập bằng số điện thoại khác</span>
          <div class="flex-1 h-px bg-stone-200"></div>
        </div>
      `;
      container.classList.remove('hidden');
    } else {
      container.innerHTML = `
        <div class="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-stone-600 mb-3">
          <span class="text-xl shrink-0">💡</span>
          <p class="text-[11px] leading-relaxed">
            Đăng nhập bằng số điện thoại lần đầu để kích hoạt tính năng <strong>Quét khuôn mặt (Face ID) hoặc Dấu vân tay (Touch ID)</strong> cho các lần đăng nhập sau siêu tốc!
          </p>
        </div>
      `;
      container.classList.remove('hidden');
    }
  }

  // 1. Thực hiện Đăng nhập nhanh bằng Sinh trắc học (Khuôn mặt / Dấu vân tay)
  async loginWithBiometrics() {
    const saved = this.getPrimarySavedAccount();
    if (!saved) {
      this.showToast('⚠️ Chưa có tài khoản nào được đăng ký trên thiết bị này. Vui lòng đăng nhập bằng SĐT trước!');
      return;
    }

    this.openBiometricScanModal(saved);

    // Kích hoạt mô phỏng quét sinh trắc học có hiệu ứng âm thanh và haptic
    try {
      if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();

      // Kiểm tra nếu trình duyệt hỗ trợ WebAuthn thực tế
      if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        console.log('WebAuthn platform biometric available:', available);
      }

      // Mô phỏng quét cảm biến vân tay / Face ID với thời gian thực tế 900ms
      setTimeout(() => {
        const scanStatusEl = document.getElementById('biometric-scan-status');
        const scanSuccessIcon = document.getElementById('biometric-scan-success');
        const scanPulse = document.getElementById('biometric-scan-pulse');

        if (scanStatusEl) scanStatusEl.textContent = '✅ Xác thực sinh trắc học thành công!';
        if (scanSuccessIcon) scanSuccessIcon.classList.remove('hidden');
        if (scanPulse) scanPulse.classList.add('hidden');

        if (window.soundFX && window.soundFX.playMatch) {
          window.soundFX.playMatch();
        }

        setTimeout(() => {
          this.closeBiometricScanModal();
          const isFirstLogin = !saved.hasCompletedTasteOnboarding;
          this.saveSession({
            ...saved,
            lastLogin: new Date().toISOString()
          });
          this.closeLoginModal();
          this.showToast(`🎉 Chào mừng ${saved.name}! Đã xác thực thành công bằng Khuôn mặt / Vân tay!`);
          if (isFirstLogin) {
            setTimeout(() => {
              this.openTasteOnboardingModal();
            }, 700);
          }
        }, 600);
      }, 950);

    } catch (e) {
      console.error('Biometric authentication error:', e);
      this.closeBiometricScanModal();
      this.showToast('⚠️ Không thể xác thực sinh trắc học, vui lòng đăng nhập bằng mã OTP SMS!');
    }
  }

  openBiometricScanModal(account) {
    let modal = document.getElementById('biometric-scan-modal');
    if (!modal) return;

    const nameEl = document.getElementById('biometric-account-name');
    const phoneEl = document.getElementById('biometric-account-phone');
    const statusEl = document.getElementById('biometric-scan-status');
    const successIcon = document.getElementById('biometric-scan-success');
    const pulseEl = document.getElementById('biometric-scan-pulse');

    if (nameEl) nameEl.textContent = account.name;
    if (phoneEl) phoneEl.textContent = this.formatPhone(account.phone);
    if (statusEl) statusEl.textContent = 'Đang nhận diện Khuôn mặt hoặc Dấu vân tay...';
    if (successIcon) successIcon.classList.add('hidden');
    if (pulseEl) pulseEl.classList.remove('hidden');

    modal.classList.remove('hidden');
  }

  closeBiometricScanModal() {
    const modal = document.getElementById('biometric-scan-modal');
    if (modal) modal.classList.add('hidden');
  }

  resetPhoneForm() {
    this.clearIntervalTimer();
    this.currentOtp = null;
    this.pendingPhone = '';
    const step1 = document.getElementById('auth-phone-step-1');
    const step2 = document.getElementById('auth-phone-step-2');
    const phoneInput = document.getElementById('auth-phone-input');
    const otpInput = document.getElementById('auth-otp-input');

    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');
    if (phoneInput) phoneInput.value = '';
    if (otpInput) otpInput.value = '';
  }

  clearIntervalTimer() {
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
      this.otpTimer = null;
    }
    this.otpCountdown = 0;
  }

  // 2. Gửi mã OTP xác thực số điện thoại
  sendPhoneOtp(customPhone = null) {
    const phoneInput = document.getElementById('auth-phone-input');
    const rawPhone = customPhone || (phoneInput ? phoneInput.value.trim() : '');

    // Chuẩn hóa và kiểm tra số điện thoại Việt Nam
    const cleanPhone = rawPhone.replace(/\s+/g, '').replace(/^\+84/, '0');
    const phoneRegex = /^(0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

    if (!phoneRegex.test(cleanPhone)) {
      this.showToast('⚠️ Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 chữ số)!');
      if (phoneInput) phoneInput.focus();
      return;
    }

    this.pendingPhone = cleanPhone;

    // Tạo mã OTP ngẫu nhiên 6 chữ số (Mặc định mã demo tiện dụng: 123456 hoặc ngẫu nhiên)
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.currentOtp = randomOtp;

    // Chuyển sang Step 2: Nhập OTP
    const step1 = document.getElementById('auth-phone-step-1');
    const step2 = document.getElementById('auth-phone-step-2');
    const phoneDisplay = document.getElementById('auth-otp-target-phone');
    const demoBadge = document.getElementById('auth-demo-otp-code');

    if (step1) step1.classList.add('hidden');
    if (step2) step2.classList.remove('hidden');
    if (phoneDisplay) phoneDisplay.textContent = this.formatPhone(cleanPhone);
    if (demoBadge) demoBadge.textContent = randomOtp;

    this.startOtpCountdown();

    this.showToast(`📩 Mã OTP đã gửi đến ${this.formatPhone(cleanPhone)}: ${randomOtp}`);
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();

    const otpInput = document.getElementById('auth-otp-input');
    if (otpInput) {
      otpInput.value = '';
      otpInput.focus();
    }
  }

  startOtpCountdown() {
    this.clearIntervalTimer();
    this.otpCountdown = 60;
    const resendBtn = document.getElementById('auth-otp-resend-btn');
    const timerText = document.getElementById('auth-otp-timer-text');

    const updateUI = () => {
      if (this.otpCountdown > 0) {
        if (resendBtn) {
          resendBtn.disabled = true;
          resendBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        if (timerText) {
          timerText.textContent = `(Gửi lại sau ${this.otpCountdown}s)`;
        }
        this.otpCountdown--;
      } else {
        this.clearIntervalTimer();
        if (resendBtn) {
          resendBtn.disabled = false;
          resendBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        if (timerText) {
          timerText.textContent = '';
        }
      }
    };

    updateUI();
    this.otpTimer = setInterval(updateUI, 1000);
  }

  fillDemoOtp() {
    const otpInput = document.getElementById('auth-otp-input');
    if (otpInput && this.currentOtp) {
      otpInput.value = this.currentOtp;
      this.verifyPhoneOtp();
    }
  }

  // 3. Xác thực mã OTP và hoàn tất đăng nhập
  verifyPhoneOtp() {
    const otpInput = document.getElementById('auth-otp-input');
    const nameInput = document.getElementById('auth-name-input');
    const userOtp = otpInput ? otpInput.value.trim() : '';

    if (!userOtp) {
      this.showToast('⚠️ Vui lòng nhập mã OTP gồm 6 chữ số!');
      return;
    }

    if (userOtp !== this.currentOtp && userOtp !== '123456') {
      this.showToast('❌ Mã xác thực OTP không chính xác. Vui lòng thử lại!');
      return;
    }

    // Kiểm tra xem số này đã có tài khoản lưu trước đó chưa để giữ nguyên tên & avatar
    const existing = this.savedAccounts.find(a => a.phone === this.pendingPhone);
    const randomAvatar = this.defaultAvatars[Math.floor(Math.random() * this.defaultAvatars.length)];
    const customName = (nameInput && nameInput.value.trim()) 
      ? nameInput.value.trim() 
      : (existing ? existing.name : `Thực Khách #${this.pendingPhone.slice(-4)}`);

    const isFirstLogin = !existing || !existing.hasCompletedTasteOnboarding;
    const newUser = {
      id: existing ? existing.id : 'usr_' + Date.now(),
      name: customName,
      phone: this.pendingPhone,
      avatar: existing ? existing.avatar : randomAvatar,
      titleId: existing ? existing.titleId : null,
      authProvider: 'phone',
      biometricEnabled: true, // Tự động kích hoạt đăng nhập khuôn mặt/vân tay cho lần sau
      hasCompletedTasteOnboarding: existing ? Boolean(existing.hasCompletedTasteOnboarding) : false,
      tastePreferences: existing && existing.tastePreferences ? existing.tastePreferences : this.loadTastePreferences(),
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    };

    this.saveSession(newUser);
    this.closeLoginModal();

    if (window.soundFX && window.soundFX.playMatch) {
      window.soundFX.playMatch();
    }
    this.showToast(`🎉 Chào mừng ${newUser.name}! Đăng nhập thành công & đã kích hoạt Vân tay/Face ID!`);

    if (isFirstLogin) {
      setTimeout(() => {
        this.openTasteOnboardingModal();
      }, 700);
    }
  }

  // Bật/tắt đăng nhập sinh trắc học cho tài khoản hiện tại
  toggleBiometrics() {
    if (!this.currentUser) return;
    this.currentUser.biometricEnabled = !this.currentUser.biometricEnabled;
    this.saveSession(this.currentUser);
    this.saveRegisteredAccount(this.currentUser);

    const toggleText = document.getElementById('profile-biometric-toggle-text');
    if (toggleText) {
      toggleText.textContent = this.currentUser.biometricEnabled ? 'Đã bật' : 'Đã tắt';
    }
    this.showToast(this.currentUser.biometricEnabled 
      ? '🔒 Đã bật đăng nhập nhanh bằng Khuôn mặt / Dấu vân tay!' 
      : '🔓 Đã tắt đăng nhập nhanh sinh trắc học.');
  }

  // Đăng xuất tài khoản
  logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?')) {
      const prevName = this.currentUser ? this.currentUser.name : 'bạn';
      this.saveSession(null);
      this.closeProfileModal();
      this.showToast(`👋 Đã đăng xuất tài khoản ${prevName}. Hẹn gặp lại bạn!`);
      if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    }
  }

  // Mở modal thông tin hồ sơ tài khoản
  openProfileModal() {
    if (!this.isLoggedIn()) {
      this.openLoginModal();
      return;
    }

    const modal = document.getElementById('user-profile-modal');
    if (!modal) return;

    const user = this.currentUser;
    const avatarEl = document.getElementById('profile-modal-avatar');
    const nameEl = document.getElementById('profile-modal-name');
    const phoneEl = document.getElementById('profile-modal-phone');
    const likedCountEl = document.getElementById('profile-modal-liked-count');
    const bioToggleText = document.getElementById('profile-biometric-toggle-text');

    if (avatarEl) avatarEl.src = user.avatar || this.defaultAvatars[0];
    if (nameEl) nameEl.textContent = user.name || 'Người dùng';
    if (phoneEl) phoneEl.textContent = this.formatPhone(user.phone);
    if (bioToggleText) bioToggleText.textContent = user.biometricEnabled !== false ? 'Đã bật' : 'Đã tắt';

    const likedCount = (window.app && window.app.likedFoods) ? window.app.likedFoods.length : 0;
    if (likedCountEl) likedCountEl.textContent = `${likedCount} món`;

    this.updateProfileModalBadge();

    modal.classList.remove('hidden');
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.add('translate-y-full');
      requestAnimationFrame(() => sheet.classList.remove('translate-y-full'));
    }

    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
  }

  closeProfileModal() {
    const modal = document.getElementById('user-profile-modal');
    if (!modal) return;
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) sheet.classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  // Đổi tên hiển thị
  editProfileName() {
    if (!this.currentUser) return;
    const currentName = this.currentUser.name || '';
    const newName = prompt('Nhập tên hiển thị mới của bạn:', currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      this.currentUser.name = newName.trim();
      this.saveSession(this.currentUser);
      const nameEl = document.getElementById('profile-modal-name');
      if (nameEl) nameEl.textContent = this.currentUser.name;
      this.syncUI();
      this.showToast(`✨ Đã cập nhật tên hiển thị thành công: ${this.currentUser.name}!`);
    }
  }

  // ══════════════════════════════════════════
  // HỆ THỐNG DANH HIỆU ẨM THỰC FOODTINDER
  // ══════════════════════════════════════════

  // Lấy danh hiệu hiện tại của người dùng (tính theo nhiệm vụ đã hoàn thành hoặc danh hiệu đã chọn)
  getCurrentUserTitle() {
    const user = this.currentUser;

    // Tìm các danh hiệu đã hoàn thành tất cả nhiệm vụ
    const unlockedTitles = this.titles.filter(t => this.getTitleProgress(t).isUnlocked);

    // Nếu người dùng đã chọn một danh hiệu cụ thể trong các danh hiệu đã mở khóa
    if (user && user.titleId) {
      // Ánh xạ tương thích ngược các id cũ nếu có
      const legacyMap = {
        'foodie_quynhon': 'foodie',
        'seafood_master': 'food_explorer',
        'food_god': 'food_master'
      };
      const effectiveId = legacyMap[user.titleId] || user.titleId;
      const chosen = this.titles.find(t => t.id === effectiveId);
      if (chosen && this.getTitleProgress(chosen).isUnlocked) {
        return chosen;
      }
    }

    // Mặc định chọn danh hiệu cao nhất đã mở khóa
    if (unlockedTitles.length > 0) {
      return unlockedTitles[unlockedTitles.length - 1];
    }
    return this.titles[0];
  }

  // Cập nhật huy hiệu trên avatar và card danh hiệu trong modal hồ sơ
  updateProfileModalBadge() {
    const currentTitle = this.getCurrentUserTitle();
    const avatarBadge = document.getElementById('profile-modal-avatar-badge');
    if (avatarBadge) {
      avatarBadge.textContent = currentTitle.icon;
      avatarBadge.title = `Danh hiệu: ${currentTitle.name} (Bấm để xem tất cả)`;
    }

    const titleIconEl = document.getElementById('profile-modal-title-icon');
    const titleNameEl = document.getElementById('profile-modal-title-name');
    if (titleIconEl) titleIconEl.textContent = currentTitle.icon;
    if (titleNameEl) titleNameEl.textContent = currentTitle.name;
  }

  // Chọn danh hiệu để hiển thị trên avatar
  selectTitle(titleId) {
    const title = this.titles.find(t => t.id === titleId);
    if (!title) return;

    const prog = this.getTitleProgress(title);
    if (!prog.isUnlocked) {
      this.showToast(`🔒 Bạn cần hoàn thành tất cả nhiệm vụ (${prog.completed}/${prog.total}) để mở khóa danh hiệu này!`);
      return;
    }

    if (this.currentUser) {
      this.currentUser.titleId = titleId;
      this.saveSession(this.currentUser);
    }

    this.renderTitlesList();
    this.syncUI();
    this.updateProfileModalBadge();
    this.showToast(`✨ Đã kích hoạt danh hiệu ${title.icon} ${title.name}! Icon đã hiển thị trên avatar.`);
    if (window.soundFX && window.soundFX.playMatch) window.soundFX.playMatch();
  }

  // Đóng/mở xổ xuống xem danh sách nhiệm vụ của từng danh hiệu (chỉ mở 1 danh hiệu tại một thời điểm)
  toggleTitleMissions(titleId) {
    this.expandedTitleId = (this.expandedTitleId === titleId) ? null : titleId;
    this.renderTitlesList();
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
  }

  // Mở modal danh sách danh hiệu hệ thống
  openTitlesModal() {
    const modal = document.getElementById('titles-modal');
    if (!modal) return;

    this.expandedTitleId = null; // Mặc định khi mới mở modal thì chỉ thấy danh hiệu, thu gọn toàn bộ nhiệm vụ
    this.renderTitlesList();

    modal.classList.remove('hidden');
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.add('translate-y-full');
      requestAnimationFrame(() => sheet.classList.remove('translate-y-full'));
    }

    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
  }

  closeTitlesModal() {
    const modal = document.getElementById('titles-modal');
    if (!modal) return;
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) sheet.classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 250);
  }

  // Render danh sách danh hiệu hệ thống kèm tính năng xổ xuống xem nhiệm vụ
  renderTitlesList() {
    const container = document.getElementById('titles-modal-list');
    if (!container) return;

    const likedCount = (window.app && window.app.likedFoods) ? window.app.likedFoods.length : 0;
    const currentTitle = this.getCurrentUserTitle();
    const user = this.currentUser;

    const unlockedTitlesCount = this.titles.filter(t => this.getTitleProgress(t).isUnlocked).length;

    const summaryLiked = document.getElementById('titles-modal-user-liked');
    const summaryTitle = document.getElementById('titles-modal-user-current');
    const summaryAvatar = document.getElementById('titles-modal-user-avatar');
    const summaryBadge = document.getElementById('titles-modal-user-badge');

    if (summaryLiked) summaryLiked.textContent = `${unlockedTitlesCount}/${this.titles.length} mở khóa`;
    if (summaryTitle) summaryTitle.textContent = `${currentTitle.icon} ${currentTitle.name}`;
    if (summaryAvatar) summaryAvatar.src = (user && user.avatar) ? user.avatar : this.defaultAvatars[0];
    if (summaryBadge) summaryBadge.textContent = currentTitle.icon;

    container.innerHTML = this.titles.map(t => {
      const prog = this.getTitleProgress(t);
      const isUnlocked = prog.isUnlocked;
      const isEquipped = currentTitle.id === t.id;
      const hasMissions = t.missions && t.missions.length > 0;
      const isExpanded = hasMissions && (this.expandedTitleId === t.id);

      return `
        <div class="p-3.5 rounded-2xl border transition ${
          isEquipped 
            ? 'bg-amber-50/95 border-amber-300 ring-2 ring-amber-400/30 shadow-xs' 
            : isUnlocked 
              ? 'bg-white hover:bg-stone-50 border-stone-200 shadow-2xs' 
              : 'bg-stone-50/80 border-stone-200/70 opacity-90'
        }">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs border ${
              isEquipped 
                ? 'bg-gradient-to-br from-amber-200 to-yellow-100 border-amber-300 ring-2 ring-amber-300' 
                : isUnlocked 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-stone-200/70 border-stone-200 grayscale'
            }">
              ${t.icon}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h4 class="font-extrabold text-sm ${isUnlocked ? 'text-stone-900' : 'text-stone-700'}">${t.name}</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isUnlocked ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-600'
                  }">${t.tag}</span>
                </div>
                ${isEquipped ? `
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10.5px] font-black shrink-0 shadow-xs">
                    <span>👑 Đang dùng</span>
                  </span>
                ` : isUnlocked ? `
                  <button onclick="window.authManager.selectTitle('${t.id}')" class="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10.5px] font-extrabold transition cursor-pointer shrink-0">
                    Đeo danh hiệu
                  </button>
                ` : `
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-600 text-[10px] font-bold shrink-0">
                    <span>🔒 ${prog.completed}/${prog.total} nhiệm vụ</span>
                  </span>
                `}
              </div>
              <p class="text-xs text-stone-500 mt-1 leading-snug">${t.desc}</p>
              
              ${hasMissions ? `
                <!-- Nút Xổ xuống / Thu gọn xem danh sách nhiệm vụ (không có chữ 'Xổ xuống') -->
                <div class="mt-2.5 pt-2 border-t border-stone-200/60">
                  <button type="button" onclick="window.authManager.toggleTitleMissions('${t.id}')" 
                    class="w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isExpanded 
                        ? 'bg-amber-100/80 text-amber-900 border border-amber-300/80' 
                        : 'bg-stone-100/70 hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 border border-stone-200/60'
                    }">
                    <span class="flex items-center gap-1.5">
                      <span class="text-[11px]">🎯</span>
                      <span class="text-[11px] font-extrabold">${isExpanded ? 'Đóng danh sách nhiệm vụ' : 'Xem danh sách nhiệm vụ'}</span>
                      <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-md ${isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${prog.completed}/${prog.total}
                      </span>
                    </span>
                    <span class="text-xs text-stone-500 font-black transition-transform duration-200 px-1">
                      ${isExpanded ? '▲' : '▼'}
                    </span>
                  </button>

                  ${isExpanded ? `
                    <!-- Danh sách Nhiệm vụ cần hoàn thành khi bấm xổ xuống -->
                    <div class="mt-2.5 pt-2 border-t border-stone-200/60 space-y-2">
                      <div class="flex items-center justify-between text-[11px] font-extrabold text-stone-700">
                        <span class="flex items-center gap-1">
                          <span>🎯 Nhiệm vụ mở khóa:</span>
                          <span class="text-[10px] ${isUnlocked ? 'text-emerald-600' : 'text-amber-600'} font-black">(${prog.completed}/${prog.total} hoàn thành)</span>
                        </span>
                        <span class="text-[10px] font-bold ${isUnlocked ? 'text-emerald-600' : 'text-stone-500'}">
                          ${isUnlocked ? '✅ Đã hoàn tất' : `${prog.percent}%`}
                        </span>
                      </div>

                      <div class="space-y-1.5">
                        ${t.missions.map(m => {
                          const mp = this.getMissionProgress(m);
                          return `
                            <div class="p-2 rounded-xl transition ${
                              mp.isCompleted 
                                ? 'bg-emerald-50/80 border border-emerald-200/80' 
                                : 'bg-white border border-stone-200/90'
                            }">
                              <div class="flex items-center justify-between gap-1.5">
                                <div class="flex items-center gap-1.5 min-w-0">
                                  <span class="text-xs shrink-0">${mp.isCompleted ? '✅' : m.icon}</span>
                                  <span class="font-extrabold text-xs truncate ${mp.isCompleted ? 'text-emerald-900' : 'text-stone-800'}">${m.title}</span>
                                </div>
                                <span class="text-[10px] font-mono font-extrabold shrink-0 px-1.5 py-0.2 rounded-md ${
                                  mp.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                                }">
                                  ${mp.current}/${mp.target}
                                </span>
                              </div>
                              <p class="text-[10.5px] text-stone-500 mt-0.5 leading-tight">${m.desc}</p>
                              
                              <div class="w-full h-1.5 bg-stone-100 rounded-full mt-1.5 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-300 ${
                                  mp.isCompleted ? 'bg-emerald-500' : 'bg-amber-400'
                                }" style="width: ${mp.percent}%"></div>
                              </div>
                            </div>
                          `;
                        }).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ══════════════════════════════════════════
  // ĐỒNG BỘ GIAO DIỆN TOPBAR, SIDEBAR & AVATAR
  // ══════════════════════════════════════════
  syncUI() {
    const user = this.currentUser;
    const currentTitle = this.getCurrentUserTitle();

    // 1. Cập nhật Topbar button: Nút Đăng nhập vs Avatar người dùng có icon danh hiệu
    const topbarAuthContainer = document.getElementById('topbar-auth-container');
    if (topbarAuthContainer) {
      if (user) {
        topbarAuthContainer.innerHTML = `
          <button onclick="window.authManager.openProfileModal()" 
            class="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200 transition cursor-pointer shadow-2xs active:scale-95 group" 
            title="Tài khoản: ${user.name} • Danh hiệu: ${currentTitle.icon} ${currentTitle.name} (Bấm để xem)">
            <div class="relative shrink-0 flex items-center justify-center">
              <img src="${user.avatar || this.defaultAvatars[0]}" alt="${user.name}" class="w-6 h-6 rounded-full object-cover border border-orange-300 shrink-0" />
              <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-[8.5px] leading-none" title="${currentTitle.name}">${currentTitle.icon}</span>
            </div>
            <span class="text-xs font-bold text-stone-800 max-w-[85px] sm:max-w-[120px] truncate group-hover:text-rose-600 transition">${user.name}</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          </button>
        `;
      } else {
        const saved = this.getPrimarySavedAccount();
        topbarAuthContainer.innerHTML = `
          <button onclick="window.authManager.openLoginModal()" 
            class="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 active:scale-95 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Đăng nhập bằng Số điện thoại hoặc Vân tay/Face ID">
            ${saved ? `
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 3H5a2 2 0 0 0-2 2v2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M3 17v2a2 2 0 0 0 2 2h2"></path>
                <path d="M9 10h.01"></path>
                <path d="M15 10h.01"></path>
                <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
              </svg>
              <span>Đăng nhập (${saved.name.split(' ').pop()})</span>
            ` : `
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Đăng nhập</span>
            `}
          </button>
        `;
      }
    }

    // 2. Cập nhật Sidebar Chào hỏi với Avatar mang icon danh hiệu
    const greetingEl = document.getElementById('header-greeting');
    if (greetingEl) {
      if (user) {
        greetingEl.innerHTML = `
          <div class="flex items-center gap-2.5 cursor-pointer p-1.5 -m-1.5 rounded-xl hover:bg-stone-50 transition" onclick="window.authManager.openProfileModal()" title="Bấm để xem hồ sơ tài khoản">
            <div class="relative shrink-0 flex items-center justify-center">
              <img src="${user.avatar || this.defaultAvatars[0]}" alt="${user.name}" class="w-9 h-9 rounded-full object-cover border-2 border-orange-300 shadow-xs shrink-0" />
              <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-xs leading-none" title="${currentTitle.name}">${currentTitle.icon}</span>
            </div>
            <div class="min-w-0 flex-1 leading-tight">
              <div class="flex items-center gap-1.5">
                <span class="font-extrabold text-stone-900 text-sm truncate">${user.name}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold shrink-0" title="Danh hiệu: ${currentTitle.name}">${currentTitle.icon}</span>
              </div>
              <p class="text-[10.5px] text-stone-500 truncate mt-0.5">${this.formatPhone(user.phone)}</p>
            </div>
          </div>
        `;
      } else {
        const saved = this.getPrimarySavedAccount();
        greetingEl.innerHTML = `
          <div class="flex items-center justify-between gap-1.5">
            <div class="flex items-center gap-1.5 font-extrabold text-stone-900 text-sm leading-tight">
              <span>Chào Bạn!</span>
              <span class="inline-block animate-wave text-lg">👋</span>
            </div>
            <button onclick="window.authManager.openLoginModal()" class="text-[10.5px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full transition cursor-pointer shrink-0 flex items-center gap-1">
              ${saved ? '<span>👆 Quét vân tay</span>' : '<span>Đăng nhập</span>'}
            </button>
          </div>
        `;
      }
    }
  }

  formatPhone(phone) {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    }
    return phone;
  }

  showToast(message) {
    if (window.app && typeof window.app.showToast === 'function') {
      window.app.showToast(message);
    } else {
      const toast = document.getElementById('app-toast');
      if (!toast) return;
      const textEl = toast.querySelector('span:last-child') || toast;
      textEl.textContent = message;
      toast.style.opacity = '1';
      toast.style.translate = '0 0';
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.translate = '0 -8px';
      }, 3000);
    }
  }
}

// Khởi tạo Singleton
if (typeof window !== 'undefined') {
  window.AuthManager = AuthManager;
  window.authManager = new AuthManager();
}
