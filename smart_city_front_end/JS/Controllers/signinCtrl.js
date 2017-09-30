var scApp = angular.module('scApp');

scApp.controller("signinCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.username = "";
    $scope.password = "";
    $scope.decision = "";

    $scope.toBeSent = {
        username: $scope.username,
        password: $scope.password
    }


    $scope.signInUser = function () {
        $scope.hasSignedIn = $scope.username + ", " + $scope.password;
    }

    $scope.submitLogIn = function () {
        $http.post("http://127.0.0.1:8000/", JSON.stringify({
                username: $scope.username,
                password: $scope.password
            }))
            .then(function (response) {
                $scope.datareceived = response.data;
                //document.getElementById("demo").innerHTML = $scope.datareceived.username;

                if ($scope.datareceived.username == "nonexistant") {
                    //$location.path('/overview');
                    $scope.decision = "doesn't exist";
                } else if($scope.datareceived.username == "incorrect_password"){
                    $scope.decision = "wrong password";
                } else {
                    $scope.decision = $location.path();
                    $location.url("/overview");
                    //window.location = '/HTML/index.html#!/overview'
                    $scope.$apply();
                }
            })


    };

});
