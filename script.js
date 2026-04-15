/* ═══════════════════════════════════════════
   PORTFOLIO SCRIPT — FIXED VERSION
   • Navbar
   • Scroll animations
   • Contact form → Google Sheets (WORKING)
═══════════════════════════════════════════ */

// ─── CONFIG ────────────────────────────────
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwWJ_JBkZsZ_zIpGLPGvj2WaWP2AGuEgW-lnhldXJJElFKg0pVdIxjoQ0vbgr48sHIv/exec",

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

// Message UI
function showMsg(type, text) {
  formMsg.className = `form-msg ${type}`;
  formMsg.textContent = text;
  formMsg.classList.remove("hidden");
  setTimeout(() => formMsg.classList.add("hidden"), 5000);
}

// Button loader
function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.classList.toggle("hidden", loading);
  btnLoad.classList.toggle("hidden", !loading);
}

// ─── SEND TO GOOGLE SHEETS (FIXED) ─────────
async function sendToGoogleSheets(data) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("phone", data.phone);
  formData.append("email", data.email);
  formData.append("query", data.query);
  formData.append("timestamp", new Date().toISOString());

  const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: formData,
  });

  return res;
}

// ─── EMAILJS (OPTIONAL SAFE MODE) ──────────
async function sendEmailJS(data) {
  if (CONFIG.EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") return;

  if (!window.emailjs) {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    document.head.appendChild(s);

    await new Promise(resolve => s.onload = resolve);
    emailjs.init({ publicKey: CONFIG.EMAILJS_PUBLIC_KEY });
  }

  return emailjs.send(
    CONFIG.EMAILJS_SERVICE_ID,
    CONFIG.EMAILJS_TEMPLATE_ID,
    {
      from_name: data.name,
      from_email: data.email,
      from_phone: data.phone,
      message: data.query,
    }
  );
}

// ─── FORM SUBMIT ───────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name  = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const query = form.query.value.trim();

  // Validation
  if (!name || !phone || !email || !query) {
    showMsg("error", "Please fill all required fields.");
    return;
  }

  if (!/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
    showMsg("error", "Invalid email address.");
    return;
  }

  setLoading(true);

  const data = { name, phone, email, query };

  try {
    // ✅ Save to Google Sheets
    await sendToGoogleSheets(data);

    // ✅ Try Email (non-blocking)
    try {
      await sendEmailJS(data);
    } catch (e) {
      console.warn("Email failed:", e);
    }

    showMsg("success", "✅ Message sent successfully!");
    form.reset();

  } catch (err) {
    console.error(err);
    showMsg("error", "❌ Failed to send message. Try again.");
  }

  setLoading(false);
});
