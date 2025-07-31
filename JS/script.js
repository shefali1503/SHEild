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
    cardContactEl.textContent = `${data.phone}  |  ${data.email}`;
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

// // Emergency Button click
// function EmergencyMessage() {
//   alert("🚨 Emergency message sent");
// }
// document.querySelector(".button-container")?.addEventListener("click", EmergencyMessage);


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
// Responsive Sidebar Nav
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
}

document.querySelector(".hamburger")?.addEventListener("click", toggleSidebar);
document.querySelector(".close-btn")?.addEventListener("click", toggleSidebar);


//Emergency Button Logic
// --- Emergency Alert Flow ---
async function handleEmergencyClick() {
  const user = JSON.parse(localStorage.getItem("userProfile") || "{}");//gives us the details who is using the website from the local storage
  const contacts = JSON.parse(localStorage.getItem("emergencyContacts") || "[]");//gives array that contains the info of the emergency contacts

  if (!contacts.length) {//if emergency contacts array is empty then we will alert that no emergency contacts are saved and exit
    alert("No emergency contacts saved!");
    return;
  }

  // Try to grab location of the user as we have to send it also (optional, permission required)
  const locText = await getLocationLink();

  // Build message that is to be sent
  //message created will be as follows
  /*
  🚨 EMERGENCY ALERT 🚨
  From:abc
  Phone:9958741250
  Email: abc1234@gmail.com
  location_link
  Please contact me immediately.
  */
  alert("Emergency message Sent 🚨")
  const msg =
    `🚨 EMERGENCY ALERT 🚨\n` +
    `From: ${user.name || "Unknown"}\n` +
    `Phone: ${user.phone || "N/A"}\n` +
    `Email: ${user.email || "N/A"}\n` +
    (locText ? `Location: ${locText}\n` : "") +
    `Please contact me immediately.`;

  // Launch SMS (mobile devices) — best effort
  launchSmsToContacts(contacts, msg);

  // Also open email composer as backup
  launchEmailToContacts(contacts, msg);

  // Copy to clipboard as fallback for desktop
  copyEmergencyMsg(msg);
}

//clicking the emergency button logic 
document.querySelector(".button-container .emergency").addEventListener("click", handleEmergencyClick);

// Try geolocation and return a Google Maps link string or "" --this is for live location
async function getLocationLink() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve("");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const mapsLink = `https://maps.google.com/?q=${lat},${lon}`;
        let address = "";

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
            headers: {
              "User-Agent": "YourAppName/1.0 (your.email@example.com)"
            }
          });
          const data = await response.json();
          address = data.display_name || "";
        } catch (error) {
          console.error("Geocoding error:", error);
        }

        const finalText = address ? `${address}\n📍 ${mapsLink}` : mapsLink;
        resolve(finalText);
      },
      (error) => {
        console.error("Location error:", error);
        resolve("");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}


// Normalize number -> digits only, optionally prepend country code (add your logic)
function normalizeNumber(num) {
  return num.replace(/\D/g, "");
}

/**
 * Open SMS composer. Multi-recipient support varies by platform.
 * Strategy:
 *  - Use first number as primary.
 *  - Include additional numbers separated by comma; some devices use ';' (iOS older).
 *  - Use body param fallback for cross-platform.
 */
function launchSmsToContacts(contacts, message) {
  const numbers = contacts.map((c) => normalizeNumber(c.number)).filter(Boolean);

  if (!numbers.length) return;

  // Primary num
  const primary = numbers[0];

  // Some platforms allow comma-separated additional recipients
  const rest = numbers.slice(1).join(",");

  const recipients = rest ? `${primary},${rest}` : primary;

  // Android prefers ?body= ; iOS historically &body= (but most handle ?& now)
  const smsHref = `sms:${recipients}?&body=${encodeURIComponent(message)}`;

  // Navigate (will open SMS app or fail silently on desktops)
  window.location.href = smsHref;
}

/**
 * Open email compose window with all contacts.
 * Depending on preference, you may want to use BCC instead of TO.
 */
function launchEmailToContacts(contacts, message) {
  const user = JSON.parse(localStorage.getItem("userProfile") || "{}");

  const emails = contacts.map((c) => c.email).filter(Boolean).join(",");
  if (!emails) return;

  const subject = `EMERGENCY ALERT from ${user.name || "SHEild User"}`;
  const body = message;

  const mailHref = `mailto:${encodeURIComponent(
    emails
  )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Open in new tab/window so it doesn't interrupt SMS handoff
  setTimeout(() => {
    window.open(mailHref, "_blank");
  }, 600);
}

//  Copy message text as a desktop fallback.

function copyEmergencyMsg(text) {
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).catch(() => { });
}
console.log("Emergency click:", {
  user: JSON.parse(localStorage.getItem("userProfile") || "{}"),
  contacts: JSON.parse(localStorage.getItem("emergencyContacts") || "[]")
});



//Live Location feature
let map;
let marker;

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".share-btn");
  const statusMsg = document.getElementById("statusMessage");
  const addressMsg = document.getElementById("address");

  // 1. Initialize with default location (e.g., India Gate, New Delhi)
  const defaultLat = 28.6129;
  const defaultLon = 77.2295;
  const defaultZoom = 13;

  map = L.map("map").setView([defaultLat, defaultLon], defaultZoom);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CartoDB contributors',
  }).addTo(map);

  marker = L.marker([defaultLat, defaultLon])
    .addTo(map)
    .bindPopup("📍 Sample Location: India Gate")
    .openPopup();

  button.addEventListener("click", () => {
    if (!navigator.geolocation) {
      statusMsg.textContent = "Geolocation is not supported by your browser.";
      return;
    }

    statusMsg.textContent = "Locating...";

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        statusMsg.textContent = `Location found: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;

        // Reverse geocode to get address
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await response.json();
          const address = data.display_name || "Address not found";

          // Display address
          addressMsg.textContent = `📍 ${address}`;

          // Initialize or update map
          if (!map) {
            map = L.map("map").setView([lat, lon], 15);
            L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
              attribution: '&copy; OpenStreetMap &copy; CartoDB contributors',
            }).addTo(map);

            // Important: ensure tiles render properly
            setTimeout(() => {
              map.invalidateSize();
            }, 100);
          } else {
            map.setView([lat, lon], 15);
            map.invalidateSize(); // Fix overlapping tiles
          }

          // Add or update marker
          if (marker) {
            marker.setLatLng([lat, lon]).setPopupContent(address).openPopup();
          } else {
            marker = L.marker([lat, lon])
              .addTo(map)
              .bindPopup(address)
              .openPopup();
          }
        } catch (error) {
          addressMsg.textContent = "Failed to retrieve address.";
          console.error("Geocoding error:", error);
        }
      },
      (error) => {
        statusMsg.textContent = "Unable to retrieve your location.";
        console.error("Location error:", error);
      }
    );
  });
});



    document.addEventListener("DOMContentLoaded", function () {
        const helplineLinks = document.querySelectorAll(".helpline-div a");

        helplineLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                const serviceName = link.textContent.trim();
                const phoneNumber = link.getAttribute("href").replace("tel:", "");
                alert(`You are about to call ${serviceName}\nPhone: ${phoneNumber}`);
            });
        });
    });

