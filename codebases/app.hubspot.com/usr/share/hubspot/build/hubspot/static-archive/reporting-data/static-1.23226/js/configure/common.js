'use es6';

var configureEntries = function configureEntries(mapping) {
  return function (entries) {
    return entries.map(function (entry) {
      var property = entry.get('property');
      return mapping.has(property) ? entry.set('property', mapping.get(property)) : entry;
    });
  };
};

export var configureMetrics = function configureMetrics(mapping) {
  return function (config) {
    return config.updateIn(['metrics'], configureEntries(mapping));
  };
};
export var configureFilters = function configureFilters(mapping) {
  return function (config) {
    return config.updateIn(['filters', 'custom'], configureEntries(mapping));
  };
};