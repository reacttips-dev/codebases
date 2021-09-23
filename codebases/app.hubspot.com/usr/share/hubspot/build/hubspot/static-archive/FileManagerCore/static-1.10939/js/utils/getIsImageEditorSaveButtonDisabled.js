'use es6';

export default function getIsImageEditorSaveButtonDisabled(_ref) {
  var cropperMode = _ref.cropperMode,
      unsavedImgWidth = _ref.unsavedImgWidth,
      cropperWidth = _ref.cropperWidth,
      cropperHeight = _ref.cropperHeight;
  return !cropperMode || cropperMode === 'resize' && !unsavedImgWidth || cropperMode === 'crop' && (cropperHeight <= 0 || cropperWidth <= 0);
}