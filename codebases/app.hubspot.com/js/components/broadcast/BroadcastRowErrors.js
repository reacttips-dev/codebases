'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import SocialContext from '../app/SocialContext';
import { Set as ImmutableSet } from 'immutable';
import I18n from 'I18n';
import UIList from 'UIComponents/list/UIList';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import UILink from 'UIComponents/link/UILink';
import UIStatusTag from 'UIComponents/tag/UIStatusTag';
import UIIcon from 'UIComponents/icon/UIIcon';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { getAppRoot } from '../../lib/constants';
import { getStatusTagType } from '../../lib/utils';

var getAccountStatusMessage = function getAccountStatusMessage(errors) {
  if (errors.size > 1) {
    return I18n.text('sui.broadcasts.row.errors.newIssueUX.multipleIssues');
  }

  var error = errors.first();
  return I18n.text("sui.broadcasts.row.errors.newIssueUX." + error + ".overview");
};

function BroadcastRowErrors(_ref) {
  var _ref$errors = _ref.errors,
      errors = _ref$errors === void 0 ? ImmutableSet() : _ref$errors,
      portalId = _ref.portalId;

  var _useContext = useContext(SocialContext),
      trackInteraction = _useContext.trackInteraction;

  if (errors.isEmpty()) {
    return null;
  }

  var renderTooltipContent = function renderTooltipContent() {
    trackInteraction('render tooltip', {
      errors: errors.join(', ')
    }, {
      onlyOnce: true
    });
    return /*#__PURE__*/_jsx(UITooltipContent, {
      children: /*#__PURE__*/_jsx(UIList, {
        styled: true,
        childClassName: "m-bottom-3",
        lastChildClassName: "",
        className: "uploaded-error-list",
        children: errors.toArray().map(function (error) {
          return /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "sui.broadcasts.row.errors.newIssueUX." + error + ".message_jsx",
            elements: {
              UILink: UILink
            },
            options: {
              onClick: function onClick(e) {
                e.stopPropagation();
                trackInteraction('broadcast error settings link clicked');
              },
              url: "/" + getAppRoot() + "/" + portalId + "/settings"
            }
          }, error);
        })
      })
    });
  };

  return /*#__PURE__*/_jsx(UITooltip, {
    Content: renderTooltipContent,
    use: "longform",
    children: /*#__PURE__*/_jsx(UIStatusTag, {
      use: getStatusTagType(errors),
      className: "m-top-1",
      children: /*#__PURE__*/_jsxs(UILink, {
        use: "unstyled",
        children: [getAccountStatusMessage(errors), ' ', /*#__PURE__*/_jsx(UIIcon, {
          name: "info",
          className: "info"
        })]
      })
    })
  });
}

export default BroadcastRowErrors;