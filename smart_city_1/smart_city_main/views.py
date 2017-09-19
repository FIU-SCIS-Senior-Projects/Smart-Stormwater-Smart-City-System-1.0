from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from smart_city_1.smart_city_main.models import *
import json

def index(request):
    return HttpResponse("Hello, world. And all those who inhabit it!")

#This post method should verify that the username and password is valid, if so send an OK response, else send an error.
#Might have to be a get() method instead to return user account data needed for the following page.
class Login(APIView):
    def post(self, request, *args, **kwargs):


        return JsonResponse()

#This post should taken the given information from the json and save the information to the database. Give an 'OK' if saved, error if not.
class RegisterAccount(APIView):
    def post(self, request, *args, **kwargs):

        return JsonResponse()

#This is for the account settings, the get method gets the information from the database for a user and the post is to be used to update the user account information.
class AccountSetDetails(APIView):

    def get(self, request, *args, **kwargs):
        #Fill this in to return appropriate information for main page once logged in

        return JsonResponse()

    def post(self, request, *args, **kwargs):
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