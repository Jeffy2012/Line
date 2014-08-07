'use strict';
angular
    .module('line').
    factory('playlist',
    function (player, server) {
        var tracks = store.getAll();

        function _deal() {
            this.hashes = _.sortBy(_.values(tracks), function (track) {
                return track.timestamp;
            }).map(function (track) {
                return track.hash;
            });
        }

        var playlist = {
            tracks: tracks,
            add: function (track) {
                track = track || {};
                var tracks = this.tracks,
                    hash = track.hash,
                    exist = hash in tracks;
                if (hash && !exist) {
                    var filesize = track.m4afilesize;
                    track = _.pick(track, [
                        'filename',
                        'duration',
                        'hash',
                        'singername'
                    ]);
                    track.filesize = filesize;
                    track.timestamp = Date.now();
                    server.
                        provide('track.info', {hash: hash})
                        .success(function (body) {
                            var info = body.data;
                            info = _.pick(info, [
                                'singerid',
                                'songname',
                                'choricsinger',
                                'songname',
                                'intro',
                                'imgurl'
                            ]);
                            angular.extend(track, info);
                            store.set(hash, track);
                        })
                        .error(function (data, status, headers, config) {

                        });
                    tracks[hash] = track;
                    _deal.call(playlist);
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
                    _deal.call(playlist);
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
        _deal.call(playlist);
        return playlist;
    });