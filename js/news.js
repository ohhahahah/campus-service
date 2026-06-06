(function() {
    var newsData = [
        { id: 'n1', title: '关于2026年秋季学期选课的通知', cat: '教务通知', icon: 'fa-graduation-cap', date: '2026-05-20', author: '教务处', pinned: true, summary: '2026年秋季学期选课将于6月1日开始，请各位同学提前了解选课规则和时间安排。', content: '<p>各位同学：</p><p>2026年秋季学期选课工作即将开始，现将有关事项通知如下：</p><p><strong>一、选课时间</strong></p><p>第一轮选课：2026年6月1日-6月5日<br>第二轮选课：2026年6月8日-6月12日<br>补退选：2026年6月15日-6月19日</p><p><strong>二、选课规则</strong></p><p>1. 每位学生每学期修读学分不得低于15学分，不得高于28学分。<br>2. 选课采用志愿优先、随机抽取的规则。<br>3. 选课前请务必完成学业评价。</p><p><strong>三、注意事项</strong></p><p>1. 请提前与导师沟通，制定合理的选课计划。<br>2. 选课系统开放期间请及时操作，逾期不予补选。<br>3. 如有疑问请联系教务处。</p>' },
        { id: 'n2', title: '2026年暑期校园安全提示', cat: '安全提示', icon: 'fa-shield-alt', date: '2026-05-19', author: '保卫处', pinned: true, summary: '暑期将至，请同学们注意人身安全、财产安全，谨防各类诈骗。', content: '<p>各位同学：</p><p>暑期将至，为保障大家的人身和财产安全，特此提醒：</p><p><strong>一、防诈骗</strong></p><p>1. 不轻信陌生来电和短信，不点击不明链接。<br>2. 不向陌生人转账汇款，不泄露个人身份信息。<br>3. 遇到可疑情况及时报警。</p><p><strong>二、宿舍安全</strong></p><p>1. 离校前检查宿舍门窗、水电是否关闭。<br>2. 贵重物品妥善保管或带走。<br>3. 留校同学遵守宿舍管理规定。</p><p><strong>三、出行安全</strong></p><p>1. 注意交通安全，不乘坐非法运营车辆。<br>2. 游泳请到正规场所，不要野泳。<br>3. 外出告知家人行程。</p>' },
        { id: 'n3', title: '食堂二楼改造升级公告', cat: '后勤公告', icon: 'fa-utensils', date: '2026-05-18', author: '后勤处', pinned: true, summary: '食堂二楼将于5月25日起进行改造升级，预计8月底完工。', content: '<p>各位师生：</p><p>为提升就餐环境和服务质量，食堂二楼将于2026年5月25日起进行改造升级，现将有关事项公告如下：</p><p><strong>一、改造时间</strong></p><p>2026年5月25日 - 2026年8月31日</p><p><strong>二、改造内容</strong></p><p>1. 餐厅环境全面翻新<br>2. 新增特色餐饮窗口<br>3. 升级空调通风系统<br>4. 增设自助结算通道</p><p><strong>三、就餐安排</strong></p><p>改造期间，食堂一楼正常营业，并延长营业时间至21:00。同时在校内增设临时餐饮点。</p><p>给您带来不便，敬请谅解！</p>' },
        { id: 'n4', title: '第十二届校园文化艺术节即将开幕', cat: '校园活动', icon: 'fa-theater-masks', date: '2026-05-17', author: '团委', pinned: false, summary: '校园文化艺术节将于6月5日开幕，持续两周，涵盖文艺演出、书画展览、才艺大赛等。', content: '<p>第十二届校园文化艺术节将于2026年6月5日正式开幕！</p><p>本届艺术节以"青春绽放·梦想启航"为主题，为期两周，精彩纷呈：</p><p>1. 开幕式文艺晚会 - 6月5日 19:00 学生活动中心<br>2. 书画摄影展 - 6月6日-6月15日 图书馆一楼<br>3. 校园歌手大赛 - 6月8日 19:00 体育馆<br>4. 话剧展演 - 6月10日 19:00 学生活动中心<br>5. 闭幕式暨颁奖晚会 - 6月19日 19:00 体育馆</p><p>欢迎广大师生积极参与！</p>' },
        { id: 'n5', title: '四六级考试报名通知', cat: '教务通知', icon: 'fa-file-alt', date: '2026-05-16', author: '教务处', pinned: false, summary: '2026年6月大学英语四六级考试报名即将开始，请同学们及时报名。', content: '<p>2026年6月大学英语四六级考试报名通知：</p><p>报名时间：2026年5月20日-5月30日<br>考试时间：2026年6月14日<br>报名方式：登录教务系统在线报名<br>考试费用：四级30元，六级30元</p><p>请同学们抓紧时间报名，逾期不再补报。</p>' },
        { id: 'n6', title: '编程社团招新啦', cat: '社团活动', icon: 'fa-code', date: '2026-05-15', author: '编程社团', pinned: false, summary: '编程社团面向全校招新，无论你是零基础还是大神，都欢迎加入！', content: '<p>编程社团2026年招新开始啦！</p><p>我们提供：<br>1. 每周技术分享会<br>2. 项目实战机会<br>3. 编程竞赛辅导<br>4. 优秀学长学姐指导</p><p>无论你是零基础小白还是编程大神，我们都欢迎！</p><p>报名方式：扫描社团二维码或前往社团招新摊位</p>' },
        { id: 'n7', title: '校园网络升级维护通知', cat: '后勤公告', icon: 'fa-wifi', date: '2026-05-14', author: '信息中心', pinned: false, summary: '校园网络将于本周末进行升级维护，届时部分区域网络可能中断。', content: '<p>为提升校园网络质量，信息中心将于2026年5月17日（周六）0:00-6:00进行网络升级维护。</p><p>维护期间，以下区域网络可能中断：<br>1. 教学楼A、B座<br>2. 图书馆<br>3. 学生宿舍1-5号楼</p><p>请提前做好相关准备，给您带来不便敬请谅解。</p>' },
        { id: 'n8', title: '校运会志愿者招募', cat: '校园活动', icon: 'fa-hands-helping', date: '2026-05-13', author: '志愿者协会', pinned: false, summary: '第25届校运会将于6月举行，现面向全校招募志愿者200名。', content: '<p>第25届校运会志愿者招募！</p><p>校运会时间：2026年6月20日-6月22日<br>招募人数：200名<br>服务内容：赛事辅助、秩序维护、后勤保障等</p><p>志愿者福利：<br>1. 志愿服务时长认证<br>2. 志愿者纪念证书<br>3. 工作餐及饮用水</p><p>报名截止：2026年6月1日</p>' },
        { id: 'n9', title: '期末考试安排公布', cat: '教务通知', icon: 'fa-calendar-check', date: '2026-05-12', author: '教务处', pinned: false, summary: '2026年春季学期期末考试安排已公布，请同学们查看考试时间和地点。', content: '<p>2026年春季学期期末考试安排已公布。</p><p>考试时间：2026年6月25日-7月5日<br>查询方式：登录教务系统查看个人考试安排</p><p>注意事项：<br>1. 请携带学生证和身份证参加考试<br>2. 提前15分钟进入考场<br>3. 严格遵守考试纪律</p>' },
        { id: 'n10', title: '校园摄影大赛作品征集', cat: '社团活动', icon: 'fa-camera', date: '2026-05-11', author: '摄影协会', pinned: false, summary: '第五届校园摄影大赛开始征稿，主题为"最美校园"，欢迎投稿。', content: '<p>第五届校园摄影大赛征稿启事：</p><p>主题：最美校园<br>征稿时间：2026年5月11日-6月11日<br>作品要求：原创摄影作品，不限器材，每人限投3幅</p><p>奖项设置：<br>一等奖1名：奖金1000元+证书<br>二等奖3名：奖金500元+证书<br>三等奖5名：奖金200元+证书</p><p>投稿邮箱：photo@campus.edu</p>' },
        { id: 'n11', title: '我校学生在全国数学建模竞赛中获佳绩', cat: '新闻动态', icon: 'fa-trophy', date: '2026-05-10', author: '宣传部', pinned: false, summary: '我校3支队伍在全国大学生数学建模竞赛中荣获一等奖2项、二等奖1项。', content: '<p>在刚刚结束的2026年全国大学生数学建模竞赛中，我校代表队再创佳绩！</p><p>由数学学院张教授指导的3支参赛队伍，经过激烈角逐，荣获全国一等奖2项、全国二等奖1项。</p><p>获奖团队：<br>一等奖：李明团队、王芳团队<br>二等奖：赵强团队</p><p>向获奖同学和指导教师表示热烈祝贺！</p>' },
        { id: 'n12', title: '心理健康教育中心开放预约', cat: '校园活动', icon: 'fa-heart', date: '2026-05-09', author: '心理中心', pinned: false, summary: '心理健康教育中心提供免费心理咨询服务，欢迎同学们预约。', content: '<p>心理健康教育中心持续为全校学生提供免费心理咨询服务。</p><p>服务内容：<br>1. 个体心理咨询<br>2. 团体心理辅导<br>3. 心理测评<br>4. 危机干预</p><p>预约方式：<br>1. 线上预约：登录心理中心系统<br>2. 电话预约：010-12345678<br>3. 现场预约：心理健康教育中心（学生活动中心3楼）</p><p>咨询时间：周一至周五 9:00-17:00</p>' }
    ];

    var currentCat = 'all';
    var currentSearch = '';

    function init() {
        renderPinned();
        renderNews();
        initFilters();
        initSearch();
        initModal();
    }

    function renderPinned() {
        var list = document.getElementById('pinnedList');
        var pinned = newsData.filter(function(n) { return n.pinned; });
        list.innerHTML = pinned.map(function(n) {
            return '<div class="nw-pinned-card" data-id="' + n.id + '"><div class="nw-pinned-icon cat-' + n.cat + '"><i class="fas ' + n.icon + '"></i></div><div class="nw-pinned-info"><h4>' + n.title + '</h4><p>' + n.summary + '</p></div><span class="nw-pinned-badge">置顶</span></div>';
        }).join('');
        list.querySelectorAll('.nw-pinned-card').forEach(function(card) {
            card.addEventListener('click', function() { showDetail(card.getAttribute('data-id')); });
        });
    }

    function renderNews() {
        var list = document.getElementById('newsList');
        var empty = document.getElementById('emptyState');
        var filtered = newsData.filter(function(n) {
            var catMatch = currentCat === 'all' || n.cat === currentCat;
            var searchMatch = !currentSearch || n.title.indexOf(currentSearch) > -1 || n.summary.indexOf(currentSearch) > -1;
            return catMatch && searchMatch;
        });
        if (filtered.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';
        list.innerHTML = filtered.map(function(n) {
            return '<div class="nw-news-card" data-id="' + n.id + '"><div class="nw-news-icon cat-' + n.cat + '"><i class="fas ' + n.icon + '"></i></div><div class="nw-news-info"><h4>' + n.title + '</h4><p>' + n.summary + '</p><div class="nw-news-meta"><span><i class="fas fa-calendar"></i> ' + n.date + '</span><span><i class="fas fa-user"></i> ' + n.author + '</span></div></div><span class="nw-news-tag cat-' + n.cat + '">' + n.cat + '</span></div>';
        }).join('');
        list.querySelectorAll('.nw-news-card').forEach(function(card) {
            card.addEventListener('click', function() { showDetail(card.getAttribute('data-id')); });
        });
    }

    function initFilters() {
        document.querySelectorAll('.nw-filter').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.nw-filter').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentCat = btn.getAttribute('data-cat');
                renderNews();
            });
        });
    }

    function initSearch() {
        document.getElementById('searchBtn').addEventListener('click', function() {
            currentSearch = document.getElementById('searchInput').value.trim();
            renderNews();
        });
        document.getElementById('searchInput').addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                currentSearch = this.value.trim();
                renderNews();
            }
        });
    }

    function showDetail(id) {
        var news = newsData.find(function(n) { return n.id === id; });
        if (!news) return;
        document.getElementById('modalTitle').textContent = news.title;
        document.getElementById('modalBody').innerHTML = '<div class="nw-detail-meta"><span><i class="fas fa-calendar"></i> ' + news.date + '</span><span><i class="fas fa-user"></i> ' + news.author + '</span><span><i class="fas fa-tag"></i> ' + news.cat + '</span></div><div class="nw-detail-content">' + news.content + '</div>';
        document.getElementById('detailModal').classList.add('active');
    }

    function initModal() {
        document.getElementById('closeModal').addEventListener('click', function() {
            document.getElementById('detailModal').classList.remove('active');
        });
        document.getElementById('detailModal').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
