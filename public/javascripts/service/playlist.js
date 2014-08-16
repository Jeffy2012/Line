'use strict';
//'filename',
//'duration',
//'hash',
//'singername'
//'singerid',
//'songname',
//'choricsinger',
//'songname',
//'intro',
//'imgurl'
//filesize
angular
    .module('line').
    factory('playlist',
    function ($rootScope, server, player) {
        var tracks = store.getAll();
        var playlist = {
            tracks: tracks,
            hashes: [],
            total: 0,
            _deal: function () {
                this.hashes = _.sortBy(_.values(tracks), function (track) {
                    return track.timestamp;
                }).map(function (track) {
                    return track.hash;
                });
                this.total = this.hashes.length;
            },
            exist: function (track) {
                track = track || {};
                return this.hashes.indexOf(track.hash) !== -1;
            },
            add: function (track) {
                var self = this,
                    tracks = this.tracks || {},
                    hash ,
                    exist;
                if (angular.isArray(track)) {
                    tracks = track;
                    tracks.forEach(function (track) {
                        self.add(track);
                    });
                } else {
                    if (track) {
                        hash = track.hash;
                        if (hash) {
                            exist = hash in tracks;
                            if (!exist) {
                                track.timestamp = Date.now();
                                server.provide('track.info', {hash: hash}).then(function (res) {
                                    angular.extend(track, res.data);
                                    store.set(hash, track);
                                });
                                tracks[hash] = track;
                                this._deal();
                            }
                        }
                    }
                }
                return this;
            },
            remove: function (track) {
                var self = this,
                    tracks = this.tracks || {},
                    hash,
                    exist;
                if (angular.isArray(track)) {
                    tracks = track;
                    tracks.forEach(function (track) {
                        self.add(track);
                    });
                } else {
                    if (track) {
                        hash = track.hash;
                        if (hash) {
                            exist = hash in tracks;
                            if (exist) {
                                store.remove(hash);
                                delete  tracks[hash];
                                this._deal();
                            }
                        }
                    }
                }
                return this;
            },
            next: function () {
                var tracks = this.tracks || {},
                    hashes = this.hashes || [],
                    length = hashes.length,
                    current = player.current || {},
                    currentHash = current.hash,
                    index = hashes.indexOf(currentHash),
                    hash = 0;
                if (index !== -1) {
                    if (index === length - 1) {
                        hash = hashes[0];
                    } else {
                        hash = hashes[index + 1];
                    }
                } else {
                    hash = hashes[0];
                }
                return tracks[hash];
            },
            prev: function () {
                var tracks = this.tracks || {},
                    hashes = this.hashes || [],
                    length = hashes.length,
                    current = player.current || {},
                    currentHash = current.hash,
                    index = hashes.indexOf(currentHash),
                    hash = 0;
                if (index !== -1) {
                    if (index === 0) {
                        hash = hashes[length - 1];
                    } else {
                        hash = hashes[index - 1];
                    }
                } else {
                    hash = hashes[0];
                }
                return tracks[hash];
            },
            random: function () {
                var tracks = this.tracks || {},
                    current = player.current || {},
                    track = _.sample(tracks);
                if (track) {
                    if (track.hash === current.hash) {
                        return this.random();
                    } else {
                        return track;
                    }
                }
            }
        };
        playlist._deal();
        return playlist;
    });