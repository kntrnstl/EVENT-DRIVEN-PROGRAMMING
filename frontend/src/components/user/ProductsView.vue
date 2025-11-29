<template>
  <div class="products-view">
    <<!-- Modern Notification -->
<div 
  class="custom-notif"
  :class="[{ show: notification.show }, notification.type]"
>
  <div class="notif-content">
    <div class="notif-icon">
      <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <span class="notif-message">{{ notification.message }}</span>
  </div>
  <button class="notif-close" @click="closeNotification">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Footwear Collection</h1>
          <p class="page-subtitle">Discover your perfect pair from our exclusive Oning Flip selection</p>
        </div>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v8m-4-4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="summary-value">{{ sortedAndFilteredProducts.length }}</span>
              <span class="summary-label">Available Products</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls Section -->
    <div class="controls-section">
      <div class="search-container">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search products..." 
          class="search-input"
        >
      </div>

      <div class="filter-group">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <select v-model="sortOrder" class="filter-select">
          <option value="default">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="products-grid-section">
      <div v-if="sortedAndFilteredProducts.length" class="products-grid">
        <div
          v-for="product in sortedAndFilteredProducts"
          :key="product.product_id"
          class="product-card"
        >
          <div class="product-image">
  <div v-if="product.image" class="product-image-container">
    <img :src="product.image" :alt="product.name" class="product-real-image" />
    <div class="product-badges">
      <span class="price-badge">₱{{ product.price }}</span>
      <span v-if="hasLowStock(product)" class="stock-badge low-stock">Low Stock</span>
    </div>
  </div>
  <div v-else class="image-placeholder">
    <span class="product-icon">👟</span>
    <div class="product-badges">
      <span class="price-badge">₱{{ product.price }}</span>
      <span v-if="hasLowStock(product)" class="stock-badge low-stock">Low Stock</span>
    </div>
  </div>
</div>
          
          <div class="product-content">
            <div class="product-header">
              <h3 class="product-name">{{ product.name }}</h3>
              <span class="category-tag">{{ product.category }}</span>
            </div>
            
            <p class="product-description">{{ product.description }}</p>

            <div class="product-controls">
              <div class="control-group">
                <label class="control-label">Size</label>
                <select 
                  v-model="selectedSize[product.product_id]" 
                  class="control-select"
                >
                  <option
                    v-for="size in product.sizes"
                    :key="size.id"
                    :value="size"
                    :disabled="size.stock === 0"
                  >
                    {{ size.size }} ({{ size.stock }} left)
                  </option>
                </select>
              </div>

              <div class="control-group">
                <label class="control-label">Quantity</label>
                <div class="quantity-controls">
                  <button 
                    class="qty-btn" 
                    @click="decreaseQuantity(product.product_id)"
                    :disabled="quantity[product.product_id] <= 1"
                  >
                    −
                  </button>
                  <span class="quantity-display">{{ quantity[product.product_id] }}</span>
                  <button 
                    class="qty-btn" 
                    @click="increaseQuantity(product.product_id)"
                    :disabled="quantity[product.product_id] >= getMaxQuantity(product)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div class="product-actions">
              <button class="btn-primary" @click="addToCart(product)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h2l.5 2M7 3h10l-1 10H8L7 3z" stroke="currentColor" stroke-width="2"/>
                  <path d="M9 6v12M15 6v12M5 6h14l-1 12H6L5 6z" stroke="currentColor" stroke-width="2"/>
                </svg>
                Add to Cart
              </button>
              <button class="btn-secondary" @click="showDetails(product.product_id)">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6v12M15 6v12M5 6h14l-1 12H6L5 6z" stroke="currentColor" stroke-width="2"/>
            <path d="M3 3h2l.5 2M7 3h10l-1 10H8L7 3z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h2>No products found</h2>
        <p>Try adjusting your search or filter criteria</p>
        <button class="btn-primary" @click="resetFilters">
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Product Details Modal -->
        <ProductDetails
          v-if="selectedProduct"
          :product="selectedProduct"
          @close="selectedProduct = null"
          @notification="showNotification"
        />
  </div>
</template>

<script>
import axios from 'axios'
import ProductDetails from './ProductDetails.vue' 

export default {
  components: { ProductDetails }, 
  data() {
    return {
      products: [],
      searchQuery: '',
      selectedCategory: '',
      sortOrder: 'default', 
      selectedSize: {},
      quantity: {},
      selectedProduct: null,
      notification: {
        show: false,
        message: '',
        type: 'success'
      },
      notificationTimer: null
    }
  },
  computed: {
    uniqueCategories() {
        const categories = new Set(this.products.map(p => p.category));
        return Array.from(categories);
    },
    
    sortedAndFilteredProducts() {
      let filtered = this.products;

      // 1. Apply Category Filter
      if (this.selectedCategory) {
        filtered = filtered.filter(p => p.category === this.selectedCategory);
      }

      // 2. Apply Search Query Filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }

      // 3. Apply Sorting
      if (this.sortOrder === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (this.sortOrder === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (this.sortOrder === 'name_asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        // Default sort (e.g., by ID or original order)
        filtered.sort((a, b) => a.product_id - b.product_id);
      }
      
      return filtered;
    }
  },
  async created() {
    try {
      const res = await axios.get('http://localhost:3000/api/products')
      this.products = res.data
      this.products.forEach(p => {
        this.selectedSize[p.product_id] = p.sizes.find(s => s.stock > 0) || p.sizes[0] || null
        this.quantity[p.product_id] = 1
      })
    } catch (err) {
      console.error(err)
      this.showNotification('Failed to load products.', 'error')
    }
  },
  methods: {
    showNotification(message, type = 'success') {
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },
 closeNotification() {
    this.notification.show = false;
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
      this.notificationTimer = null;
    }
  },

  showNotification(message, type = 'success') {
    // Clear any existing timer
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }
    
    this.notification.type = type;
    this.notification.message = message;
    this.notification.show = true;
    
    // Set new timer
    this.notificationTimer = setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  },
    hasLowStock(product) {
      return product.sizes.some(size => size.stock > 0 && size.stock < 5);
    },

    getMaxQuantity(product) {
      const size = this.selectedSize[product.product_id];
      return size ? size.stock : 1;
    },

    increaseQuantity(productId) {
      if (this.quantity[productId] < this.getMaxQuantity(this.products.find(p => p.product_id === productId))) {
        this.quantity[productId] += 1;
      }
    },

    decreaseQuantity(productId) {
      if (this.quantity[productId] > 1) {
        this.quantity[productId] -= 1;
      }
    },

    resetFilters() {
      this.searchQuery = '';
      this.selectedCategory = '';
      this.sortOrder = 'default';
    },

    async addToCart(product) {
      const size = this.selectedSize[product.product_id]
      const qty = this.quantity[product.product_id]

      if (!size) return this.showNotification('Please select a size', 'error')
      if (qty < 1 || qty > size.stock) return this.showNotification(`Quantity must be between 1 and ${size.stock}`, 'error')

      const token = localStorage.getItem('token')
      if (!token) return this.showNotification('Please login first.', 'error')

      try {
        await axios.post(
          'http://localhost:3000/api/cart',
          { product_id: product.product_id, size_id: size.id, quantity: qty, price: product.price },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        this.showNotification(`${product.name} added to cart!`, 'success')
      } catch (err) {
        console.error(err)
        const message = err.response?.data?.message || 'Failed to add to cart'
        this.showNotification(message, 'error')
      }
    },

        async showDetails(productId) {
          try {
            const res = await axios.get(`http://localhost:3000/api/products/${productId}`)
            this.selectedProduct = res.data
          } catch (err) {
            this.showNotification('Failed to fetch product details', 'error')
            console.error(err)
          }
        }
  }
}
</script>

<style scoped>
.products-view {
  padding: 24px;
  background: #f8fdfb;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.title-section .page-title {
  color: #0a3c2b;
  font-weight: 700;
  font-size: 32px;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.title-section .page-subtitle {
  color: #4a7c6d;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

/* Summary Cards */
.summary-cards {
  display: flex;
  gap: 16px;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  min-width: 200px;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: #f0f9f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a7d5e;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #0a3c2b;
  text-align: center;
  line-height: 1;
}

.summary-label {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

/* Controls Section */
.controls-section {
  display: flex;
  justify-content: space-between; /* This will push items to opposite sides */
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
  /* Remove any margin-right that might be pushing it left */
}


.search-container svg {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a7c6d;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #c8e6d9;
  border-radius: 12px;
  background-color: white;
  font-size: 15px;
  transition: all 0.2s;
  color: #0a3c2b;
}

.search-input:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.search-input::placeholder {
  color: #7aa895;
}

.filter-group {
  display: flex;
  gap: 12px;
  margin-left: auto; /* Push to right */
  margin-right: 0; /* Align with summary card right edge */
  /* Add these to align with summary card position */
  margin-top: 0;
  align-items: flex-start;
}

.filter-select {
  padding: 14px 16px;
  border: 1px solid #c8e6d9;
  border-radius: 12px;
  background-color: white;
  font-size: 15px;
  transition: all 0.2s;
  color: #0a3c2b;
  min-width: 160px;
  cursor: pointer;
}


.filter-select:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

/* Products Grid Section */
.products-grid-section {
  margin-bottom: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(10, 60, 43, 0.15);
  border-color: #1a7d5e;
}

/* Product Image */
.product-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #f0f9f5, #e0f2ec);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  text-align: center;
}

.product-icon {
  font-size: 48px;
  opacity: 0.7;
}

.product-badges {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.price-badge {
  background: #1a7d5e;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(26, 125, 94, 0.3);
}

.stock-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.stock-badge.low-stock {
  background: #fef3c7;
  color: #92400e;
}

/* Product Content */
.product-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-header {
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0;
  flex: 1;
}

.category-tag {
  background: #e0f2ec;
  color: #1a7d5e;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-description {
  color: #4a7c6d;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex: 1;
}

/* Product Controls */
.product-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  font-weight: 600;
  color: #0a3c2b;
}

.control-select {
  padding: 12px;
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #0a3c2b;
  transition: all 0.2s;
  cursor: pointer;
}

.control-select:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 2px rgba(26, 125, 94, 0.1);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 8px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.qty-btn:hover:not(:disabled) {
  background: #1a7d5e;
  color: white;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  font-weight: 600;
  color: #0a3c2b;
  min-width: 40px;
  text-align: center;
}

/* Product Actions */
.product-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: #1a7d5e;
  color: white;
}

.btn-primary:hover {
  background: #0a3c2b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 125, 94, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #1a7d5e;
  border: 2px solid #1a7d5e;
}

.btn-secondary:hover {
  background: #1a7d5e;
  color: white;
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #4a7c6d;
  margin: 0 0 32px 0;
}

/* Modern Custom Notification */
.custom-notif {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 48px 16px 24px; /* Added right padding for close button */
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10000;
  min-width: 300px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.custom-notif.show {
  top: 24px;
  opacity: 1;
  pointer-events: auto;
}

.custom-notif.success {
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  border-left: 4px solid #10b981;
}

.custom-notif.error {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  border-left: 4px solid #f56565;
}

.notif-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notif-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.notif-message {
  flex: 1;
}

.notif-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.notif-close:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .products-view {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .summary-cards {
    justify-content: center;
  }
  
.controls-section {
  display: flex;
  justify-content: space-between; /* This will push items to opposite sides */
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
  
.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
  /* Remove any margin-right that might be pushing it left */
}
  
.filter-group {
  display: flex;
  gap: 12px;
  margin-left: auto; /* This pushes the filter group to the right */
}

.filter-select {
  padding: 14px 16px;
  border: 1px solid #c8e6d9;
  border-radius: 12px;
  background-color: white;
  font-size: 15px;
  transition: all 0.2s;
  color: #0a3c2b;
  min-width: 160px;
  cursor: pointer;
  /* Remove the margin-right since we're using flexbox for positioning */
}
  
  .product-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .summary-card {
    min-width: auto;
    flex: 1;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .product-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Product Image Styles */
.product-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.product-real-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-real-image {
  transform: scale(1.05);
}

.image-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f9f5, #e0f2ec);
  display: flex;
  align-items: center;
  justify-content: center;
}



</style>