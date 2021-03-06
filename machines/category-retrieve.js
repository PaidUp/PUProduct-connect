module.exports = {
  
  
    friendlyName: 'category-retrieve',
  
  
    description: 'Retrieve categories of products',
  
  
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
      }
  
    },
  
  
    exits: {
  
      success: {
        variableName: 'categories',
        description: 'List of categories.',
        example: `{
            status: 200,
            body: [
              {
                "_id": "105",
                "name": "Team name",
                "description": "some desc",
                "company": "105",
                "image": "http://localhost:8888/media//catalog/product/n/t/xxxxx.png",
                "isActive": true,
                "location": "Austin, TX",
                "products": [
                  {
                    "_id":"ID",
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
                      "images": {main:'someUrl'},
                      "categories": [],
                      "relatedProducts": []
                    },
                    "meta": {},
                    "processingFees": {
                      "cardFeeDisplay": 2.9,
                      "cardFeeActual": 2.9,
                      "cardFeeFlatDisplay": 0.3,
                      "cardFeeFlatActual": 0.3,
                      "achFeeDisplay": 0,
                      "achFeeActual": 0,
                      "achFeeFlatDisplay": 0,
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
                ]
              }
            ]
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
  
      var config = {
        url: '/api/v2/commerce/catalog/category/3',
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
        } else {
  
          var result = [];
          var categories = resp.body;
          var today = new Date();
          categories.map(function (cat) {
  
            try {
              if (cat.mediaGallery.images[0]) {
                var category = {
                  _id: cat.entityId,
                  name: cat.name,
                  description: cat.description,
                  company: cat.entityId,
                  image: '/api/v1/media/image/magento?file='+cat.mediaGallery.images[0].file,
                  isActive: cat.status == "1",
                  location: cat.location,
                  products: []
                }
                cat.simpleProducts.map(function (prod) {
                  if (prod.feeManagement) {
                    var prodJson = JSON.parse(prod.feeManagement);
                    prodJson.details.images.main = '/api/v1/media/image/magento?file='+prod.mediaGallery.images[0].file;
                    prodJson._id = prod.entityId;
  
  
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
  
                    category.products.push(prodJson);
                  }
                });
                result.push(category);
              }
            } catch (err) {
              console.log(err)
            }
          });
          return exits.success(JSON.stringify({
            status: resp.status,
            body: result
          }))
        }
      })
    },
  };
  