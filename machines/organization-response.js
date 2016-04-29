module.exports = {
  friendlyName: 'organization-response',
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
    }
  },
  exits: {
    success: {
      variableName: 'response',
      description: 'boolean. if the process is true, then all is ok.',
      example: {
        status: 200,
        body: {
          'response': true
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
    var url = '/api/v1/organization/response/' + inputs.productId
    var config = {
      url: url,
      baseUrl: inputs.baseUrl,
      method: 'get',
      token: inputs.token
    }
    Connector.request(config, {}, {}, function (err, resp) {
      console.log('err', err)
      console.log('resp', resp)
      if (err) {
        return exits.error({
          status: err.status,
          message: err.message
        })
      } else {
        return exits.success({
          status: 200,
          body: resp
        })
      }
    })
  },
}
