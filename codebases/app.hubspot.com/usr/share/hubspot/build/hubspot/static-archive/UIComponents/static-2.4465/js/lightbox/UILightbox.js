'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import devLogger from 'react-utils/devLogger';
import { rgba } from '../core/Color';
import { PANTERA } from 'HubStyleTokens/colors';
import UIDialogCloseButton from '../dialog/UIDialogCloseButton';
import UIDialogFooter from '../dialog/UIDialogFooter';
import UIImage from '../image/UIImage';
import UIModal from '../dialog/UIModal';
var LIGHTBOX_PADDING = '70px';
var StyledModalBody = styled.div.withConfig({
  displayName: "UILightbox__StyledModalBody",
  componentId: "sc-1irkwz6-0"
})(["&&{display:block;height:100%;padding:", ";word-wrap:break-word;}"], LIGHTBOX_PADDING);
var FooterWrapper = styled.div.withConfig({
  displayName: "UILightbox__FooterWrapper",
  componentId: "sc-1irkwz6-1"
})(["bottom:0;color:inherit;position:absolute;width:100%;"]);
var LightboxFooter = styled(UIDialogFooter).withConfig({
  displayName: "UILightbox__LightboxFooter",
  componentId: "sc-1irkwz6-2"
})(["&&{background-color:", ";color:inherit;padding-left:", ";padding-right:", ";}"], rgba(PANTERA, 0.89), LIGHTBOX_PADDING, LIGHTBOX_PADDING);
var LightboxImage = styled(UIImage).withConfig({
  displayName: "UILightbox__LightboxImage",
  componentId: "sc-1irkwz6-3"
})(["&&{height:100%;margin:auto;}"]);

var DefaultFooterComponent = function DefaultFooterComponent(props) {
  var children = props.children;
  return /*#__PURE__*/_jsx(LightboxFooter, {
    align: "between",
    layout: "default",
    children: children
  });
};

var UILightbox = /*#__PURE__*/function (_Component) {
  _inherits(UILightbox, _Component);

  function UILightbox() {
    _classCallCheck(this, UILightbox);

    return _possibleConstructorReturn(this, _getPrototypeOf(UILightbox).apply(this, arguments));
  }

  _createClass(UILightbox, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          closeable = _this$props.closeable,
          FooterComponent = _this$props.FooterComponent,
          imageAlt = _this$props.imageAlt,
          ImageComponent = _this$props.ImageComponent,
          imageSrc = _this$props.imageSrc,
          onClose = _this$props.onClose,
          rest = _objectWithoutProperties(_this$props, ["children", "closeable", "FooterComponent", "imageAlt", "ImageComponent", "imageSrc", "onClose"]);

      if (process.env.NODE_ENV !== 'production') {
        if (imageSrc && !imageAlt) {
          devLogger.warn({
            message: 'UILightbox: for better accessibility, please include a description ' + 'of the image in the `imageAlt` prop .',
            key: 'UILightbox: missing imageAlt prop'
          });
        }
      }

      return /*#__PURE__*/_jsxs(UIModal, Object.assign({}, rest, {
        use: "lightbox",
        children: [closeable && /*#__PURE__*/_jsx(UIDialogCloseButton, {
          size: "lg",
          detached: true,
          onClick: onClose
        }), /*#__PURE__*/_jsx(StyledModalBody, {
          children: /*#__PURE__*/_jsx(ImageComponent, {
            alt: imageAlt,
            objectFit: "contain",
            src: imageSrc
          })
        }), /*#__PURE__*/_jsx(FooterWrapper, {
          children: children && /*#__PURE__*/_jsx(FooterComponent, {
            children: children
          })
        })]
      }));
    }
  }]);

  return UILightbox;
}(Component);

UILightbox.displayName = 'UILightbox';
UILightbox.propTypes = {
  children: PropTypes.node,
  closeable: PropTypes.bool.isRequired,
  FooterComponent: getComponentPropType(UIDialogFooter),
  ImageComponent: getComponentPropType(UIImage),
  imageAlt: PropTypes.string,
  imageSrc: PropTypes.string,
  onClose: PropTypes.func
};
UILightbox.defaultProps = {
  closeable: true,
  FooterComponent: DefaultFooterComponent,
  ImageComponent: LightboxImage
};
export default UILightbox;