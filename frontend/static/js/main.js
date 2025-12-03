/**
 * Main Frontend JavaScript
 * Handles UI interactions and API calls
 */

// DOM Elements
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const authLink = document.getElementById('auth-link');
const authTitle = document.getElementById('auth-title');
const authMessage = document.getElementById('auth-message');
const switchToSignup = document.getElementById('switch-to-signup');
const toursContainer = document.getElementById('tours-container');

// State
let isSignUp = false;
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadTours();
    checkAuthStatus();
});

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Auth modal
    authLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal();
    });
    
    // Close modal on outside click
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            hideAuthModal();
        }
    });
    
    // Switch between sign in and sign up
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthMode();
    });
    
    // Auth form submission
    authForm.addEventListener('submit', handleAuthSubmit);
}

/**
 * Show authentication modal
 */
function showAuthModal() {
    authModal.classList.remove('hidden');
    authModal.style.display = 'flex';
    isSignUp = false;
    updateAuthModal();
}

/**
 * Hide authentication modal
 */
function hideAuthModal() {
    authModal.classList.add('hidden');
    authModal.style.display = 'none';
    authForm.reset();
    clearAuthMessage();
}

/**
 * Toggle between sign in and sign up
 */
function toggleAuthMode() {
    isSignUp = !isSignUp;
    updateAuthModal();
}

/**
 * Update auth modal based on mode
 */
function updateAuthModal() {
    if (isSignUp) {
        authTitle.textContent = 'Sign Up';
        switchToSignup.textContent = 'Already have an account? Sign In';
        // You can add more fields for signup here
    } else {
        authTitle.textContent = 'Sign In';
        switchToSignup.textContent = "Don't have an account? Sign Up";
    }
    clearAuthMessage();
}

/**
 * Handle auth form submission
 */
async function handleAuthSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        if (isSignUp) {
            // Handle signup (you can expand this)
            showAuthMessage('Sign up functionality coming soon!', 'info');
        } else {
            // Handle signin
            const response = await AuthAPI.signin(email, password);
            if (response.success) {
                currentUser = response.data;
                showAuthMessage('Sign in successful!', 'success');
                setTimeout(() => {
                    hideAuthModal();
                    updateUIAfterAuth();
                }, 1000);
            }
        }
    } catch (error) {
        showAuthMessage(error.message || 'An error occurred', 'error');
    }
}

/**
 * Show auth message
 */
function showAuthMessage(message, type = 'info') {
    authMessage.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

/**
 * Clear auth message
 */
function clearAuthMessage() {
    authMessage.innerHTML = '';
}

/**
 * Update UI after authentication
 */
function updateUIAfterAuth() {
    if (currentUser) {
        authLink.textContent = `Welcome, ${currentUser.firstname}`;
        // Add logout functionality
    }
}

/**
 * Check authentication status
 */
function checkAuthStatus() {
    // Check if user is logged in (you can use session storage or cookies)
    const userData = sessionStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIAfterAuth();
    }
}

/**
 * Load tours from API
 */
async function loadTours() {
    try {
        // This endpoint needs to be created in the backend
        // For now, we'll show a placeholder
        toursContainer.innerHTML = `
            <div class="card">
                <h3 class="card-title">Tour Loading...</h3>
                <p>Connect to the API to load tours</p>
            </div>
        `;
        
        // Uncomment when backend endpoint is ready:
        // const response = await TourAPI.getAllTours();
        // displayTours(response.data);
    } catch (error) {
        console.error('Error loading tours:', error);
        toursContainer.innerHTML = `
            <div class="alert alert-error">
                Failed to load tours. Please check your API connection.
            </div>
        `;
    }
}

/**
 * Display tours in the UI
 */
function displayTours(tours) {
    if (!tours || tours.length === 0) {
        toursContainer.innerHTML = '<p class="text-center">No tours available at the moment.</p>';
        return;
    }
    
    toursContainer.innerHTML = tours.map(tour => `
        <div class="card">
            <h3 class="card-title">${tour.title}</h3>
            <p>${tour.description.substring(0, 100)}...</p>
            <p><strong>Price:</strong> ${tour.calculated_price} DZD</p>
            <p><strong>Duration:</strong> ${tour.estimated_duration} hours</p>
            <p><strong>Available Places:</strong> ${tour.available_places}/${tour.max_places}</p>
            <a href="#" class="btn btn-primary mt-2">View Details</a>
        </div>
    `).join('');
}

