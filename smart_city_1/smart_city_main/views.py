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
        return JsonResponse()

    def post(self, request, *args, **kwargs):
        newInfo = json.loads(request.body.decode('utf-8'))
        userID = newInfo['username']

        try:
            theUser = Notifications.objects.get(user= userID)

            theUser.gty_web_alert = newInfo['gty_web']
            theUser.gty_email_alert = newInfo['gty_email']
            theUser.ytr_web_alert = newInfo['ytr_web']
            theUser.ytr_email_alert = newInfo['ytr_email']
            theUser.clean_basin_web_alert = newInfo['clean_basin_web']
            theUser.clean_basin_email_alert = newInfo['clean_basin_email']
            theUser.gps_update_web_alert = newInfo['gps_update_web']
            theUser.gps_update_email_alert = newInfo['gps_update_email']
            theUser.save()

            return HttpResponse("Information Saved!", status=200)


        except User.DoesNotExist:
            pass



        return JsonResponse()

#This post method should take the given information from the json and store it to the database, linking the device to its owner.
class RegisterDevice(APIView):
    def post(self, request, *args, **kwargs):
        return JsonResponse()