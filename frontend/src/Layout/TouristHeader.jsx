import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, History, Search } from "lucide-react";
import logo from "../assets/logo.png";

const TouristHeader = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/signin");
    };

    const isProfilePage = location.pathname === "/tourist/profile";

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="DZ-TourGuide Logo" className="h-10 w-auto" />
                    </Link>

                    <nav className="flex gap-6">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Search size={18} />
                            <span>Explore tours</span>
                        </Link>

                        <Link
                            to="/tourist/profile"
                            onClick={() => onTabChange && onTabChange("profile")}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isProfilePage && activeTab === "profile"
                                    ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <User size={18} />
                            <span>My Profile</span>
                        </Link>

                        <Link
                            to="/tourist/profile"
                            onClick={() => onTabChange && onTabChange("history")}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isProfilePage && activeTab === "history"
                                    ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <History size={18} />
                            <span>Tour History</span>
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Log out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TouristHeader;
