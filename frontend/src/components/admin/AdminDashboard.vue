<template>
  <div class="admin-dashboard">

    <!-- Custom Notification -->
    <div
      class="custom-notif"
      :class="[{ show: notification.show }, notification.type]"
    >
      <i :class="notification.icon" class="notif-icon"></i>
      {{ notification.message }}
    </div>

    <!-- Header -->
    <header class="admin-header">
      <div class="header-left">
        <button class="sidebar-toggle" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
        <div class="brand">
          <i class="fas fa-shoe-prints brand-icon"></i>
          <h1>Admin Dashboard</h1>
        </div>
      </div>
      <div class="header-right">
        <div class="user-dropdown" @click="toggleUserDropdown">
          <div class="user-info">
            <div class="user-avatar">
              <i class="fas fa-user-cog"></i>
            </div>
            <div class="user-details">
              <span class="username">{{ currentUser.username }}</span>
              <span class="user-email">{{ currentUser.email }}</span>
            </div>
            <i class="fas fa-chevron-down dropdown-arrow" :class="{ rotated: userDropdownOpen }"></i>
          </div>
          <div v-if="userDropdownOpen" class="dropdown-menu">
            <div class="dropdown-item" @click="confirmLogout">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Body -->
    <div class="dashboard-body">

      <!-- Sidebar -->
      <aside :class="['sidebar', { closed: !sidebarOpen }]">
        <nav class="sidebar-nav">
          <ul class="sidebar-menu">
            <li 
              v-for="item in menuItems" 
              :key="item.id"
              @click="selectView(item.id)" 
              :class="{ active: currentView === item.id }"
            >
              <i :class="item.icon" class="menu-icon"></i>
              <transition name="slide-fade">
                <span v-if="showText" class="menu-label">{{ item.label }}</span>
              </transition>
              <div class="active-indicator"></div>
            </li>
          </ul>
        </nav>

        <div class="sidebar-footer">
          <transition name="slide-fade">
            <div v-if="showText" class="version-info">
              <span><p>© {{ new Date().getFullYear() }} Oning Flip. All rights reserved.</p></span>
            </div>
          </transition>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-header">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
          <div class="breadcrumb">
            <span>Admin</span>
            <i class="fas fa-chevron-right"></i>
            <span>{{ currentPageTitle }}</span>
          </div>
        </div>
        
        <div class="content-scrollable">
          <transition name="fade" mode="out-in">
            <component :is="currentViewComponent" :key="currentView" class="content-card" />
          </transition>
        </div>
      </main>

    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutConfirm" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <i class="fas fa-sign-out-alt modal-icon"></i>
          <h3>Confirm Logout</h3>
          <button class="modal-close" @click="showLogoutConfirm = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to logout from the admin panel?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showLogoutConfirm = false">
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button class="btn btn-danger" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import ViewInventory from './ViewInventory.vue'
import AddProduct from './AddProduct.vue'
import ManageOrders from './ManageOrders.vue'
import Categories from './Categories.vue'
import Reports from './Reports.vue'
import ModifyProducts from './ModifyProducts.vue'
import UserManagement from './UserManagement.vue'

export default {
  setup() {
    const router = useRouter();
    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      router.push('/');
    };
    return { logout };
  },
  data() {
    return {
      currentView: localStorage.getItem('currentView') || 'inventory',
      sidebarOpen: true,
      showText: true,
      isAnimating: false,
      showLogoutConfirm: false,
      showSettings: false,
      userDropdownOpen: false,
      notification: {
        show: false,
        message: '',
        type: 'success',
        icon: 'fas fa-check-circle'
      },
      currentUser: {
        username: 'Loading...',
        email: 'loading...@example.com',
        role: 'Admin'
      },
      menuItems: [
        { id: 'inventory', label: 'View Inventory', icon: 'fas fa-boxes' },
        { id: 'addProduct', label: 'Add Product', icon: 'fas fa-plus-circle' },
        { id: 'modifyProducts', label: 'Modify Products', icon: 'fas fa-edit' },
        { id: 'manageOrders', label: 'Manage Orders', icon: 'fas fa-clipboard-list' },
        { id: 'categories', label: 'Categories', icon: 'fas fa-folder' },
        { id: 'userManagement', label: 'User Management', icon: 'fas fa-users' },
        { id: 'reports', label: 'Reports', icon: 'fas fa-chart-bar' }
      ]
    }
  },
  computed: {
    currentViewComponent() {
      switch(this.currentView) {
        case 'inventory': return ViewInventory
        case 'addProduct': return AddProduct
        case 'modifyProducts': return ModifyProducts
        case 'manageOrders': return ManageOrders
        case 'categories': return Categories
        case 'userManagement': return UserManagement
        case 'reports': return Reports
        default: return ViewInventory
      }
    },
    currentPageTitle() {
      const item = this.menuItems.find(item => item.id === this.currentView);
      return item ? item.label : 'Dashboard';
    }
  },
  methods: {
    async fetchCurrentUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/');
          return;
        }

const response = await axios.get('/api/admin/current-user', {
  headers: { Authorization: `Bearer ${token}` }
});

        if (response.data && response.data.user) {
          this.currentUser = {
            username: response.data.user.username || response.data.user.name || 'Administrator',
            email: response.data.user.email || 'admin@example.com',
            role: response.data.user.role || 'Admin'
          };
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to default values
        this.currentUser = {
          username: 'Administrator',
          email: 'admin@example.com',
          role: 'Admin'
        };
        
        if (error.response?.status === 401) {
          this.showNotification('error', 'Session expired. Please login again.');
          setTimeout(() => {
            this.logout();
          }, 2000);
        }
      }
    },
    toggleSidebar() {
      if(this.isAnimating) return;
      this.isAnimating = true;
      if(this.sidebarOpen){
        this.showText = false;
        setTimeout(() => { this.sidebarOpen=false; this.isAnimating=false }, 200);
      } else {
        this.sidebarOpen = true;
        setTimeout(() => { this.showText=true; this.isAnimating=false }, 250);
      }
    },
    selectView(view) {
      this.currentView = view;
      localStorage.setItem('currentView', view);
      if(window.innerWidth < 1024) this.sidebarOpen = false;
    },
    toggleUserDropdown() {
      this.userDropdownOpen = !this.userDropdownOpen;
    },
    confirmLogout() {
      this.userDropdownOpen = false;
      this.showLogoutConfirm = true;
    },
    showNotification(type, message){
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
      };
      this.notification.type = type;
      this.notification.message = message;
      this.notification.icon = icons[type] || icons.info;
      this.notification.show = true;
      setTimeout(() => { this.notification.show = false }, 3000);
    },
    logout(){
      this.showLogoutConfirm = false;
      this.showNotification('success', 'You have logged out successfully!');
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('currentView');
        this.$router.push('/');
      }, 1000);
    }
  },
  async mounted() {
    // Add Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);

    // Fetch current user data
    await this.fetchCurrentUser();

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-dropdown')) {
        this.userDropdownOpen = false;
      }
    });
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-dashboard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f8fdfb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 32px 8px;
  background: #0a3c2b;
  border-bottom: 1px solid #1a7d5e;
  height: 78px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  font-size: 24px;
  color: #1aff99;
}

.admin-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.sidebar-toggle {
  background: rgba(26, 125, 94, 0.2);
  border: 1px solid rgba(26, 125, 94, 0.3);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1aff99;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: rgba(26, 125, 94, 0.3);
  transform: scale(1.05);
}

/* User Dropdown Styles */
.header-right {
  display: flex;
  align-items: center;
}

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
  background: rgba(26, 125, 94, 0.1);
  border: 1px solid rgba(26, 125, 94, 0.2);
}

.user-info:hover {
  background: rgba(26, 125, 94, 0.2);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1aff99;
  font-size: 16px;
  border: 2px solid rgba(26, 255, 153, 0.2);
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}

.user-email {
  color: #7aa895;
  font-size: 12px;
  line-height: 1.2;
  margin-top: 2px;
}

.dropdown-arrow {
  color: #7aa895;
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
  box-shadow: 0 8px 25px rgba(10, 60, 43, 0.15);
  border: 1px solid #e0f0e9;
  min-width: 180px;
  z-index: 1001;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #0a3c2b;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f0f9f5;
  color: #1a7d5e;
}

.dropdown-item i {
  width: 16px;
  text-align: center;
  color: #4a7c6d;
}

/* Notification Styles */
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.custom-notif.show {
  top: 90px;
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

.notif-icon {
  font-size: 16px;
}

/* Dashboard Body */
.dashboard-body {
  display: flex;
  margin-top: 70px; /* Account for fixed header */
  height: calc(100vh - 70px);
  overflow: hidden;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: #0a3c2b;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid #1a7d5e;
  position: fixed;
  top: 70px;
  left: 0;
  bottom: 0;
  height: calc(100vh - 70px);
  overflow-y: auto;
  z-index: 999;
}

.sidebar.closed {
  width: 80px;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  position: relative;
  display: flex;
  align-items: center;
  padding: 14px 20px 14px 16px; /* Adjusted left padding to center icons */
  margin: 4px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #c8e6d9;
}

.sidebar-menu li:hover {
  background: rgba(26, 125, 94, 0.2);
  color: #ffffff;
  transform: translateX(4px);
}

.sidebar-menu li.active {
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(26, 125, 94, 0.3);
}

.active-indicator {
  position: absolute;
  left: -12px;
  width: 4px;
  height: 24px;
  background: #1aff99;
  border-radius: 0 4px 4px 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-menu li.active .active-indicator {
  opacity: 1;
}

.menu-icon {
  font-size: 18px;
  min-width: 24px; /* Centered width */
  text-align: center;
  transition: transform 0.3s ease;
  margin-right: 16px;
}

.sidebar-menu li:hover .menu-icon {
  transform: scale(1.1);
}

.menu-label {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(26, 125, 94, 0.3);
}

.version-info {
  text-align: center;
  color: #7aa895;
  font-size: 12px;
  font-weight: 500;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 280px; /* Account for sidebar width */
  transition: margin-left 0.3s ease;
  background: #f8fdfb;
  height: calc(100vh - 70px);
  overflow: hidden;
}

.sidebar.closed ~ .main-content {
  margin-left: 80px;
}

.content-header {
  padding: 24px 32px 0;
  background: #f8fdfb;
  position: sticky;
  top: 0;
  z-index: 99;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0a3c2b;
  margin-bottom: 8px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a7c6d;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
}

.breadcrumb i {
  font-size: 12px;
  opacity: 0.6;
}

.content-scrollable {
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 32px;
}

.content-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
  overflow: auto;
  min-height: 400px;
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
  z-index: 10000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px rgba(10, 60, 43, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 0;
  margin-bottom: 20px;
}

.modal-icon {
  font-size: 24px;
  color: #1a7d5e;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #0a3c2b;
  flex: 1;
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
}

.modal-body {
  padding: 0 24px;
}

.modal-body p {
  margin: 0;
  color: #4a7c6d;
  line-height: 1.6;
  font-size: 15px;
}

input:checked + .toggle-slider {
  background-color: #1a7d5e;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e0f0e9;
  margin-top: 20px;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
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

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(0);
  }
  
  .sidebar.closed {
    transform: translateX(-100%);
  }
  
  .main-content {
    margin-left: 0 !important;
  }
}

@media (max-width: 768px) {
  .admin-header {
    padding: 0 20px;
  }
  
  .content-header {
    padding: 20px 20px 0;
  }
  
  .content-scrollable {
    padding: 0 20px 20px;
  }
  
  .content-card {
    border-radius: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .modal {
    margin: 20px;
  }
  
  .user-details {
    display: none;
  }
  
  .user-info {
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .admin-header h1 {
    font-size: 20px;
  }
  
  .brand-icon {
    font-size: 20px;
  }
  
  .custom-notif {
    min-width: calc(100% - 40px);
    margin: 0 20px;
  }
  
  .sidebar {
    width: 260px;
  }
  
  .sidebar.closed {
    width: 70px;
  }
}
</style>  