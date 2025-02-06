document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.getElementById("feedbackForm");
    const submitButton = document.getElementById("submitButton");
    const fields = feedbackForm.querySelectorAll("input, textarea, select");
    const phoneNumber = document.getElementById("phoneNumber");
    const streetAddress2 = document.getElementById("streetAddress2");
    const streetAddress2Counter = document.getElementById("streetAddress2Counter");
    const drinkSelect = document.getElementById("drinkSelect");
    const dynamicCheckbox = document.getElementById("dynamicCheckbox");

    fields.forEach(field => {
        field.addEventListener("input", validateForm);
    });

    phoneNumber.addEventListener("input", () => {
        let value = phoneNumber.value.replace(/[^0-9]/g, "");
        if (value.length > 3) value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        if (value.length > 9) value = `${value.slice(0, 9)}-${value.slice(9, 13)}`;
        phoneNumber.value = value;
    });

    streetAddress2.addEventListener("input", () => {
        streetAddress2Counter.textContent = `${streetAddress2.value.length}/20 characters used`;
    });

    drinkSelect.addEventListener("change", () => {
        dynamicCheckbox.innerHTML = "";
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "largeDrink";
        checkbox.name = "largeDrink";
        const text = document.createTextNode(" Large drink (75¢ extra)");
        label.appendChild(checkbox);
        label.appendChild(text);
        dynamicCheckbox.appendChild(label);

        checkbox.addEventListener("change", () => {
            const existingInput = document.getElementById("largeDrinkDetails");
            if (checkbox.checked) {
                if (!existingInput) {
                    const detailsInput = document.createElement("input");
                    detailsInput.type = "text";
                    detailsInput.id = "largeDrinkDetails";
                    detailsInput.placeholder = "Specify details";
                    dynamicCheckbox.appendChild(detailsInput);
                }
            } else if (existingInput) {
                existingInput.remove();
            }
        });
    });

    feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(feedbackForm);
        const resultTable = document.getElementById("resultTable");
        let tableHTML = "<div style='width: 100%; background-color: beige; padding: 20px;'><table style='width: 100%; margin: auto; border-collapse: collapse; background-color: white;'><tr>";

        formData.forEach((_, key) => {
            tableHTML += `<th style='border: 1px solid black; padding: 8px; text-align: left;'>${key}</th>`;
        });
        tableHTML += "</tr><tr>";
        formData.forEach(value => {
            tableHTML += `<td style='border: 1px solid black; padding: 8px;'>${value || ""}</td>`;
        });
        tableHTML += "</tr></table></div>";

        resultTable.innerHTML = tableHTML;
        feedbackForm.reset();
        validateForm();
    });

    function validateForm() {
        let isValid = true;
        fields.forEach(field => {
            const errorSpan = document.getElementById(`${field.id}Error`);
            if (errorSpan) errorSpan.textContent = ""; 
    
            if (!field.validity.valid) {
                isValid = false;
    
                let message = "";
                if (field.validity.valueMissing) {
                    message = "This field is required.";
                } else if (field.validity.tooShort) {
                    message = `Please enter at least ${field.minLength} characters.`;
                } else if (field.validity.tooLong) {
                    message = `Please enter no more than ${field.maxLength} characters.`;
                } else if (field.validity.patternMismatch) {
                    message = "The entered value does not match the expected format.";
                }
    
                field.setCustomValidity(message);
                if (errorSpan) errorSpan.textContent = message;
            } else {
                field.setCustomValidity(""); 
            }
        });
        submitButton.disabled = !isValid;
    }
    
});
