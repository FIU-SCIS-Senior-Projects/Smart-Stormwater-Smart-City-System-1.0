/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */
var scApp = angular.module('scApp');

scApp.controller("overviewCtrl", function ($scope, $rootScope, $http) {
    $scope.dev1 = 1;
    $scope.dev2 = 3;
    $scope.username = "VIPUser";
    $scope.Changed = "";
    $scope.devicesChecked = [];


    $scope.devicesInfo = $rootScope.deviceList;


    $scope.selectDev = function (device) {
        var index = $scope.devicesChecked.indexOf(device.identifier);

        if (index > -1) {
            $scope.devicesChecked.splice(index, 1);
        } else {
            $scope.devicesChecked.push(device.identifier);
        }
    }


    $scope.updateGPS = function () {
        var newAddr = [
            {
                identifier: 'OB1000001703AA42',
                location: 'Miami Dade'
        }, {
                identifier: 'OB1000001703AA40',
                location: 'Sweden'
        }
    ];

        var i, j;

        for (i = 0; i < newAddr.length; i++) {
            for (j = 0; j < $scope.devicesInfo.length; j++) {
                if ($scope.devicesInfo[j].identifier == newAddr[i].identifier) {
                    break;
                }
            }
            $scope.devicesInfo[j].location = newAddr[i].location;
            $rootScope.deviceList[j].location = newAddr[i].location;

        }

        /*var i, j, ind;
        for (i = 0; i < change.length; i++) {
            for (j = 0; j < $scope.devicesInfo.length; j++) {
                if ($scope.devicesInfo[j].identifier == change[i].identifier) {
                    break;
                }
            }
            console.log(ind + " which is, " + $scope.devicesInfo[ind]);
            $scope.devicesInfo[j].location = change[i].location;

        }

        $http.post("http://127.0.0.1:8000/updateGPS", JSON.stringify({
                devList: $scope.devicesChecked
            }))
            .then(function (response) {
                var newAddr = response.data;

                var i, j;

                for (i = 0; i < newAddr.length; i++) {
                    for (j = 0; j < $scope.devicesInfo.length; j++) {
                        if ($scope.devicesInfo[j].identifier == newAddr[i].identifier) {
                            break;
                        }
                    }
                    $scope.devicesInfo[j].location = newAddr[i].location;
                    $rootScope.deviceList[j].location = newAddr[i].location;

                }

            })*/
    }

    $scope.updateRepInterval = function () {
        console.log("Checked list for Int: " + $scope.devicesChecked);
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
