'use strict';

angular
    .module('BookTradingApp')
    .controller('LoginController', LoginController);

LoginController.$inject = ['logger', '$location', '$auth', '$cookies'];

function LoginController(logger, $location, $auth, $cookies) {
    var vm = this;
    vm.login = login;
    vm.user = {};

    function login() {
        $auth.login(vm.user)
            .then(function(response) {
                $cookies.put('userId', response.data.userId);
                logger.success('You have successfully signed in!');
                $location.path('/');
            })
            .catch(function(error) {
                logger.error(error.data.message, error.status);
            });
    }
}