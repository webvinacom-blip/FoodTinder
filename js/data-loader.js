/**
 * FoodTinder - Smart Offline-First Data Loader & Version Control
 * Chiến lược tối ưu:
 * 1. Cache nội bộ trên máy (IndexedDB + fallback LocalStorage) -> Nạp dữ liệu trong < 30ms, offline 100%.
 * 2. Version Control siêu nhẹ (version.json ~60 bytes) -> Chỉ tốn 1 request nhẹ kiểm tra phiên bản.
 * 3. File tĩnh CDN (/food-data.json) -> Tải qua CDN với nén gzip chỉ còn ~380KB thay vì query Firebase tốn tiền.
 */

const DATA_CONFIG = {
  VERSION_URL: '/version.json',
  STATIC_DATA_URL: '/food-data.json',
  CACHE_KEY_VERSION: 'foodtinder_data_version',
  DB_NAME: 'FoodTinder_OfflineDB',
  DB_VERSION: 1,
  STORE_NAME: 'foods_cache'
};

class FoodDataLoader {
  constructor() {
    this.db = null;
    this.isUpdating = false;
  }

  // Khởi tạo IndexedDB (lưu trữ an toàn hàng chục MB không giới hạn như localStorage)
  async initDB() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        return resolve(null);
      }
      try {
        const req = indexedDB.open(DATA_CONFIG.DB_NAME, DATA_CONFIG.DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(DATA_CONFIG.STORE_NAME)) {
            db.createObjectStore(DATA_CONFIG.STORE_NAME);
          }
        };
        req.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this.db);
        };
        req.onerror = () => resolve(null);
      } catch (err) {
        console.warn('[DataLoader] IndexedDB không khả dụng, chuyển sang chế độ fallback:', err);
        resolve(null);
      }
    });
  }

  // Đọc danh sách quán từ Cache máy
  async getLocalData() {
    try {
      const db = await this.initDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction(DATA_CONFIG.STORE_NAME, 'readonly');
          const store = tx.objectStore(DATA_CONFIG.STORE_NAME);
          const req = store.get('cached_foods');
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
      }
    } catch (e) {
      console.warn('[DataLoader] Không đọc được IndexedDB:', e);
    }

    // Fallback sang localStorage nếu IndexedDB không khả dụng
    try {
      const saved = localStorage.getItem('foodtinder_cached_foods');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // Làm sạch danh sách: loại bỏ quán đóng cửa vĩnh viễn, quán bar/club không ẩm thực, quán ảo
  sanitizeFoods(foods) {
    if (!Array.isArray(foods)) return [];
    return foods.filter(f => {
      if (typeof window.isPermanentlyClosedRestaurant === 'function' && window.isPermanentlyClosedRestaurant(f)) return false;
      if (typeof window.isValidQualityFood === 'function' && !window.isValidQualityFood(f)) return false;
      if (typeof window.isFakeDummyFood === 'function' && window.isFakeDummyFood(f)) return false;
      return true;
    });
  }

  // Lưu danh sách quán và phiên bản vào Cache máy
  async saveLocalData(foods, version) {
    const sanitized = this.sanitizeFoods(foods);
    try {
      const db = await this.initDB();
      if (db) {
        const tx = db.transaction(DATA_CONFIG.STORE_NAME, 'readwrite');
        const store = tx.objectStore(DATA_CONFIG.STORE_NAME);
        store.put(sanitized, 'cached_foods');
        store.put({ version, updatedAt: new Date().toISOString() }, 'cached_meta');
      }
    } catch (e) {
      console.warn('[DataLoader] Lỗi lưu IndexedDB:', e);
    }

    try {
      localStorage.setItem(DATA_CONFIG.CACHE_KEY_VERSION, version);
    } catch (e) {}
  }

  // Lấy phiên bản đang lưu trên máy
  async getLocalVersion() {
    try {
      const db = await this.initDB();
      if (db) {
        const meta = await new Promise((resolve) => {
          const tx = db.transaction(DATA_CONFIG.STORE_NAME, 'readonly');
          const store = tx.objectStore(DATA_CONFIG.STORE_NAME);
          const req = store.get('cached_meta');
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (meta && meta.version) return meta.version;
      }
    } catch {}
    return localStorage.getItem(DATA_CONFIG.CACHE_KEY_VERSION) || null;
  }

  // Luồng nạp dữ liệu thông minh (Smart Offline-first Loader)
  async load(onDataReady, onDataUpdated) {
    // BƯỚC 1: Đọc ngay cache nội bộ trên máy -> Giao diện hiện ngay lập tức trong vài mili-giây
    const rawCached = await this.getLocalData();
    const localVersion = await this.getLocalVersion();
    const cachedFoods = this.sanitizeFoods(rawCached);

    if (cachedFoods && cachedFoods.length > 0) {
      console.log(`⚡ [DataLoader] Cache Hit! Đã nạp ${cachedFoods.length} quán từ bộ nhớ máy (< 30ms). Version: ${localVersion || 'gốc'}`);
      if (typeof onDataReady === 'function') {
        onDataReady(cachedFoods);
      }
    }

    // BƯỚC 2: Kiểm tra phiên bản ngầm qua file version.json (chỉ ~60 bytes)
    this.checkForUpdates(cachedFoods, localVersion, onDataReady, onDataUpdated);
  }

  async checkForUpdates(cachedFoods, localVersion, onDataReady, onDataUpdated) {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      // 1 request tĩnh siêu nhẹ ~60 bytes
      const vResp = await fetch(DATA_CONFIG.VERSION_URL + '?t=' + Date.now(), { cache: 'no-cache' });
      if (!vResp.ok) return;

      const meta = await vResp.json();
      const remoteVersion = meta.version;

      // Nếu đã có cache và version trên máy khớp với remote -> Dừng lại ngay! Tiết kiệm 100% băng thông
      if (cachedFoods && cachedFoods.length > 0 && localVersion === remoteVersion) {
        console.log(`✅ [DataLoader] Dữ liệu máy (v${localVersion}) đã là mới nhất (${cachedFoods.length} quán). Không cần tải lại!`);
        this.isUpdating = false;
        return;
      }

      // BƯỚC 3: Nếu phiên bản remote mới hơn hoặc chưa có cache -> Tải file tĩnh CDN
      console.log(`🔄 [DataLoader] Phát hiện phiên bản mới (v${remoteVersion}). Bắt đầu tải file tĩnh CDN...`);
      const targetUrl = (meta.dataUrl || DATA_CONFIG.STATIC_DATA_URL) + '?v=' + remoteVersion;
      const dataResp = await fetch(targetUrl);
      if (!dataResp.ok) return;

      const fullData = await dataResp.json();
      const newFoods = fullData.foods || fullData;

      if (Array.isArray(newFoods) && newFoods.length > 0) {
        console.log(`🎉 [DataLoader] Đã tải thành công ${newFoods.length} quán từ CDN (v${remoteVersion})! Cập nhật cache máy...`);
        await this.saveLocalData(newFoods, remoteVersion);

        // Cập nhật lên giao diện
        if (!cachedFoods || cachedFoods.length === 0) {
          if (typeof onDataReady === 'function') onDataReady(newFoods);
        } else if (typeof onDataUpdated === 'function') {
          onDataUpdated(newFoods);
        }
      }
    } catch (err) {
      console.warn('⚠️ [DataLoader] Ngoại tuyến hoặc lỗi kiểm tra version. Tiếp tục dùng cache máy.', err);
    } finally {
      this.isUpdating = false;
    }
  }
}

// Khởi tạo global instance
if (typeof window !== 'undefined') {
  window.dataLoader = new FoodDataLoader();
}
