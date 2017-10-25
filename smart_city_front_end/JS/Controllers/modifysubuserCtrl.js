var scApp = angular.module("scApp");

scApp.controller("modifysubuserCtrl", function ($scope, $http, $location, $rootScope, $window) {

    $scope.userID = "";
    $scope.username = "123"; //for testing
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.contactEmail = "";
    $scope.contactNumber = "";
    $scope.gtythresh = 30;
    $scope.ytrthresh = 60;
    $scope.organization = "";
    $scope.permission = "";

    $scope.changeSubUser = function () {
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
            $http.post("http://127.0.0.1:8000/modifysubuser", JSON.stringify({
                userID: $scope.userID,
                username: $scope.username,
                password: $scope.password,
                email: $scope.contactEmail,
                number: $scope.contactNumber,
                gy_thresh: $scope.gtythresh,
                yr_thresh: $scope.ytrthresh,
                organization: $scope.organization,
                permission: $scope.permission
            }))
            .then (function (response){
                $scope.checkData = response.data;
                if ($scope.checkData.username == '1'){
                    alert("Can not change this account to a \"User\" because a subuser of this account is an \"Admin\"")
                }
                else
                    window.location = '/smart_city_front_end/HTML/signin.html#!/'
                    //$location.url('/');
            } )
        }

    }
}
)