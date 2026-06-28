document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
     * 数据存储
     * ============================================================ */
    var ORDER_KEY = 'campus_clinic_orders';
    var CHAT_KEY = 'campus_clinic_chat';
    var CONSULT_KEY = 'campus_clinic_consult';

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
    function getConsultData() { return _get(CONSULT_KEY, {}); }
    function saveConsultData(data) { _set(CONSULT_KEY, data); }

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    /* ============================================================
     * Toast
     * ============================================================ */
    function showToast(msg) {
        var toast = document.getElementById('cliToast');
        var msgEl = document.getElementById('cliToastMsg');
        if (!toast) return;
        msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    /* ============================================================
     * 统计动画
     * ============================================================ */
    document.querySelectorAll('.cli-stat-num').forEach(function(el) {
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
    var tabs = document.querySelectorAll('.cli-tab');
    var contents = document.querySelectorAll('.cli-tab-content');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contents.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(this.getAttribute('data-tab')).classList.add('active');
            if (this.getAttribute('data-tab') === 'myorders') renderMyOrders();
        });
    });

    /* ============================================================
     * 在线问诊 - 校医列表
     * ============================================================ */
    var doctors = [
        { id: 'doc1', name: '医生', title: '全科医生', avatar: '医' }
    ];

    var selectedDoctor = null;
    var doctorsList = document.getElementById('doctorsList');

    function renderDoctors() {
        doctorsList.innerHTML = '';
        doctors.forEach(function(doc) {
            var card = document.createElement('div');
            card.className = 'cli-doctor-card';
            card.innerHTML =
                '<div class="cli-doctor-avatar">' + doc.avatar + '</div>' +
                '<div class="cli-doctor-info"><strong>' + doc.name + '</strong><span>' + doc.title + '</span></div>' +
                '<div class="cli-doctor-status"></div>';
            card.addEventListener('click', function() {
                document.querySelectorAll('.cli-doctor-card').forEach(function(c) { c.classList.remove('selected'); });
                card.classList.add('selected');
                selectedDoctor = doc;
                openConsultChat(doc);
            });
            doctorsList.appendChild(card);
        });
    }

    renderDoctors();

    /* ============================================================
     * 在线问诊 - 聊天
     * ============================================================ */
    var chatPlaceholder = document.getElementById('chatPlaceholder');
    var chatBox = document.getElementById('chatBox');
    var chatMessages = document.getElementById('chatMessages');
    var chatInput = document.getElementById('chatInput');
    var chatSend = document.getElementById('chatSend');
    var chatDoctorName = document.getElementById('chatDoctorName');
    var currentConsultDoctor = null;

    function openConsultChat(doc) {
        currentConsultDoctor = doc;
        chatPlaceholder.style.display = 'none';
        chatBox.style.display = 'flex';
        chatDoctorName.innerHTML = '<i class="fas fa-user-md"></i> ' + doc.name + ' · ' + doc.title;
        renderConsultMessages(doc);
    }

    function renderConsultMessages(doc) {
        var consultData = getConsultData();
        var key = 'consult_' + doc.id;
        var session = consultData[key] || [];
        chatMessages.innerHTML = '';

        if (session.length === 0) {
            session.push({
                from: 'doctor',
                text: '您好，我是' + doc.name + '，请问您哪里不舒服？',
                time: new Date().toLocaleTimeString()
            });
            consultData[key] = session;
            saveConsultData(consultData);
        }

        session.forEach(function(msg) {
            var div = document.createElement('div');
            div.className = 'cli-msg ' + (msg.from === 'student' ? 'cli-msg-self' : 'cli-msg-other');
            div.innerHTML = msg.text + '<div class="cli-msg-time">' + msg.time + '</div>';
            chatMessages.appendChild(div);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendConsultMsg() {
        if (!currentConsultDoctor) return;
        var text = chatInput.value.trim();
        if (!text) return;

        var consultData = getConsultData();
        var key = 'consult_' + currentConsultDoctor.id;
        if (!consultData[key]) consultData[key] = [];

        consultData[key].push({ from: 'student', text: text, time: new Date().toLocaleTimeString() });
        saveConsultData(consultData);
        chatInput.value = '';
        renderConsultMessages(currentConsultDoctor);
    }

    if (chatSend) chatSend.addEventListener('click', sendConsultMsg);
    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); sendConsultMsg(); }
        });
    }

    /* ============================================================
     * 文件上传
     * ============================================================ */
    var uploadArea = document.getElementById('uploadArea');
    var fileInput = document.getElementById('cliPhoto');
    var placeholder = document.getElementById('uploadPlaceholder');
    var preview = document.getElementById('uploadPreview');
    var previewImg = document.getElementById('previewImg');
    var removeBtn = document.getElementById('removeImg');
    var uploadedFileData = '';

    if (uploadArea) {
        uploadArea.addEventListener('click', function(e) {
            if (e.target.closest('.cli-upload-remove')) return;
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            var file = this.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { showToast('文件大小不能超过5MB'); return; }
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
     * 提交求助工单
     * ============================================================ */
    var form = document.getElementById('clinicForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var dorm = document.getElementById('cliDorm').value.trim();
            var symptom = document.getElementById('cliSymptom').value.trim();
            var medicine = document.getElementById('cliMedicine').value.trim();
            var delivery = document.getElementById('cliDelivery').checked;
            var name = document.getElementById('cliName').value.trim();
            var phone = document.getElementById('cliPhone').value.trim();

            if (!dorm || !symptom || !name || !phone) {
                showToast('请填写完整信息');
                return;
            }

            var user = getCurrentUser();
            var orders = getOrders();

            var order = {
                id: 'CLI' + Date.now(),
                dorm: dorm,
                symptom: symptom,
                medicine: medicine || '无',
                needDelivery: delivery,
                photo: uploadedFileData ? 'uploaded' : '',
                name: name,
                phone: phone,
                status: '待接单',
                userId: user ? user.stuId : 'guest',
                userName: user ? user.name : name,
                acceptor: '',
                acceptorName: '',
                handleType: '',
                createTime: new Date().toLocaleString(),
                acceptTime: '',
                doneTime: '',
                chatSessionKey: 'cli_' + Date.now()
            };

            orders.unshift(order);
            saveOrders(orders);

            showToast('求助工单提交成功，等待校医接单');
            form.reset();
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
     * 我的工单
     * ============================================================ */
    function renderMyOrders() {
        var container = document.getElementById('myOrdersList');
        if (!container) return;

        var user = getCurrentUser();
        var orders = getOrders();
        if (user) orders = orders.filter(function(o) { return o.userId === user.stuId; });

        if (orders.length === 0) {
            container.innerHTML = '<div class="cli-empty-state"><i class="fas fa-inbox"></i><p>暂无工单记录</p></div>';
            return;
        }

        container.innerHTML = '';
        orders.forEach(function(order) {
            var statusClass = '';
            if (order.status === '待接单') statusClass = 'cli-status-pending';
            else if (order.status === '已接单') statusClass = 'cli-status-accepted';
            else if (order.status === '办理中') statusClass = 'cli-status-processing';
            else if (order.status === '已办结') statusClass = 'cli-status-done';

            var canChat = (order.status === '已接单' || order.status === '办理中') && order.acceptor;

            var card = document.createElement('div');
            card.className = 'cli-order-card';
            card.innerHTML =
                '<div class="cli-order-header">' +
                    '<div class="cli-order-type"><i class="fas fa-plus-circle"></i>求助工单</div>' +
                    '<span class="cli-order-status ' + statusClass + '">' + order.status + '</span>' +
                '</div>' +
                '<div class="cli-order-info">' +
                    '<div class="cli-order-info-item"><i class="fas fa-building"></i>' + order.dorm + '</div>' +
                    '<div class="cli-order-info-item"><i class="fas fa-user"></i>' + order.name + '</div>' +
                    '<div class="cli-order-info-item"><i class="fas fa-mobile-alt"></i>' + order.phone + '</div>' +
                '</div>' +
                '<div class="cli-order-desc">' +
                    '<strong>症状：</strong>' + order.symptom +
                    (order.medicine !== '无' ? ' <span class="cli-order-badge cli-badge-medicine"><i class="fas fa-pills"></i>需药：' + order.medicine + '</span>' : '') +
                    (order.needDelivery ? ' <span class="cli-order-badge cli-badge-delivery"><i class="fas fa-truck"></i>送药上门</span>' : '') +
                '</div>' +
                '<div class="cli-order-actions">' +
                    (canChat ? '<button class="cli-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>与校医沟通</button>' : '') +
                    '<button class="cli-btn-detail" data-id="' + order.id + '"><i class="fas fa-info-circle"></i>详情</button>' +
                '</div>';

            container.appendChild(card);
        });

        container.querySelectorAll('.cli-btn-chat').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                var order = getOrders().find(function(o) { return o.id === oid; });
                if (order) openOrderChat(order);
            });
        });

        container.querySelectorAll('.cli-btn-detail').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = this.getAttribute('data-id');
                var order = getOrders().find(function(o) { return o.id === oid; });
                if (order) showOrderDetail(order);
            });
        });
    }

    function showOrderDetail(order) {
        var info = '宿舍地址：' + order.dorm +
                   '\n身体症状：' + order.symptom +
                   '\n需要药品：' + order.medicine +
                   '\n送药上门：' + (order.needDelivery ? '是' : '否') +
                   '\n姓名：' + order.name +
                   '\n手机号：' + order.phone +
                   '\n状态：' + order.status +
                   '\n提交时间：' + order.createTime;
        if (order.acceptorName) info += '\n校医：' + order.acceptorName;
        if (order.doneTime) info += '\n办结时间：' + order.doneTime;
        alert(info);
    }

    /* ============================================================
     * 工单聊天弹窗
     * ============================================================ */
    var orderChatModal = document.getElementById('orderChatModal');
    var orderChatClose = document.getElementById('orderChatClose');
    var orderChatMessages = document.getElementById('orderChatMessages');
    var orderChatInput = document.getElementById('orderChatInput');
    var orderChatSend = document.getElementById('orderChatSend');
    var currentChatOrder = null;

    function openOrderChat(order) {
        currentChatOrder = order;
        orderChatModal.classList.add('active');
        renderOrderChatMessages(order);
    }

    function closeOrderChat() {
        orderChatModal.classList.remove('active');
        currentChatOrder = null;
    }

    if (orderChatClose) orderChatClose.addEventListener('click', closeOrderChat);
    if (orderChatModal) {
        orderChatModal.addEventListener('click', function(e) {
            if (e.target === orderChatModal) closeOrderChat();
        });
    }

    function renderOrderChatMessages(order) {
        var chatData = getChatData();
        var session = chatData[order.chatSessionKey] || [];
        orderChatMessages.innerHTML = '';

        if (session.length === 0) {
            session.push({ from: 'doctor', text: '您好，我已接单，请问具体症状是什么？', time: new Date().toLocaleTimeString() });
            chatData[order.chatSessionKey] = session;
            saveChatData(chatData);
        }

        session.forEach(function(msg) {
            var div = document.createElement('div');
            div.className = 'cli-msg ' + (msg.from === 'student' ? 'cli-msg-self' : 'cli-msg-other');
            div.innerHTML = msg.text + '<div class="cli-msg-time">' + msg.time + '</div>';
            orderChatMessages.appendChild(div);
        });
        orderChatMessages.scrollTop = orderChatMessages.scrollHeight;
    }

    function sendOrderChat() {
        if (!currentChatOrder) return;
        var text = orderChatInput.value.trim();
        if (!text) return;

        var chatData = getChatData();
        var key = currentChatOrder.chatSessionKey;
        if (!chatData[key]) chatData[key] = [];

        chatData[key].push({ from: 'student', text: text, time: new Date().toLocaleTimeString() });
        saveChatData(chatData);
        orderChatInput.value = '';
        renderOrderChatMessages(currentChatOrder);
    }

    if (orderChatSend) orderChatSend.addEventListener('click', sendOrderChat);
    if (orderChatInput) {
        orderChatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); sendOrderChat(); }
        });
    }

    /* ============================================================
     * 初始化
     * ============================================================ */
    renderMyOrders();

    /* ============================================================
     * 校医后台登录弹窗
     * ============================================================ */
    var DOCTOR_ACCOUNT = 'school_doc';
    var DOCTOR_PASSWORD = '123456';
    var DOCTOR_LOGIN_KEY = 'campus_clinic_doctor_login';

    function handleOpenLoginModal() {
        var overlay = document.getElementById('cliAdminLoginOverlay');
        if (overlay) overlay.classList.add('active');
    }
    function closeAdminLogin() {
        var overlay = document.getElementById('cliAdminLoginOverlay');
        if (overlay) overlay.classList.remove('active');
    }

    var adminEntryBtn = document.getElementById('clinicAdminEntryBtn');
    var adminLoginClose = document.getElementById('cliAdminLoginClose');
    var adminLoginBtn = document.getElementById('cliAdminLoginBtn');
    var adminLoginOverlay = document.getElementById('cliAdminLoginOverlay');

    if (adminEntryBtn) {
        adminEntryBtn.addEventListener('click', handleOpenLoginModal);
    }
    if (adminLoginClose) {
        adminLoginClose.addEventListener('click', closeAdminLogin);
    }
    if (adminLoginOverlay) {
        adminLoginOverlay.addEventListener('click', function(e) {
            if (e.target === adminLoginOverlay) closeAdminLogin();
        });
    }
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', function() {
            var accInput = document.getElementById('cliAdminAccount');
            var pwdInput = document.getElementById('cliAdminPassword');
            var account = accInput ? accInput.value.trim() : '';
            var password = pwdInput ? pwdInput.value.trim() : '';
            if (!account || !password) {
                showToast('请输入账号和密码');
                return;
            }
            if (account === DOCTOR_ACCOUNT && password === DOCTOR_PASSWORD) {
                try {
                    localStorage.setItem(DOCTOR_LOGIN_KEY, JSON.stringify({
                        account: account,
                        loginTime: new Date().toISOString()
                    }));
                } catch(e) {}
                closeAdminLogin();
                showToast('登录成功，正在进入校医工作台...');
                setTimeout(function() { window.location.href = 'clinic-admin.html'; }, 600);
            } else {
                showToast('账号或密码错误');
            }
        });
    }

});
