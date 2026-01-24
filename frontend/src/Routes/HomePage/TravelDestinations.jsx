import { ClipboardList, Calendar, MapPin, Shield, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function TravelDestinations() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <ClipboardList className="w-7 h-7 text-orange-500" />,
      title: t('destinations.lotsOfChoices'),
      description: t('destinations.lotsOfChoicesDesc')
    },
    {
      icon: <Calendar className="w-7 h-7 text-orange-500" />,
      title: t('destinations.easyBooking'),
      description: t('destinations.easyBookingDesc')
    },
    {
      icon: <MapPin className="w-7 h-7 text-orange-500" />,
      title: t('destinations.bestTourGuide'),
      description: t('destinations.bestTourGuideDesc')
    },
    {
      icon: <Shield className="w-7 h-7 text-orange-500" />,
      title: t('destinations.secureBooking'),
      description: t('destinations.secureBookingDesc')
    },
    {
      icon: <Heart className="w-7 h-7 text-orange-500" />,
      title: t('destinations.feelGood'),
      description: t('destinations.feelGoodDesc')
    },
  ];


  return (
    <div
      id="destinations"
      className="min-h-screen bg-[#FAF5F1] py-20 px-4 -mt-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 -mt-[60px]">
          <p className="inline-block bg-orange-100 text-orange-600 px-6 py-1 rounded-full text-sm font-semibold mb-4">
            {t('destinations.whyChooseUs')}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t('destinations.weRecommend')}{" "}
            <span className="text-orange-500">{t('destinations.beautifulDestinations')}</span>
          </h1>
          <h1 className="text-3xl font-bold text-gray-900 mb-5">{t('destinations.everyMonth')}</h1>
          <p className="text-slate-600 text-[14px] max-w-2xl mx-auto font-semibold -mt-2">
            {t('destinations.tagline')}
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
