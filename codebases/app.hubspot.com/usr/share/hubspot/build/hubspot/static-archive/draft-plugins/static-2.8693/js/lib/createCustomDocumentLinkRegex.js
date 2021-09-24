'use es6';

export default (function () {
  return new RegExp('\\{\\{\\s?(custom\\.documentlink_id_(\\d+)_skipform_(true|false))\\s?\\}\\}', 'gi');
});