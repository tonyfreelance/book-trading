'use strict';

angular
    .module('BookTradingApp')
    .controller('ProfileController', ProfileController);

ProfileController.$inject = ['logger', 'profileService', '$cookies', '$location'];

function ProfileController(logger, profileService, $cookies, $location) {
    var vm = this;
    var userId = $cookies.get('userId');
    vm.city = '';
    vm.currentPassword = '';
    vm.newPassword = '';
    vm.updatePassword = updatePassword;
    vm.updateProfile = updateProfile;
    vm.state = '';

    activate();

    function activate() {
        return showCurrentInfo();
    }

    function showCurrentInfo() {
        return profileService.getCurrentInfo(userId)
            .then(function(result) {
                vm.name = result.data.name;
                vm.city = result.data.city;
                vm.state = result.data.state;
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function updatePassword() {
        return profileService.updatePassword(userId, vm.currentPassword, vm.newPassword)
            .then(function(result) {
                logger.success('You\'ve successfully changed your password!');
                $location.path('/');
            })
            .catch(function(err) {
                if (err.data.message) {
                    logger.error(err.data.message);
                }
                else {
                    logger.error(err);
                }
            });
    }

    function updateProfile() {
        return profileService.updateProfile(userId, vm.name, vm.city, vm.state)
            .then(function(result) {
                logger.success('You\'ve successfully updated your profile!');
                $location.path('/');
            })
            .catch(function(err) {
                logger.error(err);
            });
    }
}
