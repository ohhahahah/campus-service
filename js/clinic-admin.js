document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
     * 登录拦截：未登录则显示拦截弹窗，阻止后续功能初始化
     * ============================================================ */
    var DOCTOR_ACCOUNT = 'school_doc';
    var DOCTOR_PASSWORD = '123456';
    var DOCTOR_LOGIN_KEY = 'campus_clinic_doctor_login';

    function isDoctorLoggedIn() {
        try {
            var data = JSON.parse(localStorage.getItem(DOCTOR_LOGIN_KEY) || 'null');
            return !!data && data.account === DOCTOR_ACCOUNT;
        } catch(e) { return false; }
    }

    var guardOverlay = document.getElementById('caLoginGuardOverlay');
    var guardBtn = document.getElementById('caLoginGuardBtn');

    if (!isDoctorLoggedIn()) {
        if (guardOverlay) guardOverlay.classList.add('active');
        if (guardBtn) {
            guardBtn.addEventListener('click', function() {
                var accInput = document.getElementById('caGuardAccount');
                var pwdInput = document.getElementById('caGuardPassword');
                var account = accInput ? accInput.value.trim() : '';
                var password = pwdInput ? pwdInput.value.trim() : '';
                if (!account || !password) {
                    showToast('请输入账号和密码');
                    return;
                }
                if (account !== DOCTOR_ACCOUNT || password !== DOCTOR_PASSWORD) {
                    showToast('账号或密码错误');
                    return;
                }
                try {
                    localStorage.setItem(DOCTOR_LOGIN_KEY, JSON.stringify({
                        account: account,
                        loginTime: new Date().toISOString()
                    }));
                } catch(e) {}
                if (guardOverlay) guardOverlay.classList.remove('active');
                showToast('登录成功，正在加载工作台...');
                setTimeout(function() { window.location.reload(); }, 600);
            });
        }
        return;
    }

    /* ============================================================
     * 数据存储（与学生端共用）
     * ============================================================ */
    var ORDER_KEY = 'campus_clinic_orders';
    var CHAT_KEY = 'campus_clinic_chat';

    function _get(key, def) {
        try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
        catch(e) { return def; }
    }
    function _set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    }

    function getOrders() { return _get(ORDER_KEY, []); }
    function saveOrders(list) { _set(ORDER_KEY, list); }
    function getChatData() { return _get(CHAT_KEY, {}); }
    function saveChatData(data) { _set(CHAT_KEY, data); }

    var DOCTOR_NAME = '王医生';
    var DOCTOR_ID = 'doc1';

    /* ============================================================
     * Toast
     * ============================================================ */
    function showToast(msg) {
        var toast = document.getElementById('caToast');
        var msgEl = document.getElementById('caToastMsg');
        if (!toast) return;
        msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    /* ============================================================
     * Tab 切换
     * ============================================================ */
    var tabs = document.querySelectorAll('.ca-tab');
    var contents = document.querySelectorAll('.ca-tab-content');

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
        var processing = orders.filter(function(o) { return o.status === '办理中'; }).length;
        var done = orders.filter(function(o) { return o.status === '已办结'; }).length;

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
     * 渲染工单
     * ============================================================ */
    function renderList(containerId, orders, emptyText) {
        var container = document.getElementById(containerId);
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<div class="ca-empty"><i class="fas fa-inbox"></i><p>' + emptyText + '</p></div>';
            return;
        }

        var html = '<div class="ca-orders-grid">';
        orders.forEach(function(order) {
            var badges = '';
            if (order.medicine && order.medicine !== '无') {
                badges += '<span class="ca-badge-medicine"><i class="fas fa-pills"></i>' + order.medicine + '</span>';
            }
            if (order.needDelivery) {
                badges += '<span class="ca-badge-delivery"><i class="fas fa-truck"></i>送药上门</span>';
            }
            if (order.handleType) {
                badges += '<span class="ca-badge-handle"><i class="fas fa-stethoscope"></i>' + order.handleType + '</span>';
            }

            html += '<div class="ca-order-card">' +
                '<div class="ca-order-header">' +
                    '<div class="ca-order-type"><i class="fas fa-plus-circle"></i>求助工单</div>' +
                    '<span class="ca-order-id">' + order.id + '</span>' +
                '</div>' +
                '<div class="ca-order-symptom"><strong>症状：</strong>' + order.symptom + '</div>' +
                (badges ? '<div class="ca-order-badges">' + badges + '</div>' : '') +
                '<div class="ca-order-info">' +
                    '<div class="ca-order-info-item"><i class="fas fa-user"></i>' + order.name + '</div>' +
                    '<div class="ca-order-info-item"><i class="fas fa-building"></i>' + order.dorm + '</div>' +
                    '<div class="ca-order-info-item"><i class="fas fa-mobile-alt"></i>' + order.phone + '</div>' +
                    '<div class="ca-order-info-item"><i class="fas fa-clock"></i>' + order.createTime + '</div>' +
                '</div>' +
                (order.acceptorName ? '<div class="ca-order-time"><i class="fas fa-user-md"></i>校医：' + order.acceptorName + (order.acceptTime ? ' · ' + order.acceptTime : '') + '</div>' : '') +
                '<div class="ca-order-actions">';

            if (order.status === '待接单') {
                html += '<button class="ca-btn-accept" data-id="' + order.id + '"><i class="fas fa-check"></i>一键接单</button>';
            } else if (order.status === '已接单') {
                html += '<button class="ca-btn-process" data-id="' + order.id + '"><i class="fas fa-cog"></i>选择处理方式</button>';
                html += '<button class="ca-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>沟通</button>';
            } else if (order.status === '办理中') {
                html += '<button class="ca-btn-finish" data-id="' + order.id + '"><i class="fas fa-flag-checkered"></i>办结</button>';
                html += '<button class="ca-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>沟通</button>';
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
        renderList('processingList', orders.filter(function(o) { return o.status === '办理中'; }), '暂无办理中的工单');
        renderList('doneList', orders.filter(function(o) { return o.status === '已办结'; }), '暂无已办结的工单');
        renderList('historyList', orders, '暂无历史记录');
    }

    /* ============================================================
     * 绑定按钮
     * ============================================================ */
    function bindActions(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        container.querySelectorAll('.ca-btn-accept').forEach(function(btn) {
            btn.addEventListener('click', function() { acceptOrder(this.getAttribute('data-id')); });
        });

        container.querySelectorAll('.ca-btn-process').forEach(function(btn) {
            btn.addEventListener('click', function() { openHandleModal(this.getAttribute('data-id')); });
        });

        container.querySelectorAll('.ca-btn-finish').forEach(function(btn) {
            btn.addEventListener('click', function() { finishOrder(this.getAttribute('data-id')); });
        });

        container.querySelectorAll('.ca-btn-chat').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                var order = getOrders().find(function(o) { return o.id === oid; });
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
        order.acceptor = DOCTOR_ID;
        order.acceptorName = DOCTOR_NAME;
        order.acceptTime = new Date().toLocaleString();
        saveOrders(orders);
        showToast('已接单：' + order.symptom.substring(0, 15) + '...');
        renderAll();
    }

    var currentHandleOid = null;

    function openHandleModal(oid) {
        currentHandleOid = oid;
        document.getElementById('handleModal').classList.add('active');
    }

    /* 处理方式选择 */
    document.querySelectorAll('.ca-handle-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
            var type = this.getAttribute('data-type');
            if (!currentHandleOid) return;

            var orders = getOrders();
            var order = orders.find(function(o) { return o.id === currentHandleOid; });
            if (!order) return;

            order.status = '办理中';
            order.handleType = type;
            saveOrders(orders);

            document.getElementById('handleModal').classList.remove('active');
            showToast('处理方式：' + type);
            currentHandleOid = null;
            renderAll();
        });
    });

    document.getElementById('handleClose').addEventListener('click', function() {
        document.getElementById('handleModal').classList.remove('active');
        currentHandleOid = null;
    });

    document.getElementById('handleModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            currentHandleOid = null;
        }
    });

    function finishOrder(oid) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === oid; });
        if (!order) return;
        order.status = '已办结';
        order.doneTime = new Date().toLocaleString();
        saveOrders(orders);
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
        var session = chatData[order.chatSessionKey] || [];
        chatMessages.innerHTML = '';

        session.forEach(function(msg) {
            var div = document.createElement('div');
            div.className = 'ca-msg ' + (msg.from === 'doctor' ? 'ca-msg-self' : 'ca-msg-other');
            div.innerHTML = msg.text + '<div class="ca-msg-time">' + msg.time + '</div>';
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

        chatData[key].push({ from: 'doctor', text: text, time: new Date().toLocaleTimeString() });
        saveChatData(chatData);
        chatInput.value = '';
        renderChatMessages(currentChatOrder);
    }

    chatSend.addEventListener('click', sendChatMsg);
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); sendChatMsg(); }
    });

    /* ============================================================
     * 新工单实时提醒
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
        var old = document.querySelector('.ca-new-alert');
        if (old) old.remove();

        var alert = document.createElement('div');
        alert.className = 'ca-new-alert';
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
     * 初始化
     * ============================================================ */
    renderAll();

});
