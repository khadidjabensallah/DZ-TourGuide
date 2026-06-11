import React, { useState, useEffect } from "react";
import { ChevronLeft, Upload, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GuideAPI, SearchAPI, resolveMediaUrl } from "../../utils/api";
import GuideHeader from "../../Layout/GuideHeader";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userId, setUserId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    familyName: "",
    biography: "",
    profileImage: "https://via.placeholder.com/150?text=Guide",
    phone: "",
  });

  // Languages State
  const [languages, setLanguages] = useState({
    Arabic: false,
    French: false,
    English: false,
    German: false,
    Turkish: false,
    Tamazight: false,
    Spanish: false,
    Italian: false,
    Russian: false,
  });

  // Coverage Zones State
  const [availableWilayas, setAvailableWilayas] = useState([]);
  const [selectedWilayaCodes, setSelectedWilayaCodes] = useState({});

  // Pricing State
  const [pricing, setPricing] = useState({
    halfDay: "",
    fullDay: "",
    additionalHour: "",
    customMarkup: "20",
  });

  // Certificates State
  const [certificates, setCertificates] = useState([]);

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get user ID from session
        let currentUserId = null;
        try {
          const userStr = sessionStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            currentUserId = user.user_id || user.userId;
            setUserId(currentUserId);
          }
        } catch (e) {
          console.error("Session parse error", e);
        }

        if (!currentUserId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // 1. Fetch available wilayas
        const filtersResponse = await SearchAPI.getAvailableFilters();
        let wilayas = [];
        if (filtersResponse.success && filtersResponse.filters?.wilayas) {
          wilayas = filtersResponse.filters.wilayas;
          setAvailableWilayas(wilayas);
        }

        // 2. Fetch Profile
        const response = await GuideAPI.getProfile(currentUserId);
        if (response.success && response.data) {
          const data = response.data;

          // Set Basic Info
          setFormData({
            firstName: data.user_info?.firstname || "",
            familyName: data.user_info?.lastname || "",
            biography: data.guide_info?.biography || "",
            phone: data.guide_info?.phone_digits || "",
            profileImage: resolveMediaUrl(data.user_info?.photo_url, "https://via.placeholder.com/150?text=Guide"),
          });

          // Set Pricing
          setPricing({
            halfDay: data.pricing?.half_day_price || "",
            fullDay: data.pricing?.full_day_price || "",
            additionalHour: data.pricing?.additional_hour_price || "",
            customMarkup: data.pricing?.custom_request_markup || "20",
          });

          // Set Languages
          const guideLangs = data.guide_info?.languages || [];
          const newLangState = { ...languages };
          guideLangs.forEach(lang => {
            const key = Object.keys(newLangState).find(k => k.toLowerCase() === lang.toLowerCase());
            if (key) newLangState[key] = true;
          });
          setLanguages(newLangState);

          // Set Coverage Zones
          const guideZones = data.coverage_zones || [];
          const initialSelected = {};
          guideZones.forEach(z => {
            initialSelected[z.code] = true;
          });
          setSelectedWilayaCodes(initialSelected);

          // Set Certificates
          const certs = data.certifications || [];
          setCertificates(certs.map(c => ({
            name: c.split('/').pop(),
            path: c,
            uploaded: true
          })));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageToggle = (lang) => {
    setLanguages((prev) => ({ ...prev, [lang]: !prev[lang] }));
  };

  const handleWilayaToggle = (code) => {
    setSelectedWilayaCodes((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setPricing((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    try {
      setLoading(true);
      const response = await GuideAPI.uploadPhoto(userId, file);
      if (response.success) {
        const newUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, profileImage: newUrl }));
        alert("Profile photo updated!");
      } else {
        alert("Failed to upload photo");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Error uploading photo");
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (!file || !userId) return;

    try {
      setLoading(true);
      const response = await GuideAPI.uploadCertification(userId, file);
      if (response.success) {
        const newCert = {
          name: file.name,
          path: response.data?.certification_url,
          uploaded: true
        };
        setCertificates(prev => [...prev, newCert]);
        alert("Certification uploaded successfully!");
      } else {
        alert("Failed to upload certification: " + response.message);
      }
    } catch (err) {
      console.error("Cert upload error", err);
      alert("Error uploading certification");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!userId) return;

    // Phone Validation
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (phoneClean.length !== 9 || !['5', '6', '7'].includes(phoneClean[0])) {
      alert("Phone number must mean 9 digits and start with 5, 6, or 7.");
      return;
    }

    try {
      setLoading(true);

      const activeLanguages = Object.entries(languages)
        .filter(([_, checked]) => checked)
        .map(([lang]) => lang);

      const activeZoneCodes = Object.entries(selectedWilayaCodes)
        .filter(([_, checked]) => checked)
        .map(([code]) => code);

      const payload = {
        firstname: formData.firstName,
        lastname: formData.familyName,
        biography: formData.biography,
        phone: phoneClean,
        languages: activeLanguages,
        half_day_price: pricing.halfDay,
        full_day_price: pricing.fullDay,
        additional_hour_price: pricing.additionalHour,
        custom_request_markup: pricing.customMarkup,
      };

      const profileResponse = await GuideAPI.updateProfile(userId, payload);

      if (!profileResponse.success) {
        throw new Error(profileResponse.message || "Failed to update profile");
      }

      await GuideAPI.updateCoverageZones(userId, activeZoneCodes);

      setShowSuccessModal(true);

    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading && !formData.firstName) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const selectedZoneNames = availableWilayas
    .filter(w => selectedWilayaCodes[w.code])
    .map(w => w.name);

  return (
    <div className="min-h-screen bg-blue-50">
      <GuideHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={handleCancel} className="p-2 hover:bg-gray-200 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
            <p className="text-gray-600">Update your guide information</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg p-8 shadow">
          {/* Profile Image */}
          <div className="mb-8">
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
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Contact Info Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Family Name
              </label>
              <input
                type="text"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+213</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="555123456"
                maxLength={9}
                className="w-full pl-16 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter 9 digits without spaces (starts with 5, 6, or 7)
            </p>
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
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Languages Spoken */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Languages Spoken
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(languages).map(([lang, checked]) => (
                <label
                  key={lang}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50"
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
            <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 bg-gray-50">
              {availableWilayas.map((wilaya) => (
                <label
                  key={wilaya.code}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={!!selectedWilayaCodes[wilaya.code]}
                    onChange={() => handleWilayaToggle(wilaya.code)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs text-gray-700">{wilaya.code} - {wilaya.name}</span>
                </label>
              ))}
              {availableWilayas.length === 0 && <p className="text-sm text-gray-500">Loading wilayas...</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedZoneNames.map((name, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">
              Pricing Grid
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">
                  Half-day (≤ 4h)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="halfDay"
                    value={pricing.halfDay}
                    onChange={handlePricingChange}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    DZD
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">
                  Full-day (4-8h)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="fullDay"
                    value={pricing.fullDay}
                    onChange={handlePricingChange}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    DZD
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">
                  Extra hour
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="additionalHour"
                    value={pricing.additionalHour}
                    onChange={handlePricingChange}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    DZD
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">
                  Custom Markup
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="customMarkup"
                    value={pricing.customMarkup}
                    onChange={handlePricingChange}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications - FIXED GRID CARD LAYOUT */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">
              Certifications & Documents
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Upload Button - Fixed Card */}
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-white hover:border-orange-500 rounded-lg cursor-pointer transition-all group">
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-orange-50 transition-colors mb-2">
                  <Upload size={20} className="text-gray-400 group-hover:text-orange-500" />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-orange-600 text-center px-2">
                  Add Document
                </span>
                <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleCertificateUpload} />
              </label>

              {/* List of Certs - Fixed Cards */}
              {certificates.map((cert, index) => (
                <div key={index} className="relative flex flex-col items-center justify-center h-32 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 group">
                  <div className="mb-2 text-orange-500 bg-orange-50 p-2 rounded-lg">
                    <CheckCircle size={24} />
                  </div>
                  <p className="text-xs font-medium text-gray-700 text-center w-full truncate px-1" title={cert.name}>
                    {cert.name}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1">Uploaded</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Accepted: PDF, JPG, PNG (Max 5MB)</p>
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
              onClick={handleSaveChanges}
              disabled={loading}
              className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save changes"}
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
              Your profile has been updated.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate(-1); // Go back to profile
              }}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Back to Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
