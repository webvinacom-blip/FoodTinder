/**
 * FoodTinder Authentication Manager (js/auth.js)
 * Quản lý đăng nhập bằng Số điện thoại (SMS OTP) và Xác thực tài khoản Zalo.
 * Hỗ trợ lưu trữ phiên đăng nhập, đồng bộ trạng thái giao diện và sẵn sàng kết nối API thật.
 */

class AuthManager {
  constructor() {
    this.storageKey = 'foodtinder_user_session';
    this.currentUser = this.loadSession();
    this.currentOtp = null;
    this.otpTimer = null;
    this.otpCountdown = 0;
    this.pendingPhone = '';
    this.activeTab = 'phone'; // 'phone' | 'zalo'

    this.defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80'
    ];

    this.init();
  }

  init() {
    // Render ban đầu khi DOM sẵn sàng
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.syncUI());
    } else {
      this.syncUI();
    }
  }

  loadSession() {
    try {
      const data = localStorage.getItem(this.storageKey);
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
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch (e) {
      console.error('Lỗi lưu session đăng nhập:', e);
    }
    this.syncUI();
  }

  isLoggedIn() {
    return Boolean(this.currentUser && this.currentUser.phone);
  }

  getUser() {
    return this.currentUser;
  }

  // Mở modal đăng nhập
  openLoginModal(defaultTab = 'phone') {
    this.activeTab = defaultTab;
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.add('translate-y-full');
      requestAnimationFrame(() => sheet.classList.remove('translate-y-full'));
    }

    this.resetPhoneForm();
    this.switchAuthTab(this.activeTab);

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
    }, 250);
  }

  // Chuyển tab trong modal đăng nhập (Phone vs Zalo)
  switchAuthTab(tab) {
    this.activeTab = tab;
    const phoneContent = document.getElementById('auth-tab-content-phone');
    const zaloContent = document.getElementById('auth-tab-content-zalo');
    const tabBtnPhone = document.getElementById('auth-tab-btn-phone');
    const tabBtnZalo = document.getElementById('auth-tab-btn-zalo');

    if (tab === 'phone') {
      if (phoneContent) phoneContent.classList.remove('hidden');
      if (zaloContent) zaloContent.classList.add('hidden');
      if (tabBtnPhone) {
        tabBtnPhone.className = 'flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs';
      }
      if (tabBtnZalo) {
        tabBtnZalo.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition text-stone-600 hover:text-stone-900 hover:bg-stone-100';
      }
    } else {
      if (phoneContent) phoneContent.classList.add('hidden');
      if (zaloContent) zaloContent.classList.remove('hidden');
      if (tabBtnZalo) {
        tabBtnZalo.className = 'flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition bg-[#0068FF] text-white shadow-xs';
      }
      if (tabBtnPhone) {
        tabBtnPhone.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition text-stone-600 hover:text-stone-900 hover:bg-stone-100';
      }
    }
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

  // 1. Gửi mã OTP xác thực số điện thoại
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

    // Khởi chạy đếm ngược 60 giây gửi lại mã
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

  // Tự động điền mã OTP mẫu vào ô nhập
  fillDemoOtp() {
    const otpInput = document.getElementById('auth-otp-input');
    if (otpInput && this.currentOtp) {
      otpInput.value = this.currentOtp;
      this.verifyPhoneOtp();
    }
  }

  // 2. Xác thực mã OTP và hoàn tất đăng nhập
  verifyPhoneOtp() {
    const otpInput = document.getElementById('auth-otp-input');
    const nameInput = document.getElementById('auth-name-input');
    const userOtp = otpInput ? otpInput.value.trim() : '';

    if (!userOtp) {
      this.showToast('⚠️ Vui lòng nhập mã OTP gồm 6 chữ số!');
      return;
    }

    // Kiểm tra mã OTP: Hỗ trợ mã sinh tự động hoặc mã mặc định 123456
    if (userOtp !== this.currentOtp && userOtp !== '123456') {
      this.showToast('❌ Mã xác thực OTP không chính xác. Vui lòng thử lại!');
      return;
    }

    const randomAvatar = this.defaultAvatars[Math.floor(Math.random() * this.defaultAvatars.length)];
    const customName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : `Thực Khách #${this.pendingPhone.slice(-4)}`;

    const newUser = {
      id: 'usr_' + Date.now(),
      name: customName,
      phone: this.pendingPhone,
      avatar: randomAvatar,
      authProvider: 'phone',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    };

    this.saveSession(newUser);
    this.closeLoginModal();

    if (window.soundFX && window.soundFX.playMatch) {
      window.soundFX.playMatch();
    }
    this.showToast(`🎉 Chào mừng ${newUser.name}! Đăng nhập thành công!`);
  }

  // 3. Đăng nhập / Xác thực qua Zalo
  loginWithZalo() {
    const zaloPhone = '09' + Math.floor(10000000 + Math.random() * 90000000);
    const sampleNames = ['Hoàng Long (Zalo)', 'Minh Thảo (Zalo)', 'Thu Hà (Zalo)', 'Bảo Nam (Zalo)', 'Thanh Vy (Zalo)'];
    const chosenName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

    const zaloUser = {
      id: 'zalo_' + Date.now(),
      name: chosenName,
      phone: zaloPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      authProvider: 'zalo',
      zaloId: 'zid_' + Math.floor(1000000 + Math.random() * 9000000),
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    };

    this.saveSession(zaloUser);
    this.closeLoginModal();

    if (window.soundFX && window.soundFX.playMatch) {
      window.soundFX.playMatch();
    }
    this.showToast(`💬 Đã xác thực thành công qua Zalo: ${zaloUser.name}!`);
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
    const badgeEl = document.getElementById('profile-modal-provider-badge');
    const likedCountEl = document.getElementById('profile-modal-liked-count');

    if (avatarEl) avatarEl.src = user.avatar || this.defaultAvatars[0];
    if (nameEl) nameEl.textContent = user.name || 'Người dùng';
    if (phoneEl) phoneEl.textContent = this.formatPhone(user.phone);
    if (badgeEl) {
      if (user.authProvider === 'zalo') {
        badgeEl.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#0068FF] text-white shadow-2xs';
        badgeEl.innerHTML = `<span>💬 Zalo Verified</span>`;
      } else {
        badgeEl.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-2xs';
        badgeEl.innerHTML = `<span>📱 Phone SMS Verified</span>`;
      }
    }

    const likedCount = (window.app && window.app.likedFoods) ? window.app.likedFoods.length : 0;
    if (likedCountEl) likedCountEl.textContent = `${likedCount} món`;

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
      this.showToast(`✨ Đã cập nhật tên hiển thị thành công: ${this.currentUser.name}!`);
    }
  }

  // Đồng bộ giao diện topbar, sidebar, chào hỏi
  syncUI() {
    const user = this.currentUser;

    // 1. Cập nhật Topbar button: Nút Đăng nhập vs Avatar người dùng
    const topbarAuthContainer = document.getElementById('topbar-auth-container');
    if (topbarAuthContainer) {
      if (user) {
        topbarAuthContainer.innerHTML = `
          <button onclick="window.authManager.openProfileModal()" 
            class="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200 transition cursor-pointer shadow-2xs active:scale-95 group" 
            title="Tài khoản: ${user.name} • Bấm để xem thông tin">
            <img src="${user.avatar || this.defaultAvatars[0]}" alt="${user.name}" class="w-6 h-6 rounded-full object-cover border border-orange-300 shrink-0" />
            <span class="text-xs font-bold text-stone-800 max-w-[85px] sm:max-w-[120px] truncate group-hover:text-rose-600 transition">${user.name}</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          </button>
        `;
      } else {
        topbarAuthContainer.innerHTML = `
          <button onclick="window.authManager.openLoginModal()" 
            class="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 active:scale-95 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Đăng nhập bằng Số điện thoại hoặc Zalo">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Đăng nhập</span>
          </button>
        `;
      }
    }

    // 2. Cập nhật Sidebar Chào hỏi
    const greetingEl = document.getElementById('header-greeting');
    if (greetingEl) {
      if (user) {
        const providerIcon = user.authProvider === 'zalo' ? '💬' : '📱';
        greetingEl.innerHTML = `
          <div class="flex items-center gap-2 cursor-pointer p-1.5 -m-1.5 rounded-xl hover:bg-stone-50 transition" onclick="window.authManager.openProfileModal()" title="Bấm để xem hồ sơ tài khoản">
            <img src="${user.avatar || this.defaultAvatars[0]}" alt="${user.name}" class="w-9 h-9 rounded-full object-cover border-2 border-orange-300 shadow-xs shrink-0" />
            <div class="min-w-0 flex-1 leading-tight">
              <div class="flex items-center gap-1">
                <span class="font-extrabold text-stone-900 text-sm truncate">${user.name}</span>
                <span class="text-xs shrink-0" title="Đã xác thực ${user.authProvider}">${providerIcon}</span>
              </div>
              <p class="text-[10.5px] text-stone-500 truncate mt-0.5">${this.formatPhone(user.phone)}</p>
            </div>
          </div>
        `;
      } else {
        greetingEl.innerHTML = `
          <div class="flex items-center justify-between gap-1.5">
            <div class="flex items-center gap-1.5 font-extrabold text-stone-900 text-sm leading-tight">
              <span>Chào Bạn!</span>
              <span class="inline-block animate-wave text-lg">👋</span>
            </div>
            <button onclick="window.authManager.openLoginModal()" class="text-[10.5px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full transition cursor-pointer shrink-0">
              Đăng nhập
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
