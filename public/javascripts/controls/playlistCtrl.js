'use strict';
angular
    .module('line')
    .controller('playlistCtrl',
    function ($scope, playlist, player) {
        $scope.playlist = playlist;
        $scope.play = function (track) {
            player.play(track);
        };
        $scope.remove = function (track) {
            if (track.hash === player.current.hash) {
                var nextTrack = playlist.next();
                if (nextTrack) {
                    player.play(nextTrack);
                }
                $scope.remove(track);
            }else{
                playlist.remove(track);
            }
        };
        $scope.isPlaying = function (track) {
            var current = player.current;
            return current && track && current.hash && track.hash && track.hash === current.hash;
        };
    });
  