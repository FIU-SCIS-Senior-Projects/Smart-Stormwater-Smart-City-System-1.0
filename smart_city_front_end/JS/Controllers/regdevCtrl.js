var scApp = angular.module("scApp");

scApp.controller("regdevCtrl", function ($scope) {
    $scope.devSerialNumber = "";
    $scope.deviceName = "";
    $scope.location = "";

    $scope.signInUser = function () {
        $scope.hasSignedIn = $scope.username + ", " + $scope.password;
    }

});
