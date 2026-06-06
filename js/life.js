document.addEventListener('DOMContentLoaded', function() {
    var canteenTabs = document.querySelectorAll('.canteen-tab');
    canteenTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            canteenTabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    var recordMonth = document.getElementById('recordMonth');
    if (recordMonth) {
        recordMonth.addEventListener('change', function() {
        });
    }

    var menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(function(item) {
        var btn = document.createElement('button');
        btn.className = 'order-btn';
        btn.innerHTML = '<i class="fas fa-plus"></i> 点餐';
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            location.href = 'dining.html';
        });
        item.style.position = 'relative';
        item.appendChild(btn);
    });

    var menuSection = document.querySelector('.menu-grid');
    if (menuSection) {
        var moreLink = document.createElement('div');
        moreLink.style.cssText = 'text-align:center;padding:20px';
        moreLink.innerHTML = '<a href="dining.html" style="display:inline-flex;align-items:center;gap:8px;padding:10px 25px;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;border-radius:25px;text-decoration:none;font-weight:600;font-size:14px;transition:all 0.3s"><i class="fas fa-utensils"></i> 进入餐饮服务 · 在线点餐</a>';
        menuSection.parentNode.insertBefore(moreLink, menuSection.nextSibling);
    }
});
