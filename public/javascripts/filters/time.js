'use strict';
line.filter('time', function () {
    return function (input) {
        input = parseInt(input);
        if(!input){
            return '00:00'
        }else{
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
    }
});