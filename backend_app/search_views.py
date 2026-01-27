from django.http import JsonResponse
from django.db.models import Q, F, Min, Max
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import date

from .models import Tour, Guide, Wilaya
from backend_app.models import Admin, User
from django.db import transaction


@csrf_exempt
@require_http_methods(["GET", "POST"])
def search_tours(request):
    """
    Intelligent search for tours - available to all users (no authentication required)
    
    Search by:
    - Wilaya (location)
    - Guide language
    - Guide name
    - Tour title
    """
    
    # Get search parameters from GET or POST
    if request.method == 'GET':
        query = request.GET.get('q', '').strip()
        wilaya_code = request.GET.get('wilaya', '').strip()
        language = request.GET.get('language', '').strip()
        guide_name = request.GET.get('guide', '').strip()
        min_rating = request.GET.get('min_rating', None)
        max_price = request.GET.get('max_price', None)
        date_from = request.GET.get('date_from', None)
        date_to = request.GET.get('date_to', None)
        debug = request.GET.get('debug', '').lower() == 'true'
    else:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = {}
        
        query = data.get('q', '').strip()
        wilaya_code = data.get('wilaya', '').strip()
        language = data.get('language', '').strip()
        guide_name = data.get('guide', '').strip()
        min_rating = data.get('min_rating', None)
        max_price = data.get('max_price', None)
        date_from = data.get('date_from', None)
        date_to = data.get('date_to', None)
        debug = data.get('debug', False)
    
    # Start with active tours only
    tours = Tour.objects.filter(is_active=True)
    
    debug_info = {}
    if debug:
        debug_info['initial_count'] = tours.count()
    
    # Filter by approved guides only
    # FIXED: Removed is_verified check - add it back if you're using it
    tours = tours.filter(
        guide__approval_status='approved',
        guide__user__isActive=True,
        guide__user__email_verified=True
    )
    
    if debug:
        debug_info['after_guide_filter'] = tours.count()
    
    # Store candidates before date filtering (for fallback)
    all_active_tours = tours
    
    # Only show future tours (including today)
    tours = tours.filter(date__gte=date.today())
    
    if debug:
        debug_info['after_date_filter'] = tours.count()
    
    # FALLBACK: If no future tours are found (and no specific date filters were requested),
    # show the most recent tours instead of an empty list.
    if not tours.exists() and not date_from and not date_to:
        tours = all_active_tours.order_by('-date', '-created_at')[:10]
        if debug:
            debug_info['fallback_triggered'] = True
            debug_info['fallback_count'] = tours.count()
    
    # Apply filters
    filters = Q()
    
    # General query search (intelligent search across multiple fields)
    if query:
        # Search in tour title
        filters |= Q(title__icontains=query)
        
        # Search in tour description
        filters |= Q(description__icontains=query)
        
        # Search in guide's name (first name or last name)
        filters |= Q(guide__user__firstname__icontains=query)
        filters |= Q(guide__user__lastname__icontains=query)
        
        # Search in wilaya name
        filters |= Q(wilaya__name__icontains=query)
        
        tours = tours.filter(filters).order_by('-average_rating', '-created_at')
        
        if debug:
            debug_info['after_query_filter'] = tours.count()
            debug_info['query'] = query
    
    # Specific wilaya filter
    if wilaya_code:
        tours = tours.filter(
            Q(wilaya__code__iexact=wilaya_code) |
            Q(wilaya__name__icontains=wilaya_code)
        )
        if debug:
            debug_info['after_wilaya_filter'] = tours.count()
    
    # Language filter (search in guide's spoken languages JSONField)
    if language:
        # For JSONField in SQLite, we need to filter differently
        # Get all guides with matching language first
        matching_guides = Guide.objects.filter(
            offering_spoken_languages__icontains=language
        ).values_list('user_id', flat=True)
        tours = tours.filter(guide__user_id__in=matching_guides)
        if debug:
            debug_info['after_language_filter'] = tours.count()
    
    # Guide name filter
    if guide_name:
        tours = tours.filter(
            Q(guide__user__firstname__icontains=guide_name) |
            Q(guide__user__lastname__icontains=guide_name)
        )
        if debug:
            debug_info['after_guide_name_filter'] = tours.count()
    
    # Rating filter
    if min_rating:
        try:
            tours = tours.filter(average_rating__gte=float(min_rating))
            if debug:
                debug_info['after_rating_filter'] = tours.count()
        except ValueError:
            pass
    
    # Price filter
    if max_price:
        try:
            tours = tours.filter(calculated_price__lte=float(max_price))
            if debug:
                debug_info['after_price_filter'] = tours.count()
        except ValueError:
            pass
    
    # Date range filter
    if date_from:
        try:
            tours = tours.filter(date__gte=date_from)
            if debug:
                debug_info['after_date_from_filter'] = tours.count()
        except:
            pass
    
    if date_to:
        try:
            tours = tours.filter(date__lte=date_to)
            if debug:
                debug_info['after_date_to_filter'] = tours.count()
        except:
            pass
    
    # Limit results
    tours = tours[:50]
    
    # Serialize results
    results = []
    for tour in tours:
        results.append({
            'id': tour.id,
            'title': tour.title,
            'description': tour.description[:200] + '...' if len(tour.description) > 200 else tour.description,
            'date': tour.date.strftime('%Y-%m-%d'),
            'scheduled_time': tour.scheduled_time.strftime('%H:%M') if tour.scheduled_time else None,
            'estimated_duration': float(tour.estimated_duration),
            'calculated_price': float(tour.calculated_price),
            'wilaya': {
                'code': tour.wilaya.code,
                'name': tour.wilaya.name,
                'region': tour.wilaya.region
            },
            'starting_point': tour.starting_point,
            'cover_photo': tour.cover_photo,
            'average_rating': float(tour.average_rating),
            'number_of_reviews': tour.number_of_reviews,
            'available_places': tour.available_places,
            'max_places': tour.max_places,
            'guide': {
                'id': tour.guide.user.id,
                'firstname': tour.guide.user.firstname,
                'lastname': tour.guide.user.lastname,
                'photo_url': tour.guide.user.photo_url,
                'average_rating': float(tour.guide.average_rating),
                'spoken_languages': tour.guide.offering_spoken_languages,
                'phone': tour.guide.get_phone_display()
            },
            'highlights': tour.highlights.split('\n') if tour.highlights else [],
            'whats_included': tour.whats_included.split('\n') if tour.whats_included else []
        })
    
    response_data = {
        'success': True,
        'count': len(results),
        'tours': results
    }
    
    if debug:
        response_data['debug'] = debug_info
    
    return JsonResponse(response_data)


@require_http_methods(["GET"])
def get_search_suggestions(request):
    """
    Get search suggestions for autocomplete
    Returns suggestions for: guides, tours, and wilayas
    """
    query = request.GET.get('q', '').strip()
    
    if not query or len(query) < 2:
        return JsonResponse({
            'success': True,
            'suggestions': []
        })
    
    suggestions = {
        'guides': [],
        'tours': [],
        'wilayas': []
    }
    
    # Guide suggestions - FIXED: removed is_verified check
    guides = Guide.objects.filter(
        Q(user__firstname__icontains=query) |
        Q(user__lastname__icontains=query),
        approval_status='approved'
    )[:5]
    
    for guide in guides:
        suggestions['guides'].append({
            'id': guide.user.id,
            'name': f"{guide.user.firstname} {guide.user.lastname}",
            'photo_url': guide.user.photo_url,
            'rating': float(guide.average_rating)
        })
    
    # Tour suggestions
    tours = Tour.objects.filter(
        title__icontains=query,
        is_active=True,
        date__gte=date.today()
    )[:5]
    
    for tour in tours:
        suggestions['tours'].append({
            'id': tour.id,
            'title': tour.title,
            'guide_name': f"{tour.guide.user.firstname} {tour.guide.user.lastname}",
            'price': float(tour.calculated_price)
        })
    
    # Wilaya suggestions
    wilayas = Wilaya.objects.filter(
        Q(name__icontains=query) |
        Q(code__icontains=query)
    )[:5]
    
    for wilaya in wilayas:
        suggestions['wilayas'].append({
            'code': wilaya.code,
            'name': wilaya.name,
            'region': wilaya.region
        })
    
    return JsonResponse({
        'success': True,
        'suggestions': suggestions
    })


@require_http_methods(["GET"])
def get_available_filters(request):
    """
    Get available filter options for the search
    Returns: wilayas, languages, price range, rating range
    """
    # Get all wilayas
    wilayas = Wilaya.objects.all().values('code', 'name', 'region')
    
    # Get all unique languages from approved guides
    guides = Guide.objects.filter(
        approval_status='approved'
    )
    
    languages = set()
    for guide in guides:
        if isinstance(guide.offering_spoken_languages, list):
            languages.update(guide.offering_spoken_languages)
    
    # Get price range from active tours
    tours = Tour.objects.filter(is_active=True, date__gte=date.today())
    
    price_stats = tours.aggregate(
        min_price=Min('calculated_price'),
        max_price=Max('calculated_price')
    )
    
    return JsonResponse({
        'success': True,
        'filters': {
            'wilayas': list(wilayas),
            'languages': sorted(list(languages)),
            'price_range': {
                'min': float(price_stats['min_price'] or 0),
                'max': float(price_stats['max_price'] or 0)
            },
            'rating_options': [1, 2, 3, 4, 5]
        }
    })