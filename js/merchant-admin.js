document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
     * 权限验证 - 仅审核通过的商家可进入
     * ============================================================ */
    var currentUser = null;
    if (window.CampusDB) {
        currentUser = CampusDB.getCurrentUser();
    } else {
        try { currentUser = JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) {}
    }

    if (!currentUser || currentUser.role !== 'merchant') {
        window.location.href = 'login.html';
        return;
    }

    var merchantId = currentUser.merchantId || '';
    var shopName = currentUser.shopName || currentUser.name || '商家';

    /* 读取商家完整信息，显示审核状态 */
    var merchantInfo = null;
    if (window.CampusDB && merchantId) {
        merchantInfo = CampusDB.getMerchantById(merchantId);
    }
    if (!merchantInfo) {
        var allMerchants = [];
        if (window.CampusDB) { allMerchants = CampusDB.getMerchants(); }
        else { try { allMerchants = JSON.parse(localStorage.getItem('campus_merchants') || '[]'); } catch(ex) {} }
        merchantInfo = allMerchants.find(function(m) { return m.id === merchantId || m.account === currentUser.account; });
    }

    document.getElementById('maShopName').textContent = shopName + ' · 商家工作台';

    /* 在 Hero 区域显示审核状态徽章 */
    if (merchantInfo && merchantInfo.status === 'approved') {
        var heroContent = document.querySelector('.ma-hero-content');
        if (heroContent) {
            var badge = document.createElement('div');
            badge.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:6px 18px;border-radius:20px;background:rgba(255,255,255,0.2);color:#fff;font-size:13px;font-weight:600';
            badge.innerHTML = '<i class="fas fa-check-circle"></i> 审核已通过，正常营业中';
            heroContent.appendChild(badge);
        }
    }

    /* ============================================================
     * 数据存储 Key
     * ============================================================ */
    var ORDER_KEY = 'campus_merchant_orders';
    var CHAT_KEY = 'campus_merchant_chat';

    function _get(key, def) {
        try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
        catch(e) { return def; }
    }
    function _set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    }

    function getOrders() {
        if (window.CampusDB) return CampusDB.getMerchantOrdersByMerchantId(merchantId);
        return _get(ORDER_KEY, []).filter(function(o) { return o.merchantId === merchantId; });
    }
    function getAllOrders() {
        if (window.CampusDB) return CampusDB.getMerchantOrders();
        return _get(ORDER_KEY, []);
    }
    function getChatData() { return _get(CHAT_KEY, {}); }
    function saveChatData(data) { _set(CHAT_KEY, data); }

    /* ============================================================
     * Toast
     * ============================================================ */
    function showToast(msg) {
        var toast = document.getElementById('maToast');
        var msgEl = document.getElementById('maToastMsg');
        if (!toast) return;
        msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    /* ============================================================
     * Tab 切换
     * ============================================================ */
    var tabs = document.querySelectorAll('.ma-tab');
    var contents = document.querySelectorAll('.ma-tab-content');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contents.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(this.getAttribute('data-tab')).classList.add('active');
        });
    });

    /* ============================================================
     * 统计
     * ============================================================ */
    function updateStats() {
        var orders = getOrders();
        var pending = orders.filter(function(o) { return o.status === '待接单'; }).length;
        var accepted = orders.filter(function(o) { return o.status === '已接单'; }).length;
        var done = orders.filter(function(o) { return o.status === '已办结'; }).length;

        document.getElementById('statPending').textContent = pending;
        document.getElementById('statAccepted').textContent = accepted;
        document.getElementById('statDone').textContent = done;

        var badge = document.getElementById('pendingBadge');
        badge.textContent = pending;
        badge.setAttribute('data-count', pending);
        badge.style.display = pending > 0 ? 'inline-flex' : 'none';
    }

    /* ============================================================
     * 渲染工单
     * ============================================================ */
    function renderList(containerId, orders, emptyText) {
        var container = document.getElementById(containerId);
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<div class="ma-empty"><i class="fas fa-inbox"></i><p>' + emptyText + '</p></div>';
            return;
        }

        var html = '<div class="ma-orders-grid">';
        orders.forEach(function(order) {
            html += '<div class="ma-order-card">' +
                '<div class="ma-order-header">' +
                    '<div class="ma-order-type"><i class="fas fa-concierge-bell"></i>学生求助</div>' +
                    '<span class="ma-order-id">' + order.id + '</span>' +
                '</div>' +
                '<div class="ma-order-desc"><strong>需求：</strong>' + order.content + '</div>' +
                '<div class="ma-order-info">' +
                    '<div class="ma-order-info-item"><i class="fas fa-user"></i>' + order.userName + '</div>' +
                    '<div class="ma-order-info-item"><i class="fas fa-phone"></i>' + order.userPhone + '</div>' +
                    '<div class="ma-order-info-item"><i class="fas fa-clock"></i>' + order.createTime + '</div>' +
                    (order.acceptTime ? '<div class="ma-order-info-item"><i class="fas fa-check"></i>接单：' + order.acceptTime + '</div>' : '') +
                '</div>' +
                '<div class="ma-order-actions">';

            if (order.status === '待接单') {
                html += '<button class="ma-btn-accept" data-id="' + order.id + '"><i class="fas fa-check"></i>一键接单</button>';
            } else if (order.status === '已接单') {
                html += '<button class="ma-btn-finish" data-id="' + order.id + '"><i class="fas fa-flag-checkered"></i>办结</button>';
                html += '<button class="ma-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>沟通</button>';
            }

            html += '</div></div>';
        });
        html += '</div>';

        container.innerHTML = html;
        bindActions(containerId);
    }

    function renderAll() {
        var orders = getOrders();
        updateStats();
        renderList('pendingList', orders.filter(function(o) { return o.status === '待接单'; }), '暂无待接单的工单');
        renderList('acceptedList', orders.filter(function(o) { return o.status === '已接单'; }), '暂无已接单的工单');
        renderList('doneList', orders.filter(function(o) { return o.status === '已办结'; }), '暂无已办结的工单');
        renderList('allList', orders, '暂无工单记录');
    }

    /* ============================================================
     * 绑定按钮
     * ============================================================ */
    function bindActions(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        container.querySelectorAll('.ma-btn-accept').forEach(function(btn) {
            btn.addEventListener('click', function() { acceptOrder(this.getAttribute('data-id')); });
        });

        container.querySelectorAll('.ma-btn-finish').forEach(function(btn) {
            btn.addEventListener('click', function() { finishOrder(this.getAttribute('data-id')); });
        });

        container.querySelectorAll('.ma-btn-chat').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                var orders = getOrders();
                var order = orders.find(function(o) { return o.id === oid; });
                if (!order) {
                    var all = getAllOrders();
                    order = all.find(function(o) { return o.id === oid; });
                }
                if (order) openChat(order);
            });
        });
    }

    /* ============================================================
     * 工单操作
     * ============================================================ */
    function acceptOrder(oid) {
        if (window.CampusDB) {
            CampusDB.acceptMerchantOrder(oid, shopName);
        } else {
            var all = _get(ORDER_KEY, []);
            var found = all.find(function(o) { return o.id === oid; });
            if (found) {
                found.status = '已接单';
                found.acceptTime = new Date().toLocaleString();
                found.acceptorName = shopName;
                _set(ORDER_KEY, all);
            }
        }
        showToast('已接单');
        renderAll();
    }

    function finishOrder(oid) {
        if (window.CampusDB) {
            CampusDB.finishMerchantOrder(oid);
        } else {
            var all = _get(ORDER_KEY, []);
            var found = all.find(function(o) { return o.id === oid; });
            if (found) {
                found.status = '已办结';
                found.doneTime = new Date().toLocaleString();
                _set(ORDER_KEY, all);
            }
        }
        showToast('已办结');
        renderAll();
    }

    /* ============================================================
     * 聊天
     * ============================================================ */
    var chatModal = document.getElementById('chatModal');
    var chatClose = document.getElementById('chatClose');
    var chatMessages = document.getElementById('chatMessages');
    var chatInput = document.getElementById('chatInput');
    var chatSend = document.getElementById('chatSend');
    var currentChatOrder = null;

    function openChat(order) {
        currentChatOrder = order;
        chatModal.classList.add('active');
        renderChatMessages(order);
    }

    function closeChat() {
        chatModal.classList.remove('active');
        currentChatOrder = null;
    }

    chatClose.addEventListener('click', closeChat);
    chatModal.addEventListener('click', function(e) { if (e.target === chatModal) closeChat(); });

    function renderChatMessages(order) {
        var chatData = getChatData();
        var key = order.chatKey || order.id;
        var session = chatData[key] || [];
        chatMessages.innerHTML = '';

        session.forEach(function(msg) {
            var div = document.createElement('div');
            div.className = 'ma-msg ' + (msg.from === 'merchant' ? 'ma-msg-self' : 'ma-msg-other');
            div.innerHTML = msg.text + '<div class="ma-msg-time">' + msg.time + '</div>';
            chatMessages.appendChild(div);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendChatMsg() {
        if (!currentChatOrder) return;
        var text = chatInput.value.trim();
        if (!text) return;

        var chatData = getChatData();
        var key = currentChatOrder.chatKey || currentChatOrder.id;
        if (!chatData[key]) chatData[key] = [];

        chatData[key].push({ from: 'merchant', text: text, time: new Date().toLocaleTimeString() });
        saveChatData(chatData);
        chatInput.value = '';
        renderChatMessages(currentChatOrder);

        /* 模拟学生回复 */
        setTimeout(function() {
            var replies = ['好的，谢谢！', '大概多久能到？', '知道了，辛苦商家！', '收到，期待！', '谢谢，方便了'];
            chatData[key].push({ from: 'student', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString() });
            saveChatData(chatData);
            renderChatMessages(currentChatOrder);
        }, 2000);
    }

    chatSend.addEventListener('click', sendChatMsg);
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); sendChatMsg(); }
    });

    /* ============================================================
     * 新工单提醒
     * ============================================================ */
    var lastPendingCount = getOrders().filter(function(o) { return o.status === '待接单'; }).length;

    function checkNewOrders() {
        var orders = getOrders();
        var currentPending = orders.filter(function(o) { return o.status === '待接单'; }).length;

        if (currentPending > lastPendingCount) {
            showNewOrderAlert(currentPending);
        }
        lastPendingCount = currentPending;
        updateStats();
    }

    function showNewOrderAlert(count) {
        var old = document.querySelector('.ma-new-alert');
        if (old) old.remove();

        var alert = document.createElement('div');
        alert.className = 'ma-new-alert';
        alert.innerHTML = '<i class="fas fa-bell"></i><div><strong>新求助提醒</strong><br>当前有 ' + count + ' 个待接单工单</div>';
        alert.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contents.forEach(function(c) { c.classList.remove('active'); });
            document.querySelector('[data-tab="pending"]').classList.add('active');
            document.getElementById('pending').classList.add('active');
            this.remove();
            renderAll();
        });
        document.body.appendChild(alert);
        setTimeout(function() { if (alert.parentNode) alert.remove(); }, 8000);
    }

    setInterval(checkNewOrders, 3000);

    /* ============================================================
     * 配送服务模块（新增，不影响原有订单业务）
     * 存储 key：campus_merchant_delivery_<merchantId>
     * 结构：[{address, building, timeSlot, status, remark, createdAt}]
     * ============================================================ */
    var DELIVERY_KEY_PREFIX = 'campus_merchant_delivery_';
    var DELIVERY_KEY = DELIVERY_KEY_PREFIX + (merchantId || 'default');

    function getDeliveryList() { return _get(DELIVERY_KEY, []); }
    function saveDeliveryList(list) { _set(DELIVERY_KEY, list); }

    function statusColor(status) {
        switch (status) {
            case '待配送': return 'pending';
            case '配送中': return 'accepted';
            case '已送达': return 'done';
            case '已取消': return 'rejected';
            default: return 'pending';
        }
    }

    function renderDeliveryList() {
        var wrap = document.getElementById('deliveryListWrap');
        if (!wrap) return;
        var list = getDeliveryList();
        var tip = document.getElementById('deliveryCountTip');
        if (tip) tip.textContent = '共 ' + list.length + ' 条记录';

        if (list.length === 0) {
            wrap.innerHTML = '<div class="ma-delivery-empty">' +
                '<i class="fas fa-inbox"></i>' +
                '<p>暂无配送记录</p>' +
                '<span>请在上方录入配送信息</span>' +
                '</div>';
            return;
        }

        var html = '<div class="ma-delivery-list">';
        list.forEach(function(item, idx) {
            var st = statusColor(item.status);
            html += '<div class="ma-delivery-item ma-delivery-status-' + st + '">' +
                '<div class="ma-delivery-item-no">' + (idx + 1) + '</div>' +
                '<div class="ma-delivery-item-main">' +
                '<div class="ma-delivery-item-line"><i class="fas fa-map-marker-alt"></i>' +
                '<strong>地址：</strong><span>' + (item.address || '-') + '</span></div>' +
                '<div class="ma-delivery-item-line"><i class="fas fa-building"></i>' +
                '<strong>楼栋：</strong><span>' + (item.building || '-') + '</span></div>' +
                '<div class="ma-delivery-item-line"><i class="fas fa-clock"></i>' +
                '<strong>时段：</strong><span>' + (item.timeSlot || '-') + '</span></div>' +
                (item.remark ? '<div class="ma-delivery-item-line"><i class="fas fa-sticky-note"></i>' +
                '<strong>备注：</strong><span>' + item.remark + '</span></div>' : '') +
                '<div class="ma-delivery-item-line ma-delivery-item-meta"><i class="fas fa-calendar-alt"></i>' +
                '<span>创建于 ' + (item.createdAt || '-') + '</span></div>' +
                '</div>' +
                '<div class="ma-delivery-item-side">' +
                '<span class="ma-delivery-status-badge ma-delivery-status-' + st + '">' + (item.status || '-') + '</span>' +
                '<button class="ma-delivery-del" data-idx="' + idx + '" title="删除"><i class="fas fa-times"></i></button>' +
                '</div>' +
                '</div>';
        });
        html += '</div>';
        wrap.innerHTML = html;

        /* 删除按钮绑定 */
        wrap.querySelectorAll('.ma-delivery-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-idx'));
                var data = getDeliveryList();
                if (isNaN(idx) || idx < 0 || idx >= data.length) return;
                data.splice(idx, 1);
                saveDeliveryList(data);
                renderDeliveryList();
                showToast('已删除配送记录');
            });
        });
    }

    /* 表单提交 */
    var deliveryForm = document.getElementById('deliveryForm');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var address = document.getElementById('deliveryAddress').value.trim();
            var building = document.getElementById('deliveryBuilding').value.trim();
            var timeSlot = document.getElementById('deliveryTimeSlot').value.trim();
            var status = document.getElementById('deliveryStatus').value.trim();
            var remark = document.getElementById('deliveryRemark').value.trim();

            if (!address || !building || !timeSlot || !status) {
                showToast('请完整填写必填字段');
                return;
            }

            var list = getDeliveryList();
            list.push({
                address: address,
                building: building,
                timeSlot: timeSlot,
                status: status,
                remark: remark,
                createdAt: new Date().toLocaleString()
            });
            saveDeliveryList(list);

            deliveryForm.reset();
            renderDeliveryList();
            showToast('配送信息已保存');
        });
    }

    /* 重置按钮 */
    var deliveryResetBtn = document.getElementById('deliveryResetBtn');
    if (deliveryResetBtn) {
        deliveryResetBtn.addEventListener('click', function() {
            if (deliveryForm) deliveryForm.reset();
            showToast('表单已重置');
        });
    }

    /* 跨页面同步：配送数据变化时刷新 */
    window.addEventListener('storage', function(e) {
        if (e.key === DELIVERY_KEY) {
            renderDeliveryList();
        }
    });

    /* 初始渲染配送列表 */
    renderDeliveryList();

    /* ============================================================
     * 初始化
     * ============================================================ */
    renderAll();

});
