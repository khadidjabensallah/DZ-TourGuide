import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  User,
  Phone,
  MapPin,
  DollarSign,
  MessageCircle,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Trash2
} from "lucide-react";
import GuideHeader from "../../Layout/GuideHeader";
import { GuideAPI, PersonalizedTourAPI, TourAPI, ReservationAPI } from "../../utils/api";

const MyGuideTours = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("public"); // 'public', 'custom', 'reservations'
  const [loading, setLoading] = useState(true);
  const [guideId, setGuideId] = useState(null);

  // Data states
  const [stats, setStats] = useState(null);
  const [publicTours, setPublicTours] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [error, setError] = useState(null);

  // Parse query params for initial tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "reservations") setActiveTab("reservations");
    else if (tab === "tours") setActiveTab("public");
    else if (tab === "custom") setActiveTab("custom");
  }, [location.search]);

  const fetchData = useCallback(async (id) => {
    setLoading(true);
    try {
      const [statsRes, toursRes, resRes, customRes] = await Promise.all([
        GuideAPI.getDashboard(id),
        GuideAPI.getTours(id),
        GuideAPI.getReservations(id),
        PersonalizedTourAPI.getGuideRequests(id)
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (toursRes.success) setPublicTours(toursRes.data?.tours || []);
      if (resRes.success) setReservations(resRes.data || []);
      if (customRes.success) setCustomRequests(customRes.data || []);

    } catch (err) {
      console.error("Error fetching guide data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) {
      navigate("/signin");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.user_type !== "guide") {
      navigate("/");
      return;
    }
    setGuideId(user.user_id);
    fetchData(user.user_id);
  }, [navigate, fetchData]);

  const handleRespondRequest = async (requestId, action, reason = "") => {
    try {
      const response = await PersonalizedTourAPI.respond(requestId, guideId, action, reason);
      if (response.success) {
        // Refresh data
        fetchData(guideId);
      } else {
        alert(response.message || "Failed to respond to request");
      }
    } catch (err) {
      console.error("Error responding to request:", err);
      alert(err.message || "An error occurred while responding to request");
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation? The places will be restored to the tour.")) {
      return;
    }

    try {
      const response = await ReservationAPI.cancel(reservationId, guideId);
      if (response.success) {
        // Refresh data
        fetchData(guideId);
      } else {
        alert(response.message || "Failed to cancel reservation");
      }
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      alert(err.message || "An error occurred while cancelling reservation");
    }
  };

  const handleCompleteReservation = async (reservationId) => {
    try {
      const response = await GuideAPI.completeReservation(reservationId, guideId);
      if (response.success) {
        fetchData(guideId);
      } else {
        alert(response.message || "Failed to complete reservation");
      }
    } catch (err) {
      console.error("Error completing reservation:", err);
      alert(err.message || "An error occurred while completing reservation");
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await TourAPI.deleteTour(guideId, tourId);
      if (response.success) {
        setPublicTours(prev => prev.filter(t => t.id !== tourId));
        // Also update stats if needed
        fetchData(guideId);
      } else {
        alert(response.message || "Failed to delete tour");
      }
    } catch (err) {
      console.error("Error deleting tour:", err);
      alert(err.message || "An error occurred while deleting the tour");
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-orange-50/30 flex items-center justify-center">
        <div className="text-xl font-medium text-orange-500 animate-pulse">Loading your dashboard...</div>
      </div>
    );
  }

  const statItems = [
    { label: "Upcoming visits", value: stats?.upcoming_reservations || "0" },
    { label: "Completed tours", value: stats?.completed_reservations || "0" },
    { label: "Pending requests", value: customRequests.filter(r => r.status === 'pending').length || "0" },
    { label: "Average Rating", value: stats?.average_rating || "0.0", hasRating: true },
  ];

  return (
    <div className="min-h-screen bg-orange-50/30">
      <GuideHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Guide Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {statItems.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
              <div className="text-gray-500 text-sm mb-2">{stat.label}</div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                {stat.hasRating && (
                  <Star size={20} fill="#FFA500" color="#FFA500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("public")}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === "public" ? "text-orange-600 bg-orange-50/50 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              My Public Tours
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === "reservations" ? "text-orange-600 bg-orange-50/50 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              Public Reservations
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === "custom" ? "text-orange-600 bg-orange-50/50 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              Personalized Requests
            </button>
          </div>

          <div className="p-6">
            {/* My Public Tours Content */}
            {activeTab === "public" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Your Catalog</h2>
                  <button
                    onClick={() => navigate("/createtour")}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm"
                  >
                    Create New Tour
                  </button>
                </div>

                {/* Ensure publicTours is an array before checking length */}
                {!publicTours || publicTours.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">You haven't created any tours yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {publicTours.map((tour) => (
                      <div key={tour.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={tour.cover_photo || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"}
                            alt={tour.title}
                            className="w-full h-full object-cover"
                          />
                          {!tour.is_active && (
                            <div className="absolute top-2 right-2 bg-gray-800/80 text-white px-3 py-1 rounded-full text-xs">
                              Inactive
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 line-clamp-1">{tour.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1"><MapPin size={14} />{tour.wilaya}</span>
                            <span className="flex items-center gap-1"><Clock size={14} />{tour.estimated_duration}h</span>
                            {tour.scheduled_time && (
                              <span className="text-orange-600 font-medium">Starts: {tour.scheduled_time.substring(0, 5)}</span>
                            )}
                            <span className="flex items-center gap-1"><DollarSign size={14} />{tour.calculated_price} DZD</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/tour/${tour.id}`)}
                              className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-600 py-2 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm"
                            >
                              <Eye size={16} /> View
                            </button>
                            <button
                              onClick={() => navigate(`/editTour/${tour.id}`)}
                              className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTour(tour.id)}
                              className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Public Reservations Content */}
            {activeTab === "reservations" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Recent Bookings</h2>
                {reservations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No reservations found for your tours.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((res) => (
                      <div key={res.id} className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row gap-6 relative">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg text-orange-600">{res.tour.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Calendar size={14} /> {res.tour.scheduled_date} at {res.tour.scheduled_time}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${res.is_completed ? "bg-green-100 text-green-700" :
                              res.is_past ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                              }`}>
                              {res.is_completed ? "Completed" : res.is_past ? "Past / Pending" : "Upcoming"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                <img src={res.tourist.photo_url || ""} alt={res.tourist.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-bold text-sm">{res.tourist.name}</div>
                                <div className="text-xs text-gray-500">{res.tourist.email}</div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-center">
                              <span className="text-xs text-gray-500">Participants</span>
                              <span className="font-bold text-sm">{res.number_of_people} People</span>
                            </div>
                            <div className="flex flex-col justify-center">
                              <span className="text-xs text-gray-500">Revenue</span>
                              <span className="font-bold text-sm text-green-600">{res.final_price} DZD</span>
                            </div>
                          </div>
                        </div>

                        {!res.is_completed && res.is_past && (
                          <div className="md:w-48 flex items-center">
                            <button
                              onClick={() => handleCompleteReservation(res.id)}
                              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-bold text-sm shadow-sm"
                            >
                              Mark Completed
                            </button>
                          </div>
                        )}

                        {!res.is_completed && !res.is_past && (
                          <div className="md:w-48 flex items-center">
                            <button
                              onClick={() => handleCancelReservation(res.id)}
                              className="w-full bg-red-100 text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-200 transition-colors font-bold text-sm shadow-sm"
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Personalized Requests Content */}
            {activeTab === "custom" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Customer Requests</h2>
                </div>

                {customRequests.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You haven't received any personalized requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {customRequests.map((req) => (
                      <div key={req.id} className={`border rounded-xl p-6 shadow-sm ${req.status === 'pending' ? 'border-orange-200 bg-orange-50/10' : 'border-gray-200 bg-white'
                        }`}>
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Tourist Info */}
                          <div className="md:w-64 shrink-0">
                            <div className="flex items-center gap-4 mb-4">
                              <img
                                src={req.tourist.photo_url || "https://ui-avatars.com/api/?name=" + req.tourist.name}
                                className="w-12 h-12 rounded-full object-cover"
                                alt={req.tourist.name}
                              />
                              <div>
                                <div className="font-bold text-gray-900">{req.tourist.name}</div>
                                <div className="text-xs text-gray-500 truncate w-32">{req.tourist.email}</div>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2"><Phone size={14} /> {req.tourist.phone}</div>
                              <div className="flex items-center gap-2"><MapPin size={14} /> {req.wilaya || "Anywhere"}</div>
                              <div className="flex items-center gap-2"><Calendar size={14} /> {req.preferred_date}</div>
                              <div className="flex items-center gap-2"><Clock size={14} /> {req.departure_time} ({req.duration_hours}h)</div>
                              <div className="flex items-center gap-2"><User size={14} /> {req.number_of_people} People</div>
                            </div>
                          </div>

                          {/* Request Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-bold text-lg">Custom Request Details</h3>
                              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${req.status === 'pending' ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                                req.status === 'accepted' ? "bg-green-100 text-green-700 border border-green-200" :
                                  "bg-red-100 text-red-700 border border-red-200"
                                }`}>
                                {req.status}
                              </span>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 text-sm text-gray-700 mb-4 whitespace-pre-line shadow-inner min-h-[100px]">
                              {req.description}
                            </div>

                            {req.special_requests && (
                              <div className="mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Special Requests:</span>
                                <p className="text-sm text-gray-600 italic">"{req.special_requests}"</p>
                              </div>
                            )}

                            {req.status === 'pending' && (
                              <div className="flex gap-4">
                                <button
                                  onClick={() => handleRespondRequest(req.id, 'accept')}
                                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition-colors font-bold shadow-sm"
                                >
                                  <CheckCircle size={18} /> Accept Request
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt("Please provide a reason for declining:");
                                    if (reason) handleRespondRequest(req.id, 'reject', reason);
                                  }}
                                  className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition-colors font-bold"
                                >
                                  <XCircle size={18} /> Decline
                                </button>
                              </div>
                            )}

                            {req.status === 'rejected' && req.rejection_reason && (
                              <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-800">
                                <div className="font-bold flex items-center gap-2 mb-1">
                                  <MessageCircle size={16} /> Rejection Reason:
                                </div>
                                {req.rejection_reason}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGuideTours;