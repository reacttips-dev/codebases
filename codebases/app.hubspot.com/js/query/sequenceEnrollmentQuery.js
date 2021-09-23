'use es6';

import { registerQuery } from 'data-fetching-client';
import { fetchCRMObjects } from '../api/CRMSearchApi';
import { SEQUENCE_ENROLLMENT } from 'SequencesUI/constants/CRMSearchConstants';
export var GET_SEQUENCE_ENROLLMENTS = registerQuery({
  fieldName: 'sequenceEnrollments',
  args: ['query'],
  fetcher: function fetcher(_ref) {
    var query = _ref.query;
    return fetchCRMObjects(SEQUENCE_ENROLLMENT, query);
  }
});