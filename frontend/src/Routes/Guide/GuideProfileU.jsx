import React, { useState, useEffect } from "react";
import { Star, Clock, MapPin, FileText, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Layout/Header";
import { GuideAPI } from "../../utils/api";

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
              Custom requests subject to markup
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
          {coverageZone.length > 0 ? coverageZone.map((zone, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
            >
              {zone}
            </span>
          )) : (
            <p className="text-gray-500 text-sm">No coverage zones listed</p>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          🎓 Certifications
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {certifications.length > 0 ? certifications.map((cert, index) => {
            const imageUrl = cert.startsWith('http') ? cert : `http://127.0.0.1:8000${cert}`;
            return (
              <div
                key={index}
                className="aspect-square rounded-md overflow-hidden border border-gray-100 group cursor-pointer"
                onClick={() => window.open(imageUrl, '_blank')}
              >
                <img
                  src={imageUrl}
                  alt={`Certification ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            );
          }) : (
            <p className="text-gray-500 text-xs col-span-2 text-center py-4 bg-gray-50 rounded-lg border border-dashed">No certifications uploaded</p>
          )}
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
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="relative w-full md:w-40 h-40">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold">{tour.rating}</span>
                <Star className="fill-yellow-400 text-yellow-400" size={16} />
                <span className="text-sm text-gray-500">
                  ({tour.reviews} reviews)
                </span>
                <div className="ml-auto text-right">
                  <div className="text-sm text-gray-500">{tour.date}</div>
                  {tour.scheduled_time && (
                    <div className="text-xs font-medium text-orange-600">
                      at {tour.scheduled_time}
                    </div>
                  )}
                </div>
              </div>
              <h4 className="text-xl font-bold mb-2">{tour.title}</h4>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
              {tour.city}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
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
                <span className="text-gray-600 truncate max-w-[150px]">{tour.location}</span>
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
      <div className="flex flex-col md:flex-row items-center gap-5">
        <div className="relative">
          <img
            src={guideData.profileImage}
            alt={guideData.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Guide"; }}
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">{guideData.name}</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-2xl font-bold">{guideData.rating}</span>
            <Star className="fill-white" size={20} />
            <span className="text-sm">({guideData.totalReviews} reviews)</span>
          </div>
          <p className="mb-3 text-orange-100">{guideData.bio || "No bio available."}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
            <div className="flex items-center gap-2">
              🗣️ {guideData.languages.length > 0 ? guideData.languages.join(", ") : "No languages listed"}
            </div>
            {guideData.experience > 0 && (
              <div className="flex items-center gap-2">
                🏆 {guideData.experience} years
              </div>
            )}
            {guideData.is_verified && (
              <div className="flex items-center gap-2 px-2 py-1 bg-green-500/20 rounded-lg">
                ✅ Verified
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const GuestProfile = () => {
  const navigate = useNavigate();
  const { guideId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guideData, setGuideData] = useState({
    name: "",
    rating: 0,
    totalReviews: 0,
    experience: 0,
    bio: "",
    languages: [],
    verified: false,
    profileImage: "https://via.placeholder.com/150?text=Guide",
  });

  const [pricingGrid, setPricingGrid] = useState({
    halfDay: { hours: "Up to 4 hours", price: 0 },
    fullDay: { hours: "4 to 8 hours", price: 0 },
    additionalHour: { hours: "Beyond 8 hours", price: 0 },
    customizedDiscount: 0,
  });

  const [coverageZone, setCoverageZone] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [activeTab, setActiveTab] = useState("tours");
  const [tours, setTours] = useState([]);
  const [avis, setAvis] = useState([]);

  useEffect(() => {
    const fetchGuideData = async () => {
      if (!guideId) return;
      try {
        setLoading(true);
        // Fetch Profile
        const response = await GuideAPI.getProfile(guideId);
        if (response.success && response.data) {
          const { user_info, guide_info, pricing, coverage_zones, certifications } = response.data;

          setGuideData({
            name: `${user_info.firstname} ${user_info.lastname}`,
            rating: parseFloat(guide_info.average_rating || 0),
            totalReviews: guide_info.number_of_reviews || 0,
            experience: 0, // Not explicitly in model but could be derived
            bio: guide_info.biography || "",
            languages: guide_info.languages || [],
            is_verified: guide_info.is_verified,
            profileImage: user_info.photo_url
              ? (user_info.photo_url.startsWith('http') ? user_info.photo_url : `http://127.0.0.1:8000${user_info.photo_url}`)
              : "https://via.placeholder.com/150?text=Guide",
          });

          setPricingGrid({
            halfDay: { hours: "Up to 4 hours", price: pricing.half_day_price },
            fullDay: { hours: "4 to 8 hours", price: pricing.full_day_price },
            additionalHour: { hours: "Beyond 8 hours", price: pricing.additional_hour_price },
            customizedDiscount: pricing.customized_markdown || 0,
          });

          setCoverageZone(coverage_zones.map(z => z.name));
          setCertifications(certifications || []);
        }

        // Fetch Tours
        const toursResponse = await GuideAPI.getTours(guideId);
        if (toursResponse.success) {
          const mappedTours = (toursResponse.data.tours || []).map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            rating: parseFloat(t.average_rating || 0),
            reviews: t.number_of_reviews || 0,
            duration: `${t.estimated_duration}h`,
            price: t.calculated_price,
            location: t.starting_point,
            city: t.wilaya,
            date: t.date ? t.date : new Date(t.created_at).toLocaleDateString(),
            scheduled_time: t.scheduled_time ? t.scheduled_time.substring(0, 5) : null,
            image: t.cover_photo
              ? (t.cover_photo.startsWith('http') ? t.cover_photo : `http://127.0.0.1:8000${t.cover_photo}`)
              : "https://via.placeholder.com/400x300?text=Tour",
          }));
          setTours(mappedTours);
        }

        // Fetch Reviews
        const reviewsResponse = await GuideAPI.getReviews(guideId);
        if (reviewsResponse.success) {
          const mappedReviews = (reviewsResponse.data || []).map(r => ({
            id: r.id,
            name: r.tourist.name,
            tour: r.tour.title,
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.publication_date).toLocaleDateString(),
          }));
          setAvis(mappedReviews);
        }

      } catch (err) {
        console.error("Error fetching guide profile:", err);
        setError("Failed to load guide profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
  }, [guideId]);

  const handleCustomRequest = () => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      navigate("/signin");
      return;
    }
    navigate(`/CustomTour?guideId=${guideId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header />
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate("/")} className="px-6 py-2 bg-orange-500 text-white rounded-lg">
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleCustomRequest}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors"
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

          {/* Tours/Reviews Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow min-h-[400px]">
              {/* Tabs */}
              <div className="border-b flex">
                <button
                  onClick={() => setActiveTab("tours")}
                  className={`px-6 py-4 font-semibold transition-colors ${activeTab === "tours"
                    ? "border-b-2 border-orange-500 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Tours ({tours.length})
                </button>
                <button
                  onClick={() => setActiveTab("avis")}
                  className={`px-6 py-4 font-semibold transition-colors ${activeTab === "avis"
                    ? "border-b-2 border-orange-500 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Reviews ({avis.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "tours" ? (
                  <div className="space-y-6">
                    {tours.length > 0 ? tours.map((tour) => (
                      <TourCard
                        key={tour.id}
                        tour={tour}
                        onView={(id) => navigate(`/tour/${id}`)}
                      />
                    )) : (
                      <div className="text-center py-10 text-gray-500 italic">
                        This guide hasn't published any tours yet.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {avis.length > 0 ? avis.map((review) => (
                      <AvisCard key={review.id} avis={review} />
                    )) : (
                      <div className="text-center py-10 text-gray-500 italic">
                        No reviews yet.
                      </div>
                    )}
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