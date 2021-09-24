'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { FLINT } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { getDataAttributes } from '../utils/getDataAttributes';

var renderTooltipTitle = function renderTooltipTitle(property) {
  if (property && property.label) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataProperties.PropertyInputHidden.noPermissionWithLabel",
      options: {
        propertyLabel: property.label
      }
    });
  }

  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "customerDataProperties.PropertyInputHidden.noPermission"
  });
};

var PropertyInputHidden = /*#__PURE__*/forwardRef(function (props, ref) {
  return /*#__PURE__*/_jsx("span", Object.assign({
    ref: ref
  }, getDataAttributes(props), {
    children: /*#__PURE__*/_jsx(UITooltip, {
      title: renderTooltipTitle(props.property),
      autoPlacement: true,
      children: /*#__PURE__*/_jsx(UIIcon, {
        name: "hide",
        size: "xxs",
        color: FLINT
      })
    })
  }));
});
export default PropertyInputHidden;