'use strict';
line.controller('explorerCtrl',
    [
        '$scope', 'explorer', 'playlist', 'player',
        function ($scope, explorer, playlist, player) {
            $scope.explorer = explorer;
            $scope.search = function (e) {
                var keyword = $scope.keyword;
                if (keyword && (e.type == 'click' || e.which == 13)) {
                    explorer.search({keyword: $scope.keyword});
                }
            };
            $scope.add = function (track) {
                playlist.add(track);
                var current = player.current;
                if (current && !current.hash) {
                    player.play(track);
                }
            }
        }
    ]
);
