import { KeyRound } from "lucide-react";
import { useState } from "react";

export default function VerifyEmailPass() {
  const [email, setEmail] = useState("");

  const handleNext = () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    console.log("Email:", email);
    // Add your verification logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        {/* Back Button - Top Left Outside Card */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full">
            <KeyRound className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Your Password?
          </h1>
          <p className="text-lg font-medium bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            No worries, We got you.
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mb-4"
        >
          Next
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
            >
              Resend Code
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}