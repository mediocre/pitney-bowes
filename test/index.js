const assert = require('assert');

const cache = require('memory-cache');

const PitneyBowes = require('../index');

describe('PitneyBowes.getOAuthToken', function() {
    this.timeout(5000);

    beforeEach(function() {
        // Clear existing token
        cache.del('newgistics-client-token');
    });

    it('should return an error for invalid authapi_url', function(done) {
        const pitneyBowes = new PitneyBowes({
            authapi_url: 'invalid'
        });

        pitneyBowes.getOAuthToken(function(err, token) {
            assert(err);
            assert.strictEqual(token, undefined);

            done();
        });
    });

    it('should return an invalid_client error', function(done) {
        const pitneyBowes = new PitneyBowes({
            client_id: 'invalid'
        });

        pitneyBowes.getOAuthToken(function(err, token) {
            assert(err);
            assert.strictEqual(err.message, 'invalid_client');
            assert.strictEqual(err.status, 400);
            assert.strictEqual(token, undefined);

            done();
        });
    });

    it('should return an error for non 200 status code', function(done) {
        const pitneyBowes = new PitneyBowes({
            base_url: 'https://httpstat.us/500#',
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        pitneyBowes.getOAuthToken(function(err) {
            assert(err);
            assert.strictEqual(err.message, 'Internal Server Error');
            assert.strictEqual(err.status, 500);

            done();
        });
    });

    it('should return a valid token', function(done) {
        const pitneyBowes = new PitneyBowes({
            authapi_url: process.env.NEWGISTICS_AUTHAPI_URL,
            base_url: 'https://fixme',
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        pitneyBowes.getOAuthToken(function(err, token) {
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
            base_url: 'https://fixme',
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        pitneyBowes.getOAuthToken(function(err, token1) {
            assert.ifError(err);

            pitneyBowes.getOAuthToken(function(err, token2) {
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

