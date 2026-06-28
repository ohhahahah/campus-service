(function() {
    /* 自定义拒绝理由弹窗（替代原生 prompt） */
    var _rejectCallback = null;
    function showRejectDialog(callback, title) {
        var overlay = document.getElementById('rejectOverlay');
        var textarea = document.getElementById('rejectTextarea');
        var charCount = document.getElementById('rejectCharCount');
        var counter = textarea ? textarea.parentElement.querySelector('.adm-reject-counter') : null;
        if (!overlay || !textarea) { /* 降级：弹窗元素不存在时使用原生 prompt */
            var r = prompt(title || '请输入拒绝理由（可选）：');
            callback(r);
            return;
        }
        /* 更新标题 */
        var h3 = overlay.querySelector('.adm-reject-header h3');
        if (h3 && title) h3.innerHTML = '<i class="fas fa-comment-slash"></i> ' + title;
        else if (h3) h3.innerHTML = '<i class="fas fa-comment-slash"></i> 拒绝理由';
        textarea.value = '';
        if (charCount) charCount.textContent = '0';
        if (counter) counter.classList.remove('over');
        _rejectCallback = callback;
        overlay.classList.add('active');
        setTimeout(function() { textarea.focus(); }, 100);
    }
    function closeRejectDialog(result) {
        var overlay = document.getElementById('rejectOverlay');
        var textarea = document.getElementById('rejectTextarea');
        if (overlay) overlay.classList.remove('active');
        if (textarea) textarea.value = '';
        if (_rejectCallback) {
            var cb = _rejectCallback;
            _rejectCallback = null;
            cb(result);
        }
    }
    function initRejectDialog() {
        var overlay = document.getElementById('rejectOverlay');
        var textarea = document.getElementById('rejectTextarea');
        var charCount = document.getElementById('rejectCharCount');
        var counter = textarea ? textarea.parentElement.querySelector('.adm-reject-counter') : null;
        if (!overlay) return;
        document.getElementById('rejectConfirmBtn').addEventListener('click', function() {
            var val = textarea ? textarea.value.trim() : '';
            closeRejectDialog(val || '');
        });
        document.getElementById('rejectCancelBtn').addEventListener('click', function() {
            closeRejectDialog(null);
        });
        document.getElementById('rejectCloseBtn').addEventListener('click', function() {
            closeRejectDialog(null);
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeRejectDialog(null);
        });
        if (textarea && charCount) {
            textarea.addEventListener('input', function() {
                var len = textarea.value.length;
                charCount.textContent = len;
                if (counter) {
                    if (len > 200) counter.classList.add('over');
                    else counter.classList.remove('over');
                }
            });
        }
    }

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
        var STORAGE_KEY = 'campus_secondhand_v2';
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            if (v) return JSON.parse(v);
        } catch(e) {}
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
        initRejectDialog();
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
                /* 移动端：点击导航后自动收起侧边栏 */
                if (window.innerWidth <= 768) closeAdminSidebar();
            });
        });
        /* 移动端菜单按钮：打开/关闭侧边栏抽屉 */
        var menuToggle = document.getElementById('menuToggle');
        if (menuToggle && !menuToggle.dataset.admBound) {
            menuToggle.dataset.admBound = '1';
            menuToggle.addEventListener('click', toggleAdminSidebar);
        }
    }

    /* 移动端侧边栏抽屉开关 */
    function toggleAdminSidebar() {
        var sidebar = document.getElementById('admSidebar');
        if (!sidebar) return;
        var isOpen = sidebar.classList.toggle('open');
        /* 创建/移除遮罩 */
        var mask = document.querySelector('.adm-sidebar-mask');
        if (!mask) {
            mask = document.createElement('div');
            mask.className = 'adm-sidebar-mask';
            document.body.appendChild(mask);
            mask.addEventListener('click', closeAdminSidebar);
        }
        if (isOpen) mask.classList.add('active');
        else mask.classList.remove('active');
    }
    function closeAdminSidebar() {
        var sidebar = document.getElementById('admSidebar');
        var mask = document.querySelector('.adm-sidebar-mask');
        if (sidebar) sidebar.classList.remove('open');
        if (mask) mask.classList.remove('active');
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
        if (panel === 'merchants') renderMerchantLists();
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

    /* 用户审核筛选状态 */
    var _userFilter = 'pending';

    function initUsers() {
        initUserModals();
        renderUsers();
        document.getElementById('userSearch').addEventListener('input', function() { renderUsers(this.value); });
        document.getElementById('addUserBtn').addEventListener('click', function() { showAddUserModal(); });
    }

    function renderUsers(search) {
        checkAndAutoUnban();
        var allStudents = getStudents();
        var pending = allStudents.filter(function(s) { return s.status === 'pending'; });
        var approved = allStudents.filter(function(s) { return s.status === 'approved'; });
        var banned = allStudents.filter(function(s) { return s.status === 'banned'; });
        var rejected = allStudents.filter(function(s) { return s.status === 'rejected'; });

        /* ======== 统计摘要栏 ======== */
        var statsEl = document.getElementById('userStats');
        if (statsEl) {
            statsEl.innerHTML =
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#f59e0b">' + pending.length + '</span><span class="adm-review-stat-label">待审核</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#10b981">' + approved.length + '</span><span class="adm-review-stat-label">已通过</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#ef4444">' + rejected.length + '</span><span class="adm-review-stat-label">已驳回</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#8b5cf6">' + banned.length + '</span><span class="adm-review-stat-label">已封禁</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#6b7280">' + allStudents.length + '</span><span class="adm-review-stat-label">总计</span></div>';
        }

        /* ======== 筛选按钮栏 ======== */
        var filterEl = document.getElementById('userFilterBar');
        if (filterEl) {
            var filters = [
                { key: 'pending', label: '待审核', count: pending.length, color: '#f59e0b' },
                { key: 'approved', label: '已通过', count: approved.length, color: '#10b981' },
                { key: 'rejected', label: '已驳回', count: rejected.length, color: '#ef4444' },
                { key: 'banned', label: '已封禁', count: banned.length, color: '#8b5cf6' },
                { key: 'all', label: '全部', count: allStudents.length, color: '#6b7280' }
            ];
            var fhtml = '';
            filters.forEach(function(f) {
                var isActive = _userFilter === f.key;
                fhtml += '<button class="adm-filter-btn ' + (isActive ? 'active' : '') + '" data-filter="' + f.key + '" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (isActive ? f.color : 'var(--bg-secondary)') + ';color:' + (isActive ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px;font-weight:500;transition:all .2s">' + f.label + ' (' + f.count + ')</button>';
            });
            filterEl.innerHTML = fhtml;
            filterEl.querySelectorAll('.adm-filter-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    _userFilter = btn.getAttribute('data-filter');
                    renderUsers(search);
                });
            });
        }

        /* ======== 数据筛选 ======== */
        var students = allStudents;
        if (_userFilter === 'pending') students = pending;
        else if (_userFilter === 'approved') students = approved;
        else if (_userFilter === 'rejected') students = rejected;
        else if (_userFilter === 'banned') students = banned;

        if (search) {
            search = search.toLowerCase();
            students = students.filter(function(s) { return s.stuId.toLowerCase().indexOf(search) > -1 || s.name.toLowerCase().indexOf(search) > -1; });
        }

        var wrap = document.getElementById('userListWrap');
        if (students.length === 0) {
            var emptyLabel = _userFilter === 'pending' ? '待审核' : _userFilter === 'approved' ? '已通过' : _userFilter === 'rejected' ? '已驳回' : _userFilter === 'banned' ? '已封禁' : '';
            wrap.innerHTML = '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + emptyLabel + '用户</p></div>';
            return;
        }

        var html = '<div class="adm-table-wrap"><table class="adm-table adm-review-table"><thead><tr>' +
            '<th>学号</th><th>姓名</th><th>院系</th><th>联系电话</th><th>状态</th><th>注册时间</th><th>操作</th>' +
            '</tr></thead><tbody>';

        students.forEach(function(s) {
            var statusHtml = '';
            if (s.status === 'pending') statusHtml = '<span class="adm-status-badge adm-status-pending">待审核</span>';
            else if (s.status === 'rejected') statusHtml = '<span class="adm-status-badge adm-status-rejected">已驳回</span>';
            else if (s.status === 'banned') statusHtml = '<span class="adm-status-badge adm-status-banned">已封禁</span>';
            else statusHtml = '<span class="adm-status-badge adm-status-approved">已通过</span>';

            var actions = '<button class="adm-btn-sm" data-action="detail" data-stuid="' + s.stuId + '" style="background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe"><i class="fas fa-eye"></i> 详情</button> ';

            if (s.status === 'pending') {
                actions += '<button class="adm-btn-sm" data-action="approve" data-stuid="' + s.stuId + '" style="background:#ecfdf5;color:#059669;border:1px solid #a7f3d0"><i class="fas fa-check"></i> 通过</button> ';
                actions += '<button class="adm-btn-sm" data-action="reject" data-stuid="' + s.stuId + '" style="background:#fef2f2;color:#ef4444;border:1px solid #fecaca"><i class="fas fa-times"></i> 驳回</button>';
            } else if (s.status === 'approved') {
                actions += '<button class="adm-btn-sm" data-action="ban" data-stuid="' + s.stuId + '" style="background:#fef2f2;color:#ef4444;border:1px solid #fecaca"><i class="fas fa-ban"></i> 封禁</button>';
            } else if (s.status === 'banned') {
                actions += '<button class="adm-btn-sm" data-action="unban" data-stuid="' + s.stuId + '" style="background:#ecfdf5;color:#059669;border:1px solid #a7f3d0"><i class="fas fa-unlock"></i> 解封</button>';
            }

            html += '<tr><td style="font-weight:600">' + s.stuId + '</td><td>' + escHtml(s.name) + '</td><td>' + escHtml(s.dept) + '</td><td>' + escHtml(s.phone || '-') + '</td><td>' + statusHtml + '</td><td style="font-size:12px;color:var(--text-secondary)">' + formatDate(s.regTime) + '</td><td style="white-space:nowrap">' + actions + '</td></tr>';
        });

        html += '</tbody></table></div>';
        wrap.innerHTML = html;

        /* 绑定操作按钮（事件委托） */
        var detailBtns = wrap.querySelectorAll('[data-action="detail"]');
        var approveBtns = wrap.querySelectorAll('[data-action="approve"]');
        var rejectBtns = wrap.querySelectorAll('[data-action="reject"]');
        console.log('[用户审核] 渲染完成，按钮数：详情=' + detailBtns.length + ' 通过=' + approveBtns.length + ' 驳回=' + rejectBtns.length);

        wrap.onclick = function(e) {
            var btn = e.target.closest('[data-action]');
            if (!btn) return;
            var action = btn.getAttribute('data-action');
            var stuId = btn.getAttribute('data-stuid');
            console.log('[用户审核] 按钮点击：action=' + action + ' stuId=' + stuId);

            if (action === 'detail') {
                openUserDetail(stuId);
            } else if (action === 'approve') {
                if (!confirm('确定审核通过该用户注册申请？')) return;
                var result = doUserReview(stuId, 'approved', '');
                console.log('[用户审核] doUserReview 返回=', result);
                if (result) { showToast('审核通过', 'success'); _userFilter = 'approved'; renderUsers(search); }
                else { showToast('操作失败', 'error'); }
            } else if (action === 'reject') {
                _currentUserId = stuId;
                document.getElementById('userRejectReason').value = '';
                document.getElementById('userRejectOverlay').classList.add('active');
            } else if (action === 'ban') {
                var students = getStudents();
                var s = students.find(function(u) { return u.stuId === stuId; });
                if (s) {
                    currentBanLogEntry = { source: s.name + '(' + s.stuId + ')', text: '管理员手动封号', words: [], targetStuId: stuId };
                    openBanModal(currentBanLogEntry);
                }
            } else if (action === 'unban') {
                if (confirm('确定解封该用户？')) { unbanUser(stuId); _userFilter = 'approved'; renderUsers(search); }
            }
        };
    }

    /* 当前弹窗中的用户学号 */
    var _currentUserId = null;

    /* 执行用户审核 */
    function doUserReview(stuId, status, rejectReason) {
        try {
            console.log('[用户审核] doUserReview 开始，stuId=' + stuId + ' status=' + status);
            var list = getStudents();
            var found = list.find(function(s) { return s.stuId === stuId; });
            if (!found) { console.log('[用户审核] 未找到用户', stuId); return false; }
            console.log('[用户审核] 找到用户，当前status=' + found.status);
            if (status === 'approved' && found.status !== 'pending' && found.status !== 'rejected') {
                console.log('[用户审核] 状态不允许通过');
                return false;
            }
            found.status = status;
            found.reviewTime = new Date().toLocaleString();
            found.reviewer = 'admin';
            if (rejectReason) found.rejectReason = rejectReason;
            if (status === 'approved') found.rejectReason = '';
            saveStudents(list);
            console.log('[用户审核] 保存成功，新status=' + found.status);
            return true;
        } catch(e) { console.error('[用户审核] doUserReview 异常', e); return false; }
    }

    /* 打开用户详情弹窗 */
    function openUserDetail(stuId) {
        var students = getStudents();
        var s = students.find(function(u) { return u.stuId === stuId; });
        if (!s) { showToast('未找到用户信息', 'error'); return; }
        _currentUserId = stuId;
        var isPending = s.status === 'pending';
        var isApproved = s.status === 'approved';
        var isRejected = s.status === 'rejected';
        var isBanned = s.status === 'banned';

        var infoHtml =
            '<div class="mch-detail-section">' +
                '<div class="mch-detail-section-title"><i class="fas fa-user"></i> 基本信息</div>' +
                '<div class="mch-detail-grid">' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-id-card"></i> 学号</span><span class="mch-detail-value">' + escHtml(s.stuId) + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-user"></i> 姓名</span><span class="mch-detail-value">' + escHtml(s.name) + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-building"></i> 院系</span><span class="mch-detail-value">' + escHtml(s.dept) + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-phone"></i> 联系电话</span><span class="mch-detail-value">' + escHtml(s.phone || '-') + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-graduation-cap"></i> 年级</span><span class="mch-detail-value">' + escHtml(s.grade || '-') + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-calendar-alt"></i> 注册时间</span><span class="mch-detail-value">' + formatDate(s.regTime) + '</span></div>' +
                '</div>' +
            '</div>';

        /* 审核信息区 */
        var reviewHtml = '';
        if (s.reviewTime || s.rejectReason || s.banReason) {
            reviewHtml = '<div class="mch-detail-section">' +
                '<div class="mch-detail-section-title"><i class="fas fa-gavel"></i> 审核信息</div>' +
                '<div class="mch-detail-grid">' +
                    (s.reviewTime ? '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-clock"></i> 审核时间</span><span class="mch-detail-value">' + escHtml(s.reviewTime) + '</span></div>' : '') +
                    (s.reviewer ? '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-user-shield"></i> 审核人</span><span class="mch-detail-value">' + escHtml(s.reviewer) + '</span></div>' : '') +
                    (s.rejectReason ? '<div class="mch-detail-item full"><span class="mch-detail-label"><i class="fas fa-comment-slash"></i> 驳回原因</span><span class="mch-detail-value" style="color:#ef4444">' + escHtml(s.rejectReason) + '</span></div>' : '') +
                    (s.banReason ? '<div class="mch-detail-item full"><span class="mch-detail-label"><i class="fas fa-ban"></i> 封禁原因</span><span class="mch-detail-value" style="color:#ef4444">' + escHtml(s.banReason) + '</span></div>' : '') +
                    (s.banExpiry ? '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-calendar-times"></i> 封禁到期</span><span class="mch-detail-value" style="color:#ef4444">' + (s.banExpiry === 'permanent' ? '永久' : formatDate(s.banExpiry)) + '</span></div>' : '') +
                '</div>' +
            '</div>';
        }

        document.getElementById('userDetailBody').innerHTML = infoHtml + reviewHtml;

        /* 底部按钮 */
        var footerHtml = '';
        if (isPending) {
            footerHtml =
                '<button class="mch-detail-btn mch-detail-btn-close" id="userCloseBtn"><i class="fas fa-xmark"></i> 关闭</button>' +
                '<button class="mch-detail-btn mch-detail-btn-approve" id="userApproveBtn"><i class="fas fa-check"></i> 通过审核</button>' +
                '<button class="mch-detail-btn mch-detail-btn-reject" id="userRejectBtn"><i class="fas fa-times"></i> 驳回申请</button>';
        } else if (isBanned) {
            footerHtml =
                '<button class="mch-detail-btn mch-detail-btn-close" id="userCloseBtn"><i class="fas fa-xmark"></i> 关闭</button>' +
                '<button class="mch-detail-btn" id="userUnbanBtn" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;box-shadow:0 2px 8px rgba(139,92,246,.25)"><i class="fas fa-unlock"></i> 解除封禁</button>';
        } else if (isRejected) {
            footerHtml =
                '<button class="mch-detail-btn mch-detail-btn-close" id="userCloseBtn"><i class="fas fa-xmark"></i> 关闭</button>' +
                '<button class="mch-detail-btn mch-detail-btn-approve" id="userApproveBtn"><i class="fas fa-check"></i> 重新通过</button>';
        } else {
            footerHtml =
                '<button class="mch-detail-btn mch-detail-btn-close" id="userCloseBtn"><i class="fas fa-xmark"></i> 关闭</button>' +
                '<button class="mch-detail-btn mch-detail-btn-approve" disabled><i class="fas fa-check-circle"></i> 已通过</button>';
        }
        document.getElementById('userDetailFooter').innerHTML = footerHtml;

        document.getElementById('userDetailOverlay').classList.add('active');

        /* 绑定关闭 */
        var closeBtn = document.getElementById('userCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', closeUserDetail);

        /* 绑定通过 */
        var approveBtn = document.getElementById('userApproveBtn');
        if (approveBtn && (isPending || isRejected)) {
            approveBtn.addEventListener('click', function() {
                if (!confirm('确定审核通过该用户？')) return;
                var result = doUserReview(_currentUserId, 'approved', '');
                if (result) { showToast('审核通过', 'success'); closeUserDetail(); _userFilter = 'approved'; renderUsers(); }
                else { showToast('操作失败', 'error'); }
            });
        }

        /* 绑定驳回 */
        var rejectBtn = document.getElementById('userRejectBtn');
        if (rejectBtn && isPending) {
            rejectBtn.addEventListener('click', function() {
                document.getElementById('userRejectReason').value = '';
                document.getElementById('userRejectOverlay').classList.add('active');
            });
        }

        /* 绑定解封 */
        var unbanBtn = document.getElementById('userUnbanBtn');
        if (unbanBtn && isBanned) {
            unbanBtn.addEventListener('click', function() {
                if (!confirm('确定解封该用户？')) return;
                unbanUser(_currentUserId);
                closeUserDetail();
                _userFilter = 'approved';
                renderUsers();
            });
        }
    }

    /* 关闭用户详情弹窗 */
    function closeUserDetail() {
        document.getElementById('userDetailOverlay').classList.remove('active');
        _currentUserId = null;
    }

    /* 初始化用户弹窗事件 */
    function initUserModals() {
        /* 详情弹窗关闭 */
        document.getElementById('userDetailClose').addEventListener('click', closeUserDetail);
        document.getElementById('userDetailOverlay').addEventListener('click', function(e) {
            if (e.target === this) closeUserDetail();
        });

        /* 驳回弹窗 */
        document.getElementById('userRejectClose').addEventListener('click', function() {
            document.getElementById('userRejectOverlay').classList.remove('active');
        });
        document.getElementById('userRejectCancel').addEventListener('click', function() {
            document.getElementById('userRejectOverlay').classList.remove('active');
        });
        document.getElementById('userRejectOverlay').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
        document.getElementById('userRejectConfirm').addEventListener('click', function() {
            var reason = document.getElementById('userRejectReason').value.trim();
            if (!reason) reason = '不符合注册要求';
            document.getElementById('userRejectOverlay').classList.remove('active');
            var result = doUserReview(_currentUserId, 'rejected', reason);
            if (result) {
                showToast('已驳回申请', 'success');
                closeUserDetail();
                _userFilter = 'rejected';
                renderUsers();
            } else {
                showToast('操作失败', 'error');
            }
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

    /* ========== 内容审核模块（从 localStorage 读取真实数据） ========== */

    /* 当前审核标签和筛选状态 */
    var currentReviewTab = 'secondhand';
    var currentReviewFilter = 'pending'; // pending / approved / rejected / all

    function initContent() {
        console.log('[内容审核] 初始化，使用 SecondhandAPI 真实数据');

        document.querySelectorAll('.adm-tab[data-ctab]').forEach(function(tab) {
            tab.addEventListener('click', function() {
                var newTab = tab.getAttribute('data-ctab');
                if (newTab === currentReviewTab) return;
                document.querySelectorAll('.adm-tab[data-ctab]').forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                currentReviewTab = newTab;
                currentReviewFilter = 'pending';
                console.log('[内容审核] 切换标签 →', currentReviewTab);
                renderContent(currentReviewTab);
            });
        });

        renderContent(currentReviewTab);
    }

    function renderContent(tab) {
        var container = document.getElementById('contentList');
        var tabLabels = { secondhand: '二手商品', rental: '教材租用', parttime: '兼职信息', pets: '流浪猫' };

        /* 显示加载状态 */
        container.innerHTML = '<div class="adm-loading"><div class="adm-loading-spinner"></div><span>加载中...</span></div>';

        if (tab === 'secondhand') {
            /* 二手商品：优先从 SecondhandAPI 获取，降级从 localStorage 读取 */
            if (window.SecondhandAPI) {
                SecondhandAPI.getReviewList({ status: currentReviewFilter, page: 1, pageSize: 50 }).then(function(result) {
                    renderSecondhandReview(container, result, tabLabels[tab]);
                }).catch(function(err) {
                    console.warn('[内容审核] API加载失败，使用本地数据:', err);
                    renderSecondhandReviewLocal(container, tabLabels[tab]);
                });
            } else {
                renderSecondhandReviewLocal(container, tabLabels[tab]);
            }
        } else if (tab === 'rental') {
            /* 教材租用：优先从 RentalAPI 获取，降级从 localStorage 读取 */
            if (window.RentalAPI) {
                RentalAPI.getReviewList({ status: currentReviewFilter, page: 1, pageSize: 50 }).then(function(result) {
                    renderRentalReviewAPI(container, result, tabLabels[tab]);
                }).catch(function(err) {
                    console.warn('[内容审核] 教材租用API加载失败，使用本地数据:', err);
                    renderRentalReviewLocal(container, tabLabels[tab]);
                });
            } else {
                renderRentalReviewLocal(container, tabLabels[tab]);
            }
        } else if (tab === 'parttime') {
            /* 兼职信息：从 localStorage 读取 */
            renderParttimeReview(container, tabLabels[tab]);
        } else if (tab === 'pets') {
            /* 流浪猫：从 localStorage 读取 */
            renderPetsReview(container, tabLabels[tab]);
        }
    }

    /* 本地降级：渲染二手商品审核列表（从 localStorage 读取） */
    function renderSecondhandReviewLocal(container, tabLabel) {
        var products = getSecondhandItems();

        var pending = products.filter(function(p) { return p.reviewStatus === 'pending'; }).length;
        var approved = products.filter(function(p) { return p.reviewStatus === 'approved'; }).length;
        var rejected = products.filter(function(p) { return p.reviewStatus === 'rejected'; }).length;

        var data = currentReviewFilter === 'all' ? products : products.filter(function(p) { return p.reviewStatus === currentReviewFilter; });

        var html = '<div class="adm-review-filter-bar" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center">';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'pending' ? 'active' : '') + '" data-filter="pending" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'pending' ? '#3b82f6' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'pending' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">待审核 (' + pending + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'approved' ? 'active' : '') + '" data-filter="approved" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'approved' ? '#10b981' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'approved' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已通过 (' + approved + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'rejected' ? 'active' : '') + '" data-filter="rejected" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'rejected' ? '#ef4444' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'rejected' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已拒绝 (' + rejected + ')</button>';
        html += '</div>';

        if (data.length === 0) {
            html += '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + (currentReviewFilter === 'pending' ? '待审核' : currentReviewFilter === 'approved' ? '已通过' : currentReviewFilter === 'rejected' ? '已拒绝' : '') + tabLabel + '</p></div>';
            container.innerHTML = html;
            bindFilterButtons(container);
            return;
        }

        html += '<div class="adm-table-wrap"><table class="adm-table adm-review-table"><thead><tr>' +
            '<th>商品名称</th><th>发布者</th><th>价格</th><th>状态</th><th>操作</th></tr></thead><tbody>';

        data.forEach(function(item) {
            var statusHtml = item.reviewStatus === 'pending' ? '<span class="adm-status-badge adm-status-pending">待审核</span>' :
                item.reviewStatus === 'approved' ? '<span class="adm-status-badge adm-status-approved">已通过</span>' :
                '<span class="adm-status-badge adm-status-rejected">已拒绝</span>';
            var actions = '';
            if (item.reviewStatus === 'pending') {
                actions = '<button class="adm-btn-sm adm-btn-approve" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-check"></i> 通过</button> ' +
                    '<button class="adm-btn-sm adm-btn-reject" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-times"></i> 拒绝</button>';
            } else if (item.reviewStatus === 'approved') {
                actions = '<button class="adm-btn-sm adm-btn-reject" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-undo"></i> 撤销</button>';
            } else {
                actions = '<button class="adm-btn-sm adm-btn-approve" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-redo"></i> 恢复</button>';
            }
            html += '<tr><td>' + (item.name || '未知') + '</td><td>' + (item.seller || '未知') + '</td><td>¥' + (item.price || 0) + '</td><td>' + statusHtml + '</td><td>' + actions + '</td></tr>';
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;

        bindFilterButtons(container);

        /* 绑定审核操作按钮 */
        container.querySelectorAll('.adm-btn-approve').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var productId = parseInt(btn.getAttribute('data-id'));
                localApproveProduct(productId);
            });
        });
        container.querySelectorAll('.adm-btn-reject').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var productId = parseInt(btn.getAttribute('data-id'));
                localRejectProduct(productId); /* 内部会弹 prompt */
            });
        });
    }

    /* 渲染二手商品审核列表（API模式） */
    function renderSecondhandReview(container, result, tabLabel) {
        var data = result.list || [];
        var total = result.total || 0;

        /* 获取各状态数量统计 */
        SecondhandAPI.getReviewStats().then(function(stats) {
            var html = '<div class="adm-review-filter-bar" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center">';
            html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'pending' ? 'active' : '') + '" data-filter="pending" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'pending' ? '#3b82f6' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'pending' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">待审核 (' + stats.pending + ')</button>';
            html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'approved' ? 'active' : '') + '" data-filter="approved" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'approved' ? '#10b981' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'approved' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已通过 (' + stats.approved + ')</button>';
            html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'rejected' ? 'active' : '') + '" data-filter="rejected" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'rejected' ? '#ef4444' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'rejected' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已拒绝 (' + stats.rejected + ')</button>';
            html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'all' ? 'active' : '') + '" data-filter="all" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'all' ? '#6b7280' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'all' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">全部 (' + stats.total + ')</button>';
            html += '</div>';

            if (data.length === 0) {
                html += '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + (currentReviewFilter === 'pending' ? '待审核' : currentReviewFilter === 'approved' ? '已通过' : currentReviewFilter === 'rejected' ? '已拒绝' : '') + tabLabel + '</p></div>';
                container.innerHTML = html;
                bindFilterButtons(container);
                return;
            }

            html += '<div class="adm-table-wrap"><table class="adm-table adm-review-table"><thead><tr>' +
                '<th style="width:60px">图片</th>' +
                '<th>商品名称</th>' +
                '<th style="width:80px">分类</th>' +
                '<th style="width:90px">价格</th>' +
                '<th style="width:90px">发布人</th>' +
                '<th style="width:80px">状态</th>' +
                '<th style="width:130px">发布时间</th>' +
                '<th style="width:160px">操作</th>' +
                '</tr></thead><tbody>';

            data.forEach(function(item) {
                var statusHtml = '';
                if (item.reviewStatus === 'pending') statusHtml = '<span class="adm-status-badge adm-status-pending">待审核</span>';
                else if (item.reviewStatus === 'approved') statusHtml = '<span class="adm-status-badge adm-status-approved">已通过</span>';
                else statusHtml = '<span class="adm-status-badge adm-status-rejected">已拒绝</span>';

                var actions = '';
                if (item.reviewStatus === 'pending') {
                    actions = '<button class="adm-btn-sm adm-btn-approve" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-check"></i> 通过</button> ' +
                        '<button class="adm-btn-sm adm-btn-reject" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-times"></i> 拒绝</button>';
                } else if (item.reviewStatus === 'approved') {
                    actions = '<button class="adm-btn-sm adm-btn-reject" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-undo"></i> 撤销</button>';
                } else {
                    actions = '<button class="adm-btn-sm adm-btn-approve" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-redo"></i> 恢复</button>';
                }

                var imgHtml = '<div style="width:40px;height:40px;border-radius:6px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;overflow:hidden"><i class="fas fa-image" style="color:#94a3b8;font-size:14px"></i></div>';
                if (item.images && item.images.length > 0) {
                    imgHtml = '<div style="width:40px;height:40px;border-radius:6px;overflow:hidden"><img src="' + item.images[0] + '" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML=\'<i class=\\\'fas fa-image\\\' style=\\\'color:#94a3b8;font-size:14px;display:flex;align-items:center;justify-content:center;width:100%;height:100%\\\'></i>\'"></div>';
                }

                html += '<tr><td>' + imgHtml + '</td>' +
                    '<td style="font-weight:600;color:var(--text-primary)">' + item.name + '</td>' +
                    '<td style="color:var(--text-secondary)">' + item.category + '</td>' +
                    '<td style="font-weight:600;color:#165DFF">¥' + item.price + '</td>' +
                    '<td style="color:var(--text-secondary)">' + item.seller + '</td>' +
                    '<td>' + statusHtml + '</td>' +
                    '<td style="color:var(--text-secondary);font-size:12px">' + (item.time || '-') + '</td>' +
                    '<td>' + actions + '</td></tr>';
            });

            html += '</tbody></table></div>';
            container.innerHTML = html;

            /* 绑定筛选按钮 */
            bindFilterButtons(container);

            /* 绑定审核操作按钮 */
            container.querySelectorAll('.adm-btn-approve').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var productId = parseInt(btn.getAttribute('data-id'));
                    if (window.SecondhandAPI) {
                        SecondhandAPI.approveProduct({ productId: productId, reviewer: '管理员' }).then(function(res) {
                            if (res.success) { showToast('审核通过', 'success'); renderContent(currentReviewTab); }
                            else { showToast(res.message || '操作失败', 'error'); }
                        }).catch(function() {
                            /* API失败时本地降级 */
                            localApproveProduct(productId);
                        });
                    } else {
                        localApproveProduct(productId);
                    }
                });
            });
            container.querySelectorAll('.adm-btn-reject').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var productId = parseInt(btn.getAttribute('data-id'));
                    showRejectDialog(function(reason) {
                        if (reason === null) return; /* 用户取消 */
                        if (window.SecondhandAPI) {
                            SecondhandAPI.rejectProduct({ productId: productId, reviewer: '管理员', reviewNote: reason }).then(function(res) {
                                if (res.success) { showToast('已拒绝', 'error'); renderContent(currentReviewTab); }
                                else { showToast(res.message || '操作失败', 'error'); }
                            }).catch(function() {
                                localRejectProduct(productId, reason);
                            });
                        } else {
                            localRejectProduct(productId, reason);
                        }
                    });
                });
            });
        });
    }

    /* 绑定筛选按钮事件 */
    function bindFilterButtons(container) {
        container.querySelectorAll('.adm-filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                currentReviewFilter = btn.getAttribute('data-filter');
                renderContent(currentReviewTab);
            });
        });
    }

    /* 本地审核操作（无后端API时的降级方案） */
    function localApproveProduct(productId) {
        var products = getSecondhandItems();
        var product = products.find(function(p) { return p.id === productId; });
        if (product) {
            product.reviewStatus = 'approved';
            product.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            /* 写回统一存储 */
            var STORAGE_KEY = 'campus_secondhand_v2';
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); } catch(e) {}
            localStorage.setItem('campus_secondhand', JSON.stringify(products));
            showToast('审核通过', 'success');
            renderContent(currentReviewTab);
        } else {
            showToast('商品不存在', 'error');
        }
    }

    function localRejectProduct(productId, reason) {
        if (reason === undefined) {
            showRejectDialog(function(r) {
                if (r === null) return;
                localRejectProduct(productId, r);
            });
            return;
        }
        var products = getSecondhandItems();
        var product = products.find(function(p) { return p.id === productId; });
        if (product) {
            product.reviewStatus = 'rejected';
            product.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            if (reason) product.rejectReason = reason;
            /* 写回统一存储 */
            var STORAGE_KEY = 'campus_secondhand_v2';
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); } catch(e) {}
            localStorage.setItem('campus_secondhand', JSON.stringify(products));
            showToast('已拒绝', 'error');
            renderContent(currentReviewTab);
        } else {
            showToast('商品不存在', 'error');
        }
    }

    /* 统一获取教材租用列表 */
    function getRentalBooks() {
        var STORAGE_KEY = 'campus_rental_books_v2';
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            if (v) {
                var data = JSON.parse(v);
                if (data.length > 0) return data;
            }
        } catch(e) {}
        /* 兼容旧键 */
        try {
            var old = JSON.parse(localStorage.getItem('campus_rental_books') || '[]');
            if (old.length > 0) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(old));
                return old;
            }
        } catch(e2) {}
        if (window.CampusDB) return CampusDB.getRentalBooks ? CampusDB.getRentalBooks() : [];
        return [];
    }

    /* 本地审核操作：通过教材 */
    function localApproveRental(bookId) {
        var books = getRentalBooks();
        var book = books.find(function(b) { return b.id === bookId; });
        if (book) {
            book.reviewStatus = 'approved';
            book.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            var STORAGE_KEY = 'campus_rental_books_v2';
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); } catch(e) {}
            localStorage.setItem('campus_rental_books', JSON.stringify(books));
            showToast('审核通过', 'success');
            renderContent(currentReviewTab);
        } else {
            showToast('教材不存在', 'error');
        }
    }

    /* 本地审核操作：拒绝教材 */
    function localRejectRental(bookId, reason) {
        if (reason === undefined) {
            showRejectDialog(function(r) {
                if (r === null) return;
                localRejectRental(bookId, r);
            });
            return;
        }
        var books = getRentalBooks();
        var book = books.find(function(b) { return b.id === bookId; });
        if (book) {
            book.reviewStatus = 'rejected';
            book.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            if (reason) book.rejectReason = reason;
            var STORAGE_KEY = 'campus_rental_books_v2';
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); } catch(e) {}
            localStorage.setItem('campus_rental_books', JSON.stringify(books));
            showToast('已拒绝', 'error');
            renderContent(currentReviewTab);
        } else {
            showToast('教材不存在', 'error');
        }
    }

    /* 本地降级：渲染教材租用审核列表（从 localStorage 读取） */
    function renderRentalReviewLocal(container, tabLabel) {
        var books = getRentalBooks();

        var pending = books.filter(function(b) { return b.reviewStatus === 'pending'; }).length;
        var approved = books.filter(function(b) { return b.reviewStatus === 'approved'; }).length;
        var rejected = books.filter(function(b) { return b.reviewStatus === 'rejected'; }).length;

        var data = currentReviewFilter === 'all' ? books : books.filter(function(b) { return b.reviewStatus === currentReviewFilter; });

        var html = '<div class="adm-review-filter-bar" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center">';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'pending' ? 'active' : '') + '" data-filter="pending" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'pending' ? '#3b82f6' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'pending' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">待审核 (' + pending + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'approved' ? 'active' : '') + '" data-filter="approved" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'approved' ? '#10b981' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'approved' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已通过 (' + approved + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'rejected' ? 'active' : '') + '" data-filter="rejected" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'rejected' ? '#ef4444' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'rejected' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已拒绝 (' + rejected + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'all' ? 'active' : '') + '" data-filter="all" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'all' ? '#6b7280' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'all' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">全部 (' + books.length + ')</button>';
        html += '</div>';

        if (data.length === 0) {
            html += '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + (currentReviewFilter === 'pending' ? '待审核' : currentReviewFilter === 'approved' ? '已通过' : currentReviewFilter === 'rejected' ? '已拒绝' : '') + tabLabel + '</p></div>';
            container.innerHTML = html;
            bindFilterButtons(container);
            return;
        }

        html += '<div class="adm-table-wrap"><table class="adm-table adm-review-table"><thead><tr>' +
            '<th style="width:60px">图片</th>' +
            '<th>书名</th>' +
            '<th style="width:80px">租金</th>' +
            '<th style="width:90px">发布者</th>' +
            '<th style="width:100px">所属学院</th>' +
            '<th style="width:80px">状态</th>' +
            '<th style="width:130px">提交时间</th>' +
            '<th style="width:160px">操作</th>' +
            '</tr></thead><tbody>';

        data.forEach(function(item) {
            var statusHtml = item.reviewStatus === 'pending' ? '<span class="adm-status-badge adm-status-pending">待审核</span>' :
                item.reviewStatus === 'approved' ? '<span class="adm-status-badge adm-status-approved">已通过</span>' :
                '<span class="adm-status-badge adm-status-rejected">已拒绝</span>';
            var actions = '';
            if (item.reviewStatus === 'pending') {
                actions = '<button class="adm-btn-sm adm-btn-approve-rental" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-check"></i> 通过</button> ' +
                    '<button class="adm-btn-sm adm-btn-reject-rental" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-times"></i> 拒绝</button>';
            } else if (item.reviewStatus === 'approved') {
                actions = '<button class="adm-btn-sm adm-btn-reject-rental" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-undo"></i> 撤销</button>';
            } else {
                actions = '<button class="adm-btn-sm adm-btn-approve-rental" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-redo"></i> 恢复</button>';
            }

            var imgHtml = '<div style="width:40px;height:40px;border-radius:6px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;overflow:hidden"><i class="fas fa-book" style="color:#94a3b8;font-size:14px"></i></div>';
            if (item.image) {
                imgHtml = '<div style="width:40px;height:40px;border-radius:6px;overflow:hidden"><img src="' + item.image + '" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML=\'<i class=\\\'fas fa-book\\\' style=\\\'color:#94a3b8;font-size:14px;display:flex;align-items:center;justify-content:center;width:100%;height:100%\\\'></i>\'"></div>';
            }

            html += '<tr><td>' + imgHtml + '</td>' +
                '<td style="font-weight:600;color:var(--text-primary)">' + item.name + '</td>' +
                '<td style="font-weight:600;color:#165DFF">¥' + item.price + '/' + item.period + '</td>' +
                '<td style="color:var(--text-secondary)">' + item.seller + '</td>' +
                '<td style="color:var(--text-secondary)">' + (item.sellerDept || '-') + '</td>' +
                '<td>' + statusHtml + '</td>' +
                '<td style="color:var(--text-secondary);font-size:12px">' + (item.time || '-') + '</td>' +
                '<td>' + actions + '</td></tr>';
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;

        bindFilterButtons(container);

        container.querySelectorAll('.adm-btn-approve-rental').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var bookId = parseInt(btn.getAttribute('data-id'));
                if (window.RentalAPI) {
                    RentalAPI.approveBook({ bookId: bookId, reviewer: '管理员' }).then(function(res) {
                        if (res.success) { showToast('审核通过', 'success'); renderContent(currentReviewTab); }
                        else { showToast(res.message || '操作失败', 'error'); }
                    }).catch(function() {
                        localApproveRental(bookId);
                    });
                } else {
                    localApproveRental(bookId);
                }
            });
        });
        container.querySelectorAll('.adm-btn-reject-rental').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var bookId = parseInt(btn.getAttribute('data-id'));
                showRejectDialog(function(reason) {
                    if (reason === null) return;
                    if (window.RentalAPI) {
                        RentalAPI.rejectBook({ bookId: bookId, reviewer: '管理员', reviewNote: reason }).then(function(res) {
                            if (res.success) { showToast('已拒绝', 'error'); renderContent(currentReviewTab); }
                            else { showToast(res.message || '操作失败', 'error'); }
                        }).catch(function() {
                            localRejectRental(bookId, reason);
                        });
                    } else {
                        localRejectRental(bookId, reason);
                    }
                });
            });
        });
    }

    /* 渲染教材租用审核列表（API模式） */
    function renderRentalReviewAPI(container, result, tabLabel) {
        var data = result.list || [];
        var total = result.total || 0;

        var html = '<div class="adm-review-filter-bar" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center">';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'pending' ? 'active' : '') + '" data-filter="pending" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'pending' ? '#3b82f6' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'pending' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">待审核</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'approved' ? 'active' : '') + '" data-filter="approved" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'approved' ? '#10b981' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'approved' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已通过</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'rejected' ? 'active' : '') + '" data-filter="rejected" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'rejected' ? '#ef4444' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'rejected' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已拒绝</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'all' ? 'active' : '') + '" data-filter="all" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'all' ? '#6b7280' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'all' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">全部</button>';
        html += '</div>';

        if (data.length === 0) {
            html += '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + (currentReviewFilter === 'pending' ? '待审核' : currentReviewFilter === 'approved' ? '已通过' : currentReviewFilter === 'rejected' ? '已拒绝' : '') + tabLabel + '</p></div>';
            container.innerHTML = html;
            bindFilterButtons(container);
            return;
        }

        html += '<div class="adm-table-wrap"><table class="adm-table adm-review-table"><thead><tr>' +
            '<th style="width:60px">图片</th>' +
            '<th>书名</th>' +
            '<th style="width:80px">租金</th>' +
            '<th style="width:90px">发布者</th>' +
            '<th style="width:100px">所属学院</th>' +
            '<th style="width:80px">状态</th>' +
            '<th style="width:130px">提交时间</th>' +
            '<th style="width:160px">操作</th>' +
            '</tr></thead><tbody>';

        data.forEach(function(item) {
            var statusHtml = '';
            if (item.reviewStatus === 'pending') statusHtml = '<span class="adm-status-badge adm-status-pending">待审核</span>';
            else if (item.reviewStatus === 'approved') statusHtml = '<span class="adm-status-badge adm-status-approved">已通过</span>';
            else statusHtml = '<span class="adm-status-badge adm-status-rejected">已拒绝</span>';

            var actions = '';
            if (item.reviewStatus === 'pending') {
                actions = '<button class="adm-btn-sm adm-btn-approve-rental" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-check"></i> 通过</button> ' +
                    '<button class="adm-btn-sm adm-btn-reject-rental" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-times"></i> 拒绝</button>';
            } else if (item.reviewStatus === 'approved') {
                actions = '<button class="adm-btn-sm adm-btn-reject-rental" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-undo"></i> 撤销</button>';
            } else {
                actions = '<button class="adm-btn-sm adm-btn-approve-rental" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-redo"></i> 恢复</button>';
            }

            var imgHtml = '<div style="width:40px;height:40px;border-radius:6px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;overflow:hidden"><i class="fas fa-book" style="color:#94a3b8;font-size:14px"></i></div>';
            if (item.image) {
                imgHtml = '<div style="width:40px;height:40px;border-radius:6px;overflow:hidden"><img src="' + item.image + '" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML=\'<i class=\\\'fas fa-book\\\' style=\\\'color:#94a3b8;font-size:14px;display:flex;align-items:center;justify-content:center;width:100%;height:100%\\\'></i>\'"></div>';
            }

            html += '<tr><td>' + imgHtml + '</td>' +
                '<td style="font-weight:600;color:var(--text-primary)">' + item.name + '</td>' +
                '<td style="font-weight:600;color:#165DFF">¥' + item.price + '/' + item.period + '</td>' +
                '<td style="color:var(--text-secondary)">' + item.seller + '</td>' +
                '<td style="color:var(--text-secondary)">' + (item.sellerDept || '-') + '</td>' +
                '<td>' + statusHtml + '</td>' +
                '<td style="color:var(--text-secondary);font-size:12px">' + (item.time || '-') + '</td>' +
                '<td>' + actions + '</td></tr>';
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;

        bindFilterButtons(container);

        container.querySelectorAll('.adm-btn-approve-rental').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var bookId = parseInt(btn.getAttribute('data-id'));
                if (window.RentalAPI) {
                    RentalAPI.approveBook({ bookId: bookId, reviewer: '管理员' }).then(function(res) {
                        if (res.success) { showToast('审核通过', 'success'); renderContent(currentReviewTab); }
                        else { showToast(res.message || '操作失败', 'error'); }
                    }).catch(function() {
                        localApproveRental(bookId);
                    });
                } else {
                    localApproveRental(bookId);
                }
            });
        });
        container.querySelectorAll('.adm-btn-reject-rental').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var bookId = parseInt(btn.getAttribute('data-id'));
                showRejectDialog(function(reason) {
                    if (reason === null) return;
                    if (window.RentalAPI) {
                        RentalAPI.rejectBook({ bookId: bookId, reviewer: '管理员', reviewNote: reason }).then(function(res) {
                            if (res.success) { showToast('已拒绝', 'error'); renderContent(currentReviewTab); }
                            else { showToast(res.message || '操作失败', 'error'); }
                        }).catch(function() {
                            localRejectRental(bookId, reason);
                        });
                    } else {
                        localRejectRental(bookId, reason);
                    }
                });
            });
        });
    }

    /* 渲染兼职信息审核列表 */
    function renderParttimeReview(container, tabLabel) {
        var jobs = [];
        try { jobs = JSON.parse(localStorage.getItem('campus_parttime_jobs') || '[]'); } catch(e) {}
        if (jobs.length === 0 && window.CampusDB) { jobs = CampusDB.getParttimeJobs ? CampusDB.getParttimeJobs() : []; }

        var pending = jobs.filter(function(j) { return j.reviewStatus === 'pending'; }).length;
        var approved = jobs.filter(function(j) { return j.reviewStatus === 'approved'; }).length;
        var rejected = jobs.filter(function(j) { return j.reviewStatus === 'rejected'; }).length;

        var data = currentReviewFilter === 'all' ? jobs : jobs.filter(function(j) { return j.reviewStatus === currentReviewFilter; });

        var html = '<div class="adm-review-filter-bar" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center">';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'pending' ? 'active' : '') + '" data-filter="pending" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'pending' ? '#3b82f6' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'pending' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">待审核 (' + pending + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'approved' ? 'active' : '') + '" data-filter="approved" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'approved' ? '#10b981' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'approved' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已通过 (' + approved + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'rejected' ? 'active' : '') + '" data-filter="rejected" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'rejected' ? '#ef4444' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'rejected' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已拒绝 (' + rejected + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'all' ? 'active' : '') + '" data-filter="all" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'all' ? '#6b7280' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'all' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">全部 (' + jobs.length + ')</button>';
        html += '</div>';

        if (data.length === 0) {
            html += '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + (currentReviewFilter === 'pending' ? '待审核' : currentReviewFilter === 'approved' ? '已通过' : currentReviewFilter === 'rejected' ? '已拒绝' : '') + tabLabel + '</p></div>';
            container.innerHTML = html;
            bindFilterButtons(container);
            return;
        }

        html += '<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th>序号</th><th>兼职岗位</th><th>薪资</th><th>发布者</th><th>所属学院</th><th>提交时间</th><th>状态</th><th>操作</th></tr></thead><tbody>';
        data.forEach(function(item, idx) {
            var statusHtml = item.reviewStatus === 'pending' ? '<span class="adm-status-badge adm-status-pending">待审核</span>' :
                item.reviewStatus === 'approved' ? '<span class="adm-status-badge adm-status-approved">已通过</span>' :
                '<span class="adm-status-badge adm-status-rejected">已拒绝</span>';
            var actions = '';
            if (item.reviewStatus === 'pending') {
                actions = '<button class="adm-btn-sm adm-btn-approve-pt" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-check"></i> 通过</button> <button class="adm-btn-sm adm-btn-reject-pt" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-times"></i> 驳回</button>';
            } else if (item.reviewStatus === 'approved') {
                actions = '<button class="adm-btn-sm adm-btn-reject-pt" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-undo"></i> 撤销</button>';
            } else {
                actions = '<button class="adm-btn-sm adm-btn-approve-pt" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-redo"></i> 恢复</button>';
            }
            html += '<tr><td>' + (idx+1) + '</td><td>' + item.title + '</td><td>' + item.salary + '</td><td>' + (item.contact || '-') + '</td><td>' + (item.dept || '-') + '</td><td>' + (item.publishTime || item.time || '-') + '</td><td>' + statusHtml + '</td><td>' + actions + '</td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;

        bindFilterButtons(container);

        container.querySelectorAll('.adm-btn-approve-pt').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                var allJobs = JSON.parse(localStorage.getItem('campus_parttime_jobs') || '[]');
                var job = allJobs.find(function(j) { return String(j.id) === String(id); });
                if (job) { job.reviewStatus = 'approved'; job.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16); localStorage.setItem('campus_parttime_jobs', JSON.stringify(allJobs)); showToast('审核通过', 'success'); renderContent(currentReviewTab); }
                else { showToast('兼职信息不存在', 'error'); }
            });
        });
        container.querySelectorAll('.adm-btn-reject-pt').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                showRejectDialog(function(reason) {
                    if (reason === null) return;
                    var allJobs = JSON.parse(localStorage.getItem('campus_parttime_jobs') || '[]');
                    var job = allJobs.find(function(j) { return String(j.id) === String(id); });
                    if (job) { job.reviewStatus = 'rejected'; job.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16); if (reason) job.rejectReason = reason; localStorage.setItem('campus_parttime_jobs', JSON.stringify(allJobs)); showToast('已驳回', 'error'); renderContent(currentReviewTab); }
                    else { showToast('兼职信息不存在', 'error'); }
                }, '驳回理由');
            });
        });
    }

    /* 统一获取流浪猫列表（含去重和字段补全） */
    function getPetsList() {
        try {
            var pets = JSON.parse(localStorage.getItem('campus_pets') || '[]');
            /* 补全缺失的 reviewStatus 字段 */
            pets.forEach(function(p) {
                if (!p.reviewStatus) p.reviewStatus = 'approved';
            });
            /* 去重：按 id 去重，保留第一条 */
            var seen = {};
            var deduped = [];
            pets.forEach(function(p) {
                if (!seen[p.id]) {
                    seen[p.id] = true;
                    deduped.push(p);
                }
            });
            /* 如果去重后数据有变化，回写 localStorage */
            if (deduped.length !== pets.length) {
                localStorage.setItem('campus_pets', JSON.stringify(deduped));
            }
            return deduped;
        } catch(e) { return []; }
    }

    /* 本地审核操作：通过流浪猫 */
    function localApprovePet(petId) {
        var pets = getPetsList();
        var pet = pets.find(function(p) { return String(p.id) === String(petId); });
        if (pet) {
            pet.reviewStatus = 'approved';
            pet.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            localStorage.setItem('campus_pets', JSON.stringify(pets));
            showToast('审核通过', 'success');
            renderContent(currentReviewTab);
        } else {
            showToast('记录不存在', 'error');
        }
    }

    /* 本地审核操作：拒绝流浪猫 */
    function localRejectPet(petId, reason) {
        if (reason === undefined) {
            showRejectDialog(function(r) {
                if (r === null) return;
                localRejectPet(petId, r);
            });
            return;
        }
        var pets = getPetsList();
        var pet = pets.find(function(p) { return String(p.id) === String(petId); });
        if (pet) {
            pet.reviewStatus = 'rejected';
            pet.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            if (reason) pet.rejectReason = reason;
            localStorage.setItem('campus_pets', JSON.stringify(pets));
            showToast('已拒绝', 'error');
            renderContent(currentReviewTab);
        } else {
            showToast('记录不存在', 'error');
        }
    }

    /* 渲染流浪猫审核列表 */
    function renderPetsReview(container, tabLabel) {
        var pets = getPetsList();

        var data = currentReviewFilter === 'all' ? pets : pets.filter(function(p) { return p.reviewStatus === currentReviewFilter; });
        var pending = pets.filter(function(p) { return p.reviewStatus === 'pending'; }).length;
        var approved = pets.filter(function(p) { return p.reviewStatus === 'approved'; }).length;
        var rejected = pets.filter(function(p) { return p.reviewStatus === 'rejected'; }).length;

        var html = '<div class="adm-review-filter-bar" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center">';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'pending' ? 'active' : '') + '" data-filter="pending" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'pending' ? '#3b82f6' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'pending' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">待审核 (' + pending + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'approved' ? 'active' : '') + '" data-filter="approved" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'approved' ? '#10b981' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'approved' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已通过 (' + approved + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'rejected' ? 'active' : '') + '" data-filter="rejected" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'rejected' ? '#ef4444' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'rejected' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">已拒绝 (' + rejected + ')</button>';
        html += '<button class="adm-filter-btn ' + (currentReviewFilter === 'all' ? 'active' : '') + '" data-filter="all" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (currentReviewFilter === 'all' ? '#6b7280' : 'var(--bg-secondary)') + ';color:' + (currentReviewFilter === 'all' ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px">全部 (' + pets.length + ')</button>';
        html += '</div>';

        if (data.length === 0) {
            html += '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + (currentReviewFilter === 'pending' ? '待审核' : currentReviewFilter === 'approved' ? '已通过' : currentReviewFilter === 'rejected' ? '已拒绝' : '') + tabLabel + '</p></div>';
            container.innerHTML = html;
            bindFilterButtons(container);
            return;
        }

        html += '<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th style="width:60px">图片</th><th>名称</th><th>品种</th><th>位置</th><th>联系人</th><th style="width:80px">状态</th><th style="width:130px">登记时间</th><th style="width:160px">操作</th></tr></thead><tbody>';
        data.forEach(function(item) {
            var statusHtml = item.reviewStatus === 'pending' ? '<span class="adm-status-badge adm-status-pending">待审核</span>' :
                item.reviewStatus === 'approved' ? '<span class="adm-status-badge adm-status-approved">已通过</span>' :
                '<span class="adm-status-badge adm-status-rejected">已拒绝</span>';
            var actions = item.reviewStatus === 'pending' ?
                '<button class="adm-btn-sm adm-btn-approve-pet" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-check"></i> 通过</button> <button class="adm-btn-sm adm-btn-reject-pet" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-times"></i> 拒绝</button>' :
                (item.reviewStatus === 'approved' ? '<button class="adm-btn-sm adm-btn-reject-pet" data-id="' + item.id + '" style="color:#ef4444"><i class="fas fa-undo"></i> 撤销</button>' : '<button class="adm-btn-sm adm-btn-approve-pet" data-id="' + item.id + '" style="color:#059669"><i class="fas fa-redo"></i> 恢复</button>');
            var imgHtml = '<div style="width:40px;height:40px;border-radius:6px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;overflow:hidden"><i class="fas fa-cat" style="color:#94a3b8;font-size:14px"></i></div>';
            if (item.images && item.images.length > 0) {
                imgHtml = '<div style="width:40px;height:40px;border-radius:6px;overflow:hidden"><img src="' + item.images[0] + '" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML=\'<i class=\\\'fas fa-cat\\\' style=\\\'color:#94a3b8;font-size:14px;display:flex;align-items:center;justify-content:center;width:100%;height:100%\\\'></i>\'"></div>';
            }
            html += '<tr><td>' + imgHtml + '</td><td style="font-weight:600">' + item.name + '</td><td style="color:var(--text-secondary)">' + item.breed + '</td><td style="color:var(--text-secondary)">' + item.location + '</td><td style="color:var(--text-secondary)">' + item.contact + '</td><td>' + statusHtml + '</td><td style="color:var(--text-secondary);font-size:12px">' + (item.publishTime || '-') + '</td><td>' + actions + '</td></tr>';
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;

        bindFilterButtons(container);

        container.querySelectorAll('.adm-btn-approve-pet').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                localApprovePet(id);
            });
        });
        container.querySelectorAll('.adm-btn-reject-pet').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                localRejectPet(id);
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
            list.unshift({ id: Date.now(), title: title, cat: cat, content: content, pinned: pinned, time: new Date().toISOString(), version: 1, author: '管理员', type: 'normal' });
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
            return '<div class="adm-ann-item"><div class="adm-ann-item-info">' + (a.pinned ? '<span style="color:#ef4444;font-weight:600">[置顶]</span> ' : '') + '<h4>' + a.title + '</h4><p>' + a.cat + '</p><span>' + formatDate(a.time) + (a.version > 1 ? ' (v' + a.version + ')' : '') + '</span></div><div class="adm-ann-item-actions"><button class="adm-btn-sm adm-btn-edit" data-id="' + a.id + '" title="编辑（版本+1）"><i class="fas fa-edit"></i></button><button class="adm-btn-sm adm-btn-del" data-id="' + a.id + '"><i class="fas fa-trash"></i></button></div></div>';
        }).join('');
        div.querySelectorAll('.adm-btn-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                var list = getAnnouncements().filter(function(a) { return String(a.id) !== String(id); });
                saveAnnouncements(list);
                renderAnnouncements();
                showToast('公告已删除', 'success');
            });
        });
        /* 编辑公告：版本号+1，所有用户需重新阅读 */
        div.querySelectorAll('.adm-btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                var list = getAnnouncements();
                var idx = list.findIndex(function(a) { return String(a.id) === String(id); });
                if (idx !== -1) {
                    list[idx].version = (list[idx].version || 1) + 1;
                    list[idx].time = new Date().toISOString();
                    saveAnnouncements(list);
                    renderAnnouncements();
                    showToast('公告已更新（版本 v' + list[idx].version + '），所有用户需重新阅读', 'success');
                }
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
            s.status = 'approved';
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
                s.status = 'approved';
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
                    s.status = 'approved';
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

        /* 数据导出 */
        var exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                var statusEl = document.getElementById('dataTransferStatus');
                try {
                    var allData = {};
                    /* 收集所有 campus_ 开头的 localStorage 数据 */
                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        if (key && key.indexOf('campus_') === 0) {
                            try { allData[key] = JSON.parse(localStorage.getItem(key)); } catch(e) { allData[key] = localStorage.getItem(key); }
                        }
                    }
                    /* 也收集 campus_secondhand_v2 */
                    try { var v2 = localStorage.getItem('campus_secondhand_v2'); if (v2) allData['campus_secondhand_v2'] = JSON.parse(v2); } catch(e) {}
                    try { var pets = localStorage.getItem('campus_pets'); if (pets) allData['campus_pets'] = JSON.parse(pets); } catch(e) {}

                    var json = JSON.stringify(allData, null, 2);
                    var blob = new Blob([json], { type: 'application/json' });
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'campus_backup_' + new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19) + '.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    var studentCount = (allData['campus_students'] || []).length;
                    statusEl.innerHTML = '<span style="color:#10b981"><i class="fas fa-check-circle"></i> 导出成功！包含 ' + studentCount + ' 个用户账号，共 ' + Object.keys(allData).length + ' 个数据表</span>';
                } catch(err) {
                    statusEl.innerHTML = '<span style="color:#ef4444"><i class="fas fa-exclamation-circle"></i> 导出失败：' + err.message + '</span>';
                }
            });
        }

        /* 数据导入 */
        var importInput = document.getElementById('importDataInput');
        if (importInput) {
            importInput.addEventListener('change', function(e) {
                var file = e.target.files[0];
                if (!file) return;
                var statusEl = document.getElementById('dataTransferStatus');
                statusEl.innerHTML = '<span style="color:#f59e0b"><i class="fas fa-spinner fa-spin"></i> 正在导入数据...</span>';

                var reader = new FileReader();
                reader.onload = function(ev) {
                    try {
                        var data = JSON.parse(ev.target.result);
                        if (typeof data !== 'object' || data === null) {
                            throw new Error('无效的数据格式');
                        }
                        var keys = Object.keys(data);
                        var studentCount = 0;
                        keys.forEach(function(key) {
                            try {
                                localStorage.setItem(key, JSON.stringify(data[key]));
                                if (key === 'campus_students' && Array.isArray(data[key])) {
                                    studentCount = data[key].length;
                                }
                            } catch(err) {
                                console.warn('[数据导入] 写入失败:', key, err);
                            }
                        });
                        /* 更新初始化标记，防止 db.js 重新初始化覆盖导入数据 */
                        try {
                            localStorage.setItem('campus_db_initialized', JSON.stringify({ version: '3.1', initTime: new Date().toISOString(), imported: true }));
                        } catch(e) {}
                        statusEl.innerHTML = '<span style="color:#10b981"><i class="fas fa-check-circle"></i> 导入成功！已恢复 ' + studentCount + ' 个用户账号，共 ' + keys.length + ' 个数据表。页面即将刷新...</span>';
                        setTimeout(function() { location.reload(); }, 2000);
                    } catch(err) {
                        statusEl.innerHTML = '<span style="color:#ef4444"><i class="fas fa-exclamation-circle"></i> 导入失败：' + err.message + '</span>';
                    }
                };
                reader.readAsText(file);
                /* 重置 input 以允许重复选择同一文件 */
                this.value = '';
            });
        }
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

    /* ========== 商家审核 ========== */
    function initMerchants() {
        initMerchantModals();
        renderMerchantLists();
    }

    function getMerchants() {
        if (window.CampusDB) {
            try {
                return CampusDB.getMerchants();
            } catch(e) {
                console.error('[商家审核] CampusDB.getMerchants 异常:', e);
            }
        }
        try {
            var raw = localStorage.getItem('campus_merchants');
            return raw ? JSON.parse(raw) : [];
        } catch(e) {
            return [];
        }
    }

    function saveMerchants(list) {
        if (window.CampusDB) {
            try { CampusDB.saveMerchants(list); return; } catch(e) { console.error('[商家审核] CampusDB.saveMerchants 异常:', e); }
        }
        localStorage.setItem('campus_merchants', JSON.stringify(list));
    }

    /* 商家审核筛选状态 */
    var _mchFilter = 'pending';

    function renderMerchantLists() {
        var merchants = getMerchants();
        var pending = merchants.filter(function(m) { return m.status === 'pending'; });
        var approved = merchants.filter(function(m) { return m.status === 'approved'; });
        var rejected = merchants.filter(function(m) { return m.status === 'rejected'; });

        /* ======== 统计摘要栏 ======== */
        var statsEl = document.getElementById('merchantStats');
        if (statsEl) {
            statsEl.innerHTML =
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#f59e0b">' + pending.length + '</span><span class="adm-review-stat-label">待审核</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#10b981">' + approved.length + '</span><span class="adm-review-stat-label">已通过</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#ef4444">' + rejected.length + '</span><span class="adm-review-stat-label">已驳回</span></div>' +
                '<div class="adm-review-stat-item"><span class="adm-review-stat-num" style="color:#6b7280">' + merchants.length + '</span><span class="adm-review-stat-label">总计</span></div>';
        }

        /* ======== 筛选按钮栏 ======== */
        var filterEl = document.getElementById('merchantFilterBar');
        if (filterEl) {
            var filters = [
                { key: 'pending', label: '待审核', count: pending.length, color: '#3b82f6' },
                { key: 'approved', label: '已通过', count: approved.length, color: '#10b981' },
                { key: 'rejected', label: '已驳回', count: rejected.length, color: '#ef4444' },
                { key: 'all', label: '全部', count: merchants.length, color: '#6b7280' }
            ];
            var fhtml = '';
            filters.forEach(function(f) {
                var isActive = _mchFilter === f.key;
                fhtml += '<button class="adm-filter-btn ' + (isActive ? 'active' : '') + '" data-filter="' + f.key + '" style="padding:6px 14px;border-radius:6px;border:1px solid var(--border-color);background:' + (isActive ? f.color : 'var(--bg-secondary)') + ';color:' + (isActive ? '#fff' : 'var(--text-secondary)') + ';cursor:pointer;font-size:13px;font-weight:500;transition:all .2s">' + f.label + ' (' + f.count + ')</button>';
            });
            filterEl.innerHTML = fhtml;

            filterEl.querySelectorAll('.adm-filter-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    _mchFilter = this.getAttribute('data-filter');
                    renderMerchantLists();
                });
            });
        }

        /* ======== 数据表格 ======== */
        var data = _mchFilter === 'all' ? merchants : merchants.filter(function(m) { return m.status === _mchFilter; });
        var wrap = document.getElementById('merchantListWrap');

        if (data.length === 0) {
            var emptyLabel = _mchFilter === 'pending' ? '待审核' : _mchFilter === 'approved' ? '已通过' : _mchFilter === 'rejected' ? '已驳回' : '';
            wrap.innerHTML = '<div class="adm-empty-state"><i class="fas fa-inbox"></i><p>暂无' + emptyLabel + '入驻申请</p></div>';
        } else {
            var html = '<div class="adm-table-wrap"><table class="adm-table adm-review-table"><thead><tr>' +
                '<th>店铺名称</th><th>经营类目</th><th>联系人</th><th>联系电话</th><th>状态</th><th>申请时间</th><th>操作</th>' +
                '</tr></thead><tbody>';

            data.forEach(function(m) {
                var statusHtml = m.status === 'pending' ? '<span class="adm-status-badge adm-status-pending">待审核</span>' :
                    m.status === 'approved' ? '<span class="adm-status-badge adm-status-approved">已通过</span>' :
                    '<span class="adm-status-badge adm-status-rejected">已驳回</span>';

                var actions = '<button class="adm-btn-sm" data-action="detail" data-id="' + m.id + '" style="background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe"><i class="fas fa-eye"></i> 详情</button> ';
                if (m.status === 'pending') {
                    actions += '<button class="adm-btn-sm adm-btn-approve" data-action="approve" data-id="' + m.id + '" style="background:#ecfdf5;color:#059669;border:1px solid #a7f3d0"><i class="fas fa-check"></i> 通过</button> ';
                    actions += '<button class="adm-btn-sm adm-btn-reject" data-action="reject" data-id="' + m.id + '" style="background:#fef2f2;color:#ef4444;border:1px solid #fecaca"><i class="fas fa-times"></i> 驳回</button>';
                } else if (m.status === 'approved') {
                    actions += '<span style="font-size:11px;color:#059669"><i class="fas fa-check-circle"></i> ' + escHtml(m.reviewer || '') + ' ' + escHtml(m.reviewTime || '') + '</span>';
                } else {
                    actions += '<span style="font-size:11px;color:#ef4444"><i class="fas fa-times-circle"></i> ' + escHtml(m.rejectReason || '已驳回') + '</span>';
                }

                html += '<tr><td style="font-weight:600">' + escHtml(m.shopName) + '</td><td>' + escHtml(m.category) + '</td><td>' + escHtml(m.contactName) + '</td><td>' + escHtml(m.contactPhone) + '</td><td>' + statusHtml + '</td><td style="font-size:12px;color:var(--text-secondary)">' + escHtml(m.createTime || '-') + '</td><td style="white-space:nowrap">' + actions + '</td></tr>';
            });

            html += '</tbody></table></div>';
            wrap.innerHTML = html;

            /* 绑定操作按钮 */
            wrap.querySelectorAll('[data-action="detail"]').forEach(function(btn) {
                btn.addEventListener('click', function() { openMerchantDetail(this.getAttribute('data-id')); });
            });
            wrap.querySelectorAll('[data-action="approve"]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    if (!confirm('确定审核通过该商家入驻申请？')) return;
                    var result = doMerchantReview(this.getAttribute('data-id'), 'approved', 'admin', '');
                    if (result) { showToast('审核通过', 'success'); renderMerchantLists(); }
                    else { showToast('操作失败', 'error'); }
                });
            });
            wrap.querySelectorAll('[data-action="reject"]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    _currentMchId = this.getAttribute('data-id');
                    document.getElementById('mchRejectReason').value = '';
                    document.getElementById('mchRejectOverlay').classList.add('active');
                });
            });
        }

        /* 更新时间 */
        var merchantTime = document.getElementById('merchantTime');
        if (merchantTime) {
            merchantTime.textContent = '刷新时间：' + new Date().toLocaleString();
        }
    }

    /* 当前弹窗中的商家ID（用于审批操作） */
    var _currentMchId = null;

    /* 打开商家详情弹窗 */
    function openMerchantDetail(id) {
        var merchants = getMerchants();
        var m = merchants.find(function(item) { return item.id === id; });
        if (!m) { showToast('未找到商家信息', 'error'); return; }
        _currentMchId = id;
        var isPending = m.status === 'pending';
        var isApproved = m.status === 'approved';
        var isRejected = m.status === 'rejected';

        /* 区块1：店铺基础信息 */
        var infoHtml =
            '<div class="mch-detail-section">' +
                '<div class="mch-detail-section-title"><i class="fas fa-store"></i> 店铺基础信息</div>' +
                '<div class="mch-detail-grid">' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-store-alt"></i> 店铺名称</span><span class="mch-detail-value">' + escHtml(m.shopName) + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-tags"></i> 经营类目</span><span class="mch-detail-value">' + escHtml(m.category) + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-map-marker-alt"></i> 所属校区</span><span class="mch-detail-value">' + escHtml(m.campus || '-') + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-user"></i> 联系人</span><span class="mch-detail-value">' + escHtml(m.contactName) + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-phone"></i> 联系电话</span><span class="mch-detail-value">' + escHtml(m.contactPhone) + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-location-dot"></i> 营业地址</span><span class="mch-detail-value">' + escHtml(m.address || '-') + '</span></div>' +
                    '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-calendar-alt"></i> 申请时间</span><span class="mch-detail-value">' + escHtml(m.createTime || '-') + '</span></div>' +
                    (m.reviewTime ? '<div class="mch-detail-item"><span class="mch-detail-label"><i class="fas fa-gavel"></i> 审核时间</span><span class="mch-detail-value">' + escHtml(m.reviewTime) + '</span></div>' : '') +
                    (m.rejectReason ? '<div class="mch-detail-item full"><span class="mch-detail-label"><i class="fas fa-comment-slash"></i> 驳回原因</span><span class="mch-detail-value" style="color:#ef4444">' + escHtml(m.rejectReason) + '</span></div>' : '') +
                '</div>' +
            '</div>';

        /* 区块2：资质资料区 */
        var licenseHtml = '';
        if (m.licensePhoto && m.licensePhoto.indexOf('data:') === 0) {
            licenseHtml = '<img class="mch-photo-img" src="' + m.licensePhoto + '" alt="营业执照" data-zoom>';
        } else {
            licenseHtml = '<div class="mch-photo-placeholder"><i class="fas fa-image"></i> 暂无图片</div>';
        }
        var storeHtml = '';
        if (m.storePhoto && m.storePhoto.indexOf('data:') === 0) {
            storeHtml = '<img class="mch-photo-img" src="' + m.storePhoto + '" alt="门店照片" data-zoom>';
        } else {
            storeHtml = '<div class="mch-photo-placeholder"><i class="fas fa-image"></i> 暂无图片</div>';
        }

        var photoHtml =
            '<div class="mch-detail-section">' +
                '<div class="mch-detail-section-title"><i class="fas fa-file-shield"></i> 资质资料</div>' +
                '<div class="mch-detail-photos">' +
                    '<div class="mch-photo-card"><div class="mch-photo-label"><i class="fas fa-id-card"></i> 营业执照</div>' + licenseHtml + '</div>' +
                    '<div class="mch-photo-card"><div class="mch-photo-label"><i class="fas fa-camera"></i> 门店实拍</div>' + storeHtml + '</div>' +
                '</div>' +
            '</div>';

        document.getElementById('mchDetailBody').innerHTML = infoHtml + photoHtml;

        /* 底部三按钮：关闭 + 通过 + 驳回 */
        var footerHtml = '';
        if (isPending) {
            footerHtml =
                '<button class="mch-detail-btn mch-detail-btn-close" id="mchCloseBtn"><i class="fas fa-xmark"></i> 关闭</button>' +
                '<button class="mch-detail-btn mch-detail-btn-approve" id="mchApproveBtn"><i class="fas fa-check"></i> 通过审核</button>' +
                '<button class="mch-detail-btn mch-detail-btn-reject" id="mchRejectBtn"><i class="fas fa-times"></i> 驳回申请</button>';
        } else if (isApproved) {
            footerHtml =
                '<button class="mch-detail-btn mch-detail-btn-close" id="mchCloseBtn"><i class="fas fa-xmark"></i> 关闭</button>' +
                '<button class="mch-detail-btn mch-detail-btn-approve" disabled><i class="fas fa-check-circle"></i> 已通过</button>' +
                '<button class="mch-detail-btn mch-detail-btn-reject" disabled><i class="fas fa-ban"></i> 已处理</button>';
        } else {
            footerHtml =
                '<button class="mch-detail-btn mch-detail-btn-close" id="mchCloseBtn"><i class="fas fa-xmark"></i> 关闭</button>' +
                '<button class="mch-detail-btn mch-detail-btn-approve" disabled><i class="fas fa-ban"></i> 已处理</button>' +
                '<button class="mch-detail-btn mch-detail-btn-reject" disabled><i class="fas fa-times-circle"></i> 已驳回</button>';
        }
        document.getElementById('mchDetailFooter').innerHTML = footerHtml;

        /* 显示弹窗 */
        document.getElementById('mchDetailOverlay').classList.add('active');

        /* 绑定图片放大 */
        document.querySelectorAll('#mchDetailBody [data-zoom]').forEach(function(img) {
            img.addEventListener('click', function() {
                document.getElementById('mchLightboxImg').src = this.src;
                document.getElementById('mchLightbox').classList.add('active');
            });
        });

        /* 绑定关闭按钮 */
        var closeBtn = document.getElementById('mchCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMerchantDetail);
        }

        /* 绑定通过按钮 */
        var approveBtn = document.getElementById('mchApproveBtn');
        if (approveBtn && isPending) {
            approveBtn.addEventListener('click', function() {
                if (!confirm('确定审核通过该商家入驻申请？')) return;
                var result = doMerchantReview(_currentMchId, 'approved', 'admin', '');
                if (result) {
                    showToast('审核通过', 'success');
                    closeMerchantDetail();
                    _mchFilter = 'approved';
                    renderMerchantLists();
                } else {
                    showToast('操作失败，可能已被审核', 'error');
                }
            });
        }

        /* 绑定驳回按钮 */
        var rejectBtn = document.getElementById('mchRejectBtn');
        if (rejectBtn && isPending) {
            rejectBtn.addEventListener('click', function() {
                document.getElementById('mchRejectReason').value = '';
                document.getElementById('mchRejectOverlay').classList.add('active');
            });
        }
    }

    /* 关闭商家详情弹窗 */
    function closeMerchantDetail() {
        document.getElementById('mchDetailOverlay').classList.remove('active');
        _currentMchId = null;
    }

    /* 执行审核操作 */
    function doMerchantReview(id, status, reviewer, rejectReason) {
        if (window.CampusDB) {
            return CampusDB.reviewMerchant(id, status, reviewer, rejectReason);
        }
        try {
            var list = JSON.parse(localStorage.getItem('campus_merchants') || '[]');
            var found = list.find(function(m) { return m.id === id; });
            if (!found || found.status !== 'pending') return false;
            found.status = status;
            found.reviewer = reviewer;
            found.reviewTime = new Date().toLocaleString();
            found.rejectReason = rejectReason || '';
            localStorage.setItem('campus_merchants', JSON.stringify(list));
            return true;
        } catch(e) { return false; }
    }

    /* 初始化弹窗事件（仅执行一次） */
    function initMerchantModals() {
        /* 详情弹窗关闭 */
        document.getElementById('mchDetailClose').addEventListener('click', closeMerchantDetail);
        document.getElementById('mchDetailOverlay').addEventListener('click', function(e) {
            if (e.target === this) closeMerchantDetail();
        });

        /* 图片放大关闭 */
        document.getElementById('mchLightboxClose').addEventListener('click', function() {
            document.getElementById('mchLightbox').classList.remove('active');
        });
        document.getElementById('mchLightbox').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });

        /* 驳回弹窗 */
        document.getElementById('mchRejectClose').addEventListener('click', function() {
            document.getElementById('mchRejectOverlay').classList.remove('active');
        });
        document.getElementById('mchRejectCancel').addEventListener('click', function() {
            document.getElementById('mchRejectOverlay').classList.remove('active');
        });
        document.getElementById('mchRejectOverlay').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
        document.getElementById('mchRejectConfirm').addEventListener('click', function() {
            var reason = document.getElementById('mchRejectReason').value.trim();
            if (!reason) reason = '资质不符合要求';
            document.getElementById('mchRejectOverlay').classList.remove('active');
            var result = doMerchantReview(_currentMchId, 'rejected', 'admin', reason);
            if (result) {
                showToast('已驳回申请', 'success');
                closeMerchantDetail();
                _mchFilter = 'rejected';
                renderMerchantLists();
            } else {
                showToast('操作失败，可能已被审核', 'error');
            }
        });

        /* ESC 关闭弹窗 */
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.getElementById('mchLightbox').classList.remove('active');
                document.getElementById('mchRejectOverlay').classList.remove('active');
                closeMerchantDetail();
            }
        });
    }

    function escHtml(s) {
        if (!s) return '';
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
})();
