import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Clock,
  Calendar,
  User,
  Star,
  ChevronRight,
} from "lucide-react";
import Header from "../../Layout/Header.jsx";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [numPeople, setNumPeople] = useState(1);
  const [tourDate, setTourDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [weatherForecast, setWeatherForecast] = useState([]);

  const today = new Date();
  const tourDateObj = tourDate ? new Date(tourDate) : null;
  const diffDays = tourDateObj
    ? Math.ceil((tourDateObj - today) / (1000 * 60 * 60 * 24))
    : null;
  const showWeather = diffDays !== null && diffDays <= 5 && diffDays >= 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    // replace with real fetch by id
    console.log("Open tour details for id:", id, "state:", location.state);

    if (showWeather) {
      fetch(`/api/weather?date=${tourDate}&location=Alger&days=5`)
        .then((res) => res.json())
        .then((data) => setWeatherForecast(data.forecast || []))
        .catch((err) => console.error("Error fetching weather:", err));
    } else {
      setWeatherForecast([]);
    }
  }, [id, location.state, showWeather, tourDate]);

  const reviews = [
    {
      name: "Sami Kertout",
      rating: 4,
      text: "Outstanding tour! Hamid was incredibly knowledgeable about Algerian history and art. he made the museum come alive with fascinating stories about each piece. The pacing was perfect, and he answered all our questions with patience and enthusiasm. Highly recommend this tour to anyone interested in North African culture!",
    },
    {
      name: "Karim Salhi",
      rating: 5,
      text: "Unforgettable tour! The itinerary was rich and balanced. Hamid's storytelling and historical knowledge were top-notch.",
    },
    {
      name: "Ryma Gassi",
      rating: 4,
      text: "Hamid's passion for his city and its history shines through every moment of the tour. He doesn't just guide; he educates and inspires. The Casbah walk was rich with stories, and the visit to Jardin d'Essai offered a peaceful break before exploring colonial architecture. His multilingual skills ensured everyone felt included. This tour is ideal for travelers who want more than just sightseeing—it's a cultural and emotional journey.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5ebe0]">
      <Header />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img
            src="https://images.unsplash.com/photo-1580837119756-563d3c7c6e21?w=800&h=600&fit=crop"
            alt="Casbah alley"
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1555881813-069a8e94e087?w=800&h=600&fit=crop"
            alt="Algiers tramway"
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Visit of the Casbah of Algiers – UNESCO Heritage
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>7h</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Alger</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>12/12/2025</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guide Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="Hamid Benali"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">Hamid Benali</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.8</span>
                      <span className="text-sm text-gray-500">(17 tours)</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Certified tour guide for 10 years, passionate about the
                    history of the Casbah of Algiers and Ottoman heritage.
                    Degree in history and archaeology.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                      Français
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                      Arabe
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                      Anglais
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-gray-700 hover:text-orange-500">
                    <User className="w-5 h-5" />
                    <span>View full profile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700">
                A total immersion into the history of Algiers, from the Ottoman
                era to the French colonial period. Visit emblematic sites from
                both periods.
              </p>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              <p className="text-gray-700">
                Casbah (morning) → Lunch at a traditional restaurant →
                Notre-Dame d'Afrique → Jardin d'Essai → Waterfront and colonial
                architecture → National Museum of Bardo
              </p>
            </div>

            {/* Included/Not Included */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Included</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Expert guide
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      All entrance fees
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Traditional lunch
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Transportation between sites
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Water and snacks
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Not Included</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Personal souvenirs
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Starting Point */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Starting Point</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">
                    hotel in Algiers city center (within the main urban area)
                  </p>
                  <p className="text-sm text-gray-600">
                    GPS Coordinates: 36.7831, 3.0601
                  </p>
                </div>
              </div>
            </div>

            {/* Weather Section */}
            {showWeather && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Weather Forecast</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherForecast.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl mb-2">{day.icon}</div>
                      <div className="font-semibold">{day.day}</div>
                      <div className="text-sm text-gray-600">{day.temp}</div>
                      <div className="text-sm text-gray-600">
                        {day.condition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-2">Book This Tour</h3>
              <p className="text-sm text-gray-600 mb-6">
                The guide will confirm your request within 24h
              </p>

              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  6 000 DZD
                </div>
                <div className="text-sm text-gray-600">
                  Rate for 7h (full day)
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tour Date
                  </label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of People
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={numPeople}
                      onChange={(e) =>
                        setNumPeople(parseInt(e.target.value) || 1)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      available places
                    </label>
                    <div className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
                      100
                    </div>
                  </div>
                </div>

                <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Rating Section
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {review.name}
                    </h4>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button className="flex items-center gap-2 text-orange-500 hover:text-orange-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourDetail;
