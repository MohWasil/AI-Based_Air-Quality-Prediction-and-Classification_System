document.addEventListener("DOMContentLoaded", function () {
  const fullname = document.getElementById("fullname");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  const adminSection = document.getElementById("admin-section");
  const gender = document.getElementById("gender");
  const username = document.getElementById("userName");
  const alertText = document.getElementById("crurrectTextAlert");
  const phone = document.getElementById("phone");

  // Live validation for Full Name
  fullname.addEventListener("input", function () {
    const errorElement = document.getElementById("fullname-error");
    if (!/^[a-zA-Z\s]+$/.test(fullname.value)) {
      errorElement.textContent = "Only letters and spaces are allowed.";
    } else {
      errorElement.textContent = "";
    }
  });

  // Live validation for Email
  email.addEventListener("input", function () {
    const errorElement = document.getElementById("email-error");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      errorElement.textContent = "Invalid email address.";
    } else {
      errorElement.textContent = "";
    }
  });

  // Live validation for Password
  password.addEventListener("input", function () {
    const errorElement = document.getElementById("password-error");
    if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/.test(
        password.value
      )
    ) {
      errorElement.textContent =
        "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols.";
    } else {
      errorElement.textContent = "";
    }
  });

  // Live validation for Confirm Password
  confirmPassword.addEventListener("input", function () {
    const errorElement = document.getElementById("confirm-password-error");
    if (password.value !== confirmPassword.value) {
      errorElement.textContent = "Passwords do not match.";
    } else {
      errorElement.textContent = "Passwords match!";
      errorElement.style.color = "green";
    }
  });

  // Live validation for Username
  username.addEventListener("input", function () {
    const errorElement = document.getElementById("username-error");
    if (!/^[a-zA-Z0-9]+$/.test(username.value)) {
      errorElement.textContent =
        "Username can only include letters and numbers.";
    } else {
      errorElement.textContent = "";
    }
  });

  // Form submission validation
  document
    .getElementById("registrationForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      let errors = {};
      let isValid = true;

      // Final validation for all inputs
      if (!/^[a-zA-Z\s]+$/.test(fullname.value)) {
        errors.fullname = "Only letters and spaces are allowed.";
        isValid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = "Invalid email address.";
        isValid = false;
      }
      if (
        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/.test(
          password.value
        )
      ) {
        errors.password =
          "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols.";
        isValid = false;
      }
      if (password.value !== confirmPassword.value) {
        errors.confirmPassword = "Passwords do not match.";
        alertText.style.color = "green";
        isValid = false;
      }
      if (!/^[a-zA-Z0-9]+$/.test(username.value)) {
        errors.username = "Username can only include letters and numbers.";
        isValid = false;
      }

      // Clear error messages
      document
        .querySelectorAll(".error-message")
        .forEach((el) => (el.textContent = ""));

      // Display error messages
      for (let key in errors) {
        document.getElementById(`${key}-error`).textContent = errors[key];
      }

      // Show success message if valid
      if (isValid) {
        fetch("/api/accounts/admin-users/", {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            full_name: fullname.value,
            gender: gender.value,
            username: username.value,
            phone: phone.value,
            user: {
              email: email.value,
              password: password.value,
            },
          }),
        })
          .then((res) => {
            if (res.status==201) {
                alertText.textContent = "Successfully Created User.";
                alertText.style.color = "green";

            }
          })
          .catch((errors) => {
              console.error(errors)
              alertText.textContent = "An Error Occured" + errors;
              alertText.style.color = "red";
          });
      } else {
        console.log("Not Valid Data")
      }
    });
});
