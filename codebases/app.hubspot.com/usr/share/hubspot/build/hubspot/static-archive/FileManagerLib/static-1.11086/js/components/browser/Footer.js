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
import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIButton from 'UIComponents/button/UIButton';
import UIFileButton from 'UIComponents/button/UIFileButton';
import CanvaButton from 'FileManagerCore/components/CanvaButton';
import { uploadFiles } from '../../actions/Files';
import { Panels, DrawerTypes, DrawerTypesToExtensions } from '../../Constants';
import { setPanel, trackInteraction } from '../../actions/Actions';
import { acquireFileFromCanva } from 'FileManagerCore/actions/Canva';
import { CANVA_TEMPLATES } from 'FileManagerCore/constants/Canva';
import { getEmbeddableVideoLimit, getHasUserExceededEmbeddableVideoLimit } from 'FileManagerCore/selectors/Limits';
import { getActivePanel, getSelectedFolderInPanel } from '../../selectors/Panel';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { getRedirectToFilesLocation } from '../../utils/network';
import { isVideoDrawerType } from '../../utils/hubLVideo';
import { getHasCanvaIntegrationScope, getIsUngatedForCanva } from 'FileManagerCore/selectors/Auth';
import { getIsReadOnly } from 'FileManagerCore/selectors/Permissions';
import ScopedFeatureTooltip from 'FileManagerCore/components/permissions/ScopedFeatureTooltip';
import CanvaCreateDisabledButton from 'FileManagerCore/components/CanvaCreateDisabledButton';
import { getIsCanvaEnabled, getSpecificCanvaTemplates, getUploadedFileAccess } from '../../selectors/Configuration';
import { DrawerFileAccess } from '../../enums/FileAccess';

function getVideoLimitI18nKey(suffix) {
  return "FileManagerLib.videoLimit.uploadVideosDisabledTooltip." + suffix;
}

var Footer = /*#__PURE__*/function (_Component) {
  _inherits(Footer, _Component);

  function Footer(props) {
    var _this;

    _classCallCheck(this, Footer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Footer).call(this, props));
    _this.state = {
      dropdownOpen: false
    };
    _this.handleUpload = _this.handleUpload.bind(_assertThisInitialized(_this));
    _this.handleFromUrl = _this.handleFromUrl.bind(_assertThisInitialized(_this));
    _this.handleOpenChange = _this.handleOpenChange.bind(_assertThisInitialized(_this));
    _this.handleUploadClick = _this.handleUploadClick.bind(_assertThisInitialized(_this));
    _this.handleCanvaImport = _this.handleCanvaImport.bind(_assertThisInitialized(_this));

    if (props.dropdownClassName) {
      console.warn("Warning: Usage of the prop `dropdownClassName` should NOT be used for styling purposes. You can ignore this if you're using the className for a different purpose like namespacing.");
    }

    return _this;
  }

  _createClass(Footer, [{
    key: "getButtonText",
    value: function getButtonText() {
      var type = this.props.type;

      switch (type) {
        case DrawerTypes.IMAGE:
          return I18n.text('FileManagerLib.actions.addImage');

        case DrawerTypes.VIDEO:
        case DrawerTypes.HUBL_VIDEO:
          return I18n.text('FileManagerLib.actions.addVideo');

        case DrawerTypes.DOCUMENT:
          return I18n.text('FileManagerLib.actions.addDocument');

        default:
          return I18n.text('FileManagerLib.actions.addFile');
      }
    }
  }, {
    key: "getAcceptedFileInputs",
    value: function getAcceptedFileInputs() {
      var type = this.props.type;

      switch (type) {
        case DrawerTypes.IMAGE:
          return ['image/*'];

        case DrawerTypes.VIDEO:
        case DrawerTypes.HUBL_VIDEO:
          return ['video/*'];

        case DrawerTypes.DOCUMENT:
          return DrawerTypesToExtensions.get(DrawerTypes.DOCUMENT).map(function (item) {
            return "." + item;
          }).toArray();

        default:
          return [];
      }
    }
  }, {
    key: "handleCanvaImport",
    value: function handleCanvaImport(_ref) {
      var canvaDesignId = _ref.canvaDesignId,
          fileUrl = _ref.fileUrl,
          fileName = _ref.fileName;
      this.props.onAcquireFromCanva({
        canvaDesignId: canvaDesignId,
        fileUrl: fileUrl,
        fileName: fileName,
        folder: this.props.selectedFolder,
        uploadedFileAccess: this.props.uploadedFileAccess
      });
    }
  }, {
    key: "handleOpenChange",
    value: function handleOpenChange(event) {
      this.setState({
        dropdownOpen: event.target.value
      });
    }
  }, {
    key: "handleUpload",
    value: function handleUpload(event) {
      var _this$props = this.props,
          selectedFolder = _this$props.selectedFolder,
          onUploadFiles = _this$props.onUploadFiles,
          type = _this$props.type,
          activePanel = _this$props.activePanel,
          onSetPanel = _this$props.onSetPanel;
      var files = event.target.files;

      if (!files || files.length === 0) {
        return;
      }

      onUploadFiles(files, selectedFolder, type);

      if (activePanel === Panels.FROM_URL || activePanel === Panels.BULK_IMPORT_FROM_URL || activePanel === Panels.SEARCH) {
        onSetPanel(Panels.BROWSE);
      }
    }
  }, {
    key: "handleUploadClick",
    value: function handleUploadClick() {
      this._file.click();
    }
  }, {
    key: "handleFromUrl",
    value: function handleFromUrl() {
      var _this$props2 = this.props,
          onSetPanel = _this$props2.onSetPanel,
          withBulkImageImport = _this$props2.withBulkImageImport;

      if (withBulkImageImport) {
        onSetPanel(Panels.BULK_IMPORT_FROM_URL);
      } else {
        onSetPanel(Panels.FROM_URL);
      }
    }
  }, {
    key: "shouldRenderCanvaButton",
    value: function shouldRenderCanvaButton() {
      var _this$props3 = this.props,
          type = _this$props3.type,
          hasCanvaIntegrationScope = _this$props3.hasCanvaIntegrationScope,
          isUngatedForCanva = _this$props3.isUngatedForCanva,
          isCanvaEnabled = _this$props3.isCanvaEnabled;
      return hasCanvaIntegrationScope && isUngatedForCanva && isCanvaEnabled && !isVideoDrawerType(type);
    }
  }, {
    key: "renderReadOnlyUploadButton",
    value: function renderReadOnlyUploadButton() {
      return /*#__PURE__*/_jsx(ScopedFeatureTooltip, {
        children: /*#__PURE__*/_jsx(UIButton, {
          buttonUse: "tertiary-light",
          "data-test-id": "drawer-upload-button-disabled",
          disabled: true,
          children: this.getButtonText()
        })
      });
    }
  }, {
    key: "renderDropdown",
    value: function renderDropdown() {
      var _this2 = this;

      var dropdownOpen = this.state.dropdownOpen;
      var _this$props4 = this.props,
          type = _this$props4.type,
          dropdownClassName = _this$props4.dropdownClassName,
          isReadOnly = _this$props4.isReadOnly;

      if (isReadOnly) {
        return this.renderReadOnlyUploadButton();
      } else if (isVideoDrawerType(type)) {
        return this.renderUploadVideoButton();
      }

      return /*#__PURE__*/_jsxs("div", {
        "data-test-id": "drawer-footer-upload",
        children: [/*#__PURE__*/_jsx("input", {
          className: "hidden",
          ref: function ref(_ref2) {
            _this2._file = _ref2;
          },
          type: "file",
          accept: this.getAcceptedFileInputs(),
          multiple: true,
          onChange: this.handleUpload
        }), /*#__PURE__*/_jsx(UIDropdown, {
          open: dropdownOpen,
          buttonUse: "tertiary-light",
          buttonText: this.getButtonText(),
          onOpenChange: this.handleOpenChange,
          dropdownClassName: dropdownClassName,
          "data-test-id": "drawer-upload-dropdown",
          children: /*#__PURE__*/_jsxs(UIList, {
            children: [/*#__PURE__*/_jsxs(UILink, {
              onClick: this.handleUploadClick,
              children: [/*#__PURE__*/_jsx(UIIcon, {
                className: "m-right-2",
                name: "upload"
              }), I18n.text('FileManagerCore.actions.uploadFiles')]
            }), type === DrawerTypes.IMAGE && /*#__PURE__*/_jsxs(UILink, {
              onClick: this.handleFromUrl,
              children: [/*#__PURE__*/_jsx(UIIcon, {
                className: "m-right-2",
                name: "link"
              }), I18n.text('FileManagerLib.actions.addFromUrl')]
            })]
          })
        })]
      });
    }
  }, {
    key: "renderDisabledVideoButtonTooltip",
    value: function renderDisabledVideoButtonTooltip(button, limit) {
      return /*#__PURE__*/_jsx(UITooltip, {
        placement: "top",
        title: /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: getVideoLimitI18nKey('message'),
          options: {
            limit: limit,
            filesLink: /*#__PURE__*/_jsx(UILink, {
              href: getRedirectToFilesLocation(),
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: getVideoLimitI18nKey('filesLink')
              })
            }, "link-to-files")
          }
        }),
        children: button
      });
    }
  }, {
    key: "renderUploadVideoButton",
    value: function renderUploadVideoButton() {
      var _this$props5 = this.props,
          videoLimit = _this$props5.videoLimit,
          hasExceededEmbeddableVideoLimit = _this$props5.hasExceededEmbeddableVideoLimit;

      var button = /*#__PURE__*/_jsx(UIFileButton, {
        use: "tertiary-light",
        size: "small",
        disabled: hasExceededEmbeddableVideoLimit,
        accept: this.getAcceptedFileInputs(),
        multiple: true,
        onChange: this.handleUpload,
        children: I18n.text('FileManagerCore.actions.uploadVideos')
      });

      if (hasExceededEmbeddableVideoLimit) {
        return this.renderDisabledVideoButtonTooltip(button, videoLimit);
      }

      return button;
    }
  }, {
    key: "renderCanvaButton",
    value: function renderCanvaButton() {
      var _this$props6 = this.props,
          specificCanvaTemplates = _this$props6.specificCanvaTemplates,
          isReadOnly = _this$props6.isReadOnly;

      if (!this.shouldRenderCanvaButton()) {
        return null;
      }

      if (isReadOnly) {
        return /*#__PURE__*/_jsx(CanvaCreateDisabledButton, {});
      }

      return /*#__PURE__*/_jsx(CanvaButton, {
        specificCanvaTemplates: specificCanvaTemplates,
        handleCanvaImport: this.handleCanvaImport
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs("div", {
        className: "flex-row",
        children: [this.renderDropdown(), this.renderCanvaButton()]
      });
    }
  }]);

  return Footer;
}(Component);

Footer.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  selectedFolder: PropTypes.instanceOf(ImmutableMap),
  activePanel: PropTypes.oneOf(Object.keys(Panels)).isRequired,
  onSetPanel: PropTypes.func.isRequired,
  onUploadFiles: PropTypes.func.isRequired,
  onAcquireFromCanva: PropTypes.func.isRequired,
  hasCanvaIntegrationScope: PropTypes.bool.isRequired,
  isCanvaEnabled: PropTypes.bool.isRequired,
  isUngatedForCanva: PropTypes.bool.isRequired,
  hasExceededEmbeddableVideoLimit: PropTypes.bool.isRequired,
  videoLimit: PropTypes.number.isRequired,
  dropdownClassName: PropTypes.string,
  specificCanvaTemplates: PropTypes.arrayOf(PropTypes.oneOf(CANVA_TEMPLATES)),
  isReadOnly: PropTypes.bool.isRequired,
  uploadedFileAccess: PropTypes.oneOf(Object.keys(DrawerFileAccess)),
  withBulkImageImport: PropTypes.bool
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedFolder: getSelectedFolderInPanel(state),
    activePanel: getActivePanel(state),
    hasCanvaIntegrationScope: getHasCanvaIntegrationScope(state),
    isCanvaEnabled: getIsCanvaEnabled(state),
    isUngatedForCanva: getIsUngatedForCanva(state),
    videoLimit: getEmbeddableVideoLimit(state),
    hasExceededEmbeddableVideoLimit: getHasUserExceededEmbeddableVideoLimit(state),
    specificCanvaTemplates: getSpecificCanvaTemplates(state),
    isReadOnly: getIsReadOnly(state),
    uploadedFileAccess: getUploadedFileAccess(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onUploadFiles: function onUploadFiles(files, folder, type) {
      var options = {
        type: type
      };

      if (folder && folder.get('id')) {
        options.folderId = folder.get('id');
      }

      dispatch(uploadFiles(files, options));
      dispatch(trackInteraction('Manage Files', 'upload'));
    },
    onSetPanel: function onSetPanel(activePanel) {
      dispatch(setPanel({
        activePanel: activePanel
      }));
    },
    onAcquireFromCanva: function onAcquireFromCanva(_ref3) {
      var canvaDesignId = _ref3.canvaDesignId,
          fileUrl = _ref3.fileUrl,
          folder = _ref3.folder,
          fileName = _ref3.fileName,
          uploadedFileAccess = _ref3.uploadedFileAccess;
      dispatch(acquireFileFromCanva({
        canvaDesignId: canvaDesignId,
        fileUrl: fileUrl,
        folder: folder,
        fileName: fileName,
        uploadedFileAccess: uploadedFileAccess
      }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);