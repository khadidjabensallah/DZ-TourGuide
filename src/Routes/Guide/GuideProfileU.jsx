import React, { useState } from "react";
import { Star, Clock, MapPin, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sidebar Component
const Sidebar = ({ pricingGrid, coverageZone, certifications }) => {
  return (
    <div className="space-y-6">
      {/* Pricing Grid */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          💰 Pricing Grid
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Half-day</div>
              <div className="text-sm text-gray-500">
                {pricingGrid.halfDay.hours}
              </div>
            </div>
            <div className="text-orange-500 font-bold">
              {pricingGrid.halfDay.price} DZD
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Full-day</div>
              <div className="text-sm text-gray-500">
                {pricingGrid.fullDay.hours}
              </div>
            </div>
            <div className="text-orange-500 font-bold">
              {pricingGrid.fullDay.price} DZD
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Additional hour</div>
              <div className="text-sm text-gray-500">
                {pricingGrid.additionalHour.hours}
              </div>
            </div>
            <div className="text-orange-500 font-bold">
              {pricingGrid.additionalHour.price} DZD
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm text-orange-600">
              Customized tours: -{pricingGrid.customizedDiscount}% of the base
              rate
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Zone */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          🗺️ Coverage Zone
        </h3>
        <div className="flex flex-wrap gap-2">
          {coverageZone.map((zone, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
            >
              {zone}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          🎓 Certifications
        </h3>
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <FileText className="text-gray-500" size={20} />
              <span className="text-sm text-gray-700">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Avis Card Component
const AvisCard = ({ avis }) => {
  return (
    <div className="rounded-lg p-6 hover:shadow-lg transition-shadow bg-stone-50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-bold mb-1">{avis.name}</h4>
          <p className="text-sm text-gray-500">{avis.tour}</p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < avis.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700 mb-4">{avis.comment}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{avis.date}</span>
        </div>
        <span>•</span>
        <span>Published: {avis.publishedDate}</span>
      </div>
    </div>
  );
};

// Tour Card Component
const TourCard = ({ tour, onView }) => {
  return (
    <div
      onClick={() => onView && onView(tour.id)}
      className="cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-blue-50"
    >
      <div className="flex gap-4 p-4">
        <div className="relative w-40 h-40">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-40 h-40 object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold">{tour.rating}</span>
                <Star className="fill-yellow-400 text-yellow-400" size={16} />
                <span className="text-sm text-gray-500">
                  ({tour.reviews} avis)
                </span>
                <span className="ml-auto text-sm text-gray-500">
                  {tour.date}
                </span>
              </div>
              <h4 className="text-xl font-bold mb-2">{tour.title}</h4>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
              {tour.city}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{tour.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-gray-500" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                💰{" "}
                <span className="text-orange-500 font-bold">
                  {tour.price} DZD
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-gray-600">{tour.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Header Component
const ProfileHeader = ({ guideData }) => {
  return (
    <div className="bg-orange-500 rounded-lg p-6 mb-6 text-white">
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={guideData.profileImage}
            alt={guideData.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{guideData.name}</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold">{guideData.rating}</span>
            <Star className="fill-white" size={18} />
            <span className="text-sm">({guideData.totalReviews} avis)</span>
          </div>
          <p className="mb-3 text-orange-100 text-sm">{guideData.bio}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              🗣️ {guideData.languages.join(", ")}
            </div>
            <div className="flex items-center gap-2">
              🏆 {guideData.experience} années
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const GuestProfile = () => {
  const navigate = useNavigate();

  // Mock data - easy to replace with API calls later
  const [guideData] = useState({
    name: "Hamid Benali",
    rating: 4.3,
    totalReviews: 127,
    experience: 10,
    bio: "Certified tour guide with 10 years of experience, passionate about the history of the Casbah of Algiers and Ottoman heritage. Holds a degree in history and archaeology.",
    languages: ["French", "Arabic", "English"],
    verified: true,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  });

  const [pricingGrid] = useState({
    halfDay: { hours: "Up to 4 hours", price: 3500 },
    fullDay: { hours: "4 to 8 hours", price: 6000 },
    additionalHour: { hours: "Beyond 8 hours", price: 3500 },
    customizedDiscount: 20,
  });

  const [coverageZone] = useState(["Alger", "Tipaza", "Blida"]);

  const [certifications] = useState([
    "Certificate_Hamid1.pdf",
    "Certificate_Hamid2.pdf",
  ]);

  const [activeTab, setActiveTab] = useState("tours"); // 'tours' or 'avis'

  const [tours] = useState([
    {
      id: 1,
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Discover the historic alleys of the Casbah, listed as a UNESCO World Heritage site. Explore the palaces...",
      rating: 4.3,
      reviews: 127,
      duration: "3h",
      price: 3500,
      location: "Place des Martyrs, Casbah of Algiers",
      city: "Alger",
      date: "12/12/2025",
      image:
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Roman Tipaza and Mediterranean Coastline",
      description:
        "Explore the Roman ruins of Tipaza (UNESCO) and enjoy the stunning Mediterranean coastal landscapes.",
      rating: 4.5,
      reviews: 190,
      duration: "5h",
      price: 6000,
      location: "Tipaza city center",
      city: "Tipaza",
      date: "05/01/2026",
      image:
        "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=400&h=300&fit=crop",
    },
  ]);

  const [avis] = useState([
    {
      id: 1,
      name: "Saida Hamidouche",
      tour: "Visit of the Casbah of Algiers – UNESCO Heritage",
      rating: 5,
      comment:
        "Karim is an exceptional guide! His knowledge of the Casbah's history is impressive. I loved the tour and learned so much. Highly recommended!",
      date: "12/12/2025",
      publishedDate: "December 15, 2025",
    },
    {
      id: 2,
      name: "Kaci Saidani",
      tour: "Visit of the Casbah of Algiers – UNESCO Heritage",
      rating: 5,
      comment:
        "A perfect day! Karim showed us both faces of Algiers with passion and professionalism. The lunch was delicious and the sites were magnificent.",
      date: "12/12/2025",
      publishedDate: "December 15, 2025",
    },
    {
      id: 3,
      name: "Lyna Hemdad",
      tour: "Roman Tipaza and Mediterranean Coastline",
      rating: 4,
      comment:
        "The Roman ruins are impressive and the Mediterranean scenery is stunning. Only minor downside: the journey was a bit long.",
      date: "12/09/2025",
      publishedDate: "September 15, 2025",
    },
  ]);

  const handleCustomRequest = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleCustomRequest}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
          >
            Custom Request
          </button>
        </div>

        {/* Profile Header */}
        <ProfileHeader guideData={guideData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <Sidebar
            pricingGrid={pricingGrid}
            coverageZone={coverageZone}
            certifications={certifications}
          />

          {/* Tours Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b flex">
                <button
                  onClick={() => setActiveTab("tours")}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === "tours"
                      ? "border-b-2 border-orange-500 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Tours ({tours.length})
                </button>
                <button
                  onClick={() => setActiveTab("avis")}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === "avis"
                      ? "border-b-2 border-orange-500 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Avis ({avis.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "tours" ? (
                  <div className="space-y-6">
                    {tours.map((tour) => (
                      <TourCard
                        key={tour.id}
                        tour={tour}
                        onView={(id) => navigate(`/tour/${id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {avis.map((review) => (
                      <AvisCard key={review.id} avis={review} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuestProfile;
