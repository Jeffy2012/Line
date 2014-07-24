'use strict';
line.controller('albums.tracksCtrl', function ($scope, $routeParams, server) {
    $scope.tracks = [];
    server
        .provide('album.tracks', $routeParams)
        .success(function (body) {
            $scope.tracks = body.data.info;
        })
});