
// Define the Feathers schema for service `nedb1`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'Nedb1',
  description: 'Nedb1 database.',
  // !end
  // !code: schema_definitions // !end

  // Required fields.
  required: [
    // !code: schema_required // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    id: { type: 'ID',  description: 'Description 1 generic cumulative' },
    _id: { type: 'ID',  description: 'Description 1 generic cumulative' },
    nedb2Id: { type: 'ID', description: 'Description 1 generic cumulative' },
    testObject: { type: 'object',
                  description: 'Description 1 generic cumulative object',
                  __schema: 'Testobject',
                  properties:{
                    name: { type: 'string', description: 'This is nested Object' }
                  } 
    },
    testString: { type: 'string', description: 'Description 1 generic cumulative string' },
    multiType: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    // !end
  },
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
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
