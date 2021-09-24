'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import getAbsoluteTime from 'sales-modal/utils/enrollModal/getAbsoluteTime';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIButton from 'UIComponents/button/UIButton';
import { CANDY_APPLE, OZ_DARK } from 'HubStyleTokens/colors';
var PROGRESS_TYPES = {
  complete: {
    icon: 'success',
    color: OZ_DARK
  },
  error: {
    icon: 'warning',
    color: CANDY_APPLE
  }
};
export default createReactClass({
  displayName: "EnrollmentProgress",
  propTypes: {
    progress: PropTypes.oneOf([null, 'complete', 'error']),
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
    scheduled: PropTypes.bool,
    onCloseModal: PropTypes.func.isRequired
  },
  getSendMeta: function getSendMeta() {
    var sequenceEnrollment = this.props.sequenceEnrollment;
    var startingStepOrder = sequenceEnrollment.get('startingStepOrder');

    var _getAbsoluteTime = getAbsoluteTime(sequenceEnrollment, startingStepOrder),
        stepMoment = _getAbsoluteTime.stepMoment,
        absoluteTime = _getAbsoluteTime.absoluteTime;

    var sendDate = stepMoment.format('MMM Do');
    var sendTime;

    if (absoluteTime !== null) {
      sendTime = stepMoment.format('LT');
    }

    return {
      sendDate: sendDate,
      sendTime: sendTime
    };
  },
  renderMessage: function renderMessage() {
    var _this$props = this.props,
        progress = _this$props.progress,
        scheduled = _this$props.scheduled;

    if (progress === 'error') {
      return /*#__PURE__*/_jsx("h1", {
        className: "text-center",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollmentProgress.error"
        })
      });
    } else if (scheduled) {
      var _this$getSendMeta = this.getSendMeta(),
          sendDate = _this$getSendMeta.sendDate,
          sendTime = _this$getSendMeta.sendTime;

      return /*#__PURE__*/_jsxs("div", {
        className: "text-center",
        children: [/*#__PURE__*/_jsx("h1", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "enrollmentProgress.successfullyScheduled"
          })
        }), /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "enrollmentProgress.firstStepScheduledFor",
            options: {
              sendDate: sendDate,
              sendTime: sendTime
            }
          })
        })]
      });
    }

    return /*#__PURE__*/_jsxs("div", {
      className: "text-center",
      "data-test-id": "enroll-success",
      children: [/*#__PURE__*/_jsx("h1", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollmentProgress.successfullyEnrolled"
        })
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollmentProgress.firstStepSent"
        })
      })]
    });
  },
  renderButton: function renderButton() {
    var _this$props2 = this.props,
        progress = _this$props2.progress,
        scheduled = _this$props2.scheduled,
        onCloseModal = _this$props2.onCloseModal;

    if (scheduled && progress === 'complete') {
      return /*#__PURE__*/_jsx(UIButton, {
        className: "m-top-5",
        use: "primary",
        onClick: onCloseModal,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollmentProgress.backToInbox"
        })
      });
    }

    return null;
  },
  render: function render() {
    var progress = this.props.progress;

    if (progress !== null && progress !== undefined) {
      var _PROGRESS_TYPES$progr = PROGRESS_TYPES[progress],
          icon = _PROGRESS_TYPES$progr.icon,
          color = _PROGRESS_TYPES$progr.color;
      return /*#__PURE__*/_jsxs("div", {
        className: "enrollment-progress p-all-5",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: icon,
          color: color
        }), this.renderMessage(), this.renderButton()]
      });
    }

    return /*#__PURE__*/_jsx("div", {});
  }
});