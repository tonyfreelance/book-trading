'use strict';

angular
    .module('BookTradingApp')
    .controller('NavbarController', NavbarController);

NavbarController.$inject = ['logger', '$auth', '$location'];

function NavbarController(logger, $auth, $location) {
    var vm = this;
    vm.isActive = isActive;
    vm.isAuthenticated = isAuthenticated;
    
    
    
    function isActive(viewLocation) {
        return viewLocation === $location.path();
    }
    
    function isAuthenticated() {
        return $auth.isAuthenticated();
    }
}
