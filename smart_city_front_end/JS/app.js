var scApp = angular.module("scApp", ['ngRoute', 'ui.bootstrap']);

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
                css: 'overview.css',
                resolve: {
                    allOverview: function ($location, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        } else if (!$rootScope.deviceList) { //If user is logged in and the device list is not known, get it and put in $rootScope
                            //console.log($rootScope.username);
                            $http.get("http://127.0.0.1:8000/overview", {
                                    params: {
                                        username: $rootScope.username
                                    }
                                })
                                .then(function (response) {

                                    $rootScope.deviceList = response.data;
                                })
                            console.log("Got em");
                        }
                    }
                }
            })
            .when('/register-account', {
                templateUrl: './registeraccount.html',
                controller: 'regaccCtrl',
                resolve: {
                    "check": function ($location, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        }
                    }
                }
            })
            .when('/sub-users-list', {
                templateUrl: './subusers.html',
                controller: 'subusersCtrl',
                resolve: {
                    allSubUsers: function ($http, $route, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        } else {
                            return $http.get("http://127.0.0.1:8000/sub-users-list", {
                                    params: {
                                        username: $rootScope.username
                                    }
                                })
                                .then(function (response) {
                                    return response.data;
                                })
                        }
                    }
                }
            })
            .when('/register-device', {
                templateUrl: './registerdevice.html',
                controller: 'regdevCtrl'
            })
            .when('/account-settings', {
                templateUrl: './accountsettings.html',
                controller: 'accsetCtrl',
                resolve: {
                    userInfoAccountSettings: function ($http, $route, $rootScope) {
                        if (!rootScope.loggedIn) {
                            $location.path('/');
                        }
                        else {
                            return $http.get =("http://127.0.0.1:8000/account-settings", {
                                params: {
                                    username: $rootScope.username
                                }
                            })
                                .then(function (response) {
                                    return response.data;
                                })
                        }
                    }
                }
            })
            .when('/see-device-assignments', {
                templateUrl: './seeassignmentspage.html',
                controller: 'seeassignmentsCtrl',
                resolve: {
                    allSubUsers: function ($http, $route, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        } else {
                            return $http.get("http://127.0.0.1:8000/see-device-assignments", {
                                    params: {
                                        username: $rootScope.username
                                    }
                                })
                                .then(function (response) {
                                    return response.data;
                                })
                        }
                    }
                }
            })
            .when('/notification-settings', {
                templateUrl: './notificationsettings.html',
                controller: 'notifsetCtrl',
                resolve: {
                    allNotificationSettings: function ($http, $route, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        } else {
                            return $http.get("http://127.0.0.1:8000/notification-settings", {
                                    params: {
                                        username: $rootScope.username
                                    }
                                })
                                .then(function (response) {
                                    return response.data;
                                })
                        }
                    }
                }

            })
            .when('/notifications', {
                templateUrl: './notificationspage.html',
                controller: 'notifpageCtrl',
                resolve: {
                    allNotifications: function ($http, $location, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        } else {
                            return $http.get("http://127.0.0.1:8000/notifications", {
                                    params: {
                                        username: $rootScope.username
                                    }
                                })
                                .then(function (response) {
                                    return response.data;
                                })

                        }
                    }
                }
                /*,
                                resolve: {
                                    allNotifications: function ($http, $route) {
                                        return $http.get("http://127.0.0.1:8000/notifications", {
                                                params: {
                                                    username: "testuser"
                                                }
                                            })
                                            .then(function (response) {
                                                return response.data;
                                            })
                                    }
                                }*/
            })
    }
]);

scApp.factory('DeviceList', function ($http) {
    //$http.get

    //var allDevices = 
});

/*scApp.run(['$rootScope', '$location', '$cookies', '$http', function ($rootScope, $location, $cookies, $http) {

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
            $location.path('/');
        }
    });
}]);*/
