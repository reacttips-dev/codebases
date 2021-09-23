'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import Small from 'UIComponents/elements/Small';
import UIIcon from 'UIComponents/icon/UIIcon';
import { listProp } from '../../lib/propTypes';

var BroadcastPostTargetOverview = function BroadcastPostTargetOverview(_ref) {
  var targetLocations = _ref.targetLocations,
      targetLanguages = _ref.targetLanguages;

  if (targetLocations.isEmpty() && targetLanguages.isEmpty()) {
    return null;
  }

  return /*#__PURE__*/_jsxs(Small, {
    className: "post-target-information",
    children: [/*#__PURE__*/_jsx(UIIcon, {
      name: "audienceTargeting"
    }), ' ', /*#__PURE__*/_jsx("span", {
      className: "label",
      children: I18n.text('sui.composer.message.postTargeting.title.withTargets')
    })]
  });
};

BroadcastPostTargetOverview.propTypes = {
  targetLocations: listProp,
  targetLanguages: listProp
};
export default BroadcastPostTargetOverview;