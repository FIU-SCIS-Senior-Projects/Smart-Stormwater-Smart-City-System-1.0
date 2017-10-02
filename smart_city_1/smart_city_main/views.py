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
        print("inside API")
        user = json.loads(request.body.decode('utf-8'))
        userID = user['username']
        userPass = user['password']

        try:
            person = User.objects.get(username= userID)

            if person.password == userPass:
                #return HttpResponse("User found", status=200)
                theUser = {'username': person.username, 'password': person.password, 'email': person.email, 'phone': person.number, 'language': person.language, 'gy_thresh': person.gy_thresh, 'yr_thresh': person.yr_thresh}
                return JsonResponse(theUser)

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

        return JsonResponse()

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


        return JsonResponse()

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

#This post method should take the given information from the json and store it to the database, linking the device to its owner.
class RegisterDevice(APIView):
    def post(self, request, *args, **kwargs):
        return JsonResponse()