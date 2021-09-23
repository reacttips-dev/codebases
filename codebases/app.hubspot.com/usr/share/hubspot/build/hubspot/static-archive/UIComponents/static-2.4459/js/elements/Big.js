'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import AbstractTextElement from './AbstractTextElement';
export default function Big(_ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(AbstractTextElement, Object.assign({}, rest, {
    className: classNames('private-big', className)
  }));
}
Big.propTypes = AbstractTextElement.propTypes;
Big.defaultProps = AbstractTextElement.defaultProps;
Big.displayName = 'Big';