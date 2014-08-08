'use strict';
angular
    .module('line')
    .controller('playerCtrl',
    function ($scope, player) {
        $scope.player = player;
        $scope.seek = function (event) {
            var current = player.current || {},
                duration = current.duration || 0,
                width = $(event.currentTarget).width(),
                offsetX = event.offsetX;
            player.seek(Math.floor(offsetX / width * duration));
        };
        $scope.$on('player:END', function () {
            player.next();
        });
    });