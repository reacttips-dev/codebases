'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _ErrorMessages;

import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import keyMirror from 'react-utils/keyMirror';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIImage from 'UIComponents/image/UIImage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaRight from 'UIComponents/layout/UIMediaRight';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UITruncateString from 'UIComponents/text/UITruncateString';
import Small from 'UIComponents/elements/Small';
import preloadImage from 'FileManagerCore/utils/preloadImage';
import { FileTypes, ImportImageCopyrightNoticeValues } from 'FileManagerCore/Constants';
import PortalMetaCategoryIds from 'FileManagerCore/enums/PortalMetaCategoryIds';
import { downloadFromExternalUrl } from 'FileManagerCore/actions/Files';
import { updatePortalMeta } from 'FileManagerCore/actions/PortalMeta';
import { trackInteraction } from 'FileManagerCore/actions/tracking';
import { getIsDownloadFromExternalUrlPending } from 'FileManagerCore/selectors/FileDetails';
import { getHasAcceptedImportCopyrightNotice } from 'FileManagerCore/selectors/PortalMeta';
import { DrawerFileAccess } from '../../enums/FileAccess';
import FileExtensionFilters from '../../enums/FileExtensionFilters';
import { getUploadedFileAccess } from '../../selectors/Configuration';
import { getFilteredExtensions, getFilterType } from '../../selectors/Filter';
import { getIsFileExtensionNotSupported } from '../../utils/fileFiltering';
import FromUrlInput from './FromUrlInput';
import FilterHintMessage from './FilterHintMessage';
import { DrawerTypes } from '../../Constants';
import ImportImageCopyrightConfirm from '../modals/ImportImageCopyrightConfirm';
var Errors = keyMirror({
  NOT_FOUND: null,
  DATA_URI: null,
  EXTENSION_FILTER: null,
  DOWNLOAD_URL_FAILED: null
});
var ErrorMessages = (_ErrorMessages = {}, _defineProperty(_ErrorMessages, Errors.NOT_FOUND, 'loadingError'), _defineProperty(_ErrorMessages, Errors.DATA_URI, 'dataUri'), _defineProperty(_ErrorMessages, Errors.EXTENSION_FILTER, 'extensionFilter'), _defineProperty(_ErrorMessages, Errors.DOWNLOAD_URL_FAILED, 'downloadUrlFailed'), _ErrorMessages);

function i18nKey(suffix) {
  return "FileManagerLib.panels.fromUrl." + suffix;
}

function getErrorMessage(error) {
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: i18nKey("errors." + ErrorMessages[error])
  });
}

var FromUrlPanel = /*#__PURE__*/function (_Component) {
  _inherits(FromUrlPanel, _Component);

  function FromUrlPanel(props) {
    var _this;

    _classCallCheck(this, FromUrlPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FromUrlPanel).call(this, props));

    _this.handleInsert = function () {
      var hasAcceptedImportCopyrightNotice = _this.props.hasAcceptedImportCopyrightNotice;

      if (hasAcceptedImportCopyrightNotice) {
        _this.downloadAndInsert();
      } else {
        _this.props.trackInteraction('fileManagerManageFiles', 'show-copyright-notice');

        _this.setState({
          copyrightModalOpen: true
        });
      }
    };

    _this.downloadAndInsert = function () {
      var tempImageUrl = _this.state.tempImageUrl;
      var _this$props = _this.props,
          onInsert = _this$props.onInsert,
          uploadedFileAccess = _this$props.uploadedFileAccess;
      var pathPaths = tempImageUrl.split('/');
      var name = pathPaths[pathPaths.length - 1];

      _this.props.downloadFromExternalUrl(tempImageUrl, uploadedFileAccess, {
        name: name
      }).then(function (file) {
        return onInsert(file, {
          target: 'import-from-url'
        });
      }).catch(function () {
        _this.setState({
          error: Errors.DOWNLOAD_URL_FAILED
        });
      });
    };

    _this.state = {
      tempImageUrl: '',
      image: null,
      error: null,
      isPreloading: false,
      copyrightModalOpen: false
    };
    _this.handleUrlChange = _this.handleUrlChange.bind(_assertThisInitialized(_this));
    _this.handleKeyUp = _this.handleKeyUp.bind(_assertThisInitialized(_this));
    _this.handleInsert = _this.handleInsert.bind(_assertThisInitialized(_this));
    _this.handlePreview = _this.handlePreview.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FromUrlPanel, [{
    key: "getDimensions",
    value: function getDimensions(image) {
      return image.get('width') + " x " + image.get('height') + " px";
    }
  }, {
    key: "handleUrlChange",
    value: function handleUrlChange(event) {
      this.setState({
        tempImageUrl: event.target.value
      });
    }
  }, {
    key: "handlePreview",
    value: function handlePreview() {
      var _this2 = this;

      var _this$props2 = this.props,
          filterType = _this$props2.filterType,
          filteredExtensions = _this$props2.filteredExtensions;
      var tempImageUrl = this.state.tempImageUrl;

      if (tempImageUrl.startsWith('data:')) {
        this.setState({
          error: Errors.DATA_URI,
          image: null
        });
        return;
      }

      if (!tempImageUrl) {
        return;
      }

      this.setState({
        isPreloading: true
      });
      preloadImage(tempImageUrl, function (meta) {
        var error = null;

        if (meta.extension && !filteredExtensions.isEmpty()) {
          if (getIsFileExtensionNotSupported(meta.extension, filteredExtensions, filterType)) {
            error = Errors.EXTENSION_FILTER;
          }
        }

        _this2.setState({
          image: Immutable.Map(Object.assign({
            id: -1,
            url: tempImageUrl,
            type: FileTypes.IMG
          }, meta)),
          error: error,
          isPreloading: false
        });
      }, function () {
        _this2.setState({
          error: Errors.NOT_FOUND,
          image: null,
          isPreloading: false
        });
      });
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event) {
      if (event.key === 'Enter') {
        this.handlePreview();
      }
    }
  }, {
    key: "renderInsertButton",
    value: function renderInsertButton() {
      var isDownloadPending = this.props.isDownloadPending;
      return /*#__PURE__*/_jsx(UILoadingButton, {
        use: "primary",
        disabled: Boolean(this.state.error),
        onClick: this.handleInsert,
        loading: isDownloadPending,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: i18nKey('import')
        })
      });
    }
  }, {
    key: "renderCopyrightModal",
    value: function renderCopyrightModal() {
      var _this3 = this;

      return /*#__PURE__*/_jsx(ImportImageCopyrightConfirm, {
        onConfirm: function onConfirm() {
          _this3.setState({
            copyrightModalOpen: false
          });

          _this3.props.updatePortalMeta(PortalMetaCategoryIds.IMPORT_IMAGE_COPYRIGHT_NOTICE, ImportImageCopyrightNoticeValues.ACCEPTED);

          _this3.downloadAndInsert();

          _this3.props.trackInteraction('fileManagerManageFiles', 'accept-copyright-notice');
        },
        onReject: function onReject() {
          _this3.setState({
            copyrightModalOpen: false
          });

          _this3.props.trackInteraction('fileManagerManageFiles', 'reject-copyright-notice');
        }
      });
    }
  }, {
    key: "renderPreview",
    value: function renderPreview() {
      var image = this.state.image;
      return /*#__PURE__*/_jsxs("div", {
        className: "from-url-panel__preview m-top-4",
        children: [/*#__PURE__*/_jsx("span", {
          className: "from-url-panel__preview-heading",
          children: I18n.text(i18nKey('imagePreview'))
        }), /*#__PURE__*/_jsx(UIImage, {
          className: "from-url-panel__preview-image",
          src: image.get('url')
        }), /*#__PURE__*/_jsxs(UIMedia, {
          className: "m-top-6",
          children: [/*#__PURE__*/_jsxs(UIMediaBody, {
            children: [/*#__PURE__*/_jsx(Small, {
              use: "help",
              tagName: "p",
              children: /*#__PURE__*/_jsx(UITruncateString, {
                children: image.get('name') + "." + image.get('extension')
              })
            }), /*#__PURE__*/_jsx(Small, {
              use: "help",
              tagName: "p",
              children: I18n.text('FileManagerLib.fileDetail.dimensions', {
                dimensions: this.getDimensions(image)
              })
            })]
          }), /*#__PURE__*/_jsx(UIMediaRight, {
            children: this.renderInsertButton()
          })]
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          filterType = _this$props3.filterType,
          type = _this$props3.type;
      var _this$state = this.state,
          tempImageUrl = _this$state.tempImageUrl,
          image = _this$state.image,
          error = _this$state.error,
          isPreloading = _this$state.isPreloading,
          isDownloadPending = _this$state.isDownloadPending,
          copyrightModalOpen = _this$state.copyrightModalOpen;
      var showImagePreview = image && (!error || error === Errors.EXTENSION_FILTER);
      return /*#__PURE__*/_jsxs(UIFlex, {
        direction: "column",
        children: [filterType !== FileExtensionFilters.NONE && /*#__PURE__*/_jsx(FilterHintMessage, {
          drawerType: type
        }), /*#__PURE__*/_jsx(UIFormControl, {
          className: "from-url-panel__url-field",
          label: I18n.text(i18nKey('imageUrl')),
          error: !!error,
          validationMessage: error ? getErrorMessage(error) : null,
          children: /*#__PURE__*/_jsx(FromUrlInput, {
            value: tempImageUrl,
            disabled: isPreloading || isDownloadPending,
            onKeyUp: this.handleKeyUp,
            onChange: this.handleUrlChange,
            onPreview: this.handlePreview
          })
        }), showImagePreview && this.renderPreview(), copyrightModalOpen && this.renderCopyrightModal()]
      });
    }
  }]);

  return FromUrlPanel;
}(Component);

FromUrlPanel.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  onInsert: PropTypes.func.isRequired,
  isDownloadPending: PropTypes.bool.isRequired,
  hasAcceptedImportCopyrightNotice: PropTypes.bool.isRequired,
  filterType: PropTypes.oneOf(Object.keys(FileExtensionFilters)),
  filteredExtensions: PropTypes.instanceOf(Immutable.Set),
  uploadedFileAccess: PropTypes.oneOf(Object.keys(DrawerFileAccess)).isRequired,
  downloadFromExternalUrl: PropTypes.func.isRequired,
  trackInteraction: PropTypes.func.isRequired,
  updatePortalMeta: PropTypes.func.isRequired
};
FromUrlPanel.defaultProps = {
  hasAcceptedImportCopyrightNotice: false
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    uploadedFileAccess: getUploadedFileAccess(state),
    isDownloadPending: getIsDownloadFromExternalUrlPending(state),
    filterType: getFilterType(state),
    filteredExtensions: getFilteredExtensions(state),
    hasAcceptedImportCopyrightNotice: getHasAcceptedImportCopyrightNotice(state)
  };
};

var mapDispatchToProps = {
  downloadFromExternalUrl: downloadFromExternalUrl,
  trackInteraction: trackInteraction,
  updatePortalMeta: updatePortalMeta
};
export default connect(mapStateToProps, mapDispatchToProps)(FromUrlPanel);