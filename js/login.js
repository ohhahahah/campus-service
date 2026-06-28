(function() {
    /* ========== 预设演示账号 ========== */
    var DEMO_STUDENT_ID = '2024001';
    var DEMO_STUDENT_PWD = '123456';
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
        initRegisterLink();
        checkUrlParam();
        initDemoFill();
    }

    /* 演示账号一键填充 + 默认值 */
    function initDemoFill() {
        /* 默认填充学生账号 */
        var stuIdInput = document.getElementById('stuLoginId');
        var stuPwdInput = document.getElementById('stuLoginPwd');
        var admIdInput = document.getElementById('admLoginId');
        var admPwdInput = document.getElementById('admLoginPwd');

        if (stuIdInput && !stuIdInput.value) stuIdInput.value = DEMO_STUDENT_ID;
        if (stuPwdInput && !stuPwdInput.value) stuPwdInput.value = DEMO_STUDENT_PWD;
        if (admIdInput && !admIdInput.value) admIdInput.value = ADMIN_ACCOUNT;
        if (admPwdInput && !admPwdInput.value) admPwdInput.value = ADMIN_PASSWORD;

        /* 一键填充按钮 */
        var fillStudentBtn = document.getElementById('fillStudentBtn');
        if (fillStudentBtn) {
            fillStudentBtn.addEventListener('click', function() {
                stuIdInput.value = DEMO_STUDENT_ID;
                stuPwdInput.value = DEMO_STUDENT_PWD;
                stuIdInput.focus();
            });
        }
        var fillAdminBtn = document.getElementById('fillAdminBtn');
        if (fillAdminBtn) {
            fillAdminBtn.addEventListener('click', function() {
                admIdInput.value = ADMIN_ACCOUNT;
                admPwdInput.value = ADMIN_PASSWORD;
                admIdInput.focus();
            });
        }
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
            /* 检查用户审核状态 */
            if (found.status === 'pending') {
                showToast('注册申请正在审核中，请等待管理员审批', 'error');
                return;
            }
            if (found.status === 'rejected') {
                showToast('注册申请未通过审核，请联系管理员', 'error');
                return;
            }
            /* 检查用户是否被封禁 */
            if (found.status === 'banned') {
                /* 检查是否已到期自动解封 */
                if (found.banExpiry && found.banExpiry !== 'permanent') {
                    var expiry = new Date(found.banExpiry);
                    if (new Date() >= expiry) {
                        /* 自动解封 */
                        found.status = 'approved';
                        found.banExpiry = null;
                        found.banReason = '';
                        found.banTime = null;
                        saveStudents(students);
                    } else {
                        var remainDays = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
                        showToast('该账号已被封禁，剩余' + remainDays + '天解封', 'error');
                        return;
                    }
                } else if (found.banExpiry === 'permanent') {
                    showToast('该账号已被永久封禁，无法登录', 'error');
                    return;
                }
            }
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

            students.push({ stuId: stuId, name: name, password: pwd, dept: dept, phone: phone, regTime: new Date().toISOString(), status: 'pending' });
            saveStudents(students);
            showToast('注册成功！请等待管理员审核通过后登录', 'success');
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

    function initRegisterLink() {
        var regLink = document.getElementById('stuToRegister');
        if (regLink) {
            regLink.addEventListener('click', function() {
                switchTab('studentRegister');
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
