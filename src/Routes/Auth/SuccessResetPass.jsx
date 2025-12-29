import React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PasswordChangedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex flex-col items-center justify-center min-h-screen relative">
        {/* Back Button */}
        <button
          className="absolute top-4 left-4 flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back</span>
        </button>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="rounded-full bg-white p-3 flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-blue-500" strokeWidth={2.5} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Password Changed
            </h1>
            <h2 className="text-4xl font-extrabold text-orange-500 mb-4">
              Successfully!
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 text-base mb-8">
              Your password has been reset
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}