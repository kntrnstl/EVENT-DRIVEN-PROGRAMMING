<template>
  <div class="inventory-container">
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
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        {{ notification.message }}
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="confirmDelete.show" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Delete Product</h3>
          <button class="modal-close" @click="cancelDelete">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-content">
            <div class="delete-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p>Are you sure you want to delete <strong>{{ confirmDelete.name }}</strong>? This action cannot be undone.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="cancelDelete" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDeleteProduct" class="btn btn-danger">Delete Product</button>
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Product Inventory</h1>
          <p class="page-subtitle">Manage your product catalog and inventory levels</p>
        </div>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="summary-value">{{ paginatedProducts.length }}</span>
              <span class="summary-label">Showing {{ startIndex }}-{{ endIndex }} of {{ filteredProducts.length }} products</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <div class="search-container">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input 
          v-model="search" 
          type="text" 
          placeholder="Search products..." 
          class="search-input"
        >
      </div>

      <div class="filter-group">
        <!-- Category Filter -->
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>

        <!-- Items Per Page Selector -->
        <select v-model="itemsPerPage" class="filter-select">
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="table-container">
      <div class="table-wrapper">
        <table class="inventory-table">
          <thead>
            <tr>
              <th class="col-id">ID</th>
              <th class="col-name">Product</th>
              <th class="col-category">Category</th>
              <th class="col-price">Price</th>
              <th class="col-stock">Sizes & Stock</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.product_id" class="table-row">
              <td class="col-id">
                <span class="product-id">#{{ product.product_id }}</span>
              </td>
              <td class="col-name">
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-description">{{ product.description || 'No description' }}</div>
                </div>
              </td>
              <td class="col-category">
                <span class="category-badge">{{ product.category_name || 'Uncategorized' }}</span>
              </td>
              <td class="col-price">
                <span class="price">₱{{ parseFloat(product.price).toFixed(2) }}</span>
              </td>
              <td class="col-stock">
                <div class="sizes-container">
                  <div 
                    v-for="size in product.sizes" 
                    :key="size.id" 
                    :class="['size-item', {
                      'low-stock': size.stock < 5 && size.stock > 0,
                      'out-stock': size.stock === 0
                    }]"
                  >
                    <span class="size-label">{{ size.size }}</span>
                    <span class="stock-count">{{ size.stock }}</span>
                  </div>
                  <div v-if="!product.sizes || product.sizes.length === 0" class="no-sizes">
                    No sizes
                  </div>
                </div>
              </td>
              <td class="col-actions">
                <div class="action-buttons">
                  <button class="btn-icon btn-danger" @click="prepareDelete(product.product_id, product.name)" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="products.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>No products found</h3>
          <p>Get started by adding your first product to the inventory</p>
        </div>
        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>No matching products</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="pagination-info">
        Showing {{ startIndex }}-{{ endIndex }} of {{ filteredProducts.length }} products
      </div>
      <div class="pagination-controls">
        <button 
          class="btn-pagination" 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Previous
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="pageNum in visiblePages" 
            :key="pageNum"
            :class="['page-number', { active: pageNum === currentPage }]"
            @click="changePage(pageNum)"
          >
            {{ pageNum }}
          </button>
        </div>
        
        <button 
          class="btn-pagination" 
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
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      search: "",
      selectedCategory: "",
      currentPage: 1,
      itemsPerPage: 10,
      notification: {
        show: false,
        message: '',
        type: ''
      },
      confirmDelete: {
        show: false,
        id: null,
        name: ''
      }
    }
  },
  computed: {
    categories() {
      // Extract unique categories from products
      const categorySet = new Set();
      this.products.forEach(product => {
        if (product.category_name) {
          categorySet.add(product.category_name);
        }
      });
      return Array.from(categorySet).sort();
    },
    filteredProducts() {
      return this.products.filter(product => {
        const matchesSearch =
          product.name.toLowerCase().includes(this.search.toLowerCase()) ||
          product.description?.toLowerCase().includes(this.search.toLowerCase()) ||
          product.category_name?.toLowerCase().includes(this.search.toLowerCase());
        
        const matchesCategory = 
          !this.selectedCategory || 
          product.category_name === this.selectedCategory;

        return matchesSearch && matchesCategory;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProducts.slice(start, start + this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endIndex() {
      const end = this.currentPage * this.itemsPerPage;
      return end > this.filteredProducts.length ? this.filteredProducts.length : end;
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
      
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  watch: {
    search() {
      this.currentPage = 1;
    },
    selectedCategory() {
      this.currentPage = 1;
    },
    itemsPerPage() {
      this.currentPage = 1;
    }
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    showNotification(type, message) {
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },

    async fetchProducts() {
      try {
        const res = await axios.get('/api/admin/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        this.products = res.data.map(p => ({
          ...p,
          category_name: p.category?.name || p.category || 'Uncategorized',
          sizes: p.sizes || []
        }));

      } catch (err) {
        console.error(err);
        this.showNotification('error', 'Failed to fetch products');
      }
    },

    prepareDelete(id, name) {
      this.confirmDelete.id = id;
      this.confirmDelete.name = name;
      this.confirmDelete.show = true;
    },

    async confirmDeleteProduct() {
      try {
        await axios.delete(`/api/admin/products/${this.confirmDelete.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.showNotification('success', 'Product deleted successfully');
        this.fetchProducts();
      } catch (err) {
        console.error(err);
        this.showNotification('error', 'Failed to delete product');
      } finally {
        this.confirmDelete.show = false;
      }
    },

    cancelDelete() {
      this.confirmDelete.show = false;
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  }
}
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
  font-size: 28px;
  text-align: center;
  font-weight: 700;
  color: #0a3c2b;
  line-height: 1;
}

.summary-label {
  font-size: 14px;
  color: #4a7c6d;
  font-weight: 500;
}

/* Controls */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-container svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a7c6d;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #c8e6d9;
  border-radius: 10px;
  background-color: white;
  font-size: 14px;
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
}

.filter-select {
  padding: 12px;
  border: 1px solid #c8e6d9;
  border-radius: 10px;
  background-color: white;
  font-size: 14px;
  transition: all 0.2s;
  color: #0a3c2b;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  overflow: hidden;
  margin-bottom: 24px;
}

.table-wrapper {
  overflow-x: auto;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table th {
  text-align: left;
  padding: 16px 20px;
  background: #f0f9f5;
  color: #0a3c2b;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #e0f0e9;
}

.inventory-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f9f5;
}

.table-row:hover {
  background: #f7fcf9;
}

/* Column Styles */
.col-id {
  width: 80px;
}

.col-name {
  min-width: 200px;
}

.col-category {
  width: 120px;
}

.col-price {
  width: 100px;
}

.col-stock {
  min-width: 150px;
}

.col-actions {
  width: 80px;
}

/* Product Info */
.product-id {
  color: #4a7c6d;
  font-weight: 600;
  font-size: 14px;
}

.product-info .product-name {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
}

.product-info .product-description {
  color: #7aa895;
  font-size: 13px;
  line-height: 1.4;
}

/* Category Badge */
.category-badge {
  background: #e0f2ec;
  color: #0a3c2b;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Price */
.price {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 15px;
}

/* Sizes & Stock */
.sizes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.size-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #f0f9f5;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.size-item.low-stock {
  background: #fef3c7;
  color: #92400e;
}

.size-item.out-stock {
  background: #fef2f2;
  color: #991b1b;
}

.size-label {
  font-weight: 600;
}

.stock-count {
  font-weight: 700;
}

.no-sizes {
  color: #7aa895;
  font-style: italic;
  font-size: 13px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

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
}

.btn-action:hover {
  background: #f0f9f5;
  border-color: #1a7d5e;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger {
  margin-right: 25px;
  background-color: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background-color: #c53030;
}

/* Action Buttons */
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e0f0e9;
  background: white;
  color: #4a7c6d;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon.btn-danger {
  background-color: #fed7d7;
  color: #c53030;
  border-color: #fed7d7;
}

.btn-icon.btn-danger:hover {
  background-color: #e53e3e;
  color: white;
  border-color: #e53e3e;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7aa895;
}

.empty-state svg {
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #4a7c6d;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.pagination-info {
  color: #4a7c6d;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #c8e6d9;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  color: #4a7c6d;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #f0f9f5;
  border-color: #1a7d5e;
  color: #0a3c2b;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #c8e6d9;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  color: #4a7c6d;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  background-color: #f0f9f5;
  border-color: #1a7d5e;
  color: #0a3c2b;
}

.page-number.active {
  background-color: #1a7d5e;
  border-color: #1a7d5e;
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 60, 43, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px rgba(10, 60, 43, 0.15);
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
  font-size: 20px;
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
}

.modal-close:hover {
  background: #f0f9f5;
  color: #0a3c2b;
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
}

/* Modern Custom Notification */
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
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .inventory-table th,
  .inventory-table td {
    padding: 12px 16px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .summary-card {
    min-width: auto;
    flex: 1;
  }
  
  .sizes-container {
    justify-content: center;
  }
  
  .modal {
    margin: 20px;
  }
  
  .page-numbers {
    display: none;
  }
}
</style>