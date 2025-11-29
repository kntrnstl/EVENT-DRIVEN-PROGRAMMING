<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios'; // Import axios for the data fetching part

// Define the emits the component can send (Vue 3 syntax)
const emit = defineEmits(['navigate']);

// 1. STATE FOR SLIDESHOW
const currentSlideIndex = ref(0);
let slideInterval = null;
const images = ref([]);

// 2. STATE FOR DATA FETCHING (If still needed)
const featuredProducts = ref([]); // Use ref for reactive data

// 3. SLIDESHOW LOGIC
const importImages = () => {
// ------------------------------------------------------------------
    // FIX APPLIED HERE: Using '../../assets/img/*.jpg' for the GLOB
    // ------------------------------------------------------------------
    const imageModules = import.meta.glob('../../assets/img/*.jpg', { eager: true });
    
    const loadedImages = [];
    // Ensure correct order (1.jpg to 5.jpg)
    for (let i = 1; i <= 16; i++) {
        // FIX APPLIED HERE: Using '../../assets/img/${i}.jpg' for the KEY
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
    slideInterval = setInterval(nextSlide, 5000); // 5 seconds
};

const stopSlideshow = () => {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
};

// 4. DATA FETCHING LOGIC (Using Composition API equivalent to 'created')
const fetchProducts = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/products', {
            headers: { Authorization: `Bearer ${token}` } 
        });
        const productsWithPrice = res.data.filter(p => p.price !== undefined && p.price !== null);
        featuredProducts.value = productsWithPrice.slice(0, 4);
    } catch (err) {
        console.error('Error fetching products:', err);
        featuredProducts.value = [];
    }
};

// 5. LIFECYCLE HOOKS
onMounted(() => {
    importImages();
    startSlideshow();
    fetchProducts();
});

onUnmounted(() => {
    stopSlideshow();
});
</script>

<template>
  <div class="home-view">
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
          <button class="btn-shop-now" @click="emit('navigate', 'products')">
            Find Your Next Pair &rarr;
          </button>
        </div>
      </section>
    </div>
    <div class="main-content container"> 
      
      <section class="categories-section">
        <h2 class="section-title">🏃 Shop by Shoe Type</h2>
        <div class="categories-grid">
          <div class="category-card" @click="emit('navigate', 'products')">
            <i class="fas fa-running fa-3x category-icon"></i>
            <h3>Running</h3>
            <p>High-performance athletic gear.</p>
          </div>
          <div class="category-card" @click="emit('navigate', 'products')">
            <i class="fas fa-shoe-prints fa-3x category-icon"></i>
            <h3>Casual Sneakers</h3>
            <p>Everyday comfort meets street style.</p>
          </div>
          <div class="category-card" @click="emit('navigate', 'products')">
            <i class="fas fa-mountain fa-3x category-icon"></i>
            <h3>Boots & Hiking</h3>
            <p>Durable footwear for any adventure.</p>
          </div>
          <div class="category-card" @click="emit('navigate', 'products')">
            <i class="fas fa-mitten fa-3x category-icon"></i>
            <h3>Dress & Formal</h3>
            <p>Polish your look for any occasion.</p>
          </div>
        </div>
      </section>

      <hr class="divider">
      
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

      <section class="promo-banner">
        <div class="promo-card">
          <h3>New Seasons, New Styles!</h3>
          <p>Don't miss the newest collection of limited-edition drops and fresh trends.</p>
          <button class="btn-view-all" @click="emit('navigate', 'products')">
            Explore New Drops
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* You'll need to link Font Awesome for the icons */
/* --- Base & Layout --- */
.home-view {
  font-family: 'Inter', sans-serif;
  background: #ecf0ee;
  color: #071815;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.main-content {
  padding-top: 50px; 
  padding-bottom: 60px; 
}

/* ---------------- Hero/Slideshow Section ---------------- */

/* Wrapper to establish position context for absolute children (slideshow and hero text) */
.hero-wrapper {
  position: relative;
  width: 100%;
  height: 500px; /* Set a fixed height for the slideshow area */
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
  z-index: 1; /* Below the text content */
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the area */
  filter: brightness(0.6); /* Darken image for better text contrast */
}

/* Hero Section (Text/Content) */
.hero-section {
  /* Override the background image applied in the original code, as the slideshow now provides the background */
  background: none; 
  height: 100%; /* Take full height of wrapper */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  z-index: 10; /* Above the image */
  position: relative; /* Necessary to lift content above the z-index: 1 slideshow */
}

.hero-content h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7); /* Darker shadow for better contrast */
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

/* Slideshow Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease; /* Adjusted transition speed */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


/* ---------------- Section Titles ---------------- (Unchanged) */
.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  color: #041c12;
  margin-bottom: 40px;
  text-align: center;
  font-weight: 700;
}

/* --- CATEGORIES STYLES --- */
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
  color: #00ffcc; /* Accent color */
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

/* --- BENEFITS STYLES (Why Choose Us) --- */
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
    color: #00cc99; /* Accent color */
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

/* ---------------- Promo Banner ---------------- */
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

/* ---------------- Responsive ---------------- */
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
