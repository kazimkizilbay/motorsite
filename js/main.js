/**
 * MOTOGRIP Site2 - Modern JavaScript
 * Premium interactions and animations
 */

// ========================================
// Utility Functions
// ========================================

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ========================================
// Scroll Progress Bar
// ========================================

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
    };

    window.addEventListener('scroll', throttle(updateProgress, 50));
    updateProgress();
}

// ========================================
// Header Scroll Effect
// ========================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', throttle(handleScroll, 100));
    handleScroll();
}

// ========================================
// Scroll Reveal Animations
// ========================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

// ========================================
// Product Carousel
// ========================================

class ProductCarousel {
    constructor(container) {
        this.container = container;
        this.images = container.querySelectorAll('.product-image');
        this.dots = container.querySelectorAll('.carousel-dot');
        this.currentIndex = 0;
        this.intervalId = null;
        this.autoplayDelay = 3000;

        this.init();
    }

    init() {
        if (this.images.length <= 1) return;

        // Add click events to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
        });

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        this.startAutoplay();
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.resetAutoplay();
        }
    }

    goToSlide(index) {
        // Remove active class from all
        this.images.forEach(img => img.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current
        this.images[index].classList.add('active');
        this.dots[index].classList.add('active');
        this.currentIndex = index;
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToSlide(prevIndex);
    }

    startAutoplay() {
        this.intervalId = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

function initCarousels() {
    const carousels = document.querySelectorAll('.product-image-container');
    carousels.forEach(carousel => new ProductCarousel(carousel));
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// WhatsApp Order Handler
// ========================================

function initWhatsAppOrders() {
    const whatsappButtons = document.querySelectorAll('[data-whatsapp-product]');

    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.getAttribute('data-whatsapp-product');
            const productPrice = button.getAttribute('data-whatsapp-price');

            const message = `Merhaba! ${productName} ürününü satın almak istiyorum. (${productPrice})`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/905539250651?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
        });
    });
}

// ========================================
// Gallery Lightbox (Simple)
// ========================================

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                // Create simple lightbox overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    cursor: pointer;
                    animation: fadeIn 0.3s ease;
                `;

                const lightboxImg = document.createElement('img');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    border-radius: 1rem;
                    box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
                `;

                overlay.appendChild(lightboxImg);
                document.body.appendChild(overlay);

                // Close on click
                overlay.addEventListener('click', () => {
                    overlay.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => overlay.remove(), 300);
                });

                // Close on ESC key
                const closeOnEsc = (e) => {
                    if (e.key === 'Escape') {
                        overlay.click();
                        document.removeEventListener('keydown', closeOnEsc);
                    }
                };
                document.addEventListener('keydown', closeOnEsc);
            }
        });
    });
}

// ========================================
// Loading Animation
// ========================================

function initLoadingAnimation() {
    // Simple fade in when page loads
    document.body.style.opacity = '0';

    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
}

// ========================================
// Parallax Effect (Simple)
// ========================================

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    const handleParallax = () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    };

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', throttle(handleParallax, 50));
    }
}

// ========================================
// Initialize All
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏍️ MOTOGRIP Site2 - Initializing...');

    initLoadingAnimation();
    initScrollProgress();
    initHeaderScroll();
    initScrollReveal();
    initCarousels();
    initSmoothScroll();
    initWhatsAppOrders();
    initGalleryLightbox();
    initParallax();

    console.log('✅ MOTOGRIP Site2 - Ready!');
});

// ========================================
// Add CSS for lightbox animations
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
