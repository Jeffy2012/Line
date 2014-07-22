'use strict';
line.controller('playerCtrl',
    [
        '$scope', '$interval', 'playlist', 'player',
        function ($scope, $interval, playlist, player) {
            $scope.playlist = playlist;
            $scope.player = player;
            $scope.progress = 0;
            $scope.play = function () {
                var current = player.current || {};
                if (current.hash) {
                    player.play(current);
                } else {
                    $scope.next();
                }
            };
            $scope.next = function () {
                var track = playlist.next();
                if (track) {
                    player.play(track);
                }
            };
            $scope.prev = function () {
                var track = playlist.prev();
                if (track) {
                    player.play(track);
                }
            };
            $scope.stop = function () {
                player.stop();
            };
            $scope.pause = function () {
                player.pause();
            };
            $interval(function () {
                var current = player.current || {};
                $scope.progress = Math.ceil(player.pos() * 100 / (current.duration || current.time / 1000));
            }, 16);
        }
    ]
);