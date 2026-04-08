const launchDate = new Date("2026-07-01T09:00:00");
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const signupForm = document.getElementById("signup-form");
const signupHint = document.getElementById("signup-hint");

const firebaseConfig = {
  apiKey: "AIzaSyAztRWN1e8WSFBU8twmbuC1uPhiEsS77GM",
  authDomain: "examora-c1978.firebaseapp.com",
  projectId: "examora-c1978",
  storageBucket: "examora-c1978.firebasestorage.app",
  messagingSenderId: "231723472446",
  appId: "1:231723472446:web:f7f12404f5794aa3e6a36f",
  measurementId: "G-V63B1D7MQ6",
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const gap = Math.max(launchDate.getTime() - now.getTime(), 0);

  const totalSeconds = Math.floor(gap / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysElement.textContent = pad(days);
  hoursElement.textContent = pad(hours);
  minutesElement.textContent = pad(minutes);
  secondsElement.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = String(new FormData(signupForm).get("email") || "").trim().toLowerCase();

  if (!email) {
    signupHint.textContent = "Enter an email address to get launch updates.";
    return;
  }

  signupHint.textContent = "Saving your email...";

  firestore
    .collection("email_signups")
    .add({
      email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      source: "coming-soon-page",
    })
    .then(() => {
      signupHint.textContent = `Thanks. We will notify ${email} when the launch goes live.`;
      signupForm.reset();
    })
    .catch((error) => {
      console.error("Failed to save signup", error);
      signupHint.textContent = "We could not save your email right now. Please try again.";
    });
});
