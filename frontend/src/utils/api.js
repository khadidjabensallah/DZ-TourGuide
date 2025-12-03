/**
 * API Utility for React Frontend
 * Handles all API calls to Django backend
 */

const API_BASE_URL = '/api'; // Vite proxy will forward to Django

/**
 * Make API request with error handling
 */
export async function apiRequest(endpoint, options = {}) {
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
    
    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    
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
export const AuthAPI = {
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
        
        // Add basic fields
        if (userData.firstname) formData.append('firstname', userData.firstname);
        if (userData.lastname) formData.append('lastname', userData.lastname);
        if (userData.email) formData.append('email', userData.email);
        if (userData.password) formData.append('password', userData.password);
        if (userData.phone) formData.append('phone', userData.phone);
        if (userData.biography) formData.append('biography', userData.biography);
        
        // Handle pricing
        if (userData.half_day_price) formData.append('half_day_price', userData.half_day_price);
        if (userData.full_day_price) formData.append('full_day_price', userData.full_day_price);
        if (userData.additional_hour_price) formData.append('additional_hour_price', userData.additional_hour_price);
        if (userData.custom_request_markup) formData.append('custom_request_markup', userData.custom_request_markup);
        
        // Handle arrays - languages
        if (userData.languages && Array.isArray(userData.languages)) {
            userData.languages.forEach(lang => formData.append('languages', lang));
        }
        
        // Handle arrays - coverage_wilayas (send as names, backend will convert)
        if (userData.coverage_wilayas && Array.isArray(userData.coverage_wilayas)) {
            userData.coverage_wilayas.forEach(wilaya => formData.append('coverage_wilayas', wilaya));
        }
        
        // Handle files - certification_files
        if (userData.certification_files && Array.isArray(userData.certification_files)) {
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
    
    resendVerificationCode: async () => {
        return apiRequest('/resend-verification/', {
            method: 'POST',
        });
    },
};

/**
 * Tour API
 */
export const TourAPI = {
    getAllTours: async () => {
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
export const ReservationAPI = {
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
export const GuideAPI = {
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

