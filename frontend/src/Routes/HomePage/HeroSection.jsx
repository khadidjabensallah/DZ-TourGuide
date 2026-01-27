import React, { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cercle from "../../assets/cercle.png";
import Pics from "../../assets/pics.png";




export default function AlgeriaHero() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGetStarted = () => {

    // Navigate to SearchPage with query parameters
    const queryParams = new URLSearchParams();
    if (location) queryParams.append('q', location);
    if (date) queryParams.append('date_from', date);

    navigate(`/searchPage?${queryParams.toString()}`);
  };


  return (
    <div
      className="min-h-screen p-8 md:p-16"
      style={{ backgroundColor: "#FAF5F1" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center -mt-[65px]">
          {/* Left Content */}
          <div className="space-y-8 ">
            <div className="space-y-4 ">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mt-[2rem] -ml-3">
                {t('hero.discover')}
                <br />
                {t('hero.algerias')}
                <span className="relative inline-block mx-3">
                  <span className="relative z-10 text-orange-500">{t('hero.hidden')}</span>
                  <img
                    src={cercle}
                    alt="circle decoration"
                    className="absolute -top-2 -left-4 w-[calc(100%+2rem)] h-[calc(100%+1rem)] object-contain"
                  />
                </span>
                <br />
                {t('hero.wonders')}
              </h1>


              <div className="space-y-1 text-color: black -mt-2 -ml-3">
                <p className="text-lg md:text-[17px] font-semibold">
                  {t('hero.tagline1')}
                </p>
                <p className="text-lg md:text-[17px] font-semibold">
                  {t('hero.tagline2')}
                </p>
                <p className="text-lg md:text-[17px] font-semibold">
                  {t('hero.tagline3')}
                </p>
              </div>

            </div>

            {/* Search Box */}
            <div
              className="bg-white rounded-2xl p-4 border border-slate-200"
              style={{
                boxShadow: "0px 4px 21.5px 2px rgba(46, 127, 255, 0.46)",
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Location Input */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-orange-500 p-3 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-900 mb-1">
                      {t('hero.location')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('hero.locationPlaceholder')}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-slate-400 text-sm border-0 focus:outline-none bg-transparent placeholder:text-slate-400"
                    />

                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-12 bg-slate-200"></div>

                {/* Date Input */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-orange-500 p-3 rounded-full flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-900 mb-1">
                      {t('hero.selectDate')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('hero.datePlaceholder')}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-slate-400 text-sm border-0 focus:outline-none bg-transparent placeholder:text-slate-400"
                    />

                  </div>
                </div>

                {/* Get Started Button */}
                <button
                  onClick={handleGetStarted}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
                >
                  {t('hero.getStarted')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Image Gallery */}
          <div
            className="relative hidden lg:block -ml-[167px]"
            style={{
              width: "789px",
              height: "618px",
            }}
          >
            <img
              src={Pics}
              alt="Algeria Travel Gallery"
              className="w-full h-full object-contain mt-[30px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
