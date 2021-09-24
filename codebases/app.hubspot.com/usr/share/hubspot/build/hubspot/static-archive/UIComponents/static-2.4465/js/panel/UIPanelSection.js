'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import UISection from '../section/UISection';
export default function UIPanelSection(_ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(UISection, Object.assign({}, rest, {
    className: classNames(className, 'private-panel__section')
  }));
}
UIPanelSection.propTypes = Object.assign({}, UISection.propTypes, {
  children: PropTypes.node
});
UIPanelSection.defaultProps = Object.assign({}, UISection.defaultProps);
UIPanelSection.displayName = 'UIPanelSection';