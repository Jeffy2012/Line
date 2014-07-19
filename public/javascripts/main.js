$(function () {
    var search = _.template($('#search-item-temp').html());
    var playlist = _.template($('#playlist-item-temp').html());
    var $searchItemCon = $('.search-item-con');
    var callback = function (song) {
        song.info().done(function () {
            var src = song.get('imgurl');
            if (src) {
                $('.song-img img').attr('src', src.replace('{size}', '200'));
            } else {
                $('.song-img img').attr('src', '/images/line.png');
            }
        });
    };
    $searchItemCon.on('click', '.btn', function (e) {
        var songData = $(this).parents('.search-item').data();
        player.add(songData);
    });
    var $keyword = $('#keyword');
    var $search = $('#search');
    $search.click(function () {
        var keyword = $keyword.val();
        if (keyword) {
            Backbone.fetch('search.tunes', {keyword: keyword, page: 1, pagesize: 20}).done(function (res) {
                $searchItemCon.html(search({songs: res.data.info}));
            });
        }
    });
    $keyword.keydown(function (e) {
        if (e.which == 13) {
            $search.trigger('click');
        }
    });
    var SongView = Backbone.View.extend({
        template: playlist,
        initialize: function () {
            this.render();
            this.delegateEvents(this.events);
            this.model.on('change:current', this.render, this);
        },
        render: function () {
            var model = this.model;
            this.$el.html(this.template(model.toJSON()));
            return this;
        },
        events: {
            'click .play': 'play',
            'click .remove': 'destroy'
        },
        play: function () {
            player.play(this.model, callback);
        },
        destroy: function () {
            player.remove(this.model);
        }
    });
    var PlaylistView = Backbone.View.extend({
        initialize: function (opts) {
            this.collection.on('add', this.add, this);
            this.collection.on('remove', this.remove, this);
        },
        add: function (model) {
            model.view = new SongView({
                model: model
            });
            var $song = model.view.$el;
            this.$el.append($song);
            if (!player.current) {
                player.play(model, callback);
            }
        },
        remove: function (model) {
            model.view.remove();
        }
    });
    new PlaylistView({
        collection: player.playlist,
        el: '.play-list-con'
    });
    $('.player-control .btn').click(function () {
        if (this.id == "play") {
            player[this.id](undefined, callback);
        } else {
            player[this.id]();
        }

    });
    var $progress = $('.song-progress .progress-bar');
    setInterval(function () {
        var current = player.current;
        $progress.css({
            width: (current ? Math.floor(current.pos() * 100 / current.get('duration')) : 0) + '%'
        });
    }, 16);
});
