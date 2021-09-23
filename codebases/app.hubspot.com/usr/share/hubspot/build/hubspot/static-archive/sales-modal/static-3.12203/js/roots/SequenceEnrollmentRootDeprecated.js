'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap, List } from 'immutable';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { Provider } from 'react-redux';
import createStore from 'sales-modal/redux/createStore';
import { INIT } from 'sales-modal/redux/actionTypes';
import SequenceEnrollmentModal from 'sales-modal/modals/SequenceEnrollmentModal';
import { EnrollTypes, EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
import getIncompleteSteps from 'sales-modal/utils/enrollModal/getIncompleteSteps';
import { enrollSequencePropTypeChecker } from '../utils/enrollModal/viewEnrollmentUtil';

var SequenceEnrollmentRootDeprecated = /*#__PURE__*/function (_Component) {
  _inherits(SequenceEnrollmentRootDeprecated, _Component);

  function SequenceEnrollmentRootDeprecated(props, context) {
    var _this;

    _classCallCheck(this, SequenceEnrollmentRootDeprecated);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SequenceEnrollmentRootDeprecated).call(this, props, context));
    var closeModal = props.closeModal,
        enrolledSequence = props.enrolledSequence,
        enrollSequence = props.enrollSequence,
        platform = props.platform,
        portal = props.portal,
        recipient = props.recipient,
        selectConnectedAccount = props.selectConnectedAccount,
        sender = props.sender,
        signature = props.signature,
        supplementalObjectId = props.supplementalObjectId,
        supplementalObjectType = props.supplementalObjectType,
        useCachedConnectedAccount = props.useCachedConnectedAccount,
        user = props.user;
    _this.store = createStore();

    _this.store.dispatch({
      type: INIT,
      payload: {
        closeModal: closeModal,
        enrolledSequence: enrolledSequence,
        enrollSequence: enrollSequence,
        enrollType: _this.inferEnrollType(),
        platform: platform,
        portal: portal,
        recipient: recipient,
        selectConnectedAccount: selectConnectedAccount,
        sender: sender,
        signature: signature,
        supplementalObjectId: supplementalObjectId,
        supplementalObjectType: supplementalObjectType,
        useCachedConnectedAccount: useCachedConnectedAccount,
        user: user
      }
    });

    return _this;
  }

  _createClass(SequenceEnrollmentRootDeprecated, [{
    key: "inferEnrollType",
    value: function inferEnrollType() {
      var _this$props = this.props,
          completedSteps = _this$props.completedSteps,
          stepEnrollments = _this$props.stepEnrollments,
          enrollType = _this$props.enrollType; // Until we have all consumers passing an explicit enrollType, infer as necessary.

      if (enrollType) {
        return enrollType;
      } else if (completedSteps || stepEnrollments) {
        return EnrollTypes.EDIT;
      }

      return EnrollTypes.SINGLE_ENROLL;
    }
  }, {
    key: "createReenrollSequence",
    value: function createReenrollSequence() {
      var _this$props2 = this.props,
          completedSteps = _this$props2.completedSteps,
          stepEnrollments = _this$props2.stepEnrollments,
          enrolledSequence = _this$props2.enrolledSequence;
      var incompleteSteps = getIncompleteSteps(enrolledSequence, completedSteps || stepEnrollments);
      var startingStepOrder = incompleteSteps.isEmpty() ? 0 : incompleteSteps.first().get('stepOrder');
      return enrolledSequence.set('startingStepOrder', startingStepOrder).update('steps', function (steps) {
        return steps.map(function (step) {
          return step.merge({
            absoluteTime: null,
            timeOfDay: null
          });
        });
      });
    }
  }, {
    key: "getEnrolledSequence",
    value: function getEnrolledSequence() {
      var _this$props3 = this.props,
          enrolledSequence = _this$props3.enrolledSequence,
          enrollType = _this$props3.enrollType,
          preserveStepTimes = _this$props3.preserveStepTimes;

      if (enrollType === EnrollTypes.REENROLL && !preserveStepTimes) {
        return this.createReenrollSequence();
      }

      return enrolledSequence;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          enrollSequence = _this$props4.enrollSequence,
          sequenceId = _this$props4.sequenceId,
          completedSteps = _this$props4.completedSteps,
          closeModal = _this$props4.closeModal,
          enrollmentState = _this$props4.enrollmentState,
          stepEnrollments = _this$props4.stepEnrollments; // The plan is for the completedSteps prop to be replaced with stepEnrollments
      // If it continues to live (which it probably won't)

      return /*#__PURE__*/_jsx(Provider, {
        store: this.store,
        children: /*#__PURE__*/_jsx(SequenceEnrollmentModal, {
          closeModal: closeModal,
          stepEnrollments: completedSteps || stepEnrollments,
          enrolledSequence: this.getEnrolledSequence(),
          enrollmentState: enrollmentState,
          enrollType: this.inferEnrollType(),
          isWithinSalesModal: false,
          onConfirm: enrollSequence,
          sequenceId: sequenceId
        })
      });
    }
  }]);

  return SequenceEnrollmentRootDeprecated;
}(Component);

SequenceEnrollmentRootDeprecated.defaultProps = {
  selectConnectedAccount: false,
  useCachedConnectedAccount: true
};
SequenceEnrollmentRootDeprecated.propTypes = {
  closeModal: PropTypes.func.isRequired,
  completedSteps: PropTypes.instanceOf(List),
  stepEnrollments: PropTypes.instanceOf(List),
  enrolledSequence: PropTypes.instanceOf(ImmutableMap),
  enrollmentState: PropTypes.string,
  enrollSequence: enrollSequencePropTypeChecker,
  enrollType: EnrollTypePropType,
  platform: PropTypes.string.isRequired,
  portal: PropTypes.instanceOf(ImmutableMap).isRequired,
  preserveStepTimes: PropTypes.bool,
  recipient: PropTypes.string.isRequired,
  selectConnectedAccount: PropTypes.bool,
  sender: PropTypes.shape({
    inboxAddress: PropTypes.string,
    fromAddress: PropTypes.string
  }),
  sequenceId: PropTypes.number,
  signature: PropTypes.string,
  supplementalObjectId: PropTypes.string,
  supplementalObjectType: PropTypes.string,
  useCachedConnectedAccount: PropTypes.bool,
  user: PropTypes.instanceOf(ImmutableMap).isRequired
};
export default SequenceEnrollmentRootDeprecated;