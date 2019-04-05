const makeDebug = require('debug');
const { camelCase } = require('lodash');

const { generatorFs } = require('./generator-fs');

const debug = makeDebug('generator-feathers-plus:writing:generate-enum-typing');

module.exports = function generateEnumTyping (generator, specs, context, state, typescriptEnums) {
  debug('generateEnumTyping()');

  const {
    isJs,
    EOL,
  } = context;

  const {
    tmpl,
    enumPath,
    libDir,
    WRITE_ALWAYS,
  } = state;

  const context1 = Object.assign({}, context, {
    libDirectory: specs.app.src
  });

  let typescriptEnumsTemplates = [];

  typescriptEnums.forEach((enumItem, index, arr) => {
    let template = `export enum ${enumItem.name} {${EOL}`;

    enumItem.values.forEach(value => {
      template += `  ${camelCase(value)} = '${value}',${EOL}`
    });

    template += `}${Object.is(arr.length - 1, index) ? '' : EOL }`;

    typescriptEnumsTemplates.push(template);
  });

  context1.typescriptEnumsStr = typescriptEnumsTemplates;

  const todos = [
    tmpl([enumPath, 'enums.ejs'], [libDir,  'models', `enums.ts`], WRITE_ALWAYS, isJs ),
  ];

  // Generate modules
  generatorFs(generator, context1, todos);
}
