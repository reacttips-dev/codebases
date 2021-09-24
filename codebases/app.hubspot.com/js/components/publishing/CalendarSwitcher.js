'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIButtonGroup from 'UIComponents/button/UIButtonGroup';
import UIRouterButtonLink from 'ui-addon-react-router/UIRouterButtonLink';
import { makeGetManagePath } from '../../manage/selectors';
import { saveUserAttribute } from '../../redux/actions/users';
import { getPublishingTableStepsSeen } from '../../redux/selectors/users';
import SocialContext from '../app/SocialContext';
import { USER_ATTR_DEFAULT_PUBLISHING_VIEW, PUBLISHING_VIEW } from '../../lib/constants';
import { getFacebookEngagementModalVisible } from '../../redux/selectors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import GatedCalendarPopover from './GatedCalendarPopover';
import { getIsUngatedForManageBeta } from '../../redux/selectors/gates';

var mapStateToProps = function mapStateToProps(state) {
  return {
    portalId: state.portal.portal_id,
    publishingTableStepsSeen: getPublishingTableStepsSeen(state),
    isComposerOpen: state.ui.get('composerOpen'),
    isFacebookEngagementModalVisible: getFacebookEngagementModalVisible(state),
    getManagePath: makeGetManagePath(state),
    isUngatedForManageBeta: getIsUngatedForManageBeta(state)
  };
};

var mapDispatchToProps = {
  saveUserAttribute: saveUserAttribute
};

var CalendarSwitcher = /*#__PURE__*/function (_PureComponent) {
  _inherits(CalendarSwitcher, _PureComponent);

  function CalendarSwitcher() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CalendarSwitcher);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CalendarSwitcher)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClickCalendarView = function () {
      _this.context.trackInteraction('switch to Calendar view');

      _this.props.saveUserAttribute({
        key: USER_ATTR_DEFAULT_PUBLISHING_VIEW,
        value: PUBLISHING_VIEW.calendar
      });
    };

    _this.onClickPublishingTableView = function () {
      _this.context.trackInteraction('switch to Publishing Table view');

      _this.props.saveUserAttribute({
        key: USER_ATTR_DEFAULT_PUBLISHING_VIEW,
        value: PUBLISHING_VIEW.publishingTable
      });
    };

    return _this;
  }

  _createClass(CalendarSwitcher, [{
    key: "shouldHidePublishingTableTourShepherd",
    value: function shouldHidePublishingTableTourShepherd() {
      return this.props.isComposerOpen || this.props.isFacebookEngagementModalVisible || this.props.isDetailsPanelOpen;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          activeItem = _this$props.activeItem,
          isUngatedForManageBeta = _this$props.isUngatedForManageBeta;
      return /*#__PURE__*/_jsxs(UIButtonGroup, {
        className: "calendar-switcher flex-row display-flex",
        children: [/*#__PURE__*/_jsx("div", {
          className: "calendar-switcher-item",
          children: /*#__PURE__*/_jsxs(UIRouterButtonLink, {
            to: this.props.getManagePath(),
            use: "tertiary-light",
            size: "small",
            className: "no-right-border-radius text-left width-100",
            active: activeItem === PUBLISHING_VIEW.publishingTable,
            onClick: this.onClickPublishingTableView,
            children: [/*#__PURE__*/_jsx(UIIcon, {
              name: "listView",
              size: "small"
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.publishing.sidebar.switcher.list"
            })]
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "calendar-switcher-item",
          children: /*#__PURE__*/_jsx(GatedCalendarPopover, {
            shouldHidePublishingTableTourShepherd: this.shouldHidePublishingTableTourShepherd(),
            children: /*#__PURE__*/_jsxs(UIRouterButtonLink, {
              to: isUngatedForManageBeta ? 'manage/calendar' : 'calendar',
              use: "tertiary-light",
              size: "small",
              className: "no-left-border-radius calendar text-left width-100",
              active: activeItem === PUBLISHING_VIEW.calendar,
              onClick: this.onClickCalendarView,
              children: [/*#__PURE__*/_jsx(UIIcon, {
                name: "date",
                size: "small"
              }), /*#__PURE__*/_jsx(FormattedMessage, {
                message: "sui.publishing.sidebar.switcher.calendar"
              })]
            })
          })
        })]
      });
    }
  }]);

  return CalendarSwitcher;
}(PureComponent);

CalendarSwitcher.propTypes = {
  activeItem: PropTypes.string.isRequired,
  getManagePath: PropTypes.func.isRequired,
  portalId: PropTypes.number.isRequired,
  publishingTableStepsSeen: PropTypes.object.isRequired,
  isComposerOpen: PropTypes.bool.isRequired,
  isFacebookEngagementModalVisible: PropTypes.bool.isRequired,
  isDetailsPanelOpen: PropTypes.bool,
  saveUserAttribute: PropTypes.func.isRequired,
  isUngatedForManageBeta: PropTypes.bool.isRequired
};
CalendarSwitcher.defaultProps = {
  isDetailsPanelOpen: false
};
CalendarSwitcher.contextType = SocialContext;
export default connect(mapStateToProps, mapDispatchToProps)(CalendarSwitcher);