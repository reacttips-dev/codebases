'use es6';

import { List } from 'immutable';
import { SequenceSearchSort, SequenceSearchQuery } from 'SequencesUI/records/SequenceSearchQuery';
var PAGE_SIZE = 5;
export default function (filterGroups) {
  return new SequenceSearchQuery({
    count: PAGE_SIZE,
    offset: 0,
    filterGroups: filterGroups,
    sorts: List([new SequenceSearchSort({
      property: 'hs_email_open_count',
      order: 'DESC'
    }), new SequenceSearchSort({
      property: 'hs_enrollment_id',
      order: 'DESC'
    })])
  });
}