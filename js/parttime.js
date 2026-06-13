(function() {
    var defaultJobs = [
        { id: 'j1', title: '图书馆管理员助理', cat: '勤工助学', salary: '15元/小时', location: '校内图书馆', time: '周一至周五 14:00-18:00', desc: '协助图书整理、借还书服务、阅览室管理，需耐心细致', contact: '138****1234', icon: 'fa-book', reviewStatus: 'approved', publishTime: '2026-06-08 10:00' },
        { id: 'j2', title: '食堂窗口帮工', cat: '勤工助学', salary: '12元/小时', location: '第一食堂', time: '每日 11:00-13:00', desc: '协助窗口打饭、清洁桌面，包工作餐', contact: '139****5678', icon: 'fa-utensils', reviewStatus: 'approved', publishTime: '2026-06-08 11:00' },
        { id: 'j3', title: '校园快递代取', cat: '代取快递', salary: '3-5元/件', location: '全校范围', time: '课余时间灵活安排', desc: '代取快递送至宿舍楼下，按件计费，多劳多得', contact: '微信：kuaidi2026', icon: 'fa-box', reviewStatus: 'approved', publishTime: '2026-06-09 09:00' },
        { id: 'j4', title: '小学数学家教', cat: '家教', salary: '80元/次', location: '校外小区', time: '周末 9:00-11:00', desc: '辅导小学四年级数学，需有耐心，数学基础扎实', contact: '137****9012', icon: 'fa-chalkboard-teacher', reviewStatus: 'approved', publishTime: '2026-06-09 14:00' },
        { id: 'j5', title: '校园活动摄影', cat: '校园兼职', salary: '100元/场', location: '校内各活动场地', time: '按活动安排', desc: '拍摄校园活动照片，需自备相机，后期修图', contact: '136****3456', icon: 'fa-camera', reviewStatus: 'approved', publishTime: '2026-06-10 08:00' },
        { id: 'j6', title: '实验室助理', cat: '勤工助学', salary: '15元/小时', location: '理学楼实验室', time: '周三、周五 14:00-17:00', desc: '协助实验准备、器材整理、数据记录，理工科优先', contact: '135****7890', icon: 'fa-flask', reviewStatus: 'approved', publishTime: '2026-06-10 10:00' },
        { id: 'j7', title: '英语口语陪练', cat: '家教', salary: '60元/小时', location: '线上/图书馆', time: '协商安排', desc: '英语口语陪练，需英语六级以上，口语流利', contact: '134****2345', icon: 'fa-language', reviewStatus: 'approved', publishTime: '2026-06-10 15:00' },
        { id: 'j8', title: '校园外卖配送', cat: '代取快递', salary: '5-8元/单', location: '校内各宿舍', time: '午餐/晚餐时段', desc: '校内餐饮配送，需自备电动车，熟悉校园路线', contact: '133****6789', icon: 'fa-motorcycle', reviewStatus: 'approved', publishTime: '2026-06-11 09:00' },
        { id: 'j9', title: '社团公众号运营', cat: '校园兼职', salary: '800元/月', location: '线上办公', time: '每日1-2小时', desc: '负责社团公众号内容编辑、排版、推送，有经验优先', contact: '132****0123', icon: 'fa-pen-nib', reviewStatus: 'approved', publishTime: '2026-06-11 14:00' }
    ];

    /* 从 localStorage 加载已持久化的数据，与默认数据合并 */
    var jobs = (function() {
        try {
            var stored = JSON.parse(localStorage.getItem('campus_parttime_jobs') || '[]');
            if (stored.length > 0) return stored;
        } catch(e) {}
        /* 首次访问，将默认数据写入 localStorage */
        try { localStorage.setItem('campus_parttime_jobs', JSON.stringify(defaultJobs)); } catch(e) {}
        return defaultJobs.slice();
    })();

    var defaultCarpools = [
        { id: 'c1', from: '学校南门', to: '高铁站', date: '2026-06-20', time: '08:00', seats: 3, totalSeats: 3, cost: 'AA制约15元/人', note: '周末回家，可带行李', contact: '138****1111', publisher: '', status: 'normal', joinedUsers: [], publishTime: '2026-06-10 08:00' },
        { id: 'c2', from: '学校北门', to: '市中心广场', date: '2026-06-21', time: '09:30', seats: 2, totalSeats: 2, cost: 'AA制约10元/人', note: '去市中心逛街', contact: '139****2222', publisher: '', status: 'normal', joinedUsers: [], publishTime: '2026-06-10 09:00' },
        { id: 'c3', from: '火车站', to: '学校东门', date: '2026-06-19', time: '18:00', seats: 4, totalSeats: 4, cost: 'AA制约12元/人', note: '返校拼车，行李多也可', contact: '137****3333', publisher: '', status: 'normal', joinedUsers: [], publishTime: '2026-06-10 10:00' },
        { id: 'c4', from: '学校南门', to: '万达广场', date: '2026-06-22', time: '14:00', seats: 3, totalSeats: 3, cost: 'AA制约8元/人', note: '周末看电影', contact: '136****4444', publisher: '', status: 'normal', joinedUsers: [], publishTime: '2026-06-10 11:00' },
        { id: 'c5', from: '学校西门', to: '机场', date: '2026-06-23', time: '06:00', seats: 2, totalSeats: 2, cost: 'AA制约30元/人', note: '早班飞机，需5:50出发', contact: '135****5555', publisher: '', status: 'normal', joinedUsers: [], publishTime: '2026-06-10 12:00' },
        { id: 'c6', from: '学校北门', to: '大学城', date: '2026-06-21', time: '10:00', seats: 4, totalSeats: 4, cost: 'AA制约20元/人', note: '去大学城参加活动', contact: '134****6666', publisher: '', status: 'normal', joinedUsers: [], publishTime: '2026-06-10 13:00' }
    ];

    var carpools = (function() {
        try {
            var stored = JSON.parse(localStorage.getItem('campus_carpools') || '[]');
            if (stored.length > 0) return stored;
        } catch(e) {}
        try { localStorage.setItem('campus_carpools', JSON.stringify(defaultCarpools)); } catch(e2) {}
        return defaultCarpools.slice();
    })();

    var defaultSkills = [
        { id: 's1', name: 'PPT精美制作', cat: '设计制图', price: '50元/份', desc: '5年PPT制作经验，擅长学术答辩、商业路演PPT，风格简约大气', contact: '微信：ppt_master', icon: 'fa-file-powerpoint', publisher: '', status: 'active', publishTime: '2026-06-10 08:00' },
        { id: 's2', name: 'Python编程辅导', cat: '编程开发', price: '80元/小时', desc: '计算机专业大三，精通Python，可辅导入门到进阶，项目指导', contact: '138****7777', icon: 'fa-code', publisher: '', status: 'active', publishTime: '2026-06-10 09:00' },
        { id: 's3', name: '论文排版润色', cat: '文案写作', price: '30元/千字', desc: '多次发表论文经验，擅长中英文论文排版、格式调整、语言润色', contact: '139****8888', icon: 'fa-spell-check', publisher: '', status: 'active', publishTime: '2026-06-10 10:00' },
        { id: 's4', name: '证件照/毕业照', cat: '摄影摄像', price: '30元/组', desc: '专业相机拍摄，提供精修，可拍证件照、毕业照、情侣照', contact: '微信：photo2026', icon: 'fa-portrait', publisher: '', status: 'active', publishTime: '2026-06-10 11:00' },
        { id: 's5', name: '吉他入门教学', cat: '音乐艺术', price: '60元/小时', desc: '吉他社社长，8年弹奏经验，零基础入门到弹唱，耐心教学', contact: '137****9999', icon: 'fa-guitar', publisher: '', status: 'active', publishTime: '2026-06-10 12:00' },
        { id: 's6', name: '高数/线代辅导', cat: '学业辅导', price: '40元/小时', desc: '数学专业，高数线代均90+，可一对一辅导，讲解通俗易懂', contact: '136****0000', icon: 'fa-square-root-alt', publisher: '', status: 'active', publishTime: '2026-06-10 13:00' },
        { id: 's7', name: 'PS修图/海报', cat: '设计制图', price: '40元/张', desc: '熟练使用PS，可做海报设计、照片精修、Banner制作', contact: '135****1111', icon: 'fa-paint-brush', publisher: '', status: 'active', publishTime: '2026-06-10 14:00' },
        { id: 's8', name: '视频剪辑', cat: '摄影摄像', price: '100元/条', desc: '熟练使用PR、AE，可做Vlog、宣传片、毕业视频剪辑', contact: '134****2222', icon: 'fa-video', publisher: '', status: 'active', publishTime: '2026-06-10 15:00' },
        { id: 's9', name: '简历优化', cat: '文案写作', price: '30元/份', desc: '帮修改简历，突出亮点，优化排版，提高面试通过率', contact: '微信：cv_helper', icon: 'fa-file-alt', publisher: '', status: 'active', publishTime: '2026-06-10 16:00' }
    ];

    var skills = (function() {
        try {
            var stored = JSON.parse(localStorage.getItem('campus_skills') || '[]');
            if (stored.length > 0) return stored;
        } catch(e) {}
        try { localStorage.setItem('campus_skills', JSON.stringify(defaultSkills)); } catch(e2) {}
        return defaultSkills.slice();
    })();

    function init() {
        initHeroSlider();
        animateStats();
        initTabs();
        renderJobs('all');
        renderCarpools();
        renderSkills();
        initFilters();
        initModals();
        initForms();
    }

    function initHeroSlider() {
        var slides = document.querySelectorAll('.pt-hero-slide');
        var dots = document.querySelectorAll('.pt-hero-dot');
        if (!slides.length) return;
        var current = 0;
        var total = slides.length;
        var timer = null;

        function goTo(index) {
            slides[current].classList.remove('active');
            if (dots[current]) dots[current].classList.remove('active');
            current = index % total;
            slides[current].classList.add('active');
            if (dots[current]) dots[current].classList.add('active');
        }

        function next() { goTo(current + 1); }

        function startAuto() {
            stopAuto();
            timer = setInterval(next, 4500);
        }

        function stopAuto() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                goTo(i);
                startAuto();
            });
        });

        var hero = document.querySelector('.pt-hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopAuto);
            hero.addEventListener('mouseleave', startAuto);
        }

        startAuto();
    }

    function animateStats() {
        document.querySelectorAll('.pt-stat-num').forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            var current = 0;
            var step = Math.max(1, Math.floor(target / 30));
            var timer = setInterval(function() {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current;
            }, 40);
        });
    }

    function initTabs() {
        document.querySelectorAll('.pt-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.pt-tab').forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                var target = tab.getAttribute('data-tab');
                document.querySelectorAll('.pt-tab-content').forEach(function(c) { c.classList.remove('active'); });
                document.getElementById(target).classList.add('active');
            });
        });
    }

    function initFilters() {
        document.querySelectorAll('.pt-filter').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.pt-filter').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                renderJobs(btn.getAttribute('data-cat'));
            });
        });
    }

    function renderJobs(cat) {
        var list = document.getElementById('jobsList');
        list.innerHTML = '';
        var filtered = cat === 'all' ? jobs : jobs.filter(function(j) { return j.cat === cat; });
        /* 只展示已审核通过的兼职 */
        filtered = filtered.filter(function(j) { return j.reviewStatus === 'approved'; });
        if (filtered.length === 0) {
            list.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-secondary)"><i class="fas fa-briefcase" style="font-size:48px;opacity:0.3;display:block;margin-bottom:15px"></i><p>暂无兼职信息</p></div>';
            return;
        }
        filtered.forEach(function(job) {
            var card = document.createElement('div');
            card.className = 'pt-job-card';
            card.innerHTML = '<div class="pt-job-icon cat-' + job.cat + '"><i class="fas ' + job.icon + '"></i></div><div class="pt-job-info"><h4>' + job.title + '</h4><p>' + job.desc + '</p><div class="pt-job-meta"><span class="pt-job-tag salary">' + job.salary + '</span><span class="pt-job-tag cat">' + job.cat + '</span><span class="pt-job-tag time"><i class="fas fa-clock"></i> ' + job.time + '</span></div><div class="pt-job-actions"><button class="pt-apply-btn" data-id="' + job.id + '"><i class="fas fa-paper-plane"></i> 申请</button><button class="pt-detail-link-btn" data-id="' + job.id + '"><i class="fas fa-eye"></i> 查看详情</button></div></div>';
            list.appendChild(card);
        });
        // 卡片点击跳转详情
        list.querySelectorAll('.pt-job-card').forEach(function(card) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                if (e.target.closest('.pt-apply-btn') || e.target.closest('.pt-detail-link-btn')) return;
                var jobId = card.querySelector('.pt-apply-btn').getAttribute('data-id');
                location.href = 'parttime-detail.html?id=' + jobId;
            });
        });
        list.querySelectorAll('.pt-detail-link-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                location.href = 'parttime-detail.html?id=' + btn.getAttribute('data-id');
            });
        });
        list.querySelectorAll('.pt-apply-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                location.href = 'parttime-detail.html?id=' + btn.getAttribute('data-id');
            });
        });
    }

    function getCurrentUser() {
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function saveCarpools() {
        try { localStorage.setItem('campus_carpools', JSON.stringify(carpools)); } catch(e) {}
    }

    function saveSkills() {
        try { localStorage.setItem('campus_skills', JSON.stringify(skills)); } catch(e) {}
    }

    function renderCarpools() {
        var list = document.getElementById('carpoolList');
        list.innerHTML = '';
        var user = getCurrentUser();
        var filteredCarpools = carpools.filter(function(cp) { return cp.status !== 'cancelled'; });
        if (filteredCarpools.length === 0) {
            list.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-secondary)"><i class="fas fa-car" style="font-size:48px;opacity:0.3;display:block;margin-bottom:15px"></i><p>暂无拼车信息</p></div>';
            return;
        }
        filteredCarpools.forEach(function(cp) {
            var isOwner = user && (user.name === cp.publisher || (user.stuId && user.stuId === cp.publisherStuId));
            var alreadyJoined = user && cp.joinedUsers && cp.joinedUsers.some(function(u) { return u.name === user.name || (u.stuId && u.stuId === user.stuId); });
            var isFull = cp.seats <= 0;
            var btnHtml = '';
            if (isOwner) {
                btnHtml = '<button class="pt-apply-btn" style="margin-top:8px;opacity:0.5;cursor:not-allowed" disabled><i class="fas fa-user"></i> 我发布的</button>';
            } else if (alreadyJoined) {
                btnHtml = '<button class="pt-apply-btn" style="margin-top:8px;background:#10b981" disabled><i class="fas fa-check"></i> 已报名</button>';
            } else if (isFull) {
                btnHtml = '<button class="pt-apply-btn" style="margin-top:8px;opacity:0.5;cursor:not-allowed" disabled><i class="fas fa-ban"></i> 已满</button>';
            } else {
                btnHtml = '<button class="pt-apply-btn" style="margin-top:8px;" data-id="' + cp.id + '"><i class="fas fa-hand-point-up"></i> 拼车</button>';
            }
            var card = document.createElement('div');
            card.className = 'pt-carpool-card';
            card.innerHTML = '<div class="pt-carpool-route"><h4>' + cp.from + ' → ' + cp.to + '</h4><p><i class="fas fa-sticky-note"></i> ' + cp.note + '</p><p><i class="fas fa-phone"></i> ' + cp.contact + '</p></div><div class="pt-carpool-arrow"><i class="fas fa-long-arrow-alt-right"></i></div><div class="pt-carpool-info"><div class="date">' + cp.date + '</div><div class="time">' + cp.time + '</div><div class="seats"><i class="fas fa-user-friends"></i> 余' + cp.seats + '座</div>' + btnHtml + '</div>';
            list.appendChild(card);
        });
        list.querySelectorAll('.pt-apply-btn[data-id]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var user = getCurrentUser();
                if (!user) { showToast('请先登录后再拼车'); return; }
                var cpId = btn.getAttribute('data-id');
                var cp = carpools.find(function(c) { return c.id === cpId; });
                if (!cp) { showToast('拼车信息不存在'); return; }
                /* 校验：不能拼自己发布的车 */
                if (cp.publisher === user.name || (cp.publisherStuId && cp.publisherStuId === user.stuId)) {
                    showToast('不能报名自己发布的拼车'); return;
                }
                /* 校验：不能重复报名 */
                if (cp.joinedUsers && cp.joinedUsers.some(function(u) { return u.name === user.name || (u.stuId && u.stuId === user.stuId); })) {
                    showToast('您已报名该拼车'); return;
                }
                /* 校验：座位已满 */
                if (cp.seats <= 0) { showToast('座位已满'); return; }
                /* 报名成功：更新座位数和已报名列表 */
                cp.seats = cp.seats - 1;
                if (!cp.joinedUsers) cp.joinedUsers = [];
                cp.joinedUsers.push({ name: user.name, stuId: user.stuId || '', joinTime: new Date().toISOString().replace('T', ' ').substring(0, 16) });
                saveCarpools();
                renderCarpools();
                showToast('拼车报名成功！');
            });
        });
    }

    function renderSkills() {
        var grid = document.getElementById('skillsGrid');
        grid.innerHTML = '';
        var user = getCurrentUser();
        var filteredSkills = skills.filter(function(sk) { return sk.status !== 'cancelled'; });
        if (filteredSkills.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-secondary)"><i class="fas fa-star" style="font-size:48px;opacity:0.3;display:block;margin-bottom:15px"></i><p>暂无技能服务</p></div>';
            return;
        }
        filteredSkills.forEach(function(sk) {
            var isOwner = user && (user.name === sk.publisher || (user.stuId && user.stuId === sk.publisherStuId));
            var btnHtml = '';
            if (isOwner) {
                btnHtml = '<button class="pt-apply-btn" style="opacity:0.5;cursor:not-allowed" disabled><i class="fas fa-user"></i> 我发布的</button>';
            } else {
                btnHtml = '<button class="pt-apply-btn" data-id="' + sk.id + '"><i class="fas fa-comment-dots"></i> 联系接单</button>';
            }
            var card = document.createElement('div');
            card.className = 'pt-skill-card';
            card.innerHTML = '<div class="pt-skill-icon cat-' + sk.cat + '"><i class="fas ' + sk.icon + '"></i></div><h4>' + sk.name + '</h4><p>' + sk.desc + '</p><div class="pt-skill-price">' + sk.price + '</div>' + btnHtml;
            grid.appendChild(card);
        });
        grid.querySelectorAll('.pt-apply-btn[data-id]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var user = getCurrentUser();
                if (!user) { showToast('请先登录后再接单'); return; }
                var skId = btn.getAttribute('data-id');
                var sk = skills.find(function(s) { return s.id === skId; });
                if (!sk) { showToast('技能服务不存在'); return; }
                /* 校验：不能接自己发布的单 */
                if (sk.publisher === user.name || (sk.publisherStuId && sk.publisherStuId === user.stuId)) {
                    showToast('不能接自己发布的技能服务'); return;
                }
                showToast('已发送接单请求！');
            });
        });
    }

    function initModals() {
        document.getElementById('publishJobBtn').addEventListener('click', function() { openModal('jobModal'); });
        document.getElementById('publishCarpoolBtn').addEventListener('click', function() { openModal('carpoolModal'); });
        document.getElementById('publishSkillBtn').addEventListener('click', function() { openModal('skillModal'); });
        document.querySelectorAll('.pt-modal-close').forEach(function(btn) {
            btn.addEventListener('click', function() { closeModal(btn.getAttribute('data-modal')); });
        });
        document.querySelectorAll('.pt-modal').forEach(function(modal) {
            modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(modal.id); });
        });
    }

    function openModal(id) { document.getElementById(id).classList.add('active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

    function initForms() {
        document.getElementById('jobForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var newJob = {
                id: 'j' + Date.now(),
                title: document.getElementById('jobTitle').value,
                cat: document.getElementById('jobCat').value,
                salary: document.getElementById('jobSalary').value,
                location: document.getElementById('jobLocation').value,
                time: document.getElementById('jobTime').value,
                desc: document.getElementById('jobDesc').value,
                contact: document.getElementById('jobContact').value,
                icon: 'fa-briefcase',
                reviewStatus: 'pending',
                publishTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
            jobs.unshift(newJob);
            /* 持久化到 localStorage */
            try {
                var stored = JSON.parse(localStorage.getItem('campus_parttime_jobs') || '[]');
                stored.unshift(newJob);
                localStorage.setItem('campus_parttime_jobs', JSON.stringify(stored));
            } catch(e) {}
            renderJobs('all');
            closeModal('jobModal');
            this.reset();
            showToast('兼职信息发布成功，已进入审核！');
        });

        document.getElementById('carpoolForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var user = getCurrentUser();
            var newCp = {
                id: 'c' + Date.now(),
                from: document.getElementById('cpFrom').value,
                to: document.getElementById('cpTo').value,
                date: document.getElementById('cpDate').value,
                time: document.getElementById('cpTime').value,
                seats: parseInt(document.getElementById('cpSeats').value),
                totalSeats: parseInt(document.getElementById('cpSeats').value),
                cost: document.getElementById('cpCost').value,
                note: document.getElementById('cpNote').value || '暂无备注',
                contact: document.getElementById('cpContact').value,
                publisher: user ? user.name : '',
                publisherStuId: user ? (user.stuId || '') : '',
                status: 'normal',
                joinedUsers: [],
                publishTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
            carpools.unshift(newCp);
            saveCarpools();
            renderCarpools();
            closeModal('carpoolModal');
            this.reset();
            showToast('拼车信息发布成功！');
        });

        document.getElementById('skillForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var user = getCurrentUser();
            var iconMap = { '设计制图': 'fa-paint-brush', '编程开发': 'fa-code', '文案写作': 'fa-pen', '摄影摄像': 'fa-camera', '音乐艺术': 'fa-music', '学业辅导': 'fa-graduation-cap', '其他': 'fa-star' };
            var newSk = {
                id: 's' + Date.now(),
                name: document.getElementById('skName').value,
                cat: document.getElementById('skCat').value,
                price: document.getElementById('skPrice').value,
                desc: document.getElementById('skDesc').value,
                contact: document.getElementById('skContact').value,
                icon: iconMap[document.getElementById('skCat').value] || 'fa-star',
                publisher: user ? user.name : '',
                publisherStuId: user ? (user.stuId || '') : '',
                status: 'active',
                publishTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
            skills.unshift(newSk);
            saveSkills();
            renderSkills();
            closeModal('skillModal');
            this.reset();
            showToast('技能服务发布成功！');
        });

    }

    function showToast(msg) {
        var toast = document.getElementById('ptToast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
