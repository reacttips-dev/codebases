'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import { getSelectedSequenceEnrollmentRecord } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { getInitialStepOptions, getInitialStepOptionsNonReenroll } from 'sales-modal/redux/selectors/StartingStepSelectors';
import { enrollmentSetStartingOrder } from 'sales-modal/redux/actions/EnrollmentEditorActions';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import UISelect from 'UIComponents/input/UISelect';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
var StartingStepSelect = createReactClass({
  displayName: "StartingStepSelect",
  mixins: [PureRenderMixin],
  propTypes: {
    enrollmentSetStartingOrder: PropTypes.func.isRequired,
    startingStepOrder: PropTypes.number,
    options: PropTypes.array
  },
  handleSelect: function handleSelect(e) {
    UsageTracker.track('sequencesUsage', {
      action: 'Start at later step',
      subscreen: 'enroll'
    });
    this.props.enrollmentSetStartingOrder({
      startingStepOrder: parseInt(e.target.value, 10)
    });
  },
  render: function render() {
    var _this$props = this.props,
        startingStepOrder = _this$props.startingStepOrder,
        options = _this$props.options;
    var value = startingStepOrder.toString();
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx("strong", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.sequenceOptions.initialSelectorSetting.startSequence"
        })
      }), /*#__PURE__*/_jsx(UISelect, {
        "data-test-id": "starting-step-select",
        buttonUse: "transparent",
        className: "p-all-0 p-left-1",
        menuWidth: "auto",
        onChange: this.handleSelect,
        options: options,
        value: value
      })]
    });
  }
});

function StartingStepSelectWithOptions(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      enrollType = _ref.enrollType,
      otherProps = _objectWithoutProperties(_ref, ["sequenceEnrollment", "enrollType"]);

  if (enrollType === EnrollTypes.SINGLE_ENROLL || enrollType === EnrollTypes.BULK_ENROLL) {
    return /*#__PURE__*/_jsx(StartingStepSelect, Object.assign({}, otherProps, {
      options: getInitialStepOptionsNonReenroll(sequenceEnrollment)
    }));
  } else if (enrollType === EnrollTypes.REENROLL) {
    return /*#__PURE__*/_jsx(StartingStepSelect, Object.assign({}, otherProps, {
      options: getInitialStepOptions(sequenceEnrollment)
    }));
  }

  return null;
}

export default connect(function (state) {
  return {
    sequenceEnrollment: getSelectedSequenceEnrollmentRecord(state),
    enrollType: state.enrollType,
    startingStepOrder: getSelectedSequenceEnrollmentRecord(state).startingStepOrder
  };
}, {
  enrollmentSetStartingOrder: enrollmentSetStartingOrder
})(StartingStepSelectWithOptions);