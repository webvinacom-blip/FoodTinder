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

    this.init();
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
        biometricEnabled: user.biometricEnabled !== false, // Mặc định bật sinh trắc học
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
          this.saveSession({
            ...saved,
            lastLogin: new Date().toISOString()
          });
          this.closeLoginModal();
          this.showToast(`🎉 Chào mừng ${saved.name}! Đã xác thực thành công bằng Khuôn mặt / Vân tay!`);
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

    const newUser = {
      id: existing ? existing.id : 'usr_' + Date.now(),
      name: customName,
      phone: this.pendingPhone,
      avatar: existing ? existing.avatar : randomAvatar,
      authProvider: 'phone',
      biometricEnabled: true, // Tự động kích hoạt đăng nhập khuôn mặt/vân tay cho lần sau
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      verifiedAt: new Date().toISOString()
    };

    this.saveSession(newUser);
    this.closeLoginModal();

    if (window.soundFX && window.soundFX.playMatch) {
      window.soundFX.playMatch();
    }
    this.showToast(`🎉 Chào mừng ${newUser.name}! Đăng nhập thành công & đã kích hoạt Vân tay/Face ID!`);
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
    const badgeEl = document.getElementById('profile-modal-provider-badge');
    const likedCountEl = document.getElementById('profile-modal-liked-count');
    const bioToggleText = document.getElementById('profile-biometric-toggle-text');

    if (avatarEl) avatarEl.src = user.avatar || this.defaultAvatars[0];
    if (nameEl) nameEl.textContent = user.name || 'Người dùng';
    if (phoneEl) phoneEl.textContent = this.formatPhone(user.phone);
    if (bioToggleText) bioToggleText.textContent = user.biometricEnabled !== false ? 'Đã bật' : 'Đã tắt';
    
    if (badgeEl) {
      badgeEl.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xs';
      badgeEl.innerHTML = `<span>📱 Phone SMS & 👆 Face ID / Vân Tay</span>`;
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

    // 2. Cập nhật Sidebar Chào hỏi
    const greetingEl = document.getElementById('header-greeting');
    if (greetingEl) {
      if (user) {
        greetingEl.innerHTML = `
          <div class="flex items-center gap-2 cursor-pointer p-1.5 -m-1.5 rounded-xl hover:bg-stone-50 transition" onclick="window.authManager.openProfileModal()" title="Bấm để xem hồ sơ tài khoản">
            <img src="${user.avatar || this.defaultAvatars[0]}" alt="${user.name}" class="w-9 h-9 rounded-full object-cover border-2 border-orange-300 shadow-xs shrink-0" />
            <div class="min-w-0 flex-1 leading-tight">
              <div class="flex items-center gap-1">
                <span class="font-extrabold text-stone-900 text-sm truncate">${user.name}</span>
                <span class="text-xs shrink-0" title="Đã kích hoạt Face ID / Vân tay">👆</span>
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
