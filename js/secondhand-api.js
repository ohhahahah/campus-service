/**
 * 二手市场模拟 API 层
 * 所有前后端数据交互都经过此模块，方便后续对接真实后端
 */
(function(window) {
    'use strict';

    /* ============================================================
     * 数据存储层
     * ============================================================ */
    var STORAGE_KEY = 'campus_secondhand_v2';
    var DATA_VERSION_KEY = 'campus_secondhand_data_version';
    var DATA_VERSION = 3; /* 版本号：修改商品数据时递增，强制刷新 */
    var RENTAL_KEY = 'campus_rental_books_v2';
    var ORDER_KEY = 'campus_trade_orders';

    function _get(key, def) {
        try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
        catch(e) { return def; }
    }
    function _set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { console.warn('[API] 存储写入失败', e); }
    }

    /* ============================================================
     * 完整商品数据（30条，含在售/已售出，覆盖全分类）
     * ============================================================ */
    var fullProducts = [
        // ---- 数码 ----
        { id:1, name:'宿舍床上小书桌（适合追剧/上网课）', category:'生活用品', price:29, originalPrice:59, condition:'8成新', desc:'折叠床上小书桌，可调节角度，追剧上网课神器，稳固不晃，宿舍必备好物。', seller:'大一新生', sellerDept:'计算机学院', sellerPhone:'138****5678', sellerAvatar:'https://i.pravatar.cc/80?img=11', views:348, likes:89, collects:32, location:'东区宿舍', time:'2026-06-10 08:30', status:'在售', tag:'hot', comments:[], reviewStatus:'approved' },
        { id:2, name:'蓝牙音箱迷你款', category:'数码', price:39, originalPrice:99, condition:'9成新', desc:'迷你蓝牙音箱，小巧便携，音质不错，宿舍听歌看剧都好用。', seller:'小李', sellerDept:'电子信息学院', sellerPhone:'139****5678', sellerAvatar:'https://i.pravatar.cc/80?img=12', views:156, likes:45, collects:19, location:'南区宿舍', time:'2026-06-10 10:15', status:'在售', tag:'new', comments:[], reviewStatus:'approved' },
        { id:3, name:'64G U盘两个装', category:'数码', price:25, originalPrice:60, condition:'全新', desc:'全新金士顿64G U盘两个，USB3.0接口，存课件资料必备，毕业清仓。', seller:'考研党', sellerDept:'文学与传媒学院', sellerPhone:'137****1234', sellerAvatar:'https://i.pravatar.cc/80?img=13', views:189, likes:52, collects:21, location:'南区宿舍', time:'2026-06-09 14:20', status:'在售', tag:'rec', comments:[], reviewStatus:'approved' },
        { id:4, name:'手机支架桌面款', category:'数码', price:15, originalPrice:39, condition:'9成新', desc:'铝合金手机支架，可调角度，桌面追剧视频通话神器。', seller:'音乐人', sellerDept:'艺术设计学院', sellerPhone:'135****9012', sellerAvatar:'https://i.pravatar.cc/80?img=14', views:198, likes:56, collects:23, location:'北区宿舍', time:'2026-06-09 16:00', status:'在售', tag:'new', comments:[], reviewStatus:'approved' },
        { id:5, name:'大学物理+高数教材带笔记', category:'书籍', price:15, originalPrice:45, condition:'有笔记', desc:'大学物理上下册+高等数学同济版，含课堂重点笔记和习题解答，理工科必备。', seller:'已上岸', sellerDept:'数学与统计学院', sellerPhone:'131****4567', sellerAvatar:'https://i.pravatar.cc/80?img=15', views:313, likes:89, collects:36, location:'北区宿舍', time:'2026-06-08 09:00', status:'在售', tag:'hot', comments:[], reviewStatus:'approved' },
        { id:6, name:'罗技G502有线鼠标', category:'数码', price:199, originalPrice:399, condition:'9成新', desc:'罗技G502游戏鼠标，11个可编程按键，配重可调，使用半年。', seller:'电竞选手', sellerDept:'计算机学院', sellerPhone:'138****9900', sellerAvatar:'https://i.pravatar.cc/80?img=16', views:78, likes:22, collects:9, location:'西区宿舍', time:'2026-06-10 07:45', status:'在售', tag:'new', comments:[], reviewStatus:'approved' },
        { id:7, name:'鼠标垫超大号', category:'数码', price:19, originalPrice:49, condition:'9成新', desc:'900x400mm超大鼠标垫，桌面全覆盖，防滑底面，游戏办公都好用。', seller:'游戏玩家', sellerDept:'计算机学院', sellerPhone:'133****6789', sellerAvatar:'https://i.pravatar.cc/80?img=17', views:189, likes:56, collects:20, location:'西区宿舍', time:'2026-06-07 20:30', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:8, name:'小米充电宝20000mAh', category:'数码', price:59, originalPrice:129, condition:'9成新', desc:'小米移动电源2，20000mAh大容量，双USB输出，可充手机3-4次。', seller:'毕业清仓', sellerDept:'物理与电子学院', sellerPhone:'136****1100', sellerAvatar:'https://i.pravatar.cc/80?img=18', views:92, likes:18, collects:7, location:'东区宿舍', time:'2026-06-10 11:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:9, name:'U盘128G 金士顿', category:'数码', price:35, originalPrice:79, condition:'全新', desc:'全新未拆封，金士顿DT100G3 128GB USB3.0，存课件资料必备。', seller:'数码达人', sellerDept:'计算机学院', sellerPhone:'135****2200', sellerAvatar:'https://i.pravatar.cc/80?img=19', views:45, likes:10, collects:4, location:'教学楼', time:'2026-06-10 09:30', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:10, name:'平板支架铝合金', category:'数码', price:25, originalPrice:69, condition:'9成新', desc:'铝合金折叠支架，适配iPad/平板，可调角度，桌面追剧神器。', seller:'追剧党', sellerDept:'外国语学院', sellerPhone:'134****3300', sellerAvatar:'https://i.pravatar.cc/80?img=20', views:63, likes:14, collects:5, location:'南区宿舍', time:'2026-06-09 18:00', status:'已售出', tag:'', comments:[], reviewStatus:'approved' },

        // ---- 书籍 ----
        { id:11, name:'考研英语真题全套', category:'书籍', price:50, originalPrice:200, condition:'有笔记', desc:'考研英语全套复习资料，含真题、模拟题、词汇书。已上岸，资料上有重点标注和笔记。', seller:'已上岸', sellerDept:'外国语学院', sellerPhone:'136****5678', sellerAvatar:'https://i.pravatar.cc/80?img=21', views:312, likes:89, collects:45, location:'图书馆', time:'2026-06-10 06:00', status:'在售', tag:'hot', comments:[], reviewStatus:'approved' },
        { id:12, name:'高等数学教材上下册', category:'书籍', price:30, originalPrice:68, condition:'9成新', desc:'同济大学第七版，无笔记，保存完好，理工科必备。', seller:'学长', sellerDept:'数学与统计学院', sellerPhone:'134****2345', sellerAvatar:'https://i.pravatar.cc/80?img=22', views:45, likes:8, collects:3, location:'教学楼', time:'2026-06-08 12:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:13, name:'C语言程序设计谭浩强', category:'书籍', price:25, originalPrice:49, condition:'9成新', desc:'经典教材，无笔记，适合计算机专业入门学习。', seller:'计算机系', sellerDept:'计算机学院', sellerPhone:'128****6789', sellerAvatar:'https://i.pravatar.cc/80?img=23', views:112, likes:28, collects:10, location:'教学楼', time:'2026-06-07 09:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:14, name:'大学英语四级真题+词汇', category:'书籍', price:20, originalPrice:80, condition:'有笔记', desc:'近五年四级真题，含听力光盘和词汇手册，已过级转让。重点词汇已标注。', seller:'过级达人', sellerDept:'外国语学院', sellerPhone:'137****8800', sellerAvatar:'https://i.pravatar.cc/80?img=24', views:178, likes:42, collects:18, location:'南区宿舍', time:'2026-06-09 10:00', status:'在售', tag:'rec', comments:[], reviewStatus:'approved' },
        { id:15, name:'数据结构教材（C语言版）', category:'书籍', price:28, originalPrice:55, condition:'8成新', desc:'严蔚敏版数据结构，含课堂笔记和习题答案，期末复习利器。', seller:'软工学长', sellerDept:'计算机学院', sellerPhone:'136****4400', sellerAvatar:'https://i.pravatar.cc/80?img=25', views:95, likes:25, collects:11, location:'教学楼', time:'2026-06-06 15:00', status:'已售出', tag:'', comments:[], reviewStatus:'approved' },
        { id:16, name:'考研政治全套资料', category:'书籍', price:35, originalPrice:150, condition:'有笔记', desc:'肖秀荣全套+徐涛核心考案，2026考研用，已上岸。重点已划线。', seller:'考研上岸', sellerDept:'法学院', sellerPhone:'135****5500', sellerAvatar:'https://i.pravatar.cc/80?img=26', views:256, likes:78, collects:35, location:'北区宿舍', time:'2026-06-10 05:00', status:'在售', tag:'hot', comments:[], reviewStatus:'approved' },

        // ---- 生活用品 ----
        { id:17, name:'小米台灯Pro', category:'生活用品', price:60, originalPrice:179, condition:'9成新', desc:'小米智能台灯Pro，支持小爱同学控制，色温亮度可调，护眼模式。', seller:'小米粉', sellerDept:'物理与电子学院', sellerPhone:'134****3456', sellerAvatar:'https://i.pravatar.cc/80?img=27', views:89, likes:23, collects:8, location:'西区宿舍', time:'2026-06-09 08:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:18, name:'膳魔师保温杯500ml', category:'生活用品', price:45, originalPrice:199, condition:'9成新', desc:'膳魔师保温杯，500ml，保温效果好，无异味。', seller:'闲置转让', sellerDept:'法学院', sellerPhone:'130****8901', sellerAvatar:'https://i.pravatar.cc/80?img=28', views:78, likes:15, collects:6, location:'食堂门口', time:'2026-06-07 11:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:19, name:'宿舍收纳箱3件套', category:'生活用品', price:35, originalPrice:89, condition:'8成新', desc:'三个不同尺寸收纳箱，可叠放，毕业清仓。', seller:'毕业生', sellerDept:'经济管理学院', sellerPhone:'129****6600', sellerAvatar:'https://i.pravatar.cc/80?img=29', views:67, likes:12, collects:5, location:'北区宿舍', time:'2026-06-08 16:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:20, name:'宿舍遮光床帘', category:'生活用品', price:35, originalPrice:79, condition:'9成新', desc:'遮光床帘，1.2m床铺适用，防尘遮光，宿舍隐私好物。', seller:'毕业生', sellerDept:'经济管理学院', sellerPhone:'125****8901', sellerAvatar:'https://i.pravatar.cc/80?img=30', views:98, likes:23, collects:9, location:'北区宿舍', time:'2026-06-06 14:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:21, name:'暖壶热水瓶2L', category:'生活用品', price:15, originalPrice:39, condition:'9成新', desc:'不锈钢内胆暖壶，2L容量，保温24小时，宿舍必备。', seller:'生活达人', sellerDept:'化学学院', sellerPhone:'128****7700', sellerAvatar:'https://i.pravatar.cc/80?img=31', views:34, likes:6, collects:2, location:'东区宿舍', time:'2026-06-10 12:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },

        // ---- 运动器材 ----
        { id:22, name:'羽毛球拍套装', category:'运动', price:180, originalPrice:350, condition:'9成新', desc:'尤尼克斯羽毛球拍，送球和球包，使用半年。', seller:'运动达人', sellerDept:'体育学院', sellerPhone:'135****7890', sellerAvatar:'https://i.pravatar.cc/80?img=32', views:67, likes:12, collects:5, location:'体育馆', time:'2026-06-09 07:00', status:'在售', tag:'rec', comments:[], reviewStatus:'approved' },
        { id:23, name:'斯伯丁篮球', category:'运动', price:120, originalPrice:259, condition:'8成新', desc:'室外用球，手感好，适合日常运动，气嘴无漏气。', seller:'体育生', sellerDept:'体育学院', sellerPhone:'129****2345', sellerAvatar:'https://i.pravatar.cc/80?img=33', views:234, likes:45, collects:18, location:'操场', time:'2026-06-07 18:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:24, name:'瑜伽垫加厚款', category:'运动', price:35, originalPrice:89, condition:'9成新', desc:'加厚10mm，防滑，带收纳袋，适合健身瑜伽。', seller:'健身达人', sellerDept:'体育学院', sellerPhone:'122****0123', sellerAvatar:'https://i.pravatar.cc/80?img=34', views:45, likes:8, collects:3, location:'体育馆', time:'2026-06-06 10:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:25, name:'跳绳计数款', category:'运动', price:15, originalPrice:35, condition:'9成新', desc:'钢丝绳芯，计数手柄，适合日常锻炼和体测。', seller:'健身族', sellerDept:'体育学院', sellerPhone:'121****8800', sellerAvatar:'https://i.pravatar.cc/80?img=35', views:28, likes:5, collects:2, location:'操场', time:'2026-06-10 13:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:26, name:'有线耳机（适用于电脑/手机）', category:'数码', price:39, originalPrice:129, condition:'9成新', desc:'3.5mm接口有线耳机，音质清晰，带麦克风，适用于电脑网课和手机听歌，线材柔软不易缠绕。', seller:'追剧党', sellerDept:'外国语学院', sellerPhone:'132****0123', sellerAvatar:'https://i.pravatar.cc/80?img=36', views:247, likes:67, collects:22, location:'南区宿舍', time:'2026-06-05 09:00', status:'在售', tag:'hot', comments:[], reviewStatus:'approved' },

        // ---- 实训工具 ----
        { id:27, name:'电烙铁焊接套装', category:'实训工具', price:35, originalPrice:89, condition:'9成新', desc:'含焊锡丝、吸锡器等配件，适合电子实训使用。', seller:'电子系学长', sellerDept:'电子信息学院', sellerPhone:'127****0123', sellerAvatar:'https://i.pravatar.cc/80?img=37', views:56, likes:12, collects:4, location:'实训楼', time:'2026-06-06 08:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:28, name:'万用表数字式', category:'实训工具', price:55, originalPrice:128, condition:'9成新', desc:'优利德数字万用表，功能完好，适合电工实训。', seller:'电气系', sellerDept:'电子信息学院', sellerPhone:'124****2345', sellerAvatar:'https://i.pravatar.cc/80?img=38', views:67, likes:15, collects:5, location:'实训楼', time:'2026-06-05 14:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },

        // ---- 小家电 ----
        { id:29, name:'宿舍静音小风扇', category:'小家电', price:25, originalPrice:49, condition:'9成新', desc:'USB供电静音小风扇，3档风力可调，噪音极低，宿舍夏天必备，不影响室友休息。', seller:'宿舍达人', sellerDept:'物理与电子学院', sellerPhone:'126****4567', sellerAvatar:'https://i.pravatar.cc/80?img=39', views:257, likes:78, collects:30, location:'南区宿舍', time:'2026-06-04 10:00', status:'在售', tag:'hot', comments:[], reviewStatus:'approved' },
        { id:30, name:'USB小夜灯', category:'小家电', price:12, originalPrice:29, condition:'9成新', desc:'USB供电小夜灯，三档调光，柔和不刺眼，宿舍熬夜必备。', seller:'夜猫子', sellerDept:'计算机学院', sellerPhone:'123****6789', sellerAvatar:'https://i.pravatar.cc/80?img=40', views:134, likes:34, collects:14, location:'东区宿舍', time:'2026-06-04 16:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },
        { id:31, name:'美的电热水壶1.5L', category:'小家电', price:30, originalPrice:89, condition:'9成新', desc:'不锈钢内胆，自动断电，烧水快，宿舍用。', seller:'生活管家', sellerDept:'化学学院', sellerPhone:'122****9900', sellerAvatar:'https://i.pravatar.cc/80?img=41', views:52, likes:11, collects:4, location:'西区宿舍', time:'2026-06-09 20:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' },

        // ---- 其他 ----
        { id:32, name:'考研资料+笔记整理', category:'其他', price:45, originalPrice:200, condition:'有笔记', desc:'计算机考研全套资料，含408真题、笔记、思维导图，已上岸。', seller:'408上岸', sellerDept:'计算机学院', sellerPhone:'121****1000', sellerAvatar:'https://i.pravatar.cc/80?img=42', views:201, likes:65, collects:28, location:'北区宿舍', time:'2026-06-10 04:00', status:'在售', tag:'hot', comments:[], reviewStatus:'approved' },
        { id:33, name:'小熊煮蛋器', category:'小家电', price:20, originalPrice:59, condition:'9成新', desc:'小熊煮蛋器，一次可煮6个，自动断电，早餐神器。', seller:'美食家', sellerDept:'食品学院', sellerPhone:'120****2000', sellerAvatar:'https://i.pravatar.cc/80?img=43', views:41, likes:9, collects:3, location:'南区宿舍', time:'2026-06-08 19:00', status:'在售', tag:'', comments:[], reviewStatus:'approved' }
    ];

    /* ============================================================
     * 初始化数据到 localStorage
     * ============================================================ */
    function initData() {
        var storedVersion = _get(DATA_VERSION_KEY, 0);
        var stored = _get(STORAGE_KEY, null);
        if (!stored || stored.length === 0 || storedVersion < DATA_VERSION) {
            _set(STORAGE_KEY, fullProducts);
            _set(DATA_VERSION_KEY, DATA_VERSION);
            console.log('[二手API] 初始化/刷新商品数据 v' + DATA_VERSION + '，共', fullProducts.length, '条');
        }
        var orders = _get(ORDER_KEY, null);
        if (!orders) {
            _set(ORDER_KEY, []);
        }
    }

    /* ============================================================
     * 模拟网络延迟
     * ============================================================ */
    function delay(ms) {
        return new Promise(function(resolve) { setTimeout(resolve, ms || 300); });
    }

    /* ============================================================
     * API 接口
     * ============================================================ */
    var SecondhandAPI = {

        /**
         * 获取统计数据
         * 返回: { onSale, soldCount, activeUsers, categoryCounts }
         */
        getStats: function() {
            return delay(200).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var onSale = products.filter(function(p) { return p.status === '在售' && p.reviewStatus === 'approved'; });
                var sold = products.filter(function(p) { return p.status === '已售出'; });
                var sellers = {};
                onSale.forEach(function(p) { sellers[p.seller] = true; });
                sold.forEach(function(p) { sellers[p.seller] = true; });

                var cats = ['数码','书籍','生活用品','运动','实训工具','小家电','其他'];
                var catCounts = {};
                cats.forEach(function(c) {
                    catCounts[c] = onSale.filter(function(p) { return p.category === c; }).length;
                });

                var result = {
                    onSale: onSale.length,
                    soldCount: sold.length,
                    activeUsers: Object.keys(sellers).length + Math.floor(Math.random() * 200) + 800,
                    totalProducts: products.length,
                    categoryCounts: catCounts
                };
                console.log('[二手API] getStats:', result);
                return result;
            });
        },

        /**
         * 获取商品列表
         * params: { category, keyword, sort, page, pageSize }
         * 返回: { list, total, page, pageSize }
         */
        getProducts: function(params) {
            params = params || {};
            var category = params.category || 'all';
            var keyword = (params.keyword || '').trim().toLowerCase();
            var sort = params.sort || 'latest';
            var page = params.page || 1;
            var pageSize = params.pageSize || 8;

            return delay(300).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                // 只显示审核通过的
                var filtered = products.filter(function(p) { return p.reviewStatus === 'approved'; });

                // 分类筛选
                if (category && category !== 'all') {
                    filtered = filtered.filter(function(p) { return p.category === category; });
                }

                // 关键词搜索
                if (keyword) {
                    filtered = filtered.filter(function(p) {
                        return p.name.toLowerCase().indexOf(keyword) > -1 ||
                               p.desc.toLowerCase().indexOf(keyword) > -1 ||
                               p.category.toLowerCase().indexOf(keyword) > -1 ||
                               p.condition.toLowerCase().indexOf(keyword) > -1;
                    });
                }

                // 排序
                switch(sort) {
                    case 'price-asc':
                        filtered.sort(function(a,b) { return a.price - b.price; });
                        break;
                    case 'price-desc':
                        filtered.sort(function(a,b) { return b.price - a.price; });
                        break;
                    case 'hot':
                        filtered.sort(function(a,b) { return b.views - a.views; });
                        break;
                    case 'latest':
                    default:
                        filtered.sort(function(a,b) { return new Date(b.time) - new Date(a.time); });
                        break;
                }

                var total = filtered.length;
                var start = (page - 1) * pageSize;
                var list = filtered.slice(start, start + pageSize);

                var result = { list: list, total: total, page: page, pageSize: pageSize };
                console.log('[二手API] getProducts:', { category: category, keyword: keyword, sort: sort, page: page, total: total });
                return result;
            });
        },

        /**
         * 获取商品详情
         * params: productId
         * 返回: 商品对象 或 null
         */
        getProductDetail: function(productId) {
            return delay(200).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var product = products.find(function(p) { return p.id === productId; });
                if (product) {
                    // 增加浏览量
                    product.views = (product.views || 0) + 1;
                    _set(STORAGE_KEY, products);
                    console.log('[二手API] getProductDetail:', product.name, '浏览量:', product.views);
                } else {
                    console.warn('[二手API] 商品不存在:', productId);
                }
                return product || null;
            });
        },

        /**
         * 发布商品
         * params: 商品对象
         * 返回: 新商品（含id）
         */
        publishProduct: function(productData) {
            return delay(500).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var maxId = products.reduce(function(max, p) { return Math.max(max, p.id); }, 0);
                var newProduct = {
                    id: maxId + 1,
                    name: productData.name,
                    category: productData.category,
                    price: Number(productData.price),
                    originalPrice: Number(productData.originalPrice) || Math.round(Number(productData.price) * 1.8),
                    condition: productData.condition || '9成新',
                    desc: productData.desc,
                    seller: productData.seller || '匿名用户',
                    sellerStuId: productData.sellerStuId || '',
                    sellerDept: productData.sellerDept || '未填写',
                    sellerPhone: productData.sellerPhone || '',
                    sellerAvatar: productData.sellerAvatar || 'https://i.pravatar.cc/80?img=' + (maxId + 1),
                    views: 0,
                    likes: 0,
                    collects: 0,
                    location: productData.location || '校内',
                    time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    status: '在售',
                    tag: 'new',
                    comments: [],
                    reviewStatus: 'pending',  // 新发布商品默认待审核
                    images: productData.images || []
                };
                products.unshift(newProduct);
                _set(STORAGE_KEY, products);
                console.log('[二手API] publishProduct:', newProduct.name, 'ID:', newProduct.id);
                return newProduct;
            });
        },

        /**
         * 获取热门商品（按浏览量排序）
         * params: limit (默认10)
         */
        getHotProducts: function(limit) {
            limit = limit || 10;
            return delay(200).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var onSale = products.filter(function(p) { return p.status === '在售' && p.reviewStatus === 'approved'; });
                onSale.sort(function(a,b) { return b.views - a.views; });
                console.log('[二手API] getHotProducts:', onSale.length, '条，返回前', limit);
                return onSale.slice(0, limit);
            });
        },

        /**
         * 获取教材租用列表
         */
        getRentalBooks: function() {
            return delay(200).then(function() {
                var books = _get(RENTAL_KEY, null);
                if (books && books.length > 0) {
                    console.log('[二手API] getRentalBooks:', books.length, '条');
                    return books;
                }
                /* 兼容旧键 */
                var oldBooks = _get('campus_rental_books', null);
                if (oldBooks && oldBooks.length > 0) {
                    _set(RENTAL_KEY, oldBooks);
                    console.log('[二手API] getRentalBooks(旧键迁移):', oldBooks.length, '条');
                    return oldBooks;
                }
                // 使用默认数据
                books = [
                    { id:1, name:'高等数学（同济第七版）上册', price:15, period:'1学期', condition:'少量笔记', desc:'适用理工科专业，含部分课堂笔记。', seller:'数学系学长', sellerDept:'数学与统计学院', available:true, reviewStatus:'approved', views:89, likes:23, collects:8, time:'2天前' },
                    { id:2, name:'大学物理（第四版）', price:12, period:'1学期', condition:'几乎全新', desc:'适用物理、工科专业，保存完好。', seller:'物理系学姐', sellerDept:'物理与电子学院', available:true, reviewStatus:'approved', views:56, likes:12, collects:5, time:'3天前' },
                    { id:3, name:'线性代数及其应用', price:10, period:'1学期', condition:'有笔记标注', desc:'含详细课堂笔记，期末复习利器。', seller:'数学系同学', sellerDept:'数学与统计学院', available:true, reviewStatus:'approved', views:67, likes:18, collects:7, time:'4天前' },
                    { id:4, name:'C++ Primer Plus 第6版', price:20, period:'1学年', condition:'几乎全新', desc:'计算机专业经典教材，含课后习题答案。', seller:'计算机系学长', sellerDept:'计算机学院', available:true, reviewStatus:'approved', views:134, likes:45, collects:20, time:'1天前' },
                    { id:5, name:'微观经济学（曼昆）', price:18, period:'1学期', condition:'少量笔记', desc:'经管专业核心教材，重点标注清晰。', seller:'经济系学姐', sellerDept:'经济管理学院', available:false, reviewStatus:'approved', views:98, likes:34, collects:15, time:'5天前' },
                    { id:6, name:'数据结构与算法分析', price:22, period:'1学年', condition:'少量笔记', desc:'计算机专业必修，含代码示例和算法图解。', seller:'软件工程学长', sellerDept:'计算机学院', available:true, reviewStatus:'approved', views:112, likes:38, collects:16, time:'2天前' }
                ];
                _set(RENTAL_KEY, books);
                _set('campus_rental_books', books); /* 双写旧键 */
                console.log('[二手API] getRentalBooks(默认数据):', books.length, '条');
                return books;
            });
        },

        /**
         * 搜索建议（输入时实时匹配）
         */
        searchSuggest: function(keyword) {
            keyword = (keyword || '').trim().toLowerCase();
            if (!keyword) return Promise.resolve([]);

            return delay(100).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var matches = products.filter(function(p) {
                    return p.name.toLowerCase().indexOf(keyword) > -1 && p.reviewStatus === 'approved';
                }).slice(0, 6);
                return matches.map(function(p) { return { id: p.id, name: p.name, price: p.price, category: p.category }; });
            });
        },

        /**
         * 获取待审核商品列表（管理员用）
         * params: { status, page, pageSize }
         * status: 'pending'=待审核, 'approved'=已通过, 'rejected'=已拒绝, 'all'=全部
         * 返回: { list, total, page, pageSize }
         */
        getReviewList: function(params) {
            params = params || {};
            var status = params.status || 'pending';
            var page = params.page || 1;
            var pageSize = params.pageSize || 20;

            return delay(200).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var filtered = products;

                if (status && status !== 'all') {
                    filtered = products.filter(function(p) { return p.reviewStatus === status; });
                }

                // 按时间倒序
                filtered.sort(function(a, b) { return new Date(b.time) - new Date(a.time); });

                var total = filtered.length;
                var start = (page - 1) * pageSize;
                var list = filtered.slice(start, start + pageSize);

                console.log('[二手API] getReviewList: status=', status, '共', total, '条');
                return { list: list, total: total, page: page, pageSize: pageSize };
            });
        },

        /**
         * 审核通过
         * params: { productId, reviewer, reviewNote }
         */
        approveProduct: function(params) {
            params = params || {};
            var productId = params.productId;

            return delay(300).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var product = products.find(function(p) { return p.id === productId; });
                if (!product) {
                    console.warn('[二手API] 审核通过失败：商品不存在', productId);
                    return { success: false, message: '商品不存在' };
                }
                product.reviewStatus = 'approved';
                product.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
                product.reviewer = params.reviewer || '管理员';
                product.reviewNote = params.reviewNote || '';
                _set(STORAGE_KEY, products);
                _set('campus_secondhand', products); /* 双写兼容 */
                console.log('[二手API] 审核通过:', product.name, 'ID:', productId);
                return { success: true, message: '审核通过', product: product };
            });
        },

        /**
         * 审核拒绝
         * params: { productId, reviewer, reviewNote }
         */
        rejectProduct: function(params) {
            params = params || {};
            var productId = params.productId;

            return delay(300).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var product = products.find(function(p) { return p.id === productId; });
                if (!product) {
                    console.warn('[二手API] 审核拒绝失败：商品不存在', productId);
                    return { success: false, message: '商品不存在' };
                }
                product.reviewStatus = 'rejected';
                product.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
                product.reviewer = params.reviewer || '管理员';
                product.reviewNote = params.reviewNote || '';
                if (params.reviewNote) product.rejectReason = params.reviewNote;
                product.status = '已下架';
                _set(STORAGE_KEY, products);
                _set('campus_secondhand', products); /* 双写兼容 */
                console.log('[二手API] 审核拒绝:', product.name, 'ID:', productId);
                return { success: true, message: '已拒绝', product: product };
            });
        },

        /**
         * 获取用户自己发布的商品（我的闲置）
         * params: { sellerName, sellerStuId }
         */
        getMyProducts: function(params) {
            params = params || {};
            var sellerName = params.sellerName || '';
            var sellerStuId = params.sellerStuId || '';

            return delay(200).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var filtered = products.filter(function(p) {
                    if (sellerStuId && p.sellerStuId) return p.sellerStuId === sellerStuId;
                    if (sellerName) return p.seller === sellerName;
                    return false;
                });
                filtered.sort(function(a, b) { return new Date(b.time) - new Date(a.time); });
                console.log('[二手API] getMyProducts:', sellerName || sellerStuId, '共', filtered.length, '条');
                return filtered;
            });
        },

        /**
         * 获取审核统计（管理员概览用）
         */
        getReviewStats: function() {
            return delay(100).then(function() {
                var products = _get(STORAGE_KEY, fullProducts);
                var pending = products.filter(function(p) { return p.reviewStatus === 'pending'; }).length;
                var approved = products.filter(function(p) { return p.reviewStatus === 'approved'; }).length;
                var rejected = products.filter(function(p) { return p.reviewStatus === 'rejected'; }).length;
                return { pending: pending, approved: approved, rejected: rejected, total: products.length };
            });
        }
    };

    // 初始化数据
    initData();

    // 暴露到全局
    window.SecondhandAPI = SecondhandAPI;
    console.log('[二手API] 模块加载完成');

})(window);
