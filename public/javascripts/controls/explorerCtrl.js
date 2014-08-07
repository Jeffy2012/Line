'use strict';
angular
    .module('line')
    .controller('explorerCtrl',
    function ($scope, explorer) {
        $scope.explorer = explorer;
        $scope.query = {
            page: 1
        };
        $scope.search = function (e) {
            if (e.type === 'click' || e.which === 13) {
                var keyword = $scope.query.keyword;
                if (keyword) {
                    explorer.search($scope.query);
                }
            }
        };
        $scope.ac = function (val) {
            return explorer.ac({keyword: val});
        };
        $scope.$watch('explorer.query.page', function (newVal, oldVal) {
            console.log(newVal, oldVal);
            if (oldVal && newVal) {
                explorer.search();
            }
        });
    });
