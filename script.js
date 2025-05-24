document.addEventListener("DOMContentLoaded", () => {
  let cart = [];

  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartModal = document.getElementById("cartModal");
  const toast = document.getElementById("toast");
  const popup = document.getElementById("popup");
  const popupMsg = document.querySelector(".popup-message");
  const searchInput = document.getElementById("searchInput");
  const suggestionsEl = document.getElementById("suggestions");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const sideMenu = document.getElementById("sideMenu");
  const sideMenuClose = document.getElementById("sideMenuClose");

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".menu-item");
      const name = item.querySelector("h3").textContent;
      const price = parseInt(item.querySelector("p:nth-of-type(2)").textContent.replace("Price: ₹", ""));
      const qty = parseInt(item.querySelector(".qty-input").value) || 1;

      for (let i = 0; i < qty; i++) {
        cart.push({ name, price });
      }
      updateCartCount();
      showToast(
        `✔️ ${name} added to cart! <a href='#' onclick="openCart()" style="color:white;text-decoration:underline;margin-left:10px;">View Cart</a>`
      );
    });
  });

  function updateCartCount() {
    const count = cart.length;
    document.title = `College Cafe (${count})`;

    const badge = document.getElementById("cartCountBadge");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }

    const cartBtn = document.getElementById("cartButton");
    if (cartBtn) {
      cartBtn.textContent = `Cart (${count})`;
    }
  }

  window.openCart = function () {
    cartItemsEl.innerHTML = "";
    const grouped = {};

    cart.forEach((item) => {
      grouped[item.name] = grouped[item.name] || { qty: 0, price: item.price };
      grouped[item.name].qty++;
    });

    let total = 0;
    for (let name in grouped) {
      const { qty, price } = grouped[name];
      total += qty * price;

      const li = document.createElement("li");
      li.textContent = `${name} x${qty} – ₹${qty * price}`;
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.innerHTML = "&times;";
      removeBtn.onclick = () => removeItem(name);
      li.appendChild(removeBtn);
      cartItemsEl.appendChild(li);
    }

    cartTotalEl.innerHTML = `<strong>Total: ₹${total}</strong>`;
    cartModal.classList.remove("hidden");
  };

  window.closeCart = function () {
    cartModal.classList.add("hidden");
  };

  window.removeItem = function (name) {
    cart = cart.filter((item) => item.name !== name);
    updateCartCount();
    openCart();
  };

  placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showPopup("Your cart is empty!");
      return;
    }

    const order = {
      items: [],
      total: 0,
      status: "Preparing",
    };

    cart.forEach((item) => {
      const existing = order.items.find((i) => i.name === item.name);
      if (existing) {
        existing.qty++;
      } else {
        order.items.push({ name: item.name, qty: 1 });
      }
      order.total += item.price;
    });

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    showPopup("Order Placed");
    cart = [];
    updateCartCount();

    setTimeout(() => {
      window.location.href = "orders.html";
    }, 2000);
  });

  function showToast(message) {
    toast.innerHTML = message;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 2500);
  }

  function showPopup(message) {
    popupMsg.textContent = message;
    popup.classList.remove("hidden");
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 2000);
  }

  const foodNames = Array.from(document.querySelectorAll(".menu-item")).map((item) => ({
    name: item.querySelector("h3").textContent,
    element: item,
  }));

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    suggestionsEl.innerHTML = "";

    if (!term) {
      suggestionsEl.style.display = "none";
      return;
    }

    const matches = foodNames.filter((f) => f.name.toLowerCase().includes(term));
    if (matches.length === 0) {
      suggestionsEl.style.display = "none";
      return;
    }

    matches.forEach((match) => {
      const li = document.createElement("li");
      li.textContent = match.name;
      li.addEventListener("click", () => {
        match.element.scrollIntoView({ behavior: "smooth", block: "center" });
        suggestionsEl.style.display = "none";
        searchInput.value = match.name;
      });
      suggestionsEl.appendChild(li);
    });

    suggestionsEl.style.display = "block";
  });

  document.getElementById("menuToggle").addEventListener("click", () => {
    sideMenu.classList.remove("hidden");
    sideMenu.style.transform = "translateX(0)";
  });

  sideMenuClose.addEventListener("click", () => {
    sideMenu.style.transform = "translateX(-100%)";
    setTimeout(() => sideMenu.classList.add("hidden"), 300);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#sideMenu") && !e.target.closest("#menuToggle")) {
      sideMenu.style.transform = "translateX(-100%)";
      setTimeout(() => sideMenu.classList.add("hidden"), 300);
    }
    if (!e.target.closest(".search-container")) {
      suggestionsEl.style.display = "none";
    }
  });

  // Slider
  let currentSlide = 0;
  const slides = document.querySelectorAll("#slider .slide");
  const dotsContainer = document.getElementById("sliderDots");

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentSlide = i;
      showSlide(currentSlide);
      updateDots();
    });
    dotsContainer.appendChild(dot);
  });

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }

  function updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    updateDots();
  }

  setInterval(nextSlide, 3000);
});