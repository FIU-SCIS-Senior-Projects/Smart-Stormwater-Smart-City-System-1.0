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
            templateUrl: './signin.html',
            controller: 'signinCtrl',
            css: 'signin.css'
        })
        .when('/overview', {
            templateUrl: './overview.html',
            controller: 'overviewCtrl',
            css: 'overview.css'
        })
        .when('/register-account', {
            templateUrl:'./registeraccount.html',
            controller: 'regaccCtrl'
        })
        .when('/register-device', {
            templateUrl: './registerdevice.html',
            controller: 'regdevCtrl'
        })
        .when('/account-settings',{
            templateUrl: './accountsettings.html',
            controller: 'accsetCtrl'
        })
        .when('/notification-settings',{
            templateUrl: './notificationsettings.html',
            controller: 'notifsetCtrl'
        })
    }
]);
