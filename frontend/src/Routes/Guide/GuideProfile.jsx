import React, { useState, useEffect } from "react";
import {
  Star,
  Clock,
  MapPin,
  Trash2,
  Edit,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import GuideHeader from "../../Layout/GuideHeader";
import { GuideAPI, TourAPI } from "../../utils/api";

// Sidebar Component
const Sidebar = ({ pricingGrid, coverageZone, certifications, onDeleteCertification }) => {
  return (
    <div className="space-y-6">
      {/* ... Pricing Grid ... */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          💰 Pricing Grid
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                <Clock size={18} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Half-day</div>
                <div className="text-sm text-gray-500">
                  {pricingGrid.halfDay.hours}
                </div>
              </div>
            </div>
            <div className="text-orange-500 font-bold text-lg">
              {pricingGrid.halfDay.price} DZD
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                <Clock size={18} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Full-day</div>
                <div className="text-sm text-gray-500">
                  {pricingGrid.fullDay.hours}
                </div>
              </div>
            </div>
            <div className="text-orange-500 font-bold text-lg">
              {pricingGrid.fullDay.price} DZD
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-full">
                <Clock size={18} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Additional hour</div>
                <div className="text-sm text-gray-500">
                  {pricingGrid.additionalHour.hours}
                </div>
              </div>
            </div>
            <div className="text-orange-500 font-bold text-lg">
              {pricingGrid.additionalHour.price} DZD
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors bg-orange-50/50 border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                <Star size={18} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Custom Request</div>
                <div className="text-sm text-gray-500">
                  Tailored experience
                </div>
              </div>
            </div>
            <div className="text-orange-600 font-bold text-sm">
              +{pricingGrid.customizedDiscount}% markup
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
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          🎓 Certifications
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {certifications && certifications.length > 0 ? (
            certifications.map((cert, index) => {
              const imageUrl = cert.startsWith('http')
                ? cert
                : `http://127.0.0.1:8000${cert}`;

              return (
                <div key={index} className="aspect-square rounded-md overflow-hidden border border-gray-100 group relative">
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img
                      src={imageUrl}
                      alt={`Certification ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                  {onDeleteCertification && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDeleteCertification(cert);
                      }}
                      className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                      title="Delete Certification"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-xs col-span-2 text-center py-4 bg-gray-50 rounded-lg border border-dashed">No certifications listed</p>
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
        <span>•</span>
        <span>Published: {avis.publishedDate}</span>
      </div>
    </div>
  );
};

// Tour Card Component
const TourCard = ({ tour, onDelete, onEdit, onView }) => {
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(tour.id);
            }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
            title="Edit Tour"
          >
            <Edit className="w-4 h-4 text-orange-500" />
          </button>
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
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(tour.id);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(tour.id);
                }}
                className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg flex items-center gap-2 hover:bg-orange-200"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Header Component
const ProfileHeader = ({ guideData, onEditProfile }) => {
  return (
    <div className="bg-orange-500 rounded-lg p-6 mb-6 text-white">
      <div className="flex items-start gap-6">
        <div className="relative">
          <img
            src={guideData.profileImage}
            alt={guideData.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
          />
          <button
            onClick={onEditProfile}
            className="absolute -top-2 -right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
            title="Edit Profile"
          >
            <Edit className="w-5 h-5 text-orange-500" />
          </button>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{guideData.name}</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold">{guideData.rating}</span>
            <Star className="fill-white" size={20} />
            <span className="text-sm">({guideData.totalReviews} avis)</span>
          </div>
          <p className="mb-4 text-orange-100">{guideData.bio}</p>
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
const GuideProfileG = () => {
  const navigate = useNavigate();
  const { guideId } = useParams();

  // Get guideId from URL params, or from sessionStorage (current logged-in guide)
  const getCurrentGuideId = () => {
    if (guideId) return parseInt(guideId);

    // Try to get from sessionStorage
    try {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.user_id) return user.user_id;
        if (user.userId) return user.userId;
      }
    } catch (e) {
      console.error("Error parsing user from sessionStorage:", e);
    }

    // Fallback - this should not happen in production
    console.warn("No guideId found, using default");
    return null;
  };

  const currentGuideId = getCurrentGuideId();

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
    profileImage: "",
  });

  const [pricingGrid, setPricingGrid] = useState({
    halfDay: { hours: "Up to 4 hours", price: 0 },
    fullDay: { hours: "4 to 8 hours", price: 0 },
    additionalHour: { hours: "Beyond 8 hours", price: 0 },
    customizedDiscount: 20,
  });

  const [coverageZone, setCoverageZone] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [activeTab, setActiveTab] = useState("tours");
  const [tours, setTours] = useState([]);
  const [avis, setAvis] = useState([]);

  // Fetch guide profile data
  useEffect(() => {
    if (!currentGuideId) {
      setError("Guide ID not found. Please sign in again.");
      setLoading(false);
      return;
    }

    const fetchGuideData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch profile
        const profileResponse = await GuideAPI.getProfile(currentGuideId);
        if (profileResponse.success && profileResponse.data) {
          const data = profileResponse.data;

          // Map backend data to frontend format
          setGuideData({
            name: `${data.user_info?.firstname || ''} ${data.user_info?.lastname || ''}`.trim(),
            rating: parseFloat(data.guide_info?.average_rating || 0),
            totalReviews: data.guide_info?.number_of_reviews || 0,
            experience: 0, // Not in backend
            bio: data.guide_info?.biography || '',
            languages: data.guide_info?.languages || [],
            verified: data.guide_info?.is_verified || false,
            profileImage: data.user_info?.photo_url
              ? (data.user_info.photo_url.startsWith('http')
                ? data.user_info.photo_url
                : `http://127.0.0.1:8000${data.user_info.photo_url}`)
              : "https://via.placeholder.com/150?text=Guide",
          });

          // Set pricing
          setPricingGrid({
            halfDay: { hours: "Up to 4 hours", price: parseFloat(data.pricing?.half_day_price || 0) },
            fullDay: { hours: "4 to 8 hours", price: parseFloat(data.pricing?.full_day_price || 0) },
            additionalHour: { hours: "Beyond 8 hours", price: parseFloat(data.pricing?.additional_hour_price || 0) },
            customizedDiscount: 20,
          });

          // Set coverage zones
          setCoverageZone(data.coverage_zones?.map(z => z.name) || []);

          // Set certifications
          setCertifications(data.certifications || []);
        }

        // Fetch tours
        const toursResponse = await GuideAPI.getTours(currentGuideId);
        if (toursResponse.success && toursResponse.data) {
          const toursData = toursResponse.data.tours || [];
          const mappedTours = toursData.map(tour => ({
            id: tour.id,
            title: tour.title,
            description: tour.description?.substring(0, 100) + '...' || '',
            rating: parseFloat(tour.average_rating || 0),
            reviews: tour.number_of_reviews || 0,
            duration: `${tour.estimated_duration}h`,
            price: parseFloat(tour.calculated_price || 0),
            location: tour.starting_point || '',
            city: tour.wilaya || '',
            date: tour.date ? tour.date : (tour.created_at ? new Date(tour.created_at).toLocaleDateString() : ''),
            scheduled_time: tour.scheduled_time ? tour.scheduled_time.substring(0, 5) : null,
            image: tour.cover_photo
              ? (tour.cover_photo.startsWith('http')
                ? tour.cover_photo
                : `http://127.0.0.1:8000${tour.cover_photo}`)
              : "https://via.placeholder.com/400x300?text=Tour",
          }));
          setTours(mappedTours);
        }

        // Fetch reviews
        const reviewsResponse = await GuideAPI.getReviews(currentGuideId);
        if (reviewsResponse.success && reviewsResponse.data) {
          const reviewsData = reviewsResponse.data || [];
          const mappedReviews = reviewsData.map(review => ({
            id: review.id,
            name: review.tourist?.name || 'Anonymous',
            tour: review.tour?.title || '',
            rating: review.rating || 0,
            comment: review.comment || '',
            date: review.publication_date ? new Date(review.publication_date).toLocaleDateString() : '',
            publishedDate: review.publication_date ? new Date(review.publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
          }));
          setAvis(mappedReviews);
        }
      } catch (err) {
        console.error('Error fetching guide data:', err);
        setError(err.message || 'Failed to load guide profile');
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
  }, [currentGuideId]);

  const handleDelete = async (tourId) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) {
      return;
    }

    try {
      const response = await TourAPI.deleteTour(currentGuideId, tourId);
      if (response.success) {
        setTours(tours.filter((tour) => tour.id !== tourId));
      } else {
        alert(response.message || 'Failed to delete tour');
      }
    } catch (err) {
      console.error('Error deleting tour:', err);
      alert(err.message || 'Failed to delete tour. Please try again.');
    }
  };

  const handleEdit = (tourId) => {
    // Navigate to edit tour page (same pattern as profile edit button)
    navigate(`/editTour/${tourId}`);
  };

  const handleAddTour = () => {
    console.log("Add new tour");
    // Will be linked to add tour functionality
    navigate("/CreateTour");
  };

  const handleEditProfile = () => {
    navigate("/editProfile");
  };

  /* New handler for deleting certification */
  const handleDeleteCertification = async (filePath) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) {
      return;
    }

    try {
      const response = await GuideAPI.deleteCertification(currentGuideId, filePath);
      if (response.success) {
        setCertifications(prev => prev.filter(c => c !== filePath));
      } else {
        alert(response.message || "Failed to delete certification");
      }
    } catch (err) {
      console.error("Error deleting certification:", err);
      alert(err.message || "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guide profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-orange-500 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <GuideHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddTour}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
          >
            Add new Tour
          </button>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          guideData={guideData}
          onEditProfile={handleEditProfile}
        />

        {/* Vertical Layout Container */}
        <div className="flex flex-col gap-6">
          {/* Information Section (Originally Sidebar) */}
          <div className="w-full">
            <Sidebar
              pricingGrid={pricingGrid}
              coverageZone={coverageZone}
              certifications={certifications}
              onDeleteCertification={handleDeleteCertification}
            />
          </div>

          {/* Tours/Reviews Section */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow">
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
                        onDelete={handleDelete}
                        onEdit={handleEdit}
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

export default GuideProfileG;
