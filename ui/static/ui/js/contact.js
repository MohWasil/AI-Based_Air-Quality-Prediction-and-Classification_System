document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('secureForm');
    const contactWarningText = document.getElementById('contactWarningText');

    form.addEventListener('submit', (event) => {
        let formIsValid = true;
        let emptyFields = [];

        // Validate all fields
        const fields = [
            { id: 'name', errorId: 'name', message: 'Name cannot be empty.' },
            { id: 'contact', errorId: 'contact', message: 'Contact number cannot be empty.' },
            { id: 'country', errorId: 'country', message: 'Country cannot be empty.' },
            { id: 'email', errorId: 'email', message: 'Email cannot be empty.' },
            { id: 'subject', errorId: 'subject', message: 'Subject cannot be empty.' },
            { id: 'message', errorId: 'message', message: 'Message cannot be empty.' },
        ];

        fields.forEach(({ id, errorId, message }) => {
            const input = document.getElementById(id);
            const error = document.querySelector(`#${errorId} ~ .invalid-feedback`);

            if (id === 'country') {
                // Special case for country select box
                if (input.value === "") {
                    error.textContent = message;
                    error.style.display = 'block';
                    input.classList.add('is-invalid');
                    formIsValid = false;
                    emptyFields.push(id);
                } else {
                    error.style.display = 'none';
                    input.classList.remove('is-invalid');
                }
            } else {
                if (!input.value.trim()) {
                    error.textContent = message;
                    error.style.display = 'block';
                    input.classList.add('is-invalid');
                    formIsValid = false;
                    emptyFields.push(id);
                } else {
                    error.style.display = 'none';
                    input.classList.remove('is-invalid');
                }
            }
        });

        // General warning if any fields are empty
        if (emptyFields.length > 0) {
            contactWarningText.textContent = 'Please fill out all required fields.';
        } else {
            contactWarningText.textContent = '';
        }

        if (!formIsValid) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            var inputs = {}
            fields.forEach(data => {
                inputs[data.id] = document.getElementById(data.id)          
            })
            fetch("/api/feedbacks/contacts/", {
                method: "POST",
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(inputs)
            }).then(res => {
                if(res.status==200) {
                    console.log("Successfully Contacted")
                }
                else {
                    console.err("An Error Occured")
                }
            })
            form.classList.add('was-validated');
        }
    });

    // Add event listeners to restrict input for each field
    document.getElementById('name').addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, '');
    });

    document.getElementById('contact').addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^0-9\-+]/g, '');
    });

    document.getElementById('subject').addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^a-zA-Z0-9\s.,!?]/g, '');
    });

    document.getElementById('message').addEventListener('input', (event) => {
        event.target.value = event.target.value.replace(/[^a-zA-Z0-9\s.,!?]/g, '');
    });
});
