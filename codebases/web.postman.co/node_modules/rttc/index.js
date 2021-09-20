module.exports = {
  validate: require('./lib/validate'),
  validateStrict: require('./lib/validate-strict'),
  coerce: require('./lib/coerce'),
  infer: require('./lib/infer'),
  isEqual: require('./lib/is-equal'),
  stringify: require('./lib/stringify'),
  parse: require('./lib/parse'),
  parseHuman: require('./lib/parse-human'),
  stringifyHuman: require('./lib/stringify-human'),
  hydrate: require('./lib/hydrate'),
  dehydrate: require('./lib/dehydrate'),
  compile: require('./lib/compile'),
  sample: require('./lib/sample'),
  getDefaultExemplar: require('./lib/get-default-exemplar'),
  getDisplayType: require('./lib/get-display-type'),
  getRdt: require('./lib/get-rdt'),
  isSpecific: require('./lib/is-specific'),
  isInvalidExample: require('./lib/is-invalid-example'),
  reify: require('./lib/reify'),
  intersection: require('./lib/intersection'),
  union: require('./lib/union'),
  getPathInfo: require('./lib/get-path-info'),
  getBaseVal: require('./lib/get-base-val'),
  coerceExemplar: require('./lib/coerce-exemplar'),
  getPatternFromExemplar: require('./lib/get-pattern-from-exemplar'),
  cast: require('./lib/cast'),
  rebuild: require('./lib/rebuild'),
  getDisplayTypeLabel: require('./lib/get-display-type-label'),
  getNounPhrase: require('./lib/get-noun-phrase'),
  GRAMMAR: require('./lib/GRAMMAR'),
  getInvalidityMessage: require('./lib/get-invalidity-message'),
  inferDisplayType: require('./lib/infer-display-type'),
  validateExemplarStrict: require('./lib/validate-exemplar-strict'),
};


// Backwards compatibility
module.exports.encode = module.exports.stringify;
module.exports.decode = module.exports.parse;
module.exports.typeInfo = require('./lib/type-info');
module.exports.inspect = module.exports.compile;
module.exports.exemplar = module.exports.getDefaultExemplar;
module.exports.isStrictType = module.exports.isSpecific;
