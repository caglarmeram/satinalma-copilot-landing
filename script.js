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
            quotaLabel: "mesaj/yıl", // DÜZELTİLDİ
            savings: "%16 İndirim",
            period: "/yıl", // DÜZELTİLDİ
            monthlyEquivalent: "3.33 USD/ay" // EKLENDI
        },
        pro: {
            price: 99.95,
            originalPrice: 142.20, // 11.85 * 12
            quota: "18,000",
            quotaLabel: "mesaj/yıl", // DÜZELTİLDİ
            savings: "%30 İndirim",
            period: "/yıl", // DÜZELTİLDİ
            monthlyEquivalent: "8.33 USD/ay" // EKLENDI
        },
        max: {
            price: 199.95,
            originalPrice: 479.40, // 39.95 * 12 (474 yanlıştı)
            quota: "60,000", 
            quotaLabel: "mesaj/yıl", // DÜZELTİLDİ
            savings: "%58 İndirim",
            period: "/yıl", // DÜZELTİLDİ
            monthlyEquivalent: "16.66 USD/ay" // EKLENDI
        }
    }
};

let currentBilling = 'monthly';

// Billing toggle functions
function switchBilling(type) {
    currentBilling = type;
    
    // Update toggle UI
    const monthlyToggle = document.getElementById('monthlyToggle');
    const yearlyToggle = document.getElementById('yearlyToggle');
    
    if (monthlyToggle && yearlyToggle) {
        monthlyToggle.classList.toggle('active', type === 'monthly');
        yearlyToggle.classList.toggle('active', type === 'yearly');
    }
    
    // Update pricing
    updatePricing();
}

function updatePricing() {
    const data = pricingData[currentBilling];
    
    Object.keys(data).forEach(plan => {
        const planData = data[plan];
        
        // Fiyat güncelle
        const priceEl = document.getElementById(`${plan}Price`);
        const periodEl = document.getElementById(`${plan}Period`);
        if (priceEl) priceEl.textContent = planData.price;
        if (periodEl) periodEl.textContent = planData.period;
        
        // Kota güncelle
        const quotaEl = document.getElementById(`${plan}Quota`);
        const quotaLabelEl = document.getElementById(`${plan}QuotaLabel`);
        if (quotaEl) quotaEl.textContent = planData.quota;
        if (quotaLabelEl) quotaLabelEl.textContent = planData.quotaLabel;
        
        // Fiyat info güncelle
        const priceInfoEl = document.getElementById(`${plan}PriceInfo`);
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

    // Store selected plan in hidden inputs
    const selectedPlanInput = document.getElementById('selectedPlan');
    const selectedBillingInput = document.getElementById('selectedBilling');
    
    if (selectedPlanInput) selectedPlanInput.value = planType;
    if (selectedBillingInput) selectedBillingInput.value = currentBilling;
    
    // Update form header to show selected plan
    const formHeader = document.querySelector('.form-header h2');
    if (formHeader && pricingData[currentBilling][planType]) {
        const planInfo = pricingData[currentBilling][planType];
        formHeader.textContent = `${planType.toUpperCase()} Plan ($${planInfo.price}/${currentBilling === 'monthly' ? 'ay' : 'yıl'}) - Ücretsiz Deneme`;
    }
    
    // Scroll to registration form
    scrollToForm();
}

// Smooth scroll to registration form
function scrollToForm() {
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
            scrollToForm();
        }
    } catch (error) {
        console.error('User check error:', error);
        alert('Kullanıcı kontrolü yapılırken hata oluştu.\nLütfen tekrar deneyin.');
    }
}

// Form submission handler
function initializeFormHandler() {
    const registrationForm = document.getElementById('registrationForm');
    if (!registrationForm) return;

    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const loadingText = submitButton.querySelector('.loading-text');
        
        // Show loading state
        submitButton.disabled = true;
        if (buttonText) buttonText.style.display = 'none';
        if (loadingText) loadingText.style.display = 'inline';
        
        // Get selected plan info
        const selectedPlanInput = document.getElementById('selectedPlan');
        const selectedBillingInput = document.getElementById('selectedBilling');
        
        const selectedPlan = selectedPlanInput ? selectedPlanInput.value : 'trial';
        const selectedBilling = selectedBillingInput ? selectedBillingInput.value : 'monthly';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            contact_phone: document.getElementById('phone').value.trim(),
            company_name: document.getElementById('company').value.trim(),
            position: document.getElementById('position').value.trim() || null,
            registration_source: 'web',
            subscription_status: 'trial',
            subscription_plan: selectedPlan,
            billing_cycle: selectedBilling,
            trial_start_date: new Date().toISOString(),
            trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            monthly_quota: 1000, // Trial için 1000 mesaj
            used_quota: 0,
            trial_used: false
        };
        
        // Validate required fields
        if (!formData.name || !formData.email || !formData.contact_phone || !formData.company_name) {
            alert('Lütfen tüm zorunlu alanları doldurun.');
            resetButton();
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Lütfen geçerli bir e-posta adresi girin.');
            resetButton();
            return;
        }
        
        // Validate phone format
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(formData.contact_phone)) {
            alert('Lütfen geçerli bir telefon numarası girin. Örn: +90 555 123 45 67');
            resetButton();
            return;
        }
        
        try {
            // First check if user already exists
            const cleanPhone = formData.contact_phone.replace(/[^\d+]/g, '');
            const checkResponse = await fetch(`https://dblepmaqqkudsbmvlqcw.supabase.co/rest/v1/customers?contact_phone=eq.${cleanPhone}`, {
                headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg'
                }
            });
            
            const existingUsers = await checkResponse.json();
            
            if (existingUsers.length > 0) {
                const existingUser = existingUsers[0];
                if (existingUser.trial_used) {
                    if (confirm('Bu numara ile daha önce ücretsiz deneme kullanılmış.\nÖdeme yaparak devam etmek ister misiniz?')) {
                        window.location.href = `payment.html?phone=${encodeURIComponent(cleanPhone)}`;
                    }
                    resetButton();
                    return;
                } else {
                    alert('Bu numara ile zaten kayıt bulunuyor.\nMevcut hesabınızı kullanabilirsiniz.');
                    resetButton();
                    return;
                }
            }
            
            // Create new user
            const response = await fetch('https://dblepmaqqkudsbmvlqcw.supabase.co/rest/v1/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Supabase error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Customer created successfully:', result);
            
            // Store selected plan for success page
            localStorage.setItem('selectedPlan', selectedPlan);
            localStorage.setItem('selectedBilling', selectedBilling);
            
            // Send welcome email (optional)
            await sendWelcomeEmail(formData);
            
            // Redirect to success page
            window.location.href = 'success.html?phone=' + encodeURIComponent(formData.contact_phone) + '&plan=' + selectedPlan;
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // Backup to localStorage
            localStorage.setItem('pendingRegistration', JSON.stringify(formData));
            
            alert('Kayıt işlemi tamamlanamadı. Lütfen birkaç dakika sonra tekrar deneyin veya doğrudan WhatsApp\'tan bize ulaşın: +90 552 071 0977');
            resetButton();
        }
        
        function resetButton() {
            submitButton.disabled = false;
            if (buttonText) buttonText.style.display = 'inline';
            if (loadingText) loadingText.style.display = 'none';
        }
    });
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
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
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
}

// Form validation on input
function initializeFormValidation() {
    const requiredInputs = document.querySelectorAll('#registrationForm input[required]');
    
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = 'rgba(255,255,255,0.2)';
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
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('focusin', function(e) {
            trackEvent('form_field_focus', { field: e.target.name });
        });
    }

    // Track CTA button clicks
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            trackEvent('cta_button_click', { source: 'hero' });
        });
    }
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

// Initialize pricing and page setup
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    updatePricing();
    initializeFormHandler();
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

// Export functions for global access (if needed)
window.switchBilling = switchBilling;
window.selectPlan = selectPlan;
window.scrollToForm = scrollToForm;
window.showLogin = showLogin;
