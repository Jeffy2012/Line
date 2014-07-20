'use strict';
line.controller('searchCtrl', ['$scope', 'explorer', function ($scope, explorer) {
    $scope.search = function (e) {
        var keyword = $scope.keyword;
        if (keyword && (e.type == 'click' || e.which == 13)) {
            explorer.search({keyword: $scope.keyword});
        }
    };
}]);
