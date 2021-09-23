'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { getSequenceTotalSteps, getSequenceTotalTimeToComplete } from 'SequencesUI/util/sequenceBuilderUtils';
import * as SellingStrategyTypes from 'SequencesUI/constants/SellingStrategyTypes';
import * as EligibleFollowUpDays from 'SequencesUI/constants/EligibleFollowUpDays';
import UIFlex from 'UIComponents/layout/UIFlex';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardSection from 'UIComponents/card/UICardSection';
import UIList from 'UIComponents/list/UIList';
import SummaryBarActionsPopover from './SummaryBarActionsPopover';
var PREVIEW_ELIGIBLE_FOLLOW_UP_DAYS = EligibleFollowUpDays.BUSINESS_DAYS;
export default createReactClass({
  displayName: "SummaryBar",
  propTypes: {
    sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
    fromCreatePage: PropTypes.bool
  },
  renderSummaryContent: function renderSummaryContent() {
    var _this$props = this.props,
        sequence = _this$props.sequence,
        fromCreatePage = _this$props.fromCreatePage;
    var steps = getSequenceTotalSteps(sequence);
    var daysToComplete = getSequenceTotalTimeToComplete(sequence);
    var eligibleFollowUpDays = fromCreatePage ? PREVIEW_ELIGIBLE_FOLLOW_UP_DAYS : sequence.getIn(['sequenceSettings', 'eligibleFollowUpDays']);
    var message = eligibleFollowUpDays === EligibleFollowUpDays.BUSINESS_DAYS ? 'edit.summaryBar.businessDaysToComplete' : 'edit.summaryBar.daysToComplete';
    return /*#__PURE__*/_jsxs(UIList, {
      inline: true,
      use: "inline-divided",
      children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "edit.summaryBar.steps",
        options: {
          steps: steps
        }
      }), /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: message,
        options: {
          count: daysToComplete
        }
      })]
    });
  },
  renderSummary: function renderSummary() {
    var sequence = this.props.sequence;
    var sellingStrategy = sequence.getIn(['sequenceSettings', 'sellingStrategy']) || SellingStrategyTypes.LEAD_BASED;
    return /*#__PURE__*/_jsxs(UIFlex, {
      direction: "column",
      align: "center",
      justify: "center",
      children: [this.renderSummaryContent(), /*#__PURE__*/_jsxs("b", {
        className: "text-center",
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.summaryBar.description." + sellingStrategy
        }), /*#__PURE__*/_jsx(SummaryBarActionsPopover, {})]
      })]
    });
  },
  render: function render() {
    var fromCreatePage = this.props.fromCreatePage;
    var className = 'sequence-editor-summary-bar m-y-4' + (fromCreatePage ? " from-create" : "");
    return /*#__PURE__*/_jsx(UICardWrapper, {
      className: className,
      compact: true,
      children: /*#__PURE__*/_jsx(UICardSection, {
        children: this.renderSummary()
      })
    });
  }
});