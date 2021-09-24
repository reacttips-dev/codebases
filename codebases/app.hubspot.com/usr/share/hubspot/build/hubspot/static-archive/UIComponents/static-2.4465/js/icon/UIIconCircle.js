'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UIIconHolder from './UIIconHolder';
export default function UIIconCircle(props) {
  var borderColor = props.borderColor,
      className = props.className,
      color = props.color,
      iconClassName = props.iconClassName,
      legacy = props.legacy,
      padding = props.padding,
      rest = _objectWithoutProperties(props, ["borderColor", "className", "color", "iconClassName", "legacy", "padding"]);

  var outerCircleClassNames = classNames('private-icon-circle__outer', className, legacy && 'private-icon-circle--legacy');
  var innerCircleClassNames = classNames('private-icon-circle__inner', iconClassName);
  return /*#__PURE__*/_jsx(UIIconHolder, Object.assign({}, rest, {
    borderColor: borderColor || color,
    borderRadius: "50%",
    className: outerCircleClassNames,
    innerClassName: innerCircleClassNames,
    padding: legacy ? 0 : padding,
    color: color
  }));
}
UIIconCircle.propTypes = {
  backgroundColor: UIIconHolder.propTypes.backgroundColor,
  borderColor: UIIconHolder.propTypes.borderColor,
  borderStyle: UIIconHolder.propTypes.borderStyle,
  borderWidth: UIIconHolder.propTypes.borderWidth,
  verticalAlign: UIIconHolder.propTypes.verticalAlign,
  innerStyles: PropTypes.object,
  iconClassName: PropTypes.string,
  name: UIIconHolder.propTypes.name,
  color: PropTypes.string,
  size: PropTypes.number,
  padding: PropTypes.number,
  legacy: PropTypes.bool
};
UIIconCircle.defaultProps = {
  borderWidth: 1,
  borderStyle: 'solid',
  padding: 0.75
};
UIIconCircle.displayName = 'UIIconCircle';