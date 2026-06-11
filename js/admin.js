(function() {
    var DEFAULT_SENSITIVE_WORDS = [
        { id: 1, word: '赌博', cat: '违禁词', addTime: new Date().toISOString() },
        { id: 2, word: '色情', cat: '违禁词', addTime: new Date().toISOString() },
        { id: 3, word: '毒品', cat: '违禁词', addTime: new Date().toISOString() },
        { id: 4, word: '代开发票', cat: '广告词', addTime: Date.now() - 1000 },
        { id: 5, word: '刷单', cat: '广告词', addTime: Date.now() - 2000 },
        { id: 6, word: '办证', cat: '广告词', addTime: Date.now() - 3000 },
        { id: 7, word: '傻逼', cat: '侮辱词', addTime: Date.now() - 4000 },
        { id: 8, word: '白痴', cat: '侮辱词', addTime: Date.now() - 5000 },
        { id: 9, word: '反动', cat: '政治敏感', addTime: Date.now() - 6000 },
        { id: 10, word: '法轮', cat: '政治敏感', addTime: Date.now() - 7000 }
    ];

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function getStudents() {
        if (window.CampusDB) return CampusDB.getStudents();
        try { return JSON.parse(localStorage.getItem('campus_students') || '[]'); } catch(e) { return []; }
    }

    function saveStudents(list) {
        if (window.CampusDB) return CampusDB.saveStudents(list);
        localStorage.setItem('campus_students', JSON.stringify(list));
    }

    function getAnnouncements() {
        if (window.CampusDB) return CampusDB.getAnnouncements();
        try { return JSON.parse(localStorage.getItem('campus_announcements') || '[]'); } catch(e) { return []; }
    }

    function saveAnnouncements(list) {
        if (window.CampusDB) return CampusDB.saveAnnouncements(list);
        localStorage.setItem('campus_announcements', JSON.stringify(list));
    }

    function getRepairs() {
        if (window.CampusDB) return CampusDB.getRepairs();
        try { return JSON.parse(localStorage.getItem('campus_repairs') || '[]'); } catch(e) { return []; }
    }

    function saveRepairs(list) {
        if (window.CampusDB) return CampusDB.saveRepairs(list);
        localStorage.setItem('campus_repairs', JSON.stringify(list));
    }

    function getSecondhandItems() {
        if (window.CampusDB) return CampusDB.getSecondhand();
        try { return JSON.parse(localStorage.getItem('campus_secondhand') || '[]'); } catch(e) { return []; }
    }

    function getVisitCount() {
        if (window.CampusDB) return CampusDB.getVisitCount();
        try { return parseInt(localStorage.getItem('campus_visit_count') || '0'); } catch(e) { return 0; }
    }

    function getSensitiveWords() {
        if (window.CampusDB) {
            var list = CampusDB.getSensitiveWords();
            if (list.length === 0) { saveSensitiveWords(DEFAULT_SENSITIVE_WORDS); return DEFAULT_SENSITIVE_WORDS; }
            return list;
        }
        try {
            var list = JSON.parse(localStorage.getItem('campus_sensitive_words') || '[]');
            if (list.length === 0) {
                saveSensitiveWords(DEFAULT_SENSITIVE_WORDS);
                return DEFAULT_SENSITIVE_WORDS;
            }
            return list;
        } catch(e) {
            saveSensitiveWords(DEFAULT_SENSITIVE_WORDS);
            return DEFAULT_SENSITIVE_WORDS;
        }
    }

    function saveSensitiveWords(list) {
        if (window.CampusDB) return CampusDB.saveSensitiveWords(list);
        localStorage.setItem('campus_sensitive_words', JSON.stringify(list));
    }

    function getBlockLog() {
        if (window.CampusDB) return CampusDB.getBlockLog();
        try { return JSON.parse(localStorage.getItem('campus_block_log') || '[]'); } catch(e) { return []; }
    }

    function saveBlockLog(list) {
        if (window.CampusDB) return CampusDB.saveBlockLog(list);
        localStorage.setItem('campus_block_log', JSON.stringify(list));
    }

    window.checkSensitiveWords = function(text) {
        var words = getSensitiveWords();
        var found = [];
        for (var i = 0; i < words.length; i++) {
            if (text.indexOf(words[i].word) > -1) {
                found.push(words[i].word);
            }
        }
        return found;
    };

    window.filterSensitiveText = function(text) {
        var words = getSensitiveWords();
        var result = text;
        for (var i = 0; i < words.length; i++) {
            var w = words[i].word;
            while (result.indexOf(w) > -1) {
                result = result.replace(w, w.charAt(0) + '**');
            }
        }
        return result;
    };

    window.logBlock = function(text, matchedWords, source) {
        var log = getBlockLog();
        log.unshift({
            id: Date.now(),
            text: text.substring(0, 100),
            words: matchedWords,
            source: source || '留言评论',
            time: new Date().toISOString()
        });
        if (log.length > 200) log = log.slice(0, 200);
        saveBlockLog(log);
    };

    function init() {
        var user = getCurrentUser();
        if (!user || user.role !== 'admin') {
            window.location.href = 'login.html?type=admin';
            return;
        }
        incrementVisit();
        initSidebar();
        initOverview();
        initUsers();
        initContent();
        initAnnouncements();
        initSensitive();
        initSettings();
        initLogout();
    }

    function incrementVisit() {
        var count = getVisitCount() + 1;
        if (window.CampusDB) { CampusDB.setVisitCount(count); } else { localStorage.setItem('campus_visit_count', String(count)); }
    }

    function initSidebar() {
        document.querySelectorAll('.adm-nav-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var panel = btn.getAttribute('data-panel');
                switchPanel(panel);
            });
        });
    }

    window.switchPanel = function(panel) {
        document.querySelectorAll('.adm-nav-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.adm-panel').forEach(function(p) { p.classList.remove('active'); });
        var navBtn = document.querySelector('.adm-nav-btn[data-panel="' + panel + '"]');
        var panelEl = document.getElementById('panel-' + panel);
        if (navBtn) navBtn.classList.add('active');
        if (panelEl) panelEl.classList.add('active');
        if (panel === 'overview') refreshOverview();
        if (panel === 'users') renderUsers();
        if (panel === 'sensitive') { renderSensitiveWords(); renderBlockLog(); }
    };

    function initOverview() {
        updateTime();
        setInterval(updateTime, 1000);
        refreshOverview();
        initStatCards();
        initQuickActions();
        initViewAllUsers();
    }

    function refreshOverview() {
        var students = getStudents();
        var secondhand = getSecondhandItems();
        var visits = getVisitCount();

        document.getElementById('statUsers').textContent = students.length > 0 ? students.length : 256;
        var onsale = secondhand.filter(function(p) { return p.status === '在售'; }).length;
        document.getElementById('statTrade').textContent = secondhand.length > 0 ? secondhand.length.toLocaleString() : '1,286';
        document.getElementById('statVisits').textContent = visits > 0 ? visits.toLocaleString() : '128,560';

        renderRecentUsers();
    }

    function initStatCards() {
        var el;
        el = document.getElementById('statCardUsers');
        if (el) el.addEventListener('click', function() {
            switchPanel('users');
            showToast('已跳转至用户管理', 'success');
        });
        el = document.getElementById('statCardTrade');
        if (el) el.addEventListener('click', function() {
            switchPanel('content');
            var secondhandTab = document.querySelector('.adm-tab[data-ctab="secondhand"]');
            if (secondhandTab) secondhandTab.click();
            showToast('已跳转至二手商品审核', 'success');
        });
        el = document.getElementById('statCardVisits');
        if (el) el.addEventListener('click', function() {
            showToast('本月访问数据已更新', 'info');
        });
    }

    function initQuickActions() {
        document.querySelectorAll('.adm-quick-btn[data-panel]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var panel = btn.getAttribute('data-panel');
                switchPanel(panel);
                var labels = { announcements: '公告发布', users: '用户管理', content: '内容审核', sensitive: '敏感词管理', settings: '全局设置' };
                showToast('已跳转至' + (labels[panel] || panel), 'success');
            });
        });
    }

    function initViewAllUsers() {
        document.getElementById('viewAllUsers').addEventListener('click', function() {
            switchPanel('users');
            showToast('已跳转至用户管理', 'success');
        });
    }

    function renderRecentUsers() {
        var students = getStudents();
        var recentDiv = document.getElementById('recentUsers');
        if (students.length === 0) {
            recentDiv.innerHTML = '<div class="adm-empty-state"><i class="fas fa-user-slash"></i><p>暂无注册用户</p><span>学生注册后将自动在此展示</span></div>';
            return;
        }
        var recent = students.slice(-5).reverse();
        var adminAvatars = {};
        if (window.CampusDB) { adminAvatars = CampusDB.getAvatars(); } else {
            try { adminAvatars = JSON.parse(localStorage.getItem('campus_avatars') || '{}'); } catch(e) {}
        }
        recentDiv.innerHTML = recent.map(function(s, i) {
            var avHtml = '<i class="fas fa-user-graduate"></i>';
            if (adminAvatars[s.stuId]) {
                avHtml = '<img src="' + adminAvatars[s.stuId] + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.outerHTML=\'<i class=\\\'fas fa-user-graduate\\\'></i>\'">';
            }
            return '<div class="adm-user-item adm-user-clickable" data-stuid="' + s.stuId + '"><div class="adm-user-avatar">' + avHtml + '</div><div class="adm-user-item-info"><h4>' + s.name + '</h4><p>' + s.stuId + ' · ' + s.dept + '</p></div><span class="adm-user-time">' + formatDate(s.regTime) + '</span></div>';
        }).join('');
        recentDiv.querySelectorAll('.adm-user-clickable').forEach(function(item) {
            item.addEventListener('click', function() {
                var stuId = item.getAttribute('data-stuid');
                showUserDetail(stuId);
            });
        });
    }

    function showUserDetail(stuId) {
        var students = getStudents();
        var s = students.find(function(u) { return u.stuId === stuId; });
        if (!s) return;
        var avatarHtml = '<i class="fas fa-user-graduate"></i>';
        var avatars = {};
        if (window.CampusDB) { avatars = CampusDB.getAvatars(); } else {
            try { avatars = JSON.parse(localStorage.getItem('campus_avatars') || '{}'); } catch(e) {}
        }
        if (avatars[s.stuId]) {
            avatarHtml = '<img src="' + avatars[s.stuId] + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.outerHTML=\'<i class=\\\'fas fa-user-graduate\\\'></i>\'">';
        }
        var modal = document.getElementById('admModal');
        document.getElementById('admModalTitle').textContent = '用户详情';
        document.getElementById('admModalBody').innerHTML = '<div class="adm-user-detail"><div class="adm-user-detail-avatar">' + avatarHtml + '</div><div class="adm-user-detail-info"><div class="adm-detail-row"><label>学号</label><span>' + s.stuId + '</span></div><div class="adm-detail-row"><label>姓名</label><span>' + s.name + '</span></div><div class="adm-detail-row"><label>院系</label><span>' + s.dept + '</span></div><div class="adm-detail-row"><label>联系电话</label><span>' + s.phone + '</span></div><div class="adm-detail-row"><label>注册时间</label><span>' + formatDateTime(s.regTime) + '</span></div></div><div class="adm-user-detail-actions"><button class="adm-btn-primary" id="goToUserMgmt"><i class="fas fa-users"></i> 前往用户管理</button></div></div>';
        modal.classList.add('active');
        document.getElementById('goToUserMgmt').addEventListener('click', function() {
            modal.classList.remove('active');
            switchPanel('users');
        });
    }

    function updateTime() {
        var el = document.getElementById('overviewTime');
        if (el) el.textContent = new Date().toLocaleString('zh-CN');
    }

    function initUsers() {
        renderUsers();
        document.getElementById('userSearch').addEventListener('input', function() { renderUsers(this.value); });
        document.getElementById('addUserBtn').addEventListener('click', function() { showAddUserModal(); });
    }

    function renderUsers(search) {
        checkAndAutoUnban();
        var allStudents = getStudents();
        var students = allStudents;
        var tbody = document.getElementById('usersTableBody');
        if (search) {
            search = search.toLowerCase();
            students = students.filter(function(s) { return s.stuId.toLowerCase().indexOf(search) > -1 || s.name.toLowerCase().indexOf(search) > -1; });
        }
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-secondary);padding:30px">暂无用户数据</td></tr>';
            return;
        }
        tbody.innerHTML = students.map(function(s, i) {
            var adminAvatars2 = {};
            if (window.CampusDB) { adminAvatars2 = CampusDB.getAvatars(); } else {
                try { adminAvatars2 = JSON.parse(localStorage.getItem('campus_avatars') || '{}'); } catch(e2) {}
            }
            var avHtml2 = '<div style="width:32px;height:32px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:12px;color:#64748b;margin:0 auto">' + s.name.charAt(0) + '</div>';
            if (adminAvatars2[s.stuId]) {
                avHtml2 = '<div style="width:32px;height:32px;border-radius:50%;overflow:hidden;margin:0 auto"><img src="' + adminAvatars2[s.stuId] + '" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML=\'' + s.name.charAt(0) + '\'"></div>';
            }
            var statusHtml = '<span class="adm-status-badge adm-status-normal">正常</span>';
            var banExpiryHtml = '-';
            if (s.status === 'banned') {
                statusHtml = '<span class="adm-status-badge adm-status-banned">封禁</span>';
                if (s.banExpiry === 'permanent') {
                    banExpiryHtml = '永久';
                } else if (s.banExpiry) {
                    banExpiryHtml = formatDate(s.banExpiry);
                }
            }
            var actionBtns = '<button class="adm-btn-sm adm-btn-edit" data-stuid="' + s.stuId + '"><i class="fas fa-edit"></i></button> <button class="adm-btn-sm adm-btn-del" data-stuid="' + s.stuId + '"><i class="fas fa-trash"></i></button>';
            if (s.status === 'banned') {
                actionBtns += ' <button class="adm-btn-sm adm-btn-unban" data-stuid="' + s.stuId + '" title="解封" style="color:#059669"><i class="fas fa-unlock"></i></button>';
            } else {
                actionBtns += ' <button class="adm-btn-sm adm-btn-ban" data-stuid="' + s.stuId + '" title="封号" style="color:#ef4444"><i class="fas fa-ban"></i></button>';
            }
            return '<tr><td>' + avHtml2 + '</td><td>' + s.stuId + '</td><td>' + s.name + '</td><td>' + s.dept + '</td><td>' + statusHtml + '</td><td>' + banExpiryHtml + '</td><td>' + formatDate(s.regTime) + '</td><td>' + actionBtns + '</td></tr>';
        }).join('');
        tbody.querySelectorAll('.adm-btn-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (confirm('确定删除该用户？')) {
                    var stuId = btn.getAttribute('data-stuid');
                    var list = getStudents();
                    var idx = list.findIndex(function(u) { return u.stuId === stuId; });
                    if (idx !== -1) list.splice(idx, 1);
                    saveStudents(list);
                    renderUsers(search);
                    showToast('用户已删除', 'success');
                }
            });
        });
        tbody.querySelectorAll('.adm-btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var stuId = btn.getAttribute('data-stuid');
                var list = getStudents();
                var s = list.find(function(u) { return u.stuId === stuId; });
                if (s) showEditUserModal(s);
            });
        });
        tbody.querySelectorAll('.adm-btn-unban').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var stuId = btn.getAttribute('data-stuid');
                if (confirm('确定解封该用户？')) unbanUser(stuId);
            });
        });
        tbody.querySelectorAll('.adm-btn-ban').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var stuId = btn.getAttribute('data-stuid');
                var students = getStudents();
                var s = students.find(function(u) { return u.stuId === stuId; });
                if (s) {
                    currentBanLogEntry = { source: s.name + '(' + s.stuId + ')', text: '管理员手动封号', words: [], targetStuId: stuId };
                    openBanModal(currentBanLogEntry);
                }
            });
        });
    }

    function showEditUserModal(s) {
        var modal = document.getElementById('admModal');
        document.getElementById('admModalTitle').textContent = '编辑用户';
        document.getElementById('admModalBody').innerHTML = '<form id="editUserForm"><div class="adm-form-group"><label>学号</label><input type="text" value="' + s.stuId + '" disabled style="opacity:0.6"></div><div class="adm-form-group"><label>姓名</label><input type="text" id="editName" value="' + s.name + '" required></div><div class="adm-form-group"><label>院系</label><select id="editDept"><option value="计算机学院"' + (s.dept === '计算机学院' ? ' selected' : '') + '>计算机学院</option><option value="电子信息学院"' + (s.dept === '电子信息学院' ? ' selected' : '') + '>电子信息学院</option><option value="机械工程学院"' + (s.dept === '机械工程学院' ? ' selected' : '') + '>机械工程学院</option><option value="经济管理学院"' + (s.dept === '经济管理学院' ? ' selected' : '') + '>经济管理学院</option><option value="外国语学院"' + (s.dept === '外国语学院' ? ' selected' : '') + '>外国语学院</option><option value="数学与统计学院"' + (s.dept === '数学与统计学院' ? ' selected' : '') + '>数学与统计学院</option><option value="文学与传媒学院"' + (s.dept === '文学与传媒学院' ? ' selected' : '') + '>文学与传媒学院</option><option value="艺术设计学院"' + (s.dept === '艺术设计学院' ? ' selected' : '') + '>艺术设计学院</option><option value="体育学院"' + (s.dept === '体育学院' ? ' selected' : '') + '>体育学院</option><option value="法学院"' + (s.dept === '法学院' ? ' selected' : '') + '>法学院</option></select></div><div class="adm-form-group"><label>联系电话</label><input type="tel" id="editPhone" value="' + s.phone + '" required></div><button type="submit" class="adm-btn-primary" style="width:100%"><i class="fas fa-save"></i> 保存修改</button></form>';
        modal.classList.add('active');
        document.getElementById('editUserForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var list = getStudents();
            var idx = list.findIndex(function(u) { return u.stuId === s.stuId; });
            if (idx > -1) {
                list[idx].name = document.getElementById('editName').value.trim();
                list[idx].dept = document.getElementById('editDept').value;
                list[idx].phone = document.getElementById('editPhone').value.trim();
                saveStudents(list);
                modal.classList.remove('active');
                renderUsers();
                showToast('用户信息已更新', 'success');
            }
        });
    }

    function showAddUserModal() {
        var modal = document.getElementById('admModal');
        document.getElementById('admModalTitle').textContent = '添加用户';
        document.getElementById('admModalBody').innerHTML = '<form id="addUserForm"><div class="adm-form-group"><label>学号</label><input type="text" id="addStuId" required></div><div class="adm-form-group"><label>姓名</label><input type="text" id="addName" required></div><div class="adm-form-group"><label>密码</label><input type="password" id="addPwd" required></div><div class="adm-form-group"><label>院系</label><select id="addDept"><option value="计算机学院">计算机学院</option><option value="电子信息学院">电子信息学院</option><option value="机械工程学院">机械工程学院</option><option value="经济管理学院">经济管理学院</option><option value="外国语学院">外国语学院</option><option value="数学与统计学院">数学与统计学院</option><option value="文学与传媒学院">文学与传媒学院</option><option value="艺术设计学院">艺术设计学院</option><option value="体育学院">体育学院</option><option value="法学院">法学院</option></select></div><div class="adm-form-group"><label>联系电话</label><input type="tel" id="addPhone" required></div><button type="submit" class="adm-btn-primary" style="width:100%"><i class="fas fa-plus"></i> 添加</button></form>';
        modal.classList.add('active');
        document.getElementById('addUserForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var students = getStudents();
            var stuId = document.getElementById('addStuId').value.trim();
            var exists = students.find(function(s) { return s.stuId === stuId; });
            if (exists) { showToast('该学号已存在', 'error'); return; }
            students.push({ stuId: stuId, name: document.getElementById('addName').value.trim(), password: document.getElementById('addPwd').value, dept: document.getElementById('addDept').value, phone: document.getElementById('addPhone').value.trim(), regTime: new Date().toISOString() });
            saveStudents(students);
            modal.classList.remove('active');
            renderUsers();
            showToast('用户添加成功', 'success');
        });
    }

    /* ========== 内容审核模块 ========== */
    var contentReviewData = {
        secondhand: [
            { id: 'sh1', title: '罗技G502有线鼠标', stuId: '2024001', desc: '罗技G502游戏鼠标，11个可编程按键，配重可调', price: '¥199', status: 'pending', time: '2026-06-08 14:30' },
            { id: 'sh2', title: '四六级真题合集', stuId: '2024002', desc: '近五年四六级真题，含听力光盘', price: '¥20', status: 'pending', time: '2026-06-08 10:15' },
            { id: 'sh3', title: '小米台灯Pro', stuId: '2024003', desc: '小米智能台灯Pro，支持小爱同学控制', price: '¥60', status: 'pending', time: '2026-06-07 16:45' },
            { id: 'sh4', title: 'MacBook Pro 2023 M2', stuId: '2024001', desc: 'M2芯片，16G+512G，电池循环仅28次', price: '¥8999', status: 'approved', time: '2026-06-05 09:00' },
            { id: 'sh5', title: '违规商品测试', stuId: '2024006', desc: '此商品描述包含违规信息已被拒绝', price: '¥0', status: 'rejected', time: '2026-06-04 11:20' }
        ],
        rental: [
            { id: 'rt1', title: '高等数学（同济第七版）上册', stuId: '2024005', desc: '适用理工科专业，含部分课堂笔记', price: '¥15/学期', status: 'pending', time: '2026-06-08 09:00' },
            { id: 'rt2', title: 'C++ Primer Plus 第6版', stuId: '2024001', desc: '计算机专业经典教材，含课后习题答案', price: '¥20/学年', status: 'pending', time: '2026-06-07 15:30' },
            { id: 'rt3', title: '微观经济学（曼昆）', stuId: '2024003', desc: '经管专业核心教材，重点标注清晰', price: '¥18/学期', status: 'pending', time: '2026-06-06 11:00' },
            { id: 'rt4', title: '大学物理（第四版）', stuId: '2024002', desc: '适用物理、工科专业，保存完好', price: '¥12/学期', status: 'approved', time: '2026-06-03 10:00' },
            { id: 'rt5', title: '已损坏教材', stuId: '2024004', desc: '教材严重缺页，无法正常使用', price: '¥5/学期', status: 'rejected', time: '2026-06-02 14:00' }
        ],
        parttime: [
            { id: 'pt1', title: '校园咖啡厅周末兼职', stuId: '2024002', desc: '周六日9:00-17:00，负责点单和清洁', price: '¥120/天', status: 'pending', time: '2026-06-08 08:30' },
            { id: 'pt2', title: '小学数学家教', stuId: '2024001', desc: '每周三晚辅导小学五年级数学', price: '¥80/次', status: 'pending', time: '2026-06-07 20:00' },
            { id: 'pt3', title: '快递代取跑腿', stuId: '2024005', desc: '代取快递送到宿舍，按件计费', price: '¥3-8/件', status: 'pending', time: '2026-06-07 12:00' },
            { id: 'pt4', title: '图书馆整理助理', stuId: '2024003', desc: '工作日14:00-17:00，整理上架图书', price: '¥15/小时', status: 'approved', time: '2026-06-04 09:30' },
            { id: 'pt5', title: '虚假刷单兼职', stuId: '2024006', desc: '刷单日赚500，轻松兼职（违规信息）', price: '¥500/天', status: 'rejected', time: '2026-06-03 16:00' }
        ]
    };

    /* 后端接口映射 */
    var contentApiMap = {
        secondhand: '/api/admin/secondhand',
        rental: '/api/admin/textbook',
        parttime: '/api/admin/parttime'
    };

    /* 加载状态跟踪 */
    var contentLoading = { secondhand: false, rental: false, parttime: false };

    function initContent() {
        var currentCTab = 'secondhand';
        console.log('[内容审核] 初始化，默认标签：secondhand');

        document.querySelectorAll('.adm-tab[data-ctab]').forEach(function(tab) {
            tab.addEventListener('click', function() {
                var newTab = tab.getAttribute('data-ctab');
                if (newTab === currentCTab) return;
                document.querySelectorAll('.adm-tab[data-ctab]').forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                currentCTab = newTab;
                console.log('[内容审核] 切换标签 →', currentCTab);
                renderContent(currentCTab);
            });
        });

        renderContent(currentCTab);
    }

    function fetchContentData(tab, callback) {
        var apiUrl = contentApiMap[tab];
        console.log('[内容审核] 请求接口:', apiUrl, '标签:', tab);

        contentLoading[tab] = true;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 5000;

        xhr.onload = function() {
            contentLoading[tab] = false;
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    var res = JSON.parse(xhr.responseText);
                    console.log('[内容审核] 接口返回成功:', tab, res);
                    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                        callback(null, res.data);
                    } else {
                        console.log('[内容审核] 接口返回空数据，使用本地示例数据');
                        callback(null, null);
                    }
                } catch (e) {
                    console.warn('[内容审核] 接口返回解析失败，使用本地示例数据:', e);
                    callback(null, null);
                }
            } else {
                console.warn('[内容审核] 接口返回非200状态:', xhr.status, '使用本地示例数据');
                callback(null, null);
            }
        };

        xhr.onerror = function() {
            contentLoading[tab] = false;
            console.warn('[内容审核] 接口请求失败（网络错误），使用本地示例数据');
            callback(null, null);
        };

        xhr.ontimeout = function() {
            contentLoading[tab] = false;
            console.warn('[内容审核] 接口请求超时，使用本地示例数据');
            callback(null, null);
        };

        xhr.send();
    }

    function renderContent(tab) {
        var container = document.getElementById('contentList');
        var tabLabels = { secondhand: '二手商品', rental: '教材租用', parttime: '兼职信息' };
        var priceLabel = tab === 'parttime' ? '薪资' : (tab === 'rental' ? '租金' : '价格');

        /* 显示加载状态 */
        container.innerHTML = '<div class="adm-loading"><div class="adm-loading-spinner"></div><span>加载中...</span></div>';

        /* 尝试从后端接口获取数据 */
        fetchContentData(tab, function(err, apiData) {
            var data = apiData || contentReviewData[tab] || [];
            console.log('[内容审核] 渲染数据，标签:', tab, '数据条数:', data.length);

            if (data.length === 0) {
                container.innerHTML = '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + tabLabels[tab] + '审核数据</p></div>';
                return;
            }

            var pendingCount = data.filter(function(d) { return d.status === 'pending'; }).length;
            var approvedCount = data.filter(function(d) { return d.status === 'approved'; }).length;
            var rejectedCount = data.filter(function(d) { return d.status === 'rejected'; }).length;

            var html = '<div class="adm-review-stats">' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#6b7280">' + pendingCount + '</span><span class="adm-review-stat-label">待审核</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#059669">' + approvedCount + '</span><span class="adm-review-stat-label">已通过</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#ef4444">' + rejectedCount + '</span><span class="adm-review-stat-label">已拒绝</span></div>' +
                '</div>';

            html += '<div class="adm-table-wrap"><table class="adm-table adm-review-table"><thead><tr>' +
                '<th style="width:50px">序号</th>' +
                '<th>标题</th>' +
                '<th style="width:110px">发布者学号</th>' +
                '<th>描述</th>' +
                '<th style="width:100px">' + priceLabel + '</th>' +
                '<th style="width:80px">状态</th>' +
                '<th style="width:140px">发布时间</th>' +
                '<th style="width:140px">操作</th>' +
                '</tr></thead><tbody>';

            data.forEach(function(item, idx) {
                var statusHtml = '';
                if (item.status === 'pending') statusHtml = '<span class="adm-status-badge adm-status-pending">待审核</span>';
                else if (item.status === 'approved') statusHtml = '<span class="adm-status-badge adm-status-approved">已通过</span>';
                else statusHtml = '<span class="adm-status-badge adm-status-rejected">已拒绝</span>';

                var actions = '';
                if (item.status === 'pending') {
                    actions = '<button class="adm-btn-sm adm-btn-approve" data-tab="' + tab + '" data-id="' + item.id + '"><i class="fas fa-check"></i> 通过</button> ' +
                        '<button class="adm-btn-sm adm-btn-reject" data-tab="' + tab + '" data-id="' + item.id + '"><i class="fas fa-times"></i> 拒绝</button>';
                } else if (item.status === 'approved') {
                    actions = '<button class="adm-btn-sm adm-btn-reject" data-tab="' + tab + '" data-id="' + item.id + '"><i class="fas fa-undo"></i> 撤销</button>';
                } else {
                    actions = '<button class="adm-btn-sm adm-btn-approve" data-tab="' + tab + '" data-id="' + item.id + '"><i class="fas fa-redo"></i> 恢复</button>';
                }

                html += '<tr><td>' + (idx + 1) + '</td>' +
                    '<td style="font-weight:600;color:var(--text-primary)">' + item.title + '</td>' +
                    '<td style="color:var(--text-secondary)">' + item.stuId + '</td>' +
                    '<td style="color:var(--text-secondary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + item.desc + '">' + item.desc + '</td>' +
                    '<td style="font-weight:600;color:#165DFF">' + item.price + '</td>' +
                    '<td>' + statusHtml + '</td>' +
                    '<td style="color:var(--text-secondary);font-size:12px">' + item.time + '</td>' +
                    '<td>' + actions + '</td></tr>';
            });

            html += '</tbody></table></div>';
            container.innerHTML = html;

            /* 绑定审核按钮事件 */
            container.querySelectorAll('.adm-btn-approve').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var tabKey = btn.getAttribute('data-tab');
                    var itemId = btn.getAttribute('data-id');
                    var items = contentReviewData[tabKey];
                    var item = items.find(function(d) { return d.id === itemId; });
                    if (item) {
                        item.status = 'approved';
                        console.log('[内容审核] 审核通过:', itemId, '标签:', tabKey);
                        showToast('已通过审核', 'success');
                        renderContent(tabKey);
                    }
                });
            });
            container.querySelectorAll('.adm-btn-reject').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var tabKey = btn.getAttribute('data-tab');
                    var itemId = btn.getAttribute('data-id');
                    var items = contentReviewData[tabKey];
                    var item = items.find(function(d) { return d.id === itemId; });
                    if (item) {
                        item.status = 'rejected';
                        console.log('[内容审核] 审核拒绝:', itemId, '标签:', tabKey);
                        showToast('已拒绝', 'error');
                        renderContent(tabKey);
                    }
                });
            });
        });
    }

    function initAnnouncements() {
        renderAnnouncements();
        document.getElementById('announcementForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var title = document.getElementById('annTitle').value.trim();
            var cat = document.getElementById('annCat').value;
            var content = document.getElementById('annContent').value.trim();
            var pinned = document.getElementById('annPinned').checked;
            if (!title || !content) { showToast('请填写完整信息', 'error'); return; }
            var matched = checkSensitiveWords(title + content);
            if (matched.length > 0) {
                showToast('公告包含敏感词：' + matched.join('、') + '，请修改后发布', 'error');
                return;
            }
            var list = getAnnouncements();
            list.unshift({ id: Date.now(), title: title, cat: cat, content: content, pinned: pinned, time: new Date().toISOString() });
            saveAnnouncements(list);
            this.reset();
            renderAnnouncements();
            showToast('公告发布成功', 'success');
        });
    }

    function renderAnnouncements() {
        var list = getAnnouncements();
        var div = document.getElementById('annList');
        if (list.length === 0) {
            div.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:20px;font-size:13px">暂无公告</p>';
            return;
        }
        div.innerHTML = list.slice(0, 10).map(function(a) {
            return '<div class="adm-ann-item"><div class="adm-ann-item-info">' + (a.pinned ? '<span style="color:#ef4444;font-weight:600">[置顶]</span> ' : '') + '<h4>' + a.title + '</h4><p>' + a.cat + '</p><span>' + formatDate(a.time) + '</span></div><div class="adm-ann-item-actions"><button class="adm-btn-sm adm-btn-del" data-id="' + a.id + '"><i class="fas fa-trash"></i></button></div></div>';
        }).join('');
        div.querySelectorAll('.adm-btn-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.getAttribute('data-id'));
                var list = getAnnouncements().filter(function(a) { return a.id !== id; });
                saveAnnouncements(list);
                renderAnnouncements();
                showToast('公告已删除', 'success');
            });
        });
    }

    function initSensitive() {
        renderSensitiveWords();
        renderSensitiveStats();
        renderBlockLog();
        initBanModal();

        document.getElementById('sensitiveForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var word = document.getElementById('sensitiveWord').value.trim();
            var cat = document.getElementById('sensitiveCat').value;
            if (!word) { showToast('请输入敏感词', 'error'); return; }
            var list = getSensitiveWords();
            var exists = list.find(function(w) { return w.word === word; });
            if (exists) { showToast('该敏感词已存在', 'error'); return; }
            list.push({ id: Date.now(), word: word, cat: cat, addTime: new Date().toISOString() });
            saveSensitiveWords(list);
            document.getElementById('sensitiveWord').value = '';
            renderSensitiveWords();
            renderSensitiveStats();
            showToast('敏感词"' + word + '"添加成功', 'success');
        });

        document.getElementById('batchAddBtn').addEventListener('click', function() {
            var text = document.getElementById('sensitiveBatch').value.trim();
            if (!text) { showToast('请输入要批量添加的敏感词', 'error'); return; }
            var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
            if (lines.length === 0) { showToast('未检测到有效词汇', 'error'); return; }
            var list = getSensitiveWords();
            var added = 0;
            var skipped = 0;
            lines.forEach(function(word) {
                var exists = list.find(function(w) { return w.word === word; });
                if (!exists) {
                    list.push({ id: Date.now() + added, word: word, cat: '其他', addTime: new Date().toISOString() });
                    added++;
                } else {
                    skipped++;
                }
            });
            saveSensitiveWords(list);
            document.getElementById('sensitiveBatch').value = '';
            renderSensitiveWords();
            renderSensitiveStats();
            showToast('批量添加完成：新增' + added + '个' + (skipped > 0 ? '，跳过' + skipped + '个重复' : ''), 'success');
        });

        document.getElementById('sensitiveSearch').addEventListener('input', function() { renderSensitiveWords(this.value); });
        document.getElementById('sensitiveFilter').addEventListener('change', function() { renderSensitiveWords(document.getElementById('sensitiveSearch').value, this.value); });
    }

    function renderSensitiveWords(search, catFilter) {
        var list = getSensitiveWords();
        var container = document.getElementById('sensitiveList');

        if (search) {
            search = search.toLowerCase();
            list = list.filter(function(w) { return w.word.toLowerCase().indexOf(search) > -1; });
        }
        if (catFilter && catFilter !== 'all') {
            list = list.filter(function(w) { return w.cat === catFilter; });
        }

        if (list.length === 0) {
            container.innerHTML = '<div class="adm-empty-state"><i class="fas fa-filter"></i><p>暂无敏感词</p><span>添加敏感词后将自动拦截相关内容</span></div>';
            return;
        }

        var catColors = { '违禁词': '#ef4444', '侮辱词': '#f59e0b', '广告词': '#3b82f6', '政治敏感': '#8b5cf6', '其他': '#6b7280' };

        container.innerHTML = '<div class="adm-sensitive-grid">' + list.map(function(w) {
            var color = catColors[w.cat] || '#6b7280';
            return '<div class="adm-sensitive-tag"><span class="adm-sensitive-word">' + w.word + '</span><span class="adm-sensitive-cat" style="background:' + color + '20;color:' + color + '">' + w.cat + '</span><button class="adm-sensitive-del" data-id="' + w.id + '" title="删除"><i class="fas fa-times"></i></button></div>';
        }).join('') + '</div>';

        container.querySelectorAll('.adm-sensitive-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.getAttribute('data-id'));
                var list = getSensitiveWords().filter(function(w) { return w.id !== id; });
                saveSensitiveWords(list);
                renderSensitiveWords(document.getElementById('sensitiveSearch').value, document.getElementById('sensitiveFilter').value);
                renderSensitiveStats();
                showToast('敏感词已删除', 'success');
            });
        });
    }

    function renderSensitiveStats() {
        var list = getSensitiveWords();
        var log = getBlockLog();
        var statsDiv = document.getElementById('sensitiveStats');
        var catCount = {};
        list.forEach(function(w) { catCount[w.cat] = (catCount[w.cat] || 0) + 1; });
        statsDiv.innerHTML = '<div class="adm-sensitive-stat-row"><span>敏感词总数</span><strong>' + list.length + '</strong></div>' +
            Object.keys(catCount).map(function(cat) {
                return '<div class="adm-sensitive-stat-row"><span>' + cat + '</span><strong>' + catCount[cat] + '</strong></div>';
            }).join('') +
            '<div class="adm-sensitive-stat-row"><span>累计拦截次数</span><strong style="color:#ef4444">' + log.length + '</strong></div>';
    }

    function renderBlockLog() {
        var log = getBlockLog();
        var container = document.getElementById('blockLogList');
        if (!container) return;
        if (log.length === 0) {
            container.innerHTML = '<div class="adm-empty-state"><i class="fas fa-shield-alt"></i><p>暂无违规拦截记录</p><span>系统检测到敏感词后将自动记录</span></div>';
            return;
        }
        container.innerHTML = log.slice(0, 20).map(function(item) {
            var wordsStr = (item.words || []).join('、');
            return '<div class="adm-ban-record">' +
                '<div class="adm-ban-record-info">' +
                '<h4><i class="fas fa-exclamation-circle" style="color:#ef4444;margin-right:4px"></i>触发词：' + wordsStr + '</h4>' +
                '<p>来源：' + (item.source || '留言评论') + ' | 内容：' + (item.text || '') + '</p>' +
                '</div>' +
                '<div class="adm-ban-record-time">' + formatDateTime(item.time) + '</div>' +
                '<button class="adm-btn-sm adm-btn-danger ban-user-btn" data-logid="' + item.id + '" title="封号"><i class="fas fa-ban"></i> 封号</button>' +
                '</div>';
        }).join('');

        container.querySelectorAll('.ban-user-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var logId = parseInt(btn.getAttribute('data-logid'));
                var currentLog = getBlockLog();
                var logEntry = currentLog.find(function(l) { return l.id === logId; });
                if (logEntry) openBanModal(logEntry);
            });
        });
    }

    var currentBanLogEntry = null;

    function initBanModal() {
        var banModal = document.getElementById('banModal');
        var banClose = document.getElementById('banModalClose');
        var cancelBtn = document.getElementById('cancelBanBtn');
        var confirmBtn = document.getElementById('confirmBanBtn');

        if (banClose) banClose.addEventListener('click', function() { banModal.classList.remove('active'); });
        if (cancelBtn) cancelBtn.addEventListener('click', function() { banModal.classList.remove('active'); });
        banModal.addEventListener('click', function(e) { if (e.target === banModal) banModal.classList.remove('active'); });

        /* 封禁时长选项切换 */
        var durationLabels = document.querySelectorAll('#banDurationGroup label');
        durationLabels.forEach(function(label) {
            label.addEventListener('click', function() {
                durationLabels.forEach(function(l) { l.querySelector('.adm-ban-option').classList.remove('active'); });
                this.querySelector('.adm-ban-option').classList.add('active');
            });
        });

        if (confirmBtn) confirmBtn.addEventListener('click', function() {
            if (!currentBanLogEntry) return;
            var selectedRadio = document.querySelector('input[name="banDuration"]:checked');
            var duration = selectedRadio ? selectedRadio.value : '7';
            var banExpiry = null;
            if (duration === 'permanent') {
                banExpiry = 'permanent';
            } else {
                var days = parseInt(duration);
                var expiry = new Date();
                expiry.setDate(expiry.getDate() + days);
                banExpiry = expiry.toISOString();
            }
            var students = getStudents();
            var targetUser = null;
            /* 优先使用targetStuId（来自用户管理直接封号） */
            if (currentBanLogEntry.targetStuId) {
                targetUser = students.find(function(u) { return u.stuId === currentBanLogEntry.targetStuId; });
            } else {
                /* 从违规记录的source中匹配用户 */
                var sourceText = currentBanLogEntry.source || '';
                for (var i = 0; i < students.length; i++) {
                    if (sourceText.indexOf(students[i].stuId) > -1 || sourceText.indexOf(students[i].name) > -1) {
                        targetUser = students[i];
                        break;
                    }
                }
            }
            if (targetUser) {
                targetUser.status = 'banned';
                targetUser.banExpiry = banExpiry;
                targetUser.banReason = '发布违规内容：' + (currentBanLogEntry.words && currentBanLogEntry.words.length > 0 ? currentBanLogEntry.words.join('、') : '管理员手动封号');
                targetUser.banTime = new Date().toISOString();
                saveStudents(students);
            }
            banModal.classList.remove('active');
            renderBlockLog();
            renderUsers();
            showToast('用户已封号' + (duration === 'permanent' ? '（永久）' : '（' + duration + '天）'), 'success');
        });
    }

    function openBanModal(logEntry) {
        currentBanLogEntry = logEntry;
        var banModal = document.getElementById('banModal');
        document.getElementById('banUserName').textContent = logEntry.source || '未知用户';
        document.getElementById('banContent').textContent = logEntry.text || '无内容';
        /* 重置选项为7天 */
        var radios = document.querySelectorAll('input[name="banDuration"]');
        radios.forEach(function(r) { r.checked = r.value === '7'; });
        var options = document.querySelectorAll('.adm-ban-option');
        options.forEach(function(o) { o.classList.remove('active'); });
        if (options[0]) options[0].classList.add('active');
        banModal.classList.add('active');
    }

    function unbanUser(stuId) {
        var students = getStudents();
        var s = students.find(function(u) { return u.stuId === stuId; });
        if (s) {
            s.status = 'normal';
            s.banExpiry = null;
            s.banReason = '';
            s.banTime = null;
            saveStudents(students);
            renderUsers();
            showToast('用户已解封', 'success');
        }
    }

    function changeBanDuration(stuId, newDuration) {
        var students = getStudents();
        var s = students.find(function(u) { return u.stuId === stuId; });
        if (s) {
            if (newDuration === 'unban') {
                s.status = 'normal';
                s.banExpiry = null;
                s.banReason = '';
                s.banTime = null;
                showToast('用户已解封', 'success');
            } else if (newDuration === 'permanent') {
                s.banExpiry = 'permanent';
                showToast('已改为永久封禁', 'success');
            } else {
                var days = parseInt(newDuration);
                var expiry = new Date();
                expiry.setDate(expiry.getDate() + days);
                s.banExpiry = expiry.toISOString();
                showToast('封禁时长已修改为' + days + '天', 'success');
            }
            saveStudents(students);
            renderUsers();
        }
    }

    function checkAndAutoUnban() {
        var students = getStudents();
        var changed = false;
        var now = new Date();
        students.forEach(function(s) {
            if (s.status === 'banned' && s.banExpiry && s.banExpiry !== 'permanent') {
                var expiry = new Date(s.banExpiry);
                if (now >= expiry) {
                    s.status = 'normal';
                    s.banExpiry = null;
                    s.banReason = '';
                    s.banTime = null;
                    changed = true;
                }
            }
        });
        if (changed) saveStudents(students);
    }

    function initSettings() {
        document.getElementById('settingsForm').addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('设置已保存', 'success');
        });
        document.getElementById('clearDataBtn').addEventListener('click', function() {
            if (confirm('确定清除所有数据？此操作不可恢复！')) {
                if (window.CampusDB) {
                    CampusDB.clearAll();
                } else {
                    localStorage.removeItem('campus_students');
                    localStorage.removeItem('campus_announcements');
                    localStorage.removeItem('campus_repairs');
                    localStorage.removeItem('campus_secondhand');
                    localStorage.removeItem('campus_visit_count');
                    localStorage.removeItem('campus_block_log');
                }
                showToast('数据已清除', 'success');
                setTimeout(function() { location.reload(); }, 1000);
            }
        });
    }

    function initLogout() {
        document.getElementById('admLogout').addEventListener('click', function() {
            if (window.CampusDB) { CampusDB.clearCurrentUser(); } else { localStorage.removeItem('campus_current_user'); }
            window.location.href = 'login.html';
        });
        document.getElementById('admModalClose').addEventListener('click', function() { document.getElementById('admModal').classList.remove('active'); });
        document.getElementById('admModal').addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });
    }

    function formatDate(iso) {
        if (!iso) return '-';
        var d = new Date(iso);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function formatDateTime(iso) {
        if (!iso) return '-';
        var d = new Date(iso);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }

    function showToast(msg, type) {
        var toast = document.getElementById('lgToast');
        toast.textContent = msg;
        toast.className = 'lg-toast ' + type + ' show';
        setTimeout(function() { toast.classList.remove('show'); }, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
