'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import UISideNavItem from 'UIComponents/nav/UISideNavItem';
import UIBadge from 'UIComponents/badge/UIBadge';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import NavItemRecord from 'settings-ui-nav/utils/NavItem';

var NavItem = function NavItem(props) {
  var active = props.active,
      className = props.className,
      defaultOpen = props.defaultOpen,
      navItem = props.navItem,
      onItemClick = props.onItemClick,
      onOpenClick = props.onOpenClick,
      pathname = props.pathname,
      settingsApp = props.settingsApp,
      title = props.title,
      track = props.track,
      rest = _objectWithoutProperties(props, ["active", "className", "defaultOpen", "navItem", "onItemClick", "onOpenClick", "pathname", "settingsApp", "title", "track"]);

  var handleItemClick = useCallback(function (evt) {
    if (typeof track === 'function') {
      track('settingsNavInteraction', {
        settingsGroup: navItem.settingsGroup,
        settingsLink: navItem.trackingScreen,
        settingsApp: settingsApp
      });
    }

    onItemClick(evt, navItem);
  }, [navItem, onItemClick, settingsApp, track]);

  if (navItem.children.length) {
    return /*#__PURE__*/_jsx(UISideNavItem, Object.assign({
      "data-selenium-id": navItem.label,
      defaultOpen: navItem.matchesPath(pathname) || defaultOpen,
      onOpenChange: function onOpenChange(evt) {
        return onOpenClick(navItem.label, evt.target.value);
      },
      title: title
    }, rest, {
      children: navItem.children.map(function (childNavItem) {
        return /*#__PURE__*/_jsx(NavItem, {
          navItem: childNavItem,
          onItemClick: onItemClick,
          pathname: pathname,
          title: childNavItem.label
        }, childNavItem.label);
      })
    }), navItem.label);
  }

  var iconRight;

  if (navItem.isNew) {
    iconRight = /*#__PURE__*/_jsx(UIBadge, {
      use: "new",
      children: /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "settings-ui-nav.new"
      })
    });
  } else if (navItem.isBeta) {
    iconRight = /*#__PURE__*/_jsx(UIBadge, {
      use: "beta",
      children: /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "settings-ui-nav.beta"
      })
    });
  }

  return /*#__PURE__*/_jsx(UISideNavItem, Object.assign({
    className: className + " navItem",
    active: active || navItem.matchesPath(pathname),
    "data-selenium-id": navItem.label,
    href: navItem.path,
    iconRight: iconRight,
    onClick: handleItemClick,
    title: title
  }, rest));
};

NavItem.defaultProps = Object.assign({
  className: ''
}, UISideNavItem.defaultProps);
NavItem.propTypes = Object.assign({
  className: PropTypes.string,
  onItemClick: PropTypes.func,
  onOpenClick: PropTypes.func,
  navItem: PropTypes.instanceOf(NavItemRecord).isRequired,
  pathname: PropTypes.string,
  settingsApp: PropTypes.string,
  track: PropTypes.func
}, UISideNavItem.propTypes);
export default NavItem;