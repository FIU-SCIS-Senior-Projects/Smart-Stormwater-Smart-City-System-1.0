var scApp = angular.module('scApp');

scApp.controller("signinCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.username = "";
    $scope.password = "";
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
//<<<<<<< HEAD
                    $scope.decision = "Username not found!";
                } else if($scope.datareceived.username == "incorrect_password"){
                    $scope.decision = "Incorrect Password!";
                } else {
                    $rootScope.loggedIn = true;
                    $rootScope.username = $scope.username;
                    //Authentication.SetCredentials($scope.username, $scope.password);
                    window.location = '/smart_city_front_end/HTML/accountsettings.html#!/'
                    //$location.url("/overview");
                    //window.location = '/HTML/index.html#!/overview'
                    //$scope.$apply();
/*=======
                    $scope.decision = "doesn't exist"
                } else if ($scope.datareceived.username == "incorrect_password") {
                    $scope.decision = "wrong password"
                } else {
                    $scope.decision = "passed!"
                    Authentication.SetCredentials($scope.username, $scope.password);
                    window.location = '/HTML/index.html#!/overview'
                    //$scope.$apply()
>>>>>>> logInRestriction*/
                }
            })


    };

});
