/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */
var scApp = angular.module('scApp');

scApp.controller("overviewCtrl", function ($scope, $rootScope, $http) {
    $scope.dev1 = 1;
    $scope.dev2 = 3;
    $scope.username = "VIPUser";
    $scope.Changed = "";
    $scope.devicesChecked = [];

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

    $scope.selectedOp = "";


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
        } else {
            $scope.devicesChecked.push(device.identifier);
        }
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
                            for(var j = 0; j < $scope.devicesInfo.length; j++){
                                if($scope.devicesInfo[j].identifier == data[i].identifier){
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

    $scope.changeUsername = function () {
        $scope.username = $scope.Changed;
    }
});
