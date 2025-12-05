import React from "react";
import { MapPin, Calendar, Star, Clock } from "lucide-react";

export default function PopularTours() {
  const tours = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      price: "3500 DZD",
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      location: "Alger",
      date: "XX/XX/XXXX",
      guide: {
        name: "Hamid Benali",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 4.5,
        reviews: 60,
      },
      duration: "3h",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      price: "3500 DZD",
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      location: "Alger",
      date: "XX/XX/XXXX",
      guide: {
        name: "Hamid Benali",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 4.5,
        reviews: 60,
      },
      duration: "3h",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      price: "3500 DZD",
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      location: "Alger",
      date: "XX/XX/XXXX",
      guide: {
        name: "Hamid Benali",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 4.5,
        reviews: 60,
      },
      duration: "3h",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=800",
      price: "3500 DZD",
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      location: "Alger",
      date: "XX/XX/XXXX",
      guide: {
        name: "Hamid Benali",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 4.5,
        reviews: 60,
      },
      duration: "3h",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      price: "3500 DZD",
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      location: "Alger",
      date: "XX/XX/XXXX",
      guide: {
        name: "Hamid Benali",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 4.5,
        reviews: 60,
      },
      duration: "3h",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      price: "3500 DZD",
      title: "Visit of the Casbah of Algiers – UNESCO Heritage",
      description:
        "Explore the winding alleys of Algiers' Casbah, a UNESCO World Heritage site steeped in centuries of history, culture, and architectural charm.",
      location: "Alger",
      date: "XX/XX/XXXX",
      guide: {
        name: "Hamid Benali",
        avatar: "https://i.pravatar.cc/150?img=12",
        rating: 4.5,
        reviews: 60,
      },
      duration: "3h",
    },
  ];

  return (
    <div className="py-16 px-8 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-0">
          <span className="inline-block bg-orange-100 text-orange-600 px-6 py-2 rounded-full text-sm font-semibold mb-4">
            Popular Tours
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Discover The{" "}
            <span className="text-orange-500">Best Destinations</span>
            <br />
            In The World
          </h2>
          <p className="text-slate-600 text-[14px] max-w-2xl mx-auto font-semibold">
            Let's find your dream destinations! Here we will recommend you a
            beautiful
            <br />
            places and we will change the view with your happiness!
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 mb-8">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
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
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600">
                          {tour.guide.rating} ({tour.guide.reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {tour.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Tours Button */}
        <div className="text-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
            More Tours
          </button>
        </div>
      </div>
    </div>
  );
}
