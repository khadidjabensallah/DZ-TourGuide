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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="TGUIDA Logo"
            className="w-32 object-contain"
          />
        </div>
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl px-11 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-0">
              Bienvenue sur Tguida
            </h1>
            <p className="text-gray-600 mt-1">
              Discover Algeria with our certificated guides
            </p>
          </div>

          {/* Form Fields */}
          <div>
            {/* First Name */}
            <div className="mb-3">
              <label className="block text-gray-900 font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter Your name"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-0">{errors.firstName}</p>
              )}
            </div>

            {/* Family Name */}
            <div className="mb-3">
              <label className="block text-gray-900 font-semibold mb-2">
                Family Name
              </label>
              <input
                type="text"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                placeholder="Enter Your name"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.familyName ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]`}
              />
              {errors.familyName && (
                <p className="text-xs text-red-500 mt-0">{errors.familyName}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-gray-900 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-0">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-gray-900 font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="············"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12 autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              Sign Up
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
