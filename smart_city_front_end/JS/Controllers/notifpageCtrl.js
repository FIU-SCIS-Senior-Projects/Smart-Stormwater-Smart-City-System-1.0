var scApp = angular.module("scApp");

scApp.controller("notifpageCtrl", function ($scope, $http, allNotifications) {
    
    $scope.allNotifs = allNotifications

});