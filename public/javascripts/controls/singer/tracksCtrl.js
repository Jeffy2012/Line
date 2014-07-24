'use strict';
line.controller('singer.tracksCtrl', function ($scope, $routeParams, server) {
    $scope.tracks = [];
    server
        .provide('singer.tracks', $routeParams)
        .success(function (body) {
            $scope.tracks = body.data;
        })
});