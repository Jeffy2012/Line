'use strict';
line.factory("playlist", ['$rootScope', 'server', function ($rootScope, server) {
    return {
        tracks: [],
        howls: {},
        paused: true,
        add: function (track) {
            var tracks = this.tracks,
                index = tracks.indexOf(track);
            if (index === -1) {
                tracks.push(track);
                if (!this.current) {
                    this.play(track);
                }
            }
        },
        remove: function (track) {
            var tracks = this.tracks,
                index = tracks.indexOf(track);
            tracks.splice(index, 1)
        },
        next: function () {
            var tracks = this.tracks,
                length = tracks.length,
                current = this.current,
                index = tracks.indexOf(current);
            if (index == -1) {
                this.play();
            } else {
                if (length > 1) {
                    if (index == length - 1) {
                        this.play(tracks[0]);
                    } else {
                        this.play(tracks[index + 1]);
                    }
                }
            }
        },
        prev: function () {
            var tracks = this.tracks,
                current = this.current,
                length = tracks.length,
                index = tracks.indexOf(current);
            if (index == -1) {
                this.play();
            } else {
                if (length > 1) {
                    if (index === 0) {
                        this.play(tracks[length - 1]);
                    } else {
                        this.play(tracks[index - 1]);
                    }
                }
            }
        },
        play: function (track) {
            var tracks = this.tracks;
            if (tracks.length === 0) {
                return;
            }
            track = track || tracks[0];
            var howls = this.howls,
                hash = track.hash,
                current = this.current,
                self = this;
            if (current && current != track) {
                howls[current.hash].stop();
            }
            this.current = track;
            if (hash in howls) {
                howls[hash].play();
            } else {
                server
                    .provide('track.src', {hash: hash})
                    .then(function (xhr) {
                        var howl = new Howl({
                            urls: [xhr.data.url],
                            autoplay: false,
                            buffer: true
                        });
                        howl.on('end', function () {
                            $rootScope.$broadcast('playend');
                            self.paused = true;
                        });
                        howls[hash] = howl;
                        howl.play();
                    });
                server.
                    provide('track.info', {hash: hash})
                    .then(function (xhr) {
                        self.current.imgurl = xhr.data.data.imgurl.replace('{size}', 200);
                    });
            }
//            if (current == track) {
//                howls[current.hash].play();
//            }
            this.paused = false;
        },
        pause: function () {
            var current = this.current,
                howls = this.howls,
                hash = current.hash,
                howl = howls[hash];
            if (howl) {
                howl.pause();
            }
            this.paused = true;
        },
        stop: function () {
            var current = this.current,
                howls = this.howls,
                hash = current.hash,
                howl = howls[hash];
            if (howl) {
                howl.stop();
            }
            this.paused = true;
        }
    };
}]);