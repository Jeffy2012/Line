'use strict';
angular
    .module('line')
    .controller('tracksCtrl', function ($scope, tracks) {
        $scope.tracks = tracks;
        $scope.add = function (track) {
            tracks.addToPlaylist(track);
        };
        $scope.$watch('tracks.info.page', function (page) {
            tracks.fetch(page);
        });
    });