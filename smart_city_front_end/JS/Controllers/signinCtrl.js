var scApp = angular.module('scApp');

scApp.controller("signinCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.username = "testuser";
    $scope.password = "testpassword";
    $scope.decision = "";

    $scope.toBeSent = {
        username: $scope.username,
        password: $scope.password
    }


    /*(function initController() {
        // reset login status
        Authentication.ClearCredentials();
        console.log("Clear")
    })();*/

    $scope.submitLogIn = function () {
        $http.post("http://127.0.0.1:8000/", JSON.stringify({
                username: $scope.username,
                password: $scope.password
            }))
            .then(function (response) {
                $scope.datareceived = response.data;
                //document.getElementById("demo").innerHTML = $scope.datareceived.username;

                if ($scope.datareceived.username == "nonexistant") {
                    $scope.decision = "Username not found!";
                } else if ($scope.datareceived.username == "incorrect_password") {
                    $scope.decision = "Incorrect Password!";
                } else {
                    
                    $rootScope.loggedIn = true;
                    $rootScope.username = $scope.username;
                    $rootScope.deviceList = $scope.datareceived.deviceList;

                    /*$http.get("http://127.0.0.1:8000/overview", {
                            params: {
                                username: $scope.username
                            }
                        })
                        .then(function (response) {
                            $rootScope.deviceList = response.data;
                        })*/

                    $location.url("/overview");
                    //window.location = '/HTML/index.html#!/overview'
                    //$scope.$apply();

                }
            })


    };

});
