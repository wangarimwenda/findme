emailjs.init("xzpDVPZb_u8OFIHUu");  // Your public key // expires after 200 tries

const panicBtn = document.getElementById("panicBtn");
const statusDiv = document.getElementById("status");
const recipientInput = document.getElementById("recipientEmail");
let map, marker;

function initMap(lat, lon) {
  map = L.map("map").setView([lat, lon], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  marker = L.marker([lat, lon]).addTo(map).bindPopup("Your Location").openPopup();
}

function updateMap(lat, lon) {
  marker.setLatLng([lat, lon]);
  map.setView([lat, lon], 15);
}

function sendAlert(lat, lon) {
  const recipient = recipientInput.value.trim();
  if (!recipient) {
    alert("Please enter your loved one’s email address.");
    return;
  }

  const locationLink = `https://maps.google.com/?q=${lat},${lon}`;
  const templateParams = {
    to_email: recipient,
    message: `🚨 Emergency Alert!\nLocation: ${locationLink}`
  };

  emailjs.send("service_vlivv9v", "template_udawx1q", templateParams)
    .then(res => {
      alert(`📨 Alert sent to ${recipient}`);
    })
    .catch(err => {
      console.error("EmailJS error:", err);
      alert("⚠️ Failed to send alert. Try again.");
    });
}

function getLocationAndSendAlert() {
  if (!navigator.geolocation) {
    statusDiv.textContent = "Geolocation is not supported.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      statusDiv.textContent = `Location: (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
      map ? updateMap(lat, lon) : initMap(lat, lon);
      sendAlert(lat, lon);
    },
    error => {
      const errors = {
        1: "Permission denied.",
        2: "Position unavailable.",
        3: "Timeout — retrying."
      };
      statusDiv.textContent = errors[error.code] || "Unknown error.";
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
  );
}

panicBtn.addEventListener("click", () => {
  alert("🚨 Help is on the way!");
  getLocationAndSendAlert();
});
document.addEventListener("DOMContentLoaded", () => {
  if (!navigator.geolocation) {
    statusDiv.textContent = "Geolocation is not supported by your browser.";
  } else {
    statusDiv.textContent = "Click the button to send an alert.";
  }
});

// request location access on load
document.addEventListener('DOMContentLoaded', () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(() => {
        console.log("Location permission granted.");
      },
      (error) => {
        console.warn("Location access denied or unavailable.", error);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});
