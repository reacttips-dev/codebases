'use es6';

export function isObjectEmpty(object) {
  return Object.keys(object).length === 0;
}
export function generateId(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.random().toFixed(10).substr(2);
}