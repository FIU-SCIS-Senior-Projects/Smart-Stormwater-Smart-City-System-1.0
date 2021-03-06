/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */
var scApp = angular.module('scApp');

scApp.controller("overviewCtrl", function ($scope, $rootScope, $window, $http) {

    $scope.dev1 = 1;
    $scope.dev2 = 3;
    $scope.username = "VIPUser";

    $scope.Changed = "";
    $scope.devicesChecked = [];
    currentUser = JSON.parse($window.sessionStorage.getItem("currentAccount"));

    var devInfo = $rootScope.deviceList;
    console.log(devInfo[0].location);

    var data = [];

    //These conversion are needed to keep track of the int to be used in the device API and the string to know what each int means
    //intervalConversionToInt is to temporarily save a new interval until user selects the "Update Interval" Action
    //intervalConversionToString is to preselect
    $scope.intervalConversionToInt = {
        "Automatic": 5,
        "5 Minutes": 10,
        "10 Minutes": 20,
        "20 Minutes": 30,
        "30 Minutes": 60,
        "1 Hours": 180,
        "3 Hours": 360,
        "6 Hours": 720,
        "12 Hours": 1440
    };
    $scope.intervalConversionToString = {
        5: "Automatic",
        10: "5 Minutes",
        20: "10 Minutes",
        30: "20 Minutes",
        60: "30 Minutes",
        180: "1 Hour",
        360: "3 Hours",
        720: "6 Hours",
        1440: "12 Hours"
    };
    $scope.intervalValues = ["Automatic", "5 Minutes", "10 Minutes", "20 Minutes", "30 Minutes", "1 Hour", "3 Hours", "6 Hours", "12 Hours"];

    //Split the fillData into labels (x-axis) and data (y-axis)
    var fillData = $rootScope.fillLevelLogs;
    /*[
        {
            fill_level: 20,
            date: new Date(2012, 01, 3)
        },
        {
            fill_level: 30,
            date: new Date(2012, 02, 5)
        },
        {
            fill_level: 40,
            date: new Date(2012, 03, 6)
        },
        {
            fill_level: 55,
            date: new Date(2012, 04, 9)
        },
        {
            fill_level: 76,
            date: new Date(2012, 05, 12)
        },
    ];*/

    var deviceInformation = $rootScope.deviceList;

    var labels = [];
    var data = [];

    for (var i = 0; i < fillData.length; i++) {
        var dt = new Date(fillData[i].date)
        var min = "";
        var sec = "";
        if (dt.getSeconds() < 10) {
            sec = "0" + parseInt(dt.getSeconds());
        } else {
            sec = parseInt(dt.getSeconds());
        }
        if (dt.getMinutes() < 10) {
            min = "0" + parseInt(dt.getMinutes());
        } else {
            min = parseInt(dt.getMinutes());
        }
        labels.push(dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " at " + dt.getHours() + ":" + min + ":" + sec);
        //data.push(fillData[i].fill_level);
    }

    var ctx = document.getElementById("myChart");

    var chart = updateChart(data, labels);



    $scope.devicesInfo = $rootScope.deviceList;

    $scope.intervalChange = function (dev, choice) {
        console.log(data)
        var index;

        //Find if already in data
        for (index = 0; index < data.length; index++) {
            if (data[index].identifier == dev.identifier) {
                data[index].interval = $scope.intervalConversionToInt[choice];
                break;
            }
        }

        //If index is same as length then identifier was not found in data, so  push
        if (index == data.length) {
            data.push({
                "identifier": dev.identifier,
                "interval": $scope.intervalConversionToInt[choice]
            });
        }

    }

    $scope.selectDev = function (device) {
        var index = $scope.devicesChecked.indexOf(device.identifier);

        if (index > -1) {
            $scope.devicesChecked.splice(index, 1);
            var lastDevDataToShowInChart = $scope.devicesChecked[$scope.devicesChecked.length - 1];
            allInfo = setDevToChart(lastDevDataToShowInChart);
        } else {
            $scope.devicesChecked.push(device.identifier);
            allInfo = setDevToChart(device.identifier);
        }
        var chart = updateChart(allInfo[0], allInfo[1]);


    }

    function setDevToChart(deviceIdentifier) {
        var totalInfo = []
        var dataRequired = [];
        var labelsRequired = [];

        for (var i = 0; i < fillData.length; i++) {
            if (fillData[i].device_identifier == deviceIdentifier) {
                var dt = new Date(fillData[i].date)
                var min = "";
                var sec = "";
                if (dt.getSeconds() < 10) {
                    sec = "0" + parseInt(dt.getSeconds());
                } else {
                    sec = parseInt(dt.getSeconds());
                }
                if (dt.getMinutes() < 10) {
                    min = "0" + parseInt(dt.getMinutes());
                } else {
                    min = parseInt(dt.getMinutes());
                }
                labels.push(dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " at " + dt.getHours() + ":" + min + ":" + sec);
                //data.push(fillData[i].fill_level);
                dataRequired.push(fillData[i].fill_level);
                labelsRequired.push(dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " at " + dt.getHours() + ":" + min + ":" + sec);
            }
        }
        totalInfo.push(dataRequired)
        totalInfo.push(labelsRequired);
        return totalInfo;
    }


    $scope.updateGPS = function () {
        /*var newAddr = [
            {
                identifier: 'OB1000001703AA42',
                location: 'Miami Dade'
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

        }*/

        if ($scope.devicesChecked.length != 0) {

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

                })
        }
    }

    $scope.updateSenInterval = function () {
        if ($scope.devicesChecked.length > 0 && data.length > 0) {
            var dataToBeSent = [];
            var index = 0;
            for (var i = 0; i < data.length; i++) {
                index = $scope.devicesChecked.indexOf(data[i].identifier);
                if (index > -1) {
                    dataToBeSent.push({
                        "identifier": $scope.devicesInfo[i].identifier,
                        "interval": data[i].interval
                    })
                }
            }


            $http.post("http://127.0.0.1:8000/updateSensingInterval", JSON.stringify({
                    data: dataToBeSent
                }))
                .then(function (response) {
                    console.log(response.data);
                    console.log(response.status);
                    if (response.status == 200) {

                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < $scope.devicesInfo.length; j++) {
                                if ($scope.devicesInfo[j].identifier == data[i].identifier) {
                                    index = j;
                                    break;
                                }
                            }
                            $scope.devicesInfo[j].sensing_interval = data[i].interval;
                            $rootScope.deviceList[j].sensing_interval = data[i].interval;
                        }

                        data = [];
                    }

                })
        }
    }

    function updateChart(newData, newLabels) {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: newLabels,
                datasets: [{
                    label: 'Fill Level:',
                    data: newData,
                    backgroundColor: [
                'rgba(54, 162, 235, 0.2)'
            ],
                    borderWidth: 1
        }]
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Fill Level % (Percentage)'
                        },
                        ticks: {
                            beginAtZero: true,
                            max: 100
                        }
                }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Date (Month/Day)'
                        }
                }]
                }
            }
        });
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
