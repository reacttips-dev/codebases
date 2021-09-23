'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { BUTTON_DISABLED_TEXT, CALYPSO_LIGHT, KOALA } from 'HubStyleTokens/colors';
import FilterFieldType from '../propTypes/FilterFieldType';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import classNames from 'classnames';
import styled from 'styled-components';
var PropertyRowButton = styled(UIButton).attrs({
  use: 'unstyled'
}).withConfig({
  displayName: "FieldSelectItemComponent__PropertyRowButton",
  componentId: "sc-1q1dfz4-0"
})(["background-color:", ";color:", ";cursor:", ";&:active,&:focus,&:hover{background-color:", ";}"], function (_ref) {
  var disabled = _ref.disabled;
  return disabled && KOALA + " !important";
}, function (_ref2) {
  var disabled = _ref2.disabled;
  return disabled && BUTTON_DISABLED_TEXT + " !important";
}, function (_ref3) {
  var disabled = _ref3.disabled;
  return disabled && 'not-allowed';
}, CALYPSO_LIGHT);

var FieldSelectItemComponent = function FieldSelectItemComponent(props) {
  var className = props.className,
      disabled = props.disabled,
      __field = props.field,
      rest = _objectWithoutProperties(props, ["className", "disabled", "field"]);

  return /*#__PURE__*/_jsx(PropertyRowButton, Object.assign({
    className: classNames(className, disabled && "disabled"),
    disabled: disabled
  }, rest));
};

FieldSelectItemComponent.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  field: FilterFieldType
};
export default FieldSelectItemComponent;