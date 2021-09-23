'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FilterOperatorValueInput from './FilterOperatorValueInput';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { memo } from 'react';

var FilterOperatorHighValueInput = function FilterOperatorHighValueInput(props) {
  var className = props.className,
      rest = _objectWithoutProperties(props, ["className"]);

  return /*#__PURE__*/_jsxs("div", {
    className: className,
    children: [/*#__PURE__*/_jsx(FilterOperatorValueInput, Object.assign({
      className: "m-bottom-1",
      fieldName: "value"
    }, rest)), /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataFilters.FilterEditorOperatorDisplayList.separatorAnd"
    }), /*#__PURE__*/_jsx(FilterOperatorValueInput, Object.assign({
      className: "m-top-1",
      fieldName: "highValue"
    }, rest))]
  });
};

FilterOperatorHighValueInput.propTypes = {
  className: PropTypes.string
};
export default /*#__PURE__*/memo(FilterOperatorHighValueInput);