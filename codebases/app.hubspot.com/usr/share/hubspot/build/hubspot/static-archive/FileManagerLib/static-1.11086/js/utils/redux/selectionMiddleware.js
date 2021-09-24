'use es6';

import { UPLOAD_EDITED_IMAGE_SUCCEEDED } from 'FileManagerCore/actions/ActionTypes';
import { selectFile } from '../../actions/Actions';
export default (function (_ref) {
  var dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      var result = next(action);

      switch (result.type) {
        case UPLOAD_EDITED_IMAGE_SUCCEEDED:
          dispatch(selectFile(result.file));
          break;

        default:
          break;
      }

      return result;
    };
  };
});