'use strict';
line.controller('radioCtrl',
    [
        '$scope', 'radio', 'player',
        function ($scope, radio, player) {
            $scope.radio = radio;
            $scope.list = function (query) {
                radio.turnOn(query);
            };
            $scope.listen = function (fm) {
                radio.fm = fm;
                var current = player.current,
                    hash, exist,
                    fmId = fm.fmid,
                    index = -1,
                    item = radio.items[fmId],
                    songs = item.songs,
                    length = songs.length;
                if (current) {
                    hash = current.hash;
                    if (hash) {
                        exist = songs.some(function (track, i) {
                            index = i;
                            return track.hash === hash;
                        });
                        if (exist) {
                            if (length - 1 === index) {
                                $scope.fetch(fm);
                            } else {
                                player.play(songs[index + 1]);
                            }
                        } else {
                            $scope.fetch(fm);
                        }
                    } else {
                        player.play(songs[0]);
                    }
                } else {
                    player.play(songs[0]);
                }
            };
            $scope.fetch = function (fm) {
                radio.
                    tuneTo(fm)
                    .success(function (body, status, headers, config) {
                        player.play(body.data[0].songs[0]);
                    });
            };
            $scope.next = function () {
                $scope.listen(radio.fm);
            };
        }
    ]
);