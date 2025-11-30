import logo from "../../assets/logo.png";
import React, { useState } from "react";
import { Eye, EyeOff, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("tourist");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    firstName: "",
    familyName: "",
    email: "",
    password: "",
  });

  // validation errors state
  const [errors, setErrors] = useState({});

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
      newErrors.firstName = "First name is required";
    if (!formData.familyName.trim())
      newErrors.familyName = "Family name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // validate all fields only when submit is clicked
    if (!validate()) return;

    console.log("Form submitted:", { ...formData, accountType });
    // proceed to next step or API call
    navigate("/verifyEmail");
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
              Bienvenue sur Tguida
            </h1>
            <p className="text-sm text-gray-600 font-bold">
              Discover Algeria with our certificated guides
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 max-w-md mx-auto">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter Your name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                  errors.firstName
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
                Family Name
              </label>
              <input
                type="text"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                placeholder="Enter Your name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm   ${
                  errors.familyName
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
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                  errors.email
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
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-10 autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                    errors.password
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

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 py-2 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              <span className="drop-shadow-sm">Sign Up</span>
            </button>

            {/* Already have an account */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?
              <button
                onClick={() => navigate("/signin")}
                className="ml-1 text-orange-500 font-medium hover:underline bg-none border-none cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
