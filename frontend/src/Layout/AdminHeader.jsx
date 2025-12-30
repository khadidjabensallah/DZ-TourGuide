import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, UserCheck, AlertTriangle, Users } from "lucide-react";
import logo from "../assets/logo.png";

const AdminHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/signin");
    };

    const navLinks = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Guide Validation", path: "/admin/guides-validation", icon: <UserCheck size={18} /> },
        { name: "Reports", path: "/admin/reports", icon: <AlertTriangle size={18} /> },
        { name: "User Management", path: "/admin/users", icon: <Users size={18} /> },
    ];

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="DZ-TourGuide Logo" className="h-10 w-auto" />
                    </Link>

                    <nav className="hidden lg:flex gap-6">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                                            ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                                            : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right mr-2">
                        <p className="text-sm font-medium text-gray-900">Administrator</p>
                        <p className="text-xs text-gray-500">Admin Panel</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold">A</span>
                    </div>
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

export default AdminHeader;
