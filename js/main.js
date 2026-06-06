document.addEventListener('DOMContentLoaded', function() {
    initNavAuth();

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        const texts = ['智慧校园', '便捷生活', '智能服务', '共创未来'];
        let textIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < texts[textIndex].length) {
                typewriter.textContent += texts[textIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, 150);
            } else {
                setTimeout(erase, 2000);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typewriter.textContent = texts[textIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, 100);
            } else {
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            }
        }

        type();
    }

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        themeToggle.addEventListener('click', function() {
            const theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    const announcementCarousel = document.getElementById('announcementCarousel');
    if (announcementCarousel) {
        const slides = announcementCarousel.querySelectorAll('.announcement-slide');
        const dotsContainer = document.getElementById('announcementDots');
        const prevBtn = document.getElementById('announcementPrev');
        const nextBtn = document.getElementById('announcementNext');
        let currentGroup = 0;
        const perGroup = 3;

        const totalGroups = Math.ceil(slides.length / perGroup);

        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
            dot.addEventListener('click', function() {
                goToGroup(parseInt(this.dataset.index));
            });
        }

        function goToGroup(index) {
            slides.forEach(s => s.classList.remove('active'));
            const start = index * perGroup;
            const end = Math.min(start + perGroup, slides.length);
            for (let i = start; i < end; i++) {
                slides[i].classList.add('active');
            }
            dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
            currentGroup = index;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                const newIndex = currentGroup === 0 ? totalGroups - 1 : currentGroup - 1;
                goToGroup(newIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const newIndex = currentGroup === totalGroups - 1 ? 0 : currentGroup + 1;
                goToGroup(newIndex);
            });
        }

        setInterval(() => {
            const newIndex = currentGroup === totalGroups - 1 ? 0 : currentGroup + 1;
            goToGroup(newIndex);
        }, 6000);

        slides.forEach(slide => {
            slide.addEventListener('click', function() {
                const title = this.dataset.title;
                const content = this.dataset.content;
                if (title && content) {
                    document.getElementById('modalTitle').textContent = title;
                    document.getElementById('modalBody').textContent = content;
                    document.getElementById('announcementModal').classList.add('active');
                }
            });
        });
    }

    const modal = document.getElementById('announcementModal');
    if (modal) {
        const modalClose = document.getElementById('modalClose');
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    const shCatBtns = document.querySelectorAll('.sh-cat-btn');
    const secondhandGrid = document.getElementById('secondhandGrid');

    const secondhandProducts = [
        { id: 1, name: 'MacBook Pro 14寸', category: 'digital', catLabel: '数码电子', price: 8999, image: 'https://picsum.photos/seed/mbp/400/300', seller: '小明', views: 123 },
        { id: 2, name: '考研英语真题全套', category: 'books', catLabel: '教材课本', price: 50, image: 'https://picsum.photos/seed/books1/400/300', seller: '学姐', views: 89 },
        { id: 3, name: 'AirPods Pro 2', category: 'digital', catLabel: '数码电子', price: 1299, image: 'https://picsum.photos/seed/airpods/400/300', seller: '小李', views: 234 },
        { id: 4, name: '羽毛球拍套装', category: 'sports', catLabel: '运动器材', price: 180, image: 'https://picsum.photos/seed/badminton/400/300', seller: '运动达人', views: 67 },
        { id: 5, name: '小米台灯', category: 'daily', catLabel: '生活用品', price: 60, image: 'https://picsum.photos/seed/lamp/400/300', seller: '毕业生', views: 156 },
        { id: 6, name: '高等数学教材', category: 'books', catLabel: '教材课本', price: 30, image: 'https://picsum.photos/seed/mathbook/400/300', seller: '学长', views: 45 },
        { id: 7, name: '电工实训工具箱', category: 'tools', catLabel: '实训工具', price: 120, image: 'https://picsum.photos/seed/toolbox/400/300', seller: '工科生', views: 78 },
        { id: 8, name: '瑜伽垫加厚款', category: 'sports', catLabel: '运动器材', price: 45, image: 'https://picsum.photos/seed/yogamat/400/300', seller: '瑜伽社', views: 92 }
    ];

    function renderSecondhand(cat) {
        if (!secondhandGrid) return;
        secondhandGrid.innerHTML = '';
        const filtered = cat === 'all' ? secondhandProducts : secondhandProducts.filter(p => p.category === cat);
        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'secondhand-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="secondhand-info">
                    <span class="secondhand-category">${product.catLabel}</span>
                    <h3 class="secondhand-title">${product.name}</h3>
                    <div class="secondhand-price">¥${product.price}</div>
                    <div class="secondhand-meta">
                        <span>${product.seller}</span>
                        <span><i class="fas fa-eye"></i> ${product.views}</span>
                    </div>
                </div>
            `;
            card.addEventListener('click', function() {
                window.location.href = 'secondhand.html';
            });
            secondhandGrid.appendChild(card);
        });
    }

    renderSecondhand('all');

    shCatBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            shCatBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderSecondhand(this.dataset.cat);
        });
    });

    const eventTabs = document.querySelectorAll('.event-tab');
    const eventCards = document.querySelectorAll('.event-card');

    eventTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            eventTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            eventCards.forEach(card => {
                if (tabId === 'all' || card.dataset.tab === tabId) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    function animateNumber(element, target, duration) {
        duration = duration || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        function update() {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        update();
    }

    const dataCardValues = document.querySelectorAll('.data-card-value');
    if (dataCardValues.length > 0) {
        const dataObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    dataCardValues.forEach(el => {
                        const target = parseInt(el.dataset.target);
                        animateNumber(el, target);
                    });
                    dataObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });
        dataObserver.observe(document.querySelector('.data-preview-section'));
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

function initNavAuth() {
    var user = null;
    if (window.CampusDB) {
        user = CampusDB.getCurrentUser();
    } else {
        try {
            user = JSON.parse(localStorage.getItem('campus_current_user') || 'null');
        } catch(e) { user = null; }
    }

    var navRight = document.querySelector('.nav-right');
    var navMenu = document.getElementById('navMenu');
    if (!navRight) return;

    if (user) {
        var loginBtn = navRight.querySelector('.login-btn');
        if (loginBtn) loginBtn.remove();

        var userDiv = document.createElement('div');
        userDiv.className = 'nav-user';
        userDiv.id = 'navUser';

        var roleIcon = user.role === 'admin' ? 'fa-user-shield' : 'fa-user-graduate';
        var roleLabel = user.role === 'admin' ? '管理员' : user.name;
        var roleColor = user.role === 'admin' ? '#8b5cf6' : '#3b82f6';

        var navAvatarHtml = '<div class="nav-user-avatar" style="background:' + roleColor + '"><i class="fas ' + roleIcon + '"></i></div>';
        if (user.role === 'student' && user.stuId) {
            var avatarUrl = window.CampusDB ? CampusDB.getUserAvatar(user.stuId) : null;
            if (!avatarUrl) {
                try {
                    var avatars = JSON.parse(localStorage.getItem('campus_avatars') || '{}');
                    avatarUrl = avatars[user.stuId] || null;
                } catch(e) {}
            }
            if (avatarUrl) {
                navAvatarHtml = '<div class="nav-user-avatar" style="padding:0;overflow:hidden"><img src="' + avatarUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.outerHTML=\'\'"></div>';
            }
        }

        userDiv.innerHTML = navAvatarHtml + '<span class="nav-user-name">' + roleLabel + '</span><div class="nav-user-dropdown" id="userDropdown"><div class="nav-user-info"><i class="fas ' + roleIcon + '"></i><div><strong>' + (user.name || '') + '</strong><span>' + (user.role === 'admin' ? '系统管理员' : user.stuId + ' · ' + (user.dept || '')) + '</span></div></div>' + (user.role === 'admin' ? '<a href="admin.html" class="nav-dropdown-item"><i class="fas fa-cog"></i> 后台管理</a>' : '<a href="profile.html" class="nav-dropdown-item"><i class="fas fa-user"></i> 个人中心</a><a href="javascript:void(0)" class="nav-dropdown-item" id="navMyChat"><i class="fas fa-comment-dots"></i> 我的私信</a>') + '<a href="javascript:void(0)" class="nav-dropdown-item logout" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> 退出登录</a></div>';

        navRight.insertBefore(userDiv, navRight.firstChild);

        userDiv.addEventListener('click', function(e) {
            if (e.target.closest('.nav-dropdown-item')) return;
            var dd = document.getElementById('userDropdown');
            dd.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!userDiv.contains(e.target)) {
                var dd = document.getElementById('userDropdown');
                if (dd) dd.classList.remove('active');
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', function() {
            if (window.CampusDB) {
                CampusDB.clearCurrentUser();
            } else {
                localStorage.removeItem('campus_current_user');
            }
            window.location.href = 'index.html';
        });

        var navMyChat = document.getElementById('navMyChat');
        if (navMyChat) {
            navMyChat.addEventListener('click', function() {
                openGlobalChatModal();
            });
        }

        if (user.role === 'student') {
            var chatBtn = document.createElement('button');
            chatBtn.className = 'nav-chat-btn';
            chatBtn.id = 'navChatBtn';
            chatBtn.innerHTML = '<i class="fas fa-comment-dots"></i> 私信';
            var unreadCount = getGlobalUnreadCount();
            if (unreadCount > 0) {
                chatBtn.innerHTML += '<span class="chat-badge">' + unreadCount + '</span>';
            }
            navRight.insertBefore(chatBtn, navRight.firstChild);
            chatBtn.addEventListener('click', function() {
                openGlobalChatModal();
            });
        }

        if (user.role === 'admin' && navMenu && !window.location.pathname.includes('admin.html')) {
            var adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.className = 'nav-link nav-admin-link';
            adminLink.innerHTML = '<i class="fas fa-cog"></i> 后台管理';
            navMenu.appendChild(adminLink);
        }
    }
}

function getGlobalUnreadCount() {
    var user = null;
    if (window.CampusDB) {
        user = CampusDB.getCurrentUser();
    } else {
        try { user = JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) { return 0; }
    }
    if (!user || user.role !== 'student') return 0;
    if (window.CampusDB) {
        return CampusDB.getUnreadChatCount(user.stuId);
    }
    var chatData = {};
    try { chatData = JSON.parse(localStorage.getItem('campus_chat') || '{}'); } catch(e2) {}
    var count = 0;
    Object.keys(chatData).forEach(function(key) {
        var messages = chatData[key] || [];
        messages.forEach(function(m) {
            if (m.senderStuId !== user.stuId && !m.read) count++;
        });
    });
    return count;
}

function escapeGlobalHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openGlobalChatModal() {
    var user = null;
    if (window.CampusDB) { user = CampusDB.getCurrentUser(); } else {
        try { user = JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) {}
    }
    if (!user || user.role !== 'student') {
        alert('请先登录后查看私信');
        window.location.href = 'login.html';
        return;
    }

    var existing = document.getElementById('globalChatOverlay');
    if (existing) { existing.classList.add('active'); renderGlobalChatSessions(); return; }

    var overlay = document.createElement('div');
    overlay.className = 'chat-modal-overlay';
    overlay.id = 'globalChatOverlay';
    overlay.innerHTML = '<div class="chat-modal">' +
        '<div class="chat-modal-header">' +
            '<h3><i class="fas fa-comments"></i> 我的私信 <span class="unread-badge" id="globalChatUnreadBadge" style="display:none"></span></h3>' +
            '<button class="chat-modal-close" id="globalChatClose"><i class="fas fa-times"></i></button>' +
        '</div>' +
        '<div class="chat-modal-body" id="globalChatBody"></div>' +
    '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.classList.remove('active');
    });
    document.getElementById('globalChatClose').addEventListener('click', function() {
        overlay.classList.remove('active');
    });

    renderGlobalChatSessions();
}

function renderGlobalChatSessions() {
    var user = null;
    if (window.CampusDB) { user = CampusDB.getCurrentUser(); } else {
        try { user = JSON.parse(localStorage.getItem('campus_current_user') || 'null'); } catch(e) {}
    }
    if (!user) return;
    var chatData = {};
    if (window.CampusDB) { chatData = CampusDB.getChat(); } else {
        try { chatData = JSON.parse(localStorage.getItem('campus_chat') || '{}'); } catch(e2) {}
    }
    var body = document.getElementById('globalChatBody');
    if (!body) return;

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

    var unread = getGlobalUnreadCount();
    var badge = document.getElementById('globalChatUnreadBadge');
    if (badge) {
        if (unread > 0) { badge.style.display = 'inline'; badge.textContent = unread + '条未读'; }
        else { badge.style.display = 'none'; }
    }
    refreshGlobalNavBadge();

    if (sessions.length === 0) {
        body.innerHTML = '<div class="chat-modal-empty"><i class="fas fa-inbox"></i><p>暂无私信记录</p></div>';
        return;
    }

    var html = '';
    sessions.forEach(function(s) {
        var avatarText = s.productName ? s.productName.charAt(0) : '?';
        html += '<div class="chat-session-item' + (s.unreadCount > 0 ? ' has-unread' : '') + '" data-key="' + s.key + '" data-product-id="' + s.productId + '">' +
            '<div class="chat-session-avatar">' + avatarText +
                (s.unreadCount > 0 ? '<span class="unread-dot">' + s.unreadCount + '</span>' : '') +
            '</div>' +
            '<div class="chat-session-info">' +
                '<div class="chat-session-name"><span>' + escapeGlobalHtml(s.otherName || s.otherStuId || '卖家') + '</span><span class="time">' + s.lastMsg.time + '</span></div>' +
                '<div class="chat-session-preview">' + escapeGlobalHtml(s.lastMsg.text) + '</div>' +
                '<div class="chat-session-product"><i class="fas fa-tag"></i> ' + escapeGlobalHtml(s.productName) + '</div>' +
            '</div>' +
        '</div>';
    });
    body.innerHTML = html;

    body.querySelectorAll('.chat-session-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var productId = parseInt(this.dataset.productId);
            var sessionKey = this.dataset.key;
            if (sessionKey) {
                if (window.CampusDB) {
                    CampusDB.markChatAsRead(sessionKey, user.stuId);
                    refreshGlobalNavBadge();
                } else {
                    var chatData2 = {};
                    try { chatData2 = JSON.parse(localStorage.getItem('campus_chat') || '{}'); } catch(e3) {}
                    var msgs = chatData2[sessionKey] || [];
                    var changed = false;
                    msgs.forEach(function(m) {
                        if (m.senderStuId !== user.stuId && !m.read) {
                            m.read = true;
                            changed = true;
                        }
                    });
                    if (changed) {
                        localStorage.setItem('campus_chat', JSON.stringify(chatData2));
                        refreshGlobalNavBadge();
                    }
                }
            }
            var overlay = document.getElementById('globalChatOverlay');
            if (overlay) overlay.classList.remove('active');
            if (productId) window.location.href = 'detail.html?id=' + productId;
        });
    });
}

function refreshGlobalNavBadge() {
    var unread = getGlobalUnreadCount();
    var navBtn = document.getElementById('navChatBtn');
    if (navBtn) {
        var existingBadge = navBtn.querySelector('.chat-badge');
        if (existingBadge) existingBadge.remove();
        if (unread > 0) {
            var badge = document.createElement('span');
            badge.className = 'chat-badge';
            badge.textContent = unread;
            navBtn.appendChild(badge);
        }
    }
    var globalBadge = document.getElementById('globalChatUnreadBadge');
    if (globalBadge) {
        if (unread > 0) { globalBadge.style.display = 'inline'; globalBadge.textContent = unread + '条未读'; }
        else { globalBadge.style.display = 'none'; }
    }
}
