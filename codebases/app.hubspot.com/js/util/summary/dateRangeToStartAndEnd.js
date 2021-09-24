'use es6';

import { toMomentPortalTz } from 'UIComponents/core/SimpleDate';
export default function (dateRange) {
  if (!dateRange) {
    return {
      start: null,
      end: null
    };
  }

  return {
    start: dateRange.startDate ? toMomentPortalTz(dateRange.startDate).startOf('day').valueOf() : null,
    end: dateRange.endDate ? toMomentPortalTz(dateRange.endDate).endOf('day').valueOf() : null
  };
}