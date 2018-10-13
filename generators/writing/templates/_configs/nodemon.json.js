module.exports = function (generator, envName) {
  const { _specs: specs } = generator;
  const config = {
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
  };
  return config;
};
