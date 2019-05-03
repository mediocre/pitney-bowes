const cache = require('memory-cache');
const createError = require('http-errors');
const request = require('request');

function PitneyBowes(args) {
    const options = Object.assign({
        api_key: '',
        api_secret: '',
        baseUrl: 'https://api-sandbox.pitneybowes.com/shippingservices',
    }, args);

    this.getOAuthToken = function(callback) {
        // Try to get the token from memory cache
        const oAuthToken = cache.get('pitney-bowes-oauth-token');

        if (oAuthToken) {
            return callback(null, oAuthToken);
        }

        const req = {
            form: {
                grant_type: 'client_credentials'
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${options.api_key}:${options.api_secret}`).toString('base64')}`
            },
            json: true,
            method: 'POST',
            url: `${options.baseUrl.replace('/shippingservices', '')}/oauth/token`
        };

        request(req, function(err, res, body) {
            if (err) {
                return callback(err);
            }

            if (res.statusCode !== 200) {
                return callback(createError(res.statusCode, body && body.error));
            }

            // Put the token in memory cache
            cache.put('pitney-bowes-oauth-token', body, body.expiresIn * 1000 / 2);

            callback(null, body);
        });
    };

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