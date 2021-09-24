'use es6';

export function getHiddenNamespace(prefix) {
  var withPrefix = prefix ? prefix + "Hidden" : 'hidden';
  return withPrefix;
}