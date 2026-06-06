document.addEventListener('DOMContentLoaded', function() {
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
        1:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
        2:'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=400&fit=crop',
        3:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
        4:'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=400&fit=crop',
        5:'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop',
        6:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
        7:'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=400&fit=crop',
        8:'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop',
        9:'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=400&fit=crop',
        10:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=400&fit=crop',
        11:'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&h=400&fit=crop',
        12:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop',
        13:'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
        14:'https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=600&h=400&fit=crop',
        15:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
        16:'https://images.unsplash.com/photo-1530124566582-a45a7e3e29f0?w=600&h=400&fit=crop',
        17:'https://images.unsplash.com/photo-1570222094114-d054a816e5e4?w=600&h=400&fit=crop',
        18:'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=400&fit=crop'
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
     * 商品数据
     * ============================================================ */
    var defaultProducts = [
        { id:1,name:'MacBook Pro 14寸 M2',category:'数码',price:8999,originalPrice:14999,condition:'95新',desc:'95新，电池健康98%，带原装充电器，无磕碰划痕。',seller:'小明',sellerDept:'计算机学院',sellerPhone:'138****1234',views:123,likes:45,collects:12,location:'北区宿舍',time:'2小时前',status:'在售',tag:'hot',comments:[],reviewStatus:'approved' },
        { id:2,name:'AirPods Pro 2代',category:'数码',price:1299,originalPrice:1899,condition:'99新',desc:'几乎全新，购买三个月，带发票和原装盒，降噪效果出色。',seller:'小李',sellerDept:'电子信息学院',sellerPhone:'139****5678',views:234,likes:67,collects:23,location:'南区宿舍',time:'3小时前',status:'在售',tag:'new',comments:[] },
        { id:3,name:'考研英语真题全套',category:'书籍',price:50,originalPrice:120,condition:'8成新',desc:'2024年考研英语真题，有少量笔记标注，含答案解析。',seller:'学姐',sellerDept:'外国语学院',sellerPhone:'137****9012',views:89,likes:23,collects:8,location:'图书馆门口',time:'5小时前',status:'在售',tag:'',comments:[] },
        { id:4,name:'小米台灯Pro',category:'小家电',price:60,originalPrice:169,condition:'9成新',desc:'护眼台灯，可调节亮度和色温，功能完好。',seller:'毕业生',sellerDept:'经济管理学院',sellerPhone:'136****3456',views:156,likes:34,collects:15,location:'东区宿舍',time:'1天前',status:'在售',tag:'',comments:[] },
        { id:5,name:'羽毛球拍套装',category:'运动',price:180,originalPrice:350,condition:'9成新',desc:'尤尼克斯羽毛球拍，送球和球包，使用半年。',seller:'运动达人',sellerDept:'体育学院',sellerPhone:'135****7890',views:67,likes:12,collects:5,location:'体育馆',time:'1天前',status:'在售',tag:'rec',comments:[] },
        { id:6,name:'高等数学教材上下册',category:'书籍',price:30,originalPrice:68,condition:'9成新',desc:'同济大学第七版，无笔记，保存完好。',seller:'学长',sellerDept:'数学与统计学院',sellerPhone:'134****2345',views:45,likes:8,collects:3,location:'教学楼',time:'2天前',status:'在售',tag:'',comments:[] },
        { id:7,name:'机械键盘RGB青轴',category:'数码',price:399,originalPrice:699,condition:'95新',desc:'青轴，全键无冲，支持自定义灯效，带手托。',seller:'游戏玩家',sellerDept:'计算机学院',sellerPhone:'133****6789',views:189,likes:56,collects:20,location:'西区宿舍',time:'2天前',status:'在售',tag:'hot',comments:[] },
        { id:8,name:'山地自行车21速',category:'运动',price:680,originalPrice:1500,condition:'8成新',desc:'21速碟刹，适合校园通勤，已保养。',seller:'大四学长',sellerDept:'机械工程学院',sellerPhone:'132****0123',views:389,likes:89,collects:35,location:'校门口',time:'3天前',status:'在售',tag:'new',comments:[] },
        { id:9,name:'iPhone 14 Pro 256G',category:'数码',price:5999,originalPrice:8999,condition:'99新',desc:'256GB深空黑，国行正品，电池100%。',seller:'换新机',sellerDept:'艺术设计学院',sellerPhone:'131****4567',views:567,likes:234,collects:89,location:'北区宿舍',time:'3天前',status:'在售',tag:'hot',comments:[] },
        { id:10,name:'膳魔师保温杯500ml',category:'生活用品',price:45,originalPrice:199,condition:'9成新',desc:'膳魔师保温杯，500ml，保温效果好。',seller:'闲置转让',sellerDept:'法学院',sellerPhone:'130****8901',views:78,likes:15,collects:6,location:'食堂门口',time:'4天前',status:'在售',tag:'',comments:[] },
        { id:11,name:'斯伯丁篮球',category:'运动',price:120,originalPrice:259,condition:'8成新',desc:'室外用球，手感好，适合日常运动。',seller:'体育生',sellerDept:'体育学院',sellerPhone:'129****2345',views:234,likes:45,collects:18,location:'操场',time:'4天前',status:'在售',tag:'',comments:[] },
        { id:12,name:'C语言程序设计谭浩强',category:'书籍',price:25,originalPrice:49,condition:'9成新',desc:'经典教材，无笔记，适合计算机专业入门。',seller:'计算机系',sellerDept:'计算机学院',sellerPhone:'128****6789',views:112,likes:28,collects:10,location:'教学楼',time:'5天前',status:'在售',tag:'',comments:[] },
        { id:13,name:'电烙铁焊接套装',category:'实训工具',price:35,originalPrice:89,condition:'9成新',desc:'含焊锡丝、吸锡器等配件，适合电子实训。',seller:'电子系学长',sellerDept:'电子信息学院',sellerPhone:'127****0123',views:56,likes:12,collects:4,location:'实训楼',time:'5天前',status:'在售',tag:'',comments:[] },
        { id:14,name:'戴森吹风机',category:'小家电',price:899,originalPrice:3190,condition:'95新',desc:'国行正品，带原装配件，使用半年。',seller:'学姐',sellerDept:'文学与传媒学院',sellerPhone:'126****4567',views:345,likes:89,collects:45,location:'南区宿舍',time:'6天前',status:'在售',tag:'rec',comments:[] },
        { id:15,name:'床上书桌折叠款',category:'生活用品',price:40,originalPrice:99,condition:'8成新',desc:'折叠床上书桌，可调节角度，毕业转让。',seller:'毕业生',sellerDept:'经济管理学院',sellerPhone:'125****8901',views:98,likes:23,collects:9,location:'北区宿舍',time:'6天前',status:'在售',tag:'',comments:[] },
        { id:16,name:'万用表数字式',category:'实训工具',price:55,originalPrice:128,condition:'9成新',desc:'优利德数字万用表，功能完好。',seller:'电气系',sellerDept:'电子信息学院',sellerPhone:'124****2345',views:67,likes:15,collects:5,location:'实训楼',time:'1周前',status:'在售',tag:'',comments:[] },
        { id:17,name:'小米电风扇',category:'小家电',price:50,originalPrice:149,condition:'9成新',desc:'直流变频，静音运行，4档风力可调。',seller:'毕业转让',sellerDept:'数学与统计学院',sellerPhone:'123****6789',views:134,likes:34,collects:14,location:'东区宿舍',time:'1周前',status:'在售',tag:'',comments:[] },
        { id:18,name:'瑜伽垫加厚款',category:'运动',price:35,originalPrice:89,condition:'9成新',desc:'加厚10mm，防滑，带收纳袋。',seller:'健身达人',sellerDept:'体育学院',sellerPhone:'122****0123',views:45,likes:8,collects:3,location:'体育馆',time:'1周前',status:'在售',tag:'',comments:[] }
    ];

    function getProducts() {
        if (window.CampusDB) return CampusDB.getSecondhand();
        try {
            var stored = JSON.parse(localStorage.getItem('campus_secondhand') || '[]');
            if (stored.length === 0) {
                localStorage.setItem('campus_secondhand', JSON.stringify(defaultProducts));
                return defaultProducts;
            }
            return stored;
        } catch(e) {
            return defaultProducts.map(function(p) { p.reviewStatus = 'approved'; return p; });
        }
    }

    function saveProducts(list) {
        if (window.CampusDB) CampusDB.saveSecondhand(list);
        else localStorage.setItem('campus_secondhand', JSON.stringify(list));
    }

    var products = getProducts();

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
            var stored = JSON.parse(localStorage.getItem('campus_rental_books') || '[]');
            if (stored.length === 0) { localStorage.setItem('campus_rental_books', JSON.stringify(rentalBooks)); return rentalBooks; }
            return stored;
        } catch(e) { return rentalBooks; }
    }

    function saveRentalBooks(list) {
        if (window.CampusDB) CampusDB.saveRentalBooks(list);
        else localStorage.setItem('campus_rental_books', JSON.stringify(list));
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
    var displayedCount = 8;
    var currentChatProduct = null;
    var currentChatSellerId = null;

    /* ============================================================
     * 统计数字动画 & 动态更新
     * ============================================================ */
    function updateStats() {
        var onSale = products.filter(function(p) { return p.status !== '已下架' && p.reviewStatus !== 'rejected'; });
        var filtered = onSale;
        if (currentCategory !== 'all') {
            filtered = onSale.filter(function(p) { return p.category === currentCategory; });
        }
        var onSaleCount = filtered.length;
        var totalOnSale = onSale.length;
        var successTrades = Math.round(totalOnSale * 0.53);
        var activeUsers = Math.round(totalOnSale * 0.34);

        var statNums = document.querySelectorAll('.sh-stat-num');
        if (statNums.length >= 3) {
            statNums[0].textContent = onSaleCount;
            statNums[0].dataset.target = onSaleCount;
            statNums[1].textContent = successTrades;
            statNums[2].textContent = activeUsers;
        }

        /* 更新分类卡片在售数量 */
        var cats = ['数码','书籍','生活用品','运动','实训工具','小家电','其他'];
        var catCounts = {};
        cats.forEach(function(c) { catCounts[c] = onSale.filter(function(p) { return p.category === c; }).length; });
        document.querySelectorAll('.sh-category-card[data-cat]').forEach(function(card) {
            var cat = card.dataset.cat;
            var small = card.querySelector('small');
            if (small && catCounts[cat] !== undefined) {
                small.textContent = catCounts[cat] + '件在售';
            }
        });
    }

    function animateStats() {
        document.querySelectorAll('.sh-stat-num').forEach(function(el) {
            var target = parseInt(el.dataset.target);
            var current = 0;
            var step = Math.ceil(target / 60);
            var timer = setInterval(function() {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current.toLocaleString();
            }, 30);
        });
    }
    animateStats();

    /* ============================================================
     * 渲染热门好物（按浏览量排序，横向滚动）
     * ============================================================ */
    function renderHotProducts() {
        var grid = document.getElementById('hotGrid');
        if (!grid) return;
        var onSale = products.filter(function(p) { return p.status !== '已下架' && p.reviewStatus !== 'rejected'; });
        /* 按浏览量降序取前10 */
        var hotList = onSale.slice().sort(function(a, b) { return (b.views + b.likes) - (a.views + a.likes); }).slice(0, 10);
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
        var toDisplay = filteredProducts.slice(0, displayedCount);
        grid.innerHTML = '';
        if (toDisplay.length === 0) {
            var emptyMsg = currentCategory !== 'all' ? (categoryNames[currentCategory] || currentCategory) + '分类暂无在售商品' : '暂无相关商品，更换关键词试试';
            grid.innerHTML = '<div class="sh-empty-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-secondary)"><i class="fas fa-box-open" style="font-size:48px;opacity:0.3;display:block;margin-bottom:15px"></i><p>' + emptyMsg + '</p></div>';
            return;
        }
        toDisplay.forEach(function(p) {
            var card = document.createElement('div');
            card.className = 'sh-product-card';
            var statusTag = p.status === '已售出' ? '<span class="sh-product-card-sold">已售</span>' : '';
            var imgUrl = getProductImage(p);
            card.innerHTML = '<div class="sh-product-card-img"><img src="' + imgUrl + '" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="sh-product-card-icon-fallback"><i class="' + (categoryIcons[p.category] || 'fas fa-box') + '"></i></div><span class="sh-product-card-tag">' + p.category + '</span>' + statusTag + '</div><div class="sh-product-card-body"><h3>' + p.name + '</h3><div class="sh-product-card-price">¥' + p.price + '</div><div class="sh-product-card-meta"><span><i class="fas fa-user"></i> ' + p.seller + '</span><span><i class="fas fa-eye"></i> ' + p.views + '</span></div><div class="sh-product-card-actions"><button class="sh-card-chat-btn" data-id="' + p.id + '"><i class="fas fa-comment-dots"></i> 私信</button><button class="sh-card-collect-btn ' + (isCollected(p.id) ? 'collected' : '') + '" data-id="' + p.id + '"><i class="' + (isCollected(p.id) ? 'fas' : 'far') + ' fa-heart"></i></button></div></div>';
            /* 点击卡片跳转详情（排除按钮区域） */
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
                var product = products.find(function(p) { return p.id === pid; });
                if (product) openChat(product);
            });
        });

        /* 收藏按钮 */
        grid.querySelectorAll('.sh-card-collect-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var pid = parseInt(this.dataset.id);
                var product = products.find(function(p) { return p.id === pid; });
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
        if (loadMoreBtn) loadMoreBtn.style.display = displayedCount >= filteredProducts.length ? 'none' : 'inline-flex';
    }

    function getFilteredProducts() {
        var filtered = products.filter(function(p) { return p.status !== '已下架' && p.reviewStatus !== 'rejected'; });
        if (currentCategory !== 'all') {
            filtered = filtered.filter(function(p) { return p.category === currentCategory; });
        }
        if (currentSearchKeyword) {
            var kw = currentSearchKeyword.toLowerCase();
            filtered = filtered.filter(function(p) {
                return p.name.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw);
            });
        }
        switch (currentSort) {
            case 'price-asc': filtered.sort(function(a, b) { return a.price - b.price; }); break;
            case 'price-desc': filtered.sort(function(a, b) { return b.price - a.price; }); break;
            case 'hot': filtered.sort(function(a, b) { return (b.views + b.likes) - (a.views + a.likes); }); break;
            default: filtered.sort(function(a, b) { return b.id - a.id; });
        }
        return filtered;
    }

    /* ============================================================
     * 渲染教材租用
     * ============================================================ */
    function renderRentalBooks() {
        var grid = document.getElementById('rentalGrid');
        if (!grid) return;
        var books = getRentalBooks();
        grid.innerHTML = '';
        books.forEach(function(b) {
            if (b.reviewStatus === 'rejected') return;
            var card = document.createElement('div');
            card.className = 'sh-rental-card';
            card.innerHTML = '<div class="sh-rental-card-header"><h3>' + b.name + '</h3><span class="sh-rental-card-tag">' + (b.available ? '可租' : '已租') + '</span></div><div class="sh-rental-card-price">¥' + b.price + '<small>/' + b.period + '</small></div><div class="sh-rental-card-desc">' + b.desc + '</div><div class="sh-rental-card-meta"><span><i class="fas fa-user"></i> ' + b.seller + '</span><span><i class="fas fa-star"></i> ' + b.condition + '</span><span><i class="fas fa-clock"></i> ' + b.period + '</span></div>';
            card.addEventListener('click', function() { window.location.href = 'rental-detail.html?id=' + b.id; });
            grid.appendChild(card);
        });
    }

    renderHotProducts();
    renderProducts(getFilteredProducts());
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
        displayedCount = 100;
        var filtered = getFilteredProducts();
        renderProducts(filtered);
        searchResultBar.style.display = 'flex';
        searchResultText.textContent = '共匹配 ' + filtered.length + ' 件商品' + (currentCategory !== 'all' ? '（' + (categoryNames[currentCategory] || currentCategory) + '分类内）' : '');
        searchSuggest.style.display = 'none';
        document.querySelector('.sh-products-section').scrollIntoView({ behavior: 'smooth' });
        updateStats();
    }

    function clearSearch() {
        currentSearchKeyword = '';
        searchInput.value = '';
        searchResultBar.style.display = 'none';
        displayedCount = 8;
        renderProducts(getFilteredProducts());
        updateStats();
    }

    if (searchBtn) searchBtn.addEventListener('click', function() { doSearch(); });
    if (searchInput) searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') { doSearch(); return; }
        /* 实时搜索建议 */
        var val = this.value.trim().toLowerCase();
        if (!val) { searchSuggest.style.display = 'none'; return; }
        var suggestions = [];
        products.forEach(function(p) {
            if (p.status === '已下架') return;
            if (p.name.toLowerCase().includes(val) || p.category.toLowerCase().includes(val) || p.desc.toLowerCase().includes(val)) {
                if (suggestions.length < 8) suggestions.push({ name: p.name, category: p.category, id: p.id });
            }
        });
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
            displayedCount = 8;
            renderProducts(getFilteredProducts());
            updateStats();
            /* 跳转到商品列表区 */
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
            displayedCount = 8;
            filterTags.forEach(function(t) { t.classList.remove('active'); });
            var target = document.querySelector('.sh-filter-tag[data-category="' + cat + '"]');
            if (target) target.classList.add('active');
            renderProducts(getFilteredProducts());
            updateStats();
            /* 跳转到商品列表区 */
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
            /* 切换排序为最热门 */
            currentSort = 'hot';
            sortBtns.forEach(function(b) { b.classList.remove('active'); });
            var hotSortBtn = document.querySelector('.sh-sort-btn[data-sort="hot"]');
            if (hotSortBtn) hotSortBtn.classList.add('active');
            displayedCount = 100;
            renderProducts(getFilteredProducts());
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
            renderProducts(getFilteredProducts());
        });
    });

    /* ============================================================
     * 加载更多
     * ============================================================ */
    var loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            displayedCount += 6;
            renderProducts(getFilteredProducts());
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
     * 一键租用弹窗
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
            if (!user || user.role !== 'student') {
                showToast('请先登录后再提交租用订单');
                return;
            }
            var productId = parseInt(document.getElementById('rentOrderProductId').value);
            var days = document.getElementById('rentOrderDays').value;
            var building = document.getElementById('rentOrderBuilding').value;
            var note = document.getElementById('rentOrderNote').value;

            var product = products.find(function(p) { return p.id === productId; });
            if (!product) { showToast('商品不存在'); return; }

            var orders = getOrders();
            orders.unshift({
                id: Date.now(),
                productId: productId,
                productName: product.name,
                productImg: getProductImage(product),
                price: product.price,
                days: days,
                building: building,
                note: note,
                seller: product.seller,
                sellerDept: product.sellerDept || '',
                buyer: user.name,
                buyerStuId: user.stuId,
                status: '待配送',
                time: new Date().toLocaleString()
            });
            saveOrders(orders);
            rentOrderModal.classList.remove('active');
            this.reset();
            showToast('租用订单提交成功！');
        });
    }

    /* 全局函数：打开租用弹窗 */
    window.openRentOrder = function(productId) {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') {
            showToast('请先登录后再租用');
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
    if (publishForm) {
        publishForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('pubName').value;
            var category = document.getElementById('pubCategory').value;
            var price = document.getElementById('pubPrice').value;
            var condition = document.getElementById('pubCondition').value;
            var desc = document.getElementById('pubDesc').value;
            var location = document.getElementById('pubLocation').value;
            if (!name || !category || !price || !condition || !desc) { showToast('请填写完整商品信息'); return; }
            var user = getCurrentUser();
            var newProduct = {
                id: Date.now(), name: name, category: category, price: parseInt(price), originalPrice: parseInt(price) * 2,
                condition: condition, desc: desc, seller: user ? user.name : '我', sellerDept: user ? user.dept || '' : '',
                sellerPhone: user ? user.phone || '' : '', views: 0, likes: 0, collects: 0, location: location || '校内当面交易',
                time: '刚刚', status: '在售', tag: 'new', comments: [], reviewStatus: 'pending'
            };
            products.push(newProduct);
            saveProducts(products);
            this.reset();
            if (publishModal) publishModal.classList.remove('active');
            renderProducts(getFilteredProducts());
            renderHotProducts();
            updateStats();
            showToast('商品发布成功，等待审核');
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
        rentalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var user = getCurrentUser();
            if (!user || user.role !== 'student') { showToast('请先登录后再发布'); return; }
            var name = document.getElementById('rentName').value.trim();
            var price = parseFloat(document.getElementById('rentPrice').value);
            var period = document.getElementById('rentPeriod').value;
            var condition = document.getElementById('rentCondition').value;
            var desc = document.getElementById('rentDesc') ? document.getElementById('rentDesc').value.trim() : '';
            if (!name || !price || !period || !condition) { showToast('请填写完整信息'); return; }
            var books = getRentalBooks();
            books.unshift({
                id: Date.now(), name: name, price: price, period: period, condition: condition,
                desc: desc || '暂无描述', seller: user.name, sellerDept: user.dept || '',
                available: true, reviewStatus: 'pending', views: 0, likes: 0, collects: 0, time: '刚刚'
            });
            saveRentalBooks(books);
            if (rentalModal) rentalModal.classList.remove('active');
            renderRentalBooks();
            showToast('教材租用发布成功，等待审核');
        });
    }

    /* ============================================================
     * URL 参数处理
     * ============================================================ */
    var openRentParam = new URLSearchParams(window.location.search).get('openRent');
    if (openRentParam && rentOrderModal) {
        var user = getCurrentUser();
        if (user && user.role === 'student') {
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
