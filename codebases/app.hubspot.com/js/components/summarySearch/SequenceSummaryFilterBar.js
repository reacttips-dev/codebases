'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useCallback } from 'react';
import SequenceSummaryEngagementFilter from './SequenceSummaryEngagementFilter';
import SequenceSummarySearchTimeFilter from './SequenceSummarySearchTimeFilter';
import { SequenceSearchQuery } from 'SequencesUI/records/SequenceSearchQuery';
import EnrolledByFilterV2 from 'SequencesUI/components/filters/EnrolledByFilterV2';
import CompanyFilter from 'SequencesUI/components/filters/CompanyFilter';
import UIFilterBar from 'UIComponents/nav/UIFilterBar';

var SequenceSummaryFilterBar = function SequenceSummaryFilterBar(_ref) {
  var onUpdateQuery = _ref.onUpdateQuery,
      query = _ref.query;
  var handleFilterChange = useCallback(function (filterGroups) {
    onUpdateQuery(query.merge({
      offset: 0,
      filterGroups: filterGroups
    }));
  }, [onUpdateQuery, query]);
  var filterGroups = query.get('filterGroups');
  return /*#__PURE__*/_jsx(UIFilterBar, {
    className: "m-top-0 m-bottom-5",
    startSlot: /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(CompanyFilter, {
        filterGroups: filterGroups,
        onChange: handleFilterChange,
        placement: "bottom right"
      }), /*#__PURE__*/_jsx(SequenceSummaryEngagementFilter, {
        filterGroups: filterGroups,
        onChange: handleFilterChange
      }), /*#__PURE__*/_jsx(EnrolledByFilterV2, {
        filterGroups: filterGroups,
        onChange: handleFilterChange,
        placement: "bottom right"
      }), /*#__PURE__*/_jsx(SequenceSummarySearchTimeFilter, {
        filterGroups: filterGroups,
        onChange: handleFilterChange
      })]
    })
  });
};

SequenceSummaryFilterBar.propTypes = {
  onUpdateQuery: PropTypes.func.isRequired,
  query: PropTypes.instanceOf(SequenceSearchQuery).isRequired
};
export default SequenceSummaryFilterBar;