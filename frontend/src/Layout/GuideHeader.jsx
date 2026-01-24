import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Settings, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";


const GuideHeader = ({ showBackButton = false, title = "DZ-TourGuide" }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const location = useLocation();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/signin");
    };

    const navLinks = [
        { name: t('profile.reservations'), path: "/guide/tours?tab=reservations" },
        { name: t('profile.myProfile'), path: "/GuideProfileG" },
        { name: t('profile.myTours'), path: "/guide/tours?tab=tours" },
    ];



    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {showBackButton ? (
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="font-medium">{t('auth.back')}</span>
                        </button>

                    ) : (
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="DZ-TourGuide Logo" className="h-10 w-auto" />
                        </Link>
                    )}

                    <nav className="hidden md:flex gap-6">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors ${isActive
                                        ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/editProfile"
                        className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                    >
                        <Settings size={18} />
                        <span>{t('profile.settings')}</span>
                    </Link>


                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium transition-colors shadow-sm"
                    >
                        {t('common.logout')}
                    </button>


                </div>
            </div>
        </header>
    );
};

export default GuideHeader;
