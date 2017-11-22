var scApp = angular.module('scApp');

scApp.controller("navbarCtrl", function ($scope, $rootScope, $location) {
    /*console.log("Role: " + $rootScope.permission);
    if ($rootScope.permission == "User") {

        console.log("Inside User")
        document.getElementById("AdminUserList").style.display = 'none';


    }*/

    $scope.logOff = function () {
        $rootScope.loggedIn = false;
        $location.url("/");
    }
});
