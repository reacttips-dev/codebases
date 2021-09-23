'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';

var Code = function Code(props) {
  var className = props.className,
      rest = _objectWithoutProperties(props, ["className"]);

  return /*#__PURE__*/_jsx("code", Object.assign({}, rest, {
    className: classNames(className, 'private-code')
  }));
};

export default Code;
Code.displayName = 'Code';