function handleSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    
    // Store email in localStorage
    localStorage.setItem('userEmail', email);
    
    // Show loading state
    const submitButton = event.target.querySelector('.submit-btn');
    submitButton.textContent = 'Loading...';
    submitButton.disabled = true;
    
    // Google Sheets Web App URL (you'll need to replace this with your deployment URL)
    const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_SCRIPT_DEPLOYMENT_URL';

    // Send email to Google Sheets
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Scripts
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            email: email,
            timestamp: new Date().toISOString()
        })
    })
    .then(() => {
        // Redirect to the tool page after successful submission
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        submitButton.textContent = 'Continue to Tool →';
        submitButton.disabled = false;
        alert('There was an error saving your email. Please try again.');
    });
}

// Add input validation
document.getElementById('email').addEventListener('input', function(e) {
    const email = e.target.value;
    const submitBtn = document.querySelector('.submit-btn');
    
    if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
    } else {
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;
    }
}); 