(function() {
    'use strict';

    // 猫咪完整数据（与 pets.js/db.js 同步，含详情字段）
    var petsData = [];

    /* ========== 矢量猫咪插画生成器（替代实景照片，与 pets.js 同步） ========== */
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
        var faces = [
            '<path d="M75 75 Q80 70 85 75" stroke="#1F2937" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M95 75 Q100 70 105 75" stroke="#1F2937" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M88 84 Q90 86 92 84" stroke="#1F2937" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
            '<circle cx="80" cy="75" r="3.5" fill="#1F2937"/><circle cx="100" cy="75" r="3.5" fill="#1F2937"/><path d="M88 84 Q90 87 92 84" stroke="#1F2937" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
            '<path d="M75 75 Q80 70 85 75" stroke="#1F2937" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="100" cy="75" r="3.5" fill="#1F2937"/><path d="M88 84 Q90 86 92 84" stroke="#1F2937" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
        ];
        var bodies = [
            '<ellipse cx="90" cy="110" rx="32" ry="28" fill="' + t.body + '"/><ellipse cx="90" cy="120" rx="18" ry="14" fill="' + t.belly + '"/><path d="M62 110 Q55 95 60 80 L72 95 Z" fill="' + t.body + '"/><path d="M118 110 Q125 95 120 80 L108 95 Z" fill="' + t.body + '"/><path d="M68 88 L62 76 L74 84 Z" fill="' + t.ear + '"/><path d="M112 88 L118 76 L106 84 Z" fill="' + t.ear + '"/><path d="M70 138 L75 152 L80 138 Z" fill="' + t.body + '"/><path d="M100 138 L105 152 L110 138 Z" fill="' + t.body + '"/><path d="M55 105 Q50 110 52 118" stroke="' + t.body2 + '" stroke-width="6" fill="none" stroke-linecap="round"/>',
            '<ellipse cx="90" cy="120" rx="38" ry="22" fill="' + t.body + '"/><ellipse cx="90" cy="128" rx="22" ry="10" fill="' + t.belly + '"/><path d="M58 115 Q50 100 58 88 L70 105 Z" fill="' + t.body + '"/><path d="M65 96 L60 82 L72 90 Z" fill="' + t.ear + '"/><path d="M55 138 L58 152 L62 138 Z" fill="' + t.body + '"/><path d="M70 142 L72 154 L76 142 Z" fill="' + t.body + '"/><path d="M105 142 L108 154 L112 142 Z" fill="' + t.body + '"/><path d="M118 138 L122 152 L125 138 Z" fill="' + t.body + '"/><path d="M52 110 Q45 115 48 124" stroke="' + t.body2 + '" stroke-width="6" fill="none" stroke-linecap="round"/>',
            '<ellipse cx="90" cy="105" rx="28" ry="32" fill="' + t.body + '"/><ellipse cx="90" cy="120" rx="16" ry="16" fill="' + t.belly + '"/><path d="M62 100 Q55 85 60 70 L72 90 Z" fill="' + t.body + '"/><path d="M118 100 Q125 85 120 70 L108 90 Z" fill="' + t.body + '"/><path d="M68 82 L62 70 L74 78 Z" fill="' + t.ear + '"/><path d="M112 82 L118 70 L106 78 Z" fill="' + t.ear + '"/><path d="M72 135 L70 152 L78 152 L78 135 Z" fill="' + t.body + '"/><path d="M102 135 L102 152 L110 152 L108 135 Z" fill="' + t.body + '"/><path d="M55 100 Q48 108 50 118" stroke="' + t.body2 + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
        ];
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">'
            + '<defs><linearGradient id="pdbg' + variant + breed + '" x1="0" y1="0" x2="1" y2="1">'
            + '<stop offset="0" stop-color="' + t.bg1 + '"/><stop offset="1" stop-color="' + t.bg2 + '"/>'
            + '</linearGradient></defs>'
            + '<rect width="180" height="180" fill="url(#pdbg' + variant + breed + ')"/>'
            + '<circle cx="30" cy="30" r="6" fill="#FFFFFF" opacity="0.4"/>'
            + '<circle cx="150" cy="50" r="4" fill="#FFFFFF" opacity="0.3"/>'
            + '<circle cx="140" cy="160" r="5" fill="#FFFFFF" opacity="0.35"/>'
            + bodies[variant % 3]
            + faces[variant % 3]
            + '</svg>';
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }


    function loadPetsData() {
        if (window.CampusDB) {
            petsData = window.CampusDB.getPets();
        }
        if (!petsData || petsData.length === 0) {
            try {
                petsData = JSON.parse(localStorage.getItem('campus_pets') || '[]');
            } catch(e) {}
        }
        /* 不再使用默认模拟数据，只读取数据库真实记录 */
    }

    var currentPet = null;
    var currentImgIndex = 0;

    function init() {
        loadPetsData();

        var params = new URLSearchParams(window.location.search);
        var petId = params.get('id');

        if (!petId) {
            showNotFound();
            return;
        }

        currentPet = petsData.find(function(p) { return p.id === petId; });
        if (!currentPet) {
            showNotFound();
            return;
        }

        document.getElementById('breadcrumbName').textContent = currentPet.name;
        document.title = currentPet.name + ' - 猫咪详情 - 智慧校园';
        renderDetail();
        initAdoptModal();
    }

    function showNotFound() {
        document.getElementById('petDetailMain').innerHTML =
            '<div style="text-align:center;padding:120px 20px">' +
                '<i class="fas fa-cat" style="font-size:64px;color:#f59e0b;margin-bottom:20px;display:block"></i>' +
                '<h2 style="font-size:24px;color:var(--text-primary);margin-bottom:12px">未找到该猫咪信息</h2>' +
                '<p style="color:var(--text-secondary);margin-bottom:24px">可能已被领养或信息已更新</p>' +
                '<a href="pets.html" style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border-radius:10px;text-decoration:none;font-weight:600"><i class="fas fa-arrow-left"></i> 返回列表</a>' +
            '</div>';
    }

    function renderDetail() {
        var p = currentPet;
        var genderIcon = p.gender === '公' ? 'fa-mars male' : 'fa-venus female';
        var healthItems = p.health.split('、');

        var html = '<div class="pet-detail-wrap">';

        // 图片区
        html += '<div class="pet-detail-gallery">';
        html += '<div class="pet-detail-main-img">';
        html += '<img id="mainImg" src="' + p.images[0] + '" alt="' + p.name + '" onerror="this.style.opacity=\'0.5\'">';
        html += '<div class="pet-detail-img-count"><i class="fas fa-images"></i> 1/' + p.images.length + '</div>';
        html += '</div>';

        if (p.images.length > 1) {
            html += '<div class="pet-detail-thumbs">';
            p.images.forEach(function(img, i) {
                html += '<div class="pet-detail-thumb' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">';
                html += '<img src="' + img + '" alt="' + p.name + ' ' + (i+1) + '" onerror="this.style.opacity=\'0.5\'">';
                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div>';

        // 信息区
        html += '<div class="pet-detail-info">';

        // 名字和品种
        html += '<div>';
        html += '<h1 class="pet-detail-name">' + p.name + ' <i class="fas ' + genderIcon + ' pet-gender-icon"></i></h1>';
        html += '<p class="pet-detail-breed">' + p.breed + ' · ' + p.age + '</p>';
        html += '</div>';

        // 标签
        html += '<div class="pet-detail-tags">';
        html += '<span class="pet-detail-tag gender-tag"><i class="fas ' + (p.gender === '公' ? 'fa-mars' : 'fa-venus') + '"></i> ' + p.gender + '</span>';
        html += '<span class="pet-detail-tag ' + (p.neutered ? 'neutered' : 'not-neutered') + '">' + (p.neutered ? '已绝育' : '未绝育') + '</span>';
        html += '<span class="pet-detail-tag ' + (p.vaccinated ? 'vaccinated' : 'not-vaccinated') + '">' + (p.vaccinated ? '已打疫苗' : '待打疫苗') + '</span>';
        html += '</div>';

        // 信息网格
        html += '<div class="pet-detail-meta">';
        html += '<div class="pet-meta-item"><i class="fas fa-paw"></i><div><div class="meta-label">品种</div><div class="meta-value">' + p.breed + '</div></div></div>';
        html += '<div class="pet-meta-item"><i class="fas fa-birthday-cake"></i><div><div class="meta-label">年龄</div><div class="meta-value">' + p.age + '</div></div></div>';
        html += '<div class="pet-meta-item"><i class="fas fa-map-marker-alt"></i><div><div class="meta-label">发现地点</div><div class="meta-value">' + p.location + '</div></div></div>';
        html += '<div class="pet-meta-item"><i class="fas fa-' + (p.gender === '公' ? 'mars' : 'venus') + '"></i><div><div class="meta-label">性别</div><div class="meta-value">' + p.gender + '</div></div></div>';
        html += '</div>';

        // 性格介绍
        html += '<div class="pet-detail-personality">';
        html += '<h3><i class="fas fa-heart"></i> 性格介绍</h3>';
        html += '<p>' + p.personality + '</p>';
        html += '</div>';

        // 健康状态
        html += '<div class="pet-detail-health">';
        html += '<h3><i class="fas fa-stethoscope"></i> 健康状态</h3>';
        html += '<div class="pet-health-list">';
        if (p.neutered) {
            html += '<div class="pet-health-item"><i class="fas fa-check-circle"></i> 已绝育</div>';
        } else {
            html += '<div class="pet-health-item"><i class="fas fa-clock"></i> 待绝育</div>';
        }
        if (p.vaccinated) {
            html += '<div class="pet-health-item"><i class="fas fa-check-circle"></i> 已接种疫苗</div>';
        } else {
            html += '<div class="pet-health-item"><i class="fas fa-clock"></i> 待接种疫苗</div>';
        }
        html += '<div class="pet-health-item"><i class="fas fa-check-circle"></i> 已驱虫</div>';
        html += '</div></div>';

        // 领养说明
        html += '<div class="pet-detail-adopt-info">';
        html += '<h3><i class="fas fa-clipboard-list"></i> 领养说明</h3>';
        html += '<ul>';
        p.adoptInfo.forEach(function(item) {
            html += '<li>' + item + '</li>';
        });
        html += '</ul></div>';

        // 联系人
        html += '<div class="pet-detail-contact">';
        html += '<h3><i class="fas fa-user"></i> 联系人信息</h3>';
        html += '<div class="pet-contact-info">';
        html += '<div class="pet-contact-avatar"><i class="fas fa-user"></i></div>';
        html += '<div class="pet-contact-text"><div class="contact-name">爱心志愿者</div><div class="contact-phone"><i class="fas fa-phone"></i> ' + p.contact + '</div></div>';
        html += '</div></div>';

        // 操作按钮
        html += '<div class="pet-detail-actions">';
        var currentUser = null;
        try { currentUser = JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) {}
        var isPetOwner = currentUser && (currentUser.name === p.publisher || (currentUser.stuId && currentUser.stuId === p.publisherStuId));
        if (isPetOwner) {
            html += '<button class="pet-adopt-btn" style="opacity:0.5;cursor:not-allowed" disabled><i class="fas fa-user"></i> 我发布的</button>';
        } else {
            html += '<button class="pet-adopt-btn" id="adoptBtn"><i class="fas fa-hand-holding-heart"></i> 申请领养</button>';
        }
        html += '<button class="pet-contact-btn" onclick="location.href=\'pets.html\'"><i class="fas fa-arrow-left"></i> 返回列表</button>';
        html += '</div>';

        html += '</div>'; // pet-detail-info
        html += '</div>'; // pet-detail-wrap

        document.getElementById('petDetailMain').innerHTML = html;

        // 绑定图片切换
        initGallery();
        // 绑定领养按钮
        var adoptBtn = document.getElementById('adoptBtn');
        if (adoptBtn) {
            adoptBtn.addEventListener('click', function() {
                openModal('adoptModal');
            });
        }
    }

    function initGallery() {
        var thumbs = document.querySelectorAll('.pet-detail-thumb');
        var mainImg = document.getElementById('mainImg');
        var countEl = document.querySelector('.pet-detail-img-count');

        thumbs.forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-index'));
                currentImgIndex = idx;
                mainImg.src = currentPet.images[idx];
                thumbs.forEach(function(t) { t.classList.remove('active'); });
                this.classList.add('active');
                countEl.innerHTML = '<i class="fas fa-images"></i> ' + (idx + 1) + '/' + currentPet.images.length;
            });
        });
    }

    function initAdoptModal() {
        document.querySelectorAll('.pets-modal-close').forEach(function(btn) {
            btn.addEventListener('click', function() { closeModal(btn.getAttribute('data-modal')); });
        });
        document.querySelectorAll('.pets-modal').forEach(function(modal) {
            modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(modal.id); });
        });

        document.getElementById('adoptForm').addEventListener('submit', function(e) {
            e.preventDefault();
            closeModal('adoptModal');
            this.reset();
            showToast('领养申请已提交，志愿者将在3个工作日内联系您！');
        });
    }

    function openModal(id) { document.getElementById(id).classList.add('active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

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
