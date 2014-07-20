'use strict';
line.factory("explorer", ['server', function (server) {
    return {
        results: [],
        query: {},
        search: function (query) {
            var self = this;
            query = query || {};
            this.query = angular.extend({}, server.config.search.tracks.data, query);
            server
                .provide('search.tracks', query)
                .then(function (xhr) {
                    self.results = xhr.data.data.info;
                    self.total = Math.ceil(xhr.data.data.total / self.query.pagesize);
                });
        },
        next: function () {
            var query = this.query,
                total = this.total,
                current = query.page,
                pageSize = query.pagesize;
            if (pageSize * current < total) {
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