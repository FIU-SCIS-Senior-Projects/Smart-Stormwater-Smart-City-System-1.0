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
        account = json.loads(request.body.decode('utf-8'))
        accID = account['username']
        accPass = account['password']
        accEmail = account['email']
        accNumber = account['number']
        #accLanguage = account['language']
        accGYthresh = account['gy_thresh']
        accYRthresh = account['yr_thresh']

        #if accPass != confirmPass:
            #return HttpResponse("Password do not match", status=409)
            #return JsonResponse(account)

        #else:
        try:
            #creates a new user from input data and stores it into database
            newAcc = User(username = accID, password = accPass, email = accEmail, number = accNumber, gy_thresh = accGYthresh, yr_thresh = accYRthresh)
            newAcc.save()

            #creates default notifications with web notifications set to true, email and sms set to false
            newAccNotif = Notifications(user = newAcc, gty_ccn_alert = True, gty_email_alert = False, gty_sms_alert = False, ytr_ccn_alert = True, ytr_email_alert = False, ytr_sms_alert = False)
            newAccNotif.save()

            # delete the account after testing that it works
            deleteTest = User.objects.get(username = accID)

            #not needed?
            # deleteTest = setUpDelete.choice_set.filter(username__startwith = 'accID')

            deleteTest.delete()

            #accountCreated = {'username' : 'accID'}
            JsonResponse(deleteTest)
            #return HttpResponse("Account created and deleted", status=200)

        except account.cannotbecreated:
            accNotCreated = {"account" : 'false'}
            return JsonResponse(accNotCreated)

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
class NotificationsList(APIView):
    def get(self, request, *args, **kwargs):
        return JsonResponse()

    def post(self, request, *args, **kwargs):


        return JsonResponse()

#This post method should take the given information from the json and store it to the database, linking the device to its owner.
class RegisterDevice(APIView):
    def post(self, request, *args, **kwargs):
        return JsonResponse()