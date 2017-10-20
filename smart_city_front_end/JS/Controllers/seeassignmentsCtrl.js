/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */
var scApp = angular.module('scApp');

scApp.controller("seeassignmentsCtrl", function ($http, $scope, $rootScope, allSubUsers) {

    $scope.subUsersList = allSubUsers;

    /*[
        {
            assigned_device: 'ID0002',
            username: 'firstSubUser',
            organization: 'Not Assigned',
            permission: 'User'
        },{
            assigned_device: 'ID0002',
            username: 'secondSubUser',
            organization: 'Not Assigned',
            permission: 'User'
        }
    ];*/


    $scope.allDevicesList = $rootScope.deviceList;

    $scope.subUsersChecked = [];
    $scope.subUsersToShow = [];
    $scope.deviceChecked = "";
    $scope.databaseResponse = "";

    $scope.selectSub = function (user) {
        var index = $scope.subUsersChecked.indexOf(user.username);

        if (index > -1) {
            $scope.subUsersChecked.splice(index, 1);
        } else {
            $scope.subUsersChecked.push(user.username);
        }
    }

    $scope.selectDev = function (device) {
        $scope.deviceChecked = device.identifier;
        //console.log($scope.subUsersToShow + " is to show")
        //console.log($scope.subUsersList + " is the list")
        //console.log($scope.deviceChecked + " is the device")

        $scope.subUsersToShow.splice(0, $scope.subUsersToShow.length)

        for (var i = 0; i < $scope.subUsersList.length; i++) {
            if ($scope.subUsersList[i].assigned_device == device.identifier) {
                $scope.subUsersToShow.push($scope.subUsersList[i])
            }
        }
    }

    //This is the function for the "Check All" button for sub-users list
    $scope.selectAllSubs = function () {
        var index;

        for (var i = 0; i < $scope.subUsersList.length; i++) {
            index = $scope.subUsersChecked.indexOf($scope.subUsersList[i].username);

            if (index == -1) {
                $scope.subUsersChecked.push($scope.subUsersList[i].username);
            }
        }
    }

    //This is the function for the "Uncheck All" button for sub-users list
    $scope.deselectAllSubs = function () {
        var index;

        for (var i = 0; i < $scope.subUsersList.length; i++) {
            index = $scope.subUsersChecked.indexOf($scope.subUsersList[i].username);

            if (index > -1) {
                $scope.subUsersChecked.splice(index, 1);
            }
        }

    }

    /*This is the function for the "Check All" button for device list
    $scope.selectAllDevs = function(){
        var index;        

        for(var i = 0; i<$scope.allDevicesList.length; i++){
            
            index = $scope.devicesChecked.indexOf($scope.allDevicesList[i].identifier);
            if(index == -1){
                $scope.devicesChecked.push($scope.allDevicesList[i].identifier);
            }
        }
    }*/

    /*This is the function for the "Uncheck All" button for device list
    $scope.deselectAllDevs = function(){
        var index;        

        for(var i = 0; i<$scope.allDevicesList.length; i++){
            index = $scope.devicesChecked.indexOf($scope.allDevicesList[i].identifier);
        
            if(index > -1){
                $scope.devicesChecked.splice(index, 1);
            }
        }
    }*/

    $scope.unassign = function () {
        $scope.databaseResponse = "";
        if ($scope.deviceChecked == "") {
            $scope.databaseResponse = "Please select a device.";
        } else if ($scope.subUsersChecked.length==0) {
            $scope.databaseResponse = "Please select at least 1 sub-user.";
        } else {
            $scope.databaseResponse = "";
            $http.post("http://127.0.0.1:8000/see-device-assignments", JSON.stringify({
                    usersChecked: $scope.subUsersChecked,
                    deviceChecked: $scope.deviceChecked
                }))
                .then(function (response) {
                    $scope.datareceived = response.data;
                    $scope.databaseResponse = $scope.datareceived;
                    if ($scope.databaseResponse == "Assignments Deleted!") {
                        var index;
                        for (var i = 0; i < $scope.subUsersChecked.length; i++) {
                            for (var j = 0; j < $scope.subUsersList.length; j++) {
                                index = $scope.subUsersList.indexOf($scope.subUsersChecked[i])
                                if ($scope.subUsersList[j].username == $scope.subUsersChecked[i]) {
                                    $scope.subUsersList[j].username = "---";
                                    $scope.subUsersList[j].permission = "---";
                                    $scope.subUsersList[j].organization = "---";
                                    $scope.subUsersList.splice(j, 1);
                                    j = 0;
                                }
                            }
                        }
                        $scope.subUsersChecked = [];

                    }
                })
        }
    }



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
});
