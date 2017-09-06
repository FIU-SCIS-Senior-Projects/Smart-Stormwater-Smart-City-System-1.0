var scApp = angular.module("scApp", []);

scApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
        when('/', {
            templateUrl: 'http://www.smartcityproject.com',
            controller: 'mainCtrl'
        })
    }
]);