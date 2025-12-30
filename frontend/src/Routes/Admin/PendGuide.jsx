import { FileText, Phone, MapPin, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminAPI } from "../../utils/api";
import AdminHeader from "../../Layout/AdminHeader";

const logo = "./assets/logo.png";

export default function GuideValidation() {
    const [pendingGuides, setPendingGuides] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPendingGuides = async () => {
            try {
                setLoading(true);
                const user = JSON.parse(sessionStorage.getItem('user'));
                const adminId = user?.user_id;

                if (!adminId) {
                    // For now, allow viewing without adminId for dev, or handle error
                    // throw new Error('Unauthorized');
                    console.warn("No admin ID found in session");
                }

                // Use a fallback admin ID if none in session for testing? Or just pass undefined and let backend handle
                const response = await AdminAPI.getPendingGuides(adminId);

                if (!response.success) {
                    throw new Error(response.message || 'Failed to fetch pending guides');
                }

                const formattedGuides = response.pending_guides.map(guide => ({
                    id: guide.guide_id,
                    name: guide.name,
                    email: guide.email,
                    phone: guide.phone,
                    languages: guide.languages || [],
                    wilayas: guide.wilayas?.length || 0,
                    certificates: guide.certifications.map(c => ({ filename: c.split('/').pop(), url: c })) || [],
                    submittedOn: guide.submitted_at
                }));

                setPendingGuides(formattedGuides);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching pending guides:', err);
                setLoading(false);
                setPendingGuides([]);
            }
        };
        fetchPendingGuides();
    }, []);

    // Handle approve action
    const handleApprove = async (guideId) => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const adminId = user?.user_id;

            const response = await AdminAPI.approveGuide(guideId, adminId);

            if (response.success) {
                setPendingGuides(prev => prev.filter(guide => guide.id !== guideId));
                alert('Guide approved successfully!');
            } else {
                throw new Error(response.message || 'Failed to approve guide');
            }
        } catch (err) {
            console.error('Error approving guide:', err);
            alert('Error approving guide. Please try again.');
        }
    };

    // Handle reject action
    const handleReject = async (guideId) => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const adminId = user?.user_id;

            const response = await AdminAPI.rejectGuide(guideId, adminId);

            if (response.success) {
                setPendingGuides(prev => prev.filter(guide => guide.id !== guideId));
                alert('Guide application rejected.');
            } else {
                throw new Error(response.message || 'Failed to reject guide');
            }
        } catch (err) {
            console.error('Error rejecting guide:', err);
            alert('Error rejecting guide. Please try again.');
        }
    };

    // Get initials from name
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            <AdminHeader />

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Pending Guide Applications</h1>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading applications...</p>
                    </div>
                )}

                {/* Applications List */}
                {!loading && (
                    <div className="space-y-6">
                        {pendingGuides.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <p className="text-gray-500 text-lg">No requests at the moment</p>
                            </div>
                        ) : (
                            pendingGuides.map((guide) => (
                                <div key={guide.id} className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-orange-500 font-bold text-2xl">
                                                    {getInitials(guide.name)}
                                                </span>
                                            </div>

                                            {/* Guide Info */}
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.name}</h3>
                                                <p className="text-gray-600 mb-2">{guide.email}</p>

                                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{guide.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Languages className="w-4 h-4" />
                                                        <span>{guide.languages.join(', ')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{guide.wilayas} wilaya{guide.wilayas !== 1 ? 's' : ''}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submission Date */}
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Submitted on</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatDate(guide.submittedOn)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Certificates */}
                                    <div className="mb-4">
                                        {guide.certificates.map((cert, index) => (
                                            <div key={index} className="flex items-center gap-2 py-2">
                                                <FileText className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Professional Certificates</p>
                                                    <p className="text-sm text-gray-600">{cert.filename || `Certificate_${guide.name}.pdf`}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleReject(guide.id)}
                                            className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleApprove(guide.id)}
                                            className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}