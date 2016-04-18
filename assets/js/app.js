'use strict';

angular
    .module('BookTradingApp', ['ngRoute', 'toastr', 'satellizer', 'ngCookies'])
    .config(config);

config.$inject = ['$routeProvider', '$locationProvider', '$authProvider', 'toastrConfig'];

function config($routeProvider, $locationProvider, $authProvider, toastrConfig) {
    $locationProvider.html5Mode(true);

    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right'
    });

    // Now set up the views
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home'
        })
        .when('/signup', {
            templateUrl: 'partials/signup',
            controller: 'SignupController',
            controllerAs: 'vm',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .when('/login', {
            templateUrl: 'partials/login',
            controller: 'LoginController',
            controllerAs: 'vm',
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .when('/logout', {
            template: null,
            controller: 'LogoutController'
        })
        .when('/my-books', {
            templateUrl: 'partials/mybooks',
            controller: 'MyBooksController',
            controllerAs: 'vm',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .when('/all-books', {
            templateUrl: 'partials/allbooks',
            controller: 'AllBooksController',
            controllerAs: 'vm',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .when('/profile', {
            templateUrl: 'partials/profile',
            controller: 'ProfileController',
            controllerAs: 'vm',
            resolve: {
                loginRequired: loginRequired
            }
        })
        .otherwise({
            redirectTo: '/'
        });

    loginRequired.$inject = ['$q', '$location', '$auth'];

    function loginRequired($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.resolve();
        }
        else {
            $location.path('/login');
        }
        return deferred.promise;
    }

    skipIfLoggedIn.$inject = ['$q', '$auth'];

    function skipIfLoggedIn($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.reject();
        }
        else {
            deferred.resolve();
        }
        return deferred.promise;
    }
}
