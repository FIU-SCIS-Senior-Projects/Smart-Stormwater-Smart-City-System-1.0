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
            templateUrl: '../index.html',
            controller: 'mainCtrl'
        }).
        when('/register', {
            templateUrl: '../HTML/register.html',
            controller: 'registerCtrl'
        })
    }
]);

scApp.controller("regaccCtrl", function ($scope) {
    $scope.username = "";
    $scope.password = "";
    $scope.contactEmail = "";
    $scope.contactNumber = "";
    $scope.gtythresh = 30;
    $scope.ytrthresh = 60;
    $scope.ccn = false;
    $scope.email = false;
    $scope.sms = false;

    $scope.register = function () {
        $scope.hasRegistered = $scope.username + ", " + $scope.password + ", " + $scope.contactEmail + ", " + $scope.contactNumber + ", " + (+$scope.gtythresh + +$scope.ytrthresh) + ", " + $scope.ccn + ", " + $scope.email + ", " + $scope.sms;
    }

});
