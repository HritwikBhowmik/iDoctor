// ========================
// Admin Login Functionality
// ========================

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// ========================
// Event Listeners
// ========================

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  handleLogin();
});

// ========================
// Login Handler
// ========================

async function handleLogin() {
  const email = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Clear previous messages
  hideMessages();

  // Validate inputs
  if (!email || !password) {
    showError('Email and password are required.');
    return;
  }

  if (!email.includes('@')) {
    showError('Please enter a valid email address.');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters long.');
    return;
  }

  // Try to authenticate
  try {
    await authenticateUser(email, password);
  } catch (error) {
    showError(error.message || 'Authentication failed. Please try again.');
  }
}

// ========================
// Authentication with Backend
// ========================

//const API_BASE_URL = 'http://192.168.0.104:5666';
const API_BASE_URL = "http://103.174.51.212/admin";
const LOGIN_ENDPOINT = `${API_BASE_URL}/admin/login`;

async function authenticateUser(email, password) {
  // Show loading state
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'VERIFYING...';

  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      let errorMessage = 'Invalid email or password';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Validate response contains token
    if (!data.token && !data.access_token) {
      throw new Error('Invalid response from server: missing token');
    }

    // Store auth token and user info
    const token = data.token || data.access_token;
    localStorage.setItem('authToken', token);
    localStorage.setItem('adminEmail', data.email || email);
    
    showSuccess('Access granted. Redirecting...');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } catch (error) {
    throw error;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// ========================
// UI Helper Functions
// ========================

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  successMessage.classList.remove('show');
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.add('show');
  errorMessage.classList.remove('show');
}

function hideMessages() {
  errorMessage.classList.remove('show');
  successMessage.classList.remove('show');
}

// ========================
// Input Validation on Change
// ========================

usernameInput.addEventListener('input', () => {
  hideMessages();
});

passwordInput.addEventListener('input', () => {
  hideMessages();
});

// ========================
// Initialize on Page Load
// ========================

window.addEventListener('load', () => {
  // Check if user is already logged in
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    // Redirect to dashboard if already authenticated
    window.location.href = 'dashboard.html';
  }

  // Focus on username input
  usernameInput.focus();
});

// ========================
// Keyboard Shortcuts
// ========================

document.addEventListener('keydown', (e) => {
  // Enter key to submit form
  if (e.key === 'Enter' && (document.activeElement === usernameInput || document.activeElement === passwordInput)) {
    loginForm.dispatchEvent(new Event('submit'));
  }

  // Clear error messages on typing
  if (e.key.length === 1) {
    hideMessages();
  }
});
