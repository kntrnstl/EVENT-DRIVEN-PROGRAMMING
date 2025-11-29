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
          <h3>Delete Category</h3>
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
          <button @click="confirmDeleteCategory" class="btn btn-danger">Delete Category</button>
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Category Management</h1>
          <p class="page-subtitle">Organize your products with categories</p>
        </div>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="summary-value">{{ categories.length }}</span>
              <span class="summary-label">Total Categories</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Category Section -->
    <div class="table-container">
      <div class="table-header">
        <h3>Categories</h3>
      </div>
      
      <div class="add-section">
        <div class="add-input-group">
          <input 
            v-model="newCategory"
            type="text"
            placeholder="Enter new category name"
            class="add-input"
            @keyup.enter="addCategory"
          />
          <button class="btn btn-primary" @click="addCategory">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Add Category
          </button>
        </div>
      </div>

      <!-- Categories List -->
      <div class="categories-list">
        <div v-if="categories.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>No categories found</h3>
          <p>Get started by adding your first category</p>
        </div>

        <div 
          class="category-item"
          v-for="cat in categories"
          :key="cat.id"
        >
          <div class="category-content">
            <input 
              v-model="cat.name"
              @blur="updateCategory(cat)"
              class="category-input"
              placeholder="Category name"
            />
          </div>
          <div class="category-actions">
            <button class="btn-icon btn-danger" @click="prepareDelete(product.product_id, product.name)" title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [],
      newCategory: "",
      notification: {
        show: false,
        type: "",
        message: ""
      },
      confirmDelete: {
        show: false,
        id: null,
        name: ""
      }
    };
  },
  created() {
    this.fetchCategories();
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

    async fetchCategories() {
      try {
        const res = await axios.get("/api/admin/categories", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        this.categories = res.data;
      } catch (err) {
        this.showNotification('error', "Failed to load categories");
      }
    },

    async addCategory() {
      if (!this.newCategory.trim()) {
        this.showNotification('error', "Category name cannot be empty");
        return;
      }

      try {
        await axios.post(
          "/api/admin/categories",
          { name: this.newCategory },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );

        this.showNotification('success', "Category added successfully");
        this.newCategory = "";
        this.fetchCategories();
      } catch (err) {
        this.showNotification('error', "Failed to add category");
      }
    },

    async updateCategory(cat) {
      if (!cat.name.trim()) {
        this.showNotification('error', "Category cannot be empty");
        this.fetchCategories(); 
        return;
      }

      try {
        await axios.put(
          `/api/admin/categories/${cat.id}`,
          { name: cat.name },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );

        this.showNotification('success', "Category updated successfully");
      } catch (err) {
        this.showNotification('error', "Failed to update category");
      }
    },

    prepareDelete(id, name) {
      this.confirmDelete.id = id;
      this.confirmDelete.name = name;
      this.confirmDelete.show = true;
    },

    async confirmDeleteCategory() {
      try {
        await axios.delete(`/api/admin/categories/${this.confirmDelete.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        this.showNotification('success', "Category deleted successfully");
        this.fetchCategories();
      } catch {
        this.showNotification('error', "Failed to delete category");
      } finally {
        this.confirmDelete.show = false;
      }
    },

    cancelDelete() {
      this.confirmDelete.show = false;
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

/* Add Section */
.add-section {
  padding: 0 24px 24px;
  border-bottom: 1px solid #e0f0e9;
}

.add-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.add-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #c8e6d9;
  border-radius: 10px;
  background: #f8fdfb;
  color: #0a3c2b;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.add-input:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.add-input::placeholder {
  color: #7aa895;
}

/* Categories List */
.categories-list {
  padding: 0;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f9f5;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: #f7fcf9;
}

.category-item:last-child {
  border-bottom: none;
}

.category-content {
  flex: 1;
}

.category-input {
  width: 98%;
  padding: 8px 12px;
  border: 1px solid #e0f0e9;
  border-radius: 8px;
  background: #f8fdfb;
  color: #0a3c2b;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
}

.category-input:focus {
  border-color: #1a7d5e;
  box-shadow: 0 0 0 2px rgba(26, 125, 94, 0.1);
  background: white;
}

.category-actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
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

.btn-primary {
  background: #1a7d5e;
  color: white;
}

.btn-primary:hover {
  background: #0a3c2b;
}

.btn-secondary {
  background: #f0f9f5;
  color: #1a7d5e;
  border: 1px solid #c8e6d9;
}

.btn-secondary:hover {
  background: #e0f0e9;
}

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background: #c53030;
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
  
  .add-input-group {
    flex-direction: column;
  }
  
  .add-input,
  .btn {
    width: 100%;
  }
  
  .category-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .category-actions {
    margin-left: 0;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .summary-card {
    min-width: auto;
    flex: 1;
  }
  
  .modal {
    margin: 20px;
  }
}
</style>