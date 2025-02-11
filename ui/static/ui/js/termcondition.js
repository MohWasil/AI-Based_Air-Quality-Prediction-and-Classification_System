document.getElementById("termsForm").addEventListener("submit", function (event) {
    const checkboxes = document.querySelectorAll(".form-check-input");
    let allChecked = true;

    // Validate checkboxes
    checkboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
            checkbox.classList.add("is-invalid");
            allChecked = false;
        } else {
            checkbox.classList.remove("is-invalid");
        }
    });

    const errorMessage = document.getElementById("errorMessage");

    if (!allChecked) {
        event.preventDefault(); // Prevent form submission
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
});