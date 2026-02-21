/* ============================================
   CARRILHO SEGUROS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Header Scroll Effect ----
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        header.classList.toggle('is-scrolled', scrollY > 50);
        backToTop.classList.toggle('is-visible', scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Mobile Navigation ----
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    let overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const toggleNav = () => {
        const isOpen = mainNav.classList.toggle('is-open');
        hamburger.classList.toggle('is-active');
        overlay.classList.toggle('is-visible', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeNav = () => {
        mainNav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleNav);
    overlay.addEventListener('click', closeNav);

    mainNav.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // ---- Active Nav Link on Scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    const updateActiveLink = () => {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ---- Scroll Animations (Intersection Observer) ----
    const animatedElements = document.querySelectorAll('[data-animate]');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, parseInt(delay));
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));

    // ---- Counter Animation ----
    const counters = document.querySelectorAll('.stats__number[data-count]');

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            const current = Math.round(eased * target);

            el.textContent = current.toLocaleString('pt-PT');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ---- FAQ Accordion ----
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('is-active');

            faqItems.forEach(other => other.classList.remove('is-active'));

            if (!isActive) {
                item.classList.add('is-active');
            }
        });
    });

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            if (!data.name || !data.phone || !data.email) {
                showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            if (!data.consent) {
                showToast('Por favor, aceite a Política de Privacidade para continuar.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span>Enviando...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.innerHTML = `
                    <div class="form-success is-visible">
                        <svg viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2"/>
                            <path d="M20 32L28 40L44 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h3>Pedido Enviado com Sucesso!</h3>
                        <p>Entraremos em contato com você em menos de 24 horas. Obrigado pela sua confiança!</p>
                    </div>
                `;
            }, 1500);
        });
    }

    // ---- Toast Notification ----
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" aria-label="Fechar">&times;</button>
        `;

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: type === 'error' ? '#FEF2F2' : '#F0FDF4',
            color: type === 'error' ? '#DC2626' : '#16A34A',
            border: `1px solid ${type === 'error' ? '#FECACA' : '#BBF7D0'}`,
            padding: '14px 24px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '9999',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        const closeBtn = toast.querySelector('button');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '1.3rem',
            cursor: 'pointer',
            padding: '0 0 0 8px',
            lineHeight: '1'
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // ---- Back to Top ----
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Parallax-like subtle effect on hero ----
    const heroContent = document.querySelector('.hero__content');
    const heroVisual = document.querySelector('.hero__visual');

    if (window.innerWidth > 768 && heroContent && heroVisual) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                const opacity = 1 - (scrollY / (window.innerHeight * 0.8));
                const translateY = scrollY * 0.3;
                heroContent.style.opacity = Math.max(opacity, 0);
                heroContent.style.transform = `translateY(${translateY}px)`;
                heroVisual.style.opacity = Math.max(opacity, 0);
                heroVisual.style.transform = `translateY(${translateY * 0.5}px)`;
            }
        }, { passive: true });
    }

});
