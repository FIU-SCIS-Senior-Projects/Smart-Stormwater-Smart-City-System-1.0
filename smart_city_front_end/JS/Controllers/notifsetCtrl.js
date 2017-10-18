var scApp = angular.module("scApp");

scApp.controller("notifsetCtrl", function ($scope, $http, allNotificationSettings) {
    
    $scope.checkboxes = allNotificationSettings;
        /*{
        gty_web: true,
        gty_email: false,
        ytr_web: true,
        ytr_email: true,
        clean_basin_web: true,
        clean_basin_email: false,
        gps_update_web: false,
        gps_update_email: false
    };*/
    
    $scope.allNotifs = [
        {
            "identifier": "ID001", 
            "notifType": "Basin Cleaned", 
            "location": "FIU", 
            "date": "Oct 2, 2017 12:00"
        },{
            "identifier" : "ID001", 
            "notifType": "Low Battery", 
            "location": "FIU", 
            "date": "Oct 1, 2017 12:00"
        }
    ]
    
    $scope.exist = "I exist"
    
    //At the time of this upload, this function hasn't been completely developed
    //"username" must be used from a service to then send instead of having it be hardcoded
    $scope.saveNotif = function ($location) {
        $http.post("http://127.0.0.1:8000/notification-settings", JSON.stringify({
            username: "123",
            gty_web: $scope.checkboxes.gty_web,
            gty_email: $scope.checkboxes.gty_email,
            ytr_web: $scope.checkboxes.ytr_web,
            ytr_email: $scope.checkboxes.ytr_email,
            clean_basin_web: $scope.checkboxes.clean_basin_web,
            clean_basin_email: $scope.checkboxes.clean_basin_email,
            gps_update_web: $scope.checkboxes.gps_update_web,
            gps_update_email: $scope.checkboxes.gps_update_email,
            }))
            .then(function (response) {
                $scope.statustext = response.data;
                
            })


    };

});