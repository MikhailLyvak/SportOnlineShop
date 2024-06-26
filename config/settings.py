"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 5.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

import os
from pathlib import Path
from environs import Env

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = Path(__file__).resolve().parent.parent

env = Env()
env.read_env()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "app_goods",
    "admin_user",
    "app_admin_api",
    "rest_framework",
    "widget_tweaks",
    "crispy_forms",
    "crispy_bootstrap4",
    "bootstrap4",
    "django_filters",
    "app_cart",
    "app_orders",
    'corsheaders',
    'django.contrib.humanize',
    'mathfilters',
    'tinymce',
]

CRISPY_TEMPLATE_PACK = "bootstrap4"

INTERNAL_IPS = env.list("INTERNAL_IPS")

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

SESSION_ENGINE = 'django.contrib.sessions.backends.db'


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

IS_DUBUG = env.bool("IS_DUBUG")
    
DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: request.META.get('REMOTE_ADDR') == '127.0.0.1',
    'SHOW_COLLAPSED': True,
    'RENDER_PANELS': True,
}



CORS_ORIGIN_ALLOW_ALL = True

SECURE_CROSS_ORIGIN_OPENER_POLICY = None

CORS_ORIGIN_WHITELIST = [
    'http://185.233.116.13:8000',
    'http://localhost:8000',
    "https://www.sportrelaxnutritions.com",
]

CSRF_TRUSTED_ORIGINS = [
    "http://185.233.116.13:8000",
    'https://secure.wayforpay.com',
    "https://www.sportrelaxnutritions.com",
    "https://sportrelaxnutritions.com",
]

ASSETS_ROOT = "/static/assets"

AUTHENTICATION_BACKENDS = (
    "admin_user.backends.EmailBackend",
    "django.contrib.auth.backends.ModelBackend",
)

AUTH_USER_MODEL = "admin_user.CustomUser"

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env.str("DB_NAME"),
        'USER': env.str("DB_USER"),
        'PASSWORD': env.str("DB_USER_PASSWORD"),
        'HOST': env.str("DB_HOST"),
        'PORT': env.str("DB_PORT"),
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

LOGIN_URL = "admin_user:login"


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "media/"

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]
STATIC_URL = "/static/"
STATIC_ROOT = "/static/"

STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# WayForPay
WEY_URL = env.str("WFP_URL")
WEY_SECRET_KEY = env.str("WFP_SECRET_KEY")
MERCHANT_ACCOUNT = env.str("WFP_MERCHANT_ACCOUNT")
MERCHANT_DOMAIN_NAME = env.str("WFP_MERCHANT_DOMAIN_NAME")

#Telegram BOT
BOT_API_KEY = env.str("BOT_API_KEY")
MY_CHANNEL_NAME = env.str("MY_CHANNEL_NAME")
DOMAIN = env.str("DOMAIN")
