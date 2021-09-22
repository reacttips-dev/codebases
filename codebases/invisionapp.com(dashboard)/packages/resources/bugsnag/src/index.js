const bugsnag = require('./bugsnag');
const createRuntimeProvidedResource = require('../../../runtime-tools/src/create-runtime-provided-resource');

createRuntimeProvidedResource({
  name: 'bugsnag',
  getResourceInterface: function () {
    return bugsnag;
  },
});
