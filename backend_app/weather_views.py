from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
import os

# Import the models from the project app
from backend_app.models import Tour, WeatherInfo


@csrf_exempt
@require_http_methods(["GET"])
def tour_weather_forecast(request, tour_id):
    """
    Get weather forecast for a specific tour.
    """
    try:
        # Get the tour
        tour = get_object_or_404(Tour, id=tour_id)
        
        # Use model method to get or fetch weather
        weather = WeatherInfo.get_weather_for_tour(tour, tour.date)

        if weather:
            return JsonResponse({
                'success': True,
                'weather': {
                    'date': weather.date.isoformat(),
                    'max_temperature': float(weather.max_temperature) if weather.max_temperature else None,
                    'min_temperature': float(weather.min_temperature) if weather.min_temperature else None,
                    'conditions': weather.conditions,
                    'icon': weather.icon,
                    'icon_url': f"https://openweathermap.org/img/wn/{weather.icon}@2x.png" if weather.icon else None
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'weather': None,
                'message': 'Weather not available for this tour date (must be within forecast window).'
            })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)