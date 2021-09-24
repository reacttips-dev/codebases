'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { CALYPSO } from 'HubStyleTokens/colors';
import { broadcastProp } from '../../lib/propTypes';

var BroadcastInteractions = function BroadcastInteractions(_ref) {
  var broadcast = _ref.broadcast;

  if (broadcast.supportsInteractions()) {
    return /*#__PURE__*/_jsx("td", {
      "data-test": "broadcast-clicks",
      className: "text-right",
      children: I18n.formatNumber(broadcast.interactionsCount)
    });
  }

  return /*#__PURE__*/_jsxs("td", {
    "data-test": "broadcast-interactions",
    className: "text-right",
    children: [/*#__PURE__*/_jsx(UITooltip, {
      title: I18n.text('sui.broadcasts.instagram.interactions'),
      children: /*#__PURE__*/_jsxs("span", {
        className: "instagram-interactions-info",
        children: [/*#__PURE__*/_jsx("span", {
          children: I18n.text('sui.broadcasts.na')
        }, "na"), /*#__PURE__*/_jsx(UIIcon, {
          className: "icon",
          name: "info",
          color: CALYPSO
        })]
      })
    }, "tooltip"), ")"]
  });
};

BroadcastInteractions.propTypes = {
  broadcast: broadcastProp
};
export default BroadcastInteractions;