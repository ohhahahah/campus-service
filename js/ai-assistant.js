document.addEventListener('DOMContentLoaded', function() {
    var chatMessages = document.getElementById('chatMessages');
    var chatInput = document.getElementById('chatInput');
    var sendBtn = document.getElementById('sendBtn');
    var clearChatBtn = document.getElementById('clearChat');
    var exportChatBtn = document.getElementById('exportChat');
    var historyList = document.getElementById('historyList');

    var knowledgeBase = {
        '选课': '📚 选课流程如下：\n\n1. 登录教务管理系统（网址：jw.campus.edu.cn）\n2. 点击"选课管理"→"网上选课"\n3. 选择课程类型（必修/选修/通识）\n4. 搜索课程名称或代码，加入选课清单\n5. 确认选课，提交\n\n⏰ 选课时间：\n• 第一轮：开学前一周\n• 第二轮：开学第一周\n• 退补选：开学第二周\n\n💡 提示：建议提前规划好课程，避免时间冲突。选课期间系统可能较忙，请耐心尝试。',
        '图书馆': '📖 图书馆开放时间：\n\n• 周一至周五：7:00-22:30\n• 周六日：8:00-22:00\n• 法定节假日：9:00-17:00\n\n📚 馆内设施：\n• 1-2层：综合阅览室\n• 3层：电子阅览室\n• 4层：自习室（需预约）\n• 5层：学术报告厅\n\n💡 借阅规则：\n• 本科生可借10本，借期30天\n• 研究生可借15本，借期60天\n• 可在线续借1次\n\n<a href="booking.html" class="ai-msg-link">前往场馆预约 →</a>',
        '场馆': '🏟️ 场馆预约流程：\n\n可预约场馆：\n• 图书馆自习室\n• 学生活动中心\n• 体育馆（羽毛球/乒乓球/篮球）\n• 实训室\n• 多功能会议室\n\n预约方式：\n1. 登录智慧校园→场馆预约\n2. 选择场馆类型和日期\n3. 选择可用时段\n4. 填写使用目的\n5. 提交预约申请\n\n⚠️ 注意：需提前1天预约，取消需提前4小时\n\n<a href="booking.html" class="ai-msg-link">前往场馆预约 →</a>',
        '食堂': '🍽️ 校园食堂信息：\n\n• 一食堂（北区）：川菜、湘菜、面食\n• 二食堂（南区）：粤菜、东北菜、麻辣烫\n• 三食堂（东区）：快餐、粥粉面、烧烤\n• 清真食堂：清真菜品\n\n⏰ 营业时间：\n• 早餐：6:30-9:00\n• 午餐：11:00-13:00\n• 晚餐：17:00-19:30\n• 夜宵（三食堂）：19:30-22:00\n\n💰 支付方式：校园卡/微信/支付宝',
        '成绩': '📊 成绩查询方式：\n\n1. 登录教务管理系统\n2. 点击"成绩管理"→"成绩查询"\n3. 选择学期查看成绩\n\n📋 成绩说明：\n• 综合成绩 = 平时成绩×30% + 期末成绩×70%\n• 绩点计算：90-100分=4.0，80-89=3.0-3.9\n• 不及格课程需参加补考\n\n📅 补考时间：每学期开学第一周',
        '校园卡': '💳 校园卡挂失流程：\n\n1. 线上挂失：\n   • 智慧校园APP→一卡通→挂失\n   • 或拨打一卡通中心电话\n\n2. 线下挂失：\n   • 前往一卡通中心（行政楼1层）\n   • 携带身份证办理\n\n💰 补卡费用：20元/张\n⏰ 办理时间：工作日 8:30-17:00\n\n💡 提示：挂失后卡内余额会冻结，补卡后自动转入新卡',
        '奖学金': '🏆 奖学金申请条件：\n\n• 国家奖学金：学年GPA≥3.8，综合排名前5%\n• 国家励志奖学金：GPA≥3.5，家庭经济困难\n• 校级一等奖学金：GPA≥3.5，排名前10%\n• 校级二等奖学金：GPA≥3.2，排名前20%\n\n📅 申请时间：每年9-10月\n\n📋 申请材料：\n1. 奖学金申请表\n2. 成绩单\n3. 获奖证书复印件\n4. 个人陈述'
    };

    function getTimeStr() {
        var now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    }

    function addMessage(content, isUser) {
        var msgDiv = document.createElement('div');
        msgDiv.className = 'ai-msg ' + (isUser ? 'ai-msg-user' : 'ai-msg-bot');
        var avatarIcon = isUser ? 'fas fa-user' : 'fas fa-robot';
        msgDiv.innerHTML = '<div class="ai-msg-avatar"><i class="' + avatarIcon + '"></i></div><div class="ai-msg-content"><div class="ai-msg-bubble">' + content.replace(/\n/g, '<br>') + '</div><div class="ai-msg-time">' + getTimeStr() + '</div></div>';
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        var typingDiv = document.createElement('div');
        typingDiv.className = 'ai-msg ai-msg-bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<div class="ai-msg-avatar"><i class="fas fa-robot"></i></div><div class="ai-msg-content"><div class="ai-msg-bubble ai-typing"><span></span><span></span><span></span></div></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        var typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    function getAIResponse(question) {
        var q = question.toLowerCase();
        for (var key in knowledgeBase) {
            if (q.includes(key)) {
                return knowledgeBase[key];
            }
        }
        if (q.includes('你好') || q.includes('hi') || q.includes('hello')) {
            return '你好！👋 我是校园智能助手，很高兴为你服务！你可以问我关于选课、报修、图书馆、食堂、成绩查询等问题，我会尽力帮你解答。';
        }
        if (q.includes('谢谢') || q.includes('感谢')) {
            return '不客气！😊 如果还有其他问题，随时问我哦。祝你校园生活愉快！';
        }
        if (q.includes('快递') || q.includes('取件')) {
            return '📦 校园快递信息：\n\n• 菜鸟驿站：北区商业街1层\n• 营业时间：8:00-20:00\n• 取件方式：扫码取件\n• 滞留提醒：包裹保留3天\n\n💡 提示：大件快递可联系驿站送货上门（收费2-5元）';
        }
        if (q.includes('校医') || q.includes('医院') || q.includes('看病')) {
            return '🏥 校医院信息：\n\n• 位置：校园东区\n• 门诊时间：8:00-17:00（工作日）\n• 急诊电话：120（校内拨打）\n• 携带校园卡就诊\n\n💡 提示：普通门诊可报销部分费用，需先到校医院就诊，如需转院需开具转诊单。';
        }
        return '🤔 抱歉，我暂时无法回答这个问题。你可以尝试以下方式获取帮助：\n\n1. 点击左侧快捷问题按钮\n2. 前往相关服务页面查看\n3. 拨打校园服务热线：010-12345678\n\n我会持续学习，下次可能就能回答你了！\n\n<a href="index.html" class="ai-msg-link">返回首页 →</a>';
    }

    function sendMessage() {
        var text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';
        chatInput.style.height = 'auto';

        var historyItem = document.createElement('div');
        historyItem.className = 'ai-history-item';
        historyItem.textContent = text.length > 10 ? text.substring(0, 10) + '...' : text;
        historyItem.addEventListener('click', function() {
            chatInput.value = text;
            sendMessage();
        });
        historyList.insertBefore(historyItem, historyList.firstChild);

        addTypingIndicator();

        var delay = 800 + Math.random() * 1200;
        setTimeout(function() {
            removeTypingIndicator();
            var response = getAIResponse(text);
            addMessage(response, false);
        }, delay);
    }

    sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    document.querySelectorAll('.ai-quick-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var question = this.dataset.question;
            chatInput.value = question;
            sendMessage();
        });
    });

    document.querySelectorAll('.ai-history-item').forEach(function(item) {
        item.addEventListener('click', function() {
            chatInput.value = this.textContent;
            sendMessage();
        });
    });

    clearChatBtn.addEventListener('click', function() {
        chatMessages.innerHTML = '';
        addMessage('对话已清空。有什么我可以帮你的吗？ 🤖', false);
    });

    exportChatBtn.addEventListener('click', function() {
        var msgs = chatMessages.querySelectorAll('.ai-msg');
        var text = '=== 校园AI助手对话记录 ===\n\n';
        msgs.forEach(function(msg) {
            var isUser = msg.classList.contains('ai-msg-user');
            var bubble = msg.querySelector('.ai-msg-bubble');
            if (bubble) {
                text += (isUser ? '【我】' : '【助手】') + bubble.textContent.trim() + '\n\n';
            }
        });
        var blob = new Blob([text], { type: 'text/plain' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '校园AI助手对话_' + new Date().toLocaleDateString() + '.txt';
        a.click();
    });

    document.querySelectorAll('.ai-faq-question').forEach(function(q) {
        q.addEventListener('click', function() {
            var item = this.parentElement;
            var wasActive = item.classList.contains('active');
            document.querySelectorAll('.ai-faq-item').forEach(function(i) {
                i.classList.remove('active');
            });
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
});
