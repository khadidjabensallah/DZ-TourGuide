import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthAPI } from "../../utils/api";

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show success message if redirected from verification
    if (location.state?.message) {
      setApiError(""); // Clear any errors
      // You can show a success message here if needed
    }
  }, [location]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 0) {
      setEmailError(!validateEmail(value));
    } else {
      setEmailError(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    if (!password) {
      setApiError("Password is required");
      return;
    }

    setSubmitting(true);
    setApiError("");

    try {
      const response = await AuthAPI.signin(email, password);

      if (response.success) {
        // Store user data in sessionStorage
        if (response.data) {
          sessionStorage.setItem('user', JSON.stringify(response.data));
          sessionStorage.setItem('is_authenticated', 'true');
        }
        
        // Redirect based on user type
        if (response.data?.user_type === 'guide') {
          navigate(`/guide/${response.data.user_id}/dashboard`);
        } else if (response.data?.user_type === 'tourist') {
          navigate('/'); // Or tourist dashboard
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setApiError(error.message || "Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          className="flex items-center text-gray-700 mb-6 hover:text-gray-900 transition-colors "
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            {/* Tguida Logo */}
            <div className="flex items-center justify-center mb-4">
              <img
                src="https://i.postimg.cc/gkjD1gq7/logo.png"
                alt="Tguida Logo"
                className="w-32 object-contain -my-12 -mt-13"
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
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-black-700 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] ${
                  emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500"
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-black-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            {/* Success Message */}
            {location.state?.message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {location.state.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-orange-500 py-2 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="drop-shadow-sm">
                {submitting ? "Signing in..." : "Sign In"}
              </span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an Account?{" "}
              <button
                onClick={() => navigate("/selectType")}
                className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
