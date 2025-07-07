// for the emergency email 

function SendMessage() {
    alert("Emergency message sent")
    //emergency button pressed notification will be sent to the contacts
}

document.querySelector(".emergency").addEventListener("click", SendMessage)


// for the emergency contact input
function addEmergencyContact() {
    let formContainer = document.querySelector(".inputContact");
    formContainer.classList.remove("hidden");  // Show container
    if (!formContainer.querySelector("input")) {//checks if the inputContact has any input field yet or not
        formContainer.innerHTML = ` <input type="text" class="nameInput"    placeholder="Enter contact name" required> 
            <input type="tel" class="numberInput" placeholder="Enter the contact number" pattern="[0-9]+" required>
            <input type="email" class="emailInput" placeholder="Enter the contact email" required>
            <div class="formActions">
                <button class="clearBtn" type="button">Clear</button>
                <button class="submitBtn" type="submit">Input</button>
            </div>
            `;

        //clear button to clear the form
        document.querySelector(".clearBtn").addEventListener("click", function () {
            //as the queryselectorAll will return the array
            formContainer.querySelectorAll("input").forEach(input => input.value = '');
        });

        //submitbutton click
        document.querySelector(".submitBtn").addEventListener("click", function () {
            const name = document.querySelector(".nameInput").value.trim();
            const number = document.querySelector(".numberInput").value.trim();
            const email = document.querySelector(".emailInput").value.trim();

            // Basic validation
            const numberRegex = /^[0-9]+$/;
            const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

            //to check if all the field are filled or not
            if (!name || !number || !email) {
                alert("All fields are required.");
                return;
            }
            //check the validity of the number and email id
            if (!numberRegex.test(number)) {
                alert("Contact number should contain digits only.");
                return;
            }

            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }
            // If valid, create the contact card
            const contactCard = document.createElement("div");
            contactCard.classList.add("contact");
            contactCard.innerHTML = `
        <p>${name}</p>
        <p>${number}</p>
        <p>${email}</p>
        <button class="call">📞 Call</button>
    `;

            document.querySelector(".contact-container").appendChild(contactCard);
            document.querySelector(".inputContact").innerHTML = ''; // clear form
            formContainer.classList.add("hidden");  // hide container once submitted


        });
    }
}
document.querySelector(".addButton").addEventListener("click", addEmergencyContact)


