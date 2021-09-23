'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UIAlert from '../alert/UIAlert';
export default function UIFireAlarm(_ref) {
  var className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["className"]);

  return /*#__PURE__*/_jsx(UIAlert, Object.assign({}, rest, {
    className: classNames('private-alert--system-wide', className)
  }));
}
UIFireAlarm.propTypes = Object.assign({}, UIAlert.propTypes, {
  type: PropTypes.oneOf(['danger', 'info', 'warning']).isRequired
});
UIFireAlarm.defaultProps = Object.assign({}, UIAlert.defaultProps, {
  type: 'warning'
});
UIFireAlarm.displayName = 'UIFireAlarm';