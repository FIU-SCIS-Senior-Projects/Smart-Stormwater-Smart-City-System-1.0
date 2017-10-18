/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */
var scApp = angular.module('scApp');

scApp.controller("overviewCtrl", function ($scope, $rootScope) {
    console.log($rootScope.username);
    $scope.dev1 = 1;
    $scope.dev2 = 3;
    $scope.username = "VIPUser";
    $scope.Changed = "";
    
    
    $scope.devicesInfo = $rootScope.deviceList;
        
        /*[
        {
            identifier: 'ID0002',
            batteryLevel: '67%',
            fillLevel: '43%',
            location: 'FIU EC'
        },{
            identifier: 'ID0003',
            batteryLevel: '96%',
            fillLevel: '77%',
            location: 'FIU MMC'
        }
    ]*/

    $scope.calculate = function () {
        $scope.calculation = $scope.dev1 + " + " + $scope.dev2 + " = " + (+$scope.dev1 + +$scope.dev2);
    }

    $scope.changeUsername = function () {
        $scope.username = $scope.Changed;
    }
});

/*!
 * Start Bootstrap - SB Admin 2 v3.3.7+1 (http://startbootstrap.com/template-overviews/sb-admin-2)
 * Copyright 2013-2016 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
