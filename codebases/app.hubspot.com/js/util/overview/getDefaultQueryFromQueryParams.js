'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Map as ImmutableMap, List, OrderedSet } from 'immutable';
import compose from 'transmute/compose';
import { SequenceSearchFilter, SequenceSearchQuery, SequenceSearchSort } from 'SequencesUI/records/SequenceSearchQuery';
import dateRangeToStartAndEnd from 'SequencesUI/util/summary/dateRangeToStartAndEnd';
import { getFiltersForSelection, mergeEngagementFilters } from 'SequencesUI/util/enrollmentEngagementFilters';
import UserContainer from '../../data/UserContainer';
import EnrolledByAll from '../../constants/EnrolledByAll';

var dateRangeToSequenceFilter = function dateRangeToSequenceFilter(dateRange) {
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
};

export var getEnrolledByValueFromQueryParam = function getEnrolledByValueFromQueryParam(enrolledByParam) {
  if (!enrolledByParam) {
    return [UserContainer.get().user_id.toString()];
  } else if (enrolledByParam === EnrolledByAll) {
    return null;
  }

  return Array.isArray(enrolledByParam) ? enrolledByParam : [enrolledByParam];
};

var addEnrolledByIfExists = function addEnrolledByIfExists(enrolledBy) {
  return function (filters) {
    if (!enrolledBy) {
      return filters;
    }

    var values = Array.isArray(enrolledBy) ? _toConsumableArray(enrolledBy) : [enrolledBy];
    return filters.push(new SequenceSearchFilter({
      property: 'hs_enrolled_by',
      values: values
    }));
  };
};

var addEnrolledAtIfExists = function addEnrolledAtIfExists(enrolledAtRange) {
  return function (filters) {
    var enrolledAtFilter = dateRangeToSequenceFilter(enrolledAtRange);
    return enrolledAtFilter ? filters.push(enrolledAtFilter) : filters;
  };
};

var addSequenceIdIfExists = function addSequenceIdIfExists(sequenceId) {
  return function (filters) {
    return sequenceId ? filters.push(new SequenceSearchFilter({
      property: 'hs_sequence_id',
      operator: 'EQ',
      value: sequenceId
    })) : filters;
  };
};

var addCompanyIdIfExists = function addCompanyIdIfExists(companyId) {
  return function (filters) {
    return companyId ? filters.push(new SequenceSearchFilter({
      property: 'hs_company_id',
      operator: 'EQ',
      value: companyId
    })) : filters;
  };
};

export default function (_ref) {
  var sequenceId = _ref.sequenceId,
      enrolledBy = _ref.enrolledBy,
      enrolledAtRange = _ref.enrolledAtRange,
      companyId = _ref.companyId,
      status = _ref.status,
      _ref$includeDefaultSo = _ref.includeDefaultSort,
      includeDefaultSort = _ref$includeDefaultSo === void 0 ? false : _ref$includeDefaultSo;
  var buildFilters = compose(addSequenceIdIfExists(sequenceId), addCompanyIdIfExists(companyId), addEnrolledByIfExists(enrolledBy), addEnrolledAtIfExists(enrolledAtRange));
  var sorts = includeDefaultSort ? List([new SequenceSearchSort({
    property: 'hs_enrolled_at',
    order: 'DESC'
  }), new SequenceSearchSort({
    property: 'hs_enrollment_id',
    order: 'DESC'
  })]) : List();
  var filterGroups = List([ImmutableMap({
    filters: buildFilters(List())
  })]);
  filterGroups = status ? mergeEngagementFilters(filterGroups, getFiltersForSelection(OrderedSet(Array.isArray(status) ? status : [status]))) : filterGroups;
  return new SequenceSearchQuery({
    filterGroups: filterGroups,
    sorts: sorts
  });
}