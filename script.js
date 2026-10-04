      const menuToggle = document.querySelector(".menu-toggle");
      const navigation = document.querySelector(".nav-links");
      const bookingDialog = document.querySelector("#booking-dialog");
      const bookingForm = document.querySelector("#booking-form");
      const formFields = document.querySelector(".form-fields");
      const formSuccess = document.querySelector(".form-success");

      if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
          const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
          menuToggle.setAttribute("aria-expanded", String(!isOpen));
          menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
          navigation.classList.toggle("open", !isOpen);
        });

        navigation.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
          });
        });
      }

      if (bookingDialog && bookingForm && formFields && formSuccess) {
        document.querySelectorAll("[data-book]").forEach((trigger) => {
          trigger.addEventListener("click", (event) => {
            event.preventDefault();
            bookingDialog.showModal();
          });
        });

        document.querySelector(".dialog-close").addEventListener("click", () => bookingDialog.close());
        document.querySelector("[data-close-dialog]").addEventListener("click", () => bookingDialog.close());
        bookingDialog.addEventListener("click", (event) => {
          if (event.target === bookingDialog) bookingDialog.close();
        });
        bookingDialog.addEventListener("close", () => {
          bookingForm.reset();
          formFields.hidden = false;
          formSuccess.style.display = "none";
        });

        bookingForm.addEventListener("submit", (event) => {
          event.preventDefault();
          if (!bookingForm.reportValidity()) return;
          formFields.hidden = true;
          formSuccess.style.display = "block";
          formSuccess.focus();
        });
      }

      const year = document.querySelector("#year");
      if (year) year.textContent = new Date().getFullYear();
