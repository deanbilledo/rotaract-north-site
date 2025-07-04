// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(30, 30, 30, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(30, 30, 30, 0.6)';
        navbar.style.backdropFilter = 'blur(16px)';
    }
});

// Animate stats on scroll
const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    };

    statNumbers.forEach(stat => {
        if (isInViewport(stat) && !stat.classList.contains('animated')) {
            stat.classList.add('animated');
            const finalValue = parseInt(stat.textContent.replace(/\D/g, ''));
            let currentValue = 0;
            const increment = finalValue / 50;
            const suffix = stat.textContent.replace(/\d/g, '');
            
            const updateCounter = () => {
                currentValue += increment;
                if (currentValue < finalValue) {
                    stat.textContent = Math.ceil(currentValue) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = finalValue + suffix;
                }
            };
            
            updateCounter();
        }
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .officer-card, .value-item').forEach(el => {
    observer.observe(el);
});

// Stats animation on scroll
window.addEventListener('scroll', animateStats);

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const submitButton = this.querySelector('.submit-button');
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        
        // Reset button after form submission (whether success or error)
        setTimeout(() => {
            submitButton.innerHTML = 'Send Message';
            submitButton.disabled = false;
        }, 3000);
    });
}

// Recruitment notification button
const notifyButton = document.querySelector('.notify-button');
if (notifyButton) {
    notifyButton.addEventListener('click', function() {
        // Simple notification system
        this.innerHTML = 'Notification Sent!';
        this.style.background = '#4CAF50';
        
        setTimeout(() => {
            this.innerHTML = 'Get Notified';
            this.style.background = '';
        }, 2000);
    });
}

// Add scroll animations for cards
const addScrollAnimations = () => {
    const cards = document.querySelectorAll('.project-card, .officer-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
};

// CTA button functionality
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        // Scroll to about section or contact
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    addScrollAnimations();
    
    // Add entrance animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        // Subtle parallax effect - move only 10% of scroll distance
        heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Add floating animation to project cards
const addFloatingAnimation = () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
};

// Initialize floating animations
document.addEventListener('DOMContentLoaded', addFloatingAnimation);

// Active navigation link highlighting
const highlightActiveNav = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightActiveNav);