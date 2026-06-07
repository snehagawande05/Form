const scriptURL = 'https://script.google.com/macros/s/AKfycbz_wTKBLINNaPu2msSmDLgUocUJ6Hg4Qcp0Ld4Duyae6xvSMK4teVbMhfs5b17wn24xiA/exec';
const form = document.getElementById('sheet-form');
const submitBtn = document.getElementById('submit-btn');
const responseMessage = document.getElementById('response-message');

// ── Validation Rules ──
const rules = {
    name: {
        validate: v => v.trim().length >= 2,
        message: 'Please enter your full name.'
    },
    mobile: {
        validate: v => /^[0-9]{10}$/.test(v.trim()),
        message: 'Enter a valid 10-digit mobile number.'
    },
    email: {
        validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        message: 'Enter a valid email address.'
    },
    message: {
        validate: v => v.trim().length >= 5,
        message: 'Please enter your message (min 5 characters).'
    }
};

// ── Show error under a field ──
function showError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const wrapper = input.closest('.input-wrapper');
    clearError(fieldId);
    input.classList.add('input-error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = msg;
    wrapper.after(err);
}

// ── Clear error for a field ──
function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    input.classList.remove('input-error');
    const group = input.closest('.form-group');
    const existing = group.querySelector('.field-error');
    if (existing) existing.remove();
}

// ── Clear error on user input ──
['name', 'email', 'mobile', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => clearError(id));
});

// ── Validate all fields ──
function validateForm() {
    let isValid = true;
    for (const [id, rule] of Object.entries(rules)) {
        const val = document.getElementById(id).value;
        if (!rule.validate(val)) {
            showError(id, rule.message);
            isValid = false;
        }
    }
    if (!isValid) {
        const firstError = form.querySelector('.input-error');
        if (firstError) firstError.focus();
    }
    return isValid;
}

// ── Submit Handler ──
form.addEventListener('submit', e => {
    e.preventDefault();

    responseMessage.textContent = '';
    responseMessage.className = 'response-message';

    if (!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // ✅ formData yahan define hai
    const formData = {
        name:    document.getElementById('name').value.trim(),
        email:   document.getElementById('email').value.trim(),
        mobile:  document.getElementById('mobile').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            responseMessage.classList.add('success');
            responseMessage.textContent = '✓ Message sent successfully! We\'ll get back to you soon.';
            form.reset();
        } else {
            throw new Error(data.error);
        }
    })
    .catch(error => {
        responseMessage.classList.add('error');
        responseMessage.textContent = '✗ Something went wrong. Please try again.';
        console.error('Error:', error.message);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    });
});