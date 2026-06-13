document.addEventListener('DOMContentLoaded', function() {
    var bookImages = {
        1: [
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop'
        ],
        2: [
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop'
        ],
        3: [
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop'
        ],
        4: [
            'https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop'
        ],
        5: [
            'https://images.unsplash.com/photo-1553729459-afe8f2e2882d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop'
        ],
        6: [
            'https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop'
        ]
    };

    var fallbackImages = [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop'
    ];

    var slideLabels = ['封面实拍', '内页展示', '笔记特写', '目录详情'];

    function getAvatarUrl(stuId) {
        if (!stuId) return null;
        if (window.CampusDB) return CampusDB.getUserAvatar(stuId);
        try {
            var avatars = JSON.parse(localStorage.getItem('campus_avatars') || '{}');
            return avatars[stuId] || null;
        } catch(e) { return null; }
    }

    function renderAvatarDiv(text, url, className) {
        if (url) {
            return '<div class="' + className + '" style="padding:0;overflow:hidden"><img src="' + url + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentElement.innerHTML=\'' + text + '\'"></div>';
        }
        return '<div class="' + className + '">' + text + '</div>';
    }

    function getRentalBooks() {
        if (window.CampusDB) return CampusDB.getRentalBooks();
        try {
            var stored = JSON.parse(localStorage.getItem('campus_rental_books_v2') || '[]');
            if (stored.length > 0) return stored;
            /* 兼容旧键 */
            var old = JSON.parse(localStorage.getItem('campus_rental_books') || '[]');
            if (old.length > 0) {
                localStorage.setItem('campus_rental_books_v2', JSON.stringify(old));
                return old;
            }
            var defaults = getDefaultRentalBooks();
            localStorage.setItem('campus_rental_books_v2', JSON.stringify(defaults));
            localStorage.setItem('campus_rental_books', JSON.stringify(defaults));
            return defaults;
        } catch(e) {
            var defaults = getDefaultRentalBooks();
            localStorage.setItem('campus_rental_books_v2', JSON.stringify(defaults));
            localStorage.setItem('campus_rental_books', JSON.stringify(defaults));
            return defaults;
        }
    }

    function getDefaultRentalBooks() {
        return [
            { id: 1, name: '高等数学（同济第七版）上册', price: 15, period: '1学期', condition: '少量笔记', desc: '适用理工科专业，含部分课堂笔记，重点公式已标注，期末复习利器。书脊完好，无缺页。', seller: '数学系学长', sellerDept: '数学与统计学院', available: true, version: '第七版', major: '理工科通用', notes: '少量笔记', deposit: 30, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 89, likes: 23, collects: 8, time: '2天前', images: [], reviews: [{name:'李同学',text:'笔记很有用，期末靠这个复习的',time:'1天前'},{name:'王同学',text:'书保存得很好，推荐租借',time:'3天前'}] },
            { id: 2, name: '大学物理（第四版）', price: 12, period: '1学期', condition: '几乎全新', desc: '适用物理、工科专业，保存完好，无笔记无划线，如新书一般。', seller: '物理系学姐', sellerDept: '物理与电子学院', available: true, version: '第四版', major: '物理/工科专业', notes: '无笔记', deposit: 25, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 56, likes: 12, collects: 5, time: '3天前', images: [], reviews: [] },
            { id: 3, name: '线性代数及其应用', price: 10, period: '1学期', condition: '有笔记标注', desc: '含详细课堂笔记，期末复习利器，重点题型已标注答案。', seller: '数学系同学', sellerDept: '数学与统计学院', available: true, version: '第五版', major: '理工科通用', notes: '详细笔记', deposit: 20, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 67, likes: 18, collects: 7, time: '4天前', images: [], reviews: [{name:'张同学',text:'笔记非常详细，省了自己做笔记的时间',time:'2天前'}] },
            { id: 4, name: 'C++ Primer Plus 第6版', price: 20, period: '1学年', condition: '几乎全新', desc: '计算机专业经典教材，含课后习题答案，代码示例丰富。', seller: '计算机系学长', sellerDept: '计算机学院', available: true, version: '第6版', major: '计算机/软件工程', notes: '无笔记', deposit: 40, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 134, likes: 45, collects: 20, time: '1天前', images: [], reviews: [] },
            { id: 5, name: '微观经济学（曼昆）', price: 18, period: '1学期', condition: '少量笔记', desc: '经管专业核心教材，重点标注清晰，含历年考题分析。', seller: '经济系学姐', sellerDept: '经济管理学院', available: false, version: '第七版', major: '经管专业', notes: '少量笔记', deposit: 35, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 98, likes: 34, collects: 15, time: '5天前', images: [], reviews: [{name:'赵同学',text:'重点标注很清晰，考试很有帮助',time:'4天前'}] },
            { id: 6, name: '数据结构与算法分析', price: 22, period: '1学年', condition: '少量笔记', desc: '计算机专业必修，含代码示例和算法图解，考研必备。', seller: '软件工程学长', sellerDept: '计算机学院', available: true, version: '第二版', major: '计算机/软件工程', notes: '少量笔记', deposit: 45, returnMethod: '到期归还至图书馆一楼服务台', delivery: '校内宿舍楼栋配送', reviewStatus: 'approved', views: 112, likes: 38, collects: 16, time: '2天前', images: [], reviews: [] }
        ];
    }

    function saveRentalBooks(list) {
        if (window.CampusDB) return CampusDB.saveRentalBooks(list);
        localStorage.setItem('campus_rental_books_v2', JSON.stringify(list));
        localStorage.setItem('campus_rental_books', JSON.stringify(list)); /* 双写兼容 */
    }

    function getRentalBookId() {
        var params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'));
    }

    function getRentalBook(id) {
        var books = getRentalBooks();
        return books.find(function(b) { return b.id === id; });
    }

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function showToast(msg) {
        var toast = document.getElementById('detailToast');
        document.getElementById('detailToastMsg').textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    function formatTime(t) {
        if (!t) return '刚刚';
        return t;
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    var currentSlide = 0;

    function renderDetail(book) {
        if (!book || book.reviewStatus === 'rejected') {
            document.getElementById('detailMain').innerHTML = '<div class="detail-not-found"><i class="fas fa-book-open"></i><h2>教材不存在或已下架</h2><p>该教材可能已被出租者删除或被管理员下架</p><a href="secondhand.html#rentalSection"><i class="fas fa-arrow-left"></i> 返回教材租用</a></div>';
            return;
        }

        document.getElementById('breadcrumbName').textContent = book.name;
        document.title = book.name + ' - 智慧校园教材租用';

        var images = [];
        if (book.images && Array.isArray(book.images) && book.images.length > 0) {
            images = book.images;
        } else {
            images = bookImages[book.id] || fallbackImages;
        }
        var slideCount = images.length;

        var slides = '';
        for (var i = 0; i < slideCount; i++) {
            var bgGrad = 'linear-gradient(135deg, #ec489918, #be185d18)';
            var sLabel = i < slideLabels.length ? slideLabels[i] : '实拍图' + (i + 1);
            slides += '<div class="detail-carousel-slide' + (i === 0 ? ' active' : '') + '" style="background:' + bgGrad + '">' +
                '<img src="' + images[i] + '" alt="' + book.name + ' ' + sLabel + '" onerror="this.style.display=\'none\';var si=this.parentElement.querySelector(\'.slide-icon\');if(si)si.style.display=\'flex\'">' +
                '<div class="slide-icon" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center"><i class="fas fa-book"></i></div>' +
                '<div class="slide-label">' + sLabel + ' ' + (i + 1) + '/' + slideCount + '</div>' +
            '</div>';
        }

        var dots = '';
        for (var j = 0; j < slideCount; j++) {
            dots += '<div class="detail-carousel-dot' + (j === 0 ? ' active' : '') + '" data-index="' + j + '"></div>';
        }

        var isRented = !book.available;
        var user = getCurrentUser();
        var isCollected = false;
        var collected = [];
        if (window.CampusDB) { collected = CampusDB.getRentalCollected(); } else {
            try { collected = JSON.parse(localStorage.getItem('campus_rental_collected') || '[]'); } catch(e) {}
        }
        isCollected = collected.indexOf(book.id) !== -1;

        var isOwner = false;
        if (user && user.role === 'student') {
            if (book.sellerStuId && user.stuId) isOwner = book.sellerStuId === user.stuId;
            else isOwner = book.seller === user.name;
        }

        var reviews = book.reviews || [];
        var reviewsHtml = '';
        if (reviews.length === 0) {
            reviewsHtml = '<div class="rd-empty-reviews"><i class="fas fa-comment-slash"></i><p>暂无评价，快来第一个评价吧</p></div>';
        } else {
            reviews.forEach(function(r) {
                var rAvatarUrl = null;
                if (r.name) {
                    var allStu = [];
                    if (window.CampusDB) { allStu = CampusDB.getStudents(); } else {
                        try { allStu = JSON.parse(localStorage.getItem('campus_students') || '[]'); } catch(e4) {}
                    }
                    var rStudent = allStu.find(function(s) { return s.name === r.name; });
                    if (rStudent) rAvatarUrl = getAvatarUrl(rStudent.stuId);
                }
                reviewsHtml += '<div class="rd-review-item">' +
                    renderAvatarDiv((r.name ? r.name.charAt(0) : '?'), rAvatarUrl, 'rd-review-avatar') +
                    '<div class="rd-review-body">' +
                        '<div class="rd-review-name">' + escapeHtml(r.name) + '</div>' +
                        '<div class="rd-review-text">' + escapeHtml(r.text) + '</div>' +
                        '<div class="rd-review-time">' + r.time + '</div>' +
                    '</div>' +
                '</div>';
            });
        }

        var similarBooks = getRentalBooks().filter(function(b) {
            return b.id !== book.id && b.reviewStatus !== 'rejected';
        }).slice(0, 4);
        var similarHtml = '';
        similarBooks.forEach(function(sb) {
            var sbImg = '';
            if (sb.images && sb.images.length > 0) sbImg = sb.images[0];
            else if (bookImages[sb.id]) sbImg = bookImages[sb.id][0];
            else sbImg = fallbackImages[0];
            similarHtml += '<div class="rd-similar-card" data-id="' + sb.id + '">' +
                '<div class="rd-similar-card-img" style="background:linear-gradient(135deg,#ec489918,#be185d18)">' +
                    (sbImg ? '<img src="' + sbImg + '" alt="' + sb.name + '" onerror="this.style.display=\'none\'">' : '<i class="fas fa-book"></i>') +
                '</div>' +
                '<div class="rd-similar-card-body">' +
                    '<h4>' + escapeHtml(sb.name) + '</h4>' +
                    '<div class="similar-price">¥' + sb.price + '<small>/' + sb.period + '</small></div>' +
                    '<div class="similar-meta">' + sb.condition + ' · ' + sb.seller + '</div>' +
                '</div>' +
            '</div>';
        });

        var ownerBtns = '';
        if (isOwner) {
            ownerBtns = '<button class="rd-edit-btn" id="editRentalBtn"><i class="fas fa-edit"></i> 编辑教材</button>' +
                '<button class="rd-delete-btn" id="deleteRentalBtn"><i class="fas fa-trash-alt"></i> 删除教材</button>';
        }

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
                (book.reviewStatus === 'pending' ? '<div class="rd-rental-badge pending"><i class="fas fa-clock"></i> 审核中</div>' : '<div class="rd-rental-badge ' + (isRented ? 'rented' : 'available') + '"><i class="fas fa-' + (isRented ? 'ban' : 'check-circle') + '"></i> ' + (isRented ? '已租出' : '可租用') + '</div>') +
                '<h1 class="detail-name">' + escapeHtml(book.name) + '</h1>' +
                '<div class="rd-price-row">' +
                    '<span class="rd-price-current">¥' + book.price + '</span>' +
                    '<span class="rd-price-unit">/' + book.period + '</span>' +
                    '<span class="rd-price-deposit"><i class="fas fa-shield-alt"></i> 押金 ¥' + (book.deposit || 30) + '</span>' +
                '</div>' +
                '<div class="rd-info-grid">' +
                    '<div class="rd-info-item"><i class="fas fa-book"></i><div><div class="info-label">版本</div><div class="info-value">' + (book.version || '未填写') + '</div></div></div>' +
                    '<div class="rd-info-item"><i class="fas fa-graduation-cap"></i><div><div class="info-label">适用专业</div><div class="info-value">' + (book.major || '未填写') + '</div></div></div>' +
                    '<div class="rd-info-item"><i class="fas fa-star"></i><div><div class="info-label">成色</div><div class="info-value">' + (book.condition || '未填写') + '</div></div></div>' +
                    '<div class="rd-info-item"><i class="fas fa-pen-fancy"></i><div><div class="info-label">笔记多少</div><div class="info-value">' + (book.notes || '未填写') + '</div></div></div>' +
                    '<div class="rd-info-item"><i class="fas fa-clock"></i><div><div class="info-label">可租期</div><div class="info-value">' + (book.period || '未填写') + '</div></div></div>' +
                    '<div class="rd-info-item"><i class="fas fa-truck"></i><div><div class="info-label">配送方式</div><div class="info-value">' + (book.delivery || '校内配送') + '</div></div></div>' +
                '</div>' +
                '<div class="detail-desc-section">' +
                    '<h3><i class="fas fa-info-circle"></i> 教材详情</h3>' +
                    '<p>' + escapeHtml(book.desc || '暂无详细描述') + '</p>' +
                '</div>' +
                '<div class="rd-rules-section">' +
                    '<h4><i class="fas fa-file-contract"></i> 租用规则</h4>' +
                    '<ul class="rd-rules-list">' +
                        '<li><i class="fas fa-check"></i> 租期到期前3天系统自动提醒续租或归还</li>' +
                        '<li><i class="fas fa-check"></i> 归还方式：' + (book.returnMethod || '图书馆一楼服务台') + '</li>' +
                        '<li><i class="fas fa-check"></i> 押金 ¥' + (book.deposit || 30) + '，归还验货后全额退还</li>' +
                        '<li><i class="fas fa-check"></i> 如有损坏按原价比例扣除押金</li>' +
                        '<li><i class="fas fa-check"></i> 配送方式：' + (book.delivery || '校内宿舍楼栋配送') + '</li>' +
                    '</ul>' +
                '</div>' +
                '<div class="detail-stats-row">' +
                    '<span class="detail-stat"><i class="far fa-heart"></i> ' + (book.likes || 0) + '</span>' +
                    '<span class="detail-stat' + (isCollected ? ' collected' : '') + '" id="collectStat"><i class="fa' + (isCollected ? 's' : 'r') + ' fa-bookmark"></i> ' + (book.collects || 0) + '</span>' +
                    '<span class="detail-stat"><i class="fas fa-eye"></i> ' + (book.views || 0) + '</span>' +
                    '<span class="detail-stat"><i class="fas fa-clock"></i> ' + formatTime(book.time) + '</span>' +
                '</div>' +
                '<div class="rd-seller-card">' +
                    '<div class="rd-seller-header">' +
                        renderAvatarDiv((book.seller ? book.seller.charAt(0) : '?'), getAvatarUrl(book.sellerStuId), 'rd-seller-avatar') +
                        '<div class="rd-seller-info">' +
                            '<div class="rd-seller-name">' + escapeHtml(book.seller) + '</div>' +
                            '<div class="rd-seller-dept"><i class="fas fa-graduation-cap"></i> ' + (book.sellerDept || '未填写') + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="rd-seller-contact">' +
                        '<button id="chatRentalBtn"><i class="fas fa-comment-dots"></i> 私信沟通</button>' +
                    '</div>' +
                '</div>' +
                '<div class="rd-actions">' +
                    '<button class="btn-rent' + (isRented ? ' disabled' : '') + '" id="rentBtn"><i class="fas fa-hand-holding-heart"></i> ' + (isRented ? '已被租用' : '一键租用') + '</button>' +
                    '<button class="btn-collect' + (isCollected ? ' collected' : '') + '" id="collectBtn"><i class="fa' + (isCollected ? 's' : 'r') + ' fa-bookmark"></i> ' + (isCollected ? '已收藏' : '收藏') + '</button>' +
                '</div>' +
                ownerBtns +
            '</div>' +
            '<div class="detail-section">' +
                '<div class="detail-section-header">' +
                    '<h3><i class="fas fa-file-alt"></i> 租用须知</h3>' +
                '</div>' +
                '<div class="rd-notice-section">' +
                    '<ul class="rd-notice-list">' +
                        '<li><i class="fas fa-info-circle"></i> 租用前请仔细查看教材成色和笔记情况，确认无误后再下单</li>' +
                        '<li><i class="fas fa-info-circle"></i> 租用期间请妥善保管教材，避免污损、缺页</li>' +
                        '<li><i class="fas fa-info-circle"></i> 到期请按时归还，逾期将按日扣除押金</li>' +
                        '<li><i class="fas fa-info-circle"></i> 如需续租，请在到期前联系出租者确认</li>' +
                        '<li><i class="fas fa-info-circle"></i> 如遇纠纷，可联系平台客服介入处理</li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
            '<div class="detail-section">' +
                '<div class="detail-section-header">' +
                    '<h3><i class="fas fa-star"></i> 用户评价 <span class="count">' + reviews.length + '条</span></h3>' +
                '</div>' +
                reviewsHtml +
                '<div class="detail-comment-input">' +
                    '<input type="text" id="commentInput" placeholder="发表评价，按回车发送...">' +
                    '<button id="commentSubmit"><i class="fas fa-paper-plane"></i> 发送</button>' +
                '</div>' +
            '</div>' +
            (similarBooks.length > 0 ?
            '<div class="detail-similar-section">' +
                '<div class="detail-section-header">' +
                    '<h3><i class="fas fa-th-large"></i> 相似教材推荐</h3>' +
                '</div>' +
                '<div class="rd-similar-grid">' + similarHtml + '</div>' +
            '</div>' : '') +
        '</div>';

        document.getElementById('detailMain').innerHTML = html;
        incrementViews(book);
        bindEvents(book);
    }

    function incrementViews(book) {
        var books = getRentalBooks();
        var idx = books.findIndex(function(b) { return b.id === book.id; });
        if (idx !== -1) {
            books[idx].views = (books[idx].views || 0) + 1;
            saveRentalBooks(books);
        }
    }

    function bindEvents(book) {
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

        var rentBtn = document.getElementById('rentBtn');
        if (rentBtn && !rentBtn.classList.contains('disabled')) {
            rentBtn.addEventListener('click', function() {
                var user = getCurrentUser();
                if (!user || user.role !== 'student') {
                    showToast('请先登录后再租用教材');
                    return;
                }
                /* 校验：不能租用自己发布的教材 */
                if (book.sellerStuId && user.stuId && book.sellerStuId === user.stuId) {
                    showToast('不能租用自己发布的教材'); return;
                }
                if (book.seller === user.name) {
                    showToast('不能租用自己发布的教材'); return;
                }
                if (!confirm('确认租借《' + book.name + '》？\n租金：¥' + book.price + '/' + book.period + '\n押金：¥' + (book.deposit || 30))) return;
                var books = getRentalBooks();
                var idx = books.findIndex(function(b) { return b.id === book.id; });
                if (idx !== -1) {
                    books[idx].available = false;
                    saveRentalBooks(books);
                    showToast('租用成功！请等待出租者确认');
                    setTimeout(function() { location.reload(); }, 1500);
                }
            });
        }

        var collectBtn = document.getElementById('collectBtn');
        if (collectBtn) {
            collectBtn.addEventListener('click', function() {
                var user = getCurrentUser();
                if (!user || user.role !== 'student') {
                    showToast('请先登录后再收藏');
                    return;
                }
                var collected = [];
                if (window.CampusDB) { collected = CampusDB.getRentalCollected(); } else {
                    try { collected = JSON.parse(localStorage.getItem('campus_rental_collected') || '[]'); } catch(e) {}
                }
                var idx = collected.indexOf(book.id);
                if (idx !== -1) {
                    collected.splice(idx, 1);
                    showToast('已取消收藏');
                } else {
                    collected.push(book.id);
                    showToast('收藏成功');
                }
                if (window.CampusDB) { CampusDB.saveRentalCollected(collected); } else { localStorage.setItem('campus_rental_collected', JSON.stringify(collected)); }
                renderDetail(book);
            });
        }

        var chatRentalBtn = document.getElementById('chatRentalBtn');
        if (chatRentalBtn) {
            if (isRented) {
                chatRentalBtn.disabled = true;
                chatRentalBtn.style.opacity = '0.5';
                chatRentalBtn.style.cursor = 'not-allowed';
                chatRentalBtn.innerHTML = '<i class="fas fa-ban"></i> 已被租用，无法沟通';
            } else {
                chatRentalBtn.addEventListener('click', function() {
                    var user = getCurrentUser();
                    if (!user || user.role !== 'student') {
                        showToast('请先登录后再私信出租者');
                        return;
                    }
                    window.location.href = 'chat.html?to=' + encodeURIComponent(book.seller) + '&productId=' + book.id + '&productName=' + encodeURIComponent(book.name);
                });
            }
        }

        var deleteRentalBtn = document.getElementById('deleteRentalBtn');
        if (deleteRentalBtn) {
            deleteRentalBtn.addEventListener('click', function() {
                if (!confirm('确定要删除该教材吗？删除后无法恢复！')) return;
                var books = getRentalBooks();
                var idx = books.findIndex(function(b) { return b.id === book.id; });
                if (idx !== -1) {
                    books[idx].reviewStatus = 'rejected';
                    saveRentalBooks(books);
                    showToast('教材已删除');
                    setTimeout(function() { window.location.href = 'secondhand.html#rentalSection'; }, 1000);
                }
            });
        }

        var editRentalBtn = document.getElementById('editRentalBtn');
        if (editRentalBtn) {
            editRentalBtn.addEventListener('click', function() {
                window.location.href = 'secondhand.html?editRental=' + book.id + '#rentalSection';
            });
        }

        var commentInput = document.getElementById('commentInput');
        var commentSubmit = document.getElementById('commentSubmit');
        function submitComment() {
            var user = getCurrentUser();
            if (!user || user.role !== 'student') {
                showToast('请先登录后再评价');
                return;
            }
            var text = commentInput.value.trim();
            if (!text) { showToast('请输入评价内容'); return; }
            var books = getRentalBooks();
            var idx = books.findIndex(function(b) { return b.id === book.id; });
            if (idx !== -1) {
                if (!books[idx].reviews) books[idx].reviews = [];
                books[idx].reviews.push({ name: user.name, text: text, time: '刚刚' });
                saveRentalBooks(books);
                showToast('评价成功');
                renderDetail(book);
            }
        }
        if (commentInput) commentInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); submitComment(); } });
        if (commentSubmit) commentSubmit.addEventListener('click', submitComment);

        document.querySelectorAll('.rd-similar-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = this.dataset.id;
                if (id) window.location.href = 'rental-detail.html?id=' + id;
            });
        });
    }

    var bookId = getRentalBookId();
    if (bookId) {
        var book = getRentalBook(bookId);
        renderDetail(book);
    } else {
        document.getElementById('detailMain').innerHTML = '<div class="detail-not-found"><i class="fas fa-book-open"></i><h2>教材不存在</h2><p>请从教材租用页面选择教材</p><a href="secondhand.html#rentalSection"><i class="fas fa-arrow-left"></i> 返回教材租用</a></div>';
    }
});
