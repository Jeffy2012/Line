'use strict';
angular
    .module('line').
    factory('playlist',
    function (store, player) {
        var tracks = store.getAll();
        var hashes = [];

        function _deal() {
            hashes = _.sortBy(_.values(tracks), function (track) {
                return track.timestamp;
            }).map(function (track) {
                return track.hash;
            });
        }

        _deal();
        return {
            hashes: hashes,
            tracks: tracks,
            add: function (track) {
                track = track || {};
                var tracks = this.tracks,
                    hash = track.hash,
                    exist = hash in tracks;
                if (hash && !exist) {
                    track.timestamp = Date.now();
                    store.set(hash, track);
                    tracks[hash] = track;
                    _deal();
                    return track;
                }
                return false;
            },
            remove: function (track) {
                track = track || {};
                var tracks = this.tracks,
                    hash = track.hash,
                    exist = hash in tracks;
                if (hash && exist) {
                    store.remove(hash);
                    delete  tracks[hash];
                    _deal();
                    return track;
                }
                return false;
            },
            next: function () {
                var tracks = this.tracks,
                    hashes = this.hashes,
                    length = hashes.length,
                    current = player.current || {},
                    currentHash = current.hash,
                    index = hashes.indexOf(currentHash),
                    exist = currentHash in tracks,
                    trackHash;
                if (length > 0) {
                    if (exist) {
                        if (index === length - 1) {
                            trackHash = hashes[0];
                        } else {
                            trackHash = hashes[index + 1];
                        }
                    } else {
                        trackHash = hashes[0];
                    }
                }
                return tracks[trackHash];
            },
            prev: function () {
                var tracks = this.tracks,
                    hashes = this.hashes,
                    length = hashes.length,
                    current = player.current || {},
                    currentHash = current.hash,
                    index = hashes.indexOf(currentHash),
                    exist = currentHash in tracks,
                    trackHash;
                if (length > 0) {
                    if (exist) {
                        if (index === 0) {
                            trackHash = hashes[length - 1];
                        } else {
                            trackHash = hashes[index - 1];
                        }
                    } else {
                        trackHash = hashes[0];
                    }
                }
                return tracks[trackHash];
            }
        };
    });