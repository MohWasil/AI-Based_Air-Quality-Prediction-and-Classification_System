document.getElementById("sendButton").addEventListener("click", function () {
    const emailField = document.getElementById("emailInput");
    const emailError = document.getElementById("emailError");

    const email = emailField.value.trim();

    // Regular Expression for valid email structure
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // List of SQL Injection keywords and characters to block
    const sqlKeywords = [
        "SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "CREATE", "ALTER",
        "WHERE", "OR", "AND", "LIKE", "--", ";", "'", "\"", "/*", "*/", "@@",
        "CHAR(", "NCHAR(", "VARCHAR(", "NVARCHAR(", "EXEC", "EXECUTE",
        "UNION", "NULL", "CAST(", "CONVERT("
    ];

    // Check if email contains invalid SQL injection attempts
    const containsSQLInjection = sqlKeywords.some((keyword) =>
        email.toUpperCase().includes(keyword)
    );

    // Validate Email Format
    if (!emailRegex.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailField.focus();
        return;
    }

    // Block SQL Injection Attempts
    if (containsSQLInjection) {
        emailError.textContent = "Email contains invalid characters or SQL keywords!";
        emailField.focus();
        return;
    }
    
    // If everything is valid, show success toast and close modal
    emailError.textContent = ""; // Clear error message
    const toastElement = document.getElementById("forgetPassToast");

    // Show the success toast
    if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        // Redirect to index.html after a short delay (e.g., 2 seconds)
        setTimeout(() => {
            window.location.href = "/login";
        }, 5000); // 2000ms = 2 seconds
    }

    // Close the modal after successful submission
    const modal = bootstrap.Modal.getInstance(document.getElementById("forgetPass"));
    modal.hide();

    // Optionally, show a confirmation in the console for testing
    // console.log("Email sent successfully!");
});
