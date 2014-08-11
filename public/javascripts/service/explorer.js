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
                    .then(function (res) {
                        var data = res.data,
                            params = res.config.params;
                        data.pagesize = params.pagesize;
                        data.page = params.page;
                        angular.extend(tracks, data);
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