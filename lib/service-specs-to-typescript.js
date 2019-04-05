const { upperFirst, isEqual } = require('lodash');

const EOL = '\n';
const enumSuffix = 'Enum';

module.exports = function serviceSpecsToTypescript(specsService, feathersSpec, feathersExtension, generateTypeScriptEnums, reuseIdenticalEnums, typescriptGlobalEnumsArr, depth = 1, propertyPath = [], typescriptEnums = [], typescriptEnumsImports = new Set()) {
  const properties = feathersSpec.properties || {};
  const serviceName = feathersSpec.title || '';
  const typescriptTypes = [];
  const typescriptExtends = [];

  const { idName, idType } = feathersExtension.primaryKey;

  const schemaTypesToTypeScript = {
    ID: idType,
    integer: 'number',
  };
  const primitiveArrayTypes = ['string', 'number', 'boolean'];

  if (depth === 1) {
    propertyPath.unshift(serviceName);
  }

  Object.keys(properties).forEach(name => {
    const property = properties[name];
    if (name !== idName && (name === 'id' || name === '_id')) return;

    let subTypes, subTypesStr, arrayElementType, itemsType;
    switch (property.type) {
      case 'array':
        itemsType = property.items.type || undefined ;
        arrayElementType = 'any';

        if (primitiveArrayTypes.includes(itemsType)) {
          if (!!property.items.enum && !!property.items.enum.length && property.items.enum.length > 0) {
            const enumName = extractEnumsTypes(name, property.items.enum, typescriptGlobalEnumsArr, typescriptEnums, propertyPath, reuseIdenticalEnums);

            typescriptEnumsImports.add(enumName);
            arrayElementType = enumName;
          } else {
            arrayElementType = itemsType;
          }
        } else if ((itemsType === 'ID' || itemsType === idName) && primitiveArrayTypes.includes(idType)) {
          arrayElementType = idType;
        }

        typescriptTypes.push(`${name}: ${arrayElementType}[]`);
        break;
      case 'object':
        propertyPath.unshift(name);
        subTypes = serviceSpecsToTypescript(specsService, property, feathersExtension, generateTypeScriptEnums, reuseIdenticalEnums, typescriptGlobalEnumsArr, ++depth, propertyPath, typescriptEnums, typescriptEnumsImports);

        subTypesStr = subTypes.typescriptTypes.map(str => `  ${str}`).join(`;${EOL}`);
        typescriptTypes.push(`${name}: {${EOL}${subTypesStr}${EOL}}`);
        break;
      default:
        if (property.type !== 'ID') {
          if (property.type === 'string' && !!property.enum && !!property.enum.length && property.enum.length > 0) {
            const enumName = extractEnumsTypes(name, property.enum, typescriptGlobalEnumsArr, typescriptEnums, propertyPath, reuseIdenticalEnums);

            typescriptEnumsImports.add(enumName);
            typescriptTypes.push(`${name}: ${generateTypeScriptEnums ? enumName : property.type}`);
          } else {
            typescriptTypes.push(`${name}: ${schemaTypesToTypeScript[property.type] || property.type}`);
          }
        } else {
          typescriptTypes.push(`${name}: unknown`);
          typescriptExtends.push(`${name}: any`);
        }
        break;
    }
  });

  return { typescriptTypes, typescriptExtends, typescriptEnums, typescriptEnumsImports };
};

function extractEnumsTypes(name, propertyEnums, typescriptGlobalEnumsArr, typescriptEnums, propertyPath, reuseIdenticalEnums) {
  let enumName = `${upperFirst(name)}${enumSuffix}`;
  let enumValues = propertyEnums;

  let identicalEnumsInGlobalArrayByValues = typescriptGlobalEnumsArr.filter((enumItem => isEqual(enumItem.values, enumValues)));

  if (reuseIdenticalEnums && identicalEnumsInGlobalArrayByValues.length > 0) {
    enumName = identicalEnumsInGlobalArrayByValues[0].name;
  }

  let identicalEnumsInGlobalArray = typescriptGlobalEnumsArr.filter((enumItem => enumItem.name === enumName));

  if (identicalEnumsInGlobalArray.length === 0) {

    let identicalNewEnumsInArrayByValues = typescriptEnums.filter((enumItem => isEqual(enumItem.values, enumValues)));

    if (reuseIdenticalEnums && identicalNewEnumsInArrayByValues.length > 0) {
      enumName = identicalNewEnumsInArrayByValues[0].name
    }

    let identicalNewEnumsInArray = typescriptEnums.filter((enumItem => enumItem.name === enumName));

    if (identicalNewEnumsInArray.length === 0) {

      typescriptEnums.push({
        name: enumName,
        values: [...enumValues]
      });
    } else {
      enumName = handleExistingEnumInArray(identicalNewEnumsInArray, enumName, enumValues, propertyPath, typescriptEnums);
    }
  } else {
    enumName = handleExistingEnumInArray(identicalEnumsInGlobalArray, enumName, enumValues, propertyPath, typescriptEnums);
  }

  return enumName;
}

function handleExistingEnumInArray(identicalArray, enumName, enumValues, propertyPath, typescriptEnums) {
  identicalArray.forEach(enumItem => {
    if (!isEqual(enumItem.values, enumValues)) {
      let tryName = enumName;
      let breakLoop = false;

      for (i = 0; i < propertyPath.length; i++) {
        if (!breakLoop) {
          tryName = `${upperFirst(propertyPath[i])}${tryName}`;
          let identicalNewEnumsInArray = typescriptEnums.filter((enumItem => enumItem.name === tryName));

          if (identicalNewEnumsInArray.length === 0) {
            typescriptEnums.push({
              name: tryName,
              values: [...enumValues]
            });

            enumName = tryName;
            breakLoop = true;
          } else {
            identicalNewEnumsInArray.forEach(enumItem => {
              if (isEqual(enumItem.values, enumValues)) {
                enumName = enumItem.name;
                breakLoop = true;
              }
            });
          }
        }
      }
    }
  });

  return enumName;
}
