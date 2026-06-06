/* ============================================================
 * 考试-官方链接映射配置表
 * 新增考试时只需在此处添加映射项即可，无需修改其他代码
 * 每项格式：keywords 为匹配关键词数组，regUrl 为报名链接，
 *           printUrl 为准考证打印链接，scoreUrl 为成绩查询链接
 * ============================================================ */
var EXAM_URL_MAP = [
    {
        name: '英语四级 / CET-4',
        keywords: ['四级', 'CET-4', 'cet-4', '英语四级'],
        regUrl: 'https://cet-bm.neea.edu.cn/',
        printUrl: 'https://cet-bm.neea.edu.cn/',
        scoreUrl: 'https://cet.neea.edu.cn/'
    },
    {
        name: '英语六级 / CET-6',
        keywords: ['六级', 'CET-6', 'cet-6', '英语六级'],
        regUrl: 'https://cet-bm.neea.edu.cn/',
        printUrl: 'https://cet-bm.neea.edu.cn/',
        scoreUrl: 'https://cet.neea.edu.cn/'
    },
    {
        name: '计算机二级',
        keywords: ['计算机二级', 'NCRE', 'ncre'],
        regUrl: 'https://ncre-bm.neea.edu.cn/',
        printUrl: 'https://ncre-bm.neea.edu.cn/',
        scoreUrl: 'https://ncre.neea.edu.cn/'
    },
    {
        name: '雅思',
        keywords: ['雅思', 'IELTS', 'ielts'],
        regUrl: 'https://ielts.neea.cn/',
        printUrl: 'https://ielts.neea.cn/',
        scoreUrl: 'https://ielts.neea.cn/'
    },
    {
        name: '托福',
        keywords: ['托福', 'TOEFL', 'toefl'],
        regUrl: 'https://toefl.neea.cn/',
        printUrl: 'https://toefl.neea.cn/',
        scoreUrl: 'https://toefl.neea.cn/'
    },
    {
        name: '日语N1/N2',
        keywords: ['日语', 'JLPT', 'jlpt', 'N1', 'N2'],
        regUrl: 'https://jlpt.neea.edu.cn/',
        printUrl: 'https://jlpt.neea.edu.cn/',
        scoreUrl: 'https://jlpt.neea.edu.cn/'
    },
    {
        name: '教师资格证',
        keywords: ['教资', '教师资格', 'NTCE', 'ntce'],
        regUrl: 'https://ntce.neea.edu.cn/',
        printUrl: 'https://ntce.neea.edu.cn/',
        scoreUrl: 'https://ntce.neea.edu.cn/'
    },
    {
        name: '普通话等级',
        keywords: ['普通话'],
        regUrl: 'https://bm.cltt.org/',
        printUrl: 'https://bm.cltt.org/',
        scoreUrl: 'https://bm.cltt.org/'
    },
    {
        name: '会计初级',
        keywords: ['会计', '初级会计', '会计初级'],
        regUrl: 'https://kzp.mof.gov.cn/',
        printUrl: 'https://kzp.mof.gov.cn/',
        scoreUrl: 'https://kzp.mof.gov.cn/'
    },
    {
        name: '证券从业',
        keywords: ['证券从业', '证券'],
        regUrl: 'https://www.sac.net.cn/',
        printUrl: 'https://www.sac.net.cn/',
        scoreUrl: 'https://www.sac.net.cn/'
    },
    {
        name: '银行从业',
        keywords: ['银行从业', '银行'],
        regUrl: 'https://www.china-cba.net/',
        printUrl: 'https://www.china-cba.net/',
        scoreUrl: 'https://www.china-cba.net/'
    },
    {
        name: '法律职业资格',
        keywords: ['法律职业', '法考', '司法考试'],
        regUrl: 'https://lawtest.moj.gov.cn/',
        printUrl: 'https://lawtest.moj.gov.cn/',
        scoreUrl: 'https://lawtest.moj.gov.cn/'
    }
];

/* 根据考试名称匹配官方链接，返回 { regUrl, printUrl, scoreUrl } 或 null */
function getExamUrls(examName) {
    if (!examName) return null;
    for (var i = 0; i < EXAM_URL_MAP.length; i++) {
        var entry = EXAM_URL_MAP[i];
        for (var j = 0; j < entry.keywords.length; j++) {
            if (examName.indexOf(entry.keywords[j]) !== -1) {
                return { regUrl: entry.regUrl, printUrl: entry.printUrl, scoreUrl: entry.scoreUrl };
            }
        }
    }
    return null;
}

/* 通用报名跳转函数：根据考试名称在新标签页打开官方报名网站 */
function goToEnroll(examName) {
    var urls = getExamUrls(examName);
    if (urls && urls.regUrl) {
        window.open(urls.regUrl, '_blank');
    } else {
        showToast('该考试报名链接暂未配置，请联系管理员');
    }
}

/* 通用准考证打印跳转函数 */
function goToPrintAdmission(examName) {
    var urls = getExamUrls(examName);
    if (urls && urls.printUrl) {
        window.open(urls.printUrl, '_blank');
    } else {
        showToast('该考试准考证打印链接暂未配置，请联系管理员');
    }
}

/* 通用成绩查询跳转函数 */
function goToScoreQuery(examName) {
    var urls = getExamUrls(examName);
    if (urls && urls.scoreUrl) {
        window.open(urls.scoreUrl, '_blank');
    } else {
        showToast('该考试成绩查询链接暂未配置，请联系管理员');
    }
}

/* ============================================================
 * 全局报名按钮自动绑定
 * 扫描页面中所有包含"报名"字样的按钮，自动匹配考试名称并绑定跳转
 * 使用 data-enroll-bound 标记防止重复绑定
 * ============================================================ */
function bindEnrollButtons() {
    var buttons = document.querySelectorAll('button, a');
    buttons.forEach(function(btn) {
        var text = (btn.textContent || '').trim();
        if (text.indexOf('报名') === -1) return;
        if (btn.getAttribute('data-enroll-bound')) return;
        if (btn.classList.contains('disabled')) return;
        if (btn.disabled) return;

        btn.setAttribute('data-enroll-bound', 'true');

        var examName = findExamNameFromCard(btn);
        if (!examName) return;

        var urls = getExamUrls(examName);
        if (!urls) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showToast('该考试报名链接暂未配置，请联系管理员');
            });
            return;
        }

        if (btn.tagName === 'A') {
            btn.setAttribute('href', urls.regUrl);
            btn.setAttribute('target', '_blank');
        } else {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(urls.regUrl, '_blank');
            });
        }
    });
}

/* 从按钮向上查找所属卡片的考试名称 */
function findExamNameFromCard(btn) {
    var el = btn;
    for (var i = 0; i < 6; i++) {
        el = el.parentElement;
        if (!el) return null;
        var h4 = el.querySelector('h4');
        if (h4) return h4.textContent.trim();
    }
    return null;
}

/* ============================================================
 * 页面初始化
 * ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
    var tabBtns = document.querySelectorAll('.edu-tab');
    var tabContents = document.querySelectorAll('.edu-tab-content');

    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tabId = this.dataset.tab;
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            tabContents.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    animateStats();
    renderSchedule();
    renderTodayCourses();
    renderScoreTable();
    renderScoreChart();
    renderAdjustList();
    renderExamNotices();
    renderCertList();
    renderCertRecords();
    renderExamTimeline();
    initWeekNav();
    initModal();
    initForms();
    initCertCategories();
    bindEnrollButtons();
});

function showToast(msg) {
    var toast = document.getElementById('eduToast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2500);
}

function animateStats() {
    var nums = document.querySelectorAll('.edu-stat-num');
    nums.forEach(function(el) {
        var target = parseInt(el.dataset.target);
        var current = 0;
        var step = Math.ceil(target / 60);
        var timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current;
        }, 30);
    });
}

var scheduleData = {
    days: ['周一', '周二', '周三', '周四', '周五'],
    times: ['1-2节 08:00', '3-4节 10:00', '5-6节 14:00', '7-8节 16:00', '9-10节 19:00'],
    courses: [
        [{ name: '高等数学', room: 'A-302', type: 'required' }, null, { name: '高等数学', room: 'A-302', type: 'required' }, null, null],
        [{ name: '大学英语', room: '语音室201', type: 'required' }, null, null, { name: '大学英语', room: '语音室201', type: 'required' }, null],
        [null, { name: '大学物理', room: '物理楼101', type: 'required' }, { name: '数据结构', room: 'B-205', type: 'required' }, { name: '数据结构', room: 'B-205', type: 'required' }, null],
        [null, { name: '体育课', room: '体育馆', type: 'pe' }, { name: '实验课', room: 'C-301', type: 'lab' }, null, { name: '选修课', room: 'C-203', type: 'elective' }],
        [null, null, null, { name: 'Python编程', room: 'D-102', type: 'elective' }, null]
    ]
};

function renderSchedule() {
    var grid = document.getElementById('scheduleGrid');
    grid.innerHTML = '';
    var emptyCell = document.createElement('div');
    emptyCell.className = 'edu-time-header';
    emptyCell.textContent = '时间';
    grid.appendChild(emptyCell);

    scheduleData.days.forEach(function(day) {
        var dh = document.createElement('div');
        dh.className = 'edu-day-header';
        dh.textContent = day;
        grid.appendChild(dh);
    });

    scheduleData.times.forEach(function(time, ti) {
        var ts = document.createElement('div');
        ts.className = 'edu-time-slot';
        ts.textContent = time;
        grid.appendChild(ts);

        scheduleData.days.forEach(function(day, di) {
            var course = scheduleData.courses[ti][di];
            if (course) {
                var block = document.createElement('div');
                block.className = 'edu-course-block ' + course.type;
                block.innerHTML = '<span class="edu-course-name">' + course.name + '</span><span class="edu-course-room">' + course.room + '</span>';
                block.addEventListener('click', function() {
                    showCourseDetail(course);
                });
                grid.appendChild(block);
            } else {
                var empty = document.createElement('div');
                empty.className = 'edu-time-slot';
                grid.appendChild(empty);
            }
        });
    });
}

function showCourseDetail(course) {
    var modal = document.getElementById('courseDetailModal');
    document.getElementById('modalTitle').textContent = course.name;
    var typeMap = { required: '必修课', elective: '选修课', lab: '实验课', pe: '体育课' };
    document.getElementById('modalBody').innerHTML =
        '<div class="edu-detail-row"><span class="edu-detail-label">课程名称</span><span class="edu-detail-value">' + course.name + '</span></div>' +
        '<div class="edu-detail-row"><span class="edu-detail-label">课程类型</span><span class="edu-detail-value">' + (typeMap[course.type] || '其他') + '</span></div>' +
        '<div class="edu-detail-row"><span class="edu-detail-label">上课地点</span><span class="edu-detail-value">' + course.room + '</span></div>' +
        '<div class="edu-detail-row"><span class="edu-detail-label">授课教师</span><span class="edu-detail-value">张教授</span></div>' +
        '<div class="edu-detail-row"><span class="edu-detail-label">学分</span><span class="edu-detail-value">4学分</span></div>' +
        '<div class="edu-detail-row"><span class="edu-detail-label">考核方式</span><span class="edu-detail-value">考试</span></div>';
    modal.classList.add('active');
}

function renderTodayCourses() {
    var list = document.getElementById('todayCourses');
    var todayData = [
        { time: '08:00-09:40', name: '高等数学', room: '教学楼A-302', teacher: '张教授' },
        { time: '10:00-11:40', name: '大学英语', room: '语音室201', teacher: '李老师' },
        { time: '14:00-15:40', name: '数据结构', room: '计算机楼B-205', teacher: '王教授' },
        { time: '19:00-20:40', name: 'Python编程', room: '教学楼D-102', teacher: '赵老师' }
    ];
    todayData.forEach(function(c) {
        var item = document.createElement('div');
        item.className = 'edu-today-item';
        item.innerHTML = '<div class="edu-today-time">' + c.time + '</div><div class="edu-today-info"><h4>' + c.name + '</h4><p>' + c.room + ' · ' + c.teacher + '</p></div>';
        list.appendChild(item);
    });
}

var scoreData = [
    { name: '高等数学', credit: 6, score: 92, gpa: 4.0, method: '考试', status: 'excellent' },
    { name: '大学英语', credit: 4, score: 88, gpa: 3.7, method: '考试', status: 'excellent' },
    { name: '数据结构', credit: 4, score: 95, gpa: 4.0, method: '考试', status: 'excellent' },
    { name: '大学物理', credit: 4, score: 85, gpa: 3.5, method: '考试', status: 'pass' },
    { name: '思想道德修养', credit: 3, score: 90, gpa: 3.9, method: '考查', status: 'excellent' },
    { name: 'Python编程', credit: 3, score: 78, gpa: 3.0, method: '考查', status: 'pass' },
    { name: '体育', credit: 2, score: 82, gpa: 3.3, method: '考查', status: 'pass' },
    { name: '实验课', credit: 2, score: 88, gpa: 3.7, method: '考查', status: 'excellent' }
];

function renderScoreTable() {
    var tbody = document.getElementById('scoreTableBody');
    tbody.innerHTML = '';
    var statusMap = { excellent: '优秀', pass: '通过', fail: '未通过' };
    scoreData.forEach(function(s) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + s.name + '</td><td>' + s.credit + '</td><td>' + s.score + '</td><td>' + s.gpa + '</td><td>' + s.method + '</td><td><span class="edu-score-status ' + s.status + '">' + statusMap[s.status] + '</span></td>';
        tbody.appendChild(tr);
    });
}

function renderScoreChart() {
    var ctx = document.getElementById('scoreChart');
    if (!ctx) return;
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: scoreData.map(function(s) { return s.name; }),
            datasets: [{
                label: '成绩',
                data: scoreData.map(function(s) { return s.score; }),
                backgroundColor: 'rgba(59,130,246,0.6)',
                borderColor: '#3b82f6',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

var adjustData = [
    { type: 'change', title: '高等数学调课通知', from: '周一1-2节', to: '周三3-4节', teacher: '张教授', reason: '出差参加学术会议', date: '2026-05-20' },
    { type: 'cancel', title: '大学英语停课通知', from: '周二3-4节', to: '停课一次', teacher: '李老师', reason: '教师身体不适', date: '2026-05-21' },
    { type: 'add', title: '数据结构补课通知', from: '新增', to: '周六5-6节', teacher: '王教授', reason: '补上周缺席课程', date: '2026-05-24' },
    { type: 'change', title: '大学物理教室调整', from: '物理楼101', to: '物理楼203', teacher: '刘教授', reason: '教室设备维修', date: '2026-05-22' },
    { type: 'add', title: '实验课加课通知', from: '新增', to: '周日2-4节', teacher: '陈老师', reason: '实验进度需要', date: '2026-05-25' }
];

function renderAdjustList() {
    var list = document.getElementById('adjustList');
    list.innerHTML = '';
    var iconMap = { change: 'fa-exchange-alt', cancel: 'fa-times-circle', add: 'fa-plus-circle' };
    var tagMap = { change: '调课', cancel: '停课', add: '补课' };
    adjustData.forEach(function(a) {
        var card = document.createElement('div');
        card.className = 'edu-adjust-card';
        card.innerHTML = '<div class="edu-adjust-icon ' + a.type + '"><i class="fas ' + iconMap[a.type] + '"></i></div>' +
            '<div class="edu-adjust-info"><h4>' + a.title + '</h4>' +
            '<p><i class="fas fa-user"></i> ' + a.teacher + ' · <i class="fas fa-calendar"></i> ' + a.date + '</p>' +
            '<p>原安排：' + a.from + ' → 调整为：' + a.to + '</p>' +
            '<p>原因：' + a.reason + '</p>' +
            '<span class="edu-adjust-tag ' + a.type + '">' + tagMap[a.type] + '</span></div>';
        list.appendChild(card);
    });
}

var examNoticeData = [
    {
        id: 1,
        title: '2026年上半年CET-4/6报名通知',
        time: '2026-03-15',
        source: '教育部考试中心',
        type: 'registration',
        summary: '2026年上半年全国大学英语四、六级考试报名工作即将启动，请同学们关注报名时间节点。',
        content: '各位同学：\n\n2026年上半年全国大学英语四、六级考试（CET）报名工作即将启动，现将有关事项通知如下：\n\n一、报名时间\n2026年3月20日9:00至4月10日17:00\n\n二、考试时间\n笔试：2026年6月14日\n口试：2026年5月23日-24日\n\n三、报名方式\n登录全国大学英语四、六级考试报名网（cet-bm.neea.edu.cn）进行网上报名。\n\n四、注意事项\n1. 请务必在规定时间内完成报名，逾期不再补报。\n2. 报名前请确认学籍信息是否正确。\n3. 报名成功后请及时缴费，未缴费视为报名无效。'
    },
    {
        id: 2,
        title: '2026年计算机二级考试报名时间调整',
        time: '2026-04-02',
        source: '教育部考试中心',
        type: 'adjust',
        summary: '因系统升级，2026年9月全国计算机等级考试报名时间调整为6月1日至6月30日。',
        content: '各位同学：\n\n因全国计算机等级考试报名系统升级维护，2026年9月全国计算机等级考试报名时间调整如下：\n\n原定报名时间：6月15日-6月30日\n调整后报名时间：6月1日9:00 - 6月30日24:00\n\n考试时间不变，仍为2026年9月第3个周末。\n\n请同学们合理安排报名时间，避免在截止日集中报名造成系统拥堵。如有疑问，请联系教务处考试中心。'
    },
    {
        id: 3,
        title: '2025年下半年CET-4/6成绩已开放查询',
        time: '2026-02-25',
        source: '教育部考试中心',
        type: 'score',
        summary: '2025年下半年全国大学英语四、六级考试成绩已于2月25日开放查询，请同学们及时查看。',
        content: '各位同学：\n\n2025年下半年全国大学英语四、六级考试（CET）成绩已于2026年2月25日上午9:00开放查询。\n\n查询方式：\n1. 登录中国教育考试网（cet.neea.edu.cn）查询成绩\n2. 也可通过学信网（chsi.com.cn）查询\n\n成绩报告单：\n电子成绩报告单将于3月1日起可登录中国教育考试网免费下载。\n\n如对成绩有异议，请于3月10日前向教务处提交成绩复核申请。'
    },
    {
        id: 4,
        title: '2026年上半年教师资格证笔试公告',
        time: '2026-01-10',
        source: '省教育考试院',
        type: 'registration',
        summary: '2026年上半年中小学教师资格考试笔试将于3月8日举行，报名时间为1月12日-15日。',
        content: '各位考生：\n\n2026年上半年中小学教师资格考试（笔试）将于3月8日举行，现将报名有关事项公告如下：\n\n一、网上报名\n时间：2026年1月12日-15日\n网址：ntce.neea.edu.cn\n\n二、网上审核\n时间：2026年1月12日-16日\n\n三、网上缴费\n截止时间：2026年1月17日24:00\n\n四、准考证打印\n2026年3月3日-8日\n\n五、考试时间\n2026年3月8日\n\n请考生务必在规定时间内完成报名、审核和缴费，逾期不再办理。'
    },
    {
        id: 5,
        title: '2026年CET-4/6准考证打印通知',
        time: '2026-05-28',
        source: '教育部考试中心',
        type: 'ticket',
        summary: '2026年上半年CET-4/6准考证打印已开放，请考生于6月14日前完成打印。',
        content: '各位考生：\n\n2026年上半年全国大学英语四、六级考试准考证打印功能已开放。\n\n打印时间：2026年5月28日 - 6月14日\n打印网址：cet-bm.neea.edu.cn\n\n注意事项：\n1. 请使用A4纸打印准考证，黑白彩色均可。\n2. 准考证正反面均不得涂改或书写。\n3. 考试时须携带准考证和有效身份证件。\n4. 请提前核对考试时间、地点，合理安排出行。'
    },
    {
        id: 6,
        title: '会计初级职称考试延期通知',
        time: '2026-04-20',
        source: '财政部会计资格评价中心',
        type: 'delay',
        summary: '因特殊情况，2026年度会计专业技术初级资格考试由5月延期至6月举行。',
        content: '各位考生：\n\n因特殊情况，经研究决定，2026年度全国会计专业技术初级资格考试时间调整如下：\n\n原定考试时间：2026年5月10日-14日\n调整后考试时间：2026年6月14日-18日\n\n准考证打印时间相应调整为：6月1日-13日\n\n请各位考生合理安排备考时间，关注财政部会计资格评价中心官网（kzp.mof.gov.cn）获取最新信息。由此带来的不便，敬请谅解。'
    }
];

function renderExamNotices() {
    var list = document.getElementById('examNoticeList');
    if (!list) return;
    list.innerHTML = '';
    var typeMap = { registration: '报名通知', adjust: '时间调整', score: '成绩发布', ticket: '准考证打印', delay: '考试延期' };
    var typeClass = { registration: 'notice-reg', adjust: 'notice-adjust', score: 'notice-score', ticket: 'notice-ticket', delay: 'notice-delay' };

    examNoticeData.forEach(function(n) {
        var card = document.createElement('div');
        card.className = 'edu-notice-card';
        card.innerHTML = '<div class="edu-notice-badge ' + typeClass[n.type] + '">' + typeMap[n.type] + '</div>' +
            '<div class="edu-notice-body">' +
            '<h4>' + n.title + '</h4>' +
            '<p>' + n.summary + '</p>' +
            '<div class="edu-notice-meta">' +
            '<span><i class="fas fa-clock"></i> ' + n.time + '</span>' +
            '<span><i class="fas fa-building"></i> ' + n.source + '</span>' +
            '</div></div>' +
            '<button class="edu-notice-detail-btn" data-id="' + n.id + '"><i class="fas fa-arrow-right"></i> 查看详情</button>';
        list.appendChild(card);
    });

    list.querySelectorAll('.edu-notice-detail-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = parseInt(this.getAttribute('data-id'));
            var notice = examNoticeData.find(function(n) { return n.id === id; });
            if (notice) showNoticeDetail(notice);
        });
    });
}

function showNoticeDetail(notice) {
    var modal = document.getElementById('noticeDetailModal');
    document.getElementById('noticeModalTitle').textContent = notice.title;
    var typeMap = { registration: '报名通知', adjust: '时间调整', score: '成绩发布', ticket: '准考证打印', delay: '考试延期' };
    var contentHtml = '<div class="edu-notice-detail-meta">' +
        '<span><i class="fas fa-clock"></i> 发布时间：' + notice.time + '</span>' +
        '<span><i class="fas fa-building"></i> 来源：' + notice.source + '</span>' +
        '<span class="edu-notice-detail-type">' + typeMap[notice.type] + '</span>' +
        '</div>' +
        '<div class="edu-notice-detail-content">' + notice.content.replace(/\n/g, '<br>') + '</div>';
    document.getElementById('noticeModalBody').innerHTML = contentHtml;
    modal.classList.add('active');
}

/* ============================================================
 * 证书考试数据（URL 通过 getExamUrls 从 EXAM_URL_MAP 自动匹配）
 * ============================================================ */
var certData = [
    { name: 'CET-4 英语四级', cat: 'language', date: '2026年6月14日', deadline: '2026年4月10日', fee: '¥30', status: 'open' },
    { name: 'CET-6 英语六级', cat: 'language', date: '2026年6月14日', deadline: '2026年4月10日', fee: '¥30', status: 'open' },
    { name: '雅思', cat: 'language', date: '2026年7月-12月', deadline: '考前19天截止', fee: '¥2170', status: 'open' },
    { name: '托福', cat: 'language', date: '2026年全年可选', deadline: '考前7天截止', fee: '¥2100', status: 'open' },
    { name: '日语N1/N2', cat: 'language', date: '2026年7月/12月', deadline: '2026年3月/9月', fee: '¥550', status: 'soon' },
    { name: '计算机二级（Python）', cat: 'computer', date: '2026年9月', deadline: '2026年6月30日', fee: '¥80', status: 'soon' },
    { name: '计算机二级（Office）', cat: 'computer', date: '2026年9月', deadline: '2026年6月30日', fee: '¥80', status: 'soon' },
    { name: '教师资格证（小学）', cat: 'teacher', date: '2026年10月', deadline: '2026年7月15日', fee: '¥70', status: 'soon' },
    { name: '教师资格证（中学）', cat: 'teacher', date: '2026年10月', deadline: '2026年7月15日', fee: '¥70', status: 'soon' },
    { name: '普通话等级测试', cat: 'teacher', date: '2026年5月28日', deadline: '2026年5月10日', fee: '¥50', status: 'open' },
    { name: '会计初级职称', cat: 'profession', date: '2026年6月', deadline: '已截止', fee: '¥120', status: 'closed' },
    { name: '证券从业资格', cat: 'profession', date: '2026年7月', deadline: '2026年5月31日', fee: '¥61', status: 'open' },
    { name: '银行从业资格', cat: 'profession', date: '2026年10月', deadline: '2026年8月31日', fee: '¥61', status: 'soon' },
    { name: '法律职业资格', cat: 'profession', date: '2026年9月', deadline: '2026年6月30日', fee: '¥172', status: 'soon' }
];

function renderCertList(filter) {
    var list = document.getElementById('certList');
    list.innerHTML = '';
    var statusMap = { open: '报名中', soon: '即将开始', closed: '已截止' };
    var filtered = filter ? certData.filter(function(c) { return c.cat === filter; }) : certData;
    filtered.forEach(function(c) {
        var urls = getExamUrls(c.name);
        var item = document.createElement('div');
        item.className = 'edu-cert-item';
        var btnHtml;
        if (c.status === 'closed') {
            btnHtml = '<button class="edu-cert-btn disabled">已截止</button>';
        } else if (urls && urls.regUrl) {
            btnHtml = '<button class="edu-cert-btn" data-exam-name="' + c.name + '"><i class="fas fa-external-link-alt"></i> 立即报名</button>';
        } else {
            btnHtml = '<button class="edu-cert-btn" data-exam-name="' + c.name + '"><i class="fas fa-external-link-alt"></i> 立即报名</button>';
        }
        item.innerHTML = '<div class="edu-cert-item-header"><h4>' + c.name + '</h4><span class="edu-cert-status ' + c.status + '">' + statusMap[c.status] + '</span></div>' +
            '<p><i class="fas fa-calendar"></i> 考试时间：' + c.date + '</p>' +
            '<p><i class="fas fa-clock"></i> 报名截止：' + c.deadline + '</p>' +
            '<div class="edu-cert-item-footer"><span class="edu-cert-fee">' + c.fee + '</span>' + btnHtml + '</div>';
        list.appendChild(item);
    });

    list.querySelectorAll('.edu-cert-btn:not(.disabled)').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var examName = this.getAttribute('data-exam-name');
            goToEnroll(examName);
        });
    });
}

function renderCertRecords() {
    var records = document.getElementById('certRecords');
    records.innerHTML = '';
    var myCerts = [
        { name: 'CET-4 英语四级', regTime: '2025年3月', examTime: '2025年6月', status: 'completed', printOpen: false, scoreOut: true },
        { name: '计算机二级（C语言）', regTime: '2025年6月', examTime: '2025年9月', status: 'completed', printOpen: false, scoreOut: true },
        { name: 'CET-6 英语六级', regTime: '2026年3月', examTime: '2026年6月14日', status: 'registered', printOpen: true, scoreOut: false },
        { name: '普通话等级测试', regTime: '2026年4月', examTime: '2026年5月28日', status: 'registered', printOpen: false, scoreOut: false },
        { name: '教师资格证（中学）', regTime: '2026年1月', examTime: '2026年3月8日', status: 'registered', printOpen: false, scoreOut: false },
        { name: '会计初级职称', regTime: '', examTime: '2026年6月', status: 'pending', printOpen: false, scoreOut: false }
    ];

    var statusMap = { completed: '已完成', registered: '已报名', pending: '待报名' };
    var statusClass = { completed: 'passed', registered: 'registered', pending: 'preparing' };
    var iconMap = { completed: 'fa-check-circle', registered: 'fa-clock', pending: 'fa-edit' };

    myCerts.forEach(function(c) {
        var item = document.createElement('div');
        item.className = 'edu-cert-record';

        var actionsHtml = '';
        if (c.status === 'pending') {
            actionsHtml = '<button class="edu-record-action-btn edu-btn-register" data-exam-name="' + c.name + '" data-action="enroll"><i class="fas fa-external-link-alt"></i> 立即报名</button>';
        } else if (c.status === 'registered') {
            if (c.printOpen) {
                actionsHtml += '<button class="edu-record-action-btn edu-btn-print" data-exam-name="' + c.name + '" data-action="print"><i class="fas fa-print"></i> 打印准考证</button>';
            } else {
                actionsHtml += '<button class="edu-record-action-btn edu-btn-print disabled" disabled><i class="fas fa-print"></i> 暂未开放打印</button>';
            }
            if (c.scoreOut) {
                actionsHtml += '<button class="edu-record-action-btn edu-btn-score" data-exam-name="' + c.name + '" data-action="score"><i class="fas fa-search"></i> 查看成绩</button>';
            }
        } else if (c.status === 'completed') {
            actionsHtml += '<button class="edu-record-action-btn edu-btn-score" data-exam-name="' + c.name + '" data-action="score"><i class="fas fa-search"></i> 查看成绩</button>';
        }

        item.innerHTML = '<div class="edu-cert-record-icon"><i class="fas ' + iconMap[c.status] + '"></i></div>' +
            '<div class="edu-cert-record-info">' +
            '<h4>' + c.name + '</h4>' +
            '<p>' + (c.regTime ? '报名时间：' + c.regTime + ' · ' : '') + '考试时间：' + c.examTime + '</p>' +
            '</div>' +
            '<div class="edu-cert-record-right">' +
            '<span class="edu-cert-record-status ' + statusClass[c.status] + '">' + statusMap[c.status] + '</span>' +
            '<div class="edu-record-actions">' + actionsHtml + '</div>' +
            '</div>';
        records.appendChild(item);
    });

    records.querySelectorAll('.edu-record-action-btn:not(.disabled)').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var examName = this.getAttribute('data-exam-name');
            var action = this.getAttribute('data-action');
            if (action === 'enroll') {
                goToEnroll(examName);
            } else if (action === 'print') {
                goToPrintAdmission(examName);
            } else if (action === 'score') {
                goToScoreQuery(examName);
            }
        });
    });
}

function initCertCategories() {
    renderCertList();
    var cats = document.querySelectorAll('.edu-cert-cat');
    cats.forEach(function(cat) {
        cat.addEventListener('click', function() {
            cats.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            renderCertList(this.dataset.cat);
        });
    });
}

var examData = [
    { name: '高等数学（期末）', type: 'final', date: '6月15日', month: '6月', day: '15', time: '09:00-11:00', room: '教学楼A-101', seat: '35号' },
    { name: '大学英语（期末）', type: 'final', date: '6月16日', month: '6月', day: '16', time: '14:00-16:00', room: '语音室101', seat: '12号' },
    { name: '数据结构（期末）', type: 'final', date: '6月18日', month: '6月', day: '18', time: '09:00-11:00', room: '计算机楼B-205', seat: '28号' },
    { name: '大学物理（期末）', type: 'final', date: '6月20日', month: '6月', day: '20', time: '09:00-11:00', room: '物理楼101', seat: '15号' },
    { name: 'Python编程（补考）', type: 'makeup', date: '6月25日', month: '6月', day: '25', time: '14:00-16:00', room: '教学楼D-102', seat: '8号' },
    { name: 'CET-4 英语四级', type: 'level', date: '6月14日', month: '6月', day: '14', time: '09:00-11:20', room: '综合楼301', seat: '22号' }
];

function renderExamTimeline() {
    var timeline = document.getElementById('examTimeline');
    timeline.innerHTML = '';
    var tagMap = { final: '期末考试', makeup: '补考', level: '等级考试' };
    examData.forEach(function(e) {
        var card = document.createElement('div');
        card.className = 'edu-exam-card';
        card.innerHTML = '<div class="edu-exam-date ' + e.type + '"><span class="edu-exam-date-day">' + e.day + '</span><span class="edu-exam-date-month">' + e.month + '</span></div>' +
            '<div class="edu-exam-info"><h4>' + e.name + '</h4>' +
            '<p><i class="fas fa-clock"></i> ' + e.time + '</p>' +
            '<p><i class="fas fa-map-marker-alt"></i> ' + e.room + '</p>' +
            '<p><i class="fas fa-chair"></i> 座位号：' + e.seat + '</p>' +
            '<span class="edu-exam-tag ' + e.type + '">' + tagMap[e.type] + '</span></div>';
        timeline.appendChild(card);
    });
}

function initWeekNav() {
    var weekTitle = document.getElementById('weekTitle');
    var prevWeek = document.getElementById('prevWeek');
    var nextWeek = document.getElementById('nextWeek');
    var currentWeek = 12;
    var weeks = [];
    for (var i = 1; i <= 20; i++) {
        weeks.push('第' + i + '周');
    }

    prevWeek.addEventListener('click', function() {
        currentWeek = currentWeek > 1 ? currentWeek - 1 : 20;
        weekTitle.textContent = weeks[currentWeek - 1] + ' (2026年)';
    });

    nextWeek.addEventListener('click', function() {
        currentWeek = currentWeek < 20 ? currentWeek + 1 : 1;
        weekTitle.textContent = weeks[currentWeek - 1] + ' (2026年)';
    });
}

function initModal() {
    var modal = document.getElementById('courseDetailModal');
    var closeBtn = document.getElementById('closeModal');
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('active');
    });

    var noticeModal = document.getElementById('noticeDetailModal');
    var closeNoticeBtn = document.getElementById('closeNoticeModal');
    closeNoticeBtn.addEventListener('click', function() {
        noticeModal.classList.remove('active');
    });
    noticeModal.addEventListener('click', function(e) {
        if (e.target === noticeModal) noticeModal.classList.remove('active');
    });
}

function initForms() {
    var adjustForm = document.getElementById('adjustForm');
    adjustForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('调课申请已提交，请等待审批');
        this.reset();
    });

    var exportBtn = document.getElementById('exportScore');
    exportBtn.addEventListener('click', function() {
        showToast('成绩单导出中，请稍候...');
    });

    var examType = document.getElementById('examType');
    examType.addEventListener('change', function() {
        var val = this.value;
        var timeline = document.getElementById('examTimeline');
        var cards = timeline.querySelectorAll('.edu-exam-card');
        cards.forEach(function(card) {
            if (val === '全部考试') {
                card.style.display = 'flex';
            } else {
                var tag = card.querySelector('.edu-exam-tag');
                var typeMap = { '期末考试': 'final', '补考': 'makeup', '等级考试': 'level' };
                if (tag.classList.contains(typeMap[val])) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
}
