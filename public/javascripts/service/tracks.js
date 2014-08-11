'use strict';
angular
    .module('line')
    .factory('tracks', function (playlist) {
        return {
            maxSize: 5,
            fetch: function () {

            },
            clear: function () {
                this.data = [];
            },
            addToPlaylist: function (track) {
                playlist.add(track);
            }
        };
    });