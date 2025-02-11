document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const submitBtn = document.getElementById("submitBtn");

  // Input fields
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const countryInput = document.getElementById("country"); // Country field
  const genderInput = document.getElementById("gendertype"); // Gender field

  // Password strength feedback elements
  const passwordStrength = document.getElementById("passwordStrength");
  const passwordChecklist = document.getElementById("passwordChecklist");

  // Full name: only letters, spaces, and hyphens
  fullNameInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s-]/g, "");
    hideError("fullName", "errorFullName");
  });

  // Phone number: only numbers
  phoneInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    hideError("phone", "errorPhone");
  });

  // Password validation with strength
  passwordInput.addEventListener("input", (e) => {
    const password = e.target.value;

    // Password strength criteria
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[@#$%^&+=!]/.test(password);
    const hasDot = /\./.test(password);
    const isLongEnough = password.length >= 8;

    // Update checklist
    passwordChecklist.innerHTML = `
            <li class="${
              hasUpperCase ? "text-success" : "text-danger"
            }">Uppercase Letter ${
      hasUpperCase
        ? '<i class="bi bi-check-circle-fill"></i>'
        : '<i class="bi bi-x-circle-fill"></i>'
    }</li>
            <li class="${
              hasLowerCase ? "text-success" : "text-danger"
            }">Lowercase Letter ${
      hasLowerCase
        ? '<i class="bi bi-check-circle-fill"></i>'
        : '<i class="bi bi-x-circle-fill"></i>'
    }</li>
            <li class="${hasNumber ? "text-success" : "text-danger"}">Number ${
      hasNumber
        ? '<i class="bi bi-check-circle-fill"></i>'
        : '<i class="bi bi-x-circle-fill"></i>'
    }</li>
            <li class="${
              hasSymbol ? "text-success" : "text-danger"
            }">Special Character (@#$%^&+=!) ${
      hasSymbol
        ? '<i class="bi bi-check-circle-fill"></i>'
        : '<i class="bi bi-x-circle-fill"></i>'
    }</li>
            <li class="${hasDot ? "text-success" : "text-danger"}">Dot (.) ${
      hasDot
        ? '<i class="bi bi-check-circle-fill"></i>'
        : '<i class="bi bi-x-circle-fill"></i>'
    }</li>
            <li class="${
              isLongEnough ? "text-success" : "text-danger"
            }">At least 8 characters ${
      isLongEnough
        ? '<i class="bi bi-check-circle-fill"></i>'
        : '<i class="bi bi-x-circle-fill"></i>'
    }</li>
        `;

    // Determine strength
    const fulfilledCriteria = [
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSymbol,
      hasDot,
      isLongEnough,
    ].filter(Boolean).length;

    if (password.trim() === "") {
      passwordStrength.textContent = "Password cannot be empty.";
      passwordStrength.className = "text-danger";
      e.target.classList.add("is-invalid");
    } else if (fulfilledCriteria <= 3) {
      passwordStrength.textContent = "Weak password.";
      passwordStrength.className = "text-danger";
      e.target.classList.add("is-invalid");
    } else if (fulfilledCriteria <= 5) {
      passwordStrength.textContent = "Medium strength password.";
      passwordStrength.className = "text-warning";
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    } else {
      passwordStrength.textContent = "Strong password!";
      passwordStrength.className = "text-success";
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }

    hideError("password", "errorPassword");
  });

  // Confirm password validation
  confirmPasswordInput.addEventListener("input", (e) => {
    const confirmPassword = e.target.value;

    if (confirmPassword === passwordInput.value) {
      hideError("confirmPassword", "errorConfirmPassword");
    }
  });

  // Country validation
  countryInput.addEventListener("input", () => {
    hideError("country", "errorCountry");
  });

  // Gender validation
  genderInput.addEventListener("input", () => {
    hideError("gendertype", "errorGender");
  });

  // Utility to hide error
  function hideError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input.value.trim() !== "") {
      error.style.display = "none";
      input.classList.remove("is-invalid");
    }
  }

  // Validation on submit
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let isValid = true;

    const fields = [
      {
        id: "fullName",
        errorId: "errorFullName",
        validation: (value) => /^[a-zA-Z\s-]+$/.test(value),
        message: "Full name can only contain letters, spaces, and hyphens.",
      },
      {
        id: "email",
        errorId: "errorEmail",
        validation: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Enter a valid email address.",
      },
      {
        id: "phone",
        errorId: "errorPhone",
        validation: (value) => /^\d{10,15}$/.test(value.trim()),
        message: "Phone number Must be 10-15 digits and contain only numbers.",
      },
      {
        id: "password",
        errorId: "errorPassword",
        validation: (value) => value.length >= 8,
        message: "Password must be at least 8 characters.",
      },
      {
        id: "confirmPassword",
        errorId: "errorConfirmPassword",
        validation: (value) => value === passwordInput.value,
        message: "Passwords do not match.",
      },
      {
        id: "country",
        errorId: "errorCountry",
        validation: (value) => value.trim() !== "",
        message: "Country is required.",
      },
      {
        id: "gendertype",
        errorId: "errorGender",
        validation: (value) => value.trim() !== "",
        message: "Gender is required.",
      },
    ];

    fields.forEach(({ id, errorId, validation, message }) => {
      const input = document.getElementById(id);
      const error = document.getElementById(errorId);

      if (!validation(input.value)) {
        error.textContent = message;
        error.style.display = "block";
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        error.style.display = "none";
        input.classList.remove("is-invalid");
      }
    });

    // Terms and Conditions validation
    const termsCheckbox = document.getElementById("termsCheckbox");
    const errorTerms = document.getElementById("errorTerms");

    if (!termsCheckbox.checked) {
      errorTerms.textContent = "You must agree to the terms and conditions.";
      errorTerms.style.display = "block";
      termsCheckbox.classList.add("is-invalid");
      isValid = false;
    } else {
      errorTerms.style.display = "none";
      termsCheckbox.classList.remove("is-invalid");
    }

    if (isValid) {
      const inputs = {
        full_name: fullNameInput.value,
        phone: phoneInput.value,
        country: countryInput.value,
        gender: genderInput.value,
        user: {
          email: emailInput.value,
          password: passwordInput.value,
        },
      };
      fetch("/api/accounts/individual-users/", {
        method: "post",
        headers: {
          'content-type': 'application/json',
          "X-CSRFToken": document.querySelector("meta[name='csrf-token']").getAttribute("content")
        },
        body: JSON.stringify(inputs),
      }).then((res) => {
        const toast = document.getElementById("individualCreateUser");
        const toastMessage = toast.getElementsByClassName("toast-body")[0]

        const toastElement = new bootstrap.Toast(toast);
        if (res.status == 201) {
          toastMessage.innerHTML = "User Created Successfully"
          form.reset();
          passwordStrength.textContent = "";
          passwordChecklist.innerHTML = "";
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          toastMessage.innerHTML = "Invalid Field Values"
          setTimeout(() => {
            location.reload()
          }, 4000);
        }
        res.json().then(val => {
          console.log(val);
        })
        toastElement.show();
      }).catch(error => console.error(error));
    }
  });
});
