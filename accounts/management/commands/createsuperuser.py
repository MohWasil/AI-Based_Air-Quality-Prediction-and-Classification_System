from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from getpass import getpass
from accounts.models import AdminUser

class Command(BaseCommand):
    help = "Create a superuser with custom fields"

    def handle(self, *args, **options):
        User = get_user_model()
        email = input("Enter email: ")
        # password = getpass("Enter password: ")
        password = getpass("Enter password: ")
        confirm_password = getpass("Confirm password: ")
        while password != confirm_password:
            self.stderr.write("Error: Passwords do not match!")
            password = getpass("Enter password: ")
            confirm_password = getpass("Confirm password: ")


        full_name = input("Enter Full Name: ")
        phone = input("Enter phone number: ")
        gender = input("Enter your Gender (M, F, O): ")
        username = input("Enter username: ")

        # user = User.objects.create_superuser(
        #     username=username,
        #     email=email,
        #     password=password,
        #     full_name=full_name,
        #     phone=phone,
        #     gender=gender,
        # )

        user = User.objects.create_superuser(
            email=email,
            password=password,
            user_type='admin'
        )
        user = AdminUser.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            gender=gender,
            username=username,
        )
        self.stdout.write(self.style.SUCCESS(f"Superuser {username} created successfully!"))