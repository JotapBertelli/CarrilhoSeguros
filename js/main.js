/**
 * Carrilho Seguros — Main JS
 */

(function () {
    'use strict';

    /* ============================================
       HEADER — scroll class
       ============================================ */
    const header = document.getElementById('header');

    function onScroll() {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        toggleBackToTop();
        updateActiveNavLink();
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ============================================
       HAMBURGER / MOBILE NAV
       ============================================ */
    const hamburger = document.getElementById('hamburger');
    const mainNav   = document.getElementById('mainNav');
    const overlay   = document.getElementById('navOverlay');

    function closeNav() {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const open = hamburger.classList.toggle('open');
            mainNav.classList.toggle('open', open);
            overlay.classList.toggle('visible', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
    }

    if (overlay) overlay.addEventListener('click', closeNav);

    document.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    /* ============================================
       ACTIVE NAV ON SCROLL
       ============================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - (header.offsetHeight + 80);
            if (window.scrollY >= top) current = section.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    /* ============================================
       SCROLL REVEAL (Intersection Observer)
       ============================================ */
    const reveals = document.querySelectorAll('[data-reveal]');

    if (reveals.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const delay = parseInt(el.dataset.delay || '0', 10);
                setTimeout(() => el.classList.add('revealed'), delay);
                observer.unobserve(el);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    /* ============================================
       COUNTER ANIMATION
       ============================================ */
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(el, from, to, duration) {
        const start = performance.now();
        const isFloat = String(to).includes('.');

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = from + (to - from) * easeOutQuart(progress);
            el.textContent = isFloat
                ? value.toFixed(1)
                : Math.round(value).toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const statNumbers = document.querySelectorAll('[data-count]');
    if (statNumbers.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                animateCounter(el, 0, target, 1800);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    /* ============================================
       FAQ ACCORDION
       ============================================ */
    document.querySelectorAll('.faq__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq__item');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));

            // Toggle current
            if (!isOpen) item.classList.add('open');
        });
    });

    /* ============================================
       BACK TO TOP
       ============================================ */
    const btt = document.getElementById('backToTop');

    function toggleBackToTop() {
        if (btt) btt.classList.toggle('visible', window.scrollY > 400);
    }

    if (btt) {
        btt.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    onScroll();

    /* ============================================
       HERO STAGGER (CSS-driven, just add class)
       ============================================ */
    const heroItems = document.querySelectorAll('[data-hero-animate]');
    heroItems.forEach((el, i) => {
        el.style.animationDelay = (i * 120 + 100) + 'ms';
        el.classList.add('hero-animate');
    });

    /* ============================================
       CONTACT FORM (basic)
       ============================================ */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const success = document.getElementById('formSuccess');
            if (success) {
                form.style.display = 'none';
                success.style.display = 'block';
            }
        });
    }

})();
