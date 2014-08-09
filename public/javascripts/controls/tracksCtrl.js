'use strict';
angular
    .module('line')
    .controller('tracksCtrl', function ($scope, tracks) {
        $scope.tracks = tracks;
        $scope.add = function (track) {
            tracks.addToPlaylist(track);
        };
        $scope.$watch('tracks.info.page', function (newVal, oldVal) {
            if (oldVal && newVal && newVal !== oldVal) {
                tracks.fetch(newVal);
            }
        });
    });