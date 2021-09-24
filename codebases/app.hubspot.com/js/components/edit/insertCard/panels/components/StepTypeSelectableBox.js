'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIconHolder from 'UIComponents/icon/UIIconHolder';
import UISelectableBox from 'UIComponents/button/UISelectableBox';

var StepTypeSelectableBox = function StepTypeSelectableBox(_ref) {
  var onClick = _ref.onClick,
      backgroundColor = _ref.backgroundColor,
      iconColor = _ref.iconColor,
      iconName = _ref.iconName,
      titleMessage = _ref.titleMessage,
      descriptionMessage = _ref.descriptionMessage,
      dataSeleniumTest = _ref.dataSeleniumTest,
      disabled = _ref.disabled;
  return /*#__PURE__*/_jsx(UISelectableBox, {
    flush: true,
    block: true,
    onClick: onClick,
    disabled: disabled,
    "data-selenium-test": dataSeleniumTest,
    children: /*#__PURE__*/_jsxs(UIFlex, {
      align: "stretch",
      children: [/*#__PURE__*/_jsx(UIIconHolder, {
        name: iconName,
        backgroundColor: backgroundColor,
        color: iconColor,
        size: 30,
        className: "align-center"
      }), /*#__PURE__*/_jsxs(UIFlex, {
        direction: "column",
        justify: "center",
        className: "p-all-3 text-left",
        children: [/*#__PURE__*/_jsx("b", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: titleMessage
          })
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: descriptionMessage
        })]
      })]
    })
  });
};

StepTypeSelectableBox.propTypes = {
  onClick: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  titleMessage: PropTypes.string.isRequired,
  descriptionMessage: PropTypes.string.isRequired,
  dataSeleniumTest: PropTypes.string,
  disabled: PropTypes.bool
};
export default StepTypeSelectableBox;