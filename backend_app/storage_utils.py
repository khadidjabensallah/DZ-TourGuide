"""
Upload helper for user-provided files (certifications, profile photos, tour
photos). In production (CLOUDINARY_URL configured) files go to Cloudinary and a
permanent https CDN URL is returned. Render's free disk is ephemeral and Django
doesn't serve /media/ when DEBUG=False, so local storage isn't viable there.
Falls back to MEDIA_ROOT for local development.
"""
import os
import uuid
from django.conf import settings
from django.core.files.storage import FileSystemStorage


def save_upload(file, subdir, prefix=""):
    """Persist `file` and return a URL/path string. `subdir` groups assets
    (e.g. 'certifications', 'tours', 'profiles')."""
    if getattr(settings, 'CLOUDINARY_ENABLED', False):
        import cloudinary.uploader
        result = cloudinary.uploader.upload(
            file,
            folder=f"dz-tourguide/{subdir}",
            resource_type="auto",
        )
        return result["secure_url"]

    # Local development fallback
    target = os.path.join(settings.MEDIA_ROOT, subdir)
    os.makedirs(target, exist_ok=True)
    fs = FileSystemStorage(location=target)
    saved_name = fs.save(f"{prefix}{uuid.uuid4().hex[:6]}_{file.name}", file)
    return f"/media/{subdir}/{saved_name}"
