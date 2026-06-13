/**
 * 悬浮机器人客服组件
 * 自动注入到页面，支持拖拽移动 + AI聊天
 */
(function() {
    'use strict';

    // ========== 知识库 ==========
    var knowledgeBase = {
        '二手': '🛍️ 二手交易使用指南：\n\n【浏览商品】\n1. 点击导航栏「二手市场」进入商品列表\n2. 可按分类筛选、搜索关键词查找商品\n3. 点击商品卡片查看详细信息\n\n【发布商品】\n1. 在二手市场页面点击「发布商品」按钮\n2. 填写商品名称、价格、分类、成色等信息\n3. 上传商品图片，选择交易方式（出售/出租）\n4. 提交发布即可\n\n【收藏商品】\n1. 在商品列表或详情页点击❤️收藏按钮\n2. 按钮变为橙色表示已收藏\n3. 登录后点击右上角账号 → 下拉菜单选择「我的收藏」查看\n\n【租用商品】\n1. 进入商品详情页，选择「租用」方式\n2. 填写租用时间、配送宿舍楼、备注\n3. 提交订单，在「我的订单」中查看\n\n【私信卖家】\n1. 在商品列表或详情页点击「私信」按钮\n2. 输入消息发送即可与卖家沟通\n3. 登录后点击右上角账号 → 下拉菜单选择「我的私信」查看\n\n💡 提示：交易请选择公共场所，注意安全',
        '预约': '📅 场馆预约使用指南：\n\n【预约流程】\n1. 点击导航栏「场馆预约」进入预约页面\n2. 选择场馆类型（体育馆、图书馆研讨室、活动中心等）\n3. 选择预约日期\n4. 选择可用时间段，点击预约\n5. 确认信息后提交预约\n\n【查看预约】\n1. 预约成功后可在「我的预约」中查看\n2. 到达场馆后需签到确认\n\n【注意事项】\n• 每人每天最多预约2个时段\n• 请按时到场，超时15分钟自动取消\n• 如需取消请提前操作，避免资源浪费\n• 图书馆研讨室需通过本平台「场馆预约」模块在线预约',
        '兼职': '💼 兼职互助使用指南：\n\n【浏览兼职】\n1. 点击导航栏「兼职互助」进入兼职信息页面\n2. 浏览各类兼职信息，查看薪资、时间、要求\n\n【发布兼职】\n1. 在兼职互助页面点击「发布」按钮\n2. 填写兼职类型、薪资、工作时间、联系方式\n3. 提交发布\n\n【联系发布者】\n1. 点击兼职信息中的联系方式\n2. 与发布者沟通详情\n\n⚠️ 注意：请辨别信息真伪，保护个人隐私，不缴纳任何前期费用',
        '快递': '📦 快递服务信息：\n\n• 菜鸟驿站：校门口左侧\n• 营业时间：8:00-20:00\n• 取件方式：扫码取件\n• 超时保管：3天未取将退回\n\n💡 提示：取件时请携带校园卡或出示取件码',
        '食堂': '🍽️ 食堂信息：\n\n• 一食堂：基础套餐，人均8-12元\n• 二食堂：特色小吃，人均10-15元\n• 清真窗口：位于二食堂二楼\n\n⏰ 营业时间：\n早餐 6:30-9:00 | 午餐 11:00-13:00 | 晚餐 17:00-19:30',
        '宿舍': '🏠 宿舍相关信息：\n\n• 门禁时间：23:00\n• 水电费：每月免费额度，超额自费\n• 网络费用：30元/月\n• 报修：通过本平台提交报修工单\n\n【宿舍报修流程】\n1. 在首页找到「报修服务」入口\n2. 选择报修类型（水电/门窗/网络/家具）\n3. 填写报修描述和宿舍号\n4. 提交工单\n\n⏰ 处理时效：\n• 紧急维修：2小时内响应\n• 一般维修：24小时内响应',
        '图书馆': '📖 图书馆信息（济南幼儿师范高等专科学校）：\n\n• 开放时间：7:00-22:00\n• 借阅限额：在校学生可借阅5本图书\n• 借阅期限：30天，可续借1次，续借期限30天\n• 研讨室：需通过本平台「场馆预约」模块在线预约\n\n💡 提示：借书请携带校园卡，按时归还避免逾期',
        '流浪猫': '🐱 流浪猫寄养使用指南：\n\n【寄养申请】\n1. 点击导航栏「流浪猫寄养」进入页面\n2. 浏览待领养的流浪猫信息\n3. 选择心仪的猫咪，点击「申请寄养」\n4. 填写寄养申请表（个人情况、养宠经验等）\n5. 提交申请，等待审核\n\n【寄养须知】\n• 寄养期间需负责猫咪的日常喂养和照顾\n• 需定期反馈猫咪健康状况\n• 如遇问题及时联系管理员\n• 毕业前需妥善安排猫咪去向',
        '收藏': '❤️ 收藏功能使用指南：\n\n【如何收藏商品】\n1. 进入二手市场，浏览商品列表\n2. 点击商品卡片右下角的❤️心形按钮，或进入商品详情页点击「收藏」按钮\n3. 按钮变为橙色填充表示收藏成功\n\n【如何查看收藏】\n1. 登录后点击右上角账号\n2. 在下拉菜单中选择「我的收藏」\n3. 即可查看所有已收藏的商品\n\n【取消收藏】\n1. 在「我的收藏」页面点击「取消收藏」按钮\n2. 或在商品详情页再次点击收藏按钮取消\n\n💡 提示：收藏数据保存在本地，更换浏览器需重新收藏',
        '登录': '🔐 登录与账号说明：\n\n【学生登录】\n1. 在登录页选择「学生登录」标签\n2. 输入学号和密码\n3. 点击登录，进入学生端首页\n\n【管理员登录】\n1. 在登录页选择「管理员登录」标签\n2. 输入管理员账号和密码\n3. 点击登录，进入管理后台\n\n【演示账号】\n• 学生账号：2024001，密码：123456\n• 管理员账号：admin，密码：admin123\n\n💡 提示：忘记密码请联系管理员重置',
        '报修': '🔧 宿舍报修流程：\n1. 在首页找到「报修服务」入口\n2. 选择报修类型（水电/门窗/网络/家具）\n3. 填写报修描述和宿舍号\n4. 提交工单\n\n⏰ 处理时效：\n• 紧急维修：2小时内响应\n• 一般维修：24小时内响应',
        '订单': '📋 租用订单使用指南：\n\n【查看订单】\n1. 登录后点击右上角账号\n2. 在下拉菜单中选择「我的订单」\n3. 查看所有租用订单及状态\n\n【订单状态说明】\n• 待确认：卖家尚未确认订单\n• 已租用：卖家已确认，商品租用中\n• 已归还：商品已归还，订单完成\n\n💡 提示：如有问题可通过私信联系卖家沟通',
        '私信': '💬 私信功能使用指南：\n\n【发送私信】\n1. 在二手市场商品列表点击「私信」按钮\n2. 或在商品详情页点击「私信卖家」\n3. 输入消息内容，点击发送\n\n【查看私信】\n1. 登录后点击右上角账号\n2. 在下拉菜单中选择「我的私信」\n3. 查看所有聊天记录\n\n💡 提示：私信功能需登录后使用'
    };

    var quickQuestions = ['二手交易', '场馆预约', '兼职互助', '快递', '食堂', '宿舍', '流浪猫寄养'];

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
        // 同义词匹配
        if (/买|卖|闲置|交易|商品|发布/.test(lower)) return knowledgeBase['二手'];
        if (/图书|借书|还书/.test(lower)) return knowledgeBase['图书馆'];
        if (/饭|吃|餐/.test(lower)) return knowledgeBase['食堂'];
        if (/住|寝室|门禁/.test(lower)) return knowledgeBase['宿舍'];
        if (/工作|打工|实习/.test(lower)) return knowledgeBase['兼职'];
        if (/修|漏|坏|故障/.test(lower)) return knowledgeBase['报修'];
        if (/拿|取件|驿站/.test(lower)) return knowledgeBase['快递'];
        if (/订|场地|活动室|研讨/.test(lower)) return knowledgeBase['预约'];
        if (/猫|领养|寄养|宠物/.test(lower)) return knowledgeBase['流浪猫'];
        if (/收藏|喜欢|关注/.test(lower)) return knowledgeBase['收藏'];
        if (/登录|注册|账号|密码|学号/.test(lower)) return knowledgeBase['登录'];
        if (/订单|租用|租/.test(lower)) return knowledgeBase['订单'];
        if (/私信|聊天|消息/.test(lower)) return knowledgeBase['私信'];

        // 问候
        if (/你好|hi|hello|嗨|hey/.test(lower)) return '你好！😊 我是智慧校园AI助手，可以帮你了解二手交易、场馆预约、兼职互助等功能的使用方法，直接输入问题即可~';

        // 默认回复
        return '🤔 抱歉，我暂时无法回答这个问题。\n\n你可以试试以下话题：\n• 二手交易 / 场馆预约 / 兼职互助\n• 快递 / 食堂 / 宿舍 / 图书馆\n• 流浪猫寄养 / 收藏 / 订单 / 私信\n\n或点击下方快捷按钮快速查询~';
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
