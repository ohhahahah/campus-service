(function() {
    'use strict';

    /* ============================================================
     * 校园超市后台主逻辑
     * 数据存储：
     *   - campus_shop_admin_session    登录态
     *   - campus_shop_delivery_orders  订单池（前台 push, 后台 pull）
     *   - campus_shop_products         商品库存（前台读，后台写）
     *   - campus_shop_chat_<orderId>   每个订单的私信记录
     * ============================================================ */

    /* 登录态校验 */
    var session = null;
    try {
        session = JSON.parse(localStorage.getItem('campus_shop_admin_session') || 'null');
    } catch (e) {}
    if (!session || session.user !== 'admin' || Date.now() > session.expire) {
        location.href = 'shop-login.html';
        return;
    }

    /* ===== 工具函数 ===== */
    function _get(key, def) {
        try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
        catch (e) { return def; }
    }
    function _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

    function getOrders() { return _get('campus_shop_delivery_orders', []); }
    function saveOrders(list) { _set('campus_shop_delivery_orders', list); }

    function getProducts() { return _get('campus_shop_products', {}); }
    function saveProducts(p) { _set('campus_shop_products', p); }

    function getChat(orderId) { return _get('campus_shop_chat_' + orderId, []); }
    function saveChat(orderId, list) { _set('campus_shop_chat_' + orderId, list); }

    function showToast(msg, ok) {
        var old = document.querySelector('.sa-toast');
        if (old) old.remove();
        var t = document.createElement('div');
        t.className = 'sa-toast' + (ok === false ? ' sa-toast-error' : '');
        t.innerHTML = '<i class="fas ' + (ok === false ? 'fa-exclamation-circle' : 'fa-check-circle') + '"></i> ' + msg;
        document.body.appendChild(t);
        setTimeout(function() { if (t.parentNode) t.remove(); }, 2400);
    }

    var statusMap = {
        pending: { label: '待接单', color: '#FF7D3B', icon: 'fa-clock' },
        delivering: { label: '配送中', color: '#2468CD', icon: 'fa-truck' },
        done: { label: '已送达', color: '#34C787', icon: 'fa-check-circle' },
        cancelled: { label: '已取消', color: '#E84C50', icon: 'fa-times-circle' }
    };

    /* ============================================================
     * Tab 切换
     * ============================================================ */
    var tabs = document.querySelectorAll('.sa-tab');
    var contents = document.querySelectorAll('.sa-tab-content');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contents.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(this.getAttribute('data-tab')).classList.add('active');
        });
    });

    /* ============================================================
     * 订单列表渲染
     * ============================================================ */
    var currentFilter = 'all';
    var filterBtns = document.querySelectorAll('.sa-filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderOrders();
        });
    });

    function renderOrders() {
        var orders = getOrders();
        var list = document.getElementById('ordersList');

        /* 统计 */
        var pending = orders.filter(function(o) { return o.status === 'pending'; }).length;
        var delivering = orders.filter(function(o) { return o.status === 'delivering'; }).length;
        var done = orders.filter(function(o) { return o.status === 'done'; }).length;
        document.getElementById('statPending').textContent = pending;
        document.getElementById('statDelivering').textContent = delivering;
        document.getElementById('statDone').textContent = done;
        document.getElementById('statTotal').textContent = orders.length;
        document.getElementById('badgePending').textContent = pending;
        document.getElementById('badgeDelivering').textContent = delivering;

        /* 过滤 */
        var filtered = currentFilter === 'all' ? orders : orders.filter(function(o) { return o.status === currentFilter; });

        if (filtered.length === 0) {
            list.innerHTML = '<div class="sa-empty"><i class="fas fa-inbox"></i><p>暂无' + (currentFilter === 'all' ? '订单' : '符合条件订单') + '</p><span>学生下单后将自动出现在此处</span></div>';
            return;
        }

        list.innerHTML = filtered.map(function(o) {
            var itemsHtml = (o.items || []).map(function(i) {
                return '<span class="sa-order-item-tag">' + i.name + ' ×' + i.qty + '</span>';
            }).join('');

            var st = statusMap[o.status] || statusMap.pending;
            var isNew = o.highlighted && !o.readAt;
            var actionsHtml = '';
            if (o.status === 'pending') {
                actionsHtml = '<button class="sa-action-btn sa-btn-accept" data-action="accept" data-id="' + o.orderId + '"><i class="fas fa-check"></i> 接单</button>' +
                    '<button class="sa-action-btn sa-btn-cancel" data-action="cancel" data-id="' + o.orderId + '"><i class="fas fa-times"></i> 取消</button>';
            } else if (o.status === 'delivering') {
                actionsHtml = '<button class="sa-action-btn sa-btn-done" data-action="done" data-id="' + o.orderId + '"><i class="fas fa-flag-checkered"></i> 标记已送达</button>';
            }

            return '<div class="sa-order-card' + (isNew ? ' sa-order-new' : '') + '" data-id="' + o.orderId + '">' +
                (isNew ? '<div class="sa-new-flag"><i class="fas fa-bolt"></i> 新订单</div>' : '') +
                '<div class="sa-order-header">' +
                    '<div class="sa-order-id"><i class="fas fa-receipt"></i> ' + o.orderId + '</div>' +
                    '<span class="sa-status-tag" style="background:' + st.color + '1A;color:' + st.color + ';"><i class="fas ' + st.icon + '"></i> ' + st.label + '</span>' +
                '</div>' +
                '<div class="sa-order-body">' +
                    '<div class="sa-order-col sa-order-col-items">' +
                        '<div class="sa-order-col-title"><i class="fas fa-box"></i> 商品清单</div>' +
                        '<div class="sa-order-items">' + itemsHtml + '</div>' +
                        '<div class="sa-order-total">合计：<span>¥' + (o.total || 0).toFixed(1) + '</span></div>' +
                    '</div>' +
                    '<div class="sa-order-col sa-order-col-info">' +
                        '<div class="sa-order-col-title"><i class="fas fa-user"></i> 收货信息</div>' +
                        '<div class="sa-order-info-row"><i class="fas fa-user"></i> 姓名：<strong>' + (o.name || '-') + '</strong></div>' +
                        '<div class="sa-order-info-row"><i class="fas fa-building"></i> 楼栋：<strong>' + (o.building || '-') + '</strong></div>' +
                        '<div class="sa-order-info-row"><i class="fas fa-door-closed"></i> 房间号：<strong>' + (o.room || '-') + '</strong></div>' +
                        '<div class="sa-order-info-row"><i class="fas fa-clock"></i> 配送时段：<strong>' + (o.timeSlot || '-') + '</strong></div>' +
                        '<div class="sa-order-info-row"><i class="fas fa-phone"></i> 电话：<strong>' + (o.phone || '-') + '</strong></div>' +
                        '<div class="sa-order-info-row"><i class="fas fa-calendar"></i> 下单时间：<strong>' + (o.time || '-') + '</strong></div>' +
                    '</div>' +
                '</div>' +
                '<div class="sa-order-footer">' +
                    '<button class="sa-action-btn sa-btn-chat" data-action="chat" data-id="' + o.orderId + '"><i class="fas fa-comments"></i> 私信</button>' +
                    actionsHtml +
                '</div>' +
            '</div>';
        }).join('');

        /* 标记已读新订单 */
        setTimeout(function() {
            var arr = getOrders();
            var changed = false;
            arr.forEach(function(o) {
                if (o.highlighted && !o.readAt) {
                    o.readAt = Date.now();
                    changed = true;
                }
            });
            if (changed) saveOrders(arr);
        }, 1500);

        /* 绑定操作按钮 */
        list.querySelectorAll('.sa-action-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var action = this.getAttribute('data-action');
                var id = this.getAttribute('data-id');
                if (action === 'chat') openChat(id);
                else handleOrderAction(id, action);
            });
        });
    }

    function handleOrderAction(orderId, action) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.orderId === orderId; });
        if (!order) return;

        if (action === 'accept') {
            order.status = 'delivering';
            order.acceptedAt = Date.now();
            showToast('已接单，状态：配送中');
        } else if (action === 'done') {
            order.status = 'done';
            order.doneAt = Date.now();
            showToast('已标记为已送达');
        } else if (action === 'cancel') {
            order.status = 'cancelled';
            order.cancelledAt = Date.now();
            showToast('订单已取消', false);
        }
        order.highlighted = false;
        saveOrders(orders);
        renderOrders();
    }

    /* ============================================================
     * 聊天功能
     * ============================================================ */
    var currentChatOrderId = null;
    var chatModal = document.getElementById('chatModal');
    var chatCloseBtn = document.getElementById('chatCloseBtn');
    var chatSendBtn = document.getElementById('chatSendBtn');
    var chatInput = document.getElementById('chatInput');
    var chatMessages = document.getElementById('chatMessages');
    var chatOrderTitle = document.getElementById('chatOrderTitle');
    var chatOrderMeta = document.getElementById('chatOrderMeta');

    chatCloseBtn.addEventListener('click', closeChat);
    chatModal.addEventListener('click', function(e) { if (e.target === chatModal) closeChat(); });

    function openChat(orderId) {
        var order = getOrders().find(function(o) { return o.orderId === orderId; });
        if (!order) return;
        currentChatOrderId = orderId;
        chatOrderTitle.textContent = '订单 ' + orderId;
        chatOrderMeta.innerHTML = '<i class="fas fa-user"></i> ' + (order.name || '-') +
            '　<i class="fas fa-building"></i> ' + (order.building || '-') + ' ' + (order.room || '') +
            '　<i class="fas fa-clock"></i> ' + (order.timeSlot || '-');
        renderChat();
        chatModal.classList.add('show');
    }

    function closeChat() {
        chatModal.classList.remove('show');
        currentChatOrderId = null;
    }

    function renderChat() {
        if (!currentChatOrderId) return;
        var msgs = getChat(currentChatOrderId);
        if (msgs.length === 0) {
            chatMessages.innerHTML = '<div class="sa-chat-empty"><i class="fas fa-comment-dots"></i><p>暂无消息，主动发一条消息吧</p></div>';
            return;
        }
        chatMessages.innerHTML = msgs.map(function(m) {
            var side = m.from === 'admin' ? 'right' : 'left';
            return '<div class="sa-chat-msg sa-chat-msg-' + side + '">' +
                '<div class="sa-chat-bubble">' + (m.text || '') + '</div>' +
                '<div class="sa-chat-time">' + (m.time || '') + '</div>' +
            '</div>';
        }).join('');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendChat(text) {
        if (!currentChatOrderId || !text) return;
        var msgs = getChat(currentChatOrderId);
        var now = new Date();
        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        msgs.push({ from: 'admin', text: text, time: timeStr, ts: Date.now() });
        saveChat(currentChatOrderId, msgs);
        renderChat();

        /* 模拟学生自动回复（演示用，真实环境由学生前台触发） */
        setTimeout(function() {
            var replies = [
                '好的，我知道了',
                '麻烦尽快配送，谢谢',
                '我现在在宿舍等',
                '收到，请问什么时候到？',
                '好的，辛苦了'
            ];
            var reply = replies[Math.floor(Math.random() * replies.length)];
            var list = getChat(currentChatOrderId);
            var t = new Date();
            list.push({ from: 'student', text: reply, time: t.getHours().toString().padStart(2, '0') + ':' + t.getMinutes().toString().padStart(2, '0'), ts: Date.now() });
            saveChat(currentChatOrderId, list);
            if (currentChatOrderId) renderChat();
        }, 1500 + Math.random() * 1500);
    }

    chatSendBtn.addEventListener('click', function() {
        var text = chatInput.value.trim();
        if (!text) return;
        sendChat(text);
        chatInput.value = '';
    });
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var text = chatInput.value.trim();
            if (!text) return;
            sendChat(text);
            chatInput.value = '';
        }
    });

    /* ============================================================
     * 商品管理
     * ============================================================ */
    var currentCat = 'snack';
    var catTabs = document.querySelectorAll('.sa-cat-tab');
    catTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            catTabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            currentCat = this.getAttribute('data-cat');
            renderProducts();
        });
    });

    var catLabels = { snack: '零食', drink: '饮料', daily: '日用品', stationery: '文具' };

    function renderProducts() {
        var products = getProducts();
        var list = document.getElementById('productsList');
        var items = products[currentCat] || [];
        if (items.length === 0) {
            list.innerHTML = '<div class="sa-empty"><i class="fas fa-box-open"></i><p>暂无商品</p></div>';
            return;
        }
        list.innerHTML = items.map(function(p) {
            var off = p.offShelf ? '已下架' : '上架中';
            var offClass = p.offShelf ? 'sa-off-yes' : 'sa-off-no';
            return '<div class="sa-product-card' + (p.offShelf ? ' sa-product-off' : '') + '">' +
                '<div class="sa-product-img"><img src="' + (p.img || '') + '" alt=""></div>' +
                '<div class="sa-product-info">' +
                    '<h4>' + (p.name || '-') + '</h4>' +
                    '<div class="sa-product-meta">' +
                        '<span class="sa-product-price">¥' + (p.price || 0).toFixed(1) + '</span>' +
                        '<span class="sa-product-stock">库存 <input type="number" class="sa-stock-input" data-id="' + p.id + '" value="' + (p.stock || 0) + '" min="0" max="9999"></span>' +
                    '</div>' +
                '</div>' +
                '<div class="sa-product-actions">' +
                    '<span class="sa-off-tag ' + offClass + '"><i class="fas fa-circle"></i> ' + off + '</span>' +
                    '<button class="sa-product-btn sa-btn-toggle" data-id="' + p.id + '">' + (p.offShelf ? '<i class="fas fa-arrow-up"></i> 上架' : '<i class="fas fa-arrow-down"></i> 下架') + '</button>' +
                '</div>' +
            '</div>';
        }).join('');

        /* 库存修改 */
        list.querySelectorAll('.sa-stock-input').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var id = this.getAttribute('data-id');
                var val = parseInt(this.value, 10);
                if (isNaN(val) || val < 0) val = 0;
                updateStock(currentCat, id, val);
                showToast('库存已更新');
            });
        });

        /* 上下架切换 */
        list.querySelectorAll('.sa-btn-toggle').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = this.getAttribute('data-id');
                toggleShelf(currentCat, id);
            });
        });
    }

    function updateStock(cat, id, val) {
        var products = getProducts();
        var arr = products[cat] || [];
        var item = arr.find(function(p) { return p.id === id; });
        if (item) {
            item.stock = val;
            saveProducts(products);
            /* 触发前台同步 */
            fireStorage('campus_shop_products', products);
        }
    }

    function toggleShelf(cat, id) {
        var products = getProducts();
        var arr = products[cat] || [];
        var item = arr.find(function(p) { return p.id === id; });
        if (item) {
            item.offShelf = !item.offShelf;
            saveProducts(products);
            fireStorage('campus_shop_products', products);
            renderProducts();
            showToast(item.offShelf ? '已下架，前台不再展示' : '已上架');
        }
    }

    /* 主动派发 storage 事件，使同浏览器其它标签页（前台）实时同步 */
    function fireStorage(key, value) {
        try {
            var ev = new StorageEvent('storage', { key: key, newValue: JSON.stringify(value) });
            window.dispatchEvent(ev);
        } catch (e) {}
    }

    /* ============================================================
     * 跨页面同步
     * ============================================================ */
    window.addEventListener('storage', function(e) {
        if (e.key === 'campus_shop_delivery_orders') {
            renderOrders();
        }
        if (e.key === 'campus_shop_chat_' + currentChatOrderId) {
            renderChat();
        }
    });

    /* 主动轮询：每隔 2 秒拉取一次订单，捕捉新订单（同浏览器/同机多设备演示） */
    var lastOrderCount = 0;
    function pollOrders() {
        var orders = getOrders();
        if (orders.length > lastOrderCount && lastOrderCount > 0) {
            /* 检查是否有真正的新订单 */
            var hasNew = orders.some(function(o) { return o.highlighted && !o.readAt; });
            if (hasNew) {
                showToast('收到新订单！请及时处理');
                if (navigator.vibrate) navigator.vibrate(200);
            }
        }
        lastOrderCount = orders.length;
        renderOrders();
    }

    /* ============================================================
     * 退出登录
     * ============================================================ */
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('campus_shop_admin_session');
            location.href = 'shop-login.html';
        }
    });

    /* ============================================================
     * 初始化
     * ============================================================ */
    renderOrders();
    renderProducts();
    setInterval(pollOrders, 2500);
})();
