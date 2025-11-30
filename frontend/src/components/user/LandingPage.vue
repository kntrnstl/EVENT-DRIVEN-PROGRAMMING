<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// 1. STATE FOR SLIDESHOW
const currentSlideIndex = ref(0);
let slideInterval = null;
const images = ref([]);

// 2. STATE FOR DATA FETCHING
const featuredProducts = ref([]);

// 3. STATE FOR UI
const userDropdownOpen = ref(false);
const currentUser = ref({
  username: 'Guest',
  email: 'guest@example.com',
});

// 4. SLIDESHOW LOGIC
const importImages = () => {
    const imageModules = import.meta.glob('../../assets/img/*.jpg', { eager: true });
    
    const loadedImages = [];
    for (let i = 1; i <= 16; i++) {
        const url = imageModules[`../../assets/img/${i}.jpg`]?.default;
        if (url) {
            loadedImages.push(url);
        }
    }
    images.value = loadedImages;
};

const nextSlide = () => {
    if (images.value.length === 0) return;
    currentSlideIndex.value = (currentSlideIndex.value + 1) % images.value.length;
};

const startSlideshow = () => {
    stopSlideshow(); 
    slideInterval = setInterval(nextSlide, 5000);
};

const stopSlideshow = () => {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
};

// 5. USER DROPDOWN LOGIC
const toggleUserDropdown = () => {
    userDropdownOpen.value = !userDropdownOpen.value;
};

const closeDropdown = (event) => {
    if (userDropdownOpen.value && !event.target.closest('.user-dropdown')) {
        userDropdownOpen.value = false;
    }
};

const navigateTo = (routeName) => {
    userDropdownOpen.value = false;
    router.push({ name: routeName });
};

const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            currentUser.value = {
                username: user.username || 'User',
                email: user.email || 'user@example.com'
            };
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    } else {
        currentUser.value = {
            username: 'Guest',
            email: 'guest@example.com'
        };
    }
};

// 6. DATA FETCHING LOGIC
const fetchProducts = async () => {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const res = await axios.get('http://localhost:3000/api/products', { headers });
        const productsWithPrice = res.data.filter(p => p.price !== undefined && p.price !== null);
        featuredProducts.value = productsWithPrice.slice(0, 4);
    } catch (err) {
        console.error('Error fetching products:', err);
        featuredProducts.value = [];
    }
};

// 7. AUTH ACTIONS
const handleLogin = () => {
    navigateTo('auth');
};

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
    currentUser.value = {
        username: 'Guest',
        email: 'guest@example.com'
    };
    userDropdownOpen.value = false;
    router.push({ name: 'home' });
};

// 8. LIFECYCLE HOOKS
onMounted(() => {
    importImages();
    startSlideshow();
    fetchProducts();
    checkAuthStatus();
    document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
    stopSlideshow();
    document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <div class="landing-page">
    <!-- ENHANCED HEADER -->
    <nav class="navbar">
      <h1 class="logo" @click="navigateTo('home')">Oning Flip<span class="dot">.</span></h1>
      <ul class="nav-links">
        <li>
          <a @click.prevent="navigateTo('home')" :class="{ active: $route.name === 'home' }">
            <span class="nav-link-inner">Home</span>
          </a>
        </li>
        <li>
          <a @click.prevent="navigateTo('products')" :class="{ active: $route.name === 'products' }">
            <span class="nav-link-inner">Products</span>
          </a>
        </li>
        <li>
          <a @click.prevent="navigateTo('contact')" :class="{ active: $route.name === 'contact' }">
            <span class="nav-link-inner">Contact</span>
          </a>
        </li>
      </ul>
      
      <div class="header-actions">
        <!-- User Dropdown -->
        <div class="user-dropdown" @click="toggleUserDropdown">
          <div class="user-info">
            <div class="user-avatar">
              <i class="fas fa-user-circle"></i> 
            </div>
            <div class="user-details">
              <span class="username">{{ currentUser.username }}</span>
              <span class="user-email">{{ currentUser.email }}</span>
            </div>
            <i class="fas fa-chevron-down dropdown-arrow" :class="{ rotated: userDropdownOpen }"></i>
          </div>
          
          <div v-if="userDropdownOpen" class="dropdown-menu">
            <div v-if="currentUser.username !== 'Guest'" class="dropdown-item" @click="navigateTo('my-orders')">
              <i class="fas fa-box-open"></i>
              <span>My Orders</span>
            </div>
            <div v-if="currentUser.username !== 'Guest'" class="dropdown-item" @click="navigateTo('user-dashboard')">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </div>
            <div v-if="currentUser.username === 'Guest'" class="dropdown-item" @click="handleLogin">
              <i class="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </div>
            <div v-if="currentUser.username !== 'Guest'" class="dropdown-item logout" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- MAIN LANDING CONTENT -->
    <div class="home-view">
      <!-- Hero / Slideshow -->
      <div class="hero-wrapper">
        <div class="slideshow-container">
          <transition-group name="fade" tag="div">
            <img 
              v-for="(image, index) in images" 
              :key="index" 
              :src="image" 
              v-show="index === currentSlideIndex"
              class="slide-image"
              alt="Featured Footwear"
            />
          </transition-group>
        </div>
        <section class="hero-section">
          <div class="hero-content">
            <h1>Step into Style with Oning Flip!</h1>
            <p class="tagline">The perfect pair for every journey. Discover our exclusive shoe collection.</p>
            <button class="btn-shop-now" @click="navigateTo('products')">
              Find Your Next Pair &rarr;
            </button>
          </div>
        </section>
      </div>

      <!-- Main Content Sections -->
      <div class="main-content container"> 
        <!-- Categories -->
        <section class="categories-section">
          <h2 class="section-title">🏃 Shop by Shoe Type</h2>
          <div class="categories-grid">
            <div class="category-card" @click="navigateTo('products')">
              <i class="fas fa-running fa-3x category-icon"></i>
              <h3>Running</h3>
              <p>High-performance athletic gear.</p>
            </div>
            <div class="category-card" @click="navigateTo('products')">
              <i class="fas fa-shoe-prints fa-3x category-icon"></i>
              <h3>Casual Sneakers</h3>
              <p>Everyday comfort meets street style.</p>
            </div>
            <div class="category-card" @click="navigateTo('products')">
              <i class="fas fa-mountain fa-3x category-icon"></i>
              <h3>Boots & Hiking</h3>
              <p>Durable footwear for any adventure.</p>
            </div>
            <div class="category-card" @click="navigateTo('products')">
              <i class="fas fa-mitten fa-3x category-icon"></i>
              <h3>Dress & Formal</h3>
              <p>Polish your look for any occasion.</p>
            </div>
          </div>
        </section>

        <hr class="divider">

        <!-- Benefits -->
        <section class="benefits-section">
          <h2 class="section-title">💯 Why Choose Oning Flip?</h2>
          <div class="benefits-grid">
            <div class="benefit-item">
              <i class="fas fa-exchange-alt fa-2x benefit-icon"></i>
              <h3>Easy Size Swaps</h3>
              <p>Need a different size? We offer free, fast exchanges.</p>
            </div>
            <div class="benefit-item">
              <i class="fas fa-ruler-horizontal fa-2x benefit-icon"></i>
              <h3>True-to-Size Chart</h3>
              <p>Shop confidently with our verified sizing guides.</p>
            </div>
            <div class="benefit-item">
              <i class="fas fa-boxes fa-2x benefit-icon"></i>
              <h3>Carefully Packaged</h3>
              <p>Shoes delivered safely, box-fresh and ready to wear.</p>
            </div>
            <div class="benefit-item">
              <i class="fas fa-heart fa-2x benefit-icon"></i>
              <h3>Quality Materials</h3>
              <p>Durable soles and premium uppers for lasting comfort.</p>
            </div>
          </div>
        </section>

        <hr class="divider">

        <!-- Promo Banner -->
        <section class="promo-banner">
          <div class="promo-card">
            <h3>New Seasons, New Styles!</h3>
            <p>Don't miss the newest collection of limited-edition drops and fresh trends.</p>
            <button class="btn-view-all" @click="navigateTo('products')">
              Explore New Drops
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- ENHANCED FOOTER -->
    <footer class="footer">
      <div class="footer-top container">
        
        <div class="footer-section branding-socials">
          <h4>Oning Flip<span class="dot">.</span></h4>
          <p>Premium footwear crafted for <b>comfort and style</b>, ensuring quality with every step, delivered swiftly right to your door.</p>
          
          <h4>Follow Us</h4>
          <div class="social-buttons">
            <a href="https://www.facebook.com/oning.flip" target="_blank" class="social-btn facebook" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/oning.flip" target="_blank" class="social-btn instagram" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@oning.flip" target="_blank" class="social-btn tiktok" aria-label="TikTok">
              <i class="fab fa-tiktok"></i>
            </a>
            <a href="https://x.com/FlipOning" target="_blank" class="social-btn x-logo" aria-label="Twitter/X">
              <i class="fab fa-x"></i>
            </a>
          </div>
        </div>

        <div class="footer-section map-location">
          <h4>Location</h4>
          <div class="map-wrapper">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.4474379016924!2d121.0336344757423!3d14.687270774947583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b1083b843ff9%3A0x3f64e787855b8479!2sOning%20Flip!5e0!3m2!1sen!2sph!4v1763894252052!5m2!1sen!2sph" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} Oning Flip. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Add all the CSS styles from the previous example here */
/* The CSS remains exactly the same as in the previous example */
/* Make sure to include all the navbar, footer, and responsive styles */

/* ===== GLOBAL ===== */
.landing-page {
  font-family: 'Inter', sans-serif;
  color: #34495e;
  background: #f8f9fa;
  min-height: 100vh;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== ENHANCED NAVBAR STYLES ===== */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f3d2e;
  padding: 16px 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}
.logo {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 26px;
  color: #fff;
  cursor: pointer;
}
.logo .dot {
  color: #7bf2b3;
}
.nav-links {
  display: flex;
  gap: 28px;
  list-style: none;
}
.nav-links a {
  color: #d8efe3;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  position: relative;
  transition: color 0.3s;
  cursor: pointer;
}
.nav-links a:hover,
.nav-links a.active {
  color: #7bf2b3;
}
.nav-link-inner {
  display: flex;
  align-items: center;
  position: relative;
}
.nav-link-inner::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0%;
  height: 3px;
  background: #7bf2b3;
  border-radius: 2px;
  transition: width 0.3s;
}
.nav-links a:hover .nav-link-inner::after,
.nav-links a.active .nav-link-inner::after {
  width: 100%;
}

/* ===== HEADER ACTIONS ===== */
.header-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

/* User Dropdown Styles */
.user-dropdown {
  position: relative;
  cursor: pointer;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: #145943; 
  border: 1px solid #7bf2b330;
  color: #fff;
}
.user-info:hover {
  background: #196b52;
}
.user-avatar {
  width: 40px;
  height: 40px;
  background: #7bf2b3; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f3d2e; 
  font-size: 18px; 
  flex-shrink: 0;
}
.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.username {
  color: #fff; 
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}
.user-email {
  color: #d8efe3;
  font-size: 12px;
  line-height: 1.2;
  margin-top: 2px;
}
.dropdown-arrow {
  color: #7bf2b3;
  font-size: 12px;
  transition: transform 0.3s ease; 
  flex-shrink: 0;
}
.dropdown-arrow.rotated {
  transform: rotate(180deg);
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
  transform-origin: top right;
  animation: scale-in 0.2s ease-out;
}
@keyframes scale-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #34495e;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f0f4f7;
  color: #0073ff; 
}
.dropdown-item i {
  width: 16px;
  text-align: center;
  color: #99aab5;
}
.dropdown-item:hover i {
  color: #0073ff;
}
.dropdown-item.logout {
    border-top: 1px solid #e0e0e0;
}
.dropdown-item.logout i {
    color: #ff4d4d;
}
.dropdown-item.logout:hover {
    background: #fff0f0;
}

/* ===== ENHANCED FOOTER STYLES ===== */
.footer {
  background: #0f3d2e;
  color: #d8efe3;
  padding: 40px 0 25px;
  font-family: 'Inter', sans-serif;
}

.footer-top {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #145943;
  padding-left: 20px;
  padding-right: 20px;
}

.footer-section h4 {
  font-weight: 700;
  font-size: 18px;
  color: #7bf2b3;
  margin-bottom: 16px;
}
.footer-section p, .footer-section a {
  color: #d8efe3;
  font-size: 14px;
  margin-bottom: 8px;
  text-decoration: none;
  cursor: default;
}
.footer-section a:hover { color: #fff; }

.branding-socials {
  display: flex;
  flex-direction: column;
}
.branding-socials h4:nth-of-type(2) {
  margin-top: 25px; 
}
.social-buttons {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 30%;
  background: #145943; 
  color: #fff; 
  font-size: 16px;
  transition: all 0.3s;
}

.map-location {
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  height:175px;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.social-btn.facebook:hover { background: #1877f2; }
.social-btn.instagram:hover { background: linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5); }
.social-btn.tiktok:hover { background: #000; }
.social-btn.x-logo:hover { background: #000; }

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #c0e9d4;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .navbar { padding: 15px 20px; }
  
  .footer-top { 
    grid-template-columns: 1fr 1fr;
    gap: 25px; 
  }

  .footer { padding: 30px 0 15px; }
}

@media (max-width: 768px) {
  .footer-top { 
    grid-template-columns: 1fr;
  }
  
  .footer-top > div {
    text-align: center;
  }

  .branding-socials h4:nth-of-type(2) {
    margin-top: 15px; 
  }
  
  .social-buttons {
    justify-content: center;
  }
  
  .footer { padding: 30px 0 15px; }
  
  .user-details {
    display: none; 
  }

  .user-info {
    padding: 8px 12px;
  }

  .dropdown-menu {
    min-width: 150px;
  }
  
  .header-actions {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 12px 16px;
  }
  
  .logo {
    font-size: 22px;
  }
  
  .header-actions {
    gap: 8px;
  }
}

/* ===== EXISTING LANDING PAGE STYLES ===== */
.home-view {
  font-family: 'Inter', sans-serif;
  background: #ecf0ee;
  color: #071815;
}
.main-content {
  padding-top: 50px; 
  padding-bottom: 60px; 
}

.hero-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.slideshow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6);
}

.hero-section {
  background: none; 
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  z-index: 10;
  position: relative;
}

.hero-content h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
}
.tagline {
  font-size: 22px;
  font-weight: 300;
  margin-bottom: 30px;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
}
.btn-shop-now {
  padding: 14px 35px;
  background: #00ffcc; 
  color: #041c12;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
.btn-shop-now:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 255, 128, 0.4);
  background: #00e0b3;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  color: #041c12;
  margin-bottom: 40px;
  text-align: center;
  font-weight: 700;
}

.categories-section {
  margin-bottom: 70px;
}
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
}
.category-card {
  background: #ffffff;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}
.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 255, 128, 0.2);
  border: 2px solid #00ffcc;
}
.category-icon {
  color: #00ffcc;
  margin-bottom: 15px;
}
.category-card h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  margin-bottom: 5px;
}
.category-card p {
    font-size: 14px;
    color: #555;
}

.benefits-section {
    margin-bottom: 70px;
}
.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    text-align: center;
}
.benefit-item {
    background: #ffffff;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
}
.benefit-icon {
    color: #00cc99;
    margin-bottom: 15px;
}
.benefit-item h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 5px;
}
.benefit-item p {
    font-size: 14px;
    color: #666;
}

.divider {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), #00ffcc, rgba(0, 0, 0, 0));
  margin: 50px auto;
  max-width: 800px;
}
.promo-card {
  background: linear-gradient(135deg, #0a3c2b, #041c12);
  color: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.promo-card h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 30px;
  margin-bottom: 10px;
}
.promo-card p {
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 25px;
}
.btn-view-all {
  padding: 10px 20px;
  background: #00ffcc;
  color: #041c12;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-view-all:hover {
  transform: scale(1.05);
  background: #00e0b3;
}

@media(max-width: 768px) {
  .hero-content h1 {
    font-size: 36px;
  }
  .tagline {
    font-size: 18px;
  }
  .section-title {
    font-size: 26px;
  }
  .categories-grid, .benefits-grid {
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .promo-card {
    padding: 30px;
  }
}
</style>