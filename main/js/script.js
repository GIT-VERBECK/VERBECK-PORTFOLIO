// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const themeToggle = document.getElementById('themeToggle');

    // Toggle menu mobile
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Empêcher le scroll du body quand le menu est ouvert
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Fermer le menu mobile quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger && hamburger.classList.remove('active');
            navMenu && navMenu.classList.remove('active');
        });
    });

    // Navbar scrolled class
    function updateNavbarOnScroll() {
        if (!navbar) return;
        if (window.scrollY > 24) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    updateNavbarOnScroll();
    window.addEventListener('scroll', updateNavbarOnScroll);

    // Smooth scroll via scrollIntoView (les liens sont déjà interceptés)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // IntersectionObserver animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skills-grid, .projects-grid, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Animation des statistiques
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-card h3');
        statNumbers.forEach(stat => {
            const raw = stat.textContent.replace('+', '').trim();
            const target = parseInt(raw, 10) || 0;
            const increment = Math.max(1, Math.ceil(target / 40));
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = current + '+';
            }, 28);
        });
    }

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            if (!name || !email || !subject || !message) {
                showNotification('Veuillez remplir tous les champs', 'error');
                return;
            }
            showNotification('Message envoyé avec succès !', 'success');
            this.reset();
        });
    }

    // Système de notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px; padding: 14px 18px; border-radius: 8px; color: white;
            font-weight: 500; z-index: 10000; transform: translateX(400px); transition: transform 0.25s ease; max-width: 300px; box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        `;
        notification.style.background = type === 'success' ? '#10b981' : '#ef4444';
        document.body.appendChild(notification);
        requestAnimationFrame(() => { notification.style.transform = 'translateX(0)'; });
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => { notification.remove(); }, 250);
        }, 2600);
    }

    // Effet de parallaxe désactivé (pour éviter conflits avec demi-dégradé)
    // window.addEventListener('scroll', () => { /* no-op */ });

    // Animation des cartes (légère)
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-6px)'; });
        card.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)'; });
    });

    // Animation des catégories de compétences
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 10px 26px rgba(0, 0, 0, 0.12)';
        });
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Compteur de visiteurs (simulation)
    function updateVisitorCount() {
        const visitorCount = localStorage.getItem('visitorCount') || 0;
        const newCount = parseInt(visitorCount, 10) + 1;
        localStorage.setItem('visitorCount', newCount);
        const footer = document.querySelector('.footer-bottom');
        if (footer && !footer.querySelector('.visitor-count')) {
            const visitorElement = document.createElement('p');
            visitorElement.className = 'visitor-count';
            visitorElement.style.cssText = 'margin-top:10px;font-size:0.9rem;color:#9ca3af;';
            visitorElement.textContent = `Visiteurs: ${newCount}`;
            footer.appendChild(visitorElement);
        }
    }
    updateVisitorCount();

    // Effet typewriter désactivé pour sobriété
    // Thème (dark / light) avec persistance
    const THEME_KEY = 'jm_theme';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    let savedTheme = localStorage.getItem(THEME_KEY);
    if (!savedTheme) savedTheme = prefersDark ? 'dark' : 'light';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.body.classList.contains('dark') ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, next);
            applyTheme(next);
        });
    }

    // Nettoyage: suppression de l'ancien bouton mode sombre si existait
    const oldDarkBtn = document.querySelector('button[title="Mode sombre"]') || null;
    if (oldDarkBtn) oldDarkBtn.remove();

    // Reveal progressif du hero
    (function heroStaggerReveal(){
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hero = document.querySelector('.hero');
        const content = document.querySelector('.hero-content');
        const imageCard = document.querySelector('.hero-image .profile-card');
        const floatCard = document.querySelector('.hero-image .floating-card');
        if (!hero || !content) return;

        const items = [
            content.querySelector('.hero-badge'),
            content.querySelector('.hero-title'),
            content.querySelector('.hero-subtitle'),
            content.querySelector('.hero-description'),
            ...Array.from(content.querySelectorAll('.hero-features .feature-item')),
            content.querySelector('.hero-buttons'),
            content.querySelector('.hero-stats'),
            imageCard,
            floatCard
        ].filter(Boolean);

        if (prefersReduced) {
            items.forEach(el => el.classList.add('show'));
            return;
        }

        items.forEach((el, idx) => {
            el.classList.add('reveal');
            setTimeout(() => {
                el.classList.add('show');
            }, 120 + idx * 80);
        });
    })();

    console.log('Portfolio de Jean-Marc Verbeck chargé. Thème et navbar mis à jour.');

    // Nouvelles animations avancées
    function initAdvancedAnimations() {
        // Animation des cartes au survol
        const cards = document.querySelectorAll('.project-card, .skill-category, .stat-card');
        cards.forEach(card => {
            card.classList.add('hover-lift');
        });

        // Animation des boutons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.classList.add('hover-scale');
        });

        // Animation des icônes
        const icons = document.querySelectorAll('.profile-avatar i, .floating-card .card-icon i');
        icons.forEach(icon => {
            icon.classList.add('animate-float');
        });

        // Animation des titres de section
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            title.classList.add('animate-slide-in-left');
        });

        // Animation des éléments de la timeline
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            item.classList.add('animate-fade-in-up');
        });

        // Animation des compétences avec délai
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-slide-in-right');
        });

        // Animation des projets avec délai
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            card.classList.add('animate-scale-in');
        });

        // Animation des statistiques
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-rotate-in');
        });

        // Animation du hero avec effet de typewriter
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('animate-typing');
        }

        // Animation des particules flottantes
        createFloatingParticles();

        // Animation du scroll avec parallaxe
        initParallaxScroll();

        // Animation des éléments au scroll
        initScrollAnimations();
    }

    // Créer des particules flottantes
    function createFloatingParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            hero.appendChild(particle);
        }
    }

    // Animation du scroll avec parallaxe
    function initParallaxScroll() {
        const parallaxElements = document.querySelectorAll('.floating-card, .profile-card');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Animations au scroll avancées
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation d'entrée avec effet de rebond
                    entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                    
                    // Ajouter des classes d'animation selon le type d'élément
                    if (entry.target.classList.contains('skill-category')) {
                        entry.target.classList.add('animate-slide-in-left');
                    } else if (entry.target.classList.contains('project-card')) {
                        entry.target.classList.add('animate-scale-in');
                    } else if (entry.target.classList.contains('timeline-item')) {
                        entry.target.classList.add('animate-fade-in-up');
                    }
                }
            });
        }, observerOptions);

        // Observer tous les éléments animables
        document.querySelectorAll('.skill-category, .project-card, .timeline-item, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Animation de la barre de progression des compétences
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || '80%';
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = width;
            }, 500);
        });
    }

    // Animation des cartes avec effet de brillance
    function addShimmerEffect() {
        const cards = document.querySelectorAll('.project-card, .skill-category');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('animate-shimmer');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('animate-shimmer');
            });
        });
    }

    // Animation du compteur de visiteurs avec effet de rebond
    function animateVisitorCounter() {
        const counter = document.querySelector('.visitor-counter');
        if (!counter) return;

        let count = 0;
        const target = 1234;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(timer);
                counter.classList.add('animate-pulse');
            }
            counter.textContent = Math.floor(count);
        }, 50);
    }

    // Initialiser toutes les animations
    function initAllAnimations() {
        initAdvancedAnimations();
        animateSkillBars();
        addShimmerEffect();
        animateVisitorCounter();
    }

    // Appeler les animations après le chargement
    setTimeout(initAllAnimations, 100);
});

// ... existing code ...

    // Nouvelles animations avancées
    function initAdvancedAnimations() {
        // Animation des cartes au survol
        const cards = document.querySelectorAll('.project-card, .skill-category, .stat-card');
        cards.forEach(card => {
            card.classList.add('hover-lift');
        });

        // Animation des boutons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.classList.add('hover-scale');
        });

        // Animation des icônes
        const icons = document.querySelectorAll('.profile-avatar i, .floating-card .card-icon i');
        icons.forEach(icon => {
            icon.classList.add('animate-float');
        });

        // Animation des titres de section
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            title.classList.add('animate-slide-in-left');
        });

        // Animation des éléments de la timeline
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            item.classList.add('animate-fade-in-up');
        });

        // Animation des compétences avec délai
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-slide-in-right');
        });

        // Animation des projets avec délai
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            card.classList.add('animate-scale-in');
        });

        // Animation des statistiques
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-rotate-in');
        });

        // Animation du hero avec effet de typewriter
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('animate-typing');
        }

        // Animation des particules flottantes
        createFloatingParticles();

        // Animation du scroll avec parallaxe
        initParallaxScroll();

        // Animation des éléments au scroll
        initScrollAnimations();
    }

    // Créer des particules flottantes
    function createFloatingParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            hero.appendChild(particle);
        }
    }

    // Animation du scroll avec parallaxe
    function initParallaxScroll() {
        const parallaxElements = document.querySelectorAll('.floating-card, .profile-card');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Animations au scroll avancées
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation d'entrée avec effet de rebond
                    entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                    
                    // Ajouter des classes d'animation selon le type d'élément
                    if (entry.target.classList.contains('skill-category')) {
                        entry.target.classList.add('animate-slide-in-left');
                    } else if (entry.target.classList.contains('project-card')) {
                        entry.target.classList.add('animate-scale-in');
                    } else if (entry.target.classList.contains('timeline-item')) {
                        entry.target.classList.add('animate-fade-in-up');
                    }
                }
            });
        }, observerOptions);

        // Observer tous les éléments animables
        document.querySelectorAll('.skill-category, .project-card, .timeline-item, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Animation de la barre de progression des compétences
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || '80%';
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = width;
            }, 500);
        });
    }

    // Animation des cartes avec effet de brillance
    function addShimmerEffect() {
        const cards = document.querySelectorAll('.project-card, .skill-category');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('animate-shimmer');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('animate-shimmer');
            });
        });
    }

    // Animation du compteur de visiteurs avec effet de rebond
    function animateVisitorCounter() {
        const counter = document.querySelector('.visitor-counter');
        if (!counter) return;

        let count = 0;
        const target = 1234;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(timer);
                counter.classList.add('animate-pulse');
            }
            counter.textContent = Math.floor(count);
        }, 50);
    }

    // Initialiser toutes les animations
    function initAllAnimations() {
        initAdvancedAnimations();
        animateSkillBars();
        addShimmerEffect();
        animateVisitorCounter();
    }

    // Appeler les animations après le chargement
    setTimeout(initAllAnimations, 100);
 