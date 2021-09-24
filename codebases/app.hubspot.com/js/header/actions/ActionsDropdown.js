'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { ActionsDropdown as ActionsDropdownBehavior } from '../../extensions/constants/BehaviorTypes';
import { useBehavior } from '../../extensions/hooks/useBehavior';
import BehaviorRenderer from '../../extensions/components/BehaviorRenderer';
import { CrmLogger } from 'customer-data-tracking/loggers';

var ActionsDropdown = function ActionsDropdown() {
  var entries = useBehavior(ActionsDropdownBehavior);

  if (!entries.length) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIDropdown, {
    buttonSize: "small",
    "data-selenium-test": "index-topbar-dropdown",
    buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.actions"
    }),
    buttonUse: "secondary",
    closeOnMenuClick: false,
    onClick: function onClick() {
      return CrmLogger.log('indexInteractions', {
        action: 'open actions dropdown'
      });
    },
    children: /*#__PURE__*/_jsx(UIList, {
      children: entries.map(function (Button, index) {
        return /*#__PURE__*/_jsx(BehaviorRenderer, {
          Component: Button
        }, index);
      })
    })
  });
};

export default ActionsDropdown;