'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { NavMarker } from 'react-rhumb';
import { connect } from 'react-redux';
import * as SequenceSummarySearchActions from '../actions/SequenceSummarySearchActions';
import * as SequenceActions from '../actions/SequenceActions';
import * as SequenceAnalyticsActions from '../actions/SequenceAnalyticsActions';
import * as SequenceSummaryTabNames from 'SequencesUI/constants/SequenceSummaryTabNames';
import SequenceSummarySearch from '../components/summarySearch/SequenceSummarySearch';
import NotFound from '../components/NotFound';
import dateRangeToStartAndEnd from 'SequencesUI/util/summary/dateRangeToStartAndEnd';
import dateRangeFromType from 'SequencesUI/util/summary/dateRangeFromType';
import getDefaultQueryFromQueryParams, { getEnrolledByValueFromQueryParam } from 'SequencesUI/util/overview/getDefaultQueryFromQueryParams';
import SequenceSummaryPerformancePage from '../components/summarySearch/SequenceSummaryPerformancePage';
import SequenceSummaryEnrollmentsPage from '../components/summarySearch/SequenceSummaryEnrollmentsPage';
import SequenceSummarySettingsPage from '../components/summarySearch/SequenceSummarySettingsPage';
import withSequencesStatus from './withSequencesStatus';
var SequenceSummarySearchContainer = createReactClass({
  displayName: "SequenceSummarySearchContainer",
  propTypes: {
    children: PropTypes.node,
    location: PropTypes.object.isRequired,
    sequence: PropTypes.instanceOf(ImmutableMap),
    sequenceAnalytics: PropTypes.instanceOf(ImmutableMap),
    params: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    fetchEmailStepReport: PropTypes.func.isRequired,
    fetchSequence: PropTypes.func.isRequired,
    selectedTab: PropTypes.oneOf(Object.values(SequenceSummaryTabNames)).isRequired
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        sequenceId = _this$props.params.sequenceId,
        _this$props$location$ = _this$props.location.query,
        companyId = _this$props$location$.companyId,
        enrolledAt = _this$props$location$.enrolledAt,
        enrolledBy = _this$props$location$.enrolledBy,
        status = _this$props$location$.status;
    var enrolledAtRange = dateRangeFromType(enrolledAt);

    var _dateRangeToStartAndE = dateRangeToStartAndEnd(enrolledAtRange),
        start = _dateRangeToStartAndE.start,
        end = _dateRangeToStartAndE.end;

    var query = getDefaultQueryFromQueryParams({
      companyId: companyId,
      enrolledAtRange: enrolledAtRange,
      enrolledBy: getEnrolledByValueFromQueryParam(enrolledBy),
      includeDefaultSort: true,
      sequenceId: sequenceId,
      status: status
    });
    this.props.updateQuery(query);

    if (!this.props.sequence) {
      this.props.fetchSequence(sequenceId);
    }

    this.props.fetchEmailStepReport({
      sequenceId: sequenceId,
      enrolledBy: getEnrolledByValueFromQueryParam(enrolledBy),
      start: start,
      end: end
    });
  },
  handleUpdateName: function handleUpdateName(name) {
    var _this = this;

    var updatedSequence = fromJS(Object.assign({}, this.props.sequence.toJS(), {
      name: name
    }));
    SequenceActions.save({
      sequence: updatedSequence,
      showErrorAlert: true
    }).then(function (sequence) {
      _this.props.updateName({
        sequenceId: sequence.get('id'),
        name: name
      });
    }, function () {} // Error state is already handled with error alert
    );
  },
  render: function render() {
    var _this$props2 = this.props,
        children = _this$props2.children,
        location = _this$props2.location,
        sequenceId = _this$props2.params.sequenceId,
        query = _this$props2.query,
        selectedTab = _this$props2.selectedTab,
        sequence = _this$props2.sequence,
        sequenceAnalytics = _this$props2.sequenceAnalytics;

    if (sequence === null) {
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(NavMarker, {
          name: "ENROLLMENTS_TABLE_FAIL"
        }), /*#__PURE__*/_jsx(NotFound, {})]
      });
    }

    if (!sequence || !sequenceAnalytics) {
      return null;
    }

    var tab = null;

    if (selectedTab === SequenceSummaryTabNames.PERFORMANCE) {
      tab = /*#__PURE__*/_jsx(SequenceSummaryPerformancePage, {
        sequenceId: sequenceId,
        children: children
      });
    } else if (selectedTab === SequenceSummaryTabNames.ENROLLMENTS) {
      tab = /*#__PURE__*/_jsx(SequenceSummaryEnrollmentsPage, {
        location: location,
        onUpdateQueryAndSearch: this.props.updateQuery,
        children: children
      });
    } else if (selectedTab === SequenceSummaryTabNames.SETTINGS) {
      tab = /*#__PURE__*/_jsx(SequenceSummarySettingsPage, {
        sequence: sequence,
        children: children
      });
    }

    return /*#__PURE__*/_jsx(SequenceSummarySearch, {
      location: location,
      onUpdateName: this.handleUpdateName,
      onUpdateQueryAndSearch: this.updateQueryAndSearch,
      query: query,
      selectedTab: selectedTab,
      sequence: sequence,
      sequenceAnalytics: sequenceAnalytics,
      children: tab
    });
  }
});
export default withSequencesStatus(connect(function (state, _ref) {
  var params = _ref.params;
  return {
    sequence: state.sequences.sequencesById.get(parseInt(params.sequenceId, 10)),
    sequenceAnalytics: state.sequenceAnalytics.get(params.sequenceId),
    query: state.sequenceSummarySearch.get('query')
  };
}, {
  updateQuery: SequenceSummarySearchActions.updateQuery,
  updateName: SequenceActions.updateName,
  fetchSequence: SequenceActions.fetchSequence,
  fetchEmailStepReport: SequenceAnalyticsActions.fetchReport
})(SequenceSummarySearchContainer));