'use es6';

export default function (query) {
  var timeFilter = query.getIn(['filterGroups', 0, 'filters']).find(function (filter) {
    return filter.property === 'hs_enrolled_at';
  });
  var enrolledByFilter = query.getIn(['filterGroups', 0, 'filters']).find(function (filter) {
    return filter.property === 'hs_enrolled_by';
  });
  var enrolledByValueExists = enrolledByFilter && enrolledByFilter.values && enrolledByFilter.values.length;
  return {
    start: timeFilter ? timeFilter.value : null,
    end: timeFilter ? timeFilter.highValue : null,
    enrolledBy: enrolledByValueExists ? enrolledByFilter.values[0] : null
  };
}