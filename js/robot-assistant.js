/**
 * 悬浮机器人客服组件
 * 自动注入到页面，支持拖拽移动 + AI聊天
 */
(function() {
    'use strict';

    // ========== 知识库 ==========
    var knowledgeBase = {
        '选课': '📚 选课流程：\n1. 登录教务管理系统（jw.campus.edu.cn）\n2. 点击"选课管理"→"网上选课"\n3. 选择课程类型，搜索课程加入清单\n4. 确认提交\n\n⏰ 选课时间：\n• 第一轮：开学前一周\n• 第二轮：开学第一周\n• 退补选：开学第二周',
        '报修': '🔧 宿舍报修流程：\n1. 登录智慧校园平台\n2. 进入报修板块\n3. 选择报修类型（水电/门窗/网络/家具）\n4. 填写报修描述和宿舍号\n5. 提交工单\n\n⏰ 处理时效：\n• 紧急维修：2小时内响应\n• 一般维修：24小时内响应',
        '二手': '🛍️ 二手市场使用指南：\n1. 进入"二手市场"页面\n2. 浏览商品或发布闲置\n3. 点击商品查看详情\n4. 联系卖家进行交易\n\n💡 提示：交易请选择公共场所，注意安全',
        '预约': '📅 场馆预约流程：\n1. 进入"场馆预约"页面\n2. 选择场馆类型和日期\n3. 选择时间段，提交预约\n4. 预约成功后到馆签到\n\n📋 可预约场馆：图书馆研讨室、体育馆、活动中心等',
        '兼职': '💼 兼职互助：\n1. 进入"兼职互助"页面\n2. 浏览兼职信息或发布需求\n3. 联系发布者了解详情\n\n⚠️ 注意：请辨别信息真伪，保护个人隐私',
        '成绩': '📊 成绩查询：\n1. 登录教务管理系统\n2. 点击"成绩管理"→"成绩查询"\n3. 选择学期查看成绩\n\n📋 综合成绩 = 平时成绩×30% + 期末成绩×70%',
        '奖学金': '🏆 奖学金申请：\n• 国家奖学金：GPA≥3.8，排名前5%\n• 国家励志奖学金：GPA≥3.5，家庭经济困难\n• 校级奖学金：GPA≥3.2，排名前20%\n\n📅 申请时间：每年9-10月',
        '快递': '📦 快递服务：\n• 菜鸟驿站：校门口左侧\n• 营业时间：8:00-20:00\n• 取件方式：扫码取件\n• 超时保管：3天未取将退回',
        '食堂': '🍽️ 食堂信息：\n• 一食堂：基础套餐，人均8-12元\n• 二食堂：特色小吃，人均10-15元\n• 三食堂：清真窗口\n\n⏰ 营业时间：\n早餐 6:30-9:00 | 午餐 11:00-13:00 | 晚餐 17:00-19:30',
        '宿舍': '🏠 宿舍相关：\n• 门禁时间：23:00\n• 水电费：每月免费额度，超额自费\n• 网络费用：30元/月\n• 报修：通过平台提交工单',
        '图书馆': '📖 图书馆：\n• 开放时间：7:00-22:00\n• 借阅限额：本科生10本，研究生20本\n• 借阅期限：30天，可续借1次\n• 研讨室：需在线预约'
    };

    var quickQuestions = ['选课', '二手交易', '场馆预约', '兼职互助', '快递', '食堂', '宿舍', '图书馆'];

    // ========== 状态 ==========
    var chatOpen = false;
    var messages = [];
    var pos = { x: 0, y: 0 };
    var drag = { active: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 };

    // ========== DOM ==========
    var wrapper, floatEl, chatOverlay, chatMessages, chatInput;

    function init() {
        // 创建容器
        wrapper = document.createElement('div');
        wrapper.className = 'robot-assistant';
        wrapper.id = 'robotAssistant';

        // 计算初始位置（右下角）
        pos.x = window.innerWidth - 90;
        pos.y = window.innerHeight - 120;

        // 悬浮图标
        floatEl = document.createElement('div');
        floatEl.className = 'robot-float breathing';
        floatEl.style.cssText = 'position:fixed;left:' + pos.x + 'px;top:' + pos.y + 'px;z-index:99999';
        floatEl.innerHTML = '<i class="fas fa-robot robot-icon"></i><span class="robot-label">AI助手</span>';
        wrapper.appendChild(floatEl);

        // 聊天弹窗（默认隐藏）
        chatOverlay = document.createElement('div');
        chatOverlay.className = 'robot-chat-overlay';
        chatOverlay.style.display = 'none';
        chatOverlay.innerHTML = buildChatHTML();
        wrapper.appendChild(chatOverlay);

        document.body.appendChild(wrapper);

        // 缓存 DOM
        chatMessages = chatOverlay.querySelector('.robot-chat-messages');
        chatInput = chatOverlay.querySelector('.robot-chat-input input');

        // 绑定事件
        bindEvents();

        // 欢迎消息
        addBotMessage('你好！我是智慧校园AI助手 🤖\n有什么可以帮你的吗？可以直接输入问题，或点击下方快捷按钮。');
    }

    function buildChatHTML() {
        var qBtns = quickQuestions.map(function(q) {
            return '<button class="robot-quick-btn" data-q="' + q + '">' + q + '</button>';
        }).join('');

        return '<div class="robot-chat-window">' +
            '<div class="robot-chat-header">' +
                '<div class="header-left">' +
                    '<i class="fas fa-robot"></i>' +
                    '<div class="header-info"><h3>AI智能助手</h3><p>智慧校园 · 随时为你服务</p></div>' +
                '</div>' +
                '<button class="header-close" id="robotCloseBtn"><i class="fas fa-times"></i></button>' +
            '</div>' +
            '<div class="robot-chat-messages"></div>' +
            '<div class="robot-quick-questions">' + qBtns + '</div>' +
            '<div class="robot-chat-input">' +
                '<input type="text" placeholder="输入你的问题..." id="robotInput" autocomplete="off">' +
                '<button class="send-btn" id="robotSendBtn"><i class="fas fa-paper-plane"></i></button>' +
            '</div>' +
        '</div>';
    }

    function bindEvents() {
        // 拖拽 - 鼠标
        floatEl.addEventListener('mousedown', onDragStart);
        // 拖拽 - 触摸
        floatEl.addEventListener('touchstart', onTouchStart, { passive: false });
        // 点击机器人
        floatEl.addEventListener('click', onFloatClick);
        // 关闭聊天
        chatOverlay.querySelector('#robotCloseBtn').addEventListener('click', closeChat);
        chatOverlay.addEventListener('click', function(e) {
            if (e.target === chatOverlay) closeChat();
        });
        // 发送消息
        chatOverlay.querySelector('#robotSendBtn').addEventListener('click', sendMessage);
        chatOverlay.querySelector('#robotInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
        // 快捷问题
        chatOverlay.querySelectorAll('.robot-quick-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var q = this.getAttribute('data-q');
                chatInput.value = q;
                sendMessage();
            });
        });
        // 窗口缩放时修正位置
        window.addEventListener('resize', clampPosition);
    }

    // ========== 拖拽逻辑 ==========
    function onDragStart(e) {
        e.preventDefault();
        drag.active = true;
        drag.moved = false;
        drag.sx = e.clientX;
        drag.sy = e.clientY;
        drag.ox = e.clientX - pos.x;
        drag.oy = e.clientY - pos.y;
        floatEl.classList.remove('breathing');
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    }

    function onDragMove(e) {
        if (!drag.active) return;
        var dx = Math.abs(e.clientX - drag.sx);
        var dy = Math.abs(e.clientY - drag.sy);
        if (dx > 3 || dy > 3) drag.moved = true;
        var nx = e.clientX - drag.ox;
        var ny = e.clientY - drag.oy;
        nx = Math.max(0, Math.min(nx, window.innerWidth - 70));
        ny = Math.max(0, Math.min(ny, window.innerHeight - 70));
        pos.x = nx;
        pos.y = ny;
        floatEl.style.left = nx + 'px';
        floatEl.style.top = ny + 'px';
    }

    function onDragEnd() {
        drag.active = false;
        if (!chatOpen) floatEl.classList.add('breathing');
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
    }

    function onTouchStart(e) {
        e.preventDefault();
        var t = e.touches[0];
        drag.active = true;
        drag.moved = false;
        drag.sx = t.clientX;
        drag.sy = t.clientY;
        drag.ox = t.clientX - pos.x;
        drag.oy = t.clientY - pos.y;
        floatEl.classList.remove('breathing');
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    }

    function onTouchMove(e) {
        if (!drag.active) return;
        e.preventDefault();
        var t = e.touches[0];
        var dx = Math.abs(t.clientX - drag.sx);
        var dy = Math.abs(t.clientY - drag.sy);
        if (dx > 3 || dy > 3) drag.moved = true;
        var nx = t.clientX - drag.ox;
        var ny = t.clientY - drag.oy;
        nx = Math.max(0, Math.min(nx, window.innerWidth - 70));
        ny = Math.max(0, Math.min(ny, window.innerHeight - 70));
        pos.x = nx;
        pos.y = ny;
        floatEl.style.left = nx + 'px';
        floatEl.style.top = ny + 'px';
    }

    function onTouchEnd() {
        drag.active = false;
        if (!chatOpen) floatEl.classList.add('breathing');
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    }

    function clampPosition() {
        var nx = Math.min(pos.x, window.innerWidth - 70);
        var ny = Math.min(pos.y, window.innerHeight - 70);
        nx = Math.max(0, nx);
        ny = Math.max(0, ny);
        pos.x = nx;
        pos.y = ny;
        floatEl.style.left = nx + 'px';
        floatEl.style.top = ny + 'px';
    }

    // ========== 点击/聊天 ==========
    function onFloatClick() {
        if (drag.moved) return; // 拖拽过不触发点击
        if (chatOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    function openChat() {
        chatOpen = true;
        chatOverlay.style.display = 'flex';
        floatEl.classList.remove('breathing');
        chatInput.focus();
    }

    function closeChat() {
        chatOpen = false;
        chatOverlay.style.display = 'none';
        floatEl.classList.add('breathing');
    }

    // ========== 消息 ==========
    function sendMessage() {
        var text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';
        addUserMessage(text);
        // 模拟思考延迟
        showTyping();
        setTimeout(function() {
            removeTyping();
            var reply = getReply(text);
            addBotMessage(reply);
        }, 600 + Math.random() * 800);
    }

    function addUserMessage(text) {
        messages.push({ role: 'user', text: text });
        var el = document.createElement('div');
        el.className = 'robot-msg user';
        el.innerHTML = '<div class="msg-avatar"><i class="fas fa-user"></i></div><div class="msg-bubble">' + escapeHtml(text) + '</div>';
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function addBotMessage(text) {
        messages.push({ role: 'bot', text: text });
        var el = document.createElement('div');
        el.className = 'robot-msg bot';
        el.innerHTML = '<div class="msg-avatar"><i class="fas fa-robot"></i></div><div class="msg-bubble">' + escapeHtml(text).replace(/\n/g, '<br>') + '</div>';
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function showTyping() {
        var el = document.createElement('div');
        el.className = 'robot-msg bot';
        el.id = 'robotTyping';
        el.innerHTML = '<div class="msg-avatar"><i class="fas fa-robot"></i></div><div class="msg-bubble"><div class="robot-typing"><span></span><span></span><span></span></div></div>';
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function removeTyping() {
        var el = document.getElementById('robotTyping');
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getReply(text) {
        var lower = text.toLowerCase();
        // 关键词匹配
        for (var key in knowledgeBase) {
            if (lower.indexOf(key) !== -1) {
                return knowledgeBase[key];
            }
        }
        // 同义词
        if (/买|卖|闲置|交易/.test(lower)) return knowledgeBase['二手'];
        if (/图书|借书|还书/.test(lower)) return knowledgeBase['图书馆'];
        if (/饭|吃|餐/.test(lower)) return knowledgeBase['食堂'];
        if (/住|寝室|门禁/.test(lower)) return knowledgeBase['宿舍'];
        if (/工作|打工|实习/.test(lower)) return knowledgeBase['兼职'];
        if (/修|漏|坏|故障/.test(lower)) return knowledgeBase['报修'];
        if (/课|选/.test(lower)) return knowledgeBase['选课'];
        if (/分|绩点|gpa/.test(lower)) return knowledgeBase['成绩'];
        if (/奖|助学金/.test(lower)) return knowledgeBase['奖学金'];
        if (/拿|取件|驿站/.test(lower)) return knowledgeBase['快递'];
        if (/订|场地|活动室/.test(lower)) return knowledgeBase['预约'];

        // 问候
        if (/你好|hi|hello|嗨|hey/.test(lower)) return '你好！😊 我是智慧校园AI助手，可以帮你查询选课、二手市场、场馆预约、快递等信息，直接输入问题即可~';

        // 默认回复
        return '🤔 抱歉，我暂时无法回答这个问题。\n\n你可以试试以下话题：\n• 选课 / 成绩 / 奖学金\n• 二手交易 / 场馆预约\n• 兼职互助 / 快递 / 食堂\n• 宿舍 / 图书馆 / 报修\n\n或点击下方快捷按钮快速查询~';
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ========== 初始化 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
