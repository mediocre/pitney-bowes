const assert = require('assert');

const PitneyBowes = require('../index');

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