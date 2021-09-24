'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import formatShortDate from 'I18n/utils/formatShortDate';
import { sendLimitLearnMore } from 'sales-modal/lib/links';
import { getSendLimits as getSendLimitsSelector } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { isSameDay } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';

var DailyEmailLimit = function DailyEmailLimit(_ref) {
  var sendLimits = _ref.sendLimits,
      textClassName = _ref.textClassName,
      timezone = _ref.timezone;

  if (!sendLimits.size) {
    return null;
  }

  var firstStepTimestamp = sendLimits.keySeq().map(Number).min();
  var limit = sendLimits.first().get('sendLimit');
  var availableSends = sendLimits.getIn(["" + firstStepTimestamp, 'availableSendsUntilMidnight']);
  var options = {
    count: limit - availableSends,
    limit: I18n.formatNumber(limit),
    date: formatShortDate(I18n.moment(firstStepTimestamp).tz(timezone)),
    href: sendLimitLearnMore()
  };
  var alreadyScheduledKey = availableSends < limit ? 'alreadyScheduled_jsx' : 'zero_jsx';
  var dateKey = isSameDay(firstStepTimestamp, timezone) ? 'today' : 'laterDate';
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "sendTimeAlert.dailySendLimitTooltip." + dateKey + "." + alreadyScheduledKey,
      options: Object.assign({}, options),
      elements: {
        Link: UILink
      }
    }),
    children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      className: textClassName,
      message: "sendTimeAlert.dailySendLimit." + dateKey,
      options: Object.assign({}, options)
    })
  });
};

DailyEmailLimit.propTypes = {
  sendLimits: PropTypes.instanceOf(ImmutableMap).isRequired,
  textClassName: PropTypes.string,
  timezone: PropTypes.string.isRequired
};
export default connect(function (state) {
  return {
    sendLimits: getSendLimitsSelector(state)
  };
})(DailyEmailLimit);