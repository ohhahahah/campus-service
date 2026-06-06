(function() {
    function init() {
        updateTime();
        setInterval(updateTime, 1000);
        animateStats();
        initCharts();
        renderRealtime();
        renderRanks();
    }

    function updateTime() {
        var now = new Date();
        var str = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');
        document.getElementById('heroTime').textContent = str;
    }

    function animateStats() {
        document.querySelectorAll('.bd-stat-num').forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            var current = 0;
            var step = Math.max(1, Math.floor(target / 50));
            var timer = setInterval(function() {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current.toLocaleString();
            }, 30);
        });
    }

    function initCharts() {
        var textColor = '#94a3b8';
        var gridColor = 'rgba(255,255,255,0.06)';

        new Chart(document.getElementById('pieChart'), {
            type: 'doughnut',
            data: {
                labels: ['教材课本', '数码电子', '生活用品', '运动器材', '实训工具', '小家电', '其他'],
                datasets: [{
                    data: [35, 22, 18, 10, 8, 4, 3],
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#64748b'],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: textColor, padding: 12, font: { size: 12 } } }
                }
            }
        });

        new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [{
                    label: '交易量',
                    data: [180, 120, 250, 310, 420, 380, 150, 90, 350, 480, 520, 390],
                    backgroundColor: 'rgba(59,130,246,0.7)',
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { display: false } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });

        new Chart(document.getElementById('lineChart'), {
            type: 'line',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [{
                    label: '访问量',
                    data: [3200, 4100, 3800, 4500, 5200, 2800, 2100],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { display: false } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });

        new Chart(document.getElementById('repairChart'), {
            type: 'polarArea',
            data: {
                labels: ['水电维修', '网络故障', '家具维修', '电器维修', '门窗维修', '其他'],
                datasets: [{
                    data: [35, 28, 15, 12, 6, 4],
                    backgroundColor: [
                        'rgba(59,130,246,0.7)', 'rgba(139,92,246,0.7)', 'rgba(16,185,129,0.7)',
                        'rgba(245,158,11,0.7)', 'rgba(6,182,212,0.7)', 'rgba(100,116,139,0.7)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { color: textColor, padding: 10, font: { size: 12 } } } },
                scales: { r: { ticks: { display: false }, grid: { color: gridColor } } }
            }
        });

        new Chart(document.getElementById('multiLineChart'), {
            type: 'line',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [
                    { label: '二手市场', data: [800, 950, 870, 1100, 1300, 600, 450], borderColor: '#3b82f6', tension: 0.4, pointRadius: 3 },
                    { label: '教务服务', data: [1200, 1400, 1300, 1500, 1600, 400, 300], borderColor: '#10b981', tension: 0.4, pointRadius: 3 },
                    { label: '后勤报修', data: [200, 180, 250, 220, 300, 150, 100], borderColor: '#f59e0b', tension: 0.4, pointRadius: 3 },
                    { label: '场馆预约', data: [350, 400, 380, 450, 500, 600, 550], borderColor: '#8b5cf6', tension: 0.4, pointRadius: 3 },
                    { label: '兼职互助', data: [150, 200, 180, 220, 280, 350, 300], borderColor: '#ec4899', tension: 0.4, pointRadius: 3 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor, padding: 16 } } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { display: false } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });

        new Chart(document.getElementById('venueChart'), {
            type: 'bar',
            data: {
                labels: ['图书馆', '篮球馆', '羽毛球馆', '活动中心', '会议室', '实训室'],
                datasets: [{
                    label: '预约次数',
                    data: [580, 420, 350, 310, 260, 236],
                    backgroundColor: [
                        'rgba(59,130,246,0.7)', 'rgba(245,158,11,0.7)', 'rgba(16,185,129,0.7)',
                        'rgba(139,92,246,0.7)', 'rgba(6,182,212,0.7)', 'rgba(236,72,153,0.7)'
                    ],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { display: false } }
                }
            }
        });
    }

    function renderRealtime() {
        var trades = [
            { text: '张同学 购买了 高等数学教材', time: '2分钟前', dot: 'blue' },
            { text: '李同学 发布了 iPad Air 5', time: '5分钟前', dot: 'green' },
            { text: '王同学 购买了 台灯', time: '8分钟前', dot: 'blue' },
            { text: '赵同学 发布了 自行车', time: '12分钟前', dot: 'green' },
            { text: '刘同学 购买了 Python编程书', time: '15分钟前', dot: 'blue' },
            { text: '陈同学 发布了 小风扇', time: '20分钟前', dot: 'green' }
        ];
        var repairs = [
            { text: '3号楼204 水管漏水', time: '3分钟前', dot: 'yellow' },
            { text: '5号楼601 网络故障', time: '10分钟前', dot: 'purple' },
            { text: '教学楼A302 灯管损坏', time: '18分钟前', dot: 'yellow' },
            { text: '1号楼105 门锁故障', time: '25分钟前', dot: 'yellow' },
            { text: '食堂2楼 空调不制冷', time: '30分钟前', dot: 'purple' },
            { text: '4号楼303 插座松动', time: '35分钟前', dot: 'yellow' }
        ];
        var bookings = [
            { text: '图书馆自习室 14:00-16:00', time: '1分钟前', dot: 'blue' },
            { text: '篮球馆 16:00-18:00', time: '6分钟前', dot: 'green' },
            { text: '研讨间A 10:00-12:00', time: '14分钟前', dot: 'blue' },
            { text: '羽毛球馆 09:00-11:00', time: '22分钟前', dot: 'green' },
            { text: '会议室 15:00-17:00', time: '28分钟前', dot: 'blue' },
            { text: '实训室 13:00-15:00', time: '40分钟前', dot: 'green' }
        ];

        renderList('tradeList', trades);
        renderList('repairList', repairs);
        renderList('bookingList', bookings);
    }

    function renderList(id, items) {
        var el = document.getElementById(id);
        el.innerHTML = items.map(function(item) {
            return '<div class="bd-realtime-item"><span class="bd-realtime-dot ' + item.dot + '"></span><span class="bd-realtime-text">' + item.text + '</span><span class="bd-realtime-time">' + item.time + '</span></div>';
        }).join('');
    }

    function renderRanks() {
        var products = [
            { name: '高等数学教材', value: '326次' },
            { name: 'iPad平板', value: '218次' },
            { name: '自行车', value: '186次' },
            { name: '台灯', value: '165次' },
            { name: 'Python编程书', value: '142次' }
        ];
        var clubs = [
            { name: '编程社团', value: '860人' },
            { name: '摄影协会', value: '720人' },
            { name: '吉他社', value: '650人' },
            { name: '篮球社', value: '580人' },
            { name: '志愿者协会', value: '520人' }
        ];
        var venues = [
            { name: '图书馆自习室', value: '580次' },
            { name: '室内篮球馆', value: '420次' },
            { name: '羽毛球馆', value: '350次' },
            { name: '学生活动中心', value: '310次' },
            { name: '多功能会议室', value: '260次' }
        ];

        renderRankList('hotProducts', products);
        renderRankList('activeClubs', clubs);
        renderRankList('hotVenues', venues);
    }

    function renderRankList(id, items) {
        var el = document.getElementById(id);
        el.innerHTML = items.map(function(item, i) {
            var cls = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : 'normal';
            return '<div class="bd-rank-item"><span class="bd-rank-num ' + cls + '">' + (i + 1) + '</span><span class="bd-rank-name">' + item.name + '</span><span class="bd-rank-value">' + item.value + '</span></div>';
        }).join('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
