module.exports = function (generator, envName) {
  const { _specs: specs } = generator;
  const config = specs.options.ts ? {
    env: {
      NODE_ENV: envName
    },
    watch: [
      'tsconfig.json',
      'tslint.json',
      `${specs.app.src}/**/*.ts`
    ],
    execMap: {
      ts: 'ts-node --files --typeCheck'
    },
    events: {
      restart: 'tslint -p tsconfig.json -c tslint.json'
    }
  } : {
    env: {
      NODE_ENV: envName
    },
    events: {
      start: `eslint ${secs.app.src}/. test/. --config .eslintrc.json`,
      restart: `eslint ${secs.app.src}/. test/. --config .eslintrc.json`
    }
  };
  return config;
};
