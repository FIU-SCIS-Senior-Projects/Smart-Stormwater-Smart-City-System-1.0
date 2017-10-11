var scApp = angular.module("scApp");

scApp.controller("accsetCtrl", function ($scope) {
    $scope.username = "newComp";
    $scope.password = "newCompPW";
    $scope.confirmpw = ""
    $scope.contactEmail = "ceoguy@newcomp.com";
    $scope.contactNumber = "7861234567";
    $scope.gtythresh = 35;
    $scope.ytrthresh = 75;
    $scope.ccn = false;
    $scope.email = false;
    $scope.sms = false;
    $scope.hasRegistered = $scope.username + ", " + $scope.password + ", " + $scope.contactEmail + ", " + $scope.contactNumber + ", " + (+$scope.gtythresh + +$scope.ytrthresh) + ", " + $scope.ccn + ", " + $scope.email + ", " + $scope.sms;

    $scope.updateInfo = function () {
        $scope.hasRegistered = $scope.username + ", " + $scope.password + ", " + $scope.contactEmail + ", " + $scope.contactNumber + ", " + (+$scope.gtythresh + +$scope.ytrthresh) + ", " + $scope.ccn + ", " + $scope.email + ", " + $scope.sms;
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
                    $scope.decision = "doesn't exist"
                } else if($scope.datareceived.username == "incorrect_password"){
                    $scope.decision = "wrong password"
                } else {
                    $scope.decision = "passed!"
                    $location.path('/overview')
                    $scope.$apply()
                }
            })


    };

});
