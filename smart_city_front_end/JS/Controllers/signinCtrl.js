var scApp = angular.module('scApp');

scApp.controller("signinCtrl", function ($scope) {
    $scope.username = "";
    $scope.password = "";

    $scope.signInUser = function () {
        $scope.hasSignedIn = $scope.username + ", " + $scope.password;
    }

});
