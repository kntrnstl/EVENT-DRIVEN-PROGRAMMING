<template>
  <div class="auth-wrapper">

    <!-- Verification Card -->
    <div class="verify-card">
      
      <div class="header-icon">🔒</div>
      
      <h1 class="title">Verify Your Email</h1>
      <p class="subtitle">
        We sent a 6-digit code to: <span class="email-display">{{ email }}</span>
      </p>

      <!-- CODE INPUT (Visually styled as separate digits) -->
      <div class="code-input-wrapper">
        <!-- Actual invisible input field -->
        <label for="code-input" class="sr-only">Verification Code</label>
        <input 
          id="code-input"
          class="code-input-field"
          type="text"
          v-model="code"
          maxlength="6"
          inputmode="numeric"
          pattern="[0-9]*"
          @input="formatCodeDisplay"
          @paste.prevent
          autofocus 
          ref="codeInput"
        />
        <!-- Visual representation of the 6 digits -->
        <div class="digit-display">
          <span 
            v-for="(digit, index) in displayCode" 
            :key="index" 
            :class="['digit-box', { filled: code.length > index, focused: code.length === index }]"
          >
            {{ digit === ' ' ? '' : digit }}
          </span>
        </div>
      </div>

      <!-- VERIFY BUTTON -->
      <button class="auth-button" :disabled="code.length !== 6" @click="verifyEmail">
        <span>Verify and Continue</span>
        <svg class="button-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="M22 4L12 14.01l-3-3"></path></svg>
      </button>

      <!-- RESEND CODE -->
      <button class="resend-btn" @click="resendCode">
        Resend Code
      </button>

      <!-- MESSAGE/FEEDBACK -->
      <transition name="fade">
        <div v-if="message" :class="['message', messageType]">
          <div class="message-icon">{{ messageType === 'success' ? '✔' : '❗' }}</div>
          {{ message }}
        </div>
      </transition>

    </div>

  </div>
</template>

<script>
// NOTE: axios is not defined in this environment, using fetch as a placeholder
// import axios from "axios"; 

export default {
  name: 'EmailVerification',
  
  data() {
    return {
      // Use firestore global variables
      email: typeof localStorage !== 'undefined' && localStorage.getItem("pendingEmail") || "user@example.com", 
      code: "",
      message: "",
      messageType: "success",
    };
  },

  computed: {
    displayCode() {
      // Pad with spaces for visual representation, then split
      return this.code.padEnd(6, ' ').split('');
    }
  },

  mounted() {
    // Focus the input field when the component is mounted
    this.$refs.codeInput.focus();
  },

  methods: {
    formatCodeDisplay(event) {
        // Enforce numeric-only input and limit to 6 characters
        this.code = event.target.value.replace(/[^0-9]/g, '').substring(0, 6);
    },

    async verifyEmail() {
      if (this.code.length !== 6) {
        this.message = "Verification code must be 6 digits.";
        this.messageType = "error";
        return;
      }

      this.message = "Verifying...";
      this.messageType = "info";

      try {
        // --- Mock API Success Response (using fetch/setTimeout) ---
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulated network delay
        const res = { data: { message: "Email verified successfully!", token: "dummy-jwt", user: { role: "user" } } };
        // --- End Mock ---

        this.message = res.data.message;
        this.messageType = "success";

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);
            localStorage.removeItem("pendingEmail");
        }


        setTimeout(() => {
          console.log("Navigation simulated.");
        }, 1000);

      } catch (err) {
        this.message = "Verification failed. Check your code (Simulated Error)."; 
        this.messageType = "error";
      }
    },

    async resendCode() {
      this.message = "Requesting new code...";
      this.messageType = "info";

      try {
        // --- Mock API Success Response (using fetch/setTimeout) ---
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulated network delay
        const res = { data: { message: "New verification code sent!" } };
        // --- End Mock ---

        this.message = res.data.message;
        this.messageType = "success";

      } catch (err) {
        this.message = "Could not resend code. Try again later. (Simulated Error)"; 
        this.messageType = "error";
      }
    }
  }
};
</script>

<style scoped>
/* Import Inter font for modern look */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
/* --- BASE LAYOUT --- */
.auth-wrapper {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  padding: 20px;
}

.verify-card {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  border-radius: 16px;
  background: var(--color-card-bg);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7), 0 0 5px rgba(0, 0, 0, 0.4); /* Stronger shadow */
  color: var(--color-text);
  text-align: center;
}

/* --- HEADER --- */
.header-icon {
    font-size: 3rem;
    margin-bottom: 10px;
    color: var(--color-primary-light); /* Brighter accent for icon */
}
.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: var(--color-text);
}
.subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
  line-height: 1.5;
}
.email-display {
    font-weight: 600;
    color: var(--color-primary-light); 
    word-break: break-all;
}

/* --- CODE INPUT STYLING (The FIX for Centering and extra border) --- */

.code-input-wrapper {
    position: relative;
    margin-bottom: 25px;
    height: 70px; 
    /* This defines the full centered grid area */
    display: grid; 
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
}


/* This is the actual invisible input field that captures keystrokes */
.code-input-field {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    /* Ensure maximum invisibility to prevent the ghost input box */
    opacity: 0; 
    border: none;
    outline: none; 
    z-index: 10; 
    cursor: text;
    caret-color: transparent;
    color: transparent; 
    background: transparent;
}

/* This is the visual element that looks like 6 boxes */
.digit-display {
    /* Ensures the digit boxes take up the grid space defined by the wrapper */
    grid-column: 1 / -1; 
    display: contents; /* Allows the children (.digit-box) to be the grid items */
    pointer-events: none; 
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
}


.digit-box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--color-text);
    border-radius: 8px;
    background-color: #003322; /* Darker box background */
    border: 2px solid #3d4a45; /* Subtle border for boxes */
    transition: all 0.2s;
    user-select: none;
}

/* Highlight the box as it's being filled */
.digit-box.filled {
    background-color: var(--color-primary-dark); 
    border-color: #003322;
}

/* Style the currently focused box */
.digit-box.focused {
    border: 2px solid var(--color-primary-light);
    box-shadow: 0 0 8px rgba(82, 183, 136, 0.4); /* Accent glow */
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

/* --- BUTTONS --- */

/* Primary Verify Button */
.auth-button {
  width: 100%;
  padding: 14px 25px;
  margin-top: 20px; /* Increased margin for safety */
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  /* Gradient using the dark green palette */
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%); 
  color: #003322;
  box-shadow: 0 6px 15px rgba(20, 115, 83, 0.4);
  z-index: 20; /* Ensure button is on top */
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(20, 115, 83, 0.6);
  background-color:#003322;
  color:white;
}

.auth-button:disabled {
  background: white; 
  color: #003322;
  cursor: not-allowed;
  opacity: 0.8;
  transform: none;
}
.button-icon {
    margin-left: 5px;
}

/* Secondary Resend Button (Ghost/Link Style) */
.resend-btn {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.resend-btn:hover {
  color: #003322;
  font-weight: bold;
}

/* Slide + fade underline animation */
.resend-btn::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0%;
  height: 2px;
  background: #003322;
  transition: width 0.3s ease;
}

.resend-btn:hover::after {
  width: 100%;
}

/* --- MESSAGE/FEEDBACK --- */
.message {
  padding: 15px;
  border-radius: 8px;
  margin-top: 25px;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}
.message-icon {
    font-size: 1.1rem;
    line-height: 1;
}

.message.success {
  background: rgba(52, 211, 153, 0.12);
  color: var(--color-success);
  border: 1px solid rgba(16, 185, 129, 0.45);
  backdrop-filter: blur(8px) saturate(130%);
  -webkit-backdrop-filter: blur(8px) saturate(130%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.18);
}


.message.error {
  background-color: #f8717120; 
  color: var(--color-error);
  border: 1px solid var(--color-error);
}

.message.info {
  background-color: var(--color-primary-light); 
  color: var(--color-bg); 
  border: 1px solid var(--color-primary-light);
}

/* Transition for messages */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Accessibility: Visually hidden text for screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>