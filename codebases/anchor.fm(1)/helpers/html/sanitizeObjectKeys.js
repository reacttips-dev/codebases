const { sanitizeHtml } = require('./sanitizeHtml');
const { stripHtml } = require('./stripHtml');

function sanitizeObjectKeys(object, { sanitizedKeys = [], strippedKeys = [] }) {
  if (!object) {
    return object;
  }
  const sanitizedObject = {};
  for (const key of sanitizedKeys) {
    const value = object[key];
    if (typeof value === 'string') {
      sanitizedObject[key] = sanitizeHtml(value);
    }
  }
  const strippedObject = {};
  for (const key of strippedKeys) {
    const value = object[key];
    if (typeof value === 'string') {
      strippedObject[key] = stripHtml(value);
    }
  }
  return Object.assign({}, object, sanitizedObject, strippedObject);
}

module.exports = {
  sanitizeObjectKeys,
};
