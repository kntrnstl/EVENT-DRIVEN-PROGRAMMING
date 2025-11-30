<template>
  <div class="contact-view">
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

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Get in Touch <span class="accent-text">24/7</span></h1>
          <p class="page-subtitle">Have a question or feedback? Our dedicated team is ready to assist you</p>
        </div>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="summary-value">24/7</span>
              <span class="summary-label">Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="contact-content">
      <!-- Contact Form -->
      <div class="form-section">
        <div class="form-header">
          <h3>Send us a Message</h3>
          <p>Fill out the form below and we'll get back to you within 24 hours</p>
        </div>

        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Your Name</label>
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  v-model="name" 
                  type="text" 
                  placeholder="Enter your full name" 
                  required 
                  class="modern-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  v-model="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  required 
                  class="modern-input"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Your Message</label>
            <div class="input-container">
              <div class="input-icon textarea-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <textarea 
                v-model="message" 
                placeholder="Tell us how we can help you..." 
                required 
                class="modern-textarea"
                rows="6"
              ></textarea>
            </div>
            <div class="char-count">{{ message.length }}/500</div>
          </div>

          <button type="submit" class="submit-btn" :class="{ loading: isLoading }">
            <span v-if="!isLoading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Send Message
            </span>
            <span v-else class="loading-text">
              <div class="spinner"></div>
              Sending...
            </span>
          </button>
        </form>
      </div>

      <!-- Contact Info -->
      <div class="info-section">
        <div class="info-card">
          <h4>Other Ways to Reach Us</h4>
          
          <div class="contact-method">
            <div class="method-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="method-content">
              <h5>Visit Our Store</h5>
              <p>8c Greenville Dr, Novaliches, Quezon City, 1116 Metro Manila</p>
            </div>
          </div>

          <div class="contact-method">
            <div class="method-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="method-content">
              <h5>Call Us</h5>
              <p>0966 782 6874<br>Mon-Sat, 9AM-6PM</p>
            </div>
          </div>

          <div class="contact-method">
            <div class="method-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="method-content">
              <h5>Email Us</h5>
              <p class="email-link">oningflip@gmail.com</p>
            </div>
          </div>

          <div class="response-time">
            <div class="time-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Average response: 2 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      message: '',
      isLoading: false,
      notification: {
        show: false,
        message: '',
        type: 'success',
      }
    }
  },
  methods: {
    showNotification(message, type = 'success') {
      this.notification.type = type;
      this.notification.message = message;
      this.notification.show = true;
      
      setTimeout(() => {
        this.notification.show = false;
      }, 4000);
    },

    async submitForm() {

  if (!this.name || !this.email || !this.message) {
    this.showNotification("Please fill in all fields", "error");
    return;
  }

  if (this.message.length > 500) {
    this.showNotification("Message too long (500 max)", "error");
    return;
  }

  this.isLoading = true;

  try {

    const res = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.name,
        email: this.email,
        message: this.message
      })
    });

    const data = await res.json();

    if (data.success) {

      this.showNotification(
        `Thank you ${this.name}, your message was sent successfully!`,
        "success"
      );

      this.name = "";
      this.email = "";
      this.message = "";

    } else {
      this.showNotification(data.message, "error");
    }

  } catch(e) {

    console.error(e);
    this.showNotification("Email server is unreachable", "error");

  } finally {
    this.isLoading = false;
  }
}
  }
}
</script>

<style scoped>
.contact-view {
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

.title-section .page-title .accent-text {
  color: #1a7d5e;
  background: linear-gradient(135deg, #1a7d5e, #00ffcc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  min-width: 160px;
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

/* Contact Content */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Form Section */
.form-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
}

.form-header {
  margin-bottom: 32px;
  text-align: center;
}

.form-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #0a3c2b;
  margin: 0 0 8px 0;
}

.form-header p {
  color: #4a7c6d;
  font-size: 15px;
  margin: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #0a3c2b;
  margin-bottom: 4px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: stretch;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a7c6d;
  z-index: 2;
}

.textarea-icon {
  top: 20px;
  transform: none;
}

.modern-input, .modern-textarea {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e0f0e9;
  border-radius: 12px;
  background: white;
  font-size: 15px;
  transition: all 0.3s ease;
  color: #0a3c2b;
  font-family: inherit;
}

.modern-textarea {
  padding-top: 16px;
  min-height: 140px;
  resize: vertical;
}

.modern-input::placeholder, .modern-textarea::placeholder {
  color: #7aa895;
}

.modern-input:focus, .modern-textarea:focus {
  outline: none;
  border-color: #1a7d5e;
  box-shadow: 0 0 0 4px rgba(26, 125, 94, 0.1);
  background: #f8fdfb;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #7aa895;
  margin-top: 4px;
}

.submit-btn {
  background: linear-gradient(135deg, #1a7d5e, #0a3c2b);
  color: white;
  border: none;
  padding: 18px 32px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}

.submit-btn:hover:not(.loading) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(26, 125, 94, 0.4);
}

.submit-btn.loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(10, 60, 43, 0.08);
  border: 1px solid #e0f0e9;
}

.info-card h4 {
  font-size: 20px;
  font-weight: 700;
  color: #0a3c2b;
  margin: 0 0 24px 0;
  text-align: center;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid #e0f0e9;
}

.contact-method:last-child {
  border-bottom: none;
}

.method-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f0f9f5, #e0f2ec);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a7d5e;
  flex-shrink: 0;
}

.method-content h5 {
  font-size: 16px;
  font-weight: 600;
  color: #0a3c2b;
  margin: 0 0 4px 0;
}

.method-content p {
  color: #4a7c6d;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.email-link {
  color: #1a7d5e;
  font-weight: 500;
}

.response-time {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e0f0e9;
}

.time-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0f9f5;
  color: #1a7d5e;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
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
  .contact-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .contact-view {
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
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-section {
    padding: 24px;
  }
  
  .info-card {
    padding: 24px;
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
  
  .contact-method {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .method-icon {
    align-self: center;
  }
}
</style>