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
