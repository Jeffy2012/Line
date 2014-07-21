'use strict';
line.controller('radioCtrl',
    [
        '$rootScope', '$scope', 'radio', 'player',
        function ($rootScope, $scope, radio, player) {
            $scope.radio = radio;
            $scope.list = function (query) {
                radio.list(query);
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
            $rootScope.$on('end', function (track) {
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
        }
    ]
);