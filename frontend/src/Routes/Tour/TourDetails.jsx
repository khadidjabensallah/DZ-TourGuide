import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Calendar,
  User,
  Star,
  AlertTriangle,
} from "lucide-react";
import Header from "../../Layout/Header.jsx";
import { TourAPI, ReservationAPI, WeatherAPI, ReviewAPI } from "../../utils/api";
import { useTranslation } from "react-i18next";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [numPeople, setNumPeople] = useState(1);
  const [tourDate, setTourDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [reserving, setReserving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Get current user and check ownership
  const userStr = sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const currentUserId = user?.user_id || user?.userId;
  // Check if current user is the guide owner of this tour
  const isOwner = tour && tour.guide && currentUserId && String(currentUserId) === String(tour.guide.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTourDetails = async () => {
      setLoading(true);
      try {
        const response = await TourAPI.getTour(id);
        if (response.success && response.tour) {
          setTour(response.tour);
          if (response.tour.date) {
            setTourDate(response.tour.date);
          }
          if (response.tour.scheduled_time) {
            setDepartureTime(response.tour.scheduled_time.substring(0, 5));
          }
        } else {
          setError(t('common.error'));
        }
      } catch (err) {
        console.error("Error fetching tour:", err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchTourDetails();
  }, [id, t]);

  useEffect(() => {
    if (id && tourDate) {
      WeatherAPI.getWeather(id)
        .then((response) => {
          if (response.success && response.weather) {
            setWeatherInfo(response.weather);
          } else {
            setWeatherInfo(null);
          }
        })
        .catch((err) => {
          console.error("Error fetching weather:", err);
          setWeatherInfo(null);
        });
    } else {
      setWeatherInfo(null);
    }
  }, [id, tourDate]);

  const handleReserve = async () => {
    if (!userStr) {
      alert(t('tourDetails.signInRequired'));
      navigate("/signin");
      return;
    }

    const userData = JSON.parse(userStr);
    const touristId = userData.user_id || userData.userId;
    const userType = userData.user_type || userData.userType;

    if (!touristId) {
      alert(t('auth.sessionExpired'));
      return;
    }

    if (userType !== 'tourist') {
      alert(t('tourDetails.onlyTourists'));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tourDateObj = new Date(tour.date);
    if (tourDateObj < today) {
      alert(t('tourDetails.datePassed'));
      return;
    }

    setReserving(true);
    setError(null);
    try {
      const response = await ReservationAPI.create(id, touristId, numPeople);
      if (response.success) {
        setSuccessMessage(t('tourDetails.reservationSuccess'));
        setTimeout(() => {
          navigate("/tourist/profile");
        }, 1500);
      } else {
        setError(response.message || t('tourDetails.reservationFailed'));
      }
    } catch (err) {
      console.error("Reservation error:", err);
      const errorMessage = err?.data?.message || err?.message || t('common.errorOccurred');
      setError(errorMessage);
    } finally {
      setReserving(false);
    }
  };

  const handleDeleteTour = async () => {
    if (!window.confirm(t('tourDetails.deleteConfirm'))) {
      return;
    }

    try {
      setLoading(true);
      const response = await TourAPI.deleteTour(currentUserId, id);
      if (response.success) {
        alert(response.message || t('tourDetails.deleteSuccess'));
        navigate(`/guide/${currentUserId}/profile`);
      } else {
        alert(response.message || t('tourDetails.deleteFailed'));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(t('common.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const navigateToProfile = () => {
    if (tour?.guide?.id) {
      navigate(`/guide/${tour.guide.id}/profile`);
    }
  };

  const handleReport = () => {
    navigate("/guide/report-issue", {
      state: {
        tour_id: id,
        tour_title: tour.title,
        guide_id: tour.guide?.id,
        guide_name: `${tour.guide?.firstname} ${tour.guide?.lastname}`
      }
    });
  };

  const submitReview = async () => {
    if (!userStr) {
      alert(t('tourDetails.signInRequired'));
      navigate("/signin");
      return;
    }
    const userData = JSON.parse(userStr);
    const touristId = userData.user_id || userData.userId;

    setSubmittingReview(true);
    try {
      const response = await ReviewAPI.create({
        tour_id: id,
        tourist_id: touristId,
        rating: rating,
        comment: comment
      });

      if (response.success) {
        alert(t('tourDetails.reviewSuccess'));
        setReviewModalOpen(false);
        setComment("");
        setRating(5);
        const res = await TourAPI.getTour(id);
        if (res.success) setTour(res.tour);
      } else {
        alert(response.error || t('tourDetails.reviewFailed'));
      }
    } catch (err) {
      console.error("Review error:", err);
      alert(t('common.errorOccurred'));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5ebe0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-[#f5ebe0] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('tourDetails.oops')}</h2>
        <p className="text-gray-600 mb-6">{error || t('tourDetails.tourNotFound')}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          {t('common.goBack')}
        </button>
      </div>
    );
  }

  const reviews = tour.reviews || [];
  const photos = tour.gallery || tour.photo_urls || [];

  return (
    <div className="min-h-screen bg-[#f5ebe0]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {photos && photos.length > 0 ? (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ...(tour.cover_photo && !photos.includes(tour.cover_photo) ? [tour.cover_photo] : []),
                ...photos
              ].map((photo, index) => (
                <div key={index} className="aspect-w-4 aspect-h-3">
                  <img
                    src={photo}
                    alt={`Tour view ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <img
              src={tour.cover_photo || "https://images.unsplash.com/photo-1580837119756-563d3c7c6e21?w=800&h=600&fit=crop"}
              alt={tour.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
              onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=No+Image"; }}
            />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{parseFloat(tour.estimated_duration).toFixed(0)}h</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{tour.wilaya?.name || "Algeria"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(tour.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{tour.scheduled_time ? tour.scheduled_time.substring(0, 5) : t('tourDetails.notSpecified')}</span>
            </div>
          </div>

          {weatherInfo && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 max-w-fit transition-all hover:shadow-sm">
              <img src={weatherInfo.icon_url} alt={weatherInfo.conditions} className="w-10 h-10" />
              <div>
                <div className="text-sm font-semibold capitalize leading-none mb-1">{weatherInfo.conditions}</div>
                <div className="text-xs font-medium text-blue-600">
                  {Math.round(weatherInfo.min_temperature)}°C - {Math.round(weatherInfo.max_temperature)}°C
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <img
                  src={tour.guide?.photo_url || "https://via.placeholder.com/100?text=Guide"}
                  alt={`${tour.guide?.firstname} ${tour.guide?.lastname}`}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Guide"; }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{tour.guide?.firstname} {tour.guide?.lastname}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{parseFloat(tour.average_rating || 0).toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({tour.number_of_reviews || 0} {t('tourDetails.reviewsCount')})</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {tour.guide?.biography || t('tourDetails.defaultBio')}
                  </p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {['Français', 'Arabe', 'Anglais'].map(lang => (
                      <span key={lang} className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={navigateToProfile}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('tourDetails.viewProfile')}</span>
                  </button>
                  {!isOwner && (
                    <button
                      onClick={handleReport}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors mt-2 text-sm"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t('tourDetails.reportGuide')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">{t('tourDetails.description')}</h2>
              <p className="text-gray-700 whitespace-pre-line">{tour.description}</p>
            </div>

            {tour.itinerary && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{t('tourDetails.itinerary')}</h2>
                <p className="text-gray-700 whitespace-pre-line">{tour.itinerary}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">{t('tourDetails.startingPoint')}</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{tour.start_location || tour.wilaya?.name}</p>
                  {tour.scheduled_time && (
                    <p className="text-sm text-gray-600">
                      {t('tourDetails.departureAt')} {tour.scheduled_time.substring(0, 5)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {isOwner ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 border-2 border-orange-500">
                <h3 className="text-xl font-bold mb-4 text-orange-600">{t('tourDetails.manageTour')}</h3>
                <p className="text-gray-600 mb-6">{t('tourDetails.ownerMessage')}</p>
                <div className="mb-6 bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm font-semibold text-gray-700 mb-2">{t('tourDetails.tourStats')}</div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t('tourDetails.views')}</span>
                    <span className="font-bold">--</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('tourDetails.bookings')}</span>
                    <span className="font-bold">{tour.available_places < tour.max_capacity ? (tour.max_capacity - tour.available_places) : 0}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate(`/editTour/${id}`)}
                    className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
                  >
                    <span>✏️</span> {t('tourDetails.editTour')}
                  </button>
                  <button
                    onClick={handleDeleteTour}
                    className="w-full py-3 border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
                  >
                    <span>🗑️</span> {t('tourDetails.deleteTour')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h3 className="text-xl font-bold mb-2">{t('tourDetails.bookThisTour')}</h3>
                <p className="text-sm text-gray-600 mb-6">{t('tourDetails.confirmMessage')}</p>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {parseFloat(tour.calculated_price).toLocaleString()} {t('common.dzd')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('tourDetails.rateFor', { duration: parseFloat(tour.estimated_duration).toFixed(0) })}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('tourDetails.tourDate')}</label>
                    <input
                      type="date"
                      value={tourDate}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('tourDetails.departureTime')}</label>
                    <input
                      type="time"
                      value={departureTime}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={true}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('tourDetails.numberOfPeople')}</label>
                      <input
                        type="number"
                        min="1"
                        max={tour.max_capacity}
                        value={numPeople}
                        onChange={(e) => setNumPeople(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('tourDetails.availablePlaces')}</label>
                      <div className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
                        {tour.available_places}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-bold text-gray-900 mb-2">
                    <span>{t('tourDetails.total')}</span>
                    <span>{(parseFloat(tour.calculated_price) * numPeople).toLocaleString()} {t('common.dzd')}</span>
                  </div>
                  {successMessage && (
                    <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">
                      {successMessage}
                    </div>
                  )}
                  <button
                    onClick={handleReserve}
                    disabled={reserving || tour.available_places < numPeople || new Date(tour.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) || user?.user_type !== 'tourist'}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${reserving || tour.available_places < numPeople || new Date(tour.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) || (user && user.user_type !== 'tourist')
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                      }`}
                  >
                    {reserving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('tourDetails.processing')}</span>
                      </>
                    ) : user && user.user_type !== 'tourist' ? (
                      t('tourDetails.onlyTouristsShort') || "Only Tourists Can Book"
                    ) : new Date(tour.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? (
                      t('tourDetails.datePassedShort') || "Tour Date Passed"
                    ) : tour.available_places < numPeople ? (
                      t('tourDetails.notEnoughPlacesShort') || "Not Enough Places"
                    ) : (
                      t('common.reserve')
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{t('tourDetails.reviews')}</h2>
            {!isOwner && (
              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                {t('tourDetails.leaveReview')}
              </button>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{review.tourist_name || t('nav.tourist')}</h4>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">{t('tourDetails.noReviews')}</p>
          )}
        </div>
      </main>

      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">{t('tourDetails.leaveReview')}</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('tourDetails.rating')}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="p-1">
                    <Star className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('tourDetails.comment')}</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('tourDetails.shareExperience')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={submitReview}
                disabled={submittingReview || !comment.trim()}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400"
              >
                {submittingReview ? t('tourDetails.submitting') : t('tourDetails.submitReview')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;