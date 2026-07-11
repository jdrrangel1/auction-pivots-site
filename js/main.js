// Respect reduced-motion: pause the hero background video (CSS alone can't pause <video>)
const heroVideo = document.querySelector(".hero-video");
if (heroVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVideo.pause();
  heroVideo.removeAttribute("autoplay");
}

// Nav toggle (mobile)
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  siteNav.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  const panel = item.querySelector(".faq-a");
  btn.addEventListener("click", () => {
    const isOpen = item.getAttribute("data-open") === "true";
    document.querySelectorAll(".faq-item").forEach((other) => {
      other.setAttribute("data-open", "false");
      other.querySelector(".faq-a").style.maxHeight = null;
      other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.setAttribute("data-open", "true");
      btn.setAttribute("aria-expanded", "true");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

// Before/after compare slider
const compareSlider = document.getElementById("compareSlider");
if (compareSlider) {
  const compareBefore = document.getElementById("compareBefore");
  const compareHandle = document.getElementById("compareHandle");
  let dragging = false;

  function setComparePct(pct) {
    pct = Math.max(0, Math.min(100, pct));
    compareBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    compareHandle.style.left = pct + "%";
    compareSlider.setAttribute("aria-valuenow", Math.round(pct));
  }

  function pctFromClientX(clientX) {
    const rect = compareSlider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function onPointerMove(e) {
    if (dragging) setComparePct(pctFromClientX(e.clientX));
  }
  function onPointerUp() {
    dragging = false;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  }
  compareSlider.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragging = true;
    setComparePct(pctFromClientX(e.clientX));
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  });

  compareSlider.addEventListener("keydown", (e) => {
    const current = parseFloat(compareSlider.getAttribute("aria-valuenow")) || 50;
    if (e.key === "ArrowLeft") setComparePct(current - 5);
    if (e.key === "ArrowRight") setComparePct(current + 5);
  });
}

// Pricing term tabs (products page): switch visible price in bundle cards
const tierTabs = document.querySelectorAll(".tier-tab");
if (tierTabs.length) {
  tierTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tierTabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      const term = tab.getAttribute("data-term");
      document.querySelectorAll("[data-price-term]").forEach((el) => {
        el.style.display = el.getAttribute("data-price-term") === term ? "flex" : "none";
      });
    });
  });
}
