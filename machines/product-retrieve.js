module.exports = {


  friendlyName: 'product-retrieve',


  description: 'Retrieve product by Id',


  cacheable: false,


  sync: false,


  inputs: {
    baseUrl: {
      example: 'http://localhost:9002',
      description: 'Url microservice.',
      required: true
    },
    token: {
      example: 'secret-word',
      description: 'secret word for authenticate microservice.',
      required: true
    },
    productId: {
      example: '12',
      description: 'id product.',
      required: true
    }

  },


  exits: {

    success: {
      variableName: 'categories',
      description: 'List of categories.',
      example: `{
        status: 200,
        body: {
          "_id" : "someId",
          "details": {
            "organizationId": "105",
            "organizationName": "Team name",
            "organizationLocation": "Austin, TX",
            "sku": "XXXSKUTEAM",
            "name": "14U White",
            "description": "XXXXs - 14U Description",
            "startAt": "2016-01-01",
            "endAt": "2016-12-31",
            "location": "Austin, TX",
            "geojson": {},
            "visitbility": true,
            "status": true,
            "images": {main: 'someUrl'},
            "categories": [],
            "relatedProducts": []
          },
          "meta": {},
          "processingFees": {
            "cardFee": 2.9,
            "cardFeeActual": 2.9,
            "cardFeeFlat": 0.3,
            "cardFeeFlatActual": 0.3,
            "achFee": 0,
            "achFeeActual": 0,
            "achFeeFlat": 0,
            "achFeeFlatActual": 0
          },
          "collectionsFee": {
            "fee": 5,
            "feeFlat": 0
          },
          "paysFees": {
            "processing": true,
            "collections": true
          },
          "paymentPlans": {
            "due1": {
              "description": "Full payment",
              "visible": true,
              "dues": [
                {
                  "description": "some description",
                  "dateCharge": "2016-02-26 10:30",
                  "amount": 100,
                  "discount": 50,
                  "applyDiscount": false
                }
              ]
            }
          }
        }
      }`
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

    var Connector = require('../core/common/connector');
    var url = '/api/v1/commerce/catalog/product/' + inputs.productId;
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
          message: err.message
        })
      } else if (!resp.body.feeManagement) {
        return exits.error({
          status: 400,
          message: "Product dont have feeManagement"
        })
      }
      else {
        var today = new Date();
        var prodJson = JSON.parse(resp.body.feeManagement)
        prodJson._id = resp.body.productId;
        prodJson.details.images.main = resp.body.images[0].url;

        for (var key in prodJson.paymentPlans) {
          prodJson.paymentPlans[key].dues.forEach(function (ele, idx, arr) {
            var dc = new Date(ele.dateCharge)
            if (dc < today) {
              ele.dateCharge = today;
            } else {
              ele.dateCharge = dc;
            }
          });
        }

        return exits.success(JSON.stringify({
          status: 200,
          body: prodJson
        }))
      }
    })
  },
};
