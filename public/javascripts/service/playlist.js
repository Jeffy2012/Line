'use strict';
line.factory("playlist",
    [
        'player',
        function (player) {
            return {
                tracks: [],
                current: {},
                add: function (track) {
                    track = track || {};
                    var tracks = this.tracks,
                        exist,
                        hash = track.hash;
                    if (hash) {
                        exist = tracks.some(function (item) {
                            return hash === item.hash;
                        });
                        if (!exist) {
                            tracks.push(track);
                            return track;
                        }
                    }
                    return false;
                },
                remove: function (track) {
                    track = track || {};
                    var tracks = this.tracks,
                        exist,
                        index = -1,
                        hash = track.hash;
                    if (hash) {
                        exist = tracks.some(function (item, i) {
                            index = i;
                            return hash === item.hash;
                        });
                        if (exist) {
                            tracks.splice(index, 1);
                            return track;
                        }
                    }
                    return false;
                },
                next: function () {
                    var tracks = this.tracks,
                        length = tracks.length,
                        current = player.current || {},
                        hash = current.hash,
                        index = -1 ,
                        exist;
                    if (length > 0) {
                        if (hash) {
                            exist = tracks.some(function (item, i) {
                                index = i;
                                return hash === item.hash;
                            });
                            if (exist) {
                                if (index === length - 1) {
                                    return tracks[0];
                                } else {
                                    return tracks[index + 1];
                                }
                            } else {
                                return tracks[0];
                            }
                        } else {
                            return tracks[0];
                        }
                    }
                    return false;
                },
                prev: function () {
                    var tracks = this.tracks,
                        length = tracks.length,
                        current = player.current || {},
                        hash = current.hash,
                        index = -1 ,
                        exist;
                    if (length > 0) {
                        if (hash) {
                            exist = tracks.some(function (item, i) {
                                index = i;
                                return hash === item.hash;
                            });
                            if (exist) {
                                if (index === 0) {
                                    return tracks[length - 1];
                                } else {
                                    return tracks[index - 1];
                                }
                            } else {
                                return tracks[0];
                            }
                        } else {
                            return tracks[length - 1];
                        }
                    }
                }
            };
        }
    ]
);