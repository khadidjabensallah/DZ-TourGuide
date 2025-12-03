import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#edf3fd] border-gray-200">
      <nav className="max-w-7xl mx-auto  px-2.5">
        <div className="flex items-center justify-between h-16 relative">
          <div className="flex items-center -ml-4">
            <img
              src={logo}
              alt="Tguida_Logo"
              className="w-44 h-44 object-cover"
            />
          </div>
          <div className="hidden md:flex gap-15 absolute left-1/2 -translate-x-1/2">
            <a
              href="/example"
              className="text-[#004DC7] hover:text-[#E74B02] font-medium text-base duration-255"
            >
              Home
            </a>
            <a
              href="/example"
              className="text-[#004DC7] hover:text-[#E74B02] font-medium text-base duration-255"
            >
              Explore
            </a>
            <a
              href="/example"
              className="text-[#004DC7] hover:text-[#E74B02] font-medium text-base duration-255"
            >
              About
            </a>
            <a
              href="/example"
              className="text-[#004DC7] hover:text-[#E74B02] font-medium text-base duration-255"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-orange-500 hover:text-orange-600 p-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <button
              className="px-7 py-2 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 text-sm"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>

            <button className="px-7 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 text-sm">
              Sign Up
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
