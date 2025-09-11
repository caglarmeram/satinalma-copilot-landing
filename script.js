// Smooth scroll to registration form
function scrollToForm() {
    document.getElementById('registration').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Form submission handler
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const loadingText = submitButton.querySelector('.loading-text');
    
    // Show loading state
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    loadingText.style.display = 'inline';
    
    // Get form data - DÜZELTILMIŞ: Trial subscription için
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        contact_phone: document.getElementById('phone').value.trim(),
        company_name: document.getElementById('company').value.trim(),
        position: document.getElementById('position').value.trim() || null,
        registration_source: 'web',
        subscription_status: 'trial', // ✅ TRIAL olmalı
        subscription_plan: 'trial',   // ✅ Plan da trial
        trial_start_date: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        monthly_quota: 1000,  // ✅ Trial için 1000 mesaj
        used_quota: 0
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
    
    // Validate phone format (basic)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.contact_phone)) {
        alert('Lütfen geçerli bir telefon numarası girin. Örn: +90 555 123 45 67');
        resetButton();
        return;
    }
    
    try {
        // Send to Supabase
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
            console.error('Form data sent:', formData);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Customer created successfully:', result);
        
        // Send welcome email
        await sendWelcomeEmail(formData);
        
        // Redirect to success page
        window.location.href = 'success.html?phone=' + encodeURIComponent(formData.contact_phone);
        
    } catch (error) {
        console.error('Registration error:', error);
        
        // Backup to localStorage
        localStorage.setItem('pendingRegistration', JSON.stringify(formData));
        
        alert('Kayıt işlemi tamamlanamadı. Lütfen birkaç dakika sonra tekrar deneyin veya doğrudan WhatsApp\'tan bize ulaşın: +90 552 071 0977');
        resetButton();
    }
    
    function resetButton() {
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        loadingText.style.display = 'none';
    }
});

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
document.getElementById('phone').addEventListener('input', function(e) {
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

// Form validation
document.querySelectorAll('#registrationForm input[required]').forEach(input => {
    input.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = 'rgba(255,255,255,0.2)';
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Analytics tracking
function trackEvent(eventName, properties) {
    console.log('Event tracked:', eventName, properties);
}

document.getElementById('registrationForm').addEventListener('focusin', function(e) {
    trackEvent('form_field_focus', { field: e.target.name });
});

document.querySelector('.cta-button').addEventListener('click', function() {
    trackEvent('cta_button_click', { source: 'hero' });
});

// Page load animations
document.addEventListener('DOMContentLoaded', function() {
    const pendingRegistration = localStorage.getItem('pendingRegistration');
    if (pendingRegistration) {
        console.log('Found pending registration:', JSON.parse(pendingRegistration));
    }
    
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
    
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
