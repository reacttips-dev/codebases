'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import { identity } from 'underscore';
import UIRouterSideNav from 'ui-addon-react-router/UIRouterSideNav';
import UIRouterSideNavItem from 'ui-addon-react-router/UIRouterSideNavItem';
import UINavItemLabel from 'UIComponents/nav/UINavItemLabel';
import { BROADCAST_STATUS_TYPE, PUBLISHING_VIEW } from '../../lib/constants';
import { broadcastStatusTypeProp, mapProp } from '../../lib/propTypes';
import CalendarSwitcher from '../publishing/CalendarSwitcher';
import SocialContext from './SocialContext';

var PublishingSidebar = /*#__PURE__*/function (_PureComponent) {
  _inherits(PublishingSidebar, _PureComponent);

  function PublishingSidebar() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PublishingSidebar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PublishingSidebar)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClickSection = function (statusType) {
      _this.context.trackInteraction("change status type " + statusType);
    };

    _this.renderStatusLink = function (statusType) {
      var broadcastCounts = _this.props.broadcastCounts;
      var navItemEl = I18n.text("sui.publishing.sidebar." + statusType);

      if (statusType !== BROADCAST_STATUS_TYPE.published && broadcastCounts) {
        navItemEl = /*#__PURE__*/_jsx(UINavItemLabel, {
          count: I18n.formatNumber(broadcastCounts.get(statusType) || 0),
          children: I18n.text("sui.publishing.sidebar." + statusType)
        });
      }

      return /*#__PURE__*/_jsx(UIRouterSideNavItem, {
        className: statusType,
        value: statusType,
        to: _this.props.getManagePath(statusType),
        onClick: function onClick() {
          return _this.onClickSection(statusType);
        },
        title: navItemEl
      }, statusType);
    };

    return _this;
  }

  _createClass(PublishingSidebar, [{
    key: "renderCalendarSwitcher",
    value: function renderCalendarSwitcher() {
      if (!this.props.showCalendarSwitcher) {
        return null;
      }

      return /*#__PURE__*/_jsx(CalendarSwitcher, {
        activeItem: PUBLISHING_VIEW.publishingTable,
        isDetailsPanelOpen: this.props.isDetailsPanelOpen
      });
    }
  }, {
    key: "render",
    value: function render() {
      var broadcastCounts = this.props.broadcastCounts;
      var showUploaded = Boolean(this.props.activeItem === BROADCAST_STATUS_TYPE.uploaded || broadcastCounts && broadcastCounts.get(BROADCAST_STATUS_TYPE.uploaded));
      var orderedStatusTypes = [BROADCAST_STATUS_TYPE.published, BROADCAST_STATUS_TYPE.scheduled, broadcastCounts && broadcastCounts.get(BROADCAST_STATUS_TYPE.failed) && BROADCAST_STATUS_TYPE.failed, broadcastCounts && broadcastCounts.get(BROADCAST_STATUS_TYPE.pending) && BROADCAST_STATUS_TYPE.pending, BROADCAST_STATUS_TYPE.draft, showUploaded && BROADCAST_STATUS_TYPE.uploaded].filter(identity);
      return /*#__PURE__*/_jsxs("div", {
        children: [this.renderCalendarSwitcher(), /*#__PURE__*/_jsx(UIRouterSideNav, {
          "aria-label": I18n.text('sui.publishing.sidebar.label'),
          className: "publishing-nav",
          value: this.props.activeItem,
          children: orderedStatusTypes.map(this.renderStatusLink)
        })]
      });
    }
  }]);

  return PublishingSidebar;
}(PureComponent);

PublishingSidebar.propTypes = {
  activeItem: broadcastStatusTypeProp,
  broadcastCounts: mapProp,
  getManagePath: PropTypes.func.isRequired,
  isDetailsPanelOpen: PropTypes.bool.isRequired,
  portalId: PropTypes.number,
  publishingTableStepsSeen: PropTypes.object,
  showCalendarSwitcher: PropTypes.bool
};
PublishingSidebar.contextType = SocialContext;
export { PublishingSidebar as default };