'use strict';
line.factory("player", ['$rootScope', 'server', function ($rootScope, server) {
    var player = {
        howls: {},
        current: {},
        paused: true,
        play: function (track) {
            track = track || {};
            var current = this.current,
                howls = this.howls,
                self = this,
                howl, hash, imgUrl;
            hash = track.hash;
            if (hash) {
                howl = howls[hash];
                if (current && current.hash != hash) {
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
    ['mute', 'unmute', 'volume', 'codecs'].forEach(function (method) {
        player[method] = function () {
            return Howler[method].apply(Howler, arguments);
        }
    });
    return player;
}]);