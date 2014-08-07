'use strict';
angular
    .module('line')
    .controller('krcCtrl', function ($scope, player) {
        $scope.player = player;
    });