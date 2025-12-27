import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Backend API base URL
const API_BASE_URL = "http://localhost:8000";

export default function SignInPage() {
  const navigate = useNavigate();

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
    setEmailError(value.length > 0 && !validateEmail(value));
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
    setErrorMessage("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/signin/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("isAuthenticated", "true");

        // Example redirect
        navigate("/dashboard");
      } else {
        setErrorMessage(data.message || "Sign in failed");
        if (data.message?.toLowerCase().includes("password")) {
          setPasswordError(data.message);
        }
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          className="flex items-center text-gray-700 mb-6 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="https://i.postimg.cc/gkjD1gq7/logo.png"
              alt="Tguida Logo"
              className="w-32 mx-auto -my-12"
            />
            <h1 className="text-3xl font-extrabold text-gray-900 mt-6">
              Bienvenue sur Tguida
            </h1>
            <p className="text-sm text-gray-600 font-bold">
              Discover Algeria with our certificated guides
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-sm ${
                  emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-500"
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-sm pr-10 ${
                    passwordError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
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
              {errorMessage && (
                <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
              )}

              {/* Forgot password */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgotpassword")}
                  className="text-xs text-orange-500 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full bg-orange-500 py-2 text-white font-semibold rounded-xl hover:bg-orange-600 ${
                isLoading && "opacity-70 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* Register */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => navigate("/selecttype")}
                className="text-orange-500 font-semibold"
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
