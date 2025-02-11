function getCSRFToken() {
  return document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent actual form submission

  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");

  const emailErrorAlert = document.getElementById("emailError"); // Add this ID in your HTML
  const passwordErrorAlert = document.getElementById("passwordError"); // Add this ID in your HTML

  const email = emailField.value.trim();
  const password = passwordField.value;

  // Regular Expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // List of SQL Injection keywords and characters
  const sqlKeywords = [
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "CREATE",
    "ALTER",
    "WHERE",
    "OR",
    "AND",
    "LIKE",
    "--",
    ";",
    "'",
    '"',
    "/*",
    "*/",
    "@@",
    "CHAR(",
    "NCHAR(",
    "VARCHAR(",
    "NVARCHAR(",
    "EXEC",
    "EXECUTE",
    "UNION",
    "NULL",
    "CAST(",
    "CONVERT(",
  ];

  // Check for SQL keywords in the email
  const containsSQLInjection = sqlKeywords.some((keyword) =>
    email.toUpperCase().includes(keyword)
  );

  // Validate Email
  if (!emailRegex.test(email)) {
    emailErrorAlert.textContent = "Please enter a valid email address.";
    emailField.focus();
    return;
  }

  // Block SQL Injection attempts in Email
  if (containsSQLInjection) {
    emailErrorAlert.textContent =
      "Email contains invalid characters or SQL keywords!";
    emailField.focus();
    return;
  }

  // Password Validation: Minimum 8 characters
  if (password.length < 8) {
    passwordErrorAlert.textContent =
      "Password must be at least 8 characters long.";
    passwordField.focus();
    return;
  }

  fetch("/api/accounts/login/", {
    method: "post",
    headers: {
      "content-type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify({ email: email, password: password }),
  }).then((res) => {
    // login successful
    const toastElement = document.getElementById("loginToast");
    const toastBody = toastElement.getElementsByClassName("toast-body")[0];
    const toast = new bootstrap.Toast(toastElement);
    if (res.status == 200) {
      console.log("Success");
      toastBody.innerHTML = "You Successfully Logged in";
      if (toastElement) {
        // Ensure the element exists
        toast.show();

        // Redirect to index.html after a short delay (e.g., 2 seconds)
      } else {
        console.error("Toast element with ID 'loginToast' not found.");
      }
      res.json().then(val => {
        var next;
        switch (val.user_type) {
          case "individual":
            next = "/individual-use"
            break;
          case "organization":
            next = "/organization-use"
            break;
          default:
            next = "/"
        }
        setTimeout(() => {
          window.location.href = next;
        }, 1000); // 2000ms = 2 seconds

      })
    }
    // login failed
    else {
      console.log("Failure");
      toastBody.innerHTML = "Invalid Username or password";
      toast.show();
      setTimeout(() => {
        location.reload()
      }, 3500);
    }
  });

  // Show Toast on Successful Validation
});
