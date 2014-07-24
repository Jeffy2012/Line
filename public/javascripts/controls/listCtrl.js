'use strict';
line.controller('listCtrl', function ($scope,$routeParams,server) {
    $scope.singers = [];
    server
        .provide('singer.list',$routeParams)
        .success(function(body){
            $scope.singers = body.data;
        })
});