var Music = Backbone.Model.extend({
    defaults: function () {
        return {
            //stars: 3
        };
    },
    query: Backbone.fetch,
    initialize: function () {
    },
    _srcXHR: null,
    _infoXHR: null,
    _krcXHR: null,
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
    play: function () {
        var self = this,
            music = this.playlist.at(0);
        music.src().done(function () {
            var url = music.get('url');
            self.howl.urls([url]).play();
        });
    },
    add: function () {

    },
    remove: {

    },
    setup: function () {

    },
    next: function () {

    },
    prev: function () {

    }
});
['pause', 'stop', 'pos', 'fade', 'fadeIn', 'fadeOut'].forEach(function (method) {
    Music.prototype[method] = function () {
        return player.howl[method].apply(player.howl, arguments);
    }
});
['load', 'loaderror', 'play', 'pause', 'end'].forEach(function (event) {
    player.howl.on(event, function () {
        player.trigger(event, player);
    });
});
player.playlist.add({
    filename: "周杰伦、杨瑞代 - 准备中",
    filesize: 3945951,
    hash: "82ed475862888b9dc44c3dc37ce39257",
    bitrate: 128,
    extname: "mp3",
    duration: 246,
    mvhash: "",
    m4afilesize: 1014247,
    '320hash': "",
    '320filesize': 0,
    sqhash: "",
    sqfilesize: 0,
    feetype: 0
});
player.on('play', function () {
    console.log('play');
});