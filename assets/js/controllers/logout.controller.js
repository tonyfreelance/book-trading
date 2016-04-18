'use strict';

angular
    .module('BookTradingApp')
    .controller('LogoutController', LogoutController);

LogoutController.$inject = ['logger', '$location', '$auth'];

function LogoutController(logger, $location, $auth) {
    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
        .then(function() {
            logger.success('You have been logged out');
            $location.path('/');
        })
        .catch(function(err) {
            logger.error(err);
        });
}