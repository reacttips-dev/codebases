'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { setupStyledComponents } from '../listeners/setupStyledComponents';
import ComponentWithBodyClass from '../utils/ComponentWithBodyClass';
export default function UIApplication(props) {
  var _bodyElement = props._bodyElement,
      bodyClassName = props.bodyClassName,
      name = props.name,
      rest = _objectWithoutProperties(props, ["_bodyElement", "bodyClassName", "name"]);

  useEffect(setupStyledComponents, []);
  return /*#__PURE__*/_jsx(ComponentWithBodyClass, {
    bodyClassName: classNames('ui-app', bodyClassName),
    bodyElement: _bodyElement,
    children: /*#__PURE__*/_jsx("div", Object.assign({
      "data-application-name": name
    }, rest))
  });
}
UIApplication.propTypes = {
  _bodyElement: PropTypes.object,
  bodyClassName: PropTypes.string,
  name: PropTypes.string.isRequired
};
UIApplication.displayName = 'UIApplication';