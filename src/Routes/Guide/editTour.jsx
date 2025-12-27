import React, { useState } from "react";
import { ChevronLeft, Download, Plus, X } from "lucide-react";

const CreateEditTourPage = () => {
  // Form data - easy to populate from API for edit mode
  const [formData, setFormData] = useState({
    title: "Visit of the Casbah of Algiers – UNESCO Heritage",
    description:
      "A total immersion into the history of Algiers, from the Ottoman era to the French colonial period. Visit emblematic sites from both periods.",
    wilayaCode: "16",
    duration: "7",
    calculatedPrice: "6,000",
    departureLocation:
      "hotel in Algiers city center (within the main urban area)",
    latitude: "36.7631",
    longitude: "3.0601",
    itineraryDetails:
      "Casbah (morning) →Lunch at a traditional restaurant → Notre-Dame d'Afrique → Jardin d'Essai → Waterfront and colonial architecture → National Museum of Bardo.",
    availablePlaces: "100",
  });

  const [images, setImages] = useState([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=150&fit=crop",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1591825944920-9a8c2f4a3d9f?w=200&h=150&fit=crop",
    },
  ]);

  const [whatsIncluded, setWhatsIncluded] = useState([
    "All entrance fees",
    "Traditional lunch",
    "Transportation between sites",
    "Water and snacks",
  ]);

  const [whatsNotIncluded, setWhatsNotIncluded] = useState([
    "Personal souvenirs",
  ]);

  const [newIncludedItem, setNewIncludedItem] = useState("");
  const [newNotIncludedItem, setNewNotIncludedItem] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = e.target.files;
    console.log("Upload images:", files);
    // TODO: Upload to server and add to images array
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
  const handleSave = () => {
    const dataToSave = {
      ...formData,
      images: images.map((img) => img.url),
      whatsIncluded,
      whatsNotIncluded,
    };

    console.log("Save tour data:", dataToSave);

    // TODO: API call to save/update tour
    // await fetch('/api/tours', {
    //   method: 'POST', // or 'PUT' for edit
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dataToSave)
    // });

    setShowModal(true);
  };

  // Handle cancel
  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      {/* <header className="bg-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ChevronLeft size={20} />
            <span className="font-medium">BOTTON</span>
          </button>
          <nav className="flex gap-6">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Reservations
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              My Profile
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              My Tours
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 border border-gray-400 rounded-lg flex items-center gap-2 hover:bg-gray-100">
            <span>⚙️</span>
            <span>My Profile</span>
          </button>
          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Log out
          </button>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Edit The Tour</h1>
          <p className="text-gray-600">
            Define the details of your tour. The price will be calculated
            automatically.
          </p>
        </div>

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
                <Download size={20} className="text-gray-400" />
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
          </div>
        </div>

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
