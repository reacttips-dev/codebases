'use es6';

import Immutable from 'immutable';
import { IMAGE_TO_EDIT_SELECTED, IMAGE_TO_EDIT_DESELECTED, UPLOAD_EDITED_IMAGE_ATTEMPTED, UPLOAD_EDITED_IMAGE_FAILED, UPLOAD_EDITED_IMAGE_SUCCEEDED } from '../actions/ActionTypes';
import { ImageEditorLocations, RequestStatus } from '../Constants';
import { getDefaultEditedImageName } from '../utils/ImageEditor';
var defaultState = Immutable.Map({
  imgToEditSelected: false,
  selectedImgFrom: ImageEditorLocations.DRAWER,
  imgSrc: '',
  imgHeight: 0,
  imgWidth: 0,
  fileName: '',
  fileId: null,
  fileFolderId: null,
  updateRequestStatus: RequestStatus.UNINITIALIZED
});
export default function EditAndCreateImage() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      file = action.file,
      selectedImgFrom = action.selectedImgFrom;

  switch (type) {
    case UPLOAD_EDITED_IMAGE_ATTEMPTED:
      return state.set('updateRequestStatus', RequestStatus.PENDING);

    case UPLOAD_EDITED_IMAGE_FAILED:
      return state.set('updateRequestStatus', RequestStatus.FAILED);

    case UPLOAD_EDITED_IMAGE_SUCCEEDED:
      return state.merge({
        updateRequestStatus: RequestStatus.SUCCEEDED
      });

    case IMAGE_TO_EDIT_SELECTED:
      return state.merge({
        imgToEditSelected: true,
        selectedImgFrom: selectedImgFrom || state.get('selectedImgFrom'),
        imgSrc: file.get('url'),
        fileId: file.get('id'),
        fileFolderId: file.get('folder_id'),
        fileName: file.get('name') || getDefaultEditedImageName(),
        imgHeight: file.get('height'),
        imgWidth: file.get('width'),
        encoding: file.get('encoding')
      });

    case IMAGE_TO_EDIT_DESELECTED:
      return defaultState;

    default:
      return state;
  }
}