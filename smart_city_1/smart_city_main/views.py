from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from smart_city_main.models import *
from itertools import chain
from django.core.mail import send_mail
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
                                'device_type': theDev.device_type, 'custom': theDev.custom, 'report_interval': theDev.report_interval}
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
    def get(self, request, *args, **kwargs):
        #Organization = User.objects.order_by('organization').values_list('organization').distinct();
        #return JsonResponse(list(Organization));

        #Try this one if the above doesn't return a list
        #Organization = User.objects.order_by('organization').values('organization').distinct();
        #return JsonResponse(list(Organization));

        #same for this one
        try:
            Organization = User.objects.order_by('organization').values('organization').distinct();
        except:
            pass

        return JsonResponse(list(Organization), safe=False);

    def post(self, request, *args, **kwargs):
        account = json.loads(request.body.decode('utf-8'))
        accUsername = account['username']
        accPass = account['password']
        accEmail = account['email']
        accNumber = account['number']
        #accLanguage = account['language']
        accGYthresh = account['gy_thresh']
        accYRthresh = account['yr_thresh']
        accOrganization = account['organization']
        accPermission = account['permission']
        accParentUser = account['parent_user']

        if (accPermission == ""):
            setPermission = {'username': 'Need to set account type'}
            return JsonResponse (setPermission);


        try:
            checkUser = User.objects.get(username = accUsername)
            usernameUnavailable = {'username' : 'username already taken'}
            return JsonResponse(usernameUnavailable)

        except User.DoesNotExist:
            #creates a new user from input data and stores it into database
            newAcc = User(username = accUsername, password = accPass, email = accEmail, number = accNumber, language = "English", gy_thresh = accGYthresh, yr_thresh = accYRthresh,
                          organization = accOrganization, permission = accPermission, parent_user = accParentUser)
            newAcc.save()

            #creates default notifications with web notifications set to true, email and sms set to false
            newAccNotif = Notifications(user = newAcc, gty_web_alert = True, gty_email_alert = False, ytr_web_alert = True, ytr_email_alert = False,
                                        clean_basin_web_alert = True, clean_basin_email_alert = False, gps_update_web_alert = True, gps_update_email_alert = False)
            newAccNotif.save()

            accountCreated = {"username" : accUsername + ' created'}
            return JsonResponse(accountCreated)

#This is for the account settings, the get method gets the information from the database for a user and the post is to be used to update the user account information.
class AccountSetDetails(APIView):

    def get(self, request, *args, **kwargs):
        # Fill this in to return appropriate information for main page once logged in
        # This section takes the params that is given in the url as the query string and
        # takes out the "username=" part to get the actual username of the user to then be able to search with it.
        # I was initially gonna do it with JSON but nothing I tried worked.
        # Got this idea from: https://stackoverflow.com/questions/12572362/get-a-string-after-a-specific-substring

        theMeta = request.META['QUERY_STRING']  # Got the query string, aka "username=(enterusernamehere)"

        cutOff = "username="  # Sets up a variable to use so it takes out the "username=" part of the query string in the next operation

        userID = theMeta[theMeta.index(cutOff) + len(cutOff):]  # This cuts out the "username=" part and just has the actually username left

        # -------------------------------------------------------------------------------------------------
        try:
            thisUser = User.objects.get(username=userID)
            userAccountSettings = {
                'username': thisUser.username,
                'password': thisUser.password,
                'email': thisUser.email,
                'number': thisUser.number,
                'language': thisUser.language,
                'gy_thresh': thisUser.gy_thresh,
                'yr_thresh': thisUser.yr_thresh,
                'parent_user': thisUser.parent_user
            }
            return JsonResponse(userAccountSettings)

        except:
            pass

        return JsonResponse()

    #Assumes that all the input fields are returned from the front end. Can be changed to first check.
    def post(self, request, *args, **kwargs):
        userInfo = json.loads(request.body.decode('utf-8'))
        updateUsername = userInfo['username']
        updatePass = userInfo['password']
        updateEmail = userInfo['email']
        updateNumber = userInfo['number']
        #updateLanguage = userInfo['language']
        updateGYthresh = userInfo['gy_thresh']
        updateYRthresh = userInfo['yr_thresh']
        try:
            theUser = User.objects.get(username = updateUsername)

            if (updatePass != ""):
                theUser.password = updatePass

            theUser.email = updateEmail
            theUser.number = updateNumber
            #theUser.language = userInfo['language']
            theUser.gy_thresh = updateGYthresh
            theUser.yr_thresh = updateYRthresh
            theUser.save()

            updateInfo = {"username": theUser.username + 'updated'}
            return JsonResponse(updateInfo)

        except User.DoesNotExist:
            errorInfo = {"username": 'user does not exist'}
            return JsonResponse(errorInfo)


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
            thirdPartyEmail = EmailList.objects.filter(elist_parent_user = theUser).order_by('third_party_email').values_list('third_party_email', flat = True).distinct()

            allNotif = {
                'gty_web': userNT.gty_web_alert,
                'gty_email': userNT.gty_email_alert,
                'ytr_web': userNT.ytr_web_alert,
                'ytr_email': userNT.ytr_email_alert,
                'clean_basin_web': userNT.clean_basin_web_alert,
                'clean_basin_email': userNT.clean_basin_email_alert,
                'gps_update_web': userNT.gps_update_web_alert,
                'gps_update_email': userNT.gps_update_email_alert,
                'EmailList': thirdPartyEmail
            }
            return JsonResponse(allNotif)

        except:
            pass

    def post(self, request, *args, **kwargs):
        newInfo = json.loads(request.body.decode('utf-8'))
        userID = newInfo['username']
        email_delete = newInfo['email_delete']
        newEmail = newInfo['newEmail']

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

            for email in email_delete:
                EmailList.objects.filter(elist_parent_user = userID, third_party_email = email).delete()

            if newEmail != "":
                newThirdEmail = EmailList(elist_parent_user = userID, third_party_email = newEmail)
                newThirdEmail.save()

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

    #"get" retrieves all devices that have been assigned to a user
    def get(self, request, *args, **kwargs):
        # This section takes the params that is given in the url as the query string and
        # takes out the "username=" part to get the actual username of the user to then be able to search with it.
        # I was initially gonna do it with JSON but nothing I tried worked.
        # Got this idea from: https://stackoverflow.com/questions/12572362/get-a-string-after-a-specific-substring


        theMeta = request.META['QUERY_STRING']  # Got the query string, aka "username=(enterusernamehere)"

        cutOff = "username="  # Sets up a variable to use so it takes out the "username=" part of the query string in the next operation

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

        ImmediateSubUsers = User.objects.filter(parent_user=userID).values('username', 'permission', 'organization')

        return JsonResponse(list(ImmediateSubUsers), safe=False)

    # "post" gets a JSON that has 2 lists: a list of usernames and a list of devices that are to be assigned to those list of usernames
    # Not under "Device Operations" due to this class is the class assigned to the sub-users list page
    def post(self, request, *args, **kwargs):
        twoLists = json.loads(request.body.decode('utf-8'))
        subList = twoLists['usersChecked']
        devList = twoLists['devicesChecked']

        for sub in subList:
            for dev in devList:

                try:
                    #If a particular assignment doesn't exist, then create that assignment and save to the database.
                    if not (AssignedTo.objects.filter(user=sub, assigned_device=dev).exists()):
                        newAssignment = AssignedTo(user=sub, assigned_device=dev)
                        newAssignment.save()


                except:
                    return HttpResponse("Couldn't Save. Errors Occurred", status=417)

        return HttpResponse("Assignments Saved!", status=200)

class ModifySubUser(APIView):
    def get(self, request, *args, **kwargs):
        return HttpResponse();

    def post(self, request, *args, **kwargs):
        userInfo = json.loads(request.body.decode('utf-8'))
        updateUsername = userInfo['username']
        updatePass = userInfo['password']
        updateEmail = userInfo['email']
        updateNumber = userInfo['number']
        # updateLanguage = userInfo['language']
        updateGYthresh = userInfo['gy_thresh']
        updateYRthresh = userInfo['yr_thresh']
        updatePermission = userInfo['permission']
        try:
            theUser = User.objects.get(username=updateUsername)

            if (updatePass != ""):
                theUser.password = updatePass

            theUser.email = updateEmail
            theUser.number = updateNumber
            # theUser.language = userInfo['language']
            theUser.gy_thresh = updateGYthresh
            theUser.yr_thresh = updateYRthresh

            #checks if the user is being changed to a "user" type account by going through the database
            #and searching for any user that has this user as a "parent_user" and if that subuser has
            #an "admin" type account.
            if (updatePermission == "User"):
                try:
                    subUserSearch = User.objects.get(parent_user=updateUsername, permission="Admin")
                    permissionError = {"username": '1'}
                    return JsonResponse(permissionError);

                except User.DoesNotExist:
                    theUser.permission = updatePermission

            if (updatePermission == "Admin"):
                theUser.permission = updatePermission


            theUser.save()
            updateInfo = {"username": theUser.username + 'updated'}
            return JsonResponse(updateInfo)

        except User.DoesNotExist:
            errorInfo = {"username": 'user does not exist'}
            return JsonResponse(errorInfo)


class SeeDeviceAssignments(APIView):

    #Get all the sub-users and pairs them with the devices they are assigned to
    def get(self, request, *args, **kwargs):
        # This section takes the params that is given in the url as the query string and
        # takes out the "username=" part to get the actual username of the user to then be able to search with it.
        # I was initially gonna do it with JSON but nothing I tried worked.
        # Got this idea from: https://stackoverflow.com/questions/12572362/get-a-string-after-a-specific-substring

        theMeta = request.META['QUERY_STRING']  # Got the query string, aka "username=(enterusernamehere)"

        cutOff = "username="  # Sets up a variable to use so it takes out the "username=" part of the query string in the next operation

        userID = theMeta[theMeta.index(cutOff) + len(cutOff):]  # This cuts out the "username=" part and just has the actually username left

        # -------------------------------------------------------------------------------------------------

        SubsWithDevice = []

        ImmediateSubUsers = User.objects.filter(parent_user=userID).values('username', 'permission', 'organization')
        MyDevices = AssignedTo.objects.filter(user=userID)

        for sub in ImmediateSubUsers:
            for dev in MyDevices:
                alreadyExists = AssignedTo.objects.filter(user=sub['username'], assigned_device=dev.assigned_device).exists()
                if alreadyExists:
                    newEntry = {
                        'assigned_device': dev.assigned_device,
                        'username': sub['username'],
                        'permission': sub['permission'],
                        'organization': sub['organization']
                    }
                    SubsWithDevice.append(newEntry)


        return JsonResponse(SubsWithDevice, safe=False)

    # This deals with deleting the assignments between the user's sub-users and a device they chose.
    def post(self, request, *args, **kwargs):
        twoLists = json.loads(request.body.decode('utf-8'))
        subList = twoLists['usersChecked']
        devSelected = twoLists['deviceChecked']

        for sub in subList:

            #This gets all the sub-user's sub-users to then add to the list of sub-users to unassign. If their parent's are unassigned, they are unassigned.
            AnotherSubUserLayer = User.objects.filter(parent_user=sub)
            for underSub in AnotherSubUserLayer:
                subList.append(underSub.username)

            try:
                #This assumes that each assignment that was passed in the request, is in the database
                subQuerySet = AssignedTo.objects.filter(user=sub, assigned_device=devSelected)
                if subQuerySet.exists():
                    subQuerySet.delete()

            except:
                return HttpResponse("Couldn't Delete. Errors Occurred", status=417)


        return HttpResponse("Assignments Deleted!", status=200)

class Email(APIView):
    def post(self, request, *args, **kwargs):
        DeviceInfo = json.loads(request.body.decode('utf-8'))
        DeviceID = DeviceInfo['DeviceID']
        Fill_Level = DeviceInfo['Fill_Level']

        Message = "The Device: " + DeviceID + " is " + Fill_Level + "% full."

        UserAssignedToDevice = AssignedTo.objects.filter(assigned_device = DeviceID).values_list('user', flat = True).order_by('user')
        #Green to Yellow threshold email list
        GY_EmailList = []
        #Yellow to Red threshold email list
        YR_EmailList = []
        try:
            for user in UserAssignedToDevice:
                    #checks if the user has threshold levels of Green To Yellow and compares it to the Fill_Level info being sent in.
                    #checks if the user has Green To Yellow email notifications
                    GY_ThreshCheckFilter = User.objects.filter(username=user, gy_thresh__lte=Fill_Level, yr_thresh__gt=Fill_Level)
                    GY_EmailCheck = Notifications.objects.filter(user = user, gty_email_alert = True)

                    #checks the EmailList and sees if any third party emails are associated with the current user
                    EmailListCheck = EmailList.objects.filter(elist_parent_user = user).values_list('third_party_email', flat = True).order_by('third_party_email')

                    #checks if the user has threshold levels of Yellow to Red and compares it to the Fill_Level info being sent in.
                    #checks if the user has Yellow To Red email notifications
                    YR_ThreshCheckFilter = User.objects.filter(username=user, yr_thresh__lte=Fill_Level)
                    YR_EmailCheck = Notifications.objects.filter(user=user, ytr_email_alert=True)



                    #checks if the following has something in it. If it does, get the email for the assoicated user and send the email.
                    if (GY_ThreshCheckFilter.exists() & GY_EmailCheck.exists()):
                        GY_ThreshCheck = User.objects.get(username=user, gy_thresh__lte=Fill_Level, yr_thresh__gt=Fill_Level)
                        GY_EmailRecipient = GY_ThreshCheck.email
                        GY_EmailList.append(GY_EmailRecipient)

                        if EmailListCheck.exists():
                            for third_email in EmailListCheck:
                                EmailListRecipient = EmailList.objects.get(elist_parent_user=user, third_party_email=third_email)
                                #Green to Yellow Email List Recipient's Email
                                GY_ELREmail = EmailListRecipient.third_party_email
                                GY_EmailList.append(GY_ELREmail)


                    if (YR_ThreshCheckFilter.exists() & YR_EmailCheck.exists()):
                        YR_ThreshCheck = User.objects.get(username=user, gy_thresh__lte=Fill_Level, yr_thresh__gt=Fill_Level)
                        YR_EmailRecipient = YR_ThreshCheck.email
                        YR_EmailList.append(YR_EmailRecipient)

                        if EmailListCheck.exists():
                            for third_email in EmailListCheck:
                                EmailListRecipient = EmailList.objects.get(elist_parent_user=user, third_party_email=third_email)
                                YR_ELREmail = EmailListRecipient.third_party_email
                                YR_EmailList.append(YR_ELREmail)


            GY_EmailListUnique = list(set(GY_EmailList))
            send_mail(
                'Smart City Yellow Threshold Alert',
                Message,
                'DoNotReply@smartcity.com',
                GY_EmailListUnique,
                fail_silently = False,
            )

            YR_EmailListUnique = list(set(YR_EmailList))
            send_mail(
                'Smart City Yellow Threshold Alert',
                Message,
                'DoNotReply@smartcity.com',
                YR_EmailListUnique,
                fail_silently = False,
            )


            return HttpResponse('Emails Sent', status = 200);

        except:
            return HttpResponse('Error', status = 417);
