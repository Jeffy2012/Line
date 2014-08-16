'use strict';
angular
    .module('line')
    .controller('krcCtrl', function ($scope, player) {
        $scope.player = player;
        $scope.$watch('player.krc.active', function (index) {
            var conHeight = $('#krc-con').height();
            var itemHeight = $('.krc p').eq(0).outerHeight();
            $('.krc').css({
                top: (-itemHeight * (index + 1) + conHeight / 2 - itemHeight / 2) + 'px'
            });
        });
    });