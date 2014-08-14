'use strict';
angular
    .module('line', ['ngRoute', 'ui.bootstrap'])
    .config(function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: '/views/main.html'
            })
            .when('/fms', {
                templateUrl: '/views/radio.html',
                controller: 'radioCtrl',
                resolve: {
                    callback: function (radio) {
                        radio.list({pageindex: 1});
                    }
                }
            }).when('/search/:keyword', {
                templateUrl: '/views/tracks.html',
                controller: 'tracksCtrl',
                resolve: {
                    callback: function ($route, explorer) {
                        explorer.search({keyword: $route.current.params.keyword});
                    }
                }
            })
            .when('/playlist', {
                templateUrl: '/views/playlist.html',
                controller: 'playlistCtrl'
            });
    });