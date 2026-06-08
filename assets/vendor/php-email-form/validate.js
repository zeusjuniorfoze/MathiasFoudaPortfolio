(function () {
  "use strict";

  const phoneNumber = "237694851195"; // WhatsApp sans +

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      // reset messages
      clearMessages(thisForm);

      // récupérer les champs
      let formData = new FormData(thisForm);

      // 🔥 validation simple : vérifier champs vides
      let isValid = true;
      let emptyFields = [];

      formData.forEach((value, key) => {
        if (!value || value.trim() === "") {
          isValid = false;
          emptyFields.push(key);
        }
      });

      if (!isValid) {
        showError(
          thisForm,
          "⚠️ Veuillez remplir tous les champs obligatoires : " +
          emptyFields.join(", ")
        );
        return;
      }

      // afficher loading (optionnel si tu as .loading)
      showLoading(thisForm);

      // construire message WhatsApp
      let message = "📩 Nouveau message depuis votre Portfolio :\n\n";

      formData.forEach((value, key) => {
        message += `${capitalize(key)} : ${value}\n`;
      });

      let encodedMessage = encodeURIComponent(message);

      let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // petit délai pour UX
      setTimeout(() => {
        hideLoading(thisForm);
        window.open(whatsappURL, "_blank");
        showSuccess(thisForm, "✅ Redirection vers WhatsApp...");
      }, 600);
    });
  });

  /**
   * UTILITAIRES UI
   */

  function showLoading(form) {
    let el = form.querySelector('.loading');
    if (el) el.classList.add('d-block');
  }

  function hideLoading(form) {
    let el = form.querySelector('.loading');
    if (el) el.classList.remove('d-block');
  }

  function showError(form, msg) {
    let el = form.querySelector('.error-message');
    if (el) {
      el.innerHTML = msg;
      el.classList.add('d-block');
    }
  }

  function showSuccess(form, msg) {
    let el = form.querySelector('.sent-message');
    if (el) {
      el.innerHTML = msg;
      el.classList.add('d-block');
    }
  }

  function clearMessages(form) {
    let error = form.querySelector('.error-message');
    let success = form.querySelector('.sent-message');

    if (error) error.classList.remove('d-block');
    if (success) success.classList.remove('d-block');
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

})();