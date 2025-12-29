import React, { useState } from "react";
import {
  ChevronLeft,
  Phone,
  MapPin,
  DollarSign,
  User,
  Star,
  MessageCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Main Component
const MyGuideTours = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("custom");
  const [activeHistoryTab, setActiveHistoryTab] = useState("custom");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const stats = [
    { label: "Upcoming visits", value: "1" },
    { label: "Completed tours", value: "7" },
    { label: "Pending requests", value: "1" },
    { label: "Upcoming visits", value: "4.3", hasRating: true },
  ];

  const pendingRequest = {
    name: "Sami Kertout",
    phone: "+213 0655 70 33 61",
    location: "Alger",
    message:
      "Hello, I will be traveling to Algiers and would like to request a customized tour. My main interests are history, culture, and authentic local experiences. Could you please design an itinerary that includes: * A guided visit to the Casbah of Algiers (UNESCO World Heritage site) * Exploration of Ottoman and colonial landmarks * A stop at Notre Dame d'Afrique for panoramic views of the city and the bay * Time to enjoy traditional Algerian cuisine in a local restaurant",
    date: "09/12/2025",
    duration: "6h",
    departureTime: "10:00h",
    peoples: "6",
  };

  const tourHistory = [
    {
      name: "Kheloudja Berkani",
      phone: "+213 523 70 06 54",
      location: "Tipaza",
      price: "6 000 DZD",
      date: "05/06/2025",
      duration: "5h",
      departureTime: "08:00h",
      peoples: "10",
      status: "Completed",
    },
    {
      name: "Salima Hammadou",
      phone: "+213 523 70 90 88",
      location: "Tipaza",
      price: "6 000 DZD",
      date: "05/05/2025",
      duration: "6h",
      departureTime: "10:00h",
      peoples: "6",
      status: "Declined",
      reason:
        "Thank you for your request. Unfortunately, I'm not available on the date you selected. However, I can offer the tour on December 20th at 9:00 AM if that works for you.",
    },
    {
      name: "Kaci abdrahman",
      phone: "+213 523 70 90 88",
      location: "alger",
      price: "6 000 DZD",
      date: "05/04/2025",
      duration: "7h",
      departureTime: "09:00h",
      peoples: "12",
      status: "Completed",
    },
    {
      name: "Salima Hammadou",
      phone: "+213 523 70 90 88",
      location: "Tipaza",
      price: "6 000 DZD",
      date: "05/05/2025",
      duration: "6h",
      departureTime: "10:00h",
      peoples: "6",
      status: "Completed",
    },
    {
      name: "Salima Hammadou",
      phone: "+213 523 70 90 88",
      location: "Tipaza",
      price: "6 000 DZD",
      date: "05/05/2025",
      duration: "6h",
      departureTime: "10:00h",
      peoples: "6",
      status: "Completed",
    },
  ];

  const publicTours = [
    {
      title: "Visit of the Casbah of Algiers - UNESCO Heritage",
      date: "10/01/2026",
      duration: "09:00h",
      peoples: "80",
      status: "pending",
      participants: [
        "Kamel BenKaci (5)",
        "Alicia Saich (10)",
        "Sophia xxxxx (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
      ],
    },
    {
      title: "Roman Tipaza and Mediterranean Coastline",
      date: "10/6/2025",
      duration: "09:00h",
      peoples: "100",
      status: "completed",
      participants: [
        "Kamel BenKaci (5)",
        "Alicia Saich (10)",
        "Sophia xxxxx (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
      ],
    },
    {
      title: "Tipaza Romaine et Littoral",
      date: "05/04/2025",
      duration: "09:00h",
      peoples: "77",
      status: "completed",
      participants: [
        "Kamel BenKaci (5)",
        "Alicia Saich (10)",
        "Sophia xxxxx (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
      ],
    },
    {
      title: "Visit of the Casbah of Algiers - UNESCO Heritage",
      date: "10/01/2025",
      duration: "09:00h",
      peoples: "60",
      status: "completed",
      participants: [
        "Kamel BenKaci (5)",
        "Alicia Saich (10)",
        "Sophia xxxxx (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
        "Kamel BenKaci (5)",
      ],
    },
  ];

  const handleDeclineClick = () => {
    setShowDeclineModal(true);
  };

  const handleCancelDecline = () => {
    setShowDeclineModal(false);
    setDeclineReason("");
  };

  const handleConfirmDecline = () => {
    // Here you would typically send the decline reason to your backend
    console.log("Declining request with reason:", declineReason);
    // You can add your API call here
    // For now, just close the modal
    setShowDeclineModal(false);
    setDeclineReason("");
    // You might want to show a success message or update the UI
  };

  const handleAccept = () => {
    // Handle accept logic here
    console.log("Accepting request");
    // Add your API call here
  };

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* REMOVED: <Header /> - This is now provided by ProfileLayout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">My Guide Profile</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-gray-500 text-sm mb-2">{stat.label}</div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{stat.value}</span>
                {stat.hasRating && (
                  <Star size={20} fill="#FFA500" color="#FFA500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Tab Buttons - Centered */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("custom")}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === "custom"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Custom Tour
              </button>
              <button
                onClick={() => setActiveTab("public")}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === "public"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Public Tour
              </button>
            </div>
          </div>

          {/* Custom Tour Content */}
          {activeTab === "custom" && (
            <>
              {/* Pending Custom Requests */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">
                  Pending Custom Requests
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Respond within 24 hours to maintain your response rate
                </p>

                <div className="border border-gray-200 rounded-lg p-6 relative">
                  <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                    pending
                  </span>

                  <div className="flex items-start gap-2 mb-2">
                    <User size={18} className="text-gray-600 mt-1" />
                    <span className="font-bold">{pendingRequest.name}</span>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <Phone size={18} className="text-gray-600 mt-1" />
                    <span className="text-gray-700">
                      {pendingRequest.phone}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin size={18} className="text-gray-600 mt-1" />
                    <span className="text-gray-700">
                      {pendingRequest.location}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 mb-4 whitespace-pre-line">
                    {pendingRequest.message}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <div className="font-medium">{pendingRequest.date}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <div className="font-medium">
                        {pendingRequest.duration}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Departure Time:</span>
                      <div className="font-medium">
                        {pendingRequest.departureTime}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Peoples:</span>
                      <div className="font-medium">
                        {pendingRequest.peoples}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="font-bold mb-2">Departure Location</div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin size={16} />
                      <span>
                        hotel in Algiers city center (within the main urban
                        area)
                      </span>
                    </div>
                  </div>

                  {/* SMALLER ACCEPT/DECLINE BUTTONS */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAccept}
                      className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 font-medium text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={handleDeclineClick}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 font-medium text-sm"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>

              {/* Tour History */}
              <div>
                <h2 className="text-xl font-bold mb-2">Tour History</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Completed Tours with Participants
                </p>

                <div className="space-y-4">
                  {tourHistory.map((tour, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 relative bg-orange-50/30"
                    >
                      <span
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                          tour.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tour.status}
                      </span>

                      <div className="flex items-start gap-2 mb-2">
                        <User size={18} className="text-gray-600 mt-1" />
                        <span className="font-bold">{tour.name}</span>
                      </div>
                      <div className="flex items-start gap-2 mb-2">
                        <Phone size={18} className="text-gray-600 mt-1" />
                        <span className="text-gray-700">{tour.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin size={18} className="text-gray-600 mt-1" />
                        <span className="text-gray-700">{tour.location}</span>
                      </div>
                      <div className="flex items-start gap-2 mb-4">
                        <DollarSign size={18} className="text-gray-600 mt-1" />
                        <span className="text-gray-700">{tour.price}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <div className="font-medium">{tour.date}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <div className="font-medium">{tour.duration}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Departure Time:</span>
                          <div className="font-medium">
                            {tour.departureTime}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Peoples:</span>
                          <div className="font-medium">{tour.peoples}</div>
                        </div>
                      </div>

                      {tour.reason && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex gap-2 items-start">
                            <MessageCircle
                              size={18}
                              className="text-red-600 mt-1"
                            />
                            <div>
                              <div className="font-bold text-red-900 mb-1">
                                Decline reason:
                              </div>
                              <div className="text-sm text-red-800">
                                {tour.reason}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Public Tour Content */}
          {activeTab === "public" && (
            <div>
              <h2 className="text-xl font-bold mb-2">Tour History</h2>
              <p className="text-sm text-gray-600 mb-6">
                Completed Tours with Participants
              </p>

              <div className="space-y-6">
                {publicTours.map((tour, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 bg-orange-50/30"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold">{tour.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tour.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tour.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <div className="font-medium">{tour.date}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-medium">{tour.duration}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Peoples:</span>
                        <div className="font-medium">{tour.peoples}</div>
                      </div>
                    </div>

                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Participants List :
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tour.participants.map((participant, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-orange-50 rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Rejection Reason
            </h2>
            <p className="text-gray-600 text-center mb-6">
              optional: You can state your reason for refusing in order to find
              another arrangement.
            </p>

            <div className="bg-white rounded-lg p-6">
              <label className="block text-lg font-bold mb-3">
                Rejection reasons
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Ex: hour Availability...."
                className="w-full border border-gray-300 rounded-lg p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCancelDecline}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDecline}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGuideTours;
