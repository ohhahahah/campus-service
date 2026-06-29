(function(window) {
    var DB_VERSION = '7.0';
    var DB_INIT_KEY = 'campus_db_initialized_v7';

    var tables = {
        students: 'campus_students',
        currentUser: 'campus_current_user',
        secondhand: 'campus_secondhand',
        chat: 'campus_chat',
        rentalBooks: 'campus_rental_books_v2',
        rentalCollected: 'campus_rental_collected',
        avatars: 'campus_avatars',
        bookings: 'campus_bookings',
        repairs: 'campus_repairs',
        announcements: 'campus_announcements',
        collected: 'campus_collected',
        liked: 'campus_liked',
        cart: 'campus_cart',
        sensitiveWords: 'campus_sensitive_words',
        blockLog: 'campus_block_log',
        visitCount: 'campus_visit_count',
        pets: 'campus_pets',
        announcementRead: 'campus_announcement_read',
        merchants: 'campus_merchants',
        merchantOrders: 'campus_merchant_orders'
    };

    function _get(key, defaultVal) {
        try {
            var val = localStorage.getItem(key);
            return val !== null ? JSON.parse(val) : defaultVal;
        } catch(e) {
            return defaultVal;
        }
    }

    function _set(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
            return true;
        } catch(e) {
            console.warn('[MCP-DB] Storage write failed:', key, e.message);
            return false;
        }
    }

    function _remove(key) {
        try { localStorage.removeItem(key); } catch(e) {}
    }

    var defaultStudents = [
        { stuId: '2024001', name: '张三', password: '123456', dept: '计算机学院', phone: '13800138001', grade: '2024级', reputation: '良好', regTime: '2026-03-01T08:00:00.000Z', status: 'approved' },
        { stuId: '2024002', name: '李四', password: '123456', dept: '电子信息学院', phone: '13800138002', grade: '2024级', reputation: '优秀', regTime: '2026-03-02T09:00:00.000Z', status: 'approved' },
        { stuId: '2024003', name: '王五', password: '123456', dept: '经济管理学院', phone: '13800138003', grade: '2023级', reputation: '良好', regTime: '2026-02-15T10:00:00.000Z', status: 'approved' },
        { stuId: '2024004', name: '赵六', password: '123456', dept: '艺术设计学院', phone: '13800138004', grade: '2024级', reputation: '一般', regTime: '2026-03-05T11:00:00.000Z', status: 'approved' },
        { stuId: '2024005', name: '孙七', password: '123456', dept: '机械工程学院', phone: '13800138005', grade: '2023级', reputation: '良好', regTime: '2026-02-20T14:00:00.000Z', status: 'approved' },
        { stuId: '2024006', name: '周违规', password: '123456', dept: '法学院', phone: '13800138006', grade: '2024级', reputation: '较差', regTime: '2026-04-10T09:00:00.000Z', status: 'banned', banExpiry: '2026-07-10T00:00:00.000Z', banReason: '发布违规内容：赌博、代开发票', banTime: '2026-06-01T14:30:00.000Z' },
        { stuId: '2024007', name: '吴永久', password: '123456', dept: '外国语学院', phone: '13800138007', grade: '2023级', reputation: '差', regTime: '2026-01-15T10:00:00.000Z', status: 'banned', banExpiry: 'permanent', banReason: '多次发布严重违规内容', banTime: '2026-05-20T16:00:00.000Z' },
        { stuId: '2024008', name: '郑待审', password: '123456', dept: '数学与统计学院', phone: '13800138008', grade: '2024级', reputation: '良好', regTime: '2026-06-20T08:00:00.000Z', status: 'pending' }
    ];

    var defaultSecondhand = [
        { id: 1, name: 'MacBook Pro 2023 M2', category: '数码', price: 8999, originalPrice: 12999, condition: '95新', desc: '自用MacBook Pro，M2芯片，16G+512G，电池循环仅28次，屏幕完美无划痕。原装充电器齐全，可当面验机。', seller: '技术宅', sellerDept: '计算机学院', sellerPhone: '138****5678', views: 234, likes: 67, collects: 28, location: '东区宿舍', time: '1小时前', status: '在售', buyTime: '2023年9月', useDuration: '8个月', warranty: '在保', accessories: '原装充电器、包装盒', tag: 'hot', comments: [], reviewStatus: 'approved' },
        { id: 2, name: 'iPad Air 5 64G', category: '数码', price: 2800, originalPrice: 4799, condition: '9成新', desc: 'iPad Air 5代，64G WiFi版，配Apple Pencil，无磕碰，屏幕贴膜使用。适合考研、记笔记。', seller: '考研党', sellerDept: '文学与传媒学院', sellerPhone: '137****1234', views: 156, likes: 45, collects: 19, location: '南区宿舍', time: '3小时前', status: '在售', buyTime: '2023年3月', useDuration: '1年', warranty: '无', accessories: 'Apple Pencil、保护壳', tag: 'rec', comments: [], reviewStatus: 'approved' },
        { id: 3, name: '考研英语全套资料', category: '书籍', price: 50, originalPrice: 200, condition: '有笔记', desc: '考研英语全套复习资料，含真题、模拟题、词汇书。已上岸，资料上有重点标注和笔记。', seller: '已上岸', sellerDept: '外国语学院', sellerPhone: '136****5678', views: 312, likes: 89, collects: 45, location: '图书馆', time: '5小时前', status: '在售', buyTime: '2024年3月', useDuration: '1年', warranty: '无', accessories: '无', tag: 'hot', comments: [], reviewStatus: 'approved' },
        { id: 4, name: '索尼WH-1000XM5耳机', category: '数码', price: 1599, originalPrice: 2999, condition: '95新', desc: '索尼旗舰降噪耳机，黑色，降噪效果一流。配件齐全，可试听。', seller: '音乐人', sellerDept: '艺术设计学院', sellerPhone: '135****9012', views: 198, likes: 56, collects: 23, location: '北区宿舍', time: '1天前', status: '在售', buyTime: '2023年6月', useDuration: '1年', warranty: '在保', accessories: '原装收纳盒、充电线、飞机转接头', tag: 'new', comments: [], reviewStatus: 'approved' },
        { id: 5, name: '小米台灯Pro', category: '生活用品', price: 60, originalPrice: 179, condition: '9成新', desc: '小米智能台灯Pro，支持小爱同学控制，色温亮度可调，护眼模式。', seller: '小米粉', sellerDept: '物理与电子学院', sellerPhone: '134****3456', views: 89, likes: 23, collects: 8, location: '西区宿舍', time: '1天前', status: '在售', buyTime: '2023年9月', useDuration: '半年', warranty: '无', accessories: '电源适配器', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 6, name: '高等数学教材上下册', category: '书籍', price: 30, originalPrice: 68, condition: '9成新', desc: '同济大学第七版，无笔记，保存完好，理工科必备。', seller: '学长', sellerDept: '数学与统计学院', sellerPhone: '134****2345', views: 45, likes: 8, collects: 3, location: '教学楼', time: '2天前', status: '在售', buyTime: '2022年9月', useDuration: '1学年', warranty: '无', accessories: '无', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 7, name: '机械键盘RGB青轴', category: '数码', price: 399, originalPrice: 699, condition: '95新', desc: '青轴，全键无冲，支持自定义灯效，带手托，打字手感清脆。', seller: '游戏玩家', sellerDept: '计算机学院', sellerPhone: '133****6789', views: 189, likes: 56, collects: 20, location: '西区宿舍', time: '2天前', status: '在售', buyTime: '2023年6月', useDuration: '1年', warranty: '在保', accessories: '手托、拔键器、原装线', tag: 'hot', comments: [], reviewStatus: 'approved' },
        { id: 8, name: '山地自行车21速', category: '运动', price: 680, originalPrice: 1500, condition: '8成新', desc: '21速碟刹，适合校园通勤，已保养，骑行顺畅。', seller: '大四学长', sellerDept: '机械工程学院', sellerPhone: '132****0123', views: 389, likes: 89, collects: 35, location: '校门口', time: '3天前', status: '在售', buyTime: '2022年9月', useDuration: '2年', warranty: '无', accessories: '车锁、车灯、挡泥板', tag: 'new', comments: [], reviewStatus: 'approved' },
        { id: 9, name: 'iPhone 14 Pro 256G', category: '数码', price: 5999, originalPrice: 8999, condition: '99新', desc: '256GB深空黑，国行正品，电池100%，换新机转让。', seller: '换新机', sellerDept: '艺术设计学院', sellerPhone: '131****4567', views: 567, likes: 234, collects: 89, location: '北区宿舍', time: '3天前', status: '在售', buyTime: '2023年9月', useDuration: '8个月', warranty: '在保', accessories: '原装充电线、包装盒、手机壳', tag: 'hot', comments: [], reviewStatus: 'approved' },
        { id: 10, name: '膳魔师保温杯500ml', category: '生活用品', price: 45, originalPrice: 199, condition: '9成新', desc: '膳魔师保温杯，500ml，保温效果好，无异味。', seller: '闲置转让', sellerDept: '法学院', sellerPhone: '130****8901', views: 78, likes: 15, collects: 6, location: '食堂门口', time: '4天前', status: '在售', buyTime: '2023年3月', useDuration: '1年', warranty: '无', accessories: '杯套', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 11, name: '斯伯丁篮球', category: '运动', price: 120, originalPrice: 259, condition: '8成新', desc: '室外用球，手感好，适合日常运动，气嘴无漏气。', seller: '体育生', sellerDept: '体育学院', sellerPhone: '129****2345', views: 234, likes: 45, collects: 18, location: '操场', time: '4天前', status: '在售', buyTime: '2023年5月', useDuration: '1年', warranty: '无', accessories: '打气筒', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 12, name: 'C语言程序设计谭浩强', category: '书籍', price: 25, originalPrice: 49, condition: '9成新', desc: '经典教材，无笔记，适合计算机专业入门学习。', seller: '计算机系', sellerDept: '计算机学院', sellerPhone: '128****6789', views: 112, likes: 28, collects: 10, location: '教学楼', time: '5天前', status: '在售', buyTime: '2023年9月', useDuration: '1学期', warranty: '无', accessories: '无', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 13, name: '电烙铁焊接套装', category: '实训工具', price: 35, originalPrice: 89, condition: '9成新', desc: '含焊锡丝、吸锡器等配件，适合电子实训使用。', seller: '电子系学长', sellerDept: '电子信息学院', sellerPhone: '127****0123', views: 56, likes: 12, collects: 4, location: '实训楼', time: '5天前', status: '在售', buyTime: '2023年9月', useDuration: '1学期', warranty: '无', accessories: '焊锡丝、吸锡器、松香', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 14, name: '戴森吹风机', category: '小家电', price: 899, originalPrice: 3190, condition: '95新', desc: '国行正品，带原装配件，使用半年，风力强劲。', seller: '学姐', sellerDept: '文学与传媒学院', sellerPhone: '126****4567', views: 345, likes: 89, collects: 45, location: '南区宿舍', time: '6天前', status: '在售', buyTime: '2023年10月', useDuration: '半年', warranty: '在保', accessories: '原装风嘴3个、收纳袋', tag: 'rec', comments: [], reviewStatus: 'approved' },
        { id: 15, name: '床上书桌折叠款', category: '生活用品', price: 40, originalPrice: 99, condition: '8成新', desc: '折叠床上书桌，可调节角度，毕业转让。', seller: '毕业生', sellerDept: '经济管理学院', sellerPhone: '125****8901', views: 98, likes: 23, collects: 9, location: '北区宿舍', time: '6天前', status: '在售', buyTime: '2023年3月', useDuration: '1年', warranty: '无', accessories: '无', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 16, name: '万用表数字式', category: '实训工具', price: 55, originalPrice: 128, condition: '9成新', desc: '优利德数字万用表，功能完好，适合电工实训。', seller: '电气系', sellerDept: '电子信息学院', sellerPhone: '124****2345', views: 67, likes: 15, collects: 5, location: '实训楼', time: '1周前', status: '在售', buyTime: '2023年9月', useDuration: '1学期', warranty: '在保', accessories: '表笔、电池', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 17, name: '小米电风扇', category: '小家电', price: 50, originalPrice: 149, condition: '9成新', desc: '直流变频，静音运行，4档风力可调，夏日必备。', seller: '毕业转让', sellerDept: '数学与统计学院', sellerPhone: '123****6789', views: 134, likes: 34, collects: 14, location: '东区宿舍', time: '1周前', status: '在售', buyTime: '2023年5月', useDuration: '1年', warranty: '无', accessories: '电源线', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 18, name: '瑜伽垫加厚款', category: '运动', price: 35, originalPrice: 89, condition: '9成新', desc: '加厚10mm，防滑，带收纳袋，适合健身瑜伽。', seller: '健身达人', sellerDept: '体育学院', sellerPhone: '122****0123', views: 45, likes: 8, collects: 3, location: '体育馆', time: '1周前', status: '在售', buyTime: '2023年9月', useDuration: '半年', warranty: '无', accessories: '收纳袋', tag: '', comments: [], reviewStatus: 'approved' },
        { id: 19, name: '罗技G502有线鼠标', category: '数码', price: 199, originalPrice: 399, condition: '9成新', desc: '罗技G502游戏鼠标，11个可编程按键，配重可调，使用半年。', seller: '电竞选手', sellerDept: '计算机学院', sellerPhone: '138****9900', views: 78, likes: 22, collects: 9, location: '西区宿舍', time: '2小时前', status: '在售', buyTime: '2025年12月', useDuration: '半年', warranty: '在保', accessories: '原装配重、说明书', tag: 'new', comments: [], reviewStatus: 'pending' },
        { id: 20, name: '四六级真题合集', category: '书籍', price: 20, originalPrice: 80, condition: '有笔记', desc: '近五年四六级真题，含听力光盘，已过级转让。', seller: '过级达人', sellerDept: '外国语学院', sellerPhone: '137****8800', views: 56, likes: 15, collects: 7, location: '南区宿舍', time: '5小时前', status: '在售', buyTime: '2025年9月', useDuration: '1学期', warranty: '无', accessories: '听力光盘', tag: '', comments: [], reviewStatus: 'pending' }
    ];

    var defaultRentalBooks = [
        { id: 1, name: '高等数学（同济第七版）上册', price: 15, period: '1学期', condition: '少量笔记', desc: '适用理工科专业，含部分课堂笔记，重点公式已标注，期末复习利器。书脊完好，无缺页。', seller: '数学系学长', sellerDept: '数学与统计学院', available: true, version: '第七版', major: '理工科通用', notes: '少量笔记', deposit: 30, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 89, likes: 23, collects: 8, time: '2天前', images: [], reviews: [{name:'李同学',text:'笔记很有用，期末靠这个复习的',time:'1天前'},{name:'王同学',text:'书保存得很好，推荐租借',time:'3天前'}] },
        { id: 2, name: '大学物理（第四版）', price: 12, period: '1学期', condition: '几乎全新', desc: '适用物理、工科专业，保存完好，无笔记无划线，如新书一般。', seller: '物理系学姐', sellerDept: '物理与电子学院', available: true, version: '第四版', major: '物理/工科专业', notes: '无笔记', deposit: 25, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 56, likes: 12, collects: 5, time: '3天前', images: [], reviews: [] },
        { id: 3, name: '线性代数及其应用', price: 10, period: '1学期', condition: '有笔记标注', desc: '含详细课堂笔记，期末复习利器，重点题型已标注答案。', seller: '数学系同学', sellerDept: '数学与统计学院', available: true, version: '第五版', major: '理工科通用', notes: '详细笔记', deposit: 20, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 67, likes: 18, collects: 7, time: '4天前', images: [], reviews: [{name:'张同学',text:'笔记非常详细，省了自己做笔记的时间',time:'2天前'}] },
        { id: 4, name: 'C++ Primer Plus 第6版', price: 20, period: '1学年', condition: '几乎全新', desc: '计算机专业经典教材，含课后习题答案，代码示例丰富。', seller: '计算机系学长', sellerDept: '计算机学院', available: true, version: '第6版', major: '计算机/软件工程', notes: '无笔记', deposit: 40, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 134, likes: 45, collects: 20, time: '1天前', images: [], reviews: [] },
        { id: 5, name: '微观经济学（曼昆）', price: 18, period: '1学期', condition: '少量笔记', desc: '经管专业核心教材，重点标注清晰，含历年考题分析。', seller: '经济系学姐', sellerDept: '经济管理学院', available: false, version: '第七版', major: '经管专业', notes: '少量笔记', deposit: 35, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 98, likes: 34, collects: 15, time: '5天前', images: [], reviews: [{name:'赵同学',text:'重点标注很清晰，考试很有帮助',time:'4天前'}] },
        { id: 6, name: '数据结构与算法分析', price: 22, period: '1学年', condition: '少量笔记', desc: '计算机专业必修，含代码示例和算法图解，考研必备。', seller: '软件工程学长', sellerDept: '计算机学院', available: true, version: '第二版', major: '计算机/软件工程', notes: '少量笔记', deposit: 45, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 112, likes: 38, collects: 16, time: '2天前', images: [], reviews: [] }
    ];

    var defaultBookings = [
        { id: 'b1', venueId: 'v1', venueName: '图书馆一楼自习室', type: 'library', date: '2026-05-22', timeSlot: '14:00-16:00', purpose: '自习', people: 1, status: 'confirmed', note: '' },
        { id: 'b2', venueId: 'v9', venueName: '室内篮球馆', type: 'stadium', date: '2026-05-23', timeSlot: '16:00-18:00', purpose: '体育锻炼', people: 10, status: 'pending', note: '班级篮球赛' },
        { id: 'b3', venueId: 'v6', venueName: '多功能会议室', type: 'activity', date: '2026-05-24', timeSlot: '10:00-12:00', purpose: '社团活动', people: 25, status: 'confirmed', note: '编程社团技术分享' }
    ];

    var defaultRepairs = [
        { id: 'REP202605001', type: 'water', typeName: '水电维修', title: '宿舍水龙头漏水', area: '宿舍区', location: '学生公寓2号楼302室', desc: '洗手台水龙头持续滴水，无法完全关闭', contact: '张同学', phone: '138****1234', urgency: 'urgent', urgencyName: '紧急', status: 'processing', time: '2026-05-18 09:30', worker: '李师傅', workerPhone: '139****5678' },
        { id: 'REP202605002', type: 'network', typeName: '网络故障', title: '宿舍WiFi无法连接', area: '宿舍区', location: '学生公寓5号楼418室', desc: '校园WiFi信号满格但无法上网，已持续2天', contact: '王同学', phone: '137****2345', urgency: 'normal', urgencyName: '一般', status: 'pending', time: '2026-05-19 14:20', worker: '', workerPhone: '' },
        { id: 'REP202605003', type: 'electric', typeName: '电器维修', title: '教室空调不制冷', area: '教学区', location: '教学楼A栋305教室', desc: '空调开启后只出风不制冷，室温无法降低', contact: '刘老师', phone: '136****3456', urgency: 'urgent', urgencyName: '紧急', status: 'completed', time: '2026-05-15 10:00', worker: '赵师傅', workerPhone: '135****6789', rating: 5, evalTags: ['响应迅速', '维修专业'], evalComment: '维修师傅很专业，半小时就修好了！' },
        { id: 'REP202605004', type: 'furniture', typeName: '家具维修', title: '宿舍书桌抽屉损坏', area: '宿舍区', location: '学生公寓3号楼215室', desc: '书桌第二个抽屉滑轨脱落，无法正常开关', contact: '陈同学', phone: '135****4567', urgency: 'normal', urgencyName: '一般', status: 'completed', time: '2026-05-12 16:45', worker: '孙师傅', workerPhone: '134****7890', rating: 4, evalTags: ['态度友好'], evalComment: '师傅态度很好，修得也不错' },
        { id: 'REP202605005', type: 'door', typeName: '门窗维修', title: '宿舍窗户关不严', area: '宿舍区', location: '学生公寓1号楼523室', desc: '窗户合页松动，关不严，下雨会漏水', contact: '赵同学', phone: '133****5678', urgency: 'normal', urgencyName: '一般', status: 'processing', time: '2026-05-17 08:15', worker: '周师傅', workerPhone: '132****8901' },
        { id: 'REP202605006', type: 'water', typeName: '水电维修', title: '教学楼走廊灯不亮', area: '教学区', location: '教学楼B栋3楼走廊', desc: '走廊3盏灯不亮，晚上通行不便', contact: '教务处', phone: '131****6789', urgency: 'urgent', urgencyName: '紧急', status: 'completed', time: '2026-05-10 11:30', worker: '李师傅', workerPhone: '139****5678', rating: 5, evalTags: ['响应迅速', '一次修好'], evalComment: '当天就修好了，效率很高！' },
        { id: 'REP202605007', type: 'other', typeName: '其他报修', title: '食堂桌椅松动', area: '食堂', location: '第二食堂一楼就餐区', desc: '多张餐桌椅脚松动，存在安全隐患', contact: '后勤处', phone: '130****7890', urgency: 'normal', urgencyName: '一般', status: 'pending', time: '2026-05-20 09:00', worker: '', workerPhone: '' },
        { id: 'REP202605008', type: 'network', typeName: '网络故障', title: '图书馆网络中断', area: '图书馆', location: '图书馆2楼电子阅览室', desc: '电子阅览室全部电脑无法联网', contact: '图书馆', phone: '129****8901', urgency: 'critical', urgencyName: '非常紧急', status: 'processing', time: '2026-05-20 08:30', worker: '网络中心', workerPhone: '128****9012' }
    ];

    var defaultAnnouncements = [
        { id: 'a1', title: '关于2026年春季学期开学注册的通知', content: '各位同学，2026年春季学期将于2月24日正式开学，请同学们按时返校注册。', author: '教务处', time: '2026-02-15', type: 'important', cat: '教务通知', pinned: true, version: 1 },
        { id: 'a2', title: '图书馆开放时间调整通知', content: '因装修需要，图书馆3楼自习区将于3月1日至3月15日暂停开放。', author: '图书馆', time: '2026-02-28', type: 'normal', cat: '后勤公告', pinned: false, version: 1 },
        { id: 'a3', title: '校园网络升级维护通知', content: '信息中心将于本周末进行网络升级维护，届时校园网可能出现短暂中断。', author: '信息中心', time: '2026-03-05', type: 'important', cat: '安全提示', pinned: false, version: 1 },
        { id: 'a4', title: '二手交易平台上线公告', content: '智慧校园二手交易平台已正式上线，欢迎同学们发布闲置物品，绿色共享。发布商品请遵守平台规则，禁止发布违禁品。', author: '平台管理员', time: '2026-06-01', type: 'normal', cat: '校园活动', pinned: true, version: 1 },
        { id: 'a5', title: '暑期留校申请通知', content: '需要暑期留校的同学，请于6月20日前在系统中提交申请，经辅导员审批后方可留校。', author: '学生处', time: '2026-06-05', type: 'important', cat: '教务通知', pinned: false, version: 1 }
    ];

    var defaultBlockLog = [
        { id: 1001, text: '出售赌博软件，联系微信xxx，代开发票请联系', words: ['赌博', '代开发票'], source: '周违规(2024006)', time: '2026-06-01T14:25:00.000Z' },
        { id: 1002, text: '刷单日赚500，轻松兼职，加微信了解', words: ['刷单'], source: '匿名用户', time: '2026-06-02T10:15:00.000Z' },
        { id: 1003, text: '你是个傻逼吧，这都不会', words: ['傻逼'], source: '吴永久(2024007)', time: '2026-05-20T15:50:00.000Z' }
    ];

    var defaultSensitiveWords = ['违规', '虚假', '诈骗', '传销'];

    var defaultPets = [];

    /* 移除硬编码模拟数据，只读取用户真实上传的记录 */

    function initDatabase() {
        var initFlag = _get(DB_INIT_KEY, null);
        var needsInit = !initFlag || initFlag.version !== DB_VERSION;

        if (!needsInit) {
            /* 已初始化且版本匹配：只确保表存在，不覆盖已有数据 */
            _ensureTable(tables.students, defaultStudents);
            /* 每次启动修复缺失的 status 字段 */
            var curStudents = _get(tables.students, []);
            var dirty = false;
            curStudents.forEach(function(s) {
                if (!s.status) {
                    s.status = s.banExpiry ? 'banned' : 'approved';
                    dirty = true;
                }
            });
            if (dirty) _set(tables.students, curStudents);
            _ensureTable(tables.secondhand, defaultSecondhand);
            _ensureTable(tables.rentalBooks, defaultRentalBooks);
            _ensureTable(tables.chat, {});
            _ensureTable(tables.avatars, {});
            _ensureTable(tables.bookings, defaultBookings);
            _ensureTable(tables.repairs, defaultRepairs);
            _ensureTable(tables.announcements, defaultAnnouncements);
            _ensureTable(tables.collected, []);
            _ensureTable(tables.liked, []);
            _ensureTable(tables.cart, []);
            _ensureTable(tables.rentalCollected, []);
            _ensureTable(tables.sensitiveWords, defaultSensitiveWords);
            _ensureTable(tables.blockLog, defaultBlockLog);
            _ensureTable(tables.visitCount, 0);
            _ensureTable(tables.pets, defaultPets);
            _ensureTable(tables.merchants, []);
            _ensureTable(tables.merchantOrders, []);
            return;
        }

        /* 版本变更或首次初始化：合并策略——保留已有用户数据，补充默认数据 */
        var existingStudents = _get(tables.students, []);
        if (existingStudents.length === 0) {
            _set(tables.students, defaultStudents);
        } else {
            /* 合并：保留已有用户，补充默认用户中不存在的 */
            var existingIds = existingStudents.map(function(s) { return s.stuId; });
            defaultStudents.forEach(function(ds) {
                if (existingIds.indexOf(ds.stuId) === -1) {
                    existingStudents.push(ds);
                }
            });
            /* v6迁移：为旧用户补充 status 字段 */
            existingStudents.forEach(function(s) {
                if (!s.status) {
                    s.status = s.banExpiry ? 'banned' : 'approved';
                }
            });
            _set(tables.students, existingStudents);
        }
        if (!_get(tables.secondhand, null)) {
            _set(tables.secondhand, defaultSecondhand);
        } else {
            var existing = _get(tables.secondhand, []);
            if (existing.length === 0) {
                _set(tables.secondhand, defaultSecondhand);
            } else {
                existing.forEach(function(p) { if (!p.reviewStatus) p.reviewStatus = 'approved'; });
                _set(tables.secondhand, existing);
            }
        }
        if (!_get(tables.rentalBooks, null)) {
            _set(tables.rentalBooks, defaultRentalBooks);
        } else {
            var existingBooks = _get(tables.rentalBooks, []);
            if (existingBooks.length === 0) {
                _set(tables.rentalBooks, defaultRentalBooks);
            }
        }
        _ensureTable(tables.chat, {});
        _ensureTable(tables.avatars, {});
        _ensureTable(tables.bookings, defaultBookings);
        _ensureTable(tables.repairs, defaultRepairs);
        _ensureTable(tables.announcements, defaultAnnouncements);
        _ensureTable(tables.collected, []);
        _ensureTable(tables.liked, []);
        _ensureTable(tables.cart, []);
        _ensureTable(tables.rentalCollected, []);
        _ensureTable(tables.sensitiveWords, defaultSensitiveWords);
        _ensureTable(tables.blockLog, defaultBlockLog);
        _ensureTable(tables.visitCount, 0);
        _ensureTable(tables.pets, defaultPets);
        _ensureTable(tables.merchants, []);
        _ensureTable(tables.merchantOrders, []);

        _set(DB_INIT_KEY, { version: DB_VERSION, initTime: new Date().toISOString() });
    }

    function _ensureTable(key, defaultVal) {
        var existing = localStorage.getItem(key);
        if (existing === null || existing === undefined) {
            _set(key, defaultVal);
        } else {
            /* 如果已有数据为空数组但默认值不为空，则写入默认数据 */
            try {
                var parsed = JSON.parse(existing);
                if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultVal) && defaultVal.length > 0) {
                    _set(key, defaultVal);
                }
            } catch(e) {}
        }
    }

    var db = {
        version: DB_VERSION,

        init: initDatabase,

        get: function(tableName) {
            var key = tables[tableName] || tableName;
            var defaultVal = _isObjectType(tableName) ? (tableName === 'chat' || tableName === 'avatars' ? {} : []) : null;
            return _get(key, defaultVal);
        },

        set: function(tableName, data) {
            var key = tables[tableName] || tableName;
            return _set(key, data);
        },

        remove: function(tableName) {
            var key = tables[tableName] || tableName;
            _remove(key);
        },

        getCurrentUser: function() {
            return _get(tables.currentUser, null);
        },

        setCurrentUser: function(user) {
            return _set(tables.currentUser, user);
        },

        clearCurrentUser: function() {
            _remove(tables.currentUser);
        },

        getStudents: function() {
            return _get(tables.students, []);
        },

        saveStudents: function(list) {
            return _set(tables.students, list);
        },

        findStudent: function(stuId) {
            var list = this.getStudents();
            return list.find(function(s) { return s.stuId === stuId; }) || null;
        },

        findStudentByName: function(name) {
            var list = this.getStudents();
            return list.find(function(s) { return s.name === name; }) || null;
        },

        addStudent: function(student) {
            var list = this.getStudents();
            list.push(student);
            return this.saveStudents(list);
        },

        updateStudent: function(stuId, updates) {
            var list = this.getStudents();
            var idx = list.findIndex(function(s) { return s.stuId === stuId; });
            if (idx !== -1) {
                Object.assign(list[idx], updates);
                this.saveStudents(list);
                return list[idx];
            }
            return null;
        },

        getSecondhand: function() {
            return _get(tables.secondhand, []);
        },

        saveSecondhand: function(list) {
            return _set(tables.secondhand, list);
        },

        findProduct: function(id) {
            var list = this.getSecondhand();
            return list.find(function(p) { return p.id === id; }) || null;
        },

        addProduct: function(product) {
            var list = this.getSecondhand();
            list.unshift(product);
            return this.saveSecondhand(list);
        },

        updateProduct: function(id, updates) {
            var list = this.getSecondhand();
            var idx = list.findIndex(function(p) { return p.id === id; });
            if (idx !== -1) {
                Object.assign(list[idx], updates);
                this.saveSecondhand(list);
                return list[idx];
            }
            return null;
        },

        deleteProduct: function(id) {
            var list = this.getSecondhand();
            var filtered = list.filter(function(p) { return p.id !== id; });
            return this.saveSecondhand(filtered);
        },

        getRentalBooks: function() {
            var data = _get(tables.rentalBooks, []);
            if (data.length > 0) return data;
            /* 兼容旧键 */
            try {
                var old = JSON.parse(localStorage.getItem('campus_rental_books') || '[]');
                if (old.length > 0) {
                    _set(tables.rentalBooks, old);
                    return old;
                }
            } catch(e) {}
            return data;
        },

        saveRentalBooks: function(list) {
            _set(tables.rentalBooks, list);
            /* 双写旧键兼容 */
            try { localStorage.setItem('campus_rental_books', JSON.stringify(list)); } catch(e) {}
        },

        findRentalBook: function(id) {
            var list = this.getRentalBooks();
            return list.find(function(b) { return b.id === id; }) || null;
        },

        getChat: function() {
            return _get(tables.chat, {});
        },

        saveChat: function(data) {
            return _set(tables.chat, data);
        },

        getChatSession: function(sessionKey) {
            var data = this.getChat();
            return data[sessionKey] || null;
        },

        saveChatSession: function(sessionKey, messages) {
            var data = this.getChat();
            data[sessionKey] = messages;
            return this.saveChat(data);
        },

        addChatMessage: function(sessionKey, message) {
            var data = this.getChat();
            if (!data[sessionKey]) data[sessionKey] = [];
            data[sessionKey].push(message);
            return this.saveChat(data);
        },

        getAvatars: function() {
            return _get(tables.avatars, {});
        },

        saveAvatars: function(data) {
            return _set(tables.avatars, data);
        },

        getUserAvatar: function(stuId) {
            var avatars = this.getAvatars();
            return avatars[stuId] || null;
        },

        setUserAvatar: function(stuId, avatarUrl) {
            var avatars = this.getAvatars();
            avatars[stuId] = avatarUrl;
            this.saveAvatars(avatars);

            var students = this.getStudents();
            var student = students.find(function(s) { return s.stuId === stuId; });
            if (student) {
                student.avatar = avatarUrl;
                this.saveStudents(students);
            }

            var currentUser = this.getCurrentUser();
            if (currentUser && currentUser.stuId === stuId) {
                currentUser.avatar = avatarUrl;
                this.setCurrentUser(currentUser);
            }

            return true;
        },

        getBookings: function() {
            return _get(tables.bookings, []);
        },

        saveBookings: function(list) {
            return _set(tables.bookings, list);
        },

        addBooking: function(booking) {
            var list = this.getBookings();
            list.unshift(booking);
            return this.saveBookings(list);
        },

        updateBooking: function(bookingId, updates) {
            var list = this.getBookings();
            var idx = list.findIndex(function(b) { return b.id === bookingId; });
            if (idx !== -1) {
                Object.assign(list[idx], updates);
                this.saveBookings(list);
                return list[idx];
            }
            return null;
        },

        cancelBooking: function(bookingId) {
            return this.updateBooking(bookingId, { status: 'cancelled' });
        },

        getRepairs: function() {
            return _get(tables.repairs, []);
        },

        saveRepairs: function(list) {
            return _set(tables.repairs, list);
        },

        addRepair: function(record) {
            var list = this.getRepairs();
            list.unshift(record);
            return this.saveRepairs(list);
        },

        updateRepair: function(repId, updates) {
            var list = this.getRepairs();
            var idx = list.findIndex(function(r) { return r.id === repId; });
            if (idx !== -1) {
                Object.assign(list[idx], updates);
                this.saveRepairs(list);
                return list[idx];
            }
            return null;
        },

        getAnnouncements: function() {
            return _get(tables.announcements, []);
        },

        saveAnnouncements: function(list) {
            return _set(tables.announcements, list);
        },

        /* 公告已读状态管理 */
        getAnnouncementReadMap: function() {
            return _get(tables.announcementRead, {});
        },
        saveAnnouncementReadMap: function(map) {
            return _set(tables.announcementRead, map);
        },
        getUnreadAnnouncements: function(stuId) {
            var all = this.getAnnouncements();
            var readMap = this.getAnnouncementReadMap();
            var readList = readMap[stuId] || [];
            return all.filter(function(a) {
                var readRecord = readList.find(function(rid) {
                    if (typeof rid === 'object') return String(rid.noticeId) === String(a.id);
                    return String(rid) === String(a.id);
                });
                if (!readRecord) return true;
                var annVersion = a.version || 1;
                var readVersion = (typeof readRecord === 'object' ? readRecord.version : 1) || 1;
                return annVersion > readVersion;
            }).sort(function(a, b) {
                return (b.time || '').localeCompare(a.time || '');
            });
        },
        getUnreadAnnouncementCount: function(stuId) {
            return this.getUnreadAnnouncements(stuId).length;
        },
        markAnnouncementRead: function(stuId, announcementId, version) {
            var readMap = this.getAnnouncementReadMap();
            if (!readMap[stuId]) readMap[stuId] = [];
            var exists = readMap[stuId].findIndex(function(rid) {
                if (typeof rid === 'object') return String(rid.noticeId) === String(announcementId);
                return String(rid) === String(announcementId);
            });
            var readRecord = {
                noticeId: String(announcementId),
                readTime: new Date().toISOString(),
                version: version || 1
            };
            if (exists === -1) {
                readMap[stuId].push(readRecord);
            } else {
                readMap[stuId][exists] = readRecord;
            }
            this.saveAnnouncementReadMap(readMap);
        },
        getAnnouncementsWithReadStatus: function(stuId) {
            var all = this.getAnnouncements();
            var readMap = this.getAnnouncementReadMap();
            var readList = readMap[stuId] || [];
            return all.map(function(a) {
                var readRecord = readList.find(function(rid) {
                    if (typeof rid === 'object') return String(rid.noticeId) === String(a.id);
                    return String(rid) === String(a.id);
                });
                var isRead = false;
                if (readRecord) {
                    var annVersion = a.version || 1;
                    var readVersion = (typeof readRecord === 'object' ? readRecord.version : 1) || 1;
                    isRead = annVersion <= readVersion;
                }
                return Object.assign({}, a, { isRead: isRead });
            }).sort(function(a, b) {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return (b.time || '').localeCompare(a.time || '');
            });
        },

        getCollected: function() {
            return _get(tables.collected, []);
        },

        saveCollected: function(list) {
            return _set(tables.collected, list);
        },

        toggleCollect: function(productId) {
            var list = this.getCollected();
            var idx = list.indexOf(productId);
            if (idx !== -1) {
                list.splice(idx, 1);
            } else {
                list.push(productId);
            }
            this.saveCollected(list);
            return idx === -1;
        },

        isCollected: function(productId) {
            var list = this.getCollected();
            return list.indexOf(productId) !== -1;
        },

        getLiked: function() {
            return _get(tables.liked, []);
        },

        saveLiked: function(list) {
            return _set(tables.liked, list);
        },

        toggleLike: function(productId) {
            var list = this.getLiked();
            var idx = list.indexOf(productId);
            if (idx !== -1) {
                list.splice(idx, 1);
            } else {
                list.push(productId);
            }
            this.saveLiked(list);
            return idx === -1;
        },

        isLiked: function(productId) {
            var list = this.getLiked();
            return list.indexOf(productId) !== -1;
        },

        getCart: function() {
            return _get(tables.cart, []);
        },

        saveCart: function(list) {
            return _set(tables.cart, list);
        },

        addToCart: function(productId) {
            var list = this.getCart();
            if (list.indexOf(productId) === -1) {
                list.push(productId);
                this.saveCart(list);
            }
        },

        getRentalCollected: function() {
            return _get(tables.rentalCollected, []);
        },

        saveRentalCollected: function(list) {
            return _set(tables.rentalCollected, list);
        },

        getSensitiveWords: function() {
            return _get(tables.sensitiveWords, []);
        },

        saveSensitiveWords: function(list) {
            return _set(tables.sensitiveWords, list);
        },

        getBlockLog: function() {
            return _get(tables.blockLog, []);
        },

        saveBlockLog: function(list) {
            return _set(tables.blockLog, list);
        },

        getVisitCount: function() {
            return _get(tables.visitCount, 0);
        },

        setVisitCount: function(count) {
            _set(tables.visitCount, count);
        },

        incrementVisitCount: function() {
            var count = this.getVisitCount() + 1;
            _set(tables.visitCount, count);
            return count;
        },

        getUnreadChatCount: function(stuId) {
            var chatData = this.getChat();
            var count = 0;
            Object.keys(chatData).forEach(function(key) {
                var messages = chatData[key];
                if (Array.isArray(messages)) {
                    messages.forEach(function(msg) {
                        if (msg.to === stuId && !msg.read) count++;
                    });
                }
            });
            return count;
        },

        markChatAsRead: function(sessionKey, stuId) {
            var data = this.getChat();
            if (data[sessionKey] && Array.isArray(data[sessionKey])) {
                data[sessionKey].forEach(function(msg) {
                    if (msg.to === stuId) msg.read = true;
                });
                this.saveChat(data);
            }
        },

        resetAll: function() {
            Object.keys(tables).forEach(function(name) {
                _remove(tables[name]);
            });
            _remove(DB_INIT_KEY);
            initDatabase();
        },

        getStats: function() {
            return {
                students: this.getStudents().length,
                products: this.getSecondhand().length,
                rentalBooks: this.getRentalBooks().length,
                bookings: this.getBookings().length,
                repairs: this.getRepairs().length,
                chatSessions: Object.keys(this.getChat()).length,
                avatars: Object.keys(this.getAvatars()).length,
                announcements: this.getAnnouncements().length,
                visitCount: this.getVisitCount(),
                pets: this.getPets().length
            };
        },

        exportAll: function() {
            var data = {};
            Object.keys(tables).forEach(function(name) {
                data[name] = _get(tables[name], null);
            });
            return data;
        },

        importAll: function(data) {
            Object.keys(data).forEach(function(name) {
                if (tables[name]) {
                    _set(tables[name], data[name]);
                }
            });
            /* 更新初始化标记，防止 initDatabase 覆盖导入数据 */
            _set(DB_INIT_KEY, { version: DB_VERSION, initTime: new Date().toISOString(), imported: true });
        },

        clearAll: function() {
            Object.keys(tables).forEach(function(name) {
                _remove(tables[name]);
            });
            _remove(DB_INIT_KEY);
        },

        getPets: function() {
            return _get(tables.pets, []);
        },

        savePets: function(list) {
            return _set(tables.pets, list);
        },

        findPet: function(id) {
            var list = this.getPets();
            return list.find(function(p) { return p.id === id; }) || null;
        },

        addPet: function(pet) {
            var list = this.getPets();
            list.unshift(pet);
            return this.savePets(list);
        },

        updatePet: function(id, updates) {
            var list = this.getPets();
            var idx = list.findIndex(function(p) { return p.id === id; });
            if (idx !== -1) {
                Object.assign(list[idx], updates);
                this.savePets(list);
                return list[idx];
            }
            return null;
        },

        deletePet: function(id) {
            var list = this.getPets();
            var filtered = list.filter(function(p) { return p.id !== id; });
            return this.savePets(filtered);
        }
    };

    function _isObjectType(tableName) {
        return tableName === 'chat' || tableName === 'avatars';
    }

    initDatabase();

    window.CampusDB = db;

    /* ===== 校园超市数据接口 ===== */
    var shopTables = {
        goods: 'campus_shop_goods',
        cart: 'campus_shop_cart',
        orders: 'campus_shop_orders'
    };

    window.ShopDB = {
        /* 商品接口 */
        getGoods: function() {
            return _get(shopTables.goods, []);
        },
        saveGoods: function(list) {
            _set(shopTables.goods, list);
        },
        getGoodsByCategory: function(cat) {
            var all = this.getGoods();
            return cat === 'all' ? all : all.filter(function(g) { return g.cat === cat; });
        },
        getGoodsById: function(id) {
            return this.getGoods().find(function(g) { return g.id === id; }) || null;
        },

        /* 购物车接口 */
        getCart: function() {
            return _get(shopTables.cart, []);
        },
        saveCart: function(list) {
            _set(shopTables.cart, list);
        },
        addToCart: function(productId, qty) {
            qty = qty || 1;
            var cart = this.getCart();
            var found = cart.find(function(c) { return c.id === productId; });
            if (found) {
                found.qty += qty;
            } else {
                var product = this.getGoodsById(productId);
                if (!product) return false;
                cart.push({ id: product.id, name: product.name, price: product.price, qty: qty, img: product.img, cat: product.cat, selected: true });
            }
            this.saveCart(cart);
            return true;
        },
        updateCartQty: function(productId, qty) {
            var cart = this.getCart();
            var found = cart.find(function(c) { return c.id === productId; });
            if (found) {
                found.qty = qty;
                if (qty <= 0) cart = cart.filter(function(c) { return c.id !== productId; });
                this.saveCart(cart);
            }
        },
        removeFromCart: function(productId) {
            var cart = this.getCart().filter(function(c) { return c.id !== productId; });
            this.saveCart(cart);
        },
        clearSelectedCart: function() {
            var cart = this.getCart().filter(function(c) { return c.selected === false; });
            cart.forEach(function(c) { c.selected = true; });
            this.saveCart(cart);
        },
        getCartCount: function() {
            return this.getCart().reduce(function(s, c) { return s + c.qty; }, 0);
        },
        getCartTotal: function() {
            return this.getCart().filter(function(c) { return c.selected !== false; }).reduce(function(s, c) { return s + c.price * c.qty; }, 0);
        },

        /* 订单接口 */
        getOrders: function() {
            return _get(shopTables.orders, []);
        },
        saveOrders: function(list) {
            _set(shopTables.orders, list);
        },
        submitOrder: function(address, phone) {
            var cart = this.getCart();
            var selectedItems = cart.filter(function(c) { return c.selected !== false; });
            if (selectedItems.length === 0) return null;

            var total = selectedItems.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
            var now = new Date();
            var timeStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

            var order = {
                orderId: 'ORD' + Date.now(),
                items: selectedItems.map(function(i) { return { id: i.id, name: i.name, qty: i.qty, price: i.price }; }),
                total: total,
                address: address,
                phone: phone,
                time: timeStr,
                status: 'pending'
            };

            var orders = this.getOrders();
            orders.unshift(order);
            this.saveOrders(orders);

            /* 清除已选商品 */
            this.clearSelectedCart();
            return order;
        },
        getOrderById: function(orderId) {
            return this.getOrders().find(function(o) { return o.orderId === orderId; }) || null;
        },
        updateOrderStatus: function(orderId, status) {
            var orders = this.getOrders();
            var found = orders.find(function(o) { return o.orderId === orderId; });
            if (found) {
                found.status = status;
                this.saveOrders(orders);
            }
        },

        /* ========== 商家入驻相关接口 ========== */
        getMerchants: function() {
            return _get(tables.merchants, []);
        },
        saveMerchants: function(list) {
            _set(tables.merchants, list);
        },
        addMerchant: function(data) {
            var list = this.getMerchants();
            data.id = 'M' + Date.now();
            data.status = 'pending';
            data.createTime = new Date().toLocaleString();
            data.reviewTime = '';
            data.reviewer = '';
            data.rejectReason = '';
            list.unshift(data);
            this.saveMerchants(list);
            return data;
        },
        getMerchantById: function(id) {
            return this.getMerchants().find(function(m) { return m.id === id; }) || null;
        },
        getMerchantByAccount: function(account) {
            return this.getMerchants().find(function(m) { return m.account === account; }) || null;
        },
        getApprovedMerchants: function() {
            return this.getMerchants().filter(function(m) { return m.status === 'approved'; });
        },
        getApprovedMerchantsByCategory: function(category) {
            return this.getMerchants().filter(function(m) { return m.status === 'approved' && m.category === category; });
        },
        reviewMerchant: function(id, status, reviewer, rejectReason) {
            var list = this.getMerchants();
            var found = list.find(function(m) { return m.id === id; });
            if (!found) return false;
            /* 防止重复审核：已审核过的不能再改 */
            if (found.status === 'approved' || found.status === 'rejected') return false;
            found.status = status;
            found.reviewer = reviewer || '';
            found.reviewTime = new Date().toLocaleString();
            found.rejectReason = rejectReason || '';
            this.saveMerchants(list);
            return true;
        },
        /* 商家工单 */
        getMerchantOrders: function() {
            return _get(tables.merchantOrders, []);
        },
        saveMerchantOrders: function(list) {
            _set(tables.merchantOrders, list);
        },
        addMerchantOrder: function(data) {
            var list = this.getMerchantOrders();
            data.id = 'MO' + Date.now();
            data.status = '待接单';
            data.createTime = new Date().toLocaleString();
            data.acceptTime = '';
            data.doneTime = '';
            data.acceptor = '';
            data.acceptorName = '';
            list.unshift(data);
            this.saveMerchantOrders(list);
            return data;
        },
        acceptMerchantOrder: function(id, acceptorName) {
            var list = this.getMerchantOrders();
            var found = list.find(function(o) { return o.id === id; });
            if (found) {
                found.status = '已接单';
                found.acceptTime = new Date().toLocaleString();
                found.acceptorName = acceptorName || '';
                this.saveMerchantOrders(list);
            }
        },
        finishMerchantOrder: function(id) {
            var list = this.getMerchantOrders();
            var found = list.find(function(o) { return o.id === id; });
            if (found) {
                found.status = '已办结';
                found.doneTime = new Date().toLocaleString();
                this.saveMerchantOrders(list);
            }
        },
        rejectMerchantOrder: function(id) {
            var list = this.getMerchantOrders();
            var found = list.find(function(o) { return o.id === id; });
            if (found) {
                found.status = '已驳回';
                this.saveMerchantOrders(list);
            }
        },
        getMerchantOrdersByMerchantId: function(merchantId) {
            return this.getMerchantOrders().filter(function(o) { return o.merchantId === merchantId; });
        }
    };

})(window);
