import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

// Backend API base URL - adjust this to match your Django server
const API_BASE_URL = "http://localhost:8000";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrorMessage("");
    if (value.length > 0) {
      setEmailError(!validateEmail(value));
    } else {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage("");
    setPasswordError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Reset errors
    setErrorMessage("");
    setPasswordError("");

    // Validate email
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    // Validate password
    if (!password || password.trim() === "") {
      setPasswordError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData to send to backend
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);

      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/signin/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("isAuthenticated", "true");

        // Navigate based on user type
        console.log("Login successful:", data.data.user_type);
      } else {
        setErrorMessage(data.message || "Sign in failed. Please try again.");
        if (data.message?.includes("password")) {
          setPasswordError(data.message);
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // Add your forgot password logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          className="flex items-center text-gray-700 mb-6 hover:text-gray-900 transition-colors"
          onClick={() => console.log("Back clicked")}
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
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm ${
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
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all text-sm pr-10 ${
                    passwordError
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
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}

              {/* General Error Message */}
              {errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
              )}

              {/* Forgot Password Link */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full bg-orange-500 py-2 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <span className="drop-shadow-sm">
                {isLoading ? "Signing in..." : "Sign In"}
              </span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an Account?{" "}
              <button
                onClick={() => console.log("Register clicked")}
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
