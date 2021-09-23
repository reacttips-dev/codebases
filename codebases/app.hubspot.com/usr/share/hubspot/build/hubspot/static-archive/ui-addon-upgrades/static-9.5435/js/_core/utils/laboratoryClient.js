'use es6';

import httpNoAuth from 'hub-http/clients/noAuthApiClient';
import { getFullUrl } from 'hubspot-url-utils';
import { memoize } from '../../utils';

function adaptTreatment() {
  var treatment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var parameters = treatment.parameters.reduce(function (acc, _ref) {
    var key = _ref.key,
        value = _ref.value;
    acc[key] = value;
    return acc;
  }, {});
  return Object.assign({}, treatment, {
    parameters: parameters
  });
}

export var fetchTreatment = memoize(function (key, identifier) {
  return httpNoAuth.get(getFullUrl('api') + "/treatments/v2/get/" + key + "/" + identifier).then(adaptTreatment);
});
export var logExposure = memoize(function (key, identifier) {
  return httpNoAuth.post(getFullUrl('api') + "/treatments/v2/exposure/log", {
    data: {
      key: key,
      identifier: identifier
    }
  });
});