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

    var categoryColors = {
        '数码': ['#3b82f6', '#1e40af'],
        '书籍': ['#8b5cf6', '#7c3aed'],
        '生活用品': ['#f59e0b', '#d97706'],
        '运动': ['#10b981', '#059669'],
        '实训工具': ['#6366f1', '#4f46e5'],
        '小家电': ['#ec4899', '#be185d'],
        '其他': ['#6b7280', '#4b5563']
    };

    var productImages = {
        1: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop'
        ],
        2: [
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600&fit=crop'
        ],
        3: [
            'https://images.unsplash.com/photo-1592656034223-8f862b5b4946?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop'
        ],
        4: [
            'https://images.unsplash.com/photo-1586953208270-767fc2b4be75?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=600&fit=crop'
        ],
        5: [
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop'
        ],
        6: [
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=600&fit=crop'
        ],
        7: [
            'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=600&fit=crop'
        ],
        8: [
            'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'
        ],
        9: [
            'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1591337676887-a217a6c5a5a6?w=800&h=600&fit=crop'
        ],
        10: [
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop'
        ],
        11: [
            'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1559692048-79a3f837883d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1574614343663-3b4a2f0a8c3a?w=800&h=600&fit=crop'
        ],
        12: [
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop'
        ],
        13: [
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1530124566582-a45a7e3e29f0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop'
        ],
        14: [
            'https://images.unsplash.com/photo-1522338242992-e1a54571a9f7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'
        ],
        15: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop'
        ],
        16: [
            'https://images.unsplash.com/photo-1530124566582-a45a7e3e29f0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop'
        ],
        17: [
            'https://images.unsplash.com/photo-1570222094114-d054a816e5e4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'
        ],
        18: [
            'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=600&fit=crop'
        ],
        19: [
            'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop'
        ],
        20: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop'
        ],
        21: [
            'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'
        ],
        22: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1461896836934-bd45ba8f8e25?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'
        ],
        23: [
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1461896836934-bd45ba8f8e25?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'
        ],
        24: [
            'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=600&fit=crop'
        ],
        25: [
            'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=600&fit=crop'
        ],
        26: [
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop'
        ],
        27: [
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1530124566582-a45a7e3e29f0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop'
        ],
        28: [
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1530124566582-a45a7e3e29f0?w=800&h=600&fit=crop'
        ],
        29: [
            'https://images.unsplash.com/photo-1585771724684-38269d6639db?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1570222094114-d054a816e5e4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop'
        ],
        30: [
            'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'
        ],
        31: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1570222094114-d054a816e5e4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'
        ],
        32: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop'
        ],
        33: [
            'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'
        ]
    };

    var categoryFallbackImages = {
        '数码': [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop'
        ],
        '运动': [
            'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1461896836934-bd45ba8f8e25?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'
        ],
        '书籍': [
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop'
        ],
        '小家电': [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1570222094114-d054a816e5e4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'
        ],
        '生活用品': [
            'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop'
        ],
        '实训工具': [
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1530124566582-a45a7e3e29f0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop'
        ],
        '其他': [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop'
        ]
    };

    var slideLabels = ['正面实拍', '侧面展示', '细节特写', '配件全家福'];

    var sellerProfiles = {
        '张同学': { dept: '计算机学院', grade: '大三', phone: '138****5678', wechat: 'zhang_campus', joinDate: '2024-03', reputation: 4.8, trades: 23, praiseRate: '98%', avatar: '张' },
        '李同学': { dept: '机械工程学院', grade: '大四', phone: '139****1234', wechat: 'li_mech', joinDate: '2023-09', reputation: 4.6, trades: 15, praiseRate: '96%', avatar: '李' },
        '王同学': { dept: '文学院', grade: '大二', phone: '137****9876', wechat: 'wang_liter', joinDate: '2024-09', reputation: 4.9, trades: 8, praiseRate: '100%', avatar: '王' },
        '赵同学': { dept: '商学院', grade: '大三', phone: '136****5432', wechat: 'zhao_biz', joinDate: '2024-01', reputation: 4.7, trades: 19, praiseRate: '97%', avatar: '赵' },
        '刘同学': { dept: '艺术学院', grade: '大二', phone: '135****6789', wechat: 'liu_art', joinDate: '2024-06', reputation: 4.5, trades: 6, praiseRate: '95%', avatar: '刘' },
        '陈同学': { dept: '电子信息学院', grade: '大四', phone: '133****4321', wechat: 'chen_ee', joinDate: '2023-06', reputation: 4.9, trades: 31, praiseRate: '99%', avatar: '陈' }
    };

    function getUserAvatarUrl(stuId) {
        if (!stuId) return null;
        if (window.CampusDB) return CampusDB.getUserAvatar(stuId);
        try {
            var avatars = JSON.parse(localStorage.getItem('campus_avatars') || '{}');
            return avatars[stuId] || null;
        } catch(e) { return null; }
    }

    function renderAvatarHtml(avatarText, avatarUrl, extraClass) {
        if (avatarUrl) {
            return '<div class="' + (extraClass || 'detail-comment-avatar') + '" style="padding:0;overflow:hidden"><img src="' + avatarUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentElement.innerHTML=\'' + avatarText + '\'"></div>';
        }
        return '<div class="' + (extraClass || 'detail-comment-avatar') + '">' + avatarText + '</div>';
    }

    function getSellerProfile(name) {
        var students = [];
        if (window.CampusDB) { students = CampusDB.getStudents(); } else {
            try { students = JSON.parse(localStorage.getItem('campus_students') || '[]'); } catch(e) {}
        }
        var product = null;
        var allProducts = getProducts();
        for (var pi = 0; pi < allProducts.length; pi++) {
            if (allProducts[pi].seller === name) { product = allProducts[pi]; break; }
        }
        var matchedStudent = null;
        if (product && product.sellerStuId) {
            matchedStudent = students.find(function(s) { return s.stuId === product.sellerStuId; });
        } else {
            matchedStudent = students.find(function(s) { return s.name === name; });
        }
        if (matchedStudent) {
            var sellerProducts = allProducts.filter(function(p) {
                return p.seller === matchedStudent.name || (p.sellerStuId && p.sellerStuId === matchedStudent.stuId);
            });
            var totalTrades = sellerProducts.filter(function(p) { return p.status === '已售出'; }).length;
            var onSale = sellerProducts.filter(function(p) { return p.status === '在售'; }).length;
            var reputation = 4.5;
            if (totalTrades > 0) reputation = Math.min(5.0, 4.0 + totalTrades * 0.1);
            var praiseRate = '98%';
            if (totalTrades > 5) praiseRate = '100%';
            else if (totalTrades > 2) praiseRate = '97%';
            return {
                dept: matchedStudent.dept || '未填写',
                grade: '在校生',
                phone: matchedStudent.phone || '未填写',
                wechat: matchedStudent.name + '_campus',
                joinDate: matchedStudent.regTime ? matchedStudent.regTime.substring(0, 7) : '未知',
                reputation: reputation,
                trades: totalTrades,
                praiseRate: praiseRate,
                avatar: matchedStudent.name.charAt(0),
                avatarUrl: getUserAvatarUrl(matchedStudent.stuId),
                totalProducts: sellerProducts.length,
                onSale: onSale
            };
        }
        if (sellerProfiles[name]) return sellerProfiles[name];
        var seed = 0;
        for (var i = 0; i < name.length; i++) seed += name.charCodeAt(i);
        var depts = ['计算机学院', '机械工程学院', '文学院', '商学院', '艺术学院', '电子信息学院', '数学学院', '外语学院'];
        var grades = ['大一', '大二', '大三', '大四'];
        return {
            dept: depts[seed % depts.length],
            grade: grades[seed % grades.length],
            phone: '1' + (30 + seed % 10) + '****' + (1000 + seed % 9000),
            wechat: name + '_campus',
            joinDate: '2024-0' + (1 + seed % 9),
            reputation: (4.0 + (seed % 10) / 10).toFixed(1),
            trades: 5 + seed % 30,
            praiseRate: (90 + seed % 10) + '%',
            avatar: name.charAt(0)
        };
    }

    function getProducts() {
        /* 优先使用 SecondhandAPI 的数据源 */
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

    function showToast(msg) {
        var toast = document.getElementById('detailToast');
        document.getElementById('detailToastMsg').textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    function getProductImage(product) {
        if (product.images && Array.isArray(product.images) && product.images.length > 0) return product.images[0];
        if (productImages[product.id] && productImages[product.id][0]) return productImages[product.id][0];
        return categoryFallbackImages[product.category] || categoryFallbackImages['其他'];
    }

    function getProductId() {
        var params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'));
    }

    function getProduct(id) {
        var products = getProducts();
        return products.find(function(p) { return p.id === id; });
    }

    function incrementViews(product) {
        var products = getProducts();
        var idx = products.findIndex(function(p) { return p.id === product.id; });
        if (idx !== -1) {
            products[idx].views = (products[idx].views || 0) + 1;
            saveProducts(products);
        }
    }

    function formatTime(t) {
        if (!t) return '刚刚';
        return t;
    }

    var currentSlide = 0;

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function getChatData() {
        if (window.CampusDB) return CampusDB.getChat();
        try { return JSON.parse(localStorage.getItem('campus_chat') || '{}'); } catch(e) { return {}; }
    }

    function saveChatData(data) {
        if (window.CampusDB) return CampusDB.saveChat(data);
        localStorage.setItem('campus_chat', JSON.stringify(data));
    }

    function getChatSessionKey(productId, buyerStuId, sellerStuId) {
        var ids = [buyerStuId, sellerStuId].sort();
        return productId + '_' + ids[0] + '_' + ids[1];
    }

    function getChatInputHtml() {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') {
            return '<div class="detail-chat-login-tip"><i class="fas fa-lock"></i> <a href="login.html">登录</a>后即可私信卖家</div>';
        }
        return '<div class="detail-chat-input">' +
            '<input type="text" id="chatInput" placeholder="输入消息，按回车发送...">' +
            '<button id="chatSendBtn"><i class="fas fa-paper-plane"></i> 发送</button>' +
        '</div>';
    }

    function getDeleteBtnHtml(product) {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') return '';
        var isOwner = false;
        if (product.sellerStuId && user.stuId) {
            isOwner = product.sellerStuId === user.stuId;
        } else {
            isOwner = product.seller === user.name;
        }
        if (!isOwner) return '';
        return '<button class="detail-delete-btn" id="deleteProductBtn"><i class="fas fa-trash-alt"></i> 删除商品</button>';
    }

    function openPrivateChatModal(product) {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') {
            showToast('请先登录后再私信卖家');
            return;
        }
        var sellerStuId = product.sellerStuId || product.seller;
        var isSelf = false;
        if (product.sellerStuId && user.stuId) isSelf = product.sellerStuId === user.stuId;
        else isSelf = product.seller === user.name;
        if (isSelf) {
            showToast('不能给自己发私信哦');
            return;
        }
        var existing = document.getElementById('privateChatOverlay');
        if (existing) { existing.remove(); }

        var sessionKey = getChatSessionKey(product.id, user.stuId, sellerStuId);
        var chatData = getChatData();
        var messages = chatData[sessionKey] || [];

        var sellerAvatar = product.seller ? product.seller.charAt(0) : '卖';
        var myAvatar = user.name ? user.name.charAt(0) : '我';
        var sellerAvatarUrl = getUserAvatarUrl(sellerStuId);
        var myAvatarUrl = getUserAvatarUrl(user.stuId);

        var messagesHtml = '';
        if (messages.length === 0) {
            messagesHtml = '<div class="pchat-empty"><i class="fas fa-comment-dots"></i><p>暂无消息，发送第一条私信吧</p></div>';
        } else {
            messages.forEach(function(msg) {
                var isSelf = msg.senderStuId === user.stuId;
                var avatarClass = isSelf ? 'buyer' : 'seller';
                var avatarText = isSelf ? myAvatar : sellerAvatar;
                var avatarUrl = isSelf ? myAvatarUrl : sellerAvatarUrl;
                var avatarHtml = avatarUrl ? '<img src="' + avatarUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.outerHTML=\'' + avatarText + '\'">' : avatarText;
                var statusHtml = '';
                if (isSelf) {
                    if (msg.sending) {
                        statusHtml = '<div class="pchat-msg-status sending"><i class="fas fa-spinner fa-spin"></i> 发送中</div>';
                    } else if (msg.read) {
                        statusHtml = '<div class="pchat-msg-status read"><i class="fas fa-check-double"></i> 已读</div>';
                    } else {
                        statusHtml = '<div class="pchat-msg-status unread"><i class="fas fa-check"></i> 未读</div>';
                    }
                } else if (!msg.read) {
                    statusHtml = '<div class="pchat-msg-status unread-other"><i class="fas fa-circle"></i> 未读</div>';
                }
                messagesHtml += '<div class="pchat-msg' + (isSelf ? ' self' : '') + '">' +
                    '<div class="pchat-msg-avatar ' + avatarClass + '">' + avatarHtml + '</div>' +
                    '<div>' +
                        '<div class="pchat-msg-bubble">' + escapeHtml(msg.text) + '</div>' +
                        '<div class="pchat-msg-time">' + msg.time + '</div>' +
                        statusHtml +
                    '</div>' +
                '</div>';
            });
        }

        var overlay = document.createElement('div');
        overlay.className = 'pchat-overlay';
        overlay.id = 'privateChatOverlay';
        overlay.innerHTML = '<div class="pchat-window">' +
            '<div class="pchat-header">' +
                '<div class="pchat-header-left">' +
                    '<div class="pchat-header-avatar">' + (sellerAvatarUrl ? '<img src="' + sellerAvatarUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.outerHTML=\'' + sellerAvatar + '\'">' : sellerAvatar) + '</div>' +
                    '<div>' +
                        '<h4>' + escapeHtml(product.seller) + '</h4>' +
                        '<span class="pchat-online"><span class="dot"></span> 在线</span>' +
                    '</div>' +
                '</div>' +
                '<div class="pchat-header-right">' +
                    '<div class="pchat-product-info"><i class="fas fa-tag"></i> ' + escapeHtml(product.name) + ' · ¥' + product.price + '</div>' +
                    '<button class="pchat-close" id="pchatClose"><i class="fas fa-times"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="pchat-messages" id="pchatMessages">' + messagesHtml + '</div>' +
            '<div class="pchat-input-area">' +
                '<input type="text" id="pchatInput" placeholder="输入消息，按回车发送...">' +
                '<button id="pchatSendBtn"><i class="fas fa-paper-plane"></i></button>' +
            '</div>' +
        '</div>';

        document.body.appendChild(overlay);

        setTimeout(function() {
            overlay.classList.add('active');
            var msgArea = document.getElementById('pchatMessages');
            if (msgArea) msgArea.scrollTop = msgArea.scrollHeight;
            var inputEl = document.getElementById('pchatInput');
            if (inputEl) inputEl.focus();
        }, 50);

        markChatRead(product);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closePrivateChat(overlay);
        });
        document.getElementById('pchatClose').addEventListener('click', function() {
            closePrivateChat(overlay);
        });

        var pchatInput = document.getElementById('pchatInput');
        var pchatSendBtn = document.getElementById('pchatSendBtn');

        function doSend() {
            var text = pchatInput.value.trim();
            if (!text) { showToast('请输入消息内容'); return; }

            var chatData2 = getChatData();
            if (!chatData2[sessionKey]) chatData2[sessionKey] = [];
            var now = new Date();
            var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

            chatData2[sessionKey].push({
                senderStuId: user.stuId,
                senderName: user.name,
                text: text,
                time: timeStr,
                read: false,
                sending: true,
                productId: product.id,
                productName: product.name,
                timestamp: now.getTime()
            });
            saveChatData(chatData2);
            pchatInput.value = '';

            refreshPrivateChatMessages(product, sessionKey, user, sellerAvatar, myAvatar, sellerAvatarUrl, myAvatarUrl);

            setTimeout(function() {
                var chatData3 = getChatData();
                var msgs = chatData3[sessionKey] || [];
                msgs.forEach(function(m) {
                    if (m.senderStuId === user.stuId && m.sending) {
                        m.sending = false;
                    }
                });
                saveChatData(chatData3);
                refreshPrivateChatMessages(product, sessionKey, user, sellerAvatar, myAvatar, sellerAvatarUrl, myAvatarUrl);
            }, 800);

            setTimeout(function() {
                simulateSellerReply(product, sessionKey, function() {
                    refreshPrivateChatMessages(product, sessionKey, user, sellerAvatar, myAvatar, sellerAvatarUrl, myAvatarUrl);
                });
            }, 1500 + Math.random() * 2000);
        }

        if (pchatInput) {
            pchatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') { e.preventDefault(); doSend(); }
            });
        }
        if (pchatSendBtn) {
            pchatSendBtn.addEventListener('click', function() { doSend(); });
        }
    }

    function closePrivateChat(overlay) {
        overlay.classList.remove('active');
        setTimeout(function() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 300);
    }

    function refreshPrivateChatMessages(product, sessionKey, user, sellerAvatar, myAvatar, sellerAvatarUrl, myAvatarUrl) {
        var msgArea = document.getElementById('pchatMessages');
        if (!msgArea) return;
        var chatData = getChatData();
        var messages = chatData[sessionKey] || [];

        if (messages.length === 0) {
            msgArea.innerHTML = '<div class="pchat-empty"><i class="fas fa-comment-dots"></i><p>暂无消息，发送第一条私信吧</p></div>';
            return;
        }

        var html = '';
        messages.forEach(function(msg) {
            var isSelf = msg.senderStuId === user.stuId;
            var avatarClass = isSelf ? 'buyer' : 'seller';
            var avatarText = isSelf ? myAvatar : sellerAvatar;
            var avatarUrl = isSelf ? myAvatarUrl : sellerAvatarUrl;
            var avatarHtml = avatarUrl ? '<img src="' + avatarUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.outerHTML=\'' + avatarText + '\'">' : avatarText;
            var statusHtml = '';
            if (isSelf) {
                if (msg.sending) {
                    statusHtml = '<div class="pchat-msg-status sending"><i class="fas fa-spinner fa-spin"></i> 发送中</div>';
                } else if (msg.read) {
                    statusHtml = '<div class="pchat-msg-status read"><i class="fas fa-check-double"></i> 已读</div>';
                } else {
                    statusHtml = '<div class="pchat-msg-status unread"><i class="fas fa-check"></i> 未读</div>';
                }
            } else if (!msg.read) {
                statusHtml = '<div class="pchat-msg-status unread-other"><i class="fas fa-circle"></i> 未读</div>';
            }
            html += '<div class="pchat-msg' + (isSelf ? ' self' : '') + '">' +
                '<div class="pchat-msg-avatar ' + avatarClass + '">' + avatarHtml + '</div>' +
                '<div>' +
                    '<div class="pchat-msg-bubble">' + escapeHtml(msg.text) + '</div>' +
                    '<div class="pchat-msg-time">' + msg.time + '</div>' +
                    statusHtml +
                '</div>' +
            '</div>';
        });
        msgArea.innerHTML = html;
        msgArea.scrollTop = msgArea.scrollHeight;
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function simulateSellerReply(product, sessionKey, callback) {
        var user = getCurrentUser();
        if (!user) return;
        var chatData = getChatData();
        var messages = chatData[sessionKey] || [];
        if (messages.length === 0) return;

        var lastMsg = messages[messages.length - 1];
        if (lastMsg.senderStuId === user.stuId) {
            var replies = [
                '你好，这个商品还在的，可以当面交易~',
                '好的，价格可以小刀，你出多少？',
                '可以的，你什么时候方便看货？',
                '嗯嗯，商品成色很好，放心~',
                '我在北区宿舍，可以过来当面看',
                '这个已经是很优惠的价格了哦',
                '好的，我看看时间安排一下',
                '可以可以，加个微信详聊？'
            ];
            var reply = replies[Math.floor(Math.random() * replies.length)];
            var sellerStuId = product.sellerStuId || product.seller;
            var now = new Date();
            var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

            chatData[sessionKey].push({
                senderStuId: sellerStuId,
                senderName: product.seller,
                text: reply,
                time: timeStr,
                read: false,
                productId: product.id,
                productName: product.name,
                timestamp: now.getTime()
            });

            messages.forEach(function(m) {
                if (m.senderStuId !== sellerStuId) m.read = true;
            });

            var pchatOverlay = document.getElementById('privateChatOverlay');
            if (pchatOverlay && pchatOverlay.classList.contains('active')) {
                var newMsg = chatData[sessionKey][chatData[sessionKey].length - 1];
                if (newMsg && newMsg.senderStuId === sellerStuId) {
                    newMsg.read = true;
                }
            }

            saveChatData(chatData);
            updateNavChatBadge();
            if (callback) callback();
        }
    }

    function markChatRead(product) {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') return;
        var sellerStuId = product.sellerStuId || product.seller;
        var sessionKey = getChatSessionKey(product.id, user.stuId, sellerStuId);
        var chatData = getChatData();
        var messages = chatData[sessionKey] || [];
        var changed = false;
        messages.forEach(function(m) {
            if (m.senderStuId !== user.stuId && !m.read) {
                m.read = true;
                changed = true;
            }
        });
        if (changed) {
            saveChatData(chatData);
            updateNavChatBadge();
        }
    }

    function updateNavChatBadge() {
        var unread = getUnreadCount();
        var navBtn = document.getElementById('navChatBtn');
        if (navBtn) {
            var existingBadge = navBtn.querySelector('.chat-badge');
            if (existingBadge) existingBadge.remove();
            if (unread > 0) {
                var badge = document.createElement('span');
                badge.className = 'chat-badge';
                badge.textContent = unread;
                navBtn.appendChild(badge);
            }
        }
        var detailBadge = document.getElementById('chatUnreadBadge');
        if (detailBadge) {
            if (unread > 0) { detailBadge.style.display = 'inline'; detailBadge.textContent = unread + '条未读'; }
            else { detailBadge.style.display = 'none'; }
        }
    }

    function getUnreadCount() {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') return 0;
        var chatData = getChatData();
        var count = 0;
        Object.keys(chatData).forEach(function(key) {
            var messages = chatData[key] || [];
            messages.forEach(function(m) {
                if (m.senderStuId !== user.stuId && !m.read) count++;
            });
        });
        return count;
    }

    function openChatModal() {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') {
            showToast('请先登录后查看私信');
            return;
        }
        var existing = document.getElementById('chatModalOverlay');
        if (existing) { existing.classList.add('active'); renderChatSessions(); return; }

        var overlay = document.createElement('div');
        overlay.className = 'chat-modal-overlay';
        overlay.id = 'chatModalOverlay';
        overlay.innerHTML = '<div class="chat-modal">' +
            '<div class="chat-modal-header">' +
                '<h3><i class="fas fa-comments"></i> 我的私信 <span class="unread-badge" id="chatUnreadBadge" style="display:none"></span></h3>' +
                '<button class="chat-modal-close" id="chatModalClose"><i class="fas fa-times"></i></button>' +
            '</div>' +
            '<div class="chat-modal-body" id="chatModalBody"></div>' +
        '</div>';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.classList.remove('active');
        });
        document.getElementById('chatModalClose').addEventListener('click', function() {
            overlay.classList.remove('active');
        });

        renderChatSessions();
    }

    function renderChatSessions() {
        var user = getCurrentUser();
        if (!user) return;
        var chatData = getChatData();
        var body = document.getElementById('chatModalBody');
        if (!body) return;

        var sessions = [];
        Object.keys(chatData).forEach(function(key) {
            var messages = chatData[key];
            if (!messages || messages.length === 0) return;
            var hasMyMsg = messages.some(function(m) { return m.senderStuId === user.stuId; });
            var hasOtherMsg = messages.some(function(m) { return m.senderStuId !== user.stuId; });
            if (!hasMyMsg && !hasOtherMsg) return;

            var lastMsg = messages[messages.length - 1];
            var unreadCount = messages.filter(function(m) { return m.senderStuId !== user.stuId && !m.read; }).length;
            var otherStuId = '';
            var otherName = '';
            messages.forEach(function(m) {
                if (m.senderStuId !== user.stuId) {
                    otherStuId = m.senderStuId;
                    if (m.senderName) otherName = m.senderName;
                }
            });

            sessions.push({
                key: key,
                productId: lastMsg.productId,
                productName: lastMsg.productName,
                lastMsg: lastMsg,
                unreadCount: unreadCount,
                otherStuId: otherStuId,
                otherName: otherName,
                timestamp: lastMsg.timestamp || 0
            });
        });

        sessions.sort(function(a, b) { return b.timestamp - a.timestamp; });

        var unread = getUnreadCount();
        var badge = document.getElementById('chatUnreadBadge');
        if (badge) {
            if (unread > 0) { badge.style.display = 'inline'; badge.textContent = unread + '条未读'; }
            else { badge.style.display = 'none'; }
        }
        updateNavChatBadge();

        if (sessions.length === 0) {
            body.innerHTML = '<div class="chat-modal-empty"><i class="fas fa-inbox"></i><p>暂无私信记录</p></div>';
            return;
        }

        var html = '';
        sessions.forEach(function(s) {
            var avatarText = s.productName ? s.productName.charAt(0) : '?';
            html += '<div class="chat-session-item' + (s.unreadCount > 0 ? ' has-unread' : '') + '" data-key="' + s.key + '" data-product-id="' + s.productId + '">' +
                '<div class="chat-session-avatar">' + avatarText +
                    (s.unreadCount > 0 ? '<span class="unread-dot">' + s.unreadCount + '</span>' : '') +
                '</div>' +
                '<div class="chat-session-info">' +
                    '<div class="chat-session-name"><span>' + (s.otherName || s.otherStuId || '卖家') + '</span><span class="time">' + s.lastMsg.time + '</span></div>' +
                    '<div class="chat-session-preview">' + escapeHtml(s.lastMsg.text) + '</div>' +
                    '<div class="chat-session-product"><i class="fas fa-tag"></i> ' + escapeHtml(s.productName) + '</div>' +
                '</div>' +
            '</div>';
        });
        body.innerHTML = html;

        body.querySelectorAll('.chat-session-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var productId = parseInt(this.dataset.productId);
                var sessionKey = this.dataset.key;
                if (sessionKey) {
                    var chatData2 = getChatData();
                    var msgs = chatData2[sessionKey] || [];
                    var changed2 = false;
                    msgs.forEach(function(m) {
                        if (m.senderStuId !== user.stuId && !m.read) {
                            m.read = true;
                            changed2 = true;
                        }
                    });
                    if (changed2) saveChatData(chatData2);
                }
                overlay.classList.remove('active');
                updateNavChatBadge();
                if (productId) window.location.href = 'detail.html?id=' + productId;
            });
        });
    }

    function renderDetail(product) {
        if (!product) {
            document.getElementById('detailMain').innerHTML = '<div class="detail-not-found"><i class="fas fa-box-open"></i><h2>商品不存在</h2><p>该商品可能已被卖家删除</p><a href="secondhand.html"><i class="fas fa-arrow-left"></i> 返回二手市场</a></div>';
            return;
        }
        if (product.status === '已下架') {
            document.getElementById('detailMain').innerHTML = '<div class="detail-not-found"><i class="fas fa-box-open"></i><h2>商品已下架</h2><p>该商品已被管理员下架</p><a href="secondhand.html"><i class="fas fa-arrow-left"></i> 返回二手市场</a></div>';
            return;
        }
        if (product.reviewStatus === 'pending') {
            var currentUser = getCurrentUser();
            var isOwner = currentUser && (currentUser.name === product.seller || currentUser.stuId === product.sellerStuId);
            if (!isOwner) {
                document.getElementById('detailMain').innerHTML = '<div class="detail-not-found"><i class="fas fa-clock"></i><h2>商品审核中</h2><p>该商品正在审核中，审核通过后将展示</p><a href="secondhand.html"><i class="fas fa-arrow-left"></i> 返回二手市场</a></div>';
                return;
            }
        }
        if (product.reviewStatus === 'rejected') {
            var currentUser2 = getCurrentUser();
            var isOwner2 = currentUser2 && (currentUser2.name === product.seller || currentUser2.stuId === product.sellerStuId);
            if (!isOwner2) {
                document.getElementById('detailMain').innerHTML = '<div class="detail-not-found"><i class="fas fa-ban"></i><h2>商品未通过审核</h2><p>该商品未通过审核，无法展示</p><a href="secondhand.html"><i class="fas fa-arrow-left"></i> 返回二手市场</a></div>';
                return;
            }
        }

        document.getElementById('breadcrumbName').textContent = product.name;
        document.title = product.name + ' - 智慧校园二手市场';

        var icon = categoryIcons[product.category] || 'fas fa-box';
        var colors = categoryColors[product.category] || ['#3b82f6', '#1e40af'];
        var isSold = product.status === '已售出';
        var discount = product.originalPrice > 0 ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
        var seller = getSellerProfile(product.seller);
        var images = [];
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            images = product.images;
        } else {
            images = productImages[product.id] || categoryFallbackImages[product.category] || categoryFallbackImages['其他'];
        }
        var slideCount = images.length;

        var tagHtml = '';
        if (product.tag === 'hot') tagHtml += '<span class="detail-tag hot"><i class="fas fa-fire"></i> 热门</span>';
        if (product.tag === 'new') tagHtml += '<span class="detail-tag new"><i class="fas fa-sparkles"></i> 新上架</span>';
        if (product.tag === 'rec') tagHtml += '<span class="detail-tag rec"><i class="fas fa-thumbs-up"></i> 推荐</span>';
        tagHtml += '<span class="detail-tag cat"><i class="fas fa-tag"></i> ' + product.category + '</span>';

        var slides = '';
        for (var i = 0; i < slideCount; i++) {
            var bgGrad = 'linear-gradient(135deg, ' + colors[0] + '18, ' + colors[1] + '18)';
            var slideLabel = i < slideLabels.length ? slideLabels[i] : '实拍图' + (i + 1);
            slides += '<div class="detail-carousel-slide' + (i === 0 ? ' active' : '') + '" style="background:' + bgGrad + '">' +
                '<img src="' + images[i] + '" alt="' + product.name + ' ' + slideLabel + '" onerror="this.style.display=\'none\';var si=this.parentElement.querySelector(\'.slide-icon\');if(si)si.style.display=\'flex\'">' +
                '<div class="slide-icon" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center"><i class="' + icon + '"></i></div>' +
                '<div class="slide-label">' + slideLabel + ' ' + (i + 1) + '/' + slideCount + '</div>' +
            '</div>';
        }

        var dots = '';
        for (var j = 0; j < slideCount; j++) {
            dots += '<div class="detail-carousel-dot' + (j === 0 ? ' active' : '') + '" data-index="' + j + '"></div>';
        }

        var comments = product.comments || [];
        var commentsHtml = '';
        if (comments.length === 0) {
            commentsHtml = '<div class="detail-empty-comments"><i class="fas fa-comment-slash"></i><p>暂无留言，快来第一个提问吧</p></div>';
        } else {
            comments.forEach(function(c) {
                var isSellerComment = c.isSeller === true;
                var commentAvatarUrl = null;
                var commentStuId = c.stuId || null;
                if (commentStuId) commentAvatarUrl = getUserAvatarUrl(commentStuId);
                if (!commentAvatarUrl && c.name) {
                    var allStudents = [];
                    if (window.CampusDB) { allStudents = CampusDB.getStudents(); } else {
                        try { allStudents = JSON.parse(localStorage.getItem('campus_students') || '[]'); } catch(e3) {}
                    }
                    var cStudent = allStudents.find(function(s) { return s.name === c.name; });
                    if (cStudent) commentAvatarUrl = getUserAvatarUrl(cStudent.stuId);
                }
                var commentAvatarClass = 'detail-comment-avatar' + (isSellerComment ? ' seller-avatar' : '');
                commentsHtml += '<div class="detail-comment-item">' +
                    renderAvatarHtml(c.avatar || c.name.charAt(0), commentAvatarUrl, commentAvatarClass) +
                    '<div class="detail-comment-body">' +
                        '<div class="detail-comment-name">' + c.name + (isSellerComment ? '<span class="seller-badge">卖家</span>' : '') + '</div>' +
                        '<div class="detail-comment-text">' + c.text + '</div>' +
                        '<div class="detail-comment-time">' + c.time + '</div>' +
                    '</div>' +
                '</div>';
            });
        }

        var sellerProducts = getProducts().filter(function(p) {
            var sameSeller = p.seller === product.seller;
            if (product.sellerStuId && p.sellerStuId) sameSeller = sameSeller || p.sellerStuId === product.sellerStuId;
            return sameSeller && p.id !== product.id && p.status !== '已下架' && p.reviewStatus !== 'rejected';
        }).slice(0, 4);
        var otherHtml = '';
        sellerProducts.forEach(function(sp) {
            var spIcon = categoryIcons[sp.category] || 'fas fa-box';
            var spColors = categoryColors[sp.category] || ['#3b82f6', '#1e40af'];
            var spImgArr = [];
            if (sp.images && Array.isArray(sp.images) && sp.images.length > 0) spImgArr = sp.images;
            else spImgArr = productImages[sp.id] || categoryFallbackImages[sp.category] || categoryFallbackImages['其他'];
            var spImg = spImgArr[0];
            otherHtml += '<div class="detail-other-card" data-id="' + sp.id + '">' +
                '<div class="detail-other-card-img" style="background:linear-gradient(135deg,' + spColors[0] + '18,' + spColors[1] + '18)">' +
                    '<img src="' + spImg + '" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\';this.parentElement.querySelector(\'i\')&&(this.parentElement.querySelector(\'i\').style.display=\'block\')"><i class="' + spIcon + '" style="display:none"></i>' +
                '</div>' +
                '<div class="detail-other-card-body"><h4>' + sp.name + '</h4><span class="price">¥' + sp.price + '</span></div>' +
            '</div>';
        });

        var similarProducts = getProducts().filter(function(p) {
            return p.category === product.category && p.id !== product.id && p.status !== '已下架' && p.reviewStatus !== 'rejected';
        }).slice(0, 5);
        var similarHtml = '';
        similarProducts.forEach(function(sp) {
            var spIcon = categoryIcons[sp.category] || 'fas fa-box';
            var spColors = categoryColors[sp.category] || ['#3b82f6', '#1e40af'];
            var spImgArr = [];
            if (sp.images && Array.isArray(sp.images) && sp.images.length > 0) spImgArr = sp.images;
            else spImgArr = productImages[sp.id] || categoryFallbackImages[sp.category] || categoryFallbackImages['其他'];
            var spImg = spImgArr[0];
            similarHtml += '<div class="detail-similar-card" data-id="' + sp.id + '">' +
                '<div class="detail-similar-card-img" style="background:linear-gradient(135deg,' + spColors[0] + '18,' + spColors[1] + '18)">' +
                    '<img src="' + spImg + '" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'"><i class="' + spIcon + '" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center"></i>' +
                '</div>' +
                '<div class="detail-similar-card-body">' +
                    '<h4>' + sp.name + '</h4>' +
                    '<div class="similar-meta">' + sp.condition + ' · ' + sp.seller + '</div>' +
                    '<span class="price">¥' + sp.price + '<small>¥' + sp.originalPrice + '</small></span>' +
                '</div>' +
            '</div>';
        });

        var isCollected = false;
        try { var collected = JSON.parse(localStorage.getItem('campus_collected') || '[]'); isCollected = collected.some(function(c) { return (typeof c === 'object' ? c.productId : c) === product.id; }); } catch(e) {}
        var isLiked = false;
        if (window.CampusDB) { isLiked = CampusDB.isLiked(product.id); } else {
            try { var liked = JSON.parse(localStorage.getItem('campus_liked') || '[]'); isLiked = liked.indexOf(product.id) !== -1; } catch(e) {}
        }

        var sellerTotalProducts = getProducts().filter(function(p) {
            var same = p.seller === product.seller;
            if (product.sellerStuId && p.sellerStuId) same = same || p.sellerStuId === product.sellerStuId;
            return same;
        }).length;
        var sellerOnSale = getProducts().filter(function(p) {
            var same = p.seller === product.seller;
            if (product.sellerStuId && p.sellerStuId) same = same || p.sellerStuId === product.sellerStuId;
            return same && p.status === '在售';
        }).length;

        var reputationStars = '';
        var fullStars = Math.floor(seller.reputation);
        var halfStar = seller.reputation - fullStars >= 0.5;
        for (var s = 0; s < fullStars; s++) reputationStars += '<i class="fas fa-star"></i>';
        if (halfStar) reputationStars += '<i class="fas fa-star-half-alt"></i>';
        for (var e = fullStars + (halfStar ? 1 : 0); e < 5; e++) reputationStars += '<i class="far fa-star"></i>';

        var html = '<div class="detail-container">' +
            '<div class="detail-left">' +
                '<div class="detail-carousel">' +
                    '<div class="detail-carousel-track" id="carouselTrack">' + slides + '</div>' +
                    '<button class="detail-carousel-btn prev" id="carouselPrev"><i class="fas fa-chevron-left"></i></button>' +
                    '<button class="detail-carousel-btn next" id="carouselNext"><i class="fas fa-chevron-right"></i></button>' +
                    '<div class="detail-carousel-dots" id="carouselDots">' + dots + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="detail-right">' +
                (product.reviewStatus === 'pending' ? '<div class="detail-status-badge pending"><i class="fas fa-clock"></i> 审核中</div>' : (product.reviewStatus === 'rejected' ? '<div class="detail-status-badge rejected" style="background:#fef2f2;color:#ef4444;border:1px solid #fecaca"><i class="fas fa-ban"></i> 审核未通过</div>' + (product.rejectReason ? '<div style="margin-top:6px;padding:8px 12px;background:#fef2f2;border-radius:8px;font-size:13px;color:#991b1b"><i class="fas fa-comment-slash"></i> 拒绝理由：' + product.rejectReason + '</div>' : '') : '<div class="detail-status-badge ' + (isSold ? 'sold' : 'onsale') + '"><i class="fas fa-' + (isSold ? 'ban' : 'check-circle') + '"></i> ' + (isSold ? '已售出' : '在售中') + '</div>')) +
                '<div class="detail-tag-row">' + tagHtml + '</div>' +
                '<h1 class="detail-name">' + product.name + '</h1>' +
                '<div class="detail-price-row">' +
                    '<span class="detail-price-current">¥' + product.price + '</span>' +
                    '<span class="detail-price-original">¥' + product.originalPrice + '</span>' +
                    '<span class="detail-price-discount">省' + discount + '%</span>' +
                '</div>' +
                '<div class="detail-info-grid">' +
                    '<div class="detail-info-item"><i class="fas fa-star-half-alt"></i><div><div class="info-label">成色</div><div class="info-value">' + (product.condition || '未填写') + '</div></div></div>' +
                    '<div class="detail-info-item"><i class="fas fa-calendar-alt"></i><div><div class="info-label">购买时间</div><div class="info-value' + (!product.buyTime ? ' info-empty' : '') + '">' + (product.buyTime || '未填写') + '</div></div></div>' +
                    '<div class="detail-info-item"><i class="fas fa-clock"></i><div><div class="info-label">使用时长</div><div class="info-value' + (!product.useDuration ? ' info-empty' : '') + '">' + (product.useDuration || '未填写') + '</div></div></div>' +
                    '<div class="detail-info-item"><i class="fas fa-shield-alt"></i><div><div class="info-label">保修</div><div class="info-value' + (!product.warranty ? ' info-empty' : '') + '">' + (product.warranty || '无') + '</div></div></div>' +
                    '<div class="detail-info-item"><i class="fas fa-puzzle-piece"></i><div><div class="info-label">配件</div><div class="info-value' + (!product.accessories ? ' info-empty' : '') + '">' + (product.accessories || '无') + '</div></div></div>' +
                    '<div class="detail-info-item"><i class="fas fa-map-marker-alt"></i><div><div class="info-label">交易地点</div><div class="info-value' + (!product.location ? ' info-empty' : '') + '">' + (product.location || '校内') + '</div></div></div>' +
                '</div>' +
                '<div class="detail-desc-section">' +
                    '<h3><i class="fas fa-info-circle"></i> 商品详情</h3>' +
                    '<p>' + product.desc + '</p>' +
                '</div>' +
                '<div class="detail-stats-row">' +
                    '<span class="detail-stat' + (isLiked ? ' liked' : '') + '" id="likeBtn"><i class="fa' + (isLiked ? 's' : 'r') + ' fa-heart"></i> ' + (product.likes || 0) + '</span>' +
                    '<span class="detail-stat' + (isCollected ? ' collected' : '') + '" id="collectStat"><i class="fa' + (isCollected ? 's' : 'r') + ' fa-bookmark"></i> ' + (product.collects || 0) + '</span>' +
                    '<span class="detail-stat"><i class="fas fa-eye"></i> ' + (product.views || 0) + '</span>' +
                    '<span class="detail-stat"><i class="fas fa-clock"></i> ' + formatTime(product.time) + '</span>' +
                '</div>' +
                '<div class="detail-seller-card">' +
                    '<div class="detail-seller-header">' +
                        renderAvatarHtml(seller.avatar, seller.avatarUrl, 'detail-seller-avatar') +
                        '<div class="detail-seller-info">' +
                            '<div class="detail-seller-name">' + product.seller + '</div>' +
                            '<div class="detail-seller-dept"><i class="fas fa-graduation-cap"></i> ' + (product.sellerDept || seller.dept) + ' · ' + seller.grade + '</div>' +
                            '<div class="detail-seller-credit">' + reputationStars + ' ' + seller.reputation + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="detail-seller-extra">' +
                        '<div class="detail-seller-extra-item"><i class="fas fa-phone"></i> <span>' + (product.sellerPhone || seller.phone) + '</span></div>' +
                        '<div class="detail-seller-extra-item"><i class="fab fa-weixin"></i> <span>' + seller.wechat + '</span></div>' +
                        '<div class="detail-seller-extra-item"><i class="fas fa-calendar-check"></i> 入驻 <span>' + seller.joinDate + '</span></div>' +
                        '<div class="detail-seller-extra-item"><i class="fas fa-shopping-bag"></i> 在售 <span>' + (seller.onSale !== undefined ? seller.onSale : sellerOnSale) + '件</span></div>' +
                    '</div>' +
                    '<div class="detail-seller-stats">' +
                        '<div class="detail-seller-stat"><span class="num">' + (seller.totalProducts !== undefined ? seller.totalProducts : sellerTotalProducts) + '</span><span class="label">发布商品</span></div>' +
                        '<div class="detail-seller-stat"><span class="num">' + seller.trades + '</span><span class="label">成功交易</span></div>' +
                        '<div class="detail-seller-stat"><span class="num">' + seller.praiseRate + '</span><span class="label">好评率</span></div>' +
                    '</div>' +
                    '<div class="detail-seller-contact">' +
                        '<button id="chatSellerBtn"><i class="fas fa-comment-dots"></i> 私信沟通</button>' +
                        '<button id="callSeller"><i class="fas fa-phone"></i> 一键联系</button>' +
                    '</div>' +
                '</div>' +
                '<div class="detail-actions">' +
                    '<button class="btn-buy' + (isSold ? ' disabled' : '') + '" id="buyBtn"><i class="fas fa-shopping-cart"></i> ' + (isSold ? '已售出' : '立即购买') + '</button>' +
                    '<button class="btn-collect' + (isCollected ? ' collected' : '') + '" id="collectBtn"><i class="fa' + (isCollected ? 's' : 'r') + ' fa-bookmark"></i> ' + (isCollected ? '已收藏' : '收藏') + '</button>' +
                    '<button class="btn-cart" id="chatBtn"><i class="fas fa-comment-dots"></i> 私信</button>' +
                    '<button class="btn-report" id="reportBtn"><i class="fas fa-flag"></i> 举报</button>' +
                    getDeleteBtnHtml(product) +
                '</div>' +
            '</div>' +
            '<div class="detail-section">' +
                '<div class="detail-section-header">' +
                    '<h3><i class="fas fa-comments"></i> 评论&留言 <span class="count" id="commentCount">' + comments.length + '条留言</span></h3>' +
                '</div>' +
                '<div class="detail-comments-list" id="commentsList">' + commentsHtml + '</div>' +
                '<div class="detail-comment-input">' +
                    '<input type="text" id="commentInput" placeholder="留言咨询卖家，按回车发送...">' +
                    '<button id="commentSubmit"><i class="fas fa-paper-plane"></i> 发送</button>' +
                '</div>' +
            '</div>' +
            (sellerProducts.length > 0 ?
            '<div class="detail-section">' +
                '<div class="detail-section-header">' +
                    '<h3><i class="fas fa-store"></i> 卖家其他在售商品</h3>' +
                '</div>' +
                '<div class="detail-other-products">' +
                    '<div class="detail-other-grid">' + otherHtml + '</div>' +
                '</div>' +
            '</div>' : '') +
            (similarProducts.length > 0 ?
            '<div class="detail-similar-section">' +
                '<div class="detail-section-header">' +
                    '<h3><i class="fas fa-th-large"></i> 相似推荐</h3>' +
                '</div>' +
                '<div class="detail-similar-grid">' + similarHtml + '</div>' +
            '</div>' : '') +
        '</div>';

        document.getElementById('detailMain').innerHTML = html;
        incrementViews(product);
        bindEvents(product);
    }

    function bindEvents(product) {
        var slides = document.querySelectorAll('.detail-carousel-slide');
        var dots = document.querySelectorAll('.detail-carousel-dot');
        var totalSlides = slides.length;

        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;
            slides.forEach(function(s, i) { s.classList.toggle('active', i === currentSlide); });
            dots.forEach(function(d, i) { d.classList.toggle('active', i === currentSlide); });
        }

        var prevBtn = document.getElementById('carouselPrev');
        var nextBtn = document.getElementById('carouselNext');
        if (prevBtn) prevBtn.addEventListener('click', function() { goToSlide(currentSlide - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function() { goToSlide(currentSlide + 1); });
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() { goToSlide(parseInt(this.dataset.index)); });
        });

        var autoTimer = setInterval(function() { goToSlide(currentSlide + 1); }, 4000);
        var carouselTrack = document.getElementById('carouselTrack');
        if (carouselTrack) {
            carouselTrack.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
            carouselTrack.addEventListener('mouseleave', function() { autoTimer = setInterval(function() { goToSlide(currentSlide + 1); }, 4000); });
        }

        var likeBtn = document.getElementById('likeBtn');
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                var liked = [];
                if (window.CampusDB) { liked = CampusDB.getLiked(); } else {
                    try { liked = JSON.parse(localStorage.getItem('campus_liked') || '[]'); } catch(e) {}
                }
                var products = getProducts();
                var idx = products.findIndex(function(p) { return p.id === product.id; });
                var isLiked = liked.indexOf(product.id) !== -1;
                if (isLiked) {
                    liked = liked.filter(function(id) { return id !== product.id; });
                    if (idx !== -1) products[idx].likes = Math.max(0, (products[idx].likes || 0) - 1);
                    this.classList.remove('liked');
                    this.innerHTML = '<i class="far fa-heart"></i> ' + (products[idx].likes || 0);
                    showToast('已取消点赞');
                } else {
                    liked.push(product.id);
                    if (idx !== -1) products[idx].likes = (products[idx].likes || 0) + 1;
                    this.classList.add('liked');
                    this.innerHTML = '<i class="fas fa-heart"></i> ' + (products[idx].likes || 0);
                    showToast('已点赞');
                }
                if (window.CampusDB) { CampusDB.saveLiked(liked); } else { localStorage.setItem('campus_liked', JSON.stringify(liked)); }
                saveProducts(products);
            });
        }

        var collectBtn = document.getElementById('collectBtn');
        var collectStat = document.getElementById('collectStat');
        function toggleCollect() {
            /* 登录校验 */
            var user = getCurrentUser();
            if (!user) {
                showToast('请先登录后再收藏');
                setTimeout(function() { window.location.href = 'login.html'; }, 1200);
                return;
            }
            var collected = [];
            try { collected = JSON.parse(localStorage.getItem('campus_collected') || '[]'); } catch(e) {}
            var products = getProducts();
            var idx = products.findIndex(function(p) { return p.id === product.id; });
            var isCollected = collected.some(function(c) { return (typeof c === 'object' ? c.productId : c) === product.id; });
            if (isCollected) {
                collected = collected.filter(function(c) { return (typeof c === 'object' ? c.productId : c) !== product.id; });
                if (idx !== -1) products[idx].collects = Math.max(0, (products[idx].collects || 0) - 1);
                if (collectBtn) { collectBtn.classList.remove('collected'); collectBtn.innerHTML = '<i class="far fa-bookmark"></i> 收藏'; }
                if (collectStat) { collectStat.classList.remove('collected'); collectStat.innerHTML = '<i class="far fa-bookmark"></i> ' + (products[idx] ? products[idx].collects : 0); }
                showToast('已取消收藏');
            } else {
                var productImage = getProductImage(product);
                collected.unshift({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    condition: product.condition,
                    seller: product.seller,
                    sellerDept: product.sellerDept || '',
                    img: productImage,
                    time: new Date().toLocaleString()
                });
                if (idx !== -1) products[idx].collects = (products[idx].collects || 0) + 1;
                if (collectBtn) { collectBtn.classList.add('collected'); collectBtn.innerHTML = '<i class="fas fa-bookmark"></i> 已收藏'; }
                if (collectStat) { collectStat.classList.add('collected'); collectStat.innerHTML = '<i class="fas fa-bookmark"></i> ' + (products[idx] ? products[idx].collects : 0); }
                showToast('已收藏');
            }
            localStorage.setItem('campus_collected', JSON.stringify(collected));
            saveProducts(products);
        }
        /* 事件委托兜底：确保收藏按钮始终可点击 */
        var _collectBound = false;
        if (collectBtn) { collectBtn.addEventListener('click', toggleCollect); _collectBound = true; }
        if (collectStat) { collectStat.addEventListener('click', toggleCollect); _collectBound = true; }
        if (!_collectBound) {
            document.addEventListener('click', function(e) {
                if (e.target.closest('#collectBtn, #collectStat')) toggleCollect();
            });
        }

        var buyBtn = document.getElementById('buyBtn');
        if (buyBtn) {
            buyBtn.addEventListener('click', function() {
                if (product.status === '已售出') { showToast('该商品已售出'); return; }
                var user = getCurrentUser();
                if (!user) { showToast('请先登录后再购买'); setTimeout(function() { window.location.href = 'login.html'; }, 1200); return; }
                showBuyModal(product);
            });
        }

        /* 购买弹窗 */
        function showBuyModal(product) {
            var existing = document.getElementById('detailBuyModal');
            if (existing) existing.remove();

            var modal = document.createElement('div');
            modal.id = 'detailBuyModal';
            modal.className = 'sh-modal active';
            modal.innerHTML =
                '<div class="sh-modal-content" style="max-width:480px">' +
                    '<div class="sh-modal-header"><h3><i class="fas fa-shopping-cart"></i> 立即购买 - ' + product.name + '</h3><button class="sh-close-btn" id="closeDetailBuy"><i class="fas fa-times"></i></button></div>' +
                    '<form id="detailBuyForm" class="sh-form">' +
                        '<div class="sh-form-group"><label><i class="fas fa-box"></i> 商品</label><div style="padding:8px 12px;background:var(--bg-secondary);border-radius:8px;font-size:14px">' + product.name + ' · ¥' + product.price + '</div></div>' +
                        '<div class="sh-form-group"><label><i class="fas fa-building"></i> 收货楼栋</label><select id="detailBuyBuilding" required><option value="">请选择收货楼栋</option><option value="北区1号楼">北区1号楼</option><option value="北区2号楼">北区2号楼</option><option value="北区3号楼">北区3号楼</option><option value="南区1号楼">南区1号楼</option><option value="南区2号楼">南区2号楼</option><option value="东区1号楼">东区1号楼</option><option value="西区1号楼">西区1号楼</option></select></div>' +
                        '<div class="sh-form-group"><label><i class="fas fa-comment"></i> 备注</label><textarea id="detailBuyNote" placeholder="选填，如特殊配送要求等" rows="3"></textarea></div>' +
                        '<button type="submit" class="btn primary-btn sh-submit-btn"><i class="fas fa-check"></i> 提交购买订单</button>' +
                    '</form>' +
                '</div>';
            document.body.appendChild(modal);

            document.getElementById('closeDetailBuy').addEventListener('click', function() { modal.remove(); });
            modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

            document.getElementById('detailBuyForm').addEventListener('submit', function(e) {
                e.preventDefault();
                var building = document.getElementById('detailBuyBuilding').value;
                var note = document.getElementById('detailBuyNote').value;
                if (!building) { showToast('请填写完整购买信息'); return; }

                var user = getCurrentUser();
                var now = new Date();

                var orders = [];
                try { orders = JSON.parse(localStorage.getItem('campus_trade_orders') || '[]'); } catch(e) {}

                orders.unshift({
                    id: Date.now(),
                    productId: product.id,
                    productName: product.name,
                    productImg: getProductImage(product),
                    price: product.price,
                    totalPrice: product.price,
                    building: building,
                    note: note,
                    seller: product.seller,
                    sellerDept: product.sellerDept || '',
                    buyer: user ? user.name : '',
                    buyerStuId: user ? user.stuId : '',
                    status: '待确认',
                    time: now.toLocaleString()
                });

                localStorage.setItem('campus_trade_orders', JSON.stringify(orders));
                modal.remove();
                showToast('购买订单提交成功！');
                setTimeout(function() { window.location.href = 'orders.html'; }, 1200);
            });
        }

        var chatBtn = document.getElementById('chatBtn');
        if (chatBtn) {
            chatBtn.addEventListener('click', function() {
                var user = getCurrentUser();
                if (!user) {
                    showToast('请先登录后再私信卖家');
                    setTimeout(function() { window.location.href = 'login.html'; }, 1200);
                    return;
                }
                window.location.href = 'chat.html?to=' + encodeURIComponent(product.seller) + '&productId=' + product.id + '&productName=' + encodeURIComponent(product.name);
            });
        }

        var chatSellerBtn = document.getElementById('chatSellerBtn');
        if (chatSellerBtn) {
            if (isSold) {
                chatSellerBtn.disabled = true;
                chatSellerBtn.style.opacity = '0.5';
                chatSellerBtn.style.cursor = 'not-allowed';
                chatSellerBtn.innerHTML = '<i class="fas fa-ban"></i> 已售出，无法沟通';
            } else {
                chatSellerBtn.addEventListener('click', function() {
                    var user = getCurrentUser();
                    if (!user) {
                        showToast('请先登录后再私信卖家');
                        setTimeout(function() { window.location.href = 'login.html'; }, 1200);
                        return;
                    }
                    window.location.href = 'chat.html?to=' + encodeURIComponent(product.seller) + '&productId=' + product.id + '&productName=' + encodeURIComponent(product.name);
                });
            }
        }

        var callSeller = document.getElementById('callSeller');
        if (callSeller) {
            callSeller.addEventListener('click', function() {
                var seller = getSellerProfile(product.seller);
                showToast('卖家联系方式：' + seller.phone);
            });
        }

        var reportBtn = document.getElementById('reportBtn');
        if (reportBtn) {
            reportBtn.addEventListener('click', function() {
                showToast('举报已提交，管理员将尽快处理');
            });
        }

        var deleteProductBtn = document.getElementById('deleteProductBtn');
        if (deleteProductBtn) {
            deleteProductBtn.addEventListener('click', function() {
                if (!confirm('确定要删除该商品吗？删除后商品将下架且无法恢复！')) return;
                var products = getProducts();
                var idx = products.findIndex(function(p) { return p.id === product.id; });
                if (idx !== -1) {
                    products[idx].status = '已下架';
                    products[idx].reviewStatus = 'rejected';
                    saveProducts(products);
                    showToast('商品已删除');
                    setTimeout(function() { window.location.href = 'secondhand.html'; }, 1000);
                }
            });
        }

        var commentInput = document.getElementById('commentInput');
        var commentSubmit = document.getElementById('commentSubmit');

        function submitComment() {
            var text = commentInput.value.trim();
            if (!text) { showToast('请输入留言内容'); return; }
            var products = getProducts();
            var idx = products.findIndex(function(p) { return p.id === product.id; });
            if (idx === -1) return;
            if (!products[idx].comments) products[idx].comments = [];
            var now = new Date();
            var timeStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
            var currentUser = getCurrentUser();
            var commentAvatarUrl = currentUser && currentUser.stuId ? getUserAvatarUrl(currentUser.stuId) : null;
            var comment = {
                name: currentUser ? currentUser.name : '我',
                avatar: currentUser ? currentUser.name.charAt(0) : '我',
                text: text,
                time: timeStr,
                isSeller: false,
                stuId: currentUser ? currentUser.stuId : null
            };
            products[idx].comments.push(comment);
            saveProducts(products);

            var commentsList = document.getElementById('commentsList');
            var emptyEl = commentsList.querySelector('.detail-empty-comments');
            if (emptyEl) emptyEl.remove();

            var itemHtml = '<div class="detail-comment-item" style="animation:fadeIn 0.3s">' +
                renderAvatarHtml(comment.avatar, commentAvatarUrl, 'detail-comment-avatar') +
                '<div class="detail-comment-body">' +
                    '<div class="detail-comment-name">' + comment.name + '</div>' +
                    '<div class="detail-comment-text">' + comment.text + '</div>' +
                    '<div class="detail-comment-time">' + comment.time + '</div>' +
                '</div>' +
            '</div>';
            commentsList.insertAdjacentHTML('beforeend', itemHtml);

            var countEl = document.getElementById('commentCount');
            if (countEl) countEl.textContent = products[idx].comments.length + '条留言';

            commentInput.value = '';
            showToast('留言成功');
        }

        if (commentSubmit) commentSubmit.addEventListener('click', submitComment);
        if (commentInput) commentInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') submitComment(); });

        document.querySelectorAll('.detail-other-card, .detail-similar-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = this.dataset.id;
                if (id) window.location.href = 'detail.html?id=' + id;
            });
        });
    }

    var productId = getProductId();
    if (productId) {
        var product = getProduct(productId);
        renderDetail(product);
    } else {
        document.getElementById('detailMain').innerHTML = '<div class="detail-not-found"><i class="fas fa-box-open"></i><h2>商品不存在</h2><p>请从二手市场页面选择商品</p><a href="secondhand.html"><i class="fas fa-arrow-left"></i> 返回二手市场</a></div>';
    }
});
