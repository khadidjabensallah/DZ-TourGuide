import React, { useState } from "react";
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
} from "lucide-react";

const TouristProfile = () => {
  const navigate = useNavigate(); // Make sure useNavigate is called at the top
  const [activeTab, setActiveTab] = useState("history");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profileImage: null,
  });

  const [tempProfileData, setTempProfileData] = useState({ ...profileData });

  const tours = [
    {
      id: 1,
      touristName: "Hamid Benal",
      touristAvatar: "HB",
      reservedDate: "03/11/2025",
      tourType: "Custom Tour",
      status: "pending",
      price: "6 000 DZD",
      date: "09/12/2025",
      duration: "3h",
      departureTime: "10:00h",
      peoples: 6,
      location: "hotel in Algiers city center (within the main urban area)",
      description:
        "Hello, I will be traveling to Algiers and would like to request a custom tour. My main interests are history, culture, and authentic local experiences. Could you please design an itinerary that includes: A guided visit to the Casbah of Algiers (UNESCO World Heritage site), Exploration of Ottoman and colonial landmarks, A stop at Notre-Dame d'Afrique for panoramic views of the city and the bay, Time to enjoy traditional Algerian cuisine in a local restaurant",
    },
    {
      id: 2,
      touristName: "Hamid Benal",
      touristAvatar: "HB",
      reservedDate: "15/11/2025",
      tourType: "public Tour",
      status: "completed",
      tourTitle: "Visit of the Casbah of Algiers – UNESCO Heritage",
      price: "3 500 DZD",
      date: "12/12/2025",
      duration: "7h",
      location: "Alger",
      peoples: 5,
      rating: 4,
      reviewDate: "14/11/2025",
      review:
        "Outstanding tour! Our guide was incredibly knowledgeable, and I deeply respect her for making the museum come alive with fascinating stories about each piece. The pacing was perfect, and he answered all our questions with patience and enthusiasm. Highly recommend this tour for anyone interested in North African culture!",
    },
    {
      id: 3,
      touristName: "Nassima Bouazza",
      touristAvatar: "NB",
      reservedDate: "04/11/2024",
      tourType: "Custom Tour",
      status: "declined",
      price: "6 000 DZD",
      date: "15/11/2024",
      duration: "3h",
      departureTime: "14:00 h",
      peoples: 10,
      location: "hotel in Algiers city center (within the main urban area)",
      description:
        "Hello, We would like to visit the Maqam Echahid (Martyrs' Monument) in the morning to enjoy the panoramic view of Algiers, and then go to the Hamma Botanical Garden for a relaxing walk among the tropical plants. If possible, include historical explanations about the monument and botanical information at the garden.",
      declineReason:
        "Thank you very much for your interest and for this detailed request. Unfortunately, I am not available on 15/11/2024, due to a prior commitment. I suggest the following alternatives: 17/11/2024 at 10:00 h, 20/11/2024 at 14:00 h",
    },
    {
      id: 4,
      touristName: "Nassim Bouazza",
      touristAvatar: "NB",
      reservedDate: "03/10/2024",
      tourType: "public Tour",
      status: "completed",
      tourTitle: "Visit of Constantine Bridge Tour",
      price: "3 500 DZD",
      date: "30/10/2024",
      duration: "3h",
      location: "Constantin",
      peoples: 7,
    },
  ];

  const stats = {
    totalTours: 3,
    completedTours: 2,
    pendingRequests: 1,
    refusedRequests: 1,
  };

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
        {type}
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

  const ProfileSection = () => (
    <div className="max-w-4xl mx-auto p-6">
      {isEditing ? (
        // Edit Mode - Smaller Card
        <div className="bg-white rounded-lg shadow p-6">
          {/* Edit Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
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
                  First Name
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
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
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
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
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
                  placeholder="Enter email address"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveClick}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
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
                  <span>Edit Profile</span>
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              onClick={handleBackClick}
              className="text-gray-600 hover:text-gray-800"
            >
              ← BOTTOM
            </button>
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === "history"
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                History
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      {activeTab === "profile" ? (
        <ProfileSection />
      ) : (
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            My Tour History
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">Total Tours</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalTours}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">Completed tours</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.completedTours}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">Pending requests</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.pendingRequests}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-500 text-sm mb-2">Refused request</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.refusedRequests}
              </p>
            </div>
          </div>

          {/* Tour History */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Tour History</h2>

            {tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                      {tour.touristAvatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {tour.touristName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Reserved: {tour.reservedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TourTypeBadge type={tour.tourType} />
                    <StatusBadge status={tour.status} />
                  </div>
                </div>

                {/* Tour Title (for public tours) */}
                {tour.tourTitle && (
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    {tour.tourTitle}
                  </h4>
                )}

                {/* Tour Details */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {tour.tourTitle ? "Location:" : "Date:"}
                      </p>
                      <p className="text-sm font-medium">
                        {tour.tourTitle ? tour.location : tour.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {tour.tourTitle ? "Date:" : "Duration:"}
                      </p>
                      <p className="text-sm font-medium">
                        {tour.tourTitle ? tour.date : tour.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {tour.tourTitle ? "Price:" : "Departure Time:"}
                      </p>
                      <p className="text-sm font-medium">
                        {tour.tourTitle ? tour.price : tour.departureTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Peoples:</p>
                      <p className="text-sm font-medium">{tour.peoples}</p>
                    </div>
                  </div>
                </div>

                {/* Price for custom tours */}
                {!tour.tourTitle && (
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium">{tour.price}</p>
                  </div>
                )}

                {/* Description */}
                {tour.description && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Hello,
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tour.description}
                    </p>
                  </div>
                )}

                {/* Departure Location */}
                {!tour.tourTitle && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Departure Location
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{tour.location}</span>
                    </div>
                  </div>
                )}

                {/* Review */}
                {tour.rating && (
                  <div className="bg-orange-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(tour.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      You reviewed on {tour.reviewDate}
                    </p>
                    <p className="text-sm text-gray-700">{tour.review}</p>
                  </div>
                )}

                {/* Decline Reason */}
                {tour.declineReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-red-800 mb-2">
                      Decline reason:
                    </p>
                    <p className="text-sm text-red-700">{tour.declineReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-center space-x-3 pt-4 border-t">
                  <button className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center space-x-2">
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                  {tour.status === "completed" && tour.rating ? (
                    <>
                      <button className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center space-x-2">
                        <span>✏️</span>
                        <span>Edit the review</span>
                      </button>
                      <button className="flex-1 px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500">
                        See details
                      </button>
                    </>
                  ) : tour.status === "completed" ? (
                    <>
                      <button className="flex-1 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Leave a Review
                      </button>
                      <button className="flex-1 px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500">
                        See details
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditCustomTour(tour.id)}
                      className="flex-1 px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 flex items-center justify-center space-x-2"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristProfile;
