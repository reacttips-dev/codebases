'use es6';

import { fromJS, List } from 'immutable';
import get from 'transmute/get';
import pick from 'transmute/pick';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
var INTEGRATION_NAME = 'integrationName';
var pickIntegrationName = pick([INTEGRATION_NAME]);
var getIntegrationName = get(INTEGRATION_NAME);
var getAppId = get('appId');
var getError = get('error');

var formatReferencedObject = function formatReferencedObject(item) {
  return fromJS(getError(item) ? null : pickIntegrationName(item));
};

var formatLabel = function formatLabel(item) {
  return getError(item) ? String(getAppId(item)) : getIntegrationName(item);
};

export default (function (integrationNameResponses) {
  return List(integrationNameResponses.map(function (item) {
    return item ? new ReferenceRecord({
      id: String(getAppId(item)),
      label: formatLabel(item),
      referencedObject: formatReferencedObject(item)
    }) : null;
  }));
});