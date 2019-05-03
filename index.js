const createError = require('http-errors');
const request = require('request');

function PitneyBowes() {
    this.tlsTest = function(callback) {
        const req = {
            method: 'GET',
            url: 'https://api-test.pitneybowes.com/tlstest'
        };

        request(req, function(err, res, body) {
            if (err) {
                return callback(err);
            }

            if (res.statusCode !== 200) {
                return callback(createError(res.statusCode, res.body));
            }

            callback(null, body);
        });
    };
}

module.exports = PitneyBowes;