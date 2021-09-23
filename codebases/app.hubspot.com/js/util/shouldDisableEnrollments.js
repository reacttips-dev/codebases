'use es6';

import * as EnrollHealthStatusTypes from 'SequencesUI/constants/EnrollHealthStatusTypes';
export default (function (enrollHealthStatus) {
  return enrollHealthStatus.get('status') === EnrollHealthStatusTypes.DISABLED;
});