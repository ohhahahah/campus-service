document.addEventListener('DOMContentLoaded', function() {
    var navItems = document.querySelectorAll('.nav-item');
    var sections = document.querySelectorAll('.profile-section');

    navItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            var sectionId = this.dataset.section;
            navItems.forEach(function(nav) { nav.classList.remove('active'); });
            sections.forEach(function(section) { section.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
        });
    });

    var editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            showToast('编辑资料功能开发中...');
        });
    }

    var darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    var logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                    if (window.CampusDB) { CampusDB.clearCurrentUser(); } else { localStorage.removeItem('campus_current_user'); }
                    window.location.href = 'index.html';
                }
        });
    }

    var avatarEdit = document.querySelector('.avatar-edit');
    var avatarArea = document.getElementById('userAvatarArea');
    var avatarFileInput = document.getElementById('avatarFileInput');
    var avatarImg = document.getElementById('userAvatarImg');

    function getAvatarData() {
        if (window.CampusDB) return CampusDB.getAvatars();
        try { return JSON.parse(localStorage.getItem('campus_avatars') || '{}'); } catch(e) { return {}; }
    }

    function saveAvatarData(data) {
        if (window.CampusDB) return CampusDB.saveAvatars(data);
        localStorage.setItem('campus_avatars', JSON.stringify(data));
    }

    function getUserAvatar(stuId) {
        var avatars = getAvatarData();
        return avatars[stuId] || null;
    }

    function loadUserAvatar() {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') return;
        var avatarUrl = getUserAvatar(user.stuId);
        if (avatarUrl && avatarImg) {
            avatarImg.src = avatarUrl;
        }
    }

    loadUserAvatar();

    function triggerAvatarUpload() {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') {
            showToast('请先登录后再上传头像');
            return;
        }
        if (avatarFileInput) avatarFileInput.click();
    }

    if (avatarEdit) {
        avatarEdit.addEventListener('click', function(e) {
            e.stopPropagation();
            triggerAvatarUpload();
        });
    }

    if (avatarArea) {
        avatarArea.addEventListener('click', function() {
            triggerAvatarUpload();
        });
    }

    var cropOverlay = document.getElementById('avatarCropOverlay');
    var cropPreview = document.getElementById('avatarCropPreview');
    var cropClose = document.getElementById('avatarCropClose');
    var cropCancel = document.getElementById('avatarCropCancel');
    var cropConfirm = document.getElementById('avatarCropConfirm');
    var cropLoading = document.getElementById('avatarCropLoading');
    var zoomRange = document.getElementById('avatarZoomRange');
    var zoomIn = document.getElementById('avatarZoomIn');
    var zoomOut = document.getElementById('avatarZoomOut');

    var cropImageData = null;
    var cropZoom = 100;
    var cropOffsetX = 0;
    var cropOffsetY = 0;
    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragStartOffsetX = 0;
    var dragStartOffsetY = 0;

    if (avatarFileInput) {
        avatarFileInput.addEventListener('change', function() {
            var file = this.files[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                showToast('图片大小不能超过5MB，请重新选择');
                this.value = '';
                return;
            }

            if (!file.type.match(/image\/(jpeg|png)/)) {
                showToast('仅支持JPG/PNG格式图片');
                this.value = '';
                return;
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                cropImageData = e.target.result;
                cropZoom = 100;
                cropOffsetX = 0;
                cropOffsetY = 0;
                if (zoomRange) zoomRange.value = 100;
                if (cropPreview) {
                    cropPreview.src = cropImageData;
                    cropPreview.style.transform = 'scale(1) translate(0px, 0px)';
                }
                if (cropOverlay) cropOverlay.classList.add('active');
            };
            reader.readAsDataURL(file);
            this.value = '';
        });
    }

    function updateCropTransform() {
        if (!cropPreview) return;
        var scale = cropZoom / 100;
        cropPreview.style.transform = 'scale(' + scale + ') translate(' + cropOffsetX + 'px, ' + cropOffsetY + 'px)';
    }

    if (zoomRange) {
        zoomRange.addEventListener('input', function() {
            cropZoom = parseInt(this.value);
            updateCropTransform();
        });
    }

    if (zoomIn) {
        zoomIn.addEventListener('click', function() {
            cropZoom = Math.min(200, cropZoom + 10);
            if (zoomRange) zoomRange.value = cropZoom;
            updateCropTransform();
        });
    }

    if (zoomOut) {
        zoomOut.addEventListener('click', function() {
            cropZoom = Math.max(50, cropZoom - 10);
            if (zoomRange) zoomRange.value = cropZoom;
            updateCropTransform();
        });
    }

    var cropCircle = document.getElementById('avatarCropCircle');
    if (cropCircle) {
        cropCircle.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (e.deltaY < 0) {
                cropZoom = Math.min(200, cropZoom + 5);
            } else {
                cropZoom = Math.max(50, cropZoom - 5);
            }
            if (zoomRange) zoomRange.value = cropZoom;
            updateCropTransform();
        });

        cropCircle.addEventListener('mousedown', function(e) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            dragStartOffsetX = cropOffsetX;
            dragStartOffsetY = cropOffsetY;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            var dx = e.clientX - dragStartX;
            var dy = e.clientY - dragStartY;
            var scale = cropZoom / 100;
            cropOffsetX = dragStartOffsetX + dx / scale;
            cropOffsetY = dragStartOffsetY + dy / scale;
            updateCropTransform();
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }

    function closeCropModal() {
        if (cropOverlay) cropOverlay.classList.remove('active');
        cropImageData = null;
        cropZoom = 100;
        cropOffsetX = 0;
        cropOffsetY = 0;
    }

    if (cropClose) cropClose.addEventListener('click', closeCropModal);
    if (cropCancel) cropCancel.addEventListener('click', closeCropModal);

    if (cropConfirm) {
        cropConfirm.addEventListener('click', function() {
            var user = getCurrentUser();
            if (!user || user.role !== 'student') {
                showToast('请先登录');
                closeCropModal();
                return;
            }

            if (!cropImageData) {
                showToast('请先选择图片');
                return;
            }

            if (cropLoading) cropLoading.style.display = 'flex';

            var canvas = document.createElement('canvas');
            var size = 200;
            canvas.width = size;
            canvas.height = size;
            var ctx = canvas.getContext('2d');

            var img = new Image();
            img.onload = function() {
                var scale = cropZoom / 100;
                var imgW = img.width * scale;
                var imgH = img.height * scale;
                var offsetX = (imgW - size) / 2 - cropOffsetX * scale;
                var offsetY = (imgH - size) / 2 - cropOffsetY * scale;

                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                ctx.clip();

                ctx.drawImage(img, -offsetX, -offsetY, imgW, imgH);

                var dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                if (dataUrl.length > 2 * 1024 * 1024) {
                    dataUrl = canvas.toDataURL('image/jpeg', 0.5);
                }

                var avatars = getAvatarData();
                avatars[user.stuId] = dataUrl;
                saveAvatarData(avatars);

                if (window.CampusDB) {
                    CampusDB.setUserAvatar(user.stuId, dataUrl);
                } else {
                    var students = [];
                    try { students = JSON.parse(localStorage.getItem('campus_students') || '[]'); } catch(e2) {}
                    var student = students.find(function(s) { return s.stuId === user.stuId; });
                    if (student) {
                        student.avatar = dataUrl;
                        localStorage.setItem('campus_students', JSON.stringify(students));
                    }

                    var currentUser = getCurrentUser();
                    currentUser.avatar = dataUrl;
                    localStorage.setItem('campus_current_user', JSON.stringify(currentUser));
                }

                setTimeout(function() {
                    if (cropLoading) cropLoading.style.display = 'none';
                    if (avatarImg) avatarImg.src = dataUrl;
                    closeCropModal();
                    showToast('头像上传成功');
                }, 800);
            };

            img.onerror = function() {
                if (cropLoading) cropLoading.style.display = 'none';
                showToast('图片处理失败，请重试');
            };

            img.src = cropImageData;
        });
    }

    function getCurrentUser() {
        if (window.CampusDB) return CampusDB.getCurrentUser();
        try { return JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return null; }
    }

    function getProducts() {
        if (window.CampusDB) return CampusDB.getSecondhand();
        try { return JSON.parse(localStorage.getItem('campus_secondhand') || '[]'); } catch(e) { return []; }
    }

    function saveProducts(list) {
        if (window.CampusDB) return CampusDB.saveSecondhand(list);
        localStorage.setItem('campus_secondhand', JSON.stringify(list));
    }

    function showToast(msg) {
        var existing = document.getElementById('profileToast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.id = 'profileToast';
        toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;z-index:10001;box-shadow:0 8px 30px rgba(30,64,175,0.3);opacity:0;transition:opacity 0.3s';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() { toast.style.opacity = '1'; }, 10);
        setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 2500);
    }

    function loadUserInfo() {
        var user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        var userCard = document.querySelector('.user-card');
        if (userCard) {
            var h3 = userCard.querySelector('h3');
            var p = userCard.querySelector('p');
            if (h3) h3.textContent = user.name || '用户';
            if (p) p.textContent = (user.dept || '未填写学院') + ' · ' + (user.stuId || '');
        }
        var infoSection = document.getElementById('info');
        if (infoSection) {
            var rows = infoSection.querySelectorAll('.info-row span');
            if (rows.length >= 8) {
                rows[0].textContent = user.stuId || '未填写';
                rows[1].textContent = user.name || '未填写';
                rows[2].textContent = user.gender || '未填写';
                rows[3].textContent = user.dept || '未填写';
                rows[4].textContent = user.major || '未填写';
                rows[5].textContent = user.className || '未填写';
                rows[6].textContent = user.phone || '未填写';
                rows[7].textContent = user.email || (user.stuId ? user.stuId + '@campus.edu' : '未填写');
            }
        }
    }

    function loadMyProducts() {
        var user = getCurrentUser();
        if (!user) return;
        var products = getProducts();
        var myProducts = products.filter(function(p) {
            if (p.sellerStuId && user.stuId) return p.sellerStuId === user.stuId;
            return p.seller === user.name;
        });

        var secondhandSection = document.getElementById('secondhand');
        if (!secondhandSection) return;
        var grid = secondhandSection.querySelector('.items-grid');
        if (!grid) return;

        if (myProducts.length === 0) {
            grid.innerHTML = '<div style="text-align:center;padding:40px;color:#64748b"><i class="fas fa-box-open" style="font-size:48px;display:block;margin-bottom:12px;color:#e2e8f0"></i><p>暂无发布的商品</p></div>';
            return;
        }

        var html = '';
        myProducts.forEach(function(p) {
            var statusClass = p.status === '已售出' ? 'sold' : 'selling';
            var statusText = p.status === '已下架' ? '已下架' : (p.status === '已售出' ? '已售出' : '出售中');
            if (p.reviewStatus === 'rejected' || p.status === '已下架') statusClass = 'sold';
            var imgSrc = '';
            if (p.images && Array.isArray(p.images) && p.images.length > 0) imgSrc = p.images[0];
            html += '<div class="item-card" data-id="' + p.id + '">' +
                (imgSrc ? '<img src="' + imgSrc + '" alt="' + p.name + '" onerror="this.style.display=\'none\'">' : '<div style="height:120px;background:linear-gradient(135deg,#3b82f618,#1e40af18);display:flex;align-items:center;justify-content:center"><i class="fas fa-box" style="font-size:32px;color:#3b82f6"></i></div>') +
                '<div class="item-info">' +
                    '<h4>' + p.name + '</h4>' +
                    '<span class="item-price">¥' + p.price + '</span>' +
                    '<span class="item-status ' + statusClass + '">' + statusText + '</span>' +
                    '<div class="item-actions">' +
                        '<button class="btn-view" data-id="' + p.id + '"><i class="fas fa-eye"></i> 查看</button>' +
                        '<button class="btn-delete-item" data-id="' + p.id + '"><i class="fas fa-trash-alt"></i> 删除</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        });
        grid.innerHTML = html;

        grid.querySelectorAll('.btn-view').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.dataset.id;
                if (id) window.location.href = 'detail.html?id=' + id;
            });
        });

        grid.querySelectorAll('.btn-delete-item').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.dataset.id);
                if (!confirm('确定要删除该商品吗？删除后无法恢复！')) return;
                var allProducts = getProducts();
                var idx = allProducts.findIndex(function(p) { return p.id === id; });
                if (idx !== -1) {
                    allProducts[idx].status = '已下架';
                    allProducts[idx].reviewStatus = 'rejected';
                    saveProducts(allProducts);
                    showToast('商品已删除');
                    loadMyProducts();
                }
            });
        });

        grid.querySelectorAll('.item-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = this.dataset.id;
                if (id) window.location.href = 'detail.html?id=' + id;
            });
        });
    }

    function loadMyFavorites() {
        var user = getCurrentUser();
        if (!user) return;
        var collected = [];
        if (window.CampusDB) { collected = CampusDB.getCollected(); } else {
            try { collected = JSON.parse(localStorage.getItem('campus_collected') || '[]'); } catch(e) {}
        }
        var products = getProducts();
        var favProducts = products.filter(function(p) { return collected.indexOf(p.id) !== -1 && p.status !== '已下架'; });

        var favSection = document.getElementById('favorites');
        if (!favSection) return;
        var grid = favSection.querySelector('.items-grid');
        if (!grid) return;

        if (favProducts.length === 0) {
            grid.innerHTML = '<div style="text-align:center;padding:40px;color:#64748b"><i class="fas fa-heart" style="font-size:48px;display:block;margin-bottom:12px;color:#e2e8f0"></i><p>暂无收藏商品</p></div>';
            return;
        }

        var html = '';
        favProducts.forEach(function(p) {
            var imgSrc = '';
            if (p.images && Array.isArray(p.images) && p.images.length > 0) imgSrc = p.images[0];
            html += '<div class="item-card" data-id="' + p.id + '">' +
                (imgSrc ? '<img src="' + imgSrc + '" alt="' + p.name + '" onerror="this.style.display=\'none\'">' : '<div style="height:120px;background:linear-gradient(135deg,#3b82f618,#1e40af18);display:flex;align-items:center;justify-content:center"><i class="fas fa-heart" style="font-size:32px;color:#ef4444"></i></div>') +
                '<div class="item-info">' +
                    '<h4>' + p.name + '</h4>' +
                    '<span class="item-price">¥' + p.price + '</span>' +
                    '<span class="item-status selling">在售</span>' +
                '</div>' +
            '</div>';
        });
        grid.innerHTML = html;

        grid.querySelectorAll('.item-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = this.dataset.id;
                if (id) window.location.href = 'detail.html?id=' + id;
            });
        });
    }

    loadUserInfo();
    loadMyProducts();
    loadMyFavorites();
    loadMyRentals();

    var publishBtn = document.querySelector('#secondhand .btn.primary-btn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            window.location.href = 'publish.html';
        });
    }

    var publishRentalBtn = document.getElementById('publishRentalBtn');
    if (publishRentalBtn) {
        publishRentalBtn.addEventListener('click', function() {
            window.location.href = 'secondhand.html?openRental=1#rentalSection';
        });
    }

    function loadMyRentals() {
        var user = getCurrentUser();
        if (!user) return;
        var rentalBooks = [];
        if (window.CampusDB) { rentalBooks = CampusDB.getRentalBooks(); } else {
            try { rentalBooks = JSON.parse(localStorage.getItem('campus_rental_books') || '[]'); } catch(e) { return; }
        }
        var myRentals = rentalBooks.filter(function(b) {
            if (b.sellerStuId && user.stuId) return b.sellerStuId === user.stuId;
            return b.seller === user.name;
        });

        var grid = document.getElementById('myRentalsGrid');
        if (!grid) return;

        if (myRentals.length === 0) {
            grid.innerHTML = '<div style="text-align:center;padding:40px;color:#64748b"><i class="fas fa-book-open" style="font-size:48px;display:block;margin-bottom:12px;color:#e2e8f0"></i><p>暂无发布的教材租用</p></div>';
            return;
        }

        var html = '';
        myRentals.forEach(function(b) {
            var statusText = b.reviewStatus === 'rejected' ? '已下架' : (b.available ? '可租' : '已租');
            var statusClass = (b.reviewStatus === 'rejected' || !b.available) ? 'sold' : 'selling';
            html += '<div class="item-card" data-rid="' + b.id + '">' +
                '<div style="height:120px;background:linear-gradient(135deg,#ec489618,#be185d18);display:flex;align-items:center;justify-content:center"><i class="fas fa-book" style="font-size:32px;color:#ec4899"></i></div>' +
                '<div class="item-info">' +
                    '<h4>' + b.name + '</h4>' +
                    '<span class="item-price">¥' + b.price + '/' + b.period + '</span>' +
                    '<span class="item-status ' + statusClass + '">' + statusText + '</span>' +
                    '<div class="item-actions">' +
                        '<button class="btn-view" data-rid="' + b.id + '"><i class="fas fa-eye"></i> 查看</button>' +
                        '<button class="btn-delete-item" data-rid="' + b.id + '"><i class="fas fa-trash-alt"></i> 删除</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        });
        grid.innerHTML = html;

        grid.querySelectorAll('.btn-view').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.dataset.rid;
                if (id) window.location.href = 'rental-detail.html?id=' + id;
            });
        });

        grid.querySelectorAll('.btn-delete-item').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = parseInt(this.dataset.rid);
                if (!confirm('确定要删除该教材吗？删除后无法恢复！')) return;
                var allBooks = [];
                if (window.CampusDB) { allBooks = CampusDB.getRentalBooks(); } else {
                    try { allBooks = JSON.parse(localStorage.getItem('campus_rental_books') || '[]'); } catch(e) { return; }
                }
                var idx = allBooks.findIndex(function(b) { return b.id === id; });
                if (idx !== -1) {
                    allBooks[idx].reviewStatus = 'rejected';
                    if (window.CampusDB) { CampusDB.saveRentalBooks(allBooks); } else { localStorage.setItem('campus_rental_books', JSON.stringify(allBooks)); }
                    showToast('教材已删除');
                    loadMyRentals();
                }
            });
        });

        grid.querySelectorAll('.item-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = this.dataset.rid;
                if (id) window.location.href = 'rental-detail.html?id=' + id;
            });
        });
    }

    function getChatData() {
        if (window.CampusDB) return CampusDB.getChat();
        try { return JSON.parse(localStorage.getItem('campus_chat') || '{}'); } catch(e) { return {}; }
    }

    function saveChatData(data) {
        if (window.CampusDB) return CampusDB.saveChat(data);
        localStorage.setItem('campus_chat', JSON.stringify(data));
    }

    function getProfileUnreadCount() {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') return 0;
        var chatData = getChatData();
        var count = 0;
        Object.keys(chatData).forEach(function(key) {
            var messages = chatData[key] || [];
            messages.forEach(function(m) {
                if (m.senderStuId !== user.stuId && !m.read) count++;
            });
        });
        return count;
    }

    function escapeProfileHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function loadMyMessages() {
        var user = getCurrentUser();
        if (!user || user.role !== 'student') return;

        var chatData = getChatData();
        var list = document.getElementById('profileChatList');
        if (!list) return;

        var sessions = [];
        Object.keys(chatData).forEach(function(key) {
            var messages = chatData[key];
            if (!messages || messages.length === 0) return;
            var hasMyMsg = messages.some(function(m) { return m.senderStuId === user.stuId; });
            var hasOtherMsg = messages.some(function(m) { return m.senderStuId !== user.stuId; });
            if (!hasMyMsg && !hasOtherMsg) return;

            var lastMsg = messages[messages.length - 1];
            var unreadCount = messages.filter(function(m) { return m.senderStuId !== user.stuId && !m.read; }).length;
            var otherStuId = '';
            var otherName = '';
            messages.forEach(function(m) {
                if (m.senderStuId !== user.stuId) {
                    otherStuId = m.senderStuId;
                    if (m.senderName) otherName = m.senderName;
                }
            });

            sessions.push({
                key: key,
                productId: lastMsg.productId,
                productName: lastMsg.productName,
                lastMsg: lastMsg,
                unreadCount: unreadCount,
                otherStuId: otherStuId,
                otherName: otherName,
                timestamp: lastMsg.timestamp || 0
            });
        });

        sessions.sort(function(a, b) { return b.timestamp - a.timestamp; });

        var unread = getProfileUnreadCount();
        var profileBadge = document.getElementById('profileUnreadBadge');
        if (profileBadge) {
            if (unread > 0) { profileBadge.style.display = 'inline'; profileBadge.textContent = unread + '条未读'; }
            else { profileBadge.style.display = 'none'; }
        }
        var navBadge = document.getElementById('navUnreadBadge');
        if (navBadge) {
            if (unread > 0) { navBadge.style.display = 'inline'; navBadge.textContent = unread; }
            else { navBadge.style.display = 'none'; }
        }

        if (sessions.length === 0) {
            list.innerHTML = '<div class="chat-list-empty"><i class="fas fa-inbox"></i><p>暂无私信记录</p></div>';
            return;
        }

        var html = '';
        sessions.forEach(function(s) {
            var avatarText = s.productName ? s.productName.charAt(0) : '?';
            html += '<div class="chat-list-item' + (s.unreadCount > 0 ? ' has-unread' : '') + '" data-key="' + s.key + '" data-product-id="' + s.productId + '">' +
                '<div class="chat-list-avatar">' + avatarText +
                    (s.unreadCount > 0 ? '<span class="chat-list-unread-dot">' + s.unreadCount + '</span>' : '') +
                '</div>' +
                '<div class="chat-list-info">' +
                    '<div class="chat-list-name"><span>' + escapeProfileHtml(s.otherName || s.otherStuId || '卖家') + '</span><span class="chat-list-time">' + s.lastMsg.time + '</span></div>' +
                    '<div class="chat-list-preview">' + escapeProfileHtml(s.lastMsg.text) + '</div>' +
                    '<div class="chat-list-product"><i class="fas fa-tag"></i> ' + escapeProfileHtml(s.productName) + '</div>' +
                '</div>' +
            '</div>';
        });
        list.innerHTML = html;

        list.querySelectorAll('.chat-list-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var sessionKey = this.dataset.key;
                if (sessionKey) {
                    var chatData2 = getChatData();
                    var msgs = chatData2[sessionKey] || [];
                    var changed = false;
                    msgs.forEach(function(m) {
                        if (m.senderStuId !== user.stuId && !m.read) {
                            m.read = true;
                            changed = true;
                        }
                    });
                    if (changed) {
                        saveChatData(chatData2);
                        var profileBadge2 = document.getElementById('profileUnreadBadge');
                        var newUnread = getProfileUnreadCount();
                        if (profileBadge2) {
                            if (newUnread > 0) { profileBadge2.style.display = 'inline'; profileBadge2.textContent = newUnread + '条未读'; }
                            else { profileBadge2.style.display = 'none'; }
                        }
                        var navBadge2 = document.getElementById('navUnreadBadge');
                        if (navBadge2) {
                            if (newUnread > 0) { navBadge2.style.display = 'inline'; navBadge2.textContent = newUnread; }
                            else { navBadge2.style.display = 'none'; }
                        }
                    }
                }
                var productId = parseInt(this.dataset.productId);
                if (productId) window.location.href = 'detail.html?id=' + productId;
            });
        });
    }

    loadMyMessages();

    var messagesNavItem = document.querySelector('.nav-item[data-section="messages"]');
    if (messagesNavItem) {
        messagesNavItem.addEventListener('click', function() {
            setTimeout(function() { loadMyMessages(); }, 100);
        });
    }
});
