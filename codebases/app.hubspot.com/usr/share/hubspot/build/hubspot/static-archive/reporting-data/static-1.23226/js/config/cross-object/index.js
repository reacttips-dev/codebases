'use es6';

import * as checked from '../../lib/checked';
export var CrossObject = checked.record({
  dataTypes: checked.list().defaultValue([]),
  reportId: checked.any(),
  dashboardReportId: checked.any(),
  deduplicate: checked.boolean().optional(),
  filterBranch: checked.any()
}, 'CrossObject');