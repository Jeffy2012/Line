'use strict';
line.factory("server", ['$http', function ($http) {
    var config = {
        singer: {
            cate: {
                url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                data: {
                    cmd: 100
                }
            },
            list: {
                url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                data: {
                    page: 1,
                    pagesize: 10,
                    clasid: 12,
                    cmd: 101
                }
            },
            info: {
                url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                data: {
                    singerid: 8071,
                    cmd: 102
                }
            },
            tracks: {
                url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                data: {
                    page: 1,
                    pagesize: 10,
                    singerid: 8071,
                    cmd: 103
                }
            },
            album: {
                url: 'http://mobilecdn.kugou.com/new/app/i/singer.php',
                data: {
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
                data: {
                    page: 1,
                    pagesize: 10
                }
            },
            tracks: {
                url: 'http://mobilecdn.kugou.com/api/v3/special/song',
                data: {
                    page: 1,
                    pagesize: 10,
                    specialid: 18102
                }
            },
            info: {
                url: 'http://mobilecdn.kugou.com/api/v3/special/info',
                data: {
                    specialid: 18102
                }
            },
            top: {
                url: 'http://mobilecdn.kugou.com/api/v3/special/focus',
                data: {
                    count: 20
                }
            }
        },
        rank: {
            list: {
                url: 'http://mobilecdn.kugou.com/api/v3/rank/list',
                data: {

                }
            },
            tracks: {
                url: 'http://mobilecdn.kugou.com/api/v3/rank/song',
                data: {
                    rankid: 6666,
                    ranktype: 2,
                    page: 1,
                    pagesize: 20
                }
            },
            new: {
                url: 'http://mobilecdn.kugou.com/api/v3/rank/newsong',
                data: {
                    type: 1,
                    page: 1,
                    pagesize: 20
                }
            }
        },
        album: {
            list: {
                url: 'http://mobilecdn.kugou.com/api/v3/album/list',
                data: {
                    page: 1,
                    pagesize: 10
                }
            },
            tracks: {
                url: 'http://mobilecdn.kugou.com/api/v3/album/song',
                data: {
                    albumid: 532986,
                    page: 1,
                    pagesize: 10
                }
            },
            info: {
                url: 'http://mobilecdn.kugou.com/api/v3/album/info',
                data: {
                    albumid: 532986
                }
            },
            top: {
                url: 'http://mobilecdn.kugou.com/api/v3/album/top',
                data: {
                    count: 20
                }
            }
        },
        tag: {
            list: {
                url: 'http://mobilecdn.kugou.com/new/app/i/quku.php',
                data: {
                    cmd: 100
                }
            },
            tracks: {
                url: 'http://mobilecdn.kugou.com/new/app/i/quku.php',
                data: {
                    tagid: 8,
                    page: 1,
                    pagesize: 10,
                    cmd: 101
                }
            },
            album: {
                url: 'http://mobilecdn.kugou.com/new/app/i/quku.php',
                data: {
                    tagid: 8,
                    page: 1,
                    pagesize: 10,
                    cmd: 102
                }
            },
            special: {
                url: 'http://mobilecdn.kugou.com/new/app/i/quku.php',
                data: {
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
                data: {
                    hash: '82ed475862888b9dc44c3dc37ce39257'
                }
            },
            src: {
                url: '/fetch/song',
                data: {
                    hash: '82ed475862888b9dc44c3dc37ce39257',
                    cmd: 'playInfo'
                }
            },
            krc: {
                url: '/fetch/krc',
                data: {
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
                data: {
                    pageindex: 1,
                    pagesize: 10
                }
            },
            tracks: {
                url: '/fetch/fm',
                data: {
                    fmid: 5,
                    offset: '',
                    size: 10
                }
            }
        },
        search: {
            tracks: {
                url: 'http://mobilecdn.kugou.com/api/v3/search/song',
                data: {
                    keyword: '周杰伦',
                    page: 1,
                    pagesize: 15
                }
            },
            ac: {
                url: 'http://mobilecdn.kugou.com/new/app/i/search.php',
                data: {
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
            var target = config[key[0]][key[1]];
            var url = target.url;
            var defaults = target.data;
            var params = {};
            var responseType = 'json';
            angular.extend(params, defaults, query);
            if (/kugou/g.test(url)) {
                angular.extend(params, {
                    outputtype: 'jsonp',
                    format: 'jsonp'
                });
                return $http({
                    url: url + '?callback=JSON_CALLBACK',
                    params: params,
                    method: 'JSONP',
                    responseType: responseType
                });
            } else {
                responseType = key[1] == 'krc' ? 'text' : 'json';
                return $http({
                    url: url,
                    params: params,
                    method: 'GET',
                    responseType: responseType
                });
            }
        }
    }
}]);