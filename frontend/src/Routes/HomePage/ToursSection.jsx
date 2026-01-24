import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star, Clock } from "lucide-react";
import { SearchAPI } from "../../utils/api";
import { useTranslation } from "react-i18next";


export default function PopularTours() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        // Using SearchAPI to get all tours (empty params)
        const response = await SearchAPI.searchTours({});
        if (response.success && response.tours) {
          // Verify we have an array
          setTours(response.tours.slice(0, 6)); // Show first 6 tours
        } else {
          setTours([]);
        }
      } catch (err) {
        console.error("Error fetching popular tours:", err);
        setError("Failed to load tours");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div id="tours" className="py-16 px-8 bg-blue-50 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="mt-2 text-slate-600">{t('tours.loadingTours')}</p>
      </div>

    );
  }

  // Fallback if error or no tours
  if (error || tours.length === 0) {
    // You might want to show nothing, or the static mock data as fallback.
    // For now, let's show a message so the user knows it tried to fetch.
    return (
      <div id="tours" className="py-16 px-8 bg-blue-50 text-center">
        <p className="text-slate-600">{t('tours.noTours')}</p>
      </div>

    );
  }

  return (
    <div id="tours" className="py-16 px-8 bg-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-0">
          <span className="inline-block bg-orange-100 text-orange-600 px-6 py-2 rounded-full text-sm font-semibold mb-4">
            {t('tours.popularTours')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('tours.discoverBest')}{" "}
            <span className="text-orange-500">{t('tours.inTheWorld')}</span>
          </h2>
          <p className="text-slate-600 text-[14px] max-w-2xl mx-auto font-semibold">
            {t('tours.tagline')}
          </p>
        </div>


        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-8">
          {tours.map((tour) => (
            <div
              key={tour.id}
              onClick={() => navigate(`/tour/${tour.id}`)}
              role="button"
              className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tour.cover_photo || "https://via.placeholder.com/800x600?text=Tour+Image"}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=Tour+Image"; }}
                />
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  {parseFloat(tour.calculated_price).toLocaleString()} DZD
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {tour.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {tour.description}
                </p>

                {/* Location and Date */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{tour.wilaya?.name || tour.location || "Algeria"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span>{tour.date}</span>
                  </div>
                </div>

                {/* Guide Info */}
                <div className="flex items-center justify-between">
                  {tour.guide && (
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:bg-orange-50 p-1 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/guide/${tour.guide.id}/profile`);
                      }}
                    >
                      <img
                        src={tour.guide.photo_url || "https://via.placeholder.com/150?text=Guide"}
                        alt={tour.guide.firstname}
                        className="w-10 h-10 rounded-full border-2 border-orange-500"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Guide"; }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {tour.guide.firstname} {tour.guide.lastname}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-slate-600">
                            {parseFloat(tour.average_rating || 0).toFixed(1)} ({tour.number_of_reviews || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-end gap-1 text-orange-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {parseFloat(tour.estimated_duration).toFixed(0)}h
                      </span>
                    </div>
                    {tour.scheduled_time && (
                      <span className="text-xs font-medium text-slate-500">
                        {t('tours.startsAt')} {tour.scheduled_time.substring(0, 5)}
                      </span>
                    )}

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Tours Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/searchPage')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            {t('tours.moreTours')}
          </button>

        </div>
      </div>
    </div>
  );
}
