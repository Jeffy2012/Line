var express = require('express');
var router = express.Router();
var Q = require('q');
var request = require('request');
var config = {
    fm: 'http://www.kugou.com/fm/app/i/',
    src: 'http://trackercdn.kugou.com/i/',
    krc: 'http://mobilecdn.kugou.com/new/app/i/krc.php'
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