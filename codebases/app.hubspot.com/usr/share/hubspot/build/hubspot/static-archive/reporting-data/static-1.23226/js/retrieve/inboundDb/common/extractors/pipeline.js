'use es6';

import extractor from '../../../../config/extractor';
export default (function () {
  return extractor(function (config, missingValue) {
    var pipeline = config.getIn(['pipeline', 'id']);
    return pipeline || missingValue;
  }, 'default');
});