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

// === BAGIAN 3: CART ===
const cartBody = document.querySelector(".offcanvas-body");
const cartItemsContainer = document.createElement("div");
const subtotalElement = document.querySelector(".offcanvas-body .border-top .d-flex:nth-child(1) span:last-child");
const totalElement = document.querySelector(".offcanvas-body .border-top .d-flex:nth-child(2) span:last-child");
const cartBadge = document.getElementById("cartBadge");

cartItemsContainer.id = "dynamicCartItems";
cartItemsContainer.className = "mb-4";
cartBody.insertBefore(cartItemsContainer, cartBody.querySelector(".mb-3.mt-4"));

const buttons = document.querySelectorAll(".btn.btn-outline-dark.btn-sm:not([disabled])");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".card");
    const title = card.querySelector(".card-title").textContent;
    const category = card.parentElement.getAttribute("data-category");
    const price = parseInt(card.parentElement.getAttribute("data-price"));
    const imageSrc = card.querySelector("img").src;
    const uniqueID = Date.now();

    // === ANIMASI TERBANG KE KERANJANG ===
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

    cartItem.innerHTML = `
      <img src="${imageSrc}" alt="Produk" style="width: 60px; height: 60px; object-fit: cover;" class="rounded flex-shrink-0">
      <div class="d-flex justify-content-between flex-grow-1 flex-wrap">
        <div class="pe-3" style="max-width: calc(100% - 110px);">
          <h6 class="mb-1 fw-semibold" style="font-size: 0.85rem;">${title}</h6>
          <span class="badge category-badge mb-1">${category}</span>
          <p class="size-label mb-1" style="font-size: 0.8rem;">Pilih Ukuran:</p>
          <div class="d-flex gap-2 mb-2">
            <input type="radio" class="btn-check" name="size${uniqueID}" id="sizeM${uniqueID}" autocomplete="off">
            <label class="btn size-circle" for="sizeM${uniqueID}">M</label>
            <input type="radio" class="btn-check" name="size${uniqueID}" id="sizeL${uniqueID}" autocomplete="off" checked>
            <label class="btn size-circle" for="sizeL${uniqueID}">L</label>
            <input type="radio" class="btn-check" name="size${uniqueID}" id="sizeXL${uniqueID}" autocomplete="off">
            <label class="btn size-circle" for="sizeXL${uniqueID}">XL</label>
          </div>
        </div>
        <div class="d-flex flex-column align-items-end justify-content-between" style="min-width: 100px;">
          <div class="qty-wrapper d-flex align-items-center gap-2 justify-content-end mb-2">
            <button class="qty-icon rounded px-2" style="font-size: 0.8rem;">–</button>
            <span class="qty-value" style="font-size: 0.8rem;">1</span>
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

    qtyMinus.addEventListener("click", (event) => {
      event.stopPropagation(); // cegah sidebar nutup
      let qty = parseInt(qtyValue.textContent);
      if (qty > 1) {
        qty--;
        qtyValue.textContent = qty;
      } else {
        cartItem.remove();
      }
      updateTotal();
      updateBadge();
    });

    qtyPlus.addEventListener("click", (event) => {
      event.stopPropagation();
      let qty = parseInt(qtyValue.textContent);
      qty++;
      qtyValue.textContent = qty;
      updateTotal();
      updateBadge();
    });
  });
});

// === FUNGSI HITUNG TOTAL DAN BADGE ===
function updateTotal() {
  const allItems = cartItemsContainer.querySelectorAll(".cart-item");
  let newSubtotal = 0;

  allItems.forEach(item => {
    const qty = parseInt(item.querySelector(".qty-value").textContent);
    const basePrice = parseInt(item.querySelector(".price").getAttribute("data-base-price"));
    newSubtotal += basePrice * qty;

    item.querySelector(".price").textContent = `Rp${(basePrice * qty).toLocaleString()}`;
  });

  subtotalElement.textContent = `Rp${newSubtotal.toLocaleString()}`;
  totalElement.textContent = `Rp${newSubtotal.toLocaleString()}`;
}

function updateBadge() {
  const allItems = cartItemsContainer.querySelectorAll(".cart-item");
  let totalQty = 0;

  allItems.forEach(item => {
    totalQty += parseInt(item.querySelector(".qty-value").textContent);
  });

  if (totalQty > 0) {
    cartBadge.style.display = "inline-block";
    cartBadge.textContent = totalQty;
  } else {
    cartBadge.style.display = "none";
  }
}


});
