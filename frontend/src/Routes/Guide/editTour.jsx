import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, Upload, Trash2 } from "lucide-react";
import GuideHeader from "../../Layout/GuideHeader";
import { TourAPI } from "../../utils/api";

const CreateEditTourPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    wilayaCode: "",
    duration: "",
    calculatedPrice: "",
    departureLocation: "",
    latitude: "",
    longitude: "",
    itineraryDetails: "",
    availablePlaces: "",
    date: "",
    scheduledTime: "",
  });

  const [images, setImages] = useState([]);
  const [whatsIncluded, setWhatsIncluded] = useState([]);
  const [whatsNotIncluded, setWhatsNotIncluded] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [newNotIncludedItem, setNewNotIncludedItem] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch tour data if in edit mode
  useEffect(() => {
    if (id) {
      const fetchTourDetails = async () => {
        try {
          setLoading(true);
          const response = await TourAPI.getTour(id);

          if (response.success && response.tour) {
            const tour = response.tour;

            setFormData({
              title: tour.title || "",
              description: tour.description || "",
              wilayaCode: tour.wilaya?.code || "",
              duration: tour.estimated_duration || "",
              calculatedPrice: tour.calculated_price || "",
              departureLocation: tour.start_location || "",
              latitude: tour.latitude || "",
              longitude: tour.longitude || "",
              itineraryDetails: tour.itinerary || "",
              availablePlaces: tour.available_places || "",
              date: tour.date || "",
              scheduledTime: tour.scheduled_time ? tour.scheduled_time.substring(0, 5) : "",
            });

            // Handle images
            if (tour.gallery && Array.isArray(tour.gallery)) {
              setImages(tour.gallery.map((url, idx) => ({ id: idx, url })));
            } else if (tour.cover_photo) {
              setImages([{ id: 0, url: tour.cover_photo }]);
            }

            // Handle included/excluded items
            // They are strings in backend, so we split them (assuming newline or comma separation)
            if (tour.whats_included) {
              const included = tour.whats_included.includes('\n')
                ? tour.whats_included.split('\n')
                : tour.whats_included.split(',').map(item => item.trim());
              setWhatsIncluded(included.filter(item => item));
            }

            if (tour.whats_excluded) {
              const excluded = tour.whats_excluded.includes('\n')
                ? tour.whats_excluded.split('\n')
                : tour.whats_excluded.split(',').map(item => item.trim());
              setWhatsNotIncluded(excluded.filter(item => item));
            }

          } else {
            setError(response.message || "Failed to load tour details");
          }
        } catch (err) {
          console.error("Error fetching tour details:", err);
          setError("An error occurred while fetching tour details");
        } finally {
          setLoading(false);
        }
      };
      fetchTourDetails();
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // For now, just add to local state preview
      // In a real app, you might upload them immediately or wait for save
      const newImages = Array.from(files).map((file, idx) => ({
        id: Date.now() + idx,
        url: URL.createObjectURL(file), // Local preview URL
        file: file // Store the actual file for upload
      }));
      setImages([...images, ...newImages]);
    }
  };

  // Remove image
  const handleRemoveImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Add included item
  const handleAddIncluded = () => {
    if (newIncludedItem.trim()) {
      setWhatsIncluded([...whatsIncluded, newIncludedItem.trim()]);
      setNewIncludedItem("");
    }
  };

  // Remove included item
  const handleRemoveIncluded = (index) => {
    setWhatsIncluded(whatsIncluded.filter((_, i) => i !== index));
  };

  // Add not included item
  const handleAddNotIncluded = () => {
    if (newNotIncludedItem.trim()) {
      setWhatsNotIncluded([...whatsNotIncluded, newNotIncludedItem.trim()]);
      setNewNotIncludedItem("");
    }
  };

  // Remove not included item
  const handleRemoveNotIncluded = (index) => {
    setWhatsNotIncluded(whatsNotIncluded.filter((_, i) => i !== index));
  };

  // Handle save
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const userStr = sessionStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const guideId = user?.user_id || user?.userId;

      if (!guideId) {
        setError("User session not found. Please sign in again.");
        return;
      }

      const tourData = {
        title: formData.title,
        description: formData.description,
        itinerary: formData.itineraryDetails,
        whats_included: whatsIncluded.join('\n'),
        whats_excluded: whatsNotIncluded.join('\n'),
        estimated_duration: formData.duration,
        available_places: formData.availablePlaces,
        date: formData.date,
        scheduled_time: formData.scheduledTime,
        wilaya_code: formData.wilayaCode,
        starting_point: formData.departureLocation,
        latitude: formData.latitude,
        longitude: formData.longitude,
        photos: images,
      };

      let response;
      if (id) {
        // Edit mode
        response = await TourAPI.updateTour(guideId, id, tourData);
      } else {
        // Create mode (if we were using this for create too)
        // For now, App.jsx has a separate CreateTour route potentially?
        // path: "/createtour", element: <CreateNewTour />
        // Wait, App.jsx line 67: { path: "/createtour", element: <CreateNewTour /> }
        // editTour.jsx seems dedicated to Edit.
        response = await TourAPI.updateTour(guideId, id, tourData);
      }

      if (response && response.success) {
        setShowModal(true);
      } else {
        setError(response?.message || "Failed to save tour details");
      }
    } catch (err) {
      console.error("Error saving tour:", err);
      setError(err.message || "An error occurred while saving the tour");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tour? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      const userStr = sessionStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const guideId = user?.user_id || user?.userId;

      if (!guideId) {
        setError("User session not found. Please sign in again.");
        return;
      }

      const response = await TourAPI.deleteTour(guideId, id);
      if (response && response.success) {
        navigate("/guide/tours?tab=tours");
      } else {
        setError(response?.message || "Failed to delete tour");
      }
    } catch (err) {
      console.error("Error deleting tour:", err);
      setError(err.message || "An error occurred while deleting the tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <GuideHeader showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Edit The Tour</h1>
          <p className="text-gray-600">
            Define the details of your tour. The price will be calculated
            automatically.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Loading tour details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg shadow mb-6 text-center">
            <p className="font-bold mb-2">Error</p>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow">
            {/* Place Image */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Place Image
              </label>
              <div className="flex items-center gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative w-24 h-24 group">
                    <img
                      src={img.url}
                      alt="Tour"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                  <Upload size={20} className="text-gray-400" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tour Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Departure Time
                </label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Tour Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Tour Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Visit of the Casbah of Algiers – UNESCO Heritage"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="A total immersion into the history of Algiers..."
              />
            </div>

            {/* Wilaya Code, Duration, Calculated Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Wilaya Code
                </label>
                <input
                  type="text"
                  name="wilayaCode"
                  value={formData.wilayaCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="16"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only your covered provinces
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Duration (hours)
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="7"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The duration automatically determines the price.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Calculated Price
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="calculatedPrice"
                    value={formData.calculatedPrice}
                    readOnly
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg bg-green-50 focus:outline-none"
                    placeholder="6,000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 text-sm font-medium">
                    DZD
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Half-day rate</p>
              </div>
            </div>

            {/* Departure Location */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Departure Location
              </label>
              <input
                type="text"
                name="departureLocation"
                value={formData.departureLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="hotel in Algiers city center (within the main urban area)"
              />
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="36.7631"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only your covered provinces
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="3.0601"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The duration automatically determines the price.
                </p>
              </div>
            </div>

            {/* Itinerary Details */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Itinerary Details
              </label>
              <textarea
                name="itineraryDetails"
                value={formData.itineraryDetails}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Casbah (morning) →Lunch at a traditional restaurant..."
              />
            </div>

            {/* Available Places */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Available Places
              </label>
              <input
                type="text"
                name="availablePlaces"
                value={formData.availablePlaces}
                onChange={handleInputChange}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="100"
              />
            </div>

            {/* What's Included */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold">
                  What's Included
                </label>
                <button
                  onClick={handleAddIncluded}
                  className="px-4 py-1 border border-gray-300 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50"
                >
                  <Plus size={16} />
                  ADD
                </button>
              </div>
              <div className="space-y-2 mb-3">
                {whatsIncluded.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      onClick={() => handleRemoveIncluded(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newIncludedItem}
                onChange={(e) => setNewIncludedItem(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddIncluded()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Type and press Enter to add..."
              />
            </div>

            {/* What's Not Included */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold">
                  What's Not Included
                </label>
                <button
                  onClick={handleAddNotIncluded}
                  className="px-4 py-1 border border-gray-300 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50"
                >
                  <Plus size={16} />
                  ADD
                </button>
              </div>
              <div className="space-y-2 mb-3">
                {whatsNotIncluded.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      onClick={() => handleRemoveNotIncluded(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newNotIncludedItem}
                onChange={(e) => setNewNotIncludedItem(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddNotIncluded()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Type and press Enter to add..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Save changes
              </button>
              {id && (
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Tour
                </button>
              )}
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">
                Changes Saved Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your tour changes have been saved.
              </p>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateEditTourPage;
