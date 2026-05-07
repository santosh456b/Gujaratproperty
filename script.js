/* ========================================
   GUJARAT PROPERTY - INTERACTIVE FUNCTIONALITY
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeFilterTabs();
    initializeSearchBar();
    initializeCarousel();
    initializeFormInteractions();
    initializeSmoothScroll();
    initializeHoverEffects();
    initializeObserver();
    initializeHeaderSticky();
    setupMobileMenu();
});

/* ========================================
   SEARCH BAR FUNCTIONALITY
   ======================================== */

function initializeSearchBar() {
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const location = document.querySelector('select[value=""]')?.value || 'Any';
            const propertyType = Array.from(document.querySelectorAll('.search-input'))[1].value || 'Any';
            const budget = Array.from(document.querySelectorAll('.search-input'))[2].value || 'Any';
            
            console.log('Search submitted:', { location, propertyType, budget });
            
            // Show feedback
            showSearchFeedback();
            
            // Scroll to properties section
            const propertiesSection = document.querySelector('.properties');
            if (propertiesSection) {
                setTimeout(() => {
                    propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 500);
            }
        });
    }

    // Add focus effects to search inputs
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

function showSearchFeedback() {
    const searchBar = document.querySelector('.search-bar');
    const originalBg = searchBar.style.background;
    
    searchBar.style.background = 'rgba(214, 40, 40, 0.05)';
    searchBar.style.transition = 'background 0.3s ease';
    
    setTimeout(() => {
        searchBar.style.background = originalBg;
    }, 1500);
}

/* ========================================
   FILTER TABS FUNCTIONALITY
   ======================================== */

function initializeFilterTabs() {
    // Hero filter tabs (All / For Sale / For Rent)
    const heroFilterTabs = document.querySelectorAll('.filter-tab');
    heroFilterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            heroFilterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Properties section filter tabs
    const propFilterTabs = document.querySelectorAll('.prop-filter-tab');
    const propCards = document.querySelectorAll('.property-card');

    // Store original labels (strip brackets if present)
    propFilterTabs.forEach(tab => {
        const raw = tab.textContent.replace(/^\[\s*|\s*\]$/g, '').trim();
        tab.dataset.label = raw;
    });

    propFilterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab — add brackets to active, remove from others
            propFilterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
                t.textContent = t.dataset.label;
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            this.textContent = `[ ${this.dataset.label} ]`;

            const filter = this.getAttribute('data-prop-filter');

            // Show/hide cards
            propCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('prop-hidden');
                } else {
                    card.classList.add('prop-hidden');
                }
            });
        });
    });
}

/* ========================================
   HEADER STICKY BEHAVIOR
   ======================================== */

function initializeHeaderSticky() {
    // Header stays consistent — no scroll shadow
}

/* ========================================
   CAROUSEL
   ======================================== */

let currentSlide = 0;
let slides, dots, autoplayTimer, lastSlide = 0;

function initializeCarousel() {
    slides = Array.from(document.querySelectorAll('.testimonial-card'));
    dots   = Array.from(document.querySelectorAll('.dot'));
    const carousel = document.querySelector('.testimonial-carousel');

    if (!slides.length || !carousel) return;

    // Ensure first slide is visible
    goToSlide(0);

    // Find all prev/next buttons and add click handlers directly
    const allPrevBtns = document.querySelectorAll('.carousel-btn.prev');
    const allNextBtns = document.querySelectorAll('.carousel-btn.next');

    allPrevBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentSlide - 1);
        });
    });

    allNextBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentSlide + 1);
        });
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            goToSlide(index);
        });
    });

    // Auto-rotate every 7 seconds — pause on hover
    startAutoplay();
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay);
    carousel.addEventListener('touchend', startAutoplay);
}

function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 7000);
}

function stopAutoplay() {
    clearInterval(autoplayTimer);
}

function goToSlide(index) {
    if (!slides || !slides.length) return;

    // Store previous slide for direction detection
    lastSlide = currentSlide;

    // Wrap around
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Determine direction (forward or backward)
    const isMovingForward = currentSlide > lastSlide || (lastSlide === slides.length - 1 && currentSlide === 0);

    // Update all slides with proper slide animation
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        slide.style.pointerEvents = 'none';
        
        if (i === currentSlide) {
            slide.classList.add('active');
            slide.style.pointerEvents = 'auto';
            slide.style.transform = 'translateX(0)';
            slide.style.opacity = '1';
        } else if (i < currentSlide) {
            // Cards before current slide go off to the left
            slide.style.transform = 'translateX(-100%)';
            slide.style.opacity = '0';
        } else {
            // Cards after current slide come from the right
            slide.style.transform = 'translateX(100%)';
            slide.style.opacity = '0';
        }
    });

    // Update dots
    dots.forEach((dot, i) => {
        if (i === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update progress bar
    const bar = document.getElementById('testimonialProgress');
    if (bar) {
        const pct = ((currentSlide + 1) / slides.length) * 100;
        bar.style.width = pct + '%';
    }

    console.log('Carousel: Showing slide', currentSlide + 1, 'of', slides.length);
}

/* ========================================
   FORM INTERACTIONS
   ======================================== */

function initializeFormInteractions() {
    // Search form submission (fallback for direct form submission)
    const searchForms = document.querySelectorAll('.search-bar');
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Search form submitted');
        });
    });

    // Form input focus effects
    const formInputs = document.querySelectorAll('.search-input, .form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transition = 'all 0.2s ease';
        });
    });
}

/* ========================================
   SMOOTH SCROLL BEHAVIOR
   ======================================== */

function initializeSmoothScroll() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ========================================
   HOVER EFFECTS & ANIMATIONS
   ======================================== */

function initializeHoverEffects() {
    // Property cards - enhanced hover
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s ease';
        });
    });

    // Category cards - hover scale
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s ease';
            // Add slight rotation on hover
            this.style.transform = 'translateY(-8px) rotate(1deg)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s ease';
        });
    });

    // Benefit cards hover
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.benefit-icon');
            if (icon) {
                icon.style.transition = 'transform 0.3s ease';
                icon.style.transform = 'scale(1.15) rotate(-10deg)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

/* ========================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ======================================== */

function initializeObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all card elements — exclude testimonial-card (managed by carousel)
    const elementsToObserve = document.querySelectorAll(
        '.property-card, .category-card, .benefit-card, .step-card'
    );

    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    /* Smooth transition for all elements with transition property */
    * {
        --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(style);

/* ========================================
   ADDITIONAL INTERACTIVE FEATURES
   ======================================== */

// CTA Buttons - Post Property and Explore Listings
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('post-property-btn')) {
        console.log('Post Property button clicked');
        alert('Post Property feature coming soon!');
    }
    
    if (e.target.textContent === 'Explore Listings') {
        console.log('Explore Listings clicked');
        const propertiesSection = document.querySelector('.properties');
        if (propertiesSection) {
            propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

// Button ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (event.clientX - button.offsetLeft - radius) + 'px';
    circle.style.top = (event.clientY - button.offsetTop - radius) + 'px';
    circle.classList.add('ripple');

    // Remove existing ripple
    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Add ripple effect to all buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// Keyboard navigation for better accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' && document.activeElement.classList.contains('dot')) {
        goToSlide(currentSlide + 1);
    }
    if (e.key === 'ArrowLeft' && document.activeElement.classList.contains('dot')) {
        goToSlide(currentSlide - 1);
    }
});

/* ========================================
   MOBILE MENU
   ======================================== */

function setupMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const nav    = document.getElementById('mainNav');
    const header = document.getElementById('site-header');
    if (!toggle || !nav) return;

    // Toggle open/close
    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = nav.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when a nav link is clicked
    nav.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('nav--open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close when clicking outside the header
    document.addEventListener('click', function (e) {
        if (!header.contains(e.target)) {
            nav.classList.remove('nav--open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            nav.classList.remove('nav--open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });
}

console.log('Gujarat Property - All interactive features loaded successfully!');
