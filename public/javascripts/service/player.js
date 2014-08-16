'use strict';
angular
    .module('line')
    .factory('player', function ($cacheFactory, $rootScope, $interval, server) {

        function getLine(krcStr) {
            var patter = /((?:\[\d+:\d+\.\d+\])+)(.*)/igm;
            var result;
            var data = {};
            while ((result = patter.exec(krcStr)) !== null) {
                data[result[1]] = result[2];
            }
            return data;
        }

        function split(obj) {
            var patter = /\[.*(\d+:\d+\.\d+)\]/ig;
            var result;
            var data = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    while ((result = patter.exec(key)) !== null) {
                        data[result[1]] = obj[key];
                    }
                }
            }
            return data;
        }

        function parseLrc(krcStr) {
            var obj = split(getLine(krcStr));
            var patter = /(\d+):(\d+\.\d+)/;
            var point;
            var krc = {};
            var points = [];
            for (var key in obj) {
                if (patter.test(key)) {
                    point = parseInt(RegExp.$1, 10) * 60 + parseFloat(RegExp.$2) || 0;
                    krc[point] = obj[key];
                    points.push(point);
                }
            }
            points = _.sortBy(points, function (point) {
                return point;
            });
            krc.points = points;
            return krc;
        }

        var stopQueue = {};
        var pauseQueue = {};
        var howls = $cacheFactory('howlCache');
        var krcCache = $cacheFactory('krcCache');
        var player = {
            current: {},
            krc: {},
            currentTime: 0,
            progress: 0,
            play: function (track) {
                var current = this.current || {},
                    currentHash = current.hash,
                    hash,
                    howl;
                if (track) {
                    hash = track.hash;
                    if (hash) {
                        this.stop();
                        this.current = track;
                        this._setUpKrc();
                        howl = howls.get(hash);
                        if (howl) {
                            howl.play();
                        } else {
                            server.provide('track.src', {
                                hash: hash,
                                key: md5(hash + 'kgcloud')
                            }).then(function (res) {
                                var src = res.data.src;
                                howl = new Howl({
                                    src: src,
                                    html5: true,
                                    preload: false
                                });
                                track.src = src;
                                howl.track = track;
                                howls.put(hash, howl);
                                ['load', 'loaderror', 'play', 'pause', 'end', 'faded'].forEach(function (event) {
                                    howl.on(event, function () {
                                        $rootScope.$broadcast('player:' + event.toUpperCase(), howl);
                                    });
                                });
                                howl.play();
                            });
                        }
                    }
                } else {
                    if (currentHash) {
                        howl = howls.get(currentHash);
                        if (howl) {
                            howl.play();
                        } else {
                            this.play(current);
                        }
                    }
                }
                return this;
            },
            pause: function () {
                var current = this.current || {},
                    hash = current.hash,
                    howl = howls.get(hash);
                if (hash) {
                    if (howl) {
                        howl.pause();
                    } else {
                        pauseQueue[hash] = $rootScope.$on('player:PLAY', function (event, howl) {
                            var trackHash = howl.track.hash, off;
                            if (trackHash === hash) {
                                event.stopPropagation();
                                howl.pause();
                                off = pauseQueue[trackHash];
                                if (off) {
                                    off();
                                    delete pauseQueue[trackHash];
                                }
                            }
                        });
                    }
                }
                return this;
            },
            stop: function () {
                var current = this.current || {},
                    hash = current.hash,
                    howl = howls.get(hash);
                if (hash) {
                    if (howl) {
                        howl.stop();
                    } else {
                        stopQueue[hash] = $rootScope.$on('player:PLAY', function (event, howl) {
                            var trackHash = howl.track.hash, off;
                            if (trackHash === hash) {
                                event.stopPropagation();
                                howl.pause();
                                off = stopQueue[trackHash];
                                if (off) {
                                    off();
                                    delete stopQueue[trackHash];
                                }
                            }
                        });
                    }
                }
                return this;
            },
            playing: function () {
                var current = this.current || {},
                    hash = current.hash,
                    howl = howls.get(hash);
                if (hash && howl) {
                    var _soundIds = howl._getSoundIds();
                    return howl.playing(_soundIds[0]);
                }
                return false;
            },
            seek: function () {
                var current = this.current || {},
                    hash = current.hash,
                    howl = howls.get(hash);
                if (hash && howl) {
                    return howl.seek.apply(howl, arguments);
                }
                return 0;
            },
            fade: function () {

            },
            _setUpKrc: function () {
                var self = this,
                    current = this.current || {},
                    hash = current.hash,
                    keyword = current.filename,
                    krc = krcCache.get(hash),
                    timelength = current.duration;
                if (krc) {
                    this.krc = krc;
                } else if (hash && keyword && timelength) {
                    server
                        .provide('track.krc', {
                            keyword: keyword,
                            hash: hash,
                            timelength: timelength
                        }).then(function (res) {
                            krc = parseLrc(res.data);
                            self.krc = krc;
                            krcCache.put(hash, krc);
                        });
                }
            }
        };
        ['mute', 'volume', 'codecs'].forEach(function (method) {
            player[method] = function () {
                return Howler[method].apply(Howler, arguments);
            };
        });
        $interval(function () {
            var current = player.current || {},
                krc = player.krc || {},
                points = krc.points,
                duration = current.duration,
                currentTime;
            if (current.hash) {
                player.currentTime = currentTime = player.seek();
                if (duration) {
                    player.progress = currentTime * 100 / duration;
                }
                if (points) {
                    krc.active = _.sortedIndex(points, currentTime) - 1;
                }
            }
        }, 100);
        return player;
    })
;