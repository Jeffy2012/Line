'use strict';
line.controller('progressCtrl', ['$scope', '$interval', 'player', function ($scope, $interval, player) {
    $scope.progress = 0;
    $interval(function () {
        var current = player.current,
            howls = player.howls;
        if (current) {
            var howl = howls[current.hash];
            if (howl) {
                $scope.progress = Math.ceil(howl.pos() * 100 / current.duration);
            }
        }
    }, 16);
}]);