var scApp = angular.module('scApp');

scApp.controller("regaccCtrl", function ($scope) {
    $scope.userID = "";
    $scope.username = "";
    $scope.password = "";
    $scope.confirmPassword
    $scope.contactEmail = "";
    $scope.contactNumber = "";
    $scope.gtythresh = 30;
    $scope.ytrthresh = 60;
    $scope.ccn = false;
    $scope.email = false;
    $scope.sms = false;

    $scope.register = function () {
        $scope.hasRegistered = $scope.userID + ", " + $scope.username + ", " + $scope.password + ", " + $scope.confirmPassword + ", " + $scope.contactEmail + ", " + $scope.contactNumber + ", " + (+$scope.gtythresh + +$scope.ytrthresh) + ", " + $scope.ccn + ", " + $scope.email + ", " + $scope.sms;
    }

});