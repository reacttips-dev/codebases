'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'I18n';
import { ICON_SIZES } from '../icon/IconConstants';
import UIIcon from '../icon/UIIcon';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
export default function UILockBadge(_ref) {
  var className = _ref.className,
      size = _ref.size,
      titleText = _ref.titleText,
      rest = _objectWithoutProperties(_ref, ["className", "size", "titleText"]);

  var classes = classNames('private-lock-badge', className);
  return /*#__PURE__*/_jsx(UIIcon, Object.assign({}, rest, {
    "aria-label": lazyEval(titleText),
    className: classes,
    name: "locked",
    size: size
  }));
}
UILockBadge.propTypes = {
  size: PropTypes.oneOfType([PropTypes.oneOf(Object.keys(ICON_SIZES)), PropTypes.number]),
  titleText: createLazyPropType(PropTypes.string).isRequired
};
UILockBadge.defaultProps = {
  titleText: function titleText() {
    return I18n.text('salesUI.UILockBadge.title');
  }
};
UILockBadge.displayName = 'UILockBadge';