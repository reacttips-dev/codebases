'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { List } from 'immutable';
import * as SalesModalTabs from 'sales-modal/constants/SalesModalTabs';
import SelectTable from 'sales-modal/components/salesModal/select/SelectTable';
import SalesUpsell from './zeroStates/SalesUpsell';
import EnrollmentsDisabled from 'sales-modal/components/enrollModal/EnrollmentsDisabled';
export default createReactClass({
  displayName: "SalesModalContent",
  propTypes: {
    currentTab: PropTypes.oneOf(Object.values(SalesModalTabs || {})).isRequired,
    doInsertItem: PropTypes.func.isRequired,
    teams: PropTypes.instanceOf(List).isRequired,
    showBanner: PropTypes.bool.isRequired,
    disableEnrollments: PropTypes.bool.isRequired,
    hasSequencesAccess: PropTypes.bool.isRequired,
    canUseEnrollments: PropTypes.bool.isRequired,
    onReject: PropTypes.func.isRequired
  },
  renderContent: function renderContent() {
    var _this$props = this.props,
        currentTab = _this$props.currentTab,
        teams = _this$props.teams,
        doInsertItem = _this$props.doInsertItem,
        showBanner = _this$props.showBanner,
        disableEnrollments = _this$props.disableEnrollments,
        onReject = _this$props.onReject,
        hasSequencesAccess = _this$props.hasSequencesAccess,
        canUseEnrollments = _this$props.canUseEnrollments;

    if (currentTab === SalesModalTabs.SEQUENCES && disableEnrollments) {
      return /*#__PURE__*/_jsx(EnrollmentsDisabled, {
        onReject: onReject
      });
    }

    if (currentTab === SalesModalTabs.SEQUENCES && (!hasSequencesAccess || !canUseEnrollments)) {
      return /*#__PURE__*/_jsx(SalesUpsell, {});
    }

    return /*#__PURE__*/_jsx(SelectTable, {
      currentTab: currentTab,
      teams: teams,
      showBanner: showBanner,
      doInsertItem: doInsertItem
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx("div", {
      className: "sales-modal-content p-top-3",
      children: this.renderContent()
    });
  }
});