'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import classNames from 'classnames';
var UIDialogBody = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx("div", Object.assign({
    ref: ref
  }, rest, {
    className: classNames("uiDialogBody private-modal__body has--vertical-spacing", className)
  }));
});
UIDialogBody.propTypes = {
  children: PropTypes.node
};
UIDialogBody.displayName = 'UIDialogBody';
export default UIDialogBody;