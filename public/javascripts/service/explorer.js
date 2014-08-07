'use strict';
angular
    .module('line')
    .factory('explorer', function (server) {
        return {
            tracks: [],
            query: {},
            info: {},
            search: function (query) {
                var self = this;
                if (query) {
                    self.query = query;
                } else {
                    query = self.query;
                }
                server
                    .provide('search.tracks', query)
                    .success(function (body, status, headers, config) {
                        self.tracks = body.data.info;
                        self.info.pagesize = config.params.pagesize;
                        self.info.total = body.data.total;
                    });
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
            },
            clear: function () {
                this.tracks = [];
            }
        };
    });