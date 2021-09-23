'use es6';

import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/esm/taggedTemplateLiteralLoose";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["Update ", " delay value"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["Update ", " delay option"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { tracker, buildCreateOrEditSequenceActionString as buildString } from 'SequencesUI/util/UsageTracker';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { canWrite } from 'SequencesUI/lib/permissions';
import * as DelayOptionTypes from 'SequencesUI/constants/DelayOptionTypes';
import * as EligibleFollowUpDays from 'SequencesUI/constants/EligibleFollowUpDays';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import * as SequenceEditorActions from 'SequencesUI/actions/SequenceEditorActions';
import * as Milliseconds from 'SequencesUI/constants/Milliseconds';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UIStepperInput from 'UIComponents/input/UIStepperInput';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
import { DelayOptionDropdown } from './DelaySelectorDropdowns';
import { getDelayOptions } from 'SequencesUI/util/sequenceBuilderUtils';
export var DelayValueStepperInput = styled(UIStepperInput).attrs(function () {
  return {
    max: 90,
    min: 1,
    stepSize: 1
  };
}).withConfig({
  displayName: "DelaySelector__DelayValueStepperInput",
  componentId: "iy5n0z-0"
})(["width:80px !important;"]);
export var CreatePageTooltip = function CreatePageTooltip(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "create.preview.delaySelector.tooltip"
    }),
    children: children
  });
};
var DelaySelector = createReactClass({
  displayName: "DelaySelector",
  propTypes: {
    delay: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    readOnly: PropTypes.bool,
    stepType: PropTypes.oneOf(Object.values(SequenceStepTypes || {})).isRequired,
    fromCreatePage: PropTypes.bool,
    eligibleFollowUpDays: PropTypes.oneOf(Object.values(EligibleFollowUpDays)).isRequired,
    updateDelay: PropTypes.func.isRequired
  },
  trackSequenceEdit: function trackSequenceEdit(action) {
    tracker.track('createOrEditSequence', {
      action: action
    });
  },
  getSelectedDelayOption: function getSelectedDelayOption() {
    var delay = this.props.delay;

    if (delay === 0) {
      return DelayOptionTypes.NO_DELAY;
    }

    return DelayOptionTypes.DELAY;
  },
  getDelay: function getDelay(val) {
    var num = val ? parseInt(val, 10) : 1;
    return num * Milliseconds.DAY;
  },
  getDelayInUnits: function getDelayInUnits() {
    var _this$props = this.props,
        delay = _this$props.delay,
        stepType = _this$props.stepType;
    var isInitialTask = stepType === SequenceStepTypes.SCHEDULE_TASK && delay === 0;

    if (isInitialTask) {
      return 0;
    }

    return delay / Milliseconds.DAY;
  },
  handleUpdateDelay: function handleUpdateDelay(newDelay) {
    this.props.updateDelay(this.props.index, newDelay);
  },
  handleOptionChange: function handleOptionChange(e) {
    var stepType = this.props.stepType;
    var value = e.target.value === DelayOptionTypes.DELAY ? 1 : 0;
    var updatedDelay = Milliseconds.DAY * value;
    this.handleUpdateDelay(updatedDelay);
    this.trackSequenceEdit(buildString(_templateObject(), stepType));
  },
  handleDelayChange: function handleDelayChange(e) {
    var stepType = this.props.stepType;
    var delay = this.getDelay(e.target.value);
    this.handleUpdateDelay(delay);
    this.trackSequenceEdit(buildString(_templateObject2(), stepType));
  },
  renderDelayOption: function renderDelayOption() {
    var _this$props2 = this.props,
        readOnly = _this$props2.readOnly,
        stepType = _this$props2.stepType;
    var mustHaveDelay = stepType === SequenceStepTypes.SEND_TEMPLATE;

    if (mustHaveDelay) {
      return /*#__PURE__*/_jsx("span", {
        className: "delay-selector-email-action",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.delaySelector.sendEmailIfNoActionWithin"
        })
      });
    }

    return /*#__PURE__*/_jsx(DelayOptionDropdown, {
      readOnly: readOnly || !canWrite(),
      onChange: this.handleOptionChange,
      options: getDelayOptions(),
      value: this.getSelectedDelayOption()
    });
  },
  renderDelayValueStepper: function renderDelayValueStepper() {
    var _this$props3 = this.props,
        readOnly = _this$props3.readOnly,
        delay = _this$props3.delay;

    if (delay === 0) {
      return null;
    }

    return /*#__PURE__*/_jsx(DelayValueStepperInput, {
      readOnly: readOnly || !canWrite(),
      onChange: this.handleDelayChange,
      value: this.getDelayInUnits(),
      disabledMaxButtonTooltip: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.delaySelector.maxDelayTooltip"
      }),
      disabledMinButtonTooltip: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.delaySelector.minDelayTooltip"
      })
    });
  },
  renderDaysOrBusinessDays: function renderDaysOrBusinessDays() {
    var _this$props4 = this.props,
        delay = _this$props4.delay,
        fromCreatePage = _this$props4.fromCreatePage,
        eligibleFollowUpDays = _this$props4.eligibleFollowUpDays;

    if (delay === 0) {
      return null;
    }

    var useBusinessDays = eligibleFollowUpDays === EligibleFollowUpDays.BUSINESS_DAYS;
    var message = useBusinessDays ? 'edit.delaySelector.delayUnitText.businessDays' : 'edit.delaySelector.delayUnitText.days';
    var tooltipMessage = useBusinessDays ? 'edit.delaySelector.delayUnitTooltip.businessDays' : 'edit.delaySelector.delayUnitTooltip.days';
    return /*#__PURE__*/_jsxs("span", {
      children: [/*#__PURE__*/_jsx("span", {
        className: "delay-selector-email-action",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          "data-test-id": "delay-unit-text",
          message: message,
          options: {
            count: this.getDelayInUnits()
          }
        })
      }), !fromCreatePage && canWrite() && /*#__PURE__*/_jsx(UIHelpIcon, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: tooltipMessage
        }),
        tooltipPlacement: "top",
        className: "m-left-1"
      })]
    });
  },
  render: function render() {
    var fromCreatePage = this.props.fromCreatePage;
    var DelayTooltip = fromCreatePage ? CreatePageTooltip : EditSequenceTooltip;
    return /*#__PURE__*/_jsx(DelayTooltip, {
      children: /*#__PURE__*/_jsxs(UIButtonWrapper, {
        className: "editor-list-card-section",
        children: [this.renderDelayOption(), this.renderDelayValueStepper(), this.renderDaysOrBusinessDays()]
      })
    });
  }
});
export default connect(null, {
  updateDelay: SequenceEditorActions.updateDelay
})(DelaySelector);