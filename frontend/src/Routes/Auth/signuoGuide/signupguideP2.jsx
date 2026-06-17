import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";

import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { SERVER_ORIGIN } from "../../../utils/api";


export default function SignUpGuideP2() {
  const { t } = useTranslation();
  const [languagesOpen, setLanguagesOpen] = useState(false);

  const [wilayasOpen, setWilayasOpen] = useState(false);

  const [formData, setFormData] = useState({
    languages: [],
    wilayas: [],
    biography: "",
    halfDayPrice: "",
    fullDayPrice: "",
    additionalHourPrice: "",
    customRequestMarkup: "",
  });

  const [page1Data, setPage1Data] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location && location.state) {
      setPage1Data(location.state);
    } else {
      setPage1Data(null);
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
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa",
    "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa",
    "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel",
    "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès",
    "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
    "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun",
    "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
    "Aïn Salah", "Aïn Guezzam", "Touggourt", "Djanet",
    "El M'Ghair", "El Menia",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (["halfDayPrice", "fullDayPrice", "additionalHourPrice"].includes(name)) {
      val = value.replace(/\D/g, "");
      val = val.replace(/^0+(?=\d)/, "");
    }

    if (name === "customRequestMarkup") {
      val = value.replace(/[^\d.]/g, "");
      const parts = val.split(".");
      if (parts.length > 2) {
        val = parts[0] + "." + parts.slice(1).join("");
      }
      if (parts[1] && parts[1].length > 2) {
        val = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleLanguage = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
    setErrors((prev) => ({ ...prev, languages: undefined }));
  };

  const toggleWilaya = (wilaya) => {
    setFormData((prev) => ({
      ...prev,
      wilayas: prev.wilayas.includes(wilaya)
        ? prev.wilayas.filter((w) => w !== wilaya)
        : [...prev.wilayas, wilaya],
    }));
    setErrors((prev) => ({ ...prev, wilayas: undefined }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.languages || formData.languages.length === 0)
      newErrors.languages = t('guide.selectOneLanguage');


    if (!formData.wilayas || formData.wilayas.length === 0)
      newErrors.wilayas = t('guide.selectOneWilaya');


    ["halfDayPrice", "fullDayPrice", "additionalHourPrice"].forEach((k) => {
      const v = (formData[k] || "").trim();
      if (!v) newErrors[k] = t('guide.enterPrice');
      else if (!/^\d+$/.test(v)) newErrors[k] = t('guide.priceMustBeNumber');
      else if (Number(v) <= 0) newErrors[k] = t('guide.priceGreaterThanZero');
    });


    const markup = (formData.customRequestMarkup || "").trim();
    if (!markup) {
      newErrors.customRequestMarkup = t('guide.enterMarkup');
    } else if (!/^\d+(\.\d{1,2})?$/.test(markup)) {
      newErrors.customRequestMarkup = t('guide.invalidMarkup');
    } else if (Number(markup) < 0 || Number(markup) > 100) {
      newErrors.customRequestMarkup = t('guide.markupRange');
    }




    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    if (!page1Data) {
      setApiError(t('guide.missingInfo') || "Missing information from previous step. Please go back and fill the form again.");
      return;
    }



    setSubmitting(true);
    setApiError("");

    try {
      const mergedData = { ...page1Data, ...formData };
      const formDataToSend = new FormData();

      formDataToSend.append('firstname', mergedData.firstName);
      formDataToSend.append('lastname', mergedData.familyName);
      formDataToSend.append('email', mergedData.email);
      formDataToSend.append('password', mergedData.password);
      formDataToSend.append('confirm_password', mergedData.confirmPassword);
      formDataToSend.append('phone', mergedData.phone);
      formDataToSend.append('biography', mergedData.biography || '');
      formDataToSend.append('half_day_price', mergedData.halfDayPrice);
      formDataToSend.append('full_day_price', mergedData.fullDayPrice);
      formDataToSend.append('additional_hour_price', mergedData.additionalHourPrice);
      formDataToSend.append('custom_request_markup', mergedData.customRequestMarkup);

      mergedData.languages.forEach(lang => {
        formDataToSend.append('languages', lang);
      });

      mergedData.wilayas.forEach(wilaya => {
        formDataToSend.append('coverage_wilayas', wilaya);
      });

      if (mergedData.certificates && mergedData.certificates.length > 0) {
        mergedData.certificates.forEach(file => {
          formDataToSend.append('certification_files', file);
        });
      }

      const response = await fetch(`${SERVER_ORIGIN}/api/signup/guide/`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);

      if (data.success) {
        if (data.data?.user_id) {
          sessionStorage.setItem('pending_verification_user_id', data.data.user_id);
          sessionStorage.setItem('user_email', data.data.email);
        }
        // Navigate to verification page with email + message
        navigate('/verifyEmail', { state: { email: data.data?.email, message: data.message } });
      } else {
        const errorMsg = data.errors
          ? Object.entries(data.errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
          : data.message || 'Signup failed';
        setApiError(errorMsg);
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">{t('auth.back')}</span>
          </button>


        </div>

        <div className="w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">TGUIDA</span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {t('guide.completeProfile')}
            </h1>
            <p className="text-sm text-gray-600 font-bold">
              {t('guide.tellServices')}
            </p>
          </div>



          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t('guide.biography')}
              </label>


              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder={t('guide.bioPlaceholder')}
                rows={3}


                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t('guide.languagesSpoken')} *
              </label>


              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLanguagesOpen(!languagesOpen)}
                  className={`w-full px-4 py-2 border rounded-lg flex items-center justify-between hover:border-orange-500 transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.languages ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <span className="text-gray-700">
                    {formData.languages.length > 0
                      ? t('guide.languagesSelected', { count: formData.languages.length })
                      : t('guide.selectLanguages')}
                  </span>


                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${languagesOpen ? "rotate-180" : ""
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
                <p className="text-xs text-red-500 mt-1">{errors.languages}</p>
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

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t('guide.coverageZone')} *
              </label>


              <div className="relative">
                <button
                  type="button"
                  onClick={() => setWilayasOpen(!wilayasOpen)}
                  className={`w-full px-4 py-2 border rounded-lg flex items-center justify-between hover:border-orange-500 transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.wilayas ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <span className="text-gray-700">
                    {formData.wilayas.length > 0
                      ? t('guide.wilayasSelected', { count: formData.wilayas.length })
                      : t('guide.selectWilayas')}
                  </span>


                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${wilayasOpen ? "rotate-180" : ""
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
                <p className="text-xs text-red-500 mt-1">{errors.wilayas}</p>
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

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t('guide.pricingGrid')}
              </h3>



              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t('guide.halfDay')} *
                </label>


                <div className="relative">
                  <input
                    type="text"
                    name="halfDayPrice"
                    value={formData.halfDayPrice}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    placeholder="e.g., 5000"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-16 ${errors.halfDayPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                      }`}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    DZD
                  </span>
                </div>
                {errors.halfDayPrice && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.halfDayPrice}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('guide.halfDayDesc')}
                </p>
              </div>


              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t('guide.fullDay')} *
                </label>


                <div className="relative">
                  <input
                    type="text"
                    name="fullDayPrice"
                    value={formData.fullDayPrice}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    placeholder="e.g., 8000"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-16 ${errors.fullDayPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                      }`}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    DZD
                  </span>
                </div>
                {errors.fullDayPrice && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.fullDayPrice}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('guide.fullDayDesc')}
                </p>
              </div>


              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t('guide.additionalHour')} *
                </label>


                <div className="relative">
                  <input
                    type="text"
                    name="additionalHourPrice"
                    value={formData.additionalHourPrice}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    placeholder="e.g., 1500"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-16 ${errors.additionalHourPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                      }`}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    {t('common.dzd')}
                  </span>
                </div>


                {errors.additionalHourPrice && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.additionalHourPrice}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">{t('guide.additionalHourDesc')}</p>
              </div>


              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t('guide.customMarkup')} *
                </label>


                <div className="relative">
                  <input
                    type="text"
                    name="customRequestMarkup"
                    value={formData.customRequestMarkup}
                    onChange={handleInputChange}
                    inputMode="decimal"
                    placeholder="e.g., 15.00"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-12 ${errors.customRequestMarkup
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                      }`}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    %
                  </span>
                </div>
                {errors.customRequestMarkup && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.customRequestMarkup}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('guide.customMarkupDesc')}
                </p>
              </div>


            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <button
              onClick={handleSignUp}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              <span className="drop-shadow-sm">
                {submitting ? t('auth.creatingAccount') : t('auth.signUp')}
              </span>
            </button>



            <div className="text-center text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}
              <button
                onClick={() => navigate("/signin")}
                className="ml-1 text-orange-500 font-medium hover:underline bg-none border-none cursor-pointer"
              >
                {t('auth.signIn')}
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}