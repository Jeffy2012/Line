'use strict';
angular
    .module('line')
    .controller('explorerCtrl',
    function ($scope, $location, $routeParams, explorer) {
        $scope.explorer = explorer;
        $scope.search = function (e) {
            if (e.type === 'click' || e.which === 13) {
                var keyword = $scope.keyword;
                if (keyword) {
                    $location.path('/search/' + keyword);
                    explorer.search({keyword: keyword});

                }
            }
        };
        $scope.ac = function (val) {
            return explorer.ac({keyword: val});
        };
    });
