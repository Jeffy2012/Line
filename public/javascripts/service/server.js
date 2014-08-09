'use strict';
angular
    .module('line')
    .factory('server', function ($http) {
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
                    }
                },
                src: {
                    url: '/fetch/song',
                    params: {
                        hash: '82ed475862888b9dc44c3dc37ce39257',
                        cmd: 'playInfo'
                    }
                },
                krc: {
                    url: '/fetch/krc',
                    params: {
                        cmd: 100,
                        keyword: '张杰+-+他不懂',
                        timelength: 232,
                        hash: '2d50ad228549434e3eec57678f18092b'
                    }
                }
            },
            fm: {
                list: {
                    url: '/fetch/fms',
                    params: {
                        pageindex: 1,
                        pagesize: 15
                    }
                },
                tracks: {
                    url: '/fetch/fm',
                    params: {
                        fmid: 5,
                        offset: '',
                        size: 10
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
            collectTrackInfo: function (track) {
                return this.
                    provide('track.info', {
                        hash: track.hash
                    }).then(function (res) {
                        var info = res.data.data;
                        if (info) {
                            info = _.pick(info, [
                                'singerid',
                                'singername',
                                'choricsinger',
                                'songname',
                                'intro',
                                'imgurl'
                            ]);
                            angular.extend(track, info);
                        }
                        return track;
                    });
            }
        };
    });