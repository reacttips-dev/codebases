'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedNumber from 'I18n/components/FormattedNumber';
import UIWellItem from 'UIComponents/well/UIWellItem';
import UIWellLabel from 'UIComponents/well/UIWellLabel';
import UIWellBigNumber from 'UIComponents/well/UIWellBigNumber';
import UIButton from 'UIComponents/button/UIButton';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';

var WellItem = function WellItem(_ref) {
  var children = _ref.children,
      numberNode = _ref.numberNode,
      label = _ref.label,
      _onClick = _ref.onClick,
      onHover = _ref.onHover,
      tooltip = _ref.tooltip,
      value = _ref.value;
  var tooltipProps = {};

  if (onHover) {
    tooltipProps.onOpenChange = onHover;
  }

  return /*#__PURE__*/_jsxs(UIWellItem, {
    className: "broadcast-details-interaction-stats__" + label,
    children: [/*#__PURE__*/_jsxs(UIWellLabel, {
      children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "sui.interactions.types." + label + ".label",
        options: {
          count: 2
        }
      }), tooltip && /*#__PURE__*/_jsx(UIHelpIcon, {
        className: "m-left-1",
        title: tooltip,
        tooltipProps: tooltipProps
      })]
    }), /*#__PURE__*/_jsx(UIWellBigNumber, {
      className: "broadcast-details-interaction-stats__value",
      children: _onClick && value > 0 ? /*#__PURE__*/_jsx(UIButton, {
        use: "link",
        onClick: function onClick() {
          return _onClick(label);
        },
        children: numberNode || /*#__PURE__*/_jsx(FormattedNumber, {
          value: value
        })
      }) : numberNode || /*#__PURE__*/_jsx(FormattedNumber, {
        value: value || 0
      })
    }), children]
  });
};

WellItem.propTypes = {
  children: PropTypes.node,
  numberNode: PropTypes.node,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  tooltip: PropTypes.string,
  value: PropTypes.number,
  valueFormatted: PropTypes.string
};
export default WellItem;