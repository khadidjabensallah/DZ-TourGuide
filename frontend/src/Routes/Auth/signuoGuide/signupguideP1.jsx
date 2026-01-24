import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";



export default function SignUpGuideP1() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    familyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    certificates: [],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "phone") {
      val = value.replace(/\D/g, "").slice(0, 9);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        certificates: [...prev.certificates, ...files],
      }));
      setErrors((prev) => ({ ...prev, certificates: undefined }));
    }
  };

  const removeCertificate = (index) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = t('auth.firstNameRequired');

    if (!formData.familyName.trim())
      newErrors.familyName = t('auth.familyNameRequired');

    if (!formData.email.trim())
      newErrors.email = t('auth.emailRequired');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = t('auth.validEmailRequired');

    if ((formData.phone || "").length !== 9)
      newErrors.phone = t('auth.phoneInvalid');

    if (!formData.password)
      newErrors.password = t('auth.passwordRequired');
    else if (formData.password.length < 8)
      newErrors.password = t('auth.passwordTooShort');

    if (!formData.confirmPassword)
      newErrors.confirmPassword = t('auth.confirmPasswordRequired');
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch');

    if (formData.certificates.length === 0)
      newErrors.certificates = t('auth.certificatesRequired');


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Navigate to page 2 with form data
    navigate("/SignUpGuideP2", { state: formData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">TGUIDA</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {t('auth.welcome')}
          </h1>
          <p className="text-sm text-gray-600 font-bold">
            {t('auth.discoverAlgeria')}
          </p>
        </div>


        <div className="space-y-4 max-w-md mx-auto">
          {/* FIRST NAME */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('auth.firstName')} *
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={t('auth.firstNamePlaceholder')}

              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-orange-500"
                }`}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* FAMILY NAME */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('auth.familyName')} *
            </label>

            <input
              type="text"
              name="familyName"
              value={formData.familyName}
              onChange={handleInputChange}
              placeholder={t('auth.familyNamePlaceholder')}

              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${errors.familyName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-orange-500"
                }`}
            />
            {errors.familyName && (
              <p className="text-xs text-red-500 mt-1">{errors.familyName}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('auth.email')} *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('auth.emailPlaceholder')}

              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-orange-500"
                }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('auth.phone')} *
            </label>

            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm">
                +213
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t('auth.phonePlaceholder')}
                maxLength={9}

                className={`w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('auth.password')} *
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-10 ${errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('auth.confirmPassword')} *
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-10 ${errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* CERTIFICATES */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('auth.uploadCertificates')} *
            </label>

            <div className="relative">
              <input
                type="file"
                id="certificates"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              />
              <label
                htmlFor="certificates"
                className={`w-full px-4 py-3 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-500 transition ${errors.certificates ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <Upload size={20} className="text-gray-400 mr-2" />
                <span className="text-gray-500 text-sm">
                  {t('auth.clickToUpload')}
                </span>
              </label>

              {errors.certificates && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.certificates}
                </p>
              )}
            </div>

            {/* Display uploaded certificates */}
            {formData.certificates.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.certificates.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCertificate(index)}
                      className="ml-2 text-red-500 hover:text-red-700 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NEXT BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 py-3 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <span className="drop-shadow-sm">{t('auth.next')}</span>
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
  );
}