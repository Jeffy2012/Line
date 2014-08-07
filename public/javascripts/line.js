'use strict';
angular
    .module('line', ['ngRoute', 'ui.bootstrap'])
    .factory('store', function () {
        return store;
    })
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    });