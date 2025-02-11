document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/accounts/organizational-users/id").then((res) => {
    if (res.status == 200) {
      res.json().then((data) => {
        
        document.getElementById("organizationName").value = data.organization_name;
        document.getElementById("organizationPhone").value = data.phone;
        document.getElementById("organizationEmail").value = data.user.email;
        document.getElementById("organizationAddress").value = data.address;
        document.getElementById("organizationActivity").value = data.activity;
        document.getElementById("organizationCountry").value = data.country;
      });
    } else {
      console.error("Couldn't get information");
    }
  });

  const form = document.getElementById("updateProfileOrganization");
  const inputs = form.querySelectorAll("input, textarea, select");

  // Validation Functions
  const validateText = (text) => /^[a-zA-Z\s]+$/.test(text);
  const validateRestrictedChars = (text) =>
    !/['"\\/=\-)(}{><\$%\^&\*\!~,\[\]]/.test(text);
  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gov|edu|org|com|net|mil|int|[a-zA-Z]{2,})$/;
    const restrictedDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];
    if (!emailRegex.test(email)) return false;
    const domain = email.split("@")[1];
    return !restrictedDomains.includes(domain);
  };

  const lockNumericInput = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const showValidationIcon = (input, isValid) => {
    const iconClass = isValid
      ? "bi bi-check-circle-fill text-success"
      : "bi bi-exclamation-circle-fill text-danger";

    let icon = input.nextElementSibling;

    if (!icon || !icon.classList.contains("validation-icon")) {
      icon = document.createElement("i");
      icon.classList.add("validation-icon", "ms-2");
      input.insertAdjacentElement("afterend", icon);
    }

    icon.className = `validation-icon ${iconClass}`;
  };

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      let isValid = true;

      if (input.type === "text") {
        if (
          !validateText(input.value) ||
          !validateRestrictedChars(input.value)
        ) {
          isValid = false;
        }
      }

      if (input.type === "email") {
        if (!validateEmail(input.value)) {
          isValid = false;
        }
      }

      if (input.type === "tel") {
        if (input.value && !/^\d{10,15}$/.test(input.value)) {
          isValid = false;
        }
      }

      if (input.type === "textarea") {
        if (input.value.length < 10) {
          isValid = false;
        }
      }

      showValidationIcon(input, isValid);
      input.classList.toggle("is-valid", isValid);
      input.classList.toggle("is-invalid", !isValid);
    });

    if (input.type === "tel") {
      input.addEventListener("keypress", lockNumericInput);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isFormValid = true;

    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        input.classList.add("is-invalid");
        showValidationIcon(input, false);
        isFormValid = false;
      }
    });

    if (isFormValid) {
      const offcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById("organizationProfile")
      );
      if (offcanvas) offcanvas.hide();

      // Show toast for success using your method
      const successToast = document.getElementById("toastProfileUpdate");
      const toast = new bootstrap.Toast(successToast);
      toast.show(); // Display Toast

      form.reset();
      form.querySelectorAll(".is-valid, .is-invalid").forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
        const icon = input.nextElementSibling;
        if (icon && icon.classList.contains("validation-icon")) {
          icon.remove();
        }
      });
    }
  });
});
