const assert = require('assert');

const cache = require('memory-cache');

const PitneyBowes = require('../index');

describe('PitneyBowes.getOAuthToken', function() {
    this.timeout(5000);

    beforeEach(function() {
        // Clear existing token
        cache.del('pitney-bowes-oauth-token');
    });

    it('should return an error for invalid baseUrl', function(done) {
        const pitneyBowes = new PitneyBowes({
            baseUrl: 'invalid'
        });

        pitneyBowes.getOAuthToken(function(err, oAuthToken) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/oauth/token"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(oAuthToken, undefined);

            done();
        });
    });

    it('should return an error for non 200 status code', function(done) {
        const pitneyBowes = new PitneyBowes({
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            baseUrl: 'https://httpbin.org/status/500#'
        });

        pitneyBowes.getOAuthToken(function(err, oAuthToken) {
            assert(err);
            assert.strictEqual(err.message, 'Internal Server Error');
            assert.strictEqual(err.status, 500);
            assert.strictEqual(oAuthToken, undefined);

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

describe('PitneyBowes.tracking', function() {
    this.timeout(5000);

    beforeEach(function() {
        // Clear existing token
        cache.del('pitney-bowes-oauth-token');
    });

    it('should return an error for invalid baseUrl', function(done) {
        const pitneyBowes = new PitneyBowes({
            baseUrl: 'invalid'
        });

        pitneyBowes.tracking({ trackingNumber: '4206336792748927005269000010615207' }, function(err, data) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/oauth/token"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(data, undefined);

            done();
        });
    });

    it('should return an error for invalid baseUrl', function(done) {
        var pitneyBowes = new PitneyBowes({
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        pitneyBowes.getOAuthToken(function(err) {
            assert.ifError(err);

            pitneyBowes = new PitneyBowes({
                baseUrl: 'invalid'
            });

            pitneyBowes.tracking({ trackingNumber: '4206336792748927005269000010615207' }, function(err, data) {
                assert(err);
                assert.strictEqual(err.message, 'Invalid URI "invalid/v1/tracking/4206336792748927005269000010615207?packageIdentifierType=TrackingNumber&carrier=USPS"');
                assert.strictEqual(err.status, undefined);
                assert.strictEqual(data, undefined);
    
                done();
            });
        });
    });

    it('should return an error for non 200 status code', function(done) {
        var pitneyBowes = new PitneyBowes({
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        pitneyBowes.getOAuthToken(function(err) {
            assert.ifError(err);

            pitneyBowes = new PitneyBowes({
                baseUrl: 'https://httpbin.org/status/500#'
            });

            pitneyBowes.tracking({ trackingNumber: '4206336792748927005269000010615207' }, function(err, data) {
                assert(err);
                assert.strictEqual(err.message, 'Internal Server Error');
                assert.strictEqual(err.status, 500);
                assert.strictEqual(data, undefined);
    
                done();
            });
        });
    });

    it('should return package status', function(done) {
        const pitneyBowes = new PitneyBowes({
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        pitneyBowes.tracking({ trackingNumber: '4206336792748927005269000010615207' }, function(err, data) {
            assert.ifError(err);
            assert(data);
            assert.strictEqual(data.trackingNumber, '4206336792748927005269000010615207');

            done();
        });
    });
});

describe('PitneyBowes.tlsTest', function() {
    this.timeout(5000);

    it('should return an error for invalid baseTestUrl', function(done) {
        const pitneyBowes = new PitneyBowes({
            baseTestUrl: 'invalid'
        });

        pitneyBowes.tlsTest(function(err, res) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/tlstest"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(res, undefined);

            done();
        });
    });

    it('should return an error for non 200 status code', function(done) {
        const pitneyBowes = new PitneyBowes({
            baseTestUrl: 'https://httpbin.org/status/500#'
        });

        pitneyBowes.tlsTest(function(err, data) {
            assert(err);
            assert.strictEqual(err.message, 'Internal Server Error');
            assert.strictEqual(err.status, 500);
            assert.strictEqual(data, undefined);

            done();
        });
    });

    it('should return TLS_Connection_Success', function(done) {
        const pitneyBowes = new PitneyBowes();

        pitneyBowes.tlsTest(function(err, res) {
            assert.ifError(err);
            assert.strictEqual(res, 'TLS_Connection_Success');

            done();
        });
    });
});