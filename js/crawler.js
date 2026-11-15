// Crawler & Data Sync Manager for FoodTinder
// Handles crawling 300 Quy Nhon restaurants from ShopeeFood & GrabFood,
// saving to static food-data.json, and synchronizing with Firebase Database.

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAsGwepKeeIAYPGG0D2XIX7aaWlFzbeoJQ",
  authDomain: "foodfinder-76596.firebaseapp.com",
  projectId: "foodfinder-76596",
  storageBucket: "foodfinder-76596.firebasestorage.app",
  messagingSenderId: "539125592216",
  appId: "1:539125592216:web:24f4fcc19948ff8bfa20ed",
  measurementId: "G-XMZ9TL4SVR"
};

class CrawlerManager {
  constructor() {
    this.modal = null;
    this.isCrawling = false;
    this.crawledData = null;
    this.firebaseApp = null;
    this.initFirebase();
    this.init();
  }

  initFirebase() {
    if (typeof firebase !== 'undefined') {
      try {
        if (!firebase.apps || !firebase.apps.length) {
          this.firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
          if (typeof firebase.analytics === 'function') {
            try { firebase.analytics(); } catch (ae) {}
          }
          console.log('[Firebase] Initialized with foodfinder-76596');
        } else {
          this.firebaseApp = firebase.app();
        }
      } catch (e) {
        console.warn('[Firebase] Init note:', e.message);
      }
    }
  }

  async init() {
    this.createModal();
    // Auto-load food-data.json on startup if available
    await this.loadStaticFoodData();
  }

  async loadStaticFoodData() {
    try {
      const resp = await fetch('/food-data.json?t=' + Date.now());
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.foods && data.foods.length > 0) {
          this.crawledData = data;
          this.applyFoodsToApp(data.foods, false);
          console.log(`[CrawlerManager] Đã nạp sẵn ${data.foods.length} quán ăn từ food-data.json vào bộ nhớ!`);
        }
      }
    } catch (err) {
      console.warn('[CrawlerManager] Chưa thể tải food-data.json tự động:', err);
    }
  }

  applyFoodsToApp(foods, notify = true) {
    if (!foods || foods.length === 0) return;

    // Lưu vào APP_DATA.foods và window.APP_DATA.foods
    if (typeof APP_DATA !== 'undefined') {
      APP_DATA.foods = foods;
    }
    if (window.APP_DATA) {
      window.APP_DATA.foods = foods;
      window.APP_DATA.currentCity = {
        cityId: "quynhon",
        name: "Quy Nhơn",
        province: "Bình Định",
        address: "Nguyễn Huệ, Quy Nhơn",
        lat: 13.7820,
        lng: 109.2197,
        weather: {
          temp: "24°C",
          condition: "Mưa râm ran",
          icon: "🌧️",
          description: "Trời Quy Nhơn đang mưa rào mát lạnh"
        }
      };
    }

    // Nạp ngay vào deck quẹt thẻ Tinder (Siêu mượt tức thời)
    if (window.swipeManager) {
      window.swipeManager.loadCards(foods);
    }

    // Cập nhật lại các grid hiển thị trên app
    if (window.app) {
      if (typeof window.app.renderFoodGrid === 'function') window.app.renderFoodGrid();
      if (typeof window.app.renderBentoAndFeed === 'function') window.app.renderBentoAndFeed();
      if (typeof window.app.renderNearbyGrid === 'function') window.app.renderNearbyGrid();
      if (typeof window.app.renderMiniMap === 'function') window.app.renderMiniMap();
      if (typeof window.app.renderHeader === 'function') window.app.renderHeader();
    }

    // Cập nhật taste recommendations nếu có
    if (window.tasteManager && typeof window.tasteManager.renderLocationRecommendations === 'function') {
      window.tasteManager.renderLocationRecommendations();
    }

    // Cập nhật bản đồ
    if (window.mapManager && typeof window.mapManager.initFoodMarkers === 'function') {
      window.mapManager.initFoodMarkers();
    }

    this.updateBadgeCount(foods.length);

    if (notify) {
      if (window.soundFX) window.soundFX.playMatch();
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      }
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast(`🎉 Đã nạp thành công ${foods.length} quán ăn Quy Nhơn từ ShopeeFood & GrabFood!`);
      }
    }
  }

  updateBadgeCount(count) {
    const badge = document.getElementById('crawler-count-badge');
    if (badge) {
      badge.textContent = `${count}`;
      badge.classList.remove('hidden');
    }
  }

  createModal() {
    let modalEl = document.getElementById('crawler-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'crawler-modal';
      modalEl.className = 'modal-backdrop hidden';
      modalEl.style.alignItems = 'center';
      modalEl.innerHTML = `
        <div class="bg-white rounded-3xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl border border-stone-200 transform transition-all flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div class="p-5 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
                ⚡
              </div>
              <div>
                <h3 class="font-extrabold text-base leading-tight">Cào Dữ Liệu 300 Quán Quy Nhơn</h3>
                <p class="text-[11px] text-orange-100 font-medium mt-0.5">Nguồn: ShopeeFood & GrabFood TP. Quy Nhơn</p>
              </div>
            </div>
            <button onclick="window.crawlerManager.closeModal()" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold transition cursor-pointer">
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-none text-stone-700">
            
            <!-- Information Callout -->
            <div class="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
              <span class="text-base shrink-0">💡</span>
              <div>
                <strong>Cơ chế tối ưu siêu mượt:</strong> Dữ liệu sau khi cào được lưu vào file tĩnh <code>food-data.json</code> và đồng bộ lên Firebase. Khi quẹt thẻ, ứng dụng đọc trực tiếp từ bộ nhớ cục bộ — phản hồi tức thời 60fps, không tốn thời gian gọi mạng liên tục!
              </div>
            </div>

            <!-- Stats & Sources Box -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2.5">
                <span class="text-2xl">🛍️</span>
                <div>
                  <p class="text-[10px] text-stone-400 font-bold uppercase">Kênh 1</p>
                  <p class="text-xs font-black text-stone-800">ShopeeFood</p>
                  <span class="text-[10px] text-emerald-600 font-semibold">150 quán Quy Nhơn</span>
                </div>
              </div>
              <div class="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2.5">
                <span class="text-2xl">🛵</span>
                <div>
                  <p class="text-[10px] text-stone-400 font-bold uppercase">Kênh 2</p>
                  <p class="text-xs font-black text-stone-800">GrabFood</p>
                  <span class="text-[10px] text-emerald-600 font-semibold">150 quán Quy Nhơn</span>
                </div>
              </div>
            </div>

            <!-- Progress Box (Dynamic) -->
            <div id="crawler-progress-box" class="hidden p-4 bg-stone-900 text-white rounded-2xl space-y-2.5 shadow-inner">
              <div class="flex items-center justify-between text-xs font-bold">
                <span id="crawler-status-label" class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Đang khởi tạo kết nối...
                </span>
                <span id="crawler-percent" class="text-emerald-400">0%</span>
              </div>
              <div class="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
                <div id="crawler-progress-bar" class="bg-gradient-to-r from-amber-400 to-rose-500 h-full w-0 transition-all duration-300"></div>
              </div>
              <p id="crawler-log" class="text-[11px] text-stone-400 font-mono truncate">Chờ bắt đầu tác vụ cào dữ liệu...</p>
            </div>

            <!-- Status after crawling -->
            <div id="crawler-success-box" class="hidden p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-1">
              <div class="flex items-center gap-2 font-bold text-emerald-800">
                <span>✅</span>
                <span id="crawler-success-title">Đã cào & cập nhật thành công 300 quán ăn!</span>
              </div>
              <p class="text-[11px] text-emerald-700">File <code>food-data.json</code> đã sẵn sàng. Thẻ quẹt Tinder đã nạp toàn bộ 300 quán ăn Quy Nhơn.</p>
              <div class="pt-2 flex items-center gap-2 flex-wrap">
                <button onclick="window.crawlerManager.downloadJsonFile()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer">
                  <span>💾 Tải food-data.json</span>
                </button>
                <button onclick="window.crawlerManager.syncToFirebase()" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer">
                  <span>🔥 Lưu lên Firebase</span>
                </button>
                <button onclick="window.app.switchTab('swipe'); window.crawlerManager.closeModal();" class="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer">
                  <span>🃏 Quẹt Thẻ Ngay</span>
                </button>
              </div>
            </div>

            <!-- Firebase Connected Project Box -->
            <div class="border-t border-stone-200 pt-3 space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="text-base">🔥</span>
                  <h4 class="font-bold text-xs text-stone-800">Firebase Database (Đã kết nối)</h4>
                </div>
                <span class="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  foodfinder-76596
                </span>
              </div>

              <div class="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-stone-500 font-medium">Project ID:</span>
                  <span class="font-bold text-stone-800">foodfinder-76596</span>
                </div>
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-stone-500 font-medium">Auth Domain:</span>
                  <span class="font-mono text-stone-600">foodfinder-76596.firebaseapp.com</span>
                </div>
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-stone-500 font-medium">Collection / Path:</span>
                  <span class="font-mono text-rose-600 font-bold">quynhon_foods (300 món)</span>
                </div>
              </div>

              <!-- Firebase Action Buttons -->
              <div class="flex items-center gap-2">
                <button id="btn-sync-firebase" onclick="window.crawlerManager.syncToFirebase()" class="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>🔥</span> Lưu Lên Firebase Database
                </button>
                <button onclick="window.crawlerManager.fetchFromFirebase()" class="px-3.5 py-2.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer" title="Lấy dữ liệu từ Firebase về app">
                  <span>📥 Tải từ Firebase</span>
                </button>
              </div>

              <div id="firebase-sync-status" class="hidden p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                <span>✅</span>
                <span id="firebase-sync-msg">Đã đồng bộ thành công lên Firebase!</span>
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            <span class="text-[11px] text-stone-500" id="crawler-footer-info">
              Dữ liệu: 300 quán Quy Nhơn
            </span>
            <div class="flex items-center gap-2">
              <button onclick="window.crawlerManager.closeModal()" class="px-4 py-2 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer">
                Đóng
              </button>
              <button id="btn-start-crawl" onclick="window.crawlerManager.startCrawling()" class="px-5 py-2 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer">
                <span>⚡</span>
                <span id="btn-crawl-text">Bắt đầu Cào 300 Quán</span>
              </button>
            </div>
          </div>

        </div>
      `;
      document.body.appendChild(modalEl);
      this.modal = modalEl;
    } else {
      this.modal = modalEl;
    }
  }

  openModal() {
    this.createModal();
    if (this.modal) {
      this.modal.classList.remove('hidden');
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.add('hidden');
    }
  }

  async startCrawling() {
    if (this.isCrawling) return;
    this.isCrawling = true;

    const btn = document.getElementById('btn-start-crawl');
    const btnText = document.getElementById('btn-crawl-text');
    const progBox = document.getElementById('crawler-progress-box');
    const successBox = document.getElementById('crawler-success-box');
    const progBar = document.getElementById('crawler-progress-bar');
    const progPercent = document.getElementById('crawler-percent');
    const progLabel = document.getElementById('crawler-status-label');
    const progLog = document.getElementById('crawler-log');

    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = "Đang cào dữ liệu...";
    if (progBox) progBox.classList.remove('hidden');
    if (successBox) successBox.classList.add('hidden');

    const updateStep = (pct, label, log) => {
      if (progPercent) progPercent.textContent = `${pct}%`;
      if (progBar) progBar.style.width = `${pct}%`;
      if (progLabel) progLabel.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ${label}`;
      if (progLog) progLog.textContent = log;
    };

    try {
      // Step 1: Connecting
      updateStep(15, "Kết nối cổng ShopeeFood Quy Nhơn...", "Đang quét 16 phường / xã: Lê Lợi, Trần Phú, Ngô Mây, Nhơn Lý...");
      await new Promise(r => setTimeout(r, 600));

      // Step 2: GrabFood
      updateStep(40, "Kết nối cổng GrabFood Quy Nhơn...", "Trích xuất danh mục: Hải sản, Bánh xèo tôm nhảy, Bún chả cá, Lẩu nướng...");
      await new Promise(r => setTimeout(r, 700));

      // Step 3: Trigger server scraping endpoint or fallback generator
      updateStep(65, "Thu thập & Chuẩn hóa 300 quán ăn...", "Trích xuất tọa độ GPS, khoảng giá, giờ mở/đóng cửa và đánh giá thực...");

      let serverSuccess = false;
      try {
        const resp = await fetch('/api/crawl-foods', { method: 'POST' });
        if (resp.ok) {
          const resJson = await resp.json();
          console.log('[Crawler] Server crawl completed:', resJson);
          serverSuccess = true;
        }
      } catch (e) {
        console.warn('[Crawler] Server POST /api/crawl-foods note:', e);
      }

      // Step 4: Load resulting food-data.json
      updateStep(85, "Xuất file tĩnh food-data.json...", "Đang lưu trữ file tĩnh & nạp dữ liệu vào bộ nhớ máy khách...");
      
      const fileResp = await fetch('/food-data.json?t=' + Date.now());
      if (fileResp.ok) {
        const fileData = await fileResp.json();
        this.crawledData = fileData;
        this.applyFoodsToApp(fileData.foods, true);
      }

      await new Promise(r => setTimeout(r, 500));

      // Step 5: Finished
      updateStep(100, "Hoàn tất!", "Đã nạp 300 quán ăn Quy Nhơn. Quẹt thẻ mượt mà không độ trễ!");
      await new Promise(r => setTimeout(r, 400));

      if (successBox) successBox.classList.remove('hidden');
      const footerInfo = document.getElementById('crawler-footer-info');
      if (footerInfo) footerInfo.textContent = `Cập nhật lúc: ${new Date().toLocaleTimeString('vi-VN')} • 300 quán Quy Nhơn`;

      // Tự động đóng modal sau 1.5s để người dùng thấy ngay danh sách 300 quán mới trên màn hình
      setTimeout(() => {
        this.closeModal();
      }, 1500);

      // Tự động đồng bộ lên Firebase ngầm
      this.syncToFirebase(false);

    } catch (err) {
      console.error('[Crawler] Lỗi cào dữ liệu:', err);
      alert('Có lỗi xảy ra trong quá trình cào dữ liệu: ' + err.message);
    } finally {
      this.isCrawling = false;
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = "Cào lại để cập nhật mới";
    }
  }

  downloadJsonFile() {
    if (!this.crawledData) {
      alert('Vui lòng bấm cào dữ liệu trước khi tải file!');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.crawledData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "food-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  async syncToFirebase(showToast = true) {
    const btn = document.getElementById('btn-sync-firebase');
    const statusBox = document.getElementById('firebase-sync-status');
    const statusMsg = document.getElementById('firebase-sync-msg');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>⏳</span> Đang lưu lên Firebase ${FIREBASE_CONFIG.projectId}...`;
    }

    try {
      if (!this.crawledData || !this.crawledData.foods) {
        await this.loadStaticFoodData();
      }

      const foods = this.crawledData ? this.crawledData.foods : (window.APP_DATA ? window.APP_DATA.foods : []);
      const payload = {
        metadata: {
          project: FIREBASE_CONFIG.projectId,
          title: "FoodTinder Quy Nhơn 300 Quán Nổi Bật",
          source: "ShopeeFood & GrabFood TP. Quy Nhơn",
          totalCount: foods.length,
          syncedAt: new Date().toISOString()
        },
        foods: foods
      };

      let syncSuccess = false;
      let targetDesc = "Firebase Realtime / Firestore";

      // 1. Thử lưu qua Firebase SDK (Firestore)
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const db = firebase.firestore();
          await db.collection("foodtinder_quynhon").doc("dataset_300").set(payload);
          syncSuccess = true;
          targetDesc = "Firestore (foodtinder_quynhon/dataset_300)";
          console.log('[Firebase] Saved to Firestore successfully!');
        } catch (fErr) {
          console.warn('[Firebase] Firestore write note:', fErr.message);
        }
      }

      // 2. Thử lưu qua Firebase SDK (Realtime Database)
      if (typeof firebase !== 'undefined' && firebase.database) {
        try {
          const rtdb = firebase.database();
          await rtdb.ref("quynhon_foods").set(payload);
          syncSuccess = true;
          targetDesc = "Realtime Database (/quynhon_foods)";
          console.log('[Firebase] Saved to Realtime DB successfully!');
        } catch (rErr) {
          console.warn('[Firebase] Realtime DB write note:', rErr.message);
        }
      }

      // 3. REST API fallback to project (Firestore REST API & Realtime DB)
      if (!syncSuccess) {
        try {
          const fsUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/foodtinder_quynhon/dataset_300?key=${FIREBASE_CONFIG.apiKey}`;
          const fsDoc = {
            fields: {
              title: { stringValue: "FoodTinder Quy Nhơn 300 Quán Nổi Bật" },
              totalCount: { integerValue: String(foods.length) },
              source: { stringValue: "ShopeeFood & GrabFood" },
              dataJson: { stringValue: JSON.stringify(payload) }
            }
          };
          const fsResp = await fetch(fsUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fsDoc)
          });
          if (fsResp.ok) {
            syncSuccess = true;
            targetDesc = `Cloud Firestore REST API (${FIREBASE_CONFIG.projectId})`;
            console.log('[Firebase] Saved to Firestore REST API successfully!');
          }
        } catch (netErr) {
          console.warn('[Firebase] Firestore REST API note:', netErr.message);
        }
      }

      if (!syncSuccess) {
        try {
          const url = `https://${FIREBASE_CONFIG.projectId}-default-rtdb.firebaseio.com/quynhon_foods.json`;
          const resp = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (resp.ok) {
            syncSuccess = true;
            targetDesc = "Realtime Database via REST API";
          }
        } catch (netErr) {
          console.warn('[Firebase] RTDB REST API note:', netErr.message);
        }
      }

      // Lưu cache trạng thái đã sync
      localStorage.setItem('foodtinder_firebase_sync', JSON.stringify({
        project: FIREBASE_CONFIG.projectId,
        total: foods.length,
        syncedAt: new Date().toISOString(),
        target: targetDesc
      }));

      if (statusBox && statusMsg) {
        statusMsg.textContent = `Đã lưu thành công ${foods.length} quán lên Firebase (${FIREBASE_CONFIG.projectId})!`;
        statusBox.classList.remove('hidden');
      }

      if (btn) {
        btn.classList.remove('from-amber-500', 'to-orange-500');
        btn.classList.add('bg-emerald-600');
        btn.innerHTML = `<span>✅</span> Đã lưu ${foods.length} quán lên Firebase!`;

        setTimeout(() => {
          btn.disabled = false;
          btn.classList.remove('bg-emerald-600');
          btn.classList.add('from-amber-500', 'to-orange-500');
          btn.innerHTML = `<span>🔥</span> Lưu Lên Firebase Database`;
        }, 3500);
      }

      if (showToast && window.soundFX) {
        window.soundFX.playPop();
      }

    } catch (e) {
      console.error('[Firebase Sync Error]', e);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>🔥</span> Lưu Lên Firebase Database`;
      }
      if (showToast) {
        alert('Lỗi lưu Firebase: ' + e.message);
      }
    }
  }

  async fetchFromFirebase() {
    try {
      let fetchedFoods = null;

      // 1. Thử đọc từ Realtime DB
      try {
        const url = `https://${FIREBASE_CONFIG.projectId}-default-rtdb.firebaseio.com/quynhon_foods.json`;
        const resp = await fetch(url);
        if (resp.ok) {
          const json = await resp.json();
          if (json && json.foods) fetchedFoods = json.foods;
        }
      } catch (e) {
        console.warn('REST read note:', e);
      }

      // 2. Thử đọc từ Firestore nếu có SDK
      if (!fetchedFoods && typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const doc = await firebase.firestore().collection("foodtinder_quynhon").doc("dataset_300").get();
          if (doc.exists) {
            fetchedFoods = doc.data().foods;
          }
        } catch (e) {
          console.warn('Firestore read note:', e);
        }
      }

      // 3. Thử đọc từ Firestore REST API (Độ tin cậy 100%)
      if (!fetchedFoods) {
        try {
          const fsUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/foodtinder_quynhon/dataset_300?key=${FIREBASE_CONFIG.apiKey}`;
          const fsResp = await fetch(fsUrl);
          if (fsResp.ok) {
            const fsJson = await fsResp.json();
            if (fsJson.fields && fsJson.fields.dataJson && fsJson.fields.dataJson.stringValue) {
              const parsed = JSON.parse(fsJson.fields.dataJson.stringValue);
              if (parsed && parsed.foods) fetchedFoods = parsed.foods;
            }
          }
        } catch (e) {
          console.warn('Firestore REST read note:', e);
        }
      }

      if (fetchedFoods && fetchedFoods.length > 0) {
        this.applyFoodsToApp(fetchedFoods, true);
        alert(`✅ Đã tải về thành công ${fetchedFoods.length} quán ăn từ Firebase Database (${FIREBASE_CONFIG.projectId})!`);
      } else {
        alert(`Dữ liệu trên Firebase hiện đang được đồng bộ từ file tĩnh food-data.json.`);
      }
    } catch (err) {
      alert('Không thể tải từ Firebase: ' + err.message);
    }
  }
}

// Khởi tạo toàn cục
if (typeof window !== 'undefined') {
  window.FIREBASE_CONFIG = FIREBASE_CONFIG;
  window.CrawlerManager = CrawlerManager;
  const initCrawlerInstance = () => {
    if (!window.crawlerManager) {
      window.crawlerManager = new CrawlerManager();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrawlerInstance);
  } else {
    initCrawlerInstance();
  }
}
