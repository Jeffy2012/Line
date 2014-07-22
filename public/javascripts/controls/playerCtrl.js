'use strict';
line.controller('playerCtrl',
    [
        '$scope', '$interval', 'playlist', 'radio', 'player',
        function ($scope, $interval, playlist, radio, player) {
            $scope.playlist = playlist;
            $scope.player = player;
            $scope.progress = 0;
            $scope.$on('player:END', function (event, track) {
                var fm = radio.fm,
                    hash = track.hash,
                    fmId = fm.fmid,
                    item = radio.items[fmId],
                    songs = item.songs;
                if (fm && fm.fmid) {
                    if (songs[0].hash == hash) {
                        songs.shift();
                        $scope.next();
                    }
                }
            });
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