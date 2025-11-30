import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";
import logo from "../../../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

export default function DZTourGuideSignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const [languagesOpen, setLanguagesOpen] = useState(false);
  const [wilayasOpen, setWilayasOpen] = useState(false);

  // page2 fields
  const [formData, setFormData] = useState({
    languages: [],
    wilayas: [],
    halfDayPrice: "",
    fullDayPrice: "",
    additionalHourPrice: "",
  });

  // page1 data (received via navigate state)
  const [page1Data, setPage1Data] = useState(null);

  // validation errors state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // read page1 data passed via navigate(..., { state: formData })
    if (location && location.state) {
      setPage1Data(location.state);
    }
  }, [location]);

  const languages = [
    "Arabic",
    "French",
    "English",
    "German",
    "Turkish",
    "Tamazight",
    "Spanish",
    "Italian",
    "Russian",
  ];

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
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Algiers",
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
    "Aïn Salah",
    "Aïn Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Menia",
  ];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // prices: allow only digits (no spinners) and trim leading zeros
    let val = value;
    if (
      ["halfDayPrice", "fullDayPrice", "additionalHourPrice"].includes(name)
    ) {
      val = value.replace(/\D/g, "");
      // optional: prevent leading zeros
      val = val.replace(/^0+(?=\d)/, "");
    }
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const toggleLanguage = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const toggleWilaya = (wilaya) => {
    setFormData((prev) => ({
      ...prev,
      wilayas: prev.wilayas.includes(wilaya)
        ? prev.wilayas.filter((w) => w !== wilaya)
        : [...prev.wilayas, wilaya],
    }));
  };

  // validate all
  const validate = () => {
    const newErrors = {};
    if (!formData.languages || formData.languages.length === 0)
      newErrors.languages = "Select at least one language";
    if (!formData.wilayas || formData.wilayas.length === 0)
      newErrors.wilayas = "Select at least one wilaya";
    ["halfDayPrice", "fullDayPrice", "additionalHourPrice"].forEach((k) => {
      const v = (formData[k] || "").trim();
      if (!v) newErrors[k] = "Enter a price";
      else if (!/^\d+$/.test(v)) newErrors[k] = "Price must be a number";
      else if (Number(v) <= 0) newErrors[k] = "Price must be greater than 0";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    if (!validate()) return;
    setSubmitting(true);
    // merge page1 + page2 data
    const mergedData = { ...page1Data, ...formData };
    console.log("Merged form data:", mergedData);

    // send to backend with FormData
    const formDataToSend = new FormData();
    Object.entries(mergedData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formDataToSend.append(`${key}[]`, item));
      } else if (value instanceof File) {
        formDataToSend.append(key, value);
      } else {
        formDataToSend.append(key, value || "");
      }
    });

    // API call example (uncomment to use):
    // fetch("/api/guide-signup", {
    //   method: "POST",
    //   body: formDataToSend,
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("Success:", data);
    //     setSubmitting(false);
    //     navigate("/verifyEmail");
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     setSubmitting(false);
    //   });

    setSubmitting(false);
    navigate("/verifyEmail");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/signupguideP1")}
            className="flex items-center text-gray-700 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Back</span>
          </button>
        </div>
       
        <div className="w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-1">
              <img
                src={logo}
                alt="TGUIDA Logo"
                className="w-32  object-contain -my-12 -mt-13"
              />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Bienvenue sur Tguida
            </h1>
            <p className="text-sm text-gray-600 font-bold">
              Discover Algeria with our certificated guides
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 max-w-md mx-auto">
            {/* Languages Spoken */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Languages Spoken
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLanguagesOpen(!languagesOpen)}
                  className="w-full px-4 py-2 border rounded-lg flex items-center justify-between hover:border-orange-500 transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                >
                  <span className="text-gray-700">
                    {formData.languages.length > 0
                      ? `${formData.languages.length} language(s) selected`
                      : "Select languages"}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      languagesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {languagesOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {languages.map((language) => (
                      <div
                        key={language}
                        onClick={() => toggleLanguage(language)}
                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex items-center justify-between transition"
                      >
                        <span className="text-gray-700">{language}</span>
                        {formData.languages.includes(language) && (
                          <Check size={18} className="text-orange-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.languages && (
                <p className="text-xs text-red-500 mt-0">{errors.languages}</p>
              )}

              {formData.languages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.languages.map((language) => (
                    <span
                      key={language}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Coverage Zone (Wilayas) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Coverage Zone (Wilayas)
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setWilayasOpen(!wilayasOpen)}
                  className="w-full px-4 py-2 border rounded-lg flex items-center justify-between hover:border-orange-500 transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                >
                  <span className="text-gray-700">
                    {formData.wilayas.length > 0
                      ? `${formData.wilayas.length} wilaya(s) selected`
                      : "Select wilayas"}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      wilayasOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {wilayasOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {wilayas.map((wilaya) => (
                      <div
                        key={wilaya}
                        onClick={() => toggleWilaya(wilaya)}
                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex items-center justify-between transition"
                      >
                        <span className="text-gray-700">{wilaya}</span>
                        {formData.wilayas.includes(wilaya) && (
                          <Check size={18} className="text-orange-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.wilayas && (
                <p className="text-xs text-red-500 mt-0">{errors.wilayas}</p>
              )}

              {formData.wilayas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.wilayas.map((wilaya) => (
                    <span
                      key={wilaya}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm font-medium"
                    >
                      {wilaya}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing Grid */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Pricing Grid
              </h3>

              {/* Half-day */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Half-day (≤ 4h)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="halfDayPrice"
                    value={formData.halfDayPrice}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    DZD
                  </span>
                </div>
                {errors.halfDayPrice && (
                  <p className="text-xs text-red-500 mt-0">
                    {errors.halfDayPrice}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  For tours up to 4 hours
                </p>
              </div>

              {/* Full-day */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full-day (4-8h)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullDayPrice"
                    value={formData.fullDayPrice}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    DZD
                  </span>
                </div>
                {errors.fullDayPrice && (
                  <p className="text-xs text-red-500 mt-0">
                    {errors.fullDayPrice}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  For tours lasting 4 to 8 hours
                </p>
              </div>

              {/* Additional hour */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Additional hour
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="additionalHourPrice"
                    value={formData.additionalHourPrice}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    DZD
                  </span>
                </div>
                {errors.additionalHourPrice && (
                  <p className="text-xs text-red-500 mt-0">
                    {errors.additionalHourPrice}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Beyond 8 hours</p>
              </div>
            </div>

            {/* global error notice */}
            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition-colors shadow-lg hover:shadow-xl"
              disabled={submitting}
            >
              <span className="drop-shadow-sm">
                {submitting ? "Signing up..." : "Sign up"}
              </span>
            </button>
            <div className="-mt-3 -mb-3 text-center text-sm text-gray-600">
              Already have an account?
              <a
                href="/signin"
                className="ml-1 text-orange-500 font-medium hover:underline"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
