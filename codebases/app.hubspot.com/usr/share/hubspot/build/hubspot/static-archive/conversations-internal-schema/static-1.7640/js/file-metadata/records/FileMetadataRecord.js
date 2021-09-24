'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';

var FileMetadataRecord = /*#__PURE__*/function (_Record) {
  _inherits(FileMetadataRecord, _Record);

  function FileMetadataRecord() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, FileMetadataRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileMetadataRecord).call(this, Object.assign({}, properties, {
      fileSize: properties.fileSize || properties.size || 0
    })));
  }

  return FileMetadataRecord;
}(Record({
  expiresAt: 0,
  url: '',
  name: '',
  extension: '',
  type: '',
  fileSize: 0,
  width: null,
  height: null
}, 'FileMetadataRecord'));

export default FileMetadataRecord;