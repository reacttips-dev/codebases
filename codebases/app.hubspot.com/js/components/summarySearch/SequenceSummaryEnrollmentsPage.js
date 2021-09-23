'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useCallback } from 'react';
import { connect } from 'react-redux';
import { NavMarker } from 'react-rhumb';
import { SequenceSearchQuery } from 'SequencesUI/records/SequenceSearchQuery';
import * as SequenceSummarySearchActions from '../../actions/SequenceSummarySearchActions';
import SequenceSummaryTableWrapper from 'SequencesUI/components/summarySearch/SequenceSummaryTableWrapper';
import SequenceSummaryFilterBar from './SequenceSummaryFilterBar';
import useEnrollmentSelection from '../../hooks/useEnrollmentSelection';

var SequenceSummaryEnrollmentsPage = function SequenceSummaryEnrollmentsPage(_ref) {
  var children = _ref.children,
      connectedAccounts = _ref.connectedAccounts,
      location = _ref.location,
      query = _ref.query,
      updateQuery = _ref.updateQuery;
  var enrollmentSelection = useEnrollmentSelection();
  var onUpdateQuery = useCallback(function () {
    enrollmentSelection.deselectAllEnrollments();
    return updateQuery.apply(void 0, arguments);
  }, [enrollmentSelection, updateQuery]);
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "SUMMARY_ENROLLMENTS_LOAD"
    }), /*#__PURE__*/_jsx(SequenceSummaryFilterBar, {
      onUpdateQuery: onUpdateQuery,
      location: location,
      query: query
    }), /*#__PURE__*/_jsx(SequenceSummaryTableWrapper, {
      connectedAccounts: connectedAccounts,
      enrollmentSelection: enrollmentSelection,
      onUpdateQuery: onUpdateQuery,
      query: query
    }), children]
  });
};

SequenceSummaryEnrollmentsPage.propTypes = {
  children: PropTypes.node,
  connectedAccounts: PropTypes.object,
  location: PropTypes.object.isRequired,
  query: PropTypes.instanceOf(SequenceSearchQuery).isRequired,
  updateQuery: PropTypes.func.isRequired
};
export default connect(function (state) {
  return {
    connectedAccounts: state.connectedAccounts,
    query: state.sequenceSummarySearch.get('query')
  };
}, {
  updateQuery: SequenceSummarySearchActions.updateQuery
})(SequenceSummaryEnrollmentsPage);