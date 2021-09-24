'use es6';

import * as dateRangePresets from 'UIComponents/dates/dateRangePresets';
var emptyDateRange = {
  startDate: null,
  endDate: null
};
export default function (type) {
  if (!type || type === 'CUSTOM') {
    return emptyDateRange;
  }

  var preset = dateRangePresets[type];
  return preset ? Object.assign({
    presetId: type
  }, preset.getValue('portalTz')) : emptyDateRange;
}