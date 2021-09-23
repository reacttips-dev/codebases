'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';

var SelectHoverButton = function SelectHoverButton(props) {
  return /*#__PURE__*/_jsx(UIButton, {
    onClick: props.onSelect,
    size: "extra-small",
    use: "tertiary-light",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "selectTable.rows.hoverButtons.select"
    })
  });
};

SelectHoverButton.propTypes = {
  onSelect: PropTypes.func.isRequired
};
export default SelectHoverButton;