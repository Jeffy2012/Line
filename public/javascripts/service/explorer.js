'use strict';
angular
    .module('line')
    .factory('explorer', function (server, tracks) {
        return {
            query: {},
            search: function (query) {
                var self = this;
                if (query) {
                    if (query.keyword) {
                        self.query = query;
                        tracks.fetch = function (page) {
                            self.search({page: page});
                        };
                    } else {
                        angular.extend(self.query, query);
                    }
                    server
                        .provide('search.tracks', query)
                        .success(function (body, status, headers, config) {
                            tracks.data = body.data.info;
                            tracks.info.pagesize = config.params.pagesize;
                            tracks.info.total = body.data.total;
                            tracks.info.page = config.params.page
                        });
                }
            },
            ac: function (query) {
                return server
                    .provide('search.ac', query)
                    .then(function (res) {
                        return res.data.data.map(function (item) {
                                return item.keyword;
                            }
                        );
                    });
            }
        };
    });