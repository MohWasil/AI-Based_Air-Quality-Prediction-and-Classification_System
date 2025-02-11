document
  .getElementById("ideaForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Collecting input fields and values
    const form = event.target;
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const contactNumber = document.getElementById("contactNumber");
    const expertise = document.getElementById("expertise");
    const country = document.getElementById("country");
    const idea = document.getElementById("idea");

    // Validation functions
    const validateText = (text) => /^[a-zA-Z\s]+$/.test(text); // Letters and spaces only
    const validateEmail = (email) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email); // Email format
    const validateNumber = (number) => /^\d{10,15}$/.test(number); // 10-15 digits
    const validateNoSpecialChars = (text) =>
      !/[*+=<>\[\]{}!@#$%^&()_~`'";\\/|]/.test(text); // Prevent malicious characters
    const validateIdeaLength = (text) => text.length >= 10; // Minimum 10 characters

    let isValid = true; // Tracks form validity

    // Real-time validation for each field
    fullName.addEventListener("input", function () {
      if (validateText(fullName.value)) {
        fullName.classList.add("is-valid");
        fullName.classList.remove("is-invalid");
        document.getElementById("fullNameCheck").classList.remove("d-none");
      } else {
        fullName.classList.add("is-invalid");
        fullName.classList.remove("is-valid");
        document.getElementById("fullNameCheck").classList.add("d-none");
      }
    });

    email.addEventListener("input", function () {
      if (validateEmail(email.value)) {
        email.classList.add("is-valid");
        email.classList.remove("is-invalid");
        document.getElementById("emailCheck").classList.remove("d-none");
      } else {
        email.classList.add("is-invalid");
        email.classList.remove("is-valid");
        document.getElementById("emailCheck").classList.add("d-none");
      }
    });

    contactNumber.addEventListener("input", function () {
      if (validateNumber(contactNumber.value)) {
        contactNumber.classList.add("is-valid");
        contactNumber.classList.remove("is-invalid");
        document
          .getElementById("contactNumberCheck")
          .classList.remove("d-none");
      } else {
        contactNumber.classList.add("is-invalid");
        contactNumber.classList.remove("is-valid");
        document.getElementById("contactNumberCheck").classList.add("d-none");
      }
    });

    expertise.addEventListener("input", function () {
      if (
        validateText(expertise.value) &&
        validateNoSpecialChars(expertise.value)
      ) {
        expertise.classList.add("is-valid");
        expertise.classList.remove("is-invalid");
        document.getElementById("expertiseCheck").classList.remove("d-none");
      } else {
        expertise.classList.add("is-invalid");
        expertise.classList.remove("is-valid");
        document.getElementById("expertiseCheck").classList.add("d-none");
      }
    });

    country.addEventListener("change", function () {
      if (country.value) {
        country.classList.add("is-valid");
        country.classList.remove("is-invalid");
        document.getElementById("countryCheck").classList.remove("d-none");
      } else {
        country.classList.add("is-invalid");
        country.classList.remove("is-valid");
        document.getElementById("countryCheck").classList.add("d-none");
      }
    });

    idea.addEventListener("input", function () {
      if (
        validateNoSpecialChars(idea.value) &&
        validateIdeaLength(idea.value)
      ) {
        idea.classList.add("is-valid");
        idea.classList.remove("is-invalid");
        document.getElementById("ideaCheck").classList.remove("d-none");
      } else {
        idea.classList.add("is-invalid");
        idea.classList.remove("is-valid");
        document.getElementById("ideaCheck").classList.add("d-none");
      }
    });

    // Check form validity before submitting
    if (
      validateText(fullName.value) &&
      validateEmail(email.value) &&
      validateNumber(contactNumber.value) &&
      validateText(expertise.value) &&
      validateNoSpecialChars(expertise.value) &&
      country.value &&
      validateNoSpecialChars(idea.value) &&
      validateIdeaLength(idea.value)
    ) {
      isValid = true;
    } else {
      isValid = false;
    }

    // Submit handler
    if (isValid) {
      const ideaToast = new bootstrap.Toast(
        document.getElementById("ideaToast")
      );
      form.reset();
      const ideaModal = bootstrap.Modal.getInstance(
        document.getElementById("ideaModal")
      );
      ideaModal.hide(); // Close the modal after the toast is shown

      const body = {
        fullName: fullName,
        email: email,
        contactNumber: contactNumber,
        expertise: expertise,
        country: country,
        idea: idea,
      };
      fetch("/api/feedbacks/individual-ideas/", {
        method: "post",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(body),
      }).then((res) => console.log(res));
      ideaToast.show();
    } else {
      titlewarning.textContent = "Warning!";
      textWarningidea.textContent =
        "Please fill in all required fields and provide accurate information, as we respect your ideas and opinions and strive to provide what citizens and people have in mind.";
    }
  });
