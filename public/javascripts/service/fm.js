'use strict';
line.factory("fm", ['$rootScope', 'server', 'playlist', function ($rootScope, server, playlist) {
    return {
        tracks: [],
        listen: function (fm) {
            var self = this;
            var fmId = fm.fmid;
            var track = fm.songs[0];
            var offset = fm.
            playlist.play(track);
            server
                .provider('fm.tracks', query)
                .success(function (body, status, headers, config) {

                })
        },
        next: function () {

        }
    }
}]);