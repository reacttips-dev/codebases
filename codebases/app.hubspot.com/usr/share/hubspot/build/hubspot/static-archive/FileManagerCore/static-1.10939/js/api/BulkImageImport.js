'use es6';

import http from 'hub-http/clients/apiClient';
var BASE_URI = 'cms-page-importer/v1';
var IMAGES_URI = BASE_URI + "/images";
var IMPORT_URI = IMAGES_URI + "/import";
export var postCrawlURIForImages = function postCrawlURIForImages(options) {
  return http.post(IMAGES_URI, {
    data: options
  });
};
export var getCrawlURIResultsForImages = function getCrawlURIResultsForImages(_ref) {
  var id = _ref.id;
  return http.getWithResponse(IMAGES_URI + "/" + id);
};
export var postImportImages = function postImportImages(options) {
  return http.post(IMPORT_URI, {
    data: options
  });
};
export var getImportImages = function getImportImages(_ref2) {
  var id = _ref2.id;
  return http.getWithResponse(IMPORT_URI + "/" + id);
};