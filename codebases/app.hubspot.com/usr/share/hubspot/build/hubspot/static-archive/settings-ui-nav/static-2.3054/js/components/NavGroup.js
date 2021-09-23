'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UISideNav from 'UIComponents/nav/UISideNav';
import NavItemRecord from 'settings-ui-nav/utils/NavItem';
import NavItem from 'settings-ui-nav/components/NavItem';

var NavGroup = function NavGroup(_ref) {
  var config = _ref.config,
      divider = _ref.divider,
      onItemClick = _ref.onItemClick,
      onOpenClick = _ref.onOpenClick,
      openItems = _ref.openItems,
      pathname = _ref.pathname,
      settingsApp = _ref.settingsApp,
      track = _ref.track;

  if (config.children && config.children.length) {
    return /*#__PURE__*/_jsx(UISideNav, {
      "data-reagan-test": "settings-nav",
      divider: divider,
      headingText: config.label,
      children: config.children.map(function (childNavItem) {
        return /*#__PURE__*/_jsx(NavItem, {
          defaultOpen: openItems[childNavItem.label],
          navItem: childNavItem,
          onItemClick: onItemClick,
          onOpenClick: onOpenClick,
          pathname: pathname,
          settingsApp: settingsApp,
          title: childNavItem.label,
          track: track
        }, childNavItem.label);
      })
    });
  }

  return undefined;
};

NavGroup.defaultProps = {
  onItemClick: function onItemClick() {},
  onOpenClick: function onOpenClick() {},
  openItems: {}
};
NavGroup.propTypes = {
  config: PropTypes.instanceOf(NavItemRecord).isRequired,
  divider: PropTypes.bool,
  onItemClick: PropTypes.func,
  onOpenClick: PropTypes.func,
  openItems: PropTypes.object,
  pathname: PropTypes.string,
  settingsApp: PropTypes.string,
  track: PropTypes.func
};
export default NavGroup;