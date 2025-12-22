import React from "react";
import { ClipboardList, Calendar, MapPin, Shield, Heart } from "lucide-react";

export default function TravelDestinations() {
  const features = [
    {
      icon: <ClipboardList className="w-7 h-7 text-orange-500" />,
      title: "Lots of Choices",
      description:
        "Choose all of destinations in we plans. We'll provide you wonderful destination in Algeria!",
    },
    {
      icon: <Calendar className="w-7 h-7 text-orange-500" />,
      title: "Easy Booking",
      description:
        "We provide easy and comfort booking services. Let's choose the best destinations and book now, we'll take care the rest!",
    },
    {
      icon: <MapPin className="w-7 h-7 text-orange-500" />,
      title: "Best Tour Guide",
      description:
        "We have professional and experience tour guide to make your trip more unforgettable experience.",
    },
    {
      icon: <Shield className="w-7 h-7 text-orange-500" />,
      title: "Secure & flexible booking",
      description: "Book with peace of mind: safe payments and easy changes.",
    },
    {
      icon: <Heart className="w-7 h-7 text-orange-500" />,
      title: "Feel good about where your money goes",
      description: "You're choosing meaningful travel, not mass tourism.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF5F1] py-20 px-4 -mt-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 -mt-[60px]">
          <p className="inline-block bg-orange-100 text-orange-600 px-6 py-1 rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            We Recommend{" "}
            <span className="text-orange-500">Beautiful Destinations</span>
          </h1>
          <h1 className="text-3xl font-bold text-gray-900 mb-5">Every Month</h1>
          <p className="text-slate-600 text-[14px] max-w-2xl mx-auto font-semibold -mt-2">
            We always provide the best service with professional and experienced
            tour
            <br />
            guides that will offer the best travelling experience around
            Algeria!
          </p>
        </div>

        {/* Features Grid - all 5 cards */}
        <div className="flex flex-wrap justify-center gap-[5rem]">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl p-8 text-center flex flex-col items-center"
              style={{
                width: "313px",
                height: "240px",
                backgroundColor: "#E1ECFFC4",
              }}
            >
              {/* Icon without background */}
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
