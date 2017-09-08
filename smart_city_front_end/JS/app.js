var scApp = angular.module("scApp", []);

scApp.controller("mainCtrl", function($scope){
    $scope.dev1 = 1;
    $scope.dev2 = 3;
    
    $scope.calculate = function(){
        $scope.calculation = $scope.dev1 + " + " + $scope.dev2 + " = " + (+$scope.dev1 + +$scope.dev2);
    }
});

scApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
        when('/', {
            templateUrl: '../HTML/index.html',
            controller: 'mainCtrl'
        })
    }
]);