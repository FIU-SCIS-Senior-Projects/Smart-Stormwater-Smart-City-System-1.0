var scApp = angular.module("scApp");

scApp.controller("accsetCtrl", function ($scope) {
    $scope.username = "newComp";
    $scope.password = "newCompPW";
    $scope.contactEmail = "ceoguy@newcomp.com";
    $scope.contactNumber = "7861234567";
    $scope.gtythresh = 35;
    $scope.ytrthresh = 75;
    $scope.ccn = false;
    $scope.email = false;
    $scope.sms = false;
    $scope.hasRegistered = $scope.username + ", " + $scope.password + ", " + $scope.contactEmail + ", " + $scope.contactNumber + ", " + (+$scope.gtythresh + +$scope.ytrthresh) + ", " + $scope.ccn + ", " + $scope.email + ", " + $scope.sms;

    $scope.updateInfo = function () {
        $scope.hasRegistered = $scope.username + ", " + $scope.password + ", " + $scope.contactEmail + ", " + $scope.contactNumber + ", " + (+$scope.gtythresh + +$scope.ytrthresh) + ", " + $scope.ccn + ", " + $scope.email + ", " + $scope.sms;
    }

});
