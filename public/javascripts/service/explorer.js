'use strict';
angular
    .module('line')
    .factory('explorer', function (server, tracks) {
        return {
            query: {},
            _search: function (page) {
                var self = this;
                server
                    .provide('search.tracks', angular.extend(self.query, {page: page}))
                    .success(function (body, status, headers, config) {
                        tracks.data = body.data.info;
                        tracks.info.pagesize = config.params.pagesize;
                        tracks.info.total = body.data.total;
                        tracks.info.page = config.params.page
                    });
            },
            search: function (query) {
                var self = this;
                if (query) {
                    if (query.keyword) {
                        if (!query.page) {
                            query.page = 1;
                        }
                        self.query = query;
                        tracks.fetch = function (page) {
                            self._search(page);
                        };
                        self._search(1);
                    }
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