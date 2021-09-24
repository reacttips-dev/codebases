'use es6';

export default (function (obj, idAttribute) {
  return {
    id: obj[idAttribute],
    get: function get(propertyName) {
      return obj[propertyName];
    },
    toJSON: function toJSON() {
      return Object.assign({}, obj);
    }
  };
});