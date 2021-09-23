'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import I18n from 'I18n';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';
import UIDropZone from 'UIComponents/drop/UIDropZone';
import UIFileInput from 'UIComponents/input/UIFileInput';
import UIProgress from 'UIComponents/progress/UIProgress';
import Small from 'UIComponents/elements/Small';
import { ICON_SIZES } from 'UIComponents/icon/IconConstants';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES, ACCOUNT_TYPE_TO_VIDEO_LINK, BROADCAST_MEDIA_TYPE, MAX_IMAGE_BYTES_DEFAULT } from '../../lib/constants';
import { validateLocalFile, uppercaseFirstLetter } from '../../lib/utils';
import { accountTypeProp, setProp } from '../../lib/propTypes';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
var SIZES = ['small', 'large'];

var FileUploadZone = /*#__PURE__*/function (_Component) {
  _inherits(FileUploadZone, _Component);

  function FileUploadZone(props) {
    var _this;

    _classCallCheck(this, FileUploadZone);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FileUploadZone).call(this, props));

    _this.handleDragOver = function (e) {
      e.preventDefault();
    };

    _this.handleDrop = function (e) {
      e.preventDefault();

      _this.setState({
        hoveringOver: false
      });

      var file = e.dataTransfer.files[0];

      if (file) {
        _this._handleFile(file);
      }
    };

    _this.handleSelectFile = function (e) {
      if (e.target.value) {
        _this._handleFile(e.target.value);
      }
    };

    _this._handleFile = function (file) {
      var errors = validateLocalFile(file, _this.props.network, _this.props.allowedExtensions);

      if (!errors.isEmpty()) {
        _this.setState({
          error: errors.first()
        });
      } else {
        _this.props.onUpload(file);

        _this.setState({
          error: null
        });
      }
    };

    _this.handleDragEnter = function () {
      if (!_this.state.hoveringOver) {
        _this.setState({
          hoveringOver: true
        });
      }
    };

    _this.handleDragLeave = function (event) {
      if (_this.state.hoveringOver) {
        var node = findDOMNode(_this._dropzone);
        var rect = node.getBoundingClientRect();

        if (!_this.isInsideRect(event.nativeEvent.clientX, event.nativeEvent.clientY, rect)) {
          _this.setState({
            hoveringOver: false
          });
        }
      }
    };

    _this.state = {
      hoveringOver: false
    };
    return _this;
  }

  _createClass(FileUploadZone, [{
    key: "isInsideRect",
    value: function isInsideRect(x, y, rect) {
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
  }, {
    key: "renderUpload",
    value: function renderUpload() {
      if (this.props.showBrowse) {
        return /*#__PURE__*/_jsx(UIButton, {
          use: "link",
          className: "browse",
          onClick: this.props.onFileManagerBrowse,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sui.bulkScheduleModal.bulkSchedule.upload.browse"
          })
        });
      }

      return /*#__PURE__*/_jsx(UIFileInput, {
        showFilePreview: false,
        selectLabel: I18n.text('sui.bulkScheduleModal.bulkSchedule.upload.browse'),
        use: "link",
        onChange: this.handleSelectFile,
        value: undefined
      });
    }
  }, {
    key: "renderActions",
    value: function renderActions() {
      var children = this.props.children;

      if (children) {
        return children;
      }

      return this.renderUpload();
    }
  }, {
    key: "renderSelectedFile",
    value: function renderSelectedFile() {
      if (this.props.selectedFile) {
        return /*#__PURE__*/_jsx("span", {
          children: this.props.selectedFile.name
        });
      }

      return /*#__PURE__*/_jsx("span", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sui.bulkScheduleModal.bulkSchedule.upload.drop"
        })
      });
    }
  }, {
    key: "renderError",
    value: function renderError() {
      if (!this.state.error) {
        return null;
      }

      var maxSize = I18n.formatSize(ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES[this.props.network]) || MAX_IMAGE_BYTES_DEFAULT;
      var displayNetwork = uppercaseFirstLetter(this.props.network);

      if (!displayNetwork && this.props.variation === 'BULK_UPLOAD') {
        displayNetwork = I18n.text('sui.clientTags.bulk');
      }

      var errorContext = {
        allowedExtensions: this.props.allowedExtensions.join(', '),
        network: displayNetwork,
        maxSize: maxSize,
        videoMaxSize: maxSize,
        videoRequirementsLink: ACCOUNT_TYPE_TO_VIDEO_LINK[this.props.network]
      };
      return /*#__PURE__*/_jsx(UIAlert, {
        className: "error-alert",
        type: "warning",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sui.composer.validation.errors." + this.state.error,
          options: errorContext
        })
      });
    }
  }, {
    key: "renderProgress",
    value: function renderProgress() {
      if (!this.props.progress) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIProgress, {
        value: this.props.progress * 100
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          iconName = _this$props.iconName,
          size = _this$props.size;
      var use = this.state.error ? 'error' : 'default';

      if (this.state.hoveringOver) {
        use = 'hover';
      }

      return /*#__PURE__*/_jsx(UIDropZone, {
        ref: function ref(c) {
          _this2._dropzone = c;
        },
        className: "image-upload-zone " + this.props.className,
        iconName: iconName,
        onDragOver: this.handleDragOver,
        onDrop: this.handleDrop,
        onDragEnter: this.handleDragEnter,
        onDragLeave: this.handleDragLeave,
        use: use,
        size: size,
        children: /*#__PURE__*/_jsxs("span", {
          children: [this.renderError(), this.renderSelectedFile(), "\xA0", /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sui.bulkScheduleModal.bulkSchedule.upload.or"
          }), "\xA0", this.renderActions(), this.renderProgress(), this.props.network === ACCOUNT_TYPES.instagram && /*#__PURE__*/_jsx(Small, {
            className: "instagram-note",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sui.composer.validation.suggestions.instagramDimensionsTooSmall"
            })
          })]
        })
      });
    }
  }]);

  return FileUploadZone;
}(Component);

FileUploadZone.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  iconName: PropTypes.string,
  iconSize: PropTypes.oneOf(Object.keys(ICON_SIZES)),
  selectedFile: PropTypes.object,
  mediaType: PropTypes.oneOf([BROADCAST_MEDIA_TYPE.PHOTO, BROADCAST_MEDIA_TYPE.VIDEO]),
  allowedExtensions: setProp,
  // Network will not be present if this is within the Bulk Uploader
  network: accountTypeProp,
  showBrowse: PropTypes.bool.isRequired,
  progress: PropTypes.number,
  size: PropTypes.oneOf(SIZES).isRequired,
  onFileManagerBrowse: PropTypes.func,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  variation: PropTypes.oneOf(['BULK_UPLOAD', 'COMPOSER']).isRequired
};
FileUploadZone.defaultProps = {
  className: '',
  showBrowse: false,
  // means show a local file browser instead of File Manager browse
  iconName: 'upload',
  size: 'small',
  variation: 'COMPOSER'
};
export { FileUploadZone as default };