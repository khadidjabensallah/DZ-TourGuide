from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from backend_app.models import Guide, Admin, User


class Command(BaseCommand):
    help = 'Approve a guide by guide email. Creates an admin user/profile if needed.'

    def add_arguments(self, parser):
        parser.add_argument('--guide-email', required=True, help='Email of the guide to approve')
        parser.add_argument('--admin-email', required=False, help='Email of the admin performing approval')
        parser.add_argument('--admin-password', required=False, help='Password for created admin (if created)')

    def handle(self, *args, **options):
        guide_email = options['guide_email']
        admin_email = options.get('admin_email')
        admin_password = options.get('admin_password') or 'ChangeMe123!'

        try:
            guide = Guide.objects.get(user__email=guide_email)
        except Guide.DoesNotExist:
            raise CommandError(f'Guide not found for email: {guide_email}')

        # Ensure admin user
        admin_user = None
        if admin_email:
            admin_user = User.objects.filter(email=admin_email).first()
            if admin_user and admin_user.user_type != 'admin':
                raise CommandError(f'User {admin_email} exists but is not an admin (user_type={admin_user.user_type}).')

        if not admin_user:
            # Try find any admin
            admin_user = User.objects.filter(user_type='admin').first()

        if not admin_user and admin_email:
            # create admin user
            admin_user = User.objects.create(
                email=admin_email,
                firstname='Admin',
                lastname='User',
                user_type='admin',
                isActive=True,
                email_verified=True,
            )
            admin_user.set_password(admin_password)
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_user.email} (id={admin_user.id})'))

        if not admin_user:
            raise CommandError('No admin user found. Provide --admin-email to create one or ensure an admin exists.')

        # Ensure Admin profile exists
        admin_profile, created = Admin.objects.get_or_create(user=admin_user)
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created Admin profile for user id={admin_user.id}'))

        # Approve the guide
        if guide.approval_status == 'approved':
            self.stdout.write(self.style.WARNING('Guide already approved.'))
            return

        try:
            with transaction.atomic():
                guide.approve(admin_profile)
        except Exception as e:
            raise CommandError(f'Failed to approve guide: {e}')

        guide.refresh_from_db()
        self.stdout.write(self.style.SUCCESS(f'Guide approved: {guide.user.email} (status={guide.approval_status})'))
