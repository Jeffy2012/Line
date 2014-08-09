var express = require('express');
var router = express.Router();
var Q = require('q');
var request = require('request');
var config = {
    song: 'http://m.kugou.com/app/i/getSongInfo.php',
    fms: 'http://m.kugou.com/app/i/fmList.php',
    fm: 'http://m.kugou.com/app/i/fmSongs.php',
    krc: 'http://m.kugou.com/app/i/krc.php'
};

function fetch(key, query) {
    var deferred = Q.defer();
    request({
        url: config[key],
        qs: query
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = key !== 'krc' ? JSON.parse(body.trim()) : body.trim();
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}
Object.keys(config).forEach(function (key) {
    router.get('/' + key, function (req, res) {
        fetch(key, req.query).done(function (data) {
            var method;
            if (key === 'krc') {
                method = 'end';
                if (/^\s*(\[|\{[^\{])/.test(data) && /[\}\]]\s*$/.test(data)) {
                    data += 'END';
                }
            } else {
                method = 'json';
            }
            res[method](data);
        });
    });
});
module.exports = router;