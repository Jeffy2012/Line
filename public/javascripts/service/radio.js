'use strict';
angular
    .module('line')
    .factory('radio', function ($q, server) {
        return {
            fms: {},
            maxSize: 5,
            query: {},
            current: {},
            list: function (query) {
                var self = this;
                server
                    .provide('fm.list', query)
                    .then(function (res) {
                        var params = res.config.params;
                        angular.extend(self, res.data);
                        self.pagesize = params.pagesize;
                        self.page = params.pageindex;
                    });
            },
            tuneTo: function (fm) {
                fm = fm || {};
                this.current = fm;
                var tracks = fm.tracks,
                    length = tracks.length,
                    deferred = $q.defer(),
                    track, hash;
                if (length === 0) {
                    this.fetch().then(function (track) {
                        deferred.resolve(track);
                    });
                }
                if (length > 0) {
                    track = tracks[0];
                    hash = track.hash;
                    server.provide('track.info', {hash: hash}).then(function (res) {
                        angular.extend(track, res.data);
                    });
                    deferred.resolve(track);
                }
                return deferred.promise;
            },
            next: function () {
                var current = this.current || {},
                    tracks = current.tracks;
                tracks.shift();
                return this.tuneTo(current);
            },
            fetch: function () {
                var current = this.current || {},
                    fmid = current.fmid, tracks = current.tracks || [], offset = current.offset;
                if (fmid && offset) {
                    return server
                        .provide('fm.tracks', {
                            fmid: fmid,
                            offset: offset
                        }).then(function (res) {
                            var body = res.data,
                                data = body.tracks;
                            current.offset = body.offset;
                            if (data) {
                                Array.prototype.push.apply(tracks, data);
                                return  tracks[0];
                            }
                        });
                }
            }
        };
    });