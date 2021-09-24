'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import debounce from 'transmute/debounce';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import changeBlockData from 'draft-plugins/utils/changeBlockData';
import { fromJS, Map as ImmutableMap } from 'immutable';
import styled from 'styled-components';
import ComponentWithPartials from 'UIComponents/mixins/ComponentWithPartials';
import UIBadge from 'UIComponents/badge/UIBadge';
import UIButtonGroup from 'UIComponents/button/UIButtonGroup';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIOverlay from 'UIComponents/overlay/UIOverlay';
import UIOptimisticNanoProgress from 'UIComponents/progress/UIOptimisticNanoProgress';
import { getFileInfo } from '../api/FileManagerApi';
import { getSignedSrc } from '../lib/Images';
import ResizeableThumbnailOutline from './thumbnail/ResizeableThumbnailOutline';
import ImageLinkPopover from './ImageLinkPopover';
import AtomicFocusWithRef from './AtomicFocusWithRef';
import ResizeableThumbnailDragHandleCorners from './thumbnail/ResizeableThumbnailDragHandleCorners';
var MIN_RENDER_TOOL_WIDTH = 366;
var MIN_RENDER_TOOL_HEIGHT = 50;
var IMG_PARENT_CLASS = 'image-component-alignment';
var LINKPOPOVER_PARENT_CLASS = 'image-component-popover';
var IMAGE_RESIZE_BUTTONS_CLASS = 'image-resize-buttons';

var isLegacySignedUrl = function isLegacySignedUrl(url) {
  return url && url.includes('rich_text_hidden_files');
};

var getLegacySignedUrlBasePath = function getLegacySignedUrlBasePath(signedUrl) {
  var pathStartIndex = signedUrl.indexOf('rich_text_hidden_files');
  var pathEndIndex = signedUrl.indexOf('?Expires');
  return signedUrl.slice(pathStartIndex, pathEndIndex);
};

var ImageLinkButton = function ImageLinkButton(props) {
  return /*#__PURE__*/_jsx(UIButton, {
    size: "small",
    onClick: props.togglePopover,
    children: /*#__PURE__*/_jsx(UIIcon, {
      name: "link"
    })
  });
};

ImageLinkButton.propTypes = {
  togglePopover: PropTypes.func
};
var ResizeableThumbnailPreview = styled.img.withConfig({
  displayName: "ImageComponent__ResizeableThumbnailPreview",
  componentId: "sc-6ptikb-0"
})(["height:", "px;width:", "px;opacity:0.3;position:absolute;top:-3px;left:-3px;display:", ";"], function (props) {
  return props.height;
}, function (props) {
  return props.width;
}, function (props) {
  return props.display === false ? 'none' : 'block';
});
var DecoratedLinkButton = ImageLinkPopover(ImageLinkButton);
var ImageComponent = createReactClass({
  displayName: "ImageComponent",
  mixins: [ComponentWithPartials],
  propTypes: {
    block: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    onFocus: PropTypes.func.isRequired,
    overrideKeyDown: PropTypes.func.isRequired,
    restoreKeyDown: PropTypes.func.isRequired,
    forwardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
      current: PropTypes.any
    })]),
    useProsemirror: PropTypes.bool,
    prosemirrorProps: PropTypes.object
  },
  contextTypes: {
    getEditorState: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    getReadOnly: PropTypes.func.isRequired,
    setReadOnly: PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    var _this$props = this.props,
        useProsemirror = _this$props.useProsemirror,
        prosemirrorProps = _this$props.prosemirrorProps;
    var isInitiallyReadOnly = useProsemirror ? false : this.context.getReadOnly();
    var width;
    var height;

    if (useProsemirror) {
      width = prosemirrorProps.width;
      height = prosemirrorProps.height;
    } else {
      var _this$getData$toObjec = this.getData().toObject(),
          image = _this$getData$toObjec.image;

      width = image.toObject().width;
      height = image.toObject().height;
    }

    var isPct = width && typeof width === 'string' && width.indexOf('%') !== -1;
    var parsedWidth;
    var parsedHeight;
    var ratio;

    if (isPct) {
      parsedWidth = width;
      parsedHeight = height;
    } else {
      parsedWidth = parseInt(width, 10);
      parsedHeight = parseInt(height, 10);

      if (!isNaN(parsedWidth) && !isNaN(parsedHeight)) {
        ratio = parsedWidth / parsedHeight;
      }
    }

    return {
      ratio: ratio,
      isPct: isPct,
      isInitiallyReadOnly: isInitiallyReadOnly,
      width: parsedWidth,
      height: parsedHeight,
      dragging: false,
      linkPopoverOpen: false
    };
  },
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    var _this$props2 = this.props,
        useProsemirror = _this$props2.useProsemirror,
        prosemirrorProps = _this$props2.prosemirrorProps;
    this.debouncedUpdateData = debounce(300, useProsemirror ? prosemirrorProps.updateImage : this.updateData);
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var _this$props3 = this.props,
        useProsemirror = _this$props3.useProsemirror,
        prosemirrorProps = _this$props3.prosemirrorProps;
    var src = useProsemirror ? prosemirrorProps.src : this.getData().getIn(['image', 'src']);

    if (isLegacySignedUrl(src)) {
      var fileManagerPath = getLegacySignedUrlBasePath(src);
      getFileInfo(fileManagerPath).then(function (_ref) {
        var id = _ref.id;
        var newSrc = getSignedSrc(id);
        var updatedData = {
          image: {
            src: newSrc
          }
        };

        if (useProsemirror) {
          prosemirrorProps.updateImage(updatedData);
        } else {
          _this.updateData(updatedData);
        }
      });
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (prevProps.selected === true && this.props.selected === false) {
      this.handleBlur();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  },
  handleClick: function handleClick() {
    if (this.state.isInitiallyReadOnly) {
      return;
    }

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    this.props.onFocus();
    this.ensureValidDimensions();
  },
  handleBlur: function handleBlur() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.handleLinkPopoverClose();
    this.linkPopover.clearInput();
  },
  updateData: function updateData(data) {
    var block = this.props.block;
    var _this$context = this.context,
        getEditorState = _this$context.getEditorState,
        onChange = _this$context.onChange;
    var editorState = getEditorState();
    var _data$image = data.image,
        image = _data$image === void 0 ? {} : _data$image,
        _data$link = data.link,
        link = _data$link === void 0 ? {} : _data$link;
    var oldData = this.getData();
    var updatedBlockData = oldData.mergeDeep({
      image: image,
      link: link
    });
    var updatedEditorState = changeBlockData({
      editorState: editorState,
      block: block,
      updatedBlockData: updatedBlockData
    });
    onChange(updatedEditorState);
  },
  getData: function getData() {
    var blockData = this.props.block.getData();
    var isFormatted = ImmutableMap.isMap(blockData.get('image'));

    if (isFormatted) {
      return blockData;
    }

    var rawData = blockData.toObject(); // the `convertFromRaw` function supplied by draft-js does not
    // deeply convert block data to Immutable objects (it simply
    // calls the Map constructor on `block.data`), so we do this
    // hack to make sure all our data is in Immutable form

    var deeplyConverted = fromJS(rawData);
    return deeplyConverted;
  },
  updateSize: function updateSize(width, height) {
    if (width > 0 && height > 0) {
      var newData = {
        image: {
          width: width,
          height: height
        }
      };
      this.debouncedUpdateData(newData);
      this.setState({
        width: width,
        height: height,
        previewWidth: null,
        previewHeight: null
      });
    }
  },
  ensureValidDimensions: function ensureValidDimensions() {
    var _this$state = this.state,
        width = _this$state.width,
        height = _this$state.height;

    if (!width || !height) {
      var parentRect = this.parent.getBoundingClientRect();
      var parentWidth = parentRect.width;
      var parentHeight = parentRect.height;
      this.setState({
        ratio: parentWidth / parentHeight
      });
      this.updateSize(parentWidth, parentHeight);
    }
  },
  getImageRatio: function getImageRatio() {
    var _this$img$getBounding = this.img.getBoundingClientRect(),
        width = _this$img$getBounding.width,
        height = _this$img$getBounding.height;

    var ratio = width / height;
    this.setState({
      ratio: ratio,
      isPct: false
    });
    return ratio;
  },
  // This function gets the new bounds (width and height) of an image given
  // the original bounds, where you started dragging from, where you
  // finished dragging (gotten from the event), the ratio of the image, and
  // if we should invert the horizontal and the vertical dimensions.
  // the Invert variables are set based on which corner you are dragging from
  // (Values found in the ResizeableThumbnailDragHandleCorners file)
  // Top Left: Both Inverted
  // Top Right: Horizontal Inverted
  // Bottom Left: Vertical Inverted
  // Bottom Right: Neither Inverted
  getNewBounds: function getNewBounds(e) {
    var _this$state2 = this.state,
        isPct = _this$state2.isPct,
        originalDragPosition = _this$state2.originalDragPosition,
        width = _this$state2.width,
        height = _this$state2.height,
        invertHorizontal = _this$state2.invertHorizontal,
        invertVertical = _this$state2.invertVertical;
    var ratio = this.state.ratio;

    if (isPct) {
      ratio = this.getImageRatio();
    }

    var xDiff = originalDragPosition.clientX - e.clientX;
    var yDiff = originalDragPosition.clientY - e.clientY; //Calculate the new bounds for the image for both the X and Y distance dragged

    var newWidthX = invertHorizontal ? width + xDiff : width - xDiff;
    var newHeightX = Math.round(newWidthX / ratio);
    var newHeightY = invertVertical ? height + yDiff : height - yDiff;
    var newWidthY = Math.round(newHeightY * ratio);

    if (newWidthX > newWidthY) {
      return {
        newWidth: newWidthX,
        newHeight: newHeightX
      };
    } else {
      return {
        newWidth: newWidthY,
        newHeight: newHeightY
      };
    }
  },
  handleDefault: function handleDefault(e) {
    e.preventDefault();

    if (e.type === 'click') {
      e.stopPropagation();
    }
  },
  handleMouseDown: function handleMouseDown(e, invertHorizontal, invertVertical) {
    this.setState({
      dragging: true,
      originalDragPosition: {
        clientX: e.clientX,
        clientY: e.clientY
      },
      invertHorizontal: invertHorizontal,
      invertVertical: invertVertical
    });
  },
  handleMouseUp: function handleMouseUp(e) {
    var dragging = this.state.dragging;

    if (dragging) {
      var _this$getNewBounds = this.getNewBounds(e),
          newWidth = _this$getNewBounds.newWidth,
          newHeight = _this$getNewBounds.newHeight;

      this.updateSize(newWidth, newHeight);
    }

    this.setState({
      dragging: false,
      originalDragPosition: null,
      invertHorizontal: null,
      invertVertical: null
    });
  },
  handleMouseMove: function handleMouseMove(e) {
    var dragging = this.state.dragging;

    if (dragging) {
      var _this$getNewBounds2 = this.getNewBounds(e),
          newWidth = _this$getNewBounds2.newWidth,
          newHeight = _this$getNewBounds2.newHeight;

      this.setState({
        previewWidth: newWidth,
        previewHeight: newHeight
      });
    }
  },
  handleButtonClick: function handleButtonClick(newWidth, e) {
    var isPct = this.state.isPct;
    var ratio = this.state.ratio;
    this.handleDefault(e);

    if (isPct) {
      ratio = this.getImageRatio();
    }

    var newHeight = Math.round(newWidth / ratio);
    this.updateSize(newWidth, newHeight);
  },
  handleLinkPopoverOpen: function handleLinkPopoverOpen() {
    this.props.overrideKeyDown();
    this.setState({
      linkPopoverOpen: true
    });
  },
  handleLinkPopoverClose: function handleLinkPopoverClose() {
    this.props.restoreKeyDown();
    this.setState({
      linkPopoverOpen: false
    });
  },
  handleLinkPopoverOpenChange: function handleLinkPopoverOpenChange(e) {
    this.setState({
      linkPopoverOpen: e.target.value
    });
  },
  handleLinkChange: function handleLinkChange(newData) {
    this.debouncedUpdateData({
      link: newData
    });
    this.setState(Object.assign({
      linkPopoverOpen: false
    }, newData));
    this.props.onFocus();
  },
  handleRemove: function handleRemove() {
    this.handleLinkChange({
      url: null,
      isTargetBlank: null
    });
  },
  renderResizeTools: function renderResizeTools(previewImgSrc) {
    var _this2 = this;

    var _this$props4 = this.props,
        selected = _this$props4.selected,
        useProsemirror = _this$props4.useProsemirror,
        prosemirrorProps = _this$props4.prosemirrorProps;

    var _ref2 = useProsemirror ? {} : this.getData().toObject(),
        image = _ref2.image,
        link = _ref2.link;

    var _this$state3 = this.state,
        width = _this$state3.width,
        height = _this$state3.height,
        dragging = _this$state3.dragging,
        isPct = _this$state3.isPct,
        linkPopoverOpen = _this$state3.linkPopoverOpen,
        previewWidth = _this$state3.previewWidth,
        previewHeight = _this$state3.previewHeight,
        invertHorizontal = _this$state3.invertHorizontal,
        invertVertical = _this$state3.invertVertical;
    var url;
    var isTargetBlank;
    var isNoFollow;
    var pctStyle = {};

    if (isPct) {
      pctStyle = {
        width: width,
        height: '100%',
        position: 'absolute'
      };
    }

    if (link) {
      url = link.get('url');
      isTargetBlank = link.get('isTargetBlank');
      isNoFollow = link.get('isNoFollow');
    }

    if (useProsemirror) {
      url = prosemirrorProps.link.url;
      isTargetBlank = prosemirrorProps.link.isTargetBlank;
      isNoFollow = prosemirrorProps.link.isNoFollow;
    }

    var fitsSizeConstraints = width > MIN_RENDER_TOOL_WIDTH && height > MIN_RENDER_TOOL_HEIGHT;
    var dimensionsClasses = 'image-component-dimensions' + (selected && (fitsSizeConstraints || isPct) ? " selected" : "");
    var buttonGroupClasses = 'image-component-button-group' + (selected ? " selected" : "");
    var sizes = [150, 250, 400];
    var buttons;

    if (fitsSizeConstraints || isPct) {
      buttons = sizes.map(function (size) {
        return /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          onClick: _this2.partial(_this2.handleButtonClick, size),
          className: IMAGE_RESIZE_BUTTONS_CLASS,
          children: size + "px"
        }, "image-resize-button-" + size);
      });
      var originalDimensions = useProsemirror ? prosemirrorProps.originalDimensions : image.get('originalDimensions');

      if (originalDimensions && originalDimensions.width !== width && originalDimensions.height !== height) {
        buttons.push( /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          onClick: this.partial(this.handleButtonClick, originalDimensions.width),
          className: IMAGE_RESIZE_BUTTONS_CLASS,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "draftPlugins.imagePlugin.resetSize"
          })
        }, "image-resize-button-original"));
      }
    }

    return /*#__PURE__*/_jsxs("div", {
      style: pctStyle,
      children: [/*#__PURE__*/_jsxs(ResizeableThumbnailOutline, {
        height: previewHeight || height,
        width: previewWidth || width,
        invertHorizontal: invertHorizontal,
        invertVertical: invertVertical,
        selected: selected,
        children: [/*#__PURE__*/_jsx(ResizeableThumbnailDragHandleCorners, {
          selected: selected,
          handleMouseDown: this.handleMouseDown
        }), /*#__PURE__*/_jsx(ResizeableThumbnailPreview, {
          src: previewImgSrc,
          height: previewHeight || height,
          width: previewWidth || width,
          display: dragging
        })]
      }), /*#__PURE__*/_jsx(UIBadge, {
        className: dimensionsClasses,
        children: width + " x " + height
      }), /*#__PURE__*/_jsxs(UIButtonGroup, {
        className: buttonGroupClasses,
        children: [buttons, /*#__PURE__*/_jsx(DecoratedLinkButton, {
          ref: function ref(c) {
            _this2.linkPopover = c;
            return c;
          },
          open: linkPopoverOpen,
          onOpenChange: this.handleLinkPopoverOpenChange,
          url: url,
          isTargetBlank: isTargetBlank,
          isNoFollow: isNoFollow,
          onOpen: this.handleLinkPopoverOpen,
          onCancel: this.handleLinkPopoverClose,
          onConfirm: this.handleLinkChange,
          onRemove: this.handleRemove,
          className: LINKPOPOVER_PARENT_CLASS
        })]
      })]
    });
  },
  renderProgressOverlay: function renderProgressOverlay(isTemporary, uploadPercent) {
    if (!isTemporary || uploadPercent >= 100) {
      return null;
    }

    var width = this.state.width;
    return /*#__PURE__*/_jsxs(UIOverlay, {
      className: "image-component-loading-overlay",
      contextual: true,
      width: width,
      use: "light",
      children: [/*#__PURE__*/_jsx(UIOptimisticNanoProgress, {
        value: uploadPercent
      }), /*#__PURE__*/_jsx(UIFlex, {
        align: "center",
        justify: "center",
        style: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          position: 'absolute'
        },
        children: /*#__PURE__*/_jsx(UILoadingSpinner, {})
      })]
    });
  },
  render: function render() {
    var _this3 = this;

    var _this$props5 = this.props,
        block = _this$props5.block,
        useProsemirror = _this$props5.useProsemirror,
        prosemirrorProps = _this$props5.prosemirrorProps;
    var _this$state4 = this.state,
        width = _this$state4.width,
        height = _this$state4.height,
        isPct = _this$state4.isPct;
    var align = useProsemirror ? '' : block.getData().get('align');
    var imgStyle = {};
    var imgAttributes = {};

    if (isPct) {
      imgStyle = {
        width: width,
        height: height
      };
    } else if (width || height) {
      imgAttributes = {
        width: width,
        height: height
      };
    }

    var alignmentClasses = classNames(IMG_PARENT_CLASS, {
      'left': "left",
      'center': "center",
      'right': "right"
    }[align]);
    var src = useProsemirror ? prosemirrorProps.src : this.getData().getIn(['image', 'src']);
    var isTemporary = useProsemirror ? !!prosemirrorProps.isTemporary : !!this.getData().getIn(['image', 'isTemporary']);
    var uploadPercent = useProsemirror ? prosemirrorProps.uploadPercent : this.getData().getIn(['image', 'uploadPercent']);
    return /*#__PURE__*/_jsx("div", {
      className: alignmentClasses,
      ref: this.props.forwardRef,
      children: /*#__PURE__*/_jsxs("div", {
        ref: function ref(c) {
          _this3.parent = c;
          return c;
        },
        className: "image-component",
        onMouseDown: this.handleDefault,
        onMouseUp: this.handleDefault,
        onClick: this.handleClick,
        children: [this.renderProgressOverlay(isTemporary, uploadPercent), /*#__PURE__*/_jsx("img", Object.assign({
          ref: function ref(c) {
            _this3.img = c;
            return c;
          },
          src: src,
          style: imgStyle
        }, imgAttributes)), this.renderResizeTools(src)]
      })
    });
  }
});
export default AtomicFocusWithRef([LINKPOPOVER_PARENT_CLASS])(ImageComponent);
export var ProsemirrorImageComponent = ImageComponent;