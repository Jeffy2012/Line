'use strict';
angular
    .module('line')
    .controller('lineCtrl', function ($scope, $location, player, radio, playlist) {
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
        $scope.play = function (track, type) {
            if (type) {
                $scope.status.type = type;
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
        $scope.status = {
            //type: 'PLAYLIST', // 'FM'
            mode: 'NORMAL' // 'RANDOM' 'LOOP'
        };
        $scope.next = function () {
            var status = $scope.status,
                type = status.type,
                mode = status.mode,
                track;
            if (type === 'PLAYLIST') {
                if (mode === 'RANDOM') {
                    track = playlist.random();
                } else if (mode === 'NORMAL') {
                    track = playlist.next();
                }
                $scope.play(track);
            } else if (type === 'FM') {
                radio.next().then(function (track) {
                    $scope.play(track);
                });
            }
        };
        $scope.prev = function () {
            var status = $scope.status,
                type = status.type,
                mode = status.mode,
                track;
            if (type === 'PLAYLIST') {
                if (mode === 'RANDOM') {
                    track = playlist.random();
                } else if (mode === 'NORMAL') {
                    track = playlist.prev();
                }
                $scope.play(track);
            } else if (type === 'FM') {
                radio.next().then(function (track) {
                    $scope.play(track);
                });
            }
        };
        $scope.tuneTo = function (fm) {
            radio.tuneTo(fm).then(function (track) {
                $scope.play(track, 'FM');
            });
        };
        $scope.$on('player:END', function () {
            $scope.next();
        });
        $scope.$on('player:PLAY', function () {
            $location.path('/');
            $scope.status.heart = playlist.exist(player.current);
        });
        $scope.$watch('playlist.total', function () {
            $scope.status.heart = playlist.exist(player.current);
        });
        $scope.tuneTo(_.sample(radio.fms));
    });