'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import devLogger from 'react-utils/devLogger';
import Controllable from '../decorators/Controllable';
import UISelectableBox from './UISelectableBox';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
var SIZE_CLASSES = {
  auto: 'private-selectable-button--auto',
  sm: 'private-selectable-button--small',
  lg: 'private-selectable-button--large'
};

function UISelectableButton(_ref) {
  var children = _ref.children,
      className = _ref.className,
      name = _ref.name,
      size = _ref.size,
      textLabel = _ref.textLabel,
      type = _ref.type,
      truncatable = _ref.truncatable,
      rest = _objectWithoutProperties(_ref, ["children", "className", "name", "size", "textLabel", "type", "truncatable"]);

  if (process.env.NODE_ENV !== 'production') {
    if (textLabel == null && children == null) {
      devLogger.warn({
        message: 'UISelectableButton: Should provide either textLabel or children.',
        key: 'UISelectableButton: content'
      });
    }

    if (type === 'radio' && !name) {
      devLogger.warn({
        message: 'UISelectableButton: If type is set to radio you must provide a name',
        key: 'UISelectableButton: no name value'
      });
    }
  }

  var shorhandSize = toShorthandSize(size);
  var maybeSelectionMarkClass = shorhandSize === 'lg' ? '' : "private-selectable-button__label--" + (type === 'default' ? 'no-selection-mark' : 'selection-mark');
  var computedSelectionMarkLocation;

  if (type !== 'default') {
    computedSelectionMarkLocation = shorhandSize === 'lg' ? 'top-right' : 'left';
  }

  return /*#__PURE__*/_jsxs(UISelectableBox, Object.assign({
    className: classNames('private-selectable-button', SIZE_CLASSES[shorhandSize], className),
    innerClassName: 'private-selectable-button__inner' + (truncatable ? " private-selectable-button__inner--truncatable" : ""),
    name: type === 'default' ? undefined : name,
    padded: false,
    selectionMarkLocation: computedSelectionMarkLocation,
    type: type
  }, rest, {
    children: [children, textLabel ? /*#__PURE__*/_jsx("span", {
      className: classNames("private-selectable-button__label private-selectable-button__label--" + (!truncatable ? 'not-' : '') + "truncatable", maybeSelectionMarkClass),
      children: textLabel
    }) : null]
  }));
}

UISelectableButton.propTypes = {
  'aria-checked': PropTypes.bool,
  block: PropTypes.bool,
  children: PropTypes.node,
  disabled: PropTypes.bool.isRequired,
  name: PropTypes.string,

  /**
   * A `Controllable` function that is called when the `selected` value changes
   * in non-`radio` `type`s. To control `radio`s, use `onClick` instead.
   */
  onSelectedChange: PropTypes.func,
  readOnly: PropTypes.bool,
  selected: PropTypes.bool,
  size: PropTypes.oneOfType([propTypeForSizes(['sm', 'lg']), PropTypes.oneOf(['auto'])]).isRequired,
  textLabel: PropTypes.node,
  truncatable: PropTypes.bool,
  type: PropTypes.oneOf(['default', 'checkbox', 'radio']).isRequired
};
UISelectableButton.defaultProps = {
  disabled: false,
  readOnly: false,
  selected: false,
  size: 'sm',
  truncatable: true,
  type: 'default'
};
UISelectableButton.displayName = 'UISelectableButton';
export default Controllable(UISelectableButton, ['selected']);