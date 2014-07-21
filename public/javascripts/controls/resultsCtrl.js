'use strict';
line.controller('resultsCtrl', ['$scope', 'explorer', 'player', 'playlist', function ($scope, explorer, player, playlist) {
    $scope.explorer = explorer;
    $scope.add = function (track) {
        playlist.add(track);
        var current = player.current;
        if (current && !current.hash) {
            player.play(track);
        }
    }
}]);