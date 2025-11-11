// ===========================
// Sen Ndou Ndougou - JavaScript
// ===========================

// Cart functionality
let cartCount = 0;
let cartItems = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    initSmoothScroll();
    
    // Navbar scroll effect
    initNavbarScroll();
    
    // Form submission
    initContactForm();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Load cart from localStorage
    loadCart();
});

// ===========================
// Smooth Scroll Navigation
// ===========================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#cartIcon') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(href);
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
}

// ===========================
// Update Active Navigation Link
// ===========================
function updateActiveNavLink(href) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav-link[href="${href}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ===========================
// Navbar Scroll Effect
// ===========================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '1rem 0';
        }
    });
    
    // Update active section on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        if (current) {
            updateActiveNavLink('#' + current);
        }
    });
}

// ===========================
// Cart Functionality
// ===========================
function addToCart(productName) {
    cartCount++;
    cartItems.push(productName);
    updateCartDisplay();
    saveCart();
    showCartNotification(productName);
}

function updateCartDisplay() {
    const cartCountElement = document.getElementById('cartCount');
    cartCountElement.textContent = cartCount;
    
    // Animate cart icon
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 300);
}

function showCartNotification(productName) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-5';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>${productName}</strong> ajouté au panier !
    `;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function saveCart() {
    localStorage.setItem('cartCount', cartCount);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCart() {
    const savedCount = localStorage.getItem('cartCount');
    const savedItems = localStorage.getItem('cartItems');
    
    if (savedCount) {
        cartCount = parseInt(savedCount);
        updateCartDisplay();
    }
    
    if (savedItems) {
        cartItems = JSON.parse(savedItems);
    }
}

// ===========================
// Contact Form
// ===========================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        contactForm.reset();
    });
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-5';
    successMessage.style.zIndex = '9999';
    successMessage.style.minWidth = '350px';
    successMessage.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>Message envoyé !</strong> Nous vous répondrons bientôt.
    `;
    
    document.body.appendChild(successMessage);
    
    // Fade in
    setTimeout(() => {
        successMessage.style.opacity = '1';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 4000);
}

// ===========================
// Scroll Animations
// ===========================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ===========================
// Cart Icon Click - WhatsApp Validation
// ===========================
document.getElementById('cartIcon').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (cartCount === 0) {
        alert('Votre panier est vide ! 🛒');
    } else {
        validateOrderOnWhatsApp();
    }
});

// ===========================
// Validate Order on WhatsApp
// ===========================
function validateOrderOnWhatsApp() {
    const phoneNumber = '221778902001'; // Format international pour le Sénégal
    
    // Créer le message de commande
    let message = `🌿 *Nouvelle Commande - Sen Ndou Ndougou*\n\n`;
    message += `📦 *Articles (${cartCount})* :\n`;
    
    // Compter les occurrences de chaque produit
    const itemCounts = {};
    cartItems.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
    });
    
    // Ajouter chaque produit avec sa quantité
    Object.keys(itemCounts).forEach(item => {
        message += `• ${item} x${itemCounts[item]}\n`;
    });
    
    message += `\n✅ Je souhaite valider cette commande.`;
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Créer l'URL WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappURL, '_blank');
}

// ===========================
// Preloader (Optional)
// ===========================
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
