'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import keyMirror from 'react-utils/keyMirror';
import UILightbox from 'UIComponents/lightbox/UILightbox';
import UIImage from 'UIComponents/image/UIImage';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import SelectFolderPopover from './SelectFolderPopover';
import ShutterstockTosLinks from './ShutterstockTosLinks';
import InternalShutterstockLicenseAgreement from './InternalShutterstockLicenseAgreement';
import { RequestStatus } from '../Constants';
var Modes = keyMirror({
  PREVIEW: null,
  LICENSE: null
});

function i18nKey(suffix) {
  return "FileManagerCore.shutterstock." + suffix;
}

function renderImageComponent(imageProps) {
  return /*#__PURE__*/_jsx(UIImage, Object.assign({
    style: {
      width: '100%',
      height: 'calc(100% - 5rem)'
    }
  }, imageProps));
}

var ShutterstockPreviewModal = /*#__PURE__*/function (_Component) {
  _inherits(ShutterstockPreviewModal, _Component);

  function ShutterstockPreviewModal(props) {
    var _this;

    _classCallCheck(this, ShutterstockPreviewModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ShutterstockPreviewModal).call(this, props));
    _this.state = {
      mode: Modes.PREVIEW
    };
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    _this.handleSaveFile = _this.handleSaveFile.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ShutterstockPreviewModal, [{
    key: "handleSaveFile",
    value: function handleSaveFile() {
      var _this$props = this.props,
          shutterstockTosAccepted = _this$props.shutterstockTosAccepted,
          onAcquire = _this$props.onAcquire,
          image = _this$props.image;

      if (shutterstockTosAccepted) {
        onAcquire(image);
        return;
      }

      this.setState({
        mode: Modes.LICENSE
      });
    }
  }, {
    key: "handleCancel",
    value: function handleCancel() {
      this.setState({
        mode: Modes.PREVIEW
      });
    }
  }, {
    key: "renderPreview",
    value: function renderPreview() {
      var _this$props2 = this.props,
          onClose = _this$props2.onClose,
          image = _this$props2.image,
          onChangeFolder = _this$props2.onChangeFolder,
          shutterstockFolder = _this$props2.shutterstockFolder,
          onTrackInteraction = _this$props2.onTrackInteraction,
          acquireRequestStatus = _this$props2.acquireRequestStatus;
      return /*#__PURE__*/_jsxs(UILightbox, {
        imageSrc: image.get('largePreviewUrl'),
        onClose: onClose,
        ImageComponent: renderImageComponent,
        children: [/*#__PURE__*/_jsxs("span", {
          children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: i18nKey('saveTo'),
            options: {
              folder: shutterstockFolder ? shutterstockFolder.get('name') : 'Stock images'
            }
          }), /*#__PURE__*/_jsx(SelectFolderPopover, {
            folder: shutterstockFolder,
            onChangeFolder: onChangeFolder,
            onTrackInteraction: onTrackInteraction
          })]
        }), /*#__PURE__*/_jsx(ShutterstockTosLinks, {
          use: "on-dark",
          compact: true
        }), /*#__PURE__*/_jsx(UILoadingButton, {
          "data-test-id": "save-shutterstock-image-button",
          use: "primary",
          onClick: this.handleSaveFile,
          loading: acquireRequestStatus === RequestStatus.PENDING,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerCore.actions.acquire"
          })
        })]
      });
    }
  }, {
    key: "renderLicenseAgreement",
    value: function renderLicenseAgreement() {
      var _this$props3 = this.props,
          onClose = _this$props3.onClose,
          onAcquire = _this$props3.onAcquire;
      return /*#__PURE__*/_jsx(InternalShutterstockLicenseAgreement, {
        onClose: onClose,
        onCancel: this.handleCancel,
        onAgreeCallback: onAcquire
      });
    }
  }, {
    key: "render",
    value: function render() {
      var mode = this.state.mode;

      if (mode === Modes.LICENSE) {
        return this.renderLicenseAgreement();
      }

      return this.renderPreview();
    }
  }]);

  return ShutterstockPreviewModal;
}(Component);

export { ShutterstockPreviewModal as default };
ShutterstockPreviewModal.propTypes = {
  image: PropTypes.instanceOf(Immutable.Map).isRequired,
  shutterstockTosAccepted: PropTypes.bool,
  shutterstockFolder: PropTypes.instanceOf(Immutable.Map),
  onAcquire: PropTypes.func.isRequired,
  acquireRequestStatus: PropTypes.oneOf(Object.keys(RequestStatus)).isRequired,
  onChangeFolder: PropTypes.func.isRequired,
  onTrackInteraction: PropTypes.func,
  onClose: PropTypes.func.isRequired
};