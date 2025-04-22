// Global variables
let products = [];
let cart = [];
let categories = [
  { name: 'Men', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Women', image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Jewelry', image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Electronics', image: 'https://images.pexels.com/photos/1337753/pexels-photo-1337753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'New Arrivals', image: 'https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();
  loadCart();
  setupEventListeners();
});

// Function to fetch products from FakeStoreAPI
async function loadProducts() {
  try {
    showLoader('#product-list');
    const response = await fetch('https://fakestoreapi.com/products');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('product-list').innerHTML = `
      <div class="col-12 text-center">
        <p>Failed to load products. Please try again later.</p>
      </div>
    `;
  }
}

// Function to display products
function displayProducts(productsToDisplay) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  
  if (productsToDisplay.length === 0) {
    productList.innerHTML = `
      <div class="col-12 text-center">
        <p>No products found in this category.</p>
      </div>
    `;
    return;
  }
  
  productsToDisplay.forEach((product, index) => {
    // Determine if product is new or on sale (for demo purposes)
    const isNew = index % 7 === 0;
    const isOnSale = index % 5 === 0;
    
    const productCard = document.createElement('div');
    productCard.classList.add('col-md-3', 'col-sm-6', 'mb-4', 'animate-fade');
    productCard.style.animationDelay = `${index * 0.1}s`;
    
    productCard.innerHTML = `
      <div class="product-card" data-category="${product.category.replace(/[\'s]/g, '')}">
        <div class="product-img-container">
          <img src="${product.image}" class="product-img" alt="${product.title}">
          ${isNew ? '<span class="product-badge badge-new">New</span>' : ''}
          ${isOnSale ? '<span class="product-badge badge-sale">Sale</span>' : ''}
        </div>
        <div class="product-details">
          <h5 class="product-title" title="${product.title}">${product.title}</h5>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="btn btn-primary add-to-cart" data-id="${product.id}">
            <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
          </button>
        </div>
      </div>
    `;
    
    productList.appendChild(productCard);
  });
  
  // Add event listeners to the newly added buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCartHandler);
  });
}

// Function to load categories
function loadCategories() {
  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = '';
  
  categories.forEach((category, index) => {
    const categoryCol = document.createElement('div');
    categoryCol.classList.add('col-lg-4', 'col-md-6', 'animate-fade');
    categoryCol.style.animationDelay = `${index * 0.1}s`;
    
    categoryCol.innerHTML = `
      <div class="category-card">
        <img src="${category.image}" alt="${category.name}">
        <div class="category-overlay">
          <h3 class="category-title">${category.name}</h3>
        </div>
      </div>
    `;
    
    categoryList.appendChild(categoryCol);
  });
}

// Function to handle "Add to Cart"
function addToCartHandler(event) {
  const productId = parseInt(event.currentTarget.getAttribute('data-id'));
  const product = products.find(p => p.id === productId);
  
  if (product) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update UI
    updateCartCount();
    
    // Show toast notification
    showToast(`${product.title} added to cart!`);
  }
}

// Function to save cart to localStorage
function saveCart() {
  localStorage.setItem('clothifyCart', JSON.stringify(cart));
}

// Function to load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('clothifyCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

// Function to update cart count in the UI
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Add pulse animation when cart count changes
  cartCount.classList.remove('pulse');
  void cartCount.offsetWidth; // Force reflow to restart animation
  cartCount.classList.add('pulse');
}

// Function to show toast notification
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  
  toast.innerHTML = `
    <i class="fas fa-check-circle mr-2"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

// Function to filter products by category
function filterProducts(category) {
  let filteredProducts;
  
  if (category === 'all') {
    filteredProducts = products;
  } else {
    // Filter by category from the API
    filteredProducts = products.filter(product => {
      const productCategory = product.category.toLowerCase();
      
      // Map the API categories to our filter categories
      if (category === 'men' && productCategory.includes("men")) {
        return true;
      } else if (category === 'women' && productCategory.includes("women")) {
        return true;
      } else if (category === 'jewelry' && productCategory.includes("jewelery")) {
        return true;
      } else if (category === 'electronics' && productCategory.includes("electronics")) {
        return true;
      }
      
      return false;
    });
  }
  
  displayProducts(filteredProducts);
}

// Show loader while content is loading
function showLoader(targetSelector) {
  const target = document.querySelector(targetSelector);
  target.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2">Loading content...</p>
    </div>
  `;
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      // Update active class
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      e.currentTarget.classList.add('active');
      
      // Filter products
      const filter = e.currentTarget.getAttribute('data-filter');
      filterProducts(filter);
    });
  });
  
  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast('Thank you for subscribing to our newsletter!');
        emailInput.value = '';
      }
    });
    
    // Also trigger on button click
    const subscribeBtn = newsletterForm.querySelector('button');
    if (subscribeBtn) {
      subscribeBtn.addEventListener('click', () => {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          showToast('Thank you for subscribing to our newsletter!');
          emailInput.value = '';
        }
      });
    }
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for navbar height
          behavior: 'smooth'
        });
      }
    });
  });
}

// Add CSS animation for cart badge
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  
  .pulse {
    animation: pulse 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);