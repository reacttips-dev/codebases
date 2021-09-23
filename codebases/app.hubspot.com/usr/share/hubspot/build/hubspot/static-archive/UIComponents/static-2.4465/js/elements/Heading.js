'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { hidden } from '../utils/propTypes/decorators';
var Heading = styled(function (props) {
  var Tag = props.tagName,
      rest = _objectWithoutProperties(props, ["tagName"]);

  return /*#__PURE__*/_jsx(Tag, Object.assign({}, rest));
}).withConfig({
  displayName: "Heading",
  componentId: "sc-19dyenk-0"
})([""]);
Heading.propTypes = {
  'aria-level': PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  tagName: hidden(PropTypes.elementType.isRequired)
};
Heading.defaultProps = {
  'aria-level': 2,
  tagName: 'span'
};
export default Heading;