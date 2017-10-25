var scApp = angular.module('scApp');

scApp.controller("navbarCtrl", function ($scope, $rootScope, $location) {
    $scope.logOff = function(){
        $rootScope.loggedIn = false;
        $location.url("/");
    }
});