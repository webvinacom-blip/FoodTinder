// Conversational AI & Friends Messaging Engine (Split Layout: Friends on Left, Chat on Right)

class FoodChatManager {
  constructor() {
    this.currentChatTarget = 'ai'; // 'ai' | number (friend id) | string (group id)
    this.friendsFilter = 'all'; // 'all' | 'my' | 'groups' | 'nearby'
    this.searchQuery = '';
    this.aiMessages = [];
    this._gridCounter = 0;
  }

  init() {
    this.initDefaultAIMessages();
    this.renderFriendsSidebar();
    this.renderActiveChatWindow();
  }

  initDefaultAIMessages() {
    if (this.aiMessages.length === 0) {
      this.aiMessages = [
        {
          type: 'bot',
          html: `<p class="text-stone-800 font-medium leading-relaxed">
            Chào bạn! Trời mưa lạnh thế này bạn có muốn tìm bạn đi ăn lẩu cùng không? Hoặc để mình gợi ý quán nhé! 🌧️ 🍲
          </p>`
        },
        {
          type: 'user',
          text: 'Có ai ở gần muốn đi ăn lẩu không AI ơi?'
        },
        {
          type: 'bot_friends',
          text: 'Đã tìm thấy <strong>3 bạn ở gần</strong> cũng đang thèm lẩu! Bạn có muốn kết nối không? Hoặc trò chuyện với AI để mình tìm quán hợp gu nhất nhé!'
        }
      ];
    }
  }

  /* ══════════════════════════════════════════
     LEFT PANEL: FRIENDS & CONVERSATIONS SIDEBAR
  ══════════════════════════════════════════ */

  setFriendsFilter(filter) {
    window.soundFX && window.soundFX.playPop();
    this.friendsFilter = filter;

    // Update filter pills active class
    const filters = ['all', 'my', 'groups', 'nearby'];
    filters.forEach(f => {
      const btn = document.getElementById(`filter-${f}`);
      if (btn) {
        if (f === filter) {
          btn.className = 'filter-pill px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition bg-stone-900 text-white';
        } else {
          btn.className = 'filter-pill px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition bg-stone-100 text-stone-600 hover:bg-stone-200';
        }
      }
    });

    this.renderFriendsSidebar(false);
  }

  handleFriendsSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.renderFriendsSidebar(false);
  }

  renderFriendsSidebar(renderOnline = true) {
    const listContainer = document.getElementById('friends-sidebar-list');
    const onlineRow = document.getElementById('friends-online-row');
    if (!listContainer) return;

    const myFriends = APP_DATA.myFriends || [];
    const nearbyFriends = APP_DATA.nearbyFriends || [];
    const groups = APP_DATA.groupChats || [];

    // Filter counts
    const filterMy = document.getElementById('filter-my');
    const filterNearby = document.getElementById('filter-nearby');
    if (filterMy) filterMy.textContent = `❤️ Bạn bè (${myFriends.length})`;
    if (filterNearby) filterNearby.textContent = `📍 Quanh bạn (${nearbyFriends.length})`;

    // Online stories row
    if (onlineRow && renderOnline) {
      const onlineList = [...myFriends, ...nearbyFriends].filter(f => f.status === 'Online');
      onlineRow.innerHTML = `
        <div onclick="window.chatManager.openAddFriendModal()" class="flex flex-col items-center shrink-0 cursor-pointer group">
          <div class="w-10 h-10 rounded-full border-2 border-dashed border-rose-300 group-hover:border-rose-500 flex items-center justify-center text-rose-500 text-sm font-bold transition">
            ➕
          </div>
          <span class="text-[9px] text-stone-500 font-medium mt-0.5">Thêm bạn</span>
        </div>
        ${onlineList.map(f => `
          <div onclick="window.chatManager.selectChatTarget(${f.id})" class="flex flex-col items-center shrink-0 cursor-pointer group">
            <div class="relative w-10 h-10 rounded-full p-0.5 ${this.currentChatTarget === f.id ? 'bg-gradient-to-tr from-rose-500 to-amber-500 ring-2 ring-rose-400' : 'bg-gradient-to-tr from-rose-400 to-amber-300'}">
              <img src="${f.avatar}" alt="${f.name}" class="w-full h-full rounded-full object-cover border-2 border-white" />
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
            </div>
            <span class="text-[9px] text-stone-700 font-bold mt-0.5 max-w-[50px] truncate text-center">${f.name}</span>
          </div>
        `).join('')}
      `;
    }

    // Search filter function
    const q = this.searchQuery;
    const filterFn = (item) => {
      if (!q) return true;
      return (item.name && item.name.toLowerCase().includes(q)) ||
             (item.nickname && item.nickname.toLowerCase().includes(q)) ||
             (item.relation && item.relation.toLowerCase().includes(q)) ||
             (item.bio && item.bio.toLowerCase().includes(q)) ||
             (item.craving && item.craving.toLowerCase().includes(q));
    };

    const filteredMy = myFriends.filter(filterFn);
    const filteredNearby = nearbyFriends.filter(filterFn);
    const filteredGroups = groups.filter(filterFn);

    const isAIActive = this.currentChatTarget === 'ai';

    let html = '';

    // 1. PINNED FOODTINDER AI CONTACT
    if (!q || 'foodtinder ai trợ lý ăn uống'.includes(q)) {
      html += `
        <div onclick="window.chatManager.selectChatTarget('ai')" 
          class="p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${isAIActive ? 'bg-rose-50/90 border-rose-300 shadow-sm ring-2 ring-rose-200' : 'bg-gradient-to-r from-amber-50/60 to-rose-50/40 border-rose-100 hover:border-rose-200 shadow-xs'}">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-400 flex items-center justify-center text-white text-lg shadow-sm shrink-0">
              🔥
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <h5 class="font-bold text-xs text-stone-900 truncate">FoodTinder AI</h5>
                <span class="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">AI</span>
              </div>
              <p class="text-[11px] text-stone-500 truncate mt-0.5">Trợ lý ăn uống theo cảm xúc & thời tiết</p>
              <p class="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>Sẵn sàng gợi ý quán & tìm bạn</span>
              </p>
            </div>
          </div>
          <span class="text-xs text-rose-500 font-bold shrink-0">Hỏi ngay →</span>
        </div>
      `;
    }

    // 2. MY FRIENDS SECTION
    if (this.friendsFilter === 'all' || this.friendsFilter === 'my') {
      html += `
        <div>
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Bạn bè của tôi (${filteredMy.length})</span>
            <button onclick="window.chatManager.openAddFriendModal()" class="text-[10px] font-bold text-rose-500 hover:underline">+ Thêm bạn</button>
          </div>
          <div class="space-y-1.5">
            ${filteredMy.map(f => {
              const isActive = this.currentChatTarget === f.id;
              const lastMsg = f.messages[f.messages.length - 1]?.text || 'Nhấn để trò chuyện...';
              return `
                <div onclick="window.chatManager.selectChatTarget(${f.id})" 
                  class="p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${isActive ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200' : 'bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50 shadow-xs'}">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="relative w-11 h-11 rounded-full overflow-hidden border border-amber-300 shrink-0">
                      <img src="${f.avatar}" alt="${f.name}" class="w-full h-full object-cover" />
                      <span class="absolute bottom-0 right-0 w-2.5 h-2.5 ${f.status === 'Online' ? 'bg-emerald-500' : 'bg-stone-300'} rounded-full border border-white"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <h5 class="font-bold text-xs text-stone-900 truncate">${f.name}</h5>
                        <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full">${f.relation}</span>
                      </div>
                      <p class="text-[11px] text-stone-500 truncate mt-0.5">${lastMsg}</p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="text-[9px] text-stone-400 block">${f.time}</span>
                    ${f.unread > 0 ? `<span class="inline-block mt-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full text-center leading-4">${f.unread}</span>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 3. GROUP CHATS SECTION
    if (this.friendsFilter === 'all' || this.friendsFilter === 'groups') {
      html += `
        <div>
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Nhóm ăn uống (${filteredGroups.length})</span>
          </div>
          <div class="space-y-1.5">
            ${filteredGroups.map(g => {
              const isActive = this.currentChatTarget === g.id;
              const lastMsg = g.messages[g.messages.length - 1];
              return `
                <div onclick="window.chatManager.selectChatTarget('${g.id}')" 
                  class="p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${isActive ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200' : 'bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50 shadow-xs'}">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="relative w-11 h-11 rounded-2xl overflow-hidden border border-amber-300 shrink-0">
                      <img src="${g.avatar}" alt="${g.name}" class="w-full h-full object-cover" />
                      <span class="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full">${g.membersCount}</span>
                    </div>
                    <div class="min-w-0">
                      <h5 class="font-bold text-xs text-stone-900 truncate">${g.name}</h5>
                      <p class="text-[11px] text-stone-500 truncate mt-0.5">
                        <span class="font-medium text-stone-700">${lastMsg?.sender}:</span> ${lastMsg?.text}
                      </p>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="text-[9px] text-stone-400 block">${g.time}</span>
                    ${g.unread > 0 ? `<span class="inline-block mt-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full text-center leading-4">${g.unread}</span>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 4. NEARBY BUDDIES SECTION
    if (this.friendsFilter === 'all' || this.friendsFilter === 'nearby') {
      html += `
        <div>
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Bạn bè cùng gu quanh bạn (${filteredNearby.length})</span>
            <span class="text-[10px] text-rose-500 font-bold">Online</span>
          </div>
          <div class="space-y-1.5">
            ${filteredNearby.map(f => {
              const isActive = this.currentChatTarget === f.id;
              return `
                <div onclick="window.chatManager.selectChatTarget(${f.id})" 
                  class="p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${isActive ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200' : 'bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50 shadow-xs'}">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="relative w-11 h-11 rounded-full overflow-hidden border border-rose-300 shrink-0">
                      <img src="${f.avatar}" alt="${f.name}" class="w-full h-full object-cover" />
                      <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <h5 class="font-bold text-xs text-stone-900 truncate">${f.name}, ${f.age}t</h5>
                        <span class="text-[9px] text-rose-500 font-semibold bg-rose-50 px-1.5 py-0.2 rounded-full">${f.distance}</span>
                      </div>
                      <p class="text-[11px] text-stone-500 truncate mt-0.5">${f.craving}</p>
                    </div>
                  </div>
                  <span class="text-[9px] text-stone-400 shrink-0">${f.time}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    listContainer.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  selectChatTarget(targetId) {
    window.soundFX && window.soundFX.playPop();
    this.currentChatTarget = targetId;
    this.renderFriendsSidebar(false);
    this.renderActiveChatWindow();
  }

  /* ══════════════════════════════════════════
     RIGHT PANEL: ACTIVE CHAT WINDOW (AI OR FRIEND)
  ══════════════════════════════════════════ */

  renderActiveChatWindow() {
    const windowEl = document.getElementById('chat-active-window');
    if (!windowEl) return;

    if (this.currentChatTarget === 'ai') {
      this.renderAIChatWindow(windowEl);
    } else if (typeof this.currentChatTarget === 'string' && this.currentChatTarget.startsWith('group')) {
      this.renderGroupChatWindow(windowEl, this.currentChatTarget);
    } else {
      this.renderFriendChatWindow(windowEl, this.currentChatTarget);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /* ── 1. RENDER AI CHAT WINDOW ── */
  renderAIChatWindow(container) {
    container.innerHTML = `
      <!-- AI Header -->
      <div class="px-5 py-3 bg-white border-b border-stone-200/90 flex items-center justify-between shrink-0 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-400 flex items-center justify-center text-white text-lg shadow-sm">
            🔥
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h4 class="font-extrabold text-sm text-stone-900 leading-tight">FoodTinder AI</h4>
              <span class="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">Trợ lý</span>
            </div>
            <p class="text-[11px] text-stone-500 font-medium">(Trợ lý Ăn uống theo cảm xúc & thời tiết)</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-stone-500">
          <button onclick="window.chatManager.startAICall()" class="p-2 hover:bg-stone-100 rounded-full transition text-stone-600" title="Gọi trợ lý AI">
            <i data-lucide="phone" class="w-4 h-4"></i>
          </button>
          <button onclick="window.chatManager.showAIInfo()" class="p-2 hover:bg-stone-100 rounded-full transition text-stone-600" title="Thông tin trợ lý">
            <i data-lucide="info" class="w-4 h-4"></i>
          </button>
          <button onclick="window.chatManager.resetAIChat()" class="p-2 hover:bg-stone-100 rounded-full transition text-stone-600" title="Làm mới trò chuyện">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Messages Stream -->
      <div id="ai-messages-stream" class="flex-1 overflow-y-auto p-5 space-y-3.5 scrollbar-none" style="max-width:760px; align-self:center; width:100%;">
        ${this.renderAIMessageStreamHtml()}
      </div>

      <!-- Quick prompts -->
      <div class="px-5 py-2 flex gap-2 overflow-x-auto scrollbar-none border-t border-stone-200/60 bg-white/80 text-xs shrink-0" style="max-width:760px; align-self:center; width:100%;">
        <button onclick="window.chatManager.handleUserSubmit('Có ai ở gần muốn đi ăn lẩu không AI ơi?')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full whitespace-nowrap font-bold">👥 Tìm bạn ăn lẩu</button>
        <button onclick="window.chatManager.handleUserSubmit('Trời mưa Quy Nhơn nên ăn gì cho ấm?')" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full whitespace-nowrap text-stone-700 font-medium">🌧️ Mưa ăn gì?</button>
        <button onclick="window.chatManager.handleUserSubmit('Tìm quán nướng bò xì xèo gần đây')" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full whitespace-nowrap text-stone-700 font-medium">🥩 Quán nướng xì xèo</button>
        <button onclick="window.chatManager.handleUserSubmit('Tìm quán cafe yên tĩnh ngắm mưa')" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full whitespace-nowrap text-stone-700 font-medium">☕ Cafe yên tĩnh</button>
        <button onclick="window.chatManager.handleUserSubmit('Món ngon ăn no dưới 50k')" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full whitespace-nowrap text-stone-700 font-medium">💸 Dưới 50k</button>
      </div>

      <!-- AI Chat Input Bar -->
      <div class="p-3.5 bg-white border-t border-stone-200 flex items-center gap-3 shrink-0" style="max-width:760px; align-self:center; width:100%;">
        <input type="text" id="ai-chat-input"
          placeholder="Nhắn cho trợ lý (VD: Có ai ở gần muốn đi ăn lẩu không?)..."
          class="flex-1 bg-stone-100 focus:bg-white text-sm px-4 py-2.5 rounded-full border border-stone-200 focus:border-rose-400 focus:outline-none transition"
          onkeydown="if(event.key==='Enter') window.chatManager.submitAIChatInput()" />
        <button onclick="window.chatManager.submitAIChatInput()"
          class="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-200 hover:opacity-95 transition active:scale-95">
          <i data-lucide="send" class="w-4 h-4 ml-0.5"></i>
        </button>
      </div>
    `;

    const stream = document.getElementById('ai-messages-stream');
    if (stream) stream.scrollTop = stream.scrollHeight;
  }

  renderAIMessageStreamHtml() {
    const nearbyFriends = APP_DATA.nearbyFriends || [];

    return this.aiMessages.map(msg => {
      if (msg.type === 'user') {
        return `
          <div class="flex items-center justify-end">
            <div class="bg-gradient-to-r from-rose-500 via-rose-500 to-amber-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%] shadow-sm text-xs font-medium leading-relaxed">
              ${msg.text}
            </div>
          </div>
        `;
      } else if (msg.type === 'bot_friends') {
        return `
          <div class="flex items-start gap-2.5 w-full">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-sm shadow-sm shrink-0 border border-rose-200 mt-0.5">
              🔥
            </div>
            <div class="flex-1 min-w-0">
              <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[#F2E6DC] text-stone-800 text-xs leading-relaxed mb-3">
                <p>${msg.text}</p>
              </div>

              <!-- Friend Suggestion Cards -->
              <div class="space-y-2 mb-3">
                ${nearbyFriends.map(f => `
                  <div onclick="window.chatManager.selectChatTarget(${f.id})" 
                    class="bg-white rounded-2xl p-2.5 border border-stone-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between gap-3 cursor-pointer group">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="relative w-11 h-11 rounded-full overflow-hidden border-2 border-rose-300 shrink-0">
                        <img src="${f.avatar}" alt="${f.name}" class="w-full h-full object-cover" />
                        <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5">
                          <h5 class="font-bold text-xs text-stone-900 group-hover:text-rose-600 transition truncate">${f.name}, ${f.age} tuổi</h5>
                          <span class="text-[10px] text-stone-400 whitespace-nowrap">- ${f.distance}</span>
                        </div>
                        <p class="text-[11px] text-stone-500 truncate mt-0.5">${f.craving}</p>
                      </div>
                    </div>
                    <button onclick="event.stopPropagation(); window.chatManager.selectChatTarget(${f.id})" 
                      class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded-xl transition shrink-0">
                      Nhắn tin 💬
                    </button>
                  </div>
                `).join('')}
              </div>

              <!-- Quick action buttons -->
              <div class="flex items-center gap-2">
                <button onclick="window.chatManager.selectChatTarget(${nearbyFriends[0]?.id || 1})" 
                  class="flex-1 py-2 px-3 bg-[#F4ECE3] hover:bg-[#EDE1D5] text-stone-800 font-bold text-xs rounded-xl shadow-xs transition text-center">
                  Nhắn tin bạn bè 💬
                </button>
                <button onclick="window.chatManager.selectChatTarget('group-1')" 
                  class="flex-1 py-2 px-3 bg-[#F4ECE3] hover:bg-[#EDE1D5] text-stone-800 font-bold text-xs rounded-xl shadow-xs transition text-center">
                  Trò chuyện nhóm 🍲
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        // Standard bot bubble + optional food grid
        const foodsHtml = msg.foods ? this._buildFoodGrid(msg.foods) : '';
        return `
          <div class="flex items-start gap-2.5 w-full">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-sm shadow-sm shrink-0 border border-rose-200 mt-0.5">
              🔥
            </div>
            <div class="flex-1 min-w-0">
              <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[#F2E6DC] text-stone-800 text-xs leading-relaxed">
                ${msg.html || msg.text}
              </div>
              ${foodsHtml}
            </div>
          </div>
        `;
      }
    }).join('');
  }

  submitAIChatInput() {
    const input = document.getElementById('ai-chat-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';
    this.handleUserSubmit(text);
  }

  handleUserSubmit(text) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    this.aiMessages.push({ type: 'user', text: cleanText });
    this.renderActiveChatWindow();

    setTimeout(() => {
      this.generateSmartResponse(cleanText);
    }, 700);
  }

  generateSmartResponse(query) {
    const q = query.toLowerCase();
    let replyText = '';
    let foods = [];

    if (q.includes('bạn') || q.includes('kết nối') || q.includes('đi ăn cùng') || q.includes('ai đi') || q.includes('có ai')) {
      this.aiMessages.push({
        type: 'bot_friends',
        text: `Đã tìm thấy các bạn bè cùng gu quanh khu vực ${APP_DATA.currentCity.name} cũng đang thèm ăn uống nè! Bạn có thể nhắn tin trực tiếp ở danh sách bên trái hoặc nhấn vào thiệp dưới đây nha 🍲`
      });
      this.renderActiveChatWindow();
      return;
    } else if (q.includes('lẩu') || q.includes('mưa') || q.includes('lạnh') || q.includes('ấm')) {
      replyText = `Trời mưa se lạnh thì ăn Lẩu Thái Tomyum chua cay nóng hổi là hết nước chấm luôn nè! Nồi lẩu sôi sùng sục sẽ làm ấm từ dạ dày đến trái tim 🍲`;
      foods = APP_DATA.foods.filter(f => f.category === 'hotpot' || f.category === 'noodles');
    } else if (q.includes('nướng') || q.includes('thịt') || q.includes('bò') || q.includes('gà') || q.includes('đói')) {
      replyText = `Cơn đói này chỉ có tiếng thịt nướng xì xèo trên ngói đất hoặc gà nướng da giòn mới giải quyết được thôi! 🥩🔥`;
      foods = APP_DATA.foods.filter(f => f.category === 'bbq');
    } else if (q.includes('ngọt') || q.includes('trà sữa') || q.includes('cafe') || q.includes('buồn') || q.includes('yên tĩnh')) {
      replyText = `Đang cần nạp chút ngọt ngào hoặc một góc yên tĩnh view biển để chill đúng không? Ghé ngay Tiệm Trà Mây Mây hoặc The View Rooftop nhé 🧋✨`;
      foods = APP_DATA.foods.filter(f => f.category === 'cafe');
    } else if (q.includes('50k') || q.includes('rẻ') || q.includes('tiết kiệm') || q.includes('sinh viên')) {
      replyText = `Món ngon giá hạt dẻ chỉ từ 35k–40k no nê: Bún sứa chả cá Quy Nhơn hoặc Bánh xèo tôm nhảy giòn rụm! 😋`;
      foods = APP_DATA.foods.filter(f => f.category === 'noodles' || f.category === 'streetfood');
    } else {
      replyText = `Mình đã lọc các quán ngon nhất trong bán kính 2km quanh bạn tại <strong>${APP_DATA.currentCity.name}</strong> nè:`;
      foods = APP_DATA.foods.slice(0, 6);
    }

    this.aiMessages.push({
      type: 'bot',
      text: replyText,
      foods: foods
    });
    this.renderActiveChatWindow();
  }

  resetAIChat() {
    window.soundFX && window.soundFX.playPop();
    this.aiMessages = [];
    this.initDefaultAIMessages();
    this.renderActiveChatWindow();
  }

  /* ── 2. RENDER DIRECT FRIEND CHAT WINDOW ── */
  renderFriendChatWindow(container, friendId) {
    const friend = (APP_DATA.myFriends || []).find(f => f.id === friendId) || 
                   (APP_DATA.nearbyFriends || []).find(f => f.id === friendId);
    if (!friend) {
      this.currentChatTarget = 'ai';
      this.renderAIChatWindow(container);
      return;
    }

    friend.unread = 0;
    const subTitle = friend.relation ? `${friend.relation} • ${friend.status}` : `${friend.distance || ''} • ${friend.status}`;

    container.innerHTML = `
      <!-- Friend Header -->
      <div class="px-5 py-3 bg-white border-b border-stone-200/90 flex items-center justify-between shrink-0 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-rose-300 shadow-xs">
            <img src="${friend.avatar}" alt="${friend.name}" class="w-full h-full object-cover" />
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 ${friend.status === 'Online' ? 'bg-emerald-500' : 'bg-stone-300'} rounded-full border border-white"></span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h4 class="font-extrabold text-sm text-stone-900 leading-tight">${friend.name}</h4>
              ${friend.age ? `<span class="text-[11px] text-stone-500 font-semibold">${friend.age}t</span>` : ''}
              ${friend.relation ? `<span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full">${friend.relation}</span>` : ''}
            </div>
            <p class="text-[11px] text-emerald-600 font-medium">${subTitle}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.chatManager.callFriend('${friend.name}')" class="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition" title="Gọi điện">
            <i data-lucide="phone" class="w-4 h-4"></i>
          </button>
          <button onclick="window.chatManager.sendFoodInviteToFriend(${friend.id})" 
            class="px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-95 transition flex items-center gap-1">
            <span>Rủ đi ăn</span> <span>🍲</span>
          </button>
        </div>
      </div>

      <!-- Messages Stream -->
      <div id="friend-messages-stream" class="flex-1 overflow-y-auto p-5 space-y-3.5 scrollbar-none" style="max-width:760px; align-self:center; width:100%;">
        <div class="flex justify-center">
          <span class="bg-stone-200/70 text-stone-600 text-[10px] font-semibold px-3 py-0.5 rounded-full">Hôm nay</span>
        </div>

        ${friend.messages.map(m => `
          <div class="flex items-start gap-2 ${m.sender === 'you' ? 'justify-end' : 'justify-start'}">
            ${m.sender !== 'you' ? `<img src="${friend.avatar}" class="w-7 h-7 rounded-full object-cover mt-0.5" />` : ''}
            <div class="${m.sender === 'you' ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-stone-800 rounded-2xl rounded-tl-sm border border-stone-200 shadow-xs'} px-3.5 py-2.5 max-w-[75%] text-xs leading-relaxed">
              ${m.text}
              <div class="text-[9px] ${m.sender === 'you' ? 'text-white/80' : 'text-stone-400'} text-right mt-1">${m.time}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Quick eatery sharing bar -->
      <div class="px-4 py-2 bg-white/90 border-t border-stone-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs shrink-0" style="max-width:760px; align-self:center; width:100%;">
        <span class="text-[10px] text-stone-400 font-bold shrink-0">Gửi quán:</span>
        <button onclick="window.chatManager.sendFoodDirectly(${friend.id}, 1)" class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 text-[11px] font-semibold whitespace-nowrap">🍲 Lẩu Thái Cô Vy</button>
        <button onclick="window.chatManager.sendFoodDirectly(${friend.id}, 2)" class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 text-[11px] font-semibold whitespace-nowrap">🥩 Bò Nướng Gia Bảo</button>
        <button onclick="window.chatManager.sendFoodDirectly(${friend.id}, 3)" class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 text-[11px] font-semibold whitespace-nowrap">🧋 Trà Sữa Mây Mây</button>
      </div>

      <!-- Friend Message Input Bar -->
      <div class="p-3.5 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0" style="max-width:760px; align-self:center; width:100%;">
        <input type="text" id="friend-chat-input" 
          placeholder="Nhắn tin cho ${friend.name}..."
          class="flex-1 bg-stone-100 text-xs px-4 py-2.5 rounded-full border border-stone-200 focus:outline-none focus:bg-white focus:border-rose-400 transition"
          onkeydown="if(event.key==='Enter') window.chatManager.sendFriendMessage(${friend.id})" />
        <button onclick="window.chatManager.sendFriendMessage(${friend.id})"
          class="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-sm hover:opacity-95 transition">
          <i data-lucide="send" class="w-4 h-4 ml-0.5"></i>
        </button>
      </div>
    `;

    const stream = document.getElementById('friend-messages-stream');
    if (stream) stream.scrollTop = stream.scrollHeight;
  }

  /* ── 3. RENDER GROUP CHAT WINDOW ── */
  renderGroupChatWindow(container, groupId) {
    const group = (APP_DATA.groupChats || []).find(g => g.id === groupId);
    if (!group) return;

    group.unread = 0;

    container.innerHTML = `
      <!-- Group Header -->
      <div class="px-5 py-3 bg-white border-b border-stone-200/90 flex items-center justify-between shrink-0 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl overflow-hidden border border-amber-300">
            <img src="${group.avatar}" alt="${group.name}" class="w-full h-full object-cover" />
          </div>
          <div>
            <h4 class="font-extrabold text-sm text-stone-900 leading-tight">${group.name}</h4>
            <p class="text-[11px] text-stone-500 font-medium">${group.membersCount} thành viên • Đang hẹn ăn lẩu</p>
          </div>
        </div>
        <button onclick="window.app.showToast('Đã gửi thông báo hẹn giờ ăn cho cả nhóm! ⏰')" 
          class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition">
          Hẹn giờ ăn ⏰
        </button>
      </div>

      <!-- Messages Stream -->
      <div id="group-messages-stream" class="flex-1 overflow-y-auto p-5 space-y-3.5 scrollbar-none" style="max-width:760px; align-self:center; width:100%;">
        ${group.messages.map(m => `
          <div class="flex items-start gap-2 ${m.sender === 'Bạn' ? 'justify-end' : 'justify-start'}">
            ${m.sender !== 'Bạn' ? `<div class="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">${m.sender[0]}</div>` : ''}
            <div class="${m.sender === 'Bạn' ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-stone-800 rounded-2xl rounded-tl-sm border border-stone-200 shadow-xs'} px-3.5 py-2.5 max-w-[75%] text-xs leading-relaxed">
              ${m.sender !== 'Bạn' ? `<div class="font-bold text-[10px] text-rose-500 mb-0.5">${m.sender}</div>` : ''}
              ${m.text}
              <div class="text-[9px] ${m.sender === 'Bạn' ? 'text-white/80' : 'text-stone-400'} text-right mt-1">${m.time}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Group Input Bar -->
      <div class="p-3.5 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0" style="max-width:760px; align-self:center; width:100%;">
        <input type="text" id="group-chat-input" 
          placeholder="Nhắn tin vào nhóm..."
          class="flex-1 bg-stone-100 text-xs px-4 py-2.5 rounded-full border border-stone-200 focus:outline-none focus:bg-white focus:border-rose-400"
          onkeydown="if(event.key==='Enter') window.chatManager.sendGroupMessage('${group.id}')" />
        <button onclick="window.chatManager.sendGroupMessage('${group.id}')"
          class="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-sm">
          <i data-lucide="send" class="w-4 h-4 ml-0.5"></i>
        </button>
      </div>
    `;

    const stream = document.getElementById('group-messages-stream');
    if (stream) stream.scrollTop = stream.scrollHeight;
  }

  /* ── MESSAGE ACTIONS ── */
  sendFriendMessage(friendId) {
    const input = document.getElementById('friend-chat-input');
    if (!input || !input.value.trim()) return;

    const friend = (APP_DATA.myFriends || []).find(f => f.id === friendId) || 
                   (APP_DATA.nearbyFriends || []).find(f => f.id === friendId);
    if (!friend) return;

    window.soundFX && window.soundFX.playPop();
    const text = input.value.trim();
    input.value = '';

    friend.messages.push({
      sender: 'you',
      text: text,
      time: 'Vừa xong'
    });

    this.renderActiveChatWindow();
    this.renderFriendsSidebar(false);

    // Auto reply
    setTimeout(() => {
      window.soundFX && window.soundFX.playPop();
      const replies = [
        `Okie luôn nè! Mình qua liền đó, gặp nhau ở quán nha! 🥰✨`,
        `Duyệt nha bạn ơi, đang thèm món này dữ dội luôn! 🍲🔥`,
        `Tuyệt vời! Tầm 15 phút nữa mình có mặt nhé! 🙋‍♀️✨`
      ];
      friend.messages.push({
        sender: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: 'Vừa xong'
      });
      if (this.currentChatTarget === friendId) {
        this.renderActiveChatWindow();
      }
      this.renderFriendsSidebar(false);
    }, 1100);
  }

  sendGroupMessage(groupId) {
    const input = document.getElementById('group-chat-input');
    if (!input || !input.value.trim()) return;

    const group = (APP_DATA.groupChats || []).find(g => g.id === groupId);
    if (!group) return;

    window.soundFX && window.soundFX.playPop();
    const text = input.value.trim();
    input.value = '';

    group.messages.push({
      sender: 'Bạn',
      text: text,
      time: 'Vừa xong'
    });

    this.renderActiveChatWindow();
    this.renderFriendsSidebar(false);
  }

  sendFoodInviteToFriend(friendId) {
    const friend = (APP_DATA.myFriends || []).find(f => f.id === friendId) || 
                   (APP_DATA.nearbyFriends || []).find(f => f.id === friendId);
    if (!friend) return;

    const food = APP_DATA.foods[0]; // Lẩu Thái Quán Cô Vy
    window.soundFX && window.soundFX.playMatch();

    friend.messages.push({
      sender: 'you',
      text: `🍲 [LỜI MỜI ĐI ĂN] Mình rủ bạn qua "${food.name} - ${food.restaurant}" (${food.distanceText}) nha! Đi liền cho nóng hổi!`,
      time: 'Vừa xong'
    });

    this.renderActiveChatWindow();
    this.renderFriendsSidebar(false);
    window.app.showToast(`Đã gửi lời mời đi ăn cho ${friend.name}! 🎉`);
  }

  sendFoodDirectly(friendId, foodId) {
    const friend = (APP_DATA.myFriends || []).find(f => f.id === friendId) || 
                   (APP_DATA.nearbyFriends || []).find(f => f.id === friendId);
    const food = APP_DATA.foods.find(f => f.id === foodId);
    if (!friend || !food) return;

    window.soundFX && window.soundFX.playMatch();
    friend.messages.push({
      sender: 'you',
      text: `📍 [GỢI Ý QUÁN] "${food.name} - ${food.restaurant}" (${food.distanceText} • ${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}). Đi quán này nha bạn ơi! 😋`,
      time: 'Vừa xong'
    });

    this.renderActiveChatWindow();
    this.renderFriendsSidebar(false);
    window.app.showToast(`Đã chia sẻ quán ${food.name} cho ${friend.name}! 🍲`);
  }

  callFriend(name) {
    window.soundFX && window.soundFX.playMatch();
    window.app.showToast(`📞 Đang gọi cho ${name}...`);
  }

  startAICall() {
    window.soundFX && window.soundFX.playMatch();
    window.app.showToast("📞 Đang kết nối cuộc gọi thoại với FoodTinder AI...");
  }

  showAIInfo() {
    window.soundFX && window.soundFX.playPop();
    window.app.showToast("ℹ️ FoodTinder AI: Trợ lý ẩm thực kết nối bạn bè & món ngon theo cảm xúc!");
  }

  /* ══════════════════════════════════════════
     ADD FRIEND MODAL
  ══════════════════════════════════════════ */
  openAddFriendModal() {
    window.soundFX && window.soundFX.playPop();
    const modal = document.getElementById('add-friend-modal');
    const input = document.getElementById('add-friend-input');
    const list = document.getElementById('suggested-friends-list');

    if (!modal) return;
    if (input) input.value = '';

    const suggestions = [
      { name: "Khánh Huyền", relation: "Thích lẩu Tomyum", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", phone: "0908 123 456" },
      { name: "Đăng Khoa", relation: "Thần ăn nướng bò", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", phone: "0932 789 123" },
      { name: "Phương Thảo", relation: "Mê trà sữa béo ngậy", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", phone: "0915 456 789" }
    ];

    if (list) {
      list.innerHTML = suggestions.map(s => `
        <div class="flex items-center justify-between p-2 rounded-xl bg-stone-50 hover:bg-rose-50/50 transition border border-stone-100">
          <div class="flex items-center gap-2.5">
            <img src="${s.avatar}" class="w-9 h-9 rounded-full object-cover border" />
            <div>
              <h6 class="font-bold text-xs text-stone-800">${s.name}</h6>
              <p class="text-[10px] text-stone-400">${s.relation} • ${s.phone}</p>
            </div>
          </div>
          <button onclick="window.chatManager.addSuggestedFriend('${s.name}', '${s.relation}', '${s.avatar}', '${s.phone}')"
            class="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold transition">
            + Kết bạn
          </button>
        </div>
      `).join('');
    }

    modal.classList.remove('hidden');
  }

  addSuggestedFriend(name, relation, avatar, phone) {
    window.soundFX && window.soundFX.playMatch();
    const newFriend = {
      id: Date.now(),
      name: name,
      nickname: name.split(' ')[name.split(' ').length - 1],
      relation: relation,
      avatar: avatar,
      status: "Online",
      bio: "Bạn mới kết nối từ danh bạ 🤝",
      phone: phone,
      unread: 0,
      time: "Vừa xong",
      messages: [
        { sender: "them", text: `Chào bạn nha! Mình là ${name}, rất vui được kết nối trên FoodTinder! Hôm nào đi ăn lẩu/nướng cùng nha! ✨🍲`, time: "Vừa xong" }
      ]
    };

    APP_DATA.myFriends.unshift(newFriend);
    document.getElementById('add-friend-modal')?.classList.add('hidden');
    this.renderFriendsSidebar();
    this.selectChatTarget(newFriend.id);
    window.app.showToast(`Đã kết bạn thành công với ${name}! 🎉`);
  }

  submitAddFriend() {
    const input = document.getElementById('add-friend-input');
    if (!input || !input.value.trim()) {
      window.app.showToast("Vui lòng nhập tên hoặc số điện thoại bạn bè! ✍️");
      return;
    }
    const name = input.value.trim();
    this.addSuggestedFriend(
      name,
      "Bạn mới kết nối",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      "0909 *** ***"
    );
  }

  /* Food suggestion GRID helper */
  _buildFoodGrid(foods) {
    if (!foods || foods.length === 0) return '';
    const gridId = 'food-grid-' + (++this._gridCounter);
    const VISIBLE = 4;
    const hasMore = foods.length > VISIBLE;

    const cardHtml = (food, hidden = false) => `
      <div onclick="window.app.showFoodDetail(${food.id})"
        class="food-suggestion-card bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col ${hidden ? 'hidden' : ''}">
        <div class="relative h-24 w-full overflow-hidden bg-stone-100">
          <img src="${food.image}" alt="${food.name}"
            data-name="${food.name.replace(/"/g, '&quot;')}"
            data-restaurant="${(food.restaurant || '').replace(/"/g, '&quot;')}"
            data-category="${food.category || ''}"
            onerror="window.handleFoodImageError && window.handleFoodImageError(this, '${food.name.replace(/'/g, "\\'")}', '${(food.restaurant || '').replace(/'/g, "\\'")}', '${food.category || ''}')"
            class="w-full h-full object-cover" />
          <span class="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
            📍 ${food.distanceText.replace('Cách bạn ', '')}
          </span>
          <span class="absolute top-1.5 right-1.5 bg-black/50 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
            ⭐ ${window.formatRating ? window.formatRating(food.rating) : food.rating}
          </span>
        </div>
        <div class="p-2.5 flex flex-col flex-1 justify-between">
          <div>
            <h6 class="font-bold text-[11px] text-stone-800 leading-snug line-clamp-2">${food.name}</h6>
            <p class="text-[10px] text-stone-400 truncate mt-0.5">${food.restaurant}</p>
          </div>
          <div class="mt-2 flex items-center justify-between gap-1">
            <span class="text-[10px] font-bold text-rose-500">${window.formatPriceRange ? window.formatPriceRange(food.priceRange) : food.priceRange}</span>
            <button onclick="event.stopPropagation();window.app.openMapWithFood(${food.id})"
              class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[9px] font-bold whitespace-nowrap">
              Chỉ đường 📍
            </button>
          </div>
        </div>
      </div>
    `;

    const visibleCards = foods.slice(0, VISIBLE).map(f => cardHtml(f, false)).join('');
    const hiddenCards = hasMore ? foods.slice(VISIBLE).map(f => cardHtml(f, true)).join('') : '';

    const moreBtn = hasMore ? `
      <button id="${gridId}-more-btn"
        onclick="window.chatManager._toggleMore('${gridId}', ${foods.length}, ${VISIBLE})"
        class="col-span-2 mt-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-100 transition">
        <span id="${gridId}-more-label">Xem thêm ${foods.length - VISIBLE} quán khác ↓</span>
      </button>
    ` : '';

    return `
      <div id="${gridId}" class="grid grid-cols-2 gap-2.5 mt-3 w-full">
        ${visibleCards}
        ${hiddenCards}
        ${moreBtn}
      </div>
    `;
  }

  _toggleMore(gridId, total, visible) {
    const grid = document.getElementById(gridId);
    const labelEl = document.getElementById(gridId + '-more-label');
    if (!grid) return;

    const hiddenCards = grid.querySelectorAll('.food-suggestion-card.hidden');
    const isExpanded = hiddenCards.length === 0;

    if (!isExpanded) {
      hiddenCards.forEach(c => c.classList.remove('hidden'));
      if (labelEl) labelEl.textContent = '↑ Rút gọn';
    } else {
      const allCards = grid.querySelectorAll('.food-suggestion-card');
      allCards.forEach((c, i) => {
        if (i >= visible) c.classList.add('hidden');
      });
      if (labelEl) labelEl.textContent = `Xem thêm ${total - visible} quán khác ↓`;
      const stream = document.getElementById('ai-messages-stream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }
  }
}

window.chatManager = new FoodChatManager();
