<template>
  <div class="product-management">
    <!-- Header -->
    <div class="header">
      <div class="title-section">
        <h1 class="title">Manage Products</h1>
        <p class="subtitle">Edit and manage your product catalog</p>
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
        />
      </div>

      <div class="filter-group">
        <select v-model.number="filterCategory" class="filter-select">
  <option value="">All Categories</option>
  <option v-for="category in categories" :key="category.id" :value="category.id">
    {{ category.name }}
  </option>
</select>

        
        <select v-model="filterStock" class="filter-select">
          <option value="">All Stock Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>
    </div>

    <!-- Products Table -->
    <div class="table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th class="product-info">Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Sizes & Stock</th>
            <th>Overall Status</th>
            <th width="140">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.product_id">
            <td class="product-info">
              <div class="avatar">
                {{ getProductInitials(product.name) }}
              </div>
              <div class="product-details">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-description">{{ product.description || 'No description' }}</div>
              </div>
            </td>
            <td>
              <span :class="['category-badge', product.category?.toLowerCase()]">
                {{ product.category || "No Category" }}
              </span>
            </td>
            <td class="price-col">
              <span class="price">₱{{ parseFloat(product.price).toFixed(2) }}</span>
            </td>
            <td class="sizes-col">
              <div class="sizes-display">
                <div 
                  v-for="size in product.sizes" 
                  :key="size.id" 
                  class="size-with-status"
                >
                  <span class="size-tag">{{ size.size }}</span>
                  <span :class="['size-stock-badge', getSizeStockStatus(size)]">
                    {{ size.stock }}
                  </span>
                </div>
                <span v-if="!product.sizes || product.sizes.length === 0" class="no-sizes">
                  No sizes
                </span>
              </div>
            </td>
            <td>
              <span :class="['stock-badge', getProductStockStatus(product)]">
                <span class="stock-dot"></span>
                {{ getProductStockStatusText(product) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon" @click="openEdit(product)" title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
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
      <div v-if="paginatedProducts.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter to find what you're looking for.</p>
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
          :disabled="page===1" 
          @click="page--"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Previous
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="n in visiblePages" 
            :key="n"
            :class="['page-number', { active: n === page }]"
            @click="page = n"
          >
            {{ n }}
          </button>
        </div>
        
        <button 
          class="btn-pagination" 
          :disabled="page===totalPages" 
          @click="page++"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div class="modal-overlay" v-if="showEdit" @click.self="closeEdit">
      <div class="modal">
        <div class="modal-header">
          <h2>Edit Product</h2>
          <button class="modal-close" @click="closeEdit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Product Name</label>
            <input v-model="editForm.name" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="editForm.description" class="form-input" rows="3"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Price</label>
              <div class="input-with-prefix">
                <span class="prefix">₱</span>
                <input type="number" v-model="editForm.price" class="form-input price-input" placeholder="0.00" min="1" />
              </div>
            </div>
            
            <div class="form-group">
              <label>Category</label>
              <select v-model="editForm.category_id" class="category-select">
                <option disabled value="">Select category</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Sizes & Stock</label>
            <div class="sizes-section">
              <div v-for="s in editForm.sizes" :key="s.id" class="size-item">
                <div class="size-info">
                  <span class="size-name">{{ s.size }}</span>
                  <input type="number" v-model="s.stock" class="stock-input" min="1"/>
                  <div class="size-actions">
                    <button class="btn-check" @click="updateSizeStock(s)" title="Update Stock">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="btn-remove" @click="prepareDeleteSize(s)" title="Delete Size">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="add-size-form">
                <div class="form-row compact">
                  <div class="form-group">
                    <input placeholder="Size" v-model="newSize.size" class="new-size" />
                  </div>
                  <div class="form-group">
                    <input placeholder="Stock" type="number" v-model="newSize.stock" class="new-stock" min="1" />
                  </div>
                  <div class="form-group">
                    <button class="btn-add-size" @click="addSize">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Add Size
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEdit" class="btn btn-secondary">Cancel</button>
          <button @click="updateProduct" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="confirmDelete.show" @click.self="closeDelete">
      <div class="modal">
        <div class="modal-header">
          <h2>Delete Product</h2>
          <button class="modal-close" @click="closeDelete">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-content">
            <div class="delete-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p>Are you sure you want to delete <strong>{{ confirmDelete.name }}</strong>? This action cannot be undone.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeDelete" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDeleteProduct" class="btn btn-danger">Delete Product</button>
        </div>
      </div>
    </div>

    <!-- Size Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="sizeConfirmDelete.show" @click.self="cancelDeleteSize">
      <div class="modal">
        <div class="modal-header">
          <h2>Delete Size</h2>
          <button class="modal-close" @click="cancelDeleteSize">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-content">
            <div class="delete-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p>Are you sure you want to delete size <strong>{{ sizeConfirmDelete.sizeName }}</strong>?</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="cancelDeleteSize" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDeleteSize" class="btn btn-danger">Delete Size</button>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div :class="['notification', notif.type, { show: notif.show }]">
      <div class="notification-content">
        <span class="notification-message">{{ notif.message }}</span>
        <button class="notification-close" @click="notif.show = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductManagement",
  data() {
    return {
      search: '',
      filterCategory: '',
      filterStock: '',
      page: 1,
      pageSize: 10,
      showEdit: false,
      showAddProduct: false,
      
      products: [],
      categories: [],
      
      editForm: {
        product_id: null,
        name: '',
        description: '',
        price: '',
        category_id: '',
        sizes: []
      },
      
      newSize: {
        size: '',
        stock: 0
      },
      
      confirmDelete: {
        show: false,
        id: null,
        name: ''
      },
      
      sizeConfirmDelete: {
        show: false,
        id: null,
        sizeName: ''
      },
      
      notif: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  
  computed: {
    filteredProducts() {
      let filtered = this.products;
      
      // Search filter
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower)
        );
      }
      
// Category filter
if (this.filterCategory) {
  filtered = filtered.filter(product => 
    product.category_id == Number(this.filterCategory)
  );
}

      
      // Stock filter
      if (this.filterStock) {
        filtered = filtered.filter(product => {
          const status = this.getProductStockStatus(product);
          return status === this.filterStock;
        });
      }
      
      return filtered;
    },
    
    paginatedProducts() {
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredProducts.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize);
    },
    
    startIndex() {
      return (this.page - 1) * this.pageSize + 1;
    },
    
    endIndex() {
      const end = this.page * this.pageSize;
      return end > this.filteredProducts.length ? this.filteredProducts.length : end;
    },
    
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      let start = Math.max(1, this.page - 2);
      let end = Math.min(total, start + 4);
      
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  
  methods: {
    getProductInitials(name) {
      return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    },
    
    getSizeStockStatus(size) {
      const stock = parseInt(size.stock) || 0;
      if (stock === 0) return 'out-of-stock';
      if (stock < 10) return 'low-stock';
      return 'in-stock';
    },
    
    getProductStockStatus(product) {
      const totalStock = product.sizes?.reduce((sum, size) => sum + (parseInt(size.stock) || 0), 0) || 0;
      if (totalStock === 0) return 'out-of-stock';
      if (totalStock < 10) return 'low-stock';
      return 'in-stock';
    },
    
    getProductStockStatusText(product) {
      const status = this.getProductStockStatus(product);
      switch (status) {
        case 'in-stock': return 'In Stock';
        case 'low-stock': return 'Low Stock';
        case 'out-of-stock': return 'Out of Stock';
        default: return 'Unknown';
      }
    },
    
    showNotification(type, message) {
      this.notif.type = type;
      this.notif.message = message;
      this.notif.show = true;
      setTimeout(() => (this.notif.show = false), 3000);
    },

    async fetchProducts() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/products", { headers: { Authorization: `Bearer ${token}` } });
        this.products = res.data;
      } catch (err) {
        console.error(err);
        this.showNotification("error", "Failed to fetch products");
      }
    },
    
    async fetchCategories() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } });
        this.categories = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    
    openEdit(product) {
      this.editForm = JSON.parse(JSON.stringify(product));
      this.editForm.product_id = product.product_id;
      this.showEdit = true;
    },

    closeEdit() {
      this.showEdit = false;
      this.newSize = { size: "", stock: "" };
    },

    async updateProduct() {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`/api/admin/products/${this.editForm.product_id}`, this.editForm, { headers: { Authorization: `Bearer ${token}` } });
        this.fetchProducts();
        this.closeEdit();
        this.showNotification("success", "Product updated successfully");
      } catch (err) {
        console.error(err);
        this.showNotification("error", "Failed to update product");
      }
    },

    prepareDelete(id, name) {
      this.confirmDelete.id = id;
      this.confirmDelete.name = name;
      this.confirmDelete.show = true;
    },

    closeDelete() {
      this.confirmDelete.show = false;
    },

    async confirmDeleteProduct() {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/products/${this.confirmDelete.id}`, { headers: { Authorization: `Bearer ${token}` } });
        this.showNotification("success", "Product deleted successfully");
        this.fetchProducts();
      } catch (err) {
        console.error(err);
        this.showNotification("error", "Failed to delete product");
      } finally {
        this.closeDelete();
      }
    },

    prepareDeleteSize(size) {
      this.sizeConfirmDelete.id = size.id;
      this.sizeConfirmDelete.sizeName = size.size;
      this.sizeConfirmDelete.show = true;
    },

    cancelDeleteSize() {
      this.sizeConfirmDelete.show = false;
    },

    async confirmDeleteSize() {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/products/sizes/${this.sizeConfirmDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.editForm.sizes = this.editForm.sizes.filter(
          (s) => s.id !== this.sizeConfirmDelete.id
        );

        this.showNotification("success", "Size removed!");
      } catch (err) {
        console.error(err);
        this.showNotification("error", "Failed to remove size");
      } finally {
        this.cancelDeleteSize();
      }
    },

    async updateSizeStock(size) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`/api/admin/products/sizes/${size.id}`, { stock: size.stock }, { headers: { Authorization: `Bearer ${token}` } });
        this.showNotification("success", "Stock updated!");
        this.fetchProducts();
      } catch (err) {
        console.error(err);
        this.showNotification("error", "Failed to update stock");
      }
    },

    async addSize() {
      if (!this.newSize.size || !this.newSize.stock) {
        this.showNotification("error", "Enter size and stock");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `/api/admin/products/${this.editForm.product_id}/sizes`,
          this.newSize,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.editForm.sizes.push(res.data);
        this.newSize = { size: "", stock: "" };
        this.showNotification("success", "Size added!");
      } catch (err) {
        console.error(err);
        this.showNotification("error", "Failed to add size");
      }
    },
  },
  
  mounted() {
    this.fetchProducts();
    this.fetchCategories();
  },
};
</script>

<style scoped>
.product-management {
  padding: 24px;
  background-color: #f8fdfb;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.header {
  margin-bottom: 32px;
}

.title-section .title {
  font-size: 28px;
  font-weight: 700;
  color: #0a3c2b;
  margin: 0 0 8px 0;
}

.title-section .subtitle {
  color: #4a7c6d;
  margin: 0;
  font-size: 16px;
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
}

.filter-select:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid #e0f0e9;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th {
  text-align: left;
  padding: 18px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #4a7c6d;
  background-color: #f0f9f5;
  border-bottom: 1px solid #e0f0e9;
}

.product-table td {
  padding: 18px 20px;
  border-bottom: 1px solid #f0f9f5;
}

.product-table tr:last-child td {
  border-bottom: none;
}

.product-table tr:hover {
  background-color: #f7fcf9;
}

/* Product Info Column */
.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a7d5e 0%, #0a3c2b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.product-details .product-name {
  font-weight: 600;
  color: #0a3c2b;
  font-size: 15px;
}

.product-details .product-description {
  font-size: 14px;
  color: #4a7c6d;
}

/* Badges */
.category-badge, .stock-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.category-badge {
  background-color: #e0f2ec;
  color: #0a3c2b;
}

.stock-badge.in-stock {
  background-color: #e0f2ec;
  color: #0a3c2b;
}

.stock-badge.low-stock {
  background-color: #fef3c7;
  color: #92400e;
}

.stock-badge.out-of-stock {
  background-color: #f8d7da;
  color: #721c24;
}

.stock-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.stock-badge.in-stock .stock-dot {
  background-color: #1a7d5e;
}

.stock-badge.low-stock .stock-dot {
  background-color: #f59e0b;
}

.stock-badge.out-of-stock .stock-dot {
  background-color: #dc3545;
}

/* Sizes & Stock Column */
.sizes-col {
  width: 180px;
}

.sizes-display {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.size-with-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-tag {
  background: #f0f9f5;
  color: #0a3c2b;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #c8e6d9;
  min-width: 30px;
  text-align: center;
}

.size-stock-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  min-width: 40px;
}

.size-stock-badge.in-stock {
  background-color: #e0f2ec;
  color: #0a3c2b;
}

.size-stock-badge.low-stock {
  background-color: #fef3c7;
  color: #92400e;
}

.size-stock-badge.out-of-stock {
  background-color: #f8d7da;
  color: #721c24;
}

.no-sizes {
  color: #7aa895;
  font-style: italic;
  font-size: 12px;
}

.price-col {
  width: 100px;
}

.price {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 15px;
}

/* Price Input */
.input-with-prefix {
  position: relative;
}

.input-with-prefix .prefix {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #1a7d5e;
  font-weight: 600;
  pointer-events: none;
  z-index: 1;
}

.input-with-prefix .price-input {
  padding-left: 32px; /* Add sufficient padding for the peso sign */
  width: 100%;
}

/* Ensure the input has proper styling */
.price-input {
  width: 100%;
  padding: 10px 12px 10px 32px; /* Left padding to accommodate the peso sign */
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  color: #0a3c2b;
  background: white;
  box-sizing: border-box;
}

.price-input:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.price-input::placeholder {
  color: #7aa895;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

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

.btn-icon:hover {
  background-color: #f0f9f5;
  color: #0a3c2b;
  border-color: #1a7d5e;
}

.btn-icon.btn-danger {
  background-color: #fed7d7;
  color: #c53030;
}

.btn-icon.btn-danger:hover {
  color: white;
  border-color: #fed7d7;
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

.btn-primary {
  background-color: #1a7d5e;
  color: white;
}

.btn-primary:hover {
  background-color: #0a3c2b;
}

.btn-secondary {
  background-color: #f0f9f5;
  color: #1a7d5e;
  border: 1px solid #c8e6d9;
}

.btn-secondary:hover {
  background-color: #e0f0e9;
}

.btn-danger {
  background-color: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background-color: #c53030;
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #7aa895;
}

.empty-state svg {
  color: #c8e6d9;
}

.empty-state h3 {
  margin: 16px 0 8px;
  color: #4a7c6d;
}

.empty-state p {
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
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

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row.compact {
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #0a3c2b;
  font-size: 14px;
}

.form-input {
  width: 95%;
  padding: 10px 12px;
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  color: #0a3c2b;
  background: white;
}

.new-size{
  width: 90%;
  padding: 10px 12px;
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  color: #0a3c2b;
  background: white; 
}

.new-stock{
  width: 95%;
  padding: 10px 12px;
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  color: #0a3c2b;
  background: white;
}

.price-input{
  width: 95%;
  padding: 10px 12px;
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  color: #0a3c2b;
  background: white;
}

.category-select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  color: #0a3c2b;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.form-input::placeholder {
  color: #7aa895;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.input-with-prefix {
  position: relative;
}

.input-with-prefix .prefix {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #1a7d5e;
  font-weight: 600;
  pointer-events: none;
}

.input-with-prefix .form-input {
  padding-left: 28px;
}

/* Sizes Section */
.sizes-section {
  background: #f8fdfb;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0f0e9;
}

.size-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #e0f0e9;
}

.size-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.size-name {
  font-weight: 600;
  color: #0a3c2b;
  min-width: 40px;
}

.stock-input {
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #c8e6d9;
  border-radius: 6px;
  text-align: center;
}

.size-actions {
  display: flex;
  gap: 8px;
}

.btn-check,
.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-check {
  background: #1a7d5e;
  color: white;
}

.btn-check:hover {
  background: #0a3c2b;
}

.btn-remove {
  background: #fef2f2;
  color: #e53e3e;
}

.btn-remove:hover {
  background: #e53e3e;
  color: white;
}

.add-size-form {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0f0e9;
}

.btn-add-size {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 10px;
  padding: 10px 10px;
  background: #1a7d5e;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.btn-add-size:hover {
  background: #0a3c2b;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 60, 43, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
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

.modal-header h2 {
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
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f0f9f5;
  color: #0a3c2b;
}

.modal-body {
  padding: 0 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px 24px;
  border-top: 1px solid #e0f0e9;
  margin-top: 8px;
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(10, 60, 43, 0.15);
  border-left: 4px solid #1a7d5e;
  transform: translateX(400px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1100;
  max-width: 400px;
}

.notification.show {
  transform: translateX(0);
  opacity: 1;
}

.notification.success {
  border-left-color: #1a7d5e;
}

.notification.error {
  border-left-color: #e53e3e;
}

.notification.warning {
  border-left-color: #f59e0b;
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.notification-message {
  color: #0a3c2b;
  font-size: 14px;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  color: #7aa895;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

.notification-close:hover {
  background-color: #f0f9f5;
  color: #0a3c2b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-management {
    padding: 16px;
  }
  
  .header {
    flex-direction: column;
    gap: 16px;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    max-width: none;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .pagination-controls {
    justify-content: center;
  }
  
  .modal {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-row .form-group {
    margin-bottom: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .btn-icon {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .product-table {
    font-size: 14px;
  }
  
  .product-table th,
  .product-table td {
    padding: 12px 8px;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .avatar {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }
  
  .page-numbers {
    display: none;
  }
}
</style>