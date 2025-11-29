<template>
  <div class="modal-overlay" v-if="product" @click.self="$emit('close')">
    <div class="modal-container">
      
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2 class="product-title">{{ product.name }}</h2>
          <p class="product-category">{{ product.category }}</p>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Product Image Section -->
      <div class="product-image-section">
        <div v-if="product.image" class="product-image-container">
          <img :src="product.image" :alt="product.name" class="product-real-image" />
        </div>
        <div v-else class="image-placeholder">
          <span class="product-icon">👟</span>
        </div>
        
        <div class="product-badges">
          <span class="price-badge">₱{{ Number(product.price).toFixed(2) }}</span>
          <span v-if="hasLowStock" class="stock-badge low-stock">Low Stock</span>
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info-section">
        <div class="product-basic-info">
          <p class="product-description">{{ product.description }}</p>
        </div>
        
        <!-- Sizes -->
        <div class="sizes-section" v-if="product.sizes && product.sizes.length">
          <h4>Available Sizes</h4>
          <div class="sizes-grid">
            <div v-for="size in product.sizes" :key="size.id" class="size-item">
              <span class="size-value">{{ size.size }}</span>
              <span class="size-stock" :class="{ 'low-stock': size.stock < 10 }">
                {{ size.stock }} left
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <div class="reviews-header">
          <h3>Customer Reviews</h3>
          <div class="reviews-stats" v-if="reviews.length > 0">
            <div class="average-rating">
              <span class="rating-number">{{ averageRating }}</span>
              <div class="stars">
                <span 
                  v-for="star in 5" 
                  :key="star" 
                  class="star"
                  :class="{ filled: star <= Math.round(averageRating) }"
                >
                  ★
                </span>
              </div>
              <span class="total-reviews">({{ reviews.length }} reviews)</span>
            </div>
          </div>
        </div>

        <!-- Add Review Form -->
        <div v-if="canReview" class="add-review-card">
          <h4>Share Your Experience</h4>
          <div class="rating-input">
            <label>Your Rating:</label>
            <div class="rating-stars">
              <span 
                v-for="star in 5" 
                :key="star" 
                class="star interactive"
                :class="{ filled: rating >= star }"
                @click="setRating(star)"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
              >
                ★
              </span>
            </div>
            <span class="rating-text">{{ ratingText }}</span>
          </div>
          <div class="review-input">
            <textarea 
              v-model="reviewComment" 
              placeholder="Tell us about your experience with this product... What did you like? How was the fit? Would you recommend it?"
              rows="4"
              class="review-textarea"
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ reviewComment.length }}/500</div>
          </div>
          <button 
            @click="submitReview" 
            class="btn-submit-review" 
            :disabled="!rating || submitting"
            :class="{ loading: submitting }"
          >
            <span v-if="!submitting">Submit Review</span>
            <span v-else class="loading-text">Submitting...</span>
          </button>
        </div>

        <!-- Review Restrictions -->
        <div v-else-if="isLoggedIn" class="review-restriction-card">
          <div class="restriction-icon">🔒</div>
          <div class="restriction-content">
            <h4>Purchase to Review</h4>
            <p>You need to purchase and receive this product first to share your experience.</p>
          </div>
        </div>

        <div v-else class="review-restriction-card">
          <div class="restriction-icon">🔒</div>
          <div class="restriction-content">
            <h4>Join the Conversation</h4>
            <p>Please log in to see reviews and share your feedback with our community.</p>
            <button class="btn-login" @click="$emit('close')">Log In</button>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="reviews-list" v-if="reviews.length > 0">
          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">
                  {{ getInitials(review.user_name || 'Customer') }}
                </div>
                <div class="reviewer-details">
                  <span class="reviewer-name">Customer</span>
                  <div class="review-stars">
                    <span 
                      v-for="star in 5" 
                      :key="star" 
                      class="star small"
                      :class="{ filled: review.rating >= star }"
                    >
                      ★
                    </span>
                  </div>
                </div>
              </div>
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
            <div class="review-helpful">
              <button class="helpful-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke="currentColor" stroke-width="2"/>
                </svg>
                Helpful
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-reviews">
          <div class="empty-icon">⭐</div>
          <h4>No Reviews Yet</h4>
          <p>Be the first to share your experience with this product!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ["product"],
  data() {
    return {
      reviews: [],
      rating: 0,
      hoverRating: 0,
      reviewComment: '',
      canReview: false,
      isLoggedIn: false,
      userOrders: [],
      submitting: false
    }
  },
  computed: {
    averageRating() {
      if (this.reviews.length === 0) return 0;
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / this.reviews.length).toFixed(1);
    },
    ratingText() {
      const ratings = {
        1: "Poor",
        2: "Fair", 
        3: "Good",
        4: "Very Good",
        5: "Excellent"
      };
      return ratings[this.hoverRating || this.rating] || "Select rating";
    },
    hasLowStock() {
      return this.product.sizes?.some(size => size.stock > 0 && size.stock < 10);
    }
  },
  async mounted() {
    await this.checkUserStatus();
    await this.loadReviews();
    await this.checkPurchaseStatus();
  },
  methods: {
    async checkUserStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },

    async loadReviews() {
      try {
        console.log('🔄 Loading reviews for product:', this.product.product_id);
        const response = await axios.get(`/api/reviews/product/${this.product.product_id}`);
        console.log('📡 API Response:', response);
        this.reviews = response.data;
      } catch (error) {
        console.error('❌ Error loading reviews:', error);
        this.reviews = [];
      }
    },

    async checkPurchaseStatus() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return (this.canReview = false);

        const response = await axios.get('/api/orders/user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.userOrders = response.data;
        console.log('🆔 Current Product ID:', this.product.product_id);
        
        const hasPurchased = this.userOrders.some(order => {
          if (order.status !== 'delivered') return false;
          return order.items?.some(item => item.product_id == this.product.product_id);
        });

        this.canReview = hasPurchased;
      } catch (error) {
        console.error('❌ Error checking purchase status:', error);
        this.canReview = false;
      }
    },

    setRating(star) {
      this.rating = star;
    },

    async submitReview() {
      try {
        this.submitting = true;
        const token = localStorage.getItem('token');
        if (!token) return alert('Please log in to submit a review');

        const reviewData = {
          product_id: this.product.product_id,
          rating: this.rating,
          comment: this.reviewComment
        };

        await axios.post('/api/reviews', reviewData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.rating = 0;
        this.reviewComment = '';
        await this.loadReviews();

        // Show success message
        this.$emit('notification', 'Review submitted successfully!', 'success');
      } catch (error) {
        console.error('Error submitting review:', error);
        this.$emit('notification', 'Error submitting review', 'error');
      } finally {
        this.submitting = false;
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 60, 43, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
  overflow: hidden;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(10, 60, 43, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 95vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px;
  border-bottom: 1px solid #e0f0e9;
  background: linear-gradient(135deg, #f8fdfb, #f0f9f5);
  flex-shrink: 0;
}

/* Product Image Section */
.product-image-section {
  position: relative;
  width: calc(100% - 64px);
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  margin: 20px 32px 0;
  border: 1px solid #e0f0e9;
}

.product-image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.product-real-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image-section:hover .product-real-image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f9f5, #e0f2ec);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.product-icon {
  font-size: 80px;
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

.header-content {
  flex: 1;
}

.product-title {
  font-size: 24px;
  font-weight: 700;
  color: #0a3c2b;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.product-category {
  font-size: 14px;
  color: #1a7d5e;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.close-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: #f0f9f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a7c6d;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 16px;
}

.close-btn:hover {
  background: #e0f2ec;
  color: #0a3c2b;
  transform: rotate(90deg);
}

/* Product Info Section */
.product-info-section {
  padding: 24px 32px;
  border-bottom: 1px solid #e0f0e9;
  flex-shrink: 0;
}

.product-basic-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.product-description {
  color: #4a7c6d;
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
  flex: 1;
  margin-right: 20px;
}

.sizes-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #0a3c2b;
  margin-bottom: 12px;
}

.sizes-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e0f0e9;
  border-radius: 10px;
  background: white;
  min-width: 60px;
}

.size-value {
  font-size: 16px;
  font-weight: 700;
  color: #0a3c2b;
  margin-bottom: 4px;
}

.size-stock {
  font-size: 12px;
  color: #7aa895;
  font-weight: 500;
}

.size-stock.low-stock {
  color: #dc2626;
  font-weight: 600;
}

/* Reviews Section */
.reviews-section {
  padding: 24px 32px;
  flex: 1;
  overflow-y: auto;
  max-height: none;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.reviews-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0a3c2b;
  margin: 0;
}

.reviews-stats {
  text-align: right;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-number {
  font-size: 24px;
  font-weight: 700;
  color: #0a3c2b;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #e5e7eb;
  transition: all 0.2s;
}

.star.filled {
  color: #f59e0b;
}

.star.interactive {
  cursor: pointer;
  font-size: 28px;
}

.star.interactive:hover {
  color: #f59e0b;
  transform: scale(1.1);
}

.star.small {
  font-size: 16px;
}

.total-reviews {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

.add-review-card {
  background: #f8fdfb;
  border: 1px solid #e0f0e9;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.add-review-card h4 {
  font-size: 18px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0 0 16px 0;
}

.rating-input {
  margin-bottom: 16px;
}

.rating-input label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0a3c2b;
  margin-bottom: 8px;
}

.rating-text {
  display: block;
  font-size: 14px;
  color: #1a7d5e;
  font-weight: 500;
  margin-top: 8px;
}

.review-input {
  margin-bottom: 16px;
}

.review-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #c8e6d9;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  color: #0a3c2b;
  resize: vertical;
  transition: all 0.2s;
  font-family: inherit;
}

.review-textarea:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.review-textarea::placeholder {
  color: #7aa895;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #7aa895;
  margin-top: 4px;
}

.btn-submit-review {
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  position: relative;
}

.btn-submit-review:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(26, 125, 94, 0.4);
}

.btn-submit-review:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-submit-review.loading {
  pointer-events: none;
}

.loading-text {
  opacity: 0.8;
}

.review-restriction-card {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.restriction-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.restriction-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 4px 0;
}

.restriction-content p {
  font-size: 14px;
  color: #92400e;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.btn-login {
  background: #1a7d5e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login:hover {
  background: #0a3c2b;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: white;
  border: 1px solid #e0f0e9;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s;
}

.review-card:hover {
  border-color: #1a7d5e;
  box-shadow: 0 4px 12px rgba(10, 60, 43, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewer-name {
  font-size: 14px;
  font-weight: 600;
  color: #0a3c2b;
}

.review-date {
  font-size: 12px;
  color: #7aa895;
  font-weight: 500;
}

.review-comment {
  color: #4a7c6d;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.review-helpful {
  border-top: 1px solid #e0f0e9;
  padding-top: 12px;
}

.helpful-btn {
  background: none;
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  color: #4a7c6d;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.helpful-btn:hover {
  background: #f0f9f5;
  border-color: #1a7d5e;
  color: #0a3c2b;
}

.empty-reviews {
  text-align: center;
  padding: 40px 20px;
  color: #4a7c6d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-reviews h4 {
  font-size: 18px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0 0 8px 0;
}

.empty-reviews p {
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header,
  .product-info-section,
  .reviews-section {
    padding: 20px 24px;
  }

  .product-image-section {
    width: calc(100% - 48px);
    margin: 16px 24px 0;
    height: 250px;
  }
  
  .product-basic-info {
    flex-direction: column;
    gap: 16px;
  }
  
  .product-description {
    margin-right: 0;
  }
  
  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .reviews-stats {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .modal-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .close-btn {
    align-self: flex-end;
    margin-left: 0;
  }
  
  .sizes-grid {
    justify-content: center;
  }

  .product-image-section {
    height: 200px;
  }

  .product-icon {
    font-size: 60px;
  }
}
</style>