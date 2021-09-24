'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { List } from 'immutable';
import SequenceSummaryEngagementFilter from 'SequencesUI/components/summarySearch/SequenceSummaryEngagementFilter';
import CompanyFilter from 'SequencesUI/components/filters/CompanyFilter';
import SequenceFilter from 'SequencesUI/components/filters/SequenceFilter';
import EnrolledByFilterV2 from 'SequencesUI/components/filters/EnrolledByFilterV2';
import SequenceSummarySearchTimeFilter from 'SequencesUI/components/summarySearch/SequenceSummarySearchTimeFilter';
import UIFilterBar from 'UIComponents/nav/UIFilterBar';

var OverviewFilterBar = function OverviewFilterBar(_ref) {
  var onChange = _ref.onChange,
      filterGroups = _ref.filterGroups;
  return /*#__PURE__*/_jsx(UIFilterBar, {
    "data-test-id": "overview-filter-bar",
    className: "m-top-0",
    startSlot: /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(CompanyFilter, {
        filterGroups: filterGroups,
        onChange: onChange,
        placement: "bottom right"
      }), /*#__PURE__*/_jsx(SequenceFilter, {
        filterGroups: filterGroups,
        onChange: onChange
      }), /*#__PURE__*/_jsx(SequenceSummaryEngagementFilter, {
        filterGroups: filterGroups,
        onChange: onChange
      }), /*#__PURE__*/_jsx(EnrolledByFilterV2, {
        filterGroups: filterGroups,
        onChange: onChange
      }), /*#__PURE__*/_jsx(SequenceSummarySearchTimeFilter, {
        filterGroups: filterGroups,
        onChange: onChange
      })]
    })
  });
};

OverviewFilterBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  filterGroups: PropTypes.instanceOf(List).isRequired
};
export default OverviewFilterBar;