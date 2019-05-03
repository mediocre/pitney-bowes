# pitney-bowes

[![Build Status](https://travis-ci.org/mediocre/pitney-bowes.svg?branch=master)](https://travis-ci.org/mediocre/pitney-bowes)
[![Coverage Status](https://coveralls.io/repos/github/mediocre/pitney-bowes/badge.svg?branch=master)](https://coveralls.io/github/mediocre/pitney-bowes?branch=master)

The Pitney Bowes Complete Shipping APIs let you integrate shipping services from multiple carriers, including USPS® and Newgistics®, into your services and applications.

## Usage

```javascript
const PitneyBowes = require('pitney-bowes');

var pitneyBowes = new PitneyBowes();
```

### pitneyBowes.tlsTest()

The minimum supported security protocol for connection to the PB Complete Shipping APIs is TLS v1.2. To test whether your servers support TLS v1.2: From your servers, issue the following operation. The operation retrieves a resource that accepts only the TLS v1.2 protocol:

**Example**

```javascript
pitneyBowes.tlsTest(function(err, res) {
    console.log(res);
});
```