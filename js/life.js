document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
     * 顶部轮播Banner
     * ============================================================ */
    (function initBannerSlider() {
        var slides = document.querySelectorAll('#bannerSlides .life-banner-slide');
        var dots = document.querySelectorAll('#bannerDots .life-banner-dot');
        if (!slides.length) return;

        var current = 0;
        var total = slides.length;
        var timer = null;

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = index % total;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                goTo(parseInt(this.getAttribute('data-slide')));
                resetTimer();
            });
        });

        function startAuto() {
            stopAuto();
            timer = setInterval(function() { goTo(current + 1); }, 4000);
        }

        function stopAuto() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        function resetTimer() {
            stopAuto();
            startAuto();
        }

        var banner = document.querySelector('.life-banner');
        if (banner) {
            banner.addEventListener('mouseenter', stopAuto);
            banner.addEventListener('mouseleave', startAuto);
        }

        startAuto();
        console.log('[生活服务] 轮播初始化完成，共', total, '张');
    })();
});
