(function() {
    var venues = [
        { id: 'v1', type: 'library', name: '图书馆一楼自习室', icon: 'fa-book-open', desc: '安静自习空间，配备独立书桌和台灯', capacity: 120, location: '图书馆1楼', tags: ['自习', '安静', '空调'], available: true, openTime: '07:00-22:00', equipment: '独立书桌、台灯、电源插座、WiFi' },
        { id: 'v2', type: 'library', name: '图书馆电子阅览室', icon: 'fa-desktop', desc: '配备电脑的电子阅览空间', capacity: 60, location: '图书馆2楼', tags: ['电脑', '电子资源', '打印'], available: true, openTime: '08:00-21:00', equipment: '电脑、打印机、扫描仪' },
        { id: 'v3', type: 'library', name: '图书馆研讨间A', icon: 'fa-comments', desc: '小组讨论专用空间，可白板演示', capacity: 10, location: '图书馆3楼', tags: ['讨论', '白板', '投影'], available: true, openTime: '08:00-21:00', equipment: '白板、投影仪、会议桌' },
        { id: 'v4', type: 'library', name: '图书馆研讨间B', icon: 'fa-comments', desc: '中型研讨空间，适合团队协作', capacity: 15, location: '图书馆3楼', tags: ['讨论', '协作', '投影'], available: false, openTime: '08:00-21:00', equipment: '白板、投影仪、视频会议设备' },
        { id: 'v5', type: 'activity', name: '学生活动中心', icon: 'fa-theater-masks', desc: '大型活动场地，可举办演出和晚会', capacity: 300, location: '学生活动中心1楼', tags: ['演出', '晚会', '大型活动'], available: true, openTime: '08:00-22:00', equipment: '舞台、音响、灯光、投影' },
        { id: 'v6', type: 'activity', name: '多功能会议室', icon: 'fa-chalkboard', desc: '中型会议空间，适合讲座和培训', capacity: 80, location: '行政楼2楼', tags: ['会议', '讲座', '培训'], available: true, openTime: '08:00-18:00', equipment: '投影仪、麦克风、会议桌' },
        { id: 'v7', type: 'activity', name: '社团活动室', icon: 'fa-guitar', desc: '社团日常活动空间', capacity: 30, location: '学生活动中心2楼', tags: ['社团', '排练', '活动'], available: true, openTime: '08:00-22:00', equipment: '镜子、音响、储物柜' },
        { id: 'v8', type: 'activity', name: '创业孵化室', icon: 'fa-lightbulb', desc: '创新创业团队专用工作空间', capacity: 20, location: '创新创业楼3楼', tags: ['创业', '办公', '路演'], available: false, openTime: '08:00-22:00', equipment: '办公桌椅、白板、网络' },
        { id: 'v9', type: 'stadium', name: '室内篮球馆', icon: 'fa-basketball-ball', desc: '标准篮球场地，木地板', capacity: 50, location: '体育馆1楼', tags: ['篮球', '室内', '木地板'], available: true, openTime: '06:00-22:00', equipment: '篮球架、计分板、更衣室' },
        { id: 'v10', type: 'stadium', name: '羽毛球馆', icon: 'fa-feather-alt', desc: '6片标准羽毛球场地', capacity: 30, location: '体育馆2楼', tags: ['羽毛球', '室内', '塑胶'], available: true, openTime: '06:00-22:00', equipment: '球网、计分器、更衣室' },
        { id: 'v11', type: 'stadium', name: '乒乓球室', icon: 'fa-table-tennis', desc: '10张标准乒乓球台', capacity: 20, location: '体育馆3楼', tags: ['乒乓球', '室内'], available: true, openTime: '06:00-22:00', equipment: '球台、球网、更衣室' },
        { id: 'v12', type: 'stadium', name: '田径操场', icon: 'fa-running', desc: '400米标准跑道，足球场', capacity: 200, location: '校园东区', tags: ['跑步', '足球', '室外'], available: true, openTime: '06:00-22:00', equipment: '跑道、足球场、看台' },
        { id: 'v13', type: 'lab', name: '计算机实训室A', icon: 'fa-laptop-code', desc: '配备高性能电脑的实训空间', capacity: 50, location: '信息楼2楼', tags: ['计算机', '编程', '实训'], available: true, openTime: '08:00-21:00', equipment: '电脑、投影仪、白板' },
        { id: 'v14', type: 'lab', name: '物理实验室', icon: 'fa-atom', desc: '物理实验专用空间', capacity: 30, location: '理学楼1楼', tags: ['物理', '实验', '科研'], available: true, openTime: '08:00-18:00', equipment: '实验仪器、安全设备' },
        { id: 'v15', type: 'lab', name: '电子实训室', icon: 'fa-microchip', desc: '电子电路实训空间', capacity: 40, location: '工学楼3楼', tags: ['电子', '电路', '焊接'], available: false, openTime: '08:00-18:00', equipment: '示波器、焊接工具、电源' },
        { id: 'v16', type: 'lab', name: '3D打印工作坊', icon: 'fa-cube', desc: '3D打印和创客空间', capacity: 15, location: '创新创业楼1楼', tags: ['3D打印', '创客', '设计'], available: true, openTime: '09:00-21:00', equipment: '3D打印机、设计软件' }
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
        animateStats();
        initCategoryCards();
        initFilterBtns();
        renderVenues('all');
        renderBookings();
        initModals();
        initBookingForm();
        setMinDate();
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
        var iconMap = { library: 'fa-book', activity: 'fa-users', stadium: 'fa-running', lab: 'fa-flask' };
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
        var map = { library: '图书馆', activity: '活动室', stadium: '操场/体育馆', lab: '实训室' };
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
