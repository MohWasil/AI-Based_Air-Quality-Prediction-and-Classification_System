document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');

    // Form submit validation
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            fetch("/api/")
        }

        form.classList.add('was-validated');
    });

    // Restrict input to valid email characters only
    emailInput.addEventListener('input', (event) => {
        // Remove unwanted characters: =, +, and others not valid for email
        event.target.value = event.target.value.replace(/[^a-zA-Z0-9._@-]/g, '');
    });
});