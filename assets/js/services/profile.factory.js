'use strict';

angular
    .module('BookTradingApp')
    .factory('profileService', profileService);

profileService.$inject = ['$http'];

function profileService($http) {
    var service = {
        getCurrentInfo: getCurrentInfo,
        updatePassword: updatePassword,
        updateProfile: updateProfile,
    };

    return service;
    ////////////////////////////////////

    function getCurrentInfo(userId) {
        return $http.get('/getProfile', {
            params: {
                userId: userId
            }
        });
    }

    function updatePassword(userId, currentPassword, newPassword) {
        var data = {
            userId: userId,
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        return $http.post('/updatePassword', data);
    }

    function updateProfile(userId, name, city, state) {
        var data = {
            userId: userId,
            name: name,
            city: city,
            state: state
        };

        return $http.post('/updateProfile', data);
    }
}