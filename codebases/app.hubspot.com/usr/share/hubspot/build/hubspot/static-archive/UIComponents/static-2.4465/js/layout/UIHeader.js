'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { HEADER_PADDING_BOTTOM, HEADER_PADDING_TOP, INPUT_SM_HEIGHT, LAYOUT_MAIN_PADDING_TOP, LAYOUT_PADDING_X } from 'HubStyleTokens/sizes';
import { TEMPLATE_SECTION_DIVIDER_BORDER_COLOR } from 'HubStyleTokens/theme';
import PropTypes from 'prop-types';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import styled, { css } from 'styled-components';
import { HEADING_SIZES } from '../text/HeadingConstants';
import { warnIfFragment } from '../utils/devWarnings';
import UIButtonWrapper from './UIButtonWrapper'; // 100% arbitrary cutoff for widthConstrained mode

var CONSTRAINED_TITLE_WIDTH = 544;
var pseudoBorderMixin = css(["&::after{content:' ';position:absolute;left:", ";bottom:0;width:calc(100% - ", " * 2);height:1px;background-color:", ";}"], LAYOUT_PADDING_X, LAYOUT_PADDING_X, TEMPLATE_SECTION_DIVIDER_BORDER_COLOR);
var Outer = styled.header.withConfig({
  displayName: "UIHeader__Outer",
  componentId: "r7bt47-0"
})(["display:flex;position:relative;flex-direction:column;margin-bottom:", ";padding-bottom:", ";padding-left:", ";padding-right:", ";padding-top:", ";", ";"], function (_ref) {
  var condensed = _ref.condensed;
  return condensed ? '0' : LAYOUT_MAIN_PADDING_TOP;
}, function (_ref2) {
  var tabs = _ref2.tabs;
  return tabs ? '0' : HEADER_PADDING_BOTTOM;
}, LAYOUT_PADDING_X, LAYOUT_PADDING_X, HEADER_PADDING_TOP, function (_ref3) {
  var condensed = _ref3.condensed,
      fullWidth = _ref3.fullWidth,
      tabs = _ref3.tabs;
  if (condensed || tabs) return null;
  return fullWidth ? "border-bottom: 1px solid " + TEMPLATE_SECTION_DIVIDER_BORDER_COLOR : pseudoBorderMixin;
});
var Inner = styled.div.withConfig({
  displayName: "UIHeader__Inner",
  componentId: "r7bt47-1"
})(["display:flex;align-items:center;flex-wrap:wrap;min-height:", ";padding-bottom:", ";"], INPUT_SM_HEIGHT, function (_ref4) {
  var tabs = _ref4.tabs;
  return tabs && '8px';
});
var Alert = styled.div.withConfig({
  displayName: "UIHeader__Alert",
  componentId: "r7bt47-2"
})(["margin-top:20px;margin-bottom:", ";"], function (_ref5) {
  var tabs = _ref5.tabs;
  return tabs && '20px';
});
var Toolbar = styled(UIButtonWrapper).attrs({
  justify: 'end'
}).withConfig({
  displayName: "UIHeader__Toolbar",
  componentId: "r7bt47-3"
})(["flex-grow:1;margin-left:auto;"]);

var renderTitle = function renderTitle(title, badge) {
  if (!badge) return title;
  var badgeOutput = /*#__PURE__*/cloneElement(badge, {
    className: classNames(badge.props.className, 'private-header__badge')
  });
  return /*#__PURE__*/_jsxs("span", {
    className: "private-header__title__inner",
    children: [title, badgeOutput]
  });
};

var renderHeading = function renderHeading(badge, children, headingLevel, title, titleControls) {
  var titleControlsWrapper = titleControls && /*#__PURE__*/_jsx("div", {
    className: "private-header__title-badge",
    children: titleControls
  });

  var titleWrapperClassName = 'private-header__title' + (headingLevel === 'h1' ? " private-page__title" : "");
  var Heading = headingLevel;
  return /*#__PURE__*/_jsxs("div", {
    className: titleWrapperClassName,
    children: [/*#__PURE__*/_jsx(Heading, {
      className: 'private-header__heading' + (!children && !titleControls ? " private-header__heading--solo" : ""),
      children: renderTitle(title, badge)
    }), titleControlsWrapper]
  });
};

var renderToolbar = function renderToolbar(children) {
  return children && /*#__PURE__*/_jsx(Toolbar, {
    className: "private-header__toolbar",
    children: children
  });
};
/**
 * Standard page title which allows CTAs, filters, etc.
 */


export default function UIHeader(props) {
  var alert = props.alert,
      badge = props.badge,
      breadcrumbs = props.breadcrumbs,
      children = props.children,
      className = props.className,
      details = props.details,
      flush = props.flush,
      fullWidth = props.fullWidth,
      headingLevel = props.headingLevel,
      role = props.role,
      tabs = props.tabs,
      title = props.title,
      titleControls = props.titleControls,
      use = props.use,
      rest = _objectWithoutProperties(props, ["alert", "badge", "breadcrumbs", "children", "className", "details", "flush", "fullWidth", "headingLevel", "role", "tabs", "title", "titleControls", "use"]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      widthConstrained = _useState2[0],
      setWidthConstrained = _useState2[1];

  var headerRef = useRef(null);
  useEffect(function () {
    var measureWidth = function measureWidth() {
      var headerEl = findDOMNode(headerRef.current);
      var titleEl = headerEl.querySelector('.private-header__title');
      if (!titleEl) return; // Measure width without the width-constrained class

      var hasWidthConstrainedClass = headerEl.classList.contains('private-header--width-constrained');

      if (hasWidthConstrainedClass) {
        headerEl.classList.remove('private-header--width-constrained');
      }

      var newWidthConstrained = titleEl.clientWidth < CONSTRAINED_TITLE_WIDTH;

      if (hasWidthConstrainedClass) {
        headerEl.classList.add('private-header--width-constrained');
      }

      setWidthConstrained(newWidthConstrained);
    };

    measureWidth();
    addEventListener('resize', measureWidth);
    return function () {
      removeEventListener('resize', measureWidth);
    };
  }, []);
  var classes = classNames('private-header', className, fullWidth && 'private-header--full-width', flush && 'private-header--flush', details && 'private-header--with-details', tabs && 'private-header--with-tabs', widthConstrained && 'private-header--width-constrained');
  warnIfFragment(badge, UIHeader.displayName, 'badge');
  return /*#__PURE__*/_jsxs(Outer, Object.assign({
    className: classes,
    ref: headerRef,
    role: "presentation",
    breadcrumbs: breadcrumbs,
    condensed: use === 'condensed',
    fullWidth: fullWidth,
    tabs: tabs
  }, rest, {
    children: [breadcrumbs, /*#__PURE__*/_jsxs(Inner, {
      className: "private-header__inner",
      role: role,
      tabs: tabs,
      children: [title && renderHeading(badge, children, headingLevel, title, titleControls), renderToolbar(children)]
    }), details, alert && /*#__PURE__*/_jsx(Alert, {
      tabs: tabs,
      children: alert
    }), tabs]
  }));
}
UIHeader.propTypes = {
  alert: PropTypes.node,
  breadcrumbs: PropTypes.node,
  badge: PropTypes.node,
  children: PropTypes.node,
  details: PropTypes.node,
  flush: PropTypes.bool.isRequired,
  fullWidth: PropTypes.bool.isRequired,
  headingLevel: PropTypes.oneOf(HEADING_SIZES),
  tabs: PropTypes.node,
  title: PropTypes.node,
  titleControls: PropTypes.node,
  use: PropTypes.oneOf(['condensed'])
};
UIHeader.defaultProps = {
  flush: false,
  // for backwards compat, this will be true in next major version
  fullWidth: true,
  headingLevel: 'h1',
  role: 'banner'
};
UIHeader.displayName = 'UIHeader';