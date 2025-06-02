
document.addEventListener("DOMContentLoaded", () => {
  // === BAGIAN 1: PETA & RUTE ===
  const cartSidebar = document.getElementById('offcanvasCart');
  let mapInitialized = false;

  cartSidebar.addEventListener('shown.bs.offcanvas', () => {
    if (mapInitialized) return;

    const storeLatLng = [-6.200000, 106.816666];
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

    L.marker(storeLatLng, { icon: tokoIcon }).addTo(map).bindPopup("📍 CCC Rental (Toko)").openPopup();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLatLng = [position.coords.latitude, position.coords.longitude];

        L.marker(userLatLng, { icon: userIcon }).addTo(map).bindPopup("👤 Lokasi Anda").openPopup();

        const routingControl = L.Routing.control({
          waypoints: [ L.latLng(storeLatLng), L.latLng(userLatLng) ],
          routeWhileDragging: false,
          addWaypoints: false,
          show: false,
          createMarker: () => null,
          lineOptions: {
            styles: [{ color: '#5b21b6', weight: 5 }]
          }
        }).addTo(map);

        routingControl.on('routesfound', function (e) {
          const route = e.routes[0];
          const distanceInKm = (route.summary.totalDistance / 1000).toFixed(2);
          document.getElementById('distanceInfo').textContent = `Jarak ke lokasi Anda: ${distanceInKm} km`;

          const bounds = L.latLngBounds(route.coordinates);
          map.fitBounds(bounds.pad(0.2));
        });

      }, () => {
        document.getElementById('distanceInfo').textContent = "Gagal mendapatkan lokasi pengguna.";
      });
    } else {
      document.getElementById('distanceInfo').textContent = "Geolokasi tidak didukung browser.";
    }

    mapInitialized = true;
  });

  // === BAGIAN 2: KATEGORI PRODUK ===
  const categoryRadios = document.querySelectorAll('input[name="filterCategory"]');
  const productContainer = document.querySelector(".row.g-4");
  const productCount = document.getElementById("productCount");
  const allProducts = Array.from(productContainer.children);

  function filterByCategory() {
    const selectedCategory = document.querySelector('input[name="filterCategory"]:checked').id;
    let filtered = allProducts;

    if (selectedCategory !== "Semua") {
      filtered = allProducts.filter(product => {
        const category = product.getAttribute("data-category");
        return category === selectedCategory;
      });
    }

    productContainer.innerHTML = "";
    filtered.forEach(prod => productContainer.appendChild(prod));

    productCount.innerHTML = `Menampilkan <strong>1–${filtered.length}</strong> dari ${allProducts.length} kostum`;
  }

  categoryRadios.forEach(radio => radio.addEventListener("change", filterByCategory));
  filterByCategory();
});



