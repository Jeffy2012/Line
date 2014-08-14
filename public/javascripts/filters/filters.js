'use strict';
angular
    .module('line')
    .filter('time', function () {
        return function (input) {
            input = parseInt(input, 10);
            if (!input) {
                return '00:00';
            } else {
                input = Math.floor(input);
                if (input === 0) {
                    return '00:00';
                } else {
                    var m = Math.floor(input / 60);
                    var s = input % 60;
                    m = m >= 10 ? '' + m : '0' + m;
                    s = s >= 10 ? '' + s : '0' + s;
                    return m + ':' + s;
                }
            }
        };
    })
    .filter('orderObjectBy', function () {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) {
                filtered.reverse();
            }
            return filtered;
        };
    })
    .filter('size', function () {
        return function (input, size) {
            if (input) {
                return input.replace('{size}', size);
            } else {
                return '/images/line.png';
            }
        };
    }).filter('name', function () {
        return function (input) {
            if (input) {
                return input.replace(/.*-/ig, '');
            } else {
                return '';
            }
        };
    });