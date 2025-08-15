// DOM Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .value-item, .portfolio-item').forEach(el => {
    observer.observe(el);
});

// Animated counters for stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent;
            }
        };
        
        updateCounter();
    });
};

// Trigger counter animation when about section is visible
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// Contact form handling
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Get form values
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Create email content
        const emailSubject = `Contact Form Submission from ${name}`;
        const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        
        // Create mailto URL
        const mailtoUrl = `mailto:contact@parrot-apps.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Create WhatsApp message
        const whatsappMessage = `Hi! I'm ${name}.\n\nEmail: ${email}\n\nMessage: ${message}`;
        const whatsappUrl = `https://wa.me/573002685861?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open email client
       //window.open(mailtoUrl, '_blank');
        
        // Small delay before opening WhatsApp
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 500);
        
        // Show success message
        showNotification('Opening email client and WhatsApp. We\'ll get back to you soon!', 'success');
        contactForm.reset();
    } catch (error) {
        // Show error message
        showNotification('Something went wrong. Please try again later.', 'error');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 0.5rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const timeout = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual close
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Floating cards animation enhancement
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-30px) scale(1.05)';
        card.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = '';
    });
});

// Enhanced hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.service-icon');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        icon.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.service-icon');
        icon.style.transform = '';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    [heroTitle, heroSubtitle, heroButtons].forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 300);
        }
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Active section highlighting in navigation
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});


// Daily Color Rotation System
function setDailyColor() {
    const colors = [
        { name: 'outrageous-orange', hex: '#ff5833', rgb: '255, 88, 51' },
        { name: 'west-side', hex: '#ff8c1a', rgb: '255, 140, 26' },
        { name: 'parrot-blue', hex: '#1da7e0', rgb: '29, 167, 224' },
        { name: 'teal', hex: '#009485', rgb: '0, 148, 133' }
    ];
    
    // Calculate which color to use based on current date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const colorIndex = dayOfYear % colors.length;
    const selectedColor = colors[colorIndex];

    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--daily-color', selectedColor.hex);
    root.style.setProperty('--daily-color-light', `rgba(${selectedColor.rgb}, 0.1)`);
    root.style.setProperty('--daily-color-lighter', `rgba(${selectedColor.rgb}, 0.05)`);
    root.style.setProperty('--daily-color-dark', `rgba(${selectedColor.rgb}, 0.8)`);
    
    // Update gradients
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${selectedColor.hex}, rgba(${selectedColor.rgb}, 0.8))`);
    root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, rgba(${selectedColor.rgb}, 0.1), ${selectedColor.hex})`);
    root.style.setProperty('--gradient-light', `linear-gradient(135deg, rgba(${selectedColor.rgb}, 0.05), rgba(${selectedColor.rgb}, 0.1))`);
    
    // Update logos based on daily color
    updateDailyLogos(selectedColor.name);
    
    console.log(`🎨 Today's color: ${selectedColor.name} (${selectedColor.hex})`);
}

// Function to update logos based on daily color
function updateDailyLogos(colorName) {
    const logoPath = `./logo-${colorName}.svg`;
    
    // Update navigation logo
    const navLogo = document.querySelector('.nav-brand img');
    if (navLogo) {
        navLogo.src = logoPath;
        navLogo.alt = `Parrot Logo - ${colorName}`;
    }
    
    // Update footer logo
    const footerLogo = document.querySelector('.footer-brand img');
    if (footerLogo) {
        footerLogo.src = logoPath;
        footerLogo.alt = `Parrot Logo - ${colorName}`;
    }
    
    // Update favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        document.head.appendChild(favicon);
    }
    favicon.href = logoPath;
    
    console.log(`🦜 Updated logos to: ${logoPath}`);
}

// Initialize daily color on page load
setDailyColor();

// Update the active nav link color to use daily color
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--daily-color) !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
    .loaded * {
        animation-play-state: running;
    }
`;
document.head.appendChild(style);

console.log('🦜 Parrot Apps LLC website loaded successfully!');