'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import BroadcastRowTime from '../app/BroadcastRowTime';
import { broadcastProp } from '../../lib/propTypes';
/**
 * Deprecated in favor of '../../posts/BroadcastScheduledFor'
 * Should be able to delete completely as soon as Manage dash is done: https://git.hubteam.com/HubSpot/SocialMediaTeam/issues/126
 */

var BroadcastScheduledFor = function BroadcastScheduledFor(_ref) {
  var broadcast = _ref.broadcast,
      showDate = _ref.showDate;

  if (!showDate) {
    return null;
  }

  var date = broadcast.getPublishTime();

  if (date === 0) {
    return /*#__PURE__*/_jsx("td", {
      "data-test": "scheduled-for",
      className: "at",
      children: I18n.text('sui.broadcasts.triggerAt.notSet')
    });
  }

  return /*#__PURE__*/_jsx("td", {
    "data-test": "scheduled-for",
    className: "at",
    children: /*#__PURE__*/_jsx(BroadcastRowTime, {
      date: date,
      isVideo: broadcast.isVideo(),
      broadcastStatus: broadcast.status
    })
  });
};

BroadcastScheduledFor.propTypes = {
  broadcast: broadcastProp,
  showDate: PropTypes.bool.isRequired
};
export default BroadcastScheduledFor;