'use strict';
angular
    .module('line')
    .controller('resultsCtrl', function ($scope, explorer, playlist) {
        $scope.explorer = explorer;
        $scope.playlist = playlist;
        $scope.add = function (track) {
            playlist.add(track);
        };
    });