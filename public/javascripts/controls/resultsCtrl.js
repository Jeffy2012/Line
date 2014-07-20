'use strict';
line.controller('resultsCtrl', ['$scope', 'explorer', 'playlist', function ($scope, explorer, playlist) {
    $scope.explorer = explorer;
    $scope.add = function (track) {
        playlist.add(track);
    }
}]);