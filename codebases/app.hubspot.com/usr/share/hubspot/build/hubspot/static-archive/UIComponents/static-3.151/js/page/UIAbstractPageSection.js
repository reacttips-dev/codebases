'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
export default function UIAbstractPageSection(props) {
  var className = props.className,
      rest = _objectWithoutProperties(props, ["className"]);

  return /*#__PURE__*/_jsx("section", Object.assign({}, rest, {
    className: classNames('private-template__section', className)
  }));
}
UIAbstractPageSection.propTypes = {
  children: PropTypes.node
};
UIAbstractPageSection.displayName = 'UIAbstractPageSection';