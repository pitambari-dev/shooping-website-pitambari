// Get HTML Elements
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartButton = document.getElementById("cartButton");
const cartSection = document.getElementById("cartSection");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const productCount = document.getElementById("productCount");

// Store Products and Cart Items
let products = [];
let cart = [];

// Format price in Indian Rupees
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Load Products from products.json using Fetch API
async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        productContainer.innerHTML =
            '<p class="no-products">Unable to load products. Please run the website using a local server.</p>';

        console.error("Error:", error);

    }
}

// Display Products on Website
function displayProducts(productList) {

    productContainer.innerHTML = "";

    productCount.textContent =
        productList.length + " Products";

    if (productList.length === 0) {

        productContainer.innerHTML =
            '<p class="no-products">No products found!</p>';

        return;
    }

    productList.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `

            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>

            <p class="product-category">
                ${product.category}
            </p>

            <h3 class="product-name">
                ${product.name}
            </h3>

            <p class="product-rating">
                ★★★★★
                <span>${product.rating}/5</span>
            </p>

            <div class="product-bottom">

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

                <button
                    class="add-cart-btn"
                    data-id="${product.id}">
                    Add to Cart
                </button>

            </div>
        `;

        productContainer.appendChild(productCard);

    });

}

// Search Products
function searchProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        return product.name.toLowerCase().includes(searchValue) ||
               product.category.toLowerCase().includes(searchValue);

    });

    displayProducts(filteredProducts);

}

// Search when button is clicked
searchBtn.addEventListener("click", searchProducts);

// Search while typing
searchInput.addEventListener("input", searchProducts);


// Add Product to Cart
function addToCart(productId) {

    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

}

// Handle Add to Cart Button Clicks
productContainer.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart-btn");

    if (button) {

        const productId = Number(button.dataset.id);

        addToCart(productId);

    }

});


// Update Shopping Cart
function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        totalItems += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>${formatPrice(item.price)}</p>

                <div class="quantity-controls">

                    <button data-action="decrease" data-id="${item.id}">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button data-action="increase" data-id="${item.id}">
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-btn"
                data-action="remove"
                data-id="${item.id}"
                aria-label="Remove ${item.name}">
                ✕
            </button>

        `;

        cartItems.appendChild(cartItem);

    });

    // Update Cart Count
    cartCount.textContent = totalItems;

    // Update Cart Total
    cartTotal.textContent = formatPrice(total);

    // Disable checkout if cart is empty
    checkoutBtn.disabled = cart.length === 0;

}


// Handle Cart Quantity and Remove Buttons
cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(product => product.id === productId);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(product => product.id !== productId);

        }

    }

    else if (action === "remove") {

        cart = cart.filter(product => product.id !== productId);

    }

    updateCart();

});


// Open Cart
function openCart() {

    cartSection.classList.add("active");

    overlay.classList.add("active");

}

// Close Cart
function hideCart() {

    cartSection.classList.remove("active");

    overlay.classList.remove("active");

}

// Cart Button Click
cartButton.addEventListener("click", openCart);

// Close Button Click
closeCart.addEventListener("click", hideCart);

// Close Cart by Clicking Overlay
overlay.addEventListener("click", hideCart);


// Checkout Button
checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) return;

    alert("Thank you for shopping with ShopZone! Your demo order is ready.");

    cart = [];

    updateCart();

    hideCart();

});


// Start Website
loadProducts();

updateCart();