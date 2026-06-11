(function() {
    /* ============================================================
     * 兼职详情数据（与列表页一致 + 扩展详情字段）
     * ============================================================ */
    var jobsDetail = {
        'j1': {
            id: 'j1', title: '图书馆管理员助理', cat: '勤工助学', salary: '15元/小时',
            location: '校内图书馆', time: '周一至周五 14:00-18:00',
            desc: '协助图书整理、借还书服务、阅览室管理，需耐心细致',
            contact: '138****1234', icon: 'fa-book',
            publisher: { name: '王老师', avatar: 'https://i.pravatar.cc/80?img=11', time: '2026-06-08 09:30' },
            detail: '岗位职责：\n1. 负责图书馆借还书服务，协助读者办理借阅手续\n2. 协助图书分类上架，保持书架整洁有序\n3. 维护阅览室秩序，保持安静的学习环境\n4. 协助处理读者咨询，解答基本问题\n5. 定期检查图书破损情况，及时上报维修\n\n岗位要求：\n1. 在校大学生，课余时间充裕\n2. 工作认真负责，耐心细致\n3. 具备基本的沟通能力和服务意识\n4. 能按时到岗，不迟到早退',
            benefits: ['勤工助学补贴', '图书馆优先选座', '可开具实习证明', '工作环境安静舒适'],
            notes: ['每周至少到岗3天，每天4小时', '需参加图书馆岗前培训', '报名截止：2026年6月30日', '面试时间另行通知']
        },
        'j2': {
            id: 'j2', title: '食堂窗口帮工', cat: '勤工助学', salary: '12元/小时',
            location: '第一食堂', time: '每日 11:00-13:00',
            desc: '协助窗口打饭、清洁桌面，包工作餐',
            contact: '139****5678', icon: 'fa-utensils',
            publisher: { name: '李阿姨', avatar: 'https://i.pravatar.cc/80?img=5', time: '2026-06-07 14:20' },
            detail: '岗位职责：\n1. 协助食堂窗口打饭、配菜\n2. 用餐高峰期协助维持排队秩序\n3. 餐后清洁桌面、整理餐具\n4. 协助搬运食材和餐料\n\n岗位要求：\n1. 身体健康，持有健康证\n2. 讲究卫生，工作认真\n3. 能适应快节奏工作环境\n4. 午餐时段能准时到岗',
            benefits: ['包工作餐', '勤工助学补贴', '弹性排班', '多劳多得'],
            notes: ['每日工作2小时（11:00-13:00）', '需办理健康证', '可长期做', '工资按月结算']
        },
        'j3': {
            id: 'j3', title: '校园快递代取', cat: '代取快递', salary: '3-5元/件',
            location: '全校范围', time: '课余时间灵活安排',
            desc: '代取快递送至宿舍楼下，按件计费，多劳多得',
            contact: '微信：kuaidi2026', icon: 'fa-box',
            publisher: { name: '张同学', avatar: 'https://i.pravatar.cc/80?img=12', time: '2026-06-09 10:15' },
            detail: '服务内容：\n1. 代取校内快递驿站包裹\n2. 送至指定宿舍楼下\n3. 支持多个快递合并配送\n\n计费规则：\n- 小件快递：3元/件\n- 中件快递：4元/件\n- 大件快递：5元/件\n- 同一地址3件以上打8折\n\n服务范围：\n覆盖校内所有宿舍楼，下单后30分钟内送达\n\n接单要求：\n1. 熟悉校园路线和各宿舍楼位置\n2. 有电动车优先\n3. 责任心强，不丢件不损坏',
            benefits: ['时间自由', '按件计费', '多劳多得', '可长期做'],
            notes: ['课余时间灵活安排', '需自备交通工具', '损坏快递需照价赔偿', '每日结算收入']
        },
        'j4': {
            id: 'j4', title: '小学数学家教', cat: '家教', salary: '80元/次',
            location: '校外小区', time: '周末 9:00-11:00',
            desc: '辅导小学四年级数学，需有耐心，数学基础扎实',
            contact: '137****9012', icon: 'fa-chalkboard-teacher',
            publisher: { name: '刘家长', avatar: 'https://i.pravatar.cc/80?img=32', time: '2026-06-06 16:45' },
            detail: '辅导内容：\n1. 小学四年级数学课程同步辅导\n2. 重点讲解应用题和计算题\n3. 帮助养成良好学习习惯\n4. 每次课后布置适量练习\n\n要求：\n1. 数学基础扎实，高考数学120分以上\n2. 有耐心，善于引导\n3. 师范生或有家教经验优先\n4. 每次辅导2小时',
            benefits: ['薪资优厚', '固定时间', '可长期合作', '家长配合度高'],
            notes: ['每周六上午9:00-11:00', '需试讲一次', '地址：学校附近小区', '交通方便']
        },
        'j5': {
            id: 'j5', title: '校园活动摄影', cat: '校园兼职', salary: '100元/场',
            location: '校内各活动场地', time: '按活动安排',
            desc: '拍摄校园活动照片，需自备相机，后期修图',
            contact: '136****3456', icon: 'fa-camera',
            publisher: { name: '校团委', avatar: 'https://i.pravatar.cc/80?img=60', time: '2026-06-05 11:00' },
            detail: '工作内容：\n1. 拍摄校园各类活动现场照片\n2. 活动结束后24小时内交付精修照片\n3. 每场活动提供30-50张精选照片\n4. 配合学校宣传需求拍摄\n\n要求：\n1. 自备相机（微单/单反均可）\n2. 熟练使用Lightroom/PS后期修图\n3. 有摄影作品集优先\n4. 服从活动安排，准时到场',
            benefits: ['按场计费', '积累作品', '优先参与校园活动', '可开具实践证明'],
            notes: ['需提交作品集审核', '活动前1天确认档期', '照片版权归学校所有', '月底统一结算']
        },
        'j6': {
            id: 'j6', title: '实验室助理', cat: '勤工助学', salary: '15元/小时',
            location: '理学楼实验室', time: '周三、周五 14:00-17:00',
            desc: '协助实验准备、器材整理、数据记录，理工科优先',
            contact: '135****7890', icon: 'fa-flask',
            publisher: { name: '赵教授', avatar: 'https://i.pravatar.cc/80?img=53', time: '2026-06-04 08:30' },
            detail: '岗位职责：\n1. 协助老师准备实验器材和试剂\n2. 实验前后整理实验室\n3. 协助记录实验数据\n4. 维护实验室安全和卫生\n\n岗位要求：\n1. 理工科专业优先（化学、生物、物理）\n2. 做事认真仔细，有责任心\n3. 了解基本实验操作规范\n4. 能严格遵守实验室安全规定',
            benefits: ['勤工助学补贴', '接触科研项目', '导师推荐信', '优先参与课题'],
            notes: ['每周2次，每次3小时', '需参加安全培训', '可长期做', '学期末评优']
        },
        'j7': {
            id: 'j7', title: '英语口语陪练', cat: '家教', salary: '60元/小时',
            location: '线上/图书馆', time: '协商安排',
            desc: '英语口语陪练，需英语六级以上，口语流利',
            contact: '134****2345', icon: 'fa-language',
            publisher: { name: '陈同学', avatar: 'https://i.pravatar.cc/80?img=15', time: '2026-06-03 20:00' },
            detail: '服务内容：\n1. 一对一英语口语练习\n2. 日常对话、话题讨论\n3. 纠正发音和语法错误\n4. 提供口语提升建议\n\n要求：\n1. 英语六级550分以上或雅思6.5以上\n2. 口语流利，发音标准\n3. 有耐心，善于引导\n4. 每周至少2次，每次1小时',
            benefits: ['时间灵活', '地点灵活', '薪资可观', '提升自身口语'],
            notes: ['可线上或线下', '时间双方协商', '需试讲15分钟', '按次结算']
        },
        'j8': {
            id: 'j8', title: '校园外卖配送', cat: '代取快递', salary: '5-8元/单',
            location: '校内各宿舍', time: '午餐/晚餐时段',
            desc: '校内餐饮配送，需自备电动车，熟悉校园路线',
            contact: '133****6789', icon: 'fa-motorcycle',
            publisher: { name: '校园配送站', avatar: 'https://i.pravatar.cc/80?img=51', time: '2026-06-02 12:00' },
            detail: '工作内容：\n1. 从食堂/商家取餐\n2. 配送到校内各宿舍楼\n3. 保证配送速度和餐品完好\n4. 处理简单的售后问题\n\n计费规则：\n- 普通配送：5元/单\n- 远距离配送：6-8元/单\n- 高峰期额外补贴1元/单\n\n要求：\n1. 自备电动车\n2. 熟悉校园路线\n3. 配送及时，服务态度好',
            benefits: ['按单计费', '多劳多得', '高峰补贴', '灵活接单'],
            notes: ['午餐11:00-13:00', '晚餐17:00-19:00', '需自备电动车', '每日结算']
        },
        'j9': {
            id: 'j9', title: '社团公众号运营', cat: '校园兼职', salary: '800元/月',
            location: '线上办公', time: '每日1-2小时',
            desc: '负责社团公众号内容编辑、排版、推送，有经验优先',
            contact: '132****0123', icon: 'fa-pen-nib',
            publisher: { name: '校社联', avatar: 'https://i.pravatar.cc/80?img=33', time: '2026-06-01 15:30' },
            detail: '岗位职责：\n1. 负责社团公众号日常内容编辑\n2. 图文排版美化，保持风格统一\n3. 每周至少推送3篇原创文章\n4. 策划线上线下活动宣传方案\n5. 分析阅读数据，优化内容策略\n\n岗位要求：\n1. 有公众号运营经验优先\n2. 熟练使用秀米/135编辑器\n3. 文字功底好，有创意\n4. 会基础PS/Canva制图',
            benefits: ['月薪制', '线上办公', '积累运营经验', '优秀者可转正'],
            notes: ['每月800元固定薪资', '需提交过往作品', '试用期1个月', '月底统一发放']
        }
    };

    /* ============================================================
     * 获取 URL 参数
     * ============================================================ */
    function getQueryParam(key) {
        var params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    /* ============================================================
     * 渲染详情页
     * ============================================================ */
    function renderDetail() {
        var id = getQueryParam('id');
        if (!id || !jobsDetail[id]) {
            document.getElementById('detailContainer').innerHTML =
                '<div class="pt-detail-empty"><i class="fas fa-exclamation-circle"></i><p>未找到该兼职信息</p><a href="parttime.html" class="pt-detail-back-link">返回列表</a></div>';
            console.log('[兼职详情] 未找到兼职ID:', id);
            return;
        }

        var job = jobsDetail[id];
        console.log('[兼职详情] 加载兼职:', job.title);

        // 更新顶部标题
        document.getElementById('detailTopTitle').textContent = job.title;
        document.title = job.title + ' - 智慧校园';

        // 更新底部薪资
        document.getElementById('bottomSalary').textContent = job.salary;

        // 渲染详情内容
        var container = document.getElementById('detailContainer');
        container.innerHTML =
            /* 基础信息区 */
            '<div class="pt-detail-card pt-detail-basic">' +
                '<div class="pt-detail-basic-top">' +
                    '<div class="pt-detail-icon cat-' + job.cat + '"><i class="fas ' + job.icon + '"></i></div>' +
                    '<div class="pt-detail-basic-info">' +
                        '<h1>' + job.title + '</h1>' +
                        '<div class="pt-detail-tags">' +
                            '<span class="pt-detail-tag cat">' + job.cat + '</span>' +
                            '<span class="pt-detail-tag salary"><i class="fas fa-coins"></i> ' + job.salary + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="pt-detail-meta-grid">' +
                    '<div class="pt-detail-meta-item"><i class="fas fa-clock"></i><div><label>工作时间</label><span>' + job.time + '</span></div></div>' +
                    '<div class="pt-detail-meta-item"><i class="fas fa-map-marker-alt"></i><div><label>工作地点</label><span>' + job.location + '</span></div></div>' +
                    '<div class="pt-detail-meta-item"><i class="fas fa-coins"></i><div><label>薪资待遇</label><span>' + job.salary + '</span></div></div>' +
                '</div>' +
            '</div>' +

            /* 发布人信息 */
            '<div class="pt-detail-card pt-detail-publisher">' +
                '<img class="pt-detail-publisher-avatar" src="' + job.publisher.avatar + '" alt="发布人">' +
                '<div class="pt-detail-publisher-info">' +
                    '<h4>' + job.publisher.name + '</h4>' +
                    '<p><i class="fas fa-clock"></i> ' + job.publisher.time + ' 发布</p>' +
                '</div>' +
            '</div>' +

            /* 详细描述 */
            '<div class="pt-detail-card pt-detail-desc">' +
                '<h3><i class="fas fa-file-alt"></i> 详细描述</h3>' +
                '<div class="pt-detail-desc-content">' + formatDesc(job.detail) + '</div>' +
            '</div>' +

            /* 福利说明 */
            '<div class="pt-detail-card pt-detail-benefits">' +
                '<h3><i class="fas fa-gift"></i> 福利说明</h3>' +
                '<div class="pt-detail-benefits-list">' +
                    job.benefits.map(function(b) {
                        return '<div class="pt-detail-benefit-item"><i class="fas fa-check-circle"></i><span>' + b + '</span></div>';
                    }).join('') +
                '</div>' +
            '</div>' +

            /* 注意事项 */
            '<div class="pt-detail-card pt-detail-notes">' +
                '<h3><i class="fas fa-exclamation-triangle"></i> 注意事项</h3>' +
                '<div class="pt-detail-notes-list">' +
                    job.notes.map(function(n) {
                        return '<div class="pt-detail-note-item"><i class="fas fa-info-circle"></i><span>' + n + '</span></div>';
                    }).join('') +
                '</div>' +
            '</div>';
    }

    /* 格式化描述文本 */
    function formatDesc(text) {
        return text.replace(/\n/g, '<br>');
    }

    /* ============================================================
     * 返回按钮
     * ============================================================ */
    function initBackBtn() {
        document.getElementById('detailBack').addEventListener('click', function() {
            if (document.referrer && document.referrer.indexOf('parttime') > -1) {
                history.back();
            } else {
                location.href = 'parttime.html';
            }
        });
    }

    /* ============================================================
     * 分享按钮（复制链接）
     * ============================================================ */
    function initShareBtn() {
        document.getElementById('detailShare').addEventListener('click', function() {
            var url = window.location.href;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(function() {
                    showToast('链接已复制到剪贴板');
                });
            } else {
                var input = document.createElement('input');
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                showToast('链接已复制到剪贴板');
            }
            console.log('[兼职详情] 分享链接:', url);
        });
    }

    /* ============================================================
     * 申请兼职
     * ============================================================ */
    function initApplyBtn() {
        var applyBtn = document.getElementById('detailApplyBtn');
        var applyModal = document.getElementById('applyModal');
        var applyModalClose = document.getElementById('applyModalClose');
        var applySubmitBtn = document.getElementById('applySubmitBtn');

        applyBtn.addEventListener('click', function() {
            applyModal.classList.add('active');
        });

        applyModalClose.addEventListener('click', function() {
            applyModal.classList.remove('active');
        });

        applyModal.addEventListener('click', function(e) {
            if (e.target === applyModal) applyModal.classList.remove('active');
        });

        applySubmitBtn.addEventListener('click', function() {
            var name = document.getElementById('applyName').value.trim();
            var contact = document.getElementById('applyContact').value.trim();
            if (!name) { showToast('请输入姓名'); return; }
            if (!contact) { showToast('请输入联系方式'); return; }

            // 模拟提交
            applySubmitBtn.disabled = true;
            applySubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';

            setTimeout(function() {
                applySubmitBtn.disabled = false;
                applySubmitBtn.innerHTML = '<i class="fas fa-check"></i> 提交申请';
                applyModal.classList.remove('active');
                showToast('申请提交成功，请等待发布人联系！');
                console.log('[兼职详情] 申请提交:', { name: name, contact: contact });

                // 更新按钮状态
                applyBtn.innerHTML = '<i class="fas fa-check"></i> 已申请';
                applyBtn.classList.add('applied');
                applyBtn.disabled = true;
            }, 1500);
        });
    }

    /* ============================================================
     * Toast 提示
     * ============================================================ */
    function showToast(msg) {
        var toast = document.getElementById('ptToast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 3000);
    }

    /* ============================================================
     * 初始化
     * ============================================================ */
    function init() {
        renderDetail();
        initBackBtn();
        initShareBtn();
        initApplyBtn();
        console.log('[兼职详情] 页面初始化完成');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
