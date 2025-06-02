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
  const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasCart);

  if (
    offcanvasInstance &&
    offcanvasCart.classList.contains("show") &&
    !offcanvasCart.contains(event.target)
  ) {
    offcanvasInstance.hide();
  }
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
