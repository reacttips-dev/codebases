'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import AbstractTextElement from './AbstractTextElement';
export default function Small(_ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(AbstractTextElement, Object.assign({}, rest, {
    className: classNames('private-microcopy', className)
  }));
}
Small.propTypes = AbstractTextElement.propTypes;
Small.defaultProps = Object.assign({}, AbstractTextElement.defaultProps, {
  tagName: 'small'
});
Small.displayName = 'Small';