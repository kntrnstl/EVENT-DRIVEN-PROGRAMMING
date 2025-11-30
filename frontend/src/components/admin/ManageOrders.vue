<template>
  <div class="inventory-container">

    <!-- Modern Custom Notification -->
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
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        {{ notification.message }}
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Order Processing Dashboard</h1>
          <p class="page-subtitle">Manage and track customer orders</p>
        </div>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="summary-value">{{ paginatedOrders.length }}</span>
              <span class="summary-label">Showing {{ showingText }} of {{ filteredOrders.length }} orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-container">
      <div class="table-header">
        <h3>Orders</h3>
        <div class="table-actions">
          <!-- Search Input -->
          <div class="search-container">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input 
              v-model="search" 
              type="text" 
              placeholder="Search orders..." 
              class="search-input"
            >
          </div>
          <!-- Status Filter -->
          <div class="filter-container">
            <select v-model="statusFilter" class="filter-select">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <!-- Items Per Page -->
          <div class="page-size-container">
            <select v-model="itemsPerPage" class="page-size-select">
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th class="col-id">Order ID</th>
              <th class="col-user">User</th>
              <th class="col-price">Total (₱)</th>
              <th class="col-items">Items</th>
              <th class="col-status">Status</th>
              <th class="col-actions">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedOrders.length === 0">
              <td colspan="6" class="no-data">
                {{ isLoading ? 'Loading orders...' : 'No orders found.' }}
              </td>
            </tr>
            <tr v-for="order in paginatedOrders" :key="order.order_id">
              <td class="col-id">
                <span class="order-id">#{{ order.order_id }}</span>
              </td>
              <td class="col-user">
                <div class="user-info">
                  <div class="username">{{ order.username }}</div>
                </div>
              </td>
              <td class="col-price">
                <span class="price">₱{{ typeof order.total === 'number' ? order.total.toFixed(2) : order.total }}</span>
              </td>

              <!-- Items Nested Table -->
              <td class="col-items">
                <div class="inner-table-container">
                  <table class="inner-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in order.items" :key="item.id">
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.size || 'N/A' }}</td>
                        <td class="qty-col">{{ item.quantity }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>

              <!-- Status -->
              <td class="col-status">
                <select 
                  v-model="order.status" 
                  :class="getStatusClass(order.status)"
                  :disabled="order.isUpdating"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>

              <!-- Action Button -->
              <td class="col-actions">
                <button 
                  class="btn-action btn-update"
                  @click="updateStatus(order)"
                  :disabled="order.isUpdating"
                  title="Update Status"
                >
                  <span v-if="order.isUpdating">...</span>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12V20H20V4H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13 11L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 3H15V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredOrders.length > 0" class="pagination-container">
        <div class="pagination-info">
          Showing {{ showingText }} of {{ filteredOrders.length }} orders
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Previous
          </button>
          
          <div class="pagination-pages">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <span v-if="showEllipsis" class="page-ellipsis">...</span>
          </div>
          
          <button 
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      search: "",
      statusFilter: "",
      notification: { 
        show: false, 
        message: '', 
        type: '' 
      },
      isLoading: false,
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchesSearch = 
          order.username.toLowerCase().includes(this.search.toLowerCase()) ||
          order.order_id.toString().includes(this.search) ||
          order.items.some(item => 
            item.product_name.toLowerCase().includes(this.search.toLowerCase())
          );

        const matchesStatus = !this.statusFilter || 
          order.status.toLowerCase() === this.statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    },
    paginatedOrders() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredOrders.slice(startIndex, endIndex);
    },
    showingText() {
      const start = (this.currentPage - 1) * this.itemsPerPage + 1;
      const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
      return `${start}-${end}`;
    },
    visiblePages() {
      const pages = [];
      const maxVisiblePages = 5;
      
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust start page if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    },
    showEllipsis() {
      return this.totalPages > this.visiblePages[this.visiblePages.length - 1];
    }
  },
  watch: {
    search() {
      this.currentPage = 1;
    },
    statusFilter() {
      this.currentPage = 1;
    },
    itemsPerPage() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    getStatusClass(status) {
      switch (status?.toLowerCase()) {
        case 'delivered': return 'status-delivered';
        case 'out for delivery': return 'status-delivery';
        case 'preparing': return 'status-preparing';
        case 'cancelled': return 'status-cancelled';
        case 'pending':
        default: return 'status-pending';
      }
    },

    showNotification(type, message) {
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },

    async fetchOrders() {
      this.isLoading = true;
      try {
        const res = await axios.get('/api/admin/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.orders = res.data.map(o => ({ ...o, isUpdating: false }));
      } catch (err) {
        console.error(err);
        this.showNotification('error', 'Failed to fetch orders');
      } finally {
        this.isLoading = false;
      }
    },

    async updateStatus(order) {
      order.isUpdating = true;
      try {
        await axios.put(`/api/admin/orders/${order.order_id}`, 
          { status: order.status }, 
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        this.showNotification('success', `Order #${order.order_id} updated to ${order.status}`);
      } catch (err) {
        console.error(err);
        this.showNotification('error', `Failed to update order #${order.order_id}`);
      } finally {
        order.isUpdating = false;
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  }
};
</script>

<style scoped>
.inventory-container {
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
  text-align: center;
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

/* Table Container */
.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  margin-bottom: 20px;
}

.table-header h3 {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-container {
  position: relative;
}

.search-container svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a7c6d;
}

.search-input {
  padding: 10px 12px 10px 36px;
  border: 1px solid #c8e6d9;
  border-radius: 10px;
  background: #f8fdfb;
  color: #0a3c2b;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  width: 250px;
}

.search-input:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.filter-container {
  position: relative;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #c8e6d9;
  border-radius: 10px;
  background: #f8fdfb;
  color: #0a3c2b;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  min-width: 140px;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.page-size-container {
  position: relative;
}

.page-size-select {
  padding: 10px 12px;
  border: 1px solid #c8e6d9;
  border-radius: 10px;
  background: #f8fdfb;
  color: #0a3c2b;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  min-width: 120px;
  cursor: pointer;
}

.page-size-select:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

/* Table Styles */
.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  text-align: left;
  padding: 16px 20px;
  background: #f0f9f5;
  color: #0a3c2b;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e0f0e9;
}

.modern-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f9f5;
}

.modern-table tr:hover {
  background: #f7fcf9;
}

/* Column Styles */
.col-id {
  width: 100px;
}

.col-user {
  min-width: 120px;
}

.col-price {
  width: 120px;
  text-align: left;
}

.col-items {
  min-width: 250px;
}

.col-status {
  width: 150px;
}

.col-actions {
  width: 80px;
  text-align: center;
}

.col-actions .btn-action {
  margin-left: 6px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}


/* Order Info */
.order-id {
  color: #4a7c6d;
  font-weight: 600;
  font-size: 14px;
}

.user-info .username {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 15px;
}

.price {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 15px;
}

/* FIXED Inner Table with Slightly Adjusted Column Sizes */
.inner-table-container { 
  max-height: 180px; 
  overflow-y: auto; 
  border: 1px solid #d1e7d8; 
  border-radius: 8px; 
  background: #f7fcf9; 
}

.inner-table { 
  width: 100%; 
  border-collapse: collapse; 
  font-size: 0.85rem; 
  table-layout: fixed; /* This fixes the column widths */
}

.inner-table th, .inner-table td { 
  padding: 8px 10px; 
  text-align: left;
  vertical-align: top;
  overflow: hidden;
}

.inner-table thead { 
  background-color: #d1e7d8; 
  font-weight: 600; 
  position: sticky; 
  top: 0; 
}

/* SLIGHTLY ADJUSTED column widths */
.inner-table th:nth-child(1),
.inner-table td:nth-child(1) {
  width: 62%; /* Slightly increased from 60% */
  min-width: 155px;
}

.inner-table th:nth-child(2),
.inner-table td:nth-child(2) {
  width: 65%; /* Slightly adjusted */
  min-width: 55px;
  text-align: center;
}

.inner-table th:nth-child(3),
.inner-table td:nth-child(3) {
  width: 17%; /* Slightly reduced from 20% */
  min-width: 45px;
  text-align: center;
}

/* Handle long product names with ellipsis */
.inner-table td:first-child {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qty-col {
  text-align: center;
  font-weight: 600;
}

/* Handle long product names with ellipsis */
.product-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status Dropdown */
.col-status select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid #e0f0e9;
  background: #f8fdfb;
  color: #0a3c2b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.col-status select:hover,
.col-status select:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 2px rgba(26, 125, 94, 0.1);
  outline: none;
}

.status-pending { 
  background: #fff7e6; 
  color: #f59e0b; 
  border-color: #fed7a8;
}

.status-preparing { 
  background: #e6f0ff; 
  color: #3b82f6; 
  border-color: #bfdbfe;
}

.status-delivery { 
  background: #f3e6ff; 
  color: #8b5cf6; 
  border-color: #ddd6fe;
}

.status-delivered { 
  background: #e6fff3; 
  color: #10b981; 
  border-color: #a7f3d0;
}

.status-cancelled { 
  background: #ffe6e6; 
  color: #ef4444; 
  border-color: #fecaca;
}

/* Action Buttons */
.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e0f0e9;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a7c6d;
  margin: 0 auto;
}


.btn-action:hover {
  background: #f0f9f5;
  border-color: #1a7d5e;
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-update:hover {
  background: #1a7d5e;
  color: white;
}

/* Empty State */
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #7aa895;
  font-style: italic;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e0f0e9;
  background: #f8fdfb;
}

.pagination-info {
  color: #4a7c6d;
  font-size: 14px;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #c8e6d9;
  background: white;
  border-radius: 8px;
  color: #0a3c2b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f0f9f5;
  border-color: #1a7d5e;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #c8e6d9;
  background: white;
  border-radius: 6px;
  color: #0a3c2b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
}

.page-btn:hover {
  background: #f0f9f5;
  border-color: #1a7d5e;
}

.page-btn.active {
  background: #1a7d5e;
  color: white;
  border-color: #1a7d5e;
}

.page-ellipsis {
  padding: 8px 4px;
  color: #4a7c6d;
  font-size: 14px;
}

/* Modern Notification */
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
@media (max-width: 768px) {
  .inventory-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .summary-cards {
    justify-content: center;
  }
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .table-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .search-input,
  .filter-select,
  .page-size-select {
    width: 100%;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 12px 16px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .pagination-controls {
    justify-content: center;
  }
  
  .pagination-pages {
    display: none;
  }
}

@media (max-width: 480px) {
  .summary-card {
    min-width: auto;
    flex: 1;
  }
  
  .inner-table-container {
    max-height: 120px;
  }
  
  .pagination-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .product-col,
  .size-col,
  .qty-col {
    min-width: auto;
  }
}
</style>