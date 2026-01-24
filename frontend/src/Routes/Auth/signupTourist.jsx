import logo from "../../assets/logo.png";
import React, { useState } from "react";
import { Eye, EyeOff, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../utils/api";
import { useTranslation } from "react-i18next";


export default function SignUpTourist() {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("tourist");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    firstName: "",
    familyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationality: "", // Optional field
  });

  // validation errors state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // DON'T clear errors here - only show on submit
  };

  // validate all fields (only on submit)
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = t('auth.firstNameRequired');

    if (!formData.familyName.trim())
      newErrors.familyName = t('auth.familyNameRequired');

    if (!formData.email.trim()) newErrors.email = t('auth.emailRequired');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = t('auth.validEmailRequired');

    if (!formData.password) newErrors.password = t('auth.passwordRequired');
    else if (formData.password.length < 8)
      newErrors.password = t('auth.passwordTooShort');

    // confirm password validation
    if (!formData.confirmPassword) newErrors.confirmPassword = t('auth.confirmPasswordRequired');
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = t('auth.passwordsDoNotMatch');



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // validate all fields only when submit is clicked
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");

    try {
      // Map frontend field names to backend field names
      const signupData = {
        firstname: formData.firstName,
        lastname: formData.familyName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        nationality: formData.nationality || "", // Optional
      };

      const response = await AuthAPI.signupTourist(signupData);

      if (response.success) {
        // Store user_id for email verification
        if (response.data?.user_id) {
          sessionStorage.setItem('pending_verification_user_id', response.data.user_id);
          sessionStorage.setItem('user_email', response.data.email);
        }
        // Navigate to verification page
        navigate("/verifyEmail", {
          state: {
            email: response.data?.email,
            message: response.message
          }
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setApiError(error.message || t('auth.signupFailed'));
    } finally {


      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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
              {t('auth.welcome')}
            </h1>
            <p className="text-sm text-gray-600 font-bold">
              {t('auth.discoverAlgeria')}
            </p>
          </div>


          {/* Form Fields */}
          <div className="space-y-4 max-w-md mx-auto">
            {/* First Name */}
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

                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${errors.firstName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-0">{errors.firstName}</p>
              )}

            </div>

            {/* Family Name */}
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

                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${errors.familyName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
              />
              {errors.familyName && (
                <p className="text-xs text-red-500 mt-0">{errors.familyName}</p>
              )}

            </div>

            {/* Email */}
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

                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-0">{errors.email}</p>
              )}

            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t('auth.password')}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-10 autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${errors.password
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
                <p className="text-xs text-red-500 mt-0">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t('auth.confirmPassword')} *
              </label>


              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-10 autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-orange-500"
                  }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-0">{errors.confirmPassword}</p>
              )}
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-orange-500 py-2 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="drop-shadow-sm">
                {submitting ? t('auth.creatingAccount') : t('auth.signUp')}
              </span>
            </button>


            {/* Already have an account */}
            <div className="mt-0 -mb-2 text-center text-sm text-gray-600">
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
