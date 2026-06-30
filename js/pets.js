(function() {
    'use strict';

    var pets = [];

    /* ========== 矢量猫咪插画生成器（替代实景照片） ========== */
    /* 根据品种返回不同颜色主题的简笔猫咪 SVG data URL */
    function catImg(breed, variant) {
        variant = variant || 0;
        var themes = {
            '橘猫':   { bg1:'#FEF3C7', bg2:'#FDE68A', body:'#F59E0B', body2:'#D97706', ear:'#FB923C', belly:'#FEF3C7' },
            '三花猫': { bg1:'#FCE7F3', bg2:'#FBCFE8', body:'#FB7185', body2:'#F97316', ear:'#1F2937', belly:'#FFFFFF' },
            '黑猫':   { bg1:'#E5E7EB', bg2:'#D1D5DB', body:'#1F2937', body2:'#111827', ear:'#374151', belly:'#6B7280' },
            '白猫':   { bg1:'#DBEAFE', bg2:'#BFDBFE', body:'#FFFFFF', body2:'#F3F4F6', ear:'#FBCFE8', belly:'#FFFFFF' },
            '奶牛猫': { bg1:'#FEF3C7', bg2:'#FDE68A', body:'#1F2937', body2:'#374151', ear:'#111827', belly:'#FFFFFF' },
            '狸花猫': { bg1:'#FED7AA', bg2:'#FDBA74', body:'#A16207', body2:'#854D0E', ear:'#713F12', belly:'#FEF3C7' },
            '其他':   { bg1:'#FDE68A', bg2:'#FCD34D', body:'#F59E0B', body2:'#D97706', ear:'#FB923C', belly:'#FEF3C7' }
        };
        var t = themes[breed] || themes['其他'];
        // 3 个表情变体：0 闭眼笑、1 圆眼好奇、2 单眼眨眼
        var faces = [
            '<path d="M75 75 Q80 70 85 75" stroke="#1F2937" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M95 75 Q100 70 105 75" stroke="#1F2937" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M88 84 Q90 86 92 84" stroke="#1F2937" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
            '<circle cx="80" cy="75" r="3.5" fill="#1F2937"/><circle cx="100" cy="75" r="3.5" fill="#1F2937"/><path d="M88 84 Q90 87 92 84" stroke="#1F2937" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
            '<path d="M75 75 Q80 70 85 75" stroke="#1F2937" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="100" cy="75" r="3.5" fill="#1F2937"/><path d="M88 84 Q90 86 92 84" stroke="#1F2937" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
        ];
        // 3 个姿势变体：0 坐姿、1 趴姿、2 站姿
        var bodies = [
            // 坐姿
            '<ellipse cx="90" cy="110" rx="32" ry="28" fill="' + t.body + '"/><ellipse cx="90" cy="120" rx="18" ry="14" fill="' + t.belly + '"/><path d="M62 110 Q55 95 60 80 L72 95 Z" fill="' + t.body + '"/><path d="M118 110 Q125 95 120 80 L108 95 Z" fill="' + t.body + '"/><path d="M68 88 L62 76 L74 84 Z" fill="' + t.ear + '"/><path d="M112 88 L118 76 L106 84 Z" fill="' + t.ear + '"/><path d="M70 138 L75 152 L80 138 Z" fill="' + t.body + '"/><path d="M100 138 L105 152 L110 138 Z" fill="' + t.body + '"/><path d="M55 105 Q50 110 52 118" stroke="' + t.body2 + '" stroke-width="6" fill="none" stroke-linecap="round"/>',
            // 趴姿
            '<ellipse cx="90" cy="120" rx="38" ry="22" fill="' + t.body + '"/><ellipse cx="90" cy="128" rx="22" ry="10" fill="' + t.belly + '"/><path d="M58 115 Q50 100 58 88 L70 105 Z" fill="' + t.body + '"/><path d="M65 96 L60 82 L72 90 Z" fill="' + t.ear + '"/><path d="M55 138 L58 152 L62 138 Z" fill="' + t.body + '"/><path d="M70 142 L72 154 L76 142 Z" fill="' + t.body + '"/><path d="M105 142 L108 154 L112 142 Z" fill="' + t.body + '"/><path d="M118 138 L122 152 L125 138 Z" fill="' + t.body + '"/><path d="M52 110 Q45 115 48 124" stroke="' + t.body2 + '" stroke-width="6" fill="none" stroke-linecap="round"/>',
            // 站姿
            '<ellipse cx="90" cy="105" rx="28" ry="32" fill="' + t.body + '"/><ellipse cx="90" cy="120" rx="16" ry="16" fill="' + t.belly + '"/><path d="M62 100 Q55 85 60 70 L72 90 Z" fill="' + t.body + '"/><path d="M118 100 Q125 85 120 70 L108 90 Z" fill="' + t.body + '"/><path d="M68 82 L62 70 L74 78 Z" fill="' + t.ear + '"/><path d="M112 82 L118 70 L106 78 Z" fill="' + t.ear + '"/><path d="M72 135 L70 152 L78 152 L78 135 Z" fill="' + t.body + '"/><path d="M102 135 L102 152 L110 152 L108 135 Z" fill="' + t.body + '"/><path d="M55 100 Q48 108 50 118" stroke="' + t.body2 + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
        ];
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">'
            + '<defs><linearGradient id="bg' + variant + breed + '" x1="0" y1="0" x2="1" y2="1">'
            + '<stop offset="0" stop-color="' + t.bg1 + '"/><stop offset="1" stop-color="' + t.bg2 + '"/>'
            + '</linearGradient></defs>'
            + '<rect width="180" height="180" fill="url(#bg' + variant + breed + ')"/>'
            + '<circle cx="30" cy="30" r="6" fill="#FFFFFF" opacity="0.4"/>'
            + '<circle cx="150" cy="50" r="4" fill="#FFFFFF" opacity="0.3"/>'
            + '<circle cx="140" cy="160" r="5" fill="#FFFFFF" opacity="0.35"/>'
            + '<text x="20" y="170" font-size="8" fill="' + t.body2 + '" opacity="0.5">🐾</text>'
            + bodies[variant % 3]
            + faces[variant % 3]
            + '</svg>';
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }


    /* ========== 云端API配置 ========== */
    var API_BASE = 'http://localhost:3000'; // 云端API地址，修改为实际服务器地址

    /* ========== 禁用浏览器缓存 fetch 包装 ========== */
    function fetchNoCache(url, options) {
        var separator = url.indexOf('?') === -1 ? '?' : '&';
        var noCacheUrl = url + separator + '_t=' + Date.now() + '&_r=' + Math.random();
        options = options || {};
        options.headers = options.headers || {};
        options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        options.headers['Pragma'] = 'no-cache';
        options.headers['Expires'] = '0';
        return fetch(noCacheUrl, options);
    }

    /* ========== 从云端API加载猫咪数据 ========== */
    function loadPetsFromAPI() {
        return fetchNoCache(API_BASE + '/api/pets')
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success && result.data) {
                    pets = result.data;
                    /* 字段兼容处理 */
                    pets.forEach(function(p) {
                        if (!p.reviewStatus) p.reviewStatus = p.review_status || 'approved';
                    });
                }
                return pets;
            })
            .catch(function(e) {
                console.warn('[Pets] 云端API加载失败，降级到本地存储:', e.message);
                loadPetsFromLocal();
                return pets;
            });
    }

    function loadPetsFromLocal() {
        if (window.CampusDB) {
            pets = window.CampusDB.getPets();
        }
        if (!pets || pets.length === 0) {
            try {
                pets = JSON.parse(localStorage.getItem('campus_pets') || '[]');
            } catch(e) {}
        }
        /* 字段补全 */
        pets.forEach(function(p) {
            if (!p.reviewStatus) p.reviewStatus = p.review_status || 'approved';
        });
    }

    function loadPets() {
        loadPetsFromAPI();
    }

    function init() {
        loadPetsFromAPI().then(function() {
            initHeroSlider();
            animateStats();
            renderPets('all');
            initFilters();
            initModal();
            initImageUpload();
            initForm();
        });
    }

    function initHeroSlider() {
        var slides = document.querySelectorAll('.pets-hero-slide');
        if (!slides.length) return;
        var current = 0;
        var total = slides.length;
        var timer = null;

        function goTo(index) {
            slides[current].classList.remove('active');
            current = index % total;
            slides[current].classList.add('active');
        }

        function startAuto() {
            stopAuto();
            timer = setInterval(function() { goTo(current + 1); }, 5000);
        }

        function stopAuto() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        var hero = document.querySelector('.pets-hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopAuto);
            hero.addEventListener('mouseleave', startAuto);
        }

        startAuto();
    }

    function animateStats() {
        document.querySelectorAll('.pets-stat-num').forEach(function(el) {
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

    function initFilters() {
        document.querySelectorAll('.pets-filter').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.pets-filter').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                renderPets(btn.getAttribute('data-cat'));
            });
        });
    }

    function renderPets(cat) {
        var grid = document.getElementById('petsGrid');
        grid.innerHTML = '';
        var filtered = cat === 'all' ? pets : pets.filter(function(p) {
            if (cat === '其他') return !['橘猫','狸花猫','三花猫','黑猫','白猫'].includes(p.breed);
            return p.breed === cat;
        });
        /* 只展示已审核通过的流浪猫 */
        filtered = filtered.filter(function(p) { return p.reviewStatus === 'approved'; });
        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary)"><i class="fas fa-cat" style="font-size:48px;margin-bottom:12px;display:block;color:#f59e0b"></i>暂无该品种的猫咪信息</div>';
            return;
        }
        filtered.forEach(function(pet) {
            var card = document.createElement('div');
            card.className = 'pets-card';
            card.setAttribute('data-id', pet.id);

            // 卡片图片
            var imgHtml = '<div class="pets-card-img" onclick="window.location.href=\'pet-detail.html?id=' + pet.id + '\'">' +
                '<img src="' + pet.images[0] + '" alt="' + pet.name + '" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<i class=fas fa-cat style=font-size:64px;color:#d97706></i>\'">' +
                '</div>';

            var infoHtml = '<div class="pets-card-info">' +
                '<h4>' + pet.name + '</h4>' +
                '<p><i class="fas fa-paw"></i>' + pet.breed + ' · ' + pet.age + '</p>' +
                '<p><i class="fas fa-map-marker-alt"></i>' + pet.location + '</p>' +
                '<p class="pets-card-health"><i class="fas fa-heartbeat"></i>' + pet.health + '</p>' +
                '<div class="pets-card-tags">' +
                    '<span class="pets-card-tag gender">' + pet.gender + '</span>' +
                    '<span class="pets-card-tag ' + (pet.neutered ? 'neutered' : 'not-neutered') + '">' + (pet.neutered ? '已绝育' : '未绝育') + '</span>' +
                    '<span class="pets-card-tag ' + (pet.vaccinated ? 'vaccinated' : 'not-vaccinated') + '">' + (pet.vaccinated ? '已疫苗' : '待疫苗') + '</span>' +
                '</div>' +
                '<button class="pets-adopt-btn" data-id="' + pet.id + '"><i class="fas fa-hand-holding-heart"></i> 申请领养</button>' +
                '</div>';

            card.innerHTML = imgHtml + infoHtml;
            grid.appendChild(card);
        });

        // 卡片点击跳转（排除按钮点击）
        grid.querySelectorAll('.pets-card').forEach(function(card) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.pets-adopt-btn')) return;
                var id = this.getAttribute('data-id');
                window.location.href = 'pet-detail.html?id=' + id;
            });
        });

        // 领养按钮跳转详情页
        grid.querySelectorAll('.pets-adopt-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.getAttribute('data-id');
                window.location.href = 'pet-detail.html?id=' + id;
            });
        });
    }

    function initModal() {
        document.getElementById('publishPetBtn').addEventListener('click', function() { openModal('petModal'); });
        document.querySelectorAll('.pets-modal-close').forEach(function(btn) {
            btn.addEventListener('click', function() { closeModal(btn.getAttribute('data-modal')); });
        });
        document.querySelectorAll('.pets-modal').forEach(function(modal) {
            modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(modal.id); });
        });
    }

    function openModal(id) { document.getElementById(id).classList.add('active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

    var isSubmitting = false; /* 提交锁，防止重复提交 */
    var uploadedImages = []; /* 存储上传的图片base64数据 */

    function initImageUpload() {
        var uploadArea = document.getElementById('petUploadArea');
        var fileInput = document.getElementById('petImages');
        var previewContainer = document.getElementById('petUploadPreview');
        var placeholder = document.getElementById('petUploadPlaceholder');

        if (!uploadArea || !fileInput) return;

        /* 点击上传区域触发文件选择 */
        uploadArea.addEventListener('click', function(e) {
            if (e.target.closest('.pet-img-remove')) return;
            fileInput.click();
        });

        /* 文件选择变化时预览 */
        fileInput.addEventListener('change', function() {
            var files = Array.prototype.slice.call(this.files);
            files.forEach(function(file) {
                if (!file.type.startsWith('image/')) return;
                if (uploadedImages.length >= 6) { showToast('最多上传6张图片'); return; }
                var reader = new FileReader();
                reader.onload = function(e) {
                    var base64 = e.target.result;
                    uploadedImages.push(base64);
                    renderImagePreviews();
                };
                reader.readAsDataURL(file);
            });
            /* 清空input以允许再次选择相同文件 */
            fileInput.value = '';
        });

        function renderImagePreviews() {
            previewContainer.innerHTML = '';
            if (uploadedImages.length > 0) {
                placeholder.style.display = 'none';
            } else {
                placeholder.style.display = '';
            }
            uploadedImages.forEach(function(src, idx) {
                var item = document.createElement('div');
                item.className = 'pet-upload-preview-item';
                item.innerHTML = '<img src="' + src + '" alt="预览">' +
                    '<button type="button" class="pet-img-remove" data-idx="' + idx + '"><i class="fas fa-times"></i></button>';
                previewContainer.appendChild(item);
            });
            /* 绑定删除按钮 */
            previewContainer.querySelectorAll('.pet-img-remove').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var removeIdx = parseInt(btn.getAttribute('data-idx'));
                    uploadedImages.splice(removeIdx, 1);
                    renderImagePreviews();
                });
            });
        }
    }

    function initForm() {
        document.getElementById('petForm').addEventListener('submit', function(e) {
            e.preventDefault();
            if (isSubmitting) return; /* 正在提交中，忽略重复点击 */
            var name = document.getElementById('petName').value.trim();
            var location = document.getElementById('petLocation').value.trim();
            var contact = document.getElementById('petContact').value.trim();
            if (!name || !location) { showToast('请填写完整信息'); return; }

            isSubmitting = true;
            /* 禁用提交按钮，防止重复点击 */
            var submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.6'; submitBtn.style.cursor = 'not-allowed'; }

            var newPet = {
                id: 'p' + Date.now(),
                name: name,
                breed: document.getElementById('petBreed').value,
                age: document.getElementById('petAge').value,
                gender: document.getElementById('petGender').value,
                neutered: document.getElementById('petNeutered').value === '已绝育',
                vaccinated: false,
                health: document.getElementById('petHealth').value,
                location: location,
                contact: contact,
                personality: '待补充',
                adoptInfo: ['需提供稳定住所证明','承诺科学喂养、定期体检','签署领养协议','接受志愿者定期回访','不弃养承诺'],
                images: uploadedImages.length > 0 ? uploadedImages.slice() : [
                    catImg(document.getElementById('petBreed').value, 0)
                ],
                review_status: 'pending', /* 强制待审核，禁止直接通过 */
                publish_time: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };

            /* 发送到云端API */
            fetchNoCache(API_BASE + '/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet)
            })
            .then(function(res) { return res.json(); })
            .then(function(result) {
                if (result.success) {
                    /* 云端存储成功，同时写入本地作为缓存 */
                    try {
                        var stored = JSON.parse(localStorage.getItem('campus_pets') || '[]');
                        stored.unshift(newPet);
                        localStorage.setItem('campus_pets', JSON.stringify(stored));
                    } catch(e) {}
                    pets.unshift(newPet);
                    renderPets('all');
                    closeModal('petModal');
                    this.reset();
                    uploadedImages = [];
                    var previewContainer = document.getElementById('petUploadPreview');
                    var placeholder = document.getElementById('petUploadPlaceholder');
                    if (previewContainer) previewContainer.innerHTML = '';
                    if (placeholder) placeholder.style.display = '';
                    showToast('流浪猫登记成功，等待管理员审核！');
                } else {
                    showToast('提交失败，请重试');
                }
            }.bind(this))
            .catch(function(e) {
                console.warn('[Pets] 云端提交失败:', e.message);
                /* 云端失败时降级到本地存储 */
                try {
                    var stored2 = JSON.parse(localStorage.getItem('campus_pets') || '[]');
                    stored2.unshift(newPet);
                    localStorage.setItem('campus_pets', JSON.stringify(stored2));
                } catch(e2) {}
                pets.unshift(newPet);
                renderPets('all');
                closeModal('petModal');
                this.reset();
                uploadedImages = [];
                var previewContainer2 = document.getElementById('petUploadPreview');
                var placeholder2 = document.getElementById('petUploadPlaceholder');
                if (previewContainer2) previewContainer2.innerHTML = '';
                if (placeholder2) placeholder2.style.display = '';
                showToast('流浪猫登记成功（本地模式），等待管理员审核！');
            }.bind(this))
            .finally(function() {
                isSubmitting = false;
                if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; submitBtn.style.cursor = ''; }
            });
        });
    }

    function showToast(msg) {
        var toast = document.getElementById('petsToast');
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
