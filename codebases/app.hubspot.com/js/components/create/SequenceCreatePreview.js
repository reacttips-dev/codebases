'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import emptyFunction from 'react-utils/emptyFunction';
import { Map as ImmutableMap } from 'immutable';
import { NavMarker } from 'react-rhumb';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import H4 from 'UIComponents/elements/headings/H4';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import * as EligibleFollowUpDays from 'SequencesUI/constants/EligibleFollowUpDays';
import SummaryBar from 'SequencesUI/components/edit/editorMain/SummaryBar';
import TemplateCard from 'SequencesUI/components/edit/cards/TemplateCard';
import TaskCard from 'SequencesUI/components/edit/cards/TaskCard';
import FirstCard from 'SequencesUI/components/edit/cards/FirstCard';
var PREVIEW_USE_THREADED_FOLLOW_UPS = false;
var PREVIEW_ELIGIBLE_FOLLOW_UP_DAYS = EligibleFollowUpDays.BUSINESS_DAYS;
export default createReactClass({
  displayName: "SequenceCreatePreview",
  propTypes: {
    sequence: PropTypes.instanceOf(ImmutableMap),
    selectedOption: PropTypes.number.isRequired,
    readOnlyEditorLoaded: PropTypes.bool.isRequired
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.selectedOption !== prevProps.selectedOption) {
      document.querySelector('.sequence-create-preview').scrollIntoView();
    }
  },
  renderSequence: function renderSequence() {
    var _this = this;

    var _this$props = this.props,
        sequence = _this$props.sequence,
        selectedOption = _this$props.selectedOption;

    if (selectedOption === 0) {
      return /*#__PURE__*/_jsx("div", {
        className: "sequence-create-preview-first-card",
        children: /*#__PURE__*/_jsx(FirstCard, {
          fromCreatePage: true
        })
      });
    }

    return sequence.get('steps').map(function (step, index) {
      return /*#__PURE__*/_jsx("div", {
        className: "sequence-create-preview-step m-bottom-3",
        "data-selenium-test": "sequence-create-preview-step",
        children: _this.renderStep(step, index)
      }, "sequence-create-preview-step-" + index);
    });
  },
  renderStep: function renderStep(step, index) {
    var _this$props2 = this.props,
        sequence = _this$props2.sequence,
        readOnlyEditorLoaded = _this$props2.readOnlyEditorLoaded,
        selectedOption = _this$props2.selectedOption;
    var key = selectedOption + "-step-" + index;
    var isFirst = index === 0;
    var isLast = index === sequence.get('steps').size - 1;
    var action = step.action,
        data = step.data,
        delay = step.delay,
        payload = step.payload;
    var stepCardProps = {
      readOnly: true,
      isFirst: isFirst,
      isLast: isLast,
      eligibleFollowUpDays: PREVIEW_ELIGIBLE_FOLLOW_UP_DAYS
    };
    var emailTemplateProps = {
      data: data,
      firstTemplateStepIndex: 0,
      // Not relevant in preview, because template subject is not threaded
      useThreadedFollowUps: PREVIEW_USE_THREADED_FOLLOW_UPS,
      readOnlyEditorLoaded: readOnlyEditorLoaded
    };

    switch (action) {
      case SequenceStepTypes.SEND_TEMPLATE:
        return /*#__PURE__*/_jsx(TemplateCard, Object.assign({
          fromCreatePage: true,
          index: index
        }, stepCardProps, {}, emailTemplateProps, {
          delay: delay,
          openReplaceTemplatePanel: emptyFunction
        }), key);

      case SequenceStepTypes.SCHEDULE_TASK:
        return /*#__PURE__*/_jsx(TaskCard, Object.assign({
          fromCreatePage: true,
          index: index
        }, stepCardProps, {}, emailTemplateProps, {
          payload: payload,
          delay: delay,
          dependencies: ImmutableMap(),
          onToggleDependency: emptyFunction,
          openEditTaskPanel: emptyFunction
        }), key);

      default:
        return null;
    }
  },
  render: function render() {
    var sequence = this.props.sequence;

    if (!sequence) {
      return null;
    }

    return /*#__PURE__*/_jsxs(UIFlex, {
      className: "sequence-create-preview p-all-10",
      direction: "column",
      children: [/*#__PURE__*/_jsx(NavMarker, {
        name: "CREATE_LOAD"
      }), /*#__PURE__*/_jsx(H4, {
        className: "p-y-2 m-y-0",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "create.preview.header"
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "sequence-create-preview-summary-bar",
        children: /*#__PURE__*/_jsx(SummaryBar, {
          sequence: sequence,
          fromCreatePage: true
        })
      }), this.renderSequence()]
    });
  }
});