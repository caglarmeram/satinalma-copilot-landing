// Pricing data - Doğru fiyatlandırma yapısı
const pricingData = {
    monthly: {
        basic: {
            price: 3.95,
            originalPrice: null,
            quota: "500",
            quotaLabel: "mesaj/ay",
            savings: null,
            period: "/ay",
            monthlyEquivalent: null
        },
        pro: {
            price: 8.95,
            originalPrice: 11.85,
            quota: "1,500",
            quotaLabel: "mesaj/ay", 
            savings: "%24 İndirim",
            period: "/ay",
            monthlyEquivalent: null
        },
        max: {
            price: 19.95,
            originalPrice: 39.95,
            quota: "5,000",
            quotaLabel: "mesaj/ay",
            savings: "%50 İndirim", 
            period: "/ay",
            monthlyEquivalent: null
        }
    },
    yearly: {
        basic: {
            price: 39.95,
            originalPrice: 47.40, // 3.95 * 12
            quota: "6,000",
            quotaLabel: "mesaj/yıl",
            savings: "%16 İndirim",
            period: "/yıl",
            monthlyEquivalent: "3.33 USD/ay"
        },
        pro: {
            price: 99.95,
            originalPrice: 142.20, // 11.85 * 12
            quota: "18,000",
            quotaLabel: "mesaj/yıl",
            savings: "%30 İndirim",
            period: "/yıl",
            monthlyEquivalent: "8.33 USD/ay"
        },
        max: {
            price: 199.95,
            originalPrice: 479.40, // 39.95 * 12
            quota: "60,000", 
            quotaLabel: "mesaj/yıl",
            savings: "%58 İndirim",
            period: "/yıl",
            monthlyEquivalent: "16.66 USD/ay"
        }
    }
};

let currentBilling = 'monthly';

// Billing toggle functions - Güncellenmiş element ID'leri
function switchBilling(type) {
    currentBilling = type;
    
    // Update toggle UI - HTML'deki data-billing sistemine uygun
    const toggleOptions = document.querySelectorAll('.toggle-option');
    toggleOptions.forEach(option => {
        const billingType = option.getAttribute('data-billing');
        option.classList.toggle('active', billingType === type);
    });
    
    // Update pricing
    updatePricing();
}

function updatePricing() {
    const data = pricingData[currentBilling];
    
    Object.keys(data).forEach(plan => {
        const planData = data[plan];
        
        // Fiyat güncelle - HTML'deki class yapısına uygun
        const priceEl = document.querySelector(`[data-plan="${plan}"] .price-amount`);
        const periodEl = document.querySelector(`[data-plan="${plan}"] .price-period`);
        
        if (priceEl) priceEl.textContent = planData.price;
        if (periodEl) periodEl.textContent = planData.period;
        
        // Kota güncelle
        const quotaEl = document.querySelector(`[data-plan="${plan}"] .quota-number`);
        const quotaLabelEl = document.querySelector(`[data-plan="${plan}"] .quota-label`);
        
        if (quotaEl) quotaEl.textContent = planData.quota;
        if (quotaLabelEl) quotaLabelEl.textContent = planData.quotaLabel;
        
        // Price info güncelle
        const priceInfoEl = document.querySelector(`[data-plan="${plan}"] .price-info`);
        if (priceInfoEl) {
            priceInfoEl.innerHTML = '';
            
            if (planData.originalPrice) {
                const originalPriceEl = document.createElement('span');
                originalPriceEl.className = 'original-price';
                originalPriceEl.textContent = `$${planData.originalPrice}`;
                priceInfoEl.appendChild(originalPriceEl);
            }
            
            if (planData.savings) {
                const savingsEl = document.createElement('span');
                savingsEl.className = 'discount-badge';
                savingsEl.textContent = planData.savings;
                priceInfoEl.appendChild(savingsEl);
            }
            
            // Aylık eşdeğer ekle (sadece yıllık için)
            if (planData.monthlyEquivalent) {
                const monthlyEqEl = document.createElement('div');
                monthlyEqEl.className = 'monthly-equivalent';
                monthlyEqEl.textContent = planData.monthlyEquivalent;
                priceInfoEl.appendChild(monthlyEqEl);
            }
        }
    });
}

function selectPlan(planType) {
    if (planType === 'enterprise') {
        window.location.href = 'mailto:info@satinalmacopilot.com?subject=Enterprise Plan Talebi';
        return;
    }

    // Store selected plan in sessionStorage (HTML'de form yoksa)
    sessionStorage.setItem('selectedPlan', planType);
    sessionStorage.setItem('selectedBilling', currentBilling);
    
    // Update form header if exists
    const formHeader = document.querySelector('.form-header h2');
    if (formHeader && pricingData[currentBilling][planType]) {
        const planInfo = pricingData[currentBilling][planType];
        formHeader.textContent = `${planType.toUpperCase()} Plan ($${planInfo.price}/${currentBilling === 'monthly' ? 'ay' : 'yıl'}) - Ücretsiz Deneme`;
    }
    
    // Scroll to registration form
    scrollToRegistration();
}

// Smooth scroll to registration form - İsim düzeltildi
function scrollToRegistration() {
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
        registrationSection.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Show login modal for existing users
function showLogin() {
    const phone = prompt('WhatsApp numaranızı girin (mevcut kullanıcılar için):');
    if (phone && phone.trim()) {
        checkExistingUser(phone.trim());
    }
}

// Check existing user and redirect accordingly
async function checkExistingUser(phone) {
    try {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        
        const response = await fetch(`https://dblepmaqqkudsbmvlqcw.supabase.co/rest/v1/customers?contact_phone=eq.${cleanPhone}&select=*`, {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg'
            }
        });
        
        const users = await response.json();
        
        if (users.length > 0) {
            const user = users[0];
            const now = new Date();
            const trialEnd = new Date(user.trial_end_date);
            
            if (user.subscription_status === 'trial' && trialEnd > now) {
                const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
                alert(`Merhaba ${user.name}!\n\nTrial süreniz devam ediyor (${daysLeft} gün kaldı).\nWhatsApp'tan mesaj göndermeye devam edebilirsiniz.`);
            } else if (user.subscription_status === 'active') {
                alert(`Merhaba ${user.name}!\n\nAktif aboneliğiniz var.\nWhatsApp'tan mesaj göndermeye devam edebilirsiniz.`);
            } else {
                if (confirm(`Merhaba ${user.name}!\n\nTrial süreniz dolmuş veya aboneliğiniz pasif.\nÖdeme sayfasına gitmek ister misiniz?`)) {
                    window.location.href = `payment.html?phone=${encodeURIComponent(cleanPhone)}`;
                }
            }
        } else {
            alert('Bu numara ile kayıtlı kullanıcı bulunamadı.\nLütfen aşağıdan kayıt olun.');
            scrollToRegistration();
        }
    } catch (error) {
        console.error('User check error:', error);
        alert('Kullanıcı kontrolü yapılırken hata oluştu.\nLütfen tekrar deneyin.');
    }
}

// Form submission handler - Güncellenmiş ID'lerle
function handleRegistration(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn') || event.target.querySelector('.submit-button');
    const defaultText = submitBtn.querySelector('.default-text');
    const loadingText = submitBtn.querySelector('.loading-text');
    
    // Show loading state
    submitBtn.disabled = true;
    if (defaultText) defaultText.style.display = 'none';
    if (loadingText) loadingText.style.display = 'inline';
    
    // Get form data
    const formData = new FormData(event.target);
    const registrationData = {
        fullName: formData.get('fullName') || formData.get('name'),
        email: formData.get('email'),
        whatsapp: formData.get('whatsapp') || formData.get('phone'),
        company: formData.get('company') || formData.get('company_name'),
        selectedPlan: sessionStorage.getItem('selectedPlan') || 'pro',
        selectedBilling: sessionStorage.getItem('selectedBilling') || 'monthly'
    };
    
    console.log('Registration Data:', registrationData);
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        event.target.reset();
        
        // Show success message
        alert('🎉 Kaydınız başarıyla tamamlandı!\n\n📱 WhatsApp numaranıza kurulum talimatları gönderilecek.\n⏰ 5 dakika içinde asistanınız hazır olacak.');
        
        // Reset button state
        submitBtn.disabled = false;
        if (defaultText) defaultText.style.display = 'inline';
        if (loadingText) loadingText.style.display = 'none';
        
        // Clear selected plan
        sessionStorage.removeItem('selectedPlan');
        sessionStorage.removeItem('selectedBilling');
    }, 2000);
}

// Send welcome email function
async function sendWelcomeEmail(userData) {
    try {
        const emailData = {
            to_email: userData.email,
            to_name: userData.name,
            company_name: userData.company_name,
            phone_number: userData.contact_phone,
            whatsapp_number: '+14155238886',
            trial_end_date: new Date(userData.trial_end_date).toLocaleDateString('tr-TR')
        };
        
        console.log('Welcome email data prepared:', emailData);
        
    } catch (error) {
        console.error('Email sending error:', error);
    }
}

// Phone number formatting
function initializePhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="whatsapp"], input[name="phone"]');
    
    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d+]/g, '');
            
            // Auto-add +90 for Turkish numbers
            if (value.length > 0 && !value.startsWith('+')) {
                if (value.startsWith('90')) {
                    value = '+' + value;
                } else if (value.startsWith('5') && value.length >= 10) {
                    value = '+90' + value;
                }
            }
            
            e.target.value = value;
        });
    });
}

// Form validation on input
function initializeFormValidation() {
    const requiredInputs = document.querySelectorAll('form input[required]');
    
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e5e7eb';
            }
        });
    });
}

// Navbar scroll effect
function initializeNavbarEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#fff';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Analytics and tracking
function trackEvent(eventName, properties) {
    console.log('Event tracked:', eventName, properties);
    // Add Google Analytics or other tracking here later
}

// Track form interactions
function initializeTracking() {
    const registrationForms = document.querySelectorAll('form');
    registrationForms.forEach(form => {
        form.addEventListener('focusin', function(e) {
            trackEvent('form_field_focus', { field: e.target.name });
        });
    });

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_button_click', { source: 'hero' });
        });
    });
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and pricing cards
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card');
    animatedElements.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize billing toggle event listeners
function initializeBillingToggle() {
    const toggleOptions = document.querySelectorAll('.toggle-option');
    
    toggleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const billingType = this.getAttribute('data-billing');
            if (billingType) {
                switchBilling(billingType);
            }
        });
    });
}

// Initialize pricing and page setup
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    updatePricing();
    initializeBillingToggle();
    initializePhoneFormatting();
    initializeFormValidation();
    initializeNavbarEffect();
    initializeTracking();
    initializeAnimations();
    
    // Check for URL parameters (plan selection from external links)
    const urlParams = new URLSearchParams(window.location.search);
    const planFromUrl = urlParams.get('plan');
    const billingFromUrl = urlParams.get('billing');
    
    if (planFromUrl && pricingData[billingFromUrl || 'monthly'] && pricingData[billingFromUrl || 'monthly'][planFromUrl]) {
        selectPlan(planFromUrl);
        if (billingFromUrl) {
            switchBilling(billingFromUrl);
        }
    }
    
    // Check for pending registration
    const pendingRegistration = localStorage.getItem('pendingRegistration');
    if (pendingRegistration) {
        console.log('Found pending registration:', JSON.parse(pendingRegistration));
    }
});

// Simple error handling for missing resources
window.addEventListener('error', function(e) {
    console.error('Resource loading error:', e);
});

// Export functions for global access
window.switchBilling = switchBilling;
window.selectPlan = selectPlan;
window.scrollToRegistration = scrollToRegistration;
window.showLogin = showLogin;
window.handleRegistration = handleRegistration;
