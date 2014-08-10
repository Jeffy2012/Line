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
            player.play(track);
        };
        $scope.next = function () {
             radio.next().then(function (track) {
                 $scope.play(track);
             });
        };
        $scope.$watch('radio.info.page', function (page) {
            radio.list({pageindex: page});
        })
    });