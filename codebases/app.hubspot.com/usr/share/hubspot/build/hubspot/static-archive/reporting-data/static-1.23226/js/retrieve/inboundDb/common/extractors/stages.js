'use es6';

import extractor from '../../../../config/extractor';
export default (function (allStages) {
  return extractor(function (config, missingValue) {
    var stages = config.getIn(['pipeline', 'stages']);

    if (stages && stages.size > 0) {
      return stages.filter(function (stage) {
        if (!allStages.contains(stage)) {
          return false;
        }

        return true;
      });
    }

    return missingValue;
  }, allStages);
});