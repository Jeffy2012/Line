var Music = Backbone.Model.extend({
    defaults: function () {
        return {
            howl: new Howl({
                autoplay: false,
                buffer: true
            }),
            current: false
        };
    },
    idAttribute: 'hash',
    query: Backbone.fetch,
    initialize: function () {
        this._srcXHR = null;
        this._infoXHR = null;
        this._krcXHR = null;
    },
    src: function () {
        var hash = this.get('hash'), self = this;
        if (this._srcXHR === null) {
            this._srcXHR = this.query('song.src', {hash: hash}, this)
                .done(function (res) {
                    self.set('url', res.url);
                });
        }
        return this._srcXHR;
    },
    info: function () {
        var hash = this.get('hash'), self = this;
        if (this._infoXHR === null) {
            this._infoXHR = this.query('song.info', {hash: hash})
                .done(function (res) {
                    self.set(res.data);
                });
        }
        return this._infoXHR;
    },
    krc: function () {
        var hash = this.get('hash'),
            filename = this.get('filename'),
            duration = this.get('duration'),
            self = this;
        if (this._krcXHR === null) {
            this._krcXHR = this.query('song.krc', {
                hash: hash,
                keyword: filename,
                timelength: duration
            }).done(function (data) {
                self._dealKrc(data)
            });
        }
        return this._krcXHR;
    },
    _dealKrc: function (data) {

    },
    play: function () {
        var self = this,
            howl = this.get('howl');
        this.src().done(function () {
            var url = self.get('url');
            howl.urls(url);
            howl.play();
        });
        this.set('current', true);
    }
});

['pause', 'stop', 'pos', 'fade', 'fadeIn', 'fadeOut'].forEach(function (method) {
    Music.prototype[method] = function () {
        var howl = this.get('howl');
        return howl[method].apply(howl, arguments);
    }
});
var Playlist = Backbone.Collection.extend({
    model: Music,
    next: function () {

    },
    prev: function () {

    }
});

var player = _.extend({}, Backbone.Events, {
    howl: new Howl({
        autoplay: false,
        buffer: true
    }),
    playlist: new Playlist(),
    play: function (song, callback) {
        var current = this.current,
            first = this.playlist.at(0);
        if (!song) {
            if (current) {
                current.play();
                return true;
            } else {
                if (first) {
                    this.play(first, callback);
                    return true;
                }
            }
        }
        if (current) {
            current.stop();
            current.set('current', false);
        }
        this.current = song;
        song.play();
        if (callback) {
            callback(song);
        }
    },
    add: function (data) {
        this.playlist.add(data);
    },
    remove: function (song) {
        this.playlist.remove(song)
    },
    next: function () {
        var current = this.current,
            playlist = this.playlist,
            length = playlist.length,
            index;
        if (length <= 1) {
            //current.stop();
        } else {
            index = playlist.indexOf(current);
            if (index == length - 1) {
                this.play(playlist.at(0));
            } else {
                this.play(playlist.at(index + 1));
            }
        }
    },
    stop: function () {
        this.current.stop();
    },
    pause: function () {
        this.current.pause();
    },
    prev: function () {
        var current = this.current,
            playlist = this.playlist,
            length = playlist.length,
            index;
        if (length <= 1) {
            //current.stop();
        } else {
            index = playlist.indexOf(current);
            if (index === 0) {
                this.play(playlist.at(length - 1));
            } else {
                this.play(playlist.at(index - 1));
            }
        }
    }
});
['load', 'loaderror', 'play', 'pause', 'end'].forEach(function (event) {
    player.howl.on(event, function () {
        player.trigger(event, player);
    });
});