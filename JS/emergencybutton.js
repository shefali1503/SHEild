// --- Emergency Alert Flow ---
async function handleEmergencyClick() {
    const user = JSON.parse(localStorage.getItem("userDetails") || "{}");//gives us the details who is using the website from the local storage
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
function getLocationLink() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {//if browser donot allowed to take the geolocation then empty string is sent
            resolve("");
            return;
        }

        navigator.geolocation.getCurrentPosition(//if it is allowed
            (pos) => {//position of the user
                const { latitude, longitude } = pos.coords;//current loaction
                resolve(`https://maps.google.com/?q=${latitude},${longitude}`);//live location link
            },
            () => resolve("")/* error callback*/,{ enableHighAccuracy: true, timeout: 10000 }
            // enableHighAccuracy: true – Ask the device for the best location it can(GPS when available).
            // timeout: 10000 – Give up after 10 seconds.
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
    const user = JSON.parse(localStorage.getItem("userDetails") || "{}");

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
    user: JSON.parse(localStorage.getItem("userDetails") || "{}"),
    contacts: JSON.parse(localStorage.getItem("emergencyContacts") || "[]")
});

