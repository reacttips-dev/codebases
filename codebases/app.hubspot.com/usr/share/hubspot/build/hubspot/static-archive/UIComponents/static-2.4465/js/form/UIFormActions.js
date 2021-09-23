'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UISection from '../section/UISection';
import classNames from 'classnames';
export default function UIFormActions(_ref) {
  var children = _ref.children,
      className = _ref.className,
      other = _objectWithoutProperties(_ref, ["children", "className"]);

  var classes = classNames(className, 'private-form-actions');
  return /*#__PURE__*/_jsx(UISection, Object.assign({}, other, {
    className: classes,
    children: children
  }));
}
UIFormActions.propTypes = {
  children: PropTypes.node.isRequired
};
UIFormActions.displayName = 'UIFormActions';