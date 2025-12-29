import React, { useState } from "react";
import { Plus, X } from "lucide-react";

export default function CreateTourPage() {
  const [tourTitle, setTourTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wilayaCode, setWilayaCode] = useState("");
  const [duration, setDuration] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [departureLocation, setDepartureLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [availablePlaces, setAvailablePlaces] = useState("");
  const [included, setIncluded] = useState([]);
  const [notIncluded, setNotIncluded] = useState([]);
  const [newIncluded, setNewIncluded] = useState("");
  const [newNotIncluded, setNewNotIncluded] = useState("");

  const addIncluded = () => {
    if (newIncluded.trim()) {
      setIncluded([...included, newIncluded.trim()]);
      setNewIncluded("");
    }
  };

  const removeIncluded = (index) => {
    setIncluded(included.filter((_, i) => i !== index));
  };

  const addNotIncluded = () => {
    if (newNotIncluded.trim()) {
      setNotIncluded([...notIncluded, newNotIncluded.trim()]);
      setNewNotIncluded("");
    }
  };

  const removeNotIncluded = (index) => {
    setNotIncluded(notIncluded.filter((_, i) => i !== index));
  };

  const handleCreateTour = () => {
    console.log("Creating tour with data:", {
      tourTitle,
      description,
      wilayaCode,
      duration,
      minPrice,
      maxPrice,
      departureLocation,
      latitude,
      longitude,
      itinerary,
      availablePlaces,
      included,
      notIncluded,
    });
  };

  const handleCancel = () => {
    console.log("Cancelled");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Tguida Logo */}
            <div className="flex items-center gap-3">
              <img
                src="https://i.postimg.cc/gkjD1gq7/logo.png"
                alt="Tguida Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              Home
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              Explore
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-orange-500 transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2 transition-colors">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span>My Profile</span>
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Title Section - Outside the card, aligned left */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create a New Tour
          </h1>
          <p className="text-sm text-gray-600">
            Define the details of your tour. The price will be calculated automatically.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Tour Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tour Title
            </label>
            <input
              type="text"
              value={tourTitle}
              onChange={(e) => setTourTitle(e.target.value)}
              placeholder="Ex: Explore Algiers Casbah"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your tour..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Wilaya Code, Duration, and Calculated Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Wilaya Code
              </label>
              <input
                type="text"
                value={wilayaCode}
                onChange={(e) => setWilayaCode(e.target.value)}
                placeholder="Ex: Alger-16"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 4 hours, 2 days, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Calculated Price
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="DZD"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-green-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
                />
                <input
                  type="text"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="DZD"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-green-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Departure Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Departure Location
            </label>
            <input
              type="text"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
              placeholder="Ex: Algiers International Airport"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* Latitude and Longitude */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="36.7538"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Latitude coordinate for pin location
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="3.0588"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Longitude coordinate for pin location
              </p>
            </div>
          </div>

          {/* Itinerary Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Itinerary Details
            </label>
            <textarea
              value={itinerary}
              onChange={(e) => setItinerary(e.target.value)}
              placeholder="Ex: Day 1: Visit Casbah, Day 2: Explore museums..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Available Places */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Available Places
            </label>
            <input
              type="text"
              value={availablePlaces}
              onChange={(e) => setAvailablePlaces(e.target.value)}
              placeholder="Ex: 10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* What's Included */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                What's Included
              </label>
              <button
                onClick={addIncluded}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                ADD
              </button>
            </div>
            <div className="space-y-2 mb-2">
              {included.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{item}</span>
                  <button
                    onClick={() => removeIncluded(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={newIncluded}
              onChange={(e) => setNewIncluded(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addIncluded()}
              placeholder="Ex: Hotel accommodation, breakfast..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* What's Not Included */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                What's Not Included
              </label>
              <button
                onClick={addNotIncluded}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                ADD
              </button>
            </div>
            <div className="space-y-2 mb-2">
              {notIncluded.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{item}</span>
                  <button
                    onClick={() => removeNotIncluded(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={newNotIncluded}
              onChange={(e) => setNewNotIncluded(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNotIncluded()}
              placeholder="Ex: flights, personal expenses, lunch..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTour}
              className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Create Tour
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}