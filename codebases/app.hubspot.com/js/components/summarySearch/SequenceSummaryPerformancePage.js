'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useCallback } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { NavMarker } from 'react-rhumb';
import { Map as ImmutableMap } from 'immutable';
import { SequenceSearchQuery } from 'SequencesUI/records/SequenceSearchQuery';
import SequenceSummaryFilterBar from './SequenceSummaryFilterBar';
import * as SequenceSummarySearchActions from '../../actions/SequenceSummarySearchActions';
import * as SequenceAnalyticsActions from '../../actions/SequenceAnalyticsActions';
import SequenceTemplateReport from '../SequenceTemplateReport/SequenceTemplateReport';
import EmailStepReportTable from './EmailStepReportTable';
import SequenceSummaryReportingDataWell from 'SequencesUI/components/summarySearch/SequenceSummaryReportingDataWell';
import getParamsFromSequenceQuery from '../../util/summary/getParamsFromSequenceQuery';
import { isUngatedForNewEmailPerformance } from '../../lib/permissions';

var SequenceSummaryPerformancePage = function SequenceSummaryPerformancePage(_ref) {
  var children = _ref.children,
      fetchEmailStepReport = _ref.fetchEmailStepReport,
      query = _ref.query,
      sequenceAnalytics = _ref.sequenceAnalytics,
      sequenceId = _ref.sequenceId,
      updateQuery = _ref.updateQuery;
  var filterGroups = query.get('filterGroups');
  var updateQueryAndReport = useCallback(function (newQuery) {
    var _getParamsFromSequenc = getParamsFromSequenceQuery(newQuery),
        start = _getParamsFromSequenc.start,
        end = _getParamsFromSequenc.end,
        enrolledBy = _getParamsFromSequenc.enrolledBy;

    var paramsFromCurrentQuery = getParamsFromSequenceQuery(query);

    if (start !== paramsFromCurrentQuery.start || end !== paramsFromCurrentQuery.end || enrolledBy !== paramsFromCurrentQuery.enrolledBy) {
      fetchEmailStepReport({
        sequenceId: sequenceId,
        start: start,
        end: end,
        enrolledBy: enrolledBy
      });
    }

    updateQuery(newQuery);
  }, [fetchEmailStepReport, query, sequenceId, updateQuery]);
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "SUMMARY_PERFORMANCE_LOAD"
    }), /*#__PURE__*/_jsx(SequenceSummaryFilterBar, {
      onUpdateQuery: updateQueryAndReport,
      query: query
    }), /*#__PURE__*/_jsx(SequenceSummaryReportingDataWell, {
      filterGroups: filterGroups
    }), /*#__PURE__*/_jsx(EmailStepReportTable, {
      sequenceAnalytics: sequenceAnalytics
    }), isUngatedForNewEmailPerformance() && /*#__PURE__*/_jsx(SequenceTemplateReport, {
      sequenceId: sequenceId,
      query: query
    }), children]
  });
};

SequenceSummaryPerformancePage.propTypes = {
  children: PropTypes.node,
  fetchEmailStepReport: PropTypes.func.isRequired,
  query: PropTypes.instanceOf(SequenceSearchQuery).isRequired,
  sequenceAnalytics: PropTypes.instanceOf(ImmutableMap).isRequired,
  sequenceId: PropTypes.string.isRequired,
  updateQuery: PropTypes.func.isRequired
};
export default withRouter(connect(function (state, _ref2) {
  var params = _ref2.params;
  return {
    sequenceAnalytics: state.sequenceAnalytics.get(params.sequenceId),
    query: state.sequenceSummarySearch.get('query')
  };
}, {
  fetchEmailStepReport: SequenceAnalyticsActions.fetchReport,
  updateQuery: SequenceSummarySearchActions.updateQuery
})(SequenceSummaryPerformancePage));