const revealItems = document.querySelectorAll("[data-reveal]");

const navLinks = document.querySelectorAll(".nav a[href^='#']");
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && navLinks.length && sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const leadForm = document.querySelector(".lead-form");
const formStatus = document.querySelector(".form-status");

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!name || !phone) {
    formStatus.textContent = "Пожалуйста, заполните имя и телефон.";
    return;
  }

  const submitButton = leadForm.querySelector("button[type='submit']");
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";
  formStatus.textContent = "";

  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    formStatus.textContent = "Спасибо. Юрист свяжется с вами в ближайшее время.";
    leadForm.reset();
  } catch {
    formStatus.textContent = "Не получилось отправить заявку. Напишите в Telegram или WhatsApp.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});
