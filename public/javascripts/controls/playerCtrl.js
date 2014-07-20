'use strict';
line.controller('playerCtrl', ['$scope', '$rootScope' , 'playlist', function ($scope, $rootScope, playlist) {
    $rootScope.$on('playend', function () {
        playlist.next();
    });
    $scope.playlist = playlist;
    $scope.play = function () {
        var current = playlist.current;
        if (playlist.current) {
            playlist.play(current);
        } else {
            var first = playlist.tracks[0];
            if (first) {
                playlist.play(first);
            }
        }
    };
}]);