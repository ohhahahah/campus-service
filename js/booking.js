(function() {
    'use strict';

    /* ============================================================
       场地数据：严格对应4大分类（一字不差）
       ============================================================ */
    var CATEGORIES = {
        study: {
            name: '静学工位区',
            icon: 'fa-book-reader',
            desc: '书院自习座位 · 脱机加油站 · 书吧研读位',
            eyebrow: 'STUDY SEATS'
        },
        sport: {
            name: '活力运动馆',
            icon: 'fa-basketball-ball',
            desc: '篮球馆 · 体操馆 · 健身房',
            eyebrow: 'SPORT HALL'
        },
        heal: {
            name: '心灵疗愈屋',
            icon: 'fa-spa',
            desc: '冥想室 · 情绪宣泄减压空间',
            eyebrow: 'HEALING SPACE'
        },
        multi: {
            name: '多功能活动室',
            icon: 'fa-people-group',
            desc: '会议室 · 桌游室 · 共享厨房 · 文化长廊',
            eyebrow: 'MULTI ROOM'
        }
    };

    var VENUES = [
        /* 静学工位区 */
        { id: 's1', cat: 'study', name: '尚学书院4B1009室', sub: '1-12号单人座位', capacity: 12, location: '尚学书院4B1009室', openTime: '08:00-22:00', icon: 'fa-chair', status: 'free', seatCount: 12 },
        { id: 's2', cat: 'study', name: '尚学书院4B1010室', sub: '1-12号单人座位', capacity: 12, location: '尚学书院4B1010室', openTime: '08:00-22:00', icon: 'fa-chair', status: 'free', seatCount: 12 },
        { id: 's3', cat: 'study', name: '尚学书院4B1011室', sub: '1-12号单人座位', capacity: 12, location: '尚学书院4B1011室', openTime: '08:00-22:00', icon: 'fa-chair', status: 'free', seatCount: 12 },
        { id: 's4', cat: 'study', name: '脱机加油站', sub: '1-24号单人自习座位', capacity: 24, location: '尚学书院1楼西侧', openTime: '07:00-22:30', icon: 'fa-laptop-house', status: 'free', seatCount: 24 },
        { id: 's5', cat: 'study', name: '尚学书吧', sub: '研读位·容纳10人', capacity: 10, location: '尚学书院1楼东侧', openTime: '09:00-21:00', icon: 'fa-book-open', status: 'free' },

        /* 活力运动馆 */
        { id: 'p1', cat: 'sport', name: '篮球馆', sub: '容纳100人', capacity: 100, location: '体育馆1楼', openTime: '06:00-22:00', icon: 'fa-basketball-ball', status: 'free' },
        { id: 'p2', cat: 'sport', name: '体育馆体操馆', sub: '容纳100人', capacity: 100, location: '体育馆2楼', openTime: '07:00-21:00', icon: 'fa-running', status: 'free' },
        { id: 'p3', cat: 'sport', name: '人"健"人爱健身房', sub: '容纳8人', capacity: 8, location: '体育馆1楼西侧', openTime: '06:00-22:00', icon: 'fa-dumbbell', status: 'free' },

        /* 心灵疗愈屋 */
        { id: 'h1', cat: 'heal', name: '沁心冥想室', sub: '容纳12人', capacity: 12, location: '心灵驿站1楼', openTime: '09:00-21:00', icon: 'fa-spa', status: 'free' },
        { id: 'h2', cat: 'heal', name: '情绪宣泄室', sub: '容纳1人', capacity: 1, location: '心灵驿站2楼', openTime: '10:00-20:00', icon: 'fa-heart', status: 'free' },

        /* 多功能活动室 */
        { id: 'm1', cat: 'multi', name: '"一站式"学生社区党建多功能会议室', sub: '容纳20人', capacity: 20, location: '学生社区1楼', openTime: '08:30-22:00', icon: 'fa-handshake', status: 'free' },
        { id: 'm2', cat: 'multi', name: '共享厨房、冷餐"会"、实训中心', sub: '容纳1人', capacity: 1, location: '学生社区2楼东侧', openTime: '10:00-21:00', icon: 'fa-utensils', status: 'free' },
        { id: 'm3', cat: 'multi', name: '益趣桌游室', sub: '1-4号桌·每桌容纳4人', capacity: 16, location: '学生社区2楼西侧', openTime: '13:00-22:00', icon: 'fa-dice', status: 'free' },
        { id: 'm4', cat: 'multi', name: '"一站式"学生社区二楼文化长廊', sub: '容纳30人', capacity: 30, location: '学生社区2楼', openTime: '08:00-22:00', icon: 'fa-palette', status: 'free' }
    ];

    /* 时间段（按小时分段） */
    var TIME_SLOTS = [
        { start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' }, { start: '11:00', end: '12:00' },
        { start: '14:00', end: '15:00' }, { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' }, { start: '19:00', end: '20:00' }
    ];

    /* ============================================================
       状态
       ============================================================ */
    var state = {
        currentView: 'home',
        activeCat: null,
        activeVenue: null,
        selectedDate: null,
        selectedSlots: [],  /* 支持多选时段 */
        selectedSeat: null
    };

    /* ============================================================
       工具
       ============================================================ */
    function $(id) { return document.getElementById(id); }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function fmtDate(d) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }
    function getWeekStr(d) {
        var w = ['日', '一', '二', '三', '四', '五', '六'];
        return '周' + w[d.getDay()];
    }

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function getAllVenues() {
        return VENUES;
    }

    function getVenuesByCat(cat) {
        return getAllVenues().filter(function(v) { return v.cat === cat; });
    }

    function getVenueById(id) {
        return getAllVenues().find(function(v) { return v.id === id; });
    }

    function getBookings() {
        if (window.CampusDB) return CampusDB.getBookings();
        try { return JSON.parse(localStorage.getItem('campus_bookings') || '[]'); } catch(e) { return []; }
    }
    function saveBooking(b) {
        if (window.CampusDB) return CampusDB.addBooking(b);
        var list = getBookings();
        list.unshift(b);
        try { localStorage.setItem('campus_bookings', JSON.stringify(list)); } catch(e) {}
    }

    /* 检查冲突：同一场地+同一日期+同一时间段不可重复预约 */
    function checkConflict(venueId, date, slot) {
        var list = getBookings();
        return list.some(function(b) {
            return b.venueId === venueId &&
                   b.date === date &&
                   b.timeSlot === slot &&
                   b.status !== 'cancelled';
        });
    }

    /* 检测指定场地+日期的所有时段是否全部被占用 */
    function areAllSlotsBooked(venueId, date) {
        var list = getBookings();
        var bookedSlots = [];
        list.forEach(function(b) {
            if (b.venueId === venueId && b.date === date && b.status !== 'cancelled') {
                bookedSlots.push(b.timeSlot);
            }
        });
        /* 检查每个时段是否都被预约 */
        return TIME_SLOTS.every(function(s) {
            var slotStr = s.start + '-' + s.end;
            return bookedSlots.indexOf(slotStr) > -1;
        });
    }

    /* 获取某场地+日期已预约的时段列表 */
    function getBookedSlots(venueId, date) {
        var list = getBookings();
        var bookedSlots = [];
        list.forEach(function(b) {
            if (b.venueId === venueId && b.date === date && b.status !== 'cancelled') {
                if (bookedSlots.indexOf(b.timeSlot) === -1) {
                    bookedSlots.push(b.timeSlot);
                }
            }
        });
        return bookedSlots;
    }

    /* ============================================================
       视图切换
       ============================================================ */
    function switchView(view) {
        state.currentView = view;
        var views = document.querySelectorAll('.bk-view');
        views.forEach(function(v) { v.classList.remove('active'); });
        var el = $('view-' + view);
        if (el) el.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ============================================================
       视图一：首页 - 分类卡片点击
       ============================================================ */
    function initHome() {
        document.querySelectorAll('.bk-cat-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var cat = card.getAttribute('data-cat');
                state.activeCat = cat;
                renderListView(cat);
                switchView('list');
            });
        });
    }

    /* ============================================================
       视图二：分类列表渲染（瀑布流）
       ============================================================ */
    function renderListView(cat) {
        var info = CATEGORIES[cat];
        var venues = getVenuesByCat(cat);
        var todayStr = fmtDate(new Date());

        $('listEyebrow').textContent = info.eyebrow;
        $('listTitle').textContent = info.name;
        $('listIntro').textContent = '共 ' + venues.length + ' 处空间 · ' + info.desc + ' · 轻触进入预约详情';

        var html = '';
        venues.forEach(function(v, idx) {
            /* 错落：每隔一张加 tall 样式让高度不齐 */
            var tallCls = (idx % 2 === 0) ? 'tall' : '';

            /* 检测今日所有时段是否都被预约 */
            var allBookedToday = areAllSlotsBooked(v.id, todayStr);
            var statusClass = allBookedToday ? 'busy' : 'free';
            var statusText = allBookedToday ? '今日约满' : (statusClass === 'free' ? '空闲可预约' : '已被占用');

            var descHtml = idx % 2 === 0 ? '<p class="venue-desc">开放时段内可在线预约，提交后系统自动记录，重复时段将自动拦截。</p>' : '';

            html += '<div class="venue-card ' + tallCls + '" data-cat="' + v.cat + '" data-id="' + v.id + '">' +
                '<div class="venue-card-head">' +
                    '<div class="venue-name">' + v.name + '</div>' +
                    '<span class="venue-status ' + statusClass + '">' + statusText + '</span>' +
                '</div>' +
                descHtml +
                '<div class="venue-meta">' +
                    '<div class="venue-meta-row"><i class="fas fa-users"></i><span>容纳 ' + v.capacity + ' 人 · ' + v.sub + '</span></div>' +
                    '<div class="venue-meta-row"><i class="fas fa-map-marker-alt"></i><span>' + v.location + '</span></div>' +
                    '<div class="venue-meta-row"><i class="far fa-clock"></i><span>' + v.openTime + '</span></div>' +
                '</div>' +
                '<div class="venue-foot">' +
                    '<span class="venue-price">免费预约</span>' +
                    '<span class="venue-go">立即预约<i class="fas fa-arrow-right"></i></span>' +
                '</div>' +
            '</div>';
        });

        $('venueList').innerHTML = html;

        /* 绑定点击 */
        document.querySelectorAll('#venueList .venue-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = card.getAttribute('data-id');
                var venue = getVenueById(id);
                if (!venue) return;

                /* 检测今日是否全部约满 */
                var todayStr = fmtDate(new Date());
                if (areAllSlotsBooked(venue.id, todayStr)) {
                    showToast('该场馆今日已约满，暂时无法预约', 'error');
                    return;
                }

                state.activeVenue = venue;
                renderDetailView(venue);
                switchView('detail');
            });
        });
    }

    /* ============================================================
       视图三：详情页渲染
       ============================================================ */
    function renderDetailView(venue) {
        var cat = CATEGORIES[venue.cat];
        var user = getCurrentUser();

        /* 生成未来7天日期 */
        var dates = [];
        var today = new Date();
        for (var i = 0; i < 7; i++) {
            var d = new Date(today.getTime() + i * 86400000);
            dates.push({ date: fmtDate(d), day: d.getDate(), week: getWeekStr(d), full: d });
        }
        state.selectedDate = dates[0].date;
        state.selectedSlots = [];  /* 重置多选时段 */
        state.selectedSeat = null;

        var dateHtml = dates.map(function(d, i) {
            return '<button class="date-cell' + (i === 0 ? ' active' : '') + '" data-date="' + d.date + '">' +
                '<div class="date-cell-week">' + d.week + '</div>' +
                '<div class="date-cell-day">' + d.day + '</div>' +
            '</button>';
        }).join('');

        /* 渲染时段（复选模式） */
        var slotHtml = TIME_SLOTS.map(function(s) {
            var conflict = checkConflict(venue.id, state.selectedDate, s.start + '-' + s.end);
            return '<button class="slot-cell' + (conflict ? ' disabled' : '') + '" data-slot="' + s.start + '-' + s.end + '">' +
                s.start + '~' + s.end +
            '</button>';
        }).join('');

        /* 座位选择 HTML（仅当场地配置了 seatCount 时显示） */
        var seatBlockHtml = '';
        if (venue.seatCount && venue.seatCount > 0) {
            var seatHtml = '';
            for (var n = 1; n <= venue.seatCount; n++) {
                seatHtml += '<button class="seat-cell" data-seat="' + n + '">' +
                    '<span class="seat-num">' + n + '</span>' +
                    '<span class="seat-label">号座位</span>' +
                '</button>';
            }
            seatBlockHtml =
                '<div class="detail-block">' +
                    '<h3 class="detail-block-title">选择座位</h3>' +
                    '<div class="seat-grid" id="seatGrid">' + seatHtml + '</div>' +
                    '<p class="slot-hint"><i class="fas fa-info-circle"></i> 已被其他同学预约的座位会自动置灰，单选一次仅可选定一个座位</p>' +
                '</div>';
        }

        /* 预填用户信息（如已登录） */
        var stuId = user && user.stuId ? user.stuId : '';
        var userName = user && user.name ? user.name : '';
        var phone = user && user.phone ? user.phone : '';

        $('detailWrap').innerHTML =
            '<div class="detail-cover" data-cat="' + venue.cat + '">' +
                '<span class="detail-cover-tag">' + cat.name + '</span>' +
                '<div class="detail-cover-icon"><i class="fas ' + venue.icon + '"></i></div>' +
            '</div>' +

            '<div class="detail-info">' +
                '<h2 class="detail-name">' + venue.name + '</h2>' +
                '<div class="detail-info-grid">' +
                    '<div class="detail-info-item"><div class="detail-info-label">容纳人数</div><div class="detail-info-val">' + venue.capacity + ' 人</div></div>' +
                    '<div class="detail-info-item"><div class="detail-info-label">场地地址</div><div class="detail-info-val">' + venue.location + '</div></div>' +
                    '<div class="detail-info-item"><div class="detail-info-label">开放时段</div><div class="detail-info-val">' + venue.openTime + '</div></div>' +
                    '<div class="detail-info-item"><div class="detail-info-label">场地规格</div><div class="detail-info-val">' + venue.sub + '</div></div>' +
                '</div>' +
            '</div>' +

            '<div class="detail-block">' +
                '<h3 class="detail-block-title">选择预约日期</h3>' +
                '<div class="date-picker" id="datePicker">' + dateHtml + '</div>' +
            '</div>' +

            seatBlockHtml +

            '<div class="detail-block">' +
                '<h3 class="detail-block-title">选择时间段 <span class="slot-multi-hint">（可多选）</span></h3>' +
                '<div class="slot-grid" id="slotGrid">' + slotHtml + '</div>' +
                '<p class="slot-hint"><i class="fas fa-info-circle"></i> 已预约的时段会自动置灰无法勾选，点击可选中或取消选中多个时段</p>' +
            '</div>' +

            '<div class="detail-block">' +
                '<h3 class="detail-block-title">填写预约信息</h3>' +
                '<form class="bk-form" id="bookingForm">' +
                    '<div class="bk-field-row">' +
                        '<div class="bk-field"><label class="bk-field-label">学号<em>*</em></label><input class="bk-input" id="fStuId" value="' + stuId + '" placeholder="请输入学号" required></div>' +
                        '<div class="bk-field"><label class="bk-field-label">姓名<em>*</em></label><input class="bk-input" id="fName" value="' + userName + '" placeholder="请输入姓名" required></div>' +
                    '</div>' +
                    '<div class="bk-field"><label class="bk-field-label">联系手机号<em>*</em></label><input class="bk-input" id="fPhone" value="' + phone + '" placeholder="请输入11位手机号" maxlength="11" required></div>' +
                    '<div class="bk-field"><label class="bk-field-label">预约用途<em>*</em></label><textarea class="bk-textarea" id="fPurpose" placeholder="请简要说明预约用途（如：自习、社团活动、体育锻炼等）" required></textarea></div>' +
                    '<div class="bk-time-display" id="timeDisplay">尚未选择日期与时间段</div>' +
                '</form>' +
            '</div>' +

            '<div class="detail-actions">' +
                '<button class="bk-submit-btn" id="submitBtn"><i class="fas fa-check-circle"></i> 提交预约</button>' +
                '<button class="bk-cancel-btn" id="cancelBtn">取消返回</button>' +
            '</div>';

        /* 日期切换 */
        document.querySelectorAll('#datePicker .date-cell').forEach(function(cell) {
            cell.addEventListener('click', function() {
                document.querySelectorAll('#datePicker .date-cell').forEach(function(c) { c.classList.remove('active'); });
                cell.classList.add('active');
                state.selectedDate = cell.getAttribute('data-date');
                /* 重新渲染时间段（根据新日期检测冲突） */
                refreshSlots(venue);
                /* 重新渲染座位（同一场地+新日期下，已被预约的座位需重新检测） */
                refreshSeats(venue);
                updateTimeDisplay();
            });
        });

        /* 时间段切换（复选模式） */
        bindSlots();
        /* 座位选择 */
        bindSeats();
        /* 提交 */
        $('submitBtn').addEventListener('click', function() { handleSubmit(venue); });
        $('cancelBtn').addEventListener('click', function() { switchView('list'); });
    }

    /* 刷新座位：根据当前 selectedDate，检测已被预约的座位并置灰 */
    function refreshSeats(venue) {
        var seatGrid = $('seatGrid');
        if (!seatGrid || !venue.seatCount) return;
        var bookedSeats = getBookedSeatNumbers(venue.id, state.selectedDate);
        var html = '';
        for (var n = 1; n <= venue.seatCount; n++) {
            var occupied = bookedSeats.indexOf(n) > -1;
            html += '<button class="seat-cell' + (occupied ? ' disabled' : '') + '" data-seat="' + n + '"' + (occupied ? ' disabled' : '') + '>' +
                '<span class="seat-num">' + n + '</span>' +
                '<span class="seat-label">号座位</span>' +
            '</button>';
        }
        seatGrid.innerHTML = html;
        state.selectedSeat = null;
        bindSeats();
    }

    /* 获取指定场地+日期下，所有已被预约的座位号 */
    function getBookedSeatNumbers(venueId, date) {
        var list = getBookings();
        var seats = [];
        list.forEach(function(b) {
            if (b.venueId === venueId &&
                b.date === date &&
                b.status !== 'cancelled' &&
                b.seatNo != null) {
                seats.push(Number(b.seatNo));
            }
        });
        return seats;
    }

    function bindSeats() {
        document.querySelectorAll('#seatGrid .seat-cell').forEach(function(cell) {
            cell.addEventListener('click', function() {
                if (cell.classList.contains('disabled') || cell.disabled) return;
                document.querySelectorAll('#seatGrid .seat-cell').forEach(function(c) { c.classList.remove('active'); });
                cell.classList.add('active');
                state.selectedSeat = cell.getAttribute('data-seat');
                updateTimeDisplay();
            });
        });
    }

    function refreshSlots(venue) {
        var slotGrid = $('slotGrid');
        if (!slotGrid) return;
        var html = TIME_SLOTS.map(function(s) {
            var conflict = checkConflict(venue.id, state.selectedDate, s.start + '-' + s.end);
            return '<button class="slot-cell' + (conflict ? ' disabled' : '') + '" data-slot="' + s.start + '-' + s.end + '">' +
                s.start + '~' + s.end +
            '</button>';
        }).join('');
        slotGrid.innerHTML = html;
        state.selectedSlots = [];  /* 重置多选时段 */
        bindSlots();
    }

    /* 时段复选模式绑定 */
    function bindSlots() {
        document.querySelectorAll('#slotGrid .slot-cell').forEach(function(cell) {
            cell.addEventListener('click', function() {
                if (cell.classList.contains('disabled')) return;

                var slot = cell.getAttribute('data-slot');
                var idx = state.selectedSlots.indexOf(slot);

                if (idx > -1) {
                    /* 已选中，取消选择 */
                    state.selectedSlots.splice(idx, 1);
                    cell.classList.remove('active');
                } else {
                    /* 未选中，添加选择 */
                    state.selectedSlots.push(slot);
                    cell.classList.add('active');
                }
                updateTimeDisplay();
            });
        });
    }

    function updateTimeDisplay() {
        var el = $('timeDisplay');
        if (!el) return;
        if (state.selectedDate && state.selectedSlots.length > 0) {
            /* 显示多选时段 */
            var slotsText = state.selectedSlots.map(function(slot) {
                var parts = slot.split('-');
                return '<strong>' + parts[0] + '</strong>~<strong>' + parts[1] + '</strong>';
            }).join('、');

            var seatTxt = state.selectedSeat ? ' · 座位 <strong>' + state.selectedSeat + '号</strong>' : '';
            var countTxt = state.selectedSlots.length > 1 ? '（共 ' + state.selectedSlots.length + ' 个时段）' : '';
            el.innerHTML = '已选 <strong>' + state.selectedDate + '</strong> ' + slotsText + countTxt + seatTxt + ' · 预约时段已确认';
        } else if (state.selectedDate) {
            el.textContent = '已选日期 ' + state.selectedDate + '，请选择时间段（可多选）';
        } else {
            el.textContent = '尚未选择日期与时间段';
        }
    }

    /* ============================================================
       提交预约（支持多时段批量预约）
       ============================================================ */
    function handleSubmit(venue) {
        var stuId = $('fStuId').value.trim();
        var name = $('fName').value.trim();
        var phone = $('fPhone').value.trim();
        var purpose = $('fPurpose').value.trim();

        if (!stuId) { showToast('请填写学号', 'error'); return; }
        if (!name) { showToast('请填写姓名', 'error'); return; }
        if (!phone || !/^1\d{10}$/.test(phone)) { showToast('请输入正确的11位手机号', 'error'); return; }
        if (!purpose) { showToast('请填写预约用途', 'error'); return; }
        if (!state.selectedDate) { showToast('请选择预约日期', 'error'); return; }
        if (state.selectedSlots.length === 0) { showToast('请至少选择一个时间段', 'error'); return; }

        /* 若场地为单人座位类型，必须选定座位号 */
        var needSeat = venue.seatCount && venue.seatCount > 0;
        if (needSeat && !state.selectedSeat) {
            showToast('请选择一个座位', 'error');
            return;
        }

        /* 座位类型场地：检测座位是否已被预约 */
        if (needSeat) {
            var booked = getBookedSeatNumbers(venue.id, state.selectedDate);
            if (booked.indexOf(Number(state.selectedSeat)) > -1) {
                showToast('该座位已被其他同学预约，请重新选择', 'error');
                refreshSeats(venue);
                return;
            }
        }

        /* 多时段逐一检测冲突并提交 */
        var successCount = 0;
        var failCount = 0;
        var failedSlots = [];

        state.selectedSlots.forEach(function(slot) {
            /* 检测该时段是否已被他人预约（双重检测） */
            if (checkConflict(venue.id, state.selectedDate, slot)) {
                failCount++;
                var parts = slot.split('-');
                failedSlots.push(parts[0] + '~' + parts[1]);
                return;
            }

            /* 创建预约记录 */
            var parts = slot.split('-');
            var booking = {
                id: 'BK' + Date.now() + '_' + successCount,
                venueId: venue.id,
                venueName: venue.name,
                venueCat: venue.cat,
                venueCatName: CATEGORIES[venue.cat].name,
                date: state.selectedDate,
                timeSlot: slot,
                startTime: parts[0],
                endTime: parts[1],
                seatNo: needSeat ? Number(state.selectedSeat) : null,
                stuId: stuId,
                name: name,
                phone: phone,
                purpose: purpose,
                people: 1,
                status: 'confirmed',
                note: '',
                createdAt: new Date().toISOString()
            };

            saveBooking(booking);
            successCount++;
        });

        /* 刷新时段显示（更新已预约状态） */
        refreshSlots(venue);

        /* 根据结果提示 */
        if (failCount === 0) {
            /* 全部成功 */
            var msg = successCount > 1
                ? '已成功创建 <strong>' + successCount + ' 条</strong>预约记录，存入「<a href="profile.html#bookings" style="color:#a890c5;text-decoration:underline">我的预约记录</a>」，这些时段已被锁定。'
                : '已生成预约记录并存入「<a href="profile.html#bookings" style="color:#a890c5;text-decoration:underline">我的预约记录</a>」，该时段已被锁定。';
            $('bkToastMsg').innerHTML = msg;
            var toast = $('bkToast');
            toast.classList.add('show');
            setTimeout(function() { toast.classList.remove('show'); }, 5000);
        } else if (successCount === 0) {
            /* 全部失败 */
            showToast('时段 ' + failedSlots.join('、') + ' 已被预约，请选择其他时段', 'error');
        } else {
            /* 部分成功 */
            var toast = $('bkToast');
            toast.classList.add('show');
            $('bkToastMsg').innerHTML = '成功创建 <strong>' + successCount + ' 条</strong>预约记录，<strong>' + failCount + ' 条</strong>失败（' + failedSlots.join('、') + ' 已被预约）。<a href="profile.html#bookings" style="color:#a890c5;text-decoration:underline">查看预约记录</a>';
            setTimeout(function() { toast.classList.remove('show'); }, 5000);
        }

        /* 1.5秒后返回列表 */
        setTimeout(function() {
            renderListView(state.activeCat);
            switchView('list');
        }, 1500);
    }

    /* ============================================================
       Toast 提示
       ============================================================ */
    var toastTimer = null;
    function showToast(msg, type) {
        var toast = $('bkToast');
        if (!toast) return;
        var icon = toast.querySelector('.bk-toast-icon i');
        var title = toast.querySelector('.bk-toast-body h4');
        var body = $('bkToastMsg');

        if (type === 'error') {
            toast.style.borderColor = 'rgba(196,122,138,0.5)';
            icon.className = 'fas fa-exclamation';
            icon.parentElement.style.background = 'linear-gradient(135deg,#c47a8a,#a85870)';
            title.textContent = '提示';
        } else {
            toast.style.borderColor = 'rgba(143,184,154,0.4)';
            icon.className = 'fas fa-check';
            icon.parentElement.style.background = 'linear-gradient(135deg,#8fb89a,#7da06a)';
            title.textContent = '操作成功';
        }
        body.innerHTML = msg;
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 3500);
    }

    /* ============================================================
       返回按钮
       ============================================================ */
    function initBackBtns() {
        var b1 = $('backToHome');
        if (b1) b1.addEventListener('click', function() { switchView('home'); });
        var b2 = $('backToList');
        if (b2) b2.addEventListener('click', function() { switchView('list'); });

        var close = $('bkToastClose');
        if (close) close.addEventListener('click', function() { $('bkToast').classList.remove('show'); });

        /* 浏览器回退键支持 */
        window.addEventListener('popstate', function() {
            if (state.currentView === 'detail') switchView('list');
            else if (state.currentView === 'list') switchView('home');
        });
    }

    /* ============================================================
       初始化
       ============================================================ */
    function init() {
        initHome();
        initBackBtns();

        /* URL hash 支持：#cat=study 直达分类 */
        var hash = window.location.hash;
        if (hash) {
            var m = hash.match(/cat=(\w+)/);
            if (m && CATEGORIES[m[1]]) {
                state.activeCat = m[1];
                renderListView(m[1]);
                switchView('list');
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
