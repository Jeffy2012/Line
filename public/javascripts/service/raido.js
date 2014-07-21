'use strict';
line.factory("fms", ['$rootScope', 'server', function ($rootScope, server) {
    return {
        fms: [],
        query: {},
        totalPage: 0,
        list: function (query) {
            var self = this;
            server
                .provider('fm.list', query)
                .success(function (body, status, headers, config) {
                    self.fms = body.data.info;
                    self.query = config.params;
                    self.totalPage = Math.ceil(body.recordcount / self.query.pagesize);
                })
                .error(function (body, status, headers, config) {
                    $rootScope.$broadcast("fms:ERROR", body, status, headers, config);
                });
        },
        next: function () {
            var query = this.query,
                totalPage = this.totalPage,
                current = query.page;
            if (current < totalPage) {
                this.list(angular.extend(query, {
                    page: current + 1
                }));
            }
        },
        prev: function () {
            var query = this.query,
                current = query.page;
            if (current !== 1) {
                this.list(angular.extend(query, {
                    page: current - 1
                }));
            }
        },
        clear: function () {
            this.fms = [];
        }
    }
}]);