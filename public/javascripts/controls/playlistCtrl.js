'use strict';
line.controller('playlistCtrl', ['$scope', 'playlist', function ($scope, playlist) {
    $scope.playlist = playlist;
    $scope.play = function (track) {
        playlist.play(track);
    };
    $scope.remove = function (track) {
        playlist.remove(track);
    };
}]);