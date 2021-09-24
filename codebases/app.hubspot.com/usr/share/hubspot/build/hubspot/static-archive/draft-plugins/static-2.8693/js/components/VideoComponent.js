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
import debounce from 'transmute/debounce';
import UIImage from 'UIComponents/image/UIImage';
import UILink from 'UIComponents/link/UILink';
import { Record } from 'immutable';
import AtomicFocus from './AtomicFocus';
import ResizeableThumbnailDragHandle from './thumbnail/ResizeableThumbnailDragHandle';
import ResizeableThumbnailOutline from './thumbnail/ResizeableThumbnailOutline';
import ResizeableThumbnailWrapper from './thumbnail/ResizeableThumbnailWrapper';
import { VIDEO_CONSTANTS } from '../lib/constants';
import changeBlockData from '../utils/changeBlockData';
var VIDEO_COMPONENT_PARENT_CLASS = VIDEO_CONSTANTS.VIDEO_COMPONENT_PARENT_CLASS,
    DEFAULT_VIDEO_WIDTH = VIDEO_CONSTANTS.DEFAULT_VIDEO_WIDTH;

var VideoComponent = /*#__PURE__*/function (_PureComponent) {
  _inherits(VideoComponent, _PureComponent);

  function VideoComponent(props) {
    var _this;

    _classCallCheck(this, VideoComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VideoComponent).call(this, props));

    _this.updateBlockData = function (data) {
      var block = _this.props.block;
      var _this$context = _this.context,
          getEditorState = _this$context.getEditorState,
          onChange = _this$context.onChange;
      var editorState = getEditorState();
      var currentData = block.getData();
      var updatedBlockData = currentData.mergeDeep(data);
      var editorStateWithNewData = changeBlockData({
        editorState: editorState,
        block: block,
        updatedBlockData: updatedBlockData
      });
      onChange(editorStateWithNewData);
    };

    _this.handleClick = function () {
      var onFocus = _this.props.onFocus;
      onFocus();
    };

    _this.handleDragStart = function () {
      document.addEventListener('mousemove', _this.handleResize);
      document.addEventListener('mouseup', _this.handleDragEnd);
    };

    _this.handleDragEnd = function () {
      document.removeEventListener('mousemove', _this.handleResize);
      document.removeEventListener('mouseup', _this.handleDragEnd);
    };

    _this.handleResize = function (e) {
      var offsetLeft = _this.wrapper.getBoundingClientRect().left;

      var newWidth = e.clientX - offsetLeft; // updating the block data on every mousemove event results in
      // a laggy UI, so we debounce it and keep a copy in state

      _this.debouncedUpdateBlockData({
        width: newWidth
      });

      _this.setState({
        width: newWidth
      });
    };

    var startingWidth = _this.props.block.getData().get('width', DEFAULT_VIDEO_WIDTH);

    _this.state = {
      width: startingWidth
    };
    _this.debouncedUpdateBlockData = debounce(300, _this.updateBlockData);
    return _this;
  }

  _createClass(VideoComponent, [{
    key: "previewLinkOnClick",
    value: function previewLinkOnClick(url) {
      return function (evt) {
        evt.preventDefault();
        window.open(url, '_blank');
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          block = _this$props.block,
          selected = _this$props.selected;
      var width = this.state.width;
      var blockData = block.getData();
      var url = blockData.get('url');
      var thumbnailSrc = blockData.get('thumbnailSrc');
      var videoTitle = blockData.get('videoTitle');
      var linkProps = {
        href: url,
        rel: 'nofollow',
        target: '_blank'
      };
      return /*#__PURE__*/_jsxs("div", {
        className: VIDEO_COMPONENT_PARENT_CLASS,
        ref: function ref(c) {
          _this2.wrapper = c;
        },
        children: [/*#__PURE__*/_jsxs(ResizeableThumbnailWrapper, {
          onClick: this.handleClick,
          width: width,
          children: [/*#__PURE__*/_jsx(UIImage, {
            alt: videoTitle,
            shape: "thumbnail",
            src: thumbnailSrc,
            width: width
          }), /*#__PURE__*/_jsx(ResizeableThumbnailOutline, {
            selected: selected
          }), /*#__PURE__*/_jsx(ResizeableThumbnailDragHandle, {
            onMouseDown: this.handleDragStart,
            onMouseUp: this.handleDragEnd,
            selected: selected
          })]
        }), /*#__PURE__*/_jsx(UILink, Object.assign({}, linkProps, {
          children: videoTitle
        }))]
      });
    }
  }]);

  return VideoComponent;
}(PureComponent);

VideoComponent.propTypes = {
  block: PropTypes.instanceOf(Record).isRequired,
  onFocus: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
};
VideoComponent.contextTypes = {
  getEditorState: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
export default AtomicFocus([VIDEO_COMPONENT_PARENT_CLASS])(VideoComponent);