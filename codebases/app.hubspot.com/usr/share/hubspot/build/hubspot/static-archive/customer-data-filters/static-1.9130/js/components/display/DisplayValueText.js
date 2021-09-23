'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
export default function DisplayValueText(props) {
  var value = props.value;
  return value ? /*#__PURE__*/_jsx("span", {
    children: value
  }) : null;
}
DisplayValueText.propTypes = {
  value: PropTypes.oneOfType([PropTypes.element, PropTypes.node, PropTypes.string])
};