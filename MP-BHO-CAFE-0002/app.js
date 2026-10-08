/* ===== Premium Demo Site — app.js (Demo Lock + interactions) ===== */
(function () {
  "use strict";

  var modal = document.getElementById("demoModal");
  var yearEl = document.getElementById("yr");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Modal controls ---------- */
  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- MOBILE NAV ---------- */
  var burger = document.querySelector(".hamburger");
  var links = document.getElementById("links");
  if (burger && links) {
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---------- DEMO LOCK ----------
     Intercept ANY click on action buttons, product links, Buy Now,
     Order, WhatsApp, CTA etc. Prevent default + open the demo modal.  */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) { e.preventDefault(); closeModal(); return; }
    if (e.target.closest(".demo-modal")) { return; }
    if (e.target.closest("[data-ui]")) { return; }
    var anchor = e.target.closest("a[href]");
    if (anchor && (anchor.getAttribute("href") || "").charAt(0) === "#") { return; }
    var trigger = e.target.closest("button, .btn, [data-demo], a[href]");
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      openModal();
    }
  }, false);

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- SCROLL REVEAL ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- STICKY NAV SHADOW ---------- */
  var nav = document.querySelector(".nav");
  window.addEventListener("scroll", function () {
    if (!nav) return;
    nav.style.boxShadow = window.scrollY > 20 ? "0 8px 30px rgba(0,0,0,.08)" : "none";
  }, { passive: true });
})();
