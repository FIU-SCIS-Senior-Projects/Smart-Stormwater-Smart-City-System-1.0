var scApp = angular.module('scApp');

scApp.controller("regaccCtrl", function ($scope, $http, $location, $window, allOrg) {
    currentUser = JSON.parse($window.sessionStorage.getItem("currentAccount"));
    //parentUser = currentUser.username;
    parentUser = "admin"; //for testing

    console.log(allOrg);
    $scope.organizationList = allOrg;
    console.log($scope.organizationList);

    $scope.userID = "";
    $scope.username = "";
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.contactEmail = "";
    $scope.contactNumber = "";
    $scope.gtythresh = 30;
    $scope.ytrthresh = 60;
    $scope.organization = "";
    $scope.permission = "";

    //$scope.organizationList = ["FL", "Miami", "Hollywood"];

    $scope.submitRegister = function () {
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
            $http.post("http://127.0.0.1:8000/register", JSON.stringify({
                userID: $scope.userID,
                username: $scope.username,
                password: $scope.password,
                email: $scope.contactEmail,
                number: $scope.contactNumber,
                gy_thresh: $scope.gtythresh,
                yr_thresh: $scope.ytrthresh,
                organization: $scope.organization,
                permission: $scope.permission,
                parent_user: "admin"
            }))
            .then (function (response){
                $scope.checkData = response.data;
                if ($scope.checkData.username == 'username already taken'){
                    alert("Username unavailable")
                }
                else if ($scope.checkData.username == 'Need to set account type'){
                    alert("Account type needs to be set")
                }
                else
                    window.location = '/smart_city_front_end/HTML/signin.html#!/'
                    //$location.url('/');
            } )
        }

    }
});