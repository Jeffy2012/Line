'use strict';
angular     .module('line')     controller('singer.albumsCtrl', function ($scope, $routeParams, server) {
    $scope.albums = [];
    server
        .provide('singer.albums', $routeParams)
        .success(function (body) {
            $scope.albums = body.data;
        })
});