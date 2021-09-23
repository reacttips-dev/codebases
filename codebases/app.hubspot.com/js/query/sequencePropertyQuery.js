'use es6';

import { registerQuery } from 'data-fetching-client';
import { fetchProperties } from '../api/CRMSearchApi';
export var GET_SEQUENCE_ENROLLMENT_PROPERTIES = registerQuery({
  fieldName: 'sequenceProperties',
  fetcher: function fetcher() {
    return fetchProperties();
  }
});