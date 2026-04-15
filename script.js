/* ═══════════════════════════════════════════
   PORTFOLIO SCRIPT — Sudarshan Barure
   • Navbar scroll / mobile menu
   • Scroll-reveal animations
   • Contact form → Google Sheets + EmailJS
═══════════════════════════════════════════ */

// ─── CONFIGURATION ─────────────────────────
// Replace these values after following CONTACT_SETUP.md
const CONFIG = {
  // Google Apps Script Web App URL (from Step 2 in CONTACT_SETUP.md)
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzhfEt19hFn__2WfZuzOU_oNgHt8zm6ulbItKoxYx6g5l2s6WskPKCBXAnHUlBxAa2W/exec",

  // EmailJS — from https://www.emailjs.com
  EMAILJS_SERVICE_ID:  "YOUR_SERVICE_ID",
  EMAILJS_TEMPLATE_ID: "YOUR_TEMPLATE_ID",
  EMAILJS_PUBLIC_KEY:  "YOUR_PUBLIC_KEY",
};

// ─── NAVBAR ────────────────────────────────
const navbar = document.getElementById("navbar");
const burger  = document.getElementById("burger");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

burger.addEventListener("click", () => {
  navbar.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(a =>
  a.addEventListener("click", () => navbar.classList.remove("open"))
);

// ─── SCROLL REVEAL ─────────────────────────
const revealEls = document.querySelectorAll(
  ".section-title, .section-label, .a-card, .skill-pill-group, .ach-card, .tl-item, .proj-card, .edu-card, .about-text p, .contact-info-col, .contact-form-wrap"
);

revealEls.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 60);
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => io.observe(el));

// ─── CONTACT FORM ──────────────────────────
const form      = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const btnText   = submitBtn.querySelector(".btn-text");
const btnLoad   = submitBtn.querySelector(".btn-loading");
const formMsg   = document.getElementById("formMsg");
const setupNote = document.getElementById("setupNote");

// Hide setup note if keys are configured
if (
  CONFIG.GOOGLE_SCRIPT_URL !== "https://script.google.com/macros/s/AKfycbzhfEt19hFn__2WfZuzOU_oNgHt8zm6ulbItKoxYx6g5l2s6WskPKCBXAnHUlBxAa2W/exec" &&
  CONFIG.EMAILJS_PUBLIC_KEY  !== "YOUR_PUBLIC_KEY"
) {
  setupNote && setupNote.remove();
}

function showMsg(type, text) {
  formMsg.className = `form-msg ${type}`;
  formMsg.textContent = text;
  formMsg.classList.remove("hidden");
  setTimeout(() => formMsg.classList.add("hidden"), 6000);
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.classList.toggle("hidden", loading);
  btnLoad.classList.toggle("hidden", !loading);
}

// Load EmailJS SDK lazily
function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => {
      emailjs.init({ publicKey: CONFIG.EMAILJS_PUBLIC_KEY });
      resolve();
    };
    document.head.appendChild(s);
  });
}

// Send data to Google Sheets via Apps Script
async function sendToGoogleSheets(data) {
  const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
    mode:    "no-cors", // Apps Script requires no-cors
  });
  return res; // no-cors returns opaque response — we assume success
}

// Send email via EmailJS
async function sendEmailJS(data) {
  await loadEmailJS();
  return emailjs.send(
    CONFIG.EMAILJS_SERVICE_ID,
    CONFIG.EMAILJS_TEMPLATE_ID,
    {
      from_name:    data.name,
      from_email:   data.email,
      from_phone:   data.phone,
      message:      data.query,
      to_name:      "Sudarshan Barure",
      reply_to:     data.email,
      submitted_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    }
  );
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Basic validation
  const name  = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const query = form.query.value.trim();

  if (!name || !phone || !email || !query) {
    showMsg("error", "Please fill in all required fields.");
    return;
  }
  if (!/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
    showMsg("error", "Please enter a valid email address.");
    return;
  }

  // Check keys are configured
  if (
    CONFIG.GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE" ||
    CONFIG.EMAILJS_PUBLIC_KEY  === "YOUR_PUBLIC_KEY"
  ) {
    showMsg("error", "Contact form not yet configured. Please see CONTACT_SETUP.md.");
    return;
  }

  setLoading(true);
  const data = { name, phone, email, query };

  try {
    // Fire both in parallel
    await Promise.all([
      sendToGoogleSheets(data),
      sendEmailJS(data),
    ]);

    showMsg("success", "✅ Message sent! I'll get back to you within 24 hours.");
    form.reset();
  } catch (err) {
    console.error("Form error:", err);
    // If Sheets wrote but email failed (or vice-versa), still show partial success
    showMsg("error", "Something went wrong. Please email me directly at ajaybarure@gmail.com");
  } finally {
    setLoading(false);
  }
});
