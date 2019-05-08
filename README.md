# pitney-bowes

[![Build Status](https://travis-ci.org/mediocre/pitney-bowes.svg?branch=master)](https://travis-ci.org/mediocre/pitney-bowes)
[![Coverage Status](https://coveralls.io/repos/github/mediocre/pitney-bowes/badge.svg?branch=master)](https://coveralls.io/github/mediocre/pitney-bowes?branch=master)

The Pitney Bowes Complete Shipping APIs let you integrate shipping services from multiple carriers, including USPS® and Newgistics®, into your services and applications. 

https://shipping.pitneybowes.com

## Usage

```javascript
const PitneyBowes = require('pitney-bowes');

const pitneyBowes = new PitneyBowes({
    api_key: 'your_api_key',
    api_secret: 'your_api_secret',
    baseUrl: 'https://api-sandbox.pitneybowes.com/shippingservices'
});
```

### pitneyBowes.getOAuthToken(callback)

Each request to the PB Complete Shipping APIs requires authentication via an OAuth token. This API call generates the OAuth token based on the Base64-encoded value of the API key and secret associated with your PB Complete Shipping APIs developer account. The token expires after 10 hours, after which you must create a new one.

**Example**

```javascript
pitneyBowes.getOAuthToken(function(err, oAuthToken) {
    console.log(oAuthToken);
});
```

### pitneyBowes.tracking(args, callback)

Shipment labels that are printed using the PB Complete Shipping APIs are automatically tracked. This operation retrieves package status for a label.

**Example**

```javascript
pitneyBowes.tracking({ trackingNumber: 'trackingNumber' }, function(err, data) {
    console.log(data);
});
```

### pitneyBowes.tlsTest(callback)

The minimum supported security protocol for connection to the PB Complete Shipping APIs is TLS v1.2. To test whether your servers support TLS v1.2: From your servers, issue the following operation. The operation retrieves a resource that accepts only the TLS v1.2 protocol:

**Example**

```javascript
pitneyBowes.tlsTest(function(err, res) {
    console.log(res);
});
```

### pitneyBowes.validateAddress(args, callback)

Address validation verifies and cleanses postal addresses within the United States to help ensure packages are rated accurately and shipments arrive at their final destinations on time. The Validate Address operation sends an address to be verified. The response indicates whether the address is valid and whether the validation check made changes to the address.

**Example**

```javascript
const address = {
    addressLines: [
        '1600 Pennsylvania Avenue NW'
    ],
    cityTown: 'Washington',
    stateProvince: 'DC',
    postalCode: '20500 ',
    countryCode: 'US',
    company: 'Pitney Bowes Inc.',
    name: 'John Doe',
    phone: '203-000-0000',
    email: 'john.d@example.com'
};

pitneyBowes.validateAddress({ address, minimalAddressValidation: false }, function(err, data) {
    console.log(data);
});
```