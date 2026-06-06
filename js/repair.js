(function() {
    var repairRecords = loadRepairs();

    function loadRepairs() {
        if (window.CampusDB) {
            return CampusDB.getRepairs();
        }
        try { return JSON.parse(localStorage.getItem('campus_repairs') || '[]'); } catch(e) { return []; }
    }

    function saveRepairs() {
        if (window.CampusDB) {
            CampusDB.saveRepairs(repairRecords);
        } else {
            try { localStorage.setItem('campus_repairs', JSON.stringify(repairRecords)); } catch(e) {}
        }
    }

    var selectedType = '';
    var currentEvalId = '';
    var currentRating = 0;
    var selectedTags = [];

    var iconMap = { water: 'fa-faucet', furniture: 'fa-couch', network: 'fa-wifi', electric: 'fa-plug', door: 'fa-door-open', other: 'fa-question-circle' };
    var statusMap = { pending: '待处理', processing: '处理中', completed: '已完成' };
    var typeMap = { water: '水电维修', furniture: '家具维修', network: '网络故障', electric: '电器维修', door: '门窗维修', other: '其他报修' };
    var urgencyMap = { normal: '一般', urgent: '紧急', critical: '非常紧急' };

    function init() {
        animateStats();
        initTabs();
        initTypeCards();
        initForm();
        initUpload();
        renderRecords('all');
        renderEvaluations();
        initFilterTabs();
        initModals();
        initEvalStars();
        initEvalTags();
        initSubmitEval();
    }

    function animateStats() {
        var nums = document.querySelectorAll('.rep-stat-num');
        nums.forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            var current = 0;
            var step = Math.max(1, Math.floor(target / 40));
            var timer = setInterval(function() {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current;
            }, 30);
        });
    }

    function initTabs() {
        var tabs = document.querySelectorAll('.rep-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                var tabName = tab.getAttribute('data-tab');
                document.querySelectorAll('.rep-tab-content').forEach(function(c) { c.classList.remove('active'); });
                document.getElementById(tabName).classList.add('active');
            });
        });
    }

    function initTypeCards() {
        var cards = document.querySelectorAll('.rep-type-card');
        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                cards.forEach(function(c) { c.classList.remove('selected'); });
                card.classList.add('selected');
                selectedType = card.getAttribute('data-type');
            });
        });
    }

    function initForm() {
        var form = document.getElementById('repairForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!selectedType) {
                showToast('请选择报修类型');
                return;
            }
            var area = document.getElementById('repArea').value;
            var location = document.getElementById('repLocation').value;
            var desc = document.getElementById('repDesc').value;
            var contact = document.getElementById('repContact').value;
            var phone = document.getElementById('repPhone').value;
            if (!area || !location || !desc || !contact || !phone) {
                showToast('请填写完整的报修信息');
                return;
            }
            var urgencyRadio = document.querySelector('input[name="urgency"]:checked');
            var newRecord = {
                id: 'REP' + Date.now(),
                type: selectedType,
                typeName: typeMap[selectedType] || '其他报修',
                title: desc.substring(0, 15) + (desc.length > 15 ? '...' : ''),
                area: area,
                location: location,
                desc: desc,
                contact: contact,
                phone: phone,
                urgency: urgencyRadio ? urgencyRadio.value : 'normal',
                urgencyName: urgencyMap[urgencyRadio ? urgencyRadio.value : 'normal'],
                status: 'pending',
                time: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
                worker: '',
                workerPhone: ''
            };
            repairRecords.unshift(newRecord);
            saveRepairs();
            showToast('报修提交成功！工单号：' + newRecord.id);
            form.reset();
            document.querySelectorAll('.rep-type-card').forEach(function(c) { c.classList.remove('selected'); });
            selectedType = '';
            renderRecords('all');
        });
    }

    function initUpload() {
        var area = document.getElementById('uploadArea');
        if (area) {
            area.addEventListener('click', function() {
                showToast('图片上传功能演示（实际需后端支持）');
            });
        }
    }

    function renderRecords(status) {
        var list = document.getElementById('recordList');
        list.innerHTML = '';
        var filtered = repairRecords;
        if (status !== 'all') {
            filtered = repairRecords.filter(function(r) { return r.status === status; });
        }
        if (filtered.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-secondary);"><i class="fas fa-inbox" style="font-size:48px;margin-bottom:16px;display:block;color:#cbd5e1;"></i><p>暂无报修记录</p></div>';
            return;
        }
        filtered.forEach(function(record) {
            var card = document.createElement('div');
            card.className = 'rep-record-card';
            var actionsHtml = '';
            if (record.status === 'pending') {
                actionsHtml = '<button class="rep-action-btn detail" data-id="' + record.id + '">查看详情</button><button class="rep-action-btn cancel" data-id="' + record.id + '">取消报修</button>';
            } else if (record.status === 'processing') {
                actionsHtml = '<button class="rep-action-btn detail" data-id="' + record.id + '">查看详情</button>';
            } else {
                if (!record.rating) {
                    actionsHtml = '<button class="rep-action-btn detail" data-id="' + record.id + '">查看详情</button><button class="rep-action-btn rate" data-id="' + record.id + '">评价</button>';
                } else {
                    actionsHtml = '<button class="rep-action-btn detail" data-id="' + record.id + '">查看详情</button>';
                }
            }
            card.innerHTML = '<div class="rep-record-icon ' + record.type + '"><i class="fas ' + (iconMap[record.type] || 'fa-wrench') + '"></i></div><div class="rep-record-info"><h4>' + record.title + '</h4><p><i class="fas fa-map-marker-alt"></i> ' + record.location + '</p><p>' + record.typeName + ' · ' + record.urgencyName + '</p><div class="rep-record-footer"><span class="rep-record-time"><i class="fas fa-clock"></i> ' + record.time + '</span><span class="rep-record-status ' + record.status + '">' + statusMap[record.status] + '</span></div><div style="display:flex;gap:8px;margin-top:10px;">' + actionsHtml + '</div></div>';
            list.appendChild(card);
        });
        list.querySelectorAll('.rep-action-btn.detail').forEach(function(btn) {
            btn.addEventListener('click', function() { showDetail(btn.getAttribute('data-id')); });
        });
        list.querySelectorAll('.rep-action-btn.cancel').forEach(function(btn) {
            btn.addEventListener('click', function() { cancelRecord(btn.getAttribute('data-id')); });
        });
        list.querySelectorAll('.rep-action-btn.rate').forEach(function(btn) {
            btn.addEventListener('click', function() { openEvalModal(btn.getAttribute('data-id')); });
        });
    }

    function showDetail(id) {
        var record = repairRecords.find(function(r) { return r.id === id; });
        if (!record) return;
        document.getElementById('detailTitle').textContent = '报修详情 - ' + record.id;
        var body = document.getElementById('detailBody');
        var rows = '<div class="rep-detail-row"><span class="rep-detail-label">报修类型</span><span class="rep-detail-value">' + record.typeName + '</span></div>' +
            '<div class="rep-detail-row"><span class="rep-detail-label">报修区域</span><span class="rep-detail-value">' + record.area + '</span></div>' +
            '<div class="rep-detail-row"><span class="rep-detail-label">具体位置</span><span class="rep-detail-value">' + record.location + '</span></div>' +
            '<div class="rep-detail-row"><span class="rep-detail-label">问题描述</span><span class="rep-detail-value">' + record.desc + '</span></div>' +
            '<div class="rep-detail-row"><span class="rep-detail-label">紧急程度</span><span class="rep-detail-value">' + record.urgencyName + '</span></div>' +
            '<div class="rep-detail-row"><span class="rep-detail-label">联系人</span><span class="rep-detail-value">' + record.contact + '</span></div>' +
            '<div class="rep-detail-row"><span class="rep-detail-label">当前状态</span><span class="rep-detail-value"><span class="rep-record-status ' + record.status + '">' + statusMap[record.status] + '</span></span></div>';
        if (record.worker) {
            rows += '<div class="rep-detail-row"><span class="rep-detail-label">维修人员</span><span class="rep-detail-value">' + record.worker + '</span></div>';
        }
        var timeline = '<div class="rep-timeline">';
        timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot done"><i class="fas fa-check"></i></div><div class="rep-timeline-text"><h5>已提交</h5><p>' + record.time + '</p></div></div>';
        if (record.status === 'pending') {
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot current"><i class="fas fa-hourglass-half"></i></div><div class="rep-timeline-text"><h5>等待分配</h5><p>正在分配维修人员...</p></div></div>';
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot waiting"><i class="fas fa-wrench"></i></div><div class="rep-timeline-text"><h5>维修中</h5><p>等待维修</p></div></div>';
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot waiting"><i class="fas fa-check-double"></i></div><div class="rep-timeline-text"><h5>已完成</h5><p>等待完成</p></div></div>';
        } else if (record.status === 'processing') {
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot done"><i class="fas fa-check"></i></div><div class="rep-timeline-text"><h5>已分配</h5><p>维修人员：' + record.worker + '</p></div></div>';
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot current"><i class="fas fa-wrench"></i></div><div class="rep-timeline-text"><h5>维修中</h5><p>正在维修处理...</p></div></div>';
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot waiting"><i class="fas fa-check-double"></i></div><div class="rep-timeline-text"><h5>已完成</h5><p>等待完成</p></div></div>';
        } else {
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot done"><i class="fas fa-check"></i></div><div class="rep-timeline-text"><h5>已分配</h5><p>维修人员：' + record.worker + '</p></div></div>';
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot done"><i class="fas fa-check"></i></div><div class="rep-timeline-text"><h5>已维修</h5><p>维修完成</p></div></div>';
            timeline += '<div class="rep-timeline-step"><div class="rep-timeline-dot done"><i class="fas fa-check-double"></i></div><div class="rep-timeline-text"><h5>已完成</h5><p>报修完成</p></div></div>';
        }
        timeline += '</div>';
        body.innerHTML = rows + timeline;
        document.getElementById('detailModal').classList.add('active');
    }

    function cancelRecord(id) {
        var idx = repairRecords.findIndex(function(r) { return r.id === id; });
        if (idx > -1) {
            repairRecords.splice(idx, 1);
            showToast('报修已取消');
            renderRecords('all');
            document.querySelectorAll('.rep-filter-tab').forEach(function(t) {
                t.classList.remove('active');
                if (t.getAttribute('data-status') === 'all') t.classList.add('active');
            });
        }
    }

    function renderEvaluations() {
        var list = document.getElementById('evalList');
        list.innerHTML = '';
        var evaluated = repairRecords.filter(function(r) { return r.rating; });
        if (evaluated.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-secondary);"><i class="fas fa-star" style="font-size:48px;margin-bottom:16px;display:block;color:#cbd5e1;"></i><p>暂无评价记录</p><p style="font-size:13px;margin-top:8px;">完成报修后可对维修服务进行评价</p></div>';
            return;
        }
        evaluated.forEach(function(record) {
            var item = document.createElement('div');
            item.className = 'rep-eval-item';
            var starsHtml = '';
            for (var i = 0; i < 5; i++) {
                starsHtml += '<i class="fas fa-star" style="color:' + (i < record.rating ? '#f59e0b' : '#d1d5db') + '"></i>';
            }
            var tagsHtml = '';
            if (record.evalTags) {
                record.evalTags.forEach(function(tag) {
                    tagsHtml += '<span class="rep-eval-tag-display">' + tag + '</span>';
                });
            }
            item.innerHTML = '<div class="rep-eval-left"><h4>' + record.title + '</h4><p><i class="fas fa-map-marker-alt"></i> ' + record.location + '</p><p><i class="fas fa-wrench"></i> 维修人员：' + record.worker + '</p><div class="rep-eval-stars-display">' + starsHtml + '</div>' + (tagsHtml ? '<div class="rep-eval-tags-display">' + tagsHtml + '</div>' : '') + (record.evalComment ? '<p style="margin-top:8px;font-style:italic;color:var(--text-secondary);">"' + record.evalComment + '"</p>' : '') + '</div><div class="rep-eval-right"><div class="rep-eval-score">' + record.rating + '.0</div><span style="font-size:12px;color:var(--text-secondary);">' + record.time + '</span></div>';
            list.appendChild(item);
        });
    }

    function initFilterTabs() {
        var tabs = document.querySelectorAll('.rep-filter-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                renderRecords(tab.getAttribute('data-status'));
            });
        });
    }

    function initModals() {
        document.getElementById('closeDetailModal').addEventListener('click', function() {
            document.getElementById('detailModal').classList.remove('active');
        });
        document.getElementById('closeEvalModal').addEventListener('click', function() {
            document.getElementById('evalModal').classList.remove('active');
        });
        document.getElementById('detailModal').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
        document.getElementById('evalModal').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
    }

    function openEvalModal(id) {
        currentEvalId = id;
        currentRating = 0;
        selectedTags = [];
        document.querySelectorAll('#evalStars i').forEach(function(s) { s.classList.remove('active'); s.style.color = ''; });
        document.querySelectorAll('.rep-eval-tag').forEach(function(t) { t.classList.remove('selected'); });
        document.getElementById('evalComment').value = '';
        document.getElementById('evalModal').classList.add('active');
    }

    function initEvalStars() {
        var stars = document.querySelectorAll('#evalStars i');
        stars.forEach(function(star) {
            star.addEventListener('click', function() {
                currentRating = parseInt(star.getAttribute('data-rating'));
                stars.forEach(function(s, i) {
                    if (i < currentRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            star.addEventListener('mouseenter', function() {
                var rating = parseInt(star.getAttribute('data-rating'));
                stars.forEach(function(s, i) {
                    s.style.color = i < rating ? '#f59e0b' : '';
                });
            });
            star.addEventListener('mouseleave', function() {
                stars.forEach(function(s, i) {
                    s.style.color = i < currentRating ? '#f59e0b' : '';
                });
            });
        });
    }

    function initEvalTags() {
        document.querySelectorAll('.rep-eval-tag').forEach(function(tag) {
            tag.addEventListener('click', function() {
                var tagText = tag.getAttribute('data-tag');
                if (tag.classList.contains('selected')) {
                    tag.classList.remove('selected');
                    selectedTags = selectedTags.filter(function(t) { return t !== tagText; });
                } else {
                    tag.classList.add('selected');
                    selectedTags.push(tagText);
                }
            });
        });
    }

    function initSubmitEval() {
        document.getElementById('submitEval').addEventListener('click', function() {
            if (currentRating === 0) {
                showToast('请选择评分');
                return;
            }
            var record = repairRecords.find(function(r) { return r.id === currentEvalId; });
            if (record) {
                record.rating = currentRating;
                record.evalTags = selectedTags.slice();
                record.evalComment = document.getElementById('evalComment').value;
                saveRepairs();
                showToast('评价提交成功，感谢您的反馈！');
                document.getElementById('evalModal').classList.remove('active');
                renderRecords('all');
                renderEvaluations();
            }
        });
    }

    function showToast(msg) {
        var toast = document.getElementById('repToast');
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
