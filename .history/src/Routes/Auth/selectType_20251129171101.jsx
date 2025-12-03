import { MapPin, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SelectType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm">
            Choose Your Role To Get Started
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-4">
          {/* Guide Tab */}
          <button
            onClick={() => navigate("/SignUpGuideP1")}
            className="flex-1 py-5 px-6 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
          >
            <MapPin className="w-5 h-5" />
            <span>Guide</span>
          </button>

          {/* Tourist Tab */}
          <button
            onClick={() => navigate("/SignUpTourist")}
            className="flex-1 py-5 px-6 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
          >
            <Plane className="w-5 h-5" />
            <span>Tourist</span>
          </button>
        </div>
      </div>
    </div>
  );
}
