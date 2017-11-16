from django.db import models
import datetime

# Could make models for:

# Products, which can have identifier,Location, Waste Type, Custom, and possibly more from section 4.4

class Device(models.Model):
    #assigned_to = models.ForeignKey(on_delete=models.CASCADE, max_length=50)
    identifier = models.CharField(primary_key=True, max_length=20)
    location = models.CharField(max_length=50)
    battery_level = models.IntegerField(default=100)
    fill_level = models.IntegerField(default=0)
    device_type = models.CharField(max_length=20)
    custom = models.CharField(max_length=255)
    sensing_interval = models.IntegerField(default=15)
    last_notification_date = models.DateTimeField(auto_now = False, auto_now_add=False, default=datetime.datetime(1999, 1, 1, 0, 0, 1))

#AssignedTo is a table tha records which user has been assigned which device.
#This is needed since multiple users can have access to one device and one user can have access to multiple devices
class AssignedTo(models.Model):
    user = models.CharField(max_length=50)
    assigned_device = models.CharField(max_length=20)


#Users, which can have userID, username, password, contact email, contact number, language, green-to-yellow threshold, yellow-to-red threshold. (section 6)

class User(models.Model):
    username = models.CharField(primary_key=True, unique=True, max_length=50)
    password = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    number = models.CharField(max_length=15, blank=True)
    language = models.CharField(max_length=20)
    gy_thresh = models.IntegerField(default=30) #Green to yellow threshold
    yr_thresh = models.IntegerField(default=60) #Yellow to red threshold
    parent_user = models.CharField(max_length=50)
    permission = models.CharField(max_length=5, default='User') #Can only be "Admin" or "User" hence limit is 5
    organization = models.CharField(max_length=150, default='Not Assigned')


#Notifications, which can have CCN, email, SMS

class Notifications(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, max_length=50)
    gty_web_alert = models.BooleanField(default = True)
    gty_email_alert = models.BooleanField(default = False)
    ytr_web_alert = models.BooleanField(default=True)
    ytr_email_alert = models.BooleanField(default=False)
    clean_basin_web_alert = models.BooleanField(default=True)
    clean_basin_email_alert = models.BooleanField(default=False)
    gps_update_web_alert = models.BooleanField(default=True)
    gps_update_email_alert = models.BooleanField(default=False)

class NotificationAlerts(models.Model):
    device_identifier = models.ForeignKey("Device", on_delete=models.CASCADE, max_length=20)
    notification_type = models.CharField(max_length=250)
    alert_date = models.DateTimeField(auto_now=False, auto_now_add=False)

class EmailList(models.Model):
    elist_parent_user = models.CharField(max_length=50)
    third_party_email = models.CharField(max_length=50)


