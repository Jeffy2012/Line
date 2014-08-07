'use strict';
angular     .module('line')     factory("radio",
    [
        'server',
        function (server) {
            return {
                fms: [],
                query: {},
                items: {},
                totalPage: 0,
                fm: {},
                list: function (query) {
                    var self = this;
                    server
                        .provide('fm.list', query)
                        .success(function (body, status, headers, config) {
                            self.fms = body.data;
                            self.fms.forEach(function (fm) {
                                self.items[fm.fmid] = fm.fmSongData[0];
                            });
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
                        current = query.pageindex;
                    if (current < totalPage) {
                        this.list(angular.extend(query, {
                            pageindex: current + 1
                        }));
                    }
                },
                prev: function () {
                    var query = this.query,
                        current = query.pageindex;
                    if (current !== 1) {
                        this.list(angular.extend(query, {
                            pageindex: current - 1
                        }));
                    }
                },
                clear: function () {
                    this.fms = [];
                },
                tuneTo: function (fm) {
                    this.fm = fm;
                    var fmId = fm.fmid,
                        items = this.items,
                        item = items[fmId],
                        songs = item.songs,
                        offset = JSON.parse(decodeURIComponent(item.offset));
                    return server
                        .provide('fm.tracks', {fmid: fmId, offset: offset})
                        .success(function (body, status, headers, config) {
                            item.offset = body.data[0].offset;
                            Array.prototype.push.apply(songs, body.data[0].songs);
                        });
                }
            }
        }
    ]
);