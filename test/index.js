const assert = require('assert');

const cache = require('memory-cache');

const PitneyBowes = require('../index');

describe('PitneyBowes.getToken', function() {
    this.timeout(5000);

    beforeEach(function() {
        // Clear existing token
        cache.del('newgistics-client-token');
    });

    it('should return an error for invalid authapi_url', function(done) {
        const pitneyBowes = new PitneyBowes({
            authapi_url: 'invalid'
        });

        pitneyBowes.getToken(function(err, token) {
            assert(err);
            assert.strictEqual(token, undefined);

            done();
        });
    });

    it('should return an invalid_client error', function(done) {
        const pitneyBowes = new PitneyBowes({
            client_id: 'invalid'
        });

        pitneyBowes.getToken(function(err, token) {
            assert(err);
            assert.strictEqual(err.message, 'invalid_client');
            assert.strictEqual(err.status, 400);
            assert.strictEqual(token, undefined);

            done();
        });
    });

    it('should return an error for non 200 status code', function(done) {
        const pitneyBowes = new PitneyBowes({
            authapi_url: 'https://httpstat.us/500#',
            client_id: process.env.NEWGISTICS_CLIENT_ID,
            client_secret: process.env.NEWGISTICS_CLIENT_SECRET,
            shippingapi_url: process.env.NEWGISTICS_SHIPPINGAPI_URL
        });

        pitneyBowes.getToken(function(err) {
            assert(err);
            assert.strictEqual(err.message, 'Internal Server Error');
            assert.strictEqual(err.status, 500);

            done();
        });
    });

    it('should return a valid token', function(done) {
        const pitneyBowes = new PitneyBowes({
            authapi_url: process.env.NEWGISTICS_AUTHAPI_URL,
            client_id: process.env.NEWGISTICS_CLIENT_ID,
            client_secret: process.env.NEWGISTICS_CLIENT_SECRET,
            shippingapi_url: process.env.NEWGISTICS_SHIPPINGAPI_URL
        });

        pitneyBowes.getToken(function(err, token) {
            assert.ifError(err);
            assert(token);
            assert(token.access_token);
            assert(token.expires_in);
            assert(token.token_type);

            done();
        });
    });

    it('should return the same token on subsequent calls', function(done) {
        const pitneyBowes = new PitneyBowes({
            authapi_url: process.env.NEWGISTICS_AUTHAPI_URL,
            client_id: process.env.NEWGISTICS_CLIENT_ID,
            client_secret: process.env.NEWGISTICS_CLIENT_SECRET,
            shippingapi_url: process.env.NEWGISTICS_SHIPPINGAPI_URL
        });

        pitneyBowes.getToken(function(err, token1) {
            assert.ifError(err);

            pitneyBowes.getToken(function(err, token2) {
                assert.ifError(err);
                assert.deepStrictEqual(token1, token2);

                done();
            });
        });
    });
});

describe('PitneyBowes.tlsTest', function() {
    this.timeout(5000);

    it('should return TLS_Connection_Success', function(done) {
        const pitneyBowes = new PitneyBowes();

        pitneyBowes.tlsTest(function(err, res) {
            assert.ifError(err);
            assert.strictEqual(res, 'TLS_Connection_Success');

            done();
        });
    });
});

