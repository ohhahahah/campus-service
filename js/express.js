(function() {
    /* ===== 轮播图逻辑 ===== */
    (function initCarousel() {
        var slides = document.querySelectorAll('.express-carousel-slide');
        var dots = document.querySelectorAll('.express-carousel-dot');
        var prevBtn = document.getElementById('expressCarouselPrev');
        var nextBtn = document.getElementById('expressCarouselNext');
        if (!slides.length) return;
        var current = 0;
        var total = slides.length;
        var timer = null;

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + total) % total;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startAuto() {
            stopAuto();
            timer = setInterval(next, 3000);
        }
        function stopAuto() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        if (prevBtn) prevBtn.addEventListener('click', function() { prev(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', function() { next(); startAuto(); });
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                goTo(parseInt(this.getAttribute('data-index')));
                startAuto();
            });
        });

        var carousel = document.querySelector('.express-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAuto);
            carousel.addEventListener('mouseleave', startAuto);
        }

        startAuto();
    })();

    /* ===== 快递服务原有逻辑 ===== */
    var CURRENT_USER = 'currentUser';
    var ORDERS_KEY = 'express_orders';
    var CHATS_KEY = 'express_chats_';

    function getCurrentUser() {
        var u = localStorage.getItem(CURRENT_USER);
        return u || '同学' + Math.floor(Math.random() * 9000 + 1000);
    }

    function setCurrentUser(name) {
        localStorage.setItem(CURRENT_USER, name);
    }

    function getOrders() {
        try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch(e) { return []; }
    }

    function saveOrders(list) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    }

    function getChatMessages(orderId) {
        try { return JSON.parse(localStorage.getItem(CHATS_KEY + orderId) || '[]'); } catch(e) { return []; }
    }

    function saveChatMessages(orderId, msgs) {
        localStorage.setItem(CHATS_KEY + orderId, JSON.stringify(msgs));
    }

    function genId() {
        return 'ORD' + Date.now() + Math.floor(Math.random() * 100);
    }

    function formatTime(date) {
        var d = date || new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }

    function showToast(msg) {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:12px 28px;border-radius:25px;font-size:14px;font-weight:600;z-index:10001;box-shadow:0 4px 15px rgba(59,130,246,0.4)';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 1800);
        setTimeout(function() { if (toast.parentNode) document.body.removeChild(toast); }, 2100);
    }

    var statusMap = {
        pending: '待接单',
        accepted: '已接单',
        picking: '取件中',
        delivered: '已送达',
        completed: '已完成',
        cancelled: '已取消'
    };

    var statusColors = {
        pending: '#f59e0b',
        accepted: '#3b82f6',
        picking: '#8b5cf6',
        delivered: '#06b6d4',
        completed: '#10b981',
        cancelled: '#ef4444'
    };

    var sizeIcons = {
        '小件': 'fa-box',
        '中件': 'fa-box-open',
        '大件': 'fa-dolly'
    };

    var currentUser = getCurrentUser();
    var myOrderTab = 'published';
    var hallSort = 'time';
    var activeChatOrderId = null;

    function initDemoOrders() {
        var orders = getOrders();
        if (orders.length > 0) return;
        var demo = [
            {
                id: 'DEMO001',
                publisher: '同学A',
                station: '南门驿站',
                pickupCode: '5-2-8134',
                packageSize: '小件',
                packageWeight: '轻',
                receiverName: '张同学 138****1234',
                receiverPhone: '',
                building: '3号宿舍楼',
                room: '',
                fee: 3,
                note: '下课后来取即可',
                status: 'pending',
                acceptor: '',
                time: '2024-12-20 10:30',
                feeHistory: []
            },
            {
                id: 'DEMO002',
                publisher: '同学B',
                station: '北门驿站',
                pickupCode: 'A-16-6291',
                packageSize: '中件',
                packageWeight: '一般',
                receiverName: '李同学 139****5678',
                receiverPhone: '',
                building: '1号宿舍楼',
                room: '',
                fee: 5,
                note: '易碎品，请小心',
                status: 'pending',
                acceptor: '',
                time: '2024-12-20 09:15',
                feeHistory: []
            },
            {
                id: 'DEMO003',
                publisher: '同学C',
                station: '一食堂旁驿站',
                pickupCode: 'SF2024122090',
                packageSize: '大件',
                packageWeight: '重',
                receiverName: '王同学 137****9012',
                receiverPhone: '',
                building: '2号宿舍楼',
                room: '',
                fee: 8,
                note: '大件物品，需要送到楼下',
                status: 'accepted',
                acceptor: '同学D',
                time: '2024-12-19 16:40',
                feeHistory: []
            }
        ];
        saveOrders(demo);
    }

    function renderHallOrders() {
        var container = document.getElementById('hallOrders');
        var orders = getOrders();
        var available = orders.filter(function(o) { return o.status === 'pending' && o.publisher !== currentUser; });

        if (hallSort === 'fee') {
            available.sort(function(a, b) { return b.fee - a.fee; });
        } else {
            available.sort(function(a, b) { return b.time.localeCompare(a.time); });
        }

        if (available.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>暂无可接订单</p></div>';
            return;
        }

        container.innerHTML = available.map(function(o) {
            return '<div class="express-order-card">' +
                '<div class="express-order-top">' +
                '<div class="express-order-route">' +
                '<div class="express-route-point"><i class="fas fa-store"></i><span>' + o.station + '</span></div>' +
                '<div class="express-route-arrow"><i class="fas fa-long-arrow-alt-right"></i></div>' +
                '<div class="express-route-point"><i class="fas fa-building"></i><span>' + o.building + ' ' + o.room + '</span></div>' +
                '</div>' +
                '<div class="express-order-fee">¥' + o.fee + '</div>' +
                '</div>' +
                '<div class="express-order-meta">' +
                '<span><i class="fas ' + (sizeIcons[o.packageSize] || 'fa-box') + '"></i> ' + o.packageSize + ' · ' + o.packageWeight + '</span>' +
                '<span><i class="fas fa-clock"></i> ' + o.time + '</span>' +
                '</div>' +
                (o.note ? '<div class="express-order-note"><i class="fas fa-sticky-note"></i> ' + o.note + '</div>' : '') +
                '<div class="express-order-actions">' +
                '<span class="express-order-publisher"><i class="fas fa-user"></i> ' + o.publisher + '</span>' +
                '<button class="express-accept-btn" data-id="' + o.id + '"><i class="fas fa-hand-pointer"></i> 接单</button>' +
                '</div></div>';
        }).join('');

        container.querySelectorAll('.express-accept-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                acceptOrder(this.getAttribute('data-id'));
            });
        });
    }

    function renderMyOrders() {
        var container = document.getElementById('myOrders');
        var orders = getOrders();
        var filtered;

        if (myOrderTab === 'published') {
            filtered = orders.filter(function(o) { return o.publisher === currentUser; });
        } else {
            filtered = orders.filter(function(o) { return o.acceptor === currentUser; });
        }

        filtered.sort(function(a, b) { return b.time.localeCompare(a.time); });

        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>' + (myOrderTab === 'published' ? '暂无发布的订单' : '暂无接的订单') + '</p></div>';
            return;
        }

        container.innerHTML = filtered.map(function(o) {
            var actions = '';
            var isPublisher = o.publisher === currentUser;
            var isAcceptor = o.acceptor === currentUser;

            if (o.status === 'pending' && isPublisher) {
                actions = '<button class="express-cancel-btn" data-id="' + o.id + '"><i class="fas fa-times"></i> 取消订单</button>';
            }

            if (o.status === 'accepted' || o.status === 'picking' || o.status === 'delivered') {
                actions += '<button class="express-chat-btn" data-id="' + o.id + '"><i class="fas fa-comments"></i> 对话</button>';
            }

            if (o.status === 'accepted' && isAcceptor) {
                actions += '<button class="express-status-btn" data-id="' + o.id + '" data-action="picking"><i class="fas fa-walking"></i> 开始取件</button>';
            }

            if (o.status === 'picking' && isAcceptor) {
                actions += '<button class="express-status-btn" data-id="' + o.id + '" data-action="delivered"><i class="fas fa-check-circle"></i> 已送达</button>';
            }

            if (o.status === 'delivered' && isPublisher) {
                actions += '<button class="express-status-btn express-confirm-btn" data-id="' + o.id + '" data-action="completed"><i class="fas fa-check-double"></i> 确认完成</button>';
            }

            if ((o.status === 'accepted' || o.status === 'picking') && (isPublisher || isAcceptor)) {
                actions += '<button class="express-cancel-btn" data-id="' + o.id + '"><i class="fas fa-times"></i> 取消</button>';
            }

            var feeDisplay = '¥' + o.fee;
            if (o.feeHistory && o.feeHistory.length > 0) {
                var lastChange = o.feeHistory[o.feeHistory.length - 1];
                feeDisplay = '¥' + o.fee + ' <span class="fee-changed">已改价</span>';
            }

            return '<div class="express-order-card">' +
                '<div class="express-order-top">' +
                '<div class="express-order-route">' +
                '<div class="express-route-point"><i class="fas fa-store"></i><span>' + o.station + '</span></div>' +
                '<div class="express-route-arrow"><i class="fas fa-long-arrow-alt-right"></i></div>' +
                '<div class="express-route-point"><i class="fas fa-building"></i><span>' + o.building + ' ' + o.room + '</span></div>' +
                '</div>' +
                '<div class="express-order-fee">' + feeDisplay + '</div>' +
                '</div>' +
                '<div class="express-order-meta">' +
                '<span><i class="fas ' + (sizeIcons[o.packageSize] || 'fa-box') + '"></i> ' + o.packageSize + ' · ' + o.packageWeight + '</span>' +
                '<span><i class="fas fa-clock"></i> ' + o.time + '</span>' +
                '</div>' +
                (o.note ? '<div class="express-order-note"><i class="fas fa-sticky-note"></i> ' + o.note + '</div>' : '') +
                '<div class="express-order-actions">' +
                '<span class="express-order-status" style="color:' + statusColors[o.status] + '">' +
                '<i class="fas fa-circle" style="font-size:8px;vertical-align:middle;margin-right:4px"></i>' + statusMap[o.status] + '</span>' +
                actions +
                '</div></div>';
        }).join('');

        container.querySelectorAll('.express-accept-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                acceptOrder(this.getAttribute('data-id'));
            });
        });

        container.querySelectorAll('.express-cancel-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                cancelOrder(this.getAttribute('data-id'));
            });
        });

        container.querySelectorAll('.express-chat-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                openChat(this.getAttribute('data-id'));
            });
        });

        container.querySelectorAll('.express-status-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                updateOrderStatus(this.getAttribute('data-id'), this.getAttribute('data-action'));
            });
        });
    }

    function publishOrder(formData) {
        var orders = getOrders();
        var order = {
            id: genId(),
            publisher: currentUser,
            station: formData.station,
            pickupCode: formData.pickupCode,
            packageSize: formData.packageSize,
            packageWeight: formData.packageWeight,
            receiverName: formData.receiverName,
            receiverPhone: formData.receiverPhone,
            building: formData.building,
            room: formData.room,
            fee: parseFloat(formData.fee),
            note: formData.note,
            status: 'pending',
            acceptor: '',
            time: formatTime(),
            feeHistory: []
        };
        orders.unshift(order);
        saveOrders(orders);
        renderHallOrders();
        renderMyOrders();
        updateMyOrderStats();
        alert('订单发布成功！');
    }

    function acceptOrder(orderId) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === orderId; });
        if (!order || order.status !== 'pending') {
            showToast('该订单已被接单');
            return;
        }
        if (order.publisher === currentUser) {
            showToast('不能接自己发布的订单');
            return;
        }
        order.status = 'accepted';
        order.acceptor = currentUser;
        saveOrders(orders);

        var msgs = getChatMessages(orderId);
        msgs.push({
            sender: 'system',
            content: '接单成功！' + currentUser + ' 已接单，双方可在此沟通取件细节',
            time: formatTime()
        });
        saveChatMessages(orderId, msgs);

        renderHallOrders();
        renderMyOrders();
        updateMyOrderStats();
        showToast('接单成功！已建立对话窗口');
    }

    function cancelOrder(orderId) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === orderId; });
        if (!order) return;

        if (order.status === 'accepted' || order.status === 'picking') {
            var reason = prompt('请输入取消原因（将通知对方）：');
            if (!reason) return;
            order.status = 'cancelled';
            var msgs = getChatMessages(orderId);
            msgs.push({
                sender: 'system',
                content: currentUser + ' 取消了订单，原因：' + reason,
                time: formatTime()
            });
            saveChatMessages(orderId, msgs);
        } else if (order.status === 'pending') {
            order.status = 'cancelled';
        } else {
            showToast('当前状态无法取消');
            return;
        }

        saveOrders(orders);
        renderHallOrders();
        renderMyOrders();
        updateMyOrderStats();
        showToast('订单已取消');
    }

    function updateOrderStatus(orderId, newStatus) {
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === orderId; });
        if (!order) return;

        order.status = newStatus;
        saveOrders(orders);

        var msgs = getChatMessages(orderId);
        msgs.push({
            sender: 'system',
            content: '订单状态更新为：' + statusMap[newStatus],
            time: formatTime()
        });
        saveChatMessages(orderId, msgs);

        if (newStatus === 'completed') {
            showToast('订单已完成！感谢使用');
        } else {
            showToast('状态已更新为：' + statusMap[newStatus]);
        }

        renderHallOrders();
        renderMyOrders();
        updateMyOrderStats();
    }

    function openChat(orderId) {
        activeChatOrderId = orderId;
        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === orderId; });
        if (!order) return;

        document.getElementById('chatTitle').textContent = '订单对话 · ' + order.station + ' → ' + order.building + ' ' + order.room;
        document.getElementById('chatFeeEdit').style.display = '';
        document.getElementById('chatFeeInput').value = order.fee;

        renderChatMessages();
        document.getElementById('chatModal').classList.add('active');
    }

    function closeChat() {
        document.getElementById('chatModal').classList.remove('active');
        activeChatOrderId = null;
    }

    function renderChatMessages() {
        if (!activeChatOrderId) return;
        var msgs = getChatMessages(activeChatOrderId);
        var container = document.getElementById('chatMessages');

        if (msgs.length === 0) {
            container.innerHTML = '<div class="chat-empty">暂无消息，发送第一条消息吧</div>';
            return;
        }

        container.innerHTML = msgs.map(function(m) {
            if (m.sender === 'system') {
                return '<div class="chat-msg-system"><span>' + m.content + '</span></div>';
            }
            var isMe = m.sender === currentUser;
            return '<div class="chat-msg ' + (isMe ? 'chat-msg-me' : 'chat-msg-other') + '">' +
                '<div class="chat-msg-sender">' + m.sender + '</div>' +
                '<div class="chat-msg-bubble">' + m.content + '</div>' +
                '<div class="chat-msg-time">' + m.time + '</div>' +
                '</div>';
        }).join('');

        container.scrollTop = container.scrollHeight;
    }

    function sendChatMessage() {
        if (!activeChatOrderId) return;
        var input = document.getElementById('chatInput');
        var text = input.value.trim();
        if (!text) return;

        var msgs = getChatMessages(activeChatOrderId);
        msgs.push({
            sender: currentUser,
            content: text,
            time: formatTime()
        });
        saveChatMessages(activeChatOrderId, msgs);
        input.value = '';
        renderChatMessages();
    }

    function modifyFee() {
        if (!activeChatOrderId) return;
        var newFee = parseFloat(document.getElementById('chatFeeInput').value);
        if (isNaN(newFee) || newFee < 1) {
            showToast('请输入有效费用');
            return;
        }

        var orders = getOrders();
        var order = orders.find(function(o) { return o.id === activeChatOrderId; });
        if (!order) return;

        var oldFee = order.fee;
        order.fee = newFee;
        if (!order.feeHistory) order.feeHistory = [];
        order.feeHistory.push({ from: oldFee, to: newFee, by: currentUser, time: formatTime() });
        saveOrders(orders);

        var msgs = getChatMessages(activeChatOrderId);
        msgs.push({
            sender: 'system',
            content: currentUser + ' 修改了费用：¥' + oldFee + ' → ¥' + newFee,
            time: formatTime()
        });
        saveChatMessages(activeChatOrderId, msgs);

        renderChatMessages();
        renderMyOrders();
        renderHallOrders();
        showToast('费用已修改为 ¥' + newFee);
    }

    function ensureUser() {
        var name = localStorage.getItem(CURRENT_USER);
        if (!name) {
            name = prompt('请输入你的昵称（用于发单和接单）：');
            if (!name) name = '同学' + Math.floor(Math.random() * 9000 + 1000);
            setCurrentUser(name);
            currentUser = name;
        }
    }

    function updateMyOrderStats() {
        var orders = getOrders();
        var published = orders.filter(function(o) { return o.publisher === currentUser; }).length;
        var accepted = orders.filter(function(o) { return o.acceptor === currentUser; }).length;
        var pending = orders.filter(function(o) { return o.publisher === currentUser && o.status === 'pending'; }).length;
        var el1 = document.getElementById('myPublishedCount');
        var el2 = document.getElementById('myAcceptedCount');
        var el3 = document.getElementById('myPendingCount');
        if (el1) el1.textContent = published;
        if (el2) el2.textContent = accepted;
        if (el3) el3.textContent = pending;
    }

    document.addEventListener('DOMContentLoaded', function() {
        ensureUser();
        initDemoOrders();
        renderHallOrders();
        renderMyOrders();
        updateMyOrderStats();

        document.getElementById('publishForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var station = document.getElementById('stationName').value;
            var pickupCode = document.getElementById('pickupCode').value.trim();
            var packageSize = document.getElementById('packageSize').value;
            var packageWeight = document.getElementById('packageWeight').value;
            var building = document.getElementById('deliveryBuilding').value;
            var receiverInfo = document.getElementById('receiverInfo').value.trim();
            var fee = document.getElementById('orderFee').value;
            var note = document.getElementById('orderNote').value.trim();
            var deadline = document.getElementById('pickupDeadline').value;

            if (!station || !pickupCode || !building || !receiverInfo || !fee) {
                showToast('请填写完整的订单信息');
                return;
            }

            publishOrder({
                station: station,
                pickupCode: pickupCode,
                packageSize: packageSize,
                packageWeight: packageWeight,
                receiverName: receiverInfo,
                receiverPhone: '',
                building: building,
                room: '',
                fee: fee,
                note: note,
                deadline: deadline
            });

            this.reset();
            document.getElementById('orderFee').value = '3';
        });

        /* 重置表单按钮 */
        document.getElementById('resetFormBtn').addEventListener('click', function() {
            document.getElementById('publishForm').reset();
            document.getElementById('orderFee').value = '3';
            showToast('表单已重置');
        });

        document.getElementById('hallSort').addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                this.querySelectorAll('.tab-btn').forEach(function(t) { t.classList.remove('active'); });
                e.target.classList.add('active');
                hallSort = e.target.getAttribute('data-sort');
                renderHallOrders();
            }
        });

        document.getElementById('myOrderTabs').addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                this.querySelectorAll('.tab-btn').forEach(function(t) { t.classList.remove('active'); });
                e.target.classList.add('active');
                myOrderTab = e.target.getAttribute('data-tab');
                renderMyOrders();
            }
        });

        document.getElementById('chatCloseBtn').addEventListener('click', closeChat);

        document.getElementById('chatModal').addEventListener('click', function(e) {
            if (e.target === this) closeChat();
        });

        document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);

        document.getElementById('chatInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') sendChatMessage();
        });

        document.getElementById('chatFeeBtn').addEventListener('click', modifyFee);
    });
})();
