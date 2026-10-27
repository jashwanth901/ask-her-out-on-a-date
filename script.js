/*
  FormSubmit email integration.
  First submit triggers an activation email to the site owner's inbox.
  The owner must click the activation link before submissions are delivered.
  Note: this endpoint contains the recipient email address and is visible in public source code.
*/
const FORM_ENDPOINT = "https://formsubmit.co/ajax/jashwanththummeda2010@gmail.com";

const questionScreen = document.getElementById("question-screen");
const plannerScreen = document.getElementById("planner-screen");
const successScreen = document.getElementById("success-screen");
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const stage = document.getElementById("button-stage");
const hint = document.getElementById("tiny-hint");
const form = document.getElementById("date-form");
const formMessage = document.getElementById("form-message");
const submitButton = document.getElementById("submit-button");
const backButton = document.getElementById("back-button");
const dateInput = document.querySelector('input[name="date"]');

let noCount = 0;
let yesScale = 1;

function localDateString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}


function showPlanner() {
  questionScreen.hidden = true;
  plannerScreen.hidden = false;
  dateInput.min = localDateString();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
yesButton.addEventListener("click", showPlanner);

noButton.addEventListener("click", () => {
  noCount += 1;
  yesScale = Math.min(1 + noCount * 0.14, 2.15);
  yesButton.style.transform = `scale(${yesScale})`;

  const stageRect = stage.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const maxX = Math.max(0, stageRect.width - buttonRect.width);
  const maxY = Math.max(0, stageRect.height - buttonRect.height);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noButton.style.left = `${x + buttonRect.width / 2}px`;
  noButton.style.top = `${y + buttonRect.height / 2}px`;
  noButton.style.transform = "translate(-50%, -50%)";

  const messages = [
    "Hmm... try that again? 🙈",
    "The No button is feeling shy 🌷",
    "Are you sure? The Yes button is getting excited 💗",
    "That button has places to be 😅",
    "Okay, okay... I'll keep asking nicely 💌"
  ];
  hint.textContent = messages[(noCount - 1) % messages.length];
});

backButton.addEventListener("click", () => {
  plannerScreen.hidden = true;
  questionScreen.hidden = false;
  formMessage.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
    formMessage.textContent = "Almost ready! The site owner needs to connect the form endpoint before choices can be sent.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending your choice… 💌";

  const formData = new FormData(form);
  formData.append("_subject", "Bhavya accepted the date invitation 💗");
  formData.append("submitted_at", new Date().toLocaleString());

  try {
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    let result = {};
    try { result = await response.json(); } catch (_) {}

    // FormSubmit may return HTTP 200 even when its JSON payload reports failure.
    if (response.ok && result.success === "true") {
      plannerScreen.hidden = true;
      successScreen.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const detail = result.message || (result.errors && result.errors.map(item => item.message).join(" ")) || "Please try again in a moment.";
      formMessage.textContent = `Couldn't confirm the submission. ${detail}`;
    }
  } catch (_) {
    formMessage.textContent = "Couldn't connect. Check your internet and try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send my date choice 💌";
  }
});
