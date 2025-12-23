/**
 * API Configuration and Helper Functions
 * Handles communication between frontend and Django backend
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Make API request with error handling
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
    };
    
    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * Authentication API
 */
const AuthAPI = {
    signin: async (email, password) => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        
        return apiRequest('/signin/', {
            method: 'POST',
            body: formData,
        });
    },
    
    signupTourist: async (userData) => {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            formData.append(key, userData[key]);
        });
        
        return apiRequest('/signup/tourist/', {
            method: 'POST',
            body: formData,
        });
    },
    
    signupGuide: async (userData) => {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            if (key !== 'certification_files' && key !== 'languages') {
                formData.append(key, userData[key]);
            }
        });
        
        // Handle arrays
        if (userData.languages) {
            userData.languages.forEach(lang => formData.append('languages', lang));
        }
        if (userData.certification_files) {
            userData.certification_files.forEach(file => formData.append('certification_files', file));
        }
        
        return apiRequest('/signup/guide/', {
            method: 'POST',
            body: formData,
        });
    },
    
    logout: async () => {
        return apiRequest('/logout/', {
            method: 'POST',
        });
    },
    
    verifyEmail: async (userId, code) => {
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('verification_code', code);
        
        return apiRequest('/verify-email/', {
            method: 'POST',
            body: formData,
        });
    },
};

/**
 * Tour API
 */
const TourAPI = {
    getAllTours: async () => {
        // This would need to be implemented in backend
        return apiRequest('/tours/', {
            method: 'GET',
        });
    },
    
    getTour: async (tourId) => {
        return apiRequest(`/tours/${tourId}/`, {
            method: 'GET',
        });
    },
    
    createTour: async (guideId, tourData) => {
        const formData = new FormData();
        Object.keys(tourData).forEach(key => {
            if (key !== 'photos') {
                formData.append(key, tourData[key]);
            }
        });
        
        if (tourData.photos) {
            tourData.photos.forEach(photo => formData.append('photos', photo));
        }
        
        return apiRequest(`/guide/${guideId}/tours/create/`, {
            method: 'POST',
            body: formData,
        });
    },
};

/**
 * Reservation API
 */
const ReservationAPI = {
    create: async (tourId, touristId, numberOfPeople) => {
        const formData = new FormData();
        formData.append('tour_id', tourId);
        formData.append('tourist_id', touristId);
        formData.append('number_of_people', numberOfPeople);
        
        return apiRequest('/reservations/create/', {
            method: 'POST',
            body: formData,
        });
    },
    
    getTouristReservations: async (touristId) => {
        return apiRequest(`/tourist/${touristId}/reservations/`, {
            method: 'GET',
        });
    },
    
    cancel: async (reservationId, userId) => {
        const formData = new FormData();
        formData.append('user_id', userId);
        
        return apiRequest(`/reservations/${reservationId}/cancel/`, {
            method: 'POST',
            body: formData,
        });
    },
};

/**
 * Guide API
 */
const GuideAPI = {
    getProfile: async (guideId) => {
        return apiRequest(`/guide/${guideId}/profile/`, {
            method: 'GET',
        });
    },
    
    updateProfile: async (guideId, profileData) => {
        return apiRequest(`/guide/${guideId}/update-profile/`, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },
    
    getDashboard: async (guideId) => {
        return apiRequest(`/guide/${guideId}/dashboard/`, {
            method: 'GET',
        });
    },
    
    getTours: async (guideId) => {
        return apiRequest(`/guide/${guideId}/tours/`, {
            method: 'GET',
        });
    },
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiRequest, AuthAPI, TourAPI, ReservationAPI, GuideAPI };
}




