'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIHeader from 'UIComponents/layout/UIHeader';
import UITabs from 'UIComponents/nav/UITabs';
import UIRouterTab from 'ui-addon-react-router/UIRouterTab';
import UITab from 'UIComponents/nav/UITab';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { appSectionProp } from '../../lib/propTypes';
import { APP_SECTIONS, getAppRoot, HIDE_MANAGE_BETA_TAG_PORTAL_IDS } from '../../lib/constants';
import SocialContext from './SocialContext';
import ManageDashboardShepherdPopoverWrapper from '../onboarding/ManageDashboardShepherdPopoverWrapper';
import UIBadge from 'UIComponents/badge/UIBadge';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIRouterLink from 'ui-addon-react-router/UIRouterLink';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';

var CompareButton = function CompareButton(_ref) {
  var portalId = _ref.portalId;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sui.compare.buttonTooltip"
    }),
    children: /*#__PURE__*/_jsx(UIButton, {
      use: "secondary",
      href: "/" + getAppRoot() + "/" + portalId + "/compare/",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sui.header.compare.button"
      })
    })
  });
};

var Header = /*#__PURE__*/function (_Component) {
  _inherits(Header, _Component);

  function Header() {
    var _this;

    _classCallCheck(this, Header);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Header).call(this));

    _this.handleTabClick = function (navItem) {
      return function () {
        var isInternalLink = _this.props.isInternalSection(navItem);

        var navigatePath = _this.getNavigatePath(navItem);

        if (_this.context.trackInteraction) {
          _this.context.trackInteraction("header tab " + navItem.get('id'));
        }

        if (isInternalLink) {
          _this.props.push(navigatePath);
        }
      };
    };

    _this.renderNavItem = function (navItem) {
      /**
       * Show the beta badge if:
       * - This portal is ungated for Manage Beta
       * - The current nav item is the "Manage" item
       * - This portal is not in the list of portals that should not show the beta badge (internal use only)
       */
      var shouldShowManageBetaBadge = _this.props.isUngatedForManageBeta && navItem.get('id') === APP_SECTIONS.manage && !HIDE_MANAGE_BETA_TAG_PORTAL_IDS.has(_this.props.portalId);

      var titleEl = /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "sui.header.tabs." + navItem.get('id') + ".label"
        }), shouldShowManageBetaBadge && /*#__PURE__*/_jsxs(Fragment, {
          children: [' ', /*#__PURE__*/_jsx(UIBadge, {
            className: "m-left-1",
            use: "beta",
            children: "Beta"
          })]
        })]
      });

      var isInternalLink = _this.props.isInternalSection(navItem);

      var tabComponent = isInternalLink ? /*#__PURE__*/_jsx(UIRouterTab, {
        to: _this.getNavigatePath(navItem),
        className: "link-" + navItem.get('id'),
        tabId: navItem.get('id'),
        title: titleEl,
        onClick: _this.handleTabClick(navItem)
      }, navItem.get('id')) : /*#__PURE__*/_jsx(UITab, {
        className: "link-" + navItem.get('id'),
        tabId: navItem.get('id'),
        title: titleEl,
        onClick: _this.handleTabClick(navItem),
        href: _this.getNavigatePath(navItem)
      }, navItem.get('id'));
      return tabComponent;
    };

    _this.state = {
      showExternalPostsCalendarTooltip: false
    };
    return _this;
  }

  _createClass(Header, [{
    key: "getNavigatePath",
    value: function getNavigatePath(navItem) {
      return "" + (navItem.get('externalRoute') || this.props.getNavigatePath(navItem)) + this.props.location.search;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          navItems = _this$props.navItems,
          appSection = _this$props.appSection,
          isUngatedForManageBeta = _this$props.isUngatedForManageBeta,
          isUngatedForCompareBeta = _this$props.isUngatedForCompareBeta,
          onClickCompose = _this$props.onClickCompose,
          uploadedCount = _this$props.uploadedCount,
          openBulkScheduleModal = _this$props.openBulkScheduleModal,
          isBulkUploadDisabled = _this$props.isBulkUploadDisabled,
          portalId = _this$props.portalId,
          location = _this$props.location;
      var showExternalPostsCalendarTooltip = this.state.showExternalPostsCalendarTooltip;

      var bulkScheduleButton = /*#__PURE__*/_jsx(UIButton, {
        use: "secondary",
        className: "bulk-schedule m-left-3",
        onClick: openBulkScheduleModal,
        role: "button",
        disabled: isBulkUploadDisabled,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sui.bulkScheduleModal.bulkSchedule.button"
        })
      });

      var tooltippedBulkScheduleButton = uploadedCount > 0 ? /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sui.bulkScheduleModal.bulkSchedule.tooltip"
        }),
        children: bulkScheduleButton
      }) : bulkScheduleButton;
      var tabEl;

      if (appSection !== APP_SECTIONS.onboarding) {
        tabEl = /*#__PURE__*/_jsx(UITabs, {
          className: "header-nav-links unstyled",
          selected: appSection,
          children: navItems.toArray().map(this.renderNavItem)
        }, "tabs");
      }

      return /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(UIHeader, {
          className: "top-nav",
          use: "condensed",
          fullWidth: true,
          flush: true,
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: 'sui.header.title'
          }),
          tabs: tabEl,
          details: isUngatedForManageBeta && location.pathname.includes('/calendar') && /*#__PURE__*/_jsx(UIFlex, {
            children: /*#__PURE__*/_jsx(UIPopover, {
              open: showExternalPostsCalendarTooltip,
              onOpenChange: function onOpenChange(e) {
                return _this2.setState({
                  showExternalPostsCalendarTooltip: e.target.value
                });
              },
              placement: "right",
              width: 300,
              closeOnOutsideClick: true,
              content: {
                body: /*#__PURE__*/_jsx("p", {
                  children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
                    message: 'sui.header.calendarExternalPostsTooltip.description_jsx',
                    elements: {
                      UIRouterLink: UIRouterLink
                    },
                    options: {
                      onClick: function onClick() {
                        _this2.setState({
                          showExternalPostsCalendarTooltip: false
                        });
                      },
                      url: "/manage"
                    }
                  })
                })
              },
              children: /*#__PURE__*/_jsxs(UIButton, {
                use: "link",
                onClick: function onClick() {
                  _this2.setState({
                    showExternalPostsCalendarTooltip: !showExternalPostsCalendarTooltip
                  });
                },
                children: [/*#__PURE__*/_jsx(UIIcon, {
                  name: "info"
                }), /*#__PURE__*/_jsx(FormattedMessage, {
                  message: "sui.header.calendarExternalPostsTooltip.cta"
                })]
              })
            })
          }),
          children: appSection !== APP_SECTIONS.onboarding && /*#__PURE__*/_jsxs("div", {
            className: "right flex-row",
            children: [isUngatedForCompareBeta && isUngatedForManageBeta && appSection !== APP_SECTIONS.compare && /*#__PURE__*/_jsx(CompareButton, {
              portalId: portalId
            }), isUngatedForManageBeta && appSection === APP_SECTIONS.manage && /*#__PURE__*/_jsx(ManageDashboardShepherdPopoverWrapper, {
              popoverPlacement: "bottom",
              stepId: "scheduleBulk",
              children: tooltippedBulkScheduleButton
            }), /*#__PURE__*/_jsx(UIButton, {
              use: "primary",
              className: "ss-compose create-post m-left-3",
              onClick: onClickCompose,
              role: "button",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "sui.header.composer.cta"
              })
            })]
          })
        })
      });
    }
  }]);

  return Header;
}(Component);

Header.propTypes = {
  appSection: appSectionProp,
  getNavigatePath: PropTypes.func.isRequired,
  isInternalSection: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  navItems: PropTypes.object.isRequired,
  onClickCompose: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  isUngatedForManageBeta: PropTypes.bool,
  isUngatedForCompareBeta: PropTypes.bool,
  openBulkScheduleModal: PropTypes.func,
  isBulkUploadDisabled: PropTypes.bool,
  uploadedCount: PropTypes.number,
  portalId: PropTypes.number
};
Header.contextType = SocialContext;
export { Header as default };