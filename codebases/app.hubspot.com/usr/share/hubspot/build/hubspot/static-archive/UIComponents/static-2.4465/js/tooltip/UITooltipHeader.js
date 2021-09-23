'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import H5 from '../elements/headings/H5';
export default function UITooltipHeader(_ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(H5, Object.assign({}, rest, {
    className: classNames('private-tooltip__heading', className)
  }));
}
UITooltipHeader.propTypes = {
  children: PropTypes.node
};
UITooltipHeader.displayName = 'UITooltipHeader';