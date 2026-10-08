/* ==========================================================================
   ATELIER — app.js
   1) Demo Lock (har action click pe modal)  2) saari UI interactions
   ========================================================================== */
(function () {
  "use strict";

  var d = document;
  var root = d.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA_URL = "https://wa.me/919479782720";
  var AGENCY_URL = "https://mentinaweb.netlify.app/";

  /* ---------------------------------------------------------------- helpers */
  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  /* ---------------------------------------------------- demo banner height */
  function syncBannerHeight() {
    var banner = $(".demo-banner");
    if (!banner) return;
    var h = Math.round(banner.getBoundingClientRect().height + banner.getBoundingClientRect().top);
    if (h > 0 && Math.abs(h - parseInt(getComputedStyle(root).getPropertyValue("--demo-h"), 10)) > 1) {
      root.style.setProperty("--demo-h", h + "px");
    }
  }

  /* ------------------------------------------------------------- demo lock */
  var modal = $("#demoModal");
  var lastFocus = null;

  function openModal() {
    if (!modal) return;
    lastFocus = d.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    d.body.style.overflow = "hidden";
    var first = $(".modal__act a, .modal__x", modal);
    if (first) first.focus({ preventScroll: true });
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    d.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function isModalOpen() { return modal && modal.classList.contains("open"); }

  d.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    if (t.closest("[data-close]")) { e.preventDefault(); closeModal(); return; }
    if (t.closest(".demo-modal, .modal__box") || isModalOpen()) return;
    if (t.closest("[data-ui]")) return;
    if (t.closest(".demo-banner")) { e.preventDefault(); openModal(); return; }

    var link = t.closest("a[href]");
    if (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) === "#") return;                 /* internal anchors chalti rahengi */
      if (href.indexOf("mentinaweb") > -1) return;        /* agency link allowed */
      e.preventDefault();
      openModal();
      return;
    }
    var trigger = t.closest("button, [data-demo]");
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  }, false);

  if (modal) {
    modal.addEventListener("mousedown", function (e) { if (e.target === modal) closeModal(); });
  }
  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isModalOpen()) { closeModal(); return; }
    if (e.key === "Tab" && isModalOpen()) {
      var f = $$("a[href], button, [tabindex]:not([tabindex='-1'])", modal).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });


  /* ------------------------------------- live "open now" hours indicator ---
     Dataset table ke data-hours se aaj ka din highlight karta hai aur
     topbar/strip me "Open now · till 11:00 PM" jaisa live status dikhata hai.
     ------------------------------------------------------------------------ */
  function parseClock(s) {
    var m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(s).trim());
    if (!m) return null;
    var h = parseInt(m[1], 10) % 12;
    if (/pm/i.test(m[3])) h += 12;
    return h * 60 + parseInt(m[2], 10);
  }

  function nextOpen(map, fromKey) {
    var order = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var i0 = order.indexOf(fromKey);
    for (var k = 1; k <= 7; k++) {
      var key = order[(i0 + k) % 7];
      if (map[key]) {
        if (k === 1) return "Opens tomorrow at " + map[key][0];
        return "Opens " + key.charAt(0).toUpperCase() + key.slice(1) + " at " + map[key][0];
      }
    }
    return "Currently closed";
  }

  (function liveHours() {
    var table = d.querySelector("table.hours[data-hours]");
    if (!table) return;
    var map;
    try { map = JSON.parse(table.getAttribute("data-hours")); } catch (e) { return; }
    var keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var now = new Date();
    var todayKey = keys[now.getDay()];

    $$("tr[data-day]", table).forEach(function (tr) {
      var on = tr.getAttribute("data-day") === todayKey;
      tr.classList.toggle("is-today", on);
      if (on) {
        var th = tr.querySelector("th");
        if (th) th.setAttribute("aria-current", "date");
      }
    });

    var mins = now.getHours() * 60 + now.getMinutes();
    var state = "closed";
    var text = nextOpen(map, todayKey);
    var today = map[todayKey];
    if (today) {
      var o = parseClock(today[0]);
      var c = parseClock(today[1]);
      if (o !== null && c !== null) {
        if (mins >= o && mins < c) { state = "open"; text = "Open now · till " + today[1]; }
        else if (mins < o) { text = "Opens today at " + today[0]; }
      }
    }
    $$("[data-hours-status]").forEach(function (el) {
      el.textContent = text;
      el.setAttribute("data-state", state);
    });
  })();



  /* ------------------------------------------------------------ mobile nav */
  var burger = $(".burger");
  var nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
    d.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      if (e.target.closest("#nav") || e.target.closest(".burger")) return;
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && nav.classList.contains("open")) {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------- scroll: progress + header */
  var bar = $("#scrollBar");
  var hdr = $("#hdr");
  var top = $("#toTop");
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    var max = d.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + "%";
    if (hdr) hdr.classList.toggle("is-stuck", y > 12);
    if (top) top.classList.toggle("is-on", y > 620);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });

  if (top) {
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------- reveal on scroll */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* --------------------------------------------------------- active nav */
  var navLinks = $$("a[href^='#']", nav || d);
  var sections = navLinks.map(function (a) { return d.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------- menu tabs */
  var tabs = $$(".menu__tabs button");
  if (tabs.length) {
    tabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabs.forEach(function (b) {
          b.setAttribute("aria-selected", "false");
          b.setAttribute("tabindex", "-1");
        });
        $$(".menu__panel").forEach(function (p) { p.classList.remove("is-on"); });
        btn.setAttribute("aria-selected", "true");
        btn.setAttribute("tabindex", "0");
        var panel = d.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.classList.add("is-on");
      });
      btn.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(btn);
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) { e.preventDefault(); next.focus(); next.click(); }
      });
    });
  }

  /* ------------------------------------------------------ FAQ: single open */
  var faqs = $$(".faq details");
  faqs.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqs.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  /* --------------------------------------------- image fail-safe (external) */
  $$("img").forEach(function (img) {
    img.addEventListener("error", function () {
      var fig = img.closest(".frame, figure, .gal figure");
      if (fig) fig.classList.add("img-fail");
      img.remove();
    });
  });

  /* --------------------------------------------------- subtle hero parallax */
  if (!reduce && window.innerWidth > 900) {
    var heroImgs = $$(".hero__media img");
    var raf = null;
    window.addEventListener("scroll", function () {
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        var y = Math.min(window.pageYOffset, 760);
        heroImgs.forEach(function (img, i) {
          img.style.transform = "translate3d(0," + (y * (i ? 0.045 : 0.025)).toFixed(2) + "px,0) scale(1.02)";
        });
        raf = null;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ misc */
  var yr = d.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  syncBannerHeight();
  window.addEventListener("load", syncBannerHeight);
  window.addEventListener("resize", syncBannerHeight);
  window.addEventListener("orientationchange", syncBannerHeight);

  window.DEMO = { wa: WA_URL, agency: AGENCY_URL, open: openModal, close: closeModal };
})();
