'use es6';

import once from 'transmute/once';
import { List, OrderedSet, fromJS } from 'immutable';
import { SequenceSearchFilter } from '../records/SequenceSearchQuery';
import { isUngatedForWorkflowEnroll } from '../lib/permissions';
export var FILTER_PROPERTIES = OrderedSet.of('hs_enrollment_state', 'hs_unenrolled_source');
export var FILTER_NONE = OrderedSet.of('NONE');
export var STATE_FILTERS = OrderedSet.of('EXECUTING', 'FINISHED', 'UNENROLLED');
export var getStateFilters = once(function () {
  return OrderedSet.of('EXECUTING', 'FINISHED', 'UNENROLLED', 'PAUSED');
});
export var CONTACT_UNENROLL_SOURCE_FILTERS = OrderedSet.of('MANUAL', 'WORKFLOW', 'MEETING', 'REPLY');
export var ERROR_UNENROLL_SOURCE_FILTERS = OrderedSet.of('ERROR');
export var getUnenrollSourceFilters = once(function () {
  return CONTACT_UNENROLL_SOURCE_FILTERS.withMutations(function (_unenrollSourceFilters) {
    return _unenrollSourceFilters.union(OrderedSet.of('ACCOUNT_REPLY', 'ACCOUNT_MEETING')).union(ERROR_UNENROLL_SOURCE_FILTERS);
  });
});
export var getFilterTypes = once(function () {
  var filterTypes = getStateFilters().delete('UNENROLLED').union(getUnenrollSourceFilters());

  if (isUngatedForWorkflowEnroll()) {
    return filterTypes;
  }

  return filterTypes.delete('WORKFLOW');
});
export var getFiltersForSelection = function getFiltersForSelection(selectedFilters) {
  var filterGroups = List();

  if (selectedFilters.equals(getFilterTypes())) {
    return filterGroups;
  }

  if (selectedFilters.equals(FILTER_NONE)) {
    return filterGroups.push(fromJS({
      filters: [new SequenceSearchFilter({
        property: 'hs_enrollment_state',
        values: List(['NONE'])
      })]
    }));
  }

  var selectedUnenrollSources = getUnenrollSourceFilters().intersect(selectedFilters);
  var selectedStates = getStateFilters().intersect(selectedFilters);

  if (selectedStates.size > 0 || selectedUnenrollSources.size === 0) {
    filterGroups = filterGroups.push(fromJS({
      filters: [new SequenceSearchFilter({
        property: 'hs_enrollment_state',
        values: selectedStates.toList()
      })]
    }));
  }

  if (selectedUnenrollSources.size > 0 || selectedStates.size === 0) {
    filterGroups = filterGroups.push(fromJS({
      filters: [new SequenceSearchFilter({
        property: 'hs_unenrolled_source',
        values: selectedUnenrollSources.toList()
      })]
    }));
  }

  return filterGroups;
};
export var mergeEngagementFilters = function mergeEngagementFilters(filterGroups, engagementFilterGroups) {
  var mergeFilters = function mergeFilters(filters, filtersToMerge) {
    return filters.filterNot(function (filter) {
      return FILTER_PROPERTIES.includes(filter.property);
    }).concat(filtersToMerge);
  };

  if (engagementFilterGroups.size === 0) {
    return filterGroups.take(1).map(function (filterGroup) {
      return filterGroup.update('filters', function (filters) {
        return filters.filterNot(function (filter) {
          return FILTER_PROPERTIES.includes(filter.property);
        });
      });
    });
  }

  return FILTER_PROPERTIES.reduce(function (result, filterProperty) {
    var engagementFilterGroupToMerge = engagementFilterGroups.find(function (engagementFilterGroup) {
      return engagementFilterGroup.get('filters').find(function (filter) {
        return filter.property === filterProperty;
      });
    });

    if (!engagementFilterGroupToMerge) {
      // If we only have one filter group, we only want to filter out the
      // engagement property.If we remove the whole group, we'd be down to an
      // empty set and lose our sequence, enrolledBy and enrolledAt filters.
      if (result.size === 1) {
        return result.map(function (filterGroup) {
          return filterGroup.update('filters', function (filters) {
            return filters.filterNot(function (filter) {
              return filter.property === filterProperty;
            });
          });
        });
      } else {
        // If we have more than one filterGroup in the result, we should have
        // copies of all the non-engagement filters in each group. We can just
        // delete the entire group containing the property filter being removed.
        return result.filterNot(function (filterGroup) {
          return filterGroup.get('filters').find(function (filter) {
            return filter.property === filterProperty;
          });
        });
      }
    }

    var filterGroupToUpdate = result.find(function (filterGroup) {
      return filterGroup.get('filters').find(function (filter) {
        return filter.property === filterProperty;
      });
    });

    if (!filterGroupToUpdate) {
      if (result.size === 0) {
        return result.push(engagementFilterGroupToMerge);
      }

      var baseFilterGroup = result.first();
      var resultFilterGroup = baseFilterGroup.update('filters', function (filters) {
        return mergeFilters(filters, engagementFilterGroupToMerge.get('filters'));
      });
      var baseFilterGroupHasEngagementFilter = baseFilterGroup.get('filters').some(function (filter) {
        return FILTER_PROPERTIES.includes(filter.property);
      });
      return baseFilterGroupHasEngagementFilter ? result.push(resultFilterGroup) : result.set(0, resultFilterGroup);
    }

    return result.map(function (filterGroup) {
      return filterGroup === filterGroupToUpdate ? filterGroup.update('filters', function (filters) {
        return mergeFilters(filters, engagementFilterGroupToMerge.get('filters'));
      }) : filterGroup;
    });
  }, filterGroups);
};
export var getSelectionForFilters = function getSelectionForFilters(filterGroups) {
  var stateFilter = filterGroups.map(function (filterGroup) {
    return filterGroup.get('filters').find(function (filter) {
      return filter.property === 'hs_enrollment_state';
    });
  }).filter(function (filter) {
    return filter;
  }).first();
  var stateValues = stateFilter ? stateFilter.values.toSet() : null;
  var unenrollSourceFilter = filterGroups.map(function (filterGroup) {
    return filterGroup.get('filters').find(function (filter) {
      return filter.property === 'hs_unenrolled_source';
    });
  }).filter(function (filter) {
    return filter;
  }).first();
  var unenrollSourceValues = unenrollSourceFilter ? unenrollSourceFilter.values.toSet() : null;

  if (stateValues === null && unenrollSourceValues === null) {
    return getFilterTypes();
  }

  var selectedStates = getStateFilters().intersect(stateValues);
  var selectedUnenrollSources = getUnenrollSourceFilters().intersect(unenrollSourceValues);
  return getFilterTypes().intersect(selectedStates.union(selectedUnenrollSources));
};