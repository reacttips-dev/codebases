'use es6';

export function rewriteObjectPropertiesAsMap(graphQLObject) {
  if (!graphQLObject || !graphQLObject.properties || !graphQLObject.properties.length) {
    return graphQLObject;
  }

  var clonedObject = Object.assign({}, graphQLObject);
  clonedObject.properties = clonedObject.properties.reduce(function (acc, prop) {
    acc[prop.name] = prop;
    return acc;
  }, {});
  return clonedObject;
}