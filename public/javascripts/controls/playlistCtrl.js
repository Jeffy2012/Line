'use strict';
line.controller('playlistCtrl',
    [
        '$scope', 'playlist', 'player',
        function ($scope, playlist, player) {
            $scope.playlist = playlist;
            $scope.play = function (track) {
                player.play(track);
            };
            $scope.remove = function (track) {
                if (track.hash == player.current.hash) {
                    $scope.next();
                }
                playlist.remove(track);
            };
            $scope.isPlaying = function (track) {
                var current = player.current;
                return current && track && current.hash && track.hash && track.hash == current.hash
            }
        }
    ]
);