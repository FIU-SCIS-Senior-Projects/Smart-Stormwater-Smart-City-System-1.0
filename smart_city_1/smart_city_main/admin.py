from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Device)
admin.site.register(AssignedTo)
admin.site.register(Notifications)
admin.site.register(NotificationAlerts)
admin.site.register(EmailList)
