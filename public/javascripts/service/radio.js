'use strict';
angular
    .module('line')
    .factory('radio', function ($q, server) {
        return {
            fms: {},
            info: {
                maxSize: 5
            },
            query: {},
            current: {},
            _parse: function (offset) {
                return JSON.parse(decodeURIComponent(offset));
            },
            _format: function (track) {
                var data = {};
                data.hash = track.hash;
                data.filename = track.name;
                data.duration = track.time / 1000;
                data.filesize = track['320size'];
                return data;
            },
            list: function (query) {
                var self = this;
                server
                    .provide('fm.list', query)
                    .then(function (res) {
                        self.fms = {};
                        var body = res.data,
                            data = body.data,
                            info = self.info;
                        info.total = body.recordcount;
                        info.pagesize = res.config.params.pagesize;
                        data.forEach(function (fm) {
                            var tracksData = fm.fmSongData[0],
                                fmData = _.pick(fm, [
                                    'fmid',
                                    'fmname',
                                    'classid',
                                    'classname',
                                    'fmtype',
                                    'imgurl'
                                ]);
                            fmData.offset = self._parse(tracksData.offset);
                            if (tracksData.songs) {
                                fmData.tracks = tracksData.songs.map(self._format);
                            } else {
                                fmData.tracks = [];
                                this.fetch();
                            }
                            self.fms[fm.fmid] = fmData;
                        });
                    });
            },
            tuneTo: function (fm) {
                fm = fm || {};
                this.current = fm;
                var tracks = fm.tracks,
                    length = tracks.length,
                    deferred = $q.defer(),
                    track;
                if (length == 0) {
                    this.fetch().then(function (track) {
                        deferred.resolve(track);
                    });
                }
                if (length > 0) {
                    track = tracks[0];
                    server.collectTrackInfo(track);
                    deferred.resolve(track)
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
                var self = this,
                    fms = this.fms || {},
                    current = this.current || {},
                    fmid = current.fmid, fm, tracks, offset;
                if (fmid) {
                    fm = fms[fmid];
                    tracks = fm.tracks;
                    offset = fm.offset;
                    return server
                        .provide('fm.tracks', {
                            fmid: fmid,
                            offset: offset
                        }).then(function (res) {
                            var data = res.data.data[0];
                            fm.offset = self._parse(data.offset);
                            if (data.songs) {
                                Array.prototype.push.apply(tracks, data.songs.map(self._format));
                                return  tracks[0];
                            } else {

                            }
                        });
                }
            }
        };
    });