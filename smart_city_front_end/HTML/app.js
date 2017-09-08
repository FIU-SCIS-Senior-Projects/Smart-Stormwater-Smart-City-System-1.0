var scApp = angular.module("scApp", []);

scApp.controller("mainCtrl", function ($scope){
    $scope.username = "uname";
    $scope.password = "pw";
    $scope.description = "This is the description";
    
    $scope.editText = function($scopes){
        $scope.description = $scopes.description;
        return $scope.description;
    };
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