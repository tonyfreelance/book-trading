'use strict';

angular
    .module('BookTradingApp')
    .controller('SignupController', SignupController);

SignupController.$inject = ['logger', '$location', '$auth', '$cookies'];

function SignupController(logger, $location, $auth, $cookies) {
    var vm = this;
    vm.signup = signup;
    vm.user = {};

    function signup() {
        $auth.signup(vm.user)
            .then(function(response) {
                $auth.setToken(response);
                $cookies.put('userId', response.data.userId);
                $location.path('/');
                logger.success('You have successfully created a new account and have been signed-in');
            })
            .catch(function(response) {
                logger.error(response.data.message);
            });
    }
}