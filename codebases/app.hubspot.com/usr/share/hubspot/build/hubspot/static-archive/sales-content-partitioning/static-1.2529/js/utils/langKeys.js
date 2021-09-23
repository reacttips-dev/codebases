'use es6';

import * as ContentTypes from 'sales-content-partitioning/constants/ContentTypes';
export var getContentTypeKey = function getContentTypeKey(objectType) {
  return ContentTypes[objectType];
};