import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";


export default function Header() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };


  const scrollToSection = (id) => {
    // if not on home, navigate there first
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.location.hash = `#${id}`;
      }, 120);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.hash = `#${id}`;
    }
  };

  return (
    <header
      className="border-gray-200"
      style={{ backgroundColor: "#FFFFFFFF" }}
    >
      <nav className="max-w-7xl mx-auto px-2.5">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <div className="flex items-center -ml-4">
            <img
              src={logo}
              alt="Tguida_Logo"
              className="w-44 h-44 object-cover"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-15 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => navigate("/")}
              className="text-[#004DC7] hover:text-[#E74B02] font-medium text-base duration-255"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection("tours")}
              className="text-[#004DC7] hover:text-[#E74B02] font-medium text-base duration-255"
            >
              {t('nav.explore')}
            </button>
            <button
              onClick={() => scrollToSection("destinations")}
              className="text-[#004DC7] hover:text-[#E74B02] font-medium text-base duration-255"
            >
              {t('nav.about')}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-[#004DC7] hover:text-[#E74B02] font-medium text-base duration-255"
            >
              {t('nav.contact')}
            </button>

          </div>

          {/* Right Buttons - vary by auth state */}
          <div className="flex items-center gap-3">
            <button
              className="text-orange-500 hover:text-orange-600 p-1"
              onClick={() => navigate("/searchPage")}
            >
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

            {/* Language Switcher */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className="bg-transparent text-sm font-medium text-[#004DC7] cursor-pointer outline-none border-none hover:text-orange-500"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>


            {/* Guest: show Sign In / Sign Up */}
            {!user && (
              <>
                <button
                  className="px-7 py-2 border-2 border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 text-sm"
                  onClick={() => navigate("/signin")}
                >
                  {t('nav.signIn')}
                </button>

                <button
                  className="px-7 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 text-sm"
                  onClick={() => navigate("/selectType")}
                >
                  {t('nav.signUp')}
                </button>

              </>
            )}

            {/* Guide: show Add a Tour + profile pic */}
            {user && (user.role === "guide" || user.user_type === "guide") && (
              <>
                <button
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 text-sm"
                  onClick={() => navigate("/createtour")}
                >
                  {t('nav.addTour')}
                </button>


                <button
                  onClick={() => navigate("/GuideProfileG")}
                  className="relative w-10 h-10 rounded-full overflow-hidden ml-2 flex items-center justify-center bg-gray-100 border border-gray-200"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.firstname || user.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-orange-500 font-bold uppercase">
                      {(user.firstname?.[0] || user.name?.[0] || "G")}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Tourist: show only profile pic */}
            {user && (user.role === "tourist" || user.user_type === "tourist") && (
              <button
                onClick={() => navigate("/tourist/profile")}
                className="relative w-10 h-10 rounded-full overflow-hidden ml-2 flex items-center justify-center bg-gray-100 border border-gray-200"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.firstname || user.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                ) : (
                  <span className="text-orange-500 font-bold uppercase">
                    {(user.firstname?.[0] || user.name?.[0] || "T")}
                  </span>
                )}
              </button>
            )}

            {/* Admin: show dashboard link */}
            {user && (user.role === "admin" || user.user_type === "admin") && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="relative w-10 h-10 rounded-full overflow-hidden ml-2 flex items-center justify-center bg-gray-100 border border-gray-200"
              >
                <span className="text-orange-500 font-bold uppercase">
                  {(user.firstname?.[0] || user.name?.[0] || "A")}
                </span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}