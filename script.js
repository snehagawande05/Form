// CRITICAL: Yahan apna naya Google Apps Script Web App URL dalein
const scriptURL = 'https://script.google.com/macros/s/AKfycbyVYSEMh5iS7Jr4zcsXSoyBT11Emk5KZZkdRhf51sWqtZCbjysKm_vX_eMc6vxBx1k9NQ/exec';

const form = document.getElementById('sheet-form');
const submitBtn = document.getElementById('submit-btn');
const responseMessage = document.getElementById('response-message');

form.addEventListener('submit', e => {
    e.preventDefault(); // Form submit hone par page reload nahi hoga
    
    // UI Feedback State (Button disable karna)
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    responseMessage.innerText = "";

    // Form ka saara input data ek object mein jama kiya
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value, // Naya Mobile Data
        message: document.getElementById('message').value
    };

    // AJAX / Fetch POST request to Google Sheet Script
    fetch(scriptURL, { 
        method: 'POST', 
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.result === 'success') {
            responseMessage.style.color = "green";
            responseMessage.innerText = "From is submited.";
            form.reset(); // Form clear karne ke liye
        } else {
            throw new Error(data.error);
        }
    })
    .catch(error => {
        responseMessage.style.color = "red";
        responseMessage.innerText = "Oops! Error in form submiting.";
        console.error('Error!', error.message);
    })
    .finally(() => {
        // Button wapas normal active state mein aa jayega
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";
    });
});