'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedNumber from 'I18n/components/FormattedNumber';
import UIWellHelpText from 'UIComponents/well/UIWellHelpText';
import { accountTypeProp } from '../../lib/propTypes';
import { ACCOUNT_TYPES } from '../../lib/constants';
import WellItem from './WellItem';
var REACTION_TYPE_TO_COUNT_KEY = ImmutableMap({
  angries: 'angry',
  hahas: 'haha',
  likes: 'like',
  loves: 'love',
  sads: 'sad',
  // thankfuls: 'thankful',
  wows: 'wow'
});
export var ReactionWell = function ReactionWell(_ref) {
  var allowDrilldown = _ref.allowDrilldown,
      network = _ref.network,
      onDrillDownInteraction = _ref.onDrillDownInteraction,
      reactionsByType = _ref.reactionsByType,
      reactionsTotal = _ref.reactionsTotal;

  if (network !== ACCOUNT_TYPES.facebook || !reactionsByType) {
    return null;
  }

  var reactionTypes = REACTION_TYPE_TO_COUNT_KEY.filter(function (type, countType) {
    return reactionsByType.get(countType) > 0;
  });

  if (reactionTypes.isEmpty()) {
    return null;
  }

  return /*#__PURE__*/_jsx(WellItem, {
    className: "broadcast-details-interaction-stats__reaction",
    label: "reaction",
    onClick: allowDrilldown && reactionsTotal > 0 ? onDrillDownInteraction : undefined,
    value: reactionsTotal,
    children: /*#__PURE__*/_jsx(UIWellHelpText, {
      children: reactionTypes.map(function (type, countType) {
        return /*#__PURE__*/_jsxs("span", {
          children: [/*#__PURE__*/_jsx("span", {
            className: "m-right-2 reaction-emoji reaction-type-" + type.replace('FACEBOOK_REACT_', '').toLowerCase()
          }, "reaction-type-" + type), /*#__PURE__*/_jsx("span", {
            className: "reaction-count m-right-5",
            children: /*#__PURE__*/_jsx(FormattedNumber, {
              className: "reaction-count",
              value: reactionsByType.get(countType, 0)
            })
          })]
        }, "fb-reaction-" + type);
      }).toList()
    })
  });
};
ReactionWell.propTypes = {
  allowDrilldown: PropTypes.bool.isRequired,
  network: accountTypeProp,
  onDrillDownInteraction: PropTypes.func,
  reactionsByType: PropTypes.object,
  reactionsTotal: PropTypes.number
};
export default ReactionWell;