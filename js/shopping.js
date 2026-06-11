(function() {
    /* ===== 校园超市轮播图 ===== */
    (function initShopCarousel() {
        var slides = document.querySelectorAll('#shopCarouselTrack .express-carousel-slide');
        var dots = document.querySelectorAll('#shopCarouselDots .express-carousel-dot');
        var prevBtn = document.getElementById('shopCarouselPrev');
        var nextBtn = document.getElementById('shopCarouselNext');
        if (!slides.length) return;
        var current = 0;
        var total = slides.length;
        var timer = null;

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + total) % total;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }
        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }
        function startAuto() { stopAuto(); timer = setInterval(next, 3000); }
        function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

        if (prevBtn) prevBtn.addEventListener('click', function() { prev(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', function() { next(); startAuto(); });
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                goTo(parseInt(this.getAttribute('data-index')));
                startAuto();
            });
        });
        var carousel = document.querySelector('.express-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAuto);
            carousel.addEventListener('mouseleave', startAuto);
        }
        startAuto();
    })();

    var products = {
        snack: [
            { name: '乐事薯片', price: 8.5, img: 'https://via.placeholder.com/200x140/fef3c7/92400e?text=薯片' },
            { name: '奥利奥饼干', price: 9.9, img: 'https://via.placeholder.com/200x140/dbeafe/1e40af?text=奥利奥' },
            { name: '卫龙辣条', price: 5.0, img: 'https://via.placeholder.com/200x140/fee2e2/991b1b?text=辣条' },
            { name: '坚果混合装', price: 15.8, img: 'https://via.placeholder.com/200x140/d1fae5/065f46?text=坚果' },
            { name: '巧克力威化', price: 6.5, img: 'https://via.placeholder.com/200x140/fce7f3/9d174d?text=威化' },
            { name: '海苔夹心脆', price: 12.0, img: 'https://via.placeholder.com/200x140/ecfdf5/065f46?text=海苔' }
        ],
        drink: [
            { name: '农夫山泉', price: 2.0, img: 'https://via.placeholder.com/200x140/dbeafe/1e40af?text=矿泉水' },
            { name: '可口可乐', price: 3.5, img: 'https://via.placeholder.com/200x140/fee2e2/991b1b?text=可乐' },
            { name: '纯牛奶250ml', price: 4.5, img: 'https://via.placeholder.com/200x140/fef3c7/92400e?text=牛奶' },
            { name: '酸奶杯装', price: 6.0, img: 'https://via.placeholder.com/200x140/fce7f3/9d174d?text=酸奶' },
            { name: '橙汁1L', price: 8.8, img: 'https://via.placeholder.com/200x140/fed7aa/9a3412?text=橙汁' },
            { name: '咖啡即饮', price: 5.5, img: 'https://via.placeholder.com/200x140/d1d5db/374151?text=咖啡' }
        ],
        daily: [
            { name: '抽纸3包装', price: 8.9, img: 'https://via.placeholder.com/200x140/e0e7ff/3730a3?text=纸巾' },
            { name: '洗衣液500g', price: 12.5, img: 'https://via.placeholder.com/200x140/dbeafe/1e40af?text=洗衣液' },
            { name: '牙膏套装', price: 15.0, img: 'https://via.placeholder.com/200x140/d1fae5/065f46?text=牙膏' },
            { name: '沐浴露400ml', price: 18.8, img: 'https://via.placeholder.com/200x140/fce7f3/9d174d?text=沐浴露' },
            { name: '垃圾袋卷装', price: 5.0, img: 'https://via.placeholder.com/200x140/f3f4f6/374151?text=垃圾袋' },
            { name: '衣架10个装', price: 6.5, img: 'https://via.placeholder.com/200x140/fef3c7/92400e?text=衣架' }
        ],
        stationery: [
            { name: '中性笔3支装', price: 5.0, img: 'https://via.placeholder.com/200x140/dbeafe/1e40af?text=中性笔' },
            { name: '笔记本A5', price: 8.0, img: 'https://via.placeholder.com/200x140/fef3c7/92400e?text=笔记本' },
            { name: '荧光笔套装', price: 6.5, img: 'https://via.placeholder.com/200x140/d1fae5/065f46?text=荧光笔' },
            { name: '便利贴彩色', price: 4.0, img: 'https://via.placeholder.com/200x140/fce7f3/9d174d?text=便利贴' },
            { name: '文件夹5个装', price: 9.9, img: 'https://via.placeholder.com/200x140/e0e7ff/3730a3?text=文件夹' },
            { name: '橡皮擦套装', price: 3.5, img: 'https://via.placeholder.com/200x140/f3f4f6/374151?text=橡皮擦' }
        ]
    };

    var cart = [];
    var currentCat = 'snack';

    function getShopOrders() {
        try { return JSON.parse(localStorage.getItem('campus_shop_orders') || '[]'); } catch(e) { return []; }
    }

    function saveShopOrders(list) {
        localStorage.setItem('campus_shop_orders', JSON.stringify(list));
    }

    function showToast(msg) {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:12px 24px;border-radius:25px;font-size:14px;font-weight:600;z-index:9999';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 1500);
        setTimeout(function() { document.body.removeChild(toast); }, 1800);
    }

    function renderProducts() {
        var grid = document.getElementById('productGrid');
        var items = products[currentCat] || [];
        grid.innerHTML = items.map(function(item, idx) {
            return '<div class="product-item">' +
                '<img src="' + item.img + '" alt="' + item.name + '">' +
                '<div class="product-info">' +
                '<h4>' + item.name + '</h4>' +
                '<div class="product-price">¥' + item.price.toFixed(1) + '</div>' +
                '<button class="add-cart-btn" data-idx="' + idx + '"><i class="fas fa-cart-plus"></i> 加入购物车</button>' +
                '</div></div>';
        }).join('');

        grid.querySelectorAll('.add-cart-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-idx'));
                var item = products[currentCat][idx];
                addToCart(item);
            });
        });
    }

    function addToCart(item) {
        var found = cart.find(function(c) { return c.name === item.name; });
        if (found) {
            found.qty++;
        } else {
            cart.push({ name: item.name, price: item.price, qty: 1 });
        }
        renderCart();
        showToast('已添加：' + item.name);
    }

    function renderCart() {
        var emptyEl = document.getElementById('shopCartEmpty');
        var itemsEl = document.getElementById('shopCartItems');
        var totalEl = document.getElementById('shopCartTotal');
        var checkoutArea = document.getElementById('shopCheckoutArea');

        if (cart.length === 0) {
            emptyEl.style.display = '';
            itemsEl.innerHTML = '';
            totalEl.style.display = 'none';
            checkoutArea.style.display = 'none';
            return;
        }

        emptyEl.style.display = 'none';
        totalEl.style.display = '';
        checkoutArea.style.display = '';

        var total = 0;
        itemsEl.innerHTML = cart.map(function(item, idx) {
            total += item.price * item.qty;
            return '<div class="cart-item">' +
                '<div class="cart-item-info">' +
                '<div class="cart-item-name">' + item.name + '</div>' +
                '<div class="cart-item-price">¥' + item.price.toFixed(1) + '</div>' +
                '</div>' +
                '<div class="cart-qty">' +
                '<button data-action="minus" data-idx="' + idx + '">-</button>' +
                '<span>' + item.qty + '</span>' +
                '<button data-action="plus" data-idx="' + idx + '">+</button>' +
                '</div></div>';
        }).join('');

        document.getElementById('shopCartTotalPrice').textContent = '¥' + total.toFixed(1);

        itemsEl.querySelectorAll('.cart-qty button').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-idx'));
                var action = this.getAttribute('data-action');
                if (action === 'plus') {
                    cart[idx].qty++;
                } else {
                    cart[idx].qty--;
                    if (cart[idx].qty <= 0) cart.splice(idx, 1);
                }
                renderCart();
            });
        });
    }

    function renderOrders() {
        var list = document.getElementById('shopOrders');
        var orders = getShopOrders();
        if (orders.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>暂无订单</p></div>';
            return;
        }
        var statusMap = { pending: '待配送', processing: '配送中', done: '已送达' };
        list.innerHTML = orders.map(function(o) {
            return '<div class="data-item">' +
                '<div class="data-icon"><i class="fas fa-shopping-bag"></i></div>' +
                '<div class="data-info">' +
                '<span class="data-title">' + o.items.map(function(i) { return i.name + '×' + i.qty; }).join('、') + '</span>' +
                '<span class="data-desc">送达 ' + o.address + ' | ' + o.time + '</span>' +
                '</div>' +
                '<div class="data-right">' +
                '<div style="font-size:18px;font-weight:700;color:#ef4444">¥' + o.total.toFixed(1) + '</div>' +
                '<span class="status-tag ' + o.status + '">' + statusMap[o.status] + '</span>' +
                '</div></div>';
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', function() {
        renderProducts();
        renderCart();
        renderOrders();

        document.getElementById('categoryTabs').addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                document.querySelectorAll('#categoryTabs .tab-btn').forEach(function(t) { t.classList.remove('active'); });
                e.target.classList.add('active');
                currentCat = e.target.getAttribute('data-cat');
                renderProducts();
            }
        });

        document.getElementById('shopCheckoutBtn').addEventListener('click', function() {
            if (cart.length === 0) return;
            var building = document.getElementById('addrBuilding').value;
            var room = document.getElementById('addrRoom').value;
            var phone = document.getElementById('addrPhone').value;

            if (!building || !room || !phone) {
                showToast('请填写完整的配送地址');
                return;
            }

            var total = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
            var now = new Date();
            var timeStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

            var orders = getShopOrders();
            orders.unshift({
                items: cart.map(function(i) { return { name: i.name, qty: i.qty }; }),
                total: total,
                address: building + ' ' + room,
                phone: phone,
                time: timeStr,
                status: 'pending'
            });
            saveShopOrders(orders);
            cart = [];
            renderCart();
            renderOrders();
            document.getElementById('addrBuilding').value = '';
            document.getElementById('addrRoom').value = '';
            document.getElementById('addrPhone').value = '';
            showToast('下单成功！合计 ¥' + total.toFixed(1));
        });
    });
})();
