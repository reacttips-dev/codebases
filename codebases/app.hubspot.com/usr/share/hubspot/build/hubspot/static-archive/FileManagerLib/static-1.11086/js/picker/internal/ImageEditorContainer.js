'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ImageEditorLocations } from 'FileManagerCore/Constants';
import { getDeselectImageToEditAction, uploadEditedImage, uploadResizedImage } from 'FileManagerCore/actions/Files';
import { getSelectedImageFrom, getSelectedImageToEdit } from 'FileManagerCore/selectors/EditAndCreateImage';
import ImageEditor from 'FileManagerCore/components/ImageEditor';
import { DrawerFileAccess } from '../../enums/FileAccess';
import { getUploadedFileAccess } from '../../selectors/Configuration';

var ImageEditorContainer = function ImageEditorContainer(_ref) {
  var imageToEdit = _ref.imageToEdit,
      selectedImageFrom = _ref.selectedImageFrom,
      uploadedFileAccess = _ref.uploadedFileAccess,
      onClose = _ref.onClose,
      props = _objectWithoutProperties(_ref, ["imageToEdit", "selectedImageFrom", "uploadedFileAccess", "onClose"]);

  if (!(imageToEdit && selectedImageFrom === ImageEditorLocations.DRAWER)) {
    return null;
  }

  var handleCropSave = function handleCropSave(file, fileName, folderId) {
    props.uploadEditedImage(file, fileName, folderId, uploadedFileAccess);
  };

  var handleResizeSave = function handleResizeSave(fileId, newWidth) {
    props.uploadResizedImage(fileId, newWidth, uploadedFileAccess);
  };

  return /*#__PURE__*/_jsx(ImageEditor, {
    onClose: onClose,
    onCropSave: handleCropSave,
    onResizeSave: handleResizeSave
  });
};

ImageEditorContainer.propTypes = {
  imageToEdit: PropTypes.bool.isRequired,
  selectedImageFrom: PropTypes.string.isRequired,
  uploadEditedImage: PropTypes.func.isRequired,
  uploadResizedImage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  uploadedFileAccess: PropTypes.oneOf(Object.keys(DrawerFileAccess)).isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    imageToEdit: getSelectedImageToEdit(state),
    selectedImageFrom: getSelectedImageFrom(state),
    uploadedFileAccess: getUploadedFileAccess(state)
  };
};

var mapDispatchToProps = {
  onClose: getDeselectImageToEditAction,
  uploadEditedImage: uploadEditedImage,
  uploadResizedImage: uploadResizedImage
};
export default connect(mapStateToProps, mapDispatchToProps)(ImageEditorContainer);