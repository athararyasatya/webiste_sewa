  document.addEventListener("DOMContentLoaded", function () {
    const categoryRadios = document.querySelectorAll('input[name="filterCategory"]');
    const productContainer = document.querySelector(".row.g-4");
    const productCount = document.getElementById("productCount");

    // Simpan semua produk awal
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

      // Render ulang produk
      productContainer.innerHTML = "";
      filtered.forEach(prod => productContainer.appendChild(prod));

      // Update jumlah produk
      productCount.innerHTML = `Menampilkan <strong>1–${filtered.length}</strong> dari ${allProducts.length} kostum`;
    }

    // Listener
    categoryRadios.forEach(radio => radio.addEventListener("change", filterByCategory));

    // Inisialisasi awal
    filterByCategory();
  });