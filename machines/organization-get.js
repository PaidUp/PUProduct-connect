module.exports = {
  friendlyName: 'organization-get',
  description: 'get organizations to be part of paidUp',
  cacheable: false,
  sync: false,
  inputs: {
    baseUrl: {
      example: 'http://localhost:9007',
      description: 'Url microservice.',
      required: true
    },
    token: {
      example: 'secret-word',
      description: 'secret word for authenticate microservice.',
      required: true
    },
    organizationId: {
      example: 'xxxyyyxxxx',
      description: 'id organization.',
      required: true
    }
  },
  exits: {
    success: {
      variableName: 'response',
      description: 'The object represent a array of organizations info',
      example: {
        status: 200,
        body: {
          _id: 'xxx',
          ownerFirstName: 'John',
          ownerLastName: 'Due',
          ownerDOB: '12/12/1990',
          ownerEmail: 'austin@boom.com',
          ownerPhone: '1234567890',
          country: 'US',
          state: 'TX',
          city: 'Austin',
          zipCode: '12345',
          Address: 'calle fake',
          AddressLineTwo: '123',
          businessName: 'bname',
          businessType: 'Corporation',
          aba: '123456',
          dda: '000123456789',
          ownerId: 'userId',
          verify: 'pending',
          paymentId: 'xxx',
          referralCode: 'yyy',
          website: 'https://www.getpaidup.com'
        }
      }
    },
    error: {
      description: 'error unexpected',
      example: {
        status: 500,
        message: '[{"maybe some JSON": "like this"}]  (but could be any string)'
      }
    }

  },
  fn: function (inputs, exits) {
    var Connector = require('../core/common/connector')
    var url = '/api/v1/organization/' + inputs.organizationId

    var config = {
      url: url,
      baseUrl: inputs.baseUrl,
      method: 'get',
      token: inputs.token
    }
    Connector.request(config, {}, {}, function (err, resp) {
      if (err) {
        return exits.error({
          status: err.status,
          message: err.message.message || err.message
        })
      } else {
        return exits.success({
          status: 200,
          body: resp.body
        })
      }
    })
  }
}
