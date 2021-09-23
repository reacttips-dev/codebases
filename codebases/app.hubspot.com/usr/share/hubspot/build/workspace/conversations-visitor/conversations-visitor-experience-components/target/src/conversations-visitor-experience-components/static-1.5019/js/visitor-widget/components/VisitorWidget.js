'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { List } from 'immutable';
import ChatHeadingConfigPropType from 'conversations-prop-types/prop-types/ChatHeadingConfigPropType';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { RIGHT_ALIGNED, WidgetLocationProp } from '../constants/WidgetLocations';
import WidgetHeader from './WidgetHeader';
import VisitorWidgetStyleWrapper from '../../presentation-components/VisitorWidgetStyleWrapper';
import { HEADER_HEIGHT } from '../../widget-dimensions/constants/dimensions';
import styled from 'styled-components';
import WidgetViews from '../proptypes/WidgetViews';
import { THREAD_VIEW } from '../constants/views';
export var WidgetBodyDiv = styled.div.withConfig({
  displayName: "VisitorWidget__WidgetBodyDiv",
  componentId: "qsl04n-0"
})(["display:flex;flex-direction:column;height:calc(100% - ", "px);"], HEADER_HEIGHT);

var VisitorWidget = /*#__PURE__*/function (_Component) {
  _inherits(VisitorWidget, _Component);

  function VisitorWidget() {
    _classCallCheck(this, VisitorWidget);

    return _possibleConstructorReturn(this, _getPrototypeOf(VisitorWidget).apply(this, arguments));
  }

  _createClass(VisitorWidget, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          browserWindowHeight = _this$props.browserWindowHeight,
          chatHeadingConfig = _this$props.chatHeadingConfig,
          chatHeadingResponders = _this$props.chatHeadingResponders,
          coloring = _this$props.coloring,
          closeWidget = _this$props.closeWidget,
          customHeaderText = _this$props.customHeaderText,
          inline = _this$props.inline,
          shouldResizeContainer = _this$props.shouldResizeContainer,
          isPreview = _this$props.isPreview,
          isThreadAssigned = _this$props.isThreadAssigned,
          createNewThread = _this$props.createNewThread,
          mobile = _this$props.mobile,
          officeHoursMessage = _this$props.officeHoursMessage,
          showAvailabilityMessage = _this$props.showAvailabilityMessage,
          navigateToThreadList = _this$props.navigateToThreadList,
          showBackButton = _this$props.showBackButton,
          size = _this$props.size,
          style = _this$props.style,
          typicalResponseTimeMessage = _this$props.typicalResponseTimeMessage,
          unseenThreadsCountExcludingCurrentThread = _this$props.unseenThreadsCountExcludingCurrentThread,
          view = _this$props.view,
          widgetLocation = _this$props.widgetLocation,
          backButtonDisabled = _this$props.backButtonDisabled;
      return /*#__PURE__*/_jsxs(VisitorWidgetStyleWrapper, {
        browserWindowHeight: browserWindowHeight,
        inline: inline,
        shouldResizeContainer: shouldResizeContainer,
        size: size,
        style: style,
        mobile: mobile,
        widgetLocation: widgetLocation,
        children: [/*#__PURE__*/_jsx(WidgetHeader, {
          chatHeadingConfig: chatHeadingConfig,
          coloring: coloring,
          createNewThread: createNewThread,
          chatHeadingResponders: chatHeadingResponders,
          customHeaderText: customHeaderText,
          inline: inline,
          isThreadAssigned: isThreadAssigned,
          mobile: mobile,
          officeHoursMessage: officeHoursMessage,
          onClose: closeWidget,
          preview: isPreview,
          showAvailabilityMessage: showAvailabilityMessage,
          navigateToThreadList: navigateToThreadList,
          showBackButton: showBackButton,
          typicalResponseTimeMessage: typicalResponseTimeMessage,
          unseenThreadsCountExcludingCurrentThread: unseenThreadsCountExcludingCurrentThread,
          view: view,
          backButtonDisabled: backButtonDisabled
        }), /*#__PURE__*/_jsx(WidgetBodyDiv, {
          children: this.props.children
        })]
      });
    }
  }]);

  return VisitorWidget;
}(Component);

VisitorWidget.propTypes = {
  backButtonDisabled: PropTypes.bool,
  browserWindowHeight: PropTypes.number.isRequired,
  chatHeadingConfig: ChatHeadingConfigPropType.isRequired,
  chatHeadingResponders: PropTypes.instanceOf(List),
  children: PropTypes.node.isRequired,
  closeWidget: PropTypes.func.isRequired,
  coloring: RecordPropType('ColoringRecord').isRequired,
  createNewThread: PropTypes.func,
  customHeaderText: PropTypes.string,
  inline: PropTypes.bool.isRequired,
  isPreview: PropTypes.bool.isRequired,
  isThreadAssigned: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  navigateToThreadList: PropTypes.func,
  officeHoursMessage: PropTypes.string,
  shouldResizeContainer: PropTypes.bool.isRequired,
  showAvailabilityMessage: PropTypes.bool,
  showBackButton: PropTypes.bool.isRequired,
  size: PropTypes.string,
  style: PropTypes.object,
  typicalResponseTimeMessage: PropTypes.string,
  unseenThreadsCountExcludingCurrentThread: PropTypes.number,
  view: WidgetViews,
  widgetLocation: WidgetLocationProp
};
VisitorWidget.defaultProps = {
  customHeaderText: null,
  inline: false,
  isOpen: false,
  isPreview: false,
  isThreadAssigned: false,
  mobile: false,
  onUpdateOpened: function onUpdateOpened() {},
  widgetLocation: RIGHT_ALIGNED,
  view: THREAD_VIEW
};
VisitorWidget.displayName = 'VisitorWidget';
export default VisitorWidget;