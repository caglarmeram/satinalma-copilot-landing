// Enhanced Pricing Data with Complete Configuration
const pricingData = {
    monthly: {
        basic: {
            price: 7.95,
            originalPrice: null,
            quota: 500,
            quotaLabel: "mesaj/ay",
            savings: null,
            period: "/ay",
            monthlyEquivalent: null,
            yearlyTotal: 95.4,
            features: ['supplier_search', 'basic_rfq', 'basic_risk']
        },
        pro: {
            price: 17.95,
            originalPrice: null,
            quota: 1500,
            quotaLabel: "mesaj/ay", 
            savings: null,
            period: "/ay",
            monthlyEquivalent: null,
            yearlyTotal: 215.4,
            features: ['all_basic', 'advanced_scouting', 'full_rfq', 'detailed_analysis', 'reporting']
        },
        max: {
            price: 39.95,
            originalPrice: null,
            quota: 5000,
            quotaLabel: "mesaj/ay",
            savings: null,
            period: "/ay",
            monthlyEquivalent: null,
            yearlyTotal: 479.4,
            features: ['all_pro', 'delivery_tracking', 'erp_integration', 'priority_support', 'account_manager']
        }
    },
    annual: {
        basic: {
            price: 47.4,
            originalPrice: 95.4,
            quota: 6000,
            quotaLabel: "mesaj/yıl",
            savings: "%50 İndirim",
            period: "/yıl",
            monthlyEquivalent: "$3.95/ay",
            yearlyTotal: 47.4,
            features: ['supplier_search', 'basic_rfq', 'basic_risk']
        },
        pro: {
            price: 107.4,
            originalPrice: 215.4,
            quota: 18000,
            quotaLabel: "mesaj/yıl",
            savings: "%50 İndirim",
            period: "/yıl",
            monthlyEquivalent: "$8.95/ay",
            yearlyTotal: 107.4,
            features: ['all_basic', 'advanced_scouting', 'full_rfq', 'detailed_analysis', 'reporting']
        },
        max: {
            price: 239.4,
            originalPrice: 479.4,
            quota: 60000,
            quotaLabel: "mesaj/yıl",
            savings: "%50 İndirim",
            period: "/yıl",
            monthlyEquivalent: "$19.95/ay",
            yearlyTotal: 239.4,
            features: ['all_pro', 'delivery_tracking', 'erp_integration', 'priority_support', 'account_manager']
        }
    }
};

// Global State Management
let currentState = {
    selectedPlan: null,
    selectedBilling: 'annual',
    formData: {},
    isLoading: false,
    notifications: []
};

// Utility Functions
const utils = {
    // Clean and format phone number
    formatPhone: (phone) => {
        if (!phone) return null;
        let clean = phone.replace(/[^\d+]/g, '');
        
        // Auto-add country codes
        if (!clean.startsWith('+')) {
            if (clean.startsWith('90')) {
                clean = '+' + clean;
            } else if (clean.startsWith('5') && clean.length >= 10) {
                clean = '+90' + clean;
            } else if (clean.length === 10) {
                clean = '+90' + clean;
            }
        }
        
        return clean;
    },

    // Validate email
    validateEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Smooth scroll to element
    scrollTo: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Show notification
    showNotification: (message, type = 'success', duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: inherit;">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    // Local storage helpers
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage not available:', e);
            }
        },
        get: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('LocalStorage read error:', e);
                return null;
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('LocalStorage remove error:', e);
            }
        }
    }
};

// Pricing Management
const PricingManager = {
    init: function() {
        this.setupBillingToggle();
        this.updatePricingDisplay();
        this.loadSavedState();
    },

    setupBillingToggle: function() {
        const toggleOptions = document.querySelectorAll('.toggle-option');
        
        toggleOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const billingType = e.target.getAttribute('data-billing');
                if (billingType) {
                    this.switchBilling(billingType);
                }
            });
        });
    },

    switchBilling: function(type) {
        if (!['monthly', 'annual'].includes(type)) return;
        
        currentState.selectedBilling = type;
        
        // Update UI
        const toggleOptions = document.querySelectorAll('.toggle-option');
        toggleOptions.forEach(option => {
            const billingType = option.getAttribute('data-billing');
            option.classList.toggle('active', billingType === type);
        });
        
        this.updatePricingDisplay();
        this.saveState();
        
        // Update selected plan display if plan is selected
        if (currentState.selectedPlan) {
            PlanSelector.updateSelectedPlanDisplay();
        }
    },

    updatePricingDisplay: function() {
        const billing = currentState.selectedBilling;
        const data = pricingData[billing];
        
        Object.keys(data).forEach(planKey => {
            const planData = data[planKey];
            const planCard = document.querySelector(`[data-plan="${planKey}"]`);
            
            if (!planCard) return;
            
            // Update price
            const priceAmount = planCard.querySelector('.price-amount');
            const pricePeriod = planCard.querySelector('.price-period');
            if (priceAmount) priceAmount.textContent = planData.price;
            if (pricePeriod) pricePeriod.textContent = planData.period;
            
            // Update quota
            const quotaNumber = planCard.querySelector('.quota-number');
            const quotaLabel = planCard.querySelector('.quota-label');
            if (quotaNumber) quotaNumber.textContent = planData.quota.toLocaleString();
            if (quotaLabel) quotaLabel.textContent = planData.quotaLabel;
            
            // Update price info
            const priceInfo = planCard.querySelector('.price-info');
            if (priceInfo) {
                priceInfo.innerHTML = '';
                
                if (planData.originalPrice) {
                    const originalPrice = document.createElement('div');
                    originalPrice.className = 'original-price';
                    originalPrice.textContent = `$${planData.originalPrice}`;
                    priceInfo.appendChild(originalPrice);
                }
                
                if (planData.savings) {
                    const savings = document.createElement('div');
                    savings.className = 'discount-badge';
                    savings.textContent = planData.savings;
                    priceInfo.appendChild(savings);
                }
                
                if (planData.monthlyEquivalent) {
                    const monthlyEq = document.createElement('div');
                    monthlyEq.className = 'monthly-equivalent';
                    monthlyEq.textContent = planData.monthlyEquivalent;
                    priceInfo.appendChild(monthlyEq);
                }
            }
        });
    },

    saveState: function() {
        utils.storage.set('pricingState', {
            selectedPlan: currentState.selectedPlan,
            selectedBilling: currentState.selectedBilling
        });
    },

    loadSavedState: function() {
        const saved = utils.storage.get('pricingState');
        if (saved) {
            if (saved.selectedBilling) {
                this.switchBilling(saved.selectedBilling);
            }
            if (saved.selectedPlan) {
                PlanSelector.selectPlan(saved.selectedPlan);
            }
        }
    }
};

// Plan Selection Management
const PlanSelector = {
    selectPlan: function(planType) {
        if (!planType || !pricingData[currentState.selectedBilling][planType]) {
            console.warn('Invalid plan type:', planType);
            return;
        }

        // Update state
        currentState.selectedPlan = planType;
        
        // Update UI
        this.updatePlanCardsUI(planType);
        this.updateSelectedPlanDisplay();
        
        // Save state
        PricingManager.saveState();
        
        // Show success notification
        const planData = pricingData[currentState.selectedBilling][planType];
        utils.showNotification(`✅ ${planType.toUpperCase()} planı seçildi ($${planData.price}${planData.period})`);
        
        // Scroll to registration
        setTimeout(() => {
            utils.scrollTo('registration');
            this.highlightForm();
        }, 500);
    },

    updatePlanCardsUI: function(selectedPlan) {
        // Remove all selections
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.classList.remove('selected');
            const indicator = card.querySelector('.plan-selection-indicator');
            if (indicator) indicator.remove();
        });
        
        // Add selection to current plan
        const selectedCard = document.querySelector(`[data-plan="${selectedPlan}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            
            // Add selection indicator
            const indicator = document.createElement('div');
            indicator.className = 'plan-selection-indicator';
            indicator.textContent = '✅ SEÇİLDİ';
            selectedCard.appendChild(indicator);
            
            // Update button text
            const button = selectedCard.querySelector('.cta-button-pricing');
            if (button) {
                button.innerHTML = '✅ Seçildi - Kayıt Ol';
            }
        }
    },

    updateSelectedPlanDisplay: function() {
        const planInfoDiv = document.getElementById('selectedPlanInfo');
        const planNameSpan = document.getElementById('selectedPlanName');
        const planDetailsSpan = document.getElementById('selectedPlanDetails');
        
        if (!currentState.selectedPlan || !planInfoDiv) return;
        
        const planData = pricingData[currentState.selectedBilling][currentState.selectedPlan];
        
        planInfoDiv.style.display = 'block';
        if (planNameSpan) {
            planNameSpan.textContent = `🎯 Seçilen Plan: ${currentState.selectedPlan.toUpperCase()}`;
        }
        if (planDetailsSpan) {
            planDetailsSpan.textContent = `$${planData.price}${planData.period} • ${planData.quota.toLocaleString()} mesaj • ${planData.savings || 'Standart fiyat'}`;
        }
    },

    highlightForm: function() {
        const formWrapper = document.querySelector('.form-wrapper');
        if (formWrapper) {
            formWrapper.style.boxShadow = '0 0 30px rgba(37, 99, 235, 0.4)';
            formWrapper.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                formWrapper.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                formWrapper.style.transform = 'scale(1)';
            }, 3000);
        }
    }
};

// User Management and API
const UserManager = {
    // Check if user exists
    checkExistingUser: async function(phone) {
        try {
            const cleanPhone = utils.formatPhone(phone);
            if (!cleanPhone) throw new Error('Geçersiz telefon numarası');
            
            console.log('🔍 Checking existing user:', cleanPhone);
            
            const response = await fetch(`https://dblepmaqqkudsbmvlqcw.supabase.co/rest/v1/customers?contact_phone=eq.${encodeURIComponent(cleanPhone)}&select=id,name,subscription_status,subscription_plan,trial_end_date`, {
                headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg'
                }
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const users = await response.json();
            console.log('👤 User check result:', users);
            
            return users.length > 0 ? users[0] : null;
            
        } catch (error) {
            console.error('❌ User check error:', error);
            throw error;
        }
    },

    // Create new user
    createUser: async function(userData) {
        try {
            console.log('📝 Creating new user:', userData);
            
            const response = await fetch('https://dblepmaqqkudsbmvlqcw.supabase.co/rest/v1/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibGVwbWFxcWt1ZHNibXZscWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTUzOTksImV4cCI6MjA3MjAzMTM5OX0.yOPbSl2o2LjHNryW0eIfKeJa5YJgBC94GWzswlclPWg',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ API Error:', errorData);
                throw new Error(errorData.message || `Registration failed: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('✅ User created successfully:', result);
            
            return Array.isArray(result) ? result[0] : result;
            
        } catch (error) {
            console.error('❌ User creation error:', error);
            throw error;
        }
    },

    // Handle existing user scenario
    handleExistingUser: function(existingUser, selectedPlan, selectedBilling, cleanPhone) {
        const paymentUrl = `payment.html?phone=${encodeURIComponent(cleanPhone)}&plan=${selectedPlan}&billing=${selectedBilling}`;
        
        const now = new Date();
        const trialEnd = existingUser.trial_end_date ? new Date(existingUser.trial_end_date) : null;
        
        let message = `📱 Bu WhatsApp numarası zaten kayıtlı!\n\n👤 İsim: ${existingUser.name}\n📊 Mevcut Plan: ${existingUser.subscription_plan || 'Bilinmiyor'}`;
        
        if (selectedPlan) {
            message += `\n🎯 Seçtiğiniz Plan: ${selectedPlan.toUpperCase()}`;
        }
        
        if (existingUser.subscription_status === 'trial' && trialEnd && trialEnd > now) {
            const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
            message += `\n\n✅ Trial süreniz devam ediyor (${daysLeft} gün kaldı).`;
            
            if (selectedPlan && selectedPlan !== existingUser.subscription_plan) {
                message += `\n\n💳 Plan değişikliği için ödeme sayfasına yönlendiriliyorsunuz...`;
                setTimeout(() => window.location.href = paymentUrl, 2000);
            } else {
                message += `\n\n📱 WhatsApp'tan mesaj göndermeye devam edebilirsiniz.`;
            }
        } else if (existingUser.subscription_status === 'active') {
            message += `\n\n✅ Aktif aboneliğiniz var.`;
            
            if (selectedPlan && selectedPlan !== existingUser.subscription_plan) {
                message += `\n\n💳 Plan yükseltmesi için ödeme sayfasına yönlendiriliyorsunuz...`;
                setTimeout(() => window.location.href = paymentUrl, 2000);
            } else {
                message += `\n\n📱 WhatsApp'tan mesaj göndermeye devam edebilirsiniz.`;
            }
        } else {
            message += `\n\n⚠️ Trial süreniz dolmuş veya aboneliğiniz pasif.\n💳 Yeniden aktifleştirmek için ödeme sayfasına yönlendiriliyorsunuz...`;
            setTimeout(() => window.location.href = paymentUrl, 2000);
        }
        
        alert(message);
    }
};

// Form Management
const FormManager = {
    init: function() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupPhoneFormatting();
    },

    setupFormValidation: function() {
        const requiredInputs = document.querySelectorAll('form input[required]');
        
        requiredInputs.forEach(input => {
            // Real-time validation
            input.addEventListener('input', (e) => this.validateField(e.target));
            input.addEventListener('blur', (e) => this.validateField(e.target));
        });
    },

    setupPhoneFormatting: function() {
        const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="whatsapp"], input[name="phone"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                const formatted = utils.formatPhone(e.target.value);
                if (formatted && formatted !== e.target.value) {
                    e.target.value = formatted;
                }
            });
        });
    },

    validateField: function(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        const formGroup = field.closest('.form-group');
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Bu alan zorunludur';
        }
        // Email validation
        else if (fieldType === 'email' && value && !utils.validateEmail(value)) {
            isValid = false;
            errorMessage = 'Geçerli bir e-posta adresi girin';
        }
        // Phone validation
        else if ((fieldType === 'tel' || fieldName === 'whatsapp') && value) {
            const formatted = utils.formatPhone(value);
            if (!formatted || formatted.length < 12) {
                isValid = false;
                errorMessage = 'Geçerli bir telefon numarası girin';
            }
        }
        
        // Update UI
        this.updateFieldUI(field, formGroup, isValid, errorMessage);
        
        return isValid;
    },

    updateFieldUI: function(field, formGroup, isValid, errorMessage) {
        // Remove existing error states
        formGroup.classList.remove('error', 'success');
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        if (field.value.trim()) {
            if (isValid) {
                formGroup.classList.add('success');
                field.classList.add('valid');
                field.classList.remove('invalid');
            } else {
                formGroup.classList.add('error');
                field.classList.add('invalid');
                field.classList.remove('valid');
                
                // Add error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = errorMessage;
                formGroup.appendChild(errorDiv);
            }
        } else {
            field.classList.remove('valid', 'invalid');
        }
    },

    setupFormSubmission: function() {
        const registrationForm = document.querySelector('.registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    },

    handleFormSubmission: async function(event) {
        event.preventDefault();
        
        if (currentState.isLoading) return;
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            utils.showNotification('Lütfen tüm alanları doğru şekilde doldurun', 'error');
            return;
        }
        
        // Start loading
        this.setLoadingState(true);
        
        try {
            // Get form data
            const cleanPhone = utils.formatPhone(formData.get('whatsapp'));
            if (!cleanPhone) {
                throw new Error('Geçersiz telefon numarası');
            }
            
            // Check for existing user
            const existingUser = await UserManager.checkExistingUser(cleanPhone);
            
            if (existingUser) {
                UserManager.handleExistingUser(
                    existingUser, 
                    currentState.selectedPlan, 
                    currentState.selectedBilling, 
                    cleanPhone
                );
                return;
            }
            
            // Create new user data
            const planData = currentState.selectedPlan 
                ? pricingData[currentState.selectedBilling][currentState.selectedPlan]
                : { quota: 1000, price: 0 };
            
            const userData = {
                name: formData.get('fullName'),
                email: formData.get('email'),
                contact_phone: cleanPhone,
                company_name: formData.get('company'),
                
                // Plan information
                subscription_plan: currentState.selectedPlan || 'trial',
                billing_cycle: currentState.selectedBilling,
                monthly_quota: currentState.selectedBilling === 'monthly' ? planData.quota : Math.floor(planData.quota / 12),
                yearly_quota: currentState.selectedBilling === 'annual' ? planData.quota : planData.quota * 12,
                plan_price: planData.price,
                
                // Trial settings
                subscription_status: 'trial',
                trial_start_date: new Date().toISOString(),
                trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                
                // Default settings
                used_quota: 0,
                registration_source: 'web',
                trial_used: false,
                payment_status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            // Create user
            const result = await UserManager.createUser(userData);
            
            // Success handling
            this.handleRegistrationSuccess(result, form);
            
        } catch (error) {
            console.error('Registration error:', error);
            this.handleRegistrationError(error);
        } finally {
            this.setLoadingState(false);
        }
    },

    setLoadingState: function(isLoading) {
        currentState.isLoading = isLoading;
        
        const submitBtn = document.getElementById('submitBtn') || document.querySelector('.submit-button');
        const defaultText = submitBtn?.querySelector('.default-text');
        const loadingText = submitBtn?.querySelector('.loading-text');
        
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            if (isLoading) {
                submitBtn.classList.add('loading');
            } else {
                submitBtn.classList.remove('loading');
            }
        }
        
        if (defaultText) defaultText.style.display = isLoading ? 'none' : 'inline';
        if (loadingText) loadingText.style.display = isLoading ? 'inline' : 'none';
    },

    handleRegistrationSuccess: function(result, form) {
        // Clear form
        form.reset();
        
        // Clear state
        currentState.selectedPlan = null;
        currentState.selectedBilling = 'annual';
        utils.storage.remove('pricingState');
        
        // Update UI
        PlanSelector.updatePlanCardsUI(null);
        PlanSelector.updateSelectedPlanDisplay();
        
        // Show success message
        const planData = currentState.selectedPlan 
            ? pricingData[currentState.selectedBilling][currentState.selectedPlan]
            : null;
        
        let successMessage = '🎉 Kaydınız başarıyla tamamlandı!';
        
        if (planData) {
            successMessage += `\n\n📦 Seçilen Plan: ${currentState.selectedPlan.toUpperCase()}`;
            successMessage += `\n💰 Fiyat: $${planData.price}${planData.period}`;
            successMessage += `\n📊 Mesaj Kotası: ${planData.quota.toLocaleString()}`;
        }
        
        successMessage += '\n\n📱 WhatsApp asistanınız hazırlanıyor...';
        successMessage += '\n⏰ 5 dakika içinde aktif olacak.';
        
        alert(successMessage);
        
        // Redirect to success page
        const successUrl = new URL('success.html', window.location.origin);
        successUrl.searchParams.set('phone', result.contact_phone);
        if (currentState.selectedPlan) {
            successUrl.searchParams.set('plan', currentState.selectedPlan);
            successUrl.searchParams.set('billing', currentState.selectedBilling);
        }
        
        window.location.href = successUrl.toString();
    },

    handleRegistrationError: function(error) {
        const errorMessage = error.message || 'Kayıt işlemi başarısız oldu';
        utils.showNotification(`❌ ${errorMessage}\n\nLütfen tekrar deneyin veya destek ile iletişime geçin.`, 'error', 8000);
    }
};

// Navigation and UI Enhancements
const UIManager = {
    init: function() {
        this.setupNavbarEffects();
        this.setupScrollAnimations();
        this.setupClickHandlers();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
    },

    setupNavbarEffects: function() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Background blur effect
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = '#fff';
                navbar.style.backdropFilter = 'none';
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    },

    setupScrollAnimations: function() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    },

    setupClickHandlers: function() {
        // Plan selection click handlers
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on button or link
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
                
                const planType = card.getAttribute('data-plan');
                if (planType) {
                    PlanSelector.selectPlan(planType);
                }
            });
        });

        // CTA button handlers
        document.querySelectorAll('.cta-button-pricing').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.pricing-card');
                const planType = card?.getAttribute('data-plan');
                if (planType) {
                    PlanSelector.selectPlan(planType);
                }
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                utils.scrollTo(targetId);
            });
        });
    },

    setupKeyboardNavigation: function() {
        // Plan cards keyboard navigation
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `${card.querySelector('.plan-name')?.textContent} planını seç`);
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const planType = card.getAttribute('data-plan');
                    if (planType) {
                        PlanSelector.selectPlan(planType);
                    }
                }
            });
        });

        // Billing toggle keyboard support
        document.querySelectorAll('.toggle-option').forEach(option => {
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'radio');
            
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });
    },

    setupAccessibility: function() {
        // Add ARIA attributes for screen readers
        document.querySelectorAll('.pricing-card.selected').forEach(card => {
            card.setAttribute('aria-selected', 'true');
        });

        // Add skip link
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Ana içeriğe geç';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Add main content ID if not exists
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }
};

// Analytics and Tracking
const Analytics = {
    init: function() {
        this.setupEventTracking();
        this.trackPageLoad();
    },

    trackEvent: function(eventName, properties = {}) {
        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Custom analytics
        console.log('📊 Event tracked:', eventName, properties);
        
        // Store for later analysis
        const events = utils.storage.get('analytics_events') || [];
        events.push({
            event: eventName,
            properties,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        utils.storage.set('analytics_events', events);
    },

    trackPageLoad: function() {
        this.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            referrer: document.referrer
        });
    },

    setupEventTracking: function() {
        // Form interactions
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.name) {
                this.trackEvent('form_field_focus', { field_name: e.target.name });
            }
        });

        // Plan selection tracking
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pricing-card')) {
                const card = e.target.closest('.pricing-card');
                const planType = card.getAttribute('data-plan');
                if (planType) {
                    this.trackEvent('plan_selected', { 
                        plan: planType,
                        billing: currentState.selectedBilling 
                    });
                }
            }
        });

        // Billing toggle tracking
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-option')) {
                const billingType = e.target.getAttribute('data-billing');
                this.trackEvent('billing_changed', { billing_type: billingType });
            }
        });

        // CTA button tracking
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('cta_clicked', { 
                    button_location: 'hero',
                    button_text: button.textContent.trim()
                });
            });
        });
    }
};

// Performance and Error Handling
const ErrorHandler = {
    init: function() {
        this.setupGlobalErrorHandling();
        this.setupPerformanceMonitoring();
    },

    setupGlobalErrorHandling: function() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e);
            this.logError('javascript_error', e.error, {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e);
            this.logError('promise_rejection', e.reason, {
                type: 'unhandled_rejection'
            });
        });
    },

    setupPerformanceMonitoring: function() {
        // Monitor loading performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                Analytics.trackEvent('page_performance', {
                    load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                    dom_load_time: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                    first_paint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
                });
            }
        });
    },

    logError: function(type, error, context = {}) {
        const errorData = {
            type,
            message: error?.message || String(error),
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            context
        };

        // Store error locally
        const errors = utils.storage.get('error_logs') || [];
        errors.push(errorData);
        
        // Keep only last 50 errors
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        utils.storage.set('error_logs', errors);

        // Track error
        Analytics.trackEvent('error_occurred', {
            error_type: type,
            error_message: errorData.message
        });
    }
};

// URL Parameter Handling
const URLHandler = {
    init: function() {
        this.processURLParameters();
    },

    processURLParameters: function() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Handle plan parameter
        const planFromUrl = urlParams.get('plan');
        if (planFromUrl && pricingData[currentState.selectedBilling][planFromUrl]) {
            currentState.selectedPlan = planFromUrl;
            PlanSelector.selectPlan(planFromUrl);
        }
        
        // Handle billing parameter
        const billingFromUrl = urlParams.get('billing');
        if (billingFromUrl && ['monthly', 'annual'].includes(billingFromUrl)) {
            PricingManager.switchBilling(billingFromUrl);
        }
        
        // Handle referral parameter
        const ref = urlParams.get('ref');
        if (ref) {
            utils.storage.set('referral_source', ref);
            Analytics.trackEvent('referral_visit', { source: ref });
        }
        
        // Handle UTM parameters
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        
        if (utmSource || utmMedium || utmCampaign) {
            Analytics.trackEvent('utm_visit', {
                utm_source: utmSource,
                utm_medium: utmMedium,
                utm_campaign: utmCampaign
            });
        }
    }
};

// Global Functions (for backwards compatibility)
window.scrollToRegistration = function() {
    utils.scrollTo('registration');
};

window.selectPlan = function(planType) {
    PlanSelector.selectPlan(planType);
};

window.switchBilling = function(billingType) {
    PricingManager.switchBilling(billingType);
};

window.handleRegistrationWithPlan = function(event) {
    FormManager.handleFormSubmission(event);
};

window.showLogin = function() {
    const phone = prompt('WhatsApp numaranızı girin (mevcut kullanıcılar için):');
    if (phone && phone.trim()) {
        UserManager.checkExistingUser(phone.trim())
            .then(existingUser => {
                if (existingUser) {
                    UserManager.handleExistingUser(existingUser, null, null, utils.formatPhone(phone.trim()));
                } else {
                    alert('Bu numara ile kayıtlı kullanıcı bulunamadı.\nLütfen aşağıdan kayıt olun.');
                    utils.scrollTo('registration');
                }
            })
            .catch(error => {
                console.error('User check error:', error);
                alert('Kullanıcı kontrolü yapılırken hata oluştu.\nLütfen tekrar deneyin.');
            });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all managers
        PricingManager.init();
        FormManager.init();
        UIManager.init();
        Analytics.init();
        ErrorHandler.init();
        URLHandler.init();
        
        console.log('✅ Application initialized successfully');
        
        // Track initialization
        Analytics.trackEvent('app_initialized', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        });
        
    } catch (error) {
        console.error('❌ Application initialization failed:', error);
        ErrorHandler.logError('initialization_error', error);
        
        // Show user-friendly error message
        utils.showNotification('Sayfa yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error', 10000);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        Analytics.trackEvent('page_visible');
    } else {
        Analytics.trackEvent('page_hidden');
    }
});

// Handle before page unload
window.addEventListener('beforeunload', function() {
    // Save any pending state
    PricingManager.saveState();
    
    // Track page exit
    Analytics.trackEvent('page_exit', {
        time_on_page: Date.now() - (window.pageLoadTime || Date.now())
    });
});

// Set page load time for exit tracking
window.pageLoadTime = Date.now();

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PricingManager,
        PlanSelector,
        UserManager,
        FormManager,
        UIManager,
        Analytics,
        ErrorHandler,
        utils,
        currentState
    };
}
