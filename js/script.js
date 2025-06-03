document.addEventListener("click", function (event) {
  // Navbar logic
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector("#navbarNav");

  const isClickInsideNavbar = navbarCollapse.contains(event.target) || navbarToggler.contains(event.target);
  const isNavbarShown = navbarCollapse.classList.contains("show");

  if (!isClickInsideNavbar && isNavbarShown) {
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
      toggle: true
    });
  }

  // Offcanvas Cart logic
  const offcanvasCart = document.getElementById("offcanvasCart");
  const overlayDark = document.getElementById("overlay-dark");
  const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasCart);

  if (
    offcanvasInstance &&
    offcanvasCart.classList.contains("show") &&
    !offcanvasCart.contains(event.target)
  ) {
    offcanvasInstance.hide();
  }

  // Klik overlay = tutup offcanvas
  if (event.target === overlayDark && offcanvasInstance) {
    offcanvasInstance.hide();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');

  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      eyeIcon.classList.toggle('bi-eye');
      eyeIcon.classList.toggle('bi-eye-slash');
    });
  }

  // Overlay logic ketika offcanvas dibuka / ditutup
  const offcanvasCart = document.getElementById('offcanvasCart');
  const overlayDark = document.getElementById('overlay-dark');

  offcanvasCart.addEventListener('show.bs.offcanvas', () => {
    overlayDark.classList.add('show');
  });

  offcanvasCart.addEventListener('hidden.bs.offcanvas', () => {
    overlayDark.classList.remove('show');
  });
});

 document.addEventListener("DOMContentLoaded", function () {
      const togglePassword = document.getElementById('togglePassword');
      const passwordInput = document.getElementById('password');
      const eyeIcon = document.getElementById('eyeIcon');

      togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon.classList.toggle('bi-eye');
        eyeIcon.classList.toggle('bi-eye-slash');
      });
    });


  const collapseElement = document.getElementById('alurPenyewaan');
  const arrowIcon = document.getElementById('arrowIcon');

  collapseElement.addEventListener('show.bs.collapse', function () {
    arrowIcon.classList.add('rotate-180');
  });

  collapseElement.addEventListener('hide.bs.collapse', function () {
    arrowIcon.classList.remove('rotate-180');
  });