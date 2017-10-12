var scApp = angular.module("scApp");

scApp.controller("accsetCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.userID = "";
    $scope.username = "123";
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.contactEmail = "";
    $scope.contactNumber = "";
    $scope.gtythresh = 30;
    $scope.ytrthresh = 60;


    $scope.changeInfo = function () {
        if ($scope.password != $scope.confirmPassword) {
            alert("Passwords do not match.")
        }
        else if ($scope.gtythresh <= -1 | $scope.gtythresh >= 101) {
            alert("Green to Yellow threshold must be between 0-100.")
        }
        else if ($scope.ytrthresh <= -1 | $scope.ytrthresh >= 101) {
            alert("Yellow to Red threshold must be between 0-100.")
        }
        else if ($scope.gtythresh >= $scope.ytrthresh) {
            alert("Green to Yellow threshold must be lower than Yellow to Red Threshold.")
        }
        else {
            $http.post("http://127.0.0.1:8000/account-settings", JSON.stringify({
                userID: $scope.userID,
                username: $scope.username,
                password: $scope.password,
                email: $scope.contactEmail,
                number: $scope.contactNumber,
                gy_thresh: $scope.gtythresh,
                yr_thresh: $scope.ytrthresh,
                parent_user: $rootScope.username
            }))
            window.location = '/smart_city_front_end/HTML/overview.html#!/'
        }

    }

});
