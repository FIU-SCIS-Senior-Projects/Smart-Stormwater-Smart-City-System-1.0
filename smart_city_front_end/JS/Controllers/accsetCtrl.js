var scApp = angular.module("scApp");

scApp.controller("accsetCtrl", function ($scope, $http, $location, $rootScope, $window) {

    currentUser = JSON.parse($window.sessionStorage.getItem("currentAccount"));
    currentUsername = currentUser.username;
    currentEmail = currentUser.email;
    currentPhone = currentUser.phone;
    currentGY = currentUser.gy_thresh;
    currentYR = currentUser.yr_thresh;

    console.log(currentUser);
    console.log(currentUsername);
    console.log(currentEmail);
    console.log(currentPhone);
    console.log(currentGY);
    console.log(currentYR);

    $scope.userID = "";
    $scope.username = currentUsername;
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.contactEmail = currentEmail;
    $scope.contactNumber = currentPhone;
    $scope.gtythresh = parseInt(currentGY);
    $scope.ytrthresh = parseInt(currentYR);


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
                yr_thresh: $scope.ytrthresh
            }))
            window.location = '/smart_city_front_end/HTML/overview.html#!/'
        }

    }

});
