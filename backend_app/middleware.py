class URLNormalizeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        request.path_info = request.path_info.strip()
        request.path = request.path.strip()
        response = self.get_response(request)
        return response