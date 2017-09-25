from django.conf.urls import url
from . import views
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns
from smart_city_main import views

urlpatterns = [
    #url(r'^$', views.index, name = 'index'),
    url(r'^$', views.Login.as_view()),
]