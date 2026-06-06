(function() {
    'use strict';

    var pets = [
        { id: 'p1', name: '小橘', breed: '橘猫', age: '约2岁', gender: '公', neutered: true, health: '已驱虫、已打疫苗，身体健康，性格亲人', location: '2号宿舍楼下', contact: '138****3333', emoji: '🐱' },
        { id: 'p2', name: '花花', breed: '三花猫', age: '约1岁', gender: '母', neutered: false, health: '已驱虫，待打疫苗，活泼好动', location: '食堂后门', contact: '139****4444', emoji: '🐱' },
        { id: 'p3', name: '黑豆', breed: '黑猫', age: '约3岁', gender: '公', neutered: true, health: '已绝育、已驱虫、已打疫苗，安静乖巧', location: '图书馆花坛', contact: '137****5555', emoji: '🐈‍⬛' },
        { id: 'p4', name: '小白', breed: '白猫', age: '约6个月', gender: '母', neutered: false, health: '幼猫，已做初步驱虫，需定期检查', location: '教学楼B座', contact: '136****6666', emoji: '🤍' },
        { id: 'p5', name: '奶牛', breed: '奶牛猫', age: '约1.5岁', gender: '公', neutered: true, health: '已绝育、已驱虫、已打疫苗，粘人爱玩', location: '操场旁', contact: '135****7777', emoji: '🐄' },
        { id: 'p6', name: '狸花', breed: '狸花猫', age: '约2岁', gender: '母', neutered: true, health: '已绝育、已驱虫、已打疫苗，独立自主', location: '宿舍5号楼', contact: '134****8888', emoji: '🐯' },
        { id: 'p7', name: '大橘', breed: '橘猫', age: '约4岁', gender: '公', neutered: true, health: '已绝育、已驱虫、已打疫苗，体型偏胖，性格温顺', location: '一食堂门口', contact: '133****9999', emoji: '🐱' },
        { id: 'p8', name: '小灰', breed: '狸花猫', age: '约8个月', gender: '公', neutered: false, health: '幼猫，已驱虫，待打疫苗，胆小但亲人', location: '实验楼C座', contact: '132****0000', emoji: '🐯' },
        { id: 'p9', name: '咪咪', breed: '三花猫', age: '约3岁', gender: '母', neutered: true, health: '已绝育、已驱虫、已打疫苗，喜欢被抚摸', location: '行政楼花园', contact: '131****1111', emoji: '🐱' }
    ];

    function init() {
        animateStats();
        renderPets('all');
        initFilters();
        initModal();
        initForm();
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
        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary)"><i class="fas fa-cat" style="font-size:48px;margin-bottom:12px;display:block;color:#f59e0b"></i>暂无该品种的猫咪信息</div>';
            return;
        }
        filtered.forEach(function(pet) {
            var card = document.createElement('div');
            card.className = 'pets-card';
            card.innerHTML = '<div class="pets-card-img">' + pet.emoji + '</div>' +
                '<div class="pets-card-info">' +
                    '<h4>' + pet.name + '</h4>' +
                    '<p><i class="fas fa-paw"></i>' + pet.breed + ' · ' + pet.age + '</p>' +
                    '<p><i class="fas fa-map-marker-alt"></i>' + pet.location + '</p>' +
                    '<p><i class="fas fa-heartbeat"></i>' + pet.health + '</p>' +
                    '<div class="pets-card-tags">' +
                        '<span class="pets-card-tag gender">' + pet.gender + '</span>' +
                        '<span class="pets-card-tag ' + (pet.neutered ? 'neutered' : 'not-neutered') + '">' + (pet.neutered ? '已绝育' : '未绝育') + '</span>' +
                    '</div>' +
                    '<button class="pets-adopt-btn" data-id="' + pet.id + '"><i class="fas fa-hand-holding-heart"></i> 申请领养</button>' +
                '</div>';
            grid.appendChild(card);
        });
        grid.querySelectorAll('.pets-adopt-btn').forEach(function(btn) {
            btn.addEventListener('click', function() { showToast('领养申请已提交，请等待审核！'); });
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

    function initForm() {
        document.getElementById('petForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var newPet = {
                id: 'p' + Date.now(),
                name: document.getElementById('petName').value,
                breed: document.getElementById('petBreed').value,
                age: document.getElementById('petAge').value,
                gender: document.getElementById('petGender').value,
                neutered: document.getElementById('petNeutered').value === '已绝育',
                health: document.getElementById('petHealth').value,
                location: document.getElementById('petLocation').value,
                contact: document.getElementById('petContact').value,
                emoji: '🐱'
            };
            pets.unshift(newPet);
            renderPets('all');
            closeModal('petModal');
            this.reset();
            showToast('流浪猫登记成功！');
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
