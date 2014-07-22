'use strict';
line.factory("player", ['$rootScope', 'server', function ($rootScope, server) {
    var howls = {};
    var player = {
        current: {},
        paused: true,
        play: function (track) {
            track = track || {};
            var current = this.current || {},
                self = this,
                hash = track.hash,
                howl = howls[hash],
                imgUrl;
            if (hash) {
                if (current.hash !== hash) {
                    this.stop();
                }
                this.current = track;
                if (howl) {
                    howl.play();
                    this.paused = false;
                } else {
                    howl = new Howl({
                        autoplay: false,
                        buffer: true,
                        onend:function(){
                            console.log('end');
                        }
                    });
                    ['load', 'loaderror', 'play', 'pause', 'end'].forEach(function (event) {
                        howl.on(event, function () {
                            self.paused = event !== 'play';
                            $rootScope.$broadcast('player:' + event.toUpperCase(), track);
                        });
                    });
                    howls[hash] = howl;
                    server
                        .provide('track.src', {hash: hash})
                        .success(function (body) {
                            howl.urls(body.url);
                            howl.play();
                        })
                        .error(function (data, status, headers, config) {
                            $rootScope.$broadcast('player:SRCERROR', data, status, headers, config);
                        });
                    server.
                        provide('track.info', {hash: hash})
                        .success(function (body) {
                            if(body.data){
                                imgUrl = body.data.imgurl;
                                if (imgUrl) {
                                    self.current.imgurl = imgUrl.replace('{size}', 200);
                                }
                            }
                        })
                        .error(function (data, status, headers, config) {
                            $rootScope.$broadcast('player:INFOERROR', data, status, headers, config);
                        });
                }
            } else {
                $rootScope.$broadcast('player:NOHASH', track);
            }
        },
        pause: function () {
            var current = this.current || {},
                hash = current.hash,
                howl = howls[hash];
            if (howl) {
                this.paused = true;
                return howl.pause();
            }
        },
        stop: function () {
            var current = this.current || {},
                hash = current.hash,
                howl = howls[hash];
            if (howl) {
                this.paused = true;
                return howl.stop();
            }
        },
        pos: function () {
            var current = this.current || {},
                hash = current.hash,
                howl = howls[hash];
            if (howl) {
                return howl.pos.apply(howl, arguments);
            }
            return 0;
        }
    };
    ['mute', 'unmute', 'volume', 'codecs'].forEach(function (method) {
        player[method] = function () {
            return Howler[method].apply(Howler, arguments);
        }
    });
    return player;
}]);