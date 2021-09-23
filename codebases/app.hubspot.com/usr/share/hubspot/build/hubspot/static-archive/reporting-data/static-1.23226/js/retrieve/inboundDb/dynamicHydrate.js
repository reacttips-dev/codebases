'use es6'; // This allows us to support Webpack 3 and 4.
// Once all apps are on Webpack 4, this import can be simplified
// https://product.hubteam.com/docs/frontend/kb/webpack4.html

var getImport = function getImport(imported) {
  if (imported.default) return imported.default;
  return imported;
};

export function hydrate(dataType, ids, config) {
  return import(
  /* webpackChunkName: "reporting-data__inboundDb" */
  './hydrate').then(getImport).then(function (method) {
    return method(dataType, ids, config);
  });
}