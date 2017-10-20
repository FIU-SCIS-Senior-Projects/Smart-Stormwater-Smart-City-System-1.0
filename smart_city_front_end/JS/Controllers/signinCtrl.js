var scApp = angular.module('scApp');

scApp.controller("signinCtrl", function ($scope, $http, $location, $rootScope, $window) {
    $scope.username = "";
    $scope.password = "";
    $scope.decision = "";

    $scope.toBeSent = {
        username: $scope.username,
        password: $scope.password
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
                    $scope.decision = "Username not found!";
                } else if ($scope.datareceived.username == "incorrect_password") {
                    $scope.decision = "Incorrect Password!";
                } else {
                    
                    $rootScope.loggedIn = true;
                    $rootScope.username = $scope.username;
<<<<<<< HEAD

                    $window.sessionStorage.setItem("currentAccount", JSON.stringify($scope.datareceived));
                    //Authentication.SetCredentials($scope.username, $scope.password);
                    window.location = '/smart_city_front_end/HTML/accountsettings.html#!/'
                    //$location.url("/overview");
=======
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
>>>>>>> 484491ebab06987969b4ec864b3d4a4585e3bc87
                    //window.location = '/HTML/index.html#!/overview'
                    //$scope.$apply();

                }
            })


    };

});
