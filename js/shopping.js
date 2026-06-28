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

    /* ===== 商品数据（真实商品图片） ===== */
    var products = {
        snack: [
            { id: 's1', name: '乐事薯片', price: 8.5, img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 50, cat: 'snack' },
            { id: 's2', name: '奥利奥饼干', price: 9.9, img: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=400&fit=crop', stock: 40, cat: 'snack' },
            { id: 's3', name: '卫龙辣条', price: 5.0, img: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&h=400&fit=crop', stock: 60, cat: 'snack' },
            { id: 's4', name: '坚果混合装', price: 15.8, img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop', stock: 30, cat: 'snack' },
            { id: 's5', name: '巧克力威化', price: 6.5, img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop', stock: 45, cat: 'snack' },
            { id: 's6', name: '海苔夹心脆', price: 12.0, img: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&h=400&fit=crop', stock: 35, cat: 'snack' }
        ],
        drink: [
            { id: 'd1', name: '农夫山泉', price: 2.0, img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop', stock: 100, cat: 'drink' },
            { id: 'd2', name: '可口可乐', price: 3.5, img: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 80, cat: 'drink' },
            { id: 'd3', name: '纯牛奶250ml', price: 4.5, img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop', stock: 60, cat: 'drink' },
            { id: 'd4', name: '酸奶杯装', price: 6.0, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop', stock: 50, cat: 'drink' },
            { id: 'd5', name: '橙汁1L', price: 8.8, img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop', stock: 40, cat: 'drink' },
            { id: 'd6', name: '咖啡即饮', price: 5.5, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', stock: 45, cat: 'drink' }
        ],
        daily: [
            { id: 'dy1', name: '抽纸3包装', price: 8.9, img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop', stock: 70, cat: 'daily' },
            { id: 'dy2', name: '洗衣液500g', price: 12.5, img: 'https://images.unsplash.com/photo-1585441695325-21557ef83e9e?w=400&h=400&fit=crop', stock: 40, cat: 'daily' },
            { id: 'dy3', name: '牙膏套装', price: 15.0, img: 'https://images.unsplash.com/photo-1559591937-2c22c3e3fef9?w=400&h=400&fit=crop', stock: 35, cat: 'daily' },
            { id: 'dy4', name: '沐浴露400ml', price: 18.8, img: 'https://images.unsplash.com/photo-1585441695325-21557ef83e9e?w=400&h=400&fit=crop', stock: 30, cat: 'daily' },
            { id: 'dy5', name: '垃圾袋卷装', price: 5.0, img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop', stock: 80, cat: 'daily' },
            { id: 'dy6', name: '衣架10个装', price: 6.5, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', stock: 50, cat: 'daily' }
        ],
        stationery: [
            { id: 'st1', name: '中性笔3支装', price: 5.0, img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=400&fit=crop', stock: 90, cat: 'stationery' },
            { id: 'st2', name: '笔记本A5', price: 8.0, img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop', stock: 60, cat: 'stationery' },
            { id: 'st3', name: '荧光笔套装', price: 6.5, img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=400&fit=crop', stock: 50, cat: 'stationery' },
            { id: 'st4', name: '便利贴彩色', price: 4.0, img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop', stock: 70, cat: 'stationery' },
            { id: 'st5', name: '文件夹5个装', price: 9.9, img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop', stock: 40, cat: 'stationery' },
            { id: 'st6', name: '橡皮擦套装', price: 3.5, img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=400&fit=crop', stock: 80, cat: 'stationery' }
        ]
    };

    /* 分类主题色映射 */
    var catThemes = {
        snack:      { color: '#f97316', bg: '#fff7ed', border: '#fed7aa', label: '零食' },
        drink:      { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: '饮料' },
        daily:      { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', label: '日用品' },
        stationery: { color: '#8b5cf6', bg: '#f5f3ff', border: '#c4b5fd', label: '文具' }
    };

    var cart = [];
    var currentCat = 'snack';
    var selectAll = true;

    /* ===== 工具函数 ===== */
    function getUser() {
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function getShopOrders() {
        try { return JSON.parse(localStorage.getItem('campus_shop_orders') || '[]'); } catch(e) { return []; }
    }

    function saveShopOrders(list) {
        localStorage.setItem('campus_shop_orders', JSON.stringify(list));
    }

    /* 超市后台配送订单池（学生下单后自动同步到后台） */
    function getShopDeliveryOrders() {
        try { return JSON.parse(localStorage.getItem('campus_shop_delivery_orders') || '[]'); } catch(e) { return []; }
    }
    function saveShopDeliveryOrders(list) {
        localStorage.setItem('campus_shop_delivery_orders', JSON.stringify(list));
    }

    function getCartFromStorage() {
        try { return JSON.parse(localStorage.getItem('campus_shop_cart') || '[]'); } catch(e) { return []; }
    }

    function saveCartToStorage(c) {
        localStorage.setItem('campus_shop_cart', JSON.stringify(c));
    }

    function showToast(msg, type) {
        var toast = document.createElement('div');
        var bg = type === 'error' ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'linear-gradient(135deg,#1e40af,#3b82f6)';
        toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:' + bg + ';color:#fff;padding:12px 28px;border-radius:25px;font-size:14px;font-weight:600;z-index:99999;box-shadow:0 4px 15px rgba(0,0,0,0.2);animation:shopToastIn 0.3s ease';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 1500);
        setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 1800);
    }

    function generatePlaceholder(name, theme) {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">' +
            '<rect width="200" height="200" fill="' + theme.bg + '"/>' +
            '<rect x="0" y="0" width="200" height="4" fill="' + theme.color + '"/>' +
            '<text x="100" y="90" text-anchor="middle" font-size="40" fill="' + theme.color + '" font-family="sans-serif">' +
            '<tspan>' + (theme.label || '') + '</tspan></text>' +
            '<text x="100" y="125" text-anchor="middle" font-size="16" fill="#64748b" font-family="sans-serif">' +
            '<tspan>' + name + '</tspan></text></svg>';
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }

    function findProductById(id) {
        var allCats = ['snack', 'drink', 'daily', 'stationery'];
        for (var i = 0; i < allCats.length; i++) {
            var found = products[allCats[i]].find(function(p) { return p.id === id; });
            if (found) return found;
        }
        return null;
    }

    /* ===== 渲染商品列表 ===== */
    function renderProducts() {
        var grid = document.getElementById('productGrid');
        var items = products[currentCat] || [];
        var theme = catThemes[currentCat];
        /* 跳过已下架的商品，前端不展示 */
        var visibleItems = items.filter(function(it) { return !it.offShelf; });
        grid.innerHTML = visibleItems.map(function(item) {
            var inCart = cart.find(function(c) { return c.id === item.id; });
            var cartQty = inCart ? inCart.qty : 0;
            return '<div class="product-item product-cat-' + currentCat + '">' +
                '<div class="product-img-wrap">' +
                '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.src=\'' + generatePlaceholder(item.name, theme).replace(/'/g, "\\'") + '\'">' +
                '<span class="product-cat-badge" style="background:' + theme.color + '">' + theme.label + '</span>' +
                '</div>' +
                '<div class="product-info">' +
                '<h4>' + item.name + '</h4>' +
                '<div class="product-meta"><span class="product-price">¥' + item.price.toFixed(1) + '</span><span class="product-stock">库存 ' + item.stock + '</span></div>' +
                '<button class="add-cart-btn" data-id="' + item.id + '"' + (item.stock <= 0 ? ' disabled' : '') + '>' +
                (cartQty > 0 ? '<i class="fas fa-check"></i> 已加入(' + cartQty + ')' : '<i class="fas fa-cart-plus"></i> 加入购物车') +
                '</button>' +
                '</div></div>';
        }).join('');

        grid.querySelectorAll('.add-cart-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (this.disabled) return;
                var id = this.getAttribute('data-id');
                addToCart(id);
            });
        });
    }

    /* ===== 购物车操作 ===== */
    function addToCart(productId) {
        var product = findProductById(productId);
        if (!product) return;
        var found = cart.find(function(c) { return c.id === productId; });
        if (found) {
            if (found.qty >= product.stock) {
                showToast('库存不足', 'error');
                return;
            }
            found.qty++;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, img: product.img, cat: product.cat, selected: true });
        }
        saveCartToStorage(cart);

        /* 按钮加载动画 */
        var btns = document.querySelectorAll('.add-cart-btn[data-id="' + productId + '"]');
        btns.forEach(function(btn) {
            var original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 添加中...';
            btn.disabled = true;
            setTimeout(function() {
                btn.disabled = false;
                renderProducts();
            }, 400);
        });

        renderCart();
        updateFloatingCart();
        showToast('已添加：' + product.name);
    }

    function updateCartQty(idx, delta) {
        if (!cart[idx]) return;
        cart[idx].qty += delta;
        var product = findProductById(cart[idx].id);
        if (product && cart[idx].qty > product.stock) {
            cart[idx].qty = product.stock;
            showToast('已达最大库存', 'error');
        }
        if (cart[idx].qty <= 0) {
            cart.splice(idx, 1);
        }
        saveCartToStorage(cart);
        renderProducts();
        renderCart();
        updateFloatingCart();
    }

    function removeCartItem(idx) {
        cart.splice(idx, 1);
        saveCartToStorage(cart);
        renderProducts();
        renderCart();
        updateFloatingCart();
    }

    function toggleSelectAll() {
        selectAll = !selectAll;
        cart.forEach(function(c) { c.selected = selectAll; });
        saveCartToStorage(cart);
        renderCart();
        updateFloatingCart();
    }

    function toggleSelectItem(idx) {
        if (cart[idx]) {
            cart[idx].selected = !cart[idx].selected;
            selectAll = cart.every(function(c) { return c.selected; });
            saveCartToStorage(cart);
            renderCart();
            updateFloatingCart();
        }
    }

    /* ===== 渲染购物车 ===== */
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

        var selectedCount = cart.filter(function(c) { return c.selected !== false; }).length;
        selectAll = selectedCount === cart.length;

        var total = 0;
        itemsEl.innerHTML =
            '<div class="cart-select-row">' +
            '<label class="cart-checkbox"><input type="checkbox" id="cartSelectAll"' + (selectAll ? ' checked' : '') + '><span class="checkmark"></span> 全选</label>' +
            '<span class="cart-count-label">共 ' + cart.length + ' 件商品</span>' +
            '</div>' +
            cart.map(function(item, idx) {
                var isSelected = item.selected !== false;
                if (isSelected) total += item.price * item.qty;
                var theme = catThemes[item.cat] || catThemes.snack;
                return '<div class="cart-item' + (isSelected ? '' : ' cart-item-unselected') + '">' +
                    '<label class="cart-checkbox cart-item-check"><input type="checkbox" data-idx="' + idx + '"' + (isSelected ? ' checked' : '') + '><span class="checkmark"></span></label>' +
                    '<img class="cart-item-img" src="' + item.img + '" alt="' + item.name + '" onerror="this.src=\'' + generatePlaceholder(item.name, theme).replace(/'/g, "\\'") + '\'">' +
                    '<div class="cart-item-info">' +
                    '<div class="cart-item-name">' + item.name + '</div>' +
                    '<div class="cart-item-price">¥' + item.price.toFixed(1) + '</div>' +
                    '</div>' +
                    '<div class="cart-qty">' +
                    '<button data-action="minus" data-idx="' + idx + '"><i class="fas fa-minus"></i></button>' +
                    '<span>' + item.qty + '</span>' +
                    '<button data-action="plus" data-idx="' + idx + '"><i class="fas fa-plus"></i></button>' +
                    '</div>' +
                    '<div class="cart-item-subtotal">¥' + (item.price * item.qty).toFixed(1) + '</div>' +
                    '<button class="cart-item-del" data-idx="' + idx + '" title="删除"><i class="fas fa-trash-alt"></i></button>' +
                    '</div>';
            }).join('');

        document.getElementById('shopCartTotalPrice').textContent = '¥' + total.toFixed(1);

        /* 绑定事件 */
        var selectAllCb = document.getElementById('cartSelectAll');
        if (selectAllCb) selectAllCb.addEventListener('change', toggleSelectAll);

        itemsEl.querySelectorAll('.cart-item-check input').forEach(function(cb) {
            cb.addEventListener('change', function() {
                toggleSelectItem(parseInt(this.getAttribute('data-idx')));
            });
        });

        itemsEl.querySelectorAll('.cart-qty button').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-idx'));
                var action = this.getAttribute('data-action');
                updateCartQty(idx, action === 'plus' ? 1 : -1);
            });
        });

        itemsEl.querySelectorAll('.cart-item-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                removeCartItem(parseInt(this.getAttribute('data-idx')));
            });
        });

        /* 结算按钮状态 */
        var checkoutBtn = document.getElementById('shopCheckoutBtn');
        if (checkoutBtn) {
            var hasSelected = cart.some(function(c) { return c.selected !== false; });
            checkoutBtn.disabled = !hasSelected;
            checkoutBtn.className = 'checkout-btn' + (hasSelected ? '' : ' checkout-btn-disabled');
        }
    }

    /* ===== 悬浮购物车 ===== */
    function updateFloatingCart() {
        var fc = document.getElementById('floatingShopCart');
        if (!fc) return;
        var totalQty = cart.reduce(function(s, c) { return s + c.qty; }, 0);
        var totalPrice = cart.reduce(function(s, c) { return s + (c.selected !== false ? c.price * c.qty : 0); }, 0);
        var badge = fc.querySelector('.floating-cart-badge');
        var countEl = fc.querySelector('.floating-cart-count');
        var totalEl = fc.querySelector('.floating-cart-total');
        if (badge) {
            var oldQty = parseInt(badge.textContent) || 0;
            badge.textContent = totalQty;
            badge.style.display = totalQty > 0 ? '' : 'none';
            /* 数量变化时添加脉冲动画 */
            if (totalQty !== oldQty) {
                badge.classList.remove('badge-pulse');
                void badge.offsetWidth;
                badge.classList.add('badge-pulse');
            }
        }
        if (countEl) countEl.textContent = totalQty + ' 件商品';
        if (totalEl) totalEl.textContent = '¥' + totalPrice.toFixed(1);
    }

    function initFloatingCart() {
        if (document.getElementById('floatingShopCart')) return;
        var fc = document.createElement('div');
        fc.id = 'floatingShopCart';
        fc.className = 'floating-cart';
        fc.innerHTML =
            '<div class="floating-cart-icon"><i class="fas fa-shopping-cart"></i><span class="floating-cart-badge" style="display:none">0</span></div>' +
            '<div class="floating-cart-info"><span class="floating-cart-count">0 件商品</span><span class="floating-cart-total">¥0.0</span></div>' +
            '<button class="floating-cart-btn" id="floatingCartBtn">去结算</button>';
        document.body.appendChild(fc);
        updateFloatingCart();

        fc.querySelector('.floating-cart-icon').addEventListener('click', function() {
            document.getElementById('shopCartPanel').scrollIntoView({ behavior: 'smooth' });
        });
        fc.querySelector('#floatingCartBtn').addEventListener('click', function() {
            var hasSelected = cart.some(function(c) { return c.selected !== false; });
            if (!hasSelected) {
                showToast('请至少选择一件商品', 'error');
                return;
            }
            document.getElementById('shopCheckoutArea').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ===== 渲染订单 ===== */
    function renderOrders() {
        var list = document.getElementById('shopOrders');
        var orders = getShopOrders();

        /* 模拟订单状态流转：每30秒推进一次 */
        var now = Date.now();
        var changed = false;
        orders.forEach(function(o) {
            var orderTime = new Date(o.time.replace(/-/g, '/')).getTime();
            var elapsed = now - orderTime;
            if (o.status === 'pending' && elapsed > 30000) {
                o.status = 'processing';
                changed = true;
            } else if (o.status === 'processing' && elapsed > 90000) {
                o.status = 'done';
                changed = true;
            }
        });
        if (changed) saveShopOrders(orders);

        if (orders.length === 0) {
            list.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>暂无订单</p></div>';
            return;
        }
        var statusMap = { pending: '待配送', processing: '配送中', done: '已送达' };
        var statusIcon = { pending: 'fa-clock', processing: 'fa-truck', done: 'fa-check-circle' };
        list.innerHTML = orders.map(function(o, idx) {
            var itemsHtml = o.items.map(function(i) { return i.name + '×' + i.qty; }).join('、');
            return '<div class="data-item">' +
                '<div class="data-icon"><i class="fas fa-shopping-bag"></i></div>' +
                '<div class="data-info">' +
                '<span class="data-title">' + itemsHtml + '</span>' +
                '<span class="data-desc">送达 ' + o.address + ' | ' + o.time + '</span>' +
                '</div>' +
                '<div class="data-right">' +
                '<div style="font-size:18px;font-weight:700;color:#ef4444">¥' + o.total.toFixed(1) + '</div>' +
                '<span class="status-tag ' + o.status + '"><i class="fas ' + statusIcon[o.status] + '"></i> ' + statusMap[o.status] + '</span>' +
                '</div></div>';
        }).join('');
    }

    /* ===== 分类标签切换 ===== */
    function initCategoryTabs() {
        var tabs = document.getElementById('categoryTabs');
        if (!tabs) return;
        tabs.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                tabs.querySelectorAll('.tab-btn').forEach(function(t) { t.classList.remove('active'); });
                e.target.classList.add('active');
                currentCat = e.target.getAttribute('data-cat');
                renderProducts();
            }
        });
    }

    /* ===== 结算下单 ===== */
    function initCheckout() {
        var btn = document.getElementById('shopCheckoutBtn');
        if (!btn) return;
        btn.addEventListener('click', function() {
            var selectedItems = cart.filter(function(c) { return c.selected !== false; });
            if (selectedItems.length === 0) {
                showToast('请至少选择一件商品', 'error');
                return;
            }
            var name = document.getElementById('addrName').value.trim();
            var building = document.getElementById('addrBuilding').value;
            var room = document.getElementById('addrRoom').value.trim();
            var phone = document.getElementById('addrPhone').value.trim();
            var timeSlot = document.getElementById('addrTimeSlot').value;
            if (!name || !building || !room || !phone || !timeSlot) {
                showToast('请填写完整的姓名、楼栋、房间号、电话与配送时段', 'error');
                return;
            }

            /* 显示订单确认弹窗 */
            showOrderConfirm(selectedItems, name, building, room, phone, timeSlot);
        });
    }

    /* ===== 订单确认弹窗 ===== */
    function showOrderConfirm(selectedItems, name, building, room, phone, timeSlot) {
        var total = selectedItems.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
        var itemsHtml = selectedItems.map(function(i) {
            return '<div class="confirm-order-item">' +
                '<span class="confirm-item-name">' + i.name + '</span>' +
                '<span class="confirm-item-qty">x' + i.qty + '</span>' +
                '<span class="confirm-item-price">¥' + (i.price * i.qty).toFixed(1) + '</span>' +
                '</div>';
        }).join('');

        var modal = document.createElement('div');
        modal.className = 'order-confirm-modal';
        modal.innerHTML =
            '<div class="order-confirm-overlay"></div>' +
            '<div class="order-confirm-content">' +
            '<div class="order-confirm-header">' +
            '<h3><i class="fas fa-clipboard-check"></i> 确认订单</h3>' +
            '<button class="order-confirm-close"><i class="fas fa-times"></i></button>' +
            '</div>' +
            '<div class="order-confirm-body">' +
            '<div class="confirm-section"><h4><i class="fas fa-box"></i> 商品清单</h4>' + itemsHtml + '</div>' +
            '<div class="confirm-section"><h4><i class="fas fa-map-marker-alt"></i> 配送信息</h4>' +
            '<p>姓名：' + name + '</p>' +
            '<p>楼栋：' + building + '　房间号：' + room + '</p>' +
            '<p>配送时段：' + timeSlot + '</p>' +
            '<p>联系电话：' + phone + '</p></div>' +
            '<div class="confirm-total-row"><span>合计</span><span class="confirm-total-price">¥' + total.toFixed(1) + '</span></div>' +
            '</div>' +
            '<div class="order-confirm-footer">' +
            '<button class="confirm-cancel-btn">取消</button>' +
            '<button class="confirm-submit-btn"><i class="fas fa-check"></i> 确认下单</button>' +
            '</div></div>';
        document.body.appendChild(modal);

        /* 关闭弹窗 */
        modal.querySelector('.order-confirm-close').addEventListener('click', function() { closeModal(modal); });
        modal.querySelector('.order-confirm-overlay').addEventListener('click', function() { closeModal(modal); });
        modal.querySelector('.confirm-cancel-btn').addEventListener('click', function() { closeModal(modal); });

        /* 确认下单 */
        modal.querySelector('.confirm-submit-btn').addEventListener('click', function() {
            var submitBtn = this;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;

            setTimeout(function() {
                var now = new Date();
                var timeStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

                var orders = getShopOrders();
                /* 同时为后台配送管理写入独立订单记录（campus_shop_delivery_orders） */
                var deliveryOrders = getShopDeliveryOrders();

                var orderId = 'ORD' + Date.now();
                var orderRecord = {
                    orderId: orderId,
                    items: selectedItems.map(function(i) { return { name: i.name, qty: i.qty, price: i.price }; }),
                    total: total,
                    name: name,
                    building: building,
                    room: room,
                    address: building + ' ' + room,
                    phone: phone,
                    timeSlot: timeSlot,
                    time: timeStr,
                    status: 'pending',
                    customerRole: getUser() ? (getUser().role || 'student') : 'student'
                };

                orders.unshift(orderRecord);
                saveShopOrders(orders);

                /* 推送到超市后台的配送订单池 */
                deliveryOrders.unshift(Object.assign({ highlighted: true, readAt: null }, orderRecord));
                saveShopDeliveryOrders(deliveryOrders);

                /* 清除已选商品 */
                cart = cart.filter(function(c) { return c.selected === false; });
                cart.forEach(function(c) { c.selected = true; });
                saveCartToStorage(cart);

                closeModal(modal);
                renderProducts();
                renderCart();
                renderOrders();
                updateFloatingCart();
                document.getElementById('addrName').value = '';
                document.getElementById('addrBuilding').value = '';
                document.getElementById('addrRoom').value = '';
                document.getElementById('addrPhone').value = '';
                document.getElementById('addrTimeSlot').value = '';
                showToast('下单成功！合计 ¥' + total.toFixed(1) + '，请等待超市后台接单');
            }, 600);
        });
    }

    function closeModal(modal) {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.2s';
        setTimeout(function() { if (modal.parentNode) modal.parentNode.removeChild(modal); }, 200);
    }

    /* ===== 初始化 ===== */
    document.addEventListener('DOMContentLoaded', function() {
        /* 从 localStorage 恢复购物车 */
        cart = getCartFromStorage();
        cart.forEach(function(c) { if (c.selected === undefined) c.selected = true; });
        renderProducts();
        renderCart();
        renderOrders();
        initCategoryTabs();
        initCheckout();
        initFloatingCart();

        /* 从后台同步商品数据（首次进入将默认商品写入 localStorage，之后由后台管理） */
        try {
            var storedProducts = JSON.parse(localStorage.getItem('campus_shop_products') || 'null');
            if (storedProducts && typeof storedProducts === 'object') {
                products = storedProducts;
                renderProducts();
            } else {
                localStorage.setItem('campus_shop_products', JSON.stringify(products));
            }
        } catch (e) {}

        /* 监听后台商品变更，实时刷新前端 */
        window.addEventListener('storage', function(e) {
            if (e.key === 'campus_shop_products') {
                try {
                    var p = JSON.parse(e.newValue || 'null');
                    if (p && typeof p === 'object') {
                        products = p;
                        renderProducts();
                    }
                } catch (err) {}
            }
            if (e.key === 'campus_shop_delivery_orders') {
                /* 后台改了订单状态，刷新前端订单列表 */
                renderOrders();
            }
        });

        /* 每30秒刷新订单状态 */
        setInterval(function() { renderOrders(); }, 30000);
    });
})();
