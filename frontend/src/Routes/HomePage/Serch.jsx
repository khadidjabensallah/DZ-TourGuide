import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, Calendar, Star } from "lucide-react";
import { SearchAPI } from "../../utils/api";

// Tour Card Component
const TourCard = ({ tour }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/tour/${tour.id}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.cover_photo || "https://via.placeholder.com/500x300?text=Tour+Image"}
          alt={tour.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/500x300?text=Tour+Image";
          }}
        />
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
          {parseFloat(tour.calculated_price).toLocaleString()} DZD
        </div>
        {/* Available Places Badge */}
        {tour.available_places <= 5 && tour.available_places > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-medium text-xs shadow-md">
            Only {tour.available_places} left!
          </div>
        )}
        {tour.available_places === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-xl">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">{tour.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {tour.description}
        </p>

        {/* Location and Date */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>{tour.wilaya.name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{tour.date}</span>
          </div>
        </div>

        {/* Guide Info */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-orange-50 p-1 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/guide/${tour.guide.id}/profile`);
            }}
          >
            <img
              src={tour.guide.photo_url || "https://via.placeholder.com/100?text=Guide"}
              alt={`${tour.guide.firstname} ${tour.guide.lastname}`}
              className="w-10 h-10 rounded-full border-2 border-orange-500"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100?text=Guide";
              }}
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {tour.guide.firstname} {tour.guide.lastname}
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-slate-600">
                  {parseFloat(tour.average_rating).toFixed(1)} ({tour.number_of_reviews})
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-orange-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {parseFloat(tour.estimated_duration).toFixed(0)}h
              </span>
            </div>
            {tour.scheduled_time && (
              <span className="text-xs font-medium text-slate-500">
                Starts at {tour.scheduled_time.substring(0, 5)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tours from backend
  const fetchTours = async (query = "") => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      // Only send query if it exists
      if (query.trim()) {
        params.q = query.trim();
      }

      // Use standard SearchAPI
      const data = await SearchAPI.searchTours(params);

      if (data.success && data.tours) {
        setTours(data.tours);
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      // More user friendly error
      setError('Failed to fetch tours. Please try again later.');
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTours(searchQuery);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Load all tours on component mount
  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-orange-50 to-white">
      {/* Hero Section */}
      <div className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Discover{" "}
            <span className="text-orange-500">Algeria</span>
          </h1>
          <p className="text-gray-700 text-xl max-w-3xl mx-auto mb-12">
            Search by guide name, location, language, or tour name
          </p>

          {/* Simple Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for tours, guides, cities, or languages..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-16 pr-6 py-6 border-2 border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-500 text-lg shadow-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {/* Example Searches */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-gray-600">Try:</span>
            <button
              onClick={() => {
                setSearchQuery("Algiers");
                fetchTours("Algiers");
              }}
              className="text-sm px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-orange-50 hover:border-orange-400 transition-colors"
            >
              Algiers
            </button>
            <button
              onClick={() => {
                setSearchQuery("French");
                fetchTours("French");
              }}
              className="text-sm px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-orange-50 hover:border-orange-400 transition-colors"
            >
              French
            </button>
            <button
              onClick={() => {
                setSearchQuery("hiking");
                fetchTours("hiking");
              }}
              className="text-sm px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-orange-50 hover:border-orange-400 transition-colors"
            >
              hiking
            </button>
            <button
              onClick={() => {
                setSearchQuery("Oran");
                fetchTours("Oran");
              }}
              className="text-sm px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-orange-50 hover:border-orange-400 transition-colors"
            >
              Oran
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 pb-20">
        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-8 text-center">
            <p className="text-gray-600 text-lg">
              {tours.length > 0 ? (
                <>
                  Found <span className="font-bold text-orange-500">{tours.length}</span> tour{tours.length !== 1 ? 's' : ''}
                  {searchQuery && <> for "<span className="font-semibold">{searchQuery}</span>"</>}
                </>
              ) : searchQuery ? (
                <>No tours found for "<span className="font-semibold">{searchQuery}</span>"</>
              ) : (
                <>Showing all available tours</>
              )}
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">Searching for tours...</h2>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-block mb-8">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-red-100 rounded-full opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-32 h-32 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tours</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchTours(searchQuery)}
              className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block mb-12">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-orange-100 rounded-full opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-32 h-32 text-orange-300" />
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {searchQuery ? "No Tours Found" : "No Tours Available"}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `We couldn't find any tours matching "${searchQuery}". Try searching for a different location, guide, or language.`
                : "No tours are currently available. Please check back later!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  fetchTours("");
                }}
                className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                Show All Tours
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;