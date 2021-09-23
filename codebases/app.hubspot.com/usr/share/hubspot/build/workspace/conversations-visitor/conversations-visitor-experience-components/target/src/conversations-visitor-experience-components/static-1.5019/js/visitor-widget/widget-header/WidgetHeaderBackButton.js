'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import VizExNotificationBadge from 'visitor-ui-component-library/badge/VizExNotificationBadge';
import I18n from 'I18n';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGLeft from 'visitor-ui-component-library-icons/icons/SVGLeft';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';

var WidgetHeaderBackButton = /*#__PURE__*/function (_Component) {
  _inherits(WidgetHeaderBackButton, _Component);

  function WidgetHeaderBackButton() {
    _classCallCheck(this, WidgetHeaderBackButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(WidgetHeaderBackButton).apply(this, arguments));
  }

  _createClass(WidgetHeaderBackButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          navigateToThreadList = _this$props.navigateToThreadList,
          unseenThreadsCountExcludingCurrentThread = _this$props.unseenThreadsCountExcludingCurrentThread,
          disabled = _this$props.disabled;
      var hasNotification = Boolean(unseenThreadsCountExcludingCurrentThread);
      return /*#__PURE__*/_jsx(VizExNotificationBadge, {
        className: "m-right-1",
        badgeLabel: unseenThreadsCountExcludingCurrentThread,
        showBadge: hasNotification,
        badgeDescription: I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.badgeDescription'),
        children: /*#__PURE__*/_jsx(VizExIconButton, {
          use: "transparent-on-primary",
          onClick: navigateToThreadList,
          className: "selenium-test-marker-show-threads-button",
          "data-test-id": "show-threads-button",
          "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.showThreadList', {
            unreadThreadCount: unseenThreadsCountExcludingCurrentThread
          }),
          disabled: disabled,
          children: /*#__PURE__*/_jsx(VizExIcon, {
            icon: /*#__PURE__*/_jsx(SVGLeft, {}),
            size: "md"
          })
        })
      });
    }
  }]);

  return WidgetHeaderBackButton;
}(Component);

WidgetHeaderBackButton.propTypes = {
  disabled: PropTypes.bool,
  navigateToThreadList: PropTypes.func.isRequired,
  unseenThreadsCountExcludingCurrentThread: PropTypes.number.isRequired
};
WidgetHeaderBackButton.displayName = 'WidgetHeaderBackButton';
export default WidgetHeaderBackButton;