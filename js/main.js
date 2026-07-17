/* ============================================
   Auteur : Votre Nom - Votre Prénom
   Projet : AfriConnect Summit 2026
   Description : Fonctionnalités JavaScript du site
   ============================================ */

/**
 * ============================================
 * 1. DARK MODE / LIGHT MODE
 *    - Toggle dans la navbar
 *    - Sauvegarde dans localStorage
 *    - Persistant entre les pages
 * ============================================ */

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const currentTheme = localStorage.getItem('theme') || 'light';

// Appliquer le thème sauvegardé au chargement
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) {
        themeIcon.className = 'bi bi-sun-fill';
    }
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) {
        themeIcon.className = 'bi bi-moon-fill';
    }
}

// Gestion du toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (themeIcon) {
                themeIcon.className = 'bi bi-moon-fill';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (themeIcon) {
                themeIcon.className = 'bi bi-sun-fill';
            }
        }
    });
}

/**
 * ============================================
 * 2. NAVBAR DYNAMIQUE
 *    - Changement de fond après 80px de défilement
 *    - Menu hamburger fonctionnel sur mobile
 * ============================================ */

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

// Navbar scroll effect
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Hamburger menu
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        // Changer l'icône hamburger
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('open')) {
            icon.className = 'bi bi-x-lg';
        } else {
            icon.className = 'bi bi-list';
        }
    });

    // Fermer le menu au clic sur un lien (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            const icon = hamburger.querySelector('i');
            icon.className = 'bi bi-list';
        });
    });

    // Fermer le menu au clic en dehors
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            const icon = hamburger.querySelector('i');
            icon.className = 'bi bi-list';
        }
    });
}

/**
 * ============================================
 * 3. COMPTE À REBOURS EN TEMPS RÉEL
 *    - Date fictive : 15 Décembre 2026 à 09:00
 * ============================================ */

function initCountdown() {
    const countdownDate = new Date('December 15, 2026 09:00:00').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Vérifier que les éléments existent
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Mettre à jour toutes les secondes
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialiser le compte à rebours
initCountdown();

/**
 * ============================================
 * 4. COMPTEURS ANIMÉS AU SCROLL
 *    - Incrémentation au scroll
 *    - IntersectionObserver
 * ============================================ */

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateNumber(stat, target);
                });
            }
        });
    }, { threshold: 0.3 });

    observer.observe(document.getElementById('stats'));
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 60; // Animation sur ~60 frames (1 seconde à 60fps)
    const duration = 1000; // 1 seconde
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing function pour un effet plus naturel
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}

// Initialiser les compteurs
initStatsCounter();

/**
 * ============================================
 * 5. ANIMATIONS FADE-IN / SLIDE-IN AU SCROLL
 *    - IntersectionObserver
 * ============================================ */

function initScrollAnimations() {
    // Sélectionner tous les éléments à animer
    const animateElements = document.querySelectorAll(
        '.why-item, .thematic-item, .fade-in, .slide-in-left, .slide-in-right, .zoom-in'
    );

    if (animateElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialiser les animations au scroll
initScrollAnimations();

/**
 * ============================================
 * 6. ONGLETS DU PROGRAMME
 *    - Affichage/masquage des 3 jours
 * ============================================ */

function initProgramTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length === 0 || tabContents.length === 0) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Désactiver tous les onglets
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });

            // Activer l'onglet cliqué
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Masquer tous les contenus
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Afficher le contenu correspondant
            const day = btn.getAttribute('data-day');
            const targetContent = document.getElementById(`day${day}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Initialiser les onglets
initProgramTabs();

/**
 * ============================================
 * 7. FILTRAGE DYNAMIQUE DES INTERVENANTS
 *    - Affichage/masquage selon catégorie
 * ============================================ */

function initSpeakerFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const speakerCards = document.querySelectorAll('.speaker-card');

    if (filterBtns.length === 0 || speakerCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Désactiver tous les filtres
            filterBtns.forEach(b => {
                b.classList.remove('active');
            });

            // Activer le filtre cliqué
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            speakerCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    // Animation d'apparition
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    const category = card.getAttribute('data-category');
                    if (category === filter) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Initialiser le filtrage
initSpeakerFilter();

/**
 * ============================================
 * 8. VALIDATION DE FORMULAIRE
 *    - Tous les champs requis
 *    - Email vérifié par regex
 *    - Téléphone minimum 8 chiffres
 *    - Message minimum 20 caractères
 *    - Retour visuel par champ
 *    - Message de succès
 * ============================================ */

function initFormValidation() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const participation = document.getElementById('participation');
    const country = document.getElementById('country');
    const message = document.getElementById('message');
    const successDiv = document.getElementById('formSuccess');

    // Fonction de validation d'email
    function isValidEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }

    // Fonction de validation de téléphone (minimum 8 chiffres)
    function isValidPhone(value) {
        const digits = value.replace(/\D/g, '');
        return digits.length >= 8;
    }

    // Fonction de validation d'un champ
    function validateField(field, validator, errorMessage) {
        const value = field.value.trim();
        const errorEl = field.closest('.form-group').querySelector('.error-message');

        if (!value || !validator(value)) {
            field.closest('.form-group').classList.add('error');
            field.closest('.form-group').classList.remove('success');
            if (errorEl) {
                errorEl.textContent = errorMessage;
            }
            return false;
        } else {
            field.closest('.form-group').classList.remove('error');
            field.closest('.form-group').classList.add('success');
            if (errorEl) {
                errorEl.textContent = '';
            }
            return true;
        }
    }

    // Validation en temps réel (perte de focus)
    const fields = [
        {
            element: fullName,
            validator: (v) => v.length >= 2,
            message: 'Veuillez entrer un nom complet valide (minimum 2 caractères)'
        },
        {
            element: email,
            validator: isValidEmail,
            message: 'Veuillez entrer une adresse email valide (ex: nom@domaine.com)'
        },
        {
            element: phone,
            validator: isValidPhone,
            message: 'Veuillez entrer un numéro valide (minimum 8 chiffres)'
        },
        {
            element: participation,
            validator: (v) => v !== '',
            message: 'Veuillez sélectionner un type de participation'
        },
        {
            element: country,
            validator: (v) => v !== '',
            message: 'Veuillez sélectionner votre pays d\'origine'
        },
        {
            element: message,
            validator: (v) => v.length >= 20,
            message: 'Votre message doit contenir au moins 20 caractères'
        }
    ];

    fields.forEach(({ element, validator, message }) => {
        if (!element) return;
        element.addEventListener('blur', () => {
            validateField(element, validator, message);
        });
        element.addEventListener('input', () => {
            const value = element.value.trim();
            const errorEl = element.closest('.form-group').querySelector('.error-message');
            if (value && validator(value)) {
                element.closest('.form-group').classList.remove('error');
                element.closest('.form-group').classList.add('success');
                if (errorEl) errorEl.textContent = '';
            } else {
                element.closest('.form-group').classList.remove('success');
            }
        });
    });

    // Soumission du formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Valider tous les champs
        let isValid = true;
        fields.forEach(({ element, validator, message }) => {
            if (!element) return;
            const valid = validateField(element, validator, message);
            if (!valid) isValid = false;
        });

        if (isValid && successDiv) {
            // Afficher le message de succès
            successDiv.style.display = 'block';
            successDiv.innerHTML = `
                <i class="bi bi-check-circle-fill"></i>
                <p>Inscription réussie ! Merci ${fullName.value.trim()}.</p>
                <p style="font-size:14px;opacity:0.9;margin-top:4px;">Vous recevrez un email de confirmation sous 48h.</p>
            `;

            // Réinitialiser le formulaire après 3 secondes
            setTimeout(() => {
                form.reset();
                // Retirer les classes de succès/erreur
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('success', 'error');
                    const errorEl = group.querySelector('.error-message');
                    if (errorEl) errorEl.textContent = '';
                });
                // Masquer le message de succès après 5 secondes
                setTimeout(() => {
                    if (successDiv) {
                        successDiv.style.display = 'none';
                    }
                }, 5000);
            }, 3000);

            // Re-scroller en haut du formulaire
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Initialiser la validation du formulaire
initFormValidation();

/**
 * ============================================
 * 9. BOUTON RETOUR EN HAUT
 *    - Apparaît après 300px de défilement
 *    - Remonte en douceur
 * ============================================ */

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialiser le bouton retour en haut
initBackToTop();

/**
 * ============================================
 * 10. ANNÉE DYNAMIQUE DANS LE FOOTER
 *     - new Date().getFullYear()
 * ============================================ */

function initDynamicYear() {
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();

    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// Initialiser l'année dynamique
initDynamicYear();

/**
 * ============================================
 * 11. GESTION DES LIENS ACTIFS DANS LA NAVBAR
 *     - Ajout automatique de la classe 'active'
 * ============================================ */

function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialiser le lien actif
initActiveNavLink();

/**
 * ============================================
 * 12. OPTIMISATION : PERFORMANCE
 *     - Debounce pour les événements scroll
 * ============================================ */

// Debounce function pour optimiser les événements scroll
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Appliquer le debounce au scroll (optionnel)
// window.addEventListener('scroll', debounce(() => {
//     // Vos fonctions scroll ici
// }, 50));

/**
 * ============================================
 * 13. INITIALISATION GÉNÉRALE
 *     - Toutes les fonctions sont appelées
 * ============================================ */

// Petit message de bienvenue dans la console
console.log('🚀 AfriConnect Summit 2026');
console.log('📅 15-17 Décembre 2026 · Dakar, Sénégal');
console.log('💻 Site développé avec ❤️ en JavaScript Vanilla');