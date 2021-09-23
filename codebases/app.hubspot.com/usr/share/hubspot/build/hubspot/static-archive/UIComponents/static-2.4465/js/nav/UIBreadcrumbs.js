'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Children, cloneElement, isValidElement, Fragment } from 'react';
import UIIcon from '../icon/UIIcon';
import UIDropdown from '../dropdown/UIDropdown';
import UIList from '../list/UIList';
import { hidden } from '../utils/propTypes/decorators';
import { warnIfFragment } from '../utils/devWarnings';

var renderBreadcrumb = function renderBreadcrumb(children, hasArrow, isBackLink) {
  return /*#__PURE__*/_jsxs("span", {
    children: [hasArrow && /*#__PURE__*/_jsx(UIIcon, {
      className: 'private-breadcrumbs__arrow' + (isBackLink ? " private-breadcrumbs__arrow--back" : ""),
      name: isBackLink ? 'left' : 'right'
    }), children]
  });
};

var renderChild = function renderChild(child, index, totalCrumbs) {
  var isOnlyChild = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var singleBreadcrumbIsBackLink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var isSROnly = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var ariaCurrent = !isOnlyChild && index === totalCrumbs - 1 ? 'location' : null;
  var isBackLink = isOnlyChild && singleBreadcrumbIsBackLink;
  var hasArrow = isBackLink || index !== 0;
  var addedClassNames = 'private-breadcrumbs__item' + (isSROnly ? " sr-only sr-only-focusable" : "");
  warnIfFragment(child, 'UIBreadcrumbs');

  if ( /*#__PURE__*/isValidElement(child)) {
    return /*#__PURE__*/cloneElement(child, {
      'aria-current': ariaCurrent,
      children: renderBreadcrumb(child.props.children, hasArrow, isBackLink),
      key: index,
      className: addedClassNames
    });
  }

  return /*#__PURE__*/_jsx("span", {
    "aria-current": ariaCurrent,
    className: addedClassNames,
    children: renderBreadcrumb(child, hasArrow, isBackLink)
  });
};

var renderTruncateDropdown = function renderTruncateDropdown(children, defaultOpen) {
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(UIIcon, {
      className: "private-breadcrumbs__arrow",
      name: "right"
    }), /*#__PURE__*/_jsx(UIDropdown, {
      autoPlacement: "vert",
      tabIndex: -1,
      buttonUse: "transparent",
      buttonText: /*#__PURE__*/_jsx("span", {
        className: "align-center",
        children: /*#__PURE__*/_jsx(UIIcon, {
          name: "ellipses",
          className: "m-right-0 m-left-1 m-top-1",
          size: 22
        })
      }),
      buttonClassName: "p-x-0",
      caretRenderer: function caretRenderer() {
        return null;
      },
      defaultOpen: defaultOpen,
      menuWidth: "auto",
      placement: "bottom right",
      children: /*#__PURE__*/_jsx(UIList, {
        children: children
      })
    })]
  });
};

var renderTruncatedBreadcrumbs = function renderTruncatedBreadcrumbs(validChildren, isOnlyChild, singleBreadcrumbIsBackLink, levelsToShow, defaultOpen) {
  var totalCrumbs = validChildren.length;
  var innerCrumbs = validChildren.slice(1, -levelsToShow);
  var innerCrumbLength = innerCrumbs.length;
  var updatedLevelsToShow = innerCrumbLength ? levelsToShow : totalCrumbs - 1;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [renderChild(validChildren[0], 0, totalCrumbs, isOnlyChild, singleBreadcrumbIsBackLink), innerCrumbs.map(function (child, index) {
      return renderChild(child, index + 1, totalCrumbs, isOnlyChild, singleBreadcrumbIsBackLink, true);
    }), innerCrumbLength ? renderTruncateDropdown(innerCrumbs, defaultOpen) : null, validChildren.map(function (child, index) {
      if (index > totalCrumbs - updatedLevelsToShow - 1) {
        return renderChild(child, index, totalCrumbs, isOnlyChild, singleBreadcrumbIsBackLink);
      }

      return null;
    })]
  });
};

var renderChildren = function renderChildren(children, singleBreadcrumbIsBackLink, truncateToLevels, defaultOpen) {
  var isValidChild = function isValidChild(child) {
    if (typeof child === 'string') {
      return child.trim().length > 0;
    }

    return child;
  };

  var childrenArray = Children.toArray(children);
  var validChildren = childrenArray.filter(isValidChild);
  var totalCrumbs = validChildren.length;
  var isOnlyChild = totalCrumbs === 1;
  var breadcrumbs;

  if (truncateToLevels !== null && !isOnlyChild) {
    breadcrumbs = renderTruncatedBreadcrumbs(validChildren, isOnlyChild, singleBreadcrumbIsBackLink, truncateToLevels, defaultOpen);
  } else {
    breadcrumbs = Children.map(validChildren, function (child, index) {
      return renderChild(child, index, totalCrumbs, isOnlyChild, singleBreadcrumbIsBackLink);
    });
  }

  if (isOnlyChild && !singleBreadcrumbIsBackLink) {
    breadcrumbs.push( /*#__PURE__*/_jsx("span", {
      className: "private-breadcrumbs__item",
      children: renderBreadcrumb(null, true, false)
    }, "x"));
  }

  return breadcrumbs;
};

export default function UIBreadcrumbs(props) {
  var className = props.className,
      children = props.children,
      flush = props.flush,
      singleBreadcrumbIsBackLink = props.singleBreadcrumbIsBackLink,
      truncateToLevels = props.truncateToLevels,
      wrapLevels = props.wrapLevels,
      defaultOpen = props.defaultOpen,
      rest = _objectWithoutProperties(props, ["className", "children", "flush", "singleBreadcrumbIsBackLink", "truncateToLevels", "wrapLevels", "defaultOpen"]);

  return /*#__PURE__*/_jsx("nav", Object.assign({}, rest, {
    className: classNames('private-breadcrumbs', className, flush && 'private-breadcrumbs--flush', !(wrapLevels || truncateToLevels !== null) && 'private-breadcrumbs--no-wrap'),
    children: renderChildren(children, singleBreadcrumbIsBackLink, truncateToLevels, defaultOpen)
  }));
}
UIBreadcrumbs.propTypes = {
  children: PropTypes.node,
  defaultOpen: hidden(PropTypes.bool.isRequired),
  flush: PropTypes.bool.isRequired,
  singleBreadcrumbIsBackLink: PropTypes.bool.isRequired,
  truncateToLevels: PropTypes.number,
  wrapLevels: PropTypes.bool.isRequired
};
UIBreadcrumbs.defaultProps = {
  defaultOpen: false,
  flush: false,
  role: 'navigation',
  singleBreadcrumbIsBackLink: true,
  truncateToLevels: null,
  wrapLevels: false
};
UIBreadcrumbs.displayName = 'UIBreadcrumbs';