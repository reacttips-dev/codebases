'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import changeBlockData from 'draft-plugins/utils/changeBlockData';
import DocumentLinkToken from 'draft-plugins/components/documents/DocumentLinkToken';
import { CALYPSO, OBSIDIAN } from 'HubStyleTokens/colors';
export default createReactClass({
  displayName: "DocumentLinkPreviewTable",
  propTypes: {
    thumbnail: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    description: PropTypes.string,
    block: PropTypes.object,
    imgWidth: PropTypes.string,
    imgHeight: PropTypes.string,
    selectedLink: PropTypes.string
  },
  contextTypes: {
    getEditorState: PropTypes.func,
    onChange: PropTypes.func
  },
  onImageLoad: function onImageLoad(e) {
    var _this$context = this.context,
        getEditorState = _this$context.getEditorState,
        onChange = _this$context.onChange;
    var _this$props = this.props,
        block = _this$props.block,
        imgWidth = _this$props.imgWidth,
        imgHeight = _this$props.imgHeight;
    var hasWidthAndHeight = imgWidth && imgHeight;

    if (!block || hasWidthAndHeight) {
      return;
    }

    var _e$target = e.target,
        width = _e$target.width,
        height = _e$target.height;
    var editorState = getEditorState();
    var updatedBlockData = block.getData().mergeDeep({
      imgWidth: "" + width,
      imgHeight: "" + height
    });
    var updatedEditorState = changeBlockData({
      editorState: editorState,
      block: block,
      updatedBlockData: updatedBlockData
    });
    onChange(updatedEditorState);
  },
  renderDescription: function renderDescription() {
    var description = this.props.description;

    if (!description) {
      return null;
    }

    return /*#__PURE__*/_jsx("p", {
      className: "document-link-preview-description",
      style: {
        color: OBSIDIAN,
        marginBottom: '8px'
      },
      children: description
    });
  },
  renderLink: function renderLink() {
    var _this$props2 = this.props,
        block = _this$props2.block,
        name = _this$props2.name,
        selectedLink = _this$props2.selectedLink;

    if (!block) {
      return /*#__PURE__*/_jsx("a", {
        className: "document-link-preview-link",
        href: selectedLink,
        children: selectedLink
      });
    }

    return /*#__PURE__*/_jsx(DocumentLinkToken, {
      children: name
    });
  },
  renderImage: function renderImage() {
    var _this$props3 = this.props,
        thumbnail = _this$props3.thumbnail,
        name = _this$props3.name,
        imgWidth = _this$props3.imgWidth,
        imgHeight = _this$props3.imgHeight;

    if (!thumbnail) {
      return null;
    }

    return /*#__PURE__*/_jsx("img", {
      src: thumbnail,
      alt: name,
      className: "document-link-preview-image",
      style: {
        display: 'block',
        margin: '0 auto',
        maxWidth: '150px',
        maxHeight: '150px'
      },
      onLoad: this.onImageLoad,
      width: imgWidth,
      height: imgHeight
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx("table", {
      className: "document-link-preview-table",
      style: {
        cursor: 'pointer',
        width: '400px',
        border: "solid 1px " + CALYPSO,
        padding: '8px',
        borderRadius: '2px'
      },
      "data-hs-document-link-preview-id": this.props.id,
      children: /*#__PURE__*/_jsx("tbody", {
        children: /*#__PURE__*/_jsxs("tr", {
          children: [/*#__PURE__*/_jsx("td", {
            style: {
              textAlign: 'center'
            },
            children: this.renderImage()
          }), /*#__PURE__*/_jsxs("td", {
            style: {
              paddingLeft: '8px',
              textAlign: 'left'
            },
            children: [/*#__PURE__*/_jsx("h2", {
              className: "document-link-preview-name",
              style: {
                color: OBSIDIAN,
                marginTop: 0,
                marginBottom: '8px'
              },
              children: this.props.name
            }), this.renderDescription(), this.renderLink()]
          })]
        })
      })
    });
  }
});