// Global Variables
const productGrid = document.getElementById('productGrid');
const apiUrl = 'https://fakestoreapi.com/products';
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Initialize cart from localStorage

// Fetch Products
fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        renderProducts(allProducts);
    });

// Render Products
function renderProducts(products) {
    productGrid.innerHTML = '';
    products.forEach(product => {
        productGrid.innerHTML += `
            <div class="col">
                <div class="card product-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="text-success">$${product.price}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Add to Cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);

    if (product) {
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1; // Increment quantity if already in cart
        } else {
            cart.push({ ...product, quantity: 1 }); // Add new product with quantity 1
        }

        localStorage.setItem('cart', JSON.stringify(cart)); // Persist cart to localStorage
        updateCartCount(); // Update the cart count badge dynamically
        alert(`${product.title} added to the cart!`);
    }
}


// Filter Products Function
function filterProducts(category) {
    let filteredProducts = allProducts;

    if (category !== 'all') {
        filteredProducts = allProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }

    renderProducts(filteredProducts);
}



// cart.js


       

// Display Cart Items and Order Summary
function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const orderSummary = document.getElementById('orderSummary');
    const orderSummaryDetails = document.getElementById('orderSummaryDetails');
    const cartStatus = document.getElementById('cartStatus');
    const productCount = document.getElementById('productCount');
    const totalPrice = document.getElementById('totalPrice');
    const finalAmount = document.getElementById('finalAmount');
    const cartCountBadge = document.getElementById('cartCount'); // Badge in the navbar

    if (cart.length === 0) {
        cartStatus.textContent = 'Your Cart is Empty';
        cartItemsDiv.innerHTML = '';
        orderSummary.innerHTML = '<tr><td colspan="3" class="text-center">No items in the cart</td></tr>';
        productCount.textContent = 0;
        totalPrice.textContent = '$0';
        finalAmount.textContent = '$30'; // Shipping cost only
        cartCountBadge.textContent = '0'; // Update badge to show 0
        cartCountBadge.style.display = 'none'; // Hide badge when cart is empty
    } else {
        cartStatus.textContent = 'Your Cart';
        let totalAmount = 0;
        let totalQuantity = 0;

        // Display cart items
        cartItemsDiv.innerHTML = '';
        cart.forEach(item => {
            cartItemsDiv.innerHTML += `
               <div class="cart-item d-flex align-items-center mb-3">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image me-3">
                    <div class="cart-item-details">
                        <h5>${item.title}</h5>
                        <p>$${item.price} x ${item.quantity}</p>
                        <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                        <div class="cart-item-controls d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateItemQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary ms-2 me-3" onclick="updateItemQuantity(${item.id}, 1)">+</button>
                            <button class="btn rm" onclick="removeItem(${item.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            totalAmount += item.price * item.quantity;
            totalQuantity += item.quantity;
        });

        // Update totals
        productCount.textContent = totalQuantity;
        totalPrice.textContent = `$${totalAmount.toFixed(2)}`;
        finalAmount.textContent = `$${(totalAmount + 30).toFixed(2)}`; // Add $30 shipping

        // Update cart count badge
        cartCountBadge.textContent = totalQuantity;
        cartCountBadge.style.display = 'block'; // Show badge when cart is not empty
    }
}


// Update item quantity (add or subtract)
function updateItemQuantity(productId, change) {
    const item = cart.find(product => product.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== productId);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Remove item from cart
function removeItem(productId) {
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Initial display of cart
document.addEventListener('DOMContentLoaded', displayCart);

// Update Cart Count Globally
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountBadge = document.getElementById('cartCount');
    if (cartCountBadge) {
        cartCountBadge.textContent = totalQuantity;
    }
}

// Run the function on page load
document.addEventListener('DOMContentLoaded', updateCartCount);


