(function() {
    'use strict';

    /* ========== 工具函数 ========== */
    function getCurrentUser() {
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function getChatData() {
        if (window.CampusDB) return CampusDB.getChat();
        try { return JSON.parse(localStorage.getItem('campus_chat') || '{}'); } catch(e) { return {}; }
    }

    function saveChatData(data) {
        if (window.CampusDB) return CampusDB.saveChat(data);
        localStorage.setItem('campus_chat', JSON.stringify(data));
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showToast(msg) {
        var toast = document.getElementById('chatToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    function getChatSessionKey(productId, stuId1, stuId2) {
        var ids = [String(stuId1), String(stuId2)].sort();
        return productId + '_' + ids[0] + '_' + ids[1];
    }

    function formatTime(timeStr) {
        if (!timeStr) return '';
        return timeStr;
    }

    /* ========== URL 参数解析 ========== */
    var urlParams = new URLSearchParams(window.location.search);
    var targetUser = urlParams.get('to') || '';
    var productId = urlParams.get('productId') || '';
    var productName = urlParams.get('productName') || '';

    var user = getCurrentUser();
    if (!user || user.role !== 'student') {
        document.querySelector('.chat-container').innerHTML =
            '<div class="chat-empty-state" style="flex:1"><i class="fas fa-lock" style="font-size:48px;opacity:0.3"></i><p>请先登录后查看私信</p><a href="login.html" style="display:inline-block;padding:10px 24px;border-radius:8px;background:var(--primary-light);color:#fff;text-decoration:none;font-size:14px;margin-top:12px">去登录</a></div>';
        return;
    }

    /* ========== 会话列表 ========== */
    var sessionListEl = document.getElementById('sessionList');
    var chatMainEl = document.getElementById('chatMain');
    var currentSessionKey = '';

    function getAllSessions() {
        var chatData = getChatData();
        var sessions = [];
        var myId = user.stuId || user.name;

        Object.keys(chatData).forEach(function(key) {
            var messages = chatData[key];
            if (!messages || messages.length === 0) return;

            /* 解析 sessionKey: productId_stuId1_stuId2 */
            var parts = key.split('_');
            if (parts.length < 3) return;

            var sProductId = parts[0];
            var sStuId1 = parts[1];
            var sStuId2 = parts[2];

            /* 判断当前用户是否参与此会话 */
            if (String(myId) !== String(sStuId1) && String(myId) !== String(sStuId2)) return;

            var otherStuId = String(myId) === String(sStuId1) ? sStuId2 : sStuId1;
            var lastMsg = messages[messages.length - 1];

            /* 统计未读数 */
            var unreadCount = 0;
            messages.forEach(function(m) {
                if (m.sender !== myId && m.sender !== user.name && m.status !== 'read') {
                    unreadCount++;
                }
            });

            sessions.push({
                key: key,
                productId: sProductId,
                otherStuId: otherStuId,
                otherName: lastMsg.sender === myId || lastMsg.sender === user.name
                    ? (lastMsg.receiver || otherStuId)
                    : lastMsg.sender,
                lastMessage: lastMsg.text,
                lastTime: lastMsg.time || '',
                unreadCount: unreadCount,
                messages: messages
            });
        });

        /* 按最后消息时间排序 */
        sessions.sort(function(a, b) { return b.key > a.key ? 1 : -1; });
        return sessions;
    }

    function renderSessionList() {
        var sessions = getAllSessions();
        sessionListEl.innerHTML = '';

        if (sessions.length === 0) {
            sessionListEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-secondary)"><i class="fas fa-inbox" style="font-size:32px;opacity:0.3;display:block;margin-bottom:10px"></i><p>暂无私信会话</p></div>';
            return;
        }

        sessions.forEach(function(s) {
            var item = document.createElement('div');
            item.className = 'chat-session-item' + (s.key === currentSessionKey ? ' active' : '');
            item.dataset.key = s.key;

            var avatarLetter = s.otherName ? s.otherName.charAt(0) : '?';
            var preview = s.lastMessage ? (s.lastMessage.length > 20 ? s.lastMessage.substring(0, 20) + '...' : s.lastMessage) : '';
            var timeShort = s.lastTime ? s.lastTime.split(' ')[1] || s.lastTime : '';

            item.innerHTML =
                '<div class="chat-session-avatar">' + escapeHtml(avatarLetter) + '</div>' +
                '<div class="chat-session-info">' +
                    '<div class="chat-session-top">' +
                        '<span class="chat-session-name">' + escapeHtml(s.otherName || s.otherStuId) + '</span>' +
                        '<span class="chat-session-time">' + escapeHtml(timeShort) + '</span>' +
                    '</div>' +
                    '<div class="chat-session-preview">' + escapeHtml(preview) + '</div>' +
                    (s.productId ? '<div class="chat-session-product"><i class="fas fa-tag"></i> 商品ID: ' + escapeHtml(s.productId) + '</div>' : '') +
                '</div>' +
                (s.unreadCount > 0 ? '<span class="chat-session-badge">' + s.unreadCount + '</span>' : '');

            item.addEventListener('click', function() {
                openSession(s.key);
            });

            sessionListEl.appendChild(item);
        });
    }

    /* ========== 打开会话 ========== */
    function openSession(sessionKey) {
        currentSessionKey = sessionKey;
        renderSessionList(); /* 更新高亮 */
        renderChatArea(sessionKey);
    }

    function renderChatArea(sessionKey) {
        var chatData = getChatData();
        var messages = chatData[sessionKey] || [];
        var myId = user.stuId || user.name;

        /* 解析 sessionKey */
        var parts = sessionKey.split('_');
        var sProductId = parts[0];
        var otherStuId = String(myId) === String(parts[1]) ? parts[2] : parts[1];

        /* 获取对方名称 */
        var otherName = otherStuId;
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].sender !== myId && messages[i].sender !== user.name) {
                otherName = messages[i].sender;
                break;
            }
        }

        /* 标记已读 */
        messages.forEach(function(m) {
            if (m.sender !== myId && m.sender !== user.name && m.status !== 'read') {
                m.status = 'read';
            }
        });
        chatData[sessionKey] = messages;
        saveChatData(chatData);

        var avatarLetter = otherName ? otherName.charAt(0) : '?';
        var productLabel = sProductId ? '商品ID: ' + sProductId : '';

        chatMainEl.innerHTML =
            '<div class="chat-header">' +
                '<div class="chat-header-left">' +
                    '<div class="chat-header-avatar">' + escapeHtml(avatarLetter) + '</div>' +
                    '<div class="chat-header-info">' +
                        '<h4>' + escapeHtml(otherName) + '</h4>' +
                        (productLabel ? '<div class="chat-header-product"><i class="fas fa-tag"></i> ' + escapeHtml(productLabel) + '</div>' : '') +
                    '</div>' +
                '</div>' +
                '<div class="chat-header-right">' +
                    '<button class="chat-header-btn" id="backToList"><i class="fas fa-arrow-left"></i> 返回</button>' +
                '</div>' +
            '</div>' +
            '<div class="chat-messages" id="chatMessages"></div>' +
            '<div class="chat-input-area">' +
                '<input type="text" id="chatInput" placeholder="输入消息，按回车发送...">' +
                '<button id="chatSendBtn"><i class="fas fa-paper-plane"></i> 发送</button>' +
            '</div>';

        /* 渲染消息 */
        renderMessages(messages);

        /* 绑定事件 */
        document.getElementById('backToList').addEventListener('click', function() {
            currentSessionKey = '';
            chatMainEl.innerHTML = '<div class="chat-empty-state"><i class="fas fa-comment-dots" style="font-size:48px;opacity:0.3"></i><p>选择一个会话开始聊天</p></div>';
            renderSessionList();
        });

        var chatInput = document.getElementById('chatInput');
        var chatSendBtn = document.getElementById('chatSendBtn');

        function doSend() {
            var text = chatInput.value.trim();
            if (!text) return;

            var chatData2 = getChatData();
            if (!chatData2[sessionKey]) chatData2[sessionKey] = [];

            var now = new Date();
            chatData2[sessionKey].push({
                sender: user.name,
                senderStuId: user.stuId || '',
                receiver: otherName,
                receiverStuId: otherStuId,
                text: text,
                time: now.toLocaleString(),
                status: 'sent'
            });

            saveChatData(chatData2);
            chatInput.value = '';
            renderMessages(chatData2[sessionKey]);
            renderSessionList();

            /* 模拟对方回复 */
            setTimeout(function() {
                var autoReplies = [
                    '好的，我看到了',
                    '请问还有什么问题吗？',
                    '可以的，随时联系我',
                    '收到，稍后回复你',
                    '没问题！'
                ];
                var reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
                var chatData3 = getChatData();
                if (!chatData3[sessionKey]) return;
                chatData3[sessionKey].push({
                    sender: otherName,
                    senderStuId: otherStuId,
                    receiver: user.name,
                    receiverStuId: user.stuId || '',
                    text: reply,
                    time: new Date().toLocaleString(),
                    status: 'unread'
                });
                saveChatData(chatData3);
                renderMessages(chatData3[sessionKey]);
                renderSessionList();
            }, 1500 + Math.random() * 2000);
        }

        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                doSend();
            }
        });

        chatSendBtn.addEventListener('click', function() { doSend(); });
    }

    function renderMessages(messages) {
        var msgArea = document.getElementById('chatMessages');
        if (!msgArea) return;
        var myId = user.stuId || user.name;

        if (!messages || messages.length === 0) {
            msgArea.innerHTML = '<div class="chat-empty-state" style="padding:40px"><i class="fas fa-comment-dots" style="font-size:36px;opacity:0.3"></i><p>暂无消息，发送第一条私信吧</p></div>';
            return;
        }

        var html = '';
        var lastDate = '';

        messages.forEach(function(msg) {
            var isSelf = msg.sender === user.name || msg.senderStuId === myId;
            var msgDate = msg.time ? msg.time.split(' ')[0] : '';
            if (msgDate && msgDate !== lastDate) {
                html += '<div class="chat-date-divider"><span>' + escapeHtml(msgDate) + '</span></div>';
                lastDate = msgDate;
            }

            var avatarLetter = isSelf ? user.name.charAt(0) : (msg.sender ? msg.sender.charAt(0) : '?');
            var statusHtml = '';
            if (isSelf) {
                statusHtml = msg.status === 'read'
                    ? '<div class="chat-msg-status read"><i class="fas fa-check-double"></i> 已读</div>'
                    : '<div class="chat-msg-status unread"><i class="fas fa-check"></i> 未读</div>';
            }

            html += '<div class="chat-msg' + (isSelf ? ' self' : '') + '">' +
                '<div class="chat-msg-avatar">' + escapeHtml(avatarLetter) + '</div>' +
                '<div class="chat-msg-content">' +
                    '<div class="chat-msg-bubble">' + escapeHtml(msg.text) + '</div>' +
                    '<div class="chat-msg-time">' + (msg.time ? msg.time.split(' ')[1] || msg.time : '') + '</div>' +
                    statusHtml +
                '</div>' +
            '</div>';
        });

        msgArea.innerHTML = html;
        msgArea.scrollTop = msgArea.scrollHeight;
    }

    /* ========== 初始化 ========== */
    renderSessionList();

    /* 如果 URL 携带了目标用户和商品ID，自动创建/打开会话 */
    if (targetUser && productId) {
        var myId = user.stuId || user.name;
        var sessionKey = getChatSessionKey(productId, myId, targetUser);

        /* 如果会话不存在，创建初始消息 */
        var chatData = getChatData();
        if (!chatData[sessionKey] || chatData[sessionKey].length === 0) {
            chatData[sessionKey] = [];
            if (productName) {
                chatData[sessionKey].push({
                    sender: user.name,
                    senderStuId: user.stuId || '',
                    receiver: targetUser,
                    receiverStuId: targetUser,
                    text: '你好，我对「' + decodeURIComponent(productName) + '」感兴趣，想了解一下',
                    time: new Date().toLocaleString(),
                    status: 'sent'
                });
            }
            saveChatData(chatData);
        }

        renderSessionList();
        openSession(sessionKey);
    }

    /* ========== 导航栏登录状态 ========== */
    var loginBtn = document.querySelector('.login-btn');
    if (user && loginBtn) {
        loginBtn.textContent = user.name || '我的';
        loginBtn.href = 'profile.html';
    }

    /* 主题切换 */
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        var savedTheme = localStorage.getItem('campus_theme');
        if (savedTheme === 'dark') document.body.classList.add('dark-theme');
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('campus_theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    /* 移动端菜单 */
    var menuToggle = document.getElementById('menuToggle');
    var navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
})();
