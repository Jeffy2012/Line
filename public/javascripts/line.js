'use strict';
angular
    .module('line', ['ngRoute', 'ui.bootstrap'])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    });