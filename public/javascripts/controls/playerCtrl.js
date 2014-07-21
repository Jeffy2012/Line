'use strict';
line.controller('playerCtrl', ['$scope', '$rootScope' , 'playlist', function ($scope, $rootScope, playlist) {
    $rootScope.$on('player:END', function () {
        playlist.next();
    });
    $scope.playlist = playlist;
}]);