'use strict';
angular
    .module('line')
    .factory('player', function ($cacheFactory, $rootScope, $interval, server) {

        function getLine(krcStr) {
            var patter = /((?:\[\d+:\d+\.\d+\])+)(.*)/igm;
            var result;
            var data = {};
            while ((result = patter.exec(krcStr)) != null) {
                data[result[1]] = result[2];
            }
            return data;
        }

        function split(obj) {
            var patter = /\[(\d+:\d+\.\d+)\]/ig;
            var result;
            var data = {};
            for (var key in obj) {
                while ((result = patter.exec(key)) != null) {
                    data[result[1]] = obj[key];
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

        var howls = $cacheFactory('howls');
        var krcCache = $cacheFactory('krcCache');
        var player = {
            current: {},
            krc: {},
            currentTime: 0,
            progress: 0,
            paused: true,
            play: function (track) {
                track = track || {};
                var self = this,
                    current = self.current || {},
                    hash = track.hash,
                    howl = howls.get(hash);
                if (hash) {
                    if (current.hash !== hash) {
                        this.stop();
                    }
                    this.current = track;
                    if (!howl) {
                        howl = new Howl({
                            autoplay: false,
                            buffer: true
                        });
                        ['load', 'loaderror', 'play', 'pause', 'end'].forEach(function (event) {
                            howl.on(event, function () {
                                self.paused = event !== 'play';
                                $rootScope.$broadcast('player:' + event.toUpperCase(), track);
                            });
                        });
                        howls.put(hash, howl);
                        server
                            .provide('track.src', {hash: hash})
                            .success(function (body) {
                                howl.urls(body.url);
                            })
                            .error(function () {

                            });
                    }
                    self.setUpKrc();
                    howl.play();
                    this.paused = false;
                }
            },
            pause: function () {
                var current = this.current || {},
                    hash = current.hash,
                    howl = howls.get(hash);
                if (howl) {
                    this.paused = true;
                    return howl.pause();
                }
            },
            stop: function () {
                var current = this.current || {},
                    hash = current.hash,
                    howl = howls.get(hash);
                if (howl) {
                    this.paused = true;
                    return howl.stop();
                }
            },
            pos: function () {
                var current = this.current || {},
                    hash = current.hash,
                    howl = howls.get(hash);
                if (howl) {
                    return howl.pos.apply(howl, arguments);
                }
                return 0;
            },
            setUpKrc: function () {
                var self = this,
                    current = this.current || {},
                    hash = current.hash,
                    krc = krcCache.get(hash);
                if (krc) {
                    this.krc = krc;
                } else {
                    server
                        .provide('track.krc', {
                            keyword: current.filename,
                            hash: current.hash,
                            timelength: current.duration
                        })
                        .success(function (body) {
                            krc = parseLrc(body);
                            self.krc = krc;
                            krcCache.put(hash, krc)
                        })
                        .error(function () {
                            self.krc = {};
                        });
                }
            }
        };
        ['mute', 'unmute', 'volume', 'codecs'].forEach(function (method) {
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
            player.currentTime = currentTime = player.pos();
            if (duration) {
                player.progress = currentTime * 100 / duration;
            }
            if (points) {
                krc.active = _.sortedIndex(points, currentTime) - 1;
            }
        }, 100);
        return player;
    })
;