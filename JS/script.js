// Constants / Keys
const CONTACTS_KEY = "emergencyContacts";   // array of contact objects
const USER_KEY = "userProfile";             // single object {name,phone,email,imgSrc}

// On load
document.addEventListener("DOMContentLoaded", () => {
  loadContactsFromLocalStorage();
  checkMaxContacts();
  initUserDetails(); // NEW
});

// USER DETAILS 
function initUserDetails() {
  const nameEl = document.getElementById("ud-name");
  const phoneEl = document.getElementById("ud-phone");
  const emailEl = document.getElementById("ud-email");
  const saveBtn = document.getElementById("ud-save");
  const clearBtn = document.getElementById("ud-clear");
  const msgEl = document.getElementById("ud-msg");
  const cardEl = document.getElementById("ud-card");
  const cardNameEl = cardEl.querySelector(".ud-card-name");
  const cardContactEl = cardEl.querySelector(".ud-card-contact");
  const editBtn = document.getElementById("ud-edit");
  const deleteBtn = document.getElementById("ud-delete");

  // Load existing profile
  const data = getUserProfile();
  if (data) {
    showUserCard(data);
  } else {
    hideUserCard();
  }

  // Save
  saveBtn?.addEventListener("click", () => {
    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const email = emailEl.value.trim();

    const numberRegex = /^[0-9]+$/;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!name || !phone || !email) {
      msgEl.textContent = "All fields are required.";
      return;
    }
    if (!numberRegex.test(phone)) {
      msgEl.textContent = "Phone must be digits only.";
      return;
    }
    if (!emailRegex.test(email)) {
      msgEl.textContent = "Enter a valid email.";
      return;
    }

    const profile = { name, phone, email, imgSrc: "./img/profilepic.jpg" };
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    msgEl.textContent = "Saved!";
    showUserCard(profile);
  });

  // Clear form inputs only
  clearBtn?.addEventListener("click", () => {
    nameEl.value = "";
    phoneEl.value = "";
    emailEl.value = "";
    msgEl.textContent = "Cleared.";
  });

  // Edit (bring values back into form)
  editBtn?.addEventListener("click", () => {
    const data = getUserProfile();
    if (!data) return;
    nameEl.value = data.name;
    phoneEl.value = data.phone;
    emailEl.value = data.email;
    hideUserCard();
    msgEl.textContent = "Edit your details and Save.";
    nameEl.focus();
  });

  // Delete profile
  deleteBtn?.addEventListener("click", () => {
    localStorage.removeItem(USER_KEY);
    hideUserCard();
    // Also clear form
    nameEl.value = "";
    phoneEl.value = "";
    emailEl.value = "";
    msgEl.textContent = "Profile deleted.";
  });

  // Helpers to show/hide card
  function showUserCard(data) {
    cardNameEl.textContent = data.name;
    cardContactEl.textContent = `${data.phone} | ${data.email}`;
    cardEl.classList.remove("hidden");
    // Optionally hide form when card visible:
    document.querySelector(".user-details-form-wrapper").classList.add("hidden");
  }
  function hideUserCard() {
    cardEl.classList.add("hidden");
    document.querySelector(".user-details-form-wrapper").classList.remove("hidden");
  }
}

function getUserProfile() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch (e) {
    return null;
  }
}

// Emergency Button click
function EmergencyMessage() {
  alert("🚨 Emergency message sent");
}
document.querySelector(".button-container")?.addEventListener("click", EmergencyMessage);


// Emergency Contacts Logic 
function loadContactsFromLocalStorage() {
  const contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
  contacts.forEach(contact => renderContactCard(contact));
}

function renderContactCard(contact) {
  const container = document.querySelector(".contact-container");
  const card = document.createElement("div");
  card.className = "contact";
  card.innerHTML = `
    <img src="${contact.imgSrc}" alt="Contact">
    <div class="info">  
      <p>${contact.name}</p>
      <p>${contact.number} | ${contact.email}</p>
    </div>
    <div class="btn">
      <button class="call">📞</button>
      <button class="delete">❌</button>
    </div>`;
  container.appendChild(card);

  const callBtn = card.querySelector(".call");
  const deleteBtn = card.querySelector(".delete");

  callBtn.addEventListener("click", () => callConnect(contact.name));
  deleteBtn.addEventListener("click", () => {
    deleteContact(contact.email);
    card.remove();
    checkMaxContacts();
  });
}

function callConnect(name) {
  alert(`📞 Calling ${name}...`);
}

function addEmergencyContact() {
  const formContainer = document.querySelector(".inputContact");
  formContainer.classList.remove("hidden");

  if (!formContainer.querySelector("input")) {
    formContainer.innerHTML = `
      <input type="text" class="nameInput" placeholder="Enter contact name" required>
      <input type="tel" class="numberInput" placeholder="Enter the contact number" pattern="[0-9]+" required>
      <input type="email" class="emailInput" placeholder="Enter the contact email" required>
      <div class="formActions">
        <p class="close">Close form</p>
        <button class="clearBtn" type="button">Clear</button>
        <button class="submitBtn" type="submit">Input</button>
      </div>`;

    // Close form
    formContainer.querySelector(".close").addEventListener("click", () => {
      formContainer.classList.add("hidden");
    });

    // Clear form fields
    formContainer.querySelector(".clearBtn").addEventListener("click", () => {
      formContainer.querySelectorAll("input").forEach(input => (input.value = ""));
    });

    // Submit
    formContainer.querySelector(".submitBtn").addEventListener("click", () => {
      const name = formContainer.querySelector(".nameInput").value.trim();
      const number = formContainer.querySelector(".numberInput").value.trim();
      const email = formContainer.querySelector(".emailInput").value.trim();

      const numberRegex = /^[0-9]+$/;
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

      if (!name || !number || !email) {
        alert("All fields are required.");
        return;
      }
      if (!numberRegex.test(number)) {
        alert("Contact number should contain digits only.");
        return;
      }
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      let contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
      if (contacts.length >= 5) {
        alert("You can only add up to 5 emergency contacts.");
        return;
      }
      if (contacts.some(c => c.email === email || c.number === number)) {
        alert("This contact already exists.");
        return;
      }

      const contact = { name, number, email, imgSrc: "./img/profilepic.jpg" };
      contacts.push(contact);
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));

      renderContactCard(contact);
      formContainer.innerHTML = ""; // clear form markup
      formContainer.classList.add("hidden");
      checkMaxContacts();
    });
  }
}

document.querySelector(".addButton")?.addEventListener("click", addEmergencyContact);

function checkMaxContacts() {
  const contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
  const addBtn = document.querySelector(".addButton");
  if (!addBtn) return;
  if (contacts.length >= 5) {
    alert("You can enter max 5 emergency contacts.");
    addBtn.disabled = true;
    addBtn.textContent = "Limit Reached (5)";
  } else {
    addBtn.disabled = false;
    addBtn.textContent = "+";
  }
}

function deleteContact(email) {
  let contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY)) || [];
  contacts = contacts.filter(c => c.email !== email);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

// ==========================================================
// Responsive Sidebar Nav
// ==========================================================
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
}

document.querySelector(".hamburger")?.addEventListener("click", toggleSidebar);
document.querySelector(".close-btn")?.addEventListener("click", toggleSidebar);