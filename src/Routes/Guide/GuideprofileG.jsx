import React, { useState } from "react";
import { ChevronLeft, Upload, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initial data - replace with API fetch later
  const [formData, setFormData] = useState({
    firstName: "Karim Benali",
    familyName: "Benali",
    biography:
      "Certified tour guide for 10 years, passionate about the history of Algiers Casbah and Ottoman heritage. Holds a degree in history and archaeology.",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  });

  const [languages, setLanguages] = useState({
    Arabic: true,
    French: true,
    English: false,
    German: false,
    Turkish: true,
    Tamazight: true,
    Spanish: false,
    Italian: false,
    Russian: false,
  });

  const [coverageZones, setCoverageZones] = useState({
    Algiers: true,
    Annaba: true,
    Setif: false,
    "Tizi Ouzou": false,
    Tamanrasset: false,
    Oran: true,
    Blida: false,
    Tlemcen: false,
    Tipaza: false,
    Ouargla: false,
    Constantine: false,
    Batna: false,
    Béjaïa: false,
    Ghardaïa: false,
    Biskra: false,
    Mostaganem: false,
    Djelfa: false,
    Skikda: false,
    Jijel: false,
    Tébessa: false,
  });

  const [certificates, setCertificates] = useState([
    { name: "Certificate_Hamid1.pdf", uploaded: true },
    { name: "Certificate_Hamid2.pdf", uploaded: true },
  ]);

  const [pricing, setPricing] = useState({
    halfDay: "3500",
    fullDay: "6000",
    additionalHour: "850",
  });

  // Get selected zones for display
  const selectedZones = Object.entries(coverageZones)
    .filter(([_, checked]) => checked)
    .map(([zone]) => zone);

  // Handler functions - ready to connect to API
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageToggle = (lang) => {
    setLanguages((prev) => ({ ...prev, [lang]: !prev[lang] }));
  };

  const handleZoneToggle = (zone) => {
    setCoverageZones((prev) => ({ ...prev, [zone]: !prev[zone] }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setPricing((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    // Ready for file upload API integration
    console.log("File upload:", e.target.files);
  };

  const handleRemoveCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    // Prepare data for API
    const dataToSave = {
      ...formData,
      languages: Object.entries(languages)
        .filter(([_, checked]) => checked)
        .map(([lang]) => lang),
      coverageZones: Object.entries(coverageZones)
        .filter(([_, checked]) => checked)
        .map(([zone]) => zone),
      certificates: certificates.map((c) => c.name),
      pricing,
    };

    console.log("Data to save:", dataToSave);

    // TODO: Replace with actual API call
    // await fetch('/api/profile/update', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dataToSave)
    // });

    // Show success modal
    setShowSuccessModal(true);

    // Remove auto-close and navigation
  };

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
            
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              My Profile
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
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
          <h1 className="text-4xl font-bold mb-2">My Guide Profile</h1>
          <p className="text-gray-600">Information visible to tourists</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow">
          {/* Profile Image */}
          <div className="mb-2">
            <div className="relative w-24 h-24">
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label className="absolute -top-1 -right-1 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 cursor-pointer">
                <Upload size={16} className="text-gray-600" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {/* First Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Karim Benali"
            />
          </div>

          {/* Family Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Family Name
            </label>
            <input
              type="text"
              name="familyName"
              value={formData.familyName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Benali"
            />
          </div>

          {/* Biography */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Biography
            </label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Certified tour guide for 10 years, passionate about the history of Algiers Casbah and Ottoman heritage. Holds a degree in history and archaeology."
            />
            <p className="text-xs text-gray-500 mt-1">
              A good biography helps tourists choose you.
            </p>
          </div>

          {/* Languages Spoken */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Languages Spoken
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(languages).map(([lang, checked]) => (
                <label
                  key={lang}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleLanguageToggle(lang)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Coverage Zone */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Coverage Zone (Wilayas)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {Object.entries(coverageZones).map(([zone, checked]) => (
                <label
                  key={zone}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleZoneToggle(zone)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm">{zone}</span>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedZones.map((zone, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>

          {/* Add More Certificates */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Add More Certificates
            </label>
            <label className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={20} />
              <span>Choose Files(PNG,JPG,PDF)</span>
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.pdf"
                multiple
                onChange={handleFileUpload}
              />
            </label>
            {certificates.length > 0 && (
              <div className="mt-3 space-y-2">
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-sm text-gray-700">{cert.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveCertificate(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Grid */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">
              Pricing Grid
            </label>
            <p className="text-xs text-gray-600 mb-4">
              Set your base rates. The price of each tour will be automatically
              calculated based on its duration and this grid.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Half-day (≤ 4h)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="halfDay"
                    value={pricing.halfDay}
                    onChange={handlePricingChange}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="3500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    DZD
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  For tours up to 4 hours
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full-day (4-8h)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullDay"
                    value={pricing.fullDay}
                    onChange={handlePricingChange}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="6000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    DZD
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  For tours lasting 4 to 8 hours
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional hour
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="additionalHour"
                    value={pricing.additionalHour}
                    onChange={handlePricingChange}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="850"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    DZD
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Beyond 8 hours</p>
              </div>
            </div>

            {/* Pricing Examples */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <p className="font-semibold text-sm mb-2">
                Examples of automatic price calculation:
              </p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 3-hour tour = 3,500 DZD (half-day)</li>
                <li>• 4-hour tour = 6,000 DZD (full-day)</li>
                <li>• 6-hour tour = 6,000 DZD (full-day)</li>
                <li>• 10-hour tour = 7,600 DZD (full-day + 2 extra hours)</li>
              </ul>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              Changes Saved Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your profile changes have been saved.
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
  );
};

export default EditProfilePage;
