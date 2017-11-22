var scApp = angular.module("scApp", ['ngRoute', 'ui.bootstrap']);

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
                            return $http.get("http://127.0.0.1:8000/overview", {
                                    params: {
                                        username: $rootScope.username
                                    }
                                })
                                .then(function (response) {

                                    $rootScope.deviceList = response.data;
                                return response.data;
                                })
                        }
                    }
                }
            })
            .when('/register-account', {
                templateUrl: './registeraccount.html',
                controller: 'regaccCtrl',
                resolve: {
                    allOrg: function ($http, $route, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        } else {
                            return $http.get("http://127.0.0.1:8000/register-account", {
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
            .when('/sub-users-list', {
                templateUrl: './subusers.html',
                controller: 'subusersCtrl',
                resolve: {
                    allSubUsers: function ($http, $route, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        } else {
                            return $http.get("http://127.0.0.1:8000/sub-users-list/", {
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
                    "check": function ($location, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
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
            .when('/modifysubuser', {
                templateUrl: './modifysubuser.html',
                controller: 'modifysubuserCtrl',
                resolve: {
                    "check": function ($location, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $location.path('/');
                        }
                    }
                }
            })
    }
]);

scApp.factory('DeviceList', function ($http) {
    //$http.get

    //var allDevices = 
});

angular.module('scApp').directive('hasPermission', function ($rootScope) {
    return {
        link: function (scope, element, attrs) {

            function toggleVisibilityBasedOnPermission() {
                var hasPermission = permissions.hasPermission(value);
                if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                    document.getElementById("AdminUserList").style.display = 'block';
                } else {
                    element[0].style.display = 'none';
                }
            }

            toggleVisibilityBasedOnPermission();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
        }
    };
});
