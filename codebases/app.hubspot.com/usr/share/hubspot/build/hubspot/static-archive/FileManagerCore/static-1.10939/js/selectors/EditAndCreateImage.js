'use es6';

export var getSelectedImageToEdit = function getSelectedImageToEdit(state) {
  return state.editAndCreateImage.get('imgToEditSelected');
};
export var getSelectedImageFrom = function getSelectedImageFrom(state) {
  return state.editAndCreateImage.get('selectedImgFrom');
};
export var getImageSrc = function getImageSrc(state) {
  return state.editAndCreateImage.get('imgSrc');
};
export var getFileToEditId = function getFileToEditId(state) {
  return state.editAndCreateImage.get('fileId');
};
export var getFileToEditName = function getFileToEditName(state) {
  return state.editAndCreateImage.get('fileName');
};
export var getFolderId = function getFolderId(state) {
  return state.editAndCreateImage.get('fileFolderId');
};
export var getImageHeight = function getImageHeight(state) {
  return state.editAndCreateImage.get('imgHeight');
};
export var getImageWidth = function getImageWidth(state) {
  return state.editAndCreateImage.get('imgWidth');
};
export var getEditImageRequestStatus = function getEditImageRequestStatus(state) {
  return state.editAndCreateImage.get('updateRequestStatus');
};
export var getImageEncoding = function getImageEncoding(state) {
  return state.editAndCreateImage.get('encoding');
};
export var getImageAspectRatio = function getImageAspectRatio(state) {
  return getImageWidth(state) / getImageHeight(state);
};