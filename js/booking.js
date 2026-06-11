(function() {
    /* 场馆数据 - 游泳馆/体育馆/图书馆/实训室 */
    var venues = [
        /* 游泳馆 */
        { id: 'v1', type: 'swimming', name: '室内恒温泳池', icon: 'fa-swimmer', desc: '50米标准恒温泳池，水温常年保持26-28°C，配备专业救生员', capacity: 60, location: '游泳馆1楼', tags: ['恒温', '标准池', '救生员'], available: true, openTime: '06:00-22:00', equipment: '标准泳道、更衣室、淋浴间、储物柜' },
        { id: 'v2', type: 'swimming', name: '训练短池', icon: 'fa-swimmer', desc: '25米短池，适合初学者和日常训练，水深1.2-1.8米', capacity: 30, location: '游泳馆2楼', tags: ['短池', '初学者', '浅水区'], available: true, openTime: '07:00-21:00', equipment: '泳道分隔线、浮板、更衣室' },
        { id: 'v3', type: 'swimming', name: '儿童戏水区', icon: 'fa-water', desc: '专为儿童设计的安全戏水区域，水深0.4-0.6米，配有水上滑梯', capacity: 20, location: '游泳馆1楼东侧', tags: ['儿童', '戏水', '安全'], available: true, openTime: '09:00-20:00', equipment: '水上滑梯、浅水池、家长休息区' },
        { id: 'v4', type: 'swimming', name: 'VIP私教泳池', icon: 'fa-hot-tub', desc: '私密教学空间，一对一或小班教学，环境安静舒适', capacity: 6, location: '游泳馆3楼', tags: ['私教', 'VIP', '安静'], available: false, openTime: '08:00-21:00', equipment: '独立泳池、休息区、毛巾浴巾' },
        /* 体育馆 */
        { id: 'v5', type: 'gym', name: '室内篮球馆', icon: 'fa-basketball-ball', desc: '标准篮球场地，专业木地板，配备计分系统和照明', capacity: 50, location: '体育馆1楼', tags: ['篮球', '木地板', '室内'], available: true, openTime: '06:00-22:00', equipment: '篮球架、计分板、更衣室、饮水机' },
        { id: 'v6', type: 'gym', name: '羽毛球馆', icon: 'fa-feather-alt', desc: '6片标准羽毛球场地，PVC塑胶地面，灯光柔和不刺眼', capacity: 30, location: '体育馆2楼', tags: ['羽毛球', '塑胶地', '灯光'], available: true, openTime: '06:00-22:00', equipment: '球网、计分器、更衣室' },
        { id: 'v7', type: 'gym', name: '乒乓球室', icon: 'fa-table-tennis', desc: '10张标准乒乓球台，空间宽敞，适合个人练习和比赛', capacity: 20, location: '体育馆3楼', tags: ['乒乓球', '室内', '多台'], available: true, openTime: '06:00-22:00', equipment: '球台、球网、挡板、更衣室' },
        { id: 'v8', type: 'gym', name: '健身房', icon: 'fa-dumbbell', desc: '配备有氧和力量训练器械，专业教练指导，淋浴设施齐全', capacity: 40, location: '体育馆1楼西侧', tags: ['健身', '器械', '教练'], available: true, openTime: '06:00-22:00', equipment: '跑步机、动感单车、哑铃区、力量器械' },
        { id: 'v9', type: 'gym', name: '瑜伽舞蹈室', icon: 'fa-spa', desc: '木地板+镜面墙，适合瑜伽、舞蹈、形体训练', capacity: 25, location: '体育馆2楼东侧', tags: ['瑜伽', '舞蹈', '镜面墙'], available: false, openTime: '07:00-21:00', equipment: '镜面墙、把杆、瑜伽垫、音响' },
        /* 图书馆 */
        { id: 'v10', type: 'library', name: '图书馆一楼自习室', icon: 'fa-book-open', desc: '安静自习空间，配备独立书桌和台灯，WiFi全覆盖', capacity: 120, location: '图书馆1楼', tags: ['自习', '安静', '空调'], available: true, openTime: '07:00-22:00', equipment: '独立书桌、台灯、电源插座、WiFi' },
        { id: 'v11', type: 'library', name: '电子阅览室', icon: 'fa-desktop', desc: '配备电脑的电子阅览空间，可查阅电子期刊和数据库', capacity: 60, location: '图书馆2楼', tags: ['电脑', '电子资源', '打印'], available: true, openTime: '08:00-21:00', equipment: '电脑、打印机、扫描仪、数据库访问' },
        { id: 'v12', type: 'library', name: '研讨间A', icon: 'fa-comments', desc: '小组讨论专用空间，可白板演示，适合团队协作', capacity: 10, location: '图书馆3楼', tags: ['讨论', '白板', '投影'], available: true, openTime: '08:00-21:00', equipment: '白板、投影仪、会议桌、电源' },
        { id: 'v13', type: 'library', name: '研讨间B', icon: 'fa-comments', desc: '中型研讨空间，配备视频会议设备，适合远程协作', capacity: 15, location: '图书馆3楼', tags: ['讨论', '协作', '视频会议'], available: false, openTime: '08:00-21:00', equipment: '白板、投影仪、视频会议设备' },
        /* 实训室 */
        { id: 'v14', type: 'lab', name: '计算机实训室A', icon: 'fa-laptop-code', desc: '配备高性能电脑的实训空间，支持编程和软件开发', capacity: 50, location: '信息楼2楼', tags: ['计算机', '编程', '实训'], available: true, openTime: '08:00-21:00', equipment: '高性能电脑、投影仪、白板' },
        { id: 'v15', type: 'lab', name: '物理实验室', icon: 'fa-atom', desc: '物理实验专用空间，配备各类实验仪器和安全设备', capacity: 30, location: '理学楼1楼', tags: ['物理', '实验', '科研'], available: true, openTime: '08:00-18:00', equipment: '实验仪器、安全设备、通风系统' },
        { id: 'v16', type: 'lab', name: '电子实训室', icon: 'fa-microchip', desc: '电子电路实训空间，配备示波器和焊接工具', capacity: 40, location: '工学楼3楼', tags: ['电子', '电路', '焊接'], available: false, openTime: '08:00-18:00', equipment: '示波器、焊接工具、电源、防静电台' }
    ];

    var myBookings = loadBookings();

    function loadBookings() {
        if (window.CampusDB) {
            return CampusDB.getBookings();
        }
        try { return JSON.parse(localStorage.getItem('campus_bookings') || '[]'); } catch(e) { return []; }
    }

    function saveBookings() {
        if (window.CampusDB) {
            CampusDB.saveBookings(myBookings);
        } else {
            try { localStorage.setItem('campus_bookings', JSON.stringify(myBookings)); } catch(e) {}
        }
    }

    function init() {
        initHeroSlider();
        animateStats();
        initCategoryCards();
        initFilterBtns();
        renderVenues('all');
        renderBookings();
        initModals();
        initBookingForm();
        setMinDate();
    }

    /* Hero 轮播 */
    function initHeroSlider() {
        var slides = document.querySelectorAll('.bk-hero-slide');
        var dots = document.querySelectorAll('.bk-hero-dot');
        if (!slides.length) return;
        var current = 0;
        var total = slides.length;
        var timer = null;

        function goTo(index) {
            slides[current].classList.remove('active');
            if (dots[current]) dots[current].classList.remove('active');
            current = index % total;
            slides[current].classList.add('active');
            if (dots[current]) dots[current].classList.add('active');
        }

        function startAuto() {
            stopAuto();
            timer = setInterval(function() { goTo(current + 1); }, 5000);
        }

        function stopAuto() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        /* 点击指示器切换 */
        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                goTo(i);
                startAuto();
            });
        });

        var hero = document.querySelector('.bk-hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopAuto);
            hero.addEventListener('mouseleave', startAuto);
        }

        startAuto();
    }

    function animateStats() {
        var nums = document.querySelectorAll('.bk-stat-num');
        nums.forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            var current = 0;
            var step = Math.max(1, Math.floor(target / 40));
            var timer = setInterval(function() {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current;
            }, 30);
        });
    }

    function initCategoryCards() {
        document.querySelectorAll('.bk-category-card').forEach(function(card) {
            card.addEventListener('click', function() {
                document.querySelectorAll('.bk-category-card').forEach(function(c) { c.classList.remove('active'); });
                card.classList.add('active');
                var type = card.getAttribute('data-type');
                document.querySelectorAll('.bk-filter-btn').forEach(function(b) {
                    b.classList.remove('active');
                    if (b.getAttribute('data-filter') === type) b.classList.add('active');
                });
                renderVenues(type);
                document.getElementById('venuesSection').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function initFilterBtns() {
        document.querySelectorAll('.bk-filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.bk-filter-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var filter = btn.getAttribute('data-filter');
                document.querySelectorAll('.bk-category-card').forEach(function(c) {
                    c.classList.remove('active');
                    if (c.getAttribute('data-type') === filter) c.classList.add('active');
                });
                renderVenues(filter);
            });
        });
    }

    function renderVenues(filter) {
        var grid = document.getElementById('venuesGrid');
        grid.innerHTML = '';
        var filtered = filter === 'all' ? venues : venues.filter(function(v) { return v.type === filter; });
        filtered.forEach(function(venue) {
            var card = document.createElement('div');
            card.className = 'bk-venue-card';
            card.setAttribute('data-type', venue.type);
            var tagsHtml = venue.tags.map(function(t) { return '<span class="bk-venue-tag">' + t + '</span>'; }).join('');
            card.innerHTML = '<div class="bk-venue-img"><i class="fas ' + venue.icon + '"></i><span class="bk-venue-status ' + (venue.available ? 'available' : 'busy') + '">' + (venue.available ? '可预约' : '已约满') + '</span></div><div class="bk-venue-info"><h3>' + venue.name + '</h3><p>' + venue.desc + '</p><div class="bk-venue-tags">' + tagsHtml + '</div><div class="bk-venue-footer"><span class="bk-venue-capacity"><i class="fas fa-users"></i> 容纳' + venue.capacity + '人</span><button class="bk-book-btn" data-id="' + venue.id + '" ' + (venue.available ? '' : 'disabled') + '>' + (venue.available ? '立即预约' : '暂不可约') + '</button></div></div>';
            grid.appendChild(card);
        });
        grid.querySelectorAll('.bk-book-btn:not(:disabled)').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                openBookingModal(btn.getAttribute('data-id'));
            });
        });
        grid.querySelectorAll('.bk-venue-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var btn = card.querySelector('.bk-book-btn');
                if (btn) showVenueDetail(btn.getAttribute('data-id'));
            });
        });
    }

    function renderBookings() {
        var list = document.getElementById('bookingsList');
        list.innerHTML = '';
        if (myBookings.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-secondary);"><i class="fas fa-calendar-times" style="font-size:48px;margin-bottom:16px;display:block;color:#cbd5e1;"></i><p>暂无预约记录</p></div>';
            return;
        }
        var iconMap = { swimming: 'fa-swimmer', gym: 'fa-basketball-ball', library: 'fa-book', lab: 'fa-flask' };
        var statusMap = { confirmed: '已确认', pending: '待确认', cancelled: '已取消' };
        myBookings.forEach(function(booking) {
            var card = document.createElement('div');
            card.className = 'bk-booking-card';
            var cancelBtn = '';
            if (booking.status !== 'cancelled') {
                cancelBtn = '<button class="bk-cancel-btn" data-id="' + booking.id + '">取消预约</button>';
            }
            card.innerHTML = '<div class="bk-booking-icon ' + booking.type + '"><i class="fas ' + (iconMap[booking.type] || 'fa-building') + '"></i></div><div class="bk-booking-info"><h4>' + booking.venueName + '</h4><p><i class="fas fa-calendar"></i> ' + booking.date + ' ' + booking.timeSlot + '</p><p><i class="fas fa-tag"></i> ' + booking.purpose + ' · ' + booking.people + '人</p>' + (booking.note ? '<p><i class="fas fa-sticky-note"></i> ' + booking.note + '</p>' : '') + '<div class="bk-booking-actions"><span class="bk-booking-status ' + booking.status + '">' + statusMap[booking.status] + '</span>' + cancelBtn + '</div></div>';
            list.appendChild(card);
        });
        list.querySelectorAll('.bk-cancel-btn').forEach(function(btn) {
            btn.addEventListener('click', function() { cancelBooking(btn.getAttribute('data-id')); });
        });
    }

    function openBookingModal(venueId) {
        var venue = venues.find(function(v) { return v.id === venueId; });
        if (!venue) return;
        document.getElementById('bkVenueId').value = venueId;
        document.getElementById('bookingModalTitle').textContent = '预约 - ' + venue.name;
        document.getElementById('venuePreview').innerHTML = '<h4>' + venue.name + '</h4><p><i class="fas fa-map-marker-alt"></i> ' + venue.location + ' · <i class="fas fa-users"></i> 容纳' + venue.capacity + '人 · <i class="fas fa-clock"></i> ' + venue.openTime + '</p>';
        document.getElementById('bookingForm').reset();
        document.getElementById('timeSlotsPreview').innerHTML = '';
        document.getElementById('bookingModal').classList.add('active');
    }

    function setMinDate() {
        var dateInput = document.getElementById('bkDate');
        var today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    function initBookingForm() {
        var dateInput = document.getElementById('bkDate');
        dateInput.addEventListener('change', function() { updateTimeSlots(); });

        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var venueId = document.getElementById('bkVenueId').value;
            var venue = venues.find(function(v) { return v.id === venueId; });
            if (!venue) return;
            var date = document.getElementById('bkDate').value;
            var timeSlot = document.getElementById('bkTimeSlot').value;
            var purpose = document.getElementById('bkPurpose').value;
            var people = document.getElementById('bkPeople').value;
            var note = document.getElementById('bkNote').value;
            if (!date || !timeSlot || !purpose || !people) {
                showToast('请填写完整的预约信息');
                return;
            }
            var newBooking = {
                id: 'b' + Date.now(),
                venueId: venueId,
                venueName: venue.name,
                type: venue.type,
                date: date,
                timeSlot: timeSlot,
                purpose: purpose,
                people: parseInt(people),
                status: 'pending',
                note: note
            };
            myBookings.unshift(newBooking);
            saveBookings();
            showToast('预约提交成功！等待确认');
            document.getElementById('bookingModal').classList.remove('active');
            renderBookings();
        });
    }

    function updateTimeSlots() {
        var venueId = document.getElementById('bkVenueId').value;
        var date = document.getElementById('bkDate').value;
        var venue = venues.find(function(v) { return v.id === venueId; });
        if (!venue || !date) return;
        var slots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];
        var bookedSlots = myBookings.filter(function(b) {
            return b.venueId === venueId && b.date === date && b.status !== 'cancelled';
        }).map(function(b) { return b.timeSlot; });
        var html = '<h4>当日时段状态</h4><div class="bk-slot-grid">';
        slots.forEach(function(slot) {
            var isBooked = bookedSlots.indexOf(slot) > -1;
            html += '<div class="bk-slot ' + (isBooked ? 'booked' : 'available') + '">' + slot + (isBooked ? '<br>已约' : '<br>空闲') + '</div>';
        });
        html += '</div>';
        document.getElementById('timeSlotsPreview').innerHTML = html;
    }

    function showVenueDetail(venueId) {
        var venue = venues.find(function(v) { return v.id === venueId; });
        if (!venue) return;
        document.getElementById('detailModalTitle').textContent = venue.name;
        var body = document.getElementById('detailBody');
        body.innerHTML = '<div class="bk-detail-info">' +
            '<div class="bk-detail-row"><span class="bk-detail-label">场馆类型</span><span class="bk-detail-value">' + getTypeName(venue.type) + '</span></div>' +
            '<div class="bk-detail-row"><span class="bk-detail-label">所在位置</span><span class="bk-detail-value">' + venue.location + '</span></div>' +
            '<div class="bk-detail-row"><span class="bk-detail-label">容纳人数</span><span class="bk-detail-value">' + venue.capacity + '人</span></div>' +
            '<div class="bk-detail-row"><span class="bk-detail-label">开放时间</span><span class="bk-detail-value">' + venue.openTime + '</span></div>' +
            '<div class="bk-detail-row"><span class="bk-detail-label">配备设施</span><span class="bk-detail-value">' + venue.equipment + '</span></div>' +
            '<div class="bk-detail-row"><span class="bk-detail-label">当前状态</span><span class="bk-detail-value"><span class="bk-venue-status ' + (venue.available ? 'available' : 'busy') + '" style="position:static;">' + (venue.available ? '可预约' : '已约满') + '</span></span></div>' +
            '</div>' +
            '<p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">' + venue.desc + '</p>' +
            (venue.available ? '<button class="bk-submit-btn" onclick="document.getElementById(\'detailModal\').classList.remove(\'active\');document.querySelector(\'.bk-book-btn[data-id=' + venueId + ']\')&&document.querySelector(\'.bk-book-btn[data-id=' + venueId + ']\').click();"><i class="fas fa-calendar-check"></i> 立即预约</button>' : '');
        document.getElementById('detailModal').classList.add('active');
    }

    function getTypeName(type) {
        var map = { swimming: '游泳馆', gym: '体育馆', library: '图书馆', lab: '实训室' };
        return map[type] || type;
    }

    function cancelBooking(bookingId) {
        var booking = myBookings.find(function(b) { return b.id === bookingId; });
        if (booking) {
            booking.status = 'cancelled';
            saveBookings();
            showToast('预约已取消');
            renderBookings();
        }
    }

    function initModals() {
        document.getElementById('closeBookingModal').addEventListener('click', function() {
            document.getElementById('bookingModal').classList.remove('active');
        });
        document.getElementById('closeDetailModal').addEventListener('click', function() {
            document.getElementById('detailModal').classList.remove('active');
        });
        document.getElementById('bookingModal').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
        document.getElementById('detailModal').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
    }

    function showToast(msg) {
        var toast = document.getElementById('bkToast');
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
