document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("organizationRegForm");
  const submitBtn = document.getElementById("submitBtn");

  // Input fields
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password"); // Password field
  const confirmPasswordInput = document.getElementById("confirmPassword"); // Confirm Password field
  const organizationName = document.getElementById("organizationName");
  const organizationAddress = document.getElementById("organizationLocation");
  const activity = document.getElementById("activityType");
  const country = document.getElementById("country");

  // Full name: only letters, spaces, and hyphens
  fullNameInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s-]/g, "");
  });

  // Phone number: only numbers
  phoneInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });

  // Password validation
  passwordInput.addEventListener("input", (e) => {
    const password = e.target.value;
    const errorPassword = document.getElementById("errorPassword");

    // Check if password is empty
    if (password.trim() === "") {
      errorPassword.textContent = "Password cannot be empty.";
      errorPassword.style.display = "block";
      e.target.classList.add("is-invalid");
    }
    // Check if password length is less than 8 characters
    else if (password.length < 8) {
      errorPassword.textContent = "Password must be at least 8 characters.";
      errorPassword.style.display = "block";
      e.target.classList.add("is-invalid");
    }
    // Check for invalid characters (allow letters, numbers, and special characters like @, #, $, etc.)
    else if (!/^[a-zA-Z0-9@#$%^&+=!]*$/.test(password)) {
      errorPassword.textContent =
        "Password contains invalid characters. Only letters, numbers, and special characters (@, #, $, %, ^, &, +, =, !) are allowed.";
      errorPassword.style.display = "block";
      e.target.classList.add("is-invalid");
    } else {
      errorPassword.style.display = "none";
      e.target.classList.remove("is-invalid");
    }
  });

  // Confirm password validation
  confirmPasswordInput.addEventListener("input", (e) => {
    const confirmPassword = e.target.value;
    const errorConfirmPassword = document.getElementById(
      "errorConfirmPassword"
    );

    // Check if confirm password is empty
    if (confirmPassword.trim() === "") {
      errorConfirmPassword.textContent = "Confirm password cannot be empty.";
      errorConfirmPassword.style.display = "block";
      e.target.classList.add("is-invalid");
    }
    // Check if the confirm password matches the password
    else if (confirmPassword !== passwordInput.value) {
      errorConfirmPassword.textContent = "Passwords do not match.";
      errorConfirmPassword.style.display = "block";
      e.target.classList.add("is-invalid");
    } else {
      errorConfirmPassword.style.display = "none";
      e.target.classList.remove("is-invalid");
    }
  });

  // Validation on submit
  submitBtn.addEventListener("click", () => {
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
          const emailRegex =
            /^[^\s@]+@([a-zA-Z0-9-]+\.)?(gov|edu|org|com|net|mil|int|info|af|ir|pk|us|uk|ca|au|eu)\b/i;
          const restrictedRegex =
            /^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com |info@ |contact@army.mil.us |registrar@college.ac.uk \.edu.in)$/i;
          return emailRegex.test(value) && !restrictedRegex.test(value);
        },
        message:
          "Enter a valid official email address (personal emails like Gmail, Yahoo, or Hotmail are not allowed).",
      },
      {
        id: "phone",
        errorId: "errorPhone",
        validation: (value) => /^\d{10,15}$/.test(value.trim()),
        message: "Phone number is required.",
      },
      {
        id: "organizationName",
        errorId: "errorOrganizationName",
        validation: (value) => value.trim() !== "",
        message: "Organization name is required.",
      },
      {
        id: "organizationLocation",
        errorId: "errorOrganizationLocation",
        validation: (value) => value.trim() !== "",
        message: "Organization location is required.",
      },
      {
        id: "activityType",
        errorId: "errorActivityType",
        validation: (value) => value.trim() !== "",
        message: "Activity type is required.",
      },
      {
        id: "country",
        errorId: "errorCountry",
        validation: (value) => value !== "",
        message: "Country selection is required.",
      },
      {
        id: "password",
        errorId: "errorPassword",
        validation: (value) => value !== "",
        message: "You Must Type Password.",
      },
      {
        id: "confirmPassword",
        errorId: "errorConfirmPassword",
        validation: (value) => value !== "",
        message: "Please Type Confirm Password.",
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
        organization_name: organizationName.value,
        address: organizationAddress.value,
        activity: activity.value,
        country: country.value,
        user: {
          email: emailInput.value,
          password: passwordInput.value,
        },
      };
      fetch("/api/accounts/organizational-users/", {
        method: "post",
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": document.querySelector("meta[name='csrf-token']").getAttribute("content")
        },
        body: JSON.stringify(inputs),
      })
        .then((res) => {
          if (res.status == 201) {
            form.reset();
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          } else {
            alert("Invalid Field Values");
            location.reload()
          }
          res.json().then(val => {
            console.log(val);
          })
        })
        .catch((error) => console.error(error));
    }
  });
});
