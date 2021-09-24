'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import formatShortDate from 'I18n/utils/formatShortDate';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import { sendLimitLearnMore } from 'sales-modal/lib/links';
import * as SendTimeAlertWarningTypes from 'sales-modal/constants/SendTimeAlertWarningTypes';
import { getMessagePropsForSendTimeError } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import { SEND_LIMIT_EXCEEDED, THROTTLED } from 'sales-modal/constants/SendTimesNotAvailableReasons';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import { CANDY_APPLE, MARIGOLD } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';

var getAlertInfoByWarningType = function getAlertInfoByWarningType(warningType) {
  switch (warningType) {
    case SendTimeAlertWarningTypes.CLOSE_TO_SEND_LIMIT:
      return {
        baseKey: 'sendTimeAlert.closeToLimit',
        tooltip: 'sendTimeAlert.closeToLimitTooltip_jsx',
        iconColor: MARIGOLD,
        href: sendLimitLearnMore()
      };

    case SendTimeAlertWarningTypes.AT_SEND_LIMIT:
      return {
        baseKey: 'sendTimeAlert.atSendLimit',
        tooltip: 'sendTimeAlert.atSendLimitTooltip',
        iconColor: CANDY_APPLE,
        href: sendLimitLearnMore()
      };

    case SendTimeAlertWarningTypes.NO_TIME_SLOTS:
      return {
        baseKey: 'sendTimeAlert.noSendTimes',
        tooltip: 'sendTimeAlert.noSendTimesTooltip',
        iconColor: CANDY_APPLE,
        href: sendLimitLearnMore()
      };

    default:
      return {};
  }
};

var SendTimeAlert = createReactClass({
  displayName: "SendTimeAlert",
  propTypes: {
    warningType: PropTypes.string.isRequired,
    stepWithCloseToLimitError: PropTypes.array,
    sendLimits: PropTypes.instanceOf(ImmutableMap).isRequired,
    stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap),
    timezone: PropTypes.string,
    className: PropTypes.string
  },
  getMesssageProps: function getMesssageProps(alertInfo) {
    var _this$props = this.props,
        stepsWithSendTimeErrors = _this$props.stepsWithSendTimeErrors,
        sendLimits = _this$props.sendLimits,
        warningType = _this$props.warningType,
        stepWithCloseToLimitError = _this$props.stepWithCloseToLimitError,
        timezone = _this$props.timezone;

    if (warningType === SendTimeAlertWarningTypes.AT_SEND_LIMIT) {
      var _getMessagePropsForSe = getMessagePropsForSendTimeError(stepsWithSendTimeErrors, sendLimits, SEND_LIMIT_EXCEEDED, timezone),
          isDateToday = _getMessagePropsForSe.isDateToday,
          formattedDate = _getMessagePropsForSe.formattedDate,
          limit = _getMessagePropsForSe.limit;

      var tooltipTitle = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: alertInfo.tooltip + "." + (isDateToday ? 'today_jsx' : 'laterDate_jsx'),
        options: {
          date: formattedDate,
          limit: I18n.formatNumber(limit),
          href: alertInfo.href
        },
        elements: {
          Link: UILink
        }
      });

      return {
        message: alertInfo.baseKey + "." + (isDateToday ? 'today' : 'laterDate'),
        tooltipTitle: tooltipTitle,
        options: {
          date: formattedDate,
          limit: limit
        }
      };
    } else if (warningType === SendTimeAlertWarningTypes.NO_TIME_SLOTS) {
      var _getMessagePropsForSe2 = getMessagePropsForSendTimeError(stepsWithSendTimeErrors, sendLimits, THROTTLED, timezone),
          _isDateToday = _getMessagePropsForSe2.isDateToday,
          _formattedDate = _getMessagePropsForSe2.formattedDate;

      var dateKey = _isDateToday ? 'today' : 'laterDate';

      var _tooltipTitle = /*#__PURE__*/_jsx(FormattedMessage, {
        message: alertInfo.tooltip + "." + dateKey,
        options: {
          date: _formattedDate
        }
      });

      return {
        message: alertInfo.baseKey + "." + dateKey,
        tooltipTitle: _tooltipTitle,
        options: {
          date: _formattedDate
        }
      };
    } else {
      var _stepWithCloseToLimit = _slicedToArray(stepWithCloseToLimitError, 2),
          stepTimestamp = _stepWithCloseToLimit[0],
          stepWithCloseToLimitErrorData = _stepWithCloseToLimit[1];

      var _tooltipTitle2 = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: alertInfo.tooltip,
        options: {
          href: alertInfo.href,
          date: formatShortDate(I18n.moment(Number(stepTimestamp)).tz(timezone)),
          stepNumber: stepWithCloseToLimitErrorData.get('stepNumber'),
          emailCount: stepWithCloseToLimitErrorData.get('availableSendsUntilMidnight')
        },
        elements: {
          Link: UILink
        }
      });

      return {
        message: alertInfo.baseKey,
        tooltipTitle: _tooltipTitle2,
        options: {
          count: stepWithCloseToLimitErrorData.get('sendLimit') - stepWithCloseToLimitErrorData.get('availableSendsUntilMidnight'),
          limit: stepWithCloseToLimitErrorData.get('sendLimit')
        }
      };
    }
  },
  render: function render() {
    var alertInfo = getAlertInfoByWarningType(this.props.warningType);
    var messageProps = this.getMesssageProps(alertInfo);
    return /*#__PURE__*/_jsx(UITooltip, {
      title: messageProps.tooltipTitle,
      children: /*#__PURE__*/_jsxs("span", {
        className: classNames('sequence-enroll-footer-send-limit-alert', this.props.className),
        children: [/*#__PURE__*/_jsx(UIIcon, {
          className: "p-x-2",
          color: alertInfo.iconColor,
          name: "warning"
        }), /*#__PURE__*/_jsx(FormattedHTMLMessage, Object.assign({}, messageProps))]
      })
    });
  }
});
export default SendTimeAlert;