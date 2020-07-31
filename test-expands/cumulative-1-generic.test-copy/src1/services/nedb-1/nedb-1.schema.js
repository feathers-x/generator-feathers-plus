
// Define the Feathers schema for service `nedb1`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

let schema = {
  // !<DEFAULT> code: schema_header
  title: 'Nedb1',
  description: 'Nedb1 database.',
  // !end
  // !code: schema_definitions // !end
  required: [
    // !code: schema_required // !end
  ],
  properties: {
    // !code: schema_properties
    id: { type: 'ID',  description: 'Description 1 generic cumulative' },
    _id: { type: 'ID',  description: 'Description 1 generic cumulative' },
    nedb2Id: { type: 'ID', description: 'Description 1 generic cumulative' },
    testObject: { type: 'object',
                  description: 'Description 1 generic cumulative object',
                  addType: 'Testobject',
                  properties:{
                    name: { type: 'string', description: 'This is nested Object' }
                  } 
    },
    testArray: { type: 'array', items: { type: 'object',
                                         addType: 'TestArrayItems',
                                        properties: {
                                          stringProp: { type: 'string' },
                                          numberProp: { type: 'number' },
                                        }
                                      }
    },
    testArray2: { type: 'array', items: { type: 'object', createType : 'Testobject' }, description: 'TestArray2 Desc'},
    testString: { type: 'string', description: 'Description 1 generic cumulative string' },
    multiType: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    // !end
  },
  // !code: schema_more // !end
};

let extensions = {
  graphql: {
    // !code: graphql_header
    name: 'Nedb1',
    service: {
      sort: { _id: 1 },
    },
    // sql: {
    //   sqlTable: 'Nedb1',
    //   uniqueKey: '_id',
    //   sqlColumn: {
    //     __authorId__: '__author_id__',
    //   },
    // },
    // !end
    discard: [
      // !code: graphql_discard // !end
    ],
    add: {
      // !code: graphql_add
      nedb2: { type: 'Nedb2!', args: false, relation: { ourTable: 'nedb2Id', otherTable: '_id' }, description: 'Description 1 generic cumulative add' },
      // !end
    },
    // !code: graphql_more // !end
  },
};

// !code: more // !end

let moduleExports = {
  schema,
  extensions,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
