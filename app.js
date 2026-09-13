// Sample product data (in a real application, this would come from a backend)
const products = [
    {
        id: 1,
        name: "iPhone 14 Pro",
        price: 999,
        image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&w=800",
        description: "The latest iPhone with amazing camera capabilities"
    },
    {
        id: 2,
        name: "Samsung Galaxy S23",
        price: 899,
        image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&w=800",
        description: "Powerful Android flagship with stunning display"
    },
    {
        id: 3,
        name: "Google Pixel 7",
        price: 799,
        image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&w=800",
        description: "Pure Android experience with exceptional camera"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartCount = document.querySelector('.cart-count');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = document.querySelector('.close');

// Display products
function displayProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">$${product.price}</p>
                <button onclick="addToCart(${product.id})" class="cta-button">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification('Product added to cart!');
    }
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Modal functionality
loginBtn.onclick = () => {
    loginModal.style.display = "block";
}

closeBtn.onclick = () => {
    loginModal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
}

// Form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;
    
    // Here you would typically make an API call to authenticate
    console.log('Login attempt:', { email, password });
    showNotification('Login successful!');
    loginModal.style.display = "none";
});

// Initialize the page
displayProducts();

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
