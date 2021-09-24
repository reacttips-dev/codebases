'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UIStatusTag from 'UIComponents/tag/UIStatusTag';
import { FORMAT_TIME_FULL, FORMAT_MM_DD_YYYY, FORMAT_DAY_NAME, BROADCAST_STATUS } from '../../lib/constants';

var getStatusTag = function getStatusTag(isVideo, status, portalTime) {
  if (status) {
    var timeDisplay = portalTime.format(FORMAT_TIME_FULL);

    if (isVideo && status === BROADCAST_STATUS.RUNNING) {
      return /*#__PURE__*/_jsx(UIStatusTag, {
        use: "success",
        className: "status-tag",
        children: I18n.text('sui.broadcasts.row.status.running', {
          timeDisplay: timeDisplay
        })
      });
    } else if (status === BROADCAST_STATUS.ERROR_RETRY) {
      return /*#__PURE__*/_jsx(UIStatusTag, {
        use: "warning",
        className: "status-tag",
        children: I18n.text('sui.broadcasts.row.status.errorRetry', {
          timeDisplay: timeDisplay
        })
      });
    }
  }

  return null;
};

var renderTimeLabels = function renderTimeLabels(date, status) {
  if (status) {
    return status;
  }

  var portalTime = I18n.moment(date).portalTz();
  return [/*#__PURE__*/_jsx("span", {
    className: "time",
    children: portalTime.format(FORMAT_DAY_NAME)
  }, "weekday"), /*#__PURE__*/_jsx("span", {
    className: "time",
    children: portalTime.format(FORMAT_TIME_FULL)
  }, "timefull")];
};

var BroadcastRowTime = function BroadcastRowTime(_ref) {
  var date = _ref.date,
      isVideo = _ref.isVideo,
      broadcastStatus = _ref.broadcastStatus;
  var portalTime = I18n.moment(date).portalTz();
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx("span", {
      className: "date",
      children: portalTime.format(FORMAT_MM_DD_YYYY)
    }), renderTimeLabels(date, getStatusTag(isVideo, broadcastStatus, portalTime))]
  });
};

BroadcastRowTime.propTypes = {
  date: PropTypes.number.isRequired,
  isVideo: PropTypes.bool,
  broadcastStatus: PropTypes.string
};
export default BroadcastRowTime;