document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");
    const submitBtn = document.querySelector(".offcanvas-footer button[type='submit']"); // دکمه سبمیت در فوتر

    // Input fields
    const fullNameInput = document.getElementById("updateFullname");
    const emailInput = document.getElementById("updateEmail");
    const phoneInput = document.getElementById("updatePhone");
    const countryInput = document.getElementById("updateCountry");

    // Validation function for each field
    const validate = (input, errorId, validationFn, errorMessage) => {
        const errorElement = document.getElementById(errorId);
        if (!validationFn(input.value)) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = "block";
            input.classList.add("is-invalid");
            return false;
        } else {
            errorElement.style.display = "none";
            input.classList.remove("is-invalid");
            return true;
        }
    };

    // Full Name validation
    fullNameInput.addEventListener("input", (e) => {
        validate(e.target, "errorUpdateFullname", (value) => /^[a-zA-Z\s-]+$/.test(value), "Full name can only contain letters, spaces, and hyphens.");
    });

    // Email validation
    emailInput.addEventListener("input", (e) => {
        validate(e.target, "errorUpdateEmail", (value) => /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value), "Enter a valid email address.");
    });

    // Phone validation
    phoneInput.addEventListener("input", (e) => {
        validate(e.target, "errorUpdatePhone", (value) => /^[0-9]+$/.test(value), "Enter a valid phone number.");
    });

    // Country validation
    countryInput.addEventListener("change", (e) => {
        validate(e.target, "errorUpdateCountry", (value) => value !== "", "Please select a country.");
    });

    // Form submit validation
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission

        const isFullNameValid = validate(fullNameInput, "errorUpdateFullname", (value) => /^[a-zA-Z\s-]+$/.test(value), "Full name can only contain letters, spaces, and hyphens.");
        const isEmailValid = validate(emailInput, "errorUpdateEmail", (value) => /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value), "Enter a valid email address.");
        const isPhoneValid = validate(phoneInput, "errorUpdatePhone", (value) => /^[0-9]+$/.test(value), "Enter a valid phone number.");
        const isCountryValid = validate(countryInput, "errorUpdateCountry", (value) => value !== "", "Please select a country.");

        const textWarning = document.getElementById("textWarning"); // متن هشدار

        if (isFullNameValid && isEmailValid && isPhoneValid && isCountryValid) {
            // Show success Toast
            const toastEl = new bootstrap.Toast(document.getElementById('toastindvisialProfileUpdate'));
            toastEl.show();

            // Reset the form
            form.reset();

            // Automatically hide the toast after 10 seconds
            setTimeout(() => {
                toastEl.hide();
            }, 10000);

            // Close the offcanvas
            const offcanvasEl = document.getElementById('profileOffcanvas');
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            offcanvas.hide(); // Close offcanvas after successful form submission
        } else {
            textWarning.textContent = "Please fill in all required fields as your profile will not be valid without this information. This helps us keep your profile secure.";
        }
    });
});
