import * as commandLineArgs from 'command-line-args';

// Setup command line options
const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: 'development',
    type: String,
  },
]);

const envVariables = require(`../environments/${options.env}.env.json`);
for (const key in envVariables) {
  process.env[key] = envVariables[key];
}
