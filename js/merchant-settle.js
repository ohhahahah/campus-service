document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
     * 工具函数
     * ============================================================ */
    function showToast(msg) {
        var toast = document.getElementById('msToast');
        var msgEl = document.getElementById('msToastMsg');
        if (!toast) return;
        msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    /* ============================================================
     * 表单元素引用
     * ============================================================ */
    var form = document.getElementById('settleForm');
    var submitBtn = document.querySelector('.ms-submit-btn');
    var shopNameEl = document.getElementById('shopName');
    var categoryEl = document.getElementById('shopCategory');
    var contactNameEl = document.getElementById('contactName');
    var contactPhoneEl = document.getElementById('contactPhone');
    var accountEl = document.getElementById('merchantAccount');
    var pwdEl = document.getElementById('merchantPwd');

    var licenseData = '';
    var storeData = '';
    var formLocked = false; /* 提交成功后锁定 */

    /* ============================================================
     * 被驳回商家重新提交提示
     * ============================================================ */
    var urlParams = new URLSearchParams(window.location.search);
    var retryAccount = urlParams.get('account');
    if (retryAccount && window.CampusDB) {
        var prevMerchant = CampusDB.getMerchantByAccount(retryAccount);
        if (prevMerchant && prevMerchant.status === 'rejected') {
            accountEl.value = retryAccount;
            var hintDiv = document.createElement('div');
            hintDiv.style.cssText = 'background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#991b1b;line-height:1.7';
            hintDiv.innerHTML = '<i class="fas fa-exclamation-triangle" style="margin-right:6px;color:#dc2626"></i><strong>上次申请被驳回</strong>，原因：' + (prevMerchant.rejectReason || '无') + '。请修改资料后重新提交。';
            var formCard = document.querySelector('.ms-form-card');
            if (formCard) {
                var h2 = formCard.querySelector('h2');
                if (h2 && h2.nextSibling) {
                    formCard.insertBefore(hintDiv, h2.nextSibling);
                } else {
                    formCard.appendChild(hintDiv);
                }
            }
        }
    }

    /* ============================================================
     * 文件上传 - 营业执照
     * ============================================================ */
    document.getElementById('licenseUpload').addEventListener('click', function(e) {
        if (formLocked || e.target.closest('.ms-upload-remove')) return;
        document.getElementById('licensePhoto').click();
    });

    document.getElementById('licensePhoto').addEventListener('change', function() {
        var file = this.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            showToast('文件大小不能超过5MB');
            licenseData = '';
            this.value = '';
            return;
        }
        var reader = new FileReader();
        reader.onload = function(ev) {
            licenseData = ev.target.result; /* 保存完整base64用于详情页回显 */
            document.getElementById('licenseImg').src = licenseData;
            document.getElementById('licensePlaceholder').style.display = 'none';
            document.getElementById('licensePreview').style.display = 'flex';
        };
        reader.onerror = function() {
            licenseData = '';
            showToast('图片读取失败，请重新选择');
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('licenseRemove').addEventListener('click', function(e) {
        e.stopPropagation();
        if (formLocked) return;
        licenseData = '';
        document.getElementById('licensePhoto').value = '';
        document.getElementById('licensePlaceholder').style.display = 'flex';
        document.getElementById('licensePreview').style.display = 'none';
    });

    /* ============================================================
     * 文件上传 - 门店照片
     * ============================================================ */
    document.getElementById('storeUpload').addEventListener('click', function(e) {
        if (formLocked || e.target.closest('.ms-upload-remove')) return;
        document.getElementById('storePhoto').click();
    });

    document.getElementById('storePhoto').addEventListener('change', function() {
        var file = this.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            showToast('文件大小不能超过5MB');
            storeData = '';
            this.value = '';
            return;
        }
        var reader = new FileReader();
        reader.onload = function(ev) {
            storeData = ev.target.result; /* 保存完整base64用于详情页回显 */
            document.getElementById('storeImg').src = storeData;
            document.getElementById('storePlaceholder').style.display = 'none';
            document.getElementById('storePreview').style.display = 'flex';
        };
        reader.onerror = function() {
            storeData = '';
            showToast('图片读取失败，请重新选择');
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('storeRemove').addEventListener('click', function(e) {
        e.stopPropagation();
        if (formLocked) return;
        storeData = '';
        document.getElementById('storePhoto').value = '';
        document.getElementById('storePlaceholder').style.display = 'flex';
        document.getElementById('storePreview').style.display = 'none';
    });

    /* ============================================================
     * 写入数据库（核心接口）
     * ============================================================ */
    function saveMerchantToDB(data) {
        if (window.CampusDB) {
            try {
                var existing = CampusDB.getMerchantByAccount(data.account);
                if (existing && existing.status === 'rejected') {
                    var list = CampusDB.getMerchants();
                    var found = list.find(function(m) { return m.id === existing.id; });
                    if (found) {
                        found.shopName = data.shopName;
                        found.category = data.category;
                        found.contactName = data.contactName;
                        found.contactPhone = data.contactPhone;
                        found.password = data.password;
                        found.licensePhoto = data.licensePhoto;
                        found.storePhoto = data.storePhoto;
                        found.name = data.name;
                        found.status = 'pending';
                        found.createTime = new Date().toLocaleString();
                        found.rejectReason = '';
                        found.reviewTime = '';
                        found.reviewer = '';
                        CampusDB.saveMerchants(list);
                        return true;
                    }
                }
                CampusDB.addMerchant(data);
                return true;
            } catch (e) {
                console.error('[商家入驻] CampusDB 写入失败:', e);
            }
        }

        try {
            var list = [];
            try { list = JSON.parse(localStorage.getItem('campus_merchants') || '[]'); } catch(ex) {}
            var oldRecord = list.find(function(m) { return m.account === data.account && m.status === 'rejected'; });
            if (oldRecord) {
                oldRecord.status = 'pending';
                oldRecord.shopName = data.shopName;
                oldRecord.category = data.category;
                oldRecord.contactName = data.contactName;
                oldRecord.contactPhone = data.contactPhone;
                oldRecord.password = data.password;
                oldRecord.licensePhoto = data.licensePhoto;
                oldRecord.storePhoto = data.storePhoto;
                oldRecord.name = data.name;
                oldRecord.createTime = new Date().toLocaleString();
                oldRecord.rejectReason = '';
                oldRecord.reviewTime = '';
                oldRecord.reviewer = '';
            } else {
                data.id = 'M' + Date.now();
                data.status = 'pending';
                data.createTime = new Date().toLocaleString();
                data.reviewTime = '';
                data.reviewer = '';
                data.rejectReason = '';
                list.unshift(data);
            }
            localStorage.setItem('campus_merchants', JSON.stringify(list));
            return true;
        } catch (e2) {
            console.error('[商家入驻] localStorage 写入失败:', e2);
        }
        return false;
    }

    /* ============================================================
     * 锁定表单（防止重复提交）
     * ============================================================ */
    function lockForm() {
        formLocked = true;
        var inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(function(el) { el.disabled = true; });
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> 申请已提交';
        submitBtn.style.background = '#9ca3af';
        submitBtn.style.cursor = 'not-allowed';
    }

    /* ============================================================
     * 提交入驻申请
     * ============================================================ */
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (formLocked) return;

        var shopName = shopNameEl.value.trim();
        var category = categoryEl.value;
        var contactName = contactNameEl.value.trim();
        var contactPhone = contactPhoneEl.value.trim();
        var account = accountEl.value.trim();
        var pwd = pwdEl.value;

        /* 必填校验（逐项提示） */
        if (!shopName) { showToast('请输入店铺名称'); return; }
        if (!category) { showToast('请选择经营类目'); return; }
        if (!contactName) { showToast('请输入联系人'); return; }
        if (!contactPhone) { showToast('请输入联系电话'); return; }
        if (!account) { showToast('请设置登录账号'); return; }
        if (!pwd) { showToast('请设置登录密码'); return; }
        if (!licenseData) { showToast('请上传营业执照照片'); return; }
        if (!storeData) { showToast('请上传门店实拍照片'); return; }

        /* 格式校验 */
        if (!/^[a-zA-Z0-9]{4,20}$/.test(account)) {
            showToast('账号格式：字母/数字，4-20位');
            return;
        }
        if (pwd.length < 6) {
            showToast('密码至少6位');
            return;
        }
        if (!/^1[3-9]\d{9}$/.test(contactPhone)) {
            showToast('请输入正确的手机号码');
            return;
        }

        /* 检查账号重复 */
        if (window.CampusDB) {
            var existing = CampusDB.getMerchantByAccount(account);
            if (existing && existing.status !== 'rejected') {
                showToast('该账号已被注册，请换一个');
                return;
            }
        }

        /* 构造数据 - 图片保存完整base64，详情页可回显 */
        var data = {
            shopName: shopName,
            category: category,
            contactName: contactName,
            contactPhone: contactPhone,
            account: account,
            password: pwd,
            licensePhoto: licenseData,
            storePhoto: storeData,
            name: contactName
        };

        /* 写入数据库 */
        var success = saveMerchantToDB(data);

        if (success) {
            lockForm();
            document.getElementById('resultModal').classList.add('active');
        } else {
            showToast('提交失败，请稍后重试');
        }
    });

});
