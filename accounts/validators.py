from django.core.validators import RegexValidator, MinLengthValidator

phone_validator = RegexValidator(
  regex=r'^\d{10,15}$',
  message="Phone number must be between 10-15 digits and contain only numbers"
)
min_length_validator = MinLengthValidator(limit_value=2, message="minimum length of this is field is 2")