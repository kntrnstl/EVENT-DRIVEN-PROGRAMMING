<template>
  <div class="user-dashboard">

    <div
      class="custom-notif"
      :class="[notification.type, { show: notification.show }]"
    >
      <i :class="notification.icon" class="notif-icon"></i>
      {{ notification.message }}
    </div>

    <nav class="navbar">
      <h1 class="logo">Oning Flip<span class="dot">.</span></h1>
      <ul class="nav-links">
        <li>
          <a @click.prevent="setView('home')" :class="{ active: currentView==='home' }">
            <span class="nav-link-inner">Home</span>
          </a>
        </li>
        <li>
          <a @click.prevent="setView('products')" :class="{ active: currentView==='products' }">
            <span class="nav-link-inner">Products</span>
          </a>
        </li>
        <li>
          <a @click.prevent="setView('contact')" :class="{ active: currentView==='contact' }">
            <span class="nav-link-inner">Contact</span>
          </a>
        </li>
      </ul>
      
      <div class="header-actions">
        <!-- Modern Cart Icon -->
        <div class="cart-icon-container" @click="setView('cart')">
          <div class="cart-icon-wrapper">
            <i class="fas fa-shopping-bag"></i>
            <div v-if="getCartItemCount() > 0" class="cart-badge">
              {{ getCartItemCount() > 99 ? '99+' : getCartItemCount() }}
            </div>
          </div>
          <span class="cart-label">Cart</span>
        </div>

        <!-- User Dropdown -->
        <div class="user-dropdown" @click="toggleUserDropdown">
          <div class="user-info">
            <div class="user-avatar">
              <i class="fas fa-user-circle"></i> 
            </div>
            <div class="user-details">
              <span class="username">{{ currentUser.username }}</span>
              <span class="user-email">{{ currentUser.email }}</span>
            </div>
            <i class="fas fa-chevron-down dropdown-arrow" :class="{ rotated: userDropdownOpen }"></i>
          </div>
          
          <div v-if="userDropdownOpen" class="dropdown-menu">
            <div class="dropdown-item" @click="setView('my-orders')">
              <i class="fas fa-box-open"></i>
              <span>My Orders</span>
            </div>
            <div class="dropdown-item logout" @click="confirmLogout">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <transition name="slide-up" mode="out-in">
      <div class="view-container" :key="currentView">
        <HomeView v-if="currentView==='home'" @navigate="setView" />
        <ProductsView v-if="currentView==='products'" @add-to-cart="addToCart" />
        <CartView 
          v-if="currentView==='cart'" 
          :cart="cart" 
          @update-cart="updateCart" 
          @remove-item="removeFromCart" 
          @navigate="setView"
          @refresh-cart="fetchCart"
        />
        <ContactView v-if="currentView==='contact'" />
        <MyOrders v-if="currentView==='my-orders'" />
      </div>
    </transition>

    <button class="floating-chatbot-bubble" @click="toggleChatbot">
      <i v-if="!showChatbot" class="fas fa-comment-dots"></i> 
      <i v-else class="fas fa-times"></i> 
    </button>

    <transition name="chatbot-slide">
      <div v-if="showChatbot" class="chatbot-window">
        <div class="chatbot-header">
          <h3>Oning Flip Support Assistant</h3>
          <button class="close-chatbot" @click="toggleChatbot">
            <i class="fas fa-minus"></i>
          </button>
        </div>
        <div class="chat-messages">
          <div v-for="(msg, index) in chatMessages" :key="index" 
               :class="['message', msg.type]">
            <div class="message-content">
              {{ msg.message }}
              <div v-if="msg.isTyping" class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input-container">
          <textarea 
            v-model="userInput" 
            @keypress="handleKeypress"
            placeholder="Type your message..." 
            rows="1"
            class="chat-input"
          ></textarea>
          <button @click="sendMessage" class="send-btn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </transition>

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
          <p>Are you sure you want to logout from your account?</p>
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

    <footer class="footer">
      <div class="footer-top container">
        
        <div class="footer-section branding-socials">
          <h4>Oning Flip<span class="dot">.</span></h4>
          <p>Premium footwear crafted for <b>comfort and style</b>, ensuring quality with every step, delivered swiftly right to your door.</p>
          
          <h4>Follow Us</h4>
          <div class="social-buttons">
            <a href="https://www.facebook.com/oning.flip?rdid=CStuOSchWk46Wans#" target="_blank" class="social-btn facebook" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/oning.flip/?igsh=ZTczczJmdHV4ZWoy&fbclid=IwY2xjawOLdl1leHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEeBbK2O6leCVqQJNRQoDeRYSrK1X-nxP59Le-H0uo9-gktNvI3txNPH08dm2w_aem_ZxBZwLPjWmaWPgME3YbjZg#" target="_blank" class="social-btn instagram" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@oning.flip?_r=1&_t=ZS-91X0ZoVgIuF&fbclid=IwY2xjawOLdjRleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEeWxl0kEX8ean_4eMcFlpzXx1ENimfuS4W3qfsDz5rieLt5pmcrS3B-CPSkrA_aem_rKezCysOfwY-fgxmkhbXJA" target="_blank" class="social-btn tiktok" aria-label="TikTok">
              <i class="fab fa-tiktok"></i>
            </a>
            <a href="https://x.com/FlipOning?t=lRS_tEJgadi81WDS4gv9RQ&s=09&fbclid=IwY2xjawOLfnVleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEe4xSO2r9xdG9sBYYwc85APgcU37OyUyRkPtYBMsw8ofzuYrE0ccMxtipfx0k_aem_l_dFwST_VozOvizuE4KWdw" target="_blank" class="social-btn x-logo" aria-label="Twitter/X">
              <i class="fab fa-x"></i>
            </a>
          </div>
        </div>

        <div class="footer-section map-location">
          <h4>Location</h4>
          <div class="map-wrapper">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.4474379016924!2d121.0336344757423!3d14.687270774947583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b1083b843ff9%3A0x3f64e787855b8479!2sOning%20Flip!5e0!3m2!1sen!2sph!4v1763894252052!5m2!1sen!2sph" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} Oning Flip. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// Components
import HomeView from './HomeView.vue';
import ProductsView from './ProductsView.vue';
import CartView from './CartView.vue';
import ContactView from './ContactView.vue';
import MyOrders from './MyOrders.vue';

// Router
const router = useRouter();

// --- STATE ---
const currentView = ref('home');
const cart = ref([]);
const showLogoutConfirm = ref(false);
const notification = ref({ show: false, type: 'success', message: '' });
const showChatbot = ref(false);
const chatMessages = ref([]);
const userInput = ref('');
const conversationHistory = ref([]);
const userDropdownOpen = ref(false);
const currentUser = ref({
  username: 'Loading...',
  email: 'Loading...',
});

// --- METHODS ---
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getUserId = () => {
  return localStorage.getItem('userId');
};

// Fetch current user data
// Fetch current user data
const fetchCurrentUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await fetch('/api/current-user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.user) {
        currentUser.value = {
          username: data.user.username || 'Customer',
          email: data.user.email || 'customer@example.com',
          role: data.user.role || 'customer'
        };
        // Store userId for future use
        localStorage.setItem('userId', data.user.id);
      }
    } else {
      console.error('Failed to fetch user data');
      // Fallback values for user
      currentUser.value = {
        username: 'Customer',
        email: 'customer@example.com',
        role: 'customer'
      };
      
      if (response.status === 401) {
        showNotification('error', 'Session expired. Please login again.');
        setTimeout(() => {
          logout();
        }, 2000);
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Fallback values for user
    currentUser.value = {
      username: 'Customer',
      email: 'customer@example.com',
      role: 'customer'
    };
  }
};

// Fetch cart from backend API
const fetchCart = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      cart.value = [];
      return;
    }

    const response = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const cartData = await response.json();
      cart.value = cartData;
    } else {
      console.error('Failed to fetch cart');
      cart.value = [];
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    cart.value = [];
  }
};

const getCartItemCount = () => {
  if (!Array.isArray(cart.value)) return 0;
  
  return cart.value.reduce((total, item) => {
    if (item && typeof item === 'object' && 'quantity' in item) {
      return total + (item.quantity || 1);
    }
    return total;
  }, 0);
};

const setView = (view) => {
  currentView.value = view;
  userDropdownOpen.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value;
};

const closeDropdown = (event) => {
  if (userDropdownOpen.value && !event.target.closest('.user-dropdown')) {
    userDropdownOpen.value = false;
  }
};

const confirmLogout = () => {
  userDropdownOpen.value = false;
  showLogoutConfirm.value = true;
};

const showNotification = (type, message) => {
  const icons = { 
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle'
  };
  notification.value = { show: true, type, message, icon: icons[type] || icons.info };
  setTimeout(() => notification.value.show = false, 3000);
};

const logout = () => {
  showLogoutConfirm.value = false;
  showNotification('success', 'You have logged out successfully!');
  
  setTimeout(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    router.push('/');
  }, 1000);
};

const addToCart = async (item) => {
  try {
    const token = getAuthToken();
    if (!token) {
      showNotification('error', 'Please login to add items to cart');
      return;
    }

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: item.product_id,
        size_id: item.size_id,
        quantity: item.quantity,
        price: item.price
      })
    });

    if (response.ok) {
      await fetchCart(); // Refresh cart from server
      showNotification('success', `${item.name} added to cart!`);
    } else {
      showNotification('error', 'Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showNotification('error', 'Error adding item to cart');
  }
};

const updateCart = async (updatedCart) => {
  // Since we're using backend cart, we need to update each item individually
  try {
    const token = getAuthToken();
    if (!token) return;

    // Update each item in the cart
    for (const item of updatedCart) {
      const response = await fetch(`/api/cart/${item.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: item.quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }
    }

    await fetchCart(); // Refresh cart from server
    showNotification('success', 'Cart updated successfully!');
  } catch (error) {
    console.error('Error updating cart:', error);
    showNotification('error', 'Error updating cart');
  }
};

const removeFromCart = async (itemId) => {
  try {
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      await fetchCart(); // Refresh cart from server
      showNotification('success', 'Item removed from cart!');
    } else {
      showNotification('error', 'Failed to remove item from cart');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    showNotification('error', 'Error removing item from cart');
  }
};

// Chatbot Methods
const toggleChatbot = () => {
  showChatbot.value = !showChatbot.value;
  if (showChatbot.value && chatMessages.value.length === 0) {
    chatMessages.value.push({
      type: 'bot',
      message: 'Hello! I\'m your Oning Flip assistant. How can I help you today? I can assist with order tracking, product information, returns, and general support.'
    });
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  const userMessage = userInput.value.trim();
  chatMessages.value.push({ type: 'user', message: userMessage });
  userInput.value = '';

  try {
    const typingIndex = chatMessages.value.push({
      type: 'bot',
      message: '...',
      isTyping: true
    }) - 1;

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      chatMessages.value.splice(typingIndex, 1);
      chatMessages.value.push({
        type: 'bot',
        message: "API key is missing. Here's a mock response for: " + userMessage
      });
      return;
    }

    const productData = await fetch(`/api/search?q=${encodeURIComponent(userMessage)}`)
      .then(res => res.json())
      .catch(() => ({ results: [], recommended: [] }));

    conversationHistory.value.push({ role: "user", content: userMessage });
    if (conversationHistory.value.length > 5) conversationHistory.value.shift();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are Oning Flip AI Assistant.

Here are the products matching the customer's query:
${JSON.stringify(productData.results, null, 2)}

Recommended alternatives:
${JSON.stringify(productData.recommended, null, 2)}

INSTRUCTIONS:
- If product is out of stock → suggest alternatives.
- Understand size queries, availability, price ranges.
- Respond conversationally.
- Use memory of last 5 messages.
- Always recommend similar products when relevant.
`
          },
          ...conversationHistory.value,
          { role: "user", content: userMessage }
        ],
        temperature: 0.5
      })
    });

    chatMessages.value.splice(typingIndex, 1);

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    conversationHistory.value.push({ role: "assistant", content: botResponse });
    if (conversationHistory.value.length > 5) conversationHistory.value.shift();

    chatMessages.value.push({ type: 'bot', message: botResponse });

  } catch (err) {
    console.error(err);
    chatMessages.value.push({
      type: 'bot',
      message: "Sorry, something went wrong. Please try again."
    });
  }
};

const handleKeypress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  document.addEventListener('click', closeDropdown);
  // Fetch user data and cart when component mounts
  fetchCurrentUser();
  fetchCart();
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
/* ===== GLOBAL ===== */
.user-dashboard {
  font-family: 'Inter', sans-serif;
  color: #34495e;
  background: #f8f9fa;
  min-height: 100vh;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== NAVBAR STYLES ===== */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f3d2e;
  padding: 16px 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}
.logo {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 26px;
  color: #fff;
  cursor: pointer;
}
.logo .dot {
  color: #7bf2b3;
}
.nav-links {
  display: flex;
  gap: 28px;
  list-style: none;
}
.nav-links a {
  color: #d8efe3;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  position: relative;
  transition: color 0.3s;
  cursor: pointer;
}
.nav-links a:hover,
.nav-links a.active {
  color: #7bf2b3;
}
.nav-link-inner {
  display: flex;
  align-items: center;
  position: relative;
}
.nav-link-inner::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0%;
  height: 3px;
  background: #7bf2b3;
  border-radius: 2px;
  transition: width 0.3s;
}
.nav-links a:hover .nav-link-inner::after,
.nav-links a.active .nav-link-inner::after {
  width: 100%;
}

/* ===== HEADER ACTIONS ===== */
.header-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

/* Modern Cart Icon Styles */
.cart-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(26, 125, 94, 0.1);
  border: 1px solid rgba(26, 125, 94, 0.2);
  min-width: 70px;
  position: relative;
}

.cart-icon-container:hover {
  background: rgba(26, 125, 94, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 125, 94, 0.3);
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.cart-icon-wrapper i {
  font-size: 20px;
  color: #7bf2b3;
  transition: transform 0.3s ease;
}

.cart-icon-container:hover .cart-icon-wrapper i {
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border-radius: 12px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  border: 2px solid #0f3d2e;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
  }
}

.cart-label {
  font-size: 12px;
  font-weight: 600;
  color: #7bf2b3;
  margin-top: 4px;
  text-align: center;
}

/* User Dropdown Styles */
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
  background: #145943; 
  border: 1px solid #7bf2b330;
  color: #fff;
}
.user-info:hover {
  background: #196b52;
}
.user-avatar {
  width: 40px;
  height: 40px;
  background: #7bf2b3; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f3d2e; 
  font-size: 18px; 
  flex-shrink: 0;
}
.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.username {
  color: #fff; 
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}
.user-email {
  color: #d8efe3;
  font-size: 12px;
  line-height: 1.2;
  margin-top: 2px;
}
.dropdown-arrow {
  color: #7bf2b3;
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
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
  transform-origin: top right;
  animation: scale-in 0.2s ease-out;
}
@keyframes scale-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #34495e;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f0f4f7;
  color: #0073ff; 
}
.dropdown-item i {
  width: 16px;
  text-align: center;
  color: #99aab5;
}
.dropdown-item:hover i {
  color: #0073ff;
}
.dropdown-item.logout {
    border-top: 1px solid #e0e0e0;
}
.dropdown-item.logout i {
    color: #ff4d4d;
}
.dropdown-item.logout:hover {
    background: #fff0f0;
}

/* --- REST OF THE STYLES REMAIN UNCHANGED --- */
/* (Keeping all your existing notification, modal, view, chatbot, and footer styles exactly as they were) */

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
  background: linear-gradient(135deg, #00b061, #00773d);
  border-left: 4px solid #7bf2b3;
}
.custom-notif.error {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  border-left: 4px solid #f56565;
}
.custom-notif.info {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  border-left: 4px solid #63b3ed;
}
.notif-icon {
  font-size: 16px;
}

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
.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
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
  color: #ff4d4d; 
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
  padding: 0 24px;
}
.modal-body p {
  margin: 0;
  color: #34495e;
  line-height: 1.6;
  font-size: 15px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
}
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
.btn-secondary {
  background: #f0f4f7;
  color: #34495e;
  border: 1px solid #dcdfe6;
}
.btn-secondary:hover {
  background: #e0e5ea;
}
.btn-danger {
  background: #ff4d4d;
  color: white;
}
.btn-danger:hover {
  background: #cc3c3c;
}

.view-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 20px;
  min-height: calc(100vh - 140px);
  position: relative;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}
.slide-up-enter-from {
  transform: translateY(-30px); 
  opacity: 0;
}
.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-up-leave-to {
  transform: translateY(30px); 
  opacity: 0;
}

.floating-chatbot-bubble {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #00b061, #00773d); 
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 176, 97, 0.4);
  transition: all 0.3s ease;
  z-index: 1000; 
}
.floating-chatbot-bubble:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 176, 97, 0.6);
}
.floating-chatbot-bubble i {
  transition: transform 0.3s ease;
}
.floating-chatbot-bubble:hover i {
  transform: rotate(5deg);
}
.chatbot-window {
  position: fixed;
  bottom: 100px; 
  right: 30px;
  width: 350px; 
  height: 500px; 
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  transition: all 0.3s ease-out;
}
.chatbot-slide-enter-active,
.chatbot-slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.chatbot-slide-enter-from,
.chatbot-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.chatbot-header {
  background: #0f3d2e; 
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.chatbot-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.close-chatbot {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: color 0.3s;
}
.close-chatbot:hover {
  color: white;
}
.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f0f4f7; 
  display: flex; 
  flex-direction: column;
}
.message {
  margin-bottom: 10px; 
  display: flex;
  max-width: 90%;
}
.message.user {
  justify-content: flex-end;
  margin-left: auto; 
}
.message.bot {
  justify-content: flex-start;
  margin-right: auto; 
}
.message-content {
  max-width: 100%;
  padding: 10px 14px; 
  border-radius: 20px; 
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
}
.message.user .message-content {
  background: #0073ff; 
  color: white;
  border-bottom-right-radius: 4px; 
}
.message.bot .message-content {
  background: white;
  color: #34495e;
  border: 1px solid #dcdfe6;
  border-bottom-left-radius: 4px; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.typing-indicator {
  display: inline-flex;
  gap: 3px;
  margin-left: 5px;
}
.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}
.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
.chat-input-container {
  padding: 10px 15px; 
  border-top: 1px solid #e0e0e0;
  background: white;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
.chat-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  min-height: 20px; 
}
.chat-input:focus {
  border-color: #0073ff;
  box-shadow: 0 0 5px rgba(0, 115, 255, 0.2);
}
.send-btn {
  width: 40px;
  height: 40px;
  background: #0073ff;
  color: white;
  border: none;
  border-radius: 50%; 
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.send-btn:hover {
  background: #0055cc;
  transform: scale(1.05);
}

.footer {
  background: #0f3d2e;
  color: #d8efe3;
  padding: 40px 0 25px;
  font-family: 'Inter', sans-serif;
}

.footer-top {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #145943;
  padding-left: 20px;
  padding-right: 20px;
}

.footer-section h4 {
  font-weight: 700;
  font-size: 18px;
  color: #7bf2b3;
  margin-bottom: 16px;
}
.footer-section p, .footer-section a {
  color: #d8efe3;
  font-size: 14px;
  margin-bottom: 8px;
  text-decoration: none;
  cursor: default;
}
.footer-section a:hover { color: #fff; }

.contact-info {
  display: flex;
  flex-direction: column;
}

.branding-socials {
  display: flex;
  flex-direction: column;
}
.branding-socials h4:nth-of-type(2) {
  margin-top: 25px; 
}
.social-buttons {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 30%;
  background: #145943; 
  color: #fff; 
  font-size: 16px;
  transition: all 0.3s;
}

.map-location {
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  height:175px;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.social-btn.facebook:hover { background: #1877f2; }
.social-btn.instagram:hover { background: linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5); }
.social-btn.tiktok:hover { background: #000; }
.social-btn.x-logo:hover { background: #000; }

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #c0e9d4;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .navbar { padding: 15px 20px; }
  .nav-links { display: none; }
  
  .footer-top { 
    grid-template-columns: 1fr 1fr;
    gap: 25px; 
  }

  .footer { padding: 30px 0 15px; }
}

@media (max-width: 768px) {
  .view-container { padding: 20px 12px; }
  
  .footer-top { 
    grid-template-columns: 1fr;
  }
  
  .footer-top > div {
    text-align: center;
  }

  .branding-socials h4:nth-of-type(2) {
    margin-top: 15px; 
  }
  
  .social-buttons {
    justify-content: center;
  }
  
  .footer { padding: 30px 0 15px; }
  
  .floating-chatbot-bubble {
    bottom: 20px;
    right: 20px;
  }
  
  .chatbot-window {
    width: 90vw; 
    height: 80vh; 
    bottom: 20px;
    right: 5vw;
  }
  
  .user-details {
    display: none; 
  }

  .user-info {
    padding: 8px 12px;
  }

  .dropdown-menu {
    min-width: 150px;
  }

  .cart-label {
    display: none;
  }
  
  .cart-icon-container {
    padding: 8px;
    min-width: auto;
  }
  
  .header-actions {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 12px 16px;
  }
  
  .logo {
    font-size: 22px;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .cart-badge {
    min-width: 18px;
    height: 18px;
    font-size: 10px;
  }
  
  .cart-icon-wrapper i {
    font-size: 18px;
  }
}
</style>