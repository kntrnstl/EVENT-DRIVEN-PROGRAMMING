<template>
  <div class="cart-view">
    <!-- Modern Notification with Close Button -->
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
          <h1 class="page-title">Shopping Cart</h1>
          <p class="page-subtitle" v-if="cart.length">{{ cart.length }} item{{ cart.length !== 1 ? 's' : '' }} in your cart</p>
          <p class="page-subtitle" v-else>Your cart is waiting to be filled</p>
        </div>
        <div class="summary-cards" v-if="cart.length">
          <div class="summary-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h2l.5 2M7 3h10l-1 10H8L7 3z" stroke="currentColor" stroke-width="2"/>
                <path d="M9 6v12M15 6v12M5 6h14l-1 12H6L5 6z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="summary-value">₱{{ totalPrice.toFixed(2) }}</span>
              <span class="summary-label">Total Amount</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Cart Items -->
      <div v-if="cart.length" class="cart-section">
        <div class="section-header">
          <h2>Your Items</h2>
          <button class="clear-cart" @click="showClearCartModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2"/>
            </svg>
            Clear Cart
          </button>
        </div>
        
       <div class="cart-items">
  <div v-for="(item, index) in cart" :key="item.id" class="cart-item">
    <div class="item-image">
      <!-- Show actual image if available -->
      <div v-if="item.image" class="product-image-container">
        <img :src="item.image" :alt="item.name" class="product-real-image" />
      </div>
      <!-- Show placeholder only if no image -->
      <div v-else class="image-placeholder">
        <span>👟</span>
      </div>
    </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <div class="item-meta">
                <span class="item-size">Size: {{ item.size }}</span>
                <span class="item-price">₱{{ item.price }}</span>
              </div>
            </div>
            
            <div class="item-controls">
              <div class="quantity-section">
                <div class="quantity-controls">
                  <button 
                    class="qty-btn" 
                    @click="decreaseQuantity(item)"
                    :disabled="item.quantity <= 1"
                  >
                    −
                  </button>
                  <span class="quantity-display">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="increaseQuantity(item)">
                    +
                  </button>
                </div>
                <div class="item-total">
                  ₱{{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
              
              <button @click="showDeleteItemModal(item)" class="remove-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3h2l.5 2M7 3h10l-1 10H8L7 3z" stroke="currentColor" stroke-width="2"/>
            <path d="M9 6v12M15 6v12M5 6h14l-1 12H6L5 6z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>Add some amazing products to get started!</p>
        <button class="btn-primary" @click="$emit('navigate', 'products')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Start Shopping
        </button>
      </div>

      <!-- Order Summary -->
      <div v-if="cart.length" class="summary-section">
        <div class="summary-card-modern">
          <div class="summary-header">
            <h3>Order Summary</h3>
          </div>
          
          <div class="summary-content">
            <div class="summary-line">
              <span class="label">Subtotal</span>
              <span class="value">₱{{ totalPrice.toFixed(2) }}</span>
            </div>
            
            <div class="summary-line" v-if="discountAmount > 0">
              <span class="label">Discount</span>
              <span class="value discount">-₱{{ discountAmount.toFixed(2) }}</span>
            </div>
            
            <div class="summary-line">
              <span class="label">Shipping</span>
              <span class="value">₱{{ shippingCost.toFixed(2) }}</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-line total">
              <span class="label">Total</span>
              <span class="value">₱{{ (totalPrice - discountAmount + shippingCost).toFixed(2) }}</span>
            </div>

            <!-- Discount Section -->
            <div class="discount-section">
              <div class="discount-header" @click="toggleDiscounts">
                <span>Apply Discount</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :class="{ rotated: showDiscounts }">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              
              <div v-if="showDiscounts" class="discount-options">
                <div v-for="discount in availableDiscounts" :key="discount.id" 
                     class="discount-option" :class="{ selected: selectedDiscountId === discount.id }"
                     @click="applyDiscount(discount)">
                  <div class="discount-badge">
                    {{ discount.type === 'percentage' ? `${discount.value}%` : `₱${discount.value}` }}
                  </div>
                  <div class="discount-info">
                    <span class="discount-name">{{ discount.name }}</span>
                    <span class="discount-desc">{{ discount.description }}</span>
                  </div>
                  <div class="discount-radio">
                    <div class="radio-dot" :class="{ active: selectedDiscountId === discount.id }"></div>
                  </div>
                </div>
                
                <div v-if="availableDiscounts.length === 0" class="no-discounts">
                  No discounts available
                </div>
              </div>
            </div>

            <button @click="openPaymentModal" class="checkout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Cart Confirmation Modal -->
    <div v-if="showClearCartConfirm" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Clear Cart</h3>
          <button class="modal-close" @click="showClearCartConfirm = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-content">
            <div class="delete-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M19 6V20a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <p>Are you sure you want to clear your entire cart? This action cannot be undone.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showClearCartConfirm = false" class="btn btn-secondary">Cancel</button>
          <button @click="clearCart" class="btn btn-danger">Clear Cart</button>
        </div>
      </div>
    </div>

    <!-- Delete Item Confirmation Modal -->
    <div v-if="showDeleteItemConfirm" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Remove Item</h3>
          <button class="modal-close" @click="showDeleteItemConfirm = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-content">
            <div class="delete-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p>Are you sure you want to remove <strong>{{ deleteItemName }}</strong> from your cart?</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteItemConfirm = false" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDeleteItem" class="btn btn-danger">Remove Item</button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="modal-overlay">
      <div class="modal payment-modal">
        <div class="modal-header">
          <h3>Complete Your Order</h3>
          <button class="modal-close" @click="closePaymentModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-content">
          <!-- Order Summary -->
          <div class="modal-section">
            <h4>Order Summary</h4>
            <div class="order-items">
              <div v-for="item in cart" :key="item.id" class="order-item">
                <div class="order-item-info">
                  <span class="order-item-name">{{ item.name }}</span>
                  <span class="order-item-details">Size {{ item.size }} • Qty {{ item.quantity }}</span>
                </div>
                <span class="order-item-price">₱{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="order-totals">
              <div class="total-line">
                <span>Subtotal</span>
                <span>₱{{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="total-line" v-if="discountAmount > 0">
                <span>Discount</span>
                <span class="discount">-₱{{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="total-line">
                <span>Shipping</span>
                <span>₱{{ shippingCost.toFixed(2) }}</span>
              </div>
              <div class="total-line grand-total">
                <span>Total</span>
                <span>₱{{ (totalPrice - discountAmount + shippingCost).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Delivery Information -->
          <div class="modal-section">
            <h4>Delivery Information</h4>
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Street Address *</label>
                <input type="text" v-model="address.street" placeholder="House #, Street Name">
              </div>
              <div class="form-group">
                <label>Barangay *</label>
                <input type="text" v-model="address.barangay" placeholder="Barangay">
              </div>
              <div class="form-group">
                <label>City/Municipality *</label>
                <input type="text" v-model="address.city" placeholder="City/Municipality">
              </div>
              <div class="form-group">
                <label>Province *</label>
                <input type="text" v-model="address.province" placeholder="Province">
              </div>
              <div class="form-group">
                <label>ZIP Code *</label>
                <input type="text" v-model="address.zipCode" placeholder="ZIP Code">
              </div>
              <div class="form-group full-width">
                <label>Delivery Notes (Optional)</label>
                <textarea v-model="address.notes" placeholder="Delivery instructions, landmarks, etc." rows="3"></textarea>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="modal-section">
            <h4>Payment Method</h4>
            <div class="payment-methods">
              <div v-for="method in paymentMethods" :key="method.value"
                   :class="['payment-method', { active: paymentMethod === method.value }]"
                   @click="paymentMethod = method.value">
                <div class="method-icon">{{ method.icon }}</div>
                <div class="method-info">
                  <span class="method-name">{{ method.label }}</span>
                  <span class="method-description">{{ getMethodDescription(method.value) }}</span>
                </div>
                <div class="method-radio">
                  <div class="radio-indicator" :class="{ active: paymentMethod === method.value }"></div>
                </div>
              </div>
            </div>

            <!-- PayPal Integration -->
            <div v-if="paymentMethod === 'PayPal'" class="payment-details">
              <div class="paypal-info">
                <p>You will be redirected to PayPal to complete your payment securely.</p>
              </div>
              <div id="paypal-button-container" ref="paypalButtonContainer"></div>
            </div>

            <!-- Credit Card Form -->
            <div v-if="paymentMethod === 'Credit Card'" class="payment-details">
              <div class="card-form">
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Card Number *</label>
                    <input type="text" v-model="cardDetails.number" placeholder="1234 5678 9012 3456" maxlength="19">
                  </div>
                  <div class="form-group">
                    <label>Expiry Date *</label>
                    <input type="text" v-model="cardDetails.expiry" placeholder="MM/YY" maxlength="5">
                  </div>
                  <div class="form-group">
                    <label>CVV *</label>
                    <input type="text" v-model="cardDetails.cvv" placeholder="123" maxlength="4">
                  </div>
                  <div class="form-group full-width">
                    <label>Cardholder Name *</label>
                    <input type="text" v-model="cardDetails.name" placeholder="As shown on card">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button v-if="paymentMethod !== 'PayPal'" 
                  @click="confirmCheckout" 
                  class="confirm-order-btn"
                  :disabled="!isFormValid">
            <span class="btn-text">
              {{ paymentMethod === 'COD' ? 'Place Order' : 'Pay Now' }}
            </span>
            <span class="btn-amount">
              ₱{{ (totalPrice - discountAmount + shippingCost).toFixed(2) }}
            </span>
          </button>
          
          <div v-else class="paypal-note">
            <p>Click the PayPal button above to complete your payment</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      cart: [],
      showPaymentModal: false,
      paymentMethod: 'COD',
      address: {
        street: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: '',
        notes: ''
      },
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      },
      paypalSDKLoaded: false,
      paypalOrderId: null,
      availableDiscounts: [],
      selectedDiscountId: null,
      discountAmount: 0,
      appliedDiscount: null,
      paymentMethods: [
        { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
        { value: 'PayPal', label: 'PayPal', icon: '🔵' },
        { value: 'Credit Card', label: 'Credit/Debit Card', icon: '💳' }
      ],
      notification: {
        show: false,
        message: '',
        type: 'success'
      },
      notificationTimer: null,
      showDiscounts: false,
      shippingCost: 50,
      showClearCartConfirm: false,
      showDeleteItemConfirm: false,
      deleteItemId: null,
      deleteItemName: ''
    }
  },

  computed: {
    totalPrice() {
      return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    },
    
    combinedAddress() {
      const { street, barangay, city, province, zipCode, notes } = this.address
      let fullAddress = `${street}, ${barangay}, ${city}, ${province} ${zipCode}`
      if (notes.trim()) {
        fullAddress += ` (${notes})`
      }
      return fullAddress
    },
    
    isFormValid() {
      const addressValid = this.address.street && 
                          this.address.barangay && 
                          this.address.city && 
                          this.address.province && 
                          this.address.zipCode
      
      if (this.paymentMethod === 'Credit Card') {
        const cardValid = this.cardDetails.number && 
                         this.cardDetails.expiry && 
                         this.cardDetails.cvv && 
                         this.cardDetails.name
        return addressValid && cardValid
      }
      
      return addressValid
    }
  },

  methods: {
    // Notification system
    closeNotification() {
      this.notification.show = false;
      if (this.notificationTimer) {
        clearTimeout(this.notificationTimer);
        this.notificationTimer = null;
      }
    },

    showNotification(type, message) {
      if (this.notificationTimer) {
        clearTimeout(this.notificationTimer);
      }
      
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;
      
      this.notificationTimer = setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },

    // Enhanced methods
    increaseQuantity(item) {
      item.quantity += 1
      this.updateQuantity(item)
    },

    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1
        this.updateQuantity(item)
      }
    },

    toggleDiscounts() {
      this.showDiscounts = !this.showDiscounts
      if (this.showDiscounts && this.availableDiscounts.length === 0) {
        this.fetchAvailableDiscounts()
      }
    },

    getMethodDescription(method) {
      const descriptions = {
        'COD': 'Pay when you receive your order',
        'PayPal': 'Secure online payment',
        'Credit Card': 'Safe card processing'
      }
      return descriptions[method] || ''
    },

    // Modal methods
    showClearCartModal() {
      this.showClearCartConfirm = true
    },

    showDeleteItemModal(item) {
      this.deleteItemId = item.id
      this.deleteItemName = item.name
      this.showDeleteItemConfirm = true
    },

    async clearCart() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        
        for (const item of this.cart) {
          await axios.delete(`/api/cart/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        }
        
        await this.fetchCart()
        this.showNotification('success', 'Cart cleared successfully')
        this.showClearCartConfirm = false
      } catch (error) {
        this.showNotification('error', 'Failed to clear cart')
      }
    },

    async confirmDeleteItem() {
      try {
        await this.removeItem(this.deleteItemId)
        this.showDeleteItemConfirm = false
      } catch (error) {
        this.showNotification('error', 'Failed to remove item')
      }
    },

    // Existing methods
    async fetchCart() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        const res = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.cart = res.data
      } catch (err) {
        console.error('Fetch cart error:', err)
      }
    },

    async updateQuantity(item) {
      try {
        const token = localStorage.getItem('token')
        await axios.put(`/api/cart/${item.id}`, { quantity: item.quantity }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchCart()
        this.showNotification('success', 'Quantity updated successfully')
      } catch {
        this.showNotification('error', 'Failed to update quantity')
      }
    },

    async removeItem(itemId) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`/api/cart/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchCart()
        this.showNotification('success', 'Item removed from cart')
      } catch {
        this.showNotification('error', 'Failed to remove item')
      }
    },

    openPaymentModal() {
      this.showPaymentModal = true
      this.fetchAvailableDiscounts()
    },

    closePaymentModal() {
      this.showPaymentModal = false
      this.selectedDiscountId = null
      this.discountAmount = 0
      this.appliedDiscount = null
      this.paymentMethod = 'COD'
      this.resetAddressForm()
    },

    resetAddressForm() {
      this.address = {
        street: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: '',
        notes: ''
      }
      this.cardDetails = {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      }
    },

    async fetchAvailableDiscounts() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        
        const response = await axios.get('/api/discounts/available', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        this.availableDiscounts = response.data.map(discount => ({
          ...discount,
          description: discount.type === 'percentage' ? 
            `${discount.value}% off your order` : 
            `₱${discount.value} off your order`
        }))
      } catch (err) {
        console.error('Error fetching discounts:', err)
        this.availableDiscounts = [
          { 
            id: 1, 
            name: 'Welcome Discount', 
            type: 'percentage', 
            value: 10,
            description: '10% off your order'
          },
          { 
            id: 2, 
            name: 'Free Shipping', 
            type: 'fixed', 
            value: 50,
            description: '₱50 off your order'
          },
          { 
            id: 3, 
            name: 'Seasonal Sale', 
            type: 'percentage', 
            value: 15,
            description: '15% off your order'
          }
        ]
      }
    },

    applyDiscount(discount) {
      this.appliedDiscount = discount
      this.selectedDiscountId = discount.id
      
      if (discount.type === 'percentage') {
        this.discountAmount = (this.totalPrice * discount.value) / 100
      } else {
        this.discountAmount = Math.min(discount.value, this.totalPrice)
      }
      
      this.showNotification('success', `Discount applied: ${discount.name}`)
    },

    // PayPal and checkout methods remain the same
    loadPayPalSDK() {
      return new Promise((resolve) => {
        if (this.paypalSDKLoaded) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = "https://www.paypal.com/sdk/js?client-id=AQxTkQXSz_YWa7v4iTym0qZONFDDzwVCpZHA6SSoJIYbQSdHzTVp05kndFYjNVEpt52hkY2_bAAP79WB&currency=PHP&commit=false"
        script.addEventListener('load', () => {
          this.paypalSDKLoaded = true
          resolve()
        })
        document.body.appendChild(script)
      })
    },

    async initPayPal() {
      await this.loadPayPalSDK()
      
      if (!window.paypal) {
        console.error('PayPal SDK failed to load')
        return
      }

      this.$refs.paypalButtonContainer.innerHTML = ''

      try {
        await window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
          },

          createOrder: async (data, actions) => {
            try {
              const token = localStorage.getItem('token')
              const response = await axios.post('/api/orders/paypal/create', {
                items: this.cart.map(item => ({
                  product_id: item.product_id,
                  size_id: item.size_id,
                  quantity: item.quantity,
                  price: item.price
                })),
                total: this.totalPrice - this.discountAmount + this.shippingCost,
                discount_amount: this.discountAmount,
                discount_id: this.selectedDiscountId,
                address: this.combinedAddress
              }, {
                headers: { Authorization: `Bearer ${token}` }
              })

              this.paypalOrderId = response.data.orderID
              return response.data.orderID
            } catch (error) {
              console.error('Error creating PayPal order:', error)
              this.showNotification('error', 'Failed to create PayPal order')
            }
          },

          onApprove: async (data, actions) => {
            try {
              console.log('PayPal payment approved, capturing...');
              
              const token = localStorage.getItem('token');
              const response = await axios.post('/api/orders/paypal/capture', {
                orderID: data.orderID,
                items: this.cart.map(item => ({
                  product_id: item.product_id,
                  size_id: item.size_id,
                  quantity: item.quantity,
                  price: item.price
                })),
                total: this.totalPrice - this.discountAmount + this.shippingCost,
                discount_amount: this.discountAmount,
                discount_id: this.selectedDiscountId,
                address: this.combinedAddress
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              this.showNotification('success', 'Payment completed successfully! Order is now being prepared.');
              this.cart = [];
              this.showPaymentModal = false;
              this.resetSelections();
              await this.fetchCart();
              
            } catch (error) {
              console.error('Error capturing PayPal payment:', error);
              let errorMessage = 'Payment failed. Please try again.';
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              }
              this.showNotification('error', errorMessage);
            }
          },

          onCancel: (data) => {
            this.showNotification('error', 'Payment was cancelled')
          },

          onError: (err) => {
            console.error('PayPal error:', err)
            this.showNotification('error', 'An error occurred with PayPal')
          }

        }).render(this.$refs.paypalButtonContainer)
      } catch (error) {
        console.error('Error rendering PayPal buttons:', error)
      }
    },

    watchPaymentMethod() {
      if (this.paymentMethod === 'PayPal') {
        this.$nextTick(() => {
          this.initPayPal()
        })
      }
    },

    async confirmCheckout() {
      if (!this.paymentMethod) {
        return this.showNotification('error', 'Please select a payment method.')
      }

      if (!this.isFormValid) {
        return this.showNotification('error', 'Please fill in all required fields.')
      }

      try {
        const token = localStorage.getItem('token')
        if (!token) return this.showNotification('error', 'Please login first.')

        if (this.paymentMethod === 'Credit Card') {
          await this.processCreditCardPayment()
          return
        }

        await axios.post('/api/orders', {
          items: this.cart.map(item => ({
            product_id: item.product_id,
            size_id: item.size_id,
            quantity: item.quantity,
            price: item.price
          })),
          total: this.totalPrice - this.discountAmount + this.shippingCost,
          discount_amount: this.discountAmount,
          discount_id: this.selectedDiscountId,
          payment_method: this.paymentMethod,
          address: this.combinedAddress
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.showNotification('success', 'Order placed successfully!')
        this.cart = []
        this.showPaymentModal = false
        this.resetSelections()
        await this.fetchCart()
      } catch (err) {
        const message = err.response?.data?.message || 'Checkout failed.'
        this.showNotification('error', message)
      }
    },

    async processCreditCardPayment() {
      try {
        const token = localStorage.getItem('token')
        
        const orderResponse = await axios.post('/api/orders/paypal/create', {
          items: this.cart.map(item => ({
            product_id: item.product_id,
            size_id: item.size_id,
            quantity: item.quantity,
            price: item.price
          })),
          total: this.totalPrice - this.discountAmount + this.shippingCost,
          discount_amount: this.discountAmount,
          discount_id: this.selectedDiscountId,
          address: this.combinedAddress,
          payment_source: {
            card: {
              name: this.cardDetails.name,
              number: this.cardDetails.number.replace(/\s/g, ''),
              expiry: this.cardDetails.expiry,
              security_code: this.cardDetails.cvv
            }
          }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        await axios.post('/api/orders/paypal/capture', {
          orderID: orderResponse.data.orderID
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.showNotification('success', 'Payment completed successfully!')
        this.cart = []
        this.showPaymentModal = false
        this.resetSelections()
        await this.fetchCart()

      } catch (error) {
        console.error('Credit card payment error:', error)
        const message = error.response?.data?.message || 'Credit card payment failed.'
        this.showNotification('error', message)
      }
    },

    resetSelections() {
      this.selectedDiscountId = null
      this.discountAmount = 0
      this.appliedDiscount = null
      this.paymentMethod = 'COD'
      this.resetAddressForm()
    }
  },

  watch: {
    paymentMethod: 'watchPaymentMethod',
    showPaymentModal(newVal) {
      if (newVal && this.paymentMethod === 'PayPal') {
        this.watchPaymentMethod();
      }
    }
  },

  async mounted() {
    await this.fetchCart()
  }
}
</script>

<style scoped>
.cart-view {
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
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  min-width: 200px;
}

.card-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f0f9f5, #e0f2ec);
  border-radius: 14px;
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
  line-height: 1;
}

.summary-label {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

/* Main Content */
.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

/* Cart Section */
.cart-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  overflow: hidden;
}

.section-header {
  padding: 24px;
  border-bottom: 1px solid #e0f0e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fdfb, #f0f9f5);
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0;
}

.clear-cart {
  background: none;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 10px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-cart:hover {
  background: #fef2f2;
  transform: translateY(-1px);
}

/* Cart Items */
.cart-items {
  padding: 0;
}

.cart-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid #f0f9f5;
  transition: all 0.3s ease;
  position: relative;
}

.cart-item:hover {
  background: #f7fcf9;
  transform: translateY(-1px);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  flex-shrink: 0;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f0f9f5, #e0f2ec);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border: 1px solid #e0f0e9;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.item-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.item-size, .item-price {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

.item-price {
  font-weight: 600;
  color: #1a7d5e;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 8px;
  border: 1px solid #e0f0e9;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.qty-btn:hover:not(:disabled) {
  background: #1a7d5e;
  color: white;
  transform: scale(1.05);
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
  font-size: 16px;
}

.item-total {
  font-size: 18px;
  font-weight: 700;
  color: #1a7d5e;
}

.remove-item {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-item:hover {
  background: #fef2f2;
  color: #dc2626;
  transform: scale(1.1);
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
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
  font-size: 16px;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(26, 125, 94, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(26, 125, 94, 0.4);
}

/* Modern Summary Card */
.summary-section {
  position: sticky;
  top: 24px;
}

.summary-card-modern {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  overflow: hidden;
}

.summary-header {
  padding: 24px;
  border-bottom: 1px solid #e0f0e9;
  background: linear-gradient(135deg, #f8fdfb, #f0f9f5);
}

.summary-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0;
}

.summary-content {
  padding: 24px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
}

.summary-line .label {
  color: #4a7c6d;
  font-weight: 500;
}

.summary-line .value {
  font-weight: 600;
  color: #0a3c2b;
}

.summary-line.total {
  font-size: 18px;
  font-weight: 700;
  color: #0a3c2b;
}

.summary-line.total .value {
  font-size: 20px;
  font-weight: 800;
  color: #1a7d5e;
}

.discount {
  color: #e53e3e;
}

.summary-divider {
  height: 1px;
  background: #e0f0e9;
  margin: 20px 0;
}

/* Discount Section */
.discount-section {
  margin: 24px 0;
}

.discount-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 16px 0;
  font-weight: 600;
  color: #0a3c2b;
}

.discount-header svg {
  transition: transform 0.2s;
}

.discount-header svg.rotated {
  transform: rotate(180deg);
}

.discount-options {
  border-top: 1px solid #e0f0e9;
  padding-top: 16px;
}

.discount-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
  border: 1px solid transparent;
}

.discount-option:hover {
  background: #f7fcf9;
  border-color: #e0f0e9;
}

.discount-option.selected {
  background: #e0f2ec;
  border-color: #1a7d5e;
}

.discount-badge {
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.discount-info {
  flex: 1;
}

.discount-name {
  font-weight: 600;
  color: #0a3c2b;
  display: block;
  margin-bottom: 4px;
}

.discount-desc {
  font-size: 14px;
  color: #4a7c6d;
}

.discount-radio {
  display: flex;
  align-items: center;
}

.radio-dot {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  transition: all 0.2s;
}

.radio-dot.active {
  border-color: #1a7d5e;
  background: #1a7d5e;
  box-shadow: inset 0 0 0 4px white;
}

.no-discounts {
  text-align: center;
  color: #4a7c6d;
  font-style: italic;
  padding: 20px;
}

/* Checkout Button */
.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  color: white;
  border: none;
  padding: 18px 24px;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  box-shadow: 0 4px 12px rgba(26, 125, 94, 0.3);
  font-size: 16px;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(26, 125, 94, 0.4);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Modern Custom Notification */
.custom-notif {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 48px 16px 24px;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 60, 43, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(10, 60, 43, 0.3);
  animation: slideUp 0.3s ease;
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

.payment-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #0a3c2b;
}

.modal-close {
  background: none;
  border: none;
  color: #7aa895;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f0f9f5;
  color: #0a3c2b;
  transform: rotate(90deg);
}

.modal-body {
  padding: 0 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e0f0e9;
  margin-top: 20px;
}

/* Delete Content */
.delete-content {
  text-align: center;
  padding: 16px 0;
}

.delete-icon {
  margin-bottom: 16px;
  color: #e53e3e;
}

.delete-content p {
  margin: 0;
  color: #4a7c6d;
  line-height: 1.6;
  font-size: 15px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #f8fafc;
  color: #4a7c6d;
  border: 1px solid #e0f0e9;
}

.btn-secondary:hover {
  background: #f0f9f5;
  transform: translateY(-1px);
}

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background: #c53030;
  transform: translateY(-1px);
}

/* Payment Modal Content */
.modal-content {
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-section {
  padding: 24px;
  border-bottom: 1px solid #f0f9f5;
}

.modal-section:last-child {
  border-bottom: none;
}

.modal-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0 0 16px 0;
}

/* Order Items in Modal */
.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f9f5;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item-info {
  flex: 1;
}

.order-item-name {
  font-weight: 500;
  color: #0a3c2b;
  display: block;
  margin-bottom: 4px;
}

.order-item-details {
  font-size: 14px;
  color: #4a7c6d;
}

.order-item-price {
  font-weight: 600;
  color: #1a7d5e;
}

.order-totals {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.total-line:last-child {
  margin-bottom: 0;
}

.total-line.grand-total {
  font-weight: 700;
  font-size: 16px;
  color: #0a3c2b;
  padding-top: 12px;
  border-top: 1px solid #e0f0e9;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e0f0e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-method:hover {
  border-color: #1a7d5e;
  transform: translateY(-1px);
}

.payment-method.active {
  border-color: #1a7d5e;
  background: #e0f2ec;
}

.method-icon {
  font-size: 24px;
}

.method-info {
  flex: 1;
}

.method-name {
  font-weight: 500;
  color: #0a3c2b;
  display: block;
  margin-bottom: 4px;
}

.method-description {
  font-size: 14px;
  color: #4a7c6d;
}

.method-radio {
  display: flex;
  align-items: center;
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  transition: all 0.2s;
}

.radio-indicator.active {
  border-color: #1a7d5e;
  background: #1a7d5e;
  box-shadow: inset 0 0 0 4px white;
}

/* Payment Details */
.payment-details {
  margin-top: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.paypal-info p {
  margin: 0 0 16px 0;
  color: #4a7c6d;
  text-align: center;
  font-size: 14px;
}

#paypal-button-container {
  min-height: 45px;
  display: flex;
  justify-content: center;
}

/* Modal Actions */
.modal-actions {
  padding: 24px;
  border-top: 1px solid #e0f0e9;
  background: white;
}

.confirm-order-btn {
  width: 100%;
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  color: white;
  border: none;
  padding: 18px 24px;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(26, 125, 94, 0.3);
}

.confirm-order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(26, 125, 94, 0.4);
}

.confirm-order-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-text {
  font-size: 16px;
}

.btn-amount {
  font-weight: 700;
  font-size: 18px;
}

.paypal-note {
  text-align: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.paypal-note p {
  margin: 0;
  color: #4a7c6d;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .summary-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-view {
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
  
  .cart-item {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .item-controls {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 20px;
  }
  
  .quantity-controls {
    justify-content: center;
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
  
  .cart-item {
    padding: 16px;
  }
  
  .summary-card-modern {
    padding: 0;
  }
  
  .summary-header,
  .summary-content {
    padding: 20px;
  }
  
  .modal-section {
    padding: 20px;
  }
  
  .confirm-order-btn {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .item-controls {
    flex-direction: column;
    gap: 16px;
  }
  
  .quantity-section {
    width: 100%;
  }
}

/* Cart Image Styles */
.product-image-container {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0f0e9;
}

.product-real-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f0f9f5, #e0f2ec);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border: 1px solid #e0f0e9;
}

/* Modal Image Styles */
.order-item-image {
  flex-shrink: 0;
}

.modal-product-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0f0e9;
}

.modal-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-image-placeholder {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f0f9f5, #e0f2ec);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 1px solid #e0f0e9;
}
</style>