'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import { getCreateTeamsURL } from 'sales-content-partitioning/lib/Links';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import UIResultsMessage from 'UIComponents/results/UIResultsMessage';

var TeamsZeroState = function TeamsZeroState() {
  return /*#__PURE__*/_jsxs(UIResultsMessage, {
    illustration: "team",
    illustrationProps: {
      width: 200
    },
    title: I18n.text('salesContentPartitioning.teamsZeroState.title'),
    children: [/*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentPartitioning.teamsZeroState.message"
      })
    }), /*#__PURE__*/_jsx(UILink, {
      target: "_blank",
      href: getCreateTeamsURL(),
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentPartitioning.teamsZeroState.clickHereToMakeTeams"
      })
    })]
  });
};

export default TeamsZeroState;