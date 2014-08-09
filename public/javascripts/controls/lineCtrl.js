'use strict';
angular
    .module('line')
    .controller('lineCtrl', function ($scope, player, radio, playlist) {
        $scope.player = player;
        $scope.radio = radio;
        $scope.playlist = playlist;
    });