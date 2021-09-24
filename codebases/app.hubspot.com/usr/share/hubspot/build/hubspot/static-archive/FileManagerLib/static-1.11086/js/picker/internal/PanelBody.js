'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import UIOptimisticNanoProgress from 'UIComponents/progress/UIOptimisticNanoProgress';
import { RequestStatus } from 'FileManagerCore/Constants';
import { mapProp } from 'FileManagerCore/constants/propTypes';
import { getFetchFilesRequestStatus } from 'FileManagerCore/selectors/Files';
import FileDragAndDrop from 'FileManagerCore/components/FileDragAndDrop';
import DragAndDropOverlay from 'FileManagerCore/components/DragAndDropOverlay';
import { getShouldShowVidyardInitialState } from 'FileManagerCore/selectors/PortalMeta';
import { getIsReadOnly } from 'FileManagerCore/selectors/Permissions';
import { getAreFilesUploading } from 'FileManagerCore/selectors/UploadingFiles';
import { logNewRelicPageAction } from 'FileManagerCore/utils/logging';
import { DrawerTypes, PICKER_FOLDER_CLASSNAME } from '../../Constants';
import { trackInteraction } from '../../actions/Actions';
import { uploadFiles } from '../../actions/Files';
import { getIsHublPanelOpenAndUserOverEmbeddableVideoLimit } from '../../selectors/Limits';
import { getSelectedFolderInPanel } from '../../selectors/Panel';
import ActivePanel from '../../components/browser/ActivePanel';
import Footer from '../../components/browser/Footer';
var StyledPanelBody = styled(UIPanelSection).withConfig({
  displayName: "PanelBody__StyledPanelBody",
  componentId: "goqrs5-0"
})(["display:flex;flex-direction:column;flex-grow:1;height:100%;position:relative;"]);

var PanelBody = function PanelBody(_ref) {
  var type = _ref.type,
      disableUpload = _ref.disableUpload,
      dropdownClassName = _ref.dropdownClassName,
      onInsert = _ref.onInsert,
      selectedFolder = _ref.selectedFolder,
      isFetchingFiles = _ref.isFetchingFiles,
      previousSelectedFileId = _ref.previousSelectedFileId,
      shouldShowVidyardInitialState = _ref.shouldShowVidyardInitialState,
      hasExceededVideoLimit = _ref.hasExceededVideoLimit,
      isReadOnly = _ref.isReadOnly,
      areFilesUploading = _ref.areFilesUploading,
      props = _objectWithoutProperties(_ref, ["type", "disableUpload", "dropdownClassName", "onInsert", "selectedFolder", "isFetchingFiles", "previousSelectedFileId", "shouldShowVidyardInitialState", "hasExceededVideoLimit", "isReadOnly", "areFilesUploading"]);

  var handleDropFiles = function handleDropFiles(files) {
    props.uploadFiles(files, {
      folderId: selectedFolder ? selectedFolder.get('id') : null
    });
    props.trackInteraction('Manage Files', 'drag-and-dropped-file', {
      target: 'panel-body',
      withPanelNavigator: true
    });
    logNewRelicPageAction('dropFiles', {
      componentName: 'PanelNavigator',
      target: 'panel-body',
      drawerType: type
    });
  };

  var isPanelInactive = type === DrawerTypes.HUBL_VIDEO && shouldShowVidyardInitialState;
  var hideFooter = disableUpload || isPanelInactive;
  var areUploadsDisabled = disableUpload || isReadOnly || isPanelInactive || hasExceededVideoLimit;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(FileDragAndDrop, {
      disabled: areUploadsDisabled,
      ignoreTargetSelector: "." + PICKER_FOLDER_CLASSNAME,
      onDropFiles: handleDropFiles,
      children: function children(fileDropProps) {
        return /*#__PURE__*/_jsxs(StyledPanelBody, Object.assign({}, fileDropProps, {
          "data-test-id": "file-picker-panel-body",
          "data-uploading": areFilesUploading,
          "data-files-loading": isFetchingFiles,
          children: [/*#__PURE__*/_jsx(ActivePanel, {
            type: type,
            disableUpload: disableUpload,
            onInsert: onInsert,
            previousSelectedFileId: previousSelectedFileId,
            isPanelInactive: isPanelInactive
          }), /*#__PURE__*/_jsx(DragAndDropOverlay, {
            isOver: fileDropProps.isOver
          }), isFetchingFiles && /*#__PURE__*/_jsx(UIOptimisticNanoProgress, {})]
        }));
      }
    }), !hideFooter && /*#__PURE__*/_jsx(UIPanelFooter, {
      children: /*#__PURE__*/_jsx(Footer, {
        type: type,
        disableUpload: disableUpload,
        dropdownClassName: dropdownClassName,
        withBulkImageImport: props.withBulkImageImport
      })
    })]
  });
};

var reduxPropTypes = {
  selectedFolder: mapProp,
  uploadFiles: PropTypes.func.isRequired,
  areFilesUploading: PropTypes.bool.isRequired,
  isFetchingFiles: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  hasExceededVideoLimit: PropTypes.bool.isRequired,
  shouldShowVidyardInitialState: PropTypes.bool.isRequired
};
PanelBody.propTypes = Object.assign({
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  disableUpload: PropTypes.bool.isRequired,
  onInsert: PropTypes.func.isRequired,
  previousSelectedFileId: PropTypes.number
}, reduxPropTypes);

var mapStateToProps = function mapStateToProps(state, _ref2) {
  var type = _ref2.type;
  return {
    selectedFolder: getSelectedFolderInPanel(state),
    areFilesUploading: getAreFilesUploading(state),
    isFetchingFiles: getFetchFilesRequestStatus(state) === RequestStatus.PENDING,
    isReadOnly: getIsReadOnly(state),
    hasExceededVideoLimit: getIsHublPanelOpenAndUserOverEmbeddableVideoLimit(state, {
      type: type
    }),
    shouldShowVidyardInitialState: getShouldShowVidyardInitialState(state)
  };
};

var mapDispatchToProps = {
  uploadFiles: uploadFiles,
  trackInteraction: trackInteraction
};
export default connect(mapStateToProps, mapDispatchToProps)(PanelBody);