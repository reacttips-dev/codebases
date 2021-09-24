'use es6';

import { SequenceSearchFilter } from 'SequencesUI/records/SequenceSearchQuery';
import dateRangeToStartAndEnd from './dateRangeToStartAndEnd';
export default function (dateRange) {
  var _dateRangeToStartAndE = dateRangeToStartAndEnd(dateRange),
      start = _dateRangeToStartAndE.start,
      end = _dateRangeToStartAndE.end; // Sequences search currently requires BOTH start and end


  if (!start || !end) {
    return null;
  }

  return new SequenceSearchFilter({
    property: 'hs_enrolled_at',
    operator: 'BETWEEN',
    value: start,
    highValue: end
  });
}