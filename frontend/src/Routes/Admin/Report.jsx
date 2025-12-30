import { AlertTriangle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminAPI } from "../../utils/api";
import AdminHeader from "../../Layout/AdminHeader";

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const user = JSON.parse(sessionStorage.getItem('user'));
                const adminId = user?.user_id;

                const response = await AdminAPI.getReports(adminId);

                if (response.success) {
                    setReports(response.reports);
                } else {
                    if (response.status === 403 || response.error === 'Unauthorized') {
                        setError("You are not authorized to view this page. Please make sure you are logged in as an administrator.");
                    } else {
                        setError(response.message || response.error || "Failed to fetch reports");
                    }
                }
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError(`An error occurred: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            <AdminHeader />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Reports</h1>

                {/* Reports List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600">Loading reports...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
                            {error}
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <p className="text-gray-400 text-lg">No reports found</p>
                        </div>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="bg-white rounded-2xl shadow-lg p-6">
                                {/* Report Type */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">{report.type}</h3>
                                </div>

                                {/* Reporter and Reported User */}
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    {/* Reporter (Tourist) */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Reported By(Tourist)</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">{report.reporter.name[0]}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{report.reporter.name}</p>
                                                <p className="text-xs text-gray-500">{report.reporter.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reported User (Guide) */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Reported User(Guide)</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">{report.reportedUser.name[0]}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{report.reportedUser.name}</p>
                                                <p className="text-xs text-gray-500">{report.reportedUser.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tour */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Tour</p>
                                    <p className="font-semibold text-gray-900">{report.tour}</p>
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Description</p>
                                    <p className="text-gray-700 text-sm leading-relaxed">{report.description}</p>
                                </div>

                                {/* Footer with Date and Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">Reported on   {report.date}</p>

                                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 text-sm font-medium">
                                        <Trash2 className="w-4 h-4" />
                                        Delete Guide
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}