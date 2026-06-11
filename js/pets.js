(function() {
    'use strict';

    var pets = [];

    function loadPets() {
        if (window.CampusDB) {
            pets = window.CampusDB.getPets();
        }
        if (!pets || pets.length === 0) {
            pets = getDefaultPets();
        }
    }

    function getDefaultPets() {
        return [
            {
                id: 'p1', name: '小橘', breed: '橘猫', age: '约2岁', gender: '公',
                neutered: true, vaccinated: true,
                health: '已驱虫、已打疫苗，身体健康，性格亲人',
                location: '2号宿舍楼下', contact: '138****3333',
                personality: '小橘是一只非常亲人的橘猫，喜欢在2号宿舍楼下晒太阳。每次有人经过都会主动蹭腿，特别黏人。吃饭的时候会发出呼噜声，吃饱了就翻肚皮让人摸。',
                images: [
                    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=600&h=450&fit=crop'
                ]
            },
            {
                id: 'p2', name: '花花', breed: '三花猫', age: '约1岁', gender: '母',
                neutered: false, vaccinated: false,
                health: '已驱虫，待打疫苗，活泼好动',
                location: '食堂后门', contact: '139****4444',
                personality: '花花是食堂后门的常客，毛色漂亮，黑白橙三色分明。性格活泼好动，喜欢在花丛中追逐蝴蝶。虽然有点怕生，但熟悉后会用头蹭你的手。',
                images: [
                    'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&h=450&fit=crop'
                ]
            },
            {
                id: 'p3', name: '黑豆', breed: '黑猫', age: '约3岁', gender: '公',
                neutered: true, vaccinated: true,
                health: '已绝育、已驱虫、已打疫苗，安静乖巧',
                location: '图书馆花坛', contact: '137****5555',
                personality: '黑豆是一只安静优雅的黑猫，全身漆黑发亮，眼睛是漂亮的金色。喜欢在图书馆花坛旁安静地坐着，像一个小小的守护者。',
                images: [
                    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=450&fit=crop'
                ]
            },
            {
                id: 'p4', name: '小白', breed: '白猫', age: '约6个月', gender: '母',
                neutered: false, vaccinated: false,
                health: '幼猫，已做初步驱虫，需定期检查',
                location: '教学楼B座', contact: '136****6666',
                personality: '小白是一只纯白色的小奶猫，眼睛一蓝一绿，非常漂亮。因为还是幼猫，好奇心很强，喜欢探索新事物。会用小爪子拍你的手指玩，非常可爱。',
                images: [
                    'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=600&h=450&fit=crop'
                ]
            },
            {
                id: 'p5', name: '奶牛', breed: '奶牛猫', age: '约1.5岁', gender: '公',
                neutered: true, vaccinated: true,
                health: '已绝育、已驱虫、已打疫苗，粘人爱玩',
                location: '操场旁', contact: '135****7777',
                personality: '奶牛是一只黑白花色的猫，像穿着小西装的绅士。性格粘人爱玩，喜欢在操场上追逐飞虫。会主动跳到人腿上求抚摸，是出了名的"社交达人"。',
                images: [
                    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=450&fit=crop'
                ]
            },
            {
                id: 'p6', name: '狸花', breed: '狸花猫', age: '约2岁', gender: '母',
                neutered: true, vaccinated: true,
                health: '已绝育、已驱虫、已打疫苗，独立自主',
                location: '宿舍5号楼', contact: '134****8888',
                personality: '狸花是一只漂亮的中华狸花猫，虎斑纹路清晰漂亮。性格独立自主，不黏人但也不怕人。喜欢在宿舍楼下巡视自己的"领地"，偶尔会让人摸摸头。',
                images: [
                    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=450&fit=crop'
                ]
            },
            {
                id: 'p7', name: '大橘', breed: '橘猫', age: '约4岁', gender: '公',
                neutered: true, vaccinated: true,
                health: '已绝育、已驱虫、已打疫苗，体型偏胖，性格温顺',
                location: '一食堂门口', contact: '133****9999',
                personality: '大橘是校园里最有名的猫，体型圆润，是公认的"校猫"。每天准时在一食堂门口蹲守，同学们都认识它。性格极其温顺，怎么摸都不生气。',
                images: [
                    'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=450&fit=crop'
                ]
            },
            {
                id: 'p8', name: '小灰', breed: '狸花猫', age: '约8个月', gender: '公',
                neutered: false, vaccinated: false,
                health: '幼猫，已驱虫，待打疫苗，胆小但亲人',
                location: '实验楼C座', contact: '132****0000',
                personality: '小灰是一只灰色的狸花幼猫，胆子比较小，刚见到人会躲起来。但只要耐心等待，它会慢慢靠近你，用小脑袋蹭你的手。',
                images: [
                    'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=450&fit=crop'
                ]
            },
            {
                id: 'p9', name: '咪咪', breed: '三花猫', age: '约3岁', gender: '母',
                neutered: true, vaccinated: true,
                health: '已绝育、已驱虫、已打疫苗，喜欢被抚摸',
                location: '行政楼花园', contact: '131****1111',
                personality: '咪咪是一只优雅的三花猫，毛色柔和美丽。最喜欢在行政楼花园的长椅旁晒太阳，看到熟悉的人会主动走过来蹭腿。喜欢被抚摸下巴和耳朵后面，会发出满足的呼噜声。',
                images: [
                    'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=450&fit=crop',
                    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=450&fit=crop'
                ]
            }
        ];
    }

    function init() {
        loadPets();
        initHeroSlider();
        animateStats();
        renderPets('all');
        initFilters();
        initModal();
        initForm();
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
                vaccinated: false,
                health: document.getElementById('petHealth').value,
                location: document.getElementById('petLocation').value,
                contact: document.getElementById('petContact').value,
                personality: '待补充',
                adoptInfo: ['需提供稳定住所证明','承诺科学喂养、定期体检','签署领养协议','接受志愿者定期回访','不弃养承诺'],
                images: [
                    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=450&fit=crop'
                ]
            };
            pets.unshift(newPet);
            if (window.CampusDB) {
                window.CampusDB.addPet(newPet);
            }
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
