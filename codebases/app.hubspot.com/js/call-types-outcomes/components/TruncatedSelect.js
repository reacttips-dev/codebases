'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import partial from 'transmute/partial';
import UISelect from 'UIComponents/input/UISelect';
import UITruncateString from 'UIComponents/text/UITruncateString';

var TruncatedSelectValue = function TruncatedSelectValue(maxWidth, _ref) {
  var children = _ref.children,
      rest = _objectWithoutProperties(_ref, ["children"]);

  return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
    children: /*#__PURE__*/_jsx(UITruncateString, {
      placement: "bottom right",
      maxWidth: maxWidth,
      children: children
    })
  }));
};

function TruncatedSelect(_ref2) {
  var maxValueWidth = _ref2.maxValueWidth,
      rest = _objectWithoutProperties(_ref2, ["maxValueWidth"]);

  return /*#__PURE__*/_jsx(UISelect, Object.assign({
    valueComponent: partial(TruncatedSelectValue, maxValueWidth)
  }, rest));
}

TruncatedSelect.propTypes = {
  maxValueWidth: PropTypes.number.isRequired
};
export default TruncatedSelect;