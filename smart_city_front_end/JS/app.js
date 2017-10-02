var scApp = angular.module("scApp", ['ngRoute', 'ngCookies', 'ui.bootstrap']);

scApp.controller("registerCtrl", function ($scope) {
    $scope.username = "";
    $scope.password = "";
    $scope.contactEmail = "";
    $scope.contactNumber = "";
    $scope.gtythresh = 30;
    $scope.ytrthresh = 60;

    $scope.register = function () {
        $scope.hasRegistered = $scope.username + ", " + $scope.password + ", " + $scope.contactEmail + ", " + $scope.contactNumber + ", " + (+$scope.gtythresh + +$scope.ytrthresh);
    }

});

scApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/', {
                templateUrl: './signin.html',
                controller: 'signinCtrl',
                css: 'signin.css'
            })
            .when('/overview', {
                templateUrl: './overview.html',
                controller: 'overviewCtrl',
                css: 'overview.css'
            })
            .when('/register-account', {
                templateUrl: './registeraccount.html',
                controller: 'regaccCtrl'
            })
            .when('/register-device', {
                templateUrl: './registerdevice.html',
                controller: 'regdevCtrl'
            })
            .when('/account-settings', {
                templateUrl: './accountsettings.html',
                controller: 'accsetCtrl'
            })
            .when('/notification-settings',{
            templateUrl: './notificationsettings.html',
            controller: 'notifsetCtrl',
            resolve: {
                allNotifications: function($http, $route){
                    return $http.get("http://127.0.0.1:8000/notification-settings", {params: {
                        username: "testuser"
                    }})
                    .then(function(response){
                        return response.data;
                    })
                }
            }
            
        })
    }
]);

scApp.run(['$rootScope', '$location', '$cookies', '$http', function ($rootScope, $location, $cookies, $http) {

    $rootScope.globals = {};
    $cookies.remove('globals');

    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/']) === -1;
        console.log(restrictedPage)
        var loggedIn = $rootScope.globals.currentUser;
        console.log(loggedIn)
        if (restrictedPage && !loggedIn) {
            console.log("Brudder")
            $location.path('/');
        }
    });
}]);
