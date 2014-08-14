'use strict';
angular
    .module('line')
    .controller('lineCtrl', function ($scope, player, radio, playlist) {
        $scope.player = player;
        $scope.radio = radio;
        $scope.playlist = playlist;

        $scope.seek = function (event) {
            var current = player.current || {},
                duration = current.duration || 0,
                width = $(event.currentTarget).width(),
                offsetX = event.offsetX;
            player.seek(Math.floor(offsetX / width * duration));
        };
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
        $scope.play(playlist.random());
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
        $scope.$on('player:END', function () {
            var mode = player.mode,
                type = player.type,
                current = player.current || {};
            if (mode === 'LOOP' && type === 'PLAYLIST') {
                player.play(current);
            } else {
                player.next();
            }
        });
    });