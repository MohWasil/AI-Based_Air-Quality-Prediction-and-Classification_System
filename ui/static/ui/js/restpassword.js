document.getElementById('resetPasswordForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get values from input fields
    const newPassword = document.getElementById('newpassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    // Get elements for displaying error messages
    const passwordCriteria = document.getElementById('passwordCriteria');
    const errorPassword = document.getElementById('errorPassword');
    const errorConfirmPassword = document.getElementById('errorConfirmPassword');

    let valid = true;

    // Clear previous error messages
    errorPassword.innerHTML = '';
    errorConfirmPassword.style.display = 'none';

    // Check if inputs are empty
    if (!newPassword || !confirmPassword) {
        valid = false;
        if (!newPassword) {
            errorPassword.innerHTML = 'Password is required.';
        }
        if (!confirmPassword) {
            errorConfirmPassword.style.display = 'block';
            errorConfirmPassword.innerHTML = 'Confirm password is required.';
        }
    }

    // Check password strength
    const lowercase = /[a-z]/.test(newPassword);
    const uppercase = /[A-Z]/.test(newPassword);
    const number = /[0-9]/.test(newPassword);
    const symbol = /[!@#$%^&*]/.test(newPassword);
    const lengthValid = newPassword.length >= 8;

    // Update the criteria colors dynamically
    passwordCriteria.style.display = 'block';
    document.getElementById('lowercase').classList.toggle('text-success', lowercase);
    document.getElementById('lowercase').classList.toggle('text-danger', !lowercase);

    document.getElementById('uppercase').classList.toggle('text-success', uppercase);
    document.getElementById('uppercase').classList.toggle('text-danger', !uppercase);

    document.getElementById('number').classList.toggle('text-success', number);
    document.getElementById('number').classList.toggle('text-danger', !number);

    document.getElementById('symbol').classList.toggle('text-success', symbol);
    document.getElementById('symbol').classList.toggle('text-danger', !symbol);

    document.getElementById('length').classList.toggle('text-success', lengthValid);
    document.getElementById('length').classList.toggle('text-danger', !lengthValid);

    if (!lowercase || !uppercase || !number || !symbol || !lengthValid) {
        valid = false;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        valid = false;
        errorConfirmPassword.style.display = 'block';
        errorConfirmPassword.innerHTML = 'Passwords must match.';
    }

    // If valid, show toast and redirect to homepage
    if (valid) {
        const toastElement = document.getElementById('toastRestPassword');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Redirect to homepage after showing toast for 2 seconds
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 2000); // 2 seconds delay to show toast
    }
});

// Real-time validation for password
document.getElementById('newpassword').addEventListener('input', function () {
    const newPassword = this.value;

    // Real-time criteria checks
    const lowercase = /[a-z]/.test(newPassword);
    const uppercase = /[A-Z]/.test(newPassword);
    const number = /[0-9]/.test(newPassword);
    const symbol = /[!@#$%^&*]/.test(newPassword);
    const lengthValid = newPassword.length >= 8;

    // Update the criteria colors dynamically
    document.getElementById('lowercase').classList.toggle('text-success', lowercase);
    document.getElementById('lowercase').classList.toggle('text-danger', !lowercase);

    document.getElementById('uppercase').classList.toggle('text-success', uppercase);
    document.getElementById('uppercase').classList.toggle('text-danger', !uppercase);

    document.getElementById('number').classList.toggle('text-success', number);
    document.getElementById('number').classList.toggle('text-danger', !number);

    document.getElementById('symbol').classList.toggle('text-success', symbol);
    document.getElementById('symbol').classList.toggle('text-danger', !symbol);

    document.getElementById('length').classList.toggle('text-success', lengthValid);
    document.getElementById('length').classList.toggle('text-danger', !lengthValid);
});
