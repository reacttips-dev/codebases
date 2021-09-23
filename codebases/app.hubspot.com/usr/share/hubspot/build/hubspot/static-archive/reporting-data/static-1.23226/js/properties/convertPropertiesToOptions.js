'use es6';

export default (function (properties) {
  return properties.map(function (property) {
    return property.set('value', property.get('name')).remove('name');
  });
});