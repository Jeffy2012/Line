'use strict';
angular
    .module('line')
    .controller('playerCtrl',
    function ($scope, player, visualization) {
        $scope.seek = function (event) {
            var current = player.current || {},
                duration = current.duration || 0,
                width = $(event.currentTarget).width(),
                offsetX = event.offsetX;
            player.seek(Math.floor(offsetX / width * duration));
        };
        $scope.$on('player:END', function () {
            var mode = player.mode,
                type = player.type,
                current = player.current || {};
            if (mode === 'LOOP' && type === 'PLAYLIST') {
                player.play(current);
            } else {
                player.next();
            }
        });
        var canvas = $('.player canvas')[0],
            $visual = $('.player .visual');

        function dealCanvas() {
            canvas.height = $visual.height();
            canvas.width = $visual.width();
            visualization.link(canvas);
        }

        $(window).resize(dealCanvas);
        dealCanvas();
        $scope.$on('player:PLAY', function (event, howl) {
            visualization.attachTo(howl);
        });
    });