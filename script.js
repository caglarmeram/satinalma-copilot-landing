// ===============================================
// SATINALMA COPILOT - MAIN SCRIPT.JS
// ===============================================

// Global variables
window.selectedPlan = null;
window.selectedBilling = 'annual'; // Default to annual for 50% discount

// ===============================================
// 1. BILLING TOGGLE FUNCTIONALITY
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    const toggleContainer = document.querySelector('.toggle-container');
    const toggleOptions = document.querySelectorAll('.toggle-option');
    
    if (toggleOptions.length > 0) {
        toggleOptions.forEach(option => {
            option.addEventListener('click', function() {
                toggleOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const billingType = this.getAttribute('data-billing');
                updatePricing(billingType);
            });
        });
    }

    // Initialize pricing cards with interactions
    initializePricingCards();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Set default Pro plan highlight
    setTimeout(() => {
        const proCard = document.querySelectorAll('.pricing-card')[1]; // Pro is middle card
        if (proCard && !window.selectedPlan) {
            proCard.style.borderColor = '#2563eb';
            proCard.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
        }
    }, 1000);
});

function updatePricing(billingType) {
    window.selectedBilling = billingType;
    const annualPrices = document.querySelectorAll('.annual-prices');
    const monthlyPrices = document.querySelectorAll('.monthly-prices');
    
    if (billingType === 'monthly') {
        annualPrices.forEach(price => price.style.display = 'none');
        monthlyPrices.forEach(price => price.style.display = 'block');
    } else {
        annualPrices.forEach(price => price.style.display = 'block');
        monthlyPrices.forEach(price => price.style.display = 'none');
    }
}

// ===============================================
// 2. PLAN SELECTION FUNCTIONALITY
// ===============================================
function selectPlan(planType) {
    window.selectedPlan = planType;
    
    // Track plan selection
    trackEvent('plan_selected', {
        plan: planType,
        billing: window.selectedBilling || 'annual'
    });
    
    // Visual feedback
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.classList.remove('selected');
        card.style.borderColor = '#e2e8f0';
        card.style.transform = '';
        card.style.boxShadow = '';
    });
    
    // Find and highlight selected plan card
    const planCards = document.querySelectorAll('.pricing-card');
    const planOrder = ['basic', 'pro', 'max'];
    const selectedIndex = planOrder.indexOf(planType);
    
    if (selectedIndex !== -1 && planCards[selectedIndex]) {
        const selectedCard = planCards[selectedIndex];
        selectedCard.classList.add('selected');
        selectedCard.style.borderColor = '#2563eb';
        selectedCard.style.transform = 'translateY(-8px) scale(1.02)';
        selectedCard.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
    }
    
    // Scroll to registration form
    scrollToRegistration();
    
    // Highlight the form
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) {
        formWrapper.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
        formWrapper.style.borderColor = '#2563eb';
        
        // Update form header to show selected plan
        updateFormHeader(planType);
        
        setTimeout(() => {
            formWrapper.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            formWrapper.style.borderColor = '#e2e8f0';
        }, 3000);
    }
}

function updateFormHeader(planType) {
    const formHeader = document.querySelector('.form-header h2');
    const planNames = { basic: 'Basic', pro: 'Pro', max: 'Max' };
    const billingText = window.selectedBilling === 'monthly' ? 'Aylık' : 'Yıllık';
    
    if (formHeader) {
        formHeader.textContent = `${planNames[planType]} Plan (${billingText}) - 14 Gün Ücretsiz Deneme`;
    }
    
    // Add or update plan info
    updatePlanInfo(planType);
}

function updatePlanInfo(planType) {
    const planNames = { basic: 'Basic', pro: 'Pro', max: 'Max' };
    const planData = {
        basic: { monthly: '$7.95/ay', yearly: '$3.95/ay (yıllık $47.4)' },
        pro: { monthly: '$17.95/ay', yearly: '$8.95/ay (yıllık $107.4)' },
        max: { monthly: '$39.95/ay', yearly: '$19.95/ay (yıllık $239.4)' }
    };
    
    let planInfo = document.querySelector('.plan-selection-info');
    if (!planInfo) {
        planInfo = document.createElement('div');
        planInfo.className = 'plan-selection-info';
        planInfo.style.cssText = `
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: center;
            border-left: 4px solid #2563eb;
        `;
        const formHeader = document.querySelector('.form-header');
        if (formHeader) {
            formHeader.appendChild(planInfo);
        }
    }
    
    const billing = window.selectedBilling || 'annual';
    planInfo.innerHTML = `
        <strong>Seçilen Plan: ${planNames[planType]}</strong><br>
        <span style="color: #2563eb; font-weight: 600;">${planData[planType][billing]}</span><br>
        <small style="color: #64748b;">14 gün ücretsiz deneme sonrası otomatik başlar</small>
    `;
}

function initializePricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach((card, index) => {
        const planTypes = ['basic', 'pro', 'max'];
        const planType = planTypes[index];
        
        // Add click handler to entire card
        card.addEventListener('click', function() {
            selectPlan(planType);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-4px)';
                this.style.borderColor = '#3b82f6';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.borderColor = '#e2e8f0';
            }
        });
        
        // Make CTA buttons more prominent
        const ctaButton = card.querySelector('.cta-button-pricing');
        if (ctaButton) {
            ctaButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                selectPlan(planType);
            });
        }
    });
}

// ===============================================
// 3. NAVIGATION & SCROLLING
// ===============================================
function scrollToRegistration() {
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
        registrationSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===============================================
// 4. FORM VALIDATION
// ===============================================
function initializeFormValidation() {
    const form = document.querySelector('.registration-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        // Load saved data from localStorage
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue) {
            input.value = savedValue;
        }
        
        // Save data on input
        input.addEventListener('input', function() {
            localStorage.setItem(`form_${this.name}`, this.value);
            
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`form_${input.name}`);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation rules
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Geçerli bir e-posta adresi girin';
            }
            break;
            
        case 'tel':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Geçerli bir telefon numarası girin (örn: +90 555 123 45 67)';
            }
            break;
            
        case 'text':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'En az 2 karakter giriniz';
            }
            break;
    }
    
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    } else {
        field.style.borderColor = '#10b981';
    }
    
    return isValid;
}

// ===============================================
// 5. REGISTRATION FORM HANDLER
// ===============================================
async function handleRegistration(event) {
    event.preventDefault();
    
    // Validate all fields first
    const form = event.target;
    const inputs = form.querySelectorAll('input[required]');
    let allValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            allValid = false;
        }
    });
    
    if (!allValid) {
        alert('Lütfen tüm alanları doğru şekilde doldurun.');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const defaultText = submitBtn.querySelector('.default-text');
    const loadingText = submitBtn.querySelector('.loading-text');
    
    // Show loading state
    submitBtn.disabled = true;
    defaultText.style.display = 'none';
    loadingText.style.display = 'inline';
    
    try {
        // Get form data
        const formData = new FormData(event.target);
        const registrationData = {
            name: formData.get('fullName'),
            email: formData.get('email'),
            contact_phone: formData.get('whatsapp'),
            company_name: formData.get('company'),
            selected_plan: window.selectedPlan || 'pro',
            selected_billing: window.selectedBilling || 'annual'
        };

        // Clean and validate phone number
        let cleanPhone = registrationData.contact_phone.replace(/[^\d+]/g, '');
        if (!cleanPhone.startsWith('+')) {
            // Assume Turkish number if no country code
            if (cleanPhone.startsWith('0')) {
                cleanPhone = '+90' + cleanPhone.substring(1);
            } else {
                cleanPhone = '+90' + cleanPhone;
            }
        }
        registrationData.contact_phone = cleanPhone;

        console.log('Registration Data:', registrationData);

        // Track registration attempt
        trackEvent('registration_attempt', {
            plan: registrationData.selected_plan,
            billing: registrationData.selected_billing
        });

        // Check for existing user
        const checkResponse = await fetch(`https://dblepmaqqkudsbmvlqcw.supabase.co/rest/v1/customers?contact_phone=eq.${encodeURIComponent(registrationData.contact_phone)}&select=*`, {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg'
            }
        });

        if (!checkResponse.ok) {
            throw new Error('Kullanıcı kontrolü yapılamadı');
        }

        const existingUsers = await checkResponse.json();

        if (existingUsers.length > 0) {
            // Existing user - redirect to payment page
            const user = existingUsers[0];
            
            trackEvent('existing_user_detected', {
                current_plan: user.subscription_plan,
                selected_plan: registrationData.selected_plan
            });
            
            if (user.subscription_status === 'trial' || !user.subscription_status) {
                // Still in trial or no plan - can upgrade
                const upgradeMessage = `Bu telefon numarası zaten kayıtlı!\n\n` +
                    `Mevcut durumunuz: ${user.subscription_plan || 'Trial'}\n` +
                    `Seçtiğiniz plan: ${registrationData.selected_plan}\n\n` +
                    `Planınızı yükseltmek için ödeme sayfasına yönlendirilmek ister misiniz?`;
                
                if (confirm(upgradeMessage)) {
                    trackEvent('upgrade_redirect', {
                        from_plan: user.subscription_plan,
                        to_plan: registrationData.selected_plan
                    });
                    
                    window.location.href = `payment.html?phone=${encodeURIComponent(registrationData.contact_phone)}&plan=${registrationData.selected_plan}&billing=${registrationData.selected_billing}`;
                    return;
                }
            } else {
                // Active paid plan
                alert(`Bu telefon numarası zaten kayıtlı ve aktif bir planınız var!\n\nMevcut planınız: ${user.subscription_plan}\nWhatsApp asistanınız: +1 (415) 523-8886\n\nDoğrudan WhatsApp'tan mesaj gönderebilirsiniz.`);
                
                // Offer to open WhatsApp
                if (confirm('WhatsApp\'ı açmak ister misiniz?')) {
                    window.open('https://wa.me/14155238886?text=Merhaba, hesabım aktif', '_blank');
                }
                return;
            }
        } else {
            // New user - create trial account
            const userData = {
                ...registrationData,
                subscription_status: 'trial',
                subscription_plan: 'trial',
                billing_cycle: 'monthly',
                monthly_quota: 1000,
                yearly_quota: 12000,
                used_quota: 0,
                trial_start_date: new Date().toISOString(),
                trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                plan_price: 0,
                payment_status: 'trial',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const createResponse = await fetch('https://dblepmaqqkudsbmvlqcw.supabase.co/rest/v1/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(userData)
            });

            if (!createResponse.ok) {
                const errorData = await createResponse.json();
                throw new Error(errorData.message || 'Kayıt oluşturulamadı');
            }

            // Track successful registration
            trackEvent('registration_success', {
                plan: registrationData.selected_plan,
                billing: registrationData.selected_billing
            });

            // Success - redirect to success page
            event.target.reset();
            
            // Clear form localStorage
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                localStorage.removeItem(`form_${input.name}`);
            });
            
            // Show success message before redirect
            const successMessage = `🎉 Kayıt başarılı!\n\n` +
                `✅ 14 günlük ücretsiz denemeniz başladı\n` +
                `📱 WhatsApp asistanınız: +1 (415) 523-8886\n` +
                `💬 1000 mesaj hediye\n\n` +
                `Success sayfasına yönlendiriliyorsunuz...`;
            
            alert(successMessage);
            
            setTimeout(() => {
                window.location.href = `success.html?phone=${encodeURIComponent(registrationData.contact_phone)}&plan=trial&billing=monthly`;
            }, 1000);
        }

    } catch (error) {
        console.error('Registration error:', error);
        
        trackEvent('registration_error', {
            error: error.message
        });
        
        let errorMessage = 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.';
        
        if (error.message.includes('duplicate')) {
            errorMessage = 'Bu e-posta veya telefon numarası zaten kayıtlı.';
        } else if (error.message.includes('network')) {
            errorMessage = 'İnternet bağlantısı sorunu. Lütfen bağlantınızı kontrol edin.';
        }
        
        alert(errorMessage + '\n\nHata detayı: ' + error.message);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        defaultText.style.display = 'inline';
        loadingText.style.display = 'none';
    }
}

// ===============================================
// 6. ANALYTICS & TRACKING
// ===============================================
function trackEvent(eventName, properties = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Console log for debugging
    console.log('Event tracked:', eventName, properties);
    
    // You can add other analytics services here
    // Example: Facebook Pixel, Mixpanel, etc.
}

// ===============================================
// 7. KEYBOARD NAVIGATION
// ===============================================
document.addEventListener('keydown', function(e) {
    // ESC key to close any highlighted plan selection
    if (e.key === 'Escape') {
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.classList.remove('selected');
            card.style.transform = '';
            card.style.borderColor = '#e2e8f0';
            card.style.boxShadow = '';
        });
        window.selectedPlan = null;
    }
    
    // Enter key on plan cards
    if (e.key === 'Enter' && e.target.classList.contains('pricing-card')) {
        const planTypes = ['basic', 'pro', 'max'];
        const cards = Array.from(document.querySelectorAll('.pricing-card'));
        const index = cards.indexOf(e.target);
        if (index !== -1) {
            selectPlan(planTypes[index]);
        }
    }
});

// ===============================================
// 8. CSS STYLES FOR DYNAMIC ELEMENTS
// ===============================================
// Add CSS for error states and selected plans
const dynamicStyles = `
<style>
    .pricing-card.selected {
        border-color: #2563eb !important;
        transform: translateY(-8px) scale(1.02) !important;
        box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15) !important;
    }
    
    .form-group input.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 4px;
    }
    
    .plan-selection-info {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        border-radius: 8px;
        padding: 16px;
        margin: 20px 0;
        text-align: center;
        border-left: 4px solid #2563eb;
    }
    
    @media (max-width: 768px) {
        .pricing-card.selected {
            transform: translateY(-4px) scale(1.01) !important;
        }
    }
</style>
`;

// Inject dynamic styles
document.head.insertAdjacentHTML('beforeend', dynamicStyles);

// ===============================================
// 9. INITIALIZATION
// ===============================================
console.log('Satınalma CoPilot script loaded successfully! 🚀');
