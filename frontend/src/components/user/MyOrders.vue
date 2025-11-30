<template>
  <div class="orders-view">
    <!-- Modern Notification -->
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
        {{ notification.message }}
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Order Details</h2>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Order Summary -->
          <div class="details-section">
            <h3>Order Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">{{ selectedOrder.order_id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Order Date:</span>
                <span class="detail-value">{{ formatDate(selectedOrder.created_at) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value status-badge" :class="getStatusClass(selectedOrder.status)">
                  <span class="status-dot"></span>
                  {{ formatStatus(selectedOrder.status) }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value total-amount">₱{{ selectedOrder.total.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="details-section">
            <h3>Order Items ({{ selectedOrder.items.length }})</h3>
            <div class="items-list">
              <div
                v-for="item in selectedOrder.items"
                :key="item.item_id"
                class="detail-item-card"
              >
                <div class="item-image">
                  <div v-if="item.image" class="product-image-container">
                    <img :src="item.image" :alt="item.product_name" class="product-real-image" />
                  </div>
                  <div v-else class="image-placeholder">
                    <span>👟</span>
                  </div>
                </div>
                
                <div class="item-info">
                  <h4 class="product-name">{{ item.product_name }}</h4>
                  <div class="item-specs">
                    <span class="spec">Size: {{ item.size }}</span>
                    <span class="spec">Quantity: {{ item.quantity }}</span>
                    <span class="spec">Price: ₱{{ item.price.toLocaleString() }}</span>
                  </div>
                  <div class="item-subtotal">
                    Subtotal: ₱{{ (item.price * item.quantity).toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Tracking -->
          <div class="details-section">
            <h3>Order Progress</h3>
            <div class="progress-timeline">
              <div class="timeline-item" :class="{ active: isStepActive(selectedOrder.status, 'pending') }">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Order Placed</h4>
                  <p>Your order has been received</p>
                </div>
              </div>
              <div class="timeline-item" :class="{ active: isStepActive(selectedOrder.status, 'preparing') }">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Preparing</h4>
                  <p>Your items are being prepared</p>
                </div>
              </div>
              <div class="timeline-item" :class="{ active: isStepActive(selectedOrder.status, 'out of delivery') }">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Out for Delivery</h4>
                  <p>Your order is on the way</p>
                </div>
              </div>
              <div class="timeline-item" :class="{ active: isStepActive(selectedOrder.status, 'delivered') }">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>Delivered</h4>
                  <p>Your order has been delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">
            Close
          </button>
          <button 
            v-if="selectedOrder.status.toLowerCase() === 'delivered'" 
            class="btn-primary"
            @click="reorderItems(selectedOrder)"
          >
            Reorder All Items
          </button>
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">My Orders</h1>
          <p class="page-subtitle">Track and manage your purchase history</p>
        </div>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="summary-value">{{ orders.length }}</span>
              <span class="summary-label">Total Orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls Section -->
    <div class="controls-section">
      <div class="filter-group">
        <div class="filter-container">
          <label class="filter-label">Filter by Status</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">All Orders</option>
            <option value="pending">🟡 Pending</option>
            <option value="preparing">👨‍🍳 Preparing</option>
            <option value="out of delivery">🚚 Out for Delivery</option>
            <option value="delivered">✅ Delivered</option>
          </select>
        </div>
        
        <div class="order-stats">
          <span class="stat-text">
            Showing {{ filteredOrders.length }} of {{ orders.length }} orders
          </span>
        </div>
      </div>
    </div>

    <!-- Orders Grid -->
    <div class="orders-grid-section">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2>No orders found</h2>
        <p v-if="selectedStatus">No {{ selectedStatus }} orders at the moment</p>
        <p v-else>You haven't placed any orders yet</p>
        <button class="btn-primary" @click="selectedStatus = ''">
          View All Orders
        </button>
      </div>

      <!-- Orders List -->
      <div v-else class="orders-grid">
        <div
          class="order-card"
          v-for="order in filteredOrders"
          :key="order.order_id"
        >
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-meta">
              <div class="order-id">ORDER ID - {{ order.order_id }}</div>
              <div class="order-date">{{ formatDate(order.created_at) }}</div>
            </div>
            <div class="order-status">
              <span class="status-badge" :class="getStatusClass(order.status)">
                <span class="status-dot"></span>
                {{ formatStatus(order.status) }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="order-items">
            <div
              v-for="item in order.items"
              :key="item.item_id"
              class="order-item"
            >
              <div class="item-image">
                <div v-if="item.image" class="product-image-container">
                  <img :src="item.image" :alt="item.product_name" class="product-real-image" />
                </div>
                <div v-else class="image-placeholder">
                  <span>👟</span>
                </div>
              </div>
              
              <div class="item-details">
                <h4 class="product-name">{{ item.product_name }}</h4>
                <div class="item-specs">
                  <span class="spec">Size: {{ item.size }}</span>
                  <span class="spec">Qty: {{ item.quantity }}</span>
                </div>
                <div class="item-price">₱{{ item.price.toLocaleString() }}</div>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="order-footer">
            <div class="order-total">
              <span class="total-label">Total Amount:</span>
              <span class="total-amount">₱{{ order.total.toLocaleString() }}</span>
            </div>
            <div class="order-actions">
              <button class="btn-secondary" @click="viewOrderDetails(order)">
                View Details
              </button>
              <button 
                v-if="order.status.toLowerCase() === 'delivered'" 
                class="btn-primary"
                @click="reorderItems(order)"
              >
                Reorder
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="order-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :class="getProgressClass(order.status)"
                :style="{ width: getProgressWidth(order.status) }"
              ></div>
            </div>
            <div class="progress-labels">
              <span :class="{ active: isStepActive(order.status, 'pending') }">Ordered</span>
              <span :class="{ active: isStepActive(order.status, 'preparing') }">Preparing</span>
              <span :class="{ active: isStepActive(order.status, 'out of delivery') }">Shipping</span>
              <span :class="{ active: isStepActive(order.status, 'delivered') }">Delivered</span>
            </div>
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
      orders: [],
      loading: true,
      selectedStatus: '',
      selectedOrder: null,
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  computed: {
    filteredOrders() {
      if (!this.selectedStatus) return this.orders;
      return this.orders.filter(
        order => order.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }
  },
  async mounted() {
    await this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        this.orders = res.data;
      } catch (err) {
        console.error("Error loading orders", err);
        this.showNotification('Failed to load orders', 'error');
      } finally {
        this.loading = false;
      }
    },

    viewOrderDetails(order) {
      this.selectedOrder = order;
    },

    closeModal() {
      this.selectedOrder = null;
    },

    formatDate(date) {
      return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    },

    formatStatus(status) {
      const statusMap = {
        'pending': 'Pending',
        'preparing': 'Preparing',
        'out of delivery': 'Out for Delivery',
        'delivered': 'Delivered'
      };
      return statusMap[status.toLowerCase()] || status;
    },

    getStatusClass(status) {
      const statusClass = {
        'pending': 'pending',
        'preparing': 'preparing',
        'out of delivery': 'shipping',
        'delivered': 'delivered'
      };
      return statusClass[status.toLowerCase()] || 'pending';
    },

    getProgressWidth(status) {
      const progress = {
        'pending': '25%',
        'preparing': '50%',
        'out of delivery': '75%',
        'delivered': '100%'
      };
      return progress[status.toLowerCase()] || '0%';
    },

    getProgressClass(status) {
      const progressClass = {
        'pending': 'pending',
        'preparing': 'preparing',
        'out of delivery': 'shipping',
        'delivered': 'delivered'
      };
      return progressClass[status.toLowerCase()] || 'pending';
    },

    isStepActive(currentStatus, step) {
      const stepOrder = ['pending', 'preparing', 'out of delivery', 'delivered'];
      const currentIndex = stepOrder.indexOf(currentStatus.toLowerCase());
      const stepIndex = stepOrder.indexOf(step);
      return currentIndex >= stepIndex;
    },

    reorderItems(order) {
      this.showNotification('Items added to cart for reorder!', 'success');
    },

    showNotification(message, type = 'success') {
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(10, 60, 43, 0.3);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e0f0e9;
  background: linear-gradient(135deg, #f8fdfb, #f0f9f5);
}

.modal-header h2 {
  color: #0a3c2b;
  font-weight: 700;
  font-size: 24px;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #4a7c6d;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e0f0e9;
  color: #0a3c2b;
}

.modal-body {
  padding: 24px;
}

.details-section {
  margin-bottom: 32px;
}

.details-section h3 {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0f0e9;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-label {
  color: #4a7c6d;
  font-weight: 500;
  font-size: 14px;
}

.detail-value {
  color: #0a3c2b;
  font-weight: 600;
}

.detail-value.total-amount {
  font-size: 18px;
  color: #1a7d5e;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8fdfb;
  border-radius: 12px;
  border: 1px solid #e0f0e9;
  transition: all 0.2s;
}

.detail-item-card:hover {
  background: #f0f9f5;
  transform: translateY(-1px);
}

.detail-item-card .item-image {
  margin-right: 16px;
}

.detail-item-card .item-info {
  flex: 1;
}

.detail-item-card .product-name {
  font-size: 16px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0 0 8px 0;
}

.detail-item-card .item-specs {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.detail-item-card .spec {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

.detail-item-card .item-subtotal {
  font-size: 15px;
  font-weight: 700;
  color: #1a7d5e;
}

.progress-timeline {
  position: relative;
  padding-left: 24px;
}

.progress-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0f0e9;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.timeline-item.active {
  opacity: 1;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -24px;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e0f0e9;
  border: 3px solid white;
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-marker {
  background: #1a7d5e;
  box-shadow: 0 0 0 4px rgba(26, 125, 94, 0.2);
}

.timeline-content h4 {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 16px;
  margin: 0 0 4px 0;
}

.timeline-content p {
  color: #4a7c6d;
  font-size: 14px;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e0f0e9;
  background: #f8fdfb;
}

/* Update existing styles for better modal compatibility */
.custom-notif {
  z-index: 1001; /* Above modal */
}

/* Responsive design for modal */
@media (max-width: 768px) {
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer button {
    width: 100%;
  }
}

/* Rest of your existing styles remain the same */
.orders-view {
  padding: 24px;
  background: #f8fdfb;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ... (all your existing CSS styles remain exactly the same) ... */

/* Order Image Styles */
.item-image {
  flex-shrink: 0;
  position: relative;
}

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
  transition: transform 0.3s ease;
}

.order-item:hover .product-real-image {
  transform: scale(1.05);
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

.orders-view {
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
  min-width: 180px;
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
  text-align: center;
  color: #0a3c2b;
  line-height: 1;
}

.summary-label {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

/* Controls Section */
.controls-section {
  margin-bottom: 32px;
}

.filter-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #0a3c2b;
}

.filter-select {
  padding: 14px 16px;
  border: 2px solid #e0f0e9;
  border-radius: 12px;
  background: white;
  font-size: 15px;
  transition: all 0.2s;
  color: #0a3c2b;
  min-width: 200px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%234a7c6d' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 12px;
  appearance: none;
}

.filter-select:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.stat-text {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

/* Orders Grid */
.orders-grid-section {
  margin-bottom: 40px;
}

.orders-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Order Card */
.order-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(10, 60, 43, 0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #e0f0e9;
  background: linear-gradient(135deg, #f8fdfb, #f0f9f5);
}

.order-meta .order-id {
  font-size: 18px;
  font-weight: 700;
  color: #0a3c2b;
  margin-bottom: 4px;
}

.order-meta .order-date {
  font-size: 14px;
  color: #4a7c6d;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.pending .status-dot {
  background: #ffc107;
}

.status-badge.preparing {
  background: #cce7ff;
  color: #004085;
}

.status-badge.preparing .status-dot {
  background: #007bff;
}

.status-badge.shipping {
  background: #ffe6cc;
  color: #663c00;
}

.status-badge.shipping .status-dot {
  background: #ff8c00;
}

.status-badge.delivered {
  background: #d4edda;
  color: #155724;
}

.status-badge.delivered .status-dot {
  background: #28a745;
}

/* Order Items */
.order-items {
  padding: 0;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0f0e9;
  transition: background-color 0.2s;
}

.order-item:hover {
  background: #f8fdfb;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  flex-shrink: 0;
  margin-right: 16px;
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e0f0e9;
}

.item-details {
  flex: 1;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0 0 8px 0;
}

.item-specs {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.spec {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #1a7d5e;
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e0f0e9;
  background: #f8fdfb;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-label {
  font-size: 16px;
  color: #4a7c6d;
  font-weight: 500;
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: #0a3c2b;
}

.order-actions {
  display: flex;
  gap: 12px;
}

.btn-primary, .btn-secondary {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
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

/* Order Progress */
.order-progress {
  padding: 20px 24px;
  border-top: 1px solid #e0f0e9;
  background: white;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0f0e9;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.pending { background: #ffc107; }
.progress-fill.preparing { background: #007bff; }
.progress-fill.shipping { background: #ff8c00; }
.progress-fill.delivered { background: #28a745; }

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #7aa895;
  font-weight: 500;
}

.progress-labels span.active {
  color: #0a3c2b;
  font-weight: 600;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0f0e9;
  border-top: 3px solid #1a7d5e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #4a7c6d;
  font-size: 16px;
  margin: 0;
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

/* Notification */
.custom-notif {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
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
}

.notif-icon {
  display: flex;
  align-items: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .summary-cards {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .orders-view {
    padding: 16px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .order-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .order-actions {
    width: 100%;
  }
  
  .btn-primary, .btn-secondary {
    flex: 1;
  }
  
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    text-align: left;
  }
  
  .item-image {
    margin-right: 0;
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
  
  .progress-labels {
    font-size: 10px;
  }
}

/* Order Image Styles */
.item-image {
  flex-shrink: 0;
  position: relative;
}

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
  transition: transform 0.3s ease;
}

.order-item:hover .product-real-image {
  transform: scale(1.05);
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
</style>