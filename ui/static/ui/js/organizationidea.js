document.addEventListener("DOMContentLoaded", function () {
  // Find the form
  const form = document.getElementById("orgIdeaForm");
  if (!form) {
    console.error("The form with ID 'orgIdeaForm' was not found.");
    return;
  }

  // Collect input fields
  const fields = {
    orgIdeaOrganizationName: document.getElementById("orgIdeaOrganizationName"),
    orgIdeaResponsiblePerson: document.getElementById(
      "orgIdeaResponsiblePerson"
    ),
    orgIdeaOfficialEmail: document.getElementById("orgIdeaOfficialEmail"),
    orgIdeaContactNumber1: document.getElementById("orgIdeaContactNumber1"),
    orgIdeaContactNumber2: document.getElementById("orgIdeaContactNumber2"),
    orgIdeaExpertiseArea: document.getElementById("orgIdeaExpertiseArea"),
    orgIdeaCountry: document.getElementById("orgIdeaCountry"),
    orgIdeaRecommendation: document.getElementById("orgIdeaRecommendation"),
  };

  // Validation functions
  const validateText = (text) => /^[a-zA-Z\s]+$/.test(text);
  const validateRestrictedChars = (text) =>
    !/['"\\/=\-)(}{><\$%\^&\*\!~,\[\]]/.test(text);
  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gov|edu|org|com|net|mil|int|[a-zA-Z]{2,})$/;
    const restrictedDomains = [
    //   "gmail.com",
    //   "yahoo.com",
    //   "hotmail.com",
    //   "outlook.com",
    ];
    if (!emailRegex.test(email)) return false;
    const domain = email.split("@")[1];
    return !restrictedDomains.includes(domain);
  };
  const validateNumber = (number) => /^\d{10,15}$/.test(number);
  const validateIdeaLength = (text) => text.length >= 10;
  const hasInvalidChars = (text) =>
    /(<|>|--|\/\*|\*\/|;|select|union|insert|delete|update|drop|where)/i.test(
      text
    );

  // Show/hide validation feedback icons
  const toggleValidationFeedback = (input, isValid) => {
    const feedbackIcon = input
      .closest(".form-floating")
      .querySelector(".valid-feedback-icon");
    const invalidFeedback = input
      .closest(".form-floating")
      .querySelector(".invalid-feedback");

    if (isValid) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      if (feedbackIcon) feedbackIcon.classList.remove("d-none");
      if (invalidFeedback) invalidFeedback.classList.add("d-none");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (feedbackIcon) feedbackIcon.classList.add("d-none");
      if (invalidFeedback) invalidFeedback.classList.remove("d-none");
    }
  };

  // Restrict non-numeric input for contact number fields
  const restrictToNumbers = (event) => {
    const charCode = event.which || event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  // Apply restriction to contact number fields
  if (fields.orgIdeaContactNumber1) {
    fields.orgIdeaContactNumber1.addEventListener(
      "keypress",
      restrictToNumbers
    );
  }
  if (fields.orgIdeaContactNumber2) {
    fields.orgIdeaContactNumber2.addEventListener(
      "keypress",
      restrictToNumbers
    );
  }

  // Real-time validation for all fields
  Object.entries(fields).forEach(([fieldName, fieldElement]) => {
    if (!fieldElement) {
      console.warn(`Field ${fieldName} not found.`);
      return;
    }

    fieldElement.addEventListener("input", () => {
      let isValid = true;

      switch (fieldName) {
        case "orgIdeaOrganizationName":
        case "orgIdeaResponsiblePerson":
          isValid =
            validateText(fieldElement.value) &&
            validateRestrictedChars(fieldElement.value);
          break;
        case "orgIdeaOfficialEmail":
          isValid = validateEmail(fieldElement.value);
          break;
        case "orgIdeaContactNumber1":
        case "orgIdeaContactNumber2":
          isValid = validateNumber(fieldElement.value);
          break;
        case "orgIdeaExpertiseArea":
          isValid =
            fieldElement.value.trim() !== "" &&
            !hasInvalidChars(fieldElement.value) &&
            validateRestrictedChars(fieldElement.value);
          break;
        case "orgIdeaCountry":
          isValid = !!fieldElement.value;
          break;
        case "orgIdeaRecommendation":
          isValid =
            validateIdeaLength(fieldElement.value) &&
            !hasInvalidChars(fieldElement.value) &&
            validateRestrictedChars(fieldElement.value);
          break;
      }

      toggleValidationFeedback(fieldElement, isValid);
    });
  });

  // Form submission validation
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    Object.entries(fields).forEach(([fieldName, fieldElement]) => {
      if (!fieldElement) return;
      let fieldIsValid = true;

      switch (fieldName) {
        case "orgIdeaOrganizationName":
        case "orgIdeaResponsiblePerson":
          fieldIsValid =
            validateText(fieldElement.value) &&
            validateRestrictedChars(fieldElement.value);
          break;
        case "orgIdeaOfficialEmail":
          fieldIsValid = validateEmail(fieldElement.value);
          break;
        case "orgIdeaContactNumber1":
        case "orgIdeaContactNumber2":
          fieldIsValid = validateNumber(fieldElement.value);
          break;
        case "orgIdeaExpertiseArea":
          fieldIsValid =
            fieldElement.value.trim() !== "" &&
            !hasInvalidChars(fieldElement.value) &&
            validateRestrictedChars(fieldElement.value);
          break;
        case "orgIdeaCountry":
          fieldIsValid = !!fieldElement.value;
          break;
        case "orgIdeaRecommendation":
          fieldIsValid =
            validateIdeaLength(fieldElement.value) &&
            !hasInvalidChars(fieldElement.value) &&
            validateRestrictedChars(fieldElement.value);
          break;
      }

      if (!fieldIsValid) isValid = false;
      toggleValidationFeedback(fieldElement, fieldIsValid);
    });

    if (isValid) {
      // Close Bootstrap Modal
      const modalElement = document.getElementById("organizationModal");
      if (modalElement) {
        const modalInstance =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);
        modalInstance.hide();
      }

      fetch("api/feedbacks/organization-ideas/", {
        method: "post",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(fields),
      }).then((res) => console.log(res));

      // Show Bootstrap Toast for success message
      const successToast = document.getElementById("organizationSuccessToast");
      if (successToast) {
        const toast = new bootstrap.Toast(successToast);
        toast.show();
      }

      form.reset();
      document
        .querySelectorAll(".valid-feedback-icon")
        .forEach((icon) => icon.classList.add("d-none"));
      document
        .querySelectorAll(".is-valid")
        .forEach((input) => input.classList.remove("is-valid"));
    } else {
      const warningTitle = document.getElementById("orgIdeaWarningTitle");
      const warningText = document.getElementById("orgIdeaWarningText");

      if (warningTitle) warningTitle.textContent = "Warning!";
      if (warningText)
        warningText.textContent =
          "Please fill in all required fields and ensure your input does not include invalid or restricted characters.";
    }
  });
});
