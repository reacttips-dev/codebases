'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap, fromJS } from 'immutable';
import UIDashboardPage from 'UIComponents/page/UIDashboardPage';
import SequenceSummaryHeader from '../summary/SequenceSummaryHeader';
import { tracker, getPermissionSaveAction } from 'SequencesUI/util/UsageTracker';
import TriggerWootricSurvey from '../TriggerWootricSurvey';
import { isUngatedForWootricSurvey } from '../../lib/permissions';
import AssignmentPanel from 'sales-content-partitioning/panels/AssignmentPanel';
import { getScopes } from 'SequencesUI/lib/permissions';
export default createReactClass({
  displayName: "SequenceSummarySearch",
  propTypes: {
    children: PropTypes.node,
    sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
    location: PropTypes.object.isRequired,
    selectedTab: PropTypes.string.isRequired,
    onUpdateName: PropTypes.func.isRequired
  },
  componentDidMount: function componentDidMount() {
    tracker.track('pageView', {
      subscreen: 'sequence-summary'
    });
  },
  trackPermissionSave: function trackPermissionSave(_ref) {
    var sharingOption = _ref.sharingOption;
    tracker.track('sequencesInteraction', {
      action: getPermissionSaveAction(sharingOption),
      subscreen: 'sequence-summary'
    });
  },
  render: function render() {
    var _this$props = this.props,
        children = _this$props.children,
        location = _this$props.location,
        onUpdateName = _this$props.onUpdateName,
        selectedTab = _this$props.selectedTab,
        sequence = _this$props.sequence;
    return /*#__PURE__*/_jsxs(UIDashboardPage, {
      headerComponent: /*#__PURE__*/_jsx(SequenceSummaryHeader, {
        location: location,
        onUpdateName: onUpdateName,
        selectedTab: selectedTab,
        sequence: sequence
      }),
      children: [/*#__PURE__*/_jsx(AssignmentPanel, {
        afterSave: this.trackPermissionSave,
        scopes: fromJS(getScopes())
      }), children, /*#__PURE__*/_jsx(TriggerWootricSurvey, {
        enabled: !!isUngatedForWootricSurvey()
      })]
    });
  }
});