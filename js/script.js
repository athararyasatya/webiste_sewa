  document.addEventListener("click", function (event) {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector("#navbarNav");

    const isClickInsideNavbar = navbarCollapse.contains(event.target) || navbarToggler.contains(event.target);
    const isNavbarShown = navbarCollapse.classList.contains("show");

    if (!isClickInsideNavbar && isNavbarShown) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: true
      });
    }
  });