'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Children, forwardRef } from 'react';
import classNames from 'classnames';

var renderItems = function renderItems(children, childClassName, firstChildClassName, lastChildClassName) {
  return Children.map(children, function (child, i) {
    if (child == null) {
      return null;
    }

    var computedChildClassName;

    if (i === 0 && firstChildClassName != null) {
      computedChildClassName = firstChildClassName;
    } else if (!Object.prototype.hasOwnProperty.call(children, i + 1) && lastChildClassName != null) {
      computedChildClassName = lastChildClassName;
    } else {
      computedChildClassName = childClassName;
    }

    var className = classNames("uiListItem private-list__item", computedChildClassName);
    return /*#__PURE__*/_jsx("li", {
      className: className,
      children: child
    });
  });
};

var UIList = /*#__PURE__*/forwardRef(function (props, ref) {
  var ordered = props.ordered,
      styled = props.styled,
      inline = props.inline,
      className = props.className,
      children = props.children,
      childClassName = props.childClassName,
      firstChildClassName = props.firstChildClassName,
      lastChildClassName = props.lastChildClassName,
      use = props.use,
      rest = _objectWithoutProperties(props, ["ordered", "styled", "inline", "className", "children", "childClassName", "firstChildClassName", "lastChildClassName", "use"]);

  var computedClassName = classNames('uiList', (inline || use === 'inline-divided') && 'private-list--inline', className, !styled && 'private-list--unstyled', use === 'inline-divided' && 'private-list--inline-divided');
  var renderedItems = renderItems(children, childClassName, firstChildClassName, lastChildClassName);
  var List = ordered ? 'ol' : 'ul';
  return /*#__PURE__*/_jsx(List, Object.assign({}, rest, {
    className: computedClassName,
    ref: ref,
    children: renderedItems
  }));
});
UIList.propTypes = {
  childClassName: PropTypes.string,
  children: PropTypes.node,
  firstChildClassName: PropTypes.string,
  inline: PropTypes.bool.isRequired,
  lastChildClassName: PropTypes.string,
  ordered: PropTypes.bool.isRequired,
  styled: PropTypes.bool.isRequired,
  use: PropTypes.oneOf(['default', 'inline-divided'])
};
UIList.defaultProps = {
  inline: false,
  ordered: false,
  styled: false,
  childClassName: '',
  use: 'default'
};
UIList.displayName = 'UIList';
export default UIList;