
/* eslint quotes: 0 */
// Defines the MongoDB $jsonSchema for service `nedb1`. (Can be re-generated.)
const merge = require('lodash.merge');
// !code: imports // !end
// !code: init // !end

let moduleExports = merge({},
  // !<DEFAULT> code: model
  {
    bsonType: "object",
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: "objectId"
      },
      nedb2Id: {
        bsonType: "objectId"
      },
      testObject: {
        bsonType: "object",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          name: {
            bsonType: "string"
          }
        }
      },
      testArray: {
        items: {
          type: "object",
          __addType: "TestArrayItems",
          properties: {
            stringProp: {
              type: "string"
            },
            numberProp: {
              type: "number"
            }
          }
        },
        bsonType: "array"
      },
      testArray2: {
        items: {
          type: "object",
          graphType: "Testobject"
        },
        bsonType: "array"
      },
      testString: {
        bsonType: "string"
      },
      multiType: {
        bsonType: "number"
      }
    }
  },
  // !end
  // !code: moduleExports // !end
);

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
