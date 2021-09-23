'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import omit from '../utils/underscore/omit';
import Controllable from '../decorators/Controllable';
import classNames from 'classnames';
import devLogger from 'react-utils/devLogger';
import UIAbstractNumberInput from './abstract/UIAbstractNumberInput';
import UITextInput from './UITextInput';
import ShareInput from '../decorators/ShareInput';

function UINumberInput(_ref) {
  var className = _ref.className,
      type = _ref.type,
      props = _objectWithoutProperties(_ref, ["className", "type"]);

  if (type !== UITextInput.defaultProps.type) {
    devLogger.warn({
      message: 'UINumberInput: The `type` prop is a no-op (#4178)',
      key: 'UINumberInput: type'
    });
  }

  return /*#__PURE__*/_jsx(UIAbstractNumberInput, Object.assign({}, props, {
    children: function children(numberProps) {
      return /*#__PURE__*/_jsx(UITextInput, Object.assign({}, numberProps, {
        className: classNames('uiNumberInput', className),
        type: "text"
      }));
    }
  }));
}

UINumberInput.propTypes = Object.assign({}, omit(UITextInput.propTypes, ['type']), {}, omit(UIAbstractNumberInput.propTypes, ['children']));
UINumberInput.defaultProps = Object.assign({}, UITextInput.defaultProps, {}, UIAbstractNumberInput.defaultProps);
UINumberInput.displayName = 'UINumberInput';
export default ShareInput(Controllable(UINumberInput));