'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { FLINT, KOALA } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import styled from 'styled-components';
var Wrapper = styled.div.withConfig({
  displayName: "FilterEditorAndSeparator__Wrapper",
  componentId: "sc-1f3qduo-0"
})(["color:", ";line-height:1rem;"], FLINT);
var VerticalLine = styled.div.withConfig({
  displayName: "FilterEditorAndSeparator__VerticalLine",
  componentId: "sc-1f3qduo-1"
})(["margin-left:12px;height:", ";border-left:1px solid ", ";"], function (_ref) {
  var _ref$height = _ref.height,
      height = _ref$height === void 0 ? '8px' : _ref$height;
  return height;
}, KOALA);

var FilterEditorAndSeparator = function FilterEditorAndSeparator(props) {
  var isLineDisabled = props.isLineDisabled,
      rest = _objectWithoutProperties(props, ["isLineDisabled"]);

  return /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, rest, {
    children: [!isLineDisabled && /*#__PURE__*/_jsx(VerticalLine, {
      height: "8px"
    }), /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataFilters.FilterEditorOperatorDisplayList.separatorAnd"
    }), !isLineDisabled && /*#__PURE__*/_jsx(VerticalLine, {
      height: "7px"
    })]
  }));
};

FilterEditorAndSeparator.propTypes = {
  isLineDisabled: PropTypes.bool.isRequired
};
FilterEditorAndSeparator.defaultProps = {
  isLineDisabled: false
};
export default FilterEditorAndSeparator;