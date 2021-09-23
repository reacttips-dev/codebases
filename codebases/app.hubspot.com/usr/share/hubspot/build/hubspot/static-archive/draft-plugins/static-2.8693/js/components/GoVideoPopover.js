'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { EditorState } from 'draft-js';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import GoVideoPopoverContent from './GoVideoPopoverContent';
var GoVideoPopover = createReactClass({
  displayName: "GoVideoPopover",
  propTypes: {
    children: PropTypes.any,
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    isInServiceHub: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    placement: PropTypes.string,
    trackingHandlers: PropTypes.object,
    recipientEmail: PropTypes.string,
    isInlineVideo: PropTypes.bool,
    showTitleCheckBox: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      placement: 'top left'
    };
  },
  renderPopoverContent: function renderPopoverContent() {
    var _this$props = this.props,
        editorState = _this$props.editorState,
        isInServiceHub = _this$props.isInServiceHub,
        onChange = _this$props.onChange,
        onClose = _this$props.onClose,
        trackingHandlers = _this$props.trackingHandlers,
        recipientEmail = _this$props.recipientEmail,
        isInlineVideo = _this$props.isInlineVideo,
        showTitleCheckBox = _this$props.showTitleCheckBox;
    return /*#__PURE__*/_jsx(GoVideoPopoverContent, {
      editorState: editorState,
      isInServiceHub: isInServiceHub,
      onChange: onChange,
      onClose: onClose,
      trackingHandlers: trackingHandlers,
      recipientEmail: recipientEmail,
      isInlineVideo: isInlineVideo,
      showTitleCheckBox: showTitleCheckBox
    });
  },
  render: function render() {
    var _this$props2 = this.props,
        open = _this$props2.open,
        placement = _this$props2.placement,
        children = _this$props2.children;
    return /*#__PURE__*/_jsx(UIPopover, {
      className: "GoVideoPopover",
      open: open,
      width: 625,
      height: 437,
      placement: placement,
      autoPlacement: "vert",
      Content: this.renderPopoverContent,
      children: children
    });
  }
});
export default GoVideoPopover;