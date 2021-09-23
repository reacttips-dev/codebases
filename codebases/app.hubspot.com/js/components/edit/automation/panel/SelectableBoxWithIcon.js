'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIconHolder from 'UIComponents/icon/UIIconHolder';
import UISelectableBox from 'UIComponents/button/UISelectableBox';
import { HEFFALUMP, OLAF } from 'HubStyleTokens/colors';

var SelectableBoxWithIcon = function SelectableBoxWithIcon(_ref) {
  var onClick = _ref.onClick,
      iconName = _ref.iconName,
      _ref$backgroundColor = _ref.backgroundColor,
      backgroundColor = _ref$backgroundColor === void 0 ? HEFFALUMP : _ref$backgroundColor,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? OLAF : _ref$color,
      titleMessage = _ref.titleMessage,
      readOnly = _ref.readOnly,
      selected = _ref.selected,
      dataTestId = _ref['data-test-id'];
  return /*#__PURE__*/_jsx(UISelectableBox, {
    flush: true,
    block: true,
    onClick: onClick,
    readOnly: readOnly,
    selected: selected,
    className: "p-all-0 width-100 m-bottom-1 m-left-0",
    "data-test-id": dataTestId,
    children: /*#__PURE__*/_jsxs(UIFlex, {
      align: "stretch",
      children: [/*#__PURE__*/_jsx(UIIconHolder, {
        name: iconName,
        backgroundColor: backgroundColor,
        color: color,
        size: 20
      }), /*#__PURE__*/_jsx(UIFlex, {
        align: "center",
        justify: "between",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          className: "m-left-3 m-y-2 text-left",
          message: titleMessage
        })
      })]
    })
  });
};

SelectableBoxWithIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  titleMessage: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  readOnly: PropTypes.bool,
  'data-test-id': PropTypes.string
};
export default SelectableBoxWithIcon;