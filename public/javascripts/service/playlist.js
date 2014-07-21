'use strict';
line.factory("playlist", ['$rootScope', 'server', function ($rootScope, server) {
    return {
        tracks: [],
        howls: {},
        paused: true,
        add: function (track) {
            var tracks = this.tracks,
                exist, length, hash;
            if (track) {
                hash = track.hash;
                if (hash) {
                    exist = tracks.some(function (item) {
                        return hash === item.hash;
                    });
                    if (!exist) {
                        length = tracks.push(track);
                        if (length === 1) {
                            this.play();
                        }
                    }
                }

            }
        },
        remove: function (track) {
            var tracks = this.tracks,
                current = this.current,
                index;
            if (track) {
                index = tracks.indexOf(track);
                if (index !== -1) {
                    if (current == track) {
                        this.next();
                        // 防止 随机播放的next() 再次随机到track;
                        this.remove(track);
                    } else {
                        tracks.splice(index, 1);
                    }
                }
            }
        },
        next: function () {
            var tracks = this.tracks,
                length = tracks.length,
                current = this.current,
                index = tracks.indexOf(current);
            if (length > 0) {
                this.stop();
                if (current) {
                    if (index === -1) {
                        this.play(tracks[0]);
                    } else {
                        if (index === length - 1) {
                            this.play(tracks[0]);
                        } else {
                            this.play(tracks[index + 1]);
                        }
                    }
                } else {
                    this.play();
                }
            }
        },
        prev: function () {
            var tracks = this.tracks,
                current = this.current,
                length = tracks.length,
                index = tracks.indexOf(current);
            if (length > 0) {
                this.stop();
                if (current) {
                    if (index === -1) {
                        this.play(tracks[length - 1]);
                    } else {
                        if (index === 0) {
                            this.play(tracks[length - 1]);
                        } else {
                            this.play(tracks[index - 1]);
                        }
                    }
                } else {
                    this.play();
                }
            }
        },
        play: function (track) {
            var current = this.current,
                tracks = this.tracks,
                length = tracks.length,
                howls = this.howls,
                self = this,
                howl, hash, imgUrl;
            if (track) {
                hash = track.hash;
                if (hash) {
                    howl = howls[hash];
                    if (current != track) {
                        this.stop();
                    }
                    this.current = track;
                    if (howl) {
                        howl.play();
                        this.paused = false;
                    } else {
                        server
                            .provide('track.src', {hash: hash})
                            .success(function (body) {
                                var howl = new Howl({
                                    urls: [body.url],
                                    autoplay: false,
                                    buffer: true
                                });
                                ['load', 'loaderror', 'play', 'pause', 'end'].forEach(function (event) {
                                    howl.on(event, function () {
                                        self.paused = event !== 'play';
                                        $rootScope.$broadcast('player:' + event.toUpperCase(), track);
                                    });
                                });
                                howls[hash] = howl;
                                howl.play();
                            })
                            .error(function (data, status, headers, config) {
                                $rootScope.$broadcast('player:SRCERROR', data, status, headers, config);
                            });
                        server.
                            provide('track.info', {hash: hash})
                            .success(function (body) {
                                imgUrl = body.data.imgurl;
                                if (imgUrl) {
                                    self.current.imgurl = imgUrl.replace('{size}', 200);
                                }
                            })
                            .error(function () {
                                $rootScope.$broadcast('player:INFOERROR', data, status, headers, config);
                            });
                    }
                } else {
                    $rootScope.$broadcast('player:NOHASH', track);
                }
            } else {
                if (current) {
                    this.play(current)
                } else {
                    if (length > 0) {
                        this.play(tracks[0]);
                    } else {
                        $rootScope.$broadcast('player:NOTRACK');
                    }
                }
            }
        },
        pause: function () {
            var current = this.current,
                howls = this.howls,
                self = this,
                howl, hash;
            if (current) {
                hash = current.hash;
                if (hash) {
                    howl = howls[hash];
                    if (howl) {
                        howl.pause();
                        this.paused = true;
                    } else {
                        $rootScope.$on('player:LOAD', function () {
                            self.pause();
                        });
                    }
                }
            }
        },
        stop: function () {
            var current = this.current,
                howls = this.howls,
                self = this,
                howl, hash;
            if (current) {
                hash = current.hash;
                if (hash) {
                    howl = howls[hash];
                    if (howl) {
                        howl.stop();
                        this.paused = true;
                    } else {
                        $rootScope.$on('player:LOAD', function () {
                            self.stop();
                        });
                    }
                }
            }
        }
    };
}]);