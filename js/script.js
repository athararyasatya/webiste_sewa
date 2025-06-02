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

  document.addEventListener("DOMContentLoaded", () => {
  const cartSidebar = document.getElementById('offcanvasCart');
  let mapInitialized = false;

  cartSidebar.addEventListener('shown.bs.offcanvas', () => {
    if (!mapInitialized) {
      const storeLatLng = [ -6.200000, 106.816666 ]; // Contoh lokasi toko (Jakarta)
      const map = L.map('map').setView(storeLatLng, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const tokoIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const userIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      L.marker(storeLatLng, { icon: tokoIcon }).addTo(map).bindPopup("Lokasi CCC Rental");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const userLatLng = [position.coords.latitude, position.coords.longitude];
          L.marker(userLatLng, { icon: userIcon }).addTo(map).bindPopup("Lokasi Anda");

          L.Routing.control({
            waypoints: [
              L.latLng(storeLatLng),
              L.latLng(userLatLng)
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            lineOptions: {
              styles: [{ color: "#5b21b6", weight: 5 }]
            },
            createMarker: () => null
          }).addTo(map);

          document.getElementById('distanceInfo').style.display = "none";
        }, () => {
          document.getElementById('distanceInfo').textContent = "Gagal mendapatkan lokasi pengguna.";
        });
      } else {
        document.getElementById('distanceInfo').textContent = "Geolokasi tidak didukung browser.";
      }

      mapInitialized = true;
    }
  });
});
