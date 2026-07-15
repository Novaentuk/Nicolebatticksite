/* =============================================================================
   NICOLE BATTICK — site scripts
   Small, dependency-free progressive enhancements. The site works fully
   without JavaScript; these just add polish.
   ============================================================================= */
(function () {
  "use strict";

  // Signal to CSS that JS is available (used to hide/reveal animated elements)
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  /* ---------------------------------------------------------------------------
     1. MOBILE NAV TOGGLE
     --------------------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.removeProperty("overflow");
    };
    var openMenu = function () {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    // Close when a link is tapped (mobile)
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // Reset menu state if resized up to desktop
    var mq = window.matchMedia("(min-width: 941px)");
    var handleMQ = function () { if (mq.matches) closeMenu(); };
    mq.addEventListener ? mq.addEventListener("change", handleMQ)
                        : mq.addListener(handleMQ);
  }

  /* ---------------------------------------------------------------------------
     2. HIGHLIGHT CURRENT PAGE IN NAV
     Matches the current filename against each nav link's href.
     --------------------------------------------------------------------------- */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var target = link.getAttribute("href");
    if (!target) return;
    var file = target.split("/").pop();
    if (file === here || (here === "" && file === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------------------------------------------------------------------------
     3. FOOTER YEAR
     --------------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------------
     4. SCROLL REVEAL (IntersectionObserver, respects reduced motion)
     --------------------------------------------------------------------------- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------------------------------------------------------------------------
     5. CONTACT FORM — friendly UX around the static form service
     Works with Formspree (or similar). If the endpoint is still the
     placeholder, we don't block submission — we just warn in the console so
     you remember to set it. Real validation is handled by native HTML.
     --------------------------------------------------------------------------- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    var action = form.getAttribute("action") || "";
    if (action.indexOf("YOUR_FORM_ID") !== -1 || action.indexOf("PLACEHOLDER") !== -1) {
      console.warn(
        "[Nova site] The contact form endpoint is still a placeholder. " +
        "Replace the form's action attribute in contact.html with your real Formspree URL."
      );
    }
  }
})();
