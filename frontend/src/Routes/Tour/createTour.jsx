import React, { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { TourAPI } from "../../utils/api";

export default function CreateNewTour() {
  const navigate = useNavigate();
  const { guideId: guideIdFromParams } = useParams();

  // Get guideId from URL params, sessionStorage, or show error
  const getCurrentGuideId = () => {
    if (guideIdFromParams) return parseInt(guideIdFromParams);

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

    return null;
  };

  const [images, setImages] = useState([]); // Store File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Store preview URLs
  const [tourTitle, setTourTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [wilayaCode, setWilayaCode] = useState("");
  const [duration, setDuration] = useState("");
  const [departureLocation, setDepartureLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [departureTime, setDepartureTime] = useState(""); // New field for scheduled_time
  const [itinerary, setItinerary] = useState("");
  const [highlights, setHighlights] = useState("");
  const [availablePlaces, setAvailablePlaces] = useState("");
  const [included, setIncluded] = useState([""]);
  const [notIncluded, setNotIncluded] = useState([""]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => file);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages([...images, ...newFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    // Clear error on change
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (index) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const calculatePrice = () => {
    if (wilayaCode && duration) {
      const basePrice = parseInt(wilayaCode) * 100;
      const durationMultiplier = parseInt(duration) || 1;
      return (basePrice * durationMultiplier).toFixed(2);
    }
    return "0.00";
  };

  const addIncludedItem = () => setIncluded([...included, ""]);
  const addNotIncludedItem = () => setNotIncluded([...notIncluded, ""]);

  const updateIncludedItem = (index, value) => {
    const newIncluded = [...included];
    newIncluded[index] = value;
    setIncluded(newIncluded);
  };

  const updateNotIncludedItem = (index, value) => {
    const newNotIncluded = [...notIncluded];
    newNotIncluded[index] = value;
    setNotIncluded(newNotIncluded);
  };

  const validateForm = () => {
    const newErrors = {};
    if (images.length === 0)
      newErrors.images = "At least one image is required.";
    if (!tourTitle.trim()) newErrors.tourTitle = "Tour title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!date.trim()) newErrors.date = "Tour date is required.";
    if (!wilayaCode.trim()) newErrors.wilayaCode = "Wilaya code is required.";
    if (!duration.trim()) newErrors.duration = "Duration is required.";
    if (!departureLocation.trim())
      newErrors.departureLocation = "Departure location is required.";
    // Latitude and longitude are now optional
    if (!itinerary.trim()) newErrors.itinerary = "Itinerary is required.";
    if (!availablePlaces.trim())
      newErrors.availablePlaces = "Available places is required.";
    if (!included.some((item) => item.trim()))
      newErrors.included = "At least one included item is required.";
    if (!notIncluded.some((item) => item.trim()))
      newErrors.notIncluded = "At least one not included item is required.";
    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      console.log('Validation errors:', newErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"], input[value*="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }

    return isValid;
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleCreateTour = async () => {
    console.log('Create tour button clicked');

    // Validate form first
    const isValid = validateForm();
    if (!isValid) {
      console.log('Form validation failed');
      setError('Please fill in all required fields correctly. Check the form for highlighted errors.');
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Get guideId
    const currentGuideId = getCurrentGuideId();

    if (!currentGuideId) {
      setError("Guide ID not found. Please sign in again.");
      console.error('No guide ID found');
      return;
    }

    console.log('Creating tour for guide ID:', currentGuideId);
    setLoading(true);
    setError(null);

    try {
      // Prepare tour data matching backend API
      const tourData = {
        title: tourTitle,
        description: description,
        date: date || new Date().toISOString().split('T')[0], // Default to today if not set
        itinerary: itinerary,
        highlights: highlights || '',
        whats_included: included.filter((item) => item.trim() !== "").join('\n'),
        whats_excluded: notIncluded.filter((item) => item.trim() !== "").join('\n'),
        estimated_duration: duration,
        wilaya_code: wilayaCode,
        starting_point: departureLocation,
        latitude: latitude || undefined, // Optional
        longitude: longitude || undefined, // Optional
        scheduled_time: departureTime || undefined, // Optional
        available_places: availablePlaces,
        photos: images, // File objects
      };

      console.log('Tour data prepared:', { ...tourData, photos: `${images.length} files` });
      console.log('Calling TourAPI.createTour with guideId:', currentGuideId);

      const response = await TourAPI.createTour(currentGuideId, tourData);

      console.log('API Response:', response);

      if (response.success) {
        setShowModal(true);
        // Optionally navigate after a delay
        setTimeout(() => {
          navigate(`/GuideProfileG`);
        }, 2000);
      } else {
        const errorMsg = response.message || 'Failed to create tour';
        setError(errorMsg);
        console.error('Tour creation failed:', errorMsg);
      }
    } catch (err) {
      console.error('Error creating tour:', err);
      const errorMsg = err.message || err.data?.message || 'Failed to create tour. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create a New Tour
          </h1>
          <p className="text-gray-600">
            Define the details of your tour. The price will be calculated
            automatically.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Validation Error Banner */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Main Image
            </label>
            <div className="flex gap-3 items-start flex-wrap">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300"
                >
                  <img
                    src={preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-gray-400" />
              </label>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
          </div>

          {/* Tour Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tour Title
            </label>
            <input
              type="text"
              value={tourTitle}
              onChange={(e) => {
                setTourTitle(e.target.value);
                if (errors.tourTitle)
                  setErrors((prev) => ({ ...prev, tourTitle: "" }));
              }}
              placeholder="e.g., Historical Tour of Constantine"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            {errors.tourTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.tourTitle}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Describe your tour..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tour Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date)
                  setErrors((prev) => ({ ...prev, date: "" }));
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Wilaya Code, Duration, Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Wilaya Code
              </label>
              <input
                type="text"
                value={wilayaCode}
                onChange={(e) => {
                  setWilayaCode(e.target.value);
                  if (errors.wilayaCode)
                    setErrors((prev) => ({ ...prev, wilayaCode: "" }));
                }}
                placeholder="e.g., 25"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {errors.wilayaCode && (
                <p className="text-red-500 text-sm mt-1">{errors.wilayaCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  if (errors.duration)
                    setErrors((prev) => ({ ...prev, duration: "" }));
                }}
                placeholder="e.g., 4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Calculated Price
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-4 py-2.5 bg-green-50 border border-green-300 rounded-lg text-gray-700 font-medium">
                  {calculatePrice()}
                </div>
                <span className="px-3 py-2.5 bg-green-100 border border-green-300 rounded-lg text-gray-700 font-medium">
                  DZD
                </span>
              </div>
            </div>
          </div>

          {/* Departure Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Departure Location
            </label>
            <input
              type="text"
              value={departureLocation}
              onChange={(e) => {
                setDepartureLocation(e.target.value);
                if (errors.departureLocation)
                  setErrors((prev) => ({ ...prev, departureLocation: "" }));
              }}
              placeholder="e.g., Constantine City Center"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            {errors.departureLocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.departureLocation}
              </p>
            )}
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Departure Time (Optional)
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Scheduled departure time for this tour</p>
          </div>

          {/* Latitude & Longitude */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Latitude (Optional)
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => {
                  setLatitude(e.target.value);
                  if (errors.latitude)
                    setErrors((prev) => ({ ...prev, latitude: "" }));
                }}
                placeholder="e.g., 36.3650"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {errors.latitude && (
                <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Leave blank to use Wilaya center coordinates</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Longitude (Optional)
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => {
                  setLongitude(e.target.value);
                  if (errors.longitude)
                    setErrors((prev) => ({ ...prev, longitude: "" }));
                }}
                placeholder="e.g., 6.6147"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {errors.longitude && (
                <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Leave blank to use Wilaya center coordinates</p>
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Itinerary Details
            </label>
            <textarea
              value={itinerary}
              onChange={(e) => {
                setItinerary(e.target.value);
                if (errors.itinerary)
                  setErrors((prev) => ({ ...prev, itinerary: "" }));
              }}
              placeholder="Describe the tour itinerary..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
            />
            {errors.itinerary && (
              <p className="text-red-500 text-sm mt-1">{errors.itinerary}</p>
            )}
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Highlights (Optional)
            </label>
            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="Key highlights of the tour..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Available Places */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Available Places
            </label>
            <input
              type="number"
              value={availablePlaces}
              onChange={(e) => {
                setAvailablePlaces(e.target.value);
                if (errors.availablePlaces)
                  setErrors((prev) => ({ ...prev, availablePlaces: "" }));
              }}
              placeholder="e.g., 15"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            {errors.availablePlaces && (
              <p className="text-red-500 text-sm mt-1">
                {errors.availablePlaces}
              </p>
            )}
          </div>

          {/* Included Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                What's Included
              </label>
              <button
                type="button"
                onClick={addIncludedItem}
                className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>ADD</span>
              </button>
            </div>
            <div className="space-y-2">
              {included.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => updateIncludedItem(index, e.target.value)}
                  placeholder="e.g., Professional guide, Transportation"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              ))}
            </div>
            {errors.included && (
              <p className="text-red-500 text-sm mt-1">{errors.included}</p>
            )}
          </div>

          {/* Not Included Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                What's Not Included
              </label>
              <button
                type="button"
                onClick={addNotIncludedItem}
                className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>ADD</span>
              </button>
            </div>
            <div className="space-y-2">
              {notIncluded.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => updateNotIncludedItem(index, e.target.value)}
                  placeholder="e.g., Personal expenses, Tips"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              ))}
            </div>
            {errors.notIncluded && (
              <p className="text-red-500 text-sm mt-1">{errors.notIncluded}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('Button clicked, calling handleCreateTour');
                handleCreateTour();
              }}
              disabled={loading}
              className="px-8 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4 text-red-600">
                Error Creating Tour
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={() => setError(null)}
                  className="w-full px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    navigate('/GuideProfileG');
                  }}
                  className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">
                Tour Shared Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your tour has been shared and is now available.
              </p>
              <button
                onClick={() => navigate('/GuideProfileG')}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Go to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
