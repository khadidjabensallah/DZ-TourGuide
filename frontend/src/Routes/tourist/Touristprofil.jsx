import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Star,
    MapPin,
    Clock,
    Users,
    DollarSign,
    Calendar,
    Camera,
    Edit,
    Save,
    X,
    User,
    Mail,
    AlertCircle,
} from "lucide-react";
import TouristHeader from "../../Layout/TouristHeader";
import { ReservationAPI, ReviewAPI, ReportAPI } from "../../utils/api";
import { useTranslation } from "react-i18next";


const TouristProfile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("history");
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profileImage: null,
        userId: null
    });

    const [tempProfileData, setTempProfileData] = useState({ ...profileData });
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [stats, setStats] = useState({
        totalTours: 0,
        completedTours: 0,
        pendingRequests: 0,
        refusedRequests: 0,
    });

    // Review/Report States
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedRes, setSelectedRes] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [reportForm, setReportForm] = useState({ title: "", description: "" });
    const [submitting, setSubmitting] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [modalSuccess, setModalSuccess] = useState(false);

    // Load profile from sessionStorage
    useEffect(() => {
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            const data = {
                firstName: user.firstname || user.name?.split(" ")[0] || "Tourist",
                lastName: user.lastname || user.name?.split(" ").slice(1).join(" ") || "",
                email: user.email || "",
                profileImage: user.photo_url || null,
                userId: user.user_id || user.userId
            };
            setProfileData(data);
            setTempProfileData(data);
        }
    }, []);

    // Fetch reservations from API
    useEffect(() => {
        const fetchReservations = async () => {
            const userStr = sessionStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const touristId = user.user_id || user.userId;

            if (!touristId) return;

            try {
                setLoading(true);
                const response = await ReservationAPI.getTouristReservations(touristId);
                if (response.success) {
                    setReservations(response.data);

                    // Calculate stats
                    const completed = response.data.filter(r => r.is_completed).length;
                    const pending = response.data.filter(r => !r.is_completed && !r.is_past).length;

                    setStats({
                        totalTours: response.data.length,
                        completedTours: completed,
                        pendingRequests: pending,
                        refusedRequests: 0, // Backend doesn't seem to track 'refused' separately for now
                    });
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error("Failed to fetch reservations:", err);
                setError(t('profile.loadHistoryError') || "Could not load your tour history.");
            } finally {

                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const StatusBadge = ({ status }) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700",
            completed: "bg-green-100 text-green-700",
            declined: "bg-red-100 text-red-700",
        };
        return (
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const TourTypeBadge = ({ type }) => {
        const color =
            type === "Custom Tour"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700";
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                {type === "Custom Tour" ? t('profile.customTour') : t('profile.regularTour')}
            </span>
        );

    };

    const handleEditClick = () => {
        setTempProfileData({ ...profileData });
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setProfileData({ ...tempProfileData });
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTempProfileData({
                    ...tempProfileData,
                    profileImage: e.target.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = () => {
        return (
            (tempProfileData.firstName?.[0] || "") +
            (tempProfileData.lastName?.[0] || "")
        );
    };

    // Function to handle edit navigation
    const handleEditCustomTour = (tourId) => {
        navigate(`/CustomTourEdit/${tourId}`);
    };

    // Function to handle back navigation
    const handleBackClick = () => {
        navigate(-1); // Go back to previous page
    };

    const handleOpenReview = (res) => {
        setSelectedRes(res);
        setReviewForm({ rating: 5, comment: "" });
        setModalError(null);
        setModalSuccess(false);
        setShowReviewModal(true);
    };

    const handleOpenReport = (res) => {
        setSelectedRes(res);
        setReportForm({ title: "", description: "" });
        setModalError(null);
        setModalSuccess(false);
        setShowReportModal(true);
    };

    const handleSubmitReview = async () => {
        if (!reviewForm.comment) {
            setModalError(t('profile.enterCommentError') || "Please enter a comment.");
            return;
        }

        setSubmitting(true);
        setModalError(null);
        try {
            const response = await ReviewAPI.create({
                tour_id: selectedRes.tour.id,
                tourist_id: profileData.userId,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            if (response.success) {
                setModalSuccess(true);
                setTimeout(() => {
                    setShowReviewModal(false);
                    setModalSuccess(false);
                }, 2000);
            } else {
                setModalError(response.message || t('profile.submitReviewError') || "Failed to submit review.");
            }
        } catch (err) {
            console.error("Review submission failed:", err);
            setModalError(t('common.errorOccurred') || "An error occurred. Please try again.");
        } finally {

            setSubmitting(false);
        }
    };

    const handleSubmitReport = async () => {
        if (!reportForm.title || !reportForm.description) {
            setModalError(t('profile.fillFieldsError') || "Please fill in all fields.");
            return;
        }

        setSubmitting(true);
        setModalError(null);
        try {
            const response = await ReportAPI.create({
                guide_id: selectedRes.guide.id,
                tourist_id: profileData.userId,
                tour_id: selectedRes.tour.id,
                title: reportForm.title,
                description: reportForm.description
            });
            if (response.success) {
                setModalSuccess(true);
                setTimeout(() => {
                    setShowReportModal(false);
                    setModalSuccess(false);
                }, 2000);
            } else {
                setModalError(response.message || t('profile.submitReportError') || "Failed to submit report.");
            }
        } catch (err) {
            console.error("Report submission failed:", err);
            setModalError(t('common.errorOccurred') || "An error occurred. Please try again.");
        } finally {

            setSubmitting(false);
        }
    };

    const ProfileSection = () => (
        <div className="max-w-4xl mx-auto p-6">
            {isEditing ? (
                // Edit Mode - Smaller Card
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Edit Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold text-gray-800">{t('profile.editProfile')}</h1>
                    </div>


                    {/* Edit Content - Compact */}
                    <div className="flex flex-col items-center">
                        {/* Profile Picture */}
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                                {tempProfileData.profileImage ? (
                                    <img
                                        src={tempProfileData.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    getInitials() || "JD"
                                )}
                            </div>

                            <label
                                htmlFor="profileImageUpload"
                                className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full shadow cursor-pointer hover:bg-orange-600 text-white"
                            >
                                <Camera className="w-4 h-4" />
                                <input
                                    type="file"
                                    id="profileImageUpload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>

                        {/* Edit Form */}
                        <div className="w-full space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('auth.firstName')}
                                </label>

                                <input
                                    type="text"
                                    value={tempProfileData.firstName}
                                    onChange={(e) =>
                                        setTempProfileData({
                                            ...tempProfileData,
                                            firstName: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 focus:outline-none text-sm"
                                    placeholder={t('auth.firstNamePlaceholder')}
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('auth.familyName')}
                                </label>

                                <input
                                    type="text"
                                    value={tempProfileData.lastName}
                                    onChange={(e) =>
                                        setTempProfileData({
                                            ...tempProfileData,
                                            lastName: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 focus:outline-none text-sm"
                                    placeholder={t('auth.familyNamePlaceholder')}
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('auth.email')}
                                </label>

                                <input
                                    type="email"
                                    value={tempProfileData.email}
                                    onChange={(e) =>
                                        setTempProfileData({
                                            ...tempProfileData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 focus:outline-none text-sm"
                                    placeholder={t('auth.emailPlaceholder')}
                                />
                            </div>


                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={handleSaveClick}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                                >
                                    {t('common.save')}
                                </button>

                                <button
                                    onClick={handleCancelClick}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                                >
                                    {t('common.cancel')}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // View Mode - Original Layout
                <div className="bg-white rounded-lg shadow p-8">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {profileData.profileImage ? (
                                <img
                                    src={profileData.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                getInitials() || "JD"
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {profileData.firstName} {profileData.lastName}
                                    </h2>
                                    <p className="text-gray-500 mt-1">Tourist</p>
                                </div>
                                <button
                                    onClick={handleEditClick}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>{t('profile.editProfile')}</span>
                                </button>

                            </div>

                            {/* Email Information */}
                            <div className="mt-4">
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">{profileData.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-50/30">
            <TouristHeader activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content */}
            {activeTab === "profile" ? (
                <ProfileSection />
            ) : (
                <div className="max-w-6xl mx-auto p-6">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8">
                        {t('profile.myTourHistory')}
                    </h1>


                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <p className="text-gray-500 text-sm mb-2">{t('profile.totalTours')}</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {stats.totalTours}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <p className="text-gray-500 text-sm mb-2">{t('profile.completedTours')}</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {stats.completedTours}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <p className="text-gray-500 text-sm mb-2">{t('profile.pendingRequests')}</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {stats.pendingRequests}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <p className="text-gray-500 text-sm mb-2">{t('profile.refusedRequests')}</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {stats.refusedRequests}
                            </p>
                        </div>

                    </div>

                    {/* Tour History */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Tour History</h2>

                        {loading ? (
                            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                <p className="text-gray-500">{t('profile.loadingTours')}</p>
                            </div>

                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        ) : reservations.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{t('profile.noToursYet')}</h3>
                                <p className="text-gray-500 mb-6">{t('profile.noToursDesc')}</p>

                                <button
                                    onClick={() => navigate("/")}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    {t('profile.exploreTours')}
                                </button>

                            </div>
                        ) : (
                            reservations.map((res) => (
                                <div key={res.id} className="bg-white rounded-lg shadow-sm p-6 overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {res.guide.photo_url ? (
                                                    <img src={res.guide.photo_url} alt={res.guide.name} className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    res.guide.name[0]
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">
                                                    {res.tour.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {t('profile.guide')}: {res.guide.name}
                                                </p>

                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <StatusBadge status={res.is_completed ? "completed" : (res.is_past ? "declined" : "pending")} />
                                        </div>
                                    </div>

                                    {/* Tour Details */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">{t('hero.location')}:</p>
                                                <p className="text-sm font-medium">{res.tour.wilaya}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">{t('hero.selectDate')}:</p>
                                                <p className="text-sm font-medium">
                                                    {res.tour.scheduled_date} {res.tour.scheduled_time && `${t('profile.at')} ${res.tour.scheduled_time}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">{t('profile.duration')}:</p>
                                                <p className="text-sm font-medium">{res.tour.estimated_duration}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">{t('tourDetails.numberOfPeople')}:</p>
                                                <p className="text-sm font-medium">{res.number_of_people}</p>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 text-orange-500" />
                                            <p className="text-lg font-bold text-gray-900">{res.final_price} DZD</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {res.is_completed && (
                                                <button
                                                    onClick={() => handleOpenReview(res)}
                                                    className="px-4 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    {t('tourDetails.leaveReview')}
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleOpenReport(res)}
                                                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                {t('profile.reportIssue')}
                                            </button>

                                            <button
                                                onClick={() => navigate(`/tour/${res.tour.id}`)}
                                                className="px-4 py-2 text-orange-500 hover:bg-orange-50 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                {t('profile.viewDetails')}
                                            </button>

                                            {res.can_cancel && (
                                                <button className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                                                    {t('common.cancel')}
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">{t('profile.reviewTour')}</h3>
                            <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">

                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {modalSuccess ? (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Save className="w-8 h-8" />
                                </div>
                                <p className="text-lg font-medium text-gray-800">{t('profile.reviewSubmitted')}</p>
                            </div>

                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('profile.rating')}</label>
                                    <div className="flex gap-2">

                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${star <= reviewForm.rating ? "text-orange-400 fill-orange-400" : "text-gray-300"}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('tourDetails.reviews')}</label>
                                    <textarea

                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[120px]"
                                        placeholder={t('tourDetails.shareExperience')}
                                    />

                                </div>

                                {modalError && (
                                    <p className="text-red-500 text-sm mt-2">{modalError}</p>
                                )}

                                <button
                                    onClick={handleSubmitReview}
                                    disabled={submitting}
                                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                >
                                    {submitting ? t('tourDetails.submitting') : t('tourDetails.submitReview')}
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">{t('profile.reportIssue')}</h3>
                            <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">

                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {modalSuccess ? (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Save className="w-8 h-8" />
                                </div>
                                <p className="text-lg font-medium text-gray-800">{t('profile.reportSubmitted')}</p>
                            </div>

                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('profile.issueTitle')}</label>
                                    <input

                                        type="text"
                                        value={reportForm.title}
                                        onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder={t('profile.issuePlaceholder')}
                                    />

                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('tourDetails.description')}</label>
                                    <textarea

                                        value={reportForm.description}
                                        onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[120px]"
                                        placeholder={t('profile.descriptionPlaceholder')}
                                    />

                                </div>

                                {modalError && (
                                    <p className="text-red-500 text-sm mt-2">{modalError}</p>
                                )}

                                <button
                                    onClick={handleSubmitReport}
                                    disabled={submitting}
                                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                >
                                    {submitting ? t('tourDetails.submitting') : t('profile.submitReport')}
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TouristProfile;