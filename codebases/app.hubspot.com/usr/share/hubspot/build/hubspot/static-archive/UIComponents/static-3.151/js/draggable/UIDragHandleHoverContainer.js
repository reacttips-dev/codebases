'use es6';

import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import classNames from 'classnames';
import { warnIfFragment } from '../utils/devWarnings';

function renderChildren(children, classes) {
  return /*#__PURE__*/cloneElement(children, {
    className: classNames(children.props.className, classes)
  });
}

export default function UIDragHandleHoverContainer(props) {
  var children = props.children,
      className = props.className;
  var classes = classNames('has--draggable', className);
  warnIfFragment(children, UIDragHandleHoverContainer.displayName);
  return renderChildren(children, classes);
}
UIDragHandleHoverContainer.propTypes = {
  children: PropTypes.element.isRequired
};
UIDragHandleHoverContainer.displayName = 'UIDragHandleHoverContainer';