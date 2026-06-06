(function() {
    function getDormRepairs() {
        try { return JSON.parse(localStorage.getItem('campus_dorm_repairs') || '[]'); } catch(e) { return []; }
    }

    function saveDormRepairs(list) {
        localStorage.setItem('campus_dorm_repairs', JSON.stringify(list));
    }

    function showToast(msg) {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:12px 24px;border-radius:25px;font-size:14px;font-weight:600;z-index:9999';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 1500);
        setTimeout(function() { document.body.removeChild(toast); }, 1800);
    }

    function renderRepairs() {
        var list = document.getElementById('repairList');
        var repairs = getDormRepairs();
        if (repairs.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-tools"></i><p>暂无报修记录</p></div>';
            return;
        }
        var statusMap = { pending: '待处理', processing: '处理中', done: '已完成' };
        var iconMap = { '水电维修': 'fa-bolt', '门窗损坏': 'fa-door-open', '网络故障': 'fa-wifi', '空调故障': 'fa-snowflake', '家具损坏': 'fa-couch', '卫生问题': 'fa-broom', '其他': 'fa-wrench' };
        list.innerHTML = repairs.map(function(r) {
            return '<div class="data-item">' +
                '<div class="data-icon"><i class="fas ' + (iconMap[r.type] || 'fa-wrench') + '"></i></div>' +
                '<div class="data-info">' +
                '<span class="data-title">' + r.building + ' ' + r.room + ' · ' + r.type + '</span>' +
                '<span class="data-desc">' + r.desc + ' | ' + r.time + '</span>' +
                '</div>' +
                '<div class="data-right">' +
                '<span class="status-tag ' + r.status + '">' + statusMap[r.status] + '</span>' +
                '</div></div>';
        }).join('');
    }

    function renderHygieneNotices() {
        var container = document.getElementById('hygieneNotices');
        var notices = [
            { title: '本周卫生检查通知', time: '2024-12-18', body: '本周三（12月20日）下午14:00将进行宿舍卫生检查，请各宿舍提前整理内务，保持宿舍整洁。检查重点：地面清洁、物品摆放、垃圾清理、阳台整洁。' },
            { title: '上月卫生检查结果公示', time: '2024-12-01', body: '上月卫生检查已结束，优秀宿舍：1号楼301、2号楼205、3号楼418。请卫生不达标宿舍本周内完成整改。' },
            { title: '冬季宿舍安全提示', time: '2024-11-25', body: '冬季来临，请同学们注意用电安全，禁止使用大功率电器，保持宿舍通风，预防一氧化碳中毒。' }
        ];
        container.innerHTML = notices.map(function(n) {
            return '<div class="notification-card">' +
                '<div class="notif-header">' +
                '<span class="notif-title"><i class="fas fa-bullhorn" style="color:var(--primary-light);margin-right:8px"></i>' + n.title + '</span>' +
                '<span class="notif-time">' + n.time + '</span>' +
                '</div>' +
                '<div class="notif-body">' + n.body + '</div></div>';
        }).join('');
    }

    function renderScores() {
        var list = document.getElementById('scoreList');
        var scores = [
            { building: '1号楼', room: '301', score: 95, level: 'excellent' },
            { building: '1号楼', room: '502', score: 88, level: 'good' },
            { building: '2号楼', room: '205', score: 92, level: 'excellent' },
            { building: '2号楼', room: '310', score: 75, level: 'normal' },
            { building: '3号楼', room: '418', score: 96, level: 'excellent' },
            { building: '3号楼', room: '120', score: 60, level: 'poor' }
        ];
        var levelText = { excellent: '优秀', good: '良好', normal: '一般', poor: '待整改' };
        list.innerHTML = scores.map(function(s) {
            return '<div class="data-item">' +
                '<div class="data-icon"><i class="fas fa-door-open"></i></div>' +
                '<div class="data-info">' +
                '<span class="data-title">' + s.building + ' ' + s.room + '</span>' +
                '<span class="data-desc">最近检查评分</span>' +
                '</div>' +
                '<div class="data-right">' +
                '<div style="font-size:24px;font-weight:700;color:var(--primary-color)">' + s.score + '</div>' +
                '<span class="score-badge ' + s.level + '">' + levelText[s.level] + '</span>' +
                '</div></div>';
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', function() {
        renderRepairs();
        renderHygieneNotices();
        renderScores();

        document.getElementById('repairForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var building = document.getElementById('building').value;
            var room = document.getElementById('room').value;
            var type = document.getElementById('issueType').value;
            var desc = document.getElementById('issueDesc').value;

            if (!building || !room || !type || !desc) {
                showToast('请填写完整的报修信息');
                return;
            }

            var now = new Date();
            var timeStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

            var repairs = getDormRepairs();
            repairs.unshift({
                building: building,
                room: room,
                type: type,
                desc: desc,
                time: timeStr,
                status: 'pending'
            });
            saveDormRepairs(repairs);
            renderRepairs();
            this.reset();
            showToast('报修提交成功！');
        });
    });
})();
