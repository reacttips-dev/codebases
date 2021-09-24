'use es6';

import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIPanelNavigator from 'UIComponents/panel/UIPanelNavigator';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import { mapProp } from 'FileManagerCore/constants/propTypes';
import { logNewRelicPageAction } from 'FileManagerCore/utils/logging';
import { Panels, DrawerTypes, PickerTypes } from '../../Constants';
import { getActivePanel, getPreviousPanel, getSearchQuery, getSelectedFileInPanel, getSelectedFolderInPanel, getSelectedStockFile } from '../../selectors/Panel';
import * as Actions from '../../actions/Actions';
import * as FileActions from '../../actions/Files';
import usePrevious from '../../components/hooks/usePrevious';
import FromUrlPanel from '../../containers/browser/FromUrlPanelContainer';
import BulkImportFromUrlPanel from '../../components/image-import/BulkImportFromUrlPanel';
import PanelBody from './PanelBody';
import ImageEditorContainer from './ImageEditorContainer';
import FileDetailsPanel from './FileDetailsPanel';
import { fireEvent } from './utils';
import { getIsSelectedSingleFileFetched } from '../../selectors/Files';
import { getDefaultPanelWidth } from '../../selectors/Tiles';
var PANEL_KEY_FOR_PREVIOUS_BUTTON = 'PANEL_KEY_FOR_PREVIOUS_BUTTON';

var getI18nKey = function getI18nKey(suffix) {
  return "FileManagerLib.panelNavigator." + suffix;
};

var PanelNavigator = function PanelNavigator(_ref) {
  var activePanel = _ref.activePanel,
      disableUpload = _ref.disableUpload,
      onClose = _ref.onClose,
      onSelect = _ref.onSelect,
      pickerType = _ref.pickerType,
      selectedFile = _ref.selectedFile,
      selectedFolder = _ref.selectedFolder,
      selectedStockFile = _ref.selectedStockFile,
      isSingleFileFetched = _ref.isSingleFileFetched,
      searchQuery = _ref.searchQuery,
      type = _ref.type,
      rootNode = _ref.rootNode,
      dropdownClassName = _ref.dropdownClassName,
      panelWidth = _ref.panelWidth,
      isWithinPanel = _ref.isWithinPanel,
      returnToPrevious = _ref.returnToPrevious,
      handleInsertFile = _ref.handleInsertFile,
      fetchFilesForNavigator = _ref.fetchFilesForNavigator,
      hasPreviousPanel = _ref.hasPreviousPanel,
      filePickerDidMount = _ref.filePickerDidMount,
      parentComponentName = _ref.parentComponentName,
      withBulkImageImport = _ref.withBulkImageImport;

  if (selectedFile || selectedStockFile) {
    activePanel = Panels.FILE_DETAIL;
  } else if (activePanel !== Panels.FROM_URL && activePanel !== Panels.BULK_IMPORT_FROM_URL) {
    activePanel = Panels.BROWSE;
  }

  var previousSelectedFileId = usePrevious(selectedFile ? selectedFile.get('id') : null);

  var onInsert = function onInsert(file) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        target = _ref2.target;

    handleInsertFile(file, onSelect, {
      type: type,
      target: target
    });
  };

  var handleClose = function handleClose(e) {
    // these can bubble to other apps and cause issues if Picker is mounted within a clickable element
    e.stopPropagation();
    onClose(e);
  };

  var passedPanelProps = {
    disableUpload: disableUpload,
    type: type,
    dropdownClassName: dropdownClassName,
    onInsert: onInsert,
    previousSelectedFileId: previousSelectedFileId,
    withBulkImageImport: withBulkImageImport,
    isWithinPanel: isWithinPanel
  };
  useEffect(function () {
    filePickerDidMount(type, {
      pickerType: pickerType,
      panelWidth: panelWidth
    });
    fireEvent('FileManagerLib:Drawer:open');
    logNewRelicPageAction('mount', {
      componentName: 'PanelNavigator',
      drawerType: type,
      pickerType: pickerType,
      parentComponentName: parentComponentName
    });
    return function () {
      fireEvent('FileManagerLib:Drawer:close');
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(function () {
    fetchFilesForNavigator({
      type: type,
      searchQuery: searchQuery,
      selectedFolder: selectedFolder
    });
  }, [selectedFolder, searchQuery, type, fetchFilesForNavigator]);

  var renderHeader = function renderHeader() {
    if (isWithinPanel) {
      return null;
    }

    var headerKey = getI18nKey("header.browse." + type);

    if (activePanel === Panels.FILE_DETAIL) {
      headerKey = getI18nKey('header.fileDetail');
    } else if (activePanel === Panels.FROM_URL || activePanel === Panels.BULK_IMPORT_FROM_URL) {
      headerKey = getI18nKey('header.fromUrl');
    }

    return /*#__PURE__*/_jsxs(UIPanelHeader, {
      "data-test-id": "file-picker-panel-header",
      children: [/*#__PURE__*/_jsx("h3", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: headerKey
        })
      }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: handleClose,
        "data-test-id": "file-picker-panel-close"
      })]
    });
  };

  var getPanelWidth = function getPanelWidth() {
    return panelWidth || getDefaultPanelWidth();
  };

  if (isWithinPanel) {
    if (activePanel === Panels.FILE_DETAIL) {
      return /*#__PURE__*/_jsx(_Fragment, {
        children: /*#__PURE__*/_jsx(FileDetailsPanel, Object.assign({}, passedPanelProps, {
          selectedFile: selectedFile,
          selectedStockFile: selectedStockFile,
          isSingleFileFetched: isSingleFileFetched,
          returnToPrevious: returnToPrevious
        }))
      });
    }

    return /*#__PURE__*/_jsx(PanelBody, Object.assign({}, passedPanelProps));
  }

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(UIPanelNavigator, {
      className: "file-picker-panel",
      rootNode: rootNode,
      modal: pickerType === PickerTypes.SIDE_MODAL,
      currentPanel: activePanel,
      onPreviousClick: returnToPrevious,
      panelOrder: hasPreviousPanel ? [PANEL_KEY_FOR_PREVIOUS_BUTTON] : null,
      children: [/*#__PURE__*/_jsxs(UIPanel, {
        panelKey: Panels.BROWSE,
        width: getPanelWidth(),
        children: [renderHeader(), /*#__PURE__*/_jsx(PanelBody, Object.assign({}, passedPanelProps))]
      }), /*#__PURE__*/_jsxs(UIPanel, {
        panelKey: Panels.FROM_URL,
        width: getPanelWidth(),
        children: [renderHeader(), /*#__PURE__*/_jsx(UIPanelBody, {
          children: /*#__PURE__*/_jsx(UIPanelSection, {
            className: "flex-column",
            children: /*#__PURE__*/_jsx(FromUrlPanel, Object.assign({}, passedPanelProps))
          })
        })]
      }), /*#__PURE__*/_jsxs(UIPanel, {
        panelKey: Panels.BULK_IMPORT_FROM_URL,
        width: getPanelWidth(),
        children: [renderHeader(), /*#__PURE__*/_jsx(UIPanelBody, {
          children: /*#__PURE__*/_jsx(BulkImportFromUrlPanel, Object.assign({}, passedPanelProps))
        })]
      }), /*#__PURE__*/_jsxs(UIPanel, {
        panelKey: Panels.FILE_DETAIL,
        width: getPanelWidth(),
        children: [renderHeader(), /*#__PURE__*/_jsx(FileDetailsPanel, Object.assign({}, passedPanelProps, {
          selectedFile: selectedFile,
          selectedStockFile: selectedStockFile,
          isSingleFileFetched: isSingleFileFetched,
          returnToPrevious: returnToPrevious
        }))]
      })]
    }), type === DrawerTypes.IMAGE && /*#__PURE__*/_jsx(ImageEditorContainer, {})]
  });
};

var reduxPropTypes = {
  activePanel: PropTypes.oneOf(Object.keys(Panels)).isRequired,
  selectedFile: mapProp,
  selectedFolder: mapProp,
  searchQuery: PropTypes.string,
  hasPreviousPanel: PropTypes.bool.isRequired,
  handleInsertFile: PropTypes.func.isRequired,
  returnToPrevious: PropTypes.func.isRequired
};
PanelNavigator.displayName = 'PanelNavigator';
PanelNavigator.propTypes = Object.assign({
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  pickerType: PropTypes.oneOf(Object.keys(PickerTypes)).isRequired,
  disableUpload: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  rootNode: PropTypes.object,
  dropdownClassName: PropTypes.string,
  parentComponentName: PropTypes.string,
  panelWidth: PropTypes.number
}, reduxPropTypes);
PanelNavigator.defaultProps = {
  pickerType: PickerTypes.PANEL,
  disableUpload: false
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    activePanel: getActivePanel(state),
    selectedFile: getSelectedFileInPanel(state),
    selectedStockFile: getSelectedStockFile(state),
    isSingleFileFetched: getIsSelectedSingleFileFetched(state),
    selectedFolder: getSelectedFolderInPanel(state),
    searchQuery: getSearchQuery(state),
    hasPreviousPanel: Boolean(getPreviousPanel(state))
  };
};

var mapDispatchToProps = {
  handleInsertFile: Actions.handleInsertFile,
  filePickerDidMount: Actions.filePickerDidMount,
  returnToPrevious: Actions.returnToPrevious,
  fetchFilesForNavigator: FileActions.fetchFilesForNavigator
};
export default connect(mapStateToProps, mapDispatchToProps)(PanelNavigator);