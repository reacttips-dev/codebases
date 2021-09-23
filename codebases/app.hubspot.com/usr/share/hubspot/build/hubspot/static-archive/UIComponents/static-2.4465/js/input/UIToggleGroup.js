'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Children, cloneElement } from 'react';
import { warnIfFragment } from '../utils/devWarnings';
import classNames from 'classnames';
/**
 * Group clusters of Radio/Checkbox Buttons together, with common styling
 **/

export default function UIToggleGroup(props) {
  /* eslint-disable react/prop-types */
  var ariaLabelledBy = props['aria-labelledby'],
      children = props.children,
      __error = props.error,
      inline = props.inline,
      name = props.name,
      rest = _objectWithoutProperties(props, ["aria-labelledby", "children", "error", "inline", "name"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
    children: Children.map(children, function (child) {
      warnIfFragment(child, UIToggleGroup.displayName);
      return child && child.type && /*#__PURE__*/cloneElement(child, Object.assign({
        inline: inline,
        name: name,
        'aria-labelledby': classNames(child.props.ariaLabelledBy, ariaLabelledBy)
      }, child.props));
    })
  }));
}
UIToggleGroup.propTypes = {
  'aria-labelledby': PropTypes.string,
  children: PropTypes.node.isRequired,
  inline: PropTypes.bool,
  name: PropTypes.string.isRequired
};
UIToggleGroup.displayName = 'UIToggleGroup';