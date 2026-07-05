(() => {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = !body.classList.contains("nav-open");
      body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const tiltTargets = document.querySelectorAll("[data-tilt]");
  tiltTargets.forEach((target) => {
    const phone = target.querySelector(".phone");
    if (!phone) return;

    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      phone.style.transform = `rotateX(${4 - y * 8}deg) rotateY(${-10 + x * 16}deg) translateY(-2px)`;
    });

    target.addEventListener("pointerleave", () => {
      phone.style.transform = "rotateX(4deg) rotateY(-10deg)";
    });
  });

  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          const end = Number(el.getAttribute("data-count") || "0");
          let current = 0;
          const step = Math.max(1, Math.round(end / 34));
          const timer = window.setInterval(() => {
            current += step;
            if (current >= end) {
              current = end;
              window.clearInterval(timer);
            }
            el.textContent = `${current}%`;
          }, 24);
          countObserver.unobserve(el);
        }
      },
      { threshold: 0.7 }
    );
    counters.forEach((counter) => countObserver.observe(counter));
  }
})();
