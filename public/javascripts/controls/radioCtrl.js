'use strict';
angular.module('line').controller('radioCtrl',
    function ($scope, radio, player) {
        $scope.tuneTo = function (fm) {
            var track = radio.tuneTo(fm);
            $scope.play(track);
        };
        $scope.play = function (track) {
            if (player.type !== 'FM') {
                player.next = function () {
                    $scope.next();
                };
                player.prev = angular.noop;
                player.type = 'FM';
            }
            player.play(track);
        };
        $scope.next = function () {
            var track = radio.next();
            $scope.play(track);
        };
        $scope.$watch('radio.info.page', function (page) {
            radio.list({pageindex: page});
        })
    });