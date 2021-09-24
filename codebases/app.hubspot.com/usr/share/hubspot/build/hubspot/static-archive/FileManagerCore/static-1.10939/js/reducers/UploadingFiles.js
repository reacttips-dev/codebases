'use es6';

import Immutable from 'immutable';
import { UPLOAD_FILE_PROGRESS, UPLOAD_FILE_SUCCEEDED, UPLOAD_FILE_ATTEMPTED, UPLOAD_FILE_FAILED, SAVE_EDIT_ATTEMPTED, SAVE_EDIT_SUCCEEDED } from '../actions/ActionTypes';
import { FileTypes, ObjectCategory } from '../Constants';
import { splitNameAndExtension, getType } from '../utils/file';
var defaultState = Immutable.Map({
  files: new Immutable.OrderedMap()
});
export default function files() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      file = action.file,
      tempId = action.tempId,
      originalId = action.originalId,
      progress = action.progress,
      tempUrl = action.tempUrl,
      tempFile = action.tempFile,
      folderId = action.folderId,
      dimensions = action.dimensions;
  var nameAndExtension = tempFile ? splitNameAndExtension(tempFile) : {};

  switch (type) {
    case UPLOAD_FILE_ATTEMPTED:
      return state.setIn(['files', tempId], Immutable.Map(Object.assign({
        progress: 0,
        id: tempId,
        name: nameAndExtension.name,
        title: nameAndExtension.name,
        extension: nameAndExtension.extension,
        encoding: nameAndExtension.extension,
        type: getType(nameAndExtension.extension),
        size: tempFile.size,
        created: Date.now(),
        updated: Date.now(),
        temp: true,
        meta: Immutable.Map(),
        folder_id: folderId || null,
        tempUrl: tempUrl,
        category: ObjectCategory.FILE
      }, dimensions)));

    case SAVE_EDIT_ATTEMPTED:
      return state.setIn(['files', tempId], Immutable.Map({
        id: tempId,
        name: file.get('name'),
        title: file.get('name'),
        extension: file.get('extension'),
        type: FileTypes.IMG,
        temp: true,
        size: 0,
        url: tempUrl,
        created: Date.now(),
        updated: Date.now(),
        meta: Immutable.Map(),
        category: ObjectCategory.FILE,
        originalId: originalId
      }));

    case UPLOAD_FILE_SUCCEEDED:
    case UPLOAD_FILE_FAILED:
    case SAVE_EDIT_SUCCEEDED:
      return state.deleteIn(['files', tempId]);

    case UPLOAD_FILE_PROGRESS:
      return state.setIn(['files', tempId, 'progress'], progress);

    default:
      return state;
  }
}