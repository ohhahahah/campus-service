document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
     * 数据存储（与电信学生端共用）
     * ============================================================ */
    var STORAGE_KEY = 'campus_telecom_orders';
    var CHAT_KEY = 'campus_telecom_chat';

    function _get(key, def) {
        try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
        catch(e) { return def; }
    }
    function _set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    }

    function getOrders() { return _get(STORAGE_KEY, []); }
    function saveOrders(list) { _set(STORAGE_KEY, list); }

    function getChatData() { return _get(CHAT_KEY, {}); }
    function saveChatData(data) { _set(CHAT_KEY, data); }

    var STAFF_NAME = '业务员小李';
    var STAFF_ID = 'staff_001';

    /* ============================================================
     * Toast
     * ============================================================ */
    function showToast(msg) {
        var toast = document.getElementById('taToast');
        var msgEl = document.getElementById('taToastMsg');
        if (!toast) return;
        msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    /* ============================================================
     * Tab 切换
     * ============================================================ */
    var tabs = document.querySelectorAll('.ta-tab');
    var contents = document.querySelectorAll('.ta-tab-content');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contents.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            var target = this.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    /* ============================================================
     * 统计数据
     * ============================================================ */
    function updateStats() {
        var orders = getOrders();
        var pending = orders.filter(function(o) { return o.status === '待接单'; }).length;
        var accepted = orders.filter(function(o) { return o.status === '已接单'; }).length;
        var processing = orders.filter(function(o) { return o.status === '办理中'; }).length;
        var done = orders.filter(function(o) { return o.status === '业务办结'; }).length;

        document.getElementById('statPending').textContent = pending;
        document.getElementById('statAccepted').textContent = accepted;
        document.getElementById('statProcessing').textContent = processing;
        document.getElementById('statDone').textContent = done;

        var badge = document.getElementById('pendingBadge');
        badge.textContent = pending;
        badge.setAttribute('data-count', pending);
        badge.style.display = pending > 0 ? 'inline-flex' : 'none';
    }

    /* ============================================================
     * 渲染工单列表
     * ============================================================ */
    function renderList(containerId, orders, status) {
        var container = document.getElementById(containerId);
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<div class="ta-empty"><i class="fas fa-inbox"></i><p>暂无' + status + '的工单</p></div>';
            return;
        }

        var html = '<div class="ta-orders-grid">';
        orders.forEach(function(order) {
            html += '<div class="ta-order-card">' +
                '<div class="ta-order-header">' +
                    '<div class="ta-order-type"><i class="fas fa-phone-alt"></i>' + order.type + '</div>' +
                    '<span class="ta-order-id">' + order.id + '</span>' +
                '</div>' +
                '<div class="ta-order-info">' +
                    '<div class="ta-order-info-item"><i class="fas fa-user"></i>' + order.name + '</div>' +
                    '<div class="ta-order-info-item"><i class="fas fa-building"></i>' + order.dorm + '</div>' +
                    '<div class="ta-order-info-item"><i class="fas fa-mobile-alt"></i>' + order.phone + '</div>' +
                    '<div class="ta-order-info-item"><i class="fas fa-clock"></i>' + order.createTime + '</div>' +
                '</div>' +
                (order.desc ? '<div class="ta-order-desc">' + order.desc + '</div>' : '') +
                (order.acceptorName ? '<div class="ta-order-time"><i class="fas fa-user-tie"></i>业务员：' + order.acceptorName + (order.acceptTime ? ' · ' + order.acceptTime : '') + '</div>' : '') +
                '<div class="ta-order-actions">';

            if (order.status === '待接单') {
                html += '<button class="ta-btn-accept" data-id="' + order.id + '"><i class="fas fa-check"></i>一键接单</button>';
            } else if (order.status === '已接单') {
                html += '<button class="ta-btn-process" data-id="' + order.id + '"><i class="fas fa-cog"></i>开始办理</button>';
                html += '<button class="ta-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>沟通</button>';
            } else if (order.status === '办理中') {
                html += '<button class="ta-btn-finish" data-id="' + order.id + '"><i class="fas fa-flag-checkered"></i>办结</button>';
                html += '<button class="ta-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>沟通</button>';
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

        renderList('pendingList', orders.filter(function(o) { return o.status === '待接单'; }), '待接单');
        renderList('acceptedList', orders.filter(function(o) { return o.status === '已接单'; }), '已接单');
        renderList('processingList', orders.filter(function(o) { return o.status === '办理中'; }), '办理中');
        renderList('doneList', orders.filter(function(o) { return o.status === '业务办结'; }), '业务办结');
    }

    /* ============================================================
     * 绑定按钮事件
     * ============================================================ */
    function bindActions(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        container.querySelectorAll('.ta-btn-accept').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                acceptOrder(oid);
            });
        });

        container.querySelectorAll('.ta-btn-process').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                processOrder(oid);
            });
        });

        container.querySelectorAll('.ta-btn-finish').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                finishOrder(oid);
            });
        });

        container.querySelectorAll('.ta-btn-chat').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                var orders = getOrders();
                var order = orders.find(function(o) { return o.id === oid; });
                if (order) openChat(order);
            });
        });
    }

    /* ============================================================
     * 工单操作
     * ============================================================ */
    function acceptOrder(oid) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === oid; });
        if (!order) return;
        order.status = '已接单';
        order.acceptor = STAFF_ID;
        order.acceptorName = STAFF_NAME;
        order.acceptTime = new Date().toLocaleString();
        saveOrders(orders);
        showToast('已接单：' + order.type);
        renderAll();
    }

    function processOrder(oid) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === oid; });
        if (!order) return;
        order.status = '办理中';
        saveOrders(orders);
        showToast('开始办理：' + order.type);
        renderAll();
    }

    function finishOrder(oid) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === oid; });
        if (!order) return;
        order.status = '业务办结';
        order.doneTime = new Date().toLocaleString();
        saveOrders(orders);
        showToast('业务办结：' + order.type);
        renderAll();
    }

    /* ============================================================
     * 聊天功能
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

    if (chatClose) chatClose.addEventListener('click', closeChat);
    if (chatModal) {
        chatModal.addEventListener('click', function(e) {
            if (e.target === chatModal) closeChat();
        });
    }

    function renderChatMessages(order) {
        var chatData = getChatData();
        var session = chatData[order.chatSessionKey] || [];
        chatMessages.innerHTML = '';

        session.forEach(function(msg) {
            var div = document.createElement('div');
            div.className = 'ta-msg ' + (msg.from === 'staff' ? 'ta-msg-self' : 'ta-msg-other');
            div.innerHTML = msg.text + '<div class="ta-msg-time">' + msg.time + '</div>';
            chatMessages.appendChild(div);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendChatMsg() {
        if (!currentChatOrder) return;
        var text = chatInput.value.trim();
        if (!text) return;

        var chatData = getChatData();
        var key = currentChatOrder.chatSessionKey;
        if (!chatData[key]) chatData[key] = [];

        chatData[key].push({
            from: 'staff',
            text: text,
            time: new Date().toLocaleTimeString()
        });

        saveChatData(chatData);
        chatInput.value = '';
        renderChatMessages(currentChatOrder);

        /* 模拟学生回复 */
        setTimeout(function() {
            var replies = [
                '好的，谢谢！',
                '我大概什么时间可以来？',
                '明白了，我等消息。',
                '请问需要带什么材料吗？',
                '好的，辛苦了！'
            ];
            chatData[key].push({
                from: 'student',
                text: replies[Math.floor(Math.random() * replies.length)],
                time: new Date().toLocaleTimeString()
            });
            saveChatData(chatData);
            renderChatMessages(currentChatOrder);
        }, 2000);
    }

    if (chatSend) chatSend.addEventListener('click', sendChatMsg);
    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); sendChatMsg(); }
        });
    }

    /* ============================================================
     * 新工单实时提醒
     * ============================================================ */
    var lastOrderCount = getOrders().filter(function(o) { return o.status === '待接单'; }).length;

    function checkNewOrders() {
        var orders = getOrders();
        var currentPending = orders.filter(function(o) { return o.status === '待接单'; }).length;

        if (currentPending > lastOrderCount) {
            showNewOrderAlert(currentPending);
        }
        lastOrderCount = currentPending;
        updateStats();
    }

    function showNewOrderAlert(count) {
        /* 移除旧的提醒 */
        var old = document.querySelector('.ta-new-order-alert');
        if (old) old.remove();

        var alert = document.createElement('div');
        alert.className = 'ta-new-order-alert';
        alert.innerHTML = '<i class="fas fa-bell"></i><div><strong>新工单提醒</strong><br>当前有 ' + count + ' 个待接单工单</div>';
        alert.addEventListener('click', function() {
            /* 切换到待接单tab */
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

    /* 每3秒轮询检查 */
    setInterval(checkNewOrders, 3000);

    /* ============================================================
     * 初始化
     * ============================================================ */
    renderAll();

});
