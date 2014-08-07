'use strict';
angular.module('line').controller('categoryCtrl', function ($scope, $routeParams, server) {
    $scope.categories = [];
    server
        .provide('singer.category', $routeParams)
        .success(function (body) {
            $scope.categories = body.data;
        })
});