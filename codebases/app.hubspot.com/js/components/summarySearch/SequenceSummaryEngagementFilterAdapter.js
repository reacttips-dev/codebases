'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { getFiltersForSelection, getSelectionForFilters, mergeEngagementFilters } from '../../util/enrollmentEngagementFilters';

function SequenceSummaryEngagementFilterAdapter(WrappingComponent) {
  var Wrapped = function Wrapped(_ref) {
    var filterGroups = _ref.filterGroups,
        onChange = _ref.onChange,
        location = _ref.location;
    var handleChange = useCallback(function (selection) {
      var newFilters = mergeEngagementFilters(filterGroups, getFiltersForSelection(selection));
      onChange(newFilters);
    }, [filterGroups, onChange]);
    var selection = getSelectionForFilters(filterGroups);
    return /*#__PURE__*/_jsx(WrappingComponent, {
      selection: selection,
      onChange: handleChange,
      location: location
    });
  };

  Wrapped.propTypes = {
    filterGroups: PropTypes.instanceOf(List).isRequired,
    onChange: PropTypes.func.isRequired,
    location: PropTypes.object
  };
  return Wrapped;
}

export default SequenceSummaryEngagementFilterAdapter;