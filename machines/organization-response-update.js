module.exports = {
  friendlyName: 'organization-response-update',
  description: 'authorizate new organizations to be part of paidUp',
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
    },
    paymentId: {
      example: 'xxxyyyxxxx',
      description: 'id payment service (stripe, paypal).',
      required: true
    }
  },
  exits: {
    success: {
      variableName: 'response',
      description: 'boolean. if the process is true, then all is ok. otherwise false',
      example: {
        status: 200,
        body: {
          ok: 1,
          nModified: 1,
          n: 1
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
    var url = '/api/v1/organization/response/' + inputs.organizationId + '/' + inputs.paymentId
    var config = {
      url: url,
      baseUrl: inputs.baseUrl,
      method: 'put',
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
  },
}
