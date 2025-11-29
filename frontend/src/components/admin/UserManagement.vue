<template>
  <div class="user-management">
    <!-- Header -->
    <div class="header">
      <div class="title-section">
        <h1 class="title">User Management</h1>
        <p class="subtitle">Manage your team members and their account permissions</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="exportUsers">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L12 4M12 4L8 8M12 4L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 12H6C4.89543 12 4 12.8954 4 14V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14C20 12.8954 19.1046 12 18 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Export
        </button>
        <button class="btn btn-primary" @click="showAddUser = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add User
        </button>
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
          placeholder="Search users..."
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <select v-model="filterRole" class="filter-select">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
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

    <!-- User Table -->
    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th class="user-info">User</th>
            <th>Role</th>
            <th>Status</th>
            <th width="140">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td class="user-info">
              <div class="avatar">
                {{ getUserInitials(user.username) }}
              </div>
              <div class="user-details">
                <div class="username">{{ user.username }}</div>
                <div class="email">{{ user.email }}</div>
              </div>
            </td>
            <td>
              <span :class="['role-badge', user.role]">{{ user.role }}</span>
            </td>
            <td>
              <span :class="['status-badge', user.status]">
                <span class="status-dot"></span>
                {{ user.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon" @click="openEdit(user)" title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="btn-icon btn-danger" @click="openDelete(user)" title="Delete">
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
      <div v-if="paginatedUsers.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>No users found</h3>
        <p>Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="pagination-info">
        Showing {{ startIndex }}-{{ endIndex }} of {{ filteredUsers.length }} users
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

    <!-- Edit User Modal -->
    <div class="modal-overlay" v-if="showEdit" @click.self="closeEdit">
      <div class="modal">
        <div class="modal-header">
          <h2>Edit User</h2>
          <button class="modal-close" @click="closeEdit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Username</label>
            <input v-model="editForm.username" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="editForm.email" type="email" class="form-input" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Role</label>
              <select v-model="editForm.role" class="form-input">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Status</label>
              <select v-model="editForm.status" class="form-input">
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>New Password (optional)</label>
            <input v-model="editForm.password" type="password" class="form-input" placeholder="Leave blank to keep existing" />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEdit" class="btn btn-secondary">Cancel</button>
          <button @click="updateUser" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="showDelete" @click.self="closeDelete">
      <div class="modal">
        <div class="modal-header">
          <h2>Delete User</h2>
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
            <p>Are you sure you want to delete <strong>{{ deleteUserData.username }}</strong>? This action cannot be undone.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeDelete" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="btn btn-danger">Delete User</button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div class="modal-overlay" v-if="showAddUser" @click.self="showAddUser = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Add New User</h2>
          <button class="modal-close" @click="showAddUser = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Username</label>
            <input v-model="newUser.username" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="newUser.email" type="email" class="form-input" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Role</label>
              <select v-model="newUser.role" class="form-input">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Status</label>
              <select v-model="newUser.status" class="form-input">
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input v-model="newUser.password" type="password" class="form-input" />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddUser = false" class="btn btn-secondary">Cancel</button>
          <button @click="addUser" class="btn btn-primary">Add User</button>
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
  name: "UserManagement",

  data() {
    return {
      users: [],
      search: "",
      filterRole: "",
      filterStatus: "",
      currentPage: 1,
      itemsPerPage: 10,

      showEdit: false,
      showDelete: false,
      showAddUser: false,

      editForm: {
        id: null,
        username: "",
        email: "",
        role: "",
        status: "",
        password: ""
      },

      newUser: {
        username: "",
        email: "",
        role: "user",
        status: "active",
        password: ""
      },

      deleteUserData: {},

      notif: {
        show: false,
        message: "",
        type: ""
      }
    };
  },

  computed: {
    filteredUsers() {
      return this.users.filter(u => {
        const matchesSearch =
          u.username.toLowerCase().includes(this.search.toLowerCase()) ||
          u.email.toLowerCase().includes(this.search.toLowerCase());

        const matchesRole =
          this.filterRole === "" || u.role === this.filterRole;
          
        const matchesStatus =
          this.filterStatus === "" || u.status === this.filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },

    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredUsers.slice(start, start + this.itemsPerPage);
    },
    
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    
    endIndex() {
      const end = this.currentPage * this.itemsPerPage;
      return end > this.filteredUsers.length ? this.filteredUsers.length : end;
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
    filterRole() {
      this.currentPage = 1;
    },
    filterStatus() {
      this.currentPage = 1;
    },
    itemsPerPage() {
      this.currentPage = 1;
    }
  },

  mounted() {
    this.loadUsers();
  },

  methods: {
    async loadUsers() {
      try {
        const res = await axios.get("http://localhost:3000/api/users");
        this.users = res.data;
      } catch (err) {
        this.showNotif("Failed to load users", "error");
        console.error("Error loading users:", err);
      }
    },

    getUserInitials(username) {
      return username
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    openEdit(user) {
      this.editForm = { ...user, password: "" };
      this.showEdit = true;
    },

    closeEdit() {
      this.showEdit = false;
    },

    async updateUser() {
      try {
        await axios.put(
          `http://localhost:3000/api/users/${this.editForm.id}`,
          this.editForm
        );

        this.showNotif("User updated successfully!", "success");
        this.showEdit = false;
        this.loadUsers();
      } catch (err) {
        this.showNotif("Update failed!", "error");
        console.error("Error updating user:", err);
      }
    },

    openDelete(user) {
      this.deleteUserData = user;
      this.showDelete = true;
    },

    closeDelete() {
      this.showDelete = false;
    },

    async confirmDelete() {
      try {
        await axios.delete(
          `http://localhost:3000/api/users/${this.deleteUserData.id}`
        );

        this.showNotif("User deleted!", "success");
        this.showDelete = false;
        this.loadUsers();
      } catch (err) {
        this.showNotif("Delete failed!", "error");
        console.error("Error deleting user:", err);
      }
    },
    
    async addUser() {
      try {
        await axios.post(
          "http://localhost:3000/api/users",
          this.newUser
        );

        this.showNotif("User added successfully!", "success");
        this.showAddUser = false;
        this.newUser = {
          username: "",
          email: "",
          role: "user",
          status: "active",
          password: ""
        };
        this.loadUsers();
      } catch (err) {
        this.showNotif("Failed to add user!", "error");
        console.error("Error adding user:", err);
      }
    },
    
    exportUsers() {
      this.showNotif("Export functionality would be implemented here", "info");
    },

    showNotif(message, type) {
      this.notif = { show: true, message, type };
      setTimeout(() => {
        this.notif.show = false;
      }, 3000);
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
.user-management {
  padding: 24px;
  background-color: #f8fdfb;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.header-actions {
  display: flex;
  gap: 12px;
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

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid #e0f0e9;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  text-align: left;
  padding: 18px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #4a7c6d;
  background-color: #f0f9f5;
  border-bottom: 1px solid #e0f0e9;
}

.user-table td {
  padding: 18px 20px;
  border-bottom: 1px solid #f0f9f5;
}

.user-table tr:last-child td {
  border-bottom: none;
}

.user-table tr:hover {
  background-color: #f7fcf9;
}

/* User Info Column */
.user-info {
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

.user-details .username {
  font-weight: 600;
  color: #0a3c2b;
  font-size: 15px;
}

.user-details .email {
  font-size: 14px;
  color: #4a7c6d;
}

/* Badges */
.role-badge, .status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.role-badge.user {
  background-color: #e0f2ec;
  color: #0a3c2b;
}

.role-badge.admin {
  background-color: #d4edda;
  color: #155724;
}

.status-badge {
  padding: 6px 12px;
}

.status-badge.active {
  background-color: #e0f2ec;
  color: #0a3c2b;
}

.status-badge.disabled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.active .status-dot {
  background-color: #1a7d5e;
}

.status-badge.disabled .status-dot {
  background-color: #dc3545;
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
  border-color: #fed7d7;
}

.btn-icon.btn-danger:hover {
  background-color: #e53e3e;
  color: white;
  border-color: #e53e3e;
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
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #c8e6d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  color: #0a3c2b;
}

.form-input:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.form-input::placeholder {
  color: #7aa895;
}

/* Delete Modal Content */
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
  max-width: 500px;
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
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 24px;
  border-top: 1px solid #e0f0e9;
  margin-top: 20px;
}

/* Notification Styles */
.notification {
  position: fixed;
  top: 24px;
  right: 24px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 15px rgba(10, 60, 43, 0.1);
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

.notification.info {
  border-left-color: #1a7d5e;
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.notification-message {
  font-size: 14px;
  color: #0a3c2b;
  flex: 1;
  margin-right: 12px;
}

.notification-close {
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

.notification-close:hover {
  background-color: #f0f9f5;
  color: #0a3c2b;
}

/* Responsive */
@media (max-width: 768px) {
  .user-management {
    padding: 16px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>