"""smart_city_1 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from smart_city_main import views

urlpatterns = [
    url(r'^smart_city_main/', include('smart_city_main.urls')),
    url(r'^$', views.Login.as_view()),
    url(r'^account-settings', views.AccountSetDetails.as_view()),
    url(r'^notification-settings', views.NotificationsSet.as_view()),
    url(r'^notifications', views.NotificationAlertList.as_view()),
    url(r'^overview', views.DeviceOperations.as_view()),
    url(r'^sub-users-list', views.SubUsersList.as_view()),
    url(r'^see-device-assignments', views.SeeDeviceAssignments.as_view()),
    url(r'^admin/', admin.site.urls),
    url(r'^register', views.RegisterAccount.as_view()),
    url(r'^modifysubuser', views.ModifySubUser.as_view()),
]
