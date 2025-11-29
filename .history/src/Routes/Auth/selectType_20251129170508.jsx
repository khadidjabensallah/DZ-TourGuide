import { MapPin, Plane } from "lucide-react";
import { useState } from "react";

export default function AccountCreation() {
  const [activeTab, setActiveTab] = useState("tourist");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm">
            Choose Your Role To Get Started
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3">
          {/* Guide Tab */}
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === "guide"
                ? "bg-white border-2 border-orange-500 text-gray-900 shadow-sm"
                : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Guide</span>
          </button>

          {/* Tourist Tab */}
          <button
            onClick={() => setActiveTab("tourist")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === "tourist"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Tourist</span>
          </button>
        </div>
      </div>
    </div>
  );
}
