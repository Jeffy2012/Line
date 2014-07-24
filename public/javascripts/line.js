'use strict';
var line = angular.module('line', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/category/', {
                templateUrl: '/views/category.html',
                controller: 'categoryCtrl'
            })
            .when('/category/:classid/:page?', {
                templateUrl: '/views/list.html',
                controller: 'listCtrl'
            }).when('/singer/tracks/:singerid/:page?', {
                templateUrl: '/views/singer/tracks.html',
                controller: 'singer.tracksCtrl'
            })
            .when('/singer/albums/:singerId/:page?', {
                templateUrl: '/views/singer/albums.html',
                controller: 'singer.albumsCtrl'
            })
            .when('/albums/tracks/:albumId/:page?', {
                templateUrl: '/views/singer/list.html',
                controller: 'albums.tracksCtrl'
            });
    }]);