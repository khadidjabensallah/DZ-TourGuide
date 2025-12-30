import React, { useState } from "react";
import {
    ArrowLeft,
    Phone,
    Calendar,
    Clock,
    Users,
    MapPin,
    MessageSquare,
    Briefcase,
    CheckCircle,
    X,
} from "lucide-react";
import TouristHeader from "../../Layout/TouristHeader";

const EditCustomTourPage = () => {
    // This would come from props or route params in a real app
    const tourId = 1;

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        phone: "+213 0555 70 33 61",
        preferredDate: "09/12/2025",
        departureTime: "10:00",
        duration: "6",
        numberOfPeople: "6",
        wilaya: "16",
        departureLocation:
            "hotel in Algiers city center (within the main urban area)",
        description: `Hello,
I will be traveling to Algiers and would like to request a customized tour. My main interests are history, culture, and authentic local experiences. Could you please design an itinerary that includes:
A guided visit to the Casbah of Algiers (UNESCO World Heritage site)
Exploration of Ottoman and colonial landmarks
A stop at Notre-Dame d'Afrique for panoramic views of the city and the bay
Time to enjoy traditional Algerian cuisine in a local restaurant`,
        specialRequests: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        console.log("Cancel clicked - Navigate back");
        // In real app: navigate(-1) or navigate('/tourist/profile')
        window.history.back(); // This will go to the previous page
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formData);
        console.log("Tour ID:", tourId);
        // In real app:
        // await api.updateTour(tourId, formData);

        // Show success modal
        setShowSuccessModal(true);
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        // Navigate back to profile or previous page
        window.history.back();
        // In real app: navigate('/tourist/profile')
    };

    return (
        <div className="min-h-screen bg-orange-50">
            <TouristHeader />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Edit Custom Tour Request
                    </h1>
                    <p className="text-sm text-gray-600">
                        Update your tour details with Hamid Benali
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    {/* Info Alert */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-5 flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-500 text-xs font-bold">i</span>
                        </div>
                        <div className="text-xs">
                            <span className="text-orange-800">
                                Personalized tours are subject to a{" "}
                            </span>
                            <span className="text-orange-600 font-semibold">+20%</span>
                            <span className="text-orange-800">
                                {" "}
                                compared to standard rates.
                            </span>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-5">
                        <div className="flex items-center space-x-2 mb-3">
                            <Phone className="w-4 h-4 text-gray-700" />
                            <h2 className="text-base font-bold text-gray-900">
                                Contact Information
                            </h2>
                        </div>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="+213 0555 70 33 61"
                        />
                    </div>

                    {/* Tour Details */}
                    <div className="mb-5">
                        <div className="flex items-center space-x-2 mb-3">
                            <Briefcase className="w-4 h-4 text-gray-700" />
                            <h2 className="text-base font-bold text-gray-900">
                                Tour Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Preferred Date */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                    Preferred Date
                                </label>
                                <input
                                    type="text"
                                    name="preferredDate"
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="09/12/2025"
                                />
                            </div>

                            {/* Departure Time */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                    Departure Time
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="departureTime"
                                        value={formData.departureTime}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="10:00"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                                        h
                                    </span>
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                    Duration (hours)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="6"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                                        h
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Minimum 1 hour</p>
                            </div>

                            {/* Number of People */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                    Number of People
                                </label>
                                <input
                                    type="text"
                                    name="numberOfPeople"
                                    value={formData.numberOfPeople}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="6"
                                />
                            </div>

                            {/* Wilaya */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                    Wilaya
                                </label>
                                <input
                                    type="text"
                                    name="wilaya"
                                    value={formData.wilaya}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="16"
                                />
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Wilayas covered by this guide
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Departure Location */}
                    <div className="mb-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Departure Location
                        </h3>
                        <input
                            type="text"
                            name="departureLocation"
                            value={formData.departureLocation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="hotel in Algiers city center (within the main urban area)"
                        />
                    </div>

                    {/* Describe Your Request */}
                    <div className="mb-5">
                        <div className="flex items-center space-x-2 mb-3">
                            <MessageSquare className="w-4 h-4 text-gray-700" />
                            <h2 className="text-base font-bold text-gray-900">
                                Describe Your Request
                            </h2>
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Describe your personalized tour
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe your tour preferences..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Special Requests (optional)
                            </label>
                            <textarea
                                name="specialRequests"
                                value={formData.specialRequests}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                                placeholder="Ex: Need an air-conditioned vehicle, specific dietary requirements ..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            Update Your Request
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        {/* Close button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Success Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Successfully Updated!
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Your custom tour request has been updated. The guide will be
                                notified of the changes.
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleCloseModal}
                            className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            Back to Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditCustomTourPage;