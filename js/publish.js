document.addEventListener('DOMContentLoaded', function() {
    var categoryIcons = {
        '数码': 'fas fa-laptop',
        '书籍': 'fas fa-book',
        '生活用品': 'fas fa-couch',
        '运动': 'fas fa-running',
        '实训工具': 'fas fa-tools',
        '小家电': 'fas fa-blender',
        '其他': 'fas fa-box'
    };

    var uploadedImages = [];
    var maxImages = 6;

    function showToast(msg, type) {
        var toast = document.getElementById('pubToast');
        var icon = toast.querySelector('i');
        toast.className = 'pub-toast show';
        if (type === 'error') { toast.classList.add('error'); icon.className = 'fas fa-exclamation-circle'; }
        else if (type === 'success') { toast.classList.add('success'); icon.className = 'fas fa-check-circle'; }
        else { icon.className = 'fas fa-check-circle'; }
        document.getElementById('pubToastMsg').textContent = msg;
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    function getProducts() {
        var STORAGE_KEY = 'campus_secondhand_v2';
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            if (v) return JSON.parse(v);
        } catch(e) {}
        if (window.CampusDB) return CampusDB.getSecondhand();
        try {
            return JSON.parse(localStorage.getItem('campus_secondhand') || '[]');
        } catch(e) {
            return [];
        }
    }

    function saveProducts(list) {
        var STORAGE_KEY = 'campus_secondhand_v2';
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch(e) {}
        if (window.CampusDB) return CampusDB.saveSecondhand(list);
        localStorage.setItem('campus_secondhand', JSON.stringify(list));
    }

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function getStudents() {
        if (window.CampusDB) return CampusDB.getStudents();
        try { return JSON.parse(localStorage.getItem('campus_students') || '[]'); } catch(e) { return []; }
    }

    function autoFillUserInfo() {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') return;
        var students = getStudents();
        var stu = students.find(function(s) { return s.stuId === user.stuId; });
        if (!stu) return;
        var phoneInput = document.getElementById('pubPhone');
        var deptInput = document.getElementById('pubDept');
        if (phoneInput && !phoneInput.value) phoneInput.value = stu.phone || '';
        if (deptInput && !deptInput.value) deptInput.value = stu.dept || '';
    }

    var nameInput = document.getElementById('pubName');
    var descInput = document.getElementById('pubDesc');
    var nameCount = document.getElementById('nameCount');
    var descCount = document.getElementById('descCount');

    if (nameInput) {
        nameInput.addEventListener('input', function() {
            nameCount.textContent = this.value.length;
        });
    }
    if (descInput) {
        descInput.addEventListener('input', function() {
            descCount.textContent = this.value.length;
        });
    }

    autoFillUserInfo();

    var uploadArea = document.getElementById('uploadArea');
    var fileInput = document.getElementById('fileInput');
    var uploadPreview = document.getElementById('uploadPreview');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function() { fileInput.click(); });
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#3b82f6';
            this.style.background = 'rgba(59,130,246,0.05)';
        });
        uploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = '';
            this.style.background = '';
        });
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            handleFiles(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
            this.value = '';
        });
    }

    function handleFiles(files) {
        var processed = 0;
        var totalToProcess = Math.min(files.length, maxImages - uploadedImages.length);
        if (totalToProcess <= 0) {
            showToast('最多上传' + maxImages + '张图片', 'error');
            return;
        }
        for (var i = 0; i < files.length; i++) {
            if (uploadedImages.length >= maxImages) {
                showToast('最多上传' + maxImages + '张图片', 'error');
                break;
            }
            var file = files[i];
            if (!file.type.startsWith('image/')) continue;
            (function(f) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImages.push({ name: f.name, type: f.type, dataUrl: e.target.result });
                    renderPreview();
                };
                reader.readAsDataURL(f);
            })(file);
        }
    }

    function renderPreview() {
        if (!uploadPreview) return;
        uploadPreview.innerHTML = '';
        uploadedImages.forEach(function(img, idx) {
            var item = document.createElement('div');
            item.className = 'pub-upload-preview-item';
            if (img.dataUrl) {
                item.innerHTML = '<img src="' + img.dataUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px">' +
                    (idx === 0 ? '<span class="pub-img-main">主图</span>' : '') +
                    '<button class="pub-img-remove" data-index="' + idx + '"><i class="fas fa-times"></i></button>';
            } else {
                item.innerHTML = '<i class="fas fa-image"></i>' +
                    (idx === 0 ? '<span class="pub-img-main">主图</span>' : '') +
                    '<button class="pub-img-remove" data-index="' + idx + '"><i class="fas fa-times"></i></button>';
            }
            uploadPreview.appendChild(item);
        });
        uploadPreview.querySelectorAll('.pub-img-remove').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var idx = parseInt(this.dataset.index);
                uploadedImages.splice(idx, 1);
                renderPreview();
            });
        });
    }

    var categorySelect = document.getElementById('pubCategory');
    var conditionSelect = document.getElementById('pubCondition');

    var form = document.getElementById('publishForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('pubName').value.trim();
            var category = categorySelect.value;
            var price = document.getElementById('pubPrice').value;
            var condition = conditionSelect.value;
            var desc = document.getElementById('pubDesc').value.trim();
            var originalPrice = document.getElementById('pubOriginalPrice').value;
            var location = document.getElementById('pubLocation').value.trim();
            var buyTime = document.getElementById('pubBuyTime').value.trim();
            var useDuration = document.getElementById('pubUseDuration').value.trim();
            var warranty = document.getElementById('pubWarranty').value;
            var accessories = document.getElementById('pubAccessories').value.trim();
            var phone = document.getElementById('pubPhone').value.trim();
            var dept = document.getElementById('pubDept').value.trim();

            if (!name) { showToast('请输入商品名称', 'error'); document.getElementById('pubName').focus(); return; }
            if (!category) { showToast('请选择商品分类', 'error'); return; }
            if (!price || parseInt(price) <= 0) { showToast('请输入有效售价', 'error'); document.getElementById('pubPrice').focus(); return; }
            if (!condition) { showToast('请选择商品成色', 'error'); return; }
            if (!desc) { showToast('请输入商品描述', 'error'); document.getElementById('pubDesc').focus(); return; }
            if (desc.length < 10) { showToast('商品描述至少10个字', 'error'); return; }

            var user = getCurrentUser();

            var sellerName = '匿名用户';
            var sellerStuId = '';
            var sellerDept = dept || '';
            var sellerPhone = phone || '';
            if (user && user.role === 'student') {
                sellerName = user.name || '匿名用户';
                sellerStuId = user.stuId || '';
                if (!sellerDept && user.dept) sellerDept = user.dept;
                if (!sellerPhone && user.phone) sellerPhone = user.phone;
                var students = getStudents();
                var stuRecord = students.find(function(s) { return s.stuId === user.stuId; });
                if (stuRecord) {
                    if (!sellerDept) sellerDept = stuRecord.dept;
                    if (!sellerPhone) sellerPhone = stuRecord.phone;
                }
            }

            var imageDataUrls = uploadedImages.filter(function(img) { return img.dataUrl; }).map(function(img) { return img.dataUrl; });

            var newProduct = {
                id: Date.now(),
                name: name,
                category: category,
                price: parseInt(price),
                originalPrice: originalPrice ? parseInt(originalPrice) : parseInt(price) * 2,
                condition: condition,
                desc: desc,
                seller: sellerName,
                sellerStuId: sellerStuId,
                sellerDept: sellerDept,
                sellerPhone: sellerPhone,
                views: 0,
                likes: 0,
                collects: 0,
                location: location || '校内当面交易',
                time: '刚刚',
                status: '在售',
                buyTime: buyTime,
                useDuration: useDuration,
                warranty: warranty,
                accessories: accessories,
                tag: 'new',
                comments: [],
                reviewStatus: 'pending',
                images: imageDataUrls
            };

            var products = getProducts();
            products.unshift(newProduct);
            saveProducts(products);

            showToast('发布成功，商品已进入审核，审核通过后将在列表中展示！', 'success');

            setTimeout(function() {
                window.location.href = 'secondhand.html';
            }, 1500);
        });
    }

    var cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (document.getElementById('publishForm').querySelector('input[value]')) {
                if (confirm('确定要取消吗？已填写的信息将不会保存。')) {
                    window.location.href = 'secondhand.html';
                }
            } else {
                window.location.href = 'secondhand.html';
            }
        });
    }
});
