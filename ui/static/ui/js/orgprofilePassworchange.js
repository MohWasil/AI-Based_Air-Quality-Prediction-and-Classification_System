// JavaScript logic for enabling/disabling inputs and form validation
const oldPasswordInput = document.getElementById('oldPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitButton = document.getElementById('submitButton');
const validationMessage = document.getElementById('validationMessage');
const passwordStrengthMessage = document.getElementById('passwordStrengthMessage');

let isOldPasswordValid = false; // Track whether the old password is valid

// Listen for input on the Old Password field
oldPasswordInput.addEventListener('input', async () => {
    const oldPassword = oldPasswordInput.value.trim();

    if (oldPassword.length > 0) {
        // Validate the old password (simulated server check)
        const response = await fakeServerCheck(oldPassword);
        if (response.isValid) {
            isOldPasswordValid = true;
            enableInputs(); // Enable the New Password and Confirm Password fields
            validationMessage.textContent = '';
        } else {
            isOldPasswordValid = false;
            disableInputs(); // Disable the New Password and Confirm Password fields
            validationMessage.textContent = 'Old password is incorrect.';
        }
    } else {
        isOldPasswordValid = false;
        disableInputs();
        validationMessage.textContent = '';
    }

    checkFormValidity();
});

// Listen for input on the New Password field to evaluate password strength
newPasswordInput.addEventListener("input", (e) => {
    const newPassword = e.target.value;

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /[0-9]/.test(newPassword);
    const hasSymbols = /[!@#$%^&*()_+]/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;

    let strength = "Weak";
    const validCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSymbols, isLongEnough].filter(Boolean).length;

    if (validCount === 5) {
        strength = "Strong";
    } else if (validCount >= 3) {
        strength = "Medium";
    }

    // Update password strength message
    if (strength === "Weak") {
        passwordStrengthMessage.innerHTML = `
            Password strength: <span style="color: red;">Weak</span><br>
            Include: <br>
            <ul class="list-unstyled">
                <li>${hasUpperCase ? '✔️' : '❌'} Uppercase letters</li>
                <li>${hasLowerCase ? '✔️' : '❌'} Lowercase letters</li>
                <li>${hasNumbers ? '✔️' : '❌'} Numbers</li>
                <li>${hasSymbols ? '✔️' : '❌'} Symbols</li>
            </ul>
        `;
    } else if (strength === "Medium") {
        passwordStrengthMessage.innerHTML = `
            Password strength: <span style="color: orange;">Medium</span><br>
            Consider including all character types for a stronger password.<br>
            <ul class="list-unstyled">
                <li>${hasUpperCase ? '✔️' : '❌'} Uppercase letters</li>
                <li>${hasLowerCase ? '✔️' : '❌'} Lowercase letters</li>
                <li>${hasNumbers ? '✔️' : '❌'} Numbers</li>
                <li>${hasSymbols ? '✔️' : '❌'} Symbols</li>
            </ul>
        `;
    } else if (strength === "Strong") {
        passwordStrengthMessage.innerHTML = `
            Password strength: <span style="color: green;">Strong</span><br>
            <ul class="list-unstyled">
                <li>✔️ Uppercase letters</li>
                <li>✔️ Lowercase letters</li>
                <li>✔️ Numbers</li>
                <li>✔️ Symbols</li>
            </ul>
        `;
    } else {
        passwordStrengthMessage.textContent = "";
    }
});


// Listen for input on Confirm Password field to check matching
confirmPasswordInput.addEventListener('input', () => {
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (newPassword === confirmPassword) {
        validationMessage.textContent = ''; // Clear mismatch message
    } else {
        validationMessage.textContent = 'New password and confirm password do not match.';
    }

    checkFormValidity();
});

// Enable New Password and Confirm Password fields
function enableInputs() {
    newPasswordInput.disabled = false;
    newPasswordInput.classList.remove('disabled-input');
    confirmPasswordInput.disabled = false;
    confirmPasswordInput.classList.remove('disabled-input');
}

// Disable New Password and Confirm Password fields
function disableInputs() {
    newPasswordInput.disabled = true;
    newPasswordInput.classList.add('disabled-input');
    confirmPasswordInput.disabled = true;
    confirmPasswordInput.classList.add('disabled-input');
}

// Check the validity of the form and enable the submit button if valid
function checkFormValidity() {
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const isPasswordValid = evaluatePasswordStrength(newPassword) === 'Strong' && newPassword.length >= 8;

    if (isOldPasswordValid && newPassword === confirmPassword && isPasswordValid) {
        submitButton.disabled = false;
        validationMessage.textContent = '';
    } else {
        submitButton.disabled = true;

        if (!isPasswordValid) {
            validationMessage.textContent = 'Ensure your password is strong and meets all criteria.';
        } else if (newPassword !== confirmPassword) {
            validationMessage.textContent = 'New password and confirm password do not match.';
        }
    }
}

// Evaluate password strength
function evaluatePasswordStrength(password) {
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);

    const strengthCount = [hasNumber, hasSymbol, hasLower, hasUpper].filter(Boolean).length;

    if (strengthCount === 4 && password.length >= 8) return 'Strong';
    if (strengthCount >= 3) return 'Medium';
    if (strengthCount >= 1) return 'Weak';
    return '';
}

document.getElementById('passwordForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Show the toast message
    const toastElement = document.getElementById('orgprofilepasschangeit');
    if (toastElement) {
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
    } else {
        orgProfilepassChangit.textContent = 'You Have some Error in Processing!';
    }

    // Close the modal
    const modalElement = document.getElementById('organizationProfilePasswordUpdate');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        } else {
            orgProfilepassChangit.textContent = 'You Have some Error in Processing!';
        }
    }
});




// Simulated server-side check for old password
async function fakeServerCheck(password) {
    /**
     * Manual old password for testing purposes.
     * Replace this with an API call to your server in production.
     */
    const oldPasswordMock = 'arefAREF351@'; // <--- MANUAL OLD PASSWORD IS SET HERE

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ isValid: password === oldPasswordMock });
        }, 1000); // Simulate server delay (1 second)
    });
}