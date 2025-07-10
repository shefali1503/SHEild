//to load all the saved contacts on page load or even reload
document.addEventListener("DOMContentLoaded", () => {
    loadContactsFromLocalStorage();
    checkMaxContacts(); // Optional: disables Add button if limit is reached
});


// Load contacts from localStorage
function loadContactsFromLocalStorage() {
    const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
    contacts.forEach(contact => renderContactCard(contact));
}

// for the emergency email 

function SendMessage() {
    alert("🚨 Emergency message sent")
}

function callConnect(name) {
    alert(`📞 Calling ${name}...`);
}


function addEmergencyContact() {
    let formContainer = document.querySelector(".inputContact");

    formContainer.classList.remove("hidden");  // Show container

    if (!formContainer.querySelector("input")) {//checks if the inputContact has any input field yet or not
        formContainer.innerHTML = ` <input type="text" class="nameInput"    placeholder="Enter contact name" required> 
            <input type="tel" class="numberInput" placeholder="Enter the contact number" pattern="[0-9]+" required>
            <input type="email" class="emailInput" placeholder="Enter the contact email" required>
            <div class="formActions">
                <p class="close">Close form<p>
                <button class="clearBtn" type="button">Clear</button>
                <button class="submitBtn" type="submit">Input</button>
            </div>
            `;

        //clear form para
        document.querySelector(".close").addEventListener("click", function () {
            formContainer.classList.add("hidden");  // closes form
        })

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

            // 🚫 Check max contact limit
            let contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];//return array

            //check limit
            if (contacts.length >= 5) {//check ki array ki length
                alert("You can only add up to 5 emergency contacts.");
                return;
            }

            //check duplicate
            if (contacts.some(c => (c.email === email || c.number === number))) {
                alert("This contact already exists.");
                return;
            }

            //to save the contact we created an obj
            const contact = {
                name,
                number,
                email,
                imgSrc: "./img/profilepic.jpg"
            }

            contacts.push(contact);//object pushed into the array contacts
            localStorage.setItem("emergencyContacts", JSON.stringify(contacts));//pass the contacts array in the localstorage

            // If valid, create the contact card
            renderContactCard(contact);

            document.querySelector(".inputContact").innerHTML = '';//once a card is created form will be cleared

            formContainer.classList.add("hidden");//and form will be closed also

            checkMaxContacts();//check if we have reached the max contacts
        });
    }
}
document.querySelector(".addButton").addEventListener("click", addEmergencyContact)

// Disable Add button if max contacts reached
function checkMaxContacts() {
    const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];//contacts is converted to an array first as in the local storage it is saved as a string
    const addBtn = document.querySelector(".addButton");//it targets the addButton for inputting the contacts

    if (contacts.length >= 5) {
        alert("You can enter max 5 emergency contacts.");//alert that shows max contacts  reached now we will disable the button
        addBtn.disabled = true;//button will not do its work when clicked
        addBtn.textContent = "Limit Reached (5)";
    } else {
        addBtn.disabled = false;
    }
}

// Delete contact by email
function deleteContact(email) {
    let contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
    contacts = contacts.filter(c => c.email !== email);
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
}

//responsive nav bar
function toggleSidebar(){
    const sidebar = document.getElementById("sidebar");
    sidebar.style.width = (sidebar.style.width === "250px") ? "0" : "250px";
}

document.querySelector(".hamburger").addEventListener("click",toggleSidebar)
document.querySelector(".close-btn").addEventListener("click",toggleSidebar)

