from django.db import models

# Could make models for:

# Products, which can have Owner, Serial Number,Location, Waste Type, Custom, and possibly more from section 4.4

class Device(models.Model):
    user = models.ForeignKey(on_delete=models.CASCADE, max_length=50)
    serial_number = models.CharField(max_length=20)
    location = models.CharField(max_length=50)
    waste_type = models.CharField(max_length=20)
    custom = models.CharField(max_length=255)

#Users, which can have userID, username, password, contact email, contact number, language, green-to-yellow threshold, yellow-to-red threshold. (section 6)


class User(models.Model):
    username = models.CharField(primary_key=True, unique=True, max_length=50)
    password = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    number = models.CharField(max_length=15)
    language = models.CharField(max_length=20)
    gy_thresh = models.IntegerField(max_length=2) #Green to yellow threshold
    yr_thresh = models.IntegerField(max_length=2) #Yellow to red threshold


#Notifications, which can have CCN, email, SMS

class Notifications(models.Model):
    user = models.ForeignKey(on_delete=models.CASCADE, max_length=50)
    gty_ccn_alert = models.BooleanField(initial = False)
    gty_email_alert = models.BooleanField(initial = False)
    gty_sms_alert = models.BooleanField(initial = False)
    ytr_ccn_alert = models.BooleanField(initial=False)
    ytr_email_alert = models.BooleanField(initial=False)
    ytr_sms_alert = models.BooleanField(initial=False)



