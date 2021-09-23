'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useState, useCallback } from 'react';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import NavGroup from 'settings-ui-nav/components/NavGroup';
import { expandedSettingsKey, getSessionSetting, setSessionSetting } from 'settings-ui-nav/utils/storageSettings';
import NavItemRecord from 'settings-ui-nav/utils/NavItem';
var cachedOpenItems = getSessionSetting(expandedSettingsKey) || {};

var SideNav = function SideNav(_ref) {
  var config = _ref.config,
      onItemClick = _ref.onItemClick,
      pathname = _ref.pathname,
      settingsApp = _ref.settingsApp,
      track = _ref.track;

  var _useState = useState(cachedOpenItems),
      _useState2 = _slicedToArray(_useState, 2),
      openItems = _useState2[0],
      setOpenItems = _useState2[1];

  var handleOpenClick = useCallback(function (itemKey, open) {
    var updatedOpenItems = Object.assign({}, openItems);

    if (open) {
      updatedOpenItems[itemKey] = true;
    } else {
      delete updatedOpenItems[itemKey];
    }

    setSessionSetting(expandedSettingsKey, updatedOpenItems);
    setOpenItems(updatedOpenItems);
  }, [openItems]);

  if (config.length) {
    return /*#__PURE__*/_jsx(Fragment, {
      children: config.map(function (navGroup) {
        return /*#__PURE__*/_jsx(NavGroup, {
          openItems: openItems,
          onOpenClick: handleOpenClick,
          config: navGroup,
          onItemClick: onItemClick,
          pathname: pathname,
          settingsApp: settingsApp,
          track: track
        }, navGroup.id);
      })
    });
  }

  return /*#__PURE__*/_jsx(UILoadingSpinner, {});
};

SideNav.propTypes = {
  config: PropTypes.arrayOf(PropTypes.instanceOf(NavItemRecord).isRequired).isRequired,
  onItemClick: PropTypes.func,
  pathname: PropTypes.string.isRequired,
  settingsApp: PropTypes.string,
  track: PropTypes.func.isRequired
};
export default SideNav;