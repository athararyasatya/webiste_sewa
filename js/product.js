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


// === BAGIAN 3: CART ===
const cartBody = document.querySelector(".offcanvas-body");
const cartItemsContainer = document.createElement("div");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const cartBadge = document.getElementById("cartBadge");

cartItemsContainer.id = "dynamicCartItems";
cartItemsContainer.className = "mb-4";
cartBody.insertBefore(cartItemsContainer, document.getElementById("cartItems").nextSibling);

const buttons = document.querySelectorAll(".btn.btn-outline-dark.btn-sm:not([disabled])");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".card");
    const parentCol = card.closest("[data-category]");
    const title = card.querySelector(".card-title").textContent;
    const category = parentCol.getAttribute("data-category");
    const price = parseInt(parentCol.getAttribute("data-price"));
    const stock = parseInt(parentCol.getAttribute("data-stock")) || 1;
    const sizeElement = card.querySelector(".product-size");
    const size = sizeElement ? sizeElement.textContent.replace("Ukuran: ", "") : "N/A";
    const imageSrc = card.querySelector("img").src;

    const today = new Date();
    const startDate = formatDate(today);
    const endDate = formatDate(addDays(today, 2)); // default 3 hari
    const duration = 3;

    // === CEK STOK TERPAKAI DI KERANJANG ===
    const existingItems = [...cartItemsContainer.querySelectorAll(".cart-item")].filter(item => {
      return item.querySelector("h6").textContent === title;
    });

    if (existingItems.length >= stock) {
      alert("Stok tidak mencukupi untuk menambahkan produk ini ke keranjang.");
      return;
    }

    // === ANIMASI TERBANG ===
    const cartIcon = document.querySelector('[data-bs-target="#offcanvasCart"]');
    const imgClone = card.querySelector("img").cloneNode(true);
    const imgRect = card.querySelector("img").getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    imgClone.style.position = "fixed";
    imgClone.style.left = imgRect.left + "px";
    imgClone.style.top = imgRect.top + "px";
    imgClone.style.width = imgRect.width + "px";
    imgClone.style.height = imgRect.height + "px";
    imgClone.style.transition = "all 0.8s ease-in-out";
    imgClone.style.zIndex = 2000;
    document.body.appendChild(imgClone);

    setTimeout(() => {
      imgClone.style.left = cartRect.left + "px";
      imgClone.style.top = cartRect.top + "px";
      imgClone.style.width = "20px";
      imgClone.style.height = "20px";
      imgClone.style.opacity = "0.5";
    }, 10);

    setTimeout(() => {
      imgClone.remove();
    }, 900);

    // === ITEM BARU DI CART ===
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item d-flex gap-3 rounded shadow-sm p-3 mb-3";
    cartItem.style.background = "linear-gradient(to bottom right, #f3e8ff, #ede9fe)";
    cartItem.style.fontSize = "0.875rem";
    cartItem.setAttribute("data-stock", stock);

    cartItem.innerHTML = `
      <img src="${imageSrc}" alt="Produk" style="width: 60px; height: 60px; object-fit: cover;" class="rounded flex-shrink-0">
      <div class="d-flex justify-content-between flex-grow-1 flex-wrap">
        <div class="pe-3" style="max-width: calc(100% - 110px);">
          <h6 class="mb-1 fw-semibold" style="font-size: 0.85rem;">${title}</h6>
          <span class="badge category-badge mb-1">${category}</span>
          <div class="text-muted" style="font-size: 0.75rem;">
            <div>Ukuran: <strong>${size}</strong></div>
            <div>Stok tersedia: <strong>${stock}</strong></div>
            <span class="rental-dates">${startDate} – ${endDate}</span><br>
            <div class="rental-duration">Durasi: ${duration} hari</div>
          </div>
        </div>
        <div class="d-flex flex-column align-items-end justify-content-between" style="min-width: 100px;">
          <div class="qty-wrapper d-flex align-items-center gap-2 justify-content-end mb-2">
            <button class="qty-icon rounded px-2" style="font-size: 0.8rem;">–</button>
            <span class="qty-value" style="font-size: 0.8rem;">${duration}</span>
            <button class="qty-icon rounded px-2" style="font-size: 0.8rem;">+</button>
          </div>
          <div class="fw-semibold text-dark price" style="font-size: 0.875rem;" data-base-price="${price}">
            Rp${price.toLocaleString()}
          </div>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
    updateTotal();
    updateBadge();

    const qtyMinus = cartItem.querySelector(".qty-wrapper button:first-child");
    const qtyPlus = cartItem.querySelector(".qty-wrapper button:last-child");
    const qtyValue = cartItem.querySelector(".qty-wrapper .qty-value");
    const priceDisplay = cartItem.querySelector(".price");
    const rentalDates = cartItem.querySelector(".rental-dates");
    const rentalDuration = cartItem.querySelector(".rental-duration");

    qtyMinus.addEventListener("click", (event) => {
      event.stopPropagation();
      let duration = parseInt(qtyValue.textContent);
      if (duration > 3) {
        duration -= 3;
        qtyValue.textContent = duration;
        rentalDates.textContent = `${formatDate(today)} – ${formatDate(addDays(today, duration - 1))}`;
        rentalDuration.textContent = `Durasi: ${duration} hari`;
      } else {
        cartItem.remove();
      }
      updateTotal();
      updateBadge();
    });

    qtyPlus.addEventListener("click", (event) => {
      event.stopPropagation();
      let duration = parseInt(qtyValue.textContent);
      const stock = parseInt(cartItem.getAttribute("data-stock"));
      const currentItems = cartItemsContainer.querySelectorAll(".cart-item").length;

      if (currentItems > stock - 1) {
        alert("Stok tidak mencukupi.");
        return;
      }

      duration += 3;
      qtyValue.textContent = duration;
      rentalDates.textContent = `${formatDate(today)} – ${formatDate(addDays(today, duration - 1))}`;
      rentalDuration.textContent = `Durasi: ${duration} hari`;
      updateTotal();
      updateBadge();
    });
  });
});

// === HITUNG TOTAL DAN BADGE ===
function updateTotal() {
  const allItems = cartItemsContainer.querySelectorAll(".cart-item");
  let newSubtotal = 0;

  allItems.forEach(item => {
    const qty = parseInt(item.querySelector(".qty-value").textContent);
    const basePrice = parseInt(item.querySelector(".price").getAttribute("data-base-price"));
    const total = basePrice * (qty / 3);
    newSubtotal += total;
    item.querySelector(".price").textContent = `Rp${total.toLocaleString()}`;
  });

  subtotalElement.textContent = `Rp${newSubtotal.toLocaleString()}`;
  totalElement.textContent = `Rp${newSubtotal.toLocaleString()}`;
}

function updateBadge() {
  const allItems = cartItemsContainer.querySelectorAll(".cart-item");
  const totalItems = allItems.length;

  if (totalItems > 0) {
    cartBadge.style.display = "inline-block";
    cartBadge.textContent = totalItems;
  } else {
    cartBadge.style.display = "none";
  }
}

// === TANGGAL ===
function formatDate(date) {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("id-ID", options);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}



});


// === BAGIAN 4: DROPDOWN KETERSEDIAAN PRODUK ===
document.querySelectorAll('.toggle-availability').forEach(button => {
  button.addEventListener('click', function (e) {
    e.stopPropagation();
    const dropdown = this.closest('.availability-dropdown');
    dropdown.classList.toggle('show');

    // Tutup dropdown lain
    document.querySelectorAll('.availability-dropdown').forEach(item => {
      if (item !== dropdown) item.classList.remove('show');
    });
  });
});

document.addEventListener('click', function (e) {
  document.querySelectorAll('.availability-dropdown').forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
});

