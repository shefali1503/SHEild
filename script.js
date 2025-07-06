// for the emergency email 

function SendMessage() {
    alert("Emergency message sent")
    //emergency button pressed notification will be sent to the contacts
}

document.querySelector(".emergency").addEventListener("click", SendMessage)


// for the emergency contact input
function addEmergencyContact() {
    let formcontent = ` <input type="text" placeholder="Enter contact name" >
            <input type="text" placeholder="Enter the contact number" >
            <input type="email" placeholder="Enter the contact email">
            <div class="formActions">
                 <button class="clearBtn" type="button">Clear</button>
                <button class="submitBtn" type="submit">Input</button>
            </div>
            `;
    let formsection = document.querySelector(".inputContact");
    formsection.innerHTML = formcontent;

}

document.querySelector(".addButton").addEventListener("click", addEmergencyContact)