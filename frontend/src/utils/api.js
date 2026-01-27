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

        const contentType = response.headers.get('content-type') || '';

        let data = null;

        if (contentType.includes('application/json')) {
            try {
                data = await response.json();
            } catch (err) {
                const text = await response.text();
                const message = text || 'Invalid JSON response from server';
                const parseError = new Error(message);
                parseError.data = text;
                throw parseError;
            }
        } else {
            const text = await response.text();
            if (text) {
                data = { message: text };
            } else {
                data = {};
            }
        }

        if (!response.ok) {
            const errMsg = (data && data.message) ? data.message : `HTTP error! status: ${response.status}`;
            const err = new Error(errMsg);
            err.status = response.status;
            err.data = data;
            throw err;
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

        if (userData.firstname) formData.append('firstname', userData.firstname);
        if (userData.lastname) formData.append('lastname', userData.lastname);
        if (userData.email) formData.append('email', userData.email);
        if (userData.password) formData.append('password', userData.password);
        if (userData.phone) formData.append('phone', userData.phone);
        if (userData.biography) formData.append('biography', userData.biography);

        if (userData.half_day_price) formData.append('half_day_price', userData.half_day_price);
        if (userData.full_day_price) formData.append('full_day_price', userData.full_day_price);
        if (userData.additional_hour_price) formData.append('additional_hour_price', userData.additional_hour_price);
        if (userData.custom_request_markup) formData.append('custom_request_markup', userData.custom_request_markup);

        if (userData.languages && Array.isArray(userData.languages)) {
            userData.languages.forEach(lang => formData.append('languages', lang));
        }

        if (userData.coverage_wilayas && Array.isArray(userData.coverage_wilayas)) {
            userData.coverage_wilayas.forEach(wilaya => formData.append('coverage_wilayas', wilaya));
        }

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

    // ✅ Password reset: request sending reset code to email
    requestPasswordReset: async (email) => {
        const formData = new FormData();
        formData.append('email', email);
        return apiRequest('/forgot-password/', {
            method: 'POST',
            body: formData,
        });
    },

    // Verify the password reset code. Signature: (code, userId)
    verifyPasswordResetCode: async (code, userId = null) => {
        const formData = new FormData();
        formData.append('verification_code', code);
        if (userId) formData.append('user_id', userId);

        // Include email fallback from sessionStorage if present. This helps
        // the backend locate the user when session IDs are missing.
        try {
            const email = sessionStorage.getItem('reset_email');
            if (email) formData.append('email', email);
        } catch (e) {
            // sessionStorage may be unavailable in some test environments
        }

        return apiRequest('/verify-password-reset-code/', {
            method: 'POST',
            body: formData,
        });
    },

    // ✅ Reset password after verification
    resetPassword: async (password, confirmPassword = null) => {
        const formData = new FormData();
        formData.append('password', password);
        if (confirmPassword) formData.append('confirm_password', confirmPassword);
        return apiRequest('/reset-password/', {
            method: 'POST',
            body: formData,
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

        // Add all text fields
        if (tourData.title) formData.append('title', tourData.title);
        if (tourData.description) formData.append('description', tourData.description);
        if (tourData.date) formData.append('date', tourData.date);
        if (tourData.itinerary) formData.append('itinerary', tourData.itinerary);
        if (tourData.highlights) formData.append('highlights', tourData.highlights);
        if (tourData.whats_included) formData.append('whats_included', tourData.whats_included);
        if (tourData.whats_excluded) formData.append('whats_excluded', tourData.whats_excluded);
        if (tourData.estimated_duration) formData.append('estimated_duration', tourData.estimated_duration);
        if (tourData.wilaya_code) formData.append('wilaya_code', tourData.wilaya_code);
        if (tourData.starting_point) formData.append('starting_point', tourData.starting_point);
        if (tourData.latitude) formData.append('latitude', tourData.latitude);
        if (tourData.longitude) formData.append('longitude', tourData.longitude);
        if (tourData.available_places) formData.append('available_places', tourData.available_places);

        // Add photos
        if (tourData.photos && Array.isArray(tourData.photos)) {
            tourData.photos.forEach(photo => {
                if (photo instanceof File) {
                    formData.append('photos', photo);
                }
            });
        }

        return apiRequest(`/guide/${guideId}/tours/create/`, {
            method: 'POST',
            body: formData,
        });
    },

    updateTour: async (guideId, tourId, tourData) => {
        // Backend accepts both PUT with JSON and POST with form data
        const formData = new FormData();

        if (tourData.title !== undefined) formData.append('title', tourData.title);
        if (tourData.description !== undefined) formData.append('description', tourData.description);
        if (tourData.itinerary !== undefined) formData.append('itinerary', tourData.itinerary);
        if (tourData.highlights !== undefined) formData.append('highlights', tourData.highlights);
        if (tourData.whats_included !== undefined) formData.append('whats_included', tourData.whats_included);
        if (tourData.whats_excluded !== undefined) formData.append('whats_excluded', tourData.whats_excluded);
        if (tourData.estimated_duration !== undefined) formData.append('estimated_duration', tourData.estimated_duration);
        if (tourData.max_places !== undefined) formData.append('max_places', tourData.max_places);
        if (tourData.available_places !== undefined) formData.append('available_places', tourData.available_places);
        if (tourData.is_active !== undefined) formData.append('is_active', tourData.is_active);
        if (tourData.date !== undefined) formData.append('date', tourData.date);
        if (tourData.scheduled_time !== undefined) formData.append('scheduled_time', tourData.scheduled_time);
        if (tourData.wilaya_code !== undefined) formData.append('wilaya_code', tourData.wilaya_code);
        if (tourData.starting_point !== undefined) formData.append('starting_point', tourData.starting_point);
        if (tourData.latitude !== undefined) formData.append('latitude', tourData.latitude);
        if (tourData.longitude !== undefined) formData.append('longitude', tourData.longitude);


        // Photos
        if (tourData.photos && Array.isArray(tourData.photos)) {
            tourData.photos.forEach(photo => {
                if (photo instanceof File) {
                    formData.append('photos', photo);
                }
            });
        }

        return apiRequest(`/guide/${guideId}/tours/${tourId}/update/`, {
            method: 'POST',
            body: formData,
        });
    },

    deleteTour: async (guideId, tourId) => {
        return apiRequest(`/guide/${guideId}/tours/${tourId}/delete/`, {
            method: 'POST',
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

    updateCoverageZones: async (guideId, wilayaCodes) => {
        const formData = new FormData();
        wilayaCodes.forEach(code => {
            formData.append('wilaya_codes', code);
        });

        return apiRequest(`/guide/${guideId}/update-coverage-zones/`, {
            method: 'POST',
            body: formData,
        });
    },

    uploadPhoto: async (guideId, photoFile) => {
        const formData = new FormData();
        formData.append('photo', photoFile);

        return apiRequest(`/guide/${guideId}/upload-photo/`, {
            method: 'POST',
            body: formData,
        });
    },

    uploadCertification: async (guideId, certFile) => {
        const formData = new FormData();
        formData.append('certification', certFile);

        return apiRequest(`/guide/${guideId}/upload-certification/`, {
            method: 'POST',
            body: formData,
        });
    },

    deleteCertification: async (guideId, filePath) => {
        return apiRequest(`/guide/${guideId}/delete-certification/`, {
            method: 'POST',
            body: JSON.stringify({ file_path: filePath }),
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

    getReviews: async (guideId) => {
        return apiRequest(`/guide/${guideId}/reviews/`, {
            method: 'GET',
        });
    },

    getReservations: async (guideId) => {
        return apiRequest(`/guide/${guideId}/reservations/`, {
            method: 'GET',
        });
    },

    completeReservation: async (reservationId, guideId) => {
        const formData = new FormData();
        formData.append('guide_id', guideId);

        return apiRequest(`/guide/${guideId}/reservations/${reservationId}/update/`, {
            method: 'POST',
            body: formData,
        });
    },
};

/**
 * Search API
 * Matches backend search_views.py parameters exactly
 */
export const SearchAPI = {
    searchTours: async (params = {}) => {
        // Build query string from params matching backend API
        // Backend accepts: q, wilaya, language, guide, min_rating, max_price, date_from, date_to
        const queryParams = new URLSearchParams();

        if (params.q) queryParams.append('q', params.q);
        if (params.wilaya) queryParams.append('wilaya', params.wilaya);
        if (params.language) queryParams.append('language', params.language);
        if (params.guide) queryParams.append('guide', params.guide);
        if (params.min_rating) queryParams.append('min_rating', params.min_rating);
        if (params.max_price) queryParams.append('max_price', params.max_price);
        if (params.date_from) queryParams.append('date_from', params.date_from);
        if (params.date_to) queryParams.append('date_to', params.date_to);
        // Note: Backend doesn't support duration parameter, filter client-side

        const queryString = queryParams.toString();
        const endpoint = `/search/${queryString ? `?${queryString}` : ''}`;

        return apiRequest(endpoint, {
            method: 'GET',
        });
    },

    getSuggestions: async (query) => {
        if (!query || query.length < 2) {
            return { success: true, suggestions: [] };
        }

        return apiRequest(`/search/suggestions/?q=${encodeURIComponent(query)}`, {
            method: 'GET',
        });
    },

    getAvailableFilters: async () => {
        return apiRequest('/search/filters/', {
            method: 'GET',
        });
    },
};

/**
 * Admin API
 */
export const AdminAPI = {
    getAllUsers: async (adminId, userType = '', search = '') => {
        const queryParams = new URLSearchParams({ admin_id: adminId });
        if (userType) queryParams.append('user_type', userType);
        if (search) queryParams.append('search', search);

        return apiRequest(`/admin/api/users/?${queryParams.toString()}`, {
            method: 'GET',
        });
    },

    getPendingGuides: async (adminId) => {
        return apiRequest(`/admin/api/pending-guides/?admin_id=${adminId}`, {
            method: 'GET',
        });
    },

    approveGuide: async (guideId, adminId) => {
        return apiRequest(`/admin/api/guides/${guideId}/approve/`, {
            method: 'POST',
            body: JSON.stringify({ admin_id: adminId }),
        });
    },

    rejectGuide: async (guideId, adminId) => {
        return apiRequest(`/admin/api/guides/${guideId}/reject/`, {
            method: 'POST',
            body: JSON.stringify({ admin_id: adminId }),
        });
    },

    deleteUser: async (userId, adminId) => {
        return apiRequest(`/admin/api/users/${userId}/delete/`, {
            method: 'POST', // Using POST for safety, though DELETE is standard
            body: JSON.stringify({ admin_id: adminId }),
        });
    },

    getReports: async (adminId) => {
        return apiRequest(`/admin/api/reports/?admin_id=${adminId}`, {
            method: 'GET',
        });
    }
};

export const ReviewAPI = {
    create: async (reviewData) => {
        const formData = new FormData();
        Object.keys(reviewData).forEach(key => formData.append(key, reviewData[key]));
        return apiRequest('/reviews/create/', { method: 'POST', body: formData });
    }
};

export const ReportAPI = {
    create: async (reportData) => {
        const formData = new FormData();
        Object.keys(reportData).forEach(key => formData.append(key, reportData[key]));
        return apiRequest('/reports/create/', { method: 'POST', body: formData });
    }
};

export const WeatherAPI = {
    getWeather: async (tourId) => {
        return apiRequest(`/weather/${tourId}/`);
    },
};

/**
 * Personalized Tour Requests API
 */
export const PersonalizedTourAPI = {
    getGuideRequests: async (guideId) => {
        return apiRequest(`/guide/${guideId}/personalized-requests/`, {
            method: 'GET',
        });
    },

    respond: async (requestId, guideId, action, reason = "") => {
        const formData = new FormData();
        formData.append('guide_id', guideId);
        formData.append('action', action);
        if (reason) {
            formData.append('rejection_reason', reason);
        }

        return apiRequest(`/guide/personalized-requests/${requestId}/respond/`, {
            method: 'POST',
            body: formData,
        });
    },

    create: async (requestData) => {
        const formData = new FormData();
        Object.keys(requestData).forEach(key => {
            if (requestData[key] !== null && requestData[key] !== undefined) {
                formData.append(key, requestData[key]);
            }
        });

        return apiRequest('/personalized-requests/create/', {
            method: 'POST',
            body: formData,
        });
    }
};