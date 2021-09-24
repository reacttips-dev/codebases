'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import EventBoundaryPopover from '../EventBoundaryPopover';
import DocumentLinkPreviewForm from './DocumentLinkPreviewForm';
import { DOCUMENT_CONSTANTS } from '../../lib/constants';
import changeBlockData from '../../utils/changeBlockData';
var DOCUMENT_LINK_PREVIEW_POPOVER_CLASS = DOCUMENT_CONSTANTS.DOCUMENT_LINK_PREVIEW_POPOVER_CLASS;
export default createReactClass({
  displayName: "DocumentLinkPreviewPopover",
  propTypes: {
    block: PropTypes.object.isRequired,
    previewLinkData: PropTypes.object.isRequired,
    overrideKeyDown: PropTypes.func.isRequired,
    restoreKeyDown: PropTypes.func.isRequired
  },
  contextTypes: {
    getEditorState: PropTypes.func,
    onChange: PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    var _this$getPreviewLinkD = this.getPreviewLinkData(),
        name = _this$getPreviewLinkD.name,
        description = _this$getPreviewLinkD.description;

    return {
      open: false,
      previewTitle: name,
      previewDescription: description
    };
  },
  getPreviewLinkData: function getPreviewLinkData() {
    var _this$props$previewLi = this.props.previewLinkData,
        name = _this$props$previewLi.name,
        _this$props$previewLi2 = _this$props$previewLi.description,
        description = _this$props$previewLi2 === void 0 ? '' : _this$props$previewLi2;
    return {
      name: name,
      description: description
    };
  },
  handleOpen: function handleOpen() {
    this.props.overrideKeyDown();
    this.setState({
      open: true
    });
  },
  handleClose: function handleClose() {
    this.props.restoreKeyDown();
    this.setState({
      open: false
    });
  },
  handleCancel: function handleCancel() {
    var _this$getPreviewLinkD2 = this.getPreviewLinkData(),
        name = _this$getPreviewLinkD2.name,
        description = _this$getPreviewLinkD2.description;

    this.setState({
      previewTitle: name,
      previewDescription: description
    });
    this.handleClose();
  },
  handleOpenChange: function handleOpenChange(e) {
    var open = e.target.value;

    if (open) {
      this.handleOpen();
    } else {
      this.handleClose();
    }
  },
  toggleOpen: function toggleOpen() {
    if (this.state.open) {
      this.handleClose();
    } else {
      this.handleOpen();
    }
  },
  setProperty: function setProperty(field, value) {
    this.setState(_defineProperty({}, field, value));
  },
  updateBlockData: function updateBlockData() {
    var _this$context = this.context,
        getEditorState = _this$context.getEditorState,
        onChange = _this$context.onChange;
    var _this$state = this.state,
        previewTitle = _this$state.previewTitle,
        previewDescription = _this$state.previewDescription;
    var block = this.props.block;
    var editorState = getEditorState();
    var updatedBlockData = block.getData().mergeDeep({
      name: previewTitle,
      description: previewDescription
    });
    var updatedEditorState = changeBlockData({
      editorState: editorState,
      block: block,
      updatedBlockData: updatedBlockData
    });
    onChange(updatedEditorState);
    this.handleClose();
  },
  render: function render() {
    var _this$state2 = this.state,
        open = _this$state2.open,
        previewTitle = _this$state2.previewTitle,
        previewDescription = _this$state2.previewDescription;

    var _this$getPreviewLinkD3 = this.getPreviewLinkData(),
        name = _this$getPreviewLinkD3.name,
        description = _this$getPreviewLinkD3.description;

    return /*#__PURE__*/_jsx(EventBoundaryPopover, {
      open: open,
      onOpenChange: this.handleOpenChange,
      content: /*#__PURE__*/_jsx(DocumentLinkPreviewForm, {
        previewTitle: previewTitle,
        previewDescription: previewDescription,
        previousPreviewTitle: name,
        previousPreviewDescription: description,
        setProperty: this.setProperty,
        onConfirm: this.updateBlockData,
        onCancel: this.handleCancel
      }),
      closeOnOutsideClick: true,
      placement: "top",
      animateOnToggle: false,
      className: DOCUMENT_LINK_PREVIEW_POPOVER_CLASS,
      children: /*#__PURE__*/_jsx(UIButton, {
        size: "small",
        onClick: this.toggleOpen,
        className: "document-link-preview-edit-button",
        children: /*#__PURE__*/_jsx(UIIcon, {
          name: "edit"
        })
      })
    });
  }
});