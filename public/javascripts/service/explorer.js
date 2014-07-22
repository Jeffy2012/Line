'use strict';
line.factory("explorer", ['$rootScope', 'server', function ($rootScope, server) {
    return {
        results: [],
        query: {},
        totalPage: 0,
        search: function (query) {
            var self = this;
            server
                .provide('search.tracks', query)
                .success(function (body, status, headers, config) {
                    self.results = body.data.info;
                    self.query = config.params;
                    self.totalPage = Math.ceil(body.data.total / self.query.pagesize);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.$broadcast('explorer:SEARCHERROR', data, status, headers, config);
                });
        },
        autoComplete: function (query) {
            var self = this;
            server
                .provide('search.ac', query)
                .success(function () {

                });
        },
        next: function () {
            var query = this.query,
                totalPage = this.totalPage,
                current = query.page;
            if (current < totalPage) {
                this.search(angular.extend(query, {
                    page: current + 1
                }));
            }
        },
        prev: function () {
            var query = this.query,
                current = query.page;
            if (current !== 1) {
                this.search(angular.extend(query, {
                    page: current - 1
                }));
            }
        },
        clear: function () {
            this.results = [];
        }
    }
}]);