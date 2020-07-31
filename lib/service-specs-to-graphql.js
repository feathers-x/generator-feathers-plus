
const EOL = '\n';
let nestedSchemas = []; // Nested Object Types
const schemaTypeToGraphql = {
  // todo id: 'ID', // our extension to JSON-schema
  ID: 'ID', // our extension to JSON-schema
  string: 'String',
  integer: 'Int',
  number: 'Float',
  boolean: 'Boolean',
  object: 'JSON',
  array: 'JSON',
  null: 'String' // todo should we throw on encountering this?
};

module.exports = function serviceSpecsToGraphql (feathersSchemas) {
  const fieldSchemas = []; // GraphQL field declarations for every service
  const querySchemas = []; // Default GraphQL CRUD declarations for every service
  
  Object.keys(feathersSchemas).forEach(schemaName => {
    const feathersExtensions = feathersSchemas[schemaName]._extensions;
    const graphqlExt = feathersExtensions.graphql;

    const add = graphqlExt.add;
    const graphqlName = graphqlExt.name;

    if (!feathersExtensions._ifGraphql || !graphqlName || (!graphqlExt.service && !graphqlExt.sql)) return;

    fieldSchemas.push([
      `# ${feathersSchemas[schemaName].description}${EOL}` +
      `type ${graphqlName} {`,
      feathersSchemaToGraphqlSchema(feathersSchemas[schemaName], feathersSchemas[schemaName]._extensions),
      Object.keys(add).map(field => {
        let description;
        if (add[field].description) {
          description = `  # ${add[field].description}${EOL}`;
        }
        if(add[field].createType){
           debugger
          nestedSchemas.push(`# ${add[field].description || add[field].type}`);
          nestedSchemas.push(`type ${add[field].type} {${EOL}${objectToSchema(add[field].createType)}${EOL}}`);
         }


        return `${description || ''}  ${field}${add[field].args}: ${add[field].type}`;
      }

      ).join(EOL),
      '}',
      ' '
    ].filter(str => str).join(EOL));
    querySchemas.push([
      `  get${graphqlName}(key: JSON, query: JSON, params: JSON): ${graphqlName}`,
      `  find${graphqlName}(query: JSON, params: JSON): [${graphqlName}]!`
    ].join(EOL));
  });

  nestedSchemas.map(schema=>schema.type)
  if(nestedSchemas.length){
    nestedSchemas.forEach(e=>fieldSchemas.push(e))
    console.log([
      fieldSchemas.join(EOL),
      '',
      'type Query {',
      querySchemas.join(EOL),
      '}'
    ].join(EOL))
    debugger
  }
  
  // Return results
  return [
    fieldSchemas.join(EOL),
    '',
    'type Query {',
    querySchemas.join(EOL),
    '}'
  ].join(EOL);
};

// convert singular Object to GraphQL schema 
function objectToSchema(object){
  const scalarTypes = [];
  const leader = '  '.repeat(1);
  const {properties = []} = object;

  Object.keys(properties).map((name)=>{
    if (properties[name].description) {
      scalarTypes.push(`# ${properties[name].description}`);
    }
    const property = properties[name];
    let type = property.type || 'string';
    let array = false;

    return scalarTypes.push(`${name}: ${schemaTypeToGraphql[type]}`);
  })

 return leader + scalarTypes.filter(prop => prop).join(`${EOL}${leader}`);
}

// Convert the single Feathers schema { properties: {...}, ... }
function feathersSchemaToGraphqlSchema (feathersSchema, feathersExtension, depth = 1) {
  const scalarTypes = [];
  const leader = '  '.repeat(depth);
  const required = feathersSchema.required || [];
  const properties = feathersSchema.properties || {};
  const graphqlDiscard = (feathersExtension.graphql || {}).discard || [];

  const graphqlTypes = Object.keys(properties).map(name => {
    // Handle names discarded for GraphQL
    if (graphqlDiscard.indexOf(name) !== -1) return '';
    // Add descriptions for fields
    if (properties[name].description) {
      scalarTypes.push(`# ${properties[name].description}`);
    }

    const property = properties[name];
    const req = required.indexOf(name) !== -1;
    let items = property.items || { type: 'string' };
    let type = property.type || 'string';
    let array = false;

    // Handle nested object address: { type: 'object', required: [...], properties: {...} }
    if (type === 'object') {
      if(property.addType){
         nestedSchemas.push(`# ${property.description ? 
          property.description : 'JSON'}${EOL}type ${property.addType} {${EOL}${objectToSchema(property)}${EOL}}`);
      }
      return scalarTypes.push(`${name}: ${property.addType ? property.addType : schemaTypeToGraphql.object}`);
    }

    // Handle array of properties
    if (type === 'array') {
      type = items.type || 'string';

      if (typeof items === 'object') {
      
        if(items.type === 'object' && items.addType){
          // TODO WRITE new Type to GraphQl Schema
        }
        array = true;
      } else {
        throw new Error(`Property "${name}" is an array with an invalid "items".`);
      }
    }

    scalarTypes.push(`${name}: ${array ? '[' : ''}${!items.createType ? schemaTypeToGraphql[type.trim()] : items.createType}${req ? '!' : ''}${array ? ']' : ''}`);
    // Handle simple property
    return `${name}: ${array ? '[' : ''}${schemaTypeToGraphql[type.trim()]}${req ? '!' : ''}${array ? ']' : ''}`;
  });
  return leader + scalarTypes.filter(prop => prop).join(`${EOL}${leader}`);
}
