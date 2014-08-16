'use strict';
angular
    .module('line')
    .factory('server', function ($http) {
        function parse(offset) {
            return JSON.parse(decodeURIComponent(offset));
        }

        function format(track) {
            var data = {};
            data.hash = track.hash;
            data.filename = track.name;
            data.duration = Math.floor(track.time / 1000);
            data.filesize = track.size;
            return data;
        }

        var fms = fmdata.map(function (fm) {
            fm.tracks = fm.songs.map(format);
            return _.pick(fm, ['cat', 'fmid', 'fmname', 'fmtype', 'tracks']);
        });
        var CONFIG = {
            singer: {
                category: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                    params: {
                        cmd: 100
                    }
                },
                list: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                    params: {
                        page: 1,
                        pagesize: 10,
                        classid: 12,
                        cmd: 101
                    }
                },
                info: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                    params: {
                        singerid: 8071,
                        cmd: 102
                    }
                },
                tracks: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                    params: {
                        page: 1,
                        pagesize: 10,
                        singerid: 8071,
                        cmd: 103
                    }
                },
                albums: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                    params: {
                        page: 1,
                        pagesize: 10,
                        singerid: 8071,
                        cmd: 104
                    }
                }
            },
            special: {
                list: {
                    url: 'http://mobilecdn.kugou.com/api/v3/category/special',
                    params: {
                        page: 1,
                        pagesize: 10
                    }
                },
                tracks: {
                    url: 'http://mobilecdn.kugou.com/api/v3/special/song',
                    params: {
                        page: 1,
                        pagesize: 10,
                        specialid: 18102
                    }
                },
                info: {
                    url: 'http://mobilecdn.kugou.com/api/v3/special/info',
                    params: {
                        specialid: 18102
                    }
                },
                top: {
                    url: 'http://mobilecdn.kugou.com/api/v3/special/focus',
                    params: {
                        count: 20
                    }
                }
            },
            rank: {
                list: {
                    url: 'http://mobilecdn.kugou.com/api/v3/rank/list',
                    params: {

                    }
                },
                tracks: {
                    url: 'http://mobilecdn.kugou.com/api/v3/rank/song',
                    params: {
                        rankid: 6666,
                        ranktype: 2,
                        page: 1,
                        pagesize: 20
                    }
                },
                newsong: {
                    url: 'http://mobilecdn.kugou.com/api/v3/rank/newsong',
                    params: {
                        type: 1,
                        page: 1,
                        pagesize: 20
                    }
                }
            },
            album: {
                list: {
                    url: 'http://mobilecdn.kugou.com/api/v3/album/list',
                    params: {
                        page: 1,
                        pagesize: 10
                    }
                },
                tracks: {
                    url: 'http://mobilecdn.kugou.com/api/v3/album/song',
                    params: {
                        albumid: 532986,
                        page: 1,
                        pagesize: 10
                    }
                },
                info: {
                    url: 'http://mobilecdn.kugou.com/api/v3/album/info',
                    params: {
                        albumid: 532986
                    }
                },
                top: {
                    url: 'http://mobilecdn.kugou.com/api/v3/album/top',
                    params: {
                        count: 20
                    }
                }
            },
            tag: {
                list: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/quku.php',
                    params: {
                        cmd: 100
                    }
                },
                tracks: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/quku.php',
                    params: {
                        tagid: 8,
                        page: 1,
                        pagesize: 10,
                        cmd: 101
                    }
                },
                album: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/quku.php',
                    params: {
                        tagid: 8,
                        page: 1,
                        pagesize: 10,
                        cmd: 102
                    }
                },
                special: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/quku.php',
                    params: {
                        tagid: 8,
                        page: 1,
                        pagesize: 10,
                        cmd: 103
                    }
                }
            },
            track: {
                info: {
                    url: 'http://mobilecdn.kugou.com/api/v3/song/info',
                    params: {
                        hash: '82ed475862888b9dc44c3dc37ce39257'
                    },
                    transformResponse: function (body) {
                        return _.pick(body.data, ['singerid', 'singername', 'choricsinger', 'songname', 'intro', 'imgurl']);
                    }
                },
                src: {
                    url: '/fetch/src',
                    params: {
                        key: 'ff8c3f8997d258b10184f2f32d60e451',
                        cmd: 4,
                        hash: 'ad076ad7b258b3698d73cec49bc2a89d',
                        acceptMp3: 1,
                        pid: 7
                    },
                    transformResponse: function (body) {
                        return {src: body.url};
                    }
                },
                krc: {
                    url: '/fetch/krc',
                    params: {
                        cmd: 200,
                        type: 0,
                        keyword: '%u5468%u6770%u4F26%20-%20%u661F%u6674',
                        timelength: 259000,
                        hash: '3271C8FAED5B4E952DC0C845799B3A2F'
                    }
                }
            },
            fm: {
                tracks: {
                    url: '/fetch/fm',
                    params: {
                        cmd: 1,
                        fmid0: 5,
                        fmcount: 1,
                        fmtype0: 2
                    },
                    transformResponse: function (body) {
                        var data = body.data[0],
                            offset = parse(data.offset),
                            tracks = (data.songs || []).map(format);
                        return {
                            tracks: tracks,
                            offset: offset
                        };
                    }
                }
            },
            search: {
                tracks: {
                    url: 'http://mobilecdn.kugou.com/api/v3/search/song',
                    params: {
                        keyword: '周杰伦',
                        page: 1,
                        pagesize: 15
                    },
                    transformResponse: function (body) {
                        var data = body.data,
                            tracks = (data.info || []).map(function (track) {
                                track.filesize = track.m4afilesize;
                                return _.pick(track, ['filename', 'duration', 'hash', 'singername', 'filesize']);
                            });
                        return {
                            data: tracks,
                            total: data.total
                        };
                    }
                },
                ac: {
                    url: 'http://mobilecdn.kugou.com/new/app/i/search.php',
                    params: {
                        keyword: '周',
                        cmd: 302
                    }
                }
            }
        };
        return {
            provide: function (key, query) {
                query = query || {};
                key = key.split('.');
                var config = angular.extend({}, CONFIG[key[0]][key[1]]);
                config.responseType = 'json';
                config.method = 'JSONP';
                angular.extend(config.params, query);
                if (/kugou/g.test(config.url)) {
                    angular.extend(config.params, {
                        outputtype: 'jsonp',
                        format: 'jsonp'
                    });
                    config.url += '?callback=JSON_CALLBACK';
                } else {
                    if (key[1] === 'krc') {
                        config.responseType = 'text';
                    }
                    config.method = 'GET';
                }
                config.cache = true;
                return $http(config);
            },
            fms: fms
        };
    });