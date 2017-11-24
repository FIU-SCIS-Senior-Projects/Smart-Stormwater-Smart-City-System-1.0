/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */
var scApp = angular.module('scApp');

scApp.controller("overviewCtrl", function ($scope, $rootScope, $window, $http) {
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

    //below is GPS location on a map
    //there is a line of code half way down to be able to use dummy data.
    //to use dummy data, comment out starting from here to before "var GPS_Locations"
    currentUser = JSON.parse($window.sessionStorage.getItem("currentAccount"));
    var GY_Thresh = currentUser.gy_thresh;
    var YR_Thresh = currentUser.yr_thresh;

    var deviceInformation = $rootScope.deviceList;

    var x;
    var Current_Fill;
    var GPS_Information = [];
    var Device_Information = [];
    var Marker_Color;

    for (x = 0; x < deviceInformation.length; x++) {
        Device_Information.push(deviceInformation[x].identifier);
        Device_Information.push(deviceInformation[x].location);
        Device_Information.push(deviceInformation[x].latitude);
        Device_Information.push(deviceInformation[x].longitude);
        Current_Fill = deviceInformation[x].fill_level;

        if (GY_Thresh >= Current_Fill) {
            Marker_Color = 'GREEN';
        }
        else if (GY_Thresh < Current_Fill && YR_Thresh >= Current_Fill) {
            Marker_Color = 'YELLOW';
        }
        else if (YR_Thresh < Current_Fill) {
            Marker_Color = 'RED';
        }
        Device_Information.push(Marker_Color);
        GPS_Information.push(Device_Information);
        Device_Information = [];
    }

    var GPS_Locations = [
      ['FIU Engineering Center', '10555 West Flagler St Miami Fl 33174', 25.769, -80.367, 'RED'],
      ['FIU1', '11200 SW 8th Street Miami Fl 33199', 25.758, -80.375, 'GREEN'],
      ['FIU2', '3000 NE 151st Street North Miami Fl 33181', 25.915, -80.145, 'YELLOW'],
    ];

    //comment out the line below to use fake data for testing/demonstration
    GPS_Locations = GPS_Information;

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(25.761, -80.191),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker;
    var k;
    var iconColor;
    var iconImage;
    var iconShadow;

    iconShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));

    for (k = 0; k < GPS_Locations.length; k++) {
        if (GPS_Locations[k][4] == 'GREEN') {
            iconColor = "008000";
            iconImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + iconColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));

        }
        else if (GPS_Locations[k][4] == 'YELLOW') {
            iconColor = "FFFF00";
            iconImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + iconColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
        }
        else if (GPS_Locations[k][4] == 'RED') {
            iconColor = "FF0000";
            iconImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + iconColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
        }
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(GPS_Locations[k][2], GPS_Locations[k][3]),
            map: map,
            icon: iconImage,
            shadow: iconShadow
        });

        google.maps.event.addListener(marker, 'click', (function(marker, k) {
            return function() {
            infowindow.setContent("<p>Device: " + GPS_Locations[k][0] + "<br />" +
                                    "Address: " + GPS_Locations[k][1] + "</p>");
            infowindow.open(map, marker);
            }
        })(marker, k));
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
