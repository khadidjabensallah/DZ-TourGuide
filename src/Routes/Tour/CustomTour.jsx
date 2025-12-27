import React, { useState } from "react";
import { ArrowLeft, Phone, Calendar, MessageSquare } from "lucide-react";

export default function CustomRequestForm() {
  const [formData, setFormData] = useState({
    phone: "",
    preferredDate: "",
    departureTime: "",
    duration: "",
    numberOfPeople: "",
    wilaya: "",
    departureLocation: "",
    tourDescription: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "phone") {
      val = value.replace(/\D/g, "").slice(0, 9);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "phone",
      "preferredDate",
      "duration",
      "numberOfPeople",
      "wilaya",
      "departureLocation",
      "tourDescription",
    ];
    requiredFields.forEach((field) => {
      if (field === "phone") {
        if ((formData.phone || "").length !== 9) {
          newErrors.phone = "Enter 9 digits (local part) after +213";
        }
      } else if (!formData[field].trim()) {
        newErrors[field] = "This field is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      setShowModal(true);
      // Handle form submission
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const wilayas = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouïra",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Menia",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Custom Request
        </h1>
        <p className="text-gray-600 mb-8">
          Create a tailor-made experience with Hamid Benali
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Warning Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-orange-500 text-xs font-bold">i</span>
            </div>
            <div className="text-sm">
              <span className="text-orange-700">
                Personalized tours are subject to a{" "}
              </span>
              <span className="text-orange-700 font-semibold">+20%</span>
              <br />
              <span className="text-orange-700">
                compared to standard rates.
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-700">
                +213
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="enter 9 digits"
                maxLength={9}
                className={`w-full px-4 py-3 border rounded-r-lg focus:ring-2 focus:border-transparent outline-none ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Tour Details */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Tour Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                {errors.preferredDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.preferredDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Time
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    h
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    h
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 1 hour</p>
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of People
                </label>
                <input
                  type="text"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                {errors.numberOfPeople && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.numberOfPeople}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wilaya
              </label>
              <select
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">Select a wilaya</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya} value={wilaya}>
                    {wilaya}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Wilayas covered by this guide
              </p>
              {errors.wilaya && (
                <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Location
              </label>
              <input
                type="text"
                name="departureLocation"
                value={formData.departureLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {errors.departureLocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.departureLocation}
                </p>
              )}
            </div>
          </div>

          {/* Describe Your Request */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Describe Your Request</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your personalized tour
              </label>
              <textarea
                name="tourDescription"
                value={formData.tourDescription}
                onChange={handleChange}
                rows="8"
                placeholder="Describe your ideal tour experience, places you'd like to visit, activities you're interested in..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none placeholder:text-gray-400"
              />
              {errors.tourDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tourDescription}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (optional)
              </label>
              <input
                type="text"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Ex: Need an air-conditioned vehicle, Specific dietary requirements ..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleCancel}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Submit Request
            </button>
          </div>

          {/* Success Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">
                  Request Sent Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your custom tour request has been sent. Please wait for the
                  guide to accept it.
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
        </div>
      </div>
    </div>
  );
}
