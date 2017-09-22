var scApp = angular.module("scApp", ['ngRoute', 'ui.bootstrap']);

scApp.controller("registerCtrl", function ($scope) {
    $scope.username = "";
    $scope.password = "";
    $scope.contactEmail = "";
    $scope.contactNumber = "";
    $scope.gtythresh = 30;
    $scope.ytrthresh = 60;

    $scope.register = function () {
        $scope.hasRegistered = $scope.username + ", " + $scope.password + ", " + $scope.contactEmail + ", " + $scope.contactNumber + ", " + (+$scope.gtythresh + +$scope.ytrthresh);
    }

});

scApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: './HTML/signin.html',
            controller: 'signinCtrl',
            css: 'signin.css'
        })
        .when('/overview', {
            templateUrl: './HTML/overview.html',
            controller: 'overviewCtrl',
            css: 'overview.css'
        })
        .when('/register-account', {
            templateUrl:'./HTML/registeraccount.html',
            controller: 'regaccCtrl'
        })
        .when('/register-device', {
            templateUrl: './HTML/registerdevice.html',
            controller: 'regdevCtrl'
        })
        .when('/account-settings',{
            templateUrl: './HTML/accountsettings.html',
            controller: 'accsetVtrl'
        })
        .when('/notification-settings',{
            templateUrl: './HTML/notificationsettings.html',
            controller: 'notifsetVtrl'
        })
    }
]);
