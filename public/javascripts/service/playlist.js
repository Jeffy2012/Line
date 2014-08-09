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
    function (server, player) {
        var tracks = store.getAll();

        var playlist = {
            tracks: tracks,
            _deal: function () {
                this.hashes = _.sortBy(_.values(tracks), function (track) {
                    return track.timestamp;
                }).map(function (track) {
                    return track.hash;
                });
            },
            add: function (track) {
                var tracks = this.tracks || {},
                    hash ,
                    exist;
                if (track) {
                    hash = track.hash;
                    if (hash) {
                        exist = hash in tracks;
                        if (!exist) {
                            var filesize = track.m4afilesize;
                            track = _.pick(track, ['filename', 'duration', 'hash', 'singername']);
                            track.filesize = filesize;
                            track.timestamp = Date.now();
                            server
                                .collectTrackInfo(track)
                                .then(function () {
                                    store.set(hash, track);
                                });
                            tracks[hash] = track;
                            this._deal();
                        }
                    }
                }
                return this;
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
            },
            remove: function (track) {
                var tracks = this.tracks || {},
                    hash,
                    exist;
                if (track) {
                    hash = track.hash;
                    if (hash) {
                        exist = hash in tracks;
                        if (exist) {
                            store.remove(hash);
                            delete  tracks[hash];
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
                }
                return tracks[hash];
            }
        };
        playlist._deal();
        return playlist;
    });