from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from smart_city_main.models import *
from itertools import chain
import json

def index(request):
    return HttpResponse("Hello, world. And all those who inhabit it!")

#This post method should verify that the username and password is valid, if so send an OK response, else send an error.
#Might have to be a get() method instead to return user account data needed for the following page.
class Login(APIView):
    def post(self, request, *args, **kwargs):
        user = json.loads(request.body.decode('utf-8'))
        userID = user['username']
        userPass = user['password']

        try:
            person = User.objects.get(username= userID)

            if person.password == userPass:

                allAssigned = AssignedTo.objects.filter(user=userID)

                deviceList = []

                for dev in allAssigned:
                    theDev = Device.objects.get(identifier=dev.assigned_device)

                    newEntry = {'identifier': theDev.identifier, 'location': theDev.location,
                                'battery_level': theDev.battery_level, 'fill_level': theDev.fill_level,
                                'waste_type': theDev.waste_type, 'custom': theDev.custom, 'report_interval': theDev.report_interval}
                    deviceList.append(newEntry)

                #finalList = list(deviceList)

                #return HttpResponse("User found", status=200)
                theUser = {'username': person.username,
                           'password': person.password,
                           'email': person.email,
                           'phone': person.number,
                           'language': person.language,
                           'gy_thresh': person.gy_thresh,
                           'yr_thresh': person.yr_thresh,
                           'deviceList': [dev for dev in deviceList]}
                return JsonResponse(theUser, safe=False)

            else:
                wrongUser = {'username': 'incorrect_password'}
                return JsonResponse(wrongUser)
                #return HttpResponse("Password does not match", status=409)


        except User.DoesNotExist:
            noUser = {'username': 'nonexistant'}
            return JsonResponse(noUser)
            #return HttpResponse("Username {} does not exist".format(userID), status=409)




#This post should taken the given information from the json and save the information to the database. Give an 'OK' if saved, error if not.
class RegisterAccount(APIView):
    def post(self, request, *args, **kwargs):
        account = json.loads(request.body.decode('utf-8'))
        accID = account['username']
        accPass = account['password']
        accEmail = account['email']
        accNumber = account['number']
        #accLanguage = account['language']
        accGYthresh = account['gy_thresh']
        accYRthresh = account['yr_thresh']

        #creates a new user from input data and stores it into database
        newAcc = User(username = accID, password = accPass, email = accEmail, number = accNumber, gy_thresh = accGYthresh, yr_thresh = accYRthresh)
        newAcc.save()

        #creates default notifications with web notifications set to true, email and sms set to false
        newAccNotif = Notifications(user = newAcc, gty_web_alert = True, gty_email_alert = False, ytr_web_alert = True, ytr_email_alert = False,
                                    clean_basin_web_alert = True, clean_basin_email_alert = False, gps_update_web_alert = True, gps_update_email_alert = False)
        newAccNotif.save()

        #delete the account after testing that it works
        deleteTest = User.objects.get(username = accID)
        deleteTest.delete()

        accountCreated = {"username" : "account created"}
        return JsonResponse(accountCreated)
            #return HttpResponse("Account created and deleted", status=200)

#This is for the account settings, the get method gets the information from the database for a user and the post is to be used to update the user account information.
class AccountSetDetails(APIView):

    def get(self, request, *args, **kwargs):
        #Fill this in to return appropriate information for main page once logged in

        return JsonResponse()

    #Assumes that all the input fields are returned from the front end. Can be changed to first check.
    def post(self, request, *args, **kwargs):
        userInfo = json.loads(request.body.decode('utf-8'))
        try:
            theUser = User.objects.get(pk = userInfo['username'])
            theUser.password = userInfo['password']
            theUser.email = userInfo['email']
            theUser.number = userInfo['phone']
            theUser.language = userInfo['language']
            theUser.gy_thresh = userInfo['gy_thresh']
            theUser.yr_thresh = userInfo['yr_thresh']
            theUser.save()
            return HttpResponse("Success", status=200)


        except:
            return HttpResponse("Success", status=417)




        return JsonResponse()


#this is for the notifications page where the get method is for retrieving the devices and the notifications per device. The post method is used to update the notifications for each device
#This can be combined with 'AccountSetDetails' above if they are to be put into one page.
class NotificationsSet(APIView):
    def get(self, request, *args, **kwargs):

        #This section takes the params that is given in the url as the query string and
        # takes out the "username=" part to get the actual username of the user to then be able to search with it.
        #I was initially gonna do it with JSON but nothing I tried worked.
        #Got this idea from: https://stackoverflow.com/questions/12572362/get-a-string-after-a-specific-substring

        theMeta = request.META['QUERY_STRING']   #Got the query string, aka "username=(enterusernamehere)"

        cutOff = "username="   #Sets up a variable to use so it takes out the "username=" part of the query string in the next operation

        userID = theMeta[theMeta.index(cutOff) + len(cutOff):]   #This cuts out the "username=" part and just has the actually username left

        #-------------------------------------------------------------------------------------------------

        try:
            theUser = User.objects.get(username=userID)
            userNT = Notifications.objects.get(user=theUser)
            allNotif = {
                'gty_web': userNT.gty_web_alert,
                'gty_email': userNT.gty_email_alert,
                'ytr_web': userNT.ytr_web_alert,
                'ytr_email': userNT.ytr_email_alert,
                'clean_basin_web': userNT.clean_basin_web_alert,
                'clean_basin_email': userNT.clean_basin_email_alert,
                'gps_update_web': userNT.gps_update_web_alert,
                'gps_update_email': userNT.gps_update_email_alert
            }
            return JsonResponse(allNotif)

        except:
            pass

    def post(self, request, *args, **kwargs):
        newInfo = json.loads(request.body.decode('utf-8'))
        userID = newInfo['username']

        try:
            theUserNotif = Notifications.objects.get(user= userID)

            theUserNotif.gty_web_alert = newInfo['gty_web']
            theUserNotif.gty_email_alert = newInfo['gty_email']
            theUserNotif.ytr_web_alert = newInfo['ytr_web']
            theUserNotif.ytr_email_alert = newInfo['ytr_email']
            theUserNotif.clean_basin_web_alert = newInfo['clean_basin_web']
            theUserNotif.clean_basin_email_alert = newInfo['clean_basin_email']
            theUserNotif.gps_update_web_alert = newInfo['gps_update_web']
            theUserNotif.gps_update_email_alert = newInfo['gps_update_email']
            theUserNotif.save()

            return HttpResponse("Information Saved!", status=200)


        except Notifications.DoesNotExist:
            return HttpResponse("Information could not be saved!", status=417)



        return JsonResponse()

class NotificationAlertList(APIView):
    def get(self, request, *args, **kwargs):

        # This section takes the params that is given in the url as the query string and
        # takes out the "username=" part to get the actual username of the user to then be able to search with it.
        # I was initially gonna do it with JSON but nothing I tried worked.
        # Got this idea from: https://stackoverflow.com/questions/12572362/get-a-string-after-a-specific-substring

        theMeta = request.META['QUERY_STRING']  # Got the query string, aka "username=(enterusernamehere)"

        cutOff = "username="  # Sets up a variable to use so it takes out the "username=" part of the query string in the next operation

        userID = theMeta[theMeta.index(cutOff) + len(cutOff):]  # This cuts out the "username=" part and just has the actually username left

        # -------------------------------------------------------------------------------------------------

        #Get all the devices that the user has assigned to them
        assignmentList = AssignedTo.objects.filter(user = userID)

        allAlerts = []

        #For each device assigned, get all alerts pertaining to that device
        for assignment in assignmentList:
            theDevice = Device.objects.get(identifier = assignment.assigned_device)
            devAlerts = NotificationAlerts.objects.filter(device_identifier = assignment.assigned_device).values('device_identifier', 'notification_type', 'alert_date')
            devAlertsList = list(devAlerts)

            #Add all sets of alerts to the "allAlerts" list
            for alert in devAlertsList:
                alert['location'] = theDevice.location

                allAlerts.append(alert)


        return JsonResponse(allAlerts, safe=False)



#This post method should take the given information from the json and store it to the database, linking the device to its owner.
class DeviceOperations(APIView):
    def get(self, request, *args, **kwargs):
        # This section takes the params that is given in the url as the query string and
        # takes out the "username=" part to get the actual username of the user to then be able to search with it.
        # I was initially gonna do it with JSON but nothing I tried worked.
        # Got this idea from: https://stackoverflow.com/questions/12572362/get-a-string-after-a-specific-substring
        print("Hi dev op")
        theMeta = request.META['QUERY_STRING']  # Got the query string, aka "username=(enterusernamehere)"
        print(theMeta + " is the meta")

        cutOff = "username="  # Sets up a variable to use so it takes out the "username=" part of the query string in the next operation
        print(cutOff + " is the cutOff")

        userID = theMeta[theMeta.index(cutOff) + len(cutOff):]  # This cuts out the "username=" part and just has the actually username left

        # -------------------------------------------------------------------------------------------------

        allAssigned = AssignedTo.objects.filter(user=userID)

        deviceList = []

        for dev in allAssigned:
            theDev = Device.objects.get(identifier = dev.assigned_device)
            deviceList.append(theDev)


        return JsonResponse(list(deviceList), safe=False)

    def post(self, request, *args, **kwargs):
        return JsonResponse()


class SubUsersList(APIView):
    def get(self, request, *args, **kwargs):
        # This section takes the params that is given in the url as the query string and
        # takes out the "username=" part to get the actual username of the user to then be able to search with it.
        # I was initially gonna do it with JSON but nothing I tried worked.
        # Got this idea from: https://stackoverflow.com/questions/12572362/get-a-string-after-a-specific-substring

        theMeta = request.META['QUERY_STRING']  # Got the query string, aka "username=(enterusernamehere)"

        cutOff = "username="  # Sets up a variable to use so it takes out the "username=" part of the query string in the next operation

        userID = theMeta[theMeta.index(cutOff) + len(cutOff):]  # This cuts out the "username=" part and just has the actually username left

        # -------------------------------------------------------------------------------------------------

        ImmediateSubUsers = User.objects.filter(parent_user=userID).values('username')

        return JsonResponse(list(ImmediateSubUsers), safe=False)

    def post(self, request, *args, **kwargs):
        return JsonResponse()