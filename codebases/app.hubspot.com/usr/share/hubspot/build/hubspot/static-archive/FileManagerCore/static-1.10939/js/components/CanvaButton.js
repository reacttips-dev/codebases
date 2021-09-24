'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import { isIE11 } from 'UIComponents/utils/BrowserTest';
import loadCanva from '../utils/loadCanva';
import { CANVA_API_KEY, CANVA_TEMPLATES } from '../constants/Canva';
import { RequestStatus } from '../Constants';
import { trackInteraction } from '../actions/tracking';
import { getCanvaInitStatus, getCanvaDownloadStatus, getCanvaIsSupportedForFilter } from '../selectors/Canva';
import { canvaInitAttempted, canvaInitFailed, canvaInitSucceeded } from '../actions/Canva';
import CanvaCreateButton from './CanvaCreateButton';
import CanvaEditButton from './CanvaEditButton';

var CanvaButton = /*#__PURE__*/function (_Component) {
  _inherits(CanvaButton, _Component);

  function CanvaButton(props) {
    var _this;

    _classCallCheck(this, CanvaButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvaButton).call(this, props));

    _this.handleCanvaApiLoaded = function () {
      if (_this.mounted && !window.__CANVA_API) {
        window.CanvaButton.initialize({
          apiKey: CANVA_API_KEY
        }).then(function (canvaApi) {
          window.__CANVA_API = canvaApi;

          _this.props.canvaInitSucceeded();
        });
      }
    };

    _this.handleCanvaApiFailedLoad = function () {
      if (_this.mounted) {
        _this.props.canvaInitFailed();
      }
    };

    _this.openCanvaCreateModal = function (type) {
      _this.props.trackInteraction('Manage Files', 'create-canva-clicked');

      window.__CANVA_API.createDesign({
        publishLabel: 'Save',
        type: type,
        onDesignPublish: function onDesignPublish(_ref) {
          var designId = _ref.designId,
              exportUrl = _ref.exportUrl,
              designTitle = _ref.designTitle;

          _this.props.handleCanvaImport({
            canvaDesignId: designId,
            fileUrl: exportUrl,
            fileName: designTitle
          });
        }
      });
    };

    _this.openCanvaEditModal = function () {
      var file = _this.props.file;

      _this.props.trackInteraction('Manage Files', 'edit-canva-clicked');

      var designId = file.getIn(['meta', 'canva_id']);
      var originalFileId = file.get('id');

      window.__CANVA_API.editDesign({
        designId: designId,
        publishLabel: 'Save',
        onDesignPublish: function onDesignPublish(_ref2) {
          var exportUrl = _ref2.exportUrl,
              designTitle = _ref2.designTitle;

          _this.props.handleCanvaImport({
            originalFileId: originalFileId,
            canvaDesignId: designId,
            fileUrl: exportUrl,
            fileName: designTitle
          });
        }
      });
    };

    _this.isLoaded = function () {
      return _this.props.canvaInitStatus === RequestStatus.SUCCEEDED || !!window.__CANVA_API;
    };

    _this.isDownloading = function () {
      return _this.props.canvaDownloadStatus === RequestStatus.PENDING;
    };

    _this.disabledReason = function () {
      if (isIE11()) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.actions.canvaNotSupportedForIE11"
        });
      } else if (_this.isDownloading()) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.actions.canvaIsDownloading"
        });
      } else if (!_this.props.canvaIsSupportedForFilter) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.actions.canvaNotSupportedForFilter"
        });
      } else if (_this.props.canvaInitStatus === RequestStatus.FAILED) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.actions.canvaLoadFailed"
        });
      } else if (!_this.isLoaded()) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.actions.canvaNotLoaded"
        });
      }

      return null;
    };

    _this.renderLoadingButton = function () {
      var file = _this.props.file;
      return /*#__PURE__*/_jsx(UILoadingButton, {
        className: "canva-loading-button " + (file ? '' : 'm-x-2'),
        disabled: true,
        loading: true,
        size: "small",
        use: "tertiary-light"
      });
    };

    _this.mounted = false;
    return _this;
  }

  _createClass(CanvaButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;

      if (!isIE11()) {
        this.props.canvaInitAttempted();
        loadCanva().then(this.handleCanvaApiLoaded).catch(this.handleCanvaApiFailedLoad).done();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          file = _this$props.file,
          specificCanvaTemplates = _this$props.specificCanvaTemplates;
      var disabledReason = this.disabledReason();
      var isDisabled = !!disabledReason;
      return file ? /*#__PURE__*/_jsx(CanvaEditButton, {
        disabledReason: disabledReason,
        isDisabled: isDisabled,
        isDownloading: this.isDownloading(),
        loadingButton: this.renderLoadingButton(),
        openCanva: this.openCanvaEditModal
      }) : /*#__PURE__*/_jsx(CanvaCreateButton, {
        disabledReason: disabledReason,
        isDisabled: isDisabled,
        isDownloading: this.isDownloading(),
        loadingButton: this.renderLoadingButton(),
        openCanva: this.openCanvaCreateModal,
        specificCanvaTemplates: specificCanvaTemplates
      });
    }
  }]);

  return CanvaButton;
}(Component);

CanvaButton.propTypes = {
  canvaDownloadStatus: PropTypes.oneOf(Object.keys(RequestStatus)).isRequired,
  canvaInitAttempted: PropTypes.func.isRequired,
  canvaInitFailed: PropTypes.func.isRequired,
  canvaInitStatus: PropTypes.oneOf(Object.keys(RequestStatus)).isRequired,
  canvaInitSucceeded: PropTypes.func.isRequired,
  canvaIsSupportedForFilter: PropTypes.bool,
  file: PropTypes.instanceOf(Immutable.Map),
  handleCanvaImport: PropTypes.func.isRequired,
  specificCanvaTemplates: PropTypes.arrayOf(PropTypes.oneOf(CANVA_TEMPLATES)),
  trackInteraction: PropTypes.func.isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    canvaInitStatus: getCanvaInitStatus(state),
    canvaDownloadStatus: getCanvaDownloadStatus(state),
    canvaIsSupportedForFilter: getCanvaIsSupportedForFilter(state)
  };
};

var mapDispatchToProps = {
  canvaInitAttempted: canvaInitAttempted,
  canvaInitFailed: canvaInitFailed,
  canvaInitSucceeded: canvaInitSucceeded,
  trackInteraction: trackInteraction
};
export default connect(mapStateToProps, mapDispatchToProps)(CanvaButton);