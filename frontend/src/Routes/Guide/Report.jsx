import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuideHeader from "../../Layout/GuideHeader";
import { ReportAPI } from "../../utils/api";

export default function GuideReportForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { tour_id, tour_title, guide_id, guide_name } = location.state || {};

    const [reportTitle, setReportTitle] = useState("");
    const [reason, setReason] = useState("");
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [tourName, setTourName] = useState(tour_title || "");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (tour_title) setTourName(tour_title);
    }, [tour_title]);

    const validateForm = () => {
        const newErrors = {};

        if (!reportTitle.trim()) {
            newErrors.reportTitle = "Report title is required";
        }

        if (!reason.trim()) {
            newErrors.reason = "Reason for reporting is required";
        } else if (reason.trim().length < 50) {
            newErrors.reason = `Minimum 50 characters required (${reason.trim().length
                }/50)`;
        }

        if (!visitDate.trim()) {
            newErrors.visitDate = "Visit date is required";
        }

        if (!tourName.trim()) {
            newErrors.tourName = "Tour name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const userStr = sessionStorage.getItem("user");
        if (!userStr) {
            alert("You must be logged in to report a guide.");
            navigate("/signin");
            return;
        }

        const user = JSON.parse(userStr);
        const touristId = user.user_id || user.userId;

        setLoading(true);
        try {
            const reportData = {
                guide_id: guide_id,
                tourist_id: touristId,
                tour_id: tour_id || null,
                title: reportTitle,
                description: reason
            };

            const response = await ReportAPI.create(reportData);
            if (response.success) {
                setShowSuccessModal(true);
            } else {
                setErrors({ submit: response.message || "Failed to submit report" });
            }
        } catch (err) {
            console.error("Report submission error:", err);
            setErrors({ submit: err.message || "An error occurred during submission" });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        setReportTitle("");
        setReason("");
        setVisitDate("");
        setTourName("");
        setErrors({});
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-orange-50">
            <GuideHeader showBackButton={true} />
            <div className="flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-5">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1.5">
                            Report a Guide
                        </h1>
                        <p className="text-sm text-gray-600">
                            Help us maintain quality standards by reporting any issues with your
                            guide.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-5">
                        <div className="space-y-3.5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                                    Report title
                                </label>
                                <input
                                    type="text"
                                    value={reportTitle}
                                    onChange={(e) => {
                                        setReportTitle(e.target.value);
                                        if (errors.reportTitle) {
                                            setErrors({ ...errors, reportTitle: "" });
                                        }
                                    }}
                                    className={`w-full px-3 py-2 text-sm border ${errors.reportTitle ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-gray-50`}
                                    placeholder="Ex: Unprofessional Behavior."
                                />
                                {errors.reportTitle && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.reportTitle}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                                    Reason for reporting
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => {
                                        setReason(e.target.value);
                                        if (errors.reason) {
                                            setErrors({ ...errors, reason: "" });
                                        }
                                    }}
                                    className={`w-full px-3 py-2 text-sm border ${errors.reason ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none bg-gray-50`}
                                    rows="2.5"
                                    placeholder="Ex: Incorrect or misleading information....."
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <p
                                        className={`text-xs ${reason.length >= 50 ? "text-green-600" : "text-gray-500"
                                            }`}
                                    >
                                        {reason.length}/50 minimum characters
                                    </p>
                                </div>
                                {errors.reason && (
                                    <p className="text-xs text-red-500 mt-0.5">{errors.reason}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                                    Visit date
                                </label>
                                <input
                                    type="text"
                                    value={visitDate}
                                    onChange={(e) => {
                                        setVisitDate(e.target.value);
                                        if (errors.visitDate) {
                                            setErrors({ ...errors, visitDate: "" });
                                        }
                                    }}
                                    className={`w-full px-3 py-2 text-sm border ${errors.visitDate ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-gray-50`}
                                    placeholder="jj/mm/aaaa"
                                />
                                {errors.visitDate && (
                                    <p className="text-xs text-red-500 mt-1">{errors.visitDate}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                                    Tour name
                                </label>
                                <input
                                    type="text"
                                    value={tourName}
                                    onChange={(e) => {
                                        setTourName(e.target.value);
                                        if (errors.tourName) {
                                            setErrors({ ...errors, tourName: "" });
                                        }
                                    }}
                                    className={`w-full px-3 py-2 text-sm border ${errors.tourName ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-gray-50`}
                                    placeholder="Ex: casbah alger"
                                />
                                {errors.tourName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tourName}</p>
                                )}
                            </div>

                            {errors.submit && (
                                <p className="text-sm text-red-500 mt-2 text-center font-medium bg-red-50 p-2 rounded">
                                    {errors.submit}
                                </p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-2 px-4 text-sm rounded-lg hover:bg-gray-50 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 text-sm rounded-lg transition duration-200 shadow-lg disabled:bg-orange-300 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        "Submit Report"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-fade-in">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <svg
                                        className="h-6 w-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Report Submitted Successfully
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Thank you for your feedback. We will review your report and take
                                    appropriate action.
                                </p>
                                <button
                                    onClick={handleCloseModal}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}