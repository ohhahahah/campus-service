document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
     * 数据存储
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

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    /* ============================================================
     * Toast 提示
     * ============================================================ */
    function showToast(msg) {
        var toast = document.getElementById('telToast');
        var msgEl = document.getElementById('telToastMsg');
        if (!toast) return;
        msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    /* ============================================================
     * 统计数字动画
     * ============================================================ */
    document.querySelectorAll('.tel-stat-num').forEach(function(el) {
        var target = parseInt(el.getAttribute('data-target')) || 0;
        var current = 0;
        var step = Math.max(1, Math.ceil(target / 30));
        var timer = setInterval(function() {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current;
        }, 40);
    });

    /* ============================================================
     * Tab 切换
     * ============================================================ */
    var tabs = document.querySelectorAll('.tel-tab');
    var contents = document.querySelectorAll('.tel-tab-content');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contents.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            var target = this.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
            if (target === 'myorders') renderMyOrders();
        });
    });

    /* ============================================================
     * 业务类型选择
     * ============================================================ */
    var selectedType = '';
    var typeCards = document.querySelectorAll('.tel-type-card');

    typeCards.forEach(function(card) {
        card.addEventListener('click', function() {
            typeCards.forEach(function(c) { c.classList.remove('selected'); });
            this.classList.add('selected');
            selectedType = this.getAttribute('data-type');
        });
    });

    /* ============================================================
     * 文件上传
     * ============================================================ */
    var uploadArea = document.getElementById('uploadArea');
    var fileInput = document.getElementById('telIdCard');
    var placeholder = document.getElementById('uploadPlaceholder');
    var preview = document.getElementById('uploadPreview');
    var previewImg = document.getElementById('previewImg');
    var removeBtn = document.getElementById('removeImg');
    var uploadedFileData = '';

    if (uploadArea) {
        uploadArea.addEventListener('click', function(e) {
            if (e.target.closest('.tel-upload-remove')) return;
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            var file = this.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                showToast('文件大小不能超过5MB');
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                uploadedFileData = e.target.result;
                previewImg.src = uploadedFileData;
                placeholder.style.display = 'none';
                preview.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            uploadedFileData = '';
            fileInput.value = '';
            placeholder.style.display = 'flex';
            preview.style.display = 'none';
        });
    }

    /* ============================================================
     * 提交工单
     * ============================================================ */
    var form = document.getElementById('telecomForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!selectedType) {
                showToast('请选择业务类型');
                return;
            }

            var name = document.getElementById('telName').value.trim();
            var dorm = document.getElementById('telDorm').value.trim();
            var phone = document.getElementById('telPhone').value.trim();
            var desc = document.getElementById('telDesc').value.trim();

            if (!name || !dorm || !phone) {
                showToast('请填写完整信息');
                return;
            }

            if (!/^1[3-9]\d{9}$/.test(phone)) {
                showToast('手机号格式不正确');
                return;
            }

            var user = getCurrentUser();
            var orders = getOrders();

            var order = {
                id: 'TEL' + Date.now(),
                type: selectedType,
                name: name,
                dorm: dorm,
                phone: phone,
                desc: desc,
                idCardImage: uploadedFileData ? 'uploaded' : '',
                status: '待接单',
                userId: user ? user.stuId : 'guest',
                userName: user ? user.name : name,
                acceptor: '',
                acceptorName: '',
                createTime: new Date().toLocaleString(),
                acceptTime: '',
                doneTime: '',
                chatSessionKey: 'tel_' + Date.now()
            };

            orders.unshift(order);
            saveOrders(orders);

            showToast('工单提交成功，等待业务员接单');
            form.reset();
            typeCards.forEach(function(c) { c.classList.remove('selected'); });
            selectedType = '';
            uploadedFileData = '';
            placeholder.style.display = 'flex';
            preview.style.display = 'none';

            /* 切换到我的工单 */
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contents.forEach(function(c) { c.classList.remove('active'); });
            document.querySelector('[data-tab="myorders"]').classList.add('active');
            document.getElementById('myorders').classList.add('active');
            renderMyOrders();
        });
    }

    /* ============================================================
     * 我的工单列表
     * ============================================================ */
    function renderMyOrders() {
        var container = document.getElementById('myOrdersList');
        if (!container) return;

        var user = getCurrentUser();
        var orders = getOrders();

        if (user) {
            orders = orders.filter(function(o) { return o.userId === user.stuId; });
        }

        if (orders.length === 0) {
            container.innerHTML = '<div class="tel-empty-state"><i class="fas fa-inbox"></i><p>暂无工单记录</p></div>';
            return;
        }

        container.innerHTML = '';
        orders.forEach(function(order) {
            var statusClass = '';
            if (order.status === '待接单') statusClass = 'tel-status-pending';
            else if (order.status === '已接单') statusClass = 'tel-status-accepted';
            else if (order.status === '办理中') statusClass = 'tel-status-processing';
            else if (order.status === '业务办结') statusClass = 'tel-status-done';

            var canChat = (order.status === '已接单' || order.status === '办理中') && order.acceptor;

            var card = document.createElement('div');
            card.className = 'tel-order-card';
            card.innerHTML =
                '<div class="tel-order-header">' +
                    '<div class="tel-order-type"><i class="fas fa-phone-alt"></i>' + order.type + '</div>' +
                    '<span class="tel-order-status ' + statusClass + '">' + order.status + '</span>' +
                '</div>' +
                '<div class="tel-order-info">' +
                    '<div class="tel-order-info-item"><i class="fas fa-user"></i>' + order.name + '</div>' +
                    '<div class="tel-order-info-item"><i class="fas fa-building"></i>' + order.dorm + '</div>' +
                    '<div class="tel-order-info-item"><i class="fas fa-mobile-alt"></i>' + order.phone + '</div>' +
                '</div>' +
                (order.desc ? '<div class="tel-order-desc">' + order.desc + '</div>' : '') +
                '<div class="tel-order-actions">' +
                    (canChat ? '<button class="tel-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>与业务员沟通</button>' : '') +
                    '<button class="tel-btn-detail" data-id="' + order.id + '"><i class="fas fa-info-circle"></i>详情</button>' +
                '</div>';

            container.appendChild(card);
        });

        /* 绑定聊天按钮 */
        container.querySelectorAll('.tel-btn-chat').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                var order = orders.find(function(o) { return o.id === oid; });
                if (order) openChat(order);
            });
        });

        /* 绑定详情按钮 */
        container.querySelectorAll('.tel-btn-detail').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                var order = orders.find(function(o) { return o.id === oid; });
                if (order) showOrderDetail(order);
            });
        });
    }

    /* ============================================================
     * 工单详情弹窗（简化版用alert替代，或内联展开）
     * ============================================================ */
    function showOrderDetail(order) {
        var info = '业务类型：' + order.type +
                   '\n状态：' + order.status +
                   '\n姓名：' + order.name +
                   '\n宿舍号：' + order.dorm +
                   '\n手机号：' + order.phone +
                   '\n提交时间：' + order.createTime;
        if (order.acceptorName) info += '\n业务员：' + order.acceptorName;
        if (order.acceptTime) info += '\n接单时间：' + order.acceptTime;
        if (order.doneTime) info += '\n办结时间：' + order.doneTime;
        if (order.desc) info += '\n说明：' + order.desc;
        alert(info);
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

        if (session.length === 0) {
            var welcomeMsg = {
                from: 'staff',
                text: '您好，我是您的业务员，请问有什么可以帮您？',
                time: new Date().toLocaleTimeString()
            };
            session.push(welcomeMsg);
            chatData[order.chatSessionKey] = session;
            saveChatData(chatData);
        }

        session.forEach(function(msg) {
            var div = document.createElement('div');
            div.className = 'tel-msg ' + (msg.from === 'student' ? 'tel-msg-self' : 'tel-msg-other');
            div.innerHTML = msg.text + '<div class="tel-msg-time">' + msg.time + '</div>';
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
            from: 'student',
            text: text,
            time: new Date().toLocaleTimeString()
        });

        saveChatData(chatData);
        chatInput.value = '';
        renderChatMessages(currentChatOrder);

        /* 模拟业务员自动回复 */
        setTimeout(function() {
            var replies = [
                '好的，已记录您的需求，请稍候。',
                '请问您方便来营业厅办理吗？',
                '我帮您查一下，请稍等。',
                '信息已确认，预计明天可以办妥。',
                '好的，我会尽快处理。'
            ];
            chatData[key].push({
                from: 'staff',
                text: replies[Math.floor(Math.random() * replies.length)],
                time: new Date().toLocaleTimeString()
            });
            saveChatData(chatData);
            renderChatMessages(currentChatOrder);
        }, 1500);
    }

    if (chatSend) chatSend.addEventListener('click', sendChatMsg);
    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); sendChatMsg(); }
        });
    }

    /* ============================================================
     * 初始化渲染
     * ============================================================ */
    renderMyOrders();

    /* ============================================================
     * 业务员后台登录弹窗（跳过校验，直接登录跳转）
     * ============================================================ */
    var TEL_ADMIN_LOGIN_KEY = 'campus_telecom_admin_login';

    function handleOpenTelAdminLogin() {
        var overlay = document.getElementById('telAdminLoginOverlay');
        if (overlay) overlay.classList.add('active');
    }
    function closeTelAdminLogin() {
        var overlay = document.getElementById('telAdminLoginOverlay');
        if (overlay) overlay.classList.remove('active');
    }

    var telAdminEntryBtn = document.getElementById('telAdminEntryBtn');
    var telAdminLoginClose = document.getElementById('telAdminLoginClose');
    var telAdminLoginBtn = document.getElementById('telAdminLoginBtn');
    var telAdminLoginOverlay = document.getElementById('telAdminLoginOverlay');

    if (telAdminEntryBtn) {
        telAdminEntryBtn.addEventListener('click', handleOpenTelAdminLogin);
    }
    if (telAdminLoginClose) {
        telAdminLoginClose.addEventListener('click', closeTelAdminLogin);
    }
    if (telAdminLoginOverlay) {
        telAdminLoginOverlay.addEventListener('click', function(e) {
            if (e.target === telAdminLoginOverlay) closeTelAdminLogin();
        });
    }
    /* 一键登录：跳过账号密码校验，直接写入登录态后跳转业务员工单管理后台 */
    if (telAdminLoginBtn) {
        telAdminLoginBtn.addEventListener('click', function() {
            var accInput = document.getElementById('telAdminAccount');
            var account = accInput ? accInput.value.trim() : 'admin';
            try {
                localStorage.setItem(TEL_ADMIN_LOGIN_KEY, JSON.stringify({
                    account: account,
                    loginTime: new Date().toISOString()
                }));
            } catch(e) {}
            closeTelAdminLogin();
            showToast('登录成功，正在进入业务员工作台...');
            setTimeout(function() { window.location.href = 'telecom-admin.html'; }, 600);
        });
    }

});
