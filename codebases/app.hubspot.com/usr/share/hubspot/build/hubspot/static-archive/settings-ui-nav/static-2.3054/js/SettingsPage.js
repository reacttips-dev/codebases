'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { userInfoSync } from 'hub-http/userInfo';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import UISidebarPage from 'UIComponents/page/UISidebarPage';
import UIAlert from 'UIComponents/alert/UIAlert';
import Config from './api/Config';
import { navConfigSettingsV4Key, navConfigSettingsPreferencesKey } from './utils/storageSettings';
import NavGroup from './components/NavGroup';
import SideNav from './components/SideNav';
import ReturnLinkHelper from './utils/ReturnLinkHelper';
import BackLink from './components/BackLink';
import once from 'settings-ui-nav/utils/once';
import findNavItem from 'settings-ui-nav/utils/findNavItem';
import { convertToTrackingUrl } from 'settings-ui-nav/utils/convertToTrackingUrl';
import NavItem from './utils/NavItem';
import UIMediaObject from 'UIComponents/layout/UIMediaObject';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';
var DEV_READ_ACCESS_SCOPE = 'developers-read';

var _trackPageView = once(function (track, trackingOptions) {
  if (typeof track === 'function') {
    track('settingsNavPageView', trackingOptions);
  }
});

var SettingsPage = /*#__PURE__*/function (_Component) {
  _inherits(SettingsPage, _Component);

  function SettingsPage(props) {
    var _this;

    _classCallCheck(this, SettingsPage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SettingsPage).call(this, props));

    var _userInfoSync = userInfoSync(),
        user = _userInfoSync.user;

    var isDevPortal = user.scopes.includes(DEV_READ_ACCESS_SCOPE);
    _this.state = {
      config: Config.getLocal(navConfigSettingsV4Key) || [],
      settingsPreferences: Config.getLocal(navConfigSettingsPreferencesKey) || [],
      isDevPortal: isDevPortal
    };
    ReturnLinkHelper.hydrate();
    _this.handleBackLinkClick = _this.handleBackLinkClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SettingsPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      Promise.all([Config.get(navConfigSettingsV4Key), Config.get(navConfigSettingsPreferencesKey)]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            config = _ref2[0],
            settingsPreferences = _ref2[1];

        return _this2.setState({
          config: config,
          settingsPreferences: settingsPreferences
        }, _this2.trackPageView);
      });
    }
  }, {
    key: "trackPageView",
    value: function trackPageView() {
      if (this.props.disablePageViewTracking) {
        return;
      }

      var _this$props = this.props,
          track = _this$props.track,
          settingsApp = _this$props.settingsApp,
          pathname = _this$props.pathname,
          subNavigation = _this$props.subNavigation;
      var _this$state = this.state,
          config = _this$state.config,
          settingsPreferences = _this$state.settingsPreferences;
      var currentNavItem = findNavItem(pathname, [config, settingsPreferences]);

      if (!currentNavItem) {
        return;
      }

      var screen = currentNavItem && currentNavItem.settingsGroup;
      var subscreen = currentNavItem && currentNavItem.trackingScreen;

      _trackPageView(track, {
        settingsApp: settingsApp,
        screen: screen,
        subscreen: subscreen,
        subscreen2: subNavigation
      });
    }
  }, {
    key: "handleBackLinkClick",
    value: function handleBackLinkClick(targetHref) {
      if (!this.state.loadedConfig) {
        return;
      }

      var _this$props2 = this.props,
          track = _this$props2.track,
          settingsApp = _this$props2.settingsApp,
          pathname = _this$props2.pathname;
      var _this$state2 = this.state,
          config = _this$state2.config,
          settingsPreferences = _this$state2.settingsPreferences;
      var currentNavItem = findNavItem(pathname, [config, settingsPreferences]);

      if (!currentNavItem) {
        return;
      }

      var screen = currentNavItem && currentNavItem.settingsGroup;
      var subscreen = currentNavItem && currentNavItem.trackingScreen;
      var santizedHref = convertToTrackingUrl(targetHref);

      if (typeof track === 'function') {
        track('settingsNavBackLink', {
          settingsApp: settingsApp,
          screen: screen,
          subscreen: subscreen,
          backLocation: santizedHref
        });
      }
    }
  }, {
    key: "handleSearchClick",
    value: function handleSearchClick() {
      window.location.search = '&searchFilters=SETTINGS';
    }
  }, {
    key: "renderSideNav",
    value: function renderSideNav() {
      var _this$state3 = this.state,
          config = _this$state3.config,
          settingsPreferences = _this$state3.settingsPreferences,
          isDevPortal = _this$state3.isDevPortal;
      var _this$props3 = this.props,
          pathname = _this$props3.pathname,
          settingsApp = _this$props3.settingsApp,
          onClickHandler = _this$props3.onClickHandler,
          track = _this$props3.track;

      if (config === undefined || settingsPreferences === undefined) {
        return /*#__PURE__*/_jsx(UIAlert, {
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "settings-ui-nav.loading-error.title"
          }),
          type: "danger",
          children: /*#__PURE__*/_jsx("p", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "settings-ui-nav.loading-error.description"
            })
          })
        });
      }

      var preferencesNavItem;

      if (settingsPreferences.length) {
        preferencesNavItem = new NavItem(null, {
          id: 'settings-preferences',
          label: I18n.text('settings-ui-nav.your-preferences'),
          children: settingsPreferences
        });
      }

      var header = /*#__PURE__*/_jsx(UIMediaObject, {
        className: "m-bottom-7",
        itemRight: /*#__PURE__*/_jsx(UIIconButton, {
          use: "link",
          onClick: this.handleSearchClick,
          tooltip: I18n.text('settings-ui-nav.searchButtonLabel'),
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "search"
          })
        }),
        children: /*#__PURE__*/_jsx(H4, {
          "aria-level": 1,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "settings-ui-nav.page-title"
          })
        })
      });

      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(BackLink, {
          className: "m-bottom-6",
          onClick: this.handleBackLinkClick,
          isDevPortal: isDevPortal
        }), header, settingsPreferences && settingsPreferences.length ? /*#__PURE__*/_jsx(NavGroup, {
          config: preferencesNavItem,
          onItemClick: onClickHandler,
          pathname: pathname,
          settingsApp: settingsApp,
          track: track
        }) : null, /*#__PURE__*/_jsx(SideNav, {
          config: config,
          onItemClick: onClickHandler,
          pathname: pathname,
          settingsApp: settingsApp,
          track: track
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(UISidebarPage, {
          stickySidebar: true,
          "data-reagan-test": "settings-page",
          sidebarComponent: this.renderSideNav(),
          children: this.props.children
        })
      });
    }
  }]);

  return SettingsPage;
}(Component);

SettingsPage.propTypes = {
  children: PropTypes.node.isRequired,

  /**
   * The current pathname, either window.location.pathname or
   * with react-router-redux: state.routing.locationBeforeTransitions.basename
   *  + state.routing.locationBeforeTransitions.pathname;
   */
  pathname: PropTypes.string.isRequired,

  /**
   * Optional handler for link clicks. Gets passed the event and the NavItem that
   * is clicked. The handler provided should, in most cases, match links by href
   * to implement custom routing for internal links and let external link clicks
   * propagate normally.
   */
  onClickHandler: PropTypes.func,

  /**
   * The name of the application that the nav is being used in. This will be attached
   * to usage tracking events to make it easier to distinguish events created by
   * indepedent settings deployables
   */
  settingsApp: PropTypes.string,

  /**
   * The name of the currently view subnavigation. This will be attached
   * to usage tracking events to see which subnavigation is viewed within a page.
   */
  subNavigation: PropTypes.string,

  /**
   * A track function that gets called with
   * events from settings-ui-nav/events.yaml
   */
  track: PropTypes.func.isRequired,

  /**
   * True to disable pageView tracking.
   */
  disablePageViewTracking: PropTypes.bool
};
SettingsPage.defaultProps = {
  /**
   * We want to handle pageView unless specified otherwise.
   */
  disablePageViewTracking: false
};
export default SettingsPage;