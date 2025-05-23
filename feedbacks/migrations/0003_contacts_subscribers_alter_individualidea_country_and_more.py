# Generated by Django 5.1.5 on 2025-01-31 10:47

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feedbacks', '0002_rename_offecial_email_organizationidea_official_email_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contacts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')])),
                ('email', models.EmailField(max_length=254)),
                ('contact', models.CharField(max_length=15, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')])),
                ('country', models.CharField(max_length=100, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')])),
                ('subject', models.CharField(max_length=100, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')])),
                ('message', models.TextField(max_length=2000, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')])),
            ],
        ),
        migrations.CreateModel(
            name='Subscribers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
            ],
        ),
        migrations.AlterField(
            model_name='individualidea',
            name='country',
            field=models.CharField(max_length=100, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='individualidea',
            name='expertise',
            field=models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='individualidea',
            name='full_name',
            field=models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='individualidea',
            name='idea',
            field=models.TextField(max_length=2000, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='individualidea',
            name='phone',
            field=models.CharField(max_length=15, validators=[django.core.validators.RegexValidator(message='Phone number must be between 10-15 digits and contain only numbers', regex='^\\d{10, 15}$')]),
        ),
        migrations.AlterField(
            model_name='organizationidea',
            name='alternative_phone',
            field=models.CharField(max_length=15, validators=[django.core.validators.RegexValidator(message='Phone number must be between 10-15 digits and contain only numbers', regex='^\\d{10, 15}$')]),
        ),
        migrations.AlterField(
            model_name='organizationidea',
            name='area_expertise',
            field=models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='organizationidea',
            name='country',
            field=models.CharField(max_length=100, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='organizationidea',
            name='organization_name',
            field=models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='organizationidea',
            name='premium_phone',
            field=models.CharField(max_length=15, validators=[django.core.validators.RegexValidator(message='Phone number must be between 10-15 digits and contain only numbers', regex='^\\d{10, 15}$')]),
        ),
        migrations.AlterField(
            model_name='organizationidea',
            name='recommendation',
            field=models.TextField(max_length=2000, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='organizationidea',
            name='responsible_person',
            field=models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='questions',
            name='name',
            field=models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
        migrations.AlterField(
            model_name='questions',
            name='phone',
            field=models.CharField(max_length=15, validators=[django.core.validators.RegexValidator(message='Phone number must be between 10-15 digits and contain only numbers', regex='^\\d{10, 15}$')]),
        ),
        migrations.AlterField(
            model_name='questions',
            name='question',
            field=models.TextField(max_length=2000, validators=[django.core.validators.MinLengthValidator(limit_value=2, message='minimum length of this is field is 2')]),
        ),
    ]
