'use strict';
angular
    .module('line')
    .controller('tracksCtrl', function ($scope, tracks, playlist, player) {
        $scope.tracks = tracks;
        $scope.maxsize = 10;
        $scope.add = function (track) {
            playlist.add(track);
        };
        $scope.$watch('tracks.info.page', function (page) {
            tracks.fetch(page);
        });
    });