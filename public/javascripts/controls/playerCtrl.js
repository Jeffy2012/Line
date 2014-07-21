'use strict';
line.controller('playerCtrl', ['$scope', '$rootScope' , 'playlist', 'player', function ($scope, $rootScope, playlist, player) {
    $scope.playlist = playlist;
    $scope.player = player;
    $rootScope.$on('player:END', function () {
        $scope.next();
    });
    $scope.play = function () {
        if (player.current) {
            player.play()
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
}]);