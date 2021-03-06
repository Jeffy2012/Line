'use strict';
angular
    .module('line')
    .controller('playlistCtrl',
    function ($scope, playlist, player) {
        $scope.playlist = playlist;
        $scope.play = function (track) {
            if (player.type !== 'PLAYLIST') {
                player.next = function () {
                    $scope.next();
                };
                player.prev = function () {
                    $scope.prev();
                };
                player.type = 'PLAYLIST';
            }
            player.play(track);
        };
        $scope.remove = function (track) {
            if (track.hash === player.current.hash) {
                var nextTrack = playlist.next();
                if (nextTrack) {
                    player.play(nextTrack);
                }
                $scope.remove(track);
            } else {
                playlist.remove(track);
            }
        };
        $scope.isPlaying = function (track) {
            return track.hash === (player.current || {}).hash;
        };
        $scope.next = function () {
            var track, mode = player.mode;
            if (mode === 'RANDOM') {
                track = playlist.random();
            } else if (mode === 'NORMAL') {
                track = playlist.next();
            }
            $scope.play(track);
        };
        $scope.prev = function () {
            var track, mode = player.mode;
            if (mode === 'RANDOM') {
                track = playlist.random();
            } else if (mode === 'NORMAL') {
                track = playlist.prev();
            }
            $scope.play(track);
        };
    });
  