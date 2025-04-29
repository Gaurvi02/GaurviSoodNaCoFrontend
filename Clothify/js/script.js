// Enhanced JavaScript for Clothify Store

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Function to fetch data from FakeStoreAPI
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to populate categories section
async function loadCategories() {
    const categories = [
        { name: 'Men', image: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
        { name: 'Women', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
        { name: 'Accessories', image: 'https://images.unsplash.com/photo-1591348122449-02525d70379b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
        { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
    ];
    
    const categoryList = document.getElementById('category-list');
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('col-md-3', 'col-sm-6', 'mb-4');
        categoryCard.innerHTML = `
            <div class="category-card card">
                <img src="${category.image}" class="card-img-top" alt="${category.name}">
                <div class="card-body">
                    <h5 class="card-title">${category.name}</h5>
                    <a href="#" class="btn btn-outline-primary btn-sm">Shop Now</a>
                </div>
            </div>
        `;
        categoryList.appendChild(categoryCard);
    });
}

// Function to populate products section
async function loadProducts() {
    const products = await fetchData('https://fakestoreapi.com/products');
    const productList = document.getElementById('product-list');
    
    products.forEach(product => {
        // Determine category for filtering
        let category = 'other';
        if (product.category.includes('men')) category = 'men';
        if (product.category.includes('women')) category = 'women';
        if (product.category.includes('jewelery')) category = 'jewelery';
        
        const stars = Math.round(product.rating.rate);
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += i <= stars ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-3', 'col-sm-6', 'mb-4', 'product-item');
        productCard.setAttribute('data-category', category);
        productCard.innerHTML = `
            <div class="product-card card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <div class="rating">${starsHTML} (${product.rating.count})</div>
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-price">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-add-to-cart" onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">
                        <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
    
    // Add filter functionality
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            document.querySelectorAll('[data-filter]').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter products
            document.querySelectorAll('.product-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Function to handle "Add to Cart"
function addToCart(id, title, price, image) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            title,
            price,
            image,
            quantity: 1
        });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Show feedback
    const feedback = document.createElement('div');
    feedback.className = 'alert alert-success position-fixed';
    feedback.style.top = '20px';
    feedback.style.right = '20px';
    feedback.style.zIndex = '9999';
    feedback.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        "${title}" added to cart!
    `;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Function to display cart items in modal
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        document.getElementById('checkout-btn').disabled = true;
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="row mb-3 align-items-center">
                <div class="col-2">
                    <img src="${item.image}" alt="${item.title}" class="img-fluid" style="max-height: 60px;">
                </div>
                <div class="col-5">
                    <h6 class="mb-1">${item.title}</h6>
                    <small class="text-muted">$${item.price.toFixed(2)} each</small>
                </div>
                <div class="col-3">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                        <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="col-2 text-right">
                    <p class="mb-0 font-weight-bold">$${itemTotal.toFixed(2)}</p>
                    <button class="btn btn-sm btn-link text-danger" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = total.toFixed(2);
    document.getElementById('checkout-btn').disabled = false;
}

// Function to update quantity
function updateQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadCategories();
    loadProducts();
    updateCartCount();
    
    // Cart icon click handler
    document.getElementById('cart-icon').addEventListener('click', function(e) {
        e.preventDefault();
        displayCart();
        $('#cartModal').modal('show');
    });
    
    // Checkout button handler
    document.getElementById('checkout-btn').addEventListener('click', function() {
        alert('Thank you for your purchase!');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        $('#cartModal').modal('hide');
    });
    
    // Newsletter form handler
    document.getElementById('newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        alert(`Thank you for subscribing with ${email}!`);
        this.reset();
    });
    
    // Contact form handler
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});