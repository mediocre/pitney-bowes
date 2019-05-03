const assert = require('assert');

const cache = require('memory-cache');

const PitneyBowes = require('../index');

describe('PitneyBowes.getOAuthToken', function() {
    this.timeout(5000);

    beforeEach(function() {
        // Clear existing token
        cache.del('pitney-bowes-oauth-token');
    });

    it('should return an error for non 200 status code', function(done) {
        const pitneyBowes = new PitneyBowes({
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            baseUrl: 'https://httpbin.org/status/500#'
        });

        pitneyBowes.getOAuthToken(function(err) {
            assert(err);
            assert.strictEqual(err.message, 'Internal Server Error');
            assert.strictEqual(err.status, 500);

            done();
        });
    });

    it('should return a valid oAuthToken', function(done) {
        const pitneyBowes = new PitneyBowes({
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        pitneyBowes.getOAuthToken(function(err, oAuthToken) {
            assert.ifError(err);

            assert(oAuthToken);
            assert(oAuthToken.access_token);
            assert(oAuthToken.clientID);
            assert(oAuthToken.expiresIn);
            assert(oAuthToken.issuedAt);
            assert(oAuthToken.org);
            assert.strictEqual(oAuthToken.tokenType, 'BearerToken');

            done();
        });
    });

    it('should return the same token on subsequent calls', function(done) {
        const pitneyBowes = new PitneyBowes({
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

