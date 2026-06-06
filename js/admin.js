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
        if (panel === 'sensitive') renderSensitiveWords();
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
        document.getElementById('statCardUsers').addEventListener('click', function() {
            switchPanel('users');
            showToast('已跳转至用户管理', 'success');
        });
        document.getElementById('statCardTrade').addEventListener('click', function() {
            switchPanel('content');
            var secondhandTab = document.querySelector('.adm-tab[data-ctab="secondhand"]');
            if (secondhandTab) secondhandTab.click();
            showToast('已跳转至二手商品审核', 'success');
        });
        document.getElementById('statCardVisits').addEventListener('click', function() {
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
        var students = getStudents();
        var tbody = document.getElementById('usersTableBody');
        if (search) {
            search = search.toLowerCase();
            students = students.filter(function(s) { return s.stuId.toLowerCase().indexOf(search) > -1 || s.name.toLowerCase().indexOf(search) > -1; });
        }
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-secondary);padding:30px">暂无用户数据</td></tr>';
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
            return '<tr><td>' + avHtml2 + '</td><td>' + s.stuId + '</td><td>' + s.name + '</td><td>' + s.dept + '</td><td>' + s.phone + '</td><td>' + formatDate(s.regTime) + '</td><td><button class="adm-btn-sm adm-btn-edit" data-idx="' + i + '"><i class="fas fa-edit"></i></button> <button class="adm-btn-sm adm-btn-del" data-idx="' + i + '"><i class="fas fa-trash"></i></button></td></tr>';
        }).join('');
        tbody.querySelectorAll('.adm-btn-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (confirm('确定删除该用户？')) {
                    var list = getStudents();
                    list.splice(parseInt(btn.getAttribute('data-idx')), 1);
                    saveStudents(list);
                    renderUsers();
                    showToast('用户已删除', 'success');
                }
            });
        });
        tbody.querySelectorAll('.adm-btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var list = getStudents();
                var s = list[parseInt(btn.getAttribute('data-idx'))];
                if (s) showEditUserModal(s);
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

    function initContent() {
        var currentCTab = 'secondhand';

        document.querySelectorAll('.adm-tab[data-ctab]').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.adm-tab[data-ctab]').forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                currentCTab = tab.getAttribute('data-ctab');
                renderContent(currentCTab);
            });
        });

        renderContent(currentCTab);
    }

    function renderContent(tab) {
        var list = document.getElementById('contentList');
        if (tab === 'secondhand') {
            var products = getSecondhandItems();
            if (products.length === 0) {
                list.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:30px">暂无商品数据</p>';
                return;
            }
            var categoryIcons = {'数码':'fa-laptop','书籍':'fa-book','生活用品':'fa-couch','运动':'fa-running','实训工具':'fa-tools','小家电':'fa-blender','其他':'fa-box'};
            list.innerHTML = products.map(function(p) {
                var icon = categoryIcons[p.category] || 'fa-box';
                var statusHtml = '';
                if (p.reviewStatus === 'pending') statusHtml = '<span class="status-badge status-pending">待审核</span>';
                else if (p.reviewStatus === 'rejected') statusHtml = '<span class="status-badge" style="background:#fef2f2;color:#ef4444">已拒绝</span>';
                else statusHtml = '<span class="status-badge status-done">已通过</span>';
                if (p.status === '已下架') statusHtml = '<span class="status-badge" style="background:#fef2f2;color:#ef4444">已下架</span>';
                if (p.status === '已售出') statusHtml = '<span class="status-badge" style="background:#f0f9ff;color:#1e40af">已售出</span>';
                var actions = '';
                if (p.reviewStatus === 'pending') {
                    actions = '<div class="adm-content-actions"><button class="adm-btn-sm adm-btn-approve" data-id="' + p.id + '"><i class="fas fa-check"></i> 通过</button><button class="adm-btn-sm adm-btn-reject" data-id="' + p.id + '"><i class="fas fa-times"></i> 拒绝</button></div>';
                } else if (p.reviewStatus === 'approved' && p.status !== '已下架') {
                    actions = '<div class="adm-content-actions"><button class="adm-btn-sm adm-btn-offline" data-id="' + p.id + '" style="background:#fef2f2;color:#ef4444;border:1px solid #fecaca"><i class="fas fa-ban"></i> 下架</button></div>';
                }
                var imgHtml = '';
                if (p.images && Array.isArray(p.images) && p.images.length > 0) {
                    imgHtml = '<img src="' + p.images[0] + '" style="width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid var(--border-color);flex-shrink:0" onerror="this.style.display=\'none\'">';
                } else {
                    imgHtml = '<i class="fas ' + icon + '" style="font-size:24px;color:#3b82f6;flex-shrink:0"></i>';
                }
                var imgCount = (p.images && Array.isArray(p.images)) ? p.images.length : 0;
                var imgCountHtml = imgCount > 0 ? '<span style="color:#3b82f6;font-size:11px"><i class="fas fa-images"></i> ' + imgCount + '张图</span>' : '';
                return '<div class="adm-content-item"><div class="adm-content-info">' + imgHtml + '<div><h4>' + p.name + '</h4><p>¥' + p.price + ' · ' + p.condition + ' · ' + p.category + ' · 卖家：' + p.seller + ' ' + imgCountHtml + '</p></div></div>' + statusHtml + actions + '</div>';
            }).join('');
            list.querySelectorAll('.adm-btn-approve').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var id = parseInt(btn.getAttribute('data-id'));
                    var products = getSecondhandItems();
                    var idx = products.findIndex(function(p) { return p.id === id; });
                    if (idx !== -1) {
                        products[idx].reviewStatus = 'approved';
                        if (window.CampusDB) { CampusDB.saveSecondhand(products); } else { localStorage.setItem('campus_secondhand', JSON.stringify(products)); }
                        showToast('商品已通过审核', 'success');
                        renderContent('secondhand');
                    }
                });
            });
            list.querySelectorAll('.adm-btn-reject').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var id = parseInt(btn.getAttribute('data-id'));
                    var products = getSecondhandItems();
                    var idx = products.findIndex(function(p) { return p.id === id; });
                    if (idx !== -1) {
                        products[idx].reviewStatus = 'rejected';
                        if (window.CampusDB) { CampusDB.saveSecondhand(products); } else { localStorage.setItem('campus_secondhand', JSON.stringify(products)); }
                        showToast('商品已拒绝', 'error');
                        renderContent('secondhand');
                    }
                });
            });
            list.querySelectorAll('.adm-btn-offline').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var id = parseInt(btn.getAttribute('data-id'));
                    var products = getSecondhandItems();
                    var idx = products.findIndex(function(p) { return p.id === id; });
                    if (idx !== -1) {
                        products[idx].status = '已下架';
                        if (window.CampusDB) { CampusDB.saveSecondhand(products); } else { localStorage.setItem('campus_secondhand', JSON.stringify(products)); }
                        showToast('商品已下架', 'error');
                        renderContent('secondhand');
                    }
                });
            });
        } else if (tab === 'rental') {
            function getRentalBooks() {
                if (window.CampusDB) return CampusDB.getRentalBooks();
                try { return JSON.parse(localStorage.getItem('campus_rental_books') || '[]'); } catch(e) { return []; }
            }
            var rentalBooks = getRentalBooks();
            if (rentalBooks.length === 0) {
                list.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:30px">暂无教材租用数据</p>';
                return;
            }
            list.innerHTML = rentalBooks.map(function(b) {
                var statusHtml = '';
                if (b.reviewStatus === 'pending') statusHtml = '<span class="status-badge status-pending">待审核</span>';
                else if (b.reviewStatus === 'rejected') statusHtml = '<span class="status-badge" style="background:#fef2f2;color:#ef4444">已拒绝</span>';
                else statusHtml = '<span class="status-badge status-done">已通过</span>';
                if (!b.available && b.reviewStatus === 'approved') statusHtml = '<span class="status-badge" style="background:#f0f9ff;color:#1e40af">已租出</span>';
                var actions = '';
                if (b.reviewStatus === 'pending') {
                    actions = '<div class="adm-content-actions"><button class="adm-btn-sm adm-btn-approve" data-rid="' + b.id + '"><i class="fas fa-check"></i> 通过</button><button class="adm-btn-sm adm-btn-reject" data-rid="' + b.id + '"><i class="fas fa-times"></i> 拒绝</button></div>';
                } else if (b.reviewStatus === 'approved' && b.available) {
                    actions = '<div class="adm-content-actions"><button class="adm-btn-sm adm-btn-offline" data-rid="' + b.id + '" style="background:#fef2f2;color:#ef4444;border:1px solid #fecaca"><i class="fas fa-ban"></i> 下架</button></div>';
                }
                return '<div class="adm-content-item"><div class="adm-content-info"><i class="fas fa-book" style="font-size:24px;color:#ec4899;flex-shrink:0"></i><div><h4>' + b.name + '</h4><p>¥' + b.price + '/' + b.period + ' · ' + b.condition + ' · 出租者：' + b.seller + '</p></div></div>' + statusHtml + actions + '</div>';
            }).join('');
            list.querySelectorAll('.adm-btn-approve[data-rid]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var id = parseInt(btn.getAttribute('data-rid'));
                    var books = getRentalBooks();
                    var idx = books.findIndex(function(b) { return b.id === id; });
                    if (idx !== -1) {
                        books[idx].reviewStatus = 'approved';
                        if (window.CampusDB) { CampusDB.saveRentalBooks(books); } else { localStorage.setItem('campus_rental_books', JSON.stringify(books)); }
                        showToast('教材已通过审核', 'success');
                        renderContent('rental');
                    }
                });
            });
            list.querySelectorAll('.adm-btn-reject[data-rid]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var id = parseInt(btn.getAttribute('data-rid'));
                    var books = getRentalBooks();
                    var idx = books.findIndex(function(b) { return b.id === id; });
                    if (idx !== -1) {
                        books[idx].reviewStatus = 'rejected';
                        if (window.CampusDB) { CampusDB.saveRentalBooks(books); } else { localStorage.setItem('campus_rental_books', JSON.stringify(books)); }
                        showToast('教材已拒绝', 'error');
                        renderContent('rental');
                    }
                });
            });
            list.querySelectorAll('.adm-btn-offline[data-rid]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var id = parseInt(btn.getAttribute('data-rid'));
                    var books = getRentalBooks();
                    var idx = books.findIndex(function(b) { return b.id === id; });
                    if (idx !== -1) {
                        books[idx].reviewStatus = 'rejected';
                        if (window.CampusDB) { CampusDB.saveRentalBooks(books); } else { localStorage.setItem('campus_rental_books', JSON.stringify(books)); }
                        showToast('教材已下架', 'error');
                        renderContent('rental');
                    }
                });
            });
        } else {
            list.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:30px">兼职信息审核功能开发中</p>';
        }
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
