document.addEventListener('DOMContentLoaded', function() {
    /* ============================================================
     * Hero 轮播
     * ============================================================ */
    (function initHeroSlider() {
        var slides = document.querySelectorAll('.sh-hero-slide');
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

        var hero = document.querySelector('.sh-hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopAuto);
            hero.addEventListener('mouseleave', startAuto);
        }

        startAuto();
    })();

    /* ============================================================
     * 工具函数
     * ============================================================ */
    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function showToast(msg) {
        var toast = document.getElementById('toast');
        if (!toast) return;
        document.getElementById('toastMsg').textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    /* ============================================================
     * 分类图标 & 图片映射
     * ============================================================ */
    var categoryIcons = {
        '数码': 'fas fa-laptop', '书籍': 'fas fa-book', '生活用品': 'fas fa-couch',
        '运动': 'fas fa-running', '实训工具': 'fas fa-tools', '小家电': 'fas fa-blender', '其他': 'fas fa-box'
    };

    var productCoverImages = {
        1:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        2:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop',
        3:'https://images.unsplash.com/photo-1592656034223-8f862b5b4946?w=600&h=400&fit=crop',
        4:'https://images.unsplash.com/photo-1586953208270-767fc2b4be75?w=600&h=400&fit=crop',
        5:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
        6:'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop',
        7:'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=400&fit=crop',
        8:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=400&fit=crop',
        9:'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=400&fit=crop',
        10:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop',
        11:'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&h=400&fit=crop',
        12:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop',
        13:'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
        14:'https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=600&h=400&fit=crop',
        15:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
        16:'https://images.unsplash.com/photo-1530124566582-a45a7e3e29f0?w=600&h=400&fit=crop',
        17:'https://images.unsplash.com/photo-1570222094114-d054a816e5e4?w=600&h=400&fit=crop',
        18:'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=400&fit=crop',
        19:'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&h=400&fit=crop',
        20:'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
        21:'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=400&fit=crop',
        22:'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop',
        23:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
        24:'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&h=400&fit=crop',
        25:'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=600&h=400&fit=crop',
        26:'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=400&fit=crop',
        27:'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop',
        28:'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop',
        29:'https://images.unsplash.com/photo-1585771724684-38269d6639db?w=600&h=400&fit=crop',
        30:'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop',
        31:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
        32:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
        33:'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=400&fit=crop'
    };

    var categoryFallbackImages = {
        '数码':'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
        '书籍':'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=400&fit=crop',
        '运动':'https://images.unsplash.com/photo-1461896836934-bd45ba8f8e25?w=600&h=400&fit=crop',
        '小家电':'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
        '生活用品':'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&h=400&fit=crop',
        '实训工具':'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop',
        '其他':'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop'
    };

    function getProductImage(product) {
        if (product.images && Array.isArray(product.images) && product.images.length > 0) return product.images[0];
        if (productCoverImages[product.id]) return productCoverImages[product.id];
        return categoryFallbackImages[product.category] || categoryFallbackImages['其他'];
    }

    /* ============================================================
     * 商品数据（通过 API 获取）
     * ============================================================ */
    var products = []; // 本地缓存，由 API 填充
    var isLoading = false;

    function getProducts() {
        if (window.CampusDB) return CampusDB.getSecondhand();
        try {
            var stored = JSON.parse(localStorage.getItem('campus_secondhand_v2') || '[]');
            if (stored.length === 0) return [];
            return stored;
        } catch(e) { return []; }
    }

    function saveProducts(list) {
        if (window.CampusDB) CampusDB.saveSecondhand(list);
        else localStorage.setItem('campus_secondhand_v2', JSON.stringify(list));
    }

    /* ============================================================
     * 教材租用数据
     * ============================================================ */
    var rentalBooks = [
        { id:1,name:'高等数学（同济第七版）上册',price:15,period:'1学期',condition:'少量笔记',desc:'适用理工科专业，含部分课堂笔记。',seller:'数学系学长',sellerDept:'数学与统计学院',available:true,reviewStatus:'approved',views:89,likes:23,collects:8,time:'2天前' },
        { id:2,name:'大学物理（第四版）',price:12,period:'1学期',condition:'几乎全新',desc:'适用物理、工科专业，保存完好。',seller:'物理系学姐',sellerDept:'物理与电子学院',available:true,reviewStatus:'approved',views:56,likes:12,collects:5,time:'3天前' },
        { id:3,name:'线性代数及其应用',price:10,period:'1学期',condition:'有笔记标注',desc:'含详细课堂笔记，期末复习利器。',seller:'数学系同学',sellerDept:'数学与统计学院',available:true,reviewStatus:'approved',views:67,likes:18,collects:7,time:'4天前' },
        { id:4,name:'C++ Primer Plus 第6版',price:20,period:'1学年',condition:'几乎全新',desc:'计算机专业经典教材，含课后习题答案。',seller:'计算机系学长',sellerDept:'计算机学院',available:true,reviewStatus:'approved',views:134,likes:45,collects:20,time:'1天前' },
        { id:5,name:'微观经济学（曼昆）',price:18,period:'1学期',condition:'少量笔记',desc:'经管专业核心教材，重点标注清晰。',seller:'经济系学姐',sellerDept:'经济管理学院',available:false,reviewStatus:'approved',views:98,likes:34,collects:15,time:'5天前' },
        { id:6,name:'数据结构与算法分析',price:22,period:'1学年',condition:'少量笔记',desc:'计算机专业必修，含代码示例和算法图解。',seller:'软件工程学长',sellerDept:'计算机学院',available:true,reviewStatus:'approved',views:112,likes:38,collects:16,time:'2天前' }
    ];

    function getRentalBooks() {
        if (window.CampusDB) return CampusDB.getRentalBooks();
        try {
            var stored = JSON.parse(localStorage.getItem('campus_rental_books_v2') || '[]');
            if (stored.length === 0) {
                /* 兼容旧键 */
                var old = JSON.parse(localStorage.getItem('campus_rental_books') || '[]');
                if (old.length > 0) { localStorage.setItem('campus_rental_books_v2', JSON.stringify(old)); return old; }
                localStorage.setItem('campus_rental_books_v2', JSON.stringify(rentalBooks));
                return rentalBooks;
            }
            return stored;
        } catch(e) { return rentalBooks; }
    }

    function saveRentalBooks(list) {
        if (window.CampusDB) CampusDB.saveRentalBooks(list);
        else {
            localStorage.setItem('campus_rental_books_v2', JSON.stringify(list));
            localStorage.setItem('campus_rental_books', JSON.stringify(list)); /* 双写兼容 */
        }
    }

    /* ============================================================
     * 聊天数据（按会话key分组存储）
     * ============================================================ */
    function getChatData() {
        try { return JSON.parse(localStorage.getItem('campus_chat') || '{}'); } catch(e) { return {}; }
    }
    function saveChatData(data) {
        localStorage.setItem('campus_chat', JSON.stringify(data));
    }
    function getChatSessionKey(productId, userId, sellerId) {
        var ids = [userId, sellerId].sort();
        return productId + '_' + ids[0] + '_' + ids[1];
    }

    /* ============================================================
     * 收藏数据
     * ============================================================ */
    function getCollected() {
        try { return JSON.parse(localStorage.getItem('campus_collected') || '[]'); } catch(e) { return []; }
    }
    function saveCollected(list) {
        localStorage.setItem('campus_collected', JSON.stringify(list));
    }
    function isCollected(productId) {
        var list = getCollected();
        return list.some(function(c) { return c.productId === productId; });
    }
    function toggleCollect(product) {
        var list = getCollected();
        var idx = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i].productId === product.id) { idx = i; break; }
        }
        if (idx >= 0) {
            list.splice(idx, 1);
            saveCollected(list);
            return false;
        } else {
            list.unshift({
                productId: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                condition: product.condition,
                seller: product.seller,
                sellerDept: product.sellerDept || '',
                img: getProductImage(product),
                time: new Date().toLocaleString()
            });
            saveCollected(list);
            return true;
        }
    }

    /* ============================================================
     * 租用订单数据
     * ============================================================ */
    function getOrders() {
        try { return JSON.parse(localStorage.getItem('campus_rental_orders') || '[]'); } catch(e) { return []; }
    }
    function saveOrders(list) {
        localStorage.setItem('campus_rental_orders', JSON.stringify(list));
    }

    /* ============================================================
     * 状态变量
     * ============================================================ */
    var currentCategory = 'all';
    var currentSort = 'latest';
    var currentSearchKeyword = '';
    var currentChatProduct = null;
    var currentChatSellerId = null;

    /* ============================================================
     * 统计数字动画 & 动态更新（通过 API）
     * ============================================================ */
    function updateStats() {
        if (!window.SecondhandAPI) return;
        SecondhandAPI.getStats().then(function(stats) {
            var statNums = document.querySelectorAll('.sh-stat-num');
            if (statNums.length >= 3) {
                animateNumber(statNums[0], stats.onSale);
                animateNumber(statNums[1], stats.soldCount);
                animateNumber(statNums[2], stats.activeUsers);
            }
            /* 更新分类卡片在售数量 */
            var catCounts = stats.categoryCounts || {};
            document.querySelectorAll('.sh-category-card[data-cat]').forEach(function(card) {
                var cat = card.dataset.cat;
                var small = card.querySelector('small');
                if (small && catCounts[cat] !== undefined) {
                    small.textContent = catCounts[cat] + '件在售';
                }
            });
            console.log('[二手市场] 统计数据更新:', stats);
        }).catch(function(err) {
            console.warn('[二手市场] 统计数据获取失败:', err);
        });
    }

    function animateNumber(el, target) {
        var current = 0;
        var step = Math.ceil(target / 40);
        var timer = setInterval(function() {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current.toLocaleString();
        }, 30);
    }

    updateStats();

    /* ============================================================
     * 渲染热门好物（通过 API 获取）
     * ============================================================ */
    function renderHotProducts() {
        var grid = document.getElementById('hotGrid');
        if (!grid || !window.SecondhandAPI) return;

        SecondhandAPI.getHotProducts(10).then(function(hotList) {
            if (hotList.length === 0) {
                grid.parentElement.style.display = 'none';
                return;
            }
            grid.parentElement.style.display = '';
            grid.innerHTML = '';
            hotList.forEach(function(p) {
            var badgeClass = p.tag === 'hot' ? 'hot' : (p.tag === 'new' ? 'new' : 'rec');
            var badgeText = p.tag === 'hot' ? '热门' : (p.tag === 'new' ? '新上架' : '推荐');
            if (p.views >= 200) { badgeClass = 'hot'; badgeText = '热门'; }
            var imgUrl = getProductImage(p);
            var card = document.createElement('div');
            card.className = 'sh-hot-card';
            card.innerHTML = '<div class="sh-hot-card-img"><img src="' + imgUrl + '" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="sh-hot-card-icon-fallback"><i class="' + (categoryIcons[p.category] || 'fas fa-box') + '"></i></div><span class="sh-hot-badge ' + badgeClass + '">' + badgeText + '</span></div><div class="sh-hot-card-body"><h3>' + p.name + '</h3><div class="sh-hot-price">¥' + p.price + '<small>¥' + p.originalPrice + '</small></div><div class="sh-hot-card-meta"><span><i class="fas fa-user"></i> ' + p.seller + '</span><span><i class="fas fa-eye"></i> ' + p.views + '</span><span><i class="fas fa-heart"></i> ' + p.likes + '</span></div></div>';
            card.addEventListener('click', function() { window.location.href = 'detail.html?id=' + p.id; });
            grid.appendChild(card);
        });
        }).catch(function(err) { console.warn('[二手市场] 热门商品加载失败:', err); });
    }

    /* ============================================================
     * 渲染商品列表
     * ============================================================ */
    var categoryNames = {
        'all': '全部商品', '数码': '数码电子', '书籍': '教材书籍',
        '生活用品': '生活用品', '运动': '运动器材', '实训工具': '实训工具',
        '小家电': '小家电', '其他': '其他好物'
    };

    function updateSectionTitle() {
        var titleEl = document.getElementById('sectionTitle');
        var countEl = document.getElementById('sectionCount');
        if (!titleEl) return;
        if (currentSearchKeyword) {
            titleEl.textContent = '搜索结果';
            if (countEl) countEl.textContent = '"' + currentSearchKeyword + '"';
        } else {
            titleEl.textContent = categoryNames[currentCategory] || '全部商品';
            if (countEl) countEl.textContent = '';
        }
    }

    function renderProducts(filteredProducts) {
        var grid = document.getElementById('productsGrid');
        if (!grid) return;
        updateSectionTitle();
        grid.innerHTML = '';
        /* 只展示已审核通过的商品 */
        filteredProducts = filteredProducts.filter(function(p) { return p.reviewStatus === 'approved'; });
        if (filteredProducts.length === 0) {
            var emptyMsg = currentCategory !== 'all' ? (categoryNames[currentCategory] || currentCategory) + '分类暂无在售商品' : '暂无相关商品，更换关键词试试';
            grid.innerHTML = '<div class="sh-empty-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-secondary)"><i class="fas fa-box-open" style="font-size:48px;opacity:0.3;display:block;margin-bottom:15px"></i><p>' + emptyMsg + '</p></div>';
            return;
        }
        filteredProducts.forEach(function(p) {
            var card = document.createElement('div');
            card.className = 'sh-product-card';
            var statusTag = (p.status === '已售出' || p.status === '已售罄') ? '<span class="sh-product-card-sold">' + (p.status === '已售罄' ? '已售罄' : '已售') + '</span>' : '';
            var reviewTag = p.reviewStatus === 'pending' ? '<span class="sh-product-card-review" style="position:absolute;top:8px;right:8px;background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;z-index:2">审核中</span>' : (p.reviewStatus === 'rejected' ? '<span class="sh-product-card-review" style="position:absolute;top:8px;right:8px;background:#ef4444;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;z-index:2">已拒绝</span>' : '');
            var imgUrl = getProductImage(p);
            card.innerHTML = '<div class="sh-product-card-img"><img src="' + imgUrl + '" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="sh-product-card-icon-fallback"><i class="' + (categoryIcons[p.category] || 'fas fa-box') + '"></i></div><span class="sh-product-card-tag">' + p.category + '</span>' + statusTag + reviewTag + '</div><div class="sh-product-card-body"><h3>' + p.name + '</h3><div class="sh-product-card-price">¥' + p.price + '</div><div class="sh-product-card-meta"><span><i class="fas fa-user"></i> ' + p.seller + '</span><span><i class="fas fa-eye"></i> ' + p.views + '</span></div><div class="sh-product-card-actions"><button class="sh-card-chat-btn" data-id="' + p.id + '"><i class="fas fa-comment-dots"></i> 私信</button><button class="sh-card-collect-btn ' + (isCollected(p.id) ? 'collected' : '') + '" data-id="' + p.id + '"><i class="' + (isCollected(p.id) ? 'fas' : 'far') + ' fa-heart"></i></button></div></div>';
            card.addEventListener('click', function(e) {
                if (e.target.closest('.sh-card-chat-btn') || e.target.closest('.sh-card-collect-btn')) return;
                window.location.href = 'detail.html?id=' + p.id;
            });
            grid.appendChild(card);
        });

        /* 私信按钮 */
        grid.querySelectorAll('.sh-card-chat-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var pid = parseInt(this.dataset.id);
                var product = filteredProducts.find(function(p) { return p.id === pid; });
                if (product) openChat(product);
            });
        });

        /* 收藏按钮 */
        grid.querySelectorAll('.sh-card-collect-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                /* 登录校验 */
                var user = getCurrentUser();
                if (!user) {
                    showToast('请先登录后再收藏', 'error');
                    setTimeout(function() { window.location.href = 'login.html'; }, 1200);
                    return;
                }
                var pid = parseInt(this.dataset.id);
                var product = filteredProducts.find(function(p) { return p.id === pid; });
                if (product) {
                    var collected = toggleCollect(product);
                    var icon = this.querySelector('i');
                    if (collected) {
                        this.classList.add('collected');
                        icon.className = 'fas fa-heart';
                        showToast('已收藏');
                    } else {
                        this.classList.remove('collected');
                        icon.className = 'far fa-heart';
                        showToast('已取消收藏');
                    }
                }
            });
        });

        var loadMoreBtn = document.getElementById('loadMore');
        if (loadMoreBtn) loadMoreBtn.style.display = 'none'; // 分页由 API 控制
    }

    /* 通过 API 加载商品列表 */
    var totalProducts = 0;

    function loadProductsFromAPI(page) {
        page = page || 1;
        var grid = document.getElementById('productsGrid');
        if (!grid || !window.SecondhandAPI) return;

        isLoading = true;
        if (page === 1) {
            grid.innerHTML = '<div class="sh-loading-state" style="grid-column:1/-1;text-align:center;padding:60px 20px"><i class="fas fa-spinner fa-spin" style="font-size:32px;color:#3b82f6;display:block;margin-bottom:12px"></i><p style="color:var(--text-secondary)">加载中...</p></div>';
        }

        SecondhandAPI.getProducts({
            category: currentCategory,
            keyword: currentSearchKeyword,
            sort: currentSort,
            page: page,
            pageSize: 8
        }).then(function(result) {
            isLoading = false;
            if (page === 1) {
                products = result.list;
            } else {
                products = products.concat(result.list);
            }
            totalProducts = result.total;
            renderProducts(products);

            var loadMoreBtn = document.getElementById('loadMore');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = (products.length >= totalProducts) ? 'none' : 'inline-flex';
            }

            /* 搜索结果提示 */
            var searchResultBar = document.getElementById('searchResultBar');
            var searchResultText = document.getElementById('searchResultText');
            if (currentSearchKeyword && searchResultBar && searchResultText) {
                searchResultBar.style.display = 'flex';
                searchResultText.textContent = '共匹配 ' + totalProducts + ' 件商品' + (currentCategory !== 'all' ? '（' + (categoryNames[currentCategory] || currentCategory) + '分类内）' : '');
            }

            console.log('[二手市场] 商品列表加载: 第', page, '页, 已加载', products.length, '/', totalProducts);
        }).catch(function(err) {
            isLoading = false;
            console.warn('[二手市场] 商品列表加载失败:', err);
            if (page === 1) {
                grid.innerHTML = '<div class="sh-empty-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-secondary)"><i class="fas fa-exclamation-circle" style="font-size:48px;opacity:0.3;display:block;margin-bottom:15px"></i><p>数据加载失败，请刷新重试</p></div>';
            }
        });
    }

    var currentPage = 1;

    /* ============================================================
     * 渲染教材租用（通过 API）
     * ============================================================ */
    function renderRentalBooks() {
        var grid = document.getElementById('rentalGrid');
        if (!grid || !window.SecondhandAPI) return;

        SecondhandAPI.getRentalBooks().then(function(books) {
            grid.innerHTML = '';
            books.forEach(function(b) {
                if (b.reviewStatus !== 'approved') return;
                var card = document.createElement('div');
                card.className = 'sh-rental-card';
                card.innerHTML = '<div class="sh-rental-card-header"><h3>' + b.name + '</h3><span class="sh-rental-card-tag">' + (b.available ? '可租' : '已租') + '</span></div><div class="sh-rental-card-price">¥' + b.price + '<small>/' + b.period + '</small></div><div class="sh-rental-card-desc">' + b.desc + '</div><div class="sh-rental-card-meta"><span><i class="fas fa-user"></i> ' + b.seller + '</span><span><i class="fas fa-star"></i> ' + b.condition + '</span><span><i class="fas fa-clock"></i> ' + b.period + '</span></div>';
                card.addEventListener('click', function() { window.location.href = 'rental-detail.html?id=' + b.id; });
                grid.appendChild(card);
            });
        }).catch(function(err) { console.warn('[二手市场] 租用列表加载失败:', err); });
    }

    /* 初始化加载 */
    renderHotProducts();
    loadProductsFromAPI(1);
    renderRentalBooks();
    updateStats();

    /* ============================================================
     * 搜索功能增强：模糊检索 + 分类联动 + 搜索建议
     * ============================================================ */
    var searchInput = document.getElementById('searchInput');
    var searchBtn = document.getElementById('searchBtn');
    var searchSuggest = document.getElementById('searchSuggest');
    var searchResultBar = document.getElementById('searchResultBar');
    var searchResultText = document.getElementById('searchResultText');
    var clearSearchBtn = document.getElementById('clearSearchBtn');

    function doSearch(keyword) {
        keyword = (keyword || searchInput.value).trim();
        if (!keyword) {
            showToast('请输入搜索关键词');
            return;
        }
        currentSearchKeyword = keyword;
        currentPage = 1;
        loadProductsFromAPI(1);
        document.querySelector('.sh-products-section').scrollIntoView({ behavior: 'smooth' });
        updateStats();
    }

    function clearSearch() {
        currentSearchKeyword = '';
        searchInput.value = '';
        searchResultBar.style.display = 'none';
        currentPage = 1;
        loadProductsFromAPI(1);
        updateStats();
    }

    if (searchBtn) searchBtn.addEventListener('click', function() { doSearch(); });
    if (searchInput) searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') { doSearch(); return; }
        /* 实时搜索建议（通过 API） */
        var val = this.value.trim().toLowerCase();
        if (!val) { searchSuggest.style.display = 'none'; return; }
        if (!window.SecondhandAPI) return;

        SecondhandAPI.searchSuggest(val).then(function(suggestions) {
            if (suggestions.length === 0) { searchSuggest.style.display = 'none'; return; }
            searchSuggest.innerHTML = suggestions.map(function(s) {
                return '<div class="sh-suggest-item" data-id="' + s.id + '" data-name="' + s.name + '"><i class="fas fa-search"></i><span>' + s.name + '</span><small>' + s.category + '</small></div>';
            }).join('');
            searchSuggest.style.display = 'block';
            searchSuggest.querySelectorAll('.sh-suggest-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    searchInput.value = this.dataset.name;
                    doSearch(this.dataset.name);
                });
            });
        }).catch(function() { searchSuggest.style.display = 'none'; });
    });

    /* 点击外部关闭建议 */
    document.addEventListener('click', function(e) {
        if (searchSuggest && !e.target.closest('.sh-search-box')) {
            searchSuggest.style.display = 'none';
        }
    });

    if (clearSearchBtn) clearSearchBtn.addEventListener('click', clearSearch);

    /* ============================================================
     * 分类标签切换（点击跳转到商品列表区）
     * ============================================================ */
    var filterTags = document.querySelectorAll('.sh-filter-tag');
    filterTags.forEach(function(tag) {
        tag.addEventListener('click', function() {
            filterTags.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            currentCategory = this.dataset.category;
            currentSearchKeyword = '';
            searchInput.value = '';
            searchResultBar.style.display = 'none';
            currentPage = 1;
            loadProductsFromAPI(1);
            updateStats();
            document.querySelector('.sh-products-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    var categoryCards = document.querySelectorAll('.sh-category-card[data-cat]');
    categoryCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var cat = this.dataset.cat;
            currentCategory = cat;
            currentSearchKeyword = '';
            searchInput.value = '';
            searchResultBar.style.display = 'none';
            currentPage = 1;
            filterTags.forEach(function(t) { t.classList.remove('active'); });
            var target = document.querySelector('.sh-filter-tag[data-category="' + cat + '"]');
            if (target) target.classList.add('active');
            loadProductsFromAPI(1);
            updateStats();
            document.querySelector('.sh-products-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ============================================================
     * 排序切换
     * ============================================================ */

    /* 更多热门按钮：跳转到全部热门商品 */
    var hotMoreBtn = document.getElementById('hotMoreBtn');
    if (hotMoreBtn) {
        hotMoreBtn.addEventListener('click', function() {
            currentCategory = 'all';
            currentSearchKeyword = '';
            searchInput.value = '';
            searchResultBar.style.display = 'none';
            filterTags.forEach(function(t) { t.classList.remove('active'); });
            var allTag = document.querySelector('.sh-filter-tag[data-category="all"]');
            if (allTag) allTag.classList.add('active');
            currentSort = 'hot';
            sortBtns.forEach(function(b) { b.classList.remove('active'); });
            var hotSortBtn = document.querySelector('.sh-sort-btn[data-sort="hot"]');
            if (hotSortBtn) hotSortBtn.classList.add('active');
            currentPage = 1;
            loadProductsFromAPI(1);
            updateStats();
            document.querySelector('.sh-products-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    var sortBtns = document.querySelectorAll('.sh-sort-btn');
    sortBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            sortBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            currentSort = this.dataset.sort;
            currentPage = 1;
            loadProductsFromAPI(1);
        });
    });

    /* ============================================================
     * 加载更多（分页）
     * ============================================================ */
    var loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (isLoading) return;
            currentPage++;
            loadProductsFromAPI(currentPage);
        });
    }

    /* ============================================================
     * 私信聊天弹窗系统
     * ============================================================ */
    var chatOverlay = document.getElementById('chatOverlay');
    var chatMessages = document.getElementById('chatMessages');
    var chatInput = document.getElementById('chatInput');
    var chatSendBtn = document.getElementById('chatSendBtn');
    var chatCloseBtn = document.getElementById('chatCloseBtn');

    function openChat(product) {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') {
            showToast('请先登录后再私信卖家');
            setTimeout(function() { window.location.href = 'login.html'; }, 1000);
            return;
        }
        var sellerId = product.sellerStuId || product.seller;
        if (sellerId === user.stuId || sellerId === user.name) {
            showToast('不能给自己发私信');
            return;
        }

        currentChatProduct = product;
        currentChatSellerId = sellerId;

        document.getElementById('chatSellerName').textContent = product.seller;
        document.getElementById('chatSellerDept').textContent = product.sellerDept || '';
        document.getElementById('chatSellerAvatar').textContent = product.seller ? product.seller.charAt(0) : '卖';

        /* 加载历史消息 */
        var sessionKey = getChatSessionKey(product.id, user.stuId || user.name, sellerId);
        var chatData = getChatData();
        var messages = chatData[sessionKey] || [];

        renderChatMessages(messages, user);
        chatOverlay.classList.add('active');

        /* 标记已读 */
        markMessagesRead(sessionKey);
        updateNavBadge();
    }

    function renderChatMessages(messages, user) {
        chatMessages.innerHTML = '';
        if (messages.length === 0) {
            chatMessages.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-secondary);font-size:13px"><i class="fas fa-comments" style="font-size:32px;opacity:0.3;display:block;margin-bottom:10px"></i>暂无聊天记录，发送第一条消息吧</div>';
            return;
        }
        messages.forEach(function(msg) {
            var isMe = msg.sender === (user.stuId || user.name);
            var div = document.createElement('div');
            div.className = 'sh-chat-msg ' + (isMe ? 'sh-chat-msg-right' : 'sh-chat-msg-left');
            div.innerHTML = '<div class="sh-chat-bubble">' + escapeHtml(msg.text) + '</div><div class="sh-chat-msg-time">' + msg.time + '</div>';
            chatMessages.appendChild(div);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function sendChatMessage() {
        var text = chatInput.value.trim();
        if (!text || !currentChatProduct) return;
        var user = getCurrentUser();
        if (!user) return;

        var sessionKey = getChatSessionKey(currentChatProduct.id, user.stuId || user.name, currentChatSellerId);
        var chatData = getChatData();
        if (!chatData[sessionKey]) chatData[sessionKey] = [];

        var now = new Date();
        var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        chatData[sessionKey].push({
            sender: user.stuId || user.name,
            senderName: user.name,
            text: text,
            time: timeStr,
            date: now.toLocaleDateString(),
            productId: currentChatProduct.id,
            productName: currentChatProduct.name,
            sellerName: currentChatProduct.seller,
            unread: true
        });
        saveChatData(chatData);

        chatInput.value = '';
        renderChatMessages(chatData[sessionKey], user);
        updateNavBadge();
    }

    function markMessagesRead(sessionKey) {
        var chatData = getChatData();
        if (chatData[sessionKey]) {
            chatData[sessionKey].forEach(function(msg) { msg.unread = false; });
            saveChatData(chatData);
        }
    }

    function getUnreadCount() {
        var user = getCurrentUser();
        if (!user) return 0;
        var chatData = getChatData();
        var count = 0;
        Object.keys(chatData).forEach(function(key) {
            chatData[key].forEach(function(msg) {
                if (msg.unread && msg.sender !== (user.stuId || user.name)) count++;
            });
        });
        return count;
    }

    function updateNavBadge() {
        var badge = document.getElementById('navMsgBadge');
        if (!badge) return;
        var count = getUnreadCount();
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = '';
        } else {
            badge.style.display = 'none';
        }
    }
    updateNavBadge();

    if (chatCloseBtn) chatCloseBtn.addEventListener('click', function() { chatOverlay.classList.remove('active'); });
    if (chatOverlay) chatOverlay.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });
    if (chatSendBtn) chatSendBtn.addEventListener('click', sendChatMessage);
    if (chatInput) chatInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') sendChatMessage(); });

    /* ============================================================
     * 立即购买弹窗
     * ============================================================ */
    var rentOrderModal = document.getElementById('rentOrderModal');
    var closeRentOrderModal = document.getElementById('closeRentOrderModal');
    var rentOrderForm = document.getElementById('rentOrderForm');

    if (closeRentOrderModal) closeRentOrderModal.addEventListener('click', function() { rentOrderModal.classList.remove('active'); });
    if (rentOrderModal) rentOrderModal.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });

    if (rentOrderForm) {
        rentOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var user = getCurrentUser();
            if (!user) {
                showToast('请先登录后再提交购买订单');
                setTimeout(function() { window.location.href = 'login.html'; }, 1200);
                return;
            }
            var productId = parseInt(document.getElementById('rentOrderProductId').value);
            var building = document.getElementById('rentOrderBuilding').value;
            var note = document.getElementById('rentOrderNote').value;

            var product = products.find(function(p) { return p.id === productId; });
            if (!product) { showToast('商品不存在'); return; }

            var now = new Date();

            var orders = getOrders();
            orders.unshift({
                id: Date.now(),
                productId: productId,
                productName: product.name,
                productImg: getProductImage(product),
                price: product.price,
                totalPrice: product.price,
                building: building,
                note: note,
                seller: product.seller,
                sellerDept: product.sellerDept || '',
                buyer: user.name,
                buyerStuId: user.stuId,
                status: '待确认',
                time: now.toLocaleString()
            });
            saveOrders(orders);
            rentOrderModal.classList.remove('active');
            this.reset();
            showToast('购买订单提交成功！');
        });
    }

    /* 全局函数：打开购买弹窗 */
    window.openRentOrder = function(productId) {
        var user = getCurrentUser();
        if (!user) {
            showToast('请先登录后再购买');
            setTimeout(function() { window.location.href = 'login.html'; }, 1200);
            return;
        }
        document.getElementById('rentOrderProductId').value = productId;
        rentOrderModal.classList.add('active');
    };

    /* ============================================================
     * 发布闲置
     * ============================================================ */
    var publishBtn = document.getElementById('publishBtn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            var user = getCurrentUser();
            if (!user || user.role !== 'student') {
                showToast('请先登录学生账号');
                setTimeout(function() { window.location.href = 'login.html'; }, 1000);
                return;
            }
            window.location.href = 'publish.html';
        });
    }

    /* ============================================================
     * 发布弹窗
     * ============================================================ */
    var publishModal = document.getElementById('publishModal');
    var closePublishModal = document.getElementById('closePublishModal');
    if (publishModal && closePublishModal) {
        closePublishModal.addEventListener('click', function() { publishModal.classList.remove('active'); });
        publishModal.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });
    }

    var publishForm = document.getElementById('publishForm');
    var _publishSubmitting = false;
    if (publishForm) {
        publishForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (_publishSubmitting) return;
            var name = document.getElementById('pubName').value;
            var category = document.getElementById('pubCategory').value;
            var price = document.getElementById('pubPrice').value;
            var condition = document.getElementById('pubCondition').value;
            var desc = document.getElementById('pubDesc').value;
            var location = document.getElementById('pubLocation').value;
            if (!name || !category || !price || !condition || !desc) { showToast('请填写完整商品信息'); return; }
            var user = getCurrentUser();
            _publishSubmitting = true;

            if (window.SecondhandAPI) {
                SecondhandAPI.publishProduct({
                    name: name, category: category, price: parseInt(price), condition: condition,
                    desc: desc, location: location || '校内当面交易',
                    seller: user ? user.name : '我', sellerStuId: user ? user.stuId || '' : '', sellerDept: user ? user.dept || '' : '',
                    sellerPhone: user ? user.phone || '' : ''
                }).then(function(newProduct) {
                    if (publishModal) publishModal.classList.remove('active');
                    publishForm.reset();
                    alert('发布成功，商品已进入审核，审核通过后将展示！');
                    window.location.href = 'secondhand.html';
                }).catch(function(err) {
                    alert('发布失败，请检查网络或稍后再试');
                    _publishSubmitting = false;
                });
            } else {
                /* 降级：直接写入本地 */
                var newProduct = {
                    id: Date.now(), name: name, category: category, price: parseInt(price), originalPrice: parseInt(price) * 2,
                    condition: condition, desc: desc, seller: user ? user.name : '我', sellerStuId: user ? user.stuId || '' : '', sellerDept: user ? user.dept || '' : '',
                    sellerPhone: user ? user.phone || '' : '', views: 0, likes: 0, collects: 0, location: location || '校内当面交易',
                    time: '刚刚', status: '在售', tag: 'new', comments: [], reviewStatus: 'pending'
                };
                products.push(newProduct);
                saveProducts(products);
                if (publishModal) publishModal.classList.remove('active');
                publishForm.reset();
                alert('发布成功，商品已进入审核，审核通过后将展示！');
                window.location.href = 'secondhand.html';
            }
        });
    }

    /* ============================================================
     * 图片上传
     * ============================================================ */
    var uploadArea = document.getElementById('uploadArea');
    var fileInput = document.getElementById('fileInput');
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function() { fileInput.click(); });
        uploadArea.addEventListener('dragover', function(e) { e.preventDefault(); this.style.borderColor = '#3b82f6'; });
        uploadArea.addEventListener('dragleave', function() { this.style.borderColor = ''; });
        uploadArea.addEventListener('drop', function(e) { e.preventDefault(); this.style.borderColor = ''; showToast('图片已上传（模拟）'); });
        fileInput.addEventListener('change', function() { if (this.files.length > 0) showToast('已选择' + this.files.length + '张图片'); });
    }

    /* ============================================================
     * 发布教材租用弹窗
     * ============================================================ */
    var publishRentalBtn = document.getElementById('publishRentalBtn');
    var rentalModal = document.getElementById('rentalModal');
    var closeRentalModal = document.getElementById('closeRentalModal');
    if (publishRentalBtn) {
        publishRentalBtn.addEventListener('click', function() {
            var user = getCurrentUser();
            if (!user || user.role !== 'student') { showToast('请先登录后再发布教材租用'); return; }
            if (rentalModal) rentalModal.classList.add('active');
        });
    }
    if (closeRentalModal) closeRentalModal.addEventListener('click', function() { rentalModal.classList.remove('active'); });
    if (rentalModal) rentalModal.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });

    var rentalForm = document.getElementById('rentalForm');
    if (rentalForm) {
        var rentalIsSubmitting = false;
        rentalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (rentalIsSubmitting) return;
            var user = getCurrentUser();
            if (!user || user.role !== 'student') { showToast('请先登录后再发布'); return; }
            var name = document.getElementById('rentName').value.trim();
            var price = parseFloat(document.getElementById('rentPrice').value);
            var period = document.getElementById('rentPeriod').value;
            var condition = document.getElementById('rentCondition').value;
            var desc = document.getElementById('rentDesc') ? document.getElementById('rentDesc').value.trim() : '';
            if (!name || !price || !period || !condition) { showToast('请填写完整信息'); return; }

            /* 幂等性校验：1分钟内不允许发布同名同价教材 */
            var books = getRentalBooks();
            var now = Date.now();
            var duplicate = books.find(function(b) {
                return b.name === name && b.price === price && b.seller === user.name && (now - b.id) < 60000;
            });
            if (duplicate) { showToast('请勿重复提交，稍后再试'); return; }

            rentalIsSubmitting = true;
            var submitBtn = rentalForm.querySelector('button[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.5'; submitBtn.textContent = '提交中...'; }

            books.unshift({
                id: Date.now(), name: name, price: price, period: period, condition: condition,
                desc: desc || '暂无描述', seller: user.name, sellerDept: user.dept || '',
                sellerStuId: user.stuId || '',
                available: true, reviewStatus: 'pending', views: 0, likes: 0, collects: 0, time: '刚刚'
            });
            saveRentalBooks(books);
            if (rentalModal) rentalModal.classList.remove('active');
            rentalForm.reset();
            renderRentalBooks();
            showToast('教材租用发布成功，已进入审核！');

            setTimeout(function() {
                rentalIsSubmitting = false;
                if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; submitBtn.textContent = '发布'; }
            }, 2000);
        });
    }

    /* ============================================================
     * URL 参数处理
     * ============================================================ */
    var openRentParam = new URLSearchParams(window.location.search).get('openRent');
    if (openRentParam && rentOrderModal) {
        var user = getCurrentUser();
        if (user) {
            document.getElementById('rentOrderProductId').value = openRentParam;
            rentOrderModal.classList.add('active');
        }
    }

    var openRental = new URLSearchParams(window.location.search).get('openRental');
    if (openRental && rentalModal) {
        var user = getCurrentUser();
        if (user && user.role === 'student') rentalModal.classList.add('active');
    }

    var editRentalId = new URLSearchParams(window.location.search).get('editRental');
    if (editRentalId) {
        var books = getRentalBooks();
        var editBook = books.find(function(b) { return b.id === parseInt(editRentalId); });
        if (editBook && rentalModal) {
            rentalModal.classList.add('active');
            var rn = document.getElementById('rentName');
            var rp = document.getElementById('rentPrice');
            var rpe = document.getElementById('rentPeriod');
            var rc = document.getElementById('rentCondition');
            var rd = document.getElementById('rentDesc');
            if (rn) rn.value = editBook.name;
            if (rp) rp.value = editBook.price;
            if (rpe) rpe.value = editBook.period;
            if (rc) rc.value = editBook.condition;
            if (rd) rd.value = editBook.desc;
        }
    }
});
