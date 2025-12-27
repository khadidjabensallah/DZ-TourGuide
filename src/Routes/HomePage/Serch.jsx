import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, MapPin, Clock, Calendar } from "lucide-react";

// Import your existing Header component
// Update the path based on your project structure
import Header from "../../Layout/Header";
import { useNavigate } from "react-router-dom";

// Tour Card Component
const TourCard = ({ tour }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/tour/${tour.id}`)}
      role="button"
      className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
          {tour.price}
        </div>
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
            <span>{tour.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{tour.date}</span>
          </div>
        </div>

        {/* Guide Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={tour.guide.avatar}
              alt={tour.guide.name}
              className="w-10 h-10 rounded-full border-2 border-orange-500"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {tour.guide.name}
              </p>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-sm text-slate-600">
                  {tour.guide.rating} ({tour.guide.reviews})
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">{tour.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  // ⚠️ IMPORTANT: Define toursData BEFORE using it in useState
  const toursData = [
    {
      id: 1,
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      image:
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80",
      badge: "EXPLORE",
      location: "Alger",
      duration: "Half Day",
      date: "XX/XX/XXXX",
      price: "5,000",
      guide: {
        name: "Hamid Benali",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 4.5,
        reviews: 89,
      },
    },
    {
      id: 2,
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      image:
        "https://images.unsplash.com/photo-1581974206778-be5cd0e1d5ca?w=500&q=80",
      badge: "EXPLORE",
      location: "Alger",
      duration: "Full Day",
      date: "XX/XX/XXXX",
      price: "7,000",
      guide: {
        name: "Hamid Benali",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 4.5,
        reviews: 60,
      },
    },
    {
      id: 3,
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      image:
        "https://images.unsplash.com/photo-1583055298928-1f18d1c25e37?w=500&q=80",
      badge: "POPULAR",
      location: "Alger",
      duration: "Half Day",
      date: "XX/XX/XXXX",
      price: "4,500",
      guide: {
        name: "Naosima Bouazza",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        rating: 4.5,
        reviews: 102,
      },
    },
    {
      id: 4,
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&q=80",
      badge: "EXPLORE",
      location: "Alger",
      duration: "Full Day",
      date: "XX/XX/XXXX",
      price: "8,500",
      guide: {
        name: "Hamid Benali",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 4.5,
        reviews: 89,
      },
    },
    {
      id: 5,
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      image:
        "https://images.unsplash.com/photo-1583055298920-67fef2d21821?w=500&q=80",
      badge: "EXPLORE",
      location: "Alger",
      duration: "Half Day",
      date: "XX/XX/XXXX",
      price: "6,000",
      guide: {
        name: "Hamid Benali",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 4.5,
        reviews: 60,
      },
    },
    {
      id: 6,
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      image:
        "https://images.unsplash.com/photo-1570545917537-873e36d4f64a?w=500&q=80",
      badge: "POPULAR",
      location: "Alger",
      duration: "Full Day",
      date: "XX/XX/XXXX",
      price: "9,000",
      guide: {
        name: "Hamid Benali",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        rating: 4.5,
        reviews: 89,
      },
    },
  ];

  // ⚠️ IMPORTANT: Declare filter states first
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("All wilaya");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [isWilayaOpen, setIsWilayaOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // ⚠️ IMPORTANT: Now we can use toursData in useState
  const [tours, setTours] = useState(toursData);
  const [filteredTours, setFilteredTours] = useState(toursData);

  const wilayas = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouïra",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "El M'Ghair",
    "El Menia",
    "Ouled Djellal",
    "Bordj Badji Mokhtar",
    "Béni Abbès",
    "Timimoun",
    "Touggourt",
    "Djanet",
    "In Salah",
    "In Guezzam",
  ];

  const handleSearch = () => {
    let filtered = tours.filter((tour) => {
      const matchesQuery =
        searchQuery === "" ||
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWilaya =
        selectedWilaya === "All wilaya" || tour.location === selectedWilaya;
      const matchesPrice =
        selectedPrice === "All Prices" ||
        (() => {
          const price = parseInt(tour.price.replace(",", ""));
          if (selectedPrice === "&lt; 4 000 DZD") return price < 4000;
          if (selectedPrice === "4 000 – 7 000 DZD")
            return price >= 4000 && price <= 7000;
          if (selectedPrice === "7 000 DZD") return price >= 7000;
          return true;
        })();
      const matchesDuration =
        selectedDuration === "All" ||
        tour.duration.toLowerCase().replace(" ", "_") ===
          selectedDuration.toLowerCase();
      return matchesQuery && matchesWilaya && matchesPrice && matchesDuration;
    });
    setFilteredTours(filtered);
  };

  const wilayaRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wilayaRef.current && !wilayaRef.current.contains(event.target)) {
        setIsWilayaOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setIsPriceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gradient-to-b from-orange-50 via-orange-50 to-white">
        {/* Hero Section */}
        <div className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover The{" "}
              <span className="text-orange-500">Best Destinations</span>
              <br />
              In Algeria
            </h1>
            <p className="text-gray-800 text-lg max-w-4xl mx-auto">
              Let's find your dream destinations! Here we will recommend you a
              beautiful places and we will change the view with your happiness!
            </p>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-white rounded-3xl shadow-md p-8 max-w-6xl mx-auto">
            {/* Search Bar and Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search For a Destination"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 border border-gray-200 rounded-full text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Wilaya Dropdown */}
              <div className="relative" ref={wilayaRef}>
                <button
                  onClick={() => setIsWilayaOpen(!isWilayaOpen)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-full bg-white cursor-pointer text-gray-700 text-sm flex items-center justify-between hover:bg-orange-50"
                >
                  <span>{selectedWilaya || "All wilaya"}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                {isWilayaOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedWilaya("All wilaya");
                        setIsWilayaOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
                    >
                      All wilaya
                    </button>
                    {wilayas.map((wilaya) => (
                      <button
                        key={wilaya}
                        onClick={() => {
                          setSelectedWilaya(wilaya);
                          setIsWilayaOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
                      >
                        {wilaya}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Dropdown */}
              <div className="relative" ref={priceRef}>
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-full bg-white cursor-pointer text-gray-700 text-sm flex items-center justify-between hover:bg-orange-50"
                >
                  <span>{selectedPrice || "All Prices"}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                {isPriceOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setSelectedPrice("All Prices");
                        setIsPriceOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
                    >
                      All Prices
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPrice("&lt; 4 000 DZD");
                        setIsPriceOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
                    >
                      &lt; 4 000 DZD
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPrice("4 000 – 7 000 DZD");
                        setIsPriceOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
                    >
                      4 000 – 7 000 DZD
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPrice("7 000 DZD");
                        setIsPriceOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
                    >
                      7 000 DZD
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="font-medium">Duration :</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedDuration("All")}
                  className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                    selectedDuration === "All"
                      ? "bg-orange-400 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-orange-400"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedDuration("Half_day")}
                  className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                    selectedDuration === "Half_day"
                      ? "bg-orange-400 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-orange-400"
                  }`}
                >
                  Half_day
                </button>
                <button
                  onClick={() => setSelectedDuration("Full_day")}
                  className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                    selectedDuration === "Full_day"
                      ? "bg-orange-400 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-orange-400"
                  }`}
                >
                  Full_day
                </button>
              </div>
            </div>

            {/* Search Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleSearch}
                className="px-12 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Tours Grid or Empty State */}
        <div className="container mx-auto px-4 pb-20">
          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            // No Results Section
            <div className="text-center py-20">
              {/* Empty State Icon */}
              <div className="inline-block mb-12">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-orange-300 rounded-full opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-56 h-2 bg-orange-400 rounded-full transform rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* No Tours Found Text */}
              <h2 className="text-5xl font-bold text-gray-900">
                No Tours Found
              </h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
