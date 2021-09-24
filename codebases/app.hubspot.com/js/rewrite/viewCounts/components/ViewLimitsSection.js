'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import HR from 'UIComponents/elements/HR';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useViewCountAndLimit } from '../hooks/useViewCountAndLimit';
var VIEW_WARNING_LIMIT_THRESHOLD = 5;

var ViewLimitsSection = function ViewLimitsSection() {
  var _useViewCountAndLimit = useViewCountAndLimit(),
      count = _useViewCountAndLimit.count,
      limit = _useViewCountAndLimit.limit;

  var isAtLimit = count >= limit;
  var isNearLimit = count + VIEW_WARNING_LIMIT_THRESHOLD >= limit;
  var showIcon = isAtLimit || isNearLimit;
  var tooltipTitle = isAtLimit ? 'index.views.viewLimits.atLimit.title' : 'index.views.viewLimits.warning.title';
  var tooltipMessage = isAtLimit ? 'index.views.viewLimits.atLimit.message' : 'index.views.viewLimits.warning.message';
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [showIcon && /*#__PURE__*/_jsx(UITooltip, {
      placement: "left",
      headingText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: tooltipTitle
      }),
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: tooltipMessage
      }),
      children: /*#__PURE__*/_jsx(UIIcon, {
        name: "warning",
        className: "m-right-2"
      })
    }), /*#__PURE__*/_jsx("strong", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.views.viewLimits.notification",
        options: {
          count: count,
          limit: limit
        }
      })
    }), /*#__PURE__*/_jsx(HR, {
      className: "m-top-3 m-bottom-1"
    })]
  });
};

export default ViewLimitsSection;