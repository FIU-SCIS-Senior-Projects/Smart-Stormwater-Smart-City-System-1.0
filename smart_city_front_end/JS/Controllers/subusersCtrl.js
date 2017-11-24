/* For help on controllers, this website might help:
    https://www.w3schools.com/angular/angular_controllers.asp    */
var scApp = angular.module('scApp');

scApp.controller("subusersCtrl", function ($http, $scope, $rootScope, $window, $location, allSubUsers) {

    $scope.subUsersList = allSubUsers;
    $scope.allDevicesList = $rootScope.deviceList;

    $scope.subUsersChecked = [];
    $scope.devicesChecked = [];
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
        var index = $scope.devicesChecked.indexOf(device.identifier);

        if (index > -1) {
            $scope.devicesChecked.splice(index, 1);
        } else {
            $scope.devicesChecked.push(device.identifier);
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

    //This is the function for the "Check All" button for device list
    $scope.selectAllDevs = function () {
        var index;

        for (var i = 0; i < $scope.allDevicesList.length; i++) {

            index = $scope.devicesChecked.indexOf($scope.allDevicesList[i].identifier);
            if (index == -1) {
                $scope.devicesChecked.push($scope.allDevicesList[i].identifier);
            }
        }
    }

    //This is the function for the "Uncheck All" button for device list
    $scope.deselectAllDevs = function () {
        var index;

        for (var i = 0; i < $scope.allDevicesList.length; i++) {
            index = $scope.devicesChecked.indexOf($scope.allDevicesList[i].identifier);

            if (index > -1) {
                $scope.devicesChecked.splice(index, 1);
            }
        }
    }

    $scope.submitAssignments = function () {
       // $scope.databaseResponse = "";
        //console.log($scope.subUsersChecked.length + " is users checked followed by devices: " + $scope.devicesChecked.length)
        if ($scope.subUsersChecked.length == 0) {
            //$scope.databaseResponse = "Please selects at least 1 sub-user.";
            alert("Please selects at least 1 sub-user.")
        } else if ($scope.devicesChecked.length == 0) {
            //$scope.databaseResponse = "Please select at least 1 device.";
            alert("Please select at least 1 device.")
        } else {
            $http.post("http://127.0.0.1:8000/sub-users-list", JSON.stringify({
                    usersChecked: $scope.subUsersChecked,
                    devicesChecked: $scope.devicesChecked
                }))
                .then(function (response) {
                    $scope.datareceived = response.data;
                    //$scope.databaseResponse = $scope.datareceived;
                    alert(response.data)
                })
        }
    }
    
    $scope.modifySub = function(user){
        $rootScope.subUsername = user.username;
        $window.sessionStorage.setItem('subUserChosen', user.username);
        //$location.url('/modifysubuser')
        //console.log("end of modify");
    }

    $scope.deleteSub = function(user) {
        var subUserToDelete;
        var parentUser;
        /*
        currentUser = JSON.parse($window.sessionStorage.getItem("currentAccount"));
        parentUser = currentUser.username
        */
        subUserToDelete = user.username;
        parentUser = $rootScope.username;
        $http.post("http://127.0.0.1:8000/deleteSubUser", JSON.stringify({
                subUser: subUserToDelete,
                currentUser: parentUser
            }))
        //$location.url('/sub-users-list')

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
