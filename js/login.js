(function() {
    var ADMIN_ACCOUNT = 'admin';
    var ADMIN_PASSWORD = 'admin123';

    function getStudents() {
        if (window.CampusDB) return CampusDB.getStudents();
        try { return JSON.parse(localStorage.getItem('campus_students') || '[]'); } catch(e) { return []; }
    }

    function saveStudents(list) {
        if (window.CampusDB) return CampusDB.saveStudents(list);
        localStorage.setItem('campus_students', JSON.stringify(list));
    }

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function setCurrentUser(user) {
        if (window.CampusDB) return CampusDB.setCurrentUser(user);
        localStorage.setItem('campus_current_user', JSON.stringify(user));
    }

    function clearCurrentUser() {
        if (window.CampusDB) return CampusDB.clearCurrentUser();
        localStorage.removeItem('campus_current_user');
    }

    function init() {
        var user = getCurrentUser();
        if (user) {
            window.location.href = 'index.html';
            return;
        }
        initTabs();
        initStudentLogin();
        initAdminLogin();
        initStudentRegister();
        initForgotPassword();
        initToLoginLink();
        checkUrlParam();
    }

    function checkUrlParam() {
        var params = new URLSearchParams(window.location.search);
        var type = params.get('type');
        if (type === 'admin') {
            switchTab('adminLogin');
        } else if (type === 'register') {
            switchTab('studentRegister');
        }
    }

    function initTabs() {
        document.querySelectorAll('.lg-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                switchTab(tab.getAttribute('data-tab'));
            });
        });
    }

    function switchTab(tabName) {
        document.querySelectorAll('.lg-tab').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.lg-form-wrapper').forEach(function(f) { f.classList.remove('active'); });
        var targetTab = document.querySelector('.lg-tab[data-tab="' + tabName + '"]');
        var targetForm = document.getElementById(tabName + 'Form');
        if (targetTab) targetTab.classList.add('active');
        if (targetForm) targetForm.classList.add('active');
    }

    function initStudentLogin() {
        document.getElementById('studentLogin').addEventListener('submit', function(e) {
            e.preventDefault();
            var stuId = document.getElementById('stuLoginId').value.trim();
            var pwd = document.getElementById('stuLoginPwd').value;
            if (!stuId || !pwd) { showToast('请填写学号和密码', 'error'); return; }
            var students = getStudents();
            var found = students.find(function(s) { return s.stuId === stuId && s.password === pwd; });
            if (!found) { showToast('学号或密码错误，请检查后重试', 'error'); return; }
            var remember = document.getElementById('stuRemember').checked;
            setCurrentUser({ role: 'student', stuId: found.stuId, name: found.name, dept: found.dept, phone: found.phone, remember: remember });
            showToast('登录成功！欢迎回来，' + found.name, 'success');
            setTimeout(function() { window.location.href = 'index.html'; }, 1200);
        });
    }

    function initAdminLogin() {
        document.getElementById('adminLogin').addEventListener('submit', function(e) {
            e.preventDefault();
            var admId = document.getElementById('admLoginId').value.trim();
            var admPwd = document.getElementById('admLoginPwd').value;
            if (!admId || !admPwd) { showToast('请填写管理员账号和密码', 'error'); return; }
            if (admId !== ADMIN_ACCOUNT || admPwd !== ADMIN_PASSWORD) {
                showToast('管理员账号或密码错误', 'error');
                return;
            }
            setCurrentUser({ role: 'admin', name: '系统管理员' });
            showToast('管理员登录成功！', 'success');
            setTimeout(function() { window.location.href = 'admin.html'; }, 1200);
        });
    }

    function initStudentRegister() {
        document.getElementById('studentRegister').addEventListener('submit', function(e) {
            e.preventDefault();
            var stuId = document.getElementById('regStuId').value.trim();
            var name = document.getElementById('regName').value.trim();
            var pwd = document.getElementById('regPwd').value;
            var pwdConfirm = document.getElementById('regPwdConfirm').value;
            var dept = document.getElementById('regDept').value;
            var phone = document.getElementById('regPhone').value.trim();
            var agree = document.getElementById('regAgree').checked;

            if (!stuId || !name || !pwd || !pwdConfirm || !dept || !phone) {
                showToast('请填写所有必填信息', 'error'); return;
            }
            if (stuId.length < 4) { showToast('学号格式不正确', 'error'); return; }
            if (pwd.length < 6) { showToast('密码长度不能少于6位', 'error'); return; }
            if (pwd !== pwdConfirm) { showToast('两次输入的密码不一致', 'error'); return; }
            if (!/^1[3-9]\d{9}$/.test(phone)) { showToast('请输入正确的手机号码', 'error'); return; }
            if (!agree) { showToast('请阅读并同意用户服务协议', 'error'); return; }

            var students = getStudents();
            var exists = students.find(function(s) { return s.stuId === stuId; });
            if (exists) { showToast('该学号已注册，请直接登录', 'error'); return; }

            students.push({ stuId: stuId, name: name, password: pwd, dept: dept, phone: phone, regTime: new Date().toISOString() });
            saveStudents(students);
            showToast('注册成功！请登录', 'success');
            this.reset();
            setTimeout(function() { switchTab('studentLogin'); }, 800);
        });
    }

    function initForgotPassword() {
        var forgotBtn = document.getElementById('stuForgot');
        if (forgotBtn) {
            forgotBtn.addEventListener('click', function() {
                showToast('请联系辅导员或管理员重置密码', 'success');
            });
        }
    }

    function initToLoginLink() {
        var toLoginLink = document.querySelector('.lg-to-login');
        if (toLoginLink) {
            toLoginLink.addEventListener('click', function() {
                switchTab('studentLogin');
            });
        }
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
