'use strict';
angular
    .module('line')
    .factory('track', function (server) {

        return {
            krc: {},
            timeLine: [],
            fetch:function(track){
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
                        if (body.data) {
                            imgUrl = body.data.imgurl;
                            if (imgUrl) {
                                self.current.imgurl = imgUrl.replace('{size}', 200);
                            }
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $rootScope.$broadcast('player:INFOERROR', data, status, headers, config);
                    });
            },
            get: function (song) {
                var self = this;
                var deferred = $q.defer();
                $http
                    .get(server + '/lrc', {
                        params: {
                            keyword: encodeURIComponent(song.filename),
                            timelength: parseInt(song.data.timeLength) * 1000,
                            hash: song.hash
                        },
                        cache: true
                    })
                    .success(function (data) {
                        deferred.resolve(self.parseLrc(data));
                    }).error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },
            getLine: function (lrcStr) {
                var patter = /((?:\[\d+:\d+\.\d+\])+)(.*)/igm;
                var result;
                var data = {};
                while ((result = patter.exec(lrcStr)) != null) {
                    data[result[1]] = result[2];
                }
                return data;
            },

            split: function (obj) {
                var patter = /\[(\d+:\d+\.\d+)\]/ig;
                var result;
                var data = {};
                for (var key in obj) {
                    while ((result = patter.exec(key)) != null) {
                        data[result[1]] = obj[key];
                    }
                }
                return data;
            },

            parseLrc: function (lrcStr) {
                var obj = this.split(this.getLine(lrcStr));
                var patter = /(\d+):(\d+\.\d+)/;
                var timePoint;
                var lrcData = {};
                var timeLine = [];
                for (var key in obj) {
                    if (patter.test(key)) {
                        timePoint = parseInt(RegExp.$1, 10) * 60 + parseFloat(RegExp.$2);
                        lrcData[timePoint] = obj[key];
                        timeLine.push(timePoint);

                    }
                }
                timeLine.sort(function (value1, value2) {
                    if (value1 > value2) {
                        return 1;
                    } else if (value1 == value2) {
                        return 0;
                    } else {
                        return -1;
                    }
                });
                return {
                    lrcData: lrcData,
                    timeLine: timeLine
                };
            }};
    });