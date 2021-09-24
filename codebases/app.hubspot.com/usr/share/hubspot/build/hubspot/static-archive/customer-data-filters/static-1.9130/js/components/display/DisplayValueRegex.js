'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
var RegexSpan = styled.span.withConfig({
  displayName: "DisplayValueRegex__RegexSpan",
  componentId: "sc-13myw3n-0"
})(["word-break:break-all;"]);
export default function DisplayValueRegex(props) {
  var value = props.value;
  return value ? /*#__PURE__*/_jsx(RegexSpan, {
    "data-selenium-test": "RegexSpan",
    children: value
  }) : null;
}
DisplayValueRegex.propTypes = {
  value: PropTypes.string.isRequired
};