document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
     * 登录态校验（与 dining-admin-login.html 配合）
     * ============================================================ */
    try {
        if (localStorage.getItem('campus_dining_admin_logged') !== '1') {
            alert('请先完成管理员登录');
            window.location.href = 'dining-admin-login.html';
            return;
        }
    } catch(e) { /* localStorage 不可用时直接放行 */ }

    /* ============================================================
     * 数据存储（与餐饮学生端 dining.js 共用同一份 localStorage）
     * ============================================================ */
    var ORDERS_KEY = 'campus_dining_orders';
    var CHAT_KEY = 'campus_dining_chat';

    /* 菜单发布数据 key */
    var RECOMMEND_KEY = 'campus_dining_admin_recommend';
    var WINDOW_KEY = 'campus_dining_admin_window_menu';

    function _get(key, def) {
        try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
        catch(e) { return def; }
    }
    function _set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    }

    function getOrders() { return _get(ORDERS_KEY, []); }
    function saveOrders(list) { _set(ORDERS_KEY, list); }

    function getChatData() { return _get(CHAT_KEY, {}); }
    function saveChatData(data) { _set(CHAT_KEY, data); }

    var STAFF_NAME = '食堂管理员';
    var STAFF_ID = 'canteen_staff_001';

    /* 状态中文映射 */
    var STATUS_MAP = {
        'pending':    { text: '待接单', cls: 'da-status-pending' },
        'cooking':    { text: '制作中', cls: 'da-status-cooking' },
        'delivering': { text: '配送中', cls: 'da-status-delivering' },
        'delivered':  { text: '已送达', cls: 'da-status-delivered' },
        'cancelled':  { text: '已取消', cls: 'da-status-cancelled' }
    };

    /* ============================================================
     * Toast
     * ============================================================ */
    function showToast(msg) {
        var toast = document.getElementById('daToast');
        var msgEl = document.getElementById('daToastMsg');
        if (!toast) return;
        msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    /* ============================================================
     * Tab 切换
     * ============================================================ */
    var tabs = document.querySelectorAll('.da-tab');
    var contents = document.querySelectorAll('.da-tab-content');

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
        var pending     = orders.filter(function(o) { return o.status === 'pending'; }).length;
        var cooking     = orders.filter(function(o) { return o.status === 'cooking'; }).length;
        var delivering  = orders.filter(function(o) { return o.status === 'delivering'; }).length;
        var done        = orders.filter(function(o) { return o.status === 'delivered' || o.status === 'cancelled'; }).length;

        document.getElementById('statPending').textContent = pending;
        document.getElementById('statCooking').textContent = cooking;
        document.getElementById('statDelivering').textContent = delivering;
        document.getElementById('statDone').textContent = done;

        var badge = document.getElementById('pendingBadge');
        badge.textContent = pending;
        badge.setAttribute('data-count', pending);
        badge.style.display = pending > 0 ? 'inline-flex' : 'none';
    }

    /* ============================================================
     * 渲染订单列表
     * ============================================================ */
    function renderList(containerId, orders, statusText) {
        var container = document.getElementById(containerId);
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<div class="da-empty"><i class="fas fa-inbox"></i><p>暂无' + statusText + '的订单</p></div>';
            return;
        }

        /* 历史按创建时间倒序，进行中按正序（先做先出） */
        var sorted = orders.slice().sort(function(a, b) {
            if (containerId === 'historyList') {
                return b.id - a.id;
            }
            return a.id - b.id;
        });

        var html = '<div class="da-orders-grid">';
        sorted.forEach(function(order) {
            var statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
            var itemsStr = (order.items || []).map(function(it) {
                return '<div class="da-dish-row"><span>' + it.name + '</span><span class="da-dish-qty">x' + it.qty + '</span></div>';
            }).join('');
            var deliveryStr = order.deliveryType === 'dinein' ? '堂食' : ('配送至 ' + (order.address || ''));
            var canteenStr = order.canteen || '一食堂';
            var totalPrice = (order.totalPrice || 0).toFixed(2);

            html += '<div class="da-order-card">' +
                '<div class="da-order-header">' +
                    '<div class="da-order-type"><i class="fas fa-utensils"></i>' + canteenStr + '</div>' +
                    '<span class="da-status-tag ' + statusInfo.cls + '"><i class="fas fa-circle" style="font-size:8px"></i> ' + statusInfo.text + '</span>' +
                '</div>' +
                '<div class="da-order-id" style="margin-left:10px;margin-bottom:8px;">订单 #' + order.id + '</div>' +
                '<div class="da-order-items"><div class="da-order-items-list">' + itemsStr + '</div></div>' +
                '<div class="da-order-info">' +
                    '<div class="da-order-info-item"><i class="fas fa-truck"></i>' + deliveryStr + '</div>' +
                    '<div class="da-order-info-item"><i class="fas fa-clock"></i>' + (order.createTime || '') + '</div>' +
                    '<div class="da-order-info-item"><i class="fas fa-hourglass-half"></i>预计 ' + (order.estimatedTime || '15-20分钟') + '</div>' +
                    (order.acceptorName ? '<div class="da-order-info-item"><i class="fas fa-user-tie"></i>' + order.acceptorName + '</div>' : '') +
                '</div>' +
                '<span class="da-order-total">¥ ' + totalPrice + '</span>' +
                '<div class="da-order-actions">';

            /* 操作按钮 - 根据状态显示 */
            if (order.status === 'pending') {
                html += '<button class="da-btn-accept" data-id="' + order.id + '"><i class="fas fa-check"></i>一键接单</button>';
                html += '<button class="da-btn-detail" data-id="' + order.id + '"><i class="fas fa-eye"></i>详情</button>';
            } else if (order.status === 'cooking') {
                /* 堂食订单：制作完成直接送达；配送订单：进入配送 */
                if (order.deliveryType === 'dinein') {
                    html += '<button class="da-btn-finish" data-id="' + order.id + '" data-action="serve"><i class="fas fa-flag-checkered"></i>出餐送达</button>';
                } else {
                    html += '<button class="da-btn-deliver" data-id="' + order.id + '"><i class="fas fa-truck"></i>完成制作出餐</button>';
                }
                html += '<button class="da-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>沟通</button>';
                html += '<button class="da-btn-detail" data-id="' + order.id + '"><i class="fas fa-eye"></i>详情</button>';
            } else if (order.status === 'delivering') {
                html += '<button class="da-btn-finish" data-id="' + order.id + '" data-action="deliver"><i class="fas fa-flag-checkered"></i>送达完成</button>';
                html += '<button class="da-btn-chat" data-id="' + order.id + '"><i class="fas fa-comment-dots"></i>沟通</button>';
                html += '<button class="da-btn-detail" data-id="' + order.id + '"><i class="fas fa-eye"></i>详情</button>';
            } else {
                /* 已办结/已取消 - 仅详情 */
                html += '<button class="da-btn-detail" data-id="' + order.id + '"><i class="fas fa-eye"></i>详情</button>';
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

        renderList('pendingList',    orders.filter(function(o) { return o.status === 'pending'; }),    '待接单');
        renderList('cookingList',    orders.filter(function(o) { return o.status === 'cooking'; }),    '制作中');
        renderList('deliveringList', orders.filter(function(o) { return o.status === 'delivering'; }), '配送中');
        renderList('doneList',       orders.filter(function(o) { return o.status === 'delivered'; }),  '已办结');
        renderList('historyList',    orders, '全部历史');
    }

    /* ============================================================
     * 绑定按钮事件
     * ============================================================ */
    function bindActions(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        container.querySelectorAll('.da-btn-accept').forEach(function(btn) {
            btn.addEventListener('click', function() {
                acceptOrder(parseInt(this.getAttribute('data-id'), 10));
            });
        });

        container.querySelectorAll('.da-btn-deliver').forEach(function(btn) {
            btn.addEventListener('click', function() {
                deliverOrder(parseInt(this.getAttribute('data-id'), 10));
            });
        });

        container.querySelectorAll('.da-btn-finish').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var action = this.getAttribute('data-action');
                finishOrder(parseInt(this.getAttribute('data-id'), 10), action);
            });
        });

        container.querySelectorAll('.da-btn-chat').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = parseInt(this.getAttribute('data-id'), 10);
                var orders = getOrders();
                var order = orders.find(function(o) { return o.id === oid; });
                if (order) openChat(order);
            });
        });

        container.querySelectorAll('.da-btn-detail').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var oid = parseInt(this.getAttribute('data-id'), 10);
                var orders = getOrders();
                var order = orders.find(function(o) { return o.id === oid; });
                if (order) openDetail(order);
            });
        });
    }

    /* ============================================================
     * 订单操作
     * ============================================================ */
    function acceptOrder(oid) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === oid; });
        if (!order) return;
        order.status = 'cooking';
        order.statusText = '制作中';
        order.acceptor = STAFF_ID;
        order.acceptorName = STAFF_NAME;
        order.acceptTime = new Date().toLocaleString();
        saveOrders(orders);
        showToast('已接单：订单 #' + oid + '，开始制作');
        renderAll();
    }

    function deliverOrder(oid) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === oid; });
        if (!order) return;
        order.status = 'delivering';
        order.statusText = '配送中';
        order.deliverTime = new Date().toLocaleString();
        saveOrders(orders);
        showToast('订单 #' + oid + ' 已出餐，进入配送');
        renderAll();
    }

    function finishOrder(oid, action) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === oid; });
        if (!order) return;
        order.status = 'delivered';
        order.statusText = '已送达';
        order.doneTime = new Date().toLocaleString();
        saveOrders(orders);
        showToast('订单 #' + oid + ' 已办结' + (action === 'serve' ? '（堂食出餐）' : '（配送送达）'));
        renderAll();
    }

    /* ============================================================
     * 订单详情弹窗
     * ============================================================ */
    var detailModal = document.getElementById('detailModal');
    var detailClose = document.getElementById('detailClose');
    var detailBody = document.getElementById('detailBody');

    function openDetail(order) {
        var statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
        var itemsHtml = (order.items || []).map(function(it) {
            return '<div class="da-detail-dish-row"><span>' + it.name + '</span><span>¥' + (it.price || 0).toFixed(2) + ' x ' + it.qty + '</span></div>';
        }).join('');
        var deliveryStr = order.deliveryType === 'dinein' ? '堂食' : ('配送至 ' + (order.address || ''));

        detailBody.innerHTML =
            '<div class="da-detail-row"><span class="da-label">订单编号</span><span class="da-value">#' + order.id + '</span></div>' +
            '<div class="da-detail-row"><span class="da-label">所属食堂</span><span class="da-value">' + (order.canteen || '一食堂') + '</span></div>' +
            '<div class="da-detail-row"><span class="da-label">订单状态</span><span class="da-value"><span class="da-status-tag ' + statusInfo.cls + '">' + statusInfo.text + '</span></span></div>' +
            '<div class="da-detail-row"><span class="da-label">配送方式</span><span class="da-value">' + deliveryStr + '</span></div>' +
            '<div class="da-detail-row"><span class="da-label">下单时间</span><span class="da-value">' + (order.createTime || '') + '</span></div>' +
            (order.acceptTime ? '<div class="da-detail-row"><span class="da-label">接单时间</span><span class="da-value">' + order.acceptTime + '</span></div>' : '') +
            (order.deliverTime ? '<div class="da-detail-row"><span class="da-label">出餐时间</span><span class="da-value">' + order.deliverTime + '</span></div>' : '') +
            (order.doneTime ? '<div class="da-detail-row"><span class="da-label">办结时间</span><span class="da-value">' + order.doneTime + '</span></div>' : '') +
            (order.acceptorName ? '<div class="da-detail-row"><span class="da-label">接单业务员</span><span class="da-value">' + order.acceptorName + '</span></div>' : '') +
            '<div class="da-detail-row"><span class="da-label">预计耗时</span><span class="da-value">' + (order.estimatedTime || '15-20分钟') + '</span></div>' +
            '<div class="da-detail-dishes">' +
                '<div style="font-size:13px;color:#7c2d12;font-weight:700;margin-bottom:6px;"><i class="fas fa-utensils"></i> 菜品明细</div>' +
                itemsHtml +
            '</div>' +
            '<div class="da-detail-row"><span class="da-label">订单金额</span><span class="da-value" style="color:#dc2626;font-size:16px;">¥ ' + (order.totalPrice || 0).toFixed(2) + '</span></div>';

        detailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDetail() {
        detailModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (detailClose) detailClose.addEventListener('click', closeDetail);
    if (detailModal) {
        detailModal.addEventListener('click', function(e) {
            if (e.target === detailModal) closeDetail();
        });
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

    /* 聊天会话 key：与 telecom 不同，按订单 id 维度 */
    function chatSessionKey(order) {
        return 'dining_order_' + order.id;
    }

    function openChat(order) {
        currentChatOrder = order;
        /* 兼容旧字段 */
        if (!order.chatSessionKey) {
            order.chatSessionKey = chatSessionKey(order);
        }
        chatModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderChatMessages(order);
    }

    function closeChat() {
        chatModal.classList.remove('active');
        document.body.style.overflow = '';
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
            div.className = 'da-msg ' + (msg.from === 'staff' ? 'da-msg-self' : 'da-msg-other');
            div.innerHTML = msg.text + '<div class="da-msg-time">' + msg.time + '</div>';
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
                '请问大概什么时候能送到？',
                '收到，辛苦了！',
                '可以加辣吗？',
                '麻烦帮我打包，谢谢！',
                '好的，我在宿舍等。'
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
     * 新订单实时提醒（轮询 localStorage）
     * ============================================================ */
    var lastPendingCount = getOrders().filter(function(o) { return o.status === 'pending'; }).length;

    function checkNewOrders() {
        var orders = getOrders();
        var currentPending = orders.filter(function(o) { return o.status === 'pending'; }).length;

        if (currentPending > lastPendingCount) {
            showNewOrderAlert(currentPending);
        }
        lastPendingCount = currentPending;
        updateStats();

        /* 若当前停留在某个 tab，重新渲染当前列表，保持实时同步 */
        var activeTab = document.querySelector('.da-tab.active');
        if (activeTab) {
            var target = activeTab.getAttribute('data-tab');
            if (target === 'pending') renderList('pendingList', orders.filter(function(o) { return o.status === 'pending'; }), '待接单');
        }
    }

    function showNewOrderAlert(count) {
        var old = document.querySelector('.da-new-order-alert');
        if (old) old.remove();

        var alert = document.createElement('div');
        alert.className = 'da-new-order-alert';
        alert.innerHTML = '<i class="fas fa-bell"></i><div><strong>新订单提醒</strong><br>当前有 ' + count + ' 个待接单订单</div>';
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

    /* 每 3 秒轮询一次 */
    setInterval(checkNewOrders, 3000);

    /* ============================================================
     * 菜单发布模块：分楼层（一楼/二楼/三楼）
     *   - 每日推荐餐单（图片上传，base64 存储）
     *   - 今日窗口菜单（文字录入）
     * ============================================================ */
    var FLOOR_NAMES = { '1': '一楼', '2': '二楼', '3': '三楼' };
    var currentPublishFloor = '1';
    var currentPublishMeal = 'breakfast';
    var pendingRecImage = ''; /* base64 图片，待添加时使用 */

    /* 读取与保存 */
    function getRecommendData() { return _get(RECOMMEND_KEY, {}); }
    function saveRecommendData(d) { _set(RECOMMEND_KEY, d); }
    function getWindowData() { return _get(WINDOW_KEY, {}); }
    function saveWindowData(d) { _set(WINDOW_KEY, d); }

    /* 楼层切换 */
    document.querySelectorAll('.da-floor-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.da-floor-tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            currentPublishFloor = this.getAttribute('data-floor');
            pendingRecImage = '';
            renderPublishLists();
            resetPublishInputs();
            console.log('[菜单发布] 楼层切换 →', FLOOR_NAMES[currentPublishFloor]);
        });
    });

    /* 时段切换（仅作用于推荐餐单） */
    document.querySelectorAll('#recommendMealTabs .da-meal-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('#recommendMealTabs .da-meal-tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            currentPublishMeal = this.getAttribute('data-meal');
            renderRecommendPreview();
        });
    });

    /* 图片上传 → 转 base64 */
    var recImageFile = document.getElementById('recImageFile');
    var recImagePreview = document.getElementById('recImagePreview');
    var recImageClear = document.getElementById('recImageClear');

    if (recImagePreview) {
        recImagePreview.addEventListener('click', function() { recImageFile.click(); });
    }
    if (recImageFile) {
        recImageFile.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                showToast('图片不能超过 2MB');
                return;
            }
            var reader = new FileReader();
            reader.onload = function(ev) {
                pendingRecImage = ev.target.result;
                recImagePreview.innerHTML = '<img src="' + pendingRecImage + '" alt="预览图">';
                recImagePreview.classList.add('has-image');
                recImageClear.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        });
    }
    if (recImageClear) {
        recImageClear.addEventListener('click', function(e) {
            e.stopPropagation();
            pendingRecImage = '';
            recImageFile.value = '';
            recImagePreview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>点击上传图片</span>';
            recImagePreview.classList.remove('has-image');
            recImageClear.style.display = 'none';
        });
    }

    /* 添加推荐菜品 */
    var recAddBtn = document.getElementById('recAddBtn');
    if (recAddBtn) {
        recAddBtn.addEventListener('click', function() {
            var name = document.getElementById('recDishName').value.trim();
            var desc = document.getElementById('recDishDesc').value.trim();
            var price = parseFloat(document.getElementById('recDishPrice').value) || 0;
            if (!name) { showToast('请填写菜品名称'); return; }
            if (!pendingRecImage) { showToast('请上传菜品图片'); return; }

            var data = getRecommendData();
            if (!data[currentPublishFloor]) data[currentPublishFloor] = {};
            if (!data[currentPublishFloor][currentPublishMeal]) data[currentPublishFloor][currentPublishMeal] = [];

            data[currentPublishFloor][currentPublishMeal].push({
                name: name, desc: desc, price: price, img: pendingRecImage,
                uploadTime: new Date().toLocaleString()
            });
            saveRecommendData(data);

            /* 重置表单 */
            document.getElementById('recDishName').value = '';
            document.getElementById('recDishDesc').value = '';
            document.getElementById('recDishPrice').value = '';
            pendingRecImage = '';
            recImageFile.value = '';
            recImagePreview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>点击上传图片</span>';
            recImagePreview.classList.remove('has-image');
            recImageClear.style.display = 'none';

            renderRecommendPreview();
            showToast(FLOOR_NAMES[currentPublishFloor] + ' · ' + mealName(currentPublishMeal) + ' 推荐菜品已发布');
        });
    }

    /* 清空当前时段推荐 */
    var recClearAllBtn = document.getElementById('recClearAllBtn');
    if (recClearAllBtn) {
        recClearAllBtn.addEventListener('click', function() {
            if (!confirm('确认清空 ' + FLOOR_NAMES[currentPublishFloor] + ' ' + mealName(currentPublishMeal) + ' 的全部推荐菜品？')) return;
            var data = getRecommendData();
            if (data[currentPublishFloor]) data[currentPublishFloor][currentPublishMeal] = [];
            saveRecommendData(data);
            renderRecommendPreview();
            showToast('已清空当前时段推荐');
        });
    }

    /* 添加窗口菜单 */
    var winAddBtn = document.getElementById('winAddBtn');
    if (winAddBtn) {
        winAddBtn.addEventListener('click', function() {
            var name = document.getElementById('winName').value.trim();
            var dish = document.getElementById('winDish').value.trim();
            var desc = document.getElementById('winDesc').value.trim();
            if (!dish) { showToast('请填写主推菜品'); return; }
            if (!name) name = '窗口'; /* 自动补默认名 */

            var data = getWindowData();
            if (!data[currentPublishFloor]) data[currentPublishFloor] = [];
            data[currentPublishFloor].push({
                name: name, dish: dish, desc: desc,
                uploadTime: new Date().toLocaleString()
            });
            saveWindowData(data);

            document.getElementById('winName').value = '';
            document.getElementById('winDish').value = '';
            document.getElementById('winDesc').value = '';

            renderWindowPreview();
            showToast(FLOOR_NAMES[currentPublishFloor] + ' 窗口菜单已发布');
        });
    }

    /* 清空本楼全部窗口 */
    var winClearAllBtn = document.getElementById('winClearAllBtn');
    if (winClearAllBtn) {
        winClearAllBtn.addEventListener('click', function() {
            if (!confirm('确认清空 ' + FLOOR_NAMES[currentPublishFloor] + ' 的全部窗口菜单？')) return;
            var data = getWindowData();
            data[currentPublishFloor] = [];
            saveWindowData(data);
            renderWindowPreview();
            showToast('已清空本楼窗口菜单');
        });
    }

    /* 渲染推荐菜品预览列表 */
    function renderRecommendPreview() {
        var wrap = document.getElementById('recPreviewList');
        if (!wrap) return;
        var data = getRecommendData();
        var list = ((data[currentPublishFloor] || {})[currentPublishMeal]) || [];
        if (list.length === 0) {
            wrap.innerHTML = '<div class="da-publish-empty"><i class="fas fa-inbox"></i><span>暂无' + mealName(currentPublishMeal) + '推荐菜品</span></div>';
            return;
        }
        var html = '<div class="da-preview-grid">';
        list.forEach(function(item, idx) {
            html += '<div class="da-preview-card">' +
                '<div class="da-preview-img"><img src="' + item.img + '"></div>' +
                '<div class="da-preview-info">' +
                '<h4>' + item.name + '</h4>' +
                '<p>' + (item.desc || '—') + '</p>' +
                '<span class="da-preview-price">¥' + (item.price || 0).toFixed(2) + '</span>' +
                '</div>' +
                '<button class="da-preview-del" data-type="rec" data-idx="' + idx + '"><i class="fas fa-times"></i></button>' +
                '</div>';
        });
        html += '</div>';
        wrap.innerHTML = html;
        bindPreviewDel();
    }

    /* 渲染窗口菜单预览列表 */
    function renderWindowPreview() {
        var wrap = document.getElementById('winPreviewList');
        if (!wrap) return;
        var data = getWindowData();
        var list = data[currentPublishFloor] || [];
        if (list.length === 0) {
            wrap.innerHTML = '<div class="da-publish-empty"><i class="fas fa-inbox"></i><span>暂无窗口菜单</span></div>';
            return;
        }
        var html = '<div class="da-window-list">';
        list.forEach(function(item, idx) {
            html += '<div class="da-window-item">' +
                '<div class="da-window-no">' + (idx + 1) + '</div>' +
                '<div class="da-window-info">' +
                '<div class="da-window-name">' + item.name + '</div>' +
                '<div class="da-window-dish">' + item.dish + '</div>' +
                (item.desc ? '<div class="da-window-desc">' + item.desc + '</div>' : '') +
                '</div>' +
                '<button class="da-preview-del" data-type="win" data-idx="' + idx + '"><i class="fas fa-times"></i></button>' +
                '</div>';
        });
        html += '</div>';
        wrap.innerHTML = html;
        bindPreviewDel();
    }

    /* 渲染发布区两个列表 */
    function renderPublishLists() {
        renderRecommendPreview();
        renderWindowPreview();
    }

    /* 列表项删除 */
    function bindPreviewDel() {
        document.querySelectorAll('.da-preview-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var type = this.getAttribute('data-type');
                var idx = parseInt(this.getAttribute('data-idx'), 10);
                if (type === 'rec') {
                    var rData = getRecommendData();
                    var arr = (rData[currentPublishFloor] || {})[currentPublishMeal] || [];
                    arr.splice(idx, 1);
                    rData[currentPublishFloor][currentPublishMeal] = arr;
                    saveRecommendData(rData);
                    renderRecommendPreview();
                    showToast('已删除推荐菜品');
                } else {
                    var wData = getWindowData();
                    var arr2 = wData[currentPublishFloor] || [];
                    arr2.splice(idx, 1);
                    wData[currentPublishFloor] = arr2;
                    saveWindowData(wData);
                    renderWindowPreview();
                    showToast('已删除窗口菜单');
                }
            });
        });
    }

    /* 重置发布表单输入框 */
    function resetPublishInputs() {
        ['recDishName', 'recDishDesc', 'recDishPrice', 'winName', 'winDish', 'winDesc'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.value = '';
        });
        if (recImageFile) recImageFile.value = '';
        if (recImagePreview) {
            recImagePreview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>点击上传图片</span>';
            recImagePreview.classList.remove('has-image');
        }
        if (recImageClear) recImageClear.style.display = 'none';
        pendingRecImage = '';
    }

    function mealName(m) {
        return { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' }[m] || m;
    }

    /* 进入"菜单发布"Tab 时刷新一次预览 */
    document.querySelectorAll('.da-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            if (this.getAttribute('data-tab') === 'menu-publish') {
                renderPublishLists();
            }
        });
    });

    /* 初始化发布区 */
    renderPublishLists();

    /* ============================================================
     * 初始化
     * ============================================================ */
    renderAll();
    console.log('[餐饮后台] 工作台初始化完成');
});
