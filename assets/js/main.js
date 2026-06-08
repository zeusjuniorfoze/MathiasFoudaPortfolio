

(function() {
  "use strict";

  /**
   * Gestion du bouton de basculement du header
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header')?.classList.toggle('header-show');
    headerToggleBtn?.classList.toggle('bi-list');
    headerToggleBtn?.classList.toggle('bi-x');
  }

  // Ajout d'un événement de clic sur le bouton de basculement du header
  headerToggleBtn?.addEventListener('click', headerToggle);

  /**
   * Masquer la navigation mobile lors de la navigation vers des liens de la même page ou de liens avec des ancres
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle(); // Masquer le menu mobile si un lien est cliqué
      }
    });
  });

  /**
   * Basculer les sous-menus déroulants dans la navigation mobile
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling?.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Gestion du préchargement
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Bouton pour remonter en haut de la page
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add('active')
        : scrollTop.classList.remove('active');
    }
  }

  scrollTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Initialiser l'animation lors du défilement (AOS)
   */
  function aosInit() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }

  window.addEventListener('load', aosInit);

  /**
   * Initialiser le texte animé avec typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');

    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initialiser le compteur (Pure Counter)
   */
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }

  /**
   * Animer les éléments de compétence lors de leur apparition à l'écran
   * ✔ Remplacement de Waypoint + DOM deprecated safe
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');

  if (typeof Waypoint !== "undefined") {
    skillsAnimation.forEach((item) => {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function() {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    });
  }

  /**
   * Initialiser GLightbox pour les galeries d'images
   */
  if (typeof GLightbox !== "undefined") {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Initialiser la mise en page et les filtres d'Isotope
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {

    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;

    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {

      initIsotope = new Isotope(
        isotopeItem.querySelector('.isotope-container'),
        {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        }
      );

      // Au chargement : afficher featured si nécessaire
      if (filter === '*') {
        initIsotope.arrange({
          filter: '.featured-item'
        });
      }

    });

    // Gestion des filtres
    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {

      filters.addEventListener('click', function() {

        isotopeItem
          .querySelector('.isotope-filters .filter-active')
          ?.classList.remove('filter-active');

        this.classList.add('filter-active');

        let selectedFilter = this.getAttribute('data-filter');

        if (selectedFilter === '*') {
          initIsotope.arrange({
            filter: '.featured-item'
          });
        } else {
          initIsotope.arrange({
            filter: selectedFilter
          });
        }

        if (typeof aosInit === 'function') {
          aosInit();
        }

      });

    });

  });

  /**
   * CORRECTION IMPORTANTE : scroll vers ancre
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Scrollspy navigation
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    let position = window.scrollY + 200;

    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;

      let section = document.querySelector(navmenulink.hash);
      if (!section) return;

      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document.querySelectorAll('.navmenu a.active')
          .forEach(link => link.classList.remove('active'));

        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * 🔥 NOUVEAU : MutationObserver (remplace DOMNodeInsertedIntoDocument)
   * Si ton site injecte du contenu dynamiquement
   */
  const observerTarget = document.body;

  const observer = new MutationObserver(() => {
    // Réinitialiser scrollspy si DOM change
    navmenuScrollspy();

    // Réinitialiser AOS si contenu dynamique
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  });

  observer.observe(observerTarget, {
    childList: true,
    subtree: true
  });

})();