// Simple macro for inferring a schema from a template,
// then coercing a variable to match that schema.
module.exports = function cast (template, data) {
  var rttc = require('../');
  return rttc.coerce(rttc.infer(template), data);
};
