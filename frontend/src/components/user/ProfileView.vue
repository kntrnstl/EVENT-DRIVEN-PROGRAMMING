<template>
  <div class="profile-view">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">My Profile</h1>
          <p class="page-subtitle">Manage your account information and preferences</p>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <div class="profile-card">
        <!-- Profile Information -->
        <div class="profile-section">
          <div class="section-header">
            <i class="fas fa-user-circle section-icon"></i>
            <h3>Personal Information</h3>
          </div>
          
          <div class="profile-info">
            <div class="info-item">
              <label>Username</label>
              <div class="info-value">{{ user.username }}</div>
            </div>
            <div class="info-item">
              <label>Email Address</label>
              <div class="info-value">{{ user.email }}</div>
            </div>
            <div class="info-item">
              <label>Account Type</label>
              <div class="info-value">{{ user.role || 'Customer' }}</div>
            </div>
          </div>

          <button class="btn btn-primary" @click="openEditModal">
            <i class="fas fa-edit"></i>
            Edit Profile
          </button>
        </div>

        <!-- Account Security -->
        <div class="profile-section">
          <div class="section-header">
            <i class="fas fa-shield-alt section-icon"></i>
            <h3>Account Security</h3>
          </div>
          
          <div class="security-info">
            <div class="security-item">
              <i class="fas fa-key security-icon"></i>
              <div class="security-content">
                <h4>Password</h4>
                <p>Last changed: {{ lastPasswordChange }}</p>
              </div>
            </div>
          </div>

          <button class="btn btn-secondary" @click="openEditModal">
            <i class="fas fa-lock"></i>
            Change Password
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal profile-modal">
        <div class="modal-header">
          <i class="fas fa-user-edit modal-icon"></i>
          <h3>Edit Profile</h3>
          <button class="modal-close" @click="closeEditModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="updateProfile" class="profile-form">
            <!-- Username Field -->
            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                v-model="profileForm.username"
                type="text"
                placeholder="Enter your username"
                class="form-input"
                :class="{ 'changed': profileForm.originalUsername !== profileForm.username }"
              >
              <div v-if="profileForm.originalUsername !== profileForm.username" class="change-indicator">
                <i class="fas fa-pencil-alt"></i> Changed
              </div>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                placeholder="Enter your email"
                class="form-input"
                :class="{ 'changed': profileForm.originalEmail !== profileForm.email }"
              >
              <div v-if="profileForm.originalEmail !== profileForm.email" class="change-indicator">
                <i class="fas fa-pencil-alt"></i> Changed
              </div>
            </div>

            <!-- Current Password -->
            <div class="form-group">
              <label for="currentPassword">Current Password <span class="required">*</span></label>
              <input
                id="currentPassword"
                v-model="profileForm.currentPassword"
                type="password"
                placeholder="Enter current password"
                class="form-input"
                required
              >
              <div class="field-info">Required for any changes</div>
            </div>

            <!-- New Password -->
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                id="newPassword"
                v-model="profileForm.newPassword"
                type="password"
                placeholder="Enter new password (leave empty if unchanged)"
                class="form-input"
                :class="{ 'changed': profileForm.newPassword }"
              >
              <div v-if="profileForm.newPassword" class="change-indicator">
                <i class="fas fa-pencil-alt"></i> New password set
              </div>
              <div class="field-info">Minimum 6 characters</div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                v-model="profileForm.confirmPassword"
                type="password"
                placeholder="Confirm new password"
                class="form-input"
                :class="{ 'error': profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword }"
              >
              <div v-if="profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword" class="error-message">
                <i class="fas fa-exclamation-circle"></i> Passwords do not match
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeEditModal" :disabled="isUpdating">
                <i class="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!canSave || isUpdating"
                :class="{ 'loading': isUpdating }"
              >
                <i class="fas fa-save"></i>
                {{ isUpdating ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      username: '',
      email: '',
      role: 'customer'
    })
  }
});

// Emits
const emit = defineEmits(['profile-updated']);

// State
const showEditModal = ref(false);
const isUpdating = ref(false);

// Profile form data
const profileForm = ref({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  originalUsername: '',
  originalEmail: ''
});

// Computed properties
const canSave = computed(() => {
  const hasChanges = 
    profileForm.value.username !== profileForm.value.originalUsername ||
    profileForm.value.email !== profileForm.value.originalEmail ||
    profileForm.value.newPassword;
  
  const passwordsMatch = !profileForm.value.newPassword || 
    profileForm.value.newPassword === profileForm.value.confirmPassword;
  
  const hasCurrentPassword = profileForm.value.currentPassword.length > 0;
  const isValidPassword = !profileForm.value.newPassword || profileForm.value.newPassword.length >= 6;
  
  return hasChanges && passwordsMatch && hasCurrentPassword && isValidPassword;
});

const lastPasswordChange = computed(() => {
  return 'Recently'; // This would come from backend in a real app
});

// Methods
const openEditModal = () => {
  // Initialize form with current user data
  profileForm.value = {
    username: props.user.username,
    email: props.user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    originalUsername: props.user.username,
    originalEmail: props.user.email
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  profileForm.value = {
    username: props.user.username,
    email: props.user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    originalUsername: props.user.username,
    originalEmail: props.user.email
  };
};

const updateProfile = async () => {
  if (!canSave.value || isUpdating.value) return;

  isUpdating.value = true;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to update profile');
    }

    const updateData = {
      currentPassword: profileForm.value.currentPassword
    };

    // Only include fields that have changed
    if (profileForm.value.username !== profileForm.value.originalUsername) {
      updateData.username = profileForm.value.username;
    }

    if (profileForm.value.email !== profileForm.value.originalEmail) {
      updateData.email = profileForm.value.email;
    }

    if (profileForm.value.newPassword) {
      updateData.newPassword = profileForm.value.newPassword;
    }

    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    // Handle response
    let result;
    try {
      const responseText = await response.text();
      result = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid server response');
    }

    if (response.ok) {
      // Emit the updated user data
      emit('profile-updated', {
        username: profileForm.value.username,
        email: profileForm.value.email
      });
      
      closeEditModal();
    } else {
      throw new Error(result.message || `Failed to update profile: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert(error.message || 'Error updating profile');
  } finally {
    isUpdating.value = false;
  }
};

// Lifecycle
onMounted(() => {
  console.log('ProfileView mounted with user:', props.user);
});
</script>

<style scoped>
.profile-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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

/* Profile Content */
.profile-content {
  display: grid;
  gap: 24px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 10px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
}

.profile-section {
  margin-bottom: 40px;
}

.profile-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f9f5;
}

.section-icon {
  font-size: 24px;
  color: #1a7d5e;
  width: 40px;
  text-align: center;
}

.section-header h3 {
  color: #0a3c2b;
  font-weight: 600;
  font-size: 20px;
  margin: 0;
}

/* Profile Info */
.profile-info {
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fdfb;
  border-radius: 8px;
  border: 1px solid #e0f0e9;
}

.info-item label {
  font-weight: 600;
  color: #4a7c6d;
  font-size: 14px;
}

.info-value {
  color: #0a3c2b;
  font-weight: 500;
  font-size: 15px;
}

/* Security Info */
.security-info {
  margin-bottom: 24px;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fdfb;
  border-radius: 8px;
  border: 1px solid #e0f0e9;
}

.security-icon {
  font-size: 20px;
  color: #1a7d5e;
  width: 40px;
  text-align: center;
}

.security-content h4 {
  color: #0a3c2b;
  font-weight: 600;
  margin: 0 0 4px 0;
  font-size: 15px;
}

.security-content p {
  color: #4a7c6d;
  margin: 0;
  font-size: 13px;
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
  transition: all 0.3s ease;
  text-decoration: none;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}

.profile-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  animation: modal-pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-pop-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
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
  color: #071815;
  flex: 1;
}

.modal-close {
  background: none;
  border: none;
  color: #99aab5;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f0f4f7;
  color: #071815;
}

.modal-body {
  padding: 0 24px 24px;
}

/* Form Styles */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #34495e;
  font-size: 14px;
}

.required {
  color: #e53e3e;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 3px rgba(26, 125, 94, 0.1);
}

.form-input.changed {
  border-color: #1a7d5e;
  background: #f8fdfb;
}

.form-input.error {
  border-color: #e53e3e;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #1a7d5e;
  font-weight: 500;
}

.change-indicator i {
  font-size: 10px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #e53e3e;
  font-weight: 500;
}

.field-info {
  font-size: 12px;
  color: #7aa895;
  font-style: italic;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn.loading {
  position: relative;
  color: transparent;
}

.btn.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-view {
    padding: 16px;
  }
  
  .profile-card {
    padding: 24px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .profile-modal {
    max-width: 95vw;
  }
}

@media (max-width: 480px) {
  .title-section .page-title {
    font-size: 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
  }
  
  .security-icon {
    align-self: center;
  }
}
</style>