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
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        company: document.getElementById('company').value.trim(),
        position: document.getElementById('position').value.trim(),
        registration_source: 'web',
        subscription_status: 'trial',
        subscription_plan: 'freemium',
        trial_start_date: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        monthly_quota: 100,
        used_quota: 0
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.company) {
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
