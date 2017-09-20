/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */
var scApp = angular.module('scApp');

scApp.controller("mainCtrl", function ($scope) {
    $scope.dev1 = 1;
    $scope.dev2 = 3;
    $scope.username = "VIPUser";
    $scope.Changed = "";

    $scope.calculate = function () {
        $scope.calculation = $scope.dev1 + " + " + $scope.dev2 + " = " + (+$scope.dev1 + +$scope.dev2);
    }

    $scope.changeUsername = function () {
        $scope.username = $scope.Changed;
    }
});