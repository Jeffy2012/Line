'use strict';
line.controller('progressCtrl', ['$scope', '$interval', 'playlist', function ($scope, $interval, playlist) {
    $scope.progress = 0;
    $interval(function () {
        var current = playlist.current,
            howls = playlist.howls;
        if (current) {
            var howl = howls[current.hash];
            if (howl) {
                $scope.progress = Math.ceil(howl.pos() * 100 / current.duration);
            }
        }
    }, 16);
}]);