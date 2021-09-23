'use es6';

import { isMigratedObjectTypeId } from '../rewrite/init/utils/isMigratedObjectTypeId';
import { parseObjectTypeIdFromPath } from '../rewrite/init/utils/parseObjectTypeIdFromPath';
var pathname = window.location.pathname;
var objectTypeId = parseObjectTypeIdFromPath(pathname);

if (!isMigratedObjectTypeId(objectTypeId)) {
  window.quickFetch.makeEarlyRequest('object-type-definitions-fetch', {
    url: window.quickFetch.getApiUrl('/inbounddb-meta/v1/object-types/for-portal'),
    timeout: 15000,
    dataType: 'json',
    contentType: 'application/json',
    type: 'GET'
  });
}