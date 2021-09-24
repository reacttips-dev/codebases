'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import UIIconButton from 'UIComponents/button/UIIconButton';
import AbstractRouterLink from './internal/AbstractRouterLink';
import useIsActive from './internal/useIsActive';
export default function UIRouterIconButton(props) {
  var to = props.to,
      _props$exact = props.exact,
      exact = _props$exact === void 0 ? false : _props$exact,
      rest = _objectWithoutProperties(props, ["to", "exact"]);

  var active = useIsActive(to, exact);
  return /*#__PURE__*/_jsx(AbstractRouterLink, Object.assign({}, rest, {
    to: to,
    active: active,
    component: UIIconButton
  }));
}

var _AbstractRouterLink$p = AbstractRouterLink.propTypes,
    __ = _AbstractRouterLink$p.component,
    sanitizedAbstractRouterLinkPropTypes = _objectWithoutProperties(_AbstractRouterLink$p, ["component"]);

UIRouterIconButton.propTypes = Object.assign({}, sanitizedAbstractRouterLinkPropTypes, {}, UIIconButton.propTypes);
UIRouterIconButton.defaultProps = Object.assign({}, UIIconButton.defaultProps, {
  use: 'tertiary-light'
});