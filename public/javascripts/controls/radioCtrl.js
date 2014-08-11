'use strict';
angular.module('line').controller('radioCtrl',
    function ($scope, radio, player) {
        $scope.tuneTo = function (fm) {
            radio.tuneTo(fm).then(function (track) {
                $scope.play(track);
            });
        };
        $scope.play = function (track) {
            if (player.type !== 'FM') {
                player.next = function () {
                    $scope.next();
                };
                player.prev = angular.noop;
                player.type = 'FM';
            }
            if (track) {
                player.play(track);
            }
        };
        $scope.next = function () {
            radio.next().then(function (track) {
                $scope.play(track);
            });
        };
        $scope.$watch('radio.page', function (newVal, oldVal) {
            if (oldVal && newVal && newVal !== oldVal) {
                radio.list({pageindex: newVal});
            }
        });
    });