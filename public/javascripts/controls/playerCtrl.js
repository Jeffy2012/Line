'use strict';
angular
    .module('line')
    .controller('playerCtrl',
    function ($scope, $interval, playlist, player) {
        $scope.playlist = playlist;
        $scope.player = player;
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
        $scope.pos = function (event) {
            var current = player.current || {},
                duration = current.duration || 0,
                width = $(event.currentTarget).width(),
                offsetX = event.offsetX;
            player.pos(Math.floor(offsetX / width * duration));
        };
        $scope.stop = function () {
            player.stop();
        };
        $scope.pause = function () {
            player.pause();
        };
        $scope.$on('player:END', function () {
            $scope.next();
        });
    });