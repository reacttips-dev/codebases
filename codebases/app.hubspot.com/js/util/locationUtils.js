'use es6';

export var isFromLibrary = function isFromLibrary(location) {
  var query = location.query;
  return query && query.library && query.library === 'true';
};