'use strict';
angular
    .module('line')
    .factory('radio', function ($q, server) {
        return {
            fms: server.fms,
            current: {},
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
                    fmid = current.fmid,
                    tracks = current.tracks || [],
                    fmtype = current.fmtype;
                return server
                    .provide('fm.tracks', {
                        fmid0: fmid,
                        fmtype0: fmtype
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
        };
    });