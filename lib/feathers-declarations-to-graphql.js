
const { camelCase, upperFirst } = require('lodash');
const { EOL } = require('os');

/*
 Extensions to JSON-schema:

   module.exports.schema = {
     properties: { id: { type: 'Id' } },
   };

   module.exports.decorators = {
     people: {
       graphql: {
         sort: { id: 1 },
         discard: [ 'mass', 'height' ],
         add: {
           fullName: { type: 'String!', resolver: parent => `${parent.firstName} ${parent.lastName}},
         }.
       },
     },
   };
 */

const DEFAULT_GRAPHQL_TYPE = 'String';
const DEFAULT_GRAPHQL_RESOLVER = () => null;

const typeConvert = {
  ID: 'ID', // our extension to JSON-schema
  string: 'String',
  integer: 'Int',
  number: 'Float',
  boolean: 'Boolean',
  object: '*****',
  array: '*****',
  null: 'String', // todo should we throw on encountering this?
};

module.exports = function (feathersSchemas, feathersExtensions, specsServices) {
  if (typeof feathersSchemas !== 'object' || feathersSchemas === null) {
    throw new Error(`Expected feathersSchema object. Got ${typeof feathersSchemas}`);
  }

  const typeSchemas = []; // GraphQL type declaration for every service
  const addResolvers = {}; // Resolvers for types in schemas
  const querySchemas = []; // Default GraphQL CRUD declaration for every service
  const queryResolvers = []; // Resolvers for default CRUD declarations

  const mapping = {
    graphql: {},
    feathers: {},
  };

  Object.keys(feathersSchemas).forEach(schemaName => {
    const feathersSchema = feathersSchemas[schemaName] || {};
    const feathersExtension = feathersExtensions[schemaName] || {};
    const graphql = feathersExtension.graphql || {};
    const specsService = specsServices[schemaName] || {};

    const graphqlName = graphql.name || convertToGraphQLSchemaName(schemaName);
    const defaultSort = graphql.sort;
    const moreParams = defaultSort ? `, { query: { $sort: ${JSON.stringify(defaultSort)} } }` : '';

    const added = graphql.add || {};
    const addedFields = Object.keys(added);

    if (addedFields.length) {
      const obj = addResolvers[graphqlName] = {};

      addedFields.forEach(field => {
        const addedField = added[field];

        console.log('>>>addedFields1', graphqlName, field, added);
        obj[field] = {
          type: addedField.type || DEFAULT_GRAPHQL_TYPE,
          args: convertArgs(addedField.args),
          resolver: addedField.resolver || DEFAULT_GRAPHQL_RESOLVER,
        };
        console.log('>>>addedFields2', obj[field]);
      });
    }

    typeSchemas.push([
      `type ${graphqlName} {`,
      feathersSchemaToGraphqlSchema(feathersSchema, feathersExtension),
      Object.keys(added).map(field =>
        `  ${field}${convertArgs(added[field].args)}: ${added[field].type || DEFAULT_GRAPHQL_TYPE}`
      ).join(EOL),
      '}',
      ' ',
    ].filter(str => str).join(EOL));

    querySchemas.push([
      `  get${graphqlName}(key: JSON, query: JSON, params: JSON): ${graphqlName}`,
      `  find${graphqlName}(query: JSON, params: JSON): [${graphqlName}]!`,
    ].join(EOL));

    queryResolvers.push([
      `      // get${graphqlName}(query: JSON, params: JSON, key: JSON): ${graphqlName}`,
      `      get${graphqlName}(parent, args, content, info) {`,
      '        const feathersParams = convertArgsToFeathers(args);',
      `        return options.services.${schemaName}.get(args.key, feathersParams).then(extractFirstItem);`,
      '      },',
      '',
      `      // find${graphqlName}(query: JSON, params: JSON): [${graphqlName}!]`,
      `      find${graphqlName}(parent, args, content, info) {`,
      `        const feathersParams = convertArgsToFeathers(args${moreParams});`,
      `        return options.services.${schemaName}.find(feathersParams).then(extractAllItems);`,
      '      },',
    ].join(EOL));

    mapping.graphql[graphqlName] = {
      feathers: schemaName,
      path: specsService.path,
    };

    mapping.feathers[schemaName] = {
      graphql: graphqlName,
      path: specsService.path,
    };
  });

  // Return results
  const schemas = [
    typeSchemas.join(EOL),
    '',
    'type Query {',
    querySchemas.join(EOL),
    '}',
  ].join(EOL);

  const resolvers = queryResolvers.join(EOL);

  return { schemas, resolvers, mapping, addResolvers };
};

// Convert the single Feathers schema {properties:{...},...}
function feathersSchemaToGraphqlSchema(feathersSchema, feathersExtension, depth = 1) {
  const leader = '  '.repeat(depth);
  const required = feathersSchema.required || [];
  const properties = feathersSchema.properties || {};
  const graphqlDiscard = (feathersExtension.graphql || {}).discard || [];

  const graphqlTypes = Object.keys(properties).map(name => {
    // Handle names discarded for GraphQL
    if (graphqlDiscard.indexOf(name) !== -1) return '';

    const property = properties[name];
    const req = required.indexOf(name) !== -1;

    let type = property.type || 'string';
    let array = false;

    // Handle nested object address: { type: 'object', required: [...], properties: {...} }
    if (type === 'object') {
      return [
        `${name}: {`,
        feathersSchemaToGraphqlSchema(property, feathersExtension, ++depth),
        `${leader}}`,
      ].join(EOL);
    }

    // Handle array of properties
    if (type === 'array') {
      const items = property.items || { type: 'string' };

      if (typeof items === 'object') {
        type = items.type || 'string';
        array = true;
      } else {
        throw new Error(`Property "${name}" is an array with an invalid "items".`);
      }
    }

    // Handle simple property
    return `${name}: ${array ? '[' : ''}${typeConvert[type.trim()]}${req ? '!' : ''}${array ? ']' : ''}`;
  });

  return leader + graphqlTypes.filter(prop => prop).join(`${EOL}${leader}`);
}

function convertToGraphQLSchemaName(name) {
  return upperFirst(camelCase(name));
}

function convertArgs(args) {
  if (typeof args === 'string') return `(${args})`;
  return args === false ? '' : '(query: JSON, params: JSON, key: JSON)';
}