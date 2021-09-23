'use es6';

import { formatToReferencesList } from '../lib/formatReferences';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import http from 'hub-http/clients/apiClient';
import indexBy from 'transmute/indexBy';
import pipe from 'transmute/pipe';
export var createGetProperties = function createGetProperties(_ref) {
  var httpClient = _ref.httpClient;
  return function (objectType) {
    return httpClient.get("inbounddb-io/properties/" + objectType).then(pipe(getIn([0, 'options']), formatToReferencesList({
      getId: get('value'),
      getLabel: get('label')
    }), indexBy(get('id'))));
  };
};
export var getProperties = createGetProperties({
  httpClient: http
});